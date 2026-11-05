import { describe, expect, it, vi } from 'vitest';
import { createGame, applyAction } from '../src/game/engine';
import { exportSave, importSave, loadSave, saveGame, replaceSave, saveDayBackup, replaceDayBackup, restoreDayBackup, SAVE_KEY, DAY_BACKUP_KEY, type StorageLike } from '../src/persistence/storage';
import { act, repairActive } from './helpers';

class MemoryStorage implements StorageLike {
  values = new Map<string, string>();
  getItem(key: string) { return this.values.get(key) ?? null; }
  setItem(key: string, value: string) { this.values.set(key, value); }
  removeItem(key: string) { this.values.delete(key); }
}
describe('save boundaries and recovery', () => {
  it('roundtrips RNG, incomplete jobs, knowledge, visits and costs exactly', () => {
    let s = createGame(108); s = act(s, { type: 'acceptRepair', visitorId: s.visitors[0]!.id }); s = act(s, { type: 'diagnose', orderId: s.orders[0]!.id });
    const copy = importSave(exportSave(s)); expect(copy).toEqual(s); expect(repairActive(copy)).toEqual(repairActive(s));
    const storage = new MemoryStorage(); expect(saveGame(s, storage).ok).toBe(true); expect(loadSave(storage)).toEqual({ state: s, error: null });
  });
  it('never silently overwrites corrupt or incompatible bytes', () => {
    const storage = new MemoryStorage(); storage.setItem(SAVE_KEY, '{bad json'); const s = createGame(4);
    expect(loadSave(storage).error).toContain('损坏'); expect(saveGame(s, storage).ok).toBe(false); expect(storage.getItem(SAVE_KEY)).toBe('{bad json');
    expect(replaceSave(s, storage).ok).toBe(true); expect([...storage.values.entries()].some(([key, value]) => key.includes(':preserved:') && value === '{bad json')).toBe(true);
    const incompatible = JSON.parse(exportSave(s)); incompatible.version = 999; expect(() => importSave(JSON.stringify(incompatible))).toThrow('兼容');
    const changed = JSON.parse(exportSave(s)); changed.state.cash += 1; expect(() => importSave(JSON.stringify(changed))).toThrow('完整性');
  });
  it('keeps a separate exact day-start restore and other apps namespaces untouched', () => {
    const storage = new MemoryStorage(); storage.setItem('hex-mahjong-save', 'keep-me'); const start = createGame(9);
    expect(saveDayBackup(start, storage).ok).toBe(true); let s = act(start, { type: 'acceptRepair' }); s = repairActive(s); expect(saveGame(s, storage).ok).toBe(true);
    expect(restoreDayBackup(storage).state).toEqual(start); expect(loadSave(storage).state).toEqual(s); expect(storage.getItem('hex-mahjong-save')).toBe('keep-me'); expect(DAY_BACKUP_KEY).not.toBe(SAVE_KEY);
  });
  it('rejects invalid ownership, duplicate instances, broken references and nonfinite values before writing', () => {
    const s = createGame(42); const mutations = [
      (x: typeof s) => { x.items.push(structuredClone(x.items[0]!)); },
      (x: typeof s) => { x.items[0]!.owner = 'customer'; },
      (x: typeof s) => { x.items[0]!.definitionId = 'missing'; },
      (x: typeof s) => { x.cash = Infinity; },
      (x: typeof s) => { x.skills = ['missing']; },
      (x: typeof s) => { x.endless = true; },
    ];
    for (const change of mutations) { const bad = structuredClone(s); change(bad); expect(() => exportSave(bad)).toThrow(); }
  });
  it('surfaces storage denial and quota failure without mutating the in-memory state', () => {
    const s = createGame(32); const storage: StorageLike = { getItem: () => null, setItem: () => { throw new Error('QuotaExceededError'); }, removeItem: () => {} };
    expect(saveGame(s, storage)).toEqual({ ok: false, error: expect.stringContaining('QuotaExceededError') }); expect(importSave(exportSave(s))).toEqual(s);
  });
  it('does not pay a completed repair twice after refresh or export/import', () => {
    let s = act(createGame(2), { type: 'acceptRepair' }); s = repairActive(s); const saved = importSave(exportSave(s)); const replay = applyAction(saved, { type: 'deliver', orderId: saved.orders[0]!.id }); expect(replay.ok).toBe(false); expect(replay.state.cash).toBe(s.cash);
  });
  it('reports a damaged day backup until an explicit replacement safely archives it', () => {
    const storage = new MemoryStorage(); storage.setItem(DAY_BACKUP_KEY, 'damaged backup'); const s = createGame(89);
    expect(saveDayBackup(s, storage).ok).toBe(false); expect(restoreDayBackup(storage).error).toBeTruthy(); expect(storage.getItem(DAY_BACKUP_KEY)).toBe('damaged backup');
    expect(replaceDayBackup(s, storage).ok).toBe(true); expect(restoreDayBackup(storage).state).toEqual(s); expect([...storage.values.entries()].some(([key, val]) => key.startsWith(`${DAY_BACKUP_KEY}:preserved:`) && val === 'damaged backup')).toBe(true);
  });
  it('keeps separate archives even when explicit replacement actions occur in the same millisecond', () => {
    const clock = vi.spyOn(Date, 'now').mockReturnValue(1234);
    try { const storage = new MemoryStorage(); const a = createGame(1); const b = createGame(2); const c = createGame(3); saveGame(a, storage); expect(replaceSave(b, storage).ok).toBe(true); expect(replaceSave(c, storage).ok).toBe(true); expect(loadSave(storage).state).toEqual(c); expect(importSave(storage.getItem(`${SAVE_KEY}:preserved:1234`)!)).toEqual(a); expect(importSave(storage.getItem(`${SAVE_KEY}:preserved:1234:1`)!)).toEqual(b); }
    finally { clock.mockRestore(); }
  });
});
