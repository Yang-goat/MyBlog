import { test } from 'node:test';
import assert from 'node:assert/strict';
import { publishEdition, shapeKey } from '../scripts/edition.ts';
import { generatePuzzle, seeds } from '../src/patterns/index.ts';
import { replayProof } from '../src/solver/index.ts';
import { newGame, play } from '../src/core/game.ts';

const edition = publishEdition();
test('first edition: 12 distinct silhouettes, no reflected copies and a distinct same-band reserve per page', () => {
  assert.equal(edition.length, 12);
  const outlines = new Set<string>();
  for (const [i, e] of edition.entries()) {
    const { puzzle, proof, fallback } = e;
    assert.equal(puzzle.id, i + 1); assert.equal(puzzle.size, [5,7,10][Math.floor(i / 4)]);
    assert.equal(puzzle.book, fallback.puzzle.book); assert.equal(puzzle.size, fallback.puzzle.size);
    assert.equal(e.source, 'primary', `Review page ${puzzle.id}: primary used its backup (${e.reason})`);
    assert.notEqual(shapeKey(puzzle), shapeKey(fallback.puzzle));
    if (puzzle.size === 5) assert.ok(proof.openings >= 2 && fallback.proof.openings >= 2);
    else for (const candidate of [proof, fallback.proof]) assert.ok(candidate.steps.length >= (puzzle.size === 7 ? 5 : 10));
    assert.ok(!outlines.has(shapeKey(puzzle))); outlines.add(shapeKey(puzzle));
  }
});
test('every published proof and every reserve reproduce a won game, all cells determined with all three chances intact', () => {
  for (const e of edition) for (const { puzzle: p, proof } of [e, e.fallback]) {
    assert.ok(replayProof(p, proof), `Rejected witness: ${p.id}/${p.seed}`);
    let round = newGame(p);
    for (const step of proof.steps) for (const { at, value } of step.forced) {
      if (round.cells[at] === 'unknown') round = play(p, round, at, value ? 'fill' : 'empty');
      assert.equal(round.lives, 3);
    }
    assert.equal(round.status, 'won'); assert.deepEqual(round.cells.map(c => +(c === 'filled')), p.solution);
    assert.ok(!round.cells.includes('unknown'));
    assert.deepEqual(generatePuzzle(p.id, p.seed), p);
  }
});
test('an expired candidate budget switches to pre-certified reserves; no partial proof or new difficulty is published', () => {
  const timedOut = publishEdition({ timeoutMs: 0 });
  for (const [i, page] of timedOut.entries()) {
    assert.equal(page.source, 'fallback'); assert.equal(page.reason, 'timeout'); assert.deepEqual(page.puzzle, edition[i].fallback.puzzle);
    assert.equal(page.puzzle.size, edition[i].puzzle.size); assert.ok(replayProof(page.puzzle, page.proof));
  }
});
test('an invalid candidate does not poison its reserve or adjacent pages; a missing registry fails closed', () => {
  const inspect = (badSeed: number) => (id: number, seed: number) => {
    const p = generatePuzzle(id, seed);
    if (id === 1 && seed === badSeed) { p.rowClues = Array.from({ length: 5 }, () => [1]); p.columnClues = Array.from({ length: 5 }, () => [1]); }
    return p;
  };
  const rejected = publishEdition({}, seeds, inspect(seeds[0].primary));
  assert.deepEqual(rejected[0].puzzle, edition[0].fallback.puzzle); assert.equal(rejected[0].reason, 'multiple-solutions');
  assert.deepEqual(rejected[1].puzzle, edition[1].puzzle);
  assert.throws(() => publishEdition({}, seeds, inspect(seeds[0].fallback)), /No certified reserve/);
  const registry = seeds.map((s, i) => i === 0 ? { ...s, primary: s.fallback } : { ...s });
  assert.throws(() => publishEdition({}, registry), /registry/);
  assert.throws(() => publishEdition({}, seeds.slice(1)), /registry/);
});
