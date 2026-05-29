// AUTO-GENERATED from src/perf.jsx — do not edit directly. Edit the .jsx source and recompile.
// perf.jsx — optional, observable performance overlay.
// Subscribes to WeatherAPI.Perf and visualises cache decisions, per-endpoint
// timings, dedup hits and prefetches in real time. Toggle via the "Performance
// HUD" tweak. Purely diagnostic — has no effect on the data layer.

const PERF_COLORS = {
  fresh: "oklch(0.80 0.15 150)",
  // cache HIT
  stale: "oklch(0.83 0.15 95)",
  // serve stale, revalidate
  miss: "oklch(0.72 0.18 40)",
  // cold — network required
  prefetch: "oklch(0.78 0.135 235)",
  dedup: "var(--ink-faint)",
  fetch: "var(--ink-soft)",
  complete: "oklch(0.80 0.15 150)"
};
function shortId(id) {
  if (!id) return "";
  const c = window.__wxCityName && window.__wxCityName[id];
  return c || id.split(",")[0].slice(0, 7);
}
function PerfHUD() {
  const [log, setLog] = React.useState([]);
  const [stats, setStats] = React.useState({
    hits: 0,
    network: 0,
    dedup: 0,
    prefetch: 0,
    fetchMs: []
  });
  const [open, setOpen] = React.useState(true);
  const startRef = React.useRef(performance.now());
  React.useEffect(() => {
    const off = WeatherAPI.Perf.on(ev => {
      setLog(l => {
        let line = null;
        if (ev.type === "serve") {
          const tag = ev.mode === "fresh" ? "HIT" : ev.mode === "stale" ? "STALE" : "MISS";
          line = {
            c: PERF_COLORS[ev.mode],
            k: tag,
            v: shortId(ev.id)
          };
        } else if (ev.type === "fetch") {
          line = {
            c: ev.ok ? PERF_COLORS.fetch : PERF_COLORS.miss,
            k: ev.label,
            v: Math.round(ev.ms) + "ms" + (ev.ok ? "" : " ✕")
          };
        } else if (ev.type === "complete") {
          line = {
            c: PERF_COLORS.complete,
            k: "ready",
            v: shortId(ev.id) + " · " + Math.round(ev.ms) + "ms"
          };
        } else if (ev.type === "prefetch") {
          line = {
            c: PERF_COLORS.prefetch,
            k: ev.hover ? "prefetch∘" : "prefetch",
            v: shortId(ev.id)
          };
        } else if (ev.type === "dedup") {
          line = {
            c: PERF_COLORS.dedup,
            k: "dedup",
            v: shortId(ev.id)
          };
        }
        if (!line) return l;
        line.id = ev.t + ":" + Math.random();
        return [line, ...l].slice(0, 9);
      });
      setStats(s => {
        const n = {
          ...s,
          fetchMs: s.fetchMs
        };
        if (ev.type === "serve" && ev.mode === "fresh") n.hits += 1;
        if (ev.type === "serve" && ev.mode !== "fresh") n.network += 1;
        if (ev.type === "dedup") n.dedup += 1;
        if (ev.type === "prefetch") n.prefetch += 1;
        if (ev.type === "fetch" && ev.ok) n.fetchMs = [...s.fetchMs, ev.ms].slice(-30);
        return n;
      });
    });
    return off;
  }, []);
  const total = stats.hits + stats.network;
  const hitRate = total ? Math.round(stats.hits / total * 100) : 0;
  const avgMs = stats.fetchMs.length ? Math.round(stats.fetchMs.reduce((a, b) => a + b, 0) / stats.fetchMs.length) : 0;
  const wrap = {
    position: "fixed",
    left: 18,
    bottom: 18,
    zIndex: 80,
    width: 246,
    fontFamily: "var(--mono)",
    color: "var(--ink)",
    background: "rgba(10,16,26,0.62)",
    backdropFilter: "blur(16px) saturate(1.4)",
    WebkitBackdropFilter: "blur(16px) saturate(1.4)",
    border: "1px solid var(--glass-border)",
    borderRadius: 14,
    boxShadow: "0 18px 50px -24px rgba(0,0,0,0.7)",
    overflow: "hidden"
  };
  const head = {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "10px 12px",
    cursor: "pointer",
    borderBottom: open ? "1px solid var(--glass-border)" : "none"
  };
  const stat = (label, value, color) => /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      flexDirection: "column",
      gap: 3
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 9,
      letterSpacing: "0.12em",
      textTransform: "uppercase",
      color: "var(--ink-faint)"
    }
  }, label), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 16,
      color: color || "var(--ink)"
    }
  }, value));
  return /*#__PURE__*/React.createElement("div", {
    style: wrap
  }, /*#__PURE__*/React.createElement("div", {
    style: head,
    onClick: () => setOpen(o => !o)
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      gap: 7
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      width: 7,
      height: 7,
      borderRadius: "50%",
      background: "oklch(0.80 0.15 150)",
      boxShadow: "0 0 8px oklch(0.80 0.15 150)"
    }
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 10.5,
      letterSpacing: "0.16em",
      textTransform: "uppercase",
      color: "var(--ink-soft)"
    }
  }, "Performance")), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 12,
      color: "var(--ink-faint)"
    }
  }, open ? "–" : "+")), open && /*#__PURE__*/React.createElement("div", {
    style: {
      padding: 12,
      display: "flex",
      flexDirection: "column",
      gap: 12
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "grid",
      gridTemplateColumns: "1fr 1fr 1fr",
      gap: 10
    }
  }, stat("Cache", hitRate + "%", hitRate >= 50 ? "oklch(0.80 0.15 150)" : "var(--ink)"), stat("Avg call", avgMs + "ms"), stat("Prefetch", stats.prefetch)), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      flexDirection: "column",
      gap: 5,
      minHeight: 110
    }
  }, log.length === 0 && /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 11,
      color: "var(--ink-faint)"
    }
  }, "Switch cities or refresh\u2026"), log.map(l => /*#__PURE__*/React.createElement("div", {
    key: l.id,
    style: {
      display: "flex",
      justifyContent: "space-between",
      fontSize: 11,
      lineHeight: 1.3
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      color: l.c,
      fontWeight: 600
    }
  }, l.k), /*#__PURE__*/React.createElement("span", {
    style: {
      color: "var(--ink-faint)"
    }
  }, l.v)))), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 9,
      color: "var(--ink-faint)",
      letterSpacing: "0.04em",
      lineHeight: 1.4,
      paddingTop: 2,
      borderTop: "1px solid var(--glass-border)"
    }
  }, "SWR cache \xB7 dedup \xB7 progressive paint \xB7 idle + hover prefetch")));
}
window.PerfHUD = PerfHUD;