<script setup lang="ts">
import { computed } from 'vue';
import type { QuestDefinition } from '../game/types';
import { CHARACTERS } from '../content';
import { questProgress } from '../game/engine';
import { questCorrespondence } from '../game/district';
import { state, modal, dispatch } from './store';
import Art from './Art.vue';
const props=defineProps<{quest:QuestDefinition}>();
const person=computed(()=>CHARACTERS.find(c=>c.id===props.quest.character));
const index=computed(()=>state.value.questStages[props.quest.id]??0);
const stage=computed(()=>props.quest.stages[index.value]);
const progress=computed(()=>questProgress(state.value,props.quest.id));
const letters=computed(()=>questCorrespondence(state.value,props.quest.id));
const latest=computed(()=>letters.value.at(-1));
const target=computed(()=>({repairs:{label:'继续维修',panel:'orders',unit:'次完整维修'},trades:{label:'整理待售货物',panel:'inventory',unit:'笔交易'},display:{label:'整理收藏',panel:'collection',unit:'件同时展出的真品'},certificate:{label:'查看资质',panel:'growth',unit:'张维修证书'},master:{label:'学习大师能力',panel:'growth',unit:'项大师能力'},final:{label:'查看联络中枢',panel:'journal',unit:'套中枢修复'}}[stage.value?.requirement??'repairs']));
function focusFinal(){if(target.value.panel==='journal')document.querySelector('.final-quest')?.scrollIntoView({block:'center'});else modal.value=target.value.panel;}
</script>
<template>
 <article class="quest-story district-quest" :data-quest="quest.id">
  <header><Art :id="quest.character"/><div><span class="eyebrow">{{person?.name}} · {{person?.role}}</span><h3>{{quest.name}}</h3><ol aria-label="委托阶段"><li v-for="(_,n) in quest.stages" :key="n" :class="{done:n<index,current:n===index}">{{n<index?'✓':n+1}}</li></ol></div></header>
  <template v-if="stage">
   <p class="quest-request">{{stage.text}}</p><div class="quest-goal"><span>{{Math.min(progress.current,progress.target)}} / {{progress.target}} {{target.unit}}</span><b>{{progress.ready?'可领取谢礼':'进行中'}}</b></div><div class="quest-bar" aria-hidden="true"><i :style="{width:Math.min(100,progress.current/progress.target*100)+'%'}"></i></div>
   <div class="quest-claim"><button class="primary" :disabled="!progress.ready" @click="dispatch({type:'claimQuest',questId:quest.id})">领取街坊谢礼 · ₡{{stage.reward}}</button><button v-if="!progress.ready" @click="focusFinal">{{target.label}} ↗</button><small>{{stage.xp}} 经验</small></div>
  </template>
  <p v-else class="quest-complete">这段委托已经完成。{{latest?.keepsake?'留下的 '+latest.keepsake+' 已收好。':''}}</p>
  <section v-if="latest" class="district-letter" :data-letter="latest.id"><span>来自 {{latest.author}} 的回信<small>{{latest.day?'第 '+latest.day+' 日收到':'已收到'}}</small></span><h4>{{latest.title}}</h4><p>{{latest.text}}</p><footer>{{latest.author}}<b v-if="latest.keepsake">{{latest.keepsake}} ✓</b></footer></section>
  <details v-if="letters.length>1" class="earlier-letters"><summary>翻阅更早的 {{letters.length-1}} 封信</summary><section v-for="letter in letters.slice(0,-1)" :key="letter.id"><h4>{{letter.title}}<small v-if="letter.day">第 {{letter.day}} 日</small></h4><p>{{letter.text}}</p></section></details>
 </article>
</template>
<style scoped>
.district-quest{padding:20px;border:1px solid #39564c;background:#122d2f}.district-quest>header{display:flex;gap:17px;align-items:center}.district-quest>header img{width:76px;height:94px;object-fit:contain;object-position:bottom;background:linear-gradient(#213f38,#3a5240);border:1px solid #62715a}.district-quest>header>div{flex:1}.district-quest>header .eyebrow{font-size:9px;letter-spacing:.08em;color:#a4b39a}.district-quest>header h3{font-size:20px;font-weight:400;margin:9px 0 13px}.district-quest ol{display:flex;gap:5px;list-style:none;padding:0;margin:0}.district-quest ol li{display:flex;align-items:center;justify-content:center;width:26px;height:22px;background:#0c2327;color:#7b9986;border:1px solid #38554a;font-size:10px}.district-quest ol .current{border-color:#9ab998;color:#d1d9b6}.district-quest ol .done{background:#496248;color:#dbe4bc}.district-quest .quest-request{font-size:12px;color:#bfcbb4;line-height:1.9;margin-top:18px}.quest-goal{display:flex;justify-content:space-between;gap:12px;margin-top:17px;font-size:10px;color:#9cb49b}.quest-goal b{font-weight:400;color:#d0c99a}.quest-bar{height:3px;background:#294437;margin-top:8px}.quest-bar i{height:100%;display:block;background:#a8bd8b}.quest-claim{display:flex;align-items:center;gap:10px;flex-wrap:wrap;margin-top:10px}.quest-claim button{font-size:11px;padding:8px 12px}.quest-claim small{font-size:9px;color:#9caf93}.quest-complete{font-size:12px;color:#bad1ac}.district-letter{position:relative;background:#d4ccb0;color:#3d4f3c;padding:18px 20px 15px;margin-top:22px;box-shadow:2px 3px 7px #071d1c55}.district-letter:before{content:'';position:absolute;top:-6px;left:22px;width:55px;height:13px;background:#a5b28c99;transform:rotate(-4deg)}.district-letter>span{display:flex;justify-content:space-between;gap:10px;font-size:9px;color:#6a765b}.district-letter small{font-size:9px}.district-letter h4{font-size:16px;font-weight:500;margin:13px 0 8px}.district-letter p{font-size:12px;line-height:1.9;color:#4a5a42;margin:8px 0}.district-letter footer{display:flex;justify-content:space-between;gap:12px;padding-top:12px;border-top:1px solid #a5ab8b;font-size:10px;margin-top:12px;color:#627351}.district-letter footer b{font-weight:400;border:1px solid #8d9b76;padding:1px 5px}.earlier-letters{margin-top:13px;font-size:10px;color:#9bb59b}.earlier-letters summary{cursor:pointer}.earlier-letters section{border-left:2px solid #607451;margin:17px 0 0;padding-left:13px}.earlier-letters h4{font-size:12px;font-weight:400}.earlier-letters h4 small{float:right;font-size:9px;color:#879f87}.earlier-letters p{font-size:11px;color:#a7b79c}
@media(max-width:900px){.district-quest{padding:15px}.district-quest>header{gap:12px}.district-quest>header img{width:56px;height:72px}.district-quest>header h3{font-size:17px}.district-letter{padding:16px}.quest-claim{gap:7px}.quest-claim button{font-size:10px}}
</style>
