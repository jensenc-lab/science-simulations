// ============================================================
// Conservation of Matter — molecules.js
// SVG ball-and-stick molecule visualizations
//
// Phase 2: Burning Candle (CH₄ + 2O₂ → CO₂ + 2H₂O)
// Other reactions use text-only display in app.js.
// ============================================================

const MolViz = (function () {
  'use strict';

  // ---- ATOM STYLES ----
  // r = circle radius in px
  const ATOMS = {
    C:  { fill: '#333333', textFill: '#ffffff', r: 16, stroke: null },
    H:  { fill: '#f0f0f0', textFill: '#333333', r: 12, stroke: '#999999' },
    O:  { fill: '#e74c3c', textFill: '#ffffff', r: 16, stroke: null },
    Na: { fill: '#8e44ad', textFill: '#ffffff', r: 16, stroke: null },
    Fe: { fill: '#b87333', textFill: '#ffffff', r: 16, stroke: null },
  };

  const NS = 'http://www.w3.org/2000/svg';

  // ---- SVG PRIMITIVE HELPERS ----

  function makeSVG(w, h) {
    const svg = document.createElementNS(NS, 'svg');
    svg.setAttribute('width',   w);
    svg.setAttribute('height',  h);
    svg.setAttribute('viewBox', `0 0 ${w} ${h}`);
    svg.setAttribute('aria-hidden', 'true');
    return svg;
  }

  // Draw a bond (gray line) between two points; circles will render on top
  function bond(svg, x1, y1, x2, y2) {
    const ln = document.createElementNS(NS, 'line');
    ln.setAttribute('x1', x1);  ln.setAttribute('y1', y1);
    ln.setAttribute('x2', x2);  ln.setAttribute('y2', y2);
    ln.setAttribute('stroke',        '#aaaaaa');
    ln.setAttribute('stroke-width',  '4');
    ln.setAttribute('stroke-linecap','round');
    svg.appendChild(ln);
  }

  // Draw an atom circle with element symbol in the center
  function atom(svg, x, y, symbol) {
    const p = ATOMS[symbol] || { fill: '#888', textFill: '#fff', r: 14, stroke: null };

    const circle = document.createElementNS(NS, 'circle');
    circle.setAttribute('cx', x);
    circle.setAttribute('cy', y);
    circle.setAttribute('r',  p.r);
    circle.setAttribute('fill', p.fill);
    if (p.stroke) {
      circle.setAttribute('stroke',       p.stroke);
      circle.setAttribute('stroke-width', '2');
    }
    svg.appendChild(circle);

    const text = document.createElementNS(NS, 'text');
    text.setAttribute('x',                  x);
    text.setAttribute('y',                  y);
    text.setAttribute('text-anchor',       'middle');
    text.setAttribute('dominant-baseline', 'central');
    text.setAttribute('fill',             p.textFill);
    text.setAttribute('font-size',        symbol.length > 1 ? '9' : '11');
    text.setAttribute('font-weight',      'bold');
    text.setAttribute('font-family',      'Segoe UI, system-ui, sans-serif');
    text.setAttribute('pointer-events',   'none');
    text.textContent = symbol;
    svg.appendChild(text);
  }

  // ---- MOLECULE DRAW FUNCTIONS ----
  // Each returns an SVG element with bonds drawn first (behind), then atoms.
  // Coordinates are chosen so no atom circle clips the SVG edge.

  // CH₄  (110 × 110)
  // Carbon center with 4 hydrogens in a + cross pattern
  //   C at (55,55), H at top/right/bottom/left, bond length = 42px
  function drawCH4() {
    const svg = makeSVG(110, 110);
    const [cx, cy, d] = [55, 55, 42];
    bond(svg, cx, cy, cx,     cy - d);   // N
    bond(svg, cx, cy, cx + d, cy    );   // E
    bond(svg, cx, cy, cx,     cy + d);   // S
    bond(svg, cx, cy, cx - d, cy    );   // W
    atom(svg, cx,     cy,     'C');
    atom(svg, cx,     cy - d, 'H');
    atom(svg, cx + d, cy,     'H');
    atom(svg, cx,     cy + d, 'H');
    atom(svg, cx - d, cy,     'H');
    return svg;
  }

  // O₂  (84 × 44)
  // Two oxygen atoms side by side, bond length = 40px
  function drawO2() {
    const svg = makeSVG(84, 44);
    bond(svg, 22, 22, 62, 22);
    atom(svg, 22, 22, 'O');
    atom(svg, 62, 22, 'O');
    return svg;
  }

  // CO₂  (140 × 44)
  // O–C–O linear (O=C=O shown as single sticks for clarity)
  //   O at (20,22), C at (70,22), O at (120,22), bond length = 50px
  function drawCO2() {
    const svg = makeSVG(140, 44);
    bond(svg, 20,  22, 70,  22);
    bond(svg, 70,  22, 120, 22);
    atom(svg, 20,  22, 'O');
    atom(svg, 70,  22, 'C');
    atom(svg, 120, 22, 'O');
    return svg;
  }

  // H₂O  (90 × 80)
  // Bent shape: O at top-center, two H angled below
  //   O at (45,18), H at (15,60) and (75,60)
  function drawH2O() {
    const svg = makeSVG(90, 80);
    bond(svg, 45, 18, 15, 60);
    bond(svg, 45, 18, 75, 60);
    atom(svg, 45, 18, 'O');
    atom(svg, 15, 60, 'H');
    atom(svg, 75, 60, 'H');
    return svg;
  }

  // NaHCO₃  (180 × 104)
  // Na–O1–C backbone (left→right), O2 pointing straight up from C (double bond),
  // O3 angled lower-right from C, H at end of O3.
  //   Na(20,55) – O1(58,55) – C(96,55) – O3(130,81) – H(164,81)
  //                                    └─ O2(96,17) (up)
  function drawNaHCO3() {
    const svg = makeSVG(180, 104);
    // bonds first (rendered behind atoms)
    bond(svg,  20, 55,  58, 55);   // Na – O1
    bond(svg,  58, 55,  96, 55);   // O1 – C
    bond(svg,  96, 55,  96, 17);   // C  – O2 (up, double bond shown as single)
    bond(svg,  96, 55, 130, 81);   // C  – O3 (lower-right)
    bond(svg, 130, 81, 164, 81);   // O3 – H
    // atoms
    atom(svg,  20, 55, 'Na');
    atom(svg,  58, 55, 'O');
    atom(svg,  96, 55, 'C');
    atom(svg,  96, 17, 'O');
    atom(svg, 130, 81, 'O');
    atom(svg, 164, 81, 'H');
    return svg;
  }

  // CH₃COOH  (173 × 109)
  // Methyl carbon C1 (3 H: top, left, bottom) bonded to carboxyl carbon C2.
  // C2 has O2 upper-right (double bond) and O3 lower-right, O3 bonded to H.
  //   H(50,17)/H(14,55)/H(50,93)  around  C1(50,55) – C2(92,55)
  //                                          C2 – O2(122,25)
  //                                          C2 – O3(122,85) – H(157,85)
  function drawCH3COOH() {
    const svg = makeSVG(173, 109);
    // bonds
    bond(svg,  50, 55,  50, 17);   // C1 – H top
    bond(svg,  50, 55,  14, 55);   // C1 – H left
    bond(svg,  50, 55,  50, 93);   // C1 – H bottom
    bond(svg,  50, 55,  92, 55);   // C1 – C2
    bond(svg,  92, 55, 122, 25);   // C2 – O2 (upper-right, double bond shown single)
    bond(svg,  92, 55, 122, 85);   // C2 – O3 (lower-right)
    bond(svg, 122, 85, 157, 85);   // O3 – H
    // atoms
    atom(svg,  50, 17, 'H');
    atom(svg,  14, 55, 'H');
    atom(svg,  50, 93, 'H');
    atom(svg,  50, 55, 'C');
    atom(svg,  92, 55, 'C');
    atom(svg, 122, 25, 'O');
    atom(svg, 122, 85, 'O');
    atom(svg, 157, 85, 'H');
    return svg;
  }

  // NaCH₃COO  (194 × 114)
  // Na–O1–C1(carboxylate) backbone, O2 straight up from C1 (double bond),
  // C2(methyl) to the right of C1, H atoms at top/right/bottom of C2.
  //   Na(20,60) – O1(58,60) – C1(96,60) – C2(140,60)
  //                               └─ O2(96,22) (up)     C2 – H(140,22)/H(178,60)/H(140,98)
  function drawNaCH3COO() {
    const svg = makeSVG(194, 114);
    // bonds
    bond(svg,  20, 60,  58, 60);   // Na  – O1
    bond(svg,  58, 60,  96, 60);   // O1  – C1
    bond(svg,  96, 60,  96, 22);   // C1  – O2 (up, double bond shown single)
    bond(svg,  96, 60, 140, 60);   // C1  – C2
    bond(svg, 140, 60, 140, 22);   // C2  – H top
    bond(svg, 140, 60, 178, 60);   // C2  – H right
    bond(svg, 140, 60, 140, 98);   // C2  – H bottom
    // atoms
    atom(svg,  20, 60, 'Na');
    atom(svg,  58, 60, 'O');
    atom(svg,  96, 60, 'C');
    atom(svg,  96, 22, 'O');
    atom(svg, 140, 60, 'C');
    atom(svg, 140, 22, 'H');
    atom(svg, 178, 60, 'H');
    atom(svg, 140, 98, 'H');
    return svg;
  }

  // 4 Fe  (88 × 88)
  // Four iron atoms in a 2×2 grid with bonds on all four sides.
  // Students can count 4 orange-brown balls clearly.
  //   Fe1(22,22) Fe2(66,22)
  //   Fe3(22,66) Fe4(66,66)
  function draw4Fe() {
    const svg = makeSVG(88, 88);
    // grid bonds (horizontal + vertical, no diagonals for clarity)
    bond(svg, 22, 22, 66, 22);   // top row
    bond(svg, 22, 66, 66, 66);   // bottom row
    bond(svg, 22, 22, 22, 66);   // left col
    bond(svg, 66, 22, 66, 66);   // right col
    // atoms
    atom(svg, 22, 22, 'Fe');
    atom(svg, 66, 22, 'Fe');
    atom(svg, 22, 66, 'Fe');
    atom(svg, 66, 66, 'Fe');
    return svg;
  }

  // Fe₂O₃  (120 × 104)
  // "Ladder" layout: Fe1 left, Fe2 right, three O atoms stacked vertically
  // between them as cross-rungs. Every O bridges both Fe atoms.
  //   Fe1(24,52), Fe2(96,52)
  //   O1(60,20) O2(60,52) O3(60,84)
  function drawFe2O3() {
    const svg = makeSVG(120, 104);
    // bonds — each O connects to both Fe atoms
    bond(svg, 24, 52, 60, 20);   // Fe1 – O1
    bond(svg, 96, 52, 60, 20);   // Fe2 – O1
    bond(svg, 24, 52, 60, 52);   // Fe1 – O2
    bond(svg, 96, 52, 60, 52);   // Fe2 – O2
    bond(svg, 24, 52, 60, 84);   // Fe1 – O3
    bond(svg, 96, 52, 60, 84);   // Fe2 – O3
    // atoms (drawn after bonds so they sit on top)
    atom(svg, 24, 52, 'Fe');
    atom(svg, 96, 52, 'Fe');
    atom(svg, 60, 20, 'O');
    atom(svg, 60, 52, 'O');
    atom(svg, 60, 84, 'O');
    return svg;
  }

  // ---- MOLECULE GROUP BUILDER ----
  // drawFns   : array of draw functions — multiple entries stack vertically
  //             (used to show e.g. 2× O₂ as two stacked diagrams)
  // formulaHTML: label above (HTML, <sub> tags ok)
  // name       : label below (plain text)

  function makeMolGroup(drawFns, formulaHTML, name) {
    const group = document.createElement('div');
    group.className = 'mol-group';

    const fLabel = document.createElement('div');
    fLabel.className = 'molecule-formula';
    fLabel.innerHTML = formulaHTML;
    group.appendChild(fLabel);

    const svgsWrap = document.createElement('div');
    svgsWrap.className = 'mol-svgs';
    drawFns.forEach(fn => svgsWrap.appendChild(fn()));
    group.appendChild(svgsWrap);

    const nLabel = document.createElement('div');
    nLabel.className = 'molecule-name';
    nLabel.textContent = name;
    group.appendChild(nLabel);

    return group;
  }

  // ---- VISUAL ROW BUILDER ----
  // items: [{ drawFns, formula, name }, ...]
  // Returns a .mol-visual-row div with mol-groups and "+" separators between them.

  function buildVisualRow(items) {
    const row = document.createElement('div');
    row.className = 'mol-visual-row';

    items.forEach((item, i) => {
      row.appendChild(makeMolGroup(item.drawFns, item.formula, item.name));
      if (i < items.length - 1) {
        const sep = document.createElement('div');
        sep.className = 'mol-separator';
        sep.textContent = '+';
        row.appendChild(sep);
      }
    });

    return row;
  }

  // ---- REACTION LAYOUT DEFINITIONS ----
  // Each entry has reactants[] and products[] arrays for buildVisualRow().

  const CANDLE_REACTANTS = [
    {
      drawFns: [drawCH4],
      formula: 'CH<sub>4</sub>',
      name:    'Methane',
    },
    {
      drawFns: [drawO2, drawO2],     // two O₂ molecules shown stacked
      formula: '2 O<sub>2</sub>',
      name:    'Oxygen (×2)',
    },
  ];

  const CANDLE_PRODUCTS = [
    {
      drawFns: [drawCO2],
      formula: 'CO<sub>2</sub>',
      name:    'Carbon Dioxide',
    },
    {
      drawFns: [drawH2O, drawH2O],   // two H₂O molecules shown stacked
      formula: '2 H<sub>2</sub>O',
      name:    'Water (×2)',
    },
  ];

  const BAKING_REACTANTS = [
    {
      drawFns: [drawNaHCO3],
      formula: 'NaHCO<sub>3</sub>',
      name:    'Sodium Bicarbonate (Baking Soda)',
    },
    {
      drawFns: [drawCH3COOH],
      formula: 'CH<sub>3</sub>COOH',
      name:    'Acetic Acid (Vinegar)',
    },
  ];

  const BAKING_PRODUCTS = [
    {
      drawFns: [drawNaCH3COO],
      formula: 'NaCH<sub>3</sub>COO',
      name:    'Sodium Acetate',
    },
    {
      drawFns: [drawH2O],
      formula: 'H<sub>2</sub>O',
      name:    'Water',
    },
    {
      drawFns: [drawCO2],
      formula: 'CO<sub>2</sub>',
      name:    'Carbon Dioxide',
    },
  ];

  const RUSTING_REACTANTS = [
    {
      drawFns: [draw4Fe],
      formula: '4 Fe',
      name:    'Iron (×4)',
    },
    {
      drawFns: [drawO2, drawO2, drawO2],   // three O₂ molecules stacked
      formula: '3 O<sub>2</sub>',
      name:    'Oxygen (×3)',
    },
  ];

  const RUSTING_PRODUCTS = [
    {
      drawFns: [drawFe2O3, drawFe2O3],     // two Fe₂O₃ units stacked
      formula: '2 Fe<sub>2</sub>O<sub>3</sub>',
      name:    'Iron Oxide / Rust (×2)',
    },
  ];

  // Lookup map — keyed by the reactionKey values used in app.js
  const REACTION_LAYOUTS = {
    burningCandle:      { reactants: CANDLE_REACTANTS,  products: CANDLE_PRODUCTS  },
    bakingSodaVinegar:  { reactants: BAKING_REACTANTS,  products: BAKING_PRODUCTS  },
    rustingIron:        { reactants: RUSTING_REACTANTS, products: RUSTING_PRODUCTS },
  };

  // ---- MODULE STATE ----
  let _reactRow  = null;
  let _prodRow   = null;
  let _animating = false;
  let _timers    = [];    // tracked setTimeout IDs so they can be cancelled

  function _clearTimers() {
    _timers.forEach(id => clearTimeout(id));
    _timers = [];
  }

  // setTimeout wrapper that records the ID for cancellation
  function _after(ms, fn) {
    const id = setTimeout(fn, ms);
    _timers.push(id);
    return id;
  }

  // ---- INTERNAL HELPERS ----

  function _swapButtons(showReact) {
    const rb  = document.getElementById('reactBtn');
    const rsb = document.getElementById('resetBtn');
    if (!rb || !rsb) return;
    if (showReact) {
      rb.style.display  = '';
      rb.disabled       = false;
      rsb.style.display = 'none';
    } else {
      rb.style.display  = 'none';
      rsb.style.display = '';
    }
  }

  // Flash each inventory row with a green highlight, staggered
  function _flashInventory(inventoryBody) {
    if (!inventoryBody) return;
    const rows = inventoryBody.querySelectorAll('tr');
    rows.forEach((row, i) => {
      _after(i * 90, () => {
        // Remove then re-add to restart the CSS animation if already present
        row.classList.remove('inventory-flash');
        void row.offsetHeight; // force reflow
        row.classList.add('inventory-flash');
        // Clean up class after animation completes (800ms)
        setTimeout(() => row.classList.remove('inventory-flash'), 800);
      });
    });
  }

  // ---- PUBLIC API ----

  /**
   * Builds and shows the burningCandle reactant molecules.
   * Products are pre-built in the DOM but hidden until runReaction().
   * Safe to call multiple times — always rebuilds from scratch.
   */
  function init(reactantsEl, productsEl, reactionKey) {
    _clearTimers();
    _animating = false;

    reactantsEl.innerHTML = '';
    productsEl.innerHTML  = '';

    const layout  = REACTION_LAYOUTS[reactionKey];
    _reactRow = buildVisualRow(layout.reactants);
    _prodRow  = buildVisualRow(layout.products);

    // Products are invisible until React is clicked
    _prodRow.style.display    = 'none';
    _prodRow.style.opacity    = '0';
    _prodRow.style.transition = 'opacity 0.5s ease';

    // Placeholder text in products area
    const ph = document.createElement('div');
    ph.className   = 'mol-placeholder';
    ph.id          = 'molPlaceholder';
    ph.textContent = 'Products will appear after the reaction.';

    reactantsEl.appendChild(_reactRow);
    productsEl.appendChild(_prodRow);
    productsEl.appendChild(ph);
  }

  /**
   * Runs the 4-phase reaction animation:
   *   1. Shake reactant molecules (0–800 ms)
   *   2. Fade out reactants       (800–1200 ms)
   *   3. Fade in products         (1200–1700 ms)
   *   4. Flash inventory rows + show Reset button (1700 ms)
   */
  function runReaction(reactantsEl, productsEl, inventoryBody) {
    if (_animating || !_reactRow || !_prodRow) return;
    _animating = true;

    const ph     = document.getElementById('molPlaceholder');
    const groups = _reactRow.querySelectorAll('.mol-group');

    // Phase 1 — shake
    groups.forEach(g => g.classList.add('mol-shake'));

    _after(800, () => {
      if (!document.body.contains(_reactRow)) return; // guard: reaction was switched

      // Phase 2 — fade out reactants
      _reactRow.style.transition = 'opacity 0.4s ease';
      _reactRow.style.opacity    = '0';

      _after(400, () => {
        _reactRow.style.display = 'none';
        if (ph) ph.style.display = 'none';

        // Phase 3 — fade in products
        _prodRow.style.display = 'flex';
        requestAnimationFrame(() => {
          requestAnimationFrame(() => {
            _prodRow.style.opacity = '1';
          });
        });

        _after(500, () => {
          // Phase 4 — flash inventory + swap buttons
          _flashInventory(inventoryBody);
          _swapButtons(false); // hide React, show Reset
        });
      });
    });
  }

  /**
   * Resets to the pre-reaction state: show reactants, hide products,
   * restore buttons.
   */
  function reset(reactantsEl, productsEl) {
    _clearTimers();

    if (_reactRow) {
      _reactRow.querySelectorAll('.mol-group').forEach(g => g.classList.remove('mol-shake'));
      _reactRow.style.transition = 'none';
      _reactRow.style.opacity    = '1';
      _reactRow.style.display    = 'flex';
    }

    if (_prodRow) {
      _prodRow.style.transition = 'none';
      _prodRow.style.opacity    = '0';
      _prodRow.style.display    = 'none';
    }

    const ph = document.getElementById('molPlaceholder');
    if (ph) ph.style.display = '';

    _swapButtons(true); // show React, hide Reset
    _animating = false;
  }

  return { init, runReaction, reset };

})();
