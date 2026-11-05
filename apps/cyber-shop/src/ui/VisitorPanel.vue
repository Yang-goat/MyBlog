<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import { ITEMS, CHARACTERS, CATEGORIES } from '../content';
import { state, dispatch, modal, selectedOrder, selectedItem } from './store';
import { tradeQuote } from '../game/engine';
import { tradeIds, tradePlaces, stageTrade, removeTrade, clearTrade, guestGoods, tradeItem } from './trade-selection';
import Art from './Art.vue';
import ItemKnowledge from './ItemKnowledge.vue';
const visitor=computed(()=>state.value.visitors[state.value.visitorIndex]);
const person=computed(()=>CHARACTERS.find(c=>c.id===visitor.value?.characterId));
const candidates=computed(()=>visitor.value?.kind==='seller'?guestGoods.value:state.value.items.filter(i=>i.owner==='player'&&['stock','counter'].includes(i.location)&&ITEMS.find(d=>d.id===i.definitionId)?.category===visitor.value?.category));
const selected=computed(()=>tradeIds.value.map(tradeItem).filter(i=>!!i));
const focused=computed(()=>tradeItem(selectedItem.value)??selected.value[0]??visitor.value?.item);
const definition=computed(()=>ITEMS.find(d=>d.id===focused.value?.definitionId));
const subtotal=computed(()=>selected.value.reduce((n,i)=>n+tradeQuote(state.value,visitor.value!,i),0));
const discount=computed(()=>visitor.value?.kind==='seller'&&selected.value.length>=3?subtotal.value-Math.round(subtotal.value*.9):0);
const total=computed(()=>subtotal.value-discount.value);
const amount=ref(0);watch(total,n=>amount.value=n,{immediate:true});
function toggle(id:string){selectedItem.value=id;if(tradeIds.value.includes(id))removeTrade(id);else stageTrade(id);}
function chooseAll(){for(const item of candidates.value)if(!stageTrade(item.id))break;}
function transact(ids=tradeIds.value,offer?:number){if(visitor.value)dispatch({type:'tradeBatch',visitorId:visitor.value.id,itemIds:[...ids],amount:offer,placements:Object.fromEntries(ids.filter(id=>tradePlaces.value[id]).map(id=>[id,{...tradePlaces.value[id]!}]))});}
function one(id:string){if(stageTrade(id))transact([id]);}
function acceptRepair(){if(dispatch({type:'acceptRepair',visitorId:visitor.value?.id})){selectedOrder.value=state.value.orders.filter(o=>!o.delivered).at(-1)?.id??'';modal.value='workbench';}}
</script>
<template>
<div v-if="visitor && !visitor.resolved" class="visitor-panel">
 <div class="visitor-heading"><div><p class="eyebrow">{{person?.role}}</p><h2>{{person?.name}}</h2></div><span class="visit-type">{{visitor.kind==='seller'?'带货来访':visitor.kind==='buyer'?'寻找旧物':'送修委托'}}</span></div>
 <p class="dialogue">“{{visitor.request}}”</p>
 <template v-if="visitor.kind==='repair'"><div v-if="focused" class="counter-item"><Art :id="focused.definitionId" eager/><h3>{{definition?.name}}</h3></div><p>接单后检测、维修、复检并交付；客户物品单独保管。</p><button class="primary wide" @click="acceptRepair">接下维修 →</button></template>
 <template v-else>
  <p class="small">{{visitor.kind==='seller'?'点选货物搬到谈判台；可以逐件购买，也可以多件一起购买。':'选择要卖的库存或台面物品；可分批出售，展柜和送修件不参与。'}}</p>
  <div class="actions compact"><button @click="chooseAll">{{visitor.kind==='seller'?'整批放上谈判台':'选取全部可售货物'}}</button><button @click="clearTrade">取消全部选择</button></div>
  <div class="trade-lots"><div v-for="item in candidates" :key="item.id" :class="['trade-lot',{chosen:tradeIds.includes(item.id)}]"><button class="lot-select" :aria-pressed="tradeIds.includes(item.id)" :aria-label="`选择 ${item.id}`" @click="toggle(item.id)"><span>{{tradeIds.includes(item.id)?'✓':'＋'}}</span><Art :id="item.definitionId"/><span>{{ITEMS.find(d=>d.id===item.definitionId)?.name}}<small>₡{{tradeQuote(state,visitor,item)}} · {{ITEMS.find(d=>d.id===item.definitionId)?.footprint.width}}×{{ITEMS.find(d=>d.id===item.definitionId)?.footprint.height}}</small></span></button><button class="lot-one" @click="one(item.id)">{{visitor.kind==='seller'?'只买这件':'只卖这件'}}</button></div></div>
  <p v-if="!candidates.length">没有可交易的匹配货物。</p>
  <template v-if="visitor.kind==='seller' && focused && candidates.some(i=>i.id===focused!.id)"><h3>{{definition?.name}} · 查看详情</h3><ItemKnowledge :item="focused"/><div class="actions compact"><button @click="dispatch({type:'inspect',visitorId:visitor.id,itemId:focused.id,method:'basic'})">基础检查</button><button @click="dispatch({type:'inspect',visitorId:visitor.id,itemId:focused.id,method:'scan'})">多谱扫描</button><button @click="dispatch({type:'inspect',visitorId:visitor.id,itemId:focused.id,method:'serial'})">查序列</button></div></template>
  <div class="basket-receipt"><span>本次 {{selected.length}} 件 · 原价 ₡{{subtotal}}</span><strong v-if="discount">批发九折 −₡{{discount}}</strong><small v-if="visitor.kind==='seller'">同次购入至少 3 件享九折；分次购买不累计折扣。</small><small v-else>买家剩余预算 ₡{{visitor.budget ?? Math.max(400,visitor.quote*4)}}</small><b>合计 ₡{{total}}</b></div>
  <div class="bargain-row"><input v-model.number="amount" type="number" min="1" aria-label="议价金额"/><button :disabled="!selected.length||visitor.rounds>=visitor.patience" @click="transact(tradeIds,amount)">报价并成交</button></div><p class="small muted">剩余议价 {{Math.max(0,visitor.patience-visitor.rounds)}} 轮 · {{person?.bargain}}</p>
  <button class="primary wide" :disabled="!selected.length" @click="transact()">{{visitor.kind==='seller'?'收下选中的货':'成交并交货'}} →</button>
 </template>
 <button class="text-button" @click="dispatch({type:'reject',visitorId:visitor.id});clearTrade()">结束接待</button>
</div>
<div v-else class="visitor-empty"><h2>这笔交易完成了</h2><p>已购商品留在谈判台，拖入仓库后再接待下一位。</p><button class="primary" @click="modal=''">回到店铺</button></div>
</template>
