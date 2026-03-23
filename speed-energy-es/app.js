// Speed & Energy Bowling — Utah SEEd 4.2.1 — Spanish only
'use strict';

// ── Translations (Spanish only) ───────────────────────────────────────────────
const T = {
  es: {
    title:'🎳 Velocidad y Energía: Boliche', stdTitle:'Estándar Utah SEEd 4.2.1',
    stdDesc:'¡Aprende cómo la velocidad de un objeto está relacionada con la energía que tiene!',
    sliderLabel:'¿Qué tan fuerte lanzas la bola?',
    speedNames:['Muy Lento','Lento','Medio','Rápido','Muy Rápido'],
    rollBtn:'🎳 ¡LANZAR!', resetBtn:'Reiniciar Bolos',
    dashTitle:'⚡ Panel de Energía', meterSpeed:'Velocidad', meterEnergy:'Energía',
    qualLabels:['Muy Baja','Baja','Media','Alta','Muy Alta'],
    pinsLabel: n => `Bolos derribados: ${n}/10`,
    results:[
      '¡La bola apenas llegó a los bolos! Energía muy baja.',
      'La bola derribó algunos bolos. Energía baja.',
      '¡Buen tiro! La bola tuvo suficiente energía para derribar varios bolos.',
      '¡Gran tiro! ¡La bola rápida tuvo mucha energía!',
      '¡CHUZA! ¡La bola súper rápida tuvo tanta energía que derribó todo!'
    ],
    thRoll:'#', thSpeed:'Velocidad', thPins:'Bolos', thEnergy:'Energía',
    noticeTitle:'💡 ¿Qué Notas?',
    noticeItems:[
      'Lanza la bola a cada velocidad. ¿Qué patrón ves entre la velocidad y los bolos derribados?',
      '¿Qué velocidad derribó más bolos? ¿Por qué?',
      '¿Una bola más rápida tiene MÁS o MENOS energía que una lenta?'
    ],
    vocabTitle:'📖 Vocabulario',
    vEnergy:'Energía', vEnergyDef:'¡Lo que hace que las cosas se muevan, choquen y cambien. Un objeto en movimiento tiene energía!',
    vSpeed:'Velocidad', vSpeedDef:'Qué tan rápido se mueve algo.',
    vCause:'Causa y Efecto',
    vCauseDef:'Cuando una cosa (la causa) hace que otra cosa suceda (el efecto). Patear una bola más fuerte (causa) hace que vaya más rápido y más lejos (efecto).'
  }
};

// ── State ─────────────────────────────────────────────────────────────────────
const lang = 'es';
let rolling = false, rollCount = 0, pins = [];

const canvas = document.getElementById('laneCanvas');
const ctx    = canvas.getContext('2d');
const W = canvas.width, H = canvas.height;
let ballY = H - 50, ballX = W / 2;

// ── Pins ─────────────────────────────────────────────────────────────────────
function buildPins() {
  pins = [];
  const startY = 60, rowGap = 36, colGap = 36;
  for (let r = 0; r < 4; r++) {
    const count = r + 1, totalW = (count - 1) * colGap;
    for (let c = 0; c < count; c++)
      pins.push({ x: W/2 - totalW/2 + c*colGap, y: startY + (3-r)*rowGap, up:true, dx:0, dy:0, alpha:1 });
  }
}

// ── Draw ──────────────────────────────────────────────────────────────────────
function draw() {
  ctx.clearRect(0, 0, W, H);
  // Lane
  const lg = ctx.createLinearGradient(0,0,W,0);
  lg.addColorStop(0,'#c8a97a'); lg.addColorStop(0.12,'#e8c98a');
  lg.addColorStop(0.88,'#e8c98a'); lg.addColorStop(1,'#c8a97a');
  ctx.fillStyle = lg; ctx.fillRect(0,0,W,H);
  // Gutters
  ctx.fillStyle = '#a07040';
  ctx.fillRect(0,0,28,H); ctx.fillRect(W-28,0,28,H);
  // Lane lines
  ctx.strokeStyle='rgba(160,112,60,0.4)'; ctx.lineWidth=1.5;
  [50,80,W-80,W-50].forEach(lx => { ctx.beginPath(); ctx.moveTo(lx,0); ctx.lineTo(lx,H); ctx.stroke(); });
  // Foul line
  ctx.strokeStyle='#c0392b'; ctx.lineWidth=3;
  ctx.beginPath(); ctx.moveTo(28,H-90); ctx.lineTo(W-28,H-90); ctx.stroke();
  // Arrows
  ctx.fillStyle='rgba(180,130,60,0.55)';
  [W/2-60, W/2, W/2+60].forEach(ax => {
    ctx.beginPath(); ctx.moveTo(ax,H/2-10); ctx.lineTo(ax-8,H/2+10); ctx.lineTo(ax+8,H/2+10); ctx.closePath(); ctx.fill();
  });
  // Pins
  pins.forEach(p => {
    if (!p.up && p.alpha <= 0) return;
    ctx.save(); ctx.globalAlpha = p.alpha; ctx.translate(p.x+p.dx, p.y+p.dy);
    ctx.fillStyle = p.up ? '#f8f8f8' : '#ccc';
    ctx.beginPath(); ctx.ellipse(0,0,10,14,0,0,Math.PI*2); ctx.fill();
    ctx.strokeStyle='#bbb'; ctx.lineWidth=1.5; ctx.stroke();
    if (p.up) { ctx.fillStyle='#e63946'; ctx.fillRect(-10,-3,20,5); }
    ctx.restore();
  });
  // Ball
  const bg = ctx.createRadialGradient(ballX-6,ballY-6,3,ballX,ballY,22);
  bg.addColorStop(0,'#f06b7a'); bg.addColorStop(0.5,'#e63946'); bg.addColorStop(1,'#7b0d1e');
  ctx.fillStyle=bg; ctx.beginPath(); ctx.arc(ballX,ballY,22,0,Math.PI*2); ctx.fill();
  ctx.fillStyle='rgba(0,0,0,0.35)';
  [[-5,-4],[5,-4],[0,7]].forEach(([ox,oy]) => { ctx.beginPath(); ctx.arc(ballX+ox,ballY+oy,4,0,Math.PI*2); ctx.fill(); });
}

// ── Roll animation ────────────────────────────────────────────────────────────
function calcPins(speed) {
  const parents = [ [], [0],[0], [1],[1,2],[2], [3],[3,4],[4,5],[5] ];
  const rowOf   = [  0,  1, 1,   2,   2,   2,   3,   3,   3,   3  ];
  const rowProbs = [
    [0.65, 0,    0,    0   ],  // Very Slow
    [1,    0.85, 0,    0   ],  // Slow
    [1,    1,    0.62, 0   ],  // Medium
    [1,    1,    0.93, 0.77],  // Fast
    [1,    1,    1,    0.93],  // Very Fast
  ][speed - 1];

  if (speed === 5 && Math.random() < 0.6) return pins.map((_,i) => i);
  const knocked = Array(10).fill(false);
  for (let pin = 0; pin < 10; pin++) {
    const eligible = rowOf[pin]===0 || parents[pin].some(p => knocked[p]);
    if (eligible && Math.random() < rowProbs[rowOf[pin]]) knocked[pin] = true;
  }
  return knocked.reduce((acc,k,i) => { if(k) acc.push(i); return acc; }, []);
}

function roll(speed) {
  if (rolling) return;
  const pinsToKnock = calcPins(speed);

  const [lo,hi] = [[152,168],[118,132],[82,96],[46,62],[18,32]][speed-1];
  const stopY = lo+Math.random()*(hi-lo);
  const duration=[1800,1400,1000,700,450][speed-1], startY=H-50, start=performance.now();
  rolling = true;
  document.getElementById('rollBtn').disabled = true;

  function frame(now) {
    const t = Math.min((now-start)/duration, 1);
    const e = 1-(1-t)*(1-t)*(1-t);
    ballY = startY+(stopY-startY)*e;
    pins.forEach((p,i) => {
      if (p.up && pinsToKnock.includes(i) && ballY<=p.y)
        { p.up=false; p.dx=(Math.random()-0.5)*30; p.dy=Math.random()*20; }
    });
    pins.forEach(p => { if (!p.up && p.alpha>0) p.alpha=Math.max(0,p.alpha-0.018); });
    draw();
    if (t < 1) { requestAnimationFrame(frame); return; }
    ballY = startY; draw(); rolling=false;
    document.getElementById('rollBtn').disabled = false;
    showResults(speed, pinsToKnock.length);
  }
  requestAnimationFrame(frame);
}

// ── Results + score ───────────────────────────────────────────────────────────
function showResults(speed, pinsDown) {
  const t = T[lang];
  const title = document.getElementById('resultsPinsLbl');
  title.style.display = 'block';
  title.textContent = t.pinsLabel(pinsDown);
  title.dataset.pins = pinsDown;
  document.getElementById('resultsDesc').textContent = t.results[speed-1];
  rollCount++;
  const tr = document.createElement('tr');
  tr.dataset.speed = speed;
  tr.innerHTML = `<td>${rollCount}</td><td>${t.speedNames[speed-1]}</td><td>${pinsDown}/10</td><td>${t.qualLabels[speed-1]}</td>`;
  const tbody = document.getElementById('scoreBody');
  tbody.appendChild(tr);
  tbody.parentElement.parentElement.scrollTop = 9999;
}

// ── Meters ────────────────────────────────────────────────────────────────────
const METER_COLORS = ['linear-gradient(to top,#3498db,#74b9ff)','linear-gradient(to top,#3498db,#81ecec)','linear-gradient(to top,#3498db,#f9ca24)','linear-gradient(to top,#e17055,#f9ca24)','linear-gradient(to top,#c0392b,#e17055)'];
function updateMeters(speed) {
  const pct = [12,30,55,78,100][speed-1];
  ['speedBar','energyBar'].forEach(id => {
    const b = document.getElementById(id);
    b.style.height = pct+'%'; b.style.background = METER_COLORS[speed-1];
  });
  const t = T[lang];
  document.getElementById('speedQual').textContent  = t.qualLabels[speed-1];
  document.getElementById('energyQual').textContent = t.qualLabels[speed-1];
}

// ── Apply language (Spanish only, called once at init) ────────────────────────
function applyLang() {
  const t = T[lang], s = parseInt(document.getElementById('speedSlider').value);
  const ids = {pageTitle:t.title,stdTitle:t.stdTitle,stdDesc:t.stdDesc,sliderLabel:t.sliderLabel,rollBtn:t.rollBtn,resetBtn:t.resetBtn,dashTitle:t.dashTitle,meterSpeedLbl:t.meterSpeed,meterEnergyLbl:t.meterEnergy,thRoll:t.thRoll,thSpeed:t.thSpeed,thPins:t.thPins,thEnergy:t.thEnergy,noticeTitle:t.noticeTitle,vocabTitle:t.vocabTitle,vEnergy:t.vEnergy,vEnergyDef:t.vEnergyDef,vSpeed:t.vSpeed,vSpeedDef:t.vSpeedDef,vCause:t.vCause,vCauseDef:t.vCauseDef,speedName:t.speedNames[s-1]};
  Object.entries(ids).forEach(([id,val]) => { const el=document.getElementById(id); if(el) el.textContent=val; });
  document.querySelectorAll('#noticeList li').forEach((li,i) => { li.textContent=t.noticeItems[i]; });
  updateMeters(s);
}

// ── Init ──────────────────────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  buildPins(); draw(); updateMeters(3);

  const slider = document.getElementById('speedSlider');
  slider.addEventListener('input', () => {
    document.getElementById('speedName').textContent = T[lang].speedNames[slider.value-1];
    updateMeters(parseInt(slider.value));
  });
  document.getElementById('rollBtn').addEventListener('click', () => roll(parseInt(slider.value)));
  document.getElementById('resetBtn').addEventListener('click', () => {
    if (rolling) return;
    buildPins(); ballY=H-50; draw();
    document.getElementById('resultsPinsLbl').style.display='none';
    document.getElementById('resultsDesc').textContent='';
  });
  document.getElementById('stdBtn').addEventListener('click', () => document.getElementById('stdPopup').classList.remove('hidden'));
  document.getElementById('stdClose').addEventListener('click', () => document.getElementById('stdPopup').classList.add('hidden'));
  document.getElementById('stdPopup').addEventListener('click', e => {
    if (e.target===document.getElementById('stdPopup')) document.getElementById('stdPopup').classList.add('hidden');
  });

  applyLang();
});
