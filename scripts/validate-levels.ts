import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { levels } from '../src/game/levels';
import { createQuestion, instruments, validateLevel } from '../src/game/questions';
import { semitoneDistance } from '../src/game/intervals';

const partial = process.argv.includes('--partial');
assert.equal(levels.length, partial ? levels.at(-1)!.id : 100);
assert.deepEqual(levels.map((l) => l.id), Array.from({ length: levels.length }, (_, i) => i + 1));
let state = 20261021;
const rng = () => { state = (Math.imul(state, 1664525) + 1013904223) >>> 0; return state / 4294967296; };
let questions = 0; let samplePairs = 0;
const manifest = readFileSync('src/audio/assets.ts', 'utf8');
for (const level of levels) {
  assert.deepEqual(validateLevel(level), [], `Level ${level.id} invalid`);
  const seen = new Set<number>(); const history: number[] = [];
  for (let i = 0; i < 300; i++) {
    const q = createQuestion(level, history, rng);
    assert.equal(q.choices.length, level.choices);
    assert.equal(new Set(q.choices).size, level.choices);
    assert.equal(q.choices.filter((n) => n === q.interval).length, 1);
    assert.equal(semitoneDistance(...q.notes), q.interval);
    seen.add(q.interval); history.push(q.interval); questions++;
  }
  for (let i = 0; i < level.intervals.length; i++) {
    let first = true;
    const q = createQuestion(level, [], () => { if (first) { first = false; return (i + 0.5) / level.intervals.length; } return rng(); });
    assert.equal(q.interval, level.intervals[i], `Unreachable interval in ${level.id}`);
    assert.ok(seen.has(q.interval));
  }
  for (const program of level.instruments) {
    assert.ok(instruments[program]);
    for (const interval of level.intervals) {
      for (let root = level.minMidiNote; root <= level.maxMidiNote; root++) {
        for (const note of [root, root + interval]) {
          const asset = `assets/audio/banks/${String(program).padStart(3, '0')}.m4a`;
          assert.ok(existsSync(resolve(asset)), `Missing ${asset}`);
          assert.ok(manifest.includes(`require('../../${asset}')`), `Unbundled ${asset}`);
          assert.ok(manifest.includes(`    ${note}: `), `Missing note offset ${program}/${note}`);
        }
        samplePairs++;
      }
    }
  }
}
console.log(`Validated ${levels.length} explicit levels, ${questions} seeded questions, ${samplePairs} exhaustive instrument/root/interval combinations.`);
