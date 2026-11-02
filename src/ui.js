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
function stopCountdown() {
  if (countdownTimer) { clearInterval(countdownTimer); countdownTimer = null; }
}

function clearResult() {
  stopCountdown();
  resultRegion.innerHTML = '';
}

function startCountdown(endMs) {
  stopCountdown();
  const root = document.getElementById('countdown');
  if (!root || !Number.isFinite(endMs)) return;
  const SEC = 1000, MIN = 60 * SEC, HOUR = 60 * MIN, DAY = 24 * HOUR, WEEK = 7 * DAY;
  const YEAR = DAYS_PER_YEAR * DAY;
  const MONTH = YEAR / 12;
  const slots = ['years', 'months', 'weeks', 'days', 'hours', 'minutes', 'seconds'];
  const cells = {};
  for (const k of slots) cells[k] = root.querySelector('[data-cd="' + k + '"]');
  const totalSecondsEl = document.querySelector('[data-cd="total-seconds"]');
  function pad(n) { return String(Math.max(0, n)).padStart(2, '0'); }
  function tick() {
    let ms = endMs - Date.now();
    if (ms <= 0) {
      for (const k of slots) {
        if (!cells[k]) continue;
        cells[k].textContent = (k === 'hours' || k === 'minutes' || k === 'seconds') ? '00' : '0';
      }
      if (totalSecondsEl) totalSecondsEl.textContent = '0';
      stopCountdown();
      return;
    }
    const totalSeconds = Math.floor(ms / SEC);
    if (totalSecondsEl) totalSecondsEl.textContent = totalSeconds.toLocaleString();
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
  }
  tick();
  countdownTimer = setInterval(tick, 1000);
}

function tickerHtml() {
  const cells = ['years', 'months', 'weeks', 'days', 'hours', 'minutes', 'seconds'].map((lbl, i, arr) => {
    const cell = `<div class="cd-cell"><div class="cd-val" data-cd="${lbl}">--</div><div class="cd-lbl">${lbl}</div></div>`;
    return i < arr.length - 1 ? cell + '<div class="cd-sep" aria-hidden="true">:</div>' : cell;
  }).join('');
  return `
      <div class="countdown" id="countdown" role="timer" aria-live="off" aria-label="Your journey, live">${cells}</div>
      <div class="cd-total" role="timer" aria-live="off" aria-label="Seconds to invest">
        <div class="cd-total-val" data-cd="total-seconds">--</div>
        <div class="cd-total-lbl">seconds to invest</div>
      </div>`;
}

function renderResult(r, info, gender) {
  resultRegion.innerHTML = '';
  const container = document.createElement('div');
  container.className = 'result-card';
  const showTicker = r.status === 'ok';
  container.innerHTML = `
      <div class="result-head">
        <h2>Your Purpose Days</h2>
        <p>Approximate days for your journey, based on current averages.</p>
      </div>${showTicker ? tickerHtml() : ''}
      <div class="stats">
        ${['days', 'weeks', 'months', 'years', 'blocks40', 'blocks100'].map(label => {
          let display, precise, heading;
          if (label === 'years') { display = r.journey.years.toFixed(2); precise = r.journey.years; heading = 'Years'; }
          else if (label === 'blocks40') { display = r.journey.blocks40_floor.toLocaleString(); precise = r.journey.blocks40; heading = '40-Day Blocks'; }
          else if (label === 'blocks100') { display = r.journey.blocks100_floor.toLocaleString(); precise = r.journey.blocks100; heading = '100-Day Blocks'; }
          else { display = r.journey[label + '_floor'].toLocaleString(); precise = r.journey[label]; heading = label.charAt(0).toUpperCase() + label.slice(1); }
          return `<div class="stat" data-testid="stat-${label}">
            <span class="label">${escapeHtml(heading)}</span>
            <span class="value">${display}</span>
            <span class="precise">precise: ${precise.toFixed(2)}</span>
          </div>`; }).join('')}
      </div>
      <p class="message">${escapeHtml(r.message)}</p>
      <p class="note">Based on life expectancy at birth for ${escapeHtml(info.country)} (${escapeHtml(gender)}), UN World Population Prospects 2024 (${escapeHtml(info.year)} estimate). Statistical estimate, not an individual prediction.</p>
    `;
  resultRegion.appendChild(container);
  if (showTicker) startCountdown(r.end_timestamp_ms);
  container.scrollIntoView({ behavior: 'smooth', block: 'start' });
  resultRegion.focus();
}

function validate() {
  calcBtn.disabled = !(birthInput.value && birthInput.value <= birthInput.max && countryInput.value && genderSelect.value);
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

  const onChange = () => { clearResult(); validate(); saveForm(); };
  [birthInput, countryInput, genderSelect].forEach(el => {
    el.addEventListener('input', onChange);
    el.addEventListener('change', onChange);
  });

  form.addEventListener('submit', e => {
    e.preventDefault();
    errorEl.hidden = true; errorEl.textContent = '';
    try {
      const info = lookup(dataset, countryInput.value, genderSelect.value);
      if (!info) throw new Error('Could not load life expectancy data. Please reload.');
      const calc = calculateJourney({ birthDate: birthInput.value, lifeExpectancyYears: info.years });
      renderResult(calc, info, genderSelect.value);
    } catch (err) {
      clearResult();
      showError(err.message || 'Calculation failed');
    } finally {
      validate();
    }
  });

  validate();
}
