import { createReadyGame as createGame } from './helpers';
import { describe, expect, it } from 'vitest';
import { PROFESSIONS } from '../src/content';
import { applyAction, professionVictory } from '../src/game/engine';
import { importSave, exportSave, migrateState, validateState } from '../src/persistence/storage';
import { playToWin } from './helpers';

describe('profession-scoped victory contract', () => {
  it('never combines one profession mastery with another profession final milestone', () => {
    const s = createGame(31); s.cash = 20000; s.skills = ['precision-4'];
    const restorer = PROFESSIONS.find(p => p.id === 'restorer')!;
    const future = PROFESSIONS.find(p => p.id === 'curator')!;
    s.professionMilestones = [future.finalMilestone];
    expect(professionVictory(s, restorer.id)).toMatchObject({ mastered: true, completed: false, ready: false });
    expect(professionVictory(s, future.id)).toMatchObject({ implemented: false, completed: true, ready: false });
    expect(applyAction(s, { type: 'buyShop' }).ok).toBe(false);

    const previous = { implemented: future.implemented, masterySkills: future.masterySkills };
    try {
      // Simulate a future capability registration; shared purchasing code needs no profession-specific rewrite.
      future.implemented = true; future.masterySkills = ['future-curator-master'];
      expect(professionVictory(s, future.id).ready).toBe(false);
      expect(applyAction(s, { type: 'buyShop' }).ok).toBe(false);
      s.skills = ['future-curator-master'];
      expect(professionVictory(s, future.id).ready).toBe(true);
      const purchase = applyAction(s, { type: 'buyShop' });
      expect(purchase.ok).toBe(true); expect(purchase.state.victory).toBe(true); expect(purchase.state.finalComplete).toBe(false);
    } finally { Object.assign(future, previous); }
  });
  it('registers and saves the actual restorer milestone only after the completed final delivery', () => {
    const start = createGame(51); expect(start.professionMilestones).toEqual([]);
    const won = playToWin('precision', 51); const milestone = PROFESSIONS.find(p => p.id === 'restorer')!.finalMilestone;
    expect(won.professionMilestones).toEqual([milestone]); expect(professionVictory(won, 'restorer').ready).toBe(true);
    expect(importSave(exportSave(won)).professionMilestones).toEqual([milestone]);
    const unknown = structuredClone(won); unknown.professionMilestones.push('not-registered'); expect(() => exportSave(unknown)).toThrow('职业里程碑');
    const contradictory = structuredClone(won); contradictory.professionMilestones = []; expect(() => exportSave(contradictory)).toThrow('冲突');
  });
  it('migrates pre-interface demo-2 state without inferring achievements for other professions', () => {
    const won = playToWin('precision', 17); const { professionMilestones: _old, ...legacyWon } = won;
    const upgraded = migrateState(legacyWon); validateState(upgraded); expect(upgraded.professionMilestones).toEqual([PROFESSIONS.find(p => p.id === 'restorer')!.finalMilestone]);
    const { professionMilestones: _initial, ...legacyInitial } = createGame(17); const upgradedInitial = migrateState(legacyInitial); validateState(upgradedInitial); expect(upgradedInitial.professionMilestones).toEqual([]);
    const tampered = JSON.parse(exportSave(won)); delete tampered.state.professionMilestones; expect(() => importSave(JSON.stringify(tampered))).toThrow('完整性');
  });
});
