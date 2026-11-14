import {describe,it,expect} from 'vitest';
import {createGame,applyAction,visibleState} from '../src/game/engine';
import {deliveryJobs,deliveryDefinition,deliveryItemCheck,newDeliveryDay} from '../src/game/deliveries';
import {DELIVERIES} from '../src/content/deliveries';
import {ITEMS,CHARACTERS,EQUIPMENT} from '../src/content';
import {exportSave,importSave,validateState} from '../src/persistence/storage';
import {dayReport} from '../src/game/journey';
import {act} from './helpers';
import type {GameState,ItemInstance} from '../src/game/types';

const water=(s:GameState)=>s.items.find(i=>i.definitionId==='purified-water')!;
const first=(s:GameState)=>deliveryJobs(s).find(j=>j.templateId==='doorstep-water')!;
function rejectUnchanged(s:GameState,action:Parameters<typeof applyAction>[1]){
 const before=structuredClone(s),result=applyAction(s,action);expect(result.ok).toBe(false);expect(result.state).toEqual(before);expect(s).toEqual(before);return result.events[0]!.text;
}
describe('optional neighbourhood delivery orders',()=>{
 it('publishes three different categories without changing RNG or rerolling legacy saves',()=>{
  const s=createGame(42),before=structuredClone(s),rng=s.rng;
  const board=deliveryJobs(s);expect(new Set(board.map(j=>deliveryDefinition(j).category)).size).toBe(3);
  expect(newDeliveryDay(s)).toEqual(board);expect(s).toEqual(before);
  const legacy=structuredClone(s);delete legacy.deliveries;const loaded=importSave(exportSave(legacy));
  expect(visibleState(loaded).deliveries).toEqual(board);
  const accepted=act(loaded,{type:'acceptDelivery',jobId:board[0]!.id});expect(accepted.rng).toBe(rng);expect(accepted.hours).toBe(s.hours);expect(accepted.cash).toBe(s.cash);
  expect(accepted.deliveries?.[0]?.status).toBe('active');expect(importSave(exportSave(accepted))).toEqual(accepted);
 });
 it('caps active requests, records cancellation and cannot reopen the same notice',()=>{
  let s=createGame(42);const jobs=deliveryJobs(s);
  s=act(s,{type:'acceptDelivery',jobId:jobs[0]!.id});s=act(s,{type:'acceptDelivery',jobId:jobs[1]!.id});
  expect(rejectUnchanged(s,{type:'acceptDelivery',jobId:jobs[2]!.id})).toContain('两份');
  s=act(s,{type:'cancelDelivery',jobId:jobs[0]!.id});expect(s.cash).toBe(1200);
  rejectUnchanged(s,{type:'acceptDelivery',jobId:jobs[0]!.id});s=act(s,{type:'acceptDelivery',jobId:jobs[2]!.id});
  validateState(s);
 });
 it('hands over real stock once, pays the signed price and preserves an auditable receipt',()=>{
  let s=createGame(42);const job=first(s),item=water(s),cash=s.cash,hours=s.hours;
  s=act(s,{type:'acceptDelivery',jobId:job.id});s=act(s,{type:'deliverGoods',jobId:job.id,itemIds:[item.id]});
  expect(s.items.some(i=>i.id===item.id)).toBe(false);expect(s.cash).toBe(cash+100);expect(s.hours).toBe(hours-.5);
  expect(s.records).toMatchObject({deliveries:1,deliveryIncome:100,trades:1,revenue:100});
  expect(s.deliveries!.find(j=>j.id===job.id)).toMatchObject({status:'completed',acceptedDay:1,closedDay:1,goods:[{itemId:item.id,definitionId:item.definitionId,cost:item.cost}]});
  expect(s.met).toContain('lin-qiao');expect(s.relations.neighborhood).toBe(1);
  expect(dayReport(s).income).toBe(100);expect(importSave(exportSave(s))).toEqual(s);
  rejectUnchanged(s,{type:'deliverGoods',jobId:job.id,itemIds:[item.id]});
 });
 it('rejects unknown attributes, duplicate goods and unowned or unavailable items atomically',()=>{
  let s=createGame(42);const job=first(s);s=act(s,{type:'acceptDelivery',jobId:job.id});const item=water(s);
  rejectUnchanged(s,{type:'deliverGoods',jobId:job.id,itemIds:[item.id,item.id]});
  rejectUnchanged(s,{type:'deliverGoods',jobId:job.id,itemIds:['missing']});
  for(const patch of [{known:[]},{owner:'customer',location:'workshop'},{location:'display'},{location:'counter'},{location:'workshop'}]){
   const sample=structuredClone(s);Object.assign(water(sample),patch);
   rejectUnchanged(sample,{type:'deliverGoods',jobId:job.id,itemIds:[item.id]});
  }
  s.hours=0;expect(rejectUnchanged(s,{type:'deliverGoods',jobId:job.id,itemIds:[item.id]})).toContain('半个工时');
 });
 it('reveals special failures only after the matching inspection',()=>{
  const s=createGame(42),request=DELIVERIES.find(d=>d.id==='backup-battery')!;
  const battery:ItemInstance={...water(s),definitionId:'battery-pack',condition:70,capacity:25,known:[]};
  expect(deliveryItemCheck(s,request,battery)).toMatchObject({inspect:'basic'});
  battery.known=['basic'];expect(deliveryItemCheck(s,request,battery)).toEqual({ready:false,reason:'先扫描所需读数',inspect:'scan'});
  battery.known.push('scan');expect(deliveryItemCheck(s,request,battery).reason).toContain('25%');
  const data:ItemInstance={...battery,definitionId:'holo-film',integrity:80,provenance:'个人转让，授权待核'};
  const screening=DELIVERIES.find(d=>d.id==='public-screening')!;
  expect(deliveryItemCheck(s,screening,data).inspect).toBe('serial');data.known.push('serial');
  expect(deliveryItemCheck(s,screening,data).reason).toContain('合法授权');
  data.provenance='可追溯的合法授权副本';expect(deliveryItemCheck(s,screening,data).ready).toBe(true);
 });
 it('rechecks freshness on the delivery day and permits actual preservation to resolve it',()=>{
  let s=createGame(42);const job=first(s);water(s).expiresDay=2;s=act(s,{type:'acceptDelivery',jobId:job.id});
  s=act(s,{type:'closeDay'});s=act(s,{type:'openDay'});
  expect(rejectUnchanged(s,{type:'deliverGoods',jobId:job.id,itemIds:[water(s).id]})).toContain('保质期');
  const packId=EQUIPMENT.find(e=>e.effect==='preserveSupply')!.id,packs=s.equipment[packId]??0;
  s=act(s,{type:'preserve',itemId:water(s).id});expect(water(s).expiresDay).toBeGreaterThan(2);
  expect(s.equipment[packId]??0).toBe(packs-1);
  s=act(s,{type:'deliverGoods',jobId:job.id,itemIds:[water(s).id]});expect(s.records.deliveries).toBe(1);
 });
 it('accepts delivery through the last opening, expires at closing and keeps stock intact',()=>{
  let s=createGame(42);const job=first(s);s=act(s,{type:'acceptDelivery',jobId:job.id});
  for(let n=0;n<2;n++){s=act(s,{type:'closeDay'});rejectUnchanged(s,{type:'deliverGoods',jobId:job.id,itemIds:[water(s).id]});s=act(s,{type:'openDay'});}
  expect(s.day).toBe(job.deadline);const onTime=act(s,{type:'deliverGoods',jobId:job.id,itemIds:[water(s).id]});expect(onTime.records.deliveries).toBe(1);
  const items=structuredClone(s.items);s=act(s,{type:'closeDay'});expect(s.deliveries!.find(j=>j.id===job.id)?.status).toBe('expired');expect(s.items).toEqual(items);
  s=act(s,{type:'openDay'});rejectUnchanged(s,{type:'deliverGoods',jobId:job.id,itemIds:[water(s).id]});expect(importSave(exportSave(s))).toEqual(s);
 });
 it('covers six categories and rejects invalid delivery save references',()=>{
  expect(DELIVERIES.length).toBe(12);expect(new Set(DELIVERIES.map(d=>d.category)).size).toBe(6);
  for(const d of DELIVERIES){expect(CHARACTERS.some(c=>c.id===d.characterId)).toBe(true);expect(d.itemIds.every(id=>ITEMS.some(i=>i.id===id&&i.category===d.category))).toBe(true);expect(d.itemIds.some(id=>ITEMS.some(i=>i.id===id&&i.chapter<=d.chapter))).toBe(true);}
  let s=createGame(42);const job=first(s),item=structuredClone(water(s));s=act(s,{type:'acceptDelivery',jobId:job.id});s=act(s,{type:'deliverGoods',jobId:job.id,itemIds:[item.id]});
  const invalid=structuredClone(s);invalid.items.push(item);expect(()=>validateState(invalid)).toThrow('仍留在库存');
  const duplicate=structuredClone(s);duplicate.deliveries!.push(duplicate.deliveries![0]!);expect(()=>validateState(duplicate)).toThrow('重复');
  const badDate=structuredClone(s);badDate.deliveries![0]!.deadline++;expect(()=>validateState(badDate)).toThrow('交期');
 });
 it('requires the real license, compatibility and provenance for specialist requests',()=>{
  const s=createGame(42),clinic=DELIVERIES.find(d=>d.id==='clinic-cold-chain')!;
  const gel:ItemInstance={...water(s),definitionId:'bio-gel',known:['basic','scan','serial'],condition:85,authentic:true,provenance:'可追溯的街区旧物',expiresDay:5};
  expect(deliveryItemCheck(s,clinic,gel).reason).toContain('交易许可');s.licenses.push('regulated-trade');expect(deliveryItemCheck(s,clinic,gel).ready).toBe(true);
  gel.authentic=false;expect(deliveryItemCheck(s,clinic,gel).ready).toBe(false);
  const neural=DELIVERIES.find(d=>d.id==='training-touch')!,module:ItemInstance={...gel,definitionId:'haptic-module',compatibility:'旧式专用接口',faults:[]};
  expect(deliveryItemCheck(s,neural,module).reason).toContain('开放标准');module.compatibility='开放标准';expect(deliveryItemCheck(s,neural,module).ready).toBe(true);
  module.faults=['neural-noise'];expect(deliveryItemCheck(s,neural,module).reason).toContain('功能异常');
  const relic=DELIVERIES.find(d=>d.id==='old-city-token')!,watch:ItemInstance={...gel,definitionId:'mechanical-watch',authentic:true,originality:68,faults:['old-grease']};
  expect(deliveryItemCheck(s,relic,watch).reason).toContain('原貌');watch.originality=75;expect(deliveryItemCheck(s,relic,watch).ready).toBe(true);
 });
});
