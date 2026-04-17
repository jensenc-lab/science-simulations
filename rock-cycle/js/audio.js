// ── audio.js ──────────────────────────────────────────────────────────────────
// Rock Cycle Lab — Utah SEEd 7.2.1
// Procedural Web Audio API sound effects — no external files needed

'use strict';

const AudioSystem = {
  ctx:   null,
  muted: false,
  ready: false,

  // ── Bootstrap (must be called from a user gesture) ──────────────────────────
  init() {
    if (this.ready) return;
    try {
      this.ctx = new (window.AudioContext || window.webkitAudioContext)();
      this.ready = true;
    } catch (_) { /* Web Audio not available — sounds silently disabled */ }
  },

  // ── Play a named sound ──────────────────────────────────────────────────────
  play(name) {
    if (this.muted || !this.ready || !this.ctx) return;
    try { this[name](); } catch (_) { /* ignore audio errors */ }
  },

  // ── Utility: create a quick oscillator note ─────────────────────────────────
  _note(freq, type, start, dur, vol) {
    const ctx = this.ctx;
    const t   = ctx.currentTime + start;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(freq, t);
    gain.gain.setValueAtTime(0, t);
    gain.gain.linearRampToValueAtTime(vol, t + Math.min(0.01, dur * 0.2));
    gain.gain.linearRampToValueAtTime(0, t + dur);
    osc.connect(gain).connect(ctx.destination);
    osc.start(t);
    osc.stop(t + dur + 0.05);
  },

  // ── Sound Definitions ───────────────────────────────────────────────────────

  // Short low click when drag starts
  pickUp() {
    this._note(150, 'sine', 0, 0.05, 0.15);
  },

  // Satisfying thud on valid drop
  dropValid() {
    this._note(80, 'sine', 0, 0.15, 0.2);
    this._note(120, 'sine', 0.01, 0.12, 0.12);
  },

  // Short buzz on invalid drop
  dropInvalid() {
    this._note(200, 'sawtooth', 0, 0.12, 0.08);
  },

  // Low rumble when transformation animation starts
  transformStart() {
    const ctx = this.ctx;
    const t = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(60, t);
    gain.gain.setValueAtTime(0, t);
    gain.gain.linearRampToValueAtTime(0.12, t + 0.1);
    gain.gain.linearRampToValueAtTime(0, t + 0.35);
    osc.connect(gain).connect(ctx.destination);
    osc.start(t);
    osc.stop(t + 0.4);
  },

  // Rising major chord chime when transformation completes
  transformComplete() {
    this._note(523, 'sine', 0,    0.3, 0.12);  // C5
    this._note(659, 'sine', 0.05, 0.25, 0.10); // E5
    this._note(784, 'sine', 0.10, 0.25, 0.10); // G5
  },

  // Ascending two-note tone for path discovery
  pathDiscovered() {
    this._note(440, 'sine', 0,    0.10, 0.10);  // A4
    this._note(554, 'sine', 0.08, 0.15, 0.12);  // C#5
  },

  // Celebratory arpeggio when all 8 paths found
  allPathsComplete() {
    this._note(523, 'sine', 0,    0.12, 0.10); // C5
    this._note(659, 'sine', 0.08, 0.12, 0.10); // E5
    this._note(784, 'sine', 0.16, 0.12, 0.10); // G5
    this._note(1047,'sine', 0.24, 0.30, 0.12); // C6
  },

  // Positive ding for guided step complete
  guidedStepComplete() {
    this._note(880, 'sine', 0, 0.12, 0.10);
  },

  // Subtle UI click
  click() {
    this._note(1000, 'sine', 0, 0.02, 0.06);
  }
};
