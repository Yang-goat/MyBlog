<script setup lang="ts">
import { computed } from 'vue';
import type { ItemInstance } from '../game/types';
import { ITEMS } from '../content';
import { estimateValue, skillEffect } from '../game/engine';
import { state } from './store';
const props = defineProps<{ item: ItemInstance }>();
const definition = computed(() => ITEMS.find(d => d.id === props.item.definitionId)!);
const scanned = computed(() => props.item.known.includes('scan') || props.item.known.includes('batch'));
const basic = computed(() => props.item.known.includes('basic') || props.item.known.includes('diagnosed'));
</script>
<template><div class="knowledge-lines"><p v-if="basic">行情估价 ₡{{ estimateValue(state, item).join('–') }}<span v-if="item.known.includes('batch')"> · 批次记录已核对</span></p><p v-if="scanned && definition.category === 'energy'">有效容量 {{ item.capacity }}% · 材料纯度 {{ item.purity }}%</p><p v-if="scanned && definition.category === 'data'">可读完整度 {{ item.integrity }}% · 内容解密需数据专精</p><p v-if="scanned && definition.category === 'neural'">兼容性：{{ item.compatibility }}</p><p v-if="basic && definition.category === 'food'">保质至第 {{ item.expiresDay }} 日{{ item.expiresDay !== null && item.expiresDay - state.day <= 1 ? ' · 临期折价' : '' }}</p><p v-if="item.known.includes('serial')">{{ item.authentic ? '真实原件' : '复刻品' }} · {{ item.provenance }} · 原貌 {{ item.originality }}%</p><p v-if="basic && definition.certificate && skillEffect(state, 'salvageValue')">翻新残值参考 ₡{{ Math.round(definition.price * .7) }}–{{ Math.round(definition.price * 1.1) }}，需计入工序成本。</p></div></template>
