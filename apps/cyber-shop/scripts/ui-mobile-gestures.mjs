import {chromium} from 'playwright';
import fs from 'node:fs/promises';
import assert from 'node:assert/strict';
import {completeIntro} from './ui-onboarding.mjs';
const out=process.env.CYBER_EVIDENCE_DIR||'apps/cyber-shop/evidence/mobile-031/gestures';
await fs.mkdir(out,{recursive:true});
const browser=await chromium.launch({headless:true}),page=await browser.newPage({viewport:{width:844,height:390},isMobile:true,hasTouch:true});
page.setDefaultTimeout(10000);const errors=[],checks=[];
page.on('pageerror',e=>errors.push(e.message));
page.on('response',r=>{if(r.status()>=400)errors.push(`${r.status()} ${r.url()}`);});
const tap=name=>page.getByRole('button',{name,exact:true}).tap(),read=()=>page.evaluate(()=>JSON.parse(window.render_game_to_text()));
const touch=await page.context().newCDPSession(page);
async function drag(from,to){await touch.send('Input.dispatchTouchEvent',{type:'touchStart',touchPoints:[from]});for(let i=1;i<=8;i++)await touch.send('Input.dispatchTouchEvent',{type:'touchMove',touchPoints:[{x:from.x+(to.x-from.x)*i/8,y:from.y+(to.y-from.y)*i/8}]});await touch.send('Input.dispatchTouchEvent',{type:'touchEnd',touchPoints:[]});}
async function check(name){
 await page.waitForTimeout(120);
 const geometry=await page.evaluate(()=>{
  const grids=[...document.querySelectorAll('.warehouse-grid,.surface-grid,.container-grid')].map(el=>{const b=el.getBoundingClientRect(),p=el.parentElement.getBoundingClientRect(),c=el.querySelector('button').getBoundingClientRect();return {kind:el.className,cell:c.width,square:Math.abs(c.width-c.height)<.1,inside:b.left>=p.left-.1&&b.right<=p.right+.1&&b.top>=p.top-.1&&b.bottom<=p.bottom+.1,scrollable:el.parentElement.scrollHeight>el.parentElement.clientHeight||el.parentElement.scrollWidth>el.parentElement.clientWidth};});
  const windows=[...document.querySelectorAll('.container-window')].map(el=>{const b=el.getBoundingClientRect();return {x:b.x,y:b.y,right:b.right,bottom:b.bottom};});
  const header=document.querySelector('.warehouse-section>header');return {grids,windows,width:innerWidth,height:innerHeight,headerFits:header.scrollWidth<=header.clientWidth};
 });
 for(const g of geometry.grids){assert(g.square&&g.inside&&!g.scrollable,`${name} ${g.kind}`);assert(Math.abs(g.cell-geometry.grids[0].cell)<.1);}
 for(const w of geometry.windows)assert(w.x>=0&&w.y>=0&&w.right<=geometry.width+.1&&w.bottom<=geometry.height+.1,`${name} clipped window`);
 assert(geometry.headerFits,`${name} header overflow`);await page.screenshot({path:`${out}/${name}.png`});checks.push({name,geometry});
}
try{
 await page.goto(process.env.CYBER_URL||'http://127.0.0.1:4175/cyber-shop/');await tap('选择开局词条');await page.locator('[data-modifier="roomy-stock"]').tap();await tap('采用词条 →');await page.locator('#start-btn').tap();await completeIntro(page,true);
 const stock=(await read()).game,chip=stock.items.find(i=>i.definitionId==='data-chip'),water=stock.items.find(i=>i.definitionId==='purified-water');
 // No artificial pauses: adjacent tab/item taps must never open the full inventory ledger.
 for(let n=0;n<3;n++){
  await page.getByRole('tab',{name:'扩仓1 · 48 格',exact:true}).tap();await page.getByRole('tab',{name:'主仓 · 144 格',exact:true}).tap();await page.locator(`[data-item="${chip.id}"]`).tap();assert.equal((await read()).panel,'');await tap('放下物品');
 }
 await page.locator(`[data-item="${water.id}"]`).tap();await page.locator(`[data-item="${chip.id}"]`).tap();assert.equal((await read()).panel,'');await tap('放下物品');
 // A deliberate double tap on the same object still opens its ledger.
 await page.locator(`[data-item="${chip.id}"]`).tap();await page.locator(`[data-item="${chip.id}"]`).tap();assert.equal((await read()).panel,'inventory');await tap('关闭面板');
 await page.locator(`[data-item="${chip.id}"]`).tap();await page.getByRole('tab',{name:'扩仓1 · 48 格',exact:true}).tap();await tap('仓库空格 169');assert.equal((await read()).game.warehouse.positions[chip.id].y,7);assert.equal(await page.locator('.touch-item-info').count(),0);await tap('撤销摆放');assert.equal(await page.locator('.warehouse-grid').getAttribute('data-page'),'0');await check('rapid-taps-and-transfer');
 await page.locator(`[data-item="${water.id}"]`).tap();await tap('旋转物品');await tap('仓库空格 97');assert.equal((await read()).game.warehouse.positions[water.id].rotated,true);await tap('撤销摆放');
 await page.locator(`[data-item="${water.id}"]`).tap();await tap('放下物品');assert.equal(await page.locator('.warehouse-item.selected').count(),0);assert.equal(await page.locator('.touch-item-info').count(),0);
 const from=await page.locator(`[data-item="${chip.id}"]`).boundingBox(),to=await page.getByRole('button',{name:'仓库空格 69',exact:true}).boundingBox();
 await page.evaluate(()=>{window.__touchEvents=[];for(const type of ['pointerdown','pointerup','click','dblclick','pointercancel'])document.addEventListener(type,e=>window.__touchEvents.push({type,time:e.timeStamp,label:e.target.closest('button')?.getAttribute('aria-label'),item:e.target.closest('[data-item]')?.getAttribute('data-item')}),true);});
 await drag({x:from.x+from.width/2,y:from.y+from.height/2},{x:to.x+to.width/2,y:to.y+to.height/2});assert.equal((await read()).game.warehouse.positions[chip.id].x,20);await tap('撤销摆放');await page.waitForFunction(id=>JSON.parse(window.render_game_to_text()).game.warehouse.positions[id].x===1,chip.id,{timeout:2500});
 const restored=await page.locator(`[data-item="${chip.id}"]`).boundingBox();
 await touch.send('Input.dispatchTouchEvent',{type:'touchStart',touchPoints:[{x:restored.x+restored.width/2,y:restored.y+restored.height/2}]});await page.waitForTimeout(650);assert(await page.locator('.item-context-menu').isVisible());await touch.send('Input.dispatchTouchEvent',{type:'touchEnd',touchPoints:[]});await page.locator('.menu-dismiss').tap();assert.equal((await read()).panel,'');await check('drag-and-long-press');
 await page.locator('.cabinet-menu').getByRole('button',{name:'设置与存档',exact:true}).tap();await page.locator('input[type=file]').setInputFiles('apps/cyber-shop/evidence/living-shop/ledger-final/nested-save.json');await page.waitForFunction(()=>JSON.parse(window.render_game_to_text()).panel==='');
 const nested=(await read()).game,crate=nested.containers.find(c=>!c.containerId),pack=nested.containers.find(c=>c.containerId===crate.id);
 const box=page.locator(`[data-world-container="${crate.id}"]`);await box.tap();await box.tap();assert.equal(await page.locator('[data-container-window]').count(),1);
 const inner=page.locator(`[data-storage-object="${pack.id}"]`);await inner.tap();await inner.tap();assert.equal(await page.locator('[data-container-window]').count(),2);await check('double-tap-nested');
 const title=await page.locator(`[data-container-window="${pack.id}"] .container-window-title strong`).boundingBox();await drag({x:title.x+10,y:title.y+5},{x:40,y:60});await check('drag-container-window');
 for(const [width,height] of [[568,320],[667,300],[390,844],[844,390]]){await page.setViewportSize({width,height});if(width>height)await check(`rotated-${width}-${height}`);else await page.waitForTimeout(200);}
 // Browser toolbar resizing must keep every open container on screen.
 await page.setViewportSize({width:844,height:330});await check('browser-toolbar-visible');await page.setViewportSize({width:844,height:390});await check('browser-toolbar-hidden');
 // Model a landscape safe area without injecting or changing game state.
 await page.locator('.app').evaluate(el=>{el.style.inset='0px 44px 18px 44px';window.dispatchEvent(new Event('resize'));});await check('safe-area');
 const bounds=await page.locator('.shop-room').boundingBox();for(const w of checks.at(-1).geometry.windows)assert(w.x>=bounds.x&&w.right<=bounds.x+bounds.width&&w.bottom<=bounds.y+bounds.height);
 assert.deepEqual(errors,[]);await fs.writeFile(`${out}/result.json`,JSON.stringify({ok:true,checks,errors},null,2));console.log('MOBILE_GESTURES_PASS');
}catch(e){await page.screenshot({path:`${out}/failure.png`}).catch(()=>{});await fs.writeFile(`${out}/failure.json`,JSON.stringify({error:String(e),state:await read().catch(()=>null),touchEvents:await page.evaluate(()=>window.__touchEvents),checks,errors},null,2));throw e;}finally{await browser.close();}
