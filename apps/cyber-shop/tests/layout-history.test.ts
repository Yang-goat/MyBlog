import {describe,it,expect} from 'vitest';
import {createGame,applyAction,rootCapacity} from '../src/game/engine';
import {createLayoutHistory} from '../src/game/layout-history';
import {firstObjectPlace,putObject,rootLayout,containerTrail} from '../src/game/containers';
import {ITEMS} from '../src/content';
import {validateState} from '../src/persistence/storage';
import type {Action,GameState} from '../src/game/types';

function session(initial=createGame(42)){
 let state=initial;const history=createLayoutHistory();
 return {history,get state(){return state;},act(action:Action){const r=applyAction(state,action);if(r.ok){history.record(state,r.state,action);state=r.state;}return r;},undo(){const s=history.undo(state);if(s)state=s;return s;}};
}
describe('safe warehouse sorting and session placement undo',()=>{
 it('never ejects a previously placed object in ten dense mixed-shape layouts',()=>{
  let rejected=0,accepted=0;
  for(let seed=1;seed<=10;seed++){
   const s=createGame(seed),template=s.items[0]!;s.items=[];let rng=seed;
   for(let n=0;n<48;n++){
    rng=(Math.imul(rng,1664525)+1013904223)>>>0;const d=ITEMS[rng%ITEMS.length]!;
    const item={...template,id:`item-${900+n}`,definitionId:d.id,grid:undefined,expiresDay:d.category==='food'?2+n%4:null};
    const at=firstObjectPlace(s,rootCapacity(s),item);if(at){putObject(item,at);s.items.push(item);}
   }
   expect(rootLayout(s,rootCapacity(s)).overflow).toEqual([]);
   const before=structuredClone(s),r=applyAction(s,{type:'sort'});
   expect(rootLayout(r.state,rootCapacity(r.state)).overflow).toEqual([]);
   if(!r.ok){rejected++;expect(r.state).toEqual(before);}else{accepted++;expect(r.state.hours).toBe(s.hours-.5);}
  }
  expect(rejected).toBeGreaterThan(0);expect(accepted).toBeGreaterThan(0);
 });
 it('undoes moves, rotation and sorting in order without refunding time',()=>{
  const q=session(),original=structuredClone(q.state),id=q.state.items.find(i=>i.definitionId==='data-chip')!.id;
  expect(q.act({type:'moveStock',itemId:id,x:20,y:4,rotated:false}).ok).toBe(true);const moved=structuredClone(q.state);
  expect(q.act({type:'moveStock',itemId:id,x:21,y:4,rotated:true}).ok).toBe(true);const turned=structuredClone(q.state);
  expect(q.act({type:'sort'}).ok).toBe(true);const spent=q.state.hours;
  expect(q.history.size).toBe(3);expect(q.undo()?.items).toEqual(turned.items);expect(q.state.hours).toBe(spent);
  expect(q.undo()?.items).toEqual(moved.items);expect(q.undo()?.items).toEqual(original.items);expect(q.undo()).toBeUndefined();
  expect(q.state.cash).toBe(original.cash);expect(q.state.hours).toBe(original.hours-.5);validateState(q.state);
 });
 it('restores a nested subtree and a child moved to the counter without losing contents',()=>{
  const s=createGame(42);s.containers=[{id:'container-100',styleId:'transit-crate',label:'外箱',color:'ivory',owner:'player',cost:480,acquiredDay:1,location:'stock',grid:{x:14,y:0,rotated:false}},{id:'container-101',styleId:'courier-pouch',label:'内袋',color:'ivory',owner:'player',cost:120,acquiredDay:1,location:'stock',grid:{x:20,y:0,rotated:false}}];
  const q=session(s),chip=s.items.find(i=>i.definitionId==='data-chip')!,original=structuredClone(s);
  expect(q.act({type:'moveStock',itemId:chip.id,containerId:'container-101',x:0,y:0,rotated:false}).ok).toBe(true);
  expect(q.act({type:'moveStorage',storageId:'container-101',containerId:'container-100',x:0,y:0,rotated:true}).ok).toBe(true);
  expect(containerTrail(q.state,'container-101')?.map(c=>c.id)).toEqual(['container-100','container-101']);const nested=structuredClone(q.state);
  expect(q.act({type:'moveCounter',itemId:chip.id,x:0,y:0,rotated:true}).ok).toBe(true);
  expect(q.undo()).toEqual(nested);expect(q.act({type:'moveStorage',storageId:'container-100',x:15,y:2,rotated:false}).ok).toBe(true);
  expect(q.undo()).toMatchObject({items:nested.items,containers:nested.containers});q.undo();q.undo();expect(q.state).toMatchObject({items:original.items,containers:original.containers});validateState(q.state);
 });
 it('keeps history after rejected placements and avoids duplicate no-op entries',()=>{
  const q=session(),id=q.state.items[0]!.id,action:Action={type:'moveStock',itemId:id,x:20,y:3,rotated:false};
  expect(q.act(action).ok).toBe(true);expect(q.act(action).ok).toBe(true);expect(q.history.size).toBe(1);
  expect(q.act({...action,x:500}).ok).toBe(false);expect(q.history.size).toBe(1);expect(q.undo()).toBeDefined();
 });
 it('clears placement history on sale, inspection and day transition',()=>{
  for(const action of ['liquidate','inspect','closeDay'] as const){
   const q=session(),id=q.state.items.find(i=>i.definitionId==='data-chip')!.id;
   if(action==='inspect')q.state.items.find(i=>i.id===id)!.known=[];
   q.act({type:'moveStock',itemId:id,x:20,y:4,rotated:false});expect(q.history.size).toBe(1);
   const r=q.act(action==='closeDay'?{type:action}:action==='inspect'?{type:action,itemId:id,method:'basic'}:{type:action,itemId:id});
   expect(r.ok).toBe(true);expect(q.history.size).toBe(0);const before=structuredClone(q.state);expect(q.undo()).toBeUndefined();expect(q.state).toEqual(before);
  }
 });
 it('caps history, supports explicit reload clearing and rejects a stale layout',()=>{
  const q=session(),id=q.state.items.find(i=>i.definitionId==='data-chip')!.id;
  for(let n=0;n<25;n++)expect(q.act({type:'moveStock',itemId:id,x:20+n%2,y:4,rotated:false}).ok).toBe(true);
  expect(q.history.size).toBe(20);q.history.clear();expect(q.undo()).toBeUndefined();
  q.act({type:'moveStock',itemId:id,x:22,y:4,rotated:false});q.state.items=q.state.items.filter(i=>i.id!==id);expect(q.undo()).toBeUndefined();expect(q.history.size).toBe(0);
 });
});
