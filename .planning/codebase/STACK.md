# Technology Stack
_Last updated: 2026-04-25_

## Summary

Dapar Simulator is a zero-dependency, browser-native web application. It uses plain HTML5, CSS3, and vanilla JavaScript (ES6+) with no build step, no package manager, and no runtime dependencies. The entire application runs by opening `index.html` directly in any modern browser.

## Languages

**Primary:**
- HTML5 — Single entry point at `index.html`. Three screen sections (start, exam, results) are all declared in one file.
- CSS3 — All styles in `css/styles.css`. Uses CSS custom properties (variables) for theming.
- JavaScript (ES6+) — Three source modules in `js/` plus three data files in `data/`. Uses `const`/`let`, arrow functions, spread operator, template literals, `Array.prototype` methods (`forEach`, `filter`, `every`, `map`), `setTimeout`/`setInterval`, and `Date.now()`.

**Secondary:**
- None.

## Runtime

**Environment:**
- Browser — any modern browser (Chrome, Firefox, Safari, Edge). No server required.
- No Node.js runtime involved. No server-side execution.

**Package Manager:**
- None. No `package.json`, no lockfile, no `node_modules`.
- `.gitignore` lists `node_modules/` defensively but it is not used.

## Frameworks

**Core:**
- None. Vanilla JavaScript only. No UI framework (no React, Vue, Angular, etc.).

**Testing:**
- None detected. No test framework, no test files.

**Build/Dev:**
- None. No bundler (no Webpack, Vite, Rollup, esbuild). No transpiler (no Babel, TypeScript). No task runner.

## Key Dependencies

**External font loading (CDN):**
- `Share Tech Mono` (monospace) — loaded from `https://fonts.googleapis.com/css2?family=Share+Tech+Mono` — used as `--mono` variable for body text.
- `Oswald` (sans-serif, weights 400 and 600) — loaded from the same Google Fonts URL — used as `--title` variable for headings and labels.
- Both fonts declared in `index.html` line 7 via `<link>` tag.

**Critical (runtime):**
- `data/questions_verbal.js` — exposes global `VERBAL_QUESTIONS` array.
- `data/questions_math.js` — exposes global `MATH_QUESTIONS` array.
- `data/questions_abstract.js` — exposes global `ABSTRACT_QUESTIONS` array.
- `js/results.js` — must load before `js/exam.js` (uses `escHtml` defined there).
- `js/exam.js` — must load before `js/app.js` (uses `renderQuestion`, `selectAnswer`, etc.).
- `js/app.js` — entry point; consumes all of the above globals.
- Script load order is hardcoded in `index.html` lines 105–110. No module system; all variables are globals on `window`.

## Configuration

**Environment:**
- No `.env` file. No environment variables. No server-side configuration.
- All configuration is hardcoded in source: 54 questions (18 per section), 40-minute timer, 1.2s auto-advance delay.

**Build:**
- No build config files. No `tsconfig.json`, no `.babelrc`, no `eslint.config.*`, no `.prettierrc`.
- `.claude/settings.local.json` exists for Claude Code editor integration only.

## Platform Requirements

**Development:**
- Any text editor. No toolchain installation needed.

**Production:**
- Any static file host (GitHub Pages, Netlify, Vercel, S3, etc.) or local filesystem.
- Requires outbound network access to `fonts.googleapis.com` and `fonts.gstatic.com` for font loading (gracefully degrades to system monospace/sans-serif if blocked).

---

*Stack analysis: 2026-04-25*
