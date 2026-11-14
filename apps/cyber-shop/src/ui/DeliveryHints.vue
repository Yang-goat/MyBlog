<script setup lang="ts">
import {computed} from 'vue';
import {state,openDelivery} from './store';
import {itemDeliveryHints} from '../game/deliveries';
import type {ItemInstance} from '../game/types';
const props=withDefaults(defineProps<{item:ItemInstance;links?:boolean}>(),{links:true});
const hints=computed(()=>itemDeliveryHints(state.value,props.item));
</script>
<template><section v-if="hints.length" class="delivery-hints" aria-label="这件货的订货用途"><div v-for="hint in hints" :key="hint.job.id" :data-item-delivery="hint.job.templateId"><p><b>{{hint.request.title}}</b><small>{{hint.job.deadline===state.day?'今晚截止':`第 ${hint.job.deadline} 日截止`}}</small></p><p class="hint-check" :class="{ready:hint.check.ready}">{{hint.incoming&&hint.check.ready?'按当前检查符合要求':hint.check.reason}}</p><small>货架可交 {{Math.min(hint.readyCount,hint.request.quantity)}} / {{hint.request.quantity}} 件 · 整单 ₡{{hint.request.reward}}</small><button v-if="links" :aria-label="`查看订货 ${hint.request.title}`" @click="openDelivery(hint.job.id)">查看订货 →</button></div></section></template>
<style scoped>
.delivery-hints{border-top:1px dashed #739b8766;padding-top:8px;margin-top:10px;font-size:11px;color:#c2d0bf}.delivery-hints>div+div{margin-top:10px}.delivery-hints p{font-size:11px;line-height:1.6;margin:0 0 4px;color:inherit}.delivery-hints b{font-weight:500;color:#d8c694}.delivery-hints p>small{margin-left:8px;color:#c1cbb7}.delivery-hints small{font-size:10px;color:#aebfb3}.delivery-hints .hint-check{color:#d1bd9c}.delivery-hints .hint-check.ready{color:#b4d8b4}.delivery-hints button{display:block;background:transparent;border:0;border-bottom:1px solid #779384;color:#c1dac6;font-size:11px;padding:4px 0;margin-top:5px}
</style>
