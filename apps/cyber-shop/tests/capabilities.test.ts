import { describe, expect, it } from 'vitest';
import { applyAction, createGame, attraction, capacity, estimateValue, itemValue, tradeQuote, visibleState } from '../src/game/engine';
import { FAULTS, ITEMS, THEMES } from '../src/content';
import type { GameState } from '../src/game/types';
import { act, repairActive, starterItem, playToWin } from './helpers';

function withFault(faultId: string, skills: string[] = [], own = false) {
  let s = createGame(22); s.skills = skills; s = act(s, { type: 'acceptRepair' });
  const f = FAULTS.find(f => f.id === faultId)!; const o = s.orders[0]!; const i = s.items.find(i => i.id === o.itemId)!;
  i.definitionId = ITEMS.find(d => d.certificate === f.certificate)!.id; i.faults = [f.id]; i.condition = 50;
  if (own) { o.kind = 'own'; i.owner = 'player'; o.escrow = 0; }
  return { s, orderId: o.id, itemId: i.id, f };
}
function operate(setup: ReturnType<typeof withFault>, extra: object = {}) {
  let { s } = setup; const { f, orderId } = setup;
  if (!s.orders[0]!.diagnosed) s = act(s, { type: 'diagnose', orderId });
  return act(s, { type: 'repair', orderId, operation: f.operation, module: f.module, value: f.target, ...extra });
}
function displayTheme(s: GameState) {
  const template = structuredClone(s.items[0]!); s.items = THEMES[0]!.items.map((definitionId, n) => ({ ...structuredClone(template), id: `theme-${n}`, definitionId, owner: 'player' as const, location: 'display' as const, authentic: true, condition: 90, originality: 90, faults: [], known: ['serial', 'basic'] }));
  return s;
}
describe('all skill capabilities change an actionable outcome', () => {
  it('market insight, bargaining and regulars alter information and actual deal boundaries', () => {
    const s = createGame(11); const item = starterItem(s, 'data'); const base = estimateValue(s, item); s.skills = ['trade-1']; const skilled = estimateValue(s, item); expect(skilled[1] - skilled[0]).toBeLessThan(base[1] - base[0]);
    const generate = (skills: string[]) => { let state = createGame(11); state.skills = skills; state.met = state.visitors.map(v => v.characterId).filter((id, n, all) => all.indexOf(id) === n); state = act(state, { type: 'closeDay' }); return act(state, { type: 'openDay' }); };
    const baseline = generate([]); const bargain = generate(['trade-2']); const regular = generate(['trade-2', 'trade-3']); expect(bargain.visitors[1]!.limit).toBeLessThan(baseline.visitors[1]!.limit); expect(regular.visitors[2]!.limit).toBeGreaterThanOrEqual(bargain.visitors[2]!.limit);
  });
  it('all supply skills expose tomorrow planning, batch information and targeted stock', () => {
    let s = createGame(12); expect(visibleState(s).upcoming).toBeUndefined(); s.skills = ['supply-1', 'supply-2', 'supply-3']; expect(visibleState(s).upcoming!.length).toBe(6);
    s = act(s, { type: 'appoint', category: 'energy' }); s = act(s, { type: 'closeDay' }); s = act(s, { type: 'openDay' }); expect(s.visitors[1]!.category).toBe('energy'); expect(s.visitors[1]!.item!.known).toContain('batch');
  });
  it('all business skills change capacity, preservation and priced replenishment', () => {
    let s = createGame(10); const base = capacity(s); s.skills = ['business-1', 'business-2', 'business-3']; expect(capacity(s)).toBe(base + 6);
    const food = starterItem(s, 'food'); const end = food.expiresDay!; s = act(s, { type: 'preserve', itemId: food.id }); expect(s.items.find(i => i.id === food.id)!.expiresDay).toBe(end + 4);
    const cash = s.cash; s = act(s, { type: 'buyEquipment', equipmentId: 'electronic-parts', count: 2 }); expect(cash - s.cash).toBe(Math.round(64 * .85)); const hours = s.hours; s = act(s, { type: 'sort' }); expect(s.hours).toBe(hours);
  });
  it('all collection skills change display quality, themes and the actual visiting buyer', () => {
    let s = displayTheme(createGame(31)); const normal = attraction(s); s.skills = ['collection-1']; const catalog = attraction(s); expect(catalog).toBeGreaterThan(normal); s.skills.push('collection-2'); expect(attraction(s)).toBeGreaterThan(catalog); s.skills.push('collection-3'); s = act(s, { type: 'closeDay' }); s = act(s, { type: 'openDay' }); expect(s.visitors[5]!.kind).toBe('buyer'); expect(s.visitors[5]!.category).toBe('antique');
  });
  it('precision skills save diagnosis/retest work, widen calibration tolerance and raise service rewards', () => {
    const basic = withFault('clock-drift'); const skilled = withFault('clock-drift', ['precision-1', 'precision-2', 'precision-3', 'precision-4']);
    expect(skilled.s.orders[0]!.reward).toBeGreaterThan(basic.s.orders[0]!.reward);
    let a = act(basic.s, { type: 'diagnose', orderId: basic.orderId }); let b = act(skilled.s, { type: 'diagnose', orderId: skilled.orderId }); expect(b.hours).toBe(a.hours + .5);
    a = act(a, { type: 'repair', orderId: basic.orderId, operation: 'calibrate', module: basic.f.module, value: basic.f.target + 5 }); b = act(b, { type: 'repair', orderId: skilled.orderId, operation: 'calibrate', module: skilled.f.module, value: skilled.f.target + 5 }); expect(a.items.find(i => i.id === basic.itemId)!.faults).toHaveLength(1); expect(b.items.find(i => i.id === skilled.itemId)!.faults).toHaveLength(0);
    const hours = b.hours; b = act(b, { type: 'verify', orderId: skilled.orderId }); expect(hours - b.hours).toBe(.5);
  });
  it('workshop skills conserve physical materials, save assembly time, enable learned procedures and raise throughput', () => {
    const basic = withFault('broken-power', [], true); const skilled = withFault('broken-power', ['workshop-1', 'workshop-2', 'workshop-3', 'workshop-4'], true);
    skilled.s.records.faults['oxidized-contact'] = 3; const count = skilled.s.equipment['electronic-parts']; const a = operate(basic); const b = operate(skilled); expect(b.equipment['electronic-parts']).toBe(count); expect(a.equipment['electronic-parts']).toBe(count! - 1); expect(b.hours).toBeGreaterThan(a.hours);
    const repeat = withFault('clock-drift', ['workshop-3']); repeat.s.records.faults['clock-drift'] = 1; const quick = operate(repeat, { quick: true, value: 0 }); expect(quick.items.find(i => i.id === repeat.itemId)!.faults).toHaveLength(0);
    const fresh = withFault('clock-drift', ['workshop-3']); expect(applyAction(act(fresh.s, { type: 'diagnose', orderId: fresh.orderId }), { type: 'repair', orderId: fresh.orderId, operation: 'calibrate', quick: true }).ok).toBe(false);
    expect(withFault('broken-power', ['workshop-4']).s.orders[0]!.reward).toBeGreaterThan(withFault('broken-power').s.orders[0]!.reward);
  });
  it('restoration skills expose salvage estimates, recover only owned parts, restore condition and improve resale', () => {
    const base = withFault('broken-power', [], true); const skilled = withFault('broken-power', ['restoration-1', 'restoration-2', 'restoration-3', 'restoration-4'], true);
    skilled.s.items.find(i => i.id === skilled.itemId)!.known = ['basic']; expect(visibleState(skilled.s).items.find(i => i.id === skilled.itemId)!.salvageEstimate).toBeDefined();
    const a = operate(base); const b = operate(skilled); const ia = a.items.find(i => i.id === base.itemId)!; const ib = b.items.find(i => i.id === skilled.itemId)!; expect(ib.condition).toBe(ia.condition + 12); expect(b.equipment['electronic-parts']).toBe(a.equipment['electronic-parts']! + 1);
    ib.known.push('restored'); const noMaster = structuredClone(b); noMaster.skills = []; expect(itemValue(b, ib)).toBeGreaterThan(itemValue(noMaster, ib));
    const client = withFault('broken-power', ['restoration-2']); const clientCount = client.s.equipment['electronic-parts']; expect(operate(client).equipment['electronic-parts']).toBe(clientCount);
  });
});

describe('late-game and material accounting', () => {
  it('repairs all twelve fault templates through detection, operation and verification', () => {
    for (const f of FAULTS) { const setup = withFault(f.id); const fixed = repairActive(setup.s); expect(fixed.orders[0]!.delivered, f.name).toBe(true); expect(fixed.records.faults[f.id]).toBe(1); }
  });
  it('offers an actual antique tradeoff between keeping original parts and replacement', () => {
    const setup = withFault('worn-gear'); const original = setup.s.items.find(i => i.id === setup.itemId)!.originality;
    const replaced = operate(setup); const preserved = operate(setup, { preserve: true }); expect(replaced.items.find(i => i.id === setup.itemId)!.originality).toBe(original - 18); expect(preserved.items.find(i => i.id === setup.itemId)!.originality).toBe(original); expect(preserved.hours).toBe(replaced.hours - 1);
  });
  it('uses the actual discounted preservation-pack acquisition cost', () => {
    let s = createGame(1); s.skills = ['business-3']; s.equipment['preserve-pack'] = 0; s = act(s, { type: 'buyEquipment', equipmentId: 'preserve-pack' }); const cost = s.equipmentCosts['preserve-pack']!; const food = starterItem(s, 'food'); const before = food.cost; s = act(s, { type: 'preserve', itemId: food.id }); expect(s.items.find(i => i.id === food.id)!.cost - before).toBe(cost); expect(s.equipmentCosts['preserve-pack']).toBe(0);
  });
  it('uses charge for a battery and purity for a material independently from repair certification', () => {
    const s = createGame(20); const item = structuredClone(s.items[0]!); item.definitionId = 'battery-pack'; item.capacity = 90; item.purity = 90; const high = itemValue(s, item); item.capacity = 20; expect(itemValue(s, item)).toBeLessThan(high / 2); item.definitionId = 'alloy-plate'; item.purity = 20; const low = itemValue(s, item); item.capacity = 100; expect(itemValue(s, item)).toBe(low); item.purity = 90; expect(itemValue(s, item)).toBeGreaterThan(low * 2);
  });
  it('prices verified data authorization separately from a pending authorization record', () => {
    const s = createGame(22); const item = starterItem(s, 'data'); const authorized = { ...item, provenance: '可追溯的合法授权副本' }; const pending = { ...item, provenance: '个人转让，授权待核' };
    expect(itemValue(s, pending)).toBeLessThan(itemValue(s, authorized)); expect(itemValue(s, pending)).toBe(Math.max(1, Math.round(itemValue(s, authorized) * .7)));
  });
  it('keeps a neural repair certificate independent from regulated-goods trading authorization', () => {
    let receivedRegulated = false;
    for (let seed = 1; seed <= 16 && !receivedRegulated; seed++) {
      let s = createGame(seed); s.chapter = 3; s.certificates.push('industrial', 'neural'); s.trained.push('industrial', 'neural'); s.day = 2;
      s = act(s, { type: 'closeDay' }); s = act(s, { type: 'openDay' });
      const repair = s.visitors[3]!; if (!repair.item || !ITEMS.find(i => i.id === repair.item!.definitionId)?.regulated) continue;
      receivedRegulated = true; expect(s.licenses).toEqual([]); expect(repair.kind).toBe('repair');
      while (s.visitorIndex < 3) { s = act(s, { type: 'reject', visitorId: s.visitors[s.visitorIndex]!.id }); s = act(s, { type: 'nextVisitor' }); }
      s = act(s, { type: 'acceptRepair', visitorId: repair.id }); expect(s.orders.at(-1)!.itemId).toBe(repair.item.id);
    }
    expect(receivedRegulated).toBe(true);
  });
  it('always honors the displayed default quote even after same-day skill and collection changes', () => {
    let s = createGame(33); const item = starterItem(s, 'data');
    for (let n = 0; n < 2; n++) { s = act(s, { type: 'reject', visitorId: s.visitors[s.visitorIndex]!.id }); s = act(s, { type: 'nextVisitor' }); }
    const buyer = s.visitors[s.visitorIndex]!; buyer.category = 'data'; const limit = buyer.limit;
    s.skills = ['trade-3', 'collection-1', 'collection-2']; s.met.push(buyer.characterId); s = displayTheme(s); s.items.push({ ...item, location: 'stock' });
    const quote = tradeQuote(s, buyer, item); expect(quote).toBeLessThanOrEqual(Math.round(itemValue(s, item) * limit / 10000)); const before = s.cash; s = act(s, { type: 'acceptTrade', visitorId: buyer.id, itemId: item.id }); expect(s.cash - before).toBe(quote); expect(s.visitors[s.visitorIndex]!.limit).toBe(limit);
  });
  it('counts only the matching challenge activity and expires without confiscating property', () => {
    let s = act(playToWin('precision', 32), { type: 'continueEndless' }); s = act(s, { type: 'openDay' }); const before = s.cash; s = act(s, { type: 'challenge', id: 'rare-trade' }); expect(s.cash).toBe(before - 150); s = act(s, { type: 'acceptRepair' }); s = repairActive(s); expect(s.challenge!.progress).toBe(0);
    const displayIds = s.items.filter(i => i.location === 'display').map(i => i.id);
    for (let i = 0; i < 6; i++) { s = act(s, { type: 'closeDay' }); if (i < 5) s = act(s, { type: 'openDay' }); }
    expect(s.challenge).toBeNull(); expect(s.victory).toBe(true); expect(s.items.filter(i => i.location === 'display').map(i => i.id)).toEqual(displayIds);
  });
  it('settles a rare-trade order exactly once after two actual rare buyer transactions', () => {
    let s = act(playToWin('precision', 22), { type: 'continueEndless' }); s = act(s, { type: 'openDay' }); s = act(s, { type: 'challenge', id: 'rare-trade' });
    const template = structuredClone(s.items[0]!);
    for (let n = 0; n < 2; n++) {
      const item = { ...structuredClone(template), id: `rare-fixture-${n}`, definitionId: 'catalyst-core', owner: 'player' as const, location: 'stock' as const, authentic: true, faults: [] }; s.items.push(item);
      const visitor = s.visitors[s.visitorIndex]!; visitor.kind = 'buyer'; visitor.category = 'energy'; visitor.limit = 15000; visitor.resolved = false;
      s = act(s, { type: 'acceptTrade', visitorId: visitor.id, itemId: item.id }); expect(s.challenge!.progress).toBe(n + 1); expect(applyAction(s, { type: 'acceptTrade', visitorId: visitor.id, itemId: item.id }).ok).toBe(false);
      if (n === 0) s = act(s, { type: 'nextVisitor' });
    }
    const before = s.cash; s = act(s, { type: 'closeDay' }); expect(s.challenge).toBeNull(); expect(s.cash - before).toBe(2200 - 20); expect(applyAction(s, { type: 'closeDay' }).ok).toBe(false);
  });
});
