/** Continue a save earned by ui-journey, then buy and authenticate six real exhibits. */
import { chromium } from 'playwright';
import fs from 'node:fs/promises';
import assert from 'node:assert/strict';
const out=process.env.CYBER_EVIDENCE_DIR||'apps/cyber-shop/evidence/living-shop/shop-growth';
await fs.mkdir(out,{recursive:true});
const browser=await chromium.launch({headless:true});
const page=await browser.newPage({viewport:{width:1440,height:960}});page.setDefaultTimeout(8000);
const errors=[];page.on('pageerror',e=>errors.push(e.message));
const read=async()=>JSON.parse(await page.evaluate(()=>window.render_game_to_text()));
const game=async()=>(await read()).game;
const click=(name,exact=true)=>page.getByRole('button',{name,exact}).click();
const close=async()=>{const p=(await read()).panel;if(p==='trade')await click('关闭谈判');else if(p)await click('关闭面板');};
const panel=async(name)=>{await close();await page.locator('.cabinet-menu').getByRole('button',{name,exact:false}).click();};
const count=async()=>(await game()).items.filter(i=>i.location==='display').length;
async function displayStock(){
 await panel('库存');
 for(const item of (await game()).items.filter(i=>i.location==='stock')){
  if(await count()>=6||(await game()).hours<.5)break;
  await page.locator(`.item-tile[data-item="${item.id}"]`).click();
  if(!item.known.includes('serial'))await click('查验来源');
  if((await game()).items.find(i=>i.id===item.id)?.authentic)await click('放进收藏展示柜');
 }
 await close();
}
try{
 await page.goto(process.env.CYBER_URL||'http://127.0.0.1:4175/cyber-shop/');
 await page.locator('input[type=file]').setInputFiles('apps/cyber-shop/evidence/living-shop/endless-career/career-save.json');
 await page.locator('.journey-open').waitFor();
 assert((await game()).victory);assert.equal(await count(),1);
 await page.locator('.showcase-locked').waitFor();
 await page.screenshot({path:`${out}/before-expansion.png`});
 await panel('工具采购');await click('四类设施');await page.locator('[data-equipment="display-case"]').getByRole('button').click();
 await close();assert.equal((await game()).displayCapacity,6);assert.equal(await page.locator('.showcase-locked').count(),0);
 for(let day=0;day<5&&await count()<6;day++){
  if((await game()).phase==='closed')await click('迎接新的一天 →');
  for(let n=0;n<12&&await count()<6;n++){
   const s=await game();if(!s.visitor)break;
   if(!s.visitorArrived||s.visitor.resolved){const call=page.getByRole('button',{name:'绿色叫号按钮',exact:true});if(await call.isDisabled())break;await call.click();}
   const current=await game();
   if(current.visitor.kind==='seller'){
    await page.keyboard.press('Space');await page.keyboard.press('Space');
    await click('把来货放上台 →');await click('收下选中的货 →');await close();await click('全部入库 ↓');await displayStock();
   }
   if(!(await game()).visitor.resolved)await click('结束当前接待');
  }
  if(await count()<6){await click('关店 / 日结 →');await click('确认闭店');}
 }
 assert.equal(await count(),6,'Six authentic exhibits earned through normal trading');
 const sizes=[];
 for(const size of [{width:1440,height:960},{width:960,height:650},{width:844,height:390}]){
  await page.setViewportSize(size);await page.waitForTimeout(150);
  const boxes=await page.locator('.showcase-object').evaluateAll(nodes=>nodes.map(n=>{const b=n.getBoundingClientRect();return{x:b.x,y:b.y,w:b.width,h:b.height};}));
  assert.equal(boxes.length,6);assert(boxes[3].y>=boxes[0].y+boxes[0].h-1,'Second shelf below first shelf');
  for(let i=0;i<6;i++)assert(boxes[i].w>20&&boxes[i].h>20);
  await page.screenshot({path:`${out}/six-exhibits-${size.width}.png`});sizes.push({size,boxes});
 }
 await page.reload();await click('继续经营 ↗',false);assert.equal(await count(),6);assert.equal((await game()).displayCapacity,6);
 await panel('设置与存档');const [download]=await Promise.all([page.waitForEvent('download'),click('导出当前存档')]);await download.saveAs(`${out}/six-exhibits-save.json`);
 assert.deepEqual(errors,[]);await fs.writeFile(`${out}/results.json`,JSON.stringify({ok:true,day:(await game()).day,displayed:await count(),sizes,errors},null,2));console.log('SHOP_GROWTH_PASS');
}catch(e){await page.screenshot({path:`${out}/failure.png`});throw e;}finally{await browser.close();}
