import { ITEMS, FAULTS, SKILLS, CERTIFICATES, EQUIPMENT, CHARACTERS, EVENTS, QUESTS, CATEGORIES, PROFESSIONS } from '../content';
import { BALANCE, CONTENT_VERSION, SAVE_VERSION } from '../game/balance';
import { MAX_CONTAINER_DEPTH, LABEL_COLORS, validContainerLabel, containerLayout, containerTrail, ownedObjects } from '../game/containers';
import { STORAGE_STYLES } from '../content/storage';
import { faction } from '../content/factions';
import { validRotation } from '../game/warehouse';
import { validModifiers, dailyHours } from '../game/modifiers';
import { DELIVERIES } from '../content/deliveries';
import type { GameState, ItemInstance } from '../game/types';

export const SAVE_KEY = 'cyber-shop:save:v1';
export const DAY_BACKUP_KEY = 'cyber-shop:day-start:v1';
export interface StorageLike { getItem(key: string): string | null; setItem(key: string, value: string): void; removeItem(key: string): void }
export interface LoadResult { state: GameState | null; error: string | null }
export interface WriteResult { ok: boolean; error: string | null }
const errorText = (e: unknown) => e instanceof Error ? e.message : String(e);
function check(value: unknown, message: string): asserts value { if (!value) throw new Error(message); }
function checksum(text: string) { let hash = 0x811c9dc5; for (let i = 0; i < text.length; i++) { hash ^= text.charCodeAt(i); hash = Math.imul(hash, 0x01000193); } return (hash >>> 0).toString(16).padStart(8, '0'); }
const object = (v: unknown): v is Record<string, unknown> => typeof v === 'object' && v !== null && !Array.isArray(v);
const number = (v: unknown) => typeof v === 'number' && Number.isFinite(v) && v >= 0;
const integer = (v: unknown) => number(v) && Number.isSafeInteger(v);
const strings = (v: unknown): v is string[] => Array.isArray(v) && v.every(a => typeof a === 'string') && new Set(v).size === v.length;
const refs = (values: string[], ids: string[]) => values.every(v => ids.includes(v));
function validateRepairSteps(value:unknown,day:number){
  check(Array.isArray(value)&&value.length<=64,'工序记录无效。');
  for(const step of value){
    check(object(step)&&integer(step.day)&&Number(step.day)>=1&&Number(step.day)<=day&&['clean','replace','calibrate'].includes(String(step.operation))&&['fixed','cleaned','miss'].includes(String(step.result)),'工序内容无效。');
    check(number(step.hours)&&Number(step.hours)>=.5&&Number(step.hours)<=BALANCE.hours&&Number(step.hours)*2%1===0&&typeof step.preserve==='boolean','工序工时无效。');
    check(step.module===undefined||(typeof step.module==='string'&&step.module.length<=80),'工序位置无效。');
    check(step.faultId===undefined||FAULTS.some(f=>f.id===step.faultId),'工序故障无效。');
    check(step.result!=='fixed'||typeof step.faultId==='string','已修复工序缺少故障。');
  }
}

/** The import boundary checks structure, identifiers and ownership before replacing live state. */
export function validateState(value: unknown): asserts value is GameState {
  check(object(value), '存档状态不是有效对象。');
  const s = value as unknown as GameState;
  check(s.version === SAVE_VERSION && s.contentVersion === CONTENT_VERSION && s.balanceVersion === BALANCE.version, '存档结构、内容或数值版本不兼容，请保留原文件。');
  for (const key of ['seed', 'rng', 'serial', 'day', 'chapter', 'cash', 'debt', 'grace', 'xp', 'level', 'points', 'visitorIndex', 'finalStage'] as const) check(integer(s[key]), `存档字段 ${key} 无效。`);
  if(s.modifiers!==undefined)check(validModifiers(s.modifiers),'开局词条无效或相互冲突。');
  check(number(s.hours) && s.hours <= dailyHours(s) && s.hours * 2 % 1 === 0, '工时无效。');
  check(s.day >= 1 && s.chapter >= 1 && s.chapter <= 4 && s.level >= 1 && s.finalStage <= 3 && s.rng <= 0xffffffff && s.seed <= 0xffffffff, '进度字段超出范围。');
  check(['open', 'closed', 'won', 'ended', 'failed'].includes(s.phase), '营业阶段无效。');
  for (const key of ['eventResolved', 'finalComplete', 'victory', 'endless', 'freeRespec'] as const) check(typeof s[key] === 'boolean', `存档字段 ${key} 无效。`);
  check(Number.isFinite(s.reputation), '声望无效。');
  check(strings(s.skills) && refs(s.skills, SKILLS.map(a => a.id)), '技能记录无效。');
  check(strings(s.certificates) && refs(s.certificates, CERTIFICATES.map(a => a.id)) && s.certificates.includes('civil'), '证书记录无效。');
  check(strings(s.trained) && refs(s.trained, CERTIFICATES.map(a => a.id)), '培训记录无效。');
  check(strings(s.licenses) && refs(s.licenses, ['regulated-trade']), '交易许可记录无效。');
  check(strings(s.discovered) && refs(s.discovered, ITEMS.map(a => a.id)), '图鉴记录无效。');
  check(strings(s.met) && refs(s.met, CHARACTERS.map(a => a.id)), '人物记录无效。');
  check(strings(s.professionMilestones) && refs(s.professionMilestones, PROFESSIONS.map(p => p.finalMilestone)), '职业里程碑记录无效。');
  check(s.factionAppointment===undefined || typeof s.factionAppointment==='string' && !!faction(s.factionAppointment), '联络预约无效。');
  check(s.appointments === null || CATEGORIES.some(c => c.id === s.appointments), '预约分类无效。');
  check(EVENTS.some(e => e.id === s.eventId), '街区事件无效。');
  check(object(s.equipment) && Object.entries(s.equipment).every(([id, count]) => EQUIPMENT.some(e => e.id === id) && integer(count)), '道具数量无效。');
  check(object(s.equipmentCosts) && Object.entries(s.equipmentCosts).every(([id, cost]) => EQUIPMENT.some(e => e.id === id) && integer(cost)), '道具成本无效。');
  check(object(s.relations) && Object.values(s.relations).every(n => typeof n === 'number' && Number.isFinite(n)), '关系记录无效。');
  check(object(s.questStages) && Object.entries(s.questStages).every(([id, stage]) => { const q = QUESTS.find(q => q.id === id); return q && integer(stage) && stage <= q.stages.length; }), '人物委托进度无效。');
  check(object(s.records) && ['trades', 'repairs', 'revenue', 'repairIncome', 'days'].every(k => integer((s.records as unknown as Record<string, unknown>)[k])) && object(s.records.faults) && Object.entries(s.records.faults).every(([id, n]) => FAULTS.some(f => f.id === id) && integer(n)), '经营纪录无效。');
  for(const key of ['deliveries','deliveryIncome'] as const)if(s.records[key]!==undefined)check(integer(s.records[key]),'订货累计记录无效。');
  const validateItem = (i: ItemInstance) => {
    check(object(i) && typeof i.id === 'string' && ITEMS.some(d => d.id === i.definitionId), '物品模板无效。');
    if(i.reserved!==undefined)check(typeof i.reserved==='boolean'&&(!i.reserved||i.owner==='player'),'物品留货标记无效。');
    check(['player', 'customer'].includes(i.owner) && ['stock', 'display', 'workshop', 'counter'].includes(i.location), '物品归属或位置无效。');
    if (i.grid !== undefined) check(object(i.grid) && integer(i.grid.x) && integer(i.grid.y) && validRotation(i.grid.rotated), '仓库坐标无效。');
    if (i.counterGrid !== undefined) check(object(i.counterGrid) && integer(i.counterGrid.x) && integer(i.counterGrid.y) && validRotation(i.counterGrid.rotated), '谈判台坐标无效。');
    check(i.owner !== 'customer' || i.location === 'workshop', '客户物品不能属于货架或展示柜。');
    check(['condition', 'integrity', 'capacity', 'purity', 'originality'].every(k => number((i as unknown as Record<string, unknown>)[k]) && Number((i as unknown as Record<string, unknown>)[k]) <= 100), '物品属性超出范围。');
    check(typeof i.authentic === 'boolean' && typeof i.provenance === 'string' && typeof i.compatibility === 'string', '物品来源记录无效。');
    check((i.expiresDay === null || integer(i.expiresDay)) && integer(i.cost) && integer(i.acquiredDay) && integer(i.preservedUntil), '物品成本或保质期无效。');
    check(strings(i.faults) && refs(i.faults, FAULTS.map(a => a.id)) && strings(i.known) && refs(i.known, ['basic', 'scan', 'serial', 'batch', 'diagnosed', 'restored']), '物品检测记录无效。');
    const d = ITEMS.find(d => d.id === i.definitionId)!;
    check(!i.faults.length || (d.certificate && i.faults.every(id => FAULTS.find(f => f.id === id)?.certificate === d.certificate)), '该商品含不适用的故障。');
  };
  check(Array.isArray(s.items) && s.items.length < 10000, '库存数据无效。'); s.items.forEach(validateItem);
  check(new Set(s.items.map(i => i.id)).size === s.items.length, '存档含重复物品实例。');
  check(Array.isArray(s.visitors) && s.visitors.length === BALANCE.visitors && s.visitorIndex < s.visitors.length, '客户队列无效。');
  for (const v of s.visitors) {
    check(object(v) && typeof v.id === 'string' && CHARACTERS.some(c => c.id === v.characterId) && ['seller', 'buyer', 'repair'].includes(v.kind) && CATEGORIES.some(c => c.id === v.category), '客户记录无效。');
    check(integer(v.quote) && integer(v.limit) && integer(v.rounds) && integer(v.patience) && typeof v.resolved === 'boolean' && typeof v.request === 'string', '客户报价记录无效。');
    if (v.item) validateItem(v.item);
    if(v.goods !== undefined) { check(Array.isArray(v.goods) && v.goods.length <= 100 && new Set(v.goods.map(i=>i.id)).size === v.goods.length,'卖家货品列表无效。');v.goods.forEach(validateItem); }
    if(v.priceTags !== undefined) check(v.kind==='seller' && object(v.priceTags) && Array.isArray(v.goods) && Object.keys(v.priceTags).length===v.goods.length && v.goods.every(i=>{const tag=v.priceTags![i.id];return object(tag)&&integer(tag.ask)&&tag.ask>0&&integer(tag.minimum)&&tag.minimum>0&&tag.minimum<=tag.ask;}),'卖家逐件价签无效。');
    if(v.relationCredited!==undefined)check(typeof v.relationCredited==='boolean','往来记录无效。');
    if(v.demand!==undefined)check(v.kind==='buyer'&&object(v.demand)&&integer(v.demand.limit)&&v.demand.limit>=1&&v.demand.limit<=4&&integer(v.demand.fulfilled)&&v.demand.fulfilled<=v.demand.limit,'买家采购数量无效。');
    if(v.budget !== undefined) check(integer(v.budget),'买家预算无效。');
    if(v.buyerQuotes!==undefined)check(v.kind==='buyer'&&object(v.buyerQuotes)&&Object.values(v.buyerQuotes).every(q=>integer(q)&&q>0),'买家逐件还价无效。');
    if(v.negotiation!==undefined){
      const reply=v.negotiation;check(object(reply)&&v.kind!=='repair'&&strings(reply.itemIds)&&reply.itemIds.length>0&&integer(reply.offered)&&reply.offered>0&&integer(reply.quote)&&reply.quote>0,'议价往来无效。');
      check(integer(reply.round)&&reply.round>=1&&reply.round===v.rounds&&['counter','closed'].includes(reply.status),'议价轮次无效。');
      if(reply.reason!==undefined)check(['price','budget','far'].includes(reply.reason),'还价说明无效。');
    }
    if(v.lastTrade!==undefined){
      const receipt=v.lastTrade;check(object(receipt)&&receipt.kind===(v.kind==='seller'?'buy':v.kind==='buyer'?'sell':'')&&integer(receipt.amount)&&receipt.amount>0&&integer(receipt.cost),'成交回执无效。');
      check(Array.isArray(receipt.goods)&&receipt.goods.length>0&&receipt.goods.every(g=>object(g)&&typeof g.itemId==='string'&&(ITEMS.some(d=>d.id===g.definitionId)||STORAGE_STYLES.some(d=>d.id===g.definitionId))&&integer(g.cost)),'成交货品记录无效。');
      check(new Set(receipt.goods.map(g=>g.itemId)).size===receipt.goods.length&&receipt.goods.reduce((n,g)=>n+g.cost,0)===receipt.cost,'成交成本记录不一致。');
    }
  }
  check(Array.isArray(s.orders), '维修工单无效。');
  const activeItems = new Set<string>();
  for (const o of s.orders) {
    check(object(o) && typeof o.id === 'string' && typeof o.itemId === 'string' && typeof o.characterId === 'string' && typeof o.description === 'string' && ['client', 'exam', 'final', 'own'].includes(o.kind), '维修工单内容无效。');
    check(['diagnosed', 'verified', 'delivered', 'preserveOriginal'].every(k => typeof (o as unknown as Record<string, unknown>)[k] === 'boolean') && integer(o.escrow) && integer(o.reward) && integer(o.completedOps), '维修工单数值无效。');
    check(!o.certificate || CERTIFICATES.some(c => c.id === o.certificate), '考核证书无效。');
    if(o.receivedDay!==undefined)check(integer(o.receivedDay)&&o.receivedDay>=1&&o.receivedDay<=s.day,'收件日期无效。');
    if(o.conditionBefore!==undefined)check(o.diagnosed&&number(o.conditionBefore)&&o.conditionBefore<=100,'修前状态无效。');
    if(o.steps!==undefined)validateRepairSteps(o.steps,s.day);
    if (!o.delivered) { const item = s.items.find(i => i.id === o.itemId); check(item && item.location === 'workshop' && !activeItems.has(item.id), '进行中的工单物品缺失或重复。'); check(o.kind === 'own' ? item.owner === 'player' : item.owner === 'customer', '维修工单归属冲突。'); activeItems.add(item.id); }
  }
  check(new Set(s.orders.map(o => o.id)).size === s.orders.length, '存档含重复工单。');
  if(s.repairHistory!==undefined){
    check(Array.isArray(s.repairHistory)&&s.repairHistory.length<=80,'修复档案无效。');
    for(const receipt of s.repairHistory){
      check(object(receipt)&&typeof receipt.orderId==='string'&&ITEMS.some(i=>i.id===receipt.definitionId)&&['client','exam','final','own'].includes(receipt.kind),'修复档案内容无效。');
      check(receipt.kind==='own'?receipt.characterId==='player':receipt.kind==='exam'?receipt.characterId==='examiner':CHARACTERS.some(c=>c.id===receipt.characterId),'修复档案客户无效。');
      check(integer(receipt.day)&&receipt.day>=1&&receipt.day<=s.day&&integer(receipt.reward)&&integer(receipt.completedOps),'修复档案结算无效。');
      if(receipt.receivedDay!==undefined)check(integer(receipt.receivedDay)&&receipt.receivedDay>=1&&receipt.receivedDay<=receipt.day,'修复档案收件日期无效。');
      if(receipt.conditionBefore!==undefined)check(number(receipt.conditionBefore)&&receipt.conditionBefore<=100,'修复档案修前状态无效。');
      check(number(receipt.conditionAfter)&&receipt.conditionAfter<=100,'修复档案修后状态无效。');
      validateRepairSteps(receipt.steps,receipt.day);
    }
    check(new Set(s.repairHistory.map(r=>r.orderId)).size===s.repairHistory.length,'存档含重复修复档案。');
  }
  if(s.deliveries!==undefined){
    check(Array.isArray(s.deliveries)&&s.deliveries.length<=64,'订货簿无效。');
    check(new Set(s.deliveries.map(j=>j.id)).size===s.deliveries.length&&s.deliveries.filter(j=>j.status==='active').length<=2,'订货单重复或超过承接上限。');
    for(const job of s.deliveries){
      check(object(job)&&typeof job.id==='string'&&['offered','active','completed','expired','cancelled'].includes(job.status),'订货单内容无效。');
      const request=DELIVERIES.find(d=>d.id===job.templateId);check(request,'订货模板不存在。');
      check(integer(job.postedDay)&&job.postedDay>=1&&job.postedDay<=s.day&&job.id===`delivery-${job.postedDay}-${job.templateId}`,'订货发布日期无效。');
      check(integer(job.deadline)&&job.deadline===job.postedDay+request.days-1,'订货交期无效。');
      if(job.status==='offered')check(job.acceptedDay===undefined&&job.closedDay===undefined&&job.postedDay===s.day,'待接订货记录无效。');
      else check(integer(job.acceptedDay)&&job.acceptedDay===job.postedDay,'订货接取日期无效。');
      if(['completed','expired','cancelled'].includes(job.status)){
        check(integer(job.closedDay)&&job.closedDay!>=job.postedDay&&job.closedDay!<=s.day,'订货结算日期无效。');
        check(job.status==='expired'?job.closedDay!>=job.deadline:job.closedDay!<=job.deadline,'订货结算超出期限。');
      }else check(job.closedDay===undefined,'未结算订货含结束日期。');
      if(job.status==='completed'){
        check(Array.isArray(job.goods)&&job.goods.length===request.quantity&&new Set(job.goods.map(g=>g.itemId)).size===job.goods.length,'订货交货清单无效。');
        check(job.goods.every(g=>object(g)&&typeof g.itemId==='string'&&request.itemIds.includes(g.definitionId)&&integer(g.cost)),'订货货品记录无效。');
        check(job.goods.every(g=>!s.items.some(i=>i.id===g.itemId)),'已交货物仍留在库存。');
      }else check(job.goods===undefined,'未完成订货含交货清单。');
    }
  }
  check(Array.isArray(s.ledger) && s.ledger.every(e => object(e) && integer(e.id) && integer(e.day) && typeof e.kind === 'string' && Number.isFinite(e.amount) && typeof e.note === 'string'), '账本无效。');
  check(Array.isArray(s.messages) && s.messages.every(m => typeof m === 'string'), '消息记录无效。');
  if(s.visitorArrived !== undefined) check(typeof s.visitorArrived === 'boolean','叫号状态无效。');
  if (s.storageUpgrades !== undefined) check(object(s.storageUpgrades) && integer(s.storageUpgrades.backpack) && s.storageUpgrades.backpack <= 1 && integer(s.storageUpgrades.crate) && s.storageUpgrades.crate <= 2, '仓库扩展记录无效。');
  if (s.labeler !== undefined) check(typeof s.labeler === 'boolean', '标签机记录无效。');
  if(s.containers!==undefined){
    check(Array.isArray(s.containers)&&s.containers.length<=256,'箱包记录无效。');
    check(new Set([...s.items.map(i=>i.id),...s.containers.map(c=>c.id)]).size===s.items.length+s.containers.length,'箱包标识与已有物品重复。');
    for(const c of s.containers){
      check(object(c)&&typeof c.id==='string'&&/^container-\d+$/.test(c.id)&&STORAGE_STYLES.some(d=>d.id===c.styleId),'箱包款式或标识无效。');
      check(c.owner==='player'&&['stock','counter'].includes(c.location)&&integer(c.cost)&&integer(c.acquiredDay)&&c.acquiredDay<=s.day,'箱包归属或成本无效。');
      check(validContainerLabel(c.label)&&LABEL_COLORS.includes(c.color),'箱包标签无效。');
      for(const at of [c.grid,c.counterGrid])if(at!==undefined)check(object(at)&&integer(at.x)&&integer(at.y)&&validRotation(at.rotated),'箱包坐标无效。');
      check(c.location!=='counter'||(c.containerId===undefined&&!!c.counterGrid),'台面箱包位置无效。');
      check(c.location!=='stock'||!!c.grid,'仓库箱包缺少坐标。');
    }
    for(const c of s.containers){const trail=containerTrail(s,c.id);check(trail!==null,'箱包嵌套循环或指向不存在的箱包。');check(trail.length<=MAX_CONTAINER_DEPTH,'箱包最多嵌套三层。');}
  }
  for(const item of ownedObjects(s))if(item.containerId!==undefined){
    check(typeof item.containerId==='string'&&s.containers?.some(c=>c.id===item.containerId),'物品指向不存在的箱包。');
    check(item.owner==='player'&&item.location==='stock'&&!!item.grid,'箱包内物品位置或归属无效。');
  }
  for(const c of s.containers??[]){
    const layout=containerLayout(s,c);check(!layout.overflow.length,'箱包内部容量不足。');
    for(const item of ownedObjects(s).filter(i=>i.containerId===c.id)){const at=layout.positions[item.id];check(at&&item.grid&&at.x===item.grid.x&&at.y===item.grid.y&&at.rotated===item.grid.rotated,'箱包内物品重叠或越界。');}
  }
  for(const visitor of s.visitors)if(visitor.storageGoods!==undefined){
    check(visitor.kind==='seller'&&Array.isArray(visitor.storageGoods)&&visitor.storageGoods.length<=2,'卖家箱包库存无效。');
    check(new Set(visitor.storageGoods.map(o=>o.id)).size===visitor.storageGoods.length,'箱包货号重复。');
    check(visitor.storageGoods.every(o=>object(o)&&typeof o.id==='string'&&STORAGE_STYLES.some(d=>d.id===o.styleId)&&integer(o.price)&&o.price>0),'箱包价签无效。');
  }
  if (s.tutorial !== undefined) check(object(s.tutorial) && integer(s.tutorial.step) && s.tutorial.step <= 9 && typeof s.tutorial.skipped === 'boolean', '教学进度无效。');
  if (s.conversations !== undefined) check(object(s.conversations) && Object.values(s.conversations).every(n => integer(n) && n <= 2), '对话进度无效。');
  if (s.challenge !== null) check(object(s.challenge) && ['batch-repair', 'exhibition', 'rare-trade'].includes(s.challenge.id) && ['goal', 'progress', 'deadline', 'reward'].every(k => integer((s.challenge as unknown as Record<string, unknown>)[k])), '挑战记录无效。');
  check(!s.endless || s.victory, '无尽模式缺少已完成的经营权结局。');
  check(!s.finalComplete || s.finalStage === 3, '最终委托阶段冲突。');
  check(s.finalComplete === s.professionMilestones.includes(PROFESSIONS.find(p => p.id === 'restorer')!.finalMilestone), '修复师最终委托与职业里程碑记录冲突。');
}
/** Pre-interface demo-2 saves only had the restorer's finalComplete flag. No other profession is inferred. */
export function migrateState(value: unknown): unknown {
  if (!object(value) || Object.hasOwn(value, 'professionMilestones') || value.version !== SAVE_VERSION || value.contentVersion !== CONTENT_VERSION || value.balanceVersion !== BALANCE.version) return value;
  const repairMilestone = PROFESSIONS.find(p => p.id === 'restorer')!.finalMilestone;
  return { ...value, professionMilestones: value.finalComplete === true && value.finalStage === 3 ? [repairMilestone] : [] };
}
export function exportSave(state: GameState) {
  validateState(state); const body = JSON.stringify(state);
  return JSON.stringify({ format: 'cyber-shop', version: SAVE_VERSION, savedAt: new Date().toISOString(), checksum: checksum(body), state }, null, 2);
}
export function importSave(text: string): GameState {
  check(text.length < 10 * 1024 * 1024, '存档文件过大。');
  let envelope: unknown;
  try { envelope = JSON.parse(text); } catch { throw new Error('存档 JSON 损坏，原文件已保留。'); }
  check(object(envelope) && envelope.format === 'cyber-shop' && envelope.version === SAVE_VERSION, '这不是兼容的《赛博杂货铺》存档。');
  check(envelope.checksum === checksum(JSON.stringify(envelope.state)), '存档完整性校验失败，原文件已保留。');
  const state = migrateState(envelope.state); validateState(state); return structuredClone(state);
}
function loadKey(key: string, storage?: StorageLike): LoadResult {
  try { const text = (storage ?? globalThis.localStorage).getItem(key); return { state: text === null ? null : importSave(text), error: null }; }
  catch (e) { return { state: null, error: errorText(e) }; }
}
export const loadSave = (storage?: StorageLike): LoadResult => loadKey(SAVE_KEY, storage);
export const restoreDayBackup = (storage?: StorageLike): LoadResult => loadKey(DAY_BACKUP_KEY, storage);
function writeKey(key: string, state: GameState, storage?: StorageLike, replace = false): WriteResult {
  try {
    const target = storage ?? globalThis.localStorage;
    const encoded = exportSave(state); const old = target.getItem(key);
    if (old !== null) {
      if (replace) {
        const prefix = `${key}:preserved:${Date.now()}`; let archiveKey = prefix; let suffix = 0;
        while (target.getItem(archiveKey) !== null) archiveKey = `${prefix}:${++suffix}`;
        target.setItem(archiveKey, old);
      }
      try { importSave(old); } catch (e) {
        if (!replace) return { ok: false, error: `现有存档损坏或不兼容，已停止自动覆盖。${errorText(e)}` };
      }
    }
    target.setItem(key, encoded); return { ok: true, error: null };
  } catch (e) { return { ok: false, error: `保存失败：${errorText(e)}。可导出文件保留进度。` }; }
}
export const saveGame = (state: GameState, storage?: StorageLike): WriteResult => writeKey(SAVE_KEY, state, storage);
export const saveDayBackup = (state: GameState, storage?: StorageLike): WriteResult => writeKey(DAY_BACKUP_KEY, state, storage);
/** Explicit new game or import resets the local recovery point, preserving previous bytes first. */
export const replaceDayBackup = (state: GameState, storage?: StorageLike): WriteResult => writeKey(DAY_BACKUP_KEY, state, storage, true);
/** Only invoke after an explicit new-game/import/restore action. Existing bytes are archived first. */
export const replaceSave = (state: GameState, storage?: StorageLike): WriteResult => writeKey(SAVE_KEY, state, storage, true);
