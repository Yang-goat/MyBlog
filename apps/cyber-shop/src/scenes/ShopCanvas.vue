<script setup lang="ts">
import { onMounted, onUnmounted, ref, watch } from 'vue';
import { state, reducedMotion, listen } from '../ui/store';
import { drawRoom,type RoomSurfaces } from './room-renderer';
import { dailyHours } from '../game/modifiers';
defineProps<{ blocked: boolean; sceneryOnly?: boolean }>();
const canvas = ref<HTMLCanvasElement>();
let observer: ResizeObserver | undefined;
let surfaceObserver:ResizeObserver|undefined,warehouseScroll:HTMLElement|undefined;
let surfaces:RoomSurfaces={},measureFrame=0;
let frame = 0, previous = 0, elapsed = 0, pointer = 0, targetPointer = 0;
let manualTime = false;
let stopWatch: (() => void) | undefined;
let stopListen: (() => void) | undefined;
let pulse = 0;
const street=new Image();
const metal=new Image();
const terminal=new Image();
const solder=new Image();
const cup = new Image();
const plant = new Image();
function render() {
  const el=canvas.value,ctx=el?.getContext('2d'); if(!el||!ctx)return;
  drawRoom(ctx,el.width,el.height,{day:state.value.day,hours:state.value.hours,maxHours:dailyHours(state.value),closed:state.value.phase!=='open',chapter:state.value.chapter,repairs:state.value.records.repairs,equipment:state.value.equipment,motion:!reducedMotion.value,pointer,time:elapsed,owned:state.value.victory,surfaces},{street,metal,terminal,solder,cup,plant});
  if(pulse>0&&!reducedMotion.value&&surfaces.trade){const r=surfaces.trade;ctx.fillStyle=`rgba(182,221,178,${pulse*.08})`;ctx.fillRect(r.x,r.y,r.width,r.height);}
}
function measureSurfaces(){
  measureFrame=0;const el=canvas.value,room=el?.closest('.shop-room');if(!el||!room)return;
  const canvasBox=el.getBoundingClientRect();if(!canvasBox.width||!canvasBox.height)return;
  const next:RoomSurfaces={};
  for(const [key,selector] of [['incoming','[data-zone="incoming"] .surface-grid'],['trade','[data-zone="trade"] .surface-grid'],['warehouse','.warehouse-grid']] as const){
    const grid=room.querySelector(selector);if(!grid)continue;
    const r=grid.getBoundingClientRect(),clip=key==='warehouse'?warehouseScroll?.getBoundingClientRect():undefined;
    const left=Math.max(r.left,clip?.left??r.left),top=Math.max(r.top,clip?.top??r.top),right=Math.min(r.right,clip?.right??r.right),bottom=Math.min(r.bottom,clip?.bottom??r.bottom);
    if(right>left&&bottom>top)next[key]={x:(left-canvasBox.left)/canvasBox.width*1440,y:(top-canvasBox.top)/canvasBox.height*900,width:(right-left)/canvasBox.width*1440,height:(bottom-top)/canvasBox.height*900};
  }
  surfaces=next;el.dataset.inventorySurfaces=JSON.stringify(next);render();
}
function scheduleMeasure(){if(!measureFrame)measureFrame=requestAnimationFrame(measureSurfaces);}
function resize(){const el=canvas.value;if(!el)return;const box=el.getBoundingClientRect();const dpr=Math.min(2,window.devicePixelRatio||1);el.width=Math.round(box.width*dpr);el.height=Math.round(box.height*dpr);measureSurfaces();}
function tick(now:number){frame=requestAnimationFrame(tick);if(document.hidden||manualTime)return;const delta=Math.min(64,now-previous);if(delta<32)return;previous=now;elapsed+=delta;pointer+=(targetPointer-pointer)*.08;pulse=Math.max(0,pulse-delta/650);if(!reducedMotion.value)render();}
function move(e:PointerEvent){targetPointer=e.clientX/window.innerWidth*2-1;}
const advance=async(ms:number)=>{if(!Number.isFinite(ms)||ms<0)return;manualTime=true;elapsed+=Math.min(ms,10000);pulse=Math.max(0,pulse-ms/650);render();};
onMounted(()=>{
  street.onload=render;street.src='/cyber-shop/scenery/neon-ninth-street.webp';
  metal.onload=render;metal.src='/cyber-shop/scenery/patina-metal.webp';
  terminal.onload=render;terminal.src='/cyber-shop/scenery/neon-terminal.webp';
  solder.onload=render;solder.src='/cyber-shop/scenery/neon-solder-station.webp';
  cup.onload = render;
  cup.src = '/cyber-shop/scenery/enamel-cup.webp';
  plant.onload = render;
  plant.src = '/cyber-shop/scenery/jade-plant.webp';
  const room=canvas.value!.closest('.shop-room');warehouseScroll=room?.querySelector<HTMLElement>('.warehouse-scroll')??undefined;
  resize();observer=new ResizeObserver(resize);observer.observe(canvas.value!);
  surfaceObserver=new ResizeObserver(scheduleMeasure);room?.querySelectorAll('.surface-grid,.warehouse-grid,.warehouse-scroll,.warehouse-section>header').forEach(el=>surfaceObserver!.observe(el));warehouseScroll?.addEventListener('scroll',scheduleMeasure,{passive:true});
  frame=requestAnimationFrame(tick);window.addEventListener('pointermove',move);
  stopWatch=watch([state,reducedMotion],scheduleMeasure,{flush:'post'});
  stopListen=listen(events=>{if(events.some(e=>e.type==='trade'||e.type==='repair')){pulse=1;render();}});
  window.advanceTime=advance;
});
onUnmounted(()=>{cancelAnimationFrame(frame);cancelAnimationFrame(measureFrame);observer?.disconnect();surfaceObserver?.disconnect();warehouseScroll?.removeEventListener('scroll',scheduleMeasure);stopWatch?.();stopListen?.();window.removeEventListener('pointermove',move);if(window.advanceTime===advance)delete window.advanceTime;});
</script>
<template><div class="canvas-root layered-room"><canvas ref="canvas" aria-label="分层绘制的第九街店铺：雨夜街景、灯具、柜体和工作台"></canvas></div></template>
<style scoped>.layered-room{position:absolute;inset:0;pointer-events:none}.layered-room canvas{display:block;width:100%;height:100%}</style>
