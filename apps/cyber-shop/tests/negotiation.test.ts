import {describe,it,expect} from 'vitest';
import {createGame,applyAction,tradeQuote,itemValue,visibleState} from '../src/game/engine';
import {allocateQuote} from '../src/game/negotiation';
import {act} from './helpers';
import {exportSave,importSave,validateState} from '../src/persistence/storage';

function seller(){let s=act(createGame(42),{type:'callVisitor'});s=act(s,{type:'reject',visitorId:s.visitors[0]!.id});s=act(s,{type:'nextVisitor'});return s;}
function buyer(){let s=seller();const v=s.visitors[1]!;s=act(s,{type:'tradeBatch',visitorId:v.id,itemIds:v.goods!.slice(0,2).map(i=>i.id)});s=act(s,{type:'reject',visitorId:v.id});s=act(s,{type:'nextVisitor'});s.visitors[2]!.category=v.category;return s;}
describe('persisted counteroffers and transaction receipts',()=>{
 it('reduces only the selected seller tags, honours wholesale rounding and pays once on acceptance',()=>{
  let s=seller();const original=structuredClone(s),v=s.visitors[1]!,ids=v.goods!.slice(0,3).map(i=>i.id),unselected=v.goods![3]!.id;
  const minimum=Math.round(ids.reduce((n,id)=>n+v.priceTags![id]!.minimum,0)*.9);
  const response=applyAction(s,{type:'tradeBatch',visitorId:v.id,itemIds:ids,amount:minimum-1});expect(response.ok).toBe(true);expect(s).toEqual(original);s=response.state;
  const after=s.visitors[1]!,reply=after.negotiation!;expect(reply.status).toBe('counter');expect(s.cash).toBe(original.cash);expect(s.ledger).toEqual(original.ledger);expect(s.records).toEqual(original.records);
  expect(after.priceTags![unselected]).toEqual(v.priceTags![unselected]);expect(reply.quote).toBe(Math.round(ids.reduce((n,id)=>n+after.priceTags![id]!.ask,0)*.9));
  expect(reply.quote).toBeGreaterThanOrEqual(minimum);expect(ids.every(id=>after.priceTags![id]!.ask<v.priceTags![id]!.ask)).toBe(true);
  expect(visibleState(s).visitor).not.toHaveProperty('priceTags');s=importSave(exportSave(s));
  s=act(s,{type:'tradeBatch',visitorId:v.id,itemIds:ids,amount:reply.quote});expect(s.cash).toBe(original.cash-reply.quote);expect(s.visitors[1]!.negotiation).toBeUndefined();
  expect(s.visitors[1]!.lastTrade).toMatchObject({kind:'buy',amount:reply.quote,cost:reply.quote});expect(s.visitors[1]!.lastTrade!.goods.reduce((n,i)=>n+i.cost,0)).toBe(reply.quote);
  expect(applyAction(s,{type:'tradeBatch',visitorId:v.id,itemIds:ids,amount:reply.quote}).ok).toBe(false);validateState(s);
 });
 it('uses the same seller reply for single-item and batch actions, including older uniform tags',()=>{
  const s=seller(),v=s.visitors[1]!,item=v.goods![0]!;
  const one=act(s,{type:'offer',visitorId:v.id,amount:1});const batch=act(s,{type:'tradeBatch',visitorId:v.id,itemIds:[item.id],amount:1});expect(one.visitors[1]!.negotiation).toEqual(batch.visitors[1]!.negotiation);
  const legacy=structuredClone(s);delete legacy.visitors[1]!.priceTags;
  const negotiated=act(importSave(exportSave(legacy)),{type:'tradeBatch',visitorId:v.id,itemIds:v.goods!.slice(0,3).map(i=>i.id),amount:1});
  expect(Object.keys(negotiated.visitors[1]!.priceTags!)).toHaveLength(4);expect(importSave(exportSave(negotiated))).toEqual(negotiated);
 });
 it('gives a buyer quote that fits the actual remaining budget and all item ceilings',()=>{
  let s=buyer();const v=s.visitors[2]!,goods=s.items.filter(i=>i.location==='counter'),ids=goods.map(i=>i.id),before=s.cash;v.budget=150;
  const ceilings=goods.map(i=>Math.round(itemValue(s,i)*v.limit/10000));
  s=act(s,{type:'tradeBatch',visitorId:v.id,itemIds:ids,amount:5000});const reply=s.visitors[2]!.negotiation!;expect(reply.quote).toBe(Math.min(150,ceilings.reduce((n,c)=>n+c,0)));
  const prices=goods.map(i=>tradeQuote(s,s.visitors[2]!,i));expect(prices.reduce((n,p)=>n+p,0)).toBe(reply.quote);expect(prices.every((p,i)=>p>0&&p<=ceilings[i]!)).toBe(true);
  s=importSave(exportSave(s));s=act(s,{type:'tradeBatch',visitorId:v.id,itemIds:ids,amount:reply.quote});expect(s.cash).toBe(before+reply.quote);expect(s.visitors[2]!.budget).toBe(150-reply.quote);
  expect(s.visitors[2]!.lastTrade!.cost).toBe(goods.reduce((n,i)=>n+i.cost,0));expect(s.ledger.filter(e=>e.kind==='sale').every(e=>e.note.includes('累计成本'))).toBe(true);validateState(s);
 });
 it('does not bypass a buyer budget via the legacy single-item action',()=>{
  const s=buyer(),v=s.visitors[2]!,item=s.items.find(i=>i.location==='counter')!;v.budget=1;
  const denied=applyAction(s,{type:'acceptTrade',visitorId:v.id,itemId:item.id});expect(denied.ok).toBe(false);expect(denied.state).toEqual(s);
  const agreed=act(s,{type:'offer',visitorId:v.id,itemId:item.id,amount:1});expect(agreed.visitors[2]!.budget).toBe(0);expect(agreed.visitors[2]!.lastTrade!.amount).toBe(1);
 });
 it('keeps rejected goods and money when patience runs out, including after reload',()=>{
  let s=seller();const v=s.visitors[1]!,id=v.goods![0]!.id,cash=s.cash;
  while(!s.visitors[1]!.resolved){s=act(s,{type:'tradeBatch',visitorId:v.id,itemIds:[id],amount:1});s=importSave(exportSave(s));}
  expect(s.cash).toBe(cash);expect(s.records.trades).toBe(0);expect(s.visitors[1]!.goods).toHaveLength(4);expect(s.visitors[1]!.negotiation!.status).toBe('closed');
  expect(applyAction(s,{type:'tradeBatch',visitorId:v.id,itemIds:[id]}).ok).toBe(false);
 });
 it('holds a firm quote against extreme offers and concedes gradually for a near buyer offer',()=>{
  const initial=seller(),v=initial.visitors[1]!,item=v.item!;
  const low=act(initial,{type:'tradeBatch',visitorId:v.id,itemIds:[item.id],amount:1});expect(low.visitors[1]!.negotiation!.reason).toBe('far');expect(tradeQuote(low,low.visitors[1]!,item)).toBe(tradeQuote(initial,v,item));
  const s=buyer(),b=s.visitors[2]!,goods=s.items.filter(i=>i.location==='counter'),ids=goods.map(i=>i.id);b.budget=10000;
  const current=goods.reduce((n,i)=>n+tradeQuote(s,b,i),0),ceiling=goods.reduce((n,i)=>n+Math.round(itemValue(s,i)*b.limit/10000),0);
  const far=act(s,{type:'tradeBatch',visitorId:b.id,itemIds:ids,amount:99999});expect(far.visitors[2]!.negotiation).toMatchObject({reason:'far',quote:current});
  const near=act(s,{type:'tradeBatch',visitorId:b.id,itemIds:ids,amount:ceiling+1});expect(near.visitors[2]!.negotiation!.quote).toBeGreaterThan(current);expect(near.visitors[2]!.negotiation!.quote).toBeLessThan(ceiling);
 });
 it('preserves integer prices for uneven tiny ceilings and rejects damaged reply receipts',()=>{
  for(const [total,ceilings] of [[5,[1,1,8]],[7,[3,2,4]],[4,[1,1,2]],[12,[5,6,1]]] as const){const prices=allocateQuote(total,[...ceilings]);expect(prices.reduce((n,p)=>n+p,0)).toBe(total);expect(prices.every((p,i)=>Number.isSafeInteger(p)&&p>=1&&p<=ceilings[i]!)).toBe(true);}
  expect(()=>allocateQuote(0,[])).toThrow();expect(()=>allocateQuote(2,[1])).toThrow();
  let s=seller();const v=s.visitors[1]!;s=act(s,{type:'tradeBatch',visitorId:v.id,itemIds:[v.item!.id],amount:1});s.visitors[1]!.negotiation!.quote=NaN;expect(()=>validateState(s)).toThrow('议价');
  s=seller();s=act(s,{type:'tradeBatch',visitorId:s.visitors[1]!.id,itemIds:[s.visitors[1]!.item!.id]});s.visitors[1]!.lastTrade!.cost++;expect(()=>validateState(s)).toThrow('成本');
 });
});
