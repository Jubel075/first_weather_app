// AUTO-GENERATED from src/panels.jsx — do not edit directly. Edit the .jsx source and recompile.
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
// panels.jsx — header, search, city tabs, hero, hourly, daily, alerts, glyphs.

// ---- line-art weather glyph (thin-stroke, currentColor) ------------------
function WeatherGlyph({
  code,
  id,
  size = 48,
  stroke = 1.6
}) {
  const night = (code || "").endsWith("n");
  const g = Math.floor((id || 800) / 100);
  const S = size,
    c = S / 2;
  const common = {
    fill: "none",
    stroke: "currentColor",
    strokeWidth: stroke,
    strokeLinecap: "round",
    strokeLinejoin: "round"
  };
  const Cloud = ({
    y = 0,
    sc = 1
  }) => /*#__PURE__*/React.createElement("path", _extends({}, common, {
    d: `M${c - 15 * sc} ${c + 8 + y} a${9 * sc} ${9 * sc} 0 0 1 ${2 * sc} ${-17 * sc} a${11 * sc} ${11 * sc} 0 0 1 ${21 * sc} ${3 * sc} a${8 * sc} ${8 * sc} 0 0 1 ${-1 * sc} ${15 * sc} Z`
  }));
  const Sun = ({
    r = 9,
    cx = c,
    cy = c
  }) => /*#__PURE__*/React.createElement("g", common, /*#__PURE__*/React.createElement("circle", {
    cx: cx,
    cy: cy,
    r: r
  }), Array.from({
    length: 8
  }).map((_, i) => {
    const a = i * 45 * Math.PI / 180;
    return /*#__PURE__*/React.createElement("line", {
      key: i,
      x1: cx + (r + 3) * Math.cos(a),
      y1: cy + (r + 3) * Math.sin(a),
      x2: cx + (r + 7) * Math.cos(a),
      y2: cy + (r + 7) * Math.sin(a)
    });
  }));
  const Moon = () => /*#__PURE__*/React.createElement("path", _extends({}, common, {
    d: `M${c + 9} ${c - 9} a11 11 0 1 0 0 18 a8 8 0 0 1 0 -18 Z`
  }));
  const Drops = () => /*#__PURE__*/React.createElement("g", common, [-8, 0, 8].map((dx, i) => /*#__PURE__*/React.createElement("line", {
    key: i,
    x1: c + dx,
    y1: c + 12,
    x2: c + dx - 2,
    y2: c + 18
  })));
  const Bolt = () => /*#__PURE__*/React.createElement("path", _extends({}, common, {
    d: `M${c + 2} ${c + 9} l-6 8 l5 0 l-3 8 l9 -11 l-5 0 l4 -5 Z`,
    fill: "currentColor"
  }));
  const Flakes = () => /*#__PURE__*/React.createElement("g", common, [-8, 0, 8].map((dx, i) => /*#__PURE__*/React.createElement("g", {
    key: i
  }, /*#__PURE__*/React.createElement("line", {
    x1: c + dx,
    y1: c + 12,
    x2: c + dx,
    y2: c + 18
  }), /*#__PURE__*/React.createElement("line", {
    x1: c + dx - 3,
    y1: c + 15,
    x2: c + dx + 3,
    y2: c + 15
  }))));
  let content;
  if ((id || 800) === 800) content = night ? /*#__PURE__*/React.createElement(Moon, null) : /*#__PURE__*/React.createElement(Sun, null);else if (g === 8 && (id === 801 || id === 802)) content = /*#__PURE__*/React.createElement("g", null, night ? /*#__PURE__*/React.createElement(Moon, null) : /*#__PURE__*/React.createElement(Sun, {
    r: 6,
    cx: c + 8,
    cy: c - 8
  }), /*#__PURE__*/React.createElement(Cloud, null));else if (g === 8) content = /*#__PURE__*/React.createElement(Cloud, null);else if (g === 2) content = /*#__PURE__*/React.createElement("g", null, /*#__PURE__*/React.createElement(Cloud, null), /*#__PURE__*/React.createElement(Bolt, null));else if (g === 3 || g === 5) content = /*#__PURE__*/React.createElement("g", null, /*#__PURE__*/React.createElement(Cloud, null), /*#__PURE__*/React.createElement(Drops, null));else if (g === 6) content = /*#__PURE__*/React.createElement("g", null, /*#__PURE__*/React.createElement(Cloud, null), /*#__PURE__*/React.createElement(Flakes, null));else if (g === 7) content = /*#__PURE__*/React.createElement("g", common, [0, 1, 2, 3].map(i => /*#__PURE__*/React.createElement("line", {
    key: i,
    x1: c - 14,
    y1: c - 6 + i * 6,
    x2: c + 14 - i % 2 * 6,
    y2: c - 6 + i * 6
  })));else content = /*#__PURE__*/React.createElement(Cloud, null);
  return /*#__PURE__*/React.createElement("svg", {
    width: S,
    height: S,
    viewBox: `0 0 ${S} ${S}`,
    style: {
      color: "var(--ink)",
      flex: "none"
    }
  }, content);
}

// ---- header / search -----------------------------------------------------
function Header({
  unit,
  onUnit,
  onLocate,
  onRefresh,
  refreshing,
  onSearchSelect,
  searchFn
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: 14,
      alignItems: "center",
      flexWrap: "wrap"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      gap: 12,
      marginRight: "auto"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      width: 34,
      height: 34,
      borderRadius: 11,
      background: "var(--accent)",
      display: "grid",
      placeItems: "center",
      boxShadow: "0 0 18px var(--accent-soft)"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      width: 14,
      height: 14,
      borderRadius: "50%",
      border: "2.4px solid #0c1322"
    }
  })), /*#__PURE__*/React.createElement("div", {
    className: "serif",
    style: {
      fontSize: 26,
      letterSpacing: "0.01em"
    }
  }, "Halcyon", /*#__PURE__*/React.createElement("span", {
    style: {
      fontStyle: "italic",
      color: "var(--ink-soft)"
    }
  }, " weather"))), /*#__PURE__*/React.createElement(SearchBox, {
    onSelect: onSearchSelect,
    searchFn: searchFn
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: 8,
      alignItems: "center"
    }
  }, /*#__PURE__*/React.createElement("button", {
    onClick: onLocate,
    className: "glass",
    title: "Use my location",
    style: {
      width: 44,
      height: 44,
      borderRadius: 14,
      display: "grid",
      placeItems: "center",
      padding: 0
    }
  }, /*#__PURE__*/React.createElement("svg", {
    width: "20",
    height: "20",
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "1.7"
  }, /*#__PURE__*/React.createElement("circle", {
    cx: "12",
    cy: "12",
    r: "3.2"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M12 2v3M12 19v3M2 12h3M19 12h3",
    strokeLinecap: "round"
  }))), /*#__PURE__*/React.createElement("button", {
    onClick: onRefresh,
    className: "glass",
    title: "Refresh",
    style: {
      width: 44,
      height: 44,
      borderRadius: 14,
      display: "grid",
      placeItems: "center",
      padding: 0
    }
  }, /*#__PURE__*/React.createElement("svg", {
    className: refreshing ? "spin" : "",
    width: "19",
    height: "19",
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "1.7"
  }, /*#__PURE__*/React.createElement("path", {
    d: "M21 12a9 9 0 1 1-2.6-6.3M21 4v5h-5",
    strokeLinecap: "round",
    strokeLinejoin: "round"
  }))), /*#__PURE__*/React.createElement("div", {
    className: "glass",
    style: {
      display: "flex",
      padding: 4,
      borderRadius: 14
    }
  }, ["C", "F"].map(u => /*#__PURE__*/React.createElement("button", {
    key: u,
    onClick: () => onUnit(u),
    className: "mono",
    style: {
      padding: "8px 13px",
      borderRadius: 10,
      fontSize: 13,
      border: "none",
      background: unit === u ? "var(--accent)" : "transparent",
      color: unit === u ? "#0c1322" : "var(--ink-soft)",
      fontWeight: 600
    }
  }, "\xB0", u)))));
}
function SearchBox({
  onSelect,
  searchFn
}) {
  const [q, setQ] = React.useState("");
  const [res, setRes] = React.useState([]);
  const [open, setOpen] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const tRef = React.useRef(0);
  const boxRef = React.useRef(null);
  React.useEffect(() => {
    const close = e => {
      if (boxRef.current && !boxRef.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, []);
  function onChange(v) {
    setQ(v);
    clearTimeout(tRef.current);
    if (v.trim().length < 2) {
      setRes([]);
      setOpen(false);
      return;
    }
    setLoading(true);
    setOpen(true);
    tRef.current = setTimeout(async () => {
      try {
        const r = await searchFn(v.trim());
        setRes(r);
      } catch (e) {
        setRes([]);
      }
      setLoading(false);
    }, 320);
  }
  return /*#__PURE__*/React.createElement("div", {
    ref: boxRef,
    style: {
      position: "relative",
      flex: "1 1 280px",
      maxWidth: 420
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "glass",
    style: {
      display: "flex",
      alignItems: "center",
      gap: 10,
      padding: "0 16px",
      height: 44,
      borderRadius: 14
    }
  }, /*#__PURE__*/React.createElement("svg", {
    width: "18",
    height: "18",
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "var(--ink-faint)",
    strokeWidth: "1.8"
  }, /*#__PURE__*/React.createElement("circle", {
    cx: "11",
    cy: "11",
    r: "7"
  }), /*#__PURE__*/React.createElement("path", {
    d: "m20 20-3.2-3.2",
    strokeLinecap: "round"
  })), /*#__PURE__*/React.createElement("input", {
    value: q,
    onChange: e => onChange(e.target.value),
    onFocus: () => q.length >= 2 && setOpen(true),
    placeholder: "Search any city\u2026",
    style: {
      flex: 1,
      background: "transparent",
      border: "none",
      outline: "none",
      color: "var(--ink)",
      fontSize: 15
    }
  }), loading && /*#__PURE__*/React.createElement("div", {
    className: "spin",
    style: {
      width: 14,
      height: 14,
      border: "2px solid var(--glass-border)",
      borderTopColor: "var(--accent)",
      borderRadius: "50%"
    }
  })), open && (res.length > 0 || !loading && q.length >= 2) && /*#__PURE__*/React.createElement("div", {
    className: "glass glass-strong",
    style: {
      position: "absolute",
      top: 52,
      left: 0,
      right: 0,
      padding: 6,
      borderRadius: 16,
      zIndex: 50,
      maxHeight: 320,
      overflowY: "auto"
    }
  }, res.length === 0 && !loading && /*#__PURE__*/React.createElement("div", {
    style: {
      padding: "12px 14px",
      color: "var(--ink-faint)",
      fontSize: 14
    }
  }, "No matches."), res.map((r, i) => /*#__PURE__*/React.createElement("button", {
    key: i,
    onClick: () => {
      onSelect(r);
      setQ("");
      setRes([]);
      setOpen(false);
    },
    style: {
      display: "flex",
      width: "100%",
      textAlign: "left",
      gap: 10,
      padding: "11px 14px",
      background: "transparent",
      border: "none",
      borderRadius: 11,
      alignItems: "baseline"
    },
    onMouseEnter: e => e.currentTarget.style.background = "var(--glass-bg)",
    onMouseLeave: e => e.currentTarget.style.background = "transparent"
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 15,
      color: "var(--ink)"
    }
  }, r.name), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 13,
      color: "var(--ink-faint)"
    }
  }, [r.state, r.country].filter(Boolean).join(", "))))));
}
const CityTabs = React.memo(function CityTabs({
  cities,
  activeId,
  onSelect,
  onRemove,
  onPrefetch
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: 8,
      flexWrap: "wrap"
    }
  }, cities.map(c => {
    const active = c.id === activeId;
    return /*#__PURE__*/React.createElement("div", {
      key: c.id,
      onClick: () => onSelect(c.id),
      onPointerEnter: () => onPrefetch && onPrefetch(c),
      className: "glass" + (active ? " glass-strong" : ""),
      style: {
        display: "flex",
        alignItems: "center",
        gap: 10,
        padding: "9px 12px 9px 15px",
        borderRadius: 14,
        cursor: "pointer",
        borderColor: active ? "var(--accent)" : "var(--glass-border)",
        transition: "all 200ms"
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        display: "flex",
        flexDirection: "column",
        lineHeight: 1.2
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        fontSize: 14,
        color: "var(--ink)"
      }
    }, c.name), /*#__PURE__*/React.createElement("span", {
      className: "mono",
      style: {
        fontSize: 10,
        color: "var(--ink-faint)",
        letterSpacing: "0.05em"
      }
    }, c.country, c.state ? " · " + c.state : "")), cities.length > 1 && /*#__PURE__*/React.createElement("button", {
      onClick: e => {
        e.stopPropagation();
        onRemove(c.id);
      },
      style: {
        width: 22,
        height: 22,
        borderRadius: "50%",
        border: "none",
        background: "var(--glass-bg)",
        color: "var(--ink-faint)",
        display: "grid",
        placeItems: "center",
        fontSize: 14,
        lineHeight: 1
      }
    }, "\xD7"));
  }));
});

// ---- alerts (derived from real values) -----------------------------------
function buildAlerts(d, unit) {
  const a = [];
  const n = d.now;
  const windKmh = n.windSpeed * 3.6;
  if (windKmh >= 38) a.push({
    sev: "high",
    title: "High winds",
    body: `Sustained ${Units.windStr(n.windSpeed, unit)} ${Units.windUnit(unit)}${n.windGust ? `, gusts to ${Units.windStr(n.windGust, unit)}` : ""}. Secure loose objects.`
  });
  if (n.temp >= 35) a.push({
    sev: "high",
    title: "Extreme heat",
    body: `Feels like ${Units.tempStr(n.feels, unit)}. Hydrate and limit sun exposure.`
  });
  if (n.temp <= -8) a.push({
    sev: "high",
    title: "Severe cold",
    body: `Feels like ${Units.tempStr(n.feels, unit)}. Risk of frostbite on exposed skin.`
  });
  if (n.visibility != null && n.visibility < 2000) a.push({
    sev: "med",
    title: "Low visibility",
    body: `Visibility ${Units.vis(n.visibility, unit)}. Take care on the roads.`
  });
  if (d.air && d.air.aqi >= 4) a.push({
    sev: "med",
    title: "Poor air quality",
    body: `Air quality is ${AQI_INFO[d.air.aqi].label.toLowerCase()}. Sensitive groups should limit outdoor activity.`
  });
  const maxPop = d.hourly.length ? Math.max(...d.hourly.slice(0, 4).map(h => h.pop)) : 0;
  if (maxPop >= 70 && Math.floor(d.condition.id / 100) === 2) a.push({
    sev: "high",
    title: "Thunderstorms likely",
    body: `${maxPop}% chance in the next hours. Stay indoors during lightning.`
  });
  return a;
}
function Alerts({
  alerts
}) {
  if (!alerts.length) return null;
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      flexDirection: "column",
      gap: 10
    }
  }, alerts.map((al, i) => /*#__PURE__*/React.createElement("div", {
    key: i,
    className: "glass",
    style: {
      display: "flex",
      gap: 14,
      padding: "14px 18px",
      borderRadius: 16,
      alignItems: "flex-start",
      borderColor: al.sev === "high" ? "oklch(0.7 0.18 40 / 0.6)" : "var(--glass-border)"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      width: 30,
      height: 30,
      flex: "none",
      borderRadius: 9,
      display: "grid",
      placeItems: "center",
      background: al.sev === "high" ? "oklch(0.7 0.18 40 / 0.25)" : "var(--accent-soft)"
    }
  }, /*#__PURE__*/React.createElement("svg", {
    width: "17",
    height: "17",
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: al.sev === "high" ? "oklch(0.78 0.18 40)" : "var(--accent)",
    strokeWidth: "2",
    strokeLinecap: "round",
    strokeLinejoin: "round"
  }, /*#__PURE__*/React.createElement("path", {
    d: "M12 9v4M12 17h.01M10.3 3.9 1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0Z"
  }))), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 15,
      fontWeight: 600,
      marginBottom: 2
    }
  }, al.title), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 13.5,
      color: "var(--ink-soft)",
      lineHeight: 1.45
    }
  }, al.body)))));
}

// ---- hero ----------------------------------------------------------------
const Hero = React.memo(function Hero({
  d,
  unit
}) {
  const n = d.now;
  const localNow = localTime(n.dt, d.tzOffset, {
    weekday: "long",
    hour: "numeric",
    minute: "2-digit"
  });
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      flexDirection: "column",
      gap: 6
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      gap: 10,
      flexWrap: "wrap"
    }
  }, /*#__PURE__*/React.createElement("h1", {
    className: "serif",
    style: {
      margin: 0,
      fontSize: 40,
      fontWeight: 400,
      letterSpacing: "0.01em"
    }
  }, d.place.name), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 14,
      color: "var(--ink-faint)"
    }
  }, d.place.state ? d.place.state + ", " : "", d.place.country)), /*#__PURE__*/React.createElement("div", {
    className: "mono",
    style: {
      fontSize: 12.5,
      color: "var(--ink-faint)",
      letterSpacing: "0.06em"
    }
  }, localNow, " \xB7 local"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      gap: 18,
      marginTop: 12,
      flexWrap: "wrap"
    }
  }, /*#__PURE__*/React.createElement(WeatherGlyph, {
    code: d.condition.icon,
    id: d.condition.id,
    size: 92,
    stroke: 1.4
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "flex-start"
    }
  }, /*#__PURE__*/React.createElement("span", {
    className: "serif",
    style: {
      fontSize: `calc(150px * var(--temp-scale))`,
      lineHeight: 0.82,
      fontWeight: 400
    }
  }, Math.round(Units.temp(n.temp, unit))), /*#__PURE__*/React.createElement("span", {
    className: "serif",
    style: {
      fontSize: `calc(46px * var(--temp-scale))`,
      marginTop: 8
    }
  }, "\xB0"))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: 18,
      alignItems: "center",
      marginTop: 8,
      flexWrap: "wrap"
    }
  }, /*#__PURE__*/React.createElement("span", {
    className: "serif",
    style: {
      fontSize: 26,
      fontStyle: "italic",
      textTransform: "capitalize",
      color: "var(--ink)"
    }
  }, d.condition.description), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 15,
      color: "var(--ink-soft)"
    }
  }, "Feels like ", Units.tempStr(n.feels, unit)), /*#__PURE__*/React.createElement("span", {
    style: {
      display: "flex",
      gap: 12,
      fontSize: 15,
      color: "var(--ink-soft)"
    }
  }, /*#__PURE__*/React.createElement("span", null, "H ", Units.tempStr(n.max, unit)), /*#__PURE__*/React.createElement("span", {
    style: {
      color: "var(--ink-faint)"
    }
  }, "L ", Units.tempStr(n.min, unit)))));
});

// ---- hourly strip --------------------------------------------------------
const HourlyStrip = React.memo(function HourlyStrip({
  hourly,
  tzOffset,
  unit
}) {
  if (!hourly.length) return null;
  const temps = hourly.map(h => h.temp);
  const lo = Math.min(...temps),
    hi = Math.max(...temps);
  return /*#__PURE__*/React.createElement("div", {
    className: "glass",
    style: {
      padding: "18px 4px 18px 20px",
      borderRadius: "var(--radius)"
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "label",
    style: {
      marginBottom: 14,
      paddingRight: 16
    }
  }, "Next hours \xB7 3-hour steps"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: 4,
      overflowX: "auto",
      paddingRight: 16,
      paddingBottom: 4
    }
  }, hourly.map((h, i) => {
    const t = (h.temp - lo) / Math.max(1, hi - lo);
    return /*#__PURE__*/React.createElement("div", {
      key: i,
      style: {
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 9,
        minWidth: 70,
        padding: "8px 6px"
      }
    }, /*#__PURE__*/React.createElement("span", {
      className: "mono",
      style: {
        fontSize: 11,
        color: "var(--ink-faint)"
      }
    }, i === 0 ? "Now" : localTime(h.dt, tzOffset, {
      hour: "numeric"
    })), /*#__PURE__*/React.createElement(WeatherGlyph, {
      code: h.icon,
      id: h.id,
      size: 34,
      stroke: 1.5
    }), h.pop > 5 ? /*#__PURE__*/React.createElement("span", {
      className: "mono",
      style: {
        fontSize: 10,
        color: "var(--accent)"
      }
    }, h.pop, "%") : /*#__PURE__*/React.createElement("span", {
      style: {
        height: 13
      }
    }), /*#__PURE__*/React.createElement("span", {
      className: "serif",
      style: {
        fontSize: 22,
        marginTop: 2 - t * 0
      }
    }, Units.tempStr(h.temp, unit)));
  })));
});

// ---- daily forecast ------------------------------------------------------
const DailyForecast = React.memo(function DailyForecast({
  daily,
  tzOffset,
  unit
}) {
  if (!daily.length) return null;
  const lo = Math.min(...daily.map(d => d.min));
  const hi = Math.max(...daily.map(d => d.max));
  const range = Math.max(1, hi - lo);
  return /*#__PURE__*/React.createElement("div", {
    className: "glass",
    style: {
      padding: "18px 22px",
      borderRadius: "var(--radius)"
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "label",
    style: {
      marginBottom: 12
    }
  }, daily.length, "-day outlook"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      flexDirection: "column"
    }
  }, daily.map((d, i) => {
    const l = (d.min - lo) / range,
      r = (d.max - lo) / range;
    return /*#__PURE__*/React.createElement("div", {
      key: i,
      style: {
        display: "grid",
        gridTemplateColumns: "58px 34px 44px 1fr 44px",
        alignItems: "center",
        gap: 12,
        padding: "10px 0",
        borderTop: i ? "1px solid var(--glass-border)" : "none"
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        fontSize: 14,
        color: i === 0 ? "var(--ink)" : "var(--ink-soft)"
      }
    }, i === 0 ? "Today" : localTime(d.dt, tzOffset, {
      weekday: "short"
    })), /*#__PURE__*/React.createElement(WeatherGlyph, {
      code: "01d",
      id: d.id,
      size: 28,
      stroke: 1.5
    }), d.pop > 5 ? /*#__PURE__*/React.createElement("span", {
      className: "mono",
      style: {
        fontSize: 11,
        color: "var(--accent)"
      }
    }, d.pop, "%") : /*#__PURE__*/React.createElement("span", null), /*#__PURE__*/React.createElement("div", {
      style: {
        position: "relative",
        height: 6,
        borderRadius: 99,
        background: "var(--glass-border)"
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        position: "absolute",
        left: `${l * 100}%`,
        right: `${(1 - r) * 100}%`,
        top: 0,
        bottom: 0,
        borderRadius: 99,
        background: "linear-gradient(90deg, var(--accent), oklch(0.85 0.13 75))"
      }
    })), /*#__PURE__*/React.createElement("span", {
      style: {
        fontSize: 14,
        textAlign: "right"
      }
    }, /*#__PURE__*/React.createElement("span", {
      className: "serif",
      style: {
        fontSize: 17
      }
    }, Units.tempStr(d.max, unit)), " ", /*#__PURE__*/React.createElement("span", {
      style: {
        color: "var(--ink-faint)",
        fontSize: 13
      }
    }, Math.round(Units.temp(d.min, unit)), "\xB0")));
  })));
});
Object.assign(window, {
  WeatherGlyph,
  Header,
  SearchBox,
  CityTabs,
  Alerts,
  buildAlerts,
  Hero,
  HourlyStrip,
  DailyForecast
});