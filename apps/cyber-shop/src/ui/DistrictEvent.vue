<script setup lang="ts">
import { computed } from 'vue';
import { CATEGORIES, EVENTS } from '../content';
import { todayResponse } from '../game/district';
import { state, dispatch } from './store';
const event=computed(()=>EVENTS.find(e=>e.id===state.value.eventId));
const response=computed(()=>todayResponse(state.value));
import { faction } from '../content/factions';
import type { EventDefinition } from '../game/types';
const signed=(n:number)=>`${n>=0?'+':''}${n}`;
const relationEffects=(c:EventDefinition['choices'][number])=>Object.entries({[c.group]:c.relation,...c.otherRelations}).map(([id,n])=>`${faction(id)?.shortName??id} ${signed(n)}`).join(' · ');
</script>
<template>
 <article v-if="event" class="event-story district-event">
  <header><span class="eyebrow">九街通讯 · 第 {{state.day}} 日</span><b>{{state.eventResolved?'已回应':'今日消息'}}</b></header><h3>{{event.name}}</h3><p>{{event.text}}</p><p class="event-market">{{CATEGORIES.find(c=>c.id===event?.category)?.name}} 行情 ×{{event.multiplier}}</p>
  <div v-if="!state.eventResolved" class="vertical-actions"><button v-for="(choice,index) in event.choices" :key="index" :disabled="state.phase!=='open'||state.cash+choice.cash<0" @click="dispatch({type:'eventChoice',index})"><strong>{{choice.label}}</strong><small>{{choice.description}}</small><span>现金 {{choice.cash>=0?'+':''}}{{choice.cash}} · 声望 +{{choice.reputation}} · {{relationEffects(choice)}}</span><em v-if="state.cash+choice.cash<0">还差 ₡{{-choice.cash-state.cash}}</em></button></div>
  <section v-else-if="response" class="event-response"><span>今天的选择 ✓</span><h4>{{response.label}}</h4><p>{{response.description}}</p><small>声望 +{{response.reputation}} · {{relationEffects(response)}}</small></section>
  <p v-else class="event-legacy">这一天已经参与过街区行动。旧记录未保留具体选择。</p>
  <p v-if="!state.eventResolved&&state.phase!=='open'" class="event-legacy">今天已闭店，明天开门后再看看新的消息。</p>
 </article>
</template>
<style scoped>
.district-event{padding:20px 22px;border:1px solid #49604d;background:#233a32}.district-event header{display:flex;align-items:center;justify-content:space-between;gap:12px}.district-event .eyebrow{font-size:9px;letter-spacing:.09em;color:#b7c1a2}.district-event header b{font-weight:400;font-size:9px;color:#a1c09f}.district-event h3{font-size:25px;font-weight:400;color:#e4ddbb}.district-event p{font-size:12px;color:#bdcbb2;line-height:1.9}.district-event .event-market{display:inline-block;padding:4px 10px;background:#112d28;color:#d4c891;border:1px solid #4e664b;font-size:10px;margin:0 0 10px}.district-event .vertical-actions{gap:9px}.district-event button{background:#19332f;border:1px solid #6a7a5b;padding:12px 14px;text-align:left;margin-top:0}.district-event button strong{display:block;font-size:13px;font-weight:400;color:#dbe0ba}.district-event button small{display:block;font-size:10px;line-height:1.7;margin-top:6px;color:#9eb499}.district-event button span{display:block;font-size:9px;margin-top:8px;color:#c5bd90}.district-event button em{display:block;font-style:normal;font-size:10px;color:#dfa779;margin-top:6px}.event-response{padding:16px 18px;border-left:3px solid #9bbb8c;background:#152f29;margin-top:12px}.event-response>span{font-size:9px;color:#91ac89}.event-response h4{font-weight:400;font-size:17px;color:#dce3be;margin:8px 0}.event-response p{font-size:11px;margin:8px 0}.event-response small{font-size:10px;color:#abbc91}.district-event .event-legacy{font-size:11px;color:#a9b69b}
@media(max-width:900px){.district-event{padding:16px}.district-event h3{font-size:21px}.district-event button strong{font-size:12px}}
</style>
