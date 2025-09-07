# Days on Purpose

Turn time into meaningful action.

## Overview
Days on Purpose is a single-page web application that helps users frame their lives around purposeful action. By entering your birth date, country, and gender, the app estimates your "Purpose Days"—the number of days, weeks, months, and years remaining in your journey, based on the latest life expectancy data. The focus is on clarity, momentum, and investing each day in what matters.

## Features
- **Purpose Days Calculator:** Enter birth date, country, and gender to calculate remaining days, weeks, months, and years, using up-to-date life expectancy data.
- **Purpose-Centric Messaging:** Positive, supportive copy that emphasizes action and meaning, not mortality.
- **Fallbacks & Validation:** Robust handling for missing or unknown countries/genders, with clear fallback logic and celebratory messaging for those beyond average expectancy.
- **Local Storage:** Saves user inputs and caches life expectancy data for performance.
- **Accessibility:** Keyboard navigation, ARIA live regions, and WCAG AA contrast.
- **Responsive UI:** Mobile-first, single-column layout with clear hierarchy and accent color.
- **Testing Hooks:** Includes unit conversion tests and e2e testing support.

## Usage
1. Enter your birth date, country, and gender.
2. Click **Calculate** to view your Purpose Days.
3. Review your stats and take a purposeful action for today.

## Example Output
```
You have approximately 7,786 purpose-days in your journey. What will you invest one day in today?
```

## Implementation Notes
- SPA, no backend; all logic runs in the browser.
- Life expectancy data from WHO/World Bank/UN (bundled CSV or API with cache).
- All calculations use 365.2425 days/year.
- Accessible, internationalized, and ready for static hosting.

## For Developers
- See `specs/days_on_purpose_spec.md` for full requirements, UX, and testing details.
- Seed CSV and wire-up instructions included in the spec.

## UI Example
See `specs/userinterface example.png` for a sample layout.