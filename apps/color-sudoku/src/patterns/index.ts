import type { Puzzle } from '../contracts.ts';
import { deriveClues } from '../core/clues.ts';
import { stages } from '../core/progression.ts';
import { expansionPuzzle } from './expansion.ts';
import { Recipe, Sheet } from './paper.ts';
import type { Artist } from './paper.ts';
import { fish, carrot, heart, mushroom } from './little.ts';
import { rabbit, kitten, hamster, duck } from './friends.ts';
import { sleepingCat, squirrel, rooster, goat } from './yard.ts';

const artists: readonly Artist[] = [fish, carrot, heart, mushroom, rabbit, kitten, hamster, duck, sleepingCat, squirrel, rooster, goat];

// Chosen pairs are part of the edition. A reprint must not silently randomise a saved sticker.
export const seeds: { id: number; primary: number; fallback: number }[] = [
  { id: 1, primary: 0, fallback: 41 }, { id: 2, primary: 6, fallback: 9 },
  { id: 3, primary: 0, fallback: 47 }, { id: 4, primary: 0, fallback: 16 },
  { id: 5, primary: 0, fallback: 34 }, { id: 6, primary: 18, fallback: 21 },
  { id: 7, primary: 1, fallback: 39 }, { id: 8, primary: 0, fallback: 51 },
  { id: 9, primary: 0, fallback: 51 }, { id: 10, primary: 0, fallback: 28 },
  { id: 11, primary: 0, fallback: 16 }, { id: 12, primary: 0, fallback: 103 },
  { id: 13, primary: 0, fallback: 100 }, { id: 14, primary: 0, fallback: 114 },
  { id: 15, primary: 0, fallback: 100 }, { id: 16, primary: 0, fallback: 100 },
  { id: 17, primary: 2, fallback: 6 }, { id: 18, primary: 0, fallback: 15 },
  { id: 19, primary: 0, fallback: 4 }, { id: 20, primary: 0, fallback: 2 },
  { id: 21, primary: 0, fallback: 2 }, { id: 22, primary: 0, fallback: 1 },
  { id: 23, primary: 0, fallback: 4 }, { id: 24, primary: 0, fallback: 5 },
  { id: 25, primary: 1, fallback: 2 }, { id: 26, primary: 0, fallback: 2 },
  { id: 27, primary: 1, fallback: 2 }, { id: 28, primary: 1, fallback: 3 },
  { id: 29, primary: 0, fallback: 4 }, { id: 30, primary: 29, fallback: 81 },
  { id: 31, primary: 6, fallback: 11 }, { id: 32, primary: 0, fallback: 4 },
  { id: 33, primary: 0, fallback: 1 }, { id: 34, primary: 0, fallback: 1 },
  { id: 35, primary: 0, fallback: 1 }, { id: 36, primary: 1, fallback: 2 },
];

export function generatePuzzle(id: number, seed: number): Puzzle {
  if (!Number.isInteger(id) || id < 1 || id > seeds.length) throw new RangeError(`Unknown level: ${id}`);
  if (!Number.isInteger(seed) || seed < 0 || seed > 0xffffffff) throw new RangeError(`Invalid recipe seed: ${seed}`);
  if (id > artists.length) return expansionPuzzle(id, seed);
  const book = stages[Math.floor((id - 1) / 4)]!;
  const paper = new Sheet(book.size);
  const { solution, sticker } = paper.finish(artists[id - 1]!(paper, new Recipe(seed)));
  return { ...deriveClues(solution, book.size), size: book.size, book: book.book, id, seed, solution, sticker };
}
