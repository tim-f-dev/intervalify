import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createLocalization, detectLanguage, LanguageController, LANGUAGE_KEY, localizedInterval, resources } from '../src/localization/core';
import { validateTranslationPair } from '../src/localization/validation';
import { deriveProgress, recordResult, PROGRESS_KEY } from '../src/game/progress';
import { createQuestion } from '../src/game/questions';
import { levels } from '../src/game/levels';

function storage(initial: Record<string, string> = {}) {
  const data = new Map(Object.entries(initial));
  return { data, getItem: async (key: string) => data.get(key) ?? null, setItem: async (key: string, value: string) => { data.set(key, value); } };
}
test('German device variants are detected; all other and missing locales default to English', () => {
  for (const locale of ['de', 'de-DE', 'de-AT', 'de_CH', 'DE-de']) assert.equal(detectLanguage(locale), 'de');
  for (const locale of ['en-US', 'fr-FR', '', undefined, null]) assert.equal(detectLanguage(locale), 'en');
});
test('manual language overrides detection and survives a new controller instance', async () => {
  const store = storage();
  const controller = new LanguageController(createLocalization(), store, () => 'de-DE');
  await controller.initialize(); assert.equal(controller.getSnapshot().language, 'de');
  await controller.setLanguage('en'); assert.equal(store.data.get(LANGUAGE_KEY), 'en');
  const reopened = new LanguageController(createLocalization(), store, () => 'de-DE');
  await reopened.initialize(); assert.equal(reopened.getSnapshot().language, 'en');
});
test('unsupported saved preferences safely fall back to device detection', async () => {
  const controller = new LanguageController(createLocalization(), storage({ [LANGUAGE_KEY]: 'fr' }), () => 'de-AT');
  await controller.initialize(); assert.equal(controller.getSnapshot().language, 'de');
});
test('changing language updates strings, not question, answer order, or saved progress', async () => {
  const progress = recordResult(deriveProgress({}), 1, 8);
  const serializedProgress = JSON.stringify(progress);
  const store = storage({ [PROGRESS_KEY]: serializedProgress });
  const instance = createLocalization(); const controller = new LanguageController(instance, store, () => 'en');
  await controller.initialize();
  const question = createQuestion(levels[0]);
  const snapshot = JSON.stringify(question); const choices = question.choices;
  let events = 0; instance.on('languageChanged', () => events++);
  assert.equal(localizedInterval(instance.t.bind(instance), 7), 'Perfect fifth');
  await controller.setLanguage('de');
  assert.equal(localizedInterval(instance.t.bind(instance), 7), 'Reine Quinte');
  assert.equal(localizedInterval(instance.t.bind(instance), 19), 'Reine Duodezime');
  assert.equal(JSON.stringify(question), snapshot); assert.equal(question.choices, choices);
  assert.equal(store.data.get(PROGRESS_KEY), serializedProgress); assert.equal(events, 1);
});
test('language and star plurals resolve without untranslated keys in both languages', () => {
  const instance = createLocalization();
  assert.equal(instance.getFixedT('en')('common.starCount', { count: 1 }), '1 star');
  assert.equal(instance.getFixedT('en')('common.starCount', { count: 2 }), '2 stars');
  assert.equal(instance.getFixedT('de')('common.starCount', { count: 1 }), '1 Stern');
  assert.equal(instance.getFixedT('de')('common.starCount', { count: 2 }), '2 Sterne');
  for (const ns of ['translation', 'levels', 'instruments'] as const) assert.deepEqual(validateTranslationPair(resources.en[ns], resources.de[ns]), []);
});
test('missing translations and interpolation mistakes fail validation', () => {
  assert.ok(validateTranslationPair({ hello: 'Hi {{name}}' }, {}).length);
  assert.ok(validateTranslationPair({ hello: 'Hi {{name}}' }, { hello: 'Hallo {{wrong}}' }).length);
});
test('language saving failures keep the new interface language and can be retried', async () => {
  let fail = true; let saved = '';
  const instance = createLocalization();
  const controller = new LanguageController(instance, { getItem: async () => null, setItem: async (_key, value) => { if (fail) throw new Error('full'); saved = value; } }, () => 'en');
  await controller.initialize(); await controller.setLanguage('de');
  assert.equal(instance.language, 'de'); assert.equal(controller.getSnapshot().error, 'save');
  fail = false; await controller.retry(); assert.equal(saved, 'de'); assert.equal(controller.getSnapshot().error, null);
});
test('language preference reads fail safely and rapid changes persist in order', async () => {
  const controller = new LanguageController(createLocalization(), { getItem: async () => { throw new Error('unavailable'); }, setItem: async () => {} }, () => 'de');
  await controller.initialize(); assert.equal(controller.getSnapshot().language, 'de'); assert.equal(controller.getSnapshot().error, 'load');
  const store = storage(); const next = new LanguageController(createLocalization(), store, () => 'en');
  await next.initialize(); await Promise.all([next.setLanguage('de'), next.setLanguage('en')]);
  assert.equal(store.data.get(LANGUAGE_KEY), 'en'); assert.equal(next.getSnapshot().language, 'en');
});
