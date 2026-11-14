import { describe, it, expect } from 'vitest';
import { createGame, applyAction } from '../src/game/engine';
import { journey, dayReport, financialRecovery } from '../src/game/journey';
import { act, repairActive, normalDay, playToWin } from './helpers';
import { exportSave, importSave } from '../src/persistence/storage';

describe('player-facing journey and receipts',()=>{
 it('reconciles real cash across repair, purchase, close, restore and next day',()=>{
  let s=createGame(42); const opening=s.cash;
  s=act(s,{type:'acceptRepair'});s=repairActive(s);
  expect(dayReport(s).repairIncome).toBeGreaterThan(0);
  s=act(s,{type:'buyEquipment',equipmentId:'cleaner'});
  expect(dayReport(s).openingCash).toBe(opening);
  expect(dayReport(s).pendingFees).toBe(85);
  s=act(s,{type:'closeDay'});
  const report=dayReport(s);expect(report.fees).toBe(85);expect(report.net).toBe(s.cash-opening);expect(report.pendingFees).toBe(0);
  expect(dayReport(importSave(exportSave(s)))).toEqual(report);
  expect(dayReport(applyAction(s,{type:'closeDay'}).state)).toEqual(report);
  s=act(s,{type:'openDay'});expect(dayReport(s).net).toBe(0);expect(dayReport(s).openingCash).toBe(s.cash);
 });
 it('points to the actual chapter gate and finishes the same career as the rules',()=>{
  let s=createGame(42); const chapters=new Set<number>();
  for(let day=0;day<60&&!s.victory;day++){
   const before=JSON.stringify(s); const route=journey(s);expect(JSON.stringify(s)).toBe(before);
   chapters.add(s.chapter);expect(route.tasks.length).toBeGreaterThan(0);
   if(s.chapter===2&&!s.certificates.includes('industrial'))expect(route.next.id).toBe('industrial');
   if(s.chapter===3&&!s.certificates.includes('neural'))expect(route.next.id).toBe('neural');
   s=normalDay(s,'precision');
  }
  expect([...chapters]).toEqual([1,2,3,4]);expect(s.victory).toBe(true);expect(journey(s).tasks.every(t=>t.done)).toBe(true);
  s=act(s,{type:'continueEndless'});expect(journey(s).next.id).toBe('antique');expect(journey(s).tasks.map(t=>t.id)).not.toContain('ownership');
  s=act(s,{type:'openDay'});s=act(s,{type:'challenge',id:'batch-repair'});
  expect(journey(s).next.id).toBe('challenge');expect(journey(s).next.target).toBe(6);
 });
 it('includes carried debt in a pre-close forecast but does not double charge receipts',()=>{
  let s=createGame(21);s.cash=0;s=act(s,{type:'closeDay'});expect(dayReport(s).fees).toBe(0);expect(s.debt).toBe(85);
  s=act(s,{type:'openDay'});expect(dayReport(s).pendingFees).toBe(170);
  s=act(s,{type:'acceptRepair'});s=repairActive(s);s=act(s,{type:'closeDay'});
  expect(dayReport(s).fees).toBe(170);expect(s.debt).toBe(0);
 });
 it('keeps a truthful closing deadline and recovery route until the debt is actually settled',()=>{
  let s=createGame(42);
  for(const equipmentId of ['workbench','cold-storage','stock-rack','stock-rack'])s=act(s,{type:'buyEquipment',equipmentId});
  expect(s.cash).toBe(0);
  for(let day=1;day<=3;day++){
   s=act(s,{type:'closeDay'});
   expect(financialRecovery(s)).toEqual({fees:85,due:(day+1)*85,shortfall:(day+1)*85,closingChances:4-day,deadline:4});
   expect(journey(s).next).toMatchObject({id:'rescue',done:false,panel:'day-report'});
   s=act(s,{type:'openDay'});
   expect(financialRecovery(s).deadline).toBe(4);expect(journey(s).next.panel).toBe('orders');
  }
  const failed=act(s,{type:'closeDay'});expect(failed.phase).toBe('failed');
  for(let n=0;n<2;n++){s=act(s,{type:'acceptRepair'});s=repairActive(s);}
  expect(s.cash).toBe(620);expect(financialRecovery(s).shortfall).toBe(0);
  expect(journey(s).next).toMatchObject({id:'rescue',done:false,panel:'close-day',title:'日结补缴欠费'});
  s=act(s,{type:'closeDay'});expect(s.debt).toBe(0);expect(s.grace).toBe(0);expect(s.cash).toBe(280);
  expect(journey(s).next.id).not.toBe('rescue');
 });
 it('does not invent a shutdown deadline after permanent ownership',()=>{
  let s=act(playToWin('precision'),{type:'continueEndless'});s=act(s,{type:'openDay'});
  // Cash is isolated here to exercise the already-earned ownership rule.
  s.cash=0;
  for(let n=0;n<5;n++){
   s=act(s,{type:'closeDay'});expect(s.phase).toBe('closed');expect(s.victory).toBe(true);
   expect(financialRecovery(s)).toMatchObject({fees:20,closingChances:null,deadline:null});
   expect(journey(s).next.detail).toContain('永久经营权保留');s=act(s,{type:'openDay'});
  }
 });
});
