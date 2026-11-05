import {chromium} from 'playwright';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
const out='apps/cyber-shop/evidence/counter-buffer';await fs.mkdir(out,{recursive:true});const browser=await chromium.launch({headless:true});const page=await browser.newPage({viewport:{width:1440,height:960}});page.setDefaultTimeout(7000);
const errors=[];page.on('pageerror',e=>errors.push(e.message));const game=async()=>JSON.parse(await page.evaluate(()=>window.render_game_to_text())).game;
const click=n=>page.getByRole('button',{name:n,exact:true}).click();
const drag=async(from,to)=>{const a=await from.boundingBox(),b=await to.boundingBox();await page.mouse.move(a.x+a.width/2,a.y+a.height/2);await page.mouse.down();await page.mouse.move(b.x+b.width/2,b.y+b.height/2,{steps:20});await page.mouse.up();await page.waitForTimeout(100);};
try{
 await page.goto('http://127.0.0.1:4175/cyber-shop/');await page.locator('#start-btn').click();await page.waitForSelector('.warehouse-item');
 const before=await game(),id=before.items[0].id;await drag(page.locator(`.warehouse-item[data-item="${id}"]`),page.getByRole('button',{name:'谈判空格 7',exact:true}));
 let s=await game();assert.equal(s.visitorArrived,false);assert.equal(s.items.find(i=>i.id===id).location,'counter');assert(!s.warehouse.positions[id]);assert.equal(await page.locator('.trade-dialog').count(),0);
 // Use the space just freed, then try the forbidden outside drop.
 const second=before.items[1].id;await page.locator(`.warehouse-item[data-item="${second}"]`).click();await click('仓库空格 1');assert.equal((await game()).warehouse.positions[second].x,0);
 await drag(page.locator(`.purchased-item[data-item="${id}"]`),page.getByRole('button',{name:'来货空格 1',exact:true}));assert.equal((await game()).items.find(i=>i.id===id).location,'counter');
 await page.reload();await page.getByRole('button',{name:/继续经营/}).click();await page.waitForSelector('.purchased-item');assert.equal((await game()).items.find(i=>i.id===id).location,'counter');
 await page.mouse.move(20,20);await page.waitForTimeout(350);await page.screenshot({path:`${out}/buffer-after-reload.png`});
 await click('关店 / 日结 →');assert(await page.getByRole('button',{name:'确认闭店',exact:true}).isDisabled());assert.match(await page.getByRole('alert').innerText(),/谈判台还有 1 件/);assert.equal((await game()).cash,before.cash);await page.waitForTimeout(250);await page.screenshot({path:`${out}/blocked-close.png`});await click('返回整理台面');
 await drag(page.locator(`.purchased-item[data-item="${id}"]`),page.getByRole('button',{name:'仓库空格 57',exact:true}));assert.equal((await game()).items.find(i=>i.id===id).location,'stock');
 await click('关店 / 日结 →');assert(await page.getByRole('button',{name:'确认闭店',exact:true}).isEnabled());await click('确认闭店');assert.equal((await game()).phase,'closed');
 assert.deepEqual(errors,[]);await fs.writeFile(`${out}/results.json`,JSON.stringify({bufferWithoutGuest:true,warehouseCellReused:true,outsideDropRejected:true,persistsAfterReload:true,closeBlockedUntilStored:true,noFeesWhileBlocked:true,errors},null,2));console.log('Counter buffer and close-day checks: PASS');
}catch(e){await page.screenshot({path:`${out}/failure.png`});throw e;}finally{await browser.close();}
