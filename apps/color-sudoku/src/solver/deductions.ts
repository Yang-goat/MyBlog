import type { Axis, Bit, Clues, Deduction, Proof, ProofStep } from '../contracts.ts';
import { Rejected } from './budget.ts';
import type { Budget } from './budget.ts';

type Board = (-1 | Bit)[]; // -1 means unknown; the game starts without any automatic marks.
interface Line { axis: Axis; line: number; clue: number[]; cells: number[]; placements: number[]; total: number }
interface Edge { board: Board; step: ProofStep }
interface Tally { count: 0 | 1 | 2; steps: ProofStep[] }

/** Build placements by sliding separated whole runs; independent of the exact word counter. */
function placements(size: number, clue: number[]): number[] {
  const result: number[] = [];
  const required = Array<number>(clue.length + 1).fill(0);
  for (let i = clue.length - 1; i >= 0; i--) {
    required[i] = clue[i] + required[i + 1] + (i + 1 < clue.length ? 1 : 0);
  }
  function place(i: number, start: number, word: number): void {
    if (i === clue.length) { result.push(word); return; }
    const run = (1 << clue[i]) - 1;
    for (let pos = start; pos <= size - required[i]; pos++) {
      place(i + 1, pos + clue[i] + 1, word | (run << pos));
    }
  }
  place(0, 0, 0);
  return result;
}

export class Deductions {
  private readonly lines: Line[];
  private readonly size: number;

  constructor({ size, rowClues, columnClues }: Clues) {
    this.size = size;
    this.lines = [];
    for (const axis of ['row', 'column'] as const) {
      const clues = axis === 'row' ? rowClues : columnClues;
      for (let line = 0; line < size; line++) {
        const clue = clues[line];
        this.lines.push({ axis, line, clue, placements: placements(size, clue), total: clue.reduce((a, b) => a + b, 0),
          cells: Array.from({ length: size }, (_, i) => axis === 'row' ? line * size + i : i * size + line) });
      }
    }
  }

  start(): Board { return Array<-1 | Bit>(this.size ** 2).fill(-1); }

  /** The atomic unit is the full line consensus, followed by *all* gameplay seals. */
  step(board: Board, axis: Axis, index: number): Edge | null {
    if ((axis !== 'row' && axis !== 'column') || !Number.isInteger(index) || index < 0 || index >= this.size) return null;
    const line = this.lines[(axis === 'row' ? 0 : this.size) + index];
    let knownInk = 0, knownEmpty = 0;
    for (let i = 0; i < this.size; i++) {
      if (board[line.cells[i]] === 1) knownInk |= 1 << i;
      if (board[line.cells[i]] === 0) knownEmpty |= 1 << i;
    }
    let every = (1 << this.size) - 1, any = 0, possibilities = 0;
    for (const word of line.placements) {
      if ((word & knownInk) !== knownInk || (word & knownEmpty)) continue;
      possibilities++;
      every &= word;
      any |= word;
    }
    if (!possibilities) throw new Rejected('no-solution');
    const forced: Deduction[] = [];
    for (let i = 0; i < this.size; i++) {
      const at = line.cells[i];
      if (board[at] !== -1) continue;
      if (every & (1 << i)) forced.push({ at, value: 1 });
      else if (!(any & (1 << i))) forced.push({ at, value: 0 });
    }
    if (!forced.length) return null;
    const next = board.slice();
    for (const { at, value } of forced) next[at] = value;
    const sealed: number[] = [];
    for (const { cells, total } of this.lines) {
      let ink = 0;
      for (const at of cells) if (next[at] === 1) ink++;
      if (ink !== total) continue;
      // Closing a line adds only empties: it cannot change another line's ink count.
      for (const at of cells) if (next[at] === -1) { next[at] = 0; sealed.push(at); }
    }
    sealed.sort((a, b) => a - b);
    return { board: next, step: { axis, line: index, clue: line.clue.slice(), possibilities, forced, sealed } };
  }

  private children(board: Board, budget: Budget): Edge[] {
    const byBoard = new Map<string, Edge>();
    for (const { axis, line } of this.lines) {
      budget.checkTime();
      const edge = this.step(board, axis, line);
      if (!edge) continue;
      const key = edge.board.join(',');
      if (!byBoard.has(key)) byBoard.set(key, edge);
    }
    return [...byBoard.values()];
  }

  private satisfiesAllLines(board: Board): boolean {
    return this.lines.every(({ cells, placements }) => {
      let actual = 0;
      for (let i = 0; i < cells.length; i++) if (board[cells[i]] === 1) actual |= 1 << i;
      return placements.includes(actual);
    });
  }

  classify(budget: Budget): Proof {
    const memo = new Map<string, Tally>();
    const visit = (board: Board): Tally => {
      budget.checkTime();
      const key = board.join(',');
      const saved = memo.get(key);
      if (saved) return saved;
      budget.visit();
      let result: Tally;
      if (!board.includes(-1)) {
        result = { count: this.satisfiesAllLines(board) ? 1 : 0, steps: [] };
      } else {
        result = { count: 0, steps: [] };
        for (const edge of this.children(board, budget)) {
          const suffix = visit(edge.board);
          if (!suffix.count) continue; // a locally legal step is not a complete chain
          if (!result.count) result.steps = [edge.step, ...suffix.steps];
          result.count = result.count + suffix.count >= 2 ? 2 : 1;
          if (result.count === 2) break;
        }
      }
      memo.set(key, result);
      return result;
    };

    // At the root also count distinct openings that actually finish, not just raw line choices.
    budget.visit();
    let openings = 0, chains = 0;
    let steps: ProofStep[] = [];
    for (const edge of this.children(this.start(), budget)) {
      const suffix = visit(edge.board);
      if (!suffix.count) continue;
      if (!openings) steps = [edge.step, ...suffix.steps];
      openings++;
      chains = Math.min(2, chains + suffix.count);
    }
    if (!chains) throw new Rejected('requires-guess');
    return { route: chains === 1 ? 'single' : 'multiple', openings, steps };
  }
}

/** Restrict only the proof input, never the player's marks, when checking unordered batches. */
export function sameBatch(expected: Deduction[], supplied: Deduction[]): boolean {
  if (!Array.isArray(supplied) || supplied.length !== expected.length) return false;
  const values = new Map(expected.map(({ at, value }) => [at, value]));
  for (const move of supplied) {
    if (!move || !values.has(move.at) || values.get(move.at) !== move.value) return false;
    values.delete(move.at);
  }
  return values.size === 0;
}

export function sameSeals(expected: number[], supplied: number[]): boolean {
  if (!Array.isArray(supplied) || supplied.length !== expected.length) return false;
  const pending = new Set(expected);
  for (const at of supplied) if (!pending.delete(at)) return false;
  return pending.size === 0;
}
