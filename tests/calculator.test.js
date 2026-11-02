import test from 'node:test';
import assert from 'node:assert/strict';
import { calculateJourney } from '../src/calculator.js';
import { DAYS_PER_YEAR } from '../src/config.js';

const DAY_MS = 86_400_000;
const near = (a, b) => assert.ok(Math.abs(a - b) < 0.01, `${a} != ${b}`);
const birthMs = new Date(1990, 0, 1).getTime();
const at = years => new Date(birthMs + years * DAYS_PER_YEAR * DAY_MS);

test('unit conversions for 1.00 remaining year', () => {
  const r = calculateJourney({ birthDate: '1990-01-01', lifeExpectancyYears: 41, now: at(40) });
  near(r.journey.years, 1);
  near(r.journey.days, 365.2425);
  near(r.journey.weeks, 52.1775);
  near(r.journey.months, 12);
});

test('Japan female 88.00 at age exactly 40.00', () => {
  const r = calculateJourney({ birthDate: '1990-01-01', lifeExpectancyYears: 88, now: at(40) });
  near(r.journey.years, 48);
  near(r.journey.months, 576);
  near(r.journey.weeks, 2504.52);
  near(r.journey.days, 17531.64);
  assert.equal(r.status, 'ok');
});

test('beyond average expectancy', () => {
  const r = calculateJourney({ birthDate: '1990-01-01', lifeExpectancyYears: 80, now: at(90) });
  assert.equal(r.status, 'beyond-average-expectancy');
  for (const k of ['years', 'months', 'weeks', 'days', 'blocks40', 'blocks100']) assert.equal(r.journey[k], 0);
  assert.match(r.message, /surpassed the average/);
});

test('rejects future and invalid dates', () => {
  assert.throws(() => calculateJourney({ birthDate: '2999-01-01', lifeExpectancyYears: 80 }), RangeError);
  assert.throws(() => calculateJourney({ birthDate: 'not-a-date', lifeExpectancyYears: 80 }), RangeError);
  assert.throws(() => calculateJourney({ birthDate: '2001-02-30', lifeExpectancyYears: 80 }), RangeError);
});
