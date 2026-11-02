# Stage 8 — Intermediate Zoom Out Review

**Stage 8 Intermediate Zoom-Out Review: `/Users/rich/.openclaw/projects/daysonpurpose/docs/designs/days-on-purpose-v2.md` (lines 1–595)**

**Verdict: passes with 5 Majors and 4 Nits, no Blockers from the zoom-out side.** Most Stage 6 and Stage 7 requests can be met by rewording text or deleting design. A few requests would add machinery: a risk matrix, a per-surface contrast table, a CSV variant column, cache-busting, and keeping dead fallbacks "for future data". I recommend not adopting those.

I read the persona, the zoom-out standard, the target, all three prior reports, `index.html` and `specs/days_on_purpose_spec.md` in full. I re-checked the following against the code:
- `--accent` is the text colour at `index.html` lines 127, 132, 134 and 136, and the focus outline at 110 and 120.
- The light-mode rule at line 150 sets `body` background directly. It does not redefine `--bg`.
- `aria-label="Total seconds remaining"` is at line 360.
- The spec's fallback rules are at lines 18–22, the `fallback_used` field at line 61, and the caching rules at lines 110 and 139.

---

## 🟡 Major

**Z1. Remove the runtime fallback chain instead of documenting it (Comprehension #2, Critic design #3, Comprehension #15). My view has changed since Stage 5 M1.**
- **Where:** lines 47–50, 84–85, 229–236, 252–269, 284, 314–316, 391, 429–430, 459–465, 518–521, 525–527.
- **What's wrong:** Three reviewers now ask for more around fallbacks: a sentence on why steps 2 and 3 exist, a D7 that amends the spec's order and renames the field, and either removing the steps or keeping them "deliberately for future data releases". Comprehension #15 adds a gap: a saved ISO2 code that isn't in the dataset has no defined behaviour. Defining it gives the simplest answer of all:
  - On restore, skip a saved code the dataset doesn't contain and move on to the locale step. This check is needed anyway, because a `<select>` can't show a value it has no option for.
  - Once that check exists, `lookup` can only receive codes from dataset rows.
  - The build script (lines 429–430) and `dataset.test.js` (lines 526–527) already guarantee that every row has finite `male`, `female` and `total`.
  - So none of the four fallback steps can ever run.
- **Why it matters:** G4 ("never another country's number under a global label") is then met by construction. Keeping any step "for future data" is YAGNI: the build check would reject that future data before it shipped.
- **Simplest resolution:**
  - Drop the `parent` column, the `region` and `world` rows, the "parent has a region row" check and test, non-finite marking in `parseCsv`, the region footnote text, and the steps 2–4 tests.
  - `lookup` returns the country value, or `null`. On `null`, the UI shows the same error as a failed load.
  - Amend spec fallbacks and spec tests 3 and 4 in the single D7 described in Z5.
  - Alternative E's rejection still stands on Taiwan and territory coverage plus a single year; delete "its own sub-region rows" from line 391.
- **Fallback option:** If the owner wants a safety net, keep only "country, else `world` row" and use the spec's field name `fallback_used`. That avoids a rename decision.

**Z2. Contrast fix: two tokens, not a token system plus a table (Comprehension #1, Critic design #2).**
- **Where:** lines 309–313, 491–495.
- **What's wrong:** Both reviewers are right on the facts.
  - Line 491 gives `--bg` a light-mode value, so `.calc-btn { color: var(--bg) }` becomes light text on teal.
  - `--accent` (`#2fb8a4`) at about 2.5:1 on a light card fails 3:1 for the large stat and ticker digits and for the focus outline (`index.html` lines 110, 120, 127–136).
- **Why it matters:** The Critic's fix adds a light-mode accent, a new `--on-accent`, and a per-surface contrast table. The table is a design-doc artifact that will go stale, and it is too low-level for this document.
- **Simplest resolution:**
  - Add `--on-accent`: dark (`#0f1214`) in dark mode, `#fff` in light mode.
  - Redefine `--accent` in the light-mode block to a darker teal that reaches at least 4.5:1 on white, and at least 4.5:1 under white button text. Something near `#1a7f72` gives about 4.9:1; verify it.
  - Replace "a contrast table" with one acceptance sentence: every text/background pair is at least 4.5:1 (3:1 for large text and non-text), checked once by hand per scheme.
  - Add no test tooling.

**Z3. WPP year: change one value, add no column (Critic design #4).**
- **Where:** lines 128–130, 218–220, 314–315, 421.
- **What's wrong:** To my knowledge, WPP 2024 estimates end at 2023, and 2024 onward is the medium-variant projection. Labelling the figures "2024 estimate" reintroduces the provenance error that Problem 5 exists to fix.
- **Why it matters:** The Critic suggests either using 2023 or relabelling, and also storing the variant in the CSV. A variant column is speculative, because only one variant is ever used.
- **Simplest resolution:** Filter `Time == 2023`, store `source = UN WPP 2024` and `year = 2023`, and show "UN WPP 2024, 2023 estimate". This is a one-token change in D6, Data and Step 1. Verify the boundary year before editing.

**Z4. Risks & Mitigations (Critic Blocker): meet it with a short list, not a register.**
- **Where:** insert after line 587, or replace the Rollout, Rollback and Compatibility bullets at lines 579–587.
- **What's wrong:** The standard requires the section. The Critic's recommendation ("likelihood, impact and mitigation" per risk) would produce a matrix for a single static page.
- **Simplest resolution:** Write about six one-line "risk → accepted because / mitigated by" bullets, mostly moved from existing text:
  1. **CSV fetch fails:** error at line 474. The embedded copy is deliberately dropped, because a same-origin fetch failing while `index.html` loaded is rare. Do not bring the embedded copy back; Alternative F already rejected two copies.
  2. **UN URL or column names change:** the script is run by hand and exits non-zero. Only regeneration is affected; the live site is not.
  3. **A v1 saved name doesn't map:** the visitor re-picks a country once.
  4. **Locale gives the wrong country** (bare `en` → `US`): accepted, because the visitor can change it.
  5. **`file://` no longer works:** documented in the README.
  6. **MIT → PolyForm:** the new license applies from this release forward. This also covers Critic design #10.

**Z5. Consolidate every spec amendment into one decision, and close the D2 gap narrowly (Critic design #3, Structural F5, Style N8, Style M6).**
- **Where:** lines 112–136, 300–302, 552–557.
- **What's wrong:**
  - Three reviewers want separate new decisions for gender, fallback order and field name. Stage 5 N5 also found that the spec's caching lines (110, 139) were left untouched. One decision covers all of these.
  - Style M6 is correct that the plan misses `aria-label="Total seconds remaining"` (`index.html` line 360), which is inside the ticker. Rewriting the "remaining purpose-days" meta, OG and JSON-LD descriptions would be SEO copy work, which the non-goals exclude.
- **Simplest resolution:**
  - Add "D7. Spec amendments", listing:
    - gender `female | male`
    - fallbacks per Z1
    - spec tests 3 and 4 amended
    - ticker allowed under the wording rule
    - Local Storage and 24-hour data caching removed
    - "serve the folder" plus `npm test`
  - Open Questions becomes "None".
  - Narrow D2 to "on-page visible and ARIA text", and add the line-360 label to the UI changes list.

---

## 🟢 Nit

**Z6. Reject cache-busting for CUJ 2 (Critic design #6).**
- **Where:** lines 155–156, 248–250.
- **Why:** A version query string in `config.js` means every data update touches the CSV and JavaScript again. That is the two-place update G3 removes.
- **Fix:** Reword CUJ 2 to "within the GitHub Pages HTTP cache lifetime". I believe Pages sends `max-age=600`; verify that before quoting it.

**Z7. Locale bare tags: accept the behaviour, don't add code (Critic design #8).**
- **Where:** lines 287–289, 522–523.
- **Why:** Skipping region-less tags still falls back to `US` for `en`, and gives worse results for `es` and `fr`. The test at line 523 already encodes the accepted behaviour.
- **Fix:** Covered by risk 4 in Z4. No code change.

**Z8. Relative asset URLs are already specified (Critic design #9).**
- **Where:** lines 439, 490.
- **Why:** `DATA_URL = 'data/lifeexpectancy.csv'` and `src="src/main.js"` are both relative.
- **Fix:** At most, add one sentence ("all asset URLs are document-relative"). Nothing else is needed.

**Z9. Upgrade Stage 5 N7 (`node --test tests/`) to match the Critic's Major.**
- **Where:** lines 323, 512.
- **Why:** It is now the required `test` check. The concern about directory arguments on Node 22 is still unverified.
- **Fix:** Unchanged: use plain `node --test`, which removes an argument. Don't add a "non-zero test count" guard.

---

## Requests that are safe to adopt as written

These add no complexity:
- Stage 6 Nits #5–14.
- Structural F2–F4, F6 and F7.
- All Style Majors other than M6 (handled in Z5) and all Style Nits. They are wording edits.

Of these, the CUJ 4 "pick one" fix (Style M3) is the only behavioural choice. "Calculate stays disabled until all fields are valid; future dates are blocked by `max`" matches lines 307–308 and needs no inline-error component.

## Net effect if Z1–Z5 are adopted

The design gets smaller:
- 3 fewer CSV concepts (`parent`, `region`, `world`).
- About 4 fewer tests.
- No marking of non-finite values.
- No region footnote text.

It adds about 6 lines of risks, one decision, and one CSS token.
