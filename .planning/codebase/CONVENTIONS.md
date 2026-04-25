# Code Conventions
_Last updated: 2026-04-25_

## Summary

The codebase is a vanilla JavaScript/HTML/CSS single-page application with no build toolchain, no bundler, no linter, and no formatter configured. Conventions are consistent and readable but entirely informal — enforced by the author's habits, not by tooling. The JS surface area is small (351 lines across three files), making the patterns easy to observe and replicate.

## Naming Conventions

### JavaScript

**Variables and functions — camelCase throughout.**

```js
let session = [];
let timerInterval = null;
let secondsLeft   = 40 * 60;
let autoAdvanceTimer = null;

function startExam() { ... }
function buildNavGrids() { ... }
function findNextUnanswered() { ... }
```

**Constants — camelCase `const` for local values; SCREAMING_SNAKE_CASE for module-level data banks.**

```js
const VERBAL_QUESTIONS   = [ ... ];
const MATH_QUESTIONS     = [ ... ];
const ABSTRACT_QUESTIONS = [ ... ];

const BANK = { verbal: VERBAL_QUESTIONS, math: MATH_QUESTIONS, abstract: ABSTRACT_QUESTIONS };
```

**Question object fields — single-letter abbreviated keys.**

| Key | Meaning       | Type         |
|-----|---------------|--------------|
| `t` | question type | string       |
| `q` | question text | string       |
| `o` | options array | string[4]    |
| `a` | answer index  | number (0–3) |
| `e` | explanation   | string       |

**State object fields — full English words.**

```js
state = session.map(() => ({ answered: false, selected: -1, flagged: false, correct: false }));
```

**DOM element IDs — kebab-case.** Examples: `timer-display`, `q-num-label`, `btn-flag`, `grid-verbal`, `prog-fill`, `screen-start`, `score-pct`, `review-list`.

**CSS classes — kebab-case**, with BEM-like element suffixes where logical (`.review-item`, `.review-item-hdr`, `.review-answers`, `.sec-score-card`, `.sec-bar-fill`).

**Section identifiers — lowercase string keys** (`'verbal'`, `'math'`, `'abstract'`) used consistently across JS objects, CSS class names, and DOM IDs.

## Code Style Patterns

- `const` for all values not reassigned after declaration; `let` for mutable state and loop counters; `var` never used.
- Arrow functions for callbacks and array method callbacks only; top-level named functions use `function` declarations.
- Spread for immutable array copying: `const a = [...arr]`; spread to attach `section` property to question objects.
- Destructuring for Fisher-Yates swap: `[a[i], a[j]] = [a[j], a[i]]`.
- Dynamic UI built via `document.createElement` + property assignment + `appendChild`. `innerHTML` used only for controlled template strings after `escHtml` sanitization.
- Template literals for multi-value interpolation; `+` concatenation for single values.
- CSS custom properties on `:root` for all colors, fonts, and core spacing — no magic values in rules.
- `css/styles.css` organized into labeled comment banner sections (`/* ── HEADER ── */`, `/* ── EXAM LAYOUT ── */`, etc.).
- Data files group questions by sub-type with banner comments: `// ─── ANALOGÍAS ──────`.

## Comment and Documentation Patterns

- **In-file section banners** used in both JS and CSS with Unicode box-drawing characters.
- **No JSDoc** — functions are short and considered self-documenting.
- **No inline comments** within function bodies.
- **HTML comments** used for major screen block labels using ASCII-art dividers.

## Error Handling Patterns

No explicit error handling in the codebase. No `try/catch`, no `console.error`, no custom `Error` throws.

Defensive logic is handled via guard clauses:

```js
// Bounds check
function navigate(dir) {
  const next = current + dir;
  if (next < 0 || next >= session.length) return;
  ...
}

// Already-answered guard
function selectAnswer(idx) {
  if (state[current].answered) return;
  ...
}
```

HTML output safety is handled by `escHtml` defined in `js/exam.js` and called wherever question or option text is rendered into `innerHTML`:

```js
function escHtml(str) {
  return str.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
}
```

## State Management Patterns

All runtime state lives as module-level variables in `js/app.js`. All three JS files share the same global scope — no modules, no closures, no framework.

**State mutation — direct property assignment**, followed immediately by a re-render call:

```js
s.answered = true;
s.selected = idx;
s.correct  = idx === session[current].a;
renderQuestion();
updateProgress();
```

**Screen state tracked exclusively via CSS class on DOM**, not in JS:

```js
function showScreen(id) {
  document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
  document.getElementById('screen-' + id).classList.add('active');
}
```

## Gaps / Unknowns

- No linter or formatter config — consistent style enforced by convention only; any new contributor could introduce inconsistencies undetected.
- `escHtml` is defined in `exam.js` but called from `results.js` via shared global scope — `results.js` loads before `exam.js`, so `escHtml` is declared after `showResults`, which works at call time but is fragile.
- Magic numbers (`54`, `18`, `2400`, `1200`, `300`, `600`) appear hardcoded at multiple call sites with no named constants.
- No module system — adding a file that accidentally reuses a variable name (`session`, `state`, `current`) would silently corrupt the application.
