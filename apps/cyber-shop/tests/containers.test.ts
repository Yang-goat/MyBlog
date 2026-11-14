import {describe,it,expect} from 'vitest';
import {applyAction,capacity,rootCapacity,visibleState} from '../src/game/engine';
import {rootLayout,containerLayout,containerItems,firstObjectPlace} from '../src/game/containers';
import {storageStyle} from '../src/content/storage';
import {validateState,exportSave,importSave} from '../src/persistence/storage';
import {act,createReadyGame,repairActive} from './helpers';
import type {Action,GameState} from '../src/game/types';
function shop(){let s=createReadyGame(42);s.cash=10000;s=act(s,{type:'reject',visitorId:s.visitors[0]!.id});return act(s,{type:'nextVisitor'});}
function buy(s:GameState,styleId:string){const v=s.visitors[s.visitorIndex]!,id=`fixture-offer-${s.serial}`;v.storageGoods=[{id,styleId,price:storageStyle(styleId).price}];return act(s,{type:'buyStorage',visitorId:v.id,offerId:id});}
function stash(s:GameState,id:string,target?:string){const box=s.containers!.find(c=>c.id===id)!,at=firstObjectPlace(s,rootCapacity(s),box,target)!;return act(s,{type:'moveStorage',storageId:id,containerId:target,...at});}
function reject(s:GameState,a:Action){const r=applyAction(s,a);expect(r.ok).toBe(false);expect(r.state).toEqual(s);}
describe('nested containers acquired through NPC trading',()=>{
 it('requires the present seller and finite offer; charges real money and leaves the box on the counter',()=>{
  let s=shop();const v=s.visitors[s.visitorIndex]!,offer=v.storageGoods![0]!,cash=s.cash,root=rootLayout(s,rootCapacity(s));
  reject(s,{type:'buyStorage',visitorId:'absent',offerId:offer.id});s=act(s,{type:'buyStorage',visitorId:v.id,offerId:offer.id});
  expect(s.cash).toBe(cash-offer.price);expect(s.containers![0]!.location).toBe('counter');expect(rootLayout(s,rootCapacity(s))).toEqual(root);expect(s.visitors[s.visitorIndex]!.storageGoods!.some(o=>o.id===offer.id)).toBe(false);
  reject(s,{type:'buyStorage',visitorId:v.id,offerId:offer.id});reject(s,{type:'closeDay'});s=stash(s,s.containers![0]!.id);expect(s.containers![0]!.location).toBe('stock');validateState(s);
 });
 it('supports box inside box and bag inside bag, retaining all contents through an outer move and save',()=>{
  let s=shop();for(const style of ['transit-crate','transit-crate','courier-pack','courier-pack'])s=buy(s,style);
  const [a,b,c,d]=s.containers!.map(c=>c.id);s=stash(s,a!);s=stash(s,b!,a);s=stash(s,c!);s=stash(s,d!,c);
  const item=s.items.find(i=>i.definitionId==='data-chip')??s.items[0]!;s=act(s,{type:'moveStock',itemId:item.id,containerId:d,x:0,y:0,rotated:false});
  expect(containerItems(s,a!)[0]!.id).toBe(b);expect(containerItems(s,c!)[0]!.id).toBe(d);
  const inner=structuredClone(s.containers!.slice(1));s=act(s,{type:'moveStorage',storageId:a!,x:12,y:2,rotated:true});expect(s.containers!.slice(1)).toEqual(inner);expect(s.items.find(i=>i.id===item.id)?.containerId).toBe(d);
  expect(importSave(exportSave(s))).toEqual(s);expect(visibleState(s).containers.at(-1)?.path).toEqual([c,d]);
  reject(s,{type:'moveStorage',storageId:a!,containerId:b,x:0,y:0,rotated:false});reject(s,{type:'moveStorage',storageId:b!,containerId:b,x:0,y:0,rotated:false});
 });
 it('enforces three levels for both a single box and an already packed subtree',()=>{
  let s=shop();for(let n=0;n<4;n++)s=buy(s,'courier-pouch');const [a,b,c,d]=s.containers!.map(c=>c.id);
  s=stash(s,a!);s=stash(s,b!,a);s=stash(s,c!,b);s=stash(s,d!);
  reject(s,{type:'moveStorage',storageId:d!,containerId:c,x:0,y:0,rotated:false});
  reject(s,{type:'moveStorage',storageId:a!,containerId:d,x:0,y:0,rotated:false});
  const bad=structuredClone(s);bad.containers![3]!.containerId=c;bad.containers![3]!.grid={x:0,y:0,rotated:false};expect(()=>validateState(bad)).toThrow('三层');
  const before=structuredClone(s.containers!.filter(box=>[b,c].includes(box.id)));s=act(s,{type:'moveStorage',storageId:a!,x:15,y:2,rotated:false});expect(s.containers!.filter(box=>[b,c].includes(box.id))).toEqual(before);expect(visibleState(s).containers.find(box=>box.id===c)?.path).toEqual([a,b,c]);validateState(s);
 });
 it('rejects overlapping or oversized shells without changing cash, goods or paths',()=>{
  let s=buy(shop(),'courier-pouch');s=stash(s,s.containers![0]!.id);s=buy(s,'freight-case');const [small,large]=s.containers!;
  reject(s,{type:'moveStorage',storageId:large!.id,containerId:small!.id,x:0,y:0,rotated:false});
  reject(s,{type:'moveStock',itemId:s.items[0]!.id,x:small!.grid!.x,y:small!.grid!.y,rotated:false});
  reject(s,{type:'moveStorage',storageId:large!.id,containerId:'missing',x:0,y:0,rotated:false});
 });
 it('counts shells and rejects a purchase when nothing can fit into the existing rooms',()=>{
  let s=shop();s.items=Array.from({length:144},(_,n)=>({...s.items[0]!,id:`full-${n}`,definitionId:'data-chip',faults:[],location:'stock' as const,grid:{x:n%24,y:Math.floor(n/24),rotated:false}}));
  const v=s.visitors[s.visitorIndex]!;reject(s,{type:'buyStorage',visitorId:v.id,offerId:v.storageGoods![0]!.id});
  s.items=s.items.filter(i=>!['full-0','full-1','full-24','full-25'].includes(i.id));s=act(s,{type:'buyStorage',visitorId:v.id,offerId:v.storageGoods![0]!.id});expect(capacity(s)).toBeGreaterThan(rootCapacity(s));
 });
 it('requires empty boxes for resale and uses the buyer budget',()=>{
  let s=buy(shop(),'courier-pack');const id=s.containers![0]!.id;s=stash(s,id);const item=s.items[0]!.id;s=act(s,{type:'moveStock',itemId:item,containerId:id,x:0,y:0,rotated:false});s=act(s,{type:'reject',visitorId:s.visitors[s.visitorIndex]!.id});s=act(s,{type:'nextVisitor'});const v=s.visitors[s.visitorIndex]!;
  reject(s,{type:'sellStorage',visitorId:v.id,storageId:id});s=act(s,{type:'moveStock',itemId:item,x:10,y:0,rotated:false});const before=s.cash,budget=s.visitors[s.visitorIndex]!.budget!;s=act(s,{type:'sellStorage',visitorId:v.id,storageId:id});expect(s.containers).toHaveLength(0);expect(s.cash-before).toBe(165);expect(s.visitors[s.visitorIndex]!.budget).toBe(budget-165);validateState(s);
 });
 it('labels repeatedly, keeps positions during root sort, and clears membership on repair and display',()=>{
  let s=buy(shop(),'transit-crate');const id=s.containers![0]!.id;s=stash(s,id);s=act(s,{type:'buyLabeler'});s=act(s,{type:'labelContainer',containerId:id,label:'待修电器🔧',color:'cyan'});const cash=s.cash;s=act(s,{type:'labelContainer',containerId:id,label:'第一号收藏',color:'pink'});expect(s.cash).toBe(cash);
  s.items[0]!.definitionId='portable-terminal';s.items[0]!.faults=[];const item=s.items[0]!.id;s=act(s,{type:'moveStock',itemId:item,containerId:id,x:2,y:1,rotated:false});const at=s.items[0]!.grid;s=act(s,{type:'sort'});expect(s.items.find(i=>i.id===item)?.grid).toEqual(at);
  s=act(s,{type:'startRepair',itemId:item});expect(s.items.find(i=>i.id===item)?.containerId).toBeUndefined();s=repairActive(s);expect(s.items.find(i=>i.id===item)?.location).toBe('stock');validateState(s);
 });
 it('rejects malformed parent references, cycles, collisions and bad labels at the import boundary',()=>{
  let s=buy(shop(),'courier-pack');const a=s.containers![0]!.id;s=stash(s,a);s=buy(s,'courier-pouch');const b=s.containers![1]!.id;s=stash(s,b,a);s=act(s,{type:'moveStock',itemId:s.items[0]!.id,containerId:a,x:2,y:0,rotated:false});
  for(const mutate of [(s:GameState)=>s.containers![0]!.containerId=b,(s:GameState)=>s.containers![1]!.containerId='missing',(s:GameState)=>s.containers![1]!.label='',(s:GameState)=>s.items[0]!.grid={...s.containers![1]!.grid!}]){const bad=structuredClone(s);mutate(bad);expect(()=>validateState(bad)).toThrow();}expect(importSave(exportSave(s))).toEqual(s);
 });
});
