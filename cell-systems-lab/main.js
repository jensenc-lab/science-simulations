// main.js — top-level wiring for Cell Systems Lab.
// Holds shared AppState and routes UI events to the correct module.

// InfoPanel — renders the selected organelle's details into the
// right-hand card on Explore mode. Kept at module scope (not on window)
// since only main.js drives it.
const InfoPanel = (() => {
  let panelEl = null;
  let shownOrganelle = null;

  function init(el) {
    panelEl = el;
  }

  function show(organelleId) {
    if (!panelEl) return;
    const record = window.ORGANELLE_DATA && window.ORGANELLE_DATA[organelleId];
    if (!record) return;
    const data = window.localize(record);

    const foundIn = (data.foundIn === 'plant' || data.foundIn === 'animal')
      ? data.foundIn
      : 'both';

    // Wrapper structure only — all ORGANELLE_DATA fields are set via
    // textContent below so future content cannot inject HTML.
    panelEl.innerHTML = `
      <button class="info-close" type="button" aria-label="${window.t('explore.close')}">×</button>
      <header class="info-header">
        <span class="info-icon" aria-hidden="true"></span>
        <div class="info-header-text">
          <h2 class="info-name"></h2>
          <p class="info-tagline"></p>
        </div>
        <span class="info-badge info-badge-${foundIn}"></span>
      </header>
      <section class="info-section">
        <h3 class="info-section-structure"></h3>
        <p class="info-structure"></p>
      </section>
      <section class="info-section">
        <h3 class="info-section-function"></h3>
        <p class="info-function"></p>
      </section>
      <section class="info-section info-section-system">
        <h3 class="info-section-system-h"></h3>
        <p class="info-insystem"></p>
      </section>
    `;

    panelEl.querySelector('.info-icon').textContent              = data.icon;
    panelEl.querySelector('.info-name').textContent              = data.name;
    panelEl.querySelector('.info-tagline').textContent           = data.tagline;
    panelEl.querySelector('.info-badge').textContent             = window.t('badge.' + foundIn);
    panelEl.querySelector('.info-section-structure').textContent = window.t('explore.section.structure');
    panelEl.querySelector('.info-section-function').textContent  = window.t('explore.section.function');
    panelEl.querySelector('.info-section-system-h').textContent  = window.t('explore.section.system');
    panelEl.querySelector('.info-structure').textContent         = data.structure;
    panelEl.querySelector('.info-function').textContent          = data.function;
    panelEl.querySelector('.info-insystem').textContent          = data.inSystem;

    shownOrganelle = organelleId;
  }

  function clear() {
    if (!panelEl) return;
    panelEl.innerHTML = '';
    const hintP = document.createElement('p');
    hintP.className = 'hint';
    hintP.setAttribute('data-i18n', 'explore.hint');
    hintP.textContent = window.t('explore.hint');
    panelEl.appendChild(hintP);
    shownOrganelle = null;
  }

  function rerender() {
    if (shownOrganelle) {
      show(shownOrganelle);
    }
    // If the panel is in its empty/hint state, the data-i18n attribute on
    // the .hint paragraph means applyTranslations() already updated it.
  }

  return { init, show, clear, rerender };
})();

document.addEventListener('DOMContentLoaded', () => {

  const AppState = {
    currentMode: 'explore',        // 'explore' | 'system' | 'challenge'
    currentCellType: 'animal',     // 'animal' | 'plant'
    currentLang: 'en'              // 'en' | 'es'
  };

  window.AppState = AppState;

  // ---- Mode tabs ----------------------------------------------------------
  const modeTabs = [
    { id: 'mode-explore',   key: 'explore',   panelId: 'panel-explore' },
    { id: 'mode-system',    key: 'system',    panelId: 'panel-system' },
    { id: 'mode-challenge', key: 'challenge', panelId: 'panel-challenge' }
  ];

  function setMode(key) {
    const previousMode = AppState.currentMode;
    if (previousMode === key) return;
    AppState.currentMode = key;
    modeTabs.forEach(tab => {
      const btn = document.getElementById(tab.id);
      const panel = document.getElementById(tab.panelId);
      const isActive = tab.key === key;
      btn.classList.toggle('active', isActive);
      btn.setAttribute('aria-selected', String(isActive));
      panel.classList.toggle('hidden', !isActive);
    });

    if (key === 'system') {
      SystemSim.start(AppState.currentCellType);
    } else if (previousMode === 'system') {
      SystemSim.stop();
    }

    if (key === 'challenge') {
      ChallengeMode.start();
    } else if (previousMode === 'challenge') {
      ChallengeMode.stop();
    }

    // Lock the cell-type toggle while in challenge mode — each challenge
    // dictates its own cell type.
    const lockToggle = key === 'challenge';
    cellTypes.forEach(t => {
      const btn = document.getElementById(t.id);
      if (btn) btn.classList.toggle('disabled-toggle', lockToggle);
    });
  }

  modeTabs.forEach(tab => {
    const btn = document.getElementById(tab.id);
    btn.addEventListener('click', () => setMode(tab.key));
  });

  // ---- Cell-type toggle ---------------------------------------------------
  const cellTypes = [
    { id: 'cell-animal', key: 'animal' },
    { id: 'cell-plant',  key: 'plant'  }
  ];

  function setCellType(key) {
    if (AppState.currentMode === 'challenge') return;
    if (AppState.currentCellType === key) return;
    AppState.currentCellType = key;
    cellTypes.forEach(t => {
      const btn = document.getElementById(t.id);
      const isActive = t.key === key;
      btn.classList.toggle('active', isActive);
      btn.setAttribute('aria-pressed', String(isActive));
    });
    CellRenderer.render(key);
    CellRenderer.clearSelection();
    InfoPanel.clear();
    if (AppState.currentMode === 'system') {
      SystemSim.stop();
      SystemSim.start(key);
    }
  }

  cellTypes.forEach(t => {
    const btn = document.getElementById(t.id);
    btn.addEventListener('click', () => setCellType(t.key));
  });

  // ---- Language toggle ----------------------------------------------------
  // Initial translation pass so static markup picks up overrides on load
  // (a no-op for English, but harmless and keeps the bootstrap symmetric
  // with mid-session toggles).
  window.applyTranslations();

  const langBtn = document.getElementById('lang-toggle');
  langBtn.addEventListener('click', () => {
    window.setLanguage(AppState.currentLang === 'en' ? 'es' : 'en');
  });

  // ---- Cell renderer + info panel -----------------------------------------
  CellRenderer.init(document.getElementById('cell-display'));
  CellRenderer.render(AppState.currentCellType);

  const infoPanelEl = document.getElementById('organelle-info');
  InfoPanel.init(infoPanelEl);

  document.addEventListener('organelle-selected', (e) => {
    InfoPanel.show(e.detail.organelle);
  });

  // Delegated close handler: works across re-renders of the panel.
  infoPanelEl.addEventListener('click', (e) => {
    if (e.target.closest('.info-close')) {
      InfoPanel.clear();
      CellRenderer.clearSelection();
    }
  });

  // Re-render the info panel so its labels (section headers, badge,
  // close button aria-label) follow the active language. Organelle
  // descriptions themselves stay English in this chunk.
  document.addEventListener('language-changed', () => {
    InfoPanel.rerender();
  });

  // ---- System View --------------------------------------------------------
  SystemSim.init(document.getElementById('cell-display-system'));

  // ---- Challenge Mode -----------------------------------------------------
  ChallengeMode.init(
    document.getElementById('cell-display-challenge'),
    document.getElementById('panel-challenge')
  );

});
