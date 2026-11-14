import {describe,it,expect} from 'vitest';
import {createGame,applyAction,itemValue,visibleState,rootCapacity} from '../src/game/engine';
import {ENERGY_PROFILES,energyPlan,energyTest,energyReturnPosition,ENERGY_XP} from '../src/game/energy';
import {deliveryItemCheck} from '../src/game/deliveries';
import {DELIVERIES} from '../src/content/deliveries';
import {exportSave,importSave,validateState} from '../src/persistence/storage';
import {act} from './helpers';
import {stockLocation} from '../src/game/stock-ledger';
import type {GameState,EnergyProfileId} from '../src/game/types';
function sample(id='battery-pack'){
 const s=createGame(42),i=s.items[0]!;Object.assign(i,{definitionId:id,capacity:30,condition:75,known:['basic','scan'],faults:[],expiresDay:null});s.equipment.scanner=1;s.equipment.calibrator=1;return s;
}
const item=(s:GameState)=>s.items[0]!;
function start(s=sample(),profileId:EnergyProfileId='balanced'){return act(s,{type:'startEnergy',itemId:item(s).id,profileId});}
function verify(s:GameState){return act(s,{type:'verifyEnergy',...energyTest(item(s))!});}
function reject(s:GameState,action:Parameters<typeof applyAction>[1]){const before=structuredClone(s),r=applyAction(s,action);expect(r.ok).toBe(false);expect(r.state).toEqual(before);expect(s).toEqual(before);}

describe('owned energy preparation and manual load verification',()=>{
 it('hides unknown readings and previews each profile without spending, random draws or mutation',()=>{
  const s=sample(),i=item(s);i.known=[];expect(energyPlan(s,i,'balanced')).toMatchObject({ok:false,before:null,target:null,electricity:0});i.known=['basic'];expect(energyPlan(s,i,'balanced').reason).toContain('扫描');
  i.known.push('scan');const before=structuredClone(s);expect(ENERGY_PROFILES.map(p=>energyPlan(s,i,p.id).target)).toEqual([50,65,75]);expect(s).toEqual(before);
  i.capacity=80;expect(energyPlan(s,i,'economy').ok).toBe(false);expect(energyPlan(s,i,'balanced').target).toBe(90);expect(energyPlan(s,i,'precision').target).toBe(98);
 });
 it('consumes actual apportioned material cost and electricity once, holding capacity until verification',()=>{
  let s=sample();s=act(s,{type:'buyEquipment',equipmentId:'insulation',count:2});const before=structuredClone(s),p=energyPlan(s,item(s),'balanced');
  expect(p.materialCost).toBe(Math.floor(56/6));s=start(s);expect(s.cash).toBe(before.cash-p.electricity);expect(s.hours).toBe(before.hours-2);expect(item(s).cost).toBe(item(before).cost+p.cost);
  expect(s.equipment.insulation).toBe(5);expect(s.equipmentCosts.insulation).toBe(56-p.materialCost);expect(item(s).capacity).toBe(30);expect(item(s).location).toBe('workshop');expect(s.rng).toBe(before.rng);
  expect(s.records.repairs).toBe(0);expect(s.xp).toBe(before.xp);expect(stockLocation(s,item(s))).toBe('能源工位');expect(importSave(exportSave(s))).toEqual(s);
 });
 it('supports all three stored-energy models and profiles with mode-specific tests',()=>{
  for(const id of ['battery-pack','capacitor-array','power-module'])for(const profile of ENERGY_PROFILES){let s=start(sample(id),profile.id),before=structuredClone(s),target=s.energyWork!.target;s=verify(s);expect(item(s).capacity).toBe(target);expect(s.cash).toBe(before.cash);expect(s.hours).toBe(before.hours-.5);s=act(s,{type:'finishEnergy'});expect(item(s).energyPreparation?.after).toBe(target);expect(s.energyPrepared).toBe(1);validateState(s);}
 });
 it('persists failed settings without rerolling, consuming only half an hour per real attempt',()=>{
  let s=start(),before=structuredClone(s);s=act(s,{type:'verifyEnergy',load:'pulse',value:40});expect(s.energyWork).toMatchObject({attempts:1,verified:false});expect(item(s).capacity).toBe(30);expect(s.cash).toBe(before.cash);expect(s.equipment).toEqual(before.equipment);expect(s.hours).toBe(before.hours-.5);
  s=importSave(exportSave(s));s=act(s,{type:'verifyEnergy',load:'steady',value:43});expect(s.energyWork?.verified).toBe(false);s=act(s,{type:'verifyEnergy',load:'steady',value:42});expect(s.energyWork?.verified).toBe(true);
  s=act(s,{type:'finishEnergy'});expect(item(s).energyPreparation?.hours).toBe(3.5);expect(s.xp).toBe(before.xp+ENERGY_XP);expect(s.energyPrepared).toBe(1);
  reject(s,{type:'finishEnergy'});reject(s,{type:'startEnergy',itemId:item(s).id,profileId:'precision'});
 });
 it('preserves an unfinished job across closing, reopening and save import',()=>{
  let s=start();s.hours=0;reject(s,{type:'verifyEnergy',load:'steady',value:40});const work=structuredClone(s.energyWork);s=act(s,{type:'closeDay'});reject(s,{type:'verifyEnergy',load:'steady',value:40});s=importSave(exportSave(s));expect(s.energyWork).toEqual(work);s=act(s,{type:'openDay'});s=verify(s);s=act(s,{type:'closeDay'});s=act(s,{type:'finishEnergy'});expect(item(s).energyPreparation?.day).toBe(2);expect(item(s).energyPreparation?.hours).toBe(2.5);validateState(s);
 });
 it('keeps reserved status, allows marking and prevents moving or processing a workpiece elsewhere',()=>{
  let s=sample();s=act(s,{type:'reserveItem',itemId:item(s).id,reserved:true});s=start(s);const id=item(s).id;
  for(const action of [{type:'moveStock',itemId:id,x:0,y:0,rotated:false},{type:'startRepair',itemId:id},{type:'liquidate',itemId:id},{type:'display',itemId:id},{type:'inspect',itemId:id}] as const)reject(s,action);
  expect(deliveryItemCheck(s,DELIVERIES.find(d=>d.id==='backup-battery')!,item(s)).ready).toBe(false);
  s=act(s,{type:'reserveItem',itemId:id,reserved:false});s=verify(s);reject(s,{type:'verifyEnergy',load:'steady',value:40});s=act(s,{type:'finishEnergy'});expect(!!item(s).reserved).toBe(false);expect(deliveryItemCheck(s,DELIVERIES.find(d=>d.id==='backup-battery')!,item(s)).ready).toBe(true);
 });
 it('returns from nested storage to a real root position and preserves the original box contents',()=>{
  let s=sample();const box={id:'container-900',styleId:'courier-pack',owner:'player' as const,location:'stock' as const,cost:100,acquiredDay:1,label:'能源',color:'cyan' as const,grid:{x:0,y:0,rotated:false}};s.containers=[box];
  item(s).containerId=box.id;item(s).grid={x:0,y:0,rotated:false};const chip=s.items[1]!;chip.containerId=box.id;chip.grid={x:2,y:0,rotated:false};
  s=start(s);expect(item(s).containerId).toBeUndefined();expect(s.items[1]!.containerId).toBe(box.id);s=verify(s);s=act(s,{type:'finishEnergy'});expect(item(s).containerId).toBeUndefined();expect(item(s).grid).toBeDefined();expect(s.items[1]!.grid).toEqual({x:2,y:0,rotated:false});validateState(s);
 });
 it('holds a verified item when the root grid is full without moving or losing other goods',()=>{
  let s=verify(start());const working=item(s);s.items=[working,...Array.from({length:144},(_,n)=>({...structuredClone(working),id:`item-${1000+n}`,definitionId:'data-chip',location:'stock' as const,grid:{x:n%24,y:Math.floor(n/24),rotated:false},energyPreparation:undefined}))];
  expect(energyReturnPosition(s,rootCapacity(s))).toBeUndefined();reject(s,{type:'finishEnergy'});const before=new Map(s.items.slice(1).map(i=>[i.id,i.grid]));s.items.splice(1,2);expect(energyReturnPosition(s,rootCapacity(s))).toBeUndefined();s.items=s.items.filter(i=>i.id===working.id||!(i.grid?.y===1&&i.grid.x<2));s=act(s,{type:'finishEnergy'});expect(item(s).location).toBe('stock');expect(item(s).grid).toEqual({x:0,y:0,rotated:false});for(const i of s.items.slice(1))expect(i.grid).toEqual(before.get(i.id));
 });
 it('rejects missing cash, materials, tools, unknown input, broken devices, unavailable goods and other in-flight work atomically',()=>{
  for(const modify of [(s:GameState)=>s.cash=0,(s:GameState)=>s.hours=.5,(s:GameState)=>s.equipment.insulation=0,(s:GameState)=>s.equipment.scanner=0,(s:GameState)=>item(s).known=[],(s:GameState)=>item(s).location='display',(s:GameState)=>item(s).owner='customer',(s:GameState)=>item(s).definitionId='alloy-plate']){const s=sample();modify(s);reject(s,{type:'startEnergy',itemId:item(s).id,profileId:'balanced'});}
  let s=sample('power-module');item(s).faults=['burnt-driver'];reject(s,{type:'startEnergy',itemId:item(s).id,profileId:'balanced'});
  s=sample();delete s.equipment.calibrator;reject(s,{type:'startEnergy',itemId:item(s).id,profileId:'precision'});s=start();reject(s,{type:'startEnergy',itemId:item(s).id,profileId:'economy'});
  reject(s,{type:'verifyEnergy',load:'steady',value:NaN});reject(s,{type:'verifyEnergy',load:'steady',value:40.5});reject(s,{type:'finishEnergy'});
 });
 it('makes the prepared capacity change real transaction value and persists its visible audit record',()=>{
  let s=sample(),before=itemValue(s,item(s));s=start(s);s=verify(s);s=act(s,{type:'finishEnergy'});expect(itemValue(s,item(s))).toBeGreaterThan(before);expect(importSave(exportSave(s))).toEqual(s);expect(visibleState(s).items[0]?.energyPreparation).toEqual(item(s).energyPreparation);expect(s.ledger.some(e=>e.kind==='energy-complete'&&e.note.includes('30% → 65%'))).toBe(true);
 });
 it('accepts older saves and rejects broken work, cost, occupancy and preparation records',()=>{
  const old=createGame(42);expect(importSave(exportSave(old))).toEqual(old);const s=start();
  for(const patch of [{itemId:'missing'},{target:101},{before:70},{processHours:0},{attempts:-1},{electricity:-1},{verified:true},{profileId:'unknown'}]){const bad=structuredClone(s);Object.assign(bad.energyWork!,patch);expect(()=>validateState(bad)).toThrow();}
  const bad=structuredClone(s);item(bad).location='stock';expect(()=>validateState(bad)).toThrow();let done=act(verify(s),{type:'finishEnergy'});done.energyPrepared=-1;expect(()=>validateState(done)).toThrow();done.energyPrepared=1;item(done).energyPreparation!.after=1;expect(()=>validateState(done)).toThrow();
 });
});
