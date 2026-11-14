<script setup lang="ts">
import { computed, nextTick, ref, watch } from 'vue';
import { ITEMS, CHARACTERS, CATEGORIES } from '../content';
import { state, dispatch, modal, selectedOrder, selectedItem, openGuide } from './store';
import { itemAccessible } from '../game/containers';
import { tradeQuote } from '../game/engine';
import { wholesaleFactor, wholesaleMinimum } from '../game/modifiers';
import { tradeIds, tradePlaces, stageTrade, removeTrade, clearTrade, guestGoods, tradeItem } from './trade-selection';
import Art from './Art.vue';
import ItemKnowledge from './ItemKnowledge.vue';
import StorageOffers from './StorageOffers.vue';
import TradeReceipt from './TradeReceipt.vue';
const visitor=computed(()=>state.value.visitors[state.value.visitorIndex]);
const person=computed(()=>CHARACTERS.find(c=>c.id===visitor.value?.characterId));
const candidates=computed(()=>visitor.value?.kind==='seller'?guestGoods.value:state.value.items.filter(i=>i.owner==='player'&&itemAccessible(state.value,i)&&['stock','counter'].includes(i.location)&&ITEMS.find(d=>d.id===i.definitionId)?.category===visitor.value?.category));
const selected=computed(()=>tradeIds.value.map(tradeItem).filter(i=>!!i));
const focused=computed(()=>tradeItem(selectedItem.value)??selected.value[0]??visitor.value?.item);
const definition=computed(()=>ITEMS.find(d=>d.id===focused.value?.definitionId));
const subtotal=computed(()=>selected.value.reduce((n,i)=>n+tradeQuote(state.value,visitor.value!,i),0));
const discount=computed(()=>visitor.value?.kind==='seller'?subtotal.value-Math.round(subtotal.value*wholesaleFactor(state.value,selected.value.length)):0);
const total=computed(()=>subtotal.value-discount.value);
const budget=computed(()=>visitor.value?.kind==='buyer'?(visitor.value.budget??Math.max(400,visitor.value.quote*4)):state.value.cash);
const overBudget=computed(()=>Math.max(0,total.value-budget.value));
const selectedCost=computed(()=>selected.value.reduce((n,i)=>n+i.cost,0));
const reply=computed(()=>visitor.value?.negotiation);
const replyMatches=computed(()=>reply.value?.status==='counter'&&reply.value.itemIds.length===tradeIds.value.length&&reply.value.itemIds.every(id=>tradeIds.value.includes(id)));
const replyElement=ref<HTMLElement|null>(null),receiptElement=ref<HTMLElement|null>(null);
watch(()=>reply.value?`${visitor.value?.id}:${reply.value.round}:${reply.value.status}`:'',async()=>{if(reply.value?.status==='counter'){await nextTick();replyElement.value?.scrollIntoView({block:'nearest'});}});
watch(()=>visitor.value?.lastTrade?`${visitor.value.id}:${visitor.value.lastTrade.goods.map(i=>i.itemId).join(',')}:${visitor.value.lastTrade.amount}`:'',async value=>{if(value){await nextTick();receiptElement.value?.scrollIntoView({block:'nearest'});}});
const amount=ref(0);watch(total,n=>amount.value=n,{immediate:true});
function toggle(id:string){selectedItem.value=id;if(tradeIds.value.includes(id))removeTrade(id);else stageTrade(id);}
function chooseAll(){for(const item of candidates.value)if(!stageTrade(item.id))break;}
function chooseWithinBudget(){
 if(visitor.value?.kind!=='buyer')return;
 clearTrade();let available=budget.value;
 for(const item of [...candidates.value].sort((a,b)=>tradeQuote(state.value,visitor.value!,a)-tradeQuote(state.value,visitor.value!,b))){
  const price=tradeQuote(state.value,visitor.value!,item);
  if(price<=available&&stageTrade(item.id))available-=price;
 }
}
function transact(ids=tradeIds.value,offer?:number){if(visitor.value)dispatch({type:'tradeBatch',visitorId:visitor.value.id,itemIds:[...ids],amount:offer,placements:Object.fromEntries(ids.filter(id=>tradePlaces.value[id]).map(id=>[id,{...tradePlaces.value[id]!}]))});}
function one(id:string){if(stageTrade(id))transact([id]);}
function acceptRepair(){if(dispatch({type:'acceptRepair',visitorId:visitor.value?.id})){selectedOrder.value=state.value.orders.filter(o=>!o.delivered).at(-1)?.id??'';modal.value='workbench';}}
</script>
<template>
<div v-if="visitor && !visitor.resolved" class="visitor-panel">
 <header class="visitor-heading trade-heading"><Art v-if="person" class="trade-portrait" :id="person.id" :label="person.name" eager/><div><p class="eyebrow">{{person?.role}}</p><h2>{{person?.name}}</h2></div><span class="visit-type">{{visitor.kind==='seller'?'带货来访':visitor.kind==='buyer'?'寻找旧物':'送修委托'}}</span></header>
 <button class="trade-help" @click="openGuide('trade')">交易教程 ?</button>
 <template v-if="visitor.kind==='repair'"><div v-if="focused" class="counter-item"><Art :id="focused.definitionId" eager/><h3>{{definition?.name}}</h3></div><p>接单后检测、维修、复检并交付；客户物品单独保管。</p><button class="primary wide" @click="acceptRepair">接下维修 →</button><button class="text-button" @click="dispatch({type:'reject',visitorId:visitor.id});clearTrade()">结束接待</button></template>
 <div v-else class="trade-workspace">
  <section class="trade-merchandise" aria-label="挑选与检查货品">
   <div class="trade-section-title"><span>{{visitor.kind==='seller'?'来货托盘':'自有货架'}}</span><small>{{candidates.length}} 件可选</small></div>
   <div class="actions compact"><button @click="chooseAll">{{visitor.kind==='seller'?'整批放上谈判台':'选取全部可售货物'}}</button><button v-if="visitor.kind==='buyer'" @click="chooseWithinBudget">按预算挑选</button><button @click="clearTrade">取消全部选择</button></div>
   <div class="trade-lots"><div v-for="item in candidates" :key="item.id" :class="['trade-lot',{chosen:tradeIds.includes(item.id),examining:focused?.id===item.id}]"><button class="lot-select" :aria-pressed="tradeIds.includes(item.id)" :aria-label="`选择 ${item.id}`" @click="toggle(item.id)"><span class="lot-check">{{tradeIds.includes(item.id)?'✓':'＋'}}</span><Art :id="item.definitionId" eager/><span class="lot-label">{{ITEMS.find(d=>d.id===item.definitionId)?.name}}<small class="lot-price">₡{{tradeQuote(state,visitor,item)}} <i>{{(ITEMS.find(d=>d.id===item.definitionId)?.size??0)*4}} 格{{ITEMS.find(d=>d.id===item.definitionId)?.shape?' · 异形':''}}</i></small><small v-if="item.known.includes('basic') || item.known.includes('diagnosed')" class="lot-condition">品相 {{item.condition}}% · {{item.faults.length?'功能异常':'基础完好'}}</small><small v-else class="lot-condition">尚未检查</small></span></button><button class="lot-one" @click="one(item.id)">{{visitor.kind==='seller'?'只买这件':'只卖这件'}}</button></div></div>
   <p v-if="!candidates.length" class="empty-tray">{{visitor.lastTrade?'本批已交货':'暂无匹配货品'}}</p>
   <section v-if="visitor.kind==='seller' && focused && candidates.some(i=>i.id===focused!.id)" class="trade-inspection" aria-label="货品检查"><Art :id="focused.definitionId" eager/><div><p class="eyebrow">正在查看</p><h3>{{definition?.name}}</h3><ItemKnowledge :item="focused" compact/><div class="actions compact"><button @click="dispatch({type:'inspect',visitorId:visitor.id,itemId:focused.id,method:'basic'})">基础检查</button><button @click="dispatch({type:'inspect',visitorId:visitor.id,itemId:focused.id,method:'scan'})">多谱扫描</button><button @click="dispatch({type:'inspect',visitorId:visitor.id,itemId:focused.id,method:'serial'})">查序列</button></div></div></section>
   <StorageOffers/>
  </section>
  <aside class="trade-settlement" aria-label="议价与结算">
   <div class="trade-section-title"><span>本次清单</span><small>{{visitor.kind==='buyer'?'预算':'现金'}} ₡{{budget}}</small></div>
   <template v-if="selected.length">
    <div class="basket-receipt"><span>本次 {{selected.length}} 件 · 原价 ₡{{subtotal}}</span><strong v-if="discount">批发九折 −₡{{discount}}</strong><small v-if="visitor.kind==='seller'">{{wholesaleMinimum(state)===null?'本局无批发折扣':`${wholesaleMinimum(state)} 件起九折`}}</small><small v-else>买家剩余预算 ₡{{visitor.budget ?? Math.max(400,visitor.quote*4)}}</small><b>合计 ₡{{total}}</b></div>
   </template>
   <section v-if="reply?.status==='counter'" ref="replyElement" class="negotiation-reply" aria-label="客人还价" aria-live="polite"><div><p>{{person?.name}}的还价</p><span>你报 ₡{{reply.offered}} · 这 {{reply.itemIds.length}} 件共 <b>₡{{reply.quote}}</b></span><small>{{reply.reason==='far'?'维持当前价':reply.reason==='budget'?'已到预算上限':'可以再让一步'}}{{replyMatches?'':' · 清单已变更'}}</small><button :disabled="!replyMatches||reply.quote>budget" @click="transact([...reply.itemIds],reply.quote)">接受还价 · ₡{{reply.quote}}</button></div></section>
   <template v-if="selected.length">
    <p v-if="visitor.kind==='buyer'" class="trade-cost-preview">货品累计成本 ₡{{selectedCost}} · 货款差额 ₡{{total-selectedCost}}</p>
    <label class="offer-label" for="trade-offer">你的报价</label><div class="bargain-row"><input id="trade-offer" v-model.number="amount" type="number" min="1" aria-label="议价金额"/><button :disabled="visitor.rounds>=visitor.patience" @click="transact(tradeIds,amount)">报价并成交</button></div>
    <p class="small muted negotiation-patience">剩余议价 {{Math.max(0,visitor.patience-visitor.rounds)}} 轮</p>
    <p v-if="overBudget" class="warning basket-warning">超出{{visitor.kind==='buyer'?'买家预算':'现有现金'}} ₡{{overBudget}}。可减少数量或尝试较低报价。</p>
    <button class="primary wide" :disabled="overBudget>0" @click="transact()">{{visitor.kind==='seller'?'收下选中的货':'成交并交货'}} →</button>
   </template>
   <p v-else class="empty-basket">{{visitor.lastTrade?'已结清':'清单为空'}}</p>
   <div v-if="visitor.lastTrade" ref="receiptElement" aria-live="polite"><TradeReceipt :receipt="visitor.lastTrade"/></div>
   <button class="text-button end-reception" @click="dispatch({type:'reject',visitorId:visitor.id});clearTrade()">结束接待</button>
  </aside>
 </div>
</div>
<div v-else class="visitor-empty"><h2>{{visitor?.negotiation?.status==='closed'?'这一笔没有谈妥':'这笔交易完成了'}}</h2><p>{{visitor?.negotiation?.status==='closed'?'客人已经离开，本次未成交的货物与现金保留。':visitor?.kind==='seller'?'已购商品留在谈判台，拖入仓库后再接待下一位。':'货款已经结算，可以继续接待下一位客人。'}}</p><TradeReceipt v-if="visitor?.lastTrade" :receipt="visitor.lastTrade"/><button class="primary" @click="modal=''">回到店铺</button></div>
</template>
<style scoped>
.negotiation-reply{display:flex;gap:13px;padding:14px;background:#24433b;border-left:3px solid #bea174;margin:16px 0}.negotiation-reply>img{width:52px;height:65px;object-fit:contain;align-self:flex-start}.negotiation-reply>div{flex:1;min-width:0}.negotiation-reply p{font-size:11px;color:#d9cdad;margin-bottom:5px}.negotiation-reply span{font-size:13px;color:#d6e2cc}.negotiation-reply b{font-size:18px;font-weight:500;color:#e8d49d}.negotiation-reply small{display:block;font-size:10px;line-height:1.8;color:#b6c9b4;margin:7px 0}.negotiation-reply button{font-size:12px;min-height:40px;background:#b5d1ad;color:#274630;border-color:#b5d1ad}.trade-cost-preview{font-size:12px;color:#c8d1b7;margin-bottom:12px}.trade-cost-preview small{display:block;font-size:10px;color:#9eb7a4;margin-top:3px}@media(pointer:coarse){.negotiation-reply button{min-height:44px}}
.trade-help{align-self:flex-end;background:none;border:0;font-size:10px;color:#99b9b3;padding:4px 0;margin:-2px 7px 10px 0}.trade-heading{gap:16px;margin:0 0 8px;min-height:62px}.trade-heading h2{font-size:27px;margin:2px 0}.trade-heading .eyebrow{font-size:10px}.trade-heading .visit-type{margin-left:auto;writing-mode:horizontal-tb;border:1px solid #7f92766b;padding:7px 10px;margin-right:34px;letter-spacing:.1em}.trade-portrait{width:48px;height:65px;object-fit:contain}.visitor-panel>.dialogue{font-size:12px;margin:0 0 16px;max-width:840px;color:#bed0bd;line-height:1.7}.trade-workspace{display:grid;grid-template-columns:minmax(0,1fr) 325px;gap:25px;flex:1;min-height:0}.trade-merchandise,.trade-settlement{min-width:0;overflow:auto;scrollbar-width:thin;scrollbar-color:#829575 #172e2e;overscroll-behavior:contain;padding-right:7px}.trade-settlement{border-left:1px solid #798d6b5c;padding-left:22px}.trade-section-title{display:flex;justify-content:space-between;gap:12px;font-size:13px;color:#dfd9b9;letter-spacing:.05em}.trade-section-title small{font-size:10px;color:#a2b79e;letter-spacing:0}.trade-hint{color:#a6b9a1;line-height:1.7;margin:7px 0 12px}.trade-merchandise .actions{gap:6px}.trade-merchandise .actions button{font-size:11px;padding:8px 10px;min-height:35px}.trade-lots{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:10px;max-height:none;overflow:visible;margin:15px 0}.trade-lot{display:flex;flex-direction:column;position:relative;background:linear-gradient(145deg,#1c3835,#172c2b);border:1px solid #66836778;box-shadow:inset 0 0 20px #00181a38;min-width:0;gap:0}.trade-lot.chosen{border-color:#c9ba82;background:linear-gradient(145deg,#374b37,#253b30)}.trade-lot.examining{box-shadow:inset 0 -3px #90b19a}.lot-select{display:grid;grid-template-columns:60px minmax(0,1fr);min-height:112px;gap:12px;padding:20px 12px 12px;position:relative;width:100%}.lot-select>img{width:60px;height:70px;filter:drop-shadow(2px 4px 4px #0006)}.lot-select .lot-check{position:absolute;top:5px;right:8px;font-size:15px;color:#b7cda8}.lot-select .lot-label{font-size:12px;line-height:1.6;color:#d8e1cb}.lot-select small{font-size:10px;margin-top:4px;line-height:1.6}.lot-select .lot-price{font-size:17px;color:#e7ce91}.lot-price i{font-size:9px;font-style:normal;color:#9db298;margin-left:6px;white-space:nowrap}.lot-one{border:0;border-top:1px dashed #7b936155;padding:8px;color:#b5c8a8;background:#08232022;min-height:34px}.trade-inspection{display:flex;gap:17px;padding:16px;background:#10282a;border:1px solid #657e694d;margin:18px 0 8px}.trade-inspection>img{width:74px;height:100px;object-fit:contain;align-self:center}.trade-inspection>div{min-width:0;flex:1}.trade-inspection h3{font-size:15px;margin:5px 0 9px;color:#dcd9b6}.trade-inspection .eyebrow{font-size:9px;color:#97ac93}.trade-inspection :deep(.knowledge-lines p){font-size:11px;color:#bed0b5;line-height:1.7;margin:3px 0}.trade-inspection .actions{margin-top:12px}.trade-settlement .basket-receipt{margin:12px 0;padding:12px 0}.trade-settlement .basket-receipt b{font-size:27px}.trade-settlement .basket-receipt span{font-size:12px}.trade-settlement .basket-receipt small{font-size:10px}.offer-label{display:block;font-size:10px;color:#adc3a5;margin:14px 0 6px}.bargain-row input{font-size:16px;font-variant-numeric:tabular-nums}.bargain-row button{padding:9px;font-size:11px}.negotiation-patience{font-size:10px;line-height:1.7;margin:8px 0 14px}.basket-warning{font-size:11px;line-height:1.7}.end-reception{margin:14px 0 4px;font-size:11px;min-height:34px}.empty-tray{padding:40px 20px;border:1px dashed #7f967057;color:#adc3a0;font-size:12px;line-height:1.8;text-align:center}.empty-basket{font-size:12px;line-height:1.8;padding:18px 0;color:#adc3a0}.negotiation-reply{padding:12px;margin:12px 0}.negotiation-reply small{font-size:10px}.negotiation-reply button{width:100%}.visitor-empty{max-width:480px;margin:auto;overflow:auto}.visitor-empty :deep(.trade-receipt){margin-top:25px}
@media(max-width:1000px){.trade-workspace{grid-template-columns:minmax(0,1fr) 285px;gap:15px}.trade-settlement{padding-left:15px}.lot-select{grid-template-columns:45px minmax(0,1fr);gap:8px;padding:18px 8px 8px;min-height:108px}.lot-select>img{width:45px;height:65px}.lot-select .lot-label{font-size:11px}.lot-price i{display:block;margin:0}.trade-inspection{gap:10px;padding:12px}.trade-inspection>img{width:52px;height:78px}.trade-merchandise .actions button{font-size:10px;padding:7px}.trade-heading{min-height:42px;gap:10px}.trade-portrait{width:34px;height:44px}.trade-heading h2{font-size:21px}.visitor-panel>.dialogue{font-size:11px;margin-bottom:10px}}
@media(max-height:500px){.trade-heading{min-height:38px;margin-bottom:4px}.trade-portrait{height:40px}.trade-heading h2{font-size:20px}.trade-heading .eyebrow{font-size:9px}.visitor-panel>.dialogue{font-size:10px;line-height:1.6;margin-bottom:9px}.trade-heading .visit-type{padding:5px 8px}.trade-hint{font-size:10px}.trade-inspection{margin:10px 0}.trade-lots{gap:8px}.trade-settlement .basket-receipt{margin:9px 0;padding:8px 0}.trade-settlement .basket-receipt b{font-size:23px}}
@media(max-width:680px){.trade-workspace{display:block;overflow:auto}.trade-merchandise,.trade-settlement{overflow:visible;padding:0}.trade-settlement{border-left:0;border-top:1px solid #798d6b5c;margin-top:18px;padding-top:18px}.trade-heading .visit-type{display:none}.trade-lots{grid-template-columns:repeat(2,minmax(0,1fr))}}
@media(pointer:coarse){.trade-merchandise .actions button,.lot-one,.end-reception,.bargain-row button{min-height:44px}}
</style>
