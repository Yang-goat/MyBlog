/** Continue an earned career using only normal UI; compare estimates with actual resources. */
import { chromium } from 'playwright';
import fs from 'node:fs/promises';
import assert from 'node:assert/strict';
const out=process.env.CYBER_EVIDENCE_DIR||'apps/cyber-shop/evidence/living-shop/repair-decisions';await fs.mkdir(out,{recursive:true});
const browser=await chromium.launch({headless:true}),page=await browser.newPage({viewport:{width:1440,height:1000}});page.setDefaultTimeout(8000);
const errors=[],missing=[],checks={physicalMaterial:false,escrow:false,skilledCalibration:false,selectedQuick:false,preservedAntique:false};
page.on('pageerror',e=>errors.push(e.message));page.on('console',m=>{if(m.type()==='error')errors.push(m.text());});page.on('response',r=>{if(r.status()>=400)missing.push(r.url());});
const read=async()=>JSON.parse(await page.evaluate(()=>window.render_game_to_text())),game=async()=>(await read()).game;
const click=(name,exact=true)=>page.getByRole('button',{name,exact}).click();
const close=async()=>{const p=(await read()).panel;if(p==='trade')await click('关闭谈判');else if(p)await click('关闭面板');};
const panel=async name=>{await close();await page.locator('.cabinet-menu').getByRole('button',{name,exact:false}).click();};
const shot=async name=>{await page.getByLabel('工序结算预览').scrollIntoViewIfNeeded();await page.waitForTimeout(160);await page.screenshot({path:`${out}/${name}.png`});};
async function openOrder(id){await close();await page.locator('.workshop-hotspot').click();await page.locator(`[data-order="${id}"]`).click();if(!(await game()).orders.find(o=>o.id===id).diagnosed)await click('连接检测仪 →');}
async function prepare(fault,preserve=false){
 if(await page.getByRole('button',{name:'动手维修',exact:true}).count())await click('动手维修');
 if(await page.locator('.fault-tabs button').count())await page.locator('.fault-tabs').getByRole('button',{name:fault.name,exact:true}).click();
 if(fault.operation==='clean')for(let n=1;n<=6;n++)await click(`清洁接点 ${n}`);
 else if(fault.operation==='replace'){
  if(preserve)await page.getByLabel('修整原件',{exact:false}).check();
  for(let n=1;n<=4;n++)await click(`松开螺丝 ${n}`);
  await click('取出故障模块');await click(preserve?'修整并装回原件':'装入替换模块');
 }else await page.getByLabel('手动精确校准',{exact:true}).fill(String(fault.target));
}
async function resolveOrder(id){
 await openOrder(id);
 for(let n=0;n<8;n++){
  let s=await game(),order=s.orders.find(o=>o.id===id);if(!order)return;
  const item=s.items.find(i=>i.id===order.itemId),faults=item.faults??[];
  if(!faults.length){if(!order.completedOps)await click('清洁表面并恢复品相');else if(!order.verified)await click('通电复检');else{await click(/交付并结算|完成翻新并入库/,false);return;}continue;}
  if(s.hours<3){await close();return;}
  const preserved=!checks.preservedAntique&&faults.find(f=>f.id==='worn-gear');
  const calibration=!checks.skilledCalibration&&faults.find(f=>f.operation==='calibrate');
  const quick=!checks.selectedQuick&&faults.length>1&&faults.slice(1).find(f=>(s.records.faults[f.id]??0)>=1);
  const fault=preserved||calibration||quick||faults[0];
  if(quick===fault){
   await click('动手维修');await page.locator('.fault-tabs').getByRole('button',{name:fault.name,exact:true}).click();
   await shot('selected-quick-preview');await click('熟练快捷工序');const after=await game();
   const remaining=after.items.find(i=>i.id===item.id).faults.map(f=>f.id);assert(!remaining.includes(fault.id));assert(remaining.includes(faults[0].id));checks.selectedQuick=true;continue;
  }
  await prepare(fault);
  if(preserved===fault){
   assert.match(await page.getByLabel('工序结算预览').innerText(),/原貌下降 18 点/);
   const originalQuote=await page.getByLabel('工序结算预览').innerText();const before=await game();
   await page.getByLabel('修整原件',{exact:false}).check();assert(!/原貌下降/.test(await page.getByLabel('工序结算预览').innerText()));
   assert.match(await page.getByLabel('工序结算预览').innerText(),/电子备件/);assert.match(await page.locator('.repair-rig > header').innerText(),/原件已装回/);
   const preservedQuote=await page.getByLabel('工序结算预览').innerText();assert.deepEqual(await game(),before,'Comparing repair choices must not spend resources');
   await shot('preserve-original-parts');await click('执行工序 →');const after=await game();
   const step=after.orders.find(o=>o.id===id).steps.at(-1);assert.equal(step.preserve,true);assert.equal(step.faultId,'worn-gear');
   await fs.writeFile(`${out}/preservation-quotes.json`,JSON.stringify({originalQuote,preservedQuote,actualStep:step},null,2));checks.preservedAntique=true;continue;
  }
  if(calibration===fault){
   const before=await game();assert.match(await page.locator('.repair-rig').innerText(),/允许误差 ±9/);
   await page.getByLabel('手动精确校准',{exact:true}).fill(String(fault.target+10));assert(await page.getByRole('button',{name:'完成操作后执行 →',exact:true}).isDisabled());
   await page.getByLabel('手动精确校准',{exact:true}).fill(String(fault.target+8));assert(await page.getByRole('button',{name:'执行工序 →',exact:true}).isEnabled());assert.deepEqual(await game(),before);
   await shot('skilled-tolerance');await click('执行工序 →');assert(!(await game()).items.find(i=>i.id===item.id).faults.some(f=>f.id===fault.id));checks.skilledCalibration=true;continue;
  }
  const before=await game(),preview=await page.getByLabel('工序结算预览').innerText();
  await shot(order.kind==='own'?'owned-material-preview':'customer-escrow-preview');await click('执行工序 →');const after=await game();
  if(order.kind==='own'&&preview.includes('取用库存')){assert.equal(after.cash,before.cash);assert(Object.keys(before.equipment).some(k=>after.equipment[k]===before.equipment[k]-1));checks.physicalMaterial=true;}
  else if(order.kind==='client'){assert.match(preview,/材料专款/);assert.equal(after.cash,before.cash);assert(after.orders.find(o=>o.id===id).escrow<order.escrow);checks.escrow=true;}
 }
 await close();
}
try{
 await page.goto(process.env.CYBER_URL||'http://127.0.0.1:4176/cyber-shop/');await page.locator('input[type=file]').setInputFiles('apps/cyber-shop/evidence/living-shop/archive-career/career-save.json');await page.locator('.journey-open').waitFor();
 // A fourth-operation material saving would mask stock use; perform a real aid repair first if needed.
 if(Object.values((await game()).records.faults).reduce((n,v)=>n+v,0)%4===3){await page.locator('.workshop-hotspot').click();await click('接基础援助维修');await resolveOrder((await game()).orders.at(-1).id);}
 await panel('库存');await page.locator('.item-tile').first().click();await click('撤展并返回货架');await click('送到工作台翻新');await resolveOrder((await game()).orders.find(o=>o.kind==='own').id);
 for(let day=0;day<8&&!Object.values(checks).every(Boolean);day++){
  await close();for(const order of (await game()).orders)await resolveOrder(order.id);await close();
  for(let n=0;n<8;n++){
   const s=await game(),call=page.getByRole('button',{name:'绿色叫号按钮',exact:true});
   if(!s.visitorArrived||s.visitor?.resolved){if(await call.isDisabled())break;await call.click();}
   const current=await game();if(current.visitor.kind==='repair'&&current.hours>=3){await page.keyboard.press('Space');await page.keyboard.press('Space');await click('查看维修委托 →');await click('接下维修 →');await resolveOrder((await game()).orders.at(-1).id);await close();}
   if(!(await game()).visitor.resolved)await click('结束当前接待');
  }
  if(!Object.values(checks).every(Boolean)){await click('关店 / 日结 →');await click('确认闭店');await click('迎接新的一天 →');}
 }
 assert(Object.values(checks).every(Boolean),JSON.stringify(checks));
 await close();await page.locator('.workshop-hotspot').click();await click('接基础援助维修');const id=(await game()).orders.at(-1).id;await openOrder(id);const touchState=await game();await prepare(touchState.items.find(i=>i.id===touchState.orders.find(o=>o.id===id).itemId).faults[0]);
 await page.setViewportSize({width:844,height:390});await shot('cost-preview-844');assert(await page.locator('.notebook').evaluate(el=>el.scrollWidth<=el.clientWidth+1));
 assert.deepEqual(errors,[]);assert.deepEqual(missing,[]);await fs.writeFile(`${out}/results.json`,JSON.stringify({ok:true,checks,day:(await game()).day,errors,missing},null,2));console.log('REPAIR_DECISIONS_PASS');
}catch(e){await page.screenshot({path:`${out}/failure.png`}).catch(()=>{});await fs.writeFile(`${out}/failure.json`,JSON.stringify({error:String(e),checks,state:await read().catch(()=>null),errors,missing},null,2));throw e;}finally{await browser.close();}
