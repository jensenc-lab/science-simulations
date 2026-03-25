// Ciclo de la Materia en el Desierto — Utah SEEd 5.3.3
'use strict';

// ── Translations (Spanish only) ───────────────────────────────────────────────
const T = {
  title:'🏜️ Ciclo de la Materia en el Desierto: ¡Sigue la Materia!',
  stdTitle:'Estándar Utah SEEd 5.3.3',
  stdDesc:'¡Descubre cómo se mueve la materia entre plantas, animales, descomponedores y el medio ambiente en un ecosistema desértico de Utah!',
  followPlay:'▶ ¡Sigue la Materia!', followStop:'⏹ Detener',
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

let activeStep=null, autoTimer=null, autoIdx=0;
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
  const slbl=T.soilText;
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
  const lbl=T.orgLabels[org.key]||org.key;
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
  const s=STEPS[i], f=T.stepInfo[i];
  document.getElementById('infoPanel').innerHTML=`
    <div class="info-name" style="color:${s.color}">${f.name}</div>
    <div class="info-role">${f.role}</div>
    <div class="info-row"><span class="info-row-lbl">${T.matterIn}</span>&nbsp;${f.gets}</div>
    <div class="info-row"><span class="info-row-lbl">${T.matterOut}</span>&nbsp;${f.passes}</div>
    <div class="info-desc">${f.desc}</div>`;
}
function clearInfo(){
  document.getElementById('infoPanel').innerHTML=`<div class="info-placeholder">${T.clearMsg}</div>`;
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
    el.innerHTML=`<span class="step-icon">${s.icon}</span><span class="step-label">${T.stepLabels[i].replace(/\n/g,'<br>')}</span>`;
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
  document.getElementById('followBtn').textContent=T.followPlay;
  document.getElementById('followBtn').classList.remove('playing');
}
function startAuto(){
  if(autoTimer){stopAuto(); return;}
  autoIdx=0; activateStep(0);
  document.getElementById('followBtn').textContent=T.followStop;
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

// ── Init ──────────────────────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded',()=>{
  const popup=document.getElementById('stdPopup');
  document.getElementById('stdBtn').addEventListener('click',()=>popup.classList.remove('hidden'));
  document.getElementById('stdClose').addEventListener('click',()=>popup.classList.add('hidden'));
  popup.addEventListener('click',e=>{if(e.target===popup)popup.classList.add('hidden');});
  document.getElementById('followBtn').addEventListener('click',startAuto);

  // Populate dynamic content
  document.title=T.title;
  document.getElementById('pageTitle').textContent=T.title;
  document.getElementById('stdPopupTitle').textContent=T.stdTitle;
  document.getElementById('stdPopupDesc').textContent=T.stdDesc;
  document.getElementById('followBtn').textContent=T.followPlay;
  buildChain();
  document.getElementById('vocabSummary').textContent=T.vocabTitle;
  document.getElementById('vocabList').innerHTML=T.vocab.map(([dt,dd])=>`<dt>${dt}</dt><dd>${dd}</dd>`).join('');
  document.getElementById('promptsSummary').textContent=T.promptsTitle;
  document.getElementById('promptsList').innerHTML=T.prompts.map(p=>`<li>${p}</li>`).join('');
  clearInfo();
  render();
});
