// ── interaction.js ────────────────────────────────────────────────────────────
// Rock Cycle Lab — Utah SEEd 7.2.1
// Drag-and-drop engine (mouse + touch), transformation logic, choice popups

'use strict';

// ── Drag Engine State ─────────────────────────────────────────────────────────

const dragEng = {
  active:        false,
  sourceId:      null,   // rock/material id being dragged
  ghost:         null,   // ghost DOM element
  startX:        0,
  startY:        0,
  moved:         false,
  hoveredTarget: null    // current drop target element
};

const DRAG_THRESHOLD = 10; // px before drag activates

// ── Specimen Category Helpers ─────────────────────────────────────────────────
// Returns the key used in TRANSFORMATIONS.accepts:
// 'igneous' | 'sedimentary' | 'metamorphic' | 'magma' | 'lava' | 'sediment'

function getSpecimenCategory(id) {
  if (ROCKS[id])     return ROCKS[id].type;
  if (MATERIALS[id]) return id;
  return null;
}

function getSpecimenName(id) {
  if (ROCKS[id])     return ROCKS[id].name;
  if (MATERIALS[id]) return MATERIALS[id].name;
  return id;
}

function isValidTransformation(specimenId, processId) {
  const transform = TRANSFORMATIONS[processId];
  if (!transform) return false;
  const category = getSpecimenCategory(specimenId);
  if (!category) return false;
  return transform.accepts.includes(category);
}

function getRejectMessage(specimenId, processId) {
  const category = getSpecimenCategory(specimenId);
  const msgs = {
    crystallization: {
      igneous: 'Rock is already solid — melt it first!',
      sedimentary: 'Rock is already solid — melt it first!',
      metamorphic: 'Rock is already solid — melt it first!',
      sediment: 'Sediment must compact into rock, then melt.'
    },
    melting: {
      magma: 'Already magma — it\'s already melted!',
      lava:  'Already lava — it\'s already melted!',
      sediment: 'Sediment must compact into rock before melting.'
    },
    weathering: {
      magma:    'Magma must cool and crystallize first!',
      lava:     'Lava must cool and crystallize first!',
      sediment: 'Sediment is already broken-down rock!'
    },
    deposition: {
      igneous:     'Rock must weather into sediment first!',
      sedimentary: 'Rock must weather into sediment first!',
      metamorphic: 'Rock must weather into sediment first!',
      magma: 'Magma must cool → weather → sediment first!',
      lava:  'Lava must cool → weather → sediment first!'
    },
    heatAndPressure: {
      magma:    'Magma must solidify before metamorphism.',
      lava:     'Lava must solidify before metamorphism.',
      sediment: 'Sediment must compact into rock first.'
    },
    uplift: {
      magma:    'Magma must solidify before being uplifted.',
      lava:     'Lava must solidify before being uplifted.',
      sediment: 'Sediment must compact into rock first.'
    }
  };
  return (msgs[processId] || {})[category] || 'This transformation isn\'t possible here.';
}

// ── Drag Ghost ────────────────────────────────────────────────────────────────

function createDragGhost(specimenId, x, y) {
  const ghost = document.createElement('div');
  ghost.className = 'drag-ghost';

  const rock     = ROCKS[specimenId];
  const material = MATERIALS[specimenId];
  const name     = rock ? rock.name : material ? material.name : specimenId;

  let iconHtml;
  if (rock) {
    // getRockSVG is defined in app.js (loaded after this file, but available at call time)
    iconHtml = `<div class="drag-ghost-svg">${getRockSVG(specimenId, 'small')}</div>`;
  } else if (material) {
    iconHtml = `<div class="drag-ghost-emoji">${material.icon || '💧'}</div>`;
  } else {
    iconHtml = '';
  }

  ghost.innerHTML = `${iconHtml}<span class="drag-ghost-label">${name}</span>`;
  document.body.appendChild(ghost);
  positionGhost(ghost, x, y);
  return ghost;
}

function positionGhost(ghost, x, y) {
  ghost.style.left = (x - 35) + 'px';
  ghost.style.top  = (y - 28) + 'px';
}

function removeGhost() {
  if (dragEng.ghost) {
    dragEng.ghost.remove();
    dragEng.ghost = null;
  }
}

// ── Drop Target Detection ─────────────────────────────────────────────────────

function getDropTargetAt(x, y) {
  const el = document.elementFromPoint(x, y);
  if (!el) return null;
  const zone    = el.closest('.process-zone');
  if (zone)    return zone;
  const display = el.closest('#specimen-display');
  if (display) return display;
  return null;
}

function clearAllDropFeedback() {
  document.querySelectorAll('.process-zone').forEach(z => {
    z.classList.remove('drop-valid', 'drop-invalid', 'drop-active');
    const tip = z.querySelector('.zone-drop-tip');
    if (tip) tip.remove();
  });
  const display = document.getElementById('specimen-display');
  if (display) display.classList.remove('drop-target-hover');
}

function applyDropFeedback(target, specimenId) {
  clearAllDropFeedback();
  if (!target) return;

  // Drop on specimen display: always valid (loading a rock from shelf)
  if (target.id === 'specimen-display') {
    if (ROCKS[specimenId]) target.classList.add('drop-target-hover');
    return;
  }

  // Drop on process zone
  const processId = target.dataset.process;
  if (!processId) return;

  // Guided mode: zone not enabled → show as invalid
  if (state.mode === 'guided' && typeof isGuidedZoneEnabled === 'function' && !isGuidedZoneEnabled(processId)) {
    target.classList.add('drop-invalid');
    showZoneTip(target, 'Follow the instructions! Look for the highlighted zone.');
    return;
  }

  if (isValidTransformation(specimenId, processId)) {
    target.classList.add('drop-valid');
    showZoneTip(target, '✓ ' + TRANSFORMATIONS[processId].name);
  } else {
    target.classList.add('drop-invalid');
    showZoneTip(target, getRejectMessage(specimenId, processId));
  }
}

function showZoneTip(zone, text) {
  let tip = zone.querySelector('.zone-drop-tip');
  if (!tip) {
    tip = document.createElement('div');
    tip.className = 'zone-drop-tip';
    zone.appendChild(tip);
  }
  tip.textContent = text;
}

// ── Drag Lifecycle ────────────────────────────────────────────────────────────

function startDrag(specimenId, x, y) {
  dragEng.active   = true;
  dragEng.sourceId = specimenId;
  dragEng.ghost    = createDragGhost(specimenId, x, y);
  document.body.classList.add('dragging');
}

function onDragMove(x, y) {
  if (!dragEng.active) return;
  positionGhost(dragEng.ghost, x, y);
  const target = getDropTargetAt(x, y);
  applyDropFeedback(target, dragEng.sourceId);
  dragEng.hoveredTarget = target;
}

function onDragEnd(x, y) {
  if (!dragEng.active) return;

  const target     = getDropTargetAt(x, y);
  const specimenId = dragEng.sourceId;

  removeGhost();
  clearAllDropFeedback();
  document.body.classList.remove('dragging');
  dragEng.active        = false;
  dragEng.hoveredTarget = null;
  dragEng.moved         = false;

  if (!target) return;

  // Drop on specimen display: load rock from shelf
  if (target.id === 'specimen-display') {
    if (ROCKS[specimenId]) selectRock(specimenId);
    return;
  }

  // Drop on process zone
  const processId = target.dataset.process;
  if (!processId) return;

  // Guided mode: only allow enabled zones
  if (state.mode === 'guided' && typeof isGuidedZoneEnabled === 'function' && !isGuidedZoneEnabled(processId)) {
    target.classList.add('drop-invalid');
    showZoneTip(target, 'Follow the instructions above! Look for the highlighted zone.');
    setTimeout(() => {
      target.classList.remove('drop-invalid');
      const tip = target.querySelector('.zone-drop-tip');
      if (tip) tip.remove();
    }, 1600);
    return;
  }

  // Preset mode: block manual drag during playback
  if (state.mode === 'presets' && typeof isPresetPlaying === 'function' && isPresetPlaying()) {
    return;
  }

  if (isValidTransformation(specimenId, processId)) {
    // If dragging directly from shelf, update currentSpecimen first
    if (!state.currentSpecimen || state.currentSpecimen !== specimenId) {
      if (ROCKS[specimenId]) {
        // Don't call selectRock (would re-render); just update state silently
        state.currentSpecimen = specimenId;
        document.querySelectorAll('.rock-card').forEach(c =>
          c.classList.toggle('selected', c.dataset.rock === specimenId)
        );
      }
    }
    performTransformation(specimenId, processId);
  } else {
    // Brief invalid flash + tip
    target.classList.add('drop-invalid');
    showZoneTip(target, getRejectMessage(specimenId, processId));
    setTimeout(() => {
      target.classList.remove('drop-invalid');
      const tip = target.querySelector('.zone-drop-tip');
      if (tip) tip.remove();
    }, 1600);
  }
}

// ── Mouse Handler ─────────────────────────────────────────────────────────────

function onMouseDown(e, specimenId) {
  if (e.button !== 0) return;
  e.stopPropagation();

  dragEng.startX   = e.clientX;
  dragEng.startY   = e.clientY;
  dragEng.moved    = false;
  dragEng.sourceId = specimenId;

  const onMove = (ev) => {
    const dx = ev.clientX - dragEng.startX;
    const dy = ev.clientY - dragEng.startY;
    if (!dragEng.active && (Math.abs(dx) > DRAG_THRESHOLD || Math.abs(dy) > DRAG_THRESHOLD)) {
      dragEng.moved = true;
      startDrag(specimenId, ev.clientX, ev.clientY);
    }
    if (dragEng.active) onDragMove(ev.clientX, ev.clientY);
  };

  const onUp = (ev) => {
    document.removeEventListener('mousemove', onMove);
    document.removeEventListener('mouseup', onUp);
    if (dragEng.active) onDragEnd(ev.clientX, ev.clientY);
    // If no drag happened, click-to-select in app.js handles it normally
  };

  document.addEventListener('mousemove', onMove);
  document.addEventListener('mouseup', onUp);
}

// ── Touch Handler ─────────────────────────────────────────────────────────────

function onTouchStart(e, specimenId) {
  const touch = e.changedTouches[0];
  dragEng.startX   = touch.clientX;
  dragEng.startY   = touch.clientY;
  dragEng.moved    = false;
  dragEng.sourceId = specimenId;

  const onMove = (ev) => {
    const t  = ev.changedTouches[0];
    const dx = t.clientX - dragEng.startX;
    const dy = t.clientY - dragEng.startY;
    if (!dragEng.active && (Math.abs(dx) > DRAG_THRESHOLD || Math.abs(dy) > DRAG_THRESHOLD)) {
      ev.preventDefault();
      dragEng.moved = true;
      startDrag(specimenId, t.clientX, t.clientY);
    }
    if (dragEng.active) {
      ev.preventDefault();
      onDragMove(t.clientX, t.clientY);
    }
  };

  const onEnd = (ev) => {
    document.removeEventListener('touchmove', onMove, { passive: false });
    document.removeEventListener('touchend',  onEnd);
    if (dragEng.active) {
      const t = ev.changedTouches[0];
      onDragEnd(t.clientX, t.clientY);
    }
  };

  document.addEventListener('touchmove', onMove, { passive: false });
  document.addEventListener('touchend',  onEnd);
}

// ── Init Drag Sources ─────────────────────────────────────────────────────────

function initDragDrop() {
  // Rock shelf — event delegation
  const shelf = document.getElementById('rock-shelf-cards');
  if (shelf) {
    shelf.addEventListener('mousedown', (e) => {
      const card = e.target.closest('.rock-card');
      if (card && card.dataset.rock) onMouseDown(e, card.dataset.rock);
    });
    shelf.addEventListener('touchstart', (e) => {
      const card = e.target.closest('.rock-card');
      if (card && card.dataset.rock) onTouchStart(e, card.dataset.rock);
    }, { passive: true });
  }

  // Specimen display as drag source
  const display = document.getElementById('specimen-display');
  if (display) {
    display.addEventListener('mousedown', (e) => {
      if (state.currentSpecimen && !e.target.closest('.choice-popup')) {
        onMouseDown(e, state.currentSpecimen);
      }
    });
    display.addEventListener('touchstart', (e) => {
      if (state.currentSpecimen) onTouchStart(e, state.currentSpecimen);
    }, { passive: true });
  }

  // Clear history button
  const clearBtn = document.getElementById('history-clear-btn');
  if (clearBtn) {
    clearBtn.addEventListener('click', () => {
      state.transformationHistory = [];
      state.currentSpecimen = null;
      // Reset specimen display
      const empty   = document.getElementById('specimen-empty');
      const content = document.getElementById('specimen-content');
      const disp    = document.getElementById('specimen-display');
      if (empty)   empty.style.display = '';
      if (content) { content.classList.remove('visible'); content.innerHTML = ''; }
      if (disp)    disp.classList.remove('type-igneous','type-sedimentary','type-metamorphic','type-material');
      document.querySelectorAll('.rock-card').forEach(c => c.classList.remove('selected'));
      updateHistoryStrip();
    });
  }
}

// ── Transformation Logic ──────────────────────────────────────────────────────

async function performTransformation(specimenId, processId) {
  if (state.isAnimating) return;

  const transform = TRANSFORMATIONS[processId];
  if (!transform) return;

  flashZone(processId);

  if (processId === 'melting') {
    await animateTransformation(specimenId, processId, 'magma');
    finalizeTransformation(specimenId, processId, 'magma');

  } else if (processId === 'crystallization') {
    showCrystallizationPopup(specimenId);

  } else if (processId === 'weathering') {
    await animateTransformation(specimenId, processId, 'sediment');
    finalizeTransformation(specimenId, processId, 'sediment');

  } else if (processId === 'deposition') {
    showDepositionPopup(specimenId);

  } else if (processId === 'heatAndPressure') {
    const outputId = transform.metamorphicMap[specimenId] || 'quartzite';
    await animateTransformation(specimenId, processId, outputId);
    finalizeTransformation(specimenId, processId, outputId);

  } else if (processId === 'uplift') {
    await animateTransformation(specimenId, processId, specimenId);
    finalizeTransformation(specimenId, processId, specimenId, { isUplift: true });
  }
}

function finalizeTransformation(fromId, processId, toId, opts = {}) {
  const { isUplift = false } = opts;

  // Update state
  state.currentSpecimen = toId;
  state.transformationHistory.push({
    fromId,
    fromName:    getSpecimenName(fromId),
    processId,
    processName: TRANSFORMATIONS[processId].name,
    processIcon: TRANSFORMATIONS[processId].icon,
    toId,
    toName:      getSpecimenName(toId),
    isUplift,
    timestamp:   Date.now()
  });

  // Track path discovery
  trackPathDiscovery(fromId, processId, toId);

  // Update specimen display
  updateSpecimenDisplay(toId, isUplift ? fromId : null);

  // Clear shelf selection highlight (result may not be on shelf)
  document.querySelectorAll('.rock-card').forEach(c => c.classList.remove('selected'));

  // Update UI
  updateHistoryStrip();
  updatePathsCounter();

  // Update right-panel educational content (panels.js, loaded after this file)
  if (typeof updatePanelsAfterTransformation === 'function') {
    updatePanelsAfterTransformation(fromId, processId, toId);
  }

  // Guided mode: check step completion
  if (typeof onGuidedTransformation === 'function' && state.mode === 'guided') {
    onGuidedTransformation(fromId, processId, toId);
  }
}

// ── Specimen Display ──────────────────────────────────────────────────────────

function updateSpecimenDisplay(id, upliftFromId) {
  const rock     = ROCKS[id];
  const material = MATERIALS[id];

  if (rock) {
    renderSpecimen(rock);   // defined in app.js
    return;
  }
  if (material) {
    renderMaterialDisplay(material, upliftFromId);
  }
}

function renderMaterialDisplay(material, prevRockId) {
  const display   = document.getElementById('specimen-display');
  const emptyEl   = document.getElementById('specimen-empty');
  const contentEl = document.getElementById('specimen-content');
  if (!display || !emptyEl || !contentEl) return;

  emptyEl.style.display = 'none';
  contentEl.classList.add('visible');
  display.classList.remove('type-igneous', 'type-sedimentary', 'type-metamorphic');
  display.classList.add('type-material');

  const prevRockName = prevRockId ? getSpecimenName(prevRockId) : null;

  const hints = {
    magma:    'Drag to <strong>Crystallization</strong> — cooling speed determines crystal size and rock type.',
    lava:     'Drag to <strong>Crystallization</strong> — fast surface cooling forms basalt or obsidian.',
    sediment: 'Drag to <strong>Deposition &amp; Sedimentation</strong> — layers compact into sedimentary rock.'
  };

  contentEl.innerHTML = `
    <div class="specimen-svg-wrap"
         style="filter:drop-shadow(0 4px 20px ${material.color}66)">
      ${getMaterialSVG(material.id)}
    </div>
    <div class="specimen-name">${material.name}</div>
    <div class="specimen-type-row">
      <span class="specimen-badge material">intermediate material</span>
      ${prevRockName ? `<span class="specimen-badge material" style="opacity:0.65">from ${prevRockName}</span>` : ''}
    </div>
    <p class="specimen-desc">${material.description}</p>
    <div class="specimen-stat" style="width:100%">
      <div class="specimen-stat-label">🔬 What's next?</div>
      <div class="specimen-stat-value"
           style="font-size:0.68rem;font-weight:400;line-height:1.5">
        ${hints[material.id] || ''}
      </div>
    </div>
  `;
}

function getMaterialSVG(id) {
  if (id === 'magma' || id === 'lava') {
    return `<svg xmlns="http://www.w3.org/2000/svg" width="140" height="140" viewBox="0 0 140 140">
  <defs>
    <radialGradient id="magma-g" cx="50%" cy="55%">
      <stop offset="0%"   stop-color="#FFB040"/>
      <stop offset="45%"  stop-color="#FF4500"/>
      <stop offset="100%" stop-color="#8B0000"/>
    </radialGradient>
  </defs>
  <ellipse cx="70" cy="82" rx="54" ry="42" fill="url(#magma-g)" opacity="0.92"/>
  <path d="M28,66 Q48,44 70,58 Q92,44 112,66 Q102,84 70,79 Q38,84 28,66Z"
        fill="#FF6B35" opacity="0.65"/>
  <path d="M50,54 Q60,38 70,48 Q80,38 90,54 Q80,63 70,58 Q60,63 50,54Z"
        fill="#FFA040" opacity="0.75"/>
  <circle cx="58"  cy="74" r="4.5" fill="#FFD700" opacity="0.65"/>
  <circle cx="82"  cy="70" r="3.5" fill="#FF8C00" opacity="0.55"/>
  <circle cx="48"  cy="84" r="3"   fill="#FFD700" opacity="0.50"/>
  <circle cx="96"  cy="80" r="2.5" fill="#FFA040" opacity="0.45"/>
  <ellipse cx="70" cy="82" rx="54" ry="42" fill="none"
           stroke="#FF6B3520" stroke-width="1"/>
</svg>`;
  }

  if (id === 'sediment') {
    // Fixed grain positions — no Math.random() for determinism
    const grains = [
      [22,52,3.5,'#D4B880'],[38,60,2.5,'#A08040'],[55,48,3,'#C8A060'],
      [72,56,3.2,'#B89050'],[88,50,2.8,'#D0A870'],[104,58,3,'#C09060'],
      [30,70,2.5,'#B8A060'],[48,75,3,'#D4B870'],[65,68,2.8,'#A89050'],
      [82,72,3.2,'#C4A060'],[98,66,2.5,'#B89858'],[112,74,3,'#D0A860'],
      [25,82,3,'#C8A058'],[42,88,2.5,'#A88848'],[60,82,3.5,'#D0A868'],
      [78,90,2.8,'#B89058'],[95,84,3,'#C8A860'],[108,88,2.5,'#B09048'],
      [35,96,2.5,'#D4B068'],[52,100,3,'#A88840'],[70,95,3.2,'#C4A050'],
      [87,98,2.8,'#B09060'],[102,94,2.5,'#D0A858'],[118,90,3,'#B88850'],
      [18,64,2,'#C0983A'],[115,62,2,'#B88840']
    ];
    return `<svg xmlns="http://www.w3.org/2000/svg" width="140" height="140" viewBox="0 0 140 140">
  <defs>
    <clipPath id="sed-clip">
      <ellipse cx="70" cy="76" rx="55" ry="42"/>
    </clipPath>
  </defs>
  <ellipse cx="70" cy="76" rx="55" ry="42" fill="#C8A870" opacity="0.80"/>
  <g clip-path="url(#sed-clip)">
    ${grains.map(([x,y,r,c]) =>
      `<ellipse cx="${x}" cy="${y}" rx="${r}" ry="${r*0.7}" fill="${c}" opacity="0.75"/>`
    ).join('')}
    <text x="70" y="108" text-anchor="middle" font-size="10"
          fill="#8B6914" font-family="serif" opacity="0.55">sand · silt · clay · gravel</text>
  </g>
</svg>`;
  }

  // Fallback
  return `<svg xmlns="http://www.w3.org/2000/svg" width="140" height="140" viewBox="0 0 140 140">
    <ellipse cx="70" cy="70" rx="55" ry="55" fill="#888" opacity="0.8"/>
  </svg>`;
}

// ── Path Discovery ────────────────────────────────────────────────────────────

function trackPathDiscovery(fromId, processId, toId) {
  const fromCat = getSpecimenCategory(fromId);
  const pathsToAdd = [];

  const isRock = ['igneous','sedimentary','metamorphic'].includes(fromCat);

  if (isRock) {
    if (processId === 'melting')         pathsToAdd.push('rock-melting-magma');
    if (processId === 'weathering')      pathsToAdd.push('rock-weathering-sediment');
    if (processId === 'heatAndPressure') pathsToAdd.push('rock-heatAndPressure-metamorphic');
    if (processId === 'uplift')          pathsToAdd.push('rock-uplift-surface');
  }
  if ((fromCat === 'magma' || fromCat === 'lava') && processId === 'crystallization') {
    pathsToAdd.push('magma-crystallization-igneous');
  }
  if (fromCat === 'sediment' && processId === 'deposition') {
    pathsToAdd.push('sediment-deposition-sedimentary');
  }
  if (fromCat === 'igneous'     && processId === 'weathering')      pathsToAdd.push('igneous-weathering-sediment');
  if (fromCat === 'sedimentary' && processId === 'heatAndPressure') pathsToAdd.push('sedimentary-heatAndPressure-metamorphic');

  pathsToAdd.forEach(p => {
    if (!state.discoveredPaths.has(p)) {
      state.discoveredPaths.add(p);
      console.log(`%c✓ Path discovered: ${p}`, 'color:#5CAB7D;font-weight:bold;font-size:12px');
    }
  });
}

function updatePathsCounter() {
  const count = state.discoveredPaths.size;
  const total = ALL_PATHS.length;

  const counter = document.getElementById('paths-counter');
  if (counter) {
    counter.textContent = `${count}/${total}`;
    counter.className = 'paths-counter' + (count === total ? ' complete' : '');
    counter.title = count === total
      ? 'All paths discovered!'
      : `${total - count} paths remaining`;
  }

  // Update cycle diagram progress bar
  const progressDiv = document.getElementById('cycle-diagram-progress');
  const emptyDiv    = document.getElementById('cycle-diagram-empty');
  const fill        = document.getElementById('cycle-progress-fill');
  const label       = document.getElementById('cycle-progress-label');

  if (count > 0) {
    if (emptyDiv)    emptyDiv.style.display = 'none';
    if (progressDiv) progressDiv.style.display = 'flex';
    if (fill)        fill.style.width = (count / total * 100) + '%';
    if (label)       label.textContent = `${count} of ${total} paths discovered`;
  }
}

// ── Zone Flash ────────────────────────────────────────────────────────────────

function flashZone(processId) {
  const zone = document.querySelector(`.process-zone[data-process="${processId}"]`);
  if (!zone) return;
  zone.classList.add('zone-flash');
  setTimeout(() => zone.classList.remove('zone-flash'), 550);
}

// ── History Strip ─────────────────────────────────────────────────────────────
// Defines the rich version — overrides app.js placeholder after page load

function updateHistoryStrip() {
  const strip = document.getElementById('history-strip-items');
  if (!strip) return;

  if (state.transformationHistory.length === 0) {
    strip.innerHTML = '<span class="history-empty">Transformations will appear here</span>';
    return;
  }

  const history = state.transformationHistory;
  let html = '';

  // First chip: the "from" of the very first entry
  html += buildHistoryChip(history[0].fromId);

  for (let i = 0; i < history.length; i++) {
    const entry = history[i];
    html += `<div class="history-arrow" title="${entry.processName}">
               <span class="history-process-icon">${entry.processIcon}</span>
             </div>`;
    html += buildHistoryChip(entry.toId, entry.isUplift);
  }

  strip.innerHTML = html;

  // Chip click → re-select specimen
  strip.querySelectorAll('.history-chip').forEach(chip => {
    chip.addEventListener('click', () => {
      const id = chip.dataset.specimenId;
      if (ROCKS[id]) {
        selectRock(id);
      } else if (MATERIALS[id]) {
        state.currentSpecimen = id;
        updateSpecimenDisplay(id);
      }
    });
    chip.addEventListener('keydown', e => {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); chip.click(); }
    });
  });

  // Auto-scroll to newest entry
  const stripEl = strip.closest('.history-strip');
  if (stripEl) stripEl.scrollLeft = stripEl.scrollWidth;
}

function buildHistoryChip(id, isUplift = false) {
  const rock     = ROCKS[id];
  const material = MATERIALS[id];
  const name     = rock ? rock.name : material ? material.name : id;
  const color    = rock ? rock.color : material ? material.color : '#888';
  const typeClass = rock ? rock.type : 'material';

  return `<div class="history-chip ${typeClass}"
               data-specimen-id="${id}"
               role="button" tabindex="0"
               title="${name}${isUplift ? ' (uplifted to surface)' : ''}">
    <div class="chip-dot" style="background:${color}"></div>
    <span class="chip-label">${name}${isUplift ? '<span class="chip-uplift">↑</span>' : ''}</span>
  </div>`;
}

// ── Choice Popups ─────────────────────────────────────────────────────────────

function showChoicePopup(config) {
  const existing = document.getElementById('choice-popup-overlay');
  if (existing) existing.remove();

  const overlay = document.createElement('div');
  overlay.id        = 'choice-popup-overlay';
  overlay.className = 'choice-popup-overlay';

  const popup = document.createElement('div');
  popup.className = 'choice-popup pop-in';
  popup.setAttribute('role', 'dialog');
  popup.setAttribute('aria-modal', 'true');
  popup.setAttribute('aria-labelledby', 'popup-title');

  popup.innerHTML = `
    <div class="popup-header">
      <div class="popup-icon" aria-hidden="true">${config.icon}</div>
      <h3 class="popup-title" id="popup-title">${config.title}</h3>
      <p class="popup-subtitle">${config.subtitle}</p>
    </div>
    <div class="popup-options">
      ${config.options.map(opt => `
        <button class="choice-option" data-value="${opt.value}">
          <span class="choice-option-icon" aria-hidden="true">${opt.icon}</span>
          <span class="choice-option-label">${opt.label}</span>
          <span class="choice-option-desc">${opt.desc}</span>
        </button>
      `).join('')}
    </div>
    <p class="popup-note">${config.note}</p>
  `;

  overlay.appendChild(popup);
  document.body.appendChild(overlay);

  popup.querySelectorAll('.choice-option').forEach(btn => {
    btn.addEventListener('click', () => {
      overlay.remove();
      config.onChoose(btn.dataset.value);
    });
  });

  // Close on overlay background click
  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) overlay.remove();
  });

  // Focus first option for keyboard users
  const firstBtn = popup.querySelector('.choice-option');
  if (firstBtn) setTimeout(() => firstBtn.focus(), 50);

  // Guided mode: highlight recommended choice
  if (typeof onGuidedPopupShown === 'function' && state.mode === 'guided') {
    onGuidedPopupShown(popup);
  }
}

function showCrystallizationPopup(fromId) {
  showChoicePopup({
    icon: '❄️',
    title: 'How fast did the magma cool?',
    subtitle: 'Cooling speed determines crystal size and the rock that forms.',
    options: [
      { value: 'slow',      icon: '🐌', label: 'Slow',       desc: 'Deep underground\n→ Large crystals\n→ Granite'   },
      { value: 'fast',      icon: '🏃', label: 'Fast',       desc: 'Surface lava flow\n→ Tiny crystals\n→ Basalt'   },
      { value: 'ultrafast', icon: '⚡', label: 'Ultra-fast', desc: 'Volcanic eruption\n→ No crystals\n→ Obsidian'   }
    ],
    note: '💡 Slow cooling = time for large crystals to grow. Fast cooling = small or no crystals.',
    async onChoose(speed) {
      const map = { slow: 'granite', fast: 'basalt', ultrafast: 'obsidian' };
      const toId = map[speed];
      await animateTransformation(fromId, 'crystallization', toId);
      finalizeTransformation(fromId, 'crystallization', toId);
    }
  });
}

function showDepositionPopup(fromId) {
  showChoicePopup({
    icon: '📥',
    title: 'What settled in the layers?',
    subtitle: 'The type of sediment determines which rock forms.',
    options: [
      { value: 'sandstone', icon: '🏖️', label: 'Sand grains',     desc: 'Wind or water\ntransport\n→ Sandstone'   },
      { value: 'limestone', icon: '🐚', label: 'Shells & fossils', desc: 'Marine organisms\non ocean floor\n→ Limestone' },
      { value: 'shale',     icon: '💧', label: 'Clay & silt',      desc: 'Calm water\nsettling\n→ Shale'          }
    ],
    note: '💡 Layers pile up, compact under their own weight, and cement together over millions of years.',
    async onChoose(rockId) {
      await animateTransformation(fromId, 'deposition', rockId);
      finalizeTransformation(fromId, 'deposition', rockId);
    }
  });
}
