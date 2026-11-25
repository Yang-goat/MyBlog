import { chromium } from 'playwright';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import { completeIntro } from './ui-onboarding.mjs';

const out = process.env.CYBER_EVIDENCE_DIR || 'apps/cyber-shop/evidence/energy-career';
await fs.mkdir(out, { recursive: true });
const browser = await chromium.launch({ headless: true });
const errors = [];
const results = [];
try {
  for (const touch of [false, true]) {
    const mode = touch ? 'touch' : 'desktop';
    const page = await browser.newPage({
      viewport: touch ? { width: 844, height: 390 } : { width: 1440, height: 960 },
      hasTouch: touch, isMobile: touch, reducedMotion: 'reduce',
    });
    page.setDefaultTimeout(10000);
    page.on('pageerror', error => errors.push(error.message));
    page.on('response', response => { if (response.status() >= 400) errors.push(`${response.status()} ${response.url()}`); });
    const input = touch ? 'tap' : 'click';
    const click = name => page.getByRole('button', { name, exact: true })[input]();
    const panel = name => page.locator('.cabinet-menu').getByRole('button', { name, exact: true })[input]();
    const read = () => page.evaluate(() => JSON.parse(window.render_game_to_text()));
    const game = async () => (await read()).game;
    async function followNext(id) {
      assert.equal((await read()).journey.next.id, id);
      await click('查看下一步 →');
      await page.locator(`[data-journey-task="${id}"]`).getByRole('button')[input]();
    }
    const shot = async name => {
      await page.locator('.toast').waitFor({ state: 'hidden' });
      await page.screenshot({ path: `${out}/${mode}-${name}.png` });
    };
    async function buyTool(id, material = false) {
      await panel('工具采购');
      if (material) await click('六类耗材');
      await page.locator(`[data-equipment="${id}"]`).getByRole('button')[input]();
      await click('关闭面板');
    }
    async function commission(id, profile, model, load, value, quantity, reward, tolerance) {
      await followNext('energy-accept');
      assert.equal(await page.locator('.delivery-letter').getAttribute('data-request'), id);
      await click('接下这份订货');
      await click('请商人按单找货');
      assert.equal((await game()).deliverySource.count, quantity);
      if (id === 'grid-lantern') {
        await page.reload();
        await click('继续经营 ↗');
        assert.equal((await game()).careerFocus, 'energy-tech');
        assert.equal((await game()).deliverySource.count, quantity);
      } else {
        await click('关闭面板');
      }
      await followNext('energy-close');
      await click('确认闭店');
      await click('迎接新的一天 →');
      await followNext('energy-supplier');
      await click('绿色叫号按钮');
      await click('结束当前接待');
      await click('绿色叫号按钮');
      assert.match((await game()).visitor.request, /容量留给你整备/);
      await click('继续交谈');
      await click('看看带来的货');
      await click('把来货放上台 →');
      const ids = (await game()).visitor.goods.slice(0, quantity).map(item => item.id);
      for (const itemId of ids) {
        await page.locator(`[data-trade-item="${itemId}"]`).getByRole('button', { name: '只买这件', exact: true })[input]();
      }
      await click('关闭谈判');
      await followNext('energy-store');
      await click('全部入库 ↓');
      if (id === 'grid-relay') {
        await followNext('energy-tool');
        await page.locator('[data-equipment="calibrator"]').getByRole('button')[input]();
        await click('关闭面板');
      }
      for (const itemId of ids) {
        await followNext('energy-prepare');
        assert.equal((await read()).selectedItem, itemId);
        await page.locator(`[data-energy-profile="${profile}"]`)[input]();
        await page.locator('.energy-run.primary')[input]();
        assert.equal((await game()).energyWork.itemId, itemId);
        if (id === 'grid-lantern') {
          await click('关闭面板');
          await followNext('energy-resume');
        }
        assert.match(await page.locator('.energy-reference').innerText(), new RegExp('±' + tolerance));
        await click(load);
        await page.getByLabel('设置参考读数', { exact: true }).fill(String(value + tolerance));
        await click('接入负载并复核');
        await click('收回货架 →');
        assert((await game()).items.find(item => item.id === itemId && item.definitionId === model)?.energyPreparation);
        await click('关闭面板');
      }
      await followNext('energy-deliver');
      await click('选入合格货品');
      const balance = (await game()).cash;
      await click('交货并收款 →');
      assert.equal((await game()).cash, balance + reward);
      assert.equal((await game()).deliveries.find(job => job.templateId === id && job.status === 'completed')?.goods.length, quantity);
      if (id !== 'grid-maintenance') await shot(id);
      await click('关闭面板');
    }
    try {
      await page.goto(process.env.CYBER_URL || 'http://127.0.0.1:4175/cyber-shop/');
      await page.locator('#start-btn')[input]();
      await completeIntro(page, touch);
      const original = await game();
      await click('查看下一步 →');
      const choice = page.getByRole('group', { name: '跟进职业' });
      assert.equal(await choice.getByRole('button', { name: '修复师' }).getAttribute('aria-pressed'), 'true');
      await click('能源技师');
      assert.equal(await choice.getByRole('button', { name: '能源技师' }).getAttribute('aria-pressed'), 'true');
      if (touch) {
        await page.setViewportSize({ width: 568, height: 320 });
        const next = await page.locator('[data-journey-task="energy-scanner"] button').boundingBox();
        assert(next && next.y >= 0 && next.y + next.height <= 320, 'The first career action fits a small landscape screen');
      }
      await shot('task-board');
      if (touch) await page.setViewportSize({ width: 844, height: 390 });
      await click('修复师');
      assert.deepEqual(await game(), original);
      await click('能源技师');
      await click('关闭面板');
      assert.match(await page.locator('.journey-note').innerText(), /准备多谱扫描仪/);
      await followNext('energy-scanner');
      await page.locator('[data-equipment="scanner"]').getByRole('button')[input]();
      await click('关闭面板');
      await commission('grid-lantern', 'economy', 'battery-pack', '稳态放电', 40, 1, 360, 2);
      await commission('grid-pump', 'balanced', 'capacitor-array', '脉冲负载', 65, 1, 980, 2);
      await commission('grid-relay', 'precision', 'power-module', '稳压输出', 50, 2, 6200, 4);
      for (let round = 0; (await game()).cash < 12000 && round < 12; round++) {
        while ((await game()).equipment.insulation < 2) await buyTool('insulation', true);
        await commission('grid-maintenance', 'balanced', 'power-module', '稳压输出', 50, 2, 2500, 4);
      }
      await followNext('energy-ownership');
      await click('支付并买下店铺');
      const won = await game();
      assert.equal(won.victory, true);
      assert.equal(won.records.repairs, 0);
      assert.equal(won.chapter, 1);
      assert.deepEqual(won.professionMilestones, ['microgrid-stable']);
      assert.equal(won.professions.find(profession => profession.professionId === 'energy-tech')?.ready, true);
      assert.match(await page.locator('.ending-screen').innerText(), /整备 10 件/);
      if (touch) {
        await page.setViewportSize({ width: 568, height: 320 });
        const end = await page.getByRole('button', { name: '结束并保存结局', exact: true }).boundingBox();
        assert(end && end.y + end.height <= 320);
      }
      await shot('ending');
      await click('结束并保存结局');
      await page.reload();
      await click('继续经营 ↗');
      assert.equal((await game()).phase, 'ended');
      await click('继续经营 →');
      await click('迎接新的一天 →');
      assert.equal((await game()).endless, true);
      assert.equal((await game()).day, won.day + 1);
      results.push({ mode, winDay: won.day, deliveries: won.records.deliveries, repairs: won.records.repairs, cashAfterPurchase: won.cash });
    } catch (error) {
      await page.screenshot({ path: `${out}/${mode}-failure.png` });
      await fs.writeFile(`${out}/failure.json`, JSON.stringify({ error: String(error), state: await game().catch(() => null), errors }, null, 2));
      throw error;
    } finally {
      await page.close();
    }
  }
  assert.deepEqual(errors, []);
  await fs.writeFile(`${out}/result.json`, JSON.stringify({ ok: true, results, errors }, null, 2));
  console.log('ENERGY_CAREER_UI_PASS');
} finally {
  await browser.close();
}
