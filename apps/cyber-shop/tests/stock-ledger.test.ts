import {describe,it,expect} from 'vitest';
import {createGame,clearanceQuote,applyAction} from '../src/game/engine';
import {stockEntries,stockLocation,heldDays} from '../src/game/stock-ledger';
import {ITEMS} from '../src/content';
import type {StorageContainer} from '../src/game/types';

describe('stock ledger with nested storage',()=>{
 it('finds merchandise by any level of its player-written container path',()=>{
  const s=createGame(42),item=s.items[0]!;
  const box=(id:string,label:string,parent?:string):StorageContainer=>({id,styleId:'courier-pack',label,owner:'player',color:'ivory',cost:300,acquiredDay:1,location:'stock',containerId:parent});
  s.containers=[box('outer','待售 A'),box('middle','街坊订货','outer'),box('inner','食材','middle')];item.containerId='inner';
  expect(stockLocation(s,item)).toBe('仓库 › 待售 A › 街坊订货 › 食材');
  const name=ITEMS.find(d=>d.id===item.definitionId)!.name;
  expect(stockEntries(s,{query:`a 订货 ${name}`})).toEqual([item]);
  s.containers[0]!.location='counter';expect(stockLocation(s,item)).toMatch(/^谈判台/);
 });
 it('never reveals hidden expiry or source information through filters or search',()=>{
  const s=createGame(42),food=s.items.find(i=>ITEMS.find(d=>d.id===i.definitionId)?.category==='food')!;
  food.known=[];food.expiresDay=s.day;food.provenance='未公开的来源编号';
  expect(stockEntries(s,{status:'expiring'})).toEqual([]);
  expect(stockEntries(s,{query:'未公开的来源编号'})).toEqual([]);
  food.known.push('basic');expect(stockEntries(s,{status:'expiring'})).toEqual([food]);
  expect(stockEntries(s,{status:'unchecked'})).not.toContain(food);
 });
 it('counts only unsold goods as aged inventory and excludes customer goods',()=>{
  const s=createGame(42);s.day=5;const [old,display,work]=s.items;
  old!.acquiredDay=1;display!.location='display';work!.location='workshop';
  s.items.push({...old!,id:'customer-test',owner:'customer'});
  expect(heldDays(s,old!)).toBe(4);expect(stockEntries(s,{status:'aged'})).toEqual([old]);
  expect(stockEntries(s)).toHaveLength(3);expect(stockLocation(s,display!)).toBe('展示柜');expect(stockLocation(s,work!)).toBe('维修工作台');
 });
 it('combines filters and sorts a copy without changing physical slots or the ledger',()=>{
  const s=createGame(42);s.items[0]!.cost=200;s.items[1]!.cost=400;s.items[2]!.cost=50;s.items[2]!.acquiredDay=2;
  const before=structuredClone(s);expect(stockEntries(s,{order:'cost'}).map(i=>i.cost)).toEqual([400,200,50]);
  expect(stockEntries(s,{order:'newest'})[0]!.id).toBe(s.items[2]!.id);
  expect(stockEntries(s,{category:'data',query:'不存在'})).toEqual([]);expect(s).toEqual(before);
 });
 it('pays the displayed clearance quote and removes only the chosen item',()=>{
  const s=createGame(42),item=s.items[0]!,quote=clearanceQuote(s,item);
  const r=applyAction(s,{type:'liquidate',itemId:item.id});expect(r.ok).toBe(true);
  expect(r.state.cash-s.cash).toBe(quote);expect(r.state.items.map(i=>i.id)).toEqual(s.items.filter(i=>i.id!==item.id).map(i=>i.id));
  expect(r.state.ledger.at(-1)?.amount).toBe(quote);
 });
});
