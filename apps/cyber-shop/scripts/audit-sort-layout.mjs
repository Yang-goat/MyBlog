// Bounded packing audit, not a normal-play or imported-save fixture.
import {createServer} from 'vite';
import fs from 'node:fs/promises';
const server=await createServer({root:'apps/cyber-shop',server:{middlewareMode:true}});
const out=process.env.CYBER_EVIDENCE_DIR||'apps/cyber-shop/evidence/living-shop/sort-audit-latest';await fs.mkdir(out,{recursive:true});
try{
 const {createGame,applyAction,rootCapacity}=await server.ssrLoadModule('/src/game/engine.ts');
 const {firstObjectPlace,putObject,rootLayout}=await server.ssrLoadModule('/src/game/containers.ts');
 const {ITEMS}=await server.ssrLoadModule('/src/content/index.ts');
 const rows=[];let saved=false;
 for(let seed=1;seed<=50;seed++){
  const s=createGame(seed),template=s.items[0];s.items=[];let rng=seed;
  for(let n=0;n<48;n++){
   rng=(Math.imul(rng,1664525)+1013904223)>>>0;const d=ITEMS[rng%ITEMS.length];
   const item={...template,id:`item-${900+n}`,definitionId:d.id,grid:undefined,expiresDay:d.category==='food'?2+n%4:null};
   const at=firstObjectPlace(s,rootCapacity(s),item);if(at){putObject(item,at);s.items.push(item);}
  }
  const before=rootLayout(s,rootCapacity(s)),result=applyAction(s,{type:'sort'}),after=rootLayout(result.state,rootCapacity(result.state));
  const newOverflow=after.overflow.filter(id=>!before.overflow.includes(id));
  rows.push({seed,count:s.items.length,ok:result.ok,newOverflow,beforeHours:s.hours,afterHours:result.state.hours});
  if(newOverflow.length&&!saved){await fs.writeFile(`${out}/packing-example.json`,JSON.stringify({state:s,before,after,events:result.events},null,2));saved=true;}
 }
 const report={cases:rows.length,newOverflowCases:rows.filter(r=>r.newOverflow.length).length,rejected:rows.filter(r=>!r.ok).length,rows};
 await fs.writeFile(`${out}/results.json`,JSON.stringify(report,null,2));console.log(JSON.stringify({cases:report.cases,newOverflowCases:report.newOverflowCases,rejected:report.rejected}));
}finally{await server.close();}
