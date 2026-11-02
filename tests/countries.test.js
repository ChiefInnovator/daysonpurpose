import test from 'node:test';
import assert from 'node:assert/strict';
import { localeCountry, toIso2, restoreForm } from '../src/countries.js';

const ds = new Map([
  ['US', { name: 'United States', iso2: 'US' }],
  ['GB', { name: 'United Kingdom', iso2: 'GB' }],
  ['FR', { name: 'France', iso2: 'FR' }],
]);

test('localeCountry', () => {
  assert.equal(localeCountry(['en-GB'], ds), 'GB');
  assert.equal(localeCountry(['en'], ds), 'US');
  assert.equal(localeCountry(['en_US', 'fr-FR'], ds), 'FR');
  assert.equal(localeCountry([], ds), null);
});

test('toIso2', () => {
  assert.equal(toIso2('U.S.A.', ds), 'US');
  assert.equal(toIso2('france', ds), 'FR');
  assert.equal(toIso2('gb', ds), 'GB');
  assert.equal(toIso2('Atlantis', ds), null);
});

test('restoreForm uses a valid v2 form', () => {
  const v2 = JSON.stringify({ birthDate: '1980-05-01', country: 'FR', gender: 'female' });
  assert.deepEqual(restoreForm({ v2, v1: null, languages: ['en-GB'], dataset: ds }), { birthDate: '1980-05-01', country: 'FR', gender: 'female' });
});

test('restoreForm ignores a saved code not in the dataset', () => {
  const v2 = JSON.stringify({ birthDate: '1980-05-01', country: 'ZZ', gender: 'male' });
  assert.equal(restoreForm({ v2, v1: null, languages: ['en-GB'], dataset: ds }).country, 'GB');
});

test('restoreForm migrates v1', () => {
  const v1 = JSON.stringify({ birthDate: '1970-09-19', country: 'USA', gender: 'total' });
  assert.deepEqual(restoreForm({ v2: null, v1, languages: [], dataset: ds }), { birthDate: '1970-09-19', country: 'US', gender: 'female' });
});

test('restoreForm treats malformed JSON as absent', () => {
  assert.deepEqual(restoreForm({ v2: '{', v1: 'nope', languages: [], dataset: ds }), { birthDate: '', country: 'US', gender: 'male' });
});

test('restoreForm prefers v2 over v1 entirely', () => {
  const v2 = JSON.stringify({ birthDate: '', country: 'FR', gender: 'male' });
  const v1 = JSON.stringify({ birthDate: '1970-09-19', country: 'USA', gender: 'total' });
  assert.deepEqual(restoreForm({ v2, v1, languages: [], dataset: ds }), { birthDate: '', country: 'FR', gender: 'male' });
});
