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

const PRESETS = {
  'volcano-to-beach': {
    id:    'volcano-to-beach',
    title: 'From Volcano to Beach',
    icon:  '🌋→🏖️',
    desc:  'Follow a rock from eruption to canyon wall',
    steps: [
      {
        narration: "Deep beneath a volcano, magma churns at over 1,000\u00b0C. This molten rock contains the same minerals that will eventually become a canyon wall in Utah.",
        specimen: 'magma', process: null
      },
      {
        narration: "The volcano erupts! Lava flows across the surface and cools quickly in the open air.",
        specimen: 'magma', process: 'crystallization', coolingSpeed: 'fast'
      },
      {
        narration: "For millions of years, wind and rain pound the basalt. Piece by piece, it crumbles into sand and sediment.",
        specimen: 'basalt', process: 'weathering'
      },
      {
        narration: "Rivers carry the sand to a shallow sea. Layer after layer piles up on the seafloor.",
        specimen: 'sediment', process: 'deposition', sedimentType: 'sandstone'
      },
      {
        narration: "250 million years later, this sandstone forms the canyon walls at Arches National Park in Utah. The same atoms that were once magma now form the famous arches!",
        specimen: 'sandstone', process: null, utahConnection: 'Arches National Park'
      }
    ]
  },

  'mountain-maker': {
    id:    'mountain-maker',
    title: 'The Mountain Maker',
    icon:  '📥→🏔️',
    desc:  'See how sea-floor mud becomes a mountain',
    steps: [
      {
        narration: "On the floor of an ancient ocean, layers of clay and silt settle quietly. Tiny particles, washed in by rivers, blanket the seabed.",
        specimen: 'sediment', process: null
      },
      {
        narration: "Over millions of years, the layers compress into shale — thin, dark sheets of stone.",
        specimen: 'sediment', process: 'deposition', sedimentType: 'shale'
      },
      {
        narration: "The shale gets buried deeper and deeper. Miles underground, heat and pressure build. The clay minerals rearrange into hard, flat sheets.",
        specimen: 'shale', process: 'heatAndPressure'
      },
      {
        narration: "Tectonic forces — the same forces that move continents — push the slate upward. What was once ocean floor rises into mountains.",
        specimen: 'slate', process: 'uplift'
      },
      {
        narration: "Today, the Raft River Mountains in Utah contain slate like this — ancient sea-floor mud transformed by heat, pressure, and time into mountain rock.",
        specimen: 'slate', process: null, utahConnection: 'Raft River Mountains'
      }
    ]
  },

  'full-circle': {
    id:    'full-circle',
    title: 'Going in Circles',
    icon:  '🔄',
    desc:  'A complete trip around the entire rock cycle',
    steps: [
      {
        narration: "Our journey starts with granite — formed deep underground from slowly cooling magma, full of visible crystals.",
        specimen: 'granite', process: null
      },
      {
        narration: "Exposed at the surface, wind and water slowly grind the granite into sand over millions of years.",
        specimen: 'granite', process: 'weathering'
      },
      {
        narration: "Rivers carry the sand to a basin where it settles in layers. Weight from above compresses it into sandstone.",
        specimen: 'sediment', process: 'deposition', sedimentType: 'sandstone'
      },
      {
        narration: "The sandstone gets buried miles deep. Intense heat and pressure fuse the sand grains together into extremely hard quartzite.",
        specimen: 'sandstone', process: 'heatAndPressure'
      },
      {
        narration: "Even deeper, the temperature rises past the melting point. The solid rock becomes liquid magma once again.",
        specimen: 'quartzite', process: 'melting'
      },
      {
        narration: "The magma slowly cools in an underground chamber. Large crystals grow over thousands of years. Granite is reborn.",
        specimen: 'magma', process: 'crystallization', coolingSpeed: 'slow'
      },
      {
        narration: "One complete rock cycle — granite to granite — takes 200 to 500 million years. The same atoms have been cycling like this since Earth formed 4.5 billion years ago!",
        specimen: 'granite', process: null
      }
    ]
  },

  'fossils': {
    id:    'fossils',
    title: 'Fossils Trapped in Time',
    icon:  '🐚→💎',
    desc:  'Why fossils survive in limestone but vanish in marble',
    steps: [
      {
        narration: "In a warm, shallow sea, tiny organisms live and die. Their shells — made of calcite — drift to the ocean floor and pile up.",
        specimen: 'sediment', process: null
      },
      {
        narration: "Over millions of years, the shells compact and cement into limestone. Some shells are preserved perfectly — these are fossils!",
        specimen: 'sediment', process: 'deposition', sedimentType: 'limestone'
      },
      {
        narration: "This is why scientists find ocean fossils in limestone on mountaintops — the rock formed on the sea floor and was later pushed up. Timpanogos Cave in Utah is carved from limestone like this!",
        specimen: 'limestone', process: null, utahConnection: 'Timpanogos Cave'
      },
      {
        narration: "Now watch what happens when limestone is buried deep underground. Heat and pressure recrystallize the calcite...",
        specimen: 'limestone', process: 'heatAndPressure'
      },
      {
        narration: "The limestone becomes marble. It's beautiful — but the fossils are GONE. The recrystallization destroyed them. This is why you find fossils in sedimentary rocks but almost never in metamorphic rocks.",
        specimen: 'marble', process: null
      }
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
        <h3>${p.title}</h3>
        <p>${p.desc}</p>
      </div>`;
  });

  overlay.innerHTML = `
    <div class="preset-selector">
      <h2 class="preset-selector-title">Choose a Scenario</h2>
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
      <h3 class="preset-pb-title">${preset.icon} ${preset.title}</h3>
      <span class="preset-step-label" id="preset-step-label"></span>
    </div>
    <p class="preset-narration" id="preset-narration"></p>
    <div class="preset-controls">
      <button class="preset-btn" id="preset-btn-prev">← Back</button>
      <button class="preset-btn" id="preset-btn-auto">▶ Auto-Play</button>
      <button class="preset-btn" id="preset-btn-next">Next →</button>
      <button class="preset-btn preset-btn-exit" id="preset-btn-exit">✕ Exit</button>
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
  if (label) label.textContent = `Step ${stepIndex + 1} of ${preset.steps.length}`;

  const narEl = document.getElementById('preset-narration');
  if (narEl) { narEl.style.opacity = 0; setTimeout(() => { narEl.textContent = step.narration; narEl.style.opacity = 1; }, 120); }

  const prevBtn = document.getElementById('preset-btn-prev');
  const nextBtn = document.getElementById('preset-btn-next');
  if (prevBtn) prevBtn.disabled = stepIndex === 0;
  if (nextBtn) { nextBtn.disabled = false; nextBtn.textContent = stepIndex === preset.steps.length - 1 ? 'Finish' : 'Next →'; }

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

  // Utah connection highlight
  if (step.utahConnection) highlightUtahCard(step.utahConnection);

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
    if (btn) btn.textContent = '⏸ Pause';
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
  if (btn) btn.textContent = '▶ Auto-Play';
}

// ── Completion / Status ───────────────────────────────────────────────────────

function showPresetComplete() {
  stopAutoPlay();
  const narEl  = document.getElementById('preset-narration');
  const nextBtn = document.getElementById('preset-btn-next');
  if (narEl)  narEl.textContent = 'Scenario complete! Choose another preset or switch to Free Explore.';
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
