<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, onMounted, reactive, ref, useId, watch } from "vue";
import { select } from "d3-selection";
import { zoom, zoomIdentity } from "d3-zoom";
import type { ZoomBehavior } from "d3-zoom";
import { drag } from "d3-drag";
import { withBase } from "vuepress/client";
import type { GraphNode, KnowledgeGraphData } from "../../knowledge-graph/schema";
import { restoreSession, searchNodes, visibleGraph } from "./view-state.mjs";

const props = defineProps<{ data: KnowledgeGraphData }>();
const root = ref<HTMLElement>();
const canvas = ref<HTMLElement>();
const svg = ref<SVGSVGElement>();
const searchInput = ref<HTMLInputElement>();
const fullscreenButton = ref<HTMLButtonElement>();
const arrowId = `kg-arrow-${useId().replaceAll(":", "")}`;
const nodes = reactive(props.data.nodes.map((node) => ({ ...node })));
const graphData = { ...props.data, nodes };
const nodeMap = new Map(nodes.map((node) => [node.id, node]));
const groupMap = new Map(props.data.groups.map((group) => [group.id, group]));
const state = reactive({ groups: props.data.groups.map((group) => group.id), citations: true, tags: true, sharedOnly: true, focus: null as string | null, selected: null as string | null, view: "graph" as "graph" | "list" });
const viewport = reactive({ x: 0, y: 0, k: 1 });
const size = reactive({ width: 700, height: 560 });
const query = ref("");
const hovered = ref<string | null>(null);
const filterOpen = ref(false);
const helpOpen = ref(false);
const searchOpen = ref(false);
const resultIndex = ref(-1);
const fullscreen = ref(false);
const fallbackFullscreen = ref(false);
const message = ref("");
const initialized = ref(false);
let zoomBehavior: ZoomBehavior<SVGSVGElement, unknown>;
let resizeObserver: ResizeObserver | undefined;
let saveTimer: ReturnType<typeof setTimeout> | undefined;
let noticeTimer: ReturnType<typeof setTimeout> | undefined;
let previousOverflow: string | null = null;
let dragging = false;
let lastDragEnd = 0;
let mounted = false;
let pointerMoved = false;
const storageKey = "site-knowledge-graph:session:v1";

const filtered = computed(() => visibleGraph(graphData, state));
const visibleNodes = computed<GraphNode[]>(() => filtered.value.nodes);
const visibleIds = computed(() => new Set(visibleNodes.value.map((node) => node.id)));
const visibleEdges = computed(() => filtered.value.edges.map((edge) => ({ ...edge, from: nodeMap.get(edge.source)!, to: nodeMap.get(edge.target)! })));
const articleNodes = computed(() => visibleNodes.value.filter((node) => node.type === "article"));
const listNodes = computed(() => {
  const q = query.value.trim().toLocaleLowerCase();
  return articleNodes.value.filter((node) => !q || node.label.toLocaleLowerCase().includes(q) || node.tags.some((tag) => tag.toLocaleLowerCase().includes(q)))
    .sort((a, b) => a.label.localeCompare(b.label, "zh-CN"));
});
const results = computed<GraphNode[]>(() => searchNodes(nodes, query.value));
const selected = computed(() => nodeMap.get(state.selected || ""));
const activeId = computed(() => hovered.value || state.selected);
const neighbors = computed(() => {
  const ids = new Set<string>();
  if (activeId.value) {
    ids.add(activeId.value);
    for (const edge of visibleEdges.value) {
      if (edge.source === activeId.value) ids.add(edge.target);
      if (edge.target === activeId.value) ids.add(edge.source);
    }
  }
  return ids;
});
const related = computed(() => {
  const id = state.selected;
  const outgoing: GraphNode[] = [], incoming: GraphNode[] = [], topics: GraphNode[] = [], articles: GraphNode[] = [];
  for (const edge of props.data.edges) {
    if (edge.type === "citation" && edge.source === id) outgoing.push(nodeMap.get(edge.target)!);
    if (edge.type === "citation" && edge.target === id) incoming.push(nodeMap.get(edge.source)!);
    if (edge.type === "tag" && edge.source === id) topics.push(nodeMap.get(edge.target)!);
    if (edge.type === "tag" && edge.target === id) articles.push(nodeMap.get(edge.source)!);
  }
  return [{ label: "引用了", nodes: outgoing }, { label: "被引用", nodes: incoming }, { label: "所属主题", nodes: topics }, { label: "相关文章", nodes: articles }].filter((group) => group.nodes.length);
});
const filtersChanged = computed(() => state.groups.length !== props.data.groups.length || !state.citations || !state.tags || !state.sharedOnly);

function radius(node: GraphNode) {
  const base = node.type === "topic" ? Math.min(12, 6 + Math.sqrt(node.degree)) : Math.min(10, 4 + Math.sqrt(node.degree) * .65);
  // At the initial whole-site fit, keep even low-degree nodes visible and clickable.
  // Labels, hit areas and selection rings use this same rendered radius.
  return Math.max(base, (node.type === "topic" ? 4 : 3) / viewport.k);
}
function color(node: GraphNode) { return node.type === "article" ? groupMap.get(node.group)?.color || "#6c8cb9" : "var(--kg-topic)"; }
function clippedLabel(label: string) { return label.length > 27 ? `${label.slice(0, 26)}…` : label; }

// Labels occupy screen-space cells, so zooming reveals detail without a wall of text.
const labeledIds = computed(() => {
  const occupied: { x: number; y: number; w: number; h: number }[] = [];
  const labels = new Set<string>();
  const candidates = [...visibleNodes.value].sort((a, b) => {
    const priority = (node: GraphNode) => node.id === activeId.value ? 100000 : neighbors.value.has(node.id) && activeId.value ? 5000 + node.degree : (node.type === "topic" ? 500 : 0) + node.degree;
    return priority(b) - priority(a);
  });
  const limit = viewport.k > 1.8 ? 180 : viewport.k > .9 ? 90 : 38;
  for (const node of candidates) {
    const important = node.id === activeId.value;
    if (labels.size >= limit && !important) break;
    if (node.type === "article" && viewport.k < .7 && node.degree < 5 && !neighbors.value.has(node.id)) continue;
    const label = clippedLabel(node.label);
    const w = [...label].reduce((width, c) => width + (/[^\x00-\x7f]/.test(c) ? 12 : 6.6), 0);
    const x = node.x * viewport.k + viewport.x - w / 2;
    const y = node.y * viewport.k + viewport.y - radius(node) * viewport.k - 20;
    if (x + w < 0 || x > size.width || y < -20 || y > size.height) continue;
    const box = { x: x - 3, y: y - 3, w: w + 6, h: 20 };
    if (!important && occupied.some((b) => box.x < b.x + b.w && box.x + box.w > b.x && box.y < b.y + b.h && box.y + box.h > b.y)) continue;
    occupied.push(box);
    labels.add(node.id);
  }
  return labels;
});

function announce(text: string) {
  message.value = text;
  clearTimeout(noticeTimer);
  noticeTimer = setTimeout(() => { message.value = ""; }, 4500);
}
function setTransform(x: number, y: number, k: number) {
  if (!svg.value || !zoomBehavior) return;
  select(svg.value).call(zoomBehavior.transform, zoomIdentity.translate(x, y).scale(Math.min(8, Math.max(.08, k))));
}
function fit() {
  if (!visibleNodes.value.length) return;
  const xs = visibleNodes.value.map((node) => node.x), ys = visibleNodes.value.map((node) => node.y);
  const minX = Math.min(...xs), maxX = Math.max(...xs), minY = Math.min(...ys), maxY = Math.max(...ys);
  const k = Math.min(1.6, (size.width - 90) / Math.max(100, maxX - minX), (size.height - 90) / Math.max(100, maxY - minY));
  setTransform(size.width / 2 - (minX + maxX) / 2 * k, size.height / 2 - (minY + maxY) / 2 * k, k);
}
function zoomBy(factor: number) { if (svg.value) select(svg.value).call(zoomBehavior.scaleBy, factor); }
function centerNode(node: GraphNode) {
  const k = Math.max(viewport.k, .9);
  setTransform(size.width / 2 - node.x * k, size.height / 2 - node.y * k, k);
}
async function chooseNode(id: string, locate = true) {
  if (dragging || performance.now() - lastDragEnd < 150) return;
  const node = nodeMap.get(id);
  if (!node) return;
  const hidden = !visibleIds.value.has(id);
  state.focus = null;
  if (hidden) {
    if (node.type === "article" && !state.groups.includes(node.group)) state.groups = [...state.groups, node.group];
    if (node.type === "topic") {
      state.tags = true;
      state.sharedOnly = false;
      const memberGroups = props.data.edges.filter((edge) => edge.type === "tag" && edge.target === id).map((edge) => nodeMap.get(edge.source)).filter((article) => article?.type === "article").map((article) => article.group);
      state.groups = [...new Set([...state.groups, ...memberGroups])];
    }
    announce("已调整筛选，显示所选节点。");
  }
  state.selected = id;
  searchOpen.value = false;
  resultIndex.value = -1;
  await nextTick();
  if (locate && state.view === "graph") centerNode(node);
}
function clickNode(event: MouseEvent, id: string) { if (!event.defaultPrevented) void chooseNode(id, false); }
async function focusSelected() {
  if (!state.selected) return;
  state.focus = state.selected;
  await nextTick(); fit();
}
async function returnToAll() { state.focus = null; await nextTick(); fit(); }
async function reset() {
  state.groups = props.data.groups.map((group) => group.id);
  state.citations = true; state.tags = true; state.sharedOnly = true; state.focus = null; state.selected = null; state.view = "graph";
  query.value = ""; hovered.value = null; filterOpen.value = false; searchOpen.value = false;
  for (const node of nodes) { const original = props.data.nodes.find((entry) => entry.id === node.id)!; node.x = original.x; node.y = original.y; }
  await nextTick(); fit(); announce("已恢复默认视图。");
}
function handleSearchKey(event: KeyboardEvent) {
  if (event.key === "Escape") { searchOpen.value = false; return; }
  if (event.key === "ArrowDown" || event.key === "ArrowUp") {
    event.preventDefault(); searchOpen.value = true;
    const length = results.value.length;
    if (length) {
      resultIndex.value = resultIndex.value < 0 ? (event.key === "ArrowDown" ? 0 : length - 1) : (resultIndex.value + (event.key === "ArrowDown" ? 1 : -1) + length) % length;
      void nextTick(() => document.getElementById(`${arrowId}-result-${resultIndex.value}`)?.scrollIntoView({ block: "nearest" }));
    }
  } else if (event.key === "Enter" && results.value.length) {
    event.preventDefault(); void chooseNode(results.value[Math.max(0, resultIndex.value)].id);
  }
}
function closeOutside(event: PointerEvent) {
  if (!root.value?.contains(event.target as Node)) { searchOpen.value = false; filterOpen.value = false; }
  else if (!(event.target as Element)?.closest(".kg-search")) searchOpen.value = false;
}
function lockScroll(lock: boolean) {
  if (lock && previousOverflow === null) { previousOverflow = document.body.style.overflow; document.body.style.overflow = "hidden"; }
  if (!lock && previousOverflow !== null) { document.body.style.overflow = previousOverflow; previousOverflow = null; }
}
function syncFullscreen() {
  fullscreen.value = document.fullscreenElement === root.value || fallbackFullscreen.value;
  lockScroll(fullscreen.value);
}
async function toggleFullscreen() {
  if (fullscreen.value) {
    if (document.fullscreenElement === root.value) await document.exitFullscreen().catch(() => {});
    if (!mounted) return;
    fallbackFullscreen.value = false; syncFullscreen();
    await nextTick(); fullscreenButton.value?.focus();
  } else {
    try {
      if (!root.value?.requestFullscreen) throw new Error("Fullscreen API unavailable");
      await root.value.requestFullscreen();
    } catch { if (mounted) fallbackFullscreen.value = true; }
    if (!mounted) return;
    syncFullscreen();
  }
}
function handleEscape(event: KeyboardEvent) {
  if (event.key === "Tab" && fullscreen.value && root.value) {
    const focusable = Array.from(root.value.querySelectorAll<HTMLElement>('button:not(:disabled), a[href], input:not(:disabled)')).filter((element) => element.getClientRects().length);
    const first = focusable[0], last = focusable.at(-1);
    if (first && last && (event.shiftKey ? document.activeElement === first : document.activeElement === last)) {
      event.preventDefault(); (event.shiftKey ? last : first).focus();
    }
  }
  if (event.key !== "Escape") return;
  searchOpen.value = false; filterOpen.value = false; helpOpen.value = false;
  if (fallbackFullscreen.value) { fallbackFullscreen.value = false; syncFullscreen(); fullscreenButton.value?.focus(); }
  else if (document.fullscreenElement === root.value) {
    // Handle Escape explicitly as well as the browser's native fullscreen shortcut.
    void document.exitFullscreen().then(() => {
      if (!mounted) return;
      syncFullscreen();
      fullscreenButton.value?.focus();
    }).catch(() => {});
  }
}
function saveState() {
  if (!mounted) return;
  try { sessionStorage.setItem(storageKey, JSON.stringify({ fingerprint: props.data.fingerprint, ...state, viewport: { ...viewport, ...size } })); } catch { /* Storage may be disabled; exploration still works. */ }
}
function scheduleSave() { clearTimeout(saveTimer); saveTimer = setTimeout(saveState, 180); }

function bindDrag() {
  if (!svg.value) return;
  select(svg.value).selectAll<SVGGElement, GraphNode>("[data-node]")
    .datum(function () { return nodeMap.get(this.getAttribute("data-node")!)!; })
    .call(drag<SVGGElement, GraphNode>()
      .filter((event: MouseEvent | TouchEvent) => event.type.startsWith("touch") ? fullscreen.value : !(event as MouseEvent).button && !(event as MouseEvent).ctrlKey)
      .clickDistance(5)
      .on("start", () => { pointerMoved = false; })
      .on("drag", (event, node) => {
        pointerMoved = true; dragging = true;
        // D3 measures against the transformed parent <g>, already in world units.
        node.x += event.dx; node.y += event.dy;
      })
      .on("end", () => { if (pointerMoved) lastDragEnd = performance.now(); dragging = false; }))
    // D3 installs touch-action:none even when its filter rejects touch dragging.
    // Inherit the SVG's pan-y in embedded mode so swipes beginning on nodes scroll.
    .style("touch-action", null);
}
watch(() => [state.groups.join("|"), state.citations, state.tags, state.sharedOnly], () => {
  if (state.selected && !visibleIds.value.has(state.selected)) state.selected = null;
  if (state.focus && !visibleIds.value.has(state.focus)) state.focus = null;
});
watch(() => visibleNodes.value.map((node) => node.id).join("|"), async () => { await nextTick(); bindDrag(); });
watch(state, scheduleSave, { deep: true });
watch(viewport, scheduleSave);
watch(query, () => { searchOpen.value = Boolean(query.value.trim()); resultIndex.value = -1; });
watch(() => state.view, async () => { await nextTick(); if (state.view === "graph") resize(); });

function resize() {
  if (!canvas.value) return;
  const rect = canvas.value.getBoundingClientRect();
  if (rect.width <= 0 || rect.height <= 0) return;
  const dx = (rect.width - size.width) / 2, dy = (rect.height - size.height) / 2;
  size.width = rect.width; size.height = rect.height;
  if (initialized.value) setTransform(viewport.x + dx, viewport.y + dy, viewport.k);
}
onMounted(async () => {
  mounted = true;
  let restored: ReturnType<typeof restoreSession> = null;
  try { restored = restoreSession(sessionStorage.getItem(storageKey), props.data); } catch { /* Optional storage. */ }
  if (restored) {
    const { viewport: storedViewport, ...storedState } = restored;
    Object.assign(state, storedState);
  }
  await nextTick();
  if (!mounted || !svg.value) return;
  zoomBehavior = zoom<SVGSVGElement, unknown>()
    .scaleExtent([.08, 8])
    .extent((): [[number, number], [number, number]] => [[0, 0], [size.width, size.height]])
    // Ctrl is the embedded graph's intentional zoom modifier, not a signal to
    // apply D3's extra touchpad-pinch multiplier. Match fullscreen wheel speed.
    .wheelDelta((event: WheelEvent) => -event.deltaY * (event.deltaMode === 1 ? .05 : event.deltaMode ? 1 : .002))
    .filter((event) => {
      if (event.type === "wheel") return fullscreen.value || event.ctrlKey;
      if (event.type.startsWith("touch")) return fullscreen.value || event.touches?.length >= 2;
      return !event.button && !event.ctrlKey && !(event.target as Element)?.closest("[data-node]");
    })
    .on("zoom", (event) => { viewport.x = event.transform.x; viewport.y = event.transform.y; viewport.k = event.transform.k; });
  select(svg.value).call(zoomBehavior).on("dblclick.zoom", null);
  resize();
  if (restored?.viewport) {
    const old = restored.viewport;
    setTransform(old.x + (size.width - old.width) / 2, old.y + (size.height - old.height) / 2, old.k);
  } else fit();
  initialized.value = true;
  bindDrag();
  resizeObserver = new ResizeObserver(resize);
  if (canvas.value) resizeObserver.observe(canvas.value);
  document.addEventListener("fullscreenchange", syncFullscreen);
  document.addEventListener("keydown", handleEscape);
  document.addEventListener("pointerdown", closeOutside);
  await nextTick();
  if (mounted) performance.mark("knowledge-graph-ready");
});
onBeforeUnmount(() => {
  saveState(); mounted = false;
  clearTimeout(saveTimer); clearTimeout(noticeTimer);
  resizeObserver?.disconnect();
  if (svg.value) { select(svg.value).on(".zoom", null); select(svg.value).selectAll("[data-node]").on(".drag", null); }
  document.removeEventListener("fullscreenchange", syncFullscreen);
  document.removeEventListener("keydown", handleEscape);
  document.removeEventListener("pointerdown", closeOutside);
  if (document.fullscreenElement === root.value) void document.exitFullscreen().catch(() => {});
  lockScroll(false);
});
</script>

<template>
  <Teleport to="body" :disabled="!fallbackFullscreen">
    <section ref="root" class="kg-explorer" :class="{ 'kg-fullscreen': fullscreen, 'kg-fallback': fallbackFullscreen }" aria-label="本站知识图谱">
      <div class="kg-toolbar">
        <div class="kg-search">
          <svg class="kg-search-icon" width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" aria-hidden="true"><circle cx="10.5" cy="10.5" r="6.5" /><path d="m16 16 5 5" /></svg>
          <input ref="searchInput" v-model="query" type="search" placeholder="搜索文章或主题…" aria-label="搜索文章或主题" role="combobox" :aria-expanded="searchOpen && !!query.trim()" :aria-controls="`${arrowId}-results`" :aria-activedescendant="resultIndex >= 0 ? `${arrowId}-result-${resultIndex}` : undefined" autocomplete="off" @focus="searchOpen = !!query.trim()" @keydown="handleSearchKey" />
          <div v-if="searchOpen && query.trim()" :id="`${arrowId}-results`" class="kg-search-results" role="listbox" aria-label="搜索结果">
            <button v-for="(node, index) in results" :id="`${arrowId}-result-${index}`" :key="node.id" type="button" role="option" :aria-selected="index === resultIndex" :class="{ 'is-active': index === resultIndex }" @click="chooseNode(node.id)">
              <span class="kg-result-type">{{ node.type === 'topic' ? '主题' : '文章' }}</span><span>{{ node.label }}</span>
            </button>
            <div v-if="!results.length" class="kg-empty-result">没有找到相关内容，试试更短的关键词。</div>
            <div v-else-if="results.length === 30" class="kg-result-hint">显示前 30 项，可输入更多文字缩小范围。</div>
          </div>
        </div>
        <button type="button" class="kg-button" :class="{ 'is-active': filterOpen || filtersChanged }" :aria-expanded="filterOpen" :aria-controls="`${arrowId}-filters`" @click="filterOpen = !filterOpen">栏目筛选 <span v-if="state.groups.length !== data.groups.length" class="kg-count">{{ state.groups.length }}</span><span aria-hidden="true">⌄</span></button>
        <button ref="fullscreenButton" type="button" class="kg-button kg-fullscreen-button" :aria-pressed="fullscreen" @click="toggleFullscreen"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" aria-hidden="true"><path v-if="!fullscreen" d="M8 3H3v5m13-5h5v5M3 16v5h5m13-5v5h-5" /><path v-else d="M3 8h5V3m8 0v5h5M8 21v-5H3m13 5v-5h5" /></svg>{{ fullscreen ? '退出全屏' : '全屏查看' }}</button>
      </div>

      <div v-if="filterOpen" :id="`${arrowId}-filters`" class="kg-filter-panel">
        <span class="kg-muted">显示栏目</span>
        <label v-for="group in data.groups" :key="group.id"><input v-model="state.groups" type="checkbox" :value="group.id" /><span class="kg-dot" :style="{ background: group.color }" />{{ group.label }}</label>
        <button type="button" class="kg-text-button" @click="state.groups = data.groups.map(group => group.id)">全选</button>
        <button type="button" class="kg-text-button" @click="state.groups = []">清空</button>
      </div>
      <div class="kg-options">
        <div class="kg-relations">
          <label><input v-model="state.citations" type="checkbox" />正文引用</label>
          <label><input v-model="state.tags" type="checkbox" />主题关联</label>
          <label :class="{ 'kg-muted': !state.tags }"><input v-model="state.sharedOnly" type="checkbox" :disabled="!state.tags" />仅共享主题</label>
        </div>
        <div class="kg-view-switch" role="group" aria-label="查看方式"><button type="button" :aria-pressed="state.view === 'graph'" @click="state.view = 'graph'">图谱</button><button type="button" :aria-pressed="state.view === 'list'" @click="state.view = 'list'">列表</button></div>
        <button type="button" class="kg-text-button" :aria-expanded="helpOpen" @click="helpOpen = !helpOpen">帮助</button>
      </div>
      <div v-if="helpOpen" class="kg-help">
        <strong>从一篇文章，发现相关知识</strong>
        <p>点击节点查看简介和关联，再点“打开文章”阅读。实心圆是文章，空心菱形是主题；实线表示正文引用，虚线表示文章标签。连线不表示算法继承或因果。</p>
        <p>拖动画布移动，拖动节点整理位置。普通页面按住 Ctrl 滚轮缩放，全屏时直接滚轮缩放；手机可使用缩放按钮。仅共享主题显示当前栏目中至少关联两篇文章的主题。</p>
        <p>搜索支持方向键与回车；也可以切换列表查看文章。筛选和视角会在当前浏览器会话中保留，更新内容后恢复默认。</p>
      </div>
      <div v-if="state.focus" class="kg-focus-bar"><span>正在查看 <strong>{{ nodeMap.get(state.focus)?.label }}</strong> 的一跳关联</span><button type="button" class="kg-text-button" @click="returnToAll">返回全图</button></div>
      <div class="kg-message" role="status" aria-live="polite">{{ message }}</div>

      <div class="kg-workspace" :class="{ 'has-selection': selected }">
        <div ref="canvas" class="kg-canvas" :class="{ 'is-list': state.view === 'list' }">
          <svg v-show="state.view === 'graph'" ref="svg" class="kg-svg" :class="{ 'is-ready': initialized }" :width="size.width" :height="size.height" role="img" aria-label="文章与主题关系网络，可通过搜索和列表进行键盘操作">
            <defs><marker :id="arrowId" viewBox="0 -4 8 8" refX="15" refY="0" markerWidth="7" markerHeight="7" orient="auto" markerUnits="userSpaceOnUse"><path d="M0,-3.5L7,0L0,3.5" fill="currentColor" /></marker></defs>
            <g :transform="`translate(${viewport.x},${viewport.y}) scale(${viewport.k})`">
              <g class="kg-edges">
                <line v-for="edge in visibleEdges" :key="edge.id" :x1="edge.from.x" :y1="edge.from.y" :x2="edge.to.x" :y2="edge.to.y" :class="[edge.type, { 'is-related': activeId && (edge.source === activeId || edge.target === activeId), 'is-dimmed': activeId && edge.source !== activeId && edge.target !== activeId }]" :marker-end="edge.type === 'citation' && activeId && (edge.source === activeId || edge.target === activeId) ? `url(#${arrowId})` : undefined" vector-effect="non-scaling-stroke" />
              </g>
              <g v-for="node in visibleNodes" :key="node.id" :data-node="node.id" class="kg-node" :class="{ 'is-selected': node.id === state.selected, 'is-dimmed': activeId && !neighbors.has(node.id) }" :transform="`translate(${node.x},${node.y})`" @click="clickNode($event, node.id)" @mouseenter="hovered = node.id" @mouseleave="hovered = null">
                <title>{{ node.label }}{{ node.type === 'topic' ? ' · 主题' : '' }}</title>
                <circle class="kg-node-hit" :r="Math.max(radius(node) + 7, 15 / viewport.k)" />
                <circle v-if="node.id === state.selected" class="kg-selection-ring" :r="radius(node) + 6 / viewport.k" :stroke="color(node)" vector-effect="non-scaling-stroke" />
                <circle v-if="node.type === 'article'" class="kg-article-shape" :r="radius(node)" :fill="color(node)" vector-effect="non-scaling-stroke" />
                <path v-else class="kg-topic-shape" :d="`M0,${-radius(node)}L${radius(node)},0L0,${radius(node)}L${-radius(node)},0Z`" vector-effect="non-scaling-stroke" />
                <text v-if="labeledIds.has(node.id)" class="kg-node-label" text-anchor="middle" :y="-radius(node) - 7 / viewport.k" :font-size="12 / viewport.k" :stroke-width="3 / viewport.k">{{ clippedLabel(node.label) }}</text>
              </g>
            </g>
          </svg>
          <div v-if="state.view === 'graph' && !visibleNodes.length" class="kg-empty"><strong>当前没有可显示的节点</strong><p>选择一个栏目，或恢复默认筛选。</p><button type="button" class="kg-button" @click="reset">恢复默认</button></div>
          <div v-if="state.view === 'graph'" class="kg-canvas-controls" role="group" aria-label="图谱视角"><button type="button" aria-label="放大图谱" title="放大" @click="zoomBy(1.35)">＋</button><button type="button" aria-label="缩小图谱" title="缩小" @click="zoomBy(1 / 1.35)">−</button><span>{{ Math.round(viewport.k * 100) }}%</span><button type="button" aria-label="适应画布" title="适应画布" @click="fit">⊡</button></div>
          <div v-if="state.view === 'graph' && !selected" class="kg-canvas-hint">点击节点探索 · 拖动画布移动</div>
          <div v-if="state.view === 'list'" class="kg-article-list" aria-label="文章列表">
            <div class="kg-list-heading">{{ listNodes.length }} 篇文章<span>点击标题查看关联</span></div>
            <div v-for="node in listNodes" :key="node.id" class="kg-list-row" :class="{ 'is-active': node.id === state.selected }">
              <span class="kg-dot" :style="{ background: color(node) }" />
              <button type="button" @click="chooseNode(node.id, false)">{{ node.label }}<small>{{ groupMap.get(node.group)?.label }}</small></button>
              <a :href="withBase(node.path)" target="_blank" rel="noopener" :aria-label="`在新标签页打开：${node.label}`" title="在新标签页打开">↗</a>
            </div>
            <div v-if="!listNodes.length" class="kg-list-empty">没有匹配的文章。<button type="button" class="kg-text-button" @click="reset">恢复默认</button></div>
          </div>
        </div>

        <aside v-if="selected" class="kg-inspector" aria-label="节点详情">
          <div class="kg-inspector-heading"><span class="kg-eyebrow">{{ selected.type === 'topic' ? '主题' : groupMap.get(selected.group)?.label }}</span><button type="button" class="kg-close" aria-label="关闭节点预览" @click="state.selected = null">×</button></div>
          <strong class="kg-node-title">{{ selected.label }}</strong>
          <template v-if="selected.type === 'article'">
            <div class="kg-tags"><span v-for="tag in selected.tags" :key="tag">{{ tag }}</span></div>
            <p v-if="selected.excerpt" class="kg-excerpt">{{ selected.excerpt }}</p>
          </template>
          <p v-else class="kg-excerpt">本站有 {{ selected.count }} 篇文章标注了这个主题。展开下方列表，继续探索相关内容。</p>
          <div class="kg-inspector-actions"><a v-if="selected.type === 'article'" class="kg-primary" :href="withBase(selected.path)" target="_blank" rel="noopener">打开文章 <span aria-hidden="true">↗</span><span class="kg-sr-only">（新标签页）</span></a><button type="button" class="kg-button" @click="focusSelected">只看相关节点</button></div>
          <div v-for="group in related" :key="group.label" class="kg-related"><strong>{{ group.label }} <span>{{ group.nodes.length }}</span></strong><ul><li v-for="node in group.nodes" :key="node.id"><button type="button" @click="chooseNode(node.id)"><span class="kg-relation-dot" :style="{ background: color(node) }" />{{ node.label }}</button></li></ul></div>
          <p v-if="!related.length" class="kg-muted">暂无文章引用或可展示的主题关联，仍可直接打开文章阅读。</p>
        </aside>
      </div>

      <footer class="kg-footer">
        <div class="kg-legend"><span v-for="group in data.groups" :key="group.id" :class="{ 'is-muted': !state.groups.includes(group.id) }"><i class="kg-dot" :style="{ background: group.color }" />{{ group.label }}</span><span v-if="state.tags"><i class="kg-diamond" />主题</span></div>
        <div class="kg-footer-bottom"><span class="kg-stats">{{ articleNodes.length }} 篇文章 · {{ visibleNodes.length - articleNodes.length }} 个主题 · {{ visibleEdges.length }} 条关系</span><button type="button" class="kg-text-button" @click="reset">恢复默认</button></div>
      </footer>
    </section>
  </Teleport>
</template>

<style scoped src="./knowledge-graph.css"></style>
