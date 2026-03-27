// Comparaciones Fósil-Moderno y Desafío Misterioso — Utah SEEd 4.1.3 & 4.1.4 (Español)
'use strict';

// ── Datos de comparación (solo español) ──────────────────────────────────────
const CMP = {
  trilobite: { ancient:'🦐', aName:'Fósil de Trilobites',       modern:'🦀', mName:'Cangrejo Herradura',
    text:'Los trilobites vivieron en océanos antiguos hace más de 250 millones de años. Están extintos ahora, pero su pariente vivo más cercano es el cangrejo herradura. ¡Ambos tienen caparazones duros exteriores y cuerpos segmentados!' },
  dinosaur:  { ancient:'🦴', aName:'Fósil de Dinosaurio',       modern:'🐦', mName:'Aves y Cocodrilos',
    text:'¡Los dinosaurios dominaron Utah por millones de años! Están extintos, pero sus parientes vivos más cercanos son las aves y los cocodrilianos. ¡Mira las patas de una gallina — esas son patas de dinosaurio!' },
  shell:     { ancient:'🐚', aName:'Fósil de Concha Antigua',   modern:'🦪', mName:'Almejas y Ostras Modernas',
    text:'¡Estos fósiles de conchas nos dicen que esta área alguna vez estuvo cubierta por un océano! Las almejas y ostras modernas se ven muy similares — algunas cosas no cambian mucho en millones de años.' },
  plant:     { ancient:'🌿', aName:'Fósil de Planta',            modern:'🌿', mName:'Helechos Modernos',
    text:'¡Este fósil de hoja se parece a los helechos que vemos hoy! Encontrar fósiles de plantas nos dice que el clima era lo suficientemente cálido y húmedo para que las plantas crecieran aquí.' },
  turtle:    { ancient:'🐢', aName:'Caparazón de Tortuga Fósil', modern:'🐢', mName:'Tortuga Moderna',
    text:'¡Las tortugas han existido por más de 200 millones de años! El diseño de su caparazón apenas ha cambiado. Encontrar un fósil de tortuga nos dice que había agua dulce cerca.' },
  seaLily:   { ancient:'🌸', aName:'Lirio de Mar (Crinoide)',   modern:'⭐', mName:'Estrellas de Mar y Erizos de Mar',
    text:'¡Los lirios de mar parecen plantas, pero en realidad son animales! Se anclaban al fondo marino y agitaban sus brazos para atrapar pequeños trozos de comida. Sus parientes hoy son las estrellas de mar y los erizos de mar. ¡Encontrar fósiles de lirios de mar significa que esta área tenía agua marina clara, cálida y poco profunda!' },
  worm:      { ancient:'🪱', aName:'Rastros de Gusanos',        modern:'🪱', mName:'Gusanos Marinos',
    text:'Estos túneles serpenteantes fueron hechos por gusanos antiguos que se enterraban en el barro suave en el fondo del mar. Hoy, los gusanos poliquetos hacen exactamente lo mismo en el barro oceánico. Estos se llaman "fósiles traza" — ¡muestran el COMPORTAMIENTO de los animales, no solo sus cuerpos!' },
};

// ── Mostrar comparación fósil-moderno ─────────────────────────────────────────
function showComparison(key) {
  const c = CMP[key]; if (!c) return;
  document.getElementById('finderContent').innerHTML = `
    <button class="back-btn" id="cmpBack">${T.back}</button>
    <div class="cmp-header">${T.cmpHeader}</div>
    <div class="cmp-row">
      <div class="cmp-side" id="cmpAncient">
        <span class="cmp-badge">${T.cmpAncient}</span>
        <span class="cmp-icon">${c.ancient}</span>
        <div class="cmp-name">${c.aName}</div>
      </div>
      <div class="cmp-arrow">⟶</div>
      <div class="cmp-side slide-right" id="cmpModern">
        <span class="cmp-badge">${T.cmpModern}</span>
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

// ── Datos del Desafío Misterioso (solo español) ───────────────────────────────
const ROUNDS = [
  { layer:'Lutita Bright Angel', color:'#6a7a6a',
    fossils:[{e:'🪱',n:'Rastros de Gusanos'},{e:'🦐',n:'Trilobites'}],
    choices:['Desierto seco con dunas de arena','Océano antiguo profundo','Selva tropical','Tundra congelada'],
    correct:1,
    clue:'Los trilobites y los rastros de gusanos solo se forman en sedimentos oceánicos. Los gusanos se entierran en el barro suave en el fondo marino profundo — ¡ni desierto ni bosque a la vista!',
    hint:'Mira el trilobite — ¿dónde vive una criatura con un caparazón duro y patas articuladas como esta?',
  },
  { layer:'Caliza Kaibab', color:'#e8dcc8',
    fossils:[{e:'🦞',n:'Trilobites'},{e:'🌸',n:'Lirio de Mar'},{e:'🐚',n:'Concha de Braquiópodo'}],
    choices:['Pradera de montaña','Valle fluvial','Océano cálido y poco profundo','Selva densa'],
    correct:2,
    clue:'Los lirios de mar necesitan agua clara, cálida y tranquila para anclarse. Los braquiópodos vivían en fondos oceánicos soleados y poco profundos. ¡Los tres fósiles juntos gritan "mar tropical"!',
    hint:'Una de estas criaturas se anclaba al fondo marino y agitaba sus brazos para atrapar comida. ¿Dónde estaría eso?',
  },
  { layer:'Formación Morrison', color:'#c47a5a',
    fossils:[{e:'🦴',n:'Hueso de Alosaurio'},{e:'🌴',n:'Planta Cícada'}],
    choices:['Glaciar congelado','Valles fluviales con vegetación exuberante','Playa arenosa','Océano profundo'],
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
    choices:['Fosa oceánica profunda','Desierto seco y árido','Llanuras de inundación con bosques','Cima de montaña alta'],
    correct:2,
    clue:'Los fósiles de hojas significan que los bosques crecieron aquí. Los caparazones de tortuga significan que los ríos estaban cerca. Los huesos de dinosaurio de esta era vivían cerca del agua. ¡Clásica llanura de inundación fluvial — y los últimos de los dinosaurios!',
    hint:'Las tortugas necesitan ríos. Las hojas necesitan lluvia y suelo. Junta estos dos — ¿qué tipo de entorno tiene tanto ríos COMO bosques?',
  },
];

// ── Estado del desafío ────────────────────────────────────────────────────────
let mRounds=[], mIdx=0, mScore=0, mWrong=false, mStarted=false;

function initMystery() {
  mStarted = true;
  mRounds = [...ROUNDS].sort(() => Math.random() - 0.5);
  mIdx = 0; mScore = 0; mWrong = false;
  showMysteryRound();
}

function showMysteryRound() {
  const r = mRounds[mIdx];
  const total = ROUNDS.length;
  const fossils = r.fossils.map(f => `<span class="mys-fossil">${f.e} ${f.n}</span>`).join('');
  const choices = r.choices.map((c, ci) =>
    `<button class="choice-btn" data-ci="${ci}">${String.fromCharCode(65+ci)}) ${c}</button>`
  ).join('');
  document.getElementById('tab-mystery').innerHTML = `
    <div class="mys-header">
      <span class="mys-round">${T.mysRound} ${mIdx+1} ${T.mysOf} ${total}</span>
      <span class="mys-score">${T.mysScore} ${mScore}/${total}</span>
    </div>
    <div class="mys-layer" style="background:${r.color}">
      <div class="mys-layer-name">${r.layer}</div>
      <div class="mys-fossils">${fossils}</div>
    </div>
    <p class="mys-question">${T.mysQ}</p>
    <div class="mys-choices">${choices}</div>
    <div class="mys-feedback hidden" id="mysFeedback"></div>`;
  document.querySelectorAll('.choice-btn').forEach(btn =>
    btn.addEventListener('click', () => checkAnswer(+btn.dataset.ci))
  );
}

function checkAnswer(ci) {
  const r = mRounds[mIdx];
  const total = ROUNDS.length;
  const fb = document.getElementById('mysFeedback');
  document.querySelectorAll('.choice-btn').forEach(b => b.disabled = true);
  if (ci === r.correct) {
    document.querySelectorAll('.choice-btn')[ci].classList.add('choice-correct');
    if (!mWrong) mScore++;
    mWrong = false;
    const isLast = mIdx >= total - 1;
    fb.className = 'mys-feedback correct';
    fb.innerHTML = `${T.mysCorrect} ${r.clue}
      <br><button class="mys-btn next" id="mysNext">${isLast ? T.mysFinish : T.mysNext}</button>`;
    document.getElementById('mysNext').addEventListener('click', () => {
      mIdx++; mIdx < total ? showMysteryRound() : showMysteryResults();
    });
  } else {
    document.querySelectorAll('.choice-btn')[ci].classList.add('choice-wrong');
    mWrong = true;
    fb.className = 'mys-feedback wrong';
    fb.innerHTML = `${T.mysWrong} ${r.hint}
      <br><button class="mys-btn retry" id="mysTry">${T.mysTry}</button>`;
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
    <div class="res-score">${perfect?'🏆':'🔍'} ${T.resTitle} <strong>${mScore} ${T.resOf} ${ROUNDS.length}</strong> ${T.resCorrectly}</div>
    ${perfect ? `<div class="res-badge">${T.resBadge}</div>` : ''}
    <div class="res-insight">${T.resInsight}</div>
    <div class="res-list">${rows}</div>
    <button class="mys-btn play" id="mysPlay" style="margin-top:14px">${T.mysPlay}</button>`;
  document.getElementById('mysPlay').addEventListener('click', initMystery);
}

// ── Init ──────────────────────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('finderContent').addEventListener('click', e => {
    const card = e.target.closest('[data-comp-key]');
    if (!card) return;
    showComparison(card.dataset.compKey);
  });
  document.querySelector('[data-tab="mystery"]').addEventListener('click', () => {
    if (!mStarted) initMystery();
  });
});
