# Pacer — 5K Training App

A self-contained mobile-friendly running coach built as a single HTML file.
Originally created with Claude on mobile, then exported to Claude Code.

## Features
- 8-week beginner-to-advanced training plan generator (5K / 10K / Half / Marathon)
- Run/walk interval timer with GPS tracking and voice coaching (Web Speech API)
- Activity log with route maps and per-lap pace analysis
- Profile, pace zones, units (km/mi), and avatar — all saved in the browser via localStorage

## How to run it
It is a single file with no dependencies. Either:
- Double-click `runna-app.html` to open it in a browser, or
- Serve it locally:  `python3 -m http.server 8000`  then visit http://localhost:8000/runna-app.html

Best viewed in a mobile-sized window (or your browser's device/responsive mode).

## Note on saved data
Progress (runs, profile, settings) is stored in the browser's localStorage,
so it lives per-browser/per-device — it is not committed to git.
