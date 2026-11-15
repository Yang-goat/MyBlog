/** Require two completed taps on the same object, independent of browser click retargeting. */
export function createItemTapTracker(){
 let last:{id:string;time:number;x:number;y:number}|undefined;
 let pair:{id:string;time:number}|undefined;
 return {
  reset(){last=undefined;pair=undefined;},
  tap(id:string,time:number,x:number,y:number){
   pair=last?.id===id&&time-last.time<=500&&Math.hypot(x-last.x,y-last.y)<=24?{id,time}:undefined;
   last={id,time,x,y};
  },
  consume(id:string,time:number){const valid=pair?.id===id&&time-pair.time<=150;pair=undefined;if(valid)last=undefined;return valid;},
 };
}
