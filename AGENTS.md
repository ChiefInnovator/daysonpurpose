# Days on Purpose — agent rules

## Branching
- `main` is the deployed branch (GitHub Pages). It only accepts PRs from `develop`.
- `develop` only accepts PRs from `feature/*` branches.
- Start all work on `feature/<short-name>` cut from `develop`; open the PR against `develop`.
- Promote by opening a `develop` → `main` PR (merge commit only).
- Enforced by repo rulesets plus the `branch-policy` workflow (`source-branch` check).
- Copilot code review runs automatically on PRs into `develop` only.

## Code layout
- Static site, no build. `index.html` (markup + CSS) loads `src/main.js` as an ES module.
- Only `src/ui.js` and `src/main.js` touch the DOM; `config`, `calculator`, `countries`, `provider` stay pure so tests can import them.
- All asset URLs are document-relative (Pages serves under `/daysonpurpose/`). No absolute URLs in `src/` (enforced by `tests/privacy.test.js`).
- Tests: `npm test` (Node 22+, `node:test`, no dependencies).
- Data changes only via `python3 scripts/build_dataset.py`; never hand-edit `data/lifeexpectancy.csv`.
- Design context: `PRODUCT.md`, `DESIGN.md`. Design record: `docs/designs/`.
