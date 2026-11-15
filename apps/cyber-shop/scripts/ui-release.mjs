/** Verify the published build using fresh browser contexts and normal UI input. */
import {chromium} from 'playwright';
import fs from 'node:fs/promises';
import path from 'node:path';
import {createHash} from 'node:crypto';
import assert from 'node:assert/strict';
import {completeIntro} from './ui-onboarding.mjs';

const base=process.env.CYBER_URL||'https://goatyang.com/cyber-shop/';
const out=process.env.CYBER_EVIDENCE_DIR||'apps/cyber-shop/evidence/living-shop/release-030-live';
const dist=path.resolve(process.env.CYBER_DIST||'src/.vuepress/dist/cyber-shop');
const version=JSON.parse(await fs.readFile('apps/cyber-shop/package.json','utf8')).version;
const sha=buffer=>createHash('sha256').update(buffer).digest('hex');
await fs.mkdir(out,{recursive:true});
const browser=await chromium.launch({headless:true}),errors=[],assets=[],checks=[];
let activePage;
try{
 const context=await browser.newContext({viewport:{width:1440,height:960}});
 const html=await context.request.get(base);assert.equal(html.status(),200);
 const source=await html.text(),localHtml=await fs.readFile(path.join(dist,'index.html'),'utf8');
 for(const match of localHtml.matchAll(/(?:src|href)="(\/cyber-shop\/assets\/[^\"]+)"/g))assert(source.includes(match[1]),`Stale entry: ${match[1]}`);
 const files=[],bundles=await fs.readdir(path.join(dist,'assets'));let references=localHtml;
 // Follow the current entry, including lazy imports; incremental local builds may retain old chunks.
 for(let added=true;added;){added=false;for(const name of bundles){const file=`assets/${name}`;if(!files.includes(file)&&/\.(js|css)$/.test(name)&&references.includes(name)){files.push(file);references+=await fs.readFile(path.join(dist,file),'utf8');added=true;}}}
 for(const dir of ['art','scenery'])for(const file of await fs.readdir(path.join(dist,dir)))if(/\.(webp|png|svg)$/.test(file))files.push(`${dir}/${file}`);
 for(let offset=0;offset<files.length;offset+=6)await Promise.all(files.slice(offset,offset+6).map(async file=>{
  const response=await context.request.get(new URL(file,base).href);assert.equal(response.status(),200,file);
  const type=response.headers()['content-type']||'';
  assert(!type.includes('text/html'),`HTML fallback: ${file}`);
  if(file.endsWith('.js'))assert(/javascript/.test(type),`${file}: ${type}`);
  if(file.endsWith('.css'))assert(/text\/css/.test(type),`${file}: ${type}`);
  if(/\.(webp|png|svg)$/.test(file))assert(type.startsWith('image/'),`${file}: ${type}`);
  const body=await response.body(),local=await fs.readFile(path.join(dist,file));
  assert.equal(sha(body),sha(local),`Published content differs: ${file}`);
  assets.push({file,status:response.status(),type,bytes:body.length,sha256:sha(body)});
 }));
 for(const touch of process.env.CYBER_RELEASE_MOBILE==='0'?[false]:[false,true]){
  const ctx=touch?await browser.newContext({viewport:{width:844,height:390},hasTouch:true,isMobile:true}):context;
  const page=await ctx.newPage();activePage=page;page.setDefaultTimeout(15000);
  page.on('pageerror',e=>errors.push(e.message));
  page.on('response',r=>{if(r.status()>=400)errors.push(`${r.status()} ${r.url()}`);});
  const action=touch?'tap':'click',click=n=>page.getByRole('button',{name:n,exact:true})[action]();
  const read=()=>page.evaluate(()=>JSON.parse(window.render_game_to_text()));
  await page.goto(base);await page.waitForFunction(()=>typeof window.render_game_to_text==='function');assert.equal((await read()).version,version);
  await click('选择开局词条');await page.locator('[data-modifier="roomy-stock"]')[action]();await click('采用词条 →');await page.locator('#start-btn')[action]();await completeIntro(page,touch);
  const before=(await read()).game,size=(await page.locator('.warehouse-cell').first().boundingBox()).width;
  await page.getByRole('tab',{name:'扩仓1 · 48 格',exact:true})[action]();assert.deepEqual((await read()).game,before);
  await page.locator('.cabinet-menu').getByRole('button',{name:'工具采购',exact:true})[action]();await click('四类设施');await page.locator('[data-equipment="stock-rack"]').getByRole('button')[action]();await click('关闭面板');
  assert.equal(await page.locator('.warehouse-cell:disabled').count(),16);assert.equal((await page.locator('.warehouse-cell').first().boundingBox()).width,size);
  await page.getByRole('tab',{name:'主仓 · 144 格',exact:true})[action]();
  const item=(await read()).game.items.find(i=>i.definitionId==='data-chip');await page.locator(`.warehouse-item[data-item="${item.id}"]`)[action]();await page.getByRole('tab',{name:'扩仓1 · 80 格',exact:true})[action]();await click('仓库空格 169');
  assert.equal((await read()).game.warehouse.positions[item.id].y,7);await click('撤销摆放');assert.equal(await page.locator('.warehouse-grid').getAttribute('data-page'),'0');
  const geometry=await page.evaluate(()=>[...document.querySelectorAll('.surface-grid,.warehouse-grid')].map(g=>{const r=g.getBoundingClientRect(),p=g.parentElement.getBoundingClientRect(),c=g.querySelector('button').getBoundingClientRect();return {width:r.width,height:r.height,cell:c.width,square:Math.abs(c.width-c.height)<.1,inside:r.left>=p.left-.1&&r.right<=p.right+.1&&r.top>=p.top-.1&&r.bottom<=p.bottom+.1,scrollable:g.parentElement.scrollHeight>g.parentElement.clientHeight||g.parentElement.scrollWidth>g.parentElement.clientWidth};}));
  for(const g of geometry){assert(g.square&&g.inside&&!g.scrollable);assert(Math.abs(g.cell-size)<.1);}
  await page.locator('.toast').waitFor({state:'hidden'});await page.screenshot({path:`${out}/${touch?'mobile':'desktop'}.png`});
  if(!touch){
   const decoded=await page.evaluate(async urls=>{for(const url of urls){const img=new Image();img.src=url;await img.decode();if(!img.naturalWidth)throw Error(url);}return urls.length;},files.filter(f=>/\.(webp|png|svg)$/.test(f)).map(f=>new URL(f,base).href));checks.push({decoded});
  }
  checks.push({touch,version,capacity:(await read()).game.rootCapacity*4,geometry});await page.close();if(touch)await ctx.close();
 }
 if(process.env.CYBER_CHECK_ARTICLE!=='0'){
  const page=await context.newPage();await page.goto(new URL('/notes/cyber-shop/',base).href);await page.getByRole('heading',{name:'赛博杂货铺',exact:true}).first().waitFor();
  assert((await page.locator('body').innerText()).includes(`${version} 版`));await page.screenshot({path:`${out}/article.png`});checks.push({article:true});await page.close();
 }
 assert.deepEqual(errors,[]);await fs.writeFile(`${out}/result.json`,JSON.stringify({ok:true,base,version,checkedAt:new Date().toISOString(),assets:assets.sort((a,b)=>a.file.localeCompare(b.file)),checks,errors},null,2));console.log(JSON.stringify({ok:true,base,version,assets:assets.length,checks}));
}catch(error){await activePage?.screenshot({path:`${out}/failure.png`}).catch(()=>{});const state=await activePage?.evaluate(()=>JSON.parse(window.render_game_to_text())).catch(()=>null);await fs.writeFile(`${out}/failure.json`,JSON.stringify({error:String(error),base,assets,checks,errors,state},null,2));throw error;}finally{await browser.close();}
