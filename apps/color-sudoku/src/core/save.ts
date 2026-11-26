import type { Move, Puzzle, Round, SaveV1 } from '../contracts.ts';
import { newGame, play } from './game.ts';

export const SAVE_KEY = 'color-sudoku:save:v1';
const EDITION = 'courtyard-01';
const record = (value: unknown): value is Record<string, unknown> => value !== null && typeof value === 'object' && !Array.isArray(value);

export function blankSave(reduceMotion = false): SaveV1 {
  return { version: 1, edition: EDITION, current: 1, tool: 'fill', practiceDone: false,
    sound: false, reduceMotion, wins: {}, rounds: {} };
}

// Reject a truncated/foreign journal for this page without damaging the other pages.
// Rebuilding by legal actions also recovers the precise automatic seals and the lost/won state.
export function restoreRound(puzzle: Puzzle, data: unknown): Round | null {
  if (!record(data) || data.seed !== puzzle.seed || !Array.isArray(data.moves) || data.moves.length > puzzle.size ** 2) return null;
  let round = newGame(puzzle);
  for (const move of data.moves as unknown[]) {
    if (!record(move) || typeof move.at !== 'number' || (move.tool !== 'fill' && move.tool !== 'empty')) return null;
    const next = play(puzzle, round, move.at, move.tool);
    if (next === round) return null;
    round = next;
  }
  return round;
}

export function readSave(text: string | null, catalog: readonly Puzzle[], reduceMotion = false): SaveV1 {
  const save = blankSave(reduceMotion);
  if (!text) return save;
  let raw: unknown;
  try { raw = JSON.parse(text); } catch { return save; }
  if (!record(raw) || raw.version !== save.version || raw.edition !== save.edition) return save;
  if (catalog.some(p => p.id === raw.current)) save.current = raw.current as number;
  save.tool = raw.tool === 'empty' ? 'empty' : 'fill';
  save.practiceDone = raw.practiceDone === true;
  save.sound = raw.sound === true;
  if (typeof raw.reduceMotion === 'boolean') save.reduceMotion = raw.reduceMotion;
  for (const puzzle of catalog) {
    const win = record(raw.wins) && raw.wins[puzzle.id];
    if (record(win) && typeof win.perfect === 'boolean') save.wins[puzzle.id] = { perfect: win.perfect };
    const round = restoreRound(puzzle, record(raw.rounds) && raw.rounds[puzzle.id]);
    if (round) recordRound(save, round);
  }
  return save;
}

// Journal and collection are serialized together. Level/coins are never incremented on restore.
export function recordRound(save: SaveV1, round: Round): { first: boolean } {
  save.rounds[round.levelId] = { seed: round.seed, moves: round.moves.map(({ at, tool }): Move => ({ at, tool })) };
  if (round.status !== 'won') return { first: false };
  const prior = save.wins[round.levelId];
  save.wins[round.levelId] = { perfect: (prior?.perfect ?? false) || round.lives === 3 };
  return { first: !prior };
}

export function rewards(save: SaveV1): { level: number; coins: number } {
  const count = Object.keys(save.wins).length;
  return { level: count + 1, coins: count * 100 };
}
