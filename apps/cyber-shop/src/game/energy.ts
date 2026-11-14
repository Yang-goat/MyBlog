import {ITEMS,EQUIPMENT} from '../content';
import {itemAccessible,rootLayout} from './containers';
import type {EnergyLoad,EnergyProfileId,GameState,ItemInstance} from './types';

export const ENERGY_PROFILES:{id:EnergyProfileId;name:string;target:number;gain:number;hours:number;rate:number;minimum:number;material?:string;tool?:string;description:string}[]=[
 {id:'economy',name:'经济均衡',target:70,gain:20,hours:1,rate:.001,minimum:4,description:'先满足常用负载，少占工时。'},
 {id:'balanced',name:'深度均衡',target:90,gain:35,hours:2,rate:.0015,minimum:8,material:'insulation',description:'更换隔离耗材，扩大有效容量。'},
 {id:'precision',name:'精密整备',target:98,gain:45,hours:3,rate:.002,minimum:12,material:'electronic-parts',tool:'calibrator',description:'精密监测与平衡，适合高价值储能件。'},
];
export const ENERGY_VERIFY_HOURS=.5;
export const ENERGY_XP=24;
export const ENERGY_LOADS:{id:EnergyLoad;name:string}[]=[{id:'steady',name:'稳态放电'},{id:'pulse',name:'脉冲负载'},{id:'regulated',name:'稳压输出'}];
const tests:Record<string,{load:EnergyLoad;value:number}>={
 'battery-pack':{load:'steady',value:40},'capacitor-array':{load:'pulse',value:65},'power-module':{load:'regulated',value:50},
};
export const energyTest=(item:ItemInstance)=>tests[item.definitionId];
export const energyEligible=(item:ItemInstance)=>!!tests[item.definitionId];
/** All attribute-dependent estimates follow inspection; preview never spends or rolls. */
export function energyPlan(s:GameState,item:ItemInstance|undefined,profileId:EnergyProfileId){
 const profile=ENERGY_PROFILES.find(p=>p.id===profileId);
 const basic=!!item?.known.some(k=>k==='basic'||k==='diagnosed'),scanned=!!item?.known.some(k=>k==='scan'||k==='batch');
 const before=scanned&&item&&energyEligible(item)?item.capacity:null;
 const target=before!==null&&profile?Math.min(profile.target,before+profile.gain):null;
 const delta=before!==null&&target!==null?Math.max(0,target-before):0;
 const material=EQUIPMENT.find(e=>e.id===profile?.material),stock=material?s.equipment[material.id]??0:0;
 const materialCost=material&&stock?Math.floor((s.equipmentCosts[material.id]??0)/stock):0;
 const electricity=profile&&item&&before!==null?Math.max(profile.minimum,Math.ceil(ITEMS.find(d=>d.id===item.definitionId)!.price*delta*profile.rate)):0;
 const reason=!profile?'未知整备方案':!item||!energyEligible(item)?'请选择电池、电容或电源模块':item.owner!=='player'?'客户物品不能用于自有整备':item.energyPreparation?'这件储能货物已整备过':s.energyWork?'能源工位已有在制货物':item.location!=='stock'||s.orders.some(o=>!o.delivered&&o.itemId===item.id)?'先将货物收回货架':!itemAccessible(s,item)?'先整理箱包，取出这件货':!basic?'先检查品相与基础功能':!scanned?'先扫描容量':item.faults.length?'先修复控制故障，再整备容量':s.phase!=='open'?'开店后安排整备':!s.equipment.scanner?'需要多谱扫描仪':profile.tool&&!s.equipment[profile.tool]?`需要${EQUIPMENT.find(e=>e.id===profile.tool)!.name}`:!delta?'当前容量无需采用此方案':s.hours<profile.hours?'今天的整备工时不足':material&&!stock?`缺少${material.name}`:s.cash<electricity?'电费现金不足':'';
 return {ok:!reason,reason,profile,before,target,delta,material,stock,materialCost,electricity,cost:materialCost+electricity,hours:profile?.hours??0};
}
/** Hold a verified item at the bench until it really fits; never eject existing stock. */
export function energyReturnPosition(s:GameState,capacity:number){
 const item=s.items.find(i=>i.id===s.energyWork?.itemId);if(!item)return undefined;
 const trial={...s,items:s.items.map(i=>i.id===item.id?{...i,location:'stock' as const,containerId:undefined,grid:undefined,counterGrid:undefined}:i)};
 return rootLayout(trial,capacity).positions[item.id];
}
