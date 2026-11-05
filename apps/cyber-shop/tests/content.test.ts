import { describe, expect, it } from 'vitest';
import { ITEMS, CATEGORIES, FAULTS, CHARACTERS, SKILLS, EQUIPMENT, CERTIFICATES, EVENTS, QUESTS, THEMES, PROFESSIONS } from '../src/content';

describe('content registry integrity', () => {
  it('contains the agreed playable content counts and unique stable identifiers', () => {
    for (const [list, count] of [[ITEMS, 36], [CATEGORIES, 6], [FAULTS, 12], [CHARACTERS, 10], [SKILLS, 24], [EQUIPMENT, 16], [CERTIFICATES, 4], [EVENTS, 16], [QUESTS, 4], [THEMES, 3], [PROFESSIONS, 6]] as const) {
      expect(list).toHaveLength(count); expect(new Set(list.map(a => a.id)).size).toBe(count);
      for (const entry of list) expect(entry.id).toMatch(/^[a-z][a-z0-9-]+$/);
    }
    expect(CHARACTERS.filter(c => c.endless)).toHaveLength(3);
    expect(PROFESSIONS.filter(p => p.implemented).map(p => p.id)).toEqual(['restorer']);
  });
  it('keeps category-specific capabilities and valid referenced content', () => {
    for (const category of CATEGORIES) { expect(ITEMS.filter(d => d.category === category.id)).toHaveLength(6); expect(ITEMS.some(d => d.category === category.id && d.chapter === 1)).toBe(true); }
    for (const d of ITEMS) {
      expect(d.image).toBe(`${d.id}.webp`); expect(d.price).toBeGreaterThan(0); expect(d.size).toBeGreaterThan(0);
      expect(d.description.length).toBeGreaterThan(5); expect(d.actions.length).toBeGreaterThan(0); expect(d.states.length).toBeGreaterThan(0);
      for (const person of d.preferences) expect(CHARACTERS.some(c => c.id === person)).toBe(true);
      if (d.category === 'food' || (d.category === 'energy' && !d.certificate)) expect(d.actions).not.toContain('repair');
    }
    for (const f of FAULTS) expect(EQUIPMENT.some(e => e.id === f.material && e.type === 'material')).toBe(true);
    for (const cert of CERTIFICATES) {
      expect(ITEMS.some(d => d.id === cert.examItem)).toBe(true);
      for (const fault of cert.examFaults) expect(FAULTS.some(f => f.id === fault && f.certificate === cert.id)).toBe(true);
      for (const tool of cert.tools) expect(EQUIPMENT.some(e => e.id === tool && e.type === 'tool')).toBe(true);
    }
    for (const q of QUESTS) { expect(q.stages.length).toBeGreaterThanOrEqual(3); expect(CHARACTERS.some(c => c.id === q.character)).toBe(true); }
    for (const t of THEMES) for (const item of t.items) expect(ITEMS.some(d => d.id === item)).toBe(true);
  });
  it('registers 24 distinct effective capabilities with real prerequisite chains', () => {
    expect(new Set(SKILLS.map(s => s.effect)).size).toBe(24);
    expect(SKILLS.filter(s => s.cost === 2)).toHaveLength(3);
    expect(SKILLS.filter(s => s.cost === 1)).toHaveLength(21);
    for (const s of SKILLS) { expect(s.amount).toBeGreaterThan(0); for (const id of s.requires) expect(SKILLS.some(p => p.id === id && p.tier < s.tier)).toBe(true); }
    for (const p of PROFESSIONS.filter(p => p.implemented)) for (const skill of p.masterySkills) expect(SKILLS.some(s => s.id === skill && s.cost === 2)).toBe(true);
  });
});
