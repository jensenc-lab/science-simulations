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
    { step: '1', label: 'Comb. H' },
    { step: '2', label: 'Comb. He' },
    { step: '3', label: 'Comb. C' },
    { step: '4', label: 'Comb. Ne' },
    { step: '5', label: 'Comb. O' },
    { step: '6', label: 'Comb. Si' },
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
  // Supernova animation state (rAF-driven, mirrors the star-life-cycle pattern).
  let animFrameId = null;
  let animStartTime = 0;
  let initialized = false;

  // RGB triples for the iron-core flash interpolation. The base value matches
  // the --st-fe CSS variable; we lerp toward white at the flash peak.
  const FE_RGB_BASE  = [90, 96, 104];
  const FE_RGB_WHITE = [255, 255, 255];

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
        '<ol class="st__progress" role="tablist" aria-label="Etapas de combustión estelar"></ol>' +
        '<div class="st__main">' +
          '<div class="st__star" id="st-star">' + buildStarSvg() + '</div>' +
          '<div class="st__details" id="st-details" aria-live="polite"></div>' +
        '</div>' +
        '<div class="st__controls">' +
          '<button class="st__btn" type="button" id="st-prev">← Etapa anterior</button>' +
          '<button class="st__btn" type="button" id="st-reset">Reiniciar estrella</button>' +
          '<button class="st__btn st__btn--primary" type="button" id="st-next">Siguiente etapa →</button>' +
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
      'role="img" aria-label="Sección transversal de una estrella masiva mostrando capas de combustión concéntricas">' +
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
      btn.setAttribute('aria-label', stage.name + ', etapa ' + (i + 1) + ' de ' + STAGE_COUNT);
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
      // UI / progress-bar path: run the main animation directly. The
      // reduced-motion check is intentionally scoped to the public
      // triggerSupernova() API so this byte-for-byte matches the working
      // Chunk-4 path and isn't affected by the system motion preference.
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
      // Same as setStage: bypass the reduced-motion check for the UI button
      // so this path is byte-for-byte identical to the working Chunk-4 code.
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
    if (prefersReducedMotion()) {
      runSupernovaReducedMotion();
      return;
    }
    runSupernovaAnimation();
  }

  function prefersReducedMotion() {
    try {
      return !!(window.matchMedia &&
                window.matchMedia('(prefers-reduced-motion: reduce)').matches);
    } catch (_) {
      return false;
    }
  }

  // ── Reduced-motion supernova: brief white flash, then snap to outcome ─
  // ~300ms total, no kinetic explosion. Still gives a clear "something
  // dramatic happened, here's the result" moment.
  //
  // ISOLATION: this helper deliberately uses a freshly-injected <div> overlay
  // (`.st__rm-flash`) rather than a CSS pseudo-element on .st__star or any
  // shared animation class. It does not touch the rAF loop's state machinery
  // (animFrameId, animStartTime, phaseState) and is only ever called via the
  // public triggerSupernova() entry point — never from the UI button path,
  // which goes straight to runSupernovaAnimation() byte-for-byte.
  function runSupernovaReducedMotion() {
    if (animating) return;
    animating = true;
    updateControls();

    // Inject a one-shot overlay div. Removed at the end of the animation so
    // it never sits on top of the SVG while the main animation might run.
    let overlay = null;
    if (starEl) {
      overlay = document.createElement('div');
      overlay.className = 'st__rm-flash';
      starEl.appendChild(overlay);
    }

    animationTimers.push(setTimeout(() => {
      // Mid-flash: hide shells, switch to post-supernova, show remnant,
      // render the details panel including the heavy-element cards.
      Object.keys(SHELL_GEOMETRY).forEach((k) => {
        if (shellNodes[k]) {
          shellNodes[k].setAttribute('r', String(SHELL_GEOMETRY[k].r));
          shellNodes[k].style.opacity = '0';
        }
        if (labelNodes[k]) labelNodes[k].style.opacity = '0';
      });
      if (shellNodes.fe) {
        shellNodes.fe.removeAttribute('fill');
        shellNodes.fe.style.filter = '';
      }
      currentStage = POST_SUPERNOVA_INDEX;
      postSupernova = true;
      if (postSupernovaGroup) {
        postSupernovaGroup.classList.add('st__post-supernova--visible');
      }
      renderSupernovaDetails(true);
      updateProgressBar();
    }, 150));

    animationTimers.push(setTimeout(() => {
      // Remove the overlay div so subsequent main-path runs aren't sitting
      // under an invisible white rectangle.
      if (overlay && overlay.parentNode) overlay.parentNode.removeChild(overlay);
      animating = false;
      updateControls();
    }, 300));
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
    if (postSupernovaGroup) {
      postSupernovaGroup.classList.remove('st__post-supernova--visible');
      // Drop any inline opacity left over from the rAF-driven fade-in so the
      // CSS rule (.st__post-supernova { opacity: 0; transition: opacity }) can
      // run the graceful fade-out.
      postSupernovaGroup.style.opacity = '';
    }
    if (detailsEl) detailsEl.classList.remove('st__details--reveal');
  }

  // ── Supernova animation ────────────────────────────────────────────────
  // Mirrors the pattern used by the working ESS.1.3 (Star Life Cycle) sim:
  // a single requestAnimationFrame loop that computes elapsed time each
  // frame and writes SVG attributes directly (setAttribute('r', …),
  // style.opacity = …). CSS keyframes can be fragile on SVG-internal
  // elements (transform-origin / transform-box quirks, animation rules
  // racing with inline styles set by applyShellVisibility); driving the
  // values from JS sidesteps all of that.
  //
  // Timeline:
  //   t =    0 –  150ms : Fe core flashes — fill lerps gray→white→gray,
  //                       radius shrinks ~25% at peak, glow halo brightens.
  //   t =  150 –  750ms : All shells + core expand outward (r scales 1→2.5)
  //                       and fade opacity 1→0. Shell labels drop instantly.
  //   t =  750 – 1150ms : Shells hidden, post-supernova group fades in via
  //                       inline opacity driven by this same rAF loop.
  //                       Details panel header (no cards yet) is rendered.
  //   t = 1150 – 1450ms : Heavy-element cards injected; their fade/slide-in
  //                       runs from the .st__details--reveal CSS rule
  //                       (HTML divs — CSS animations on these are reliable).
  //   t ≥ 1450          : Cleanup. rAF loop stops.
  function runSupernovaAnimation() {
    if (animating) return;
    animating = true;
    updateControls();

    const allKeys = ['h', 'he', 'c', 'ne', 'o', 'si', 'fe'];
    let phaseState = 0;

    animStartTime = (typeof performance !== 'undefined' && performance.now)
      ? performance.now() : Date.now();

    function frame(now) {
      // The loop is also self-cancelling: if cancelAnimation() flipped the
      // flag, just stop without scheduling another frame.
      if (!animating) { animFrameId = null; return; }

      const elapsed = now - animStartTime;

      if (elapsed < 150) {
        // ── Phase 1: iron-core flash ───────────────────────────────────────
        if (phaseState !== 1) phaseState = 1;
        // Sawtooth peak at the midpoint so it brightens then dims.
        const peak = elapsed < 75 ? (elapsed / 75) : ((150 - elapsed) / 75);
        const rgb = lerpRgb(FE_RGB_BASE, FE_RGB_WHITE, peak);
        if (shellNodes.fe) {
          shellNodes.fe.setAttribute('fill', 'rgb(' + rgb[0] + ',' + rgb[1] + ',' + rgb[2] + ')');
          shellNodes.fe.setAttribute('r', String(SHELL_GEOMETRY.fe.r * (1 - 0.25 * peak)));
          shellNodes.fe.style.filter =
            'drop-shadow(0 0 ' + (4 + 14 * peak).toFixed(1) + 'px rgba(255,255,255,' +
            (0.35 + 0.6 * peak).toFixed(2) + '))';
        }
      } else if (elapsed < 750) {
        // ── Phase 2: explosion ─────────────────────────────────────────────
        if (phaseState !== 2) {
          phaseState = 2;
          // Reset Fe to its CSS-driven look once the flash ends — the explode
          // phase will scale and fade Fe alongside the other shells.
          if (shellNodes.fe) {
            shellNodes.fe.removeAttribute('fill');
            shellNodes.fe.style.filter = '';
          }
          // Drop labels instantly so they don't smear through the explosion.
          allKeys.forEach((k) => {
            if (labelNodes[k]) labelNodes[k].style.opacity = '0';
          });
        }
        const t = (elapsed - 150) / 600;             // 0..1
        const eased = 1 - Math.pow(1 - t, 2);        // ease-out quadratic
        const rScale = 1 + 1.5 * eased;              // 1 → 2.5
        const opacity = (1 - eased).toFixed(3);
        allKeys.forEach((k) => {
          const node = shellNodes[k];
          if (!node) return;
          node.setAttribute('r', String(SHELL_GEOMETRY[k].r * rScale));
          node.style.opacity = opacity;
        });
      } else if (elapsed < 1150) {
        // ── Phase 3: remnant fade-in ───────────────────────────────────────
        if (phaseState !== 3) {
          phaseState = 3;
          // One-shot setup on phase entry: snap shells to their resting
          // geometry (hidden), promote state to post-supernova, populate
          // the details header (no cards yet — those land in phase 4).
          allKeys.forEach((k) => {
            const node = shellNodes[k];
            if (!node) return;
            node.setAttribute('r', String(SHELL_GEOMETRY[k].r));
            node.style.opacity = '0';
          });
          currentStage = POST_SUPERNOVA_INDEX;
          postSupernova = true;
          if (postSupernovaGroup) {
            postSupernovaGroup.classList.add('st__post-supernova--visible');
          }
          renderSupernovaDetails(false);
          updateProgressBar();
        }
        const fadeT = (elapsed - 750) / 400;         // 0..1
        if (postSupernovaGroup) postSupernovaGroup.style.opacity = fadeT.toFixed(3);
      } else if (elapsed < 1450) {
        // ── Phase 4: heavy-element cards reveal ────────────────────────────
        if (phaseState !== 4) {
          phaseState = 4;
          if (postSupernovaGroup) postSupernovaGroup.style.opacity = '1';
          // Inject cards now and add the reveal class. Cards are HTML divs,
          // so the CSS stagger animation on them is reliable.
          renderSupernovaDetails(true);
          detailsEl.classList.add('st__details--reveal');
        }
        // Nothing more to interpolate this phase; the rAF tick is just
        // waiting out the reveal animation.
      } else {
        // ── Phase 5: cleanup, animation complete ───────────────────────────
        if (postSupernovaGroup) postSupernovaGroup.style.opacity = '';
        if (detailsEl) detailsEl.classList.remove('st__details--reveal');
        animating = false;
        animFrameId = null;
        updateControls();
        return; // do NOT request another frame
      }

      animFrameId = requestAnimationFrame(frame);
    }

    animFrameId = requestAnimationFrame(frame);
  }

  function cancelAnimation() {
    if (animFrameId !== null) {
      cancelAnimationFrame(animFrameId);
      animFrameId = null;
    }
    animationTimers.forEach(clearTimeout);
    animationTimers = [];
    // Restore SVG attributes/styles to their resting values so the destination
    // snap (whatever snapToStage decides next) sees a clean baseline.
    Object.keys(SHELL_GEOMETRY).forEach((k) => {
      const node = shellNodes[k];
      if (node) node.setAttribute('r', String(SHELL_GEOMETRY[k].r));
      if (labelNodes[k]) labelNodes[k].style.opacity = '';
    });
    if (shellNodes.fe) {
      shellNodes.fe.removeAttribute('fill');
      shellNodes.fe.style.filter = '';
    }
    if (postSupernovaGroup) postSupernovaGroup.style.opacity = '';
    if (detailsEl) detailsEl.classList.remove('st__details--reveal');
    // If a reduced-motion flash overlay was mid-flight, remove it cleanly.
    if (starEl) {
      const stray = starEl.querySelector('.st__rm-flash');
      if (stray && stray.parentNode) stray.parentNode.removeChild(stray);
    }
    animating = false;
  }

  // RGB lerp helper used by the iron-core flash. Returns a [r, g, b] tuple.
  function lerpRgb(c1, c2, t) {
    return [
      Math.round(c1[0] + (c2[0] - c1[0]) * t),
      Math.round(c1[1] + (c2[1] - c1[1]) * t),
      Math.round(c1[2] + (c2[2] - c1[2]) * t),
    ];
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
      nextBtn.textContent = '⚡ Desencadenar supernova';
    } else {
      nextBtn.classList.remove('st__btn--supernova');
      nextBtn.classList.add('st__btn--primary');
      nextBtn.textContent = 'Siguiente etapa →';
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
        '<dt>Temperatura</dt><dd>' + formatTemp(stage.tempMK) + '</dd>' +
        '<dt>Combustible</dt><dd>' + escapeHtml(fuel) + '</dd>' +
        '<dt>Producto</dt><dd>' + escapeHtml(product) + '</dd>' +
      '</dl>' +
      '<p class="st__desc">' + escapeHtml(stage.description) + '</p>' +
      '<p class="st__energy st__energy--released">' +
        '<span class="st__energy-icon" aria-hidden="true">⚡</span> Esta etapa libera energía.' +
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
        '<dt>Temperatura</dt><dd>Miles de millones de K (durante el colapso y la onda de choque)</dd>' +
        '<dt>Desencadenante</dt><dd>Colapso del núcleo de hierro</dd>' +
        '<dt>Productos</dt><dd>Elementos pesados (masa &gt; 56)</dd>' +
      '</dl>' +
      '<p class="st__desc">' + escapeHtml(stage.description) + '</p>' +
      '<p class="st__energy st__energy--required">' +
        '<span class="st__energy-icon" aria-hidden="true">🥶</span> Esto requiere aporte de energía desde el colapso gravitacional y la onda de choque.' +
      '</p>';
    if (includeCards) {
      const cards = stage.productMass.map(buildElementCard).join('');
      html +=
        '<h4 class="st__elements-heading">Elementos pesados forjados</h4>' +
        '<div class="st__elements">' + cards + '</div>';
    }
    detailsEl.innerHTML = html;
  }

  function buildElementCard(mass) {
    const n = nuclideByMass(mass);
    if (!n) {
      return '<div class="st__element-card"><div class="st__element-name">masa ' + mass + '</div></div>';
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
    return n ? stripParen(n.name) : 'masa ' + mass;
  }
  function formatTemp(mK) {
    if (typeof mK !== 'number') return String(mK);
    return mK + ' millones de K';
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
