# Stage 9 — Implementation Readiness Test (DetailedRange 410–595)

Reviewers: egm-implementation-readiness (implementation-readiness-standard), egm-codebase-details (implementation-readiness-standard), egm-style. All three completed.

## Reviewer: egm-implementation-readiness

**Implementation Readiness Review: `/Users/rich/.openclaw/projects/daysonpurpose/docs/designs/days-on-purpose-v2.md`, lines 410–595**

I read the persona, the standard and the full target. I also checked the target against `index.html`, `specs/days_on_purpose_spec.md` and the repository file list. The review is complete.

**Verdict:** Not ready. 3 Blockers, 9 Majors, 5 Nits. If the plan is followed literally, one test fails, light-mode contrast (G6) fails, and the claim that each step leaves the site working is false.

---

### 🔴 Blockers

**B1. One expected test value is wrong (line 515)**
- The plan says Japan female 88.00 at age 40.00 gives "≈2501.64 weeks". The arithmetic is 48 × 365.2425 = 17531.64 days, and 17531.64 / 7 = **2504.52** weeks.
- The error comes from `specs/days_on_purpose_spec.md:101`. The plan copies it without checking.
- The implementer then has to choose: fail the test, change the arithmetic, or overrule the spec.
- **Fix:** state 2504.52, set a tolerance (see N3), and fix the spec's Testing section in Step 5.

**B2. The button-text fix fails in light mode (lines 312–313, 491–495)**
- `.calc-btn` gets `color: var(--bg)`. The same step redefines `--bg` for light mode, so in light mode the button text becomes a light colour on teal `#2fb8a4`. That is about the same 2.5:1 failure the plan sets out to fix.
- **Fix:** use a separate fixed token (for example `--on-accent: #0f1214`) that the light-mode block does not change.

**B3. Light-mode colours are left to the implementer, and accent-coloured text is not covered (lines 491–495)**
- The plan sets a contrast target ("at least 4.5:1 … 3:1 for borders") but gives no hex values for light-mode `--bg`, `--panel`, `--card`, `--border` or `--text`. Choosing a palette is a design decision, which the Zero-Decision Rule does not allow, and the Non-Goals say visual work is limited.
- It also does not say what replaces `#222a2c` (the `.suggestions` hover at `index.html:114`). That selector looks dead, since the "fuzzy search" was removed at `index.html:207`. The plan should say whether to delete it.
- The plan never mentions `color: var(--accent)` text: `.stat .value`, `.cd-val`, `.cd-total-val` and `.cd-sep` (`index.html:127–136`). Teal `#2fb8a4` on white or `#f5f7f9` is about 2.5:1, which fails even the 3:1 large-text threshold. So CUJ 5 and G6 fail.
- **Fix:** give exact light-mode values for every token, including a darker light-mode accent for text, together with their measured contrast ratios.

---

### 🟡 Major

**M1. The step order breaks the site after Step 1 (lines 412–414, 416–434)**
- Step 1 commits the new CSV schema (`kind,name,iso2,…`) while the old parser is still live.
- `index.html:275–281` reads `parts[1]` ("United States", "World") as `male`. `Number()` gives NaN, so every row is skipped. The fetch still succeeds, so the embedded fallback never runs, and the country dropdown is empty.
- Step 2 adds modules that nothing loads, and no tests arrive until Step 4.
- This contradicts "each PR leaves the site working" and the standard's rule on phases.
- **Fix:** merge Steps 1–3 into one PR, or ship the new CSV under a new path until Step 3. Also move each module's tests into the step that creates the module.

**M2. The build script's input and rename table are not fully specified (lines 418–431)**
- The plan never names the source columns for male, female and total (in WPP these are `LExMale`, `LExFemale` and `LEx`), or the `ISO2_code`, `LocID`, `ParentID` and `LocTypeName` values the script relies on.
- The rename table lists display names only, not the exact WPP strings to match (for example "Bolivia (Plurinational State of)").
- "Czechia" and "Türkiye" appear in the list of 20 names that "differ", yet they are used as WPP publishes them, so they are not renames. The real table has 18 entries, and the wording contradicts itself.
- WPP names that are not renamed include commas ("China, Macao SAR", "Bonaire, Sint Eustatius and Saba"). The plan does not mention this.
- The script fails on missing values but not on a rename key that matches nothing, so a typo slips through silently.
- **Fix:** list the exact `wpp_name → display_name` pairs, name the source columns, and make an unmatched rename key a fatal error.

**M3. `parseCsv` does not say how to handle quoted fields (lines 459–462)**
- Following from M2, the output CSV will contain quoted fields with commas. The current parser uses `line.split(',')`.
- The plan only says "numbers parsed with `Number`". It does not say whether `parseCsv` must handle RFC 4180 quoting, or whether the script must avoid commas in names.
- **Fix:** pick one, and add a provider test row with a quoted name.

**M4. `ALIASES` is not enumerated (lines 450–453)**
- Both maps end in "…". `tests/dataset.test.js` (line 528) asserts that "every v1 country name in `ALIASES` resolves", so the full set of v1 names has to be defined.
- The plan should list every old v1 name that differs from its new display name (from the comparison in M2), plus every existing alias key from `index.html:211–216`.
- It should also say whether the "exact ISO2 match" in `toIso2` is case-sensitive, since the `'us'` alias overlaps it.

**M5. `lookup` does not return the data the footnote needs, and fallback wording is incomplete (lines 254–255, 314–316, 459–464)**
- `lookup` returns `{ years, country, source, year, fallback }`, but the footnote "Using the Northern America average" needs the region name, which is not returned.
- No footnote wording is given for `country-total` or `global`.
- For the `global` case, the value of `country` is undefined.
- The spec (line 22) requires `fallback_used` in the output. The new `calculateJourney` drops its `fallback` parameter and returns "the existing object minus `inputs`", which still includes `fallback_used`, but there is now no input to fill it.
- The replacement for the `data_source` value 'Bundled CSV (cached 24h)' is not stated.
- **Fix:** add `regionName` to the return value, give exact footnote strings for all three fallbacks, and state who sets `fallback_used` and `data_source`.

**M6. The v2 form schema and migration rules are undefined, and migration has no tests (lines 284–286, 466–472)**
- The plan never defines the shape of `dop_form_v2`. Presumably it is `{ birthDate, country: ISO2, gender }`, but that has to be stated.
- It does not say how the old gender `'total'` is migrated. Today `index.html:248` maps it to `female`.
- It does not say what happens when `toIso2` returns `null` for a v1 name (drop the country, or use the locale default).
- All of this logic sits in DOM-bound `ui.js` with no test.
- **Fix:** put it in a pure `migrateForm(v1Json, dataset)` in `countries.js` and test it.

**M7. One label is missed by the D2 wording rule (lines 300–304, 496)**
- The plan rewords the ticker `aria-label` and the visible "total seconds remaining" label.
- It leaves out `aria-label="Total seconds remaining"` on `.cd-total` (`index.html:360`). Following the plan literally ships ARIA text containing "remaining", which breaks D2.
- **Fix:** give the replacement string.

**M8. The `localeCountry` tests do not match its signature (lines 287–290, 456–457, 522–524)**
- The function is `localeCountry(languages, dataset)`, and "first code present in the dataset wins". The tests call `localeCountry(['en-GB'])` with no dataset.
- The plan should say which fixture dataset the tests use (it must contain GB, US and FR), and whether `dataset` is optional.

**M9. The test command may not work on Node 22 (lines 322–323, 512)**
- Since Node 21, positional arguments to `node --test` are treated as glob patterns, and a bare directory argument is reported not to be expanded the way it was on Node 20. I have medium confidence here, and it should be checked on Node 22.
- **Fix:** use `node --test "tests/*.test.js"` or plain `node --test`.

---

### 🟢 Nits

- **N1 (lines 273–277, 446, 307–308):** The type of `birthDate` (`'YYYY-MM-DD'` string or `Date`) is not stated. The current code parses it as UTC midnight (`index.html:326`), but the date input's `max` is today's *local* date. In UTC+ time zones, a birth date of "today" passes the `max` check and then throws `RangeError`. The plan should pick one convention.
- **N2 (lines 275, 446):** The `RangeError` message for an unparseable date is not given. Only the future-date message is.
- **N3 (lines 514–516):** "≈" needs a numeric tolerance, for example `Math.abs(a-b) < 0.01`. The plan should also say how the test builds a birth date and fixed `now` that give age exactly 40.00. It must be `birth + 40 × 365.2425 days`, which is not midnight-aligned.
- **N4 (lines 473–475):** `main.js` calls `initUi()` with no arguments, but the signature is `initUi(dataset, env)`. On load failure the footer year is never set, because that happens inside `initUi`.
- **N5 (line 551):** The "GitHub Pages spec URL" for `llms.txt` is not given. Pages runs Jekyll by default, so it is unclear whether the target is `.md` or rendered `.html`.

---

### Confirmed accurate
- The inline script spans `index.html` lines 188–486.
- The delete list matches the repository, including `public/llms.txt`.
- `AGENTS.md`, `README.md`, `llms.txt` and `.github/workflows/branch-policy.yml` exist.
- `/Users/rich/.openclaw/projects/wordstake/LICENSE` exists as the PolyForm source.

## Reviewer: egm-codebase-details

**Verdict: not ready.** I found 3 blockers, 9 major issues and 7 nits in lines 410–595 of `/Users/rich/.openclaw/projects/daysonpurpose/docs/designs/days-on-purpose-v2.md`.

I read the persona, the standard and the design doc, and checked every claim against the repository. Most references check out:
- The inline script is at `index.html` lines 188–486.
- Every `src/*` stub, `package.json`, `tsconfig.json` and `public/` placeholder is 0 bytes, except `public/llms.txt`, which is an exact duplicate of `llms.txt`.
- The `dop_*` storage keys, the `#15191b`/`#222a2c` colours, the JSON-LD strings, `#error`, `detectCountry` and the Live Server port 5501 are all as described.
- The `wordstake` LICENSE is PolyForm Strict 1.0.0.

Proposed new files are not counted as defects. Every file entry is marked new, modify, delete, rewrite or regenerated.

## 🔴 Blockers

**1. Lines 412–414 and 416–434: Step 1 breaks the live site, contradicting "each PR leaves the site working".**
- Step 1 rewrites `data/lifeexpectancy.csv` to `kind,name,iso2,parent,…` while `index.html` still has the old parser until Step 3.
- That parser (`index.html` lines 272–283) reads `parts[0..3]` as `country,male,female,total`. With the new schema, `Number(name)` is `NaN`, so every row is skipped.
- The embedded copy is not used, because it is only a fallback when the fetch fails (lines 265–268). The fetch succeeds.
- The result is an empty dataset and an empty country dropdown. Line 288 then writes that empty dataset to Local Storage for 24 hours.
- Fix: either change data and parser in the same PR, or write the new schema to a new path.

**2. Line 515: the test oracle "≈2501.64 weeks" is wrong.**
- 17531.64 / 7 = 2504.52.
- The error is copied from `specs/days_on_purpose_spec.md` line 101.
- An implementer will either write a failing test or "fix" the code to match a wrong value.
- Line 552 does not list this spec correction either.

**3. Lines 312–313 and 492–493: `.calc-btn { color: var(--bg) }` fails WCAG AA in light mode.**
- Step 3 redefines `--bg` in the light-mode block. The button text then becomes the light background colour on teal `#2fb8a4`, about 2.5:1, which is the defect G6 is meant to fix.
- The "above 7:1" claim only holds for the dark value `#0f1214`.
- The button colour must be a fixed dark value, or a separate custom property that light mode does not override.

## 🟡 Major

**4. Lines 418–430: the rename table is not fully specified, so the implementer has to make decisions.**
- Only "United States", "Taiwan" and "South Korea" (lines 239–241) have both a source and a target name.
- For the other 17 listed names, neither the WPP source string nor the display string is given (for example, is "Democratic Republic of the Congo" shown as "DR Congo"?).
- Czechia and Türkiye are listed as renames, but their display name equals the WPP name, so they are v1 differences, not table entries. Those are two different lists.
- The claim that these 20 are "the" names differing from WPP cannot be checked from the repo. Watch v1 `Netherlands` (`data/lifeexpectancy.csv` line 122): UN M49 now uses "Netherlands (Kingdom of the)". If WPP 2024 uses that name, saved v1 forms with Netherlands won't migrate, and no test catches it (see item 10).

**5. Line 459: CSV quoting is not specified.**
- Several WPP names that are not in the rename table contain commas, for example "China, Macao SAR" and "Bonaire, Sint Eustatius and Saba".
- Python's `csv` writer will quote those fields. The current parser (`index.html` line 273, `line.split(',')`) does not handle quotes.
- The plan says the parsing logic is "moved", and `parseCsv` has no quoting rule.
- Pick one: RFC 4180 parsing in `parseCsv`, or a script rule that rejects or renames any name containing a comma.

**6. Lines 443–447 vs. 273–278: `calculateJourney`'s return shape contradicts itself and the code.**
- The current return (`index.html` line 342) includes `life_expectancy_years`, `age_years` and `fallback_used`.
- "Existing object minus `inputs`" keeps `fallback_used`, but the new signature has no fallback parameter to fill it.
- Line 277 lists a different shape again (`journey`, `status`, `end_timestamp_ms`, `message`).
- The type of `birthDate` (an ISO string with `T00:00:00Z` appended, as now, or a `Date`) is not stated.
- The current code already rejects future dates (`index.html` line 329, `Error('Invalid birth date')`). So "Adds RangeError" is a change of error type, not a new check. The error for an unparseable date is unspecified at line 446, while line 275 says `RangeError`.

**7. Lines 300–302 and 496: the ticker relabelling misses an ARIA label that breaks D2.**
- `index.html` line 360 has `aria-label="Total seconds remaining"` on `.cd-total`. The plan rewords only the line 354 aria-label and the line 362 visible text.
- D2 (line 115) bans "remaining" in ARIA text.
- `role="timer"` also stays, which is arguably still countdown semantics. That one is a judgment call.

**8. Lines 491–495: light-mode CSS is incomplete and leaves colour choices to the implementer.**
- No light-mode values for `--bg`, `--panel`, `--card`, `--border` or `--text` are given.
- The existing light block (`index.html` line 150) hard-codes `#f5f7f9`, `#182022` and `#fff` on body, stat, inputs and suggestions. The plan doesn't say to remove these or move them to variables.
- Accent-coloured text (`.stat .value`, `.cd-val`, `.cd-sep`, `.cd-total-val`, lines 127–136) would be teal on a light background, about 2.5:1.
- `.error` uses `--danger: #f87171`, under 3:1 on white.
- Labels use opacity 0.55–0.65 (lines 126–139).
- All of these fail G6 and CUJ 5. The plan only sets a target ratio.

**9. Lines 466–472: `ui.js` drops existing edge-case handling without saying so.**
- `restoreForm` maps the legacy saved gender `'total'` to `'female'` (`index.html` lines 246–249). The migration description omits this. A v1 form with `total` would leave the gender select empty and Calculate disabled.
- `escapeHtml` (lines 222–232) is not mentioned, and the footnote (line 378) puts country names into `innerHTML` unescaped. This matters more now that names like "São Tomé & Príncipe" come from an external source.

**10. Line 528: the dataset test cannot verify v1 migration.**
- "Every v1 country name in `ALIASES` resolves" only covers names that changed.
- The 192 v1 names are deleted with `EMBEDDED_CSV` and `specs/lifeexpectancy.csv`, so nothing checks that unchanged v1 names still match a display name exactly.
- Fix: commit the v1 name list as a test fixture, or check all of them once in the script.

**11. Lines 323 and 512: the test script `node --test tests/` may not work on Node 22.**
- Since Node 21, `--test` arguments are glob patterns, and passing a bare directory has been reported to fail rather than search it.
- Use `node --test` with no argument, or `"node --test tests/*.test.js"`.
- Verify this on Node 22 before relying on it.

**12. Lines 541–557: the README and spec edits leave false statements in place (G1).**
- README line 13 ("Fallback Dataset: Automatically switches to an embedded dataset") and line 9 ("zero-dependency web application") are not addressed. The embedded dataset is being removed.
- The spec still says to cache the dataset for 24 hours (spec lines 110 and 139), still shows gender `female/male/total` in the Lovable section (line 132), and still names a "World Bank WDI" source in the JSON example (line 46).
- The edit list at line 552 covers none of these. Neither the old provider schema (lines 14–15) nor the seed-CSV note (line 114) is clearly covered by "Data Source → UN WPP 2024 with the CSV schema".

## 🟢 Nits

**13. Lines 522–524: `localeCountry` tests call it without the required `dataset` argument** (the signature at line 456 takes `(languages, dataset)`). Also, `'zz-invalid'` is a well-formed tag (`invalid` is a valid 7-character variant), so `new Intl.Locale` won't throw and the `RangeError` skip path at line 456 is never tested. Use a tag that is actually malformed, such as `'en_US'` or `'-'`.

**14. Line 307 and lines 444–446: the date picker and the calculator can disagree.** The `max` is set to the local date, but the calculator parses the birth date as UTC midnight. For a visitor ahead of UTC in the early hours, picking today's local date gives birth > now, which raises `RangeError` even though the input allowed it.

**15. Lines 314–316: footnote wording is given only for the region fallback.** The `country-total` and `global` wording, and the `country` value `lookup` returns for the global case, are unspecified.

**16. Line 460: "rows … kept but marked" doesn't say how they are marked.**

**17. Lines 533–535: the ruleset IDs 26358967/26358968 can't be verified from the repo.** `integration_id: 15368` is the GitHub Actions app ID, which is correct.

**18. Lines 230 and 432: the row counts can't be checked without the WPP file.** "237 rows" and "about 270 rows" are unverifiable here; fine to keep as estimates.

**19. Outside the target range, line 377: the claim is false.** The doc says removing the ticker "loses the most visible element of … the og-image". `og-image.png` shows four stat tiles and no ticker. Also, `scripts/make_og_image.py` line 65 says "Calculate your remaining purpose-days", which the unchanged-on-purpose list (lines 564–566) keeps. The same "remaining" wording stays in the `index.html` meta description and keywords (lines 9–10, 18, 30, 41) and in the FAQ answer (line 81, "computes your remaining years"). These are not strictly D2's "visible or ARIA" text, but they go against the tone G7 aims for.

## Reviewer: egm-style

The style review of lines 410–595 is complete. Most of the section is already plain and factual. I found 2 Blockers, 5 Majors and 9 Nits. Two of the findings are factual errors rather than wording, but both affect whether someone can build from the document, so I've included them.

## Blockers

**1. Wrong expected value in a test (line 515)**
- **Discrepancy:** The test for "Japan female 88.00 at age exactly 40.00" expects "≈2501.64 weeks". In `/Users/rich/.openclaw/projects/daysonpurpose/index.html` (lines 334–335), weeks are calculated as `days / 7`. The document's own day figure is 17531.64, and 17531.64 / 7 = 2504.52.
- **Rationale:** An implementer copying this number writes a test that fails against the correct code, or changes correct code until the test passes. Change it to `≈2504.52 weeks`.

**2. Module count does not match the list (line 576)**
- **Discrepancy:** The Performance line says "Five small modules". Step 2 creates six: `config.js`, `calculator.js`, `countries.js`, `provider.js`, `ui.js` and `main.js`.
- **Rationale:** A non-functional requirement gives a number its own plan contradicts. Change it to "Six".

## Majors

**3. "for clarity" gives the wrong reason (line 467)**
- **Discrepancy:** "`env` carries `storage`, `languages`, and `now` for clarity, defaulting to browser globals."
- **Rationale:** Passing in browser globals like this is done so the code can be tested with stand-ins, not for clarity. The phrase gives a vague reason in place of the real one. Use "so tests can inject them", or delete the phrase.

**4. "marked" does not say how (lines 461–462)**
- **Discrepancy:** "rows with non-finite values kept but marked so lookup falls back".
- **Rationale:** "Marked" does not name a field or a value. Someone implementing `parseCsv` and `lookup` separately has to invent the mechanism. Name it, for example: "stored with the non-finite field as `null`; `lookup` treats `null` as missing".

**5. "moves … as today" contradicts itself (line 496)**
- **Discrepancy:** "Ticker markup moves into `ui.js` as today".
- **Rationale:** "Moves" says the location changes; "as today" says it does not. The markup is currently built inside the inline script, so it is moving from the inline script to `ui.js`. Say exactly that: "Ticker markup stays JS-generated, now in `ui.js`; labels per D2."

**6. Browser support is not stated in checkable terms (lines 585–586)**
- **Discrepancy:** "`AbortSignal`-free `fetch` are supported in all current evergreen browsers."
- **Rationale:** "All current evergreen browsers" cannot be checked, and "`AbortSignal`-free `fetch`" is a made-up term (plain `fetch` is what is meant). Give minimum versions, for example "Chrome/Edge ≥ N, Firefox ≥ N, Safari ≥ N", based on when `Intl.Locale.prototype.maximize` became available. Drop the `AbortSignal` qualifier.

**7. "A test cannot enforce this" is not true as written (lines 574–575)**
- **Discrepancy:** "A test cannot enforce this; review of `src/` for `fetch` and absolute URLs is the check."
- **Rationale:** A static test that scans `src/*.js` for absolute URLs is easy to write. The sentence states a judgment as fact. Either reword it ("Enforced by code review, not by tests") or add the static test to Step 4.

## Nits

**8. The rename table annotates names inconsistently (lines 424–429)**
- **Discrepancy:** It mixes "Czech Republic (Czechia) (renamed to "Czechia")" and "Turkey (WPP: "Türkiye"; display "Türkiye")", while the other 18 names have no note. "The 20 current names" is also unclear: current display names, or current dataset keys?
- **Rationale:** Use one format, such as a two-column table of current name and WPP name. State that, unless noted, the current name is kept for display.

**9. "the constant" is unclear (line 441)**
- **Discrepancy:** "spec requires the constant in shared config".
- **Rationale:** Five constants are listed just before it. Name the one meant: `DAYS_PER_YEAR`.

**10. Approximate values are written two ways (lines 407, 432, 576–578)**
- **Discrepancy:** "about 20 KB", "about 270 rows" and "about 14 KB" sit beside "~20 KB", "~6 KB" and "31 KB".
- **Rationale:** Pick one style. "About" reads better in prose.

**11. "≈" in a test has no tolerance (lines 515–516)**
- **Rationale:** An expected value in a test needs a tolerance, for example "to 2 decimal places". Without one, implementers will choose different comparisons.

**12. Ranges and terms in the test lists are loose (lines 520, 523, 527–528)**
- **Discrepancy:**
  - "country with no numbers" uses a different term from "non-finite values" in line 461.
  - "(maximize)" does not explain itself.
  - "between 40 and 95" does not say whether 40 and 95 are included.
  - "every v1 country name in `ALIASES` resolves" does not say what it resolves to.
- **Rationale:** Say "resolves via `toIso2` to an ISO2 present in the dataset", state whether the range is inclusive, and use one term for missing values.

**13. "becomes true" reads as casual (line 549)**
- **Discrepancy:** "Privacy line stays and becomes true".
- **Rationale:** Use neutral wording: "Privacy line is unchanged; after this change it is accurate."

**14. Casual heading (line 562)**
- **Discrepancy:** "Unchanged on purpose".
- **Rationale:** Use "Intentionally unchanged" or "Out of scope (no changes)".

**15. Heading levels and link formats are inconsistent (lines 589, 592–593)**
- **Discrepancy:** "Additional Resources" is a level-3 heading, which puts it under Non-Functional Requirements. The UN source appears as "population.un.org/wpp" with no scheme, while line 420 gives the full URL.
- **Rationale:** Raise it to a level-2 heading and use the full URL.

**16. "this is documented" does not say where (line 587)**
- **Discrepancy:** "Opening the file from disk no longer works; this is documented."
- **Rationale:** Name the location: "see README Local Setup (Step 5)".
