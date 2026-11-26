import assert from 'node:assert/strict';
import { test } from 'node:test';
import type { Bit, Clues, Proof, Puzzle, Size, Verification } from '../src/contracts.ts';
import { deriveClues, runs } from '../src/core/clues.ts';
import { newGame, play } from '../src/core/game.ts';
import { generatePuzzle } from '../src/patterns/index.ts';
import { analyzeClues, replayProof, verifyPuzzle } from '../src/solver/index.ts';

function picture(rows: string[]): Puzzle {
  const solution: Bit[] = rows.flatMap(row => Array.from(row, c => c === '#' ? 1 : 0));
  const size = rows.length as Size;
  return { ...deriveClues(solution, size), size, solution, id: 1, seed: 23, book: '测试',
    sticker: { name: '测试贴纸', story: '', size, colors: solution.map(v => v ? '#768460' : null) } };
}
function accept(result: Verification): Proof {
  if (!result.ok) assert.fail(`expected a certificate; rejected: ${result.reason}`);
  return result.proof;
}
const dot = () => picture(['.....', '.....', '..#..', '.....', '.....']);
const block = () => picture(['.....', '.##..', '.##..', '.....', '.....']);
const mustGuess = () => picture(['.##..', '..##.', '..##.', '...#.', '.#..#']);
const ambiguous = () => picture(['#....', '.#...', '.....', '.....', '.....']);
const rejected = (reason: string): Verification => ({ ok: false, reason });

// Tiny, deliberately slow oracle: enumerate whole pictures, independent of all solver internals.
function enumeratePictures({ size, rowClues, columnClues }: Clues): number {
  const words = Array.from({ length: 1 << size }, (_, mask) => Array.from({ length: size }, (_, i): Bit => (mask >> i) & 1 ? 1 : 0));
  const rows = rowClues.map(clue => words.filter(word => runs(word).join(',') === clue.join(',')));
  let matches = 0;
  function tryRow(solution: Bit[], r: number): void {
    if (r === size) {
      if (JSON.stringify(deriveClues(solution, size).columnClues) === JSON.stringify(columnClues)) matches++;
      return;
    }
    for (const word of rows[r]) tryRow([...solution, ...word], r + 1);
  }
  tryRow([], 0);
  return matches;
}

test('独立反例：无解、多解、图案唯一却需要猜，均不能出版', () => {
  const noSolution = { ...dot(), rowClues: [[], [], [], [], []] };
  for (const [p, count, reason] of [[noSolution, 0, 'no-solution'], [ambiguous(), 2, 'multiple-solutions'],
    [mustGuess(), 1, 'requires-guess']] as const) {
    assert.equal(enumeratePictures(p), count);
    assert.deepEqual(verifyPuzzle(p), rejected(reason));
  }
});

test('拒绝无效段长、分隔挤不下、缺行；空线必须是 []', () => {
  for (const bad of [[0], [-1], [NaN], [1.5], [2, 3], [1, 1, 1, 1]]) {
    assert.deepEqual(analyzeClues({ ...dot(), rowClues: [bad, [], [], [], []] }), rejected('invalid-clues'));
  }
  assert.deepEqual(analyzeClues({ ...dot(), columnClues: [[]] }), rejected('invalid-clues'));
});

test('只传线索白名单：两个搜索都不能读取隐藏答案或贴纸', () => {
  for (const p of [dot(), ambiguous(), mustGuess()]) {
    const expected = analyzeClues(p);
    Object.defineProperties(p, {
      solution: { get() { assert.fail('search peeked at solution'); } },
      sticker: { get() { assert.fail('search peeked at sticker'); } },
    });
    assert.deepEqual(analyzeClues(p), expected);
    if (!expected.ok) assert.deepEqual(verifyPuzzle(p), expected); // no replay on a rejected clue sheet
  }
});

test('空行/空列有多种依据，但加自动封格后得到同一下一盘面，只算一条完整链', () => {
  const p = dot();
  const proof = accept(verifyPuzzle(p));
  assert.equal(proof.route, 'single');
  assert.equal(proof.openings, 1);
  assert.equal(proof.steps.length, 2);
  const first = proof.steps[0];
  assert.deepEqual(first.clue, []);
  assert.equal(first.possibilities, 1);
  assert.equal(first.forced.length, 5);
  assert.equal(first.sealed.length, 19);
  assert.deepEqual(proof.steps[1].forced, [{ at: 12, value: 1 }]);
  // A different row/column representative and a different click order prove the same transition.
  const alternate = structuredClone(proof);
  const col = [0, 5, 10, 15, 20];
  alternate.steps[0] = { axis: 'column', line: 0, clue: [], possibilities: 1,
    forced: col.slice().reverse().map(at => ({ at, value: 0 })), sealed: Array.from({ length: 25 }, (_, i) => i).filter(i => i !== 12 && !col.includes(i)).reverse() };
  alternate.steps[1].axis = 'column';
  assert.equal(replayProof(p, alternate), true);
});

test('只有一个开局，此后才分岔：单一示范或首步计数都不能证明单路线', () => {
  const p = block();
  const proof = accept(verifyPuzzle(p));
  assert.equal(proof.openings, 1);
  assert.equal(proof.route, 'multiple');
  assert.equal(proof.steps.length, 3);
  const alternate = structuredClone(proof);
  [alternate.steps[1], alternate.steps[2]] = [alternate.steps[2], alternate.steps[1]];
  assert.equal(replayProof(p, alternate), true); // really two complete chains through different boards
});

test('无猜证明携带整批强制格；先封住本批稍后要点的空格仍是无伤动作', () => {
  const p = picture(['#.#.#', '.....', '.....', '.....', '.....']);
  const proof = accept(verifyPuzzle(p));
  const first = proof.steps[0];
  assert.deepEqual(first.clue, [1, 1, 1]);
  assert.deepEqual(first.forced, [1, 0, 1, 0, 1].map((value, at) => ({ at, value })));
  assert.equal(first.sealed.length, 20);
  assert.equal(replayProof(p, proof), true);
  const reordered = structuredClone(proof);
  reordered.steps[0].forced.reverse();
  assert.equal(replayProof(p, reordered), true);
});

test('10 格整段是 [10]，不是 [1, 1]；保留整数数组与全部十个强制格', () => {
  const p = picture(['##########', '..........', '.#......#.', ...Array<string>(7).fill('..........')]);
  assert.deepEqual(p.rowClues[0], [10]);
  assert.deepEqual(p.rowClues[2], [1, 1]);
  assert.deepEqual(p.columnClues[1], [1, 1]);
  const proof = accept(verifyPuzzle(p));
  assert.deepEqual(proof.steps[0].clue, [10]);
  assert.equal(proof.steps[0].possibilities, 1);
  assert.deepEqual(proof.steps[0].forced, Array.from({ length: 10 }, (_, at) => ({ at, value: 1 })));
  assert.equal(replayProof(p, proof), true);
});

test('到时或节点用尽则失败，找到一个完整反例之前不能把第一条链当作唯一', () => {
  const p = block();
  assert.deepEqual(verifyPuzzle(p, { timeoutMs: 0 }), rejected('timeout'));
  assert.deepEqual(verifyPuzzle(p, { maxNodes: 0 }), rejected('node-limit'));
  // 6 exact-search states + root, first batch, next batch and terminal = 10; a second suffix is pending.
  assert.deepEqual(verifyPuzzle(p, { maxNodes: 10 }), rejected('node-limit'));
  assert.equal(accept(verifyPuzzle(p, { maxNodes: 11 })).route, 'multiple');
});

test('已找到完整路线，若正式重放期间超时仍不得认证', t => {
  let time = 0;
  t.mock.method(performance, 'now', () => time);
  const p = dot(), answer = p.solution;
  Object.defineProperty(p, 'solution', { get() { time = 51; return answer; } });
  assert.deepEqual(verifyPuzzle(p, { timeoutMs: 50 }), rejected('timeout'));
});

test('重放重新核对行列、段、可行放置数、整批、封格、分类和终局，拒绝伪造', () => {
  const p = dot(), proof = accept(verifyPuzzle(p));
  const forgeries: ((q: Proof) => void)[] = [
    q => { q.route = 'multiple'; }, q => { q.openings++; }, q => { q.steps.pop(); },
    q => { q.steps.push(q.steps[0]); }, q => { q.steps[0].axis = 'column'; }, q => { q.steps[0].line = -1; },
    q => { q.steps[0].clue = [1]; }, q => { q.steps[0].possibilities++; },
    q => { q.steps[0].forced.pop(); }, q => { q.steps[0].forced[0].value = 1; },
    q => { q.steps[0].forced[1] = q.steps[0].forced[0]; }, q => { q.steps[0].sealed.pop(); },
    q => { q.steps[0].sealed[0] = q.steps[0].sealed[1]; }, q => { q.steps[0].sealed.push(q.steps[0].forced[0].at); },
    q => { q.steps[1].possibilities = 5; }, // true on the blank board, false on the current board
  ];
  for (const change of forgeries) {
    const fake = structuredClone(proof);
    change(fake);
    assert.equal(replayProof(p, fake), false, change.toString());
  }
});

test('对局会因点错扣机会；自动封住的格从未试点，也必须与最终底图逐格对照', () => {
  const proof = accept(analyzeClues(dot()));
  for (const at of [12, 24]) {
    const p = dot();
    p.solution[at] = p.solution[at] === 1 ? 0 : 1;
    assert.deepEqual(analyzeClues(p), { ok: true, proof });
    assert.deepEqual(verifyPuzzle(p), rejected('replay-failed'));
    assert.equal(replayProof(p, proof), false);
  }
});

test('三次错把整盘真值露出也仍失败，不能拿无未知格冒充无伤证据', () => {
  const p = picture(['###..', '.....', '.....', '.....', '.....']);
  let round = newGame(p);
  for (const at of [0, 1, 2]) round = play(p, round, at, 'empty');
  assert.equal(round.cells.includes('unknown'), false);
  assert.equal(round.lives, 0);
  assert.equal(round.status, 'lost');
  const fake = accept(verifyPuzzle(p));
  fake.steps[0].forced = [0, 1, 2].map(at => ({ at, value: 0 }));
  assert.equal(replayProof(p, fake), false);
});

test('正式种子 1:0：真实首关有多个可完结开局，用再次生成的题面无伤重放', () => {
  const p = generatePuzzle(1, 0);
  const proof = accept(verifyPuzzle(p));
  assert.equal(proof.route, 'multiple');
  assert.ok(proof.openings >= 2);
  assert.ok(proof.steps.some(step => step.possibilities > 1 && step.forced.length > 0));
  assert.equal(replayProof(generatePuzzle(1, 0), proof), true);
});

test('穷举全部 3×3 底图，交叉核对是否多解，不依赖测试底图作推理', () => {
  const byClue = new Map<string, { clues: Clues; count: number }>();
  for (let mask = 0; mask < 512; mask++) {
    const bits = Array.from({ length: 9 }, (_, i): Bit => (mask >> i) & 1 ? 1 : 0);
    const clues = deriveClues(bits, 3), key = JSON.stringify(clues);
    const old = byClue.get(key);
    if (old) old.count++;
    else byClue.set(key, { clues, count: 1 });
  }
  for (const { clues, count } of byClue.values()) {
    const result = analyzeClues(clues);
    if (count > 1) assert.deepEqual(result, rejected('multiple-solutions'));
    else assert.ok(result.ok || result.reason === 'requires-guess');
  }
});
