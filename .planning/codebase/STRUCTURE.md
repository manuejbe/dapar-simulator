# File & Folder Structure
_Last updated: 2026-04-25_

## Summary

The project is a flat, hand-organized static web app with 8 source files across 3 directories. There are no generated artifacts, no build output folder, and no lock files. The entire runnable application is ~1,238 lines. All files are authored by hand and are also the production files.

## Top-Level Layout

```
Dapar Simulator/
├── index.html                  # Single HTML shell; all three screens defined here
├── css/
│   └── styles.css              # Complete stylesheet (444 lines), dark military theme
├── js/
│   ├── app.js                  # Session orchestration, timer, navigation (135 lines)
│   ├── exam.js                 # Question rendering, answer selection, auto-advance (158 lines)
│   └── results.js              # Results calculation and review DOM (58 lines)
├── data/
│   ├── questions_verbal.js     # VERBAL_QUESTIONS array (~29 questions, 126 lines)
│   ├── questions_math.js       # MATH_QUESTIONS array (~40 questions, 109 lines)
│   └── questions_abstract.js   # ABSTRACT_QUESTIONS array (~31 questions, 96 lines)
├── README.md                   # Setup and feature overview
├── .gitignore                  # Ignores .DS_Store, Thumbs.db, node_modules, logs, .vscode
├── .planning/
│   └── codebase/               # GSD codebase analysis documents
└── .claude/
    └── settings.local.json     # Claude Code local settings
```

## Key Files

| File | Role | Size |
|---|---|---|
| `index.html` | Entry point; static HTML skeleton for all three screens | 112 lines |
| `css/styles.css` | All visual styling; CSS variables for theming | 444 lines |
| `js/app.js` | Core orchestrator: state, session, timer, keyboard shortcuts | 135 lines |
| `js/exam.js` | Question UI: render, answer, flag, auto-advance | 158 lines |
| `js/results.js` | Results screen: scoring and review list | 58 lines |
| `data/questions_verbal.js` | Verbal question bank (analogies, antonyms, logic) | 126 lines |
| `data/questions_math.js` | Math question bank (series, algebra, geometry, probability) | 109 lines |
| `data/questions_abstract.js` | Abstract question bank (matrices, patterns, spatial) | 96 lines |

## Naming Conventions

**Files:**
- `snake_case` for data files: `questions_verbal.js`, `questions_math.js`, `questions_abstract.js`
- Single-word names for JS logic files: `app.js`, `exam.js`, `results.js`
- Single stylesheet: `styles.css`
- Planning/meta documents: `SCREAMING_SNAKE_CASE.md` under `.planning/codebase/`

**JS globals (declared by data files):**
- `SCREAMING_SNAKE_CASE` for question bank constants: `VERBAL_QUESTIONS`, `MATH_QUESTIONS`, `ABSTRACT_QUESTIONS`
- `BANK` (aggregate object in `js/app.js`)
- `camelCase` for all other variables: `session`, `state`, `current`, `timerInterval`, `secondsLeft`, `examStartTime`, `autoAdvanceTimer`

**Functions:**
- `camelCase` throughout: `startExam`, `renderQuestion`, `selectAnswer`, `showResults`, `toggleFlag`, `findNextUnanswered`, `showAutoAdvanceBar`, `cancelAutoAdvance`, `confirmFinish`, `restartExam`

**CSS classes:**
- `kebab-case`: `.q-body`, `.q-btn`, `.choice-letter`, `.auto-advance-bar`, `.sec-score-card`, `.review-item`
- State modifier classes added imperatively: `.active`, `.correct`, `.wrong`, `.flagged`, `.current`, `.danger`, `.warning`, `.disabled`

**HTML IDs:**
- Prefixed by screen or component area: `screen-start`, `screen-exam`, `screen-results`
- `grid-verbal`, `grid-math`, `grid-abstract` (sidebar grids)
- `sec-verbal-pct`, `sec-math-bar`, etc. (results section elements)
- `qb-{index}` (sidebar nav buttons, 0-indexed, 0–53)

**Question object fields:**
- Single-letter abbreviated keys: `t` (type), `q` (question text), `o` (options array), `a` (answer index), `e` (explanation)

## Where to Find Things

| What | Where |
|---|---|
| Screen HTML markup | `index.html` — `#screen-start` (lines 13-28), `#screen-exam` (31-68), `#screen-results` (71-103) |
| Timer logic | `js/app.js` — `startTimer()`, `updateTimerDisplay()`, `secondsLeft` |
| Question randomization | `js/app.js` — `shuffle()` and `startExam()` |
| Sidebar nav grid (build) | `js/app.js` — `buildNavGrids()` |
| Sidebar nav grid (update) | `js/exam.js` — `renderQuestion()`, `selectAnswer()` |
| Question rendering | `js/exam.js` — `renderQuestion()` |
| Auto-advance behavior | `js/exam.js` — `selectAnswer()`, `showAutoAdvanceBar()`, `cancelAutoAdvance()`, `findNextUnanswered()` |
| Flag feature | `js/exam.js` — `toggleFlag()`; button `#btn-flag` in `index.html` |
| Results calculation | `js/results.js` — `showResults()` |
| All question content | `data/questions_verbal.js`, `data/questions_math.js`, `data/questions_abstract.js` |
| Color palette / theming | `css/styles.css` — `:root` block (lines 1-22) |
| Keyboard shortcuts | `js/app.js` — `document.addEventListener('keydown', ...)` |
| Screen switching | `js/app.js` — `showScreen(id)` |

## Where to Add New Code

**New question content:** Add objects to the appropriate array in `data/questions_{section}.js`. Each object must have `t`, `q`, `o` (4-element array), `a` (0-3), and `e` fields.

**New question section (4th section):** Requires changes in all locations: new `data/questions_{section}.js` file, new `<script>` tag in `index.html`, new entry in `BANK` in `js/app.js`, new sidebar grid markup and `buildNavGrids()` update, and updated hard-coded counts (`54`, `18`) throughout `js/app.js`, `js/exam.js`, and `js/results.js`.

**New exam screen:** Add `<div id="screen-{name}" class="screen">` to `index.html` and call `showScreen('{name}')` to navigate to it.

**New styling:** All styles belong in `css/styles.css`. Use existing CSS variables from `:root` rather than hard-coded color values.

**New utility functions:** No shared utility module exists. If a helper is needed across files, place it in `js/app.js` (loaded last, but all files share global scope — load order matters).

## Gaps / Unknowns

- No `assets/` directory — no local images, icons, or audio files; app is purely text-based
- No `lib/` or `vendor/` directory — no local copies of third-party libraries; only external dependency is Google Fonts via CDN
- No test directory — no test files of any kind
- No build output — there is no `dist/`, `build/`, or compiled output folder; source files are the production files
