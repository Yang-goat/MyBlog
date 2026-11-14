import {chromium} from 'playwright';
import fs from 'node:fs/promises';
import assert from 'node:assert/strict';
import {completeIntro} from './ui-onboarding.mjs';
const out=process.env.CYBER_EVIDENCE_DIR||'apps/cyber-shop/evidence/living-shop/reserved-controls';await fs.mkdir(out,{recursive:true});
const browser=await chromium.launch({headless:true}),errors=[],results=[];
try{for(const touch of [false,true]){
 const size=touch?{width:844,height:390}:{width:1440,height:960},page=await browser.newPage({viewport:size,hasTouch:touch,isMobile:touch});page.on('pageerror',e=>errors.push(e.message));page.setDefaultTimeout(8000);
 const use=touch?'tap':'click',click=n=>page.getByRole('button',{name:n,exact:true})[use](),panel=n=>page.locator('.cabinet-menu').getByRole('button',{name:n,exact:true})[use]();
 const game=async()=>JSON.parse(await page.evaluate(()=>window.render_game_to_text())).game,shot=async n=>{if(!touch)await page.mouse.move(1110,20);await page.locator('.toast').waitFor({state:'hidden'});await page.screenshot({path:`${out}/${touch?'touch':'desktop'}-${n}.png`});};
 try{
  await page.goto(process.env.CYBER_URL||'http://127.0.0.1:4176/cyber-shop/');await page.locator('#start-btn')[use]();await completeIntro(page,touch);await panel('设置与存档');await page.locator('input[type=file]').setInputFiles('apps/cyber-shop/evidence/living-shop/ledger-final/nested-save.json');await page.waitForFunction(()=>JSON.parse(window.render_game_to_text()).panel==='');
  const chip=(await game()).items.find(i=>i.definitionId==='data-chip');await panel('库存');await page.getByLabel('查找库存',{exact:true}).fill('数据芯片');await click('定位货物 ↗');const win=page.locator(`[data-container-window="${chip.containerId}"]`);await win.locator(`[data-storage-object="${chip.id}"]`)[use]();
  const rect=await win.boundingBox(),buttons=await win.locator('.container-window-tools button').evaluateAll(es=>es.map(e=>{const b=e.getBoundingClientRect();return {text:e.innerText,x:b.x,y:b.y,width:b.width,height:b.height,clientWidth:e.clientWidth,scrollWidth:e.scrollWidth};}));
  for(const b of buttons){assert(b.x>=rect.x&&b.x+b.width<=rect.x+rect.width,JSON.stringify(b));assert(b.y>=0&&b.y+b.height<=size.height,JSON.stringify(b));assert(b.scrollWidth<=b.clientWidth+1,JSON.stringify(b));}await shot('nested-actions');await win.getByRole('button',{name:'标记留货',exact:true})[use]();assert((await game()).items.find(i=>i.id===chip.id).reserved);assert.equal(await page.locator('.touch-item-info').count(),0);await win.locator('.container-window-title>button').last()[use]();
  await page.locator('.warehouse-tools').getByRole('button',{name:'翻开店长手册',exact:true})[use]();await page.getByRole('button',{name:/库存与收藏/})[use]();await page.locator('.turn-sheet').waitFor({state:'hidden'});const note=page.locator('.book-step').filter({has:page.getByRole('heading',{name:'留货与查找',exact:true})});await note.scrollIntoViewIfNeeded();assert((await note.innerText()).includes('随存档保留'));assert((await note.innerText()).includes('交付订货前须先解除'));await shot('handbook-reserve');results.push({touch,buttons,handbook:true,markClosesTouchInfo:true});
 }catch(e){await page.screenshot({path:`${out}/${touch?'touch':'desktop'}-failure.png`});await fs.writeFile(`${out}/failure.json`,JSON.stringify({error:String(e),game:await game(),errors},null,2));throw e;}finally{await page.close();}
}assert.deepEqual(errors,[]);await fs.writeFile(`${out}/results.json`,JSON.stringify({ok:true,results,errors},null,2));console.log('RESERVED_CONTROLS_PASS');}finally{await browser.close();}
