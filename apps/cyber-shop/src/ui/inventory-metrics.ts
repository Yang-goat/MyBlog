import {ref} from 'vue';
/** One physical pixel unit shared by every inventory surface and container window. */
export const inventoryCell=ref(28);
export function measureInventory(el:HTMLElement,rows:number){
 // One fixed-size warehouse page. Capacity expansion adds tabs instead of shrinking these cells.
 // Reserve enough screen space for the largest (8×8) small container window as well.
 inventoryCell.value=Math.max(1,Math.floor(Math.min(el.clientWidth/24,el.clientHeight/rows,window.innerHeight*.105/3,(window.innerHeight-116)/8,(window.innerWidth-38)/8)));
}
