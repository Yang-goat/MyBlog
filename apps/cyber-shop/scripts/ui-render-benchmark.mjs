/** Isolated scene benchmark, using the same renderer and assets as the real shop. */
import { chromium } from 'playwright';
import fs from 'node:fs/promises';
const out='apps/cyber-shop/evidence/living-shop/render-benchmark';await fs.mkdir(out,{recursive:true});
const label=process.env.CYBER_BENCH_LABEL||'baseline';
const browser=await chromium.launch({headless:true});const page=await browser.newPage({viewport:{width:1440,height:960}});
try{
 await page.goto('http://127.0.0.1:4175/cyber-shop/');
 const result=await page.evaluate(async()=>{
  const {drawRoom}=await import('/cyber-shop/src/scenes/room-renderer.ts');
  const art=Object.fromEntries(await Promise.all(Object.entries({street:'ninth-street',metal:'patina-metal',terminal:'crt-terminal',solder:'solder-station'}).map(async([key,id])=>{const img=new Image();img.src=`/cyber-shop/scenery/${id}.webp`;await img.decode();return [key,img];})));
  const canvas=document.createElement('canvas');canvas.width=1440;canvas.height=960;const ctx=canvas.getContext('2d');
  const view={day:1,hours:12,closed:false,chapter:1,repairs:0,equipment:{},motion:true,pointer:0,time:500};
  for(let n=0;n<5;n++)drawRoom(ctx,1440,960,view,art);
  const start=performance.now();for(let n=0;n<60;n++)drawRoom(ctx,1440,960,view,art);
  // Read pixels flushes queued canvas work before timing stops.
  const data=ctx.getImageData(0,0,1440,960).data,elapsed=performance.now()-start;
  const hash=[...new Uint8Array(await crypto.subtle.digest('SHA-256',data))].map(n=>n.toString(16).padStart(2,'0')).join('');
  return {hash,msPerFrame:elapsed/60,frames:60,width:1440,height:960};
 });await fs.writeFile(`${out}/${label}.json`,JSON.stringify(result,null,2));console.log(JSON.stringify(result));
}finally{await browser.close();}
