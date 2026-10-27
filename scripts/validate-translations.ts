import assert from 'node:assert/strict';
import { readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import ts from 'typescript';
import { resources, createLocalization } from '../src/localization/core';
import { flattenTranslations, validateTranslationPair } from '../src/localization/validation';
import { levels } from '../src/game/levels';
import catalog from '../src/audio/catalog.json';

const namespaces = Object.keys(resources.en) as (keyof typeof resources.en)[];
for (const ns of namespaces) assert.deepEqual(validateTranslationPair(resources.en[ns], resources.de[ns]), [], ns);
for (const language of ['en', 'de'] as const) {
  assert.equal(Object.keys(resources[language].levels).length, 100);
  assert.equal(Object.keys(resources[language].instruments).length, 128);
  for (const level of levels) {
    const translated = resources[language].levels[String(level.id) as keyof typeof resources.en.levels];
    assert.ok(translated.title && translated.description, `${language} level ${level.id}`);
    if (language === 'en') { assert.equal(translated.title, level.title); assert.equal(translated.description, level.challenge); }
  }
  for (const program of Object.keys(catalog)) assert.ok(program in resources[language].instruments);
}

const flattened = Object.fromEntries(namespaces.map((ns) => [ns, flattenTranslations(resources.en[ns])]));
const errors: string[] = [];
const words = (value: string) => /\p{L}/u.test(value) && !['Intervalify', 'English', 'Deutsch'].includes(value.trim());
function literalBranches(node: ts.Node): string[] {
  if (ts.isStringLiteralLike(node)) return [node.text];
  if (ts.isConditionalExpression(node)) return [...literalBranches(node.whenTrue), ...literalBranches(node.whenFalse)];
  return [];
}
function walk(directory: string): string[] {
  return readdirSync(directory, { withFileTypes: true }).flatMap((entry) => entry.isDirectory() ? walk(join(directory, entry.name)) : [join(directory, entry.name)]);
}
for (const file of walk('src').filter((name) => name.endsWith('.tsx'))) {
  const source = ts.createSourceFile(file, readFileSync(file, 'utf8'), ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX);
  function inspect(node: ts.Node) {
    const at = `${file}:${source.getLineAndCharacterOfPosition(node.getStart()).line + 1}`;
    if (ts.isJsxText(node) && words(node.text.trim())) errors.push(`${at} untranslated JSX text: ${node.text.trim()}`);
    if (ts.isJsxExpression(node) && node.expression && (ts.isJsxElement(node.parent) || ts.isJsxFragment(node.parent))) {
      for (const value of literalBranches(node.expression)) if (words(value)) errors.push(`${at} untranslated JSX expression: ${value}`);
    }
    if (ts.isJsxAttribute(node) && ['accessibilityLabel', 'accessibilityHint'].includes(node.name.getText()) && node.initializer && ts.isStringLiteral(node.initializer) && words(node.initializer.text)) {
      errors.push(`${at} untranslated accessibility label`);
    }
    if (ts.isCallExpression(node) && node.expression.getText() === 't' && node.arguments[0]) {
      let namespace = 'translation';
      const options = node.arguments[1];
      if (options && ts.isObjectLiteralExpression(options)) for (const property of options.properties) {
        if (ts.isPropertyAssignment(property) && property.name.getText() === 'ns' && ts.isStringLiteral(property.initializer)) namespace = property.initializer.text;
      }
      const keys = flattened[namespace];
      for (const key of literalBranches(node.arguments[0])) if (!keys || !(key in keys || `${key}_one` in keys && `${key}_other` in keys)) errors.push(`${at} missing translation ${namespace}:${key}`);
    }
    ts.forEachChild(node, inspect);
  }
  inspect(source);
}
assert.deepEqual(errors, []);
const instance = createLocalization();
for (const language of ['en', 'de']) {
  const t = instance.getFixedT(language);
  for (const semitones of new Set(levels.flatMap((level) => [...level.intervals]))) assert.ok(!t(`intervals.${semitones}`).startsWith('intervals.'), `${language}: missing interval ${semitones}`);
  for (const count of [0, 1, 2, 3]) assert.ok(!t('common.starCount', { count }).includes('{{'));
}
console.log('Validated en/de: matching keys and variables, 100 level titles/descriptions, 128 instruments, interval names, plural forms and screen text/accessibility scan.');
