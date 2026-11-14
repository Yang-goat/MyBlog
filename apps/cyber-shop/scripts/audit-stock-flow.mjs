/** Bounded rules simulation for stock turnover; this is not browser-play evidence. */
import {createServer} from 'vite';
import fs from 'node:fs/promises';
const server=await createServer({server:{middlewareMode:true}});
try{
 const e=await server.ssrLoadModule('/src/game/engine.ts');
 const {rootLayout}=await server.ssrLoadModule('/src/game/containers.ts');
 const {buyerRemaining}=await server.ssrLoadModule('/src/game/demand.ts');
 const {ITEMS}=await server.ssrLoadModule('/src/content/index.ts');
 const {repairActive}=await server.ssrLoadModule('/tests/helpers.ts');
 const report=[];
 for(const seed of [42,71,11052026])for(const strategy of ['single','bulk']){
  let s=e.createGame(seed);const days=[];
  function act(a){const r=e.applyAction(s,a);if(r.ok)s=r.state;return r.ok;}
  function store(){for(const i of s.items.filter(i=>i.location==='counter')){const projected=structuredClone(s),item=projected.items.find(x=>x.id===i.id);item.location='stock';delete item.grid;const at=rootLayout(projected,e.rootCapacity(s)).positions[i.id];if(at)act({type:'moveStock',itemId:i.id,...at});}}
  for(let n=0;n<10;n++){
   if(s.phase==='closed')act({type:'openDay'});
   for(let index=0;index<7;index++){
    act({type:'callVisitor'});const v=s.visitors[s.visitorIndex];if(!v||v.resolved)break;
    if(v.kind==='repair'){if(act({type:'acceptRepair',visitorId:v.id}))s=repairActive(s);}
    if(v.kind==='seller'){
     const ids=[];let cost=0;for(const item of v.goods??[]){const price=e.tradeQuote(s,v,item);if(s.cash-cost-price<e.operatingFees(s))continue;ids.push(item.id);cost+=price;if(strategy==='single')break;}
     if(ids.length)act({type:'tradeBatch',visitorId:v.id,itemIds:ids});store();
    }
    if(v.kind==='buyer'){
     let budget=v.budget??400;const ids=[];for(const item of s.items.filter(i=>i.owner==='player'&&['stock','counter'].includes(i.location)&&ITEMS.find(d=>d.id===i.definitionId)?.category===v.category)){
      if(ids.length>=buyerRemaining(v))break;const price=e.tradeQuote(s,v,item);if(price>0&&price<=budget){ids.push(item.id);budget-=price;}
     }
     if(ids.length)act({type:'tradeBatch',visitorId:v.id,itemIds:ids});
    }
    if(!s.visitors[s.visitorIndex].resolved)act({type:'reject',visitorId:v.id});
   }
   store();const closed=act({type:'closeDay'});days.push({day:s.day,cash:s.cash,cells:e.stockUsage(s)*4,items:s.items.filter(i=>i.owner==='player').length,closed,phase:s.phase});if(!closed||s.phase==='failed')break;
  }
  report.push({seed,strategy,days});
 }
 const output=process.env.CYBER_STOCK_AUDIT||'evidence/living-shop/stock-flow-latest.json';await fs.mkdir(output.slice(0,output.lastIndexOf('/')),{recursive:true});await fs.writeFile(output,JSON.stringify({kind:'rules-simulation',report},null,2));
 console.log(JSON.stringify(report.map(r=>({seed:r.seed,strategy:r.strategy,firstThree:r.days.slice(0,3),last:r.days.at(-1)})),null,2));
}finally{await server.close();}
