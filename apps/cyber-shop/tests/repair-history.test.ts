import { describe, expect, it } from 'vitest';
import { applyAction, createGame, visibleState } from '../src/game/engine';
import { visitorGreeting } from '../src/game/narrative';
import { exportSave, importSave, validateState } from '../src/persistence/storage';
import { ITEMS } from '../src/content';
import { act, repairActive } from './helpers';

describe('repair records and returning visitors',()=>{
 it('records actual attempts across days and archives only a verified delivery',()=>{
  let s=act(createGame(42),{type:'acceptRepair'});const order=s.orders[0]!,condition=s.items.find(i=>i.id===order.itemId)!.condition;
  expect(visibleState(s).orders[0]?.conditionBefore).toBeUndefined();
  expect(s.repairHistory).toEqual([]);expect(applyAction(s,{type:'deliver',orderId:order.id}).ok).toBe(false);
  s=act(s,{type:'diagnose',orderId:order.id});
  s=act(s,{type:'repair',orderId:order.id,operation:'replace',module:'power'});
  expect(s.orders[0]?.steps).toMatchObject([{day:1,result:'miss',hours:1}]);
  expect(s.orders[0]?.completedOps).toBe(0);expect(s.repairHistory).toEqual([]);
  s=act(act(s,{type:'closeDay'}),{type:'openDay'});const before=structuredClone(s),cash=s.cash;
  s=repairActive(s);const receipt=s.repairHistory![0]!;
  expect(receipt).toMatchObject({orderId:order.id,receivedDay:1,day:2,conditionBefore:condition,completedOps:1,reward:s.cash-cash});
  expect(receipt.conditionAfter).toBeGreaterThan(condition);expect(receipt.steps.map(x=>[x.day,x.result])).toEqual([[1,'miss'],[2,'fixed']]);
  expect(before.repairHistory).toEqual([]);expect(before.orders[0]?.steps).toHaveLength(1);
  expect(importSave(exportSave(s))).toEqual(s);expect(applyAction(s,{type:'deliver',orderId:order.id}).state).toEqual(s);
 });
 it('accepts earlier saves and never invents a missing initial condition or work history',()=>{
  let s=act(createGame(52),{type:'acceptRepair'});s=act(s,{type:'diagnose',orderId:s.orders[0]!.id});
  delete s.repairHistory;delete s.orders[0]!.receivedDay;delete s.orders[0]!.conditionBefore;delete s.orders[0]!.steps;
  s=importSave(exportSave(s));expect(s.repairHistory).toBeUndefined();s=repairActive(s);
  expect(s.repairHistory).toHaveLength(1);expect(s.repairHistory![0]!.receivedDay).toBeUndefined();expect(s.repairHistory![0]!.conditionBefore).toBeUndefined();expect(s.repairHistory![0]!.steps).toHaveLength(1);validateState(s);
 });
 it('does not claim a previous repair just because a customer was declined',()=>{
  let s=act(createGame(42),{type:'callVisitor'});const v=s.visitors[0]!;
  s=act(s,{type:'reject',visitorId:v.id});expect(s.met).toContain(v.characterId);
  expect(visitorGreeting(s,v)).not.toMatch(/上回|修好|取回|复检/);
  s=act(s,{type:'acceptRepair'});const pending=s.orders[0]!,visitor={...v,characterId:pending.characterId};
  expect(visitorGreeting(s,visitor)).toContain('工作台');s=repairActive(s);
  const receipt=s.repairHistory![0]!,name=ITEMS.find(i=>i.id===receipt.definitionId)!.name;
  expect(visitorGreeting(s,visitor)).toContain(name);expect(visitorGreeting(s,visitor)).toContain('已经取回');
 });
 it('keeps the latest 80 documents without resetting cumulative repair progress',()=>{
  let s=createGame(12);const ids:string[]=[];
  for(let n=0;n<85;n++){
   if(s.hours<3)s=act(act(s,{type:'closeDay'}),{type:'openDay'});
   s=act(s,{type:'acceptRepair'});ids.push(s.orders.find(o=>!o.delivered)!.id);s=repairActive(s);
  }
  expect(s.records.repairs).toBe(85);expect(s.repairHistory).toHaveLength(80);expect(s.repairHistory![0]!.orderId).toBe(ids[5]);expect(s.repairHistory!.at(-1)!.orderId).toBe(ids.at(-1));validateState(importSave(exportSave(s)));
 });
 it('rejects malformed new history without rejecting old saves that lack it',()=>{
  const s=repairActive(act(createGame(84),{type:'acceptRepair'}));
  for(const corrupt of [
   (copy:typeof s)=>{copy.repairHistory![0]!.reward=-1;},
   (copy:typeof s)=>{copy.repairHistory![0]!.definitionId='missing-device';},
   (copy:typeof s)=>{copy.repairHistory!.push(copy.repairHistory![0]!);},
   (copy:typeof s)=>{copy.repairHistory![0]!.steps[0]!.hours=NaN;},
   (copy:typeof s)=>{copy.repairHistory![0]!.day=copy.day+1;},
  ]){const copy=structuredClone(s);corrupt(copy);expect(()=>validateState(copy)).toThrow();}
 });
});
