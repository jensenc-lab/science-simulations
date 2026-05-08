/*
 * Star Life Cycle Simulation — Utah SEEd ESS.1.3
 * Logic added by phase:
 *   Phase 2 — Star visualization + mass slider
 *   Phase 3 — Life cycle stages + animation engine        [this phase]
 *   Phase 4 — H-R diagram
 *   Phase 5 — Matter/elements tracker
 *   Phase 6 — Tooltips + accessibility
 */

'use strict';

/* ────────────────────────────────────────────────────────────────
   PHASE 2 HELPERS (pure)
──────────────────────────────────────────────────────────────── */

function radiusFromMass(M)     { return Math.pow(M, 0.8); }              // R☉
function luminosityFromMass(M) { return Math.pow(M, 3.5); }              // L☉
function tempFromMass(M)       { return 5778 * Math.pow(M, 0.505); }     // K
function lifetimeFromMass(M) {                                           // billion years
  if (M >= 0.5) return 10 * Math.pow(M, -2.5);
  return 10 * Math.pow(M, -3);
}

const TEMP_COLOR_ANCHORS = [
  { T:  3000, c: [255, 106,  58] },
  { T:  4500, c: [255, 181, 107] },
  { T:  5800, c: [255, 244, 194] },
  { T:  7500, c: [255, 255, 255] },
  { T: 10000, c: [207, 225, 255] },
  { T: 20000, c: [155, 184, 255] },
  { T: 40000, c: [102, 136, 255] },
];

function colorFromTemp(T) {
  const a = TEMP_COLOR_ANCHORS;
  if (T <= a[0].T)            return a[0].c.slice();
  if (T >= a[a.length - 1].T) return a[a.length - 1].c.slice();
  for (let i = 0; i < a.length - 1; i++) {
    if (T >= a[i].T && T <= a[i + 1].T) {
      const f = (T - a[i].T) / (a[i + 1].T - a[i].T);
      return [0, 1, 2].map(j => Math.round(a[i].c[j] + f * (a[i + 1].c[j] - a[i].c[j])));
    }
  }
  return [255, 255, 255];
}

const rgb     = c       => `rgb(${c[0]}, ${c[1]}, ${c[2]})`;
const lighten = (c, a)  => c.map(v => Math.round(v + (255 - v) * a));
const darken  = (c, a)  => c.map(v => Math.round(v * (1 - a)));

function displayRadius(R, base = 50, exp = 0.4) { return base * Math.pow(R, exp); }

/* ────────────────────────────────────────────────────────────────
   CATEGORIES & PATHWAYS
──────────────────────────────────────────────────────────────── */

function categoryFromMass(M) {
  if (M < 0.5)  return 'red-dwarf';
  if (M < 8)    return 'sun-like';
  if (M <= 25)  return 'high-mass';
  return 'very-high-mass';
}

const PATHWAY_BY_CATEGORY = {
  'red-dwarf':       'redDwarf',
  'sun-like':        'sunLike',
  'high-mass':       'highMass',
  'very-high-mass':  'veryHighMass',
};

function getPathway(M) { return PATHWAY_BY_CATEGORY[categoryFromMass(M)]; }

const PATHWAYS = {
  redDwarf:     ['nebula', 'protostar', 'msRedDwarf',     'heliumWhiteDwarf'],
  sunLike:      ['nebula', 'protostar', 'msSunLike',      'redGiant',      'planetaryNebula', 'whiteDwarf'],
  highMass:     ['nebula', 'protostar', 'msMassive',      'redSupergiant', 'supernova',       'neutronStar'],
  veryHighMass: ['nebula', 'protostar', 'msVeryMassive',  'supergiant',    'supernova',       'blackHole'],
};

function getMSStageId(pathwayId) {
  return {
    redDwarf:     'msRedDwarf',
    sunLike:      'msSunLike',
    highMass:     'msMassive',
    veryHighMass: 'msVeryMassive',
  }[pathwayId];
}

/* ────────────────────────────────────────────────────────────────
   STAGES (data only)
──────────────────────────────────────────────────────────────── */

// Stage definitions — name/description/matter caption now come from translations.js
// via t(stage.nameKey) / t(stage.descKey) / t(stage.matterKey).
const STAGES = {
  nebula:           { nameKey: 'stage_nebula',           descKey: 'desc_nebula',           matterKey: 'matter_nebula',           simSec: 4, realDuration: 1e6 },
  protostar:        { nameKey: 'stage_protostar',        descKey: 'desc_protostar',        matterKey: 'matter_protostar',        simSec: 4, realDuration: 1e7 },
  msRedDwarf:       { nameKey: 'stage_msRedDwarf',       descKey: 'desc_msRedDwarf',       matterKey: 'matter_msRedDwarf',       simSec: 8, realDurationFromMass: m => lifetimeFromMass(m) * 1e9 },
  msSunLike:        { nameKey: 'stage_msSunLike',        descKey: 'desc_msSunLike',        matterKey: 'matter_msSunLike',        simSec: 8, realDurationFromMass: m => lifetimeFromMass(m) * 1e9 },
  msMassive:        { nameKey: 'stage_msMassive',        descKey: 'desc_msMassive',        matterKey: 'matter_msMassive',        simSec: 6, realDurationFromMass: m => lifetimeFromMass(m) * 1e9 },
  msVeryMassive:    { nameKey: 'stage_msVeryMassive',    descKey: 'desc_msVeryMassive',    matterKey: 'matter_msVeryMassive',    simSec: 5, realDurationFromMass: m => lifetimeFromMass(m) * 1e9 },
  redGiant:         { nameKey: 'stage_redGiant',         descKey: 'desc_redGiant',         matterKey: 'matter_redGiant',         simSec: 6, realDuration: 1e9 },
  redSupergiant:    { nameKey: 'stage_redSupergiant',    descKey: 'desc_redSupergiant',    matterKey: 'matter_redSupergiant',    simSec: 5, realDuration: 1e6 },
  supergiant:       { nameKey: 'stage_supergiant',       descKey: 'desc_supergiant',       matterKey: 'matter_supergiant',       simSec: 4, realDuration: 5e5 },
  planetaryNebula:  { nameKey: 'stage_planetaryNebula',  descKey: 'desc_planetaryNebula',  matterKey: 'matter_planetaryNebula',  simSec: 5, realDuration: 1e4 },
  supernova:        { nameKey: 'stage_supernova',        descKey: 'desc_supernova',        matterKey: 'matter_supernova',        simSec: 4, realDuration: 1 },
  whiteDwarf:       { nameKey: 'stage_whiteDwarf',       descKey: 'desc_whiteDwarf',       matterKey: 'matter_whiteDwarf',       simSec: 6, realDuration: 1e13 },
  heliumWhiteDwarf: { nameKey: 'stage_heliumWhiteDwarf', descKey: 'desc_heliumWhiteDwarf', matterKey: 'matter_heliumWhiteDwarf', simSec: 6, realDuration: 1e13 },
  neutronStar:      { nameKey: 'stage_neutronStar',      descKey: 'desc_neutronStar',      matterKey: 'matter_neutronStar',      simSec: 6, realDuration: 1e13 },
  blackHole:        { nameKey: 'stage_blackHole',        descKey: 'desc_blackHole',        matterKey: 'matter_blackHole',        simSec: 6, realDuration: 1e13 },
};

function getStageRealDuration(stageId, mass) {
  const s = STAGES[stageId];
  if (s.realDurationFromMass) return s.realDurationFromMass(mass);
  return s.realDuration;
}

/* ────────────────────────────────────────────────────────────────
   TWEEN UTILITIES
──────────────────────────────────────────────────────────────── */

function lerp(a, b, t)     { return a + (b - a) * t; }
function easeInOut(t)      { return 0.5 - 0.5 * Math.cos(Math.PI * t); }
function lerpColor(c1, c2, t) {
  return [0, 1, 2].map(i => Math.round(lerp(c1[i], c2[i], t)));
}

// Reduced-motion: snap stage transitions instead of cross-stage tweening.
const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');

/* ────────────────────────────────────────────────────────────────
   VISUAL PARAMS — every stage produces an object of this shape
──────────────────────────────────────────────────────────────── */

const MIN_R = 10;
const MAX_R = 145;
const safeR = r => Math.max(MIN_R, Math.min(MAX_R, r));

function emptyVisual() {
  return {
    star:      { coreR: 0, haloR: 0, coreColor: [255,255,255], haloColor: [255,255,255], opacity: 0, pulse: 'normal', flatFill: false },
    nebula:    { opacity: 0 },
    shell:     { rInner: 0, rOuter: 0, opacity: 0, color: [123,232,255], colorInner: [255,123,232] },
    accretion: { rx: 0, ry: 0, opacity: 0, color: [255,174,90] },
    photon:    { r: 0, opacity: 0, color: [255,208,120] },
    lensed:    { upperPath: 'M 0 0', lowerPath: 'M 0 0', opacity: 0, color: [255,174,90] },
    debris:    { rInner: 0, rOuter: 0, opacity: 0, colorInner: [255,230,128], colorOuter: [255,170,68] },
  };
}

function makeStar(r, color, opts = {}) {
  return {
    coreR:     r,
    haloR:     r * (opts.haloMult || 1.9),
    coreColor: color,
    haloColor: opts.haloColor || color,
    opacity:   opts.opacity != null ? opts.opacity : 1,
    pulse:     opts.pulse || 'normal',
    flatFill:  !!opts.flatFill,
  };
}

function computeVisual(stageId, progress, mass) {
  const v       = emptyVisual();
  const msR     = displayRadius(radiusFromMass(mass));
  const msColor = colorFromTemp(tempFromMass(mass));

  switch (stageId) {

    case 'nebula':
      v.nebula.opacity = 1;
      return v;

    case 'protostar':
      v.star = makeStar(safeR(msR * 1.3), [200, 70, 50], { haloMult: 2.2 });
      return v;

    case 'msRedDwarf':
    case 'msSunLike':
    case 'msMassive':
    case 'msVeryMassive':
      v.star = makeStar(safeR(msR), msColor);
      return v;

    case 'redGiant':
      v.star = makeStar(safeR(msR * 6),  [255, 110, 60], { haloMult: 1.6 });
      return v;

    case 'redSupergiant':
      v.star = makeStar(safeR(msR * 12), [220,  70, 50], { haloMult: 1.5 });
      return v;

    case 'supergiant':
      v.star = makeStar(safeR(msR * 14), [240,  90, 50], { haloMult: 1.5 });
      return v;

    case 'planetaryNebula': {
      v.star = makeStar(safeR(msR * 0.5), [220, 240, 255], { haloMult: 2.5 });
      const growth = lerp(1, 5, progress);
      v.shell.rOuter  = Math.min(180, msR * growth);
      v.shell.rInner  = Math.min(180, msR * growth * 0.7);
      v.shell.opacity = lerp(0.85, 0.15, progress);
      return v;
    }

    case 'supernova': {
      if (progress < 0.3) {
        // Flash phase: explosive expansion to brilliant white
        const flashT = progress / 0.3;
        const peakR  = lerp(msR, 200, flashT);
        v.star = makeStar(Math.min(180, peakR), [255, 255, 255], { haloMult: 1.7 });
      } else {
        // Debris phase: star fades, colorful rings expand
        const debT = (progress - 0.3) / 0.7;
        v.star = makeStar(0, [0, 0, 0], { opacity: Math.max(0, 1 - debT * 1.5) });
        const debrisR = lerp(40, 200, debT);
        v.debris.rOuter  = Math.min(180, debrisR);
        v.debris.rInner  = Math.min(180, debrisR * 0.7);
        v.debris.opacity = lerp(0.95, 0, debT);
      }
      return v;
    }

    case 'whiteDwarf':
      v.star = makeStar(safeR(msR * 0.3),  [200, 230, 255], { haloMult: 1.6 });
      return v;

    case 'heliumWhiteDwarf':
      v.star = makeStar(safeR(msR * 0.25), [220, 235, 240], { haloMult: 1.4 });
      return v;

    case 'neutronStar':
      v.star = makeStar(Math.max(8, msR * 0.1), [180, 220, 255], { pulse: 'fast', haloMult: 2.4 });
      return v;

    case 'blackHole': {
      const discR  = safeR(msR * 0.4);
      const ringRx = safeR(msR * 1.5);
      const ringRy = ringRx * 0.25;

      v.star = makeStar(discR, [10, 10, 15], {
        haloMult: 1.05, haloColor: [10, 10, 15], pulse: 'none', flatFill: true,
      });

      v.accretion.rx = ringRx;
      v.accretion.ry = ringRy;
      v.accretion.opacity = 0.9;

      // Photon ring — bright thin rim right at the event-horizon edge
      v.photon.r = discR * 1.08;
      v.photon.opacity = 1;

      // Lensed halo arcs — back of the disk's light bent over (upper, dramatic)
      // and under (lower, subtler) the sphere. Endpoints anchor at the disk's
      // left/right edges so the structure reads as one continuous wrapping band.
      const cx = 200, cy = 160;
      const left  = (cx - ringRx).toFixed(1);
      const right = (cx + ringRx).toFixed(1);
      const upperRy = Math.min(140, ringRy * 4.5);
      const lowerRy = Math.min(70,  ringRy * 1.7);
      v.lensed.upperPath = `M ${left} ${cy} A ${ringRx.toFixed(1)} ${upperRy.toFixed(1)} 0 0 0 ${right} ${cy}`;
      v.lensed.lowerPath = `M ${left} ${cy} A ${ringRx.toFixed(1)} ${lowerRy.toFixed(1)} 0 0 1 ${right} ${cy}`;
      v.lensed.opacity = 1;
      return v;
    }
  }
  return v;
}

function lerpVisual(a, b, t) {
  return {
    star: {
      coreR:     lerp(a.star.coreR,    b.star.coreR,    t),
      haloR:     lerp(a.star.haloR,    b.star.haloR,    t),
      coreColor: lerpColor(a.star.coreColor, b.star.coreColor, t),
      haloColor: lerpColor(a.star.haloColor, b.star.haloColor, t),
      opacity:   lerp(a.star.opacity,  b.star.opacity,  t),
      pulse:     t < 0.5 ? a.star.pulse    : b.star.pulse,
      flatFill:  t < 0.5 ? a.star.flatFill : b.star.flatFill,
    },
    nebula: { opacity: lerp(a.nebula.opacity, b.nebula.opacity, t) },
    shell: {
      rInner:     lerp(a.shell.rInner,  b.shell.rInner,  t),
      rOuter:     lerp(a.shell.rOuter,  b.shell.rOuter,  t),
      opacity:    lerp(a.shell.opacity, b.shell.opacity, t),
      color:      lerpColor(a.shell.color,      b.shell.color,      t),
      colorInner: lerpColor(a.shell.colorInner, b.shell.colorInner, t),
    },
    accretion: {
      rx:      lerp(a.accretion.rx,      b.accretion.rx,      t),
      ry:      lerp(a.accretion.ry,      b.accretion.ry,      t),
      opacity: lerp(a.accretion.opacity, b.accretion.opacity, t),
      color:   lerpColor(a.accretion.color, b.accretion.color, t),
    },
    photon: {
      r:       lerp(a.photon.r,       b.photon.r,       t),
      opacity: lerp(a.photon.opacity, b.photon.opacity, t),
      color:   lerpColor(a.photon.color, b.photon.color, t),
    },
    lensed: {
      // Path strings can't be numerically lerped — snap halfway through
      upperPath: t < 0.5 ? a.lensed.upperPath : b.lensed.upperPath,
      lowerPath: t < 0.5 ? a.lensed.lowerPath : b.lensed.lowerPath,
      opacity:   lerp(a.lensed.opacity, b.lensed.opacity, t),
      color:     lerpColor(a.lensed.color, b.lensed.color, t),
    },
    debris: {
      rInner:     lerp(a.debris.rInner,  b.debris.rInner,  t),
      rOuter:     lerp(a.debris.rOuter,  b.debris.rOuter,  t),
      opacity:    lerp(a.debris.opacity, b.debris.opacity, t),
      colorInner: lerpColor(a.debris.colorInner, b.debris.colorInner, t),
      colorOuter: lerpColor(a.debris.colorOuter, b.debris.colorOuter, t),
    },
  };
}

/* ────────────────────────────────────────────────────────────────
   STATE
──────────────────────────────────────────────────────────────── */

const STORAGE_LANG_KEY = 'starLifeCycleLang';

function getStoredLanguage() {
  try {
    const v = localStorage.getItem(STORAGE_LANG_KEY);
    if (v === 'en' || v === 'es') return v;
  } catch (e) { /* localStorage may be unavailable */ }
  return 'en';
}

const state = {
  initialMass:   1.0,
  pathwayId:     'sunLike',
  runStarted:    false,
  isPlaying:     false,
  atEnd:         false,
  stageIndex:    0,
  stageProgress: 0,
  realAge:       0,
  // Matter tracker — % of original mass released, by category [H, He, C/O, Heavy, >Fe]
  released:      [0, 0, 0, 0, 0],
  // i18n
  language:      getStoredLanguage(),
};

/* ────────────────────────────────────────────────────────────────
   FORMATTERS
──────────────────────────────────────────────────────────────── */

const fmt1     = n => n.toFixed(1);
const fmtComma = n => Math.round(n).toLocaleString('en-US');

// Radius spans from neutron-star (~1.4×10⁻⁵ R☉) to supernova-debris (~10⁵ R☉).
function formatRadius(R) {
  if (R == null || isNaN(R))    return '—';
  if (R >= 1e5)                 return R.toExponential(1);
  if (R >= 1000)                return (Math.round(R / 100) * 100).toLocaleString('en-US');
  if (R >= 10)                  return R.toFixed(1);
  if (R >= 1)                   return R.toFixed(2);
  if (R >= 0.001)               return R.toFixed(4);
  if (R >= 1e-5)                return R.toFixed(6);
  return R.toExponential(1);
}
// Luminosity spans from white-dwarf (~10⁻³) to supernova peak (~10⁹).
function formatLuminosity(L) {
  if (L == null || isNaN(L)) return '—';
  if (L >= 1e6)              return L.toExponential(1);
  if (L >= 1000)             return fmtComma(L);
  if (L >= 10)               return L.toFixed(1);
  if (L >= 1)                return L.toFixed(2);
  if (L >= 0.001)            return L.toFixed(4);
  return L.toExponential(2);
}
// Lifetime formatter — `bn` is lifetime in billions of years. Unit terms come
// from the translation table so EN "billion years" → ES "mil millones de años",
// "million years" → "millones de años", etc.
function formatLifetime(bn) {
  if (bn >= 0.5) {
    const v = bn >= 100 ? fmtComma(bn) : fmt1(bn);
    return `${v} ${t('unitBillionYears')}`;
  }
  const tm = bn * 1000;
  if (tm >= 10) return `${fmtComma(tm)} ${t('unitMillionYears')}`;
  return `${fmt1(tm)} ${t('unitMillionYears')}`;
}
function formatAge(years) {
  if (years <= 0)    return `0 ${t('unitYears')}`;
  if (years >= 1e12) return `${(years / 1e12).toFixed(2)} ${t('unitTrillionYears')}`;
  if (years >= 1e9)  return `${(years / 1e9 ).toFixed(2)} ${t('unitBillionYears')}`;
  if (years >= 1e6)  return `${(years / 1e6 ).toFixed(2)} ${t('unitMillionYears')}`;
  if (years >= 1e3)  return `${(years / 1e3 ).toFixed(1)} ${t('unitThousandYears')}`;
  return `${Math.round(years).toLocaleString('en-US')} ${t('unitYears')}`;
}

/* ────────────────────────────────────────────────────────────────
   DOM REFS
──────────────────────────────────────────────────────────────── */

const $ = id => document.getElementById(id);

const slider          = $('massSlider');
const massValueEl     = $('massValue');
const categoryEls     = document.querySelectorAll('.mass-cat');

const btnPlay         = $('btnPlay');
const btnReset        = $('btnReset');
const btnStep         = $('btnStep');

const stagePill       = $('stagePill');
const pathwayDots     = $('pathwayDots');
const endBanner       = $('endBanner');

const coreCircle      = $('coreCircle');
const haloCircle      = $('haloCircle');
const starGroup       = $('starGroup');
const coreStopIn      = $('coreStopIn');
const coreStopMid     = $('coreStopMid');
const coreStopOut     = $('coreStopOut');
const haloStopIn      = $('haloStopIn');
const haloStopMid     = $('haloStopMid');

const nebulaGroup     = $('nebulaGroup');
const shellGroup      = $('shellGroup');
const shellInner      = $('shellInner');
const shellOuter      = $('shellOuter');
const accretionBack       = $('accretionBack');
const accretionFront      = $('accretionFront');
const accRing             = $('accRing');
const accRingOuter        = $('accRingOuter');
const accRingFront        = $('accRingFront');
const accRingOuterFront   = $('accRingOuterFront');
const photonRing          = $('photonRing');
const lensedArcsGroup     = $('lensedArcsGroup');
const lensedUpper         = $('lensedUpper');
const lensedLower         = $('lensedLower');
const debrisGroup     = $('debrisGroup');
const debrisInner     = $('debrisInner');
const debrisOuter     = $('debrisOuter');

const starSvgDesc     = $('starSvgDesc');

const propStage       = $('propStage');
const propMass        = $('propMass');
const propRadius      = $('propRadius');
const propTemp        = $('propTemp');
const propLum         = $('propLum');
const propLifetime    = $('propLifetime');
const propAge         = $('propAge');
const propDescription = $('propDescription');
const progressFill    = $('progressFill');

/* ────────────────────────────────────────────────────────────────
   APPLY VISUAL → SVG
──────────────────────────────────────────────────────────────── */

function applyVisual(v) {
  // Star core + halo
  coreCircle.setAttribute('r', v.star.coreR);
  haloCircle.setAttribute('r', v.star.haloR);
  starGroup.style.opacity = v.star.opacity;
  starGroup.classList.toggle('pulse-fast', v.star.pulse === 'fast');
  starGroup.classList.toggle('pulse-none', v.star.pulse === 'none');

  if (v.star.flatFill) {
    const c = rgb(v.star.coreColor);
    coreStopIn .setAttribute('stop-color', c);
    coreStopMid.setAttribute('stop-color', c);
    coreStopOut.setAttribute('stop-color', c);
  } else {
    coreStopIn .setAttribute('stop-color', rgb(lighten(v.star.coreColor, 0.55)));
    coreStopMid.setAttribute('stop-color', rgb(v.star.coreColor));
    coreStopOut.setAttribute('stop-color', rgb(darken (v.star.coreColor, 0.55)));
  }
  haloStopIn .setAttribute('stop-color', rgb(v.star.haloColor));
  haloStopMid.setAttribute('stop-color', rgb(v.star.haloColor));

  // Nebula
  nebulaGroup.style.opacity = v.nebula.opacity;

  // Planetary shell
  shellGroup.style.opacity = v.shell.opacity;
  shellOuter.setAttribute('r', v.shell.rOuter);
  shellInner.setAttribute('r', v.shell.rInner);
  shellOuter.setAttribute('stroke', rgb(v.shell.color));
  shellInner.setAttribute('stroke', rgb(v.shell.colorInner));

  // Accretion ring — back + front halves stay in sync (clip paths in
  // world space split the ring around the sphere)
  accretionBack .style.opacity = v.accretion.opacity;
  accretionFront.style.opacity = v.accretion.opacity;
  const accStroke = rgb(v.accretion.color);
  [accRing, accRingFront].forEach(el => {
    el.setAttribute('rx', v.accretion.rx);
    el.setAttribute('ry', v.accretion.ry);
    el.setAttribute('stroke', accStroke);
  });
  [accRingOuter, accRingOuterFront].forEach(el => {
    el.setAttribute('rx', v.accretion.rx * 1.18);
    el.setAttribute('ry', v.accretion.ry * 1.18);
    el.setAttribute('stroke', accStroke);
  });

  // Photon ring (event-horizon rim)
  photonRing.style.opacity = v.photon.opacity;
  photonRing.setAttribute('r', v.photon.r);
  photonRing.setAttribute('stroke', rgb(v.photon.color));

  // Lensed halo arcs (gravitationally bent disk light)
  lensedArcsGroup.style.opacity = v.lensed.opacity;
  lensedUpper.setAttribute('d', v.lensed.upperPath || 'M 0 0');
  lensedLower.setAttribute('d', v.lensed.lowerPath || 'M 0 0');
  const lensedStroke = rgb(v.lensed.color);
  lensedUpper.setAttribute('stroke', lensedStroke);
  lensedLower.setAttribute('stroke', lensedStroke);

  // Supernova debris
  debrisGroup.style.opacity = v.debris.opacity;
  debrisOuter.setAttribute('r', v.debris.rOuter);
  debrisInner.setAttribute('r', v.debris.rInner);
  debrisOuter.setAttribute('stroke', rgb(v.debris.colorOuter));
  debrisInner.setAttribute('stroke', rgb(v.debris.colorInner));
}

/* ────────────────────────────────────────────────────────────────
   GET CURRENT VISUAL — handles cross-stage tween in last 25%
──────────────────────────────────────────────────────────────── */

function getRenderedVisual() {
  const path     = PATHWAYS[state.pathwayId];
  const stageId  = path[state.stageIndex];
  const v        = computeVisual(stageId, state.stageProgress, state.initialMass);

  if (!reducedMotion.matches &&
      state.stageProgress > 0.75 && state.stageIndex < path.length - 1 && !state.atEnd) {
    const nextId = path[state.stageIndex + 1];
    const vNext  = computeVisual(nextId, 0, state.initialMass);
    const t      = (state.stageProgress - 0.75) / 0.25;
    return lerpVisual(v, vNext, easeInOut(t));
  }
  return v;
}

/* ────────────────────────────────────────────────────────────────
   PATHWAY DOTS
──────────────────────────────────────────────────────────────── */

function renderPathwayDots() {
  const path = PATHWAYS[state.pathwayId];
  if (pathwayDots.dataset.pathway !== state.pathwayId ||
      pathwayDots.children.length !== path.length) {
    pathwayDots.innerHTML = '';
    path.forEach(stageId => {
      const d = document.createElement('span');
      d.className = 'pd-dot';
      d.title = STAGES[stageId].name;
      pathwayDots.appendChild(d);
    });
    pathwayDots.dataset.pathway = state.pathwayId;
  }
  Array.from(pathwayDots.children).forEach((d, i) => {
    d.classList.remove('active', 'done');
    if (state.runStarted) {
      if (i  <  state.stageIndex) d.classList.add('done');
      if (i === state.stageIndex) d.classList.add('active');
    }
  });
}

/* ────────────────────────────────────────────────────────────────
   MATTER & ELEMENTS TRACKER
──────────────────────────────────────────────────────────────── */

// Composition is a 5-element array: [H, He, C/O, Heavy(up to Fe), >Fe]
// Targets are end-of-stage compositions; the in-star bar lerps from the
// previous stage's target → this stage's target across stageProgress.
// `release` is the % of original star mass ejected during this stage.
const STAGE_MATTER_BY_STAGE = {
  nebula:           { target: [75, 25,   0,   0,  0], release: 0   },
  protostar:        { target: [75, 25,   0,   0,  0], release: 0   },
  msRedDwarf:       { target: [20, 80,   0,   0,  0], release: 0.1 },
  msSunLike:        { target: [50, 50,   0,   0,  0], release: 1   },
  msMassive:        { target: [40, 60,   0,   0,  0], release: 5   },
  msVeryMassive:    { target: [30, 70,   0,   0,  0], release: 10  },
  redGiant:         { target: [30, 60,  10,   0,  0], release: 5   },
  redSupergiant:    { target: [15, 30,  30,  25,  0], release: 15  },
  supergiant:       { target: [10, 25,  30,  35,  0], release: 20  },
  planetaryNebula:  { target: [ 5, 10,  85,   0,  0], release: 45  },
  whiteDwarf:       { target: [ 0,  0, 100,   0,  0], release: 0   },
  heliumWhiteDwarf: { target: [ 5, 95,   0,   0,  0], release: 5   },
  neutronStar:      { target: 'neutron',              release: 0   },
  blackHole:        { target: 'blackHole',            release: 0   },
};

// Supernova differs by pathway — both eject most of the star, but the breakdown
// of newly-forged elements differs slightly. `releaseBreakdown` overrides the
// proportional-to-composition default and is in % of original mass per category.
const SUPERNOVA_BY_PATHWAY = {
  highMass:     { target: [0, 0, 0, 0, 0], release: 75, releaseBreakdown: [5, 10, 25, 30, 5] },
  veryHighMass: { target: [0, 0, 0, 0, 0], release: 70, releaseBreakdown: [5, 10, 20, 30, 5] },
};

function getStageMatter(stageId, pathwayId) {
  if (stageId === 'supernova') return SUPERNOVA_BY_PATHWAY[pathwayId];
  return STAGE_MATTER_BY_STAGE[stageId];
}

// Matter category labels for the in-bar percentage readout — translated via t().
function matterLabels() {
  return [t('elemH'), t('elemHe'), t('elemCO'), t('elemHeavy'), t('elemFe')];
}

function lerpArray(a, b, t) {
  return a.map((v, i) => v + (b[i] - v) * t);
}

// Composition currently in the star — handles preview, exotic states, and
// the linear lerp from the previous stage's target to this stage's target.
function getInStarComposition(stageId, progress, pathwayId) {
  const matter = getStageMatter(stageId, pathwayId);
  if (!matter) return [75, 25, 0, 0, 0];
  if (typeof matter.target === 'string') return { special: matter.target };

  const path = PATHWAYS[pathwayId];
  const idx  = path.indexOf(stageId);
  let prevTarget = matter.target;
  if (idx > 0) {
    const prev = getStageMatter(path[idx - 1], pathwayId);
    if (prev && typeof prev.target !== 'string') prevTarget = prev.target;
  }
  return lerpArray(prevTarget, matter.target, Math.min(1, Math.max(0, progress)));
}

function accumulateRelease(stageId, dProg) {
  const matter = getStageMatter(stageId, state.pathwayId);
  if (!matter || matter.release === 0) return;
  if (matter.releaseBreakdown) {
    for (let i = 0; i < 5; i++) {
      state.released[i] += matter.releaseBreakdown[i] * dProg;
    }
    return;
  }
  // Distribute proportionally to current in-star composition
  const comp = getInStarComposition(stageId, state.stageProgress, state.pathwayId);
  if (comp.special) return;
  const dRelease = matter.release * dProg;
  const total    = comp.reduce((s, v) => s + v, 0) || 1;
  for (let i = 0; i < 5; i++) {
    state.released[i] += dRelease * (comp[i] / total);
  }
}

function clearMatter() {
  state.released = [0, 0, 0, 0, 0];
}

// DOM refs (resolved at startup via the shared $ helper later in the file)
let inStarSegments, releasedSegments, inStarSpecial, inStarPctEl,
    releasedPctEl, captionTextEl;

function initMatterRefs() {
  inStarSegments   = ['inStarH', 'inStarHe', 'inStarCO', 'inStarHeavy', 'inStarFe'].map($);
  releasedSegments = ['releasedH','releasedHe','releasedCO','releasedHeavy','releasedFe'].map($);
  inStarSpecial    = $('inStarSpecial');
  inStarPctEl      = $('inStarPct');
  releasedPctEl    = $('releasedPct');
  captionTextEl    = $('captionText');
}

function formatCompositionPct(comp) {
  const labels = matterLabels();
  return comp
    .map((v, i) => v >= 0.5 ? `${labels[i]} ${Math.round(v)}%` : null)
    .filter(Boolean)
    .join(' · ') || '—';
}

function applyInStarBar(comp) {
  if (comp && comp.special) {
    inStarSegments.forEach(seg => { seg.style.flexBasis = '0%'; });
    inStarSpecial.hidden = false;
    inStarSpecial.classList.toggle('neutron',   comp.special === 'neutron');
    inStarSpecial.classList.toggle('blackHole', comp.special === 'blackHole');
    inStarSpecial.textContent = comp.special === 'neutron'
      ? t('matterExoticNeutron')
      : t('matterExoticBlackHole');
    inStarPctEl.textContent = comp.special === 'neutron'
      ? t('matterExoticRemnant')
      : t('matterExoticSingular');
    return;
  }
  inStarSpecial.hidden = true;
  inStarSegments.forEach((seg, i) => {
    seg.style.flexBasis = `${(comp[i] || 0).toFixed(2)}%`;
  });
  inStarPctEl.textContent = formatCompositionPct(comp);
}

function applyReleasedBar(released) {
  let total = 0;
  releasedSegments.forEach((seg, i) => {
    const v = Math.max(0, Math.min(100, released[i]));
    seg.style.flexBasis = `${v.toFixed(2)}%`;
    total += released[i];
  });
  releasedPctEl.textContent = `${t('pctReleased')} ${Math.round(Math.min(100, total))}%`;
}

function renderMatter() {
  if (!state.runStarted) {
    // Per spec: preview state shows nebula composition (75/25), released = 0
    applyInStarBar([75, 25, 0, 0, 0]);
    applyReleasedBar(state.released);
    captionTextEl.textContent = t('previewCaption');
    return;
  }
  const stageId = PATHWAYS[state.pathwayId][state.stageIndex];
  applyInStarBar(getInStarComposition(stageId, state.stageProgress, state.pathwayId));
  applyReleasedBar(state.released);
  captionTextEl.textContent = t(STAGES[stageId].matterKey);
}

/* ────────────────────────────────────────────────────────────────
   H-R DIAGRAM
──────────────────────────────────────────────────────────────── */

const HR = {
  vbW: 600, vbH: 240,
  pad: { l: 60, r: 20, t: 20, b: 40 },
  T_LEFT:  50000,   // hot edge (left)
  T_RIGHT: 2500,    // cool edge (right)
  L_BOT:   1e-4,
  L_TOP:   1e6,
};

const HR_TEMP_TICKS = [40000, 20000, 10000, 6000, 4000, 3000];
const HR_LUM_TICKS = [
  { val: 1e-4, label: '10⁻⁴' },
  { val: 1e-2, label: '10⁻²' },
  { val: 1,    label: '1' },
  { val: 1e2,  label: '10²' },
  { val: 1e4,  label: '10⁴' },
  { val: 1e6,  label: '10⁶' },
];

function tempToX(T) {
  const c = Math.max(HR.T_RIGHT, Math.min(HR.T_LEFT, T));
  const f = (Math.log10(c) - Math.log10(HR.T_LEFT)) /
            (Math.log10(HR.T_RIGHT) - Math.log10(HR.T_LEFT));
  return HR.pad.l + f * (HR.vbW - HR.pad.l - HR.pad.r);
}
function lumToY(L) {
  const c = Math.max(HR.L_BOT, Math.min(HR.L_TOP, L));
  const f = (Math.log10(c) - Math.log10(HR.L_BOT)) /
            (Math.log10(HR.L_TOP) - Math.log10(HR.L_BOT));
  const plotH = HR.vbH - HR.pad.t - HR.pad.b;
  return HR.pad.t + plotH - f * plotH;
}
function hrToSVG(T, L) { return { x: tempToX(T), y: lumToY(L) }; }

const SVGNS = 'http://www.w3.org/2000/svg';
function svgEl(tag, attrs = {}, text) {
  const el = document.createElementNS(SVGNS, tag);
  for (const k in attrs) el.setAttribute(k, attrs[k]);
  if (text != null) el.textContent = text;
  return el;
}

const hrTrailEl  = $('hrTrail');
const hrMarker   = $('hrMarker');
const hrMarkerCore = $('hrMarkerCore');
const hrMarkerHalo = $('hrMarkerHalo');
const hrEdgeNote = $('hrEdgeNote');

function initHRDiagram() {
  const fmtTempLabel = T => T >= 10000 ? `${T / 1000}k` : `${T.toLocaleString('en-US')}`;

  // Background regions (drawn first, low opacity)
  // nameKey + tipKey reference TRANSLATIONS; applyTranslations() will fill them in.
  const regions = [
    { nameKey: 'hrSupergiants',  tipKey: 'tipHRSupergiants',  color: '#e74c3c',
      poly:  [[50000, 1e6], [2500, 1e6], [2500, 1e4], [50000, 1e4]], label: [10000, 1e5] },
    { nameKey: 'hrGiants',       tipKey: 'tipHRGiants',       color: '#f39c12',
      poly:  [[5500, 1e3], [2500, 1e3], [2500, 1e1], [5500, 1e1]],   label: [3500, 80] },
    { nameKey: 'hrMainSequence', tipKey: 'tipHRMainSequence', color: '#f1c40f',
      poly:  [[50000, 1e6], [50000, 1e4], [2500, Math.pow(10, -3.5)], [2500, 0.1]],
      label: [9000, 4] },
    { nameKey: 'hrWhiteDwarfs',  tipKey: 'tipHRWhiteDwarfs',  color: '#5dade2',
      poly:  [[40000, 1e-1], [6000, 1e-1], [6000, 1e-4], [40000, 1e-4]],
      label: [13000, 0.005] },
  ];
  const hrRegions      = $('hrRegions');
  const hrRegionLabels = $('hrRegionLabels');
  regions.forEach(r => {
    const pts = r.poly.map(([T, L]) => {
      const p = hrToSVG(T, L);
      return `${p.x.toFixed(1)},${p.y.toFixed(1)}`;
    }).join(' ');
    hrRegions.appendChild(svgEl('polygon', { points: pts, fill: r.color, class: 'hr-region' }));

    const lp = hrToSVG(r.label[0], r.label[1]);
    hrRegionLabels.appendChild(svgEl('text',
      { x: lp.x.toFixed(1), y: lp.y.toFixed(1),
        class: 'hr-region-label', 'text-anchor': 'middle',
        tabindex: '0',
        'data-i18n': r.nameKey,
        'data-i18n-tooltip': r.tipKey },
      t(r.nameKey)));
  });

  // Plot border
  $('hrAxes').appendChild(svgEl('rect', {
    x: HR.pad.l, y: HR.pad.t,
    width:  HR.vbW - HR.pad.l - HR.pad.r,
    height: HR.vbH - HR.pad.t - HR.pad.b,
    class: 'hr-axis',
  }));

  // Gridlines + ticks + tick labels
  const hrGrid       = $('hrGrid');
  const hrTickLines  = $('hrTickLines');
  const hrAxisLabels = $('hrAxisLabels');

  HR_TEMP_TICKS.forEach(T => {
    const x = tempToX(T);
    hrGrid.appendChild(svgEl('line',
      { x1: x, y1: HR.pad.t, x2: x, y2: HR.vbH - HR.pad.b, class: 'hr-grid' }));
    hrTickLines.appendChild(svgEl('line',
      { x1: x, y1: HR.vbH - HR.pad.b, x2: x, y2: HR.vbH - HR.pad.b + 4, class: 'hr-tick' }));
    hrAxisLabels.appendChild(svgEl('text',
      { x: x.toFixed(1), y: (HR.vbH - HR.pad.b + 14).toFixed(1),
        class: 'hr-axis-label', 'text-anchor': 'middle' },
      fmtTempLabel(T)));
  });

  HR_LUM_TICKS.forEach(({ val, label }) => {
    const y = lumToY(val);
    hrGrid.appendChild(svgEl('line',
      { x1: HR.pad.l, y1: y, x2: HR.vbW - HR.pad.r, y2: y, class: 'hr-grid' }));
    hrTickLines.appendChild(svgEl('line',
      { x1: HR.pad.l - 4, y1: y, x2: HR.pad.l, y2: y, class: 'hr-tick' }));
    hrAxisLabels.appendChild(svgEl('text',
      { x: (HR.pad.l - 8).toFixed(1), y: (y + 3.5).toFixed(1),
        class: 'hr-axis-label', 'text-anchor': 'end' },
      label));
  });

  // Axis titles
  const hrAxisTitles = $('hrAxisTitles');
  const xCenter = (HR.pad.l + HR.vbW - HR.pad.r) / 2;
  const yCenter = (HR.pad.t + HR.vbH - HR.pad.b) / 2;
  hrAxisTitles.appendChild(svgEl('text',
    { x: xCenter.toFixed(1), y: (HR.vbH - 6).toFixed(1),
      class: 'hr-axis-title', 'text-anchor': 'middle',
      'data-i18n': 'hrXAxis' },
    t('hrXAxis')));
  hrAxisTitles.appendChild(svgEl('text',
    { x: 14, y: yCenter.toFixed(1),
      class: 'hr-axis-title', 'text-anchor': 'middle',
      transform: `rotate(-90 14 ${yCenter.toFixed(1)})`,
      'data-i18n': 'hrYAxis' },
    t('hrYAxis')));

  // Sun reference
  const sunPos = hrToSVG(5778, 1);
  const hrSun  = $('hrSun');
  hrSun.appendChild(svgEl('text',
    { x: sunPos.x.toFixed(1), y: (sunPos.y + 5).toFixed(1),
      class: 'hr-sun-icon', tabindex: '0',
      'data-i18n-tooltip': 'tipHRSun' },
    '☉'));
  hrSun.appendChild(svgEl('text',
    { x: sunPos.x.toFixed(1), y: (sunPos.y + 18).toFixed(1),
      class: 'hr-sun-label',
      'data-i18n': 'hrSun' },
    t('hrSun')));
}

/* ── Stage properties (R, T, L) — single source of truth ────────────────
   The H-R diagram and the right-panel readout both derive from these.
   Real (un-clamped) physical values; the H-R wrapper below applies the
   diagram-specific clamping for off-scale stages (neutron star). */

function getStageProperties(stageId, progress, mass) {
  switch (stageId) {
    case 'nebula':
      return { visible: false };

    case 'protostar':
      return { R: 2 * radiusFromMass(mass), T: 3500, L: 10, visible: true };

    case 'msRedDwarf':
    case 'msSunLike':
    case 'msMassive':
    case 'msVeryMassive':
      return {
        R: radiusFromMass(mass),
        T: tempFromMass(mass),
        L: luminosityFromMass(mass),
        visible: true,
      };

    case 'redGiant':         return { R: 100, T: 3800, L: 200,    visible: true };
    case 'redSupergiant':    return { R: 500, T: 3500, L: 50000,  visible: true };
    case 'supergiant':       return { R: 800, T: 4500, L: 200000, visible: true };
    case 'planetaryNebula':  return { R: 0.5, T: 50000, L: 100,   visible: true };

    case 'supernova': {
      // T constant; L peaks ~10⁹ briefly at ~30% then fades to ~10⁵.
      // R expands from ~1 to 10⁴ during the flash, then to ~10⁵ as debris flies out.
      const T = 6000;
      let L, R;
      if (progress < 0.3) {
        const t = progress / 0.3;
        L = Math.pow(10, lerp(0, 9, t));
        R = Math.pow(10, lerp(0, 4, t));
      } else {
        const t = (progress - 0.3) / 0.7;
        L = Math.pow(10, lerp(9, 5, t));
        R = Math.pow(10, lerp(4, 5, t));
      }
      return { R, T, L, visible: true };
    }

    case 'whiteDwarf':       return { R: 0.01,    T: 25000,  L: 0.01,  visible: true };
    case 'heliumWhiteDwarf': return { R: 0.012,   T: 10000,  L: 0.001, visible: true };

    case 'neutronStar':
      // Real values: T ≈ 6×10⁵ K, R ≈ 1.4×10⁻⁵ R☉, L ≈ 10⁻³ L☉.
      // The H-R wrapper below clamps these onto the diagram edge.
      return { R: 0.000014, T: 600000, L: 0.001, visible: true, neutronStar: true };

    case 'blackHole':
      return { visible: false, blackHole: true };
  }
  return { visible: false };
}

/* H-R diagram wrapper: derives the diagram coordinate from the canonical
   stage properties and applies off-scale clamping for the neutron star. */
function getHRPositionForStage(stageId, progress, mass) {
  const p = getStageProperties(stageId, progress, mass);
  if (!p.visible) {
    if (p.blackHole) return { visible: false, blackHole: true };
    return { visible: false };
  }
  if (p.neutronStar) {
    return { T: HR.T_LEFT, L: HR.L_BOT, visible: true, neutronClamp: true };
  }
  return { T: p.T, L: p.L, visible: true };
}

function lerpHRLog(a, b, t) {
  if (!a.visible && !b.visible) return { visible: false };
  if (!a.visible) return { ...b, opacity: t };          // fade in
  if (!b.visible) return { ...a, opacity: 1 - t };      // fade out
  const T = Math.pow(10, lerp(Math.log10(a.T), Math.log10(b.T), t));
  const L = Math.pow(10, lerp(Math.log10(a.L), Math.log10(b.L), t));
  return { T, L, visible: true, opacity: 1 };
}

function getCurrentHRPosition() {
  if (!state.runStarted) {
    // Preview: show main-sequence position for current mass
    return {
      T: tempFromMass(state.initialMass),
      L: luminosityFromMass(state.initialMass),
      visible: true, opacity: 0.85,
    };
  }
  const path     = PATHWAYS[state.pathwayId];
  const stageId  = path[state.stageIndex];
  const progress = state.stageProgress;
  const cur      = getHRPositionForStage(stageId, progress, state.initialMass);
  if (cur.opacity == null) cur.opacity = 1;

  if (!reducedMotion.matches &&
      progress > 0.75 && state.stageIndex < path.length - 1 && !state.atEnd) {
    const nextId = path[state.stageIndex + 1];
    const nxt    = getHRPositionForStage(nextId, 0, state.initialMass);
    if (nxt.opacity == null) nxt.opacity = 1;
    const t      = easeInOut((progress - 0.75) / 0.25);
    return lerpHRLog(cur, nxt, t);
  }
  return cur;
}

/* ── Properties cross-stage tween (R, T, L) ──────────────────────
   R and L spread many orders of magnitude → log-space lerp.
   T can stay linear in K. */

function lerpProps(a, b, t) {
  if (!a.visible && !b.visible) return { visible: false };
  if (!a.visible) return { ...b };  // snap into next-stage values
  if (!b.visible) return { ...a };  // hold last visible values
  return {
    R: Math.pow(10, lerp(Math.log10(a.R), Math.log10(b.R), t)),
    T: lerp(a.T, b.T, t),
    L: Math.pow(10, lerp(Math.log10(a.L), Math.log10(b.L), t)),
    visible: true,
  };
}

function getCurrentProperties() {
  if (!state.runStarted) {
    // Preview: show main-sequence values for the current mass
    return getStageProperties(getMSStageId(state.pathwayId), 0, state.initialMass);
  }
  const path     = PATHWAYS[state.pathwayId];
  const stageId  = path[state.stageIndex];
  const progress = state.stageProgress;
  const cur      = getStageProperties(stageId, progress, state.initialMass);

  if (!reducedMotion.matches &&
      progress > 0.75 && state.stageIndex < path.length - 1 && !state.atEnd) {
    const nextId = path[state.stageIndex + 1];
    const nxt    = getStageProperties(nextId, 0, state.initialMass);
    const t      = easeInOut((progress - 0.75) / 0.25);
    return lerpProps(cur, nxt, t);
  }
  return cur;
}

/* ── Trail ──────────────────────────────────────────────────── */

let trail = [];
let lastTrailTime = 0;
const TRAIL_INTERVAL = 100;
const TRAIL_MAX      = 500;

function clearTrail() {
  trail = [];
  hrTrailEl.setAttribute('points', '');
}

function updateHRTrail(pos) {
  if (!state.runStarted || !state.isPlaying)        return;
  if (!pos.visible || (pos.opacity ?? 1) < 0.5)     return;
  const now = performance.now();
  if (now - lastTrailTime < TRAIL_INTERVAL)         return;

  const { x, y } = hrToSVG(pos.T, pos.L);
  const last = trail[trail.length - 1];
  if (last && Math.hypot(x - last.x, y - last.y) < 0.5) return;

  trail.push({ x, y });
  if (trail.length > TRAIL_MAX) trail.shift();
  hrTrailEl.setAttribute('points',
    trail.map(p => `${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(' '));
  lastTrailTime = now;
}

/* ── Render the marker + edge note ───────────────────────────── */

function updateHRMarker(pos) {
  if (!pos.visible || (pos.opacity ?? 1) < 0.02) {
    hrMarker.style.opacity = 0;
    return;
  }
  const { x, y } = hrToSVG(pos.T, pos.L);
  hrMarker.setAttribute('transform', `translate(${x.toFixed(1)},${y.toFixed(1)})`);
  hrMarker.style.opacity = pos.opacity ?? 1;

  const color = colorFromTemp(pos.T);
  const cstr  = rgb(color);
  hrMarkerCore.setAttribute('fill',   cstr);
  hrMarkerHalo.setAttribute('fill',   cstr);
  hrMarkerHalo.setAttribute('stroke', cstr);
}

function applyEdgeNote() {
  // The cross-stage tween uses the previous stageId, so the note appears
  // exactly when stageIndex advances into a terminal stage — no flicker.
  if (!state.runStarted) { hrEdgeNote.style.opacity = 0; return; }
  const stageId = PATHWAYS[state.pathwayId][state.stageIndex];

  if (stageId === 'neutronStar') {
    const p = hrToSVG(HR.T_LEFT, HR.L_BOT);
    hrEdgeNote.setAttribute('x', (p.x + 10).toFixed(1));
    hrEdgeNote.setAttribute('y', (p.y - 6).toFixed(1));
    hrEdgeNote.textContent = t('hrNeutronNote');
    hrEdgeNote.style.opacity = 0.9;
  } else if (stageId === 'blackHole') {
    hrEdgeNote.setAttribute('x', (HR.pad.l + 10).toFixed(1));
    hrEdgeNote.setAttribute('y', (HR.vbH - HR.pad.b - 8).toFixed(1));
    hrEdgeNote.textContent = t('hrBlackHoleNote');
    hrEdgeNote.style.opacity = 0.9;
  } else {
    hrEdgeNote.style.opacity = 0;
  }
}

function renderHR() {
  const pos = getCurrentHRPosition();
  updateHRMarker(pos);
  updateHRTrail(pos);
  applyEdgeNote();
}

/* ────────────────────────────────────────────────────────────────
   RENDER
──────────────────────────────────────────────────────────────── */

function render() {
  const M    = state.initialMass;
  const path = PATHWAYS[state.pathwayId];

  if (!state.runStarted) {
    // Preview: show main-sequence appearance for current mass
    applyVisual(computeVisual(getMSStageId(state.pathwayId), 0, M));
    stagePill.textContent = t('stagePillReady');
    stagePill.classList.add('preview');
    stagePill.classList.remove('end');
    propStage.textContent = t('propStageReady');
    propStage.classList.add('preview');
    propStage.classList.remove('end');
    propDescription.textContent = t('previewDescription');
    progressFill.style.width = '0%';
    endBanner.hidden = true;
  } else {
    applyVisual(getRenderedVisual());
    const stageId = path[state.stageIndex];
    const stage   = STAGES[stageId];
    const stageName = t(stage.nameKey);
    const stageDesc = t(stage.descKey);

    stagePill.textContent = stageName;
    propStage.textContent = stageName;
    stagePill.classList.remove('preview');
    propStage.classList.remove('preview');
    stagePill.classList.toggle('end', state.atEnd);
    propStage.classList.toggle('end', state.atEnd);

    propDescription.textContent = state.atEnd
      ? t('descEndPrefix') + stageDesc
      : stageDesc;

    progressFill.style.width = `${state.stageProgress * 100}%`;
    endBanner.hidden = !state.atEnd;
  }

  renderPathwayDots();

  // Slider + mass display + category
  massValueEl.textContent = `${t('massPrefix')} ${fmt1(M)} M☉`;
  const cat = categoryFromMass(M);
  categoryEls.forEach(el => el.classList.toggle('active', el.dataset.cat === cat));

  // Properties — radius / temp / luminosity now evolve with the current stage.
  // Mass and Main-Sequence lifetime stay derived from the initial mass.
  const props = getCurrentProperties();
  propMass.textContent = fmt1(M);
  if (props.visible) {
    propRadius.textContent = formatRadius(props.R);
    propTemp  .textContent = fmtComma(Math.round(props.T));
    propLum   .textContent = formatLuminosity(props.L);
  } else {
    propRadius.textContent = '—';
    propTemp  .textContent = '—';
    propLum   .textContent = '—';
  }
  propLifetime.textContent = formatLifetime(lifetimeFromMass(M));
  propAge     .textContent = formatAge(state.realAge);

  // Buttons + slider
  btnPlay.textContent = state.isPlaying ? t('btnPause') : t('btnPlay');
  btnPlay.classList.toggle('is-playing', state.isPlaying);
  btnPlay.disabled    = state.atEnd;
  btnStep.disabled    = state.atEnd;
  slider.disabled     = state.isPlaying;
  btnPlay.setAttribute('aria-label', state.isPlaying ? t('ariaPause') : t('ariaPlay'));
  btnPlay.setAttribute('data-tooltip', state.isPlaying ? t('tipPause') : t('tipPlay'));

  // Update the star SVG accessible description with the current stage name
  if (starSvgDesc) {
    const stageNameForDesc = state.runStarted
      ? t(STAGES[PATHWAYS[state.pathwayId][state.stageIndex]].nameKey)
      : t('starSvgDescPreviewMode');
    starSvgDesc.textContent = `${t('starSvgDescPrefix')}${stageNameForDesc}.`;
  }

  // Slider aria-valuetext (announces the current mass to screen readers)
  slider.setAttribute('aria-valuetext', `${fmt1(M)} ${t('ariaSliderValueSuffix')}`);

  // H-R diagram (marker, trail, edge notes)
  renderHR();

  // Matter & elements tracker
  renderMatter();
}

/* ────────────────────────────────────────────────────────────────
   TICK LOOP
──────────────────────────────────────────────────────────────── */

let lastFrameTime = 0;

function tick(now) {
  if (!lastFrameTime) lastFrameTime = now;
  const dt = Math.min(0.1, (now - lastFrameTime) / 1000);
  lastFrameTime = now;

  if (state.isPlaying && !state.atEnd) {
    const path    = PATHWAYS[state.pathwayId];
    const stageId = path[state.stageIndex];
    const stage   = STAGES[stageId];

    const dProg = dt / stage.simSec;
    state.stageProgress += dProg;
    state.realAge       += dProg * getStageRealDuration(stageId, state.initialMass);
    accumulateRelease(stageId, dProg);

    if (state.stageProgress >= 1) {
      if (state.stageIndex < path.length - 1) {
        state.stageProgress = 0;
        state.stageIndex++;
      } else {
        state.stageProgress = 1;
        state.isPlaying     = false;
        state.atEnd         = true;
      }
    }
  }

  render();
  requestAnimationFrame(tick);
}

/* ────────────────────────────────────────────────────────────────
   ACTIONS
──────────────────────────────────────────────────────────────── */

function startRunIfNeeded() {
  if (!state.runStarted) {
    state.runStarted    = true;
    state.stageIndex    = 0;
    state.stageProgress = 0;
    state.realAge       = 0;
    state.atEnd         = false;
    state.pathwayId     = getPathway(state.initialMass);
  }
}

function handlePlay() {
  if (state.atEnd) return;
  startRunIfNeeded();
  state.isPlaying = !state.isPlaying;
}

function handleReset() {
  state.runStarted    = false;
  state.isPlaying     = false;
  state.atEnd         = false;
  state.stageIndex    = 0;
  state.stageProgress = 0;
  state.realAge       = 0;
  state.pathwayId     = getPathway(state.initialMass);
  clearTrail();
  clearMatter();
}

function handleStep() {
  if (state.atEnd) return;
  if (!state.runStarted) { startRunIfNeeded(); return; }

  const path    = PATHWAYS[state.pathwayId];
  const stageId = path[state.stageIndex];
  const dRemaining = 1 - state.stageProgress;
  state.realAge += dRemaining * getStageRealDuration(stageId, state.initialMass);
  accumulateRelease(stageId, dRemaining);
  state.stageIndex++;
  state.stageProgress = 0;

  if (state.stageIndex >= path.length) {
    state.stageIndex    = path.length - 1;
    state.stageProgress = 1;
    state.isPlaying     = false;
    state.atEnd         = true;
  }
}

function handleMassChange() {
  state.initialMass   = parseFloat(slider.value);
  state.pathwayId     = getPathway(state.initialMass);
  // (aria-valuetext is updated in render() so it stays in sync with the language)
  // Slider change always returns to preview (per spec: "calls Reset implicitly")
  state.runStarted    = false;
  state.isPlaying     = false;
  state.atEnd         = false;
  state.stageIndex    = 0;
  state.stageProgress = 0;
  state.realAge       = 0;
  clearTrail();
  clearMatter();
}

/* ────────────────────────────────────────────────────────────────
   TOOLTIPS
──────────────────────────────────────────────────────────────── */

const tooltipEl = $('tooltip');
let tooltipTouchTimer = null;
let tooltipCurrentTarget = null;
const isTouch = () => matchMedia('(hover: none)').matches;

function showTooltip(target, text) {
  if (!text) return;
  tooltipEl.textContent = text;
  tooltipEl.classList.add('show');
  tooltipEl.setAttribute('aria-hidden', 'false');
  tooltipCurrentTarget = target;
  positionTooltip(target);
}

function hideTooltip() {
  tooltipEl.classList.remove('show');
  tooltipEl.setAttribute('aria-hidden', 'true');
  tooltipCurrentTarget = null;
}

function positionTooltip(target) {
  // Use getBoundingClientRect — works for HTML and SVG elements alike.
  const r  = target.getBoundingClientRect();
  // Measure the tooltip after content is set
  const tr = tooltipEl.getBoundingClientRect();
  const margin = 8;
  let top  = r.top  - tr.height - margin;
  let left = r.left + r.width / 2 - tr.width / 2;
  // Flip below if would clip the top
  if (top < margin) top = r.bottom + margin;
  // Clamp horizontally to viewport
  left = Math.max(margin, Math.min(window.innerWidth - tr.width - margin, left));
  tooltipEl.style.top  = `${top}px`;
  tooltipEl.style.left = `${left}px`;
}

function bindTooltip(el) {
  let hoverTimer = null;

  el.addEventListener('mouseenter', () => {
    clearTimeout(hoverTimer);
    hoverTimer = setTimeout(
      () => showTooltip(el, el.getAttribute('data-tooltip')), 300);
  });
  el.addEventListener('mouseleave', () => {
    clearTimeout(hoverTimer);
    if (tooltipCurrentTarget === el) hideTooltip();
  });
  el.addEventListener('focus', () => {
    showTooltip(el, el.getAttribute('data-tooltip'));
  });
  el.addEventListener('blur', () => {
    if (tooltipCurrentTarget === el) hideTooltip();
  });
  // Touch devices: tap shows, auto-dismiss after 5s, outside-tap dismisses.
  el.addEventListener('click', () => {
    if (!isTouch()) return;
    showTooltip(el, el.getAttribute('data-tooltip'));
    clearTimeout(tooltipTouchTimer);
    tooltipTouchTimer = setTimeout(hideTooltip, 5000);
  });
}

function initTooltips() {
  document.querySelectorAll('[data-tooltip]').forEach(bindTooltip);
  // Outside-click dismiss for touch
  document.addEventListener('click', (e) => {
    if (!isTouch() || !tooltipCurrentTarget) return;
    if (!e.target.closest('[data-tooltip]')) {
      clearTimeout(tooltipTouchTimer);
      hideTooltip();
    }
  }, true);
  // Reposition on scroll/resize while a tooltip is open
  window.addEventListener('scroll', () => {
    if (tooltipCurrentTarget) positionTooltip(tooltipCurrentTarget);
  }, true);
  window.addEventListener('resize', () => {
    if (tooltipCurrentTarget) positionTooltip(tooltipCurrentTarget);
  });
}

/* ────────────────────────────────────────────────────────────────
   FULLSCREEN — toggle between page view and true browser fullscreen.
   Works inside iframes only when the parent grants `allow="fullscreen"`;
   if denied, requestFullscreen() rejects silently — no user-visible error.
──────────────────────────────────────────────────────────────── */

const fullscreenBtn = $('fullscreenBtn');

function isFullscreen() {
  return !!(document.fullscreenElement
        ||  document.webkitFullscreenElement
        ||  document.mozFullScreenElement
        ||  document.msFullscreenElement);
}

function toggleFullscreen() {
  if (!isFullscreen()) {
    const el  = document.documentElement;
    const req = el.requestFullscreen
            ||  el.webkitRequestFullscreen
            ||  el.mozRequestFullScreen
            ||  el.msRequestFullscreen;
    if (req) {
      const p = req.call(el);
      if (p && typeof p.catch === 'function') p.catch(() => { /* iframe may forbid — silent */ });
    }
  } else {
    const exit = document.exitFullscreen
             ||  document.webkitExitFullscreen
             ||  document.mozCancelFullScreen
             ||  document.msExitFullscreen;
    if (exit) exit.call(document);
  }
}

function updateFullscreenButton() {
  const fs = isFullscreen();
  fullscreenBtn.classList.toggle('is-fullscreen', fs);
  const labelKey = fs ? 'ariaExitFullscreen' : 'ariaEnterFullscreen';
  const tipKey   = fs ? 'tipExitFullscreen'  : 'tipEnterFullscreen';
  fullscreenBtn.setAttribute('aria-label',  t(labelKey));
  fullscreenBtn.setAttribute('data-tooltip', t(tipKey));
}

/* ────────────────────────────────────────────────────────────────
   I18N — apply translations + toggle language
──────────────────────────────────────────────────────────────── */

const langBtn = $('langBtn');

function applyTranslations() {
  // <html lang>
  document.documentElement.lang = state.language;

  // <title>
  document.title = t('pageTitle');

  // Static text (everything with [data-i18n])
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n');
    if (key) el.textContent = t(key);
  });

  // Tooltips ([data-i18n-tooltip] → data-tooltip)
  document.querySelectorAll('[data-i18n-tooltip]').forEach(el => {
    const key = el.getAttribute('data-i18n-tooltip');
    if (key) el.setAttribute('data-tooltip', t(key));
  });

  // ARIA labels ([data-i18n-aria] → aria-label)
  document.querySelectorAll('[data-i18n-aria]').forEach(el => {
    const key = el.getAttribute('data-i18n-aria');
    if (key) el.setAttribute('aria-label', t(key));
  });

  // Lang button: data-lang attribute drives CSS (green pill in ES)
  langBtn.dataset.lang = state.language;

  // Fullscreen button — aria-label + tooltip depend on BOTH state and language
  updateFullscreenButton();
}

function switchLanguage() {
  state.language = state.language === 'en' ? 'es' : 'en';
  try { localStorage.setItem(STORAGE_LANG_KEY, state.language); } catch (e) { /* no-op */ }
  applyTranslations();
  // render() refreshes dynamic strings (stage name, properties, Play button, etc.)
  render();
}

/* ────────────────────────────────────────────────────────────────
   WIRE UP + INIT
──────────────────────────────────────────────────────────────── */

slider .addEventListener('input', handleMassChange);
btnPlay.addEventListener('click', handlePlay);
btnReset.addEventListener('click', handleReset);
btnStep.addEventListener('click', handleStep);
langBtn.addEventListener('click', switchLanguage);
fullscreenBtn.addEventListener('click', toggleFullscreen);

// Sync the icon/aria-label if the user exits fullscreen via ESC, or the
// browser drops out of fullscreen for any reason.
document.addEventListener('fullscreenchange',       updateFullscreenButton);
document.addEventListener('webkitfullscreenchange', updateFullscreenButton);
document.addEventListener('mozfullscreenchange',    updateFullscreenButton);
document.addEventListener('MSFullscreenChange',     updateFullscreenButton);

state.pathwayId = getPathway(state.initialMass);
initHRDiagram();
initMatterRefs();
applyTranslations(); // set initial language texts (after HR SVG labels exist)
initTooltips();      // bind ALL data-tooltip elements
requestAnimationFrame(tick);
