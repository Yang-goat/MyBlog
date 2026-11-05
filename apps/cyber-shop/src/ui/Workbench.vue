<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import { ITEMS, FAULTS } from '../content';
import { state, selectedOrder, dispatch, modal } from './store';
import type { Operation } from '../game/types';
import Art from './Art.vue';
const order = computed(() => state.value.orders.find(o => o.id === selectedOrder.value));
const item = computed(() => state.value.items.find(i => i.id === order.value?.itemId));
const definition = computed(() => ITEMS.find(d => d.id === item.value?.definitionId));
const faults = computed(() => order.value?.diagnosed ? FAULTS.filter(f => item.value?.faults.includes(f.id)) : []);
const preserve = ref(false);
const operation = ref<Operation>('clean'); const module = ref(''); const value = ref(50);
const modules = [...new Set(FAULTS.map(f => f.module))];
const moduleNames: Record<string, string> = { contacts: '接点', power: '供电板', clock: '时钟', drive: '驱动单元', insulation: '绝缘套', neural: '神经接口', optic: '光学通道', feedback: '反馈回路', mechanism: '机械传动', oscillator: '模拟振荡器' };
const labels = { clean: '清洁接点', replace: '替换模块', calibrate: '参数校准' };
watch(() => order.value?.id, () => { operation.value = 'clean'; module.value = modules[0] ?? ''; value.value = 50; }, { immediate: true });
function repair(quick = false) { if (order.value) dispatch({ type: 'repair', orderId: order.value.id, operation: operation.value, module: module.value, value: value.value, quick, preserve: preserve.value }); }
function deliver() { if (order.value && dispatch({ type: 'deliver', orderId: order.value.id })) modal.value = 'orders'; }
</script>

<template>
  <div v-if="order && item" class="workbench-layout">
    <section class="bench-visual"><Art id="scene-workbench" class="bench-background" eager /><div class="bench-shade"></div><p class="eyebrow bench-label">WORKBENCH / 手艺让旧物继续运转</p><Art :id="item.definitionId" :label="definition?.name" class="bench-object" eager /><div class="bench-info"><h2>{{ definition?.name }}</h2><p>{{ order.preserveOriginal ? '原貌保存委托 · 更换原件会降低原貌价值' : '恢复功能 · 检测后选择正确工序' }}</p><span>{{ item.owner === 'customer' ? '客户寄存物' : '自有旧货' }} · 外观 {{ order.diagnosed || item.known.includes('basic') ? item.condition + '%' : '待检测' }} · 原貌 {{ item.known.includes('serial') ? item.originality + '%' : '待核验' }}</span></div></section>
    <section class="bench-controls"><p class="eyebrow">REPAIR FILE / {{ order.id }}</p><h2>从读数开始。</h2><p>{{ order.description }}</p><div class="repair-steps"><span :class="{ done: order.diagnosed }">01 检测</span><span :class="{ done: order.diagnosed && !faults.length }">02 修复</span><span :class="{ done: order.verified }">03 复检</span><span>04 交付</span></div>
      <div class="bench-budget"><span>剩余工时 <b>{{ state.hours }}</b></span><span>专用材料款 <b>₡{{ order.escrow }}</b></span></div>
      <button v-if="!order.diagnosed" class="primary wide" @click="dispatch({ type: 'diagnose', orderId: order.id })">连接检测仪 →</button>
      <template v-else>
        <div class="diagnosis"><p v-if="!faults.length">所有故障已排除。请复检后交付。</p><div v-for="fault in faults" :key="fault.id"><strong>{{ fault.name }}</strong><p>{{ fault.symptom }}</p><span>建议：{{ labels[fault.operation] }} / {{ moduleNames[fault.module] ?? fault.module }}<template v-if="fault.operation === 'calibrate'"> / 目标 {{ fault.target }}</template></span></div></div>
        <template v-if="faults.length"><label class="field-label">选择工序<select v-model="operation" aria-label="维修工序"><option value="clean">清洁接点</option><option value="replace">替换故障模块</option><option value="calibrate">根据读数校准</option></select></label><label class="field-label">操作位置<select v-model="module" aria-label="维修模块"><option v-for="m in modules" :key="m" :value="m">{{ moduleNames[m] ?? m }}</option></select></label><label v-if="operation === 'calibrate'" class="field-label">校准参数：{{ value }}<input v-model.number="value" type="range" min="0" max="100" aria-label="校准读数" /><input v-model.number="value" type="number" min="0" max="100" aria-label="精确校准参数" /></label><label v-if="definition?.category === 'antique' && operation === 'replace'" class="check-row"><input v-model="preserve" type="checkbox" /> 修整原件（多 1 工时，保留原貌）</label><div class="actions"><button class="primary grow" @click="repair()">执行工序</button><button @click="repair(true)">熟练快捷工序</button></div><p class="small muted">工序耗材按故障类型结算。错误操作只消耗明确的工时或材料，不会随机毁坏物品。</p></template>
        <div v-else class="actions"><button v-if="order.completedOps === 0" class="primary grow" @click="operation = 'clean'; repair()">清洁表面并恢复品相</button><button v-else-if="!order.verified" class="primary grow" @click="dispatch({ type: 'verify', orderId: order.id })">通电复检</button><button v-else class="primary grow" @click="deliver">{{ order.kind === 'own' ? '完成翻新并入库' : order.kind === 'exam' ? '提交考核' : '交付并结算' }} →</button></div>
      </template>
    </section>
  </div>
  <div v-else class="dialog-body"><h2>选择一个工单</h2><button @click="modal = 'orders'">返回维修委托</button></div>
</template>
