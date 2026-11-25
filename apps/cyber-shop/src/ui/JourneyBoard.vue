<script setup lang="ts">
import { computed } from 'vue';
import { state, modal, dispatch, selectedItem, selectedOrder, openDelivery } from './store';
import { CHAPTERS, journey, type JourneyTask } from '../game/journey';
import { ENERGY_COMMISSIONS } from '../content/deliveries';
import { FABRICATION_COMMISSIONS } from '../content/fabrication';
import { PROFESSIONS } from '../content';
import type { CareerFocus } from '../game/types';
import { CAREER_FOCUSES } from '../game/types';
import { districtKeepsakes } from '../game/district';
import { deliveryJobs, energyCommissionProgress, fabricationProgress } from '../game/deliveries';
defineProps<{compact?:boolean}>();
const route=computed(()=>journey(state.value));
const careers = CAREER_FOCUSES.map(id=>({id,name:PROFESSIONS.find(p=>p.id===id)!.name}));
const specialty=computed(()=>state.value.endless?undefined:route.value.focus==='energy-tech'?ENERGY_COMMISSIONS:route.value.focus==='fabricator'?FABRICATION_COMMISSIONS:undefined);
const path=computed(()=>specialty.value?[...specialty.value.map(c=>c.title),'永久经营权']:CHAPTERS.map(c=>c.title));
const stage=computed(()=>!specialty.value?state.value.chapter-1:route.value.focus==='energy-tech'?energyCommissionProgress(state.value):fabricationProgress(state.value));
const keepsakes=computed(()=>districtKeepsakes(state.value));
const deliveries=computed(()=>deliveryJobs(state.value).filter(j=>j.status==='active'));
function follow(career:CareerFocus){if(route.value.focus!==career)dispatch({type:'focusCareer',career});}
function activate(task:JourneyTask){
  if(task.jobId){openDelivery(task.jobId);return;}
  if(task.itemId)selectedItem.value=task.itemId;
  modal.value=task.panel;
}
function work(){const order=state.value.orders.find(o=>!o.delivered);if(order){selectedOrder.value=order.id;modal.value='workbench';}else modal.value='orders';}
</script>
<template>
 <section :class="compact?'journey-note':'journey-page'" aria-label="主线任务板">
  <div v-if="!compact&&!state.endless" class="career-choice" role="group" aria-label="跟进职业">
   <button v-for="career in careers" :key="career.id" :aria-pressed="route.focus===career.id" @click="follow(career.id)">{{career.name}}</button>
  </div>
  <h2>{{route.title}}</h2>
  <template v-if="compact">
   <p class="journey-next">{{route.next.title}}</p><p class="journey-count">{{Math.min(route.next.current,route.next.target).toLocaleString()}} <span>/ {{route.next.target.toLocaleString()}}</span></p>
   <div class="journey-meter"><i :style="{width:Math.min(100,route.next.current/route.next.target*100)+'%'}"></i></div>
   <button class="journey-open" @click="modal='journey'">查看下一步 →</button>
   <button v-if="route.ready.length" class="journey-alert" @click="modal='journey'">{{route.ready.length}} 份街区谢礼待领取</button>
   <button v-else-if="state.points" class="journey-alert" @click="modal='growth'">{{state.points}} 点技能可分配</button>
  </template>
  <template v-else>
   <p class="journey-story">{{route.story}}</p>
   <button class="text-button" @click="modal='deliveries'">街坊订货 · {{deliveries.length?`${deliveries.length} 份正在备货`:'看看今天需要什么'}} ↗</button>
   <ol v-if="!state.endless" class="chapter-path"><li v-for="(chapter,index) in path" :key="chapter" :class="{active:index===stage&&!state.victory,done:index<stage||state.victory}" :aria-current="index===stage&&!state.victory?'step':undefined"><span v-if="index<stage||state.victory" aria-hidden="true">✓</span>{{chapter}}</li></ol>
   <section v-if="keepsakes.length" class="journey-keepsakes" aria-label="街坊留下的纪念"><button v-for="gift in keepsakes" :key="gift.id" :data-keepsake="gift.id" @click="modal='journal'"><span>{{gift.name}}</span><small>{{gift.author}}留下的心意 ↗</small></button></section>
   <div class="journey-tasks"><article v-for="task in route.tasks" :key="task.id" :class="{done:task.done}" :data-journey-task="task.id"><span class="task-check" aria-hidden="true">{{task.done?'✓':'○'}}</span><div><h3>{{task.title}} <small>{{Math.min(task.current,task.target).toLocaleString()}} / {{task.target.toLocaleString()}}</small></h3><p>{{task.detail}}</p><button @click="activate(task)">{{task.label}} ↗</button></div></article></div>
   <div class="journey-bottom"><section v-if="!specialty||route.activeOrders||state.points"><h3>手头的事</h3><p v-if="!specialty||route.activeOrders">待完成工单 {{route.activeOrders}} 件 · 距下次升级 {{route.nextLevelXp}} 经验</p><button v-if="!specialty||route.activeOrders" @click="work">{{route.activeOrders?'继续当前维修':'接一件基础援助维修'}} →</button><button v-if="state.points" @click="modal='growth'">分配 {{state.points}} 点技能</button></section><section><h3>街坊的谢礼</h3><template v-if="route.ready.length"><div v-for="q in route.ready" :key="q.id" class="quest-reward"><span>{{q.name}} · ₡{{q.reward}}</span><button @click="dispatch({type:'claimQuest',questId:q.id})">领取谢礼</button></div></template><p v-else>继续经营，完成街区委托后会在这里提醒你。</p><button class="text-button" @click="modal='journal'">翻开街区手记 ↗</button></section></div>
  </template>
 </section>
</template>
<style scoped>
.career-choice{display:flex;gap:8px;flex-wrap:wrap;margin-bottom:18px}
.career-choice button{min-height:44px;padding:8px 16px;background:#152b37;border:1px solid var(--line)}
.career-choice button[aria-pressed=true]{color:var(--warm);background:#41372d;border-color:var(--warm);box-shadow:inset 0 -2px var(--warm)}
.chapter-path li span{display:inline;margin:0 5px 0 0;font-size:inherit}
@media(max-height:420px) and (orientation:landscape){
 .journey-page{padding:16px 18px 20px}
 .career-choice{margin:0 50px 8px 0}
 .journey-page h2{font-size:23px;margin:4px 0 6px}
 .journey-story{font-size:12px;line-height:1.45}
 .chapter-path{margin:10px 0}
 .chapter-path li{font-size:11px;padding:6px 4px}
 .chapter-path li span{font-size:14px;margin:0}
 .journey-tasks article{padding:9px 12px;gap:10px}
 .journey-tasks h3{font-size:15px}
 .journey-tasks p{margin:5px 0;font-size:12px}
}
.journey-keepsakes{display:flex;flex-wrap:wrap;gap:10px;margin:22px 0}.journey-keepsakes button{flex:1;min-width:170px;text-align:left;background:#d1c9a7;border:1px solid #a4ad81;color:#3b573d;padding:13px 16px;box-shadow:2px 3px 0 #091d2180}.journey-keepsakes span{display:block;font-size:13px}.journey-keepsakes small{display:block;font-size:9px;margin-top:5px;color:#64795a}
@media(max-width:900px){.journey-keepsakes{gap:7px}.journey-keepsakes button{min-width:145px;padding:10px 12px}.journey-keepsakes span{font-size:11px}}
</style>
