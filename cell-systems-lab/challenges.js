// challenges.js — Challenge mode controller. Renders its own copy of the
// cell with a particle simulation similar to SystemSim, but in
// "diagnostic" form: one organelle is secretly broken and the student
// must identify it from the resulting flow/cascade symptoms.

(function () {
  'use strict';

  const SVG_NS = 'http://www.w3.org/2000/svg';
  const SEGMENT_MS = 1500;

  const ChallengeMode = {
    // ---- State -----------------------------------------------------------
    simContainer: null,
    panelContainer: null,
    svg: null,
    particleLayer: null,

    currentIndex: 0,
    currentChallenge: null,
    score: 0,

    // Per-challenge sim state
    disabledOrganelles: new Set(),
    starvedOrganelles: new Set(),
    starveSince: {},
    particles: [],
    flowTimers: {},
    organellePositions: {},
    multiPositions: {},

    // Per-challenge UI state
    attempts: 0,
    attemptedCorrect: false,
    usedReveal: false,
    usedHint: false,
    wrongTimers: [],
    challengeStartedAt: 0,

    isRunning: false,
    lastFrameTime: 0,
    animationFrameId: null,

    _btnHint: null,
    _btnReveal: null,
    _btnNext: null,
    _nextHandler: null,
    _hintHandler: null,
    _revealHandler: null,
    _buttonsBound: false,

    // Track the last-rendered dynamic block so a language change can
    // replay it without losing the user's place in the challenge.
    _lastFeedbackRender: null,
    _summaryVisible: false,

    // ---- Public API ------------------------------------------------------
    init(simContainerEl, panelContainerEl) {
      this.simContainer = simContainerEl;
      this.panelContainer = panelContainerEl;
      this._btnHint = document.getElementById('challenge-hint');
      this._btnReveal = document.getElementById('challenge-reveal');
      this._btnNext = document.getElementById('challenge-next');

      if (!this._buttonsBound) {
        this._hintHandler = () => this._onHint();
        this._revealHandler = () => this._onReveal();
        this._nextHandler = () => this._onNext();
        if (this._btnHint) this._btnHint.addEventListener('click', this._hintHandler);
        if (this._btnReveal) this._btnReveal.addEventListener('click', this._revealHandler);
        if (this._btnNext) this._btnNext.addEventListener('click', this._nextHandler);
        this._buttonsBound = true;

        // Re-render dynamic content (title, scenario, feedback, summary)
        // on language change so the visible text follows the active
        // language. Static markup with data-i18n is handled by
        // applyTranslations().
        document.addEventListener('language-changed', () => {
          if (!this.isRunning) return;
          this._updateChallengeHeader();
          if (this._summaryVisible) {
            this._showSummary();
          } else if (this._lastFeedbackRender) {
            this._lastFeedbackRender();
          }
        });
      }

      const totalEl = document.getElementById('challenge-total');
      if (totalEl) totalEl.textContent = String((window.CHALLENGES || []).length);
    },

    start() {
      this.currentIndex = 0;
      this.score = 0;
      this._updateScoreDisplay();
      this._hideSummary();
      this._showChallengeContent();
      this._loadChallenge(0);
    },

    stop() {
      this.isRunning = false;
      if (this.animationFrameId) {
        cancelAnimationFrame(this.animationFrameId);
        this.animationFrameId = null;
      }
      this._clearWrongTimers();
      if (this.simContainer) this.simContainer.innerHTML = '';
      this.svg = null;
      this.particleLayer = null;
      this.disabledOrganelles = new Set();
      this.starvedOrganelles = new Set();
      this.starveSince = {};
      this.particles = [];
      this.flowTimers = {};
      this.organellePositions = {};
      this.multiPositions = {};
      this.attempts = 0;
      this.attemptedCorrect = false;
      this.usedReveal = false;
      this.usedHint = false;
      this._lastFeedbackRender = null;
      this._summaryVisible = false;
      this.lastFrameTime = 0;
    },

    // ---- Challenge lifecycle --------------------------------------------
    _loadChallenge(index) {
      const challenges = window.CHALLENGES || [];
      const challenge = challenges[index];
      if (!challenge) return;

      this.currentChallenge = challenge;
      this.currentIndex = index;

      // Reset sim state.
      this._clearWrongTimers();
      this.disabledOrganelles = new Set([challenge.brokenOrganelle]);
      this.starvedOrganelles = new Set();
      this.starveSince = {};
      this.particles = [];
      this.flowTimers = {};
      this.attempts = 0;
      this.attemptedCorrect = false;
      this.usedReveal = false;
      this.usedHint = false;
      this._lastFeedbackRender = null;
      this.lastFrameTime = 0;
      this.challengeStartedAt = 0;

      // Render the cell SVG.
      this.simContainer.innerHTML = window.CellRenderer.getSVG(challenge.cellType);
      this.svg = this.simContainer.querySelector('svg');
      this.particleLayer = document.createElementNS(SVG_NS, 'g');
      this.particleLayer.setAttribute('class', 'particle-layer');
      this.svg.appendChild(this.particleLayer);

      this._indexOrganelles();
      this._attachOrganelleHandlers();

      // Update panel UI.
      this._updateChallengeHeader();
      this._hideFeedback();
      this._setButtonsForNewChallenge();
      this._updateProgressBar();

      // Start the animation loop if not running.
      if (!this.isRunning) {
        this.isRunning = true;
        this.animationFrameId = requestAnimationFrame((t) => this._tick(t));
      }
    },

    _localChallenge() {
      return window.localize(this.currentChallenge);
    },

    _updateChallengeHeader() {
      const numEl = document.getElementById('challenge-num');
      const titleEl = document.getElementById('challenge-title');
      const scenarioEl = document.getElementById('challenge-scenario');
      if (!this.currentChallenge) return;
      const local = this._localChallenge();
      if (numEl) numEl.textContent = String(this.currentIndex + 1);
      if (titleEl) titleEl.textContent = local.title;
      if (scenarioEl) scenarioEl.textContent = local.scenario;
    },

    _updateProgressBar() {
      const fill = document.getElementById('progress-fill');
      if (!fill) return;
      const total = (window.CHALLENGES || []).length || 1;
      const pct = (this.currentIndex / total) * 100;
      fill.style.width = pct + '%';
    },

    _setButtonsForNewChallenge() {
      if (this._btnHint) this._btnHint.disabled = false;
      if (this._btnReveal) this._btnReveal.disabled = false;
      if (this._btnNext) this._btnNext.disabled = true;
    },

    _formatScore(score) {
      return (score % 1 === 0) ? String(score) : score.toFixed(1);
    },

    _updateScoreDisplay() {
      const scoreEl = document.getElementById('challenge-score');
      if (scoreEl) scoreEl.textContent = this._formatScore(this.score);
    },

    // ---- Indexing (same logic as SystemSim) ------------------------------
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
        } catch (e) { /* ignore */ }

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

    // ---- Organelle click handlers ---------------------------------------
    _attachOrganelleHandlers() {
      this.svg.querySelectorAll('.organelle').forEach(el => {
        const id = el.getAttribute('data-organelle');
        el.addEventListener('click', () => this._handleOrganelleClick(id));
        el.addEventListener('keydown', (e) => {
          if (e.key === 'Enter' || e.key === ' ' || e.key === 'Spacebar') {
            e.preventDefault();
            this._handleOrganelleClick(id);
          }
        });
      });
    },

    _handleOrganelleClick(id) {
      if (!id || this.attemptedCorrect) return;

      if (id === this.currentChallenge.brokenOrganelle) {
        this.attemptedCorrect = true;

        let earned = 0;
        if (this.usedReveal) {
          earned = 0;
        } else if (this.attempts === 0 && !this.usedHint) {
          earned = 1.0;
        } else {
          earned = 0.5;
        }
        if (earned > 0) {
          this.score += earned;
          this._updateScoreDisplay();
        }

        this._markCorrectOrganelle();
        this._showCorrectFeedback(earned);
        this._disableHintAndReveal();
        if (this._btnNext) this._btnNext.disabled = false;
      } else {
        this.attempts += 1;
        this._flashWrongOrganelle(id);
        this._showWrongFeedback();
      }
    },

    _markCorrectOrganelle() {
      if (!this.svg) return;
      const el = this.svg.querySelector(
        '[data-organelle="' + this.currentChallenge.brokenOrganelle + '"]'
      );
      if (!el) return;
      el.classList.add('correct-answer');
      el.classList.add('disabled');
    },

    _flashWrongOrganelle(id) {
      if (!this.svg) return;
      const el = this.svg.querySelector('[data-organelle="' + id + '"]');
      if (!el) return;
      el.classList.add('wrong-attempt');
      const timer = setTimeout(() => {
        el.classList.remove('wrong-attempt');
      }, 700);
      this.wrongTimers.push(timer);
    },

    _clearWrongTimers() {
      this.wrongTimers.forEach(t => clearTimeout(t));
      this.wrongTimers = [];
      if (this.svg) {
        this.svg.querySelectorAll('.organelle.wrong-attempt').forEach(el => {
          el.classList.remove('wrong-attempt');
        });
      }
    },

    _disableHintAndReveal() {
      if (this._btnHint) this._btnHint.disabled = true;
      if (this._btnReveal) this._btnReveal.disabled = true;
    },

    // ---- Feedback panel --------------------------------------------------
    _hideFeedback() {
      const fb = document.getElementById('challenge-feedback');
      if (!fb) return;
      fb.classList.add('hidden');
      fb.classList.remove('feedback-correct', 'feedback-wrong', 'feedback-hint');
      fb.innerHTML = '';
      this._lastFeedbackRender = null;
    },

    _beginFeedback(kind) {
      const fb = document.getElementById('challenge-feedback');
      if (!fb) return null;
      fb.classList.remove('hidden', 'feedback-correct', 'feedback-wrong', 'feedback-hint');
      fb.classList.add('feedback-' + kind);
      fb.innerHTML = '';
      return fb;
    },

    _showCorrectFeedback(earned) {
      this._lastFeedbackRender = () => this._showCorrectFeedback(earned);
      const fb = this._beginFeedback('correct');
      if (!fb) return;

      const heading = document.createElement('span');
      heading.className = 'feedback-heading';
      heading.textContent = (earned === 1.0)
        ? window.t('feedback.correctFull')
        : window.t('feedback.correctHalf');
      fb.appendChild(heading);

      const expl = document.createElement('p');
      expl.className = 'explanation';
      expl.textContent = this._localChallenge().explanation;
      fb.appendChild(expl);
    },

    _showWrongFeedback() {
      this._lastFeedbackRender = () => this._showWrongFeedback();
      const fb = this._beginFeedback('wrong');
      if (!fb) return;

      const heading = document.createElement('span');
      heading.className = 'feedback-heading';
      heading.textContent = this.attempts === 1
        ? window.t('feedback.wrongFirst')
        : window.t('feedback.wrongAgain');
      fb.appendChild(heading);

      if (this.attempts === 1) {
        const cost = document.createElement('span');
        cost.className = 'cost-note';
        cost.textContent = window.t('feedback.wrongCost');
        fb.appendChild(cost);
      } else if (this.attempts >= 2) {
        const p = document.createElement('p');
        p.className = 'explanation';
        p.textContent = window.t('feedback.wrongTip');
        fb.appendChild(p);
      }
    },

    // ---- Button handlers -------------------------------------------------
    _onHint() {
      if (!this.currentChallenge || this.attemptedCorrect) return;
      const firstTime = !this.usedHint;
      this.usedHint = true;
      this._renderHintFeedback(firstTime);
    },

    _renderHintFeedback(showCost) {
      this._lastFeedbackRender = () => this._renderHintFeedback(showCost);
      const fb = this._beginFeedback('hint');
      if (!fb) return;

      const heading = document.createElement('span');
      heading.className = 'feedback-heading';
      heading.appendChild(document.createTextNode(window.t('feedback.hintLabel') + ' '));
      heading.appendChild(document.createTextNode(this._localChallenge().hint));
      fb.appendChild(heading);

      if (showCost) {
        const cost = document.createElement('span');
        cost.className = 'cost-note';
        cost.textContent = window.t('feedback.hintCost');
        fb.appendChild(cost);
      }
    },

    _onReveal() {
      if (!this.currentChallenge || this.attemptedCorrect) return;
      this.usedReveal = true;
      this.attemptedCorrect = true;
      this._markCorrectOrganelle();
      this._renderRevealFeedback();
      this._disableHintAndReveal();
      if (this._btnNext) this._btnNext.disabled = false;
    },

    _renderRevealFeedback() {
      this._lastFeedbackRender = () => this._renderRevealFeedback();

      const meta = window.ORGANELLE_DATA &&
        window.ORGANELLE_DATA[this.currentChallenge.brokenOrganelle];
      const name = meta
        ? window.localize(meta).name
        : this.currentChallenge.brokenOrganelle;

      const fb = this._beginFeedback('correct');
      if (!fb) return;

      const heading = document.createElement('span');
      heading.className = 'feedback-heading';
      heading.textContent =
        window.t('feedback.revealedPrefix') + ' ' + name + '. ' +
        window.t('feedback.revealedSuffix');
      fb.appendChild(heading);

      const expl = document.createElement('p');
      expl.className = 'explanation';
      expl.textContent = this._localChallenge().explanation;
      fb.appendChild(expl);
    },

    _onNext() {
      const total = (window.CHALLENGES || []).length;
      if (this.currentIndex < total - 1) {
        this._loadChallenge(this.currentIndex + 1);
      } else {
        this._showSummary();
      }
    },

    // ---- Summary ---------------------------------------------------------
    _showChallengeContent() {
      this._setHidden('challenge-feedback', true);
      const content = this.panelContainer && this.panelContainer.querySelector('.challenge-content');
      const buttons = this.panelContainer && this.panelContainer.querySelector('.challenge-buttons');
      const progress = this.panelContainer && this.panelContainer.querySelector('.challenge-progress');
      if (content) content.classList.remove('hidden');
      if (buttons) buttons.classList.remove('hidden');
      if (progress) progress.classList.remove('hidden');
      this._summaryVisible = false;
    },

    _hideSummary() {
      this._setHidden('challenge-summary', true);
      this._summaryVisible = false;
    },

    _showSummary() {
      // We let the cell simulation continue running behind the summary;
      // the summary card lives in the side panel, not over the cell view.
      this._summaryVisible = true;
      const total = (window.CHALLENGES || []).length;

      const summary = document.getElementById('challenge-summary');
      if (summary) {
        let tierKey = 'start';
        if (this.score >= 5.5) tierKey = 'master';
        else if (this.score >= 4) tierKey = 'strong';
        else if (this.score >= 2) tierKey = 'practice';

        summary.innerHTML = '';
        const emojiEl = document.createElement('div');
        emojiEl.className = 'summary-emoji';
        emojiEl.textContent = window.t('summary.' + tierKey + '.emoji');

        const h = document.createElement('h3');
        h.textContent = window.t('summary.heading');

        const scoreP = document.createElement('p');
        scoreP.className = 'summary-score';
        scoreP.textContent = this._formatScore(this.score) + ' ' +
          window.t('summary.outOf') + ' ' + total;

        const tierP = document.createElement('p');
        tierP.className = 'summary-tier';
        tierP.textContent = window.t('summary.' + tierKey + '.title');

        const msgP = document.createElement('p');
        msgP.className = 'summary-message';
        msgP.textContent = window.t('summary.' + tierKey + '.desc');

        const btn = document.createElement('button');
        btn.type = 'button';
        btn.textContent = window.t('challenge.button.startover');
        btn.addEventListener('click', () => this.start());

        summary.appendChild(emojiEl);
        summary.appendChild(h);
        summary.appendChild(scoreP);
        summary.appendChild(tierP);
        summary.appendChild(msgP);
        summary.appendChild(btn);

        summary.classList.remove('hidden');
      }

      // Hide content, feedback, action buttons.
      const content = this.panelContainer && this.panelContainer.querySelector('.challenge-content');
      const buttons = this.panelContainer && this.panelContainer.querySelector('.challenge-buttons');
      if (content) content.classList.add('hidden');
      if (buttons) buttons.classList.add('hidden');
      this._setHidden('challenge-feedback', true);

      // Progress bar to 100%.
      const fill = document.getElementById('progress-fill');
      if (fill) fill.style.width = '100%';
    },

    _setHidden(id, hidden) {
      const el = document.getElementById(id);
      if (!el) return;
      el.classList.toggle('hidden', hidden);
    },

    // ---- Starvation cascade ---------------------------------------------
    _updateStarvation(timestamp) {
      if (!this.currentChallenge) return;
      const deps = window.ORGANELLE_DEPENDENCIES[this.currentChallenge.cellType];
      if (!deps) return;

      Object.keys(deps).forEach(id => {
        // Never visually mark the broken organelle itself (the puzzle).
        if (id === this.currentChallenge.brokenOrganelle) return;

        const info = deps[id];
        const hasFailedDep = (info.dependsOn || []).some(d =>
          this.disabledOrganelles.has(d) || this.starvedOrganelles.has(d)
        );

        if (hasFailedDep && info.starveAfterMs !== Infinity) {
          if (this.starveSince[id] == null) {
            this.starveSince[id] = timestamp;
          } else if ((timestamp - this.starveSince[id]) >= info.starveAfterMs) {
            if (!this.starvedOrganelles.has(id)) {
              this.starvedOrganelles.add(id);
            }
            const el = this.svg && this.svg.querySelector('[data-organelle="' + id + '"]');
            if (el && !el.classList.contains('starving')) {
              el.classList.add('starving');
            }
          }
        } else {
          this.starveSince[id] = null;
          if (this.starvedOrganelles.has(id)) this.starvedOrganelles.delete(id);
          const el = this.svg && this.svg.querySelector('[data-organelle="' + id + '"]');
          if (el) el.classList.remove('starving');
        }
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

      if (!this.lastFrameTime) this.lastFrameTime = timestamp;
      if (!this.challengeStartedAt) this.challengeStartedAt = timestamp;
      const dt = timestamp - this.lastFrameTime;
      this.lastFrameTime = timestamp;

      this._updateStarvation(timestamp);

      const flows = (window.SYSTEM_FLOWS &&
        window.SYSTEM_FLOWS[this.currentChallenge.cellType]) || [];
      flows.forEach(flow => {
        const blocked = (flow.requires || []).some(r =>
          this.disabledOrganelles.has(r) || this.starvedOrganelles.has(r)
        );
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

  window.ChallengeMode = ChallengeMode;
})();
