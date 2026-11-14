import {chromium} from 'playwright';
import fs from 'node:fs/promises';
import assert from 'node:assert/strict';
import {completeIntro} from './ui-onboarding.mjs';
const out=process.env.CYBER_EVIDENCE_DIR||'apps/cyber-shop/evidence/living-shop/delivery-hints';await fs.mkdir(out,{recursive:true});
const browser=await chromium.launch({headless:true}),results=[],errors=[];
try{for(const touch of [false,true]){
 const page=await browser.newPage({viewport:touch?{width:844,height:390}:{width:1440,height:960},hasTouch:touch,isMobile:touch});page.setDefaultTimeout(8000);page.on('pageerror',e=>errors.push(e.message));page.on('response',r=>{if(r.status()>=400)errors.push(`${r.status()} ${r.url()}`);});
 const use=touch?'tap':'click',click=n=>page.getByRole('button',{name:n,exact:true})[use](),panel=n=>page.locator('.cabinet-menu').getByRole('button',{name:n,exact:true})[use]();
 const read=async()=>JSON.parse(await page.evaluate(()=>window.render_game_to_text())),game=async()=>(await read()).game;
 const shot=async n=>{await page.locator('.toast').waitFor({state:'hidden'});await page.waitForFunction(()=>[...document.querySelectorAll('.notebook')].every(e=>getComputedStyle(e).opacity==='1'));await page.screenshot({path:`${out}/${touch?'touch':'desktop'}-${n}.png`});};
 async function talk(){const id=(await game()).visitor.id;while(((await game()).conversations?.[id]??0)<2)await page.locator('.speech-bubble button').filter({hasText:/继续交谈|看看/}).first()[use]();}
 async function close(){const p=(await read()).panel;if(p)await click(p==='trade'?'关闭谈判':'关闭面板');}
 const hint=()=>page.locator('.trade-inspection [data-item-delivery="backup-battery"]');
 try{
  await page.goto(process.env.CYBER_URL||'http://127.0.0.1:4176/cyber-shop/');await page.locator('#start-btn')[use]();await completeIntro(page,touch);const water=(await game()).items.find(i=>i.definitionId==='purified-water').id;
  await panel('库存');assert.equal(await page.locator('.delivery-hints').count(),0);await click('街坊订货 ↗');await page.locator('[data-delivery="doorstep-water"]').first()[use]();await click('接下这份订货');await page.locator('[data-delivery="backup-battery"]').first()[use]();await click('接下这份订货');await click('查看工具采购 ↗');await page.locator('[data-equipment="scanner"]').getByRole('button')[use]();await close();
  let navigated=false,inspected=0,deadlineChecked=false,sourced=false;const acquired=[];
  async function closeAndOpen(){
   if((await game()).day===3){await page.reload();await click('继续经营 ↗');await click('关店 / 日结 →');const due=page.getByLabel('今晚截止的订货',{exact:true});assert((await due.innerText()).includes('值守台上的一瓶水'));assert((await due.innerText()).includes('货架可交 1 / 1'));await due.scrollIntoViewIfNeeded();await shot('last-day-before-close');const before=await game();await click('查看订货 值守台上的一瓶水');assert.equal(await page.locator('.delivery-letter').getAttribute('data-request'),'doorstep-water');await click('← 返回闭店确认');assert.deepEqual(await game(),before);await click('确认闭店');const ended=await game();assert.equal(ended.deliveries.find(j=>j.templateId==='doorstep-water').status,'expired');assert(ended.items.some(i=>i.id===water));deadlineChecked=true;}
   else{await click('关店 / 日结 →');await click('确认闭店');}
   await click('迎接新的一天 →');
  }
  for(let day=1;day<=6;day++){
   for(let n=0;n<7;n++){
    let s=await game();if(!s.visitorArrived||s.visitor.resolved){const call=page.getByRole('button',{name:'绿色叫号按钮',exact:true});if(await call.isDisabled())break;await call[use]();}s=await game();await talk();
    if(s.visitor.kind==='seller'&&s.visitor.category==='energy'){
     await click('把来货放上台 →');
     for(const item of s.visitor.goods.filter(i=>i.definitionId==='battery-pack')){
      await click('取消全部选择');await page.getByRole('button',{name:`选择 ${item.id}`,exact:true})[use]();assert((await page.locator(`[data-trade-item="${item.id}"]`).innerText()).includes('有订货需求'));if(!item.known.includes('basic'))assert((await hint().innerText()).includes('先检查品相与基础功能'));
      if(!navigated){await hint().scrollIntoViewIfNeeded();await shot('unknown-supplier');const before=await game(),chosen=await page.locator('.trade-lot.chosen').evaluateAll(es=>es.map(e=>e.dataset.tradeItem));await click('查看订货 小灯的备用电源');assert.equal(await page.locator('.delivery-letter').getAttribute('data-request'),'backup-battery');assert.deepEqual(await game(),before);await click('← 返回交易');assert.deepEqual(await game(),before);assert.deepEqual(await page.locator('.trade-lot.chosen').evaluateAll(es=>es.map(e=>e.dataset.tradeItem)),chosen);navigated=true;}
      if(!item.known.includes('basic'))await click('基础检查');let seen=(await game()).visitor.goods.find(i=>i.id===item.id);if(!seen.known.includes('scan')){if(seen.condition>=50)assert((await hint().innerText()).includes('先扫描所需读数'));await click('多谱扫描');}else{assert(s.visitor.request.includes('25%'));assert.equal(s.deliverySource,undefined);sourced=true;}seen=(await game()).visitor.goods.find(i=>i.id===item.id);inspected++;
      if(seen.condition>=50&&seen.capacity>=60&&acquired.length<2){assert((await hint().innerText()).includes('按当前检查符合要求'));await hint().scrollIntoViewIfNeeded();await shot(`qualified-${acquired.length+1}`);await page.locator(`[data-trade-item="${item.id}"]`).getByRole('button',{name:'只买这件',exact:true})[use]();acquired.push(item.id);}else assert(!(await hint().innerText()).includes('按当前检查符合要求')||acquired.length===2);
     }
     await close();if((await game()).items.some(i=>i.location==='counter'))await click('全部入库 ↓');
    }
    if(!(await game()).visitor.resolved)await click('结束当前接待');
   }
   if(acquired.length===2)break;
   if(day===1){await panel('库存');await click('街坊订货 ↗');await page.locator('[data-delivery="backup-battery"]').first()[use]();const before=await game();await click('请商人按单找货');const planned=await game();assert.deepEqual([planned.cash,planned.hours],[before.cash,before.hours]);assert.equal(planned.deliverySource.count,2-acquired.length);await page.getByLabel('订货询货',{exact:true}).scrollIntoViewIfNeeded();await shot('sourcing-booked');await page.reload();await click('继续经营 ↗');assert.deepEqual((await game()).deliverySource,planned.deliverySource);}
   if(day<6)await closeAndOpen();
  }
  assert.equal(acquired.length,2);assert(sourced);assert.equal((await game()).day,2);await panel('库存');await page.locator(`.item-tile[data-item="${acquired[0]}"]`)[use]();let ownedHint=page.locator('.item-inspector [data-item-delivery="backup-battery"]');assert((await ownedHint.innerText()).includes('货架可交 2 / 2'));await click('标记留货');assert((await ownedHint.innerText()).includes('已留货'));assert((await ownedHint.innerText()).includes('货架可交 1 / 2'));await ownedHint.scrollIntoViewIfNeeded();await shot('reserved-progress');
  await click('查看订货 小灯的备用电源');assert.equal(await page.locator('.delivery-letter').getAttribute('data-request'),'backup-battery');await click('解除留货');await click('选入合格货品');const beforeDelivery=await game();await click('交货并收款 →');assert.equal((await game()).cash,beforeDelivery.cash+420);await click('← 返回库存');assert.equal(await page.locator('[data-item-delivery="backup-battery"]').count(),0);await close();
  while(!deadlineChecked)await closeAndOpen();await click('关店 / 日结 →');assert.equal(await page.locator('.delivery-closing').count(),0);
  results.push({touch,day:(await game()).day,inspected,acquired,navigationPreservedBasket:true,unknownToChecked:true,reservationProgress:true,actualDeliveryReward:420,paidSourcingNextDay:true,freeBookingReload:true,lastDayReminder:true,reload:true,deliberateExpiryKeepsStock:true});
 }catch(e){await page.screenshot({path:`${out}/${touch?'touch':'desktop'}-failure.png`}).catch(()=>{});await fs.writeFile(`${out}/failure.json`,JSON.stringify({error:String(e),state:await read().catch(()=>null),errors},null,2));throw e;}finally{await page.close();}
}assert.deepEqual(errors,[]);await fs.writeFile(`${out}/results.json`,JSON.stringify({ok:true,results,errors},null,2));console.log('DELIVERY_HINTS_UI_PASS');}finally{await browser.close();}
