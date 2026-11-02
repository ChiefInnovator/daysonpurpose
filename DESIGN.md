---
name: Days on Purpose
description: Turn time into meaningful action.
colors:
  purpose-teal: "#2fb8a4"
  night-field: "#0f1214"
  result-slate: "#15191b"
  panel-slate: "#1b2022"
  hover-slate: "#222a2c"
  hairline-slate: "#2a3032"
  page-white: "#f5f7f8"
  soft-coral: "#f87171"
  dawn-paper: "#f5f7f9"
  ink-slate: "#182022"
  card-white: "#ffffff"
typography:
  display:
    fontFamily: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Ubuntu, 'Helvetica Neue', Arial, sans-serif"
    fontSize: "clamp(1.9rem, 4vw, 2.6rem)"
    fontWeight: 700
    lineHeight: 1.2
  headline:
    fontFamily: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Ubuntu, 'Helvetica Neue', Arial, sans-serif"
    fontSize: "2.15rem"
    fontWeight: 700
    lineHeight: 1.15
  stat-numeral:
    fontFamily: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Ubuntu, 'Helvetica Neue', Arial, sans-serif"
    fontSize: "2.25rem"
    fontWeight: 600
    lineHeight: 1
    letterSpacing: "0.5px"
    fontFeature: "tnum"
  title:
    fontFamily: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Ubuntu, 'Helvetica Neue', Arial, sans-serif"
    fontSize: "1.25rem"
    fontWeight: 400
    lineHeight: 1.35
  body:
    fontFamily: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Ubuntu, 'Helvetica Neue', Arial, sans-serif"
    fontSize: "1rem"
    fontWeight: 400
    lineHeight: 1.5
  label:
    fontFamily: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Ubuntu, 'Helvetica Neue', Arial, sans-serif"
    fontSize: "0.72rem"
    fontWeight: 400
    lineHeight: 1.35
    letterSpacing: "0.05em"
rounded:
  field: "0.55rem"
  button: "0.65rem"
  inset: "0.9rem"
  card: "1rem"
  tile: "1.1rem"
spacing:
  xs: "0.25rem"
  sm: "0.5rem"
  md: "0.85rem"
  lg: "1.25rem"
  xl: "1.4rem"
  page: "1rem"
components:
  button-primary:
    backgroundColor: "{colors.purpose-teal}"
    textColor: "{colors.card-white}"
    rounded: "{rounded.button}"
    padding: "0.85rem 1.2rem"
  input-field:
    backgroundColor: "{colors.panel-slate}"
    textColor: "{colors.page-white}"
    rounded: "{rounded.field}"
    padding: "0.65rem 0.8rem"
  result-card:
    backgroundColor: "{colors.result-slate}"
    rounded: "{rounded.card}"
    padding: "1.75rem 1.6rem 1.9rem"
  stat-tile:
    backgroundColor: "{colors.panel-slate}"
    textColor: "{colors.purpose-teal}"
    typography: "{typography.stat-numeral}"
    rounded: "{rounded.tile}"
    padding: "0.85rem"
  journey-ticker:
    backgroundColor: "{colors.panel-slate}"
    textColor: "{colors.purpose-teal}"
    rounded: "{rounded.inset}"
    padding: "1rem 0.75rem 0.85rem"
---

# Design System: Days on Purpose

## Overview

**Creative North Star: "The Morning Page"**

Days on Purpose should read like a journal opened at the start of a day: spare, quiet, and pointed at one intention. A single centred column holds three fields, one action, and one answer. Nothing competes with the number the visitor came for, and nothing in the frame suggests fear or urgency.

The incumbent page is dark by default (Night Field) and follows the operating system into a light scheme (Dawn Paper). One accent, Purpose Teal, marks what matters: the primary action, every result numeral, and focus. Surfaces are flat and separated by tone and hairline borders, never by shadow. Type is the platform's own system sans, so the page feels native and loads nothing.

The light scheme is only partly applied today: the result card, ticker, and total box stay dark when the rest of the page turns light. That is a known defect, not a design choice (see Do's and Don'ts).

**Key Characteristics:**
- One column, 720px maximum, mobile first.
- One accent colour, used for action, numerals, and focus only.
- Flat tonal layering; no shadows anywhere.
- System sans throughout; numerals in tabular figures.
- Calm, generous rounding that grows with the size of the surface.

## Colors

A near-black slate field with one clear teal, and a pale paper scheme for light mode.

### Primary
- **Purpose Teal** (`purpose-teal`): the only accent. Fills the Calculate button; colours every stat numeral, ticker digit, and separator; draws the result-card border and all focus outlines.

### Neutral
- **Night Field** (`night-field`): dark-scheme page background.
- **Result Slate** (`result-slate`): the result card's inner surface, one step lighter than the field.
- **Panel Slate** (`panel-slate`): inputs, stat tiles, ticker, and total box.
- **Hover Slate** (`hover-slate`): hover and focus fill for list suggestions (currently unused; the suggestion list was removed).
- **Hairline Slate** (`hairline-slate`): 1px borders on inputs, tiles, and insets.
- **Page White** (`page-white`): dark-scheme text.
- **Dawn Paper** (`dawn-paper`): light-scheme page background.
- **Ink Slate** (`ink-slate`): light-scheme text.
- **Card White** (`card-white`): light-scheme inputs and stat tiles; current button text.

### Semantic
- **Soft Coral** (`soft-coral`): inline error text.

### Named Rules
**The One Voice Rule.** Purpose Teal is the only chromatic colour. It marks action, results, and focus, and nothing decorative.

**The Quiet Hierarchy Rule.** Secondary text is made quieter with opacity (0.55–0.85) on the base text colour, not with new greys.

## Typography

**Display Font:** system-ui (with -apple-system, Segoe UI, Roboto, Ubuntu, Helvetica Neue, Arial, sans-serif)
**Body Font:** the same system stack

**Character:** One native sans in a few weights. The numerals carry the personality; the words stay plain.

### Hierarchy
- **Display** (700, clamp(1.9rem, 4vw, 2.6rem)): the page title "Days on Purpose".
- **Headline** (700, 2.15rem, 1.15; 1.75rem under 640px): "Your Purpose Days" on the result card.
- **Stat numeral** (600, 2.25rem, 1, tabular; ticker 1.85rem, total 2.1rem): every result number, in Purpose Teal.
- **Title** (400, 1.25rem, 1.35, max 60ch): the purpose message under the stats.
- **Body** (400, 1rem, 1.5): fields, tagline (1.05rem), form help (0.9rem).
- **Label** (400, 0.72rem, 0.05em, uppercase): stat and ticker unit labels; ticker labels use 0.6rem with 0.08em.

### Named Rules
**The Numerals Lead Rule.** Result numbers are always the largest, heaviest text on the card and always use tabular figures, so a live ticker never jitters.

## Layout

A single centred column (max-width 720px, 1rem side padding, 2.25rem bottom). The form is a vertical grid with 0.85rem gaps; each field stacks label over control with 0.25rem between. The result card is a grid with 1.4rem gaps. Stat tiles flow in an auto-fit grid (min 170px; 140px under 640px) with 1.25rem gaps (1rem under 640px). The ticker wraps cells with separators and shrinks its digits under 520px. The result card scrolls into view and takes focus when a result renders.

## Elevation & Depth

Flat. There are no shadows. Depth comes from three tonal steps (Night Field → Result Slate → Panel Slate) and 1px Hairline Slate borders. The result card alone gets a 1px Purpose Teal border, which is the page's only emphasis frame.

### Named Rules
**The No-Shadow Rule.** Surfaces separate by tone and hairline, never by drop shadow or glow.

## Shapes

Soft, rounded rectangles throughout, with radius growing as the surface grows: fields 0.55rem, button 0.65rem, ticker and total insets 0.9rem, result card 1rem, stat tiles 1.1rem. No sharp corners, no pills, no circles.

## Components

### Buttons
Calm and confident: one full-strength action per screen.
- **Shape:** gently rounded (0.65rem).
- **Primary:** Purpose Teal fill, 600 weight, 1rem, 0.85rem × 1.2rem padding, no border.
- **Hover / Focus:** brightness 1.08 on hover, 0.93 on press; 2px Purpose Teal outline offset 2px on focus.
- **Disabled:** 55% opacity, not-allowed cursor; the button stays disabled until all fields are valid.

### Cards / Containers
- **Corner Style:** 1rem on the result card; 1.1rem on stat tiles; 0.9rem on ticker insets.
- **Background:** Result Slate for the card; Panel Slate for tiles and insets.
- **Shadow Strategy:** none (see Elevation & Depth).
- **Border:** 1px Purpose Teal on the result card; 1px Hairline Slate on tiles and insets.
- **Internal Padding:** card 1.75rem/1.6rem; tiles 0.85rem; insets 1rem/0.75rem.

### Inputs / Fields
- **Style:** Panel Slate fill (Card White in light mode), 1px Hairline Slate border, 0.55rem radius, 1rem text.
- **Focus:** 2px Purpose Teal outline, 2px offset.
- **Error:** a single Soft Coral alert line under the fields (`role="alert"`).
- **Date picker:** the native calendar icon is inverted to white in dark mode.

### Stat Tile (signature)
A small Panel Slate tile: uppercase unit label, a large Purpose Teal numeral (the floor value), and a quiet "precise" line with two decimals. Six tiles: days, weeks, months, years, 40-day blocks, 100-day blocks.

### Journey Ticker (signature)
A Panel Slate inset showing years : months : weeks : days : hours : minutes : seconds in Purpose Teal tabular numerals with tiny uppercase labels, updated each second, followed by a separate total-seconds inset. It is the page's only motion besides the result scroll.

## Do's and Don'ts

### Do:
- **Do** keep Purpose Teal as the only accent, reserved for action, numerals, and focus.
- **Do** use tabular figures for every number that changes.
- **Do** separate surfaces by tone and 1px hairlines.
- **Do** keep the disclaimer and source footnote visible under every result.
- **Do** make every surface follow the active colour scheme, including the result card and ticker.

### Don't:
- **Don't** put white text on Purpose Teal: it measures about 2.5:1, below WCAG AA. Use Night Field text on the teal (about 7.6:1).
- **Don't** use Purpose Teal for text on Dawn Paper or Card White without darkening it: it fails 3:1 even for large numerals.
- **Don't** add shadows, gradients, or glows.
- **Don't** label anything "countdown", "remaining", or "left"; the ticker is a journey, not a clock running out.
- **Don't** add a second accent colour or decorative illustration to the calculator.
