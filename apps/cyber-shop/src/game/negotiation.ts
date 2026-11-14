/** Split a positive integer quote without exceeding any per-item willingness ceiling. */
export function allocateQuote(total:number,ceilings:number[]):number[]{
 if(!ceilings.length||!Number.isSafeInteger(total)||ceilings.some(n=>!Number.isSafeInteger(n)||n<1)||total<ceilings.length||total>ceilings.reduce((n,c)=>n+c,0))throw new Error('Invalid negotiated allocation');
 const remainder=total-ceilings.length,room=ceilings.map(c=>c-1),available=room.reduce((n,c)=>n+c,0);
 const prices=room.map(c=>1+(available?Math.floor(remainder*c/available):0));
 let leftover=total-prices.reduce((n,c)=>n+c,0);
 for(let i=0;leftover>0;i=(i+1)%prices.length)if(prices[i]!<ceilings[i]!){prices[i]!++;leftover--;}
 return prices;
}
