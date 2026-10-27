import { test } from 'node:test';
import assert from 'node:assert/strict';
import { midiFrequency, semitoneDistance } from '../src/game/intervals';
import { createQuestion, notesFor, submitAnswer, validateLevel } from '../src/game/questions';
import { deriveProgress, parseProgress, ProgressStore, recordResult, starsFor, totalStars, type Best } from '../src/game/progress';
import type { LevelConfig } from '../src/game/types';

const level: LevelConfig = { id: 1, title: 'Test', instruments: [0, 24], intervals: [0, 2, 4, 5, 7, 12], choices: 4,
  playback: 'mixed', speed: 'normal', minMidiNote: 60, maxMidiNote: 72, noteDurationMs: 700,
  questionCount: 10, difficulty: 'steady', challenge: 'Test fixture' };
export function seeded(seed = 42) {
  let state = seed;
  return () => { state = (Math.imul(state, 1664525) + 1013904223) >>> 0; return state / 4294967296; };
}
test('MIDI distances and concert pitch are exact', () => {
  assert.equal(semitoneDistance(60, 64), 4); assert.equal(semitoneDistance(72, 60), 12);
  assert.equal(midiFrequency(69), 440); assert.equal(midiFrequency(81), 880);
  assert.deepEqual(notesFor(60, 7, 'descending'), [67, 60]);
});
test('random questions cover all modes, roots, instruments, intervals and positions', () => {
  const rng = seeded(); const seen = new Set<number>(); const modes = new Set<string>();
  const roots = new Set<number>(); const positions = new Set<number>(); const programs = new Set<number>();
  const history: number[] = [];
  for (let i = 0; i < 1000; i++) {
    const q = createQuestion(level, history, rng);
    assert.equal(q.choices.length, 4); assert.equal(new Set(q.choices).size, 4);
    assert.equal(q.choices.filter((n) => n === q.interval).length, 1);
    assert.equal(semitoneDistance(...q.notes), q.interval);
    assert.ok(q.root >= 60 && q.root <= 72);
    assert.ok(q.choices.every((n) => level.intervals.includes(n)));
    assert.deepEqual(q.choices, [...q.choices].sort((a, b) => a - b));
    if (history.length) assert.notEqual(q.interval, history.at(-1));
    if (q.playback === 'descending') assert.ok(q.notes[0] >= q.notes[1]);
    else assert.ok(q.notes[0] <= q.notes[1]);
    seen.add(q.interval); modes.add(q.playback); roots.add(q.root); programs.add(q.program);
    positions.add(q.choices.indexOf(q.interval)); history.push(q.interval);
  }
  assert.equal(seen.size, 6); assert.equal(modes.size, 3); assert.equal(roots.size, 13);
  assert.equal(programs.size, 2); assert.equal(positions.size, 4);
});
test('all answer counts are unique; invalid ranges and pools fail', () => {
  for (const choices of [2, 4, 6] as const) assert.equal(createQuestion({ ...level, choices }).choices.length, choices);
  assert.ok(validateLevel({ ...level, choices: 6, intervals: [0, 12] }).length);
  assert.ok(validateLevel({ ...level, maxMidiNote: 100 }).length);
  assert.throws(() => createQuestion({ ...level, instruments: [999] }));
});
test('two-choice lessons avoid long runs without forcing predictable alternation', () => {
  const rng = seeded(); const history: number[] = []; let repeats = 0;
  for (let i = 0; i < 100; i++) {
    const q = createQuestion({ ...level, intervals: [0, 12], choices: 2 }, history, rng);
    if (q.interval === history.at(-1)) repeats++;
    if (history.length >= 2 && history.at(-1) === history.at(-2)) assert.notEqual(q.interval, history.at(-1));
    history.push(q.interval);
  }
  assert.ok(repeats > 0);
});
test('answer locks after one submission; replay leaves question untouched', () => {
  const question = createQuestion(level, [], seeded());
  const initial = { question, selected: null };
  const answered = submitAnswer(initial, question.interval);
  assert.equal(submitAnswer(answered, question.choices.find((n) => n !== question.interval)!), answered);
  assert.equal(submitAnswer(initial, 100), initial);
  assert.equal(answered.question, question);
});
test('star thresholds and best results never regress', () => {
  assert.deepEqual([0, 4, 5, 6, 7, 8, 9, 10].map((n) => starsFor(n)), [0, 0, 1, 1, 1, 2, 2, 3]);
  assert.equal(starsFor(7, [3, 5, 7]), 3);
  const best = recordResult(deriveProgress({}), 1, 10);
  assert.deepEqual(recordResult(best, 1, 6).best[1], { score: 10, stars: 3 });
});
test('levels remain sequential inside packs unlocked by total stars', () => {
  let progress = deriveProgress({});
  assert.deepEqual(progress.unlockedLevels, [1]);
  assert.ok(!recordResult(progress, 1, 4).unlockedLevels.includes(2));
  assert.ok(recordResult(progress, 1, 5).unlockedLevels.includes(2));
  for (let id = 1; id <= 10; id++) progress = recordResult(progress, id, 10);
  assert.equal(progress.chapters[1].unlocked, true);
  assert.ok(progress.unlockedLevels.includes(21));
  assert.ok(!progress.unlockedLevels.includes(22));
  assert.ok(!progress.chapters[2].unlocked);
  progress = recordResult(progress, 21, 6);
  assert.ok(progress.unlockedLevels.includes(22));
  assert.throws(() => recordResult(progress, 40, 10));
});
test('progress round trips, recomputes stale unlocks, and rejects damaged saves', async () => {
  const values = new Map<string, string>();
  const store = new ProgressStore({ getItem: async (k) => values.get(k) ?? null, setItem: async (k, v) => { values.set(k, v); } });
  assert.deepEqual((await store.load()).unlockedLevels, [1]);
  const progress = recordResult(deriveProgress({}), 1, 8);
  await store.save(progress); assert.deepEqual(await store.load(), progress);
  assert.deepEqual(parseProgress(JSON.stringify({ ...progress, unlockedLevels: [100] })).unlockedLevels, [1, 2]);
  assert.throws(() => parseProgress('damaged'));
  assert.throws(() => parseProgress('{"version":2}'));
});
test('serialized writes recover after a storage failure', async () => {
  let calls = 0; let saved = '';
  const store = new ProgressStore({ getItem: async () => saved || null, setItem: async (_k, value) => {
    if (++calls === 1) throw new Error('disk full'); saved = value;
  } });
  const progress = recordResult(deriveProgress({}), 1, 10);
  await assert.rejects(store.save(progress)); await store.save(progress);
  assert.deepEqual(await store.load(), progress);
});
test('a full 100-level run reaches all five chapters and 300 stars', () => {
  let progress = deriveProgress({});
  for (let id = 1; id <= 100; id++) {
    assert.ok(progress.unlockedLevels.includes(id), `Level ${id} must be reachable`);
    progress = recordResult(progress, id, 10);
  }
  assert.equal(progress.unlockedLevels.length, 100);
  assert.deepEqual(progress.chapters.map((c) => c.stars), [60, 60, 60, 60, 60]);
});

function bestWithStars(total: number): Record<number, Best> {
  const best: Record<number, Best> = {};
  for (let id = 1; total > 0; id++) {
    const stars = Math.min(total, 3);
    best[id] = { score: [0, 5, 8, 10][stars], stars };
    total -= stars;
  }
  return best;
}

test('each pack opens at its exact total-star threshold, regardless of which pack earned them', () => {
  for (const [pack, required] of [[2, 30], [3, 60], [4, 90], [5, 120]]) {
    const before = deriveProgress(bestWithStars(required - 1));
    assert.equal(before.chapters[pack - 1].unlocked, false);
    assert.ok(!before.unlockedLevels.includes((pack - 1) * 20 + 1));
    const after = deriveProgress(bestWithStars(required));
    assert.equal(after.chapters[pack - 1].unlocked, true);
    assert.ok(after.unlockedLevels.includes((pack - 1) * 20 + 1));
    assert.ok(!after.unlockedLevels.includes((pack - 1) * 20 + 2));
  }
  const firstPackPerfect = deriveProgress(bestWithStars(60));
  assert.equal(firstPackPerfect.chapters[1].stars, 0);
  assert.equal(firstPackPerfect.chapters[2].unlocked, true);
});

test('replays count only best stars and can unlock another pack', () => {
  const before = deriveProgress(bestWithStars(29));
  const after = recordResult(before, 10, 10);
  assert.equal(totalStars(after.best), 30);
  assert.equal(after.chapters[1].unlocked, true);
  assert.equal(totalStars(recordResult(after, 1, 10).best), 30);
});

test('legacy v1 saves retain every score and star while pack gates are recomputed', () => {
  const best = Object.fromEntries(Array.from({ length: 20 }, (_, i) => [i + 1, { score: 5, stars: 1 }]));
  best[21] = { score: 10, stars: 3 };
  const loaded = parseProgress(JSON.stringify({ version: 1, best, unlockedLevels: [21, 22], chapters: [] }));
  assert.deepEqual(loaded.best, best);
  assert.equal(totalStars(loaded.best), 23);
  assert.equal(loaded.chapters[1].unlocked, false);
  assert.ok(!loaded.unlockedLevels.includes(21));
  assert.deepEqual(parseProgress(JSON.stringify(loaded)), loaded);
});
