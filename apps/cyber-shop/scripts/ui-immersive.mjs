import {chromium} from 'playwright';
import fs from 'node:fs/promises';
import assert from 'node:assert/strict';
const out='apps/cyber-shop/evidence/immersive-room';await fs.mkdir(out,{recursive:true});
const browser=await chromium.launch({headless:true});const context=await browser.newContext({viewport:{width:1920,height:948}});const page=await context.newPage();page.setDefaultTimeout(8000);
const errors=[];page.on('pageerror',e=>errors.push(e.message));const g=async()=>JSON.parse(await page.evaluate(()=>window.render_game_to_text())).game;
const click=name=>page.getByRole('button',{name,exact:true}).click();const results={};
try{
 await page.goto('http://127.0.0.1:4175/cyber-shop/');await page.locator('#start-btn').click();await page.waitForSelector('.warehouse-item');await page.waitForTimeout(700);
 assert.equal((await g()).visitorArrived,false);await page.locator('.room-person').waitFor({state:'hidden'});assert.equal(await page.locator('.room-person').count(),0);assert.equal(await page.locator('.topbar,.bottom-nav').count(),0);
 for(const [width,height] of [[1920,948],[1440,960],[960,650],[844,390]]){
  await page.setViewportSize({width,height});await page.waitForTimeout(100);
  const b=await page.locator('.shop-room').boundingBox();assert.deepEqual(b,{x:0,y:0,width,height});
  const overflow=await page.evaluate(()=>({w:document.documentElement.scrollWidth,h:document.documentElement.scrollHeight}));assert(overflow.w<=width);assert(overflow.h<=height);
  const cell=await page.locator('.warehouse-cell').first().boundingBox();assert(Math.abs(cell.width-cell.height)<1);
  const grid=await page.locator('.warehouse-scroll').evaluate(e=>({scroll:e.scrollHeight,view:e.clientHeight}));assert(grid.scroll<=grid.view+1,'initial inventory should fit without scrolling');
  await page.screenshot({path:`${out}/viewport-${width}.png`});
 }
 results.viewportFill=true;await page.setViewportSize({width:1920,height:948});
 assert.match(await page.locator('.wall-clock').innerText(),/1,200/);
 for(const [label,key] of [['库存','inventory'],['技能与资质','growth'],['工具采购','equipment'],['收藏图鉴','collection'],['街区手记','journal'],['设置与存档','settings']]){await page.locator('.cabinet-menu').getByRole('button',{name:label,exact:true}).click();await page.getByRole('dialog',{name:key,exact:true}).waitFor();await click('关闭面板');}
 results.embeddedMenus=true;
 const first=page.locator('.warehouse-item').first();await first.hover();const tooltip=page.getByRole('tooltip');await tooltip.waitFor();
 for(const text of ['购入价','价值估算','当前预计售价','占用格子'])assert((await tooltip.innerText()).includes(text));assert.equal(await first.getAttribute('title'),null);
 const tipbox=await tooltip.boundingBox();assert(tipbox.x>=0&&tipbox.y>=0&&tipbox.x+tipbox.width<=1920&&tipbox.y+tipbox.height<=948);
 await page.screenshot({path:`${out}/hover-prices.png`});results.hoverInfo=true;
 await page.evaluate(()=>document.addEventListener('contextmenu',e=>{window.contextWasPrevented=e.defaultPrevented;}));
 await page.locator('.warehouse-item').last().click({button:'right'});await page.getByRole('menu',{name:'物品操作'}).waitFor();assert.equal(await page.evaluate(()=>window.contextWasPrevented),true);await page.screenshot({path:`${out}/context-menu.png`});
 assert(await page.getByRole('menuitem',{name:'放入展柜 · 需核验',exact:true}).isDisabled());await page.getByRole('menuitem',{name:'旋转物品',exact:true}).click();const rotatedState=await g();assert.equal(rotatedState.warehouse.positions[rotatedState.items.at(-1).id].rotated,true);results.contextAction=true;
 await click('绿色叫号按钮');assert.equal((await g()).visitorArrived,true);await page.waitForSelector('.room-person');assert(await page.getByRole('button',{name:'绿色叫号按钮'}).isDisabled());
 await click('关店 / 日结 →');await click('确认闭店');await click('迎接新的一天 →');assert.equal((await g()).visitorArrived,false);await page.locator('.room-person').waitFor({state:'hidden'});assert.equal(await page.locator('.room-person').count(),0);
 await page.reload();await page.getByRole('button',{name:/继续经营/}).click();await page.waitForSelector('.call-green-button');assert.equal((await g()).visitorArrived,false);await click('绿色叫号按钮');assert.equal((await g()).visitorIndex,0);results.dailyCall=true;
 await click('结束当前接待');await click('绿色叫号按钮');await page.keyboard.press('Space');await page.keyboard.press('Space');
 await page.locator('.incoming-item').first().hover();await page.getByRole('tooltip').waitFor();assert((await page.getByRole('tooltip').innerText()).includes('尚未购入'));assert((await page.getByRole('tooltip').innerText()).includes('卖家要价'));
 await page.locator('.incoming-item').first().click({button:'right'});await page.getByRole('menuitem',{name:'放到谈判台',exact:true}).click();await page.getByRole('dialog',{name:'谈判交易',exact:true}).waitFor();await click('关闭谈判');results.incomingContextTrade=true;
 const touch=await browser.newContext({viewport:{width:1280,height:800},hasTouch:true,isMobile:true});const tp=await touch.newPage();await tp.goto('http://127.0.0.1:4175/cyber-shop/');await tp.locator('#start-btn').tap();await tp.waitForSelector('.warehouse-item');await tp.locator('.warehouse-item').first().tap();await tp.getByRole('dialog',{name:'物品信息'}).waitFor();assert.equal(await tp.getByRole('tooltip').count(),0);
 const tb=await tp.locator('.touch-item-info').boundingBox(),vb=await tp.locator('.visitor-window').boundingBox();assert(tb.x>=vb.x&&tb.y>=vb.y&&tb.y+tb.height<=vb.y+vb.height+1);await tp.screenshot({path:`${out}/touch-info.png`});
 await tp.getByRole('button',{name:'关闭物品信息 ×',exact:true}).tap();
 const target=await tp.locator('.warehouse-item').first().boundingBox();const cdp=await touch.newCDPSession(tp);await cdp.send('Input.dispatchTouchEvent',{type:'touchStart',touchPoints:[{x:target.x+target.width/2,y:target.y+target.height/2}]});await tp.waitForTimeout(650);await cdp.send('Input.dispatchTouchEvent',{type:'touchEnd',touchPoints:[]});await tp.getByRole('menu',{name:'物品操作'}).waitFor();await tp.getByRole('menuitem',{name:'取消',exact:true}).tap();results.touchTapAndLongPress=true;
 await touch.close();assert.deepEqual(errors,[]);results.errors=errors;await fs.writeFile(`${out}/results.json`,JSON.stringify(results,null,2));console.log(JSON.stringify(results));
}catch(e){await page.screenshot({path:`${out}/failure.png`,fullPage:true});throw e;}finally{await browser.close();}
