import type {GameState,ItemInstance,Visitor} from './types';

/** An amount preview is conditional on acceptance; it never predicts hidden price limits. */
export function tradePaymentPreview(s:GameState,v:Visitor,goods:ItemInstance[],amount:number){
 if(!goods.length||v.kind==='repair'||!Number.isSafeInteger(amount)||amount<=0)return null;
 const buying=v.kind==='seller',cost=goods.reduce((n,i)=>n+i.cost,0);
 const budget=buying?s.cash:v.budget??Math.max(400,v.quote*4);
 return {amount,cashAfter:s.cash+(buying?-amount:amount),cost:buying?amount:cost,margin:buying?null:amount-cost,shortfall:Math.max(0,amount-budget)};
}
