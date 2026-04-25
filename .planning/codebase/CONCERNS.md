# Codebase Concerns
_Last updated: 2026-04-25_

## Summary

Dapar Simulator is a deliberately minimal vanilla JS browser app with no build system, no tests, no dependencies, and no backend. Most concerns are structural rather than catastrophic — the app works correctly for its intended purpose. The primary risks are maintainability fragility (global state, magic numbers, no validation), a thin but genuine XSS surface, a poor mobile experience at narrow widths, and the complete absence of persistence, error handling, or data-integrity checks on question objects. None of these are blockers for the current use case; all would become problems at the next stage of growth.

## Technical Debt

**[HIGH] Magic numbers scattered across multiple files with no shared constants**
The values `54` (total questions), `18` (per-section count), and `2400` (`40 * 60` seconds) are repeated as bare literals in `js/app.js`, `js/results.js`, and `index.html`. Changing the exam format requires hunting and updating every occurrence with no compile-time safety net.

**[HIGH] All state is unencapsulated global scope**
Every variable (`session`, `state`, `current`, `timerInterval`, `secondsLeft`, `examStartTime`, `autoAdvanceTimer`) and every function is a property of `window`. Adding any third-party script creates an undetected collision risk. There is no namespace, no IIFE wrapper, and no ES module (`type="module"`).

**[MED] The question type field `t` is never consumed**
Every question object carries a `t` property (`'analogy'`, `'antonym'`, `'series'`, `'matrix'`, etc.). No rendering, filtering, scoring, or results logic reads it. It exists in all 223 entries as dead weight — or an abandoned plan for type-based filtering.

**[MED] No input validation on question objects**
`renderQuestion()` and `showResults()` trust that every question has valid `q`, `o` (exactly 4 items), `a` (integer 0–3), and `e` fields. A malformed object would throw an uncaught `TypeError` or silently render broken UI. With 223 manually authored objects the probability of a typo is non-trivial.

**[MED] `restartExam()` does not reset state**
`restartExam()` calls `showScreen('start')` and nothing else. Global variables are left with previous exam values. The `timerInterval` is particularly risky: if ever called while the timer is running, a zombie interval would continue firing.

**[MED] `renderQuestion()` does full DOM teardown on every call**
`body.innerHTML = ''` wipes the entire question body on every render, including navigating to already-answered questions. Not a performance problem at 54 questions, but it causes keyboard focus loss on every navigation.

**[LOW] `escHtml` implicit cross-file dependency**
`escHtml` is defined in `js/exam.js` and called from `js/results.js` via shared global scope — fragile if the load order ever changes.

**[LOW] Sidebar nav grid is hardwired to 3 sections × 18 questions**
Section count, question count per section, and section names are all embedded in `buildNavGrids()` with no abstraction. Any format change requires rewriting multiple locations.

**[LOW] `showSubmitPrompt()` does not guard against duplicate insertion**
The function appends a `.submit-prompt` div without checking whether one already exists. A timing edge case could produce two submit buttons.

## Security Concerns

**[MED] Correct answers are fully exposed in client-side source**
All 223 question objects including `a` (correct answer index) and `e` (explanation) are loaded as plain JS globals before the exam starts. Any user opening DevTools can read every correct answer. Acceptable for a personal study tool; disqualifying for any proctored or scored context.

**[MED] `escHtml` escapes only three characters**
`escHtml` replaces `&`, `<`, and `>` but not `"` or `'`. Currently all question text is placed in `innerHTML` as content (not attributes), so existing escaping is sufficient. But a future developer adding attribute-context interpolation would have a false sense of safety.

**[LOW] Inline `onclick` attributes on all interactive elements**
`index.html` uses `onclick="startExam()"`, `onclick="confirmFinish()"`, etc. A strict Content Security Policy blocking `unsafe-inline` would break all button functionality.

## Performance Concerns

**[LOW] Full DOM rebuild on every question navigation**
`renderQuestion()` reconstructs all DOM nodes on every call, including for already-answered questions. Imperceptible at 54 short-text questions; relevant only if question content grows to include images or complex markup.

**[LOW] Results screen builds 54 review items in a single synchronous loop**
`showResults()` appends 54 `.review-item` divs without batching. Fine at current scale; would cause a noticeable paint delay at hundreds of items.

**[LOW] Google Fonts loaded unconditionally from CDN**
No `font-display` strategy is set. Offline or slow CDN causes layout shift; JS execution is unblocked but the visual experience degrades.

## Missing Infrastructure

- **No persistence.** Refreshing loses all exam progress. No `localStorage` save, no URL state, no session cookie.
- **No error handling.** No `try/catch` anywhere. Any runtime exception propagates to an uncaught error and leaves the UI in a broken state.
- **No tests.** No unit, integration, or E2E tests. Regressions in shuffle, scoring, or auto-advance logic are only caught manually.
- **No build or lint toolchain.** No `package.json`, no ESLint, no Prettier. Code style is consistent only by convention.
- **No question data validation script.** 223 manually authored question objects with no automated check that each has required fields, `a` in range `[0, 3]`, and `o.length === 4`.
- **No offline support / PWA manifest.** App works fully offline structurally, but has no service worker or `manifest.json`, and the Google Fonts CDN dependency breaks fully offline use.
- **No mobile layout below 700px.** The single `@media (max-width: 700px)` breakpoint narrows the sidebar but does not collapse it. At 375px (iPhone SE), the two-column exam layout, 6-column nav grid, and sub-`0.7rem` font sizes are not usable.

## Recommendations

1. **Data integrity script (highest impact/effort ratio)** — Write a Node.js or browser console one-liner that validates all question array entries against the required shape. Run before any data edits.

2. **Shared config constant** — Add `const CONFIG = { PER_SECTION: 18, SECTIONS: 3, DURATION_S: 2400 }` at the top of `js/app.js` and replace all hardcoded literals across `js/app.js`, `js/results.js`, and sync the `index.html` copy.

3. **`localStorage` persistence** — Serialize `session` and `state` after each answer. On load, check for a saved session and offer to resume. Highest-impact UX gap for a study tool.

4. **Namespace or ES modules** — Wrap all JS in an IIFE or convert to `type="module"` with `import`/`export`. Eliminates global pollution and makes `escHtml` dependency explicit.

5. **`try/catch` in render functions** — Wrap `renderQuestion()` and `showResults()` bodies to show a user-friendly error message rather than silently breaking.

6. **Mobile layout pass** — Add a breakpoint at `max-width: 480px` that collapses the sidebar, increases minimum font sizes to `0.85rem`, and makes nav buttons usable at phone scale.

7. **Replace `confirm()` with in-page modal** — The native finish confirmation dialog is visually jarring, cannot be styled, and is blocked in sandboxed iframes.

## Gaps / Unknowns

- **Question bank accuracy.** `questions_abstract.js` contains at least one explanation with visible mid-edit reasoning (`"Espera: verificando la regla..."`), suggesting manual authoring errors may exist elsewhere. Answers and explanations have not been independently verified.
- **Intended deployment context.** Structure suggests local/desktop use only. If ever hosted, inline `onclick` attributes and absence of a CSP header should be revisited.
- **The `t` field future intent.** Unknown whether type-based filtering was planned and abandoned or is still on the roadmap.
- **Font fallback behavior.** No testing done with system fonts only (offline/CDN failure). The `Share Tech Mono`/`Oswald` combination drives the visual identity; fallback fonts will change proportions and may break the fixed-width sidebar layout.
