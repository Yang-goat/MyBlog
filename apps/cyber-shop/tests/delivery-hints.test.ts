import {describe,it,expect} from 'vitest';
import {createGame,applyAction} from '../src/game/engine';
import {activeDeliveries,deliveryDefinition,deliveryItemCheck,deliveryQualityCheck,deliveryReadyCount,itemDeliveryHints} from '../src/game/deliveries';
import {DELIVERIES} from '../src/content/deliveries';
import {act} from './helpers';
import type {GameState,ItemInstance} from '../src/game/types';
const request=(id:string)=>DELIVERIES.find(d=>d.id===id)!;
const water=(s:GameState)=>s.items.find(i=>i.definitionId==='purified-water')!;
function accept(s:GameState,id:string){return act(s,{type:'acceptDelivery',jobId:s.deliveries!.find(j=>j.templateId===id)!.id});}
function supplier(){let s=createGame(42);s=accept(s,'backup-battery');s.visitorArrived=true;s.visitorIndex=1;const i=s.visitors[1]!.goods![0]!;Object.assign(i,{definitionId:'battery-pack',faults:[],known:[],condition:80,capacity:85});return s;}

describe('accepted delivery clues and due-today decisions',()=>{
 it('only exposes active accepted requests, removing cancelled and completed ones',()=>{
  let s=createGame(42),item=water(s);expect(itemDeliveryHints(s,item)).toEqual([]);s=accept(s,'doorstep-water');item=water(s);
  expect(itemDeliveryHints(s,item)[0]).toMatchObject({incoming:false,readyCount:1,check:{ready:true},job:{templateId:'doorstep-water'}});
  const job=activeDeliveries(s)[0]!;const cancelled=act(s,{type:'cancelDelivery',jobId:job.id});expect(itemDeliveryHints(cancelled,item)).toEqual([]);
  const done=act(s,{type:'deliverGoods',jobId:job.id,itemIds:[item.id]});expect(activeDeliveries(done)).toEqual([]);expect(itemDeliveryHints(done,item)).toEqual([]);
 });
 it('previews current incoming quality without counting it as owned or advancing state',()=>{
  let s=supplier(),item=s.visitors[1]!.goods![0]!,before=structuredClone(s);
  expect(itemDeliveryHints(s,item)[0]).toMatchObject({incoming:true,readyCount:0,check:{ready:false,inspect:'basic'}});expect(s).toEqual(before);
  item.known=['basic'];expect(itemDeliveryHints(s,item)[0]!.check.inspect).toBe('scan');item.known.push('scan');expect(itemDeliveryHints(s,item)[0]!.check.ready).toBe(true);
  expect(deliveryReadyCount(s,activeDeliveries(s)[0]!)).toBe(0);
  s.visitors[1]!.resolved=true;expect(itemDeliveryHints(s,item)).toEqual([]);s.visitors[1]!.resolved=false;s.visitorArrived=false;expect(itemDeliveryHints(s,item)).toEqual([]);
 });
 it('does not reveal uninspected quality, authorization or dates through request hints',()=>{
  const s=createGame(42),battery:ItemInstance={...water(s),definitionId:'battery-pack',condition:80,capacity:0,known:[],expiresDay:null};
  const d=request('backup-battery');expect(deliveryQualityCheck(s,d,battery)).toMatchObject({inspect:'basic'});battery.known=['basic'];expect(deliveryQualityCheck(s,d,battery)).toMatchObject({inspect:'scan'});battery.known.push('scan');expect(deliveryQualityCheck(s,d,battery).reason).toContain('0%');
  const data={...battery,definitionId:'data-chip',integrity:90,provenance:'未授权',known:['basic','scan'],faults:[]};expect(deliveryQualityCheck(s,request('public-screening'),data).inspect).toBe('serial');data.known.push('serial');expect(deliveryQualityCheck(s,request('public-screening'),data).reason).toContain('授权');
  const food:ItemInstance={...water(s),known:[],expiresDay:0};expect(deliveryQualityCheck(s,request('doorstep-water'),food).inspect).toBe('basic');food.known=['basic'];expect(deliveryQualityCheck(s,request('doorstep-water'),food).reason).toContain('保质期');
 });
 it('reports physical acceptance separately from quality and never counts reserved, displayed or on-counter goods as ready',()=>{
  let s=accept(createGame(42),'doorstep-water');const id=water(s).id,job=activeDeliveries(s)[0]!;
  for(const patch of [{reserved:true},{location:'counter'},{location:'display'}]){const state=structuredClone(s);Object.assign(water(state),patch);expect(deliveryQualityCheck(state,deliveryDefinition(job),water(state)).ready).toBe(true);expect(deliveryReadyCount(state,job)).toBe(0);expect(itemDeliveryHints(state,water(state))[0]!.check.ready).toBe(false);}
  s=act(s,{type:'reserveItem',itemId:id,reserved:true});expect(itemDeliveryHints(s,water(s))[0]!.check.reason).toContain('留货');s=act(s,{type:'reserveItem',itemId:id,reserved:false});expect(itemDeliveryHints(s,water(s))[0]!.readyCount).toBe(1);
 });
 it('keeps an accepted request visible through the final opening and expires it at closing',()=>{
  let s=accept(createGame(42),'doorstep-water'),job=activeDeliveries(s)[0]!;
  while(s.day<job.deadline){s=act(s,{type:'closeDay'});s=act(s,{type:'openDay'});}
  expect(activeDeliveries(s).filter(j=>j.deadline===s.day)).toHaveLength(1);expect(itemDeliveryHints(s,water(s))[0]!.job.id).toBe(job.id);
  const before=structuredClone(s),r=applyAction(s,{type:'closeDay'});expect(r.ok).toBe(true);expect(s).toEqual(before);expect(activeDeliveries(r.state)).toEqual([]);expect(itemDeliveryHints(r.state,water(r.state))).toEqual([]);expect(r.state.items.some(i=>i.id===water(s).id)).toBe(true);
 });
 it('uses the exact same current quality gates as final acceptance for all request definitions',()=>{
  const s=createGame(42);s.licenses.push('regulated-trade');
  for(const d of DELIVERIES){const item:ItemInstance={...water(s),definitionId:d.itemIds[0]!,condition:95,capacity:95,purity:95,integrity:95,originality:95,authentic:true,provenance:'可追溯的合法授权副本',compatibility:'开放标准',expiresDay:s.day+10,faults:[],known:['basic','scan','serial']};expect(deliveryQualityCheck(s,d,item)).toEqual(deliveryItemCheck(s,d,item));expect(deliveryQualityCheck(s,d,item).ready).toBe(true);item.condition=0;expect(deliveryQualityCheck(s,d,item)).toEqual(deliveryItemCheck(s,d,item));}
 });
});
