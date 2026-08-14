<script setup lang="ts">
import { ref } from "vue";
import CardView, { type CardDisplay } from "./CardView.vue";
import UiButton from "./UiButton.vue";

const props = defineProps<{
  title: string;
  subtitle: string;
  playerName: string;
  seat: "east" | "south" | "west" | "north";
  candidates: CardDisplay[];
  selectedId?: string | null;
  playerIndex: number;
  playerCount: number;
}>();

const emit = defineEmits<{
  select: [cardId: string];
  confirm: [];
}>();

const revealedId = ref<string | null>(null);
let holdTimer: ReturnType<typeof setTimeout> | null = null;
let longPressed = false;

function beginReveal(cardId: string) {
  cancelTimer();
  longPressed = false;
  holdTimer = setTimeout(() => {
    longPressed = true;
    revealedId.value = cardId;
  }, 320);
}

function endReveal() {
  cancelTimer();
  revealedId.value = null;
  window.setTimeout(() => { longPressed = false; }, 0);
}

function choose(cardId: string) {
  if (longPressed) return;
  emit("select", cardId);
}

function cancelTimer() {
  if (holdTimer) window.clearTimeout(holdTimer);
  holdTimer = null;
}
</script>

<template>
  <div class="secret-layer" role="dialog" aria-modal="true" :aria-label="title">
    <div class="privacy-curtain" aria-hidden="true">
      <span v-for="n in 12" :key="n" />
    </div>

    <section class="secret-panel hex-panel" :class="`secret-panel--${seat}`">
      <header class="secret-header">
        <span class="secret-progress">{{ playerIndex + 1 }} / {{ playerCount }}</span>
        <div>
          <p>{{ playerName }} · 私密选择</p>
          <h2>{{ title }}</h2>
          <span>{{ subtitle }}</span>
        </div>
      </header>

      <div class="candidate-row" :class="`candidate-row--${candidates.length}`">
        <button
          v-for="card in candidates"
          :key="card.instanceId ?? card.id"
          class="candidate-button"
          :class="{ 'candidate-button--selected': selectedId === (card.instanceId ?? card.id) }"
          type="button"
          :aria-label="`${selectedId === (card.instanceId ?? card.id) ? '已选择' : '选择'}候选卡：${card.name}。${card.text ?? ''}`"
          @keydown.r.prevent="revealedId = card.instanceId ?? card.id"
          @keyup.r.prevent="revealedId = null"
          @blur="endReveal"
          @pointerdown="beginReveal(card.instanceId ?? card.id)"
          @pointerup="endReveal"
          @pointercancel="endReveal"
          @pointerleave="endReveal"
          @contextmenu.prevent
          @click="choose(card.instanceId ?? card.id)"
        >
          <CardView
            :card="card"
            :concealed="revealedId !== (card.instanceId ?? card.id)"
            :selected="selectedId === (card.instanceId ?? card.id)"
            interactive
          />
          <span class="candidate-hint">{{ revealedId === (card.instanceId ?? card.id) ? "松开或移开后隐藏" : selectedId === (card.instanceId ?? card.id) ? "已选 · 长按或按 R 复看" : "长按或按 R 查看 · 轻点选择" }}</span>
        </button>
      </div>

      <footer class="secret-footer">
        <p>卡牌内容在长按或按住 R 时显示；确认后遮回，全部玩家完成后统一公开。</p>
        <UiButton label="确认并遮回" icon="check" variant="gold" :disabled="!selectedId" @click="emit('confirm')" />
      </footer>
    </section>
  </div>
</template>

<style scoped>
.secret-layer {
  position: fixed;
  z-index: 90;
  display: grid;
  inset: 0;
  place-items: center;
  overflow: hidden;
  background: rgb(1 6 11 / 91%);
  backdrop-filter: blur(12px);
}

.privacy-curtain { position: absolute; inset: 0; overflow: hidden; opacity: 0.3; }
.privacy-curtain span { position: absolute; width: 1px; height: 55%; background: linear-gradient(transparent, var(--gold-500), transparent); transform: rotate(35deg); }
.privacy-curtain span:nth-child(1) { left: 8%; top: -8%; }
.privacy-curtain span:nth-child(2) { left: 17%; top: 43%; }
.privacy-curtain span:nth-child(3) { left: 31%; top: -21%; }
.privacy-curtain span:nth-child(4) { left: 43%; top: 50%; }
.privacy-curtain span:nth-child(5) { left: 56%; top: -12%; }
.privacy-curtain span:nth-child(6) { left: 68%; top: 44%; }
.privacy-curtain span:nth-child(7) { left: 82%; top: -16%; }
.privacy-curtain span:nth-child(8) { left: 93%; top: 36%; }
.privacy-curtain span:nth-child(n + 9) { display: none; }

.secret-panel {
  --choice-rotation: 0deg;
  width: min(920px, calc(100vw - 3rem));
  max-height: calc(100vh - 2.5rem);
  overflow: auto;
  padding: clamp(1rem, 2vw, 1.5rem);
  transform: rotate(var(--choice-rotation));
}
.secret-panel--north { --choice-rotation: 180deg; }
.secret-panel--east,
.secret-panel--west { width: min(720px, calc(100vh - 2.5rem)); }
.secret-panel--east { --choice-rotation: 90deg; }
.secret-panel--west { --choice-rotation: -90deg; }

.secret-header { display: flex; align-items: center; justify-content: center; gap: 1.1rem; border-bottom: 1px solid rgb(213 172 84 / 24%); padding-bottom: 0.9rem; text-align: center; }
.secret-header p { margin: 0 0 0.25rem; color: var(--cyan-300); font-size: 0.74rem; letter-spacing: 0.12em; }
.secret-header h2 { margin: 0; color: var(--gold-100); font: 700 clamp(1.45rem, 3vw, 2.2rem)/1.1 var(--font-display); letter-spacing: 0.1em; }
.secret-header div > span { display: block; margin-top: 0.3rem; color: var(--muted); font-size: 0.75rem; }
.secret-progress { display: grid; width: 58px; aspect-ratio: 1; place-items: center; border: 1px solid var(--gold-300); border-radius: 50%; color: var(--gold-100); font: 700 1rem/1 var(--font-ui); }

.candidate-row { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: clamp(0.8rem, 2vw, 1.25rem); width: min(690px, 100%); margin: 1.1rem auto; }
.candidate-row--2 { grid-template-columns: repeat(2, minmax(0, 1fr)); width: min(470px, 100%); }
.candidate-button { display: grid; gap: 0.55rem; min-width: 0; border: 0; outline: 0; background: transparent; color: var(--muted); padding: 0; cursor: pointer; touch-action: none; }
.candidate-button:focus-visible { outline: 2px solid var(--cyan-300); outline-offset: 5px; }
.candidate-button--selected .candidate-hint { color: var(--cyan-100); }
.candidate-hint { min-height: 1rem; color: var(--muted); font-size: clamp(0.64rem, 1.3vw, 0.78rem); }

.secret-footer { display: flex; align-items: center; justify-content: space-between; gap: 1rem; border-top: 1px solid rgb(213 172 84 / 20%); padding-top: 0.9rem; }
.secret-footer p { max-width: 590px; margin: 0; color: var(--muted); font-size: 0.75rem; line-height: 1.5; }

@media (max-height: 680px) {
  .secret-panel { padding: 0.8rem; }
  .candidate-row { margin-block: 0.7rem; }
  .candidate-button :deep(.game-card__content dl) { display: none; }
  .candidate-button :deep(.game-card__content p) { -webkit-line-clamp: 4; }
}
</style>
