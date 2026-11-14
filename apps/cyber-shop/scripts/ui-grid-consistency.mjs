import {chromium} from 'playwright';
import fs from 'node:fs/promises';
import assert from 'node:assert/strict';
const out=process.env.CYBER_EVIDENCE_DIR||'apps/cyber-shop/evidence/living-shop/uniform-grid';await fs.mkdir(out,{recursive:true});
const browser=await chromium.launch({headless:true}),page=await browser.newPage({viewport:{width:1440,height:960}});page.setDefaultTimeout(8000);
const errors=[],missing=[],results={};page.on('pageerror',e=>errors.push(e.message));page.on('response',r=>{if(r.status()>=400)missing.push(r.url());});
const url=process.env.CYBER_URL||'http://127.0.0.1:4176/cyber-shop/';
const game=async()=>JSON.parse(await page.evaluate(()=>window.render_game_to_text())).game;
const click=name=>page.getByRole('button',{name,exact:true}).click();
const shot=async name=>{await page.waitForTimeout(100);await page.screenshot({path:`${out}/${name}.png`});};
const closeEnough=(a,b)=>assert(Math.abs(a-b)<.1,`${a} should equal ${b}`);
async function dimensions(el){return el.evaluate(e=>{const b=e.getBoundingClientRect(),a=e.querySelector('.inventory-art').getBoundingClientRect();return {width:b.width,height:b.height,artWidth:a.width,artHeight:a.height};});}
async function moveWindow(id,x,y){const h=await page.locator(`[data-container-window="${id}"] .container-window-title`).boundingBox();await page.mouse.move(h.x+55,h.y+12);await page.mouse.down();await page.mouse.move(x+55,y+12,{steps:12});await page.mouse.up();}
try{
 await page.goto(url);await page.locator('#start-btn').click();const baseline=await game();assert.equal(baseline.rootCapacity*4,144);
 for(let step=0;step<9;step++){
  assert.equal(await page.locator('.shop-tour').getAttribute('data-tour-step'),String(step));
  const box=await page.locator('.tour-card').boundingBox(),hole=await page.locator('.tour-spotlight').boundingBox();assert(box.x>=0&&box.y>=0&&box.x+box.width<=1440&&box.y+box.height<=960);assert(hole.width>0&&hole.height>0);
  await page.locator('.tour-card').focus();await page.keyboard.press('Space');assert.equal((await game()).visitorArrived,false);assert.equal((await game()).cash,baseline.cash);assert.equal((await game()).hours,baseline.hours);
  await shot(`tour-${step+1}`);if(step<8)await click('下一区域 →');
 }
 await page.locator('.warehouse-tools').getByRole('button',{name:'翻开店长手册',exact:true}).click();assert.equal(await page.locator('.shop-tour').count(),0);assert.equal((await game()).tutorial.step,9);assert.equal(await page.locator('.book-reader').getAttribute('data-spread'),'0');
 await click('下一页 →');await page.waitForFunction(()=>!document.querySelector('.turn-sheet'));const manual=await page.locator('.book-reader').innerText();for(const text of ['Q / E','正方形格子','展示柜','维修工作台','剩余工时','抽屉'])assert(manual.includes(text));await shot('manual-controls');await click('合上手册 ↗');
 const mainText=await page.locator('.shop-room').innerText();for(const text of ['01 /','02 /','03 /','Q / E','拖放整理','双击打开','往来皆是故事'])assert(!mainText.includes(text));results.onboarding={steps:9,physicalBookFirst:true,noTimeOrCashSpent:true,instructionsInBook:true};
 await click('绿色叫号按钮');await click('结束当前接待');await click('绿色叫号按钮');await page.keyboard.press('Space');await page.keyboard.press('Space');
 const item=(await game()).visitor.goods[0],id=item.id;const incoming=page.locator(`.incoming-item[data-item="${id}"]`);await incoming.waitFor();const original=await dimensions(incoming);assert(original.width>0);closeEnough(original.artWidth,original.width-2);closeEnough(original.artHeight,original.height-2);
 await click('把来货放上台 →');await click('关闭谈判');assert.deepEqual(await dimensions(page.locator(`.staged-item[data-item="${id}"]`)),original);
 await click('打开谈判 ↗');await click('收下选中的货 →');await click('买下箱包 · ₡300');await click('关闭谈判');assert.deepEqual(await dimensions(page.locator(`.purchased-item[data-item="${id}"]`)),original);
 await click('全部入库 ↓');const root=page.locator(`.warehouse-item[data-item="${id}"]`);assert.deepEqual(await dimensions(root),original);
 const pack=(await game()).containers.find(c=>c.styleId==='courier-pack').id,win=page.locator(`[data-container-window="${pack}"]`);await page.locator(`[data-world-container="${pack}"]`).dblclick();await moveWindow(pack,1120,340);
 await root.click();await win.getByRole('button',{name:'箱内空格 1',exact:true}).click();assert.equal((await game()).items.find(i=>i.id===id).containerId,pack);const inner=win.locator(`[data-storage-object="${id}"]`);assert.deepEqual(await dimensions(inner),original);results.sameItemAcrossFiveAreas=original;
 await inner.click();await page.keyboard.press('e');await win.getByRole('button',{name:'箱内空格 13',exact:true}).click();const turned=await dimensions(inner);closeEnough(turned.width,original.height);closeEnough(turned.height,original.width);closeEnough(turned.artWidth,turned.width-2);closeEnough(turned.artHeight,turned.height-2);assert.equal((await game()).containers.find(c=>c.id===pack).layout.positions[id].rotated,true);results.rotation=true;
 results.viewports=[];
 for(const [width,height] of [[1440,960],[1920,948],[960,650],[844,390]]){
  await page.setViewportSize({width,height});await page.waitForTimeout(120);
  const sizes=[];for(const selector of ['.incoming-tray .surface-cell','.negotiation-table .surface-cell','.warehouse-cell','.container-cell']){const b=await page.locator(selector).first().boundingBox();sizes.push([b.width,b.height]);closeEnough(b.width,b.height);}
  sizes.forEach(s=>closeEnough(s[0],sizes[0][0]));const object=await dimensions(inner);closeEnough(object.artWidth,object.width-2);closeEnough(object.artHeight,object.height-2);
  const b=await win.boundingBox();assert(b.x>=0&&b.y>=0&&b.x+b.width<=width&&b.y+b.height<=height);await shot(`all-grids-${width}`);results.viewports.push({width,height,cell:sizes[0][0]});
 }
 await page.reload();await page.getByRole('button',{name:/继续经营/}).click();assert.equal(await page.locator('.shop-tour').count(),0);assert.equal((await game()).items.find(i=>i.id===id).containerId,pack);results.reload=true;
 // Test every mask card at the smallest supported landscape size as well.
 await click('翻开店长手册');await click('重新查看店铺区域 ↗');
 for(let step=0;step<9;step++){await page.waitForTimeout(60);const b=await page.locator('.tour-card').boundingBox();assert(b.x>=0&&b.y>=0&&b.x+b.width<=844&&b.y+b.height<=390,`tour ${step} outside small viewport`);await shot(`tour-844-${step+1}`);if(step<8)await click('下一区域 →');}
 await click('翻开高亮的手册 ↗');await click('合上手册 ↗');assert.equal((await game()).tutorial.step,9);results.smallTour=true;
 assert.deepEqual(errors,[]);assert.deepEqual(missing,[]);await fs.writeFile(`${out}/results.json`,JSON.stringify({...results,errors,missing},null,2));console.log('UNIFORM_GRID_PASS');
}catch(e){await shot('failure').catch(()=>{});await fs.writeFile(`${out}/failure.json`,JSON.stringify({error:String(e),state:await game().catch(()=>null),errors,missing},null,2));throw e;}finally{await browser.close();}
