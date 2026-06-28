# Pacer — project guide for Claude Code

A single-file mobile running-coach web app ("Pacer"), built with a child as a learning
project. Treat the code as the source of truth; this file is orientation so a fresh
session is productive immediately.

## What it is
- **`runna-app.html`** — the ENTIRE app: HTML + CSS + vanilla JS in one file. No build
  step, no frameworks, no dependencies, no network calls. Everything runs in the browser.
- **`sw.js`** — a service worker for offline support (network-first; caches the app so it
  opens/runs with no connection after the first online load).
- Keep it this way: plain JS, no libraries, no bundler. Two files only.

## Where it lives / how it ships
- Repo: `https://github.com/7229p25k77-glitch/pacer-app` (PUBLIC).
- Hosted for the phone via **raw.githack.com** (no GitHub Pages). The user opens it on an
  iPhone and "Add to Home Screen".
- Workflow each change: **edit → syntax-check → preview → commit → push.** The user then
  refreshes the Pacer icon on their phone.
- Commit author is set inline; end commit messages with:
  `Co-Authored-By: Claude Opus 4.8 <noreply@anthropic.com>`

## How to verify
- **Syntax check (always do this after JS edits):**
  `node -e "const fs=require('fs');const h=fs.readFileSync('runna-app.html','utf8');const m=h.match(/<script>([\s\S]*)<\/script>/);new Function(m[1]);console.log('OK')"`
- **Preview:** use the `preview_*` tools (a python http.server via `.claude/launch.json` →
  server name `pacer`, port 4599). Load `runna-app.html`, drive with `preview_eval`,
  screenshot at mobile size (375x812).
- **Cannot test from the laptop:** real GPS (no GPS chip) and true offline on the phone.
  Service-worker caching IS testable on the localhost preview. State these limits honestly.

## IMPORTANT user preference
- **Do NOT auto-run/refresh the preview after a command.** Make edits, then wait for the
  user to say "preview"/"show me" before reloading or driving the preview.

## Architecture / conventions
- **Theming:** all colors are CSS variables in `:root`; light mode overrides them under
  `html.light`. `--ink` is dark button-text used on accent backgrounds in both themes.
  Don't hardcode colors; use the variables.
- **Data (per-profile, on device):** a registry `localStorage['pacer_registry']`
  (`{activeId, profiles:[{id,name}]}`) plus one blob per profile at
  `localStorage['pacer_data_<id>']` = `{profile, logs, completedRuns}`. `save()`/`load()`
  act on the active profile. `DEFAULT_PROFILE` holds defaults. Device-level prefs:
  `pacer_gps_enabled`, `pacer_theme`.
- **Profiles:** up to 5. Setup **wizard** (`startWizard`/`renderWizard`/`WIZ_STEPS`:
  name, goal, weeks, level, days, units, gps). Picker = the "Who's running?" gate
  (`showProfileGate`/`renderProfileGate`); switch via Me screen; remove via the ✕ on a
  card (`confirmDeleteProfile`/`deleteProfile`). App opens to the last-used profile.
- **Plan engine:** `makePlan(goal, level, runDays, planWeeks)`. Length is selectable
  4–16 weeks (`planWeeks`) and the activities SCALE: beginner curriculum
  (`BEGINNER_WEEK_SESSIONS`) and non-beginner patterns map proportionally; recovery weeks
  every ~4th week; last two weeks always taper + race; `weekTitle()` names weeks.
- **Run timer:** `startRun(runOverride?)` builds phases from a run's laps, each with a
  `pace` (sec/km) from `lapPaceSecPerKm()` (based on the home-page pace zones).
  `timerTick()` runs every second; distance comes from real GPS when locked
  (`calcGPSDistance`, accuracy-filtered, anchored so it never jumps backward), else a
  pace-based estimate. Each lap's ACTUAL time+distance are recorded (`lapTimes`,
  `lapDistances`) so per-lap pace is real. `finishRun()` logs the run; `promptStopRun()`
  → end-run sheet (Save / Discard / Keep Running).
- **GPS:** `startGPS()` (watchPosition, 30s timeout, clear status messages). Approval is
  chosen in the wizard, not per run; toggle via Me → Location (GPS) info sheet.
  Free run + quick-start next run live on the Log page (`startFreeRun`,
  `quickStartNextRun`).
- **Run detail:** interactive Pace Analysis graph (`renderPaceChart`/`drawPaceChart`) —
  bars sized by lap TIME (y-axis = time), tap a bar to see that lap's actual pace vs the
  average; lap list shows real per-lap pace.

## Gotchas
- One big `<script>`; after edits run the syntax check above.
- Old logged runs predate `lapTimes` → pace graph falls back to planned pace for them.
- `escapeHtml()` user-entered names before injecting into innerHTML.
