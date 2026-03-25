// Matter Particle Tracker — Utah SEEd 5.3.3
'use strict';

// ── Tracker translations ───────────────────────────────────────────────────────
const TT = {
  en:{
    particleLbl:'✨ Matter',
    breathLbl:'breathed out',
    followPlay:'▶ Follow the Matter!',
    followStop:'⏹ Stop',
    prevBtn:'← Previous',
    nextBtn:'Next →',
    stopLabel:'Stop',
    of:'of',
    finishMsg:'The same matter went through the <strong>WHOLE cycle!</strong> Matter is never created or destroyed — it just moves from place to place. ♻️',
    watchAgain:'🔄 Watch Again',
  },
  es:{
    particleLbl:'✨ Materia',
    breathLbl:'exhalada',
    followPlay:'▶ ¡Sigue la Materia!',
    followStop:'⏹ Detener',
    prevBtn:'← Anterior',
    nextBtn:'Siguiente →',
    stopLabel:'Parada',
    of:'de',
    finishMsg:'¡La misma materia pasó por <strong>TODO el ciclo!</strong> La materia nunca se crea ni se destruye — solo se mueve de un lugar a otro. ♻️',
    watchAgain:'🔄 Ver de Nuevo',
  }
};
const gl=()=>TT[document.documentElement.lang]||TT.en;

// cpx/cpy = bezier control point used when ARRIVING at that stop
const STOPS = [
  {step:0, x:260, y:110, cpx:260, cpy: 60, msg:{en:'Matter is in the air and soil!',                                                   es:'¡La materia está en el aire y el suelo!'}},
  {step:1, x:100, y:260, cpx:130, cpy: 55, msg:{en:'The cactus takes in matter from air and water to grow!',                           es:'¡El cactus toma materia del aire y agua para crecer!'}},
  {step:2, x:252, y:268, cpx:176, cpy:195, msg:{en:'The rat eats the cactus — matter moves to the rat!',                               es:'¡La rata come el cactus — la materia pasa a la rata!'},         breath:true},
  {step:3, x:372, y:274, cpx:310, cpy:210, msg:{en:'The snake eats the rat — matter moves to the snake!',                              es:'¡La serpiente come la rata — la materia pasa a la serpiente!'},breath:true},
  {step:4, x:182, y:276, cpx:278, cpy:318, msg:{en:'The snake dies — but the matter is still here!',                                   es:'¡La serpiente muere — pero la materia sigue aquí!'}},
  {step:5, x:207, y:318, cpx:192, cpy:293, msg:{en:'Decomposers break down the dead matter!',                                          es:'¡Los descomponedores descomponen la materia muerta!'},          decompose:true},
  {step:0, x:260, y:110, cpx:160, cpy:210, msg:{en:'Matter returns to the air and soil — the cycle is complete! 🔄',                   es:'¡La materia regresa al aire y al suelo — el ciclo está completo! 🔄'}, celebrate:true},
];

let active=false, trkStop=0, trkT=0, trkState='idle';
let trkX=260, trkY=110, startX=0, startY=0, cpX=0, cpY=0;
let pauseStart=0, pulse=0, frameN=0;
let trail=[], extras=[], rafId=null;

const trkCv=document.getElementById('scene'), trkCx=trkCv.getContext('2d');
const TW=trkCv.width, TH=trkCv.height;
const ease=t=>t<0.5?2*t*t:-1+(4-2*t)*t;
const bx=(x0,cx1,x1,t)=>(1-t)**2*x0+2*(1-t)*t*cx1+t**2*x1;
const by=(y0,cy1,y1,t)=>(1-t)**2*y0+2*(1-t)*t*cy1+t**2*y1;

// roundRect polyfill (Chrome <99 fallback)
if(!CanvasRenderingContext2D.prototype.roundRect){
  CanvasRenderingContext2D.prototype.roundRect=function(x,y,w,h,r){
    this.moveTo(x+r,y); this.arcTo(x+w,y,x+w,y+r,r); this.arcTo(x+w,y+h,x+w-r,y+h,r);
    this.arcTo(x,y+h,x,y+h-r,r); this.arcTo(x,y,x+r,y,r); this.closePath();
  };
}

// ── Drawing helpers ───────────────────────────────────────────────────────────
function drawTrail(){
  trail.forEach((p,i)=>{
    trkCx.fillStyle=`rgba(241,196,15,${(i/trail.length)*0.45})`;
    trkCx.beginPath(); trkCx.arc(p.x,p.y,3,0,Math.PI*2); trkCx.fill();
  });
}

function drawExtras(){
  extras.forEach(p=>{
    trkCx.save(); trkCx.globalAlpha=Math.max(0,p.a);
    trkCx.fillStyle=p.color;
    trkCx.beginPath(); trkCx.arc(p.x,p.y,p.r,0,Math.PI*2); trkCx.fill();
    if(p.lbl){
      trkCx.font="9px 'Segoe UI',sans-serif"; trkCx.textAlign='center';
      trkCx.fillStyle=`rgba(200,235,255,${p.a})`; trkCx.fillText(p.lbl,p.x,p.y-p.r-3);
    }
    trkCx.restore();
  });
}

function drawParticle(){
  const p=0.7+Math.sin(pulse)*0.3;
  const lbl=gl().particleLbl;
  trkCx.save();
  // Pulsing glow halo
  const g=trkCx.createRadialGradient(trkX,trkY,2,trkX,trkY,26*p);
  g.addColorStop(0,'rgba(241,196,15,0.65)'); g.addColorStop(1,'rgba(241,196,15,0)');
  trkCx.shadowColor='#fff8dc'; trkCx.shadowBlur=20*p;
  trkCx.fillStyle=g; trkCx.beginPath(); trkCx.arc(trkX,trkY,26*p,0,Math.PI*2); trkCx.fill();
  trkCx.shadowBlur=0;
  // Core circle
  trkCx.fillStyle='#f1c40f'; trkCx.beginPath(); trkCx.arc(trkX,trkY,8,0,Math.PI*2); trkCx.fill();
  trkCx.fillStyle='rgba(255,255,255,0.85)'; trkCx.beginPath(); trkCx.arc(trkX-2,trkY-2,3,0,Math.PI*2); trkCx.fill();
  // Particle label pill
  trkCx.font="bold 11px 'Segoe UI',sans-serif"; trkCx.textAlign='center'; trkCx.textBaseline='middle';
  const lw=trkCx.measureText(lbl).width;
  trkCx.fillStyle='rgba(20,8,0,0.75)';
  trkCx.beginPath(); trkCx.roundRect(trkX-lw/2-7,trkY-40,lw+14,18,5); trkCx.fill();
  trkCx.fillStyle='#fff'; trkCx.fillText(lbl,trkX,trkY-31);
  trkCx.restore();
  // Message bubble (while paused)
  if(trkState==='paused'){
    const curLang=document.documentElement.lang;
    const msg=STOPS[trkStop].msg[curLang]||STOPS[trkStop].msg.en;
    trkCx.save();
    trkCx.font="bold 11px 'Segoe UI',sans-serif"; trkCx.textAlign='center'; trkCx.textBaseline='middle';
    const mw=Math.min(TW-16, trkCx.measureText(msg).width+26);
    const mx=Math.max(mw/2+6, Math.min(TW-mw/2-6, trkX));
    const my=trkY+48>TH-14 ? trkY-56 : trkY+48;
    trkCx.fillStyle='rgba(10,4,0,0.86)';
    trkCx.beginPath(); trkCx.roundRect(mx-mw/2,my-13,mw,26,7); trkCx.fill();
    trkCx.fillStyle='#ffe082'; trkCx.fillText(msg,mx,my);
    trkCx.restore();
  }
}

// ── Animation loop ────────────────────────────────────────────────────────────
function loop(ts){
  if(!active){rafId=null; return;}
  rafId=requestAnimationFrame(loop);
  pulse+=0.07; frameN++;
  if(trkState==='traveling'){
    trkT=Math.min(1,trkT+0.016);
    const e=ease(trkT);
    trkX=bx(startX,cpX,STOPS[trkStop].x,e);
    trkY=by(startY,cpY,STOPS[trkStop].y,e);
    if(frameN%3===0){ trail.push({x:trkX,y:trkY}); if(trail.length>55) trail.shift(); }
    if(trkT>=1){trkState='paused'; pauseStart=ts; onArrive();}
  } else if(trkState==='paused'){
    if(ts-pauseStart>3000) advance();
  }
  extras=extras.filter(p=>{p.x+=p.vx; p.y+=p.vy; p.a-=p.da; return p.a>0;});
  render();       // app.js global — clears canvas and redraws scene each frame
  drawTrail();
  drawExtras();
  drawParticle();
}

// ── Stop logic ────────────────────────────────────────────────────────────────
function onArrive(){
  const s=STOPS[trkStop];
  activateStep(s.step);   // app.js global — syncs food chain highlight + info panel
  if(s.breath)    spawnBreath();
  if(s.decompose) spawnDecompose();
  if(s.celebrate) spawnSparkles();
  if(trkStop===STOPS.length-1) setTimeout(finishCycle,3200);
  updateControls();
}

function advance(){
  if(trkStop>=STOPS.length-1) return;
  startX=trkX; startY=trkY;
  trkStop++; trkT=0; trkState='traveling';
  cpX=STOPS[trkStop].cpx; cpY=STOPS[trkStop].cpy;
  if(trkStop===STOPS.length-1){  // Spawn rising particles for the final return-to-sky leg
    for(let i=0;i<4;i++) extras.push({x:207+(Math.random()-.5)*28,y:326,
      vx:(Math.random()-.5)*.5,vy:-1.8-Math.random()*.8,a:.7,da:.007,r:3,color:'#f1c40f'});
  }
  updateControls();
}

// ── Particle effects ──────────────────────────────────────────────────────────
function spawnBreath(){
  const lbl=gl().breathLbl;
  for(let i=0;i<4;i++) extras.push({
    x:trkX+(Math.random()-.5)*14, y:trkY-4,
    vx:(Math.random()-.5)*.8, vy:-1.2-Math.random()*.9,
    a:.85, da:.008, r:4, color:'#aed6f1', lbl:i===0?lbl:null
  });
}
function spawnDecompose(){
  for(let i=0;i<6;i++){
    const a=Math.random()*Math.PI*2;
    extras.push({x:trkX,y:trkY,vx:Math.cos(a)*.9,vy:Math.sin(a)*.9,a:.9,da:.006,r:3,color:'#a569bd'});
  }
}
function spawnSparkles(){
  for(let i=0;i<22;i++){
    const a=Math.random()*Math.PI*2, sp=2+Math.random()*3;
    extras.push({x:trkX,y:trkY,vx:Math.cos(a)*sp,vy:Math.sin(a)*sp-1,
      a:1,da:.016,r:2+Math.random()*4,color:`hsl(${30+Math.random()*60},100%,65%)`});
  }
}

// ── Lifecycle ─────────────────────────────────────────────────────────────────
function finishCycle(){
  active=false; trail=[]; extras=[]; render();
  document.getElementById('trackerControls').classList.add('hidden');
  document.getElementById('followBtn').textContent=gl().followPlay;
  document.getElementById('followBtn').classList.remove('playing');
  const msgEl=document.getElementById('trackerMsg');
  msgEl.classList.remove('hidden');
  msgEl.innerHTML=`<p>${gl().finishMsg}</p>
    <button class="follow-btn" id="watchAgainBtn">${gl().watchAgain}</button>`;
  document.getElementById('watchAgainBtn').addEventListener('click',startTracker);
}

function startTracker(){
  document.getElementById('trackerMsg').classList.add('hidden');
  document.getElementById('trackerControls').classList.remove('hidden');
  document.getElementById('followBtn').textContent=gl().followStop;
  document.getElementById('followBtn').classList.add('playing');
  trail=[]; extras=[]; trkStop=0; trkT=1;
  trkX=STOPS[0].x; trkY=STOPS[0].y;
  trkState='paused'; pauseStart=performance.now();
  active=true;
  activateStep(STOPS[0].step);
  updateControls();
  if(!rafId) rafId=requestAnimationFrame(loop);
}

function stopTracker(){
  active=false; trail=[]; extras=[];
  document.getElementById('trackerControls').classList.add('hidden');
  document.getElementById('followBtn').textContent=gl().followPlay;
  document.getElementById('followBtn').classList.remove('playing');
  render();
}

function updateControls(){
  const traveling=trkState==='traveling';
  const t=gl();
  document.getElementById('prevBtn').disabled=trkStop===0||traveling;
  document.getElementById('nextBtn').disabled=trkStop>=STOPS.length-1||traveling;
  document.getElementById('prevBtn').textContent=t.prevBtn;
  document.getElementById('nextBtn').textContent=t.nextBtn;
  document.getElementById('stepCount').textContent=`${t.stopLabel} ${trkStop+1} ${t.of} ${STOPS.length}`;
}

// ── Init ──────────────────────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded',()=>{
  // Clone followBtn to remove app.js's startAuto listener, then attach tracker handler
  const btn=document.getElementById('followBtn');
  const nb=btn.cloneNode(true);
  btn.parentNode.replaceChild(nb,btn);
  nb.addEventListener('click',()=>{ active?stopTracker():startTracker(); });

  document.getElementById('nextBtn').addEventListener('click',()=>{
    if(trkState==='paused') advance();
  });
  document.getElementById('prevBtn').addEventListener('click',()=>{
    if(trkStop===0||trkState==='traveling') return;
    trkStop--; trkX=STOPS[trkStop].x; trkY=STOPS[trkStop].y;
    trail=[]; extras=[]; trkState='paused'; pauseStart=performance.now();
    activateStep(STOPS[trkStop].step); updateControls();
  });
});
