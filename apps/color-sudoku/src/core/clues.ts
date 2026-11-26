import type { Bit, Clues } from '../contracts.ts';

export function runs(line: readonly Bit[]): number[] {
  const result: number[] = [];
  let count = 0;
  for (const bit of line) {
    if (bit === 1) count++;
    else if (count) { result.push(count); count = 0; }
  }
  if (count) result.push(count);
  return result;
}

export function deriveClues(solution: readonly Bit[], size: number): Clues {
  if (!Number.isInteger(size) || size < 1 || solution.length !== size * size || solution.some(v => v !== 0 && v !== 1)) {
    throw new Error('Invalid square mask');
  }
  const rowClues = Array.from({ length: size }, (_, r) => runs(solution.slice(r * size, (r + 1) * size)));
  const columnClues = Array.from({ length: size }, (_, c) => runs(Array.from({ length: size }, (_, r) => solution[r * size + c])));
  return { size, rowClues, columnClues };
}
