// weather.js — visual weather effects and time-lapse
// Reads shared globals from app.js: ctx, W, H, systems, animT
// Exposes: drawWeatherEffects(t), drawWeatherHud(), startTimeLapse(), wxTlRunning

let wxTlRunning = false;
let wxTlDay     = 0;
let wxTlCond    = [];   // sky conditions per day for summary
let wxLT        = 0;    // lightning phase timer

// Pre-seeded drop offsets (golden-ratio spread so they're evenly distributed)
const DROPS = Array.from({ length: 70 }, (_, i) => ({
  ox:  (i * 0.618033) % 1,
  oy:  (i * 0.381966) % 1,
  spd: 0.003 + (i % 5) * 0.0008,
}));

// Returns array of {h, l} pairs that have a front between them
function fronts() {
  const out = [];
  systems.filter(s => s.type === 'H').forEach(h =>
    systems.filter(s => s.type === 'L').forEach(l => {
      if (h.temp !== l.temp && Math.hypot((h.fx - l.fx) * W, (h.fy - l.fy) * H) < W * 0.7)
        out.push({ h, l, cold: h.temp === 'cold' || l.temp === 'cold' });
    })
  );
  return out;
}

// ── Temperature glow ────────────────────────────────────────────────
function wxGlows() {
  systems.forEach(s => {
    const x = s.fx * W, y = s.fy * H, r = W * 0.13;
    const c = s.temp === 'warm' ? '255,140,0' : '30,100,255';
    const g = ctx.createRadialGradient(x, y, 0, x, y, r);
    g.addColorStop(0, `rgba(${c},0.18)`);
    g.addColorStop(1, `rgba(${c},0)`);
    ctx.fillStyle = g; ctx.beginPath(); ctx.arc(x, y, r, 0, Math.PI * 2); ctx.fill();
  });
}

// ── Sun near H ──────────────────────────────────────────────────────
function wxSuns() {
  systems.filter(s => s.type === 'H').forEach(s => {
    const x = s.fx * W, y = s.fy * H - Math.max(36, W * 0.065), r = Math.max(7, W * 0.017);
    ctx.fillStyle = 'rgba(255,220,50,0.90)';
    ctx.beginPath(); ctx.arc(x, y, r, 0, Math.PI * 2); ctx.fill();
    ctx.strokeStyle = 'rgba(255,195,0,0.72)'; ctx.lineWidth = 1.5;
    for (let i = 0; i < 8; i++) {
      const a = (i / 8) * Math.PI * 2;
      ctx.beginPath();
      ctx.moveTo(x + Math.cos(a) * (r + 2), y + Math.sin(a) * (r + 2));
      ctx.lineTo(x + Math.cos(a) * (r + 7), y + Math.sin(a) * (r + 7));
      ctx.stroke();
    }
  });
}

// ── Cloud puff helper + clusters near L ────────────────────────────
function puff(cx, cy, r, alpha) {
  ctx.globalAlpha = alpha; ctx.fillStyle = '#cfd8dc';
  for (const [ox, oy, fr] of [[0,0,1],[0.72,-0.2,0.75],[-0.68,-0.15,0.70],[0,-0.58,0.62]])
    { ctx.beginPath(); ctx.arc(cx + ox * r, cy + oy * r, r * fr, 0, Math.PI * 2); ctx.fill(); }
  ctx.globalAlpha = 1;
}
function wxClouds() {
  systems.filter(s => s.type === 'L').forEach(s => {
    const x = s.fx * W, y = s.fy * H, r = Math.max(14, W * 0.031);
    puff(x,           y - r * 2.8, r,       0.72);
    puff(x - r * 2.4, y - r * 1.5, r * 0.8, 0.56);
    puff(x + r * 2.4, y - r * 1.2, r * 0.8, 0.56);
    puff(x,           y + r * 2.0, r * 0.7, 0.44);
  });
  // darker clouds along fronts
  fronts().forEach(({ h, l, cold }) => {
    const mx = (h.fx + l.fx) / 2 * W, my = (h.fy + l.fy) / 2 * H;
    const r = Math.max(12, W * 0.025);
    ctx.globalAlpha = cold ? 0.55 : 0.38; ctx.fillStyle = cold ? '#90a4ae' : '#b0bec5';
    for (const [ox, oy] of [[-1.5,-1],[0,-1.3],[1.5,-1],[0,-0.2]])
      { ctx.beginPath(); ctx.arc(mx + ox * r, my + oy * r, r, 0, Math.PI * 2); ctx.fill(); }
    ctx.globalAlpha = 1;
  });
}

// ── Rain near fronts ────────────────────────────────────────────────
function wxRain(t) {
  fronts().forEach(({ h, l, cold }) => {
    const n  = cold ? 44 : 24;
    const mx = (h.fx + l.fx) / 2 * W, my = (h.fy + l.fy) / 2 * H, sp = W * 0.18;
    ctx.fillStyle = cold ? 'rgba(50,120,255,0.74)' : 'rgba(90,150,255,0.50)';
    for (let i = 0; i < n; i++) {
      const d = DROPS[i % DROPS.length];
      ctx.fillRect(
        mx + (d.ox - 0.5) * sp * 2,
        my + ((d.oy + t * d.spd * 15) % 1) * sp * 1.4,
        1.5, cold ? 8 : 5
      );
    }
  });
}

// ── Lightning flashes near cold fronts ──────────────────────────────
function wxLightning() {
  wxLT += 0.01;
  fronts().filter(f => f.cold).forEach(({ h, l }) => {
    if (Math.floor(wxLT * 1.6) % 11 !== 0) return;
    const bx = (h.fx + l.fx) / 2 * W + Math.sin(wxLT * 19) * W * 0.06;
    const by = (h.fy + l.fy) / 2 * H - W * 0.04;
    ctx.strokeStyle = 'rgba(255,245,80,0.95)'; ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(bx, by); ctx.lineTo(bx - 7, by + 14);
    ctx.lineTo(bx + 5, by + 14); ctx.lineTo(bx - 6, by + 30);
    ctx.stroke();
  });
}

// ── Day label + progress bar (drawn on top of everything) ───────────
function drawWeatherHud() {
  if (!wxTlRunning && wxTlDay === 0) return;
  const lbl  = wxTlRunning ? T[lang].tlDay(wxTlDay) : T[lang].tlDone;
  const barW = Math.min(260, W * 0.32), bx = (W - barW) / 2, by = 10;
  ctx.fillStyle = 'rgba(13,40,80,0.74)';
  ctx.beginPath(); ctx.roundRect(bx - 12, by, barW + 24, 36, 8); ctx.fill();
  // track
  ctx.fillStyle = 'rgba(255,255,255,0.12)';
  ctx.beginPath(); ctx.roundRect(bx, by + 24, barW, 5, 3); ctx.fill();
  // fill
  ctx.fillStyle = '#1e88e5';
  ctx.beginPath(); ctx.roundRect(bx, by + 24, barW * (wxTlDay / 3), 5, 3); ctx.fill();
  // text
  ctx.fillStyle = '#fff'; ctx.textAlign = 'center';
  ctx.font = `bold ${Math.max(12, W * 0.018)}px Segoe UI`;
  ctx.fillText(lbl, W / 2, by + 17); ctx.textAlign = 'left';
}

// ── Master bg-effects entry ─────────────────────────────────────────
function drawWeatherEffects(t) {
  wxGlows(); wxSuns(); wxClouds(); wxRain(t); wxLightning();
}

// ── Time-lapse ──────────────────────────────────────────────────────
function startTimeLapse() {
  if (wxTlRunning || !systems.length) return;
  wxTlRunning = true; wxTlDay = 1; wxTlCond = [];
  const w0 = calcWeather(); wxTlCond.push(w0 ? w0.sky : '—');
  updateDash(w0);

  function animStep(targets, onDone) {
    const starts = systems.map(s => ({ fx: s.fx, fy: s.fy }));
    const t0 = performance.now();
    (function frame(now) {
      const p    = Math.min(1, (now - t0) / 1400);
      const ease = p < 0.5 ? 2 * p * p : -1 + (4 - 2 * p) * p;
      systems.forEach((s, i) => {
        s.fx = starts[i].fx + (targets[i].fx - starts[i].fx) * ease;
        s.fy = starts[i].fy + (targets[i].fy - starts[i].fy) * ease;
      });
      updateDash(calcWeather());
      if (p < 1) requestAnimationFrame(frame); else onDone();
    })(t0);
  }

  function advance() {
    if (wxTlDay >= 3) {
      wxTlRunning = false;
      const [d1, d2, d3] = wxTlCond;
      document.getElementById('infoText').textContent = T[lang].tlSummary(d1, d2, d3);
      setTimeout(() => { wxTlDay = 0; }, 4000); // hide HUD after a moment
      return;
    }
    setTimeout(() => {
      wxTlDay++;
      const targets = systems.map(s => ({
        fx: Math.min(0.97, s.fx + (s.type === 'L' ? 0.17 : 0.12)),
        fy: s.fy,
      }));
      animStep(targets, () => {
        const w = calcWeather(); wxTlCond.push(w ? w.sky : '—'); updateDash(w);
        advance();
      });
    }, 1800);
  }
  advance();
}
