import type { Clues } from '../contracts.ts';

export interface VerificationOptions { timeoutMs?: number; maxNodes?: number }

export class Rejected extends Error {}

/** One shared budget across both searches and the last, official game replay. */
export class Budget {
  private readonly deadline: number;
  private remaining: number;

  constructor({ timeoutMs = 2_000, maxNodes = 100_000 }: VerificationOptions) {
    if (!Number.isFinite(timeoutMs) || timeoutMs <= 0) throw new Rejected('timeout');
    if (!Number.isSafeInteger(maxNodes) || maxNodes <= 0) throw new Rejected('node-limit');
    this.deadline = performance.now() + timeoutMs;
    this.remaining = maxNodes;
  }

  checkTime(): void {
    if (performance.now() >= this.deadline) throw new Rejected('timeout');
  }

  visit(): void {
    this.checkTime();
    if (this.remaining === 0) throw new Rejected('node-limit');
    this.remaining--;
  }
}

/** Do not spread a Puzzle here: neither search may even read a private field. */
export function copyClues({ size, rowClues, columnClues }: Clues): Clues {
  if (!Number.isInteger(size) || size < 1 || size > 20) throw new Rejected('invalid-clues');
  function copyAxis(lines: number[][]): number[][] {
    if (!Array.isArray(lines) || lines.length !== size) throw new Rejected('invalid-clues');
    return Array.from(lines, runs => {
      if (!Array.isArray(runs) || runs.length > size) throw new Rejected('invalid-clues');
      const copy = Array.from(runs);
      if (copy.some(n => !Number.isInteger(n) || n < 1)
        || copy.reduce((a, b) => a + b, Math.max(0, copy.length - 1)) > size) {
        throw new Rejected('invalid-clues');
      }
      return copy;
    });
  }
  return { size, rowClues: copyAxis(rowClues), columnClues: copyAxis(columnClues) };
}
