import type { Cell, Clues, Puzzle, Round, Tool } from '../contracts.ts';

export const isInk = (cell: Cell): boolean => cell === 'filled' || cell === 'miss-filled';
export function newGame(puzzle: Puzzle): Round {
  return { levelId: puzzle.id, seed: puzzle.seed, cells: Array<Cell>(puzzle.size ** 2).fill('unknown'),
    lives: 3, status: 'playing', moves: [], message: '' };
}

// Only public clues and already visible ink are used for sealing, never the answer.
function sealCompletedLines({ size, rowClues, columnClues }: Clues, cells: Cell[]): void {
  for (let line = 0; line < size; line++) {
    for (const axis of ['row', 'column'] as const) {
      const clue = axis === 'row' ? rowClues[line] : columnClues[line];
      const at = (i: number) => axis === 'row' ? line * size + i : i * size + line;
      let ink = 0;
      for (let i = 0; i < size; i++) if (isInk(cells[at(i)])) ink++;
      if (ink !== clue.reduce((a, b) => a + b, 0)) continue;
      for (let i = 0; i < size; i++) if (cells[at(i)] === 'unknown') cells[at(i)] = 'empty';
    }
  }
}

export function play(puzzle: Puzzle, round: Round, at: number, tool: Tool): Round {
  if (round.status !== 'playing' || puzzle.id !== round.levelId || puzzle.seed !== round.seed || !Number.isInteger(at)
    || (tool !== 'fill' && tool !== 'empty') || round.cells[at] !== 'unknown') return round;
  const ink = puzzle.solution[at] === 1;
  const correct = ink === (tool === 'fill');
  const cells = round.cells.slice();
  cells[at] = ink ? (correct ? 'filled' : 'miss-filled') : (correct ? 'empty' : 'miss-empty');
  const lives = round.lives - (correct ? 0 : 1);
  sealCompletedLines(puzzle, cells);
  // A last wrong move may reveal the last missing cell. Losing the third chance always takes precedence.
  const status = lives === 0 ? 'lost' : cells.includes('unknown') ? 'playing' : 'won';
  const explanation = ink ? '这格要涂色，已经帮你涂好了。' : '这格要留白，已经帮你标好了。';
  const remaining = lives === 0 ? '这次的三次机会用完了。' : `还剩${lives === 2 ? '两' : '一'}次机会。`;
  return { ...round, cells, lives, status, moves: [...round.moves, { at, tool }], message: correct ? '' : explanation + remaining };
}
