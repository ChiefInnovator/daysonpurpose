# Days on Purpose: Current State and Next Direction

*   **Author:** Richard Crane (ChiefInnovator)
*   **Status:** Approved
*   **Date:** 2026-11-02

--------------------------------------------------------------------------------

## Overview

Days on Purpose is a free, browser-only web page. A visitor enters a birth
date, a country, and a gender. The page looks up life expectancy at birth for
that country and gender, subtracts the visitor's current age, and shows the
remainder as days, weeks, months, years, 40-day blocks, and 100-day blocks. It
also shows a live display of years through seconds and a total-seconds figure.
The intent, set in [the product spec](../../specs/days_on_purpose_spec.md), is
to frame the remaining time as days to invest on purpose, not as a mortality
countdown.

The shipped application is one file, [`index.html`](../../index.html) (488
lines: markup, inline CSS, inline JavaScript, and an embedded copy of the
192-country dataset). GitHub Pages serves it from the root of `main` at
`https://chiefinnovator.github.io/daysonpurpose/`. There is no build step, no
dependency, and no test. The only CI is the `branch-policy` workflow, whose
`source-branch` job checks that pull requests come from an allowed branch.

This document records what exists, names the defects and contradictions found
by reading every file in the repository, and sets the next direction.

## Problem Statement

The main path works, but the repository's documents contradict the shipped code
and each other, in ways that mislead users, contributors, and coding agents:

1.  **The repository describes an app that does not exist.**
    [`README.md`](../../README.md) says the app is "TypeScript and React" and
    lists `src/components/App.tsx`, `src/lib/calculator.ts`, and
    `src/providers/expectancyProvider.ts` as key files. Every file under
    `src/`, plus `package.json`, `tsconfig.json`, `public/index.html`, and
    `public/data/life_expectancy_seed.csv`, is 0 bytes.
2.  **The privacy claim is false.** [`llms.txt`](../../llms.txt) states "No
    data is sent to any server." On first visit, `index.html` calls
    `https://ipapi.co/json/`, which sends the visitor's IP address to a third
    party to guess the country.
3.  **The newest feature contradicts the product's tone rule.** The spec says
    "Avoid phrases like 'time left' or 'countdown'." Commit `c2dc71d` added a
    ticker labelled "Live countdown of remaining time" and "total seconds
    remaining."
4.  **The spec's fallback rules are not implemented.** The spec orders
    fallbacks: country total, then UN sub-region average, then global average.
    The code has one: an unknown country silently uses the United States total
    and labels it `default-global`.
5.  **Data provenance is unstated.** The CSV has no source or year column. The
    code hard-codes `sourceYear: 2023` for every row, and the footnote names
    the source as "Bundled CSV." The README, JSON-LD, and `llms.txt` say
    "WHO/World Bank." Nothing in the repository shows which publication the
    numbers came from.
6.  **The dataset is stored three times.** `data/lifeexpectancy.csv`,
    `specs/lifeexpectancy.csv`, and the `EMBEDDED_CSV` string in `index.html`
    hold identical copies, and the parsed result is cached in Local Storage for
    24 hours. An update to one copy does not reach the others.
7.  **Light mode is partially applied.** The `prefers-color-scheme: light` rule
    lightens the page, inputs, and stat tiles, but the result card
    (`#15191b`), the ticker, and the total-seconds box stay dark. The primary
    button is white text on `#2fb8a4`, 2.47:1 contrast, below WCAG AA (4.5:1)
    for 16px text.
8.  **Identity and licensing conflict.** `llms.txt` gives the URL as
    `https://daysonpurpose.com/`, which now serves a separate waitlist site,
    while every meta tag uses the GitHub Pages URL. The README says "MIT
    License. See the LICENSE file"; there is no LICENSE file, and the page
    footer says "All rights reserved." The footer year is a fixed "© 2025."
9.  **Nothing guards behaviour.** The spec lists five required tests. None
    exist. All logic is inside one closure in `index.html`, so a test runner
    cannot import it.

## Goals

*   **G1. Repository documents match the shipped files and behaviour.** README,
    `llms.txt`, JSON-LD, the spec, and `AGENTS.md` describe the files that
    exist. No 0-byte placeholder files remain.
*   **G2. The page makes no third-party network request.** Every privacy
    statement is accurate.
*   **G3. One source of truth for the dataset**, with source name and year
    stored in the data and shown in the footnote.
*   **G4. A result never shows one country's number under another label.**
*   **G5. Tests run in CI** on every PR into `develop` and `main`, next to the
    existing `source-branch` check.
*   **G6. Both colour schemes pass WCAG 2.2 AA contrast** for text (4.5:1;
    3:1 for large text) and for input borders and focus indicators (3:1) on
    every surface the page renders.
*   **G7. On-page text follows the tone rule**, and the spec records how the
    ticker fits it.
*   **G8. Deployment stays a static GitHub Pages site** served from `main`, with
    no server and no account.

## Non-Goals

*   The spec's "Purpose Features" (daily intention, micro-wins, quarterly
    pillars, reflection prompts) and "Stretch" items (regional comparison, year
    selector, permalinks).
*   Any backend, login, analytics, or cloud storage.
*   A visual redesign. Visual work is limited to contrast and light-mode
    defects. Broader design changes come from the Impeccable design review
    (the `impeccable` skill, using [`PRODUCT.md`](../../PRODUCT.md) and
    [`DESIGN.md`](../../DESIGN.md)).
*   SEO copy changes in meta tags, Open Graph tags, and JSON-LD beyond
    correcting factual claims (data source, country count, geolocation).
*   Medical accuracy beyond period life expectancy at birth.
*   Moving hosting to Azure Static Web Apps or a custom domain.

## Decisions

Owner decisions, 2026-11-02:

*   **D1. Code structure: plain ES modules, no build step.** `index.html` keeps
    markup and CSS and loads `src/main.js` with `<script type="module">`. Logic
    lives in modules that Node's built-in `node:test` can import.
*   **D2. The ticker stays, reworded.** No on-page visible or ARIA text uses
    "countdown", "remaining", or "left". The spec's tone rule is amended to
    allow a live ticker under that wording rule.
*   **D3. Country suggestion uses the browser locale.** The `ipapi.co` request
    is removed. The region of `navigator.languages` (for example `en-GB` →
    `GB`) picks the default country.
*   **D4. GitHub Pages is the only host this repo serves.** Pages publishes the
    root of `main` on every merge, so the site always shows the latest released
    version. The canonical URL everywhere is
    `https://chiefinnovator.github.io/daysonpurpose/`. `daysonpurpose.com` is a
    separate waitlist site whose source is not in this repo.
*   **D5. License: PolyForm Strict 1.0.0**, the license on the owner's other
    recent repositories.
*   **D6. Data: UN World Population Prospects (WPP) 2024**, life expectancy at
    birth by sex, 2023 estimates (the last estimate year; 2024 onward is
    projection). The UI field is named "gender"; it maps to WPP's "sex".
*   **D7. Spec amendments.** The spec is updated to match this design:
    *   gender is `female | male` (the `total` option is removed);
    *   the fallback chain is removed: every listed country has complete data,
        enforced at build time;
    *   the `fallback_used` output field is removed;
    *   the weeks value in test 2 is corrected to 2504.52;
    *   tests 3 and 4 become "a saved country code not in the dataset is
        ignored" and "U.S.A. resolves to United States";
    *   the Local Storage dataset cache and 24-hour cache rules are removed;
    *   the ticker is allowed under the D2 wording rule;
    *   "one command to run" becomes "serve the folder"; tests run with
        `npm test`.

## Open Questions

None.

## Critical User Journeys (CUJs)

### CUJ 1: First visit

*   **Given**: A visitor with no saved Local Storage opens the page.
*   **When**: They enter a past birth date, keep or pick a country, pick a
    gender, and press Calculate.
*   **Then**: The result card shows each unit computed from remaining years per
    the spec, and a footnote naming country, gender, "UN World Population
    Prospects 2024 (2023 estimate)". Focus moves to the result region. The page
    makes no request outside its own origin.

### CUJ 2: Return visit

*   **Given**: A visitor calculated before in this browser.
*   **When**: They reopen the page.
*   **Then**: Birth date, country, and gender are restored, and Calculate is
    enabled. A dataset change merged to `main` reaches them within the GitHub
    Pages cache lifetime (`max-age=600`, 10 minutes).

### CUJ 3: Visitor past average life expectancy

*   **Given**: Age is greater than life expectancy for the chosen inputs.
*   **When**: They press Calculate.
*   **Then**: All units show 0, status is `beyond-average-expectancy`, the
    celebratory message from the spec replaces the purpose-days sentence, and
    the ticker and total-seconds box are not rendered.

### CUJ 4: Invalid input

*   **Given**: An empty field, or a birth date after today.
*   **When**: The visitor fills the form.
*   **Then**: Calculate stays disabled until all three fields hold valid values.
    The date picker does not offer dates after today. If any input changes
    after a result, the result is cleared.

### CUJ 5: Light-mode visitor

*   **Given**: The operating system is set to light mode.
*   **When**: They use the form and view a result.
*   **Then**: Every surface, including the result card and ticker, uses the
    light tokens in the Technical Plan, and every pair meets G6.

### CUJ 6: Contributor or coding agent

*   **Given**: A fresh clone.
*   **When**: They read `README.md` and `AGENTS.md` and run `npm test`.
*   **Then**: The files named exist, the tests run locally and in CI, and the
    branching rules (`feature/*` → `develop` → `main`) are stated.

## Proposed Architecture

### Shape

The page stays a static site with no build. The browser loads `index.html`,
which loads one module entry point. Every module except `main.js` and `ui.js`
has no DOM access, so Node can import it in tests. All asset URLs are relative
to the document (`src/main.js`, `data/lifeexpectancy.csv`), because Pages
serves the site under `/daysonpurpose/`.

```text
index.html  (markup + CSS, <script type="module" src="src/main.js">)
   │
   ▼
src/main.js ──► src/provider.js ──fetch──► data/lifeexpectancy.csv
   │               parseCsv(), lookup()                (pure)
   │
   ├──────► src/countries.js   toIso2(), localeCountry(), restoreForm() (pure)
   ├──────► src/calculator.js  calculateJourney()                      (pure)
   └──────► src/ui.js          form wiring, render, ticker, storage    (DOM)

src/config.js   shared constants, imported by the modules above

tests/*.test.js ──import──► config, countries, provider, calculator
                └─readFile─► data/lifeexpectancy.csv, tests/fixtures/
```

### Data

`scripts/build_dataset.py` reads WPP 2024's demographic indicators file and
writes `data/lifeexpectancy.csv`:

```text
name,iso2,male,female,total,source,year
United States,US,76.86,81.85,79.30,UN WPP 2024,2023
```

*   One row per WPP location with `LocTypeName == "Country/Area"`, a non-empty
    `ISO2_code`, and `Time == "2023"`: 237 rows.
*   `male`, `female`, `total` come from `LExMale`, `LExFemale`, `LEx`, rounded
    to 2 decimals.
*   `name` is WPP's `Location`, except for 19 long UN names that get a short
    display name (listed in Detailed Implementation).
*   No name contains a comma, so the file never needs CSV quoting.
*   The script is run by hand when WPP publishes, and its output is committed.
    The app never contacts the UN site.

This CSV is the only copy of the data. `EMBEDDED_CSV`,
`specs/lifeexpectancy.csv`, and the Local Storage dataset cache are removed.

### Lookup

`lookup(dataset, iso2, gender)` returns
`{ years, country, source, year }` for a country in the dataset, or `null`.
Two guarantees make a fallback unnecessary:

1.  The build script and a dataset test reject any row without finite `male`,
    `female`, and `total`.
2.  `restoreForm` drops a saved country code that is not in the dataset, so
    the `<select>` can only hold dataset codes.

If `lookup` ever returns `null`, the page shows the same error as a failed data
load. This meets G4 without a fallback chain.

### Calculation

`calculateJourney({ birthDate, lifeExpectancyYears, now })` keeps today's
arithmetic, with three changes: `now` is passed in so tests can fix time; the
birth date is parsed as local midnight (today it is UTC midnight), so it agrees
with the date picker's local `max`; and errors use `RangeError` with
user-facing messages. It returns:

```text
{ life_expectancy_years, age_years, end_timestamp_ms,
  journey: { years, months, weeks, days, blocks40, blocks100,
             years_floor, months_floor, weeks_floor, days_floor,
             blocks40_floor, blocks100_floor },
  status: "ok" | "beyond-average-expectancy",
  message }
```

### Country default

At start-up `restoreForm` picks the first of:

1.  A saved ISO2 code from Local Storage key `dop_form_v2`, if the dataset has
    it.
2.  A saved v1 country name from `dop_form_v1`, mapped to ISO2 by `toIso2`.
3.  `localeCountry(navigator.languages, dataset)`: for each tag,
    `new Intl.Locale(tag).maximize().region`; the first code in the dataset
    wins. Malformed tags are skipped.
4.  `US`.

The `<select>` option values are ISO2 codes; the visible text is the display
name. The form is saved to `dop_form_v2` only; `dop_form_v1` and the two old
dataset cache keys are deleted after the first load.

### UI changes

*   **Ticker wording (D2).** The ticker's `aria-label` "Live countdown of
    remaining time" becomes "Your journey, live". The total box's
    `aria-label` "Total seconds remaining" and visible label "total seconds
    remaining" both become "seconds to invest". In the
    `beyond-average-expectancy` state neither box is rendered.
*   **Stale results.** Any input change after a result clears the result region
    and stops the ticker.
*   **Future dates.** The date input's `max` is today's local date.
*   **Contrast (G6).** Colours become custom properties defined for each
    scheme (table below). Secondary text uses `--muted` instead of opacity.
    Input borders use `--field-border`; decorative tile borders use
    `--hairline`. Button text uses `--on-accent`.
*   **Footnote.** "Based on life expectancy at birth for {country} ({gender}),
    UN World Population Prospects 2024 (2023 estimate). Statistical estimate,
    not an individual prediction."
*   **Footer.** "© 2025–{current year} Richard Crane. Licensed under PolyForm
    Strict 1.0.0." The year is set by script.

Colour tokens. Ratios are measured against each surface (`--bg`, `--card`,
`--panel`); the lowest is shown.

| Token | Dark | Light | Lowest ratio dark / light |
|---|---|---|---|
| `--bg` | `#0f1214` | `#f5f7f9` | surface |
| `--card` | `#15191b` | `#ffffff` | surface |
| `--panel` | `#1b2022` | `#eef2f3` | surface |
| `--text` | `#f5f7f8` | `#182022` | 15.3 / 14.7 |
| `--muted` | `#a3adb0` | `#4f5b5f` | 7.2 / 6.2 |
| `--accent` (text, outlines) | `#2fb8a4` | `#177a6c` | 6.7 / 4.6 |
| `--on-accent` (button text) | `#0f1214` | `#ffffff` | 7.6 / 5.2 |
| `--danger` | `#f87171` | `#b42318` | 6.0 / 5.8 |
| `--field-border` | `#667377` | `#7d8a8e` | 3.4 / 3.2 |
| `--hairline` (decorative) | `#2a3032` | `#d5dcde` | not required |

### Testing and CI

*   `package.json` (no dependencies): `"type": "module"`,
    `"test": "node --test"`. Node discovers `**/*.test.js`.
*   `.github/workflows/test.yml` runs `npm test` on Node 22 for pull requests
    into `develop` and `main`. Job name `test`.
*   The `main` and `develop` rulesets add `test` as a required status check
    next to `source-branch`.

### Local run

ES modules and `fetch` do not work from `file://`. The README's "open
`index.html`" instruction becomes "serve the folder": VS Code Live Server
(configured on port 5501 in `.vscode/settings.json`) or
`python3 -m http.server`.

### Browser support

ES modules and `Intl.Locale.prototype.maximize`: Chrome and Edge 79+,
Firefox 75+, Safari 14+.

## Alternatives Considered

### Alternative A: Keep one self-contained `index.html`

*   **Pros**: No module loading; opens from `file://`; one file to deploy.
*   **Cons**: Logic sits inside a closure. Tests would extract the inline
    script and run it in a fake DOM, which breaks when markup changes.
*   **Reason for Rejection**: The spec requires calculator and provider tests.
    Modules make them importable with `node:test` and no DOM shim.

### Alternative B: Vite + TypeScript + React (fill the `src/` stubs)

*   **Pros**: Matches the README's current claim. Type checking.
*   **Cons**: Adds `node_modules`, a build, and a Pages deploy workflow. React's
    component model has no use with one form and one result card. A broken
    build stops Pages from updating, against D4.
*   **Reason for Rejection**: Toolchain cost exceeds the benefit at this size.
    JSDoc types with `tsc --checkJs` stay available without a build.

### Alternative C: Keep `ipapi.co` and disclose it

*   **Pros**: Picks the country from location, not language.
*   **Cons**: Sends the visitor's IP to a third party; rate-limited; blocked by
    common ad-blocking lists.
*   **Reason for Rejection**: Zero third-party requests is simpler to state
    and to keep true (G2).

### Alternative D1: Remove the ticker

*   **Pros**: Satisfies the tone rule with no wording constraint.
*   **Cons**: Removes the page's only live element, added in the latest
    release.
*   **Reason for Rejection**: Rewording meets the tone rule and keeps the
    feature.

### Alternative D2: Keep the ticker's countdown wording and amend the spec

*   **Pros**: No change.
*   **Cons**: Contradicts the product's purpose-not-mortality framing in
    `PRODUCT.md`.
*   **Reason for Rejection**: The framing is a product principle; the label is
    not.

### Alternative E1: World Bank WDI data

*   **Pros**: Matches the source the page claims today; simple API.
*   **Cons**: Omits Taiwan; the latest year lags by one or two years for some
    countries.
*   **Reason for Rejection**: WPP 2024 covers every country in the current list
    with one year.

### Alternative E2: Keep the current numbers

*   **Pros**: No data change for visitors.
*   **Cons**: Provenance unknown; the footnote cannot name a source.
*   **Reason for Rejection**: Fails G3.

### Alternative F: Generate a `src/dataset.js` module instead of fetching the CSV

*   **Pros**: No `fetch`; data loads with the code.
*   **Cons**: Two copies (CSV and module) that a test must keep equal.
*   **Reason for Rejection**: One fetched CSV keeps a single source of truth.
    The page already needs a server for modules.

### Alternative G: Keep the 24-hour Local Storage dataset cache

*   **Pros**: Saves one small request on repeat visits.
*   **Cons**: Delays data fixes by up to 24 hours on top of HTTP caching.
*   **Reason for Rejection**: The 10-minute HTTP cache already covers repeat
    loads.

## Risks & Mitigations

*   **The CSV fetch fails.** The embedded copy is removed on purpose (G3). A
    same-origin fetch failing after `index.html` loaded is rare; the page shows
    "Could not load life expectancy data. Please reload." and keeps Calculate
    disabled.
*   **WPP changes its download URL or column names.** Only regeneration is
    affected, not the live site. The script exits non-zero on any missing
    column, rename key, or value.
*   **A saved v1 country name does not map.** A test checks every v1 name
    against the new dataset. If one still fails, the visitor gets the locale
    default and re-picks once.
*   **The locale guess is wrong.** A bare tag like `en` maximizes to `US`.
    Accepted: the visitor can change the country, and the choice is saved.
*   **Opening from disk stops working.** Documented in README Local Setup.
*   **License change.** The README stated MIT, but no LICENSE file was ever
    committed. PolyForm Strict 1.0.0 applies from this release forward; copies
    taken earlier keep whatever terms applied to them.

--------------------------------------------------------------------------------

## Detailed Implementation

All code, data, page, test, and CI changes ship in **one** feature PR, so the
new CSV, parser, and page change together and `develop` is never broken. Each
module's tests ship in the same PR. Documentation can ship in the same PR or a
following one. After the PR's `test` check has run once, the rulesets are
updated.

### Phase 1: Data

*   **`scripts/build_dataset.py`** (new). Python 3 standard library only.
    *   Downloads
        `https://population.un.org/wpp/assets/Excel%20Files/1_Indicator%20(Standard)/CSV_FILES/WPP2024_Demographic_Indicators_Medium.csv.gz`
        to a temporary directory.
    *   Keeps rows with `LocTypeName == "Country/Area"`, non-empty
        `ISO2_code`, and `Time == "2023"`.
    *   Writes `name,iso2,male,female,total,source,year` with `source =
        "UN WPP 2024"` and `year = 2023`, sorted by `name`.
    *   Rename table (`Location` → `name`):

        | WPP `Location` | Display `name` |
        |---|---|
        | United States of America | United States |
        | Bolivia (Plurinational State of) | Bolivia |
        | Brunei Darussalam | Brunei |
        | Democratic Republic of the Congo | DR Congo |
        | China, Hong Kong SAR | Hong Kong |
        | China, Macao SAR | Macao |
        | China, Taiwan Province of China | Taiwan |
        | Iran (Islamic Republic of) | Iran |
        | Lao People's Democratic Republic | Laos |
        | Micronesia (Fed. States of) | Micronesia |
        | Republic of Moldova | Moldova |
        | Dem. People's Republic of Korea | North Korea |
        | Republic of Korea | South Korea |
        | Russian Federation | Russia |
        | Syrian Arab Republic | Syria |
        | United Republic of Tanzania | Tanzania |
        | Venezuela (Bolivarian Republic of) | Venezuela |
        | Viet Nam | Vietnam |
        | Bonaire, Sint Eustatius and Saba | Caribbean Netherlands |

    *   Exits non-zero if a required column is missing, a rename key matches no
        row, any value is not a finite number, any `name` contains a comma, or
        any `iso2` repeats.
    *   *Why*: G3 and D6 need a reproducible, named source.
*   **`data/lifeexpectancy.csv`** (regenerated, 237 rows).
*   **`specs/lifeexpectancy.csv`** (delete). Third copy of the old data.
*   **`tests/fixtures/v1_countries.txt`** (new). The 192 country names from the
    current `data/lifeexpectancy.csv`, one per line, captured before
    regeneration. *Why*: proves saved v1 forms migrate.

### Phase 2: Modules

*   **`src/config.js`** (new). Exports `DAYS_PER_YEAR = 365.2425`,
    `DATA_URL = 'data/lifeexpectancy.csv'`, `LS_FORM_V1 = 'dop_form_v1'`,
    `LS_FORM_V2 = 'dop_form_v2'`, `LS_LEGACY_KEYS = ['dop_form_v1',
    'dop_data_cache_v1', 'dop_data_cache_ts_v1']`. *Why*: the spec requires
    `DAYS_PER_YEAR` in shared config.
*   **`src/calculator.js`** (new). Exports
    `calculateJourney({ birthDate, lifeExpectancyYears, now = new Date() })`.
    *   `birthDate` is `'YYYY-MM-DD'`, parsed as local midnight with
        `new Date(y, m - 1, d)`.
    *   Throws `RangeError('Enter a valid birth date.')` if the string does not
        match or the date is invalid; `RangeError('Birth date cannot be in the
        future.')` if birth > `now`.
    *   Arithmetic and messages are copied from `index.html` lines 330–341.
        Returns the shape in Proposed Architecture.
*   **`src/countries.js`** (new). Exports:
    *   `ALIASES`, keys lower-case, values ISO2. From `index.html` lines
        211–216: `usa`, `u.s.a.`, `us`, `united states of america` → `US`;
        `uk`, `england` → `GB`; `republic of korea`, `korea, republic of`,
        `south korea` → `KR`; `uae`, `u.a.e.`, `emirates`,
        `united arab emirates` → `AE`; `saudi`, `saudi arabia` → `SA`;
        `viet nam`, `viet-nam` → `VN`. Plus the three v1 names that change:
        `czech republic (czechia)` → `CZ`, `são tomé & príncipe` → `ST`,
        `turkey` → `TR`.
    *   `toIso2(value, dataset)`: trimmed input; if two letters and upper-cased
        it is a dataset code, return it; else a case-insensitive display-name
        match; else `ALIASES[lower-case]` if that code is in the dataset; else
        `null`.
    *   `localeCountry(languages, dataset)`: as in Proposed Architecture;
        `RangeError` from a malformed tag is caught and the tag skipped; returns
        `null` when nothing matches.
    *   `restoreForm({ v2, v1, languages, dataset })`: `v2` and `v1` are the raw
        Local Storage strings or `null`. Returns `{ birthDate, country,
        gender }`:
        *   `birthDate`: from v2, else v1, else `''`.
        *   `country`: v2 code if in dataset; else `toIso2(v1.country)`; else
            `localeCountry(...)`; else `'US'`.
        *   `gender`: from v2, else v1 with `'total'` mapped to `'female'` (the
            current behaviour, `index.html` line 248); else `'male'`.
        *   Malformed JSON is treated as absent.
*   **`src/provider.js`** (new). Exports:
    *   `parseCsv(text)`: splits lines, reads the header, returns
        `Map<iso2, { name, iso2, male, female, total, source, year }>`. Throws
        `Error('Bad dataset')` if the header differs from
        `name,iso2,male,female,total,source,year` or a value is not finite.
    *   `loadDataset()`: `fetch(DATA_URL)`; throws on non-OK; returns
        `parseCsv(text)`.
    *   `lookup(dataset, iso2, gender)`: `{ years: row[gender], country:
        row.name, source: row.source, year: row.year }` or `null`.
*   **`src/ui.js`** (new). Exports `initUi(dataset)`. Contains the DOM code from
    `index.html` lines 198–484, with these changes:
    *   select options from the dataset (value ISO2, text name, sorted by name);
    *   form restored with `restoreForm` and saved as JSON
        `{ birthDate, country, gender }` to `dop_form_v2`; legacy keys
        deleted;
    *   `detectCountry` and the `ipapi.co` call removed;
    *   `escapeHtml` kept and applied to every dataset string written with
        `innerHTML`;
    *   date input `max` set to today's local `YYYY-MM-DD`;
    *   result cleared and ticker stopped on any input change;
    *   ticker and total box omitted when `status` is
        `beyond-average-expectancy`;
    *   labels, footnote, and footer per Proposed Architecture.
*   **`src/main.js`** (new). `loadDataset()` then `initUi(dataset)`. On failure
    shows "Could not load life expectancy data. Please reload." in `#error`
    and leaves Calculate disabled. Sets the footer year in both cases.
*   **Delete** (0-byte stubs, G1): `src/__tests__/calculator.test.ts`,
    `src/components/App.tsx`, `src/config.ts`, `src/lib/calculator.ts`,
    `src/main.tsx`, `src/providers/expectancyProvider.ts`,
    `src/setupTests.ts`, `src/styles.css`, `src/utils/countryAliases.ts`,
    `src/vite-env.d.ts`, `tsconfig.json`, `public/index.html`,
    `public/data/life_expectancy_seed.csv`, and `public/llms.txt` (a duplicate
    of `llms.txt`; Pages serves the root, not `public/`).

### Phase 3: Page

*   **`index.html`** (modify).
    *   Replace the inline `<script>` (lines 188–486) with
        `<script type="module" src="src/main.js"></script>`.
    *   CSS: define the token table in `:root` and in
        `@media (prefers-color-scheme: light)`. Replace hard-coded `#15191b`,
        `#fff`, `#ffffff`, `#f5f7f9`, `#182022`, and the `.suggestions` rules
        (dead since fuzzy search was removed). Replace `opacity` on
        `.tag`, `#form-desc`, `.stat .label`, `.stat .precise`, `.cd-lbl`,
        `.cd-total-lbl`, `.cd-sep`, `.result-head p`, `.note`, and `footer`
        with `color: var(--muted)`. `.calc-btn` uses `color: var(--on-accent)`.
        Inputs use `--field-border`; tiles and insets use `--hairline`.
    *   Footer: disclaimer unchanged; copyright line per Proposed Architecture
        with `<span id="year">2025</span>`.
    *   JSON-LD factual corrections: `featureList` "Auto-detect country via
        geolocation" → "Suggests your country from your browser language";
        "Supports 190+ countries with WHO/World Bank data" → "Supports 237
        countries and areas with UN World Population Prospects 2024 data"; FAQ
        answer "WHO/World Bank data" → "UN World Population Prospects 2024
        estimates".

### Phase 4: Tests and CI

*   **`package.json`** (rewrite; currently 0 bytes):
    `{ "name": "daysonpurpose", "private": true, "type": "module",
    "scripts": { "test": "node --test" } }`.
*   **`tests/calculator.test.js`** (new). Fixed `now`; values compared with
    `Math.abs(a - b) < 0.01`.
    *   Remaining 1.00 year: days 365.2425, weeks 52.1775, months 12.
    *   Japan female, LE 88.00, birth `'1990-01-01'`, `now = birthMs + 40 ×
        365.2425 × 86 400 000`: years 48.00, months 576.00, weeks 2504.52,
        days 17531.64.
    *   Age 90, LE 80: all zero, `beyond-average-expectancy`, celebratory
        message.
    *   Future date and `'not-a-date'` throw `RangeError`.
*   **`tests/provider.test.js`** (new). Inline CSV: `parseCsv` round-trip;
    bad header throws; `lookup` returns the gender value; unknown code returns
    `null`.
*   **`tests/countries.test.js`** (new). Fixture dataset with `US`, `GB`, `FR`.
    *   `localeCountry(['en-GB'], ds)` → `GB`; `['en']` → `US`;
        `['en_US', 'fr-FR']` → `FR`; `[]` → `null`.
    *   `toIso2('U.S.A.', ds)` → `US`.
    *   `restoreForm`: valid v2 used; v2 code not in dataset → locale default;
        v1 `{country: 'USA', gender: 'total'}` → `US`, `female`; malformed JSON
        → defaults.
*   **`tests/dataset.test.js`** (new). Reads `data/lifeexpectancy.csv`: header
    exact; 237 rows; unique ISO2; every value finite and within 40–95
    inclusive; no comma in any name; every name in
    `tests/fixtures/v1_countries.txt` resolves via `toIso2` to a code in the
    dataset.
*   **`tests/privacy.test.js`** (new). Fails if any `src/*.js` file contains
    `http://` or `https://`.
*   **`.github/workflows/test.yml`** (new). On `pull_request` to `develop` and
    `main`: checkout, `actions/setup-node` with Node 22, `npm test`. Job id and
    name `test`.
*   **Repository rulesets** (GitHub settings). Add the `test` check (GitHub
    Actions app) to the required status checks of the `main` and `develop`
    rulesets.

### Phase 5: Documentation

*   **`LICENSE`** (new). PolyForm Strict 1.0.0 text, as in the owner's
    `wordstake` repository, with "Required Notice: Copyright (c) 2025 Richard
    Crane".
*   **`README.md`** (modify).
    *   Key Features: "No Dependencies" → "No build or runtime dependencies";
        "Fallback Dataset" bullet removed; add "Private: no data leaves your
        browser".
    *   Local Setup: serve the folder (Live Server port 5501 or
        `python3 -m http.server`).
    *   Architecture and Tech Stack: the real files; "HTML, CSS, JavaScript ES
        modules; no build".
    *   New sections: Tests (`npm test`, Node 22+), Data
        (`python3 scripts/build_dataset.py`), Branching
        (`feature/*` → `develop` → `main`).
    *   License: PolyForm Strict 1.0.0.
    *   Footer block (MILL5, VS Code, GitHub, MVP) unchanged.
*   **`llms.txt`** (modify). URL → GitHub Pages URL; data source → UN WPP 2024,
    2023 estimates; country count → 237; "auto-detected via IP geolocation" →
    "suggested from browser language"; Fallbacks line removed; Docs link →
    `https://chiefinnovator.github.io/daysonpurpose/specs/days_on_purpose_spec.md`
    (Pages serves `.md` files as-is when no Jekyll front matter is present).
*   **`specs/days_on_purpose_spec.md`** (modify) per D7: Inputs (gender),
    Data Source (WPP 2024, CSV schema, lines 11–22), Output JSON (source,
    remove `fallback_used`, line 46 and 61), Testing (tests 2–4, lines
    101–103), Validation (remove `total` default and global fallback, lines
    91–92), Accessibility & Tone (ticker rule), Implementation Notes (caching
    and run command, lines 110–111, 114), Lovable section (gender list and 24h
    cache, lines 132 and 139).
*   **`AGENTS.md`** (modify). Add "Code layout" (modules; only `ui.js` and
    `main.js` touch the DOM), "Tests: `npm test`", and "Data changes only via
    `scripts/build_dataset.py`".

### Intentionally unchanged

`og-image.png`, `scripts/make_og_image.py`, `.vscode/settings.json`,
`.gitignore`, `.claude/settings.json`, `.github/workflows/branch-policy.yml`,
`specs/userinterface example.png`, `PRODUCT.md`, `DESIGN.md` (refreshed after
the Impeccable review).

--------------------------------------------------------------------------------

## Non-Functional Requirements

*   **Privacy**: The page requests only same-origin files (`index.html`,
    `src/*.js`, `data/lifeexpectancy.csv`). `tests/privacy.test.js` enforces
    this for `src/`.
*   **Performance**: Six small modules and a CSV of about 11 KB, all
    same-origin, no framework. The old page carried about 6 KB of inline data.
*   **Rollout**: Merging `develop` → `main` publishes. Saved v1 forms migrate on
    first load.
*   **Rollback**: Revert the release through a `feature/*` → `develop` → `main`
    PR pair. The old page ignores `dop_form_v2`, so visitors see its defaults
    once.

## Additional Resources

*   [`specs/days_on_purpose_spec.md`](../../specs/days_on_purpose_spec.md):
    product spec.
*   [`PRODUCT.md`](../../PRODUCT.md) and [`DESIGN.md`](../../DESIGN.md):
    Impeccable product and design context.
*   UN World Population Prospects 2024:
    `https://population.un.org/wpp/`.
*   Review record: `docs/designs/reviews/` (Goldfish stage reports).
