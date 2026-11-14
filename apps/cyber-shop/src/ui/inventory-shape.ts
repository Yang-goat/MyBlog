import {footprint,occupiedCells,isShaped,turns,type Placement} from '../game/warehouse';
import type {Rotation} from '../game/types';
import type {StoredObject} from '../game/containers';
const outlines=new Map<string,{x:number;y:number}[]>();
/** Follow exposed clockwise cell edges so visual clipping and pointer hits share the footprint. */
export function outlinePoints(object:StoredObject,rotated:Rotation=false){
 const key=('styleId' in object?object.styleId:object.definitionId)+':'+turns(rotated),cached=outlines.get(key);if(cached)return cached;
 const edges=new Map<string,{a:{x:number;y:number};b:{x:number;y:number}}>();
 for(const {x,y} of occupiedCells(object,rotated)){
  const corners=[{x,y},{x:x+1,y},{x:x+1,y:y+1},{x,y:y+1}];
  for(let i=0;i<4;i++){const a=corners[i]!,b=corners[(i+1)%4]!,id=`${a.x},${a.y}>${b.x},${b.y}`,reverse=`${b.x},${b.y}>${a.x},${a.y}`;if(edges.has(reverse))edges.delete(reverse);else edges.set(id,{a,b});}
 }
 const remaining=[...edges.values()],points:{x:number;y:number}[]=[];let edge=remaining.shift();
 while(edge){points.push(edge.a);const next=remaining.findIndex(e=>e.a.x===edge!.b.x&&e.a.y===edge!.b.y);edge=next<0?undefined:remaining.splice(next,1)[0];}
 outlines.set(key,points);return points;
}
export function shapeClip(object:StoredObject,rotated:Rotation=false){if(!isShaped(object))return undefined;const f=footprint(object,rotated);return `polygon(${outlinePoints(object,rotated).map(p=>`${p.x/f.width*100}% ${p.y/f.height*100}%`).join(',')})`;}
export function inventoryPlacement(object:StoredObject,at?:Placement){if(!at)return {};const f=footprint(object,at.rotated);return {gridColumn:`${at.x+1} / span ${f.width}`,gridRow:`${at.y+1} / span ${f.height}`,clipPath:shapeClip(object,at.rotated)};}
export function previewPlacement(object:StoredObject,at:Placement){const f=footprint(object,at.rotated);return {position:'absolute' as const,left:`calc(var(--inventory-cell)*${at.x})`,top:`calc(var(--inventory-cell)*${at.y})`,width:`calc(var(--inventory-cell)*${f.width})`,height:`calc(var(--inventory-cell)*${f.height})`,clipPath:shapeClip(object,at.rotated)};}
