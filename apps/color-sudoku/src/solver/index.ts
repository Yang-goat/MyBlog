import type { Clues, Proof, Puzzle, Verification } from '../contracts.ts';
import { newGame, play } from '../core/game.ts';
import { Budget, copyClues, Rejected } from './budget.ts';
import type { VerificationOptions } from './budget.ts';
import { Deductions, sameBatch, sameSeals } from './deductions.ts';
import { countSolutions } from './uniqueness.ts';

export type { VerificationOptions } from './budget.ts';

function certify(publicInput: Clues, budget: Budget): { logic: Deductions; proof: Proof } {
  const clues = copyClues(publicInput);
  const count = countSolutions(clues, budget);
  if (!count) throw new Rejected('no-solution');
  if (count > 1) throw new Rejected('multiple-solutions');
  const logic = new Deductions(clues);
  const proof = logic.classify(budget);
  budget.checkTime();
  return { logic, proof };
}

/** Clues-only API for the editor. This never reads solution/sticker, even on success. */
export function analyzeClues(clues: Clues, options: VerificationOptions = {}): Verification {
  try {
    const { proof } = certify(clues, new Budget(options));
    return { ok: true, proof };
  } catch (e) {
    if (e instanceof Rejected) return { ok: false, reason: e.message };
    throw e;
  }
}

/** All answer access is confined to this final pass and to official play(). */
function officialReplay(puzzle: Puzzle, supplied: Proof, logic: Deductions, certified: Proof, budget: Budget): boolean {
  if (!supplied || supplied.route !== certified.route || supplied.openings !== certified.openings
    || !Array.isArray(supplied.steps) || !supplied.steps.length || supplied.steps.length > puzzle.size ** 2) return false;
  let round = newGame(puzzle);
  let board = logic.start();
  if (round.lives !== 3 || round.status !== 'playing' || !round.cells.every(c => c === 'unknown')) return false;
  for (const proposed of supplied.steps) {
    budget.checkTime();
    if (!proposed || round.status !== 'playing') return false;
    const edge = logic.step(board, proposed.axis, proposed.line);
    if (!edge) return false;
    const { clue, possibilities, forced, sealed } = edge.step;
    if (possibilities !== proposed.possibilities || !Array.isArray(proposed.clue) || proposed.clue.length !== clue.length
      || !clue.every((n, i) => n === proposed.clue[i]) || !sameBatch(forced, proposed.forced) || !sameSeals(sealed, proposed.sealed)) return false;
    for (const { at, value } of proposed.forced) {
      // An earlier click in the same batch may already have correctly sealed this forced empty.
      if (round.cells[at] === 'unknown') {
        round = play(puzzle, round, at, value === 1 ? 'fill' : 'empty');
      }
      if (round.lives !== 3 || round.cells[at] !== (value === 1 ? 'filled' : 'empty')) return false;
    }
    board = edge.board;
    for (let at = 0; at < board.length; at++) {
      const expected = board[at] === 1 ? 'filled' : board[at] === 0 ? 'empty' : 'unknown';
      if (round.cells[at] !== expected) return false;
    }
  }
  budget.checkTime();
  if (round.status !== 'won' || round.lives !== 3 || board.includes(-1)) return false;
  const answer = puzzle.solution;
  return Array.isArray(answer) && answer.length === board.length && board.every((mark, at) => mark === answer[at]);
}

/** Publication gate: independently count pictures, classify complete chains, then play a perfect round. */
export function verifyPuzzle(puzzle: Puzzle, options: VerificationOptions = {}): Verification {
  try {
    const budget = new Budget(options);
    const { logic, proof } = certify(puzzle, budget);
    if (!officialReplay(puzzle, proof, logic, proof, budget)) return { ok: false, reason: 'replay-failed' };
    budget.checkTime();
    return { ok: true, proof };
  } catch (e) {
    if (e instanceof Rejected) return { ok: false, reason: e.message };
    throw e;
  }
}

/** Don't trust even the metadata on a stored proof. An alternative complete valid witness is welcome. */
export function replayProof(puzzle: Puzzle, proof: Proof): boolean {
  try {
    const budget = new Budget({});
    const { logic, proof: certified } = certify(puzzle, budget);
    const valid = officialReplay(puzzle, proof, logic, certified, budget);
    budget.checkTime();
    return valid;
  } catch (e) {
    if (e instanceof Rejected) return false;
    throw e;
  }
}
