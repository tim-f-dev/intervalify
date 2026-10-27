import { test } from 'node:test';
import assert from 'node:assert/strict';
import { TUTORIAL_KEY, TutorialSession, tutorialStage } from '../src/tutorial/session';
import { deriveProgress, PROGRESS_KEY, recordResult } from '../src/game/progress';
import { LANGUAGE_KEY } from '../src/localization/core';

function storage(initial: Record<string, string> = {}) {
  const data = new Map(Object.entries(initial));
  return { data, getItem: async (key: string) => data.get(key) ?? null, setItem: async (key: string, value: string) => { data.set(key, value); } };
}
test('the first level waits for preference hydration before allowing playback', async () => {
  let loaded!: (value: string | null) => void;
  const session = new TutorialSession({ getItem: () => new Promise((resolve) => { loaded = resolve; }), setItem: async () => {} });
  assert.equal(tutorialStage(session.getSnapshot()), 'loading');
  const pending = session.initialize();
  assert.equal(tutorialStage(session.getSnapshot()), 'loading');
  loaded(null); await pending;
  assert.equal(tutorialStage(session.getSnapshot()), 'tutorial');
});
test('normal dismissal permits all further levels and restarts in that session only', async () => {
  const store = storage(); const session = new TutorialSession(store);
  await session.initialize(); await session.dismiss(false);
  assert.equal(tutorialStage(session.getSnapshot()), 'play');
  await session.initialize(); // Returning through a menu is not a new session.
  assert.equal(tutorialStage(session.getSnapshot()), 'play');
  assert.equal(store.data.size, 0);
  const restarted = new TutorialSession(store); await restarted.initialize();
  assert.equal(tutorialStage(restarted.getSnapshot()), 'tutorial');
});
test('explicit opt-out persists across app sessions without changing scores or language', async () => {
  const progress = JSON.stringify(recordResult(deriveProgress({}), 1, 8));
  const store = storage({ [PROGRESS_KEY]: progress, [LANGUAGE_KEY]: 'de' });
  const session = new TutorialSession(store); await session.initialize(); await session.dismiss(true);
  assert.equal(store.data.get(TUTORIAL_KEY), 'true');
  assert.equal(store.data.get(PROGRESS_KEY), progress);
  assert.equal(store.data.get(LANGUAGE_KEY), 'de');
  const restarted = new TutorialSession(store); await restarted.initialize();
  assert.equal(tutorialStage(restarted.getSnapshot()), 'play');
});
test('failed saves leave the tutorial open for retry or continuation without saving', async () => {
  let fail = true;
  const store = storage();
  const session = new TutorialSession({ ...store, setItem: async (key, value) => { if (fail) throw Error('Storage full'); await store.setItem(key, value); } });
  await session.initialize(); await session.dismiss(true);
  assert.equal(tutorialStage(session.getSnapshot()), 'tutorial');
  assert.equal(session.getSnapshot().saveError, true);
  fail = false; await session.dismiss(true);
  assert.equal(tutorialStage(session.getSnapshot()), 'play');
  const retryWithoutSaving = new TutorialSession({ getItem: async () => null, setItem: async () => { throw Error('Storage full'); } });
  await retryWithoutSaving.initialize(); await retryWithoutSaving.dismiss(true); await retryWithoutSaving.dismiss(false);
  assert.equal(tutorialStage(retryWithoutSaving.getSnapshot()), 'play');
  assert.equal(retryWithoutSaving.getSnapshot().saveError, false);
});
test('duplicate Continue presses produce one opt-out write and wait for it to finish', async () => {
  let complete!: () => void; let writes = 0;
  const session = new TutorialSession({ getItem: async () => null, setItem: () => { writes++; return new Promise<void>((resolve) => { complete = resolve; }); } });
  await session.initialize(); const pending = session.dismiss(true); await session.dismiss(true);
  assert.equal(writes, 1); assert.equal(tutorialStage(session.getSnapshot()), 'tutorial');
  complete(); await pending; assert.equal(tutorialStage(session.getSnapshot()), 'play');
});
test('unreadable or unrecognized preferences safely default to showing the tutorial', async () => {
  for (const value of [null, 'false', 'invalid']) {
    const session = new TutorialSession({ getItem: async () => value, setItem: async () => {} });
    await session.initialize(); assert.equal(tutorialStage(session.getSnapshot()), 'tutorial');
  }
  const session = new TutorialSession({ getItem: async () => { throw Error('Unavailable'); }, setItem: async () => {} });
  await session.initialize(); assert.equal(tutorialStage(session.getSnapshot()), 'tutorial');
});
