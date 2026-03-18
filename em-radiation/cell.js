// cell.js — Animated cell visualization for EM Radiation simulation
// Reads sliderPos from app.js (loaded first in same page scope)

(function () {
  const canvas = document.getElementById('cellCanvas');
  const ctx    = canvas.getContext('2d');
  const W = canvas.width, H = canvas.height;

  // Cell geometry constants
  const CX = W * 0.61, CY = H * 0.49, CR = 87;   // cell center + radius
  const NX = CX + 2,   NY = CY - 5,   NR = 29;   // nucleus center + radius

  const BOUNDARIES  = [0, 0.13, 0.22, 0.37, 0.45, 0.60, 0.80, 1.0];
  const WAVE_COLORS = ['#8b2020','#d35400','#e8820a','#27ae60','#6c3483','#1a237e','#1a1a2e'];
  // Captions are read from T[lang].cellCaptions (defined in app.js) for bilingual support

  function regionIdx(pos) {
    for (let i = BOUNDARIES.length - 2; i >= 0; i--)
      if (pos >= BOUNDARIES[i]) return i;
    return 0;
  }

  // Smooth 0→1 damage level starting at UV boundary
  function dmgLevel(pos) { return Math.max(0, Math.min(1, (pos - 0.43) / 0.57)); }

  let t = 0; // animation clock

  // ── INCOMING WAVES ──────────────────────────────────────────────────────────
  function drawWaves(pos) {
    const idx  = regionIdx(pos);
    const wlPx = 10 + (1 - pos) * 68;           // long for radio, short for gamma
    const amp  = wlPx * 0.2;
    const spd  = 2.0;               // all EM waves travel at the same speed (c)
    const zone = W * 0.37;

    ctx.save();
    ctx.strokeStyle = WAVE_COLORS[idx];
    ctx.lineWidth = 1.6;
    ctx.globalAlpha = 0.65;
    for (let x0 = -wlPx * 2 + (t * spd % wlPx); x0 < zone; x0 += wlPx) {
      ctx.beginPath();
      for (let y = 0; y <= H; y += 2) {
        const xw = x0 + Math.sin(y * Math.PI * 2 / (wlPx * 1.15)) * amp;
        y === 0 ? ctx.moveTo(xw, y) : ctx.lineTo(xw, y);
      }
      ctx.stroke();
    }
    ctx.restore();
  }

  // ── CELL BODY ───────────────────────────────────────────────────────────────
  function drawCell(dmg, pos) {
    const idx = regionIdx(pos);
    // Molecular vibration for microwave / infrared
    const vibAmt = idx === 1 ? 1.6 : idx === 2 ? 0.9 : 0;
    const vx = vibAmt * Math.sin(t * 4.2);
    const vy = vibAmt * Math.cos(t * 3.8) * 0.6;

    // — Thermal glow (microwave / infrared) —
    if (idx === 1 || idx === 2) {
      const pulse = 0.5 + 0.5 * Math.sin(t * 2.5);
      const g = ctx.createRadialGradient(CX, CY, CR * 0.3, CX, CY, CR * 1.5);
      g.addColorStop(0, 'transparent');
      g.addColorStop(0.55, idx === 1 ? 'rgba(230,126,34,0.18)' : 'rgba(232,160,32,0.22)');
      g.addColorStop(1, 'transparent');
      ctx.save(); ctx.globalAlpha = 0.5 + pulse * 0.5;
      ctx.fillStyle = g; ctx.beginPath(); ctx.arc(CX, CY, CR * 1.5, 0, Math.PI * 2); ctx.fill(); ctx.restore();
    }

    // — Visible light brightening —
    if (idx === 3) {
      const g = ctx.createRadialGradient(CX - 25, CY - 20, 0, CX, CY, CR * 1.3);
      g.addColorStop(0, 'rgba(255,255,190,0.38)'); g.addColorStop(1, 'transparent');
      ctx.save(); ctx.fillStyle = g; ctx.beginPath(); ctx.arc(CX, CY, CR * 1.3, 0, Math.PI * 2); ctx.fill(); ctx.restore();
    }

    // — Ionizing warning pulse (UV → Gamma) —
    if (dmg > 0) {
      const pulse = 0.5 + 0.5 * Math.sin(t * (2.5 + dmg * 4));
      const g = ctx.createRadialGradient(NX, NY, NR * 0.3, CX, CY, CR * 1.25);
      g.addColorStop(0, `rgba(231,76,60,${dmg * 0.55})`); g.addColorStop(1, 'transparent');
      ctx.save(); ctx.globalAlpha = pulse;
      ctx.fillStyle = g; ctx.beginPath(); ctx.arc(CX, CY, CR * 1.25, 0, Math.PI * 2); ctx.fill(); ctx.restore();
    }

    // — Cell membrane —
    const mVibX = vx * 1.2 + dmg * Math.sin(t * 7)   * 2.5;
    const mVibY = vy * 1.2 + dmg * Math.cos(t * 6.2) * 2.0;
    const memFill   = dmg > 0.35
      ? `rgba(${200 + Math.round(dmg * 55)},${Math.round(225 - dmg * 135)},${Math.round(245 - dmg * 185)},0.92)`
      : '#ddeef8';
    const memStroke = dmg > 0.25
      ? `rgb(${Math.round(133 + dmg * 122)},${Math.round(193 - dmg * 160)},${Math.round(233 - dmg * 210)})` : '#85c1e9';

    ctx.save();
    ctx.shadowColor = 'rgba(41,128,185,0.18)'; ctx.shadowBlur = 10;
    if (dmg > 0.5) {
      // Wobbly membrane for X-ray / gamma
      ctx.beginPath();
      for (let a = 0; a <= Math.PI * 2 + 0.05; a += 0.04) {
        const w  = 1 + dmg * 0.07 * Math.sin(a * 7 + t * 2.5);
        const mx = CX + mVibX + Math.cos(a) * CR * w;
        const my = CY + mVibY + Math.sin(a) * CR * w;
        a < 0.04 ? ctx.moveTo(mx, my) : ctx.lineTo(mx, my);
      }
    } else {
      ctx.beginPath(); ctx.arc(CX + mVibX, CY + mVibY, CR, 0, Math.PI * 2);
    }
    ctx.fillStyle = memFill; ctx.fill();
    ctx.strokeStyle = memStroke; ctx.lineWidth = 2.5 + dmg; ctx.stroke();
    ctx.restore();

    // — Endoplasmic reticulum —
    ctx.save(); ctx.strokeStyle = dmg > 0.6 ? 'rgba(130,224,170,0.35)' : '#82e0aa';
    ctx.lineWidth = 1.5; ctx.globalAlpha = 0.85;
    ctx.beginPath();
    ctx.moveTo(CX - 44 + vx, CY + 20 + vy);
    ctx.bezierCurveTo(CX - 28 + vx, CY + 8  + vy, CX - 12 + vx, CY + 28 + vy, CX +  4 + vx, CY + 18 + vy);
    ctx.bezierCurveTo(CX + 18 + vx, CY + 8  + vy, CX + 30 + vx, CY + 26 + vy, CX + 44 + vx, CY + 16 + vy);
    ctx.stroke(); ctx.restore();

    // — Mitochondria (3) —
    [[CX - 50, CY + 30, 0.45], [CX + 52, CY + 36, -0.35], [CX - 54, CY - 40, 0.2]].forEach(([mx, my, rot], i) => {
      ctx.save();
      ctx.translate(mx + vx + dmg * Math.sin(t * 2.5 + i) * 3, my + vy + dmg * Math.cos(t * 2 + i) * 2);
      ctx.rotate(rot + dmg * Math.sin(t * 1.5 + i) * 0.15);
      ctx.beginPath(); ctx.ellipse(0, 0, 17, 8, 0, 0, Math.PI * 2);
      ctx.fillStyle = dmg > 0.6 ? `rgba(231,76,60,${0.35 + dmg * 0.45})` : '#f1948a';
      ctx.fill(); ctx.strokeStyle = '#e74c3c'; ctx.lineWidth = 1.5; ctx.stroke();
      ctx.beginPath(); ctx.moveTo(-12, 0); ctx.bezierCurveTo(-5, -5, 5, -5, 12, 0); ctx.stroke();
      ctx.restore();
    });

    // — Ribosomes (tiny dots) —
    [[CX-32,CY-58],[CX+42,CY-52],[CX+70,CY-9],[CX+71,CY+22],[CX-21,CY+70],[CX+22,CY+72],[CX-62,CY+12],[CX-65,CY-12]].forEach(([rx,ry]) => {
      ctx.beginPath(); ctx.arc(rx + vx * 0.4, ry + vy * 0.4, 3, 0, Math.PI * 2);
      ctx.fillStyle = dmg > 0.5 ? 'rgba(149,117,205,0.45)' : '#9575cd'; ctx.fill();
    });

    // — Nucleus —
    const nVibX = vx * 0.6 + dmg * Math.sin(t * 5)   * 1.8;
    const nVibY = vy * 0.6 + dmg * Math.cos(t * 4.5) * 1.3;
    const nx = NX + nVibX, ny = NY + nVibY;

    if (dmg > 0) {
      const np = 0.35 + 0.35 * Math.sin(t * (3 + dmg * 5));
      const ng = ctx.createRadialGradient(nx, ny, NR * 0.5, nx, ny, NR * 1.65);
      ng.addColorStop(0, `rgba(231,76,60,${dmg * 0.9})`); ng.addColorStop(1, 'transparent');
      ctx.save(); ctx.globalAlpha = np;
      ctx.fillStyle = ng; ctx.beginPath(); ctx.arc(nx, ny, NR * 1.65, 0, Math.PI * 2); ctx.fill(); ctx.restore();
    }

    ctx.beginPath(); ctx.arc(nx, ny, NR, 0, Math.PI * 2);
    ctx.fillStyle = '#b3d4e8'; ctx.fill(); ctx.strokeStyle = '#1a5276'; ctx.lineWidth = 2; ctx.stroke();
    ctx.beginPath(); ctx.arc(nx + 6, ny + 3, 9, 0, Math.PI * 2);
    ctx.fillStyle = '#5a9ab8'; ctx.fill();

    // DNA squiggles + damage marks, clipped to nucleus
    ctx.save();
    ctx.beginPath(); ctx.arc(nx, ny, NR - 2, 0, Math.PI * 2); ctx.clip();

    ctx.strokeStyle = '#1a5276'; ctx.lineWidth = 1.2;
    [[nx - 8, ny - 14, 0], [nx + 3, ny - 4, Math.PI]].forEach(([sx, sy, phase]) => {
      ctx.beginPath();
      for (let i = 0; i <= 22; i++) {
        const px = sx + Math.sin(i * 0.65 + phase) * 7, py = sy + i - 11;
        i === 0 ? ctx.moveTo(px, py) : ctx.lineTo(px, py);
      }
      ctx.stroke();
    });

    if (dmg > 0) {
      const marks = [[nx-8,ny-13],[nx+7,ny-5],[nx-4,ny+9],[nx+11,ny+4],[nx-11,ny+3],[nx+3,ny-18],[nx+14,ny-8],[nx-13,ny+12]];
      const count = Math.round(dmg * marks.length);
      ctx.strokeStyle = '#e74c3c'; ctx.lineWidth = 2; ctx.globalAlpha = Math.min(1, dmg * 1.5 + 0.15);
      for (let i = 0; i < count; i++) {
        const [mx, my] = marks[i], s = 4;
        ctx.beginPath(); ctx.moveTo(mx-s,my-s); ctx.lineTo(mx+s,my+s);
        ctx.moveTo(mx+s,my-s); ctx.lineTo(mx-s,my+s); ctx.stroke();
      }
    }
    ctx.restore();

    // DNA break lines visible outside nucleus (X-ray / gamma)
    if (dmg > 0.45) {
      ctx.save(); ctx.strokeStyle = '#e74c3c'; ctx.lineWidth = 2.5;
      ctx.globalAlpha = Math.min(0.9, (dmg - 0.45) * 1.8);
      [[nx - 4, ny - 23, nx + 10, ny - 7], [nx - 12, ny + 7, nx + 3, ny + 23]].forEach(([x1,y1,x2,y2]) => {
        ctx.beginPath(); ctx.moveTo(x1,y1); ctx.lineTo(x2,y2); ctx.stroke();
      });
      ctx.restore();
    }

    // Cell fragments scattered outward (gamma)
    if (dmg > 0.65) {
      const fa = (dmg - 0.65) / 0.35;
      [[CX+88,CY-55],[CX+92,CY+28],[CX-78,CY+68],[CX+64,CY+84]].forEach(([fx,fy],i) => {
        ctx.save(); ctx.globalAlpha = fa * 0.8;
        ctx.translate(fx + Math.sin(t * 1.5 + i) * 4 * dmg, fy + Math.cos(t * 1.3 + i) * 3 * dmg);
        ctx.beginPath(); ctx.arc(0, 0, 5 + fa * 5, 0, Math.PI * 2);
        ctx.fillStyle = '#f1948a'; ctx.fill(); ctx.strokeStyle = '#e74c3c'; ctx.lineWidth = 1; ctx.stroke();
        ctx.restore();
      });
    }
  }

  // ── CAPTION ─────────────────────────────────────────────────────────────────
  function drawCaption(pos) {
    const idx  = regionIdx(pos);
    const captions = (typeof T !== 'undefined' && T[lang] && T[lang].cellCaptions) ? T[lang].cellCaptions : [];
    const text = captions[idx] || '';
    ctx.save();
    ctx.font = 'bold 10.5px Segoe UI, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillStyle = idx >= 4 ? 'rgba(192,57,43,0.9)' : 'rgba(44,62,80,0.72)';
    // Simple two-pass word-wrap
    const words = text.split(' '), maxW = W - 28;
    let line = '', lines = [];
    words.forEach(w => {
      const test = line ? line + ' ' + w : w;
      if (ctx.measureText(test).width > maxW && line) { lines.push(line); line = w; }
      else line = test;
    });
    if (line) lines.push(line);
    const baseY = H - (lines.length > 1 ? 20 : 11);
    lines.forEach((l, i) => ctx.fillText(l, W / 2, baseY + i * 13));
    ctx.restore();
  }

  // ── ANIMATION LOOP ───────────────────────────────────────────────────────────
  function frame() {
    t += 0.045;
    const pos = typeof sliderPos !== 'undefined' ? sliderPos : 0.05;
    const dmg = dmgLevel(pos);
    ctx.clearRect(0, 0, W, H);
    drawWaves(pos);
    drawCell(dmg, pos);
    drawCaption(pos);
    requestAnimationFrame(frame);
  }

  requestAnimationFrame(frame);
})();
