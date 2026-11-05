import { applyAction, createGame, isMaster, questProgress } from '../src/game/engine';
import { CERTIFICATES, FAULTS, ITEMS, QUESTS, SKILLS } from '../src/content';
import type { Action, GameState } from '../src/game/types';

export function act(s: GameState, action: Action) {
  const result = applyAction(s, action);
  if (!result.ok) throw new Error(`${action.type}: ${result.events.map(e => e.text).join(' ')} [day ${s.day}, hours ${s.hours}]`);
  return result.state;
}
export function repairActive(s: GameState) {
  for (const initial of s.orders.filter(o => !o.delivered)) {
    let order = s.orders.find(o => o.id === initial.id)!;
    if (!order.diagnosed) { const r = applyAction(s, { type: 'diagnose', orderId: order.id }); if (!r.ok) return s; s = r.state; }
    let item = s.items.find(i => i.id === order.itemId)!;
    while (item.faults.length) {
      const f = FAULTS.find(f => f.id === item.faults[0])!;
      const r = applyAction(s, { type: 'repair', orderId: order.id, operation: f.operation, module: f.module, value: f.target });
      if (!r.ok) return s; s = r.state; item = s.items.find(i => i.id === order.itemId)!;
    }
    order = s.orders.find(o => o.id === order.id)!;
    if (!order.completedOps) { const r = applyAction(s, { type: 'repair', orderId: order.id, operation: 'clean' }); if (!r.ok) return s; s = r.state; }
    if (!order.verified) { const r = applyAction(s, { type: 'verify', orderId: order.id }); if (!r.ok) return s; s = r.state; }
    s = act(s, { type: 'deliver', orderId: order.id });
  }
  return s;
}
export const buildPath = (branch: string) => {
  const secondary = branch === 'precision' ? 'workshop' : 'precision';
  return [1, 2, 3].map(t => `${branch}-${t}`).concat([1, 2, 3].map(t => `${secondary}-${t}`), `${branch}-4`);
};
export function normalDay(s: GameState, branch: string, learnAll = false) {
  if (s.phase === 'closed') s = act(s, { type: 'openDay' });
  if (s.phase !== 'open') return s;
  const chooseSkills = () => {
    const ids = learnAll ? [...buildPath(branch), ...SKILLS.map(n => n.id)] : buildPath(branch);
    for (const skillId of ids) { const r = applyAction(s, { type: 'learn', skillId }); if (r.ok) s = r.state; }
  };
  chooseSkills();
  for (const q of QUESTS) while (questProgress(s, q.id).ready) s = act(s, { type: 'claimQuest', questId: q.id });
  for (const cert of CERTIFICATES) {
    if (s.certificates.includes(cert.id) || s.orders.some(o => !o.delivered && o.kind === 'exam')) continue;
    const train = applyAction(s, { type: 'train', certificate: cert.id }); if (train.ok) s = train.state;
    if (s.trained.includes(cert.id)) s = act(s, { type: 'exam', certificate: cert.id });
  }
  s = repairActive(s);
  if (isMaster(s) && s.chapter === 4 && !s.finalComplete && !s.orders.some(o => o.kind === 'final' && !o.delivered)) {
    s = act(s, { type: 'startFinal' }); s = repairActive(s);
  }
  for (let n = 0; n < s.visitors.length; n++) {
    const v = s.visitors[s.visitorIndex]!;
    if (!v.resolved) {
      if (v.kind === 'repair' && s.hours >= 3) { s = act(s, { type: 'acceptRepair', visitorId: v.id }); s = repairActive(s); }
      else s = act(s, { type: 'reject', visitorId: v.id });
    }
    if (s.visitorIndex < s.visitors.length - 1) s = act(s, { type: 'nextVisitor' });
  }
  chooseSkills();
  if (s.finalComplete) { const win = applyAction(s, { type: 'buyShop' }); if (win.ok) return win.state; }
  return act(s, { type: 'closeDay' });
}
export function playToWin(branch: string, seed = 42) {
  let s = createGame(seed);
  for (let day = 0; day < 90 && !s.victory; day++) s = normalDay(s, branch);
  if (!s.victory) throw new Error(`No victory: ${branch}, day=${s.day}, cash=${s.cash}, points=${s.points}, repairs=${s.records.repairs}`);
  return s;
}
export function starterItem(s: GameState, category: string) { return s.items.find(i => ITEMS.find(d => d.id === i.definitionId)?.category === category)!; }
