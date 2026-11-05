import { chromium } from 'playwright';
import fs from 'node:fs/promises';
import path from 'node:path';
const base = process.env.CYBER_URL || 'http://127.0.0.1:4176/cyber-shop/';
const out = path.resolve('apps/cyber-shop/evidence/ui-smoke'); await fs.mkdir(out,{recursive:true});
const browser = await chromium.launch({headless:true});
const context = await browser.newContext({viewport:{width:1440,height:1000},acceptDownloads:true});
await context.addInitScript(()=>{ const Original=window.AudioContext; window.AudioContext=class extends Original { constructor(...args){super(...args);window.__audioProbe=this;} }; });
const page = await context.newPage(); page.setDefaultTimeout(7000);
const errors=[]; page.on('pageerror',e=>errors.push(e.message)); page.on('console',m=>{if(m.type()==='error')errors.push(m.text());});
const get=async()=>JSON.parse(await page.evaluate(()=>window.render_game_to_text()));
const game=async()=>(await get()).game;
const click=async name=>page.getByRole('button',{name,exact:true}).click();
const close=async()=>{if(await page.getByRole('button',{name:'关闭面板',exact:true}).count())await click('关闭面板');};
const panel=async index=>{await close();await page.locator('.bottom-nav button').nth(index).click();};
const shot=async name=>{await page.waitForTimeout(350);await page.screenshot({path:path.join(out,`${name}.png`)});};
async function dragScene(id){
  await page.waitForTimeout(450);
  const stock=(await game()).items.filter(i=>i.owner==='player'&&i.location==='stock').slice(0,5),index=stock.findIndex(i=>i.id===id);
  if(index<0)throw Error('Test item is outside the visible scene inventory');
  const canvas=await page.locator('canvas').boundingBox(),viewport=await page.locator('.phaser-host').boundingBox();
  if(!canvas||!viewport)throw Error('Missing scene bounds');
  const from={x:viewport.x+viewport.width*(.2+index*.15),y:viewport.y+viewport.height-125},to={x:viewport.x+viewport.width*.22,y:viewport.y+viewport.height*.48};
  let exposed=null;
  for(const offset of [0,-28,-42,28]){const candidate={x:from.x,y:from.y+offset/900*canvas.height};if(await page.evaluate(({x,y})=>document.elementFromPoint(x,y)?.tagName,candidate)==='CANVAS'){exposed=candidate;break;}}
  if(!exposed)throw Error('Phaser inventory object is entirely blocked by DOM controls');
  await page.mouse.move(exposed.x,exposed.y);await page.mouse.down();await page.mouse.move(to.x,to.y,{steps:12});await page.mouse.up();await page.waitForTimeout(200);
  if(!(await game()).items.some(i=>i.id===id&&i.location==='display'))throw Error('Phaser drag failed after viewport/scale change');
}
const results={};
try {
  await page.goto(base);
  await page.locator('input[type=file]').setInputFiles(path.resolve('apps/cyber-shop/evidence/ui-playthrough/ui-save.json'));
  await page.waitForSelector('canvas');
  const initial=await game();
  await panel(1); await click('预览技能重配'); await click('清空预览'); await click('确认一次性重配');
  const respec=await game();
  if(respec.skills.length!==0 || respec.cash!==initial.cash || respec.points<initial.points || JSON.stringify(respec.certificates)!==JSON.stringify(initial.certificates) || JSON.stringify(respec.items)!==JSON.stringify(initial.items))throw Error('Free respec did not preserve assets/certificates');
  await click('预览技能重配'); await click('确认一次性重配');
  if((await game()).cash!==respec.cash-350 || (await game()).points!==respec.points)throw Error('Paid respec duplicated refund or wrong debit');
  results.respec=true;
  for(const id of ['supply-1','supply-2','supply-3','business-1','business-2','collection-1','trade-1'])await page.locator(`[data-skill="${id}"]`).click();
  await click('修复师专精'); await page.locator('[data-skill="restoration-1"]').click(); await close();
  await page.getByRole('button',{name:'迎接新的一天',exact:false}).click();
  if(!await page.locator('.upcoming').isVisible())throw Error('Supply preview absent');
  await shot('information-skills'); results.supplyPreview=true;
  // Clicking a location covered by a modal must not dispatch a scene action.
  const beforeModal=JSON.stringify(await game()); await panel(4); await page.mouse.click(20,150); await close();
  if(JSON.stringify(await game())!==beforeModal)throw Error('Modal clicked through into game state'); results.modalIsolation=true;
  // Withdraw then drag a previously discovered real instance into the display drop zone.
  await panel(3); const display=(await game()).items.find(i=>i.location==='display');
  if(!display)throw Error('Playthrough did not create a collection item');
  await page.locator('.display-shelf article').filter({has:page.getByText(display.name,{exact:true})}).getByRole('button',{name:'撤展',exact:true}).click();
  await panel(0);
  const source=page.locator(`[data-item="${display.id}"]`);await source.scrollIntoViewIfNeeded();await source.hover();
  const sourceBox=await source.boundingBox(),dropBox=await page.locator('.display-drop').boundingBox();
  await page.mouse.move(sourceBox.x+sourceBox.width/2,sourceBox.y+sourceBox.height/2);await page.mouse.down();
  await page.mouse.move(sourceBox.x+sourceBox.width/2+12,sourceBox.y+sourceBox.height/2+12,{steps:5});
  await page.mouse.move(dropBox.x+30,dropBox.y+20,{steps:25});await page.mouse.move(dropBox.x+40,dropBox.y+25,{steps:3});await page.mouse.up();
  if(!(await game()).items.some(i=>i.id===display.id && i.location==='display'))throw Error('Inventory drag did not display instance');
  results.domDrag=true;await shot('inventory-drag');await close();
  // Reopen, withdraw, then drag via Phaser at a resized viewport.
  await panel(3); await page.locator('.display-shelf article').first().getByRole('button',{name:'撤展',exact:true}).click();await close();
  await page.setViewportSize({width:1200,height:800});await dragScene(display.id);results.phaserDrag=true;
  await page.setViewportSize({width:1440,height:1000});
  await page.getByRole('button',{name:'设置与存档',exact:true}).click();await click('切换全屏 · F');await close();
  if(!await page.evaluate(()=>!!document.fullscreenElement))throw Error('Fullscreen did not start');
  // Apply 90% rendering zoom, preserving the game state, then use actual pointer coordinates.
  await page.evaluate(()=>{document.body.style.zoom='0.9';window.dispatchEvent(new Event('resize'));});
  await panel(3);await page.locator('.display-shelf article').first().getByRole('button',{name:'撤展',exact:true}).click();await close();
  await dragScene(display.id);results.fullscreenZoomDrag=true;
  await page.evaluate(()=>{document.body.style.zoom='';window.dispatchEvent(new Event('resize'));});await page.keyboard.press('Escape');
  // Malformed import leaves the current game and persistent save intact.
  await page.getByRole('button',{name:'设置与存档',exact:true}).click();
  const before=await page.evaluate(()=>localStorage.getItem('cyber-shop:save:v1'));
  await page.locator('input[type=file]').setInputFiles({name:'corrupt.json',mimeType:'application/json',buffer:Buffer.from('{corrupt')});
  if(await page.evaluate(()=>localStorage.getItem('cyber-shop:save:v1'))!==before)throw Error('Corrupt import overwrote valid progress'); results.corruptImport=true;
  await close();
  results.audioState=await page.evaluate(()=>window.__audioProbe?.state);if(results.audioState!=='running')throw Error('Audio failed to unlock on UI action');
  // Real touch input in a distinct mobile browser context, never relying on hover.
  const touchContext=await browser.newContext({viewport:{width:844,height:390},hasTouch:true,isMobile:true,deviceScaleFactor:1});
  const touch=await touchContext.newPage();await touch.goto(base);await touch.getByRole('button',{name:'推开店门',exact:false}).tap();await touch.waitForSelector('canvas');
  await touch.getByRole('button',{name:'接下维修',exact:false}).tap();await touch.getByRole('button',{name:'连接检测仪',exact:false}).tap();
  if((JSON.parse(await touch.evaluate(()=>window.render_game_to_text()))).panel!=='workbench')throw Error('Touch workbench not reached');
  await touch.waitForTimeout(350);await touch.screenshot({path:path.join(out,'touch-workbench.png')});
  const overflow=await touch.evaluate(()=>document.documentElement.scrollWidth>innerWidth+1); if(overflow)throw Error('Mobile horizontal overflow');results.touch=true;
  const tap=async name=>touch.getByRole('button',{name,exact:false}).tap();
  await tap('执行工序');await tap('通电复检');await tap('交付并结算');
  if((JSON.parse(await touch.evaluate(()=>window.render_game_to_text()))).game.records.repairs!==1)throw Error('Touch customer repair did not settle');
  // A functional but worn owned device can complete cosmetic refurbishment by touch.
  if(await touch.getByRole('button',{name:'关闭面板',exact:true}).count())await tap('关闭面板');
  await touch.locator('.bottom-nav button').nth(0).tap();await touch.locator('[data-item="item-2"]').tap();await tap('送到工作台翻新');await tap('连接检测仪');
  const ownBefore=(JSON.parse(await touch.evaluate(()=>window.render_game_to_text()))).game.items.find(i=>i.id==='item-2');
  await tap('清洁表面并恢复品相');await tap('通电复检');await tap('完成翻新并入库');
  const ownAfter=(JSON.parse(await touch.evaluate(()=>window.render_game_to_text()))).game.items.find(i=>i.id==='item-2');
  if(ownAfter.location!=='stock'||ownAfter.condition<=ownBefore.condition||ownAfter.cost<ownBefore.cost)throw Error('Owned cosmetic refurbishment failed');results.ownRefurbishment=true;
  await touchContext.close();
  if(errors.length)throw Error(`${errors.length} console errors`);
  await fs.writeFile(path.join(out,'result.json'),JSON.stringify({ok:true,...results,errors},null,2));console.log(JSON.stringify({ok:true,...results}));
}catch(error){await shot('failure').catch(()=>{});await fs.writeFile(path.join(out,'failure.json'),JSON.stringify({error:String(error),results,errors,state:await get().catch(()=>null)},null,2));throw error;}finally{await browser.close();}
