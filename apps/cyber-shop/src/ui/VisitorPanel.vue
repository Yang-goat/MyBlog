<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import { ITEMS, CHARACTERS, CATEGORIES } from '../content';
import { state, dispatch, modal, selectedOrder } from './store';
import Art from './Art.vue';
import ItemKnowledge from './ItemKnowledge.vue';
import { tradeQuote, skillEffect } from '../game/engine';
const knowledgeNames: Record<string, string> = { basic: '基础检查', scan: '多谱扫描', serial: '来源核验', batch: '批次记录', diagnosed: '故障诊断', restored: '修复复检' };
const visitor = computed(() => state.value.visitors[state.value.visitorIndex]);
const person = computed(() => CHARACTERS.find(c => c.id === visitor.value?.characterId));
const definition = computed(() => ITEMS.find(d => d.id === visitor.value?.item?.definitionId));
const candidates = computed(() => state.value.items.filter(i => i.owner === 'player' && i.location === 'stock' && ITEMS.find(d => d.id === i.definitionId)?.category === visitor.value?.category));
const choice = ref(''); const amount = ref(0);
const quote = computed(() => visitor.value ? tradeQuote(state.value, visitor.value, state.value.items.find(i => i.id === choice.value)) : 0);
watch(() => visitor.value?.id, () => { choice.value = candidates.value[0]?.id ?? ''; amount.value = visitor.value?.quote ?? 0; }, { immediate: true });
watch(quote, value => amount.value = value);
function acceptRepair() { if (dispatch({ type: 'acceptRepair', visitorId: visitor.value?.id })) { selectedOrder.value = state.value.orders.filter(o => !o.delivered).at(-1)?.id ?? ''; modal.value = 'workbench'; } }
</script>

<template>
  <div v-if="visitor && !visitor.resolved" class="visitor-panel">
    <div class="visitor-heading"><div><p class="eyebrow">{{ person?.role }}</p><h2>{{ person?.name }}</h2></div><span class="visit-type">{{ visitor.kind === 'seller' ? '带货来访' : visitor.kind === 'buyer' ? '寻找旧物' : '送修委托' }}</span></div>
    <p class="dialogue">“{{ visitor.request }}”</p>
    <div v-if="visitor.item" class="counter-item"><Art :id="visitor.item.definitionId" :label="definition?.name" eager /><div><span class="eyebrow">{{ CATEGORIES.find(c => c.id === definition?.category)?.name }}</span><h3>{{ definition?.name }}</h3><p>{{ definition?.description }}</p></div></div>
    <template v-if="visitor.kind === 'seller' && visitor.item">
      <div class="item-clues"><span>外观 {{ visitor.item.known.includes('basic') ? visitor.item.condition + '%' : '待检查' }}</span><span>占用 {{ definition?.size }} 格</span><span v-if="definition?.regulated">需交易许可</span></div>
      <p v-if="visitor.item.known.length" class="inspection-note">已检查：{{ visitor.item.known.map(k => knowledgeNames[k] ?? k).join(' / ') }}<span v-if="visitor.item.known.includes('serial')"> · {{ visitor.item.authentic ? '来源吻合' : '来源存疑' }}</span></p>
      <ItemKnowledge :item="visitor.item" /><div class="actions compact"><button @click="dispatch({ type: 'inspect', visitorId: visitor.id, method: 'basic' })">基础检查</button><button @click="dispatch({ type: 'inspect', visitorId: visitor.id, method: 'scan' })">多谱扫描</button><button @click="dispatch({ type: 'inspect', visitorId: visitor.id, method: 'serial' })">查序列</button></div>
    </template>
    <template v-if="visitor.kind === 'buyer'">
      <p>想买：{{ CATEGORIES.find(c => c.id === visitor.category)?.name }}</p>
      <select v-model="choice" aria-label="选择售出物品"><option value="">选择货架上的物品</option><option v-for="item in candidates" :key="item.id" :value="item.id">{{ ITEMS.find(d => d.id === item.definitionId)?.name }} · 成本 ₡{{ item.cost }}</option></select>
      <p v-if="!candidates.length" class="small muted">货架上没有匹配商品。展柜中的藏品不会参与普通售卖。</p>
    </template>
    <template v-if="visitor.kind !== 'repair'">
      <div class="quote-line"><span>{{ visitor.kind === 'seller' ? '客人要价' : '客人报价' }}</span><strong>₡ {{ quote }}</strong></div>
      <div class="bargain-row"><input v-model.number="amount" type="number" min="1" aria-label="议价金额" /><button :disabled="visitor.rounds >= visitor.patience || (visitor.kind === 'buyer' && !choice)" @click="dispatch({ type: 'offer', visitorId: visitor.id, amount, itemId: choice || undefined })">报价并成交</button></div>
      <p class="small muted">可议价 {{ Math.max(0, visitor.patience - visitor.rounds) }} 轮 · {{ person?.bargain }}</p>
      <div class="actions"><button class="primary grow" :disabled="visitor.kind === 'buyer' && !choice" @click="dispatch({ type: 'acceptTrade', visitorId: visitor.id, itemId: choice || undefined })">{{ visitor.kind === 'seller' ? '收下这件货' : '成交并交货' }} →</button><button @click="dispatch({ type: 'reject', visitorId: visitor.id })">婉拒</button></div>
    </template>
    <template v-else><p class="small muted">接单后进行检测，材料预付款随工单保管。按流程复检交付后结算服务费。</p><div class="actions"><button class="primary grow" @click="acceptRepair">接下维修 →</button><button @click="dispatch({ type: 'reject', visitorId: visitor.id })">婉拒</button></div></template>
  </div>
  <div v-else class="visitor-empty"><p class="eyebrow">柜台暂时安静</p><h2>{{ state.visitorIndex < state.visitors.length - 1 ? '下一位，请进。' : '街灯亮起来了。' }}</h2><p>{{ state.visitorIndex < state.visitors.length - 1 ? '把这笔交易写进账本，准备迎接下一段故事。' : '今天的来访已经结束。还可以处理工单、整理收藏，或收起招牌。' }}</p><button v-if="state.visitorIndex < state.visitors.length - 1" class="primary wide" @click="dispatch({ type: 'nextVisitor' })">迎接下一位 →</button><button v-else class="primary wide" @click="modal = 'close-day'">准备闭店 →</button><button class="text-button" @click="modal = 'orders'">查看工单与基础援助维修</button></div>
<div v-if="skillEffect(state, 'supplyPreview')" class="upcoming"><p class="eyebrow">供货预告</p><span v-for="v in state.visitors.slice(state.visitorIndex + 1)" :key="v.id">{{ v.kind === 'seller' ? '供货' : v.kind === 'repair' ? '送修' : '求购' }} · {{ CATEGORIES.find(c => c.id === v.category)?.name }}</span></div>
</template>
