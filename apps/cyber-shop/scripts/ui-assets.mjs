/** Decode and hash every published illustration in a real browser. */
import { chromium } from 'playwright';
import fs from 'node:fs/promises';
import path from 'node:path';
import { createHash } from 'node:crypto';
const base=process.env.CYBER_URL||'http://127.0.0.1:4176/cyber-shop/';
const root=path.resolve('apps/cyber-shop');
const manifest=JSON.parse(await fs.readFile(path.join(root,'assets-manifest.json'),'utf8'));
const expected=await Promise.all(manifest.assets.map(async asset=>({id:asset.id,name:asset.name,kind:asset.kind,sha256:createHash('sha256').update(await fs.readFile(path.join(root,asset.path))).digest('hex')})));
const browser=await chromium.launch({headless:true});
try {
  const page=await browser.newPage({viewport:{width:1440,height:1000}});
  await page.goto(base);
  const result=await page.evaluate(async({base,expected})=>Promise.all(expected.map(async asset=>{
    const url=new URL(`art/${asset.id}.webp`,base).href;
    const response=await fetch(url),bytes=await response.arrayBuffer();
    const hash=Array.from(new Uint8Array(await crypto.subtle.digest('SHA-256',bytes))).map(n=>n.toString(16).padStart(2,'0')).join('');
    const image=new Image();image.src=url;await image.decode();
    return {id:asset.id,status:response.status,mime:response.headers.get('content-type'),width:image.naturalWidth,height:image.naturalHeight,bytes:bytes.byteLength,sha256:hash,match:hash===asset.sha256};
  })),{base,expected});
  if(result.length!==66||result.some(r=>r.status!==200||!r.mime?.startsWith('image/webp')||!r.width||!r.height||!r.match))throw Error('Published image decode or content check failed');
  await page.setContent('<body style="margin:0;padding:20px;background:#102a2e;color:#dce8df;font:14px sans-serif"><h1>赛博杂货铺 · 66 项发布素材解码核验</h1><main style="display:grid;grid-template-columns:repeat(8,1fr);gap:12px"></main></body>');
  await page.evaluate(({base,expected})=>{for(const asset of expected){const card=document.createElement('figure');card.style.cssText='margin:0;padding:10px;background:#1c3639;';const img=new Image();img.src=new URL(`art/${asset.id}.webp`,base).href;img.style.cssText='width:100%;height:130px;object-fit:contain';const label=document.createElement('figcaption');label.textContent=asset.name;card.append(img,label);document.querySelector('main').append(card)}},{base,expected});
  await page.locator('img').evaluateAll(images=>Promise.all(images.map(image=>image.decode())));
  await page.screenshot({path:path.join(root,'evidence/art-contact-sheet.png'),fullPage:true});
  const report={ok:true,count:result.length,totalBytes:result.reduce((n,r)=>n+r.bytes,0),assets:result};
  await fs.writeFile(path.join(root,'evidence/art-browser.json'),JSON.stringify(report,null,2));
  console.log(JSON.stringify({ok:true,count:report.count,totalBytes:report.totalBytes}));
}finally{await browser.close()}
