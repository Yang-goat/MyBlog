<script setup lang="ts">
import { computed, ref } from 'vue';
import { ITEMS } from '../content';
import { RECIPES } from '../content/fabrication';
import { deliveryDefinition, nextFabricationCommission } from '../game/deliveries';
import { fabricationPlan, FABRICATION_METHODS, materialInStock, materialReading } from '../game/fabrication';
import { rootCapacity } from '../game/engine';
import type { FabricationMethod, ItemInstance } from '../game/types';
import { dispatch, modal, openDelivery, openGuide, selectedItem, state } from './store';
import Art from './Art.vue';

const commission = computed(() => nextFabricationCommission(state.value));
const request = computed(() => commission.value ? deliveryDefinition(commission.value) : undefined);
const recipeId = ref(request.value?.fabricated ?? RECIPES[0]!.id);
const method = ref<FabricationMethod>('standard');
const choices = ref<Record<string,string>>({});
const productId = ref('');
const recipe = computed(() => RECIPES.find(candidate => candidate.id === recipeId.value)!);
const target = computed(() => request.value?.fabricated === recipeId.value ? request.value.condition : 0);
const product = computed(() => state.value.items.find(item => item.id === productId.value));
const name = (id: string) => ITEMS.find(item => item.id === id)?.name ?? id;
const slots = computed(() => recipe.value.inputs.map(definitionId => {
  const items = state.value.items.filter(item => item.definitionId === definitionId && materialInStock(state.value,item))
    .sort((a,b) => (materialReading(b) ?? -1) - (materialReading(a) ?? -1) || a.cost - b.cost);
  return {definitionId,items,selected:items.find(item => item.id === choices.value[definitionId]) ?? items[0]};
}));
const itemIds = computed(() => slots.value.flatMap(slot => slot.selected ? [slot.selected.id] : []));
const plans = computed(() => (Object.keys(FABRICATION_METHODS) as FabricationMethod[]).map(id => ({
  id,
  ...FABRICATION_METHODS[id],
  plan:fabricationPlan(state.value,recipeId.value,id,itemIds.value,rootCapacity(state.value)),
})));
const current = computed(() => plans.value.find(option => option.id === method.value)!.plan);
function fabrication(id: string) {
  recipeId.value = id;
  choices.value = {};
  productId.value = '';
}
function inspection(item: ItemInstance) {
  const basic = item.known.some(value => value === 'basic' || value === 'diagnosed');
  dispatch({type:'inspect',itemId:item.id,method:basic?'scan':'basic'});
}
function make() {
  if (dispatch({type:'fabricate',recipeId:recipeId.value,method:method.value,itemIds:itemIds.value})) {
    productId.value = state.value.items.at(-1)?.id ?? '';
  }
}
function showProduct() {
  selectedItem.value = productId.value;
  modal.value = 'inventory';
}
</script>

<template>
  <section class="fabrication-bench" aria-label="合成工位">
    <header class="panel-heading">
      <h2>合成工位</h2>
      <div class="actions compact">
        <button v-if="commission" class="text-button" @click="openDelivery(commission.id)">工匠委托 ↗</button>
        <button class="text-button" @click="openGuide('repair')">工位手册 ↗</button>
      </div>
    </header>
    <div class="recipe-tabs" role="group" aria-label="选择配方">
      <button v-for="entry in RECIPES" :key="entry.id" :aria-pressed="entry.id === recipeId" :data-recipe="entry.id" @click="fabrication(entry.id)">{{ name(entry.output) }}</button>
    </div>
    <div class="fabrication-layout">
      <div class="assembly-preview">
        <Art :id="recipe.output" :label="name(recipe.output)" eager />
        <h3>{{ name(recipe.output) }}</h3>
        <p v-if="target">委托验收 ≥ {{ target }}%</p>
        <p v-if="product" class="fabrication-ready">✓ 已入主仓 · {{ product.condition }}%</p>
        <button v-if="product" class="text-button" @click="showProduct">查看这件成品 ↗</button>
      </div>
      <div class="assembly-controls">
        <div v-for="slot in slots" :key="slot.definitionId" class="material-slot" :data-material="slot.definitionId">
          <Art :id="slot.definitionId" eager />
          <div>
            <label :for="'material-'+slot.definitionId">{{ name(slot.definitionId) }}</label>
            <select v-if="slot.items.length" :id="'material-'+slot.definitionId" :value="slot.selected?.id" @change="choices[slot.definitionId] = ($event.target as HTMLSelectElement).value">
              <option v-for="item in slot.items" :key="item.id" :value="item.id">{{ materialReading(item) === null ? '待读数' : '读数 '+materialReading(item)+'%' }} · ₡{{ item.cost }}</option>
            </select>
            <p v-else class="muted">货架缺料</p>
          </div>
          <button v-if="slot.selected && materialReading(slot.selected) === null" :disabled="state.phase !== 'open' || state.hours < .5" @click="inspection(slot.selected)">检查原料</button>
        </div>
        <div class="assembly-options" role="group" aria-label="装配方式">
          <button v-for="option in plans" :key="option.id" :data-fabrication-method="option.id" :aria-pressed="option.id === method" @click="method = option.id">
            <strong>{{ option.name }}</strong>
            <small>{{ recipe.hours+option.extraHours }} h · 加工费 ₡{{ recipe.fee+option.extraFee }}</small>
            <small v-if="'quality' in option.plan">品相 {{ option.plan.quality }}%</small>
          </button>
        </div>
        <p v-if="'quality' in current" class="assembly-total" aria-live="polite">
          成品累计成本 ₡{{ current.materialCost+current.fee }}
          <span v-if="current.quality < target" class="warning"> · 未达委托验收</span>
        </p>
        <p v-if="current.reason" class="assembly-reason" aria-live="polite">{{ current.reason }}</p>
        <button v-if="!state.equipment.scanner" @click="modal = 'equipment'">查看工具采购 ↗</button>
        <button v-else class="primary wide" :disabled="!current.ok" @click="make">确认装配 →</button>
      </div>
    </div>
  </section>
</template>

<style scoped>
.fabrication-bench{padding:32px 36px}
.fabrication-bench .panel-heading{display:flex;align-items:center;justify-content:space-between;gap:12px;padding-right:36px}
.recipe-tabs,.assembly-options{display:flex;gap:8px;flex-wrap:wrap;margin:16px 0}
.recipe-tabs button,.assembly-options button{min-height:44px;text-align:left}
.assembly-options button{flex:1;min-width:110px}
.assembly-options :is(strong,small){display:block}
.assembly-options small{margin-top:5px;color:var(--muted)}
.fabrication-layout{display:grid;grid-template-columns:minmax(0,.8fr) minmax(0,1fr);gap:20px}
.assembly-preview{padding:14px;text-align:center;border:1px solid var(--line);background:
 linear-gradient(90deg,#84b1bc19 1px,transparent 1px) 0 0/24px 24px,
 linear-gradient(#84b1bc19 1px,transparent 1px) 0 0/24px 24px,
 radial-gradient(ellipse at 50% 36%,#263f4a,#091a24 75%)}
.assembly-preview img{display:block;width:min(100%,300px);height:clamp(120px,26vh,260px);object-fit:contain;margin:auto;filter:drop-shadow(4px 10px 10px #01070d)}
.assembly-preview :is(h3,p){margin:6px 0}
.assembly-preview p,.fabrication-ready{font-size:12px;color:var(--accent)}
.assembly-controls{min-width:0}
.material-slot{display:grid;grid-template-columns:44px minmax(0,1fr) auto;align-items:center;gap:10px;padding:8px;margin-bottom:8px;border:1px solid var(--line);background:#122732}
.material-slot img{width:44px;height:46px;object-fit:contain}
.material-slot label{display:block;margin:0 0 4px;color:#e9f0ef}
.material-slot select{width:100%;min-height:36px}
.assembly-total,.assembly-reason{margin:8px 0;font-size:13px;line-height:1.5}
.assembly-total{color:var(--warm);font-variant-numeric:tabular-nums}
@media(max-height:460px){.fabrication-bench{padding:18px}.fabrication-bench .panel-heading h2{font-size:22px}.recipe-tabs,.assembly-options{margin:9px 0}.fabrication-layout{gap:10px}.material-slot{padding:5px;gap:5px}}
@media(pointer:coarse){.material-slot :is(select,button),.assembly-controls>.primary{min-height:44px}}
</style>
