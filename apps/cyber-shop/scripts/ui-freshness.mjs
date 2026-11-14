import {chromium} from 'playwright';
import fs from 'node:fs/promises';
import assert from 'node:assert/strict';
import {completeIntro} from './ui-onboarding.mjs';
const out=process.env.CYBER_EVIDENCE_DIR||'apps/cyber-shop/evidence/living-shop/freshness';await fs.mkdir(out,{recursive:true});
const url=process.env.CYBER_URL||'http://127.0.0.1:4176/cyber-shop/';
const browser=await chromium.launch({headless:true}),errors=[],results={};
const page=await browser.newPage({viewport:{width:1440,height:960}});page.setDefaultTimeout(8000);
function watch(p){p.on('pageerror',e=>errors.push(e.message));p.on('response',r=>{if(r.status()>=400)errors.push(`${r.status()} ${r.url()}`);});}watch(page);
const game=async(p=page)=>JSON.parse(await p.evaluate(()=>window.render_game_to_text())).game;
const click=name=>page.getByRole('button',{name,exact:true}).click(),panel=name=>page.locator('.cabinet-menu').getByRole('button',{name,exact:true}).click();
const food=async(p=page)=>(await game(p)).items.find(i=>i.category==='food');
const shot=async name=>{await page.locator('.toast').waitFor({state:'hidden'});await page.waitForFunction(()=>[...document.querySelectorAll('.notebook')].every(e=>getComputedStyle(e).opacity==='1'));await page.screenshot({path:`${out}/${name}.png`});};
async function start(p,touch=false){const act=touch?'tap':'click';await p.goto(url);await p.getByRole('button',{name:'选择开局词条',exact:true})[act]();await p.locator('[data-modifier="short-dated"]')[act]();await p.getByRole('button',{name:'采用词条 →',exact:true})[act]();await p.locator('#start-btn')[act]();await completeIntro(p,touch);}
async function nextDay(){await click('关店 / 日结 →');await click('确认闭店');await click('迎接新的一天 →');}
try{
 await start(page);const initial=await food();assert.equal(initial.expiresDay,2);await nextDay();
 await panel('工具采购');await click('六类耗材');await page.locator('[data-equipment="preserve-pack"]').getByRole('button').click();await click('关闭面板');
 await click('关店 / 日结 →');assert((await page.locator('.food-forecast').innerText()).includes('1 件明日开店时过期'));await shot('closing-before-preservation');
 await click('查看食品库存 ↗');assert.equal(await page.getByRole('combobox',{name:'库存分类'}).inputValue(),'food');
 const preview=page.getByRole('region',{name:'保鲜处理预览'});const before=await game(),beforeFood=await food(),packs=before.equipment['preserve-pack'];
 assert((await preview.innerText()).includes('延长 2 日 → 第 4 日'));assert((await preview.innerText()).includes('计入成本 ₡7'));
 await preview.scrollIntoViewIfNeeded();await shot('preservation-preview');await click('使用保鲜包');
 const preserved=await food();assert.equal(preserved.expiresDay,4);assert.equal(preserved.cost-beforeFood.cost,7);assert.equal((await game()).equipment['preserve-pack'],packs-1);assert.equal((await game()).cash,before.cash);
 assert(await page.getByRole('button',{name:'使用保鲜包',exact:true}).isDisabled());assert((await preview.innerText()).includes('已经使用过'));await click('关闭面板');
 await click('关店 / 日结 →');assert.equal(await page.locator('.food-forecast').count(),0);await click('确认闭店');await click('迎接新的一天 →');
 await page.reload();await page.getByRole('button',{name:/继续经营/}).click();assert.equal((await food()).expiresDay,4);assert.equal((await food()).cost,preserved.cost);
 await nextDay();await click('关店 / 日结 →');assert((await page.locator('.food-forecast').innerText()).includes('1 件明日开店时过期'));await click('确认闭店');
 await click('查看食品库存 ↗');assert((await preview.innerText()).includes('开店后'));await click('关闭面板');await click('迎接新的一天 →');
 assert.equal((await game()).day,5);await panel('库存');await page.getByRole('combobox',{name:'库存分类'}).selectOption('food');await page.locator(`.item-tile[data-item="${initial.id}"]`).click();
 assert.equal(await page.locator('.knowledge-lines [data-freshness="expired"]').innerText(),'已过期');assert(!(await page.locator('.knowledge-lines').innerText()).includes('临期折价'));assert((await preview.innerText()).includes('已经过期'));await preview.scrollIntoViewIfNeeded();await shot('expired-food');await click('关闭面板');
 results.preservation={previewCost:7,consumed:1,newExpiry:4,reload:true,expiresOnDay:5,expiredNotNearExpiry:true};
 // Import a normal UI-exported save with a purchased, unchecked culture pouch.
 await panel('设置与存档');await page.locator('input[type=file]').setInputFiles('apps/cyber-shop/evidence/living-shop/readability-ui-verified/readable-save.json');await page.waitForFunction(()=>JSON.parse(window.render_game_to_text()).panel==='');
 await click('关店 / 日结 →');const unknown=await page.locator('.food-forecast').innerText();assert(unknown.includes('1 件日期待检查'));assert(!unknown.includes('过期'));await shot('unchecked-forecast');await click('查看食品库存 ↗');
 assert((await preview.innerText()).includes('先检查食品日期'));assert(await page.getByRole('button',{name:'使用保鲜包',exact:true}).isDisabled());await click('检查物品');assert(await page.getByRole('button',{name:'使用保鲜包',exact:true}).isEnabled());results.unknownDateHidden=true;
 const touch=await browser.newPage({viewport:{width:844,height:390},hasTouch:true,isMobile:true});watch(touch);const tap=name=>touch.getByRole('button',{name,exact:true}).tap();
 await start(touch,true);await touch.locator('.cabinet-menu').getByRole('button',{name:'工具采购',exact:true}).tap();await tap('四类设施');await touch.locator('[data-equipment="cold-storage"]').getByRole('button').tap();await tap('关闭面板');
 await tap('关店 / 日结 →');assert((await touch.locator('.food-forecast').innerText()).includes('冷藏柜本夜延长 1 件'));await touch.getByRole('button',{name:'确认闭店',exact:true}).scrollIntoViewIfNeeded();await touch.locator('.toast').waitFor({state:'hidden'});await touch.screenshot({path:`${out}/touch-cold-forecast.png`});
 await tap('确认闭店');await tap('迎接新的一天 →');assert.equal((await food(touch)).expiresDay,3);await tap('关店 / 日结 →');assert.equal(await touch.locator('.food-forecast').count(),0);await tap('确认闭店');await tap('迎接新的一天 →');
 await touch.locator('.cabinet-menu').getByRole('button',{name:'库存',exact:true}).tap();await touch.getByRole('combobox',{name:'库存分类'}).selectOption('food');const tp=touch.getByRole('region',{name:'保鲜处理预览'});await tp.scrollIntoViewIfNeeded();await touch.locator('.toast').waitFor({state:'hidden'});await touch.screenshot({path:`${out}/touch-preservation.png`});await tap('使用保鲜包');assert.equal((await food(touch)).expiresDay,5);await touch.close();results.touchColdAndPreserve=true;
 assert.deepEqual(errors,[]);await fs.writeFile(`${out}/results.json`,JSON.stringify({ok:true,...results,errors},null,2));console.log('FRESHNESS_UI_PASS');
}catch(e){await page.screenshot({path:`${out}/failure.png`}).catch(()=>{});await fs.writeFile(`${out}/failure.json`,JSON.stringify({error:String(e),state:await game().catch(()=>null),errors},null,2));throw e;}finally{await browser.close();}
