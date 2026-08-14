<script setup lang="ts">
import UiButton from "./UiButton.vue";

defineProps<{
  completedRounds: number;
  rankings: Array<{ rank: number; id: string; name: string; score: number }>;
  canUndo?: boolean;
}>();
const emit = defineEmits<{ start: []; settings: []; undo: [] }>();
</script>

<template>
  <main class="round-transition">
    <section class="round-panel hex-panel">
      <header>
        <p>{{ completedRounds ? `第 ${completedRounds} 局已保存` : "比赛已建立" }}</p>
        <h1>准备第 {{ completedRounds + 1 }} 局</h1>
        <span>把设备转交给本局第一位私密选择的玩家</span>
      </header>
      <ol v-if="completedRounds" class="mini-ranking">
        <li v-for="item in rankings" :key="item.id">
          <span>第 {{ item.rank }} 名</span><strong>{{ item.name }}</strong><em>{{ item.score >= 0 ? "+" : "" }}{{ item.score }}</em>
        </li>
      </ol>
      <div class="round-actions">
        <div>
          <UiButton v-if="completedRounds && canUndo" label="撤销上局结算" icon="undo" variant="quiet" @click="emit('undo')" />
          <UiButton label="设置" icon="gear" variant="quiet" @click="emit('settings')" />
        </div>
        <UiButton :label="`开始第 ${completedRounds + 1} 局`" icon="play" variant="gold" @click="emit('start')" />
      </div>
    </section>
  </main>
</template>

<style scoped>
.round-transition { display: grid; width: 100%; min-height: 100%; place-items: center; overflow: auto; padding: 1.5rem; background: linear-gradient(rgb(2 9 16 / 52%), rgb(2 9 16 / 86%)), url("/art/table-surface.webp") center / cover, #020910; }
.round-panel { width: min(720px, 100%); padding: clamp(1.1rem, 3vw, 2rem); }
header { text-align: center; }
header p { margin: 0; color: var(--cyan-300); font-size: 0.72rem; letter-spacing: 0.16em; }
h1 { margin: 0.4rem 0 0; color: var(--gold-100); font: 700 clamp(1.8rem, 5vw, 2.8rem)/1.1 var(--font-display); letter-spacing: 0.1em; }
header span { display: block; margin-top: 0.45rem; color: var(--muted); font-size: 0.75rem; }
.mini-ranking { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 0.5rem; margin: 1.4rem 0; padding: 0; list-style: none; }
.mini-ranking li { display: grid; min-height: 54px; grid-template-columns: auto 1fr auto; align-items: center; gap: 0.7rem; border: 1px solid rgb(213 172 84 / 20%); background: rgb(3 15 25 / 72%); padding: 0.55rem 0.7rem; }
.mini-ranking span { color: var(--gold-300); font-size: 0.65rem; }
.mini-ranking strong { color: var(--text); font-family: var(--font-display); }
.mini-ranking em { color: var(--cyan-200); font-size: 0.8rem; font-style: normal; }
.round-actions { display: flex; justify-content: space-between; gap: 0.8rem; border-top: 1px solid rgb(213 172 84 / 18%); padding-top: 1rem; }
.round-actions > div { display: flex; gap: 0.55rem; }
</style>
