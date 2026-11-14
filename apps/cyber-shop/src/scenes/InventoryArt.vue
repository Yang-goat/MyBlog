<script setup lang="ts">
import {computed} from 'vue';
import Art from '../ui/Art.vue';
import StorageArt from './StorageArt.vue';
import {inventoryCell} from '../ui/inventory-metrics';
import {footprint} from '../game/warehouse';
import {isContainer,type StoredObject} from '../game/containers';
import {storageStyle} from '../content/storage';
import bounds from './inventory-art-bounds.json';
const props=defineProps<{object:StoredObject;rotated?:boolean}>();
const key=computed(()=>isContainer(props.object)?props.object.styleId:props.object.definitionId);
const box=computed(()=>{const f=footprint(props.object);return {width:f.width*inventoryCell.value-2+'px',height:f.height*inventoryCell.value-2+'px',transform:`translate(-50%,-50%) rotate(${props.rotated?90:0}deg)`};});
const crop=computed(()=>{const b=(bounds as Record<string,number[]>)[key.value]??[0,0,1,1];return {width:100/b[2]!+'%',height:100/b[3]!+'%',left:-b[0]!/b[2]!*100+'%',top:-b[1]!/b[3]!*100+'%'};});
</script>
<template><span class="inventory-art" :data-inventory-art="key" :style="box"><StorageArt v-if="isContainer(object)" :kind="storageStyle(object.styleId).art" :style="crop"/><Art v-else :id="object.definitionId" :style="crop" eager/></span></template>
<style scoped>
.inventory-art{position:absolute;left:50%;top:50%;display:block!important;max-width:none!important;max-height:none!important;overflow:hidden;pointer-events:none;line-height:0}.inventory-art :deep(img){position:absolute!important;max-width:none!important;max-height:none!important;min-height:0!important;object-fit:fill!important;transform:none!important;flex:none!important;filter:drop-shadow(1px 1px 1px #0007)!important;pointer-events:none}
</style>
