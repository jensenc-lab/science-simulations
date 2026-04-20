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

// Each step stores translation keys (titleKey/instructionKey/hintKey/completionKey)
// instead of hardcoded strings — rendered via t() at display time so language toggle works.

const GUIDED_STEPS = [
  { titleKey: 'guided1Title', instructionKey: 'guided1Text', hintKey: 'guided1Hint', completionKey: 'guided1Complete',
    enabledZones: [], highlight: { shelf: true }, check: 'select-types', autoSelect: null, subSteps: null },

  { titleKey: 'guided2Title', instructionKey: 'guided2Text', hintKey: 'guided2Hint', completionKey: 'guided2Complete',
    enabledZones: ['melting'], highlight: { rocks: ['granite'], zones: ['melting'] },
    check: 'transform:granite:melting:magma', autoSelect: 'granite', subSteps: null },

  { titleKey: 'guided3Title',
    enabledZones: ['crystallization'], highlight: { zones: ['crystallization'] }, check: null,
    autoSelect: null, autoLoadSpecimen: 'magma',
    subSteps: [
      { instructionKey: 'guided3aText', hintKey: 'guided3aHint', completionKey: 'guided3aComplete',
        check: 'transform:*:crystallization:granite', highlightPopupChoice: 'slow', afterComplete: 'loadMagma' },
      { instructionKey: 'guided3bText', hintKey: 'guided3bHint', completionKey: 'guided3bComplete',
        check: 'transform:*:crystallization:basalt', highlightPopupChoice: 'fast', afterComplete: null }
    ]
  },

  { titleKey: 'guided4Title', instructionKey: 'guided4Text', hintKey: 'guided4Hint', completionKey: 'guided4Complete',
    enabledZones: ['weathering'], highlight: { shelf: true, zones: ['weathering'] },
    check: 'any-transform:weathering', autoSelect: null, subSteps: null },

  { titleKey: 'guided5Title', instructionKey: 'guided5Text', hintKey: 'guided5Hint', completionKey: 'guided5Complete',
    enabledZones: ['deposition'], highlight: { zones: ['deposition'] },
    check: 'any-transform:deposition', autoSelect: null, autoLoadSpecimen: 'sediment', subSteps: null },

  { titleKey: 'guided6Title', instructionKey: 'guided6Text', hintKey: 'guided6Hint', completionKey: 'guided6Complete',
    enabledZones: ['heatAndPressure'], highlight: { rocks: ['limestone'], zones: ['heatAndPressure'] },
    check: 'transform:limestone:heatAndPressure:marble', autoSelect: 'limestone', subSteps: null },

  { titleKey: 'guided7Title',
    enabledZones: ['heatAndPressure'], highlight: { zones: ['heatAndPressure'] }, check: null, autoSelect: null,
    subSteps: [
      { instructionKey: 'guided7aText', hintKey: 'guided7aHint', completionKey: 'guided7aComplete',
        check: 'transform:shale:heatAndPressure:slate', highlightRocks: ['shale'], autoSelect: 'shale', afterComplete: null },
      { instructionKey: 'guided7bText', hintKey: 'guided7bHint', completionKey: 'guided7bComplete',
        check: 'transform:sandstone:heatAndPressure:quartzite', highlightRocks: ['sandstone'], autoSelect: 'sandstone', afterComplete: null }
    ]
  },

  { titleKey: 'guided8Title', instructionKey: 'guided8Text', hintKey: 'guided8Hint', completionKey: 'guided8Complete',
    enabledZones: ['uplift'], highlight: { shelf: true, zones: ['uplift'] },
    check: 'any-transform:uplift', autoSelect: null, subSteps: null },

  { titleKey: 'guided9Title', instructionKey: 'guided9Text', hintKey: 'guided9Hint',
    enabledZones: 'all', highlight: { rocks: ['granite'] }, check: 'cycle:granite',
    autoSelect: 'granite', subSteps: null },

  { titleKey: 'guided10Title', // instruction + hint generated dynamically via t()
    enabledZones: [], highlight: { rightPanel: true }, check: 'auto',
    autoSelect: null, subSteps: null, isFinal: true }
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
  html += `<span class="step-label">${t('guidedStepOf', { current: guidedState.currentStep + 1, total: total })}</span>`;
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

  // Resolve instruction + hint text via translation keys
  let instruction = sub && sub.instructionKey ? t(sub.instructionKey) : (step.instructionKey ? t(step.instructionKey) : '');
  let hint        = sub && sub.hintKey        ? t(sub.hintKey)        : (step.hintKey        ? t(step.hintKey)        : '');
  if (isFinal) {
    const cnt = state.discoveredPaths.size;
    const tot = ALL_PATHS.length;
    instruction = t('guided10Text', { cnt: cnt, tot: tot });
    hint = cnt === tot
      ? t('guided10HintComplete')
      : t('guided10HintRemaining', { n: tot - cnt, s: (tot - cnt) > 1 ? 's' : '' });
  }

  // Completion message
  let cmpHtml = '';
  if (done) {
    let msg = '';
    const completionKey = sub && sub.completionKey ? sub.completionKey : step.completionKey;
    if (completionKey) msg = t(completionKey);
    // Dynamic for the Full Cycle step — tiered response by step count
    if (step.check && step.check.startsWith('cycle:') && guidedState.stepData.cycleCount) {
      const n = guidedState.stepData.cycleCount;
      if (n <= 2)      msg = t('guided9CompleteShort');
      else if (n <= 5) msg = t('guided9CompleteMed', { n: n });
      else             msg = t('guided9CompleteLong', { n: n });
    }
    if (msg) cmpHtml = `<div class="guided-completion">${msg}</div>`;
  }

  const nextLabel = isFinal ? t('guidedSwitchFree') : t('guidedNext');
  const title = step.titleKey ? t(step.titleKey) : '';

  container.innerHTML = `
    <h3 class="guided-step-title">${title}</h3>
    ${!done ? `
      <p class="guided-step-text">${instruction}</p>
      ${hint ? `<div class="guided-step-hint">${hint}</div>` : ''}
    ` : ''}
    ${cmpHtml}
    <div class="guided-buttons">
      <button class="guided-btn guided-btn-prev" ${isFirst ? 'disabled' : ''}>${t('guidedPrevious')}</button>
      <button class="guided-btn guided-btn-next" ${!done ? 'disabled' : ''}>${nextLabel}</button>
    </div>
    <button class="guided-skip-link">${t('guidedSkipLink')}</button>
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
