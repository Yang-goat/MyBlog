import {ref} from 'vue';
/** One physical pixel unit shared by every inventory surface and container window. */
export const inventoryCell=ref(28);
export function measureInventory(el:HTMLElement){
 const rect=el.getBoundingClientRect();
 inventoryCell.value=Math.max(4,Math.floor(Math.min(rect.width/24,rect.height/6,window.innerHeight*.105/3)));
}
