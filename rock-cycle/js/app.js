// ── app.js ────────────────────────────────────────────────────────────────────
// Rock Cycle Lab — Utah SEEd 7.2.1
// App initialization, state management, UI rendering

'use strict';

// ── App State ─────────────────────────────────────────────────────────────────

const state = {
  currentSpecimen:        null,   // id of rock/material currently displayed
  transformationHistory:  [],     // [{from, process, to, timestamp}]
  discoveredPaths:        new Set(),
  mode:                   'free-explore',
  guidedStep:             0,
  language:               'en',
  isAnimating:            false
};

const ALL_PATHS = [
  'rock-melting-magma',
  'magma-crystallization-igneous',
  'rock-weathering-sediment',
  'sediment-deposition-sedimentary',
  'rock-heatAndPressure-metamorphic',
  'igneous-weathering-sediment',
  'sedimentary-heatAndPressure-metamorphic',
  'rock-uplift-surface'
];

// ── SVG Rock Illustrations ────────────────────────────────────────────────────
// Returns an SVG string for each rock. size = 'small' (44×36) or 'large' (140×140)

function getRockSVG(rockId, size = 'small') {
  const isLarge = size === 'large';
  const w = isLarge ? 140 : 44;
  const h = isLarge ? 140 : 36;
  const cx = w / 2;
  const cy = h / 2;
  const s = isLarge ? 3.2 : 1; // scale multiplier for detail elements

  const svgs = {

    // ── GRANITE: speckled pink/white/dark (coarse-grained) ───────────────────
    granite: () => {
      const base = '#C4B5A2';
      const speckleData = isLarge
        ? [[30,28,'#e8d8c8',4],[55,45,'#5c4a38',3],[80,30,'#d4c4b0',3],[100,55,'#7a6a5a',2.5],[70,80,'#e0d0bc',3.5],[40,75,'#6a5a48',2],[110,70,'#c0b0a0',3],[55,100,'#8a7a6a',2.5],[90,110,'#d8c8b4',3],[35,112,'#5a4a38',2],[115,35,'#b8a898',2.5],[65,55,'#f0e0cc',2],[45,55,'#4a3a28',2.5],[105,90,'#c8b8a4',3],[75,115,'#786858',2]]
        : [[10,10,'#e8d8c8',1.5],[18,8,'#5c4a38',1],[28,14,'#d4c4b0',1.2],[14,22,'#7a6a5a',1],[35,18,'#f0e0cc',1.5],[22,28,'#4a3a28',1],[6,28,'#c0b0a0',1.2]];

      return `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">
  <defs>
    <clipPath id="gc-${size}">
      <ellipse cx="${cx}" cy="${cy}" rx="${cx*0.88}" ry="${cy*0.82}"/>
    </clipPath>
  </defs>
  <ellipse cx="${cx}" cy="${cy}" rx="${cx*0.88}" ry="${cy*0.82}" fill="${base}" stroke="#a09080" stroke-width="${isLarge?1.5:0.8}"/>
  <g clip-path="url(#gc-${size})">
    ${speckleData.map(([x,y,c,r]) => `<circle cx="${x}" cy="${y}" r="${r}" fill="${c}" opacity="0.85"/>`).join('')}
    ${isLarge ? `<ellipse cx="60" cy="50" rx="18" ry="12" fill="#b8a890" opacity="0.3" transform="rotate(-20,60,50)"/>` : ''}
  </g>
</svg>`;
    },

    // ── BASALT: dark, dense, tiny dots ───────────────────────────────────────
    basalt: () => {
      const base = '#3A3A3A';
      const dotData = isLarge
        ? [[35,30,1.2],[70,25,0.8],[105,40,1],[50,60,0.9],[85,55,1.1],[115,70,0.8],[40,85,1],[75,90,0.8],[105,95,1.2],[55,115,0.9],[90,120,1],[30,110,0.8],[120,50,0.9],[65,45,0.7],[45,55,1]]
        : [[8,10,0.6],[18,8,0.5],[30,12,0.6],[12,22,0.5],[25,20,0.6],[35,28,0.5],[15,30,0.6]];
      return `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">
  <defs>
    <clipPath id="ba-${size}">
      <path d="M${cx*0.18},${cy*0.38} Q${cx*0.12},${cy*0.06} ${cx*0.65},${cy*0.06} Q${cx*1.82},${cy*0.04} ${cx*1.88},${cy*0.52} Q${cx*1.96},${cy*1.3} ${cx*1.72},${cy*1.74} Q${cx*1.2},${cy*1.96} ${cx*0.52},${cy*1.94} Q${cx*0.08},${cy*1.88} ${cx*0.1},${cy*1.44} Z"/>
    </clipPath>
  </defs>
  <path d="M${cx*0.18},${cy*0.38} Q${cx*0.12},${cy*0.06} ${cx*0.65},${cy*0.06} Q${cx*1.82},${cy*0.04} ${cx*1.88},${cy*0.52} Q${cx*1.96},${cy*1.3} ${cx*1.72},${cy*1.74} Q${cx*1.2},${cy*1.96} ${cx*0.52},${cy*1.94} Q${cx*0.08},${cy*1.88} ${cx*0.1},${cy*1.44} Z" fill="${base}" stroke="#252525" stroke-width="${isLarge?1.5:0.7}"/>
  <g clip-path="url(#ba-${size})">
    ${dotData.map(([x,y,r]) => `<circle cx="${x}" cy="${y}" r="${r}" fill="#505050" opacity="0.6"/>`).join('')}
    ${isLarge ? `<ellipse cx="${cx*0.7}" cy="${cy*0.8}" rx="20" ry="10" fill="#282828" opacity="0.4" transform="rotate(15,${cx*0.7},${cy*0.8})"/>` : ''}
  </g>
</svg>`;
    },

    // ── OBSIDIAN: glossy glass with highlight ────────────────────────────────
    obsidian: () => {
      return `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">
  <defs>
    <clipPath id="ob-${size}">
      <path d="M${cx*0.55},${cy*0.06} L${cx*1.78},${cy*0.16} L${cx*1.94},${cy*0.74} L${cx*1.72},${cy*1.84} L${cx*0.78},${cy*1.96} L${cx*0.06},${cy*1.52} L${cx*0.18},${cy*0.62} Z"/>
    </clipPath>
    <linearGradient id="obs-gloss-${size}" x1="20%" y1="10%" x2="80%" y2="90%">
      <stop offset="0%" stop-color="#2a2a40" stop-opacity="1"/>
      <stop offset="40%" stop-color="#0e0e1a" stop-opacity="1"/>
      <stop offset="100%" stop-color="#050508" stop-opacity="1"/>
    </linearGradient>
  </defs>
  <path d="M${cx*0.55},${cy*0.06} L${cx*1.78},${cy*0.16} L${cx*1.94},${cy*0.74} L${cx*1.72},${cy*1.84} L${cx*0.78},${cy*1.96} L${cx*0.06},${cy*1.52} L${cx*0.18},${cy*0.62} Z" fill="url(#obs-gloss-${size})" stroke="#18182e" stroke-width="${isLarge?1.5:0.8}"/>
  <g clip-path="url(#ob-${size})">
    <!-- glossy highlight arc -->
    <path d="M${cx*0.3},${cy*0.3} Q${cx*0.9},${cy*0.1} ${cx*1.4},${cy*0.5}" fill="none" stroke="rgba(255,255,255,0.45)" stroke-width="${isLarge?3:1.5}" stroke-linecap="round"/>
    <path d="M${cx*0.4},${cy*0.5} Q${cx*0.85},${cy*0.38} ${cx*1.2},${cy*0.7}" fill="none" stroke="rgba(255,255,255,0.18)" stroke-width="${isLarge?2:0.8}" stroke-linecap="round"/>
    ${isLarge ? `<path d="M25,100 L60,115 L90,95" fill="none" stroke="rgba(255,255,255,0.06)" stroke-width="1.5" stroke-linecap="round"/>` : ''}
  </g>
</svg>`;
    },

    // ── SANDSTONE: horizontal wavy layers ────────────────────────────────────
    sandstone: () => {
      const layers = isLarge
        ? [['#D4A574',0],['#C89050',0.22],['#E0B880',0.38],['#B87840',0.55],['#D0A060',0.68],['#C08848',0.80]]
        : [['#D4A574',0],['#C89050',0.28],['#E0B880',0.50],['#B87840',0.72]];
      const totalH = isLarge ? 140 : 36;
      const totalW = isLarge ? 140 : 44;

      return `<svg xmlns="http://www.w3.org/2000/svg" width="${totalW}" height="${totalH}" viewBox="0 0 ${totalW} ${totalH}">
  <defs>
    <clipPath id="ss-${size}">
      <ellipse cx="${totalW/2}" cy="${totalH/2}" rx="${totalW*0.44}" ry="${totalH*0.44}"/>
    </clipPath>
  </defs>
  <ellipse cx="${totalW/2}" cy="${totalH/2}" rx="${totalW*0.44}" ry="${totalH*0.44}" fill="${layers[0][0]}" stroke="#b08040" stroke-width="${isLarge?1.2:0.7}"/>
  <g clip-path="url(#ss-${size})">
    ${layers.slice(1).map(([c, frac], i) => {
      const y = totalH * frac;
      const amp = isLarge ? 5 : 1.5;
      const freq = isLarge ? 30 : 10;
      return `<path d="M0,${y} Q${freq},${y-amp} ${freq*2},${y} Q${freq*3},${y+amp} ${freq*4},${y} Q${freq*5},${y-amp} ${totalW},${y} L${totalW},${totalH} L0,${totalH} Z" fill="${c}" opacity="0.7"/>`;
    }).join('')}
  </g>
</svg>`;
    },

    // ── LIMESTONE: pale with tiny fossil spirals ──────────────────────────────
    limestone: () => {
      const fossils = isLarge
        ? [[40,35,8],[90,60,6],[55,95,7],[110,80,5],[75,120,6],[30,100,5],[115,30,6]]
        : [[12,12,3],[30,20,2.5],[22,28,2]];
      const totalW = isLarge ? 140 : 44;
      const totalH = isLarge ? 140 : 36;

      return `<svg xmlns="http://www.w3.org/2000/svg" width="${totalW}" height="${totalH}" viewBox="0 0 ${totalW} ${totalH}">
  <defs>
    <clipPath id="ls-${size}">
      <ellipse cx="${totalW/2}" cy="${totalH/2}" rx="${totalW*0.44}" ry="${totalH*0.44}"/>
    </clipPath>
  </defs>
  <ellipse cx="${totalW/2}" cy="${totalH/2}" rx="${totalW*0.44}" ry="${totalH*0.44}" fill="#E8DCC8" stroke="#c8b898" stroke-width="${isLarge?1.2:0.7}"/>
  <g clip-path="url(#ls-${size})">
    ${fossils.map(([fx,fy,fr]) => `
    <path d="M${fx},${fy} m${fr},0 a${fr},${fr} 0 1,0 -${fr*2},0 a${fr},${fr} 0 1,0 ${fr*2},0" fill="none" stroke="#b0a080" stroke-width="${isLarge?1:0.5}" opacity="0.6"/>
    <path d="M${fx},${fy} m${fr*0.55},0 a${fr*0.55},${fr*0.55} 0 1,0 -${fr*1.1},0 a${fr*0.55},${fr*0.55} 0 1,0 ${fr*1.1},0" fill="none" stroke="#b0a080" stroke-width="${isLarge?0.8:0.4}" opacity="0.5"/>
    `).join('')}
  </g>
</svg>`;
    },

    // ── SHALE: thin parallel horizontal lines ────────────────────────────────
    shale: () => {
      const totalW = isLarge ? 140 : 44;
      const totalH = isLarge ? 140 : 36;
      const lineCount = isLarge ? 18 : 7;
      const lines = Array.from({length: lineCount}, (_, i) => {
        const y = (totalH / (lineCount + 1)) * (i + 1);
        const shade = i % 2 === 0 ? '#6a6a6a' : '#4a4a4a';
        return `<line x1="0" y1="${y}" x2="${totalW}" y2="${y}" stroke="${shade}" stroke-width="${isLarge?1.5:0.8}" opacity="0.65"/>`;
      });
      return `<svg xmlns="http://www.w3.org/2000/svg" width="${totalW}" height="${totalH}" viewBox="0 0 ${totalW} ${totalH}">
  <defs>
    <clipPath id="sh-${size}">
      <rect x="${totalW*0.05}" y="${totalH*0.06}" width="${totalW*0.9}" height="${totalH*0.88}" rx="${isLarge?8:4}" ry="${isLarge?6:3}"/>
    </clipPath>
  </defs>
  <rect x="${totalW*0.05}" y="${totalH*0.06}" width="${totalW*0.9}" height="${totalH*0.88}" rx="${isLarge?8:4}" ry="${isLarge?6:3}" fill="#5C5C5C" stroke="#3a3a3a" stroke-width="${isLarge?1.2:0.7}"/>
  <g clip-path="url(#sh-${size})">
    ${lines.join('')}
  </g>
</svg>`;
    },

    // ── MARBLE: white with swirling gray veins ────────────────────────────────
    marble: () => {
      const totalW = isLarge ? 140 : 44;
      const totalH = isLarge ? 140 : 36;
      return `<svg xmlns="http://www.w3.org/2000/svg" width="${totalW}" height="${totalH}" viewBox="0 0 ${totalW} ${totalH}">
  <defs>
    <clipPath id="ma-${size}">
      <ellipse cx="${totalW/2}" cy="${totalH/2}" rx="${totalW*0.44}" ry="${totalH*0.44}"/>
    </clipPath>
  </defs>
  <ellipse cx="${totalW/2}" cy="${totalH/2}" rx="${totalW*0.44}" ry="${totalH*0.44}" fill="#F0EDE8" stroke="#d0cdc8" stroke-width="${isLarge?1.2:0.7}"/>
  <g clip-path="url(#ma-${size})">
    ${isLarge ? `
    <path d="M20,20 Q50,60 80,40 Q110,20 130,70 Q110,110 80,100 Q50,90 30,120" fill="none" stroke="#b0a898" stroke-width="2.5" opacity="0.55"/>
    <path d="M10,80 Q40,50 70,80 Q100,110 130,80" fill="none" stroke="#c0b8b0" stroke-width="1.8" opacity="0.4"/>
    <path d="M30,10 Q60,40 50,80 Q40,115 70,130" fill="none" stroke="#9a9088" stroke-width="1.5" opacity="0.35"/>
    <path d="M80,20 Q100,50 90,90 Q80,130 110,140" fill="none" stroke="#b8b0a8" stroke-width="1.5" opacity="0.3"/>
    ` : `
    <path d="M5,8 Q15,18 25,12 Q35,6 40,20 Q35,30 22,28" fill="none" stroke="#b0a898" stroke-width="1.2" opacity="0.55"/>
    <path d="M2,22 Q12,14 22,24 Q32,34 40,22" fill="none" stroke="#c0b8b0" stroke-width="0.8" opacity="0.4"/>
    `}
  </g>
</svg>`;
    },

    // ── SLATE: smooth flat shape with subtle diagonal lines ──────────────────
    slate: () => {
      const totalW = isLarge ? 140 : 44;
      const totalH = isLarge ? 140 : 36;
      const lineCount = isLarge ? 12 : 5;
      const lines = Array.from({length: lineCount}, (_, i) => {
        const y = (totalH / (lineCount + 1)) * (i + 1);
        return `<line x1="${-totalW*0.1}" y1="${y}" x2="${totalW*1.1}" y2="${y - totalH * 0.08}" stroke="#707880" stroke-width="${isLarge?1.2:0.7}" opacity="0.35"/>`;
      });
      return `<svg xmlns="http://www.w3.org/2000/svg" width="${totalW}" height="${totalH}" viewBox="0 0 ${totalW} ${totalH}">
  <defs>
    <clipPath id="sl-${size}">
      <rect x="${totalW*0.04}" y="${totalH*0.06}" width="${totalW*0.92}" height="${totalH*0.88}" rx="${isLarge?6:3}" ry="${isLarge?5:2.5}"/>
    </clipPath>
  </defs>
  <rect x="${totalW*0.04}" y="${totalH*0.06}" width="${totalW*0.92}" height="${totalH*0.88}" rx="${isLarge?6:3}" ry="${isLarge?5:2.5}" fill="#4A5054" stroke="#30383a" stroke-width="${isLarge?1.2:0.7}"/>
  <g clip-path="url(#sl-${size})">
    ${lines.join('')}
    ${isLarge ? `<rect x="0" y="0" width="${totalW}" height="${totalH}" fill="none" stroke="rgba(150,160,170,0.1)" stroke-width="0.5"/>` : ''}
  </g>
</svg>`;
    },

    // ── QUARTZITE: angular/granular, fused look ───────────────────────────────
    quartzite: () => {
      const totalW = isLarge ? 140 : 44;
      const totalH = isLarge ? 140 : 36;
      const grains = isLarge
        ? [[25,25,12,15,'#d0c8bc'],[55,18,10,12,'#c4bbb0'],[85,30,12,10,'#ccc4b8'],[110,20,9,11,'#bab2a6'],[40,55,11,14,'#d8d0c4'],[70,50,13,10,'#c8c0b4'],[100,60,10,12,'#c0b8ac'],[125,50,9,10,'#b8b0a4'],[20,85,11,12,'#ccc0b4'],[50,80,12,11,'#d4ccc0'],[80,90,10,13,'#c4bcb0'],[110,85,11,9,'#bcb4a8'],[35,115,12,10,'#d0c8bc'],[65,110,10,12,'#c8beb2'],[95,115,11,11,'#c0b8ac'],[120,115,9,10,'#b8b0a4']]
        : [[8,8,5,6,'#d0c8bc'],[20,6,5,5,'#c4bbb0'],[32,10,5,5,'#ccc4b8'],[12,20,5,6,'#d8d0c4'],[25,18,5,5,'#c8c0b4'],[36,22,4,5,'#c0b8ac']];
      return `<svg xmlns="http://www.w3.org/2000/svg" width="${totalW}" height="${totalH}" viewBox="0 0 ${totalW} ${totalH}">
  <defs>
    <clipPath id="qt-${size}">
      <path d="M${totalW*0.15},${totalH*0.06} L${totalW*0.82},${totalH*0.04} L${totalW*0.96},${totalH*0.22} L${totalW*0.94},${totalH*0.78} L${totalW*0.82},${totalH*0.96} L${totalW*0.18},${totalH*0.96} L${totalW*0.04},${totalH*0.78} L${totalW*0.06},${totalH*0.22} Z"/>
    </clipPath>
  </defs>
  <path d="M${totalW*0.15},${totalH*0.06} L${totalW*0.82},${totalH*0.04} L${totalW*0.96},${totalH*0.22} L${totalW*0.94},${totalH*0.78} L${totalW*0.82},${totalH*0.96} L${totalW*0.18},${totalH*0.96} L${totalW*0.04},${totalH*0.78} L${totalW*0.06},${totalH*0.22} Z" fill="#C8BEB0" stroke="#a09888" stroke-width="${isLarge?1.2:0.7}"/>
  <g clip-path="url(#qt-${size})">
    ${grains.map(([x,y,rx,ry,c]) => `<ellipse cx="${x}" cy="${y}" rx="${rx}" ry="${ry}" fill="${c}" stroke="#b0a898" stroke-width="${isLarge?0.8:0.4}" opacity="0.6"/>`).join('')}
  </g>
</svg>`;
    }
  };

  return (svgs[rockId] || (() => `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}"><ellipse cx="${cx}" cy="${cy}" rx="${cx*0.8}" ry="${cy*0.8}" fill="#888" stroke="#666" stroke-width="1"/></svg>`))();
}

// ── Rendering: Rock Shelf ─────────────────────────────────────────────────────

function renderRockShelf() {
  const container = document.getElementById('rock-shelf-cards');
  if (!container) return;

  const groups = {
    igneous:     ['granite', 'basalt', 'obsidian'],
    sedimentary: ['sandstone', 'limestone', 'shale'],
    metamorphic: ['marble', 'slate', 'quartzite']
  };

  let html = '';

  for (const [groupType, ids] of Object.entries(groups)) {
    html += `<div class="rock-group-label ${groupType}">${typeName(groupType)}</div>`;
    html += `<div class="rock-group-cards">`;

    for (const id of ids) {
      const rock = ROCKS[id];
      if (!rock) continue;
      const nm = rockName(id);

      html += `
        <div class="rock-card"
             data-rock="${id}"
             data-type="${rock.type}"
             tabindex="0"
             role="button"
             aria-label="${nm}, ${typeName(rock.type)}. Click to view details.">
          <div class="rock-icon">${getRockSVG(id, 'small')}</div>
          <div class="rock-card-info">
            <div class="rock-card-name">${nm}</div>
            <span class="rock-type-badge ${rock.type}">${typeName(rock.type)}</span>
          </div>
        </div>`;
    }

    html += `</div>`;
  }

  container.innerHTML = html;

  // Click handlers
  container.querySelectorAll('.rock-card').forEach(card => {
    card.addEventListener('click', () => selectRock(card.dataset.rock));
    card.addEventListener('keydown', e => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        selectRock(card.dataset.rock);
      }
    });
  });
}

// ── Rendering: Utah Connections ──────────────────────────────────────────────

function renderUtahConnections() {
  const container = document.getElementById('utah-connections-list');
  if (!container) return;

  // Map rock id → translation keys for Utah connection
  const utahKeys = {
    sandstone:  { name: 'utahArches',      desc: 'utahArchesDesc',      loc: 'utahArchesLoc' },
    granite:    { name: 'utahLCC',         desc: 'utahLCCDesc',         loc: 'utahLCCLoc' },
    limestone:  { name: 'utahTimp',        desc: 'utahTimpDesc',        loc: 'utahTimpLoc' },
    shale:      { name: 'utahGreenRiver',  desc: 'utahGreenRiverDesc',  loc: 'utahGreenRiverLoc' },
    quartzite:  { name: 'utahFarmington',  desc: 'utahFarmingtonDesc',  loc: 'utahFarmingtonLoc' }
  };

  container.innerHTML = UTAH_CONNECTIONS.map(conn => {
    const k = utahKeys[conn.rockId];
    const nm = k ? t(k.name) : conn.name;
    const loc = k ? t(k.loc) : conn.location;
    const desc = k ? t(k.desc) : conn.description;
    return `
    <div class="utah-item" data-rock="${conn.rockId}" role="button" tabindex="0"
         aria-label="${nm}">
      <div class="utah-item-name">${nm}</div>
      <div class="utah-item-location">📍 ${loc}</div>
      <div class="utah-item-desc">${desc}</div>
    </div>`;
  }).join('');

  container.querySelectorAll('.utah-item').forEach(item => {
    item.addEventListener('click', () => selectRock(item.dataset.rock));
    item.addEventListener('keydown', e => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        selectRock(item.dataset.rock);
      }
    });
  });
}

// ── Rendering: Process Zones ─────────────────────────────────────────────────

function renderProcessZones() {
  // Zone name + energy label translation
  const energyKeyMap = { sun: 'energySun', 'earth-heat': 'energyEarthHeat', gravity: 'energyGravity', cooling: 'energyCooling', tectonic: 'energyTectonic' };
  document.querySelectorAll('.process-zone').forEach(zone => {
    const processId = zone.dataset.process;
    const transform = TRANSFORMATIONS[processId];
    if (!transform) return;

    // Zone name
    const nameEl = zone.querySelector('.zone-name');
    if (nameEl) nameEl.textContent = processName(processId);

    const energySrc = ENERGY_SOURCES[transform.energySource];
    const energyEl = zone.querySelector('.zone-energy');
    if (energyEl && energySrc) {
      energyEl.textContent = energySrc.icon + ' ' + t(energyKeyMap[energySrc.id] || energySrc.id);
    }
  });
}

// ── Rock Selection ────────────────────────────────────────────────────────────

function selectRock(rockId) {
  const rock = ROCKS[rockId];
  if (!rock) return;

  state.currentSpecimen = rockId;

  // Update shelf selection state
  document.querySelectorAll('.rock-card').forEach(c => {
    c.classList.toggle('selected', c.dataset.rock === rockId);
  });

  // Mark display as having a specimen (used by drag engine)
  const display = document.getElementById('specimen-display');
  if (display) display.dataset.specimen = rockId;

  // Render specimen display
  renderSpecimen(rock);

  // Update explanation panel (panels.js)
  if (typeof updateExplanationPanelOnSelect === 'function') {
    updateExplanationPanelOnSelect(rockId);
  }

  // Update tap-to-transform hints
  if (typeof updateTapHints === 'function') updateTapHints();

  // Guided mode: check step completion on rock selection
  if (typeof onGuidedRockSelect === 'function' && state.mode === 'guided') {
    onGuidedRockSelect(rockId);
  }
}

// ── Rendering: Specimen Display ──────────────────────────────────────────────

function renderSpecimen(rock) {
  const display   = document.getElementById('specimen-display');
  const emptyEl   = document.getElementById('specimen-empty');
  const contentEl = document.getElementById('specimen-content');
  if (!display || !emptyEl || !contentEl) return;

  emptyEl.style.display = 'none';
  contentEl.classList.add('visible');

  // Type-based glow
  display.classList.remove('type-igneous', 'type-sedimentary', 'type-metamorphic');
  display.classList.add(`type-${rock.type}`);

  // Subtype / parent info
  const subtypeKey = { intrusive: 'subtypeIntrusive', extrusive: 'subtypeExtrusive', clastic: 'subtypeClastic', 'chemical/organic': 'subtypeChemOrg' }[rock.subtype];
  const subtypeStr = subtypeKey
    ? t(subtypeKey)
    : rock.parentRock
      ? `${t('specimenFrom')} ${rockName(rock.parentRock)}`
      : '';

  const mineralsStr = rock.minerals.join(' · ');
  const textureT    = t(rock.id + 'Texture');
  const formationT  = t(rock.id + 'Formation');
  const utahT       = t(rock.id + 'Utah');
  const descT       = t(rock.id + 'Desc');

  contentEl.innerHTML = `
    <div class="specimen-svg-wrap">${getRockSVG(rock.id, 'large')}</div>
    <div class="specimen-name">${rockName(rock.id)}</div>
    <div class="specimen-type-row">
      <span class="specimen-badge ${rock.type}">${typeName(rock.type)}</span>
      ${subtypeStr ? `<span class="specimen-badge ${rock.type}" style="opacity:0.7">${subtypeStr}</span>` : ''}
    </div>
    <p class="specimen-desc">${descT}</p>
    <div class="specimen-stats">
      <div class="specimen-stat">
        <div class="specimen-stat-label">${t('propTexture')}</div>
        <div class="specimen-stat-value">${textureT}</div>
      </div>
      <div class="specimen-stat">
        <div class="specimen-stat-label">${t('propGrainSize')}</div>
        <div class="specimen-stat-value">${rock.grainSize ? t({'large':'grainLarge','small':'grainSmall','none':'grainNone','medium':'grainMedium','fine':'grainFine','very fine':'grainVeryFine'}[rock.grainSize] || rock.grainSize) : '—'}</div>
      </div>
    </div>
    <p class="specimen-minerals"><strong style="font-family:var(--font-mono);font-size:0.58rem;letter-spacing:0.08em;text-transform:uppercase;color:var(--text-muted)">${t('propMinerals')}</strong><br>${mineralsStr}</p>
    <div class="specimen-stat" style="width:100%">
      <div class="specimen-stat-label">🏔️ ${t('propUtah')}</div>
      <div class="specimen-stat-value" style="font-size:0.68rem;font-weight:400;line-height:1.4">${utahT}</div>
    </div>
  `;
}

// ── Rendering: Right Panel ────────────────────────────────────────────────────

function renderRightPanel() {
  // Energy tracker — populate items
  const energyKeyMap = { sun: 'energySun', 'earth-heat': 'energyEarthHeat', gravity: 'energyGravity', cooling: 'energyCooling', tectonic: 'energyTectonic' };
  const energyList = document.getElementById('energy-list');
  if (energyList) {
    energyList.innerHTML = Object.values(ENERGY_SOURCES).map(src => `
      <div class="energy-item" data-energy="${src.id}">
        <span class="energy-item-icon">${src.icon}</span>
        <div class="energy-item-info">
          <div class="energy-item-name">${t(energyKeyMap[src.id] || src.id)}</div>
          <div class="energy-item-processes">${src.processes.map(p => processName(p)).join(', ')}</div>
        </div>
        <div class="energy-item-dot"></div>
      </div>
    `).join('');
  }
}

// ── Language Toggle ──────────────────────────────────────────────────────────

function switchLanguage() {
  state.language = state.language === 'en' ? 'es' : 'en';
  reRenderAll();
}

function reRenderAll() {
  // Static header / footer / labels
  updateStaticTextContent();

  // Rock shelf
  renderRockShelf();

  // Utah connections
  renderUtahConnections();

  // Process zones (names + energy labels)
  renderProcessZones();

  // Right panel
  renderRightPanel();

  // Re-select current specimen (triggers renderSpecimen with new language)
  const currentId = state.currentSpecimen;
  if (currentId) {
    if (ROCKS[currentId]) {
      renderSpecimen(ROCKS[currentId]);
      if (typeof updateExplanationPanelOnSelect === 'function') updateExplanationPanelOnSelect(currentId);
    } else if (typeof updateSpecimenDisplay === 'function') {
      updateSpecimenDisplay(currentId);
    }
  }

  // History strip
  if (typeof updateHistoryStrip === 'function') updateHistoryStrip();

  // Cycle diagram / paths counter
  if (typeof renderCycleDiagram === 'function') renderCycleDiagram();
  if (typeof updatePathsCounter === 'function') updatePathsCounter();

  // Update tap hints
  if (typeof updateTapHints === 'function') updateTapHints();

  // Mode-specific UI
  if (state.mode === 'guided' && typeof renderGuidedInstruction === 'function') {
    if (typeof renderProgressDots === 'function') renderProgressDots();
    renderGuidedInstruction();
  }
  // Preset / journey UIs re-render on next state change; full re-render would disrupt playback
}

function updateStaticTextContent() {
  // Header title + subtitle
  const title = document.querySelector('.header-title');
  const sub   = document.querySelector('.header-subtitle');
  if (title) title.innerHTML = '⛏️ ' + t('appTitle');
  if (sub)   sub.textContent = t('appSubtitle');

  // Mode tabs
  document.querySelectorAll('.mode-tab').forEach(tab => {
    const m = tab.dataset.mode;
    const keyMap = { guided: 'modeGuided', 'free-explore': 'modeFreeExplore', 'geo-journey': 'modeGeoJourney', presets: 'modePresets' };
    if (keyMap[m]) tab.textContent = t(keyMap[m]);
  });

  // Lang button
  const lang = document.getElementById('lang-btn');
  if (lang) lang.textContent = t('btnLanguage');

  // Shelf heading
  const shelfHeading = document.querySelector('.shelf-heading');
  if (shelfHeading) shelfHeading.textContent = t('shelfTitle');

  // Utah section toggle
  const utahToggle = document.querySelector('.utah-toggle span:first-child');
  if (utahToggle) utahToggle.textContent = t('utahSectionTitle');

  // Specimen empty text
  const specEmpty = document.querySelector('.specimen-empty-text');
  if (specEmpty) specEmpty.textContent = t('specimenEmptyText');

  // History strip label + clear button + empty message
  const histLabel = document.querySelector('.history-label');
  if (histLabel) histLabel.textContent = t('historyLabel');
  const histClear = document.getElementById('history-clear-btn');
  if (histClear) histClear.setAttribute('title', t('historyClear'));
  const histEmpty = document.querySelector('.history-empty');
  if (histEmpty) histEmpty.textContent = t('historyEmpty');

  // Right panel section titles
  const rpTitles = document.querySelectorAll('.rp-section-title');
  if (rpTitles[0]) rpTitles[0].childNodes[0].nodeValue = t('explanationTitle');
  if (rpTitles[1]) rpTitles[1].childNodes[0].nodeValue = t('energyTitle');
  if (rpTitles[2]) rpTitles[2].childNodes[0].nodeValue = t('matterTitle');
  if (rpTitles[3]) rpTitles[3].childNodes[0].nodeValue = t('cycleTitle') + ' ';

  // Matter tracker default rules
  const matterTracker = document.getElementById('matter-tracker');
  if (matterTracker && !matterTracker.classList.contains('matter-tracker-active')) {
    const spans = matterTracker.querySelectorAll('.matter-rule span:not(.matter-rule-icon)');
    if (spans[0]) spans[0].innerHTML = t('matterRuleAtoms');
    if (spans[1]) spans[1].innerHTML = t('matterRuleMinerals');
    if (spans[2]) spans[2].innerHTML = `<span style="color:var(--text-muted);font-style:italic;">${t('matterRulePrompt')}</span>`;
  }

  // Cycle diagram empty message
  const cycleEmpty = document.getElementById('cycle-diagram-empty');
  if (cycleEmpty) {
    const textNode = Array.from(cycleEmpty.childNodes).find(n => n.nodeType === 3 && n.textContent.trim());
    if (textNode) textNode.textContent = '\n    ' + t('cycleEmpty') + '\n  ';
    else {
      // Rebuild with icon
      cycleEmpty.innerHTML = `<span style="font-size:1.5rem;opacity:0.4" aria-hidden="true">🔁</span><br>${t('cycleEmpty')}`;
    }
  }

  // Footer
  const footerCredit = document.querySelector('.footer-credit');
  if (footerCredit) footerCredit.textContent = t('footerCredit');
  const footerStd = document.querySelector('.footer-standard');
  if (footerStd) footerStd.innerHTML = `${t('footerStandard')} <span>${t('footerStandardName')}</span> ${t('footerSubject')}`;

  // Orientation hint
  const orient = document.querySelector('.orientation-hint-text');
  if (orient) orient.innerHTML = t('orientationHint');
}

// ── Tap Hints: show which zones are tappable ─────────────────────────────────

function updateTapHints() {
  const specimen = state.currentSpecimen;
  document.querySelectorAll('.process-zone').forEach(zone => {
    const processId = zone.dataset.process;
    const tappable = specimen && processId && isValidTransformation(specimen, processId);
    zone.classList.toggle('tap-ready', !!tappable);
  });
}

// ── Mode Tabs & Switching ────────────────────────────────────────────────────

function initModeTabs() {
  document.querySelectorAll('.mode-tab').forEach(tab => {
    tab.addEventListener('click', () => {
      const newMode = tab.dataset.mode;
      if (newMode === state.mode) return;

      document.querySelectorAll('.mode-tab').forEach(t => {
        t.classList.remove('active');
        t.setAttribute('aria-selected', 'false');
      });
      tab.classList.add('active');
      tab.setAttribute('aria-selected', 'true');

      switchMode(newMode);
    });
  });
}

function switchMode(newMode) {
  const oldMode = state.mode;

  // Teardown previous mode
  cleanupModeOverlays();
  if (oldMode === 'guided'      && typeof exitGuidedMode === 'function') exitGuidedMode();
  if (oldMode === 'presets'     && typeof exitPresetMode  === 'function') exitPresetMode();
  if (oldMode === 'geo-journey' && typeof exitJourney     === 'function') exitJourney();

  state.mode = newMode;

  // Setup new mode
  if (newMode === 'guided'      && typeof startGuidedMode    === 'function') startGuidedMode();
  else if (newMode === 'presets' && typeof showPresetSelector === 'function') showPresetSelector();
  else if (newMode === 'geo-journey' && typeof startJourney   === 'function') startJourney();
  // 'free-explore' needs no special init
}

function cleanupModeOverlays() {
  ['#guided-overlay', '#preset-overlay', '#preset-playback', '#coming-soon-overlay', '#journey-overlay'].forEach(sel => {
    const el = document.querySelector(sel);
    if (el) el.remove();
  });
  document.querySelectorAll('.process-zone').forEach(z => z.classList.remove('zone-disabled'));
  document.querySelectorAll('.guided-highlight').forEach(el => el.classList.remove('guided-highlight'));
}

function showComingSoon(modeName) {
  const stage = document.querySelector('.center-stage');
  if (!stage) return;
  const overlay = document.createElement('div');
  overlay.id = 'coming-soon-overlay';
  overlay.className = 'coming-soon-overlay';
  overlay.innerHTML = `
    <div class="coming-soon-content">
      <span class="coming-soon-icon">🚧</span>
      <h3>${modeName}</h3>
      <p>Coming soon! Switch to Free Explore to keep experimenting.</p>
    </div>`;
  stage.appendChild(overlay);
}

// ── Utah Section Toggle ──────────────────────────────────────────────────────

function initUtahToggle() {
  const section = document.getElementById('utah-section');
  const toggle  = document.getElementById('utah-toggle');
  if (!section || !toggle) return;

  toggle.addEventListener('click', () => {
    section.classList.toggle('open');
  });
}

// ── Right Panel Drawer (≤1200px) ─────────────────────────────────────────────

function initRightPanelDrawer() {
  const handle    = document.getElementById('right-panel-handle');
  const rightPanel = document.getElementById('right-panel');
  if (!handle || !rightPanel) return;

  handle.addEventListener('click', () => {
    rightPanel.classList.toggle('open');
    handle.textContent = rightPanel.classList.contains('open') ? '›' : '‹';
  });
}

// ── Init ─────────────────────────────────────────────────────────────────────
// Note: updateHistoryStrip is defined in interaction.js (rich version)

document.addEventListener('DOMContentLoaded', () => {
  renderRockShelf();
  renderUtahConnections();
  renderProcessZones();
  renderRightPanel();
  initModeTabs();
  initUtahToggle();
  initRightPanelDrawer();

  // Initialise drag-and-drop (defined in interaction.js, loaded before app.js)
  if (typeof initDragDrop === 'function') initDragDrop();

  // Render initial empty history strip
  if (typeof updateHistoryStrip === 'function') updateHistoryStrip();

  // Initialise educational panels (panels.js)
  if (typeof initPanels === 'function') initPanels();

  // Update tappable zone hints when specimen changes
  updateTapHints();

  // Language toggle
  const langBtn = document.getElementById('lang-btn');
  if (langBtn) {
    langBtn.addEventListener('click', switchLanguage);
  }
});
