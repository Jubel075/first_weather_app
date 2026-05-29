// AUTO-GENERATED from src/widgets.jsx — do not edit directly. Edit the .jsx source and recompile.
// widgets.jsx — small SVG data-viz + a real tile-based weather map.

// ---- generic detail tile -------------------------------------------------
function DetailTile({
  label,
  children,
  span,
  className
}) {
  return /*#__PURE__*/React.createElement("div", {
    className: "glass " + (className || ""),
    style: {
      padding: "18px 20px 20px",
      display: "flex",
      flexDirection: "column",
      gap: 10,
      gridColumn: span ? `span ${span}` : undefined,
      minHeight: 132
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "label"
  }, label), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      flexDirection: "column",
      gap: 6,
      flex: 1,
      justifyContent: "center"
    }
  }, children));
}
function BigStat({
  value,
  unit,
  sub
}) {
  return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "baseline",
      gap: 6
    }
  }, /*#__PURE__*/React.createElement("span", {
    className: "serif",
    style: {
      fontSize: 46,
      lineHeight: 0.9
    }
  }, value), unit && /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 16,
      color: "var(--ink-soft)"
    }
  }, unit)), sub && /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 13,
      color: "var(--ink-faint)",
      marginTop: 6
    }
  }, sub));
}

// ---- wind compass --------------------------------------------------------
function WindCompass({
  deg,
  speed,
  gust,
  unit
}) {
  const r = 54,
    cx = 64,
    cy = 64;
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      gap: 18
    }
  }, /*#__PURE__*/React.createElement("svg", {
    width: "128",
    height: "128",
    viewBox: "0 0 128 128"
  }, /*#__PURE__*/React.createElement("circle", {
    cx: cx,
    cy: cy,
    r: r,
    fill: "none",
    stroke: "var(--glass-border)",
    strokeWidth: "1"
  }), Array.from({
    length: 36
  }).map((_, i) => {
    const a = i * 10 * Math.PI / 180;
    const major = i % 9 === 0;
    const r1 = r - (major ? 9 : 4);
    return /*#__PURE__*/React.createElement("line", {
      key: i,
      x1: cx + r * Math.sin(a),
      y1: cy - r * Math.cos(a),
      x2: cx + r1 * Math.sin(a),
      y2: cy - r1 * Math.cos(a),
      stroke: "var(--ink-faint)",
      strokeWidth: major ? 1.4 : 0.8
    });
  }), ["N", "E", "S", "W"].map((d, i) => {
    const a = i * 90 * Math.PI / 180;
    return /*#__PURE__*/React.createElement("text", {
      key: d,
      x: cx + (r - 20) * Math.sin(a),
      y: cy - (r - 20) * Math.cos(a) + 4,
      textAnchor: "middle",
      fontSize: "11",
      fontFamily: "var(--mono)",
      fill: "var(--ink-faint)"
    }, d);
  }), /*#__PURE__*/React.createElement("g", {
    transform: `rotate(${deg} ${cx} ${cy})`,
    style: {
      transition: "transform 800ms cubic-bezier(0.16,1,0.3,1)"
    }
  }, /*#__PURE__*/React.createElement("path", {
    d: `M${cx} ${cy - 40} L${cx - 7} ${cy} L${cx} ${cy - 8} L${cx + 7} ${cy} Z`,
    fill: "var(--accent)"
  }), /*#__PURE__*/React.createElement("path", {
    d: `M${cx} ${cy + 36} L${cx - 6} ${cy} L${cx} ${cy + 8} L${cx + 6} ${cy} Z`,
    fill: "var(--ink-faint)"
  })), /*#__PURE__*/React.createElement("circle", {
    cx: cx,
    cy: cy,
    r: "3",
    fill: "var(--ink)"
  })), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "baseline",
      gap: 5
    }
  }, /*#__PURE__*/React.createElement("span", {
    className: "serif",
    style: {
      fontSize: 40,
      lineHeight: 0.9
    }
  }, Units.windStr(speed, unit)), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 13,
      color: "var(--ink-soft)"
    }
  }, Units.windUnit(unit))), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 13,
      color: "var(--ink-soft)",
      marginTop: 8
    }
  }, "From ", windDir(deg), " \xB7 ", Math.round(deg), "\xB0"), gust != null && /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 13,
      color: "var(--ink-faint)",
      marginTop: 3
    }
  }, "Gusts ", Units.windStr(gust, unit), " ", Units.windUnit(unit))));
}

// ---- sun arc -------------------------------------------------------------
function SunArc({
  sunrise,
  sunset,
  now,
  tzOffset,
  isNight
}) {
  if (!sunrise || !sunset) return /*#__PURE__*/React.createElement("div", {
    style: {
      color: "var(--ink-faint)",
      fontSize: 13
    }
  }, "No sun data.");
  const span = sunset - sunrise;
  let prog = (now - sunrise) / span;
  prog = Math.max(0, Math.min(1, prog));
  const W = 220,
    H = 96,
    pad = 14;
  const arcY = H - 16;
  // semicircle path
  const x = pad + prog * (W - pad * 2);
  const t = prog * Math.PI;
  const sx = pad + (W - pad * 2) * (1 - Math.cos(t)) / 2;
  const sy = arcY - Math.sin(t) * (arcY - pad);
  const dayLen = Math.round(span / 3600);
  const dayMin = Math.round(span % 3600 / 60);
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      flexDirection: "column",
      gap: 6
    }
  }, /*#__PURE__*/React.createElement("svg", {
    width: "100%",
    viewBox: `0 0 ${W} ${H}`,
    style: {
      overflow: "visible"
    }
  }, /*#__PURE__*/React.createElement("path", {
    d: `M${pad} ${arcY} A ${(W - pad * 2) / 2} ${arcY - pad} 0 0 1 ${W - pad} ${arcY}`,
    fill: "none",
    stroke: "var(--glass-border)",
    strokeWidth: "1.5",
    strokeDasharray: "2 5"
  }), /*#__PURE__*/React.createElement("path", {
    d: `M${pad} ${arcY} A ${(W - pad * 2) / 2} ${arcY - pad} 0 0 1 ${sx} ${sy}`,
    fill: "none",
    stroke: "var(--accent)",
    strokeWidth: "2.5"
  }), /*#__PURE__*/React.createElement("line", {
    x1: pad,
    y1: arcY,
    x2: W - pad,
    y2: arcY,
    stroke: "var(--ink-faint)",
    strokeWidth: "1"
  }), !isNight && /*#__PURE__*/React.createElement("circle", {
    cx: sx,
    cy: sy,
    r: "7",
    fill: "var(--accent)",
    style: {
      filter: "drop-shadow(0 0 8px var(--accent))"
    }
  }), isNight && /*#__PURE__*/React.createElement("circle", {
    cx: W - pad - 6,
    cy: arcY - 4,
    r: "6",
    fill: "var(--ink-soft)"
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      justifyContent: "space-between",
      fontSize: 12,
      color: "var(--ink-soft)"
    }
  }, /*#__PURE__*/React.createElement("span", null, /*#__PURE__*/React.createElement("span", {
    className: "label",
    style: {
      display: "block",
      marginBottom: 2
    }
  }, "Sunrise"), localTime(sunrise, tzOffset, {
    hour: "numeric",
    minute: "2-digit"
  })), /*#__PURE__*/React.createElement("span", {
    style: {
      textAlign: "center",
      color: "var(--ink-faint)"
    }
  }, dayLen, "h ", dayMin, "m"), /*#__PURE__*/React.createElement("span", {
    style: {
      textAlign: "right"
    }
  }, /*#__PURE__*/React.createElement("span", {
    className: "label",
    style: {
      display: "block",
      marginBottom: 2
    }
  }, "Sunset"), localTime(sunset, tzOffset, {
    hour: "numeric",
    minute: "2-digit"
  }))));
}

// ---- AQI gauge -----------------------------------------------------------
function AQIGauge({
  air
}) {
  if (!air) return /*#__PURE__*/React.createElement("div", {
    style: {
      color: "var(--ink-faint)",
      fontSize: 13
    }
  }, "No air-quality data.");
  const info = AQI_INFO[air.aqi] || AQI_INFO[3];
  const comps = [{
    k: "PM2.5",
    v: air.pm2_5
  }, {
    k: "PM10",
    v: air.pm10
  }, {
    k: "O₃",
    v: air.o3
  }, {
    k: "NO₂",
    v: air.no2
  }];
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      flexDirection: "column",
      gap: 14
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      gap: 14
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "baseline",
      gap: 8
    }
  }, /*#__PURE__*/React.createElement("span", {
    className: "serif",
    style: {
      fontSize: 44,
      lineHeight: 0.9,
      color: info.color
    }
  }, air.aqi), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 15,
      fontWeight: 600,
      color: info.color
    }
  }, info.label))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: 4
    }
  }, [1, 2, 3, 4, 5].map(n => /*#__PURE__*/React.createElement("div", {
    key: n,
    style: {
      flex: 1,
      height: 6,
      borderRadius: 99,
      background: n <= air.aqi ? AQI_INFO[n].color : "var(--glass-border)",
      opacity: n <= air.aqi ? 1 : 0.5
    }
  }))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "grid",
      gridTemplateColumns: "1fr 1fr",
      gap: "8px 18px"
    }
  }, comps.map(c => /*#__PURE__*/React.createElement("div", {
    key: c.k,
    style: {
      display: "flex",
      justifyContent: "space-between",
      fontSize: 13
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      color: "var(--ink-faint)"
    }
  }, c.k), /*#__PURE__*/React.createElement("span", {
    className: "mono",
    style: {
      color: "var(--ink-soft)"
    }
  }, c.v != null ? Math.round(c.v) : "—", /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 10
    }
  }, " \xB5g"))))));
}

// ---- mini weather map (real tiles) --------------------------------------
function lon2tile(lon, z) {
  return (lon + 180) / 360 * Math.pow(2, z);
}
function lat2tile(lat, z) {
  const r = lat * Math.PI / 180;
  return (1 - Math.log(Math.tan(r) + 1 / Math.cos(r)) / Math.PI) / 2 * Math.pow(2, z);
}
const MAP_LAYERS = [{
  key: "precipitation_new",
  label: "Rain"
}, {
  key: "clouds_new",
  label: "Clouds"
}, {
  key: "temp_new",
  label: "Temp"
}, {
  key: "wind_new",
  label: "Wind"
}];
const MiniMap = React.memo(function MiniMap({
  lat,
  lon,
  place
}) {
  const [layer, setLayer] = React.useState("precipitation_new");
  const z = 7,
    TILE = 256,
    GRID = 3;
  const fx = lon2tile(lon, z),
    fy = lat2tile(lat, z);
  const cx = Math.floor(fx),
    cy = Math.floor(fy);
  const offX = (fx - cx) * TILE,
    offY = (fy - cy) * TILE;
  const tiles = [];
  for (let dy = -1; dy <= 1; dy++) for (let dx = -1; dx <= 1; dx++) tiles.push({
    dx,
    dy,
    x: cx + dx,
    y: cy + dy
  });
  const board = GRID * TILE;
  const translate = `translate(${board / 2 - TILE / 2 - offX - TILE}px, ${board / 2 - TILE / 2 - offY - TILE}px)`;
  return /*#__PURE__*/React.createElement("div", {
    className: "glass",
    style: {
      padding: 0,
      overflow: "hidden",
      position: "relative",
      minHeight: 280,
      display: "flex",
      flexDirection: "column"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: "absolute",
      inset: 0,
      overflow: "hidden"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: "absolute",
      top: "50%",
      left: "50%",
      width: board,
      height: board,
      transform: `translate(-50%,-50%)`
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: "absolute",
      width: board,
      height: board,
      transform: translate
    }
  }, tiles.map((t, i) => /*#__PURE__*/React.createElement(React.Fragment, {
    key: i
  }, /*#__PURE__*/React.createElement("img", {
    alt: "",
    src: `https://a.basemaps.cartocdn.com/dark_nolabels/${z}/${(t.x % (1 << z) + (1 << z)) % (1 << z)}/${t.y}.png`,
    style: {
      position: "absolute",
      left: (t.dx + 1) * TILE,
      top: (t.dy + 1) * TILE,
      width: TILE,
      height: TILE
    },
    draggable: "false"
  }), /*#__PURE__*/React.createElement("img", {
    alt: "",
    src: `https://tile.openweathermap.org/map/${layer}/${z}/${(t.x % (1 << z) + (1 << z)) % (1 << z)}/${t.y}.png?appid=${API_KEY}`,
    style: {
      position: "absolute",
      left: (t.dx + 1) * TILE,
      top: (t.dy + 1) * TILE,
      width: TILE,
      height: TILE,
      opacity: 0.85
    },
    draggable: "false"
  })))))), /*#__PURE__*/React.createElement("div", {
    style: {
      position: "absolute",
      top: "50%",
      left: "50%",
      transform: "translate(-50%,-50%)",
      pointerEvents: "none"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      width: 14,
      height: 14,
      borderRadius: "50%",
      background: "var(--accent)",
      boxShadow: "0 0 0 4px var(--accent-soft), 0 0 14px var(--accent)"
    }
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      position: "absolute",
      inset: 0,
      background: "linear-gradient(180deg, rgba(0,0,0,0.28), transparent 30%, transparent 70%, rgba(0,0,0,0.3))",
      pointerEvents: "none"
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      padding: "16px 18px",
      display: "flex",
      justifyContent: "space-between",
      alignItems: "flex-start"
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "label"
  }, "Live map \xB7 ", place)), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      padding: 12,
      display: "flex",
      gap: 6,
      flexWrap: "wrap"
    }
  }, MAP_LAYERS.map(l => /*#__PURE__*/React.createElement("button", {
    key: l.key,
    onClick: () => setLayer(l.key),
    className: "mono",
    style: {
      fontSize: 11,
      letterSpacing: "0.08em",
      textTransform: "uppercase",
      padding: "7px 12px",
      borderRadius: 99,
      border: "1px solid var(--glass-border)",
      background: layer === l.key ? "var(--accent)" : "var(--glass-bg)",
      color: layer === l.key ? "#0c1322" : "var(--ink-soft)",
      backdropFilter: "blur(10px)",
      transition: "all 200ms"
    }
  }, l.label))));
});
Object.assign(window, {
  DetailTile,
  BigStat,
  WindCompass,
  SunArc,
  AQIGauge,
  MiniMap
});