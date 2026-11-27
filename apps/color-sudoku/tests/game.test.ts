import { test } from 'node:test';
import assert from 'node:assert/strict';
import type { Bit, Puzzle, Round, Tool } from '../src/contracts.ts';
import { deriveClues, runs } from '../src/core/clues.ts';
import { play, newGame } from '../src/core/game.ts';
import { blankSave, recordRound, readSave, restoreRound } from '../src/core/save.ts';
import { canOpen, progression, stages } from '../src/core/progression.ts';
import { bag, buy, goods, use, wallet } from '../src/core/shop.ts';
import { generatePuzzle } from '../src/patterns/index.ts';

function page(id = 1): Puzzle {
  const solution: Bit[] = Array.from({ length: 25 }, (_, i) => i % 6 === 0 ? 1 : 0);
  return { ...deriveClues(solution, 5), id, size: 5, seed: 11, book: '谁来过小院', solution,
    sticker: { name: '测试图', story: '仅用于规则回归', size: 5, colors: solution.map(b => b ? '#c08c68' : null) } };
}
const p = page();
function finish(round = newGame(p), seq = [0, 6, 12, 18, 24]): Round {
  for (const at of seq) round = play(p, round, at, 'fill');
  return round;
}

test('clean unknown start, integer runs including empty, separated and ten', () => {
  assert.deepEqual(runs([]), []); assert.deepEqual(runs([1,0,1]), [1,1]); assert.deepEqual(runs(Array(10).fill(1)), [10]);
  assert.deepEqual(p.rowClues[0], [1]);
  assert.ok(newGame(p).cells.every(c => c === 'unknown')); assert.equal(newGame(p).lives, 3);
});
test('a correct fill seals just its completed row and column; sealed marks and invalid inputs are inert', () => {
  const original = newGame(p), one = play(p, original, 0, 'fill');
  assert.equal(one.cells.filter(c => c === 'empty').length, 8); assert.equal(one.cells[6], 'unknown');
  assert.equal(one.cells[0], 'filled'); assert.equal(original.cells[0], 'unknown'); assert.equal(one.lives, 3);
  for (const at of [0, 2, -1, 25, NaN, 3.5]) assert.equal(play(p, one, at, 'fill'), one);
  assert.equal(play(p, one, 7, 'wrong' as Tool), one);
});
test('both kinds of mistake reveal and lock the true state with a precise message; third error on final cell only loses', () => {
  let r = play(p, newGame(p), 1, 'fill');
  assert.equal(r.cells[1], 'miss-empty'); assert.equal(r.lives, 2); assert.match(r.message, /留白.*两次/);
  assert.equal(play(p, r, 1, 'fill'), r);
  r = play(p, r, 6, 'empty'); assert.equal(r.cells[6], 'miss-filled'); assert.equal(r.lives, 1); assert.match(r.message, /涂色.*一次/);
  r = finish(r, [0, 12, 18]); assert.equal(r.cells.filter(v => v === 'unknown').length, 1);
  r = play(p, r, 24, 'empty'); assert.equal(r.cells.includes('unknown'), false); assert.equal(r.status, 'lost');
  assert.equal(r.lives, 0); assert.equal(play(p, r, 24, 'fill'), r);
  assert.equal(wallet(readSave(JSON.stringify({ ...blankSave(), rounds: { 1: { seed: p.seed, moves: r.moves } } }), [p])), 0);
  assert.deepEqual(newGame(p), { ...newGame(p), seed: r.seed, lives: 3, cells: Array(25).fill('unknown') });
});
test('either tool and any safe order count for perfect, manual empties never cost a chance', () => {
  const a = play(p, newGame(p), 1, 'empty'); assert.equal(a.cells[1], 'empty'); assert.equal(a.lives, 3);
  const r = finish(a, [24, 18, 6, 12, 0]); assert.equal(r.status, 'won'); assert.equal(r.lives, 3);
  assert.deepEqual(r.cells, finish().cells);
});
test('a normal win already owns the complete sticker; replay only upgrades the paw, no second reward', () => {
  const save = blankSave(); const r = finish(play(p, newGame(p), 1, 'fill'));
  assert.equal(r.status, 'won'); assert.equal(r.lives, 2); assert.equal(recordRound(save, r).first, true);
  assert.deepEqual(save.wins['1'], { perfect: false }); assert.equal(wallet(save), 100);
  const restored = readSave(JSON.stringify(save), [p]); assert.deepEqual(restoreRound(p, restored.rounds['1']), r);
  assert.equal(recordRound(restored, finish()).first, false); assert.equal(restored.wins['1'].perfect, true);
  recordRound(restored, r); assert.equal(restored.wins['1'].perfect, true); assert.equal(wallet(restored), 100);
});
test('refresh faithfully restores tool, mistakes, auto-seals, chosen page and settings; ignores fabricated balances', () => {
  const q = page(2), r = play(q, newGame(q), 0, 'empty');
  const save = { ...blankSave(), current: 2, tool: 'empty' as const, sound: true, practiceDone: true, coins: 999 };
  recordRound(save, r); const s = readSave(JSON.stringify(save), [p, q]);
  assert.deepEqual(restoreRound(q, s.rounds[2]), r); assert.equal(s.current, 2); assert.equal(s.tool, 'empty'); assert.ok(s.sound && s.practiceDone);
  assert.equal(wallet(s), 0); assert.equal(blankSave().sound, false);
});

test('stage progression counts distinct finishes by size and ends at level six', () => {
  const save = blankSave();
  const legacyPage = generatePuzzle(5, 0);
  assert.equal(canOpen(legacyPage, save, progression(save).size), false);
  for (const [i, stage] of stages.entries()) {
    for (const [j, id] of stage.ids.entries()) {
      assert.deepEqual(progression(save), { level: i + 1, size: stage.size, cleared: j, total: 6, nextSize: stages[i + 1]?.size ?? null });
      save.wins[id] = { perfect: false };
    }
  }
  assert.deepEqual(progression(save), { level: 6, size: 20, cleared: 6, total: 6, nextSize: null });
  assert.equal(wallet(save), 3600);
});

test('legacy saves retain old purchases-free balance, collected stickers and ongoing larger boards', () => {
  const q = generatePuzzle(5, 0);
  const progress = play(q, newGame(q), q.solution.indexOf(1), 'fill');
  const old = { ...blankSave(), version: 1, current: q.id, practiceDone: true, wins: { 1: { perfect: true } },
    rounds: { [q.id]: { seed: q.seed, moves: progress.moves } } };
  const migrated = readSave(JSON.stringify(old), [p, q]);
  assert.equal(migrated.version, 2);
  assert.equal(migrated.current, q.id);
  assert.deepEqual(restoreRound(q, migrated.rounds[q.id]), progress);
  assert.deepEqual(bag(migrated), { chalk: 0, ink: 0, heart: 0 });
  assert.equal(wallet(migrated), 100);
});

test('shop prices, one-use items, assisted wins and reload are consistent', () => {
  const save = blankSave();
  const q = page(2);
  const r = page(3);
  assert.equal(buy(save, 'heart'), false);
  save.wins[2] = { perfect: true };
  save.wins[3] = { perfect: true };
  for (const item of ['chalk', 'ink', 'heart'] as const) assert.equal(buy(save, item), true);
  const expectedCash = 200 - goods.chalk.price - goods.ink.price - goods.heart.price;
  assert.equal(wallet(save), expectedCash);
  let round = newGame(p);
  assert.equal(use(save, p, round, 'heart'), round);
  round = play(p, round, 1, 'fill');
  round = use(save, p, round, 'heart');
  assert.equal(round.lives, 3);
  for (const [item, cell] of [['chalk', 'empty'], ['ink', 'filled']] as const) {
    const before = round;
    round = use(save, p, round, item);
    const move = round.moves.at(-1)!;
    assert.ok('at' in move);
    assert.equal(before.cells[move.at], 'unknown');
    assert.equal(round.cells[move.at], cell);
    assert.equal(use(save, p, round, item), round);
  }
  recordRound(save, round);
  const restored = readSave(JSON.stringify(save), [p, q, r]);
  assert.deepEqual(restoreRound(p, restored.rounds[p.id]), round);
  assert.equal(wallet(restored), expectedCash);
  assert.deepEqual(bag(restored), { chalk: 0, ink: 0, heart: 0 });
  const won = finish(round);
  assert.equal(recordRound(restored, won).first, true);
  assert.equal(restored.wins[p.id].perfect, false);
  assert.equal(recordRound(restored, won).first, false);
  assert.equal(wallet(restored), expectedCash + 100);
});
test('corrupt, oversized, wrong-version or wrong-seed journals cannot apply to a different board', () => {
  assert.deepEqual(readSave('{bad', [p]), blankSave()); assert.deepEqual(readSave('{"version":43}', [p]), blankSave());
  const move = { at: 0, tool: 'fill' };
  for (const data of [{ seed: -1, moves: [move] }, { seed: p.seed, moves: [move, move] }, { seed: p.seed, moves: Array(26).fill(move) }, { seed: p.seed, moves: [null] }]) {
    assert.equal(restoreRound(p, data), null);
    const s = readSave(JSON.stringify({ ...blankSave(), wins: { 1: { perfect: true } }, rounds: { 1: data } }), [p]);
    assert.ok(!s.rounds[1]); assert.equal(s.wins[1].perfect, true);
  }
});
