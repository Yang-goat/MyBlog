<script setup lang="ts">
import UiButton from "./UiButton.vue";

defineProps<{ rankings: Array<{ rank: number; id: string; name: string; score: number }>; canUndo?: boolean }>();
const emit = defineEmits<{ newMatch: []; undo: [] }>();
</script>

<template>
  <main class="final-screen">
    <section class="final-panel hex-panel">
      <header>
        <p>八局终了</p>
        <h1>本场最终排名</h1>
        <span>同分玩家直接并列</span>
      </header>
      <ol class="ranking-list">
        <li v-for="item in rankings" :key="item.id" :class="`rank-${item.rank}`">
          <span class="rank-number">{{ item.rank }}</span>
          <strong>{{ item.name }}</strong>
          <em>{{ item.score >= 0 ? "+" : "" }}{{ item.score }}</em>
        </li>
      </ol>
      <p class="final-note">结果已经保存在本设备。只有确认开始新一场，当前积分与强化才会清空。</p>
      <div class="final-actions">
        <a href="/notes/hex-mahjong/">查看海克斯麻将栏目</a>
        <div>
          <UiButton v-if="canUndo" label="撤销第 8 局结算" icon="undo" variant="quiet" @click="emit('undo')" />
          <UiButton label="开始新一场" icon="play" variant="gold" @click="emit('newMatch')" />
        </div>
      </div>
    </section>
  </main>
</template>

<style scoped>
.final-screen { display: grid; width: 100%; min-height: 100%; place-items: center; overflow: auto; padding: 1.5rem; background: linear-gradient(rgb(2 9 16 / 48%), rgb(2 9 16 / 84%)), url("/art/table-surface.webp") center / cover, #020910; }
.final-panel { width: min(760px, 100%); padding: clamp(1.2rem, 3vw, 2rem); }
header { text-align: center; }
header p { margin: 0; color: var(--cyan-300); font-size: 0.72rem; letter-spacing: 0.2em; }
h1 { margin: 0.35rem 0 0; color: var(--gold-100); font: 700 clamp(1.8rem, 5vw, 3rem)/1.1 var(--font-display); letter-spacing: 0.12em; }
header span { display: block; margin-top: 0.45rem; color: var(--muted); font-size: 0.75rem; }
.ranking-list { display: grid; gap: 0.6rem; margin: 1.5rem 0; padding: 0; list-style: none; }
.ranking-list li { display: grid; min-height: 66px; grid-template-columns: 58px 1fr auto; align-items: center; border: 1px solid rgb(213 172 84 / 23%); background: rgb(3 15 25 / 72%); padding: 0.5rem 0.85rem; }
.rank-number { display: grid; width: 40px; aspect-ratio: 1; place-items: center; border: 1px solid var(--gold-400); color: var(--gold-200); font-weight: 800; clip-path: polygon(25% 3%, 75% 3%, 98% 50%, 75% 97%, 25% 97%, 2% 50%); }
.ranking-list strong { color: var(--text); font: 700 1.2rem/1 var(--font-display); }
.ranking-list em { color: var(--gold-300); font: 700 1.1rem/1 var(--font-ui); font-style: normal; }
.ranking-list .rank-1 { border-color: var(--gold-300); background: linear-gradient(90deg, rgb(132 89 20 / 28%), rgb(3 15 25 / 72%)); }
.ranking-list .rank-1 .rank-number { background: rgb(167 116 30 / 42%); color: var(--gold-100); }
.final-note { margin: 0; color: var(--muted); font-size: 0.76rem; line-height: 1.55; text-align: center; }
.final-actions { display: flex; align-items: center; justify-content: space-between; gap: 1rem; margin-top: 1.2rem; border-top: 1px solid rgb(213 172 84 / 18%); padding-top: 1rem; }
.final-actions a { color: var(--cyan-300); font-size: 0.76rem; text-decoration: none; }
.final-actions > div { display: flex; gap: 0.6rem; }
</style>
