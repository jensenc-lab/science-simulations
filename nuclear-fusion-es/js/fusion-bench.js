// Fusion Bench panel — interactive UI for picking two nuclides and attempting
// fusion. Wires into window.QValue for the physics and window.BindingCurve
// for the linked curve highlights.

(function () {
  'use strict';

  // ── State ──────────────────────────────────────────────────────────────
  let containerEl = null;
  let paletteEl = null;
  let slotEls = [null, null];
  let productEl = null;
  let resultEl = null;
  let fuseBtn = null;
  let resetBtn = null;
  let slots = [null, null];
  let resultShown = false;
  let initialized = false;

  // ── Public init ────────────────────────────────────────────────────────
  function init(containerId) {
    if (initialized) return;
    containerEl = document.getElementById(containerId);
    if (!containerEl) {
      console.warn('[FusionBench] Container #' + containerId + ' not found');
      return;
    }
    render();
    bindEvents();
    initialized = true;
  }

  // ── Render the panel scaffold + palette tiles ──────────────────────────
  function render() {
    containerEl.classList.add('fusion-bench');
    containerEl.classList.remove('placeholder');
    containerEl.innerHTML =
      '<div class="fb">' +
        '<div class="fb__reaction-row">' +
          '<div class="fb__slot" data-slot="0" aria-label="Reactivo 1, vacío">' +
            '<span class="fb__slot-empty">+ haz clic en un núclido</span>' +
          '</div>' +
          '<div class="fb__op" aria-hidden="true">+</div>' +
          '<div class="fb__slot" data-slot="1" aria-label="Reactivo 2, vacío">' +
            '<span class="fb__slot-empty">+ haz clic en un núclido</span>' +
          '</div>' +
          '<div class="fb__op" aria-hidden="true">→</div>' +
          '<div class="fb__product" aria-live="polite" aria-label="Producto de la reacción, aún no calculado">' +
            '<span class="fb__product-empty">?</span>' +
          '</div>' +
        '</div>' +
        '<div class="fb__controls">' +
          '<button class="fb__btn fb__btn--primary" type="button" id="fb-fuse-btn" disabled>¡Fusionar!</button>' +
          '<button class="fb__btn" type="button" id="fb-reset-btn">Reiniciar</button>' +
        '</div>' +
        '<div class="fb__palette-label">Elige núclidos:</div>' +
        '<div class="fb__palette" role="listbox" aria-label="Paleta de núclidos"></div>' +
        '<div class="fb__result" hidden aria-live="polite"></div>' +
      '</div>';

    slotEls[0] = containerEl.querySelector('[data-slot="0"]');
    slotEls[1] = containerEl.querySelector('[data-slot="1"]');
    productEl = containerEl.querySelector('.fb__product');
    resultEl = containerEl.querySelector('.fb__result');
    fuseBtn = containerEl.querySelector('#fb-fuse-btn');
    resetBtn = containerEl.querySelector('#fb-reset-btn');
    paletteEl = containerEl.querySelector('.fb__palette');

    renderPalette();
  }

  function sortedNuclides() {
    return (window.NUCLIDES || []).slice().sort((a, b) => {
      if (a.mass !== b.mass) return a.mass - b.mass;
      return a.protons - b.protons;
    });
  }

  function renderPalette() {
    const data = sortedNuclides();
    paletteEl.innerHTML = '';
    data.forEach((n, idx) => {
      const tile = document.createElement('button');
      tile.type = 'button';
      tile.className = 'fb__tile';
      tile.setAttribute('role', 'option');
      tile.setAttribute('aria-selected', 'false');
      tile.setAttribute(
        'aria-label',
        n.name + ', ' + n.mass + ' nucleones, haz clic para seleccionar como reactivo'
      );
      tile.dataset.idx = String(idx);
      tile.dataset.key = n.mass + '-' + n.protons;
      tile.innerHTML =
        '<div class="fb__tile-mass">' + n.mass + '</div>' +
        '<div class="fb__tile-symbol">' + escapeHtml(n.symbol) + '</div>' +
        '<div class="fb__tile-name">' + escapeHtml(stripParen(n.name)) + '</div>';
      paletteEl.appendChild(tile);
    });
  }

  // ── Event wiring ───────────────────────────────────────────────────────
  function bindEvents() {
    paletteEl.addEventListener('click', onPaletteClick);
    // Buttons get keyboard activation for free; tiles are <button>s too.
    fuseBtn.addEventListener('click', fuse);
    resetBtn.addEventListener('click', reset);
    containerEl.addEventListener('click', onSlotClearClick);
  }

  function onPaletteClick(e) {
    const tile = e.target.closest('.fb__tile');
    if (!tile) return;
    const idx = parseInt(tile.dataset.idx, 10);
    const data = sortedNuclides();
    const n = data[idx];
    if (n) selectNuclide(n);
  }

  function onSlotClearClick(e) {
    const btn = e.target.closest('.fb__slot-clear');
    if (!btn) return;
    e.stopPropagation();
    const slotIdx = parseInt(btn.dataset.slotClear, 10);
    if (slotIdx !== 0 && slotIdx !== 1) return;
    slots[slotIdx] = null;
    if (resultShown) {
      hideResult();
      window.BindingCurve.clearHighlights();
      setProductEmpty();
    }
    renderSlots();
    updateFuseBtn();
  }

  // ── Slot / product rendering ───────────────────────────────────────────
  function selectNuclide(n) {
    if (resultShown) {
      hideResult();
      window.BindingCurve.clearHighlights();
      setProductEmpty();
    }
    if (!slots[0]) {
      slots[0] = n;
    } else if (!slots[1]) {
      slots[1] = n;
    } else {
      // Both slots full — replace the last-filled slot.
      slots[1] = n;
    }
    renderSlots();
    updateFuseBtn();
  }

  function renderSlots() {
    slots.forEach((n, i) => {
      const el = slotEls[i];
      el.innerHTML = '';
      if (n) {
        el.classList.add('fb__slot--filled');
        el.setAttribute('aria-label', 'Reactivo ' + (i + 1) + ': ' + n.name);
        el.appendChild(buildFilledContent(n, i, true));
      } else {
        el.classList.remove('fb__slot--filled');
        el.setAttribute('aria-label', 'Reactivo ' + (i + 1) + ', vacío');
        const empty = document.createElement('span');
        empty.className = 'fb__slot-empty';
        empty.textContent = '+ haz clic en un núclido';
        el.appendChild(empty);
      }
    });
    refreshTileSelection();
  }

  function buildFilledContent(n, slotIdx, withClear) {
    const wrap = document.createElement('div');
    wrap.className = 'fb__filled';
    if (withClear) {
      const clearBtn = document.createElement('button');
      clearBtn.type = 'button';
      clearBtn.className = 'fb__slot-clear';
      clearBtn.dataset.slotClear = String(slotIdx);
      clearBtn.setAttribute('aria-label', 'Quitar reactivo ' + (slotIdx + 1));
      clearBtn.textContent = '×';
      wrap.appendChild(clearBtn);
    }
    const mass = document.createElement('div');
    mass.className = 'fb__filled-mass';
    mass.textContent = String(n.mass);
    const sym = document.createElement('div');
    sym.className = 'fb__filled-symbol';
    sym.textContent = n.symbol;
    const name = document.createElement('div');
    name.className = 'fb__filled-name';
    name.textContent = stripParen(n.name);
    wrap.appendChild(mass);
    wrap.appendChild(sym);
    wrap.appendChild(name);
    return wrap;
  }

  function refreshTileSelection() {
    const inUse = new Set();
    slots.forEach((n) => {
      if (n) inUse.add(n.mass + '-' + n.protons);
    });
    paletteEl.querySelectorAll('.fb__tile').forEach((tile) => {
      const sel = inUse.has(tile.dataset.key);
      tile.classList.toggle('fb__tile--selected', sel);
      tile.setAttribute('aria-selected', sel ? 'true' : 'false');
    });
  }

  function setProductEmpty() {
    productEl.classList.remove('fb__product--stable', 'fb__product--unstable', 'fb__product--no-match');
    productEl.setAttribute('aria-label', 'Producto de la reacción, aún no calculado');
    productEl.innerHTML = '<span class="fb__product-empty">?</span>';
  }

  function setProductFound(nuclide, isMoreStable) {
    productEl.classList.remove('fb__product--no-match');
    productEl.classList.toggle('fb__product--stable', !!isMoreStable);
    productEl.classList.toggle('fb__product--unstable', !isMoreStable);
    productEl.setAttribute('aria-label', 'Producto: ' + nuclide.name);
    productEl.innerHTML = '';
    productEl.appendChild(buildFilledContent(nuclide, -1, false));
  }

  function setProductNoMatch() {
    productEl.classList.remove('fb__product--stable', 'fb__product--unstable');
    productEl.classList.add('fb__product--no-match');
    productEl.setAttribute('aria-label', 'No se encontró producto');
    productEl.innerHTML =
      '<span class="fb__product-nomatch">—</span>' +
      '<span class="fb__product-nomatch-label">sin coincidencia</span>';
  }

  function updateFuseBtn() {
    fuseBtn.disabled = !(slots[0] && slots[1]);
  }

  // ── Public: fuse() ─────────────────────────────────────────────────────
  function fuse() {
    if (!slots[0] || !slots[1]) return;
    const evalResult = window.QValue.evaluate([slots[0], slots[1]]);

    if (evalResult.product) {
      setProductFound(evalResult.product, evalResult.isMoreStable);
      window.BindingCurve.showFusionPath(
        [slots[0].mass, slots[1].mass],
        evalResult.product.mass
      );
    } else {
      setProductNoMatch();
      // Avoid showFusionPath's "no nuclide" warning by going straight to
      // clear + reactants-only highlighting.
      window.BindingCurve.clearHighlights();
      window.BindingCurve.highlightReactants([slots[0].mass, slots[1].mass]);
    }

    renderResult(evalResult);
    resultShown = true;
  }

  function renderResult(r) {
    const hasProduct = !!r.product;
    const released = r.isMoreStable === true;
    const required = r.isMoreStable === false;

    resultEl.classList.remove(
      'fb__result--released',
      'fb__result--required',
      'fb__result--no-match'
    );

    let icon = '';
    let value = '';
    let modClass = '';

    if (hasProduct && released) {
      icon = '💥';
      value = '+' + Math.abs(r.deltaBEPerNucleon).toFixed(2) + ' MeV/A liberada';
      modClass = 'fb__result--released';
    } else if (hasProduct && required) {
      icon = '🥶';
      value = '−' + Math.abs(r.deltaBEPerNucleon).toFixed(2) + ' MeV/A requerida';
      modClass = 'fb__result--required';
    } else {
      icon = '⚠️';
      value = 'Sin producto coincidente';
      modClass = 'fb__result--no-match';
    }
    resultEl.classList.add(modClass);

    // Pick the name + description text.
    const curated = r.curatedReaction;
    let nameHtml = '';
    if (curated) {
      nameHtml = '<div class="fb__result-name">' + escapeHtml(curated.name) + '</div>';
    } else if (hasProduct) {
      // Generic synthesized name for non-curated successful fusions.
      const left = stripParen(r.reactants[0].name);
      const right = stripParen(r.reactants[1].name);
      nameHtml =
        '<div class="fb__result-name">' +
        escapeHtml(left) + ' + ' + escapeHtml(right) +
        ' → ' + escapeHtml(stripParen(r.product.name)) +
        '</div>';
    }

    let desc = '';
    if (curated) {
      desc = curated.description;
    } else if (hasProduct && released) {
      desc =
        'El núcleo producto tiene mayor energía de enlace por nucleón que los reactivos, ' +
        'así que esta fusión libera energía.';
    } else if (hasProduct && required) {
      desc =
        'El núcleo producto tiene menor energía de enlace por nucleón que los reactivos, ' +
        'así que esta fusión requeriría aporte de energía.';
    } else {
      desc =
        'No existe un núclido producto en nuestros datos. Intenta una combinación diferente, ' +
        'o usa la curva de energía de enlace para predecir dónde caería en la curva un producto más pesado.';
    }

    resultEl.innerHTML =
      '<div class="fb__result-header">' +
        '<span class="fb__result-icon" aria-hidden="true">' + icon + '</span>' +
        '<span class="fb__result-value">' + escapeHtml(value) + '</span>' +
      '</div>' +
      nameHtml +
      '<div class="fb__result-desc">' + escapeHtml(desc) + '</div>';

    resultEl.hidden = false;
  }

  function hideResult() {
    resultEl.hidden = true;
    resultEl.innerHTML = '';
    resultShown = false;
  }

  // ── Public: reset() ────────────────────────────────────────────────────
  function reset() {
    slots[0] = null;
    slots[1] = null;
    renderSlots();
    hideResult();
    setProductEmpty();
    updateFuseBtn();
    window.BindingCurve.clearHighlights();
  }

  // ── Helpers ────────────────────────────────────────────────────────────
  function stripParen(s) {
    return String(s).replace(/\s*\(.*?\)\s*$/, '').trim();
  }

  function escapeHtml(s) {
    return String(s)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  // ── Public surface ─────────────────────────────────────────────────────
  window.FusionBench = {
    init: init,
    reset: reset,
    fuse: fuse,
  };

  // Auto-init when DOM is ready.
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => init('fusion-bench'));
  } else {
    init('fusion-bench');
  }
})();
