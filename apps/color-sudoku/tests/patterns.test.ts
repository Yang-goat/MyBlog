import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { generatePuzzle, seeds } from '../src/patterns/index.ts';
import { stages } from '../src/core/progression.ts';
import { Sheet, silhouetteKey } from '../src/patterns/paper.ts';
import type { Bit, Puzzle, Size } from '../src/contracts.ts';

const books = ['谁来过小院', '认识新朋友', '小院的一天'];
// Products of each artist's independent, ordered part choices. Larger seeds repeat a recipe;
// the edition does not claim to have billions of unique pictures or publish unscreened seeds.
const periods = [54, 24, 48, 54, 36, 36, 54, 54, 72, 72, 108, 108];
const pairs = seeds.map(({ id, primary, fallback }) => [generatePuzzle(id, primary), generatePuzzle(id, fallback)] as const);
const rows = (p: Puzzle) => Array.from({ length: p.size }, (_, y) => p.solution.slice(y * p.size, (y + 1) * p.size));
const art = (p: Puzzle) => rows(p).map(line => line.map(v => v ? '#' : '.').join('')).join('\n');
const runs = (bits: readonly Bit[]) => (bits.join('').match(/1+/g) ?? []).map(s => s.length);

function audit(p: Puzzle): void {
  const n = p.size;
  assert.equal(p.sticker.size, n);
  assert.equal(p.solution.length, n * n);
  assert.equal(p.sticker.colors.length, n * n);
  assert.ok(p.solution.every(v => v === 0 || v === 1));
  const pigments = new Set<string>();
  for (let i = 0; i < n * n; i++) {
    const fill = p.sticker.colors[i];
    if (p.solution[i]) { assert.match(fill ?? '', /^#[a-f0-9]{6}$/); pigments.add(fill!); }
    else assert.equal(fill, null, 'No paint on an empty cell');
  }
  assert.ok(pigments.size >= 3, 'Body, detail and accent must survive at native pixel size');
  const grid = rows(p);
  assert.deepEqual(p.rowClues, grid.map(runs));
  assert.deepEqual(p.columnClues, Array.from({ length: n }, (_, x) => runs(grid.map(row => row[x]!))));
  const occupancy = p.solution.filter(Boolean).length;
  assert.ok(occupancy > n && occupancy <= n * n * 0.85);
  // Independent flood fill: don't trust Sheet.finish or the pixel colours for connectivity.
  const start = p.solution.indexOf(1), seen = new Set([start]), todo = [start];
  while (todo.length) {
    const at = todo.pop()!, x = at % n;
    for (const a of [x > 0 ? at - 1 : -1, x + 1 < n ? at + 1 : -1, at - n, at + n]) {
      if (a >= 0 && a < n * n && p.solution[a] && !seen.has(a)) { seen.add(a); todo.push(a); }
    }
  }
  assert.equal(seen.size, occupancy, `Floating part in ${p.id}:${p.seed}\n${art(p)}`);
}

test('distinct titles, stories and native-size pairs across the six books', () => {
  assert.deepEqual(seeds.map(s => s.id), Array.from({ length: 36 }, (_, i) => i + 1));
  assert.equal(new Set(pairs.map(([p]) => p.sticker.name)).size, 36);
  assert.equal(new Set(pairs.map(([p]) => p.sticker.story)).size, 36);
  for (const [p, q] of pairs) {
    const stage = stages.find(stage => (stage.ids as readonly number[]).includes(p.id))!;
    assert.equal(p.book, stage.book); assert.equal(p.size, stage.size);
    assert.equal(q.book, p.book); assert.equal(q.size, p.size);
    assert.equal(q.sticker.name, p.sticker.name); assert.equal(q.sticker.story, p.sticker.story);
    assert.match(p.sticker.story, /[。！？]$/u);
    assert.ok(p.sticker.story.length >= 12); assert.notEqual(q.seed, p.seed);
    audit(p); audit(q);
  }
});

test('regenerates the same collectible after other calls; exported puzzle arrays do not alias', () => {
  const before = generatePuzzle(1, 0);
  const another = generatePuzzle(1, 0);
  another.solution.fill(0); another.sticker.colors.fill(null); another.rowClues[0]!.push(99);
  for (const { id, fallback } of seeds.slice().reverse()) generatePuzzle(id, fallback);
  assert.deepEqual(generatePuzzle(1, 0), before);
  for (const [p, q] of pairs) for (const ticket of [p, q]) assert.deepEqual(generatePuzzle(ticket.id, ticket.seed), ticket);
  for (const id of [-1, 0, 37, 3.1, NaN]) assert.throws(() => generatePuzzle(id, 0), RangeError);
  for (const seed of [-1, 3.1, Infinity, NaN, 2 ** 32]) assert.throws(() => generatePuzzle(3, seed), RangeError);
  audit(generatePuzzle(12, 0xffffffff));
});

test('all 720 finite part recipes attach, stay inside the paper, and produce genuine shape diversity', () => {
  let total = 0, distinct = 0;
  for (const [i, period] of periods.entries()) {
    const keys = new Set<string>();
    for (let seed = 0; seed < period; seed++) {
      const p = generatePuzzle(i + 1, seed);
      audit(p); keys.add(silhouetteKey(p.solution, p.size));
    }
    assert.ok(keys.size >= period / 2, `Too many colour / mirror repeats in theme ${i + 1}: ${keys.size}/${period}`);
    total += period; distinct += keys.size;
  }
  assert.equal(total, 720);
  assert.ok(distinct >= total * 0.90, `Too many duplicate candidates (${distinct}/${total} distinct)`);
});

function mask(n: Size, cells: readonly [number, number][]): Bit[] {
  const answer = Array<Bit>(n * n).fill(0);
  for (const [x, y] of cells) answer[y * n + x] = 1;
  return answer;
}

test('shape fingerprints ignore translations, both reflections and quarter turns, not just colour', () => {
  const cells: [number, number][] = [[0, 0], [0, 1], [0, 2], [1, 2], [2, 2], [1, 1]];
  const key = silhouetteKey(mask(5, cells), 5);
  for (const transformed of [
    cells.map(([x, y]): [number, number] => [x + 1, y + 2]),
    cells.map(([x, y]): [number, number] => [4 - x, y]),
    cells.map(([x, y]): [number, number] => [4 - y, x]),
    cells.map(([x, y]): [number, number] => [y + 1, x]),
  ]) assert.equal(silhouetteKey(mask(5, transformed), 5), key);
  assert.equal(silhouetteKey(mask(7, cells.map(([x, y]) => [x + 2, y + 3])), 7), key);
  const enlarged = cells.flatMap(([x, y]): [number, number][] => [[x * 2, y * 2], [x * 2 + 1, y * 2], [x * 2, y * 2 + 1], [x * 2 + 1, y * 2 + 1]]);
  assert.equal(silhouetteKey(mask(10, enlarged), 10), key);
  assert.notEqual(silhouetteKey(mask(5, [[0, 0], [1, 0], [2, 0], [3, 0], [4, 0], [0, 1]]), 5), key);
  assert.equal(new Set(pairs.flatMap(pair => pair.map(p => silhouetteKey(p.solution, p.size)))).size, 72);
});

// Compare after BEST alignment, not just at fixed coordinates. An off-centre duplicate must
// not get credit for all the bits that changed when its nose shifted one square to the right.
function nearestDifference(p: Puzzle, q: Puzzle): number {
  const points = (t: Puzzle) => t.solution.flatMap((v, i): [number, number][] => v ? [[i % t.size, Math.floor(i / t.size)]] : []);
  const a = points(p), b = points(q);
  let overlap = 0;
  for (const turn of [false, true]) for (const sx of [-1, 1]) for (const sy of [-1, 1]) {
    const shifts = new Map<string, number>();
    for (const [x, y] of a) for (const [u, v] of b) {
      const shift = `${x - sx * (turn ? v : u)},${y - sy * (turn ? u : v)}`;
      const hits = (shifts.get(shift) ?? 0) + 1;
      overlap = Math.max(overlap, hits); shifts.set(shift, hits);
    }
  }
  return a.length + b.length - 2 * overlap;
}

test('the backup costs real silhouette cells even after translation, mirrors and rotation', () => {
  for (const [p, q] of pairs) {
    const budget = p.size === 5 ? 5 : p.size === 7 ? 6 : 10;
    assert.ok(nearestDifference(p, q) >= budget, `Merely retouched ${p.id} backup\n${art(p)}\n\n${art(q)}`);
  }
});

test('original black-and-white shapes preserve their reviewed landmarks', () => {
  for (const pair of pairs.slice(0, 12)) for (const p of pair) {
    const n = p.size, grid = rows(p);
    const at = (x: number, y: number) => p.solution[y * n + x];
    const must = (value: Bit, ...xy: [number, number][]) => {
      for (const [x, y] of xy) assert.equal(at(x, y), value, `Landmark ${p.id}:${p.seed} at ${x},${y}\n${art(p)}`);
    };
    const width = (y: number) => grid[y]!.filter(Boolean).length;
    switch (p.id) {
      case 1: // Fish's split tail with a one-pixel joint, not a biscuit with a painted fish on it.
        must(1, [4, 1], [4, 2], [4, 3], [3, 2], [0, 2]); must(0, [3, 1], [3, 3]); break;
      case 2: // Leaf tips split above joined shoulders; the root tapers to one cell.
        assert.ok(runs(grid[0]!).length >= 2); assert.ok(width(2) >= 3); assert.equal(width(4), 1); break;
      case 3: must(1, [1, 0], [3, 0], [2, 2]); must(0, [2, 0]); assert.equal(width(4), 1); break;
      case 4: assert.equal(width(2), 5); assert.ok(width(3) <= 2 && width(4) <= 2); break;
      case 5: // The drooping ear arcs over an air slit; the other ear rises above the head.
        must(1, [2, 2], [4, 2], [5, 3], [4, 4], [6, 4]); must(0, [3, 2], [5, 4]); assert.ok(width(0) > 0); break;
      case 6: // Both ear tips and their notch, with whiskers extending beyond the chin.
        assert.ok(grid[1]!.slice(0, 3).some(Boolean) && grid[1]!.slice(4).some(Boolean));
        must(0, [3, 1]); assert.ok(width(4) > width(6)); break;
      case 7: // Blunt split ears, cheek pouches wider than the skull and two proper little feet.
        must(1, [2, 0], [4, 0], [0, 4], [6, 4], [2, 6], [4, 6]); must(0, [3, 0]); assert.ok(width(4) > width(1)); break;
      case 8: // Forward bill, notch below the chin, belly and upturned back feather.
        assert.ok(at(6, 1) || at(6, 2)); must(1, [0, 3], [4, 3], [0, 4]); must(0, [2, 3], [6, 3]); break;
      case 9: // Ears by the lowered head, arched back, a tail folding underneath and then inward.
        assert.ok([1, 2].some(y => (at(1, y) || at(2, y)) && at(4, y) && !at(3, y)));
        must(1, [3, 7], [8, 6], [8, 7], [4, 9], [5, 9], [6, 9]); must(0, [5, 6], [5, 7], [4, 8], [5, 8]); break;
      case 10: { // Air between tail plume and face, and a forepaw meeting an acorn with a single tapered tip.
        must(1, [0, 4], [4, 2], [7, 3], [9, 3]); must(0, [5, 3], [2, 4]);
        const cap = at(9, 6) ? 6 : 7;
        must(1, [8, cap - 1], [6, cap], [7, cap], [9, cap], [8, cap + 2]);
        must(0, [7, cap + 2], [9, cap + 2]); break;
      }
      case 11: // Two swept feathers, open beak, two feet: the crow is read from the pose.
        must(1, [0, 4], [9, 2], [9, 4], [4, 8], [6, 8]); must(0, [9, 3], [0, 3], [5, 8]); break;
      case 12: // Short horns, beard, ear, forward scarf point and staggered legs must not fuse.
        must(1, [5, 0], [7, 2], [0, 4], [1, 5], [3, 6], [3, 7], [5, 7], [8, 8]);
        must(0, [4, 0], [5, 3], [2, 5], [4, 7]); break;
      default: assert.fail(`Unreviewed illustration ${p.id}`);
    }
  }
});

test('the contact sheet reviewed by the artists exactly matches every published black-and-white mask', () => {
  const sheet = readFileSync(new URL('../src/patterns/README.md', import.meta.url), 'utf8').replaceAll('\r', '');
  const printed: string[] = [];
  for (const block of sheet.matchAll(/```text\n([\s\S]*?)```/g)) {
    for (const panel of block[1]!.trim().split(/\n\s*\n/)) {
      const [header, ...lines] = panel.split('\n');
      const labels = header!.trim().split(/\s+/);
      for (const [i, label] of labels.entries()) {
        const [id, seed] = label.split(':').map(Number);
        assert.equal(lines.map(line => line.trim().split(/\s+/)[i]).join('\n'), art(generatePuzzle(id!, seed!)), label);
        printed.push(label);
      }
    }
  }
  assert.deepEqual(printed, pairs.flatMap(pair => pair.map(p => `${p.id}:${p.seed}`)));
});

test('a floating pixel or off-paper part fails the artist guard before any clues can be printed', () => {
  const s = new Sheet(5);
  s.span(0, 0, 4, '#000000'); s.dot(4, 4, '#000000');
  assert.throws(() => s.finish({ name: 'fixture', story: 'fixture' }), /Disconnected/);
  assert.throws(() => s.dot(5, 0, '#000000'), RangeError);
});
