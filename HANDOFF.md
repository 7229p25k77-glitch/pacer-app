# Pacer — session handoff

Reference snapshot for a fresh chat. **Read for context only — don't set anything up or
start building until asked.** The source of truth is the code + `CLAUDE.md` + `git log`.

_Last updated: 2026-07-21 · latest commit `956bd11`._

## Where things stand
- **App:** single-file `runna-app.html` (+ `sw.js`). No build step. All work is committed and
  pushed to `origin/main`; working tree clean.
- **Preview:** `http://localhost:4599/runna-app.html` (python http.server; may already be
  running from a prior session). Verify per `CLAUDE.md`; **don't auto-refresh the preview** —
  wait for "preview"/"show me".
- **Users:** ~10 real users. Data is per-profile in `localStorage`, now with optional cloud
  sync (see Accounts).

## Built recently (all on `main`)
- **Accounts + cloud sync (Supabase).** Email/password; existing users get a skippable
  "Back up your progress" prompt, new users are offered signup before the wizard, local data
  migrates up on first signup. `save()`/`load()` are the sync choke-point.
- **Goal-pace auto-adjust** from run feel — nudges *pace* (not level) by a proportional
  ~1%/level step when the last 4 runs all feel easy/hard.
- **Tailored 5-min warm-up + rest-day caution** on Start Run (plan workouts only).
- **Daily check-in** moved behind a bar to its own screen.
- **"Just run" (no-race) goal** + per-goal wizard descriptions; **0–30+ min slider** for the
  "run non-stop" wizard step.
- **Calendar** swap/skip/free-run colouring + real-date anchoring.
- **"Your Trends"** analytics page (from Log): metric × time-range charts, best-runs, tap a
  run to revisit its route map.

## ⚠️ Dev caveats to remember before any real launch
- **Supabase email confirmation is OFF** (dev convenience) — re-enable it; delete the test
  user created during verification. The publishable key in the app is public-by-design and
  RLS-protects data.
- `LEGAL_DRAFT.md` is a **not-lawyer-reviewed** template, reference only — the safety modal was
  deliberately **not** wired into the app.

## Not started yet (future, only when asked)
- **Native** via Capacitor — prototype at `~/projects/pacer-capacitor` (see its `BACKLOG.md`).
- **Paywall** — iOS requires Apple In-App Purchase (RevenueCat recommended); needs the $99/yr
  Apple Developer account. Do this *after* accounts.
- **Repo privacy / hosting** — going private is free but breaks raw.githack.com; Cloudflare
  Pages is the recommended free alternative. Parked, low priority.
