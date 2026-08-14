<script setup lang="ts">
import { computed, ref } from "vue";
import { useRegisterSW } from "virtual:pwa-register/vue";
import AbandonWindow from "./components/AbandonWindow.vue";
import CardView, { type CardDisplay } from "./components/CardView.vue";
import DrawOwnerModal from "./components/DrawOwnerModal.vue";
import FinalResults from "./components/FinalResults.vue";
import GameModal from "./components/GameModal.vue";
import PlayerDetailModal from "./components/PlayerDetailModal.vue";
import RoundTransition from "./components/RoundTransition.vue";
import ScoreModal from "./components/ScoreModal.vue";
import SecretChoiceOverlay from "./components/SecretChoiceOverlay.vue";
import SettingsModal from "./components/SettingsModal.vue";
import SetupScreen, { type SetupPayload } from "./components/SetupScreen.vue";
import TableScreen from "./components/TableScreen.vue";
import UiButton from "./components/UiButton.vue";
import { useGameHost } from "./composables/useGameHost";
import { getCardDefinition } from "./data";
import { getPendingItems, rankPlayers } from "./domain";
import { MODE_LABELS, cardByInstance, instanceDisplay, pendingCardDisplays, playerDisplay } from "./presentation";

const {
  match,
  loading,
  saveState,
  storageWarning,
  actionError,
  createGame,
  startNextRound,
  chooseSecret,
  confirmSecret,
  drawCard,
  updateCardStatus,
  updateContractStatus,
  toggleAugment,
  resolveAbandonWindow,
  submitScores,
  confirmPendingSettlement,
  undo,
  clearGame,
  dismissActionError,
} = useGameHost();

const { offlineReady, needRefresh, updateServiceWorker } = useRegisterSW({
  onRegisterError(error) {
    console.error("Service Worker registration failed", error);
  },
});

const scoreOpen = ref(false);
const settingsOpen = ref(false);
const drawKind = ref<"opportunity" | "fun" | null>(null);
const abandonOpen = ref(false);
const selectedPlayerId = ref<string | null>(null);
const selectedCard = ref<CardDisplay | null>(null);
const confirmNewMatch = ref(false);
const appNotice = ref<string | null>(null);
const pendingWarningDismissed = ref(false);

const tablePlayers = computed(() => match.value?.players.map((player) => playerDisplay(match.value!, player)) ?? []);
const currentRound = computed(() => match.value?.currentRound ?? null);
const secretSelection = computed(() => currentRound.value?.secretSelection ?? null);
const secretPlayer = computed(() => {
  const state = match.value;
  const selection = secretSelection.value;
  if (!state || !selection) return null;
  return state.players.find((player) => !selection.confirmedPlayerIds.includes(player.id)) ?? null;
});
const secretCandidates = computed<CardDisplay[]>(() => {
  const selection = secretSelection.value;
  const player = secretPlayer.value;
  if (!selection || !player) return [];
  return selection.candidates[player.id].map((instance) => ({
    ...cardByInstance(instance),
    instanceId: instance.instanceId,
  }));
});
const secretTitle = computed(() => {
  const selection = secretSelection.value;
  if (!selection) return "私密选择";
  if (selection.kind === "contract") return "选择本局契约";
  return `${{ silver: "银色", gold: "金色", prismatic: "棱彩" }[selection.tier ?? "silver"]}强化二选一`;
});
const secretSubtitle = computed(() => secretSelection.value?.kind === "contract"
  ? "长按查看牌面，轻点选择；其余玩家看不到内容"
  : "本次选择会保留到整场结束或被新强化替换");
const selectedSecretId = computed(() => {
  const selection = secretSelection.value;
  const player = secretPlayer.value;
  return selection && player ? selection.selections[player.id] : null;
});
const rankings = computed(() => match.value
  ? rankPlayers(match.value).map((item) => ({
      rank: item.rank,
      id: item.playerId,
      name: item.name,
      score: item.totalScore,
    }))
  : []);
const selectedPlayer = computed(() => {
  const state = match.value;
  const id = selectedPlayerId.value;
  if (!state || !id) return null;
  const player = state.players.find((candidate) => candidate.id === id);
  return player ? playerDisplay(state, player) : null;
});
const abandonPlayers = computed(() => tablePlayers.value
  .filter((player) => player.contract?.status === "pending")
  .map(({ id, name, seat }) => ({ id, name, seat })));
const pendingItems = computed(() => {
  const state = match.value;
  return state?.currentRound ? getPendingItems(state) : [];
});
const pendingDescription = computed(() => pendingItems.value.map((item) => {
  const definition = getCardDefinition(item.cardId);
  const owner = match.value?.players.find((player) => player.id === item.playerId)?.name ?? "公共";
  return `${owner} · ${definition.name}`;
}));
const settlementNeedsConfirmation = computed(() => Boolean(
  match.value?.phase === "settlement" && currentRound.value?.settlementNeedsConfirmation && !pendingWarningDismissed.value,
));

function handleCreate(payload: SetupPayload) {
  createGame(payload.mode, payload.playerNames);
}

function requestDraw(kind: "opportunity" | "fun") {
  if (match.value?.phase !== "playing") return;
  drawKind.value = kind;
}

function finishDraw(playerId?: string) {
  if (!drawKind.value) return;
  drawCard(drawKind.value, playerId);
  drawKind.value = null;
}

function requestSettlement() {
  if (match.value?.phase === "playing") scoreOpen.value = true;
}

function finishSettlement(scores: Record<string, number>) {
  scoreOpen.value = false;
  pendingWarningDismissed.value = false;
  submitScores(scores);
}

function finishPendingSettlement() {
  pendingWarningDismissed.value = false;
  confirmPendingSettlement();
}

function requestAbandonWindow() {
  if (match.value?.phase !== "playing") return;
  if (abandonPlayers.value.length === 0) {
    showNotice("当前没有仍待完成的契约。");
    return;
  }
  abandonOpen.value = true;
}

function finishAbandonWindow(decisions: Record<string, "pending" | "abandoned">) {
  resolveAbandonWindow(decisions);
  abandonOpen.value = false;
}

function showNotice(message: string) {
  appNotice.value = message;
  window.setTimeout(() => {
    if (appNotice.value === message) appNotice.value = null;
  }, 4200);
}

function showContractCard(playerId: string) {
  const contract = match.value?.players.find((player) => player.id === playerId)?.contract;
  if (contract) selectedCard.value = cardByInstance(contract);
}

function showAugmentCard(playerId: string, tier: "silver" | "gold" | "prismatic") {
  const augment = match.value?.players.find((player) => player.id === playerId)?.augments[tier];
  if (augment) selectedCard.value = cardByInstance(augment.card);
}

async function startFreshMatch() {
  const cleared = await clearGame();
  if (cleared) {
    confirmNewMatch.value = false;
    settingsOpen.value = false;
    selectedPlayerId.value = null;
  }
}
</script>

<template>
  <div class="app-root">
    <main v-if="loading" class="loading-screen">
      <img src="/art/app-icon-192.png" alt="" />
      <h1>海克斯麻将</h1>
      <p>正在恢复本机比赛…</p>
    </main>

    <SetupScreen v-else-if="!match" @create="handleCreate" />

    <FinalResults
      v-else-if="match.phase === 'finished'"
      :rankings="rankings"
      :can-undo="match.undoStack.length > 0"
      @undo="undo"
      @new-match="confirmNewMatch = true"
    />

    <RoundTransition
      v-else-if="match.phase === 'ready' && !currentRound"
      :completed-rounds="match.roundRecords.length"
      :rankings="rankings"
      :can-undo="match.undoStack.length > 0"
      @start="startNextRound"
      @undo="undo"
      @settings="settingsOpen = true"
    />

    <TableScreen
      v-else-if="currentRound"
      :players="tablePlayers"
      :round="currentRound.number"
      :mode-label="MODE_LABELS[match.mode]"
      :world-card="instanceDisplay(currentRound.worldCard)"
      :treasure-card="instanceDisplay(currentRound.treasureCard)"
      :pending-cards="pendingCardDisplays(match)"
      :dealer-id="currentRound.dealerPlayerId"
      :can-undo="match.undoStack.length > 0"
      :fun-enabled="match.mode !== 'strategy'"
      :abandon-opened="currentRound.contractAbandonWindowOpened"
      :can-draw="match.phase === 'playing'"
      :can-abandon="match.phase === 'playing'"
      :can-settle="match.phase === 'playing'"
      :save-state="saveState"
      @draw="requestDraw"
      @settle="requestSettlement"
      @abandon="requestAbandonWindow"
      @undo="undo"
      @settings="settingsOpen = true"
      @player="selectedPlayerId = $event"
      @card="selectedCard = $event"
      @status="updateCardStatus"
    />

    <SecretChoiceOverlay
      v-if="match && secretPlayer && secretSelection"
      :title="secretTitle"
      :subtitle="secretSubtitle"
      :player-name="secretPlayer.name"
      :seat="playerDisplay(match, secretPlayer).seat"
      :candidates="secretCandidates"
      :selected-id="selectedSecretId"
      :player-index="match.players.findIndex((player) => player.id === secretPlayer?.id)"
      :player-count="match.players.length"
      @select="chooseSecret(secretPlayer.id, $event)"
      @confirm="confirmSecret(secretPlayer.id)"
    />

    <DrawOwnerModal
      v-if="drawKind && match"
      :kind="drawKind"
      :players="match.players"
      @choose="finishDraw"
      @cancel="drawKind = null"
    />

    <AbandonWindow
      v-if="abandonOpen"
      :players="abandonPlayers"
      @complete="finishAbandonWindow"
      @cancel="abandonOpen = false"
    />

    <ScoreModal
      v-if="scoreOpen && match && currentRound"
      :round="currentRound.number"
      :players="match.players.map((player) => ({ id: player.id, name: player.name, total: player.totalScore }))"
      @settle="finishSettlement"
      @cancel="scoreOpen = false"
    />

    <GameModal
      v-if="settlementNeedsConfirmation"
      title="仍有待处理项目"
      description="分数已暂存，但尚未计入总分。请核对这些卡牌或契约；也可以明确确认后继续结算。"
      confirm-label="仍然确认结算"
      confirm-variant="danger"
      cancel-label="返回处理"
      @confirm="finishPendingSettlement"
      @cancel="pendingWarningDismissed = true"
    >
      <ul class="pending-confirm-list">
        <li v-for="item in pendingDescription" :key="item">{{ item }}</li>
      </ul>
    </GameModal>

    <div v-if="match?.phase === 'settlement' && pendingWarningDismissed" class="settlement-bar hex-panel" role="status">
      <span>本局分数已暂存，处理待办后继续结算</span>
      <UiButton label="继续结算" icon="score" variant="gold" @click="pendingWarningDismissed = false" />
    </div>

    <PlayerDetailModal
      v-if="selectedPlayer"
      :player="selectedPlayer"
      @close="selectedPlayerId = null"
      @contract="updateContractStatus(selectedPlayer.id, $event)"
      @contract-view="showContractCard(selectedPlayer.id)"
      @augment="toggleAugment(selectedPlayer.id, $event)"
      @augment-view="showAugmentCard(selectedPlayer.id, $event)"
    />

    <SettingsModal
      v-if="settingsOpen"
      :offline-ready="offlineReady"
      :storage-warning="storageWarning"
      @close="settingsOpen = false"
      @new-match="confirmNewMatch = true"
    />

    <GameModal
      v-if="selectedCard"
      :title="selectedCard.name"
      :description="`${selectedCard.category} · ${selectedCard.id}`"
      confirm-label="关闭"
      :show-cancel="false"
      @confirm="selectedCard = null"
    >
      <div class="card-detail">
        <CardView :card="selectedCard" />
        <div>
          <p>{{ selectedCard.text }}</p>
          <dl>
            <template v-if="selectedCard.timing"><dt>时机</dt><dd>{{ selectedCard.timing }}</dd></template>
            <template v-if="selectedCard.duration"><dt>持续</dt><dd>{{ selectedCard.duration }}</dd></template>
            <template v-if="selectedCard.frequency"><dt>频率</dt><dd>{{ selectedCard.frequency }}</dd></template>
            <template v-if="selectedCard.validation"><dt>验收</dt><dd>{{ selectedCard.validation }}</dd></template>
          </dl>
        </div>
      </div>
    </GameModal>

    <GameModal
      v-if="confirmNewMatch"
      title="确认开始新一场？"
      description="当前八局进度、积分、强化、契约与撤销记录都会从本设备清除。此操作无法撤销。"
      confirm-label="清空并重新开始"
      confirm-variant="danger"
      @confirm="startFreshMatch"
      @cancel="confirmNewMatch = false"
    />

    <div v-if="needRefresh" class="update-toast hex-panel" role="status">
      <span>新版本已就绪</span>
      <UiButton label="安全更新" variant="primary" @click="updateServiceWorker(true)" />
    </div>

    <button v-if="actionError || appNotice" type="button" class="app-toast" @click="dismissActionError(); appNotice = null">
      {{ actionError ?? appNotice }}
    </button>

    <div v-if="!match && storageWarning" class="storage-banner" role="alert">{{ storageWarning }}</div>

    <aside class="orientation-gate" aria-live="polite">
      <img src="/art/app-icon-192.png" alt="" />
      <h2>请横放设备</h2>
      <p>主持台按四人围桌设计，横屏后会自动恢复。</p>
    </aside>
  </div>
</template>

<style scoped>
.app-root { width: 100%; height: 100%; min-height: 100%; }
.loading-screen { display: grid; width: 100%; height: 100%; place-content: center; justify-items: center; background: radial-gradient(circle, #0b3c53, #020910 68%); }
.loading-screen img { width: 94px; filter: drop-shadow(0 0 26px rgb(29 184 223 / 28%)); }
.loading-screen h1 { margin: 0.8rem 0 0; color: var(--gold-100); font: 700 2rem/1 var(--font-display); letter-spacing: 0.12em; }
.loading-screen p { color: var(--muted); font-size: 0.78rem; }
.pending-confirm-list { display: grid; max-height: 250px; gap: 0.45rem; overflow: auto; margin: 0; padding: 0; list-style: none; }
.pending-confirm-list li { border-left: 2px solid var(--warning); background: rgb(98 62 15 / 18%); color: var(--text); padding: 0.62rem 0.75rem; font-size: 0.78rem; }
.card-detail { display: grid; grid-template-columns: minmax(180px, 230px) 1fr; gap: 1.1rem; align-items: start; }
.card-detail > div > p { margin: 0; color: var(--text); font-size: 0.86rem; line-height: 1.75; white-space: pre-line; }
.card-detail dl { display: grid; grid-template-columns: auto 1fr; gap: 0.45rem 0.7rem; margin: 0.9rem 0 0; font-size: 0.74rem; }
.card-detail dt { color: var(--gold-200); }
.card-detail dd { margin: 0; color: var(--muted); }
.update-toast { position: fixed; z-index: 110; display: flex; right: 1rem; bottom: 1rem; align-items: center; gap: 0.8rem; padding: 0.55rem 0.65rem 0.55rem 0.9rem; color: var(--text); font-size: 0.76rem; }
.update-toast :deep(.ui-button) { min-height: 38px; padding: 0.5rem 0.7rem; font-size: 0.72rem; }
.settlement-bar { position: fixed; z-index: 70; display: flex; right: 1rem; bottom: 1rem; align-items: center; gap: 0.8rem; padding: 0.5rem 0.6rem 0.5rem 0.85rem; color: var(--warning); font-size: 0.72rem; }
.settlement-bar :deep(.ui-button) { min-height: 40px; padding: 0.52rem 0.75rem; font-size: 0.72rem; }
.app-toast { position: fixed; z-index: 120; top: 1rem; left: 50%; max-width: min(620px, calc(100vw - 2rem)); border: 1px solid var(--warning); background: rgb(55 31 9 / 96%); box-shadow: 0 12px 35px rgb(0 0 0 / 45%); color: #ffe8a8; padding: 0.75rem 1rem; font-size: 0.76rem; transform: translateX(-50%); cursor: pointer; }
.storage-banner { position: fixed; z-index: 20; right: 1rem; top: 1rem; left: 1rem; border: 1px solid var(--danger); background: rgb(74 19 30 / 92%); color: #ffc3cb; padding: 0.7rem; text-align: center; font-size: 0.75rem; }
.orientation-gate { position: fixed; z-index: 200; display: none; inset: 0; place-content: center; justify-items: center; background: radial-gradient(circle, #0b3c53, #020910 70%); text-align: center; }
.orientation-gate img { width: 86px; }
.orientation-gate h2 { margin: 1rem 0 0; color: var(--gold-100); font: 700 1.8rem/1.1 var(--font-display); }
.orientation-gate p { max-width: 280px; margin: 0.55rem 0 0; color: var(--muted); font-size: 0.78rem; line-height: 1.6; }
@media (orientation: portrait) and (max-width: 900px) { .orientation-gate { display: grid; } }
@media (max-width: 720px) { .card-detail { grid-template-columns: 1fr; } .card-detail > :first-child { width: min(230px, 70%); justify-self: center; } }
</style>
