import {describe,it,expect} from 'vitest';import {createGame,rootCapacity,operatingFees} from '../src/game/engine';import {act} from './helpers';import {validateState,exportSave,importSave} from '../src/persistence/storage';
import {applyAction,tradeQuote} from '../src/game/engine';
import {dailyHours} from '../src/game/modifiers';
describe('optional starting modifiers',()=>{
 it('keeps standard starting conditions unchanged',()=>{const s=createGame(42);expect(s.cash).toBe(1200);expect(rootCapacity(s)*4).toBe(144);expect(operatingFees(s)).toBe(85);});
 it('combines advantages with challenges and persists their effects across days',()=>{let s=createGame(42,['extra-cash','cramped-stock','high-rent']);expect(s.cash).toBe(1800);expect(rootCapacity(s)*4).toBe(72);expect(operatingFees(s)).toBe(135);s=act(s,{type:'closeDay'});expect(s.cash).toBe(1665);s=act(s,{type:'openDay'});expect(rootCapacity(s)*4).toBe(72);expect(importSave(exportSave(s))).toEqual(s);s.victory=true;expect(operatingFees(s)).toBe(20);});
 it('applies the other directions and prevents conflicting or forged modifiers',()=>{const s=createGame(42,['tight-cash','roomy-stock']);expect(s.cash).toBe(600);expect(rootCapacity(s)*4).toBe(192);for(const ids of [['extra-cash','tight-cash'],['roomy-stock','cramped-stock'],['fake'],['high-rent','high-rent']]){expect(()=>createGame(42,ids)).toThrow();expect(()=>validateState({...s,modifiers:ids})).toThrow();}delete s.modifiers;expect(rootCapacity(s)*4).toBe(144);});
});

describe('daily conditions change actual operating decisions',()=>{
 it.each([['long-shift',14],['short-shift',10]] as const)('resets %s hours each day and validates that run limit', (modifier,hours)=>{
  let s=createGame(42,[modifier]);expect(s.hours).toBe(hours);
  expect(importSave(exportSave(s))).toEqual(s);
  expect(()=>validateState({...s,hours:hours+.5})).toThrow('工时');
  for(let i=0;i<hours*2;i++)s=act(s,{type:'sort'});
  expect(s.hours).toBe(0);const failure=applyAction(s,{type:'sort'});expect(failure.ok).toBe(false);expect(failure.state).toEqual(s);
  s=act(act(s,{type:'closeDay'}),{type:'openDay'});expect(s.hours).toBe(hours);expect(dailyHours(s)).toBe(hours);
  expect(importSave(exportSave(s))).toEqual(s);
 });
 it.each([['small-wholesale',2,.9],['small-wholesale',1,1],['no-wholesale',4,1]] as const)('settles %s for %i goods with consistent costs and receipt',(modifier,count,factor)=>{
  let s=act(createGame(42,[modifier]),{type:'callVisitor'});s=act(s,{type:'reject',visitorId:s.visitors[0]!.id});s=act(s,{type:'nextVisitor'});
  const v=s.visitors[1]!,ids=v.goods!.slice(0,count).map(i=>i.id),before=s.cash;
  const expected=Math.round(v.goods!.slice(0,count).reduce((n,i)=>n+tradeQuote(s,v,i),0)*factor);
  s=act(s,{type:'tradeBatch',visitorId:v.id,itemIds:ids});
  expect(before-s.cash).toBe(expected);expect(s.visitors[1]!.lastTrade!.amount).toBe(expected);
  expect(s.items.filter(i=>ids.includes(i.id)).reduce((n,i)=>n+i.cost,0)).toBe(expected);expect(importSave(exportSave(s))).toEqual(s);
 });
 it.each(['small-wholesale','no-wholesale'])('uses %s for counteroffer totals and acceptance',modifier=>{
  let s=act(createGame(42,[modifier]),{type:'callVisitor'});s=act(s,{type:'reject',visitorId:s.visitors[0]!.id});s=act(s,{type:'nextVisitor'});
  const v=s.visitors[1]!,ids=v.goods!.slice(0,modifier==='small-wholesale'?2:3).map(i=>i.id),cash=s.cash,factor=modifier==='small-wholesale'?.9:1;
  s=act(s,{type:'tradeBatch',visitorId:v.id,itemIds:ids,amount:1});
  const next=s.visitors[1]!,reply=next.negotiation!;
  expect(reply.quote).toBe(Math.round(ids.reduce((n,id)=>n+next.priceTags![id]!.ask,0)*factor));expect(s.cash).toBe(cash);
  s=act(s,{type:'tradeBatch',visitorId:v.id,itemIds:ids,amount:reply.quote});expect(s.cash).toBe(cash-reply.quote);
 });
 it('applies freshness only when food is created and keeps preservation useful',()=>{
  const base=createGame(42),fresh=createGame(42,['fresh-supply']);let short=createGame(42,['short-dated']);
  const food=base.items.find(i=>i.expiresDay!==null)!;
  expect(fresh.items.find(i=>i.id===food.id)!.expiresDay).toBe(food.expiresDay!+2);
  expect(short.items.find(i=>i.id===food.id)!.expiresDay).toBe(2);
  short=act(short,{type:'preserve',itemId:food.id});expect(short.items.find(i=>i.id===food.id)!.expiresDay).toBe(4);
  short=act(act(short,{type:'closeDay'}),{type:'openDay'});expect(short.items.find(i=>i.id===food.id)!.expiresDay).toBe(4);
  let newFood=short.visitors.flatMap(v=>v.goods??[]).find(i=>i.expiresDay!==null);
  while(!newFood&&short.day<7){short=act(act(short,{type:'closeDay'}),{type:'openDay'});newFood=short.visitors.flatMap(v=>v.goods??[]).find(i=>i.expiresDay!==null);}
  expect(newFood).toBeDefined();expect(newFood!.expiresDay).toBe(short.day+1);expect(importSave(exportSave(short))).toEqual(short);
  expect(fresh.items.filter(i=>i.expiresDay===null).map(i=>i.id)).toEqual(base.items.filter(i=>i.expiresDay===null).map(i=>i.id));
 });
 it('rejects all conflicting condition pairs and malformed imported conditions',()=>{
  for(const ids of [['long-shift','short-shift'],['small-wholesale','no-wholesale'],['fresh-supply','short-dated']])expect(()=>createGame(42,ids)).toThrow();
  for(const value of [null,'long-shift',{},[1]])expect(()=>validateState({...createGame(42),modifiers:value})).toThrow('词条');
 });
});
