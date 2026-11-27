import type { Progress, Puzzle, SaveData, Size } from '../contracts.ts';

export const stages = [
  { size: 5, book: '谁来过小院', ids: [1, 2, 3, 4, 13, 14] },
  { size: 7, book: '认识新朋友', ids: [5, 6, 7, 8, 15, 16] },
  { size: 10, book: '小院的一天', ids: [9, 10, 11, 12, 17, 18] },
  { size: 12, book: '窗边的花园', ids: [19, 20, 21, 22, 23, 24] },
  { size: 15, book: '出门去野餐', ids: [25, 26, 27, 28, 29, 30] },
  { size: 20, book: '山谷的四季', ids: [31, 32, 33, 34, 35, 36] },
] as const satisfies readonly { size: Size; book: string; ids: readonly number[] }[];

export function progression(save: Pick<SaveData, 'wins'>): Progress {
  for (const [i, stage] of stages.entries()) {
    const cleared = stage.ids.filter(id => save.wins[id]).length;
    const nextSize = stages[i + 1]?.size ?? null;
    if (cleared < stage.ids.length || nextSize === null) {
      return { level: i + 1, size: stage.size, cleared, total: stage.ids.length, nextSize };
    }
  }
  throw Error('Missing puzzle stages');
}

export function canOpen(puzzle: Puzzle, save: SaveData, size: Size): boolean {
  return puzzle.size <= size || !!save.wins[puzzle.id] || !!save.rounds[puzzle.id]?.moves.length;
}
