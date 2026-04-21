// ── animations.js ─────────────────────────────────────────────────────────────
// Rock Cycle Lab — Utah SEEd 7.2.1
// Promise-based transformation animation overlays (skippable)

'use strict';

// Duration (ms) each animation auto-plays before resolving.
// Minimum 2000ms so short labels stay on-screen long enough to read.
const ANIM_DURATION = {
  melting:        2200,
  crystallization:2200,
  weathering:     2000,
  deposition:     2200,
  heatAndPressure:2200,
  uplift:         2000
};

// ── Main entry point ──────────────────────────────────────────────────────────
// Returns a Promise that resolves when animation completes or is skipped.
// Sets state.isAnimating = true while running; caller should NOT set it.

function animateTransformation(fromId, processId, toId) {
  return new Promise(resolve => {
    const display = document.getElementById('specimen-display');
    if (!display) { resolve(); return; }

    state.isAnimating = true;

    const overlay = document.createElement('div');
    overlay.className = 'anim-overlay';

    const procNameStr = (typeof processName === 'function')
      ? processName(processId)
      : (TRANSFORMATIONS[processId] ? TRANSFORMATIONS[processId].name : processId);

    overlay.innerHTML = `
      <div class="anim-stage" aria-hidden="true">
        ${buildAnimContent(fromId, processId, toId)}
      </div>
      <div class="anim-label">${procNameStr}</div>
      <button class="anim-skip-btn" type="button" aria-label="Skip animation">${typeof t === 'function' ? t('animSkip') : 'Skip ▶'}</button>
    `;

    display.appendChild(overlay);

    // Force reflow so transition from opacity:0 plays
    overlay.offsetHeight; // eslint-disable-line no-unused-expressions
    overlay.classList.add('running');

    let resolved = false;
    function finish() {
      if (resolved) return;
      resolved = true;
      overlay.classList.add('anim-out');
      setTimeout(() => {
        if (overlay.parentNode) overlay.remove();
        state.isAnimating = false;
        resolve();
      }, 200);
    }

    overlay.querySelector('.anim-skip-btn').addEventListener('click', finish);
    setTimeout(finish, ANIM_DURATION[processId] || 1900);
  });
}

// ── Content builder ───────────────────────────────────────────────────────────

function buildAnimContent(fromId, processId, toId) {
  switch (processId) {
    case 'melting':         return animMelting(fromId);
    case 'crystallization': return animCrystallization(toId);
    case 'weathering':      return animWeathering(fromId);
    case 'deposition':      return animDeposition(toId);
    case 'heatAndPressure': return animHeatPressure(fromId, toId);
    case 'uplift':          return animUplift(fromId);
    default:                return '';
  }
}

// ── Melting: rock drips into orange magma pool ────────────────────────────────
function animMelting(fromId) {
  const color = (ROCKS[fromId] || {}).color || '#888';
  return `<svg class="anim-svg" viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg">
  <g class="am-rock">
    <ellipse cx="60" cy="40" rx="32" ry="26" fill="${color}"/>
    <ellipse cx="60" cy="40" rx="24" ry="18" fill="${color}" opacity="0.45"/>
  </g>
  <g class="am-drips">
    <path d="M50,62 Q50,80 50,96 Q50,102 54,104" fill="none" stroke="#FF6B35" stroke-width="4" stroke-linecap="round"/>
    <path d="M60,64 Q60,82 60,100" fill="none" stroke="#FF4500" stroke-width="5" stroke-linecap="round"/>
    <path d="M70,62 Q70,80 70,96 Q70,102 66,104" fill="none" stroke="#FF6B35" stroke-width="4" stroke-linecap="round"/>
  </g>
  <ellipse class="am-pool" cx="60" cy="106" rx="10" ry="5" fill="#FF4500"/>
  <g class="am-heat">
    <line x1="38" y1="68" x2="36" y2="55" stroke="#FFD700" stroke-width="1.5" stroke-linecap="round"/>
    <line x1="54" y1="72" x2="52" y2="58" stroke="#FFA040" stroke-width="1.5" stroke-linecap="round"/>
    <line x1="70" y1="70" x2="70" y2="56" stroke="#FFD700" stroke-width="1.5" stroke-linecap="round"/>
    <line x1="84" y1="68" x2="84" y2="54" stroke="#FFA040" stroke-width="1.5" stroke-linecap="round"/>
  </g>
</svg>`;
}

// ── Crystallization: magma cools, crystals emerge ─────────────────────────────
function animCrystallization(toId) {
  const color = (ROCKS[toId] || {}).color || '#4A90D9';
  return `<svg class="anim-svg" viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg">
  <ellipse class="ac-base" cx="60" cy="90" rx="46" ry="26" fill="#FF4500"/>
  <g class="ac-crystals">
    <polygon points="60,52 53,72 67,72" fill="${color}" class="c1"/>
    <polygon points="40,60 33,78 47,78" fill="${color}" class="c2"/>
    <polygon points="80,60 73,78 87,78" fill="${color}" class="c3"/>
    <polygon points="52,46 46,62 58,62" fill="${color}" class="c4"/>
    <polygon points="70,46 64,62 76,62" fill="${color}" class="c5"/>
    <polygon points="60,40 55,54 65,54" fill="${color}" class="c6"/>
  </g>
  <g class="ac-sparks">
    <circle cx="32" cy="52" r="2.5" fill="#A0D8FF"/>
    <circle cx="88" cy="50" r="2.5" fill="#A0D8FF"/>
    <circle cx="60" cy="36" r="3"   fill="#C8ECFF"/>
    <circle cx="44" cy="42" r="2"   fill="#A0D8FF"/>
    <circle cx="76" cy="42" r="2"   fill="#A0D8FF"/>
  </g>
</svg>`;
}

// ── Weathering: rock cracks, fragments scatter ────────────────────────────────
function animWeathering(fromId) {
  const color = (ROCKS[fromId] || {}).color || '#888';
  return `<svg class="anim-svg" viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg">
  <g class="aw-rain">
    <line x1="25" y1="8"  x2="23" y2="21"  stroke="#4A90D9" stroke-width="1.8" stroke-linecap="round"/>
    <line x1="46" y1="4"  x2="44" y2="17"  stroke="#4A90D9" stroke-width="1.8" stroke-linecap="round"/>
    <line x1="67" y1="6"  x2="65" y2="19"  stroke="#4A90D9" stroke-width="1.8" stroke-linecap="round"/>
    <line x1="88" y1="5"  x2="86" y2="18"  stroke="#4A90D9" stroke-width="1.8" stroke-linecap="round"/>
    <line x1="108" y1="9" x2="106" y2="22" stroke="#4A90D9" stroke-width="1.8" stroke-linecap="round"/>
  </g>
  <ellipse class="aw-rock" cx="60" cy="62" rx="34" ry="28" fill="${color}"/>
  <g class="aw-cracks">
    <path d="M60,35 L57,50 L63,54 L59,68 L61,80" fill="none" stroke="rgba(0,0,0,0.55)" stroke-width="1.8" stroke-linecap="round"/>
    <path d="M34,54 L45,60 L41,67" fill="none" stroke="rgba(0,0,0,0.45)" stroke-width="1.4" stroke-linecap="round"/>
    <path d="M86,54 L75,60 L79,67" fill="none" stroke="rgba(0,0,0,0.45)" stroke-width="1.4" stroke-linecap="round"/>
  </g>
  <g class="aw-frags">
    <circle cx="28" cy="48" r="5"   fill="${color}" class="f1"/>
    <circle cx="92" cy="50" r="4.5" fill="${color}" class="f2"/>
    <circle cx="34" cy="82" r="4"   fill="${color}" class="f3"/>
    <circle cx="88" cy="80" r="4"   fill="${color}" class="f4"/>
    <circle cx="60" cy="28" r="3.5" fill="${color}" class="f5"/>
    <circle cx="60" cy="96" r="4"   fill="${color}" class="f6"/>
  </g>
</svg>`;
}

// ── Deposition: grains fall, layers build ─────────────────────────────────────
function animDeposition(toId) {
  const color = (ROCKS[toId] || {}).color || '#D4A574';
  return `<svg class="anim-svg" viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg">
  <g class="ad-grains">
    <circle cx="28"  cy="12" r="2.8" fill="#C2B280" class="g1"/>
    <circle cx="48"  cy="8"  r="2.2" fill="#B8A060" class="g2"/>
    <circle cx="65"  cy="10" r="2.8" fill="#C8A870" class="g3"/>
    <circle cx="84"  cy="7"  r="2.2" fill="#B89050" class="g4"/>
    <circle cx="100" cy="11" r="2.5" fill="#D0AA70" class="g5"/>
    <circle cx="38"  cy="5"  r="2"   fill="#C09060" class="g6"/>
    <circle cx="75"  cy="6"  r="2.5" fill="#BBA050" class="g7"/>
  </g>
  <g class="ad-layers">
    <rect class="l3" x="18" y="88" width="84" height="10" rx="3" fill="${color}"/>
    <rect class="l2" x="18" y="74" width="84" height="10" rx="3" fill="${color}" style="filter:brightness(0.85)"/>
    <rect class="l1" x="18" y="60" width="84" height="10" rx="3" fill="${color}" style="filter:brightness(0.72)"/>
  </g>
  <ellipse class="ad-water" cx="60" cy="58" rx="42" ry="5" fill="rgba(74,144,217,0.25)" stroke="#4A90D9" stroke-width="1"/>
</svg>`;
}

// ── Heat & Pressure: compression + glow + rock morphs ────────────────────────
function animHeatPressure(fromId, toId) {
  const fc = (ROCKS[fromId] || {}).color || '#888';
  const tc = (ROCKS[toId]   || {}).color || '#7B2D8E';
  return `<svg class="anim-svg" viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg">
  <ellipse class="ahp-glow" cx="60" cy="62" rx="44" ry="38" fill="#C74B50"/>
  <g class="ahp-arrows">
    <path d="M10,62 L30,62" stroke="#E85D3A" stroke-width="4" stroke-linecap="round"/>
    <path d="M22,55 L30,62 L22,69" fill="none" stroke="#E85D3A" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M110,62 L90,62" stroke="#E85D3A" stroke-width="4" stroke-linecap="round"/>
    <path d="M98,55 L90,62 L98,69" fill="none" stroke="#E85D3A" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
  </g>
  <ellipse class="ahp-from" cx="60" cy="62" rx="30" ry="24" fill="${fc}"/>
  <ellipse class="ahp-to"   cx="60" cy="62" rx="28" ry="18" fill="${tc}"/>
  <g class="ahp-lines">
    <line x1="36" y1="54" x2="84" y2="54" stroke="rgba(255,255,255,0.18)" stroke-width="1.2"/>
    <line x1="33" y1="62" x2="87" y2="62" stroke="rgba(255,255,255,0.12)" stroke-width="1.2"/>
    <line x1="36" y1="70" x2="84" y2="70" stroke="rgba(255,255,255,0.18)" stroke-width="1.2"/>
  </g>
</svg>`;
}

// ── Uplift: rock rises through ground layers ──────────────────────────────────
function animUplift(fromId) {
  const color = (ROCKS[fromId] || {}).color || '#888';
  return `<svg class="anim-svg" viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg">
  <rect x="0" y="88"  width="120" height="12" fill="#5a4a38" opacity="0.8"/>
  <rect x="0" y="100" width="120" height="11" fill="#4a3a28" opacity="0.8"/>
  <rect x="0" y="111" width="120" height="9"  fill="#3a2a18" opacity="0.8"/>
  <g class="au-rock">
    <ellipse cx="60" cy="104" rx="30" ry="22" fill="${color}"/>
    <ellipse cx="60" cy="104" rx="22" ry="15" fill="${color}" opacity="0.4"/>
  </g>
  <g class="au-lines">
    <line x1="36" y1="72" x2="36" y2="86" stroke="rgba(255,255,255,0.3)" stroke-width="1.8" stroke-linecap="round"/>
    <line x1="60" y1="68" x2="60" y2="82" stroke="rgba(255,255,255,0.35)" stroke-width="1.8" stroke-linecap="round"/>
    <line x1="84" y1="72" x2="84" y2="86" stroke="rgba(255,255,255,0.3)" stroke-width="1.8" stroke-linecap="round"/>
  </g>
  <line class="au-surface" x1="10" y1="88" x2="110" y2="88" stroke="#6B8E5A" stroke-width="2.5"/>
</svg>`;
}
