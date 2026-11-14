import {chromium} from 'playwright';
import fs from 'node:fs/promises';
import assert from 'node:assert/strict';
import {completeIntro} from './ui-onboarding.mjs';
const out=process.env.CYBER_EVIDENCE_DIR||'apps/cyber-shop/evidence/living-shop/room-fit';
await fs.mkdir(out,{recursive:true});
const browser=await chromium.launch({headless:true});
const context=await browser.newContext({viewport:{width:1440,height:960},hasTouch:true,isMobile:true});
const page=await context.newPage();page.setDefaultTimeout(8000);
const errors=[],measurements=[],problems=[];
page.on('pageerror',e=>errors.push(e.message));page.on('console',m=>{if(m.type()==='error')errors.push(m.text());});
const game=async()=>JSON.parse(await page.evaluate(()=>window.render_game_to_text())).game;
const tap=name=>page.getByRole('button',{name,exact:true}).tap();
try{
 await page.goto(process.env.CYBER_URL||'http://127.0.0.1:4176/cyber-shop/');await page.locator('#start-btn').tap();await completeIntro(page,true);
 for(const saved of [false,true]){
  if(saved){await page.locator('.cabinet-menu').getByRole('button',{name:'设置与存档',exact:true}).tap();await page.locator('input[type=file]').setInputFiles('apps/cyber-shop/evidence/living-shop/demand-journey/career-save.json');await page.waitForFunction(()=>JSON.parse(window.render_game_to_text()).panel==='');await page.locator('.toast').waitFor({state:'hidden'});}
  for(const [width,height] of [[1920,948],[1440,960],[960,650],[844,390],[740,360],[667,375]]){
   await page.setViewportSize({width,height});await page.waitForTimeout(160);
   const measured=await page.evaluate(()=>{
    const rect=e=>{const r=e.getBoundingClientRect();return {left:r.left,top:r.top,right:r.right,bottom:r.bottom,width:r.width,height:r.height};};
    const inside=(r,b)=>r.left>=b.left-1&&r.top>=b.top-1&&r.right<=b.right+1&&r.bottom<=b.bottom+1;
    const clock=document.querySelector('.wall-clock'),screen=rect(clock),viewport={left:0,top:0,right:innerWidth,bottom:innerHeight};
    const text=[...clock.children].filter(e=>getComputedStyle(e).display!=='none').map(e=>{const range=document.createRange();range.selectNodeContents(e);const r=rect(range);return {label:e.textContent,rect:r,fits:inside(r,screen)&&inside(r,viewport)};});
    const close=document.querySelector('.closing-switch'),range=document.createRange();range.selectNodeContents(close);const button=rect(close),label=rect(range),menu=rect(document.querySelector('.cabinet-menu'));
    const controls={button,label,fits:inside(label,button)&&inside(button,viewport),separated:button.top>=menu.bottom};
    const cells=['.warehouse-cell','.incoming-tray .surface-cell','.negotiation-table .surface-cell'].map(selector=>rect(document.querySelector(selector)));
    return {screen,text,controls,cells,overflow:document.documentElement.scrollWidth>innerWidth||document.documentElement.scrollHeight>innerHeight};
   });
   const tag=`${saved?'career':'new'}-${width}x${height}`;
   measurements.push({tag,day:(await game()).day,cash:(await game()).cash,...measured});
   if(measured.text.some(t=>!t.fits))problems.push(`${tag}: clipped television text`);
   if(!measured.controls.fits||!measured.controls.separated)problems.push(`${tag}: close-day button clipped or overlaps menu`);
   if(measured.overflow)problems.push(`${tag}: page overflow`);
   const side=measured.cells[0].width;assert(measured.cells.every(r=>Math.abs(r.width-side)<.1&&Math.abs(r.height-side)<.1));
   await page.screenshot({path:`${out}/${tag}.png`});
  }
 }
 await page.setViewportSize({width:844,height:390});await tap('声音开关');assert.equal(await page.getByRole('button',{name:'声音开关'}).getAttribute('aria-pressed'),'false');await tap('声音开关');
 await tap('操作指引');await page.locator('.book-reader').waitFor();await tap('合上手册 ↗');
 const day=(await game()).day;await tap('关店 / 日结 →');await tap('确认闭店');await tap('迎接新的一天 →');assert.equal((await game()).day,day+1);
 await page.reload();await tap('继续经营 ↗');assert.equal((await game()).day,day+1);
 await page.screenshot({path:`${out}/touch-next-day.png`});
 const result={ok:!problems.length&&!errors.length,measurements,problems,touchControls:true,closedAndReopened:true,saveRestored:true,errors};
 await fs.writeFile(`${out}/results.json`,JSON.stringify(result,null,2));console.log(JSON.stringify({ok:result.ok,problems,errors,viewports:measurements.length}));
 assert.deepEqual(problems,[]);assert.deepEqual(errors,[]);
}catch(e){await page.screenshot({path:`${out}/failure.png`});throw e;}finally{await browser.close();}
