/** A real cross-day work order, including an incorrect attempt and save migration. */
import { chromium } from 'playwright';
import fs from 'node:fs/promises';
import assert from 'node:assert/strict';
const out=process.env.CYBER_EVIDENCE_DIR||'apps/cyber-shop/evidence/living-shop/repair-archive';await fs.mkdir(out,{recursive:true});
const browser=await chromium.launch({headless:true}),page=await browser.newPage({viewport:{width:1440,height:960}});page.setDefaultTimeout(8000);
const errors=[],missing=[];page.on('pageerror',e=>errors.push(e.message));page.on('response',r=>{if(r.status()>=400)missing.push(r.url());});
const snap=async()=>JSON.parse(await page.evaluate(()=>window.render_game_to_text()));const game=async()=>(await snap()).game;
const click=(name,exact=true)=>page.getByRole('button',{name,exact}).click();
const close=async()=>{if((await snap()).panel)await click('关闭面板');};
const panel=async(name)=>{await close();await page.locator('.cabinet-menu').getByRole('button',{name,exact:false}).click();};
try{
 await page.goto(process.env.CYBER_URL||'http://127.0.0.1:4175/cyber-shop/');await page.locator('#start-btn').click();await click('跳过引导');
 await page.locator('.workshop-hotspot').click();await click('接基础援助维修');const id=(await game()).orders[0].id;await page.locator(`[data-order="${id}"]`).click();await click('连接检测仪 →');
 const initial=(await game()).orders[0].conditionBefore;assert.equal((await game()).repairHistory.length,0);
 await click('参数操作');await page.getByLabel('维修工序',{exact:true}).selectOption('replace');await page.getByLabel('维修模块',{exact:true}).selectOption('power');await click('执行工序');assert.equal((await game()).orders[0].steps[0].result,'miss');
 await close();await click('关店 / 日结 →');await click('确认闭店');await click('迎接新的一天 →');await page.locator('.workshop-hotspot').click();await page.locator(`[data-order="${id}"]`).click();
 for(let n=1;n<=6;n++)await click(`清洁接点 ${n}`);await click('执行工序 →');await click('通电复检');const beforeDelivery=await game();await click('交付并结算 →');
 const after=await game(),receipt=after.repairHistory[0];assert.equal(receipt.receivedDay,1);assert.equal(receipt.day,2);assert.equal(receipt.reward,after.cash-beforeDelivery.cash);assert.equal(receipt.conditionBefore,initial);assert.equal(receipt.steps.length,2);
 await click('翻阅工序单 →',false);await page.locator(`[data-record="${id}"]`).waitFor();await page.getByText('已复检 · 已交付',{exact:true}).waitFor();assert.equal(await page.locator('.document-steps li').count(),2);
 await page.waitForFunction(()=>!document.querySelector('.toast'));await page.screenshot({path:`${out}/cross-day-receipt.png`});await page.setViewportSize({width:844,height:390});await page.locator('.repair-document').hover();await page.mouse.wheel(0,210);await page.waitForTimeout(150);await page.screenshot({path:`${out}/archive-844.png`});
 assert(await page.locator('.notebook').evaluate(el=>el.scrollWidth<=el.clientWidth+1));
 await panel('设置与存档');const [download]=await Promise.all([page.waitForEvent('download'),click('导出当前存档')]);await download.saveAs(`${out}/archive-save.json`);const saved=await game();
 await close();await click('绿色叫号按钮');assert.notDeepEqual(await game(),saved);
 await panel('设置与存档');await page.locator('input[type=file]').setInputFiles(`${out}/archive-save.json`);await page.waitForFunction(()=>JSON.parse(window.render_game_to_text()).panel==='');assert.deepEqual(await game(),saved);
 await page.reload();await click('继续经营 ↗',false);assert.deepEqual(await game(),saved);assert.equal(await page.locator('.save-error').count(),0);
 await page.locator('.workshop-hotspot').click();await click('修复档案');await page.locator(`[data-record="${id}"]`).waitFor();
 assert.deepEqual(errors,[]);assert.deepEqual(missing,[]);await fs.writeFile(`${out}/results.json`,JSON.stringify({ok:true,crossDay:true,wrongAttemptRecorded:true,actualReward:receipt.reward,conditionBefore:initial,conditionAfter:receipt.conditionAfter,exportReplacesLaterState:true,reload:true,errors,missing},null,2));console.log('REPAIR_ARCHIVE_PASS');
}catch(e){await page.screenshot({path:`${out}/failure.png`}).catch(()=>{});await fs.writeFile(`${out}/failure.json`,JSON.stringify({error:String(e),state:await snap().catch(()=>null),errors,missing},null,2));throw e;}finally{await browser.close();}
