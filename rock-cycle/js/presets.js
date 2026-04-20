// ── presets.js ─────────────────────────────────────────────────────────────────
// Rock Cycle Lab — Utah SEEd 7.2.1
// 4 preset scenarios with narrated step-through playback engine

'use strict';

// ── Preset State ──────────────────────────────────────────────────────────────

const presetState = {
  active:      false,
  preset:      null,
  currentStep: 0,
  autoPlay:    false,
  autoTimer:   null,
  playedSteps: new Set()
};

// ── Preset Data ───────────────────────────────────────────────────────────────

// Preset data — each step uses a narrationKey (resolved via t()) + utahKey for Utah names
const PRESETS = {
  'volcano-to-beach': {
    id:    'volcano-to-beach', icon: '🌋→🏖️',
    titleKey: 'presetVolcanoTitle', descKey: 'presetVolcanoDesc',
    steps: [
      { narrationKey: 'volcanoN1', specimen: 'magma',     process: null },
      { narrationKey: 'volcanoN2', specimen: 'magma',     process: 'crystallization', coolingSpeed: 'fast' },
      { narrationKey: 'volcanoN3', specimen: 'basalt',    process: 'weathering' },
      { narrationKey: 'volcanoN4', specimen: 'sediment',  process: 'deposition', sedimentType: 'sandstone' },
      { narrationKey: 'volcanoN5', specimen: 'sandstone', process: null, utahKey: 'utahArches' }
    ]
  },
  'mountain-maker': {
    id:    'mountain-maker', icon: '📥→🏔️',
    titleKey: 'presetMountainTitle', descKey: 'presetMountainDesc',
    steps: [
      { narrationKey: 'mountainN1', specimen: 'sediment', process: null },
      { narrationKey: 'mountainN2', specimen: 'sediment', process: 'deposition', sedimentType: 'shale' },
      { narrationKey: 'mountainN3', specimen: 'shale',    process: 'heatAndPressure' },
      { narrationKey: 'mountainN4', specimen: 'slate',    process: 'uplift' },
      { narrationKey: 'mountainN5', specimen: 'slate',    process: null, utahKey: 'utahFarmington' }
    ]
  },
  'full-circle': {
    id:    'full-circle', icon: '🔄',
    titleKey: 'presetCircleTitle', descKey: 'presetCircleDesc',
    steps: [
      { narrationKey: 'circleN1', specimen: 'granite',   process: null },
      { narrationKey: 'circleN2', specimen: 'granite',   process: 'weathering' },
      { narrationKey: 'circleN3', specimen: 'sediment',  process: 'deposition', sedimentType: 'sandstone' },
      { narrationKey: 'circleN4', specimen: 'sandstone', process: 'heatAndPressure' },
      { narrationKey: 'circleN5', specimen: 'quartzite', process: 'melting' },
      { narrationKey: 'circleN6', specimen: 'magma',     process: 'crystallization', coolingSpeed: 'slow' },
      { narrationKey: 'circleN7', specimen: 'granite',   process: null }
    ]
  },
  'fossils': {
    id:    'fossils', icon: '🐚→💎',
    titleKey: 'presetFossilsTitle', descKey: 'presetFossilsDesc',
    steps: [
      { narrationKey: 'fossilsN1', specimen: 'sediment',  process: null },
      { narrationKey: 'fossilsN2', specimen: 'sediment',  process: 'deposition', sedimentType: 'limestone' },
      { narrationKey: 'fossilsN3', specimen: 'limestone', process: null, utahKey: 'utahTimp' },
      { narrationKey: 'fossilsN4', specimen: 'limestone', process: 'heatAndPressure' },
      { narrationKey: 'fossilsN5', specimen: 'marble',    process: null }
    ]
  }
};

// ── Selector UI ───────────────────────────────────────────────────────────────

function showPresetSelector() {
  hidePresetOverlays();

  const stage = document.querySelector('.center-stage');
  if (!stage) return;

  const overlay = document.createElement('div');
  overlay.id = 'preset-overlay';
  overlay.className = 'preset-overlay';

  let cards = '';
  Object.values(PRESETS).forEach(p => {
    cards += `
      <div class="preset-card" data-preset="${p.id}" role="button" tabindex="0">
        <span class="preset-icon">${p.icon}</span>
        <h3>${t(p.titleKey)}</h3>
        <p>${t(p.descKey)}</p>
      </div>`;
  });

  overlay.innerHTML = `
    <div class="preset-selector">
      <h2 class="preset-selector-title">${t('presetSelectTitle')}</h2>
      <div class="preset-grid">${cards}</div>
    </div>`;

  stage.appendChild(overlay);

  overlay.querySelectorAll('.preset-card').forEach(card => {
    const handler = () => playPreset(card.dataset.preset);
    card.addEventListener('click', handler);
    card.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); handler(); } });
  });
}

function hidePresetOverlays() {
  ['#preset-overlay', '#preset-playback'].forEach(sel => {
    const el = document.querySelector(sel);
    if (el) el.remove();
  });
}

function exitPresetMode() {
  stopAutoPlay();
  presetState.active = false;
  hidePresetOverlays();
}

// ── Playback Engine ───────────────────────────────────────────────────────────

async function playPreset(presetId) {
  const preset = PRESETS[presetId];
  if (!preset) return;

  presetState.active      = true;
  presetState.preset      = preset;
  presetState.currentStep = 0;
  presetState.autoPlay    = false;
  presetState.playedSteps = new Set();

  hidePresetOverlays();
  createPlaybackUI(preset);
  await advancePresetTo(0);
}

function createPlaybackUI(preset) {
  const stage = document.querySelector('.center-stage');
  if (!stage) return;

  const el = document.createElement('div');
  el.id = 'preset-playback';
  el.className = 'preset-playback';
  el.innerHTML = `
    <div class="preset-header">
      <h3 class="preset-pb-title">${preset.icon} ${t(preset.titleKey)}</h3>
      <span class="preset-step-label" id="preset-step-label"></span>
    </div>
    <p class="preset-narration" id="preset-narration"></p>
    <div class="preset-controls">
      <button class="preset-btn" id="preset-btn-prev">${t('presetPrev')}</button>
      <button class="preset-btn" id="preset-btn-auto">${t('presetAutoPlay')}</button>
      <button class="preset-btn" id="preset-btn-next">${t('presetNext')}</button>
      <button class="preset-btn preset-btn-exit" id="preset-btn-exit">${t('presetExit')}</button>
    </div>`;

  stage.insertBefore(el, stage.firstChild);

  // Controls
  document.getElementById('preset-btn-prev').addEventListener('click', () => {
    stopAutoPlay();
    if (presetState.currentStep > 0) advancePresetTo(presetState.currentStep - 1);
  });
  document.getElementById('preset-btn-next').addEventListener('click', () => {
    stopAutoPlay();
    if (presetState.currentStep < presetState.preset.steps.length - 1) {
      advancePresetTo(presetState.currentStep + 1);
    } else {
      showPresetComplete();
    }
  });
  document.getElementById('preset-btn-auto').addEventListener('click', toggleAutoPlay);
  document.getElementById('preset-btn-exit').addEventListener('click', () => {
    stopAutoPlay();
    presetState.active = false;
    hidePresetOverlays();
    showPresetSelector();
  });
}

async function advancePresetTo(stepIndex) {
  const preset = presetState.preset;
  if (!preset || stepIndex < 0 || stepIndex >= preset.steps.length) return;

  presetState.currentStep = stepIndex;
  const step = preset.steps[stepIndex];

  // Update UI chrome
  const label = document.getElementById('preset-step-label');
  if (label) label.textContent = t('presetStepOf', { current: stepIndex + 1, total: preset.steps.length });

  const narEl = document.getElementById('preset-narration');
  if (narEl) { narEl.style.opacity = 0; setTimeout(() => { narEl.textContent = t(step.narrationKey); narEl.style.opacity = 1; }, 120); }

  const prevBtn = document.getElementById('preset-btn-prev');
  const nextBtn = document.getElementById('preset-btn-next');
  if (prevBtn) prevBtn.disabled = stepIndex === 0;
  if (nextBtn) { nextBtn.disabled = false; nextBtn.textContent = stepIndex === preset.steps.length - 1 ? t('presetFinish') : t('presetNext'); }

  // Play the step
  if (step.process && !presetState.playedSteps.has(stepIndex)) {
    displayPresetSpecimen(step.specimen);
    await new Promise(r => setTimeout(r, 500));
    await performPresetTransformation(step);
    presetState.playedSteps.add(stepIndex);
  } else {
    const resultId = step.process ? getPresetStepResult(step) : step.specimen;
    displayPresetSpecimen(resultId);
  }

  // Utah connection highlight (utahKey is a translation key for the Utah place name)
  if (step.utahKey) highlightUtahCard(t(step.utahKey));

  // Auto-play scheduling
  if (presetState.autoPlay) scheduleAutoAdvance();
}

// ── Specimen Display ──────────────────────────────────────────────────────────

function displayPresetSpecimen(id) {
  state.currentSpecimen = id;
  const disp = document.getElementById('specimen-display');
  if (disp) disp.dataset.specimen = id;

  if (ROCKS[id]) {
    if (typeof selectRock === 'function') selectRock(id);
  } else if (typeof updateSpecimenDisplay === 'function') {
    document.querySelectorAll('.rock-card').forEach(c => c.classList.remove('selected'));
    updateSpecimenDisplay(id);
  }
}

// ── Auto-Transformation (bypasses choice popups) ─────────────────────────────

async function performPresetTransformation(step) {
  const fromId    = step.specimen;
  const processId = step.process;
  let toId;

  if (processId === 'melting')              toId = 'magma';
  else if (processId === 'crystallization') toId = ({ slow:'granite', fast:'basalt', ultrafast:'obsidian' })[step.coolingSpeed] || 'basalt';
  else if (processId === 'weathering')      toId = 'sediment';
  else if (processId === 'deposition')      toId = step.sedimentType || 'sandstone';
  else if (processId === 'heatAndPressure') toId = TRANSFORMATIONS.heatAndPressure.metamorphicMap[fromId] || 'quartzite';
  else if (processId === 'uplift')          toId = fromId;
  if (!toId) return;

  flashZone(processId);
  if (typeof animateTransformation === 'function') await animateTransformation(fromId, processId, toId);
  finalizeTransformation(fromId, processId, toId, { isUplift: processId === 'uplift' });
}

function getPresetStepResult(step) {
  if (!step.process) return step.specimen;
  if (step.process === 'melting')              return 'magma';
  if (step.process === 'crystallization')      return ({ slow:'granite', fast:'basalt', ultrafast:'obsidian' })[step.coolingSpeed] || 'basalt';
  if (step.process === 'weathering')           return 'sediment';
  if (step.process === 'deposition')           return step.sedimentType || 'sandstone';
  if (step.process === 'heatAndPressure')      return TRANSFORMATIONS.heatAndPressure.metamorphicMap[step.specimen] || 'quartzite';
  if (step.process === 'uplift')               return step.specimen;
  return step.specimen;
}

// ── Auto-Play ─────────────────────────────────────────────────────────────────

function toggleAutoPlay() {
  const btn = document.getElementById('preset-btn-auto');
  if (presetState.autoPlay) {
    stopAutoPlay();
  } else {
    presetState.autoPlay = true;
    if (btn) btn.textContent = t('presetPause');
    scheduleAutoAdvance();
  }
}

function scheduleAutoAdvance() {
  if (presetState.autoTimer) clearTimeout(presetState.autoTimer);
  presetState.autoTimer = setTimeout(() => {
    if (!presetState.active || !presetState.autoPlay) return;
    if (presetState.currentStep < presetState.preset.steps.length - 1) {
      advancePresetTo(presetState.currentStep + 1);
    } else {
      stopAutoPlay();
      showPresetComplete();
    }
  }, 5000);
}

function stopAutoPlay() {
  if (presetState.autoTimer) { clearTimeout(presetState.autoTimer); presetState.autoTimer = null; }
  presetState.autoPlay = false;
  const btn = document.getElementById('preset-btn-auto');
  if (btn) btn.textContent = t('presetAutoPlay');
}

// ── Completion / Status ───────────────────────────────────────────────────────

function showPresetComplete() {
  stopAutoPlay();
  const narEl  = document.getElementById('preset-narration');
  const nextBtn = document.getElementById('preset-btn-next');
  if (narEl)  narEl.textContent = t('presetComplete');
  if (nextBtn) nextBtn.disabled = true;
}

function isPresetPlaying() {
  return presetState.active;
}

// ── Utah Card Highlight ───────────────────────────────────────────────────────

function highlightUtahCard(name) {
  // Open the Utah section if closed
  const section = document.getElementById('utah-section');
  if (section && !section.classList.contains('open')) section.classList.add('open');

  document.querySelectorAll('.utah-item').forEach(item => {
    const nameEl = item.querySelector('.utah-item-name');
    if (nameEl && nameEl.textContent.trim() === name) {
      item.classList.add('utah-highlighted');
      setTimeout(() => item.classList.remove('utah-highlighted'), 2500);
    }
  });
}
