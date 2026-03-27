// Fossil Detective — Utah SEEd 4.1.3 & 4.1.4
'use strict';

// ── Language state ────────────────────────────────────────────────────────────
let lang = 'en';

// ── Translations ──────────────────────────────────────────────────────────────
const T = {
  en: {
    langBtn: 'Español',
    tabs: ['🔍 Fossil Finder', '📊 Timeline', '🏆 Mystery Challenge'],
    tlNew: 'NEW', tlOld: 'OLD', tlAxis: 'Millions of Years Ago',
    layersLabel: 'Layers explored: ',
    cliffTop: '⬆️ Most Recent (Newest)',
    cliffBot: '⬇️ Oldest',
    fossilsFound: '🦴 Fossils Found Here:',
    clickHint: '👆 Click any fossil card to see its modern relative!',
    envReveal: '🤔 What was this place like?',
    back: '← Back to Layer',
    tlNote: '🌟 The environment at this location <strong>CHANGED</strong> dramatically over millions of years!',
    tlLocked: '🔒 Not yet discovered — click this layer on the cliff!',
    cmpHeader: '✨ Then vs. Now ✨',
    cmpAncient: '🦴 Ancient Fossil',
    cmpModern: '🌍 Modern Relative',
    popup413h: 'Utah SEEd Standard 4.1.3',
    popup413p: 'Use fossils as clues to figure out what ancient organisms and environments were like!',
    popup414h: 'Utah SEEd Standard 4.1.4',
    popup414p: 'Look at patterns in rock layers and fossils to discover how environments changed over time!',
    mysQ: '🔍 Based on these fossils, what was this place like millions of years ago?',
    mysRound: 'Round', mysOf: 'of', mysScore: '⭐ Score:',
    mysCorrect: '🎉 <strong>Great detective work!</strong>',
    mysWrong: '🤔 <strong>Not quite!</strong> Hint:',
    mysNext: 'Next Round →', mysFinish: '🏆 See My Results!', mysTry: 'Try Again',
    resTitle: 'You identified', resOf: 'out of', resCorrectly: 'environments correctly!',
    resBadge: "You're a Master Fossil Detective! 🏅",
    resInsight: 'Look at how this ONE location changed over hundreds of millions of years:<br><br>🌊 Deep ocean → 🐠 Warm shallow ocean → 🌿 River valley → 🏖️ Coastal beach → 🌲 River floodplains<br><br>The rocks right here in Utah recorded all of it — one layer at a time!',
    mysPlay: '🔄 Play Again',
    vocabTitle: '📖 Vocabulary',
    factsTitle: '🌟 Fun Facts',
    vocab: [
      ['Fossil',         'The preserved remains or traces of an ancient organism found in rock.'],
      ['Rock Layer',     'A band of rock formed from sediment over time. Older layers are always at the bottom!'],
      ['Ancient',        'Something that existed very, very long ago — thousands or millions of years old.'],
      ['Organism',       'Any living thing — plants, animals, bacteria, and fungi are all organisms!'],
      ['Environment',    'The surroundings where an organism lives — land, water, climate, and other living things.'],
      ['Extinct',        'A type of organism that has completely died out and no longer exists anywhere on Earth.'],
      ['Paleontologist', 'A scientist who studies fossils to learn about ancient life and environments.'],
    ],
    facts: [
      'The Grand Staircase in southern Utah has one of the most complete fossil records on Earth — millions of years of history in the rocks!',
      'The oldest rock layers are always at the BOTTOM because they were deposited first, with new layers piling on top over millions of years.',
      'If you find ocean fossils on a mountain, that area was once underwater! Utah was covered by oceans multiple times in its history.',
    ],
  },
  es: {
    langBtn: 'English',
    tabs: ['🔍 Buscador de Fósiles', '📊 Línea de Tiempo', '🏆 Desafío Misterioso'],
    tlNew: 'NUEVO', tlOld: 'ANT.', tlAxis: 'Millones de Años Atrás',
    layersLabel: 'Capas exploradas: ',
    cliffTop: '⬆️ Más Reciente (Nuevo)',
    cliffBot: '⬇️ Más Antiguo',
    fossilsFound: '🦴 Fósiles Encontrados Aquí:',
    clickHint: '👆 ¡Haz clic en cualquier tarjeta de fósil para ver su pariente moderno!',
    envReveal: '🤔 ¿Cómo era este lugar?',
    back: '← Volver a la Capa',
    tlNote: '🌟 ¡El entorno de este lugar <strong>CAMBIÓ</strong> dramáticamente a lo largo de millones de años!',
    tlLocked: '🔒 Aún no descubierto — ¡haz clic en esta capa en el acantilado!',
    cmpHeader: '✨ Entonces vs. Ahora ✨',
    cmpAncient: '🦴 Fósil Antiguo',
    cmpModern: '🌍 Pariente Moderno',
    popup413h: 'Estándar Utah SEEd 4.1.3',
    popup413p: '¡Usa los fósiles como pistas para descubrir cómo eran los organismos y entornos antiguos!',
    popup414h: 'Estándar Utah SEEd 4.1.4',
    popup414p: '¡Observa los patrones en las capas de roca y los fósiles para descubrir cómo cambiaron los entornos con el tiempo!',
    mysQ: '🔍 Basándote en estos fósiles, ¿cómo era este lugar hace millones de años?',
    mysRound: 'Ronda', mysOf: 'de', mysScore: '⭐ Puntos:',
    mysCorrect: '🎉 <strong>¡Excelente trabajo de detective!</strong>',
    mysWrong: '🤔 <strong>¡No exactamente!</strong> Pista:',
    mysNext: 'Siguiente Ronda →', mysFinish: '🏆 ¡Ver Mis Resultados!', mysTry: 'Intentar de Nuevo',
    resTitle: 'Identificaste', resOf: 'de', resCorrectly: '¡entornos correctamente!',
    resBadge: '¡Eres un Maestro Detective de Fósiles! 🏅',
    resInsight: 'Mira cómo este UN lugar cambió durante cientos de millones de años:<br><br>🌊 Océano profundo → 🐠 Océano cálido poco profundo → 🌿 Valle fluvial → 🏖️ Playa costera → 🌲 Llanuras de inundación<br><br>¡Las rocas aquí mismo en Utah lo registraron todo — una capa a la vez!',
    mysPlay: '🔄 Jugar de Nuevo',
    vocabTitle: '📖 Vocabulario',
    factsTitle: '🌟 Datos Curiosos',
    vocab: [
      ['Fósil',          'Los restos conservados o rastros de un organismo antiguo encontrado en la roca.'],
      ['Capa de Roca',   '¡Una banda de roca formada por sedimentos con el tiempo. Las capas más antiguas siempre están en el fondo!'],
      ['Antiguo',        'Algo que existió hace mucho, mucho tiempo — miles o millones de años.'],
      ['Organismo',      '¡Cualquier ser vivo — las plantas, los animales, las bacterias y los hongos son todos organismos!'],
      ['Entorno',        'El ambiente donde vive un organismo — tierra, agua, clima y otros seres vivos.'],
      ['Extinto',        'Un tipo de organismo que ha desaparecido completamente y ya no existe en ninguna parte de la Tierra.'],
      ['Paleontólogo',   'Un científico que estudia los fósiles para aprender sobre la vida y los entornos antiguos.'],
    ],
    facts: [
      '¡La Gran Escalinata en el sur de Utah tiene uno de los registros fósiles más completos de la Tierra — millones de años de historia en las rocas!',
      'Las capas de roca más antiguas siempre están en la PARTE INFERIOR porque se depositaron primero, con capas nuevas apilándose encima a lo largo de millones de años.',
      '¡Si encuentras fósiles oceánicos en una montaña, esa área estuvo alguna vez bajo el agua! Utah estuvo cubierto por océanos múltiples veces en su historia.',
    ],
  },
};

// ── Layer data (index 0 = oldest/bottom, index 4 = newest/top) ──────────────
// compKey on each fossil drives the fossil-to-modern comparison in fossils.js
const LAYERS = [
  { id:0, name:'Bright Angel Shale',    age:'~500 million years ago', color:'#6a7a6a', altColor:null,
    env:'Deep Ancient Ocean',
    envDesc:'A vast, dark ocean covered all of Utah. Strange soft-bodied creatures crept along the muddy seafloor — millions of years before dinosaurs even existed!',
    fossils:[
      {emoji:'🪱', name:'Worm Burrow Trails', compKey:'worm',      desc:'Squiggly tunnels left by ancient worms crawling through soft mud on the seafloor.', clue:'Worm burrows mean a soft, muddy seafloor deep underwater!'},
      {emoji:'🦐', name:'Trilobite',          compKey:'trilobite', desc:'A hard-shelled sea creature shaped like a giant pill bug — up to a foot long!', clue:'Trilobites ONLY lived in ancient oceans — this place was definitely underwater!'},
    ]
  },
  { id:1, name:'Kaibab Limestone',      age:'~250 million years ago', color:'#e8dcc8', altColor:null,
    env:'Warm Shallow Ocean',
    envDesc:'A warm, clear tropical sea washed over Utah — like the Bahamas today! Coral reefs and colorful sea creatures filled the water from shore to shore.',
    fossils:[
      {emoji:'🦞', name:'Trilobite (warm water type)', compKey:'trilobite', desc:'A different kind of trilobite that loved warm, shallow water — very different from its deep-water cousins.', clue:'This trilobite lived in warm, shallow water — the ocean was getting warmer!'},
      {emoji:'🌸', name:'Sea Lily (Crinoid)',           compKey:'seaLily',  desc:'Looks like a flower, but it was actually an animal anchored to the seafloor! It waved its arms to catch food.', clue:'Sea lilies need clear, calm, shallow water — this was a tropical reef!'},
      {emoji:'🐚', name:'Brachiopod Shell',            compKey:'shell',    desc:'Two shells joined together — it LOOKS like a clam, but it\'s actually a completely different animal!', clue:'Brachiopods lived on shallow ocean floors — definitely underwater here!'},
    ]
  },
  { id:2, name:'Morrison Formation',    age:'~150 million years ago', color:'#c47a5a', altColor:'#a06040',
    env:'River Valleys with Lush Vegetation',
    envDesc:'No more ocean! Huge rivers carved through a warm, wet landscape. Giant dinosaurs like Allosaurus and Brachiosaurus roamed here — some of the biggest animals that ever walked the Earth!',
    fossils:[
      {emoji:'🦴', name:'Allosaurus Bone',    compKey:'dinosaur', desc:'A massive bone from Allosaurus — a meat-eating dinosaur the size of a school bus with huge, sharp teeth!', clue:'Giant predators need lots of prey — this was a rich ecosystem full of life!'},
      {emoji:'🌴', name:'Cycad Plant Fossil', compKey:'plant',    desc:'A spiky, palm-like plant that dinosaurs munched on for breakfast, lunch, and dinner.', clue:'Cycads need a warm, wet climate — this was a lush, steamy jungle!'},
    ]
  },
  { id:3, name:'Dakota Formation',      age:'~100 million years ago', color:'#d4b876', altColor:null,
    env:'Coastal Beaches and Shallow Sea',
    envDesc:'The ocean was creeping back in! Sandy beaches and tidal flats stretched across Utah. Dinosaurs walked along the shore while waves lapped at their feet.',
    fossils:[
      {emoji:'🐚', name:'Clam Shell Fossil',   compKey:'shell',    desc:'A clam that burrowed into the sandy bottom of shallow coastal water.', clue:'Clams need water — this was a beach, bay, or shallow sea!'},
      {emoji:'👣', name:'Dinosaur Footprints', compKey:'dinosaur', desc:'Three-toed tracks pressed into ancient mud right at the water\'s edge — perfectly preserved!', clue:'Footprints in mud near water = dinosaurs walking along a beach or riverbank!'},
      {emoji:'🌿', name:'Fern Leaf',           compKey:'plant',    desc:'A fern perfectly preserved in sandy rock — you can see every tiny vein in the leaf.', clue:'Ferns need lots of moisture — water was very close by!'},
    ]
  },
  { id:4, name:'Kaiparowits Formation', age:'~65 million years ago',  color:'#8a7a6a', altColor:null,
    env:'River Floodplains with Forests',
    envDesc:'Wide rivers flooded the land each season, leaving rich soil perfect for forests. Dinosaurs still roamed here — but their time was almost up! Something big was about to change...',
    fossils:[
      {emoji:'🦴', name:'Dinosaur Bone Fragment', compKey:'dinosaur', desc:'Part of a large dinosaur bone — one of the very LAST dinosaurs to live in Utah before the mass extinction.', clue:'Near the end of the dinosaurs\' time — a huge change was coming!'},
      {emoji:'🍃', name:'Leaf Fossil',            compKey:'plant',   desc:'A plant leaf pressed flat in river sediment, perfectly preserved for 65 million years.', clue:'Leaves and trees mean a lush, wet environment with plenty of rain!'},
      {emoji:'🐢', name:'Turtle Shell',            compKey:'turtle',  desc:'A fossilized shell from a river turtle — like turtles you might see in Utah streams today, but ancient!', clue:'River turtles live in rivers — there was definitely a river flowing here!'},
    ]
  },
];

// ── Spanish text for each layer (parallel to LAYERS) ─────────────────────────
const LAYERS_ES = [
  { name:'Lutita Bright Angel',     age:'~500 millones de años',
    env:'Océano Antiguo Profundo',
    envDesc:'Un vasto océano oscuro cubría todo Utah. Extrañas criaturas de cuerpo blando reptaban por el fondo lodoso del mar — ¡millones de años antes de que existieran los dinosaurios!',
    fossils:[
      {name:'Rastros de Gusanos', desc:'Túneles serpenteantes dejados por gusanos antiguos arrastrándose por el barro suave en el fondo del mar.', clue:'¡Los rastros de gusanos indican un fondo marino suave y lodoso bajo el agua!'},
      {name:'Trilobites',         desc:'¡Una criatura marina de caparazón duro con forma de cucaracha gigante — de hasta 30 centímetros de largo!', clue:'¡Los trilobites SOLO vivían en océanos antiguos — este lugar definitivamente estaba bajo el agua!'},
    ]
  },
  { name:'Caliza Kaibab',           age:'~250 millones de años',
    env:'Océano Cálido Poco Profundo',
    envDesc:'¡Un mar tropical cálido y transparente cubría Utah — como las Bahamas hoy! Arrecifes de coral y criaturas marinas coloridas llenaban el agua de costa a costa.',
    fossils:[
      {name:'Trilobites (tipo cálido)',  desc:'Un tipo diferente de trilobite que amaba el agua cálida y poco profunda — muy diferente de sus primos de aguas profundas.', clue:'¡Este trilobite vivía en agua cálida y poco profunda — el océano se estaba calentando!'},
      {name:'Lirio de Mar (Crinoide)',   desc:'¡Parece una flor, pero en realidad era un animal anclado al fondo marino! Agitaba sus brazos para atrapar comida.', clue:'¡Los lirios de mar necesitan agua clara, calmada y poco profunda — esto era un arrecife tropical!'},
      {name:'Concha de Braquiópodo',     desc:'Dos conchas unidas — ¡PARECE una almeja, pero en realidad es un animal completamente diferente!', clue:'¡Los braquiópodos vivían en el fondo de los océanos poco profundos — definitivamente estaba bajo el agua!'},
    ]
  },
  { name:'Formación Morrison',      age:'~150 millones de años',
    env:'Valles Fluviales con Vegetación Exuberante',
    envDesc:'¡No más océano! Enormes ríos atravesaban un paisaje cálido y húmedo. Dinosaurios gigantes como el Alosaurio y el Braquiosaurio deambulaban aquí — ¡algunos de los animales más grandes que jamás caminaron por la Tierra!',
    fossils:[
      {name:'Hueso de Alosaurio',      desc:'¡Un hueso enorme del Alosaurio — un dinosaurio carnívoro del tamaño de un autobús escolar con dientes grandes y afilados!', clue:'¡Los grandes depredadores necesitan mucha presa — esto era un ecosistema rico lleno de vida!'},
      {name:'Fósil de Planta Cícada',  desc:'Una planta espinosa parecida a una palmera que los dinosaurios comían en el desayuno, el almuerzo y la cena.', clue:'¡Las cícadas necesitan un clima cálido y húmedo — esto era una jungla exuberante y húmeda!'},
    ]
  },
  { name:'Formación Dakota',        age:'~100 millones de años',
    env:'Playas Costeras y Mar Poco Profundo',
    envDesc:'¡El océano estaba regresando! Playas arenosas y llanuras de marea se extendían por Utah. Los dinosaurios caminaban por la orilla mientras las olas lamían sus pies.',
    fossils:[
      {name:'Fósil de Almeja',          desc:'Una almeja que se enterraba en el fondo arenoso del agua costera poco profunda.', clue:'¡Las almejas necesitan agua — esto era una playa, bahía o mar poco profundo!'},
      {name:'Huellas de Dinosaurio',    desc:'Huellas de tres dedos presionadas en el barro antiguo justo en el borde del agua — ¡perfectamente conservadas!', clue:'¡Huellas en el barro cerca del agua = dinosaurios caminando por una playa o ribera!'},
      {name:'Hoja de Helecho',          desc:'Un helecho perfectamente conservado en roca arenosa — puedes ver cada pequeña vena en la hoja.', clue:'¡Los helechos necesitan mucha humedad — el agua estaba muy cerca!'},
    ]
  },
  { name:'Formación Kaiparowits',   age:'~65 millones de años',
    env:'Llanuras de Inundación con Bosques',
    envDesc:'Ríos anchos inundaban la tierra cada temporada, dejando suelo rico perfecto para los bosques. Los dinosaurios todavía deambulaban aquí — ¡pero su tiempo casi había terminado! Algo grande estaba a punto de cambiar...',
    fossils:[
      {name:'Fragmento de Hueso de Dinosaurio', desc:'Parte de un hueso grande de dinosaurio — uno de los ÚLTIMOS dinosaurios en vivir en Utah antes de la extinción masiva.', clue:'¡Cerca del fin del tiempo de los dinosaurios — un gran cambio se acercaba!'},
      {name:'Fósil de Hoja',                    desc:'Una hoja de planta aplastada en sedimento fluvial, perfectamente conservada durante 65 millones de años.', clue:'¡Las hojas y los árboles significan un entorno exuberante y húmedo con mucha lluvia!'},
      {name:'Caparazón de Tortuga',             desc:'Un caparazón fosilizado de una tortuga de río — ¡como las tortugas que podrías ver en los arroyos de Utah hoy, pero antigua!', clue:'¡Las tortugas de río viven en ríos — definitivamente había un río fluyendo aquí!'},
    ]
  },
];

// ── Helper: get layer text in current language ────────────────────────────────
function layerT(i) {
  const base = LAYERS[i];
  if (lang === 'en') return base;
  const t = LAYERS_ES[i];
  return {
    ...base,
    name: t.name, age: t.age, env: t.env, envDesc: t.envDesc,
    fossils: base.fossils.map((f, fi) => ({...f, ...t.fossils[fi]})),
  };
}

// ── Canvas setup ─────────────────────────────────────────────────────────────
const cv = document.getElementById('cliff');
const cx = cv.getContext('2d');
const CW = cv.width, CH = cv.height;   // 420 × 540
const LP = 46, LH = 100, TALUS = 20;  // left pad, layer height, talus space at bottom
const iy = i => CH - (i+1)*LH - TALUS; // y-top of layer i (0=oldest/bottom, 4=newest/top)

if (!CanvasRenderingContext2D.prototype.roundRect)
  CanvasRenderingContext2D.prototype.roundRect = function(x,y,w,h,r){this.moveTo(x+r,y);this.arcTo(x+w,y,x+w,y+r,r);this.arcTo(x+w,y+h,x+w-r,y+h,r);this.arcTo(x,y+h,x,y+h-r,r);this.arcTo(x,y,x+r,y,r);this.closePath();};

const discovered = new Set();
let hoveredLayer = -1, selectedLayer = -1;

// ── Pre-compute jagged right cliff edge (deterministic sine-wave blend) ──────
const PROTRUDE = [2, 8, 22, 5, 0];
const EDGE = Array.from({length:CH+2}, (_,y) => {
  const li = Math.min(Math.max(Math.floor((CH-TALUS-y)/LH), 0), LAYERS.length-1);
  const jag = Math.sin(y*.058)*14 + Math.sin(y*.17+.9)*9 + Math.sin(y*.41+.4)*5 + Math.sin(y*.88+1.2)*3;
  return Math.round(CW - 28 + PROTRUDE[li] - Math.max(0, jag));
});

// ── Background: sky, mesas, desert floor ─────────────────────────────────────
function drawBackground() {
  const sg = cx.createLinearGradient(0,0,0,220);
  sg.addColorStop(0,'#5ba8cc'); sg.addColorStop(1,'#b8dff0');
  cx.fillStyle=sg; cx.fillRect(0,0,CW,220);
  const dg = cx.createLinearGradient(0,220,0,CH);
  dg.addColorStop(0,'#c4a060'); dg.addColorStop(1,'#b08040');
  cx.fillStyle=dg; cx.fillRect(0,220,CW,CH-220);
  cx.fillStyle='#b56040';
  cx.beginPath(); cx.moveTo(CW-120,CH-320); cx.lineTo(CW-105,CH-400); cx.lineTo(CW-8,CH-400); cx.lineTo(CW-8,CH-320); cx.closePath(); cx.fill();
  cx.fillStyle='#c87050'; cx.fillRect(CW-105,CH-412,97,14);
  cx.fillStyle='#9a4e30';
  cx.beginPath(); cx.moveTo(CW-65,CH-265); cx.lineTo(CW-50,CH-318); cx.lineTo(CW-5,CH-318); cx.lineTo(CW-5,CH-265); cx.closePath(); cx.fill();
  cx.fillStyle='#aa6040'; cx.fillRect(CW-50,CH-326,45,10);
  cx.fillStyle='rgba(90,35,15,0.4)'; cx.fillRect(CW-105,CH-398,97,8);
  cx.fillStyle='rgba(180,120,60,0.3)'; cx.fillRect(CW-105,CH-388,97,7);
  cx.fillStyle='#9a7848';
  [[CW-38,CH-52,9,6,0.2],[CW-22,CH-78,7,5,-0.1],[CW-8,CH-38,11,7,0.3]].forEach(([x,y,rx,ry,a])=>{
    cx.beginPath(); cx.ellipse(x,y,rx,ry,a,0,Math.PI*2); cx.fill();
  });
}

// ── Timeline axis ─────────────────────────────────────────────────────────────
function drawTimeline() {
  const mx = 22; cx.save();
  cx.strokeStyle='#6b5020'; cx.lineWidth=2;
  cx.beginPath(); cx.moveTo(mx,CH-16); cx.lineTo(mx,22); cx.stroke();
  cx.fillStyle='#6b5020';
  cx.beginPath(); cx.moveTo(mx,14); cx.lineTo(mx-6,26); cx.lineTo(mx+6,26); cx.closePath(); cx.fill();
  cx.font='bold 8px Segoe UI,sans-serif'; cx.textAlign='center'; cx.fillStyle='#5c3a10';
  cx.fillText(T[lang].tlNew, mx, 12);
  cx.fillText(T[lang].tlOld, mx, CH-4);
  cx.save(); cx.translate(9,CH/2); cx.rotate(-Math.PI/2);
  cx.font='7px Segoe UI,sans-serif'; cx.fillStyle='#7a5018'; cx.textAlign='center';
  cx.fillText(T[lang].tlAxis, 0, 0);
  cx.restore(); cx.restore();
}

// ── Draw one rock layer with jagged clip, texture, and fossils ────────────────
function drawLayer(L, i) {
  const LT = layerT(i); // translated text for this layer
  const y = iy(i), isDis = discovered.has(i), isHov = hoveredLayer===i, isSel = selectedLayer===i;

  cx.save();
  cx.beginPath(); cx.moveTo(LP, y);
  for (let ey=y; ey<=y+LH; ey+=2) cx.lineTo(EDGE[Math.min(ey,CH+1)], ey);
  cx.lineTo(LP, y+LH); cx.closePath(); cx.clip();

  cx.fillStyle=L.color; cx.fillRect(LP,y,CW,LH);
  if (L.altColor) { cx.fillStyle=L.altColor; for (let s=8;s<LH-4;s+=18) cx.fillRect(LP,y+s,CW,9); }
  cx.fillStyle='rgba(0,0,0,0.07)';
  for (let tx=LP+8;tx<CW;tx+=11) for (let ty=y+4;ty<y+LH-4;ty+=9) if ((tx*3+ty*7)%11>6) cx.fillRect(tx,ty,2,2);
  cx.fillStyle='rgba(255,255,255,0.06)';
  for (let tx=LP+14;tx<CW;tx+=13) for (let ty=y+7;ty<y+LH-7;ty+=11) if ((tx*5+ty*11)%13>8) cx.fillRect(tx,ty,2,1);
  const cracks=[[LP+55,y+28,LP+70,y+62],[LP+138,y+16,LP+122,y+55],[LP+205,y+44,LP+222,y+80],[LP+288,y+20,LP+270,y+58],[LP+175,y+66,LP+192,y+94]];
  cx.strokeStyle='rgba(0,0,0,0.16)'; cx.lineWidth=0.9;
  cracks.slice(0,2+i).forEach(([x1,y1,x2,y2])=>{cx.beginPath();cx.moveTo(x1,y1);cx.lineTo(x2,y2);cx.stroke();});
  if (isHov||isSel) {cx.fillStyle=isSel?'rgba(241,196,15,0.18)':'rgba(255,220,70,0.1)';cx.fillRect(LP,y,CW,LH);}

  const pos=[{x:.13,y:.50},{x:.50,y:.74},{x:.78,y:.52},{x:.32,y:.72},{x:.64,y:.60}];
  cx.textAlign='center';
  if (isDis) {
    cx.textBaseline='middle';
    L.fossils.forEach((f,fi)=>{
      if (fi>=pos.length) return;
      const ey=Math.min(Math.round(y+pos[fi].y*LH), CH+1);
      const fw=(EDGE[ey]-LP)*0.80;
      const fx=LP+pos[fi].x*fw, fy=y+pos[fi].y*LH;
      cx.fillStyle='rgba(255,248,210,0.90)';
      cx.beginPath(); cx.arc(fx,fy,20,0,Math.PI*2); cx.fill();
      cx.strokeStyle='rgba(120,85,30,0.35)'; cx.lineWidth=1.5;
      cx.beginPath(); cx.arc(fx,fy,21,0,Math.PI*2); cx.stroke();
      cx.font='30px serif'; cx.fillText(f.emoji,fx,fy);
    });
    cx.textBaseline='alphabetic';
  } else {
    cx.font='bold 13px Segoe UI,sans-serif'; cx.fillStyle='rgba(255,255,255,0.22)';
    cx.fillText('? ? ?', LP+(CW-LP)*.42, y+LH/2+5);
  }

  // Label pill — uses translated name and age
  cx.font='bold 11px Segoe UI,sans-serif';
  const nw=cx.measureText(LT.name).width;
  cx.font='9px Segoe UI,sans-serif';
  const aw=cx.measureText(LT.age).width;
  const pw=Math.max(nw,aw)+14;
  cx.shadowColor='rgba(0,0,0,0.25)'; cx.shadowBlur=4; cx.shadowOffsetX=1; cx.shadowOffsetY=1;
  cx.fillStyle='rgba(252,238,190,0.96)';
  cx.beginPath(); cx.roundRect(LP+6,y+3,pw,24,5); cx.fill();
  cx.shadowBlur=0; cx.shadowOffsetX=0; cx.shadowOffsetY=0;
  cx.strokeStyle='rgba(140,90,20,0.55)'; cx.lineWidth=1;
  cx.beginPath(); cx.roundRect(LP+6,y+3,pw,24,5); cx.stroke();
  cx.font='bold 11px Segoe UI,sans-serif'; cx.fillStyle='#3d1f00'; cx.textAlign='left';
  cx.fillText(LT.name, LP+13, y+14);
  cx.font='9px Segoe UI,sans-serif'; cx.fillStyle='#6a3a10';
  cx.fillText(LT.age, LP+13, y+25);

  cx.restore();

  if (i>0) {
    const sy=y+LH; cx.save(); cx.strokeStyle='rgba(0,0,0,0.42)'; cx.lineWidth=1.5;
    cx.beginPath(); cx.moveTo(LP,sy);
    for (let ex=LP; ex<=EDGE[Math.min(sy,CH+1)]; ex+=4) cx.lineTo(ex, sy+Math.sin(ex*.09)*1.5);
    cx.stroke(); cx.restore();
  }
}

// ── Rocky cap on top of cliff with desert plants ──────────────────────────────
function drawCap() {
  const by=iy(LAYERS.length-1);
  cx.save(); cx.fillStyle='#7a6a58';
  cx.beginPath(); cx.moveTo(LP,by);
  for (let ey=by; ey>=0; ey-=2) cx.lineTo(EDGE[Math.max(ey,0)], ey);
  cx.lineTo(LP,0); cx.closePath(); cx.fill();
  cx.fillStyle='rgba(0,0,0,0.18)'; cx.fillRect(LP,0,CW,5);
  cx.fillStyle='#8a7868';
  [[LP+22,4,10,5],[LP+72,3,14,6],[LP+130,5,11,5],[LP+188,3,16,6],[LP+252,4,12,5]].forEach(([bx,by_,brx,bry])=>{
    cx.beginPath(); cx.ellipse(bx,by_+bry*.6,brx,bry,0,0,Math.PI*2); cx.fill();
  });
  cx.strokeStyle='#4a6820'; cx.lineWidth=1.5;
  [[LP+28,6],[LP+94,5],[LP+162,4],[LP+238,6]].forEach(([x,py])=>{
    for (let g=-2;g<=2;g++){cx.beginPath();cx.moveTo(x+g*3,py+6);cx.lineTo(x+g*3+g,py-4-Math.abs(g)*2);cx.stroke();}
  });
  [[LP+58,5,8],[LP+136,4,7],[LP+215,6,9]].forEach(([x,py,r])=>{
    cx.fillStyle='#607830'; cx.beginPath(); cx.ellipse(x,py+r*.6,r,r*.65,0,0,Math.PI*2); cx.fill();
    cx.fillStyle='#7a9840'; cx.beginPath(); cx.ellipse(x-3,py+r*.25,r*.6,r*.42,-.3,0,Math.PI*2); cx.fill();
  });
  cx.restore();
}

// ── Talus slope: fallen boulders and rubble at cliff base ────────────────────
function drawTalus() {
  const base=iy(0)+LH;
  cx.fillStyle='#8a7050';
  cx.beginPath(); cx.moveTo(LP,base); cx.lineTo(EDGE[Math.min(base,CH+1)],base);
  cx.lineTo(EDGE[CH+1]+8,CH); cx.lineTo(LP,CH); cx.closePath(); cx.fill();
  [[LP+16,base+11,15,10,'#5a4838'],[LP+58,base+8,12,8,'#6a5840'],[LP+106,base+13,20,12,'#584838'],
   [LP+160,base+9,14,9,'#6a5840'],[LP+214,base+6,22,14,'#504038'],[LP+272,base+10,12,7,'#6a5840']]
    .forEach(([x,y,rx,ry,c])=>{
      cx.fillStyle=c; cx.beginPath(); cx.ellipse(x,y,rx,ry,.1,0,Math.PI*2); cx.fill();
      cx.fillStyle='rgba(255,255,255,0.12)'; cx.beginPath(); cx.ellipse(x-rx*.35,y-ry*.35,rx*.38,ry*.3,0,0,Math.PI*2); cx.fill();
    });
  cx.fillStyle='#9a8870';
  for (let px=LP+6;px<LP+318;px+=16) cx.beginPath(), cx.arc(px, base+20+(px*13%7)*2, 2+(px%3), 0, Math.PI*2), cx.fill();
}

// ── Main draw call ────────────────────────────────────────────────────────────
function draw() {
  cx.clearRect(0,0,CW,CH);
  drawBackground();
  drawTimeline();
  LAYERS.forEach((L,i) => drawLayer(L,i));
  drawCap();
  drawTalus();
}

// ── Event helpers ─────────────────────────────────────────────────────────────
function layerIdx(e) {
  const r=cv.getBoundingClientRect();
  const i=Math.floor((CH-TALUS-(e.clientY-r.top)*CH/r.height)/LH);
  return (i>=0&&i<LAYERS.length)?i:-1;
}
cv.addEventListener('mousemove', e=>{
  const r=cv.getBoundingClientRect(), sx=CW/r.width, sy=CH/r.height;
  const ex=(e.clientX-r.left)*sx, ey=Math.round((e.clientY-r.top)*sy);
  hoveredLayer=(ex>=LP&&ex<=EDGE[Math.min(ey,CH+1)])?layerIdx(e):-1;
  cv.style.cursor=hoveredLayer>=0?'pointer':'default'; draw();
});
cv.addEventListener('mouseleave', ()=>{hoveredLayer=-1;draw();});
cv.addEventListener('click', e=>{
  const r=cv.getBoundingClientRect();
  const ex=(e.clientX-r.left)*CW/r.width, ey=Math.round((e.clientY-r.top)*CH/r.height);
  if (ex<LP||ex>EDGE[Math.min(ey,CH+1)]) return;
  const i=layerIdx(e); if (i<0) return;
  selectedLayer=i;
  if (!discovered.has(i)){discovered.add(i);updateProgress();}
  showLayer(i); switchTab('finder'); draw();
});

// ── Panel: Fossil Finder ──────────────────────────────────────────────────────
function showLayer(i) {
  if (i<0) return;
  const LT = layerT(i);
  const t = T[lang];
  let h=`<div class="layer-hdr" style="background:${LAYERS[i].color}">
    <div class="lhdr-name">${LT.name}</div>
    <div class="lhdr-age">📅 ${LT.age}</div>
  </div><div class="fossils-wrap"><h3>${t.fossilsFound}</h3>
  <p class="comp-hint">${t.clickHint}</p>`;
  LT.fossils.forEach(f=>{
    h+=`<div class="fossil-card" data-comp-key="${f.compKey}"><span class="f-emoji">${f.emoji}</span>
      <div class="f-text"><div class="f-name">${f.name}</div>
      <div class="f-desc">${f.desc}</div>
      <div class="f-clue">🔍 ${f.clue}</div></div></div>`;
  });
  h+=`</div><details class="env-reveal"><summary>${t.envReveal}</summary>
    <div class="env-box"><strong>🌍 ${LT.env}</strong><p>${LT.envDesc}</p></div></details>`;
  document.getElementById('finderContent').innerHTML=h;
}

// ── Panel: Timeline ───────────────────────────────────────────────────────────
function buildTimeline() {
  const t = T[lang];
  let h=`<p class="tl-note">${t.tlNote}</p><div class="tl-wrap">`;
  [...LAYERS].reverse().forEach(L=>{
    const LT = layerT(L.id);
    const f=discovered.has(L.id);
    h+=`<div class="tl-row ${f?'tl-found':'tl-locked'}">
      <div class="tl-dot" style="background:${L.color}"></div>
      <div><div class="tl-rname">${LT.name} <span class="tl-rage">${LT.age}</span></div>
      <div class="tl-renv">${f?'🌍 '+LT.env:t.tlLocked}</div></div>
    </div>`;
  });
  document.getElementById('timelineContent').innerHTML=h+'</div>';
}

// ── Vocab and Fun Facts (built by JS so language can switch) ─────────────────
function buildVocab() {
  const t = T[lang];
  document.getElementById('vocabSummary').textContent = t.vocabTitle;
  document.getElementById('vocabDl').innerHTML =
    t.vocab.map(([term, def]) => `<dt>${term}</dt><dd>${def}</dd>`).join('');
}
function buildFacts() {
  const t = T[lang];
  document.getElementById('factsSummary').textContent = t.factsTitle;
  document.getElementById('factsList').innerHTML =
    t.facts.map(f => `<li>${f}</li>`).join('');
}

// ── Progress + tabs ───────────────────────────────────────────────────────────
function updateProgress() {
  document.getElementById('exploreCount').textContent=discovered.size;
  document.getElementById('layersLabel').textContent=T[lang].layersLabel;
  let d=''; for (let i=0;i<LAYERS.length;i++) d+=discovered.has(i)?'✅':'⬜';
  document.getElementById('progressDots').textContent=' '+d;
  buildTimeline();
}
function switchTab(t) {
  document.querySelectorAll('.tab-btn').forEach(b=>b.classList.toggle('active',b.dataset.tab===t));
  document.querySelectorAll('.tab-panel').forEach(p=>{p.classList.toggle('active',p.id==='tab-'+t);p.classList.toggle('hidden',p.id!=='tab-'+t);});
  if (t==='timeline') buildTimeline();
}

// ── Apply language to all static DOM elements ─────────────────────────────────
function applyLang() {
  const t = T[lang];
  document.getElementById('langBtn').textContent = t.langBtn;
  // Tab buttons
  document.querySelectorAll('.tab-btn').forEach((b,i) => { b.textContent=t.tabs[i]; });
  // Cliff labels
  document.getElementById('cliffTopLabel').textContent = t.cliffTop;
  document.getElementById('cliffBotLabel').textContent = t.cliffBot;
  // Progress label
  document.getElementById('layersLabel').textContent = t.layersLabel;
  // Popups
  document.getElementById('p413h').textContent = t.popup413h;
  document.getElementById('p413p').textContent = t.popup413p;
  document.getElementById('p414h').textContent = t.popup414h;
  document.getElementById('p414p').textContent = t.popup414p;
  // Vocab + Facts
  buildVocab();
  buildFacts();
  // Redraw canvas (layer labels change language)
  draw();
  // Refresh whichever panel is currently visible
  if (selectedLayer>=0 && !document.getElementById('tab-finder').classList.contains('hidden')) {
    showLayer(selectedLayer);
  }
  if (!document.getElementById('tab-timeline').classList.contains('hidden')) {
    buildTimeline();
  }
  // If mystery tab is open, restart it in the new language
  if (!document.getElementById('tab-mystery').classList.contains('hidden')) {
    if (typeof mStarted !== 'undefined') { mStarted = false; }
    if (typeof initMystery === 'function') initMystery();
  } else {
    // Reset so next tab click starts fresh in new language
    if (typeof mStarted !== 'undefined') mStarted = false;
  }
}

// ── Init ──────────────────────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.tab-btn').forEach(b=>b.addEventListener('click',()=>switchTab(b.dataset.tab)));
  document.querySelectorAll('[data-popup]').forEach(b=>b.addEventListener('click',()=>document.getElementById(b.dataset.popup).classList.remove('hidden')));
  document.querySelectorAll('[data-close]').forEach(b=>b.addEventListener('click',()=>document.getElementById(b.dataset.close).classList.add('hidden')));
  document.querySelectorAll('.popup').forEach(p=>p.addEventListener('click',e=>{if(e.target===p)p.classList.add('hidden');}));
  document.getElementById('langBtn').addEventListener('click', () => {
    lang = lang==='en' ? 'es' : 'en';
    applyLang();
  });
  updateProgress(); draw();
});
