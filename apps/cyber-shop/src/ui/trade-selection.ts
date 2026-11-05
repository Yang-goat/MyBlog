import { computed, ref, watch } from 'vue';
import { state, notify, dispatch } from './store';
import { warehouseLayout, counterLayout, SURFACE_CAPACITY, SURFACE_COLUMNS, fits, occupy, type Placement } from '../game/warehouse';
import type { ItemInstance } from '../game/types';
export const tradeIds=ref<string[]>([]);
export const tradePlaces=ref<Record<string,Placement>>({});
export const currentGuest=computed(()=>state.value.visitors[state.value.visitorIndex]);
export const guestGoods=computed(()=>currentGuest.value?.goods ?? (currentGuest.value?.item ? [currentGuest.value.item] : []));
export const tradeItem=(id:string):ItemInstance|undefined=>state.value.items.find(i=>i.id===id) ?? guestGoods.value.find(i=>i.id===id);
export function removeTrade(id:string){tradeIds.value=tradeIds.value.filter(v=>v!==id);delete tradePlaces.value[id];}
export function clearTrade(){tradeIds.value=[];tradePlaces.value={};}
export function stageTrade(id:string,desired?:Placement){
 const item=tradeItem(id);if(!item)return false;
 const existing=counterLayout(state.value.items);const occupied=new Set<number>();
 for(const i of state.value.items)if(i.id!==id&&existing.positions[i.id])occupy(i,existing.positions[i.id]!,occupied,SURFACE_COLUMNS);
 for(const i of tradeIds.value)if(i!==id&&tradeItem(i)&&tradePlaces.value[i])occupy(tradeItem(i)!,tradePlaces.value[i]!,occupied,SURFACE_COLUMNS);
 let at=desired;
 if(!at){for(let c=0;c<SURFACE_CAPACITY*4&&!at;c++)for(const rotated of [false,true]){const p={x:c%SURFACE_COLUMNS,y:Math.floor(c/SURFACE_COLUMNS),rotated};if(fits(item,p,occupied,SURFACE_CAPACITY,SURFACE_COLUMNS)){at=p;break;}}}
 if(!at||!fits(item,at,occupied,SURFACE_CAPACITY,SURFACE_COLUMNS)){notify('谈判台没有合适空格，请先将已购货物入库。');return false;}
 if(state.value.items.some(i=>i.id===id&&i.owner==='player')&&!dispatch({type:'moveCounter',itemId:id,...at}))return false;
 if(!tradeIds.value.includes(id))tradeIds.value.push(id);tradePlaces.value[id]=at;return true;
}
watch(()=>currentGuest.value?.id,clearTrade);
watch(state,()=>{for(const id of [...tradeIds.value]){const i=tradeItem(id);if(!i||(i.location==='counter'&&currentGuest.value?.kind!=='buyer')||(currentGuest.value?.kind==='buyer'&&i.location!=='counter')||currentGuest.value?.resolved)removeTrade(id);}});
