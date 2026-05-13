// Stellar Nucleosynthesis Tracker — walks students through the seven stages
// of massive-star burning (H → He → C → Ne → O → Si) and the supernova that
// forges everything heavier than iron. Self-contained: does not call into
// BindingCurve or FusionBench.

(function () {
  'use strict';

  // ── Constants ──────────────────────────────────────────────────────────
  const STAGE_COUNT = 7;
  const POST_SUPERNOVA_INDEX = 6;

  // Outer → inner shell order per stage (0–5). Stage 5 adds Si + Fe core.
  const SHELLS_PER_STAGE = [
    ['h'],
    ['h', 'he'],
    ['h', 'he', 'c'],
    ['h', 'he', 'c', 'ne'],
    ['h', 'he', 'c', 'ne', 'o'],
    ['h', 'he', 'c', 'ne', 'o', 'si', 'fe'],
  ];

  // Per-stage display info for progress bar.
  const STAGE_DISPLAY = [
    { step: '1', label: 'H burning' },
    { step: '2', label: 'He burning' },
    { step: '3', label: 'C burning' },
    { step: '4', label: 'Ne burning' },
    { step: '5', label: 'O burning' },
    { step: '6', label: 'Si burning' },
    { step: '⚡', label: 'Supernova' },
  ];

  // Shell SVG radii. Concentric circles drawn outer first; inner discs cover
  // the centers, leaving outer rings visible as "shells".
  const SHELL_GEOMETRY = {
    h:  { r: 130 },
    he: { r: 110 },
    c:  { r:  92 },
    ne: { r:  76 },
    o:  { r:  62 },
    si: { r:  48 },
    fe: { r:  28 },
  };

  // Labels positioned near the top of each shell annulus. The label sits at
  // (midRadius of annulus) above the center; for Fe, it sits at the center.
  const SHELL_LABEL_Y = {
    h:  32,    // mid of (130, 110) ≈ 120 → y = 150-120+2
    he: 51,
    c:  68,
    ne: 82,
    o:  96,
    si: 112,
    fe: 154,   // at center
  };

  // Pre-computed scattered ejecta positions (each {x, y, r, delay}). Hand-
  // picked so they spread around the remnant without obvious clustering.
  const EJECTA_DOTS = [
    { x:  90, y:  82, r: 1.6, delay: 0    },
    { x: 215, y:  90, r: 1.3, delay: 200  },
    { x: 240, y: 145, r: 1.5, delay: 80   },
    { x: 218, y: 215, r: 1.4, delay: 320  },
    { x: 155, y: 245, r: 1.2, delay: 140  },
    { x:  85, y: 220, r: 1.5, delay: 240  },
    { x:  58, y: 150, r: 1.3, delay: 60   },
    { x:  72, y:  60, r: 1.0, delay: 380  },
    { x: 250, y:  60, r: 1.0, delay: 180  },
    { x: 260, y: 230, r: 1.1, delay: 120  },
    { x:  45, y: 260, r: 1.0, delay: 300  },
    { x: 110, y:  40, r: 1.0, delay: 90   },
    { x: 200, y: 270, r: 1.2, delay: 360  },
    { x:  35, y: 100, r: 1.1, delay: 270  },
  ];

  // ── State ──────────────────────────────────────────────────────────────
  let containerEl = null;
  let progressEl = null;
  let starEl = null;
  let detailsEl = null;
  let prevBtn = null;
  let resetBtn = null;
  let nextBtn = null;
  let shellNodes = {};
  let labelNodes = {};
  let shellsGroup = null;
  let postSupernovaGroup = null;
  let currentStage = 0;
  let postSupernova = false;
  let animating = false;
  let animationTimers = [];
  let initialized = false;

  // ── Public init ────────────────────────────────────────────────────────
  function init(containerId) {
    if (initialized) return;
    containerEl = document.getElementById(containerId);
    if (!containerEl) {
      console.warn('[StellarTracker] Container #' + containerId + ' not found');
      return;
    }
    if (!window.STELLAR_STAGES || window.STELLAR_STAGES.length < STAGE_COUNT) {
      console.warn('[StellarTracker] STELLAR_STAGES data missing or incomplete');
      return;
    }
    render();
    bindEvents();
    snapToStage(0);
    initialized = true;
  }

  function render() {
    containerEl.classList.add('stellar-tracker');
    containerEl.classList.remove('placeholder');
    containerEl.innerHTML =
      '<div class="st">' +
        '<ol class="st__progress" role="tablist" aria-label="Stellar burning stages"></ol>' +
        '<div class="st__main">' +
          '<div class="st__star" id="st-star">' + buildStarSvg() + '</div>' +
          '<div class="st__details" id="st-details" aria-live="polite"></div>' +
        '</div>' +
        '<div class="st__controls">' +
          '<button class="st__btn" type="button" id="st-prev">← Previous Stage</button>' +
          '<button class="st__btn" type="button" id="st-reset">Reset Star</button>' +
          '<button class="st__btn st__btn--primary" type="button" id="st-next">Next Stage →</button>' +
        '</div>' +
      '</div>';

    progressEl = containerEl.querySelector('.st__progress');
    starEl = containerEl.querySelector('#st-star');
    detailsEl = containerEl.querySelector('#st-details');
    prevBtn = containerEl.querySelector('#st-prev');
    resetBtn = containerEl.querySelector('#st-reset');
    nextBtn = containerEl.querySelector('#st-next');

    // Cache SVG node refs.
    shellsGroup = starEl.querySelector('.st__shells-group');
    postSupernovaGroup = starEl.querySelector('.st__post-supernova');
    Object.keys(SHELL_GEOMETRY).forEach((k) => {
      shellNodes[k] = starEl.querySelector('#st-shell-' + k);
      labelNodes[k] = starEl.querySelector('#st-label-' + k);
    });

    renderProgressBar();
  }

  function buildStarSvg() {
    let shellsSvg = '';
    Object.keys(SHELL_GEOMETRY).forEach((k) => {
      const g = SHELL_GEOMETRY[k];
      shellsSvg +=
        '<circle id="st-shell-' + k + '" class="st__shell st__shell--' + k +
        '" cx="150" cy="150" r="' + g.r + '" />';
    });

    let labelsSvg = '';
    Object.keys(SHELL_LABEL_Y).forEach((k) => {
      const sym = k === 'fe' ? 'Fe'
                : k === 'he' ? 'He'
                : k === 'ne' ? 'Ne'
                : k === 'si' ? 'Si'
                : k.toUpperCase();
      labelsSvg +=
        '<text id="st-label-' + k + '" class="st__shell-label st__shell-label--' + k +
        '" x="150" y="' + SHELL_LABEL_Y[k] + '" text-anchor="middle">' + sym + '</text>';
    });

    // Background sprinkle of static stars.
    const bgStars = [
      [20, 35], [55, 18], [125, 12], [180, 22], [255, 28], [285, 70],
      [275, 165], [290, 240], [255, 285], [180, 290], [85, 285], [22, 250],
      [12, 175], [38, 115],
    ];
    let bgSvg = '';
    bgStars.forEach((p) => {
      bgSvg += '<circle class="st__bg-star" cx="' + p[0] + '" cy="' + p[1] + '" r="0.9"/>';
    });

    // Post-supernova group: remnant + ejecta dots, initially hidden.
    let ejectaSvg = '';
    EJECTA_DOTS.forEach((d, i) => {
      ejectaSvg +=
        '<circle class="st__ejecta" cx="' + d.x + '" cy="' + d.y + '" r="' + d.r +
        '" style="animation-delay:' + d.delay + 'ms"/>';
    });
    const postSvg =
      '<g class="st__post-supernova">' +
        '<circle class="st__remnant-glow" cx="150" cy="150" r="22"/>' +
        '<circle class="st__remnant" cx="150" cy="150" r="9"/>' +
        '<g class="st__ejecta-group">' + ejectaSvg + '</g>' +
      '</g>';

    return (
      '<svg class="st__star-svg" viewBox="0 0 300 300" preserveAspectRatio="xMidYMid meet" ' +
      'role="img" aria-label="Cross-section of a massive star showing concentric burning shells">' +
        '<defs>' +
          '<radialGradient id="st-remnant-grad" cx="50%" cy="50%" r="50%">' +
            '<stop offset="0%" stop-color="#5dade2" stop-opacity="0.55"/>' +
            '<stop offset="100%" stop-color="#5dade2" stop-opacity="0"/>' +
          '</radialGradient>' +
        '</defs>' +
        '<g class="st__bg-stars">' + bgSvg + '</g>' +
        '<g class="st__shells-group">' + shellsSvg + '</g>' +
        '<g class="st__labels-group">' + labelsSvg + '</g>' +
        postSvg +
      '</svg>'
    );
  }

  function renderProgressBar() {
    progressEl.innerHTML = '';
    for (let i = 0; i < STAGE_COUNT; i++) {
      const stage = window.STELLAR_STAGES[i];
      const disp = STAGE_DISPLAY[i];
      const li = document.createElement('li');
      li.className = 'st__progress-item' + (i === POST_SUPERNOVA_INDEX ? ' st__progress-item--supernova' : '');

      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'st__progress-node';
      if (i === POST_SUPERNOVA_INDEX) btn.classList.add('st__progress-node--supernova');
      btn.setAttribute('role', 'tab');
      btn.setAttribute('aria-selected', i === 0 ? 'true' : 'false');
      btn.setAttribute('aria-label', stage.name + ', stage ' + (i + 1) + ' of ' + STAGE_COUNT);
      btn.dataset.stage = String(i);
      btn.innerHTML =
        '<span class="st__progress-step" aria-hidden="true">' + disp.step + '</span>' +
        '<span class="st__progress-label">' + disp.label + '</span>';

      li.appendChild(btn);
      progressEl.appendChild(li);
    }
  }

  function bindEvents() {
    progressEl.addEventListener('click', onProgressClick);
    prevBtn.addEventListener('click', previous);
    resetBtn.addEventListener('click', reset);
    nextBtn.addEventListener('click', next);
  }

  function onProgressClick(e) {
    const btn = e.target.closest('.st__progress-node');
    if (!btn) return;
    const idx = parseInt(btn.dataset.stage, 10);
    if (idx >= 0 && idx < STAGE_COUNT) setStage(idx);
  }

  // ── Public: setStage ───────────────────────────────────────────────────
  function setStage(idx) {
    if (typeof idx !== 'number' || idx < 0 || idx >= STAGE_COUNT) return;
    if (animating) {
      // Aborting an in-flight animation: snap directly to destination
      // (don't re-trigger the supernova even if idx === 6 && currentStage === 5).
      cancelAnimation();
      snapToStage(idx);
      return;
    }
    if (idx === POST_SUPERNOVA_INDEX && currentStage === 5 && !postSupernova) {
      runSupernovaAnimation();
      return;
    }
    snapToStage(idx);
  }

  // ── Public: next ───────────────────────────────────────────────────────
  function next() {
    if (animating) return;
    if (postSupernova) return;
    if (currentStage === 5) {
      runSupernovaAnimation();
      return;
    }
    if (currentStage < 5) {
      const newStage = currentStage + 1;
      const oldKeys = SHELLS_PER_STAGE[currentStage];
      const newKeys = SHELLS_PER_STAGE[newStage];
      const added = newKeys.filter((k) => oldKeys.indexOf(k) === -1);
      currentStage = newStage;
      postSupernova = false;
      hidePostSupernova();
      applyShellVisibility(newKeys);
      added.forEach((k) => pulseShell(k));
      renderDetails();
      updateProgressBar();
      updateControls();
    }
  }

  // ── Public: previous ───────────────────────────────────────────────────
  function previous() {
    if (animating) cancelAnimation();
    if (postSupernova) {
      // Step back from post-supernova → stage 5 silicon burning. No replay.
      snapToStage(5);
      return;
    }
    if (currentStage > 0) snapToStage(currentStage - 1);
  }

  // ── Public: reset ──────────────────────────────────────────────────────
  function reset() {
    if (animating) cancelAnimation();
    snapToStage(0);
  }

  // ── Public: triggerSupernova ───────────────────────────────────────────
  function triggerSupernova() {
    if (animating) return;
    if (currentStage !== 5 || postSupernova) {
      // Jump to stage 5 first (without animation), then trigger.
      snapToStage(5);
    }
    runSupernovaAnimation();
  }

  // ── Snap to a stage with no animation ──────────────────────────────────
  function snapToStage(idx) {
    if (idx === POST_SUPERNOVA_INDEX) {
      currentStage = POST_SUPERNOVA_INDEX;
      postSupernova = true;
      applyShellVisibility([]);
      showPostSupernova();
    } else {
      currentStage = idx;
      postSupernova = false;
      hidePostSupernova();
      applyShellVisibility(SHELLS_PER_STAGE[idx]);
    }
    renderDetails();
    updateProgressBar();
    updateControls();
  }

  // ── Shell visibility ───────────────────────────────────────────────────
  function applyShellVisibility(visibleKeys) {
    Object.keys(SHELL_GEOMETRY).forEach((k) => {
      const on = visibleKeys.indexOf(k) !== -1;
      if (shellNodes[k]) shellNodes[k].style.opacity = on ? '1' : '0';
      if (labelNodes[k]) labelNodes[k].style.opacity = on ? '1' : '0';
    });
  }

  function pulseShell(key) {
    const node = shellNodes[key];
    if (!node) return;
    node.classList.remove('st__shell--pulse');
    void node.offsetWidth; // force reflow so the animation can re-trigger
    node.classList.add('st__shell--pulse');
    // Clean up after the animation completes so re-application works.
    const t = setTimeout(() => {
      node.classList.remove('st__shell--pulse');
    }, 450);
    animationTimers.push(t);
  }

  function showPostSupernova() {
    if (postSupernovaGroup) postSupernovaGroup.classList.add('st__post-supernova--visible');
  }
  function hidePostSupernova() {
    if (postSupernovaGroup) postSupernovaGroup.classList.remove('st__post-supernova--visible');
    clearAnimationClasses();
  }

  function clearAnimationClasses() {
    if (shellNodes.fe) shellNodes.fe.classList.remove('st__core--flashing');
    Object.keys(SHELL_GEOMETRY).forEach((k) => {
      if (shellNodes[k]) shellNodes[k].classList.remove('st__shell--exploding');
    });
    if (detailsEl) detailsEl.classList.remove('st__details--reveal');
  }

  // ── Supernova animation ────────────────────────────────────────────────
  // Timeline (per the chunk-4 amendment):
  //   t =    0 –  150ms : Fe core flashes white. Shells stay fully visible.
  //   t =  150 –  750ms : All six shells + Fe core scale to ~3× and fade to 0.
  //   t =  750         : Exploded shells hidden. Remnant + ejecta injected at
  //                       opacity 0; CSS fades them in over the next 400ms.
  //   t =  750 – 1150ms : Remnant/ejecta fade in. Supernova details (header
  //                       only — no cards yet) populated immediately.
  //   t = 1150         : "Heavy elements forged" cards injected into the
  //                       details panel; CSS staggers their fade/slide-in.
  //   t = 1150 – 1450ms : Cards reveal animation runs.
  function runSupernovaAnimation() {
    if (animating) return;
    animating = true;
    updateControls();

    const allKeys = ['h', 'he', 'c', 'ne', 'o', 'si', 'fe'];

    // Phase 1 (0 – 150ms): Iron core flash. Shells stay visible.
    if (shellNodes.fe) shellNodes.fe.classList.add('st__core--flashing');

    // Phase 2 (150 – 750ms): Shells + core scale outward and fade.
    animationTimers.push(setTimeout(() => {
      if (shellNodes.fe) shellNodes.fe.classList.remove('st__core--flashing');
      allKeys.forEach((k) => {
        if (shellNodes[k]) shellNodes[k].classList.add('st__shell--exploding');
        // Labels drop out instantly so they don't smear through the explosion.
        if (labelNodes[k]) labelNodes[k].style.opacity = '0';
      });
    }, 150));

    // t = 750: Hide the exploded shells, switch state to post-supernova, show
    // remnant + ejecta (their CSS fades them in), render the supernova details
    // header without cards yet.
    animationTimers.push(setTimeout(() => {
      allKeys.forEach((k) => {
        if (shellNodes[k]) {
          shellNodes[k].classList.remove('st__shell--exploding');
          shellNodes[k].style.opacity = '0';
        }
      });
      currentStage = POST_SUPERNOVA_INDEX;
      postSupernova = true;
      showPostSupernova();
      renderSupernovaDetails(false);
      updateProgressBar();
    }, 750));

    // t = 1150: Re-render details WITH the heavy-element cards and trigger
    // their staggered fade/slide-in via the --reveal class.
    animationTimers.push(setTimeout(() => {
      renderSupernovaDetails(true);
      detailsEl.classList.add('st__details--reveal');
    }, 1150));

    // t = 1450: Animation done. Drop the reveal class and unlock controls.
    animationTimers.push(setTimeout(() => {
      detailsEl.classList.remove('st__details--reveal');
      animating = false;
      updateControls();
    }, 1450));
  }

  function cancelAnimation() {
    animationTimers.forEach(clearTimeout);
    animationTimers = [];
    clearAnimationClasses();
    // Also clear any inline label-opacity overrides we applied mid-flight;
    // applyShellVisibility (called next by snapToStage) will re-set them.
    Object.keys(SHELL_GEOMETRY).forEach((k) => {
      if (labelNodes[k]) labelNodes[k].style.opacity = '';
    });
    animating = false;
  }

  // ── Progress bar + controls ────────────────────────────────────────────
  function updateProgressBar() {
    const nodes = progressEl.querySelectorAll('.st__progress-node');
    nodes.forEach((node, i) => {
      const isActive = (i === currentStage && !postSupernova) || (i === POST_SUPERNOVA_INDEX && postSupernova);
      const isVisited = (i < currentStage) || (postSupernova && i < POST_SUPERNOVA_INDEX);
      node.classList.toggle('st__progress-node--active', isActive);
      node.classList.toggle('st__progress-node--visited', isVisited && !isActive);
      node.classList.toggle('st__progress-node--future', !isActive && !isVisited);
      node.setAttribute('aria-selected', isActive ? 'true' : 'false');
      // Every node stays tab-focusable; <button> default behavior is fine.
    });
  }

  function updateControls() {
    // Previous: enabled unless we're at stage 0 AND not post-supernova; disabled mid-animation.
    prevBtn.disabled = animating || (currentStage === 0 && !postSupernova);
    // Reset: always clickable so it can abort an in-flight supernova animation.
    resetBtn.disabled = false;
    nextBtn.disabled = animating || postSupernova;

    // Next button changes appearance at stage 5.
    const onSilicon = currentStage === 5 && !postSupernova && !animating;
    if (onSilicon) {
      nextBtn.classList.add('st__btn--supernova');
      nextBtn.classList.remove('st__btn--primary');
      nextBtn.textContent = '⚡ Trigger Supernova';
    } else {
      nextBtn.classList.remove('st__btn--supernova');
      nextBtn.classList.add('st__btn--primary');
      nextBtn.textContent = 'Next Stage →';
    }
  }

  // ── Details panel ──────────────────────────────────────────────────────
  function renderDetails() {
    if (currentStage === POST_SUPERNOVA_INDEX && postSupernova) {
      // Steady-state post-supernova always shows the cards. Mid-animation,
      // runSupernovaAnimation calls renderSupernovaDetails(false) at t=750
      // and renderSupernovaDetails(true) at t=1150 directly.
      renderSupernovaDetails(true);
    } else {
      renderRegularDetails();
    }
  }

  function renderRegularDetails() {
    const stage = window.STELLAR_STAGES[currentStage];
    const fuel = stage.fuelMass.map(massToName).join(', ');
    const product = stage.productMass.map(massToName).join(', ');
    detailsEl.innerHTML =
      '<h3 class="st__stage-name">' + escapeHtml(stage.name) + '</h3>' +
      '<dl class="st__stats">' +
        '<dt>Temperature</dt><dd>' + formatTemp(stage.tempMK) + '</dd>' +
        '<dt>Fuel</dt><dd>' + escapeHtml(fuel) + '</dd>' +
        '<dt>Product</dt><dd>' + escapeHtml(product) + '</dd>' +
      '</dl>' +
      '<p class="st__desc">' + escapeHtml(stage.description) + '</p>' +
      '<p class="st__energy st__energy--released">' +
        '<span class="st__energy-icon" aria-hidden="true">⚡</span> This stage releases energy.' +
      '</p>';
  }

  // When called mid-supernova animation, includeCards is false at t=750 so
  // the header/stats/desc/energy populate while the remnant fades in, then
  // true at t=1150 to inject the heavy-element cards for the reveal stagger.
  function renderSupernovaDetails(includeCards) {
    const stage = window.STELLAR_STAGES[POST_SUPERNOVA_INDEX];
    let html =
      '<h3 class="st__stage-name">' + escapeHtml(stage.name) + '</h3>' +
      '<dl class="st__stats">' +
        '<dt>Temperature</dt><dd>Billions of K (during collapse and shockwave)</dd>' +
        '<dt>Trigger</dt><dd>Iron-core collapse</dd>' +
        '<dt>Products</dt><dd>Heavy elements (mass &gt; 56)</dd>' +
      '</dl>' +
      '<p class="st__desc">' + escapeHtml(stage.description) + '</p>' +
      '<p class="st__energy st__energy--required">' +
        '<span class="st__energy-icon" aria-hidden="true">🥶</span> This requires energy input from the gravitational collapse and shockwave.' +
      '</p>';
    if (includeCards) {
      const cards = stage.productMass.map(buildElementCard).join('');
      html +=
        '<h4 class="st__elements-heading">Heavy elements forged</h4>' +
        '<div class="st__elements">' + cards + '</div>';
    }
    detailsEl.innerHTML = html;
  }

  function buildElementCard(mass) {
    const n = nuclideByMass(mass);
    if (!n) {
      return '<div class="st__element-card"><div class="st__element-name">mass ' + mass + '</div></div>';
    }
    const notes = n.notes
      ? '<div class="st__element-notes">' + escapeHtml(n.notes) + '</div>'
      : '';
    return (
      '<div class="st__element-card">' +
        '<div class="st__element-mass">' + n.mass + '</div>' +
        '<div class="st__element-symbol">' + escapeHtml(n.symbol) + '</div>' +
        '<div class="st__element-name">' + escapeHtml(stripParen(n.name)) + '</div>' +
        notes +
      '</div>'
    );
  }

  // ── Helpers ────────────────────────────────────────────────────────────
  function nuclideByMass(mass) {
    const list = window.NUCLIDES || [];
    return list.find((n) => n.mass === mass) || null;
  }
  function massToName(mass) {
    const n = nuclideByMass(mass);
    return n ? stripParen(n.name) : 'mass ' + mass;
  }
  function formatTemp(mK) {
    if (typeof mK !== 'number') return String(mK);
    return mK + ' million K';
  }
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
  window.StellarTracker = {
    init: init,
    setStage: setStage,
    next: next,
    previous: previous,
    reset: reset,
    triggerSupernova: triggerSupernova,
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => init('stellar-tracker'));
  } else {
    init('stellar-tracker');
  }
})();
