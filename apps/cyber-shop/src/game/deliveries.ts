import { DELIVERIES, ENERGY_COMMISSIONS, GRID_MAINTENANCE } from '../content/deliveries';
import { FABRICATION_COMMISSIONS, FABRICATION_RESTOCK } from '../content/fabrication';
import { ITEMS } from '../content/items';
import { itemAccessible } from './containers';
import { fabricationQuality, fabricationRecipe, materialInStock, materialReading } from './fabrication';
import type { DeliveryDefinition, DeliveryJob, GameState, ItemInstance } from './types';

export const DELIVERY_HOURS=.5;
export const DELIVERY_LIMIT=2;
export const DELIVERY_SOURCE_PREMIUM=1.25;
export const DELIVERY_DEFINITIONS = [...DELIVERIES, ...ENERGY_COMMISSIONS, GRID_MAINTENANCE, ...FABRICATION_COMMISSIONS, FABRICATION_RESTOCK];
export const deliveryDefinition=(job:DeliveryJob)=>DELIVERY_DEFINITIONS.find(d=>d.id===job.templateId)!;
export function deliveryAllModels(request:DeliveryDefinition){
 const recipe=request.fabricated?fabricationRecipe(request.fabricated):undefined;
 return recipe?[...request.itemIds,...recipe.inputs]:request.itemIds;
}

function commissionProgress(s: GameState, stages: DeliveryDefinition[]) {
 const incomplete = stages.findIndex(d => !s.deliveries?.some(job => job.templateId === d.id && job.status === 'completed'));
 return incomplete === -1 ? stages.length : incomplete;
}

function nextCommission(s: GameState, stages: DeliveryDefinition[], repeat: DeliveryDefinition): DeliveryJob | undefined {
 const request = stages[commissionProgress(s,stages)] ?? repeat;
 const previous = s.deliveries?.find(j => j.templateId === request.id && j.status === 'active');
 if (previous) return previous;
 const prefix = `delivery-${s.day}-${request.id}`;
 if (s.deliveries?.some(j => j.id === prefix)) return undefined;
 return { id: prefix, templateId: request.id, postedDay: s.day, deadline: s.day + request.days - 1, status: 'offered' };
}

export const energyCommissionProgress = (s: GameState) => commissionProgress(s,ENERGY_COMMISSIONS);
export const fabricationProgress = (s: GameState) => commissionProgress(s,FABRICATION_COMMISSIONS);
export const nextEnergyCommission = (s: GameState) => nextCommission(s,ENERGY_COMMISSIONS,GRID_MAINTENANCE);
export const nextFabricationCommission = (s: GameState) => nextCommission(s,FABRICATION_COMMISSIONS,FABRICATION_RESTOCK);

export function newDeliveryDay(s:GameState,previous:DeliveryJob[]=[]):DeliveryJob[]{
 previous=previous.map(j=>j.status==='active'&&j.deadline<s.day?{...j,status:'expired',closedDay:j.deadline}:j);
 const active=previous.filter(j=>j.status==='active');
 const trainingIds=[...ENERGY_COMMISSIONS,...FABRICATION_COMMISSIONS].map(d=>d.id);
 const completedTraining=(job:DeliveryJob)=>job.status==='completed'&&trainingIds.includes(job.templateId);
 const archive=previous.filter(j=>completedTraining(j));
 const history=previous.filter(j=>!['offered','active'].includes(j.status)&&!completedTraining(j)).slice(-40);
 const pool=DELIVERIES.filter(d=>d.chapter<=s.chapter);
 const offers:DeliveryDefinition[]=[];
 // Independent of the trading RNG: reading or accepting a notice never rerolls visitors.
 for(let n=0;n<pool.length&&offers.length<3;n++){
  const d=pool[((s.day-1)*2+n)%pool.length]!;
  if(!offers.some(o=>o.category===d.category)&&!active.some(j=>j.templateId===d.id))offers.push(d);
 }
 return [...archive,...history,...active,...offers.map(d=>({id:`delivery-${s.day}-${d.id}`,templateId:d.id,postedDay:s.day,deadline:s.day+d.days-1,status:'offered' as const}))];
}
/** Optional in older saves. The first successful action persists this same daily board. */
export function deliveryJobs(s:GameState){
 const jobs=s.deliveries??newDeliveryDay(s);
 return [...jobs,...[nextEnergyCommission(s),nextFabricationCommission(s)].filter((job):job is DeliveryJob=>job?.status==='offered')];
}
export function deliveryRequirements(d:DeliveryDefinition):string[]{
 const lines=[`${d.quantity} 件：${d.itemIds.map(id=>ITEMS.find(i=>i.id===id)!.name).join(' / ')}`,`品相至少 ${d.condition}%`];
 if(d.functional)lines.push('基础功能正常，无待修故障');
 if(d.capacity)lines.push(`有效容量至少 ${d.capacity}%`);
 if(d.prepared)lines.push('有本店整备与负载复核记录');
 if(d.fabricated)lines.push(`本店装配批次记录 · 成品原始品相至少 ${d.condition}%`);
 if(d.purity)lines.push(`材料纯度至少 ${d.purity}%`);
 if(d.integrity)lines.push(`可读完整度至少 ${d.integrity}%`);
 if(d.freshDays)lines.push(`交货时保质期至少还剩 ${d.freshDays} 天`);
 if(d.compatible)lines.push('开放标准接口');
 if(d.authentic)lines.push('已查验为真实原物，来源可追溯');
 if(d.originality)lines.push(`原貌至少 ${d.originality}%`);
 if(d.authorized)lines.push('已查验合法授权');
 if(d.itemIds.some(id=>ITEMS.find(i=>i.id===id)?.regulated))lines.push('持有受管制商品交易许可');
 return lines;
}
export interface DeliveryCheck { ready:boolean; reason:string; inspect?:'basic'|'scan'|'serial' }
/** Check knowledge before truth so a request never reveals an uninspected attribute. */
export function deliveryItemCheck(s:GameState,d:DeliveryDefinition,item:ItemInstance):DeliveryCheck{
 const no=(reason:string,inspect?:DeliveryCheck['inspect']):DeliveryCheck=>({ready:false,reason,inspect});
 if(!d.itemIds.includes(item.definitionId))return no('型号不在这份订货单内');
 if(item.owner!=='player')return no('客户托管物品不能交货');
 if(item.reserved)return no('已留货，请先解除留货');
 if(item.location!=='stock'||s.orders.some(o=>!o.delivered&&o.itemId===item.id))return no(item.location==='display'?'请先撤展':'请先将物品收回货架');
 if(!itemAccessible(s,item))return no('箱包被压住，先移走上层箱包');
 const quality=deliveryQualityCheck(s,d,item);
 if(quality.ready&&d.prepared&&!item.energyPreparation)return no('送到能源工位整备并通过复核');
 if(quality.ready&&d.fabricated&&(item.fabrication?.recipeId!==d.fabricated||item.fabrication.quality<d.condition))return no('需要符合品相要求的本店装配成品');
 return quality;
}
/** Shared by owned-stock acceptance and inspected supplier previews; no ownership is implied. */
export function deliveryQualityCheck(s:GameState,d:DeliveryDefinition,item:ItemInstance):DeliveryCheck{
 const no=(reason:string,inspect?:DeliveryCheck['inspect']):DeliveryCheck=>({ready:false,reason,inspect});
 if(!d.itemIds.includes(item.definitionId))return no('型号不在这份订货单内');
 if(ITEMS.find(i=>i.id===item.definitionId)!.regulated&&!s.licenses.includes('regulated-trade'))return no('尚未取得交易许可');
 if(!item.known.some(k=>['basic','diagnosed'].includes(k)))return no('先检查品相与基础功能','basic');
 if(item.condition<d.condition)return no(`品相 ${item.condition}%，未达 ${d.condition}%`);
 if(d.functional&&item.faults.length)return no('功能异常，需先送修');
 if(d.freshDays&&(item.expiresDay===null||item.expiresDay-s.day<d.freshDays))return no('剩余保质期不足，可查看保鲜选项');
 if((d.capacity||d.purity||d.integrity||d.compatible)&&!item.known.some(k=>['scan','batch'].includes(k)))return no('先扫描所需读数','scan');
 if(d.capacity&&item.capacity<d.capacity)return no(`有效容量 ${item.capacity}%，未达 ${d.capacity}%`);
 if(d.purity&&item.purity<d.purity)return no(`纯度 ${item.purity}%，未达 ${d.purity}%`);
 if(d.integrity&&item.integrity<d.integrity)return no(`完整度 ${item.integrity}%，未达 ${d.integrity}%`);
 if(d.compatible&&item.compatibility!=='开放标准')return no('接口不符合开放标准');
 if((d.authentic||d.authorized||d.originality)&&!item.known.includes('serial'))return no('先查验来源记录','serial');
 if(d.authentic&&(!item.authentic||!item.provenance.includes('可追溯')))return no('真伪或出处不符合要求');
 if(d.authorized&&!item.provenance.includes('合法授权'))return no('尚无可核对的合法授权');
 if(d.originality&&item.originality<d.originality)return no(`原貌 ${item.originality}%，未达 ${d.originality}%`);
 return {ready:true,reason:'符合交货要求'};
}

export const activeDeliveries=(s:GameState)=>deliveryJobs(s).filter(j=>j.status==='active'&&j.deadline>=s.day);
export const deliveryReadyCount=(s:GameState,job:DeliveryJob)=>s.items.filter(i=>deliveryItemCheck(s,deliveryDefinition(job),i).ready).length;

export function canPrepareForCommission(s: GameState, request: DeliveryDefinition, item: ItemInstance) {
 if (item.owner !== 'player' || item.reserved || item.energyPreparation || !request.itemIds.includes(item.definitionId)) return false;
 if (item.faults.length || !item.known.some(k => k === 'basic' || k === 'diagnosed') || item.condition < request.condition) return false;
 const required = request.capacity ?? 100;
 if (s.energyWork?.itemId === item.id) return s.energyWork.target >= required;
 if (item.location !== 'stock' || !itemAccessible(s, item) || !item.known.some(k => k === 'scan' || k === 'batch')) return false;
 // Compare with the highest attainable profile. Unscanned attributes never affect the sourcing preview.
 return item.capacity < 98 && Math.min(98, item.capacity + 45) >= required;
}

export function deliverySourcePlan(s:GameState,job:DeliveryJob){
 const request=deliveryDefinition(job);
 const recipe=request.fabricated?fabricationRecipe(request.fabricated):undefined;
 if(recipe){
  const needed=Math.max(0,request.quantity-deliveryReadyCount(s,job));
  const materials=recipe.inputs.flatMap(definitionId=>{
   const available=s.items.filter(item=>{
    if(item.definitionId!==definitionId||!materialInStock(s,item))return false;
    const reading=materialReading(item);
    return reading!==null&&fabricationQuality(reading,'fine')>=request.condition;
   }).length;
   return Array<string>(Math.max(0,needed-available)).fill(definitionId);
  });
  const reason=job.status!=='active'?'先接下订货':job.deadline<=s.day?'来不及在交期前到货':!materials.length?'仓库已有足量可用原料或成品':'';
  return {ok:!reason,reason,count:materials.length,materials};
 }
 const usable=request.prepared
  ?s.items.filter(item=>deliveryItemCheck(s,request,item).ready||canPrepareForCommission(s,request,item)).length
  :deliveryReadyCount(s,job);
 const count=Math.max(0,request.quantity-usable);
 const reason=job.status!=='active'?'先接下订货':job.deadline<=s.day?'来不及在交期前到货':!count?'货架已有足量合格货物':request.itemIds.every(id=>ITEMS.find(d=>d.id===id)!.regulated)&&!s.licenses.includes('regulated-trade')?'先取得交易许可':'';
 return {ok:!reason,reason,count,materials:undefined};
}
/** Only active, accepted requests and current visible goods are used as purchasing clues. */
export function itemDeliveryHints(s:GameState,item:ItemInstance){
 const own=s.items.some(i=>i.id===item.id&&i.owner==='player');
 const visitor=s.visitors[s.visitorIndex];
 const incoming=!own&&s.visitorArrived!==false&&visitor?.kind==='seller'&&!visitor.resolved&&(visitor.goods??(visitor.item?[visitor.item]:[])).some(i=>i.id===item.id);
 if(!own&&!incoming)return [];
 return activeDeliveries(s).filter(job=>deliveryAllModels(deliveryDefinition(job)).includes(item.definitionId)).map(job=>{
  const request=deliveryDefinition(job);
  const reading=materialReading(item);
  let check:DeliveryCheck;
  const material=!request.itemIds.includes(item.definitionId);
  if (material) {
   const canUse=reading!==null&&fabricationQuality(reading,'fine')>=request.condition;
   check={ready:canUse,reason:reading===null?'原料待读数':canUse?'可作为这份订单的配方原料':'原料读数太低'};
  } else if(incoming&&request.fabricated) {
   check={ready:false,reason:'委托验收本店装配成品'};
  } else {
   check=incoming?deliveryQualityCheck(s,request,item):deliveryItemCheck(s,request,item);
  }
  return {job,request,incoming,material,readyCount:deliveryReadyCount(s,job),check};
 });
}
