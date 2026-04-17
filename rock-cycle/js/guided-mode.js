// ── guided-mode.js ────────────────────────────────────────────────────────────
// Rock Cycle Lab — Utah SEEd 7.2.1
// 10-step guided investigation: step data, UI, completion checks, zone gating

'use strict';

// ── Guided State ──────────────────────────────────────────────────────────────

const guidedState = {
  active:            false,
  currentStep:       0,
  subStep:           0,
  stepsCompleted:    new Set(),
  stepData:          {},        // per-step scratch (e.g. clickedTypes Set)
  stepCompletedFlag: false      // true → waiting for student to click Next
};

// ── The 10 Guided Steps ──────────────────────────────────────────────────────

const GUIDED_STEPS = [
  /* 0 — Meet the Rocks */
  {
    title: 'Meet the Rocks',
    instruction: "Welcome! Let's explore how rocks transform. Click on at least 3 different rocks — try one from each family: Igneous (orange), Sedimentary (gold), and Metamorphic (purple).",
    hint: '💡 Look for the colored labels on the left shelf.',
    enabledZones: [],
    highlight: { shelf: true },
    check: 'select-types',
    completionMessage: "Great! You've seen the three rock families. Notice how each type formed in a completely different way.",
    autoSelect: null,
    subSteps: null
  },

  /* 1 — Melting */
  {
    title: 'Melting',
    instruction: 'Drag GRANITE from the shelf into the Melting zone (🌋). Watch what happens!',
    hint: '💡 Look for the glowing zone on the left!',
    enabledZones: ['melting'],
    highlight: { rocks: ['granite'], zones: ['melting'] },
    check: 'transform:granite:melting:magma',
    completionMessage: "Granite melted into magma! The energy came from deep inside Earth. The same minerals are still there — they're just liquid now.",
    autoSelect: 'granite',
    subSteps: null
  },

  /* 2 — Crystallization (two sub-steps) */
  {
    title: 'Crystallization',
    enabledZones: ['crystallization'],
    highlight: { zones: ['crystallization'] },
    check: null,
    completionMessage: null,
    autoSelect: null,
    autoLoadSpecimen: 'magma',
    subSteps: [
      {
        instruction: "Your magma is underground. Drag it into the Crystallization zone (❄️) and choose 'Slow Cooling.'",
        hint: '💡 Slow cooling = time for big crystals to grow.',
        check: 'transform:*:crystallization:granite',
        highlightPopupChoice: 'slow',
        completionMessage: "Slow cooling deep underground = BIG crystals you can see! That's how granite forms. Now let's try fast cooling...",
        afterComplete: 'loadMagma'
      },
      {
        instruction: "Try again — drag the magma to Crystallization and choose 'Fast Cooling.'",
        hint: '💡 Fast cooling = tiny or no crystals.',
        check: 'transform:*:crystallization:basalt',
        highlightPopupChoice: 'fast',
        completionMessage: "Fast cooling on the surface = tiny crystals! Same magma, different rock — because cooling speed matters.",
        afterComplete: null
      }
    ]
  },

  /* 3 — Weathering & Erosion */
  {
    title: 'Weathering & Erosion',
    instruction: 'Drag any rock from the shelf into the Weathering zone (🌧️). Watch how nature breaks it down.',
    hint: "💡 The Sun's energy powers wind, water, and ice that break rock apart.",
    enabledZones: ['weathering'],
    highlight: { shelf: true, zones: ['weathering'] },
    check: 'any-transform:weathering',
    completionMessage: "The rock broke into sediment — tiny pieces carried by wind and water. The Sun's energy powers this process!",
    autoSelect: null,
    subSteps: null
  },

  /* 4 — Deposition & Sedimentation */
  {
    title: 'Deposition & Sedimentation',
    instruction: 'Now drag the sediment into the Deposition zone (📥). Choose any sediment type.',
    hint: '💡 Gravity pulls layers down; weight and time cement them together.',
    enabledZones: ['deposition'],
    highlight: { zones: ['deposition'] },
    check: 'any-transform:deposition',
    completionMessage: "Layers of sediment were squeezed and cemented into rock! Gravity did the heavy lifting — literally.",
    autoSelect: null,
    autoLoadSpecimen: 'sediment',
    subSteps: null
  },

  /* 5 — Heat & Pressure (limestone → marble) */
  {
    title: 'Heat & Pressure',
    instruction: 'Drag LIMESTONE from the shelf into the Heat & Pressure zone (🔥). See what happens when rock is squeezed deep underground.',
    hint: '💡 The rock changes without melting — minerals rearrange under pressure.',
    enabledZones: ['heatAndPressure'],
    highlight: { rocks: ['limestone'], zones: ['heatAndPressure'] },
    check: 'transform:limestone:heatAndPressure:marble',
    completionMessage: "Limestone became marble! Same calcite minerals, but heat and pressure rearranged them into interlocking crystals.",
    autoSelect: 'limestone',
    subSteps: null
  },

  /* 6 — Metamorphic Pairs (two sub-steps) */
  {
    title: 'The Metamorphic Pairs',
    enabledZones: ['heatAndPressure'],
    highlight: { zones: ['heatAndPressure'] },
    check: null,
    completionMessage: null,
    autoSelect: null,
    subSteps: [
      {
        instruction: 'Every sedimentary rock has a metamorphic partner. Try dragging SHALE into the Heat & Pressure zone.',
        hint: '💡 Shale is made of thin clay layers — pressure realigns them.',
        check: 'transform:shale:heatAndPressure:slate',
        highlightRocks: ['shale'],
        autoSelect: 'shale',
        completionMessage: "Shale became slate! Now try SANDSTONE.",
        afterComplete: null
      },
      {
        instruction: 'Now drag SANDSTONE into the Heat & Pressure zone.',
        hint: '💡 Sand grains fuse together under extreme heat.',
        check: 'transform:sandstone:heatAndPressure:quartzite',
        highlightRocks: ['sandstone'],
        autoSelect: 'sandstone',
        completionMessage: "Sandstone became quartzite! Three pairs: Limestone\u2009→\u2009Marble, Shale\u2009→\u2009Slate, Sandstone\u2009→\u2009Quartzite. The parent rock determines the metamorphic rock.",
        afterComplete: null
      }
    ]
  },

  /* 7 — Uplift */
  {
    title: 'Uplift',
    instruction: "Rocks deep underground can't be weathered — they need to reach the surface first. Drag any rock into the Uplift zone (🏔️).",
    hint: '💡 Tectonic forces push rocks up — completing the cycle!',
    enabledZones: ['uplift'],
    highlight: { shelf: true, zones: ['uplift'] },
    check: 'any-transform:uplift',
    completionMessage: "Tectonic forces pushed the rock up to the surface! Now it's exposed to wind and rain — and the cycle can continue.",
    autoSelect: null,
    subSteps: null
  },

  /* 8 — Complete a Full Cycle */
  {
    title: 'Complete a Full Cycle',
    instruction: "Put it all together! Start with GRANITE and try to turn it back into granite. Use any combination of processes. How many steps does it take?",
    hint: "💡 There's no single correct path — rocks can take many routes!",
    enabledZones: 'all',
    highlight: { rocks: ['granite'] },
    check: 'cycle:granite',
    completionMessage: null, // generated dynamically
    autoSelect: 'granite',
    subSteps: null
  },

  /* 9 — Check Your Progress */
  {
    title: 'Check Your Progress',
    instruction: null, // generated dynamically
    hint: null,
    enabledZones: [],
    highlight: { rightPanel: true },
    check: 'auto',
    completionMessage: null,
    autoSelect: null,
    subSteps: null,
    isFinal: true
  }
];

// ── Start / Exit ──────────────────────────────────────────────────────────────

function startGuidedMode() {
  guidedState.active = true;

  // Resume at first incomplete step
  let resumeAt = 0;
  for (let i = 0; i < GUIDED_STEPS.length; i++) {
    if (!guidedState.stepsCompleted.has(i)) { resumeAt = i; break; }
    if (i === GUIDED_STEPS.length - 1) resumeAt = i;
  }

  guidedState.currentStep = resumeAt;
  guidedState.subStep = 0;
  guidedState.stepData = {};
  guidedState.stepCompletedFlag = false;

  createGuidedOverlay();
  showGuidedStep(resumeAt);
}

function exitGuidedMode() {
  guidedState.active = false;
  removeGuidedOverlay();
  enableAllZones();
  clearGuidedHighlights();
}

// ── Overlay DOM ───────────────────────────────────────────────────────────────

function createGuidedOverlay() {
  removeGuidedOverlay();
  const stage = document.querySelector('.center-stage');
  if (!stage) return;

  const el = document.createElement('div');
  el.id = 'guided-overlay';
  el.className = 'guided-overlay';
  el.innerHTML = `
    <div class="guided-progress" id="guided-progress"></div>
    <div class="guided-instruction" id="guided-instruction"></div>
  `;
  stage.insertBefore(el, stage.firstChild);
}

function removeGuidedOverlay() {
  const el = document.getElementById('guided-overlay');
  if (el) el.remove();
}

// ── Show a Step ───────────────────────────────────────────────────────────────

function showGuidedStep(stepIndex) {
  guidedState.currentStep = stepIndex;
  guidedState.subStep = 0;
  guidedState.stepData = {};
  guidedState.stepCompletedFlag = false;

  const step = GUIDED_STEPS[stepIndex];
  if (!step) return;

  // Auto-load material specimen (magma / sediment)
  const loadSpec = step.autoLoadSpecimen;
  if (loadSpec && state.currentSpecimen !== loadSpec) {
    state.currentSpecimen = loadSpec;
    const disp = document.getElementById('specimen-display');
    if (disp) disp.dataset.specimen = loadSpec;
    document.querySelectorAll('.rock-card').forEach(c => c.classList.remove('selected'));
    if (typeof updateSpecimenDisplay === 'function') updateSpecimenDisplay(loadSpec);
  }

  // Auto-select rock
  const autoSel = step.autoSelect ||
    (step.subSteps && step.subSteps[0] ? step.subSteps[0].autoSelect : null);
  if (autoSel && typeof selectRock === 'function') selectRock(autoSel);

  // Zone gating
  setGuidedZoneStates(step.enabledZones);

  // Highlights
  setGuidedHighlights(step);

  // Auto-complete for review steps
  if (step.check === 'auto') {
    guidedState.stepCompletedFlag = true;
    guidedState.stepsCompleted.add(stepIndex);
  }

  renderProgressDots();
  renderGuidedInstruction();
}

// ── Progress Dots ─────────────────────────────────────────────────────────────

function renderProgressDots() {
  const container = document.getElementById('guided-progress');
  if (!container) return;
  const total = GUIDED_STEPS.length;
  let html = '<div class="step-dots">';
  for (let i = 0; i < total; i++) {
    let cls = 'step-dot';
    if (guidedState.stepsCompleted.has(i)) cls += ' completed';
    if (i === guidedState.currentStep) cls += ' current';
    html += `<span class="${cls}"></span>`;
  }
  html += '</div>';
  html += `<span class="step-label">Step ${guidedState.currentStep + 1} of ${total}</span>`;
  container.innerHTML = html;
}

// ── Instruction Card ──────────────────────────────────────────────────────────

function renderGuidedInstruction() {
  const container = document.getElementById('guided-instruction');
  if (!container) return;

  const step     = GUIDED_STEPS[guidedState.currentStep];
  if (!step) return;
  const sub      = getCurrentGuidedSubDef();
  const done     = guidedState.stepCompletedFlag;
  const isFinal  = !!step.isFinal;
  const isFirst  = guidedState.currentStep === 0;

  // Dynamic instruction for final review step
  let instruction = sub ? sub.instruction : step.instruction;
  let hint        = sub ? sub.hint        : step.hint;
  if (isFinal) {
    const cnt = state.discoveredPaths.size;
    const tot = ALL_PATHS.length;
    instruction = `Look at your Cycle Path Diagram on the right. You've discovered ${cnt} of ${tot} paths! Switch to Free Explore mode to find any paths you missed.`;
    hint = cnt === tot
      ? '🎉 Amazing — you found every path!'
      : `💡 ${tot - cnt} path${tot - cnt > 1 ? 's' : ''} still to discover.`;
  }

  // Completion message
  let cmpHtml = '';
  if (done) {
    let msg = sub ? sub.completionMessage : step.completionMessage;
    // Dynamic for the Full Cycle step — tiered response by step count
    if (step.check && step.check.startsWith('cycle:') && guidedState.stepData.cycleCount) {
      const n = guidedState.stepData.cycleCount;
      if (n <= 2) {
        msg = "You found the shortest path — just melt and re-crystallize! The real rock cycle can take this path too, though it requires extreme heat.";
      } else if (n <= 5) {
        msg = `You completed a full rock cycle in ${n} steps! There are many possible paths through the rock cycle.`;
      } else {
        msg = `You completed a full rock cycle in ${n} steps — the scenic route! Every path through the rock cycle is valid.`;
      }
    }
    if (msg) cmpHtml = `<div class="guided-completion">${msg}</div>`;
  }

  const nextLabel = isFinal ? 'Switch to Free Explore →' : 'Next →';

  container.innerHTML = `
    <h3 class="guided-step-title">${step.title}</h3>
    ${!done ? `
      <p class="guided-step-text">${instruction}</p>
      ${hint ? `<div class="guided-step-hint">${hint}</div>` : ''}
    ` : ''}
    ${cmpHtml}
    <div class="guided-buttons">
      <button class="guided-btn guided-btn-prev" ${isFirst ? 'disabled' : ''}>← Previous</button>
      <button class="guided-btn guided-btn-next" ${!done ? 'disabled' : ''}>${nextLabel}</button>
    </div>
    <button class="guided-skip-link">Skip to Free Explore →</button>
  `;

  // Button wiring
  container.querySelector('.guided-btn-prev').addEventListener('click', previousGuidedStep);
  container.querySelector('.guided-btn-next').addEventListener('click', () => {
    if (isFinal) {
      const tab = document.querySelector('.mode-tab[data-mode="free-explore"]');
      if (tab) tab.click();
    } else {
      advanceGuidedStep();
    }
  });
  container.querySelector('.guided-skip-link').addEventListener('click', () => {
    const tab = document.querySelector('.mode-tab[data-mode="free-explore"]');
    if (tab) tab.click();
  });
}

function getCurrentGuidedSubDef() {
  const step = GUIDED_STEPS[guidedState.currentStep];
  if (!step) return null;
  if (step.subSteps) return step.subSteps[guidedState.subStep] || null;
  return step;
}

// ── Navigation ────────────────────────────────────────────────────────────────

function advanceGuidedStep() {
  if (guidedState.currentStep < GUIDED_STEPS.length - 1) {
    guidedState.stepsCompleted.add(guidedState.currentStep);
    showGuidedStep(guidedState.currentStep + 1);
  }
}

function previousGuidedStep() {
  if (guidedState.currentStep > 0) {
    showGuidedStep(guidedState.currentStep - 1);
  }
}

// ── Completion Hooks (called from app.js / interaction.js) ────────────────────

function onGuidedRockSelect(rockId) {
  if (!guidedState.active || guidedState.stepCompletedFlag) return;
  if (checkGuidedCompletion({ type: 'select', rockId })) completeGuidedStep();
}

function onGuidedTransformation(fromId, processId, toId) {
  if (!guidedState.active || guidedState.stepCompletedFlag) return;
  if (checkGuidedCompletion({ type: 'transform', fromId, processId, toId })) completeGuidedStep();
}

function checkGuidedCompletion(action) {
  const sub = getCurrentGuidedSubDef();
  if (!sub || !sub.check) return false;
  const chk = sub.check;

  if (chk === 'select-types') {
    if (action.type !== 'select') return false;
    if (!guidedState.stepData.clickedTypes) guidedState.stepData.clickedTypes = new Set();
    const rock = ROCKS[action.rockId];
    if (rock) guidedState.stepData.clickedTypes.add(rock.type);
    return guidedState.stepData.clickedTypes.size >= 3;
  }

  if (chk.startsWith('transform:')) {
    if (action.type !== 'transform') return false;
    const [, reqF, reqP, reqT] = chk.split(':');
    return (reqF === '*' || action.fromId === reqF) &&
           (reqP === '*' || action.processId === reqP) &&
           (reqT === '*' || action.toId === reqT);
  }

  if (chk.startsWith('any-transform:')) {
    if (action.type !== 'transform') return false;
    return action.processId === chk.split(':')[1];
  }

  if (chk.startsWith('cycle:')) {
    if (action.type !== 'transform') return false;
    const target = chk.split(':')[1];
    guidedState.stepData.cycleCount = (guidedState.stepData.cycleCount || 0) + 1;
    // Track whether the specimen ever left the target rock
    if (action.fromId !== target || action.toId !== target) {
      guidedState.stepData.leftTarget = true;
    }
    return action.toId === target && guidedState.stepData.leftTarget;
  }

  return false;
}

// ── Complete Current Step / Sub-Step ──────────────────────────────────────────

function completeGuidedStep() {
  const step = GUIDED_STEPS[guidedState.currentStep];
  if (!step) return;

  // Sub-step with more to go
  if (step.subSteps && guidedState.subStep < step.subSteps.length - 1) {
    const curSub = step.subSteps[guidedState.subStep];
    guidedState.stepCompletedFlag = true;
    renderGuidedInstruction(); // shows sub-step completion msg

    setTimeout(() => {
      guidedState.stepCompletedFlag = false;
      guidedState.subStep++;

      // afterComplete actions
      if (curSub.afterComplete === 'loadMagma') {
        state.currentSpecimen = 'magma';
        const disp = document.getElementById('specimen-display');
        if (disp) disp.dataset.specimen = 'magma';
        document.querySelectorAll('.rock-card').forEach(c => c.classList.remove('selected'));
        if (typeof updateSpecimenDisplay === 'function') updateSpecimenDisplay('magma');
      }

      // Next sub-step setup
      const nextSub = step.subSteps[guidedState.subStep];
      if (nextSub) {
        if (nextSub.autoSelect && typeof selectRock === 'function') selectRock(nextSub.autoSelect);

        // Refresh highlights
        clearGuidedHighlights();
        if (step.highlight && step.highlight.zones) {
          step.highlight.zones.forEach(id => {
            const z = document.querySelector(`.process-zone[data-process="${id}"]`);
            if (z) z.classList.add('guided-highlight');
          });
        }
        if (nextSub.highlightRocks) {
          nextSub.highlightRocks.forEach(id => {
            const c = document.querySelector(`.rock-card[data-rock="${id}"]`);
            if (c) c.classList.add('guided-highlight');
          });
        }
      }

      renderGuidedInstruction();
    }, 2200);
    return;
  }

  // Whole step complete
  guidedState.stepCompletedFlag = true;
  guidedState.stepsCompleted.add(guidedState.currentStep);
  renderProgressDots();
  renderGuidedInstruction();
}

// ── Zone Enable / Disable ─────────────────────────────────────────────────────

function setGuidedZoneStates(enabledZones) {
  document.querySelectorAll('.process-zone').forEach(zone => {
    const pid = zone.dataset.process;
    if (enabledZones === 'all' || (Array.isArray(enabledZones) && enabledZones.includes(pid))) {
      zone.classList.remove('zone-disabled');
    } else {
      zone.classList.add('zone-disabled');
    }
  });
}

function enableAllZones() {
  document.querySelectorAll('.process-zone').forEach(z => z.classList.remove('zone-disabled'));
}

// Queried by interaction.js during drag
function isGuidedZoneEnabled(processId) {
  if (!guidedState.active) return true;
  const step = GUIDED_STEPS[guidedState.currentStep];
  if (!step) return true;
  if (step.enabledZones === 'all') return true;
  return Array.isArray(step.enabledZones) && step.enabledZones.includes(processId);
}

// ── Highlighting ──────────────────────────────────────────────────────────────

function setGuidedHighlights(step) {
  clearGuidedHighlights();
  const hl = step.highlight;
  if (!hl) return;

  if (hl.shelf) {
    const shelf = document.querySelector('.left-panel');
    if (shelf) shelf.classList.add('guided-highlight');
  }
  if (hl.rocks) {
    hl.rocks.forEach(id => {
      const c = document.querySelector(`.rock-card[data-rock="${id}"]`);
      if (c) c.classList.add('guided-highlight');
    });
  }
  if (hl.zones) {
    hl.zones.forEach(id => {
      const z = document.querySelector(`.process-zone[data-process="${id}"]`);
      if (z) z.classList.add('guided-highlight');
    });
  }
  if (hl.rightPanel) {
    const rp = document.getElementById('right-panel');
    if (rp) rp.classList.add('guided-highlight');
  }
}

function clearGuidedHighlights() {
  document.querySelectorAll('.guided-highlight').forEach(el => el.classList.remove('guided-highlight'));
}

// ── Popup Hook — highlight recommended choice ─────────────────────────────────

function onGuidedPopupShown(popup) {
  if (!guidedState.active) return;
  const sub = getCurrentGuidedSubDef();
  if (!sub || !sub.highlightPopupChoice) return;
  const btn = popup.querySelector(`[data-value="${sub.highlightPopupChoice}"]`);
  if (btn) btn.classList.add('guided-highlight');
}
