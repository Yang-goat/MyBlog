import type {CategoryId,Visitor} from './types';
import type {FactionId} from '../content/factions';
/** Each visitor's physical order is finite; saved legacy encounters keep their agreed rules. */
export const buyerRemaining=(v:Visitor)=>v.kind==='buyer'&&v.demand ? Math.max(0,v.demand.limit-v.demand.fulfilled) : Infinity;
export function purchaseQuantity(group:FactionId,category:CategoryId){
 const base:Record<FactionId,number>={neighborhood:2,union:3,grayline:3,uppercity:1,contractors:2,watch:2,freewave:2};
 return Math.min(4,base[group]+Number(category==='food'));
}
export function fulfillDemand(v:Visitor,count:number){if(v.demand)v.demand.fulfilled+=count;}
