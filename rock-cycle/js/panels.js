// ── panels.js ─────────────────────────────────────────────────────────────────
// Rock Cycle Lab — Utah SEEd 7.2.1
// Right-panel educational content: Explanation, Energy Flow, Matter Tracker, Cycle Diagram

'use strict';

// Per-energy-source usage counts (reset on page load)
const energyUsage = {};

// ── Init ──────────────────────────────────────────────────────────────────────

function initPanels() {
  // Reset usage counts
  Object.keys(ENERGY_SOURCES).forEach(k => { energyUsage[k] = 0; });

  // Render initial cycle diagram
  renderCycleDiagram();

  // Set idle explanation state
  setExplanationIdle();
}

// ── Explanation Panel ─────────────────────────────────────────────────────────

function setExplanationIdle() {
  const panel = document.getElementById('explanation-panel');
  if (!panel) return;
  panel.className = 'explanation-panel explanation-idle';
  panel.innerHTML = `<p class="exp-hint">${t('explanationDefault')}</p>`;
}

// Called from app.js when a rock/material is selected (not after a transform)
function updateExplanationPanelOnSelect(specimenId) {
  const panel = document.getElementById('explanation-panel');
  if (!panel) return;

  const rock     = ROCKS[specimenId];
  const material = MATERIALS[specimenId];

  if (!rock && !material) { setExplanationIdle(); return; }

  panel.className = 'explanation-panel explanation-selected';

  if (rock) {
    // List which processes accept this rock (use `tr` for loop var — `t` is the translation fn)
    const validProcesses = Object.values(TRANSFORMATIONS)
      .filter(tr => tr.accepts.includes(rock.type))
      .map(tr => `<span class="exp-process-tag" style="color:${getProcessColor(tr.id)}">${tr.icon} ${processName(tr.id)}</span>`)
      .join('');

    panel.innerHTML = `
      <div class="exp-rock-name">${rockName(rock.id)}</div>
      <p class="exp-desc">${t(rock.id + 'Desc')}</p>
      <div class="exp-section-label">${t('explainAvailTransforms')}</div>
      <div class="exp-process-tags">${validProcesses}</div>
      <div class="exp-hint-drag">${t('explainDragHint')}</div>
    `;
  } else {
    const validProcesses = Object.values(TRANSFORMATIONS)
      .filter(tr => tr.accepts.includes(specimenId))
      .map(tr => `<span class="exp-process-tag" style="color:${getProcessColor(tr.id)}">${tr.icon} ${processName(tr.id)}</span>`)
      .join('');

    const matDescKey = { magma: 'magmaDesc', lava: 'lavaDesc', sediment: 'sedimentDesc' }[specimenId] || 'magmaDesc';

    panel.innerHTML = `
      <div class="exp-rock-name">${rockName(specimenId)}</div>
      <p class="exp-desc">${t(matDescKey)}</p>
      ${validProcesses ? `
        <div class="exp-section-label">${t('explainNextSteps')}</div>
        <div class="exp-process-tags">${validProcesses}</div>
      ` : ''}
    `;
  }
}

// Called from interaction.js after a transformation finalizes
function updatePanelsAfterTransformation(fromId, processId, toId) {
  const transform = TRANSFORMATIONS[processId];
  if (!transform) return;

  // Update explanation panel with transformation result
  updateExplanationPostTransform(fromId, processId, toId, transform);

  // Update energy tracker
  const energySrcId = transform.energySource;
  if (energySrcId) {
    energyUsage[energySrcId] = (energyUsage[energySrcId] || 0) + 1;
    renderEnergyTracker(energySrcId);
  }

  // Update matter tracker
  updateMatterTracker(fromId, processId, toId);

  // Rebuild cycle diagram (to light up new paths)
  renderCycleDiagram();
}

function updateExplanationPostTransform(fromId, processId, toId, transform) {
  const panel = document.getElementById('explanation-panel');
  if (!panel) return;

  const fromName = rockName(fromId);
  const toName   = rockName(toId);
  const energySrc = ENERGY_SOURCES[transform.energySource];
  const energyKeyMap = { sun: 'energySun', 'earth-heat': 'energyEarthHeat', gravity: 'energyGravity', cooling: 'energyCooling', tectonic: 'energyTectonic' };
  const processDescKey = { melting: 'meltingDesc', crystallization: 'crystallizationDesc', weathering: 'weatheringDesc', deposition: 'depositionDesc', heatAndPressure: 'heatPressureDesc', uplift: 'upliftDesc' }[processId];
  const matterKey = { melting: 'meltingMatter', crystallization: 'crystallizationMatter', weathering: 'weatheringMatter', deposition: 'depositionMatter', heatAndPressure: 'heatPressureMatter', uplift: 'upliftMatter' }[processId];

  panel.className = 'explanation-panel explanation-transform';
  panel.innerHTML = `
    <div class="exp-transform-header">
      <span class="exp-transform-icon">${transform.icon}</span>
      <div>
        <div class="exp-transform-title">${processName(processId)}</div>
        <div class="exp-transform-path">${fromName} → ${toName}</div>
      </div>
    </div>
    <p class="exp-desc">${t(processDescKey || '')}</p>
    ${energySrc ? `
      <div class="exp-energy-row">
        <span class="exp-energy-icon">${energySrc.icon}</span>
        <span class="exp-energy-label">${t('explainEnergyLabel')} <strong>${t(energyKeyMap[energySrc.id] || energySrc.id)}</strong></span>
      </div>
    ` : ''}
    <div class="exp-matter-note">
      <span class="exp-matter-icon">⚛️</span>
      <span>${t(matterKey || '')}</span>
    </div>
  `;
}

// ── Energy Flow Tracker ───────────────────────────────────────────────────────

function renderEnergyTracker(lastUsedId) {
  const list = document.getElementById('energy-list');
  if (!list) return;

  const maxUsage = Math.max(1, ...Object.values(energyUsage));
  const energyKeyMap = { sun: 'energySun', 'earth-heat': 'energyEarthHeat', gravity: 'energyGravity', cooling: 'energyCooling', tectonic: 'energyTectonic' };

  list.innerHTML = Object.values(ENERGY_SOURCES).map(src => {
    const count    = energyUsage[src.id] || 0;
    const barPct   = Math.round((count / maxUsage) * 100);
    const isActive = src.id === lastUsedId;
    const isUsed   = count > 0;

    return `
      <div class="energy-item${isActive ? ' active just-used' : isUsed ? ' used' : ''}">
        <span class="energy-item-icon">${src.icon}</span>
        <div class="energy-item-info">
          <div class="energy-item-name">${t(energyKeyMap[src.id] || src.id)}</div>
          <div class="energy-bar-row">
            <div class="energy-bar-track">
              <div class="energy-bar-fill" style="width:${barPct}%;background:${src.color}"></div>
            </div>
            <span class="energy-use-count">${count > 0 ? `×${count}` : ''}</span>
          </div>
        </div>
        <div class="energy-item-dot${isUsed ? ' lit' : ''}" style="${isUsed ? `background:${src.color}` : ''}"></div>
      </div>
    `;
  }).join('');

  // Remove just-used class after a moment (so animation only plays once)
  setTimeout(() => {
    list.querySelectorAll('.just-used').forEach(el => el.classList.remove('just-used'));
  }, 1000);
}

// ── Matter Tracker ────────────────────────────────────────────────────────────

function updateMatterTracker(fromId, processId, toId) {
  const tracker = document.getElementById('matter-tracker');
  if (!tracker) return;

  const fromRock = ROCKS[fromId] || MATERIALS[fromId];
  const toRock   = ROCKS[toId]   || MATERIALS[toId];
  if (!fromRock || !toRock) return;

  const fromMins = fromRock.minerals || [];
  const toMins   = toRock.minerals   || [];

  const matterKey = { melting: 'meltingMatter', crystallization: 'crystallizationMatter', weathering: 'weatheringMatter', deposition: 'depositionMatter', heatAndPressure: 'heatPressureMatter', uplift: 'upliftMatter' }[processId];

  tracker.className = 'matter-tracker-active';
  tracker.innerHTML = `
    <div class="matter-conservation">
      <span class="matter-icon">⚛️</span>
      <span>${t('matterConservation')}</span>
    </div>
    <div class="matter-minerals-row">
      <div class="matter-mineral-col">
        <div class="matter-col-label">${rockName(fromId)}</div>
        ${fromMins.map(m => `<div class="matter-mineral-dot"><span class="m-dot"></span><span class="m-name">${m}</span></div>`).join('')}
      </div>
      <div class="matter-arrow-col">
        <span class="matter-transform-icon">${TRANSFORMATIONS[processId]?.icon || '→'}</span>
      </div>
      <div class="matter-mineral-col">
        <div class="matter-col-label">${rockName(toId)}</div>
        ${toMins.map(m => `<div class="matter-mineral-dot"><span class="m-dot"></span><span class="m-name">${m}</span></div>`).join('')}
      </div>
    </div>
    <p class="matter-note-text">${t(matterKey || '')}</p>
  `;
}

// ── Cycle Diagram ─────────────────────────────────────────────────────────────

// Node positions in a 240 × 200 viewBox
// labelKey = translation key for the node label (resolved via t() at render time)
const DIAGRAM_NODES = {
  magma:       { x: 120, y: 24,  r: 18, labelKey: 'rockMagma',    color: '#FF4500', textColor: '#fff' },
  igneous:     { x: 196, y: 90,  r: 22, labelKey: 'typeIgneous',  color: '#E85D3A', textColor: '#fff' },
  metamorphic: { x: 170, y: 177, r: 22, labelKey: 'typeMetamorphic', color: '#7B2D8E', textColor: '#e0c0f0' },
  sedimentary: { x: 70,  y: 177, r: 22, labelKey: 'typeSedimentary', color: '#D4A843', textColor: '#3a2800' },
  sediment:    { x: 44,  y: 90,  r: 18, labelKey: 'rockSediment', color: '#C2B280', textColor: '#3a2800' }
};

// Each entry links a path key to an arrow between two diagram nodes
// curve: +/- offset for the control point perpendicular to the edge
const DIAGRAM_EDGES = [
  { key: 'rock-melting-magma',                     from: 'igneous',     to: 'magma',       color: '#FF6B35', label: 'Melt',      curve: -28 },
  { key: 'magma-crystallization-igneous',           from: 'magma',       to: 'igneous',     color: '#4A90D9', label: 'Cryst.',    curve: 28  },
  { key: 'igneous-weathering-sediment',             from: 'igneous',     to: 'sediment',    color: '#5CAB7D', label: 'Weather',   curve: -22 },
  { key: 'rock-weathering-sediment',                from: 'metamorphic', to: 'sediment',    color: '#5CAB7D', label: 'Weather',   curve: 18  },
  { key: 'sediment-deposition-sedimentary',         from: 'sediment',    to: 'sedimentary', color: '#8B7355', label: 'Deposit',   curve: -16 },
  { key: 'rock-heatAndPressure-metamorphic',        from: 'igneous',     to: 'metamorphic', color: '#C74B50', label: 'Heat+P',    curve: 22  },
  { key: 'sedimentary-heatAndPressure-metamorphic', from: 'sedimentary', to: 'metamorphic', color: '#C74B50', label: 'Heat+P',    curve: -16 },
  { key: 'rock-uplift-surface',                     from: 'metamorphic', to: 'magma',       color: '#6B8E5A', label: 'Uplift',    curve: 30  }
];

function renderCycleDiagram() {
  const container = document.getElementById('cycle-diagram');
  if (!container) return;

  const discovered = state.discoveredPaths;
  const count      = discovered.size;
  const total      = ALL_PATHS.length;

  // Hide empty state, show diagram
  const emptyDiv    = document.getElementById('cycle-diagram-empty');
  const progressDiv = document.getElementById('cycle-diagram-progress');
  if (emptyDiv)    emptyDiv.style.display = count > 0 ? 'none' : '';
  if (progressDiv) progressDiv.style.display = count > 0 ? 'flex' : 'none';

  // Update progress bar (handled by updatePathsCounter in interaction.js)
  // Build or update the SVG
  let svg = document.getElementById('cycle-svg');
  if (!svg) {
    svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.id = 'cycle-svg';
    svg.setAttribute('viewBox', '0 0 240 210');
    svg.setAttribute('width',  '100%');
    svg.setAttribute('height', '100%');
    svg.setAttribute('aria-label', 'Rock cycle diagram');
    container.insertBefore(svg, progressDiv || null);
  }

  // Build SVG content
  let edgesHtml = '';
  DIAGRAM_EDGES.forEach(edge => {
    const a = DIAGRAM_NODES[edge.from];
    const b = DIAGRAM_NODES[edge.to];
    if (!a || !b) return;

    const { sx, sy, ex, ey, cpx, cpy } = computeArrow(a, b, edge.curve);
    const active = discovered.has(edge.key);
    const stroke = active ? edge.color : 'rgba(255,255,255,0.10)';
    const sw     = active ? 2.2 : 1.2;
    const opacity = active ? 1 : 0.5;

    // Arrow path (quadratic bezier)
    const d = `M${sx.toFixed(1)},${sy.toFixed(1)} Q${cpx.toFixed(1)},${cpy.toFixed(1)} ${ex.toFixed(1)},${ey.toFixed(1)}`;

    // Label midpoint: on the curve at t=0.5
    const lx = ((1 - 0.5) * (1 - 0.5) * sx + 2 * (1 - 0.5) * 0.5 * cpx + 0.5 * 0.5 * ex);
    const ly = ((1 - 0.5) * (1 - 0.5) * sy + 2 * (1 - 0.5) * 0.5 * cpy + 0.5 * 0.5 * ey);

    edgesHtml += `
      <path d="${d}" stroke="${stroke}" stroke-width="${sw}" fill="none" stroke-linecap="round"
            opacity="${opacity}" marker-end="url(#arrowhead-${active ? 'on' : 'off'})"
            class="diagram-edge${active ? ' active' : ''}"/>
      ${active ? `<text x="${lx.toFixed(1)}" y="${ly.toFixed(1)}" text-anchor="middle"
                        font-family="monospace" font-size="7" fill="${edge.color}" opacity="0.85"
                        class="diagram-edge-label">${edge.label}</text>` : ''}
    `;
  });

  let nodesHtml = '';
  Object.values(DIAGRAM_NODES).forEach(n => {
    nodesHtml += `
      <circle cx="${n.x}" cy="${n.y}" r="${n.r}" fill="${n.color}" fill-opacity="0.18"
              stroke="${n.color}" stroke-width="1.5"/>
      <text x="${n.x}" y="${n.y}" text-anchor="middle" dominant-baseline="central"
            font-family="sans-serif" font-size="8" font-weight="600"
            fill="${n.textColor || '#fff'}" opacity="0.90">${t(n.labelKey)}</text>
    `;
  });

  // Completion celebration: glow pulse on all nodes when all paths found
  const celebClass = count === total ? ' diagram-complete' : '';

  svg.innerHTML = `
    <defs>
      <marker id="arrowhead-on"  markerWidth="8" markerHeight="6" refX="7" refY="3" orient="auto">
        <polygon points="0 0, 8 3, 0 6" fill="context-stroke" opacity="0.9"/>
      </marker>
      <marker id="arrowhead-off" markerWidth="8" markerHeight="6" refX="7" refY="3" orient="auto">
        <polygon points="0 0, 8 3, 0 6" fill="rgba(255,255,255,0.12)"/>
      </marker>
    </defs>
    <g class="diagram-edges${celebClass}">${edgesHtml}</g>
    <g class="diagram-nodes${celebClass}">${nodesHtml}</g>
  `;

  if (count === total) {
    showCompletionCelebration();
  }
}

// Compute quadratic bezier start/end/control points for an arrow between nodes
function computeArrow(a, b, curvature) {
  const dx  = b.x - a.x;
  const dy  = b.y - a.y;
  const len = Math.sqrt(dx * dx + dy * dy) || 1;
  const ndx = dx / len;
  const ndy = dy / len;

  // Perpendicular direction for curve offset
  const px = -ndy;
  const py =  ndx;

  const sx = a.x + a.r * ndx;
  const sy = a.y + a.r * ndy;
  const ex = b.x - (b.r + 4) * ndx;  // +4 to account for arrowhead
  const ey = b.y - (b.r + 4) * ndy;

  // Control point: midpoint + perpendicular offset
  const mx  = (sx + ex) / 2 + px * curvature;
  const my  = (sy + ey) / 2 + py * curvature;

  return { sx, sy, ex, ey, cpx: mx, cpy: my };
}

function showCompletionCelebration() {
  const counter = document.getElementById('paths-counter');
  if (counter) {
    counter.classList.add('complete', 'celebrate');
    setTimeout(() => counter.classList.remove('celebrate'), 1200);
  }
}

// ── Helpers ───────────────────────────────────────────────────────────────────

function getProcessColor(processId) {
  const map = {
    melting:        '#FF6B35',
    crystallization:'#4A90D9',
    weathering:     '#5CAB7D',
    deposition:     '#8B7355',
    heatAndPressure:'#C74B50',
    uplift:         '#6B8E5A'
  };
  return map[processId] || 'var(--text-secondary)';
}
