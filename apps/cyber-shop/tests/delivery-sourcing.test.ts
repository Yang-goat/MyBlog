import {describe,it,expect} from 'vitest';
import {createGame,applyAction,itemValue} from '../src/game/engine';
import {deliverySourcePlan,deliveryDefinition,deliveryQualityCheck,deliveryReadyCount} from '../src/game/deliveries';
import {DELIVERIES} from '../src/content/deliveries';
import {factionFor} from '../src/game/factions';
import {CHARACTERS} from '../src/content';
import {BALANCE} from '../src/game/balance';
import {exportSave,importSave,validateState} from '../src/persistence/storage';
import {act} from './helpers';
import type {GameState} from '../src/game/types';

const water=(s:GameState)=>s.items.find(i=>i.definitionId==='purified-water')!;
const job=(s:GameState,id='backup-battery')=>s.deliveries!.find(j=>j.templateId===id)!;
function accepted(){let s=createGame(20261105);return act(s,{type:'acceptDelivery',jobId:job(s).id});}
const nextDay=(s:GameState)=>act(act(s,{type:'closeDay'}),{type:'openDay'});
function reject(s:GameState,action:Parameters<typeof applyAction>[1]){const before=structuredClone(s),r=applyAction(s,action);expect(r.ok).toBe(false);expect(r.state).toEqual(before);expect(s).toEqual(before);}

describe('optional next-day sourcing for accepted requests',()=>{
 it('plans only missing eligible stock without mutation and respects reserved stock',()=>{
  let s=accepted(),j=job(s),before=structuredClone(s);expect(deliverySourcePlan(s,j)).toEqual({ok:true,reason:'',count:2});expect(s).toEqual(before);
  const good=water(s);Object.assign(good,{definitionId:'battery-pack',condition:80,capacity:80,known:['basic','scan']});
  expect(deliverySourcePlan(s,j).count).toBe(1);good.reserved=true;expect(deliverySourcePlan(s,j).count).toBe(2);
  good.reserved=false;good.location='counter';expect(deliverySourcePlan(s,j).count).toBe(2);
 });
 it('books, replaces, cancels and reloads without spending cash, time or random draws',()=>{
  let s=accepted(),before=structuredClone(s);s=act(s,{type:'sourceDelivery',jobId:job(s).id});
  expect(s.deliverySource).toEqual({jobId:job(s).id,count:2});expect([s.cash,s.hours,s.rng]).toEqual([before.cash,before.hours,before.rng]);
  expect(importSave(exportSave(s))).toEqual(s);s=act(s,{type:'acceptDelivery',jobId:job(s,'doorstep-water').id});
  s=act(s,{type:'reserveItem',itemId:water(s).id,reserved:true});s=act(s,{type:'sourceDelivery',jobId:job(s,'doorstep-water').id});
  expect(s.deliverySource).toEqual({jobId:job(s,'doorstep-water').id,count:1});s=act(s,{type:'sourceDelivery',jobId:null});expect(s.deliverySource).toBeUndefined();
  expect([s.cash,s.hours,s.rng]).toEqual([before.cash,before.hours,before.rng]);
 });
 it('delivers the checked missing count next morning, preserves other appointments and never purchases automatically',()=>{
  let s=accepted();Object.assign(water(s),{definitionId:'battery-pack',condition:80,capacity:80,known:['basic','scan']});
  s.appointments='data';s=act(s,{type:'sourceDelivery',jobId:job(s).id});const ids=s.items.map(i=>i.id);s=nextDay(s);
  expect(s.deliverySource).toBeUndefined();expect(s.appointments).toBe('data');expect(s.items.map(i=>i.id)).toEqual(ids);
  const v=s.visitors[1]!;expect(v.category).toBe('energy');expect(v.goods).toHaveLength(4);expect(v.request).toContain('找到 1 件');
  expect(deliveryQualityCheck(s,deliveryDefinition(job(s)),v.goods![0]!).ready).toBe(true);expect(v.goods![1]!.known).toEqual([]);
  expect(deliveryReadyCount(s,job(s))).toBe(1);validateState(s);s=nextDay(s);expect(s.visitors[1]!.request).not.toContain('按「');
 });
 it('sources all 16 request templates with their actual quality, provenance and freshness conditions',()=>{
  for(const d of DELIVERIES){let s=createGame(42);s.chapter=3;s.licenses=['regulated-trade'];s.items=[];
   const j={id:`delivery-1-${d.id}`,templateId:d.id,postedDay:1,acceptedDay:1,deadline:d.days,status:'active' as const};s.deliveries=[j];
   s=act(s,{type:'sourceDelivery',jobId:j.id});s=nextDay(s);const v=s.visitors[1]!;
   expect(v.category).toBe(d.category);for(const i of v.goods!.slice(0,d.quantity)){expect(deliveryQualityCheck(s,d,i),d.id).toEqual({ready:true,reason:'符合交货要求'});expect(i.known).toEqual(['basic','scan','serial']);}
   validateState(s);
  }
 });
 it('charges the sourcing premium only on checked arrivals and books the paid amount as item cost',()=>{
  let s=nextDay(act(accepted(),{type:'sourceDelivery',jobId:job(accepted()).id}));const v=s.visitors[1]!,aff=factionFor(v.characterId),person=CHARACTERS.find(c=>c.id===v.characterId)!;
  const relation=Math.max(0,s.relations[person.group]??0);
  for(const [n,i] of v.goods!.entries()){const factor=n<2?1.25:1;expect(v.priceTags![i.id]).toEqual({ask:Math.max(1,Math.round(itemValue(s,i)*BALANCE.sellerFactor*aff.seller*(1-relation/150)*factor)),minimum:Math.max(1,Math.round(itemValue(s,i)*BALANCE.sellerFloor*aff.seller*factor))});}
  const i=v.goods![0]!,price=v.priceTags![i.id]!.ask;expect(v.quote).toBe(price);expect(v.limit).toBe(v.priceTags![i.id]!.minimum);
  s.visitorIndex=1;s.visitorArrived=true;const cash=s.cash;s=act(s,{type:'tradeBatch',visitorId:v.id,itemIds:[i.id]});
  expect(s.cash).toBe(cash-price);expect(s.items.find(g=>g.id===i.id)?.cost).toBe(price);expect(importSave(exportSave(s))).toEqual(s);
 });
 it('rejects late, unaccepted, already-filled and unlicensed requests atomically',()=>{
  let s=accepted();reject(s,{type:'sourceDelivery',jobId:job(s,'doorstep-water').id});s=act(s,{type:'acceptDelivery',jobId:job(s,'doorstep-water').id});reject(s,{type:'sourceDelivery',jobId:job(s,'doorstep-water').id});
  job(s).deadline=s.day;reject(s,{type:'sourceDelivery',jobId:job(s).id});reject(s,{type:'sourceDelivery',jobId:'missing'});
  const d=DELIVERIES.find(d=>d.id==='clinic-cold-chain')!;s.deliveries=[{id:'delivery-1-clinic-cold-chain',templateId:d.id,postedDay:1,acceptedDay:1,deadline:4,status:'active'}];reject(s,{type:'sourceDelivery',jobId:s.deliveries[0]!.id});
 });
 it('clears pending sourcing when the request is cancelled or fulfilled',()=>{
  let s=accepted();s=act(s,{type:'sourceDelivery',jobId:job(s).id});s=act(s,{type:'cancelDelivery',jobId:job(s).id});expect(s.deliverySource).toBeUndefined();
  s=createGame(42);s=act(s,{type:'acceptDelivery',jobId:job(s,'doorstep-water').id});s=act(s,{type:'reserveItem',itemId:water(s).id,reserved:true});s=act(s,{type:'sourceDelivery',jobId:job(s,'doorstep-water').id});s=act(s,{type:'reserveItem',itemId:water(s).id,reserved:false});
  s=act(s,{type:'deliverGoods',jobId:job(s,'doorstep-water').id,itemIds:[water(s).id]});expect(s.deliverySource).toBeUndefined();
 });
 it('loads older saves and refuses invalid appointment references and counts',()=>{
  const s=accepted();expect(importSave(exportSave(s))).toEqual(s);
  for(const plan of [null,{}, {jobId:'missing',count:1},{jobId:job(s).id,count:0},{jobId:job(s).id,count:3},{jobId:job(s).id,count:1.5},{jobId:job(s,'doorstep-water').id,count:1}]){const bad={...s,deliverySource:plan};expect(()=>validateState(bad)).toThrow();}
  s.deliverySource={jobId:job(s).id,count:1};job(s).deadline=s.day;expect(()=>validateState(s)).toThrow();
 });
});
