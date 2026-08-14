<script setup lang="ts">
import GameModal from "./GameModal.vue";

defineProps<{
  kind: "opportunity" | "fun";
  players: Array<{ id: string; name: string }>;
}>();

const emit = defineEmits<{ choose: [playerId?: string]; cancel: [] }>();
</script>

<template>
  <GameModal
    :title="kind === 'opportunity' ? '抽取机遇牌' : '抽取欢乐挑战'"
    description="选择这张牌的归属；公共牌会显示为“公共”，个人牌会记入对应玩家的待处理区。"
    :show-cancel="false"
    confirm-label="取消"
    confirm-variant="quiet"
    @confirm="emit('cancel')"
  >
    <div class="owner-grid">
      <button type="button" class="owner-option owner-option--public" @click="emit('choose')">
        <span>公共</span>
        <strong>全桌共同执行</strong>
      </button>
      <button v-for="player in players" :key="player.id" type="button" class="owner-option" @click="emit('choose', player.id)">
        <span>个人</span>
        <strong>{{ player.name }}</strong>
      </button>
    </div>
  </GameModal>
</template>

<style scoped>
.owner-grid { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 0.65rem; }
.owner-option { display: grid; min-height: 76px; place-items: center; gap: 0.22rem; border: 1px solid rgb(213 172 84 / 26%); background: rgb(3 17 28 / 82%); color: var(--text); cursor: pointer; }
.owner-option:hover, .owner-option:focus-visible { border-color: var(--cyan-300); background: rgb(6 48 65 / 68%); outline: none; }
.owner-option span { color: var(--muted); font-size: 0.65rem; letter-spacing: 0.14em; }
.owner-option strong { font: 700 1rem/1.2 var(--font-display); }
.owner-option--public { border-color: rgb(99 222 243 / 45%); color: var(--cyan-100); }
</style>
