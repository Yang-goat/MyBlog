import {CHARACTERS,ITEMS} from '../content';
import {FACTIONS,faction,type FactionId} from '../content/factions';
import type {GameState,ItemInstance,Visitor} from './types';
export const CONTACT_RELATION=6,TRUSTED_RELATION=16;
export const factionFor=(characterId:string)=>faction(CHARACTERS.find(c=>c.id===characterId)?.group??'neighborhood')!;
export const trusted=(s:GameState,id:FactionId)=>(s.relations[id]??0)>=TRUSTED_RELATION;
export const relationName=(value:number)=>value<0?'疏远':value<CONTACT_RELATION?'初识':value<TRUSTED_RELATION?'熟客':'信任';
export const factionKnown=(s:GameState,id:FactionId)=>CHARACTERS.some(c=>c.group===id&&s.met.includes(c.id))||(s.relations[id]??0)!==0;
export function buyerPreference(s:GameState,v:Visitor,item:ItemInstance){
 const group=factionFor(v.characterId),category=ITEMS.find(d=>d.id===item.definitionId)!.category;
 let multiplier=group.buyer;
 if(group.id==='uppercity'&&item.condition>=85&&!item.faults.length)multiplier*=trusted(s,'uppercity')?1.2:1.15;
 if(group.id==='contractors'&&!item.faults.length)multiplier*=1.08;
 if(group.id==='watch'&&item.known.includes('serial')&&item.authentic&&item.provenance.includes('可追溯'))multiplier*=1.1;
 if(group.id==='freewave'&&['data','energy'].includes(category))multiplier*=1.08;
 return multiplier;
}
/** One successful encounter earns trust once, even if goods are split into many receipts. */
export function recordTradeRelation(s:GameState,v:Visitor){
 if(v.relationCredited||v.lastTrade)return;
 const group=factionFor(v.characterId);s.relations[group.id]=(s.relations[group.id]??0)+1;v.relationCredited=true;
 if(!s.met.includes(v.characterId))s.met.push(v.characterId);
}
export const factionStoragePrice=(s:GameState,characterId:string,price:number)=>Math.round(price*(factionFor(characterId).id==='grayline'&&trusted(s,'grayline') ? .85 : 1));
export function factionVisit(s:GameState):FactionId|undefined{
 if(s.factionAppointment)return s.factionAppointment;
 if(s.day<2)return undefined;
 const rotation:FactionId[]=['uppercity','contractors','watch','freewave','neighborhood','union','grayline'];return rotation[(s.day-2)%rotation.length];
}
export function factionContacts(s:GameState){return FACTIONS.map(f=>({...f,known:factionKnown(s,f.id),relation:s.relations[f.id]??0,level:relationName(s.relations[f.id]??0),canAppoint:factionKnown(s,f.id)&&(s.relations[f.id]??0)>=CONTACT_RELATION,trusted:trusted(s,f.id)}));}
