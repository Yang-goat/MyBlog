<script setup lang="ts">
import { computed, nextTick, onMounted, onUnmounted, reactive, ref, shallowRef } from 'vue';
import puzzles from 'virtual:sticker-edition';
import GameShell from './ui/GameShell.vue';
import type { Action, GameEffect, GameView, Item, PublicPuzzle, Round, Size, Tool } from './contracts.ts';
import { moveEffect, newGame, play } from './core/game.ts';
import { blankSave, LEGACY_SAVE_KEY, readSave, recordRound, restoreRound, SAVE_KEY } from './core/save.ts';
import { canOpen, progression, stages } from './core/progression.ts';
import { bag, buy, canUse, goods, use, wallet } from './core/shop.ts';
import { paperSound } from './core/sound.ts';

const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
const storageOk = ref(true);
function load() {
  try { return readSave(window.localStorage.getItem(SAVE_KEY) ?? window.localStorage.getItem(LEGACY_SAVE_KEY), puzzles, motion.matches); }
  catch { storageOk.value = false; return blankSave(motion.matches); }
}
const save = reactive(load());
const current = computed(() => puzzles.find(p => p.id === save.current)!);
const round = shallowRef(restoreRound(current.value, save.rounds[save.current]) ?? newGame(current.value));
const page = ref<GameView['page']>(save.practiceDone ? 'play' : 'tutorial');
let beforePractice: 'play' | 'album' = 'play';
let beforeAlbum: 'play' | 'tutorial' = 'play';
const firstReward = ref(false);
const progress = computed(() => progression(save));
const unlocked = ref<Size | null>(null);
const effect = shallowRef<GameEffect | null>(null);
const marks = ref<Record<number, GameEffect>>({});
const shopMessage = ref('');
let serial = 0;
let strokeTool: Tool = 'fill';
let strokeBlocked = false;
const ordered = stages.flatMap(stage => stage.ids.map(id => puzzles.find(puzzle => puzzle.id === id)!));
const usable = (item: Item) => page.value === 'play' && canUse(current.value, round.value, item);
const publicPuzzle = computed<PublicPuzzle>(() => {
  const { id, seed, size, book, rowClues, columnClues } = current.value;
  return { id, seed, size, book, rowClues, columnClues };
});
const view = computed<GameView>(() => ({
  page: page.value, puzzle: publicPuzzle.value, round: round.value, tool: save.tool,
  entries: ordered.map(p => ({ id: p.id, book: p.book, size: p.size, sticker: save.wins[p.id] ? p.sticker : null,
    perfect: save.wins[p.id]?.perfect ?? false, locked: !canOpen(p, save, progress.value.size) })),
  revealed: round.value.status === 'won' ? current.value.sticker : null, progress: progress.value, coins: wallet(save),
  bag: bag(save), shopMessage: shopMessage.value, usable: { chalk: usable('chalk'), ink: usable('ink'), heart: usable('heart') },
  unlocked: unlocked.value, effect: effect.value, marks: marks.value,
  sound: save.sound, reducedMotion: save.reduceMotion, storageOk: storageOk.value, firstReward: firstReward.value,
}));
function persist() {
  try { window.localStorage.setItem(SAVE_KEY, JSON.stringify(save)); storageOk.value = true; }
  catch { storageOk.value = false; }
}
function updateRound(next: Round) {
  if (next === round.value) return false;
  const previousSize = progress.value.size;
  const change = { ...moveEffect(round.value, next), serial: ++serial };
  round.value = next;
  effect.value = change;
  if (change.at !== undefined) marks.value[change.at] = change;
  firstReward.value = recordRound(save, next).first;
  if (progress.value.size > previousSize) unlocked.value = progress.value.size;
  return true;
}
function clearEffects() {
  firstReward.value = false;
  unlocked.value = null;
  effect.value = null;
  marks.value = {};
  shopMessage.value = '';
}
function soundAfterMove() {
  if (save.sound && round.value.status !== 'lost') paperSound(round.value.status === 'won' ? 'win' : 'mark');
}
function act(action: Action) {
  switch (action.type) {
    case 'mark': {
      if (page.value !== 'play') return;
      if (!updateRound(play(current.value, round.value, action.at, save.tool))) return;
      soundAfterMove();
      break;
    }
    case 'stroke': {
      if (page.value !== 'play') return;
      if (action.start) { strokeTool = save.tool; strokeBlocked = false; }
      if (strokeBlocked) return;
      let changed = false;
      for (const at of action.at) {
        if (!updateRound(play(current.value, round.value, at, strokeTool))) continue;
        changed = true;
        if (effect.value?.kind === 'miss') { strokeBlocked = true; break; }
      }
      if (!changed) return;
      soundAfterMove();
      break;
    }
    case 'buy':
      if (!buy(save, action.item)) return;
      shopMessage.value = `已将「${goods[action.item].name}」放进道具袋。`;
      break;
    case 'use': {
      if (page.value !== 'play' || !updateRound(use(save, current.value, round.value, action.item))) return;
      shopMessage.value = `已使用「${goods[action.item].name}」。`;
      soundAfterMove();
      break;
    }
    case 'tool': save.tool = action.tool; break;
    case 'open': {
      const puzzle = puzzles.find(p => p.id === action.id);
      if (!puzzle || !canOpen(puzzle, save, progress.value.size)) return;
      save.current = puzzle.id;
      save.practiceDone = true; // Explicitly opening a numbered page also leaves the optional practice.
      round.value = restoreRound(puzzle, save.rounds[puzzle.id]) ?? newGame(puzzle);
      if (round.value.status === 'won') round.value = newGame(puzzle);
      recordRound(save, round.value);
      page.value = 'play'; clearEffects(); save.tool = 'fill'; break;
    }
    case 'retry':
      round.value = newGame(current.value); recordRound(save, round.value);
      page.value = 'play'; clearEffects(); save.tool = 'fill'; break;
    case 'practice': beforePractice = page.value === 'album' ? 'album' : 'play'; page.value = 'tutorial'; return;
    case 'finishPractice': save.practiceDone = true; page.value = beforePractice; break;
    case 'album': if (page.value !== 'album') beforeAlbum = page.value; page.value = 'album'; return;
    case 'back': page.value = beforeAlbum; return;
    case 'sound': save.sound = !save.sound; if (save.sound) paperSound('mark'); break;
    case 'motion': save.reduceMotion = !save.reduceMotion; break;
  }
  persist();
}
function systemMotion(e: MediaQueryListEvent) { save.reduceMotion = e.matches; persist(); }
// Diagnostics contain visible information only; no truth mask, future sticker names or next moves.
const win = window as Window & { render_game_to_text?: () => string; advanceTime?: (ms: number) => Promise<void> };
onMounted(() => {
  motion.addEventListener('change', systemMotion);
  win.render_game_to_text = () => {
    const v = view.value;
    const practice = v.page === 'tutorial' ? { clue: [2,1], marks: [...document.querySelectorAll<HTMLElement>('[data-practice-cell]')].map(el => el.dataset.state), tool: document.querySelector<HTMLElement>('[data-tool][aria-pressed="true"]')?.dataset.tool } : undefined;
    return JSON.stringify({ page: v.page, practice, origin: 'top-left, row-major, zero-based', id: v.puzzle.id, book: v.puzzle.book,
      size: v.puzzle.size, rows: v.puzzle.rowClues, columns: v.puzzle.columnClues, marks: v.round.cells,
      status: v.round.status, chances: v.round.lives, tool: v.tool, message: v.round.message, level: v.progress.level,
      progress: v.progress, coins: v.coins, bag: v.bag, usable: v.usable, unlocked: v.unlocked,
      collected: v.entries.filter(e => e.sticker).map(e => ({ id: e.id, name: e.sticker!.name, paw: e.perfect })), sound: v.sound, reducedMotion: v.reducedMotion });
  };
  win.advanceTime = async (ms: number) => {
    if (Number.isFinite(ms) && ms > 0) for (const animation of document.getAnimations()) {
      if (typeof animation.currentTime === 'number') animation.currentTime += ms;
    }
    await nextTick();
  };
});
onUnmounted(() => { motion.removeEventListener('change', systemMotion); delete win.render_game_to_text; delete win.advanceTime; });
</script>

<template><GameShell :view="view" @action="act" /></template>
