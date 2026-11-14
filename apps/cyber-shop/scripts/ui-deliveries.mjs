/** Normal input: agree a request, inspect real stock, source goods, deliver, and let another expire. */
import {chromium} from 'playwright';
import fs from 'node:fs/promises';
import assert from 'node:assert/strict';
const out=process.env.CYBER_EVIDENCE_DIR||'apps/cyber-shop/evidence/living-shop/deliveries-first';await fs.mkdir(out,{recursive:true});
const browser=await chromium.launch({headless:true}),page=await browser.newPage({viewport:{width:1440,height:960},acceptDownloads:true});page.setDefaultTimeout(8000);
const errors=[],missing=[],batteries=[];page.on('pageerror',e=>errors.push(e.message));page.on('console',m=>{if(m.type()==='error')errors.push(m.text());});page.on('response',r=>{if(r.status()>=400)missing.push(r.url());});
const read=async()=>JSON.parse(await page.evaluate(()=>window.render_game_to_text())),game=async()=>(await read()).game;
const click=(name,exact=true)=>page.getByRole('button',{name,exact}).click();
const close=async()=>{const p=(await read()).panel;if(p==='trade')await click('关闭谈判');else if(p)await click('关闭面板');};
const panel=async name=>{await close();await page.locator('.cabinet-menu').getByRole('button',{name,exact:false}).click();};
const board=async()=>{await panel('库存');await click('街坊订货 ↗');};
const select=async(id,status)=>page.locator(`.delivery-index [data-delivery="${id}"]${status?`[data-status="${status}"]`:''}`).first().click();
const finishDay=async()=>{await close();await click('关店 / 日结 →');await click('确认闭店');};
const shot=async name=>{await page.waitForTimeout(150);await page.screenshot({path:`${out}/${name}.png`});};
try{
 await page.goto(process.env.CYBER_URL||'http://127.0.0.1:4176/cyber-shop/');await page.locator('#start-btn').click();await click('跳过引导');await board();
 assert.equal(await page.locator('.delivery-index [data-status="offered"]').count(),3);await click('接下这份订货');
 await select('courier-call');await click('接下这份订货');await select('backup-battery');assert(await page.getByRole('button',{name:'手上已有两份订货',exact:true}).isDisabled());
 await select('doorstep-water');const saved=await game();await page.reload();await click('继续经营 ↗',false);assert.deepEqual(await game(),saved);await board();
 await select('doorstep-water');await click('选入合格货品');assert.equal(await page.locator('.parcel-item input:checked').count(),1);
 const focusable=page.getByRole('dialog').locator('button:not(:disabled),input:not(:disabled),select:not(:disabled),a[href],summary').filter({visible:true});await focusable.first().focus();await page.keyboard.press('Shift+Tab');assert(await focusable.last().evaluate(el=>document.activeElement===el));await page.keyboard.press('Tab');assert(await focusable.first().evaluate(el=>document.activeElement===el));await shot('packed-first-order');
 const before=await game();await click('交货并收款 →');let s=await game();assert.equal(s.cash,before.cash+100);assert.equal(s.hours,before.hours-.5);assert.equal(s.records.deliveries,1);assert.equal(s.items.length,before.items.length-1);await page.locator('.delivery-thanks').waitFor();await shot('first-thanks');
 await select('backup-battery');assert.match(await page.locator('.delivery-tools').innerText(),/未持有/);await click('接下这份订货');await click('查看工具采购 ↗');await page.locator('[data-equipment="scanner"]').getByRole('button').click();assert.equal((await game()).equipment.scanner,1);await close();
 for(let day=1;day<=2;day++){
  for(let n=0;n<7;n++){
   let current=await game();if(!current.visitorArrived||current.visitor.resolved){const call=page.getByRole('button',{name:'绿色叫号按钮',exact:true});if(await call.isDisabled())break;await call.click();}
   current=await game();const v=current.visitor;for(let j=0;j<2;j++)if(((await game()).conversations?.[v.id]??0)<2)await page.keyboard.press('Space');
   if(v.kind==='seller'&&v.category==='energy'){
    await click('把来货放上台 →');
    for(const item of v.goods.filter(i=>i.definitionId==='battery-pack')){
     await click('取消全部选择');await page.getByRole('button',{name:`选择 ${item.id}`,exact:true}).click();await click('基础检查');await click('多谱扫描');
     const inspected=(await game()).visitor.goods.find(i=>i.id===item.id);batteries.push({id:item.id,day,condition:inspected.condition,capacity:inspected.capacity});
     if(inspected.condition>=50&&inspected.capacity>=60&&((await game()).items.filter(i=>i.definitionId==='battery-pack').length<2))await page.locator('.trade-lot').filter({has:page.getByRole('button',{name:`选择 ${item.id}`,exact:true})}).getByRole('button',{name:'只买这件',exact:true}).click();
    }
    if(await page.getByRole('button',{name:'取消全部选择',exact:true}).count())await click('取消全部选择');await close();if((await game()).items.some(i=>i.location==='counter'))await click('全部入库 ↓');
   }
   if(!(await game()).visitor.resolved)await click('结束当前接待');
  }
  if((await game()).items.filter(i=>i.definitionId==='battery-pack').length>=2)break;
  if(day<2){await finishDay();await click('迎接新的一天 →');}
 }
 assert.equal((await game()).items.filter(i=>i.definitionId==='battery-pack').length,2,JSON.stringify(batteries));
 await board();await select('backup-battery','active');await click('选入合格货品');assert.equal(await page.locator('.parcel-item input:checked').count(),2);await shot('battery-parcel');
 const paid=await game();await click('交货并收款 →');assert.equal((await game()).cash,paid.cash+420);assert.equal((await game()).records.deliveries,2);assert.equal((await game()).items.filter(i=>i.definitionId==='battery-pack').length,0);
 await page.setViewportSize({width:844,height:390});await page.locator('.delivery-thanks').scrollIntoViewIfNeeded();await page.waitForFunction(()=>!document.querySelector('.toast'));await shot('delivery-844');assert(await page.locator('.notebook').evaluate(el=>el.scrollWidth<=el.clientWidth+1));await page.setViewportSize({width:1440,height:960});
 while((await game()).day<6){await finishDay();await click('迎接新的一天 →');}
 await board();await select('courier-call','active');await shot('last-day');await finishDay();assert.equal((await game()).deliveries.find(j=>j.id==='delivery-1-courier-call').status,'expired');assert.match(await page.locator('.tomorrow-plan').innerText(),/1 份订货已过交期/);
 await click('迎接新的一天 →');await board();await select('courier-call','expired');await page.locator('.delivery-ended').waitFor();
 const offered=(await game()).deliveries.find(j=>j.status==='offered');await select(offered.templateId,'offered');await click('接下这份订货');await click('取消这份订货');await click('继续备货');assert.equal((await game()).deliveries.find(j=>j.id===offered.id).status,'active');await click('取消这份订货');await click('确认取消');assert.equal((await game()).deliveries.find(j=>j.id===offered.id).status,'cancelled');
 await panel('设置与存档');const [download]=await Promise.all([page.waitForEvent('download'),click('导出当前存档')]);await download.saveAs(`${out}/delivery-save.json`);const final=await game();await page.locator('input[type=file]').setInputFiles(`${out}/delivery-save.json`);await page.waitForFunction(()=>JSON.parse(window.render_game_to_text()).panel==='');assert.deepEqual(await game(),final);await page.reload();await click('继续经营 ↗',false);assert.deepEqual(await game(),final);
 const touch=await browser.newPage({viewport:{width:844,height:390},hasTouch:true,isMobile:true});touch.on('pageerror',e=>errors.push(e.message));touch.on('response',r=>{if(r.status()>=400)missing.push(r.url());});
 await touch.goto(process.env.CYBER_URL||'http://127.0.0.1:4176/cyber-shop/');await touch.locator('#start-btn').tap();await touch.getByRole('button',{name:'跳过引导',exact:true}).tap();await touch.locator('.cabinet-menu').getByRole('button',{name:'库存',exact:false}).tap();await touch.getByRole('button',{name:'街坊订货 ↗',exact:true}).tap();await touch.getByRole('button',{name:'接下这份订货',exact:true}).tap();await touch.getByLabel('装箱 净化饮水',{exact:true}).tap();await touch.getByRole('button',{name:'交货并收款 →',exact:true}).tap();assert.equal(JSON.parse(await touch.evaluate(()=>window.render_game_to_text())).game.records.deliveries,1);await touch.waitForFunction(()=>!document.querySelector('.toast'));await touch.locator('.delivery-thanks').scrollIntoViewIfNeeded();await touch.screenshot({path:`${out}/touch-delivery.png`});await touch.close();
 assert.deepEqual(errors,[]);assert.deepEqual(missing,[]);await fs.writeFile(`${out}/results.json`,JSON.stringify({ok:true,firstReward:100,batteryReward:420,batteries,delivered:2,expired:1,cancelled:1,limit:2,restored:true,keyboardFocusLoop:true,touchDelivery:true,errors,missing},null,2));console.log('DELIVERIES_PASS');
}catch(e){await shot('failure').catch(()=>{});await fs.writeFile(`${out}/failure.json`,JSON.stringify({error:String(e),state:await read().catch(()=>null),batteries,errors,missing},null,2));throw e;}finally{await browser.close();}
