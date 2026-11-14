<script setup lang="ts">
import {computed} from 'vue';
import Art from '../ui/Art.vue';
import ReserveBadge from '../ui/ReserveBadge.vue';
import StorageArt from './StorageArt.vue';
import {inventoryCell} from '../ui/inventory-metrics';
import {footprint,isShaped,turns,occupiedCells} from '../game/warehouse';
import {isContainer,type StoredObject} from '../game/containers';
import {storageStyle} from '../content/storage';
import type {Rotation} from '../game/types';
import {outlinePoints} from '../ui/inventory-shape';
import bounds from './inventory-art-bounds.json';
const props=defineProps<{object:StoredObject;rotated?:Rotation}>();
const key=computed(()=>isContainer(props.object)?props.object.styleId:props.object.definitionId);
const box=computed(()=>{const f=footprint(props.object);return {width:f.width*inventoryCell.value-2+'px',height:f.height*inventoryCell.value-2+'px',transform:`translate(-50%,-50%) rotate(${turns(props.rotated)*90}deg)`};});
const outline=computed(()=>outlinePoints(props.object,props.rotated).map(p=>`${p.x},${p.y}`).join(' '));
const badgeAt=computed(()=>{const first=[...occupiedCells(props.object,props.rotated)].sort((a,b)=>a.y-b.y||a.x-b.x)[0]!;return {position:'absolute' as const,left:first.x*inventoryCell.value+2+'px',top:first.y*inventoryCell.value+2+'px',width:Math.min(16,inventoryCell.value-4)+'px',height:Math.min(16,inventoryCell.value-4)+'px',zIndex:3};});
const extent=computed(()=>{const f=footprint(props.object,props.rotated);return `0 0 ${f.width} ${f.height}`;});
const crop=computed(()=>{const b=(bounds as Record<string,number[]>)[key.value]??[0,0,1,1,1,1],f=footprint(props.object),w=f.width*inventoryCell.value-2,h=f.height*inventoryCell.value-2,iw=b[4]!,ih=b[5]!,scale=Math.min(w/(b[2]!*iw),h/(b[3]!*ih))*(b[6]??1);return {width:iw*scale+'px',height:ih*scale+'px',left:(w-b[2]!*iw*scale)/2-b[0]!*iw*scale+'px',top:(h-b[3]!*ih*scale)/2-b[1]!*ih*scale+'px'};});
</script>
<template><svg v-if="isShaped(object)" class="shape-outline" :viewBox="extent" preserveAspectRatio="none" aria-hidden="true"><polygon :points="outline" fill="#3c657143" stroke="#89b3bb" stroke-width="2" vector-effect="non-scaling-stroke"/></svg><span class="inventory-art" :data-inventory-art="key" :style="box"><StorageArt v-if="isContainer(object)" :kind="storageStyle(object.styleId).art" :style="crop"/><Art v-else :id="object.definitionId" :style="crop" eager/></span><ReserveBadge v-if="!isContainer(object)&&object.reserved" :style="badgeAt"/></template>
<style scoped>
.shape-outline{position:absolute;inset:0;width:100%;height:100%;pointer-events:none}.inventory-art{position:absolute;left:50%;top:50%;display:block!important;max-width:none!important;max-height:none!important;overflow:hidden;pointer-events:none;line-height:0}.inventory-art :deep(img){position:absolute!important;max-width:none!important;max-height:none!important;min-height:0!important;object-fit:contain!important;transform:none!important;flex:none!important;filter:drop-shadow(1px 1px 1px #0007)!important;pointer-events:none}
</style>
