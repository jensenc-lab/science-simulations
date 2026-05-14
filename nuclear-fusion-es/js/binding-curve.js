// Binding Energy per Nucleon curve — interactive SVG chart.
// Exposes window.BindingCurve with init, highlightReactants, highlightProduct,
// showFusionPath, and clearHighlights. Used by the fusion bench in a later chunk.

(function () {
  'use strict';

  const SVG_NS = 'http://www.w3.org/2000/svg';

  // ── Layout (viewBox units) ─────────────────────────────────────────────
  const VB_W = 700;
  const VB_H = 420;
  const M = { left: 60, right: 20, top: 30, bottom: 50 };
  const PLOT_W = VB_W - M.left - M.right;   // 620
  const PLOT_H = VB_H - M.top - M.bottom;   // 340

  // ── Domain ─────────────────────────────────────────────────────────────
  const X_MIN = 0;
  const X_MAX = 245;
  const Y_MIN = 0;
  const Y_MAX = 9.5;

  // ── Constants ──────────────────────────────────────────────────────────
  const PEAK_MASS = 56;
  // Names of nuclides that always show an inline text label on the chart.
  const ALWAYS_LABELED = new Set([
    'Hydrogen-1 (protium)',
    'Helium-4 (alpha particle)',
    'Carbon-12',
    'Oxygen-16',
    'Uranium-238',
  ]);

  // ── Module state ───────────────────────────────────────────────────────
  let chartEl = null;
  let svg = null;
  let tooltipEl = null;
  let infoEl = null;
  let pointsByMass = new Map();      // mass → first PointEntry registered at that mass
  let allPointEntries = [];          // all rendered points (includes isotope duplicates at same mass)
  let highlightOverlay = null;
  let arrowGroup = null;
  let deltaGroup = null;
  let initialized = false;

  // ── Scales ─────────────────────────────────────────────────────────────
  function xScale(a) {
    return M.left + ((a - X_MIN) / (X_MAX - X_MIN)) * PLOT_W;
  }
  function yScale(b) {
    return M.top + ((Y_MAX - b) / (Y_MAX - Y_MIN)) * PLOT_H;
  }

  // ── DOM helpers ────────────────────────────────────────────────────────
  function svgEl(tag, attrs, text) {
    const node = document.createElementNS(SVG_NS, tag);
    if (attrs) {
      for (const k in attrs) {
        if (attrs[k] != null) node.setAttribute(k, attrs[k]);
      }
    }
    if (text != null) node.textContent = text;
    return node;
  }

  // ── Public init ────────────────────────────────────────────────────────
  function init(containerId) {
    if (initialized) return;
    chartEl = document.getElementById(containerId);
    if (!chartEl) {
      console.warn('[BindingCurve] Container #' + containerId + ' not found');
      return;
    }
    infoEl = document.getElementById('binding-curve-info');

    const data = (window.NUCLIDES || []).slice();
    // Sort by mass ascending; ties broken by BE/A ascending for deterministic order.
    data.sort((a, b) => (a.mass - b.mass) || (a.bePerNucleon - b.bePerNucleon));

    buildSvg(data);
    initialized = true;
  }

  function buildSvg(data) {
    svg = svgEl('svg', {
      class: 'bc-svg',
      viewBox: '0 0 ' + VB_W + ' ' + VB_H,
      preserveAspectRatio: 'xMidYMid meet',
      role: 'img',
      'aria-label':
        'Energía de enlace por nucleón en función del número másico. La curva sube rápidamente desde el hidrógeno hasta el hierro, alcanza su máximo cerca del hierro-56 y desciende gradualmente hacia el uranio.',
    });
    chartEl.appendChild(svg);

    // <defs> with the arrow marker used by showFusionPath
    const defs = svgEl('defs');
    const marker = svgEl('marker', {
      id: 'bc-arrow-head',
      viewBox: '0 0 10 10',
      refX: '8',
      refY: '5',
      markerWidth: '7',
      markerHeight: '7',
      orient: 'auto-start-reverse',
    });
    marker.appendChild(svgEl('path', { d: 'M 0 0 L 10 5 L 0 10 z', class: 'bc-arrow-marker' }));
    defs.appendChild(marker);
    svg.appendChild(defs);

    drawZones();
    drawGridAndAxes();
    drawPeakLine();

    // Highlight overlay sits behind the points so rings don't cover circles.
    highlightOverlay = svgEl('g', { class: 'bc-highlight-overlay' });
    svg.appendChild(highlightOverlay);

    drawCurveLine(data);
    drawPoints(data);
    drawDefaultLabels();

    // Fusion arrow + delta label groups (drawn on top of points).
    arrowGroup = svgEl('g', { class: 'bc-arrow-group' });
    svg.appendChild(arrowGroup);
    deltaGroup = svgEl('g', { class: 'bc-delta-group' });
    svg.appendChild(deltaGroup);

    // Floating HTML tooltip lives in the chart container, not the SVG.
    tooltipEl = document.createElement('div');
    tooltipEl.className = 'bc-tooltip';
    tooltipEl.setAttribute('role', 'tooltip');
    tooltipEl.setAttribute('aria-hidden', 'true');
    chartEl.appendChild(tooltipEl);
  }

  // ── Background zones ───────────────────────────────────────────────────
  function drawZones() {
    const peakX = xScale(PEAK_MASS);
    svg.appendChild(svgEl('rect', {
      class: 'bc-zone bc-zone-releases',
      x: M.left, y: M.top,
      width: peakX - M.left, height: PLOT_H,
    }));
    svg.appendChild(svgEl('rect', {
      class: 'bc-zone bc-zone-requires',
      x: peakX, y: M.top,
      width: M.left + PLOT_W - peakX, height: PLOT_H,
    }));

    // Zone annotation text labels (inside plot area, near the top).
    svg.appendChild(svgEl('text', {
      class: 'bc-zone-label bc-zone-label--releases',
      x: M.left + 14, y: M.top + 20,
      'text-anchor': 'start',
    }, 'La fusión libera energía →'));
    svg.appendChild(svgEl('text', {
      class: 'bc-zone-label bc-zone-label--requires',
      x: xScale(PEAK_MASS) + 8, y: M.top + 20,
      'text-anchor': 'start',
    }, 'La fusión requiere energía →'));
  }

  // ── Grid, axes, ticks ──────────────────────────────────────────────────
  function drawGridAndAxes() {
    // Horizontal gridlines at each Y tick.
    for (let y = Math.ceil(Y_MIN); y <= Math.floor(Y_MAX); y++) {
      svg.appendChild(svgEl('line', {
        class: 'bc-gridline',
        x1: M.left, x2: M.left + PLOT_W,
        y1: yScale(y), y2: yScale(y),
      }));
    }

    // Axis lines
    svg.appendChild(svgEl('line', {
      class: 'bc-axis-line',
      x1: M.left, x2: M.left + PLOT_W,
      y1: M.top + PLOT_H, y2: M.top + PLOT_H,
    }));
    svg.appendChild(svgEl('line', {
      class: 'bc-axis-line',
      x1: M.left, x2: M.left,
      y1: M.top, y2: M.top + PLOT_H,
    }));

    // X ticks + labels (every 50 from 0 to 200).
    for (let a = 0; a <= 200; a += 50) {
      const x = xScale(a);
      svg.appendChild(svgEl('line', {
        class: 'bc-tick',
        x1: x, x2: x,
        y1: M.top + PLOT_H, y2: M.top + PLOT_H + 5,
      }));
      svg.appendChild(svgEl('text', {
        class: 'bc-tick-label',
        x: x, y: M.top + PLOT_H + 18,
        'text-anchor': 'middle',
      }, String(a)));
    }

    // Y ticks + labels (every 1 from 0 to 9).
    for (let b = 0; b <= 9; b++) {
      const y = yScale(b);
      svg.appendChild(svgEl('line', {
        class: 'bc-tick',
        x1: M.left - 5, x2: M.left,
        y1: y, y2: y,
      }));
      svg.appendChild(svgEl('text', {
        class: 'bc-tick-label',
        x: M.left - 9, y: y + 4,
        'text-anchor': 'end',
      }, String(b)));
    }

    // Axis titles
    svg.appendChild(svgEl('text', {
      class: 'bc-axis-title',
      x: M.left + PLOT_W / 2, y: VB_H - 12,
      'text-anchor': 'middle',
    }, 'Número Másico (A)'));

    const yTitleX = 16;
    const yTitleY = M.top + PLOT_H / 2;
    svg.appendChild(svgEl('text', {
      class: 'bc-axis-title',
      x: yTitleX, y: yTitleY,
      'text-anchor': 'middle',
      transform: 'rotate(-90 ' + yTitleX + ' ' + yTitleY + ')',
    }, 'Energía de Enlace por Nucleón (MeV/A)'));
  }

  // ── Vertical peak line at Fe-56 ────────────────────────────────────────
  function drawPeakLine() {
    const peakX = xScale(PEAK_MASS);
    svg.appendChild(svgEl('line', {
      class: 'bc-peak-line',
      x1: peakX, x2: peakX,
      y1: M.top, y2: M.top + PLOT_H,
    }));
    svg.appendChild(svgEl('text', {
      class: 'bc-peak-label',
      x: peakX, y: M.top - 10,
      'text-anchor': 'middle',
    }, 'Fe-56 (estabilidad máxima)'));
  }

  // ── Polyline through the upper envelope (one point per mass) ───────────
  function drawCurveLine(data) {
    const bestByMass = new Map();
    data.forEach((n) => {
      const cur = bestByMass.get(n.mass);
      if (!cur || n.bePerNucleon > cur.bePerNucleon) bestByMass.set(n.mass, n);
    });
    const line = Array.from(bestByMass.values()).sort((a, b) => a.mass - b.mass);
    const pointsStr = line.map((n) => xScale(n.mass) + ',' + yScale(n.bePerNucleon)).join(' ');
    svg.appendChild(svgEl('polyline', {
      class: 'bc-curve-line',
      points: pointsStr,
      fill: 'none',
    }));
  }

  // ── Data points ────────────────────────────────────────────────────────
  function drawPoints(data) {
    const group = svgEl('g', { class: 'bc-points-group' });
    data.forEach((n, i) => {
      const cx = xScale(n.mass);
      const cy = yScale(n.bePerNucleon);
      const isPeak = n.mass === PEAK_MASS && n.symbol === 'Fe';

      const circle = svgEl('circle', {
        class: 'bc-point' + (isPeak ? ' bc-point--peak' : ''),
        cx: cx, cy: cy,
        r: isPeak ? 6 : 4,
        tabindex: '0',
        role: 'button',
        'aria-label':
          n.name + '. ' + n.protons + ' protones, ' + n.neutrons + ' neutrones. ' +
          'Energía de enlace ' + n.bePerNucleon.toFixed(3) + ' MeV por nucleón. ' +
          'Activa para seleccionar.',
        'data-idx': String(i),
        'data-mass': String(n.mass),
      });

      const entry = { nuclide: n, circle: circle, cx: cx, cy: cy };
      allPointEntries.push(entry);
      // First isotope at a given mass wins lookup-by-mass.
      if (!pointsByMass.has(n.mass)) pointsByMass.set(n.mass, entry);

      circle.addEventListener('mouseenter', () => showTooltip(entry));
      circle.addEventListener('mouseleave', hideTooltip);
      circle.addEventListener('focus', () => showTooltip(entry));
      circle.addEventListener('blur', hideTooltip);
      circle.addEventListener('click', () => selectNuclide(n));
      circle.addEventListener('keydown', (ev) => {
        if (ev.key === 'Enter' || ev.key === ' ') {
          ev.preventDefault();
          selectNuclide(n);
        }
      });

      group.appendChild(circle);
    });
    svg.appendChild(group);
  }

  // ── Default inline labels for the curated set ──────────────────────────
  function drawDefaultLabels() {
    const group = svgEl('g', { class: 'bc-label-group' });
    allPointEntries.forEach((entry) => {
      const n = entry.nuclide;
      const isPeak = n.mass === PEAK_MASS && n.symbol === 'Fe';
      const isAlways = ALWAYS_LABELED.has(n.name);
      if (!isPeak && !isAlways) return;

      let lx = entry.cx;
      let ly = entry.cy - 10;
      let anchor = 'middle';

      if (isPeak) {
        // Sit the Fe-56 label to the right of the dashed peak line so it
        // doesn't crash into the "Fe-56 (peak stability)" header label.
        lx = entry.cx + 11;
        ly = entry.cy + 4;
        anchor = 'start';
      } else if (n.symbol === 'U' && n.mass === 238) {
        // U-238 is near the right edge; anchor the label to the left of the point.
        lx = entry.cx - 9;
        ly = entry.cy + 4;
        anchor = 'end';
      } else if (n.symbol === 'H' && n.mass === 1) {
        // H-1 sits on the x-axis; lift the label well above so it clears the gridline.
        ly = entry.cy - 12;
      }

      group.appendChild(svgEl('text', {
        class: 'bc-point-label' + (isPeak ? ' bc-point-label--peak' : ''),
        x: lx, y: ly,
        'text-anchor': anchor,
      }, n.symbol + '-' + n.mass));
    });
    svg.appendChild(group);
  }

  // ── Tooltip ────────────────────────────────────────────────────────────
  function showTooltip(entry) {
    if (!tooltipEl) return;
    const n = entry.nuclide;
    tooltipEl.innerHTML =
      '<div class="bc-tooltip__name">' + escapeHtml(n.name) + '</div>' +
      '<div class="bc-tooltip__row">' + n.protons + ' protones · ' + n.neutrons + ' neutrones</div>' +
      '<div class="bc-tooltip__row"><strong>' + n.bePerNucleon.toFixed(3) + '</strong> MeV/A</div>';
    tooltipEl.classList.add('show');
    tooltipEl.setAttribute('aria-hidden', 'false');

    // Position after the browser has laid out the tooltip so we can measure it.
    requestAnimationFrame(() => positionTooltip(entry));
  }

  function positionTooltip(entry) {
    if (!tooltipEl || !svg || !chartEl) return;
    const chartRect = chartEl.getBoundingClientRect();
    const svgRect = svg.getBoundingClientRect();
    const scaleX = svgRect.width / VB_W;
    const scaleY = svgRect.height / VB_H;
    const pixelX = (svgRect.left - chartRect.left) + entry.cx * scaleX;
    const pixelY = (svgRect.top - chartRect.top) + entry.cy * scaleY;
    const ttRect = tooltipEl.getBoundingClientRect();

    const inTopFifth = (entry.cy - M.top) / PLOT_H < 0.2;
    const offset = 12;
    let top = inTopFifth ? pixelY + offset : pixelY - ttRect.height - offset;
    let left = pixelX - ttRect.width / 2;

    // Clamp horizontally to the chart container so the tooltip never spills out.
    left = Math.max(4, Math.min(chartRect.width - ttRect.width - 4, left));
    if (top < 4) top = pixelY + offset;
    tooltipEl.style.left = left + 'px';
    tooltipEl.style.top = top + 'px';
  }

  function hideTooltip() {
    if (!tooltipEl) return;
    tooltipEl.classList.remove('show');
    tooltipEl.setAttribute('aria-hidden', 'true');
  }

  // ── Selected nuclide info card ─────────────────────────────────────────
  function selectNuclide(n) {
    if (!infoEl) return;
    let html = '<h3>Núclido seleccionado</h3>';
    html +=
      '<dl class="binding-curve__info-grid">' +
        '<dt>Nombre</dt><dd>' + escapeHtml(n.name) + '</dd>' +
        '<dt>Símbolo</dt><dd><sup>' + n.mass + '</sup>' + escapeHtml(n.symbol) + '</dd>' +
        '<dt>Composición</dt><dd>' + n.protons + ' protones, ' + n.neutrons + ' neutrones</dd>' +
        '<dt>Energía de enlace</dt><dd>' + n.bePerNucleon.toFixed(3) + ' MeV/A</dd>' +
      '</dl>';
    if (n.notes) {
      html += '<p class="binding-curve__info-notes">' + escapeHtml(n.notes) + '</p>';
    }
    infoEl.innerHTML = html;
  }

  // ── Lookup helpers ─────────────────────────────────────────────────────
  function lookupNuclide(mass) {
    return (window.NUCLIDES || []).find((n) => n.mass === mass) || null;
  }
  function lookupPoint(mass) {
    return pointsByMass.get(mass) || null;
  }

  // ── Public API: highlightReactants ─────────────────────────────────────
  function highlightReactants(massNumbers) {
    if (!highlightOverlay) return;
    if (!Array.isArray(massNumbers)) massNumbers = [massNumbers];
    const seen = new Set();
    massNumbers.forEach((mass) => {
      const entry = lookupPoint(mass);
      if (!entry) {
        console.warn('[BindingCurve] No nuclide found with mass number ' + mass);
        return;
      }
      entry.circle.classList.add('bc-point--reactant');
      if (seen.has(mass)) return;       // duplicate: pulse the same point once
      seen.add(mass);

      const ring = svgEl('circle', {
        class: 'bc-highlight-ring bc-highlight-ring--reactant',
        cx: entry.cx, cy: entry.cy,
        r: 12,
        'data-mass': String(mass),
        'data-role': 'reactant',
      });
      highlightOverlay.appendChild(ring);
    });
  }

  // ── Public API: highlightProduct ───────────────────────────────────────
  function highlightProduct(massNumber, isMoreStable) {
    if (!highlightOverlay) return;
    const entry = lookupPoint(massNumber);
    if (!entry) {
      console.warn('[BindingCurve] No nuclide found with mass number ' + massNumber);
      return;
    }
    const ptCls = isMoreStable ? 'bc-point--product-stable' : 'bc-point--product-unstable';
    const ringCls = isMoreStable ? 'bc-highlight-ring--product-stable' : 'bc-highlight-ring--product-unstable';
    entry.circle.classList.add(ptCls);
    const ring = svgEl('circle', {
      class: 'bc-highlight-ring ' + ringCls,
      cx: entry.cx, cy: entry.cy,
      r: 14,
      'data-mass': String(massNumber),
      'data-role': 'product',
    });
    highlightOverlay.appendChild(ring);
  }

  // ── Public API: showFusionPath ─────────────────────────────────────────
  function showFusionPath(reactants, product) {
    if (!highlightOverlay) return;
    clearHighlights();
    if (!Array.isArray(reactants)) reactants = [reactants];

    // Resolve reactants (preserving duplicates so the mean is computed correctly).
    const reactantNuclides = [];
    reactants.forEach((mass) => {
      const n = lookupNuclide(mass);
      if (!n) {
        console.warn('[BindingCurve] No nuclide found with mass number ' + mass);
        return;
      }
      reactantNuclides.push(n);
    });

    // Highlight whichever reactants we found.
    highlightReactants(reactants);

    // Resolve product. If missing, log + bail; reactants stay highlighted.
    const productNuclide = lookupNuclide(product);
    if (!productNuclide) {
      console.warn('[BindingCurve] No nuclide found with mass number ' + product);
      return;
    }

    if (reactantNuclides.length === 0) {
      // No reactants resolved — can't compute delta. Show product as stable by default.
      highlightProduct(product, true);
      return;
    }

    // Average BE/A across reactants (duplicates count).
    const meanReactBE = reactantNuclides.reduce((s, n) => s + n.bePerNucleon, 0) / reactantNuclides.length;
    const productBE = productNuclide.bePerNucleon;
    const isMoreStable = productBE > meanReactBE;
    const delta = productBE - meanReactBE;

    highlightProduct(product, isMoreStable);

    // Arrow from reactant centroid → product point, curved upward.
    const sx = reactantNuclides.reduce((s, n) => s + xScale(n.mass), 0) / reactantNuclides.length;
    const sy = reactantNuclides.reduce((s, n) => s + yScale(n.bePerNucleon), 0) / reactantNuclides.length;
    const tx = xScale(productNuclide.mass);
    const ty = yScale(productNuclide.bePerNucleon);

    const cx = (sx + tx) / 2;
    const cy = Math.max(M.top + 6, ((sy + ty) / 2) - 40);

    const arrow = svgEl('path', {
      class: 'bc-fusion-arrow',
      d: 'M ' + sx + ' ' + sy + ' Q ' + cx + ' ' + cy + ' ' + tx + ' ' + ty,
      fill: 'none',
      'marker-end': 'url(#bc-arrow-head)',
    });
    arrowGroup.appendChild(arrow);

    // Energy delta label near the product point.
    const sign = isMoreStable ? '+' : '−';   // proper minus glyph
    const word = isMoreStable ? 'liberada' : 'requerida';
    const deltaText = sign + Math.abs(delta).toFixed(2) + ' MeV/A ' + word;

    // Default placement: above product. Flip below if too close to chart top.
    const productTooHigh = (ty - M.top) / PLOT_H < 0.18;
    let labelX = tx;
    let labelY = productTooHigh ? ty + 26 : ty - 22;
    let anchor = 'middle';

    // Clamp horizontally so the label stays inside the plot area.
    if (labelX > M.left + PLOT_W - 70) {
      labelX = M.left + PLOT_W - 6;
      anchor = 'end';
    } else if (labelX < M.left + 70) {
      labelX = M.left + 6;
      anchor = 'start';
    }

    const deltaCls =
      'bc-energy-delta ' +
      (isMoreStable ? 'bc-energy-delta--released' : 'bc-energy-delta--required');
    deltaGroup.appendChild(svgEl('text', {
      class: deltaCls,
      x: labelX, y: labelY,
      'text-anchor': anchor,
    }, deltaText));
  }

  // ── Public API: clearHighlights ────────────────────────────────────────
  function clearHighlights() {
    if (highlightOverlay) {
      while (highlightOverlay.firstChild) highlightOverlay.removeChild(highlightOverlay.firstChild);
    }
    allPointEntries.forEach((entry) => {
      entry.circle.classList.remove(
        'bc-point--reactant',
        'bc-point--product-stable',
        'bc-point--product-unstable'
      );
    });
    if (arrowGroup) {
      while (arrowGroup.firstChild) arrowGroup.removeChild(arrowGroup.firstChild);
    }
    if (deltaGroup) {
      while (deltaGroup.firstChild) deltaGroup.removeChild(deltaGroup.firstChild);
    }
  }

  // ── Misc ───────────────────────────────────────────────────────────────
  function escapeHtml(s) {
    return String(s)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  // ── Public surface ─────────────────────────────────────────────────────
  window.BindingCurve = {
    init: init,
    highlightReactants: highlightReactants,
    highlightProduct: highlightProduct,
    showFusionPath: showFusionPath,
    clearHighlights: clearHighlights,
  };

  // Auto-render once the container is in the DOM.
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => init('binding-curve-chart'));
  } else {
    init('binding-curve-chart');
  }
})();
