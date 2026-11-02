# Consolidated Goldfish Review: days-on-purpose-v2.md

*   **Target:** `docs/designs/days-on-purpose-v2.md` (595 lines at review time)
*   **Mode:** Consolidated report, all rubrics (Stages 5–9, no checkpoints)
*   **Split:** FeatureRange 1–409, DetailedRange 410–595
*   **Date:** 2026-11-02
*   **Goldfish context:** none beyond files the doc names

| Stage | Reviewers | Status | Report |
|---|---|---|---|
| 5 Initial Zoom Out | egm-zoom-out | completed | `zoom_out_report.md` |
| 6 Comprehension | egm-comprehension | completed | `comprehension_report.md` |
| 7 Critic | egm-design, egm-structural, egm-style | completed (3/3) | `critic_report.md` |
| 8 Intermediate Zoom Out | egm-zoom-out | completed | `intermediate_zoom_out_report.md` |
| 9 Implementation Readiness | egm-implementation-readiness, egm-codebase-details, egm-style | completed (3/3) | `implementation_readiness_report.md` |

## Verdict

**Not ready to implement.** Four blockers. None of them challenges the architecture
(plain ES modules, one CSV, static Pages). They are a missing section, one wrong
test value, an incomplete contrast plan, and a step order that breaks the live
site. Stage 8 shows that most Major findings resolve by removing design, not
adding it.

## Facts verified by the Elephant during consolidation

*   17531.64 / 7 = 2504.52. The spec (`specs/days_on_purpose_spec.md:101`) and
    the doc both say 2501.64. The spec is wrong.
*   WPP 2024 labels both 2023 and 2024 rows `Variant = Medium`. UN methodology
    puts the last estimate year at 2023; 2024 is a projection.
*   WPP names with commas: "China, Hong Kong SAR", "China, Macao SAR",
    "China, Taiwan Province of China", "Bonaire, Sint Eustatius and Saba".
    "Netherlands" is unchanged in WPP 2024.
*   GitHub Pages serves `data/lifeexpectancy.csv` with `cache-control: max-age=600`.
*   `node --test tests/` works on Node 26 locally; Node 22 not tested here.

## Action items

### 🔴 Blockers

*   **A1. Add a Risks & Mitigations section.** One line per risk: CSV fetch
    failure (embedded copy dropped on purpose), WPP URL/schema change, unmapped
    v1 saved name, wrong locale guess (bare `en` → US accepted), `file://` no
    longer works, MIT → PolyForm applies from this release forward. No matrix.
*   **A2. Fix the weeks test value to 2504.52** with a tolerance of 0.01, define
    how the test builds age exactly 40.00, and correct spec line 101.
*   **A3. Complete the contrast plan.** Separate `--on-accent` token for button
    text; a darker light-mode `--accent`; exact light-mode hex values for every
    token, including `--danger`; replace low-opacity label text with a muted
    colour token that passes 4.5:1. One acceptance sentence, no contrast table.
*   **A4. Fix step order.** Steps 1–3 land in one feature PR so data, parser,
    and page change together. Each module's tests ship with the module.

### 🟡 Major

*   **A5. Remove the runtime fallback chain.** The build script and dataset test
    guarantee every country has finite values, and a saved code not in the
    dataset is skipped on restore, so steps 2–4 cannot run. Drop `parent`,
    `region`, `world` rows, non-finite marking, region footnote text, and their
    tests. `lookup` returns the row or `null`. Amend the spec's fallback section
    and tests 3–4.
*   **A6. Use WPP 2024's 2023 estimate,** not the 2024 projection. Footnote:
    "UN World Population Prospects 2024 (2023 estimate)". No variant column.
*   **A7. CUJ 2 cache wording:** "within the GitHub Pages cache lifetime
    (10 minutes)". No cache-busting query string.
*   **A8. Remove pre-decision hedges** in G2, CUJ 1, CUJ 3, CUJ 4 (CUJ 4: Calculate
    stays disabled until all fields are valid; future dates blocked by `max`).
*   **A9. Close the D2 gap:** reword `aria-label="Total seconds remaining"`;
    narrow D2 to on-page visible and ARIA text. Meta/SEO copy is out of scope.
*   **A10. Specify the rename table and CSV format exactly.** List
    `wpp_name → display_name` pairs; name the source columns (`LExMale`,
    `LExFemale`, `LEx`, `ISO2_code`, `LocTypeName`, `Time`); rename every
    comma-bearing name so the CSV never needs quoting; script fails on a comma
    in any name and on an unmatched rename key. Enumerate `ALIASES`.
*   **A11. Pin `calculateJourney`:** input `birthDate` as `'YYYY-MM-DD'`,
    parsed as local midnight to match the date input's local `max`; exact
    return shape; error messages for unparseable and future dates.
*   **A12. Define form storage and migration** as a pure, tested
    `migrateForm()` in `countries.js`: v2 shape, legacy gender `total` → `female`
    (current behaviour), unmapped v1 name → locale default.
*   **A13. Test command:** plain `node --test`.
*   **A14. Keep `escapeHtml`** for any dataset text written with `innerHTML`.
*   **A15. Finish README and spec edits:** README "Fallback Dataset" and
    "zero-dependency" lines; spec caching rules (lines 110, 139), Lovable gender
    list (132), JSON example source (46), provider/seed notes (14–15, 114).
*   **A16. Alternatives D:** give a criterion, not "owner chose", and drop the
    false og-image claim (the og-image shows stat tiles, not the ticker).
*   **A17. `localeCountry` tests:** pass a fixture dataset; use a malformed tag
    (`'en_US'`) for the skip path.
*   **A18. Drop speculative injection** (`env`, `fetchFn`) that no test uses.
*   **A19. Privacy enforcement:** add a test that fails if `src/*.js` contains
    an absolute `http(s)://` URL.
*   **A20. Browser support:** state minimum versions for ES modules plus
    `Intl.Locale.prototype.maximize`.

### 🟢 Nits

*   **A21. Wording and precision:** "tells the truth" / "disagree with
    themselves" / "half-applied" / "cannot both be right" / "for clarity" /
    "becomes true" / "Unchanged on purpose" / "Five modules" (six) /
    "`AbortSignal`-free" / "now returns the real" / "about" vs "~" /
    "several territories" / "many visitors" / "Familiar tooling" /
    "ordinary" tests; "moves … as today" for ticker markup; "the constant" →
    `DAYS_PER_YEAR`; gender vs sex mapping stated once.
*   **A22. Definitions:** name `branch-policy` workflow and its `source-branch`
    job together; define "Impeccable"; describe sibling repos as "the owner's
    other repositories"; drop ruleset IDs.
*   **A23. Structure:** move the gender decision into a D7 spec-amendments
    decision; Open Questions → "None"; Alternatives D/E one option per entry;
    Additional Resources as H2 with full URL; remove draft history sentence.

## Contested (not adopted)

*   **Per-surface contrast table** (Critic design #2): replaced by one
    acceptance sentence (Stage 8 Z2). A table goes stale.
*   **Cache-busting query on the data URL** (Critic design #6): reintroduces a
    two-place update (Stage 8 Z6).
*   **Variant column in the CSV** (Critic design #4): one variant only (Z3).
*   **Likelihood/impact risk matrix** (Critic design #1): short list instead (Z4).
*   **Skip bare language tags** (Critic design #8): accepted behaviour; recorded
    as a risk (Z7).
*   **Rewrite meta/OG/JSON-LD "remaining" copy** (Style M6, Codebase #19): SEO
    copy work is a non-goal; D2 narrowed to on-page text (Z5).
*   **`role="timer"` semantics** (Codebase #7): correct ARIA role for a live
    clock; kept.

## Traceability matrix

| Action | Source findings |
|---|---|
| A1 | S7-structural F1, S7-design #1, S8 Z4 |
| A2 | S9-style #1, S9-readiness B1, S9-codebase #2 |
| A3 | S6 #1, S7-design #2, S8 Z2, S9-readiness B2, B3, S9-codebase #3, #8 |
| A4 | S5 M2, S9-readiness M1, S9-codebase #1 |
| A5 | S5 M1, S6 #2, #15, S7-design #3, S8 Z1, S9-readiness M5, S9-codebase #15, #16, S9-style #4 |
| A6 | S7-design #4, S8 Z3 |
| A7 | S5 N5, S6 #3, S7-style M4, S7-design #6, S8 Z6 |
| A8 | S5 N4, S6 #5, S7-structural F2, S7-style M1, M2, M3, S7-design #7 |
| A9 | S7-style M6, S8 Z5, S9-readiness M7, S9-codebase #7 |
| A10 | S5 N6, S6 #4, S9-readiness M2, M3, M4, S9-codebase #4, #5, #10, S9-style #8 |
| A11 | S6 #10, S7-style M5, S9-readiness N1, N2, S9-codebase #6, #14 |
| A12 | S5 N2, S9-readiness M6, S9-codebase #9 |
| A13 | S5 N7, S7-design #5, S8 Z9, S9-readiness M9, S9-codebase #11 |
| A14 | S9-codebase #9 |
| A15 | S5 N5, S9-codebase #12 |
| A16 | S7-structural F3, S9-codebase #19 |
| A17 | S9-readiness M8, S9-codebase #13 |
| A18 | S5 N3, S6 #12, S9-style #3, S9-readiness N4 |
| A19 | S9-style #7 |
| A20 | S9-style #6 |
| A21 | S6 #11, #13, #14, S7-style N1–N4, N9–N20, S9-style #5, #9, #10, #11, #12, #13, #14, #16 |
| A22 | S5 N8, S6 #6, #7, #8, #9, S7-style N5, N6, S7-structural F7, S9-codebase #17 |
| A23 | S7-structural F4, F5, F6, S7-style N7, N8, S9-style #15, S9-readiness N5 |
