<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import { ITEMS, FAULTS } from '../content';
import { state, selectedOrder, dispatch, modal, openGuide } from './store';
import type { Operation } from '../game/types';
import BenchScene from '../scenes/BenchScene.vue';
import RepairRig from './RepairRig.vue';
import RepairEstimate from './RepairEstimate.vue';
import { repairPlan } from '../game/repair-plan';
import { calibrationTolerance } from '../game/engine';
const order = computed(() => state.value.orders.find(o => o.id === selectedOrder.value));
const item = computed(() => state.value.items.find(i => i.id === order.value?.itemId));
const definition = computed(() => ITEMS.find(d => d.id === item.value?.definitionId));
const faults = computed(() => order.value?.diagnosed ? FAULTS.filter(f => item.value?.faults.includes(f.id)) : []);
const mode = ref<'hands'|'parameters'>('hands');
const faultId = ref('');
const activeFault = computed(() => faults.value.find(f=>f.id===faultId.value)??faults.value[0]);
const preserve = ref(false);
const operation = ref<Operation>('clean'); const module = ref(''); const value = ref(50);
const modules = [...new Set(FAULTS.map(f => f.module))];
const moduleNames: Record<string, string> = { contacts: '接点', power: '供电板', clock: '时钟', drive: '驱动单元', insulation: '绝缘套', neural: '神经接口', optic: '光学通道', feedback: '反馈回路', mechanism: '机械传动', oscillator: '模拟振荡器' };
const labels = { clean: '清洁接点', replace: '替换模块', calibrate: '参数校准' };
watch(() => order.value?.id, () => { operation.value = 'clean'; module.value = modules[0] ?? ''; value.value = 50; preserve.value=false; faultId.value=''; }, { immediate: true });
const action=computed(()=>({type:'repair' as const,orderId:order.value?.id??'',operation:faults.value.length?operation.value:'clean' as Operation,module:module.value,value:value.value,preserve:preserve.value}));
const plan=computed(()=>repairPlan(state.value,action.value));
function repair() { if (order.value) dispatch(action.value); }
function deliver() { if (order.value && dispatch({ type: 'deliver', orderId: order.value.id })) modal.value = 'orders'; }
</script>

<template>
  <div v-if="order && item" class="workbench-layout">
    <section class="bench-visual"><BenchScene :item-id="item.definitionId" :diagnosed="order.diagnosed" :fault-count="faults.length" :verified="order.verified" :equipment="state.equipment"/><p class="eyebrow bench-label">WORKBENCH / 修复台</p><div class="bench-info"><h2>{{ definition?.name }}</h2><p>{{ order.preserveOriginal ? '保留原貌' : '恢复功能' }}</p><span>{{ item.owner === 'customer' ? '客户寄存物' : '自有旧货' }} · 外观 {{ order.diagnosed || item.known.includes('basic') ? item.condition + '%' : '待检测' }} · 原貌 {{ item.known.includes('serial') ? item.originality + '%' : '待核验' }}</span></div></section>
    <section class="bench-controls"><p class="eyebrow">REPAIR FILE / {{ order.id }}</p><h2>维修工单 <button class="bench-guide" @click="openGuide('repair')">维修教程 ?</button></h2><p>{{ order.description }}</p><div class="repair-steps"><span :class="{ done: order.diagnosed }">01 检测</span><span :class="{ done: order.diagnosed && !faults.length }">02 修复</span><span :class="{ done: order.verified }">03 复检</span><span>04 交付</span></div>
      <div v-if="state.tutorial && !state.tutorial.skipped && state.tutorial.step >= 4 && state.tutorial.step <= 5" class="bench-tutorial"><strong>林桥的提醒</strong><p>{{ !order.diagnosed ? '先连接检测仪，确定故障。不要仅凭外观选择工序。' : faults.length ? '按检测结果清洁接点、拆装模块或校准信号。也可切换参数操作，最后点击执行工序。下方会显示修复结果。' : !order.verified ? '故障已排除。点击通电复检，确认能正常工作。' : '复检通过，交付并结算。回到店里后呼叫下一位，练习收购和入库。' }}</p></div>
      <div class="bench-budget"><span>剩余工时 <b>{{ state.hours }}</b></span><span>专用材料款 <b>₡{{ order.escrow }}</b></span></div>
      <button v-if="!order.diagnosed" class="primary wide" @click="dispatch({ type: 'diagnose', orderId: order.id })">连接检测仪 →</button>
      <template v-else>
        <div class="diagnosis"><p v-if="!faults.length">故障已排除</p><div v-for="fault in faults" :key="fault.id"><strong>{{ fault.name }}</strong><p>{{ fault.symptom }}</p><span>建议：{{ labels[fault.operation] }} / {{ moduleNames[fault.module] ?? fault.module }}<template v-if="fault.operation === 'calibrate'"> / 目标 {{ fault.target }}</template></span></div></div>
        <template v-if="faults.length"><div class="repair-mode"><button :class="{active:mode === 'hands'}" @click="mode = 'hands'">动手维修</button><button :class="{active:mode === 'parameters'}" @click="mode = 'parameters'">参数操作</button></div><div v-if="faults.length > 1" class="fault-tabs"><button v-for="fault in faults" :key="fault.id" :class="{active:activeFault?.id === fault.id}" @click="faultId = fault.id">{{fault.name}}</button></div><RepairRig v-if="mode === 'hands' && activeFault" :fault="activeFault" :order-id="order.id" :antique="definition?.category === 'antique'"/><template v-else><label class="field-label">选择工序<select v-model="operation" aria-label="维修工序"><option value="clean">清洁接点</option><option value="replace">替换故障模块</option><option value="calibrate">根据读数校准</option></select></label><label class="field-label">操作位置<select v-model="module" aria-label="维修模块"><option v-for="m in modules" :key="m" :value="m">{{ moduleNames[m] ?? m }}</option></select></label><label v-if="operation === 'calibrate'" class="field-label">校准参数：{{ value }}<input v-model.number="value" type="range" min="0" max="100" aria-label="校准读数" /><input v-model.number="value" type="number" min="0" max="100" aria-label="精确校准参数" /><small>允许误差 ±{{calibrationTolerance(state)}}</small></label><label v-if="definition?.category === 'antique' && operation === 'replace'" class="check-row"><input v-model="preserve" type="checkbox" /> 修整原件（多 1 工时，保留原貌）</label><RepairEstimate :plan="plan"/><div class="actions"><button class="primary grow" :disabled="!plan.ok" @click="repair()">执行工序</button></div></template></template>
        <template v-else><RepairEstimate v-if="order.completedOps===0" :plan="plan"/><div class="actions"><button v-if="order.completedOps === 0" class="primary grow" :disabled="!plan.ok" @click="repair()">清洁表面并恢复品相</button><button v-else-if="!order.verified" class="primary grow" @click="dispatch({ type: 'verify', orderId: order.id })">通电复检</button><button v-else class="primary grow" @click="deliver">{{ order.kind === 'own' ? '完成翻新并入库' : order.kind === 'exam' ? '提交考核' : '交付并结算' }} →</button></div></template>
      </template>
      <details v-if="order.steps?.length" class="bench-work-log"><summary>已做工序 · {{order.steps.length}} 条记录</summary><p v-for="(step,index) in order.steps" :key="index">第 {{step.day}} 日 · {{labels[step.operation]}} · {{step.hours}} 工时<br/><span>{{step.result==='miss'?'未解决，继续检查':step.faultId?(FAULTS.find(f=>f.id===step.faultId)?.name+'已处理'):'表面整理完成'}}{{step.preserve?' · 修整原件':''}}</span></p></details>
    </section>
  </div>
  <div v-else class="dialog-body"><h2>选择一个工单</h2><button @click="modal = 'orders'">返回维修委托</button></div>
</template>
<style scoped>.bench-guide{float:right;background:none;border:0;font-size:10px;color:#9abaad;padding:8px 0;}.bench-work-log{margin-top:20px;border-top:1px solid #476454;padding-top:12px;font-size:11px;color:#a3b99d}.bench-work-log summary{cursor:pointer}.bench-work-log p{margin-top:12px;line-height:1.7;font-size:10px}.bench-work-log span{color:#7f9c88}</style>
