<script setup lang="ts">
import {computed} from 'vue';
import {state,modal} from './store';
import {foodOverview} from '../game/freshness';
import {stockView} from './inventory-navigation';
const food=computed(()=>foodOverview(state.value));
function openStock(){Object.assign(stockView,{query:'',category:'food',status:'all',order:'oldest'});modal.value='inventory';}
</script>
<template><section v-if="food.unknown||food.expired||food.expiresOvernight||food.cooled" class="food-forecast" aria-label="食品过夜预览"><h3>食品过夜</h3><p v-if="food.expiresOvernight" class="food-due">{{food.expiresOvernight}} 件明日开店时过期</p><p v-if="food.expired">{{food.expired}} 件已过期 · 无法再保鲜</p><p v-if="food.cooled">冷藏柜本夜延长 {{food.cooled}} 件的保存期</p><p v-if="food.unknown">{{food.unknown}} 件日期待检查</p><button @click="openStock">查看食品库存 ↗</button></section></template>
<style scoped>.food-forecast{padding:12px 14px;margin:12px 0;background:#233c38;border-left:2px solid #a2b596}.food-forecast h3{font-size:14px;margin:0 0 8px}.food-forecast p{font-size:12px;margin:6px 0;line-height:1.5}.food-forecast .food-due{color:#ecd29a}.food-forecast button{font-size:12px;margin-top:7px;padding:6px 9px}</style>
