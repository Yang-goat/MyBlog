<script setup lang="ts">
export type PlayerRailData = {
  id: string;
  name: string;
  seat: "east" | "south" | "west" | "north";
  score: number;
  contract?: { name: string; status: "pending" | "completed" | "abandoned" } | null;
  augments?: Array<{ tier: "silver" | "gold" | "prismatic"; name?: string; used?: boolean; remaining?: number; automatic?: boolean }>;
  pendingCount?: number;
};

defineProps<{
  player: PlayerRailData;
  active?: boolean;
  dealer?: boolean;
}>();

const seatLabels = { east: "东", south: "南", west: "西", north: "北" } as const;
const tierLabels = { silver: "银", gold: "金", prismatic: "彩" } as const;
</script>

<template>
  <section class="player-rail hex-panel" :class="{ 'player-rail--active': active }" :aria-label="`${player.name}的信息`">
    <div class="player-identity">
      <span class="player-wind">{{ seatLabels[player.seat] }}</span>
      <div>
        <div class="player-name-row">
          <strong>{{ player.name }}</strong>
          <span v-if="dealer" class="dealer-mark">庄</span>
        </div>
        <span class="player-score">{{ player.score >= 0 ? "+" : "" }}{{ player.score }}</span>
      </div>
    </div>

    <div class="player-contract" :class="player.contract ? `player-contract--${player.contract.status}` : ''">
      <span>契约</span>
      <strong>{{ player.contract?.name ?? "待选择" }}</strong>
    </div>

    <div class="augment-strip" aria-label="强化状态">
      <div
        v-for="tier in ['silver', 'gold', 'prismatic'] as const"
        :key="tier"
        class="augment-gem"
        :class="[`augment-gem--${tier}`, { 'augment-gem--empty': !player.augments?.find((item) => item.tier === tier) }]"
        :title="player.augments?.find((item) => item.tier === tier)?.name ?? `${tierLabels[tier]}色强化待获取`"
      >
        <span>{{ tierLabels[tier] }}</span>
        <small v-if="player.augments?.find((item) => item.tier === tier)?.used">已用</small>
        <small v-else-if="player.augments?.find((item) => item.tier === tier)?.remaining !== undefined">
          ×{{ player.augments?.find((item) => item.tier === tier)?.remaining }}
        </small>
      </div>
    </div>

    <div class="pending-indicator" :class="{ 'pending-indicator--has': (player.pendingCount ?? 0) > 0 }">
      <span aria-hidden="true">◇</span>
      <span>待处理</span>
      <strong>{{ player.pendingCount ?? 0 }}</strong>
    </div>
  </section>
</template>

<style scoped>
.player-rail {
  display: grid;
  width: 100%;
  min-height: 86px;
  grid-template-columns: minmax(170px, 1.2fr) minmax(130px, 0.9fr) auto minmax(108px, 0.65fr);
  align-items: center;
  gap: clamp(0.6rem, 1.4vw, 1.2rem);
  padding: 0.65rem clamp(0.75rem, 1.4vw, 1.2rem);
  transition: border-color 180ms ease, box-shadow 180ms ease;
}

.player-rail--active {
  border-color: var(--cyan-300);
  box-shadow: inset 0 0 0 2px rgb(6 16 25 / 75%), inset 0 0 34px rgb(29 184 223 / 10%), 0 0 22px rgb(29 184 223 / 16%);
}

.player-identity { display: flex; min-width: 0; align-items: center; gap: 0.8rem; }
.player-wind {
  display: grid;
  width: 48px;
  flex: none;
  aspect-ratio: 1;
  place-items: center;
  border: 1px solid var(--gold-300);
  background: rgb(5 22 35 / 96%);
  color: var(--gold-100);
  font: 700 1.5rem/1 var(--font-display);
  clip-path: polygon(25% 3%, 75% 3%, 98% 50%, 75% 97%, 25% 97%, 2% 50%);
}
.player-name-row { display: flex; align-items: center; gap: 0.55rem; }
.player-name-row strong { overflow: hidden; color: var(--text); font: 700 clamp(0.95rem, 1.6vw, 1.25rem)/1.1 var(--font-display); text-overflow: ellipsis; white-space: nowrap; }
.dealer-mark { border: 1px solid var(--gold-400); padding: 0.12rem 0.28rem; color: var(--gold-200); font-size: 0.65rem; }
.player-score { display: block; margin-top: 0.25rem; color: var(--gold-300); font: 700 1.08rem/1 var(--font-ui); }

.player-contract { display: grid; min-width: 0; gap: 0.18rem; border-left: 1px solid rgb(213 172 84 / 20%); padding-left: 0.9rem; }
.player-contract span { color: var(--muted); font-size: 0.68rem; letter-spacing: 0.12em; }
.player-contract strong { overflow: hidden; color: var(--gold-200); font-size: 0.78rem; text-overflow: ellipsis; white-space: nowrap; }
.player-contract--completed strong { color: var(--success); }
.player-contract--abandoned strong { color: var(--danger); text-decoration: line-through; }

.augment-strip { display: flex; gap: 0.52rem; }
.augment-gem {
  position: relative;
  display: grid;
  width: 43px;
  aspect-ratio: 1;
  place-items: center;
  border: 1px solid currentColor;
  background: rgb(10 24 34 / 90%);
  color: #c7d4db;
  clip-path: polygon(25% 3%, 75% 3%, 98% 50%, 75% 97%, 25% 97%, 2% 50%);
}
.augment-gem::after { position: absolute; inset: 20%; border: 1px solid currentColor; content: ""; transform: rotate(30deg); opacity: 0.75; }
.augment-gem span { z-index: 1; font: 700 0.65rem/1 var(--font-ui); }
.augment-gem small { position: absolute; z-index: 2; right: -5px; bottom: -2px; border: 1px solid currentColor; background: #05121d; padding: 0.08rem 0.18rem; font-size: 0.5rem; }
.augment-gem--gold { color: #e7b642; }
.augment-gem--prismatic { color: #b572ff; background: linear-gradient(135deg, rgb(49 182 221 / 28%), rgb(125 66 196 / 32%)); }
.augment-gem--empty { opacity: 0.28; filter: grayscale(1); }

.pending-indicator { display: flex; min-width: 100px; align-items: center; justify-content: flex-end; gap: 0.35rem; color: var(--muted); font-size: 0.7rem; }
.pending-indicator strong { color: var(--text); font-size: 1rem; }
.pending-indicator--has { color: var(--cyan-300); }
.pending-indicator--has strong { color: var(--cyan-100); }

@media (max-width: 1100px) {
  .player-rail { min-height: 72px; grid-template-columns: minmax(145px, 1fr) minmax(105px, 0.7fr) auto 86px; padding: 0.48rem 0.62rem; }
  .player-wind { width: 38px; }
  .augment-gem { width: 34px; }
  .pending-indicator { min-width: 75px; }
}
</style>
