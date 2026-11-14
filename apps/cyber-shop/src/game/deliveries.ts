import { DELIVERIES } from '../content/deliveries';
import { ITEMS } from '../content/items';
import { itemAccessible } from './containers';
import type { DeliveryDefinition, DeliveryJob, GameState, ItemInstance } from './types';

export const DELIVERY_HOURS=.5;
export const DELIVERY_LIMIT=2;
export const DELIVERY_SOURCE_PREMIUM=1.25;
export const deliveryDefinition=(job:DeliveryJob)=>DELIVERIES.find(d=>d.id===job.templateId)!;
export function newDeliveryDay(s:GameState,previous:DeliveryJob[]=[]):DeliveryJob[]{
 previous=previous.map(j=>j.status==='active'&&j.deadline<s.day?{...j,status:'expired',closedDay:j.deadline}:j);
 const active=previous.filter(j=>j.status==='active');
 const history=previous.filter(j=>!['offered','active'].includes(j.status)).slice(-40);
 const pool=DELIVERIES.filter(d=>d.chapter<=s.chapter);
 const offers:DeliveryDefinition[]=[];
 // Independent of the trading RNG: reading or accepting a notice never rerolls visitors.
 for(let n=0;n<pool.length&&offers.length<3;n++){
  const d=pool[((s.day-1)*2+n)%pool.length]!;
  if(!offers.some(o=>o.category===d.category)&&!active.some(j=>j.templateId===d.id))offers.push(d);
 }
 return [...history,...active,...offers.map(d=>({id:`delivery-${s.day}-${d.id}`,templateId:d.id,postedDay:s.day,deadline:s.day+d.days-1,status:'offered' as const}))];
}
/** Optional in older saves. The first successful action persists this same daily board. */
export const deliveryJobs=(s:GameState)=>s.deliveries??newDeliveryDay(s);
export function deliveryRequirements(d:DeliveryDefinition):string[]{
 const lines=[`${d.quantity} 件：${d.itemIds.map(id=>ITEMS.find(i=>i.id===id)!.name).join(' / ')}`,`品相至少 ${d.condition}%`];
 if(d.functional)lines.push('基础功能正常，无待修故障');
 if(d.capacity)lines.push(`有效容量至少 ${d.capacity}%`);
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
 return deliveryQualityCheck(s,d,item);
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
export function deliverySourcePlan(s:GameState,job:DeliveryJob){
 const request=deliveryDefinition(job),count=Math.max(0,request.quantity-deliveryReadyCount(s,job));
 const reason=job.status!=='active'?'先接下订货':job.deadline<=s.day?'来不及在交期前到货':!count?'货架已有足量合格货物':request.itemIds.every(id=>ITEMS.find(d=>d.id===id)!.regulated)&&!s.licenses.includes('regulated-trade')?'先取得交易许可':'';
 return {ok:!reason,reason,count};
}
/** Only active, accepted requests and current visible goods are used as purchasing clues. */
export function itemDeliveryHints(s:GameState,item:ItemInstance){
 const own=s.items.some(i=>i.id===item.id&&i.owner==='player');
 const visitor=s.visitors[s.visitorIndex];
 const incoming=!own&&s.visitorArrived!==false&&visitor?.kind==='seller'&&!visitor.resolved&&(visitor.goods??(visitor.item?[visitor.item]:[])).some(i=>i.id===item.id);
 if(!own&&!incoming)return [];
 return activeDeliveries(s).filter(job=>deliveryDefinition(job).itemIds.includes(item.definitionId)).map(job=>({
  job,request:deliveryDefinition(job),incoming,readyCount:deliveryReadyCount(s,job),
  check:incoming?deliveryQualityCheck(s,deliveryDefinition(job),item):deliveryItemCheck(s,deliveryDefinition(job),item),
 }));
}
