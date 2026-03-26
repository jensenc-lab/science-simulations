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
const CW = cv.width, CH = cv.height;   // 420 × 500
const LP = 46, LH = 100, RW = CW - LP; // left padding, layer height, rock face width

if(!CanvasRenderingContext2D.prototype.roundRect)
  CanvasRenderingContext2D.prototype.roundRect=function(x,y,w,h,r){this.moveTo(x+r,y);this.arcTo(x+w,y,x+w,y+r,r);this.arcTo(x+w,y+h,x+w-r,y+h,r);this.arcTo(x,y+h,x,y+h-r,r);this.arcTo(x,y,x+r,y,r);this.closePath();};

const discovered = new Set();
let hoveredLayer = -1, selectedLayer = -1;
const iy = i => CH - (i + 1) * LH;  // y-position for layer i

// ── Drawing ──────────────────────────────────────────────────────────────────
function drawTimeline(){
  const mx = 22;
  cx.save();
  cx.strokeStyle = '#8b6914'; cx.lineWidth = 2;
  cx.beginPath(); cx.moveTo(mx, CH-14); cx.lineTo(mx, 22); cx.stroke();
  cx.fillStyle = '#8b6914';
  cx.beginPath(); cx.moveTo(mx,14); cx.lineTo(mx-6,26); cx.lineTo(mx+6,26); cx.closePath(); cx.fill();
  cx.font = 'bold 8px Segoe UI,sans-serif'; cx.textAlign = 'center'; cx.fillStyle = '#8b6914';
  cx.fillText('NEW', mx, 12);
  cx.fillText('OLD', mx, CH-2);
  cx.save(); cx.translate(10, CH/2); cx.rotate(-Math.PI/2);
  cx.font = '7px Segoe UI,sans-serif'; cx.fillStyle = '#a07820'; cx.textAlign = 'center';
  cx.fillText('Millions of Years Ago', 0, 0);
  cx.restore(); cx.restore();
}

function drawLayer(L, i){
  const y = iy(i);
  const isHov = hoveredLayer===i, isSel = selectedLayer===i, isDis = discovered.has(i);
  // Rock fill
  cx.fillStyle = L.color; cx.fillRect(LP, y, RW, LH);
  // Morrison stripes
  if(L.altColor){
    cx.fillStyle = L.altColor;
    for(let s=8; s<LH-4; s+=18) cx.fillRect(LP, y+s, RW, 9);
  }
  // Hover / selected glow
  if(isHov || isSel){
    cx.strokeStyle = isSel ? '#f1c40f' : 'rgba(255,210,60,0.7)';
    cx.lineWidth = isSel ? 3 : 2;
    cx.strokeRect(LP+1, y+1, RW-2, LH-2);
  }
  // Fossils or mystery hint
  cx.textAlign = 'center';
  if(isDis){
    cx.font = '22px serif';
    const pos = [{x:.12,y:.42},{x:.3,y:.68},{x:.5,y:.34},{x:.67,y:.72},{x:.83,y:.44}];
    L.fossils.forEach((f,fi)=>{ if(fi<pos.length) cx.fillText(f.emoji, LP+pos[fi].x*RW, y+pos[fi].y*LH); });
  } else {
    cx.font = 'bold 14px Segoe UI,sans-serif'; cx.fillStyle = 'rgba(255,255,255,0.28)';
    cx.fillText('? ? ?', LP + RW/2, y + LH/2 + 5);
  }
  // Name pill (top-right of layer)
  cx.font = 'bold 9px Segoe UI,sans-serif';
  const nameW = cx.measureText(L.name).width;
  cx.fillStyle = 'rgba(0,0,0,0.52)';
  cx.beginPath(); cx.roundRect(CW-nameW-16, y+5, nameW+10, 15, 4); cx.fill();
  cx.fillStyle = '#fff'; cx.textAlign = 'right'; cx.fillText(L.name, CW-8, y+15);
  cx.font = '8px Segoe UI,sans-serif'; cx.fillStyle = 'rgba(255,255,255,0.78)';
  cx.fillText(L.age, CW-8, y+27);
  // Layer separator
  if(i > 0){ cx.strokeStyle = 'rgba(0,0,0,0.4)'; cx.lineWidth = 1.5; cx.beginPath(); cx.moveTo(LP,y+LH); cx.lineTo(CW,y+LH); cx.stroke(); }
}

function draw(){ cx.clearRect(0,0,CW,CH); drawTimeline(); LAYERS.forEach((L,i)=>drawLayer(L,i)); }

// ── Event helpers ─────────────────────────────────────────────────────────────
function layerIdx(ey){
  const r = cv.getBoundingClientRect(), sy = CH/r.height;
  const i = Math.floor((CH - (ey-r.top)*sy) / LH);
  return (i>=0 && i<LAYERS.length) ? i : -1;
}
cv.addEventListener('mousemove', e=>{
  const r = cv.getBoundingClientRect(), x = (e.clientX-r.left)*CW/r.width;
  hoveredLayer = x < LP ? -1 : layerIdx(e.clientY);
  cv.style.cursor = hoveredLayer>=0 ? 'pointer' : 'default';
  draw();
});
cv.addEventListener('mouseleave', ()=>{ hoveredLayer=-1; draw(); });
cv.addEventListener('click', e=>{
  const r = cv.getBoundingClientRect();
  if((e.clientX-r.left)*CW/r.width < LP) return;
  const i = layerIdx(e.clientY); if(i<0) return;
  selectedLayer = i;
  if(!discovered.has(i)){ discovered.add(i); updateProgress(); }
  showLayer(i); switchTab('finder'); draw();
});

// ── Panel: Fossil Finder ──────────────────────────────────────────────────────
function showLayer(i){
  const L = LAYERS[i];
  let h = `<div class="layer-hdr" style="background:${L.color}">
    <div class="lhdr-name">${L.name}</div>
    <div class="lhdr-age">📅 ${L.age}</div>
  </div><div class="fossils-wrap"><h3>🦴 Fossils Found Here:</h3>`;
  L.fossils.forEach(f=>{
    h += `<div class="fossil-card"><span class="f-emoji">${f.emoji}</span>
      <div class="f-text"><div class="f-name">${f.name}</div>
      <div class="f-desc">${f.desc}</div>
      <div class="f-clue">🔍 ${f.clue}</div></div></div>`;
  });
  h += `</div><details class="env-reveal"><summary>🤔 What was this place like?</summary>
    <div class="env-box"><strong>🌍 ${L.env}</strong><p>${L.envDesc}</p></div></details>`;
  document.getElementById('finderContent').innerHTML = h;
}

// ── Panel: Timeline ───────────────────────────────────────────────────────────
function buildTimeline(){
  let h = '<p class="tl-note">🌟 The environment at this location <strong>CHANGED</strong> dramatically over millions of years!</p><div class="tl-wrap">';
  [...LAYERS].reverse().forEach(L=>{
    const f = discovered.has(L.id);
    h += `<div class="tl-row ${f?'tl-found':'tl-locked'}">
      <div class="tl-dot" style="background:${L.color}"></div>
      <div><div class="tl-rname">${L.name} <span class="tl-rage">${L.age}</span></div>
      <div class="tl-renv">${f ? '🌍 '+L.env : '🔒 Not yet discovered — click this layer on the cliff!'}</div></div>
    </div>`;
  });
  document.getElementById('timelineContent').innerHTML = h + '</div>';
}

// ── Progress + tabs ───────────────────────────────────────────────────────────
function updateProgress(){
  document.getElementById('exploreCount').textContent = discovered.size;
  let d = ''; for(let i=0; i<LAYERS.length; i++) d += discovered.has(i) ? '✅' : '⬜';
  document.getElementById('progressDots').textContent = ' '+d;
  buildTimeline();
}
function switchTab(t){
  document.querySelectorAll('.tab-btn').forEach(b=>b.classList.toggle('active', b.dataset.tab===t));
  document.querySelectorAll('.tab-panel').forEach(p=>{ p.classList.toggle('active',p.id==='tab-'+t); p.classList.toggle('hidden',p.id!=='tab-'+t); });
  if(t==='timeline') buildTimeline();
}

// ── Init ──────────────────────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', ()=>{
  document.querySelectorAll('.tab-btn').forEach(b=>b.addEventListener('click',()=>switchTab(b.dataset.tab)));
  document.querySelectorAll('[data-popup]').forEach(b=>b.addEventListener('click',()=>document.getElementById(b.dataset.popup).classList.remove('hidden')));
  document.querySelectorAll('[data-close]').forEach(b=>b.addEventListener('click',()=>document.getElementById(b.dataset.close).classList.add('hidden')));
  document.querySelectorAll('.popup').forEach(p=>p.addEventListener('click',e=>{ if(e.target===p) p.classList.add('hidden'); }));
  updateProgress(); draw();
});
