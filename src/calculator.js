import { DAYS_PER_YEAR } from './config.js';

const MS_PER_DAY = 24 * 60 * 60 * 1000;

function parseBirthDate(value) {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(String(value ?? ''));
  if (!m) return null;
  const [y, mo, d] = [Number(m[1]), Number(m[2]), Number(m[3])];
  const date = new Date(y, mo - 1, d);
  if (date.getFullYear() !== y || date.getMonth() !== mo - 1 || date.getDate() !== d) return null;
  return date;
}

export function calculateJourney({ birthDate, lifeExpectancyYears, now = new Date() }) {
  const birth = parseBirthDate(birthDate);
  if (!birth) throw new RangeError('Enter a valid birth date.');
  const ageMs = now - birth;
  if (ageMs < 0) throw new RangeError('Birth date cannot be in the future.');
  const ageYears = ageMs / (MS_PER_DAY * DAYS_PER_YEAR);
  let remaining = lifeExpectancyYears - ageYears;
  if (remaining < 0) remaining = 0;
  const endTimestampMs = birth.getTime() + lifeExpectancyYears * DAYS_PER_YEAR * MS_PER_DAY;
  const days = remaining * DAYS_PER_YEAR;
  const weeks = days / 7;
  const blocks40 = days / 40;
  const blocks100 = days / 100;
  const months = remaining * 12;
  const years = remaining;
  const status = remaining === 0 ? 'beyond-average-expectancy' : 'ok';
  const message = status === 'ok'
    ? `You have approximately ${Math.floor(days).toLocaleString()} purpose-days in your journey. What will you invest one day in today?`
    : 'You’ve surpassed the average—keep investing in what matters.';
  return {
    life_expectancy_years: lifeExpectancyYears,
    age_years: ageYears,
    end_timestamp_ms: endTimestampMs,
    journey: {
      years, months, weeks, days, blocks40, blocks100,
      years_floor: Math.floor(years), months_floor: Math.floor(months),
      weeks_floor: Math.floor(weeks), days_floor: Math.floor(days),
      blocks40_floor: Math.floor(blocks40), blocks100_floor: Math.floor(blocks100),
    },
    status,
    message,
  };
}
