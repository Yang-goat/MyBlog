import {chromium} from 'playwright';
import fs from 'node:fs/promises';
import assert from 'node:assert/strict';
const out=process.env.CYBER_EVIDENCE_DIR||'apps/cyber-shop/evidence/living-shop/conditions';
await fs.mkdir(out,{recursive:true});
const browser=await chromium.launch({headless:true}),url=process.env.CYBER_URL||'http://127.0.0.1:4176/cyber-shop/';
const errors=[],results={};let current;
const game=async p=>JSON.parse(await p.evaluate(()=>window.render_game_to_text())).game;
async function pageFor(touch=false){const c=await browser.newContext({viewport:touch?{width:844,height:390}:{width:1440,height:960},hasTouch:touch,isMobile:touch});const p=await c.newPage();p.setDefaultTimeout(8000);p.on('pageerror',e=>errors.push(e.message));p.on('response',r=>{if(r.status()>=400)errors.push(`${r.status()} ${r.url()}`);});await p.goto(url);current=p;return p;}
try{
 const standard=await pageFor();await standard.locator('#start-btn').click();const baseline=await game(standard);assert.equal(baseline.hours,12);assert.equal(baseline.rootCapacity*4,144);await standard.context().close();
 for(const adverse of [false,true]){
  const p=await pageFor(adverse),action=adverse?'tap':'click',click=async name=>p.getByRole('button',{name,exact:typeof name==='string'})[action]();
  const select=async name=>click(new RegExp(name));
  await click('选择开局词条');const dialog=p.getByRole('dialog',{name:'开局词条',exact:true});
  assert.equal(await dialog.locator('.modifier-options button').count(),11);
  await select('长班营业');await select('批发熟客');await select('鲜货直送');
  if(adverse){await select('短班营业');await select('零售货源');await select('临期货源');for(const name of ['长班营业','批发熟客','鲜货直送'])assert.equal(await dialog.getByRole('button',{name:new RegExp(name)}).getAttribute('aria-pressed'),'false');}
  const hours=adverse?10:14,ids=adverse?['short-shift','no-wholesale','short-dated']:['long-shift','small-wholesale','fresh-supply'];
  assert((await dialog.locator('.modifier-preview').innerText()).includes(`每日 ${hours} 工时`));
  const footer=await dialog.locator('footer').boundingBox(),vp=p.viewportSize();assert(footer.y>=0&&footer.y+footer.height<=vp.height);
  assert(await dialog.locator('.modifier-options').evaluate(e=>e.scrollHeight>=e.clientHeight));
  await p.screenshot({path:`${out}/${adverse?'challenge-touch':'help-desktop'}-choices.png`});await click('采用词条 →');await p.locator('#start-btn')[action]();await click('跳过引导');
  let s=await game(p);assert.deepEqual(s.modifiers,ids);assert.equal(s.hours,hours);assert.equal(s.maxHours,hours);assert.equal(s.rootCapacity*4,144);
  const water=s.items.find(i=>i.expiresDay!==undefined),oldWater=baseline.items.find(i=>i.id===water.id);
  assert.equal(water.expiresDay,adverse?2:oldWater.expiresDay+2);assert((await p.locator('.television-hours').innerText()).includes(`${hours} / ${hours}`));
  await click('绿色叫号按钮');await click('结束当前接待');await click('绿色叫号按钮');await click(/继续交谈/);await click(/看看带来的货/);await click('把来货放上台 →');
  await click('取消全部选择');const before=await game(p),count=adverse?3:2,goods=before.visitor.goods.slice(0,count);
  for(const item of goods)await click(`选择 ${item.id}`);
  const total=Math.round(goods.reduce((n,i)=>n+i.quote,0)*(adverse?1:.9));
  assert.equal(Number(await p.getByLabel('议价金额',{exact:true}).inputValue()),total);
  const receiptText=await p.locator('.basket-receipt').innerText();assert(receiptText.includes(adverse?'本局无批发折扣':'2 件起九折'));assert.equal(receiptText.includes('批发九折 −'),!adverse);
  assert(!receiptText.includes('买家剩余预算'));
  await p.screenshot({path:`${out}/${adverse?'retail-touch':'two-item-bulk'}-quote.png`});
  if(adverse){await p.getByLabel('议价金额',{exact:true}).fill('1');await click('报价并成交');const r=(await game(p)).visitor.negotiation;assert.equal(r.status,'counter');await click(`接受还价 · ₡${r.quote}`);assert.equal((await game(p)).cash,before.cash-r.quote);}
  else{await click('收下选中的货 →');assert.equal((await game(p)).cash,before.cash-total);}
  await click('关闭谈判');await click('全部入库 ↓');await click('关店 / 日结 →');await click('确认闭店');await click('迎接新的一天 →');s=await game(p);assert.equal(s.hours,hours);assert.equal(s.items.find(i=>i.id===water.id).expiresDay,water.expiresDay);
  await p.reload();await click(/继续经营/);assert.deepEqual((await game(p)).modifiers,ids);assert.equal((await game(p)).hours,hours);
  await click('设置与存档');assert((await p.locator('.active-modifiers').innerText()).includes(adverse?'临期货源':'鲜货直送'));
  const download=p.waitForEvent('download');await click('导出当前存档');const file=await(await download).path();await p.locator('input[type=file]').setInputFiles(file);await p.waitForFunction(()=>JSON.parse(window.render_game_to_text()).panel==='');assert.deepEqual((await game(p)).modifiers,ids);
  await p.screenshot({path:`${out}/${adverse?'challenge-touch':'help-desktop'}-day-two.png`});
  results[adverse?'challenge':'help']={hours,modifiers:ids,quote:total,foodExpiry:water.expiresDay,reload:true,exportImport:true};await p.context().close();
 }
 const reset=await pageFor();await reset.getByRole('button',{name:'选择开局词条',exact:true}).click();await reset.getByRole('button',{name:/短班营业/}).click();await reset.getByRole('button',{name:'恢复标准营业',exact:true}).click();assert.equal(await reset.locator('.modifier-options [aria-pressed=true]').count(),0);assert((await reset.locator('.modifier-preview').innerText()).includes('每日 12 工时'));await reset.keyboard.press('Escape');assert.equal(await reset.getByRole('dialog').count(),0);await reset.context().close();
 assert.deepEqual(errors,[]);results.errors=errors;await fs.writeFile(`${out}/results.json`,JSON.stringify(results,null,2));console.log('CONDITIONS_PASS');
}catch(e){if(current&&!current.isClosed())await current.screenshot({path:`${out}/failure.png`,fullPage:true});throw e;}finally{await browser.close();}
