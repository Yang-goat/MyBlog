import type { Puzzle, Size } from '../contracts.ts';
import { deriveClues } from '../core/clues.ts';
import { Recipe, Sheet } from './paper.ts';
import type { Artist } from './paper.ts';
import { fish, carrot, heart, mushroom } from './little.ts';
import { rabbit, kitten, hamster, duck } from './friends.ts';
import { sleepingCat, squirrel, rooster, goat } from './yard.ts';

const books = [
  { name: '谁来过小院', size: 5 },
  { name: '认识新朋友', size: 7 },
  { name: '小院的一天', size: 10 },
] as const satisfies readonly { name: string; size: Size }[];

const artists: readonly Artist[] = [fish, carrot, heart, mushroom, rabbit, kitten, hamster, duck, sleepingCat, squirrel, rooster, goat];

// Chosen pairs are part of the edition. A reprint must not silently randomise a saved sticker.
export const seeds: { id: number; primary: number; fallback: number }[] = [
  { id: 1, primary: 0, fallback: 41 }, { id: 2, primary: 6, fallback: 9 },
  { id: 3, primary: 0, fallback: 47 }, { id: 4, primary: 0, fallback: 16 },
  { id: 5, primary: 0, fallback: 34 }, { id: 6, primary: 18, fallback: 21 },
  { id: 7, primary: 1, fallback: 39 }, { id: 8, primary: 0, fallback: 51 },
  { id: 9, primary: 0, fallback: 51 }, { id: 10, primary: 0, fallback: 28 },
  { id: 11, primary: 0, fallback: 16 }, { id: 12, primary: 0, fallback: 103 },
];

export function generatePuzzle(id: number, seed: number): Puzzle {
  if (!Number.isInteger(id) || id < 1 || id > artists.length) throw new RangeError(`Unknown level: ${id}`);
  if (!Number.isInteger(seed) || seed < 0 || seed > 0xffffffff) throw new RangeError(`Invalid recipe seed: ${seed}`);
  const book = books[Math.floor((id - 1) / 4)]!;
  const paper = new Sheet(book.size);
  const { solution, sticker } = paper.finish(artists[id - 1]!(paper, new Recipe(seed)));
  return { ...deriveClues(solution, book.size), size: book.size, book: book.name, id, seed, solution, sticker };
}
