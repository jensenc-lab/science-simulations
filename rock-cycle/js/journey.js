// ── journey.js ────────────────────────────────────────────────────────────────
// Rock Cycle Lab — Utah SEEd 7.2.1
// Geological Journey mode: time-lapse rock cycle with depth context & narration

'use strict';

// ── Journey State ─────────────────────────────────────────────────────────────

const journeyState = {
  active:      false,
  journey:     null,        // generated step array
  currentStep: 0,
  playing:     false,
  speed:       1,           // 1, 2, or 4
  timer:       null,
  startRock:   null
};

// ── Depth map ─────────────────────────────────────────────────────────────────

const DEPTH_ORDER = ['surface', 'shallow', 'deep', 'mantle'];
const DEPTH_META = {
  surface: { labelKey: 'depthSurface', icon: '☀️',  pct: 5  },
  shallow: { labelKey: 'depthShallow', icon: '🪨', pct: 33 },
  deep:    { labelKey: 'depthDeep',    icon: '🌡️', pct: 66 },
  mantle:  { labelKey: 'depthMantle',  icon: '🌋',  pct: 95 }
};

// ── Journey Templates ─────────────────────────────────────────────────────────
// Each template: array of step descriptors. `specimen` is resolved at generation
// time from the starting rock or previous step output.
// Fields: narration, process (null = display only), depth, extra (coolingSpeed, etc.)

// Templates use narrationKey references into translations.js (resolved via t() at render time)
const JOURNEY_TEMPLATES = {
  igneous: [
    [
      { narrationKey: 'jrnIgnA0', depth: 'surface' },
      { narrationKey: 'jrnIgnA1', process: 'weathering', depth: 'surface' },
      { narrationKey: 'jrnIgnA2', process: 'deposition', extra: { sedimentType: 'sandstone' }, depth: 'shallow' },
      { narrationKey: 'jrnIgnA3', process: 'heatAndPressure', depth: 'deep' },
      { narrationKey: 'jrnIgnA4', process: 'melting', depth: 'mantle' },
      { narrationKey: 'jrnIgnA5', process: 'crystallization', extra: { coolingSpeed: 'slow' }, depth: 'deep' },
      { narrationKey: 'jrnIgnA6', process: 'uplift', depth: 'surface' }
    ],
    [
      { narrationKey: 'jrnIgnB0', depth: 'deep' },
      { narrationKey: 'jrnIgnB1', process: 'melting', depth: 'mantle' },
      { narrationKey: 'jrnIgnB2', process: 'crystallization', extra: { coolingSpeed: 'fast' }, depth: 'surface' },
      { narrationKey: 'jrnIgnB3', process: 'weathering', depth: 'surface' },
      { narrationKey: 'jrnIgnB4', process: 'deposition', extra: { sedimentType: 'limestone' }, depth: 'shallow' },
      { narrationKey: 'jrnIgnB5', process: 'heatAndPressure', depth: 'deep' }
    ],
    [
      { narrationKey: 'jrnIgnC0', depth: 'deep' },
      { narrationKey: 'jrnIgnC1', process: 'uplift', depth: 'surface' },
      { narrationKey: 'jrnIgnC2', process: 'weathering', depth: 'surface' },
      { narrationKey: 'jrnIgnC3', process: 'deposition', extra: { sedimentType: 'shale' }, depth: 'shallow' },
      { narrationKey: 'jrnIgnC4', process: 'heatAndPressure', depth: 'deep' },
      { narrationKey: 'jrnIgnC5', process: 'uplift', depth: 'surface' }
    ]
  ],
  sedimentary: [
    [
      { narrationKey: 'jrnSedA0', depth: 'shallow' },
      { narrationKey: 'jrnSedA1', process: 'heatAndPressure', depth: 'deep' },
      { narrationKey: 'jrnSedA2', process: 'melting', depth: 'mantle' },
      { narrationKey: 'jrnSedA3', process: 'crystallization', extra: { coolingSpeed: 'fast' }, depth: 'surface' },
      { narrationKey: 'jrnSedA4', process: 'weathering', depth: 'surface' },
      { narrationKey: 'jrnSedA5', process: 'deposition', extra: { sedimentType: 'sandstone' }, depth: 'shallow' }
    ],
    [
      { narrationKey: 'jrnSedB0', depth: 'surface' },
      { narrationKey: 'jrnSedB1', process: 'weathering', depth: 'surface' },
      { narrationKey: 'jrnSedB2', process: 'deposition', extra: { sedimentType: 'shale' }, depth: 'shallow' },
      { narrationKey: 'jrnSedB3', process: 'heatAndPressure', depth: 'deep' },
      { narrationKey: 'jrnSedB4', process: 'uplift', depth: 'surface' },
      { narrationKey: 'jrnSedB5', process: 'weathering', depth: 'surface' }
    ],
    [
      { narrationKey: 'jrnSedC0', depth: 'shallow' },
      { narrationKey: 'jrnSedC1', process: 'uplift', depth: 'surface' },
      { narrationKey: 'jrnSedC2', process: 'weathering', depth: 'surface' },
      { narrationKey: 'jrnSedC3', process: 'deposition', extra: { sedimentType: 'limestone' }, depth: 'shallow' },
      { narrationKey: 'jrnSedC4', process: 'heatAndPressure', depth: 'deep' }
    ]
  ],
  metamorphic: [
    [
      { narrationKey: 'jrnMetA0', depth: 'deep' },
      { narrationKey: 'jrnMetA1', process: 'melting', depth: 'mantle' },
      { narrationKey: 'jrnMetA2', process: 'crystallization', extra: { coolingSpeed: 'slow' }, depth: 'deep' },
      { narrationKey: 'jrnMetA3', process: 'uplift', depth: 'surface' },
      { narrationKey: 'jrnMetA4', process: 'weathering', depth: 'surface' },
      { narrationKey: 'jrnMetA5', process: 'deposition', extra: { sedimentType: 'sandstone' }, depth: 'shallow' }
    ],
    [
      { narrationKey: 'jrnMetB0', depth: 'deep' },
      { narrationKey: 'jrnMetB1', process: 'uplift', depth: 'surface' },
      { narrationKey: 'jrnMetB2', process: 'weathering', depth: 'surface' },
      { narrationKey: 'jrnMetB3', process: 'deposition', extra: { sedimentType: 'limestone' }, depth: 'shallow' },
      { narrationKey: 'jrnMetB4', process: 'heatAndPressure', depth: 'deep' },
      { narrationKey: 'jrnMetB5', process: 'uplift', depth: 'surface' }
    ],
    [
      { narrationKey: 'jrnMetC0', depth: 'deep' },
      { narrationKey: 'jrnMetC1', process: 'uplift', depth: 'surface' },
      { narrationKey: 'jrnMetC2', process: 'weathering', depth: 'surface' },
      { narrationKey: 'jrnMetC3', process: 'deposition', extra: { sedimentType: 'shale' }, depth: 'shallow' },
      { narrationKey: 'jrnMetC4', process: 'melting', depth: 'mantle' },
      { narrationKey: 'jrnMetC5', process: 'crystallization', extra: { coolingSpeed: 'ultrafast' }, depth: 'surface' }
    ]
  ]
};

// ── Journey Generation ────────────────────────────────────────────────────────

function generateJourney(startingRockId) {
  const rock = ROCKS[startingRockId];
  if (!rock) return null;

  const templates = JOURNEY_TEMPLATES[rock.type];
  if (!templates || templates.length === 0) return null;

  // Pick a random template
  const template = templates[Math.floor(Math.random() * templates.length)];

  // Walk the template, resolving specimens at each step.
  // Keep narrationKey + {rock} replacement data on each step so we can re-resolve at render time.
  const steps = [];
  let currentSpecimen = startingRockId;
  const totalSteps = template.length;
  const myaPerStep = Math.floor(500 / totalSteps);

  for (let i = 0; i < totalSteps; i++) {
    const tpl = template[i];
    const timeMya = 500 - i * myaPerStep;

    const stepBase = { timeMya, narrationKey: tpl.narrationKey, narrationRock: startingRockId, depth: tpl.depth };

    if (!tpl.process) {
      steps.push(Object.assign(stepBase, { specimen: currentSpecimen, process: null }));
    } else {
      const fromId = currentSpecimen;
      const toId = resolveOutput(fromId, tpl.process, tpl.extra);
      steps.push(Object.assign(stepBase, {
        specimen: fromId, process: tpl.process, extra: tpl.extra || {}, resultSpecimen: toId
      }));
      currentSpecimen = toId;
    }
  }

  // Final "present day" step if the template doesn't end with one
  const last = steps[steps.length - 1];
  if (last.timeMya > 0) {
    // Map rockId → Utah place translation key (rocks with a Utah connection)
    const utahKeyMap = {
      granite: 'utahLCC', sandstone: 'utahArches',
      limestone: 'utahTimp', shale: 'utahGreenRiver',
      quartzite: 'utahFarmington'
    };
    steps.push({
      timeMya: 0,
      isFinal: true,
      narrationRock: currentSpecimen,
      utahPlaceKey: utahKeyMap[currentSpecimen] || null,
      specimen: currentSpecimen, process: null, depth: 'surface'
    });
  }

  return steps;
}

function resolveOutput(fromId, processId, extra) {
  if (processId === 'melting') return 'magma';
  if (processId === 'crystallization') {
    const speed = (extra && extra.coolingSpeed) || 'slow';
    return { slow: 'granite', fast: 'basalt', ultrafast: 'obsidian' }[speed];
  }
  if (processId === 'weathering') return 'sediment';
  if (processId === 'deposition') return (extra && extra.sedimentType) || 'sandstone';
  if (processId === 'heatAndPressure') return TRANSFORMATIONS.heatAndPressure.metamorphicMap[fromId] || 'quartzite';
  if (processId === 'uplift') return fromId;
  return fromId;
}

// ── Start / Exit ──────────────────────────────────────────────────────────────

// Teardown the overlay + transient state WITHOUT leaving journey mode.
// Used by showJourneySetup() so "Change Rock" / re-entry doesn't restore the
// normal Free-Explore layout between setup screens.
function teardownJourneyOverlay() {
  stopJourneyPlay();
  journeyState.journey = null;
  const overlay = document.getElementById('journey-overlay');
  if (overlay) { overlay.classList.remove('journey-playback-active'); overlay.remove(); }
  const disp = document.getElementById('specimen-display');
  if (disp) disp.className = disp.className.replace(/\bdepth-\S+/g, '').trim();
}

function startJourney() {
  document.body.classList.add('journey-mode');
  journeyState.active = true;
  showJourneySetup();
}

function exitJourney() {
  teardownJourneyOverlay();
  journeyState.active = false;
  document.body.classList.remove('journey-mode');
}

// ── Setup Screen ──────────────────────────────────────────────────────────────

function showJourneySetup() {
  teardownJourneyOverlay();
  journeyState.active = true;
  // "Change Rock" re-enters setup during playback — make sure journey-mode stays on
  document.body.classList.add('journey-mode');

  const stage = document.querySelector('.center-stage');
  if (!stage) return;

  const overlay = document.createElement('div');
  overlay.id = 'journey-overlay';
  overlay.className = 'journey-overlay'; // setup mode (no journey-playback-active)

  const rockIds = Object.keys(ROCKS);
  const cards = rockIds.map(id => {
    const r = ROCKS[id];
    return `<div class="journey-rock-option" data-rock="${id}" role="button" tabindex="0">
      <div class="jro-svg">${getRockSVG(id, 'small')}</div>
      <span class="jro-name">${rockName(id)}</span>
      <span class="rock-type-badge ${r.type}">${typeName(r.type)}</span>
    </div>`;
  }).join('');

  overlay.innerHTML = `
    <div class="journey-setup">
      <h2 class="journey-setup-title">${t('journeyTitle')}</h2>
      <p class="journey-setup-desc">${t('journeySubtitle')}</p>
      <div class="journey-rock-picker">${cards}</div>
      <button class="journey-start-btn" id="journey-start-btn" disabled>${t('journeyStartBtn')}</button>
      <button class="journey-back-link" id="journey-back-link">${t('journeyBackLink')}</button>
    </div>`;

  stage.appendChild(overlay);

  // Selection logic
  let selectedRock = null;
  overlay.querySelectorAll('.journey-rock-option').forEach(card => {
    const handler = () => {
      overlay.querySelectorAll('.journey-rock-option').forEach(c => c.classList.remove('selected'));
      card.classList.add('selected');
      selectedRock = card.dataset.rock;
      document.getElementById('journey-start-btn').disabled = false;
    };
    card.addEventListener('click', handler);
    card.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); handler(); } });
  });

  document.getElementById('journey-start-btn').addEventListener('click', () => {
    if (selectedRock) launchJourney(selectedRock);
  });

  document.getElementById('journey-back-link').addEventListener('click', () => {
    const tab = document.querySelector('.mode-tab[data-mode="free-explore"]');
    if (tab) tab.click();
  });
}

// ── Launch & Playback ─────────────────────────────────────────────────────────

function launchJourney(rockId) {
  journeyState.startRock = rockId;
  const journey = generateJourney(rockId);
  if (!journey || journey.length === 0) return;

  journeyState.journey = journey;
  journeyState.currentStep = 0;
  journeyState.playing = false;
  journeyState.speed = 1;

  showPlaybackUI(journey);
  showJourneyStep(0);
}

function showPlaybackUI(journey) {
  const overlay = document.getElementById('journey-overlay');
  if (!overlay) return;

  // Playback mode: let specimen + zones show through with a dimmed frame
  overlay.classList.add('journey-playback-active');

  overlay.innerHTML = `
    <div class="journey-playback" id="journey-playback">
      <div class="journey-narration" id="journey-narration">
        <span class="journey-time-badge" id="journey-time-badge"></span>
        <p id="journey-narration-text"></p>
      </div>
      <div class="journey-stage" id="journey-stage">
        <div class="journey-depth-indicator" id="journey-depth-ind">
          <div class="depth-scale">
            ${DEPTH_ORDER.map(d => `<span class="depth-level" data-depth="${d}">${DEPTH_META[d].icon} ${t(DEPTH_META[d].labelKey)}</span>`).join('')}
          </div>
          <div class="depth-marker" id="depth-marker"></div>
        </div>
      </div>
      <div class="journey-footer">
        <div class="journey-timeline" id="journey-timeline">
          <div class="timeline-bar">
            <div class="timeline-fill" id="timeline-fill"></div>
            <div class="timeline-playhead" id="timeline-playhead"></div>
          </div>
          <div class="timeline-labels" id="timeline-labels">
            ${journey.map((s, i) => `<span class="tl-label${i === 0 ? ' first' : ''}${i === journey.length - 1 ? ' last' : ''}">${s.timeMya > 0 ? s.timeMya + 'M' : t('journeyToday')}</span>`).join('')}
          </div>
        </div>
        <div class="journey-controls">
          <button class="jc-btn" id="jc-prev" aria-label="Previous step">⏮</button>
          <button class="jc-btn jc-play" id="jc-play" aria-label="Play">${t('journeyPlay')}</button>
          <button class="jc-btn" id="jc-next" aria-label="Next step">⏭</button>
          <select class="jc-speed" id="jc-speed" aria-label="Playback speed">
            <option value="1">${t('journeySpeed1')}</option>
            <option value="2">${t('journeySpeed2')}</option>
            <option value="4">${t('journeySpeed4')}</option>
          </select>
          <button class="jc-btn" id="jc-new" aria-label="New journey">${t('journeyNew')}</button>
          <button class="jc-btn" id="jc-change" aria-label="Change rock">${t('journeyChange')}</button>
          <button class="jc-btn jc-exit" id="jc-exit" aria-label="Exit journey">${t('journeyExit')}</button>
        </div>
      </div>
    </div>`;

  // Wire controls
  document.getElementById('jc-prev').addEventListener('click', () => { stopJourneyPlay(); stepJourney(-1); });
  document.getElementById('jc-next').addEventListener('click', () => { stopJourneyPlay(); stepJourney(1); });
  document.getElementById('jc-play').addEventListener('click', toggleJourneyPlay);
  document.getElementById('jc-speed').addEventListener('change', e => { journeyState.speed = parseInt(e.target.value) || 1; });
  document.getElementById('jc-new').addEventListener('click', () => launchJourney(journeyState.startRock));
  document.getElementById('jc-change').addEventListener('click', showJourneySetup);
  document.getElementById('jc-exit').addEventListener('click', () => {
    const tab = document.querySelector('.mode-tab[data-mode="free-explore"]');
    if (tab) tab.click();
  });
}

async function showJourneyStep(index) {
  const journey = journeyState.journey;
  if (!journey || index < 0 || index >= journey.length) return;

  journeyState.currentStep = index;
  const step = journey[index];

  // Update timeline
  const pct = journey.length > 1 ? (index / (journey.length - 1)) * 100 : 0;
  const fill = document.getElementById('timeline-fill');
  const head = document.getElementById('timeline-playhead');
  if (fill) fill.style.width = pct + '%';
  if (head) head.style.left = pct + '%';

  // Update narration (resolve via t() each render so language toggle works)
  const badge = document.getElementById('journey-time-badge');
  const narText = document.getElementById('journey-narration-text');
  const timeLabel = step.timeMya > 0
    ? step.timeMya + ' ' + t('journeyMya')
    : t('journeyToday');
  if (badge) badge.textContent = timeLabel;

  let narration;
  if (step.isFinal) {
    const rockStr = rockName(step.narrationRock);
    narration = step.utahPlaceKey
      ? t('journeyUtahSummary', { rock: rockStr.toLowerCase(), place: t(step.utahPlaceKey) })
      : t('journeyCloseSummary', { rock: rockStr.toLowerCase() });
  } else {
    narration = t(step.narrationKey).replace(/\{rock\}/g, rockName(step.narrationRock));
  }
  // Narration persists through each step — replace content directly (no auto-fade)
  if (narText) { narText.textContent = narration; }

  // Update depth
  updateJourneyDepth(step.depth);

  // Update prev/next states
  const prevBtn = document.getElementById('jc-prev');
  const nextBtn = document.getElementById('jc-next');
  if (prevBtn) prevBtn.disabled = index === 0;
  if (nextBtn) nextBtn.disabled = index === journey.length - 1;

  // Perform transformation or display specimen
  if (step.process && step.resultSpecimen) {
    displayJourneySpecimen(step.specimen);
    await new Promise(r => setTimeout(r, 400));
    // Flash zone
    if (typeof flashZone === 'function') flashZone(step.process);
    // Animate
    if (typeof animateTransformation === 'function') {
      await animateTransformation(step.specimen, step.process, step.resultSpecimen);
    }
    // Finalize
    if (typeof finalizeTransformation === 'function') {
      finalizeTransformation(step.specimen, step.process, step.resultSpecimen,
        { isUplift: step.process === 'uplift' });
    }
  } else {
    displayJourneySpecimen(step.specimen);
  }

  // Utah highlight (utahPlaceKey is a translation key)
  if (step.utahPlaceKey && typeof highlightUtahCard === 'function') {
    highlightUtahCard(t(step.utahPlaceKey));
  }
}

function displayJourneySpecimen(id) {
  state.currentSpecimen = id;
  const disp = document.getElementById('specimen-display');
  if (disp) disp.dataset.specimen = id;
  if (ROCKS[id]) {
    if (typeof selectRock === 'function') selectRock(id);
  } else {
    document.querySelectorAll('.rock-card').forEach(c => c.classList.remove('selected'));
    if (typeof updateSpecimenDisplay === 'function') updateSpecimenDisplay(id);
  }
}

function updateJourneyDepth(depth) {
  const disp = document.getElementById('specimen-display');
  if (disp) {
    DEPTH_ORDER.forEach(d => disp.classList.remove('depth-' + d));
    if (depth) disp.classList.add('depth-' + depth);
  }
  const marker = document.getElementById('depth-marker');
  if (marker && DEPTH_META[depth]) {
    marker.style.top = DEPTH_META[depth].pct + '%';
  }
  // Highlight active depth label
  document.querySelectorAll('.depth-level').forEach(el => {
    el.classList.toggle('active', el.dataset.depth === depth);
  });
}

// ── Play / Pause / Step ───────────────────────────────────────────────────────

function toggleJourneyPlay() {
  if (journeyState.playing) {
    stopJourneyPlay();
  } else {
    journeyState.playing = true;
    const btn = document.getElementById('jc-play');
    if (btn) btn.textContent = t('journeyPause');
    scheduleJourneyAdvance();
  }
}

function stopJourneyPlay() {
  journeyState.playing = false;
  if (journeyState.timer) { clearTimeout(journeyState.timer); journeyState.timer = null; }
  const btn = document.getElementById('jc-play');
  if (btn) btn.textContent = t('journeyPlay');
}

function scheduleJourneyAdvance() {
  if (journeyState.timer) clearTimeout(journeyState.timer);
  const baseMs = 6000;
  const ms = baseMs / journeyState.speed;
  journeyState.timer = setTimeout(async () => {
    if (!journeyState.playing || !journeyState.active) return;
    if (journeyState.currentStep < journeyState.journey.length - 1) {
      await showJourneyStep(journeyState.currentStep + 1);
      if (journeyState.playing) scheduleJourneyAdvance();
    } else {
      stopJourneyPlay();
      showJourneyComplete();
    }
  }, ms);
}

function stepJourney(delta) {
  const next = journeyState.currentStep + delta;
  if (next >= 0 && next < journeyState.journey.length) {
    showJourneyStep(next);
  }
}

// ── Journey Complete ──────────────────────────────────────────────────────────

function showJourneyComplete() {
  const journey = journeyState.journey;
  if (!journey) return;

  const narText = document.getElementById('journey-narration-text');
  const badge   = document.getElementById('journey-time-badge');
  if (badge)   badge.textContent = t('journeyComplete');
  if (narText) {
    const startName = rockName(journeyState.startRock);
    const steps = journey.filter(s => s.process).length;
    narText.textContent = t('journeySummary', { rock: startName, steps: steps });
  }
}
