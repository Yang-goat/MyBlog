import type { Bit, Size, Sticker } from '../contracts.ts';

// Wax pencils. Highlights are cream rather than paper-white so the earned pixels stay visible.
export const ink = {
  cocoa: '#5d463d', toast: '#ad7454', caramel: '#d59966', biscuit: '#e7b780', cream: '#f1d7ab',
  peach: '#e59a76', apricot: '#db805c', blush: '#e8aa97', moss: '#688974', sage: '#95a88b',
  slate: '#827c7b', mist: '#b7aaa0', chestnut: '#925c44', russet: '#c78351', gold: '#e9b659',
  berry: '#be6d66', rose: '#da8880', corn: '#f0cb80', rind: '#756d53', linen: '#e9d7bc',
} as const;

// Decode the seed in the artist's fixed mixed-radix order. Each digit controls a part
// (e.g. head lean, ear reach, tail bend); generating other stickers cannot affect it.
export class Recipe {
  private remaining: number;
  constructor(seed: number) { this.remaining = seed; }
  take(count: number): number {
    const value = this.remaining % count;
    this.remaining = Math.floor(this.remaining / count);
    return value;
  }
}

export interface Caption { name: string; story: string }
export type Artist = (sheet: Sheet, recipe: Recipe) => Caption;

export class Sheet {
  readonly size: Size;
  readonly colors: (string | null)[];
  constructor(size: Size) {
    this.size = size;
    this.colors = Array<string | null>(size * size).fill(null);
  }

  private index(x: number, y: number): number {
    if (!Number.isInteger(x) || !Number.isInteger(y) || x < 0 || y < 0 || x >= this.size || y >= this.size) {
      throw new RangeError(`Part falls outside ${this.size}×${this.size} paper at (${x},${y})`);
    }
    return y * this.size + x;
  }
  dot(x: number, y: number, color: string): void { this.colors[this.index(x, y)] = color; }
  cut(x: number, y: number): void { this.colors[this.index(x, y)] = null; }
  // Details (eyebrow, blush, plaid, nut highlight) never add answer cells.
  tint(x: number, y: number, color: string): void {
    const at = this.index(x, y);
    if (this.colors[at] !== null) this.colors[at] = color;
  }
  span(y: number, left: number, right: number, color: string): void {
    for (let x = left; x <= right; x++) this.dot(x, y, color);
  }
  // Small local masks are individual anatomical or object parts; '.' leaves the underlying part alone.
  part(x: number, y: number, rows: readonly string[], color: string): void {
    rows.forEach((row, dy) => [...row].forEach((pixel, dx) => {
      if (pixel === '#') this.dot(x + dx, y + dy, color);
    }));
  }
  finish(caption: Caption): { solution: Bit[]; sticker: Sticker } {
    const solution = this.colors.map((color): Bit => color === null ? 0 : 1);
    assertStructure(solution, this.size);
    return { solution, sticker: { ...caption, size: this.size, colors: this.colors } };
  }
}

// Check every recipe, including unpublished exploratory seeds. A tip, tail, ear, accessory
// or crumb touching only at a corner would be an isolated island at this scale.
function assertStructure(bits: Bit[], n: Size): void {
  const start = bits.indexOf(1);
  if (start < 0) throw new Error('Blank silhouette');
  const stack = [start];
  const found = new Set(stack);
  while (stack.length) {
    const i = stack.pop()!;
    const x = i % n, y = Math.floor(i / n);
    for (const [nx, ny] of [[x - 1, y], [x + 1, y], [x, y - 1], [x, y + 1]]) {
      if (nx < 0 || ny < 0 || nx >= n || ny >= n) continue;
      const next = ny * n + nx;
      if (bits[next] && !found.has(next)) { found.add(next); stack.push(next); }
    }
  }
  if (found.size !== bits.filter(Boolean).length) throw new Error('Disconnected silhouette');
  if (found.size < n || found.size > n * n * 0.85) throw new Error('Silhouette lacks breathing room');
}

// Compare the cut paper, never the ink or the board size. Padding a 5×5 animal onto
// a 7×7 board, or printing every pixel as a 2×2 square on a 10×10 board, isn't a new pose.
export function silhouetteKey(bits: Bit[], n: Size): string {
  let cells = bits.flatMap((v, i): [number, number][] => v ? [[i % n, Math.floor(i / n)]] : []);
  if (!cells.length) return '';
  const left = Math.min(...cells.map(([x]) => x)), top = Math.min(...cells.map(([, y]) => y));
  cells = cells.map(([x, y]) => [x - left, y - top]);
  const w = Math.max(...cells.map(([x]) => x)) + 1, h = Math.max(...cells.map(([, y]) => y)) + 1;
  for (let scale = Math.min(w, h); scale >= 2; scale--) {
    if (w % scale || h % scale || cells.length % (scale * scale)) continue;
    const stride = w / scale;
    const blocks = new Set(cells.map(([x, y]) => Math.floor(y / scale) * stride + Math.floor(x / scale)));
    if (blocks.size * scale * scale !== cells.length) continue; // at least one block is only partially inked
    cells = [...blocks].map(i => [i % stride, Math.floor(i / stride)]);
    break;
  }
  const keys: string[] = [];
  for (const transpose of [false, true]) for (const sx of [-1, 1]) for (const sy of [-1, 1]) {
    const points = cells.map(([x, y]) => transpose ? [sx * y, sy * x] : [sx * x, sy * y]);
    const minX = Math.min(...points.map(([x]) => x)), minY = Math.min(...points.map(([, y]) => y));
    const width = 1 + Math.max(...points.map(([x]) => x)) - minX;
    keys.push(`${width}:` + points.map(([x, y]) => (y - minY) * width + x - minX).sort((a, b) => a - b).join(','));
  }
  return keys.sort()[0]!;
}
