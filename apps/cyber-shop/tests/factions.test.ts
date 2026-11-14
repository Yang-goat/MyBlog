import {describe,it,expect} from 'vitest';
import {act,createReadyGame,starterItem} from './helpers';
import {applyAction,buyerCeiling,tradeQuote,operatingFees,equipmentPrice,licensePrice} from '../src/game/engine';
import {FACTIONS} from '../src/content/factions';
import {CHARACTERS,EQUIPMENT,EVENTS} from '../src/content';
import {storageStyle} from '../src/content/storage';
import {DELIVERIES} from '../src/content/deliveries';
import {buyerPreference,factionFor} from '../src/game/factions';
import {exportSave,importSave,validateState} from '../src/persistence/storage';
import {newDeliveryDay} from '../src/game/deliveries';

describe('district trading networks',()=>{
 it('keeps seven distinct contacts, and introduces the four new groups through ordinary opening days',()=>{
  expect(FACTIONS).toHaveLength(7);expect(new Set(FACTIONS.map(f=>f.contact)).size).toBe(7);
  let s=createReadyGame(63);s.cash=10000;
  expect(s.visitors.every(v=>(CHARACTERS.find(c=>c.id===v.characterId)?.firstDay??1)===1)).toBe(true);
  for(const group of ['uppercity','contractors','watch','freewave']){
   s=act(act(s,{type:'closeDay'}),{type:'openDay'});
   const [seller,buyer]=[s.visitors[4]!,s.visitors[5]!];
   expect(factionFor(seller.characterId).id).toBe(group);expect(factionFor(buyer.characterId).id).toBe(group);
   expect(seller.category).toBe(buyer.category);expect(s.visitors).toHaveLength(7);
   if(group==='uppercity')expect(seller.goods!.every(i=>i.condition>=85&&!i.faults.length)).toBe(true);
   if(group==='watch')expect(seller.goods!.every(i=>i.authentic&&i.provenance.includes('可追溯'))).toBe(true);
  }
 });
 it('credits the first transaction only, including a saved encounter and container purchases',()=>{
  let s=createReadyGame(3);s=act(s,{type:'reject',visitorId:s.visitors[0]!.id});s=act(s,{type:'nextVisitor'});s.cash=10000;
  const v=s.visitors[1]!,group=factionFor(v.characterId).id,ids=v.goods!.slice(0,2).map(i=>i.id),relation=s.relations[group]??0;
  s=act(s,{type:'tradeBatch',visitorId:v.id,itemIds:[ids[0]!]});expect(s.relations[group]).toBe(relation+1);
  s=importSave(exportSave(s));s=act(s,{type:'tradeBatch',visitorId:v.id,itemIds:[ids[1]!]});expect(s.relations[group]).toBe(relation+1);
  const offer=s.visitors[1]!.storageGoods![0]!;s=act(s,{type:'buyStorage',visitorId:v.id,offerId:offer.id});expect(s.relations[group]).toBe(relation+1);
  delete s.visitors[1]!.relationCredited;const last=s.visitors[1]!.goods![0]!;
  s=act(s,{type:'tradeBatch',visitorId:v.id,itemIds:[last.id]});expect(s.relations[group]).toBe(relation+1);
 });
 it('rejects low-trust appointments, saves and consumes a confirmed appointment without replacing category sourcing',()=>{
  let s=createReadyGame(4);s.cash=10000;s.relations.uppercity=5;
  expect(applyAction(s,{type:'appointFaction',factionId:'uppercity'}).ok).toBe(false);
  s.relations.uppercity=6;s.skills=['supply-1','supply-2','supply-3'];
  s=act(s,{type:'appointFaction',factionId:'uppercity'});s=importSave(exportSave(s));
  s=act(s,{type:'appointFaction',factionId:null});expect(s.factionAppointment).toBeUndefined();
  s=act(s,{type:'appointFaction',factionId:'uppercity'});
  s=act(s,{type:'closeDay'});s=act(s,{type:'appoint',category:'food'});s=act(s,{type:'openDay'});
  expect(s.visitors[1]!.category).toBe('food');expect(s.visitors[4]!.characterId).toBe('ji-yan');expect(s.visitors[5]!.characterId).toBe('ji-yan');expect(s.factionAppointment).toBeUndefined();
 });
 it('prices actual buyer offers and ceilings consistently with condition, function and source preferences',()=>{
  const s=createReadyGame(5),item=starterItem(s,'data'),buyer=s.visitors[2]!;buyer.category='data';item.condition=85;item.faults=[];
  buyer.characterId='ji-yan';expect(buyerPreference(s,buyer,item)).toBeCloseTo(1.1*1.15);
  const ordinary=tradeQuote(s,buyer,item);s.relations.uppercity=16;expect(tradeQuote(s,buyer,item)).toBeGreaterThan(ordinary);
  expect(tradeQuote(s,buyer,item)).toBeLessThanOrEqual(buyerCeiling(s,buyer,item));
  item.condition=84;expect(buyerPreference(s,buyer,item)).toBe(1.1);
  buyer.characterId='han-qiao';expect(buyerPreference(s,buyer,item)).toBeCloseTo(1.04*1.08);item.faults=['bad-contact'];expect(buyerPreference(s,buyer,item)).toBe(1.04);
  buyer.characterId='xu-zheng';item.known=[];item.authentic=true;item.provenance='可追溯的街区旧物';expect(buyerPreference(s,buyer,item)).toBe(1);item.known=['serial'];expect(buyerPreference(s,buyer,item)).toBe(1.1);
  buyer.characterId='yan-que';expect(buyerPreference(s,buyer,item)).toBe(1.08);
 });
 it('applies neighborhood, union and police trust to real payments without changing warehouse size',()=>{
  let s=createReadyGame(9);s.cash=10000;const fees=operatingFees(s),material=EQUIPMENT.find(e=>e.type==='material')!,cost=equipmentPrice(s,material);
  s.relations.neighborhood=16;s.relations.union=16;expect(operatingFees(s)).toBe(fees-10);expect(equipmentPrice(s,material)).toBe(Math.round(cost*.9));
  const cash=s.cash;s=act(s,{type:'buyEquipment',equipmentId:material.id,count:1});expect(cash-s.cash).toBe(Math.round(cost*.9));
  s.chapter=3;const fee=licensePrice(s);s.relations.watch=16;expect(licensePrice(s)).toBe(Math.round(fee*.75));const before=s.cash;s=act(s,{type:'license'});expect(before-s.cash).toBe(Math.round(fee*.75));
  const close=s.cash;s=act(s,{type:'closeDay'});expect(close-s.cash).toBe(fees-10);
 });
 it('discounts grayline container offers on their next visit and pays the displayed amount',()=>{
  let s=createReadyGame(11);s.cash=10000;s.relations.grayline=16;s=act(s,{type:'appointFaction',factionId:'grayline'});s=act(act(s,{type:'closeDay'}),{type:'openDay'});s.visitorIndex=4;s=act(s,{type:'callVisitor'});
  const v=s.visitors[4]!,offer=v.storageGoods![0]!,cash=s.cash;
  expect(offer.price).toBe(Math.round(storageStyle(offer.styleId).price*.85));
  expect(offer.price).toBeGreaterThan(0);s=act(s,{type:'buyStorage',visitorId:v.id,offerId:offer.id});expect(cash-s.cash).toBe(offer.price);expect(s.containers!.at(-1)!.cost).toBe(offer.price);
 });
 it('makes trusted radio data source checks free only when the tool is owned',()=>{
  let s=createReadyGame(12);s.relations.freewave=16;const item=starterItem(s,'data');item.known=[];
  expect(applyAction(s,{type:'inspect',itemId:item.id,method:'serial'}).ok).toBe(false);
  s.equipment[EQUIPMENT.find(e=>e.effect==='serial')!.id]=1;const hours=s.hours;s=act(s,{type:'inspect',itemId:item.id,method:'serial'});expect(s.hours).toBe(hours);
  const antique=starterItem(s,'antique');antique.known=[];s=act(s,{type:'inspect',itemId:antique.id,method:'serial'});expect(s.hours).toBeLessThan(hours);
 });
 it('pays trusted mercenary repair contracts more at acceptance, once the reward is fixed',()=>{
  let s=createReadyGame(13);s.visitors[0]!.characterId='han-qiao';const regular=act(s,{type:'acceptRepair',visitorId:s.visitors[0]!.id});s.relations.contractors=16;const trusted=act(s,{type:'acceptRepair',visitorId:s.visitors[0]!.id});
  expect(trusted.orders[0]!.reward).toBe(Math.round(regular.orders[0]!.reward*1.15));
 });
 it('records competing relationship effects exactly once and retains negative relations in saves',()=>{
  let s=createReadyGame(15);s.eventId='archive-copy';const c=EVENTS.find(e=>e.id===s.eventId)!.choices[0]!;const before=s.cash;
  s=act(s,{type:'eventChoice',index:0});expect(s.cash-before).toBe(c.cash);expect(s.relations.freewave).toBe(3);expect(s.relations.uppercity).toBe(-2);
  expect(applyAction(s,{type:'eventChoice',index:1}).ok).toBe(false);expect(importSave(exportSave(s)).relations).toEqual(s.relations);
 });
 it('rotates all four new delivery contacts into the board and validates new save fields',()=>{
  const s=createReadyGame(17);s.chapter=2;const offered=new Set<string>();for(let day=1;day<=32;day++){s.day=day;for(const j of newDeliveryDay(s))offered.add(j.templateId);}
  for(const id of ['ji-yan','han-qiao','xu-zheng','yan-que'])expect(DELIVERIES.filter(d=>d.characterId===id).every(d=>offered.has(d.id))).toBe(true);
  const invalid=structuredClone(s) as any;invalid.factionAppointment='unknown';expect(()=>validateState(invalid)).toThrow('联络预约');delete invalid.factionAppointment;invalid.visitors[0].relationCredited=1;expect(()=>validateState(invalid)).toThrow('往来记录');
 });
});
