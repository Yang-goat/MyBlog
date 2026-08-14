<script setup lang="ts">
import { computed } from "vue";

export type CardDisplay = {
  id: string;
  instanceId?: string;
  name: string;
  category: string;
  text?: string;
  body?: string;
  timing?: string;
  duration?: string;
  frequency?: string;
  validation?: string;
};

const props = withDefaults(defineProps<{
  card?: CardDisplay | null;
  concealed?: boolean;
  selected?: boolean;
  compact?: boolean;
  interactive?: boolean;
  status?: "pending" | "completed" | "skipped" | null;
}>(), {
  card: null,
  concealed: false,
  selected: false,
  compact: false,
  interactive: false,
  status: null,
});

const categoryClass = computed(() => {
  const category = props.card?.category ?? "unknown";
  if (category.includes("世界")) return "world";
  if (category.includes("机遇")) return "opportunity";
  if (category.includes("欢乐")) return "challenge";
  if (category.includes("银色")) return "silver";
  if (category.includes("金色")) return "gold";
  if (category.includes("棱彩")) return "prismatic";
  if (category.includes("黑色")) return "black-contract";
  if (category.includes("契约")) return "contract";
  if (category.includes("宝牌")) return "treasure";
  return "unknown";
});

const cardText = computed(() => props.card?.text ?? props.card?.body ?? "");
</script>

<template>
  <article
    class="game-card"
    :class="[
      `game-card--${categoryClass}`,
      { 'game-card--concealed': concealed, 'game-card--selected': selected, 'game-card--compact': compact, 'game-card--interactive': interactive },
    ]"
  >
    <template v-if="!concealed && card">
      <div class="game-card__art" aria-hidden="true">
        <span class="game-card__sigil" />
      </div>
      <header class="game-card__header">
        <span>{{ card.category }}</span>
        <span>{{ card.id }}</span>
      </header>
      <div class="game-card__content">
        <h3>{{ card.name }}</h3>
        <p>{{ cardText }}</p>
        <dl v-if="!compact && (card.timing || card.duration || card.frequency)">
          <template v-if="card.timing"><dt>时机</dt><dd>{{ card.timing }}</dd></template>
          <template v-if="card.duration"><dt>持续</dt><dd>{{ card.duration }}</dd></template>
          <template v-if="card.frequency"><dt>频率</dt><dd>{{ card.frequency }}</dd></template>
        </dl>
      </div>
      <footer class="game-card__footer">
        <span>海克斯麻将 · V1.2</span>
        <span v-if="status" class="game-card__status" :class="`game-card__status--${status}`">
          {{ status === "pending" ? "待执行" : status === "completed" ? "已完成" : "跳过/无效" }}
        </span>
      </footer>
    </template>

    <template v-else>
      <div class="game-card__back-frame">
        <span class="game-card__back-sigil"><i /></span>
        <small>{{ card?.category ?? "海克斯卡牌" }}</small>
      </div>
    </template>
  </article>
</template>

<style scoped>
.game-card {
  --card-accent: var(--cyan-400);
  --card-accent-soft: rgb(29 184 223 / 18%);
  --atlas-x: 0%;
  --atlas-y: 0%;
  position: relative;
  display: grid;
  width: 100%;
  min-width: 0;
  aspect-ratio: 0.72;
  grid-template-rows: auto 33% 1fr auto;
  overflow: hidden;
  border: 1px solid color-mix(in srgb, var(--card-accent) 72%, var(--gold-300));
  border-radius: 4px;
  background:
    linear-gradient(180deg, transparent 26%, rgb(2 11 19 / 66%) 48%, rgb(2 9 16 / 97%) 100%),
    radial-gradient(circle at 50% 22%, var(--card-accent-soft), transparent 46%),
    #061420;
  box-shadow: inset 0 0 0 3px rgb(2 8 13 / 85%), inset 0 0 0 4px rgb(213 172 84 / 16%), 0 14px 30px rgb(0 0 0 / 42%);
  color: var(--text);
  container-type: inline-size;
  transition: transform 180ms ease, box-shadow 180ms ease, border-color 180ms ease;
}

.game-card::before,
.game-card::after {
  position: absolute;
  z-index: 4;
  top: 22%;
  width: 12px;
  aspect-ratio: 1;
  border: 1px solid var(--gold-300);
  background: var(--ink-900);
  content: "";
  transform: rotate(45deg);
}
.game-card::before { left: -7px; }
.game-card::after { right: -7px; }

.game-card--interactive { cursor: pointer; }
.game-card--interactive:hover { transform: translateY(-4px); }
.game-card--selected {
  border-color: var(--cyan-100);
  box-shadow: inset 0 0 0 3px rgb(2 8 13 / 85%), inset 0 0 0 4px rgb(99 222 243 / 25%), 0 0 24px color-mix(in srgb, var(--card-accent) 50%, transparent);
  transform: translateY(-6px);
}

.game-card--opportunity { --card-accent: #27dce8; --card-accent-soft: rgb(39 220 232 / 20%); --atlas-x: 50%; --atlas-y: 0%; }
.game-card--challenge { --card-accent: #c653e8; --card-accent-soft: rgb(198 83 232 / 21%); --atlas-x: 100%; --atlas-y: 0%; }
.game-card--silver { --card-accent: #c8d5de; --card-accent-soft: rgb(200 213 222 / 19%); --atlas-x: 0%; --atlas-y: 50%; }
.game-card--gold { --card-accent: #f0b831; --card-accent-soft: rgb(240 184 49 / 22%); --atlas-x: 50%; --atlas-y: 50%; }
.game-card--prismatic { --card-accent: #b46cff; --card-accent-soft: rgb(95 201 255 / 22%); --atlas-x: 100%; --atlas-y: 50%; }
.game-card--contract { --card-accent: #d6aa50; --card-accent-soft: rgb(214 170 80 / 18%); --atlas-x: 0%; --atlas-y: 100%; }
.game-card--black-contract { --card-accent: #d14c68; --card-accent-soft: rgb(209 76 104 / 20%); --atlas-x: 50%; --atlas-y: 100%; }
.game-card--treasure { --card-accent: #e6c35d; --card-accent-soft: rgb(26 207 190 / 20%); --atlas-x: 100%; --atlas-y: 100%; }

.game-card__header {
  z-index: 2;
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-bottom: 1px solid color-mix(in srgb, var(--card-accent) 45%, transparent);
  padding: 0.48rem 0.62rem 0.42rem;
  color: color-mix(in srgb, var(--card-accent) 78%, white);
  font: 700 clamp(0.45rem, 5cqw, 0.7rem)/1 var(--font-ui);
}

.game-card__art {
  position: relative;
  display: grid;
  place-items: center;
  background-image:
    linear-gradient(180deg, rgb(2 10 17 / 4%), rgb(2 10 17 / 55%)),
    url("/art/card-art-atlas.webp");
  background-position: center, var(--atlas-x) var(--atlas-y);
  background-size: cover, 300% 300%;
}

.game-card__art::before {
  position: absolute;
  inset: 0;
  background: radial-gradient(circle, var(--card-accent-soft), transparent 62%);
  content: "";
}

.game-card__sigil {
  position: relative;
  width: 30%;
  aspect-ratio: 1;
  border: 2px solid var(--card-accent);
  filter: drop-shadow(0 0 9px var(--card-accent));
  transform: rotate(30deg);
}
.game-card__sigil::after {
  position: absolute;
  inset: 24%;
  border: 1px solid var(--gold-200);
  content: "";
  transform: rotate(30deg);
}

.game-card__content { z-index: 2; min-height: 0; padding: 0.62rem; }
.game-card__content h3 {
  margin: 0 0 0.45rem;
  overflow: hidden;
  color: #fff8df;
  font: 700 clamp(0.8rem, 10cqw, 1.3rem)/1.15 var(--font-display);
  letter-spacing: 0.06em;
  text-align: center;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.game-card__content p {
  display: -webkit-box;
  margin: 0;
  overflow: hidden;
  color: #d7d7ce;
  font-size: clamp(0.52rem, 5.6cqw, 0.76rem);
  line-height: 1.52;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 6;
}
.game-card__content dl {
  display: grid;
  grid-template-columns: auto 1fr;
  gap: 0.18rem 0.45rem;
  margin: 0.5rem 0 0;
  color: var(--muted);
  font-size: clamp(0.42rem, 4.5cqw, 0.62rem);
}
.game-card__content dt { color: color-mix(in srgb, var(--card-accent) 72%, white); }
.game-card__content dd { margin: 0; }

.game-card__footer {
  z-index: 2;
  display: flex;
  min-height: 22px;
  align-items: center;
  justify-content: space-between;
  border-top: 1px solid rgb(213 172 84 / 19%);
  padding: 0.32rem 0.55rem;
  color: var(--muted);
  font-size: clamp(0.36rem, 4cqw, 0.58rem);
}
.game-card__status { color: var(--warning); }
.game-card__status--completed { color: var(--success); }
.game-card__status--skipped { color: var(--danger); }

.game-card--compact .game-card__content dl { display: none; }
.game-card--compact .game-card__content p { -webkit-line-clamp: 4; }

.game-card--concealed {
  display: block;
  background-image:
    linear-gradient(145deg, rgb(7 31 48 / 12%), rgb(2 10 17 / 28%)),
    url("/art/card-back-atlas.webp");
  background-position: center, var(--atlas-x) var(--atlas-y);
  background-size: cover, 300% 300%;
}
.game-card--concealed .game-card__back-frame {
  position: absolute;
  display: grid;
  inset: 8%;
  place-items: center;
  border: 1px solid var(--gold-500);
  background: radial-gradient(circle, var(--card-accent-soft), transparent 58%);
}
.game-card__back-sigil {
  position: relative;
  display: grid;
  width: 43%;
  aspect-ratio: 1;
  place-items: center;
  border: 2px solid var(--gold-300);
  filter: drop-shadow(0 0 12px var(--card-accent-soft));
  transform: rotate(30deg);
}
.game-card__back-sigil i { width: 45%; aspect-ratio: 1; border: 2px solid var(--card-accent); transform: rotate(30deg); }
.game-card__back-frame small { color: var(--gold-200); font-size: clamp(0.48rem, 6cqw, 0.8rem); letter-spacing: 0.12em; }

@media (prefers-reduced-motion: reduce) {
  .game-card--interactive:hover,
  .game-card--selected { transform: none; }
}
</style>
