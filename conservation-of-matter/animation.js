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

  const FILL = { C: '#333333', H: '#f0f0f0', O: '#e74c3c' };
  const INK  = { C: '#ffffff', H: '#333333', O: '#ffffff' };

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

  return { runReaction, cleanup };

})();
