/** Real DOM playthrough: no imported engine, state writes, debug actions or victory flags. */
import { chromium } from 'playwright';
import fs from 'node:fs/promises';
import path from 'node:path';

const out = path.resolve(process.env.CYBER_EVIDENCE_DIR || 'apps/cyber-shop/evidence/ui-playthrough');
await fs.mkdir(out, { recursive: true });
const browser = await chromium.launch({ headless: true, args: ['--disable-background-timer-throttling'] });
const context = await browser.newContext({ viewport: { width: 1440, height: 1000 }, acceptDownloads: true });
const page = await context.newPage();
page.setDefaultTimeout(8000);
const errors = [], missing = [], journal = [], categories = new Set(), purchasedCategories = new Set();
let antiqueClientRepairs = 0;
page.on('pageerror', error => errors.push(error.message));
page.on('console', message => { if (message.type() === 'error') errors.push(message.text()); });
page.on('response', response => { if (response.status() >= 400) missing.push({ url: response.url(), status: response.status() }); });
const get = async () => JSON.parse(await page.evaluate(() => window.render_game_to_text()));
const game = async () => (await get()).game;
const click = async (name, exact = false) => { await page.getByRole('button', { name, exact }).click(); };
const close = async () => { if (await page.getByRole('button', { name: '关闭面板', exact: true }).count()) await click('关闭面板', true); };
const panel = async index => { await close(); await page.locator('.bottom-nav button').nth(index).click(); };
const shot = async name => { await page.waitForTimeout(300); await page.locator('img').evaluateAll(images => Promise.all(images.filter(i => i.loading !== 'lazy').map(i => i.decode().catch(() => {})))); await page.screenshot({ path: path.join(out, `${name}.png`), fullPage: !name.startsWith('mobile') }); };
const pathSkills = ['precision-1', 'precision-2', 'precision-3', 'workshop-1', 'workshop-2', 'workshop-3', 'precision-4'];
const phaseSnapshots = new Set();
let actions = 0;
async function repairOrders() {
  await close();
  for (let n = 0; n < 12; n++) {
    let s = await game(); if (!s.orders.length || s.hours < .5) break;
    await page.locator('.location-actions button').nth(2).click();
    await page.locator('.list-row').first().click();
    const oid = (await get()).selectedOrder;
    for (let step = 0; step < 15; step++) {
      s = await game(); const order = s.orders.find(o => o.id === oid); if (!order) break;
      const item = s.items.find(i => i.id === order.itemId);
      const previous = JSON.stringify({ hours: s.hours, order, item });
      if (!order.diagnosed) await click('连接检测仪');
      else if (item.faults?.length) {
        const fault = item.faults[0];
        await page.getByLabel('维修工序', { exact: true }).selectOption(fault.operation);
        await page.getByLabel('维修模块', { exact: true }).selectOption(fault.module);
        if (fault.operation === 'calibrate') await page.getByLabel('精确校准参数', { exact: true }).fill(String(fault.target));
        const preserve = page.getByLabel('修整原件', { exact: false }); if (await preserve.count()) await preserve.check();
        await click('执行工序', true);
      } else if (!order.completedOps) await click('清洁表面并恢复品相', true);
      else if (!order.verified) await click('通电复检', true);
      else {
        await click(/交付并结算|提交考核|完成翻新并入库/);
        if (order.kind === 'client' && item.category === 'antique' && !(await game()).orders.some(o => o.id === oid)) antiqueClientRepairs++;
        break;
      }
      actions++;
      const next = await game();
      if (JSON.stringify({ hours: next.hours, order: next.orders.find(o => o.id === oid), item: next.items.find(i => i.id === order.itemId) }) === previous) { await close(); return; }
      if (!phaseSnapshots.has(`repair-${s.chapter}`)) { phaseSnapshots.add(`repair-${s.chapter}`); await shot(`workbench-chapter-${s.chapter}`); }
    }
    await close();
    const now = await game(); if (now.orders.some(o => o.id === oid)) return;
  }
  await close();
}
async function learn() {
  const s = await game(); if (!s.points) return;
  await panel(1); await click('修复师专精', true);
  for (const id of pathSkills) {
    const current = await game(); if (current.skills.includes(id)) continue;
    if (current.points < (id.endsWith('-4') ? 2 : 1)) break;
    await page.locator(`[data-skill="${id}"]`).click(); actions++;
  }
  await close();
}
async function claims() {
  await panel(4);
  for (const row of await page.locator('.quest-story').all()) {
    for (let n = 0; n < 3; n++) {
      const button = row.getByRole('button', { name: '核对进展并交付' }); if (!await button.count()) break;
      const before = JSON.stringify((await game()).questStages); await button.click(); actions++;
      if (JSON.stringify((await game()).questStages) === before) break;
    }
  }
  const s = await game(); if (!s.eventResolved) {
    const buttons = page.locator('.event-story .vertical-actions button');
    if (await buttons.count()) { await buttons.last().click(); actions++; }
  }
  await close();
}
async function certificates() {
  for (const cert of [{id:'industrial',cases:5,chapter:2},{id:'neural',cases:14,chapter:3},{id:'antique',cases:28,chapter:4}]) {
    const s = await game(); if (s.certificates.includes(cert.id) || s.records.repairs < cert.cases || s.chapter < cert.chapter || (cert.id === 'antique' && !s.endless) || s.orders.some(o => o.kind === 'exam')) continue;
    await panel(1); await click('证书与许可', true);
    const row = page.locator(`[data-certificate="${cert.id}"]`);
    if (!s.trained.includes(cert.id)) await row.getByRole('button', { name: '报名培训' }).click();
    if ((await game()).trained.includes(cert.id)) { await row.getByRole('button', { name: '进入实际考核 / 重试' }).click(); actions += 2; }
    await close(); await repairOrders();
  }
}
async function collectStarter() {
  const s = await game(); if (s.items.some(i => i.location === 'display') || s.cash < 650 || s.hours < 1) return;
  await panel(2); await page.locator('[data-equipment="serial-terminal"] button').click(); await close();
  await panel(0);
  for (const item of s.items.filter(i => i.owner === 'player')) {
    await page.locator(`[data-item="${item.id}"]`).click(); await click('查验来源', true);
    const observed = (await game()).items.find(i => i.id === item.id);
    if (observed?.authentic) { await click('放进收藏展示柜', true); break; }
  }
  await close();
}
async function finalOrder() {
  const s = await game(); if (s.finalComplete || s.chapter < 4 || !s.skills.includes('precision-4') || s.orders.some(o => o.kind === 'final')) return;
  await panel(4); await click('接取下一阶段最终委托', true); await close(); await repairOrders();
}
async function day() {
  let s = await game(); if (s.phase === 'closed') await click('迎接新的一天');
  await learn(); await claims(); await certificates(); await repairOrders(); await finalOrder();
  s = await game();
  if (s.day === 1) await collectStarter();
  if (s.chapter >= 3 && !s.licenses.length) { await panel(1); await click('证书与许可', true); await click(/申请通用交易许可/); await close(); }
  for (let n = 0; n < 7; n++) {
    s = await game(); const v = s.visitor; if (!v) break;
    if (!v.resolved) {
      if (v.kind === 'repair' && s.hours >= 3) { await click('接下维修'); await close(); await repairOrders(); }
      else if (v.kind === 'seller' && s.cash > v.quote + 600 && s.stockUsage < s.capacity - 5) {
        if (s.hours >= .5) await click('基础检查', true);
        await click('收下这件货');
        if ((await game()).visitor.resolved) purchasedCategories.add(v.category);
        if (!(await game()).visitor.resolved) await click('婉拒', true);
      } else if (v.kind === 'buyer') {
        const options = await page.getByLabel('选择售出物品', { exact: true }).locator('option').all();
        if (options.length > 1) { await page.getByLabel('选择售出物品', { exact: true }).selectOption(await options[1].getAttribute('value')); await click('成交并交货'); if ((await game()).visitor.resolved) categories.add(v.category); }
        if (!(await game()).visitor.resolved) await click('婉拒', true);
      } else await click('婉拒', true);
      actions++;
    }
    if ((await game()).visitorIndex < 6) await click('迎接下一位');
  }
  await learn(); await claims(); await finalOrder();
  s = await game();
  if (!phaseSnapshots.has(`chapter-${s.chapter}`)) { phaseSnapshots.add(`chapter-${s.chapter}`); await shot(`counter-chapter-${s.chapter}`); }
  if (s.finalComplete && !s.victory && s.cash >= 12000 + s.debt) { await panel(4); await click('支付并买下店铺', true); }
  else { await close(); await click('闭店结算'); await click('确认闭店', true); }
  s = await game(); const row = { day:s.day,chapter:s.chapter,cash:s.cash,hours:s.hours,repairs:s.records.repairs,trades:s.records.trades,level:s.level,skills:s.skills,certificates:s.certificates,phase:s.phase };
  journal.push(row); console.log(JSON.stringify(row));
}
const startedAt = Date.now();
try {
  await page.goto(process.env.CYBER_URL || 'http://127.0.0.1:4176/cyber-shop/');
  await page.getByText('固定种子开局', { exact: true }).click();
  await page.getByLabel('街区种子', { exact: false }).fill('20261105');
  await shot('title'); await click('推开店门'); await page.waitForSelector('canvas');
  for (let n = 0; n < 45 && !(await game()).victory; n++) await day();
  const victory = await game(); if (!victory.victory) throw new Error('Normal UI failed to reach victory within 45 business days.');
  await shot('victory'); await click('结束并保存结局', true); if ((await game()).phase !== 'ended') throw new Error('Ending not saved');
  await page.reload(); await click('继续经营'); if ((await game()).phase !== 'ended') throw new Error('Ending not restored');
  await click('继续经营');
  for (let n = 0; n < 10; n++) await day();
  const endless = await game(); if (!endless.endless || !endless.certificates.includes('antique') || endless.level <= victory.level) throw new Error('Endless certificate/growth failed');
  await panel(3); await shot('collection'); await close();
  await page.getByRole('button',{name:'设置与存档',exact:true}).click();
  const [download] = await Promise.all([page.waitForEvent('download'), click('导出当前存档',true)]);
  const savePath=path.join(out,'ui-save.json'); await download.saveAs(savePath);
  await page.locator('input[type=file]').setInputFiles(savePath);
  const restored=await game(); if (restored.cash!==endless.cash || restored.records.repairs!==endless.records.repairs) throw new Error('Export/import duplicated settlement');
  const beforeTime = await page.evaluate(()=>window.render_game_to_text()); await page.evaluate(()=>window.advanceTime(2000));
  if (await page.evaluate(()=>window.render_game_to_text())!==beforeTime) throw new Error('Presentation time mutated economy');
  await page.setViewportSize({width:844,height:390}); await shot('mobile-landscape');
  await panel(1); await shot('mobile-skills'); await close();
  await page.setViewportSize({width:1440,height:1000});
  await page.getByRole('button',{name:'设置与存档',exact:true}).click(); await click('切换全屏 · F',true);
  const fullscreen=await page.evaluate(()=>!!document.fullscreenElement); await page.keyboard.press('Escape'); await close();
  if (purchasedCategories.size !== 6 || categories.size !== 6) throw new Error('Six-category purchase and sale coverage is incomplete');
  if (!antiqueClientRepairs) throw new Error('No antique customer repair completed through the UI');
  if (!fullscreen) throw new Error('Fullscreen did not activate');
  await fs.writeFile(path.join(out,'result.json'), JSON.stringify({ok:errors.length === 0 && missing.length === 0,elapsedSeconds:(Date.now()-startedAt)/1000,actions,winDay:victory.day,winLevel:victory.level,endlessDay:endless.day,endlessLevel:endless.level,purchasedCategories:[...purchasedCategories],tradeCategories:[...categories],antiqueClientRepairs,fullscreen,errors,missing,journal},null,2));
  if (errors.length || missing.length) throw new Error(`Gameplay passed but resources/console failed: ${errors.length} errors, ${missing.length} resources`);
  console.log('UI_PLAYTHROUGH_PASS');
} catch(error) {
  await shot('failure').catch(()=>{});
  await fs.writeFile(path.join(out,'failure.json'),JSON.stringify({error:String(error),elapsedSeconds:(Date.now()-startedAt)/1000,state:await get().catch(()=>null),errors,missing,journal},null,2));
  throw error;
} finally { await browser.close(); }
