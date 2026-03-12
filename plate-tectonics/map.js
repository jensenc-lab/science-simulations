'use strict';

const canvas = document.getElementById('mapCanvas');
const ctx    = canvas.getContext('2d');

// ── Continent polygons: [x%, y%] of canvas ───────────────────
const CONTINENTS = [
  // North America  (green)
  { color: '#3a7a4a', pts: [[5,18],[18,10],[30,11],[36,20],[33,26],[28,33],[23,40],[18,36],[13,28],[9,22]] },
  // Greenland      (green)
  { color: '#3a7a4a', pts: [[32,7],[40,5],[44,10],[42,18],[36,19],[30,14]] },
  // South America  (olive)
  { color: '#6a8a3a', pts: [[24,40],[32,36],[37,47],[33,56],[28,65],[22,68],[18,62],[20,52],[22,42]] },
  // Africa         (orange)
  { color: '#c0753a', pts: [[44,30],[52,27],[58,27],[60,35],[62,45],[58,60],[54,68],[48,70],[43,65],[42,50],[42,40],[45,33]] },
  // Eurasia        (tan)
  { color: '#b8a070', pts: [[42,32],[44,26],[46,24],[50,22],[58,20],[72,17],[88,19],[92,27],[88,35],[85,40],[80,42],[72,40],[68,38],[62,33],[58,30],[54,33],[50,30],[46,30],[44,30]] },
  // India          (coral — Indo-Australian plate)
  { color: '#c07060', pts: [[64,40],[72,38],[78,40],[77,48],[74,52],[70,52],[67,48],[65,44]] },
  // Australia      (coral — Indo-Australian plate)
  { color: '#c07060', pts: [[72,55],[79,52],[86,54],[90,60],[88,65],[82,70],[73,68],[70,62],[70,57]] },
  // Antarctica     (gray)
  { color: '#a0a8b0', pts: [[0,87],[100,87],[100,100],[0,100]] },
];

// ── Plate boundary lines ─────────────────────────────────────
const BLINES = [
  { type: 'divergent',  pts: [[42,8],[42,65]]   },   // Mid-Atlantic Ridge
  { type: 'divergent',  pts: [[55,40],[57,62]]  },   // E African Rift
  { type: 'convergent', pts: [[58,33],[76,34]]  },   // Himalayas
  { type: 'convergent', pts: [[21,38],[21,70]]  },   // Andes / Peru-Chile Trench
  { type: 'convergent', pts: [[78,32],[83,45]]  },   // Mariana Trench
  { type: 'convergent', pts: [[8,21],[12,30]]   },   // Cascadia
  { type: 'transform',  pts: [[9,26],[13,37]]   },   // San Andreas
];

const TC = { convergent: '#e74c3c', divergent: '#3498db', transform: '#f1c40f' };

let pulse = 0, hovered = null;

// ── Helpers ──────────────────────────────────────────────────
const px  = (x, y) => [x / 100 * canvas.width, y / 100 * canvas.height];
const af  = ()     => window.tectonics?.activeFilter() ?? 'all';

function poly(pts, fill) {
  ctx.beginPath();
  pts.forEach(([x, y], i) => {
    const [cx, cy] = px(x, y);
    i ? ctx.lineTo(cx, cy) : ctx.moveTo(cx, cy);
  });
  ctx.closePath();
  ctx.fillStyle   = fill;
  ctx.fill();
  ctx.strokeStyle = 'rgba(0,0,0,0.28)';
  ctx.lineWidth   = 0.6;
  ctx.stroke();
}

// ── Draw: boundary lines ─────────────────────────────────────
function drawBoundaryLines() {
  const filter = af();
  BLINES.forEach(l => {
    const dim = filter !== 'all' && filter !== l.type;
    ctx.globalAlpha = dim ? 0.1 : 0.85;
    ctx.strokeStyle = TC[l.type];
    ctx.lineWidth   = 2;
    ctx.setLineDash([7, 4]);
    ctx.beginPath();
    l.pts.forEach(([x, y], i) => {
      const [cx, cy] = px(x, y);
      i ? ctx.lineTo(cx, cy) : ctx.moveTo(cx, cy);
    });
    ctx.stroke();
    ctx.setLineDash([]);
  });
  ctx.globalAlpha = 1;
}

// ── Draw: hotspot markers ────────────────────────────────────
function drawHotspots(t) {
  const filter = af();
  (window.tectonics?.boundaries ?? []).forEach(b => {
    const [cx, cy] = px(b.mapX, b.mapY);
    const color    = TC[b.type];
    const dim      = filter !== 'all' && filter !== b.type;

    // Pulsing ring (skip when dimmed)
    if (!dim) {
      const ph = t % 1;
      ctx.globalAlpha = (1 - ph) * 0.48;
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

// ── Draw: legend (bottom-left) ───────────────────────────────
function drawLegend() {
  const lx = 10, ly = canvas.height - 64;
  ctx.fillStyle = 'rgba(0,12,26,0.78)';
  ctx.beginPath();
  ctx.roundRect(lx, ly, 132, 56, 6);
  ctx.fill();

  [['convergent','Convergent'], ['divergent','Divergent'], ['transform','Transform']]
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
      ctx.fillStyle   = '#cdd6f4';
      ctx.globalAlpha = 1;
      ctx.font        = '9px "Segoe UI",system-ui,sans-serif';
      ctx.fillText(label, lx + 32, iy + 4);
    });
}

// ── Draw: hover tooltip ──────────────────────────────────────
function drawTooltip() {
  if (!hovered) return;
  const [cx, cy] = px(hovered.mapX, hovered.mapY);
  const text = `${hovered.name}  ·  ${hovered.type}`;
  ctx.font = '10px "Segoe UI",system-ui,sans-serif';
  const tw = ctx.measureText(text).width;
  let tx = cx + 14, ty = cy - 16;
  if (tx + tw + 14 > canvas.width)  tx = cx - tw - 18;
  if (ty < 10)                       ty = cy + 22;
  ctx.fillStyle = 'rgba(0,12,26,0.92)';
  ctx.beginPath();
  ctx.roundRect(tx - 6, ty - 14, tw + 14, 22, 4);
  ctx.fill();
  ctx.fillStyle = '#fff';
  ctx.fillText(text, tx, ty);
}

// ── Animation loop ───────────────────────────────────────────
function loop(time) {
  // Sync canvas resolution to CSS layout size
  if (canvas.clientWidth > 0 &&
      (canvas.width !== canvas.clientWidth || canvas.height !== canvas.clientHeight)) {
    canvas.width  = canvas.clientWidth;
    canvas.height = canvas.clientHeight;
  }

  pulse = time / 1600;

  // Ocean background
  ctx.fillStyle = '#1a3a5a';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  CONTINENTS.forEach(c => poly(c.pts, c.color));
  drawBoundaryLines();
  drawHotspots(pulse);
  drawLegend();
  drawTooltip();

  requestAnimationFrame(loop);
}

// ── Mouse interaction ────────────────────────────────────────
function hitTest(e) {
  const r  = canvas.getBoundingClientRect();
  const mx = e.clientX - r.left;
  const my = e.clientY - r.top;
  return (window.tectonics?.boundaries ?? []).find(b => {
    const [bx, by] = px(b.mapX, b.mapY);
    return Math.hypot(mx - bx, my - by) < 14;
  }) ?? null;
}

canvas.addEventListener('mousemove',  e => { hovered = hitTest(e); canvas.style.cursor = hovered ? 'pointer' : 'default'; });
canvas.addEventListener('mouseleave', () => { hovered = null; });
canvas.addEventListener('click',      e => { const b = hitTest(e); if (b) window.tectonics?.selectBoundary(b); });

requestAnimationFrame(loop);
