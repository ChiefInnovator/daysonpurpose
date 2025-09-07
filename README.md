# Days on Purpose

Turn time into meaningful action.

## Overview
Days on Purpose is a zero‑dependency single‑page application (one `index.html`) that helps you frame life around purposeful action. Provide birth date, country, and gender; it estimates your remaining “purpose days” (days / weeks / months / years) using a bundled life‑expectancy dataset. Focus: clarity, momentum, investment—not fear or countdown.

## Key Features
* CSV life expectancy dataset parsed & cached (24h, localStorage).
* Full country dropdown (sorted A→Z) defaults to the country with the highest total life expectancy.
* Gender: female / male only (no combined "total" option; logic falls back to total column if needed).
* Independent unit calculations (not chained) using 365.2425 days/year.
* Purpose‑centric messaging including celebratory copy when beyond average expectancy.
* Input + dataset persistence (form state + parsed dataset cached).
* Embedded CSV fallback if fetch fails (e.g., opened via `file://`).
* Accessible: labels, aria-live results, reasonable focus order, high contrast.
* Responsive, mobile‑first layout with clear spacing and typography.

## Use It
1. Open `index.html` in a modern browser (double‑click or serve statically).
2. Choose birth date, country, gender.
3. Click Calculate. Results render immediately.

Nothing to build or install. Optionally serve with a tiny static server (e.g. `python -m http.server`).

## Calculation Model
```
age_years       = (nowUTC - birthDateUTC) / 1000 / 60 / 60 / 24 / 365.2425
remaining_years = max(life_expectancy_years - age_years, 0)
days            = remaining_years * 365.2425
weeks           = days / 7
months          = remaining_years * 12
years           = remaining_years
```
Values are floored to present whole figures (plus a 2‑decimal representation where appropriate). If remaining <= 0 a "beyond average expectancy" status message is shown.

## Fallback Logic
1. Exact country + gender column.
2. Missing gender column → country total.
3. Country missing → United States total; if still unavailable → default expectancy 75.

## Files
```
index.html              # Entire SPA (markup, styles, JS logic)
data/lifeexpectancy.csv # Primary dataset
specs/days_on_purpose_spec.md
specs/userinterface example.png
```

## Extending Ideas
| Goal | Direction |
|------|-----------|
| Add tests | Extract JS into modules + add Jest/Vitest |
| API source | Replace CSV fetch block with network call + ETag/TTL |
| Regions | Add region metadata & aggregated fallbacks |
| i18n | Externalize strings + locale number/date formatting |
| PWA | Add manifest & service worker for offline caching |
| Share links | Encode form state in query params |

## Design Principles
Supportive, action‑oriented tone. Emphasis on investing today’s day, not counting down life. Minimal friction, legible typography, accessible contrast.

## Disclaimer
Statistical averages only; not a health or longevity prediction.

## Spec Reference
See `specs/days_on_purpose_spec.md` for original specification details.

---
Suggestions or improvements welcome.