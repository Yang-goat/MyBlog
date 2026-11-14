import {ITEMS} from '../content';
import {nextOpeningExpiry} from './engine';
import type {GameState,ItemInstance} from './types';
export function foodFreshness(s:GameState,item:ItemInstance){
 if(ITEMS.find(d=>d.id===item.definitionId)?.category!=='food')return null;
 if(!item.known.includes('basic'))return {status:'unknown',text:'日期待检查'} as const;
 if(item.expiresDay===null)return {status:'fresh',text:'长期保存'} as const;
 const remaining=item.expiresDay-s.day;
 if(remaining<0)return {status:'expired',text:'已过期'} as const;
 if(remaining===0)return {status:'expiring',text:'今日到期'} as const;
 if(remaining===1)return {status:'expiring',text:'明日到期'} as const;
 return {status:'fresh',text:`第 ${item.expiresDay} 日到期`} as const;
}
export function foodOverview(s:GameState){
 const result={unknown:0,expired:0,expiresOvernight:0,cooled:0};
 for(const item of s.items){
  if(item.owner!=='player')continue;
  const freshness=foodFreshness(s,item);if(!freshness)continue;
  if(freshness.status==='unknown'){result.unknown++;continue;}
  if(freshness.status==='expired'){result.expired++;continue;}
  const expiry=nextOpeningExpiry(s,item);
  if(expiry!==null&&expiry<s.day+1)result.expiresOvernight++;
  if(expiry!==null&&item.expiresDay!==null&&expiry>item.expiresDay)result.cooled++;
 }
 return result;
}
