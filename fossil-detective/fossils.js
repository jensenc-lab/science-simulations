// Fossil-to-Modern Comparisons & Mystery Challenge — Utah SEEd 4.1.3 & 4.1.4
'use strict';

// ── Comparison data (English) ─────────────────────────────────────────────────
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

// ── Comparison data (Spanish) ─────────────────────────────────────────────────
const CMP_ES = {
  trilobite: { ancient:'🦐', aName:'Fósil de Trilobites',      modern:'🦀', mName:'Cangrejo Herradura',
    text:'¡Los trilobites vivieron en océanos antiguos durante más de 250 millones de años — luego desaparecieron para siempre! Su pariente vivo más cercano es el cangrejo herradura. Ambos tienen caparazones externos duros y cuerpos segmentados. ¡La próxima vez que veas un cangrejo herradura en una playa, estás viendo a un primo de uno de los animales más antiguos de la Tierra!' },
  dinosaur:  { ancient:'🦴', aName:'Fósil de Dinosaurio',      modern:'🐦', mName:'Aves y Cocodrilos',
    text:'¡Los dinosaurios dominaron Utah durante millones de años! Están extintos, pero mira a tu alrededor — ¡las aves SON dinosaurios! Los pollos, las águilas y los gorriones son todos dinosaurios vivos. Los cocodrilos también son primos cercanos. ¡La próxima vez que veas las patas escamosas de un pollo, recuerda: esas son patas de DINOSAURIO!' },
  shell:     { ancient:'🐚', aName:'Fósil de Concha Antigua',  modern:'🦪', mName:'Almejas y Ostras Modernas',
    text:'¡Estos fósiles de conchas prueban que Utah estuvo cubierto por un océano! Las almejas y ostras modernas se ven casi exactamente igual que estas conchas antiguas. Algunas cosas apenas cambian a lo largo de millones de años — ¡los científicos llaman a estas criaturas "fósiles vivientes"!' },
  plant:     { ancient:'🌿', aName:'Fósil de Planta',           modern:'🌿', mName:'Helechos Modernos',
    text:'¡Este fósil de planta se ve igual que los helechos que puedes encontrar en el bosque hoy! Los helechos son algunas de las plantas más antiguas de la Tierra — apenas han cambiado en más de 300 millones de años. Encontrar fósiles de plantas nos dice que el clima era lo suficientemente cálido y húmedo para que las plantas crecieran aquí.' },
  turtle:    { ancient:'🐢', aName:'Caparazón de Tortuga Fósil', modern:'🐢', mName:'Tortuga Moderna',
    text:'¡Las tortugas son las supervivientes definitivas! Su diseño de caparazón apenas ha cambiado en más de 200 millones de años. Esta tortuga fósil se ve casi idéntica a las tortugas que verías en un río de Utah hoy. ¡Encontrar fósiles de tortugas es una pista de que había agua dulce cerca!' },
  seaLily:   { ancient:'🌸', aName:'Lirio de Mar (Crinoide)',   modern:'⭐', mName:'Estrellas de Mar y Erizos de Mar',
    text:'¡Los lirios de mar parecen plantas, pero en realidad son animales! Se anclaban al fondo marino y agitaban sus brazos para atrapar pequeños trozos de comida. Sus parientes hoy son las estrellas de mar y los erizos de mar. ¡Encontrar fósiles de lirios de mar significa que esta área tenía agua marina clara, cálida y poco profunda!' },
  worm:      { ancient:'🪱', aName:'Rastros de Gusanos',        modern:'🪱', mName:'Gusanos Marinos',
    text:'Estos túneles serpenteantes fueron hechos por gusanos antiguos que se enterraban en el barro suave en el fondo del mar. Hoy, los gusanos poliquetos hacen exactamente lo mismo en el barro oceánico. Estos se llaman "fósiles traza" — ¡muestran el COMPORTAMIENTO de los animales, no solo sus cuerpos!' },
};

// ── Show fossil-to-modern comparison in the info panel ───────────────────────
function showComparison(key) {
  const cmpData = lang === 'en' ? CMP : CMP_ES;
  const c = cmpData[key]; if (!c) return;
  const t = T[lang];
  document.getElementById('finderContent').innerHTML = `
    <button class="back-btn" id="cmpBack">${t.back}</button>
    <div class="cmp-header">${t.cmpHeader}</div>
    <div class="cmp-row">
      <div class="cmp-side" id="cmpAncient">
        <span class="cmp-badge">${t.cmpAncient}</span>
        <span class="cmp-icon">${c.ancient}</span>
        <div class="cmp-name">${c.aName}</div>
      </div>
      <div class="cmp-arrow">⟶</div>
      <div class="cmp-side slide-right" id="cmpModern">
        <span class="cmp-badge">${t.cmpModern}</span>
        <span class="cmp-icon">${c.modern}</span>
        <div class="cmp-name">${c.mName}</div>
      </div>
    </div>
    <div class="cmp-text">${c.text}</div>`;
  document.getElementById('cmpBack').addEventListener('click', () => {
    if (typeof selectedLayer !== 'undefined' && selectedLayer >= 0) showLayer(selectedLayer);
  });
  requestAnimationFrame(() => requestAnimationFrame(() => {
    document.getElementById('cmpAncient')?.classList.add('slide-in');
    document.getElementById('cmpModern')?.classList.add('slide-in');
  }));
}

// ── Mystery Challenge data (English) ─────────────────────────────────────────
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

// ── Mystery Challenge data (Spanish) ─────────────────────────────────────────
const ROUNDS_ES = [
  { layer:'Lutita Bright Angel', color:'#6a7a6a',
    fossils:[{e:'🪱',n:'Rastros de Gusanos'},{e:'🦐',n:'Trilobites'}],
    choices:['Desierto seco con dunas de arena','Océano antiguo profundo','Selva tropical','Tundra helada'],
    correct:1,
    clue:'Los trilobites y los rastros de gusanos solo se forman en sedimentos oceánicos. Los gusanos se entierran en el barro suave en el fondo marino profundo — ¡ni desierto ni bosque a la vista!',
    hint:'Mira el trilobite — ¿dónde vive una criatura con un caparazón duro y patas articuladas como esta?',
  },
  { layer:'Caliza Kaibab', color:'#e8dcc8',
    fossils:[{e:'🦞',n:'Trilobites'},{e:'🌸',n:'Lirio de Mar'},{e:'🐚',n:'Concha de Braquiópodo'}],
    choices:['Prado de montaña','Valle fluvial','Océano cálido poco profundo','Jungla densa'],
    correct:2,
    clue:'Los lirios de mar necesitan agua clara, cálida y tranquila para anclarse. Los braquiópodos vivían en fondos oceánicos soleados y poco profundos. ¡Los tres fósiles juntos gritan "mar tropical"!',
    hint:'Una de estas criaturas se anclaba al fondo marino y agitaba sus brazos para atrapar comida. ¿Dónde estaría eso?',
  },
  { layer:'Formación Morrison', color:'#c47a5a',
    fossils:[{e:'🦴',n:'Hueso de Alosaurio'},{e:'🌴',n:'Planta Cícada'}],
    choices:['Glaciar helado','Valles fluviales con vegetación exuberante','Playa arenosa','Océano profundo'],
    correct:1,
    clue:'Las plantas cícadas necesitan suelo cálido y húmedo — no hielo ni agua salada. Dinosaurios gigantes deambulaban por riberas y bosques exuberantes. ¡Aquí no hay fósiles oceánicos!',
    hint:'Las plantas cícadas necesitan suelo cálido y húmedo. ¿Qué tipo de entorno tiene suelo cálido y húmedo Y es lo suficientemente grande para dinosaurios gigantes?',
  },
  { layer:'Formación Dakota', color:'#d4b876',
    fossils:[{e:'🐚',n:'Almeja'},{e:'👣',n:'Huellas de Dinosaurio'},{e:'🌿',n:'Hoja de Helecho'}],
    choices:['Playas costeras y mar poco profundo','Isla volcánica','Cueva subterránea','Campo de hielo ártico'],
    correct:0,
    clue:'Conchas de almeja en el barro + huellas de dinosaurio en el borde del agua + hojas de helecho que necesitan humedad = escena clásica de playa costera. ¡Los dinosaurios caminaban justo por la orilla!',
    hint:'Un fósil es una concha del agua, uno es una huella presionada en el BARRO cerca del agua, y uno es una planta que necesita humedad. ¿Qué lugar tiene los tres?',
  },
  { layer:'Formación Kaiparowits', color:'#8a7a6a',
    fossils:[{e:'🦴',n:'Hueso de Dinosaurio'},{e:'🍃',n:'Fósil de Hoja'},{e:'🐢',n:'Caparazón de Tortuga'}],
    choices:['Fosa oceánica profunda','Desierto árido y baldío','Llanuras de inundación con bosques','Cima de montaña alta'],
    correct:2,
    clue:'Los fósiles de hojas significan que los bosques crecieron aquí. Los caparazones de tortuga significan que los ríos estaban cerca. Los huesos de dinosaurio de esta era vivían cerca del agua. ¡Clásica llanura de inundación fluvial — y los últimos de los dinosaurios!',
    hint:'Las tortugas necesitan ríos. Las hojas necesitan lluvia y suelo. Junta estos dos — ¿qué tipo de entorno tiene tanto ríos COMO bosques?',
  },
];

// ── Mystery state ─────────────────────────────────────────────────────────────
let mRounds=[], mIdx=0, mScore=0, mWrong=false, mStarted=false;

function getRounds() { return lang === 'en' ? ROUNDS : ROUNDS_ES; }

function initMystery() {
  mStarted = true;
  mRounds = [...getRounds()].sort(() => Math.random() - 0.5);
  mIdx = 0; mScore = 0; mWrong = false;
  showMysteryRound();
}

function showMysteryRound() {
  const r = mRounds[mIdx];
  const t = T[lang];
  const total = getRounds().length;
  const fossils = r.fossils.map(f => `<span class="mys-fossil">${f.e} ${f.n}</span>`).join('');
  const choices = r.choices.map((c, ci) =>
    `<button class="choice-btn" data-ci="${ci}">${String.fromCharCode(65+ci)}) ${c}</button>`
  ).join('');
  document.getElementById('tab-mystery').innerHTML = `
    <div class="mys-header">
      <span class="mys-round">${t.mysRound} ${mIdx+1} ${t.mysOf} ${total}</span>
      <span class="mys-score">${t.mysScore} ${mScore}/${total}</span>
    </div>
    <div class="mys-layer" style="background:${r.color}">
      <div class="mys-layer-name">${r.layer}</div>
      <div class="mys-fossils">${fossils}</div>
    </div>
    <p class="mys-question">${t.mysQ}</p>
    <div class="mys-choices">${choices}</div>
    <div class="mys-feedback hidden" id="mysFeedback"></div>`;
  document.querySelectorAll('.choice-btn').forEach(btn =>
    btn.addEventListener('click', () => checkAnswer(+btn.dataset.ci))
  );
}

function checkAnswer(ci) {
  const r = mRounds[mIdx];
  const t = T[lang];
  const total = getRounds().length;
  const fb = document.getElementById('mysFeedback');
  document.querySelectorAll('.choice-btn').forEach(b => b.disabled = true);
  if (ci === r.correct) {
    document.querySelectorAll('.choice-btn')[ci].classList.add('choice-correct');
    if (!mWrong) mScore++;
    mWrong = false;
    const isLast = mIdx >= total - 1;
    fb.className = 'mys-feedback correct';
    fb.innerHTML = `${t.mysCorrect} ${r.clue}
      <br><button class="mys-btn next" id="mysNext">${isLast ? t.mysFinish : t.mysNext}</button>`;
    document.getElementById('mysNext').addEventListener('click', () => {
      mIdx++; mIdx < total ? showMysteryRound() : showMysteryResults();
    });
  } else {
    document.querySelectorAll('.choice-btn')[ci].classList.add('choice-wrong');
    mWrong = true;
    fb.className = 'mys-feedback wrong';
    fb.innerHTML = `${t.mysWrong} ${r.hint}
      <br><button class="mys-btn retry" id="mysTry">${t.mysTry}</button>`;
    document.getElementById('mysTry').addEventListener('click', showMysteryRound);
  }
}

function showMysteryResults() {
  const t = T[lang];
  const rounds = getRounds();
  const perfect = mScore === rounds.length;
  const rows = rounds.map(r =>
    `<div class="res-row"><div class="res-dot" style="background:${r.color}"></div>
     <div>${r.layer} — ${r.fossils.map(f=>f.e).join(' ')}</div></div>`
  ).join('');
  document.getElementById('tab-mystery').innerHTML = `
    <div class="res-score">${perfect?'🏆':'🔍'} ${t.resTitle} <strong>${mScore} ${t.resOf} ${rounds.length}</strong> ${t.resCorrectly}</div>
    ${perfect ? `<div class="res-badge">${t.resBadge}</div>` : ''}
    <div class="res-insight">${t.resInsight}</div>
    <div class="res-list">${rows}</div>
    <button class="mys-btn play" id="mysPlay" style="margin-top:14px">${t.mysPlay}</button>`;
  document.getElementById('mysPlay').addEventListener('click', initMystery);
}

// ── Init ──────────────────────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  // Delegated click: fossil cards in info panel → show comparison (uses data-comp-key)
  document.getElementById('finderContent').addEventListener('click', e => {
    const card = e.target.closest('[data-comp-key]');
    if (!card) return;
    showComparison(card.dataset.compKey);
  });
  // Launch mystery on first click of tab 3; re-init on language change
  document.querySelector('[data-tab="mystery"]').addEventListener('click', () => {
    // Always re-init if language changed since last play, or if never started
    if (!mStarted) initMystery();
  });
});
