import test from 'node:test';
import assert from 'node:assert/strict';
import { readdirSync, readFileSync } from 'node:fs';

test('src makes no absolute-URL requests', () => {
  const dir = new URL('../src/', import.meta.url);
  for (const f of readdirSync(dir).filter(n => n.endsWith('.js'))) {
    assert.doesNotMatch(readFileSync(new URL(f, dir), 'utf8'), /https?:\/\//, f);
  }
});
