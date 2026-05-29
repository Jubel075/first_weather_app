// AUTO-GENERATED from src/api.jsx — do not edit directly. Edit the .jsx source and recompile.
// api.jsx — OpenWeather data layer, shaping, and condition→theme mapping.
// Free-tier endpoints only: geocoding, current weather, 5-day/3-hour forecast,
// air pollution. Hourly + multi-day are derived from /forecast. No fabricated data.

const API_KEY = window.WEATHER_API_KEY;
const BASE = "https://api.openweathermap.org";

// ---- low-level fetchers --------------------------------------------------
async function geocode(query) {
  const url = `${BASE}/geo/1.0/direct?q=${encodeURIComponent(query)}&limit=6&appid=${API_KEY}`;
  const r = await fetch(url);
  if (!r.ok) throw new Error("Could not search locations.");
  const data = await r.json();
  return data.map(g => ({
    name: g.name,
    lat: g.lat,
    lon: g.lon,
    country: g.country,
    state: g.state || "",
    label: [g.name, g.state, g.country].filter(Boolean).join(", ")
  }));
}
async function reverseGeocode(lat, lon) {
  const url = `${BASE}/geo/1.0/reverse?lat=${lat}&lon=${lon}&limit=1&appid=${API_KEY}`;
  const r = await fetch(url);
  if (!r.ok) throw new Error("Reverse geocoding failed.");
  const data = await r.json();
  const g = data[0] || {};
  return {
    name: g.name || "My location",
    lat,
    lon,
    country: g.country || "",
    state: g.state || "",
    label: [g.name, g.state, g.country].filter(Boolean).join(", ") || "My location"
  };
}

// ---- perf instrumentation bus -------------------------------------------
// Lightweight pub/sub so the Perf HUD (and anything else) can observe cache
// decisions and per-endpoint timings without coupling to React.
const Perf = {
  _l: new Set(),
  on(fn) {
    this._l.add(fn);
    return () => this._l.delete(fn);
  },
  emit(ev) {
    ev.t = Date.now();
    for (const fn of this._l) {
      try {
        fn(ev);
      } catch (e) {}
    }
  }
};

// ---- persistent stale-while-revalidate cache ----------------------------
const CACHE_PREFIX = "wx.cache.v1:";
const FRESH_MS = 10 * 60 * 1000; // within this window: serve, skip network
const STALE_CAP_MS = 24 * 60 * 60 * 1000; // older than a day: drop on read

function cacheRead(id) {
  try {
    const raw = localStorage.getItem(CACHE_PREFIX + id);
    if (!raw) return null;
    const data = JSON.parse(raw);
    if (!data || typeof data.fetchedAt !== "number") return null;
    if (Date.now() - data.fetchedAt > STALE_CAP_MS) {
      cacheClear(id);
      return null;
    }
    return data;
  } catch (e) {
    return null;
  }
}
function cacheWrite(id, data) {
  try {
    localStorage.setItem(CACHE_PREFIX + id, JSON.stringify(data));
  } catch (e) {/* quota — non-fatal, in-memory cache still holds it */}
}
function cacheClear(id) {
  try {
    localStorage.removeItem(CACHE_PREFIX + id);
  } catch (e) {}
}
function cacheAge(data) {
  return data ? Date.now() - data.fetchedAt : Infinity;
}
function isFresh(data) {
  return cacheAge(data) < FRESH_MS;
}

// ---- timed, abortable fetch ---------------------------------------------
async function fetchJSONTimed(path, label, signal) {
  const t0 = performance.now();
  const r = await fetch(`${BASE}${path}&appid=${API_KEY}`, {
    signal
  });
  if (!r.ok) {
    Perf.emit({
      type: "fetch",
      label,
      ms: performance.now() - t0,
      ok: false,
      status: r.status
    });
    throw new Error(`Weather service error (${r.status}).`);
  }
  const j = await r.json();
  Perf.emit({
    type: "fetch",
    label,
    ms: performance.now() - t0,
    ok: true
  });
  return j;
}

// ---- in-flight dedup -----------------------------------------------------
// Concurrent requests for the same place share one promise so rapid tab
// switches / prefetch + active-load collisions never fire duplicate calls.
const inflight = new Map();

// ---- orchestration (progressive) ----------------------------------------
// Fires all three endpoints in parallel but resolves PROGRESSIVELY: the moment
// current conditions land, onPartial paints the hero — it does not wait on the
// slower forecast/air calls. Each subsequent endpoint refines the shape.
function loadPlaceProgressive(place, opts) {
  opts = opts || {};
  const id = place.id || `${place.lat.toFixed(4)},${place.lon.toFixed(4)}`;
  if (inflight.has(id)) {
    Perf.emit({
      type: "dedup",
      id
    });
    return inflight.get(id);
  }
  const q = `lat=${place.lat}&lon=${place.lon}&units=metric`;
  const signal = opts.signal;
  const onPartial = opts.onPartial;
  const t0 = performance.now();
  const run = (async () => {
    let cur = null,
      fc = null,
      air = null;
    const emit = () => {
      if (cur && onPartial) onPartial(shape(place, cur, fc, air));
    };
    const pCur = fetchJSONTimed(`/data/2.5/weather?${q}`, "current", signal).then(v => {
      cur = v;
      emit();
    });
    const pFc = fetchJSONTimed(`/data/2.5/forecast?${q}`, "forecast", signal).then(v => {
      fc = v;
      emit();
    }).catch(() => {});
    const pAir = fetchJSONTimed(`/data/2.5/air_pollution?lat=${place.lat}&lon=${place.lon}`, "air", signal).then(v => {
      air = v;
      emit();
    }).catch(() => {});
    await pCur; // current is required
    await Promise.allSettled([pFc, pAir]); // let the rest settle for the final shape
    if (!cur) throw new Error("No weather data.");
    Perf.emit({
      type: "complete",
      id,
      ms: performance.now() - t0
    });
    return shape(place, cur, fc, air);
  })().finally(() => inflight.delete(id));
  inflight.set(id, run);
  return run;
}

// Non-progressive wrapper (kept for any caller that just wants the full object).
async function loadPlace(place) {
  return loadPlaceProgressive(place, {});
}

// ---- shaping -------------------------------------------------------------
function shape(place, cur, fc, air) {
  const tzOffset = cur.timezone || 0; // seconds
  const w = cur.weather && cur.weather[0] ? cur.weather[0] : {
    id: 800,
    main: "Clear",
    description: "clear",
    icon: "01d"
  };
  const isNight = (w.icon || "").endsWith("n");
  const out = {
    place: {
      ...place,
      name: cur.name || place.name
    },
    tzOffset,
    fetchedAt: Date.now(),
    isNight,
    condition: {
      id: w.id,
      main: w.main,
      description: w.description,
      icon: w.icon
    },
    now: {
      temp: cur.main.temp,
      feels: cur.main.feels_like,
      min: cur.main.temp_min,
      max: cur.main.temp_max,
      humidity: cur.main.humidity,
      pressure: cur.main.pressure,
      visibility: cur.visibility != null ? cur.visibility : null,
      clouds: cur.clouds ? cur.clouds.all : null,
      windSpeed: cur.wind ? cur.wind.speed : 0,
      windDeg: cur.wind ? cur.wind.deg : 0,
      windGust: cur.wind ? cur.wind.gust : null,
      sunrise: cur.sys ? cur.sys.sunrise : null,
      sunset: cur.sys ? cur.sys.sunset : null,
      dt: cur.dt
    },
    hourly: [],
    daily: [],
    air: null,
    theme: themeFor(w.id, isNight)
  };

  // hourly: next ~24h of 3-hour steps
  if (fc && Array.isArray(fc.list)) {
    out.hourly = fc.list.slice(0, 9).map(s => {
      const sw = s.weather && s.weather[0] ? s.weather[0] : {};
      return {
        dt: s.dt,
        temp: s.main.temp,
        pop: Math.round((s.pop || 0) * 100),
        icon: sw.icon,
        id: sw.id,
        main: sw.main,
        wind: s.wind ? s.wind.speed : 0
      };
    });
    out.daily = aggregateDaily(fc.list, tzOffset);
  }
  if (air && air.list && air.list[0]) {
    const a = air.list[0];
    out.air = {
      aqi: a.main.aqi,
      ...a.components
    };
  }
  return out;
}
function aggregateDaily(list, tzOffset) {
  const days = new Map();
  for (const s of list) {
    const local = new Date((s.dt + tzOffset) * 1000);
    const key = local.getUTCFullYear() + "-" + local.getUTCMonth() + "-" + local.getUTCDate();
    if (!days.has(key)) {
      days.set(key, {
        dt: s.dt,
        min: Infinity,
        max: -Infinity,
        temps: [],
        noon: null,
        noonDelta: Infinity,
        pops: []
      });
    }
    const d = days.get(key);
    d.min = Math.min(d.min, s.main.temp_min);
    d.max = Math.max(d.max, s.main.temp_max);
    d.temps.push(s.main.temp);
    d.pops.push(s.pop || 0);
    const hour = local.getUTCHours();
    const delta = Math.abs(hour - 13);
    if (delta < d.noonDelta) {
      d.noonDelta = delta;
      d.noon = s.weather && s.weather[0] ? s.weather[0] : null;
      d.dt = s.dt;
    }
  }
  return Array.from(days.values()).slice(0, 6).map(d => ({
    dt: d.dt,
    min: d.min,
    max: d.max,
    pop: Math.round(Math.max(...d.pops) * 100),
    icon: d.noon ? d.noon.icon : "01d",
    id: d.noon ? d.noon.id : 800,
    main: d.noon ? d.noon.main : "Clear"
  }));
}

// ---- condition → theme ---------------------------------------------------
// Palettes use cool/warm gradients per condition. Accents share L/C, vary hue.
function themeFor(id, isNight) {
  const g = Math.floor(id / 100);
  let t;
  if (id === 800) {
    t = isNight ? {
      key: "clear-night",
      fx: "stars",
      bg: ["#0a1330", "#152352", "#243a78"],
      accent: 256,
      ink: "light"
    } : {
      key: "clear-day",
      fx: "sun",
      bg: ["#1763b8", "#3b9be0", "#86c7f0"],
      accent: 230,
      ink: "light"
    };
  } else if (g === 2) {
    t = {
      key: "storm",
      fx: "storm",
      bg: ["#0c0e1c", "#241f3e", "#3a2d57"],
      accent: 286,
      ink: "light"
    };
  } else if (g === 3) {
    t = {
      key: "drizzle",
      fx: "rain",
      bg: ["#10283a", "#1f4659", "#356b78"],
      accent: 196,
      ink: "light"
    };
  } else if (g === 5) {
    t = {
      key: "rain",
      fx: "rain",
      bg: ["#0e2233", "#1b3b54", "#2c5a73"],
      accent: 205,
      ink: "light"
    };
  } else if (g === 6) {
    t = {
      key: "snow",
      fx: "snow",
      bg: ["#3f5572", "#7d97b8", "#c3d6ea"],
      accent: 232,
      ink: isNight ? "light" : "dark"
    };
  } else if (g === 7) {
    t = {
      key: "mist",
      fx: "mist",
      bg: ["#41484f", "#6c7780", "#9aa6b0"],
      accent: 210,
      ink: isNight ? "light" : "dark"
    };
  } else {
    // 80x clouds
    t = isNight ? {
      key: "clouds-night",
      fx: "clouds",
      bg: ["#13182b", "#2a3450", "#3e4c6e"],
      accent: 240,
      ink: "light"
    } : {
      key: "clouds-day",
      fx: "clouds",
      bg: ["#3a4f6b", "#5f7796", "#93a9c4"],
      accent: 232,
      ink: "light"
    };
  }
  t.accentColor = `oklch(0.78 0.135 ${t.accent})`;
  t.accentSoft = `oklch(0.78 0.135 ${t.accent} / 0.22)`;
  return t;
}

// ---- units & formatting --------------------------------------------------
const Units = {
  temp: (c, unit) => unit === "F" ? c * 9 / 5 + 32 : c,
  tempStr: (c, unit) => `${Math.round(Units.temp(c, unit))}°`,
  wind: (ms, unit) => unit === "F" ? ms * 2.23694 : ms * 3.6,
  // mph vs km/h
  windUnit: unit => unit === "F" ? "mph" : "km/h",
  windStr: (ms, unit) => `${Math.round(Units.wind(ms, unit))}`,
  vis: (m, unit) => unit === "F" ? `${(m / 1609).toFixed(1)} mi` : `${(m / 1000).toFixed(1)} km`
};
function localTime(dt, tzOffset, opts) {
  // dt in seconds UTC; render in the place's local time
  const d = new Date((dt + tzOffset) * 1000);
  const fmt = new Intl.DateTimeFormat("en-US", {
    timeZone: "UTC",
    ...opts
  });
  return fmt.format(d);
}
const WIND_DIRS = ["N", "NNE", "NE", "ENE", "E", "ESE", "SE", "SSE", "S", "SSW", "SW", "WSW", "W", "WNW", "NW", "NNW"];
function windDir(deg) {
  return WIND_DIRS[Math.round(deg / 22.5) % 16];
}
const AQI_INFO = {
  1: {
    label: "Good",
    color: "oklch(0.78 0.15 150)"
  },
  2: {
    label: "Fair",
    color: "oklch(0.82 0.15 110)"
  },
  3: {
    label: "Moderate",
    color: "oklch(0.82 0.15 75)"
  },
  4: {
    label: "Poor",
    color: "oklch(0.72 0.18 40)"
  },
  5: {
    label: "Very Poor",
    color: "oklch(0.65 0.2 20)"
  }
};

// ---- sample fallback (real Miami payload shape from json.txt) -------------
const SAMPLE = {
  place: {
    name: "Miami",
    lat: 25.7742,
    lon: -80.1936,
    country: "US",
    state: "Florida",
    label: "Miami, Florida, US"
  },
  raw: {
    coord: {
      lat: 25.7742,
      lon: -80.1936
    },
    weather: [{
      id: 801,
      main: "Clouds",
      description: "few clouds",
      icon: "02d"
    }],
    main: {
      temp: 24.42,
      feels_like: 25.19,
      temp_min: 23.89,
      temp_max: 25.01,
      pressure: 1014,
      humidity: 87,
      sea_level: 1014,
      grnd_level: 1013
    },
    visibility: 10000,
    wind: {
      speed: 3.6,
      deg: 110,
      gust: 6.2
    },
    clouds: {
      all: 20
    },
    sys: {
      country: "US",
      sunrise: 1780050608,
      sunset: 1780099595
    },
    timezone: -14400,
    name: "Miami",
    dt: 1780042640
  }
};
function sampleData() {
  // synth a small forecast so hourly/daily render in fallback mode
  const base = SAMPLE.raw.dt;
  const list = [];
  for (let i = 1; i <= 24; i++) {
    const t = 24 + Math.sin(i / 3) * 4;
    list.push({
      dt: base + i * 3 * 3600,
      main: {
        temp: t,
        temp_min: t - 1.5,
        temp_max: t + 1.5
      },
      weather: [SAMPLE.raw.weather[0]],
      wind: {
        speed: 3 + i % 4
      },
      pop: Math.max(0, Math.sin(i / 2) * 0.5)
    });
  }
  const fc = {
    list
  };
  const air = {
    list: [{
      main: {
        aqi: 2
      },
      components: {
        pm2_5: 8.4,
        pm10: 12.1,
        o3: 64,
        no2: 9.2,
        so2: 1.1,
        co: 220
      }
    }]
  };
  return shape(SAMPLE.place, SAMPLE.raw, fc, air);
}
Object.assign(window, {
  WeatherAPI: {
    geocode,
    reverseGeocode,
    loadPlace,
    loadPlaceProgressive,
    sampleData,
    themeFor,
    cacheRead,
    cacheWrite,
    cacheClear,
    cacheAge,
    isFresh,
    Perf,
    FRESH_MS
  },
  Units,
  localTime,
  windDir,
  AQI_INFO
});