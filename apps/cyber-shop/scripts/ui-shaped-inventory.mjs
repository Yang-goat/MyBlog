import {completeIntro} from './ui-onboarding.mjs';
import {chromium} from 'playwright';
import fs from 'node:fs/promises';
import assert from 'node:assert/strict';
const out=process.env.CYBER_EVIDENCE_DIR||'apps/cyber-shop/evidence/living-shop/shaped-inventory';
await fs.mkdir(out,{recursive:true});
const browser=await chromium.launch({headless:true}),page=await browser.newPage({viewport:{width:1440,height:960}});
page.setDefaultTimeout(8000);
const errors=[],results={};page.on('pageerror',e=>errors.push(e.message));page.on('response',r=>{if(r.status()>=400)errors.push(`${r.status()} ${r.url()}`);});
const game=async()=>JSON.parse(await page.evaluate(()=>window.render_game_to_text())).game;
const click=name=>page.getByRole('button',{name,exact:true}).click();
const root=id=>page.locator(`.warehouse-item[data-item="${id}"]`);
const shot=async name=>{await page.mouse.move(5,5);await page.waitForTimeout(120);await page.screenshot({path:`${out}/${name}.png`});};
async function point(selector,x,y){return page.locator(selector).evaluate((e,{x,y})=>{const r=e.getBoundingClientRect(),cell=parseFloat(getComputedStyle(e).getPropertyValue('--inventory-cell'));return {x:r.x+(x+.5)*cell,y:r.y+(y+.5)*cell};},{x,y});}
async function drop(source,selector,x,y,key){const b=await source.boundingBox(),p=await point(selector,x,y);await page.mouse.move(b.x+b.width/2,b.y+b.height/2);await page.mouse.down();await page.mouse.move(p.x,p.y,{steps:12});if(key)await page.keyboard.press(key);await page.mouse.up();}
async function place(source,selector,x,y,key){await source.click();if(key)await page.keyboard.press(key);const p=await point(selector,x,y);if(process.env.CYBER_DEBUG)console.log('PLACE',await source.getAttribute('data-item'),await source.boundingBox(),p,await page.evaluate(p=>({hit:document.elementFromPoint(p.x,p.y)?.outerHTML,held:document.querySelector('.shop-room').className}),p));await page.mouse.click(p.x,p.y);}
async function aspect(){const arts=await page.locator('.inventory-art img').evaluateAll(images=>images.filter(i=>i.getBoundingClientRect().width>0).map(i=>{const s=getComputedStyle(i);return {id:i.closest('[data-inventory-art]').dataset.inventoryArt,native:i.naturalWidth/i.naturalHeight,rendered:parseFloat(s.width)/parseFloat(s.height)};}));for(const a of arts)assert(Math.abs(a.native-a.rendered)<.002,`${a.id}: image aspect ratio changed`);return arts;}
async function talk(){await page.keyboard.press('Space');await page.keyboard.press('Space');}
try{
 await page.goto(process.env.CYBER_URL||'http://127.0.0.1:4176/cyber-shop/');await page.getByText('固定种子开局',{exact:true}).click();await page.getByRole('spinbutton',{name:'街区种子'}).fill('2');await page.locator('#start-btn').click();await completeIntro(page);
 const initial=await game(),chip=initial.items.find(i=>i.definitionId==='data-chip').id;
 await click('绿色叫号按钮');await click('结束当前接待');await click('绿色叫号按钮');await talk();
 const goods=(await game()).visitor.goods,drill=goods.find(i=>i.definitionId==='angle-drill').id,lamp=goods.find(i=>i.definitionId==='folding-worklight').id;
 results.incomingAspects=await aspect();await shot('incoming-natural-proportions');
 await click('把来货放上台 →');await click('收下选中的货 →');await click('买下箱包 · ₡120');await click('买下箱包 · ₡300');await click('关闭谈判');await click('全部入库 ↓');
 await drop(page.locator(`.incoming-item[data-item="${lamp}"]`),'.negotiation-table .surface-grid',8,0);await click('收下选中的货 →');await click('关闭谈判');await click('全部入库 ↓');
 await place(root(drill),'.warehouse-grid',17,1);assert.deepEqual((await game()).warehouse.positions[drill],{x:17,y:1,rotated:0});
 // The lower left of this real drill is empty: it is an actual clickable storage cell.
 const hole=await point('.warehouse-grid',17,2);assert.equal(await page.evaluate(p=>document.elementFromPoint(p.x,p.y).classList.contains('warehouse-cell'),hole),true);
 await place(root(chip),'.warehouse-grid',17,2);assert.equal((await game()).warehouse.positions[chip].x,17);assert.equal((await game()).warehouse.positions[chip].y,2);
 assert.equal(await page.evaluate(p=>document.elementFromPoint(p.x,p.y).closest('[data-item]')?.dataset.item,hole),chip);await shot('chip-inside-drill-concavity');
 // Actual drag onto solid cells must fail; no state or money is lost.
 const before=await game();await drop(root(chip),'.warehouse-grid',18,2);assert.deepEqual(await game(),before);await page.keyboard.press('Escape');
 await place(root(chip),'.warehouse-grid',20,4);
 results.turns=[];for(const rotation of [1,2,3,0]){await drop(root(drill),'.warehouse-grid',17,1,'e');assert.equal((await game()).warehouse.positions[drill].rotated,rotation);results.turns.push({rotation,aspects:await aspect()});await shot(`drill-turn-${rotation}`);}
 await drop(root(drill),'.warehouse-grid',17,1,'q');assert.equal((await game()).warehouse.positions[drill].rotated,3);await drop(root(drill),'.warehouse-grid',17,1,'e');
 const pouch=(await game()).containers.find(c=>c.styleId==='courier-pouch').id,pack=(await game()).containers.find(c=>c.styleId==='courier-pack').id;
 await page.locator(`[data-world-container="${pouch}"]`).dblclick();const win=page.locator(`[data-container-window="${pouch}"]`),header=await win.locator('.container-window-title').boundingBox();await page.mouse.move(header.x+50,header.y+12);await page.mouse.down();await page.mouse.move(1170,320,{steps:12});await page.mouse.up();
 const grid=`[data-container-id="${pouch}"]`;await drop(root(drill),grid,0,0);assert.equal((await game()).items.find(i=>i.id===drill).containerId,pouch);await place(root(chip),grid,0,1);assert.equal((await game()).items.find(i=>i.id===chip).containerId,pouch);assert((await win.locator('header').innerText()).includes('8 格已用'));await shot('pouch-interlocking');
 // Move the chip out and back, exercising both DOM stacking orders at the same hole.
 await place(win.locator(`[data-storage-object="${chip}"]`),'.warehouse-grid',20,4);await place(root(chip),grid,0,1);results.pouchAspects=await aspect();
 await win.getByRole('button',{name:'关闭 旧式腰包',exact:true}).click();await click('结束当前接待');await click('绿色叫号按钮');await click('结束当前接待');await click('绿色叫号按钮');await click('结束当前接待');await click('绿色叫号按钮');await talk();
 const valve=(await game()).visitor.goods.find(i=>i.definitionId==='three-way-valve').id;await drop(page.locator(`.incoming-item[data-item="${valve}"]`),'.negotiation-table .surface-grid',8,0);await click('收下选中的货 →');await click('关闭谈判');await click('全部入库 ↓');await place(root(valve),'.warehouse-grid',20,1);await drop(root(lamp),'.warehouse-grid',14,1);assert.equal((await game()).warehouse.positions[lamp].x,14);await shot('three-distinct-objects');
 for(const id of [valve,lamp]){const beforeEdge=await game();await drop(root(id),'.warehouse-grid',23,5);assert.deepEqual(await game(),beforeEdge);await page.keyboard.press('Escape');}
 const snapshot=await game();await page.reload();await page.getByRole('button',{name:/继续经营/}).click();assert.deepEqual((await game()).items,snapshot.items);assert.deepEqual((await game()).containers,snapshot.containers);results.reload=true;
 await page.locator(`[data-world-container="${pack}"]`).dblclick();await shot('final-desktop');
 results.viewports=[];for(const [width,height] of [[1440,960],[1920,948],[960,650],[844,390]]){await page.setViewportSize({width,height});await page.waitForTimeout(120);const sizes=[];for(const selector of ['.incoming-tray .surface-cell','.negotiation-table .surface-cell','.warehouse-cell','.container-cell']){const b=await page.locator(selector).first().boundingBox();assert(Math.abs(b.width-b.height)<.1);sizes.push(b.width);}assert(sizes.every(s=>Math.abs(s-sizes[0])<.1));results.viewports.push({width,height,cell:sizes[0],aspects:await aspect()});await shot(`natural-proportions-${width}`);}
 const touch=await browser.newPage({viewport:{width:844,height:390},hasTouch:true,isMobile:true}),tap=name=>touch.getByRole('button',{name,exact:true}).tap(),touchGame=async()=>JSON.parse(await touch.evaluate(()=>window.render_game_to_text())).game;
 touch.on('pageerror',e=>errors.push(e.message));await touch.goto(process.env.CYBER_URL||'http://127.0.0.1:4176/cyber-shop/');await touch.getByText('固定种子开局',{exact:true}).tap();await touch.getByRole('spinbutton',{name:'街区种子'}).fill('2');await touch.locator('#start-btn').tap();await completeIntro(touch,true);
 await tap('绿色叫号按钮');await tap('结束当前接待');await tap('绿色叫号按钮');await tap('继续交谈');await tap('看看带来的货');await tap('把来货放上台 →');await tap('收下选中的货 →');await tap('关闭谈判');await tap('全部入库 ↓');
 const touchState=await touchGame(),touchDrill=touchState.items.find(i=>i.definitionId==='angle-drill').id,touchChip=touchState.items.find(i=>i.definitionId==='data-chip').id;
 const touchPoint=async(x,y)=>touch.locator('.warehouse-grid').evaluate((e,{x,y})=>{const b=e.getBoundingClientRect(),cell=parseFloat(getComputedStyle(e).getPropertyValue('--inventory-cell'));return {x:b.x+(x+.5)*cell,y:b.y+(y+.5)*cell};},{x,y});
 await touch.locator(`.warehouse-item[data-item="${touchDrill}"]`).tap();const target=await touchPoint(19,1);await touch.touchscreen.tap(target.x,target.y);assert.equal((await touchGame()).warehouse.positions[touchDrill].x,19);
 await touch.locator(`.warehouse-item[data-item="${touchChip}"]`).tap();const touchHole=await touchPoint(19,2);await touch.touchscreen.tap(touchHole.x,touchHole.y);assert.equal((await touchGame()).warehouse.positions[touchChip].x,19);assert.equal((await touchGame()).warehouse.positions[touchChip].y,2);await touch.screenshot({path:`${out}/touch-concavity.png`});await touch.close();results.touchConcavity=true;
 assert.deepEqual(errors,[]);await fs.writeFile(`${out}/results.json`,JSON.stringify({...results,concavityClickable:true,interlocking:true,solidCollisionRejected:true,edgeRejected:true,errors},null,2));console.log('SHAPED_INVENTORY_PASS');
}catch(e){await shot('failure').catch(()=>{});await fs.writeFile(`${out}/failure.json`,JSON.stringify({error:String(e),state:await game().catch(()=>null),errors},null,2));throw e;}finally{await browser.close();}
