import type { Puzzle, Round, SaveData } from '../contracts.ts';
import { heal, newGame, perfect, play } from './game.ts';
import { canOpen, progression } from './progression.ts';
import { emptyBag, items, wallet } from './shop.ts';

export const SAVE_KEY = 'color-sudoku:save:v2';
export const LEGACY_SAVE_KEY = 'color-sudoku:save:v1';
const EDITION = 'courtyard-01';
const record = (value: unknown): value is Record<string, unknown> => value !== null && typeof value === 'object' && !Array.isArray(value);

export function blankSave(reduceMotion = false): SaveData {
  return { version: 2, edition: EDITION, current: 1, tool: 'fill', practiceDone: false,
    sound: false, reduceMotion, wins: {}, rounds: {}, bought: emptyBag(), spent: emptyBag() };
}

// Reject a truncated/foreign journal for this page without damaging the other pages.
// Rebuilding by legal actions also recovers the precise automatic seals and the lost/won state.
export function restoreRound(puzzle: Puzzle, data: unknown, supportsItems = true): Round | null {
  if (!record(data) || data.seed !== puzzle.seed || !Array.isArray(data.moves) || data.moves.length > puzzle.size ** 2 * (supportsItems ? 2 : 1)) return null;
  let round = newGame(puzzle);
  for (const move of data.moves as unknown[]) {
    if (!record(move) || (!supportsItems && move.item !== undefined)) return null;
    let next: Round;
    if (move.item === 'heart') next = heal(round);
    else {
      if (typeof move.at !== 'number' || (move.tool !== 'fill' && move.tool !== 'empty')
        || (move.item !== undefined && move.item !== 'chalk' && move.item !== 'ink')) return null;
      next = play(puzzle, round, move.at, move.tool, move.item);
    }
    if (next === round) return null;
    round = next;
  }
  return round;
}

function counters(value: unknown) {
  if (!record(value)) return null;
  const result = emptyBag();
  for (const item of items) {
    const count = value[item];
    if (typeof count !== 'number' || !Number.isSafeInteger(count) || count < 0) return null;
    result[item] = count;
  }
  return result;
}

export function readSave(text: string | null, catalog: readonly Puzzle[], reduceMotion = false): SaveData {
  const save = blankSave(reduceMotion);
  if (!text) return save;
  let raw: unknown;
  try { raw = JSON.parse(text); } catch { return save; }
  if (!record(raw) || (raw.version !== 1 && raw.version !== 2) || raw.edition !== save.edition) return save;
  const legacy = raw.version === 1;
  save.tool = raw.tool === 'empty' ? 'empty' : 'fill';
  save.practiceDone = raw.practiceDone === true;
  save.sound = raw.sound === true;
  if (typeof raw.reduceMotion === 'boolean') save.reduceMotion = raw.reduceMotion;
  for (const puzzle of catalog) {
    const win = record(raw.wins) && raw.wins[puzzle.id];
    if (record(win) && typeof win.perfect === 'boolean') save.wins[puzzle.id] = { perfect: win.perfect };
    const round = restoreRound(puzzle, record(raw.rounds) && raw.rounds[puzzle.id], !legacy);
    if (round && !round.moves.some(move => move.item)) recordRound(save, round);
  }
  if (!legacy) {
    const bought = counters(raw.bought);
    const spent = counters(raw.spent);
    if (bought && spent && items.every(item => spent[item] <= bought[item])) {
      save.bought = bought;
      if (wallet(save) < 0) save.bought = emptyBag();
      else {
        save.spent = spent;
        const available = { ...spent };
        for (const puzzle of catalog) {
          if (save.rounds[puzzle.id]) continue;
          const round = restoreRound(puzzle, record(raw.rounds) && raw.rounds[puzzle.id]);
          if (!round) continue;
          const used = emptyBag();
          for (const move of round.moves) if (move.item) used[move.item]++;
          if (items.some(item => used[item] > available[item])) continue;
          for (const item of items) available[item] -= used[item];
          recordRound(save, round);
        }
      }
    }
  }
  const size = progression(save).size;
  const current = catalog.find(puzzle => puzzle.id === raw.current && canOpen(puzzle, save, size));
  save.current = current?.id ?? catalog.find(puzzle => puzzle.size === size && !save.wins[puzzle.id])?.id ?? 1;
  return save;
}

// Journal and collection are serialized together. Level/coins are never incremented on restore.
export function recordRound(save: SaveData, round: Round): { first: boolean } {
  save.rounds[round.levelId] = { seed: round.seed, moves: round.moves.map(move => ({ ...move })) };
  if (round.status !== 'won') return { first: false };
  const prior = save.wins[round.levelId];
  save.wins[round.levelId] = { perfect: (prior?.perfect ?? false) || perfect(round) };
  return { first: !prior };
}
