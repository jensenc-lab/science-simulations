// ── State ──────────────────────────────────────────────────────────
const canvas = document.getElementById('mapCanvas');
const ctx = canvas.getContext('2d');
let W = 0, H = 0;
let systems = [];    // { id, type:'H'|'L', temp:'warm'|'cold', fx, fy }
let selId = null, dragObj = null, dragType = null;
let animT = 0, showArrows = true;

const PRESETS = [
  [{ t:'H', tmp:'warm', fx:0.30, fy:0.50 }],
  [{ t:'H', tmp:'warm', fx:0.30, fy:0.50 }, { t:'L', tmp:'warm', fx:0.05, fy:0.45 }],
  [{ t:'H', tmp:'warm', fx:0.30, fy:0.72 }, { t:'L', tmp:'cold', fx:0.28, fy:0.20 }],
  [{ t:'L', tmp:'cold', fx:0.12, fy:0.18 }, { t:'H', tmp:'warm', fx:0.60, fy:0.72 }],
];

// ── Map Image ──────────────────────────────────────────────────────
const mapImg = new Image();
mapImg.src = 'us-map.jpg';
mapImg.onload = () => { if (W && H) draw(); };

// Tracks where the image is rendered so Utah coords stay in sync with canvas size
let imgRect = { dx: 0, dy: 0, dw: 1, dh: 1 };

// Utah's position as fractions of the SOURCE IMAGE (0–1).
// Tune these if the highlight box drifts — open us-map.jpg and measure Utah's corners.
// Image is portrait ~511×596 px. Utah ≈ left 26–38%, top 43–56%.
const UT_IF = { x: 0.255, y: 0.425, w: 0.115, h: 0.135 };

// Return Utah centre as canvas fractions (recalculated each frame via imgRect)
function utahCanvas() {
  return [
    (imgRect.dx + (UT_IF.x + UT_IF.w / 2) * imgRect.dw) / W,
    (imgRect.dy + (UT_IF.y + UT_IF.h / 2) * imgRect.dh) / H,
  ];
}

function drawMap() {
  if (!W || !H) return;
  ctx.fillStyle = '#b3e5fc'; ctx.fillRect(0, 0, W, H); // ocean fallback bg
  if (mapImg.complete && mapImg.naturalWidth) {
    // Cover scaling: fill canvas width, crop top/bottom (trims Canada & Mexico)
    const iw = mapImg.naturalWidth, ih = mapImg.naturalHeight;
    const scale = Math.max(W / iw, H / ih);
    const dw = iw * scale, dh = ih * scale;
    const dx = (W - dw) / 2, dy = (H - dh) / 2;
    imgRect = { dx, dy, dw, dh };
    ctx.save(); ctx.beginPath(); ctx.rect(0, 0, W, H); ctx.clip();
    ctx.drawImage(mapImg, dx, dy, dw, dh);
    ctx.restore();
  } else {
    imgRect = { dx: 0, dy: 0, dw: W, dh: H };
  }
}
function drawSystem(s) {
  const [x,y] = [s.fx*W, s.fy*H], r = Math.max(24, W*0.037);
  ctx.beginPath(); ctx.arc(x, y, r, 0, Math.PI*2);
  ctx.fillStyle = s.type==='H' ? (s.temp==='warm'?'#ef9a9a':'#ffcc80') : (s.temp==='warm'?'#90caf9':'#b39ddb');
  ctx.fill();
  ctx.strokeStyle = s.id===selId ? '#f57f17' : (s.type==='H' ? '#c62828' : '#1565c0');
  ctx.lineWidth = s.id===selId ? 3 : 2; ctx.stroke();
  ctx.fillStyle = '#fff'; ctx.textBaseline = 'middle'; ctx.textAlign = 'center';
  ctx.font = `bold ${Math.max(20, W*0.033)}px Segoe UI`; ctx.fillText(s.type, x, y);
  ctx.font = `${Math.max(9, W*0.013)}px Segoe UI`;
  ctx.fillText(s.temp==='warm' ? '☀️warm' : '❄️cold', x, y + Math.max(16, W*0.024));
  ctx.textBaseline = 'alphabetic';
}
function drawFront(h, l) {
  const [hx,hy,lx,ly] = [h.fx*W, h.fy*H, l.fx*W, l.fy*H];
  const dx=lx-hx, dy=ly-hy, dist=Math.hypot(dx,dy); if (dist < 10) return;
  const mx=(hx+lx)/2, my=(hy+ly)/2, nx=-dy/dist, ny=dx/dist, fLen=dist*0.55;
  const [fx1,fy1,fx2,fy2] = [mx-nx*fLen/2, my-ny*fLen/2, mx+nx*fLen/2, my+ny*fLen/2];
  const cold = h.temp==='cold' || l.temp==='cold';
  ctx.strokeStyle = cold ? '#1565c0' : '#c62828'; ctx.lineWidth = 2.5;
  ctx.beginPath(); ctx.moveTo(fx1,fy1); ctx.lineTo(fx2,fy2); ctx.stroke();
  const steps = Math.max(3, Math.floor(fLen / 22));
  for (let i=0; i<steps; i++) {
    const t=(i+0.5)/steps, cx=fx1+(fx2-fx1)*t, cy=fy1+(fy2-fy1)*t;
    if (cold) {
      ctx.beginPath(); ctx.moveTo(cx,cy);
      ctx.lineTo(cx+nx*10-ny*7, cy+ny*10+nx*7); ctx.lineTo(cx+nx*10+ny*7, cy+ny*10-nx*7);
      ctx.closePath(); ctx.fillStyle = '#1565c0'; ctx.fill();
    } else {
      ctx.beginPath();
      ctx.arc(cx, cy, 8, Math.atan2(ny,nx), Math.atan2(ny,nx) + Math.PI);
      ctx.fillStyle = '#c62828'; ctx.fill();
    }
  }
}
function arrow(x, y, angle, size) {
  ctx.save(); ctx.translate(x,y); ctx.rotate(angle);
  ctx.strokeStyle = 'rgba(2,119,189,0.65)'; ctx.lineWidth = 1.8;
  ctx.beginPath(); ctx.moveTo(-size*.5,0); ctx.lineTo(size*.5,0);
  ctx.lineTo(size*.5-size*.38, -size*.28); ctx.moveTo(size*.5,0);
  ctx.lineTo(size*.5-size*.38, size*.28); ctx.stroke(); ctx.restore();
}
function drawWindArrows() {
  if (!showArrows) return;
  systems.filter(s=>s.type==='H').forEach(h => systems.filter(s=>s.type==='L').forEach(l => {
    const [hx,hy,lx,ly] = [h.fx*W, h.fy*H, l.fx*W, l.fy*H];
    const dx=lx-hx, dy=ly-hy, dist=Math.hypot(dx,dy); if (dist > W*0.95) return;
    const spd = Math.min(1.2, (W*0.5) / dist);
    for (let r=-1; r<=1; r++) {
      const t=((animT*spd*0.4) % 1 + r*0.33 + 1) % 1, px=-dy/dist, py=dx/dist, ox=r*W*0.035;
      arrow(hx+dx*t+px*ox, hy+dy*t+py*ox, Math.atan2(dy,dx), 12+spd*6);
    }
  }));
}
function draw() {
  ctx.clearRect(0, 0, W, H); drawMap();
  if (typeof drawWeatherEffects !== 'undefined') drawWeatherEffects(animT);
  drawWindArrows();
  systems.filter(s=>s.type==='H').forEach(h => systems.filter(s=>s.type==='L').forEach(l => {
    if (h.temp!==l.temp && Math.hypot((h.fx-l.fx)*W, (h.fy-l.fy)*H) < W*0.7) drawFront(h, l);
  }));
  systems.forEach(drawSystem);
  if (typeof drawWeatherHud !== 'undefined') drawWeatherHud();
  animT += 0.016;
}
function calcWeather() {
  if (!systems.length) return null;
  const [UFX, UFY] = utahCanvas();
  let nH=null, nL=null, dH=Infinity, dL=Infinity;
  systems.forEach(s => {
    const d = Math.hypot(s.fx-UFX, s.fy-UFY);
    if (s.type==='H' && d<dH) { dH=d; nH=s; }
    if (s.type==='L' && d<dL) { dL=d; nL=s; }
  });
  const hN=nH&&dH<0.32, lN=nL&&dL<0.32;
  if (!hN&&!lN) return { temp:'—', sky:'—', wind:'Calm', pres:'No nearby systems', info:'Drag the systems closer to Utah to see its weather change!' };
  if (hN&&!lN)  return { temp:nH.temp==='warm'?'Warm 🌡️':'Cold 🥶', sky:'Clear ☀️', wind:'Calm', pres:'High pressure overhead', info:'High pressure over Utah means sinking air, which creates clear skies and calm weather.' };
  if (lN&&!hN)  return { temp:nL.temp==='warm'?'Warm 🌡️':'Cold 🥶', sky:dL<0.15?'Stormy ⛈️':'Cloudy ☁️', wind:'Strong winds', pres:'Low pressure overhead', info:'A low pressure system is pulling air from surrounding areas. This rising air creates clouds and possible precipitation.' };
  const hD=dH<dL, hasFront=nH.temp!==nL.temp, wd=windDir(nH, nL);
  return {
    temp: (hD?nH:nL).temp==='warm' ? 'Warm 🌡️' : 'Cold 🥶',
    sky:  hasFront ? (dH<dL ? 'Rainy 🌧️' : 'Stormy ⛈️') : 'Partly Cloudy ⛅',
    wind: `Winds from the ${wd}`,
    pres: hD ? 'High pressure overhead' : 'Low pressure approaching',
    info: hasFront
      ? `A ${nL.temp==='cold'?'cold':'warm'} front is forming. Cold air pushing under warm air forces it upward, creating storms along the front.`
      : `Wind is flowing from the high pressure area toward the low. Winds coming from the ${wd}.`,
  };
}function windDir(h, l) {
  const a = Math.atan2(-(l.fy-h.fy), -(l.fx-h.fx)) * 180 / Math.PI;
  return ['east','northeast','north','northwest','west','southwest','south','southeast'][Math.round(((a%360)+360)%360/45)%8];
}
function updateDash(w) {
  if (!w) {
    ['cTemp','cSky','cWind','cPres'].forEach(id => document.getElementById(id).textContent = '—');
    document.getElementById('infoText').textContent = 'Place a High (H) or Low (L) pressure system on the map to begin!';
    return;
  }
  document.getElementById('cTemp').textContent = w.temp;
  document.getElementById('cSky').textContent  = w.sky;
  document.getElementById('cWind').textContent = w.wind;
  document.getElementById('cPres').textContent = w.pres;
  document.getElementById('infoText').textContent = w.info;
}
const refreshTog = () => {
  const s = systems.find(s => s.id===selId);
  document.querySelectorAll('.temp-btn').forEach(b => b.classList.toggle('active', !!s && b.dataset.temp===s.temp));
};
document.querySelectorAll('.temp-btn').forEach(btn => btn.addEventListener('click', () => {
  const s = systems.find(s => s.id===selId);
  if (s) { s.temp = btn.dataset.temp; draw(); updateDash(calcWeather()); refreshTog(); }
}));
['H','L'].forEach(t => document.getElementById(`tool${t}`).addEventListener('dragstart', e => {
  dragType = t; e.dataTransfer.effectAllowed = 'copy';
}));
canvas.addEventListener('dragover', e => e.preventDefault());
canvas.addEventListener('drop', e => {
  e.preventDefault();
  if (!dragType || systems.filter(s => s.type===dragType).length >= 3) return;
  const r = canvas.getBoundingClientRect();
  systems.push({ id:Date.now(), type:dragType, temp:'warm', fx:(e.clientX-r.left)/W, fy:(e.clientY-r.top)/H });
  dragType = null; document.getElementById('mapHint').style.display = 'none';
  draw(); updateDash(calcWeather());
});
canvas.addEventListener('mousedown', e => {
  if (typeof wxTlRunning !== 'undefined' && wxTlRunning) return;
  const r=canvas.getBoundingClientRect(), mx=e.clientX-r.left, my=e.clientY-r.top, rad=Math.max(24,W*0.037);
  selId=null; dragObj=null;
  systems.forEach(s => { if (Math.hypot(s.fx*W-mx, s.fy*H-my) < rad) { selId=s.id; dragObj={id:s.id, offX:mx-s.fx*W, offY:my-s.fy*H}; } });
  refreshTog();
});
canvas.addEventListener('mousemove', e => {
  if (!dragObj) return;
  const r=canvas.getBoundingClientRect(), s=systems.find(s => s.id===dragObj.id);
  if (s) { s.fx=(e.clientX-r.left-dragObj.offX)/W; s.fy=(e.clientY-r.top-dragObj.offY)/H; }
  draw(); updateDash(calcWeather());
});
canvas.addEventListener('mouseup', () => dragObj = null);
// ── Buttons & Presets ─────────────────────────────────────────────
document.getElementById('btnSim').addEventListener('click', function() {
  showArrows = !showArrows; this.textContent = showArrows ? '⏸ Pause' : '▶ Simulate'; draw();
});
document.getElementById('btnTL').addEventListener('click', () => startTimeLapse());
document.getElementById('btnClear').addEventListener('click', () => {
  systems=[]; selId=null; draw(); updateDash(null);
  document.getElementById('mapHint').style.display = '';
});
document.getElementById('presetSel').addEventListener('change', function() {
  const idx = parseInt(this.value); if (isNaN(idx)) return;
  systems = PRESETS[idx].map((s,i) => ({ id:i, type:s.t, temp:s.tmp, fx:s.fx, fy:s.fy }));
  selId=null; this.value=''; document.getElementById('mapHint').style.display = 'none';
  draw(); updateDash(calcWeather());
});
document.getElementById('stdBadge').addEventListener('click', () => document.getElementById('stdPopup').classList.toggle('hidden'));
document.addEventListener('click', e => { if (!e.target.closest('.badge-group')) document.getElementById('stdPopup').classList.add('hidden'); });
function resize() { const c=canvas.parentElement; W=canvas.width=c.clientWidth; H=canvas.height=c.clientHeight; }
window.addEventListener('resize', resize);
resize();
(function loop() { draw(); requestAnimationFrame(loop); })();
