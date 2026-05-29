// AUTO-GENERATED from src/app.jsx — do not edit directly. Edit the .jsx source and recompile.
// app.jsx — state, data loading, theming, transitions, layout, tweaks.

const {
  useState,
  useEffect,
  useRef,
  useCallback
} = React;
const SEED_CITIES = [{
  id: "25.7617,-80.1918",
  name: "Miami",
  lat: 25.7617,
  lon: -80.1918,
  country: "US",
  state: "Florida"
}, {
  id: "37.7749,-122.4194",
  name: "San Francisco",
  lat: 37.7749,
  lon: -122.4194,
  country: "US",
  state: "California"
}, {
  id: "35.6895,139.6917",
  name: "Tokyo",
  lat: 35.6895,
  lon: 139.6917,
  country: "JP",
  state: ""
}, {
  id: "64.1466,-21.9426",
  name: "Reykjavík",
  lat: 64.1466,
  lon: -21.9426,
  country: "IS",
  state: ""
}];
const ACCENT_HUE = {
  Azure: 235,
  Coral: 35,
  Violet: 288,
  Mint: 158,
  Gold: 80
};
const DIRECTIONS = {
  immersive: {
    "--glass-bg": "rgba(255,255,255,0.10)",
    "--glass-bg-strong": "rgba(255,255,255,0.17)",
    "--glass-border": "rgba(255,255,255,0.22)",
    "--glass-blur": "28px",
    "--radius": "28px",
    "--radius-sm": "18px",
    "--temp-scale": "1.05",
    "--fx-opacity": "1",
    "--maxw": "1180px",
    "--gap": "16px"
  },
  studio: {
    "--glass-bg": "rgba(255,255,255,0.14)",
    "--glass-bg-strong": "rgba(255,255,255,0.2)",
    "--glass-border": "rgba(255,255,255,0.2)",
    "--glass-blur": "18px",
    "--radius": "20px",
    "--radius-sm": "14px",
    "--temp-scale": "0.86",
    "--fx-opacity": "0.7",
    "--maxw": "1320px",
    "--gap": "14px"
  },
  editorial: {
    "--glass-bg": "rgba(255,255,255,0.055)",
    "--glass-bg-strong": "rgba(255,255,255,0.11)",
    "--glass-border": "rgba(255,255,255,0.15)",
    "--glass-blur": "12px",
    "--radius": "13px",
    "--radius-sm": "10px",
    "--temp-scale": "1.0",
    "--fx-opacity": "0.4",
    "--maxw": "1080px",
    "--gap": "20px"
  }
};
function hexFromInk(light) {
  return light ? {
    "--ink": "#f6f8fd",
    "--ink-soft": "rgba(246,248,253,0.74)",
    "--ink-faint": "rgba(246,248,253,0.46)"
  } : {
    "--ink": "#152130",
    "--ink-soft": "rgba(21,33,48,0.74)",
    "--ink-faint": "rgba(21,33,48,0.5)"
  };
}
function applyVars(obj) {
  const root = document.documentElement;
  for (const k in obj) root.style.setProperty(k, obj[k]);
}

// Read persisted city list once (used by several useState initializers).
function readCities() {
  try {
    const s = JSON.parse(localStorage.getItem("wx.cities"));
    if (Array.isArray(s) && s.length) return s;
  } catch (e) {}
  return SEED_CITIES;
}
// Hydrate the in-memory cache from the persistent SWR store so first paint
// shows REAL data with zero network wait.
function hydrateCache() {
  const out = {};
  for (const c of readCities()) {
    const hit = WeatherAPI.cacheRead(c.id);
    if (hit) out[c.id] = hit;
  }
  return out;
}

// ---- Fade wrapper: remounts on key, eases content in ---------------------
function Fade({
  k,
  children
}) {
  const [cls, setCls] = useState("fade-enter");
  useEffect(() => {
    setCls("fade-enter");
    const r = requestAnimationFrame(() => requestAnimationFrame(() => setCls("fade-enter fade-in")));
    return () => cancelAnimationFrame(r);
  }, [k]);
  return /*#__PURE__*/React.createElement("div", {
    className: cls
  }, children);
}
const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "direction": "immersive",
  "accent": "Conditions",
  "motion": true,
  "glassBlur": 0,
  "heroSize": 1.0,
  "showMap": true,
  "perfHud": false
} /*EDITMODE-END*/;
function App() {
  const [t, setTweak] = useTweaks(TWEAK_DEFAULTS);
  const [cities, setCities] = useState(readCities);
  const [activeId, setActiveId] = useState(() => localStorage.getItem("wx.active") || SEED_CITIES[0].id);
  const [unit, setUnit] = useState(() => localStorage.getItem("wx.unit") || "C");
  const [cache, setCache] = useState(hydrateCache);
  const [status, setStatus] = useState(() => {
    // If we hydrated the active city from disk, skip the loading skeleton entirely.
    const id = localStorage.getItem("wx.active") || SEED_CITIES[0].id;
    return WeatherAPI.cacheRead(id) ? "ready" : "loading";
  });
  const [error, setError] = useState("");
  const [sample, setSample] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const abortRef = useRef(null); // active in-flight request, aborted on city switch

  useEffect(() => {
    localStorage.setItem("wx.cities", JSON.stringify(cities));
  }, [cities]);
  useEffect(() => {
    localStorage.setItem("wx.active", activeId);
  }, [activeId]);
  useEffect(() => {
    localStorage.setItem("wx.unit", unit);
  }, [unit]);
  // Expose id→name so the Perf HUD can label events with readable city names.
  useEffect(() => {
    const m = {};
    for (const c of cities) m[c.id] = c.name;
    window.__wxCityName = m;
  }, [cities]);
  const active = cities.find(c => c.id === activeId) || cities[0];
  const data = cache[activeId];
  const load = useCallback((city, opts) => {
    opts = opts || {};
    if (!city) return;
    const cached = cache[city.id];
    const fresh = cached && WeatherAPI.isFresh(cached);

    // Cache HIT — show it immediately, no spinner.
    if (cached) setStatus("ready");
    // Fresh enough and not a manual refresh → serve from cache, skip the network entirely.
    if (fresh && !opts.force) {
      WeatherAPI.Perf.emit({
        type: "serve",
        id: city.id,
        mode: "fresh"
      });
      return;
    }
    WeatherAPI.Perf.emit({
      type: "serve",
      id: city.id,
      mode: cached ? "stale" : "miss"
    });

    // Revalidate. Cancel any prior active request so a fast tab-switch doesn't
    // leave a stale fetch racing the new one.
    if (abortRef.current) abortRef.current.abort();
    const ctrl = new AbortController();
    abortRef.current = ctrl;
    if (cached) setRefreshing(true);else setStatus("loading");
    WeatherAPI.loadPlaceProgressive(city, {
      signal: ctrl.signal,
      // Progressive paint: hero fills the moment current conditions arrive,
      // the rest of the panels stream in.
      onPartial: partial => {
        setCache(c => ({
          ...c,
          [city.id]: partial
        }));
        setSample(false);
        setStatus("ready");
      }
    }).then(full => {
      setCache(c => ({
        ...c,
        [city.id]: full
      }));
      WeatherAPI.cacheWrite(city.id, full);
      setSample(false);
      setError("");
      setStatus("ready");
    }).catch(e => {
      if (e && e.name === "AbortError") return; // superseded — ignore
      if (!cache[city.id]) {
        const s = WeatherAPI.sampleData();
        setCache(c => ({
          ...c,
          [city.id]: s
        }));
        setSample(true);
      }
      setError(e.message || "Could not load weather.");
      setStatus("ready");
    }).finally(() => {
      if (abortRef.current === ctrl) {
        abortRef.current = null;
        setRefreshing(false);
      }
    });
  }, [cache]);
  useEffect(() => {
    load(active); /* eslint-disable-next-line */
  }, [activeId]);

  // ---- prefetch inactive cities on idle ---------------------------------
  // Once the active view is ready, warm the other tabs during idle time so
  // switching to them is instant (served fresh from cache).
  useEffect(() => {
    if (status !== "ready") return;
    const ric = window.requestIdleCallback || (fn => setTimeout(() => fn({
      timeRemaining: () => 0
    }), 250));
    const cic = window.cancelIdleCallback || clearTimeout;
    const handle = ric(() => {
      for (const c of cities) {
        if (c.id === activeId) continue;
        if (cache[c.id] && WeatherAPI.isFresh(cache[c.id])) continue;
        WeatherAPI.Perf.emit({
          type: "prefetch",
          id: c.id
        });
        WeatherAPI.loadPlaceProgressive(c, {}).then(full => {
          setCache(x => ({
            ...x,
            [c.id]: full
          }));
          WeatherAPI.cacheWrite(c.id, full);
        }).catch(() => {});
      }
    });
    return () => cic(handle);
    /* eslint-disable-next-line */
  }, [status, activeId, cities]);

  // Anticipatory prefetch when the user hovers a city tab.
  const prefetch = useCallback(city => {
    if (!city) return;
    if (cache[city.id] && WeatherAPI.isFresh(cache[city.id])) return;
    WeatherAPI.Perf.emit({
      type: "prefetch",
      id: city.id,
      hover: true
    });
    WeatherAPI.loadPlaceProgressive(city, {}).then(full => {
      setCache(x => ({
        ...x,
        [city.id]: full
      }));
      WeatherAPI.cacheWrite(city.id, full);
    }).catch(() => {});
  }, [cache]);

  // ---- theme application -------------------------------------------------
  useEffect(() => {
    if (!data) return;
    const th = data.theme;
    const light = th.ink === "light";
    const vars = {
      "--bg-0": th.bg[0],
      "--bg-1": th.bg[1],
      "--bg-2": th.bg[2],
      ...hexFromInk(light)
    };
    if (t.accent === "Conditions") {
      vars["--accent"] = th.accentColor;
      vars["--accent-soft"] = th.accentSoft;
    } else {
      const h = ACCENT_HUE[t.accent] || 235;
      vars["--accent"] = `oklch(0.78 0.135 ${h})`;
      vars["--accent-soft"] = `oklch(0.78 0.135 ${h} / 0.22)`;
    }
    applyVars(vars);
  }, [data, t.accent]);

  // ---- direction + tweak vars -------------------------------------------
  useEffect(() => {
    applyVars(DIRECTIONS[t.direction] || DIRECTIONS.immersive);
    if (t.glassBlur > 0) applyVars({
      "--glass-blur": t.glassBlur + "px"
    });
    applyVars({
      "--temp-scale": String((DIRECTIONS[t.direction] ? parseFloat(DIRECTIONS[t.direction]["--temp-scale"]) : 1) * t.heroSize)
    });
  }, [t.direction, t.glassBlur, t.heroSize]);

  // ---- handlers ----------------------------------------------------------
  const onSearchSelect = place => {
    const id = `${place.lat.toFixed(4)},${place.lon.toFixed(4)}`;
    const city = {
      id,
      name: place.name,
      lat: place.lat,
      lon: place.lon,
      country: place.country,
      state: place.state
    };
    setCities(cs => cs.find(c => c.id === id) ? cs : [...cs, city]);
    setActiveId(id);
    if (!cache[id]) load(city);
  };
  const onRemove = id => {
    setCities(cs => {
      const next = cs.filter(c => c.id !== id);
      if (id === activeId && next.length) setActiveId(next[0].id);
      return next;
    });
  };
  const onLocate = () => {
    if (!navigator.geolocation) {
      setError("Geolocation unavailable.");
      return;
    }
    setRefreshing(true);
    navigator.geolocation.getCurrentPosition(async pos => {
      try {
        const place = await WeatherAPI.reverseGeocode(pos.coords.latitude, pos.coords.longitude);
        onSearchSelect(place);
      } catch (e) {
        setError("Could not resolve your location.");
      }
      setRefreshing(false);
    }, () => {
      setError("Location permission denied.");
      setRefreshing(false);
    });
  };
  const alerts = React.useMemo(() => data ? buildAlerts(data, unit) : [], [data, unit]);
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(WeatherBackground, {
    fx: data ? data.theme.fx : "clouds",
    animate: t.motion,
    accent: "rgba(255,236,180,0.9)"
  }), /*#__PURE__*/React.createElement("div", {
    className: "app-scroll"
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: "var(--maxw, 1180px)",
      margin: "0 auto",
      padding: "26px clamp(16px, 4vw, 40px) 80px"
    }
  }, /*#__PURE__*/React.createElement(Header, {
    unit: unit,
    onUnit: setUnit,
    onLocate: onLocate,
    onRefresh: () => load(active, {
      force: true
    }),
    refreshing: refreshing,
    onSearchSelect: onSearchSelect,
    searchFn: WeatherAPI.geocode
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 18
    }
  }, /*#__PURE__*/React.createElement(CityTabs, {
    cities: cities,
    activeId: activeId,
    onSelect: setActiveId,
    onRemove: onRemove,
    onPrefetch: prefetch
  })), sample && /*#__PURE__*/React.createElement("div", {
    className: "glass",
    style: {
      marginTop: 16,
      padding: "10px 16px",
      borderRadius: 12,
      fontSize: 13,
      color: "var(--ink-soft)"
    }
  }, "Showing sample data \u2014 live service unavailable", error ? ` (${error})` : "", "."), status === "loading" && !data ? /*#__PURE__*/React.createElement(Skeleton, null) : data ? /*#__PURE__*/React.createElement(Fade, {
    k: activeId + (sample ? "-s" : "") + unit
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 22,
      display: "flex",
      flexDirection: "column",
      gap: "var(--gap, 16px)"
    }
  }, alerts.length > 0 && /*#__PURE__*/React.createElement(Alerts, {
    alerts: alerts
  }), /*#__PURE__*/React.createElement("div", {
    className: "wx-grid"
  }, /*#__PURE__*/React.createElement("div", {
    className: "wx-hero glass",
    style: {
      padding: "30px 34px"
    }
  }, /*#__PURE__*/React.createElement(Hero, {
    d: data,
    unit: unit
  })), /*#__PURE__*/React.createElement("div", {
    className: "wx-wind glass",
    style: {
      padding: "20px 22px",
      display: "flex",
      flexDirection: "column",
      gap: 14
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "label"
  }, "Wind"), /*#__PURE__*/React.createElement(WindCompass, {
    deg: data.now.windDeg,
    speed: data.now.windSpeed,
    gust: data.now.windGust,
    unit: unit
  })), /*#__PURE__*/React.createElement("div", {
    className: "wx-hourly"
  }, data.hourly.length ? /*#__PURE__*/React.createElement(HourlyStrip, {
    hourly: data.hourly,
    tzOffset: data.tzOffset,
    unit: unit
  }) : /*#__PURE__*/React.createElement("div", {
    className: "skeleton",
    style: {
      height: 132,
      borderRadius: "var(--radius)"
    }
  })), /*#__PURE__*/React.createElement("div", {
    className: "wx-details"
  }, /*#__PURE__*/React.createElement(DetailsCard, {
    d: data,
    unit: unit
  })), /*#__PURE__*/React.createElement("div", {
    className: "wx-sun glass",
    style: {
      padding: "20px 22px",
      display: "flex",
      flexDirection: "column",
      gap: 14
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "label"
  }, "Sun"), /*#__PURE__*/React.createElement(SunArc, {
    sunrise: data.now.sunrise,
    sunset: data.now.sunset,
    now: data.now.dt,
    tzOffset: data.tzOffset,
    isNight: data.isNight
  })), /*#__PURE__*/React.createElement("div", {
    className: "wx-air glass",
    style: {
      padding: "20px 22px",
      display: "flex",
      flexDirection: "column",
      gap: 14
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "label"
  }, "Air quality"), /*#__PURE__*/React.createElement(AQIGauge, {
    air: data.air
  })), /*#__PURE__*/React.createElement("div", {
    className: "wx-daily"
  }, data.daily.length ? /*#__PURE__*/React.createElement(DailyForecast, {
    daily: data.daily,
    tzOffset: data.tzOffset,
    unit: unit
  }) : /*#__PURE__*/React.createElement("div", {
    className: "skeleton",
    style: {
      height: 280,
      borderRadius: "var(--radius)"
    }
  })), t.showMap && /*#__PURE__*/React.createElement("div", {
    className: "wx-map"
  }, /*#__PURE__*/React.createElement(MiniMap, {
    lat: active.lat,
    lon: active.lon,
    place: active.name
  }))))) : null)), /*#__PURE__*/React.createElement(TweaksPanel, null, /*#__PURE__*/React.createElement(TweakSection, {
    label: "Design direction"
  }), /*#__PURE__*/React.createElement(TweakRadio, {
    label: "Direction",
    value: t.direction,
    options: ["immersive", "studio", "editorial"],
    onChange: v => setTweak("direction", v)
  }), /*#__PURE__*/React.createElement(TweakSection, {
    label: "Color & motion"
  }), /*#__PURE__*/React.createElement(TweakSelect, {
    label: "Accent",
    value: t.accent,
    options: ["Conditions", "Azure", "Coral", "Violet", "Mint", "Gold"],
    onChange: v => setTweak("accent", v)
  }), /*#__PURE__*/React.createElement(TweakToggle, {
    label: "Animated sky",
    value: t.motion,
    onChange: v => setTweak("motion", v)
  }), /*#__PURE__*/React.createElement(TweakSection, {
    label: "Form"
  }), /*#__PURE__*/React.createElement(TweakSlider, {
    label: "Glass blur",
    value: t.glassBlur,
    min: 0,
    max: 36,
    unit: "px",
    onChange: v => setTweak("glassBlur", v)
  }), /*#__PURE__*/React.createElement(TweakSlider, {
    label: "Hero size",
    value: t.heroSize,
    min: 0.75,
    max: 1.2,
    step: 0.05,
    onChange: v => setTweak("heroSize", v)
  }), /*#__PURE__*/React.createElement(TweakToggle, {
    label: "Show map",
    value: t.showMap,
    onChange: v => setTweak("showMap", v)
  }), /*#__PURE__*/React.createElement(TweakSection, {
    label: "Performance"
  }), /*#__PURE__*/React.createElement(TweakToggle, {
    label: "Performance HUD",
    value: t.perfHud,
    onChange: v => setTweak("perfHud", v)
  })), t.perfHud && /*#__PURE__*/React.createElement(PerfHUD, null));
}

// ---- details card (2x2 mini stats) --------------------------------------
function DetailsCard({
  d,
  unit
}) {
  const n = d.now;
  const items = [{
    label: "Humidity",
    value: n.humidity,
    unit: "%"
  }, {
    label: "Pressure",
    value: n.pressure,
    unit: "hPa"
  }, {
    label: "Visibility",
    value: n.visibility != null ? Units.vis(n.visibility, unit) : "—",
    raw: true
  }, {
    label: "Cloud cover",
    value: n.clouds != null ? n.clouds : "—",
    unit: "%"
  }];
  return /*#__PURE__*/React.createElement("div", {
    className: "glass",
    style: {
      padding: "20px 22px",
      height: "100%",
      display: "flex",
      flexDirection: "column",
      gap: 16
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "label"
  }, "Conditions"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "grid",
      gridTemplateColumns: "1fr 1fr",
      gap: "18px 16px",
      flex: 1
    }
  }, items.map(it => /*#__PURE__*/React.createElement("div", {
    key: it.label,
    style: {
      display: "flex",
      flexDirection: "column",
      gap: 4,
      justifyContent: "center"
    }
  }, /*#__PURE__*/React.createElement("span", {
    className: "label",
    style: {
      fontSize: 10
    }
  }, it.label), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "baseline",
      gap: 4
    }
  }, /*#__PURE__*/React.createElement("span", {
    className: "serif",
    style: {
      fontSize: 30,
      lineHeight: 1
    }
  }, it.raw ? it.value : it.value), !it.raw && it.unit && /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 13,
      color: "var(--ink-faint)"
    }
  }, it.unit))))));
}

// ---- loading skeleton ----------------------------------------------------
function Skeleton() {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 22,
      display: "flex",
      flexDirection: "column",
      gap: 16
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "wx-grid"
  }, /*#__PURE__*/React.createElement("div", {
    className: "wx-hero skeleton",
    style: {
      height: 300
    }
  }), /*#__PURE__*/React.createElement("div", {
    className: "wx-wind skeleton",
    style: {
      height: 300
    }
  }), /*#__PURE__*/React.createElement("div", {
    className: "wx-hourly skeleton",
    style: {
      height: 140
    }
  }), /*#__PURE__*/React.createElement("div", {
    className: "wx-details skeleton",
    style: {
      height: 200
    }
  }), /*#__PURE__*/React.createElement("div", {
    className: "wx-sun skeleton",
    style: {
      height: 200
    }
  }), /*#__PURE__*/React.createElement("div", {
    className: "wx-air skeleton",
    style: {
      height: 200
    }
  }), /*#__PURE__*/React.createElement("div", {
    className: "wx-daily skeleton",
    style: {
      height: 280
    }
  }), /*#__PURE__*/React.createElement("div", {
    className: "wx-map skeleton",
    style: {
      height: 280
    }
  })));
}
ReactDOM.createRoot(document.getElementById("root")).render(/*#__PURE__*/React.createElement(App, null));