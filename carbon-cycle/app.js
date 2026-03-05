/* ============================================================
   Carbon Cycle Ecosystem Simulation — app.js
   Phase 2: Carbon transfer math, in-canvas graph overlay
   ============================================================ */

// ── Control values (read by scene.js each frame) ───────────────
const controls = {
  sunlight:    70,   // 0–100 %
  producers:    6,   // 1–15 trees
  consumers:    3,   // 0–10 animals
  decomposers: 50,   // 0–100 %
  human:       10,   // 0–100 %
  speed:        1,   // 1–4 ×
};

// ── Carbon pool state (total = 730) ───────────────────────────
const TOTAL_CARBON = 730;
const INITIAL = { atmCO2: 400, plantCarbon: 200, consumerCarbon: 80, deadMatter: 50 };
const state = { ...INITIAL, actualProducers: controls.producers, actualConsumers: controls.consumers };

let isPlaying = true;

// ── History ring buffer (300 points) ─────────────────────────
const HISTORY_LEN = 300;
const history = { co2: [], plant: [], cons: [], dead: [] };
const HISTORY_KEYS = ['co2', 'plant', 'cons', 'dead'];

// ── Standard badge descriptions ───────────────────────────────
const STD_INFO = {
  '8.3.1': {
    title: '8.3.1 — Photosynthesis',
    desc:  'Plants (producers) use sunlight energy to convert CO₂ from the atmosphere and water from the soil into glucose and oxygen. This process stores carbon in plant biomass and is the entry point for carbon into the food web.',
  },
  '8.3.2': {
    title: '8.3.2 — Cellular Respiration',
    desc:  'All living organisms — producers, consumers, and decomposers — release energy from glucose through cellular respiration. This process releases CO₂ back into the atmosphere and is the primary way carbon exits living organisms.',
  },
  '8.3.3': {
    title: '8.3.3 — The Carbon Cycle',
    desc:  'Carbon moves continuously between the atmosphere, living organisms, soil, and human systems. Photosynthesis removes CO₂; respiration, decomposition, and burning fossil fuels return it. Human activity is increasingly disrupting this natural balance.',
  },
};

// ── Slider wiring ─────────────────────────────────────────────
function initSliders() {
  const defs = [
    { id: 'sun',         key: 'sunlight',    valId: 'sun-val',    fmt: v => v + '%' },
    { id: 'producers',   key: 'producers',   valId: 'prod-val',   fmt: v => v       },
    { id: 'consumers',   key: 'consumers',   valId: 'cons-val',   fmt: v => v       },
    { id: 'decomposers', key: 'decomposers', valId: 'decomp-val', fmt: v => v + '%' },
    { id: 'human',       key: 'human',       valId: 'human-val',  fmt: v => v + '%' },
    { id: 'speed',       key: 'speed',       valId: 'speed-val',  fmt: v => v + '×' },
  ];

  defs.forEach(({ id, key, valId, fmt }) => {
    const slider = document.getElementById(id);
    const label  = document.getElementById(valId);
    slider.addEventListener('input', () => {
      controls[key] = +slider.value;
      label.textContent = fmt(slider.value);
      if (typeof Scene !== 'undefined') Scene.update(controls);
    });
  });
}

// ── Play / Pause / Reset ──────────────────────────────────────
function initSimButtons() {
  const playBtn = document.getElementById('play-pause');

  playBtn.addEventListener('click', () => {
    isPlaying = !isPlaying;
    playBtn.textContent = isPlaying ? '⏸ Pause' : '▶ Play';
  });

  document.getElementById('reset').addEventListener('click', () => {
    Object.assign(state, INITIAL);
    state.actualProducers = controls.producers;
    state.actualConsumers = controls.consumers;
    HISTORY_KEYS.forEach(k => { history[k].length = 0; });
    updateDataBar();
    updateAlerts();
    drawGraph();
    if (typeof Scene !== 'undefined') Scene.reset();
  });
}

// ── Standard badge modal ──────────────────────────────────────
function initBadges() {
  const overlay = document.getElementById('modal-overlay');
  const titleEl = document.getElementById('modal-title');
  const descEl  = document.getElementById('modal-desc');

  document.querySelectorAll('.std-badge').forEach(btn => {
    btn.addEventListener('click', () => {
      const info = STD_INFO[btn.dataset.std];
      if (!info) return;
      titleEl.textContent = info.title;
      descEl.textContent  = info.desc;
      overlay.classList.add('active');
    });
  });

  document.getElementById('modal-close').addEventListener('click', () =>
    overlay.classList.remove('active'));

  overlay.addEventListener('click', e => {
    if (e.target === overlay) overlay.classList.remove('active');
  });
}

// ── Data bar ─────────────────────────────────────────────────
function updateDataBar() {
  const total = state.atmCO2 + state.plantCarbon + state.consumerCarbon + state.deadMatter;
  document.getElementById('stat-co2').textContent   = Math.round(state.atmCO2);
  document.getElementById('stat-plant').textContent = Math.round(state.plantCarbon);
  document.getElementById('stat-cons').textContent  = Math.round(state.consumerCarbon);
  document.getElementById('stat-dead').textContent  = Math.round(state.deadMatter);
  document.getElementById('stat-total').textContent = Math.round(total);
}

// ── Ecosystem alerts ──────────────────────────────────────────
// Injected dynamically into the sidebar above the "Try This" section.
function initAlerts() {
  const sec = document.createElement('div');
  sec.id        = 'eco-alerts';
  sec.className = 'ctrl-section';
  sec.style.display = 'none';
  sec.innerHTML =
    '<div class="ctrl-header" style="color:#e74c3c;font-size:0.78rem">⚠ Ecosystem Alerts</div>' +
    '<div id="eco-alert-list"></div>';
  const tryThis = document.querySelector('.try-this');
  if (tryThis) tryThis.before(sec);
}

function updateAlerts() {
  const sec  = document.getElementById('eco-alerts');
  const list = document.getElementById('eco-alert-list');
  if (!sec || !list) return;

  const msgs = [];

  if (state.actualProducers < controls.producers - 0.5) {
    msgs.push(controls.sunlight < 20
      ? '⚠ Plants dying — not enough sunlight'
      : '⚠ Plants dying — not enough CO₂ absorbed');
  }
  if (controls.consumers > 0 && state.actualConsumers < controls.consumers - 0.5) {
    msgs.push('⚠ Consumers dying — not enough food from producers');
  }
  if (state.atmCO2 > 600) {
    msgs.push('⚠ High atmospheric CO₂');
  }
  if (state.deadMatter > 300 && controls.decomposers < 30) {
    msgs.push('⚠ Dead matter accumulating — decomposers can\'t keep up');
  }

  sec.style.display = msgs.length ? '' : 'none';
  list.innerHTML = msgs.map(m =>
    `<p style="font-size:0.69rem;color:#e74c3c;padding:2px 0;line-height:1.45">${m}</p>`
  ).join('');
}

// ── Mini graph ────────────────────────────────────────────────
const GRAPH_COLORS = { co2: '#e74c3c', plant: '#2ecc71', cons: '#f39c12', dead: '#8e6b3e' };

function drawGraph() {
  const canvas = document.getElementById('graph');
  const ctx    = canvas.getContext('2d');
  const W = canvas.width, H = canvas.height;
  ctx.clearRect(0, 0, W, H);

  if (history.co2.length < 2) return;

  const total = state.atmCO2 + state.plantCarbon + state.consumerCarbon + state.deadMatter;

  HISTORY_KEYS.forEach(key => {
    const data = history[key];
    ctx.beginPath();
    ctx.strokeStyle = GRAPH_COLORS[key];
    ctx.lineWidth   = 1.5;
    ctx.lineJoin    = 'round';
    data.forEach((v, i) => {
      const x = (i / Math.max(data.length - 1, 1)) * W;
      const y = H - (v / total) * H * 0.86 - 4;
      i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
    });
    ctx.stroke();
  });
}

function pushHistory() {
  history.co2.push(state.atmCO2);
  history.plant.push(state.plantCarbon);
  history.cons.push(state.consumerCarbon);
  history.dead.push(state.deadMatter);
  HISTORY_KEYS.forEach(k => { if (history[k].length > HISTORY_LEN) history[k].shift(); });
}

// ── Carbon transfer math ──────────────────────────────────────
// Rates are tuned so 100% human activity requires ~10-12 trees at full
// sunlight to offset — reinforcing that emissions are hard to counteract.
// At default settings (10% human) CO₂ rises noticeably over time.
function tickCarbon() {
  const sun  = controls.sunlight  / 100;
  const prod = state.actualProducers;           // actual (may be reduced by die-off)
  const cons = state.actualConsumers;           // actual (may be reduced by die-off)
  const dec  = controls.decomposers / 100;
  const hum  = controls.human     / 100;

  // CO₂ fertilization: slight photosynthesis boost when atmospheric CO₂ > 600
  const co2Boost = state.atmCO2 > 600 ? 1 + Math.min((state.atmCO2 - 600) / 600, 1) * 0.12 : 1;

  // ── Transfer amounts per tick (BASE_TICK_MS interval) ──────
  const photo      = sun * prod * 0.04 * co2Boost;                 // atm   → plants
  const plantResp  = prod * 0.012;                                  // plants → atm
  const consume    = (cons > 0 && state.plantCarbon > 5)            // plants → consumers
                     ? cons * 0.025 : 0;
  const consResp   = cons * 0.020;                                  // consumers → atm
  const plantDeath = prod * 0.005;                                  // plants   → dead matter
  const consDeath  = cons * 0.008;                                  // consumers→ dead matter
  const decomp     = dec  * 0.10;                                   // dead matter → atm
  const humanCO2   = hum  * 0.20;                                   // fossil (dead) → atm

  // ── Apply deltas ───────────────────────────────────────────
  state.atmCO2         += -photo + plantResp + consResp + decomp + humanCO2;
  state.plantCarbon    +=  photo - plantResp - consume  - plantDeath;
  state.consumerCarbon +=  consume - consResp - consDeath;
  state.deadMatter     +=  plantDeath + consDeath - decomp - humanCO2;

  // Clamp: no pool drops below 1
  state.atmCO2         = Math.max(1, state.atmCO2);
  state.plantCarbon    = Math.max(1, state.plantCarbon);
  state.consumerCarbon = Math.max(1, state.consumerCarbon);
  state.deadMatter     = Math.max(1, state.deadMatter);

  // Re-normalize so total stays exactly 730 (conservation of matter)
  const tot = state.atmCO2 + state.plantCarbon + state.consumerCarbon + state.deadMatter;
  const s   = TOTAL_CARBON / tot;
  state.atmCO2 *= s; state.plantCarbon *= s; state.consumerCarbon *= s; state.deadMatter *= s;
}

// ── Population die-off / recovery ────────────────────────────
const DIE_RATE  = 0.04;  // population units lost per tick when critical
const GROW_RATE = 0.01;  // slow regrowth when conditions improve

function tickPopulations() {
  // Producers: die when plantCarbon critically low; recover slowly when healthy
  if (state.plantCarbon < 30 && state.actualProducers > 0) {
    state.actualProducers = Math.max(0, state.actualProducers - DIE_RATE);
  } else if (state.actualProducers < controls.producers && state.plantCarbon > 60) {
    state.actualProducers = Math.min(controls.producers, state.actualProducers + GROW_RATE);
  }
  state.actualProducers = Math.min(state.actualProducers, controls.producers);

  // Consumers: die when consumerCarbon critically low; recover when food is available
  if (state.consumerCarbon < 15 && state.actualConsumers > 0) {
    state.actualConsumers = Math.max(0, state.actualConsumers - DIE_RATE);
  } else if (state.actualConsumers < controls.consumers
             && state.consumerCarbon > 25 && state.actualProducers > 1) {
    state.actualConsumers = Math.min(controls.consumers, state.actualConsumers + GROW_RATE);
  }
  state.actualConsumers = Math.min(state.actualConsumers, controls.consumers);
}

// ── In-canvas overlay graph (drawn on scene canvas each frame) ──
const OV_COLORS = ['#e74c3c', '#2ecc71', '#f39c12', '#a07040'];

function drawOverlayGraph() {
  const canvas = document.getElementById('scene');
  if (!canvas || history.co2.length < 2) return;
  const ctx = canvas.getContext('2d');
  const GW = 200, GH = 80;
  const gx = canvas.width - GW - 14, gy = 14;
  const n  = history.co2.length;

  // Background panel
  ctx.fillStyle = 'rgba(6, 14, 28, 0.80)';
  ctx.strokeStyle = 'rgba(46, 204, 113, 0.18)';
  ctx.lineWidth = 1;
  ctx.beginPath(); ctx.rect(gx - 8, gy - 8, GW + 16, GH + 28); ctx.fill(); ctx.stroke();

  // Subtle mid-reference line
  ctx.strokeStyle = 'rgba(255,255,255,0.07)';
  ctx.setLineDash([3, 3]);
  ctx.beginPath(); ctx.moveTo(gx, gy + GH/2); ctx.lineTo(gx + GW, gy + GH/2); ctx.stroke();
  ctx.setLineDash([]);

  // Four data lines
  HISTORY_KEYS.forEach((key, i) => {
    const data = history[key];
    ctx.beginPath(); ctx.strokeStyle = OV_COLORS[i]; ctx.lineWidth = 1.5; ctx.lineJoin = 'round';
    data.forEach((v, j) => {
      const x = gx + (j / Math.max(n - 1, 1)) * GW;
      const y = gy + GH - (v / TOTAL_CARBON) * GH * 0.92;
      j === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
    });
    ctx.stroke();
  });

  // Legend dots
  const labels = ['CO₂', 'Plants', 'Animals', 'Dead'];
  ctx.font = '8px Segoe UI';
  labels.forEach((lbl, i) => {
    const lx = gx + i * 50;
    ctx.fillStyle = OV_COLORS[i];
    ctx.beginPath(); ctx.arc(lx + 4, gy + GH + 16, 3, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = 'rgba(180, 210, 255, 0.60)';
    ctx.fillText(lbl, lx + 10, gy + GH + 19);
  });
}

// ── Canvas resize ─────────────────────────────────────────────
function resizeCanvas() {
  const canvas = document.getElementById('scene');
  const wrap   = canvas.parentElement;
  canvas.width  = wrap.clientWidth;
  canvas.height = wrap.clientHeight;
  if (typeof Scene !== 'undefined') Scene.resize(canvas.width, canvas.height);
}

// ── Animation loop ────────────────────────────────────────────
let lastTick = 0;
const BASE_TICK_MS = 500; // carbon math fires every 500ms ÷ speed

function loop(ts) {
  requestAnimationFrame(loop);

  if (isPlaying && ts - lastTick > BASE_TICK_MS / controls.speed) {
    lastTick = ts;
    tickCarbon();
    tickPopulations();
    pushHistory();
    updateDataBar();
    updateAlerts();
    drawGraph();
  }

  // Scene animates every frame; overlay graph drawn on top
  if (typeof Scene      !== 'undefined') Scene.draw(ts, controls, state);
  if (typeof Particles  !== 'undefined') Particles.draw(ts, controls, state, isPlaying);
  drawOverlayGraph();
}

// ── Init ─────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  initSliders();
  initSimButtons();
  initBadges();
  initAlerts();
  resizeCanvas();
  window.addEventListener('resize', resizeCanvas);

  if (typeof Scene !== 'undefined') {
    Scene.init(document.getElementById('scene'), controls, state);
  }

  requestAnimationFrame(loop);
});
