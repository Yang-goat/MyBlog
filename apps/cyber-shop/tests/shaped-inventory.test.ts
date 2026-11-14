import {describe,it,expect} from 'vitest';
import {ITEMS} from '../src/content';
import {createReadyGame,act} from './helpers';
import {applyAction,rootCapacity,stockUsage} from '../src/game/engine';
import {occupiedCells,footprint,fits,occupy,warehouseLayout,rotateObject,type Placement} from '../src/game/warehouse';
import {containerLayout,usedCells} from '../src/game/containers';
import {exportSave,importSave} from '../src/persistence/storage';
import type {Rotation,ItemInstance} from '../src/game/types';
const make=(definitionId:string,id=definitionId):ItemInstance=>({...createReadyGame(7).items[0]!,definitionId,id,expiresDay:null,grid:undefined});
describe('nonrectangular inventory',()=>{
 it('keeps all three shapes connected, distinct occupied areas, with four saved orientations',()=>{
  for(const d of ITEMS.filter(d=>d.shape)){
   const o=make(d.id),base=occupiedCells(o),area=d.id==='folding-worklight'?10:7;expect(base).toHaveLength(area);expect(d.size).toBe(area/4);
   const visited=new Set<string>(),todo=[base[0]!];while(todo.length){const p=todo.pop()!,key=`${p.x},${p.y}`;if(visited.has(key))continue;visited.add(key);todo.push(...base.filter(c=>!visited.has(`${c.x},${c.y}`)&&Math.abs(c.x-p.x)+Math.abs(c.y-p.y)===1));}expect(visited.size).toBe(area);
   let rotation:Rotation=0;for(let n=0;n<4;n++){expect(rotation).toBe(n);const cells=occupiedCells(o,rotation),f=footprint(o,rotation);expect(cells).toHaveLength(area);expect(new Set(cells.map(c=>`${c.x},${c.y}`)).size).toBe(area);expect(Math.max(...cells.map(c=>c.x))+1).toBe(f.width);expect(Math.max(...cells.map(c=>c.y))+1).toBe(f.height);rotation=rotateObject(o,rotation);}expect(rotation).toBe(0);expect(rotateObject(o,0,-1)).toBe(3);
  }
  expect(ITEMS.filter(d=>d.shape)).toHaveLength(3);
 });
 it('fits a small rectangle in the L concavity while rejecting solid-cell overlap',()=>{
  const l=make('angle-drill'),small=make('pocket-com'),occupied=new Set<number>();occupy(l,{x:5,y:1,rotated:0},occupied);
  expect([...occupied].sort((a,b)=>a-b)).toEqual([29,30,31,54,55,78,79]);expect(fits(small,{x:5,y:2,rotated:false},occupied,36)).toBe(true);
  expect(fits(small,{x:5,y:1,rotated:false},occupied,36)).toBe(false);expect(fits(small,{x:6,y:2,rotated:false},occupied,36)).toBe(false);
  expect(fits(l,{x:23,y:0,rotated:0},new Set(),36)).toBe(false);expect(fits(l,{x:0,y:5,rotated:0},new Set(),36)).toBe(false);
 });
 it('automatically finds a 180 degree opening instead of treating it as a rectangle',()=>{
  const l=make('angle-drill'),occupied=new Set<number>();for(let y=0;y<3;y++)for(let x=0;x<3;x++)if(!occupiedCells(l,2).some(c=>c.x===x&&c.y===y))occupied.add(y*3+x);
  const fillers=[...occupied].map((n,i)=>({...make('data-chip',`filler-${i}`),grid:{x:n%3,y:Math.floor(n/3),rotated:false}}));
  const layout=warehouseLayout([...fillers,l],2.25,3);expect(layout.positions[l.id]).toEqual({x:0,y:0,rotated:2});expect(layout.overflow).toEqual([]);
 });
 it('preserves interlocking root, counter and bag positions through save round trips',()=>{
  let s=createReadyGame(7);const l=make('angle-drill','elbow'),chip=make('data-chip','chip');s.items=[l,chip];
  s=act(s,{type:'moveStock',itemId:l.id,x:6,y:0,rotated:0});s=act(s,{type:'moveStock',itemId:chip.id,x:6,y:1,rotated:false});expect(stockUsage(s)*4).toBe(8);
  const rejected=applyAction(s,{type:'moveStock',itemId:chip.id,x:6,y:0,rotated:false});expect(rejected.ok).toBe(false);expect(rejected.state).toEqual(s);
  s=act(s,{type:'moveCounter',itemId:l.id,x:1,y:0,rotated:3});expect(importSave(exportSave(s)).items.find(i=>i.id===l.id)?.counterGrid?.rotated).toBe(3);
  s.containers=[{id:'container-200',styleId:'courier-pouch',owner:'player',location:'stock',cost:120,acquiredDay:1,label:'零件袋',color:'cyan',grid:{x:0,y:0,rotated:false}}];
  s=act(s,{type:'moveStock',itemId:l.id,containerId:'container-200',x:0,y:0,rotated:2});s=act(s,{type:'moveStock',itemId:chip.id,containerId:'container-200',x:2,y:0,rotated:false});
  const saved=importSave(exportSave(s));expect(containerLayout(saved,saved.containers![0]!).positions[l.id]?.rotated).toBe(2);expect(usedCells(saved,'container-200')).toBe(8);expect(rootCapacity(saved)*4).toBe(144);
 });
 it('rejects malformed rotations on import, retaining boolean saves',()=>{
  let s=createReadyGame(7);s.items=[make('three-way-valve','t')];s=act(s,{type:'moveStock',itemId:'t',x:2,y:0,rotated:3});
  for(const rotated of [-1,4,1.5,'1',null]){const bad=structuredClone(s);bad.items[0]!.grid!.rotated=rotated as Rotation;expect(()=>importSave(exportSave(bad))).toThrow();expect(applyAction(s,{type:'moveStock',itemId:'t',x:2,y:0,rotated:rotated as Rotation}).ok).toBe(false);}
  const legacy=createReadyGame(7);legacy.items[0]!.grid={x:8,y:0,rotated:true};expect(importSave(exportSave(legacy)).items[0]!.grid?.rotated).toBe(true);
 });
});
