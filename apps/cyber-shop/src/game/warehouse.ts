import { ITEMS } from '../content';
import { storageStyle } from '../content/storage';
import type { ItemInstance, StorageContainer } from './types';

export const GRID_COLUMNS = 24;
export const SURFACE_COLUMNS = 24;
export const SURFACE_ROWS = 3;
export const SURFACE_CAPACITY = SURFACE_COLUMNS * SURFACE_ROWS / 4;
export function counterLayout(items: (ItemInstance | StorageContainer)[]) {
  return warehouseLayout(items.filter(i => i.owner === 'player' && i.location === 'counter').map(i => ({ ...i, location: 'stock', containerId: undefined, grid: i.counterGrid })), SURFACE_CAPACITY, SURFACE_COLUMNS);
}
export type Placement = { x: number; y: number; rotated: boolean };
export function footprint(item: ItemInstance | StorageContainer, rotated = false) {
  const { width, height } = 'styleId' in item ? storageStyle(item.styleId).footprint : ITEMS.find(d => d.id === item.definitionId)!.footprint;
  return rotated ? { width: height, height: width } : { width, height };
}
export function fits(item: ItemInstance | StorageContainer, at: Placement, occupied: Set<number>, capacity: number, columns = GRID_COLUMNS) {
  if (!Number.isSafeInteger(at.x) || !Number.isSafeInteger(at.y) || at.x < 0 || at.y < 0) return false;
  const { width, height } = footprint(item, at.rotated);
  if (at.x + width > columns) return false;
  for (let y = at.y; y < at.y + height; y++) for (let x = at.x; x < at.x + width; x++) {
    if (y * columns + x >= capacity * 4 || occupied.has(y * columns + x)) return false;
  }
  return true;
}
export function occupy(item: ItemInstance | StorageContainer, at: Placement, occupied: Set<number>, columns = GRID_COLUMNS) {
  const { width, height } = footprint(item, at.rotated);
  for (let y = at.y; y < at.y + height; y++) for (let x = at.x; x < at.x + width; x++) occupied.add(y * columns + x);
}
export function warehouseLayout(items: (ItemInstance | StorageContainer)[], capacity: number, columns = GRID_COLUMNS, containerId?: string) {
  const stock = items.filter(i => i.owner === 'player' && i.location === 'stock' && i.containerId === containerId);
  const occupied = new Set<number>(); const positions: Record<string, Placement> = {}; const overflow: string[] = [];
  for (const item of stock) if (item.grid && fits(item, item.grid, occupied, capacity, columns)) { positions[item.id] = item.grid; occupy(item, item.grid, occupied, columns); }
  for (const item of stock) {
    if (positions[item.id]) continue;
    let found = false;
    for (let cell = 0; cell < capacity * 4 && !found; cell++) for (const rotated of [false, true]) {
      const at = { x: cell % columns, y: Math.floor(cell / columns), rotated };
      if (fits(item, at, occupied, capacity, columns)) { positions[item.id] = at; occupy(item, at, occupied, columns); found = true; break; }
    }
    if (!found) overflow.push(item.id);
  }
  return { positions, overflow };
}
