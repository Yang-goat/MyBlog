import {reactive,ref} from 'vue';
import type {StockStatus,StockOrder} from '../game/stock-ledger';
export const stockView=reactive({query:'',category:'all',status:'all' as StockStatus,order:'oldest' as StockOrder});
export const locateRequest=ref<{id:string;sequence:number}>();
export const locatedItem=ref('');
let sequence=0;
export function requestItemLocation(id:string){locateRequest.value={id,sequence:++sequence};}
export function resetInventoryNavigation(){Object.assign(stockView,{query:'',category:'all',status:'all',order:'oldest'});locateRequest.value=undefined;locatedItem.value='';}
