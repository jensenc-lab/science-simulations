// Detective de Fósiles — Utah SEEd 4.1.3 & 4.1.4 (Español)
'use strict';

// ── Strings (solo español) ────────────────────────────────────────────────────
const T = {
  tabs: ['🔍 Buscador de Fósiles', '📊 Línea de Tiempo', '🏆 Desafío Misterioso'],
  tlNew: 'NUEVO', tlOld: 'ANT.', tlAxis: 'Millones de Años Atrás',
  layersLabel: 'Capas exploradas: ',
  cliffTop: '⬆️ Más Reciente (Nuevo)',
  cliffBot: '⬇️ Más Antiguo',
  fossilsFound: '🦴 Fósiles Encontrados Aquí:',
  clickHint: '👆 ¡Haz clic en cualquier tarjeta de fósil para ver su pariente moderno!',
  envReveal: '🤔 ¿Cómo era este lugar?',
  back: '← Volver a la Capa',
  tlNote: '🌟 ¡El entorno de este lugar <strong>CAMBIÓ</strong> dramáticamente a lo largo de millones de años!',
  tlLocked: '🔒 Aún no descubierto — ¡haz clic en esta capa en el acantilado!',
  cmpHeader: '✨ Antes vs. Ahora ✨',
  cmpAncient: '🦴 Fósil Antiguo',
  cmpModern: '🌍 Pariente Moderno',
  popup413h: 'Estándar Utah SEEd 4.1.3',
  popup413p: '¡Usa los fósiles como pistas para descubrir cómo eran los organismos y entornos antiguos!',
  popup414h: 'Estándar Utah SEEd 4.1.4',
  popup414p: '¡Observa los patrones en las capas de roca y los fósiles para descubrir cómo cambiaron los entornos con el tiempo!',
  mysQ: '🔍 Basándote en estos fósiles, ¿cómo era este medio ambiente hace mucho tiempo?',
  mysRound: 'Ronda', mysOf: 'de', mysScore: '⭐ Puntos:',
  mysCorrect: '🎉 <strong>¡Gran trabajo de detective!</strong>',
  mysWrong: '🤔 <strong>¡No del todo!</strong> Mira los fósiles de nuevo...',
  mysNext: 'Siguiente Ronda →', mysFinish: '🏆 ¡Ver Mis Resultados!', mysTry: 'Intentar de Nuevo',
  resTitle: 'Identificaste', resOf: 'de', resCorrectly: '¡ambientes correctamente!',
  resBadge: '¡Eres un detective de fósiles experto! 🏅',
  resInsight: '¡Observa cómo esta ÚNICA ubicación pasó de océano profundo → océano poco profundo → valle fluvial → playa costera → llanura de inundación. ¡El medio ambiente CAMBIÓ a lo largo de cientos de millones de años!',
  mysPlay: '🔄 Jugar de Nuevo',
  finderHint1: '🏜️ <strong>¡Haz clic en una capa de roca</strong> en el acantilado para comenzar tu investigación!',
  finderHint2: '¡Cada capa tiene fósiles antiguos esperando ser descubiertos. Empieza desde abajo para encontrar las pistas más antiguas!',
  vocabTitle: '📖 Vocabulario',
  factsTitle: '🌟 Datos Curiosos',
  vocab: [
    ['Fósil',          'Los restos conservados o rastros de un organismo antiguo encontrado en la roca.'],
    ['Capa de Roca',   '¡Una banda de roca formada por sedimentos con el tiempo. Las capas más antiguas siempre están en el fondo!'],
    ['Antiguo',        'Algo que existió hace mucho, mucho tiempo — miles o millones de años.'],
    ['Organismo',      '¡Cualquier ser vivo — las plantas, los animales, las bacterias y los hongos son todos organismos!'],
    ['Entorno',        'El ambiente donde vive un organismo — tierra, agua, clima y otros seres vivos.'],
    ['Extinto',        'Un tipo de organismo que ha desaparecido completamente y ya no existe en ninguna parte de la Tierra.'],
    ['Paleontólogo',   'Un científico que estudia los fósiles para aprender sobre la vida y los entornos antiguos.'],
  ],
  facts: [
    '¡La Gran Escalinata en el sur de Utah tiene uno de los registros fósiles más completos de la Tierra — millones de años de historia en las rocas!',
    'Las capas de roca más antiguas siempre están en la PARTE INFERIOR porque se depositaron primero, con capas nuevas apilándose encima a lo largo de millones de años.',
    '¡Si encuentras fósiles oceánicos en una montaña, esa área estuvo alguna vez bajo el agua! Utah estuvo cubierto por océanos múltiples veces en su historia.',
  ],
};

// ── Datos de capas (solo español, índice 0 = más antigua/abajo, 4 = más nueva/arriba) ──
const LAYERS = [
  { id:0, name:'Lutita Bright Angel',    age:'~500 millones de años', color:'#6a7a6a', altColor:null,
    env:'Océano Antiguo Profundo',
    envDesc:'Un vasto océano oscuro cubría todo Utah. Extrañas criaturas de cuerpo blando reptaban por el fondo lodoso del mar — ¡millones de años antes de que existieran los dinosaurios!',
    fossils:[
      {emoji:'🪱', name:'Rastros de Gusanos', compKey:'worm',      desc:'Túneles serpenteantes dejados por gusanos antiguos arrastrándose por el barro suave en el fondo del mar.', clue:'¡Los rastros de gusanos indican un fondo marino suave y lodoso bajo el agua!'},
      {emoji:'🦐', name:'Trilobites',          compKey:'trilobite', desc:'¡Una criatura marina de caparazón duro con forma de cucaracha gigante — de hasta 30 centímetros de largo!', clue:'¡Los trilobites SOLO vivían en océanos antiguos — este lugar definitivamente estaba bajo el agua!'},
    ]
  },
  { id:1, name:'Caliza Kaibab',          age:'~250 millones de años', color:'#e8dcc8', altColor:null,
    env:'Océano Cálido Poco Profundo',
    envDesc:'¡Un mar tropical cálido y transparente cubría Utah — como las Bahamas hoy! Arrecifes de coral y criaturas marinas coloridas llenaban el agua de costa a costa.',
    fossils:[
      {emoji:'🦞', name:'Trilobites (tipo cálido)', compKey:'trilobite', desc:'Un tipo diferente de trilobite que amaba el agua cálida y poco profunda — muy diferente de sus primos de aguas profundas.', clue:'¡Este trilobite vivía en agua cálida y poco profunda — el océano se estaba calentando!'},
      {emoji:'🌸', name:'Lirio de Mar (Crinoide)',  compKey:'seaLily',  desc:'¡Parece una flor, pero en realidad era un animal anclado al fondo marino! Agitaba sus brazos para atrapar comida.', clue:'¡Los lirios de mar necesitan agua clara, calmada y poco profunda — esto era un arrecife tropical!'},
      {emoji:'🐚', name:'Concha de Braquiópodo',    compKey:'shell',    desc:'Dos conchas unidas — ¡PARECE una almeja, pero en realidad es un animal completamente diferente!', clue:'¡Los braquiópodos vivían en el fondo de los océanos poco profundos — definitivamente estaba bajo el agua!'},
    ]
  },
  { id:2, name:'Formación Morrison',     age:'~150 millones de años', color:'#c47a5a', altColor:'#a06040',
    env:'Valles Fluviales con Vegetación Exuberante',
    envDesc:'¡No más océano! Enormes ríos atravesaban un paisaje cálido y húmedo. Dinosaurios gigantes como el Alosaurio y el Braquiosaurio deambulaban aquí — ¡algunos de los animales más grandes que jamás caminaron por la Tierra!',
    fossils:[
      {emoji:'🦴', name:'Hueso de Alosaurio',     compKey:'dinosaur', desc:'¡Un hueso enorme del Alosaurio — un dinosaurio carnívoro del tamaño de un autobús escolar con dientes grandes y afilados!', clue:'¡Los grandes depredadores necesitan mucha presa — esto era un ecosistema rico lleno de vida!'},
      {emoji:'🌴', name:'Fósil de Planta Cícada', compKey:'plant',    desc:'Una planta espinosa parecida a una palmera que los dinosaurios comían en el desayuno, el almuerzo y la cena.', clue:'¡Las cícadas necesitan un clima cálido y húmedo — esto era una jungla exuberante y húmeda!'},
    ]
  },
  { id:3, name:'Formación Dakota',       age:'~100 millones de años', color:'#d4b876', altColor:null,
    env:'Playas Costeras y Mar Poco Profundo',
    envDesc:'¡El océano estaba regresando! Playas arenosas y llanuras de marea se extendían por Utah. Los dinosaurios caminaban por la orilla mientras las olas lamían sus pies.',
    fossils:[
      {emoji:'🐚', name:'Fósil de Almeja',       compKey:'shell',    desc:'Una almeja que se enterraba en el fondo arenoso del agua costera poco profunda.', clue:'¡Las almejas necesitan agua — esto era una playa, bahía o mar poco profundo!'},
      {emoji:'👣', name:'Huellas de Dinosaurio', compKey:'dinosaur', desc:'Huellas de tres dedos presionadas en el barro antiguo justo en el borde del agua — ¡perfectamente conservadas!', clue:'¡Huellas en el barro cerca del agua = dinosaurios caminando por una playa o ribera!'},
      {emoji:'🌿', name:'Hoja de Helecho',       compKey:'plant',    desc:'Un helecho perfectamente conservado en roca arenosa — puedes ver cada pequeña vena en la hoja.', clue:'¡Los helechos necesitan mucha humedad — el agua estaba muy cerca!'},
    ]
  },
  { id:4, name:'Formación Kaiparowits',  age:'~65 millones de años',  color:'#8a7a6a', altColor:null,
    env:'Llanuras de Inundación con Bosques',
    envDesc:'Ríos anchos inundaban la tierra cada temporada, dejando suelo rico perfecto para los bosques. Los dinosaurios todavía deambulaban aquí — ¡pero su tiempo casi había terminado! Algo grande estaba a punto de cambiar...',
    fossils:[
      {emoji:'🦴', name:'Fragmento de Hueso de Dinosaurio', compKey:'dinosaur', desc:'Parte de un hueso grande de dinosaurio — uno de los ÚLTIMOS dinosaurios en vivir en Utah antes de la extinción masiva.', clue:'¡Cerca del fin del tiempo de los dinosaurios — un gran cambio se acercaba!'},
      {emoji:'🍃', name:'Fósil de Hoja',                    compKey:'plant',    desc:'Una hoja de planta aplastada en sedimento fluvial, perfectamente conservada durante 65 millones de años.', clue:'¡Las hojas y los árboles significan un entorno exuberante y húmedo con mucha lluvia!'},
      {emoji:'🐢', name:'Caparazón de Tortuga',             compKey:'turtle',   desc:'Un caparazón fosilizado de una tortuga de río — ¡como las tortugas que podrías ver en los arroyos de Utah hoy, pero antigua!', clue:'¡Las tortugas de río viven en ríos — definitivamente había un río fluyendo aquí!'},
    ]
  },
];

// ── Canvas setup ─────────────────────────────────────────────────────────────
const cv = document.getElementById('cliff');
const cx = cv.getContext('2d');
const CW = cv.width, CH = cv.height;   // 420 × 540
const LP = 46, LH = 100, TALUS = 20;
const iy = i => CH - (i+1)*LH - TALUS;

if (!CanvasRenderingContext2D.prototype.roundRect)
  CanvasRenderingContext2D.prototype.roundRect = function(x,y,w,h,r){this.moveTo(x+r,y);this.arcTo(x+w,y,x+w,y+r,r);this.arcTo(x+w,y+h,x+w-r,y+h,r);this.arcTo(x,y+h,x,y+h-r,r);this.arcTo(x,y,x+r,y,r);this.closePath();};

const discovered = new Set();
let hoveredLayer = -1, selectedLayer = -1;

// ── Pre-compute jagged right cliff edge ──────────────────────────────────────
const PROTRUDE = [2, 8, 22, 5, 0];
const EDGE = Array.from({length:CH+2}, (_,y) => {
  const li = Math.min(Math.max(Math.floor((CH-TALUS-y)/LH), 0), LAYERS.length-1);
  const jag = Math.sin(y*.058)*14 + Math.sin(y*.17+.9)*9 + Math.sin(y*.41+.4)*5 + Math.sin(y*.88+1.2)*3;
  return Math.round(CW - 28 + PROTRUDE[li] - Math.max(0, jag));
});

// ── Background ────────────────────────────────────────────────────────────────
function drawBackground() {
  const sg = cx.createLinearGradient(0,0,0,220);
  sg.addColorStop(0,'#5ba8cc'); sg.addColorStop(1,'#b8dff0');
  cx.fillStyle=sg; cx.fillRect(0,0,CW,220);
  const dg = cx.createLinearGradient(0,220,0,CH);
  dg.addColorStop(0,'#c4a060'); dg.addColorStop(1,'#b08040');
  cx.fillStyle=dg; cx.fillRect(0,220,CW,CH-220);
  cx.fillStyle='#b56040';
  cx.beginPath(); cx.moveTo(CW-120,CH-320); cx.lineTo(CW-105,CH-400); cx.lineTo(CW-8,CH-400); cx.lineTo(CW-8,CH-320); cx.closePath(); cx.fill();
  cx.fillStyle='#c87050'; cx.fillRect(CW-105,CH-412,97,14);
  cx.fillStyle='#9a4e30';
  cx.beginPath(); cx.moveTo(CW-65,CH-265); cx.lineTo(CW-50,CH-318); cx.lineTo(CW-5,CH-318); cx.lineTo(CW-5,CH-265); cx.closePath(); cx.fill();
  cx.fillStyle='#aa6040'; cx.fillRect(CW-50,CH-326,45,10);
  cx.fillStyle='rgba(90,35,15,0.4)'; cx.fillRect(CW-105,CH-398,97,8);
  cx.fillStyle='rgba(180,120,60,0.3)'; cx.fillRect(CW-105,CH-388,97,7);
  cx.fillStyle='#9a7848';
  [[CW-38,CH-52,9,6,0.2],[CW-22,CH-78,7,5,-0.1],[CW-8,CH-38,11,7,0.3]].forEach(([x,y,rx,ry,a])=>{
    cx.beginPath(); cx.ellipse(x,y,rx,ry,a,0,Math.PI*2); cx.fill();
  });
}

// ── Timeline axis ─────────────────────────────────────────────────────────────
function drawTimeline() {
  const mx = 22; cx.save();
  cx.strokeStyle='#6b5020'; cx.lineWidth=2;
  cx.beginPath(); cx.moveTo(mx,CH-16); cx.lineTo(mx,22); cx.stroke();
  cx.fillStyle='#6b5020';
  cx.beginPath(); cx.moveTo(mx,14); cx.lineTo(mx-6,26); cx.lineTo(mx+6,26); cx.closePath(); cx.fill();
  cx.font='bold 8px Segoe UI,sans-serif'; cx.textAlign='center'; cx.fillStyle='#5c3a10';
  cx.fillText(T.tlNew, mx, 12);
  cx.fillText(T.tlOld, mx, CH-4);
  cx.save(); cx.translate(9,CH/2); cx.rotate(-Math.PI/2);
  cx.font='7px Segoe UI,sans-serif'; cx.fillStyle='#7a5018'; cx.textAlign='center';
  cx.fillText(T.tlAxis, 0, 0);
  cx.restore(); cx.restore();
}

// ── Draw one rock layer ────────────────────────────────────────────────────────
function drawLayer(L, i) {
  const y = iy(i), isDis = discovered.has(i), isHov = hoveredLayer===i, isSel = selectedLayer===i;

  cx.save();
  cx.beginPath(); cx.moveTo(LP, y);
  for (let ey=y; ey<=y+LH; ey+=2) cx.lineTo(EDGE[Math.min(ey,CH+1)], ey);
  cx.lineTo(LP, y+LH); cx.closePath(); cx.clip();

  cx.fillStyle=L.color; cx.fillRect(LP,y,CW,LH);
  if (L.altColor) { cx.fillStyle=L.altColor; for (let s=8;s<LH-4;s+=18) cx.fillRect(LP,y+s,CW,9); }
  cx.fillStyle='rgba(0,0,0,0.07)';
  for (let tx=LP+8;tx<CW;tx+=11) for (let ty=y+4;ty<y+LH-4;ty+=9) if ((tx*3+ty*7)%11>6) cx.fillRect(tx,ty,2,2);
  cx.fillStyle='rgba(255,255,255,0.06)';
  for (let tx=LP+14;tx<CW;tx+=13) for (let ty=y+7;ty<y+LH-7;ty+=11) if ((tx*5+ty*11)%13>8) cx.fillRect(tx,ty,2,1);
  const cracks=[[LP+55,y+28,LP+70,y+62],[LP+138,y+16,LP+122,y+55],[LP+205,y+44,LP+222,y+80],[LP+288,y+20,LP+270,y+58],[LP+175,y+66,LP+192,y+94]];
  cx.strokeStyle='rgba(0,0,0,0.16)'; cx.lineWidth=0.9;
  cracks.slice(0,2+i).forEach(([x1,y1,x2,y2])=>{cx.beginPath();cx.moveTo(x1,y1);cx.lineTo(x2,y2);cx.stroke();});
  if (isHov||isSel) {cx.fillStyle=isSel?'rgba(241,196,15,0.18)':'rgba(255,220,70,0.1)';cx.fillRect(LP,y,CW,LH);}

  const pos=[{x:.13,y:.50},{x:.50,y:.74},{x:.78,y:.52},{x:.32,y:.72},{x:.64,y:.60}];
  cx.textAlign='center';
  if (isDis) {
    cx.textBaseline='middle';
    L.fossils.forEach((f,fi)=>{
      if (fi>=pos.length) return;
      const ey=Math.min(Math.round(y+pos[fi].y*LH), CH+1);
      const fw=(EDGE[ey]-LP)*0.80;
      const fx=LP+pos[fi].x*fw, fy=y+pos[fi].y*LH;
      cx.fillStyle='rgba(255,248,210,0.90)';
      cx.beginPath(); cx.arc(fx,fy,20,0,Math.PI*2); cx.fill();
      cx.strokeStyle='rgba(120,85,30,0.35)'; cx.lineWidth=1.5;
      cx.beginPath(); cx.arc(fx,fy,21,0,Math.PI*2); cx.stroke();
      cx.font='30px serif'; cx.fillText(f.emoji,fx,fy);
    });
    cx.textBaseline='alphabetic';
  } else {
    cx.font='bold 13px Segoe UI,sans-serif'; cx.fillStyle='rgba(255,255,255,0.22)';
    cx.fillText('? ? ?', LP+(CW-LP)*.42, y+LH/2+5);
  }

  // Label pill
  cx.font='bold 11px Segoe UI,sans-serif';
  const nw=cx.measureText(L.name).width;
  cx.font='9px Segoe UI,sans-serif';
  const aw=cx.measureText(L.age).width;
  const pw=Math.max(nw,aw)+14;
  cx.shadowColor='rgba(0,0,0,0.25)'; cx.shadowBlur=4; cx.shadowOffsetX=1; cx.shadowOffsetY=1;
  cx.fillStyle='rgba(252,238,190,0.96)';
  cx.beginPath(); cx.roundRect(LP+6,y+3,pw,24,5); cx.fill();
  cx.shadowBlur=0; cx.shadowOffsetX=0; cx.shadowOffsetY=0;
  cx.strokeStyle='rgba(140,90,20,0.55)'; cx.lineWidth=1;
  cx.beginPath(); cx.roundRect(LP+6,y+3,pw,24,5); cx.stroke();
  cx.font='bold 11px Segoe UI,sans-serif'; cx.fillStyle='#3d1f00'; cx.textAlign='left';
  cx.fillText(L.name, LP+13, y+14);
  cx.font='9px Segoe UI,sans-serif'; cx.fillStyle='#6a3a10';
  cx.fillText(L.age, LP+13, y+25);

  cx.restore();

  if (i>0) {
    const sy=y+LH; cx.save(); cx.strokeStyle='rgba(0,0,0,0.42)'; cx.lineWidth=1.5;
    cx.beginPath(); cx.moveTo(LP,sy);
    for (let ex=LP; ex<=EDGE[Math.min(sy,CH+1)]; ex+=4) cx.lineTo(ex, sy+Math.sin(ex*.09)*1.5);
    cx.stroke(); cx.restore();
  }
}

// ── Rocky cap ─────────────────────────────────────────────────────────────────
function drawCap() {
  const by=iy(LAYERS.length-1);
  cx.save(); cx.fillStyle='#7a6a58';
  cx.beginPath(); cx.moveTo(LP,by);
  for (let ey=by; ey>=0; ey-=2) cx.lineTo(EDGE[Math.max(ey,0)], ey);
  cx.lineTo(LP,0); cx.closePath(); cx.fill();
  cx.fillStyle='rgba(0,0,0,0.18)'; cx.fillRect(LP,0,CW,5);
  cx.fillStyle='#8a7868';
  [[LP+22,4,10,5],[LP+72,3,14,6],[LP+130,5,11,5],[LP+188,3,16,6],[LP+252,4,12,5]].forEach(([bx,by_,brx,bry])=>{
    cx.beginPath(); cx.ellipse(bx,by_+bry*.6,brx,bry,0,0,Math.PI*2); cx.fill();
  });
  cx.strokeStyle='#4a6820'; cx.lineWidth=1.5;
  [[LP+28,6],[LP+94,5],[LP+162,4],[LP+238,6]].forEach(([x,py])=>{
    for (let g=-2;g<=2;g++){cx.beginPath();cx.moveTo(x+g*3,py+6);cx.lineTo(x+g*3+g,py-4-Math.abs(g)*2);cx.stroke();}
  });
  [[LP+58,5,8],[LP+136,4,7],[LP+215,6,9]].forEach(([x,py,r])=>{
    cx.fillStyle='#607830'; cx.beginPath(); cx.ellipse(x,py+r*.6,r,r*.65,0,0,Math.PI*2); cx.fill();
    cx.fillStyle='#7a9840'; cx.beginPath(); cx.ellipse(x-3,py+r*.25,r*.6,r*.42,-.3,0,Math.PI*2); cx.fill();
  });
  cx.restore();
}

// ── Talus slope ───────────────────────────────────────────────────────────────
function drawTalus() {
  const base=iy(0)+LH;
  cx.fillStyle='#8a7050';
  cx.beginPath(); cx.moveTo(LP,base); cx.lineTo(EDGE[Math.min(base,CH+1)],base);
  cx.lineTo(EDGE[CH+1]+8,CH); cx.lineTo(LP,CH); cx.closePath(); cx.fill();
  [[LP+16,base+11,15,10,'#5a4838'],[LP+58,base+8,12,8,'#6a5840'],[LP+106,base+13,20,12,'#584838'],
   [LP+160,base+9,14,9,'#6a5840'],[LP+214,base+6,22,14,'#504038'],[LP+272,base+10,12,7,'#6a5840']]
    .forEach(([x,y,rx,ry,c])=>{
      cx.fillStyle=c; cx.beginPath(); cx.ellipse(x,y,rx,ry,.1,0,Math.PI*2); cx.fill();
      cx.fillStyle='rgba(255,255,255,0.12)'; cx.beginPath(); cx.ellipse(x-rx*.35,y-ry*.35,rx*.38,ry*.3,0,0,Math.PI*2); cx.fill();
    });
  cx.fillStyle='#9a8870';
  for (let px=LP+6;px<LP+318;px+=16) cx.beginPath(), cx.arc(px, base+20+(px*13%7)*2, 2+(px%3), 0, Math.PI*2), cx.fill();
}

// ── Main draw ─────────────────────────────────────────────────────────────────
function draw() {
  cx.clearRect(0,0,CW,CH);
  drawBackground();
  drawTimeline();
  LAYERS.forEach((L,i) => drawLayer(L,i));
  drawCap();
  drawTalus();
}

// ── Event helpers ─────────────────────────────────────────────────────────────
function layerIdx(e) {
  const r=cv.getBoundingClientRect();
  const i=Math.floor((CH-TALUS-(e.clientY-r.top)*CH/r.height)/LH);
  return (i>=0&&i<LAYERS.length)?i:-1;
}
cv.addEventListener('mousemove', e=>{
  const r=cv.getBoundingClientRect(), sx=CW/r.width, sy=CH/r.height;
  const ex=(e.clientX-r.left)*sx, ey=Math.round((e.clientY-r.top)*sy);
  hoveredLayer=(ex>=LP&&ex<=EDGE[Math.min(ey,CH+1)])?layerIdx(e):-1;
  cv.style.cursor=hoveredLayer>=0?'pointer':'default'; draw();
});
cv.addEventListener('mouseleave', ()=>{hoveredLayer=-1;draw();});
cv.addEventListener('click', e=>{
  const r=cv.getBoundingClientRect();
  const ex=(e.clientX-r.left)*CW/r.width, ey=Math.round((e.clientY-r.top)*CH/r.height);
  if (ex<LP||ex>EDGE[Math.min(ey,CH+1)]) return;
  const i=layerIdx(e); if (i<0) return;
  selectedLayer=i;
  if (!discovered.has(i)){discovered.add(i);updateProgress();}
  showLayer(i); switchTab('finder'); draw();
});

// ── Panel: Buscador de Fósiles ────────────────────────────────────────────────
function showFinderPlaceholder() {
  document.getElementById('finderContent').innerHTML =
    `<div class="placeholder"><p>${T.finderHint1}</p>
     <p style="margin-top:10px;color:#a07820">${T.finderHint2}</p></div>`;
}
function showLayer(i) {
  if (i<0) return;
  const L = LAYERS[i];
  let h=`<div class="layer-hdr" style="background:${L.color}">
    <div class="lhdr-name">${L.name}</div>
    <div class="lhdr-age">📅 ${L.age}</div>
  </div><div class="fossils-wrap"><h3>${T.fossilsFound}</h3>
  <p class="comp-hint">${T.clickHint}</p>`;
  L.fossils.forEach(f=>{
    h+=`<div class="fossil-card" data-comp-key="${f.compKey}"><span class="f-emoji">${f.emoji}</span>
      <div class="f-text"><div class="f-name">${f.name}</div>
      <div class="f-desc">${f.desc}</div>
      <div class="f-clue">🔍 ${f.clue}</div></div></div>`;
  });
  h+=`</div><details class="env-reveal"><summary>${T.envReveal}</summary>
    <div class="env-box"><strong>🌍 ${L.env}</strong><p>${L.envDesc}</p></div></details>`;
  document.getElementById('finderContent').innerHTML=h;
}

// ── Panel: Línea de Tiempo ────────────────────────────────────────────────────
function buildTimeline() {
  let h=`<p class="tl-note">${T.tlNote}</p><div class="tl-wrap">`;
  [...LAYERS].reverse().forEach(L=>{
    const f=discovered.has(L.id);
    h+=`<div class="tl-row ${f?'tl-found':'tl-locked'}">
      <div class="tl-dot" style="background:${L.color}"></div>
      <div><div class="tl-rname">${L.name} <span class="tl-rage">${L.age}</span></div>
      <div class="tl-renv">${f?'🌍 '+L.env:T.tlLocked}</div></div>
    </div>`;
  });
  document.getElementById('timelineContent').innerHTML=h+'</div>';
}

// ── Vocabulario y Datos Curiosos ──────────────────────────────────────────────
function buildVocab() {
  document.getElementById('vocabSummary').textContent = T.vocabTitle;
  document.getElementById('vocabDl').innerHTML =
    T.vocab.map(([term, def]) => `<dt>${term}</dt><dd>${def}</dd>`).join('');
}
function buildFacts() {
  document.getElementById('factsSummary').textContent = T.factsTitle;
  document.getElementById('factsList').innerHTML =
    T.facts.map(f => `<li>${f}</li>`).join('');
}

// ── Progreso + pestañas ───────────────────────────────────────────────────────
function updateProgress() {
  document.getElementById('exploreCount').textContent=discovered.size;
  document.getElementById('layersLabel').textContent=T.layersLabel;
  let d=''; for (let i=0;i<LAYERS.length;i++) d+=discovered.has(i)?'✅':'⬜';
  document.getElementById('progressDots').textContent=' '+d;
  buildTimeline();
}
function switchTab(t) {
  document.querySelectorAll('.tab-btn').forEach(b=>b.classList.toggle('active',b.dataset.tab===t));
  document.querySelectorAll('.tab-panel').forEach(p=>{p.classList.toggle('active',p.id==='tab-'+t);p.classList.toggle('hidden',p.id!=='tab-'+t);});
  if (t==='timeline') buildTimeline();
}

// ── Inicializar UI ────────────────────────────────────────────────────────────
function initUI() {
  document.querySelectorAll('.tab-btn').forEach((b,i) => { b.textContent=T.tabs[i]; });
  document.getElementById('cliffTopLabel').textContent = T.cliffTop;
  document.getElementById('cliffBotLabel').textContent = T.cliffBot;
  document.getElementById('layersLabel').textContent = T.layersLabel;
  document.getElementById('p413h').textContent = T.popup413h;
  document.getElementById('p413p').textContent = T.popup413p;
  document.getElementById('p414h').textContent = T.popup414h;
  document.getElementById('p414p').textContent = T.popup414p;
  buildVocab();
  buildFacts();
  draw();
  showFinderPlaceholder();
}

// ── Init ──────────────────────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.tab-btn').forEach(b=>b.addEventListener('click',()=>switchTab(b.dataset.tab)));
  document.querySelectorAll('[data-popup]').forEach(b=>b.addEventListener('click',()=>document.getElementById(b.dataset.popup).classList.remove('hidden')));
  document.querySelectorAll('[data-close]').forEach(b=>b.addEventListener('click',()=>document.getElementById(b.dataset.close).classList.add('hidden')));
  document.querySelectorAll('.popup').forEach(p=>p.addEventListener('click',e=>{if(e.target===p)p.classList.add('hidden');}));

  // Welcome overlay: fade in, then dismiss on button click
  const welcomeOverlay = document.getElementById('welcomeOverlay');
  requestAnimationFrame(() => requestAnimationFrame(() => welcomeOverlay.classList.add('visible')));
  document.getElementById('welcomeBtn').addEventListener('click', () => {
    welcomeOverlay.classList.remove('visible');
    welcomeOverlay.addEventListener('transitionend', () => { welcomeOverlay.style.display = 'none'; }, {once: true});
  });

  updateProgress();
  initUI();
});
