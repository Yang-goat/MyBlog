<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue';
import type { Action, AlbumEntry, GameView, Tool } from '../contracts';
import { perfect } from '../core/game';
import { firstWinCoins, goods, items } from '../core/shop';
import InkIcon from './InkIcon.vue';
import Naituan from './Naituan.vue';
import PuzzleBoard from './PuzzleBoard.vue';
import StickerPrint from './StickerPrint.vue';
import './paper.css';
import './board.css';
import './album.css';
import './workshop.css';

const props = defineProps<{ view: GameView }>();
const emit = defineEmits<{ action: [value: Action] }>();
const send = (value: Action) => emit('action', value);
const act = (type: 'practice' | 'finishPractice' | 'album' | 'back' | 'retry' | 'sound' | 'motion') => send({ type });
const pad = (n: number) => String(n).padStart(2, '0');
const books = computed(() => [...new Set(props.view.entries.map(e => e.book))]);
const currentBook = computed(() => Math.max(0, books.value.indexOf(props.view.puzzle.book)));
const puzzleNumber = (id: number) => pad(props.view.entries.findIndex(entry => entry.id === id) + 1);
const earned = computed(() => props.view.entries.filter(e => !!e.sticker).length);
const isWin = computed(() => props.view.round.status === 'won' && !!props.view.revealed);
const isLost = computed(() => props.view.round.status === 'lost');
const tools: { key: Tool; icon: string; label: string; shortcut: string }[] = [ { key: 'fill', icon: 'crayon', label: '涂色', shortcut: 'F' }, { key: 'empty', icon: 'cross', label: '标空', shortcut: 'X' } ];
const mainTitle = ref<HTMLElement>();
const outcomeTitle = ref<HTMLElement>();
watch(() => props.view.round.status, (after, before) => { if (props.view.page === 'play' && before === 'playing' && after !== 'playing') void nextTick(() => outcomeTitle.value?.focus({ preventScroll: true })); });
const modalEl = ref<HTMLDialogElement>();
const opener = ref<HTMLElement | null>(null);
type Sheet = 'index' | 'entry' | 'restart' | 'shop';
const sheet = ref<Sheet | null>(null);
const viewedEntry = ref<AlbumEntry | null>(null);
const tab = ref(0);
const albumTab = ref(0);
const pageEntries = (book: number) => props.view.entries.filter(entry => entry.book === books.value[book]);
const closeSheet = () => modalEl.value?.close();
function openSheet(next: Sheet, entry?: AlbumEntry) {
  if (next === 'index') tab.value = currentBook.value;
  viewedEntry.value = entry ?? null;
  opener.value = document.activeElement instanceof HTMLElement ? document.activeElement : null;
  sheet.value = next;
  void nextTick(() => { if (modalEl.value && !modalEl.value.open) modalEl.value.showModal(); });
}
function afterClose() { sheet.value = null; opener.value?.focus({ preventScroll: true }); opener.value = null; }
function openLevel(id: number) { closeSheet(); send({ type: 'open', id }); }
function retry() { closeSheet(); act('retry'); }
const nextEntry = computed(() => {
  const index = props.view.entries.findIndex(entry => entry.id === props.view.puzzle.id);
  const upcoming = props.view.entries[index + 1];
  if (upcoming && !upcoming.locked && !upcoming.sticker) return upcoming;
  return props.view.entries.find(entry => !entry.locked && !entry.sticker);
});
function nextLevel() { if (nextEntry.value) openLevel(nextEntry.value.id); else act('album'); }
const growth = ref<number>();
watch(() => props.view.puzzle.size, (size, previous) => { growth.value = size > previous ? size : undefined; });
const singleColumn = window.matchMedia('(max-width: 720px)');
const mobileTools = ref(singleColumn.matches);
function updateToolDock(event: MediaQueryListEvent) { mobileTools.value = event.matches; }
const rankText = computed(() => {
  const progress = props.view.progress;
  if (progress.nextSize) return `${progress.cleared} / ${progress.total} 关 · 解锁 ${progress.nextSize} × ${progress.nextSize}`;
  return `${progress.cleared} / ${progress.total} 关 · 最高等级`;
});
const revealing = ref(false);
let revealTimer: ReturnType<typeof setTimeout> | undefined;
function skipReveal() { clearTimeout(revealTimer); revealing.value = false; }
watch([() => props.view.page, () => props.view.round.status, () => props.view.puzzle.id, () => props.view.reducedMotion], ([page, status, id, still], [beforePage, beforeStatus, beforeId]) => {
  skipReveal();
  if (page === 'play' && status === 'won' && beforePage === 'play' && beforeStatus === 'playing' && id === beforeId && !still && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    revealing.value = true; revealTimer = setTimeout(skipReveal, 1600);
  }
});

// A one-line practice may use *any* arrangement matching [2, 1]. It never calls the real mark action.
const practice = ref<('unknown' | 'filled' | 'empty')[]>(Array(5).fill('unknown'));
const practiceTool = ref<Tool>('fill');
const practiceTouched = ref(false);
const practiceRuns = computed(() => practice.value.map(c => c === 'filled' ? '1' : '0').join('').match(/1+/g)?.map(r => r.length) ?? []);
const practiceCount = computed(() => practice.value.filter(c => c !== 'unknown').length);
const practiceDone = computed(() => practiceCount.value === 5 && practiceRuns.value.join(',') === '2,1');
const practiceFeedback = computed(() => practiceDone.value ? '两段都对上了！第一张贴纸在正式册页里等你。' : practiceCount.value === 5 ? '再看看两段的长度：先连涂两格，至少空一格，再涂一格。点格子可以修改。' : practiceTouched.value ? '用两种工具把五格标完。练习格可以反复改。' : '先挑两格连着涂，再留出空格，画出单独的一格。');
function practiceMark(i: number) { practiceTouched.value = true; practice.value[i] = practiceTool.value === 'fill' ? 'filled' : 'empty'; }
function resetPractice() { practice.value = Array(5).fill('unknown'); practiceTool.value = 'fill'; practiceTouched.value = false; }
function chooseTool(tool: Tool) { if (props.view.page === 'tutorial') practiceTool.value = tool; else if (props.view.page === 'play' && props.view.round.status === 'playing') send({ type: 'tool', tool }); }
function keys(e: KeyboardEvent) {
  if (e.ctrlKey || e.metaKey || e.altKey || e.shiftKey || e.defaultPrevented || sheet.value || props.view.page === 'album' || (e.target instanceof HTMLElement && e.target.closest('input,select,textarea,[contenteditable=true]'))) return;
  const key = e.key.toLowerCase();
  if (key === 'f' || key === '1' || key === 'x' || key === '2') { e.preventDefault(); chooseTool(key === 'f' || key === '1' ? 'fill' : 'empty'); }
}
watch(() => props.view.page, (page) => { closeSheet(); if (page === 'tutorial') resetPractice(); if (page === 'album') albumTab.value = currentBook.value; void nextTick(() => mainTitle.value?.focus({ preventScroll: true })); });
onMounted(() => { window.addEventListener('keydown', keys); singleColumn.addEventListener('change', updateToolDock); });
onBeforeUnmount(() => { skipReveal(); window.removeEventListener('keydown', keys); singleColumn.removeEventListener('change', updateToolDock); });
</script>

<template>
  <div class="paper-game" :class="{ 'still-paper': view.reducedMotion }" :data-page="view.page" :data-status="view.round.status">
    <a class="skip-paper" href="#game-desk">跳到游戏内容</a>
    <header class="mast"><div class="frame mast-inner">
      <div class="brand"><svg class="brand-seal" viewBox="0 0 52 52" aria-hidden="true"><path d="M9 5.5 37 4l8 7.5 1.5 33-37.3 2.7-4.6-4.8L3.5 11z" fill="#e1a281" stroke="#795c4c" stroke-width="1.8" stroke-linejoin="round"/><path d="m9.1 7.9 26.1-1.3 7.2 7.3 1.2 27.6-33.4 2-3.7-3.4-.8-29.4z" fill="#fff7dc" stroke="#795c4c" stroke-width="1.6" stroke-linejoin="round"/><path d="m34.9 7.2.6 7.9 7.3-.9" fill="#efbe94" stroke="#795c4c" stroke-width="1.35"/><g transform="rotate(-3 24 27)" stroke="#6f5546" stroke-width="1.1"><rect x="13.5" y="16" width="8.1" height="8.1" rx="1.3" fill="#e7a17d"/><rect x="24.7" y="16" width="8.1" height="8.1" rx="1.3" fill="#b6bd96"/><rect x="13.5" y="27.1" width="8.1" height="8.1" rx="1.3" fill="#ceb68e"/><path d="m25.6 28 6.5 6.3m-.2-6.1-6.2 6.2" stroke-width="1.8"/></g></svg><div><strong>涂色数独</strong><span>NAITUAN’S STICKER BOOK</span></div></div>
      <nav class="top-nav" aria-label="游戏导航"><button type="button" data-action="back" :class="{ current: view.page !== 'album' }" :aria-current="view.page !== 'album' ? 'page' : undefined" @click="view.page === 'album' && act('back')"><InkIcon name="desk"/>解谜桌</button><button type="button" data-action="album" :class="{ current: view.page === 'album' }" :aria-current="view.page === 'album' ? 'page' : undefined" @click="act('album')"><InkIcon name="album"/>贴纸图鉴</button></nav>
      <a class="portfolio-link" href="/ai-portfolio/" aria-label="返回 AI 作品集"><span>作品集</span><InkIcon name="external"/></a>
    </div></header>
    <main id="game-desk" tabindex="-1" class="frame main-area">
      <div class="desk-heading workshop-heading">
        <div class="workshop-title">
          <div class="eyebrow"><i/>奶团的贴纸工坊</div>
          <h1 ref="mainTitle" tabindex="-1">{{ view.page === 'album' ? '奶团的贴纸图鉴' : view.page === 'tutorial' ? '先试一行' : view.puzzle.book }}</h1>
          <div class="rank" :class="{ 'rank-up': view.unlocked }">
            <div class="rank-copy"><strong>等级 {{ view.progress.level }} · {{ view.progress.size }} × {{ view.progress.size }}</strong><small>{{ rankText }}</small></div>
            <progress aria-label="当前尺寸通关进度" :value="view.progress.cleared" :max="view.progress.total"/>
          </div>
        </div>
        <div class="desk-actions">
          <span class="coin-count"><InkIcon name="coin"/><span>{{ view.coins }}</span><span class="coin-unit">金币</span></span>
          <button type="button" data-action="shop" class="paper-btn small" @click="openSheet('shop')"><InkIcon name="shop"/>商店</button>
          <button v-if="view.page === 'play'" type="button" data-action="index" aria-label="翻册选关" class="paper-btn small" @click="openSheet('index')"><InkIcon name="book"/>选关</button>
        </div>
      </div>

      <div v-if="view.page !== 'album'" class="notebook" :class="{ 'tutorial-folio': view.page === 'tutorial', 'win-folio': view.page === 'play' && isWin }">
        <div class="coil-spine" aria-hidden="true"><i/><i/><i/><i/></div>
        <article class="left-leaf">
          <template v-if="view.page === 'play'">
            <header class="leaf-heading">
              <div><h2>第 <span class="level-number">{{ puzzleNumber(view.puzzle.id) }}</span> 关 <small>{{ view.puzzle.size }} × {{ view.puzzle.size }}</small></h2></div>
              <div class="lives" :aria-label="'剩余 ' + view.round.lives + ' 次机会'">
                <span>剩余机会</span>
                <div class="heart-row"><InkIcon v-for="i in 3" :key="i" name="heart" :class="{ intact: i <= view.round.lives }"/></div>
                <span v-if="view.effect?.kind === 'miss' || view.effect?.kind === 'heal'" :key="view.effect.serial" aria-hidden="true" class="heart-pulse" :class="view.effect.kind">{{ view.effect.kind === 'heal' ? '+1' : '−1' }}</span>
              </div>
            </header>
            <div id="board-tools" class="board-tool-dock"/>
            <div class="game-stage"><PuzzleBoard :view="view" :revealing="revealing" :growing="growth === view.puzzle.size"
              @mark="send({ type: 'mark', at: $event })" @stroke="(at, start) => send({ type: 'stroke', at, start })"/></div>
          </template>
          <template v-else>
            <header class="leaf-heading"><div><div class="leaf-label"><span class="issue-dot"/> PRACTICE SHEET <span class="hairline"/></div><h2>五格小练习</h2></div><span class="practice-stamp">不扣机会</span></header>
            <div class="practice-stage"><p class="practice-lead">数字 <b>2　1</b>，要怎么涂？</p><p class="practice-explain">先连涂 <b>2</b> 格，中间至少空 <b>1</b> 格，再涂 <b>1</b> 格。</p><div class="practice-strip"><span class="practice-clue" aria-label="线索：二，一">2&nbsp; 1</span><div class="practice-grid" role="group" aria-label="五格练习"><button v-for="(cell, i) in practice" :key="i" type="button" :class="['grid-cell', cell]" :data-practice-cell="i" :data-state="cell" :aria-label="`练习第 ${i+1} 格，${cell === 'filled' ? '已涂色' : cell === 'empty' ? '已标空' : '未标记'}`" @click="practiceMark(i)"><i v-if="cell === 'filled'" class="crayon-fill"/><i v-else-if="cell === 'empty'" class="cross-mark"/></button></div></div><div class="practice-counter">已标记 {{ practiceCount }} / 5</div><p class="practice-response" role="status">{{ practiceFeedback }}</p><button class="paper-btn" :class="practiceDone ? 'primary' : 'skip-practice'" type="button" :data-action="practiceDone ? 'finishPractice' : 'skipPractice'" @click="act('finishPractice')">{{ practiceDone ? '打开正式册页' : '跳过练习' }}<InkIcon name="arrow"/></button></div>
          </template>
          <div class="leaf-folio" aria-hidden="true"><span/> {{ view.page === 'tutorial' ? 'PRACTICE　·　00' : `NO. ${puzzleNumber(view.puzzle.id)}　/　${pad(view.entries.length)}` }} <span/></div>
        </article>
        <aside class="right-leaf" :class="{ 'win-side': view.page === 'play' && isWin }">
          <div class="mascot-print" :class="{ 'press-print': view.page === 'play' && isWin && revealing }"><div class="washi" aria-hidden="true"/><span class="portrait-index" aria-hidden="true">FIG. 01</span><div class="mascot-plane"><span v-if="view.page === 'tutorial'" class="pointed-clue" aria-hidden="true">2&nbsp; 1</span><div v-if="view.page === 'play' && isWin && view.revealed && !revealing" data-press-print class="pressed-proof" aria-hidden="true"><StickerPrint :sticker="view.revealed"/></div><InkIcon v-if="view.page === 'play' && revealing" name="paw" class="absent-stamp"/><Naituan v-else :pose="view.page === 'tutorial' ? 'point' : isWin && view.page === 'play' ? 'press' : 'sit'"/></div><div class="portrait-caption"><span>奶团</span><i/> 贴纸保管员</div></div>
          <div v-if="view.page === 'tutorial' || (!isWin && !isLost)" class="tool-panel"><div class="section-line"><h3>选个工具</h3><i/><span>TOOL KIT</span></div><Teleport defer to="#board-tools" :disabled="!mobileTools || view.page !== 'play'"><div class="tool-tray" role="group" aria-label="标记工具"><button v-for="tool in tools" :key="tool.key" type="button" :data-tool="tool.key" class="tool-btn" :class="{ selected: tool.key === (view.page === 'tutorial' ? practiceTool : view.tool) }" :aria-pressed="tool.key === (view.page === 'tutorial' ? practiceTool : view.tool)" @click="chooseTool(tool.key)"><InkIcon :name="tool.icon"/><strong>{{ tool.label }}</strong><kbd>{{ tool.shortcut }}</kbd></button></div></Teleport><div class="quiet-note" :class="{ 'has-feedback': view.page === 'play' && !!view.round.message }"><InkIcon :name="view.page === 'play' && view.round.message ? 'warn' : 'tag'"/><p><span v-if="view.page === 'tutorial'">正式关有三次机会，每格只标一次。涂够一行或一列，剩余格会自动打叉。</span><span v-else-if="!view.round.message">{{ mobileTools ? '点格落笔。' : '按住鼠标拖动可连续落笔。' }}行或列涂够后，会自动补叉。</span><span role="status" aria-atomic="true">{{ view.page === 'play' ? view.round.message : '' }}</span></p></div><div class="minor-actions"><button v-if="view.page === 'play'" type="button" data-action="practice" @click="act('practice')"><InkIcon name="help"/>玩法练习</button><button v-else type="button" data-action="resetPractice" @click="resetPractice"><InkIcon name="retry"/>重做练习</button><button v-if="view.page === 'play'" type="button" data-action="restart" @click="view.round.moves.length ? openSheet('restart') : retry()"><InkIcon name="retry"/>重开本关</button></div></div>
          <div v-else-if="isWin && view.revealed" class="outcome-panel"><div class="leaf-label green"><InkIcon name="check"/> 已收进图鉴</div><h3 ref="outcomeTitle" tabindex="-1">{{ view.revealed.name }}</h3><p>{{ view.revealed.story }}</p><div v-if="view.unlocked" class="unlock-note" role="status" data-unlock><InkIcon name="spark"/><strong>升到等级 {{ view.progress.level }}</strong><span>解锁 {{ view.unlocked }} × {{ view.unlocked }}</span></div><div class="reward-line"><span v-if="perfect(view.round)" class="paw-mark"><InkIcon name="paw"/>无伤爪印</span><span v-if="view.firstReward" class="first-mark"><InkIcon name="coin"/>金币 +{{ firstWinCoins }}</span></div><button class="paper-btn primary" type="button" data-action="next" @click="nextLevel">{{ nextEntry ? '翻到下一关' : '打开贴纸图鉴' }}<InkIcon name="arrow"/></button><div class="minor-actions"><button type="button" data-action="winAlbum" @click="act('album')"><InkIcon name="album"/>查看图鉴</button><button v-if="revealing" type="button" data-action="skipReveal" @click="skipReveal">跳过揭晓</button><button v-else type="button" data-action="retry" @click="retry"><InkIcon name="retry"/>再玩一次</button></div></div>
          <div v-else class="outcome-panel"><div class="leaf-label"><InkIcon name="heart"/> 机会用完了</div><h3 ref="outcomeTitle" tabindex="-1">换张新稿纸</h3><p role="status">{{ view.round.message }} 可以从这关重新开始。</p><button class="paper-btn primary" data-action="retry" type="button" @click="retry"><InkIcon name="retry"/>再试一次</button><div class="minor-actions"><button type="button" data-action="lostIndex" @click="openSheet('index')"><InkIcon name="book"/>换一关</button></div></div>
          <section v-if="view.page === 'play' && view.round.status === 'playing'" class="tool-bag">
            <div class="section-line"><h3>道具袋</h3><i/></div>
            <div class="bag-items" aria-label="使用道具">
              <button v-for="item in items" :key="item" type="button" :data-use="item" :disabled="!view.bag[item] || !view.usable[item]"
                :title="goods[item].detail" @click="send({ type: 'use', item })">
                <InkIcon :name="goods[item].icon"/><span>{{ goods[item].name }}</span><b>{{ view.bag[item] }}</b>
              </button>
            </div>
            <p v-if="view.shopMessage" class="bag-note" role="status">{{ view.shopMessage }}</p>
          </section>
        </aside>
      </div>
      <section v-else class="archive notebook"><div class="coil-spine" aria-hidden="true"><i/><i/><i/><i/></div><div class="archive-content"><div class="section-line"><h2>贴纸收集册</h2><i/><span>已收录 {{ earned }} / {{ view.entries.length }}</span></div><div class="book-tabs" aria-label="选择册页"><button v-for="(book,i) in books" :key="book" type="button" :data-book="i" :aria-pressed="i === albumTab" @click="albumTab=i"><small>VOL. {{ pad(i+1) }}</small>{{ book }}</button></div><div class="archive-grid"><button v-for="entry in pageEntries(albumTab)" :key="entry.id" type="button" class="archive-slot" :data-entry="entry.id" :disabled="entry.locked" @click="entry.sticker ? openSheet('entry',entry) : openLevel(entry.id)"><span class="slot-head">NO. {{ puzzleNumber(entry.id) }} <InkIcon v-if="entry.perfect" name="paw" aria-label="无伤爪印"/></span><span class="slot-image"><StickerPrint v-if="entry.sticker" :sticker="entry.sticker"/><span v-else class="blank-slot" aria-hidden="true">?</span></span><strong>{{ entry.sticker?.name || `第 ${puzzleNumber(entry.id)} 关` }}</strong><span class="slot-note">{{ entry.sticker ? (entry.perfect ? '已收录 · 无伤爪印' : '已收录') : `${entry.size} × ${entry.size}　·　${entry.locked ? '尚未解锁' : '待揭晓'}` }}</span></button></div><div class="leaf-folio" aria-hidden="true"><span/> ARCHIVE　/　{{ pad(albumTab+1) }} <span/></div></div></section>

      <footer class="desk-footer"><div class="storage-note" :class="{ off: !view.storageOk }"><i/>{{ view.storageOk ? '进度保存在本机' : '浏览器未能保存，离开后进度可能丢失' }}</div><div class="prefs"><button type="button" data-action="sound" :aria-pressed="view.sound" @click="act('sound')"><InkIcon :name="view.sound ? 'sound' : 'mute'"/>声音{{ view.sound ? '开' : '关' }}</button><i/><button type="button" data-action="motion" :aria-pressed="!view.reducedMotion" @click="act('motion')"><InkIcon name="motion"/>动效{{ view.reducedMotion ? '关' : '开' }}</button></div></footer>
    </main>
    <dialog ref="modalEl" class="sheet-dialog" :aria-label="sheet === 'index' ? '翻册选关' : sheet === 'entry' ? '已收录的贴纸' : sheet === 'shop' ? '工坊商店' : '重新开始本关'" @close="afterClose" @click="($event.target === modalEl) && closeSheet()"><div class="dialog-paper"><button type="button" data-action="close" class="close-sheet" aria-label="关闭" @click="closeSheet"><InkIcon name="close"/></button>
      <template v-if="sheet === 'index'"><div class="eyebrow"><i/>BOOK INDEX</div><h2>翻册选关</h2><div class="book-tabs" aria-label="选择册页"><button v-for="(book,i) in books" :key="book" type="button" :data-index-book="i" :aria-pressed="i === tab" @click="tab=i"><small>VOL. {{ pad(i+1) }}</small>{{ book }}</button></div><div class="index-list"><button v-for="entry in pageEntries(tab)" :key="entry.id" :data-level="entry.id" type="button" :disabled="entry.locked" @click="openLevel(entry.id)"><b>{{ puzzleNumber(entry.id) }}</b><span><strong>{{ entry.sticker?.name || `第 ${puzzleNumber(entry.id)} 关` }}</strong><small>{{ entry.size }} × {{ entry.size }}　·　{{ entry.sticker ? '已收录' : entry.locked ? '尚未解锁' : '待揭晓' }}</small></span><InkIcon :name="entry.locked ? 'lock' : entry.perfect ? 'paw' : 'arrow'"/></button></div></template>
      <template v-if="sheet === 'restart'"><div class="eyebrow"><i/>FRESH PAGE</div><h2>重开这一关？</h2><p>当前这张棋盘会清空。已经收进图鉴的贴纸不会消失。</p><div class="dialog-actions"><button class="paper-btn" type="button" @click="closeSheet">继续玩</button><button class="paper-btn primary" data-action="confirmRestart" type="button" @click="retry">重新开始</button></div></template>
      <template v-if="sheet === 'entry' && viewedEntry?.sticker"><div class="eyebrow"><i/>STICKER NO. {{ puzzleNumber(viewedEntry.id) }}</div><h2>{{ viewedEntry.sticker.name }}</h2><div class="entry-print"><StickerPrint :sticker="viewedEntry.sticker"/></div><p>{{ viewedEntry.sticker.story }}</p><div class="dialog-actions"><span v-if="viewedEntry.perfect" class="paw-mark"><InkIcon name="paw"/>无伤爪印</span><button type="button" class="paper-btn primary" data-action="entryPlay" @click="openLevel(viewedEntry.id)">打开本关<InkIcon name="arrow"/></button></div></template>
      <template v-if="sheet === 'shop'">
        <h2>工坊商店</h2>
        <p>余额 {{ view.coins }} 金币。首通每关可得 {{ firstWinCoins }} 金币。</p>
        <div class="shop-stalls">
          <article v-for="item in items" :key="item" class="shop-product" :class="item">
            <span class="product-stamp"><InkIcon :name="goods[item].icon"/></span>
            <div>
              <h3>{{ goods[item].name }}</h3>
              <p>{{ goods[item].detail }}</p>
              <small>袋中 {{ view.bag[item] }} 件</small>
            </div>
            <button type="button" class="paper-btn small" :data-buy="item" :disabled="view.coins < goods[item].price"
              :aria-label="'购买' + goods[item].name + '，' + goods[item].price + '金币'" @click="send({ type: 'buy', item })">
              <InkIcon name="coin"/>{{ goods[item].price }}
            </button>
          </article>
        </div>
        <p class="shop-feedback" role="status">{{ view.shopMessage }}</p>
      </template>
    </div></dialog>
  </div>
</template>
