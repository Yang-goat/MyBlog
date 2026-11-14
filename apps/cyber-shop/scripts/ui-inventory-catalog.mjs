// Read-only art contact sheet at inventory scale. This is a design fixture, not a playthrough.
import {chromium} from 'playwright';
import {createServer} from 'vite';
import fs from 'node:fs/promises';
const out=process.env.CYBER_EVIDENCE_DIR||'apps/cyber-shop/evidence/living-shop/inventory-catalog';await fs.mkdir(out,{recursive:true});
const server=await createServer({root:'apps/cyber-shop',server:{middlewareMode:true}});
const {ITEMS}=await server.ssrLoadModule('/src/content/items.ts');
const {shapeClip}=await server.ssrLoadModule('/src/ui/inventory-shape.ts');
const catalog=ITEMS.map(d=>({...d,clip:shapeClip({definitionId:d.id})}));await server.close();
const bounds=JSON.parse(await fs.readFile('apps/cyber-shop/src/scenes/inventory-art-bounds.json','utf8'));
const browser=await chromium.launch({headless:true});
try{
 const page=await browser.newPage({viewport:{width:1440,height:1080}}),base=process.env.CYBER_URL||'http://127.0.0.1:4176/cyber-shop/';await page.goto(base);
 await page.setContent('<body style="margin:0;padding:24px;background:#10242c;color:#d3e4df;font:14px sans-serif"><h1>39 件商品 · 等比图像与实际占格</h1><p>设计校样：每格 30 px；轮廓与正式占格一致。</p><main style="display:grid;grid-template-columns:repeat(8,1fr);gap:10px"></main></body>');
 await page.evaluate(({catalog,bounds,base})=>{for(const d of catalog){const card=document.createElement('figure');card.style.cssText='margin:0;padding:10px;background:#1b343b;min-height:220px';const label=document.createElement('figcaption');label.textContent=d.name;const size=document.createElement('p');size.style.fontSize='11px';size.textContent=`${d.footprint.width}×${d.footprint.height} · ${d.size*4} 格`;const stage=document.createElement('div');stage.style.cssText='height:160px;display:flex;align-items:center;justify-content:center';const item=document.createElement('div');const f=d.footprint,b=bounds[d.id],w=f.width*30-2,h=f.height*30-2,scale=Math.min(w/(b[2]*b[4]),h/(b[3]*b[5]))*(b[6]??1);item.style.cssText=`position:relative;width:${w+2}px;height:${h+2}px;border:1px solid #80adb4;box-sizing:border-box;overflow:hidden;background:repeating-linear-gradient(90deg,transparent 0 29px,#86bac533 29px 30px),repeating-linear-gradient(transparent 0 29px,#86bac533 29px 30px),#41677360;clip-path:${d.clip??'none'}`;const image=new Image();image.src=new URL(`art/${d.id}.webp`,base);image.style.cssText=`position:absolute;max-width:none;width:${b[4]*scale}px;height:${b[5]*scale}px;left:${(w-b[2]*b[4]*scale)/2-b[0]*b[4]*scale}px;top:${(h-b[3]*b[5]*scale)/2-b[1]*b[5]*scale}px`;item.append(image);stage.append(item);card.append(label,size,stage);document.querySelector('main').append(card);}},{catalog,bounds,base});
 await page.locator('img').evaluateAll(images=>Promise.all(images.map(i=>i.decode())));await page.screenshot({path:`${out}/catalog.png`,fullPage:true});await fs.writeFile(`${out}/catalog.json`,JSON.stringify(catalog.map(({id,name,footprint,shape,size})=>({id,name,footprint,shape,cells:size*4})),null,2));console.log('INVENTORY_CATALOG_READY');
}finally{await browser.close();}
