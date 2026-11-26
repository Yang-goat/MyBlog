import type { Proof, Puzzle, Size } from '../src/contracts.ts';
import { generatePuzzle, seeds } from '../src/patterns/index.ts';
import { silhouetteKey } from '../src/patterns/paper.ts';
import { verifyPuzzle } from '../src/solver/index.ts';
import type { VerificationOptions } from '../src/solver/index.ts';

export interface Certified { puzzle: Puzzle; proof: Proof }
export interface Published extends Certified { source: 'primary' | 'fallback'; fallback: Certified; reason?: string }
const volumes = ['谁来过小院', '认识新朋友', '小院的一天'];
const sizes: Size[] = [5, 7, 10];

// Treat rotations, reflections and a shifted copy as one outline, not more stickers.
export function shapeKey(puzzle: Puzzle): string {
  return silhouetteKey(puzzle.solution, puzzle.size);
}

function certify(id: number, seed: number, options: VerificationOptions, generate: typeof generatePuzzle): Certified {
  const puzzle = generate(id, seed);
  const book = Math.floor((id - 1) / 4);
  if (puzzle.id !== id || puzzle.seed !== seed || puzzle.book !== volumes[book] || puzzle.size !== sizes[book]) throw Error('wrong-volume');
  if (!puzzle.solution.includes(1) || !puzzle.solution.includes(0) || puzzle.sticker.size !== puzzle.size || !puzzle.sticker.name || !puzzle.sticker.story
    || puzzle.sticker.colors.length !== puzzle.size ** 2 || puzzle.solution.length !== puzzle.size ** 2
    || puzzle.solution.some((ink, i) => ink === 1 ? !/^#[0-9a-f]{6}$/i.test(puzzle.sticker.colors[i] ?? '') : puzzle.sticker.colors[i] !== null)) throw Error('sticker-mask');
  const verified = verifyPuzzle(puzzle, options);
  if (!verified.ok) throw Error(verified.reason);
  const { openings, steps, route } = verified.proof;
  // Same explicit difficulty band for both seeds: easy openings vs longer crossings in later books.
  if (book === 0 ? openings < 2 || route !== 'multiple' : steps.length < (book === 1 ? 5 : 10)) throw Error('wrong-difficulty');
  return { puzzle, proof: verified.proof };
}

// Build-time only. Certify the reserve independently first. A primary that times out, fails
// replay, duplicates another topic or misses its band can never leak into the served edition.
export function publishEdition(options: VerificationOptions = {}, candidates = seeds, generate = generatePuzzle): Published[] {
  if (candidates.length !== 12 || candidates.some((s, i) => s.id !== i + 1 || s.primary === s.fallback)) throw Error('Invalid edition registry');
  const reserves = candidates.map(({ id, fallback }) => {
    try { return certify(id, fallback, { timeoutMs: 10_000, maxNodes: 500_000 }, generate); }
    catch (e) { throw Error(`No certified reserve for page ${id}: ${e instanceof Error ? e.message : e}`); }
  });
  const reserved = new Map<string, number>();
  for (const { puzzle } of reserves) {
    const key = shapeKey(puzzle);
    if (reserved.has(key)) throw Error(`Duplicate reserve for page ${puzzle.id}`);
    reserved.set(key, puzzle.id);
  }
  return candidates.map(({ id, primary }, i) => {
    const fallback = reserves[i];
    try {
      const page = certify(id, primary, options, generate);
      const key = shapeKey(page.puzzle);
      if (reserved.has(key)) throw Error('duplicate-outline');
      reserved.set(key, id);
      return { ...page, source: 'primary', fallback };
    } catch (e) {
      return { ...fallback, source: 'fallback', fallback, reason: e instanceof Error ? e.message : String(e) };
    }
  });
}
