import type { GameState, ItemInstance, StorageContainer } from './types';
import { warehouseLayout, counterLayout, occupiedCells, orientations, fits, occupy, GRID_COLUMNS,WAREHOUSE_PAGE_ROWS,type Placement } from './warehouse';
import { storageStyle } from '../content/storage';
export type StoredObject = ItemInstance | StorageContainer;
export const LABELER_PRICE = 90;
export const MAX_CONTAINER_DEPTH = 3;
export const LABEL_COLORS = ['cyan','pink','amber','green','blue','ivory'] as const;
export const isContainer = (o:StoredObject):o is StorageContainer => 'styleId' in o;
export const containerName=(c:StorageContainer)=>c.label||storageStyle(c.styleId).name;
export const ownedObjects=(s:GameState):StoredObject[]=>[...s.items.filter(i=>i.owner==='player'),...(s.containers??[])];
export const containerItems=(s:GameState,id:string)=>ownedObjects(s).filter(i=>i.location==='stock'&&i.containerId===id);
export function containerLayout(s:GameState,c:StorageContainer){const d=storageStyle(c.styleId);return warehouseLayout(ownedObjects(s),d.columns*d.rows/4,d.columns,c.id);}
export const rootLayout=(s:GameState,capacity:number)=>warehouseLayout(ownedObjects(s),capacity,GRID_COLUMNS,undefined,WAREHOUSE_PAGE_ROWS);
export const shopCounterLayout=(s:GameState)=>counterLayout(ownedObjects(s));
export function containerTrail(s:GameState,id?:string){const trail:StorageContainer[]=[];const seen=new Set<string>();while(id){if(seen.has(id))return null;seen.add(id);const c=s.containers?.find(c=>c.id===id);if(!c)return null;trail.unshift(c);id=c.containerId;}return trail;}
export const itemAccessible=(s:GameState,i:StoredObject)=>containerTrail(s,i.containerId)!==null;
export function validContainerLabel(label:unknown){return typeof label==='string'&&label.trim()===label&&[...label].length>=1&&[...label].length<=12&&!/[\u0000-\u001f\u007f-\u009f]/u.test(label);}
/** Count the whole moving subtree; moving a packed box cannot bypass the depth limit. */
export function nestingProblem(s:GameState,object:StoredObject,target?:string):string|null{
 const trail=containerTrail(s,target);if(!trail)return '目标箱包不存在。';
 if(!isContainer(object))return null;
 if(trail.some(c=>c.id===object.id))return '箱包不能放进自己或自己的内层箱包。';
 let depth=1;
 for(const child of s.containers??[]){const path=containerTrail(s,child.id);if(!path)return '箱包路径无效。';const index=path.findIndex(c=>c.id===object.id);if(index>=0)depth=Math.max(depth,path.length-index);}
 return trail.length+depth>MAX_CONTAINER_DEPTH?'最多套三层箱包，最外层算第一层。':null;
}
export const canNest=(s:GameState,object:StoredObject,target?:string)=>nestingProblem(s,object,target)===null;
export function roomLayout(s:GameState,capacity:number,target?:string){const c=s.containers?.find(c=>c.id===target);return c?containerLayout(s,c):rootLayout(s,capacity);}
export function roomShape(s:GameState,capacity:number,target?:string){const c=s.containers?.find(c=>c.id===target);if(c){const d=storageStyle(c.styleId);return{columns:d.columns,cells:d.columns*d.rows};}return{columns:24,cells:capacity*4};}
export function objectFits(s:GameState,capacity:number,object:StoredObject,at:Placement,target?:string){if(target&&!s.containers?.some(c=>c.id===target))return false;if(!canNest(s,object,target))return false;const layout=roomLayout(s,capacity,target),shape=roomShape(s,capacity,target),occupied=new Set<number>();for(const other of ownedObjects(s))if(other.id!==object.id&&layout.positions[other.id])occupy(other,layout.positions[other.id]!,occupied,shape.columns);return fits(object,at,occupied,shape.cells/4,shape.columns,target?undefined:WAREHOUSE_PAGE_ROWS);}
export function firstObjectPlace(s:GameState,capacity:number,object:StoredObject,target?:string){const shape=roomShape(s,capacity,target);for(let n=0;n<shape.cells;n++)for(const rotated of orientations(object)){const at={x:n%shape.columns,y:Math.floor(n/shape.columns),rotated};if(objectFits(s,capacity,object,at,target))return at;}return undefined;}
export function putObject(object:StoredObject,at:Placement,target?:string){object.location='stock';object.grid={...at};delete object.counterGrid;if(target)object.containerId=target;else delete object.containerId;}
/** Dry run includes goods already on the counter. Purchases still land on the counter. */
export function canReceive(s:GameState,capacity:number,incoming:StoredObject[]){const trial=structuredClone(s);for(const o of incoming){if(isContainer(o)){trial.containers??=[];trial.containers.push(structuredClone(o));}else trial.items.push(structuredClone(o));}
 const waiting=ownedObjects(trial).filter(o=>o.location==='counter').sort((a,b)=>Number(isContainer(b))-Number(isContainer(a)));
 for(const o of waiting){let placed=false;for(const target of [undefined,...(trial.containers??[]).map(c=>c.id)]){const at=firstObjectPlace(trial,capacity,o,target);if(at){putObject(o,at,target);placed=true;break;}}if(!placed)return false;}
 return true;
}
export const usedCells=(s:GameState,target?:string)=>ownedObjects(s).filter(o=>o.location==='stock'&&o.containerId===target).reduce((n,o)=>n+occupiedCells(o).length,0);
