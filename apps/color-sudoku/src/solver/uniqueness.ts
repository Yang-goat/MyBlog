import type { Clues } from '../contracts.ts';
import type { Budget } from './budget.ts';

/** Exact solution counter, saturated at two. Nothing from the deduction search is used here. */
export function countSolutions({ size, rowClues, columnClues }: Clues, budget: Budget): 0 | 1 | 2 {
  // Exhaustively index binary words by their literal integer run sequence (10 is one run).
  const words = new Map<string, number[]>();
  const full = (1 << size) - 1;
  for (let word = 0; word <= full; word++) {
    if ((word & 63) === 0) budget.checkTime();
    const runs: number[] = [];
    let run = 0;
    for (let i = 0; i <= size; i++) {
      if (word & (1 << i)) run++;
      else if (run) { runs.push(run); run = 0; }
    }
    const key = runs.join(',');
    const list = words.get(key);
    if (list) list.push(word);
    else words.set(key, [word]);
  }
  const rows = rowClues.map(clue => words.get(clue.join(',')) ?? []);
  const columns = columnClues.map(clue => words.get(clue.join(',')) ?? []);

  function search(unassigned: number, domains: number[][]): 0 | 1 | 2 {
    budget.visit();
    if (!unassigned) return 1;
    // A domain contains only column words matching every row chosen on this branch.
    const alwaysInk = domains.map(domain => domain.reduce((a, b) => a & b, full));
    const canInk = domains.map(domain => domain.reduce((a, b) => a | b, 0));
    let row = -1;
    let choices: number[] = [];
    for (let r = 0; r < size; r++) {
      if (!(unassigned & (1 << r))) continue;
      let required = 0, allowed = 0;
      for (let c = 0; c < size; c++) {
        if (alwaysInk[c] & (1 << r)) required |= 1 << c;
        if (canInk[c] & (1 << r)) allowed |= 1 << c;
      }
      const compatible = rows[r].filter(word => (word & required) === required && !(word & ~allowed));
      if (!compatible.length) return 0;
      if (row < 0 || compatible.length < choices.length) { row = r; choices = compatible; }
    }
    let count: 0 | 1 = 0;
    for (const word of choices) {
      const narrowed = domains.map((domain, c) => domain.filter(col => ((col >> row) & 1) === ((word >> c) & 1)));
      if (narrowed.some(domain => !domain.length)) continue;
      const found = search(unassigned ^ (1 << row), narrowed);
      if (found === 2 || (count === 1 && found === 1)) return 2;
      if (found === 1) count = 1;
    }
    return count;
  }
  return search(full, columns);
}
