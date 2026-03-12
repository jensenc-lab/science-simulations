'use strict';

const canvas = document.getElementById('mapCanvas');
const ctx    = canvas.getContext('2d');
const TC     = { convergent: '#e74c3c', divergent: '#3498db', transform: '#f1c40f' };

// ── Map image ─────────────────────────────────────────────────
const IMG = new Image();
IMG.crossOrigin = 'anonymous';
IMG.src = 'map-bg.png';
// Fallback to Wikimedia CDN if local file is unavailable
IMG.onerror = () => {
  if (!IMG.src.includes('wikimedia')) {
    IMG.src = 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/bf/Tectonic_plates_boundaries_detailed-en.svg/1280px-Tectonic_plates_boundaries_detailed-en.svg.png';
  }
};

// ── State ─────────────────────────────────────────────────────
let pulse   = 0;
let hovered = null;
// Tracks where the image is drawn so hotspot px() and hitTest() stay in sync
let imgRect = { dx: 0, dy: 0, dw: 1, dh: 1 };

// ── Helpers ───────────────────────────────────────────────────
const af  = ()  => window.tectonics?.activeFilter() ?? 'all';
// Convert boundary's mapX/mapY percentages to canvas pixels
const hpx = (b) => [
  imgRect.dx + b.mapX / 100 * imgRect.dw,
  imgRect.dy + b.mapY / 100 * imgRect.dh,
];

// ── Draw: image background + dark overlay ────────────────────
function drawMap() {
  const W = canvas.width, H = canvas.height;

  // Base fill (visible as letterbox bars if image aspect differs)
  ctx.fillStyle = '#0d1b2a';
  ctx.fillRect(0, 0, W, H);

  if (!IMG.complete || !IMG.naturalWidth) {
    ctx.fillStyle = '#7f8ea3';
    ctx.font = '14px "Segoe UI",system-ui,sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('Loading map…', W / 2, H / 2);
    ctx.textAlign = 'left';
    return false;
  }

  // Contain: scale image to fit canvas while preserving aspect ratio
  const iw = IMG.naturalWidth, ih = IMG.naturalHeight;
  const scale = Math.min(W / iw, H / ih);
  const dw = iw * scale, dh = ih * scale;
  const dx = (W - dw) / 2, dy = (H - dh) / 2;
  imgRect = { dx, dy, dw, dh };

  ctx.drawImage(IMG, dx, dy, dw, dh);

  // Slight dark overlay to match the deep-navy theme
  ctx.fillStyle = 'rgba(13,27,42,0.32)';
  ctx.fillRect(dx, dy, dw, dh);

  return true;
}

// ── Draw: hotspot markers ─────────────────────────────────────
function drawHotspots(t) {
  const filter = af();
  (window.tectonics?.boundaries ?? []).forEach(b => {
    const [cx, cy] = hpx(b);
    const color    = TC[b.type];
    const dim      = filter !== 'all' && filter !== b.type;

    // Pulsing ring (skipped when dimmed)
    if (!dim) {
      const ph = t % 1;
      ctx.globalAlpha = (1 - ph) * 0.5;
      ctx.beginPath();
      ctx.arc(cx, cy, 8 + ph * 16, 0, Math.PI * 2);
      ctx.strokeStyle = color;
      ctx.lineWidth   = 1.5;
      ctx.stroke();
    }

    // Solid dot
    ctx.globalAlpha = dim ? 0.18 : 1;
    ctx.beginPath();
    ctx.arc(cx, cy, 6, 0, Math.PI * 2);
    ctx.fillStyle   = color;
    ctx.fill();
    ctx.strokeStyle = '#fff';
    ctx.lineWidth   = 1.5;
    ctx.stroke();

    // Label
    ctx.font        = 'bold 9px "Segoe UI",system-ui,sans-serif';
    ctx.fillStyle   = '#fff';
    ctx.shadowColor = 'rgba(0,0,0,0.9)';
    ctx.shadowBlur  = 3;
    ctx.fillText(b.name, cx + 9, cy + 4);
    ctx.shadowBlur  = 0;
    ctx.globalAlpha = 1;
  });
}

// ── Draw: legend (bottom-left of image area) ──────────────────
function drawLegend() {
  const lx = imgRect.dx + 10, ly = imgRect.dy + imgRect.dh - 64;
  ctx.fillStyle = 'rgba(0,12,26,0.80)';
  ctx.beginPath();
  ctx.roundRect(lx, ly, 132, 56, 6);
  ctx.fill();

  [['convergent', 'Convergent'], ['divergent', 'Divergent'], ['transform', 'Transform']]
    .forEach(([type, label], i) => {
      const iy = ly + 14 + i * 16;
      ctx.globalAlpha = 0.9;
      ctx.setLineDash([5, 3]);
      ctx.strokeStyle = TC[type];
      ctx.lineWidth   = 2;
      ctx.beginPath();
      ctx.moveTo(lx + 8, iy);
      ctx.lineTo(lx + 26, iy);
      ctx.stroke();
      ctx.setLineDash([]);
      ctx.globalAlpha = 1;
      ctx.fillStyle   = '#cdd6f4';
      ctx.font        = '9px "Segoe UI",system-ui,sans-serif';
      ctx.fillText(label, lx + 32, iy + 4);
    });
}

// ── Draw: hover tooltip ───────────────────────────────────────
function drawTooltip() {
  if (!hovered) return;
  const [cx, cy] = hpx(hovered);
  const text = `${hovered.name}  ·  ${hovered.type}`;
  ctx.font = '10px "Segoe UI",system-ui,sans-serif';
  const tw = ctx.measureText(text).width;
  let tx = cx + 14, ty = cy - 16;
  if (tx + tw + 14 > canvas.width) tx = cx - tw - 18;
  if (ty < 10)                      ty = cy + 22;
  ctx.fillStyle = 'rgba(0,12,26,0.92)';
  ctx.beginPath();
  ctx.roundRect(tx - 6, ty - 14, tw + 14, 22, 4);
  ctx.fill();
  ctx.fillStyle = '#fff';
  ctx.fillText(text, tx, ty);
}

// ── Draw: attribution ─────────────────────────────────────────
function drawAttrib() {
  ctx.font      = '8px "Segoe UI",system-ui,sans-serif';
  ctx.fillStyle = 'rgba(255,255,255,0.38)';
  ctx.fillText(
    'Map: Wikimedia Commons, CC BY-SA 2.5',
    imgRect.dx + 8,
    imgRect.dy + imgRect.dh - 5,
  );
}

// ── Animation loop ────────────────────────────────────────────
function loop(time) {
  if (canvas.clientWidth > 0 &&
      (canvas.width !== canvas.clientWidth || canvas.height !== canvas.clientHeight)) {
    canvas.width  = canvas.clientWidth;
    canvas.height = canvas.clientHeight;
  }

  pulse = time / 1600;
  const ready = drawMap();

  if (ready) {
    drawHotspots(pulse);
    drawLegend();
    drawAttrib();
    drawTooltip();
  }

  requestAnimationFrame(loop);
}

// ── Mouse interaction ─────────────────────────────────────────
function hitTest(e) {
  const r  = canvas.getBoundingClientRect();
  const mx = e.clientX - r.left, my = e.clientY - r.top;
  return (window.tectonics?.boundaries ?? []).find(b => {
    const [bx, by] = hpx(b);
    return Math.hypot(mx - bx, my - by) < 14;
  }) ?? null;
}

canvas.addEventListener('mousemove',  e => { hovered = hitTest(e); canvas.style.cursor = hovered ? 'pointer' : 'default'; });
canvas.addEventListener('mouseleave', () => { hovered = null; });
canvas.addEventListener('click',      e => { const b = hitTest(e); if (b) window.tectonics?.selectBoundary(b); });

requestAnimationFrame(loop);
