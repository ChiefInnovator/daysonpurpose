# Days on Purpose — agent rules

## Branching
- `main` is the deployed branch (GitHub Pages). It only accepts PRs from `develop`.
- `develop` only accepts PRs from `feature/*` branches.
- Start all work on `feature/<short-name>` cut from `develop`; open the PR against `develop`.
- Promote by opening a `develop` → `main` PR (merge commit only).
- Enforced by repo rulesets plus the `branch-policy` workflow (`source-branch` check).
- Copilot code review runs automatically on PRs into `develop` only.
