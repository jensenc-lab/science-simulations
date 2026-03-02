// ============================================================
// Conservation of Matter — animation.js
// Atom-travel animation for methane combustion (burningCandle).
// MolViz.init() still builds and hides the product SVGs;
// this module handles the React button sequence instead of
// MolViz.runReaction(), then reveals the products normally.
// ============================================================

const MolAnim = (function () {
  'use strict';

  const D  = 32;    // floating atom diameter (px)
  const MS = 2000;  // travel duration (ms)
  const ST = 55;    // stagger delay per atom (ms)
  const FD = 500;   // fade in / fade out duration (ms)

  const FILL = { C: '#333333', H: '#f0f0f0', O: '#e74c3c', Fe: '#b87333', Na: '#8e44ad' };
  const INK  = { C: '#ffffff', H: '#333333', O: '#ffffff', Fe: '#ffffff', Na: '#ffffff' };

  // Create a fixed-position floating atom div.
  // Motion is driven by CSS transform transition (GPU-composited).
  function makeEl(sym) {
    const el = document.createElement('div');
    Object.assign(el.style, {
      position:        'fixed',
      width:           D + 'px',
      height:          D + 'px',
      borderRadius:    '50%',
      background:      FILL[sym] || '#888',
      color:           INK[sym]  || '#fff',
      border:          sym === 'H' ? '1.5px solid #999' : 'none',
      display:         'flex',
      alignItems:      'center',
      justifyContent:  'center',
      fontSize:        '11px',
      fontWeight:      'bold',
      fontFamily:      'Segoe UI, system-ui, sans-serif',
      boxShadow:       '0 2px 8px rgba(0,0,0,0.25)',
      pointerEvents:   'none',
      zIndex:          '500',
      // Only transition the transform so initial placement is instant
      transition:      `transform ${MS}ms cubic-bezier(0.4, 0, 0.2, 1)`,
    });
    el.textContent = sym;
    return el;
  }

  // ---- Module state ----
  let _els    = [];
  let _timers = [];   // all pending setTimeout IDs so cleanup() can cancel them

  // Remove all floating atoms and cancel every pending timer.
  // Called on reaction-switch and at the start of each runReaction().
  function cleanup() {
    _els.forEach(el => el.remove());
    _els = [];
    _timers.forEach(id => clearTimeout(id));
    _timers = [];
  }

  // setTimeout wrapper that records the ID so cleanup() can cancel it.
  function _after(ms, fn) {
    const id = setTimeout(fn, ms);
    _timers.push(id);
    return id;
  }

  // ---- Main animation ----

  function runReaction(reactantsEl, productsEl, inventoryBody) {
    cleanup();

    // Use bounding rects so positions track the actual rendered layout
    const rl   = document.querySelector('.reactants-side').getBoundingClientRect();
    const pl   = document.querySelector('.products-side').getBoundingClientRect();
    const midY = (rl.top + rl.bottom) / 2;

    // ---- Starting positions ----
    // CH₄: C in the left zone; 4 H atoms fanned outward at radius r
    // 2×O₂: two pairs of O atoms to the right within the reactant side
    const cX = rl.left + rl.width * 0.30;   // CH₄ center x
    const oX = rl.left + rl.width * 0.70;   // O₂ cluster center x
    const r  = 35;                           // H-fan radius (px)

    // Order: C, H×4, then O×4 (keeps same order for mapping to ends[])
    const starts = [
      { sym: 'C', cx: cX,      cy: midY      },   // C from CH₄
      { sym: 'H', cx: cX,      cy: midY - r  },   // H north
      { sym: 'H', cx: cX + r,  cy: midY      },   // H east
      { sym: 'H', cx: cX,      cy: midY + r  },   // H south
      { sym: 'H', cx: cX - r,  cy: midY      },   // H west
      { sym: 'O', cx: oX - 20, cy: midY - 24 },   // O from O₂ #1
      { sym: 'O', cx: oX + 20, cy: midY - 24 },   //   ↑ pair
      { sym: 'O', cx: oX - 20, cy: midY + 24 },   // O from O₂ #2
      { sym: 'O', cx: oX + 20, cy: midY + 24 },   //   ↑ pair
    ];

    // ---- Ending positions ----
    // CO₂  (upper):  O — C — O linear
    // H₂O  (middle): O at top-center, H pair below-left / below-right
    // H₂O  (lower):  same shape, shifted down
    //
    // h1Y / h2Y are the Y of each H₂O's *oxygen* atom.
    // H atoms sit 35 px below and ±28 px left/right of that oxygen.
    // co2Y is separated from h1Y by 69 px so no atom falls "between" groups.
    const pX   = pl.left + pl.width * 0.42;  // horizontal center of product zone
    const co2Y = midY - 44;
    const h1Y  = midY + 25;   // H₂O #1 — oxygen y  (was midY+16 with a -20 offset = midY-4, which sat between groups)
    const h2Y  = midY + 90;   // H₂O #2 — oxygen y

    // ends[] must parallel starts[] exactly — one destination per atom
    const ends = [
      { cx: pX,      cy: co2Y      },   // C  → CO₂ center
      { cx: pX - 28, cy: h1Y + 35  },   // H  → H₂O #1 lower-left
      { cx: pX + 28, cy: h1Y + 35  },   // H  → H₂O #1 lower-right
      { cx: pX - 28, cy: h2Y + 35  },   // H  → H₂O #2 lower-left
      { cx: pX + 28, cy: h2Y + 35  },   // H  → H₂O #2 lower-right
      { cx: pX - 48, cy: co2Y      },   // O  → CO₂ left
      { cx: pX + 48, cy: co2Y      },   // O  → CO₂ right
      { cx: pX,      cy: h1Y       },   // O  → H₂O #1 oxygen (top, above H pair)
      { cx: pX,      cy: h2Y       },   // O  → H₂O #2 oxygen (top, above H pair)
    ];

    // Phase 1: hide the static reactant SVGs so floating atoms take over
    const reactRow = reactantsEl.querySelector('.mol-visual-row');
    if (reactRow) reactRow.style.opacity = '0';

    // Phase 2: create floating atoms at their start positions (no transition yet)
    _els = starts.map((s, i) => {
      const el = makeEl(s.sym);
      el.style.left           = (s.cx - D / 2) + 'px';
      el.style.top            = (s.cy - D / 2) + 'px';
      el.style.transitionDelay = (i * ST) + 'ms';
      document.body.appendChild(el);
      return el;
    });

    // Phase 3: apply transforms after two rAF ticks so the browser has
    //          painted the initial positions before animating.
    requestAnimationFrame(() => requestAnimationFrame(() => {
      _els.forEach((el, i) => {
        const dx = ends[i].cx - starts[i].cx;
        const dy = ends[i].cy - starts[i].cy;
        el.style.transform = `translate(${dx}px, ${dy}px)`;
      });
    }));

    // Snapshot the product row reference now (MolViz pre-built it hidden).
    // Captured before any timers fire so the reference stays valid across callbacks.
    const prodRow = productsEl.querySelector('.mol-visual-row');
    const ph      = document.getElementById('molPlaceholder');

    // Phase 4a: once the last atom lands, fade the floating atoms OUT
    const travelDone = MS + (starts.length - 1) * ST + 200;
    _after(travelDone, () => {
      _els.forEach(el => {
        el.style.transition = `opacity ${FD}ms ease`;
        el.style.opacity    = '0';
      });

      // Phase 4b: atoms are now invisible — remove them, fade products IN
      _after(FD, () => {
        _els.forEach(el => el.remove());
        _els = [];

        if (ph) ph.style.display = 'none';
        // Guard: check the product row is still in the DOM (user may have
        // switched reactions while the fade-out was playing)
        if (prodRow && document.body.contains(prodRow)) {
          prodRow.style.display    = 'flex';
          prodRow.style.opacity    = '0';
          prodRow.style.transition = `opacity ${FD}ms ease`;
          requestAnimationFrame(() => requestAnimationFrame(() => {
            prodRow.style.opacity = '1';
          }));
        }

        // Phase 4c: after products are fully visible, flash inventory + swap buttons
        _after(FD, () => {
          if (inventoryBody) {
            inventoryBody.querySelectorAll('tr').forEach((row, i) => {
              _after(i * 90, () => {
                row.classList.remove('inventory-flash');
                void row.offsetHeight;   // force reflow to restart CSS animation
                row.classList.add('inventory-flash');
                setTimeout(() => row.classList.remove('inventory-flash'), 800);
              });
            });
          }

          const rb = document.getElementById('reactBtn');
          const rs = document.getElementById('resetBtn');
          if (rb) rb.style.display = 'none';
          if (rs) rs.style.display = '';
        });
      });
    });
  }

  // ---- Rusting iron: 4Fe + 3O₂ → 2Fe₂O₃ ----

  function runRustingIron(reactantsEl, productsEl, inventoryBody) {
    cleanup();

    // ---- Measure product atom positions before the animation starts ----
    // Temporarily show prodRow (opacity already 0) and hide the placeholder
    // so getBoundingClientRect reflects the same layout as the final reveal.
    // No frame is painted between show and hide, so there is no visual flash.
    const prodRow = productsEl.querySelector('.mol-visual-row');
    const ph      = document.getElementById('molPlaceholder');
    if (ph) ph.style.display = 'none';
    prodRow.style.display = 'flex';

    const svgs = prodRow.querySelectorAll('svg');  // [0] = Fe₂O₃ #1, [1] = Fe₂O₃ #2

    // Map an SVG-space coordinate (ax, ay) to a screen-space center point.
    // Accounts for any CSS scaling applied to the SVG element.
    function svgPt(el, ax, ay) {
      const r  = el.getBoundingClientRect();
      const sx = r.width  / +el.getAttribute('width');
      const sy = r.height / +el.getAttribute('height');
      return { cx: r.left + ax * sx, cy: r.top + ay * sy };
    }

    // Fe₂O₃ atom positions in SVG space (from drawFe2O3 in molecules.js):
    //   Fe left (24,52)  Fe right (96,52)
    //   O top (60,20)    O center (60,52)   O bottom (60,84)
    const ends = [
      svgPt(svgs[0], 24, 52),  // Fe #1 → Fe₂O₃ #1 left Fe
      svgPt(svgs[0], 96, 52),  // Fe #2 → Fe₂O₃ #1 right Fe
      svgPt(svgs[1], 24, 52),  // Fe #3 → Fe₂O₃ #2 left Fe
      svgPt(svgs[1], 96, 52),  // Fe #4 → Fe₂O₃ #2 right Fe
      svgPt(svgs[0], 60, 20),  // O → Fe₂O₃ #1 top O
      svgPt(svgs[0], 60, 52),  // O → Fe₂O₃ #1 center O
      svgPt(svgs[0], 60, 84),  // O → Fe₂O₃ #1 bottom O
      svgPt(svgs[1], 60, 20),  // O → Fe₂O₃ #2 top O
      svgPt(svgs[1], 60, 52),  // O → Fe₂O₃ #2 center O
      svgPt(svgs[1], 60, 84),  // O → Fe₂O₃ #2 bottom O
    ];

    prodRow.style.display = 'none';   // hide again; Phase 4b will reveal it properly
    if (ph) ph.style.display = '';    // restore placeholder

    // ---- Starting positions ----
    const rl   = document.querySelector('.reactants-side').getBoundingClientRect();
    const midY = (rl.top + rl.bottom) / 2;

    // 4Fe: 2×2 grid on the left of the reactant zone
    // 3×O₂: three stacked pairs on the right
    const feX = rl.left + rl.width * 0.28;
    const oX  = rl.left + rl.width * 0.68;

    // Order: Fe×4, then O×6 (parallels ends[] exactly)
    const starts = [
      { sym: 'Fe', cx: feX - 14, cy: midY - 14 },  // Fe #1 top-left
      { sym: 'Fe', cx: feX + 14, cy: midY - 14 },  // Fe #2 top-right
      { sym: 'Fe', cx: feX - 14, cy: midY + 14 },  // Fe #3 bot-left
      { sym: 'Fe', cx: feX + 14, cy: midY + 14 },  // Fe #4 bot-right
      { sym: 'O',  cx: oX - 14,  cy: midY - 34 },  // O from O₂ #1
      { sym: 'O',  cx: oX + 14,  cy: midY - 34 },  //   ↑ pair
      { sym: 'O',  cx: oX - 14,  cy: midY      },  // O from O₂ #2
      { sym: 'O',  cx: oX + 14,  cy: midY      },  //   ↑ pair
      { sym: 'O',  cx: oX - 14,  cy: midY + 34 },  // O from O₂ #3
      { sym: 'O',  cx: oX + 14,  cy: midY + 34 },  //   ↑ pair
    ];

    // Phase 1: hide the static reactant SVGs so floating atoms take over
    const reactRow = reactantsEl.querySelector('.mol-visual-row');
    if (reactRow) reactRow.style.opacity = '0';

    // Phase 2: create floating atoms at their start positions (no transition yet)
    _els = starts.map((s, i) => {
      const el = makeEl(s.sym);
      el.style.left            = (s.cx - D / 2) + 'px';
      el.style.top             = (s.cy - D / 2) + 'px';
      el.style.transitionDelay = (i * ST) + 'ms';
      document.body.appendChild(el);
      return el;
    });

    // Phase 3: apply transforms after two rAF ticks so the browser has
    //          painted the initial positions before animating.
    requestAnimationFrame(() => requestAnimationFrame(() => {
      _els.forEach((el, i) => {
        const dx = ends[i].cx - starts[i].cx;
        const dy = ends[i].cy - starts[i].cy;
        el.style.transform = `translate(${dx}px, ${dy}px)`;
      });
    }));

    // Phase 4a: once the last atom lands, fade the floating atoms OUT
    const travelDone = MS + (starts.length - 1) * ST + 200;
    _after(travelDone, () => {
      _els.forEach(el => {
        el.style.transition = `opacity ${FD}ms ease`;
        el.style.opacity    = '0';
      });

      // Phase 4b: atoms are now invisible — remove them, fade products IN
      _after(FD, () => {
        _els.forEach(el => el.remove());
        _els = [];

        if (ph) ph.style.display = 'none';
        // Guard: check the product row is still in the DOM (user may have
        // switched reactions while the fade-out was playing)
        if (prodRow && document.body.contains(prodRow)) {
          prodRow.style.display    = 'flex';
          prodRow.style.opacity    = '0';
          prodRow.style.transition = `opacity ${FD}ms ease`;
          requestAnimationFrame(() => requestAnimationFrame(() => {
            prodRow.style.opacity = '1';
          }));
        }

        // Phase 4c: after products are fully visible, flash inventory + swap buttons
        _after(FD, () => {
          if (inventoryBody) {
            inventoryBody.querySelectorAll('tr').forEach((row, i) => {
              _after(i * 90, () => {
                row.classList.remove('inventory-flash');
                void row.offsetHeight;   // force reflow to restart CSS animation
                row.classList.add('inventory-flash');
                setTimeout(() => row.classList.remove('inventory-flash'), 800);
              });
            });
          }

          const rb = document.getElementById('reactBtn');
          const rs = document.getElementById('resetBtn');
          if (rb) rb.style.display = 'none';
          if (rs) rs.style.display = '';
        });
      });
    });
  }

  // ---- Baking Soda + Vinegar: NaHCO₃ + CH₃COOH → NaCH₃COO + H₂O + CO₂ ----

  function runBakingSodaVinegar(reactantsEl, productsEl, inventoryBody) {
    cleanup();

    // Shared SVG-space → screen-space helper (same pattern as runRustingIron)
    function svgPt(el, ax, ay) {
      const r  = el.getBoundingClientRect();
      const sx = r.width  / +el.getAttribute('width');
      const sy = r.height / +el.getAttribute('height');
      return { cx: r.left + ax * sx, cy: r.top + ay * sy };
    }

    // ---- Measure product atom positions (SVGs are hidden; show briefly) ----
    // psvgs[0]=NaCH₃COO (194×114), psvgs[1]=H₂O (90×80), psvgs[2]=CO₂ (140×44)
    const prodRow = productsEl.querySelector('.mol-visual-row');
    const ph      = document.getElementById('molPlaceholder');
    if (ph) ph.style.display = 'none';
    prodRow.style.display = 'flex';
    const psvgs = prodRow.querySelectorAll('svg');

    // ends[] — atom destinations in screen space, from drawNaCH3COO / drawH2O / drawCO2
    const ends = [
      svgPt(psvgs[0], 20,  60),  // Na → NaCH₃COO  Na
      svgPt(psvgs[0], 58,  60),  // O  → NaCH₃COO  O1 (Na-side)
      svgPt(psvgs[0], 96,  60),  // C  → NaCH₃COO  C1 (carboxylate)
      svgPt(psvgs[0], 96,  22),  // O  → NaCH₃COO  O2 (up)
      svgPt(psvgs[1], 45,  18),  // O  → H₂O        O
      svgPt(psvgs[1], 15,  60),  // H  → H₂O        H-left
      svgPt(psvgs[0], 140, 22),  // H  → NaCH₃COO  H-top
      svgPt(psvgs[0], 178, 60),  // H  → NaCH₃COO  H-right
      svgPt(psvgs[0], 140, 98),  // H  → NaCH₃COO  H-bottom
      svgPt(psvgs[0], 140, 60),  // C  → NaCH₃COO  C2 (methyl)
      svgPt(psvgs[2], 70,  22),  // C  → CO₂        C
      svgPt(psvgs[2], 20,  22),  // O  → CO₂        O-left
      svgPt(psvgs[2], 120, 22),  // O  → CO₂        O-right
      svgPt(psvgs[1], 75,  60),  // H  → H₂O        H-right
    ];

    prodRow.style.display = 'none';   // hide again; Phase 4b will reveal it properly
    if (ph) ph.style.display = '';    // restore placeholder

    // ---- Starting positions from visible reactant SVGs ----
    // rsvgs[0]=NaHCO₃ (180×104), rsvgs[1]=CH₃COOH (173×109)
    const rsvgs = reactantsEl.querySelectorAll('svg');

    // starts[] parallels ends[] exactly — one atom per entry
    const starts = [
      // From NaHCO₃ (atom positions from drawNaHCO3):
      { sym: 'Na', ...svgPt(rsvgs[0], 20,  55) },  // Na           → NaCH₃COO Na
      { sym: 'O',  ...svgPt(rsvgs[0], 58,  55) },  // O (Na-side)  → NaCH₃COO O1
      { sym: 'C',  ...svgPt(rsvgs[0], 96,  55) },  // C            → NaCH₃COO C1
      { sym: 'O',  ...svgPt(rsvgs[0], 96,  17) },  // O (up)       → NaCH₃COO O2
      { sym: 'O',  ...svgPt(rsvgs[0], 130, 81) },  // O (lower-R)  → H₂O O
      { sym: 'H',  ...svgPt(rsvgs[0], 164, 81) },  // H            → H₂O H-left
      // From CH₃COOH (atom positions from drawCH3COOH):
      { sym: 'H',  ...svgPt(rsvgs[1], 50,  17) },  // H (top)      → NaCH₃COO H-top
      { sym: 'H',  ...svgPt(rsvgs[1], 14,  55) },  // H (left)     → NaCH₃COO H-right
      { sym: 'H',  ...svgPt(rsvgs[1], 50,  93) },  // H (bottom)   → NaCH₃COO H-bottom
      { sym: 'C',  ...svgPt(rsvgs[1], 50,  55) },  // C1 methyl    → NaCH₃COO C2
      { sym: 'C',  ...svgPt(rsvgs[1], 92,  55) },  // C2 carboxyl  → CO₂ C
      { sym: 'O',  ...svgPt(rsvgs[1], 122, 25) },  // O (upper)    → CO₂ O-left
      { sym: 'O',  ...svgPt(rsvgs[1], 122, 85) },  // O (lower)    → CO₂ O-right
      { sym: 'H',  ...svgPt(rsvgs[1], 157, 85) },  // H (on O)     → H₂O H-right
    ];

    // Phase 1: hide the static reactant SVGs so floating atoms take over
    const reactRow = reactantsEl.querySelector('.mol-visual-row');
    if (reactRow) reactRow.style.opacity = '0';

    // Phase 2: create floating atoms at their start positions (no transition yet)
    _els = starts.map((s, i) => {
      const el = makeEl(s.sym);
      el.style.left            = (s.cx - D / 2) + 'px';
      el.style.top             = (s.cy - D / 2) + 'px';
      el.style.transitionDelay = (i * ST) + 'ms';
      document.body.appendChild(el);
      return el;
    });

    // Phase 3: apply transforms after two rAF ticks so the browser has
    //          painted the initial positions before animating.
    requestAnimationFrame(() => requestAnimationFrame(() => {
      _els.forEach((el, i) => {
        const dx = ends[i].cx - starts[i].cx;
        const dy = ends[i].cy - starts[i].cy;
        el.style.transform = `translate(${dx}px, ${dy}px)`;
      });
    }));

    // Phase 4a: once the last atom lands, fade the floating atoms OUT
    const travelDone = MS + (starts.length - 1) * ST + 200;
    _after(travelDone, () => {
      _els.forEach(el => {
        el.style.transition = `opacity ${FD}ms ease`;
        el.style.opacity    = '0';
      });

      // Phase 4b: atoms are now invisible — remove them, fade products IN
      _after(FD, () => {
        _els.forEach(el => el.remove());
        _els = [];

        if (ph) ph.style.display = 'none';
        // Guard: check the product row is still in the DOM (user may have
        // switched reactions while the fade-out was playing)
        if (prodRow && document.body.contains(prodRow)) {
          prodRow.style.display    = 'flex';
          prodRow.style.opacity    = '0';
          prodRow.style.transition = `opacity ${FD}ms ease`;
          requestAnimationFrame(() => requestAnimationFrame(() => {
            prodRow.style.opacity = '1';
          }));
        }

        // Phase 4c: after products are fully visible, flash inventory + swap buttons
        _after(FD, () => {
          if (inventoryBody) {
            inventoryBody.querySelectorAll('tr').forEach((row, i) => {
              _after(i * 90, () => {
                row.classList.remove('inventory-flash');
                void row.offsetHeight;   // force reflow to restart CSS animation
                row.classList.add('inventory-flash');
                setTimeout(() => row.classList.remove('inventory-flash'), 800);
              });
            });
          }

          const rb = document.getElementById('reactBtn');
          const rs = document.getElementById('resetBtn');
          if (rb) rb.style.display = 'none';
          if (rs) rs.style.display = '';
        });
      });
    });
  }

  return { runReaction, runRustingIron, runBakingSodaVinegar, cleanup };

})();
