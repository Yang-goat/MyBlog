<script setup lang="ts">
import type { PlayerRailData } from "./PlayerRail.vue";
import GameModal from "./GameModal.vue";

defineProps<{ player: PlayerRailData }>();
const emit = defineEmits<{
  close: [];
  contract: [status: "pending" | "completed" | "abandoned"];
  contractView: [];
  augment: [tier: "silver" | "gold" | "prismatic"];
  augmentView: [tier: "silver" | "gold" | "prismatic"];
}>();

const tierNames = { silver: "银色强化", gold: "金色强化", prismatic: "棱彩强化" } as const;
</script>

<template>
  <GameModal :title="player.name" description="公开个人状态与手动标记" confirm-label="完成" :show-cancel="false" @confirm="emit('close')">
    <section class="detail-section">
      <h3>本局契约</h3>
      <button v-if="player.contract" class="detail-card-link" type="button" @click="emit('contractView')">
        <strong>{{ player.contract.name }}</strong>
        <small>查看完整卡牌正文</small>
      </button>
      <p v-else class="detail-name">尚未选择</p>
      <div v-if="player.contract" class="segment-control">
        <button type="button" :class="{ active: player.contract.status === 'pending' }" @click="emit('contract', 'pending')">未完成</button>
        <button type="button" :class="{ active: player.contract.status === 'completed' }" @click="emit('contract', 'completed')">已完成</button>
        <button type="button" :class="{ active: player.contract.status === 'abandoned' }" @click="emit('contract', 'abandoned')">已放弃</button>
      </div>
      <p v-if="player.contract?.status === 'abandoned'" class="warning-copy">黑色契约放弃产生的 −1 分请在本局净分中手动计入。</p>
    </section>

    <section class="detail-section">
      <h3>强化使用状态</h3>
      <div class="augment-list">
        <article
          v-for="augment in player.augments ?? []"
          :key="augment.tier"
          :class="[`augment-row--${augment.tier}`, { used: augment.used }]"
        >
          <button class="augment-card" type="button" @click="emit('augmentView', augment.tier)">
            <span><small>{{ tierNames[augment.tier] }}</small><strong>{{ augment.name ?? "待获取" }}</strong></span>
            <em>查看完整正文</em>
          </button>
          <button class="augment-use" type="button" :disabled="augment.automatic" @click="emit('augment', augment.tier)">
            <template v-if="augment.automatic">自动生效</template>
            <template v-else-if="augment.remaining !== undefined">剩余 {{ augment.remaining }} 次 · 调整</template>
            <template v-else>{{ augment.used ? "已使用 · 点此撤回" : "标记本局使用" }}</template>
          </button>
        </article>
        <p v-if="!(player.augments?.length)">本场尚未获得强化。</p>
      </div>
    </section>
  </GameModal>
</template>

<style scoped>
.detail-section + .detail-section { margin-top: 1.2rem; border-top: 1px solid rgb(213 172 84 / 16%); padding-top: 1.2rem; }
h3 { margin: 0 0 0.65rem; color: var(--gold-200); font-size: 0.82rem; letter-spacing: 0.1em; }
.detail-name { margin: 0 0 0.65rem; color: var(--text); font: 700 1.15rem/1.3 var(--font-display); }
.detail-card-link { display: flex; width: 100%; min-height: 58px; align-items: center; justify-content: space-between; gap: 1rem; border: 1px solid rgb(213 172 84 / 28%); background: rgb(4 18 29 / 88%); color: var(--text); padding: 0.65rem 0.75rem; text-align: left; cursor: pointer; }
.detail-card-link:hover, .detail-card-link:focus-visible { border-color: var(--cyan-300); outline: none; }
.detail-card-link strong { font: 700 1.05rem/1.2 var(--font-display); }
.detail-card-link small { color: var(--cyan-300); font-size: 0.68rem; }
.segment-control { display: grid; grid-template-columns: repeat(3, 1fr); }
.segment-control button { min-height: 48px; border: 1px solid rgb(213 172 84 / 25%); background: #05131f; color: var(--muted); cursor: pointer; }
.segment-control button.active { border-color: var(--cyan-400); background: rgb(11 71 91 / 45%); color: var(--cyan-100); }
.warning-copy { margin: 0.55rem 0 0; color: var(--warning); font-size: 0.72rem; }
.augment-list { display: grid; gap: 0.5rem; }
.augment-list article { display: grid; grid-template-columns: minmax(0, 1fr) auto; border: 1px solid currentColor; background: rgb(4 16 26 / 90%); color: #c8d5de; }
.augment-card, .augment-use { min-height: 52px; border: 0; background: transparent; color: inherit; padding: 0.6rem 0.8rem; cursor: pointer; }
.augment-card { display: flex; min-width: 0; align-items: center; justify-content: space-between; gap: 0.7rem; text-align: left; }
.augment-card > span { display: grid; min-width: 0; gap: 0.18rem; }
.augment-card:hover, .augment-card:focus-visible { background: rgb(23 92 113 / 22%); outline: 1px solid var(--cyan-300); }
.augment-use { min-width: 150px; border-left: 1px solid currentColor; background: rgb(2 11 19 / 48%); font-size: 0.66rem; }
.augment-use:hover:not(:disabled), .augment-use:focus-visible { background: rgb(23 92 113 / 26%); outline: 1px solid currentColor; }
.augment-use:disabled { cursor: default; opacity: 0.62; }
.augment-list small { color: currentColor; font-size: 0.58rem; letter-spacing: 0.12em; }
.augment-list strong { color: var(--text); font-family: var(--font-display); }
.augment-list em { color: var(--muted); font-size: 0.7rem; font-style: normal; }
.augment-list article.used .augment-card { opacity: 0.62; }
.augment-row--gold { color: var(--gold-300) !important; }
.augment-row--prismatic { color: var(--violet-300) !important; }
.augment-list p { color: var(--muted); font-size: 0.78rem; }
</style>
