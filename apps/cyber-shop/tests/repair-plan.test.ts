import { describe, expect, it } from 'vitest';
import { applyAction, calibrationTolerance, createGame } from '../src/game/engine';
import { repairPlan } from '../src/game/repair-plan';
import { FAULTS, ITEMS } from '../src/content';
import { act } from './helpers';
import type { GameState } from '../src/game/types';

function setup(faultId='broken-power',own=false){
 let s=act(createGame(73),{type:'acceptRepair'});const order=s.orders[0]!,item=s.items.find(i=>i.id===order.itemId)!,fault=FAULTS.find(f=>f.id===faultId)!;
 item.definitionId=ITEMS.find(d=>d.certificate===fault.certificate)!.id;item.faults=[faultId];item.originality=80;
 if(own){order.kind='own';order.characterId='player';order.escrow=0;item.owner='player';}
 s=act(s,{type:'diagnose',orderId:order.id});
 return {s,orderId:order.id,itemId:item.id,action:{type:'repair' as const,orderId:order.id,operation:fault.operation,module:fault.module,value:fault.target,faultId}};
}
function assertPreview(s:GameState,action:ReturnType<typeof setup>['action']){
 const snapshot=structuredClone(s),plan=repairPlan(s,action);expect(s).toEqual(snapshot);
 const next=act(s,action);expect(plan.hours).toBe(s.hours-next.hours);expect(plan.cash).toBe(s.cash-next.cash);
 expect(plan.escrow).toBe(s.orders[0]!.escrow-next.orders[0]!.escrow);return {plan,next};
}
describe('repair decisions and truthful estimates',()=>{
 it('quotes customer escrow separately from cash and physical stock',()=>{
  const {s,action}=setup();const {plan,next}=assertPreview(s,action);
  expect(plan).toMatchObject({ok:true,source:'escrow',escrow:32,cash:0,materialName:'电子备件',costAdded:0});expect(next.equipment).toEqual(s.equipment);
  expect(applyAction(s,action).events.at(-1)?.text).toContain('材料专款 32');
 });
 it('shows physical consumption and recycling even when the net stock count is unchanged',()=>{
  const {s,action,itemId}=setup('broken-power',true);s.skills=['restoration-2'];s.equipment['electronic-parts']=2;s.equipmentCosts['electronic-parts']=51;
  const {plan,next}=assertPreview(s,action);expect(plan).toMatchObject({source:'stock',cash:0,costAdded:25,recovered:[{id:'electronic-parts',count:1}]});
  expect(next.equipment['electronic-parts']).toBe(2);expect(next.items.find(i=>i.id===itemId)!.cost-s.items.find(i=>i.id===itemId)!.cost).toBe(25);
  expect(applyAction(s,action).events.at(-1)?.text).toContain('库存电子备件 × 1，计入成本 25');
 });
 it('distinguishes cash top-ups, material savings and blocked operations without charging for a preview',()=>{
  const {s,action}=setup('broken-power',true);s.equipment['electronic-parts']=0;s.equipmentCosts['electronic-parts']=0;
  expect(assertPreview(s,action).plan).toMatchObject({source:'cash',cash:32,costAdded:32});
  s.cash=0;const before=structuredClone(s),blocked=repairPlan(s,action);expect(blocked.ok).toBe(false);expect(blocked.hours).toBe(0);expect(s).toEqual(before);
  s.skills=['workshop-1'];s.records.faults['oxidized-contact']=3;
  expect(assertPreview(s,action).plan).toMatchObject({source:'saved',cash:0,costAdded:0,recovered:[]});
 });
 it('previews preserving original parts with the actual extra time and alternative material',()=>{
  const {s,action,itemId}=setup('worn-gear');const replaced=assertPreview(s,action),preserved=assertPreview(s,{...action,preserve:true} as typeof action);
  expect(replaced.plan).toMatchObject({originalityLoss:18,materialId:'mechanical-parts'});
  expect(preserved.plan).toMatchObject({originalityLoss:0,materialId:'electronic-parts'});expect(preserved.plan.hours-replaced.plan.hours).toBe(1);
  expect(preserved.next.items.find(i=>i.id===itemId)!.originality).toBe(80);
 });
 it('applies the same base, skill and tool tolerance at the successful boundary',()=>{
  for(const [skills,tool,tolerance] of [[[],0,2],[['precision-3'],0,6],[[],1,5],[['precision-3'],1,9]] as const){
   const {s,action,itemId}=setup('clock-drift');s.skills=[...skills];s.equipment.calibrator=tool;expect(calibrationTolerance(s)).toBe(tolerance);
   expect(assertPreview(s,{...action,value:50+tolerance}).next.items.find(i=>i.id===itemId)!.faults).toEqual([]);
   const miss=assertPreview(s,{...action,value:51+tolerance});expect(miss.plan).toMatchObject({miss:true,hours:1,source:null});expect(miss.next.items.find(i=>i.id===itemId)!.faults).toEqual(['clock-drift']);
  }
 });
 it('quick repairs target the selected practiced fault instead of silently taking the first one',()=>{
  const {s,action,itemId}=setup('clock-drift');s.items.find(i=>i.id===itemId)!.faults=['broken-power','clock-drift'];s.records.faults['clock-drift']=3;
  const result=applyAction(s,{...action,quick:true,value:0});expect(result.ok).toBe(true);expect(result.state.items.find(i=>i.id===itemId)!.faults).toEqual(['broken-power']);
  expect(result.state.orders[0]!.steps!.at(-1)).toMatchObject({faultId:'clock-drift',operation:'calibrate'});
  expect(applyAction(s,{...action,quick:true,faultId:'broken-power'}).ok).toBe(false);
 });
 it('requires the replacement tool even if a quick action supplies a different operation',()=>{
  const {s,action}=setup();s.equipment['micro-solder']=0;s.records.faults['broken-power']=3;
  const result=applyAction(s,{...action,operation:'clean',quick:true});expect(result.ok).toBe(false);expect(result.state).toEqual(s);
 });
});
