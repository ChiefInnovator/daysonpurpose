import test from 'node:test';
import assert from 'node:assert/strict';
import { parseCsv, lookup } from '../src/provider.js';

const CSV = 'name,iso2,male,female,total,source,year\nJapan,JP,81.09,87.14,84.07,UN WPP 2024,2023\n';

test('parseCsv reads rows keyed by ISO2', () => {
  const ds = parseCsv(CSV);
  assert.deepEqual(ds.get('JP'), { name: 'Japan', iso2: 'JP', male: 81.09, female: 87.14, total: 84.07, source: 'UN WPP 2024', year: 2023 });
});

test('parseCsv rejects a bad header or value', () => {
  assert.throws(() => parseCsv('Country,Male\nJapan,81'));
  assert.throws(() => parseCsv(CSV.replace('81.09', 'x')));
  assert.throws(() => parseCsv(CSV.replace('81.09', '')));
  assert.throws(() => parseCsv(CSV.replace(',2023', '')));
});

test('lookup returns the gender value or null', () => {
  const ds = parseCsv(CSV);
  assert.deepEqual(lookup(ds, 'JP', 'female'), { years: 87.14, country: 'Japan', source: 'UN WPP 2024', year: 2023 });
  assert.equal(lookup(ds, 'ZZ', 'male'), null);
});
