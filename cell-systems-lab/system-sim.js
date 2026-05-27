// system-sim.js — drives the System View animation.
// Renders its own copy of the current cell, spawns particles along flow
// paths, and lets the user click any organelle to disable it. Disabling
// an organelle stops every flow whose `requires` list contains it.

(function () {
  'use strict';

  const SVG_NS = 'http://www.w3.org/2000/svg';
  const SEGMENT_MS = 1500; // duration of each segment along a flow path

  const SystemSim = {
    // ---- State -----------------------------------------------------------
    container: null,
    svg: null,
    particleLayer: null,
    currentCellType: null,
    organellePositions: {},
    multiPositions: {},
    disabledOrganelles: new Set(),
    particles: [],
    flowTimers: {},
    isPaused: false,
    isRunning: false,
    lastFrameTime: 0,
    animationFrameId: null,
    _delegationAttached: false,

    // ---- Public API ------------------------------------------------------
    init(container) {
      this.container = container;
      this._attachStaticDelegation();
    },

    start(cellType) {
      if (this.animationFrameId) {
        cancelAnimationFrame(this.animationFrameId);
        this.animationFrameId = null;
      }
      this.currentCellType = cellType;
      this.disabledOrganelles = new Set();
      this.particles = [];
      this.flowTimers = {};
      this.isPaused = false;
      this.lastFrameTime = 0;

      this.container.innerHTML = window.CellRenderer.getSVG(cellType);
      this.svg = this.container.querySelector('svg');

      this.particleLayer = document.createElementNS(SVG_NS, 'g');
      this.particleLayer.setAttribute('class', 'particle-layer');
      this.svg.appendChild(this.particleLayer);

      this._indexOrganelles();
      this._attachOrganelleHandlers();
      this._renderLegend();
      this._resetPauseButton();
      this._updateStatusDisplay();

      this.isRunning = true;
      this.animationFrameId = requestAnimationFrame((t) => this._tick(t));
    },

    stop() {
      this.isRunning = false;
      if (this.animationFrameId) {
        cancelAnimationFrame(this.animationFrameId);
        this.animationFrameId = null;
      }
      if (this.container) this.container.innerHTML = '';
      this.svg = null;
      this.particleLayer = null;
      this.particles = [];
      this.flowTimers = {};
      this.disabledOrganelles = new Set();
      this.lastFrameTime = 0;
    },

    togglePause() {
      if (!this.isRunning) return;
      this.isPaused = !this.isPaused;
      const btn = document.getElementById('sys-pause');
      if (!btn) return;
      if (this.isPaused) {
        btn.textContent = window.t('button.play');
        btn.setAttribute('data-i18n', 'button.play');
        btn.classList.add('active');
      } else {
        btn.textContent = window.t('button.pause');
        btn.setAttribute('data-i18n', 'button.pause');
        btn.classList.remove('active');
        this.lastFrameTime = performance.now();
      }
    },

    reset() {
      if (!this.isRunning) return;
      this.disabledOrganelles.clear();
      if (this.svg) {
        this.svg.querySelectorAll('.organelle.disabled').forEach(el => {
          el.classList.remove('disabled');
        });
      }
      this.particles.forEach(p => {
        if (p.element.parentNode) p.element.parentNode.removeChild(p.element);
      });
      this.particles = [];
      this.flowTimers = {};
      this.isPaused = false;
      this._resetPauseButton();
      this._updateStatusDisplay();
    },

    // ---- Indexing --------------------------------------------------------
    _indexOrganelles() {
      this.organellePositions = {};
      this.multiPositions = {};

      this.svg.querySelectorAll('[data-organelle]').forEach(g => {
        const id = g.getAttribute('data-organelle');

        try {
          const bbox = g.getBBox();
          this.organellePositions[id] = {
            x: bbox.x + bbox.width / 2,
            y: bbox.y + bbox.height / 2
          };
        } catch (e) {
          // getBBox can fail on detached elements — skip silently.
        }

        if (id === 'mitochondria' || id === 'chloroplast') {
          const instances = [];
          g.querySelectorAll('ellipse').forEach(el => {
            const rx = parseFloat(el.getAttribute('rx'));
            if (rx >= 30) {
              const ctm = el.getCTM();
              if (ctm) instances.push({ x: ctm.e, y: ctm.f });
            }
          });
          if (instances.length) this.multiPositions[id] = instances;
        }
      });
    },

    _resolvePoint(name) {
      if (window.FIXED_WAYPOINTS[name]) return window.FIXED_WAYPOINTS[name];
      const multi = this.multiPositions[name];
      if (multi && multi.length) {
        return multi[Math.floor(Math.random() * multi.length)];
      }
      return this.organellePositions[name] || null;
    },

    // ---- Organelle handlers (per-render) --------------------------------
    _attachOrganelleHandlers() {
      this.svg.querySelectorAll('.organelle').forEach(el => {
        const id = el.getAttribute('data-organelle');
        el.addEventListener('click', () => this._toggleDisabled(id));
        el.addEventListener('keydown', (e) => {
          if (e.key === 'Enter' || e.key === ' ' || e.key === 'Spacebar') {
            e.preventDefault();
            this._toggleDisabled(id);
          }
        });
      });
    },

    _toggleDisabled(id) {
      if (!id) return;
      if (this.disabledOrganelles.has(id)) {
        this.disabledOrganelles.delete(id);
      } else {
        this.disabledOrganelles.add(id);
      }
      const el = this.svg && this.svg.querySelector('[data-organelle="' + id + '"]');
      if (el) el.classList.toggle('disabled', this.disabledOrganelles.has(id));
      this._updateStatusDisplay();
    },

    // ---- Static delegation (attached once in init) ----------------------
    _attachStaticDelegation() {
      if (this._delegationAttached) return;
      this._delegationAttached = true;

      const pauseBtn = document.getElementById('sys-pause');
      if (pauseBtn) pauseBtn.addEventListener('click', () => this.togglePause());

      const resetBtn = document.getElementById('sys-reset');
      if (resetBtn) resetBtn.addEventListener('click', () => this.reset());

      const disabledList = document.getElementById('disabled-list');
      if (disabledList) {
        disabledList.addEventListener('click', (e) => {
          const btn = e.target.closest('.reenable');
          if (btn) this._toggleDisabled(btn.getAttribute('data-organelle'));
        });
      }

      // Re-render dynamic UI on language change so the visible text
      // updates without waiting for the next sim tick. Bail out if the
      // user isn't currently in System View — applyTranslations() will
      // have already refreshed the static markup for us.
      document.addEventListener('language-changed', () => {
        if (!this.isRunning) return;
        this._renderLegend();
        this._updateStatusDisplay();
        this._updateDisabledList();
      });
    },

    _resetPauseButton() {
      const btn = document.getElementById('sys-pause');
      if (!btn) return;
      btn.textContent = window.t('button.pause');
      btn.setAttribute('data-i18n', 'button.pause');
      btn.classList.remove('active');
    },

    // ---- Legend + status UI ---------------------------------------------
    _renderLegend() {
      const list = document.getElementById('legend-list');
      if (!list) return;
      list.innerHTML = '';

      const flows = window.SYSTEM_FLOWS[this.currentCellType] || [];
      const seen = new Set();
      flows.forEach(flow => {
        if (seen.has(flow.type)) return;
        seen.add(flow.type);

        const meta = window.PARTICLE_TYPES[flow.type];
        if (!meta) return;

        const li = document.createElement('li');

        const swatch = document.createElement('span');
        swatch.className = 'legend-swatch';
        swatch.style.background = meta.color;
        swatch.style.borderColor = meta.stroke;

        const text = document.createElement('span');
        text.textContent = meta.label + ' — ' + window.t('particle.' + flow.type);

        li.appendChild(swatch);
        li.appendChild(text);
        list.appendChild(li);
      });
    },

    _updateStatusDisplay() {
      const flows = window.SYSTEM_FLOWS[this.currentCellType] || [];
      const total = flows.length;
      const active = flows.filter(f =>
        (f.requires || []).every(r => !this.disabledOrganelles.has(r))
      ).length;

      const statusEl = document.getElementById('sys-status');
      if (statusEl) {
        const labelEl = statusEl.querySelector('.status-label');
        const detailEl = statusEl.querySelector('.status-detail');
        if (labelEl && detailEl) {
          labelEl.classList.remove('status-healthy', 'status-warning', 'status-critical');
          // Remove any prior data-i18n so we can re-set it cleanly below.
          labelEl.removeAttribute('data-i18n');
          detailEl.removeAttribute('data-i18n');
          if (this.disabledOrganelles.size === 0) {
            labelEl.classList.add('status-healthy');
            labelEl.setAttribute('data-i18n', 'status.healthy');
            labelEl.textContent = window.t('status.healthy');
            detailEl.setAttribute('data-i18n', 'status.detail.allActive');
            detailEl.textContent = window.t('status.detail.allActive');
          } else if (active >= total / 2) {
            labelEl.classList.add('status-warning');
            labelEl.setAttribute('data-i18n', 'status.warning');
            labelEl.textContent = window.t('status.warning');
            detailEl.textContent = window.t('status.detail.flowsActive', { active: active, total: total });
          } else {
            labelEl.classList.add('status-critical');
            labelEl.setAttribute('data-i18n', 'status.critical');
            labelEl.textContent = window.t('status.critical');
            detailEl.textContent = window.t('status.detail.flowsActive', { active: active, total: total });
          }
        }
      }

      this._updateDisabledList();
    },

    _updateDisabledList() {
      const list = document.getElementById('disabled-list');
      if (!list) return;
      list.innerHTML = '';

      if (this.disabledOrganelles.size === 0) {
        const li = document.createElement('li');
        li.className = 'empty';
        li.setAttribute('data-i18n', 'system.disabled.empty');
        li.textContent = window.t('system.disabled.empty');
        list.appendChild(li);
        return;
      }

      this.disabledOrganelles.forEach(id => {
        const meta = window.ORGANELLE_DATA && window.ORGANELLE_DATA[id];
        const li = document.createElement('li');

        const name = document.createElement('span');
        name.textContent = meta ? window.localize(meta).name : id;

        const btn = document.createElement('button');
        btn.className = 'reenable';
        btn.type = 'button';
        btn.setAttribute('data-i18n', 'system.disabled.enable');
        btn.textContent = window.t('system.disabled.enable');
        btn.setAttribute('data-organelle', id);

        li.appendChild(name);
        li.appendChild(btn);
        list.appendChild(li);
      });
    },

    // ---- Particles -------------------------------------------------------
    _spawnParticle(flow) {
      const points = flow.path.map(name => this._resolvePoint(name));
      if (points.some(p => !p)) return;

      const meta = window.PARTICLE_TYPES[flow.type];
      if (!meta) return;

      const g = document.createElementNS(SVG_NS, 'g');
      g.setAttribute('class', 'particle');
      g.setAttribute('transform', 'translate(' + points[0].x + ' ' + points[0].y + ')');

      const circle = document.createElementNS(SVG_NS, 'circle');
      circle.setAttribute('cx', '0');
      circle.setAttribute('cy', '0');
      circle.setAttribute('r', String(meta.size));
      circle.setAttribute('fill', meta.color);
      circle.setAttribute('stroke', meta.stroke);
      circle.setAttribute('stroke-width', '1.5');
      g.appendChild(circle);

      if (meta.size >= 10) {
        const text = document.createElementNS(SVG_NS, 'text');
        text.setAttribute('class', 'particle-label');
        text.setAttribute('x', '0');
        text.setAttribute('y', '0');
        text.textContent = meta.label;
        g.appendChild(text);
      }

      this.particleLayer.appendChild(g);

      this.particles.push({
        element: g,
        points: points,
        segIndex: 0,
        segProgress: 0,
        segDuration: SEGMENT_MS
      });
    },

    _updateParticles(dt) {
      const remove = [];
      for (let i = 0; i < this.particles.length; i++) {
        const p = this.particles[i];
        p.segProgress += dt / p.segDuration;
        while (p.segProgress >= 1 && p.segIndex < p.points.length - 1) {
          p.segIndex++;
          p.segProgress -= 1;
        }
        if (p.segIndex >= p.points.length - 1) {
          remove.push(i);
          continue;
        }
        const a = p.points[p.segIndex];
        const b = p.points[p.segIndex + 1];
        const t = p.segProgress;
        const x = a.x + (b.x - a.x) * t;
        const y = a.y + (b.y - a.y) * t;
        p.element.setAttribute('transform', 'translate(' + x + ' ' + y + ')');
      }
      for (let i = remove.length - 1; i >= 0; i--) {
        const p = this.particles[remove[i]];
        if (p.element.parentNode) p.element.parentNode.removeChild(p.element);
        this.particles.splice(remove[i], 1);
      }
    },

    // ---- Animation loop --------------------------------------------------
    _tick(timestamp) {
      if (!this.isRunning) return;

      if (this.isPaused) {
        this.animationFrameId = requestAnimationFrame((t) => this._tick(t));
        return;
      }

      if (!this.lastFrameTime) this.lastFrameTime = timestamp;
      const dt = timestamp - this.lastFrameTime;
      this.lastFrameTime = timestamp;

      const flows = window.SYSTEM_FLOWS[this.currentCellType] || [];
      flows.forEach(flow => {
        const blocked = (flow.requires || []).some(r => this.disabledOrganelles.has(r));
        if (blocked) return;
        const last = this.flowTimers[flow.id] || 0;
        if ((timestamp - last) >= flow.spawnEvery) {
          this._spawnParticle(flow);
          this.flowTimers[flow.id] = timestamp;
        }
      });

      this._updateParticles(dt);

      this.animationFrameId = requestAnimationFrame((t) => this._tick(t));
    }
  };

  window.SystemSim = SystemSim;
})();
