<script setup lang="ts">
import { computed, defineAsyncComponent, onMounted, onUnmounted, ref, watch } from 'vue';
import { ITEMS, CHARACTERS, CATEGORIES } from '../content';
import { attraction, capacity, stockUsage } from '../game/engine';
import { state, started, modal, toast, saveError, hasSave, selectedItem, selectedOrder, begin, resume, restore, dispatch, inspectSave, uploadSave, textState, fullScreen, cleanup, reducedMotion, muted } from './store';
import Art from './Art.vue';
import VisitorPanel from './VisitorPanel.vue';
import Workbench from './Workbench.vue';
import Notebook from './Notebook.vue';
const ShopCanvas = defineAsyncComponent(() => import('../scenes/ShopCanvas.vue'));
const seed = ref(20261105);
const newConfirm = ref(false);
const chapters = ['重新开门', '街区口碑', '高价与代价', '自己的招牌'];
const chapter = computed(() => state.value.endless ? '招牌之后' : chapters[Math.max(0, state.value.chapter - 1)]);
const visitor = computed(() => state.value.visitors[state.value.visitorIndex]);
const character = computed(() => CHARACTERS.find(c => c.id === visitor.value?.characterId));
const activeOrders = computed(() => state.value.orders.filter(o => !o.delivered));
const stock = computed(() => state.value.items.filter(i => i.owner === 'player' && i.location === 'stock'));
const goal = computed(() => state.value.victory ? '招牌已经属于你。考取古董资质，寻找新的旧物与故事。' : state.value.finalComplete ? '经营权已可收购，准备 12,000 信用点。' : state.value.finalStage > 0 ? '完成联络中枢的后续修复。' : state.value.chapter === 1 ? '完成维修、交易与第一份人物委托。' : state.value.chapter === 2 ? '取得工业证书，建立自己的接单方式。' : state.value.chapter === 3 ? '取得神经接口证书，集中投入一条维修专精。' : '取得大师能力，接下街区联络中枢订单。');
const used = computed(() => state.value.items.filter(i => i.owner === 'player').reduce((n, i) => n + (ITEMS.find(d => d.id === i.definitionId)?.size ?? 0), 0));
const itemName = (id: string) => ITEMS.find(d => d.id === id)?.name ?? id;
function showOrder(id: string) { selectedOrder.value = id; modal.value = 'workbench'; }
function keydown(e: KeyboardEvent) {
  if ((e.target as HTMLElement)?.matches('input,textarea,select')) return;
  if (e.key.toLowerCase() === 'f') { e.preventDefault(); void fullScreen(); }
  if (e.key === 'Escape') modal.value = '';
}
onMounted(() => {
  inspectSave(); window.addEventListener('keydown', keydown);
  window.render_game_to_text = textState;
  window.advanceTime = async () => { /* Paused economy: presentation does not advance a business day. */ await new Promise<void>(resolve => requestAnimationFrame(() => resolve())); };
});
onUnmounted(() => { window.removeEventListener('keydown', keydown); delete window.render_game_to_text; delete window.advanceTime; cleanup(); });
watch(() => state.value.phase, phase => { if (phase === 'won' || phase === 'failed' || phase === 'ended') modal.value = ''; });
</script>

<template>
  <main :class="['app', { 'reduced-motion': reducedMotion }]">
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
          <button id="start-btn" :class="hasSave ? '' : 'primary'" @click="hasSave || saveError ? newConfirm = true : begin(seed)">推开店门 <span>→</span></button>
          <label class="file-button">导入存档<input type="file" accept="application/json,.json" @change="uploadSave(($event.target as HTMLInputElement).files?.[0])" /></label>
        </div>
        <p v-if="saveError" class="warning">{{ saveError }} 原存档会保留，请先导出或备份浏览器数据。</p>
        <details class="seed-option"><summary>固定种子开局</summary><label>街区种子 <input v-model.number="seed" type="number" min="1" max="4294967295" /></label></details>
        <p class="small muted">暂停式营业 · 思考不消耗时间 · 本机自动保存</p>
      </div>
      <footer class="title-footer"><span>修复 / 交易 / 收藏</span><span>DEMO 0.1.0 · 原创世界</span><button @click="fullScreen">全屏 F ↗</button></footer>
      <div v-if="newConfirm" class="modal-backdrop" @click.self="newConfirm = false"><section class="small-dialog" role="dialog" aria-modal="true" aria-label="重新开局"><h2>重新开门？</h2><p>当前进度将归档后替换。想保留可迁移副本，请先继续游戏并导出存档。</p><div class="actions"><button @click="newConfirm = false">返回</button><button class="primary" @click="begin(seed); newConfirm = false">确认新开局</button></div></section></div>
    </section>

    <template v-else>
      <header class="topbar">
        <button class="brand" @click="modal = 'help'"><span class="brand-mark">杂</span><strong>赛博杂货铺</strong><small>第九街 · 07号</small></button>
        <div class="day-label"><span class="eyebrow">{{ state.endless ? '自由经营' : `第 ${state.chapter} 章` }}</span><strong>{{ chapter }}</strong></div>
        <div class="topstats"><span>第 <b>{{ String(state.day).padStart(2, '0') }}</b> 日</span><span>工时 <b>{{ state.hours }}</b> / 12</span><span class="cash">₡ <b>{{ state.cash.toLocaleString() }}</b></span></div>
        <button class="icon-button" aria-label="声音开关" @click="muted = !muted">{{ muted ? '静音' : '声音' }}</button>
        <button class="icon-button" aria-label="设置与存档" @click="modal = 'settings'">☷</button>
      </header>
      <div class="business-layout">
        <section class="shop-view">
          <ShopCanvas :blocked="!!modal || state.phase !== 'open'" />
          <div class="shop-caption"><span class="live-dot"></span>{{ state.phase === 'open' ? '正在营业' : '已闭店' }} <span>· 慢慢来，时间等你</span></div>
          <div class="scene-sign"><p>FOG HARBOR / DISTRICT 09</p><h2>让旧物<br />再次发光。</h2></div>
          <div class="location-actions"><button @click="modal = 'inventory'">货架 <span>{{ stockUsage(state) }} / {{ capacity(state) }}</span></button><button @click="modal = 'collection'">展示柜 <span>吸引力 {{ Math.round(attraction(state)) }}</span></button><button @click="modal = 'orders'">工作台 <span>{{ activeOrders.length }} 个工单</span></button></div>
          <div class="stock-strip" aria-label="货架快捷栏">
            <button v-for="item in stock.slice(0, 6)" :key="item.id" draggable="true" @dragstart="$event.dataTransfer?.setData('text/plain', item.id)" @click="selectedItem = item.id; modal = 'inventory'"><Art :id="item.definitionId" :label="itemName(item.definitionId)" /><span>{{ itemName(item.definitionId) }}</span></button>
            <button class="stock-more" @click="modal = 'inventory'">所有库存<br />↗</button>
          </div>
        </section>
        <aside class="counter">
          <div class="counter-label"><span>COUNTER / 柜台</span><span>{{ Math.min(state.visitorIndex + 1, 7) }} / {{ state.visitors.length }}</span></div>
          <VisitorPanel v-if="state.phase === 'open'" />
          <div v-else class="closed-panel"><p class="eyebrow">夜间账本</p><h2>今天辛苦了。</h2><p>街灯还亮着。整理收藏，安排技能，准备明天的营业。</p><dl><dt>累计成交</dt><dd>{{ state.records.trades }} 笔</dd><dt>累计修复</dt><dd>{{ state.records.repairs }} 件</dd><dt>应付欠费</dt><dd>₡ {{ state.debt }}</dd></dl><button v-if="state.phase === 'closed'" class="primary wide" @click="dispatch({ type: 'openDay' })">迎接新的一天 →</button></div>
          <div class="today-goal"><span class="eyebrow">下一步</span><p>{{ goal }}</p><button class="text-button" @click="modal = 'journal'">查看街区手记 →</button></div>
          <div v-if="activeOrders.length" class="pending-orders"><button v-for="order in activeOrders" :key="order.id" @click="showOrder(order.id)"><span>{{ order.kind === 'exam' ? '考核' : order.kind === 'final' ? '中枢' : '工单' }}</span>{{ itemName(state.items.find(i => i.id === order.itemId)?.definitionId ?? '') }} <b>↗</b></button></div>
        </aside>
      </div>
      <nav class="bottom-nav" aria-label="店铺菜单"><button @click="modal = 'inventory'"><span>01</span>库存</button><button @click="modal = 'growth'"><span>02</span>技能与资质 <b v-if="state.points">{{ state.points }}</b></button><button @click="modal = 'equipment'"><span>03</span>工具采购</button><button @click="modal = 'collection'"><span>04</span>收藏图鉴</button><button @click="modal = 'journal'"><span>05</span>街区手记</button><button class="close-day" v-if="state.phase === 'open'" @click="modal = 'close-day'">闭店结算 →</button><button v-else @click="modal = 'settings'">保存与设置</button></nav>
      <p v-if="saveError" class="save-error" role="alert">自动保存失败：{{ saveError }}。可在设置中导出进度。</p>
      <div v-if="modal" class="modal-backdrop" @click.self="modal = ''">
        <section :class="['notebook', { 'repair-notebook': modal === 'workbench' }]" role="dialog" aria-modal="true" :aria-label="modal" @keydown.esc.stop="modal = ''">
          <button class="modal-close" aria-label="关闭面板" @click="modal = ''">×</button>
          <Workbench v-if="modal === 'workbench'" />
          <div v-else-if="modal === 'close-day'" class="dialog-body"><p class="eyebrow">CLOSE / 收起招牌</p><h2>结束今天的营业？</h2><p>未接待的客人会离开。已接工单和货物保留，食品按保存条件老化；结算维护费与租金。</p><p v-if="activeOrders.length">仍有 {{ activeOrders.length }} 个工单，可以明天继续。</p><button class="primary" @click="dispatch({ type: 'closeDay' }); modal = ''">确认闭店</button></div>
          <div v-else-if="modal === 'orders'" class="dialog-body"><p class="eyebrow">WORKSHOP / 维修委托</p><h2>一件一件修好。</h2><p>客户物品独立保管。材料预付款只能用于这一份工单。</p><button class="primary" @click="dispatch({ type: 'acceptRepair' })">接基础援助维修</button><p class="small muted">即使没有现金，也能凭手艺重新开始。</p><button v-for="order in activeOrders" :key="order.id" class="list-row" @click="showOrder(order.id)"><span>{{ order.description }}</span><b>打开工作台 →</b></button></div>
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
