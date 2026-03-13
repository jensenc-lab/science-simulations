'use strict';
/* cross-section.js — animated boundary cross-section diagrams */

let _cv, _cx, _raf, _t0, _sub, _type;

const CAP = {
  'convergent/Continental–Continental': 'Both plates are too buoyant to subduct — crust folds and thickens, pushing up mountains.',
  'convergent/Oceanic–Continental':     'Dense oceanic crust subducts under lighter continental crust, generating trenches and volcanoes.',
  'convergent/Oceanic–Oceanic':         'The denser plate subducts, forming the world\'s deepest trenches and volcanic island arcs.',
  'divergent/Oceanic–Oceanic':          'Plates pull apart and magma rises to create new oceanic crust, forming an underwater mountain ridge.',
  'divergent/Continental–Continental':  'Continental crust stretches and thins, creating a rift valley. This may eventually split the continent and form a new ocean.',
  'transform/Continental–Continental':  'Plates slide horizontally past each other. No crust is created or destroyed, but friction along the boundary causes earthquakes. The San Andreas Fault in California is the most famous example.',
};

window.showCrossSection = function(b) {
  cancelAnimationFrame(_raf);
  _sub  = b.subtype;
  _type = b.type;
  const el = document.getElementById('crossSection');
  el.style.cssText = 'padding:0;display:flex;flex-direction:column;overflow:hidden;';
  el.innerHTML = '';
  _cv = document.createElement('canvas');
  _cv.style.cssText = 'width:100%;flex:1;min-height:0;display:block;';
  const cap = document.createElement('p');
  cap.style.cssText = 'color:#7f8ea3;font-size:15px;padding:5px 12px;flex-shrink:0;text-align:center;line-height:1.4;';
  cap.textContent = CAP[_type + '/' + _sub] ?? '';
  el.appendChild(_cv);
  el.appendChild(cap);
  _t0 = null;
  _raf = requestAnimationFrame(_loop);
};

window.stopCrossSection = function() { cancelAnimationFrame(_raf); };

// ── Animation loop ────────────────────────────────────────────
function _loop(ts) {
  if (!_t0) _t0 = ts;
  const sec  = (ts - _t0) / 1000;
  const prog = Math.min(sec / 3.5, 1); // 0→1 ramp over 3.5 s, then holds
  const W = _cv.clientWidth, H = _cv.clientHeight;
  if (W < 10 || H < 10) { _raf = requestAnimationFrame(_loop); return; }
  if (_cv.width !== W || _cv.height !== H) { _cv.width = W; _cv.height = H; }
  _cx = _cv.getContext('2d');
  _cx.clearRect(0, 0, W, H);
  if      (_type === 'convergent' && _sub === 'Continental–Continental') _drawCC(W, H, prog, sec);
  else if (_type === 'convergent' && _sub === 'Oceanic–Continental')     _drawOC(W, H, prog, sec);
  else if (_type === 'convergent' && _sub === 'Oceanic–Oceanic')         _drawOO(W, H, prog, sec);
  else if (_type === 'divergent'  && _sub === 'Oceanic–Oceanic')         _drawMidOcean(W, H, prog, sec);
  else if (_type === 'divergent'  && _sub === 'Continental–Continental') _drawRift(W, H, prog, sec);
  else if (_type === 'transform')                                         _drawTransform(W, H, prog, sec);
  _raf = requestAnimationFrame(_loop);
}

// ── Shared helpers ────────────────────────────────────────────
function _mantle(W, H, y) {
  const g = _cx.createLinearGradient(0, y, 0, H);
  g.addColorStop(0, '#c0502a'); g.addColorStop(1, '#e07030');
  _cx.fillStyle = g; _cx.fillRect(0, y, W, H - y);
}

function _label(txt, x, y, align = 'center') {
  _cx.save();
  _cx.font = 'bold 16px "Segoe UI",sans-serif'; _cx.textAlign = align;
  _cx.fillStyle = 'rgba(0,0,0,0.6)'; _cx.fillText(txt, x + 1, y + 1);
  _cx.fillStyle = '#fff';             _cx.fillText(txt, x, y);
  _cx.restore();
}

// Draws a bold white arrow with dark outline on a plate surface.
// cx/cy = center of arrow; dir = +1 for right (→), -1 for left (←).
function _plateArrow(cx, cy, dir) {
  const AW = 22;  // half-length from center to tip
  const SH = 5;   // shaft half-height
  const HW = 11;  // arrowhead half-width (perpendicular to travel)
  const HL = 13;  // arrowhead length along travel direction
  const tail  = cx - dir * AW;
  const tip   = cx + dir * AW;
  const hinge = tip - dir * HL;
  _cx.save();
  _cx.globalAlpha = 1;
  _cx.beginPath();
  _cx.moveTo(tail,  cy - SH);
  _cx.lineTo(hinge, cy - SH);
  _cx.lineTo(hinge, cy - HW);
  _cx.lineTo(tip,   cy);
  _cx.lineTo(hinge, cy + HW);
  _cx.lineTo(hinge, cy + SH);
  _cx.lineTo(tail,  cy + SH);
  _cx.closePath();
  _cx.strokeStyle = 'rgba(0,0,0,0.75)';
  _cx.lineWidth   = 2.5;
  _cx.lineJoin    = 'round';
  _cx.stroke();
  _cx.fillStyle = '#ffffff';
  _cx.fill();
  _cx.restore();
}

// ── Continental–Continental ───────────────────────────────────
function _drawCC(W, H, p, sec) {
  const sy  = H * 0.56, ph = Math.min(H * 0.12, 28);
  const gap = Math.max(0, (1 - p / 0.65)) * W * 0.12;
  const mh  = gap < 2 ? Math.min(1, (p - 0.65) / 0.35) * H * 0.3 : 0;

  _mantle(W, H, sy);

  // Left plate
  _cx.fillStyle = '#b8a070'; _cx.strokeStyle = '#8a7050'; _cx.lineWidth = 1;
  _cx.fillRect(0, sy - ph, W / 2 - gap, ph);
  _cx.strokeRect(0, sy - ph, W / 2 - gap, ph);
  // Right plate
  _cx.fillRect(W / 2 + gap, sy - ph, W / 2 - gap, ph);
  _cx.strokeRect(W / 2 + gap, sy - ph, W / 2 - gap, ph);
  // Land surface strips
  _cx.fillStyle = '#3a7a3a';
  _cx.fillRect(0, sy - ph - 3, W / 2 - gap, 4);
  _cx.fillRect(W / 2 + gap, sy - ph - 3, W / 2 - gap, 4);

  // Mountains rise after plates meet
  if (mh > 3) {
    const mx = W / 2, base = sy - ph;
    _cx.fillStyle = '#9a8060'; _cx.strokeStyle = '#c0a880'; _cx.lineWidth = 1;
    _cx.beginPath();
    _cx.moveTo(mx - W * 0.18, base);
    _cx.lineTo(mx - W * 0.11, base - mh * 0.44);
    _cx.lineTo(mx - W * 0.06, base - mh * 0.27);
    _cx.lineTo(mx,             base - mh);
    _cx.lineTo(mx + W * 0.06,  base - mh * 0.32);
    _cx.lineTo(mx + W * 0.12,  base - mh * 0.51);
    _cx.lineTo(mx + W * 0.18,  base);
    _cx.closePath(); _cx.fill(); _cx.stroke();
    // Snow cap — corners placed exactly on the mountain slopes at 72% height
    // Left slope: (mx-0.06W, base-0.27mh)→(mx, base-mh), t=0.616 → x=mx-0.023W
    // Right slope: (mx, base-mh)→(mx+0.06W, base-0.32mh), t=0.412 → x=mx+0.025W
    _cx.fillStyle = 'rgba(255,255,255,0.82)';
    _cx.beginPath();
    _cx.moveTo(mx - W * 0.023, base - mh * 0.72);
    _cx.lineTo(mx,              base - mh);
    _cx.lineTo(mx + W * 0.025,  base - mh * 0.72);
    _cx.closePath(); _cx.fill();
  }

  // Labels fade in
  const la = Math.min(1, Math.max(0, (p - 0.25) * 3.5));
  _cx.globalAlpha = la;
  _label('Continental Crust', W * 0.18, sy - ph * 0.5);
  _label('Continental Crust', W * 0.82, sy - ph * 0.5);
  _label('Mantle', W / 2, H * 0.82);
  if (mh > H * 0.04) {
    const lblY = sy - ph - H * 0.09;
    _cx.save();
    _cx.strokeStyle = 'rgba(255,255,255,0.35)'; _cx.lineWidth = 1; _cx.setLineDash([3, 3]);
    _cx.beginPath(); _cx.moveTo(W - 14, lblY - 7); _cx.lineTo(W / 2 + 4, sy - ph - mh + 4); _cx.stroke();
    _cx.setLineDash([]); _cx.restore();
    _label('Mountains ▲', W - 10, lblY, 'right');
  }
  _cx.globalAlpha = 1;

  // Movement arrows while gap is still open
  if (gap > 6) {
    const ay = sy - ph * 0.5;
    _plateArrow(W / 2 - gap - 45, ay, +1);  // left plate →
    _plateArrow(W / 2 + gap + 45, ay, -1);  // right plate ←
  }
}

// ── Oceanic–Continental ───────────────────────────────────────
function _drawOC(W, H, p, sec) {
  const sy  = H * 0.48, cph = Math.min(H * 0.13, 32), oph = Math.min(H * 0.065, 16);
  const bx  = W * 0.38;
  const dv  = Math.min(p / 0.8, 1);
  // Tip slides along a FIXED angle from the bend point — no rotation
  const tpX = bx + dv * W * 0.30, tpY = sy + dv * H * 0.38;
  // Perpendicular offset for plate thickness (rotates with plate direction)
  const ang = Math.atan2(H * 0.38, W * 0.30);
  const px  = oph * Math.sin(ang), py = -oph * Math.cos(ang);

  _mantle(W, H, sy);

  // Uniform dark background across full width above the plates
  _cx.fillStyle = '#0d1b2a'; _cx.fillRect(0, 0, W, sy - oph);

  // Oceanic plate — flat section + subducting bend at fixed angle
  _cx.fillStyle = '#3a5570'; _cx.strokeStyle = '#2a4560'; _cx.lineWidth = 1;
  _cx.beginPath();
  _cx.moveTo(0, sy - oph);       _cx.lineTo(bx, sy - oph);
  _cx.lineTo(tpX + px, tpY + py); _cx.lineTo(tpX, tpY);
  _cx.lineTo(bx, sy);             _cx.lineTo(0, sy);
  _cx.closePath(); _cx.fill(); _cx.stroke();

  // Continental plate
  _cx.fillStyle = '#b8a070'; _cx.strokeStyle = '#8a7050';
  _cx.fillRect(bx + 6, sy - cph, W - bx - 6, cph);
  _cx.strokeRect(bx + 6, sy - cph, W - bx - 6, cph);
  _cx.fillStyle = '#3a7a3a'; _cx.fillRect(bx + 6, sy - cph - 3, W - bx - 6, 4);

  // Trench at subduction point
  const tx = bx + 4;
  _cx.fillStyle = '#0a1520';
  _cx.beginPath();
  _cx.moveTo(tx - 14, sy - oph); _cx.lineTo(tx, sy + H * 0.055); _cx.lineTo(tx + 10, sy - oph);
  _cx.closePath(); _cx.fill();

  // Volcano + rising magma dots (appear after p > 0.5)
  const va = Math.max(0, (p - 0.5) * 2);
  const la = Math.min(1, Math.max(0, (p - 0.15) * 3));
  if (va > 0) {
    const vx = W * 0.54, base = sy - cph, vh = H * 0.2 * va;
    _cx.globalAlpha = va;
    _cx.fillStyle = '#5a4030';
    _cx.beginPath(); _cx.moveTo(vx - W * 0.055, base); _cx.lineTo(vx, base - vh); _cx.lineTo(vx + W * 0.055, base); _cx.closePath(); _cx.fill();
    // Lava cap — corners on volcano slopes at 70% height
    // Left slope t=0.70 → x = vx - W*0.055*(1-0.70) = vx - W*0.0165
    // Right slope t=0.30 → x = vx + W*0.055*0.30 = vx + W*0.0165
    _cx.fillStyle = '#ff5010';
    _cx.beginPath(); _cx.moveTo(vx - W * 0.0165, base - vh * 0.70); _cx.lineTo(vx, base - vh); _cx.lineTo(vx + W * 0.0165, base - vh * 0.70); _cx.closePath(); _cx.fill();
    for (let i = 0; i < 4; i++) {
      const dt = ((sec * 0.45 + i * 0.25) % 1);
      const mdx = bx + (vx - bx) * (i + 0.5) / 4;
      const mdy = (sy + H * 0.1) - dt * H * 0.22;
      _cx.globalAlpha = va * (1 - dt) * 0.75;
      _cx.fillStyle = '#ff7030'; _cx.beginPath(); _cx.arc(mdx, mdy, 2.5, 0, Math.PI * 2); _cx.fill();
    }
    // Volcano label — side position with dashed leader line pointing to peak
    if (va > 0.3) {
      const lblY = sy - cph - H * 0.08;
      _cx.globalAlpha = Math.min(va, la);
      _cx.save();
      _cx.strokeStyle = 'rgba(255,255,255,0.35)'; _cx.lineWidth = 1; _cx.setLineDash([3, 3]);
      _cx.beginPath(); _cx.moveTo(W - 14, lblY - 7); _cx.lineTo(vx + 4, base - vh + 4); _cx.stroke();
      _cx.setLineDash([]); _cx.restore();
      _label('Volcano ▲', W - 10, lblY, 'right');
    }
    _cx.globalAlpha = 1;
  }

  // Diagonal subduction arrow — 40% along the diving slab, rotated to match its angle
  if (dv > 0.3) {
    _cx.save();
    _cx.translate(bx + (tpX - bx) * 0.40, sy + (tpY - sy) * 0.40);
    _cx.rotate(ang);
    _plateArrow(0, 0, +1);
    _cx.restore();
  }

  _cx.globalAlpha = la;
  _label('Oceanic Crust', W * 0.14, sy - oph * 0.55);
  _label('Continental Crust', W * 0.78, sy - cph * 0.5);
  _label('Mantle', W * 0.26, H * 0.82);
  _label('Trench ▼', tx, sy - oph - 14);
  _cx.globalAlpha = 1;
}

// ── Oceanic–Oceanic ───────────────────────────────────────────
function _drawOO(W, H, p, sec) {
  const sy  = H * 0.42, oph = Math.min(H * 0.065, 16);
  const bx  = W * 0.42;
  const dv  = Math.min(p / 0.8, 1);
  // Tip slides along a FIXED angle from the bend point — no rotation
  const tpX = bx + dv * W * 0.28, tpY = sy + dv * H * 0.35;
  // Perpendicular offset for plate thickness (rotates with plate direction)
  const ang = Math.atan2(H * 0.35, W * 0.28);
  const px  = oph * Math.sin(ang), py = -oph * Math.cos(ang);

  _mantle(W, H, sy);
  _cx.fillStyle = '#1a3a5c'; _cx.fillRect(0, 0, W, sy - oph);

  // Subducting (left) plate — fixed angle throughout animation
  _cx.fillStyle = '#3a5570'; _cx.strokeStyle = '#2a4560'; _cx.lineWidth = 1;
  _cx.beginPath();
  _cx.moveTo(0, sy - oph);       _cx.lineTo(bx, sy - oph);
  _cx.lineTo(tpX + px, tpY + py); _cx.lineTo(tpX, tpY);
  _cx.lineTo(bx, sy);             _cx.lineTo(0, sy);
  _cx.closePath(); _cx.fill(); _cx.stroke();

  // Overriding (right) plate
  _cx.fillStyle = '#2f4a62';
  _cx.fillRect(bx + 4, sy - oph, W - bx - 4, oph);
  _cx.strokeRect(bx + 4, sy - oph, W - bx - 4, oph);

  // Trench
  _cx.fillStyle = '#0a1520';
  _cx.beginPath();
  _cx.moveTo(bx - 12, sy - oph); _cx.lineTo(bx, sy + H * 0.065); _cx.lineTo(bx + 10, sy - oph);
  _cx.closePath(); _cx.fill();

  // Volcanic island arc (appears after p > 0.5)
  const ia = Math.max(0, (p - 0.5) * 2);
  if (ia > 0) {
    [0.56, 0.67, 0.78].forEach((fx, i) => {
      const ix = W * fx, base = sy - oph, ih = H * (0.08 + i * 0.025) * ia;
      _cx.globalAlpha = ia;
      _cx.fillStyle = '#3a7a3a';
      _cx.beginPath(); _cx.ellipse(ix, base, W * 0.037, H * 0.013, 0, Math.PI, 0); _cx.fill();
      _cx.fillStyle = '#5a4030';
      _cx.beginPath(); _cx.moveTo(ix - W * 0.026, base); _cx.lineTo(ix, base - ih); _cx.lineTo(ix + W * 0.026, base); _cx.closePath(); _cx.fill();
      _cx.fillStyle = '#ff5010';
      _cx.beginPath(); _cx.moveTo(ix - W * 0.01, base - ih + 3); _cx.lineTo(ix, base - ih - 7); _cx.lineTo(ix + W * 0.01, base - ih + 3); _cx.closePath(); _cx.fill();
    });
    for (let i = 0; i < 3; i++) {
      const dt = ((sec * 0.4 + i / 3) % 1);
      const mdx = bx + (W * 0.67 - bx) * (i + 0.5) / 3;
      const mdy = (sy + H * 0.09) - dt * H * 0.25;
      _cx.globalAlpha = ia * (1 - dt) * 0.7;
      _cx.fillStyle = '#ff7030'; _cx.beginPath(); _cx.arc(mdx, mdy, 2.5, 0, Math.PI * 2); _cx.fill();
    }
    _cx.globalAlpha = 1;
  }

  // Diagonal subduction arrow — 40% along the diving slab, rotated to match its angle
  if (dv > 0.3) {
    _cx.save();
    _cx.translate(bx + (tpX - bx) * 0.40, sy + (tpY - sy) * 0.40);
    _cx.rotate(ang);
    _plateArrow(0, 0, +1);
    _cx.restore();
  }

  const la = Math.min(1, Math.max(0, (p - 0.15) * 3));
  _cx.globalAlpha = la;
  _label('Oceanic Crust', W * 0.15, sy - oph * 0.55);
  _label('Oceanic Crust', W * 0.72, sy - oph * 0.55);
  _label('Mantle', W / 2, H * 0.82);
  _label('Trench ▼', bx, sy - oph - 14);
  if (ia > 0.3) {
    const lblY = sy - oph - H * 0.08;
    _cx.save();
    _cx.strokeStyle = 'rgba(255,255,255,0.35)'; _cx.lineWidth = 1; _cx.setLineDash([3, 3]);
    _cx.beginPath(); _cx.moveTo(W - 14, lblY - 7); _cx.lineTo(W * 0.78 - 4, sy - oph - H * 0.13 * ia + 4); _cx.stroke();
    _cx.setLineDash([]); _cx.restore();
    _label('Island Arc ▲', W - 10, lblY, 'right');
  }
  _cx.globalAlpha = 1;
}

// ── Oceanic Divergent (Mid-Ocean Ridge) ───────────────────────
function _drawMidOcean(W, H, p, sec) {
  const sy  = H * 0.52, oph = Math.min(H * 0.065, 16);
  const gap = p * W * 0.10;
  const mx  = W / 2;

  // Track active fill front for dots/label, and ridge growth
  let activeFillTop = -1, activeCoolT = 1;
  let ridgeT = 0, ridgePeak = 0, ridgeW = 0;

  _mantle(W, H, sy);
  // Ocean water fills everything above the seafloor
  _cx.fillStyle = '#1a3a5c'; _cx.fillRect(0, 0, W, sy - oph);

  // Oceanic plates (left and right of gap)
  _cx.fillStyle = '#3a5570'; _cx.strokeStyle = '#2a4560'; _cx.lineWidth = 1;
  _cx.fillRect(0, sy - oph, mx - gap, oph);
  _cx.strokeRect(0, sy - oph, mx - gap, oph);
  _cx.fillRect(mx + gap, sy - oph, mx - gap, oph);
  _cx.strokeRect(mx + gap, sy - oph, mx - gap, oph);

  if (gap > 1) {
    // ── One-shot crust-generation timeline ───────────────────────────────
    // Cycle 1: full gap fills orange, cools to oceanic crust blue-gray
    const C1_FS = 0.8, C1_FD = 1.5, C1_CD = 1.8;
    const C1_FE = C1_FS + C1_FD;   // 2.3 s
    const C1_CE = C1_FE + C1_CD;   // 4.1 s
    // Cycle 2: narrower center strip
    const C2_FS = C1_CE + 0.5, C2_FD = 0.8, C2_CD = 1.3;
    const C2_FE = C2_FS + C2_FD;   // 5.4 s
    const C2_CE = C2_FE + C2_CD;   // 6.7 s
    // Cycle 3: thinnest center strip
    const C3_FS = C2_CE + 0.4, C3_FD = 0.7, C3_CD = 1.0;
    const C3_FE = C3_FS + C3_FD;   // 7.8 s — animation complete at C3_FE + C3_CD = 8.8 s

    // Orange (#e07030 = 224,112,48) → oceanic crust blue-gray (#3a5570 = 58,85,112)
    function crustColor(t) {
      return `rgb(${Math.round(224*(1-t)+58*t)},${Math.round(112*(1-t)+85*t)},${Math.round(48*(1-t)+112*t)})`;
    }

    const sw2 = Math.max(4, gap * 0.28);
    const sw3 = Math.max(2, gap * 0.14);

    // Cycle 1 — full gap rectangle, rises from mantle floor to seafloor
    if (sec > C1_FS) {
      const fillT = Math.min(1, (sec - C1_FS) / C1_FD);
      const coolT = sec < C1_FE ? 0 : Math.min(1, (sec - C1_FE) / C1_CD);
      const fillH = fillT * oph;
      _cx.fillStyle = crustColor(coolT);
      _cx.fillRect(mx - gap, sy - fillH, gap * 2, fillH);
      if (coolT < 1) { activeFillTop = sy - fillH; activeCoolT = coolT; }
      ridgeT = coolT;  // ridge builds as first crust solidifies
    }

    // Cycle 2 — narrower center strip on top of cooled cycle 1
    if (sec > C2_FS) {
      const fillT = Math.min(1, (sec - C2_FS) / C2_FD);
      const coolT = sec < C2_FE ? 0 : Math.min(1, (sec - C2_FE) / C2_CD);
      const fillH = fillT * oph;
      _cx.fillStyle = crustColor(coolT);
      _cx.fillRect(mx - sw2, sy - fillH, sw2 * 2, fillH);
      if (coolT < 1) { activeFillTop = sy - fillH; activeCoolT = coolT; }
    }

    // Cycle 3 — thinnest center strip on top
    if (sec > C3_FS) {
      const fillT = Math.min(1, (sec - C3_FS) / C3_FD);
      const coolT = sec < C3_FE ? 0 : Math.min(1, (sec - C3_FE) / C3_CD);
      const fillH = fillT * oph;
      _cx.fillStyle = crustColor(coolT);
      _cx.fillRect(mx - sw3, sy - fillH, sw3 * 2, fillH);
      if (coolT < 1) { activeFillTop = sy - fillH; activeCoolT = coolT; }
    }

    // Ridge cap — gentle bell shape rising above the seafloor at the spreading center
    // Drawn after the fill rects so it sits on top of the new crust
    ridgePeak = Math.min(oph * 0.55, 9) * ridgeT;
    ridgeW    = Math.max(gap * 1.5, W * 0.08);
    if (ridgePeak > 0.5) {
      _cx.fillStyle = '#3a5570';
      _cx.beginPath();
      _cx.moveTo(mx - ridgeW, sy - oph);
      _cx.quadraticCurveTo(mx - ridgeW * 0.35, sy - oph - ridgePeak * 0.6, mx, sy - oph - ridgePeak);
      _cx.quadraticCurveTo(mx + ridgeW * 0.35, sy - oph - ridgePeak * 0.6, mx + ridgeW, sy - oph);
      _cx.closePath();
      _cx.fill();
    }

    // Rising magma dots — only within the gap (below seafloor sy-oph), not in ocean water
    if (activeFillTop >= 0 && activeCoolT < 0.8) {
      for (let i = 0; i < 3; i++) {
        const dt  = ((sec * 0.45 + i * 0.33) % 1);
        const mdy = sy - dt * (sy - activeFillTop - H * 0.01);
        if (mdy > activeFillTop && mdy < sy) {
          _cx.globalAlpha = (1 - dt) * 0.9 * (1 - activeCoolT);
          _cx.fillStyle = '#ffaa50';
          _cx.beginPath(); _cx.arc(mx + (i - 1) * W * 0.025, mdy, 2.5, 0, Math.PI * 2); _cx.fill();
        }
      }
      _cx.globalAlpha = 1;
    }
  }

  // Movement arrows while plates are spreading
  if (gap > 6) {
    const ay = sy - oph * 0.5;
    _plateArrow(mx - gap - 45, ay, -1);  // left plate ←
    _plateArrow(mx + gap + 45, ay, +1);  // right plate →
  }

  const la = Math.min(1, Math.max(0, (p - 0.2) * 3));
  _cx.globalAlpha = la;
  _label('Oceanic Crust', W * 0.14, sy - oph * 0.55);
  _label('Oceanic Crust', W * 0.82, sy - oph * 0.55);
  _label('Mantle', mx, H * 0.82);
  _label('Ocean Water', mx, H * 0.15);
  if (ridgeT > 0.3) {
    const lbl1Y = sy - oph - ridgePeak - H * 0.065;
    _cx.save();
    _cx.strokeStyle = 'rgba(255,255,255,0.35)'; _cx.lineWidth = 1; _cx.setLineDash([3, 3]);
    _cx.beginPath(); _cx.moveTo(W - 14, lbl1Y - 7); _cx.lineTo(mx + 4, sy - oph - ridgePeak + 4); _cx.stroke();
    _cx.setLineDash([]); _cx.restore();
    _label('Mid-Ocean Ridge ▲', W - 10, lbl1Y, 'right');
  }
  if (activeFillTop >= 0 && activeCoolT < 0.8) {
    const lbl2Y = sy - oph - H * 0.065 + 22;
    _cx.save();
    _cx.strokeStyle = 'rgba(255,255,255,0.35)'; _cx.lineWidth = 1; _cx.setLineDash([3, 3]);
    _cx.beginPath(); _cx.moveTo(10, lbl2Y - 7); _cx.lineTo(mx, activeFillTop + 8); _cx.stroke();
    _cx.setLineDash([]); _cx.restore();
    _label('Magma Rising', 12, lbl2Y, 'left');
  }
  _cx.globalAlpha = 1;
}

// ── Continental Divergent (Rift Valley) ───────────────────────
function _drawRift(W, H, p, sec) {
  const sy  = H * 0.54, cph = Math.min(H * 0.13, 32);
  const gap = p * W * 0.10;
  const mx  = W / 2;

  // Track the hottest active fill front for dots and the magma label
  let activeFillTop = -1, activeCoolT = 1;

  _mantle(W, H, sy);

  // Continental plates
  _cx.fillStyle = '#b8a070'; _cx.strokeStyle = '#8a7050'; _cx.lineWidth = 1;
  _cx.fillRect(0, sy - cph, mx - gap, cph);
  _cx.strokeRect(0, sy - cph, mx - gap, cph);
  _cx.fillRect(mx + gap, sy - cph, mx - gap, cph);
  _cx.strokeRect(mx + gap, sy - cph, mx - gap, cph);
  _cx.fillStyle = '#3a7a3a';
  _cx.fillRect(0, sy - cph - 3, mx - gap, 4);
  _cx.fillRect(mx + gap, sy - cph - 3, mx - gap, 4);

  if (gap > 1) {
    // ── One-shot crust-generation timeline (sec, not looping) ────────────
    // Cycle 1: full gap fills orange, cools to brown once
    const C1_FS = 0.8, C1_FD = 1.5, C1_CD = 1.8;
    const C1_FE = C1_FS + C1_FD;   // 2.3 s
    const C1_CE = C1_FE + C1_CD;   // 4.1 s
    // Cycle 2: narrower center strip (new crust intruding between old)
    const C2_FS = C1_CE + 0.5, C2_FD = 0.8, C2_CD = 1.3;
    const C2_FE = C2_FS + C2_FD;   // 5.4 s
    const C2_CE = C2_FE + C2_CD;   // 6.7 s
    // Cycle 3: thinnest center strip
    const C3_FS = C2_CE + 0.4, C3_FD = 0.7, C3_CD = 1.0;
    const C3_FE = C3_FS + C3_FD;   // 7.8 s
    const C3_CE = C3_FE + C3_CD;   // 8.8 s
    const SETTLE = C3_CE + 0.6;    // 9.4 s

    // Orange (#e07030) → brown (#5a3a20) by cooling fraction t
    function crustColor(t) {
      return `rgb(${Math.round(224*(1-t)+90*t)},${Math.round(112*(1-t)+58*t)},${Math.round(48*(1-t)+32*t)})`;
    }

    // Half-widths for sub-cycle strips (narrower each cycle)
    const sw2 = Math.max(4, gap * 0.28);
    const sw3 = Math.max(2, gap * 0.14);

    // Cycle 1 — full gap rectangle: rises from mantle floor to plate surface
    if (sec > C1_FS) {
      const fillT = Math.min(1, (sec - C1_FS) / C1_FD);
      const coolT = sec < C1_FE ? 0 : Math.min(1, (sec - C1_FE) / C1_CD);
      const fillH = fillT * cph;
      _cx.fillStyle = crustColor(coolT);
      _cx.fillRect(mx - gap, sy - fillH, gap * 2, fillH);
      if (coolT < 1) { activeFillTop = sy - fillH; activeCoolT = coolT; }
    }

    // Cycle 2 — narrower center strip drawn on top of cooled cycle 1
    if (sec > C2_FS) {
      const fillT = Math.min(1, (sec - C2_FS) / C2_FD);
      const coolT = sec < C2_FE ? 0 : Math.min(1, (sec - C2_FE) / C2_CD);
      const fillH = fillT * cph;
      _cx.fillStyle = crustColor(coolT);
      _cx.fillRect(mx - sw2, sy - fillH, sw2 * 2, fillH);
      if (coolT < 1) { activeFillTop = sy - fillH; activeCoolT = coolT; }
    }

    // Cycle 3 — thinnest center strip drawn on top of cooled cycle 2
    if (sec > C3_FS) {
      const fillT = Math.min(1, (sec - C3_FS) / C3_FD);
      const coolT = sec < C3_FE ? 0 : Math.min(1, (sec - C3_FE) / C3_CD);
      const fillH = fillT * cph;
      _cx.fillStyle = crustColor(coolT);
      _cx.fillRect(mx - sw3, sy - fillH, sw3 * 2, fillH);
      if (coolT < 1) { activeFillTop = sy - fillH; activeCoolT = coolT; }
    }

    // Rising magma dots during active fill phases only
    if (activeFillTop >= 0 && activeCoolT < 0.8) {
      for (let i = 0; i < 3; i++) {
        const dt  = ((sec * 0.45 + i * 0.33) % 1);
        const mdy = sy - dt * (sy - activeFillTop - H * 0.01);
        if (mdy > activeFillTop) {
          _cx.globalAlpha = (1 - dt) * 0.9 * (1 - activeCoolT);
          _cx.fillStyle = '#ffaa50';
          _cx.beginPath(); _cx.arc(mx + (i - 1) * W * 0.025, mdy, 2.5, 0, Math.PI * 2); _cx.fill();
        }
      }
      _cx.globalAlpha = 1;
    }

    // Lake — shallow blue puddle at gap surface, appears once settled
    if (sec > SETTLE) {
      _cx.globalAlpha = Math.min(1, (sec - SETTLE) / 1.0);
      _cx.fillStyle = '#1a4a7a';
      _cx.fillRect(mx - gap * 0.22, sy - cph, gap * 0.44, H * 0.018);
      _cx.globalAlpha = 1;
    }
  }

  // Movement arrows while plates are separating
  if (gap > 6) {
    const ay = sy - cph * 0.5;
    _plateArrow(mx - gap - 45, ay, -1);  // left plate ←
    _plateArrow(mx + gap + 45, ay, +1);  // right plate →
  }

  const la = Math.min(1, Math.max(0, (p - 0.2) * 3));
  _cx.globalAlpha = la;
  _label('Continental Crust', W * 0.16, sy - cph * 0.5);
  _label('Continental Crust', W * 0.84, sy - cph * 0.5);
  _label('Mantle', mx, H * 0.82);
  if (gap > W * 0.018) {
    const lbl1Y = sy - cph - H * 0.065;
    _cx.save();
    _cx.strokeStyle = 'rgba(255,255,255,0.35)'; _cx.lineWidth = 1; _cx.setLineDash([3, 3]);
    _cx.beginPath(); _cx.moveTo(W - 14, lbl1Y - 7); _cx.lineTo(mx + 4, sy - cph + 4); _cx.stroke();
    _cx.setLineDash([]); _cx.restore();
    _label('Rift Valley ▼', W - 10, lbl1Y, 'right');

    if (activeFillTop >= 0 && activeCoolT < 0.8) {
      const lbl2Y = lbl1Y + 22;
      _cx.save();
      _cx.strokeStyle = 'rgba(255,255,255,0.35)'; _cx.lineWidth = 1; _cx.setLineDash([3, 3]);
      _cx.beginPath(); _cx.moveTo(10, lbl2Y - 7); _cx.lineTo(mx, activeFillTop + 8); _cx.stroke();
      _cx.setLineDash([]); _cx.restore();
      _label('Magma', 12, lbl2Y, 'left');
    }
  }
  _cx.globalAlpha = 1;
}

// ── Transform (San Andreas) — top-down view ───────────────────
function _drawTransform(W, H, _prog, sec) {
  const mx = W / 2;

  // ── Cycle state machine ──────────────────────────────────────
  // 12-second loop: calm → quake (0.6 s) → observe → reset → calm
  const PERIOD  = 12.0, t = sec % PERIOD;
  const QUAKE_S = 2.0,  QUAKE_E = 2.6;   // earthquake window
  const OBS_E   = 8.0,  RESET_E = 9.2;   // observe then fade-reset

  // Bell envelope during quake (0→1→0)
  const quakeT = (t >= QUAKE_S && t < QUAKE_E)
    ? Math.sin((t - QUAKE_S) / (QUAKE_E - QUAKE_S) * Math.PI) : 0;

  // Stream offset and fault visibility — both driven by the same phase
  const MAX_OFF = H * 0.11;
  let streamOff, faultVis;
  if (t < QUAKE_S) {
    streamOff = 0;                              faultVis = 0;
  } else if (t < QUAKE_E) {
    const f = (t - QUAKE_S) / (QUAKE_E - QUAKE_S);
    streamOff = MAX_OFF * f;                    faultVis = f;
  } else if (t < OBS_E) {
    streamOff = MAX_OFF;                        faultVis = 1;
  } else if (t < RESET_E) {
    const f = (t - OBS_E) / (RESET_E - OBS_E);
    streamOff = MAX_OFF * (1 - f);              faultVis = 1 - f;
  } else {
    streamOff = 0;                              faultVis = 0;
  }

  // Jagged fault profile: x-offsets (px) and y-positions (fraction of H)
  const JY = [0, 0.11, 0.23, 0.35, 0.47, 0.58, 0.70, 0.82, 0.92, 1];
  const JX = [0,    8,   -6,   10,   -9,    6,   -7,   11,   -8,  0];

  // Shake affects plates + stream + fault but NOT arrows or labels
  _cx.save();
  _cx.translate(Math.sin(sec * 180) * 5 * quakeT, Math.cos(sec * 220) * 3 * quakeT);

  // Plates (still — no scrolling)
  _cx.fillStyle = '#b8a070'; _cx.fillRect(0, 0, mx, H);   // Pacific
  _cx.fillStyle = '#c2a47a'; _cx.fillRect(mx, 0, mx, H);  // North American

  // Stream — two halves with round caps; gap is ~0.5 px when streamOff=0 so it reads as one line
  const SY = H * 0.43;
  _cx.strokeStyle = '#4a88cc'; _cx.lineWidth = 3.5; _cx.lineCap = 'round';
  _cx.beginPath(); _cx.moveTo(W * 0.06, SY - streamOff); _cx.lineTo(mx - 2, SY - streamOff); _cx.stroke();
  _cx.beginPath(); _cx.moveTo(mx + 2,   SY);             _cx.lineTo(W * 0.94, SY);            _cx.stroke();

  // Fault line — invisible before quake, appears during/after, fades on reset
  if (faultVis > 0.01) {
    _cx.globalAlpha = faultVis;
    _cx.strokeStyle = quakeT > 0 ? '#c85010' : '#2a1808';
    _cx.lineWidth = 3; _cx.lineJoin = 'round'; _cx.lineCap = 'round';
    _cx.beginPath(); _cx.moveTo(mx + JX[0], H * JY[0]);
    for (let i = 1; i < JY.length; i++) _cx.lineTo(mx + JX[i], H * JY[i]);
    _cx.stroke();
    _cx.globalAlpha = 1;
  }

  // Earthquake: red flash + lightning cracks along fault
  if (quakeT > 0) {
    _cx.globalAlpha = quakeT * 0.35;
    _cx.fillStyle = '#ff1010'; _cx.fillRect(mx - 14, 0, 28, H);
    _cx.globalAlpha = quakeT * 0.85; _cx.strokeStyle = '#ff5500'; _cx.lineWidth = 1.5;
    [[0.18, -9, 0.25, 13], [0.41, 11, 0.49, -8], [0.63, -12, 0.70, 10], [0.81, 8, 0.88, -11]]
      .forEach(([y1, x1, y2, x2]) => {
        _cx.beginPath(); _cx.moveTo(mx + x1, H * y1); _cx.lineTo(mx + x2, H * y2); _cx.stroke();
      });
    _cx.globalAlpha = 1;
  }
  _cx.restore();

  // Vertical plate movement arrows (outside shake so they stay anchored)
  function _vArrow(cx, cy, dir) {  // dir: +1 = up (↑), -1 = down (↓)
    _cx.save(); _cx.translate(cx, cy); _cx.rotate(-dir * Math.PI / 2); _plateArrow(0, 0, +1); _cx.restore();
  }
  _vArrow(W * 0.23, H * 0.52, +1);  // Pacific Plate — northward
  _vArrow(W * 0.77, H * 0.52, -1);  // North American Plate — southward

  // Labels
  const la = Math.min(1, sec / 1.2);
  _cx.globalAlpha = la;
  _label('Pacific Plate',        W * 0.22, H * 0.16);
  _label('North American Plate', W * 0.78, H * 0.16);
  if (streamOff > H * 0.02) _label('Offset stream', W * 0.06, SY - streamOff - 13, 'left');
  _cx.save(); _cx.strokeStyle = 'rgba(255,255,255,0.35)'; _cx.lineWidth = 1; _cx.setLineDash([3, 3]);
  _cx.beginPath(); _cx.moveTo(W - 14, H * 0.12 - 7); _cx.lineTo(mx + JX[2] + 4, H * JY[2]); _cx.stroke();
  _cx.setLineDash([]); _cx.restore();
  _label('Transform Fault', W - 10, H * 0.13, 'right');
  _cx.save(); _cx.strokeStyle = 'rgba(255,255,255,0.35)'; _cx.lineWidth = 1; _cx.setLineDash([3, 3]);
  _cx.beginPath(); _cx.moveTo(12, H * 0.66 - 7); _cx.lineTo(mx + JX[5] - 4, H * JY[5]); _cx.stroke();
  _cx.setLineDash([]); _cx.restore();
  _label('Earthquakes occur here', 14, H * 0.67, 'left');
  _cx.globalAlpha = 1;

  // Perspective badge — dark rounded pill, top-right corner
  _cx.font = 'bold 16px "Segoe UI",sans-serif';
  const _bTxt = 'View: Looking Down';
  const _bW   = _cx.measureText(_bTxt).width;
  const _bPad = 10, _bH = 30, _bR = 7;
  const _bX   = W - _bW - _bPad * 2 - 10, _bY = 10;
  _cx.fillStyle = 'rgba(0,0,0,0.62)';
  _cx.beginPath();
  _cx.roundRect(_bX, _bY, _bW + _bPad * 2, _bH, _bR);
  _cx.fill();
  _cx.fillStyle = '#ffffff';
  _cx.textAlign = 'left';
  _cx.fillText(_bTxt, _bX + _bPad, _bY + 20);
}
