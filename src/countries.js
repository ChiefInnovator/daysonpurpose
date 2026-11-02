export const ALIASES = {
  'usa': 'US', 'u.s.a.': 'US', 'us': 'US', 'united states of america': 'US',
  'uk': 'GB', 'england': 'GB',
  'republic of korea': 'KR', 'korea, republic of': 'KR', 'south korea': 'KR',
  'uae': 'AE', 'u.a.e.': 'AE', 'emirates': 'AE', 'united arab emirates': 'AE',
  'saudi': 'SA', 'saudi arabia': 'SA',
  'viet nam': 'VN', 'viet-nam': 'VN',
  // v1 display names that changed with the WPP 2024 dataset
  'czech republic (czechia)': 'CZ', 'são tomé & príncipe': 'ST', 'turkey': 'TR',
};

export function toIso2(value, dataset) {
  const v = String(value ?? '').trim();
  if (!v) return null;
  if (/^[A-Za-z]{2}$/.test(v) && dataset.has(v.toUpperCase())) return v.toUpperCase();
  const lower = v.toLowerCase();
  for (const row of dataset.values()) {
    if (row.name.toLowerCase() === lower) return row.iso2;
  }
  const alias = ALIASES[lower];
  return alias && dataset.has(alias) ? alias : null;
}

export function localeCountry(languages, dataset) {
  for (const tag of languages ?? []) {
    let region;
    try { region = new Intl.Locale(tag).maximize().region; } catch { continue; }
    if (region && dataset.has(region)) return region;
  }
  return null;
}

function parse(raw) {
  try {
    const v = JSON.parse(raw);
    return v && typeof v === 'object' ? v : null;
  } catch { return null; }
}

const GENDERS = ['male', 'female'];

export function restoreForm({ v2, v1, languages, dataset }) {
  const a = parse(v2);
  const b = a ? null : parse(v1);
  const saved = a || b || {};
  const birthDate = typeof saved.birthDate === 'string' ? saved.birthDate : '';
  let country = null;
  if (a && typeof a.country === 'string' && dataset.has(a.country)) country = a.country;
  if (b) country = toIso2(b.country, dataset);
  if (!country) country = localeCountry(languages, dataset);
  if (!country) country = 'US';
  const legacy = b && b.gender === 'total' ? 'female' : saved.gender;
  const gender = GENDERS.includes(legacy) ? legacy : 'male';
  return { birthDate, country, gender };
}
