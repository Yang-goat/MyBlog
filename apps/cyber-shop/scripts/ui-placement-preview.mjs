import { chromium } from 'playwright';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';

const out='apps/cyber-shop/evidence/placement-preview';
await fs.mkdir(out,{recursive:true});
const browser=await chromium.launch({headless:true});
const page=await browser.newPage({viewport:{width:1440,height:960}});
page.setDefaultTimeout(7000);
const errors=[];
page.on('pageerror',e=>errors.push(e.message));
page.on('console',m=>{if(m.type()==='error')errors.push(m.text());});
const game=async()=>JSON.parse(await page.evaluate(()=>window.render_game_to_text())).game;
const click=name=>page.getByRole('button',{name,exact:true}).click();
const point=async(zone,x,y)=>{const b=await page.locator(zone==='warehouse'?'.warehouse-grid':'.negotiation-table .surface-grid').boundingBox();return {x:b.x+(x+.5)*b.width/24,y:b.y+(y+.5)*b.height/(zone==='warehouse'?6:3)};};
const move=async(zone,x,y)=>{const p=await point(zone,x,y);await page.mouse.move(p.x,p.y,{steps:12});};
const start=async(locator)=>{const b=await locator.boundingBox();await page.mouse.move(b.x+b.width/2,b.y+b.height/2);await page.mouse.down();};
const preview=async(zone,valid,width,height)=>{
 const p=page.locator(`${zone==='warehouse'?'.warehouse-grid':'.negotiation-table'} .placement-preview`);
 await p.waitFor({state:'visible'});
 assert.equal(await p.evaluate(el=>el.classList.contains('invalid')),!valid);
 const style=await p.evaluate(el=>{const s=getComputedStyle(el);return {column:s.gridColumnEnd,row:s.gridRowEnd,border:s.borderTopColor,background:s.backgroundColor};});
 if(width)assert.equal(style.column,`span ${width}`);
 if(height)assert.equal(style.row,`span ${height}`);
 return style;
};
const shot=async name=>{await page.waitForTimeout(150);await page.screenshot({path:`${out}/${name}.png`});};
try {
 await page.goto('http://127.0.0.1:4175/cyber-shop/');await page.locator('#start-btn').click();await page.waitForSelector('.warehouse-item');
 const initial=await game(),bottle=initial.items[0].id,chip=initial.items[1].id;
 // A held 1x3 bottle previews the same green footprint in both regions.
 await start(page.locator(`[data-item="${bottle}"]`));await move('warehouse',8,1);
 const warehouseGreen=await preview('warehouse',true,1,3);
 await move('trade',6,0);const tradeGreen=await preview('trade',true,1,3);
 assert.equal(warehouseGreen.border,tradeGreen.border);assert.equal(warehouseGreen.background,tradeGreen.background);
 await shot('01-green-counter');
 // The same pointer is out of bounds at the bottom until the bottle is rotated.
 await move('trade',10,2);const tradeRed=await preview('trade',false,1,1);await shot('02-red-boundary');
 await page.keyboard.press('e');await preview('trade',true,3,1);await shot('03-rotated-green');
 await page.mouse.up();assert.equal((await game()).items.find(i=>i.id===bottle).location,'counter');
 assert.deepEqual(await page.locator(`.purchased-item[data-item="${bottle}"]`).evaluate(el=>({column:el.style.gridColumn,row:el.style.gridRow})),{column:'11 / span 3',row:'3 / span 1'});
 assert.equal(await page.locator('.placement-preview').count(),0);
 // An occupied cell is red and rejects the actual drop without moving inventory.
 await start(page.locator(`[data-item="${chip}"]`));await move('trade',10,2);await preview('trade',false,1,1);await shot('04-red-overlap');
 await page.mouse.up();assert.equal((await game()).items.find(i=>i.id===chip).location,'stock');
 // Click-selection also previews and can be cancelled without leaving a ghost.
 await move('trade',8,0);await preview('trade',true,1,1);await page.mouse.click((await point('trade',8,0)).x,(await point('trade',8,0)).y);
 assert.equal((await game()).items.find(i=>i.id===chip).location,'counter');
 await page.locator(`[data-item="${bottle}"]`).click();await move('trade',10,2);await preview('trade',true,3,1);
 await move('trade',23,2);await preview('trade',false,1,1);await page.keyboard.press('Escape');assert.equal(await page.locator('.placement-preview').count(),0);
 // NPC goods use the same preview, counting the owned goods already on the table.
 await click('绿色叫号按钮');await page.keyboard.press('Space');await page.keyboard.press('Space');
 await start(page.locator('.incoming-item').first());await move('trade',8,0);await preview('trade',false);
 await move('warehouse',10,0);const warehouseRed=await preview('warehouse',false);
 assert.equal(warehouseRed.border,tradeRed.border);assert.equal(warehouseRed.background,tradeRed.background);
 await move('trade',0,0);await preview('trade',true);await page.mouse.up();await page.waitForSelector('.trade-dialog');
 assert.equal(await page.locator('.placement-preview').count(),0);
 assert.deepEqual(errors,[]);
 await fs.writeFile(`${out}/results.json`,JSON.stringify({sameWarehouseColors:true,greenEmpty:true,redOverlap:true,redBoundary:true,rotationUpdates:true,clickSelection:true,cancelClears:true,selfOverlapAllowed:true,npcAndOwnedCollision:true,actualDropsMatch:true,errors},null,2));
 console.log('Warehouse / counter placement previews: PASS');
}catch(e){await page.screenshot({path:`${out}/failure.png`});throw e;}finally{await browser.close();}
