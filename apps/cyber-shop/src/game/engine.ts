import { ITEMS, CATEGORIES, FAULTS, CHARACTERS, SKILLS, EQUIPMENT, CERTIFICATES, EVENTS, QUESTS, THEMES, PROFESSIONS } from '../content';
import { BALANCE, CHALLENGES, CONTENT_VERSION, SAVE_VERSION } from './balance';
import { fits, occupy, footprint, counterLayout, SURFACE_CAPACITY, SURFACE_COLUMNS } from './warehouse';
import { visitorGreeting } from './narrative';
import { deliveryJobs, newDeliveryDay, deliveryDefinition, deliveryItemCheck, DELIVERY_HOURS, DELIVERY_LIMIT } from './deliveries';
import { containerLayout, containerItems, containerTrail, ownedObjects, rootLayout, shopCounterLayout, objectFits, putObject, nestingProblem, canReceive, itemAccessible, LABELER_PRICE, LABEL_COLORS, validContainerLabel } from './containers';
import { STORAGE_STYLES, storageStyle } from '../content/storage';
import { modifierEffect, validModifiers, dailyHours, wholesaleFactor, foodShelfLife } from './modifiers';
import { allocateQuote } from './negotiation';
import {buyerRemaining,purchaseQuantity,fulfillDemand} from './demand';
import {faction,type FactionId} from '../content/factions';
import {factionFor,buyerPreference,trusted,recordTradeRelation,factionStoragePrice,factionVisit,factionKnown,factionContacts,CONTACT_RELATION} from './factions';
import type { Action, ActionResult, CategoryId, CertificateId, EquipmentDefinition, GameState, ItemDefinition, ItemInstance, PresentationEvent, RepairOrder, Visitor, StorageContainer } from './types';

const clone = <T>(value: T): T => structuredClone(value);
const clamp = (v: number, min: number, max: number) => Math.max(min, Math.min(max, v));
const round = (v: number) => Math.max(0, Math.round(v));
const def = (item: ItemInstance): ItemDefinition => ITEMS.find(d => d.id === item.definitionId)!;
const equipmentId = (effect: string) => EQUIPMENT.find(e => e.effect === effect)?.id ?? effect;
const ownedEquipment = (s: GameState, effect: string) => s.equipment[equipmentId(effect)] ?? 0;
export const skillEffect = (s: GameState, effect: string) => SKILLS.filter(n => s.skills.includes(n.id) && n.effect === effect).reduce((n, a) => n + a.amount, 0);
export const equipmentPrice = (s: GameState, equipment: EquipmentDefinition, count=1) => round(equipment.price * count * (1 - (equipment.type === 'material' ? skillEffect(s, 'restock') : 0)) * (equipment.type==='material'&&trusted(s,'union') ? .9 : 1));
export const calibrationTolerance = (s: GameState) => 2 + skillEffect(s, 'calibration') + (ownedEquipment(s, 'calibrationTool') ? 3 : 0);
export const repairPracticeNeeded = (s: GameState) => skillEffect(s, 'standard') > 0 ? 1 : 3;
export const operatingFees = (s: GameState) => BALANCE.maintenance - (trusted(s,'neighborhood')?10:0) + (s.victory ? 0 : BALANCE.rent + modifierEffect(s,'rent'));
export const licensePrice=(s:GameState)=>round(BALANCE.licensePrice*(trusted(s,'watch') ? .75 : 1));
export const debtClosingChances = (s: GameState) => s.victory ? null : Math.max(0, BALANCE.graceDays + 1 - s.grace);
const has = (s: GameState, effect: string) => skillEffect(s, effect) > 0;
export const rootCapacity = (s: GameState) => BALANCE.stock + modifierEffect(s,'cells') / 4 + ownedEquipment(s, 'storage') * 8 + skillEffect(s, 'stockCapacity') + (s.storageUpgrades?.backpack ?? 0) * 6 + (s.storageUpgrades?.crate ?? 0) * 12;
export const capacity = (s: GameState) => rootCapacity(s) + (s.containers ?? []).reduce((sum, c) => sum + storageStyle(c.styleId).columns * storageStyle(c.styleId).rows / 4, 0);
export const displayCapacity = (s: GameState) => Math.min(BALANCE.maxShowcase, BALANCE.showcase + ownedEquipment(s, 'showcase') * 3);
export const stockUsage = (s: GameState) => s.items.filter(i => i.owner === 'player' && i.location !== 'display').reduce((sum, i) => sum + def(i).size, 0) + (s.containers ?? []).reduce((n,c) => { const f=footprint(c);return n+f.width*f.height/4; },0);
export const isMaster = (s: GameState) => PROFESSIONS.some(p => p.implemented && p.masterySkills.some(id => s.skills.includes(id)));
export const repairInvestment = (s: GameState) => SKILLS.filter(n => n.tree === 'repair' && s.skills.includes(n.id)).reduce((n, v) => n + v.cost, 0);
/** An implemented profession must satisfy its own mastery and final milestone together. */
export function professionVictory(s: GameState, professionId: string) {
  const definition = PROFESSIONS.find(p => p.id === professionId);
  const implemented = definition?.implemented ?? false;
  const mastered = !!definition?.masterySkills.some(id => s.skills.includes(id));
  const milestone = definition?.finalMilestone ?? null;
  const completed = !!milestone && s.professionMilestones.includes(milestone);
  return { professionId, implemented, mastered, milestone, completed, ready: implemented && mastered && completed };
}

function random(s: GameState) { s.rng = (Math.imul(s.rng, 1664525) + 1013904223) >>> 0; return s.rng / 4294967296; }
const pick = <T>(s: GameState, a: readonly T[]): T => a[Math.floor(random(s) * a.length)]!;
function id(s: GameState, prefix: string) { return `${prefix}-${++s.serial}`; }
function ledger(s: GameState, kind: string, amount: number, note: string, itemId?: string) { s.ledger.push({ id: ++s.serial, day: s.day, kind, amount, note, itemId }); }
function gainXp(s: GameState, n: number) { s.xp += n; while (s.xp >= s.level * BALANCE.xpPerLevel) { s.level++; s.points++; } }
function milestone(s: GameState) {
  if (s.records.repairs >= BALANCE.chapterRepairs[1]) s.chapter = Math.max(s.chapter, 2);
  if (s.records.repairs >= BALANCE.chapterRepairs[2] && s.certificates.includes('industrial')) s.chapter = Math.max(s.chapter, 3);
  if (s.records.repairs >= BALANCE.chapterRepairs[3] && s.certificates.includes('neural')) s.chapter = Math.max(s.chapter, 4);
}
export function attraction(s: GameState) {
  const display = s.items.filter(i => i.location === 'display' && i.owner === 'player');
  const seen: Record<string, number> = {};
  let score = display.reduce((n, i) => {
    const d = def(i); seen[d.id] = (seen[d.id] ?? 0) + 1;
    return n + ((d.rarity * 4 + i.condition / 20 + i.originality / 25 + (i.provenance.includes('可追溯') ? 3 : 0)) / seen[d.id]);
  }, 0);
  score += new Set(display.map(i => def(i).category)).size * 2;
  for (const theme of THEMES) if (theme.items.every(item => display.some(i => i.definitionId === item))) score += theme.bonus * (1 + skillEffect(s, 'themeBonus'));
  return Math.round(score * (has(s, 'catalog') ? 1.12 : 1));
}
export function itemValue(s: GameState, item: ItemInstance) {
  const d = def(item);
  let factor = .3 + item.condition / 145;
  if (item.faults.length) factor *= Math.max(.25, 1 - item.faults.length * .23);
  if (d.category === 'energy') factor *= (d.valueMetric === 'capacity' ? item.capacity : item.purity) / 100;
  if (d.category === 'food' && item.expiresDay !== null) factor *= item.expiresDay < s.day ? .08 : item.expiresDay - s.day <= 1 ? .52 : 1;
  if (d.category === 'neural') factor *= item.compatibility === '开放标准' ? 1 : .8;
  if (d.category === 'data') factor *= item.integrity / 100 * (item.provenance.includes('合法授权') ? 1 : .7);
  if (d.category === 'antique') factor *= item.authentic ? .65 + item.originality / 100 : .18;
  if (item.owner === 'player' && item.known.includes('restored')) factor *= 1 + skillEffect(s, 'rebirthMaster');
  const event = EVENTS.find(e => e.id === s.eventId);
  if (event?.category === d.category) factor *= event.multiplier;
  return Math.max(1, round(d.price * factor));
}
export function estimateValue(s: GameState, item: ItemInstance): [number, number] {
  const d = def(item);
  if (item.known.includes('scan') && item.known.includes('serial')) return [itemValue(s, item), itemValue(s, item)];
  const base = d.price * (.3 + item.condition / 145);
  const precision = has(s, 'marketInsight') || ownedEquipment(s, 'market') ? .18 : .4;
  return [round(base * (1 - precision)), round(base * (1 + precision))];
}
export function tradeQuote(s: GameState, visitor: Visitor, item?: ItemInstance) {
  if (visitor.kind === 'seller') return item ? visitor.priceTags?.[item.id]?.ask ?? visitor.quote : visitor.quote;
  if (!item) return visitor.quote;
  const loyalty = s.met.includes(visitor.characterId) ? skillEffect(s, 'loyalty') : 0;
  const proposed = round(itemValue(s, item) * (BALANCE.buyerFactor + loyalty + Math.min(.18, attraction(s) / 400))*buyerPreference(s,visitor,item));
  return Math.min(visitor.buyerQuotes?.[item.id]??proposed, buyerCeiling(s,visitor,item));
}
export const buyerCeiling=(s:GameState,v:Visitor,item:ItemInstance)=>round(itemValue(s,item)*v.limit/10000*buyerPreference(s,v,item));
function createItem(s: GameState, d: ItemDefinition, owner: ItemInstance['owner'] = 'player', forceFaults?: string[]): ItemInstance {
  const compatibleFaults = d.certificate ? FAULTS.filter(f => f.certificate === d.certificate) : [];
  const faults = forceFaults ?? (compatibleFaults.length && random(s) < .55 ? [pick(s, compatibleFaults).id] : []);
  const authentic = random(s) > .12;
  return {
    id: id(s, 'item'), definitionId: d.id, owner, location: owner === 'customer' ? 'workshop' : 'stock', condition: round(48 + random(s) * 45),
    integrity: round(45 + random(s) * 55), capacity: round(35 + random(s) * 65), purity: round(65 + random(s) * 35), authentic,
    originality: round(60 + random(s) * 40), provenance: d.category === 'data' ? (random(s) > .3 ? '可追溯的合法授权副本' : '个人转让，授权待核') : (authentic ? '可追溯的街区旧物' : '来源不明的复刻品'),
    compatibility: random(s) > .25 ? '开放标准' : '旧式专用接口', expiresDay: d.shelfLife ? s.day + foodShelfLife(s,d.shelfLife) : null,
    faults: [...faults], known: has(s, 'batchInfo') ? ['basic', 'batch'] : [], cost: 0, acquiredDay: s.day, preservedUntil: 0,
  };
}
function customer(s: GameState, category: CategoryId, preferred?: string) {
  const pool = CHARACTERS.filter(c => (!c.endless || s.endless) && (c.firstDay??1)<=s.day && c.preferences.includes(category));
  return CHARACTERS.find(c => c.id === preferred) ?? pick(s, pool.length ? pool : CHARACTERS.filter(c => !c.endless));
}
function accessibleDefinitions(s: GameState, category?: CategoryId) { return ITEMS.filter(d => d.chapter <= s.chapter && (!category || d.category === category) && (!d.regulated || s.licenses.includes('regulated-trade'))); }
function makeVisitor(s: GameState, kind: Visitor['kind'], category: CategoryId, groupId?:FactionId): Visitor {
  // Trading authorization governs transfer of ownership, not receiving a client's device for licensed service.
  let pool = kind === 'repair'
    ? ITEMS.filter(d => d.chapter <= s.chapter && d.category === category && d.certificate && s.certificates.includes(d.certificate))
    : accessibleDefinitions(s, category);
  if (!pool.length) pool = accessibleDefinitions(s).filter(d => kind !== 'repair' || d.certificate === 'civil');
  const d = pick(s, pool);
  const person = customer(s, d.category,groupId?faction(groupId)!.contact:undefined);
  const affiliation=factionFor(person.id);
  let item: ItemInstance | undefined;
  if (kind !== 'buyer') {
    const fs = FAULTS.filter(f => f.certificate === d.certificate);
    item = createItem(s, d, kind === 'repair' ? 'customer' : 'player', kind === 'repair' ? [pick(s, fs).id] : undefined);
    if (kind === 'repair' && s.chapter >= 3 && d.certificate !== 'civil' && fs.length > 1) item.faults.push(fs.find(f => f.id !== item!.faults[0])!.id);
  }
  const goods = kind === 'seller' && item ? [item, ...Array.from({length:3}, () => createItem(s, pick(s, pool)))] : undefined;
  goods?.forEach((good,index)=>{
    if(affiliation.id==='grayline'){good.condition=Math.max(30,good.condition-12);if(index%2)good.provenance='灰线旧货，批次凭据不完整';}
    if(affiliation.id==='uppercity'){good.condition=Math.max(85,good.condition);good.faults=[];}
    if(affiliation.id==='watch'){good.provenance='可追溯的巡务署备案旧物';good.authentic=true;}
  });
  const relation = clamp(s.relations[person.group] ?? 0, -10, 20);
  const value = item ? itemValue(s, item) : d.price;
  const advantage = skillEffect(s, 'bargain') + (s.met.includes(person.id) ? skillEffect(s, 'loyalty') : 0);
  const quote = kind === 'seller' ? round(value * BALANCE.sellerFactor * affiliation.seller * (1 - Math.max(0, relation) / 150)) : round(value * BALANCE.buyerFactor * affiliation.buyer);
  const priceTags = goods ? Object.fromEntries(goods.map(i => [i.id, {
    ask: Math.max(1, round(itemValue(s,i) * BALANCE.sellerFactor * affiliation.seller * (1 - Math.max(0,relation) / 150))),
    minimum: Math.max(1, round(itemValue(s,i) * BALANCE.sellerFloor * affiliation.seller * (1 - advantage))),
  }])) : undefined;
  return { id: id(s, 'visitor'), characterId: person.id, kind, item, goods, priceTags, demand:kind==='buyer'?{limit:purchaseQuantity(affiliation.id,d.category),fulfilled:0}:undefined, budget: kind === 'buyer' ? round(Math.max(400, quote * 4)*affiliation.budget) : undefined, category: d.category, quote,
    limit: kind === 'seller' ? round(value * BALANCE.sellerFloor * affiliation.seller * (1 - advantage)) : round(10000 * (BALANCE.buyerCeiling + advantage + Math.min(.2, attraction(s) / 400))),
    rounds: 0, patience: person.patience, resolved: false,
    request: kind === 'repair' ? `${d.name}：${(FAULTS.find(f => f.id === item!.faults[0])?.symptom ?? '工作不稳定').replace(/[。；]$/, '')}。请先检测。` : kind === 'seller' ? `带了一批${CATEGORIES.find(c=>c.id===d.category)?.name}，每件成色不一样，价签都在。可以先挑、先检查。${person.bargain}` : `这趟想收 ${purchaseQuantity(affiliation.id,d.category)} 件${CATEGORIES.find(c => c.id === d.category)?.name}。${person.bargain}` };
}
function generateDay(s: GameState) {
  s.eventId = EVENTS[(s.day - 1) % EVENTS.length]!.id; s.eventResolved = false;
  const categories = CATEGORIES.map(c => c.id);
  const currentStock = s.items.filter(i => i.owner === 'player' && i.location === 'stock');
  const saleCategory = currentStock.length ? def(pick(s, currentStock)).category : categories[(s.day - 1) % categories.length]!;
  const rotating = categories[(s.day - 1) % categories.length]!;
  const repairCategory: CategoryId = s.endless && s.certificates.includes('antique') && s.day % 2 === 0 ? 'antique' : s.certificates.includes('neural') && s.day % 3 === 0 ? 'neural' : 'electronics';
  const supplierCategory = s.appointments && has(s, 'targetSupply') ? s.appointments : rotating;
  const route=factionVisit(s),network=route?faction(route):undefined;
  const preferredCategory=network?.categories[(s.day-2+network.categories.length)%network.categories.length];
  const networkCategory=preferredCategory&&accessibleDefinitions(s,preferredCategory).length ? preferredCategory : network?.categories.find(c=>accessibleDefinitions(s,c).length)??categories[s.day%categories.length]!;
  s.visitors = [makeVisitor(s, 'repair', 'electronics'), makeVisitor(s, 'seller', supplierCategory), makeVisitor(s, 'buyer', saleCategory),
    makeVisitor(s, 'repair', repairCategory,route==='contractors'?route:undefined), makeVisitor(s, 'seller',networkCategory,route),
    makeVisitor(s, 'buyer',route?networkCategory:supplierCategory,route), makeVisitor(s, 'buyer', attraction(s)>20 && has(s,'collector') ? 'antique' : saleCategory)];
  delete s.factionAppointment;
  if (s.endless) {
    const guests = CHARACTERS.filter(c => c.endless);
    const guest = guests.find(c => !s.met.includes(c.id)) ?? guests[(s.day - 1) % guests.length];
    if (guest) s.visitors[3]!.characterId = guest.id;
  }
  s.visitors.forEach((visitor,index)=>{if(visitor.kind==='seller'){
    const start=(s.day-1+(index===1?0:2))%STORAGE_STYLES.length;
    visitor.storageGoods=[STORAGE_STYLES[start]!,STORAGE_STYLES[(start+1)%STORAGE_STYLES.length]!].map(d=>({id:id(s,'storage-offer'),styleId:d.id,price:factionStoragePrice(s,visitor.characterId,d.price)}));
  }});
  s.visitorIndex = 0; s.visitorArrived = false;
  s.deliveries=newDeliveryDay(s,s.deliveries);
}
export function createGame(seed = 11052026, modifiers: string[] = []): GameState {
  if (!validModifiers(modifiers)) throw new Error('开局词条无效或相互冲突。');
  const s: GameState = { modifiers:[...modifiers], version: SAVE_VERSION, contentVersion: CONTENT_VERSION, balanceVersion: BALANCE.version, seed: seed >>> 0, rng: seed >>> 0, serial: 0,
    day: 1, chapter: 1, phase: 'open', cash: BALANCE.initialCash + modifierEffect({modifiers},'cash'), hours: dailyHours({modifiers}), debt: 0, grace: 0, xp: 0, level: 1, points: BALANCE.initialPoints,
    skills: [], certificates: ['civil'], trained: ['civil'], licenses: [], equipment: {}, equipmentCosts: {}, items: [], visitors: [], visitorIndex: 0, orders: [],
    reputation: 0, relations: {}, questStages: {}, eventId: '', eventResolved: false, discovered: [], met: [], repairHistory: [], records: { trades: 0, repairs: 0, revenue: 0, repairIncome: 0, days: 0, faults: {} },
    finalStage: 0, finalComplete: false, professionMilestones: [], victory: false, endless: false, freeRespec: true, ledger: [], messages: ['店门重新打开。先接一件民用维修，赚到今天的第一笔工钱。'], appointments: null, challenge: null };
  for (const effect of ['cleaner', 'parts', 'mechanical', 'insulation', 'neuralSupply', 'preserveSupply']) s.equipment[equipmentId(effect)] = effect === 'preserveSupply' ? 2 : 4;
  for (const effect of ['solder', 'bench']) s.equipment[equipmentId(effect)] = 1;
  const initial = [ITEMS.find(d => d.category === 'food' && d.chapter === 1), ITEMS.find(d => d.category === 'data' && d.chapter === 1), ITEMS.find(d => d.category === 'antique' && d.chapter === 1)].filter(Boolean) as ItemDefinition[];
  for (const d of initial) { const i = createItem(s, d, 'player', []); i.known = ['basic']; i.cost = round(d.price * .4); s.items.push(i); s.discovered.push(d.id); }
  generateDay(s); return s;
}

function validSkills(ids: string[], available: number): string | null {
  if (new Set(ids).size !== ids.length) return '技能不能重复选择。';
  const nodes = ids.map(id => SKILLS.find(n => n.id === id));
  if (nodes.some(n => !n)) return '未知技能。';
  if (nodes.reduce((n, a) => n + a!.cost, 0) > available) return '技能点不足。';
  for (const n of nodes) {
    if (n!.requires.some(id => !ids.includes(id))) return `${n!.name}的前置技能尚未学习。`;
    if (n!.cost === 2 && nodes.filter(a => a!.tree === 'repair' && a!.id !== n!.id).reduce((t, a) => t + a!.cost, 0) < BALANCE.masterInvestment) return '大师能力需要先在维修树投入至少 6 点。';
  }
  return null;
}
export function questProgress(s: GameState, questId: string) {
  const q = QUESTS.find(q => q.id === questId); const stage = q?.stages[s.questStages[questId] ?? 0];
  if (!stage) return { current: 0, target: 0, complete: true, ready: false };
  const current = stage.requirement === 'repairs' ? s.records.repairs : stage.requirement === 'trades' ? s.records.trades : stage.requirement === 'display' ? s.items.filter(i => i.location === 'display').length : stage.requirement === 'certificate' ? s.certificates.length : stage.requirement === 'master' ? Number(isMaster(s)) : Number(s.finalComplete);
  return { current, target: stage.count, complete: false, ready: current >= stage.count };
}
export function applyAction(input: GameState, action: Action): ActionResult {
  const s = clone(input); const events: PresentationEvent[] = [];
  s.deliveries??=newDeliveryDay(s);
  // Anchor legacy/new-game stock before removing an item so its neighbours stay put.
  const initialLayout = rootLayout(s, rootCapacity(s));
  for (const item of ownedObjects(s)) if (initialLayout.positions[item.id]) item.grid = initialLayout.positions[item.id];
  const fail = (text: string): ActionResult => ({ state: input, events: [{ type: 'error', text }], ok: false });
  const say = (text: string, type: PresentationEvent['type'] = 'success') => { events.push({ type, text }); s.messages.push(text); s.messages = s.messages.slice(-60); };
  const pay = (amount: number, kind: string, note: string, itemId?: string) => { s.cash -= amount; ledger(s, kind, -amount, note, itemId); };
  const earn = (amount: number, kind: string, note: string, itemId?: string) => { s.cash += amount; s.records.revenue += amount; ledger(s, kind, amount, note, itemId); };
  const spendHours = (n: number) => { if (s.hours < n) return false; s.hours = Math.round((s.hours - n) * 2) / 2; return true; };
  const findItem = (id: string) => s.items.find(i => i.id === id);
  const currentVisitor = (id: string) => s.visitors.find((v, index) => v.id === id && index === s.visitorIndex && s.visitorArrived !== false && !v.resolved);
  const finishVisitor = (v: Visitor) => { v.resolved = true; if (!s.met.includes(v.characterId)) s.met.push(v.characterId); };
  const orderItem = (id: string) => { const order = s.orders.find(o => o.id === id && !o.delivered); return { order, item: order ? findItem(order.itemId) : undefined }; };
  const activeOrder = (itemId: string) => s.orders.some(o => o.itemId === itemId && !o.delivered);
  const canRepair = (item: ItemInstance) => { const d = def(item); return d.certificate && s.certificates.includes(d.certificate); };
  const counterOffer=(v:Visitor,goods:ItemInstance[],offered:number,bulk=1)=>{
    v.rounds++;
    let quote=Math.round(goods.reduce((n,i)=>n+tradeQuote(s,v,i),0)*bulk);
    let reason:'price'|'budget'|'far'='price';
    if(v.rounds<v.patience){
      if(v.kind==='seller'){
        if(v.goods&&!v.priceTags)v.priceTags=Object.fromEntries(v.goods.map(i=>[i.id,{ask:v.quote,minimum:v.limit}]));
        const floor=Math.round(goods.reduce((n,i)=>n+(v.priceTags?.[i.id]?.minimum??v.limit),0)*bulk);
        if(offered<floor*.6)reason='far';
        else for(const item of goods){const minimum=v.priceTags?.[item.id]?.minimum??v.limit;const ask=Math.max(minimum,Math.round((tradeQuote(s,v,item)+minimum)/2));if(v.priceTags?.[item.id])v.priceTags[item.id]!.ask=ask;else v.quote=ask;}
        if(v.item&&v.priceTags?.[v.item.id])v.quote=v.priceTags[v.item.id]!.ask;
        quote=Math.round(goods.reduce((n,i)=>n+tradeQuote(s,v,i),0)*bulk);
      }else{
        const ceilings=goods.map(i=>Math.max(1,buyerCeiling(s,v,i)));
        const ceiling=ceilings.reduce((n,c)=>n+c,0),budget=v.budget??Math.max(400,v.quote*4),maximum=Math.min(ceiling,budget);
        if(quote>maximum){quote=maximum;reason=budget<ceiling?'budget':'price';}
        else if(offered>ceiling*1.6)reason='far';
        else quote=Math.min(maximum,Math.ceil((quote+maximum)/2));
        const prices=allocateQuote(quote,ceilings);v.buyerQuotes??={};goods.forEach((item,index)=>{v.buyerQuotes![item.id]=prices[index]!;});
      }
    }
    const closed=v.rounds>=v.patience;
    v.negotiation={itemIds:goods.map(i=>i.id),offered,quote,round:v.rounds,status:closed?'closed':'counter',reason};
    if(closed){finishVisitor(v);say('这次没有谈妥，客人告辞了。现金和货物保留。');}
    else say(`${reason==='far'?'报价相差太远，客人维持当前价':reason==='budget'?'买家按剩余预算还价':v.kind==='seller'?'卖家让价':'买家还价'}：这 ${goods.length} 件共 ₡${quote}。还可议价 ${v.patience-v.rounds} 次。`);
  };
  const tradeReceipt=(v:Visitor,goods:ItemInstance[],amount:number)=>{
    recordTradeRelation(s,v);
    v.lastTrade={kind:v.kind==='seller'?'buy':'sell',amount,cost:v.kind==='seller'?amount:goods.reduce((n,i)=>n+i.cost,0),goods:goods.map(i=>({definitionId:i.definitionId,itemId:i.id,cost:i.cost}))};
    delete v.negotiation;
  };
  const makeOrder = (item: ItemInstance, kind: RepairOrder['kind'], characterId: string, extra: Partial<RepairOrder> = {}) => {
    const c = def(item).certificate;
    const base = c === 'antique' ? BALANCE.antiqueRepairReward : c === 'neural' ? BALANCE.neuralRepairReward : c === 'industrial' ? BALANCE.advancedRepairReward : BALANCE.basicRepairReward;
    const reward = round(base * (1 + skillEffect(s, 'precisionMaster') + skillEffect(s, 'workshopMaster') + Math.min(.2, attraction(s) / 500))*(kind==='client'&&factionFor(characterId).id==='contractors'&&trusted(s,'contractors')?1.15:1));
    const preserveOriginal = def(item).category === 'antique' && (kind === 'own' || random(s) > .35);
    const order: RepairOrder = { id: id(s, 'order'), itemId: item.id, characterId, description: `${def(item).name}的${kind === 'own' ? '自有旧货翻新' : '维修委托'}；${preserveOriginal ? '保存原貌，优先修整原件。' : '以恢复功能为先，可以更换模块，完成后请复检。'}`, diagnosed: false, verified: false, delivered: false,
      escrow: kind === 'own' ? 0 : 1000, reward: kind === 'own' ? 0 : reward, completedOps: 0, kind, preserveOriginal, receivedDay: s.day, steps: [], ...extra };
    item.location = 'workshop'; delete item.containerId; delete item.grid; s.orders.push(order); return order;
  };
  if (s.phase === 'failed' || (s.phase === 'ended' && action.type !== 'continueEndless')) return fail('本局已结算。可以恢复当日备份或重新开局。');
  if (s.phase === 'won' && !['continueEndless', 'endGame'].includes(action.type)) return fail('请在结局中选择结束并保存，或继续经营。');
  const openOnly: Action['type'][] = ['buyStorage','sellStorage','acceptDelivery','deliverGoods','cancelDelivery','callVisitor', 'tradeBatch', 'offer', 'acceptTrade', 'reject', 'nextVisitor', 'acceptRepair', 'startRepair', 'diagnose', 'repair', 'verify', 'deliver', 'exam', 'startFinal', 'inspect', 'preserve', 'eventChoice'];
  if (openOnly.includes(action.type) && s.phase !== 'open') return fail('这项操作需要开店后进行。');
  if ('itemId' in action && action.itemId) {
    const targeted = findItem(action.itemId);
    if (targeted && !itemAccessible(s, targeted)) return fail('这个箱包被压住了，先移走上层箱包。');
  }
  switch (action.type) {
    case 'appointFaction': {
      if(action.factionId===null){delete s.factionAppointment;say('已取消下个营业日的联络预约。');break;}
      const group=faction(action.factionId);if(!group)return fail('没有这条联络路线。');
      if(!factionKnown(s,group.id)||(s.relations[group.id]??0)<CONTACT_RELATION)return fail('先把关系积累到熟客，再预约来访。');
      s.factionAppointment=group.id;say(`已约好${group.name}，下个营业日会带来一位卖家和一位买家。`);break;
    }
    case 'acceptDelivery': {
      const job=s.deliveries.find(j=>j.id===action.jobId&&j.status==='offered'&&j.postedDay===s.day);
      if(!job)return fail('这份订货单已经接取或不再开放。');
      if(s.deliveries.filter(j=>j.status==='active').length>=DELIVERY_LIMIT)return fail('最多同时承接两份订货，先交货或取消一份。');
      job.status='active';job.acceptedDay=s.day;
      say(`已接下「${deliveryDefinition(job).title}」，第 ${job.deadline} 日闭店前交货。款项在交货时结算。`);break;
    }
    case 'cancelDelivery': {
      const job=s.deliveries.find(j=>j.id===action.jobId&&j.status==='active');
      if(!job)return fail('这份订货没有进行中。');
      job.status='cancelled';job.closedDay=s.day;say('已告知订货人取消；库存和现金保留。');break;
    }
    case 'deliverGoods': {
      const job=s.deliveries.find(j=>j.id===action.jobId&&j.status==='active');
      if(!job||s.day>job.deadline)return fail('这份订货不在可交货期限内。');
      const request=deliveryDefinition(job);
      if(!Array.isArray(action.itemIds)||action.itemIds.length!==request.quantity||new Set(action.itemIds).size!==action.itemIds.length)return fail(`请选 ${request.quantity} 件不同的合格货品。`);
      const goods=action.itemIds.map(itemId=>findItem(itemId));
      if(goods.some(i=>!i))return fail('部分选中货品已经离开店铺。');
      for(const item of goods as ItemInstance[]){const check=deliveryItemCheck(s,request,item);if(!check.ready)return fail(`${def(item).name}：${check.reason}。`);}
      if(!spendHours(DELIVERY_HOURS))return fail('交货需要半个工时，今天已经来不及打包。');
      const selected=goods as ItemInstance[];
      job.goods=selected.map(i=>({itemId:i.id,definitionId:i.definitionId,cost:i.cost}));job.status='completed';job.closedDay=s.day;
      s.items=s.items.filter(i=>!action.itemIds.includes(i.id));
      earn(request.reward,'delivery',`订货交付：${request.title}（${request.quantity} 件）`);
      s.records.deliveries=(s.records.deliveries??0)+1;s.records.deliveryIncome=(s.records.deliveryIncome??0)+request.reward;
      s.records.trades+=selected.length;gainXp(s,request.xp);s.reputation+=2;
      const person=CHARACTERS.find(c=>c.id===request.characterId)!;s.relations[person.group]=(s.relations[person.group]??0)+1;
      if(!s.met.includes(person.id))s.met.push(person.id);
      if(s.challenge?.id==='rare-trade')s.challenge.progress+=selected.filter(i=>def(i).rarity>=3&&i.authentic).length;
      say(`已交付 ${selected.length} 件，收到 ₡${request.reward}。${person.name}的回信已放进订货簿。`,'trade');break;
    }
    case 'tradeBatch': {
      const v=currentVisitor(action.visitorId);
      if (!v || v.kind === 'repair') return fail('当前没有可交易的客人。');
      if (!action.itemIds.length || new Set(action.itemIds).size !== action.itemIds.length) return fail('请选取不同的实际物品。');
      const pool=v.kind === 'seller' ? (v.goods ?? (v.item ? [v.item] : [])) : s.items.filter(i => i.owner === 'player' && ['stock','counter'].includes(i.location) && !activeOrder(i.id) && def(i).category === v.category);
      const selected=action.itemIds.map(id => pool.find(i => i.id === id));
      if (selected.some(i => !i)) return fail('部分物品已经成交或不属于这笔交易。');
      const goods=selected as ItemInstance[];
      if(v.kind==='buyer'&&goods.length>buyerRemaining(v))return fail(`本次还收 ${buyerRemaining(v)} 件，请减少清单数量。`);
      if (v.kind === 'buyer' && goods.some(i => !itemAccessible(s, i))) return fail('货品所在箱包被压住了，先移走上层箱包。');
      if (goods.some(i => def(i).regulated) && !s.licenses.includes('regulated-trade')) return fail('这批物品需要交易许可。');
      const prices=goods.map(i => tradeQuote(s,v,i));
      if(prices.some(price=>price<=0))return fail('这批货中有已过期或没有交易价值的物品。');
      const bulk=v.kind === 'seller' ? wholesaleFactor(s,goods.length) : 1;
      const total=Math.max(1,Math.round(prices.reduce((a,b)=>a+b,0)*bulk));
      const offered=action.amount ?? total;
      if (!Number.isSafeInteger(offered) || offered <= 0) return fail('报价必须是正整数。');
      const floor=Math.round(goods.reduce((n,i)=>n+(v.priceTags?.[i.id]?.minimum??v.limit),0)*bulk);
      const ceiling=goods.reduce((n,i)=>n+buyerCeiling(s,v,i),0);
      const buyerBudget=v.budget??Math.max(400,v.quote*4);
      if(v.kind==='buyer'&&(buyerBudget<goods.length||(action.amount===undefined&&offered>buyerBudget)))return fail(`买家剩余预算只有 ${buyerBudget}，请减少售出数量。`);
      if (v.kind === 'seller' ? offered < floor : offered > ceiling || offered > buyerBudget) {
        counterOffer(v,goods,offered,bulk);break;
      }
      if (v.kind === 'seller') {
        if (s.cash < offered) return fail('现金不足，减少本次购入数量。');
        if (!canReceive(s,rootCapacity(s),goods.map(i=>({...i,location:'counter',containerId:undefined})))) return fail('没有足够的连续收纳空间，减少进货或先腾出空位。');
        const plan=counterLayout([...ownedObjects(s),...goods.map(i=>({...i,owner:'player' as const,location:'counter' as const,counterGrid:action.placements?.[i.id]?{...action.placements[i.id]!}:i.counterGrid}))]);
        if(goods.some(i=>!plan.positions[i.id])) return fail('谈判台放不下这批货，请先把已购商品入库。');
        if(goods.some(i=>{const requested=action.placements?.[i.id],at=plan.positions[i.id];return requested&&(!at||requested.x!==at.x||requested.y!==at.y||requested.rotated!==at.rotated);}))return fail('谈判台的位置有重叠或越界，请重新摆放。');
        let remaining=offered;
        goods.forEach((i,index)=>{ const cost=index===goods.length-1 ? remaining : Math.floor(offered*prices[index]!/prices.reduce((a,b)=>a+b,0)); remaining-=cost;
          const acquired={...clone(i),owner:'player' as const,location:'counter' as const,counterGrid:plan.positions[i.id],cost,acquiredDay:s.day};
          s.items.push(acquired);pay(cost,'purchase',`买入${def(i).name}${bulk<1?'（批发九折）':''}`,i.id);if(!s.discovered.includes(i.definitionId))s.discovered.push(i.definitionId);
        });
        v.goods=pool.filter(i=>!action.itemIds.includes(i.id));v.item=v.goods[0];
        if(v.priceTags)for(const i of goods)delete v.priceTags[i.id];
        if(v.item){v.quote=tradeQuote(s,v,v.item);v.limit=v.priceTags?.[v.item.id]?.minimum??v.limit;}
        if(!v.goods.length&&!v.storageGoods?.length)finishVisitor(v);
      } else {
        const budget=v.budget ?? Math.max(400,v.quote*4);if(offered>budget)return fail(`买家剩余预算只有 ${budget}，请减少售出数量。`);
        v.budget=budget-offered;fulfillDemand(v,goods.length);let remaining=offered;
        goods.forEach((i,index)=>{const value=index===goods.length-1?remaining:Math.floor(offered*prices[index]!/prices.reduce((a,b)=>a+b,0));remaining-=value;earn(value,'sale',`售出${def(i).name}，累计成本 ${i.cost}，货款差额 ${value-i.cost}`,i.id);});
        if(s.challenge?.id==='rare-trade')s.challenge.progress+=goods.filter(i=>def(i).rarity>=3&&i.authentic).length;
        s.items=s.items.filter(i=>!action.itemIds.includes(i.id));if(v.budget<=0)finishVisitor(v);
      }
      s.records.trades+=goods.length;gainXp(s,BALANCE.tradeXp*goods.length);s.reputation++;
      tradeReceipt(v,goods,offered);if(v.kind==='seller')v.lastTrade!.goods=goods.map(i=>({definitionId:i.definitionId,itemId:i.id,cost:s.items.find(owned=>owned.id===i.id)!.cost}));
      say(`${v.kind==='seller'?'购入':'售出'} ${goods.length} 件，共 ₡${offered}${bulk<1?'，已享批发九折':''}。${v.kind==='seller'?'已购货物留在谈判台，继续选货或先入库。':buyerRemaining(v)===0?'本次采购已齐，可以结束接待。':`还收 ${Number.isFinite(buyerRemaining(v))?buyerRemaining(v)+' 件，':''}可继续挑选或结束接待。`}`,'trade');break;
    }
    case 'moveCounter': {
      const item = findItem(action.itemId);
      if (!item || item.owner !== 'player' || !['stock','counter'].includes(item.location)) return fail('只能把自有库存或台面物品移到谈判台。');
      const layout = shopCounterLayout(s); const occupied = new Set<number>();
      for (const other of ownedObjects(s)) if (other.id !== item.id && layout.positions[other.id]) occupy(other, layout.positions[other.id]!, occupied, SURFACE_COLUMNS);
      const at = { x: action.x, y: action.y, rotated: action.rotated };
      if (!fits(item, at, occupied, SURFACE_CAPACITY, SURFACE_COLUMNS)) return fail('谈判台这里放不下，请旋转或先把已购商品收入仓库。');
      item.location = 'counter'; item.counterGrid = at; delete item.grid; delete item.containerId; break;
    }
    case 'buyStorage': {
      const visitor=currentVisitor(action.visitorId),offer=visitor?.storageGoods?.find(o=>o.id===action.offerId);
      if(!visitor||visitor.kind!=='seller'||!offer)return fail('这件箱包已经售出，或卖家不在接待中。');
      if((s.containers?.length??0)>=256)return fail('箱包总数已达当前存档上限。');
      const d=storageStyle(offer.styleId);if(s.cash<offer.price)return fail('信用点不足。');
      const box:StorageContainer={id:id(s,'container'),styleId:d.id,owner:'player',location:'counter',cost:offer.price,acquiredDay:s.day,label:d.name,color:'ivory'};
      if(!canReceive(s,rootCapacity(s),[box]))return fail('连箱包的外壳也放不下了，先卖出或整理库存。');
      const plan=counterLayout([...ownedObjects(s),box]);if(!plan.positions[box.id])return fail('谈判台放不下这只箱包，先把台面物品收好。');
      box.counterGrid=plan.positions[box.id];s.containers??=[];s.containers.push(box);
      recordTradeRelation(s,visitor);visitor.lastTrade={kind:'buy',amount:offer.price,cost:offer.price,goods:[{definitionId:d.id,itemId:box.id,cost:box.cost}]};
      visitor.storageGoods=visitor.storageGoods!.filter(o=>o.id!==offer.id);pay(offer.price,'purchase',`买入${d.name}`,box.id);s.records.trades++;gainXp(s,BALANCE.tradeXp);
      if(!visitor.goods?.length&&!visitor.item&&!visitor.storageGoods.length)finishVisitor(visitor);
      say(`买下${d.name} · ₡${offer.price}，先将箱包从谈判台收好。`,'trade');break;
    }
    case 'sellStorage': {
      const visitor=currentVisitor(action.visitorId),box=s.containers?.find(c=>c.id===action.storageId);
      if(!visitor||visitor.kind!=='buyer'||!box)return fail('当前买家或箱包不可用。');
      if(containerItems(s,box.id).length)return fail('先取出箱包里的全部物品，再出售箱包。');
      if(buyerRemaining(visitor)<1)return fail('这位买家本次采购已齐。');
      const price=round(storageStyle(box.styleId).price*.55),budget=visitor.budget??Math.max(400,visitor.quote*4);if(price>budget)return fail('买家剩余预算不足。');
      recordTradeRelation(s,visitor);visitor.lastTrade={kind:'sell',amount:price,cost:box.cost,goods:[{definitionId:box.styleId,itemId:box.id,cost:box.cost}]};
      visitor.budget=budget-price;fulfillDemand(visitor,1);s.containers=s.containers!.filter(c=>c.id!==box.id);earn(price,'sale',`售出${storageStyle(box.styleId).name}，累计成本 ${box.cost}`,box.id);s.records.trades++;gainXp(s,BALANCE.tradeXp);if(!visitor.budget)finishVisitor(visitor);say(`箱包成交 · ₡${price}。`,'trade');break;
    }
    case 'moveStorage': {
      const box=s.containers?.find(c=>c.id===action.storageId);if(!box)return fail('找不到这件箱包。');const at={x:action.x,y:action.y,rotated:action.rotated};
      if(action.counter){const plan=shopCounterLayout(s),occupied=new Set<number>();for(const o of ownedObjects(s))if(o.id!==box.id&&plan.positions[o.id])occupy(o,plan.positions[o.id]!,occupied,SURFACE_COLUMNS);if(!fits(box,at,occupied,SURFACE_CAPACITY,SURFACE_COLUMNS))return fail('谈判台没有完整空位。');box.location='counter';box.counterGrid=at;delete box.grid;delete box.containerId;}
      else {const problem=nestingProblem(s,box,action.containerId);if(problem)return fail(problem);if(!objectFits(s,rootCapacity(s),box,at,action.containerId))return fail('箱包外形放不下，试着旋转或腾出空格。');putObject(box,at,action.containerId);}
      say('箱包与里面的物品已一起移动。');break;
    }
    case 'buyLabeler': {
      if (s.labeler) return fail('已经拥有标签机。');
      if (s.cash < LABELER_PRICE) return fail('信用点不足。');
      pay(LABELER_PRICE, 'equipment', '便携标签机'); s.labeler = true; say('标签机已就位。'); break;
    }
    case 'labelContainer': {
      const container = s.containers?.find(c => c.id === action.containerId);
      if (!container) return fail('找不到这个箱包。');
      if (!s.labeler) return fail('需要先购买标签机。');
      if (!validContainerLabel(action.label) || !LABEL_COLORS.includes(action.color)) return fail('标签需要 1–12 个字，并选择有效颜色。');
      container.label = action.label; container.color = action.color; say('新标签已贴好。'); break;
    }
    case 'talk': {
      const v = currentVisitor(action.visitorId); if (!v) return fail('这位客人已经结束交谈。');
      s.conversations ??= {}; s.conversations[v.id] = Math.min(2, (s.conversations[v.id] ?? 0) + 1); break;
    }
    case 'tutorial': {
      if (!Number.isSafeInteger(action.step) || action.step < 0 || action.step > 9) return fail('无效的教学步骤。');
      s.tutorial = { step: action.step, skipped: action.skipped ?? false }; break;
    }
    case 'moveStock': {
      const item = findItem(action.itemId);
      if (!item || item.owner !== 'player' || !['stock', 'counter'].includes(item.location)) return fail('只能整理自己的库存或已经购买的柜台商品。');
      const at={x:action.x,y:action.y,rotated:action.rotated};
      if(!objectFits(s,rootCapacity(s),item,at,action.containerId))return fail('这里放不下：需要完整空格，不能重叠或超出容器。');
      putObject(item,at,action.containerId);say(`${def(item).name}已归位。`);break;
    }
    case 'inspect': {
      const visitor = action.visitorId ? currentVisitor(action.visitorId) : undefined;
      const item = action.itemId ? findItem(action.itemId) ?? visitor?.goods?.find(i=>i.id===action.itemId) ?? (visitor?.item?.id===action.itemId?visitor.item:undefined) : visitor?.item;
      if (!item) return fail('没有可检查的物品。');
      const method = action.method ?? 'basic';
      if (item.known.includes(method)) return fail('这项检查已经完成，结果不会重复抽取。');
      if (method === 'scan' && !ownedEquipment(s, 'scan')) return fail('需要多谱扫描仪。');
      if (method === 'serial' && !ownedEquipment(s, 'serial')) return fail('需要序列检索终端。');
      if (!spendHours((has(s, 'catalog') && method === 'basic') || (trusted(s,'freewave') && def(item).category==='data' && method==='serial') ? 0 : BALANCE.inspectionHours)) return fail('工时不足，明天可以继续检查。');
      item.known.push(method);
      if(visitor?.item?.id===item.id)visitor.item=item;
      if (method === 'basic') { say(`${def(item).name}：成色 ${item.condition}%；${item.faults.length ? '有功能异常，进一步检测可定位' : '外观及基础功能可用'}；参考价 ${estimateValue(s, item).join('–')}。`); }
      if (method === 'scan') say(`扫描：${def(item).category === 'food' ? `保质至第 ${item.expiresDay} 日` : def(item).category === 'energy' ? `容量 ${item.capacity}%，纯度 ${item.purity}%` : def(item).category === 'data' ? `可读完整度 ${item.integrity}%（内容解密不属于硬件维修）` : `${item.faults.length} 项异常；接口为${item.compatibility}`}。`);
      if (method === 'serial') say(`序列核验：${item.authentic ? '真实原件' : '复刻品'}；${item.provenance}；原貌 ${item.originality}%。`);
      break;
    }
    case 'offer': case 'acceptTrade': {
      const v = currentVisitor(action.visitorId); if (!v || v.kind === 'repair') return fail('这笔交易已结束或当前没有该客户。');
      const item = v.kind === 'seller' ? v.item : action.itemId ? findItem(action.itemId) : undefined;
      if (!item) return fail('请先选择一件库存商品。');
      const d = def(item);
      if (d.regulated && !s.licenses.includes('regulated-trade')) return fail('该商品需要通用受管制商品交易许可。维修证书不替代交易许可。');
      if (v.kind === 'buyer' && (item.owner !== 'player' || !['stock','counter'].includes(item.location) || activeOrder(item.id))) return fail('只能出售仓库或谈判台上的自有物品。送修物和展品不能出售。');
      if(v.kind==='buyer'&&buyerRemaining(v)<1)return fail('这位买家本次采购已齐。');
      if (v.kind === 'buyer' && d.category !== v.category) return fail('这位买家需要另一类商品。');
      const offered = action.type === 'offer' ? action.amount : tradeQuote(s, v, item);
      if (!Number.isSafeInteger(offered) || offered <= 0) return fail('报价必须是正整数信用点。');
      // The buyer's willingness multiplier was fixed on arrival; selecting another item only changes its objective value.
      const maxBuyer = buyerCeiling(s,v,item);
      const minimum = v.priceTags?.[item.id]?.minimum ?? v.limit;
      const buyerBudget=v.budget??Math.max(400,v.quote*4);
      if(v.kind==='buyer'&&(buyerBudget<1||(action.type==='acceptTrade'&&offered>buyerBudget)))return fail(`买家剩余预算只有 ${buyerBudget}。`);
      const accepted = v.kind === 'seller' ? offered >= minimum : offered <= maxBuyer&&offered<=buyerBudget;
      if (!accepted) {counterOffer(v,[item],offered);break;}
      if (v.kind === 'seller') {
        if (s.cash < offered) return fail('自由现金不足；客户预付款不能用于收货。');
        if (!canReceive(s,rootCapacity(s),[{...item,location:'counter',containerId:undefined}])) return fail('没有足够的连续收纳空间，先卖出或整理库存。');
        const counter = counterLayout([...ownedObjects(s), { ...item, owner: 'player', location: 'counter' }]);
        if (!counter.positions[item.id]) return fail('谈判台没有完整空位，请先将已购商品入库。');
        item.counterGrid = counter.positions[item.id];
        pay(offered, 'purchase', `买入${d.name}`, item.id); item.owner = 'player'; item.location = 'counter'; item.cost = offered; item.acquiredDay = s.day; s.items.push(clone(item));
        if (!s.discovered.includes(d.id)) s.discovered.push(d.id);
        say(`以 ${offered} 买下${d.name}。货物在谈判台上，请拖入仓库。`, 'trade');
      } else {
        v.budget=buyerBudget-offered;fulfillDemand(v,1);
        earn(offered, 'sale', `卖出${d.name}，总成本 ${item.cost}，毛利 ${offered - item.cost}`, item.id); s.items = s.items.filter(i => i.id !== item.id); say(`${d.name}成交 ${offered}；账面毛利 ${offered - item.cost}。`, 'trade');
        if (s.challenge?.id === 'rare-trade' && d.rarity >= 3 && item.authentic) s.challenge.progress++;
      }
      tradeReceipt(v,[item],offered);s.records.trades++; gainXp(s, BALANCE.tradeXp); s.reputation++; finishVisitor(v); break;
    }
    case 'reject': { const v = currentVisitor(action.visitorId); if (!v) return fail('该客户已离开。'); finishVisitor(v); say('礼貌谢绝，保留工时和现金。'); break; }
    case 'callVisitor': {
      const v=s.visitors[s.visitorIndex];
      if(!v)return fail('今日来客已接待完毕。');
      if(s.visitorArrived!==false&&!v.resolved)return fail('请先完成当前接待。');
      if(v.resolved){if(s.visitorIndex>=s.visitors.length-1)return fail('今日来客已接待完毕。');s.visitorIndex++;}
      s.visitorArrived=true;const c=CHARACTERS.find(c=>c.id===s.visitors[s.visitorIndex]!.characterId);say(`叫号完成，${c?.name??'顾客'}来到门前。`,'arrival');break;
    }
    case 'nextVisitor': { const v = s.visitors[s.visitorIndex]; if (v && !v.resolved) return fail('请先完成或拒绝当前客户的请求。'); if (s.visitorIndex >= s.visitors.length - 1) return fail('预约客户已经到齐，可整理库存或闭店。'); s.visitorIndex++; s.visitorArrived=true; const next = s.visitors[s.visitorIndex]!; const c = CHARACTERS.find(c => c.id === next.characterId); say(c ? `${c.name}进店。${visitorGreeting(s,next)}` : '下一位客户进店。', 'arrival'); break; }
    case 'acceptRepair': {
      let v = action.visitorId ? currentVisitor(action.visitorId) : undefined;
      if (action.visitorId && (!v || v.kind !== 'repair')) return fail('这件委托已处理。');
      // One mutual-aid bench is reserved outside commercial capacity so empty cash plus stalled own work never locks recovery.
      if (action.visitorId && s.orders.filter(o => !o.delivered).length >= BALANCE.maxOrders) return fail('在手工单已达 6 件，请先完成其中一件；救急援助仍有专用工位。');
      if (!v) { if (s.orders.some(o => !o.delivered && o.description.includes('街坊救急'))) return fail('已有一件街坊救急单，先完成它即可赚取现金。'); v = makeVisitor(s, 'repair', 'electronics'); const civil = ITEMS.find(d => d.certificate === 'civil')!; v.item = createItem(s, civil, 'customer', [FAULTS.find(f => f.certificate === 'civil' && f.operation === 'clean')?.id ?? FAULTS.find(f => f.certificate === 'civil')!.id]); }
      const item = clone(v.item!); if (!canRepair(item)) return fail('尚未取得这类设备的维修证书。');
      s.items.push(item); const o = makeOrder(item, 'client', v.characterId);
      if (!action.visitorId) o.description = `街坊救急：${o.description}`;
      else finishVisitor(v);
      say(`已接单：${def(item).name}。材料预付款 ${o.escrow} 已进入专款账户，完成后收入 ${o.reward}。`); break;
    }
    case 'startRepair': {
      const item = findItem(action.itemId); if (!item || item.owner !== 'player' || item.location === 'display') return fail('请选择货架上的自有旧货。');
      if (!canRepair(item)) return fail('该物品不适用已取得的维修能力；食品、原材料和加密内容不能按电子维修处理。');
      if (activeOrder(item.id)) return fail('该物品已经有工单。');
      if (item.faults.length === 0 && item.condition >= 90) return fail('功能和品相已经良好，无需翻新。');
      if (s.orders.filter(o => !o.delivered).length >= BALANCE.maxOrders) return fail('请先完成已有工单。');
      makeOrder(item, 'own', 'player'); say('已放上工作台，翻新成本将计入该物品。'); break;
    }
    case 'diagnose': {
      const { order, item } = orderItem(action.orderId); if (!order || !item) return fail('找不到进行中的工单。'); if (order.diagnosed) return fail('已经检测过，无需重复消耗工时。');
      if (!spendHours(Math.max(.5, BALANCE.diagnosisHours - skillEffect(s, 'diagnosis') * .5 - (ownedEquipment(s, 'scan') ? .5 : 0)))) return fail('工时不足，工单会保留至明天。');
      order.diagnosed = true; order.conditionBefore ??= item.condition; if (!item.known.includes('diagnosed')) item.known.push('diagnosed');
      say(item.faults.length ? `检测完成，发现 ${item.faults.length} 项故障。请对照下方线索选择工序与操作位置。` : '功能正常，可做一次清洁恢复品相后复检。'); break;
    }
    case 'repair': {
      const { order, item } = orderItem(action.orderId); if (!order || !item || !order.diagnosed) return fail('先检测工单，再选择操作。');
      if (order.verified) return fail('已通过复检，请交付。');
      const faults = item.faults.map(id => FAULTS.find(f => f.id === id)!);
      let fault = faults.find(f => (!action.faultId || f.id === action.faultId) && f.operation === action.operation && (action.operation === 'clean' || f.module === action.module));
      if (action.quick) { fault = action.faultId ? faults.find(f=>f.id===action.faultId) : faults[0]; if (!fault || (s.records.faults[fault.id] ?? 0) < repairPracticeNeeded(s)) return fail(has(s, 'standard') ? '标准工序仍需先亲手完成过一次同类故障。' : '该故障需要熟练处理 3 次后才能使用快捷工序。'); }
      const cosmetic = !faults.length && action.operation === 'clean' && order.completedOps === 0;
      if ((action.quick ? fault?.operation : action.operation) === 'replace' && !ownedEquipment(s, 'solder') && order.kind !== 'exam') return fail('模块更换需要微焊工具。');
      const correct = cosmetic || (fault && (action.quick || fault.operation !== 'calibrate' || (typeof action.value === 'number' && Math.abs(action.value - fault.target) <= calibrationTolerance(s))));
      const preserve = !!action.preserve && def(item).category === 'antique' && fault?.operation === 'replace';
      const hours = correct ? Math.max(BALANCE.minimumOperationHours, (fault?.hours ?? 1) + (preserve ? 1 : 0) - (fault?.operation === 'replace' ? skillEffect(s, 'assembly') * .5 + (ownedEquipment(s, 'assemblyTool') ? .5 : 0) : 0) - (has(s, 'workshopMaster') ? .5 : 0) - (ownedEquipment(s, 'bench') > 1 ? .5 : 0)) : 1;
      if (!spendHours(hours)) return fail('剩余工时不足；闭店后可继续同一工单。');
      const logStep=(result:'fixed'|'cleaned'|'miss')=>{order.steps=[...(order.steps??[]),{day:s.day,operation:action.quick&&fault?fault.operation:action.operation,module:fault?.module??action.module?.slice(0,80),faultId:fault?.id,result,hours,preserve}].slice(-64);};
      if (!correct) { logStep('miss'); say(`操作未解决问题，消耗 1 工时。${action.operation === 'replace' ? '请对照检测结果选择故障模块。' : action.operation === 'calibrate' ? '读数偏离目标，请重新设置参数。' : '该故障需要更换模块或校准。'}`, 'error'); break; }
      const materialId = preserve ? equipmentId('parts') : fault?.material ?? equipmentId('cleaner');
      const material = EQUIPMENT.find(e => e.id === materialId); const materialPrice = material?.price ?? 20;
      const materialCost = round(materialPrice * (1 - Math.min(.5, skillEffect(s, 'materials'))));
      let materialSummary = `材料专款 ${materialCost}`;
      if (order.kind === 'own') {
        const savedMaterial = has(s, 'materials') && (Object.values(s.records.faults).reduce((n, count) => n + count, 0) + 1) % 4 === 0;
        if (savedMaterial) { ledger(s, 'material-saving', 0, '耗材管理：本次利用余料完成工序', item.id); materialSummary='使用余料，未取用库存或现金'; }
        else if ((s.equipment[materialId] ?? 0) > 0) { const usedCost = Math.floor((s.equipmentCosts[materialId] ?? 0) / s.equipment[materialId]!); s.equipment[materialId]!--; s.equipmentCosts[materialId] = (s.equipmentCosts[materialId] ?? 0) - usedCost; item.cost += usedCost; ledger(s, 'material-use', 0, `翻新消耗${material?.name ?? materialId}，按实际采购成本计入物品 ${usedCost}`, item.id); materialSummary=`库存${material?.name ?? materialId} × 1，计入成本 ${usedCost}`; }
        else if (s.cash >= materialCost) { pay(materialCost, 'repair-material', '翻新耗材', item.id); item.cost += materialCost; materialSummary=`现金补充耗材 ${materialCost}`; }
        else return fail('翻新耗材不足。客户维修的预付款可以支持零现金接单。');
      } else { if (order.escrow < materialCost) return fail('预付材料不足，请闭店后领取客户追加的材料包。'); order.escrow -= materialCost; ledger(s, 'escrow-material', 0, `客户专款支出 ${materialCost}，不计入自由现金`, item.id); }
      if (fault) { item.faults = item.faults.filter(f => f !== fault!.id); s.records.faults[fault.id] = (s.records.faults[fault.id] ?? 0) + 1; }
      item.condition = clamp(item.condition + 14 + skillEffect(s, 'restoration'), 0, 100);
      if (fault?.operation === 'replace' && def(item).category === 'antique' && !preserve) item.originality = clamp(item.originality - (has(s, 'rebirthMaster') ? 5 : 18), 0, 100);
      if (fault?.operation === 'replace' && !preserve && order.kind === 'own' && has(s, 'recycle')) { const key = equipmentId('parts'); s.equipment[key] = (s.equipment[key] ?? 0) + 1; }
      logStep(fault?'fixed':'cleaned'); order.completedOps++; say(`${fault?.name ?? '表面清洁'}已完成，耗时 ${hours}；${materialSummary}。`, 'repair'); break;
    }
    case 'verify': {
      const { order, item } = orderItem(action.orderId); if (!order || !item || !order.diagnosed) return fail('请先检测。'); if (order.verified) return fail('已经通过复检。');
      if (!spendHours(Math.max(.5, BALANCE.verificationHours - skillEffect(s, 'verification') * .5))) return fail('工时不足。');
      if (item.faults.length || !order.completedOps) { say(`复检未通过：${item.faults.length ? '仍有功能故障' : '尚未执行修复工序'}，请继续处理。培训费用不会重复收取。`, 'error'); break; }
      order.verified = true; item.known = [...new Set([...item.known, 'basic', 'scan', 'restored'])]; say('复检通过，可以交付。', 'repair'); break;
    }
    case 'deliver': {
      const { order, item } = orderItem(action.orderId); if (!order || !item || !order.verified || item.faults.length) return fail('需要完成修复并通过复检后交付。');
      const cashBefore=s.cash;
      order.delivered = true; order.escrow = 0;
      if (order.kind === 'own') { item.location = 'stock'; s.records.repairs++; gainXp(s, BALANCE.repairXp); say(`翻新完成，总成本 ${item.cost}，可以出售或鉴定陈列。`, 'repair'); }
      else {
        s.items = s.items.filter(i => i.id !== item.id);
        if (order.kind === 'exam' && order.certificate) {
          if (!s.certificates.includes(order.certificate)) { s.certificates.push(order.certificate); const cert = CERTIFICATES.find(c => c.id === order.certificate)!; for (const tool of cert.tools) s.equipment[tool] = Math.max(1, s.equipment[tool] ?? 0); gainXp(s, BALANCE.examXp); say(`通过${cert.name}考核，已发放基础工具。`, 'success'); }
        } else {
          let reward = order.reward;
          if (order.preserveOriginal && item.originality < 50) { reward = round(reward * .75); say('功能恢复了，但原貌损失超过委托期望，报酬减少四分之一。'); }
          earn(reward, 'repair-income', order.description, item.id); s.records.repairIncome += reward; s.records.repairs++; s.reputation += 2; gainXp(s, BALANCE.repairXp + (def(item).certificate === 'civil' ? 0 : 8));
          const p = CHARACTERS.find(c => c.id === order.characterId); if (p) { s.relations[p.group] = (s.relations[p.group] ?? 0) + 1; if (!s.met.includes(p.id)) s.met.push(p.id); }
          if (order.kind === 'final') { s.finalStage++; if (s.finalStage >= 3) { s.finalComplete = true; const milestone = PROFESSIONS.find(p => p.id === 'restorer')!.finalMilestone; if (!s.professionMilestones.includes(milestone)) s.professionMilestones.push(milestone); say('街区联络中枢恢复了信号，最终委托完成。接下来可以收购经营权。'); } }
          if (s.challenge?.id === 'batch-repair') s.challenge.progress++;
          say(`交付完成，收到 ${reward} 信用点。剩余材料预付款归还客户。`, 'repair');
        }
      }
      s.repairHistory=[...(s.repairHistory??[]),{orderId:order.id,definitionId:item.definitionId,characterId:order.characterId,kind:order.kind,receivedDay:order.receivedDay,day:s.day,conditionBefore:order.conditionBefore,conditionAfter:item.condition,completedOps:order.completedOps,steps:order.steps??[],reward:s.cash-cashBefore}].slice(-80);
      break;
    }
    case 'train': {
      const cert = CERTIFICATES.find(c => c.id === action.certificate); if (!cert) return fail('未知证书。');
      if (s.trained.includes(cert.id)) return fail('培训已完成，可以免费重试考核。');
      if (s.chapter < cert.chapter || s.records.repairs < cert.cases || (cert.id === 'antique' && !s.endless)) return fail(`需要第 ${cert.chapter} 章、完成 ${cert.cases} 个案例${cert.id === 'antique' ? '，并进入无尽模式' : ''}。`);
      if (s.cash < cert.fee) return fail('培训现金不足，先接基础维修积累收入。'); pay(cert.fee, 'training', cert.name); s.trained.push(cert.id); say(`完成${cert.name}培训。考核使用真实维修流程，重试免费。`); break;
    }
    case 'exam': {
      const cert = CERTIFICATES.find(c => c.id === action.certificate); if (!cert || !s.trained.includes(cert.id)) return fail('请先完成对应培训。'); if (s.certificates.includes(cert.id)) return fail('已经取得这张证书。');
      const old = s.orders.find(o => o.kind === 'exam' && o.certificate === cert.id && !o.delivered);
      if (old) { s.items = s.items.filter(i => i.id !== old.itemId); s.orders = s.orders.filter(o => o.id !== old.id); }
      const d = ITEMS.find(d => d.id === cert.examItem); if (!d) return fail('考核内容缺失。'); const item = createItem(s, d, 'customer', cert.examFaults); s.items.push(item); makeOrder(item, 'exam', 'examiner', { certificate: cert.id, reward: 0 }); say(`${cert.name}考核开始。请检测、维修、复检并交付。`); break;
    }
    case 'learn': {
      if (s.skills.includes(action.skillId)) return fail('已学习这项技能。'); const n = SKILLS.find(n => n.id === action.skillId); if (!n) return fail('未知技能。');
      const total = s.points + SKILLS.filter(n => s.skills.includes(n.id)).reduce((n, a) => n + a.cost, 0); const error = validSkills([...s.skills, n.id], total); if (error) return fail(error);
      s.points -= n.cost; s.skills.push(n.id); say(`学会${n.name}：${n.description}`); break;
    }
    case 'respec': {
      if (s.phase !== 'closed' || s.orders.some(o => !o.delivered)) return fail('需要闭店并完成所有在手工单后重配。');
      const total = s.points + SKILLS.filter(n => s.skills.includes(n.id)).reduce((n, a) => n + a.cost, 0); const error = validSkills(action.skills, total); if (error) return fail(error);
      if (!s.freeRespec && s.cash < BALANCE.respecPrice) return fail('重配费用不足。');
      if (!s.freeRespec) pay(BALANCE.respecPrice, 'respec', '技能重配'); s.freeRespec = false; s.skills = [...action.skills]; s.points = total - SKILLS.filter(n => s.skills.includes(n.id)).reduce((n, a) => n + a.cost, 0);
      say('技能重配完成，证书、委托和收藏均保留。超过新容量的物品会保留，腾出空间后才能继续入库。'); break;
    }
    case 'license': { if (s.licenses.includes('regulated-trade')) return fail('已取得交易许可。'); if (s.chapter < 3) return fail('第三章开放通用受管制商品交易许可。'); if (s.cash < licensePrice(s)) return fail('许可费用不足。'); pay(licensePrice(s), 'license', '通用交易许可'); s.licenses.push('regulated-trade'); say('获准交易受管制的神经与医疗器件。'); break; }
    case 'buyEquipment': {
      const e = EQUIPMENT.find(e => e.id === action.equipmentId); const count = action.count ?? 1;
      if (!e || !Number.isSafeInteger(count) || count < 1 || count > BALANCE.maximumPurchaseCount) return fail('购买数量无效。');
      const owned = s.equipment[e.id] ?? 0; if (e.type === 'tool' && owned) return fail('这件工具已经拥有。');
      if (e.type !== 'material' && count !== 1) return fail('工具和设施一次购买一件。');
      if (e.type === 'facility' && owned >= (e.effect === 'storage' ? 3 : e.effect === 'bench' ? 2 : 1)) return fail('该设施已达当前升级上限。');
      const cost = equipmentPrice(s,e,count); if (s.cash < cost) return fail('现金不足。');
      pay(cost, 'equipment', `${e.name} × ${count}`); s.equipment[e.id] = owned + count; s.equipmentCosts[e.id] = (s.equipmentCosts[e.id] ?? 0) + cost; say(`购入${e.name} × ${count}。${e.description}`); break;
    }
    case 'display': {
      const item = findItem(action.itemId); if (!item || item.owner !== 'player' || item.location !== 'stock' || activeOrder(item.id)) return fail('只能陈列货架上的自有物品。');
      if (!item.known.includes('serial') || !item.authentic) return fail('必须经序列核验确认为真实物品后才能陈列。');
      if (s.items.filter(i => i.location === 'display').length >= displayCapacity(s)) return fail('展示柜已满，可撤下一件或升级展示柜。');
      item.location = 'display'; delete item.containerId; delete item.grid; say(`${def(item).name}已入柜，普通交易不会出售它。当前吸引力 ${attraction(s)}。`, 'display'); break;
    }
    case 'withdraw': { const item = findItem(action.itemId); if (!item || item.location !== 'display' || item.owner !== 'player') return fail('找不到展品。'); item.location = 'stock'; say('展品已撤回货架；库存超容量时仍保留物品。', 'display'); break; }
    case 'preserve': { const item = findItem(action.itemId); if (!item || item.owner !== 'player' || def(item).category !== 'food' || item.expiresDay === null) return fail('请选择自有食品或生物制品。'); if (item.expiresDay < s.day) return fail('已经过期，不能通过保鲜恢复。'); if (item.preservedUntil > 0) return fail('这批商品已经使用过保鲜包。'); const key = equipmentId('preserveSupply'); if (!(s.equipment[key] > 0)) return fail('没有保鲜包。'); const usedCost = Math.floor((s.equipmentCosts[key] ?? 0) / s.equipment[key]!); s.equipment[key]!--; s.equipmentCosts[key] = (s.equipmentCosts[key] ?? 0) - usedCost; const days = 2 + skillEffect(s, 'preservation'); item.expiresDay += days; item.preservedUntil = item.expiresDay; item.cost += usedCost; say(`保鲜后有效期延长至第 ${item.expiresDay} 日。`); break; }
    case 'liquidate': { const item = findItem(action.itemId); if (!item || item.owner !== 'player' || item.location !== 'stock' || activeOrder(item.id)) return fail('只能清理货架上的自有商品。'); if (def(item).regulated && !s.licenses.includes('regulated-trade')) return fail('受管制商品需要合法交易许可。'); const price = round(itemValue(s, item) * BALANCE.liquidateFactor); earn(price, 'clearance', `清货${def(item).name}，总成本 ${item.cost}`, item.id); s.items = s.items.filter(i => i.id !== item.id); s.records.trades++; gainXp(s, 2); say(`清货完成，回笼 ${price}。`, 'trade'); break; }
    case 'sort': { if (s.phase === 'open' && !spendHours(has(s, 'restock') ? 0 : .5)) return fail('整理需要半点工时，闭店后可免费整理。'); s.items.forEach(i => { if (i.location === 'stock' && !i.containerId) delete i.grid; }); s.items.sort((a, b) => (a.expiresDay ?? Infinity) - (b.expiresDay ?? Infinity) || def(a).category.localeCompare(def(b).category)); say('货架按临期优先、品类归位；持有快捷补货技能时耗材采购自动享受折扣。'); break; }
    case 'appoint': { if (action.category !== null && !CATEGORIES.some(c => c.id === action.category)) return fail('未知商品分类。'); if (action.category && !has(s, 'targetSupply')) return fail('先学习定向采购。'); s.appointments = action.category; say(action.category ? '已预约下一营业日的定向货源。' : '已恢复自然来访。'); break; }
    case 'eventChoice': { const e = EVENTS.find(e => e.id === s.eventId); const choice = e?.choices[action.index]; if (!choice || s.eventResolved) return fail('该事件已经结算或选项无效。'); if (choice.cash < 0 && s.cash < -choice.cash) return fail('这项街区行动需要更多现金，可以选择另一方案。'); if (choice.cash < 0) pay(-choice.cash, 'event', choice.label); else if (choice.cash > 0) earn(choice.cash, 'event', choice.label); else ledger(s, 'event', 0, choice.label); s.reputation += choice.reputation; s.relations[choice.group] = (s.relations[choice.group] ?? 0) + choice.relation; for(const [group,change] of Object.entries(choice.otherRelations??{}))s.relations[group]=(s.relations[group]??0)+change; s.eventResolved = true; say(choice.description); break; }
    case 'claimQuest': { const q = QUESTS.find(q => q.id === action.questId); const stageIndex = s.questStages[action.questId] ?? 0; const stage = q?.stages[stageIndex]; if (!q || !stage || !questProgress(s, q.id).ready) return fail('该阶段尚未完成，或奖励已经领取。'); s.questStages[q.id] = stageIndex + 1; earn(stage.reward, 'quest', `${q.name}第 ${stageIndex + 1} 阶段`); gainXp(s, stage.xp); say(`${q.name}：${stage.text} 已完成，获得 ${stage.reward} 信用点与 ${stage.xp} 经验。`); break; }
    case 'startFinal': {
      if (!professionVictory(s, 'restorer').mastered || !s.certificates.includes('industrial') || !s.certificates.includes('neural') || s.chapter < 4) return fail('最终委托需要维修大师能力、工业及神经证书，并到达第四章。');
      if (s.finalComplete) return fail('最终委托已经完成。'); if (s.orders.some(o => o.kind === 'final' && !o.delivered)) return fail('先完成当前中枢工单。');
      const stages = [
        { item: 'servo-arm', faults: ['jammed-bearing', 'burnt-driver'] },
        { item: 'power-module', faults: ['insulation-leak', 'burnt-driver'] },
        { item: 'neural-bridge', faults: ['neural-noise', 'sensor-drift', 'feedback-loop'] },
      ];
      const stage = stages[s.finalStage]!; const d = ITEMS.find(d => d.id === stage.item)!; const fs = stage.faults.map(id => FAULTS.find(f => f.id === id)!);
      const item = createItem(s, d, 'customer', fs.map(f => f.id)); s.items.push(item); makeOrder(item, 'final', 'lin-qiao', { finalStage: s.finalStage, reward: BALANCE.finalRewards[s.finalStage]!, description: ['街区联络中枢 · 机电传动恢复', '街区联络中枢 · 供能稳定', '街区联络中枢 · 神经接口联调'][s.finalStage]! }); say(`最终委托 ${s.finalStage + 1}/3 已受理。`); break;
    }
    case 'buyShop': { if (s.victory) return fail('已经拥有永久经营权。'); if (!PROFESSIONS.some(p => professionVictory(s, p.id).ready)) return fail('先取得同一已实现职业的大师能力并完成其最终委托。'); if (s.cash < BALANCE.shopPrice + s.debt) return fail(`需要 ${BALANCE.shopPrice} 收购款，并结清 ${s.debt} 欠费。`); pay(BALANCE.shopPrice + s.debt, 'ownership', '购买永久经营权并结清欠费'); s.debt = 0; s.grace = 0; s.victory = true; s.phase = 'won'; say('招牌上的名字终于属于你。职业最终委托已经完成，永久经营权正式登记。', 'success'); break; }
    case 'continueEndless': { if (!s.victory || !['won', 'ended'].includes(s.phase)) return fail('完成主线后可继续无尽经营。'); s.endless = true; s.phase = 'closed'; say('进入无尽经营：永久免租，古董科技考核和新客户开放，经验继续产生技能点。'); break; }
    case 'endGame': { if (!s.victory || s.phase !== 'won') return fail('结局尚未完成。'); s.phase = 'ended'; say('结局已保存。这间店和街区会记住你的名字。'); break; }
    case 'challenge': { if (!s.endless) return fail('珍品订单与批量维修在无尽模式开放。'); if (s.challenge) return fail('已有一项挑战在进行。'); const challenge = CHALLENGES.find(c => c.id === action.id); if (!challenge) return fail('未知挑战。'); if (s.cash < challenge.fee) return fail(`该订单需支付 ${challenge.fee} 登记费。`); if (challenge.fee) pay(challenge.fee, 'challenge-entry', challenge.name); s.challenge = { id: challenge.id, goal: challenge.goal, progress: 0, deadline: s.day + challenge.days, reward: challenge.reward }; say(`接受${challenge.name}：${challenge.description} 截止第 ${s.challenge.deadline} 日，奖励 ${s.challenge.reward}。失败仅失去本次奖励及已投入费用。`); break; }
    case 'closeDay': {
      if (s.phase !== 'open') return fail('已经闭店。');
      if (ownedObjects(s).some(i=>i.location==='counter')) return fail('谈判台还有物品，请全部收入仓库后再闭店。');
      const fees = operatingFees(s); const due = fees + s.debt; const paid = Math.min(s.cash, due); pay(paid, 'daily-fee', `营业维护${s.victory ? '' : '与租金'}，应付 ${due}`); s.debt = due - paid;
      if (s.debt > 0) s.grace++; else s.grace = 0;
      s.phase = !s.victory && s.grace > BALANCE.graceDays ? 'failed' : 'closed'; s.records.days++; gainXp(s, BALANCE.dayXp);
      if (s.challenge) { if (s.challenge.id === 'exhibition') s.challenge.progress = attraction(s); if (s.challenge.progress >= s.challenge.goal) { earn(s.challenge.reward, 'challenge', '无尽挑战完成'); gainXp(s, 60); say('挑战完成，奖励已结算。'); s.challenge = null; } else if (s.day >= s.challenge.deadline) { say('本次可选挑战到期；经营权与已有藏品均保留。'); s.challenge = null; } }
      for(const job of s.deliveries)if(job.status==='active'&&job.deadline<=s.day){job.status='expired';job.closedDay=s.day;say(`「${deliveryDefinition(job).title}」已过交期，库存和现金保留。`);}
      say(s.phase === 'failed' ? '补救期已过，店铺暂停营业。可恢复当日开始备份，或重新开局。' : s.debt ? `闭店：仍欠 ${s.debt}。${s.victory?'永久经营权保留，欠费并入下次维护结算。':`还有 ${debtClosingChances(s)} 次营业日结可补救。`}基础维修与清货可以恢复现金。` : `第 ${s.day} 日结算，支出 ${paid}。明天继续。`, 'day'); break;
    }
    case 'openDay': {
      if (s.phase !== 'closed') return fail('请先闭店结算。'); s.day++; s.hours = dailyHours(s); s.phase = 'open';
      for (const item of s.items) if (item.owner === 'player' && item.expiresDay !== null && item.expiresDay >= s.day - 1 && ownedEquipment(s, 'cold') && s.day % 2 === 0) item.expiresDay++;
      for (const order of s.orders) if (!order.delivered && order.kind !== 'own' && order.escrow < 300) order.escrow = 300;
      generateDay(s); say(`第 ${s.day} 日开门，${dailyHours(s)} 工时、${BALANCE.visitors} 位预约访客。`, 'day'); break;
    }
    default: return fail('未知操作。');
  }
  const layout = rootLayout(s, rootCapacity(s));
  for (const item of ownedObjects(s)) if (layout.positions[item.id]) item.grid = layout.positions[item.id];
  for (const c of s.containers ?? []) { const inside = containerLayout(s, c); for (const item of ownedObjects(s)) if (inside.positions[item.id]) item.grid = inside.positions[item.id]; }
  milestone(s); return { state: s, events, ok: true };
}

/** Deliberately omits the RNG, truth flags, hidden faults and negotiation limits. */
export function visibleState(s: GameState) {
  const visibleItem = (i: ItemInstance) => {
    const d = def(i); const basic = i.known.includes('basic') || i.known.includes('diagnosed'); const scan = i.known.includes('scan') || i.known.includes('batch'); const serial = i.known.includes('serial');
    return { id: i.id, definitionId: d.id, name: d.name, category: d.category, owner: i.owner, location: i.location, known: i.known,
      containerId: i.containerId, accessible: itemAccessible(s, i),
      condition: basic ? i.condition : undefined, estimate: basic ? estimateValue(s, i) : undefined, cost: i.owner === 'player' ? i.cost : undefined,
      capacity: scan && d.category === 'energy' ? i.capacity : undefined, purity: scan && d.category === 'energy' ? i.purity : undefined,
      integrity: scan && d.category === 'data' ? i.integrity : undefined, compatibility: scan && d.category === 'neural' ? i.compatibility : undefined,
      expiresDay: basic && d.category === 'food' ? i.expiresDay : undefined, authentic: serial ? i.authentic : undefined, provenance: serial ? i.provenance : undefined, originality: serial ? i.originality : undefined,
      faults: i.known.includes('diagnosed') ? i.faults.map(id => FAULTS.find(f => f.id === id)) : undefined,
      salvageEstimate: has(s, 'salvageValue') && basic && d.certificate ? [round(d.price * .7), round(d.price * 1.1)] : undefined };
  };
  const visitor = s.visitors[s.visitorIndex];
  return { coordinates: '店铺场景原点左上，x 向右，y 向下；经营时间仅动作推进。', day: s.day, chapter: s.chapter, phase: s.phase, cash: s.cash, hours: s.hours, maxHours: dailyHours(s), debt: s.debt, grace: s.grace,
    xp: s.xp, level: s.level, points: s.points, skills: s.skills, certificates: s.certificates, trained: s.trained, licenses: s.licenses, equipment: s.equipment,
    stockUsage: stockUsage(s), capacity: capacity(s), rootCapacity: rootCapacity(s), labeler: s.labeler ?? false, modifiers:s.modifiers??[], containers:(s.containers??[]).map(c=>({...c,name:storageStyle(c.styleId).name,layout:containerLayout(s,c),columns:storageStyle(c.styleId).columns,rows:storageStyle(c.styleId).rows,path:containerTrail(s,c.id)?.map(p=>p.id)})), displayCapacity: displayCapacity(s), attraction: attraction(s), items: s.items.map(visibleItem),
    visitorArrived: s.visitorArrived !== false, warehouse: rootLayout(s, rootCapacity(s)), tutorial: s.tutorial, conversations: s.conversations,
    visitor: visitor ? { id: visitor.id, characterId: visitor.characterId, kind: visitor.kind, category: visitor.category, quote: visitor.quote, rounds: visitor.rounds, patience: visitor.patience, resolved: visitor.resolved, request: visitor.request, greeting:visitorGreeting(s,visitor), goods: visitor.goods?.map(i=>({...visibleItem(i),quote:tradeQuote(s,visitor,i)})), storageGoods:visitor.storageGoods,demand:visitor.demand, budget: visitor.budget, negotiation:visitor.negotiation,lastTrade:visitor.lastTrade, item: visitor.item ? visibleItem(visitor.item) : undefined } : null,
    upcoming: has(s, 'supplyPreview') ? s.visitors.slice(s.visitorIndex + 1).map(v => ({ kind: v.kind, category: v.category })) : undefined,
    visitorIndex: s.visitorIndex, visitorCount: s.visitors.length, orders: s.orders.filter(o => !o.delivered).map(o => ({ ...o })),
    eventId: s.eventId, eventResolved: s.eventResolved, questStages: s.questStages, reputation: s.reputation, relations: s.relations, factions:factionContacts(s), factionAppointment:s.factionAppointment??null, records: s.records, repairHistory:s.repairHistory??[], deliveries:deliveryJobs(s),
    finalStage: s.finalStage, finalComplete: s.finalComplete, professionMilestones: s.professionMilestones, professions: PROFESSIONS.filter(p => p.implemented).map(p => professionVictory(s, p.id)), victory: s.victory, endless: s.endless, challenge: s.challenge, messages: s.messages.slice(-5) };
}
