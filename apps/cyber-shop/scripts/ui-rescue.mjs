import {completeIntro} from './ui-onboarding.mjs';
/** Spend actual cash, reach failure, restore the real day-start backup, and recover by hand. */
import { chromium } from 'playwright';
import fs from 'node:fs/promises';
import assert from 'node:assert/strict';
const out=process.env.CYBER_EVIDENCE_DIR||'apps/cyber-shop/evidence/living-shop/rescue-baseline';await fs.mkdir(out,{recursive:true});
const expected=process.env.CYBER_EXPECT_RESCUE_UI==='1';
const browser=await chromium.launch({headless:true}),page=await browser.newPage({viewport:{width:1440,height:960}});page.setDefaultTimeout(8000);
const errors=[],missing=[],notices=[];page.on('pageerror',e=>errors.push(e.message));page.on('response',r=>{if(r.status()>=400)missing.push(r.url());});
const read=async()=>JSON.parse(await page.evaluate(()=>window.render_game_to_text())),game=async()=>(await read()).game;
const click=(name,exact=true)=>page.getByRole('button',{name,exact}).click();
const close=async()=>{if((await read()).panel)await click('关闭面板');};
const panel=async name=>{await close();await page.locator('.cabinet-menu').getByRole('button',{name,exact:false}).click();};
try{
 await page.goto(process.env.CYBER_URL||'http://127.0.0.1:4176/cyber-shop/');await page.locator('#start-btn').click();await completeIntro(page);await panel('工具采购');await click('四类设施');
 for(const id of ['workbench','cold-storage','stock-rack','stock-rack'])await page.locator(`[data-equipment="${id}"]`).getByRole('button').click();assert.equal((await game()).cash,0);await close();
 let recoveryPoint;
 for(let day=1;day<=4;day++){
  if(day===4)recoveryPoint=await game();await click('关店 / 日结 →');if(expected)assert.match(await page.getByRole('dialog').innerText(),/还差 ₡/);await click('确认闭店');
  const s=await game();assert.equal(s.debt,day*85);assert.equal(s.phase,day===4?'failed':'closed');
  if(day<4){
   const notice=await page.locator('.tomorrow-plan .warning').innerText();notices.push({day,notice});
   if(expected){assert.match(notice,/第 4 日闭店前/);assert.match(notice,new RegExp(`还有 ${4-day} 次营业日结`));}
   if(day===1)await page.screenshot({path:`${out}/first-overdue-receipt.png`});await click('迎接新的一天 →');
   if(expected){assert.equal((await read()).journey.next.id,'rescue');await page.locator('.journey-next').getByText('先补齐经营费用',{exact:true}).waitFor();}
  }
 }
 await page.screenshot({path:`${out}/failed-day-four.png`});await page.reload();await click('继续经营 ↗',false);assert.equal((await game()).phase,'failed');await click('恢复当日开始');assert.deepEqual(await game(),recoveryPoint);
 for(let n=0;n<2;n++){
  await page.locator('.workshop-hotspot').click();await click('接基础援助维修');await page.locator('.list-row').last().click();await click('连接检测仪 →');
  for(let j=1;j<=6;j++)await click(`清洁接点 ${j}`);const before=await game();await click('执行工序 →');assert.equal((await game()).cash,before.cash);await click('通电复检');await click('交付并结算 →');await close();
 }
 assert.equal((await game()).cash,620);await click('关店 / 日结 →');await click('确认闭店');let s=await game();assert.equal(s.debt,0);assert.equal(s.cash,280);assert.equal(s.phase,'closed');
 await page.screenshot({path:`${out}/recovered-receipt.png`});await click('迎接新的一天 →');assert.equal((await game()).day,5);assert.notEqual((await read()).journey.next.id,'rescue');
 await page.reload();await click('继续经营 ↗',false);assert.equal((await game()).day,5);assert.equal((await game()).cash,280);assert.equal(await page.locator('.save-error').count(),0);
 assert.deepEqual(errors,[]);assert.deepEqual(missing,[]);await fs.writeFile(`${out}/results.json`,JSON.stringify({ok:true,failureDay:4,notices,restoredExactDayStart:true,zeroCashRepairs:2,finalDay:5,finalCash:280,errors,missing},null,2));console.log('RESCUE_PASS');
}catch(e){await page.screenshot({path:`${out}/failure.png`}).catch(()=>{});await fs.writeFile(`${out}/failure.json`,JSON.stringify({error:String(e),notices,state:await read().catch(()=>null),errors,missing},null,2));throw e;}finally{await browser.close();}
