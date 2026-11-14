/** First-day customer flow using real touch input, without keyboard shortcuts. */
import {chromium} from 'playwright';
import fs from 'node:fs/promises';
import assert from 'node:assert/strict';
const out=process.env.CYBER_EVIDENCE_DIR||'apps/cyber-shop/evidence/living-shop/touch-day';await fs.mkdir(out,{recursive:true});
const browser=await chromium.launch({headless:true});const context=await browser.newContext({viewport:{width:844,height:390},hasTouch:true,isMobile:true});const page=await context.newPage();page.setDefaultTimeout(8000);
const errors=[];page.on('pageerror',e=>errors.push(e.message));const g=async()=>JSON.parse(await page.evaluate(()=>window.render_game_to_text())).game;
async function tap(name){const button=page.getByRole('button',{name,exact:true});await button.scrollIntoViewIfNeeded();await button.tap();}
async function talk(){await tap('继续交谈 空格');const kind=(await g()).visitor.kind;await tap((kind==='repair'?'看看需要修什么':kind==='buyer'?'看看有什么合适的':'看看带来的货')+' 空格');}
try{
 await page.goto(process.env.CYBER_URL||'http://127.0.0.1:4175/cyber-shop/');await page.locator('#start-btn').tap();await tap('跳过引导');
 const hit=await page.locator('.call-green-button').evaluate(el=>({width:getComputedStyle(el,'::after').width,height:getComputedStyle(el,'::after').height}));assert(parseFloat(hit.width)>=44&&parseFloat(hit.height)>=44);
 // Tap beside the small drawn lamp, inside its expanded touch target.
 const call=await page.locator('.call-green-button').boundingBox();await page.touchscreen.tap(call.x+call.width/2-17,call.y+call.height/2);
 assert((await g()).visitorArrived);await talk();await tap('查看维修委托 →');await tap('接下维修 →');await tap('连接检测仪 →');
 assert.equal((await g()).orders.length,1);for(let n=1;n<=6;n++)await tap(`清洁接点 ${n}`);
 await tap('执行工序 →');await tap('通电复检');await tap('交付并结算 →');await tap('关闭面板');assert.equal((await g()).records.repairs,1);
 await tap('绿色叫号按钮');await talk();
 const bubble=await page.locator('.speech-bubble').boundingBox(),windowBox=await page.locator('.visitor-window').boundingBox();assert(bubble.y+bubble.height<=windowBox.y+windowBox.height+1,'Dialogue must stay inside a scrollable window');
 await page.screenshot({path:`${out}/seller-dialogue.png`});await tap('把来货放上台 →');
 const before=await g();await tap('基础检查');await tap('收下选中的货 →');await tap('关闭谈判');await tap('全部入库 ↓');assert.equal((await g()).records.trades,before.records.trades+1);
 await tap('关店 / 日结 →');await tap('确认闭店');await page.screenshot({path:`${out}/receipt.png`});await tap('迎接新的一天 →');assert.equal((await g()).day,2);
 assert.equal((await g()).visitorArrived,false);assert.deepEqual(errors,[]);await page.screenshot({path:`${out}/next-morning.png`});
 await fs.writeFile(`${out}/results.json`,JSON.stringify({ok:true,viewport:'844x390',touchOnly:true,expandedCallTarget:hit,customerRepair:true,sellerDialogueAndPurchase:true,store:true,dayReport:true,nextMorning:true,errors},null,2));console.log('TOUCH_DAY_PASS');
}catch(e){await page.screenshot({path:`${out}/failure.png`});await fs.writeFile(`${out}/failure.json`,JSON.stringify({error:String(e),state:await g(),errors},null,2));throw e;}finally{await browser.close();}
