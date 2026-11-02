# Stage 7 — Critic Review (FeatureRange 1–409)

Reviewers: egm-design (feature-spec-standard), egm-structural (feature-spec-standard), egm-style. All three completed.

## Reviewer: egm-design

I read the persona, the feature-spec standard and lines 1–409 of the design doc. I checked its claims against `index.html` and `specs/days_on_purpose_spec.md`, and looked at lines 410–596 to make sure no finding is already covered later. The review is complete.

**Verdict: does not pass yet.** There is 1 Blocker, 5 Majors and 4 Nits. Most of the repository facts the doc cites check out:
- `ipapi.co` is called (line 461).
- `default-global` with the United States total is real (line 317).
- The ticker text says "Live countdown of remaining time" (line 354) and "total seconds remaining" (line 362).
- Button text is white on `#2fb8a4`, which works out to about 2.47:1.
- Text in `#0f1214` on that teal works out to about 7.6:1.
- The light-mode rule (line 150) leaves the result card dark.

---

**1. Severity: Blocker**
**Affected Scope:** `/Users/rich/.openclaw/projects/daysonpurpose/docs/designs/days-on-purpose-v2.md`, whole range 1–409. Lines 570–587 checked too.
**Finding:** There is no Risks & Mitigations section. The standard requires the spec to "explicitly call out its own constraints… failure modes, security implications, scalability limits, and how they will be mitigated." Some risks only appear as "Cons" under the alternatives. The Non-Functional Requirements section (570+) covers rollout and rollback but is not a risk register. Risks the design creates but never names as risks:
- **The page breaks if the data fails to load.** The copy of the data built into `index.html` is being removed (lines 246–247). Today, if fetching the CSV fails, the page uses that built-in copy. After the change, a failed fetch leaves the page unusable. The error message is only added in Detailed Implementation (line 474), and the lost resilience is never stated as a trade-off.
- **WPP downloads can break.** The data script depends on the UN download URL and WPP column names staying the same.
- **Country names may not map.** v1 saved country names may fail to map to ISO2 codes, and the 45 newly added countries need display names (192 → 237 rows).
- **The license changes.** It moves from a stated MIT to PolyForm Strict.
- **Opening the file locally stops working.** Opening `index.html` from disk (`file://`) will no longer work.

**Recommendation:** Add a "Risks & Mitigations" section that lists each risk with its likelihood, impact and mitigation. At minimum, say plainly that offline/fetch-failure resilience is being given up and why that is acceptable.

---

**2. Severity: Major**
**Affected Scope:** Lines 88–89 (G6), 173–178 (CUJ 5), 309–313 (Contrast).
**Finding:** The contrast plan does not meet G6 in light mode. It moves `--card`, `--panel`, `--border` and `--text` into custom properties, but never `--accent`. In `index.html`, `--accent` (`#2fb8a4`) is the text colour for:
- stat values (line 127)
- ticker digits (line 132)
- ticker separators (line 134)
- the total-seconds value (line 136)

It is also the focus outline colour (lines 110, 120). Once these surfaces turn light, as CUJ 5 requires, teal on white is about 2.5:1:
- That fails WCAG AA for large text, which needs 3:1.
- It also fails for the focus indicator, a non-text element (1.4.11), which needs 3:1.

There is a second problem. Button text is set to `--bg`, but the light-mode block does not redefine `--bg`. The fix only works because of that omission. If anyone later themes `--bg` for light mode, the button text turns light on teal.

**Recommendation:** Add a light-mode accent token, a darker teal that reaches at least 3:1 (4.5:1 for small text) on the light card. Point the button text at its own token, for example `--on-accent`, instead of `--bg`. Add a contrast table for each surface and scheme.

---

**3. Severity: Major**
**Affected Scope:** Lines 47–50 (Problem 4), 84–85 (G4), 252–269 (Lookup and fallback).
**Finding:** The fallback order differs from the spec, and the doc never records that.
- The spec (`specs/days_on_purpose_spec.md` lines 18–22) says: country+gender unavailable → country total; **missing country** → UN sub-region average → global.
- The design moves the region step to "country row found, gender and total both missing." It sends a missing country straight to the world row.

The design's reasoning is sound: without a country row you cannot know the parent region. But Problem 4 presents this as "implementing" the spec, and D1–D6 contain no matching spec change. It is also likely that every WPP country row has male, female and total values, so steps 2 and 3 may never run. The "sub-region fallback" that justified choosing WPP (line 391) would then never actually apply. The spec's response field is `fallback_used`, and spec test 3 asserts on it. The design returns `fallback` instead.

**Recommendation:** Add a decision, D7, that amends the spec's fallback order and field name. Say whether steps 2 and 3 can be reached with WPP 2024 data. If not, either drop them or keep them deliberately for future data releases, and say so.

---

**4. Severity: Major**
**Affected Scope:** Lines 128–130 (D6), 218–220 (Data), 314–315 (Footnote "2024 estimate").
**Finding:** The doc assumes the 2024 values in WPP 2024 are estimates. As far as I know, WPP 2024's estimate period ends at 2023, and 2024 onward comes from the Medium-variant projection. The file the script reads is itself `..._Medium.csv.gz`. If that is right, labelling these figures "2024 estimate" misstates their provenance, which is the exact defect Problem 5 sets out to fix.

**Recommendation:** Check the WPP 2024 methodology. Then either use `Time == 2023`, the last estimate year, or label the figures "2024 (medium-variant projection)". Store the variant in the CSV.

---

**5. Severity: Major**
**Affected Scope:** Lines 322–325 (Testing and CI).
**Finding:** `"test": "node --test tests/"` may not run on Node 22. Since Node 21, the positional arguments to `node --test` are treated as glob patterns. I recall that passing a bare directory stopped matching test files after that change, but I have not confirmed it for Node 22. If it fails, the required `test` check will fail, or pass while running nothing, on every PR into `develop` and `main`. That would undermine G5.

**Recommendation:** Use `node --test` with its default discovery (`**/*.test.js`) or an explicit glob such as `node --test "tests/**/*.test.js"`. Confirm on Node 22 that the run reports a non-zero test count.

---

**6. Severity: Major**
**Affected Scope:** Lines 150–156 (CUJ 2) against lines 248–250 (Data).
**Finding:** CUJ 2 promises that a new dataset "is used without waiting for a cache to expire." The Data section says the update arrives "within the Pages cache lifetime," which is waiting for a cache to expire. GitHub Pages sends a short `max-age` and the design adds no cache-busting, so the CUJ as written cannot be met.

**Recommendation:** Either reword CUJ 2 to promise delivery "within the GitHub Pages HTTP cache lifetime (minutes)," or add a version query string to the data URL in `config.js`.

---

**7. Severity: Nit**
**Affected Scope:** Lines 147–148 (CUJ 1), 163–164 (CUJ 3).
**Finding:** Two user journeys still carry wording from before the decisions were made. CUJ 1 says "unless the privacy text discloses it," but D3 removes all third-party requests. CUJ 3 says "The ticker, if kept," but D2 keeps it and line 303 already hides it when the visitor is past average expectancy.

**Recommendation:** Make both definite: "No third-party request is made," and "The ticker and total box are not rendered."

---

**8. Severity: Nit**
**Affected Scope:** Lines 118–120 (D3), 287–289.
**Finding:** For a bare language tag like `en`, `Intl.Locale(...).maximize().region` returns the language's most likely region (`en` → `US`), not where the visitor is. English-, Spanish- and Arabic-speaking visitors who don't set a regional tag will often get the wrong default. Alternative C hints at this but never sizes it.

**Recommendation:** Say that this is accepted, or skip tags that have no explicit region and go straight to the next step.

---

**9. Severity: Nit**
**Affected Scope:** Lines 201, 210 (data URL in `config.js`).
**Finding:** The site is served under `/daysonpurpose/`, so the data URL and module path must be relative (`data/...`, `src/main.js`), not root-absolute (`/data/...`). The doc doesn't say which, and a root-absolute path works on Live Server but returns a 404 on Pages.

**Recommendation:** Say that every asset URL is relative to the document.

---

**10. Severity: Nit**
**Affected Scope:** Lines 126–127 (D5), 317–318.
**Finding:** The README has publicly stated an MIT license. Switching to PolyForm Strict cannot take back MIT rights from anyone who copied an earlier version, if MIT was ever in effect.

**Recommendation:** Add a sentence noting this and that the new license applies from this release forward.

## Reviewer: egm-structural

**Structural review: `/Users/rich/.openclaw/projects/daysonpurpose/docs/designs/days-on-purpose-v2.md`, lines 1–409**

**Verdict:** One blocker. The scope has no Risks & Mitigations section, which the standard makes mandatory.

I read the persona, the standard and the target file in full. I also checked `.github/workflows/branch-policy.yml`, which the doc names.

**Heading map:** The H1 is at line 1. The H2 sections are Overview (9), The Problem (28), Goals (75), Non-Goals (95), Decisions (107), Open Questions (132), Critical User Journeys (138), Technical Plan (Architecture) (188) and Alternatives Considered (336). There are H3s under CUJs (6), under Technical Plan (7) and under Alternatives (A–G). No heading levels are skipped. Both fenced code blocks (197–214, 222–227) are closed. Bullets (`*   `) and numbered lists (`1.  `) use one style throughout.

**Standard compliance:**

| Required area | Section in scope | Status |
|---|---|---|
| Problem Statement | `## The Problem` (28) | Present, under a different name |
| Goals & Non-Goals | `## Goals` (75), `## Non-Goals` (95) | Present, split into two H2s |
| Proposed Architecture | `## Technical Plan (Architecture)` (188) | Present, under a different name |
| Alternatives Considered | `## Alternatives Considered` (336) | Present |
| Risks & Mitigations | none | **Missing** |

---

**Finding 1**
- **Severity:** 🔴 Blocker
- **Affected scope:** Whole range, lines 1–409. The section should sit between line 335 and line 336, or right after line 409.
- **Discrepancy and rationale:** The standard's "Risks & Limits" section says the spec "must explicitly call out its own constraints" and must cover failure modes, security, scalability limits and how each is mitigated. No such heading exists in scope. A search of the whole file for "risk", "mitigat", "failure" and "security" finds only one match, an error string at line 474, which is outside scope. The scope contains risks with no stated mitigation:
  - **The dataset fetch can fail.** Line 246 removes the embedded fallback, so the CSV becomes a single point of failure.
  - **Pages caching makes freshness uncertain.** Line 249 says "within the Pages cache lifetime" without stating that lifetime.
  - **Locale detection can be wrong or missing.** Line 287 relies on `Intl.Locale(...).maximize()`.
  - **Saved forms can break during migration.** Lines 284–286 map and then delete the v1 key.
  - **Local runs from `file://` now fail.** Line 331.
  - **The data script depends on the UN download URL and schema staying the same.** Lines 218–220.

  These facts are scattered through the text, but none has a mitigation.

**Finding 2**
- **Severity:** 🟡 Major
- **Affected scope:** Line 80–81 (G2), lines 147–148 (CUJ 1), lines 163–164 (CUJ 3).
- **Discrepancy and rationale:** The Decisions section (107–130) says it "replace[s] the open questions of the first draft." But sections written before those decisions still hedge on choices that are now settled:
  - G2 reads "Either no third-party request is made, or every privacy statement names it," but D3 removes the request.
  - CUJ 1 reads "No third-party request is made unless the privacy text discloses it," also overtaken by D3.
  - CUJ 3 reads "The ticker, if kept," but D2 keeps it, and line 303 says it is not rendered in this state.

  Requirements and journeys that conflict with the decisions they depend on leave a fresh reader unsure which one is binding. These sections should be rewritten to match D2 and D3.

**Finding 3**
- **Severity:** 🟡 Major
- **Affected scope:** Line 380 (Alternative D, Reason for Rejection). To a lesser degree, line 370 (C) and line 390 (E).
- **Discrepancy and rationale:** The Alternatives Rule requires each option to be rejected "for specific, documented reasons." Alternative D's rejection says only "Owner chose to keep the ticker and reword it (D2)," which cites authority rather than a criterion. C and E also open with "Owner chose…" but then add a technical reason (C: "Zero third-party requests is simpler to state and to keep true"; E: full country coverage, single year, sub-region rows). D should do the same. For example: rewording satisfies the tone rule and keeps the main visual element and the og-image consistent.

**Finding 4**
- **Severity:** 🟢 Nit
- **Affected scope:** Lines 375–379 (Alternative D) and 384–389 (Alternative E).
- **Discrepancy and rationale:** A, B, C, F and G each give one Pros bullet and one Cons bullet for a single option. D and E pack two options into each bullet using inline bold sub-labels ("**Pros (remove)**: … **Pros (keep wording)**: …"). This breaks the pattern and is hard to scan. Either split them into D1/D2 and E1/E2, or use nested bullets.

**Finding 5**
- **Severity:** 🟢 Nit
- **Affected scope:** Lines 132–136 (Open Questions).
- **Discrepancy and rationale:** The section says "None blocking" and then records a decision (gender stays `male`/`female`, and `total` is removed from the spec). It also points forward to Detailed Implementation, which is outside this range. The decision belongs in Decisions as D7. Open Questions should then just say "None."

**Finding 6**
- **Severity:** 🟢 Nit
- **Affected scope:** Line 28 (`## The Problem`) and line 188 (`## Technical Plan (Architecture)`).
- **Discrepancy and rationale:** These headings don't use the standard's names ("Problem Statement", "Proposed Architecture"). The content matches, so they count as present. Using the exact names would make checking against the template mechanical.

**Finding 7**
- **Severity:** 🟢 Nit
- **Affected scope:** Lines 16, 22, 67, 124, 333 and other inline file paths and URLs.
- **Discrepancy and rationale:** The repo files the doc relies on (`specs/days_on_purpose_spec.md`, `README.md`, `llms.txt`, `.vscode/settings.json`) and the canonical URL appear as inline code, not Markdown links. The standard sets no link format, so this is a consistency and navigation suggestion only. Relative links would let a fresh reader jump straight to the sources the Problem section cites.

**No issues found:**
- **Heading hierarchy:** H1 → H2 → H3 throughout, with no skipped levels.
- **Code blocks:** both fenced blocks are closed and tagged `text`.
- **Lists:** the marker style is consistent.
- **Workflow and job names:** "`branch-policy` workflow" (line 23) and "`source-branch` check" (lines 87, 327) match the workflow file, which defines workflow `branch-policy` with job `source-branch`.

## Reviewer: egm-style

## Style review of `/Users/rich/.openclaw/projects/daysonpurpose/docs/designs/days-on-purpose-v2.md`, lines 1–409 (Mode: REVIEW)

**Verdict:** I found no Blockers. The prose is mostly dry and factual. The main problems are precision ones: hedges left over from before the owner decisions, two claims that contradict the plan or the code, and a few terms a new reader can't resolve. I've labelled severity in words, not emoji: Blocker, Major, Nit.

I read the persona file, the full target range, and two files the doc names (`index.html` and `.github/workflows/branch-policy.yml`) to check claims. No style standard was assigned, so only the persona's audit vectors apply.

## Major

**M1. Lines 147–148 (CUJ 1 Then):** "No third-party request is made unless the privacy text discloses it."
- **Discrepancy:** D3 (lines 118–120) removes `ipapi.co` and says "No network request is made." This line still allows a disclosed third-party request.
- **Rationale:** The hedge comes from before the decision. It weakens a testable acceptance criterion and contradicts D3 and Alternative C. It should say plainly that no third-party request is made.

**M2. Line 164 (CUJ 3 Then):** "The ticker, if kept, does not show a row of zeros…"
- **Discrepancy:** D2 (line 115) settles that the ticker stays. Lines 303–304 also say the ticker is not rendered in this state.
- **Rationale:** "If kept" is another leftover hedge. "Does not show a row of zeros as its main signal" is vaguer than the plan's actual behaviour. It should match lines 303–304: the ticker and total box are not rendered.

**M3. Line 170 (CUJ 4 Then):** "Calculate is disabled or an inline error names the field."
- **Discrepancy:** It offers two outcomes and doesn't commit to either. Lines 307–308 specify `max` on the date input plus a calculator rejection, but neither outcome is chosen.
- **Rationale:** A Then clause with "or" can't be checked as pass or fail. Pick one behaviour.

**M4. Lines 155–156 vs 248–250:** CUJ 2 says a new dataset "is used without waiting for a cache to expire." The Data section says updates arrive "within the Pages cache lifetime."
- **Discrepancy:** The HTTP cache is still a cache that has to expire, so the CUJ overstates what the plan delivers.
- **Rationale:** The claim can't be verified as written. Also, "GitHub Pages' default headers" (line 249) gives no number. State the actual lifetime and word CUJ 2 to match it, for example "within the Pages cache lifetime, not 24 hours."

**M5. Lines 273–275:** "the existing arithmetic moved out unchanged … It throws `RangeError`…"
- **Discrepancy:** The existing code throws `new Error('Invalid birth date')` (`index.html` line 329), not `RangeError`. Passing `now` in is also a change.
- **Rationale:** "Unchanged" is false as written. Say "unchanged except for…" and list the changes.

**M6. Lines 115–116 (D2) vs 300–302 (UI changes):** D2 says "No visible or ARIA text uses 'countdown', 'remaining', or 'left'."
- **Discrepancy:** The UI changes list renames only the timer `aria-label` and the visible total label. `index.html` line 360 also has `aria-label="Total seconds remaining"`. Meta and JSON-LD descriptions say "remaining purpose-days" and "days remaining" (lines 9, 10, 18, 30, 41, 78), and those appear in search results and shares.
- **Rationale:** The rule is absolute, but the list doesn't cover every string it applies to. Either list every string, or narrow D2 to on-page UI and say so.

## Nit

**N1. Line 30:** "the repository and the product disagree with themselves."
- **Rationale:** Personifying the repo blurs what is actually wrong, which is that documents contradict code. Example rewrite: "repository documents contradict the shipped code and each other."
- **Line 77:** "The repository tells the truth" (G1 heading) has the same issue. Something like "Repository documents match shipped files and behaviour" says it directly.

**N2. Line 46:** "The spec and the shipped UI cannot both be right."
- **Rationale:** This repeats the contradiction already shown by the two quotes before it. Delete it.

**N3. Line 61:** "Light mode is half-applied."
- **Rationale:** "Half" is informal and implies a measurement that wasn't made. Use "partially applied."

**N4. Line 23 vs line 86:** Line 23 names the `branch-policy` workflow. Line 86 names the `source-branch` check.
- **Rationale:** They are the workflow name and the job name in the same file, but a new reader sees two unrelated names. Name both once, for example "the `branch-policy` workflow's `source-branch` job."
- **Line 23:** "the new `branch-policy` workflow" uses "new," which goes stale. Drop it.

**N5. Line 102:** "the separate Impeccable review."
- **Rationale:** This is an undefined proper noun. A reader can't tell what or where it is. Define it or link to it.

**N6. Lines 126–127:** "matching `cutandmove`, `wordstake`, and `macedgelight`."
- **Rationale:** These are other repositories the doc never introduces. Either say "the owner's other repositories" or drop the list.

**N7. Lines 109–110:** "They replace the open questions of the first draft."
- **Rationale:** This is draft history a reader of the current doc can't see. Delete it.

**N8. Lines 134–136 (Open Questions):** The section holds a settled decision (gender options stay `male` and `female`; `total` is removed), not a question.
- **Rationale:** "None blocking" suggests some non-blocking questions exist. Move the gender decision to Decisions as D7 and write "None."

**N9. Lines 12, 129 and throughout:** The UI field is "gender," but the data source is "by sex" (line 129).
- **Rationale:** Two terms are used for one data dimension. Say once that the UI's "gender" maps to WPP's "sex."

**N10. Line 268:** "It now returns the real world figure."
- **Rationale:** "Now" is relative to the time of writing, and "real" is filler. Use "Step 4 returns the `world` row, not the United States row."

**N11. Line 298:** "Only the changes needed for the goals:"
- **Rationale:** Filler. Delete it, or say "Changes, each tied to a goal:".

**N12. Lines 338–340:** "these are the options the owner weighed during drafting on 2026-11-02, plus the mechanisms rejected while writing the Technical Plan."
- **Rationale:** Wordy. Use "Options considered on 2026-11-02."

**N13. Lines 350–351:** "make those tests ordinary; the closure makes them fragile."
- **Rationale:** "Ordinary" is vague. Use "importable with `node:test` and no DOM shim."

**N14. Line 356:** "Familiar tooling."
- **Rationale:** Subjective, because it doesn't say who it is familiar to. Name who, or drop it.

**N15. Lines 358–359:** "about 300 lines of logic" and "React adds nothing."
- **Rationale:** The line count has no source; the only stated figure is 488 lines for the whole file. "Adds nothing" is an absolute opinion. Use "React's component model has no use with one form and one result card."

**N16. Lines 368–369:** "blocked by common ad blockers, so it already fails silently for many visitors."
- **Rationale:** "Many" can't be checked. Name the blocklist (for example EasyPrivacy) or drop the quantity.

**N17. Line 377:** "the most visible element of the current page."
- **Rationale:** A superlative with no basis. Use "the main animated element on the page and in the og-image."

**N18. Line 386:** "No Taiwan and several territories."
- **Rationale:** "Several" is vague, and "no Taiwan and several territories" can misread as "has several territories." Use "Omits Taiwan and N territories" or list them.

**N19. Line 407:** "The CSV is about 20 KB."
- **Rationale:** It's unclear whether this is the current 192-row file or the new one (237+ countries plus region and world rows, and two more columns). Say which.

**N20. Line 16:** "live ticking display."
- **Rationale:** "Live" and "ticking" say the same thing. Use "a live display."
