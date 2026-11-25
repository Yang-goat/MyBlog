import type {Action,GameState,ItemInstance,StorageContainer} from './types';

type ObjectLayout=Pick<ItemInstance,'id'|'location'|'containerId'|'grid'|'counterGrid'>;
type Snapshot={items:ObjectLayout[];containers:ObjectLayout[]};
const layoutActions=new Set<Action['type']>(['moveStock','moveStorage','moveCounter','sort']);
const captureObject=(o:ItemInstance|StorageContainer):ObjectLayout=>({id:o.id,location:o.location,...(o.containerId?{containerId:o.containerId}:{}),...(o.grid?{grid:{...o.grid}}:{}),...(o.counterGrid?{counterGrid:{...o.counterGrid}}:{})});
const capture=(s:GameState):Snapshot=>({items:s.items.map(captureObject),containers:(s.containers??[]).map(captureObject)});
const signature=(s:Snapshot)=>JSON.stringify(s);
function restore<T extends ItemInstance|StorageContainer>(objects:T[],snapshot:ObjectLayout[]):T[]{
 const byId=new Map(objects.map(o=>[o.id,o]));
 return snapshot.map(at=>{const o={...byId.get(at.id)!};delete o.grid;delete o.counterGrid;delete o.containerId;return Object.assign(o,structuredClone(at));});
}

/** Session-only placement history. Economics and elapsed work are never rewound. */
export function createLayoutHistory(limit=20){
 const steps:{before:Snapshot;after:string}[]=[];
 return {
  get size(){return steps.length;},
  clear(){steps.length=0;},
  record(before:GameState,after:GameState,action:Action){
   if(action.type==='focusCareer')return;
   if(!layoutActions.has(action.type)){steps.length=0;return;}
   const from=capture(before),to=signature(capture(after));
   if(signature(from)===to)return;
   steps.push({before:from,after:to});if(steps.length>limit)steps.shift();
  },
  undo(current:GameState):GameState|undefined{
   const step=steps.at(-1);if(!step)return;
   // Guard against any future mutation path bypassing the store's action barrier.
   if(signature(capture(current))!==step.after){steps.length=0;return;}
   steps.pop();
   return {...current,items:restore(current.items,step.before.items),...(current.containers?{containers:restore(current.containers,step.before.containers)}:{})};
  },
 };
}
