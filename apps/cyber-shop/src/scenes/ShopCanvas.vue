<script setup lang="ts">
import { onMounted, onUnmounted, ref, watch } from 'vue';
import { state, reducedMotion, listen } from '../ui/store';
import { drawRoom } from './room-renderer';
defineProps<{ blocked: boolean; sceneryOnly?: boolean }>();
const canvas = ref<HTMLCanvasElement>();
let observer: ResizeObserver | undefined;
let frame = 0, previous = 0, elapsed = 0, pointer = 0, targetPointer = 0;
let manualTime = false;
let stopWatch: (() => void) | undefined;
let stopListen: (() => void) | undefined;
let pulse = 0;
const street=new Image();
const metal=new Image();
const terminal=new Image();
const solder=new Image();
function render() {
  const el=canvas.value,ctx=el?.getContext('2d'); if(!el||!ctx)return;
  drawRoom(ctx,el.width,el.height,{day:state.value.day,hours:state.value.hours,closed:state.value.phase!=='open',chapter:state.value.chapter,repairs:state.value.records.repairs,equipment:state.value.equipment,motion:!reducedMotion.value,pointer,time:elapsed,owned:state.value.victory},{street,metal,terminal,solder});
  if(pulse>0&&!reducedMotion.value){ctx.setTransform(1,0,0,1,0,0);ctx.fillStyle=`rgba(182,221,178,${pulse*.08})`;ctx.fillRect(el.width*.24,el.height*.55,el.width*.52,el.height*.11);}
}
function resize(){const el=canvas.value;if(!el)return;const box=el.getBoundingClientRect();const dpr=Math.min(2,window.devicePixelRatio||1);el.width=Math.round(box.width*dpr);el.height=Math.round(box.height*dpr);render();}
function tick(now:number){frame=requestAnimationFrame(tick);if(document.hidden||manualTime)return;const delta=Math.min(64,now-previous);if(delta<32)return;previous=now;elapsed+=delta;pointer+=(targetPointer-pointer)*.08;pulse=Math.max(0,pulse-delta/650);if(!reducedMotion.value)render();}
function move(e:PointerEvent){targetPointer=e.clientX/window.innerWidth*2-1;}
const advance=async(ms:number)=>{if(!Number.isFinite(ms)||ms<0)return;manualTime=true;elapsed+=Math.min(ms,10000);pulse=Math.max(0,pulse-ms/650);render();};
onMounted(()=>{
  street.onload=render;street.src='/cyber-shop/scenery/neon-ninth-street.webp';
  metal.onload=render;metal.src='/cyber-shop/scenery/patina-metal.webp';
  terminal.onload=render;terminal.src='/cyber-shop/scenery/neon-terminal.webp';
  solder.onload=render;solder.src='/cyber-shop/scenery/neon-solder-station.webp';
  resize();observer=new ResizeObserver(resize);observer.observe(canvas.value!);
  frame=requestAnimationFrame(tick);window.addEventListener('pointermove',move);
  stopWatch=watch([state,reducedMotion],render);
  stopListen=listen(events=>{if(events.some(e=>e.type==='trade'||e.type==='repair')){pulse=1;render();}});
  window.advanceTime=advance;
});
onUnmounted(()=>{cancelAnimationFrame(frame);observer?.disconnect();stopWatch?.();stopListen?.();window.removeEventListener('pointermove',move);if(window.advanceTime===advance)delete window.advanceTime;});
</script>
<template><div class="canvas-root layered-room"><canvas ref="canvas" aria-label="分层绘制的第九街店铺：雨夜街景、灯具、柜体和工作台"></canvas></div></template>
<style scoped>.layered-room{position:absolute;inset:0;pointer-events:none}.layered-room canvas{display:block;width:100%;height:100%}</style>
