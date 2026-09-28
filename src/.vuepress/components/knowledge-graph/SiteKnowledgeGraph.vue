<script setup lang="ts">
import { markRaw, onBeforeUnmount, onErrorCaptured, onMounted, shallowRef, ref } from "vue";
import { withBase } from "vuepress/client";
import type { Component } from "vue";
import type { KnowledgeGraphData } from "../../knowledge-graph/schema";

const explorer = shallowRef<Component>();
const data = shallowRef<KnowledgeGraphData>();
const error = ref(false);
const loading = ref(true);
let active = true;
async function load() {
  error.value = false;
  loading.value = true;
  explorer.value = undefined;
  try {
    // Neither the graph data nor D3 is imported until this page is mounted.
    const [component, graph] = await Promise.allSettled([
      import("./KnowledgeGraphExplorer.vue"),
      import("@temp/knowledge-graph/data.js"),
    ]);
    if (!active) return;
    if (graph.status === "fulfilled") data.value = graph.value.default;
    if (component.status === "rejected" || graph.status === "rejected") throw new Error("Graph resources unavailable");
    explorer.value = markRaw(component.value.default);
  } catch { if (active) error.value = true; }
  finally { if (active) loading.value = false; }
}
// Browsers cache failed ES-module imports for this document. A full page reload
// retries those resources while retaining this tab's sessionStorage graph state.
function reloadPage() { window.location.reload(); }
onMounted(load);
onBeforeUnmount(() => { active = false; });
onErrorCaptured(() => { error.value = true; explorer.value = undefined; return false; });
</script>

<template>
  <component :is="explorer" v-if="explorer && data && !error" :data="data" />
  <div v-else class="kg-placeholder" role="status" aria-live="polite">
    <template v-if="loading"><span class="kg-loading-dot" /> 正在整理知识网络…</template>
    <template v-else>
      <p>图谱暂时无法显示，请重新加载页面后再试。<template v-if="data">也可以通过下方列表打开文章。</template></p>
      <button type="button" @click="reloadPage">重新加载页面</button>
      <ul v-if="data">
        <template v-for="node in data.nodes" :key="node.id">
          <li v-if="node.type === 'article'"><a :href="withBase(node.path)" target="_blank" rel="noopener">{{ node.label }}</a></li>
        </template>
      </ul>
    </template>
  </div>
</template>

<style scoped>
.kg-placeholder { min-height: 420px; padding: 2rem; border: 1px solid var(--vp-c-divider, #ddd); border-radius: 12px; background: var(--vp-c-bg, #fff); color: var(--vp-c-text, #333); }
.kg-placeholder button { border: 1px solid var(--vp-c-divider, #ddd); border-radius: 6px; padding: .5rem 1rem; color: inherit; background: var(--vp-c-bg, #fff); cursor: pointer; }
.kg-placeholder ul { max-height: 480px; overflow: auto; }
.kg-loading-dot { display: inline-block; width: 8px; height: 8px; margin-right: 6px; border-radius: 50%; background: var(--vp-c-accent, #5574b9); animation: kg-loading 1.2s ease-in-out infinite alternate; }
@keyframes kg-loading { to { opacity: .25; } }
@media (prefers-reduced-motion: reduce) { .kg-loading-dot { animation: none; } }
</style>
