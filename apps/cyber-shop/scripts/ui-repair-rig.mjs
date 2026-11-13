import { chromium } from 'playwright';
import fs from 'node:fs/promises';
import assert from 'node:assert/strict';
const out=process.env.CYBER_EVIDENCE_DIR||'apps/cyber-shop/evidence/living-shop/repair-rig';await fs.mkdir(out,{recursive:true});
const browser=await chromium.launch({headless:true});const page=await browser.newPage({viewport:{width:1440,height:1000}});page.setDefaultTimeout(8000);
const errors=[],missing=[],covered=new Set(),diagnostics=new Set();page.on('pageerror',e=>errors.push(e.message));page.on('response',r=>{if(r.status()>=400)missing.push(r.url());});
const state=async()=>JSON.parse(await page.evaluate(()=>window.render_game_to_text()));const g=async()=>(await state()).game;
const click=(name)=>page.getByRole('button',{name,exact:true}).click();
const close=async()=>{const panel=(await state()).panel;if(panel==='trade')await click('关闭谈判');else if(panel)await click('关闭面板');};
const shot=async(name)=>page.screenshot({path:`${out}/${name}.png`});
async function work(){
 const s=await g();if(!s.orders.length)return;
 await page.locator('.workshop-hotspot').click();await page.locator('.list-row').first().click();
 const id=(await state()).selectedOrder;
 for(let i=0;i<10;i++){
  let s=await g(),o=s.orders.find(o=>o.id===id);if(!o)break;const item=s.items.find(i=>i.id===o.itemId);
  if(s.hours<2){await close();return;}
  const diagnostic=await page.locator('.bench-scene').getAttribute('data-diagnostic');diagnostics.add(diagnostic);
  assert.equal(diagnostic,!o.diagnosed?'standby':o.verified?'passed':item.faults?.length?'fault':'ready');
  if(!o.diagnosed){await click('连接检测仪 →');continue;}
  if(!item.faults?.length){if(!o.completedOps)await click('清洁表面并恢复品相');else if(!o.verified)await click('通电复检');else{await shot('verified');await click('交付并结算 →');break;}continue;}
  const fault=item.faults[0];const before={cash:s.cash,hours:s.hours,escrow:o.escrow};
  if(fault.operation==='clean'){
   const first=await page.getByRole('button',{name:'清洁接点 1',exact:true}).boundingBox();await page.mouse.move(first.x+first.width/2,first.y+first.height/2);await page.mouse.down();
   for(let n=2;n<=6;n++){const b=await page.getByRole('button',{name:`清洁接点 ${n}`,exact:true}).boundingBox();await page.mouse.move(b.x+b.width/2,b.y+b.height/2,{steps:4});}await page.mouse.up();
  }else if(fault.operation==='replace'){
   assert(await page.getByRole('button',{name:'取出故障模块',exact:true}).isDisabled());
   for(let n=1;n<=4;n++)await click(`松开螺丝 ${n}`);await click('取出故障模块');await click('装入替换模块');
  }else{
   await page.getByLabel('手动精确校准',{exact:true}).fill(String(fault.target+10));assert(await page.getByRole('button',{name:'完成操作后执行 →',exact:true}).isDisabled());
   await page.getByLabel('手动精确校准',{exact:true}).fill(String(fault.target));
  }
  s=await g();o=s.orders.find(o=>o.id===id);assert.deepEqual({cash:s.cash,hours:s.hours,escrow:o.escrow},before,'Preparation cannot spend resources');
  await shot(`${fault.operation}-ready`);await click('执行工序 →');
  const after=await g();assert(!after.items.find(i=>i.id===o.itemId).faults.some(f=>f.id===fault.id));assert(after.hours<before.hours);covered.add(fault.operation);
 }
 await close();
}
try{
 await page.goto(process.env.CYBER_URL||'http://127.0.0.1:4175/cyber-shop/');await page.locator('#start-btn').click();await click('跳过引导');
 for(let day=0;day<12&&covered.size<3;day++){
  await work();
  for(let n=0;n<7;n++){
   const call=page.getByRole('button',{name:'绿色叫号按钮',exact:true});if(!await call.isEnabled())break;await call.click();const s=await g();
   if(s.visitor.kind==='repair'&&s.hours>=3){await page.keyboard.press('Space');await page.keyboard.press('Space');await click('查看维修委托 →');await click('接下维修 →');await close();await work();}
   else await click('结束当前接待');
  }
  if(covered.size<3){await click('关店 / 日结 →');await click('确认闭店');await click('迎接新的一天 →');}
 }
 assert.equal(covered.size,3);assert.equal(diagnostics.size,4);assert.deepEqual(errors,[]);assert.deepEqual(missing,[]);
 const touch=await browser.newContext({viewport:{width:844,height:390},hasTouch:true,isMobile:true});const tp=await touch.newPage();
 await tp.goto(process.env.CYBER_URL||'http://127.0.0.1:4175/cyber-shop/');await tp.locator('#start-btn').tap();await tp.getByRole('button',{name:'跳过引导',exact:true}).tap();
 await tp.locator('.workshop-hotspot').tap();await tp.getByRole('button',{name:'接基础援助维修',exact:true}).tap();await tp.locator('.list-row').last().tap();await tp.getByRole('button',{name:'连接检测仪 →',exact:true}).tap();
 for(let n=1;n<=6;n++)await tp.getByRole('button',{name:`清洁接点 ${n}`,exact:true}).tap();
 await tp.getByRole('button',{name:'执行工序 →',exact:true}).scrollIntoViewIfNeeded();await tp.waitForTimeout(700);await tp.screenshot({path:`${out}/landscape-rig.png`});
 await tp.getByRole('button',{name:'执行工序 →',exact:true}).tap();
 assert.equal((JSON.parse(await tp.evaluate(()=>window.render_game_to_text()))).game.orders[0].completedOps,1);await touch.close();
 await fs.writeFile(`${out}/results.json`,JSON.stringify({ok:true,operations:[...covered],diagnostics:[...diagnostics],noPreparationCost:true,touchClean:true,errors,missing},null,2));console.log('REPAIR_RIG_PASS');
}catch(e){await shot('failure').catch(()=>{});await fs.writeFile(`${out}/failure.json`,JSON.stringify({error:String(e),state:await state().catch(()=>null),errors,missing},null,2));throw e;}
finally{await browser.close();}
