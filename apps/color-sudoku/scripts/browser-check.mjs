// Run against a built, locally served full site. Optional env: PLAYWRIGHT_MODULE (file URL),
// PLAYWRIGHT_CHROMIUM_EXECUTABLE. Browser tooling is not an application dependency.
import assert from 'node:assert/strict';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { publishEdition } from './edition.ts';
import { watchHomeRequests, separateHomeWarnings } from './home-requests.mjs';

const { chromium } = await import(process.env.PLAYWRIGHT_MODULE || 'playwright');
const base = new URL(process.env.SITE_ORIGIN || 'http://127.0.0.1:4178/');
assert.ok(['localhost', '127.0.0.1', '[::1]'].includes(base.hostname), 'Local acceptance only');
const dir = fileURLToPath(new URL('../output/playwright/', import.meta.url));
await mkdir(dir, { recursive: true });
const edition = publishEdition();
const witnesses = JSON.parse(await readFile(new URL('../evidence/edition-proofs.json', import.meta.url), 'utf8'));
const errors = [], outside = new Set(), checks = [], consoleIssues = [], homeFailures = [], inspecting = [];
const browser = await chromium.launch({ executablePath: process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE || undefined, headless: true });
const state = page => page.evaluate(() => JSON.parse(window.render_game_to_text()));
const action = (p, value) => p.locator(`[data-action="${value}"]:visible`).first();
const cell = (p, i) => p.locator(`[data-cell="${i}"]`);
const image = (p, name) => p.screenshot({ path: path.join(dir, `${name}.png`), animations: 'disabled' });
const check = text => { checks.push(text); console.log('PASS', text); };
function monitor(page) {
  page.on('request', r => {
    if (/Java_daily_sudoku|\.(?:zip|jar|class)(?:$|[?#])/i.test(r.url())) errors.push('Forbidden legacy dependency: ' + r.url());
    if (r.isNavigationRequest() || !/^https?:/.test(r.url())) return;
    const u = new URL(r.url());
    if (page.url() === new URL('/color-sudoku/', base).href && (u.origin !== base.origin || !u.pathname.startsWith('/color-sudoku/'))) errors.push('Game requests resource outside its static directory: ' + r.url());
  });
  page.on('pageerror', e => consoleIssues.push({ text: `${page.url()}: ${e.stack || e.message}` }));
  page.on('requestfailed', r => { const u=new URL(r.url()), why=r.failure()?.errorText; if(u.origin===base.origin && why!=='net::ERR_ABORTED') errors.push(`Failed local ${r.resourceType()} request: ${u.pathname} (${why}) while on ${page.url()}`); });
  page.on('response', r => { const u = new URL(r.url()); if (u.origin === base.origin && r.status() >= 400) errors.push(`${r.status()} ${u.pathname}`); });
  page.on('console', m => {
    if (m.type() !== 'error') return;
    const where = m.location().url || page.url();
    if (!where.startsWith(base.origin)) { outside.add(where); return; }
    const issue = { text: `${where}: ${m.text()}`, resource: null }; consoleIssues.push(issue);
    if (m.text() === 'Event' && m.args()[0]) inspecting.push(m.args()[0].evaluate(event => event.target?.src ?? null).then(url => { issue.resource = url; }).catch(() => {}));
  });
}
async function mark(page, at, value, keyboard = false) {
  const tool = value ? 'fill' : 'empty';
  if ((await state(page)).tool !== tool) await page.locator(`[data-tool="${tool}"]`).click();
  if (keyboard) { await cell(page, at).focus(); await page.keyboard.press('Enter'); }
  else if (page.viewportSize()?.width <= 475 && (await state(page)).size === 10) {
    // Use the same two position controls a child can use, not coordinate injection into a scrolled grid.
    await page.locator('[data-locate="row"]').selectOption(String(Math.floor(at / 10)));
    await page.locator('[data-locate="column"]').selectOption(String(at % 10));
    await cell(page, at).tap();
  } else await cell(page, at).click();
}
async function replay(page, index, { mistakes = 0, afterBatch } = {}) {
  const proof = edition[index].source === 'fallback' ? witnesses[index].reserve.proof : witnesses[index].proof;
  let n = 0;
  for (const [batch, step] of proof.steps.entries()) {
    for (const d of step.forced) {
      const before = await state(page);
      if (before.status === 'lost') return before;
      if (before.marks[d.at] !== 'unknown') continue;
      const wrong = n++ < mistakes;
      await mark(page, d.at, wrong ? 1 - d.value : d.value);
      const s = await state(page);
      assert.equal(s.marks[d.at], (wrong ? 'miss-' : '') + (d.value ? 'filled' : 'empty'));
      assert.equal(s.chances, 3 - Math.min(n, mistakes));
      if (s.status === 'lost') return s;
    }
    if (afterBatch) await afterBatch(batch, await state(page));
  }
  return state(page);
}
async function pick(page, id) {
  await action(page, 'index').click();
  await page.locator(`[data-index-book="${Math.floor((id - 1) / 4)}"]`).click();
  await page.locator(`[data-level="${id}"]`).click();
  assert.equal((await state(page)).id, id);
}
async function assertStickerFits(page, mustFitViewport = false) {
  const positions = await page.locator('.puzzle-board').evaluate(board => {
    const area = node => { const b = node.getBoundingClientRect(); return [b.left,b.top,b.right,b.bottom]; };
    const marks = board.querySelectorAll('[data-cell]');
    return { first:area(marks[0]), last:area(marks[marks.length - 1]), overlay:area(board.querySelector('.sticker-overlay')), scroll:area(board.querySelector('[data-board-scroll]')) };
  });
  const {first,last,overlay,scroll} = positions;
  assert.ok([first[0]-overlay[0],first[1]-overlay[1],last[2]-overlay[2],last[3]-overlay[3]].every(n => Math.abs(n) <= 1.6), `Misaligned revealed sticker: ${JSON.stringify(positions)}`);
  if (mustFitViewport) assert.ok(overlay[0] >= scroll[0]-1 && overlay[1] >= scroll[1]-1 && overlay[2] <= scroll[2]+1 && overlay[3] <= scroll[3]+1, `Clipped mobile sticker: ${JSON.stringify(positions)}`);
}
const full = process.argv.includes('--full');
try {
  const context = await browser.newContext({ viewport: { width: 1440, height: 810 }, deviceScaleFactor: 1 });
  const p = await context.newPage(); monitor(p);
  if (full) {
    await watchHomeRequests(p,base.href,homeFailures);
    await p.goto(base.href, { waitUntil: 'networkidle' });
    // A real reply, rather than leaving the homepage during its first six-megabyte worker fetch.
    const builtWorker = await p.evaluate(() => performance.getEntriesByType('resource').map(e => e.name).find(n => /\/slimsearch\.worker\.[^/]+\.js$/.test(n)));
    const searchFound = await p.evaluate(url => new Promise((resolve, reject) => {
      const worker = new Worker(url); const timeout = setTimeout(() => {worker.terminate();reject(Error('Search worker timed out'));},10000);
      worker.onerror = e => {clearTimeout(timeout);worker.terminate();reject(Error(e.message));};
      worker.onmessage = ({data}) => {if(data[0] === 'search' && data[1] === 1){clearTimeout(timeout);worker.terminate();resolve(data[2].some(entry => entry.title.includes('Zotero')));}};
      worker.postMessage({type:'search',id:1,query:'Zotero',locale:'/',options:{prefix:true}});
    }), builtWorker || new URL('slimsearch.worker.local.js',base).href);
    assert.equal(searchFound,true);
    await p.locator('a[href="/ai-portfolio/"]:visible').first().click();
    await p.waitForURL('**/ai-portfolio/');
    // VuePress updates history before its async page component mounts on in-site navigation.
    await p.locator('#works-title').waitFor({ state: 'visible' }); await p.waitForLoadState('networkidle');
    assert.equal(await p.locator('.project-card').count(), 3);
    const card = p.locator('.project-card[href="/color-sudoku/"]');
    const cover = card.locator('img'); await card.scrollIntoViewIfNeeded();
    await cover.evaluate(img => img.decode());
    assert.deepEqual(await cover.evaluate(img => [img.naturalWidth, img.naturalHeight]), [1200,675]);
    await image(p, 'portfolio'); await card.click(); await p.waitForURL('**/color-sudoku/');
    check('首页 → AI 作品集（三张卡、1200×675 封面成功解码）→ 涂色数独');
  } else await p.goto(new URL('/color-sudoku/', base).href);
  await p.waitForFunction(() => typeof window.render_game_to_text === 'function');
  assert.equal((await state(p)).page, 'tutorial'); assert.equal((await state(p)).sound, false);
  await image(p, 'tutorial');
  await action(p,'album').click(); await action(p,'back').click(); assert.equal((await state(p)).page,'tutorial');
  // First make an incorrect practice row and edit it; this must not mark or charge a real round.
  for (const i of [0,1,2,3,4]) await p.locator(`[data-practice-cell="${i}"]`).click();
  assert.equal((await state(p)).chances, 3);
  await p.locator('[data-tool="empty"]').click();
  for (const i of [2,4]) await p.locator(`[data-practice-cell="${i}"]`).click();
  await action(p, 'finishPractice').click();
  let s = await state(p);
  assert.equal(s.page, 'play'); assert.ok(s.marks.every(c => c === 'unknown'));
  for (const { puzzle } of edition) assert.ok(!(await p.locator('body').innerText()).includes(puzzle.sticker.name), 'unearned name exposed');
  assert.equal(await p.locator('[data-sticker]').count(), 0);
  await cell(p, 0).focus(); await p.keyboard.press('ArrowRight');
  assert.equal(await p.evaluate(() => document.activeElement.dataset.cell), '1');
  await p.keyboard.press('2'); assert.equal((await state(p)).tool, 'empty');
  await p.keyboard.press('1'); assert.equal((await state(p)).tool, 'fill');
  await action(p,'sound').click(); assert.equal((await state(p)).sound,true); await action(p,'sound').click();
  const firstMove = witnesses[0].proof.steps[0].forced[0]; await mark(p,firstMove.at,firstMove.value,true);
  const keyed = await state(p); assert.notEqual(keyed.marks[firstMove.at],'unknown'); assert.equal(keyed.chances,3);
  await action(p,'restart').click(); await p.keyboard.press('Escape'); assert.deepEqual(await state(p),keyed);
  check('五格 2 1 亲手涂／空、可改、不扣机会；正式空盘不泄题；键盘导航/落笔，开关音效，取消重开仍保留原盘');
  let captured = false, restored = false;
  s = await replay(p, 0, { afterBatch: async (_, mid) => {
    const ink = mid.marks.filter(c => c === 'filled').length;
    if (!captured && ink >= 5 && mid.status === 'playing') {
      await p.mouse.move(8, 8); await p.evaluate(() => window.scrollTo(0,0)); await image(p, 'playing'); captured = true;
    }
    if (!restored && mid.status === 'playing') {
      await p.reload(); await p.waitForFunction(() => typeof window.render_game_to_text === 'function');
      assert.deepEqual(await state(p), mid);
      await action(p, 'practice').click(); await action(p,'skipPractice').click(); assert.deepEqual(await state(p), mid);
      restored = true;
    }
  } });
  assert.ok(captured && restored); assert.equal(s.status, 'won'); assert.equal(s.chances, 3); assert.equal(s.level, 2); assert.equal(s.coins, 100);
  const earned = edition[0].puzzle.sticker;
  if (await action(p, 'skipReveal').isVisible()) await action(p,'skipReveal').click();
  const pixels = await p.locator('.sticker-overlay > [data-sticker] [data-pixel]').evaluateAll(nodes => nodes.map(n => [Number(n.dataset.pixel), n.getAttribute('fill')]));
  assert.deepEqual(pixels, earned.colors.flatMap((color, i) => color ? [[i, color]] : []));
  await image(p, 'won'); check('从公开线索按证明点击、刷新与重开教学不换盘；揭晓像素/配色与落子逐格相同');
  await action(p, 'winAlbum').click(); await p.locator('[data-entry="1"]').click();
  assert.ok((await p.locator('dialog[open]').innerText()).includes(earned.story));
  await action(p, 'close').click();
  const contained = await p.locator('[data-entry="1"] .slot-image').evaluate(el => { const a=el.getBoundingClientRect(), b=el.querySelector('svg').getBoundingClientRect(); return b.top>=a.top && b.bottom<=a.bottom && b.left>=a.left && b.right<=a.right; });
  assert.ok(contained, 'Album image overlaps the story label'); await image(p, 'album');
  if (full) {
    await p.getByRole('link', { name: '返回 AI 作品集' }).click(); await p.waitForURL('**/ai-portfolio/'); await p.waitForLoadState('networkidle');
    for (const [slug, text] of [['hex-mahjong','海克斯麻将'], ['cyber-shop','赛博杂货铺']]) {
      await p.locator(`.project-card[href="/${slug}/"]`).click(); await p.waitForURL(`**/${slug}/`);
      await p.waitForFunction(() => (document.querySelector('#app')?.children.length ?? 0) > 0);
      assert.ok((await p.title()).includes(text)); await p.waitForLoadState('networkidle');
      await p.goBack({ waitUntil: 'networkidle' }); await p.waitForURL('**/ai-portfolio/');
    }
    await p.locator('.project-card[href="/color-sudoku/"]').click(); await p.waitForFunction(() => typeof window.render_game_to_text === 'function');
    check('解出贴纸 → 图鉴故事 → 返回作品集；两张旧卡可点击，旧游戏能挂载，再进入新游戏恢复收藏');
  } else await action(p,'back').click();
  if (await action(p,'skipReveal').isVisible()) await action(p,'skipReveal').click();
  await action(p,'retry').click(); s = await replay(p, 0, { mistakes: 3 });
  assert.equal(s.status,'lost'); assert.equal(s.chances,0); assert.equal(s.coins,100); await image(p,'lost');
  const cluesBefore = [s.rows,s.columns]; await p.reload(); assert.equal((await state(p)).status,'lost');
  await action(p,'retry').click(); s = await state(p); assert.ok(s.marks.every(c => c === 'unknown')); assert.equal(s.chances,3); assert.deepEqual([s.rows,s.columns],cluesBefore);
  check('三次误判后只失败，刷新失败态可恢复；同题重试还原空盘和三次机会');
  await pick(p, 2); s = await replay(p, 1, { mistakes: 1 }); assert.equal(s.status,'won'); assert.equal(s.coins,200); assert.equal(s.collected[1].paw,false);
  await action(p,'winAlbum').click(); await p.locator('[data-entry="2"]').click();
  assert.ok((await p.locator('dialog[open]').innerText()).includes(edition[1].puzzle.sticker.story)); await action(p,'entryPlay').click();
  s = await replay(p,1); assert.equal(s.coins,200); assert.equal(s.level,3); assert.equal(s.collected[1].paw,true);
  check('普通通关已得完整贴纸和故事；无伤重玩补爪印，不重复发金币或升级');
  if (full) {
    for (let id = 3; id <= 12; id++) { await pick(p,id); const complete = await replay(p,id-1); assert.equal(complete.status,'won'); assert.equal(complete.chances,3); assert.equal(complete.coins,id*100); await assertStickerFits(p); }
    assert.equal((await state(p)).level,13); await action(p,'next').click(); assert.equal((await state(p)).page,'album');
    check('12 关首发证明逐关在 Chromium 以真实工具/按钮完成，最后一关也领奖并能打开图鉴');
  }
  await context.close();
  const mobile = await browser.newContext({ viewport:{width:375,height:812}, deviceScaleFactor:1, hasTouch:true, isMobile:true, reducedMotion:'reduce' });
  const m = await mobile.newPage(); monitor(m); await m.goto(new URL('/color-sudoku/',base).href);
  await action(m,'skipPractice').tap(); await pick(m,12); assert.equal((await state(m)).reducedMotion,true);
  const geometry = () => m.locator('[data-board-scroll]').evaluate(el => ({client:el.clientWidth,scroll:el.scrollWidth,cell:el.querySelector('[data-cell]').getBoundingClientRect().width,
    pageWidth:document.documentElement.scrollWidth,windowWidth:innerWidth}));
  const compact = await geometry(); assert.ok(compact.pageWidth <= compact.windowWidth + 1);
  await action(m,'zoom').tap(); const zoomed = await geometry(); assert.ok(zoomed.cell >= 44 && zoomed.cell > compact.cell); assert.ok(zoomed.scroll > zoomed.client);
  await m.locator('[data-locate="row"]').selectOption('9'); await m.locator('[data-locate="column"]').selectOption('9');
  assert.equal(await m.evaluate(() => document.activeElement.dataset.cell),'99');
  const reachable = await cell(m,99).evaluate(el => {const box=el.getBoundingClientRect(),sc=el.closest('[data-board-scroll]').getBoundingClientRect();return box.left>=sc.left-1&&box.right<=sc.right+1&&box.top>=sc.top-1&&box.bottom<=sc.bottom+1;}); assert.ok(reachable);
  const target = edition[11].puzzle.solution[99]; await m.locator(`[data-tool="${target ? 'fill':'empty'}"]`).tap(); await cell(m,99).tap();
  assert.equal((await state(m)).chances,3); assert.equal(await action(m,'zoom').getAttribute('aria-pressed'),'true');
  await cell(m,99).scrollIntoViewIfNeeded(); await image(m,'mobile-10x10');
  if (full) {
    const won = await replay(m,11); assert.equal(won.status,'won'); assert.equal(won.chances,3);
    await assertStickerFits(m,true); assert.equal(await action(m,'skipReveal').count(),0);
    await image(m,'mobile-won');
    check('从已滚动放大的 10×10 直接无伤通关：减少动态即刻揭晓，整张贴纸不裁切，准确叠回原格位');
  }
  await m.setViewportSize({width:812,height:375}); assert.ok((await geometry()).pageWidth <= 813);
  await mobile.close(); check(`375px 触屏 10×10：不撑破页面，放大 ${compact.cell} → ${zoomed.cell}px，粘性线索/行列定位直达右下角，触摸后保持放大；横屏及减少动态`);
  await Promise.all(inspecting);
  const {local,external} = separateHomeWarnings(consoleIssues, homeFailures); errors.push(...local);
  const report = {mode: full?'full-site':'app',browser:browser.version(),checks,localErrors:errors,externalHomeRequests:homeFailures,externalHomeConsole:external,nonlocalConsoleSources:[...outside]};
  await writeFile(path.join(dir,'browser-report.json'),JSON.stringify(report,null,2)+'\n');
  if (homeFailures.length || outside.size) console.log('Existing homepage external dependencies:',JSON.stringify({ homeFailures, external, sources:[...outside] }));
  assert.deepEqual(errors,[], 'Local console, page and request errors');
} catch (failure) {
  const active = browser.contexts().flatMap(c => c.pages()).at(-1);
  if (active) {
    await image(active, 'browser-failure').catch(() => {});
    const note = { url: active.url(), title: await active.title().catch(() => ''), errors, visible: (await active.locator('body').innerText().catch(() => '')).slice(0,1600) };
    await writeFile(path.join(dir,'browser-failure.json'),JSON.stringify(note,null,2)+'\n'); console.error(note);
  }
  throw failure;
} finally { await browser.close(); }
