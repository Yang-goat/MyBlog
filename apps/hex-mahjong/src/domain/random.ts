import type { RandomSource } from "./types";

export const systemRandom: RandomSource = () => Math.random();

/** Mulberry32: deterministic and small enough for repeatable tests/replays. */
export function createSeededRandom(seed: number): RandomSource {
  let value = seed >>> 0;
  return () => {
    value = (value + 0x6d2b79f5) >>> 0;
    let mixed = value;
    mixed = Math.imul(mixed ^ (mixed >>> 15), mixed | 1);
    mixed ^= mixed + Math.imul(mixed ^ (mixed >>> 7), mixed | 61);
    return ((mixed ^ (mixed >>> 14)) >>> 0) / 4_294_967_296;
  };
}

export function shuffled<T>(values: readonly T[], random: RandomSource = systemRandom): T[] {
  const result = [...values];
  for (let index = result.length - 1; index > 0; index -= 1) {
    const randomIndex = Math.floor(normalizeRandom(random()) * (index + 1));
    [result[index], result[randomIndex]] = [result[randomIndex], result[index]];
  }
  return result;
}

function normalizeRandom(value: number): number {
  if (!Number.isFinite(value)) throw new Error("Random source must return a finite number.");
  if (value >= 0 && value < 1) return value;
  return ((value % 1) + 1) % 1;
}
