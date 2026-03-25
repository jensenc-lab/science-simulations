// Desert Matter Cycle — Utah SEEd 5.3.3
'use strict';

// ── Translations ──────────────────────────────────────────────────────────────
const T = {
  en:{
    title:'🏜️ Desert Matter Cycle: Follow the Matter!',
    stdTitle:'Utah SEEd Standard 5.3.3',
    stdDesc:'Discover how matter moves between plants, animals, decomposers, and the environment in a Utah desert ecosystem!',
    langBtn:'🇪🇸 Español', followPlay:'▶ Follow the Matter!', followStop:'⏹ Stop',
    matterIn:'Matter IN:', matterOut:'Matter OUT:',
    clearMsg:'👆 Click a step above or an organism in the scene to learn how matter moves!',
    stepLabels:['Air, Water\n& Soil','Producers\n(Plants)','Primary\nConsumer','Secondary\nConsumer','Dead\nMatter','Decomposers'],
    stepInfo:[
      {name:'🌍 The Environment',      role:'Where matter begins — and ends up again!',  gets:'Matter is always here: in the air, water, and soil.',              passes:'Plants pull matter from the air and water from the soil to grow.',         desc:'The Environment! Matter is all around us — in the air, water, and soil. Plants use matter from the air (carbon dioxide) and water from the soil to grow. This is where the cycle begins... and where it ends up again!'},
      {name:'🌵 Producers',            role:'They make their own food!',                  gets:'Air + water + sunlight',                                           passes:'Animals eat them; when they die, decomposers break them down.',           desc:'Producers! Desert plants like cactus and sagebrush take in matter from the air and water from the soil. They use energy from the Sun to turn this matter into plant material — leaves, stems, roots, and fruit. They MAKE their own food!'},
      {name:'🐁 Kangaroo Rat',         role:'Primary Consumer',                           gets:'Eats seeds and plant parts',                                       passes:'Matter moves to the snake when eaten; some is breathed back into the air.',desc:'Consumer! The kangaroo rat eats seeds and parts of desert plants. When it eats, the matter that was in the plant becomes part of the rat\'s body. The rat also breathes out some matter back into the air.'},
      {name:'🐍 Rattlesnake & 🦅 Hawk',role:'Secondary Consumers',                      gets:'Eats kangaroo rats and other small animals',                       passes:'Matter moves on when they are eaten or when they die.',                   desc:'Consumer! The rattlesnake eats the kangaroo rat. The matter that was in the rat now becomes part of the snake\'s body. The snake also breathes out some matter into the air.'},
      {name:'🍂 Dead Matter',          role:'Matter waiting to be recycled!',             gets:'The remains of dead plants and animals',                           passes:'Decomposers break it all down.',                                          desc:'Dead Matter! When plants and animals die, their bodies still contain matter. Leaves fall, animals die — but the matter doesn\'t disappear! It\'s still there, waiting to be recycled.'},
      {name:'🍄 Decomposers',          role:'Nature\'s recyclers!',                       gets:'Dead plants and animals',                                          passes:'Matter released back to air and soil — the cycle starts again!',          desc:'Decomposers! Tiny organisms like bacteria and fungi break down dead plants and animals. They use some of the matter for their own bodies, and they release the rest back into the air and soil. Decomposers are nature\'s recyclers — they complete the cycle!'},
    ],
    orgLabels:{hawk:'Hawk',cactus:'Cactus',sage:'Sagebrush',rat:'Kangaroo Rat',snake:'Rattlesnake',log:'Dead Log',shroom:'Fungi'},
    soilText:'🦠  Bacteria & Decomposers at work in the soil',
    vocabTitle:'📖 Vocabulary',
    vocab:[['Matter','The stuff that everything is made of — all living and nonliving things!'],['Producer','A plant that makes its own food using sunlight, air, and water.'],['Consumer','An animal that gets matter by eating plants or other animals.'],['Decomposer','A tiny organism (like bacteria or fungi) that breaks down dead things and returns matter to the soil and air.'],['Food Chain','The path that matter takes as it moves from one living thing to another.'],['Cycle','A process that repeats over and over — matter never disappears, it just moves!'],['Environment','Everything surrounding living things — air, water, soil, sunlight.']],
    promptsTitle:'💡 What Do You Notice?',
    prompts:['Follow the matter through the whole cycle. Does any matter ever disappear?','What would happen if there were no decomposers in the desert?','Where does the matter in YOUR body come from?'],
  },
  es:{
    title:'🏜️ Ciclo de la Materia en el Desierto: ¡Sigue la Materia!',
    stdTitle:'Estándar Utah SEEd 5.3.3',
    stdDesc:'¡Descubre cómo se mueve la materia entre plantas, animales, descomponedores y el medio ambiente en un ecosistema desértico de Utah!',
    langBtn:'🇺🇸 English', followPlay:'▶ ¡Sigue la Materia!', followStop:'⏹ Detener',
    matterIn:'Materia ENTRA:', matterOut:'Materia SALE:',
    clearMsg:'👆 ¡Haz clic en un paso arriba o en un organismo en la escena para aprender cómo se mueve la materia!',
    stepLabels:['Aire, Agua\ny Suelo','Productores\n(Plantas)','Consumidor\nPrimario','Consumidor\nSecundario','Materia\nMuerta','Descomponedores'],
    stepInfo:[
      {name:'🌍 El Medio Ambiente',      role:'¡Donde comienza y termina la materia!',   gets:'La materia siempre está aquí: en el aire, el agua y el suelo.',  passes:'Las plantas absorben materia del aire y el agua del suelo para crecer.',   desc:'¡El Medio Ambiente! La materia está a nuestro alrededor — en el aire, el agua y el suelo. Las plantas usan materia del aire (dióxido de carbono) y agua del suelo para crecer. ¡Aquí es donde el ciclo comienza... y donde termina de nuevo!'},
      {name:'🌵 Productores',            role:'¡Hacen su propio alimento!',               gets:'Aire + agua + luz solar',                                         passes:'Los animales los comen; cuando mueren, los descomponedores los descomponen.',desc:'¡Productores! Las plantas del desierto como el cactus y la artemisa toman materia del aire y agua del suelo. Usan energía del Sol para convertir esta materia en material vegetal — hojas, tallos, raíces y frutos. ¡PRODUCEN su propio alimento!'},
      {name:'🐁 Rata Canguro',           role:'Consumidor Primario',                      gets:'Come semillas y partes de plantas',                               passes:'La materia pasa a la serpiente cuando es comida; algo se exhala al aire.',  desc:'¡Consumidor! La rata canguro come semillas y partes de las plantas del desierto. Cuando come, la materia que estaba en la planta se convierte en parte del cuerpo de la rata. La rata también exhala algo de materia de regreso al aire.'},
      {name:'🐍 Serpiente & 🦅 Halcón', role:'Consumidores Secundarios',                 gets:'Come ratas canguro y otros animales pequeños',                    passes:'La materia continúa cuando son comidos o mueren.',                        desc:'¡Consumidor! La serpiente de cascabel come la rata canguro. La materia que estaba en la rata ahora se convierte en parte del cuerpo de la serpiente. La serpiente también exhala algo de materia al aire.'},
      {name:'🍂 Materia Muerta',         role:'¡Materia esperando ser reciclada!',        gets:'Los restos de plantas y animales muertos',                        passes:'Los descomponedores lo descomponen todo.',                                desc:'¡Materia Muerta! Cuando las plantas y los animales mueren, sus cuerpos todavía contienen materia. Las hojas caen, los animales mueren — ¡pero la materia no desaparece! Sigue ahí, esperando ser reciclada.'},
      {name:'🍄 Descomponedores',        role:'¡Los recicladores de la naturaleza!',      gets:'Plantas y animales muertos',                                      passes:'¡Materia liberada al aire y al suelo — el ciclo comienza de nuevo!',      desc:'¡Descomponedores! Organismos diminutos como las bacterias y los hongos descomponen las plantas y animales muertos. Usan algo de la materia para sus propios cuerpos, y liberan el resto de regreso al aire y al suelo. ¡Los descomponedores son los recicladores de la naturaleza — completan el ciclo!'},
    ],
    orgLabels:{hawk:'Halcón',cactus:'Cactus',sage:'Artemisa',rat:'Rata Canguro',snake:'Serpiente de Cascabel',log:'Tronco Muerto',shroom:'Hongos'},
    soilText:'🦠  Bacterias y descomponedores trabajando en el suelo',
    vocabTitle:'📖 Vocabulario',
    vocab:[['Materia','¡La sustancia de la que está hecho todo — seres vivos y objetos sin vida!'],['Productor','Una planta que hace su propio alimento usando luz solar, aire y agua.'],['Consumidor','Un animal que obtiene materia comiendo plantas u otros animales.'],['Descomponedor','Un organismo diminuto (como bacterias u hongos) que descompone las cosas muertas y devuelve la materia al suelo y al aire.'],['Cadena Alimenticia','El camino que sigue la materia al moverse de un ser vivo a otro.'],['Ciclo','Un proceso que se repite una y otra vez — ¡la materia nunca desaparece, solo se mueve!'],['Medio Ambiente','Todo lo que rodea a los seres vivos — aire, agua, suelo y luz solar.']],
    promptsTitle:'💡 ¿Qué Observas?',
    prompts:['Sigue la materia a través de todo el ciclo. ¿Alguna vez desaparece la materia?','¿Qué pasaría si no hubiera descomponedores en el desierto?','¿De dónde viene la materia en TU cuerpo?'],
  }
};

// ── Step & organism data ──────────────────────────────────────────────────────
const STEPS = [
  {id:'env',   icon:'☀️',  color:'#3498db', orgs:['sky','soil']},
  {id:'prod',  icon:'🌵',  color:'#27ae60', orgs:['cactus','sage']},
  {id:'cons1', icon:'🐁',  color:'#e67e22', orgs:['rat']},
  {id:'cons2', icon:'🐍',  color:'#c0392b', orgs:['snake','hawk']},
  {id:'dead',  icon:'🍂',  color:'#795548', orgs:['log']},
  {id:'decomp',icon:'🍄',  color:'#8e44ad', orgs:['shroom']},
];

const ORGS = [
  {key:'hawk',   emoji:'🦅', x:528, y:82,  step:'cons2'},
  {key:'cactus', emoji:'🌵', x:94,  y:292, step:'prod' },
  {key:'sage',   emoji:'🌿', x:508, y:290, step:'prod' },
  {key:'rat',    emoji:'🐁', x:287, y:288, step:'cons1', labelSide:'above'},
  {key:'snake',  emoji:'🐍', x:385, y:295, step:'cons2'},
  {key:'log',    emoji:'🪵', x:165, y:295, step:'dead',  labelSide:'above'},
  {key:'shroom', emoji:'🍄', x:228, y:274, step:'decomp'},
];

let lang='en', activeStep=null, autoTimer=null, autoIdx=0;
const cv=document.getElementById('scene'), cx=cv.getContext('2d');
const W=cv.width, H=cv.height;

// ── Drawing ───────────────────────────────────────────────────────────────────
function drawBg(){
  const sky=cx.createLinearGradient(0,0,0,265);
  sky.addColorStop(0,'#5dade2'); sky.addColorStop(1,'#aed6f1');
  cx.fillStyle=sky; cx.fillRect(0,0,W,265);
  cx.fillStyle='#f39c12'; cx.beginPath(); cx.arc(548,50,34,0,Math.PI*2); cx.fill();
  cx.fillStyle='#f9ca24'; cx.beginPath(); cx.arc(548,50,26,0,Math.PI*2); cx.fill();
  [[140,60,40],[305,44,30]].forEach(([x,y,r])=>{
    cx.fillStyle='rgba(255,255,255,0.9)';
    cx.beginPath(); cx.arc(x,y,r,0,Math.PI*2); cx.arc(x+r*.75,y-r*.25,r*.72,0,Math.PI*2); cx.arc(x-r*.6,y-r*.2,r*.6,0,Math.PI*2); cx.fill();
  });
  cx.fillStyle='#9e3d18';
  cx.beginPath(); cx.moveTo(0,265); cx.lineTo(0,238); cx.lineTo(48,188); cx.lineTo(96,216); cx.lineTo(132,192); cx.lineTo(172,265); cx.closePath(); cx.fill();
  cx.beginPath(); cx.moveTo(392,265); cx.lineTo(418,212); cx.lineTo(458,230); cx.lineTo(494,194); cx.lineTo(542,242); cx.lineTo(580,265); cx.closePath(); cx.fill();
  const gnd=cx.createLinearGradient(0,265,0,305);
  gnd.addColorStop(0,'#c8913a'); gnd.addColorStop(1,'#b07828');
  cx.fillStyle=gnd; cx.fillRect(0,265,W,40);
  cx.fillStyle='#7a4a20'; cx.fillRect(0,305,W,55);
  cx.strokeStyle='#5a3010'; cx.lineWidth=2;
  cx.beginPath(); cx.moveTo(0,305); cx.lineTo(W,305); cx.stroke();
  cx.strokeStyle='#9B7050'; cx.lineWidth=1.5;
  [[100,305,80,338],[100,305,118,342],[490,305,472,340],[490,305,508,336]].forEach(([x1,y1,x2,y2])=>{
    cx.beginPath(); cx.moveTo(x1,y1); cx.lineTo(x2,y2); cx.stroke();
  });
  cx.font='bold 11px Segoe UI,sans-serif'; cx.textAlign='center'; cx.textBaseline='middle';
  const slbl=T[lang].soilText;
  const sw=cx.measureText(slbl).width;
  cx.fillStyle='rgba(255,255,255,0.18)'; cx.fillRect(W/2-sw/2-8,333,sw+16,18);
  cx.fillStyle='#ffe5a0'; cx.fillText(slbl,W/2,342);
}

function drawOrg(org, color){
  cx.save();
  cx.globalAlpha=1; cx.textAlign='center'; cx.textBaseline='alphabetic';
  if(color){
    cx.fillStyle=color+'55'; cx.shadowColor=color; cx.shadowBlur=26;
    cx.beginPath(); cx.arc(org.x,org.y-20,32,0,Math.PI*2); cx.fill();
    cx.shadowBlur=0;
  }
  cx.fillStyle='#000';
  cx.font='42px "Segoe UI Emoji","Apple Color Emoji","Noto Color Emoji",serif';
  cx.fillText(org.emoji,org.x,org.y);
  const lbl=T[lang].orgLabels[org.key]||org.key;
  cx.font=(color?'bold ':'')+'11px Segoe UI,sans-serif'; cx.textBaseline='middle';
  const tw=cx.measureText(lbl).width;
  const ly=org.labelSide==='above' ? org.y-62 : org.y+6;
  cx.fillStyle='rgba(255,255,255,0.95)'; cx.fillRect(org.x-tw/2-5,ly,tw+10,15);
  cx.fillStyle=color||'#2c1205'; cx.fillText(lbl,org.x,ly+8);
  cx.restore();
}

function render(){
  cx.clearRect(0,0,W,H);
  drawBg();
  const step=activeStep!=null?STEPS[activeStep]:null;
  const active=step?step.orgs:[], color=step?step.color:null;
  if(active.includes('sky')){cx.fillStyle='rgba(52,152,219,0.18)'; cx.fillRect(0,0,W,265);}
  if(active.includes('soil')){cx.fillStyle='rgba(52,152,219,0.25)'; cx.fillRect(0,305,W,55);}
  ORGS.filter(o=>!active.includes(o.key)).forEach(o=>drawOrg(o,null));
  ORGS.filter(o=> active.includes(o.key)).forEach(o=>drawOrg(o,color));
}

// ── Info panel ────────────────────────────────────────────────────────────────
function showInfo(i){
  const s=STEPS[i], f=T[lang].stepInfo[i], t=T[lang];
  document.getElementById('infoPanel').innerHTML=`
    <div class="info-name" style="color:${s.color}">${f.name}</div>
    <div class="info-role">${f.role}</div>
    <div class="info-row"><span class="info-row-lbl">${t.matterIn}</span>&nbsp;${f.gets}</div>
    <div class="info-row"><span class="info-row-lbl">${t.matterOut}</span>&nbsp;${f.passes}</div>
    <div class="info-desc">${f.desc}</div>`;
}
function clearInfo(){
  document.getElementById('infoPanel').innerHTML=`<div class="info-placeholder">${T[lang].clearMsg}</div>`;
}

// ── Activate step ─────────────────────────────────────────────────────────────
function activateStep(idx){
  activeStep=idx;
  document.querySelectorAll('.chain-step').forEach((el,i)=>{
    const on=i===idx;
    el.classList.toggle('active',on);
    el.style.borderColor=on?STEPS[i].color:'';
    el.style.background=on?STEPS[i].color+'22':'';
    el.style.boxShadow=on?`0 0 0 3px ${STEPS[i].color}55,0 0 18px ${STEPS[i].color}44`:'';
  });
  if(idx!=null) showInfo(idx); else clearInfo();
  render();
}

// ── Food chain diagram ────────────────────────────────────────────────────────
function buildChain(){
  const wrap=document.getElementById('chainSteps');
  wrap.innerHTML='';
  STEPS.forEach((s,i)=>{
    const el=document.createElement('div');
    el.className='chain-step';
    el.innerHTML=`<span class="step-icon">${s.icon}</span><span class="step-label">${T[lang].stepLabels[i].replace(/\n/g,'<br>')}</span>`;
    el.addEventListener('click',()=>{stopAuto(); activateStep(i);});
    wrap.appendChild(el);
    const arr=document.createElement('span');
    arr.className='chain-arrow'; arr.textContent=i<STEPS.length-1?'→':'↩';
    wrap.appendChild(arr);
  });
}

// ── Auto-play ─────────────────────────────────────────────────────────────────
function stopAuto(){
  clearInterval(autoTimer); autoTimer=null;
  document.getElementById('followBtn').textContent=T[lang].followPlay;
  document.getElementById('followBtn').classList.remove('playing');
}
function startAuto(){
  if(autoTimer){stopAuto(); return;}
  autoIdx=0; activateStep(0);
  document.getElementById('followBtn').textContent=T[lang].followStop;
  document.getElementById('followBtn').classList.add('playing');
  autoTimer=setInterval(()=>{ autoIdx=(autoIdx+1)%STEPS.length; activateStep(autoIdx); },3000);
}

// ── Canvas click ──────────────────────────────────────────────────────────────
cv.addEventListener('click',e=>{
  const r=cv.getBoundingClientRect();
  const mx=(e.clientX-r.left)*(W/r.width), my=(e.clientY-r.top)*(H/r.height);
  for(const o of ORGS){
    if(Math.hypot(mx-o.x, my-(o.y-18))<36){
      const idx=STEPS.findIndex(s=>s.id===o.step);
      if(idx>=0){stopAuto(); activateStep(idx);}
      return;
    }
  }
});

// ── Apply language ────────────────────────────────────────────────────────────
function applyLang(){
  const t=T[lang];
  document.documentElement.lang=lang;
  document.title=t.title;
  document.getElementById('pageTitle').textContent=t.title;
  document.getElementById('stdPopupTitle').textContent=t.stdTitle;
  document.getElementById('stdPopupDesc').textContent=t.stdDesc;
  document.getElementById('langBtn').textContent=t.langBtn;
  document.getElementById('followBtn').textContent=t.followPlay;
  buildChain();
  document.getElementById('vocabSummary').textContent=t.vocabTitle;
  document.getElementById('vocabList').innerHTML=t.vocab.map(([dt,dd])=>`<dt>${dt}</dt><dd>${dd}</dd>`).join('');
  document.getElementById('promptsSummary').textContent=t.promptsTitle;
  document.getElementById('promptsList').innerHTML=t.prompts.map(p=>`<li>${p}</li>`).join('');
  if(activeStep!=null) showInfo(activeStep); else clearInfo();
  render();
}

// ── Init ──────────────────────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded',()=>{
  document.getElementById('langBtn').addEventListener('click',()=>{ lang=lang==='en'?'es':'en'; applyLang(); });
  const popup=document.getElementById('stdPopup');
  document.getElementById('stdBtn').addEventListener('click',()=>popup.classList.remove('hidden'));
  document.getElementById('stdClose').addEventListener('click',()=>popup.classList.add('hidden'));
  popup.addEventListener('click',e=>{if(e.target===popup)popup.classList.add('hidden');});
  document.getElementById('followBtn').addEventListener('click',startAuto);
  applyLang();
});
