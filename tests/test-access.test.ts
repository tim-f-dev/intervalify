import { test } from 'node:test';
import assert from 'node:assert/strict';
import { deriveProgress, parseProgress, recordResult } from '../src/game/progress';
import { withTestAccess } from '../src/game/test-access';

test('test access opens all levels and packs without inventing scores or mutating progress', () => {
  const progress = deriveProgress({ 1: { score: 8, stars: 2 } });
  const before = JSON.stringify(progress);
  assert.equal(withTestAccess(progress, false), progress);
  const preview = withTestAccess(progress, true);
  assert.equal(preview.unlockedLevels.length, 100);
  assert.ok(preview.chapters.every((pack) => pack.unlocked));
  assert.equal(preview.best, progress.best);
  assert.equal(JSON.stringify(progress), before);
  const saved = recordResult(preview, 100, 5);
  assert.deepEqual(saved.best[100], { score: 5, stars: 1 });
  assert.ok(!saved.unlockedLevels.includes(100));
  assert.deepEqual(parseProgress(JSON.stringify(saved)), saved);
  assert.ok(!withTestAccess(saved, false).chapters[4].unlocked);
});
