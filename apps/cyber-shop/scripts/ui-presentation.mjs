import {completeIntro} from './ui-onboarding.mjs';
import { chromium } from 'playwright';
import fs from 'node:fs/promises';
import assert from 'node:assert/strict';
const out=process.env.CYBER_EVIDENCE_DIR||'apps/cyber-shop/evidence/living-shop/presentation';await fs.mkdir(out,{recursive:true});
const browser=await chromium.launch({headless:true});const page=await browser.newPage({viewport:{width:1440,height:960}});const errors=[];
page.on('pageerror',e=>errors.push(e.message));
const read=async()=>JSON.parse(await page.evaluate(()=>window.render_game_to_text()));
const click=name=>page.getByRole('button',{name,exact:true}).click();
const hash=async()=>page.locator('canvas').evaluate(async canvas=>{const pixels=canvas.getContext('2d').getImageData(0,0,canvas.width,canvas.height).data;return [...new Uint8Array(await crypto.subtle.digest('SHA-256',pixels))].map(n=>n.toString(16).padStart(2,'0')).join('');});
try{
 await page.goto(process.env.CYBER_URL||'http://127.0.0.1:4175/cyber-shop/');assert.equal((await read()).presentation.audio.state,'locked');await page.locator('#start-btn').click();await completeIntro(page);await page.waitForSelector('canvas');await page.waitForTimeout(800);
 assert.equal((await read()).presentation.audio.state,'running');assert((await read()).presentation.audio.ambienceLevel>0);
 await click('设置与存档');await page.getByLabel('减少动态效果',{exact:true}).check();await page.getByLabel('雨声与街区环境音',{exact:true}).uncheck();await page.getByLabel('静音',{exact:true}).check();
 const slider=page.getByLabel(/音量/);await slider.focus();await page.keyboard.press('Home');for(let n=0;n<8;n++)await page.keyboard.press('ArrowRight');
 assert.equal((await read()).presentation.volume,.4);assert.equal((await read()).presentation.audio.ambienceLevel,0);
 await page.reload();await page.getByRole('button',{name:/继续经营/}).click();await page.waitForSelector('canvas');await page.waitForTimeout(700);const prefs=(await read()).presentation;
 assert(prefs.reducedMotion&&prefs.muted&&!prefs.ambience);assert.equal(prefs.volume,.4);
 const frozen=await hash();await page.evaluate(()=>window.advanceTime(1500));assert.equal(await hash(),frozen,'Reduced motion keeps canvas stable');
 await click('设置与存档');await page.getByLabel('减少动态效果',{exact:true}).uncheck();await page.getByLabel('雨声与街区环境音',{exact:true}).check();await page.getByLabel('静音',{exact:true}).uncheck();await click('关闭面板');
 assert((await read()).presentation.audio.ambienceLevel>0);
 const before=await read(),imageBefore=await hash();const renderMs=await page.evaluate(async()=>{const t=performance.now();for(let i=0;i<30;i++)await window.advanceTime(33.33);return (performance.now()-t)/30;});
 assert.notEqual(await hash(),imageBefore,'Street presentation moves');assert.deepEqual((await read()).game,before.game,'Time cannot advance economy');
 await page.keyboard.press('f');assert(await page.evaluate(()=>!!document.fullscreenElement));await page.keyboard.press('Escape');
 await page.screenshot({path:`${out}/layered-shop.png`});assert.deepEqual(errors,[]);
 await fs.writeFile(`${out}/results.json`,JSON.stringify({ok:true,preferencesPersist:true,mutingAndAmbience:true,reducedMotion:true,presentationDoesNotAdvanceEconomy:true,fullscreen:true,renderMsPerFrame:renderMs,errors},null,2));console.log(JSON.stringify({ok:true,renderMsPerFrame:renderMs}));
}catch(e){await page.screenshot({path:`${out}/failure.png`});throw e;}finally{await browser.close();}
