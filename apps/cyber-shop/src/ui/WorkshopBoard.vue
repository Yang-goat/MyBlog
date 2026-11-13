<script setup lang="ts">
import { computed, ref } from 'vue';
import { CHARACTERS, ITEMS } from '../content';
import { state, modal, selectedOrder, dispatch } from './store';
import RepairArchive from './RepairArchive.vue';
const tab=ref('active'),receipt=ref('');
const orders=computed(()=>state.value.orders.filter(o=>!o.delivered));
const latest=computed(()=>state.value.repairHistory?.at(-1));
const latestName=computed(()=>ITEMS.find(i=>i.id===latest.value?.definitionId)?.name);
const name=(id:string)=>ITEMS.find(d=>d.id===state.value.items.find(i=>i.id===id)?.definitionId)?.name??'旧物';
const person=(id:string)=>id==='player'?'自有旧货':id==='examiner'?'资质考核':CHARACTERS.find(c=>c.id===id)?.name??'街区委托';
function show(id:string){selectedOrder.value=id;modal.value='workbench';}
function showLatest(){if(latest.value){receipt.value=latest.value.orderId;tab.value='archive';}}
</script>
<template>
 <div class="dialog-body workshop-board"><p class="eyebrow">WORKSHOP / 维修委托</p><h2>一件一件修好。</h2><p>客户物品独立保管。材料预付款只能用于这一份工单。</p><div class="tab-row"><button :class="{active:tab==='active'}" @click="tab='active'">在手工单 · {{orders.length}}</button><button :class="{active:tab==='archive'}" @click="tab='archive'">修复档案</button></div>
  <template v-if="tab==='active'"><div class="workshop-aid"><button class="primary" :disabled="state.phase!=='open'" @click="dispatch({type:'acceptRepair'})">接基础援助维修</button><p>即使没有现金，也能凭手艺重新开始。{{state.phase!=='open'?'开门后可以接单。':''}}</p></div><button v-for="order in orders" :key="order.id" :data-order="order.id" class="list-row" @click="show(order.id)"><span><small>{{person(order.characterId)}}<template v-if="order.receivedDay"> · 第 {{order.receivedDay}} 日收件</template></small><strong>{{name(order.itemId)}}</strong><em>{{order.preserveOriginal?'保留原貌':'恢复功能'}} · {{order.verified?'复检通过，待交付':order.diagnosed?'已检测，继续修复':'等待检测'}}<template v-if="order.kind==='client'||order.kind==='final'"> · 约定报酬 ₡{{order.reward}}</template></em></span><b>打开工作台 →</b></button><p v-if="!orders.length" class="workshop-empty">台面已经收好。可以接待下一位街坊，或为自己的旧货安排翻新。</p><button v-if="latest" class="latest-repair" @click="showLatest"><span>最近交付 · 第 {{latest.day}} 日<strong>{{latestName}} <i>✓</i></strong></span><b>翻阅工序单 →</b></button></template>
  <RepairArchive v-else :selected="receipt"/>
 </div>
</template>
<style scoped>
.workshop-board .tab-row{margin-top:24px}.workshop-aid{display:flex;align-items:center;gap:20px;margin:20px 0}.workshop-aid p{font-size:11px;color:#91aa98;line-height:1.8}.workshop-aid button{font-size:12px;flex-shrink:0}.list-row>span{display:flex;flex-direction:column;gap:8px}.list-row small{font-size:10px;color:#9cb39a}.list-row strong{font-size:17px;font-weight:400;color:#dce3bf}.list-row em{font-style:normal;font-size:11px;color:#bdc6a5}.list-row>b{font-size:11px;flex-shrink:0;font-weight:400;margin-left:15px;color:#b1cbac}.workshop-empty{padding:24px 18px;background:#193732;font-size:12px;color:#a5bda3;line-height:1.9}.latest-repair{margin-top:24px;background:#d5ceae;color:#354c3b;display:flex;align-items:center;justify-content:space-between;text-align:left;gap:20px;width:100%;padding:18px 22px;border:0}.latest-repair span{font-size:10px;color:#6f7e60}.latest-repair strong{display:block;font-weight:400;font-size:18px;color:#3d5c43;margin-top:7px}.latest-repair i{font-style:normal;color:#64865b;margin-left:8px}.latest-repair>b{font-weight:400;font-size:12px;color:#566f4f}
@media(max-height:480px){.workshop-board{padding:20px 25px}.workshop-board>h2{font-size:22px;margin:8px 0}.workshop-board>.eyebrow{font-size:8px}.workshop-board>p:not(.eyebrow){font-size:10px;margin:8px 0}.workshop-board .tab-row{margin:12px 0}.workshop-board .tab-row button{padding:7px 10px;font-size:10px}.workshop-aid{gap:12px}.workshop-aid p{font-size:10px}.list-row{padding:13px}.list-row strong{font-size:14px}.list-row em{font-size:10px}.latest-repair{padding:14px 18px}}
</style>
