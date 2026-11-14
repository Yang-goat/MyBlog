/** Earn and claim a first reply, persist a free choice, then read a fully earned correspondence. */
import { chromium } from 'playwright';
import fs from 'node:fs/promises';
import assert from 'node:assert/strict';
const out=process.env.CYBER_EVIDENCE_DIR||'apps/cyber-shop/evidence/living-shop/district';await fs.mkdir(out,{recursive:true});
const browser=await chromium.launch({headless:true}),page=await browser.newPage({viewport:{width:1440,height:960}});page.setDefaultTimeout(8000);
const errors=[],missing=[];page.on('pageerror',e=>errors.push(e.message));page.on('console',m=>{if(m.type()==='error')errors.push(m.text());});page.on('response',r=>{if(r.status()>=400)missing.push(r.url());});
const read=async()=>JSON.parse(await page.evaluate(()=>window.render_game_to_text())),game=async()=>(await read()).game;
const click=(name,exact=true)=>page.getByRole('button',{name,exact}).click();
const close=async()=>{if((await read()).panel)await click('关闭面板');};
const panel=async name=>{await close();await page.locator('.cabinet-menu').getByRole('button',{name,exact:false}).click();};
const quest=id=>page.locator(`[data-quest="${id}"]`);
try{
 await page.goto(process.env.CYBER_URL||'http://127.0.0.1:4175/cyber-shop/');await page.locator('#start-btn').click();await click('跳过引导');await panel('街区手记');
 assert.equal(await page.locator('.district-letter').count(),0);assert(await quest('neighborhood-line').getByRole('button',{name:/领取街坊谢礼/}).isDisabled());
 await quest('neighborhood-line').getByRole('button',{name:'继续维修 ↗',exact:true}).click();assert.equal((await read()).panel,'orders');await close();await panel('街区手记');
 const before=await game();await page.locator('.event-story').getByRole('button').first().click();assert.equal((await game()).cash,before.cash);await page.getByRole('heading',{name:'提供应急联络',exact:true}).waitFor();assert.equal(await page.locator('.event-story button').count(),0);await page.screenshot({path:`${out}/first-choice.png`});
 for(let n=0;n<3;n++){
  await close();await page.locator('.workshop-hotspot').click();await click('接基础援助维修');await page.locator('.list-row').last().click();await click('连接检测仪 →');
  for(let j=1;j<=6;j++)await click(`清洁接点 ${j}`);await click('执行工序 →');await click('通电复检');await click('交付并结算 →');
 }
 await panel('街区手记');assert.equal(await page.locator('.district-letter').count(),0);const earned=await game();await quest('neighborhood-line').getByRole('button',{name:/领取街坊谢礼/}).click();assert.equal((await game()).cash,earned.cash+140);await page.locator('[data-letter="neighborhood-line:1"]').waitFor();
 assert.match(await quest('neighborhood-line').innerText(),/第 1 日收到/);assert.match(await quest('neighborhood-line').innerText(),/3 \/ 12 次完整维修/);await quest('neighborhood-line').scrollIntoViewIfNeeded();await page.waitForFunction(()=>!document.querySelector('.toast'));await page.screenshot({path:`${out}/earned-first-letter.png`});
 await page.reload();await click('继续经营 ↗',false);await panel('街区手记');await page.locator('[data-letter="neighborhood-line:1"]').waitFor();await page.getByRole('heading',{name:'提供应急联络',exact:true}).waitFor();
 await close();await click('关店 / 日结 →');await click('确认闭店');await click('迎接新的一天 →');await panel('街区手记');assert.equal(await page.locator('.event-response').count(),0);const next=await game();await page.locator('.event-story').getByRole('button').first().click();assert.equal((await game()).cash,next.cash-60);await page.getByRole('heading',{name:'赞助加餐',exact:true}).waitFor();
 await panel('设置与存档');await page.locator('input[type=file]').setInputFiles('apps/cyber-shop/evidence/living-shop/shop-growth-final/six-exhibits-save.json');await page.waitForFunction(()=>JSON.parse(window.render_game_to_text()).panel==='');await panel('街区手记');
 for(let n=0;n<12;n++){const enabled=page.locator('.quest-claim .primary:enabled');if(!await enabled.count())break;await enabled.first().click();}
 assert.equal(await page.locator('.quest-complete').count(),4);assert.equal(await page.locator('.district-letter').count(),4);await quest('archive-home').scrollIntoViewIfNeeded();await page.waitForFunction(()=>!document.querySelector('.toast'));await page.screenshot({path:`${out}/completed-collection-story.png`});
 await quest('archive-home').locator('summary').click();assert.equal(await quest('archive-home').locator('.earlier-letters section').count(),2);
 await close();await page.locator('.shop-plaque').click();assert.equal(await page.locator('[data-keepsake]').count(),4);await page.screenshot({path:`${out}/four-keepsakes.png`});await page.locator('[data-keepsake]').first().click();assert.equal((await read()).panel,'journal');
 await page.setViewportSize({width:844,height:390});await quest('neighborhood-line').locator('.district-letter').scrollIntoViewIfNeeded();await page.screenshot({path:`${out}/letter-844.png`});assert(await page.locator('.notebook').evaluate(el=>el.scrollWidth<=el.clientWidth+1));await click('关闭面板');
 await page.reload();await click('继续经营 ↗',false);await page.locator('.shop-plaque').click();assert.equal(await page.locator('[data-keepsake]').count(),4);
 assert.deepEqual(errors,[]);assert.deepEqual(missing,[]);await fs.writeFile(`${out}/results.json`,JSON.stringify({ok:true,firstLetterEarned:true,freeChoicePersisted:true,paidChoice:60,allQuestStories:4,keepsakes:4,reload:true,errors,missing},null,2));console.log('DISTRICT_PASS');
}catch(e){await page.screenshot({path:`${out}/failure.png`}).catch(()=>{});await fs.writeFile(`${out}/failure.json`,JSON.stringify({error:String(e),state:await read().catch(()=>null),errors,missing},null,2));throw e;}finally{await browser.close();}
