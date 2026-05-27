// cell-renderer.js — renders the animal/plant cell SVG diagrams and
// handles click/keyboard interactions for each organelle.
// Selecting an organelle adds a `.selected` class and dispatches an
// `organelle-selected` CustomEvent on `document` so other modules can
// react. Info-panel wiring is added in Chunk A3.

(function () {
  'use strict';

  // ---- Reusable shape fragments -----------------------------------------
  // Each fragment is positioned at (0,0); the caller wraps it in a <g>
  // with a translate/rotate transform. The first <ellipse> in each
  // fragment carries data-outline so CSS can re-style it when selected.

  const MITO_SHAPE = `
    <ellipse cx="0" cy="0" rx="40" ry="20" fill="var(--c-mitochondria)" stroke="var(--c-mitochondria-dark)" stroke-width="2" data-outline="true"/>
    <path d="M -28 -8 Q 0 -3 28 -8" fill="none" stroke="var(--c-mitochondria-dark)" stroke-width="1.6" stroke-linecap="round"/>
    <path d="M -30 0 Q 0 6 30 0" fill="none" stroke="var(--c-mitochondria-dark)" stroke-width="1.6" stroke-linecap="round"/>
    <path d="M -28 9 Q 0 14 28 9" fill="none" stroke="var(--c-mitochondria-dark)" stroke-width="1.6" stroke-linecap="round"/>
  `;

  const CHLORO_SHAPE = `
    <ellipse cx="0" cy="0" rx="35" ry="18" fill="var(--c-chloroplast)" stroke="var(--c-chloroplast-dark)" stroke-width="2" data-outline="true"/>
    <ellipse cx="-16" cy="0" rx="5" ry="9" fill="var(--c-chloroplast-dark)"/>
    <ellipse cx="0"   cy="0" rx="5" ry="9" fill="var(--c-chloroplast-dark)"/>
    <ellipse cx="16"  cy="0" rx="5" ry="9" fill="var(--c-chloroplast-dark)"/>
  `;

  function mito(x, y, rot) {
    return `<g transform="translate(${x} ${y}) rotate(${rot})">${MITO_SHAPE}</g>`;
  }

  function chloro(x, y, rot) {
    return `<g transform="translate(${x} ${y}) rotate(${rot})">${CHLORO_SHAPE}</g>`;
  }

  // ---- Cell templates ----------------------------------------------------
  // Organic blob path used for both the cytoplasm fill and the cell membrane
  // stroke of the animal cell (same path = perfectly aligned outline).
  const ANIMAL_BLOB =
    'M 520 240 ' +
    'C 530 320, 475 395, 395 415 ' +
    'C 340 432, 270 436, 200 420 ' +
    'C 115 400, 60 340, 58 255 ' +
    'C 55 175, 100 105, 180 75 ' +
    'C 245 55, 320 55, 392 75 ' +
    'C 472 95, 522 165, 520 240 Z';

  const ANIMAL_CELL_SVG = `
<svg viewBox="0 0 600 500" preserveAspectRatio="xMidYMid meet" role="img" aria-label="Animal cell diagram showing nucleus, mitochondria, and cell membrane" xmlns="http://www.w3.org/2000/svg">

  <!-- 1. Cytoplasm fill (not interactive) -->
  <path d="${ANIMAL_BLOB}" fill="var(--c-cytoplasm)"/>

  <!-- 2. Cell membrane (the entire outer boundary) -->
  <g class="organelle" data-organelle="cell-membrane" role="button" tabindex="0" aria-label="Cell membrane">
    <title>Cell membrane</title>
    <path d="${ANIMAL_BLOB}" fill="none" stroke="var(--c-membrane)" stroke-width="6" stroke-linejoin="round" data-outline="true"/>
  </g>

  <!-- 3. Mitochondria (5 scattered) -->
  <g class="organelle" data-organelle="mitochondria" role="button" tabindex="0" aria-label="Mitochondria">
    <title>Mitochondria</title>
    ${mito(150, 130, -15)}
    ${mito(450, 140,  25)}
    ${mito(140, 370,  35)}
    ${mito(450, 370, -25)}
    ${mito(125, 255,  78)}
  </g>

  <!-- 4. Nucleus -->
  <g class="organelle" data-organelle="nucleus" role="button" tabindex="0" aria-label="Nucleus">
    <title>Nucleus</title>
    <circle cx="300" cy="245" r="90" fill="var(--c-nucleus)" stroke="var(--c-nucleus-dark)" stroke-width="3" data-outline="true"/>
    <circle cx="282" cy="228" r="22" fill="var(--c-nucleus-dark)"/>
  </g>

</svg>
  `.trim();

  const PLANT_CELL_SVG = `
<svg viewBox="0 0 600 500" preserveAspectRatio="xMidYMid meet" role="img" aria-label="Plant cell diagram showing nucleus, mitochondria, chloroplasts, cell membrane, and cell wall" xmlns="http://www.w3.org/2000/svg">

  <!-- 1. Cell wall (thick outer rectangle) -->
  <g class="organelle" data-organelle="cell-wall" role="button" tabindex="0" aria-label="Cell wall">
    <title>Cell wall</title>
    <rect x="30" y="30" width="540" height="440" rx="22" ry="22" fill="var(--c-cellwall)" data-outline="true"/>
  </g>

  <!-- 2. Cell membrane (smaller rounded rect, gap of ~15px from wall) -->
  <g class="organelle" data-organelle="cell-membrane" role="button" tabindex="0" aria-label="Cell membrane">
    <title>Cell membrane</title>
    <rect x="50" y="50" width="500" height="400" rx="16" ry="16" fill="none" stroke="var(--c-membrane)" stroke-width="4" data-outline="true"/>
  </g>

  <!-- 3. Cytoplasm fill (not interactive) -->
  <rect x="54" y="54" width="492" height="392" rx="13" ry="13" fill="var(--c-cytoplasm-plant)"/>

  <!-- 4. Chloroplasts (5 scattered) -->
  <g class="organelle" data-organelle="chloroplast" role="button" tabindex="0" aria-label="Chloroplasts">
    <title>Chloroplasts</title>
    ${chloro(115, 110, -20)}
    ${chloro(260, 100,  20)}
    ${chloro(490, 120, -30)}
    ${chloro(140, 410,  15)}
    ${chloro(295, 415, -10)}
  </g>

  <!-- 5. Mitochondria (3 scattered) -->
  <g class="organelle" data-organelle="mitochondria" role="button" tabindex="0" aria-label="Mitochondria">
    <title>Mitochondria</title>
    ${mito(130, 240,  80)}
    ${mito(500, 320, -70)}
    ${mito(490, 410,  20)}
  </g>

  <!-- 6. Nucleus (positioned away from chloroplasts/mitochondria) -->
  <g class="organelle" data-organelle="nucleus" role="button" tabindex="0" aria-label="Nucleus">
    <title>Nucleus</title>
    <circle cx="375" cy="265" r="80" fill="var(--c-nucleus)" stroke="var(--c-nucleus-dark)" stroke-width="3" data-outline="true"/>
    <circle cx="358" cy="250" r="20" fill="var(--c-nucleus-dark)"/>
  </g>

</svg>
  `.trim();

  // ---- Renderer state ---------------------------------------------------
  let container = null;
  let currentCellType = null;
  let selectedOrganelle = null;

  function attachInteractions() {
    if (!container) return;
    container.querySelectorAll('.organelle').forEach(el => {
      const id = el.getAttribute('data-organelle');
      el.addEventListener('click', () => handleActivate(id));
      el.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ' || e.key === 'Spacebar') {
          e.preventDefault();
          handleActivate(id);
        }
      });
    });
  }

  function handleActivate(organelleId) {
    CellRenderer.select(organelleId);
    document.dispatchEvent(new CustomEvent('organelle-selected', {
      detail: { organelle: organelleId, cellType: currentCellType }
    }));
  }

  // ---- Public API -------------------------------------------------------
  const CellRenderer = {
    init(el) {
      container = el;
    },

    render(cellType) {
      if (!container) return;
      currentCellType = cellType;
      container.innerHTML = cellType === 'plant' ? PLANT_CELL_SVG : ANIMAL_CELL_SVG;
      attachInteractions();

      // Preserve selection if the organelle exists in the new cell type.
      if (selectedOrganelle) {
        const existing = container.querySelector(
          '.organelle[data-organelle="' + selectedOrganelle + '"]'
        );
        if (existing) {
          existing.classList.add('selected');
        } else {
          selectedOrganelle = null;
        }
      }
    },

    select(organelleId) {
      if (!container) return;
      container.querySelectorAll('.organelle').forEach(el => el.classList.remove('selected'));
      const target = container.querySelector(
        '.organelle[data-organelle="' + organelleId + '"]'
      );
      if (target) {
        target.classList.add('selected');
        selectedOrganelle = organelleId;
      }
    },

    clearSelection() {
      if (!container) return;
      container.querySelectorAll('.organelle').forEach(el => el.classList.remove('selected'));
      selectedOrganelle = null;
    },

    // Returns the raw SVG markup for the given cell type. Used by SystemSim
    // to mount its own copy of the cell with its own click handlers.
    getSVG(cellType) {
      return cellType === 'plant' ? PLANT_CELL_SVG : ANIMAL_CELL_SVG;
    }
  };

  window.CellRenderer = CellRenderer;
})();
