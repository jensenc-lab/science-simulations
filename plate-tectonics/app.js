'use strict';

/* ── Boundary hotspot data ──────────────────────────────────────
   mapX / mapY are percentages of canvas width / height.
   These will be used by map.js to position clickable hotspots.
─────────────────────────────────────────────────────────────── */
const boundaries = [
  {
    name: 'Himalayas',
    type: 'convergent',
    subtype: 'Continental–Continental',
    plates: ['Indo-Australian Plate', 'Eurasian Plate'],
    description: 'Two continental plates collide head-on. Neither can subduct because both are low-density rock, so the crust crumples and thickens, pushing up the world\'s highest mountain range.',
    surfaceFeatures: ['Himalayan Mountain Range', 'Tibetan High Plateau', 'Fold mountains', 'No volcanoes'],
    mapX: 66, mapY: 33,
  },
  {
    name: 'Andes Mountains',
    type: 'convergent',
    subtype: 'Oceanic–Continental',
    plates: ['Nazca Plate', 'South American Plate'],
    description: 'The denser oceanic Nazca Plate subducts beneath the lighter South American plate. Water released from the sinking plate lowers the mantle\'s melting point, generating magma that fuels a volcanic arc.',
    surfaceFeatures: ['Andes Mountain Range', 'Volcanic arc', 'Peru–Chile Trench (offshore)', 'Frequent earthquakes'],
    mapX: 22, mapY: 60,
  },
  {
    name: 'Mid-Atlantic Ridge',
    type: 'divergent',
    subtype: 'Oceanic–Oceanic',
    plates: ['North American Plate', 'Eurasian Plate'],
    description: 'Two oceanic plates pull apart. Hot mantle rock rises to fill the gap, cools, and solidifies as new seafloor. This seafloor spreading widens the Atlantic Ocean by about 2.5 cm per year.',
    surfaceFeatures: ['Underwater mountain ridge', 'Central rift valley', 'Iceland (volcanic island)', 'Hydrothermal vents'],
    mapX: 42, mapY: 30,
  },
  {
    name: 'East African Rift',
    type: 'divergent',
    subtype: 'Continental–Continental',
    plates: ['African Plate (splitting into Somali and Nubian sub-plates)'],
    description: 'A continental plate is being pulled apart by mantle convection. The crust stretches and drops, forming a rift valley. Continued rifting over millions of years may eventually split Africa and open a new ocean.',
    surfaceFeatures: ['Great Rift Valley', 'Chain of deep lakes (Tanganyika, Malawi)', 'Active volcanoes (Kilimanjaro)', 'Hot springs'],
    mapX: 58, mapY: 52,
  },
  {
    name: 'San Andreas Fault',
    type: 'transform',
    subtype: 'Continental–Continental',
    plates: ['Pacific Plate', 'North American Plate'],
    description: 'Two plates grind horizontally past each other — the Pacific Plate moves northwest, the North American Plate moves southeast. Stick-slip motion builds then releases elastic strain energy as earthquakes. No magma is produced.',
    surfaceFeatures: ['Linear fault valley', 'Offset stream channels', 'Linear ridges and sag ponds', 'Frequent earthquakes'],
    mapX: 11, mapY: 32,
  },
  {
    name: 'Mariana Trench',
    type: 'convergent',
    subtype: 'Oceanic–Oceanic',
    plates: ['Pacific Plate', 'Philippine Plate'],
    description: 'The older, denser Pacific Plate subducts beneath the younger Philippine Plate, creating the deepest point on Earth — Challenger Deep at ~11 km. A volcanic island arc forms above the subducting slab.',
    surfaceFeatures: ['Mariana Trench (deepest ocean point)', 'Mariana Islands volcanic arc', 'Intense seismic activity'],
    mapX: 80, mapY: 38,
  },
  {
    name: 'Cascadia Subduction Zone',
    type: 'convergent',
    subtype: 'Oceanic–Continental',
    plates: ['Juan de Fuca Plate', 'North American Plate'],
    description: 'The small Juan de Fuca oceanic plate subducts beneath the North American continent, driving volcanic activity in the Cascade Range. The locked zone between the plates stores energy for potential megathrust earthquakes.',
    surfaceFeatures: ['Cascade Volcanic Arc (Mt. St. Helens, Mt. Rainier)', 'Offshore accretionary wedge', 'Megathrust earthquake potential'],
    mapX: 10, mapY: 26,
  },
];

/* ── State ──────────────────────────────────────────────────── */
let activeFilter     = 'all';
let selectedBoundary = null;

/* ── Standard badge popup ───────────────────────────────────── */
function togglePopup() {
  document.getElementById('stdPopup').classList.toggle('show');
}

// Close popup when clicking outside the badge area
document.addEventListener('click', e => {
  if (!e.target.closest('.badge-wrap')) {
    document.getElementById('stdPopup').classList.remove('show');
  }
});

/* ── Filter ─────────────────────────────────────────────────── */
function setFilter(type) {
  activeFilter = type;
  document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.filter === type);
  });
  // map.js will call tectonics.activeFilter() when it re-renders hotspots
}

/* ── Select & display a boundary ───────────────────────────────
   Called by map.js when the user clicks a hotspot.
─────────────────────────────────────────────────────────────── */
function selectBoundary(boundary) {
  selectedBoundary = boundary;
  const panel = document.getElementById('crossSection');

  const featureItems = boundary.surfaceFeatures
    .map(f => `<li>${f}</li>`)
    .join('');

  panel.innerHTML = `
    <div class="boundary-header">
      <span class="boundary-name">${boundary.name}</span>
      <span class="type-badge ${boundary.type}">${boundary.type}</span>
      <span class="subtype-text">${boundary.subtype}</span>
    </div>
    <p class="plates-row">Plates: <span>${boundary.plates.join(' &amp; ')}</span></p>
    <p class="description">${boundary.description}</p>
    <p class="features-label">Surface Features</p>
    <ul class="features-list">${featureItems}</ul>
  `;
}

/* ── Public API consumed by map.js ─────────────────────────── */
window.tectonics = {
  boundaries,
  activeFilter: () => activeFilter,
  selectBoundary,
};
