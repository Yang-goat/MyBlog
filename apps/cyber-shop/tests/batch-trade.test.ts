import { createReadyGame as createGame } from './helpers';
import { describe, it, expect } from 'vitest';
import { applyAction, capacity, tradeQuote, visibleState } from '../src/game/engine';
import { ITEMS } from '../src/content';
import { warehouseLayout } from '../src/game/warehouse';
import { exportSave, importSave } from '../src/persistence/storage';
import { act } from './helpers';
const seller=()=>{let s=createGame(42);s=act(s,{type:'reject',visitorId:s.visitors[0]!.id});s=act(s,{type:'nextVisitor'});return {...s,cash:10000};};
describe('selective and wholesale trade',()=>{
 it('buys one first, then three at wholesale price, preserving the remaining NPC goods',()=>{
  let s=seller();const v=s.visitors[1]!;const ids=v.goods!.map(i=>i.id);const cash=s.cash;
  s=act(s,{type:'tradeBatch',visitorId:v.id,itemIds:[ids[0]!]});
  expect(s.cash).toBe(cash-v.quote);expect(s.visitors[1]!.resolved).toBe(false);expect(s.visitors[1]!.goods).toHaveLength(3);
  s=importSave(exportSave(s));s=act(s,{type:'tradeBatch',visitorId:v.id,itemIds:ids.slice(1)});
  expect(s.cash).toBe(cash-v.quote-Math.round(v.goods!.slice(1).reduce((n,i)=>n+tradeQuote(s,v,i),0)*.9));expect(s.visitors[1]!.resolved).toBe(true);
  expect(s.items.filter(i=>ids.includes(i.id)).reduce((n,i)=>n+i.cost,0)).toBe(cash-s.cash);
  expect(s.items.filter(i=>ids.includes(i.id)).every(i=>i.location==='counter')).toBe(true);
 });
 it('does not give a wholesale discount for repeated single purchases',()=>{
  let s=seller();const v=s.visitors[1]!;const cash=s.cash;
  for(const item of v.goods!)s=act(s,{type:'tradeBatch',visitorId:v.id,itemIds:[item.id]});
  expect(s.cash).toBe(cash-v.goods!.reduce((n,i)=>n+tradeQuote(s,v,i),0));
 });
 it('rejects duplicate, stale, unavailable or unaffordable basket contents atomically',()=>{
  let s=seller();const v=s.visitors[1]!;const id=v.goods![0]!.id;
  for(const ids of [[],[id,id],['missing']])expect(applyAction(s,{type:'tradeBatch',visitorId:v.id,itemIds:ids}).state).toEqual(s);
  const poor={...s,cash:0};expect(applyAction(poor,{type:'tradeBatch',visitorId:v.id,itemIds:[id]}).state).toEqual(poor);
  s=act(s,{type:'tradeBatch',visitorId:v.id,itemIds:[id]});expect(applyAction(s,{type:'tradeBatch',visitorId:v.id,itemIds:[id]}).ok).toBe(false);
 });
 it('sells multiple items, keeps the buyer for later batches and enforces remaining budget',()=>{
  let s=seller();const sellerV=s.visitors[1]!;const ids=sellerV.goods!.map(i=>i.id);
  s=act(s,{type:'tradeBatch',visitorId:sellerV.id,itemIds:ids});
  for(const id of ids){const at=warehouseLayout(s.items.map(i=>i.id===id?{...i,location:'stock'}:i),capacity(s)).positions[id]!;s=act(s,{type:'moveStock',itemId:id,...at});}
  s=act(s,{type:'nextVisitor'});let buyer=s.visitors[2]!;buyer.category=sellerV.category;buyer.budget=10000;
  const amount=ids.slice(0,2).reduce((n,id)=>n+tradeQuote(s,buyer,s.items.find(i=>i.id===id)!),0);const cash=s.cash;
  s=act(s,{type:'tradeBatch',visitorId:buyer.id,itemIds:ids.slice(0,2)});expect(s.cash).toBe(cash+amount);expect(s.visitors[2]!.budget).toBe(10000-amount);expect(s.visitors[2]!.resolved).toBe(false);
  s.visitors[2]!.budget=1;expect(applyAction(s,{type:'tradeBatch',visitorId:buyer.id,itemIds:[ids[2]!]}).state).toEqual(s);
  s=importSave(exportSave(s));expect(s.visitors[2]!.budget).toBe(1);
 });
 it('generates independent lots, keeps each tag across save/inspection, and conceals hidden attributes',()=>{
  let s=seller();const v=s.visitors[1]!,goods=v.goods!;
  expect(new Set(goods.map(i=>JSON.stringify([i.definitionId,i.condition,i.faults,i.capacity]))).size).toBeGreaterThan(1);
  const tags=structuredClone(v.priceTags);
  s=importSave(exportSave(s));s=act(s,{type:'inspect',visitorId:v.id,itemId:goods[1]!.id,method:'basic'});
  expect(s.visitors[1]!.goods![0]!.known).not.toContain('basic');
  expect(s.visitors[1]!.goods![1]!.known).toContain('basic');
  expect(s.visitors[1]!.priceTags).toEqual(tags);
  const visible=visibleState(s).visitor!;
  expect(visible.goods![1]!.quote).toBe(tags![goods[1]!.id]!.ask);
  expect(visible.goods![0]!.condition).toBeUndefined();expect(visible.goods![0]!.authentic).toBeUndefined();
  expect(visible).not.toHaveProperty('priceTags');expect(visible).not.toHaveProperty('limit');
 });
 it('keeps old saves without per-item tags tradable at their original uniform price',()=>{
  let s=seller();delete s.visitors[1]!.priceTags;s=importSave(exportSave(s));const v=s.visitors[1]!,cash=s.cash;
  s=act(s,{type:'tradeBatch',visitorId:v.id,itemIds:v.goods!.slice(0,3).map(i=>i.id)});
  expect(s.cash).toBe(cash-Math.round(v.quote*3*.9));
 });
 it('checks a mixed basket against the sum of its individual minimums',()=>{
  let s=seller();const v=s.visitors[1]!,ids=v.goods!.slice(0,3).map(i=>i.id);
  const minimum=Math.round(ids.reduce((n,id)=>n+v.priceTags![id]!.minimum,0)*.9),cash=s.cash;
  const rejected=act(s,{type:'tradeBatch',visitorId:v.id,itemIds:ids,amount:minimum-1});
  expect(rejected.cash).toBe(cash);expect(rejected.visitors[1]!.rounds).toBe(1);
  s=act(s,{type:'tradeBatch',visitorId:v.id,itemIds:ids,amount:minimum});expect(s.cash).toBe(cash-minimum);
 });
 it('counts authentic rare batch sales for the optional challenge and pays only at closing',()=>{
  let s=seller();s=act(s,{type:'reject',visitorId:s.visitors[1]!.id});s=act(s,{type:'nextVisitor'});
  const template=ITEMS.find(d=>d.category==='antique'&&d.rarity>=3)!;
  const source=s.items.find(i=>i.owner==='player')!;
  s.items=[0,1,2].map(n=>({...structuredClone(source),id:`rare-${n}`,definitionId:template.id,authentic:n<2,faults:[],location:'stock' as const}));
  const v=s.visitors[2]!;v.category='antique';v.budget=100000;
  s.challenge={id:'rare-trade',goal:2,progress:0,deadline:s.day+5,reward:2200};
  s=act(s,{type:'tradeBatch',visitorId:v.id,itemIds:s.items.map(i=>i.id)});
  expect(s.challenge!.progress).toBe(2);expect(s.ledger.filter(e=>e.kind==='challenge')).toHaveLength(0);
  s=act(s,{type:'closeDay'});expect(s.challenge).toBeNull();expect(s.ledger.filter(e=>e.kind==='challenge').map(e=>e.amount)).toEqual([2200]);
 });
});
