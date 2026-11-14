<script setup lang="ts">
import { computed } from 'vue';
import Art from '../ui/Art.vue';
const patinaStyle={'--bench-patina':'url(/cyber-shop/scenery/patina-metal.webp)'};
const props=defineProps<{itemId:string;diagnosed:boolean;faultCount:number;verified:boolean;equipment:Record<string,number>}>();
const status=computed(()=>!props.diagnosed?'standby':props.verified?'passed':props.faultCount?'fault':'ready');
const label=computed(()=>!props.diagnosed?'待接入检测':props.verified?'复检通过':props.faultCount?`${props.faultCount} 项故障`:'等待复检');
const signal=computed(()=>Array.from({length:101},(_,i)=>{
 const y=!props.diagnosed?40:props.faultCount?40+Math.sin(i*.2)*12+Math.sin(i*.91)*props.faultCount*3:40+Math.sin(i*.2)*12;
 return `${i*2},${y}`;
}).join(' '));
const tools=computed(()=>[
 {id:'micro-solder',name:'微焊工具'}, {id:'assembly-jig',name:'装配夹具'}, {id:'calibrator',name:'精密校准仪'},
].filter(tool=>props.equipment[tool.id]));
</script>
<template>
 <div class="bench-scene" :data-diagnostic="status" :style="patinaStyle" aria-hidden="true">
  <div class="bench-wall"></div><div class="bench-wall-patina"></div>
  <img class="parts-organizer" :src="'/cyber-shop/scenery/parts-organizer.webp'" alt="" draggable="false"/>
  <div class="bench-desk"><div class="bench-mat"></div><div class="bench-ruler"></div></div>
  <div class="bench-scope">
   <img :src="'/cyber-shop/scenery/neon-terminal.webp'" alt="" draggable="false"/>
   <div class="scope-glass"><small>{{label}}</small><svg viewBox="0 0 200 80"><path d="M0 20H200 M0 40H200 M0 60H200 M40 0V80 M80 0V80 M120 0V80 M160 0V80" stroke="#8aad8140" stroke-width=".5"/><polyline :points="signal" fill="none" stroke="currentColor" stroke-width="1.7"/></svg><i></i></div>
  </div>
  <div class="bench-lamp-beam"></div><div class="bench-light-pool"></div>
  <img class="bench-lamp" :src="'/cyber-shop/scenery/bench-lamp.webp'" alt="" draggable="false"/>
  <div class="device-shadow"></div><Art :id="itemId" class="bench-object" eager/>
  <div class="owned-bench-tools"><div v-for="tool in tools" :key="tool.id" :data-tool="tool.id"><Art :id="tool.id" eager/><span>{{tool.name}}</span></div></div>
  <span class="bench-grade">工位 {{String(equipment.workbench??0).padStart(2,'0')}} <i>·</i> 九街工坊</span>
  <div class="bench-depth-shade"></div>
 </div>
</template>
<style scoped>
.bench-scene{position:absolute;inset:0;isolation:isolate;overflow:hidden;background:#182c2b}
.bench-wall{position:absolute;inset:0 0 63%;background:repeating-linear-gradient(0deg,#213c37 0 39px,#162e2e 40px 42px,#53685a 43px 44px);box-shadow:inset 0 30px 45px #071818a0}
.bench-wall-patina{position:absolute;inset:0 0 63%;background:var(--bench-patina) center/cover;opacity:.3}
.parts-organizer{position:absolute;top:11%;right:7%;width:55%;height:20%;object-fit:fill;filter:drop-shadow(0 5px 4px #071b18)}
.bench-desk{position:absolute;inset:31% 0 0;background:linear-gradient(130deg,#55625675,#95876c18 60%,#b3945266),var(--bench-patina) center/cover;border-top:9px solid #4b6151;box-shadow:0 -4px 0 #89907a,inset 0 7px 14px #071c1da0}
.bench-mat{position:absolute;left:8%;right:8%;top:12%;bottom:29%;border:3px solid #465e51;border-radius:8px;background:linear-gradient(125deg,#193734d9,#243b32d9),repeating-linear-gradient(0deg,transparent 0 18px,#a7b48c20 19px 20px);box-shadow:0 5px 12px #091d1ca0,inset 0 0 0 4px #152f2a}
.bench-mat:before{content:'';position:absolute;inset:7%;border:1px solid #7f977044;border-radius:5px;background:repeating-linear-gradient(0deg,transparent 0 22px,#9baf7a08 23px 24px),repeating-linear-gradient(90deg,transparent 0 22px,#9baf7a08 23px 24px)}
.bench-ruler{position:absolute;left:9%;right:9%;bottom:27%;height:7px;background:repeating-linear-gradient(90deg,transparent 0 9px,#d4bd7455 10px 11px)}
.bench-scope{position:absolute;left:5%;top:10%;width:32%;aspect-ratio:640/374;filter:drop-shadow(0 7px 5px #0a1e1e)}
.bench-scope>img{position:absolute;inset:0;width:100%;height:100%}
.scope-glass{position:absolute;left:9%;top:15%;width:68%;height:63%;overflow:hidden;color:#9fbea0;background:repeating-linear-gradient(0deg,#112c2900 0 2px,#91c3a808 3px 4px);border-radius:7px}
.scope-glass small{position:absolute;top:7%;left:8%;font-size:clamp(7px,.7vw,11px);color:#cbd6ad;z-index:1}.scope-glass svg{position:absolute;inset:11% 6% 3%;width:88%;height:86%;filter:drop-shadow(0 0 3px currentColor)}
.scope-glass i{position:absolute;inset:0;background:linear-gradient(0deg,transparent 80%,#bcdfba1c 90%,transparent);animation:scope-sweep 3s linear infinite;transform:translateY(100%)}
[data-diagnostic=fault] .scope-glass{color:#e3ba7e}[data-diagnostic=passed] .scope-glass{color:#bde4b0}[data-diagnostic=standby] .scope-glass{color:#6c947d}
.bench-lamp{position:absolute;right:-2%;top:2%;width:33%;height:57%;object-fit:contain;object-position:right top;filter:drop-shadow(3px 6px 7px #061d1c80);z-index:3}
.bench-lamp-beam{position:absolute;left:24%;top:14%;width:61%;height:55%;background:radial-gradient(ellipse at 75% 0%,#f3cc8533,transparent 68%);clip-path:polygon(55% 0,83% 3%,100% 100%,0 100%);mix-blend-mode:screen;z-index:1;pointer-events:none}
.bench-light-pool{position:absolute;left:18%;top:35%;width:72%;height:40%;background:radial-gradient(ellipse,#e6c88b38,transparent 68%);mix-blend-mode:screen;z-index:1}
.bench-scene .bench-object{left:19%;top:27%;width:62%;height:42%;object-fit:contain;z-index:2;filter:drop-shadow(8px 18px 11px #0a1c1bc9)}
.device-shadow{position:absolute;left:29%;top:59%;width:44%;height:10%;border-radius:50%;background:#061f1d6e;filter:blur(8px)}
.owned-bench-tools{position:absolute;left:7%;right:9%;bottom:22%;height:13%;display:flex;justify-content:center;gap:6%;z-index:2}
.owned-bench-tools>div{width:27%;display:flex;flex-direction:column;align-items:center;justify-content:flex-end;min-width:0}
.owned-bench-tools img{width:100%;height:87%;object-fit:contain;filter:drop-shadow(3px 5px 3px #092120a0)}
.owned-bench-tools span{font-size:9px;color:#bcc7a8;white-space:nowrap;text-shadow:0 2px 2px #0e2827}
.bench-grade{position:absolute;left:7%;bottom:19%;font-size:9px;letter-spacing:.18em;color:#b9bea0}.bench-grade i{padding:0 8px;color:#788e76}
.bench-depth-shade{position:absolute;inset:0;background:linear-gradient(0deg,#081f22 0%,#0b2627b0 13%,transparent 30%,transparent 91%,#071e2166);z-index:3;pointer-events:none}
@keyframes scope-sweep{from{transform:translateY(-100%)}to{transform:translateY(100%)}}
@media(max-height:480px){.scope-glass small{font-size:7px}.parts-organizer{top:12%;height:20%}.bench-scope{top:12%;width:33%}.owned-bench-tools{bottom:23%;height:15%;gap:3%}.owned-bench-tools span{font-size:7px}.bench-grade{display:none}.bench-scene .bench-object{top:29%;height:38%}}
</style>
