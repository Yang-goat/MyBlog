<script setup lang="ts">
import {computed,nextTick,onMounted,onUnmounted,ref,watch} from 'vue';
import {state,modal,dispatch,openGuide} from './store';
import {vDialogFocus} from './dialog-focus';
const stops=[
 {target:'.incoming-tray',title:'客人带来的货',text:'这张托盘上的货还属于客人。检查品相，把想买的东西移到下方谈判台。'},
 {target:'.negotiation-table',title:'在这里谈生意',text:'选好的货在这张台面议价、成交。买下后仍留在台面，收进仓库才能闭店。'},
 {target:'.warehouse-section',title:'你的仓库',text:'每个区域使用同样大的正方形格子。拖放并旋转货物来腾出位置；双击箱包就能打开小窗，箱中套箱最多三层。'},
 {target:'.room-showcase',title:'把好东西陈列出来',text:'鉴定过的真品可以放进展示柜。藏品搭配会吸引更多客人，撤展后可继续出售。'},
 {target:'.workshop-hotspot',title:'接单，修复，再交付',text:'工作台汇总待办维修。检测故障、完成工序并复检，就能把旧物交还给客人。'},
 {target:'.call-green-button',title:'亮起的绿灯是叫号键',text:'准备好后按绿灯，请下一位客人进店。每位客人有自己的需求、报价和耐心。'},
 {target:'.wall-clock',title:'看好现金与工时',text:'思考和整理不耗时，经营操作会使用工时。闭店时支付租金与维护费，第二天恢复工时。'},
 {target:'.cabinet-menu',title:'抽屉里是经营账册',text:'查看库存、学习技能、购买工具、整理收藏与街区往来。设置中可以导出存档。'},
 {target:'.warehouse-tools .handbook-prop',title:'第一步，翻开店长手册',text:'这本书一直放在仓库旁。点击高亮的手册，阅读操作、交易与维修方法；以后需要时随时翻阅。'},
];
const step=computed(()=>state.value.tutorial?.step??9);
const active=computed(()=>!state.value.tutorial?.skipped&&step.value<9&&!modal.value&&state.value.phase==='open');
const stop=computed(()=>stops[Math.min(8,step.value)]!);
const viewport=ref({w:window.innerWidth,h:window.innerHeight});
const rect=ref({x:0,y:0,w:0,h:0}),card=ref<HTMLElement>(),cardHeight=ref(220);
let observer:ResizeObserver|undefined;
function measure(){
 viewport.value={w:window.innerWidth,h:window.innerHeight};
 const el=document.querySelector(stop.value.target),r=el?.getBoundingClientRect();
 if(r){const x=Math.max(4,r.left-6),y=Math.max(4,r.top-6);rect.value={x,y,w:Math.max(0,Math.min(viewport.value.w-4,r.right+6)-x),h:Math.max(0,Math.min(viewport.value.h-4,r.bottom+6)-y)};}
 if(card.value)cardHeight.value=card.value.offsetHeight;
}
const hole=computed(()=>({left:rect.value.x+'px',top:rect.value.y+'px',width:rect.value.w+'px',height:rect.value.h+'px'}));
const barriers=computed(()=>{const r=rect.value,v=viewport.value;return [
 {left:0,top:0,width:v.w,height:r.y},
 {left:0,top:r.y,width:r.x,height:r.h},
 {left:r.x+r.w,top:r.y,width:v.w-r.x-r.w,height:r.h},
 {left:0,top:r.y+r.h,width:v.w,height:v.h-r.y-r.h},
 ].map(b=>Object.fromEntries(Object.entries(b).map(([k,n])=>[k,n+'px'])));});
const cardStyle=computed(()=>{
 const r=rect.value,v=viewport.value,w=Math.min(310,v.w-24),h=cardHeight.value;
 let x=Math.max(12,Math.min(r.x+(r.w-w)/2,v.w-w-12)),y=r.y+r.h+14;
 if(y+h>v.h-12){y=r.y-h-14;if(y<12){x=r.x>=w+24?r.x-w-14:Math.min(v.w-w-12,r.x+r.w+14);y=Math.max(12,Math.min(r.y,v.h-h-12));}}
 return {left:x+'px',top:y+'px',width:w+'px'};
});
function go(n:number){dispatch({type:'tutorial',step:Math.max(0,Math.min(8,n)),skipped:false});}
watch([step,active],()=>void nextTick(measure));
watch(card,el=>{observer?.disconnect();if(el){observer=new ResizeObserver(measure);observer.observe(el);}});
onMounted(()=>{window.addEventListener('resize',measure);void nextTick(measure);});
onUnmounted(()=>{window.removeEventListener('resize',measure);observer?.disconnect();});
</script>
<template>
 <div v-if="active" class="shop-tour" :data-tour-step="step" @keydown.esc.stop.prevent="go(8)">
  <div class="tour-spotlight" :style="hole"></div>
  <div v-for="(b,i) in barriers" :key="i" class="tour-barrier" :style="b"></div>
  <div v-if="step<8" class="tour-barrier" :style="hole"></div>
  <section ref="card" v-dialog-focus class="tour-card" :style="cardStyle" role="dialog" aria-modal="true" aria-label="认识店铺区域">
   <small>{{step+1}} / 9</small><h2>{{stop.title}}</h2><p>{{stop.text}}</p>
   <footer><button v-if="step>0" @click="go(step-1)">上一区域</button><button v-if="step<8" class="primary" @click="go(step+1)">下一区域 →</button><button v-else class="primary" @click="openGuide('contents')">翻开高亮的手册 ↗</button></footer>
   <button v-if="step<8" class="tour-skip" @click="go(8)">跳过区域介绍</button>
  </section>
 </div>
</template>
<style scoped>
.shop-tour{position:fixed;inset:0;z-index:220;pointer-events:none}.tour-spotlight{position:absolute;border:2px solid #a9e4df;border-radius:5px;box-shadow:0 0 0 200vmax #03131dd9,0 0 24px #5ecac877;pointer-events:none}.tour-barrier{position:absolute;pointer-events:auto}.tour-card{position:absolute;pointer-events:auto;padding:20px;color:#e3eee9;background:#172e3b;border:1px solid #668e9e;border-radius:5px;box-shadow:0 12px 48px #0009}.tour-card small{color:#8ed5d2;font:12px monospace;letter-spacing:2px}.tour-card h2{margin:8px 0 12px;font-size:20px;line-height:1.4}.tour-card p{font-size:14px;line-height:1.8;color:#c2d3d7;margin:0 0 16px}.tour-card footer{display:flex;justify-content:flex-end;gap:8px}.tour-card button{padding:8px 10px;font-size:12px}.tour-card .tour-skip{display:block;margin:10px 0 -6px auto;background:none;border:0;color:#99aeb6;padding:4px}.tour-card .primary{background:#446d70;color:#f0f4dc;border-color:#89c5c0}@media(max-height:550px){.tour-card{padding:12px}.tour-card h2{font-size:16px;margin:4px 0 6px}.tour-card p{font-size:12px;line-height:1.6;margin-bottom:8px}.tour-card button{padding:6px 8px}.tour-card .tour-skip{margin-top:4px}}
</style>
