/** Normal touch input and UI-imported playthrough saves; no state injection. */
import {chromium} from 'playwright';
import fs from 'node:fs/promises';
import assert from 'node:assert/strict';
import {completeIntro} from './ui-onboarding.mjs';
const out=process.env.CYBER_EVIDENCE_DIR||'apps/cyber-shop/evidence/living-shop/mobile-stock';await fs.mkdir(out,{recursive:true});
const browser=await chromium.launch({headless:true}),page=await browser.newPage({viewport:{width:844,height:390},hasTouch:true,isMobile:true});page.setDefaultTimeout(8000);
const errors=[],checks=[];page.on('pageerror',e=>errors.push(e.message));page.on('response',r=>{if(r.status()>=400)errors.push(`${r.status()} ${r.url()}`);});
const tap=n=>page.getByRole('button',{name:n,exact:true}).tap(),panel=n=>page.locator('.cabinet-menu').getByRole('button',{name:n,exact:false}).tap(),read=async()=>JSON.parse(await page.evaluate(()=>window.render_game_to_text())),game=async()=>(await read()).game;
async function load(file){await panel('设置与存档');await page.locator('input[type=file]').setInputFiles(file);await page.waitForFunction(()=>JSON.parse(window.render_game_to_text()).panel==='');}
async function check(name){
 await page.waitForTimeout(120);await page.locator('.toast').waitFor({state:'hidden'});
 const result=await page.evaluate(()=>{
  const root=document.querySelector('.warehouse-grid'),v=root.parentElement,cell=root.querySelector('button').getBoundingClientRect().width;
  const grids=[...document.querySelectorAll('.warehouse-grid,.surface-grid,.container-grid')].map(e=>{const b=e.getBoundingClientRect(),p=e.parentElement.getBoundingClientRect(),u=e.querySelector('button').getBoundingClientRect();return {kind:e.className,box:{x:b.x,y:b.y,width:b.width,height:b.height},inside:b.left>=p.left-.1&&b.right<=p.right+.1&&b.top>=p.top-.1&&b.bottom<=p.bottom+.1,cell:u.width,square:Math.abs(u.width-u.height)<.1};});
  const windows=[...document.querySelectorAll('.container-window')].map(e=>{const b=e.getBoundingClientRect();return {x:b.x,y:b.y,right:b.right,bottom:b.bottom};});
  return {cell,grids,windows,width:innerWidth,height:innerHeight,scrollTop:v.scrollTop,scrollable:v.scrollHeight>v.clientHeight||v.scrollWidth>v.clientWidth};
 });
 assert(!result.scrollable);assert.equal(result.scrollTop,0);for(const g of result.grids){assert(g.inside,`${name} ${g.kind} clipped`);assert(g.square);assert(Math.abs(g.cell-result.cell)<.1);assert(g.box.x>=0&&g.box.y>=0&&g.box.x+g.box.width<=result.width+.1&&g.box.y+g.box.height<=result.height+.1);}
 for(const w of result.windows)assert(w.x>=0&&w.y>=0&&w.right<=result.width&&w.bottom<=result.height);
 await page.screenshot({path:`${out}/${name}.png`});checks.push({name,...result});
}
try{
 await page.goto(process.env.CYBER_URL||'http://127.0.0.1:4176/cyber-shop/');await page.locator('#start-btn').tap();await completeIntro(page,true);
 await load('apps/cyber-shop/evidence/living-shop/energy-career-final/career-save.json');
 await panel('工具采购');await tap('四类设施');for(let n=0;n<3;n++)await page.locator('[data-equipment="stock-rack"]').getByRole('button').tap();await tap('关闭面板');
 await panel('技能与资质');await tap('通用经营');await page.locator('[data-skill="business-1"]').tap();await tap('关闭面板');assert.equal((await game()).rootCapacity*4,264);await check('expanded-264');assert.equal(await page.locator('.warehouse-cell').count(),144);
 if(!await page.locator('.warehouse-item[data-item]').count()){
  for(let n=0;n<7;n++){await tap('绿色叫号按钮');const s=await game();if(s.visitor.kind==='seller'){while(((await game()).conversations[s.visitor.id]??0)<2)await page.locator('.speech-bubble button').filter({hasText:/继续交谈|看看/}).first().tap();await tap('把来货放上台 →');await tap('收下选中的货 →');await tap('关闭谈判');await tap('全部入库 ↓');await tap('结束当前接待');break;}await tap('结束当前接待');}
 }
 const object=page.locator('.warehouse-item[data-item]').first(),id=await object.getAttribute('data-item');
 const target=await object.evaluate(e=>{const b=e.getBoundingClientRect(),g=document.querySelector('.warehouse-grid'),cell=g.querySelector('button').getBoundingClientRect().width;return {x:24-Math.round(b.width/cell),y:11-Math.round(b.height/cell)};});
 await object.tap();await page.getByRole('tab',{name:'扩仓1 · 120 格',exact:true}).tap();await tap(`仓库空格 ${target.y*24+target.x+1}`);assert.equal((await game()).warehouse.positions[id].x,target.x);assert.equal((await game()).warehouse.positions[id].y,target.y);if(await page.getByRole('button',{name:'关闭物品信息 ×',exact:true}).count())await tap('关闭物品信息 ×');await check('last-row-placement');
 const saved=(await game()).warehouse.positions;await page.reload();await tap('继续经营 ↗');assert.deepEqual((await game()).warehouse.positions,saved);assert.equal(await page.locator('.warehouse-grid').getAttribute('data-page'),'0');await panel('库存');await page.locator(`.item-tile[data-item="${id}"]`).tap();await tap('定位货物 ↗');assert.equal(await page.locator('.warehouse-grid').getAttribute('data-page'),'1');assert.deepEqual((await game()).warehouse.positions,saved);await check('locate-saved-page');
 for(const [width,height] of [[667,375],[568,320],[844,390]]){await page.setViewportSize({width,height});await check(`resized-${width}`);}
 // Buy the largest actual 8×8 container from a visitor, then open it using touch controls.
 let freight;
 for(let n=0;n<7;n++){
  await tap('绿色叫号按钮');let s=await game();const offer=s.visitor.storageGoods?.find(o=>o.styleId==='freight-case');
  if(offer){while(((await game()).conversations[s.visitor.id]??0)<2)await page.locator('.speech-bubble button').filter({hasText:/继续交谈|看看/}).first().tap();await tap('把来货放上台 →');await page.locator(`[data-storage-offer="${offer.id}"]`).getByRole('button').tap();await tap('关闭谈判');freight=(await game()).containers.find(c=>c.styleId==='freight-case');break;}await tap('结束当前接待');
 }
 assert(freight);await page.locator(`[data-counter-container="${freight.id}"]`).tap();await tap('仓库空格 145');assert.equal((await game()).containers.find(c=>c.id===freight.id).location,'stock');await page.locator(`[data-world-container="${freight.id}"]`).tap();await tap('打开箱包');await check('freight-open');
 await page.setViewportSize({width:568,height:320});await check('freight-smallest');await tap('关闭 重型货运箱');
 await load('apps/cyber-shop/evidence/living-shop/ledger-final/nested-save.json');await page.setViewportSize({width:844,height:390});
 const nested=await game(),crate=nested.containers.find(c=>!c.containerId),pack=nested.containers.find(c=>c.containerId===crate.id),pouch=nested.containers.find(c=>c.containerId===pack.id);
 await page.locator(`[data-world-container="${crate.id}"]`).tap();await tap('打开箱包');
 const win=id=>page.locator(`[data-container-window="${id}"]`);
 await win(crate.id).locator(`[data-storage-object="${pack.id}"]`).tap();await win(crate.id).getByRole('button',{name:'打开',exact:true}).tap();await win(pack.id).locator(`[data-storage-object="${pouch.id}"]`).tap();await win(pack.id).getByRole('button',{name:'打开',exact:true}).tap();await check('three-levels');
 const chip=nested.items.find(i=>i.containerId===pouch.id);await win(pouch.id).locator(`[data-storage-object="${chip.id}"]`).tap();await win(pouch.id).getByRole('button',{name:'取出',exact:true}).tap();assert(!(await game()).items.find(i=>i.id===chip.id).containerId);await win(pouch.id).getByRole('button',{name:'撤销摆放',exact:true}).tap();assert.equal((await game()).items.find(i=>i.id===chip.id).containerId,pouch.id);await check('nested-touch-undo');
 assert.deepEqual(errors,[]);await fs.writeFile(`${out}/results.json`,JSON.stringify({ok:true,upgradedCells:264,lastRow:true,largestContainer:true,nestedTouch:true,checks,errors},null,2));console.log('MOBILE_STOCK_PASS');
}catch(e){await page.screenshot({path:`${out}/failure.png`}).catch(()=>{});await fs.writeFile(`${out}/failure.json`,JSON.stringify({error:String(e),state:await read().catch(()=>null),errors},null,2));throw e;}finally{await browser.close();}
