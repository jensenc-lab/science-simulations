// Fossil Detective — Utah SEEd 4.1.3 & 4.1.4
'use strict';

// ── Layer data (index 0 = oldest/bottom, index 4 = newest/top) ──────────────
const LAYERS = [
  { id:0, name:'Bright Angel Shale',    age:'~500 million years ago', color:'#6a7a6a', altColor:null,
    env:'Deep Ancient Ocean',
    envDesc:'A vast, dark ocean covered all of Utah. Strange soft-bodied creatures crept along the muddy seafloor — millions of years before dinosaurs even existed!',
    fossils:[
      {emoji:'🪱', name:'Worm Burrow Trails', desc:'Squiggly tunnels left by ancient worms crawling through soft mud on the seafloor.', clue:'Worm burrows mean a soft, muddy seafloor deep underwater!'},
      {emoji:'🦐', name:'Trilobite',          desc:'A hard-shelled sea creature shaped like a giant pill bug — up to a foot long!', clue:'Trilobites ONLY lived in ancient oceans — this place was definitely underwater!'},
    ]
  },
  { id:1, name:'Kaibab Limestone',      age:'~250 million years ago', color:'#e8dcc8', altColor:null,
    env:'Warm Shallow Ocean',
    envDesc:'A warm, clear tropical sea washed over Utah — like the Bahamas today! Coral reefs and colorful sea creatures filled the water from shore to shore.',
    fossils:[
      {emoji:'🦞', name:'Trilobite (warm water type)', desc:'A different kind of trilobite that loved warm, shallow water — very different from its deep-water cousins.', clue:'This trilobite lived in warm, shallow water — the ocean was getting warmer!'},
      {emoji:'🌸', name:'Sea Lily (Crinoid)',           desc:'Looks like a flower, but it was actually an animal anchored to the seafloor! It waved its arms to catch food.', clue:'Sea lilies need clear, calm, shallow water — this was a tropical reef!'},
      {emoji:'🐚', name:'Brachiopod Shell',            desc:'Two shells joined together — it LOOKS like a clam, but it\'s actually a completely different animal!', clue:'Brachiopods lived on shallow ocean floors — definitely underwater here!'},
    ]
  },
  { id:2, name:'Morrison Formation',    age:'~150 million years ago', color:'#c47a5a', altColor:'#a06040',
    env:'River Valleys with Lush Vegetation',
    envDesc:'No more ocean! Huge rivers carved through a warm, wet landscape. Giant dinosaurs like Allosaurus and Brachiosaurus roamed here — some of the biggest animals that ever walked the Earth!',
    fossils:[
      {emoji:'🦴', name:'Allosaurus Bone',    desc:'A massive bone from Allosaurus — a meat-eating dinosaur the size of a school bus with huge, sharp teeth!', clue:'Giant predators need lots of prey — this was a rich ecosystem full of life!'},
      {emoji:'🌴', name:'Cycad Plant Fossil', desc:'A spiky, palm-like plant that dinosaurs munched on for breakfast, lunch, and dinner.', clue:'Cycads need a warm, wet climate — this was a lush, steamy jungle!'},
    ]
  },
  { id:3, name:'Dakota Formation',      age:'~100 million years ago', color:'#d4b876', altColor:null,
    env:'Coastal Beaches and Shallow Sea',
    envDesc:'The ocean was creeping back in! Sandy beaches and tidal flats stretched across Utah. Dinosaurs walked along the shore while waves lapped at their feet.',
    fossils:[
      {emoji:'🐚', name:'Clam Shell Fossil',   desc:'A clam that burrowed into the sandy bottom of shallow coastal water.', clue:'Clams need water — this was a beach, bay, or shallow sea!'},
      {emoji:'👣', name:'Dinosaur Footprints', desc:'Three-toed tracks pressed into ancient mud right at the water\'s edge — perfectly preserved!', clue:'Footprints in mud near water = dinosaurs walking along a beach or riverbank!'},
      {emoji:'🌿', name:'Fern Leaf',           desc:'A fern perfectly preserved in sandy rock — you can see every tiny vein in the leaf.', clue:'Ferns need lots of moisture — water was very close by!'},
    ]
  },
  { id:4, name:'Kaiparowits Formation', age:'~65 million years ago',  color:'#8a7a6a', altColor:null,
    env:'River Floodplains with Forests',
    envDesc:'Wide rivers flooded the land each season, leaving rich soil perfect for forests. Dinosaurs still roamed here — but their time was almost up! Something big was about to change...',
    fossils:[
      {emoji:'🦴', name:'Dinosaur Bone Fragment', desc:'Part of a large dinosaur bone — one of the very LAST dinosaurs to live in Utah before the mass extinction.', clue:'Near the end of the dinosaurs\' time — a huge change was coming!'},
      {emoji:'🍃', name:'Leaf Fossil',            desc:'A plant leaf pressed flat in river sediment, perfectly preserved for 65 million years.', clue:'Leaves and trees mean a lush, wet environment with plenty of rain!'},
      {emoji:'🐢', name:'Turtle Shell',            desc:'A fossilized shell from a river turtle — like turtles you might see in Utah streams today, but ancient!', clue:'River turtles live in rivers — there was definitely a river flowing here!'},
    ]
  },
];

// ── Canvas setup ─────────────────────────────────────────────────────────────
const cv = document.getElementById('cliff');
const cx = cv.getContext('2d');
const CW = cv.width, CH = cv.height;   // 420 × 540
const LP = 46, LH = 100, TALUS = 20;  // left pad, layer height, talus space at bottom
const iy = i => CH - (i+1)*LH - TALUS; // y-top of layer i (0=oldest/bottom, 4=newest/top)

if(!CanvasRenderingContext2D.prototype.roundRect)
  CanvasRenderingContext2D.prototype.roundRect=function(x,y,w,h,r){this.moveTo(x+r,y);this.arcTo(x+w,y,x+w,y+r,r);this.arcTo(x+w,y+h,x+w-r,y+h,r);this.arcTo(x,y+h,x,y+h-r,r);this.arcTo(x,y,x+r,y,r);this.closePath();};

const discovered = new Set();
let hoveredLayer=-1, selectedLayer=-1;

// ── Pre-compute jagged right cliff edge (deterministic sine-wave blend) ──────
// Harder rock (Morrison, id=2) protrudes more; softer shale is more recessed.
const PROTRUDE = [2, 8, 22, 5, 0]; // per-layer protrusion offsets
const EDGE = Array.from({length:CH+2}, (_,y) => {
  const li = Math.min(Math.max(Math.floor((CH-TALUS-y)/LH), 0), LAYERS.length-1);
  const jag = Math.sin(y*.058)*14 + Math.sin(y*.17+.9)*9 + Math.sin(y*.41+.4)*5 + Math.sin(y*.88+1.2)*3;
  return Math.round(CW - 28 + PROTRUDE[li] - Math.max(0, jag));
});

// ── Background: sky, mesas, desert floor ─────────────────────────────────────
function drawBackground(){
  const sg = cx.createLinearGradient(0,0,0,220);
  sg.addColorStop(0,'#5ba8cc'); sg.addColorStop(1,'#b8dff0');
  cx.fillStyle=sg; cx.fillRect(0,0,CW,220);
  const dg = cx.createLinearGradient(0,220,0,CH);
  dg.addColorStop(0,'#c4a060'); dg.addColorStop(1,'#b08040');
  cx.fillStyle=dg; cx.fillRect(0,220,CW,CH-220);
  // Mesa 1 (trapezoid silhouette, far right)
  cx.fillStyle='#b56040';
  cx.beginPath(); cx.moveTo(CW-120,CH-320); cx.lineTo(CW-105,CH-400); cx.lineTo(CW-8,CH-400); cx.lineTo(CW-8,CH-320); cx.closePath(); cx.fill();
  cx.fillStyle='#c87050'; cx.fillRect(CW-105,CH-412,97,14); // flat top highlight
  // Mesa 2 (smaller, closer)
  cx.fillStyle='#9a4e30';
  cx.beginPath(); cx.moveTo(CW-65,CH-265); cx.lineTo(CW-50,CH-318); cx.lineTo(CW-5,CH-318); cx.lineTo(CW-5,CH-265); cx.closePath(); cx.fill();
  cx.fillStyle='#aa6040'; cx.fillRect(CW-50,CH-326,45,10);
  // Mesa rock strata bands
  cx.fillStyle='rgba(90,35,15,0.4)'; cx.fillRect(CW-105,CH-398,97,8);
  cx.fillStyle='rgba(180,120,60,0.3)'; cx.fillRect(CW-105,CH-388,97,7);
  // Desert floor scattered rocks
  cx.fillStyle='#9a7848';
  [[CW-38,CH-52,9,6,0.2],[CW-22,CH-78,7,5,-0.1],[CW-8,CH-38,11,7,0.3]].forEach(([x,y,rx,ry,a])=>{
    cx.beginPath(); cx.ellipse(x,y,rx,ry,a,0,Math.PI*2); cx.fill();
  });
}

// ── Timeline axis ─────────────────────────────────────────────────────────────
function drawTimeline(){
  const mx=22; cx.save();
  cx.strokeStyle='#6b5020'; cx.lineWidth=2;
  cx.beginPath(); cx.moveTo(mx,CH-16); cx.lineTo(mx,22); cx.stroke();
  cx.fillStyle='#6b5020';
  cx.beginPath(); cx.moveTo(mx,14); cx.lineTo(mx-6,26); cx.lineTo(mx+6,26); cx.closePath(); cx.fill();
  cx.font='bold 8px Segoe UI,sans-serif'; cx.textAlign='center'; cx.fillStyle='#5c3a10';
  cx.fillText('NEW',mx,12); cx.fillText('OLD',mx,CH-4);
  cx.save(); cx.translate(9,CH/2); cx.rotate(-Math.PI/2);
  cx.font='7px Segoe UI,sans-serif'; cx.fillStyle='#7a5018'; cx.textAlign='center';
  cx.fillText('Millions of Years Ago',0,0);
  cx.restore(); cx.restore();
}

// ── Draw one rock layer with jagged clip, texture, and fossils ────────────────
function drawLayer(L, i){
  const y=iy(i), isDis=discovered.has(i), isHov=hoveredLayer===i, isSel=selectedLayer===i;

  // Clip to this layer's cliff shape: straight left edge LP, jagged right edge EDGE[y]
  cx.save();
  cx.beginPath(); cx.moveTo(LP, y);
  for(let ey=y; ey<=y+LH; ey+=2) cx.lineTo(EDGE[Math.min(ey,CH+1)], ey);
  cx.lineTo(LP, y+LH); cx.closePath(); cx.clip();

  // Base rock color
  cx.fillStyle=L.color; cx.fillRect(LP,y,CW,LH);
  // Morrison alternating strata bands
  if(L.altColor){ cx.fillStyle=L.altColor; for(let s=8;s<LH-4;s+=18) cx.fillRect(LP,y+s,CW,9); }

  // Rock grain: fine speckle pattern using deterministic dot placement
  cx.fillStyle='rgba(0,0,0,0.07)';
  for(let tx=LP+8;tx<CW;tx+=11) for(let ty=y+4;ty<y+LH-4;ty+=9) if((tx*3+ty*7)%11>6) cx.fillRect(tx,ty,2,2);
  // Lighter highlight speckles
  cx.fillStyle='rgba(255,255,255,0.06)';
  for(let tx=LP+14;tx<CW;tx+=13) for(let ty=y+7;ty<y+LH-7;ty+=11) if((tx*5+ty*11)%13>8) cx.fillRect(tx,ty,2,1);

  // Crack lines (older layers = more cracks)
  const cracks=[[LP+55,y+28,LP+70,y+62],[LP+138,y+16,LP+122,y+55],[LP+205,y+44,LP+222,y+80],[LP+288,y+20,LP+270,y+58],[LP+175,y+66,LP+192,y+94]];
  cx.strokeStyle='rgba(0,0,0,0.16)'; cx.lineWidth=0.9;
  cracks.slice(0,2+i).forEach(([x1,y1,x2,y2])=>{cx.beginPath();cx.moveTo(x1,y1);cx.lineTo(x2,y2);cx.stroke();});

  // Hover / selected highlight
  if(isHov||isSel){cx.fillStyle=isSel?'rgba(241,196,15,0.18)':'rgba(255,220,70,0.1)';cx.fillRect(LP,y,CW,LH);}

  // Fossils embedded in rock (shadow recess → emoji on top)
  const pos=[{x:.20,y:.42},{x:.36,y:.70},{x:.52,y:.33},{x:.66,y:.72},{x:.82,y:.42}];
  cx.textAlign='center';
  if(isDis){
    L.fossils.forEach((f,fi)=>{
      if(fi>=pos.length) return;
      const fx=LP+pos[fi].x*(CW-LP)*.78, fy=y+pos[fi].y*LH;
      cx.fillStyle='rgba(0,0,0,0.30)'; cx.beginPath(); cx.ellipse(fx+1,fy,13,10,0,0,Math.PI*2); cx.fill();
      cx.fillStyle='rgba(0,0,0,0.12)'; cx.beginPath(); cx.ellipse(fx,fy-1,17,13,0,0,Math.PI*2); cx.fill();
      cx.font='20px serif'; cx.fillText(f.emoji,fx,fy+7);
    });
  } else {
    cx.font='bold 13px Segoe UI,sans-serif'; cx.fillStyle='rgba(255,255,255,0.22)';
    cx.fillText('? ? ?', LP+(CW-LP)*.42, y+LH/2+5);
  }

  // Label pill — left side of cliff face, always inside clip
  cx.font='bold 9px Segoe UI,sans-serif';
  const nw=cx.measureText(L.name).width;
  cx.fillStyle='rgba(0,0,0,0.55)'; cx.beginPath(); cx.roundRect(LP+8,y+7,nw+10,15,4); cx.fill();
  cx.fillStyle='#fff'; cx.textAlign='left'; cx.fillText(L.name,LP+13,y+17);
  cx.font='8px Segoe UI,sans-serif'; cx.fillStyle='rgba(255,255,255,0.82)'; cx.fillText(L.age,LP+13,y+29);

  cx.restore(); // end clip

  // Wavy layer boundary line (outside clip so it runs full edge width)
  if(i>0){
    const sy=y+LH; cx.save(); cx.strokeStyle='rgba(0,0,0,0.42)'; cx.lineWidth=1.5;
    cx.beginPath(); cx.moveTo(LP,sy);
    for(let ex=LP; ex<=EDGE[Math.min(sy,CH+1)]; ex+=4) cx.lineTo(ex, sy+Math.sin(ex*.09)*1.5);
    cx.stroke(); cx.restore();
  }
}

// ── Rocky cap on top of cliff with desert plants ──────────────────────────────
function drawCap(){
  const by=iy(LAYERS.length-1); // top of top layer = bottom of cap (~20px)
  // Fill cap rock using EDGE values (same jagged profile continues upward)
  cx.save(); cx.fillStyle='#7a6a58';
  cx.beginPath(); cx.moveTo(LP,by);
  for(let ey=by; ey>=0; ey-=2) cx.lineTo(EDGE[Math.max(ey,0)], ey);
  cx.lineTo(LP,0); cx.closePath(); cx.fill();
  // Darker rock surface band
  cx.fillStyle='rgba(0,0,0,0.18)'; cx.fillRect(LP,0,CW,5);
  // Irregular rocky bumps along the top edge
  cx.fillStyle='#8a7868';
  [[LP+22,4,10,5],[LP+72,3,14,6],[LP+130,5,11,5],[LP+188,3,16,6],[LP+252,4,12,5]].forEach(([bx,by_,brx,bry])=>{
    cx.beginPath(); cx.ellipse(bx,by_+bry*.6,brx,bry,0,0,Math.PI*2); cx.fill();
  });
  // Grass tufts
  cx.strokeStyle='#4a6820'; cx.lineWidth=1.5;
  [[LP+28,6],[LP+94,5],[LP+162,4],[LP+238,6]].forEach(([x,py])=>{
    for(let g=-2;g<=2;g++){cx.beginPath();cx.moveTo(x+g*3,py+6);cx.lineTo(x+g*3+g,py-4-Math.abs(g)*2);cx.stroke();}
  });
  // Sagebrush clumps (two overlapping ellipses for each bush)
  [[LP+58,5,8],[LP+136,4,7],[LP+215,6,9]].forEach(([x,py,r])=>{
    cx.fillStyle='#607830'; cx.beginPath(); cx.ellipse(x,py+r*.6,r,r*.65,0,0,Math.PI*2); cx.fill();
    cx.fillStyle='#7a9840'; cx.beginPath(); cx.ellipse(x-3,py+r*.25,r*.6,r*.42,-.3,0,Math.PI*2); cx.fill();
  });
  cx.restore();
}

// ── Talus slope: fallen boulders and rubble at cliff base ────────────────────
function drawTalus(){
  const base=iy(0)+LH; // top of talus = bottom of oldest layer
  // Sandy talus slope fill
  cx.fillStyle='#8a7050';
  cx.beginPath(); cx.moveTo(LP,base); cx.lineTo(EDGE[Math.min(base,CH+1)],base);
  cx.lineTo(EDGE[CH+1]+8,CH); cx.lineTo(LP,CH); cx.closePath(); cx.fill();
  // Boulders with highlight
  [[LP+16,base+11,15,10,'#5a4838'],[LP+58,base+8,12,8,'#6a5840'],[LP+106,base+13,20,12,'#584838'],
   [LP+160,base+9,14,9,'#6a5840'],[LP+214,base+6,22,14,'#504038'],[LP+272,base+10,12,7,'#6a5840']]
    .forEach(([x,y,rx,ry,c])=>{
      cx.fillStyle=c; cx.beginPath(); cx.ellipse(x,y,rx,ry,.1,0,Math.PI*2); cx.fill();
      cx.fillStyle='rgba(255,255,255,0.12)'; cx.beginPath(); cx.ellipse(x-rx*.35,y-ry*.35,rx*.38,ry*.3,0,0,Math.PI*2); cx.fill();
    });
  // Scattered pebbles
  cx.fillStyle='#9a8870';
  for(let px=LP+6;px<LP+318;px+=16) cx.beginPath(), cx.arc(px, base+20+(px*13%7)*2, 2+(px%3), 0, Math.PI*2), cx.fill();
}

// ── Main draw call ────────────────────────────────────────────────────────────
function draw(){
  cx.clearRect(0,0,CW,CH);
  drawBackground();
  drawTimeline();
  LAYERS.forEach((L,i)=>drawLayer(L,i));
  drawCap();
  drawTalus();
}

// ── Event helpers ─────────────────────────────────────────────────────────────
function layerIdx(e){
  const r=cv.getBoundingClientRect();
  const i=Math.floor((CH-TALUS-(e.clientY-r.top)*CH/r.height)/LH);
  return (i>=0&&i<LAYERS.length)?i:-1;
}
cv.addEventListener('mousemove',e=>{
  const r=cv.getBoundingClientRect(), sx=CW/r.width, sy=CH/r.height;
  const ex=(e.clientX-r.left)*sx, ey=Math.round((e.clientY-r.top)*sy);
  hoveredLayer=(ex>=LP&&ex<=EDGE[Math.min(ey,CH+1)])?layerIdx(e):-1;
  cv.style.cursor=hoveredLayer>=0?'pointer':'default'; draw();
});
cv.addEventListener('mouseleave',()=>{hoveredLayer=-1;draw();});
cv.addEventListener('click',e=>{
  const r=cv.getBoundingClientRect();
  const ex=(e.clientX-r.left)*CW/r.width, ey=Math.round((e.clientY-r.top)*CH/r.height);
  if(ex<LP||ex>EDGE[Math.min(ey,CH+1)]) return;
  const i=layerIdx(e); if(i<0) return;
  selectedLayer=i;
  if(!discovered.has(i)){discovered.add(i);updateProgress();}
  showLayer(i); switchTab('finder'); draw();
});

// ── Panel: Fossil Finder ──────────────────────────────────────────────────────
function showLayer(i){
  const L=LAYERS[i];
  let h=`<div class="layer-hdr" style="background:${L.color}">
    <div class="lhdr-name">${L.name}</div>
    <div class="lhdr-age">📅 ${L.age}</div>
  </div><div class="fossils-wrap"><h3>🦴 Fossils Found Here:</h3>`;
  L.fossils.forEach(f=>{
    h+=`<div class="fossil-card"><span class="f-emoji">${f.emoji}</span>
      <div class="f-text"><div class="f-name">${f.name}</div>
      <div class="f-desc">${f.desc}</div>
      <div class="f-clue">🔍 ${f.clue}</div></div></div>`;
  });
  h+=`</div><details class="env-reveal"><summary>🤔 What was this place like?</summary>
    <div class="env-box"><strong>🌍 ${L.env}</strong><p>${L.envDesc}</p></div></details>`;
  document.getElementById('finderContent').innerHTML=h;
}

// ── Panel: Timeline ───────────────────────────────────────────────────────────
function buildTimeline(){
  let h='<p class="tl-note">🌟 The environment at this location <strong>CHANGED</strong> dramatically over millions of years!</p><div class="tl-wrap">';
  [...LAYERS].reverse().forEach(L=>{
    const f=discovered.has(L.id);
    h+=`<div class="tl-row ${f?'tl-found':'tl-locked'}">
      <div class="tl-dot" style="background:${L.color}"></div>
      <div><div class="tl-rname">${L.name} <span class="tl-rage">${L.age}</span></div>
      <div class="tl-renv">${f?'🌍 '+L.env:'🔒 Not yet discovered — click this layer on the cliff!'}</div></div>
    </div>`;
  });
  document.getElementById('timelineContent').innerHTML=h+'</div>';
}

// ── Progress + tabs ───────────────────────────────────────────────────────────
function updateProgress(){
  document.getElementById('exploreCount').textContent=discovered.size;
  let d=''; for(let i=0;i<LAYERS.length;i++) d+=discovered.has(i)?'✅':'⬜';
  document.getElementById('progressDots').textContent=' '+d;
  buildTimeline();
}
function switchTab(t){
  document.querySelectorAll('.tab-btn').forEach(b=>b.classList.toggle('active',b.dataset.tab===t));
  document.querySelectorAll('.tab-panel').forEach(p=>{p.classList.toggle('active',p.id==='tab-'+t);p.classList.toggle('hidden',p.id!=='tab-'+t);});
  if(t==='timeline') buildTimeline();
}

// ── Init ──────────────────────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded',()=>{
  document.querySelectorAll('.tab-btn').forEach(b=>b.addEventListener('click',()=>switchTab(b.dataset.tab)));
  document.querySelectorAll('[data-popup]').forEach(b=>b.addEventListener('click',()=>document.getElementById(b.dataset.popup).classList.remove('hidden')));
  document.querySelectorAll('[data-close]').forEach(b=>b.addEventListener('click',()=>document.getElementById(b.dataset.close).classList.add('hidden')));
  document.querySelectorAll('.popup').forEach(p=>p.addEventListener('click',e=>{if(e.target===p)p.classList.add('hidden');}));
  updateProgress(); draw();
});
