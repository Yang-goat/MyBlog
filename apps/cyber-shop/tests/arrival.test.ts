import {it,expect} from 'vitest';
import {createGame,applyAction} from '../src/game/engine';
import {exportSave,importSave} from '../src/persistence/storage';
it('waits for an explicit call on the first day and every subsequent day',()=>{
 let s=createGame(42);expect(s.visitorArrived).toBe(false);
 expect(applyAction(s,{type:'talk',visitorId:s.visitors[0]!.id}).ok).toBe(false);
 expect(applyAction(s,{type:'acceptRepair',visitorId:s.visitors[0]!.id}).ok).toBe(false);
 s=applyAction(s,{type:'callVisitor'}).state;expect(s.visitorIndex).toBe(0);expect(s.visitorArrived).toBe(true);
 expect(applyAction(s,{type:'callVisitor'}).ok).toBe(false);
 s=applyAction(s,{type:'reject',visitorId:s.visitors[0]!.id}).state;s=applyAction(s,{type:'callVisitor'}).state;expect(s.visitorIndex).toBe(1);
 s=applyAction(s,{type:'closeDay'}).state;expect(applyAction(s,{type:'callVisitor'}).ok).toBe(false);
 s=applyAction(s,{type:'openDay'}).state;expect(s.visitorArrived).toBe(false);expect(s.visitorIndex).toBe(0);
 s=importSave(exportSave(s));expect(s.visitorArrived).toBe(false);expect(s.conversations).toBeUndefined();
 s=applyAction(s,{type:'callVisitor'}).state;expect(s.visitorArrived).toBe(true);expect(s.visitorIndex).toBe(0);
});
