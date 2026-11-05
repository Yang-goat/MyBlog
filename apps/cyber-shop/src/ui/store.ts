import { shallowRef, ref } from 'vue';
import { applyAction, createGame, visibleState } from '../game/engine';
import { loadSave, saveGame, replaceSave, saveDayBackup, replaceDayBackup, restoreDayBackup, exportSave, importSave } from '../persistence/storage';
import type { Action, GameState, PresentationEvent } from '../game/types';

export const state = shallowRef<GameState>(createGame(20261105));
export const started = ref(false);
export const modal = ref('');
export const toast = ref('');
export const saveError = ref('');
const backupError = ref('');
export const hasSave = ref(false);
export const selectedItem = ref('');
export const selectedOrder = ref('');
export const reducedMotion = ref(matchMedia('(prefers-reduced-motion: reduce)').matches);
export const muted = ref(false);
export const volume = ref(0.25);
const listeners = new Set<(events: PresentationEvent[]) => void>();
let audio: AudioContext | undefined;
let timer: ReturnType<typeof setTimeout>;

export function notify(text: string) { toast.value = text; clearTimeout(timer); timer = setTimeout(() => toast.value = '', 6500); }
export function listen(fn: (events: PresentationEvent[]) => void) { listeners.add(fn); return () => listeners.delete(fn); }
export function unlockAudio() { if (!audio) audio = new AudioContext(); if (audio.state === 'suspended') void audio.resume().catch(() => {}); }
export function sound(kind = 'trade') {
  if (!audio || muted.value || audio.state !== 'running') return;
  const osc = audio.createOscillator(); const gain = audio.createGain();
  osc.type = 'sine'; osc.frequency.setValueAtTime(kind === 'error' ? 160 : kind === 'repair' ? 680 : 440, audio.currentTime);
  osc.frequency.exponentialRampToValueAtTime(kind === 'error' ? 100 : 880, audio.currentTime + 0.15);
  gain.gain.setValueAtTime(volume.value * 0.12, audio.currentTime); gain.gain.exponentialRampToValueAtTime(0.001, audio.currentTime + 0.25);
  osc.connect(gain).connect(audio.destination); osc.start(); osc.stop(audio.currentTime + 0.26);
}
export function dispatch(action: Action) {
  unlockAudio();
  const previousDay = state.value.day;
  const result = applyAction(state.value, action);
  if (result.ok) {
    state.value = result.state;
    if (state.value.day !== previousDay || action.type === 'openDay') backupError.value = saveDayBackup(state.value).error ?? '';
    const saved = saveGame(state.value); saveError.value = [saved.error, backupError.value].filter(Boolean).join('；'); hasSave.value = saved.ok;
  }
  if (result.events.length) notify(result.events.map(e => e.text).join(' · '));
  sound(result.ok ? result.events[0]?.type : 'error');
  listeners.forEach(fn => fn(result.events));
  return result.ok;
}
export function inspectSave() { const saved = loadSave(); hasSave.value = !!saved.state; saveError.value = saved.error ?? ''; }
export function begin(seed = 20261105) {
  state.value = createGame(seed); const result = replaceSave(state.value); saveError.value = result.error ?? '';
  backupError.value = replaceDayBackup(state.value).error ?? ''; saveError.value = [result.error, backupError.value].filter(Boolean).join('；'); hasSave.value = result.ok; started.value = true; modal.value = ''; unlockAudio();
}
export function resume() { const saved = loadSave(); if (saved.state) { state.value = saved.state; started.value = true; modal.value = ''; unlockAudio(); } else notify(saved.error ?? '还没有存档。'); }
export function restore() { const saved = restoreDayBackup(); if (saved.state) { const written = replaceSave(saved.state); if (!written.ok) { saveError.value = written.error ?? '无法保存恢复的进度'; notify(saveError.value); return; } state.value = saved.state; started.value = true; modal.value = ''; saveError.value = ''; notify('已恢复当日开始的备份。'); } else notify(saved.error ?? '没有当日备份。'); }
export function downloadSave() {
  const url = URL.createObjectURL(new Blob([exportSave(state.value)], { type: 'application/json' }));
  const a = document.createElement('a'); a.href = url; a.download = `cyber-shop-day-${state.value.day}.json`; a.click(); URL.revokeObjectURL(url);
}
export async function uploadSave(file?: File) {
  if (!file) return;
  try { const next = importSave(await file.text()); const result = replaceSave(next); if (!result.ok) throw new Error(result.error ?? '无法写入'); state.value = next; backupError.value = replaceDayBackup(next).error ?? ''; started.value = true; modal.value = ''; saveError.value = backupError.value; hasSave.value = true; notify('存档已导入，并以导入点建立本地备份；下次开门后更新为当日开始备份。'); }
  catch (e) { notify(`导入失败：${e instanceof Error ? e.message : String(e)}`); }
}
export function textState() {
  return JSON.stringify({ mode: started.value ? state.value.phase : 'title', panel: modal.value, selectedItem: selectedItem.value, selectedOrder: selectedOrder.value, coordinates: 'Phaser 1440×900，原点左上，x向右、y向下；DOM响应式', game: visibleState(state.value) });
}
export async function fullScreen() { try { if (document.fullscreenElement) await document.exitFullscreen(); else await document.documentElement.requestFullscreen(); } catch { notify('当前浏览器未允许全屏，可使用浏览器全屏功能。'); } }
export function cleanup() { clearTimeout(timer); void audio?.close(); listeners.clear(); }
