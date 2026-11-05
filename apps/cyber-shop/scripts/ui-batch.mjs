import { chromium } from 'playwright';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
const browser=await chromium.launch({headless:true});const page=await browser.newPage({viewport:{width:1440,height:960}});page.setDefaultTimeout(8000);
const errors=[];page.on('pageerror',e=>errors.push(e.message));const g=async()=>JSON.parse(await page.evaluate(()=>window.render_game_to_text())).game;
const click=n=>page.getByRole('button',{name:n,exact:true}).click();
const out='apps/cyber-shop/evidence/room-redesign';
try{
 await page.goto('http://127.0.0.1:4175/cyber-shop/');await page.locator('#start-btn').click();await page.waitForSelector('.warehouse-item');await click('跳过引导');await click('绿色叫号按钮');await click('结束当前接待');await click('绿色叫号按钮');await page.keyboard.press('Space');await page.keyboard.press('Space');
 const before=await g();assert.equal(before.visitor.goods.length,4);
 await page.locator('.incoming-item').first().click();await click('谈判空格 1');await page.waitForSelector('.trade-dialog');
 // First make a single purchase. The same NPC remains with three goods.
 await page.getByRole('button',{name:'只买这件',exact:true}).first().click();let partial=await g();assert.equal(partial.visitor.goods.length,3);assert.equal(partial.visitor.resolved,false);assert.equal(before.cash-partial.cash,before.visitor.quote);
 await click('整批放上谈判台');assert.equal(await page.locator('.trade-lot.chosen').count(),3);
 const total=Math.round(partial.visitor.quote*3*.9);await page.getByText('批发九折',{exact:false}).waitFor();await page.screenshot({path:`${out}/10-wholesale.png`,fullPage:true});
 await click('收下选中的货 →');const bought=await g();assert.equal(partial.cash-bought.cash,total);assert.equal(bought.visitor.resolved,true);assert.equal(bought.items.filter(i=>i.location==='counter').length,4);await click('关闭谈判');
 await page.reload();await page.getByRole('button',{name:/继续经营/}).click();await page.waitForSelector('.purchased-item');assert.equal(await page.locator('.purchased-item').count(),4);
 for(let n=0;n<4;n++)await page.locator('.purchased-item').first().dblclick();assert.equal((await g()).items.filter(i=>i.location==='counter').length,0);
 const box=await page.locator('.warehouse-cell').first().boundingBox();assert(Math.abs(box.width-box.height)<1);
 const table=await page.locator('.negotiation-table .surface-cell').first().boundingBox();assert(Math.abs(table.width-table.height)<2);
 await page.screenshot({path:`${out}/11-bulk-stored.png`,fullPage:true});
 // Reach the buyer who explicitly wants this supplier's category.
 await click('绿色叫号按钮');for(let n=0;n<3;n++){await click('结束当前接待');await click('绿色叫号按钮');}
 await page.keyboard.press('Space');await page.keyboard.press('Space');let buyer=await g();assert.equal(buyer.visitor.category,before.visitor.category);
 const boughtIds=before.visitor.goods.map(i=>i.id);await page.locator(`.warehouse-item[data-item="${boughtIds[0]}"]`).click();await click('谈判空格 1');
 const budget=buyer.visitor.budget;await page.getByRole('button',{name:'只卖这件',exact:true}).first().click();buyer=await g();assert(buyer.visitor.budget<budget);assert.equal(buyer.visitor.resolved,false);
 await click('选取全部可售货物');assert.equal(await page.locator('.trade-lot.chosen').count(),3);await click('成交并交货 →');const sold=await g();assert(!sold.items.some(i=>boughtIds.includes(i.id)));assert(sold.visitor.budget>=0);
 await page.screenshot({path:`${out}/12-partial-and-bulk-sale.png`,fullPage:true});
 assert.deepEqual(errors,[]);await fs.writeFile(`${out}/batch-ui-results.json`,JSON.stringify({singleThenBulk:true,singleThenMultiSale:true,discount:total,remainingGoodsPersist:true,purchasedCounterPersist:true,storeAll:true,squareWarehouseCell:box,squareCounterCell:table,errors},null,2));console.log('Single purchase + remaining three wholesale + persisted counter + manual store: PASS');
}catch(e){await page.screenshot({path:`${out}/batch-failure.png`,fullPage:true});throw e;}finally{await browser.close();}
