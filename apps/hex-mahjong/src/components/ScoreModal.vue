<script setup lang="ts">
import { computed, reactive } from "vue";
import GameModal from "./GameModal.vue";

export type ScorePlayer = { id: string; name: string; total: number };

const props = defineProps<{ players: ScorePlayer[]; round: number }>();
const emit = defineEmits<{ settle: [scores: Record<string, number>]; cancel: [] }>();

const values = reactive<Record<string, string>>(Object.fromEntries(props.players.map((player) => [player.id, "0"])));
const valid = computed(() => props.players.every((player) => /^[-+]?\d+$/.test(values[player.id]?.trim() ?? "")));

function submit() {
  if (!valid.value) return;
  emit("settle", Object.fromEntries(props.players.map((player) => [player.id, Number.parseInt(values[player.id], 10)])));
}
</script>

<template>
  <GameModal
    :title="`第 ${round} 局结算`"
    description="输入四名玩家本局最终净分；正数、0 和负数均可，系统只负责累计。"
    confirm-label="确认本局分数"
    :confirm-disabled="!valid"
    @confirm="submit"
    @cancel="emit('cancel')"
  >
    <div class="score-grid">
      <label v-for="player in players" :key="player.id" class="score-row">
        <span class="score-player">
          <strong>{{ player.name }}</strong>
          <small>当前总分 {{ player.total >= 0 ? "+" : "" }}{{ player.total }}</small>
        </span>
        <input
          v-model="values[player.id]"
          class="text-field score-input"
          type="text"
          inputmode="numeric"
          pattern="[-+]?\d+"
          autocomplete="off"
          :aria-label="`${player.name}本局净分`"
        />
      </label>
    </div>
    <p class="score-reminder">黑色契约若已放弃，请把规则规定的 −1 分直接计入该玩家净分。</p>
  </GameModal>
</template>

<style scoped>
.score-grid { display: grid; gap: 0.65rem; }
.score-row { display: flex; min-height: 64px; align-items: center; justify-content: space-between; gap: 1rem; border-bottom: 1px solid rgb(213 172 84 / 13%); padding: 0.4rem 0; }
.score-player { display: grid; gap: 0.22rem; }
.score-player strong { color: var(--text); font: 700 1.08rem/1.1 var(--font-display); }
.score-player small { color: var(--muted); font-size: 0.72rem; }
.score-input { width: 150px; text-align: center; font-size: 1.15rem; font-weight: 700; }
.score-reminder { margin: 0.9rem 0 0; color: var(--warning); font-size: 0.75rem; }
</style>
