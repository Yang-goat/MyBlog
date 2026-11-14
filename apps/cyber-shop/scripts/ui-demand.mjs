/** Buy a full lot, then sell only the finite order through ordinary inputs. */
import {chromium} from 'playwright';
import fs from 'node:fs/promises';
import assert from 'node:assert/strict';
import {completeIntro} from './ui-onboarding.mjs';
const out=process.env.CYBER_EVIDENCE_DIR||'apps/cyber-shop/evidence/living-shop/demand-ui';await fs.mkdir(out,{recursive:true});
const browser=await chromium.launch({headless:true});const errors=[];
try{
 const results=[];
 for(const touch of [false,true]){
  const page=await browser.newPage({viewport:touch?{width:844,height:390}:{width:1440,height:960},hasTouch:touch,isMobile:touch});page.setDefaultTimeout(8000);page.on('pageerror',e=>errors.push(e.message));page.on('console',m=>{if(m.type()==='error')errors.push(m.text());});
  const use=touch?'tap':'click',click=(name,exact=true)=>page.getByRole('button',{name,exact})[use]();
  const read=async()=>JSON.parse(await page.evaluate(()=>window.render_game_to_text())),game=async()=>(await read()).game;
  const talk=async()=>{const v=(await game()).visitor;for(let n=0;n<2;n++){if(((await game()).conversations?.[v.id]??0)>=2)break;await page.locator('.speech-bubble button').filter({hasText:n===0?'继续交谈':'看看'}).first()[use]();}};
  const shot=async name=>{await page.waitForTimeout(100);await page.screenshot({path:`${out}/${touch?'touch':'desktop'}-${name}.png`});};
  try{
   await page.goto(process.env.CYBER_URL||'http://127.0.0.1:4176/cyber-shop/');await page.locator('#start-btn')[use]();await completeIntro(page,touch);await click('绿色叫号按钮');await click('结束当前接待');await click('绿色叫号按钮');await talk();await click('把来货放上台 →');
   const goods=(await game()).visitor.goods,ids=goods.map(i=>i.id);await click('整批放上谈判台');await shot('purchase-cash-reserve');await click('收下选中的货 →');const bought=await game();assert(ids.every(id=>bought.items.some(i=>i.id===id)));await click('关闭谈判');await click('全部入库 ↓');
   while((await game()).visitorIndex<5){if(!(await game()).visitor.resolved)await click('结束当前接待');await click('绿色叫号按钮');}
   await talk();const before=await game();assert.equal(before.visitor.kind,'buyer');assert.equal(before.visitor.category,goods[0].category);const limit=before.visitor.demand.limit;assert(limit<ids.length);
   await click('挑选出售货物 →');await click('按需求挑选');assert.equal(await page.locator('.trade-lot.chosen').count(),limit);
   const extra=page.locator('.trade-lot:not(.chosen) .lot-select').first();await extra[use]();assert.equal(await page.locator('.trade-lot.chosen').count(),limit);await shot('selection-limit');
   await page.locator('.trade-lot .lot-one').first()[use]();assert.equal((await game()).visitor.demand.fulfilled,1);await shot('partial-receipt');
   await page.reload();await click('继续经营 ↗',false);assert.equal((await game()).visitor.demand.fulfilled,1);await click('挑选出售货物 →');await click('按预算挑选');assert.equal(await page.locator('.trade-lot.chosen').count(),limit-1);await click('成交并交货 →');
   const done=await game();assert.equal(done.visitor.demand.fulfilled,limit);assert.equal(done.items.filter(i=>ids.includes(i.id)).length,ids.length-limit);assert(await page.getByRole('button',{name:'按需求挑选',exact:true}).isDisabled());assert(await page.locator('.trade-lot .lot-one').first().isDisabled());
   await page.locator('.trade-receipt').scrollIntoViewIfNeeded();await shot('order-filled');await click('关闭谈判');if(await page.getByRole('button',{name:'全部入库 ↓',exact:true}).count())await click('全部入库 ↓');
   await click('关店 / 日结 →');await click('确认闭店');await page.locator('.stock-capital').scrollIntoViewIfNeeded();await shot('stock-capital');assert((await page.locator('.stock-capital').innerText()).includes('成本'));
   results.push({touch,limit,bought:ids.length,surplus:ids.length-limit,persisted:true});
  }catch(e){await shot('failure');await fs.writeFile(`${out}/${touch?'touch':'desktop'}-failure.json`,JSON.stringify({error:String(e),state:await read()},null,2));throw e;}finally{await page.close();}
 }
 assert.deepEqual(errors,[]);await fs.writeFile(`${out}/results.json`,JSON.stringify({ok:true,results,errors},null,2));console.log('FINITE_DEMAND_PASS');
}finally{await browser.close();}
