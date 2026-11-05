import { createReadyGame as createGame } from './helpers';
import { describe, expect, it } from 'vitest';
import { applyAction, visibleState, itemValue, stockUsage, capacity, attraction, tradeQuote } from '../src/game/engine';
import { BALANCE } from '../src/game/balance';
import { CATEGORIES, CHARACTERS, FAULTS, ITEMS, SKILLS } from '../src/content';
import { act, repairActive, playToWin, normalDay, starterItem } from './helpers';
import { exportSave, importSave, validateState } from '../src/persistence/storage';
import { warehouseLayout } from '../src/game/warehouse';

describe('authority, deterministic trade and boundaries', () => {
  it('keeps the input immutable and fixed seeds reproducible without exposing hidden facts', () => {
    const s = createGame(71); const original = structuredClone(s);
    expect(createGame(71)).toEqual(s); act(s, { type: 'acceptRepair', visitorId: s.visitors[0]!.id }); expect(s).toEqual(original);
    const visible = visibleState(s); expect(JSON.stringify(visible)).not.toContain('"rng"'); expect(JSON.stringify(visible.visitor)).not.toContain('"limit"'); expect(visible.visitor?.item?.faults).toBeUndefined(); expect(visible.visitor?.item?.authentic).toBeUndefined(); expect(visible.visitor?.item?.condition).toBeUndefined();
    expect(importSave(exportSave(s))).toEqual(s);
  });
  it('serves a zero-cash player and never makes the customer item or escrow sellable', () => {
    let s = createGame(3); s.cash = 0; s.items = [];
    s = act(s, { type: 'acceptRepair' }); const item = s.items[0]!; const before = s.cash;
    expect(s.orders[0]!.escrow).toBeGreaterThan(0); expect(s.cash).toBe(before);
    for (const type of ['liquidate', 'display', 'startRepair'] as const) expect(applyAction(s, { type, itemId: item.id }).ok).toBe(false);
    s = repairActive(s); expect(s.cash).toBeGreaterThan(0); expect(s.orders[0]!.escrow).toBe(0);
    const replay = applyAction(s, { type: 'deliver', orderId: s.orders[0]!.id }); expect(replay.ok).toBe(false); expect(replay.state.cash).toBe(s.cash);
  });
  it('reserves an emergency repair place when six owned jobs have exhausted all cash and materials', () => {
    let s = act(createGame(5), { type: 'acceptRepair' }); const templateOrder = s.orders[0]!; const templateItem = s.items.find(i => i.id === templateOrder.itemId)!;
    s.items = []; s.orders = []; s.cash = 0; s.equipment = { 'micro-solder': 1, workbench: 1 };
    for (let n = 0; n < 6; n++) { const item = { ...structuredClone(templateItem), id: `stalled-item-${n}`, owner: 'player' as const, faults: ['broken-power'] }; s.items.push(item); s.orders.push({ ...structuredClone(templateOrder), id: `stalled-order-${n}`, itemId: item.id, kind: 'own', description: '等待耗材的自有翻新', escrow: 0 }); }
    s = act(s, { type: 'acceptRepair' }); expect(s.orders).toHaveLength(7); const emergency = s.orders.at(-1)!; expect(applyAction(s, { type: 'acceptRepair' }).ok).toBe(false);
    s = act(s, { type: 'diagnose', orderId: emergency.id }); s = act(s, { type: 'repair', orderId: emergency.id, operation: 'clean' }); s = act(s, { type: 'verify', orderId: emergency.id }); s = act(s, { type: 'deliver', orderId: emergency.id }); expect(s.cash).toBeGreaterThan(0);
  });
  it('allows all six categories to buy and sell through actual visits across deterministic days', () => {
    let s = createGame(2); s.cash = 50000; // Isolate trade coverage; no progression/victory flag is modified.
    const seen = new Set<string>();
    for (let day = 0; day < 8; day++) {
      if (s.phase === 'closed') { s = act(s, { type: 'openDay' }); s = act(s, { type: 'callVisitor' }); }
      for (let n = 0; n < 7; n++) {
        const v = s.visitors[s.visitorIndex]!;
        if (v.kind === 'seller' && v.item && stockUsage(s) + ITEMS.find(d => d.id === v.item!.definitionId)!.size <= capacity(s)) {
          s = act(s, { type: 'acceptTrade', visitorId: v.id });
          const bought = s.items.find(i => i.id === v.item!.id)!;
          expect(bought.location).toBe('counter');
          const at = warehouseLayout(s.items.map(i => i.id === bought.id ? { ...i, location: 'stock' } : i), capacity(s)).positions[bought.id]!;
          s = act(s, { type: 'moveStock', itemId: bought.id, ...at });
        }
        else if (v.kind === 'buyer') {
          const item = s.items.find(i => i.location === 'stock' && ITEMS.find(d => d.id === i.definitionId)!.category === v.category);
          if (item) { const quote = tradeQuote(s, v, item); const before = s.cash; s = act(s, { type: 'acceptTrade', visitorId: v.id, itemId: item.id }); expect(s.cash - before).toBe(quote); seen.add(v.category); expect(applyAction(s, { type: 'acceptTrade', visitorId: v.id, itemId: item.id }).ok).toBe(false); }
          else s = act(s, { type: 'reject', visitorId: v.id });
        } else s = act(s, { type: 'reject', visitorId: v.id });
        if (n < 6) s = act(s, { type: 'nextVisitor' });
      }
      s = act(s, { type: 'closeDay' });
    }
    expect([...seen].sort()).toEqual(CATEGORIES.map(c => c.id).sort());
  });
  it('rejects impossible prices, missing money, full stock and repeated negotiation beyond patience', () => {
    let s = createGame(13); s = act(s, { type: 'reject', visitorId: s.visitors[0]!.id }); s = act(s, { type: 'nextVisitor' }); const v = s.visitors[1]!;
    for (const amount of [NaN, Infinity, -1, 0, 1.1]) expect(applyAction(s, { type: 'offer', visitorId: v.id, amount }).ok).toBe(false);
    const zero = structuredClone(s); zero.cash = 0; expect(applyAction(zero, { type: 'acceptTrade', visitorId: v.id }).ok).toBe(false);
    const full = structuredClone(s); while (stockUsage(full) < capacity(full)) { const i = structuredClone(full.items[0]!); i.id = `full-${full.items.length}`; full.items.push(i); } expect(applyAction(full, { type: 'acceptTrade', visitorId: v.id }).ok).toBe(false);
    while (!s.visitors[1]!.resolved) s = act(s, { type: 'offer', visitorId: v.id, amount: 1 });
    expect(applyAction(s, { type: 'offer', visitorId: v.id, amount: 999 }).ok).toBe(false);
  });
});

describe('repair, collections and progression', () => {
  it('penalizes wrong calibration predictably without destroying the object', () => {
    let s = createGame(45); s = act(s, { type: 'acceptRepair' }); const o = s.orders[0]!; const i = s.items.find(i => i.id === o.itemId)!; const f = FAULTS.find(f => f.id === 'clock-drift')!; i.faults = [f.id];
    s = act(s, { type: 'diagnose', orderId: o.id }); const cash = s.cash; const h = s.hours;
    s = act(s, { type: 'repair', orderId: o.id, operation: f.operation, module: f.module, value: 1 });
    expect(s.hours).toBe(h - 1); expect(s.cash).toBe(cash); expect(s.items.find(i => i.id === o.itemId)!.faults).toEqual([f.id]);
    s = repairActive(s); expect(s.orders[0]!.delivered).toBe(true);
  });
  it('makes category states economically meaningful and keeps food unrepairable', () => {
    const s = createGame(6); const food = starterItem(s, 'food'); const normal = itemValue(s, food); food.expiresDay = s.day - 1; expect(itemValue(s, food)).toBeLessThan(normal / 2); expect(applyAction(s, { type: 'startRepair', itemId: food.id }).ok).toBe(false);
    const data = starterItem(s, 'data'); const intact = { ...data, integrity: 100 }; expect(itemValue(s, { ...intact, integrity: 20 })).toBeLessThan(itemValue(s, intact));
    const antique = starterItem(s, 'antique'); expect(itemValue(s, { ...antique, authentic: false })).toBeLessThan(itemValue(s, { ...antique, authentic: true }));
  });
  it('preserves ownership and display exclusion, extends food life only once', () => {
    let s = createGame(77); s = act(s, { type: 'buyEquipment', equipmentId: 'serial-terminal' });
    const item = starterItem(s, 'data'); item.authentic = true;
    s = act(s, { type: 'inspect', itemId: item.id, method: 'serial' }); s = act(s, { type: 'display', itemId: item.id });
    expect(attraction(s)).toBeGreaterThan(0); expect(applyAction(s, { type: 'liquidate', itemId: item.id }).ok).toBe(false); expect(s.items.filter(i => i.id === item.id)).toHaveLength(1);
    s = act(s, { type: 'withdraw', itemId: item.id }); expect(s.items.find(i => i.id === item.id)!.location).toBe('stock');
    const food = starterItem(s, 'food'); const expiry = food.expiresDay!; s = act(s, { type: 'preserve', itemId: food.id }); expect(s.items.find(i => i.id === food.id)!.expiresDay).toBeGreaterThan(expiry); expect(applyAction(s, { type: 'preserve', itemId: food.id }).ok).toBe(false);
  });
  it.each(['precision', 'workshop', 'restoration'])('reaches the ending by normal actions with %s mastery, then grows in endless mode', branch => {
    let s = playToWin(branch, 42); expect(s.skills).toContain(`${branch}-4`); expect(s.finalStage).toBe(3); expect(s.finalComplete).toBe(true); expect(s.cash).toBeGreaterThanOrEqual(0); expect(s.day).toBeLessThan(60); validateState(s);
    console.log(`主线正常动作模拟 ${branch}: 第 ${s.day} 日，${s.records.repairs} 维修案例，${s.level - 1} 技能点，收购后现金 ${s.cash}`);
    const won = structuredClone(s); const ended = act(s, { type: 'endGame' }); expect(ended.phase).toBe('ended'); expect(act(ended, { type: 'continueEndless' }).endless).toBe(true);
    s = act(won, { type: 'continueEndless' }); const level = s.level;
    for (let day = 0; day < 8; day++) s = normalDay(s, branch, true);
    expect(s.endless).toBe(true); expect(s.level).toBeGreaterThan(level); expect(s.certificates).toContain('antique'); expect(s.met.some(id => CHARACTERS.some(c => c.endless && c.id === id))).toBe(true); expect(Object.keys(s.records.faults).some(id => FAULTS.some(f => f.id === id && f.certificate === 'antique'))).toBe(true);
  });
  it('can eventually learn all 24 skills and retain them with a finite bounded economy', () => {
    let s = act(playToWin('precision', 8), { type: 'continueEndless' });
    for (let day = 0; day < 150 && s.skills.length < SKILLS.length; day++) s = normalDay(s, 'precision', true);
    expect(s.skills).toHaveLength(24); expect(s.level).toBeGreaterThan(25); expect(Number.isFinite(s.cash)).toBe(true); expect(s.debt).toBe(0); validateState(s);
  });
  it('respec refunds once atomically, preserves certificates/quests/items and blocks active orders', () => {
    let s = createGame(9); s.points = 10; s = act(s, { type: 'learn', skillId: 'business-1' }); s = act(s, { type: 'closeDay' });
    const old = structuredClone(s); s = act(s, { type: 'respec', skills: [] }); expect(s.points).toBe(10); expect(s.items).toEqual(old.items); expect(s.certificates).toEqual(old.certificates); expect(s.cash).toBe(old.cash); expect(s.freeRespec).toBe(false);
    const replay = act(s, { type: 'respec', skills: [] }); expect(replay.points).toBe(s.points); expect(replay.cash).toBe(s.cash - BALANCE.respecPrice);
    s = act(s, { type: 'openDay' }); s = act(s, { type: 'acceptRepair' }); s = act(s, { type: 'closeDay' }); expect(applyAction(s, { type: 'respec', skills: [] }).ok).toBe(false);
  });
  it('has an explicit failure after the grace period and no mainline rent after ownership', () => {
    let s = createGame(4); s.cash = 0; s.items = [];
    for (let n = 0; n <= BALANCE.graceDays; n++) { if (s.phase === 'closed') { s = act(s, { type: 'openDay' }); s = act(s, { type: 'callVisitor' }); } s = act(s, { type: 'closeDay' }); }
    expect(s.phase).toBe('failed'); expect(applyAction(s, { type: 'openDay' }).ok).toBe(false);
    let endless = act(playToWin('precision', 6), { type: 'continueEndless' }); endless = act(endless, { type: 'openDay' }); const before = endless.cash; endless = act(endless, { type: 'closeDay' }); expect(before - endless.cash).toBe(BALANCE.maintenance);
  });
});
