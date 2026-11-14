<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import type { FaultDefinition } from '../game/types';
import { state, dispatch } from './store';
import { calibrationTolerance, repairPracticeNeeded } from '../game/engine';
import { repairPlan } from '../game/repair-plan';
import RepairEstimate from './RepairEstimate.vue';
const props=defineProps<{fault:FaultDefinition;orderId:string;antique:boolean}>();
const cleaned=ref<number[]>([]),screws=ref<number[]>([]),installed=ref(false),removed=ref(false),dial=ref(20),preserve=ref(false);
watch(()=>[props.orderId,props.fault.id],()=>{cleaned.value=[];screws.value=[];installed.value=false;removed.value=false;dial.value=20;preserve.value=false;},{immediate:true});
const tolerance=computed(()=>calibrationTolerance(state.value));
const ready=computed(()=>props.fault.operation==='clean'?cleaned.value.length===6:props.fault.operation==='replace'?installed.value:typeof dial.value==='number'&&Number.isFinite(dial.value)&&Math.abs(dial.value-props.fault.target)<=tolerance.value);
const practiced=computed(()=>(state.value.records.faults[props.fault.id]??0)>=repairPracticeNeeded(state.value));
const action=computed(()=>({type:'repair' as const,orderId:props.orderId,faultId:props.fault.id,operation:props.fault.operation,module:props.fault.module,value:dial.value,preserve:preserve.value}));
const plan=computed(()=>repairPlan(state.value,action.value));
const quickPlan=computed(()=>repairPlan(state.value,{...action.value,quick:true}));
const count=computed(()=>props.fault.operation==='clean'?`${cleaned.value.length} / 6 接点`:props.fault.operation==='replace'?installed.value?(preserve.value?'原件已装回':'新模块已就位'):removed.value?'插槽已腾空':`${screws.value.length} / 4 固定螺丝`:`偏差 ${Math.abs(dial.value-props.fault.target)}`);
const wave=(target:boolean)=>Array.from({length:81},(_,i)=>`${i*4},${48+Math.sin(i/6)*(target?20:20+Math.abs(dial.value-props.fault.target)*.55)}`).join(' ');
function clean(n:number){if(!cleaned.value.includes(n))cleaned.value.push(n);}
function stroke(e:PointerEvent){if(!e.buttons)return;const target=document.elementFromPoint(e.clientX,e.clientY)?.closest<HTMLElement>('[data-contact]');if(target)clean(Number(target.dataset.contact));}
function execute(quick=false){dispatch({...action.value,quick});}
</script>
<template>
 <section class="repair-rig" aria-label="手动维修操作台" :data-operation="fault.operation">
  <header><span>BENCH / {{fault.operation==='clean'?'清洁接点':fault.operation==='replace'?'模块拆装':'信号校准'}}</span><b>{{count}}</b></header>
  <template v-if="fault.operation==='clean'">
   <p>沿接点擦去氧化层。可按住划过，也可逐个点击。</p>
   <div class="contact-board" @pointermove="stroke"><div class="circuit-traces"></div><button v-for="n in 6" :key="n" :data-contact="n" :class="{polished:cleaned.includes(n)}" :aria-label="`清洁接点 ${n}`" :aria-pressed="cleaned.includes(n)" @pointerdown.prevent="clean(n)" @click="clean(n)"><i></i><span>{{cleaned.includes(n)?'✓':'0'+n}}</span></button></div>
  </template>
  <template v-else-if="fault.operation==='replace'">
   <p>{{installed?'接插件已锁定，可以结算本次拆装。':removed?preserve?'旧模块已取出，修整后装回原件。':'旧模块已取出，装入备件。':'先松开四角的固定螺丝，再取下故障模块。'}}</p>
   <div class="module-board" :class="{removed,installed}"><div class="module-chip"><span>{{installed?'READY':removed?'EMPTY':'FAULT'}}</span><i></i><i></i><i></i></div><button v-for="n in 4" :key="n" :class="['rig-screw','screw-'+n,{loose:screws.includes(n)}]" :aria-label="`松开螺丝 ${n}`" :disabled="screws.includes(n)" @click="screws.push(n)">{{screws.includes(n)?'·':'+'}}</button><button v-if="!removed" class="module-action" :disabled="screws.length<4" @click="removed=true">取出故障模块</button><button v-else-if="!installed" class="module-action" @click="installed=true">{{preserve?'修整并装回原件':'装入替换模块'}}</button></div>
   <label v-if="antique" class="check-row"><input v-model="preserve" type="checkbox" /> 修整原件，保留原貌（多 1 工时）</label>
  </template>
  <template v-else>
   <p>转动读数，让实测信号接近虚线参考。目标 {{fault.target}}，当前允许误差 ±{{tolerance}}。{{tolerance>2?'技能与工具已计入。':''}}</p>
   <div class="signal-screen"><svg viewBox="0 0 320 100" aria-hidden="true"><defs><pattern id="signal-grid" width="20" height="20" patternUnits="userSpaceOnUse"><path d="M 20 0 L 0 0 0 20" fill="none" stroke="#557e6644" stroke-width="1"/></pattern></defs><rect width="320" height="100" fill="url(#signal-grid)"/><polyline :points="wave(true)" fill="none" stroke="#d3bb85" stroke-dasharray="5 5"/><polyline :points="wave(false)" fill="none" stroke="#a6e1b6" stroke-width="2"/></svg><strong>{{dial}}<small>{{ready?'信号稳定':'调整读数'}}</small></strong></div>
   <div class="rig-dial"><button aria-label="校准减 1" @click="dial=Math.max(0,dial-1)">−</button><input v-model.number="dial" type="range" min="0" max="100" aria-label="手动校准读数"/><button aria-label="校准加 1" @click="dial=Math.min(100,dial+1)">+</button></div>
   <label class="rig-exact">精确读数 <input v-model.number="dial" type="number" min="0" max="100" aria-label="手动精确校准"/></label>
  </template>
  <RepairEstimate v-if="ready" :plan="plan"/><RepairEstimate v-else-if="practiced" :plan="quickPlan"/>
  <div class="rig-actions"><button class="primary" :disabled="!ready || !plan.ok" @click="execute()">{{ready?'执行工序':'完成操作后执行'}} →</button><button v-if="practiced" :disabled="!quickPlan.ok" @click="execute(true)">熟练快捷工序</button></div>
  <p class="rig-note">准备操作不消耗工时；点击执行后，统一结算工时与材料。</p>
 </section>
</template>
<style scoped>
.repair-rig{margin-top:12px;background:#0c2428;border:1px solid #557363;padding:14px}.repair-rig header{display:flex;justify-content:space-between;align-items:center;gap:10px;font-size:10px;color:#b7c7ac}.repair-rig header b{font-size:11px;color:#ddcb9d;font-weight:400}.repair-rig p{font-size:12px;line-height:1.7;margin:10px 0;color:#b3c6b6}.contact-board{position:relative;display:grid;grid-template-columns:repeat(3,1fr);gap:17px 24px;background:#264d3e;border:5px solid #3e6250;padding:18px 25px;isolation:isolate;touch-action:none}.circuit-traces{position:absolute;inset:8px;background:repeating-linear-gradient(0deg,transparent 0 11px,#75976c33 12px 13px,transparent 14px 23px),repeating-linear-gradient(90deg,transparent 0 21px,#9aa47844 22px 23px,transparent 24px 39px);z-index:-1}.contact-board button{position:relative;min-height:47px;padding:4px;background:#876a45;border:2px solid #baa270;color:#d4bb8e;box-shadow:inset 0 0 12px #342b2580;touch-action:none}.contact-board button i{display:block;height:16px;margin:0 5px;background:repeating-linear-gradient(90deg,#493e2a 0 4px,#a17f47 5px 8px);border:1px solid #74613c}.contact-board button span{font-size:9px}.contact-board button.polished{background:#c5c194;color:#214333;border-color:#dce2b8;box-shadow:0 0 12px #b8e3a733}.contact-board button.polished i{background:repeating-linear-gradient(90deg,#b1aa67 0 4px,#e3d590 5px 8px);border-color:#e8dea3}.module-board{position:relative;height:158px;background:repeating-linear-gradient(90deg,#1b3933 0 11px,#274b3b 12px 13px);border:1px solid #4f7056;padding:23px 45px}.module-chip{height:74px;background:#444c40;border:3px solid #99896b;box-shadow:0 4px 8px #071b1c;display:flex;align-items:center;justify-content:center;gap:7px;color:#d4aa79}.module-chip span{font-size:12px;letter-spacing:.14em}.module-chip i{height:37px;width:4px;background:#969570}.removed .module-chip{border-style:dashed;background:#112a29;color:#5c7a65}.installed .module-chip{background:#426044;border-style:solid;border-color:#afbd91;color:#d7e2b7}.rig-screw{position:absolute;width:27px;height:27px;padding:0;border-radius:50%;background:#78816b;border:2px solid #a0a38a;color:#293c32;font-size:22px;line-height:1}.screw-1{top:9px;left:9px}.screw-2{top:9px;right:9px}.screw-3{bottom:9px;left:9px}.screw-4{bottom:9px;right:9px}.rig-screw.loose{opacity:.3}.module-action{display:block;margin:10px auto 0;padding:4px 12px;font-size:11px}.signal-screen{position:relative;background:#0b2629;border:4px solid #405b4e;padding:4px}.signal-screen svg{width:100%;height:93px;display:block}.signal-screen strong{position:absolute;top:9px;right:10px;color:#ddcf9e;font-family:monospace;font-size:27px;text-shadow:0 0 8px #b6e2a077}.signal-screen small{display:block;font-size:9px;color:#9aba9c}.rig-dial{display:flex;gap:10px;align-items:center;margin-top:10px}.rig-dial button{width:36px;height:32px;padding:0}.rig-exact{display:flex;justify-content:flex-end;align-items:center;gap:9px;font-size:10px;margin-top:8px;color:#9fbaa8}.rig-exact input{width:75px;min-height:28px;font-size:12px;padding:3px 8px}.rig-actions{display:flex;gap:8px;margin-top:15px}.rig-actions button{flex:1;font-size:12px;padding:10px 7px}.repair-rig .rig-note{font-size:10px;color:#7e9c88;margin:9px 0 0}.check-row{font-size:12px;line-height:1.7;margin:10px 0}
@media(pointer:coarse){.rig-screw{width:38px;height:38px;}.module-board{padding-left:53px;padding-right:53px;}.rig-dial button{width:40px;height:40px;}}
</style>
