import { createReadyGame as createGame } from './helpers';
import { describe, it, expect } from 'vitest';
import { applyAction, capacity, tradeQuote } from '../src/game/engine';
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
  expect(s.cash).toBe(cash-v.quote-Math.round(v.quote*3*.9));expect(s.visitors[1]!.resolved).toBe(true);
  expect(s.items.filter(i=>ids.includes(i.id)).reduce((n,i)=>n+i.cost,0)).toBe(cash-s.cash);
  expect(s.items.filter(i=>ids.includes(i.id)).every(i=>i.location==='counter')).toBe(true);
 });
 it('does not give a wholesale discount for repeated single purchases',()=>{
  let s=seller();const v=s.visitors[1]!;const cash=s.cash;
  for(const item of v.goods!)s=act(s,{type:'tradeBatch',visitorId:v.id,itemIds:[item.id]});
  expect(s.cash).toBe(cash-v.quote*4);
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
});
