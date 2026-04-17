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
  surface: { label: 'Surface', icon: '☀️',  pct: 5  },
  shallow: { label: 'Shallow', icon: '🪨', pct: 33 },
  deep:    { label: 'Deep',    icon: '🌡️', pct: 66 },
  mantle:  { label: 'Mantle',  icon: '🌋',  pct: 95 }
};

// ── Journey Templates ─────────────────────────────────────────────────────────
// Each template: array of step descriptors. `specimen` is resolved at generation
// time from the starting rock or previous step output.
// Fields: narration, process (null = display only), depth, extra (coolingSpeed, etc.)

const JOURNEY_TEMPLATES = {
  igneous: [
    // Template A: surface weathering → sedimentary → metamorphic → melt → re-crystallize
    [
      { narration: "Your {rock} sits exposed on a mountainside, baked by sun and pounded by rain.", depth: 'surface' },
      { narration: "Over 100 million years, wind, ice, and water break {rock} into sand and silt.", process: 'weathering', depth: 'surface' },
      { narration: "Rivers carry the sediment to a vast inland sea. Layer upon layer settles on the ocean floor.", process: 'deposition', extra: { sedimentType: 'sandstone' }, depth: 'shallow' },
      { narration: "The seafloor sinks deeper as tectonic plates collide. Heat and pressure fuse the sand grains together.", process: 'heatAndPressure', depth: 'deep' },
      { narration: "Deeper still, the temperature crosses the melting point. Solid rock becomes liquid magma.", process: 'melting', depth: 'mantle' },
      { narration: "The magma cools slowly in a vast underground chamber over thousands of years. Large crystals grow.", process: 'crystallization', extra: { coolingSpeed: 'slow' }, depth: 'deep' },
      { narration: "Tectonic forces uplift the new granite to the surface. A new chapter in the rock cycle begins.", process: 'uplift', depth: 'surface' }
    ],
    // Template B: melt → fast cool → weather → deposit limestone → H&P
    [
      { narration: "Your {rock} lies deep underground, surrounded by rising temperatures.", depth: 'deep' },
      { narration: "The heat overwhelms the rock's structure. It melts into glowing magma at over 1,000°C.", process: 'melting', depth: 'mantle' },
      { narration: "A volcanic eruption pushes the magma to the surface. It cools rapidly in the open air.", process: 'crystallization', extra: { coolingSpeed: 'fast' }, depth: 'surface' },
      { narration: "Millions of years of rain and frost slowly crumble the basalt into fine particles.", process: 'weathering', depth: 'surface' },
      { narration: "Marine organisms incorporate the minerals. Their shells pile up on the ocean floor for eons.", process: 'deposition', extra: { sedimentType: 'limestone' }, depth: 'shallow' },
      { narration: "The limestone is buried miles deep. Heat and pressure transform it into sparkling marble.", process: 'heatAndPressure', depth: 'deep' }
    ],
    // Template C: uplift → weather → shale → slate
    [
      { narration: "Your {rock} formed deep underground, locked beneath miles of overlying rock.", depth: 'deep' },
      { narration: "Over tens of millions of years, tectonic forces push the rock toward the surface.", process: 'uplift', depth: 'surface' },
      { narration: "Exposed to the elements, the rock slowly disintegrates into fine clay and silt.", process: 'weathering', depth: 'surface' },
      { narration: "The fine particles settle in a calm lake. Layer after paper-thin layer accumulates.", process: 'deposition', extra: { sedimentType: 'shale' }, depth: 'shallow' },
      { narration: "Continents collide. The shale is buried and squeezed into smooth, hard slate.", process: 'heatAndPressure', depth: 'deep' },
      { narration: "Mountain-building forces push the slate upward. Ancient ocean floor becomes a mountain peak.", process: 'uplift', depth: 'surface' }
    ]
  ],

  sedimentary: [
    // Template A: H&P → melt → crystallize → weather → re-deposit
    [
      { narration: "Your {rock} rests in a quiet layer of earth, undisturbed for millions of years.", depth: 'shallow' },
      { narration: "As tectonic plates converge, the rock is buried deeper. Heat and pressure transform its minerals.", process: 'heatAndPressure', depth: 'deep' },
      { narration: "Still deeper, the temperature exceeds the melting point. The rock dissolves into magma.", process: 'melting', depth: 'mantle' },
      { narration: "The magma rises through cracks in the crust, cooling rapidly as it reaches the surface.", process: 'crystallization', extra: { coolingSpeed: 'fast' }, depth: 'surface' },
      { narration: "Wind and rain attack the new basalt. Over millions of years, it crumbles to sand.", process: 'weathering', depth: 'surface' },
      { narration: "The sand is carried to a desert basin and cemented into sandstone once again.", process: 'deposition', extra: { sedimentType: 'sandstone' }, depth: 'shallow' }
    ],
    // Template B: weather → re-deposit shale → H&P → uplift
    [
      { narration: "Your {rock} sits exposed on a riverbank, battered by seasonal floods.", depth: 'surface' },
      { narration: "The river grinds the rock into clay and silt, carrying it downstream.", process: 'weathering', depth: 'surface' },
      { narration: "The fine sediment settles in a delta. Centuries of layers compress into thin sheets.", process: 'deposition', extra: { sedimentType: 'shale' }, depth: 'shallow' },
      { narration: "Plate collision buries the shale miles underground. Pressure aligns the clay minerals into slate.", process: 'heatAndPressure', depth: 'deep' },
      { narration: "Mountain-building uplifts the slate to a high ridge.", process: 'uplift', depth: 'surface' },
      { narration: "Frost wedging and rain break the slate into rubble. The cycle is ready to begin again.", process: 'weathering', depth: 'surface' }
    ],
    // Template C: uplift → weather → deposit limestone → marble
    [
      { narration: "Your {rock} was formed at the bottom of an ancient sea, rich with fossils.", depth: 'shallow' },
      { narration: "Tectonic uplift raises the rock high above sea level.", process: 'uplift', depth: 'surface' },
      { narration: "Centuries of rain dissolve and fragment the rock into mineral-rich sediment.", process: 'weathering', depth: 'surface' },
      { narration: "In a warm tropical sea, organisms build shells from the dissolved minerals. Shells pile up.", process: 'deposition', extra: { sedimentType: 'limestone' }, depth: 'shallow' },
      { narration: "A continent collides. The limestone is pushed deep underground and recrystallized into marble.", process: 'heatAndPressure', depth: 'deep' }
    ]
  ],

  metamorphic: [
    // Template A: melt → crystallize slow → weather → sandstone → H&P
    [
      { narration: "Your {rock} endures immense heat deep in the Earth's crust.", depth: 'deep' },
      { narration: "The heat finally overcomes the rock. It melts into magma.", process: 'melting', depth: 'mantle' },
      { narration: "The magma slowly crystallizes in a vast underground pluton.", process: 'crystallization', extra: { coolingSpeed: 'slow' }, depth: 'deep' },
      { narration: "Millions of years of erosion strip away the overlying rock, exposing the granite.", process: 'uplift', depth: 'surface' },
      { narration: "Wind and water break the granite into coarse sand.", process: 'weathering', depth: 'surface' },
      { narration: "The sand is deposited in a river delta, compacting into sandstone over time.", process: 'deposition', extra: { sedimentType: 'sandstone' }, depth: 'shallow' }
    ],
    // Template B: uplift → weather → limestone → H&P back to metamorphic
    [
      { narration: "Your {rock} sits deep in a mountain root, transformed long ago by heat and pressure.", depth: 'deep' },
      { narration: "The mountain erodes away over hundreds of millions of years, exposing the rock.", process: 'uplift', depth: 'surface' },
      { narration: "Rain and frost shatter the rock. Rivers carry the fragments to the coast.", process: 'weathering', depth: 'surface' },
      { narration: "In a warm sea, calcium carbonate from dissolved minerals forms limestone.", process: 'deposition', extra: { sedimentType: 'limestone' }, depth: 'shallow' },
      { narration: "A new tectonic collision buries the limestone. Heat and pressure create marble.", process: 'heatAndPressure', depth: 'deep' },
      { narration: "Uplift brings the marble near the surface. A mountain of metamorphic rock is reborn.", process: 'uplift', depth: 'surface' }
    ],
    // Template C: uplift → weather → shale → slate → melt → obsidian
    [
      { narration: "Your {rock} formed under extreme conditions, but now sits deep and stable.", depth: 'deep' },
      { narration: "Tectonic forces push the rock up through layers of younger sediment.", process: 'uplift', depth: 'surface' },
      { narration: "Exposed at the surface, freeze-thaw cycles crack the rock into fine clay.", process: 'weathering', depth: 'surface' },
      { narration: "The clay settles in a quiet lake, building paper-thin layers of shale.", process: 'deposition', extra: { sedimentType: 'shale' }, depth: 'shallow' },
      { narration: "The shale is buried deep again by a new mountain-building event. It melts completely.", process: 'melting', depth: 'mantle' },
      { narration: "A violent eruption flings the magma into the air. It cools almost instantly into volcanic glass.", process: 'crystallization', extra: { coolingSpeed: 'ultrafast' }, depth: 'surface' }
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

  // Walk the template, resolving specimens at each step
  const steps = [];
  let currentSpecimen = startingRockId;
  const totalSteps = template.length;
  const myaPerStep = Math.floor(500 / totalSteps);

  for (let i = 0; i < totalSteps; i++) {
    const t = template[i];
    const timeMya = 500 - i * myaPerStep;
    const timeLabel = timeMya > 0 ? `${timeMya} Million Years Ago` : 'Present Day';

    const narration = t.narration.replace(/\{rock\}/g, rock.name);

    if (!t.process) {
      // Display-only step
      steps.push({ timeLabel, timeMya, narration, specimen: currentSpecimen, process: null, depth: t.depth });
    } else {
      // Resolve the transformation output
      const fromId = currentSpecimen;
      const toId = resolveOutput(fromId, t.process, t.extra);
      steps.push({
        timeLabel, timeMya, narration,
        specimen: fromId, process: t.process, depth: t.depth,
        extra: t.extra || {},
        resultSpecimen: toId
      });
      currentSpecimen = toId;
    }
  }

  // Final "present day" step if the template doesn't end with one
  const last = steps[steps.length - 1];
  if (last.timeMya > 0) {
    const finalRock = ROCKS[currentSpecimen];
    const utah = finalRock ? (finalRock.utahConnection || '') : '';
    steps.push({
      timeLabel: 'Present Day', timeMya: 0,
      narration: utah
        ? `Today, this ${finalRock.name.toLowerCase()} can be found at ${utah.split('—')[0].trim()} in Utah.`
        : `Today, this ${(finalRock || {}).name || 'rock'} waits at the surface — ready for the next chapter.`,
      specimen: currentSpecimen, process: null, depth: 'surface',
      utahConnection: utah ? (UTAH_CONNECTIONS.find(c => c.rockId === currentSpecimen) || {}).name : null
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

function startJourney() {
  journeyState.active = true;
  showJourneySetup();
}

function exitJourney() {
  stopJourneyPlay();
  journeyState.active = false;
  journeyState.journey = null;
  const overlay = document.getElementById('journey-overlay');
  if (overlay) overlay.remove();
  // Remove depth class from specimen display
  const disp = document.getElementById('specimen-display');
  if (disp) disp.className = disp.className.replace(/\bdepth-\S+/g, '').trim();
}

// ── Setup Screen ──────────────────────────────────────────────────────────────

function showJourneySetup() {
  exitJourney();
  journeyState.active = true;

  const stage = document.querySelector('.center-stage');
  if (!stage) return;

  const overlay = document.createElement('div');
  overlay.id = 'journey-overlay';
  overlay.className = 'journey-overlay';

  const rockIds = Object.keys(ROCKS);
  const cards = rockIds.map(id => {
    const r = ROCKS[id];
    return `<div class="journey-rock-option" data-rock="${id}" role="button" tabindex="0">
      <div class="jro-svg">${getRockSVG(id, 'small')}</div>
      <span class="jro-name">${r.name}</span>
      <span class="rock-type-badge ${r.type}">${r.type}</span>
    </div>`;
  }).join('');

  overlay.innerHTML = `
    <div class="journey-setup">
      <h2 class="journey-setup-title">🕰️ Geological Journey</h2>
      <p class="journey-setup-desc">Pick a starting rock and watch its journey through millions of years.</p>
      <div class="journey-rock-picker">${cards}</div>
      <button class="journey-start-btn" id="journey-start-btn" disabled>Start Journey →</button>
      <button class="journey-back-link" id="journey-back-link">← Back to Free Explore</button>
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

  // Timeline labels
  const labels = journey.map(s => {
    if (s.timeMya === 0) return 'Today';
    return `${s.timeMya}M`;
  }).join('');

  overlay.innerHTML = `
    <div class="journey-playback" id="journey-playback">
      <div class="journey-narration" id="journey-narration">
        <span class="journey-time-badge" id="journey-time-badge"></span>
        <p id="journey-narration-text"></p>
      </div>
      <div class="journey-depth-indicator" id="journey-depth-ind">
        <div class="depth-scale">
          ${DEPTH_ORDER.map(d => `<span class="depth-level" data-depth="${d}">${DEPTH_META[d].icon} ${DEPTH_META[d].label}</span>`).join('')}
        </div>
        <div class="depth-marker" id="depth-marker"></div>
      </div>
      <div class="journey-timeline" id="journey-timeline">
        <div class="timeline-bar">
          <div class="timeline-fill" id="timeline-fill"></div>
          <div class="timeline-playhead" id="timeline-playhead"></div>
        </div>
        <div class="timeline-labels" id="timeline-labels">
          ${journey.map((s, i) => `<span class="tl-label${i === 0 ? ' first' : ''}${i === journey.length - 1 ? ' last' : ''}">${s.timeMya > 0 ? s.timeMya + 'M' : 'Today'}</span>`).join('')}
        </div>
      </div>
      <div class="journey-controls">
        <button class="jc-btn" id="jc-prev" aria-label="Previous step">⏮</button>
        <button class="jc-btn jc-play" id="jc-play" aria-label="Play">▶ Play</button>
        <button class="jc-btn" id="jc-next" aria-label="Next step">⏭</button>
        <select class="jc-speed" id="jc-speed" aria-label="Playback speed">
          <option value="1">1× Speed</option>
          <option value="2">2× Speed</option>
          <option value="4">4× Speed</option>
        </select>
        <button class="jc-btn" id="jc-new" aria-label="New journey">🔄 New</button>
        <button class="jc-btn" id="jc-change" aria-label="Change rock">🪨 Change</button>
        <button class="jc-btn jc-exit" id="jc-exit" aria-label="Exit journey">✕ Exit</button>
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

  // Update narration
  const badge = document.getElementById('journey-time-badge');
  const narText = document.getElementById('journey-narration-text');
  if (badge) badge.textContent = step.timeLabel;
  if (narText) { narText.style.opacity = 0; setTimeout(() => { narText.textContent = step.narration; narText.style.opacity = 1; }, 120); }

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

  // Utah highlight
  if (step.utahConnection && typeof highlightUtahCard === 'function') {
    highlightUtahCard(step.utahConnection);
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
    if (btn) btn.textContent = '⏸ Pause';
    scheduleJourneyAdvance();
  }
}

function stopJourneyPlay() {
  journeyState.playing = false;
  if (journeyState.timer) { clearTimeout(journeyState.timer); journeyState.timer = null; }
  const btn = document.getElementById('jc-play');
  if (btn) btn.textContent = '▶ Play';
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
  if (badge)   badge.textContent = 'Journey Complete';
  if (narText) {
    const startName = ROCKS[journeyState.startRock]?.name || 'rock';
    const steps = journey.filter(s => s.process).length;
    narText.textContent = `Your ${startName} traveled through ${steps} transformations over 500 million years. Every atom is still here — just rearranged.`;
  }
}
