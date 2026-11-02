# Stage 5 — Initial Zoom Out Review

# Zoom-Out Review: days-on-purpose-v2.md

**Verdict: passes with 2 Major findings, no Blockers.** Both Majors are fixed by changing scope or sequencing; the architecture can stay as it is.

Target: `/Users/rich/.openclaw/projects/daysonpurpose/docs/designs/days-on-purpose-v2.md` (lines 1–595). I read the persona, the standard and the full target. To check its claims I also read `index.html`, `README.md`, `llms.txt`, `public/llms.txt`, `AGENTS.md`, `specs/days_on_purpose_spec.md` and `.github/workflows/branch-policy.yml`. The claims I checked in Problems 1–9 match the repository, including the 0-byte stubs, the `ipapi.co` call at `index.html:461`, the US-as-"default-global" fallback at `index.html:317`, the hard-coded `sourceYear: 2023`, and the MIT claim with no LICENSE file.

**Context sufficiency:** Pass. The objective (make the repo truthful, the privacy claim honest, the dataset single-sourced, and the logic testable, while staying a no-build Pages site) and the reasons for it are clear.

---

## Major

**M1. The region fallback and its data are unreachable by construction (YAGNI).**
- **Where:** lines 229–236, 252–269, 423–430, 459–465, 518–521, 525–528
- **Problem:** Lookup step 3 ("country row found, gender and total both missing → parent region") applies only when a country row has non-finite values. But the build script exits non-zero in exactly that case (lines 429–430), and `dataset.test.js` asserts every country has finite `male`, `female` and `total` (lines 526–527). Step 2 (`country-total`) is unreachable for the same reason. Step 4 is reached only through a stale saved ISO2 code (line 267).
- **Cost:** The design adds a `parent` column, about 30+ `kind=region` rows, a "parent has a region row" build check and test, "kept but marked" non-finite parsing in `parseCsv`, a region branch in `lookup`, and region footnote text ("Using the Northern America average"). None of it can run in production. It exists only to satisfy the spec's fallback list. And the spec's region rule was for a *missing* country (spec line 20), which the design itself says can't use a region (lines 264–265). So it doesn't even satisfy the spec's intent.
- **Simpler option:** Keep `country` rows plus one `world` row. `lookup` becomes "country value, else world" (keep `country-total` only if spec test 3 must stay). Amend the spec's fallback section the same way the design already amends gender and tone. G4 is still met.

**M2. The step order breaks the "each PR leaves the site working" claim (line 413–414).**
- **Where:** lines 412–434 (Step 1) against 486–490 (Step 3)
- **Problem:** Step 1 rewrites `data/lifeexpectancy.csv` to `kind,name,iso2,parent,male,…`. The current inline parser (`index.html:273–282`) reads columns by position. It would treat `name` as the male value, `Number("United States")` gives NaN, and every row gets skipped. The page then has an empty dataset, which it writes to Local Storage for 24 hours (`index.html:288`). The embedded fallback doesn't help because it only fires when the fetch *fails*, not when parsing yields zero rows.
- **Impact:** `develop` is broken between Step 1 and Step 3. If `develop` → `main` is promoted in that window, production shows an empty country list, cached for a day.
- **Fix:** Land Steps 1–3 as one feature PR, or have Step 1 write to a new path that only `src/provider.js` reads. Either is a one-line change to the plan.

---

## Nit

**N1. Alias normalization has no live input path after D3.**
- **Where:** lines 449–455, 519–520, 528
- **Problem:** Country input is a `<select>` (fuzzy search was already removed, `index.html:207`), and `ipapi.co` is gone. So `ALIASES`/`toIso2` serve only the v1 saved-form migration and spec test 4 ("U.S.A." → US), which tests a path no user can reach.
- **Suggestion:** Scope `ALIASES` to "v1 names that changed" for migration, and amend spec test 4 rather than keep a general alias map alive for it.

**N2. The v1 → v2 storage-key migration is more machinery than a 3-field form needs.**
- **Where:** lines 282–294, 440–441
- **Problem:** `toIso2` already tries ISO2, then display name, then alias.
- **Suggestion:** Keep one key, store ISO2 going forward, and pass whatever is restored through `toIso2`. That removes `LS_FORM_V2`, the write-back/delete step and a migration branch. The worst case is that a user re-picks a country once.

**N3. Speculative injection points nothing uses.**
- **Where:** lines 462, 466–467
- **Problem:** `initUi(dataset, env)` with `env` injected "for clarity", and `loadDataset(fetchFn = fetch)`. The test plan (lines 513–528) imports neither `ui.js` nor `loadDataset`.
- **Suggestion:** Drop both parameters until a test needs them.

**N4. Text left over from before the decisions were taken.**
- G2 (line 80–81) says "Either no third-party request… or every privacy statement names it". D3 already decided: none.
- CUJ 1 (line 147–148) says "unless the privacy text discloses it". Same issue.
- CUJ 3 (line 164) says "The ticker, if kept". D2 already kept it.
- **Suggestion:** Restate these as the decided outcomes so the goals and the plan don't read as still open.

**N5. CUJ 2 overpromises.**
- **Where:** line 155–156 against 248–250
- **Problem:** CUJ 2 says a new dataset version is used "without waiting for a cache to expire". The plan relies on the GitHub Pages HTTP cache, which still means waiting out its max-age.
- **Suggestion:** Reword CUJ 2 to "within the Pages cache lifetime".
- **Related:** The spec amendments in Step 5 don't touch "Cache life expectancy dataset in memory or Local Storage" or "cache expectancy dataset for 24h" (spec lines 110, 139). Those now contradict the design.

**N6. The rename-table list is self-contradictory and too low-level.**
- **Where:** lines 238–242, 423–428
- **Problem:** The list says "20 current names that differ from WPP". Two of them (Czechia, Türkiye) are not renamed; the current display names change to WPP's. Also, the list sits partly in the Technical Plan, which is the wrong altitude for a name-by-name list.
- **Suggestion:** State the rule ("short display names for long UN names; v1 names that change are aliased for migration") and leave the list to the script.

**N7. Prefer the platform default test runner invocation.**
- **Where:** lines 323, 512
- **Problem:** I believe, but haven't confirmed, that `node --test tests/` may not find tests on Node 22, because newer Node treats test arguments as glob patterns rather than directories.
- **Suggestion:** Plain `node --test` already discovers `**/*.test.js` by default. That is simpler and avoids the risk.

**N8. Operational IDs in a design doc.**
- **Where:** lines 532–535
- **Problem:** The ruleset IDs `26358967`/`26358968` and `integration_id: 15368` are setup details that will go stale.
- **Suggestion:** "Add `test` as a required check on the `main` and `develop` rulesets" is enough at this altitude.

---

## Reuse and alignment

- No existing JS utilities in the repo duplicate the proposed modules. All current logic is the inline IIFE, and the `src/` files are empty.
- The design reuses the PolyForm license text from `wordstake` (which has a `LICENSE`) and keeps the existing `branch-policy.yml` pattern.
- Rejecting Vite/React (Alternative B) and dropping the Local Storage dataset cache (Alternative G) are sound simplifications.
- The design fits the spec's no-backend, static-SPA philosophy and the non-goals are well drawn.
