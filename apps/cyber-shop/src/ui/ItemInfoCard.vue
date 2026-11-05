<script setup lang="ts">
import { computed } from 'vue';
import { ITEMS, CATEGORIES } from '../content';
import type { ItemInstance } from '../game/types';
import { estimateValue, tradeQuote, attraction } from '../game/engine';
import { BALANCE } from '../game/balance';
import { state } from './store';
import Art from './Art.vue';
const props=defineProps<{item:ItemInstance}>();
const definition=computed(()=>ITEMS.find(d=>d.id===props.item.definitionId)!);
const own=computed(()=>state.value.items.some(i=>i.id===props.item.id&&i.owner==='player'));
const guest=computed(()=>state.value.visitors[state.value.visitorIndex]);
const basic=computed(()=>props.item.known.some(k=>['basic','diagnosed','restored'].includes(k)));
const scanned=computed(()=>props.item.known.some(k=>['scan','batch','diagnosed','restored'].includes(k)));
const serial=computed(()=>props.item.known.includes('serial'));
const value=computed(()=>basic.value?estimateValue(state.value,props.item):[Math.round(definition.value.price*.35),Math.round(definition.value.price*1.4)]);
const range=(v:number[])=>v[0]===v[1]?`₡${v[0]}`:`₡${v[0]}–${v[1]}`;
const buyer=computed(()=>guest.value?.kind==='buyer'&&!guest.value.resolved&&guest.value.category===definition.value.category);
const resale=computed(()=>buyer.value?`₡${tradeQuote(state.value,guest.value!,props.item)}`:range(value.value.map(n=>Math.round(n*(BALANCE.buyerFactor+Math.min(.18,attraction(state.value)/400))))));
const attributes=computed(()=>{
 const i=props.item,d=definition.value;
 const rows=[['占用格子',`${d.footprint.width} × ${d.footprint.height}`],['外观品相',basic.value?`${i.condition}%`:'待检查']];
 if(d.certificate)rows.push(['设备状态',scanned.value?(i.faults.length?`${i.faults.length} 项故障`:'功能正常'):'待检测']);
 if(d.category==='energy')rows.push(['有效容量',scanned.value?`${i.capacity}%`:'待扫描'],['材料纯度',scanned.value?`${i.purity}%`:'待扫描']);
 if(d.category==='data')rows.push(['数据完整度',scanned.value?`${i.integrity}%`:'待扫描']);
 if(d.category==='neural')rows.push(['接口兼容',scanned.value?i.compatibility:'待扫描']);
 if(d.category==='food')rows.push(['保质期限',basic.value?(i.expiresDay===null?'长期':`第 ${i.expiresDay} 日${i.expiresDay<state.value.day?' · 已过期':''}`):'待检查']);
 if(d.category==='antique')rows.push(['原貌',serial.value?`${i.originality}%`:'待核验'],['真伪',serial.value?(i.authentic?'真实原件':'复刻品'):'待核验']);
 if(serial.value)rows.push(['来源',i.provenance]);
 return rows;
});
</script>
<template><article class="item-info-card">
 <header><Art :id="item.definitionId"/><div><small>{{CATEGORIES.find(c=>c.id===definition.category)?.name}} · {{own?'店内物品':'客人来货'}}</small><h3>{{definition.name}}</h3></div></header>
 <dl class="item-prices"><div><dt>购入价</dt><dd>{{own?`₡${item.cost}`:'尚未购入'}}</dd></div><div><dt>价值估算</dt><dd>{{range(value)}}</dd></div><div><dt>{{buyer?'当前买家报价':'当前预计售价'}}</dt><dd>{{resale}}</dd></div><div v-if="!own&&guest?.kind==='seller'"><dt>卖家要价</dt><dd>₡{{guest.quote}} / 件</dd></div></dl>
 <p class="price-note">{{buyer?'实际成交还受买家剩余预算影响。':basic?'估价随检查结果与行情变化，售价以成交报价为准。':'尚未检查：按同类商品粗估，检查后会缩小范围。'}}</p>
 <dl class="item-attributes"><div v-for="[label,value] in attributes" :key="label"><dt>{{label}}</dt><dd>{{value}}</dd></div></dl>
 <p class="item-description">{{definition.description}}</p>
 <footer>鼠标右键 / 触屏长按 · 物品操作</footer>
</article></template>
