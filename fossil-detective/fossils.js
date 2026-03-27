// Fossil-to-Modern Comparisons & Mystery Challenge — Utah SEEd 4.1.3 & 4.1.4
'use strict';

// ── Fossil name → comparison key ──────────────────────────────────────────────
const NAME_TO_COMP = {
  'Trilobite':'trilobite', 'Trilobite (warm water type)':'trilobite', 'Trilobite (different type)':'trilobite',
  'Allosaurus Bone':'dinosaur', 'Dinosaur Bone Fragment':'dinosaur', 'Dinosaur Footprints':'dinosaur',
  'Clam Shell Fossil':'shell', 'Brachiopod Shell':'shell',
  'Cycad Plant Fossil':'plant', 'Fern Leaf':'plant', 'Leaf Fossil':'plant',
  'Turtle Shell':'turtle', 'Sea Lily (Crinoid)':'seaLily', 'Worm Burrow Trails':'worm',
};

// ── Comparison data ───────────────────────────────────────────────────────────
const CMP = {
  trilobite: { ancient:'🦐', aName:'Trilobite Fossil',    modern:'🦀', mName:'Horseshoe Crab',
    text:'Trilobites lived in ancient oceans for over 250 million years — then disappeared forever. Their closest living relative is the horseshoe crab! Both have hard outer shells and segmented bodies. Next time you see a horseshoe crab on a beach, you\'re looking at a cousin of one of Earth\'s oldest animals!' },
  dinosaur:  { ancient:'🦴', aName:'Dinosaur Fossil',     modern:'🐦', mName:'Birds & Crocodiles',
    text:'Dinosaurs ruled Utah for millions of years! They\'re extinct, but look around — birds ARE dinosaurs! Chickens, eagles, and sparrows are all living dinosaurs. Crocodiles are also close cousins. The next time you see a chicken\'s scaly feet, remember: those are DINOSAUR feet!' },
  shell:     { ancient:'🐚', aName:'Ancient Shell Fossil', modern:'🦪', mName:'Modern Clams & Oysters',
    text:'These shell fossils prove that Utah was once covered by an ocean! Modern clams and oysters look almost exactly like these ancient shells. Some things barely change over millions of years — scientists call creatures like this "living fossils!"' },
  plant:     { ancient:'🌿', aName:'Plant Fossil',         modern:'🌿', mName:'Modern Ferns',
    text:'This plant fossil looks just like ferns you can find in the woods today! Ferns are some of Earth\'s oldest plants — they\'ve barely changed in over 300 million years. Finding plant fossils tells us the climate was warm and wet enough for plants to grow here.' },
  turtle:    { ancient:'🐢', aName:'Fossil Turtle Shell',  modern:'🐢', mName:'Modern Turtle',
    text:'Turtles are the ultimate survivors! Their shell design has barely changed in over 200 million years. This fossil turtle looks almost identical to turtles you\'d see in a Utah river today. Finding turtle fossils is a clue that freshwater was nearby!' },
  seaLily:   { ancient:'🌸', aName:'Sea Lily (Crinoid)',   modern:'⭐', mName:'Starfish & Sea Urchins',
    text:'Sea lilies look like plants, but they\'re actually animals! They anchored to the seafloor and waved their arms to catch tiny bits of food. Their relatives today are starfish and sea urchins. Finding sea lily fossils means this area had clear, warm, shallow seawater!' },
  worm:      { ancient:'🪱', aName:'Worm Burrow Trails',   modern:'🪱', mName:'Marine Worms',
    text:'These squiggly tunnels were made by ancient worms burrowing through soft mud on the seafloor. Today, polychaete (poly-KEY-tee) worms do the exact same thing in ocean mud. These are called "trace fossils" — they show animal BEHAVIOR, not just bodies!' },
};

// ── Show fossil-to-modern comparison in the info panel ───────────────────────
function showComparison(key) {
  const c = CMP[key]; if (!c) return;
  document.getElementById('finderContent').innerHTML = `
    <button class="back-btn" id="cmpBack">← Back to Layer</button>
    <div class="cmp-header">✨ Then vs. Now ✨</div>
    <div class="cmp-row">
      <div class="cmp-side" id="cmpAncient">
        <span class="cmp-badge">🦴 Ancient Fossil</span>
        <span class="cmp-icon">${c.ancient}</span>
        <div class="cmp-name">${c.aName}</div>
      </div>
      <div class="cmp-arrow">⟶</div>
      <div class="cmp-side slide-right" id="cmpModern">
        <span class="cmp-badge">🌍 Modern Relative</span>
        <span class="cmp-icon">${c.modern}</span>
        <div class="cmp-name">${c.mName}</div>
      </div>
    </div>
    <div class="cmp-text">${c.text}</div>`;
  document.getElementById('cmpBack').addEventListener('click', () => {
    if (typeof selectedLayer !== 'undefined' && selectedLayer >= 0) showLayer(selectedLayer);
  });
  // Double rAF ensures initial transform/opacity state is painted before transition fires
  requestAnimationFrame(() => requestAnimationFrame(() => {
    document.getElementById('cmpAncient')?.classList.add('slide-in');
    document.getElementById('cmpModern')?.classList.add('slide-in');
  }));
}

// ── Mystery Challenge data ────────────────────────────────────────────────────
const ROUNDS = [
  { layer:'Bright Angel Shale', color:'#6a7a6a',
    fossils:[{e:'🪱',n:'Worm Burrow Trails'},{e:'🦐',n:'Trilobite'}],
    choices:['Dry desert with sand dunes','Deep ancient ocean','Tropical rainforest','Frozen tundra'],
    correct:1,
    clue:'Trilobites and worm burrows only form in ocean sediment. Worms burrow through soft mud on the deep seafloor — no desert or forest in sight!',
    hint:'Look at the trilobite — where does a creature with a hard shell and jointed legs like this live?',
  },
  { layer:'Kaibab Limestone', color:'#e8dcc8',
    fossils:[{e:'🦞',n:'Trilobite'},{e:'🌸',n:'Sea Lily'},{e:'🐚',n:'Brachiopod Shell'}],
    choices:['Mountain meadow','River valley','Warm shallow ocean','Dense jungle'],
    correct:2,
    clue:'Sea lilies need clear, warm, calm water to anchor to. Brachiopods lived on sunny, shallow ocean floors. All three fossils together shout "tropical sea!"',
    hint:'One of these creatures anchored to the seafloor and waved its arms to catch food. Where would that be?',
  },
  { layer:'Morrison Formation', color:'#c47a5a',
    fossils:[{e:'🦴',n:'Allosaurus Bone'},{e:'🌴',n:'Cycad Plant'}],
    choices:['Frozen glacier','River valleys with lush vegetation','Sandy beach','Deep ocean'],
    correct:1,
    clue:'Cycad plants need warm, wet soil — not ice or salt water. Giant dinosaurs roamed lush riverbanks and forests. No ocean fossils here at all!',
    hint:'Cycad plants need warm, wet soil. What kind of environment has warm, wet soil AND is big enough for giant dinosaurs?',
  },
  { layer:'Dakota Formation', color:'#d4b876',
    fossils:[{e:'🐚',n:'Clam Shell'},{e:'👣',n:'Dinosaur Footprints'},{e:'🌿',n:'Fern Leaf'}],
    choices:['Coastal beaches and shallow sea','Volcanic island','Underground cave','Arctic ice field'],
    correct:0,
    clue:'Clam shells in mud + dinosaur footprints at the water\'s edge + fern leaves needing moisture = classic coastal beach scene. Dinosaurs walked right along the shore!',
    hint:'One fossil is a shell from the water, one is a footprint pressed in MUD near water, and one is a plant that needs moisture. What place has all three?',
  },
  { layer:'Kaiparowits Formation', color:'#8a7a6a',
    fossils:[{e:'🦴',n:'Dinosaur Bone'},{e:'🍃',n:'Leaf Fossil'},{e:'🐢',n:'Turtle Shell'}],
    choices:['Deep ocean trench','Dry barren desert','River floodplains with forests','High mountain peak'],
    correct:2,
    clue:'Leaf fossils mean forests grew here. Turtle shells mean rivers were nearby. Dinosaur bones from this era lived near water. Classic river floodplain — and the last of the dinosaurs!',
    hint:'Turtles need rivers. Leaves need rain and soil. Put those two together — what kind of environment has both rivers AND forests?',
  },
];

// ── Mystery state ─────────────────────────────────────────────────────────────
let mRounds=[], mIdx=0, mScore=0, mWrong=false, mStarted=false;

function initMystery() {
  mRounds = [...ROUNDS].sort(() => Math.random() - 0.5);
  mIdx = 0; mScore = 0; mWrong = false;
  showMysteryRound();
}

function showMysteryRound() {
  const r = mRounds[mIdx];
  const fossils = r.fossils.map(f => `<span class="mys-fossil">${f.e} ${f.n}</span>`).join('');
  const choices = r.choices.map((c, ci) =>
    `<button class="choice-btn" data-ci="${ci}">${String.fromCharCode(65+ci)}) ${c}</button>`
  ).join('');
  document.getElementById('tab-mystery').innerHTML = `
    <div class="mys-header">
      <span class="mys-round">Round ${mIdx+1} of ${mRounds.length}</span>
      <span class="mys-score">⭐ Score: ${mScore}/${mRounds.length}</span>
    </div>
    <div class="mys-layer" style="background:${r.color}">
      <div class="mys-layer-name">${r.layer}</div>
      <div class="mys-fossils">${fossils}</div>
    </div>
    <p class="mys-question">🔍 Based on these fossils, what was this place like millions of years ago?</p>
    <div class="mys-choices">${choices}</div>
    <div class="mys-feedback hidden" id="mysFeedback"></div>`;
  document.querySelectorAll('.choice-btn').forEach(btn =>
    btn.addEventListener('click', () => checkAnswer(+btn.dataset.ci))
  );
}

function checkAnswer(ci) {
  const r = mRounds[mIdx];
  const fb = document.getElementById('mysFeedback');
  document.querySelectorAll('.choice-btn').forEach(b => b.disabled = true);
  if (ci === r.correct) {
    document.querySelectorAll('.choice-btn')[ci].classList.add('choice-correct');
    if (!mWrong) mScore++;
    mWrong = false;
    const isLast = mIdx >= mRounds.length - 1;
    fb.className = 'mys-feedback correct';
    fb.innerHTML = `🎉 <strong>Great detective work!</strong> ${r.clue}
      <br><button class="mys-btn next" id="mysNext">${isLast ? '🏆 See My Results!' : 'Next Round →'}</button>`;
    document.getElementById('mysNext').addEventListener('click', () => {
      mIdx++; mIdx < mRounds.length ? showMysteryRound() : showMysteryResults();
    });
  } else {
    document.querySelectorAll('.choice-btn')[ci].classList.add('choice-wrong');
    mWrong = true;
    fb.className = 'mys-feedback wrong';
    fb.innerHTML = `🤔 <strong>Not quite!</strong> Hint: ${r.hint}
      <br><button class="mys-btn retry" id="mysTry">Try Again</button>`;
    document.getElementById('mysTry').addEventListener('click', showMysteryRound);
  }
}

function showMysteryResults() {
  const perfect = mScore === ROUNDS.length;
  const rows = ROUNDS.map(r =>
    `<div class="res-row"><div class="res-dot" style="background:${r.color}"></div>
     <div>${r.layer} — ${r.fossils.map(f=>f.e).join(' ')}</div></div>`
  ).join('');
  document.getElementById('tab-mystery').innerHTML = `
    <div class="res-score">${perfect?'🏆':'🔍'} You identified <strong>${mScore} out of ${ROUNDS.length}</strong> environments correctly!</div>
    ${perfect ? '<div class="res-badge">You\'re a Master Fossil Detective! 🏅</div>' : ''}
    <div class="res-insight">
      Look at how this ONE location changed over hundreds of millions of years:<br><br>
      🌊 Deep ocean → 🐠 Warm shallow ocean → 🌿 River valley → 🏖️ Coastal beach → 🌲 River floodplains<br><br>
      The rocks right here in Utah recorded all of it — one layer at a time!
    </div>
    <div class="res-list">${rows}</div>
    <button class="mys-btn play" id="mysPlay" style="margin-top:14px">🔄 Play Again</button>`;
  document.getElementById('mysPlay').addEventListener('click', initMystery);
}

// ── Init ──────────────────────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  // Delegated click: fossil cards in info panel → show comparison
  document.getElementById('finderContent').addEventListener('click', e => {
    const card = e.target.closest('[data-fossil-name]');
    if (!card) return;
    const key = NAME_TO_COMP[card.dataset.fossilName];
    if (key) showComparison(key);
  });
  // Launch mystery on first click of tab 3
  document.querySelector('[data-tab="mystery"]').addEventListener('click', () => {
    if (!mStarted) { mStarted = true; initMystery(); }
  });
});
