/** Full career via normal UI only; read-only visible state guides the player. */
import { chromium } from 'playwright';
import fs from 'node:fs/promises';
import assert from 'node:assert/strict';
const out=process.env.CYBER_EVIDENCE_DIR||'apps/cyber-shop/evidence/living-shop/career';
await fs.mkdir(out,{recursive:true});
const browser=await chromium.launch({headless:true});
const context=await browser.newContext({viewport:{width:1440,height:960},acceptDownloads:true});
const page=await context.newPage();page.setDefaultTimeout(8000);
const errors=[],missing=[],journal=[],chapters=new Set(),purchases=new Set(),sales=new Set(),challengeAwards=[];
const endlessDays=Number(process.env.CYBER_ENDLESS_DAYS??0);
page.on('pageerror',e=>errors.push(e.message));page.on('console',m=>{if(m.type()==='error')errors.push(m.text());});
page.on('response',r=>{if(r.status()>=400)missing.push(r.url());});
const snapshot=async()=>JSON.parse(await page.evaluate(()=>window.render_game_to_text()));
const game=async()=>(await snapshot()).game;
const click=(name,exact=true)=>page.getByRole('button',{name,exact}).click();
const close=async()=>{const p=(await snapshot()).panel;if(p==='trade')await click('关闭谈判');else if(p)await click('关闭面板');};
const panel=async(name)=>{await close();await page.locator('.cabinet-menu').getByRole('button',{name,exact:false}).click();};
const shot=async(name)=>{await page.waitForTimeout(150);await page.screenshot({path:`${out}/${name}.png`});};
const skills=['precision-1','precision-2','precision-3','workshop-1','workshop-2','workshop-3','precision-4'];
async function repairOrders(){
 for(let n=0;n<12;n++){
  await close();let s=await game();const order=s.orders[0];if(!order||s.hours<.5)return;
  await page.locator('.workshop-hotspot').click();await page.locator('.list-row').first().click();
  for(let i=0;i<14;i++){
   s=await game();const current=s.orders.find(o=>o.id===order.id);if(!current)break;
   const item=s.items.find(i=>i.id===current.itemId),before=JSON.stringify({hours:s.hours,current,item});
   if(!current.diagnosed)await click('连接检测仪 →');
   else if(item.faults?.length){
    await click('参数操作');
    const f=item.faults[0];await page.getByLabel('维修工序',{exact:true}).selectOption(f.operation);
    await page.getByLabel('维修模块',{exact:true}).selectOption(f.module);
    if(f.operation==='calibrate')await page.getByLabel('精确校准参数',{exact:true}).fill(String(f.target));
    const preserve=page.getByLabel('修整原件',{exact:false});if(await preserve.count())await preserve.check();
    await click('执行工序');
   }else if(!current.completedOps)await click('清洁表面并恢复品相');
   else if(!current.verified)await click('通电复检');
   else {await click(/交付并结算|提交考核|完成翻新并入库/,false);break;}
   const next=await game();
   if(JSON.stringify({hours:next.hours,current:next.orders.find(o=>o.id===order.id),item:next.items.find(i=>i.id===current.itemId)})===before){await close();return;}
  }
  await close();if((await game()).orders.some(o=>o.id===order.id))return;
 }
}
async function learn(){
 if(!(await game()).points)return;await panel('技能与资质');await click('修复师专精');
 for(const id of skills){const s=await game();if(s.skills.includes(id))continue;if(s.points<(id.endsWith('-4')?2:1))break;await page.locator(`[data-skill="${id}"]`).click();}
 await close();
}
async function claims(){
 await close();await page.locator('.shop-plaque').click();
 for(let n=0;n<12&&(await snapshot()).journey.ready.length;n++)await page.getByRole('button',{name:'领取谢礼',exact:true}).first().click();
 await close();
 const s=await game();if(!s.eventResolved){await panel('街区手记');await page.locator('.event-story .vertical-actions button').last().click();await close();}
}
async function certificates(){
 for(const cert of [{id:'industrial',chapter:2,cases:5},{id:'neural',chapter:3,cases:14},{id:'antique',chapter:4,cases:28}]){
  const s=await game();if((cert.id==='antique'&&!s.endless)||s.certificates.includes(cert.id)||s.chapter<cert.chapter||s.records.repairs<cert.cases||s.orders.some(o=>o.kind==='exam'))continue;
  await panel('技能与资质');await click('证书与许可');const row=page.locator(`[data-certificate="${cert.id}"]`);
  if(!s.trained.includes(cert.id))await row.getByRole('button',{name:'报名培训',exact:true}).click();
  if((await game()).trained.includes(cert.id))await row.getByRole('button',{name:'进入实际考核 / 重试',exact:true}).click();
  await close();await repairOrders();
 }
}
async function finalOrder(){
 const s=await game();if(s.chapter<4||!s.skills.includes('precision-4')||s.finalComplete||s.orders.some(o=>o.kind==='final'))return;
 await panel('街区手记');await click('接取下一阶段最终委托');await close();await repairOrders();
}
async function customers(){
 for(let i=0;i<7;i++){
  await close();let s=await game();if(!s.visitor)break;
  if(s.visitorArrived===false||s.visitor.resolved){const call=page.getByRole('button',{name:'绿色叫号按钮',exact:true});if(await call.isEnabled())await call.click();else break;}
  s=await game();const v=s.visitor;
  for(let j=0;j<2;j++){const current=await game();if((current.conversations?.[v.id]??0)<2)await page.keyboard.press('Space');}
  if(v.kind==='repair'&&s.hours>=3){await click('查看维修委托 →');await click('接下维修 →');await close();await repairOrders();}
  else if(v.kind==='seller'&&s.cash>v.quote+800&&s.stockUsage<s.capacity-5){
   await click('把来货放上台 →');if(s.hours>=.5)await click('基础检查');await click('收下选中的货 →');await close();
   if((await game()).items.some(i=>i.id===v.item.id)){purchases.add(v.category);await click('全部入库 ↓');}
  }else if(v.kind==='buyer'&&s.items.some(i=>i.owner==='player'&&i.location==='stock'&&i.category===v.category)){
   await click('挑选出售货物 →');await click('选取全部可售货物');
   if(await page.getByRole('button',{name:'成交并交货 →',exact:true}).isDisabled())await click('按预算挑选');
   if(await page.getByRole('button',{name:'成交并交货 →',exact:true}).isEnabled())await click('成交并交货 →');await close();
   if((await game()).records.trades>s.records.trades)sales.add(v.category);
   if(await page.getByRole('button',{name:'全部入库 ↓',exact:true}).count())await click('全部入库 ↓');
  }
  await close();if(!(await game()).visitor.resolved)await click('结束当前接待');
 }
}
async function day(){
 let s=await game();if(s.phase==='closed')await click('迎接新的一天 →');
 await learn();await claims();await certificates();await repairOrders();await finalOrder();
 s=await game();if(s.chapter>=3&&!s.licenses.length){await panel('技能与资质');await click('证书与许可');await click(/申请通用交易许可/,false);await close();}
 await customers();await learn();await claims();await finalOrder();s=await game();
 if(!chapters.has(s.chapter)){chapters.add(s.chapter);await page.locator('.shop-plaque').click();await shot(`chapter-${s.chapter}`);await close();await shot(`room-${s.chapter}`);}
 if(!s.victory&&s.finalComplete&&s.cash>=12000+s.debt){await panel('街区手记');await click('支付并买下店铺');}
 else {await close();if(await page.getByRole('button',{name:'全部入库 ↓',exact:true}).count())await click('全部入库 ↓');await click('关店 / 日结 →');await click('确认闭店');}
 s=await game();assert.notEqual(s.phase,'failed');const row={day:s.day,chapter:s.chapter,repairs:s.records.repairs,trades:s.records.trades,cash:s.cash,points:s.points,phase:s.phase};journal.push(row);console.log(JSON.stringify(row));
 challengeAwards.push(...(await snapshot()).dayReport.entries.filter(e=>e.kind==='challenge'));
 if(s.day===1)await shot('first-receipt');
}
const start=Date.now();
try{
 await page.goto(process.env.CYBER_URL||'http://127.0.0.1:4175/cyber-shop/');await click('推开店门 →',false);await page.waitForSelector('.warehouse-item');await click('跳过引导');
 for(let i=0;i<55&&!(await game()).victory;i++)await day();
 const victory=await game();assert(victory.victory,'Career must reach ownership via UI');assert.equal(chapters.size,4);await shot('ending');
 await click('结束并保存结局');await page.reload();await click('继续经营 ↗',false);assert.equal((await game()).phase,'ended');
 await click('继续经营 →');assert((await game()).endless);await click('迎接新的一天 →');
 if(endlessDays){
  await panel('街区手记');await click('接取批量维修');await close();
  for(let n=0;n<endlessDays;n++)await day();
  assert((await game()).certificates.includes('antique'));assert(challengeAwards.some(e=>e.amount===1500));
  if((await game()).phase==='closed')await click('迎接新的一天 →');
  await panel('库存');
  for(const item of (await game()).items.filter(i=>i.owner==='player'&&i.location==='stock')){
   if((await game()).items.filter(i=>i.location==='display').length>=3||(await game()).hours<.5)break;
   await page.locator(`.item-tile[data-item="${item.id}"]`).click();
   if(!item.known.includes('serial'))await click('查验来源');
   if((await game()).items.find(i=>i.id===item.id)?.authentic)await click('放进收藏展示柜');
  }
  await close();await page.locator('.shop-plaque').click();await shot('endless-goals');await close();await shot('endless-collection');
  assert((await game()).items.some(i=>i.location==='display'));
 }
 await panel('设置与存档');const [download]=await Promise.all([page.waitForEvent('download'),click('导出当前存档')]);await download.saveAs(`${out}/career-save.json`);
 const before=await game();await page.locator('input[type=file]').setInputFiles(`${out}/career-save.json`);assert.deepEqual(await game(),before);
 await page.reload();await click('继续经营 ↗',false);assert.deepEqual(await game(),before);
 await page.setViewportSize({width:844,height:390});await shot('landscape-endless');
 assert.deepEqual(errors,[]);assert.deepEqual(missing,[]);
 await fs.writeFile(`${out}/results.json`,JSON.stringify({ok:true,winDay:victory.day,repairs:victory.records.repairs,trades:victory.records.trades,purchases:[...purchases],sales:[...sales],endlessDays,challengeAwards,finalDay:(await game()).day,antiqueCertificate:(await game()).certificates.includes('antique'),displayed:(await game()).items.filter(i=>i.location==='display').length,elapsedSeconds:(Date.now()-start)/1000,errors,missing,journal},null,2));
 console.log('UI_CAREER_PASS');
}catch(e){await shot('failure').catch(()=>{});await fs.writeFile(`${out}/failure.json`,JSON.stringify({error:String(e),state:await snapshot().catch(()=>null),errors,missing,journal},null,2));throw e;}
finally{await browser.close();}
