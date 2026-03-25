// Desert Matter Cycle — Utah SEEd 5.3.3
'use strict';

const STEPS = [
  { id:'env',    icon:'☀️',  label:'Air, Water\n& Soil',   color:'#3498db', orgs:['sky','soil'],
    info:{ name:'🌍 The Environment',    role:'Where matter begins — and ends up again!',
      gets:'Matter is always here: in the air, water, and soil.',
      passes:'Plants pull matter from the air and water from the soil to grow.',
      desc:'Matter is all around us — in the air, water, and soil. Plants use matter from the air and water from the soil to grow. This is where the cycle begins... and where it ends up again!' }},
  { id:'prod',   icon:'🌵',  label:'Producers\n(Plants)',   color:'#27ae60', orgs:['cactus','sage'],
    info:{ name:'🌵 Producers',           role:'They make their own food!',
      gets:'Air + water + sunlight',
      passes:'Animals eat them; when they die, decomposers break them down.',
      desc:'Desert plants like cactus and sagebrush take in matter from the air and water from the soil. They use energy from the Sun to turn this matter into plant material — leaves, stems, roots, and fruit. They MAKE their own food!' }},
  { id:'cons1',  icon:'🐁',  label:'Primary\nConsumer',     color:'#e67e22', orgs:['rat'],
    info:{ name:'🐁 Kangaroo Rat',        role:'Primary Consumer',
      gets:'Eats seeds and plant parts',
      passes:'Matter moves to the snake when eaten; some is breathed back into the air.',
      desc:'The kangaroo rat eats seeds and parts of desert plants. When it eats, the matter that was in the plant becomes part of the rat\'s body. The rat also breathes out some matter back into the air.' }},
  { id:'cons2',  icon:'🐍',  label:'Secondary\nConsumer',   color:'#c0392b', orgs:['snake','hawk'],
    info:{ name:'🐍 Rattlesnake & 🦅 Hawk', role:'Secondary Consumers',
      gets:'Eats kangaroo rats and other small animals',
      passes:'Matter moves on when they are eaten or when they die.',
      desc:'The rattlesnake eats the kangaroo rat. The matter that was in the rat now becomes part of the snake\'s body. The snake also breathes out some matter into the air.' }},
  { id:'dead',   icon:'🍂',  label:'Dead\nMatter',          color:'#795548', orgs:['log'],
    info:{ name:'🍂 Dead Matter',          role:'Matter waiting to be recycled!',
      gets:'The remains of dead plants and animals',
      passes:'Decomposers break it all down.',
      desc:'When plants and animals die, their bodies still contain matter. Leaves fall, animals die — but the matter doesn\'t disappear! It\'s still there, waiting to be recycled.' }},
  { id:'decomp', icon:'🍄',  label:'Decomposers',            color:'#8e44ad', orgs:['shroom'],
    info:{ name:'🍄 Decomposers',          role:'Nature\'s recyclers!',
      gets:'Dead plants and animals',
      passes:'Matter released back to air and soil — the cycle starts again!',
      desc:'Tiny organisms like bacteria and fungi break down dead plants and animals. They use some of the matter for their own bodies, and they release the rest back into the air and soil. Decomposers are nature\'s recyclers — they complete the cycle!' }},
];

const ORGS = [
  {key:'hawk',   emoji:'🦅', label:'Hawk',         x:528, y:82,  step:'cons2'},
  {key:'cactus', emoji:'🌵', label:'Cactus',       x:100, y:292, step:'prod' },
  {key:'sage',   emoji:'🌿', label:'Sagebrush',    x:490, y:290, step:'prod' },
  {key:'rat',    emoji:'🐁', label:'Kangaroo Rat', x:252, y:288, step:'cons1'},
  {key:'snake',  emoji:'🐍', label:'Rattlesnake',  x:372, y:294, step:'cons2'},
  {key:'log',    emoji:'🪵', label:'Dead Log',     x:182, y:294, step:'dead' },
  {key:'shroom', emoji:'🍄', label:'Fungi',        x:207, y:274, step:'decomp'},
];

let activeStep=null, autoTimer=null, autoIdx=0;
const cv=document.getElementById('scene'), cx=cv.getContext('2d');
const W=cv.width, H=cv.height;

// ── Drawing ───────────────────────────────────────────────────────────────────
function drawBg(){
  const sky=cx.createLinearGradient(0,0,0,265);
  sky.addColorStop(0,'#5dade2'); sky.addColorStop(1,'#aed6f1');
  cx.fillStyle=sky; cx.fillRect(0,0,W,265);
  // Sun
  cx.fillStyle='#f39c12'; cx.beginPath(); cx.arc(548,50,34,0,Math.PI*2); cx.fill();
  cx.fillStyle='#f9ca24'; cx.beginPath(); cx.arc(548,50,26,0,Math.PI*2); cx.fill();
  // Clouds
  [[140,60,40],[305,44,30]].forEach(([x,y,r])=>{
    cx.fillStyle='rgba(255,255,255,0.9)';
    cx.beginPath(); cx.arc(x,y,r,0,Math.PI*2); cx.arc(x+r*.75,y-r*.25,r*.72,0,Math.PI*2); cx.arc(x-r*.6,y-r*.2,r*.6,0,Math.PI*2); cx.fill();
  });
  // Mesa silhouettes
  cx.fillStyle='#9e3d18';
  cx.beginPath(); cx.moveTo(0,265); cx.lineTo(0,238); cx.lineTo(48,188); cx.lineTo(96,216); cx.lineTo(132,192); cx.lineTo(172,265); cx.closePath(); cx.fill();
  cx.beginPath(); cx.moveTo(392,265); cx.lineTo(418,212); cx.lineTo(458,230); cx.lineTo(494,194); cx.lineTo(542,242); cx.lineTo(580,265); cx.closePath(); cx.fill();
  // Sandy ground
  const gnd=cx.createLinearGradient(0,265,0,305);
  gnd.addColorStop(0,'#c8913a'); gnd.addColorStop(1,'#b07828');
  cx.fillStyle=gnd; cx.fillRect(0,265,W,40);
  // Soil layer
  cx.fillStyle='#7a4a20'; cx.fillRect(0,305,W,55);
  cx.strokeStyle='#5a3010'; cx.lineWidth=2;
  cx.beginPath(); cx.moveTo(0,305); cx.lineTo(W,305); cx.stroke();
  // Roots
  cx.strokeStyle='#9B7050'; cx.lineWidth=1.5;
  [[100,305,80,338],[100,305,118,342],[490,305,472,340],[490,305,508,336]].forEach(([x1,y1,x2,y2])=>{
    cx.beginPath(); cx.moveTo(x1,y1); cx.lineTo(x2,y2); cx.stroke();
  });
  // Soil label
  cx.fillStyle='rgba(255,210,140,0.6)'; cx.font='11px Segoe UI,sans-serif'; cx.textAlign='center';
  cx.fillText('🦠  Bacteria & Decomposers at work in the soil', W/2, 346);
}

function drawOrg(org, color){
  cx.save();
  cx.textAlign='center'; cx.textBaseline='alphabetic';
  if(color){
    cx.fillStyle=color+'44'; cx.shadowColor=color; cx.shadowBlur=22;
    cx.beginPath(); cx.arc(org.x,org.y-20,30,0,Math.PI*2); cx.fill();
    cx.shadowBlur=0;
  }
  cx.font='36px "Segoe UI Emoji","Apple Color Emoji","Noto Color Emoji",serif';
  cx.fillText(org.emoji,org.x,org.y);
  cx.font=(color?'bold ':'')+'11px Segoe UI,sans-serif';
  cx.fillStyle=color||'rgba(25,10,0,0.58)';
  cx.fillText(org.label,org.x,org.y+16);
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
  const s=STEPS[i], f=s.info;
  document.getElementById('infoPanel').innerHTML=`
    <div class="info-name" style="color:${s.color}">${f.name}</div>
    <div class="info-role">${f.role}</div>
    <div class="info-row"><span class="info-row-lbl">Matter IN:</span>&nbsp;${f.gets}</div>
    <div class="info-row"><span class="info-row-lbl">Matter OUT:</span>&nbsp;${f.passes}</div>
    <div class="info-desc">${f.desc}</div>`;
}
function clearInfo(){
  document.getElementById('infoPanel').innerHTML='<div class="info-placeholder">👆 Click a step above or an organism in the scene to learn how matter moves!</div>';
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
  STEPS.forEach((s,i)=>{
    const el=document.createElement('div');
    el.className='chain-step';
    el.innerHTML=`<span class="step-icon">${s.icon}</span><span class="step-label">${s.label.replace(/\n/g,'<br>')}</span>`;
    el.addEventListener('click',()=>{stopAuto(); activateStep(i);});
    wrap.appendChild(el);
    const arr=document.createElement('span');
    arr.className='chain-arrow';
    arr.textContent=i<STEPS.length-1?'→':'↩';
    wrap.appendChild(arr);
  });
}

// ── Auto-play ─────────────────────────────────────────────────────────────────
function stopAuto(){
  clearInterval(autoTimer); autoTimer=null;
  document.getElementById('followBtn').textContent='▶ Follow the Matter!';
  document.getElementById('followBtn').classList.remove('playing');
}
function startAuto(){
  if(autoTimer){stopAuto(); return;}
  autoIdx=0; activateStep(0);
  document.getElementById('followBtn').textContent='⏹ Stop';
  document.getElementById('followBtn').classList.add('playing');
  autoTimer=setInterval(()=>{
    autoIdx=(autoIdx+1)%STEPS.length;
    activateStep(autoIdx);
  },3000);
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
  buildChain();
  document.getElementById('followBtn').addEventListener('click',startAuto);
  const popup=document.getElementById('stdPopup');
  document.getElementById('stdBtn').addEventListener('click',()=>popup.classList.remove('hidden'));
  document.getElementById('stdClose').addEventListener('click',()=>popup.classList.add('hidden'));
  popup.addEventListener('click',e=>{if(e.target===popup)popup.classList.add('hidden');});
  render();
});
