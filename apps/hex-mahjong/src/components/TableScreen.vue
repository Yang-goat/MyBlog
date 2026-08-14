<script setup lang="ts">
import CardView, { type CardDisplay } from "./CardView.vue";
import PlayerRail, { type PlayerRailData } from "./PlayerRail.vue";
import UiButton from "./UiButton.vue";

export type PendingCardDisplay = {
  instanceId: string;
  card: CardDisplay;
  playerName?: string;
  status: "pending" | "completed" | "skipped";
};

const props = defineProps<{
  players: PlayerRailData[];
  round: number;
  modeLabel: string;
  worldCard?: CardDisplay | null;
  treasureCard?: CardDisplay | null;
  pendingCards: PendingCardDisplay[];
  dealerId?: string;
  canUndo?: boolean;
  funEnabled?: boolean;
  abandonOpened?: boolean;
  canDraw?: boolean;
  canAbandon?: boolean;
  canSettle?: boolean;
  saveState?: "saved" | "saving" | "error";
  fullscreenActive?: boolean;
}>();

const emit = defineEmits<{
  draw: [kind: "opportunity" | "fun"];
  settle: [];
  abandon: [];
  undo: [];
  fullscreen: [];
  settings: [];
  player: [playerId: string];
  card: [card: CardDisplay];
  status: [instanceId: string, status: "pending" | "completed" | "skipped"];
}>();

function playerAt(seat: PlayerRailData["seat"]) {
  return props.players.find((player) => player.seat === seat)!;
}
</script>

<template>
  <main class="table-screen">
    <div class="table-surface" aria-hidden="true" />
    <div class="table-rings" aria-hidden="true"><i /><i /><i /></div>

    <div
      class="rail rail--top"
      role="button"
      tabindex="0"
      :aria-label="`查看${playerAt('north').name}详情`"
      @click="emit('player', playerAt('north').id)"
      @keydown.enter="emit('player', playerAt('north').id)"
      @keydown.space.prevent="emit('player', playerAt('north').id)"
    >
      <PlayerRail :player="playerAt('north')" :dealer="dealerId === playerAt('north').id" />
    </div>
    <div
      class="rail rail--right"
      role="button"
      tabindex="0"
      :aria-label="`查看${playerAt('east').name}详情`"
      @click="emit('player', playerAt('east').id)"
      @keydown.enter="emit('player', playerAt('east').id)"
      @keydown.space.prevent="emit('player', playerAt('east').id)"
    >
      <PlayerRail :player="playerAt('east')" :dealer="dealerId === playerAt('east').id" />
    </div>
    <div
      class="rail rail--bottom"
      role="button"
      tabindex="0"
      :aria-label="`查看${playerAt('south').name}详情`"
      @click="emit('player', playerAt('south').id)"
      @keydown.enter="emit('player', playerAt('south').id)"
      @keydown.space.prevent="emit('player', playerAt('south').id)"
    >
      <PlayerRail :player="playerAt('south')" :dealer="dealerId === playerAt('south').id" />
    </div>
    <div
      class="rail rail--left"
      role="button"
      tabindex="0"
      :aria-label="`查看${playerAt('west').name}详情`"
      @click="emit('player', playerAt('west').id)"
      @keydown.enter="emit('player', playerAt('west').id)"
      @keydown.space.prevent="emit('player', playerAt('west').id)"
    >
      <PlayerRail :player="playerAt('west')" :dealer="dealerId === playerAt('west').id" />
    </div>

    <section class="center-stage" aria-label="公共牌桌">
      <header class="table-title">
        <p>{{ modeLabel }}</p>
        <h1>海克斯麻将</h1>
        <span>第 <strong>{{ round }}</strong> / 8 局</span>
      </header>

      <div class="public-cards">
        <div class="deck-action deck-action--opportunity">
          <span>机遇牌</span>
          <button type="button" aria-label="抽取机遇牌" :disabled="canDraw === false" @click="emit('draw', 'opportunity')">
            <CardView :card="{ id: 'O', name: '机遇牌', category: '机遇牌' }" concealed compact />
          </button>
          <UiButton label="抽牌" variant="primary" :disabled="canDraw === false" @click="emit('draw', 'opportunity')" />
        </div>

        <div class="current-public-card">
          <span>世界牌</span>
          <button v-if="worldCard" type="button" @click="emit('card', worldCard)">
            <CardView :card="worldCard" compact interactive />
          </button>
          <div v-else class="empty-public-card">等待本局准备</div>
        </div>

        <div v-if="treasureCard" class="current-public-card current-public-card--treasure">
          <span>宝牌令</span>
          <button type="button" @click="emit('card', treasureCard)">
            <CardView :card="treasureCard" compact interactive />
          </button>
        </div>
        <div v-if="funEnabled" class="deck-action deck-action--challenge">
          <span>欢乐挑战</span>
          <button type="button" aria-label="抽取欢乐挑战" :disabled="canDraw === false" @click="emit('draw', 'fun')">
            <CardView :card="{ id: 'F', name: '欢乐挑战', category: '欢乐挑战牌' }" concealed compact />
          </button>
          <UiButton label="抽牌" variant="quiet" :disabled="canDraw === false" @click="emit('draw', 'fun')" />
        </div>
      </div>

      <section class="pending-queue" aria-labelledby="pending-title">
        <header>
          <h2 id="pending-title">待处理卡牌</h2>
          <span>{{ pendingCards.filter((item) => item.status === 'pending').length }} 项待执行</span>
        </header>
        <div v-if="pendingCards.length" class="pending-list">
          <article v-for="item in pendingCards" :key="item.instanceId" class="pending-item" :class="`pending-item--${item.status}`">
            <button class="pending-item__main" type="button" @click="emit('card', item.card)">
              <span class="pending-item__sigil" aria-hidden="true" />
              <span>
                <strong>{{ item.card.name }}</strong>
                <small>{{ item.playerName ?? "公共" }} · {{ item.card.category }}</small>
              </span>
            </button>
            <div class="status-actions" aria-label="卡牌状态">
              <button type="button" :class="{ active: item.status === 'pending' }" :disabled="item.status !== 'pending'" @click="emit('status', item.instanceId, 'pending')">待执行</button>
              <button type="button" :class="{ active: item.status === 'completed' }" @click="emit('status', item.instanceId, 'completed')">完成</button>
              <button type="button" :class="{ active: item.status === 'skipped' }" @click="emit('status', item.instanceId, 'skipped')">跳过</button>
            </div>
          </article>
        </div>
        <p v-else class="pending-empty">本局还没有临时卡牌</p>
      </section>
    </section>

    <footer class="control-dock hex-panel">
      <div class="save-indicator" :class="`save-indicator--${saveState ?? 'saved'}`">
        <span aria-hidden="true" />
        {{ saveState === "saving" ? "正在保存" : saveState === "error" ? "保存失败" : "已保存到本机" }}
      </div>
      <div class="control-dock__actions">
        <UiButton :label="abandonOpened ? '弃约已确认' : '弃约窗口'" icon="cards" variant="quiet" :disabled="abandonOpened || canAbandon === false" @click="emit('abandon')" />
        <UiButton label="本局结算" icon="score" variant="gold" :disabled="canSettle === false" @click="emit('settle')" />
        <UiButton label="撤销" icon="undo" variant="quiet" :disabled="!canUndo" @click="emit('undo')" />
        <UiButton :label="fullscreenActive ? '退出全屏' : '全屏'" icon="fullscreen" variant="quiet" @click="emit('fullscreen')" />
        <UiButton label="设置" icon="gear" variant="quiet" @click="emit('settings')" />
      </div>
    </footer>
  </main>
</template>

<style scoped>
.table-screen { position: relative; width: 100%; height: 100%; min-height: 0; overflow: hidden; isolation: isolate; }
.table-surface { position: absolute; z-index: -3; inset: 0; background: linear-gradient(rgb(2 10 17 / 48%), rgb(2 8 14 / 76%)), url("/art/table-surface.webp") center / cover, radial-gradient(circle at center, #0b4562, #020910 74%); }
.table-rings { position: absolute; z-index: -2; inset: 8% 13%; border: 1px solid rgb(213 172 84 / 20%); border-radius: 50%; box-shadow: 0 0 0 1px rgb(29 184 223 / 7%), inset 0 0 70px rgb(3 13 21 / 74%); pointer-events: none; }
.table-rings i { position: absolute; inset: 8%; border: 1px solid rgb(213 172 84 / 13%); border-radius: 50%; }
.table-rings i:nth-child(2) { inset: 18%; border-color: rgb(29 184 223 / 9%); }
.table-rings i:nth-child(3) { inset: 30%; }

.rail { position: absolute; z-index: 8; cursor: pointer; }
.rail:focus-visible, .rail:focus-within { outline: 2px solid var(--cyan-300); outline-offset: 3px; }
.rail--top, .rail--bottom { right: 18%; left: 18%; }
.rail--top { top: 8px; transform: rotate(180deg); }
.rail--bottom { bottom: 76px; }
.rail--left, .rail--right { top: 50%; width: min(620px, calc(100vh - 180px)); }
.rail--left { left: 47px; transform: translate(-50%, -50%) rotate(90deg); }
.rail--right { right: 47px; transform: translate(50%, -50%) rotate(-90deg); }

.center-stage { position: absolute; display: grid; inset: 104px 108px 174px; grid-template-rows: auto minmax(0, 1fr) auto; align-items: start; }
.table-title { text-align: center; }
.table-title p { margin: 0 0 0.12rem; color: var(--cyan-300); font-size: 0.68rem; letter-spacing: 0.14em; }
.table-title h1 { margin: 0; color: var(--gold-100); font: 700 clamp(1.35rem, 2.5vw, 2.2rem)/1 var(--font-display); letter-spacing: 0.13em; text-shadow: 0 0 22px rgb(213 172 84 / 18%); }
.table-title > span { display: inline-block; min-width: 128px; margin-top: 0.3rem; border-block: 1px solid rgb(213 172 84 / 25%); padding: 0.22rem 0.7rem; color: var(--muted); font-size: 0.75rem; letter-spacing: 0.12em; }
.table-title strong { color: var(--gold-200); font-size: 1.15rem; }

.public-cards { display: flex; min-height: 0; align-items: center; justify-content: center; gap: clamp(1rem, 3.4vw, 3.4rem); padding: 0.7rem 0 0.45rem; }
.public-cards button { border: 0; background: transparent; padding: 0; }
.deck-action, .current-public-card { display: grid; width: clamp(96px, 11vw, 148px); flex: none; gap: 0.4rem; text-align: center; }
.deck-action > span, .current-public-card > span { color: var(--cyan-300); font: 700 0.72rem/1 var(--font-ui); letter-spacing: 0.08em; }
.deck-action--challenge > span { color: var(--violet-300); }
.current-public-card > button, .deck-action > button:first-of-type { width: 100%; }
.current-public-card--treasure > span { color: var(--gold-200); }
.empty-public-card { display: grid; aspect-ratio: 0.72; place-items: center; border: 1px dashed rgb(213 172 84 / 32%); color: var(--muted); font-size: 0.7rem; }
.deck-action :deep(.ui-button) { min-height: 48px; padding: 0.55rem 0.7rem; font-size: 0.78rem; }

.pending-queue { width: min(760px, 100%); justify-self: center; border: 1px solid rgb(213 172 84 / 28%); background: rgb(3 15 25 / 85%); box-shadow: inset 0 0 24px rgb(29 184 223 / 5%); }
.pending-queue > header { display: flex; align-items: center; justify-content: space-between; border-bottom: 1px solid rgb(213 172 84 / 18%); padding: 0.45rem 0.65rem; }
.pending-queue h2 { margin: 0; color: var(--gold-200); font: 700 0.8rem/1 var(--font-ui); letter-spacing: 0.12em; }
.pending-queue header span { color: var(--muted); font-size: 0.66rem; }
.pending-list { display: grid; max-height: 104px; grid-template-columns: repeat(3, minmax(0, 1fr)); overflow: auto; }
.pending-item { display: grid; min-width: 0; border-right: 1px solid rgb(213 172 84 / 12%); padding: 0.42rem; opacity: 0.92; }
.pending-item--completed { background: rgb(22 111 73 / 12%); }
.pending-item--skipped { opacity: 0.5; }
.pending-item__main { display: flex; min-width: 0; align-items: center; gap: 0.48rem; color: var(--text); text-align: left; cursor: pointer; }
.pending-item__main > span:last-child { min-width: 0; }
.pending-item__main strong, .pending-item__main small { display: block; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.pending-item__main strong { font: 700 0.76rem/1.2 var(--font-display); }
.pending-item__main small { margin-top: 0.18rem; color: var(--muted); font-size: 0.56rem; }
.pending-item__sigil { width: 24px; flex: none; aspect-ratio: 1; border: 1px solid var(--cyan-400); transform: rotate(30deg); }
.status-actions { display: grid; grid-template-columns: repeat(3, 1fr); gap: 2px; margin-top: 0.38rem; }
.status-actions button { min-height: 48px; border: 1px solid rgb(213 172 84 / 18%); background: rgb(2 10 17 / 68%); color: var(--muted); font-size: 0.6rem; cursor: pointer; }
.status-actions button.active { border-color: var(--cyan-400); color: var(--cyan-100); }
.pending-empty { margin: 0; padding: 0.8rem; color: var(--muted); font-size: 0.7rem; text-align: center; }

.control-dock { position: absolute; z-index: 12; display: flex; right: 20%; bottom: 8px; left: 20%; min-height: 58px; align-items: center; justify-content: space-between; gap: 1rem; padding: 0.38rem 0.55rem 0.38rem 0.85rem; }
.control-dock__actions { display: flex; min-width: 0; flex: 1; justify-content: flex-end; gap: 0.55rem; }
.control-dock :deep(.ui-button) { min-height: 48px; padding: 0.68rem 0.95rem; font-size: 0.82rem; }
.save-indicator { display: flex; align-items: center; gap: 0.4rem; color: var(--muted); font-size: 0.65rem; }
.save-indicator > span { width: 7px; aspect-ratio: 1; border-radius: 50%; background: var(--success); box-shadow: 0 0 8px var(--success); }
.save-indicator--saving > span { background: var(--warning); box-shadow: 0 0 8px var(--warning); }
.save-indicator--error { color: var(--danger); }
.save-indicator--error > span { background: var(--danger); box-shadow: 0 0 8px var(--danger); }

@media (max-width: 1180px), (max-height: 760px) {
  .rail--top, .rail--bottom { right: 16%; left: 16%; }
  .center-stage { inset: 83px 91px 144px; }
  .rail--bottom { bottom: 67px; }
  .rail--left { left: 39px; }
  .rail--right { right: 39px; }
  .control-dock { right: 18%; bottom: 6px; left: 18%; min-height: 52px; }
  .public-cards { gap: 1.1rem; padding-top: 0.35rem; }
  .deck-action, .current-public-card { width: clamp(82px, 9.5vw, 116px); }
  .pending-list { max-height: 112px; }
}

@media (max-width: 1000px), (max-height: 620px) {
  .control-dock { right: 12%; left: 12%; gap: 0.5rem; padding-left: 0.55rem; }
  .save-indicator { flex: none; gap: 0; font-size: 0; }
  .control-dock__actions { gap: 0.35rem; }
  .control-dock :deep(.ui-button) { flex: 1; padding: 0.58rem 0.62rem; font-size: 0.74rem; white-space: nowrap; }
}

@media (max-height: 540px) and (orientation: landscape) {
  .rail :deep(.player-rail) { height: 48px; min-height: 48px; grid-template-columns: minmax(110px, 1fr) minmax(82px, 0.72fr) auto 62px; gap: 0.35rem; padding: 0.2rem 0.45rem; }
  .rail :deep(.player-wind) { width: 30px; font-size: 1.05rem; }
  .rail :deep(.player-identity) { gap: 0.42rem; }
  .rail :deep(.player-name-row strong) { font-size: 0.78rem; }
  .rail :deep(.player-score) { margin-top: 0.1rem; font-size: 0.78rem; }
  .rail :deep(.player-contract) { gap: 0; padding-left: 0.48rem; }
  .rail :deep(.player-contract span) { font-size: 0.52rem; }
  .rail :deep(.player-contract strong) { font-size: 0.62rem; }
  .rail :deep(.augment-strip) { gap: 0.28rem; }
  .rail :deep(.augment-gem) { width: 27px; }
  .rail :deep(.pending-indicator) { min-width: 56px; font-size: 0.56rem; }
  .rail :deep(.pending-indicator strong) { font-size: 0.78rem; }
  .rail--top { top: 3px; }
  .rail--bottom { bottom: 58px; }
  .rail--left, .rail--right { width: min(620px, calc(100vh - 180px)); }
  .rail--left { left: 27px; }
  .rail--right { right: 27px; }

  .center-stage { inset: 54px 65px 106px; }
  .table-title p { display: none; }
  .table-title h1 { font-size: 1.05rem; }
  .table-title > span { min-width: 106px; margin-top: 0.16rem; padding: 0.12rem 0.5rem; font-size: 0.62rem; }
  .table-title strong { font-size: 0.88rem; }
  .public-cards { gap: 0.65rem; padding: 0.2rem 0; }
  .deck-action, .current-public-card { width: clamp(58px, 8vw, 70px); gap: 0.2rem; }
  .deck-action > span, .current-public-card > span { font-size: 0.58rem; }
  .deck-action :deep(.ui-button) { display: none; }
  .pending-queue > header { padding: 0.28rem 0.48rem; }
  .pending-queue h2 { font-size: 0.68rem; }
  .pending-list { max-height: 56px; grid-template-columns: repeat(2, minmax(0, 1fr)); }
  .pending-empty { padding: 0.34rem; font-size: 0.58rem; }

  .control-dock { right: 12%; bottom: 4px; left: 12%; min-height: 50px; padding-block: 0.2rem; }
  .control-dock :deep(.ui-button) { min-height: 48px; padding: 0.46rem 0.5rem; font-size: 0.68rem; }
}
</style>
