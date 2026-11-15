import {ref} from 'vue';
/** One physical pixel unit shared by every inventory surface and container window. */
export const inventoryCell=ref(28);
export function measureInventory(el:HTMLElement,rows:number){
 // One fixed-size warehouse page. Capacity expansion adds tabs instead of shrinking these cells.
 // Reserve enough screen space for the largest (8×8) small container window as well.
 const room=el.closest('.shop-room')?.getBoundingClientRect(),width=room?.width??window.innerWidth,height=room?.height??window.innerHeight;
 inventoryCell.value=Math.max(1,Math.floor(Math.min(el.clientWidth/24,el.clientHeight/rows,height*.105/3,(height-128)/8,(width-38)/8)));
}
