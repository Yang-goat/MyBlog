<script setup lang="ts">
import {computed} from 'vue';
import {state,openDelivery} from './store';
import {activeDeliveries,deliveryDefinition,deliveryReadyCount,DELIVERY_HOURS} from '../game/deliveries';
const due=computed(()=>activeDeliveries(state.value).filter(j=>j.deadline===state.value.day).map(job=>({job,request:deliveryDefinition(job),ready:deliveryReadyCount(state.value,job)})));
</script>
<template><section v-if="due.length" class="delivery-closing" aria-label="今晚截止的订货"><h3>今晚截止 · {{due.length}} 份订货</h3><div v-for="entry in due" :key="entry.job.id"><button :aria-label="`查看订货 ${entry.request.title}`" @click="openDelivery(entry.job.id)">{{entry.request.title}} ↗</button><small>货架可交 {{Math.min(entry.ready,entry.request.quantity)}} / {{entry.request.quantity}} 件 · {{state.hours<DELIVERY_HOURS?'工时已不足，今天无法打包':'交货用时 0.5 h'}}</small></div><p>闭店后过期，未交货品保留。</p></section></template>
<style scoped>.delivery-closing{border-left:2px solid #c6aa70;background:#3d3d2d;padding:12px 14px;margin:12px 0;color:#e3d5b2}.delivery-closing h3{font-size:14px;margin:0 0 8px}.delivery-closing div+div{margin-top:8px}.delivery-closing button{padding:3px 0;background:transparent;border:0;border-bottom:1px solid #a69e77;font-size:12px;color:#e1d7b5;text-align:left}.delivery-closing small{display:block;font-size:11px;margin-top:5px;color:#d3ccad}.delivery-closing p{font-size:11px;margin:10px 0 0;color:#c5c4a8}</style>
