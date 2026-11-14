import {describe,it,expect} from 'vitest';
import {act,createReadyGame} from './helpers';
import {applyAction,visibleState} from '../src/game/engine';
import {buyerRemaining,purchaseQuantity} from '../src/game/demand';
import {exportSave,importSave,validateState} from '../src/persistence/storage';
import {STORAGE_STYLES} from '../src/content/storage';

function buyer(){
 let s=createReadyGame(42);s.cash=10000;s=act(s,{type:'reject',visitorId:s.visitors[0]!.id});s=act(s,{type:'nextVisitor'});
 const seller=s.visitors[1]!,category=seller.category;const ids=seller.goods!.map(i=>i.id);
 s=act(s,{type:'tradeBatch',visitorId:seller.id,itemIds:ids});s=act(s,{type:'reject',visitorId:seller.id});s=act(s,{type:'nextVisitor'});
 const v=s.visitors[2]!;v.category=category;v.budget=100000;v.demand={limit:2,fulfilled:0};return {s,ids,id:v.id};
}
describe('finite buyer demand and stock turnover',()=>{
 it('states different realistic order sizes without changing the item or warehouse grids',()=>{
  expect(purchaseQuantity('uppercity','data')).toBe(1);expect(purchaseQuantity('union','electronics')).toBe(3);expect(purchaseQuantity('neighborhood','food')).toBe(3);
  const s=createReadyGame();for(const v of s.visitors.filter(v=>v.kind==='buyer')){expect(v.demand!.limit).toBeGreaterThan(0);expect(v.demand!.limit).toBeLessThanOrEqual(4);expect(v.request).toContain(`${v.demand!.limit} 件`);}
 });
 it('rejects excess quantity before negotiation or payment and leaves the entire basket intact',()=>{
  const {s,ids,id}=buyer();const before=structuredClone(s);
  for(const amount of [undefined,1,999999]){const r=applyAction(s,{type:'tradeBatch',visitorId:id,itemIds:ids.slice(0,3),amount});expect(r.ok).toBe(false);expect(r.state).toEqual(before);expect(r.events[0]!.text).toContain('还收 2 件');}
 });
 it('persists the cumulative count across split receipts, then keeps surplus stock and the last receipt visible',()=>{
  let {s,ids,id}=buyer();s=act(s,{type:'tradeBatch',visitorId:id,itemIds:[ids[0]!]});expect(buyerRemaining(s.visitors[2]!)).toBe(1);
  s=importSave(exportSave(s));expect(applyAction(s,{type:'tradeBatch',visitorId:id,itemIds:ids.slice(1,3)}).ok).toBe(false);
  s=act(s,{type:'tradeBatch',visitorId:id,itemIds:[ids[1]!]});expect(buyerRemaining(s.visitors[2]!)).toBe(0);expect(s.visitors[2]!.resolved).toBe(false);
  expect(s.items.filter(i=>ids.slice(2).includes(i.id))).toHaveLength(2);expect(visibleState(s).visitor!.demand).toEqual({limit:2,fulfilled:2});expect(s.visitors[2]!.lastTrade!.goods[0]!.itemId).toBe(ids[1]);
  expect(applyAction(s,{type:'tradeBatch',visitorId:id,itemIds:[ids[2]!]}).state).toEqual(s);
  expect(applyAction(s,{type:'acceptTrade',visitorId:id,itemId:ids[2]}).state).toEqual(s);
  expect(applyAction(s,{type:'offer',visitorId:id,itemId:ids[2],amount:1}).state).toEqual(s);
  s=act(s,{type:'reject',visitorId:id});expect(s.visitors[2]!.resolved).toBe(true);
 });
 it('counts an empty container as one purchase and does not bypass the limit through container sales',()=>{
  let {s,ids,id}=buyer();const d=STORAGE_STYLES[0];s.containers=[{id:'box-demand',owner:'player',styleId:d.id,label:d.name,color:'green',cost:d.price,acquiredDay:1,location:'stock',grid:{x:20,y:4,rotated:false}}];
  s=act(s,{type:'sellStorage',visitorId:id,storageId:'box-demand'});expect(buyerRemaining(s.visitors[2]!)).toBe(1);
  s=act(s,{type:'tradeBatch',visitorId:id,itemIds:[ids[0]!]});
  s.containers=[{id:'box-spare',owner:'player',styleId:d.id,label:d.name,color:'green',cost:d.price,acquiredDay:1,location:'stock',grid:{x:20,y:4,rotated:false}}];
  expect(applyAction(s,{type:'sellStorage',visitorId:id,storageId:'box-spare'}).state).toEqual(s);
 });
 it('honors a legacy in-progress agreement until the next day generates finite orders',()=>{
  let {s,ids,id}=buyer();delete s.visitors[2]!.demand;s=importSave(exportSave(s));
  s=act(s,{type:'tradeBatch',visitorId:id,itemIds:ids});expect(s.items.some(i=>ids.includes(i.id))).toBe(false);
  s=act(act(s,{type:'closeDay'}),{type:'openDay'});expect(s.visitors.filter(v=>v.kind==='buyer').every(v=>v.demand?.fulfilled===0)).toBe(true);
 });
 it('rejects malformed and over-fulfilled saved demand',()=>{
  const {s}=buyer();for(const demand of [{limit:0,fulfilled:0},{limit:5,fulfilled:0},{limit:2,fulfilled:3},{limit:2,fulfilled:-1},{limit:2.5,fulfilled:0}]){const bad=structuredClone(s);bad.visitors[2]!.demand=demand;expect(()=>validateState(bad)).toThrow('采购数量');}
 });
});
