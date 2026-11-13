/** Normal procurement, earned skill discount, and visible equipment on the live workbench. */
import { chromium } from 'playwright';
import fs from 'node:fs/promises';
import assert from 'node:assert/strict';
const out=process.env.CYBER_EVIDENCE_DIR||'apps/cyber-shop/evidence/living-shop/supplies';await fs.mkdir(out,{recursive:true});
const browser=await chromium.launch({headless:true}),page=await browser.newPage({viewport:{width:1440,height:960}});page.setDefaultTimeout(8000);
const errors=[],missing=[];page.on('pageerror',e=>errors.push(e.message));page.on('response',r=>{if(r.status()>=400)missing.push(r.url());});
const snap=async()=>JSON.parse(await page.evaluate(()=>window.render_game_to_text()));const game=async()=>(await snap()).game;
const click=(name,exact=true)=>page.getByRole('button',{name,exact}).click();
const close=async()=>{if((await snap()).panel)await click('关闭面板');};
const panel=async(name)=>{await close();await page.locator('.cabinet-menu').getByRole('button',{name,exact:false}).click();};
const offer=id=>page.locator(`[data-equipment="${id}"]`);
try{
 await page.goto(process.env.CYBER_URL||'http://127.0.0.1:4176/cyber-shop/');await page.locator('#start-btn').click();await click('跳过引导');
 await panel('工具采购');assert(await offer('micro-solder').getByRole('button',{name:'已拥有'}).isDisabled());
 await click('四类设施');const before=await game();await offer('workbench').getByRole('button').click();assert.equal((await game()).cash,before.cash-300);assert.equal((await game()).equipment.workbench,2);assert(await offer('workbench').getByRole('button',{name:'已达上限'}).isDisabled());
 await offer('cold-storage').getByRole('button').click();assert(await offer('cold-storage').getByRole('button').isDisabled());
 await click('六类耗材');await page.getByLabel('耗材采购数量').selectOption('10');assert(await offer('neural-supplies').getByRole('button').isDisabled());await offer('neural-supplies').getByText('现金不足。',{exact:true}).waitFor();
 await page.getByLabel('耗材采购数量').selectOption('5');const material=await game();await offer('cleaner').getByRole('button',{name:'采购 × 5 · ₡80',exact:true}).click();assert.equal((await game()).cash,material.cash-80);assert.equal((await game()).equipment.cleaner,material.equipment.cleaner+5);
 await page.screenshot({path:`${out}/quantity-and-budget.png`});
 await page.locator('.notebook').hover();await page.mouse.wheel(0,1600);await page.waitForTimeout(150);
 assert(await page.getByRole('button',{name:'关闭面板',exact:true}).evaluate(button=>{const r=button.getBoundingClientRect();return document.elementFromPoint(r.x+r.width/2,r.y+r.height/2)===button;}),'Close remains reachable after scrolling to the final supply row');
 await page.screenshot({path:`${out}/scrolled-close-control.png`});
 await panel('设置与存档');await page.locator('input[type=file]').setInputFiles('apps/cyber-shop/evidence/living-shop/endless-career/career-save.json');
 await page.waitForFunction(()=>JSON.parse(window.render_game_to_text()).panel==='');
 await panel('技能与资质');for(const id of ['business-1','business-2','business-3'])await page.locator(`[data-skill="${id}"]`).click();
 await panel('工具采购');await click('六类耗材');await page.getByLabel('耗材采购数量').selectOption('5');const discount=await game();await offer('cleaner').getByRole('button',{name:'采购 × 5 · ₡68',exact:true}).click();assert.equal((await game()).cash,discount.cash-68);assert.equal((await game()).equipment.cleaner,discount.equipment.cleaner+5);
 await page.screenshot({path:`${out}/earned-discount.png`});
 await close();await page.locator('.workshop-hotspot').click();await click('接基础援助维修');await page.locator('.list-row').last().click();
 assert.equal(await page.locator('.owned-bench-tools [data-tool]').count(),3);assert.equal(await page.locator('.bench-scene').getAttribute('data-diagnostic'),'standby');await click('连接检测仪 →');assert.equal(await page.locator('.bench-scene').getAttribute('data-diagnostic'),'fault');
 await page.locator('.bench-scene img').evaluateAll(images=>Promise.all(images.map(i=>i.decode())));await page.screenshot({path:`${out}/equipped-workbench.png`});
 await page.setViewportSize({width:844,height:390});await page.screenshot({path:`${out}/equipped-workbench-844.png`});
 await panel('设置与存档');await page.getByLabel(/减少动态/).check();await close();await page.locator('.workshop-hotspot').click();await page.locator('.list-row').last().click();assert.equal(await page.locator('.scope-glass i').evaluate(el=>getComputedStyle(el).animationName),'none');
 assert.deepEqual(errors,[]);assert.deepEqual(missing,[]);await fs.writeFile(`${out}/results.json`,JSON.stringify({ok:true,ownedToolDisabled:true,facilityCap:true,insufficientCashDisabled:true,batchQuantity:5,normalPrice:80,earnedDiscountPrice:68,ownedToolsVisible:3,reducedMotion:true,closeReachableAfterScroll:true,errors,missing},null,2));console.log('SUPPLIES_PASS');
}catch(e){await page.screenshot({path:`${out}/failure.png`}).catch(()=>{});throw e;}finally{await browser.close();}
