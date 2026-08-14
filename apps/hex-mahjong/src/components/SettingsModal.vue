<script setup lang="ts">
import GameModal from "./GameModal.vue";
import UiIcon from "./UiIcon.vue";

defineProps<{ offlineReady: boolean; storageWarning?: string | null }>();
const emit = defineEmits<{ close: []; abandon: []; newMatch: [] }>();
</script>

<template>
  <GameModal title="主持台设置" description="比赛状态会在每次操作后自动保存到本设备。" confirm-label="返回牌桌" :show-cancel="false" @confirm="emit('close')">
    <div class="settings-list">
      <a href="/notes/hex-mahjong/rules-v1.2.html">
        <UiIcon name="book" />
        <span><strong>完整规则 V1.2</strong><small>在博客中查看正式规则与计分说明</small></span>
      </a>
      <a href="/notes/hex-mahjong/card-library.html">
        <UiIcon name="cards" />
        <span><strong>192 张卡牌文字库</strong><small>按类别查阅全部卡牌正文</small></span>
      </a>
      <div class="settings-status">
        <UiIcon name="spark" />
        <span><strong>{{ offlineReady ? "离线资源已就绪" : "正在准备离线资源" }}</strong><small>Service Worker 仅覆盖 /hex-mahjong/</small></span>
      </div>
    </div>
    <p v-if="storageWarning" class="storage-warning">{{ storageWarning }}</p>
    <div class="danger-zone">
      <div><strong>开始新一场</strong><small>清空当前八局进度、积分、强化和卡牌状态。</small></div>
      <button type="button" @click="emit('newMatch')">清空并重新开始</button>
    </div>
  </GameModal>
</template>

<style scoped>
.settings-list { display: grid; gap: 0.55rem; }
.settings-list > * { display: flex; min-height: 66px; align-items: center; gap: 0.8rem; border: 1px solid rgb(213 172 84 / 20%); background: rgb(3 14 23 / 66%); color: var(--cyan-300); padding: 0.75rem; text-decoration: none; }
.settings-list > a:hover { border-color: var(--cyan-400); }
.settings-list span { display: grid; gap: 0.24rem; }
.settings-list strong { color: var(--text); font-size: 0.86rem; }
.settings-list small { color: var(--muted); font-size: 0.7rem; }
.storage-warning { border: 1px solid rgb(232 110 125 / 42%); background: rgb(107 28 42 / 22%); color: #ffc3cb; padding: 0.7rem; font-size: 0.75rem; }
.danger-zone { display: flex; align-items: center; justify-content: space-between; gap: 1rem; margin-top: 1.2rem; border-top: 1px solid rgb(232 110 125 / 22%); padding-top: 1rem; }
.danger-zone > div { display: grid; gap: 0.24rem; }
.danger-zone strong { color: #ffc3cb; font-size: 0.83rem; }
.danger-zone small { color: var(--muted); font-size: 0.68rem; }
.danger-zone button { min-height: 48px; border: 1px solid #9f4655; background: rgb(85 22 34 / 46%); color: #ffc3cb; padding: 0.65rem 0.8rem; cursor: pointer; }
</style>
