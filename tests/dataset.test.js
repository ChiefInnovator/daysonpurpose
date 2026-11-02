import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { parseCsv } from '../src/provider.js';
import { toIso2 } from '../src/countries.js';

const text = readFileSync(new URL('../data/lifeexpectancy.csv', import.meta.url), 'utf8');
const ds = parseCsv(text);

test('dataset shape', () => {
  assert.equal(text.split('\n')[0], 'name,iso2,male,female,total,source,year');
  assert.equal(ds.size, 237);
  assert.equal(text.trim().split('\n').length - 1, 237, 'ISO2 codes are unique');
  for (const row of ds.values()) {
    assert.ok(!row.name.includes(','), row.name);
    for (const k of ['male', 'female', 'total']) assert.ok(row[k] >= 40 && row[k] <= 95, `${row.name} ${k}`);
  }
});

test('every v1 country name resolves', () => {
  const names = readFileSync(new URL('./fixtures/v1_countries.txt', import.meta.url), 'utf8').trim().split('\n');
  assert.equal(names.length, 192);
  for (const name of names) assert.ok(toIso2(name, ds), name);
});
