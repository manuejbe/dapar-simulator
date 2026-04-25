# External Integrations
_Last updated: 2026-04-25_

## Summary

Dapar Simulator has exactly one external dependency: Google Fonts served over CDN. There are no APIs, no backend, no database, no authentication, no analytics, and no third-party SDKs. All application logic and data are self-contained in static files.

## APIs & External Services

**Font CDN:**
- Google Fonts — delivers `Share Tech Mono` and `Oswald` typefaces at runtime.
  - Request: `https://fonts.googleapis.com/css2?family=Share+Tech+Mono&family=Oswald:wght@400;600&display=swap`
  - Declared in: `index.html` line 7 (`<link>` tag in `<head>`).
  - Auth: None (public CDN).
  - Failure behavior: Browser falls back to system monospace and sans-serif fonts. App remains fully functional.

**All other external service categories:** Not applicable.

## Data Storage

**Databases:**
- None. No SQL, NoSQL, or embedded database.

**In-memory state:**
- All session state lives in JavaScript globals declared in `js/app.js`:
  - `session` — array of 54 shuffled question objects for the current exam.
  - `state` — array of per-question answer/flag objects.
  - `current` — integer index of the active question.
  - `secondsLeft` — countdown timer value.
  - `examStartTime` — `Date.now()` timestamp captured at exam start.
- State is lost on page refresh. No persistence layer of any kind (no `localStorage`, no `sessionStorage`, no `IndexedDB`, no cookies).

**File Storage:**
- Local filesystem only. Question data is static JS files in `data/`:
  - `data/questions_verbal.js` — `VERBAL_QUESTIONS` array.
  - `data/questions_math.js` — `MATH_QUESTIONS` array.
  - `data/questions_abstract.js` — `ABSTRACT_QUESTIONS` array.

**Caching:**
- None configured. Browser HTTP cache applies normally to static assets when served over HTTP.

## Authentication & Identity

**Auth Provider:**
- None. The application has no user accounts, login, or access control.

## Monitoring & Observability

**Error Tracking:**
- None. No Sentry, Datadog, Rollbar, or equivalent.

**Logs:**
- None. No structured logging. No `console.log` calls in production code.

**Analytics:**
- None. No Google Analytics, Mixpanel, Plausible, or equivalent.

## CI/CD & Deployment

**Hosting:**
- Not configured. Application is distributed as static files; can be hosted anywhere or run locally.

**CI Pipeline:**
- None. No GitHub Actions, CircleCI, or equivalent workflow files detected.

## Environment Configuration

**Required environment variables:**
- None. The application has no environment variables.

**Secrets:**
- None. No API keys, tokens, or credentials of any kind.

## Webhooks & Callbacks

**Incoming:**
- None.

**Outgoing:**
- None. The application makes zero outbound HTTP requests at runtime (excluding the Google Fonts `<link>` loaded by the browser on page load).

## Gaps / Unknowns

- No deployment target has been configured or documented. It is unknown whether the project is intended for GitHub Pages, a self-hosted server, or purely local use.
- There is no `manifest.json` or service worker, so the app is not a PWA and has no offline capability beyond what the browser caches automatically.

---

*Integration audit: 2026-04-25*
