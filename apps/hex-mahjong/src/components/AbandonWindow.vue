<script setup lang="ts">
import { computed, ref } from "vue";
import UiButton from "./UiButton.vue";

export type AbandonPlayer = {
  id: string;
  name: string;
  seat: "east" | "south" | "west" | "north";
};

const props = defineProps<{ players: AbandonPlayer[] }>();
const emit = defineEmits<{
  complete: [decisions: Record<string, "pending" | "abandoned">];
  cancel: [];
}>();

const playerIndex = ref(0);
const decisions = ref<Record<string, "pending" | "abandoned">>({});
const activePlayer = computed(() => props.players[playerIndex.value]);

function decide(status: "pending" | "abandoned") {
  const player = activePlayer.value;
  if (!player) return;
  decisions.value[player.id] = status;
  if (playerIndex.value >= props.players.length - 1) {
    emit("complete", { ...decisions.value });
  } else {
    playerIndex.value += 1;
  }
}
</script>

<template>
  <div class="abandon-layer" role="dialog" aria-modal="true" aria-label="契约弃约窗口">
    <section v-if="activePlayer" class="abandon-panel hex-panel" :class="`abandon-panel--${activePlayer.seat}`">
      <header>
        <span>{{ playerIndex + 1 }} / {{ players.length }}</span>
        <div>
          <p>{{ activePlayer.name }} · 私密确认</p>
          <h2>是否放弃本局契约？</h2>
        </div>
      </header>
      <div class="abandon-copy">
        <strong>确认牌墙已剩 24 张或更少</strong>
        <p>保留契约则继续尝试；放弃后本局不可恢复。黑色契约的 −1 分请在本局净分中手动计入。</p>
      </div>
      <footer>
        <UiButton label="暂不开放窗口" variant="quiet" @click="emit('cancel')" />
        <div>
          <UiButton label="保留契约" icon="check" variant="primary" @click="decide('pending')" />
          <UiButton label="放弃契约" icon="close" variant="danger" @click="decide('abandoned')" />
        </div>
      </footer>
    </section>
  </div>
</template>

<style scoped>
.abandon-layer { position: fixed; z-index: 92; display: grid; inset: 0; place-items: center; overflow: hidden; background: rgb(1 6 11 / 93%); backdrop-filter: blur(12px); }
.abandon-panel { --rotation: 0deg; width: min(760px, calc(100vw - 3rem)); padding: clamp(1rem, 2.5vw, 1.6rem); transform: rotate(var(--rotation)); }
.abandon-panel--north { --rotation: 180deg; }
.abandon-panel--east, .abandon-panel--west { width: min(650px, calc(100vh - 3rem)); }
.abandon-panel--east { --rotation: 90deg; }
.abandon-panel--west { --rotation: -90deg; }
header { display: flex; align-items: center; justify-content: center; gap: 1rem; border-bottom: 1px solid rgb(213 172 84 / 24%); padding-bottom: 0.9rem; text-align: center; }
header > span { display: grid; width: 54px; aspect-ratio: 1; place-items: center; border: 1px solid var(--gold-300); border-radius: 50%; color: var(--gold-100); font-weight: 700; }
header p { margin: 0 0 0.3rem; color: var(--cyan-300); font-size: 0.72rem; letter-spacing: 0.13em; }
h2 { margin: 0; color: var(--gold-100); font: 700 clamp(1.4rem, 3vw, 2rem)/1.1 var(--font-display); letter-spacing: 0.08em; }
.abandon-copy { padding: 1.5rem 1rem; text-align: center; }
.abandon-copy strong { color: var(--warning); font-size: 0.82rem; letter-spacing: 0.08em; }
.abandon-copy p { max-width: 560px; margin: 0.55rem auto 0; color: var(--muted); font-size: 0.78rem; line-height: 1.6; }
footer { display: flex; align-items: center; justify-content: space-between; gap: 1rem; border-top: 1px solid rgb(213 172 84 / 20%); padding-top: 0.9rem; }
footer > div { display: flex; gap: 0.6rem; }
</style>
