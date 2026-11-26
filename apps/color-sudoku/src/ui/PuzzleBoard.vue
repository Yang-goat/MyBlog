<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue';
import type { Cell, GameView } from '../contracts';
import InkIcon from './InkIcon.vue';
import StickerPrint from './StickerPrint.vue';
import Naituan from './Naituan.vue';

const props = defineProps<{ view: GameView; revealing: boolean }>();
const emit = defineEmits<{ mark: [at: number] }>();
const size = computed(() => props.view.puzzle.size);
const zoom = ref(false);
const active = ref(0);
const hover = ref<number | null>(null);
const tracking = ref(false);
const landing = computed(() => hover.value ?? active.value);
const targetRow = computed(() => Math.floor(landing.value / size.value));
const targetCol = computed(() => landing.value % size.value);
const scroller = ref<HTMLElement>();
const solved = computed(() => props.view.round.status === 'won' && !!props.view.revealed);
const pressAt = computed(() => {
  const sticker = props.view.revealed;
  if (!sticker) return {};
  const n = sticker.size;
  let best = -1, distance = Infinity;
  sticker.colors.forEach((color, at) => {
    if (color === null) return;
    const x = at % n, y = Math.floor(at / n);
    if (x < n - 1 && sticker.colors[at + 1] !== null && y < n - 1 && sticker.colors[at + n] !== null) return;
    const d = (x / n - .66) ** 2 + (y / n - .73) ** 2;
    if (d < distance) { distance = d; best = at; }
  });
  return { left: `${(best % n + .65) / n * 100}%`, top: `${(Math.floor(best / n) + .69) / n * 100}%` };
});
const labels: Record<Cell, string> = { unknown: '未作标记', filled: '已涂色，已锁定', empty: '已标空，已锁定', 'miss-filled': '已纠正为涂色，已锁定', 'miss-empty': '已纠正为标空，已锁定' };
const clueText = (clue: number[]) => clue.length ? clue : [0];
const isInk = (cell: Cell) => cell === 'filled' || cell === 'miss-filled';
const isMiss = (cell: Cell) => cell === 'miss-empty' || cell === 'miss-filled';
const pad = (value: number) => String(value).padStart(2, '0');
const minClueWidth = computed(() => Math.max(2, ...props.view.puzzle.rowClues.map(row => row.length)));
const minClueHeight = computed(() => Math.max(2, ...props.view.puzzle.columnClues.map(col => col.length)));
const fitCell = ref<number>();
const vars = computed(() => ({ '--n': size.value, '--clue-x': minClueWidth.value, '--clue-y': minClueHeight.value, ...(solved.value && fitCell.value ? { '--cell': `${fitCell.value}px` } : {}) }));
let observer: ResizeObserver | undefined;
function fitSticker() {
  const viewport = scroller.value;
  if (!solved.value || !viewport) return;
  const stage = viewport.closest<HTMLElement>('.game-stage') ?? viewport.parentElement;
  const corner = viewport.querySelector<HTMLElement>('.corner-clue');
  if (!stage || !corner) return;
  const style = getComputedStyle(stage);
  const width = stage.clientWidth - parseFloat(style.paddingLeft) - parseFloat(style.paddingRight);
  const cap = size.value === 5 ? 50 : size.value === 7 ? 41 : 34;
  fitCell.value = Math.max(1, Math.min(cap, Math.floor((width - corner.offsetWidth - 12) / size.value)));
  viewport.scrollLeft = 0; viewport.scrollTop = 0;
}
watch(solved, won => {
  if (won) { zoom.value = false; tracking.value = false; hover.value = null; void nextTick(fitSticker); }
  else fitCell.value = undefined;
});
onMounted(() => {
  const stage = scroller.value?.closest<HTMLElement>('.game-stage');
  if (stage) { observer = new ResizeObserver(fitSticker); observer.observe(stage); }
  fitSticker();
});
onBeforeUnmount(() => observer?.disconnect());
function locate(at: number, focus = false) {
  active.value = at; hover.value = null; tracking.value = true;
  void nextTick(() => {
    const viewport = scroller.value;
    const cell = viewport?.querySelector<HTMLElement>(`[data-cell="${at}"]`);
    if (!viewport || !cell) return;
    if (focus) cell.focus({ preventScroll: true });
    const box = viewport.getBoundingClientRect(), rect = cell.getBoundingClientRect();
    const rail = viewport.querySelector('.corner-clue')?.getBoundingClientRect();
    const left = box.left + (rail?.width ?? 0) + 2, top = box.top + (rail?.height ?? 0) + 2;
    if (rect.left < left) viewport.scrollLeft -= left - rect.left;
    else if (rect.right > box.right - 4) viewport.scrollLeft += rect.right - box.right + 4;
    if (rect.top < top) viewport.scrollTop -= top - rect.top;
    else if (rect.bottom > box.bottom - 4) viewport.scrollTop += rect.bottom - box.bottom + 4;
  });
}
function choose(at: number) {
  active.value = at; tracking.value = true;
  if (props.view.round.status === 'playing' && props.view.round.cells[at] === 'unknown') emit('mark', at);
}
function keyCell(event: KeyboardEvent, at: number) {
  if (event.altKey || event.metaKey || event.shiftKey) return;
  const n = size.value, r = Math.floor(at / n), c = at % n;
  const dest: Record<string, number> = { ArrowLeft: r * n + Math.max(0, c - 1), ArrowRight: r * n + Math.min(n - 1, c + 1), ArrowUp: Math.max(0, r - 1) * n + c, ArrowDown: Math.min(n - 1, r + 1) * n + c, Home: event.ctrlKey ? 0 : at - c, End: event.ctrlKey ? n * n - 1 : at + n - c - 1 };
  if (event.key in dest) { event.preventDefault(); locate(dest[event.key], true); }
}
function position(event: Event, axis: 'row' | 'column') {
  const index = Number((event.target as HTMLSelectElement).value);
  locate(axis === 'row' ? index * size.value + targetCol.value : targetRow.value * size.value + index, true);
}
function changeZoom() { zoom.value = !zoom.value; void nextTick(() => locate(active.value)); }
watch([() => props.view.puzzle.id, () => props.view.round.seed], () => { active.value = 0; hover.value = null; zoom.value = false; tracking.value = false; if (scroller.value) { scroller.value.scrollTop = 0; scroller.value.scrollLeft = 0; } });
</script>

<template>
  <div class="puzzle-board" :data-size="size" :class="{ 'is-zoomed': zoom, 'is-solved': solved }" :style="vars">
    <div ref="scroller" class="puzzle-scroll" data-board-scroll @pointerleave="hover = null">
      <div class="clue-matrix" role="grid" :aria-label="`${size} 行 ${size} 列数织棋盘，左上角起，方向键移动，回车或空格标记`" :aria-rowcount="size + 1" :aria-colcount="size + 1" data-board>
        <div class="clue-line clue-top" role="row">
          <div class="corner-clue" role="columnheader" aria-label="行、列线索"><svg viewBox="0 0 34 34" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M5 29 29 5m-24.5 9h11m-4-4 4 4-4 4m8.7 3.6V10.5m-4.1 7.2 4.1 4.2 4.1-4.2"/></svg></div>
          <div v-for="(clue, col) in view.puzzle.columnClues" :key="col" class="col-clue" :class="{ aim: tracking && targetCol === col, fifth: col === 4 && size === 10 }" role="columnheader" :data-col-clue="col" :aria-label="`第 ${col + 1} 列线索 ${clueText(clue).join('，')}`"><b v-for="(run,j) in clueText(clue)" :key="j">{{ run }}</b></div>
        </div>
        <div class="mark-body" role="rowgroup">
        <div v-for="(clue, r) in view.puzzle.rowClues" :key="r" class="clue-line" :class="{ 'fifth-row': r === 4 && size === 10 }" role="row">
          <div class="row-clue" :class="{ aim: tracking && targetRow === r }" role="rowheader" :data-row-clue="r" :aria-label="`第 ${r + 1} 行线索 ${clueText(clue).join('，')}`"><b v-for="(run,j) in clueText(clue)" :key="j">{{ run }}</b></div>
          <button v-for="(cell, c) in view.round.cells.slice(r * size, (r + 1) * size)" :key="c" type="button" role="gridcell" class="grid-cell" :class="[cell, { 'crosshair': tracking && (r === targetRow || c === targetCol), pinpoint: tracking && r === targetRow && c === targetCol, fifth: c === 4 && size === 10 }]" :aria-label="`第 ${r + 1} 行第 ${c + 1} 列，${labels[cell]}`" :aria-disabled="cell !== 'unknown' || view.round.status !== 'playing'" :data-cell="r * size + c" :data-state="cell" :tabindex="active === r * size + c && !solved ? 0 : -1" @pointerenter="($event.pointerType === 'mouse') && (hover = r * size + c, tracking = true)" @focus="active = r * size + c; tracking = true" @keydown="keyCell($event, r * size + c)" @click="choose(r * size + c)">
            <template v-if="cell !== 'unknown'"><i v-if="isInk(cell)" class="crayon-fill"/><i v-else class="cross-mark"/><span v-if="isMiss(cell)" class="fix-mark" title="已纠正">!</span><InkIcon v-else name="lock" class="cell-lock"/></template>
          </button>
        </div>
        <div v-if="solved && view.revealed" class="sticker-overlay"><StickerPrint :sticker="view.revealed" :animate="revealing" :inset="false"/><div v-if="revealing" class="pressing-hoof" :style="pressAt" aria-hidden="true"><Naituan pose="press"/></div></div>
        </div>
      </div>
    </div>
    <div v-if="!solved" class="board-readout">
      <template v-if="size === 10"><InkIcon name="locate"/><label>行 <select :value="targetRow" aria-label="定位行" data-locate="row" @change="position($event, 'row')"><option v-for="i in size" :key="i" :value="i-1">{{ pad(i) }}</option></select></label><label>列 <select :value="targetCol" aria-label="定位列" data-locate="column" @change="position($event, 'column')"><option v-for="i in size" :key="i" :value="i-1">{{ pad(i) }}</option></select></label></template>
      <span v-else class="coord"><InkIcon name="locate"/> 行 {{ pad(targetRow + 1) }}<em>·</em>列 {{ pad(targetCol + 1) }}</span>
      <button class="zoom-button" type="button" data-action="zoom" :aria-pressed="zoom" @click="changeZoom"><InkIcon :name="zoom ? 'unzoom' : 'zoom'"/>{{ zoom ? '还原' : '放大' }}</button>
    </div>
    <span v-else class="print-caption">✦ &nbsp; STICKER PRINT &nbsp; / &nbsp; NO. {{ pad(view.puzzle.id) }}</span>
  </div>
</template>
