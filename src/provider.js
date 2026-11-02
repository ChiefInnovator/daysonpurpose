import { DATA_URL } from './config.js';

const HEADER = 'name,iso2,male,female,total,source,year';

export function parseCsv(text) {
  const lines = String(text).trim().split(/\r?\n/);
  if (lines.shift() !== HEADER) throw new Error('Bad dataset');
  const rows = new Map();
  for (const line of lines) {
    const parts = line.split(',');
    if (parts.length !== 7 || parts.some(p => p.trim() === '')) throw new Error('Bad dataset');
    const [name, iso2, male, female, total, source, year] = parts;
    const row = { name, iso2, male: Number(male), female: Number(female), total: Number(total), source, year: Number(year) };
    if (!name || !iso2 || ![row.male, row.female, row.total, row.year].every(Number.isFinite)) {
      throw new Error('Bad dataset');
    }
    rows.set(iso2, row);
  }
  return rows;
}

export async function loadDataset() {
  const res = await fetch(DATA_URL);
  if (!res.ok) throw new Error(`Dataset request failed: ${res.status}`);
  return parseCsv(await res.text());
}

export function lookup(dataset, iso2, gender) {
  const row = dataset.get(iso2);
  if (!row) return null;
  return { years: row[gender], country: row.name, source: row.source, year: row.year };
}
