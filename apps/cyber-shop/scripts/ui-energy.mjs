import {chromium} from 'playwright';
import fs from 'node:fs/promises';
import assert from 'node:assert/strict';
import {completeIntro} from './ui-onboarding.mjs';
const out=process.env.CYBER_EVIDENCE_DIR||'apps/cyber-shop/evidence/living-shop/energy';await fs.mkdir(out,{recursive:true});
const browser=await chromium.launch({headless:true}),results=[],errors=[];
try{for(const touch of [false,true]){
 const page=await browser.newPage({viewport:touch?{width:844,height:390}:{width:1440,height:960},hasTouch:touch,isMobile:touch});page.setDefaultTimeout(8000);page.on('pageerror',e=>errors.push(e.message));page.on('response',r=>{if(r.status()>=400)errors.push(`${r.status()} ${r.url()}`);});
 const use=touch?'tap':'click',click=name=>page.getByRole('button',{name,exact:true})[use](),panel=name=>page.locator('.cabinet-menu').getByRole('button',{name,exact:true})[use]();
 const read=async()=>JSON.parse(await page.evaluate(()=>window.render_game_to_text())),game=async()=>(await read()).game;
 const shot=async name=>{await page.locator('.toast').waitFor({state:'hidden'});await page.waitForFunction(()=>[...document.querySelectorAll('.notebook')].every(e=>getComputedStyle(e).opacity==='1'));await page.screenshot({path:`${out}/${touch?'touch':'desktop'}-${name}.png`});};
 async function talk(){const id=(await game()).visitor.id;while(((await game()).conversations?.[id]??0)<2)await page.locator('.speech-bubble button').filter({hasText:/继续交谈|看看/}).first()[use]();}
 try{
  await page.goto(process.env.CYBER_URL||'http://127.0.0.1:4176/cyber-shop/');await page.locator('#start-btn')[use]();await completeIntro(page,touch);
  await panel('库存');await click('街坊订货 ↗');await page.locator('[data-delivery="backup-battery"]').first()[use]();await click('接下这份订货');await click('查看工具采购 ↗');await page.locator('[data-equipment="scanner"]').getByRole('button')[use]();await click('六类耗材');await page.locator('[data-equipment="insulation"]').getByRole('button')[use]();await click('关闭面板');
  let batteries=[];
  for(let n=0;n<7;n++){
   await click('绿色叫号按钮');const s=await game();if(s.visitor.kind==='seller'&&s.visitor.category==='energy'){
    await talk();await click('把来货放上台 →');batteries=s.visitor.goods.filter(i=>i.definitionId==='battery-pack').map(i=>i.id);assert(batteries.length>=2);
    for(const id of batteries)await page.locator(`[data-trade-item="${id}"]`).getByRole('button',{name:'只买这件',exact:true})[use]();await click('关闭谈判');await click('全部入库 ↓');break;
   }await click('结束当前接待');
  }
  assert(batteries.length>=2);await panel('库存');await page.locator(`.item-tile[data-item="${batteries[0]}"]`)[use]();await click('能源整备 ↗');assert.equal(await page.locator('.energy-gauge>strong').innerText(),'—');assert((await page.locator('.energy-blocked').innerText()).includes('检查品相'));assert(await page.getByRole('button',{name:'先核对货品',exact:true}).isDisabled());
  for(const id of batteries){await page.locator(`[data-energy-item="${id}"]`)[use]();await click('检查品相与功能');await click('扫描有效容量');}
  const scanned=(await game()).items.filter(i=>batteries.includes(i.id));const selected=scanned.filter(i=>i.condition>=50).sort((a,b)=>a.capacity-b.capacity)[0]??scanned.slice().sort((a,b)=>a.capacity-b.capacity)[0];await page.locator(`[data-energy-item="${selected.id}"]`)[use]();await page.locator('[data-energy-profile="balanced"]')[use]();
  assert((await page.locator('.energy-target').innerText()).includes(String(selected.capacity)));assert((await page.locator('.energy-controls').innerText()).includes('已购成本 ₡5'));await page.locator('.energy-profiles').scrollIntoViewIfNeeded();await shot('plan');
  const beforeGuide=await game();await click('工位手册 ?');const note=page.locator('.book-step p').filter({hasText:'储能整备'});assert.equal(await page.locator('.book-reader').getAttribute('data-spread'),'3');await page.locator('.book-step').filter({hasText:'每件只能整备一次'}).scrollIntoViewIfNeeded();await shot('handbook');await click('返回操作 ↗');assert.deepEqual(await game(),beforeGuide);
  // Choose the profile again after returning from the book; no economic state is stored in UI selections.
  await page.locator('[data-energy-item="'+selected.id+'"]')[use]();await page.locator('[data-energy-profile="balanced"]')[use]();const before=await game();await page.locator('.energy-run.primary')[use]();let work=(await game()).energyWork;assert.equal(work.itemId,selected.id);assert.equal(work.target,Math.min(90,selected.capacity+35));assert.equal(work.materialCost,5);assert.equal((await game()).cash,before.cash-work.electricity);assert.equal((await game()).items.find(i=>i.id===selected.id).cost,selected.cost+work.electricity+5);assert.equal((await game()).equipment.insulation,4);
  const began=await game();await click('脉冲负载');await page.getByLabel('设置参考读数',{exact:true}).fill('40');await click('接入负载并复核');assert.equal((await game()).energyWork.attempts,1);assert.equal((await game()).energyWork.verified,false);assert.equal((await game()).hours,began.hours-.5);assert.equal((await game()).cash,began.cash);await page.locator('.energy-controls').scrollIntoViewIfNeeded();await shot('wrong-load');
  await page.reload();await click('继续经营 ↗');assert.equal((await game()).energyWork.attempts,1);await click('关店 / 日结 →');assert((await page.getByRole('dialog').innerText()).includes('能源工位有一件货物待复核'));await click('确认闭店');await click('迎接新的一天 →');await page.locator('.room-order').filter({hasText:'能源整备'}).first()[use]();await click('稳态放电');await page.getByLabel('设置参考读数',{exact:true}).fill('40');await click('接入负载并复核');assert.equal((await game()).energyWork.verified,true);await shot('verified');await click('收回货架 →');
  const completed=await game(),prepared=completed.items.find(i=>i.id===selected.id);assert.equal(completed.energyWork,undefined);assert.equal(completed.energyPrepared,1);assert.equal(prepared.capacity,work.target);assert.equal(prepared.energyPreparation.hours,3);assert.equal(prepared.location,'stock');assert.equal(completed.records.repairs,0);assert((await page.locator('.energy-controls').innerText()).includes('已经准备好了'));await shot('completed');
  await click('回库存安排去向 ↗');await click('查看能源整备记录');assert.equal(await page.locator('.energy-profiles').count(),0);await click('返回库存 ↗');await click('街坊订货 ↗');await page.locator('[data-delivery="backup-battery"]').first()[use]();
  const deliveryIds=batteries.filter(id=>{const i=completed.items.find(v=>v.id===id);return i.capacity>=60&&i.condition>=50;});const delivered=deliveryIds.length>=2;
  if(delivered){await click('选入合格货品');const cash=(await game()).cash;await click('交货并收款 →');assert.equal((await game()).cash,cash+420);assert(!(await game()).items.some(i=>deliveryIds.slice(0,2).includes(i.id)));await shot('delivered');}
  else{assert((await page.locator(`[data-good="${selected.id}"]`).innerText()).includes('品相'));}
  await click('关闭面板');await panel('设置与存档');const [download]=await Promise.all([page.waitForEvent('download'),click('导出当前存档')]);const save=`${out}/${touch?'touch':'desktop'}-save.json`;await download.saveAs(save);const exported=await game();await page.locator('input[type=file]').setInputFiles(save);assert.deepEqual(await game(),exported);
  results.push({touch,oldCapacity:selected.capacity,newCapacity:work.target,materialCost:5,electricity:work.electricity,totalHours:3,wrongLoad:true,crossDay:true,reload:true,oldRepairsUnchanged:true,deliveryReward:delivered?420:0,exportImport:true});
 }catch(e){await page.screenshot({path:`${out}/${touch?'touch':'desktop'}-failure.png`}).catch(()=>{});await fs.writeFile(`${out}/failure.json`,JSON.stringify({error:String(e),state:await read().catch(()=>null),errors},null,2));throw e;}finally{await page.close();}
}assert.deepEqual(errors,[]);await fs.writeFile(`${out}/results.json`,JSON.stringify({ok:true,results,errors},null,2));console.log('ENERGY_UI_PASS');}finally{await browser.close();}
