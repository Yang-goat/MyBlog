import { describe, it, expect } from 'vitest';
import { createGame, applyAction } from '../src/game/engine';
import { journey, dayReport } from '../src/game/journey';
import { act, repairActive, normalDay } from './helpers';
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
});
