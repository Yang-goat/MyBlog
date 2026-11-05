<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref, watch } from 'vue';
import { state, started, modal, toast, saveError, hasSave, selectedOrder, begin, resume, restore, dispatch, inspectSave, uploadSave, textState, fullScreen, cleanup, reducedMotion } from './store';
import Art from './Art.vue';
import Workbench from './Workbench.vue';
import Notebook from './Notebook.vue';
import ShopRoom from './ShopRoom.vue';
import { tradeIds } from './trade-selection';
const seed = ref(20261105);
const newConfirm = ref(false);
const counterCount=computed(()=>new Set([...state.value.items.filter(i=>i.location==='counter').map(i=>i.id),...tradeIds.value]).size);
const activeOrders = computed(() => state.value.orders.filter(o => !o.delivered));
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
      <ShopRoom />
      <p v-if="saveError" class="save-error" role="alert">自动保存失败：{{ saveError }}。可在设置中导出进度。</p>
      <div v-if="modal && modal !== 'trade'" class="modal-backdrop" @click.self="modal = ''">
        <section :class="['notebook', { 'repair-notebook': modal === 'workbench' }]" role="dialog" aria-modal="true" :aria-label="modal" @keydown.esc.stop="modal = ''">
          <button class="modal-close" aria-label="关闭面板" @click="modal = ''">×</button>
          <Workbench v-if="modal === 'workbench'" />
          <div v-else-if="modal === 'close-day'" class="dialog-body"><p class="eyebrow">CLOSE / 收起招牌</p><h2>结束今天的营业？</h2><p>未接待的客人会离开。已接工单和货物保留，食品按保存条件老化；结算维护费与租金。</p><p v-if="activeOrders.length">仍有 {{ activeOrders.length }} 个工单，可以明天继续。</p><p v-if="counterCount" class="warning" role="alert">谈判台还有 {{ counterCount }} 件物品，暂时不能闭店。请将自有物品全部入库，未购买的来货撤回店外。</p><button v-if="counterCount" @click="modal = ''">返回整理台面</button><button class="primary" :disabled="counterCount > 0" @click="dispatch({ type: 'closeDay' }) && (modal = '')">确认闭店</button></div>
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
