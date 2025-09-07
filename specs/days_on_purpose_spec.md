# Days on Purpose — Purpose-Driven Journey Calculator

## Intent
Create an application that helps users frame their lives around **purposeful action**. Given a **birth date**, **country**, and **gender**, the app estimates the user’s **Days for Your Journey** (and equivalent weeks, months, years) using the latest **life expectancy at birth** for that country and gender. The emphasis is *not mortality*, but **clarity, focus, and momentum**.

## Inputs
- `birth_date` (ISO `YYYY-MM-DD`)
- `country` (case-insensitive; normalize common aliases)
- `gender` (`female` | `male` | `total` [both sexes])

## Data Source
- Use the most recent **life expectancy at birth (years)** by **country** and **gender** from WHO/World Bank/UN.
- Implement one provider:
  - **Bundled CSV**: `country, male_years, female_years, total_years, source_year`
  - **OR** a fetcher (e.g., World Bank API) with 24-hour on-disk cache.
- Keep provider swappable.

### Fallbacks (ordered)
1. Country+gender unavailable → use **country total**.  
2. Missing country → use **UN sub-region** average for that gender.  
3. Otherwise → use **global** average for that gender.  
- Record which fallback was used in response.

## Computation (separate, transparent)
- Today = system date in UTC.
- Age in **years** = precise fractional years (use **365.2425** days/year).
- Life Expectancy (**LE_years**) from dataset.
- **Remaining years** = `max(LE_years - age_years, 0)`.
- Convert independently (don’t derive one unit from another; compute each from remaining years):
  - **Days** = `remaining_years * 365.2425`
  - **Weeks** = `days / 7`
  - **Months** = `remaining_years * 12`
  - **Years** = `remaining_years`
- Output both **two-decimal** values and **integer floors**.
- If `remaining_years <= 0`, set all to 0 and mark `"status":"beyond-average-expectancy"`.

## Output (JSON)
Return structured data and a purpose-centric message:
```json
{
  "inputs": {
    "birth_date": "1970-09-19",
    "country": "United States",
    "gender": "male",
    "source_year": 2023,
    "data_source": "World Bank WDI (cached 24h)"
  },
  "life_expectancy_years": 77.22,
  "age_years": 55.98,
  "journey": {
    "years": 21.24,
    "months": 254.83,
    "weeks": 1112.31,
    "days": 7786.29,
    "years_floor": 21,
    "months_floor": 254,
    "weeks_floor": 1112,
    "days_floor": 7786
  },
  "status": "ok",
  "fallback_used": null,
  "message": "You have approximately 7,786 purpose-days in your journey. What will you invest one day in today?"
}
```

## UX & Copy (purpose-first)
- **Title:** *Days on Purpose*  
- **Form fields:** Birth date, Country, Gender, [Calculate]  
- **Result card (example):**  
  - Headline: **Your Purpose Days**  
  - Subhead: “Approximate days for your journey, based on current averages.”  
  - Stats (large type, each computed separately):  
    - **Days:** 7,786  
    - **Weeks:** 1,112  
    - **Months:** 255  
    - **Years:** 21.24  
  - Footnote: “Based on latest life-expectancy at birth for United States (male, 2023). Statistical average, not an individual prediction.”  
- **Call to Action:**  
  - “Pick one purposeful action for today.”  
  - Quick actions: “Add a Goal,” “Schedule Today’s Micro-Win,” “Log a Reflection.”

## Purpose Features (lightweight, optional)
- **Daily Intention:** one-liner stored with date.
- **Micro-Wins:** checkbox list; streak counter.  
- **Quarterly Pillars:** up to 3 focus areas; show **Days per Pillar** (days ÷ 3).  
- **Reflection Prompts:** “What did I move forward today?” (≤140 chars).

## Validation & Edge Cases
- Reject invalid or future birth dates.
- Normalize country names and map aliases (“USA” → “United States”).
- Default gender to `total` if omitted.
- If unknown country after fuzzy match, use **global** average and return warning.
- If `status="beyond-average-expectancy"`, show a celebratory/legacy message (purpose-centric).

## Accessibility & Tone
- Neutral, supportive language; no fear-based copy.
- Avoid phrases like “time left” or “countdown.” Prefer **“days for your journey,” “invest today,” “purpose days.”**

## Testing (must include)
1. **Unit conversions**: given `remaining_years=1.00` → `days=365.2425`, `weeks=52.1775`, `months=12.0`.  
2. **Known data case**: seed `Japan female=88.00`, exact `age=40.00` → `remaining_years=48.00`, `months=576.00`, `weeks≈2501.64`, `days≈17531.64`.  
3. **Fallback path**: missing country+gender → use country total; assert `fallback_used`.  
4. **Unknown country**: “U.S.A.” → “United States” via fuzzy match.  
5. **Beyond expectancy**: `age=90`, `LE=80` → zeros + `"beyond-average-expectancy"`.

## Implementation Notes
- Must be implemented as a **Single Page Application (SPA)**.  
- **No backend**: all logic runs in the browser.  
- Use **Local Storage** to save and restore user’s birth date, gender, and region/country.  
- Cache life expectancy dataset in memory or Local Storage for performance.  
- One command to run (`npm start` or equivalent).  
- Keep **365.2425** in a shared config.  
- Separate **expectancy provider** from **calculator**; write provider unit tests.  
- Deliver a tiny **seed CSV** for demo and wire the app to read it.

## Stretch (optional)
- Regional comparison: “Your country vs global average (journey days).”
- Year selector to view changes (e.g., 2010 vs latest) for context.
- Shareable permalink encoding inputs + stat snapshot.

## Lovable.dev / Lovable AI — UI Build Instruction
**Goal:** Ship a compelling yet simple, responsive UI that keeps the focus on purpose, clarity, and action.

**Implementation prompt for Lovable.dev:**
> Build a responsive single‑page web app called **“Days on Purpose.”** Use a minimal, modern design. Provide a 3‑field form (Birth Date, Country, Gender) and a **Calculate** button. On submit, show a **Result Card** with four large stats (**Days, Weeks, Months, Years**) computed independently per the spec, a source footnote, and a positive, purpose‑centric message and CTA. Include robust validation, loading and error states, keyboard accessibility, and mobile‑first layout. Keep copy concise, avoid mortality framing, emphasize **“days for your journey.”**

**Design system & layout requirements:**
- **Layout:** Single column, centered, mobile‑first; max‑width ~720px; generous spacing.
- **Typography:** One clean sans‑serif; clear hierarchy (H1 title, H2 section headers, stat numbers in display size).
- **Color:** Neutral background, high‑contrast text; one accent color for primary actions and stat emphasis.
- **Components:**
  - **Form** with inputs: date picker (YYYY‑MM‑DD), country autocomplete with fuzzy match, gender select (female/male/total), primary button.
  - **Result Card** with four stat tiles (Days/Weeks/Months/Years), each computed independently; include integer floor and two‑decimal hover/alt text.
  - **Footnote** with source, country, gender, year.
  - **CTA row:** “Add a Goal,” “Schedule Today’s Micro‑Win,” “Log a Reflection” (stub buttons or links).
- **States:** Disabled button until form valid; spinner/progress on calculate; inline error messages; empty state copy.
- **Accessibility:** WCAG AA contrast; labels + descriptions; ARIA live region for results; full keyboard navigation; proper focus management on result render.
- **Internationalization:** Prepare strings for i18n; locale‑aware date parsing (display), but keep internal ISO calculations.
- **Performance:** Lightweight, no heavy frameworks required; lazy‑load data; cache expectancy dataset for 24h.
- **Testing hooks:** `data-testid` on inputs, button, and stat tiles to support e2e tests.
- **Deploy:** Static hosting capable (SPA) with cache headers.

**Copy blocks (ready to paste):**
- **Title:** Days on Purpose
- **Tagline:** Turn time into meaningful action.
- **Result headline:** Your Purpose Days
- **Result subhead:** Approximate days for your journey, based on current averages.
- **Disclaimer:** Statistical estimate, not an individual prediction.
- **Celebration (beyond expectancy):** You’ve surpassed the average—keep investing in what matters.

**Handover checklist:**
- [ ] Form validation & error states implemented
- [ ] Country normalization & fuzzy alias map wired
- [ ] Result Card shows all four units with separate calculations
- [ ] Source footnote includes country, gender, source year
- [ ] Accessibility audit passes (keyboard + screen reader)
- [ ] Basic unit/e2e tests green
