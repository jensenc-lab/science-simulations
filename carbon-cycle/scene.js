/* ============================================================
   Carbon Cycle Ecosystem Simulation — scene.js
   Draws sky and surface layers. Underground layer: Phase 2.
   API: Scene.init(canvas, ctrl, state) · draw(ts, ctrl, state)
        Scene.update(ctrl) · resize(w, h) · reset()
   ============================================================ */

const Scene = (() => {
  'use strict';

  let canvas, ctx, W = 800, H = 500;
  let _ctrl  = { sunlight:70, producers:6, consumers:3, human:10 };
  let _state = { atmCO2: 280 };
  let t = 0;

  // ── Helpers ───────────────────────────────────────────────────
  const lerp    = (a, b, f) => a + (b - a) * f;
  const srand   = s => { const v = Math.sin(s + 1) * 43758.5453; return v - Math.floor(v); };
  const rgb     = ([r,g,b]) => `rgb(${r},${g},${b})`;
  const lerpRGB = (a, b, f) => a.map((v,i) => Math.round(lerp(v, b[i], f)));

  // ── Sky color keyframes (sunlight %) ──────────────────────────
  const SKY = [
    { at:0,   top:[11,26,46],   bot:[22,32,64]    },  // night
    { at:20,  top:[18,36,72],   bot:[160,80,40]   },  // dawn
    { at:50,  top:[38,96,172],  bot:[96,154,216]  },  // midday
    { at:100, top:[74,158,222], bot:[135,206,235] },  // bright
  ];

  function skyColors(sun) {
    let lo = SKY[0], hi = SKY[1];
    for (let i = 0; i < SKY.length - 1; i++)
      if (sun >= SKY[i].at) { lo = SKY[i]; hi = SKY[i + 1]; }
    const f = (sun - lo.at) / (hi.at - lo.at);
    return { top: lerpRGB(lo.top, hi.top, f), bot: lerpRGB(lo.bot, hi.bot, f) };
  }

  // ── Pre-generated stable scene elements ───────────────────────
  const stars  = Array.from({length:30}, (_,i) => ({
    x: srand(i*7+1), y: srand(i*11+2) * 0.42, r: 0.5 + srand(i*19+3) * 1.5,
  }));
  const co2Pts = Array.from({length:20}, (_,i) => ({
    xf: 0.04 + srand(i*13+4) * 0.88, yf: 0.04 + srand(i*17+5) * 0.38,
    ph: srand(i*23+6) * Math.PI * 2,  spd: 0.7 + srand(i*31+7) * 0.6,
  }));
  const clouds = [
    { x:0, yf:0.10, w:90,  h:28, spd:0.22 },
    { x:0, yf:0.20, w:130, h:32, spd:0.15 },
    { x:0, yf:0.14, w:75,  h:22, spd:0.28 },
  ];
  let animals = [];

  // ── Pre-generated underground elements ────────────────────────
  const rocks = Array.from({length:7}, (_,i) => ({
    xf: 0.05+srand(i*103+16)*0.88, yf: 0.60+srand(i*107+17)*0.14,
    rx: 8+srand(i*109+18)*10, ry: 4+srand(i*113+19)*5, rot: srand(i*117+20)*Math.PI,
  }));
  const deadLeaves = Array.from({length:25}, (_,i) => ({
    x: 0.03+srand(i*83+12)*0.92, yOff: srand(i*89+13)*0.06,
    rot: srand(i*97+14)*Math.PI, col: srand(i*101+15) > 0.5,
  }));
  const mushroomSpots = Array.from({length:10}, (_,i) => ({ xf: 0.06+srand(i*127+21)*0.82 }));
  let soilOrgs = [];

  // ── Ground profile: y of surface at canvas-x ─────────────────
  const SKY_F = 0.50;
  const hillY = x =>
    H * (SKY_F + 0.02)
    + Math.sin(x / W * Math.PI * 1.8 + 0.4) * H * 0.048
    + Math.sin(x / W * Math.PI * 3.6 + 1.1) * H * 0.022;

  // ── SKY LAYER ─────────────────────────────────────────────────
  function drawSky() {
    const sun  = _ctrl.sunlight;
    const skyH = H * SKY_F;
    const { top, bot } = skyColors(sun);
    const g = ctx.createLinearGradient(0, 0, 0, skyH);
    g.addColorStop(0, rgb(top)); g.addColorStop(1, rgb(bot));
    ctx.fillStyle = g; ctx.fillRect(0, 0, W, skyH);

    // Stars — fade out above 30% sunlight
    if (sun < 30) {
      const alpha = ((30 - sun) / 30 * 0.85).toFixed(2);
      ctx.fillStyle = `rgba(255,255,255,${alpha})`;
      stars.forEach(s => {
        ctx.beginPath(); ctx.arc(s.x * W, s.y * skyH, s.r, 0, Math.PI * 2); ctx.fill();
      });
    }
  }

  function drawSun() {
    const sun = _ctrl.sunlight;
    if (sun < 2) return;
    const r = sun / 100 * 50, sx = W * 0.84, sy = H * 0.13;
    // Glow
    const glow = ctx.createRadialGradient(sx, sy, 0, sx, sy, r * 3.6);
    glow.addColorStop(0,   `rgba(255,230,80,${(0.30 * sun/100).toFixed(2)})`);
    glow.addColorStop(0.5, `rgba(255,200,50,${(0.12 * sun/100).toFixed(2)})`);
    glow.addColorStop(1,   'rgba(255,200,50,0)');
    ctx.fillStyle = glow;
    ctx.beginPath(); ctx.arc(sx, sy, r * 3.6, 0, Math.PI * 2); ctx.fill();
    // Rotating rays (batched into one path)
    ctx.save(); ctx.translate(sx, sy); ctx.rotate(t / 8000);
    ctx.strokeStyle = `rgba(255,220,60,${(0.38 * sun/100).toFixed(2)})`; ctx.lineWidth = 1.5;
    ctx.beginPath();
    for (let i = 0; i < 8; i++) { ctx.rotate(Math.PI/4); ctx.moveTo(r*1.45, 0); ctx.lineTo(r*2.3, 0); }
    ctx.stroke(); ctx.restore();
    // Disc
    ctx.fillStyle = '#FFD700';
    ctx.beginPath(); ctx.arc(sx, sy, r, 0, Math.PI * 2); ctx.fill();
  }

  function drawClouds() {
    clouds.forEach(c => {
      c.x -= c.spd;
      if (c.x < -c.w * 2) c.x = W + c.w;
      const cy = H * c.yf;
      ctx.save(); ctx.globalAlpha = 0.72; ctx.fillStyle = '#dce8f5';
      // 4-ellipse puff cluster
      [[0,0],[c.w*.35,-c.h*.42],[c.w*.65,-c.h*.30],[c.w,0]].forEach(([dx,dy]) => {
        ctx.beginPath(); ctx.ellipse(c.x+dx, cy+dy, c.w*0.38, c.h*0.54, 0, 0, Math.PI*2); ctx.fill();
      });
      ctx.restore();
    });
  }

  function drawCO2Labels() {
    const n = Math.min(20, Math.round((_state.atmCO2 || 280) / 28));
    ctx.font = 'bold 11px Segoe UI'; ctx.fillStyle = 'rgba(200,228,255,0.50)';
    co2Pts.slice(0, n).forEach(d => {
      const bob = Math.sin(t / 1600 * d.spd + d.ph) * 7;
      ctx.fillText('CO₂', d.xf * W, d.yf * H * SKY_F + bob);
    });
  }

  // ── SURFACE LAYER ─────────────────────────────────────────────
  function drawSurface() {
    // Rolling hill shape
    ctx.beginPath(); ctx.moveTo(0, hillY(0));
    for (let x = 3; x <= W; x += 3) ctx.lineTo(x, hillY(x));
    ctx.lineTo(W, H); ctx.lineTo(0, H); ctx.closePath();
    const g = ctx.createLinearGradient(0, H * SKY_F, 0, H);
    g.addColorStop(0,    '#4a8f3f'); g.addColorStop(0.06, '#3a6530');
    g.addColorStop(0.14, '#6b5030'); g.addColorStop(1,    '#3d2010');
    ctx.fillStyle = g; ctx.fill();
    // Grass blades — single batched stroke
    ctx.beginPath(); ctx.strokeStyle = 'rgba(72,148,52,0.55)'; ctx.lineWidth = 1;
    for (let x = 0; x < W; x += 6) {
      const y = hillY(x); ctx.moveTo(x, y); ctx.lineTo(x + 1, y - 7);
    }
    ctx.stroke();
  }

  function drawTrees() {
    const n = Math.round(_state.actualProducers ?? _ctrl.producers), sun = _ctrl.sunlight;
    // Canopy color: pale yellow-green (low sun) → rich green (high sun)
    const rr = Math.round(lerp(160, 45,  sun/100));
    const rg = Math.round(lerp(176, 138, sun/100));
    const rb = Math.round(lerp(96,  78,  sun/100));
    const cLight = `rgb(${rr},${rg},${rb})`;
    const cDark  = `rgb(${Math.round(rr*.74)},${Math.round(rg*.82)},${Math.round(rb*.7)})`;

    for (let i = 0; i < n; i++) {
      const sf = 0.78 + srand(i * 137.5) * 0.44;          // stable size factor
      const x  = W * (0.04 + (i + 0.5) / n * 0.74);      // evenly spaced, right margin for factory
      const by = hillY(x);
      const sw = Math.sin(t / 1800 + i * 2.1) * 2;        // sway
      // Trunk
      ctx.fillStyle = '#5a3a1a';
      ctx.fillRect(x - 5*sf, by - 38*sf, 10*sf, 38*sf);
      // Canopy: 4 overlapping circles
      ctx.fillStyle = cDark;
      ctx.beginPath(); ctx.arc(x + sw,        by - 53*sf, 17*sf, 0, Math.PI*2); ctx.fill();
      ctx.fillStyle = cLight;
      ctx.beginPath(); ctx.arc(x - 12*sf + sw, by - 44*sf, 14*sf, 0, Math.PI*2); ctx.fill();
      ctx.beginPath(); ctx.arc(x + 12*sf + sw, by - 44*sf, 14*sf, 0, Math.PI*2); ctx.fill();
      ctx.beginPath(); ctx.arc(x + sw,          by - 36*sf, 12*sf, 0, Math.PI*2); ctx.fill();
    }
  }

  function initAnimals(n) {
    animals = Array.from({length: n}, (_, i) => ({
      x:   W * (0.08 + srand(i*41+1) * 0.68),
      dir: srand(i*71+2) > 0.5 ? 1 : -1,
      spd: 0.35 + srand(i*53+3) * 0.30,
      ph:  srand(i*97+4) * Math.PI * 2,
    }));
  }

  function drawAnimals() {
    const n = Math.round(_state.actualConsumers ?? _ctrl.consumers);
    // Grow array when slider increases
    while (animals.length < n) {
      const i = animals.length;
      animals.push({ x: W*(0.1 + srand(i*41+1)*0.68), dir:1, spd:0.40, ph:i*1.4 });
    }
    animals.length = n;

    animals.forEach(a => {
      a.x += a.dir * a.spd;
      if (a.x < 35 || a.x > W * 0.79) a.dir *= -1;
      const by  = hillY(a.x);
      const bob = Math.sin(t / 320 + a.ph) * 1.5;
      const d   = a.dir;
      // Body + head
      ctx.fillStyle = '#c8a882';
      ctx.beginPath(); ctx.ellipse(a.x, by-8+bob, 14, 7, 0, 0, Math.PI*2); ctx.fill();
      ctx.beginPath(); ctx.arc(a.x + d*13, by-11+bob, 5.5, 0, Math.PI*2); ctx.fill();
      // Ear
      ctx.fillStyle = '#b08060';
      ctx.beginPath(); ctx.ellipse(a.x+d*15, by-17+bob, 2.5, 4.5, d*0.2, 0, Math.PI*2); ctx.fill();
      // Legs — batched
      ctx.strokeStyle = '#a07050'; ctx.lineWidth = 1.5;
      ctx.beginPath();
      [-7, -2, 4, 9].forEach(dx => {
        ctx.moveTo(a.x+dx, by-2+bob); ctx.lineTo(a.x+dx, by+5+bob);
      });
      ctx.stroke();
    });
  }

  function drawFactory() {
    if (_ctrl.human <= 15) return;
    const fx = W * 0.85, gy = hillY(W * 0.85);
    ctx.fillStyle = '#2e2e2e';
    ctx.fillRect(fx - 22, gy - 44, 44, 44);   // building
    ctx.fillRect(fx + 6,  gy - 66, 11, 28);   // chimney
    // Windows
    ctx.fillStyle = 'rgba(255,200,60,0.35)';
    [[fx-12, gy-36],[fx+2, gy-36],[fx-12, gy-20],[fx+2, gy-20]].forEach(([wx,wy]) => {
      ctx.fillRect(wx, wy, 8, 8);
    });
    // Smoke puffs
    const intensity = (_ctrl.human - 15) / 85;
    for (let p = 0; p < 5; p++) {
      const f = (t / 1400 + p * 0.28) % 1;
      const a = (1 - f) * 0.45 * intensity;
      ctx.fillStyle = `rgba(90,90,90,${a.toFixed(2)})`;
      ctx.beginPath(); ctx.arc(fx + 11, gy - 66 - f*58, 5 + f*11, 0, Math.PI*2); ctx.fill();
    }
  }

  // ── UNDERGROUND LAYER ─────────────────────────────────────────
  function initSoilOrgs() {
    soilOrgs = Array.from({length:20}, (_,i) => ({
      xf: srand(i*59+8), yf: 0.58+srand(i*67+9)*0.09,
      ph: srand(i*73+10)*Math.PI*2, spd: 0.6+srand(i*79+11)*0.8,
    }));
  }

  function drawUnderground() {
    // Clip drawing to below the hill curve
    ctx.save();
    ctx.beginPath(); ctx.moveTo(0, hillY(0));
    for (let x = 3; x <= W; x += 3) ctx.lineTo(x, hillY(x));
    ctx.lineTo(W, H); ctx.lineTo(0, H); ctx.closePath(); ctx.clip();
    // Soil layer gradient: topsoil → subsoil → deep clay
    const g = ctx.createLinearGradient(0, H*0.50, 0, H);
    g.addColorStop(0,    '#3a2510'); g.addColorStop(0.27, '#4a3018');
    g.addColorStop(0.44, '#5a3a20'); g.addColorStop(0.65, '#6a4828');
    g.addColorStop(1,    '#7a5a3a');
    ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
    // Rocks scattered in subsoil
    rocks.forEach(r => {
      ctx.fillStyle = '#78787a';
      ctx.beginPath(); ctx.ellipse(r.xf*W, r.yf*H, r.rx, r.ry, r.rot, 0, Math.PI*2); ctx.fill();
      ctx.strokeStyle = 'rgba(0,0,0,0.2)'; ctx.lineWidth = 0.8; ctx.stroke();
    });
    ctx.restore();
  }

  function drawRoots() {
    const n = Math.round(_state.actualProducers ?? _ctrl.producers);
    ctx.strokeStyle = '#6b4a25'; ctx.lineWidth = 1;
    for (let i = 0; i < n; i++) {
      const sf  = 0.78 + srand(i*137.5)*0.44;
      const x   = W * (0.04 + (i+0.5)/n*0.74);
      const by  = hillY(x);
      const dep = 30 * sf;
      ctx.beginPath();
      ctx.moveTo(x, by);        ctx.lineTo(x, by+dep);                          // tap root
      ctx.moveTo(x, by+dep*.4); ctx.lineTo(x-15*sf, by+dep*.85);               // left branch
      ctx.moveTo(x, by+dep*.4); ctx.lineTo(x+13*sf, by+dep*.90);               // right branch
      ctx.moveTo(x-10*sf, by+dep*.65); ctx.lineTo(x-20*sf, by+dep*.98);        // sub-branch
      ctx.stroke();
    }
  }

  function drawSoilOrganisms() {
    const n = Math.round(5 + (_ctrl.decomposers/100)*14);
    soilOrgs.slice(0, n).forEach((o, i) => {
      const x = o.xf*W + Math.sin(t/3000*o.spd + o.ph)*W*0.04;
      const y = o.yf*H + Math.sin(t/2200*o.spd + o.ph+1)*H*0.02;
      ctx.fillStyle = 'rgba(200,184,152,0.72)';
      ctx.beginPath(); ctx.arc(x, y, 2, 0, Math.PI*2); ctx.fill();
      ctx.strokeStyle = 'rgba(200,184,152,0.45)'; ctx.lineWidth = 1;
      ctx.beginPath(); ctx.moveTo(x, y); ctx.quadraticCurveTo(x+5, y-2, x+9, y+1); ctx.stroke();
    });
  }

  function drawDecompParticles() {
    const decomp = _ctrl.decomposers / 100;
    const dead   = Math.min(1, (_state.deadMatter || 60) / 120);
    if (decomp < 0.25 || dead < 0.15) return;
    const n = Math.floor(decomp * dead * 14);
    for (let p = 0; p < n; p++) {
      const leaf  = deadLeaves[p % deadLeaves.length];
      const bx    = leaf.x * W;
      const frac  = ((t/2200 + p*0.37) % 1);
      const a     = (1-frac) * 0.45 * decomp;
      ctx.fillStyle = `rgba(160,190,140,${a.toFixed(2)})`;
      ctx.beginPath();
      ctx.arc(bx + Math.sin(t/900+p)*5, hillY(bx) + leaf.yOff*H - frac*H*0.16, 1.5, 0, Math.PI*2);
      ctx.fill();
    }
  }

  function drawMushrooms() {
    const decomp = _ctrl.decomposers / 100;
    const n  = Math.min(10, Math.round(2 + decomp*7));
    const sz = 0.5 + decomp*0.8;
    mushroomSpots.slice(0, n).forEach(m => {
      const x = m.xf*W, y = hillY(m.xf*W);
      ctx.fillStyle = '#d4c5a0';                                          // stem
      ctx.fillRect(x-2*sz, y-12*sz, 4*sz, 12*sz);
      ctx.fillStyle = '#8e6aad';                                          // cap
      ctx.beginPath(); ctx.ellipse(x, y-12*sz, 8*sz, 6*sz, 0, Math.PI, 0); ctx.fill();
      ctx.fillStyle = 'rgba(255,255,255,0.65)';                           // spots
      [[-3,-3],[2,-5],[4,-1]].forEach(([dx,dy]) => {
        ctx.beginPath(); ctx.arc(x+dx*sz, y-13*sz+dy*sz, 1.5*sz, 0, Math.PI*2); ctx.fill();
      });
    });
  }

  function drawDeadMatter() {
    const n = Math.min(25, Math.round((_state.deadMatter || 60) / 4));
    deadLeaves.slice(0, n).forEach(l => {
      const x = l.x*W, y = hillY(l.x*W) + l.yOff*H;
      ctx.save(); ctx.translate(x, y); ctx.rotate(l.rot);
      ctx.fillStyle = l.col ? '#8a6a30' : '#a07030';
      ctx.beginPath(); ctx.ellipse(0, 0, 6, 3, 0, 0, Math.PI*2); ctx.fill();
      ctx.strokeStyle = 'rgba(60,40,10,0.4)'; ctx.lineWidth = 0.5;
      ctx.beginPath(); ctx.moveTo(-5, 0); ctx.lineTo(5, 0); ctx.stroke();
      ctx.restore();
    });
  }

  // ── Public API ────────────────────────────────────────────────
  function draw(ts, ctrl, st) {
    t = ts; _ctrl = ctrl; _state = st;
    if (!ctx) return;
    ctx.clearRect(0, 0, W, H);
    drawSky(); drawSun(); drawClouds(); drawCO2Labels();
    drawSurface(); drawUnderground(); drawRoots();
    drawSoilOrganisms(); drawDecompParticles();
    drawDeadMatter(); drawMushrooms();
    drawTrees(); drawAnimals(); drawFactory();
  }

  function init(c, ctrl, st) {
    canvas = c; ctx = canvas.getContext('2d');
    W = canvas.width; H = canvas.height;
    _ctrl = ctrl; _state = st;
    clouds[0].x = W * 0.75; clouds[1].x = W * 0.35; clouds[2].x = W * 0.10;
    initAnimals(ctrl.consumers);
    initSoilOrgs();
  }

  function resize(w, h) { W = w; H = h; }
  function update(ctrl) { _ctrl = ctrl; }
  function reset()      { initAnimals(_ctrl.consumers); }

  return { init, draw, update, resize, reset };
})();
