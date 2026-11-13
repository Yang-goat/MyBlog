<script setup lang="ts">
import { computed, ref } from 'vue';
import { EQUIPMENT } from '../content';
import { applyAction, equipmentPrice, skillEffect } from '../game/engine';
import { state, dispatch } from './store';
import Art from './Art.vue';
const type=ref('tool'),count=ref(1);
const offers=computed(()=>EQUIPMENT.filter(e=>e.type===type.value).map(e=>{
 const quantity=e.type==='material'?count.value:1;
 const action={type:'buyEquipment' as const,equipmentId:e.id,count:quantity};
 const preview=applyAction(state.value,action),owned=state.value.equipment[e.id]??0;
 const complete=e.type==='tool'?owned>0:e.type==='facility'&&owned>=(e.effect==='storage'?3:e.effect==='bench'?2:1);
 return{...e,action,owned,complete,price:equipmentPrice(state.value,e,quantity),available:preview.ok,reason:preview.ok?'':preview.events[0]?.text};
}));
</script>
<template>
 <section class="supply-shop">
  <div class="panel-heading"><p class="eyebrow">SUPPLIES / 好工具，陪你久一点</p><h2>工具与设施采购</h2><p>工具扩展检测与维修能力，设施改善库存与陈列。取得的维修工具会摆上工作台。</p></div>
  <div class="supply-wallet"><span>可用现金 <b>₡{{state.cash.toLocaleString()}}</b></span><small>选定后直接采购，自动保存</small></div>
  <div class="tab-row"><button :class="{active:type==='tool'}" @click="type='tool'">六件工具</button><button :class="{active:type==='material'}" @click="type='material'">六类耗材</button><button :class="{active:type==='facility'}" @click="type='facility'">四类设施</button></div>
  <div v-if="type==='material'" class="supply-quantities"><label>每次采购 <select v-model.number="count" aria-label="耗材采购数量"><option :value="1">1 份</option><option :value="5">5 份</option><option :value="10">10 份</option></select></label><span v-if="skillEffect(state,'restock')">快捷补货优惠 {{Math.round(skillEffect(state,'restock')*100)}}% 已计入价格</span><p>自有旧货翻新先用库存耗材；客户委托使用工单专用材料款。保鲜包从库存消耗。</p></div>
  <div class="equipment-grid"><article v-for="eq in offers" :key="eq.id" :data-equipment="eq.id" :class="{installed:eq.complete}"><Art :id="eq.id" :label="eq.name"/><div><span class="eyebrow">{{eq.complete?'已配置 ✓':'持有 '+eq.owned}}{{eq.type==='facility'?' · '+eq.owned+' 级':''}}</span><h3>{{eq.name}}</h3><p>{{eq.description}}</p><button :disabled="!eq.available" @click="dispatch(eq.action)">{{eq.complete?(eq.type==='tool'?'已拥有':'已达上限'):`采购${eq.type==='material'?' × '+count:''} · ₡${eq.price}`}}</button><small v-if="!eq.available&&!eq.complete" class="supply-unavailable">{{eq.reason}}</small><small v-else-if="eq.available" class="supply-after">购后现金 ₡{{(state.cash-eq.price).toLocaleString()}}</small></div></article></div>
 </section>
</template>
<style scoped>
.supply-wallet{display:flex;align-items:baseline;justify-content:space-between;gap:15px;margin-bottom:20px;font-size:13px;color:#b9ccb6}.supply-wallet b{font-size:22px;color:#dbd4ae;font-weight:400;margin-left:8px;font-variant-numeric:tabular-nums}.supply-wallet small{font-size:10px;color:#849e8d}.supply-quantities{padding:14px 18px;background:#193934;border-left:2px solid #9fb582;margin:-4px 0 20px;font-size:12px}.supply-quantities label{display:inline-flex;align-items:center;gap:10px}.supply-quantities select{padding:5px 9px;font-size:12px;width:95px}.supply-quantities span{margin-left:18px;color:#b8cf9b}.supply-quantities p{font-size:11px;color:#9db5a2;margin:9px 0 0}.supply-unavailable,.supply-after{display:block;font-size:10px;margin-top:9px;line-height:1.7}.supply-unavailable{color:#dbb688}.supply-after{color:#98ad93}.equipment-grid article.installed{border-color:#587456;background:#1c3430}.installed .eyebrow{color:#bed1a1}.equipment-grid button:disabled{opacity:.7;cursor:default}.equipment-grid article>div{min-width:0}.equipment-grid article{gap:12px}.equipment-grid p{line-height:1.8}
@media(max-height:480px){.supply-wallet{margin-bottom:12px}.equipment-grid{gap:18px}.equipment-grid article{padding:14px}.equipment-grid img{width:84px;height:105px}.supply-wallet small{display:none}}
</style>
