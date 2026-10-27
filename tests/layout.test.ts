import { test } from 'node:test';
import assert from 'node:assert/strict';
import { levelGridLayout, paginateNotice } from '../src/layout/geometry';
import notices from '../src/audio/licenses.json';

test('20 level tiles fit portrait, landscape and desktop areas without scrolling', () => {
  for (const [width, height] of [[296, 400], [366, 580], [716, 190], [1152, 680], [200, 250]]) {
    const grid = levelGridLayout(width, height);
    assert.ok(grid.side > 0);
    assert.equal(grid.columns * grid.rows, 20);
    assert.ok(grid.columns * grid.side + (grid.columns - 1) * grid.gap <= width);
    assert.ok(grid.rows * grid.side + (grid.rows - 1) * grid.gap <= height);
  }
});
test('short landscape screens use a wider grid than portrait screens', () => {
  const portrait = levelGridLayout(296, 400);
  const landscape = levelGridLayout(716, 190);
  assert.ok(landscape.columns > portrait.columns);
  assert.ok(portrait.side >= 44 && landscape.side >= 44);
});
test('paginated credits retain every non-whitespace character and respect their bounds', () => {
  for (const [columns, rows] of [[32, 12], [88, 6], [110, 30], [10, 1]]) {
    const pages = paginateNotice(notices.msBasic, columns, rows);
    assert.equal(pages.join('\n').replace(/\s/g, ''), notices.msBasic.replace(/\s/g, ''));
    for (const page of pages) {
      const lines = page.split('\n');
      assert.ok(lines.length <= rows);
      assert.ok(lines.every((line) => line.length <= columns));
    }
  }
});
test('layout helpers safely handle an unmeasured area', () => {
  assert.equal(levelGridLayout(0, 0).side, 0);
  assert.deepEqual(paginateNotice('', 0, 0), ['']);
});
