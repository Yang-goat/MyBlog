// Buy revised objects through normal play, starting from a previously UI-exported career.
import {chromium} from 'playwright';
import fs from 'node:fs/promises';
import assert from 'node:assert/strict';
import {completeIntro} from './ui-onboarding.mjs';
const out=process.env.CYBER_EVIDENCE_DIR||'apps/cyber-shop/evidence/living-shop/readable-art';
await fs.mkdir(out,{recursive:true});
const url=process.env.CYBER_URL||'http://127.0.0.1:4176/cyber-shop/';
const targets=['industrial-sensor','haptic-module','nutrient-fluid','holo-film'],found={},checks=[],errors=[];
const browser=await chromium.launch({headless:true}),page=await browser.newPage({viewport:{width:1440,height:960},acceptDownloads:true});
page.setDefaultTimeout(8000);
function watch(p){p.on('pageerror',e=>errors.push(e.message));p.on('response',r=>{if(r.status()>=400)errors.push(`${r.status()} ${r.url()}`);});}watch(page);
const read=async(p=page)=>JSON.parse(await p.evaluate(()=>window.render_game_to_text())),game=async(p=page)=>(await read(p)).game;
const click=name=>page.getByRole('button',{name,exact:true}).click(),panel=name=>page.locator('.cabinet-menu').getByRole('button',{name,exact:true}).click();
const root=id=>page.locator(`.warehouse-item[data-item="${id}"]`);
const shot=async name=>{await page.mouse.move(5,5);await page.waitForTimeout(180);await page.screenshot({path:`${out}/${name}.png`});};
async function inspect(locator,stage){
 await locator.locator('img').evaluate(i=>i.decode());
 const value=await locator.evaluate(e=>{const i=e.querySelector('img'),s=getComputedStyle(i),b=e.getBoundingClientRect();return {id:e.querySelector('[data-inventory-art]').dataset.inventoryArt,native:i.naturalWidth/i.naturalHeight,rendered:parseFloat(s.width)/parseFloat(s.height),width:b.width,height:b.height};});
 assert(Math.abs(value.native-value.rendered)<.002,`${stage}: ${value.id} was stretched`);checks.push({stage,...value});return value;
}
async function close(){if((await read()).panel==='trade')await click('关闭谈判');}
try{
 await page.goto(url);await page.locator('#start-btn').click();await completeIntro(page);await panel('设置与存档');
 await page.locator('input[type=file]').setInputFiles('apps/cyber-shop/evidence/living-shop/demand-journey/career-save.json');
 await page.waitForFunction(()=>JSON.parse(window.render_game_to_text()).panel==='');await page.locator('.toast').waitFor({state:'hidden'});
 const imported=await game();assert.equal(imported.day,17);assert(imported.endless);
 for(let d=0;d<30&&Object.keys(found).length<targets.length;d++){
  for(let n=0;n<8;n++){
   let s=await game();if(!s.visitor)break;
   if(s.visitorArrived===false||s.visitor.resolved){const call=page.getByRole('button',{name:'绿色叫号按钮',exact:true});if(await call.isDisabled())break;await call.click();}
   await page.keyboard.press('Space');await page.keyboard.press('Space');s=await game();
   if(s.visitor.kind==='seller'){
    const wanted=s.visitor.goods.filter(i=>targets.includes(i.definitionId)&&!found[i.definitionId]);
    for(const item of wanted){
     if(found[item.definitionId])continue;
     const original=await inspect(page.locator(`.incoming-item[data-item="${item.id}"]`),'incoming');await shot(`${item.definitionId}-incoming`);
     await page.locator(`.incoming-item[data-item="${item.id}"]`).click();await click('谈判空格 1');await close();
     const staged=await inspect(page.locator(`.staged-item[data-item="${item.id}"]`),'staged');assert.equal(staged.width,original.width);assert.equal(staged.height,original.height);
     await click('打开谈判 ↗');await click('收下选中的货 →');
     if(!(await game()).containers.length&&await page.getByRole('button',{name:'买下箱包 · ₡300',exact:true}).count())await click('买下箱包 · ₡300');
     await close();await inspect(page.locator(`.purchased-item[data-item="${item.id}"]`),'purchased');await click('全部入库 ↓');
     const stored=await inspect(root(item.id),'warehouse');assert.equal(stored.width,original.width);assert.equal(stored.height,original.height);
     found[item.definitionId]={id:item.id,day:s.day};console.log(`BOUGHT ${item.definitionId} day ${s.day}`);
    }
   }
   await close();if(!(await game()).visitor.resolved)await click('结束当前接待');
  }
  if(Object.keys(found).length===targets.length)break;
  await click('关店 / 日结 →');await click('确认闭店');assert.notEqual((await game()).phase,'failed');await click('迎接新的一天 →');
 }
 assert.equal(Object.keys(found).length,targets.length,'All four revised items must be bought through real sellers');
 const pack=(await game()).containers.find(c=>c.styleId==='courier-pack');assert(pack,'Buy a real container');
 await page.locator(`[data-world-container="${pack.id}"]`).dblclick();
 const win=page.locator(`[data-container-window="${pack.id}"]`),h=await win.locator('.container-window-title').boundingBox();
 await page.mouse.move(h.x+55,h.y+12);await page.mouse.down();await page.mouse.move(1065,200,{steps:12});await page.mouse.up();
 for(const key of targets){
  const id=found[key].id;await root(id).click();await win.getByRole('button',{name:'箱内空格 1',exact:true}).click();
  const inner=win.locator(`[data-storage-object="${id}"]`);await inspect(inner,'container');
  // Rectangular goods keep the existing horizontal/vertical toggle; shaped goods use four orientations.
  for(let turn=1;turn<=4;turn++){await inner.click();await page.keyboard.press('e');await win.getByRole('button',{name:`箱内空格 ${turn%2?13:1}`,exact:true}).click();assert.equal(Number((await game()).containers.find(c=>c.id===pack.id).layout.positions[id].rotated),turn%2);await inspect(inner,`container-rotation-${turn%2}`);}
  await shot(`${key}-container`);await inner.click();await win.getByRole('button',{name:'取出',exact:true}).click();assert(!(await game()).items.find(i=>i.id===id).containerId);
 }
 const viewports=[];
 for(const [width,height] of [[1920,948],[1440,960],[960,650],[844,390]]){
  await page.setViewportSize({width,height});await page.waitForTimeout(180);
  const sizes=[];for(const selector of ['.incoming-tray .surface-cell','.negotiation-table .surface-cell','.warehouse-cell','.container-cell']){const b=await page.locator(selector).first().boundingBox();assert(Math.abs(b.width-b.height)<.1);sizes.push(b.width);}assert(sizes.every(n=>Math.abs(n-sizes[0])<.1));
  for(const key of targets)await inspect(root(found[key].id),`warehouse-${width}`);viewports.push({width,height,cell:sizes[0]});await shot(`warehouse-${width}`);
 }
 await page.keyboard.press('Escape');await panel('设置与存档');const [download]=await Promise.all([page.waitForEvent('download'),click('导出当前存档')]);await download.saveAs(`${out}/readable-save.json`);
 const touch=await browser.newPage({viewport:{width:844,height:390},hasTouch:true,isMobile:true});watch(touch);
 await touch.goto(url);await touch.locator('#start-btn').tap();await completeIntro(touch,true);await touch.locator('.cabinet-menu').getByRole('button',{name:'设置与存档',exact:true}).tap();
 await touch.locator('input[type=file]').setInputFiles(`${out}/readable-save.json`);await touch.waitForFunction(()=>JSON.parse(window.render_game_to_text()).panel==='');await touch.locator('.toast').waitFor({state:'hidden'});
 for(const key of targets)await inspect(touch.locator(`.warehouse-item[data-item="${found[key].id}"]`),'touch-warehouse');
 await touch.screenshot({path:`${out}/touch-warehouse.png`});await touch.close();
 assert.deepEqual(errors,[]);await fs.writeFile(`${out}/results.json`,JSON.stringify({ok:true,importedCareerDay:imported.day,found,viewports,checks,actualPurchases:true,fourRotationActionsPerItem:true,rectangularOrientations:2,touch:true,errors},null,2));console.log('READABLE_ART_PASS');
}catch(e){await shot('failure').catch(()=>{});await fs.writeFile(`${out}/failure.json`,JSON.stringify({error:String(e),state:await read().catch(()=>null),found,checks,errors},null,2));throw e;}finally{await browser.close();}
