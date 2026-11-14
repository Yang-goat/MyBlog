<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref, watch } from 'vue';
import { state, started, modal, toast, saveError, hasSave, begin, resume, restore, dispatch, inspectSave, uploadSave, textState, fullScreen, cleanup, reducedMotion } from './store';
import Art from './Art.vue';
import Workbench from './Workbench.vue';
import WorkshopBoard from './WorkshopBoard.vue';
import Notebook from './Notebook.vue';
import ShopRoom from './ShopRoom.vue';
import JourneyBoard from './JourneyBoard.vue';
import DayReport from './DayReport.vue';
import DeliveryBoard from './DeliveryBoard.vue';
import { dayReport, financialRecovery } from '../game/journey';
import { tradeIds } from './trade-selection';
import { vDialogFocus } from './dialog-focus';
import {containerWindows} from './container-windows';
import { START_MODIFIERS, modifierEffect, dailyHours } from '../game/modifiers';
import { BALANCE } from '../game/balance';
import { version } from '../../package.json';
const seed = ref(20261105);
const startingModifiers=ref<string[]>([]),showModifiers=ref(false);
const startingPreview=computed(()=>{const s={modifiers:startingModifiers.value};return {cash:BALANCE.initialCash+modifierEffect(s,'cash'),cells:BALANCE.stock*4+modifierEffect(s,'cells'),hours:dailyHours(s),fees:BALANCE.rent+BALANCE.maintenance+modifierEffect(s,'rent')};});
function toggleModifier(id:string){const picked=START_MODIFIERS.find(m=>m.id===id)!;startingModifiers.value=startingModifiers.value.includes(id)?startingModifiers.value.filter(i=>i!==id):[...startingModifiers.value.filter(i=>START_MODIFIERS.find(m=>m.id===i)?.group!==picked.group),id];}
const newConfirm = ref(false);
const counterCount=computed(()=>new Set([...state.value.items.filter(i=>i.location==='counter').map(i=>i.id),...tradeIds.value,...(state.value.containers??[]).filter(c=>c.location==='counter').map(c=>c.id)]).size);
const activeOrders = computed(() => state.value.orders.filter(o => !o.delivered));
const closing = computed(() => dayReport(state.value));
const recovery=computed(()=>financialRecovery(state.value));
function keydown(e: KeyboardEvent) {
  if ((e.target as HTMLElement)?.matches('input,textarea,select')) return;
  if (e.key.toLowerCase() === 'f') { e.preventDefault(); void fullScreen(); }
  if (e.key === 'Escape') modal.value = '';
}
onMounted(() => {
  inspectSave(); window.addEventListener('keydown', keydown);
  window.render_game_to_text = () => JSON.stringify({...JSON.parse(textState()),openContainers:containerWindows.value.map(w=>({id:w.id,x:w.x,y:w.y}))});
  window.advanceTime = async () => { /* Paused economy: presentation does not advance a business day. */ await new Promise<void>(resolve => requestAnimationFrame(() => resolve())); };
});
onUnmounted(() => { window.removeEventListener('keydown', keydown); delete window.render_game_to_text; delete window.advanceTime; cleanup(); });
watch(() => state.value.phase, phase => { if (phase === 'won' || phase === 'failed' || phase === 'ended') modal.value = ''; });
</script>

<template>
  <main :class="['app', { 'reduced-motion': reducedMotion, 'shop-open': started }]">
    <section v-if="!started" class="title-screen">
      <Art id="scene-city" label="雾港第九街的雨夜" eager class="title-art" />
      <div class="title-shade"></div>
      <a class="back-link" href="/notes/cyber-shop/">← Goat_Yang / 游戏手记</a>
      <div class="title-copy">
        <p class="eyebrow">雾港 · 第九街 / 经营档案 001</p>
        <h1>赛博<br /><span>杂货铺</span><i>CYBER SHOP</i></h1>
        <p class="title-lead">旧物有它的下一段故事。<br />这一次，从你的柜台开始。</p>
        <div class="title-actions">
          <button v-if="hasSave" class="primary" @click="resume">继续经营 <span>↗</span></button>
          <button id="start-btn" :class="hasSave ? '' : 'primary'" @click="hasSave || saveError ? newConfirm = true : begin(seed,startingModifiers)">推开店门 <span>→</span></button>
          <label class="file-button">导入存档<input type="file" accept="application/json,.json" @change="uploadSave(($event.target as HTMLInputElement).files?.[0])" /></label>
        </div>
        <p v-if="saveError" class="warning">{{ saveError }} 原存档会保留，请先导出或备份浏览器数据。</p>
        <button class="modifier-trigger" aria-label="选择开局词条" @click="showModifiers=true">开局词条 <span>{{startingModifiers.length?`${startingModifiers.length} 项已选择`:'标准营业'}} ↗</span></button>
        <details class="seed-option"><summary>固定种子开局</summary><label>街区种子 <input v-model.number="seed" type="number" min="1" max="4294967295" /></label></details>
        <p class="small muted">暂停式营业 · 思考不消耗时间 · 本机自动保存</p>
      </div>
      <footer class="title-footer"><span>修复 / 交易 / 收藏</span><span>修复师篇 · {{version}}</span><button @click="fullScreen">全屏 F ↗</button></footer>
      <div v-if="showModifiers" class="modal-backdrop" @click.self="showModifiers=false"><section v-dialog-focus class="modifier-dialog" role="dialog" aria-modal="true" aria-label="开局词条" @keydown.esc.stop="showModifiers=false"><header><p class="eyebrow">NEW RUN / 自选经营条件</p><h2>开局词条</h2><p>正向帮助与负面挑战可以组合，同类词条互斥。</p></header><div class="modifier-preview" aria-live="polite"><span>开局 ₡{{startingPreview.cash}}</span><span>仓库 {{startingPreview.cells}} 格</span><span>每日 {{startingPreview.hours}} 工时</span><span>日支出 ₡{{startingPreview.fees}}</span></div><div class="modifier-options"><button v-for="m in START_MODIFIERS" :key="m.id" :data-modifier="m.id" :class="{positive:m.positive,selected:startingModifiers.includes(m.id)}" :aria-pressed="startingModifiers.includes(m.id)" @click="toggleModifier(m.id)"><strong>{{m.positive?'＋':'−'}} {{m.name}}</strong><small>{{m.description}}</small></button></div><footer><button @click="startingModifiers=[]">恢复标准营业</button><button class="primary" @click="showModifiers=false">采用词条 →</button></footer></section></div>
      <div v-if="newConfirm" class="modal-backdrop" @click.self="newConfirm = false"><section v-dialog-focus class="small-dialog" @keydown.esc.stop="newConfirm = false" role="dialog" aria-modal="true" aria-label="重新开局"><h2>重新开门？</h2><p>当前进度将归档后替换。想保留可迁移副本，请先继续游戏并导出存档。</p><div class="actions"><button @click="newConfirm = false">返回</button><button class="primary" @click="begin(seed,startingModifiers); newConfirm = false">确认新开局</button></div></section></div>
    </section>

    <template v-else>
      <ShopRoom />
      <p v-if="saveError" class="save-error" role="alert">自动保存失败：{{ saveError }}。可在设置中导出进度。</p>
      <div v-if="modal && modal !== 'trade'" class="modal-backdrop" @click.self="modal = ''">
        <section v-dialog-focus :class="['notebook', { 'repair-notebook': modal === 'workbench', 'book-notebook': modal === 'help' }]" role="dialog" aria-modal="true" :aria-label="modal" @keydown.esc.stop="modal = ''">
          <div class="dialog-toolbar"><button class="modal-close" aria-label="关闭面板" @click="modal = ''">×</button></div>
          <Workbench v-if="modal === 'workbench'" />
          <JourneyBoard v-else-if="modal === 'journey'" />
          <DayReport v-else-if="modal === 'day-report'" />
          <DeliveryBoard v-else-if="modal === 'deliveries'" />
          <div v-else-if="modal === 'close-day'" class="dialog-body"><p class="eyebrow">CLOSE / 收起招牌</p><h2>结束今天的营业？</h2><p>未接待的客人会离开。已接工单和货物保留，食品按保存条件老化；结算维护费与租金。</p><p class="closing-forecast">今日收入 ₡{{ closing.income }} · 已支出 ₡{{ closing.expenses }}<br />闭店待缴 ₡{{ closing.pendingFees }} · 预计结余 ₡{{ Math.max(0, state.cash - closing.pendingFees) }}</p><p v-if="state.cash<closing.pendingFees" class="warning">本次还差 ₡{{closing.pendingFees-state.cash}}，未付部分会计入欠费。<template v-if="recovery.closingChances===1">若这次日结后仍欠费，店铺将暂停营业；可以先返回接援助维修。</template></p><p v-if="activeOrders.length">仍有 {{ activeOrders.length }} 个工单，可以明天继续。</p><p v-if="counterCount" class="warning" role="alert">谈判台还有 {{ counterCount }} 件物品，暂时不能闭店。请将自有物品全部入库，未购买的来货撤回店外。</p><button v-if="counterCount" @click="modal = ''">返回整理台面</button><button class="primary" :disabled="counterCount > 0" @click="dispatch({ type: 'closeDay' }) && (modal = 'day-report')">确认闭店</button></div>
          <WorkshopBoard v-else-if="modal === 'orders'"/>
          <Notebook v-else />
        </section>
      </div>
      <div v-if="['won','ended','failed'].includes(state.phase)" class="ending-screen">
        <Art :id="state.phase === 'failed' ? 'scene-city' : 'scene-ending'" class="ending-art" eager />
        <section><p class="eyebrow">{{ state.victory ? '自己的招牌 / 故事仍在继续' : '账本的最后一页' }}</p><h1>{{ state.victory ? '这间店，\n属于你了。' : '暂时，关上店门。' }}</h1><p>{{ state.victory ? '联络中枢重新亮起。街区的人们记得，是谁让这些旧物拥有了下一段故事。' : '补救期限已到。你可以回到今天开门时，再试一次。' }}</p><p>经营 {{ state.day }} 日 · 修复 {{ state.records.repairs }} 件 · 成交 {{ state.records.trades }} 笔</p><div class="actions" v-if="state.victory"><button class="primary" @click="dispatch({ type: 'continueEndless' })">继续经营 →</button><button v-if="state.phase !== 'ended'" @click="dispatch({ type: 'endGame' })">结束并保存结局</button><button v-else @click="started = false; inspectSave()">返回标题</button></div><div class="actions" v-else><button class="primary" @click="restore">恢复当日开始</button><button @click="started = false; inspectSave()">返回标题</button></div></section>
      </div>
    </template>
    <Transition name="toast"><div v-if="toast" class="toast" role="status">{{ toast }}</div></Transition>
    <div class="portrait-tip">横过手机，展开你的店铺。<small>本游戏支持横屏触控</small></div>
  </main>
</template>
