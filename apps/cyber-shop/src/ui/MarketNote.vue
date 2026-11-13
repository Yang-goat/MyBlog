<script setup lang="ts">
import { computed } from 'vue';
import { CATEGORIES, EVENTS } from '../content';
import { state, modal } from './store';
const event=computed(()=>EVENTS.find(e=>e.id===state.value.eventId));
const change=computed(()=>Math.round(((event.value?.multiplier??1)-1)*100));
</script>
<template>
 <button v-if="event" class="market-note" aria-label="查看今日街区行情" @click="modal='journal'">
  <small>九街通讯 · 第 {{state.day}} 日</small><strong>{{event.name}}</strong>
  <span class="market-price" :class="{down:change<0}">{{CATEGORIES.find(c=>c.id===event!.category)?.name}} {{change>=0?'↑ +':'↓ '}}{{change}}%</span>
  <span class="market-action">{{state.eventResolved?'已记下今天的选择':'有一条街区消息'}} ↗</span>
 </button>
</template>
