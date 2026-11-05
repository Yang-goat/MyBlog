import { createReadyGame as createGame } from './helpers';
import { describe, expect, it } from 'vitest';
import { applyAction, capacity } from '../src/game/engine';
import { footprint, warehouseLayout, counterLayout } from '../src/game/warehouse';
import { ITEMS } from '../src/content';
import { exportSave, importSave } from '../src/persistence/storage';
import { act } from './helpers';

describe('physical warehouse and ownership transfer', () => {
  it('rejects overlap, edge overflow and customer goods without losing items or money', () => {
    const s = createGame(42); const [a,b] = s.items;
    const layout = warehouseLayout(s.items, capacity(s)); const occupied = layout.positions[b!.id]!;
    for (const at of [occupied, { x: 24, y: 0, rotated: false }, { x: -1, y: 1, rotated: false }, { x: 0, y: 100, rotated: false }]) {
      const result = applyAction(s, { type: 'moveStock', itemId: a!.id, ...at });
      expect(result.ok).toBe(false); expect(result.state).toEqual(s);
    }
    expect(applyAction(s, { type: 'moveStock', itemId: s.visitors[0]!.item!.id, x: 0, y: 4, rotated: false }).ok).toBe(false);
  });
  it('preserves a manual placement, orientation and tutorial across save round trips', () => {
    let s = createGame(42); const item = s.items[0]!;
    s = act(s, { type: 'moveStock', itemId: item.id, x: 8, y: 3, rotated: true });
    s = act(s, { type: 'tutorial', step: 3 });
    s = act(s, { type: 'talk', visitorId: s.visitors[0]!.id });
    const loaded = importSave(exportSave(s));
    expect(warehouseLayout(loaded.items, capacity(loaded)).positions[item.id]).toEqual({ x: 8, y: 3, rotated: true });
    expect(loaded.tutorial?.step).toBe(3); expect(loaded.conversations?.[s.visitors[0]!.id]).toBe(1);
  });
  it('keeps purchased goods on the counter until explicit successful placement', () => {
    let s = createGame(42); s = act(s, { type: 'reject', visitorId: s.visitors[0]!.id }); s = act(s, { type: 'nextVisitor' });
    const v = s.visitors[1]!; const id = v.item!.id; const before = s.cash;
    expect(applyAction(s, { type: 'moveStock', itemId: id, x: 8, y: 3, rotated: false }).ok).toBe(false);
    s = act(s, { type: 'acceptTrade', visitorId: v.id }); expect(s.items.find(i => i.id === id)?.location).toBe('counter'); expect(s.cash).toBe(before - v.quote);
    const saved = importSave(exportSave(s)); expect(saved.items.find(i => i.id === id)?.location).toBe('counter');
    const at = warehouseLayout(s.items.map(i => i.id === id ? { ...i, location: 'stock' } : i), capacity(s)).positions[id]!;
    s = act(s, { type: 'moveStock', itemId: id, ...at }); expect(s.items.find(i => i.id === id)?.location).toBe('stock');
    expect(s.cash).toBe(before - v.quote);
  });
  it('rotates non-square items and keeps overflow recoverable', () => {
    const s = createGame(42); const item = { ...s.items[0]!, definitionId: 'air-circulator' };
    expect(footprint(item)).toEqual({width:2,height:4}); expect(footprint(item,true)).toEqual({width:4,height:2});
    const crowded = Array.from({length:20}, (_,i) => ({ ...item, id: `overflow-${i}` }));
    const layout = warehouseLayout(crowded, 18);
    expect(Object.keys(layout.positions).length + layout.overflow.length).toBe(20); expect(layout.overflow.length).toBeGreaterThan(0);
  });
  it('defines physical footprints for every item and charges real occupied area', () => {
    expect(new Set(ITEMS.map(d => `${d.footprint.width}x${d.footprint.height}`)).size).toBeGreaterThan(8);
    for (const d of ITEMS) expect(d.size * 4).toBe(d.footprint.width * d.footprint.height);
    expect(ITEMS.find(d => d.id === 'data-chip')!.footprint).toEqual({width:1,height:1});
    expect(ITEMS.find(d => d.id === 'servo-arm')!.footprint).toEqual({width:3,height:5});
  });
  it('expands actual grid space without moving inventory and persists installed containers', () => {
    let s = createGame(42); const before = warehouseLayout(s.items, capacity(s)); const base = capacity(s);
    s = act(s, {type:'buyStorage',kind:'backpack'}); expect(capacity(s)).toBe(base + 6);
    expect(warehouseLayout(s.items,capacity(s)).positions).toEqual(before.positions);
    expect(applyAction(s,{type:'buyStorage',kind:'backpack'}).ok).toBe(false);
    s = act(s, {type:'buyStorage',kind:'crate'}); expect(capacity(s)).toBe(base + 18);
    const item=s.items[0]!; s=act(s,{type:'moveStock',itemId:item.id,x:0,y:6,rotated:false});
    const saved=importSave(exportSave(s)); expect(saved.storageUpgrades).toEqual({backpack:1,crate:1}); expect(saved.items[0]!.grid?.y).toBe(6);
    const poor={...s,cash:0}; expect(applyAction(poor,{type:'buyStorage',kind:'crate'}).state).toEqual(poor);
  });
  it('snaps purchased goods on the counter and rejects collision and overflow', () => {
    let s=createGame(42); s.items=[{...s.items[0]!,id:'counter-a',location:'counter'},{...s.items[1]!,id:'counter-b',location:'counter'}];
    s=act(s,{type:'moveCounter',itemId:'counter-a',x:5,y:0,rotated:false});
    expect(counterLayout(s.items).positions['counter-a']).toEqual({x:5,y:0,rotated:false});
    expect(applyAction(s,{type:'moveCounter',itemId:'counter-b',x:5,y:0,rotated:false}).ok).toBe(false);
    expect(applyAction(s,{type:'moveCounter',itemId:'counter-a',x:0,y:4,rotated:false}).ok).toBe(false);
    expect(importSave(exportSave(s)).items[0]!.counterGrid?.x).toBe(5);
  });
});
