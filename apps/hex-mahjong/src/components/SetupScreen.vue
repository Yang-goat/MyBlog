<script setup lang="ts">
import { reactive } from "vue";
import UiButton from "./UiButton.vue";

export type SetupPayload = {
  mode: "strategy" | "party" | "full";
  playerNames: [string, string, string, string];
};

const emit = defineEmits<{ create: [payload: SetupPayload] }>();

const form = reactive<SetupPayload>({
  mode: "party",
  playerNames: ["玩家一", "玩家二", "玩家三", "玩家四"],
});

const modes = [
  { id: "strategy" as const, name: "策略模式", count: 138, detail: "专注麻将决策与海克斯构筑" },
  { id: "party" as const, name: "聚会模式", count: 176, detail: "加入欢乐挑战，适合朋友聚会" },
  { id: "full" as const, name: "全模块", count: 192, detail: "启用欢乐挑战与宝牌模块" },
];

function submit() {
  const names = form.playerNames.map((name, index) => name.trim() || `玩家${index + 1}`) as SetupPayload["playerNames"];
  emit("create", { mode: form.mode, playerNames: names });
}
</script>

<template>
  <main class="setup-screen">
    <div class="setup-screen__texture" aria-hidden="true" />

    <section class="setup-shell hex-panel" aria-labelledby="setup-title">
      <header class="setup-header">
        <div class="brand-mark" aria-hidden="true">
          <span class="brand-mark__core" />
        </div>
        <div>
          <h1 id="setup-title">海克斯麻将</h1>
          <p>电子卡牌主持台 · 四人横屏桌面</p>
        </div>
      </header>

      <form class="setup-form" @submit.prevent="submit">
        <fieldset class="mode-fieldset">
          <legend>选择本场模式</legend>
          <label
            v-for="mode in modes"
            :key="mode.id"
            class="mode-option"
            :class="{ 'mode-option--selected': form.mode === mode.id }"
          >
            <input v-model="form.mode" type="radio" name="mode" :value="mode.id" />
            <span class="mode-option__signal" aria-hidden="true" />
            <span class="mode-option__body">
              <strong>{{ mode.name }}</strong>
              <small>{{ mode.detail }}</small>
            </span>
            <span class="mode-option__count">{{ mode.count }} 张</span>
          </label>
        </fieldset>

        <fieldset class="players-fieldset">
          <legend>设置四方玩家</legend>
          <div class="seat-grid">
            <label v-for="(name, index) in form.playerNames" :key="index" class="seat-field">
              <span class="seat-field__wind">{{ ["东", "南", "西", "北"][index] }}</span>
              <span class="sr-only">{{ ["东", "南", "西", "北"][index] }}家玩家名称</span>
              <input v-model="form.playerNames[index]" class="text-field" maxlength="12" autocomplete="off" />
            </label>
          </div>
        </fieldset>

        <div class="setup-actions">
          <div class="setup-note">
            <span>本场固定 8 局</span>
            <span>所有状态仅保存在本设备</span>
          </div>
          <UiButton label="创建比赛" icon="play" variant="gold" type="submit" />
        </div>
      </form>
    </section>

    <nav class="setup-links" aria-label="海克斯麻将资料">
      <a href="/notes/hex-mahjong/rules-v1.2.html">完整规则</a>
      <span aria-hidden="true">◆</span>
      <a href="/notes/hex-mahjong/card-library.html">卡牌文字库</a>
      <span aria-hidden="true">◆</span>
      <a href="/notes/hex-mahjong/">返回博客栏目</a>
    </nav>
  </main>
</template>

<style scoped>
.setup-screen {
  position: relative;
  display: grid;
  min-height: 100%;
  place-items: center;
  overflow: auto;
  padding: clamp(1rem, 3vw, 3rem);
  isolation: isolate;
}

.setup-screen__texture {
  position: fixed;
  z-index: -1;
  inset: 0;
  background:
    linear-gradient(rgb(2 9 16 / 68%), rgb(2 9 16 / 88%)),
    url("/art/table-surface.webp") center / cover,
    radial-gradient(circle at 50% 20%, #0d3e59, #020910 72%);
}

.setup-shell {
  width: min(960px, 100%);
  padding: clamp(1.25rem, 3vw, 2.4rem);
}

.setup-header {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1.1rem;
  border-bottom: 1px solid rgb(213 172 84 / 25%);
  padding-bottom: 1.5rem;
  text-align: center;
}

.setup-header h1 {
  margin: 0;
  color: var(--gold-100);
  font: 700 clamp(2rem, 4vw, 3.4rem)/1 var(--font-display);
  letter-spacing: 0.14em;
  text-shadow: 0 2px 18px rgb(206 155 56 / 20%);
}

.setup-header p {
  margin: 0.55rem 0 0;
  color: var(--muted);
  letter-spacing: 0.12em;
}

.brand-mark {
  position: relative;
  display: grid;
  width: 64px;
  aspect-ratio: 1;
  place-items: center;
  border: 2px solid var(--gold-300);
  background: #061827;
  clip-path: polygon(25% 5%, 75% 5%, 98% 50%, 75% 95%, 25% 95%, 2% 50%);
  box-shadow: 0 0 26px rgb(29 184 223 / 20%);
}

.brand-mark__core {
  width: 27px;
  aspect-ratio: 1;
  border: 2px solid var(--cyan-300);
  transform: rotate(30deg);
  box-shadow: inset 0 0 14px var(--cyan-600), 0 0 12px rgb(99 222 243 / 60%);
}

.setup-form {
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
  gap: clamp(1.5rem, 4vw, 3rem);
  padding-top: 1.7rem;
}

fieldset { min-width: 0; margin: 0; border: 0; padding: 0; }
legend { margin-bottom: 1rem; color: var(--gold-200); font-weight: 700; letter-spacing: 0.08em; }

.mode-fieldset { display: grid; gap: 0.65rem; }
.mode-fieldset legend { width: 100%; }

.mode-option {
  display: grid;
  min-height: 72px;
  grid-template-columns: 12px 1fr auto;
  align-items: center;
  gap: 0.85rem;
  border: 1px solid rgb(213 172 84 / 24%);
  padding: 0.8rem;
  background: rgb(3 14 23 / 74%);
  cursor: pointer;
  transition: border-color 160ms ease, background 160ms ease, transform 160ms ease;
}

.mode-option:hover { border-color: rgb(99 222 243 / 48%); transform: translateX(2px); }
.mode-option--selected { border-color: var(--cyan-400); background: rgb(6 42 59 / 74%); }
.mode-option input { position: absolute; opacity: 0; }
.mode-option__signal { width: 9px; aspect-ratio: 1; border: 1px solid var(--gold-300); transform: rotate(45deg); }
.mode-option--selected .mode-option__signal { border-color: var(--cyan-300); background: var(--cyan-400); box-shadow: 0 0 12px var(--cyan-400); }
.mode-option__body { display: grid; gap: 0.25rem; }
.mode-option__body strong { color: var(--text); }
.mode-option__body small { color: var(--muted); line-height: 1.35; }
.mode-option__count { color: var(--gold-200); font-size: 0.8rem; }

.seat-grid { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 0.8rem; }
.seat-field { position: relative; display: block; }
.seat-field__wind {
  position: absolute;
  z-index: 1;
  top: 50%;
  left: 0.8rem;
  display: grid;
  width: 28px;
  aspect-ratio: 1;
  place-items: center;
  border: 1px solid var(--gold-400);
  color: var(--gold-200);
  font-family: var(--font-display);
  transform: translateY(-50%) rotate(30deg);
}
.seat-field__wind::first-letter { transform: rotate(-30deg); }
.seat-field .text-field { padding-left: 3.25rem; }

.setup-actions {
  display: flex;
  grid-column: 1 / -1;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  border-top: 1px solid rgb(213 172 84 / 20%);
  padding-top: 1.25rem;
}
.setup-note { display: flex; flex-wrap: wrap; gap: 0.55rem 1.4rem; color: var(--muted); font-size: 0.82rem; }
.setup-note span::before { margin-right: 0.45rem; color: var(--cyan-400); content: "◇"; }

.setup-links {
  position: absolute;
  bottom: 0.6rem;
  display: flex;
  gap: 0.8rem;
  color: var(--muted);
  font-size: 0.78rem;
}
.setup-links a { text-decoration: none; }
.setup-links a:hover { color: var(--gold-200); }
.setup-links span { color: var(--gold-500); font-size: 0.6rem; }

@media (max-width: 760px) {
  .setup-screen { align-items: start; }
  .setup-form { grid-template-columns: 1fr; }
  .setup-actions { grid-column: auto; }
  .setup-links { position: static; margin-top: 1rem; }
}
</style>
