import { chromium } from 'playwright';
import fs from 'node:fs/promises';
import assert from 'node:assert/strict';
const out=process.env.CYBER_EVIDENCE_DIR||'apps/cyber-shop/evidence/living-shop/gameplay-polish';await fs.mkdir(out,{recursive:true});
const browser=await chromium.launch({headless:true});const page=await browser.newPage({viewport:{width:1440,height:960}});page.setDefaultTimeout(8000);
const errors=[];page.on('pageerror',e=>errors.push(e.message));
const read=async()=>JSON.parse(await page.evaluate(()=>window.render_game_to_text()));const g=async()=>(await read()).game;
const click=name=>page.getByRole('button',{name,exact:true}).click();
async function focusLoop(){
 const dialog=page.getByRole('dialog',{includeHidden:false});
 assert(await dialog.evaluate(el=>el.contains(document.activeElement)));
 const focusable=dialog.locator('button:not(:disabled),input:not(:disabled),select:not(:disabled),a[href],summary').filter({visible:true});
 await focusable.first().focus();await page.keyboard.press('Shift+Tab');assert(await focusable.last().evaluate(el=>document.activeElement===el));
 await page.keyboard.press('Tab');assert(await focusable.first().evaluate(el=>document.activeElement===el));
}
try{
 await page.goto(process.env.CYBER_URL||'http://127.0.0.1:4175/cyber-shop/');await page.locator('#start-btn').click();await click('跳过引导');
 await click('查看今日街区行情');await focusLoop();const chosenLabel=await page.locator('.event-story .vertical-actions button').last().locator('strong').innerText();await page.locator('.event-story .vertical-actions button').last().click();assert((await g()).eventResolved);
 await page.keyboard.press('Escape');assert(await page.getByRole('button',{name:'查看今日街区行情',exact:true}).evaluate(el=>el===document.activeElement));
 assert((await page.locator('.market-action').innerText()).includes(chosenLabel));
 await click('箱包 / 扩容');await focusLoop();await page.keyboard.press('Escape');assert.equal(await page.getByRole('dialog').count(),0);
 await click('绿色叫号按钮');await click('结束当前接待');await click('绿色叫号按钮');await page.keyboard.press('Space');await page.keyboard.press('Space');
 await click('把来货放上台 →');await focusLoop();const before=await g();assert.equal(before.visitor.goods.length,4);
 assert(new Set(before.visitor.goods.map(i=>i.quote)).size>1);assert(before.visitor.goods.every(i=>i.condition===undefined));
 await page.locator('.lot-select').nth(1).click();await click('基础检查');let after=await g();
 assert.equal(after.hours,before.hours-.5);assert.equal(after.visitor.goods[0].condition,undefined);assert.notEqual(after.visitor.goods[1].condition,undefined);
 assert.deepEqual(after.visitor.goods.map(i=>i.quote),before.visitor.goods.map(i=>i.quote));
 await page.screenshot({path:`${out}/individual-inspection.png`});await page.keyboard.press('Escape');await page.reload();await page.getByRole('button',{name:/继续经营/}).click();
 after=await g();assert.notEqual(after.visitor.goods[1].condition,undefined);assert.deepEqual(after.visitor.goods.map(i=>i.quote),before.visitor.goods.map(i=>i.quote));
 const contrast=await page.locator('.speech-bubble').evaluate(el=>{
  const rgb=s=>(s.match(/[\d.]+/g)||[]).map(Number),lum=rgb=>rgb.slice(0,3).map(n=>n/255).map(n=>n<=.04045?n/12.92:((n+.055)/1.055)**2.4).reduce((s,n,i)=>s+n*[.2126,.7152,.0722][i],0);
  const background=rgb(getComputedStyle(el).backgroundColor),alpha=background[3]??1;
  const lightest=background.slice(0,3).map(n=>n*alpha+255*(1-alpha));
  return [...el.querySelectorAll('h2,p,small')].map(n=>({text:n.textContent,ratio:(lum(rgb(getComputedStyle(n).color))+.05)/(lum(lightest)+.05)}));
 });assert(contrast.every(c=>c.ratio>=4.5),JSON.stringify(contrast));
 await page.screenshot({path:`${out}/street-market.png`});assert.deepEqual(errors,[]);
 await fs.writeFile(`${out}/results.json`,JSON.stringify({ok:true,marketChoice:true,keyboardFocusLoop:true,escapeAndFocusRestore:true,distinctPrices:true,perItemInspection:true,quotesPersist:true,dialogueContrast:contrast,errors},null,2));console.log('GAMEPLAY_POLISH_PASS');
}catch(e){await page.screenshot({path:`${out}/failure.png`});throw e;}finally{await browser.close();}
