---
name: Days on Purpose
description: Turn time into meaningful action.
colors:
  purpose-teal: "#2fb8a4"
  purpose-teal-deep: "#177a6c"
  night-field: "#0f1214"
  result-slate: "#15191b"
  panel-slate: "#1b2022"
  hairline-slate: "#2a3032"
  field-pewter: "#667377"
  page-white: "#f5f7f8"
  mist-grey: "#a3adb0"
  soft-coral: "#f87171"
  dawn-paper: "#f5f7f9"
  card-white: "#ffffff"
  dawn-panel: "#eef2f3"
  dawn-hairline: "#d5dcde"
  dawn-pewter: "#7d8a8e"
  ink-slate: "#182022"
  quiet-slate: "#4f5b5f"
  brick-red: "#b42318"
typography:
  hero-numeral:
    fontSize: "clamp(3.5rem, 15vw, 5.5rem)"
    fontWeight: 700
    lineHeight: 1
    letterSpacing: "-0.02em"
    fontFeature: "tnum"
  headline:
    fontSize: "clamp(2rem, 7vw, 2.75rem)"
    fontWeight: 700
    lineHeight: 1.15
  display:
    fontSize: "clamp(1.9rem, 4vw, 2.6rem)"
    fontWeight: 700
    lineHeight: 1.5
  title:
    fontFamily: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Ubuntu, 'Helvetica Neue', Arial, sans-serif"
    fontSize: "1.5rem"
    fontWeight: 600
    lineHeight: 1.3
  title-compact:
    fontFamily: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Ubuntu, 'Helvetica Neue', Arial, sans-serif"
    fontSize: "1.3rem"
    fontWeight: 600
    lineHeight: 1.3
  unit-figure:
    fontFamily: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Ubuntu, 'Helvetica Neue', Arial, sans-serif"
    fontSize: "1.25rem"
    fontWeight: 600
    lineHeight: 1.5
    fontFeature: "tnum"
  ticker-figure:
    fontFamily: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Ubuntu, 'Helvetica Neue', Arial, sans-serif"
    fontSize: "1.1rem"
    fontWeight: 600
    lineHeight: 1.1
    fontFeature: "tnum"
  lead:
    fontFamily: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Ubuntu, 'Helvetica Neue', Arial, sans-serif"
    fontSize: "1.05rem"
    fontWeight: 400
    lineHeight: 1.5
  body:
    fontFamily: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Ubuntu, 'Helvetica Neue', Arial, sans-serif"
    fontSize: "1rem"
    fontWeight: 400
    lineHeight: 1.5
  body-small:
    fontFamily: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Ubuntu, 'Helvetica Neue', Arial, sans-serif"
    fontSize: "0.9rem"
    fontWeight: 400
    lineHeight: 1.5
  caption:
    fontFamily: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Ubuntu, 'Helvetica Neue', Arial, sans-serif"
    fontSize: "0.85rem"
    fontWeight: 400
    lineHeight: 1.5
    fontFeature: "tnum"
  label:
    fontFamily: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Ubuntu, 'Helvetica Neue', Arial, sans-serif"
    fontSize: "0.8rem"
    fontWeight: 400
    lineHeight: 1.4
  micro-label:
    fontFamily: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Ubuntu, 'Helvetica Neue', Arial, sans-serif"
    fontSize: "0.72rem"
    fontWeight: 400
    lineHeight: 1.5
rounded:
  control: "0.55rem"
  button: "0.65rem"
  card: "1rem"
spacing:
  xs: "0.25rem"
  sm: "0.5rem"
  md: "0.75rem"
  form: "0.85rem"
  page: "1rem"
  divider: "1.1rem"
  card-gap: "1.25rem"
  section: "1.4rem"
  card-inline: "1.6rem"
  card-block: "1.75rem"
components:
  button-primary:
    backgroundColor: "{colors.purpose-teal}"
    textColor: "{colors.night-field}"
    typography: "{typography.body}"
    rounded: "{rounded.button}"
    padding: "0.85rem 1.2rem"
  button-primary-light:
    backgroundColor: "{colors.purpose-teal-deep}"
    textColor: "{colors.card-white}"
    typography: "{typography.body}"
    rounded: "{rounded.button}"
    padding: "0.85rem 1.2rem"
  button-primary-loading:
    backgroundColor: "{colors.panel-slate}"
    textColor: "{colors.mist-grey}"
    rounded: "{rounded.button}"
    padding: "0.85rem 1.2rem"
  button-secondary:
    textColor: "{colors.page-white}"
    typography: "{typography.body}"
    rounded: "{rounded.control}"
    padding: "0.7rem 1.1rem"
  button-secondary-compact:
    textColor: "{colors.page-white}"
    typography: "{typography.body-small}"
    rounded: "{rounded.control}"
    padding: "0.45rem 0.85rem"
  input-field:
    backgroundColor: "{colors.panel-slate}"
    textColor: "{colors.page-white}"
    typography: "{typography.body}"
    rounded: "{rounded.control}"
    padding: "0.65rem 0.8rem"
  input-field-light:
    backgroundColor: "{colors.dawn-panel}"
    textColor: "{colors.ink-slate}"
    typography: "{typography.body}"
    rounded: "{rounded.control}"
    padding: "0.65rem 0.8rem"
  result-card:
    backgroundColor: "{colors.result-slate}"
    textColor: "{colors.page-white}"
    rounded: "{rounded.card}"
    padding: "1.9rem 1.6rem 1.75rem"
  result-card-light:
    backgroundColor: "{colors.card-white}"
    textColor: "{colors.ink-slate}"
    rounded: "{rounded.card}"
    padding: "1.9rem 1.6rem 1.75rem"
  hero-figure:
    textColor: "{colors.purpose-teal}"
    typography: "{typography.hero-numeral}"
  hero-figure-light:
    textColor: "{colors.purpose-teal-deep}"
    typography: "{typography.hero-numeral}"
---

# Design System: Days on Purpose

## Overview

**Creative North Star: "The Morning Page"**

Days on Purpose reads like a journal opened at the start of a day: spare, quiet, and pointed at one intention. A single centred column holds three fields, one action, and one answer. The answer is a single large figure, the visitor's purpose days, followed by one question to act on today. Everything else on the result card (the other units, the live journey, sharing, the source note) sits beneath that figure in plain text separated by hairlines.

The page is dark by default (Night Field) and follows the operating system into a light scheme (Dawn Paper). Both schemes share one set of ten role tokens, so every surface, including the result card and the ticker, changes with the scheme. One accent, Purpose Teal, marks what matters: the primary action, the hero figure, the result frame, focus, and selection. The light scheme uses a deeper teal so the accent holds contrast on paper.

Depth is tonal and flat. There are no shadows, gradients, glows, or illustrations. The result card no longer boxes its parts into tiles or insets; its sections are divided by 1px hairlines and carried by type weight and size.

**Key Characteristics:**
- One centred 720px column; three fields, one button, one result card.
- One accent per scheme, reserved for action, the hero figure, the result frame, and focus.
- A single hero figure leads the result; supporting numbers are plain text in tabular figures.
- Sections inside the result card are divided by hairlines, not boxed.
- Two complete colour schemes driven by the same role tokens.

## Colors

A cool slate neutral field with a single teal accent, mirrored into a light paper scheme.

Each scheme sets the same ten CSS custom properties on the page root. The dark values are the default; the light values apply under `prefers-color-scheme: light`.

| Role (custom property) | Dark scheme | Light scheme |
|---|---|---|
| `--accent` | Purpose Teal | Deep Purpose Teal |
| `--on-accent` | Night Field | Card White |
| `--bg` | Night Field | Dawn Paper |
| `--card` | Result Slate | Card White |
| `--panel` | Panel Slate | Dawn Panel |
| `--hairline` | Hairline Slate | Dawn Hairline |
| `--field-border` | Field Pewter | Dawn Pewter |
| `--text` | Page White | Ink Slate |
| `--muted` | Mist Grey | Quiet Slate |
| `--danger` | Soft Coral | Brick Red |

### Primary
- **Purpose Teal** (purpose-teal): the dark-scheme accent. Fills the Calculate button, colours the hero figure, frames the result card, draws focus outlines, and tints the caret, native control accents, and text selection.
- **Deep Purpose Teal** (purpose-teal-deep): the light-scheme accent, in exactly the same roles. It holds about 5:1 against Card White, so white text sits on it and it works as text on paper.

### Neutral
- **Night Field** (night-field): the dark page background, and the text colour on Purpose Teal (about 7.6:1).
- **Result Slate** (result-slate): the dark result card surface, one step up from the page.
- **Panel Slate** (panel-slate): dark field fills, and the Calculate button while the dataset loads.
- **Hairline Slate** (hairline-slate): dark 1px dividers between result-card sections. Decorative only; never the sole edge of a control.
- **Field Pewter** (field-pewter): dark 1px borders on fields and secondary buttons, at 3:1 or better against every dark surface.
- **Page White** (page-white): dark-scheme primary text.
- **Mist Grey** (mist-grey): dark-scheme secondary text: tagline, form help, unit and ticker labels, the total-seconds line, the source note, and the footer.
- **Dawn Paper** (dawn-paper): the light page background.
- **Card White** (card-white): the light result card, and the text colour on Deep Purpose Teal.
- **Dawn Panel** (dawn-panel): light field fills and the loading button.
- **Dawn Hairline** (dawn-hairline): light 1px section dividers. Decorative only.
- **Dawn Pewter** (dawn-pewter): light 1px borders on fields and secondary buttons, at 3:1 or better.
- **Ink Slate** (ink-slate): light-scheme primary text.
- **Quiet Slate** (quiet-slate): light-scheme secondary text, in the same roles as Mist Grey.

### Error
- **Soft Coral** (soft-coral): the dark-scheme error line under the fields.
- **Brick Red** (brick-red): the light-scheme error line.

### Named Rules
**The One Accent Rule.** Each scheme has exactly one chromatic colour, its teal. It marks action, the hero figure, the result frame, and focus, and nothing decorative.

**The Paired Scheme Rule.** Every colour is applied through a role token that exists in both schemes. A surface never hard-codes a hex value, so nothing is left behind when the scheme flips.

**The Quiet Hierarchy Rule.** Secondary text uses the muted token (Mist Grey or Quiet Slate), never opacity on the primary text colour.

## Typography

**Body Font:** system-ui (with -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Ubuntu, Helvetica Neue, Arial, sans-serif)
**Display Font:** not yet chosen. The build currently renders the display roles (hero numeral, headline, display) in the body system stack. That is a known gap, not a rule for new surfaces.

**Character:** Plain, native text with weight doing the work. The hero figure carries the personality; the words around it stay calm.

### Hierarchy
- **Hero numeral** (700, clamp 3.5rem to 5.5rem, line-height 1, -0.02em, tabular figures): the purpose-days figure only, in the accent colour.
- **Headline** (700, clamp 2rem to 2.75rem, 1.15, balanced wrap): the "surpassed the average" heading that replaces the hero figure for visitors past the average.
- **Display** (700, clamp 1.9rem to 2.6rem): the page title.
- **Title** (600, 1.5rem, 1.3, max 30ch, balanced wrap): the reflection question on the result card and the "purpose days" unit beside the hero figure. Under 640px the question drops to **Title compact** (600, 1.3rem).
- **Unit figure** (600, 1.25rem, tabular figures): the weeks, months, years, and block values.
- **Ticker figure** (600, 1.1rem, 1.1, tabular figures): the live journey cells.
- **Lead** (400, 1.05rem): the tagline under the page title.
- **Body** (400, 1rem, 1.5): field text, the sub-line under the hero figure (max 60ch), the Calculate and Share buttons. Field labels use 500.
- **Body small** (400, 0.9rem): form help, the error line, and the Pause/Play toggle.
- **Caption** (400, 0.85rem, tabular figures): the "seconds to invest" total.
- **Label** (400, 0.8rem): unit labels, the source note (line-height 1.4), and the footer.
- **Micro label** (400, 0.72rem): the lowercase ticker labels under each cell.

### Named Rules
**The One Figure Rule.** The purpose-days figure is the only text at hero size on the result card. Every other number steps down to unit or ticker size.

**The Steady Digits Rule.** Every number that changes or lines up with others uses tabular figures, so the live ticker never jitters.

## Layout

**The One Screen Rule.** The form and the answer share one screen. A visitor never scrolls to see the number they just asked for.

The page is a grid with three areas: intro (header and form), result, and footer.

- **Wide (880px and up):** two columns inside a 1120px container, form column 300–360px and result column filling the rest, 3.5rem apart, vertically centred in a full-height (100dvh) frame with 1.5rem/2rem padding. The footer spans both columns at the bottom. Before a calculation, the result column holds a dashed-hairline placeholder ("Your purpose days will appear here.") so the layout does not jump. Focus moves to the result without scrolling. From 880–1199px the form column narrows to 280–320px with a 2rem gap. Below 1200px wide or 800px tall the card uses its compact internals (five-column units, seven-column journey with short labels); below 680px tall it also tightens padding, gaps, and the hero number, so the card stays fully visible down to 560px tall. Only the footer may fall below the fold.
- **Narrow (below 880px):** one 720px column, 1rem padding, areas stacked intro → result → footer with 1.4rem gaps. After Calculate, the form collapses into a one-line summary (date · country · gender) with an Edit button between hairlines, the tagline hides, and the page returns to the top so the card fits a 390×844 phone. Edit restores the form and focuses the birth date. Widening past 880px restores the form automatically.

The form is a vertical grid with 0.85rem gaps; each field stacks its label over the control with 0.25rem between. The header sits 1.1rem above the form (0.6rem when collapsed).

The result card is a vertical grid with 1.25rem gaps and padding of 1.9rem top, 1.6rem sides, 1.75rem bottom (1.35/1.15/1.25rem and 1rem gaps below 880px). The hero figure and its unit share a wrapping baseline row. The units row and the journey each start with padding above a hairline. On wide screens units wrap in a flex row (0.75rem by 1.75rem gaps) and journey cells wrap with 0.5rem by 1rem gaps; below 880px both become single rows of equal columns (5 and 7), and journey labels shorten (yrs, mos, wks, days, hrs, min, sec). The total line and the Pause/Play toggle share a footer row.

## Elevation & Depth

Flat. There are no shadows. Depth comes from tonal steps (page, then card, then field fill) and 1px lines: hairlines between sections, pewter borders on controls, and a single accent border around the result card, which is the page's only emphasis frame.

### Named Rules
**The No-Shadow Rule.** Surfaces separate by tone and 1px lines, never by drop shadow or glow.

## Shapes

Soft, rounded rectangles, with radius growing as the surface grows: fields and secondary buttons at 0.55rem, the Calculate button at 0.65rem, the result card at 1rem. The result region's focus ring follows the card's 1rem corner. There are no sharp corners, pills, or circles.

## Components

### Buttons
Calm and confident: one full-strength action per screen, with everything else drawn in outline.
- **Shape:** gently rounded (0.65rem primary, 0.55rem secondary).
- **Primary (Calculate):** accent fill with on-accent text, 600 weight, 1rem, 0.85rem by 1.2rem padding, no border.
- **Hover / Press / Focus:** brightness 1.08 on hover and 0.93 on press, with a 0.2s transition; 2px accent outline at 2px offset on focus.
- **Loading:** while the dataset loads the button is disabled, filled with the panel colour and muted text, and shows a progress cursor.
- **Secondary (Share):** transparent fill, primary-text colour, 1px field border, 600 weight, 1rem, 0.7rem by 1.1rem padding. The border turns accent on hover. After sharing, the label briefly confirms ("Link copied") and then returns.
- **Compact secondary (Pause/Play):** the same outline treatment at 0.9rem and 400 weight, 0.45rem by 0.85rem padding.

### Inputs / Fields
- **Style:** panel fill, 1px field border, 0.55rem radius, 0.65rem by 0.8rem padding, 1rem text. Native date and select controls, tinted with the accent for caret and accent colour.
- **Focus:** 2px accent outline at 2px offset.
- **Error:** a single error-colour line at 0.9rem under the fields (`role="alert"`); the date field is marked invalid and takes focus.

### Result Card (signature)
- **Corner Style:** 1rem.
- **Background:** the card colour (Result Slate or Card White).
- **Border:** 1px accent.
- **Shadow Strategy:** none (see Elevation & Depth).
- **Order:** hero figure with its unit, a muted sub-line, the reflection question, the units row, the journey, the Share button, and the source note. For visitors past the average, a headline replaces the figure and the units and journey are omitted.

### Units Row
A definition list of five plain values (weeks, months, years, 40-day blocks, 100-day blocks) in unit-figure type with muted labels beneath, opened by a hairline. No tiles, fills, or borders around individual values.

### Journey Ticker (signature)
Years, months, weeks, days, hours, minutes, and seconds in primary-text ticker figures with lowercase micro labels, updated each second, opened by a hairline. Below it, a muted total ("seconds to invest") and a Pause/Play toggle. Under reduced motion the ticker starts paused. It is the page's only continuous motion.

## Do's and Don'ts

### Do:
- **Do** keep each scheme's teal as its only accent, reserved for action, the hero figure, the result frame, and focus.
- **Do** apply every colour through a role token defined in both the dark and light blocks.
- **Do** use the on-accent token for text on the accent: Night Field on Purpose Teal, Card White on Deep Purpose Teal.
- **Do** use tabular figures for every number that changes or aligns.
- **Do** divide result-card sections with 1px hairlines and keep the values inside them unboxed.
- **Do** keep the source note visible under every result.
- **Do** give fields and outline buttons the field-border token so their edges hold 3:1.

### Don't:
- **Don't** put Purpose Teal (#2fb8a4) on the light scheme's paper or white surfaces; the light scheme uses Deep Purpose Teal.
- **Don't** use a hairline token as the only edge of a control; hairlines are dividers.
- **Don't** add shadows, gradients, or glows.
- **Don't** reintroduce stat tiles or boxed insets on the result card; one hero figure leads and everything else is plain text.
- **Don't** label anything "countdown", "remaining", or "left"; the ticker is a journey, not a clock running out.
- **Don't** add a second accent colour or decorative illustration to the calculator.
