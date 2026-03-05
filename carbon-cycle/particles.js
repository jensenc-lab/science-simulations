/* ============================================================
   Carbon Cycle — particles.js
   Animated particles that visualise five carbon-transfer flows.
   API: Particles.draw(ts, ctrl, state, isPlaying)
   ============================================================ */

const Particles = (() => {
  'use strict';

  const MAX = 80;
  let parts = [];
  let W = 800, H = 500;

  const rnd = () => Math.random();
  const rng = (a, b) => a + rnd() * (b - a);
  const bz  = (t, a, b, c, d) => {
    const u = 1 - t;
    return u*u*u*a + 3*u*u*t*b + 3*u*t*t*c + t*t*t*d;
  };

  // Mirror scene.js hill formula (SKY_F = 0.50)
  const hillY = x =>
    H * 0.52
    + Math.sin(x / W * Math.PI * 1.8 + 0.4) * H * 0.048
    + Math.sin(x / W * Math.PI * 3.6 + 1.1) * H * 0.022;

  const treeX = (i, n) => W * (0.04 + (i + 0.5) / n * 0.74);

  // ── Add a particle to the pool ────────────────────────────
  function spawn(x0, y0, cx1, cy1, cx2, cy2, x3, y3, col, r, label) {
    if (parts.length >= MAX) return;
    parts.push({
      x0, y0, cx1, cy1, cx2, cy2, x3, y3,
      x: x0, y: y0,
      t: 0, dt: rng(0.008, 0.014),
      col, r: r || 3, label: label || null,
    });
  }

  // ── Five spawn functions ──────────────────────────────────

  // Photosynthesis — CO₂ descends from sky into a tree canopy
  function spawnPhoto(ctrl) {
    const n  = ctrl.producers;
    const i  = Math.floor(rnd() * n);
    const tx = treeX(i, n);
    const ty = hillY(tx) - H * 0.08;
    const sx = tx + rng(-60, 60);
    const sy = rng(H * 0.04, H * 0.20);
    spawn(sx, sy,
          sx + rng(-20, 20), sy + rng(20, 50),
          tx + rng(-15, 15), ty - rng(20, 40),
          tx, ty, '46,204,113', 3, 'CO₂');
  }

  // Respiration — CO₂ rises from a tree or animal to sky
  function spawnResp(ctrl) {
    const n = ctrl.producers;
    let sx, sy;
    if (ctrl.consumers > 0 && rnd() < 0.4) {
      sx = rng(W * 0.06, W * 0.78);
      sy = hillY(sx) - rng(6, 18);
    } else {
      const i = Math.floor(rnd() * n);
      sx = treeX(i, n) + rng(-20, 20);
      sy = hillY(sx) - H * 0.06;
    }
    const dy = rng(H * 0.04, H * 0.22);
    spawn(sx, sy,
          sx + rng(-30, 30), sy - rng(20, 50),
          sx + rng(-20, 20), dy + rng(10, 30),
          sx + rng(-10, 10), dy, '230,126,34', 3, 'CO₂');
  }

  // Consumption — plant carbon moves to a nearby animal
  function spawnConsume(ctrl) {
    if (ctrl.consumers === 0) return;
    const n  = ctrl.producers;
    const i  = Math.floor(rnd() * n);
    const tx = treeX(i, n);
    const ty = hillY(tx) - H * 0.04;
    const ax = tx + rng(-80, 80);
    const ay = hillY(ax) - rng(8, 18);
    spawn(tx, ty,
          tx + (ax - tx) * 0.3 + rng(-10, 10), ty - rng(10, 25),
          ax - (ax - tx) * 0.3 + rng(-10, 10), ay - rng( 5, 15),
          ax, ay, '241,196,15', 3, null);
  }

  // Decomposition — CO₂ rises slowly from soil
  function spawnDecomp(ctrl) {
    const sx = rng(W * 0.05, W * 0.88);
    const sy = hillY(sx) + rng(8, H * 0.12);
    const dy = rng(H * 0.04, H * 0.28);
    spawn(sx, sy,
          sx + rng(-25, 25), sy - rng(15, 35),
          sx + rng(-15, 15), dy + rng(10, 25),
          sx + rng(-10, 10), dy, '155,89,182', 3, 'CO₂');
  }

  // Human emissions — rises from factory chimney (matches scene.js: fx=W*0.90)
  function spawnHuman(ctrl) {
    if (ctrl.human <= 15) return;
    const fx = W * 0.85 + 11;           // chimney centre x (matches scene.js)
    const fy = hillY(W * 0.85) - 62;   // chimney top (scene.js: gy - 66)
    const dy = rng(H * 0.02, H * 0.18);
    spawn(fx + rng(-4,  4), fy,
          fx + rng(-15, 15), fy - rng(20, 50),
          fx + rng(-10, 10), dy + rng( 5, 20),
          fx + rng(-8,   8), dy, '127,140,141', 4, 'CO₂');
  }

  // ── Per-frame spawn probabilities ─────────────────────────
  function trySpawn(ctrl) {
    const sun  = ctrl.sunlight   / 100;
    const prod = ctrl.producers;
    const cons = ctrl.consumers;
    const dec  = ctrl.decomposers / 100;
    const hum  = ctrl.human       / 100;

    if (rnd() < sun * prod * 0.018) spawnPhoto(ctrl);
    if (rnd() < prod * 0.020)       spawnResp(ctrl);
    if (rnd() < cons * 0.025)       spawnConsume(ctrl);
    if (rnd() < dec  * 0.050)       spawnDecomp(ctrl);
    if (rnd() < hum  * 0.080)       spawnHuman(ctrl);
  }

  // ── Main entry — called every frame from app.js ───────────
  function draw(ts, ctrl, state, isPlaying) {
    const canvas = document.getElementById('scene');
    if (!canvas) return;
    W = canvas.width;
    H = canvas.height;
    const ctx = canvas.getContext('2d');

    if (isPlaying) trySpawn(ctrl);

    ctx.save();
    ctx.font         = '8px Segoe UI';
    ctx.textBaseline = 'middle';

    for (let k = parts.length - 1; k >= 0; k--) {
      const p = parts[k];
      p.t += p.dt;
      if (p.t >= 1) { parts.splice(k, 1); continue; }

      p.x = bz(p.t, p.x0, p.cx1, p.cx2, p.x3);
      p.y = bz(p.t, p.y0, p.cy1, p.cy2, p.y3);

      // Fade in over first 15%, fade out over last 18%
      const a = p.t < 0.15 ? p.t / 0.15
              : p.t > 0.82  ? (1 - p.t) / 0.18
              : 1;

      ctx.globalAlpha = a;
      ctx.fillStyle   = `rgb(${p.col})`;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fill();

      if (p.label) {
        ctx.fillStyle = `rgba(${p.col},0.80)`;
        ctx.fillText(p.label, p.x + p.r + 2, p.y);
      }
    }

    ctx.restore();
  }

  return { draw };
})();
