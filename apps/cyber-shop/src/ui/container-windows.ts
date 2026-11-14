import {ref} from 'vue';
import {state} from './store';
import {storageStyle} from '../content/storage';
import {inventoryCell} from './inventory-metrics';
export interface ContainerWindow {id:string;x:number;y:number;order:number}
export const containerWindows=ref<ContainerWindow[]>([]);
let order=0;
export function windowSize(id:string){
 const box=state.value.containers?.find(c=>c.id===id);const style=storageStyle(box?.styleId??'courier-pack');
 const cell=inventoryCell.value;
 return {width:Math.max(226,style.columns*cell+22),height:style.rows*cell+100,cell,columns:style.columns,rows:style.rows};
}
export function clampWindow(w:ContainerWindow){const size=windowSize(w.id);w.x=Math.max(8,Math.min(w.x,window.innerWidth-size.width-8));w.y=Math.max(8,Math.min(w.y,window.innerHeight-size.height-8));}
export function focusContainer(id:string){const w=containerWindows.value.find(w=>w.id===id);if(w)w.order=++order;}
export function openContainer(id:string,point?:{clientX:number;clientY:number}){
 if(!state.value.containers?.some(c=>c.id===id))return;
 const existing=containerWindows.value.find(w=>w.id===id);if(existing){focusContainer(id);return;}
 const size=windowSize(id),x=point?.clientX??window.innerWidth*.5,y=point?.clientY??window.innerHeight*.3;
 const w={id,x:x+14+size.width<window.innerWidth?x+14:x-size.width-14,y:y+14+size.height<window.innerHeight?y+14:y-size.height-14,order:++order};clampWindow(w);containerWindows.value.push(w);
}
export function closeContainer(id:string){containerWindows.value=containerWindows.value.filter(w=>w.id!==id);}
export function closeTopContainer(){const top=[...containerWindows.value].sort((a,b)=>b.order-a.order)[0];if(top)closeContainer(top.id);}
export function clearContainerWindows(){containerWindows.value=[];}
