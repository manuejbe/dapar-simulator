# Testing
_Last updated: 2026-04-25_

## Summary

There are no tests of any kind in this codebase. No test framework is installed, no test files exist, and no test scripts appear in any configuration file. The project has no `package.json`, so there is no `test` script entry point at all. All validation of behavior is manual, performed by running `index.html` directly in a browser.

## Test Frameworks and Tools

None installed or configured.

- No `package.json` (no npm/yarn/pnpm ecosystem present)
- No `jest.config.*`, `vitest.config.*`, `playwright.config.*`, or equivalent
- No testing library imports anywhere in `js/` or `data/`
- No `node_modules/` directory

## Test Types Present

| Test Type   | Present | Notes                    |
|-------------|---------|--------------------------|
| Unit        | No      | —                        |
| Integration | No      | —                        |
| E2E         | No      | —                        |
| Snapshot    | No      | —                        |
| Manual      | Implied | Only validation method   |

## Test File Locations

No test files exist anywhere in the project tree. No `*.test.*` or `*.spec.*` files found.

## Coverage Approach

No coverage measurement. No Istanbul, V8, or any coverage tool is configured or runnable without first adding a test framework.

## Gaps / Unknowns

The following behaviors are entirely untested and represent the highest risk areas if the codebase is modified:

**`shuffle` in `js/app.js`** — Fisher-Yates implementation. Incorrect behavior would silently produce biased random selection. No unit test verifies distribution or output length.

**`selectAnswer` in `js/exam.js`** — Core answer-recording logic. Mutates `state`, triggers auto-advance timer, and conditionally calls `showSubmitPrompt`. Side-effect chain is complex and entirely untested.

**`findNextUnanswered` in `js/exam.js`** — Wrap-around search logic. Edge cases at boundaries (last question, all answered) have no test coverage.

**`showResults` in `js/results.js`** — Score aggregation iterates over all 54 state objects and produces section breakdowns. Incorrect index alignment between `session` and `state` would produce wrong scores silently.

**`escHtml` in `js/exam.js`** — The only security-relevant function in the codebase. Minimal three-replace implementation that does not handle single quotes or forward slashes. No tests verify completeness or regression-safety.

**Data file schema consistency** — All 223 question objects must conform to `{t, q, o, a, e}` with `a` in range `0–3` and `o.length === 4`. No validation or schema test enforces this. A malformed question object would produce a runtime rendering error visible only in the browser console.

### If tests are added

Because there is no build toolchain, the lowest-friction paths:

1. **Vitest** with `jsdom` environment — configure via `vitest.config.js`, add a `package.json`, convert data files to `export const` ES modules.
2. **Playwright** for E2E — requires Node.js but no changes to source files; tests drive the real browser against `index.html` served locally.

Priority test candidates in order of risk: `escHtml`, `shuffle`, `findNextUnanswered`, `selectAnswer` idempotency guard, `showResults` score calculation.
