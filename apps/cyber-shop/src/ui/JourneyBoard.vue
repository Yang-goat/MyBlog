<script setup lang="ts">
import { computed } from 'vue';
import { state, modal, dispatch, selectedOrder } from './store';
import { CHAPTERS, journey } from '../game/journey';
const props=defineProps<{compact?:boolean}>();
const route=computed(()=>journey(state.value));
function work(){const order=state.value.orders.find(o=>!o.delivered);if(order){selectedOrder.value=order.id;modal.value='workbench';}else modal.value='orders';}
</script>
<template>
 <section :class="compact?'journey-note':'journey-page'" aria-label="主线任务板">
  <p class="eyebrow">{{state.endless?'AFTER STORY':'STORY / '+String(state.chapter).padStart(2,'0')}}</p>
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
   <ol class="chapter-path"><li v-for="(chapter,index) in CHAPTERS" :key="chapter.title" :class="{active:index+1===state.chapter,done:index+1<state.chapter||state.victory}"><span>{{index+1<state.chapter||state.victory?'✓':'0'+(index+1)}}</span>{{chapter.title}}</li></ol>
   <div class="journey-tasks"><article v-for="task in route.tasks" :key="task.id" :class="{done:task.done}"><span class="task-check">{{task.done?'✓':'○'}}</span><div><h3>{{task.title}} <small>{{Math.min(task.current,task.target).toLocaleString()}} / {{task.target.toLocaleString()}}</small></h3><p>{{task.detail}}</p><button @click="modal=task.panel">{{task.label}} ↗</button></div></article></div>
   <div class="journey-bottom"><section><h3>手头的事</h3><p>待完成工单 {{route.activeOrders}} 件 · 距下次升级 {{route.nextLevelXp}} 经验</p><button @click="work">{{route.activeOrders?'继续当前维修':'接一件基础援助维修'}} →</button><button v-if="state.points" @click="modal='growth'">分配 {{state.points}} 点技能</button></section><section><h3>街坊的谢礼</h3><template v-if="route.ready.length"><div v-for="q in route.ready" :key="q.id" class="quest-reward"><span>{{q.name}} · ₡{{q.reward}}</span><button @click="dispatch({type:'claimQuest',questId:q.id})">领取谢礼</button></div></template><p v-else>继续经营，完成街区委托后会在这里提醒你。</p><button class="text-button" @click="modal='journal'">翻开街区手记 ↗</button></section></div>
  </template>
 </section>
</template>
