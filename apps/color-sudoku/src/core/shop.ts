import type { Item, Puzzle, Round, SaveData } from '../contracts.ts';
import { heal, play } from './game.ts';

export const goods = {
  chalk: { name: '留白贴', price: 25, icon: 'cross', detail: '随机标空一个尚未确定的空格。' },
  ink: { name: '彩墨滴', price: 55, icon: 'crayon', detail: '随机涂对一个尚未确定的色格。' },
  heart: { name: '软心糖', price: 80, icon: 'heart', detail: '恢复一次机会，最多三次。' },
} as const;

export const items: Item[] = ['chalk', 'ink', 'heart'];
export const emptyBag = (): Record<Item, number> => ({ chalk: 0, ink: 0, heart: 0 });
export const firstWinCoins = 100;

export function wallet(save: SaveData): number {
  return Object.keys(save.wins).length * firstWinCoins
    - items.reduce((cost, item) => cost + save.bought[item] * goods[item].price, 0);
}

export function bag(save: SaveData): Record<Item, number> {
  return { chalk: save.bought.chalk - save.spent.chalk, ink: save.bought.ink - save.spent.ink, heart: save.bought.heart - save.spent.heart };
}

export function buy(save: SaveData, item: Item): boolean {
  if (wallet(save) < goods[item].price) return false;
  save.bought[item]++;
  return true;
}

function targets(puzzle: Puzzle, round: Round, item: 'chalk' | 'ink'): number[] {
  const color = item === 'ink' ? 1 : 0;
  const cells: number[] = [];
  for (let at = 0; at < round.cells.length; at++) {
    if (round.cells[at] === 'unknown' && puzzle.solution[at] === color) cells.push(at);
  }
  return cells;
}

export function canUse(puzzle: Puzzle, round: Round, item: Item): boolean {
  return round.status === 'playing' && (item === 'heart' ? round.lives < 3 : targets(puzzle, round, item).length > 0);
}

export function use(save: SaveData, puzzle: Puzzle, round: Round, item: Item): Round {
  if (save.spent[item] >= save.bought[item] || !canUse(puzzle, round, item)) return round;
  let next: Round;
  if (item === 'heart') next = heal(round);
  else {
    const candidates = targets(puzzle, round, item);
    const at = candidates[Math.floor(Math.random() * candidates.length)];
    next = play(puzzle, round, at, item === 'ink' ? 'fill' : 'empty', item);
  }
  if (next !== round) save.spent[item]++;
  return next;
}
