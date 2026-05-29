# Halcyon Weather

A performance-tuned weather app. The UI is built with React (no framework, no
bundler) and is intentionally simple to deploy as static files.

## Performance system

**Faster data**
- **Connection warmup** — `preconnect` / `dns-prefetch` to the weather + map-tile
  origins so TLS/DNS is done before the first request.
- **Stale-while-revalidate cache** — shaped responses are persisted to
  `localStorage`. On reload the app paints real data instantly, then revalidates
  in the background. Data younger than 10 min is served without any network call.
- **Progressive paint** — the hero renders the moment current conditions arrive
  instead of blocking on the slower forecast / air-quality calls.
- **Request dedup + abort** — concurrent loads of the same city share one
  in-flight promise; switching cities aborts the superseded fetch.
- **Prefetch** — inactive city tabs are warmed on idle and on hover.

**Faster rendering**
- Precompiled JSX (no in-browser Babel transform on load — see below).
- `React.memo` on the heavy panels + `useMemo` on derived data.
- The animated sky canvas pauses when the tab is hidden.

Toggle **Tweaks → Performance → Performance HUD** to watch cache HIT/STALE/MISS,
per-endpoint timings, dedup hits and prefetches in real time.

## Build

Source lives in `*.jsx`. The browser loads the precompiled `*.js` (referenced by
`Weather App.html`) — there is **no** in-browser Babel transform at runtime.

After editing any `.jsx`, regenerate the `.js`:

```bash
npm install      # first time only
npm run build    # tweaks-panel.jsx + src/*.jsx  ->  *.js
# or, while developing:
npm run watch
```

The compiled `.js` files are committed so the app runs as static files (e.g.
GitHub Pages) with no build step on the host.

## Files

| Source            | Compiled         | Role                                   |
|-------------------|------------------|----------------------------------------|
| `src/api.jsx`     | `src/api.js`     | data layer: fetch, cache, dedup, shape |
| `src/app.jsx`     | `src/app.js`     | state, SWR loading, prefetch, layout   |
| `src/panels.jsx`  | `src/panels.js`  | header, search, tabs, hero, forecasts  |
| `src/widgets.jsx` | `src/widgets.js` | compass, sun arc, AQI, map             |
| `src/background.jsx` | `src/background.js` | condition-reactive animated sky     |
| `src/perf.jsx`    | `src/perf.js`    | Performance HUD overlay                |
| `tweaks-panel.jsx`| `tweaks-panel.js`| in-app tweak controls                  |
