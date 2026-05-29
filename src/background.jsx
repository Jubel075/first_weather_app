// AUTO-GENERATED from src/background.jsx — do not edit directly. Edit the .jsx source and recompile.
// background.jsx — condition-reactive animated sky.
// Canvas particle field (rain / snow / stars / sun motes) + DOM cloud & mist
// layers + lightning flashes for storms. Driven by theme.fx.

function WeatherBackground({
  fx,
  animate,
  accent
}) {
  const canvasRef = React.useRef(null);
  const rafRef = React.useRef(0);
  React.useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    let w = 0,
      h = 0,
      dpr = Math.min(window.devicePixelRatio || 1, 2);
    function resize() {
      w = canvas.clientWidth;
      h = canvas.clientHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }
    resize();
    window.addEventListener("resize", resize);
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let parts = [];
    function seed() {
      parts = [];
      const area = w * h;
      if (fx === "rain" || fx === "storm") {
        const n = Math.floor(area / 9000);
        for (let i = 0; i < n; i++) parts.push({
          x: Math.random() * w,
          y: Math.random() * h,
          len: 12 + Math.random() * 18,
          v: 7 + Math.random() * 6,
          a: 0.12 + Math.random() * 0.25
        });
      } else if (fx === "snow") {
        const n = Math.floor(area / 14000);
        for (let i = 0; i < n; i++) parts.push({
          x: Math.random() * w,
          y: Math.random() * h,
          r: 1.4 + Math.random() * 2.8,
          v: 0.5 + Math.random() * 1.1,
          drift: Math.random() * 2 - 1,
          ph: Math.random() * 6.28,
          a: 0.4 + Math.random() * 0.5
        });
      } else if (fx === "stars") {
        const n = Math.floor(area / 4200);
        for (let i = 0; i < n; i++) parts.push({
          x: Math.random() * w,
          y: Math.random() * h * 0.85,
          r: 0.4 + Math.random() * 1.4,
          ph: Math.random() * 6.28,
          sp: 0.5 + Math.random() * 1.5,
          a: 0.3 + Math.random() * 0.7
        });
      } else if (fx === "sun") {
        const n = Math.floor(area / 22000);
        for (let i = 0; i < n; i++) parts.push({
          x: Math.random() * w,
          y: Math.random() * h,
          r: 1 + Math.random() * 2.4,
          v: 0.2 + Math.random() * 0.5,
          drift: Math.random() * 0.6 - 0.3,
          ph: Math.random() * 6.28,
          a: 0.15 + Math.random() * 0.3
        });
      }
    }
    seed();
    window.addEventListener("resize", seed);
    let t = 0;
    function frame() {
      t += 1;
      ctx.clearRect(0, 0, w, h);
      if (fx === "rain" || fx === "storm") {
        ctx.strokeStyle = "rgba(200,225,255,1)";
        ctx.lineWidth = 1.1;
        for (const p of parts) {
          ctx.globalAlpha = p.a;
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(p.x - p.len * 0.18, p.y + p.len);
          ctx.stroke();
          p.y += p.v;
          p.x -= p.v * 0.18;
          if (p.y > h) {
            p.y = -p.len;
            p.x = Math.random() * w;
          }
        }
      } else if (fx === "snow") {
        ctx.fillStyle = "rgba(255,255,255,1)";
        for (const p of parts) {
          p.ph += 0.01;
          ctx.globalAlpha = p.a;
          ctx.beginPath();
          ctx.arc(p.x + Math.sin(p.ph) * 6, p.y, p.r, 0, 6.2832);
          ctx.fill();
          p.y += p.v;
          p.x += p.drift * 0.3;
          if (p.y > h) {
            p.y = -4;
            p.x = Math.random() * w;
          }
        }
      } else if (fx === "stars") {
        for (const p of parts) {
          p.ph += 0.02 * p.sp;
          ctx.globalAlpha = p.a * (0.55 + 0.45 * Math.sin(p.ph));
          ctx.fillStyle = "rgba(255,255,255,1)";
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.r, 0, 6.2832);
          ctx.fill();
        }
      } else if (fx === "sun") {
        ctx.fillStyle = accent || "rgba(255,236,180,1)";
        for (const p of parts) {
          p.ph += 0.01;
          ctx.globalAlpha = p.a * (0.6 + 0.4 * Math.sin(p.ph));
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.r, 0, 6.2832);
          ctx.fill();
          p.y -= p.v;
          p.x += p.drift;
          if (p.y < -5) {
            p.y = h + 5;
            p.x = Math.random() * w;
          }
        }
      }
      ctx.globalAlpha = 1;
      rafRef.current = requestAnimationFrame(frame);
    }
    if (animate && !reduce && fx) frame();

    // Don't burn CPU/battery animating a canvas nobody can see.
    function onVis() {
      if (document.hidden) {
        cancelAnimationFrame(rafRef.current);
        rafRef.current = 0;
      } else if (animate && !reduce && fx && !rafRef.current) {
        rafRef.current = requestAnimationFrame(frame);
      }
    }
    document.addEventListener("visibilitychange", onVis);
    return () => {
      cancelAnimationFrame(rafRef.current);
      document.removeEventListener("visibilitychange", onVis);
      window.removeEventListener("resize", resize);
      window.removeEventListener("resize", seed);
    };
  }, [fx, animate, accent]);
  const showClouds = fx === "clouds";
  const showMist = fx === "mist";
  const showStorm = fx === "storm";
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
    className: "sky"
  }), /*#__PURE__*/React.createElement("div", {
    className: "sky-veil"
  }, (fx === "sun" || fx === "stars") && /*#__PURE__*/React.createElement("div", {
    style: {
      position: "absolute",
      top: fx === "sun" ? "-14%" : "6%",
      right: fx === "sun" ? "8%" : "14%",
      width: 460,
      height: 460,
      borderRadius: "50%",
      background: fx === "sun" ? "radial-gradient(circle, rgba(255,238,190,0.55), transparent 62%)" : "radial-gradient(circle, rgba(214,224,255,0.4), transparent 60%)",
      filter: "blur(8px)"
    }
  }), showClouds && [0, 1, 2, 3].map(i => /*#__PURE__*/React.createElement("div", {
    key: i,
    style: {
      position: "absolute",
      top: `${8 + i * 19}%`,
      left: `-30%`,
      width: `${320 + i * 90}px`,
      height: `${120 + i * 30}px`,
      background: "radial-gradient(closest-side, rgba(255,255,255,0.14), transparent)",
      filter: "blur(22px)",
      animation: animate ? `drift${i % 2} ${36 + i * 9}s linear infinite` : "none"
    }
  })), showMist && [0, 1, 2].map(i => /*#__PURE__*/React.createElement("div", {
    key: i,
    style: {
      position: "absolute",
      left: 0,
      right: 0,
      top: `${20 + i * 26}%`,
      height: "26%",
      background: "linear-gradient(0deg, rgba(255,255,255,0.0), rgba(255,255,255,0.12), rgba(255,255,255,0.0))",
      filter: "blur(10px)",
      animation: animate ? `mist ${22 + i * 7}s ease-in-out infinite alternate` : "none"
    }
  })), showStorm && /*#__PURE__*/React.createElement("div", {
    className: "lightning"
  })), /*#__PURE__*/React.createElement("canvas", {
    ref: canvasRef,
    className: "sky-canvas"
  }), /*#__PURE__*/React.createElement("style", null, `
        @keyframes drift0 { to { transform: translateX(180vw); } }
        @keyframes drift1 { to { transform: translateX(180vw); } }
        @keyframes mist { from { transform: translateX(-6%); } to { transform: translateX(6%); } }
        .lightning { position:absolute; inset:0; background:rgba(214,205,255,0.0); }
        ${animate ? `.lightning { animation: flash 9s infinite; }` : ""}
        @keyframes flash {
          0%, 92%, 100% { background: rgba(214,205,255,0); }
          93% { background: rgba(220,212,255,0.0); }
          93.5% { background: rgba(230,224,255,0.55); }
          94% { background: rgba(214,205,255,0.05); }
          94.6% { background: rgba(235,230,255,0.4); }
          95.4% { background: rgba(214,205,255,0); }
        }
      `));
}
window.WeatherBackground = WeatherBackground;