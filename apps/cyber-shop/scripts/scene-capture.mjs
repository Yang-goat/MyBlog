import { chromium } from 'playwright';
const browser=await chromium.launch({headless:true});
const page=await browser.newPage({viewport:{width:1440,height:900}});
await page.goto('http://127.0.0.1:4175/cyber-shop/');
await page.locator('#start-btn').click();
await page.waitForTimeout(1600);
await page.screenshot({path:'apps/cyber-shop/evidence/living-shop/layers/full.png'});
await browser.close();
