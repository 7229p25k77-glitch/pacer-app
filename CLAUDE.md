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
  `localStorage['pacer_data_<id>']` = `{profile, logs, completedRuns, checkIns}`.
  `save()`/`load()` act on the active profile. `DEFAULT_PROFILE` holds defaults.
  Device-level prefs: `pacer_gps_enabled`, `pacer_theme`.
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
  Driven by the WALL CLOCK, not tick-counting: `timerTick()` (1s interval) advances by the
  real seconds elapsed since `t.lastTickMs` via `stepTimerSecond(t, live)`, replaying any
  seconds missed while the app was backgrounded/suspended (replayed seconds are silent;
  `live` only on the current second). `resyncTimer()` runs on visibilitychange/focus/pageshow
  so it catches up instantly on return; paused time never counts. A best-effort screen
  **Wake Lock** (`requestWakeLock`/`releaseWakeLock`) holds the screen on during a run.
  Distance comes from real GPS when locked (`calcGPSDistance`, accuracy-filtered, anchored
  so it never jumps backward), else a pace-based estimate. Each lap's ACTUAL time+distance
  are recorded (`lapTimes`, `lapDistances`). The run screen shows an in-run diagram
  (`updateRunDiagram`/`buildRunTrack`): a prominent current-lap time bar + a whole-run
  segmented track (one segment per phase, width ∝ `estSecs`, run/walk coloured via
  `isWalkLap`, done/current/upcoming states). Hidden for free/recovery/single-lap sessions
  (they show `#timer-seg-label` instead). `finishRun()` logs the run; `promptStopRun()`
  → end-run sheet (Save / Discard / Keep Running).
  **iOS web limit:** JS is fully suspended while backgrounded/screen-locked — the timer
  *catches up on return* (time stays correct) but cannot run, fire voice, or read GPS in the
  background. True background GPS/audio needs a native app; state this honestly.
- **Crash/eviction recovery:** the whole run is in memory, so if iOS discards the
  backgrounded page it would be lost. `saveActiveRun()` snapshots the run to
  `localStorage['pacer_active_run']` (every 5s, on pause, and on visibilitychange-hidden /
  pagehide); `stopRunCleanup()` clears it. On launch (`DOMContentLoaded` → after
  `bootProfile`), `resumeActiveRun()` restores an interrupted run for the same profile if its
  `savedAt` is < 3h old, re-shows the timer, and the wall-clock catch-up corrects the elapsed
  time. The route has a straight-line gap across the dead period (GPS was suspended).
- **Voice cues** (`speak()` queue, Web Speech API): finish says just "Run complete." (kept
  short — cleanup cancels speech ~1.5s later). At each lap end, a RUNNING lap (`!isWalkLap`)
  triggers `lapPaceCallout()` — actual pace + faster/slower vs the lap's goal pace — then the
  next-lap `lapAnnouncement()`. Mid-lap encouragement only for laps ≥ 5 min. Lap names embed
  the run length as `… — N min`; parse minutes with `/(\d+(?:\.\d+)?)\s*min/`, NOT the first
  digit (that's the rep number in "Run 3/6 — 1 min").
- **GPS:** `startGPS()` (watchPosition, 30s timeout, clear status messages). Approval is
  chosen in the wizard, not per run; toggle via Me → Location (GPS) info sheet.
  Free run + quick-start next run live on the Log page (`startFreeRun`,
  `quickStartNextRun`).
- **Analytics page = the one detail view.** Opened by `openRunAnalytics(id, opts)` —
  from the "Run Complete" celebration's *View Analytics* button (`opts` omitted → "Back to
  Home" → home) AND by tapping any Log entry (`{from:'log'}` → "Back/Done" → log-screen,
  via `ANALYTICS_RETURN`). Sections: effort/strain review (`renderFeel`, saved as `log.feel`,
  editable on past runs), route map, pace splits, **lap breakdown**, comparison, PBs.
  `renderPaceChart`/`renderDetailMap`/`renderDetailLaps` all take an optional element id so
  they render into the analytics overlay's `an-*` nodes. `openRunDetail` is a thin alias to
  it; the old `#detail-overlay` markup is unused/dead (left in place for now).
- **Pace chart** (`renderPaceChart`/`drawPaceChart`, keyed by elId in `PACE_CHARTS`):
  y-axis = PACE, bar height ∝ speed (taller = faster); tap a bar for that lap's pace +
  duration. When a workout has both running and walking laps (`isWalkLap`) it shows
  Running/Walking **tabs** over one chart (`selectPaceTab`/`selectPaceBar`), each with its
  own average; bars coloured `pc-run`/`pc-walk`. **Route map** (`renderDetailMap`):
  theme-aware `<canvas>` (reads CSS vars, repaints on theme toggle) with a locally drawn
  street backdrop — no tiles, offline.
- **Comparison** (`renderRunComparison`): two blocks — *vs your last* comparable session
  (`findPrevRun`) and *vs your recent average* (last ≤10, `avgOf`). Titles/route adapt for
  recovery; PBs keep runs and recovery in separate "leagues" (`isRecovery`/`logNoun`).
- **Recovery / cross-training:** logged from the Health tab (`RECOVERY_ACTIVITIES`,
  `startRecovery`). Reuses the run timer via `startRun({recovery:true, gps})`: outdoor
  (walk/cycle) use GPS for distance+route; indoor (treadmill/swim/elliptical…) are a pure
  stopwatch (`timer.noDistance` → no estimated distance). Logged as `type:'recovery'` with
  `activity`/`icon`; ends in the same celebration → analytics flow.
- **Health tab (Body Check-in):** 5th nav tab. `renderHealth()` draws a daily readiness
  check-in (energy/legs/sleep scales + pain-area chips → green/amber/red verdict, saved
  to `APP.checkIns` keyed by LOCAL date via `todayKey()`). `INJURIES` data drives a list
  of common running injuries; reported pain flags matching ones (`AREA_INJURY`); tapping
  opens `#injury-overlay` (`openInjury`) with signs/causes/strengthening/recovery moves.
  **All injury content carries a clear "not medical advice / not from licensed
  professionals" disclaimer — keep that whenever editing this section.**
- **Achievements (Profile → Milestones):** `openAchievements` → `#achievements-overlay`,
  rendered by `renderAchievementsList` from the `ACHIEVEMENTS` array (grouped milestones:
  distance/consistency/endurance/speed/time/recovery/check-ins/plan). `achievementStats()`
  aggregates all-time figures from `APP.logs` (+ recovery), `APP.checkIns`, `completedRuns`;
  `achStatus(a,s)` returns {done,pct,label}. Locked badges show a progress bar. The summary
  + profile row show only the COMPLETED count (no fixed total — add new entries freely).
- One big `<script>`; after edits run the syntax check above.
- Old logged runs predate `lapTimes` → pace graph falls back to planned pace for them.
- `escapeHtml()` user-entered names before injecting into innerHTML.
