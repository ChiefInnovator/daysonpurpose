import { DAYS_PER_YEAR, LS_FORM_V1, LS_FORM_V2, LS_LEGACY_KEYS } from './config.js';
import { calculateJourney } from './calculator.js';
import { restoreForm } from './countries.js';
import { lookup } from './provider.js';

const form = document.getElementById('calculator-form');
const birthInput = document.getElementById('birthDate');
const countryInput = document.getElementById('country');
const genderSelect = document.getElementById('gender');
const calcBtn = document.getElementById('calc-btn');
const resultRegion = document.getElementById('result-region');
const errorEl = document.getElementById('error');

export function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, ch => {
    switch (ch) {
      case '&': return '&amp;';
      case '<': return '&lt;';
      case '>': return '&gt;';
      case '"': return '&quot;';
      default: return '&#39;';
    }
  });
}

export function showError(message) {
  errorEl.textContent = message;
  errorEl.hidden = false;
}

function localIsoDate(d) {
  const pad = n => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

function readStorage(key) {
  try { return localStorage.getItem(key); } catch { return null; }
}

function saveForm() {
  const data = { birthDate: birthInput.value, country: countryInput.value, gender: genderSelect.value };
  try { localStorage.setItem(LS_FORM_V2, JSON.stringify(data)); } catch {}
}

function populateCountrySelect(dataset) {
  countryInput.innerHTML = '';
  const rows = [...dataset.values()].sort((a, b) => a.name.localeCompare(b.name));
  for (const row of rows) {
    const opt = document.createElement('option');
    opt.value = row.iso2;
    opt.textContent = row.name;
    countryInput.appendChild(opt);
  }
}

let countdownTimer = null;
let tick = null;
function stopCountdown() {
  if (countdownTimer) { clearInterval(countdownTimer); countdownTimer = null; }
}

function clearResult() {
  stopCountdown();
  tick = null;
  resultRegion.innerHTML = '';
}

const reduceMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;

function setupJourney(endMs) {
  stopCountdown();
  const root = document.getElementById('journey');
  if (!root || !Number.isFinite(endMs)) return;
  const SEC = 1000, MIN = 60 * SEC, HOUR = 60 * MIN, DAY = 24 * HOUR, WEEK = 7 * DAY;
  const YEAR = DAYS_PER_YEAR * DAY;
  const MONTH = YEAR / 12;
  const slots = ['years', 'months', 'weeks', 'days', 'hours', 'minutes', 'seconds'];
  const cells = {};
  for (const k of slots) cells[k] = root.querySelector('[data-cd="' + k + '"]');
  const totalSecondsEl = root.querySelector('[data-cd="total-seconds"]');
  const toggle = root.querySelector('.journey-toggle');
  function pad(n) { return String(Math.max(0, n)).padStart(2, '0'); }
  tick = function () {
    let ms = Math.max(0, endMs - Date.now());
    totalSecondsEl.textContent = Math.floor(ms / SEC).toLocaleString();
    const y = Math.floor(ms / YEAR); ms -= y * YEAR;
    const mo = Math.floor(ms / MONTH); ms -= mo * MONTH;
    const w = Math.floor(ms / WEEK); ms -= w * WEEK;
    const d = Math.floor(ms / DAY); ms -= d * DAY;
    const h = Math.floor(ms / HOUR); ms -= h * HOUR;
    const mi = Math.floor(ms / MIN); ms -= mi * MIN;
    const s = Math.floor(ms / SEC);
    cells.years.textContent = y.toLocaleString();
    cells.months.textContent = String(mo);
    cells.weeks.textContent = String(w);
    cells.days.textContent = String(d);
    cells.hours.textContent = pad(h);
    cells.minutes.textContent = pad(mi);
    cells.seconds.textContent = pad(s);
  };
  const play = () => { stopCountdown(); tick(); countdownTimer = setInterval(tick, 1000); toggle.textContent = 'Pause'; toggle.setAttribute('aria-pressed', 'false'); };
  const pause = () => { stopCountdown(); toggle.textContent = 'Play'; toggle.setAttribute('aria-pressed', 'true'); };
  toggle.addEventListener('click', () => (countdownTimer ? pause() : play()));
  tick();
  if (reduceMotion()) pause(); else play();
}

function journeyHtml() {
  const cells = ['years', 'months', 'weeks', 'days', 'hours', 'minutes', 'seconds'].map(lbl =>
    `<div class="jr-cell"><span class="jr-val" data-cd="${lbl}">--</span><span class="jr-lbl">${lbl}</span></div>`).join('');
  return `
      <section class="journey" id="journey" aria-label="Your journey, live">
        <div class="jr-row" role="timer" aria-live="off">${cells}</div>
        <div class="jr-foot">
          <p class="jr-total"><span data-cd="total-seconds">--</span> seconds to invest</p>
          <button type="button" class="journey-toggle" aria-pressed="false">Pause</button>
        </div>
      </section>`;
}

const UNITS = [
  ['weeks', 'Weeks', j => j.weeks_floor.toLocaleString()],
  ['months', 'Months', j => j.months_floor.toLocaleString()],
  ['years', 'Years', j => j.years.toFixed(1)],
  ['blocks40', '40-day blocks', j => j.blocks40_floor.toLocaleString()],
  ['blocks100', '100-day blocks', j => j.blocks100_floor.toLocaleString()],
];

function renderResult(r, info, gender) {
  resultRegion.innerHTML = '';
  const container = document.createElement('div');
  container.className = 'result-card';
  const note = `<p class="note">Based on life expectancy at birth for ${escapeHtml(info.country)} (${escapeHtml(gender)}): ${info.years.toFixed(1)} years. Source: UN World Population Prospects 2024 (${escapeHtml(info.year)} estimate).</p>`;
  if (r.status === 'ok') {
    const days = r.journey.days_floor.toLocaleString();
    container.innerHTML = `
      <h2 class="hero" data-testid="stat-days"><span class="hero-num">${days}</span> <span class="hero-unit">purpose days</span></h2>
      <p class="hero-sub">Approximately, based on current averages.</p>
      <p class="message">What will you invest one day in today?</p>
      <dl class="units">
        ${UNITS.map(([key, label, fmt]) => `<div data-testid="stat-${key}"><dt>${label}</dt><dd>${fmt(r.journey)}</dd></div>`).join('')}
      </dl>${journeyHtml()}
      <div class="actions"><button type="button" class="share-btn">Share Days on Purpose</button></div>
      ${note}`;
    container.querySelector('.share-btn').addEventListener('click', e => share(e.currentTarget, days));
  } else {
    container.innerHTML = `
      <h2 class="hero hero-beyond">You’ve surpassed the average.</h2>
      <p class="message">Keep investing in what matters.</p>
      <p class="hero-sub">At ${r.age_years.toFixed(1)}, you are ${(r.age_years - info.years).toFixed(1)} years past the average. Every day from here is one you get to invest.</p>
      <div class="actions"><button type="button" class="share-btn">Share Days on Purpose</button></div>
      ${note}`;
    container.querySelector('.share-btn').addEventListener('click', e => share(e.currentTarget, null));
  }
  resultRegion.appendChild(container);
  if (r.status === 'ok') setupJourney(r.end_timestamp_ms);
  container.scrollIntoView({ behavior: reduceMotion() ? 'auto' : 'smooth', block: 'start' });
  resultRegion.focus();
}

async function share(button, days) {
  const url = location.origin + location.pathname;
  const text = days
    ? `I have about ${days} purpose days. What will you invest one day in today?`
    : 'How many purpose days do you have? What will you invest one day in today?';
  const original = 'Share Days on Purpose';
  try {
    if (navigator.share) {
      await navigator.share({ title: 'Days on Purpose', text, url });
      return;
    }
    await navigator.clipboard.writeText(`${text} ${url}`);
    button.textContent = 'Link copied';
  } catch (err) {
    if (err && err.name === 'AbortError') return;
    button.textContent = 'Could not share — copy the page address instead';
  }
  setTimeout(() => { button.textContent = original; }, 2500);
}

function setFieldError(message) {
  if (message) {
    showError(message);
    birthInput.setAttribute('aria-invalid', 'true');
    birthInput.focus();
  } else {
    errorEl.hidden = true;
    errorEl.textContent = '';
    birthInput.removeAttribute('aria-invalid');
  }
}

export function initUi(dataset) {
  birthInput.max = localIsoDate(new Date());
  populateCountrySelect(dataset);

  const restored = restoreForm({
    v2: readStorage(LS_FORM_V2),
    v1: readStorage(LS_FORM_V1),
    languages: navigator.languages,
    dataset,
  });
  birthInput.value = restored.birthDate;
  countryInput.value = restored.country;
  genderSelect.value = restored.gender;
  saveForm();
  try { for (const key of LS_LEGACY_KEYS) localStorage.removeItem(key); } catch {}

  const onChange = () => { clearResult(); setFieldError(null); saveForm(); };
  [birthInput, countryInput, genderSelect].forEach(el => {
    el.addEventListener('input', onChange);
    el.addEventListener('change', onChange);
  });

  form.addEventListener('submit', e => {
    e.preventDefault();
    setFieldError(null);
    if (!birthInput.value) { clearResult(); setFieldError('Enter your birth date.'); return; }
    try {
      const info = lookup(dataset, countryInput.value, genderSelect.value);
      if (!info) throw new Error('Could not load life expectancy data. Please reload.');
      const calc = calculateJourney({ birthDate: birthInput.value, lifeExpectancyYears: info.years });
      renderResult(calc, info, genderSelect.value);
    } catch (err) {
      clearResult();
      if (err instanceof RangeError) setFieldError(err.message);
      else showError(err.message || 'Calculation failed');
    }
  });

  calcBtn.disabled = false;
}
