import {chromium} from 'playwright';
import fs from 'node:fs/promises';
import assert from 'node:assert/strict';
import {completeIntro} from './ui-onboarding.mjs';
const out=process.env.CYBER_EVIDENCE_DIR||'apps/cyber-shop/evidence/living-shop/factions-touch';
await fs.mkdir(out,{recursive:true});
const browser=await chromium.launch({headless:true});
const context=await browser.newContext({viewport:{width:844,height:390},hasTouch:true,isMobile:true});
const page=await context.newPage();const errors=[];page.on('pageerror',e=>errors.push(e.message));
page.on('console',m=>{if(m.type()==='error')errors.push(m.text());});
const state=async()=>JSON.parse(await page.evaluate(()=>window.render_game_to_text()));
const tap=name=>page.getByRole('button',{name,exact:true}).tap();
const panel=async name=>page.locator('.cabinet-menu').getByRole('button',{name,exact:true}).tap();
try{
 await page.goto(process.env.CYBER_URL||'http://127.0.0.1:4176/cyber-shop/');await tap('推开店门 →');await completeIntro(page,true);
 await panel('设置与存档');await page.locator('input[type=file]').setInputFiles('apps/cyber-shop/evidence/living-shop/factions-career/career-save.json');await page.waitForFunction(()=>JSON.parse(window.render_game_to_text()).panel==='');
 await panel('街区手记');
 for(const f of (await state()).game.factions){await page.locator(`[data-faction="${f.id}"]`).tap();await page.locator(`[data-faction-profile="${f.id}"]`).waitFor();}
 await page.locator('[data-faction="freewave"]').tap();assert(await page.locator('.faction-appoint').isEnabled());await page.locator('.faction-appoint').tap();assert.equal((await state()).game.factionAppointment,'freewave');
 await page.reload();await tap('继续经营 ↗');assert.equal((await state()).game.factionAppointment,'freewave');
 await panel('街区手记');await page.locator('[data-faction="freewave"]').tap();await page.getByRole('button',{name:'取消预约',exact:true}).tap();assert.equal((await state()).game.factionAppointment,null);
 await page.locator('.faction-appoint').scrollIntoViewIfNeeded();await page.screenshot({path:`${out}/contact-touch.png`});await tap('关闭面板');
 await page.locator('.warehouse-tools').getByRole('button',{name:'翻开店长手册',exact:true}).tap();await page.getByRole('button',{name:'街坊与成长',exact:false}).tap();await page.waitForTimeout(700);
 assert((await page.locator('.left-leaf').innerText()).includes('关系 6'));await page.locator('.right-leaf .book-step').last().scrollIntoViewIfNeeded();await page.screenshot({path:`${out}/handbook-touch.png`});await tap('合上手册 ↗');
 await page.setViewportSize({width:1440,height:960});await page.locator('.warehouse-tools').getByRole('button',{name:'翻开店长手册',exact:true}).tap();await page.getByRole('button',{name:'街坊与成长',exact:false}).tap();await page.waitForTimeout(700);await page.screenshot({path:`${out}/handbook-desktop.png`});
 assert.deepEqual(errors,[]);await fs.writeFile(`${out}/results.json`,JSON.stringify({ok:true,touch:true,importedFrom:'factions-career/career-save.json',appointmentSavedAndCancelled:true,handbookReadable:true,errors},null,2));console.log('FACTION_TOUCH_PASS');
}catch(e){await page.screenshot({path:`${out}/failure.png`});await fs.writeFile(`${out}/failure.json`,JSON.stringify({error:String(e),state:await state(),errors},null,2));throw e;}finally{await browser.close();}
