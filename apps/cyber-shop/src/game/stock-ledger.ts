import {ITEMS,CATEGORIES} from '../content';
import {containerTrail,containerName} from './containers';
import type {GameState,ItemInstance} from './types';
export type StockStatus='all'|'stored'|'aged'|'unchecked'|'expiring';
export type StockOrder='oldest'|'newest'|'cost';
export interface StockFilter {query?:string;category?:string;status?:StockStatus;order?:StockOrder}
export const heldDays=(s:GameState,i:ItemInstance)=>Math.max(0,s.day-i.acquiredDay);
export function stockLocation(s:GameState,i:ItemInstance){
 if(i.location==='workshop')return '维修工作台';
 if(i.location==='display')return '展示柜';
 const path=containerTrail(s,i.containerId)??[];
 return [(path[0]?.location??i.location)==='counter'?'谈判台':'仓库',...path.map(containerName)].join(' › ');
}
/** Search only names, player labels and public location; never index hidden item properties. */
export function stockEntries(s:GameState,filter:StockFilter={}){
 const words=(filter.query??'').trim().toLocaleLowerCase().split(/\s+/).filter(Boolean);
 return s.items.filter(i=>{
  if(i.owner!=='player')return false;
  const d=ITEMS.find(d=>d.id===i.definitionId)!;
  if(filter.category&&filter.category!=='all'&&d.category!==filter.category)return false;
  const stored=i.location==='stock'||i.location==='counter';
  if(filter.status==='stored'&&!stored)return false;
  if(filter.status==='aged'&&(!stored||heldDays(s,i)<3))return false;
  if(filter.status==='unchecked'&&i.known.includes('basic'))return false;
  if(filter.status==='expiring'&&(!stored||!i.known.includes('basic')||i.expiresDay===null||i.expiresDay>s.day+1))return false;
  const text=[d.name,CATEGORIES.find(c=>c.id===d.category)?.name,stockLocation(s,i)].join(' ').toLocaleLowerCase();
  return words.every(word=>text.includes(word));
 }).sort((a,b)=>filter.order==='cost'?b.cost-a.cost:filter.order==='newest'?b.acquiredDay-a.acquiredDay:a.acquiredDay-b.acquiredDay);
}
