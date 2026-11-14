import { CHARACTERS, EVENTS, QUESTS } from '../content';
import { QUEST_REPLIES } from '../content/stories';
import type { GameState } from './types';

export function questCorrespondence(s:GameState,questId:string){
 const quest=QUESTS.find(q=>q.id===questId);if(!quest)return [];
 const received=Math.min(s.questStages[questId]??0,quest.stages.length);
 return (QUEST_REPLIES[questId]??[]).slice(0,received).map((reply,index)=>({
  ...reply,id:`${questId}:${index+1}`,stage:index+1,author:CHARACTERS.find(c=>c.id===quest.character)?.name??'',
  day:s.ledger.find(e=>e.kind==='quest'&&e.note===`${quest.name}第 ${index+1} 阶段`)?.day,
 }));
}
export function districtKeepsakes(s:GameState){
 return QUESTS.flatMap(q=>questCorrespondence(s,q.id).filter(letter=>letter.keepsake).map(letter=>({id:letter.id,name:letter.keepsake!,author:letter.author,day:letter.day})));
}
/** Older free choices were not logged. Do not infer them from a resolved flag. */
export function todayResponse(s:GameState){
 if(!s.eventResolved)return undefined;
 const event=EVENTS.find(e=>e.id===s.eventId);if(!event)return undefined;
 const entry=s.ledger.find(e=>e.day===s.day&&e.kind==='event'&&event.choices.some(c=>c.label===e.note));
 return entry?event.choices.find(c=>c.label===entry.note):undefined;
}
