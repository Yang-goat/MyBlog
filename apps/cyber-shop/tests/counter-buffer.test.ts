import {it,expect} from 'vitest';
import {createGame,applyAction,capacity} from '../src/game/engine';
import {warehouseLayout} from '../src/game/warehouse';
import {exportSave,importSave} from '../src/persistence/storage';
it('uses the counter as persistent temporary space even without a visitor, then requires it empty to close',()=>{
 let s=createGame(42);const [a,b]=s.items;const before=warehouseLayout(s.items,capacity(s)).positions;const pos=before[a!.id]!;
 let result=applyAction(s,{type:'moveCounter',itemId:a!.id,x:6,y:0,rotated:false});expect(result.ok).toBe(true);s=result.state;
 expect(s.items.find(i=>i.id===a!.id)!.location).toBe('counter');expect(s.visitorArrived).toBe(false);
 expect(warehouseLayout(s.items,capacity(s)).positions[a!.id]).toBeUndefined();
 for(const other of s.items.filter(i=>i.id!==a!.id)) expect(other.grid).toEqual(before[other.id]);
 result=applyAction(s,{type:'moveStock',itemId:b!.id,...pos});expect(result.ok).toBe(true);s=result.state;
 expect(applyAction(s,{type:'moveCounter',itemId:b!.id,x:6,y:0,rotated:false}).state).toEqual(s);
 s=importSave(exportSave(s));expect(s.items.find(i=>i.id===a!.id)!.counterGrid).toEqual({x:6,y:0,rotated:false});
 const rejected=applyAction(s,{type:'closeDay'});expect(rejected.ok).toBe(false);expect(rejected.state).toEqual(s);
 const restored=warehouseLayout(s.items.map(i=>i.id===a!.id?{...i,location:'stock'}:i),capacity(s)).positions[a!.id]!;
 s=applyAction(s,{type:'moveStock',itemId:a!.id,...restored}).state;expect(applyAction(s,{type:'closeDay'}).ok).toBe(true);
});
it('does not take NPC goods as owned buffer stock and retains buffered items when calling guests',()=>{
 let s=createGame(42);expect(applyAction(s,{type:'moveCounter',itemId:s.visitors[0]!.item!.id,x:0,y:0,rotated:false}).ok).toBe(false);
 const id=s.items[0]!.id;s=applyAction(s,{type:'moveCounter',itemId:id,x:6,y:0,rotated:false}).state;s=applyAction(s,{type:'callVisitor'}).state;
 s=applyAction(s,{type:'reject',visitorId:s.visitors[0]!.id}).state;s=applyAction(s,{type:'callVisitor'}).state;
 expect(s.items.find(i=>i.id===id)!.location).toBe('counter');expect(s.visitorIndex).toBe(1);
});
it('lets a buyer purchase matching self-owned stock already placed on the counter',()=>{
 let s=createGame(42);const id=s.items[0]!.id;s=applyAction(s,{type:'moveCounter',itemId:id,x:0,y:0,rotated:false}).state;
 s=applyAction(s,{type:'callVisitor'}).state;const visitor=s.visitors[0]!;visitor.kind='buyer';visitor.category='food';visitor.limit=15000;visitor.budget=10000;
 const result=applyAction(s,{type:'tradeBatch',visitorId:visitor.id,itemIds:[id]});expect(result.ok).toBe(true);expect(result.state.items.some(i=>i.id===id)).toBe(false);
});
