<script setup lang="ts">
import type {TradeReceipt} from '../game/types';
import {ITEMS} from '../content';
import {storageStyle} from '../content/storage';
import StorageArt from '../scenes/StorageArt.vue';
import Art from './Art.vue';
defineProps<{receipt:TradeReceipt}>();
const name=(id:string)=>ITEMS.find(i=>i.id===id)?.name??storageStyle(id)?.name??id;
</script>
<template>
 <section class="trade-receipt" aria-label="最近一笔成交回执"><div class="trade-receipt-heading"><span>本次接待 / 最近一笔成交</span><b>{{receipt.kind==='buy'?'已购入':'已交货'}} ✓</b></div><div class="receipt-goods"><span v-for="item in receipt.goods" :key="item.itemId"><StorageArt v-if="storageStyle(item.definitionId)" :kind="storageStyle(item.definitionId).art"/><Art v-else :id="item.definitionId" :label="name(item.definitionId)"/><small>{{name(item.definitionId)}}</small></span></div><p class="trade-payment">{{receipt.kind==='buy'?'实际付款':'实际收款'}} <strong>₡{{receipt.amount}}</strong></p><p v-if="receipt.kind==='sell'" class="trade-margin">货品累计成本 ₡{{receipt.cost}} · 货款差额 <b>₡{{receipt.amount-receipt.cost}}</b></p><p v-else class="trade-store">待入库</p></section>
</template>
<style scoped>
.trade-receipt{margin-top:20px;padding:18px 20px;background:#d6cfaf;color:#385043;box-shadow:2px 3px 0 #071d1c80;border-top:4px solid #829171}.trade-receipt-heading{display:flex;justify-content:space-between;font-size:10px;padding-bottom:12px;border-bottom:1px dashed #9ba88b}.trade-receipt-heading b{font-weight:500;color:#376147}.receipt-goods{display:flex;flex-wrap:wrap;gap:13px;margin:14px 0}.receipt-goods>span{display:flex;align-items:center;gap:8px}.receipt-goods img{width:32px;height:36px;object-fit:contain}.receipt-goods small{font-size:10px;color:#465d49}.trade-receipt p{color:#3c5947;font-size:12px}.trade-payment strong{float:right;font-size:22px;font-weight:400}.trade-margin{border-top:1px dashed #9ba88b;padding-top:12px;margin-top:14px}.trade-margin small{display:block;font-size:9px;color:#6a795f;margin-top:5px}.trade-receipt .trade-store{margin-top:11px;font-size:10px;color:#66765f}
</style>
