# Architecture
_Last updated: 2026-04-25_

## Summary

Dapar Simulator is a zero-dependency, single-page browser application. It requires no server, no build step, and no package manager. Opening `index.html` in any modern browser is sufficient to run the app. All logic executes in the browser via vanilla JavaScript loaded through `<script>` tags.

## Architectural Pattern

**Multi-screen SPA with shared global state, no framework.**

The UI is divided into three mutually exclusive "screens" (`#screen-start`, `#screen-exam`, `#screen-results`), each defined as a `<div class="screen">` in `index.html`. Only one screen is visible at a time via the `.active` CSS class. Screen transitions are handled by `showScreen(id)` in `js/app.js`. There is no router, no component system, and no virtual DOM — all DOM manipulation is imperative.

## Major Components

### 1. Data Layer — `data/`

Three JS files each declare a single global `const` array:

- `data/questions_verbal.js` → `VERBAL_QUESTIONS` (~29 questions, analogies, antonyms, formal logic)
- `data/questions_math.js` → `MATH_QUESTIONS` (~40 questions: series, algebra, geometry, probability)
- `data/questions_abstract.js` → `ABSTRACT_QUESTIONS` (~31 questions: matrices, patterns/codes, spatial reasoning)

Each question object shape:
```js
{
  t: 'analogy',               // question type tag (string, metadata only)
  q: 'ÁRBOL : BOSQUE :: ?',   // question text (string, may contain \n)
  o: ['opt A', 'opt B', 'opt C', 'opt D'], // exactly 4 options
  a: 1,                       // zero-based index of correct answer
  e: 'Explanation text.'      // inline explanation shown after answering
}
```

### 2. App Orchestrator — `js/app.js`

Owns the top-level session state and lifecycle:

- **Global state variables** (module-scope, no encapsulation):
  - `BANK` — aggregates the three question arrays into `{ verbal, math, abstract }`
  - `session` — flat 54-question array for the current exam (verbal[0-17], math[18-35], abstract[36-53])
  - `state` — parallel array of per-question state: `{ answered, selected, flagged, correct }`
  - `current` — integer index into `session`/`state` for the currently displayed question
  - `timerInterval` — `setInterval` handle
  - `secondsLeft` — countdown integer (starts at 2400)
  - `examStartTime` — `Date.now()` snapshot for elapsed-time calculation

- **Key functions:**
  - `startExam()` — shuffles each bank, slices 18, builds flat `session`, initialises `state`, calls `buildNavGrids()`, `showScreen('exam')`, `renderQuestion()`, `startTimer()`
  - `shuffle(arr)` — Fisher-Yates in-place shuffle on a copy
  - `buildNavGrids()` — creates 54 sidebar nav buttons (`#qb-0`…`#qb-53`) grouped by section
  - `showScreen(id)` — removes `.active` from all `.screen` elements, adds it to `#screen-{id}`
  - `startTimer()` / `updateTimerDisplay()` — 1-second countdown; triggers `showResults()` at zero; applies `.warning` (< 10 min) and `.danger` (< 5 min) CSS classes to `#timer-display`
  - `navigate(dir)` / `goTo(idx)` — updates `current`, calls `renderQuestion()`; both cancel any pending auto-advance
  - `updateProgress()` — updates `#prog-text` and `#prog-fill` width
  - `confirmFinish()` — native `confirm()` dialog, then `showResults()`
  - `restartExam()` — returns to start screen
  - Keyboard listener — handles `1-4` (answer), `ArrowLeft`/`ArrowRight` (navigate), `F` (flag) while exam screen is active

### 3. Question Renderer & Interaction — `js/exam.js`

Handles all in-exam rendering and answer mechanics:

- **`renderQuestion()`** — fully rebuilds `#q-body` on every call. Renders question text, four choice buttons, and the feedback box. When already answered, choices are disabled and feedback is shown immediately.
- **`selectAnswer(idx)`** — marks the question answered in `state`, re-renders, then either triggers `showSubmitPrompt()` (if last/all answered) or starts a 1.2-second `setTimeout` auto-advance via `showAutoAdvanceBar()`.
- **`findNextUnanswered()`** — scans forward from `current`, wraps around; used by auto-advance.
- **`showAutoAdvanceBar()`** / **`cancelAutoAdvance()`** — appends/removes the auto-advance UI bar with a "stay here" cancel button.
- **`showSubmitPrompt()`** — appends a submission CTA button after all questions are answered.
- **`toggleFlag()`** — flips `state[current].flagged`, updates `#btn-flag` and the sidebar button's `.flagged` class.
- **`escHtml(str)`** — minimal XSS guard: escapes `&`, `<`, `>`.

### 4. Results Renderer — `js/results.js`

- **`showResults()`** — calculates elapsed time, total correct, and per-section scores from `state`/`session`. Populates `#score-pct`, `#score-raw`, per-section elements, and builds the full `#review-list` with one `.review-item` per question showing the user's answer, correct answer, and explanation.

### 5. Stylesheet — `css/styles.css`

444 lines of pure CSS. Uses CSS custom properties defined on `:root` for a dark military-green color palette and two Google Fonts (`Share Tech Mono`, `Oswald`). No CSS preprocessor or utility framework.

### 6. HTML Shell — `index.html`

112 lines. Declares all three screen `<div>`s with static markup. Inline `onclick` attributes call global functions. Scripts are loaded at the bottom in dependency order: data files first, then `results.js`, `exam.js`, `app.js` last.

## Data Flow

**Exam start:**
1. User clicks "INICIAR EXAMEN" → `startExam()` in `js/app.js`
2. Each bank is shuffled and sliced to 18 questions
3. `session[]` built as flat 54-item array; `state[]` initialised in parallel
4. `buildNavGrids()` creates DOM buttons for sidebar navigation
5. `showScreen('exam')` switches the visible screen
6. `renderQuestion()` paints question 0; `startTimer()` starts the countdown

**Answering a question:**
1. User clicks a choice button (or presses `1`-`4`) → `selectAnswer(idx)` in `js/exam.js`
2. `state[current]` mutated: `answered=true`, `selected=idx`, `correct=(idx===q.a)`
3. Sidebar nav button gets `.correct` or `.wrong` class
4. `renderQuestion()` called again — feedback box now shown; choices disabled
5. If not last/all-done: `showAutoAdvanceBar()` + `setTimeout(1200)` → `findNextUnanswered()` → update `current` → `renderQuestion()`
6. If last/all-done: `showSubmitPrompt()` appended

**Exam end:**
1. `showResults()` in `js/results.js` iterates `state`/`session`, computes scores, builds review DOM
2. `showScreen('results')` switches screen

**State management:**
All state is plain mutable variables in module scope across the three JS files. All files share state via global scope (scripts loaded in sequence into the same `window`). There is no encapsulation, event bus, or pub/sub.

## Entry Points & Bootstrapping

- **User entry:** `index.html` opened directly in a browser (no server required)
- **JS execution order** (bottom of `index.html`):
  1. `data/questions_verbal.js` — declares `VERBAL_QUESTIONS` globally
  2. `data/questions_math.js` — declares `MATH_QUESTIONS` globally
  3. `data/questions_abstract.js` — declares `ABSTRACT_QUESTIONS` globally
  4. `js/results.js` — declares `showResults()` globally
  5. `js/exam.js` — declares `renderQuestion()`, `selectAnswer()`, etc. globally
  6. `js/app.js` — declares all orchestration functions; attaches `keydown` listener; calls `updateTimerDisplay()` on load

The only code that runs on page load (outside a function) is `updateTimerDisplay()` at the end of `js/app.js`. Everything else is event-driven.

## Gaps / Unknowns

- No persistence — session state is entirely in memory; refreshing resets everything
- No module system — all functions and variables are globals on `window`; name collisions would silently overwrite
- The `t` (type) field in question objects is never read by any rendering or filtering logic — exists as metadata only
- Hard-coded counts (`54`, `18`, `40 * 60`) appear as literals in multiple files without a shared constant
- No error boundaries — malformed question objects would throw uncaught exceptions with no user-facing fallback
- No responsive/mobile layout confirmed — the sidebar is fixed at 240px wide
