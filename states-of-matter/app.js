// States of Matter: Particle Lab — Utah SEEd 6.2.2
'use strict';

// ── Translations ──────────────────────────────────────────────────────────────
const T = {
  en: {
    title:'🔬 States of Matter: Particle Lab', stdTitle:'Utah SEEd Standard 6.2.2',
    stdDesc:'Develop a model to predict the effect of heat energy on states of matter and density.',
    subNames:{water:'Water (H₂O)',iron:'Iron (Fe)',oxygen:'Oxygen (O₂)'},
    subInfos:{water:'Melts: 0°C · Boils: 100°C',iron:'Melts: 1538°C · Boils: 2862°C',oxygen:'Melts: −218°C · Boils: −183°C'},
    thermoLbl:'Temperature', sliderMid:'❄ Cold — Hot 🔥', mpAbbr:'MP', bpAbbr:'BP', densityLbl:'Density',
    stateCfg:{
      solid: {emoji:'❄️', label:'SOLID',  bg:'#1a4a7a', desc:'Particles are locked in a fixed pattern. They vibrate in place but don\'t move around. Tightly packed = high density.', density:'●●●●● HIGH'},
      liquid:{emoji:'💧', label:'LIQUID', bg:'#0e6655', desc:'Particles slide past each other freely. They stay close together but have no fixed arrangement. Still fairly dense.',   density:'●●●○○ MEDIUM'},
      gas:   {emoji:'💨', label:'GAS',   bg:'#7d3c08', desc:'Particles fly in all directions and fill the entire container. Large spaces between particles = very low density.',     density:'●○○○○ LOW'}
    },
    vocabTitle:'📖 Vocabulary',
    vocab:[['States of Matter','The different forms matter can take — solid, liquid, or gas.'],['Solid','Particles locked in fixed positions; they vibrate in place.'],['Liquid','Particles flow freely but stay close together.'],['Gas','Particles spread out and fill any container.'],['Melting','Changing from solid → liquid by adding heat energy.'],['Freezing','Changing from liquid → solid by removing heat energy.'],['Evaporating','Changing from liquid → gas by adding heat energy.'],['Condensing','Changing from gas → liquid by removing heat energy.'],['Density','How closely packed particles are — solids are densest, gases least dense.'],['Phase Change','The process of matter changing from one state to another.'],['Heat Energy','Energy that causes particles to move faster.']],
    conceptsTitle:'💡 Key Concepts',
    concepts:['Adding heat energy makes particles move faster.','Removing heat energy makes particles move slower.','Density depends on how closely packed the particles are.','Different substances change state at different temperatures.'],
    langBtn:'🇪🇸 Español'
  },
  es: {
    title:'🔬 Estados de la Materia: Laboratorio de Partículas', stdTitle:'Estándar Utah SEEd 6.2.2',
    stdDesc:'Desarrolla un modelo para predecir el efecto de la energía térmica en los estados de la materia y la densidad.',
    subNames:{water:'Agua (H₂O)',iron:'Hierro (Fe)',oxygen:'Oxígeno (O₂)'},
    subInfos:{water:'Funde: 0°C · Hierve: 100°C',iron:'Funde: 1538°C · Hierve: 2862°C',oxygen:'Funde: −218°C · Hierve: −183°C'},
    thermoLbl:'Temperatura', sliderMid:'❄ Frío — Caliente 🔥', mpAbbr:'PF', bpAbbr:'PE', densityLbl:'Densidad',
    stateCfg:{
      solid: {emoji:'❄️', label:'SÓLIDO',  bg:'#1a4a7a', desc:'Las partículas están bloqueadas en un patrón fijo. Vibran en su lugar pero no se mueven. Muy compactas = densidad alta.', density:'●●●●● ALTA'},
      liquid:{emoji:'💧', label:'LÍQUIDO', bg:'#0e6655', desc:'Las partículas se deslizan unas sobre otras. Se mantienen juntas pero sin posiciones fijas. Todavía bastante densas.',   density:'●●●○○ MEDIA'},
      gas:   {emoji:'💨', label:'GAS',    bg:'#7d3c08', desc:'Las partículas vuelan en todas direcciones y llenan todo el recipiente. Grandes espacios entre partículas = densidad muy baja.', density:'●○○○○ BAJA'}
    },
    vocabTitle:'📖 Vocabulario',
    vocab:[['Estados de la Materia','Las diferentes formas que puede tomar la materia — sólido, líquido o gas.'],['Sólido','Partículas bloqueadas en posiciones fijas; vibran en su lugar.'],['Líquido','Las partículas fluyen libremente pero se mantienen juntas.'],['Gas','Las partículas se dispersan y llenan cualquier recipiente.'],['Fusión','Cambio de sólido → líquido al agregar energía térmica.'],['Congelación','Cambio de líquido → sólido al quitar energía térmica.'],['Evaporación','Cambio de líquido → gas al agregar energía térmica.'],['Condensación','Cambio de gas → líquido al quitar energía térmica.'],['Densidad','Qué tan compactas están las partículas — los sólidos son más densos, los gases menos.'],['Cambio de Fase','El proceso por el cual la materia cambia de un estado a otro.'],['Energía Térmica','Energía que hace que las partículas se muevan más rápido.']],
    conceptsTitle:'💡 Conceptos Clave',
    concepts:['Agregar energía térmica hace que las partículas se muevan más rápido.','Quitar energía térmica hace que las partículas se muevan más lento.','La densidad depende de qué tan juntas están las partículas.','Diferentes sustancias cambian de estado a diferentes temperaturas.'],
    langBtn:'🇺🇸 English'
  }
};

// ── Substance data ────────────────────────────────────────────────────────────
const SUBS = {
  water:  { color:'#3498db', mp:0,    bp:100,  tMin:-50,  tMax:150,  t0:-30  },
  iron:   { color:'#95a5a6', mp:1538, bp:2862, tMin:1400, tMax:3000, t0:1400 },
  oxygen: { color:'#1abc9c', mp:-218, bp:-183, tMin:-230, tMax:-160, t0:-225 }
};

// ── State ─────────────────────────────────────────────────────────────────────
const N=40, COLS=8, ROWS=5, SP=14, RAD=6;
let lang='en', subKey='water', sub=SUBS.water, temp=sub.t0;
let particles=[], state='solid', transPhase=1;

const cv=document.getElementById('pCanvas'), cx=cv.getContext('2d');
const W=cv.width, H=cv.height;
const PAD=20, FLOOR=H-PAD, CEIL=PAD, LEFT=PAD, RIGHT=W-PAD;

// ── Helpers ───────────────────────────────────────────────────────────────────
const calcState=()=>temp<sub.mp?'solid':temp<sub.bp?'liquid':'gas';
function heatFrac(){
  if(state==='solid')  return Math.max(0,Math.min(1,(temp-sub.tMin)/(sub.mp -sub.tMin)));
  if(state==='liquid') return Math.max(0,Math.min(1,(temp-sub.mp) /(sub.bp -sub.mp)));
  return                      Math.max(0,Math.min(1,(temp-sub.bp) /(sub.tMax-sub.bp)));
}

// ── Particle initialisation ───────────────────────────────────────────────────
function initParticles(){
  particles=[]; state=calcState(); transPhase=1;
  const ox=W/2-COLS*SP/2, oy=FLOOR-ROWS*SP;
  for(let i=0;i<N;i++){
    const row=Math.floor(i/COLS), col=i%COLS;
    const hx=ox+col*SP, hy=oy+row*SP;
    let x,y,vx=0,vy=0;
    if(state==='solid'){x=hx;y=hy;}
    else if(state==='liquid'){
      x=hx+(Math.random()-.5)*8; y=hy+(Math.random()-.5)*8;
      const a=Math.random()*Math.PI*2; vx=Math.cos(a)*1.2; vy=Math.sin(a)*1.2;
    } else {
      x=LEFT+RAD+Math.random()*(RIGHT-LEFT-RAD*2); y=CEIL+RAD+Math.random()*(FLOOR-CEIL-RAD*2);
      const a=Math.random()*Math.PI*2, sp=2+Math.random()*2; vx=Math.cos(a)*sp; vy=Math.sin(a)*sp;
    }
    particles.push({x,y,vx,vy,hx,hy});
  }
}

// ── Physics ───────────────────────────────────────────────────────────────────
function updateParticles(){
  const ns=calcState();
  if(ns!==state){
    state=ns; transPhase=0;
    const spd=state==='gas'?3:state==='liquid'?1.4:0;
    particles.forEach(p=>{const a=Math.random()*Math.PI*2; p.vx=Math.cos(a)*spd; p.vy=Math.sin(a)*spd;});
  }
  if(transPhase<1) transPhase=Math.min(1,transPhase+0.015);
  const hf=heatFrac();
  if(state==='solid'){
    const jig=0.5+hf*2;
    particles.forEach(p=>{
      p.vx=(Math.random()-.5)*jig; p.vy=(Math.random()-.5)*jig;
      p.x+=(p.hx-p.x)*0.35*transPhase+p.vx; p.y+=(p.hy-p.y)*0.35*transPhase+p.vy;
    });
  } else if(state==='liquid'){
    const liqCeil=FLOOR-(FLOOR-CEIL)*0.44, spd=0.9+hf*1.8;
    particles.forEach(p=>{
      p.vx+=(Math.random()-.5)*0.38; p.vy+=(Math.random()-.5)*0.38;
      const v=Math.hypot(p.vx,p.vy); if(v>spd){p.vx=p.vx/v*spd; p.vy=p.vy/v*spd;}
      p.x+=p.vx; p.y+=p.vy;
      if(p.x<LEFT+RAD){p.x=LEFT+RAD; p.vx=Math.abs(p.vx);}
      if(p.x>RIGHT-RAD){p.x=RIGHT-RAD; p.vx=-Math.abs(p.vx);}
      if(p.y>FLOOR-RAD){p.y=FLOOR-RAD; p.vy=-Math.abs(p.vy)*0.5;}
      if(p.y<liqCeil){p.y=liqCeil; p.vy=Math.abs(p.vy)*0.5;}
    });
  } else {
    const spd=2.2+hf*2.8;
    particles.forEach(p=>{
      const v=Math.hypot(p.vx,p.vy)||1; p.vx=p.vx/v*spd; p.vy=p.vy/v*spd;
      p.x+=p.vx; p.y+=p.vy;
      if(p.x<LEFT+RAD){p.x=LEFT+RAD; p.vx=Math.abs(p.vx);}
      if(p.x>RIGHT-RAD){p.x=RIGHT-RAD; p.vx=-Math.abs(p.vx);}
      if(p.y<CEIL+RAD){p.y=CEIL+RAD; p.vy=Math.abs(p.vy);}
      if(p.y>FLOOR-RAD){p.y=FLOOR-RAD; p.vy=-Math.abs(p.vy);}
    });
  }
}

// ── Draw ──────────────────────────────────────────────────────────────────────
function drawFrame(){
  cx.clearRect(0,0,W,H);
  cx.fillStyle='#0d1822'; cx.fillRect(0,0,W,H);
  cx.strokeStyle='#3a6a9a'; cx.lineWidth=3;
  cx.strokeRect(LEFT-2,CEIL-2,RIGHT-LEFT+4,FLOOR-CEIL+4);
  particles.forEach(p=>{
    const g=cx.createRadialGradient(p.x-RAD*.3,p.y-RAD*.3,1,p.x,p.y,RAD);
    g.addColorStop(0,'#fff'); g.addColorStop(0.3,sub.color); g.addColorStop(1,sub.color+'66');
    cx.fillStyle=g; cx.beginPath(); cx.arc(p.x,p.y,RAD,0,Math.PI*2); cx.fill();
  });
  const cfg=T[lang].stateCfg[state]||T[lang].stateCfg.solid;
  cx.fillStyle='rgba(255,255,255,0.1)';
  cx.font='bold 12px Segoe UI,system-ui,sans-serif'; cx.textAlign='right';
  cx.fillText(cfg.label,RIGHT-6,CEIL+16);
}

// ── UI update ─────────────────────────────────────────────────────────────────
function updateUI(){
  const s=sub, t=T[lang], cfg=t.stateCfg[state]||t.stateCfg.solid;
  const pct=Math.max(0,Math.min(100,(temp-s.tMin)/(s.tMax-s.tMin)*100));
  document.getElementById('thermoFill').style.height=pct+'%';
  const mpPct=(s.mp-s.tMin)/(s.tMax-s.tMin)*100, bpPct=(s.bp-s.tMin)/(s.tMax-s.tMin)*100;
  document.getElementById('mpMark').style.bottom=mpPct+'%';
  document.getElementById('bpMark').style.bottom=bpPct+'%';
  document.getElementById('stateBox').style.background=cfg.bg;
  document.getElementById('stateEmoji').textContent=cfg.emoji;
  document.getElementById('stateLabel').textContent=cfg.label;
  document.getElementById('densityDots').textContent=cfg.density;
  document.getElementById('descBox').textContent=cfg.desc;
}

// ── Substance/slider setup ────────────────────────────────────────────────────
function setupSlider(){
  const sl=document.getElementById('tempSlider'), t=T[lang];
  sl.min=sub.tMin; sl.max=sub.tMax; sl.value=temp;
  document.getElementById('tempDisplay').textContent=temp+'°C';
  document.getElementById('sliderMin').textContent=sub.tMin+'°C';
  document.getElementById('sliderMax').textContent=sub.tMax+'°C';
  const mpPct=(sub.mp-sub.tMin)/(sub.tMax-sub.tMin)*100;
  const bpPct=(sub.bp-sub.tMin)/(sub.tMax-sub.tMin)*100;
  document.getElementById('mpMarker').style.left=mpPct+'%';
  document.getElementById('bpMarker').style.left=bpPct+'%';
  document.getElementById('mpMarkerLbl').textContent=sub.mp+'°C '+t.mpAbbr;
  document.getElementById('bpMarkerLbl').textContent=sub.bp+'°C '+t.bpAbbr;
  document.getElementById('mpMarkLbl').textContent=t.mpAbbr+' '+sub.mp+'°C';
  document.getElementById('bpMarkLbl').textContent=t.bpAbbr+' '+sub.bp+'°C';
}

// ── Apply language ────────────────────────────────────────────────────────────
function applyLang(){
  const t=T[lang];
  document.documentElement.lang=lang;
  document.getElementById('pageTitle').textContent=t.title;
  document.getElementById('stdPopupTitle').textContent=t.stdTitle;
  document.getElementById('stdPopupDesc').textContent=t.stdDesc;
  document.getElementById('thermoLbl').textContent=t.thermoLbl;
  document.getElementById('sliderMid').textContent=t.sliderMid;
  document.getElementById('densityLbl').textContent=t.densityLbl;
  document.getElementById('langBtn').textContent=t.langBtn;
  ['water','iron','oxygen'].forEach(k=>{
    document.getElementById('sub-name-'+k).textContent=t.subNames[k];
    document.getElementById('sub-info-'+k).textContent=t.subInfos[k];
  });
  document.getElementById('vocabTitle').textContent=t.vocabTitle;
  document.getElementById('vocabList').innerHTML=t.vocab.map(([dt,dd])=>`<dt>${dt}</dt><dd>${dd}</dd>`).join('');
  document.getElementById('conceptsTitle').textContent=t.conceptsTitle;
  document.getElementById('conceptsList').innerHTML=t.concepts.map(c=>`<li>${c}</li>`).join('');
  setupSlider();
}

// ── Animation loop ────────────────────────────────────────────────────────────
function loop(){ updateParticles(); drawFrame(); updateUI(); requestAnimationFrame(loop); }

// ── Init ──────────────────────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded',()=>{
  document.querySelectorAll('.sub-btn').forEach(btn=>btn.addEventListener('click',()=>{
    document.querySelectorAll('.sub-btn').forEach(b=>b.classList.remove('active'));
    btn.classList.add('active');
    subKey=btn.dataset.sub; sub=SUBS[subKey]; temp=sub.t0;
    setupSlider(); initParticles();
  }));

  document.getElementById('tempSlider').addEventListener('input',e=>{
    temp=parseInt(e.target.value);
    document.getElementById('tempDisplay').textContent=temp+'°C';
  });

  document.getElementById('langBtn').addEventListener('click',()=>{ lang=lang==='en'?'es':'en'; applyLang(); });

  const popup=document.getElementById('stdPopup');
  document.getElementById('stdBtn').addEventListener('click',()=>popup.classList.remove('hidden'));
  document.getElementById('stdClose').addEventListener('click',()=>popup.classList.add('hidden'));
  popup.addEventListener('click',e=>{if(e.target===popup)popup.classList.add('hidden');});

  applyLang(); initParticles(); loop();
});
