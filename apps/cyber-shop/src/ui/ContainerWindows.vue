<script setup lang="ts">
import {computed,ref,onMounted,onUnmounted,watch} from 'vue';
import {state,modal,dispatch,layoutUndoCount,undoLayout} from './store';
import {containerWindows,windowSize,clampWindow,focusContainer,openContainer,closeContainer,clearContainerWindows} from './container-windows';
import {containerItems,containerLayout,containerTrail,isContainer,ownedObjects,objectFits,usedCells,LABEL_COLORS,LABELER_PRICE,type StoredObject} from '../game/containers';
import {storageStyle} from '../content/storage';
import {ITEMS} from '../content';
import {rootCapacity} from '../game/engine';
import {footprint} from '../game/warehouse';
import type {StorageContainer,Rotation} from '../game/types';
import InventoryArt from '../scenes/InventoryArt.vue';
import {inventoryPlacement,previewPlacement} from './inventory-shape';
import {inventoryCell} from './inventory-metrics';
import {locatedItem} from './inventory-navigation';
import StorageArt from '../scenes/StorageArt.vue';
const props=defineProps<{held:string;rotated:Rotation;hover?:{x:number;y:number;containerId?:string}}>();
const emit=defineEmits<{start:[event:PointerEvent,id:string];place:[zone:string,x:number,y:number,target:string];open:[id:string,event:MouseEvent];rotate:[];cancel:[];auto:[target?:string]}>();
const resizeTick=ref(0);
const windows=computed(()=>{resizeTick.value;return containerWindows.value.flatMap(w=>{const box=state.value.containers?.find(c=>c.id===w.id);return box?[{...w,box,size:windowSize(w.id),layout:containerLayout(state.value,box),contents:containerItems(state.value,w.id)}]:[];});});
const heldObject=computed(()=>ownedObjects(state.value).find(o=>o.id===props.held));
const name=(o:StoredObject)=>isContainer(o)?o.label:ITEMS.find(d=>d.id===o.definitionId)!.name;
const atStyle=inventoryPlacement;
function preview(id:string){const o=heldObject.value,h=props.hover;if(!o||h?.containerId!==id)return null;const size=windowSize(id),f=footprint(o,props.rotated);return{valid:objectFits(state.value,rootCapacity(state.value),o,{x:h.x,y:h.y,rotated:props.rotated},id),style:previewPlacement(o,{x:h.x,y:h.y,rotated:props.rotated})};}
const labelId=ref(''),label=ref(''),color=ref<StorageContainer['color']>('ivory');
function labelBox(box:StorageContainer){if(!state.value.labeler){dispatch({type:'buyLabeler'});return;}labelId.value=labelId.value===box.id?'':box.id;label.value=box.label;color.value=box.color;}
function print(){if(dispatch({type:'labelContainer',containerId:labelId.value,label:label.value.trim(),color:color.value}))labelId.value='';}
let moving:{id:string;x:number;y:number;originX:number;originY:number}|undefined;
function headerDown(e:PointerEvent,id:string){if(e.button!==0||(e.target as Element).closest('button'))return;const w=containerWindows.value.find(w=>w.id===id)!;focusContainer(id);moving={id,x:e.clientX,y:e.clientY,originX:w.x,originY:w.y};e.preventDefault();}
function move(e:PointerEvent){if(!moving)return;const w=containerWindows.value.find(w=>w.id===moving!.id);if(w){w.x=moving.originX+e.clientX-moving.x;w.y=moving.originY+e.clientY-moving.y;clampWindow(w);}}
function stop(){moving=undefined;}
function resize(){resizeTick.value++;containerWindows.value.forEach(clampWindow);}
watch(inventoryCell,resize);
watch(()=>state.value.containers,()=>{containerWindows.value=containerWindows.value.filter(w=>state.value.containers?.some(c=>c.id===w.id));});
onMounted(()=>{window.addEventListener('pointermove',move);window.addEventListener('pointerup',stop);window.addEventListener('pointercancel',stop);window.addEventListener('resize',resize);});
onUnmounted(()=>{clearContainerWindows();window.removeEventListener('pointermove',move);window.removeEventListener('pointerup',stop);window.removeEventListener('pointercancel',stop);window.removeEventListener('resize',resize);});
</script>
<template>
 <section v-for="w in windows" v-show="!modal" :key="w.id" class="container-window" :data-container-window="w.id" :data-resize="resizeTick" role="dialog" aria-modal="false" :aria-label="`${w.box.label} · 箱内空间`" :style="{left:w.x+'px',top:w.y+'px',width:w.size.width+'px',zIndex:80+w.order,'--cell':w.size.cell+'px'}" @pointerdown="focusContainer(w.id)" @pointerover.stop @pointerout.stop @contextmenu.prevent.stop>
  <header class="container-window-title" @pointerdown.stop="headerDown($event,w.id)"><StorageArt :kind="storageStyle(w.box.styleId).art"/><div><strong :data-color="w.box.color">{{w.box.label}}</strong><small>{{w.size.columns}}×{{w.size.rows}} · {{usedCells(state,w.id)}} 格已用 · {{containerTrail(state,w.id)?.length}}/3 层</small></div><button class="box-label-button" :aria-label="state.labeler?`标记 ${w.box.label}`:'购入标签机 · ₡90'" :disabled="!state.labeler&&state.cash<LABELER_PRICE" @click="labelBox(w.box)">⌁</button><button :aria-label="`关闭 ${w.box.label}`" @click="closeContainer(w.id)">×</button></header>
  <div class="container-window-body"><div class="container-grid" data-zone="container" :data-container-id="w.id" :aria-label="`${w.box.label}内部格子`" :style="{gridTemplateColumns:`repeat(${w.size.columns},var(--cell))`,gridTemplateRows:`repeat(${w.size.rows},var(--cell))`}">
   <button v-for="n in w.size.columns*w.size.rows" :key="n" class="container-cell" :aria-label="`箱内空格 ${n}`" :style="{gridColumn:(n-1)%w.size.columns+1,gridRow:Math.floor((n-1)/w.size.columns)+1}" @click="emit('place','container',(n-1)%w.size.columns,Math.floor((n-1)/w.size.columns),w.id)"></button>
   <button v-for="o in w.contents.filter(o=>w.layout.positions[o.id])" :key="o.id" :data-storage-object="o.id" :data-located="locatedItem===o.id||undefined" :data-container-object="isContainer(o)?o.id:undefined" :aria-label="name(o)" :aria-pressed="held===o.id" :class="['container-item',{'nested-container':isContainer(o)}]" :style="atStyle(o,w.layout.positions[o.id]!)" @pointerdown.stop="emit('start',$event,o.id)" @dblclick.stop="isContainer(o)&&emit('open',o.id,$event)" @keydown.enter="isContainer(o)&&openContainer(o.id)"><InventoryArt :object="o" :rotated="w.layout.positions[o.id]!.rotated"/><small v-if="isContainer(o)" :data-color="o.color">{{o.label}}</small></button>
   <div v-if="preview(w.id)" :class="['container-preview',{invalid:!preview(w.id)!.valid}]" :style="preview(w.id)!.style"></div>
  </div></div>
  <footer class="container-window-tools"><button aria-label="撤销摆放" title="撤销摆放 · Ctrl / ⌘ Z" :disabled="!layoutUndoCount" @click="undoLayout">↶</button><template v-if="heldObject"><button aria-label="旋转物品" @click="emit('rotate')">旋转</button><button @click="emit('auto',w.id)">放入</button><button @click="emit('auto')">取出</button><button v-if="!isContainer(heldObject)&&w.contents.some(o=>o.id===heldObject!.id)" :aria-label="heldObject.reserved?'解除留货':'标记留货'" :title="heldObject.reserved?'解除留货':'标记留货'" @click="dispatch({type:'reserveItem',itemId:heldObject.id,reserved:!heldObject.reserved});emit('cancel')">{{heldObject.reserved?'解除':'留货'}}</button><button v-if="isContainer(heldObject)" @click="emit('open',heldObject.id,$event)">打开</button><button aria-label="放下物品" @click="emit('cancel')">×</button></template></footer>
  <form v-if="labelId===w.id" class="container-label-editor" @submit.prevent="print"><label>箱包名称<input v-model="label" aria-label="箱包名称" maxlength="24" autofocus/></label><div class="label-colors"><button v-for="c in LABEL_COLORS" :key="c" :data-color="c" :aria-label="`标签颜色 ${c}`" :aria-pressed="color===c" type="button" @click="color=c">{{color===c?'✓':''}}</button></div><div><button type="submit">打印标签</button><button type="button" @click="labelId=''">返回</button></div></form>
 </section>
</template>
<style src="./container-windows.css"></style>
