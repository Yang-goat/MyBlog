import { describe, expect, it } from 'vitest';
import { applyAction, createGame, questProgress } from '../src/game/engine';
import { districtKeepsakes, questCorrespondence, todayResponse } from '../src/game/district';
import { QUESTS } from '../src/content';
import { QUEST_REPLIES } from '../src/content/stories';
import { exportSave, importSave } from '../src/persistence/storage';
import { act, playToWin, repairActive } from './helpers';

describe('district choices and correspondence',()=>{
 it('keeps free choices in the ledger without creating income or charging twice',()=>{
  const before=createGame(42),s=act(before,{type:'eventChoice',index:0});
  expect(s.cash).toBe(before.cash);expect(s.ledger.filter(e=>e.kind==='event')).toMatchObject([{day:1,amount:0,note:'提供应急联络'}]);
  expect(todayResponse(importSave(exportSave(s)))?.label).toBe('提供应急联络');
  const repeated=applyAction(s,{type:'eventChoice',index:1});expect(repeated.ok).toBe(false);expect(repeated.state).toEqual(s);
  const next=act(act(s,{type:'closeDay'}),{type:'openDay'});expect(todayResponse(next)).toBeUndefined();
  const paid=act(next,{type:'eventChoice',index:0});expect(paid.cash).toBe(next.cash-60);expect(todayResponse(paid)?.label).toBe('赞助加餐');
 });
 it('unlocks a reply only after the real stage is claimed and preserves its received date',()=>{
  let s=createGame(42);for(let n=0;n<3;n++)s=repairActive(act(s,{type:'acceptRepair'}));
  expect(questProgress(s,'neighborhood-line').ready).toBe(true);expect(questCorrespondence(s,'neighborhood-line')).toEqual([]);
  const cash=s.cash;s=act(s,{type:'claimQuest',questId:'neighborhood-line'});
  expect(s.cash).toBe(cash+140);expect(questCorrespondence(s,'neighborhood-line')).toMatchObject([{stage:1,day:1,author:'林桥'}]);
  expect(districtKeepsakes(s)).toEqual([]);expect(questCorrespondence(importSave(exportSave(s)),'neighborhood-line')).toEqual(questCorrespondence(s,'neighborhood-line'));
 });
 it('keeps earned letters and mementos across an actual career and old missing records',()=>{
  const s=playToWin('precision');const gifts=districtKeepsakes(s);expect(gifts.some(g=>g.name==='工坊铭牌')).toBe(true);expect(gifts.some(g=>g.name==='夜班联络卡')).toBe(true);
  const old=structuredClone(s);old.ledger=[];const letters=questCorrespondence(old,'workshop-trust');expect(letters).toHaveLength(3);expect(letters.every(l=>l.day===undefined)).toBe(true);
  old.eventResolved=true;expect(todayResponse(old)).toBeUndefined();
 });
 it('provides one distinct reply for every existing stage and reserves keepsakes for completed stories',()=>{
  expect(Object.keys(QUEST_REPLIES).sort()).toEqual(QUESTS.map(q=>q.id).sort());
  for(const q of QUESTS){const replies=QUEST_REPLIES[q.id]!;expect(replies).toHaveLength(q.stages.length);expect(new Set(replies.map(r=>r.title)).size).toBe(replies.length);expect(replies.slice(0,-1).every(r=>!r.keepsake)).toBe(true);expect(replies.at(-1)?.keepsake).toBeTruthy();}
 });
});
