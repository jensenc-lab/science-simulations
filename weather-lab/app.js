// ── State ──────────────────────────────────────────────────────────
const canvas = document.getElementById('mapCanvas');
const ctx = canvas.getContext('2d');
let W = 0, H = 0;
let systems = [];    // { id, type:'H'|'L', temp:'warm'|'cold', fx, fy }
let selId = null, dragObj = null, dragType = null;
let animT = 0, tlRunning = false, showArrows = true;

// Utah centre as fractions of canvas (adjust if map image crops differently)
const UFX = 0.54, UFY = 0.52;

const PRESETS = [
  [{ t:'H', tmp:'warm', fx:0.54, fy:0.52 }],
  [{ t:'H', tmp:'warm', fx:0.54, fy:0.52 }, { t:'L', tmp:'warm', fx:0.07, fy:0.50 }],
  [{ t:'H', tmp:'warm', fx:0.54, fy:0.72 }, { t:'L', tmp:'cold', fx:0.46, fy:0.22 }],
  [{ t:'L', tmp:'cold', fx:0.18, fy:0.18 }, { t:'H', tmp:'warm', fx:0.78, fy:0.72 }],
];

// ── Map Image ──────────────────────────────────────────────────────
const mapImg = new Image();
mapImg.src = 'us-map.png';
mapImg.onerror = () => { mapImg.src = 'us-map.jpg'; }; // try .jpg fallback
mapImg.onload = () => { if (W && H) draw(); };

// Utah highlight bounds as fractions — adjust to match your map image
const UT = { x: 0.438, y: 0.40, w: 0.20, h: 0.25 };

function drawMap() {
  if (!W || !H) return;
  if (mapImg.complete && mapImg.naturalWidth) {
    ctx.drawImage(mapImg, 0, 0, W, H);          // stretch image to fill canvas
  } else {
    ctx.fillStyle = '#e3f2fd'; ctx.fillRect(0, 0, W, H); // placeholder while loading
  }
  // Utah highlight overlay
  const ux = UT.x*W, uy = UT.y*H, uw = UT.w*W, uh = UT.h*H;
  ctx.fillStyle = 'rgba(255, 200, 0, 0.20)';
  ctx.fillRect(ux, uy, uw, uh);
  ctx.strokeStyle = 'rgba(180, 70, 0, 0.65)';
  ctx.lineWidth = 2; ctx.setLineDash([5, 3]);
  ctx.strokeRect(ux, uy, uw, uh);
  ctx.setLineDash([]);
  ctx.fillStyle = 'rgba(160, 50, 0, 0.80)';
  ctx.font = `bold ${Math.max(11, W*0.018)}px Segoe UI`;
  ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
  ctx.fillText('UTAH', ux + uw/2, uy + uh/2);
  ctx.textBaseline = 'alphabetic';
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
  ctx.clearRect(0, 0, W, H); drawMap(); drawWindArrows();
  systems.filter(s=>s.type==='H').forEach(h => systems.filter(s=>s.type==='L').forEach(l => {
    if (h.temp!==l.temp && Math.hypot((h.fx-l.fx)*W, (h.fy-l.fy)*H) < W*0.7) drawFront(h, l);
  }));
  systems.forEach(drawSystem); animT += 0.016;
}
function calcWeather() {
  if (!systems.length) return null;
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
document.getElementById('btnTL').addEventListener('click', () => {
  if (tlRunning || !systems.length) return;
  tlRunning = true; let day = 0;
  const iv = setInterval(() => {
    systems.filter(s => s.type==='L').forEach(s => { s.fx=Math.min(0.95,s.fx+0.07); s.fy=Math.min(0.85,s.fy+0.02); });
    draw(); updateDash(calcWeather()); if (++day >= 3) { clearInterval(iv); tlRunning = false; }
  }, 900);
});
document.getElementById('btnClear').addEventListener('click', () => {
  systems=[]; selId=null; tlRunning=false; draw(); updateDash(null);
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
