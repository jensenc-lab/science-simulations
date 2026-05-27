// data.js — organelle definitions for Cell Systems Lab (Utah SEEd 7.3.2).
// The `inSystem` field is the heart of the standard: it must explicitly
// name other organelles or inputs/outputs.
// CHALLENGES will be populated in Chunk A5.

const ORGANELLE_DATA = {
  'nucleus': {
    icon: '🧬',
    foundIn: 'both',
    en: {
      name: 'Nucleus',
      tagline: "The cell's control center",
      structure: "A large rounded organelle surrounded by its own membrane called the nuclear envelope. Inside, it holds the cell's DNA — the genetic instructions for everything the cell does. A denser region inside, the nucleolus, helps build ribosomes.",
      function: "The nucleus stores DNA and controls the cell's activities. When the cell needs to build a protein, the nucleus copies the matching DNA instructions into a messenger molecule (mRNA) and sends that copy out into the rest of the cell.",
      inSystem: "Without instructions from the nucleus, no other organelle would know what to do. The mRNA copies sent out by the nucleus tell the cell which proteins to build — including the proteins that mitochondria, chloroplasts, and the cell membrane all need to function."
    },
    es: {
      name: 'Núcleo',
      tagline: 'El centro de control de la célula',
      structure: 'Un organelo grande y redondeado rodeado por su propia membrana llamada envoltura nuclear. En su interior guarda el ADN de la célula — las instrucciones genéticas que dirigen todo lo que la célula hace. Una región más densa en su interior, el nucléolo, ayuda a construir los ribosomas.',
      function: 'El núcleo almacena el ADN y controla las actividades de la célula. Cuando la célula necesita construir una proteína, el núcleo copia las instrucciones del ADN correspondiente en una molécula mensajera (ARNm) y envía esa copia al resto de la célula.',
      inSystem: 'Sin instrucciones del núcleo, ningún otro organelo sabría qué hacer. Las copias de ARNm que envía el núcleo le indican a la célula qué proteínas construir — incluidas las proteínas que las mitocondrias, los cloroplastos y la membrana celular necesitan para funcionar.'
    }
  },
  'cell-membrane': {
    icon: '🚪',
    foundIn: 'both',
    en: {
      name: 'Cell Membrane',
      tagline: "The cell's gatekeeper",
      structure: "A thin, flexible boundary made of a double layer of fat molecules (a phospholipid bilayer), with protein channels embedded throughout. It wraps around the entire cell.",
      function: "Controls what enters and leaves the cell. Small molecules like oxygen and carbon dioxide can pass through directly. Larger molecules like glucose move through special protein channels. The membrane is selectively permeable — some things get through, others do not.",
      inSystem: "Every other organelle depends on the cell membrane. Mitochondria need oxygen and glucose that crossed the membrane in order to make energy. Chloroplasts need carbon dioxide and water that came in through the membrane. Waste products leave the cell the same way. Without the membrane, the cell could not control its own internal environment."
    },
    es: {
      name: 'Membrana celular',
      tagline: 'La portera de la célula',
      structure: 'Un borde delgado y flexible formado por una doble capa de moléculas de grasa (una bicapa fosfolipídica), con canales proteicos incrustados en toda su extensión. Rodea toda la célula.',
      function: 'Controla lo que entra y sale de la célula. Las moléculas pequeñas como el oxígeno y el dióxido de carbono pueden pasar directamente. Las moléculas más grandes como la glucosa atraviesan canales proteicos especiales. La membrana es selectivamente permeable — algunas cosas la atraviesan, otras no.',
      inSystem: 'Todos los demás organelos dependen de la membrana celular. Las mitocondrias necesitan el oxígeno y la glucosa que cruzaron la membrana para producir energía. Los cloroplastos necesitan el dióxido de carbono y el agua que entraron por la membrana. Los productos de desecho salen de la célula por el mismo camino. Sin la membrana, la célula no podría controlar su propio ambiente interno.'
    }
  },
  'cell-wall': {
    icon: '🧱',
    foundIn: 'plant',
    en: {
      name: 'Cell Wall',
      tagline: "The plant cell's protective frame",
      structure: "A rigid outer layer made mostly of cellulose, surrounding the cell membrane. It is much thicker and stronger than the membrane itself.",
      function: "Provides structural support and protection. The cell wall gives plant cells their boxy shape and helps plants stand upright. When a plant cell takes in water, the cell wall keeps it from bursting.",
      inSystem: "The cell wall works alongside the cell membrane but does not block it. Water and dissolved minerals pass through the wall freely, so the cell membrane can still do its transport job. Together they support the entire plant body — without cell walls, plants would collapse."
    },
    es: {
      name: 'Pared celular',
      tagline: 'El marco protector de la célula vegetal',
      structure: 'Una capa exterior rígida formada principalmente de celulosa, que rodea la membrana celular. Es mucho más gruesa y resistente que la propia membrana.',
      function: 'Proporciona soporte estructural y protección. La pared celular les da a las células vegetales su forma cuadrada característica y ayuda a las plantas a mantenerse erguidas. Cuando una célula vegetal absorbe agua, la pared celular evita que se rompa.',
      inSystem: 'La pared celular trabaja junto con la membrana celular pero no la bloquea. El agua y los minerales disueltos atraviesan la pared libremente, así que la membrana celular puede seguir haciendo su trabajo de transporte. Juntas sostienen todo el cuerpo de la planta — sin paredes celulares, las plantas se colapsarían.'
    }
  },
  'mitochondria': {
    icon: '⚡',
    foundIn: 'both',
    en: {
      name: 'Mitochondria',
      tagline: "The cell's powerhouse",
      structure: "Oval, bean-shaped organelles with two membranes. The inner membrane is folded into ridges called cristae, which give it more surface area for chemical reactions.",
      function: "Break down glucose using oxygen and release the stored energy. That energy is packaged into a molecule called ATP, which the rest of the cell uses as fuel. This whole process is called cellular respiration.",
      inSystem: "Mitochondria are the cell's energy hub. They use glucose — made by chloroplasts in plants, or taken in from food in animals — and oxygen that crossed the cell membrane. They release ATP for every other organelle to use, plus carbon dioxide and water as waste products."
    },
    es: {
      name: 'Mitocondrias',
      tagline: 'La central energética de la célula',
      structure: 'Organelos ovalados con forma de frijol que tienen dos membranas. La membrana interna está plegada en pliegues llamados crestas mitocondriales, que le dan más superficie para las reacciones químicas.',
      function: 'Descomponen la glucosa usando oxígeno y liberan la energía almacenada. Esa energía se empaca en una molécula llamada ATP, que el resto de la célula usa como combustible. A todo este proceso se le llama respiración celular.',
      inSystem: 'Las mitocondrias son el centro de energía de la célula. Usan glucosa — producida por los cloroplastos en las plantas, o tomada del alimento en los animales — y oxígeno que cruzó la membrana celular. Liberan ATP para que lo use cada uno de los otros organelos, además de dióxido de carbono y agua como productos de desecho.'
    }
  },
  'chloroplast': {
    icon: '🌞',
    foundIn: 'plant',
    en: {
      name: 'Chloroplasts',
      tagline: "The plant cell's solar panels",
      structure: "Lens-shaped green organelles containing stacks of disc-like structures called thylakoids. Chloroplasts are green because they contain chlorophyll, a pigment that captures sunlight.",
      function: "Use sunlight to make glucose from carbon dioxide and water. This process is photosynthesis, and it also releases oxygen as a byproduct. Chloroplasts are why plants can make their own food.",
      inSystem: "Chloroplasts are the food factories. They take in carbon dioxide and water that came through the cell membrane, plus sunlight from outside the cell, and produce glucose. That glucose feeds the mitochondria, which turn it into ATP for the whole cell. The oxygen they make leaves the cell through the membrane."
    },
    es: {
      name: 'Cloroplastos',
      tagline: 'Los paneles solares de la célula vegetal',
      structure: 'Organelos verdes con forma de lente que contienen pilas de estructuras en forma de disco llamadas tilacoides. Los cloroplastos son verdes porque contienen clorofila, un pigmento que captura la luz solar.',
      function: 'Usan la luz solar para fabricar glucosa a partir de dióxido de carbono y agua. Este proceso, la fotosíntesis, también libera oxígeno como subproducto. Los cloroplastos son la razón por la que las plantas pueden producir su propio alimento.',
      inSystem: 'Los cloroplastos son las fábricas de alimento. Toman el dióxido de carbono y el agua que entraron por la membrana celular, más la luz solar del exterior, y producen glucosa. Esa glucosa alimenta a las mitocondrias, que la convierten en ATP para toda la célula. El oxígeno que producen sale de la célula por la membrana.'
    }
  }
};

const CHALLENGES = [
  {
    id: 'power-outage',
    cellType: 'animal',
    brokenOrganelle: 'mitochondria',
    en: {
      title: 'Power Outage',
      scenario: "This cell is taking in plenty of glucose and oxygen — you can see them entering through the membrane. But no energy is reaching the rest of the cell. The nucleus has stopped sending out instructions, and the cell is starting to fail.",
      hint: "Watch the flows. What is missing? What organelle makes that?",
      explanation: "Mitochondria are the cell's energy makers. They take glucose and oxygen and produce ATP — the energy currency the rest of the cell depends on. With mitochondria offline, nothing else has the energy it needs to keep running."
    },
    es: {
      title: 'Apagón de energía',
      scenario: 'Esta célula está absorbiendo mucha glucosa y oxígeno — puedes verlos entrar por la membrana. Pero ninguna energía está llegando al resto de la célula. El núcleo dejó de enviar instrucciones y la célula está empezando a fallar.',
      hint: 'Observa los flujos. ¿Qué está faltando? ¿Qué organelo produce eso?',
      explanation: 'Las mitocondrias son las productoras de energía de la célula. Toman glucosa y oxígeno y producen ATP — la moneda energética de la que depende el resto de la célula. Con las mitocondrias fuera de servicio, nada más tiene la energía que necesita para seguir funcionando.'
    }
  },
  {
    id: 'lockdown',
    cellType: 'animal',
    brokenOrganelle: 'cell-membrane',
    en: {
      title: 'Lockdown',
      scenario: "Nothing is moving in or out of this cell. Glucose and oxygen can't reach the mitochondria. Waste isn't leaving either. After a few seconds, the mitochondria itself begins to fail.",
      hint: "Which organelle is responsible for what enters and leaves the cell?",
      explanation: "The cell membrane is the gatekeeper for everything entering and exiting. Disable it and every other organelle starves. This is why membrane damage is often fatal to a cell."
    },
    es: {
      title: 'Cierre total',
      scenario: 'Nada está entrando ni saliendo de esta célula. La glucosa y el oxígeno no pueden llegar a las mitocondrias. Los desechos tampoco salen. Después de unos segundos, hasta las mitocondrias comienzan a fallar.',
      hint: '¿Qué organelo es responsable de lo que entra y sale de la célula?',
      explanation: 'La membrana celular es la portera de todo lo que entra y sale. Si la desactivas, todos los demás organelos comienzan a quedarse en inanición. Por eso el daño a la membrana suele ser fatal para una célula.'
    }
  },
  {
    id: 'no-instructions',
    cellType: 'animal',
    brokenOrganelle: 'nucleus',
    en: {
      title: 'No Instructions',
      scenario: "Energy is being produced. Glucose and oxygen are flowing normally. But no mRNA is being sent out into the cytoplasm. The cell can no longer build new proteins or respond to its environment.",
      hint: "Which organelle stores DNA and sends out instructions for building proteins?",
      explanation: "The nucleus stores DNA and sends out mRNA copies of the instructions. Without it, the rest of the cell still functions for a while — but with no new proteins, it cannot maintain or repair itself for long."
    },
    es: {
      title: 'Sin instrucciones',
      scenario: 'Se está produciendo energía. La glucosa y el oxígeno fluyen normalmente. Pero no se está enviando ARNm hacia el citoplasma. La célula ya no puede construir nuevas proteínas ni responder a su entorno.',
      hint: '¿Qué organelo almacena el ADN y envía instrucciones para construir proteínas?',
      explanation: 'El núcleo almacena el ADN y envía copias de ARNm con las instrucciones. Sin él, el resto de la célula sigue funcionando un tiempo — pero sin proteínas nuevas, no puede mantenerse ni repararse por mucho tiempo.'
    }
  },
  {
    id: 'starving-in-sunlight',
    cellType: 'plant',
    brokenOrganelle: 'chloroplast',
    en: {
      title: 'Starving in Sunlight',
      scenario: "This plant cell is in bright sunlight. CO₂ and water are entering normally. But no glucose is being produced for the mitochondria, and the mitochondria is starting to starve.",
      hint: "In a plant cell, which organelle uses sunlight to make glucose?",
      explanation: "Chloroplasts are where photosynthesis happens — they combine sunlight, CO₂, and water to make glucose. Without working chloroplasts, the plant cell cannot make its own food, and everything downstream eventually starves."
    },
    es: {
      title: 'Hambruna bajo el sol',
      scenario: 'Esta célula vegetal está bajo luz solar intensa. El CO₂ y el agua están entrando normalmente. Pero no se está produciendo glucosa para las mitocondrias, y las mitocondrias están empezando a quedarse en inanición.',
      hint: 'En una célula vegetal, ¿qué organelo usa la luz solar para fabricar glucosa?',
      explanation: 'Los cloroplastos son donde ocurre la fotosíntesis — combinan luz solar, CO₂ y agua para producir glucosa. Sin cloroplastos funcionales, la célula vegetal no puede fabricar su propio alimento, y todo lo que viene después acaba sin combustible.'
    }
  },
  {
    id: 'collapsing-cell',
    cellType: 'plant',
    brokenOrganelle: 'cell-wall',
    en: {
      title: 'Collapsing Cell',
      scenario: "This plant cell has lost its rigid outer structure. Water and CO₂ are no longer able to enter properly. Soon the chloroplasts will run out of inputs.",
      hint: "What is the rigid outer structure unique to plant cells?",
      explanation: "The cell wall surrounds and supports the plant cell. It also lets water and dissolved gases pass through to reach the cell membrane. Without it, plant cells lose shape and the chloroplasts cannot get the raw materials they need."
    },
    es: {
      title: 'Célula colapsada',
      scenario: 'Esta célula vegetal perdió su estructura externa rígida. El agua y el CO₂ ya no pueden entrar bien. Pronto los cloroplastos se quedarán sin materiales de entrada.',
      hint: '¿Cuál es la estructura externa rígida que es exclusiva de las células vegetales?',
      explanation: 'La pared celular rodea y sostiene a la célula vegetal. También deja pasar el agua y los gases disueltos hasta la membrana celular. Sin ella, las células vegetales pierden su forma y los cloroplastos no pueden obtener los materiales que necesitan.'
    }
  },
  {
    id: 'hidden-problem',
    cellType: 'plant',
    brokenOrganelle: 'chloroplast',
    en: {
      title: 'The Hidden Problem',
      scenario: "Look closely. The mitochondria is starving — you can see it pulsing orange. ATP production has stopped. But the mitochondria itself isn't broken. Something upstream has failed. Find the REAL cause of the problem.",
      hint: "Mitochondria needs fuel to make ATP. In a plant cell, what supplies that fuel?",
      explanation: "Excellent system thinking! When chloroplasts stop producing glucose, mitochondria run out of fuel and can't make ATP. The mitochondria LOOKS broken, but it's actually starving from a failure upstream. This is the key lesson of the cell as a system: a symptom in one organelle can have its real cause somewhere else entirely."
    },
    es: {
      title: 'El problema oculto',
      scenario: 'Mira con atención. Las mitocondrias están en inanición — puedes verlas pulsar en color naranja. La producción de ATP se detuvo. Pero las mitocondrias en sí no están dañadas. Algo aguas arriba falló. Encuentra la CAUSA real del problema.',
      hint: 'Las mitocondrias necesitan combustible para producir ATP. En una célula vegetal, ¿qué les proporciona ese combustible?',
      explanation: '¡Excelente pensamiento sistémico! Cuando los cloroplastos dejan de producir glucosa, las mitocondrias se quedan sin combustible y no pueden producir ATP. Las mitocondrias PARECEN estar dañadas, pero en realidad están en inanición por una falla aguas arriba. Esta es la lección clave de la célula como un sistema: un síntoma en un organelo puede tener su causa real en un lugar completamente diferente.'
    }
  }
];

// ---- System View: particles and flows -----------------------------------
// Each flow declares which organelles must be working for it to run, plus
// a path of named waypoints. Waypoint names are resolved at render-time:
// fixed points come from FIXED_WAYPOINTS; organelle names resolve to a
// random instance position discovered from the SVG.

const PARTICLE_TYPES = {
  sunlight: { color: '#fde047', stroke: '#ca8a04', label: '☀',    size: 14 },
  co2:      { color: '#94a3b8', stroke: '#475569', label: 'CO₂',  size: 11 },
  h2o:      { color: '#3b82f6', stroke: '#1e40af', label: 'H₂O',  size: 11 },
  o2:       { color: '#7dd3fc', stroke: '#0369a1', label: 'O₂',   size: 10 },
  glucose:  { color: '#f59e0b', stroke: '#92400e', label: 'G',    size: 12 },
  atp:      { color: '#facc15', stroke: '#854d0e', label: 'ATP',  size: 12 },
  mrna:     { color: '#ec4899', stroke: '#9d174d', label: 'mRNA', size: 11 }
};

const PARTICLE_NAMES = {
  sunlight: 'Sunlight',
  co2:      'Carbon dioxide',
  h2o:      'Water',
  o2:       'Oxygen',
  glucose:  'Glucose',
  atp:      'ATP energy',
  mrna:     'mRNA'
};

const FIXED_WAYPOINTS = {
  'outside-left':    { x: 30,  y: 250 },
  'outside-right':   { x: 570, y: 250 },
  'outside-top':     { x: 300, y: 25  },
  'outside-bottom':  { x: 300, y: 475 },
  'membrane-left':   { x: 90,  y: 250 },
  'membrane-right':  { x: 510, y: 250 },
  'membrane-top':    { x: 300, y: 85  },
  'membrane-bottom': { x: 300, y: 415 },
  'cytoplasm':       { x: 200, y: 200 }
};

const SYSTEM_FLOWS = {
  animal: [
    { id: 'glucose-in', type: 'glucose', label: 'Glucose in',  spawnEvery: 2400, requires: ['cell-membrane'],                  path: ['outside-left',  'membrane-left',   'mitochondria'] },
    { id: 'o2-in',      type: 'o2',      label: 'O₂ in',       spawnEvery: 2400, requires: ['cell-membrane'],                  path: ['outside-right', 'membrane-right',  'mitochondria'] },
    { id: 'co2-out',    type: 'co2',     label: 'CO₂ waste',   spawnEvery: 3200, requires: ['mitochondria', 'cell-membrane'],  path: ['mitochondria',  'membrane-bottom', 'outside-bottom'] },
    { id: 'atp',        type: 'atp',     label: 'ATP energy',  spawnEvery: 1800, requires: ['mitochondria'],                   path: ['mitochondria',  'nucleus'] },
    { id: 'mrna',       type: 'mrna',    label: 'mRNA',        spawnEvery: 3000, requires: ['nucleus'],                        path: ['nucleus',       'cytoplasm'] }
  ],
  plant: [
    { id: 'sunlight',   type: 'sunlight', label: 'Sunlight',    spawnEvery: 2000, requires: [],                                              path: ['outside-top',   'chloroplast'] },
    { id: 'co2-in',     type: 'co2',      label: 'CO₂ in',      spawnEvery: 2600, requires: ['cell-wall', 'cell-membrane'],                  path: ['outside-right', 'membrane-right', 'chloroplast'] },
    { id: 'h2o-in',     type: 'h2o',      label: 'H₂O in',      spawnEvery: 2600, requires: ['cell-wall', 'cell-membrane'],                  path: ['outside-left',  'membrane-left',  'chloroplast'] },
    { id: 'glucose',    type: 'glucose',  label: 'Glucose',     spawnEvery: 2800, requires: ['chloroplast'],                                 path: ['chloroplast',   'mitochondria'] },
    { id: 'o2-out',     type: 'o2',       label: 'O₂ released', spawnEvery: 2800, requires: ['chloroplast', 'cell-wall', 'cell-membrane'],   path: ['chloroplast',   'membrane-bottom', 'outside-bottom'] },
    { id: 'atp',        type: 'atp',      label: 'ATP energy',  spawnEvery: 1800, requires: ['mitochondria'],                                path: ['mitochondria',  'nucleus'] },
    { id: 'mrna',       type: 'mrna',     label: 'mRNA',        spawnEvery: 3000, requires: ['nucleus'],                                     path: ['nucleus',       'cytoplasm'] }
  ]
};

// ---- Cascade graph: upstream dependencies + starvation thresholds -------
// `starveAfterMs: Infinity` means the organelle never starves on its own;
// it can only become disabled by the user. Cell-wall and cell-membrane are
// structural (not metabolic) in our model, so they have no upstream
// dependencies — but disabling them still cascades downstream because
// other organelles list them in `dependsOn`.

const ORGANELLE_DEPENDENCIES = {
  animal: {
    'cell-membrane': { dependsOn: [],                  starveAfterMs: Infinity },
    'mitochondria':  { dependsOn: ['cell-membrane'],   starveAfterMs: 6000 },
    'nucleus':       { dependsOn: ['mitochondria'],    starveAfterMs: 8000 }
  },
  plant: {
    'cell-wall':     { dependsOn: [],                          starveAfterMs: Infinity },
    'cell-membrane': { dependsOn: [],                          starveAfterMs: Infinity },
    'chloroplast':   { dependsOn: ['cell-wall', 'cell-membrane'], starveAfterMs: 6000 },
    'mitochondria':  { dependsOn: ['chloroplast'],             starveAfterMs: 6000 },
    'nucleus':       { dependsOn: ['mitochondria'],            starveAfterMs: 8000 }
  }
};

window.ORGANELLE_DATA = ORGANELLE_DATA;
window.CHALLENGES = CHALLENGES;
window.PARTICLE_TYPES = PARTICLE_TYPES;
window.PARTICLE_NAMES = PARTICLE_NAMES;
window.FIXED_WAYPOINTS = FIXED_WAYPOINTS;
window.SYSTEM_FLOWS = SYSTEM_FLOWS;
window.ORGANELLE_DEPENDENCIES = ORGANELLE_DEPENDENCIES;
