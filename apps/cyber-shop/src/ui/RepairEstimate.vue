<script setup lang="ts">
import type { RepairPlan } from '../game/repair-plan';
defineProps<{plan:RepairPlan}>();
</script>
<template>
 <section class="repair-estimate" aria-label="工序结算预览" :class="{blocked:!plan.ok,miss:plan.miss}">
  <p v-if="!plan.ok" role="status">{{plan.message}}</p>
  <template v-else>
   <header><span>执行本次工序</span><b>{{plan.hours}} 工时</b></header>
   <p v-if="plan.miss">当前设置无法排除已检出的故障；执行仍消耗 {{plan.hours}} 工时。</p>
   <template v-else>
    <p v-if="plan.source==='stock'">取用库存 <strong>{{plan.materialName}} × 1</strong><small>计入物品成本 ₡{{plan.costAdded}} · 本次不扣现金</small></p>
    <p v-else-if="plan.source==='escrow'">{{plan.materialName}} · 材料专款 <strong>₡{{plan.escrow}}</strong><small>从本工单预付款结算</small></p>
    <p v-else-if="plan.source==='cash'">临时补充 {{plan.materialName}}<strong> · 现金 ₡{{plan.cash}}</strong><small>库存不足，按本次费用补充并使用</small></p>
    <p v-else-if="plan.source==='saved'">耗材管理生效 · 使用余料完成<small>本次不取用库存材料，也不扣现金</small></p>
    <p v-if="plan.originalityLoss" class="originality-warning">更换后原貌下降 {{plan.originalityLoss}} 点。修整原件可以保留原貌。</p>
    <p v-for="material in plan.recovered" :key="material.id" class="recycled">部件回收 · {{material.name}} +{{material.count}}</p>
   </template>
  </template>
 </section>
</template>
<style scoped>
.repair-estimate{margin-top:14px;padding:12px 14px;border:1px solid #557360;background:#18372f;color:#c9d4b5}.repair-estimate header{display:flex;justify-content:space-between;gap:15px;align-items:center;font-size:10px;color:#99b69f}.repair-estimate header b{font-weight:400;font-size:15px;color:#dfd1a4}.repair-estimate p{margin:9px 0 0;font-size:12px;line-height:1.7;color:#c3d0b5}.repair-estimate p:first-child{margin-top:0}.repair-estimate strong{font-weight:500;color:#e6ddb4}.repair-estimate small{display:block;font-size:10px;color:#91ad94;margin-top:3px}.repair-estimate .originality-warning,.repair-estimate.miss p{color:#e1ba88}.repair-estimate .recycled{font-size:11px;color:#a9cfac}.repair-estimate.blocked{background:#382c25;border-color:#8b7155}.repair-estimate.blocked p{color:#e2bf91}
</style>
