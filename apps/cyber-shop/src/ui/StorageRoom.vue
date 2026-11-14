<script setup lang="ts">
import {computed,ref,onMounted,onUnmounted} from 'vue';
import {ITEMS} from '../content';
import {storageStyle} from '../content/storage';
import {rootCapacity} from '../game/engine';
import {footprint} from '../game/warehouse';
import {ownedObjects,isContainer,containerItems,containerTrail,containerName,roomLayout,roomShape,objectFits,firstObjectPlace,canNest,LABEL_COLORS,LABELER_PRICE,type StoredObject} from '../game/containers';
import {state,selectedStorage,selectedItem,dispatch,openGuide,notify} from './store';
import type {StorageContainer} from '../game/types';
import Art from './Art.vue';import StorageArt from '../scenes/StorageArt.vue';
const activeId=ref(state.value.containers?.some(c=>c.id===selectedStorage.value)?selectedStorage.value:'');
const active=computed(()=>state.value.containers?.find(c=>c.id===activeId.value));
const target=computed(()=>active.value?.id),objects=computed(()=>ownedObjects(state.value));
const shape=computed(()=>roomShape(state.value,rootCapacity(state.value),target.value));
const layout=computed(()=>roomLayout(state.value,rootCapacity(state.value),target.value));
const contents=computed(()=>objects.value.filter(o=>o.location==='stock'&&o.containerId===target.value));
const others=computed(()=>objects.value.filter(o=>['stock','counter'].includes(o.location)&&!contents.value.includes(o)&&o.id!==target.value));
const trail=computed(()=>containerTrail(state.value,target.value)??[]);
const picked=ref(''),rotated=ref(false),hover=ref<number>();
const held=computed(()=>objects.value.find(o=>o.id===picked.value));
const labelBox=computed(()=>held.value&&isContainer(held.value)?held.value:active.value);
const labeling=ref(false),label=ref(''),color=ref<StorageContainer['color']>('ivory');
const used=computed(()=>contents.value.reduce((n,o)=>{const f=footprint(o);return n+f.width*f.height;},0));
const title=(o:StoredObject)=>isContainer(o)?containerName(o):ITEMS.find(i=>i.id===o.definitionId)!.name;
const where=(o:StoredObject)=>o.location==='counter'?'谈判台':containerTrail(state.value,o.containerId)?.map(c=>c.label).join(' / ')||'仓库';
function open(id?:string){activeId.value=id??'';selectedStorage.value=id??'';hover.value=undefined;labeling.value=false;}
function pick(o:StoredObject){picked.value=o.id;rotated.value=(o.location==='counter'?o.counterGrid:o.grid)?.rotated??false;labeling.value=false;if(!isContainer(o))selectedItem.value=o.id;}
function move(at:{x:number;y:number;rotated:boolean},destination:string|null=target.value??null){const o=held.value;if(!o)return false;const action=isContainer(o)?{type:'moveStorage' as const,storageId:o.id,containerId:destination??undefined,...at}:{type:'moveStock' as const,itemId:o.id,containerId:destination??undefined,...at};if(dispatch(action)){picked.value='';hover.value=undefined;return true;}return false;}
function place(n:number){move({x:n%shape.value.columns,y:Math.floor(n/shape.value.columns),rotated:rotated.value});}
function autoPlace(destination=target.value){if(!held.value)return;if(!canNest(state.value,held.value,destination))return notify('箱包不能放进自己或自己的内层箱包。');const at=firstObjectPlace(state.value,rootCapacity(state.value),held.value,destination);if(at)move(at,destination);else notify('没有完整空位，先整理或换一只更大的箱包。');}
function withdraw(){if(!held.value)return;const at=firstObjectPlace(state.value,rootCapacity(state.value),held.value);if(at)move(at,null);else notify('仓库没有完整空位，请先腾出空间。');}
const validPreview=computed(()=>!!held.value&&hover.value!==undefined&&objectFits(state.value,rootCapacity(state.value),held.value,{x:hover.value%shape.value.columns,y:Math.floor(hover.value/shape.value.columns),rotated:rotated.value},target.value));
const objectStyle=(o:StoredObject)=>{const at=layout.value.positions[o.id];if(!at)return {};const f=footprint(o,at.rotated);return{gridColumn:`${at.x+1} / span ${f.width}`,gridRow:`${at.y+1} / span ${f.height}`};};
const imageStyle=(o:StoredObject)=>{if(!layout.value.positions[o.id]?.rotated)return {};const f=footprint(o);return{width:`${f.width/f.height*90}%`,height:`${f.height/f.width*90}%`,maxWidth:'none',maxHeight:'none',transform:'rotate(90deg)',flexShrink:0};};
function editLabel(){if(!labelBox.value)return;label.value=labelBox.value.label;color.value=labelBox.value.color;labeling.value=!labeling.value;}
function printLabel(){if(labelBox.value&&dispatch({type:'labelContainer',containerId:labelBox.value.id,label:label.value.trim(),color:color.value}))labeling.value=false;}
let down:{id:string;x:number;y:number}|undefined;const dragging=ref(false),pointer=ref({x:0,y:0});let skipClick=false;
function startDrag(e:PointerEvent,o:StoredObject){if(e.button===0&&e.pointerType!=='touch')down={id:o.id,x:e.clientX,y:e.clientY};}
function select(o:StoredObject){if(!skipClick)pick(o);}
function pointerMove(e:PointerEvent){pointer.value={x:e.clientX,y:e.clientY};if(down&&!dragging.value&&Math.hypot(e.clientX-down.x,e.clientY-down.y)>7){const o=objects.value.find(o=>o.id===down!.id);if(o){pick(o);dragging.value=true;}}const grid=document.querySelector('.container-grid')?.getBoundingClientRect();hover.value=held.value&&grid&&e.clientX>=grid.left&&e.clientX<grid.right&&e.clientY>=grid.top&&e.clientY<grid.bottom?Math.floor((e.clientY-grid.top)/grid.height*Math.ceil(shape.value.cells/shape.value.columns))*shape.value.columns+Math.floor((e.clientX-grid.left)/grid.width*shape.value.columns):undefined;}
function pointerUp(e:PointerEvent){if(dragging.value&&held.value){skipClick=true;setTimeout(()=>skipClick=false,0);const id=document.elementFromPoint(e.clientX,e.clientY)?.closest<HTMLElement>('[data-storage-object]')?.dataset.storageObject;const box=state.value.containers?.find(c=>c.id===id&&c.id!==held.value!.id);if(box)autoPlace(box.id);else if(hover.value!==undefined)place(hover.value);}down=undefined;dragging.value=false;}
function cancel(){down=undefined;dragging.value=false;}
function key(e:KeyboardEvent){if((e.target as HTMLElement)?.matches('input,select,textarea'))return;if(['q','e'].includes(e.key.toLowerCase())&&held.value){e.preventDefault();rotated.value=!rotated.value;}}
onMounted(()=>{window.addEventListener('pointermove',pointerMove);window.addEventListener('pointerup',pointerUp);window.addEventListener('pointercancel',cancel);window.addEventListener('keydown',key);});
onUnmounted(()=>{window.removeEventListener('pointermove',pointerMove);window.removeEventListener('pointerup',pointerUp);window.removeEventListener('pointercancel',cancel);window.removeEventListener('keydown',key);});
</script>
<template>
 <section class="storage-room"><header class="storage-heading"><div><p class="eyebrow">STOCK / 物归其位</p><h2>箱包收纳</h2></div><span>₡{{state.cash.toLocaleString()}}</span><button @click="openGuide('stock')">收纳教程 ?</button></header>
 <nav class="storage-breadcrumb" aria-label="当前收纳路径"><button :aria-current="!active?'location':undefined" @click="open()">仓库</button><template v-for="c in trail" :key="c.id"><span>›</span><button :aria-current="c.id===activeId?'location':undefined" @click="open(c.id)">{{c.label}}</button></template></nav>
 <div class="storage-workspace"><section class="container-interior"><header><span v-if="active" class="container-tag" :data-color="active.color">{{active.label}}</span><span v-else>自有仓库</span><small>{{used}} / {{shape.cells}} 格</small></header>
 <div class="container-grid-wrap"><div class="container-grid" :style="{'--columns':shape.columns,'--rows':Math.ceil(shape.cells/shape.columns)}" :data-open-container="target??'root'" :aria-label="`${active?.label??'仓库'}内部格子`"><button v-for="n in shape.cells" :key="n" class="container-cell" :aria-label="`箱内空格 ${n}`" :style="{gridColumn:(n-1)%shape.columns+1,gridRow:Math.floor((n-1)/shape.columns)+1}" @click="place(n-1)"></button>
 <button v-for="o in contents.filter(o=>layout.positions[o.id])" :key="o.id" :data-storage-object="o.id" :aria-label="title(o)" :aria-pressed="picked===o.id" :class="['container-item',{'nested-container':isContainer(o)}]" :style="objectStyle(o)" @pointerdown="startDrag($event,o)" @click="select(o)" @dblclick="isContainer(o)&&open(o.id)"><StorageArt v-if="isContainer(o)" :kind="storageStyle(o.styleId).art" :style="imageStyle(o)"/><Art v-else :id="o.definitionId" :style="imageStyle(o)" eager/><small :data-color="isContainer(o)?o.color:undefined">{{title(o)}}{{isContainer(o)?' ↗':''}}</small></button>
 <div v-if="held&&hover!==undefined" :class="['container-preview',{invalid:!validPreview}]" :style="{gridColumn:`${hover%shape.columns+1} / span ${Math.min(footprint(held,rotated).width,shape.columns-hover%shape.columns)}`,gridRow:`${Math.floor(hover/shape.columns)+1} / span ${Math.min(footprint(held,rotated).height,Math.ceil(shape.cells/shape.columns)-Math.floor(hover/shape.columns))}`}"></div></div></div>
 <div class="container-held"><template v-if="held"><span>{{title(held)}} · 外形 {{footprint(held,rotated).width}}×{{footprint(held,rotated).height}}</span><div><button @click="rotated=!rotated">旋转 Q / E</button><button @click="autoPlace()">放入空位</button><button @click="withdraw">取回仓库</button><button v-if="isContainer(held)" @click="open(held.id)">打开箱包 ↗</button><button aria-label="取消选择物品" @click="picked=''">×</button></div></template><span v-else class="idle-selection">{{active?'箱包内部':'选择物品整理，双击箱包打开'}}</span></div>
 </section><aside class="container-sidebar"><section v-if="labelBox" class="container-details"><StorageArt :kind="storageStyle(labelBox.styleId).art"/><div><h3>{{labelBox.label}}</h3><p>{{storageStyle(labelBox.styleId).name}} · 内部 {{storageStyle(labelBox.styleId).columns}}×{{storageStyle(labelBox.styleId).rows}}</p><small>{{containerItems(state,labelBox.id).length}} 件 · 成本 ₡{{labelBox.cost}}</small></div></section>
 <div class="labeler-controls"><button v-if="!state.labeler" :disabled="state.cash<LABELER_PRICE" @click="dispatch({type:'buyLabeler'})"><StorageArt kind="labeler"/>购入标签机 · ₡{{LABELER_PRICE}}</button><button v-else :disabled="!labelBox" @click="editLabel"><StorageArt kind="labeler"/>打标签</button></div>
 <form v-if="labeling&&labelBox" class="label-form" @submit.prevent="printLabel"><label>箱包名称<input v-model="label" aria-label="箱包名称" maxlength="24"/></label><div class="label-colors"><button v-for="c in LABEL_COLORS" :key="c" :data-color="c" :aria-label="`标签颜色 ${c}`" :aria-pressed="color===c" type="button" @click="color=c">{{color===c?'✓':''}}</button></div><button type="submit">打印标签</button></form>
 <p v-if="!state.containers?.length" class="storage-npc-note">箱包从来访卖家处购入。不同款式的外形、内部格子与价格各不相同。</p><div class="storage-section-label"><span>其他位置的物品</span><small>{{others.length}}</small></div><div class="container-goods"><button v-for="o in others" :key="o.id" :data-source-item="o.id" :aria-pressed="picked===o.id" @pointerdown="startDrag($event,o)" @click="select(o)"><StorageArt v-if="isContainer(o)" :kind="storageStyle(o.styleId).art"/><Art v-else :id="o.definitionId"/><span>{{title(o)}}<small>{{where(o)}}</small></span></button></div></aside></div>
 <Teleport to="body"><div v-if="dragging&&held" class="storage-drag-ghost" :style="{left:pointer.x+'px',top:pointer.y+'px'}"><StorageArt v-if="isContainer(held)" :kind="storageStyle(held.styleId).art"/><Art v-else :id="held.definitionId"/></div></Teleport>
 </section>
</template>
<style src="./storage-room.css"></style>
