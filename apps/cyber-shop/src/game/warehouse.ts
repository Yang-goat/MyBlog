import { ITEMS } from '../content';
import type { ItemInstance } from './types';

export const GRID_COLUMNS = 24;
export const SURFACE_COLUMNS = 24;
export const SURFACE_ROWS = 3;
export const SURFACE_CAPACITY = SURFACE_COLUMNS * SURFACE_ROWS / 4;
export function counterLayout(items: ItemInstance[]) {
  return warehouseLayout(items.filter(i => i.owner === 'player' && i.location === 'counter').map(i => ({ ...i, location: 'stock', grid: i.counterGrid })), SURFACE_CAPACITY, SURFACE_COLUMNS);
}
export type Placement = { x: number; y: number; rotated: boolean };
export const STORAGE_UPGRADES = {
  backpack: { name: '旧式收纳背包', price: 180, cells: 24, limit: 1, description: '挂在仓库侧面展开，增加一行 24 格收纳空间。限一个。' },
  crate: { name: '堆叠储藏箱', price: 420, cells: 48, limit: 2, description: '在桌下接入两行抽屉，增加 48 格。最多两只。' },
} as const;
export function footprint(item: ItemInstance, rotated = false) {
  const { width, height } = ITEMS.find(d => d.id === item.definitionId)!.footprint;
  return rotated ? { width: height, height: width } : { width, height };
}
export function fits(item: ItemInstance, at: Placement, occupied: Set<number>, capacity: number, columns = GRID_COLUMNS) {
  if (!Number.isSafeInteger(at.x) || !Number.isSafeInteger(at.y) || at.x < 0 || at.y < 0) return false;
  const { width, height } = footprint(item, at.rotated);
  if (at.x + width > columns) return false;
  for (let y = at.y; y < at.y + height; y++) for (let x = at.x; x < at.x + width; x++) {
    if (y * columns + x >= capacity * 4 || occupied.has(y * columns + x)) return false;
  }
  return true;
}
export function occupy(item: ItemInstance, at: Placement, occupied: Set<number>, columns = GRID_COLUMNS) {
  const { width, height } = footprint(item, at.rotated);
  for (let y = at.y; y < at.y + height; y++) for (let x = at.x; x < at.x + width; x++) occupied.add(y * columns + x);
}
export function warehouseLayout(items: ItemInstance[], capacity: number, columns = GRID_COLUMNS) {
  const stock = items.filter(i => i.owner === 'player' && i.location === 'stock');
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
