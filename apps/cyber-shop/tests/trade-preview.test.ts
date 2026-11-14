import {describe,it,expect} from 'vitest';
import {createGame,applyAction,tradeQuote,tradeItemProblem,clearanceQuote} from '../src/game/engine';
import {tradePaymentPreview} from '../src/game/trade-preview';
import {ITEMS} from '../src/content';
import {act} from './helpers';
import type {Action,GameState,ItemInstance} from '../src/game/types';

function seller(){let s=act(createGame(42),{type:'callVisitor'});s=act(s,{type:'reject',visitorId:s.visitors[0]!.id});return act(s,{type:'nextVisitor'});}
function current(s:GameState){return s.visitors[s.visitorIndex]!;}
function foodBuyer(){const s=createGame(42);s.visitorIndex=2;s.visitorArrived=true;const v=current(s);v.category='food';v.budget=2000;return s;}
describe('trade prerequisites and amount-specific payment previews',()=>{
 it('rejects expired stock atomically in both single and batch trades, keeping clearance available',()=>{
  const s=foodBuyer(),v=current(s),food=s.items.find(i=>i.definitionId==='purified-water')!;food.expiresDay=0;food.known=['basic'];
  expect(tradeQuote(s,v,food)).toBe(0);expect(tradeItemProblem(s,v,food)).toContain('已过期');
  for(const action of [{type:'tradeBatch',visitorId:v.id,itemIds:[food.id]},{type:'offer',visitorId:v.id,itemId:food.id,amount:1},{type:'acceptTrade',visitorId:v.id,itemId:food.id}] as Action[]){const r=applyAction(s,action);expect(r.ok).toBe(false);expect(r.state).toEqual(s);}
  const price=clearanceQuote(s,food);expect(price).toBeGreaterThan(0);const cleared=act(s,{type:'liquidate',itemId:food.id});expect(cleared.cash-s.cash).toBe(price);expect(cleared.items.some(i=>i.id===food.id)).toBe(false);
 });
 it('does not disclose the date or expiry reason when the food has not been inspected',()=>{
  const s=foodBuyer(),v=current(s),food=s.items.find(i=>i.definitionId==='purified-water')!;food.known=[];food.expiresDay=0;
  expect(tradeItemProblem(s,v,food)).toBe('当前没有收购报价。');
  food.expiresDay=s.day;expect(tradeQuote(s,v,food)).toBeGreaterThan(0);expect(tradeItemProblem(s,v,food)).toBe('');
  const owner=current(s);owner.kind='seller';owner.priceTags={[food.id]:{ask:50,minimum:30}};food.expiresDay=0;expect(tradeQuote(s,owner,food)).toBe(0);expect(tradeItemProblem(s,owner,food)).toBe('当前没有收购报价。');
 });
 it('uses the same license gate before picking and during settlement',()=>{
  const s=seller(),v=current(s),item=v.goods![0]!;item.definitionId=ITEMS.find(d=>d.regulated)!.id;
  expect(tradeItemProblem(s,v,item)).toContain('许可');const r=applyAction(s,{type:'tradeBatch',visitorId:v.id,itemIds:[item.id]});expect(r.ok).toBe(false);expect(r.state).toEqual(s);
  s.licenses.push('regulated-trade');expect(tradeItemProblem(s,v,item)).toBe('');
 });
 it('excludes wrong categories, customer goods, displays and active work from buyer selection',()=>{
  const s=foodBuyer(),v=current(s),food=s.items.find(i=>i.definitionId==='purified-water')!;
  const alternatives:ItemInstance[]=[{...food,owner:'customer'},{...food,location:'display'},{...food,location:'workshop'},{...food,definitionId:'data-chip'}];
  for(const item of alternatives)expect(tradeItemProblem(s,v,item)).not.toBe('');
  s.orders.push({id:'order-test',itemId:food.id,characterId:'player',description:'test',diagnosed:false,verified:false,delivered:false,escrow:0,reward:0,completedOps:0,kind:'own',preserveOriginal:false});expect(tradeItemProblem(s,v,food)).not.toBe('');
 });
 it('matches actual seller cash and allocated cost for a negotiated three-item purchase',()=>{
  let s=seller();const v=current(s),goods=v.goods!.slice(0,3),ids=goods.map(i=>i.id),amount=Math.round(goods.reduce((n,i)=>n+v.priceTags![i.id]!.minimum,0)*.9);
  const before=structuredClone(s),preview=tradePaymentPreview(s,v,goods,amount)!;expect(preview.margin).toBeNull();expect(preview.cost).toBe(amount);expect(s).toEqual(before);
  s=act(s,{type:'tradeBatch',visitorId:v.id,itemIds:ids,amount});expect(s.cash).toBe(preview.cashAfter);expect(current(s).lastTrade!.cost).toBe(preview.cost);
 });
 it('matches buyer counteroffer proceeds and cost without altering price, history or hidden limits',()=>{
  let s=foodBuyer();const v=current(s),food=s.items.find(i=>i.definitionId==='purified-water')!;v.budget=100;
  s=act(s,{type:'tradeBatch',visitorId:v.id,itemIds:[food.id],amount:1000});const reply=current(s).negotiation!,before=structuredClone(s),preview=tradePaymentPreview(s,current(s),[food],reply.quote)!;
  expect(preview.margin).toBe(reply.quote-food.cost);expect(s).toEqual(before);
  s=act(s,{type:'tradeBatch',visitorId:v.id,itemIds:[food.id],amount:reply.quote});expect(s.cash).toBe(preview.cashAfter);expect(current(s).lastTrade!.amount-current(s).lastTrade!.cost).toBe(preview.margin);
 });
 it('reports shortages and negative differences, and ignores invalid or empty offers',()=>{
  const s=foodBuyer(),v=current(s),food=s.items[0]!;food.cost=100;v.budget=30;
  expect(tradePaymentPreview(s,v,[food],20)).toMatchObject({margin:-80,shortfall:0,cashAfter:s.cash+20});
  expect(tradePaymentPreview(s,v,[food],50)).toMatchObject({shortfall:20});
  for(const amount of [0,-1,1.5,NaN,Infinity])expect(tradePaymentPreview(s,v,[food],amount)).toBeNull();
  expect(tradePaymentPreview(s,v,[],10)).toBeNull();v.kind='seller';s.cash=5;expect(tradePaymentPreview(s,v,[food],10)).toMatchObject({cashAfter:-5,shortfall:5,margin:null});
 });
});
