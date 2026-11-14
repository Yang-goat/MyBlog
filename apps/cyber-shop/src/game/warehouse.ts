import { ITEMS } from '../content';
import { storageStyle } from '../content/storage';
import type { ItemInstance, StorageContainer, Rotation } from './types';

export const GRID_COLUMNS = 24;
export const SURFACE_COLUMNS = 24;
export const SURFACE_ROWS = 3;
export const SURFACE_CAPACITY = SURFACE_COLUMNS * SURFACE_ROWS / 4;
export function counterLayout(items: (ItemInstance | StorageContainer)[]) {
  return warehouseLayout(items.filter(i => i.owner === 'player' && i.location === 'counter').map(i => ({ ...i, location: 'stock', containerId: undefined, grid: i.counterGrid })), SURFACE_CAPACITY, SURFACE_COLUMNS);
}
export type Placement = { x: number; y: number; rotated: Rotation };
type Object = ItemInstance | StorageContainer;
export const validRotation=(value:unknown):value is Rotation=>typeof value==='boolean'||(Number.isInteger(value)&&typeof value==='number'&&value>=0&&value<=3);
export const turns=(rotation:Rotation=false)=>typeof rotation==='boolean'?Number(rotation):rotation;
export const isShaped=(item:Object)=>!('styleId' in item)&&!!ITEMS.find(d=>d.id===item.definitionId)?.shape;
export const orientations=(item:Object):Rotation[]=>isShaped(item)?[0,1,2,3]:[false,true];
export function rotateObject(item:Object,rotation:Rotation,direction=1):Rotation{return isShaped(item)?((turns(rotation)+direction+4)%4) as Rotation:!(turns(rotation)%2);}
export function footprint(item: Object, rotated:Rotation = false) {
  const { width, height } = 'styleId' in item ? storageStyle(item.styleId).footprint : ITEMS.find(d => d.id === item.definitionId)!.footprint;
  return turns(rotated)%2 ? { width: height, height: width } : { width, height };
}
const cellCache=new Map<string,ReadonlyArray<{x:number;y:number}>>();
/** Only these squares are occupied; concave corners remain available to other goods. */
export function occupiedCells(item:Object,rotated:Rotation=false){
 const key=('styleId' in item?'box:'+item.styleId:item.definitionId)+':'+turns(rotated);
 let result=cellCache.get(key);if(result)return result;
 const shape='styleId' in item?undefined:ITEMS.find(d=>d.id===item.definitionId)?.shape;
 let {width,height}=footprint(item);let cells:{x:number;y:number}[]=[];
 for(let y=0;y<height;y++)for(let x=0;x<width;x++)if(!shape||shape[y]?.[x]==='1')cells.push({x,y});
 for(let t=0;t<turns(rotated);t++){cells=cells.map(c=>({x:height-1-c.y,y:c.x}));[width,height]=[height,width];}
 result=cells;cellCache.set(key,result);return result;
}
export function fits(item: ItemInstance | StorageContainer, at: Placement, occupied: Set<number>, capacity: number, columns = GRID_COLUMNS) {
  if (!Number.isSafeInteger(at.x) || !Number.isSafeInteger(at.y) || at.x < 0 || at.y < 0 || !validRotation(at.rotated)) return false;
  const { width, height } = footprint(item, at.rotated);
  if (at.x + width > columns) return false;
  for (const cell of occupiedCells(item,at.rotated)) { const x=at.x+cell.x,y=at.y+cell.y;
    if (y * columns + x >= capacity * 4 || occupied.has(y * columns + x)) return false;
  }
  return true;
}
export function occupy(item: ItemInstance | StorageContainer, at: Placement, occupied: Set<number>, columns = GRID_COLUMNS) {
  for (const cell of occupiedCells(item,at.rotated)) occupied.add((at.y+cell.y)*columns+at.x+cell.x);
}
export function warehouseLayout(items: (ItemInstance | StorageContainer)[], capacity: number, columns = GRID_COLUMNS, containerId?: string) {
  const stock = items.filter(i => i.owner === 'player' && i.location === 'stock' && i.containerId === containerId);
  const occupied = new Set<number>(); const positions: Record<string, Placement> = {}; const overflow: string[] = [];
  for (const item of stock) if (item.grid && fits(item, item.grid, occupied, capacity, columns)) { positions[item.id] = item.grid; occupy(item, item.grid, occupied, columns); }
  for (const item of stock) {
    if (positions[item.id]) continue;
    let found = false;
    for (let cell = 0; cell < capacity * 4 && !found; cell++) for (const rotated of orientations(item)) {
      const at = { x: cell % columns, y: Math.floor(cell / columns), rotated };
      if (fits(item, at, occupied, capacity, columns)) { positions[item.id] = at; occupy(item, at, occupied, columns); found = true; break; }
    }
    if (!found) overflow.push(item.id);
  }
  return { positions, overflow };
}
