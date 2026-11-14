import { nextTick, type ObjectDirective } from 'vue';

const selector='button:not(:disabled),a[href],input:not(:disabled),select:not(:disabled),textarea:not(:disabled),summary,[tabindex]';
const cleanups=new WeakMap<HTMLElement,()=>void>();
const candidates=(el:HTMLElement)=>Array.from(el.querySelectorAll<HTMLElement>(selector)).filter(n=>n.tabIndex>=0&&!n.closest('[inert],[hidden]')&&n.getClientRects().length>0);
/** Keep keyboard navigation inside the visible overlay, then return to its trigger. */
export const vDialogFocus:ObjectDirective<HTMLElement>={
 mounted(el){
  const previous=document.activeElement instanceof HTMLElement?document.activeElement:undefined;
  el.tabIndex=-1;
  const focusFirst=()=>{if(el.isConnected)(candidates(el)[0]??el).focus({preventScroll:true});};
  void nextTick(focusFirst);
  const key=(e:KeyboardEvent)=>{
   if(e.key!=='Tab')return;
   const nodes=candidates(el),first=nodes[0],last=nodes.at(-1),current=document.activeElement;
   if(!first){e.preventDefault();el.focus();return;}
   if(!el.contains(current)||(e.shiftKey?current===first||current===el:current===last)){e.preventDefault();(e.shiftKey?last:first)?.focus();}
  };
  el.addEventListener('keydown',key);
  cleanups.set(el,()=>{el.removeEventListener('keydown',key);void nextTick(()=>{if(previous?.isConnected&&!previous.closest('[inert]'))previous.focus({preventScroll:true});});});
 },
 updated(el){if(!el.contains(document.activeElement))void nextTick(()=>{if(el.isConnected&&!el.contains(document.activeElement))(candidates(el)[0]??el).focus({preventScroll:true});});},
 unmounted(el){cleanups.get(el)?.();cleanups.delete(el);},
};
