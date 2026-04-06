// ── State ──────────────────────────────────────────────────────────
const canvas = document.getElementById('mapCanvas');
const ctx = canvas.getContext('2d');
let W = 0, H = 0;
let systems = [];    // { id, type:'H'|'L', temp:'warm'|'cold', fx, fy }
let selId = null, dragObj = null, dragType = null;
let animT = 0, tlRunning = false, showArrows = true;
const GF  = (lon, lat) => [(lon + 125) / 25, (50 - lat) / 20]; // geo → [0-1] fractions
const GXY = (lon, lat) => { const [fx, fy] = GF(lon, lat); return [fx * W, fy * H]; };
const [UFX, UFY] = GF(-111.5, 39.5); // Utah centre fractions

const PRESETS = [
  [{ t:'H', tmp:'warm', fx:0.54, fy:0.52 }],
  [{ t:'H', tmp:'warm', fx:0.54, fy:0.52 }, { t:'L', tmp:'warm', fx:0.07, fy:0.50 }],
  [{ t:'H', tmp:'warm', fx:0.54, fy:0.72 }, { t:'L', tmp:'cold', fx:0.46, fy:0.22 }],
  [{ t:'L', tmp:'cold', fx:0.18, fy:0.18 }, { t:'H', tmp:'warm', fx:0.78, fy:0.72 }],
];
const BORDERS = [ // [lo1,la1, lo2,la2]
  [-120,49,-120,42], [-124,42,-120,42], [-117,49,-117,42], [-117,42,-114,42],
  [-125,46,-117,46], [-114,49,-114,37], [-114,37,-109,37], [-109,49,-109,31],
  [-104,49,-104,31], [-125,49,-100,49], [-125,30,-100,30],
];
const CITIES = [
  [-111.9,40.8,'Salt Lake City'], [-104.9,39.7,'Denver'],  [-115.1,36.2,'Las Vegas'],
  [-118.2,34.1,'Los Angeles'],    [-112.1,33.4,'Phoenix'],  [-116.2,43.6,'Boise'],
];
const SLBLS = [
  [-117,38.5,'NV'], [-111.5,39.7,'UT'], [-113.5,34,'AZ'],   [-106.5,34.5,'NM'],
  [-105.5,39,'CO'], [-121,44,'OR'],      [-119.5,37,'CA'],   [-115,44.5,'ID'],
  [-110,44.5,'WY'], [-108.5,47,'MT'],
];
const RIDGE = [[-115,48],[-113,46],[-111,44],[-109,42],[-107.5,40],[-105.5,38],[-104.5,37]];
function drawMap() {
  if (!W || !H) return;
  ctx.fillStyle = '#b3e5fc'; ctx.fillRect(0, 0, W, H);                      // ocean
  const cx = GXY(-121, 49)[0];
  ctx.fillStyle = '#dcedc8'; ctx.fillRect(cx, 0, W - cx, H);                // land
  const [ux1, uy1] = GXY(-114.05, 42), [ux2, uy2] = GXY(-109.05, 37);
  ctx.fillStyle = '#fff9c4'; ctx.fillRect(ux1, uy1, ux2-ux1, uy2-uy1);      // Utah
  // grid
  ctx.strokeStyle = 'rgba(90,110,130,0.12)'; ctx.lineWidth = 0.5;
  for (let lo=-125; lo<=-100; lo+=5) { const x=GXY(lo,40)[0]; ctx.beginPath(); ctx.moveTo(x,0); ctx.lineTo(x,H); ctx.stroke(); }
  for (let la=30;  la<=50;  la+=5)  { const y=GXY(-120,la)[1]; ctx.beginPath(); ctx.moveTo(0,y); ctx.lineTo(W,y); ctx.stroke(); }
  // state borders
  ctx.strokeStyle = '#90a4ae'; ctx.lineWidth = 1;
  for (const [lo1,la1,lo2,la2] of BORDERS) {
    const [x1,y1] = GXY(lo1,la1), [x2,y2] = GXY(lo2,la2);
    ctx.beginPath(); ctx.moveTo(x1,y1); ctx.lineTo(x2,y2); ctx.stroke();
  }
  // Rocky Mountains ridge
  ctx.strokeStyle = '#81c784'; ctx.lineWidth = 2.5; ctx.beginPath();
  RIDGE.forEach(([lo,la], i) => { const [x,y]=GXY(lo,la); i ? ctx.lineTo(x,y) : ctx.moveTo(x,y); });
  ctx.stroke();
  // Great Salt Lake
  const [gx,gy] = GXY(-112.5, 41.2); ctx.fillStyle = '#81d4fa';
  ctx.beginPath(); ctx.ellipse(gx, gy, W*0.018, H*0.024, 0, 0, Math.PI*2); ctx.fill();
  // "Pacific Ocean" label
  ctx.textAlign = 'center'; ctx.fillStyle = '#0277bd';
  ctx.font = `italic ${Math.max(8, W*0.012)}px Segoe UI`;
  ctx.fillText('Pacific', cx * 0.5, H * 0.45); ctx.fillText('Ocean', cx * 0.5, H * 0.52);
  // state labels
  ctx.fillStyle = '#546e7a'; ctx.font = `${Math.max(10, W*0.017)}px Segoe UI`;
  for (const [lo,la,n] of SLBLS) { const [x,y]=GXY(lo,la); ctx.fillText(n, x, y); }
  // UTAH bold label
  const [ulx, uly] = GXY(-111.5, 39.4);
  ctx.fillStyle = '#bf360c'; ctx.font = `bold ${Math.max(12, W*0.022)}px Segoe UI`;
  ctx.fillText('UTAH', ulx, uly);
  // cities
  ctx.fillStyle = '#37474f'; ctx.font = `${Math.max(9, W*0.013)}px Segoe UI`;
  for (const [lo,la,n] of CITIES) {
    const [x,y] = GXY(lo, la); ctx.beginPath(); ctx.arc(x, y, 3, 0, Math.PI*2); ctx.fill();
    ctx.fillText(n, x, y - 6);
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
