// ── Translations ──────────────────────────────────────────────────────
const T = {
  en: {
    langBtn: '🇪🇸 Español',
    pageTitle: '🌦️ Weather Map Lab: Air Masses &amp; Pressure',
    toolbarLabel: 'Drag to map:',
    toolHLabel: 'High (H)',
    toolHTitle: 'High pressure = clear, dry, calm weather. Air sinks and spreads outward.',
    toolLLabel: 'Low (L)',
    toolLTitle: 'Low pressure = cloudy, stormy weather. Air rises and pulls surrounding air inward.',
    tempLabelNone: 'Select system:',
    tempLabelSet: type => `Set temp (${type}):`,
    tempWarm: '☀️ Warm',
    tempCold: '❄️ Cold',
    canvasWarm: '☀ warm',
    canvasCold: '❄ cold',
    btnSim: '▶ Simulate',
    btnSimPause: '⏸ Pause',
    btnTL: '⏩ Time-Lapse (3 days)',
    btnClear: '🗑️ Clear Map',
    presetLabel: '📋 Preset Scenarios',
    presets: ['Clear Day in Utah', 'Storm Approaching', 'Cold Front Passage', 'Winter Storm'],
    mapHint: '← Drag H or L systems onto the map to begin',
    dashTitle: '📍 Utah — Current Conditions',
    lblTemp: 'Temperature:',
    lblSky: 'Sky:',
    lblWind: 'Wind:',
    lblPres: 'Pressure:',
    infoTitle: "💡 What's Happening?",
    infoInit: 'Place a High (H) or Low (L) pressure system on the map to begin!',
    noSystems: 'Drag the systems closer to Utah to see its weather change!',
    tempWarmVal: 'Warm ☀️',
    tempColdVal: 'Cold ❄️',
    skyClear: 'Clear ☀️',
    skyPartly: 'Partly Cloudy ⛅',
    skyCloudy: 'Cloudy ☁️',
    skyRainy: 'Rainy 🌧️',
    skyStormy: 'Stormy ⛈️',
    windCalm: 'Calm',
    windStrong: 'Strong winds',
    windFrom: dir => `Winds from the ${dir}`,
    presHigh: 'High pressure overhead',
    presLow: 'Low pressure approaching',
    presLowHere: 'Low pressure overhead',
    dirs: ['east','northeast','north','northwest','west','southwest','south','southeast'],
    infoHighOnly: isWarm => `High pressure over Utah means sinking air, which creates clear skies and calm weather. The ${isWarm?'warm':'cold'} air mass keeps conditions stable.`,
    infoLowOnly: isWarm => `A low pressure system is pulling air from surrounding high pressure areas. This rising ${isWarm?'warm':'cold'} air creates clouds and possible precipitation.`,
    infoNoFront: (isWarm, dir) => `Utah is under a ${isWarm?'warm':'cold'} air mass. Wind flows from the high pressure area toward the low — winds from the ${dir}.`,
    infoFront: isCold => isCold
      ? `A cold front is approaching. When cold air pushes under warm air, it forces the warm air up quickly, creating thunderstorms.`
      : `A warm front is approaching. Warm air slides over cooler air, bringing gradual warming and light rain or snow.`,
    tlDay: d => `Day ${d} of 3`,
    tlDone: 'Time-Lapse Complete',
    tlSummary: (d1, d2, d3) => `Over 3 days, weather systems moved west → east across the US. Utah: ${d1} → ${d2} → ${d3}. This is how forecasters track weather — by following pressure systems!`,
    vocabSummary: '📖 Vocabulary',
    conceptsSummary: '🧠 Key Concepts',
    vocabHTML: `<dt>Air Mass</dt><dd>A large body of air with similar temperature and moisture throughout.</dd>
        <dt>High Pressure</dt><dd>An area where air sinks and spreads outward, creating clear, dry, calm weather.</dd>
        <dt>Low Pressure</dt><dd>An area where air rises and pulls surrounding air inward, creating clouds and storms.</dd>
        <dt>Cold Front</dt><dd>Leading edge of cold air pushing into warmer air — brings storms and temperature drops.</dd>
        <dt>Warm Front</dt><dd>Leading edge of warm air moving over cold air — brings gradual warming and light rain.</dd>
        <dt>Precipitation</dt><dd>Water falling from clouds — rain, snow, sleet, or hail.</dd>
        <dt>Wind</dt><dd>Moving air caused by pressure differences. Air flows from high to low pressure.</dd>
        <dt>Atmosphere</dt><dd>The layers of gases surrounding Earth where weather occurs.</dd>`,
    conceptsHTML: `<li>💨 <strong>Air always flows from HIGH → LOW pressure</strong> — like air escaping a balloon.</li>
        <li>☀️ <strong>High pressure = sinking air = clear, dry weather.</strong> Sinking air warms up and stops clouds from forming.</li>
        <li>🌧️ <strong>Low pressure = rising air = clouds and rain.</strong> Rising air cools and water vapor condenses into clouds.</li>
        <li>⛈️ <strong>Fronts form where different temperature air masses meet</strong>, bringing rapid weather changes and storms.</li>`,
    stdPopup: 'Investigate how air moves from high pressure to low pressure areas and causes changes in weather!',
  },
  es: {
    langBtn: '🇺🇸 English',
    pageTitle: '🌦️ Laboratorio de Mapas del Clima: Masas de Aire y Presión',
    toolbarLabel: 'Arrastra al mapa:',
    toolHLabel: 'Alta (H)',
    toolHTitle: 'Alta presión = clima despejado, seco y tranquilo. El aire desciende y se extiende hacia afuera.',
    toolLLabel: 'Baja (L)',
    toolLTitle: 'Baja presión = clima nublado y tormentoso. El aire sube y jala el aire circundante hacia adentro.',
    tempLabelNone: 'Seleccionar sistema:',
    tempLabelSet: type => `Ajustar temp (${type}):`,
    tempWarm: '☀️ Cálido',
    tempCold: '❄️ Frío',
    canvasWarm: '☀ cálido',
    canvasCold: '❄ frío',
    btnSim: '▶ Simular',
    btnSimPause: '⏸ Pausar',
    btnTL: '⏩ Lapso de Tiempo (3 días)',
    btnClear: '🗑️ Limpiar Mapa',
    presetLabel: '📋 Escenarios Predefinidos',
    presets: ['Día Despejado en Utah', 'Tormenta Acercándose', 'Paso de Frente Frío', 'Tormenta Invernal'],
    mapHint: '← Arrastra sistemas H o L al mapa para comenzar',
    dashTitle: '📍 Utah — Condiciones Actuales',
    lblTemp: 'Temperatura:',
    lblSky: 'Cielo:',
    lblWind: 'Viento:',
    lblPres: 'Presión:',
    infoTitle: '💡 ¿Qué Está Pasando?',
    infoInit: '¡Coloca un sistema de Alta (H) o Baja (L) presión en el mapa para comenzar!',
    noSystems: 'Acerca los sistemas a Utah para ver cómo cambia el clima.',
    tempWarmVal: 'Cálido ☀️',
    tempColdVal: 'Frío ❄️',
    skyClear: 'Despejado ☀️',
    skyPartly: 'Parcialmente Nublado ⛅',
    skyCloudy: 'Nublado ☁️',
    skyRainy: 'Lluvioso 🌧️',
    skyStormy: 'Tormentoso ⛈️',
    windCalm: 'Calma',
    windStrong: 'Vientos fuertes',
    windFrom: dir => `Vientos del ${dir}`,
    presHigh: 'Alta presión encima',
    presLow: 'Baja presión acercándose',
    presLowHere: 'Baja presión encima',
    dirs: ['este','noreste','norte','noroeste','oeste','suroeste','sur','sureste'],
    infoHighOnly: isWarm => `Alta presión sobre Utah significa aire descendente, lo que crea cielos despejados y clima calmado. La masa de aire ${isWarm?'cálido':'frío'} mantiene condiciones estables.`,
    infoLowOnly: isWarm => `Un sistema de baja presión está jalando aire de las áreas de alta presión circundantes. Este aire ${isWarm?'cálido':'frío'} ascendente crea nubes y posible precipitación.`,
    infoNoFront: (isWarm, dir) => `Utah está bajo una masa de aire ${isWarm?'cálido':'frío'}. El viento fluye del área de alta presión hacia la baja — vientos del ${dir}.`,
    infoFront: isCold => isCold
      ? `Un frente frío se acerca. Cuando el aire frío empuja debajo del aire cálido, fuerza al aire cálido a subir rápidamente, creando tormentas eléctricas.`
      : `Un frente cálido se acerca. El aire cálido se desliza sobre el aire frío, trayendo calentamiento gradual y lluvia ligera o nieve.`,
    tlDay: d => `Día ${d} de 3`,
    tlDone: 'Lapso de Tiempo Completo',
    tlSummary: (d1, d2, d3) => `En 3 días, los sistemas meteorológicos se movieron de oeste → este por los EE.UU. Utah: ${d1} → ${d2} → ${d3}. ¡Así es como los meteorólogos rastrean el clima — siguiendo los sistemas de presión!`,
    vocabSummary: '📖 Vocabulario',
    conceptsSummary: '🧠 Conceptos Clave',
    vocabHTML: `<dt>Masa de Aire</dt><dd>Un gran cuerpo de aire con temperatura y humedad similar en toda su extensión.</dd>
        <dt>Alta Presión</dt><dd>Un área donde el aire desciende y se extiende hacia afuera, creando clima despejado, seco y tranquilo.</dd>
        <dt>Baja Presión</dt><dd>Un área donde el aire sube y jala el aire circundante hacia adentro, creando nubes y tormentas.</dd>
        <dt>Frente Frío</dt><dd>Borde delantero de aire frío que empuja hacia el aire más cálido — trae tormentas y descensos de temperatura.</dd>
        <dt>Frente Cálido</dt><dd>Borde delantero de aire cálido sobre el aire frío — trae calentamiento gradual y lluvia ligera.</dd>
        <dt>Precipitación</dt><dd>Agua que cae de las nubes — lluvia, nieve, aguanieve o granizo.</dd>
        <dt>Viento</dt><dd>Aire en movimiento por diferencias de presión. El aire fluye de alta a baja presión.</dd>
        <dt>Atmósfera</dt><dd>Las capas de gases que rodean la Tierra donde ocurre el clima.</dd>`,
    conceptsHTML: `<li>💨 <strong>El aire siempre fluye de ALTA → BAJA presión</strong> — como el aire escapando de un globo.</li>
        <li>☀️ <strong>Alta presión = aire descendente = clima despejado y seco.</strong> El aire descendente se calienta e impide la formación de nubes.</li>
        <li>🌧️ <strong>Baja presión = aire ascendente = nubes y lluvia.</strong> El aire ascendente se enfría y el vapor de agua se condensa en nubes.</li>
        <li>⛈️ <strong>Los frentes se forman donde se encuentran masas de aire de diferente temperatura</strong>, trayendo cambios rápidos en el clima y tormentas.</li>`,
    stdPopup: '¡Investiga cómo el aire se mueve de áreas de alta presión a áreas de baja presión y causa cambios en el clima!',
  },
};

// ── State ──────────────────────────────────────────────────────────
let lang = 'en';
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
  ctx.fillStyle = '#b3e5fc'; ctx.fillRect(0, 0, W, H);
  if (mapImg.complete && mapImg.naturalWidth) {
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

  // Animated dashed selection ring
  if (s.id === selId) {
    ctx.save();
    ctx.setLineDash([7, 4]);
    ctx.lineDashOffset = -(animT * 12);
    ctx.beginPath(); ctx.arc(x, y, r + 8, 0, Math.PI*2);
    ctx.strokeStyle = '#ffeb3b'; ctx.lineWidth = 3;
    ctx.stroke();
    ctx.setLineDash([]);
    ctx.restore();
  }

  // Circle: H = red family, L = blue family; temp shifts shade slightly
  ctx.beginPath(); ctx.arc(x, y, r, 0, Math.PI*2);
  const fills = { H: { warm: '#e57373', cold: '#ef9a9a' }, L: { warm: '#64b5f6', cold: '#7986cb' } };
  ctx.fillStyle = fills[s.type][s.temp];
  ctx.fill();
  ctx.strokeStyle = s.type==='H' ? '#c62828' : '#1565c0';
  ctx.lineWidth = 2; ctx.stroke();

  ctx.fillStyle = '#fff'; ctx.textBaseline = 'middle'; ctx.textAlign = 'center';
  ctx.font = `bold ${Math.max(20, W*0.033)}px Segoe UI`; ctx.fillText(s.type, x, y);
  ctx.font = `${Math.max(9, W*0.013)}px Segoe UI`;
  ctx.fillText(s.temp==='warm' ? T[lang].canvasWarm : T[lang].canvasCold, x, y + Math.max(16, W*0.024));
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
  const t = T[lang];
  const [UFX, UFY] = utahCanvas();
  let nH=null, nL=null, dH=Infinity, dL=Infinity;
  systems.forEach(s => {
    const d = Math.hypot(s.fx-UFX, s.fy-UFY);
    if (s.type==='H' && d<dH) { dH=d; nH=s; }
    if (s.type==='L' && d<dL) { dL=d; nL=s; }
  });
  const hN=nH&&dH<0.32, lN=nL&&dL<0.32;
  if (!hN&&!lN) return { temp:'—', sky:'—', wind:t.windCalm, pres:'—', info:t.noSystems };
  if (hN&&!lN)  return { temp:nH.temp==='warm'?t.tempWarmVal:t.tempColdVal, sky:t.skyClear, wind:t.windCalm, pres:t.presHigh, info:t.infoHighOnly(nH.temp==='warm') };
  if (lN&&!hN)  return { temp:nL.temp==='warm'?t.tempWarmVal:t.tempColdVal, sky:dL<0.15?t.skyStormy:t.skyCloudy, wind:t.windStrong, pres:t.presLowHere, info:t.infoLowOnly(nL.temp==='warm') };
  const hD=dH<dL, hasFront=nH.temp!==nL.temp, wd=windDir(nH, nL);
  const dominantSys = hD ? nH : nL;
  return {
    temp: dominantSys.temp==='warm' ? t.tempWarmVal : t.tempColdVal,
    sky:  hasFront ? (dH<dL ? t.skyRainy : t.skyStormy) : t.skyPartly,
    wind: t.windFrom(wd),
    pres: hD ? t.presHigh : t.presLow,
    info: hasFront
      ? t.infoFront(nL.temp==='cold')
      : t.infoNoFront(dominantSys.temp==='warm', wd),
  };
}
function windDir(h, l) {
  const a = Math.atan2(-(l.fy-h.fy), -(l.fx-h.fx)) * 180 / Math.PI;
  return T[lang].dirs[Math.round(((a%360)+360)%360/45)%8];
}
function updateDash(w) {
  if (!w) {
    ['cTemp','cSky','cWind','cPres'].forEach(id => document.getElementById(id).textContent = '—');
    document.getElementById('infoText').textContent = T[lang].infoInit;
    return;
  }
  document.getElementById('cTemp').textContent = w.temp;
  document.getElementById('cSky').textContent  = w.sky;
  document.getElementById('cWind').textContent = w.wind;
  document.getElementById('cPres').textContent = w.pres;
  document.getElementById('infoText').textContent = w.info;
}
const refreshTog = () => {
  const s = systems.find(s => s.id === selId);
  const has = !!s;
  document.querySelectorAll('.temp-btn').forEach(b => {
    b.classList.toggle('active', has && b.dataset.temp === s.temp);
    b.disabled = !has;
  });
  const lbl = document.querySelector('.temp-section .toolbar-label');
  if (lbl) lbl.textContent = has ? T[lang].tempLabelSet(s.type) : T[lang].tempLabelNone;
};

// ── Language toggle ────────────────────────────────────────────────
function applyLang() {
  const t = T[lang];
  document.getElementById('pageTitle').innerHTML = t.pageTitle;
  document.getElementById('langBtn').textContent = t.langBtn;
  document.getElementById('stdPopup').textContent = t.stdPopup;
  document.getElementById('toolbarLabel').textContent = t.toolbarLabel;
  document.getElementById('toolHLabel').textContent = t.toolHLabel;
  document.getElementById('toolH').title = t.toolHTitle;
  document.getElementById('toolLLabel').textContent = t.toolLLabel;
  document.getElementById('toolL').title = t.toolLTitle;
  document.querySelector('.temp-btn[data-temp="warm"]').textContent = t.tempWarm;
  document.querySelector('.temp-btn[data-temp="cold"]').textContent = t.tempCold;
  document.getElementById('btnSim').textContent = showArrows ? t.btnSimPause : t.btnSim;
  document.getElementById('btnTL').textContent = t.btnTL;
  document.getElementById('btnClear').textContent = t.btnClear;
  const sel = document.getElementById('presetSel');
  sel.options[0].text = t.presetLabel;
  t.presets.forEach((name, i) => { if (sel.options[i + 1]) sel.options[i + 1].text = name; });
  document.getElementById('mapHint').textContent = t.mapHint;
  document.getElementById('dashTitle').textContent = t.dashTitle;
  document.getElementById('lblTemp').textContent = t.lblTemp;
  document.getElementById('lblSky').textContent = t.lblSky;
  document.getElementById('lblWind').textContent = t.lblWind;
  document.getElementById('lblPres').textContent = t.lblPres;
  document.getElementById('infoTitle').textContent = t.infoTitle;
  document.getElementById('vocabSummary').textContent = t.vocabSummary;
  document.getElementById('vocabBody').innerHTML = t.vocabHTML;
  document.getElementById('conceptsSummary').textContent = t.conceptsSummary;
  document.getElementById('conceptsBody').innerHTML = t.conceptsHTML;
  refreshTog();
  updateDash(calcWeather());
}

// ── Event Listeners ────────────────────────────────────────────────
document.querySelectorAll('.temp-btn').forEach(btn => btn.addEventListener('click', () => {
  const s = systems.find(s => s.id === selId);
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
  showArrows = !showArrows;
  this.textContent = showArrows ? T[lang].btnSimPause : T[lang].btnSim;
  draw();
});
document.getElementById('btnTL').addEventListener('click', () => startTimeLapse());
document.getElementById('btnClear').addEventListener('click', () => {
  systems=[]; selId=null; draw(); updateDash(null); refreshTog();
  document.getElementById('mapHint').style.display = '';
});
document.getElementById('presetSel').addEventListener('change', function() {
  const idx = parseInt(this.value); if (isNaN(idx)) return;
  systems = PRESETS[idx].map((s,i) => ({ id:i, type:s.t, temp:s.tmp, fx:s.fx, fy:s.fy }));
  selId=null; this.value=''; document.getElementById('mapHint').style.display = 'none';
  draw(); updateDash(calcWeather()); refreshTog();
});
document.getElementById('stdBadge').addEventListener('click', () => document.getElementById('stdPopup').classList.toggle('hidden'));
document.addEventListener('click', e => { if (!e.target.closest('.badge-group')) document.getElementById('stdPopup').classList.add('hidden'); });
document.getElementById('langBtn').addEventListener('click', () => {
  lang = lang === 'en' ? 'es' : 'en';
  applyLang();
});
function resize() { const c=canvas.parentElement; W=canvas.width=c.clientWidth; H=canvas.height=c.clientHeight; }
window.addEventListener('resize', resize);
resize();
refreshTog();
applyLang();
(function loop() { draw(); requestAnimationFrame(loop); })();
