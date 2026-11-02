Status: resolved

# Goldfish Annotated Review Report

**Target:** `docs/designs/days-on-purpose-v2.md` (full file)

Findings are grouped by consolidated action (see `consolidated_review_report.md`
for the traceability matrix to raw reviewer findings). Resolution mode: the
owner asked for the Goldfish feedback to be implemented, applied as
**auto accept** (every PROPOSE FIX applied; CONTEST and DECLINE bypassed).

## Prioritized Findings & AI Suggestions

### [A1] [`egm-structural`, `egm-design`, `egm-zoom-out`] - Severity: High
*   **Affected Scope:** whole FeatureRange; new section.
*   **Discrepancy Description:** No Risks & Mitigations section; the standard requires one.
*   **Rationale:** Fetch-failure resilience, WPP schema drift, migration, locale, `file://`, and license changes are unstated risks.
*   ***AI Suggestion:*** PROPOSE FIX
*   ***Justification:*** Valid. Short list per Stage 8 Z4, not a matrix.
*   ***Proposed Edit:*** Add `## Risks & Mitigations` with six one-line entries.

### [A2] [`egm-style`, `egm-implementation-readiness`, `egm-codebase-details`] - Severity: High
*   **Affected Scope:** Testing; spec line 101.
*   **Discrepancy Description:** Weeks oracle 2501.64 is wrong; 17531.64 / 7 = 2504.52.
*   **Rationale:** Implementer would write a failing test or break correct code.
*   ***AI Suggestion:*** PROPOSE FIX
*   ***Justification:*** Arithmetic verified.
*   ***Proposed Edit:*** 2504.52 with 0.01 tolerance; define fixed `now`; amend spec.

### [A3] [`egm-comprehension`, `egm-design`, `egm-implementation-readiness`, `egm-codebase-details`] - Severity: High
*   **Affected Scope:** Contrast plan, Step 3 CSS.
*   **Discrepancy Description:** Button text bound to `--bg` turns light in light mode; teal text on light surfaces fails 3:1; light palette unspecified; low-opacity labels and `--danger` unchecked.
*   **Rationale:** G6 and CUJ 5 fail as written.
*   ***AI Suggestion:*** PROPOSE FIX
*   ***Justification:*** Valid. Exact token values computed and listed; per-surface table contested (see below).
*   ***Proposed Edit:*** Token table for both schemes with `--on-accent`, `--muted`, `--field-border`; opacity-based text replaced by `--muted`.

### [A4] [`egm-zoom-out`, `egm-implementation-readiness`, `egm-codebase-details`] - Severity: High
*   **Affected Scope:** Detailed Implementation step order.
*   **Discrepancy Description:** New CSV schema lands before the new parser; site breaks and caches an empty dataset.
*   ***AI Suggestion:*** PROPOSE FIX
*   ***Justification:*** Verified against `index.html:272-288`.
*   ***Proposed Edit:*** Data, modules, page, tests, and CI ship in one feature PR; ruleset change follows.

### [A5] [`egm-zoom-out`, `egm-comprehension`, `egm-design`, `egm-implementation-readiness`, `egm-codebase-details`, `egm-style`] - Severity: Medium
*   **Discrepancy Description:** Fallback steps 2–4 are unreachable given build checks and saved-code validation.
*   ***AI Suggestion:*** PROPOSE FIX
*   ***Justification:*** Removing them satisfies G4 by construction and shrinks the design.
*   ***Proposed Edit:*** Drop `parent`/`region`/`world`; `lookup` returns row or `null`; spec fallbacks amended (D7).

### [A6] [`egm-design`, `egm-zoom-out`] - Severity: Medium
*   **Discrepancy Description:** 2024 figures are a projection, not an estimate.
*   ***AI Suggestion:*** PROPOSE FIX
*   ***Proposed Edit:*** Use `Time == 2023`; footnote "UN World Population Prospects 2024 (2023 estimate)".

### [A7] Cache wording — Severity: Medium — PROPOSE FIX
*   CUJ 2 reworded to "within the GitHub Pages cache lifetime (10 minutes, `max-age=600`, verified)".

### [A8] Pre-decision hedges — Severity: Medium — PROPOSE FIX
*   G2, CUJ 1, CUJ 3, CUJ 4 made definite.

### [A9] D2 wording gap — Severity: Medium — PROPOSE FIX
*   `aria-label="Total seconds remaining"` reworded; D2 scoped to on-page visible and ARIA text.

### [A10] Rename table, CSV format, aliases — Severity: Medium — PROPOSE FIX
*   Exact 19 `wpp_name → display_name` pairs, source columns named, comma-free names enforced, 3 v1 migration aliases enumerated, v1 name fixture test.

### [A11] `calculateJourney` contract — Severity: Medium — PROPOSE FIX
*   Input `'YYYY-MM-DD'` parsed as local midnight; exact return shape; two error messages.

### [A12] Form storage and migration — Severity: Medium — PROPOSE FIX
*   Pure `restoreForm()` in `countries.js`, v2 shape defined, legacy `total` → `female`, unknown code → locale default, tests added.

### [A13] Test command — Severity: Medium — PROPOSE FIX
*   Plain `node --test`.

### [A14] `escapeHtml` — Severity: Medium — PROPOSE FIX
*   Kept in `ui.js` for dataset text written with `innerHTML`.

### [A15] README/spec edit list — Severity: Medium — PROPOSE FIX
*   All stale README and spec lines enumerated.

### [A16] Alternative D reasoning and og-image claim — Severity: Medium — PROPOSE FIX
*   Criterion stated; false og-image claim removed.

### [A17] `localeCountry` tests — Severity: Medium — PROPOSE FIX
*   Fixture dataset; malformed tag `'en_US'`.

### [A18] Speculative injection — Severity: Medium — PROPOSE FIX
*   `env` and `fetchFn` parameters removed.

### [A19] Privacy enforcement — Severity: Medium — PROPOSE FIX
*   `tests/privacy.test.js` fails on absolute URLs in `src/*.js`.

### [A20] Browser support — Severity: Medium — PROPOSE FIX
*   Chrome/Edge 79+, Firefox 75+, Safari 14+.

### [A21–A23] Wording, definitions, structure — Severity: Low — PROPOSE FIX
*   Applied during the rewrite.

### [C1] Per-surface contrast table [`egm-design`] - Severity: Medium
*   ***AI Suggestion:*** CONTEST
*   ***Justification:*** The token table with measured ratios in the doc covers every text/surface pair; a separate per-element table duplicates it (Stage 8 Z2).

### [C2] Cache-busting data URL [`egm-design`] - Severity: Medium
*   ***AI Suggestion:*** CONTEST
*   ***Justification:*** Reintroduces a two-place update rejected by G3 (Stage 8 Z6). Pages `max-age=600` is short.

### [C3] Variant column in CSV [`egm-design`] - Severity: Medium
*   ***AI Suggestion:*** CONTEST
*   ***Justification:*** One variant is used; `year` = 2023 estimate removes the ambiguity (Stage 8 Z3).

### [C4] Skip bare language tags [`egm-design`] - Severity: Low
*   ***AI Suggestion:*** DECLINE
*   ***Justification:*** Recorded as accepted risk.

### [C5] Rewrite meta/OG/JSON-LD "remaining" copy [`egm-style`, `egm-codebase-details`] - Severity: Medium
*   ***AI Suggestion:*** CONTEST
*   ***Justification:*** Non-Goals exclude SEO copy work; D2 scoped to on-page text.

### [C6] `role="timer"` [`egm-codebase-details`] - Severity: Low
*   ***AI Suggestion:*** DECLINE
*   ***Justification:*** Correct ARIA role for a live clock.

## Outcome

*   Accepted fixes: 23 actions (A1–A23)
*   Contested: 4 (C1, C2, C3, C5)
*   Escalated: 0
*   Declined: 2 (C4, C6)
*   Remaining unaddressed: 0
