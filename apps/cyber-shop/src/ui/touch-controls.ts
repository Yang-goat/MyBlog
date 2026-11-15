import type {Directive} from 'vue';

/** A completed touch activates inventory controls once, even after a drag suppresses compatibility clicks. */
export const vTouchControls:Directive<HTMLElement>={
 mounted(el){
  let down:{button:HTMLButtonElement;x:number;y:number;id:number}|undefined;
  let activated:{button:HTMLButtonElement;time:number}|undefined;
  const button=(target:EventTarget|null)=>target instanceof Element?target.closest<HTMLButtonElement>('button'):null;
  el.addEventListener('pointerdown',e=>{const b=button(e.target);down=e.pointerType==='touch'&&b&&!b.disabled?{button:b,x:e.clientX,y:e.clientY,id:e.pointerId}:undefined;});
  el.addEventListener('pointercancel',()=>{down=undefined;});
  el.addEventListener('pointerup',e=>{
   const start=down;down=undefined;
   if(!start||e.pointerId!==start.id||Math.hypot(e.clientX-start.x,e.clientY-start.y)>8||start.button.disabled)return;
   activated={button:start.button,time:e.timeStamp};start.button.click();
  });
  el.addEventListener('click',e=>{
   if(e.isTrusted&&e.detail>0&&activated?.button===button(e.target)&&e.timeStamp-activated.time<700){e.preventDefault();e.stopImmediatePropagation();}
  },true);
 },
};
