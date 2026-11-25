import {chromium} from 'playwright';
import fs from 'node:fs/promises';
import assert from 'node:assert/strict';
import {completeIntro} from './ui-onboarding.mjs';
const out=process.env.CYBER_EVIDENCE_DIR||'apps/cyber-shop/evidence/living-shop/surface-frames';await fs.mkdir(out,{recursive:true});
const browser=await chromium.launch({headless:true}),results=[],errors=[];
try{for(const modifier of ['', 'cramped-stock','roomy-stock']){
 const page=await browser.newPage({viewport:{width:1440,height:960}});page.setDefaultTimeout(8000);page.on('pageerror',e=>errors.push(e.message));page.on('response',r=>{if(r.status()>=400)errors.push(`${r.status()} ${r.url()}`);});
 const click=name=>page.getByRole('button',{name,exact:true}).click(),read=async()=>JSON.parse(await page.evaluate(()=>window.render_game_to_text()));
 async function check(name){
  await page.waitForTimeout(160);
  for(const tab of await page.locator('.warehouse-tabs button').all())assert(await tab.isVisible());
  const geometry=await page.locator('canvas').evaluate(el=>{
   const c=el.getBoundingClientRect(),surfaces=JSON.parse(el.dataset.inventorySurfaces),rects={};
   for(const [key,selector] of [['incoming','.incoming-tray .surface-grid'],['trade','.negotiation-table .surface-grid'],['warehouse','.warehouse-grid']]){
    const grid=document.querySelector(selector),r=grid.getBoundingClientRect(),clip=key==='warehouse'?document.querySelector('.warehouse-scroll').getBoundingClientRect():r;
    const left=Math.max(r.left,clip.left),top=Math.max(r.top,clip.top),right=Math.min(r.right,clip.right),bottom=Math.min(r.bottom,clip.bottom),s=surfaces[key],cell=grid.querySelector('button').getBoundingClientRect();
    const viewport=document.querySelector('.warehouse-scroll');rects[key]={dom:{x:left,y:top,width:right-left,height:bottom-top},paint:{x:s.x*c.width/1440+c.left,y:s.y*c.height/900+c.top,width:s.width*c.width/1440,height:s.height*c.height/900},cell:{width:cell.width,height:cell.height},gridHeight:r.height,gridWidth:r.width,scrollTop:viewport.scrollTop,scrollHeight:viewport.scrollHeight,clientHeight:viewport.clientHeight,scrollWidth:viewport.scrollWidth,clientWidth:viewport.clientWidth};
   }return rects;
  });
  for(const [key,r] of Object.entries(geometry)){
   for(const dim of ['x','y','width','height'])assert(Math.abs(r.dom[dim]-r.paint[dim])<.1,`${name} ${key} ${dim}`);
   assert(Math.abs(r.cell.width-r.cell.height)<.1);assert(Math.abs(r.cell.width-geometry.incoming.cell.width)<.1);
   assert(Math.abs(r.dom.height-r.gridHeight)<.1);assert(Math.abs(r.dom.width-r.gridWidth)<.1);assert.equal(r.scrollTop,0);assert(r.scrollHeight<=r.clientHeight);assert(r.scrollWidth<=r.clientWidth);
  }
  await page.mouse.move(5,5);await page.locator('.toast').waitFor({state:'hidden'});await page.screenshot({path:`${out}/${modifier||'standard'}-${name}.png`});results.push({modifier,name,viewport:page.viewportSize(),geometry});
 }
 try{
  await page.goto(process.env.CYBER_URL||'http://127.0.0.1:4176/cyber-shop/');if(modifier){await click('选择开局词条');await page.locator(`[data-modifier="${modifier}"]`).click();await click('采用词条 →');}await page.locator('#start-btn').click();await completeIntro(page);await check('1440');
  if(!modifier){
   // Existing pointer placement must remain in the same square coordinate system.
   const before=(await read()).game,item=before.items.find(i=>i.location==='stock'&&i.owner==='player'&&!i.containerId);assert(item);
   await page.locator(`.warehouse-item[data-item="${item.id}"]`).click();await page.getByRole('button',{name:'仓库空格 69',exact:true}).click();assert.equal((await read()).game.warehouse.positions[item.id].x,20);await click('撤销摆放');assert.deepEqual((await read()).game.warehouse.positions,before.warehouse.positions);
   await click('绿色叫号按钮');await click('结束当前接待');await click('绿色叫号按钮');await click('继续交谈');await click('看看带来的货');await check('incoming');await click('把来货放上台 →');await click('收下选中的货 →');await click('关闭谈判');await check('purchased');await click('全部入库 ↓');await check('stored');
  }
  if(modifier==='roomy-stock'){
   const size=(await page.locator('.warehouse-cell').first().boundingBox()).width,before=(await read()).game;
   await page.getByRole('tab',{name:'扩仓1 · 48 格',exact:true}).click();await check('second-page-48');assert.deepEqual((await read()).game,before);assert.equal((await page.locator('.warehouse-cell').first().boundingBox()).width,size);
   await page.locator('.cabinet-menu').getByRole('button',{name:'工具采购',exact:true}).click();await click('四类设施');await page.locator('[data-equipment="stock-rack"]').getByRole('button').click();await click('关闭面板');await check('second-page-80');assert.equal(await page.locator('.warehouse-cell:disabled').count(),16);
   await page.locator('.cabinet-menu').getByRole('button',{name:'工具采购',exact:true}).click();await click('四类设施');for(let n=0;n<2;n++)await page.locator('[data-equipment="stock-rack"]').getByRole('button').click();await click('关闭面板');assert.equal((await read()).game.rootCapacity*4,288);await check('expanded-288');
   await page.getByRole('tab',{name:'主仓 · 144 格',exact:true}).click();const old=(await read()).game,chip=old.items.find(i=>i.definitionId==='data-chip').id;await page.locator(`.warehouse-item[data-item="${chip}"]`).click();await page.getByRole('tab',{name:'扩仓1 · 144 格',exact:true}).click();await click('仓库空格 169');assert.equal((await read()).game.warehouse.positions[chip].y,7);await check('page-transfer');await click('撤销摆放');assert.equal(await page.locator('.warehouse-grid').getAttribute('data-page'),'0');assert.deepEqual((await read()).game.warehouse.positions,old.warehouse.positions);assert.equal((await page.locator('.warehouse-cell').first().boundingBox()).width,size);
   await page.getByRole('tab',{name:'主仓 · 144 格',exact:true}).focus();await page.keyboard.press('ArrowRight');assert.equal(await page.locator('.warehouse-grid').getAttribute('data-page'),'1');await page.keyboard.press('Home');assert.equal(await page.locator('.warehouse-grid').getAttribute('data-page'),'0');
  }
  for(const [width,height] of [[1920,1080],[1366,768],[960,650],[844,390],[667,375],[568,320]]){await page.setViewportSize({width,height});await check(String(width));}
  for (const [panel, button] of [['.speech-bubble', '.speech-options .primary'], ['.journey-note', '.journey-open']]) {
    const region = page.locator(panel);
    if (!(await region.count())) continue;
    const bounds = await region.boundingBox();
    const action = await region.locator(button).boundingBox();
    assert(bounds && action && action.y >= bounds.y && action.y + action.height <= bounds.y + bounds.height,
      `The primary action must be visible without scrolling ${panel} at 568×320`);
  }
  const scroll=page.locator('.warehouse-scroll');await scroll.hover();await page.mouse.wheel(0,500);await check('scrolled');
  await page.locator('.cabinet-menu').getByRole('button',{name:'设置与存档',exact:true}).click();await page.getByLabel('减少动态效果',{exact:true}).check();await click('关闭面板');await page.setViewportSize({width:1440,height:960});await check('reduced-motion');
  await page.reload();await click('继续经营 ↗');await check('reloaded');
 }catch(e){await page.screenshot({path:`${out}/${modifier||'standard'}-failure.png`}).catch(()=>{});await fs.writeFile(`${out}/failure.json`,JSON.stringify({error:String(e),state:await read().catch(()=>null),errors},null,2));throw e;}finally{await page.close();}
}assert.deepEqual(errors,[]);await fs.writeFile(`${out}/results.json`,JSON.stringify({ok:true,results,errors},null,2));console.log('SURFACE_FRAMES_PASS');}finally{await browser.close();}
