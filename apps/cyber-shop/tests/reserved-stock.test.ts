import {describe,it,expect} from 'vitest';
import {createGame,applyAction,visibleState,tradeItemProblem,clearanceQuote} from '../src/game/engine';
import {deliveryJobs,deliveryDefinition,deliveryItemCheck} from '../src/game/deliveries';
import {stockEntries} from '../src/game/stock-ledger';
import {exportSave,importSave,validateState} from '../src/persistence/storage';
import {act,repairActive} from './helpers';
import type {Action,GameState} from '../src/game/types';
const water=(s:GameState)=>s.items.find(i=>i.definitionId==='purified-water')!;
const reject=(s:GameState,action:Action)=>{const before=structuredClone(s),r=applyAction(s,action);expect(r.ok).toBe(false);expect(r.state).toEqual(before);expect(s).toEqual(before);return r.events[0]!.text;};

describe('deliberately reserved stock',()=>{
 it('keeps the mark across save and day transitions without spending time, money or rolling stock',()=>{
  let s=createGame(42);const id=water(s).id,before=structuredClone(s);
  s=act(s,{type:'reserveItem',itemId:id,reserved:true});
  for(const key of ['cash','hours','rng','records','equipment','ledger'] as const)expect(s[key]).toEqual(before[key]);
  expect(visibleState(s).items.find(i=>i.id===id)?.reserved).toBe(true);
  s=importSave(exportSave(s));s=act(s,{type:'closeDay'});s=act(s,{type:'openDay'});expect(water(s).reserved).toBe(true);
  s=act(s,{type:'reserveItem',itemId:id,reserved:false});expect(water(s).reserved).toBeUndefined();expect(importSave(exportSave(s))).toEqual(s);
 });
 it('atomically blocks all sale paths including a mixed batch and an existing counteroffer',()=>{
  let s=createGame(42);s.visitorIndex=2;s.visitorArrived=true;const v=s.visitors[2]!;v.category='food';v.budget=2000;
  const id=water(s).id;s.items.push({...water(s),id:'water-extra'});
  s=act(s,{type:'tradeBatch',visitorId:v.id,itemIds:[id],amount:1000});expect(s.visitors[2]!.negotiation?.status).toBe('counter');
  s=act(s,{type:'reserveItem',itemId:id,reserved:true});
  expect(tradeItemProblem(s,s.visitors[2]!,water(s))).toContain('留货');
  const actions:Action[]=[{type:'acceptTrade',visitorId:v.id,itemId:id},{type:'offer',visitorId:v.id,itemId:id,amount:1},{type:'tradeBatch',visitorId:v.id,itemIds:[id,'water-extra']},{type:'tradeBatch',visitorId:v.id,itemIds:[id],amount:s.visitors[2]!.negotiation!.quote},{type:'liquidate',itemId:id}];
  for(const action of actions)expect(reject(s,action)).toContain('留货');
  s=act(s,{type:'reserveItem',itemId:id,reserved:false});const cash=s.cash;s=act(s,{type:'tradeBatch',visitorId:v.id,itemIds:[id],amount:1});expect(s.cash).toBe(cash+1);expect(s.items.some(i=>i.id===id)).toBe(false);
 });
 it('requires explicit release for deliveries, then keeps the real cost and reward accounting',()=>{
  let s=createGame(42);const job=deliveryJobs(s).find(j=>j.templateId==='doorstep-water')!,id=water(s).id;
  s=act(s,{type:'acceptDelivery',jobId:job.id});s=act(s,{type:'reserveItem',itemId:id,reserved:true});
  expect(deliveryItemCheck(s,deliveryDefinition(job),water(s))).toEqual({ready:false,reason:'已留货，请先解除留货'});
  expect(reject(s,{type:'deliverGoods',jobId:job.id,itemIds:[id]})).toContain('留货');
  s=act(s,{type:'reserveItem',itemId:id,reserved:false});const cash=s.cash,cost=water(s).cost;
  s=act(s,{type:'deliverGoods',jobId:job.id,itemIds:[id]});expect(s.cash-cash).toBe(deliveryDefinition(job).reward);expect(s.deliveries!.find(j=>j.id===job.id)!.goods![0]!.cost).toBe(cost);
 });
 it('allows preservation, sorting, display and withdrawal without clearing a mark; expired salvage still requires release',()=>{
  let s=createGame(42);const id=water(s).id;
  s=act(s,{type:'reserveItem',itemId:id,reserved:true});s=act(s,{type:'preserve',itemId:id});expect(water(s).preservedUntil).toBeGreaterThan(0);
  s=act(s,{type:'sort'});water(s).known.push('serial');water(s).authentic=true;
  s=act(s,{type:'display',itemId:id});expect(water(s).reserved).toBe(true);s=act(s,{type:'withdraw',itemId:id});expect(water(s).reserved).toBe(true);
  water(s).expiresDay=0;expect(reject(s,{type:'liquidate',itemId:id})).toContain('留货');s=act(s,{type:'reserveItem',itemId:id,reserved:false});const cash=s.cash,quote=clearanceQuote(s,water(s));s=act(s,{type:'liquidate',itemId:id});expect(s.cash-cash).toBe(quote);
 });
 it('keeps a reserved item through its own repair without preventing customer job delivery',()=>{
  let s=act(createGame(42),{type:'callVisitor'});s=act(s,{type:'acceptRepair',visitorId:s.visitors[0]!.id});const client=s.orders[0]!.itemId;
  expect(reject(s,{type:'reserveItem',itemId:client,reserved:true})).toContain('自有');s=repairActive(s);expect(s.items.some(i=>i.id===client)).toBe(false);
  s=act(s,{type:'nextVisitor'});const v=s.visitors[1]!,id=v.goods![0]!.id;
  s=act(s,{type:'tradeBatch',visitorId:v.id,itemIds:[id]});s=act(s,{type:'moveStock',itemId:id,x:12,y:0,rotated:false});
  s=act(s,{type:'reserveItem',itemId:id,reserved:true});s=act(s,{type:'startRepair',itemId:id});s.hours=20;s=repairActive(s);
  expect(s.items.find(i=>i.id===id)).toMatchObject({location:'stock',reserved:true});expect(s.orders.find(o=>o.itemId===id)?.delivered).toBe(true);
 });
 it('separates reserved and sale stock without indexing hidden attributes',()=>{
  let s=createGame(42),id=water(s).id;s=act(s,{type:'reserveItem',itemId:id,reserved:true});water(s).known=[];water(s).expiresDay=0;
  expect(stockEntries(s,{status:'reserved'}).map(i=>i.id)).toEqual([id]);expect(stockEntries(s,{status:'stored'}).some(i=>i.id===id)).toBe(false);expect(stockEntries(s,{status:'expiring'}).some(i=>i.id===id)).toBe(false);
 });
 it('supports old saves, rejects invalid flags and refuses missing or incoming objects',()=>{
  const s=createGame(42);expect(importSave(exportSave(s))).toEqual(s);
  for(const value of ['true',1,null]){const bad=structuredClone(s);Object.assign(water(bad),{reserved:value});expect(()=>validateState(bad)).toThrow('留货');}
  reject(s,{type:'reserveItem',itemId:'missing',reserved:true});reject(s,{type:'reserveItem',itemId:s.visitors[1]!.goods![0]!.id,reserved:true});
  const bad=structuredClone(s);Object.assign(water(bad),{owner:'customer',location:'workshop',reserved:true});expect(()=>validateState(bad)).toThrow('留货');
 });
});
