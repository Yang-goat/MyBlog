import { EQUIPMENT, FAULTS } from '../content';
import { applyAction } from './engine';
import type { Action, GameState } from './types';

export type RepairAction = Extract<Action, {type:'repair'}>;
/** Preview uses the same transaction as execution; it never changes the input. */
export function repairPlan(s:GameState,action:RepairAction){
 const transaction=applyAction(s,action),next=transaction.state;
 const before=s.orders.find(o=>o.id===action.orderId),after=next.orders.find(o=>o.id===action.orderId);
 const item=s.items.find(i=>i.id===before?.itemId),result=next.items.find(i=>i.id===before?.itemId);
 const step=transaction.ok?after?.steps?.at(-1):undefined;
 const entries=next.ledger.slice(s.ledger.length);
 const materialId=step?.preserve?'electronic-parts':FAULTS.find(f=>f.id===step?.faultId)?.material??'cleaner';
 const material=EQUIPMENT.find(e=>e.id===materialId);
 const source=entries.some(e=>e.kind==='escrow-material')?'escrow':entries.some(e=>e.kind==='material-use')?'stock':entries.some(e=>e.kind==='repair-material')?'cash':entries.some(e=>e.kind==='material-saving')?'saved':null;
 const recovered=EQUIPMENT.filter(e=>e.type==='material').map(e=>({id:e.id,name:e.name,count:(next.equipment[e.id]??0)-(s.equipment[e.id]??0)+(source==='stock'&&e.id===materialId?1:0)})).filter(e=>e.count>0);
 return {ok:transaction.ok,message:transaction.events[0]?.text??'',miss:step?.result==='miss',hours:s.hours-next.hours,cash:s.cash-next.cash,escrow:(before?.escrow??0)-(after?.escrow??0),source,materialName:material?.name??materialId,materialId,costAdded:(result?.cost??0)-(item?.cost??0),originalityLoss:(item?.originality??0)-(result?.originality??0),recovered};
}
export type RepairPlan = ReturnType<typeof repairPlan>;
