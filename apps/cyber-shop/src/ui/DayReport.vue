<script setup lang="ts">
import { computed } from 'vue';
import { state, modal, dispatch } from './store';
import { dayReport, journey, financialRecovery } from '../game/journey';
import { ITEMS } from '../content';
import { deliveryJobs, deliveryDefinition } from '../game/deliveries';
const report=computed(()=>dayReport(state.value));
const route=computed(()=>journey(state.value));
const recovery=computed(()=>financialRecovery(state.value));
const deliveries=computed(()=>deliveryJobs(state.value).filter(j=>j.status==='active'));
const expired=computed(()=>deliveryJobs(state.value).filter(j=>j.status==='expired'&&j.closedDay===state.value.day));
const expiring=computed(()=>state.value.items.filter(i=>i.owner==='player'&&i.expiresDay!==null&&i.expiresDay<=state.value.day+1));
const name=(id:string)=>ITEMS.find(i=>i.id===id)?.name??id;
</script>
<template>
 <div class="day-report"><section class="receipt"><p class="eyebrow">NINTH STREET / DAILY RECEIPT</p><h2>第 {{state.day}} 日，辛苦了。</h2><p class="receipt-lead">{{report.net>=0?'把今天的收获，留给明天的店灯。':'有些投入，需要下一位客人来回应。'}}</p><div class="receipt-total"><small>今日现金净变化</small><strong :class="{negative:report.net<0}">{{report.net>=0?'+':'−'}} ₡{{Math.abs(report.net).toLocaleString()}}</strong></div><dl><div><dt>维修交付 · {{report.repairs}} 件</dt><dd>+ ₡{{report.repairIncome}}</dd></div><div><dt>旧物售出 · {{report.sales}} 件</dt><dd>+ ₡{{report.saleIncome}}</dd></div><div v-if="report.deliveries"><dt>订货交付 · {{report.deliveries}} 单</dt><dd>+ ₡{{report.deliveryIncome}}</dd></div><div><dt>街区谢礼与其他收入</dt><dd>+ ₡{{report.income-report.repairIncome-report.saleIncome-report.deliveryIncome}}</dd></div><div><dt>采购、培训与其他支出</dt><dd>− ₡{{report.expenses-report.fees}}</dd></div><div><dt>租金、维护与补缴欠费</dt><dd>− ₡{{report.fees}}</dd></div><div class="receipt-balance"><dt>账面余额</dt><dd>₡{{report.closingCash.toLocaleString()}}</dd></div></dl><p class="small">现金变化包含采购和培训；库存仍在店内，客户材料专款单独保管。</p></section>
 <section class="tomorrow-plan"><p class="eyebrow">TOMORROW / 下一盏灯</p><h3>{{route.title}}</h3><p>{{route.next.title}} · {{Math.min(route.next.current,route.next.target)}} / {{route.next.target}}</p><p v-if="route.activeOrders">{{route.activeOrders}} 件工单已妥善保留，明天可继续维修。</p><p v-if="state.points" class="report-highlight">有 {{state.points}} 点技能尚未分配。</p><p v-if="state.debt" class="warning">尚欠 ₡{{state.debt}}。<template v-if="recovery.deadline!==null">还有 {{recovery.closingChances}} 次营业日结可补救，请在第 {{recovery.deadline}} 日闭店前备足费用。</template><template v-else>永久经营权保留，欠费会并入下次维护结算。</template><br/>下次日结需 ₡{{recovery.due}}（含每日费用 ₡{{recovery.fees}}）。基础援助维修可零现金接单。</p><div v-if="deliveries.length||expired.length" class="expiry-note"><h3>订货安排</h3><p v-for="job in deliveries" :key="job.id">{{deliveryDefinition(job).title}} · 第 {{job.deadline}} 日闭店前交货</p><p v-if="expired.length">{{expired.length}} 份订货已过交期，库存与现金保留。</p><button class="text-button" @click="modal='deliveries'">查看订货簿 ↗</button></div><div v-if="expiring.length" class="expiry-note"><h3>留意保质期</h3><p>{{expiring.map(i=>name(i.definitionId)).join('、')}}：请尽快售出或查看保鲜选项。</p></div><button class="primary wide" @click="dispatch({type:'openDay'})&&(modal='')">迎接新的一天 →</button><button class="wide" @click="modal='journey'">看看明天的目标</button><button class="text-button" @click="modal=''">留在店里整理</button></section>
 </div>
</template>
