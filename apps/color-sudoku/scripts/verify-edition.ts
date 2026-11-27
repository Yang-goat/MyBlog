import assert from 'node:assert/strict';
import { readFileSync, writeFileSync } from 'node:fs';
import { publishEdition } from './edition.ts';
import { replayProof } from '../src/solver/index.ts';
import type { Proof } from '../src/contracts.ts';

const pages = publishEdition();
const file = new URL('../evidence/edition-proofs.json', import.meta.url);
const record = pages.map(({ puzzle: p, proof, source, fallback }) => ({ id: p.id, size: p.size, seed: p.seed, source,
  rowClues: p.rowClues, columnClues: p.columnClues, proof, reserve: { seed: fallback.puzzle.seed, proof: fallback.proof } }));
// Only an explicit maintainer action replaces reviewable witnesses; normal checks are read-only.
if (process.argv.includes('--record')) {
  // Keep one inference per line: diffs can be reviewed without thousands of lines of individual coordinates.
  const prettyProof = (p: Proof) => `{ "route": ${JSON.stringify(p.route)}, "openings": ${p.openings}, "steps": [\n      ${p.steps.map(step => JSON.stringify(step)).join(',\n      ')}\n    ] }`;
  const pages = record.map(({ proof, reserve, ...header }) => `  ${JSON.stringify(header).slice(0,-1)},\n    "proof": ${prettyProof(proof)},\n    "reserve": { "seed": ${reserve.seed}, "proof": ${prettyProof(reserve.proof)} }\n  }`);
  writeFileSync(file, '[\n' + pages.join(',\n') + '\n]\n');
}
const saved = JSON.parse(readFileSync(file, 'utf8')) as typeof record;
assert.equal(saved.length, pages.length);
for (const [i, { puzzle: p, proof, source, fallback }] of pages.entries()) {
  const s = saved[i];
  assert.equal(s.id, p.id); assert.equal(s.size, p.size); assert.equal(s.reserve.seed, fallback.puzzle.seed);
  assert.ok(replayProof(fallback.puzzle, s.reserve.proof), `Reserve ${p.id} no longer replays`);
  const archived: Proof = source === 'fallback' ? s.reserve.proof : s.proof;
  if (source === 'primary') { assert.equal(s.seed, p.seed); assert.deepEqual(s.rowClues, p.rowClues); assert.deepEqual(s.columnClues, p.columnClues); }
  assert.ok(replayProof(p, archived), `Page ${p.id} no longer replays`);
  console.log(`${String(p.id).padStart(2, '0')}  ${p.size}×${p.size}  ${p.sticker.name}  seed=${p.seed} (${source})  unique / ${proof.route} / ${proof.openings} openings / ${proof.steps.length} steps / won 3:3`);
}
console.log(`${pages.length} published + ${pages.length} reserve witnesses verified with official moves.`);
