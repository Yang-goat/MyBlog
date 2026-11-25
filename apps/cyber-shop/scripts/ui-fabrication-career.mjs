import { chromium } from 'playwright';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import { completeIntro } from './ui-onboarding.mjs';

const output = process.env.CYBER_EVIDENCE_DIR || 'apps/cyber-shop/evidence/fabrication-release';
const base = process.env.CYBER_URL || 'http://127.0.0.1:4180/cyber-shop/';
await fs.mkdir(output,{recursive:true});
const browser = await chromium.launch({headless:true});
const results = [];
try {
  for(const touch of [false,true]){
    const mode = touch?'touch':'desktop';
    const page = await browser.newPage({
      viewport:touch?{width:568,height:320}:{width:1440,height:960},
      hasTouch:touch,isMobile:touch,reducedMotion:'reduce',
    });
    const input = touch?'tap':'click';
    const click = name => page.getByRole('button',{name,exact:true})[input]();
    const read = () => page.evaluate(() => JSON.parse(window.render_game_to_text()));
    const errors = [];
    page.setDefaultTimeout(12000);
    page.on('pageerror',error=>errors.push(error.message));
    page.on('response',response=>{if(response.status()>=400)errors.push(response.status()+' '+response.url());});
    async function follow(id) {
      assert.equal((await read()).journey.next.id,id);
      await click('查看下一步 →');
      await page.locator(`[data-journey-task="${id}"]`).getByRole('button')[input]();
    }
    async function commission(id,quantity,method,reward){
      await follow('fabrication-accept');
      assert.equal(await page.locator('.delivery-letter').getAttribute('data-request'),id);
      await click('接下这份订货');
      await click('请商人按单找货');
      const materials=(await read()).game.deliverySource.materials;
      assert(materials.length>0 && materials.length<=quantity*2);
      if(id==='fab-lockers'){
        await page.reload();await click('继续经营 ↗');
        assert.equal((await read()).game.careerFocus,'fabricator');
        assert.deepEqual((await read()).game.deliverySource.materials,materials);
      }else await click('关闭面板');
      await follow('fabrication-close');
      await click('确认闭店');
      await click('迎接新的一天 →');
      await follow('fabrication-supplier');
      await click('绿色叫号按钮');await click('结束当前接待');await click('绿色叫号按钮');
      assert.match((await read()).game.visitor.request,/已核对所需原料/);
      await click('继续交谈');await click('看看带来的货');await click('把来货放上台 →');
      const arrived=(await read()).game.visitor.goods.slice(0,materials.length);
      assert.deepEqual(arrived.map(item=>item.definitionId),materials);
      for(const item of arrived)await page.locator(`[data-trade-item="${item.id}"]`).getByRole('button',{name:'只买这件',exact:true})[input]();
      await click('关闭谈判');
      await follow('fabrication-store');
      await click('全部入库 ↓');
      for(let n=0;n<quantity;n++){
        await follow('fabrication-work');
        const selected=await page.locator('.material-slot select').evaluateAll(fields=>fields.map(field=>field.value));
        assert.equal(new Set(selected).size,2);
        if(id==='fab-vent' && n===0){
          assert.match(await page.locator('.assembly-total').innerText(),/未达委托验收/);
        }
        await page.locator(`[data-fabrication-method="${method}"]`)[input]();
        assert.doesNotMatch(await page.locator('.assembly-total').innerText(),/未达委托验收/);
        const previous=await read();
        if(id==='fab-lockers'&&n===0)await page.screenshot({path:`${output}/${mode}-bench.png`});
        await click('确认装配 →');
        const made=await read();
        assert.equal(made.game.fabricatedCount,previous.game.fabricatedCount+1);
        assert(!made.game.items.some(item=>selected.includes(item.id)));
        const product=made.game.items.find(item=>item.id===made.game.items.at(-1).id);
        assert(product.fabrication && product.location==='stock');
        assert.equal(previous.game.cash-made.game.cash,product.fabrication.fee);
        if(id==='fab-lockers')assert.match(await page.locator('.fabrication-ready').innerText(),/已入主仓/);
        await click('关闭面板');
      }
      await follow('fabrication-deliver');
      await click('选入合格货品');
      const before=(await read()).game.cash;
      await click('交货并收款 →');
      const check=(await read()).game;
      assert.equal(check.cash-before,reward);
      assert.equal(check.deliveries.find(job=>job.templateId===id&&job.status==='completed')?.goods.length,quantity);
      await click('关闭面板');
    }
    try{
      await page.goto(base);
      await page.locator('#start-btn')[input]();await completeIntro(page,touch);
      await click('查看下一步 →');await click('合成工匠');await click('关闭面板');
      await follow('fabrication-scanner');
      await page.locator('[data-equipment="scanner"]').getByRole('button')[input]();
      await click('关闭面板');
      await commission('fab-lockers',1,'standard',600);
      await commission('fab-lift',1,'fine',1320);
      await commission('fab-vent',2,'fine',8600);
      for(let round=0;(await read()).game.cash<12000&&round<8;round++)await commission('fab-restock',2,'fine',2520);
      await follow('fabrication-ownership');
      await click('支付并买下店铺');
      const won=(await read()).game;
      assert.equal(won.victoryCareer,'fabricator');assert.equal(won.records.repairs,0);assert.equal(won.chapter,1);
      assert.match(await page.locator('.ending-screen').innerText(),/地下工坊开了窗/);
      await page.locator('.toast').waitFor({state:'hidden'});
      await page.screenshot({path:`${output}/${mode}-ending.png`});
      await click('结束并保存结局');await page.reload();await click('继续经营 ↗');
      assert.equal((await read()).game.phase,'ended');
      await click('继续经营 →');await click('迎接新的一天 →');
      const continued=(await read()).game;
      assert.equal(continued.day,won.day+1);assert.equal(continued.endless,true);
      assert.deepEqual(errors,[]);
      results.push({mode,winDay:won.day,fabricated:won.fabricatedCount,repairs:won.records.repairs,cash:won.cash,errors});
    }catch(error){
      await page.screenshot({path:`${output}/${mode}-failure.png`}).catch(()=>{});
      await fs.writeFile(`${output}/failure.json`,JSON.stringify({message:String(error),state:await read().catch(()=>null),errors},null,2));
      throw error;
    }finally{await page.close();}
  }
  await fs.writeFile(`${output}/result.json`,JSON.stringify({ok:true,results},null,2));
  console.log('FABRICATION_CAREER_UI_PASS');
}finally{await browser.close();}
