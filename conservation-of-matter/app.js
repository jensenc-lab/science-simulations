// ============================================================
// Conservation of Matter — app.js
// Phase 1: Reaction data, selector UI, and atom inventory
// Phase 2 will add molecule visualizations (SVG/canvas)
// ============================================================

// ---- TRANSLATIONS ----
const T = {
  en: {
    pageTitle: '⚗️ Conservation of Matter: Virtual Reaction Lab',
    stdPopupTitle: 'Utah SEEd Standard 8.1.6',
    stdPopupDesc: 'Develop a model to describe how the total number of atoms does not change in a chemical reaction, indicating that matter is conserved.',
    rxNames: {
      bakingSodaVinegar: 'Baking Soda + Vinegar',
      burningCandle: 'Burning a Candle',
      rustingIron: 'Rusting Iron',
    },
    sideReactants: 'Reactants',
    sideProducts: 'Products',
    reactBtn: 'React!',
    resetBtn: '↺ Reset',
    placeholder: 'Products will appear after the reaction.',
    inventoryTitle: '⚖️ Atom Inventory',
    inventoryNote: 'Atoms are neither created nor destroyed — they are rearranged into new molecules.',
    tableHeaders: ['Element', 'Symbol', 'Color', 'Reactant Count', 'Product Count', 'Match?'],
    elementNames: { Carbon: 'Carbon', Hydrogen: 'Hydrogen', Oxygen: 'Oxygen', Sodium: 'Sodium', Iron: 'Iron' },
    conservedOk: '<strong>MATTER IS CONSERVED</strong> — The total number of each type of atom is the same before and after the reaction. Atoms are rearranged, not created or destroyed.',
    conservedViolation: '<strong>MATTER NOT CONSERVED</strong> — This would violate the Law of Conservation of Matter! In real chemistry, this <em>NEVER</em> happens. Atoms cannot appear or disappear.',
    whatifBtn: '🔬 What if atoms COULD be created or destroyed?',
    whatifNote: 'This is fictional! In real chemistry, this NEVER happens. Atoms cannot appear or disappear in a reaction — only rearrange.',
    vocabSummary: '📚 Key Vocabulary',
    guideSummary: '❓ Guide Questions',
    vocab: [
      { term: 'Atom',                          def: 'The smallest unit of an element that keeps its chemical properties.' },
      { term: 'Molecule',                      def: 'Two or more atoms bonded together (like H₂O or CO₂).' },
      { term: 'Reactant',                      def: 'A substance that goes INTO a chemical reaction (the starting materials). Found on the left side of a chemical equation.' },
      { term: 'Product',                       def: 'A substance that comes OUT of a chemical reaction (what\'s made). Found on the right side of a chemical equation.' },
      { term: 'Chemical Reaction',             def: 'A process where atoms in reactants rearrange to form new products.' },
      { term: 'Law of Conservation of Matter', def: 'In a chemical reaction, matter is neither created nor destroyed. The total number of each type of atom stays the same.' },
    ],
    moleculeNames: {
      'Methane':                         'Methane',
      'Oxygen (×2)':                     'Oxygen (×2)',
      'Carbon Dioxide':                  'Carbon Dioxide',
      'Water (×2)':                      'Water (×2)',
      'Sodium Bicarbonate (Baking Soda)':'Sodium Bicarbonate (Baking Soda)',
      'Acetic Acid (Vinegar)':           'Acetic Acid (Vinegar)',
      'Sodium Acetate':                  'Sodium Acetate',
      'Water':                           'Water',
      'Iron (×4)':                       'Iron (×4)',
      'Oxygen (×3)':                     'Oxygen (×3)',
      'Iron Oxide / Rust (×2)':          'Iron Oxide / Rust (×2)',
      'Methane (Natural Gas)':           'Methane (Natural Gas)',
      'Oxygen':                          'Oxygen',
      'Iron':                            'Iron',
      'Iron Oxide (Rust)':               'Iron Oxide (Rust)',
      'Sodium Bicarbonate (Baking Soda)':'Sodium Bicarbonate (Baking Soda)',
    },
    questions: {
      bakingSodaVinegar: [
        'Count the carbon atoms in the reactants. Now count them in the products. Did any carbon atoms appear or disappear?',
        'When baking soda and vinegar react, you see bubbles. Those bubbles are CO₂ gas escaping. If the gas escapes into the air, would a scale show the same mass before and after? Why or why not?',
        'If you sealed the reaction in a closed container so no gas could escape, what would happen to the total mass?',
      ],
      burningCandle: [
        'Where does the carbon in CH₄ go after the reaction? Where does the hydrogen go?',
        'When a candle burns, it seems to disappear. But does the matter actually vanish? Where does it go?',
        'This reaction needs oxygen. What would happen if you put a jar over a burning candle and sealed it?',
      ],
      rustingIron: [
        'An iron nail gains mass as it rusts. Where does the extra mass come from? Use the atom inventory to explain.',
        'Rusting is a slow reaction, but it follows the same law as the fast reactions. How can you tell matter is conserved?',
        'If you sealed iron in a container with limited oxygen, what would eventually happen to the rusting process?',
      ],
    },
    nailLabels: ['The rusty nail has MORE mass!', 'Oxygen atoms bonded to iron.'],
    langBtn: '🇪🇸 Español',
  },
  es: {
    pageTitle: '⚗️ Conservación de la Materia: Laboratorio Virtual de Reacciones',
    stdPopupTitle: 'Estándar Utah SEEd 8.1.6',
    stdPopupDesc: 'Desarrollar un modelo para describir cómo el número total de átomos no cambia en una reacción química, lo que indica que la materia se conserva.',
    rxNames: {
      bakingSodaVinegar: 'Bicarbonato de Sodio + Vinagre',
      burningCandle: 'Quemar una Vela',
      rustingIron: 'Oxidación del Hierro',
    },
    sideReactants: 'Reactivos',
    sideProducts: 'Productos',
    reactBtn: '¡Reaccionar!',
    resetBtn: '↺ Reiniciar',
    placeholder: 'Los productos aparecerán después de la reacción.',
    inventoryTitle: '⚖️ Inventario de Átomos',
    inventoryNote: 'Los átomos no se crean ni se destruyen — se reorganizan en nuevas moléculas.',
    tableHeaders: ['Elemento', 'Símbolo', 'Color', 'Cantidad en Reactivos', 'Cantidad en Productos', '¿Coincide?'],
    elementNames: { Carbon: 'Carbono', Hydrogen: 'Hidrógeno', Oxygen: 'Oxígeno', Sodium: 'Sodio', Iron: 'Hierro' },
    conservedOk: '<strong>LA MATERIA SE CONSERVA</strong> — El número total de cada tipo de átomo es el mismo antes y después de la reacción. Los átomos se reorganizan, no se crean ni se destruyen.',
    conservedViolation: '<strong>MATERIA NO CONSERVADA</strong> — ¡Esto violaría la Ley de Conservación de la Materia! En la química real, esto <em>NUNCA</em> sucede. Los átomos no pueden aparecer ni desaparecer.',
    whatifBtn: '🔬 ¿Qué pasaría si los átomos PUDIERAN crearse o destruirse?',
    whatifNote: '¡Esto es ficticio! En la química real, esto NUNCA sucede. Los átomos no pueden aparecer ni desaparecer en una reacción — solo reorganizarse.',
    vocabSummary: '📚 Vocabulario Clave',
    guideSummary: '❓ Preguntas Guía',
    vocab: [
      { term: 'Átomo',                               def: 'La unidad más pequeña de un elemento que conserva sus propiedades químicas.' },
      { term: 'Molécula',                            def: 'Dos o más átomos unidos entre sí (como H₂O o CO₂).' },
      { term: 'Reactivo',                            def: 'Una sustancia que entra en una reacción química (los materiales de inicio). Se encuentra en el lado izquierdo de una ecuación química.' },
      { term: 'Producto',                            def: 'Una sustancia que sale de una reacción química (lo que se produce). Se encuentra en el lado derecho de una ecuación química.' },
      { term: 'Reacción Química',                    def: 'Un proceso en el que los átomos de los reactivos se reorganizan para formar nuevos productos.' },
      { term: 'Ley de Conservación de la Materia',   def: 'En una reacción química, la materia no se crea ni se destruye. El número total de cada tipo de átomo permanece igual.' },
    ],
    moleculeNames: {
      'Methane':                          'Metano',
      'Oxygen (×2)':                      'Oxígeno (×2)',
      'Carbon Dioxide':                   'Dióxido de Carbono',
      'Water (×2)':                       'Agua (×2)',
      'Sodium Bicarbonate (Baking Soda)': 'Bicarbonato de Sodio',
      'Acetic Acid (Vinegar)':            'Ácido Acético (Vinagre)',
      'Sodium Acetate':                   'Acetato de Sodio',
      'Water':                            'Agua',
      'Iron (×4)':                        'Hierro (×4)',
      'Oxygen (×3)':                      'Oxígeno (×3)',
      'Iron Oxide / Rust (×2)':           'Óxido de Hierro / Herrumbre (×2)',
      'Methane (Natural Gas)':            'Metano (Gas Natural)',
      'Oxygen':                           'Oxígeno',
      'Iron':                             'Hierro',
      'Iron Oxide (Rust)':                'Óxido de Hierro (Herrumbre)',
    },
    questions: {
      bakingSodaVinegar: [
        'Cuenta los átomos de carbono en los reactivos. Ahora cuéntalos en los productos. ¿Aparecieron o desaparecieron átomos de carbono?',
        'Cuando el bicarbonato y el vinagre reaccionan, ves burbujas. Esas burbujas son gas CO₂ escapando. Si el gas escapa al aire, ¿una balanza mostraría la misma masa antes y después? ¿Por qué sí o por qué no?',
        'Si sellaras la reacción en un recipiente cerrado para que no escapara el gas, ¿qué pasaría con la masa total?',
      ],
      burningCandle: [
        '¿A dónde va el carbono del CH₄ después de la reacción? ¿A dónde va el hidrógeno?',
        'Cuando una vela se quema, parece desaparecer. Pero, ¿la materia realmente se desvanece? ¿A dónde va?',
        'Esta reacción necesita oxígeno. ¿Qué pasaría si pusieras un frasco sobre una vela encendida y lo sellaras?',
      ],
      rustingIron: [
        'Un clavo de hierro gana masa al oxidarse. ¿De dónde viene la masa extra? Usa el inventario de átomos para explicar.',
        'La oxidación es una reacción lenta, pero sigue la misma ley que las reacciones rápidas. ¿Cómo puedes saber que la materia se conserva?',
        'Si sellaras hierro en un recipiente con oxígeno limitado, ¿qué pasaría eventualmente con el proceso de oxidación?',
      ],
    },
    nailLabels: ['¡El clavo oxidado tiene MÁS masa!', 'Átomos de oxígeno unidos al hierro.'],
    langBtn: '🇺🇸 English',
  },
};

// ---- REACTION DATA ----
// Each reaction has:
//   reactants / products: array of { formula (HTML), name, coefficient }
//   atoms: array of { element, symbol, color, reactantCount, productCount }
//
// Formulae use <sub> tags for subscripts.
// Coefficients represent the stoichiometric multiplier for that molecule.

const REACTIONS = {

  bakingSodaVinegar: {
    title: 'Baking Soda + Vinegar',
    // NaHCO₃ + CH₃COOH → NaCH₃COO + H₂O + CO₂
    reactants: [
      {
        formula: 'NaHCO<sub>3</sub>',
        name: 'Sodium Bicarbonate (Baking Soda)',
        coefficient: 1
      },
      {
        formula: 'CH<sub>3</sub>COOH',
        name: 'Acetic Acid (Vinegar)',
        coefficient: 1
      }
    ],
    products: [
      {
        formula: 'NaCH<sub>3</sub>COO',
        name: 'Sodium Acetate',
        coefficient: 1
      },
      {
        formula: 'H<sub>2</sub>O',
        name: 'Water',
        coefficient: 1
      },
      {
        formula: 'CO<sub>2</sub>',
        name: 'Carbon Dioxide',
        coefficient: 1
      }
    ],
    // Atom totals (coefficients × atoms per molecule, both sides must match)
    // Reactants: Na=1, C=3 (1+2), H=5 (1+4), O=5 (3+2)
    // Products:  Na=1, C=3 (2+0+1), H=5 (3+2+0), O=5 (2+1+2)
    atoms: [
      { element: 'Sodium',   symbol: 'Na', color: '#8e44ad', isLight: false, reactantCount: 1, productCount: 1 },
      { element: 'Carbon',   symbol: 'C',  color: '#2c3e50', isLight: false, reactantCount: 3, productCount: 3 },
      { element: 'Hydrogen', symbol: 'H',  color: '#ecf0f1', isLight: true,  reactantCount: 5, productCount: 5 },
      { element: 'Oxygen',   symbol: 'O',  color: '#e74c3c', isLight: false, reactantCount: 5, productCount: 5 }
    ],
    questions: [
      'Count the carbon atoms in the reactants. Now count them in the products. Did any carbon atoms appear or disappear?',
      'When baking soda and vinegar react, you see bubbles. Those bubbles are CO₂ gas escaping. If the gas escapes into the air, would a scale show the same mass before and after? Why or why not?',
      'If you sealed the reaction in a closed container so no gas could escape, what would happen to the total mass?'
    ]
  },

  burningCandle: {
    title: 'Burning a Candle (Methane)',
    // CH₄ + 2O₂ → CO₂ + 2H₂O
    reactants: [
      {
        formula: 'CH<sub>4</sub>',
        name: 'Methane (Natural Gas)',
        coefficient: 1
      },
      {
        formula: 'O<sub>2</sub>',
        name: 'Oxygen',
        coefficient: 2
      }
    ],
    products: [
      {
        formula: 'CO<sub>2</sub>',
        name: 'Carbon Dioxide',
        coefficient: 1
      },
      {
        formula: 'H<sub>2</sub>O',
        name: 'Water',
        coefficient: 2
      }
    ],
    // Reactants: C=1, H=4, O=4 (2×2)
    // Products:  C=1, O=2, H=4 (2×2), O=2 (2×1) → C=1, H=4, O=4
    atoms: [
      { element: 'Carbon',   symbol: 'C', color: '#2c3e50', isLight: false, reactantCount: 1, productCount: 1 },
      { element: 'Hydrogen', symbol: 'H', color: '#ecf0f1', isLight: true,  reactantCount: 4, productCount: 4 },
      { element: 'Oxygen',   symbol: 'O', color: '#e74c3c', isLight: false, reactantCount: 4, productCount: 4 }
    ],
    questions: [
      'Where does the carbon in CH₄ go after the reaction? Where does the hydrogen go?',
      'When a candle burns, it seems to disappear. But does the matter actually vanish? Where does it go?',
      'This reaction needs oxygen. What would happen if you put a jar over a burning candle and sealed it?'
    ]
  },

  rustingIron: {
    title: 'Rusting Iron',
    // 4Fe + 3O₂ → 2Fe₂O₃
    reactants: [
      {
        formula: 'Fe',
        name: 'Iron',
        coefficient: 4
      },
      {
        formula: 'O<sub>2</sub>',
        name: 'Oxygen',
        coefficient: 3
      }
    ],
    products: [
      {
        formula: 'Fe<sub>2</sub>O<sub>3</sub>',
        name: 'Iron Oxide (Rust)',
        coefficient: 2
      }
    ],
    // Reactants: Fe=4, O=6 (3×2)
    // Products:  Fe=4 (2×2), O=6 (2×3)
    atoms: [
      { element: 'Iron',   symbol: 'Fe', color: '#e67e22', isLight: false, reactantCount: 4, productCount: 4 },
      { element: 'Oxygen', symbol: 'O',  color: '#e74c3c', isLight: false, reactantCount: 6, productCount: 6 }
    ],
    questions: [
      'An iron nail gains mass as it rusts. Where does the extra mass come from? Use the atom inventory to explain.',
      'Rusting is a slow reaction, but it follows the same law as the fast reactions. How can you tell matter is conserved?',
      'If you sealed iron in a container with limited oxygen, what would eventually happen to the rusting process?'
    ]
  }

};

// ---- APPLICATION STATE ----
let currentReactionKey = 'bakingSodaVinegar';
let whatIfActive       = false;
let lang               = 'en';

// ---- DOM REFERENCES ----
const reactionCards     = document.querySelectorAll('.reaction-card');
const reactantsDisplay  = document.getElementById('reactantsDisplay');
const productsDisplay   = document.getElementById('productsDisplay');
const inventoryBody     = document.getElementById('inventoryBody');
const stdBadge          = document.getElementById('stdBadge');
const stdPopup          = document.getElementById('stdPopup');
const overlay           = document.getElementById('overlay');
const closePopupBtn     = document.getElementById('closePopup');
const reactBtn          = document.getElementById('reactBtn');
const resetBtn          = document.getElementById('resetBtn');
const whatifBtn         = document.getElementById('whatifBtn');
const whatifNote        = document.getElementById('whatifNote');

// ---- RENDER: MOLECULE LABELS ----
/**
 * Renders text-based molecule labels for one side of the reaction.
 * Designed to be replaced in Phase 2 with SVG molecule visualizations.
 *
 * @param {HTMLElement} container  - Target display div
 * @param {Array}       molecules  - Array of { formula, name, coefficient }
 */
function renderMolecules(container, molecules) {
  container.innerHTML = '';

  molecules.forEach((mol, i) => {
    // Molecule card
    const item = document.createElement('div');
    item.className = 'molecule-item';

    // Show coefficient prefix only when > 1
    const coefHTML = mol.coefficient > 1
      ? `<span class="mol-coefficient">${mol.coefficient}</span>`
      : '';

    const molName = T[lang].moleculeNames[mol.name] || mol.name;
    item.innerHTML = `
      <div class="molecule-formula">${coefHTML}${mol.formula}</div>
      <div class="molecule-name">${molName}</div>
    `;
    container.appendChild(item);

    // "+" separator between molecules
    if (i < molecules.length - 1) {
      const sep = document.createElement('div');
      sep.className = 'molecule-separator';
      sep.textContent = '+';
      container.appendChild(sep);
    }
  });
}

// ---- RENDER: ATOM INVENTORY TABLE ----
/**
 * Rebuilds the atom inventory tbody for the current reaction.
 *
 * @param {Array} atoms - Array of { element, symbol, color, isLight, reactantCount, productCount }
 */
function renderInventory(atoms) {
  inventoryBody.innerHTML = '';

  atoms.forEach(atom => {
    const matches = atom.reactantCount === atom.productCount;
    const swatchClass = 'atom-swatch' + (atom.isLight ? ' swatch-light' : '');

    const translatedName = T[lang].elementNames[atom.element] || atom.element;
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${translatedName}</td>
      <td><strong>${atom.symbol}</strong></td>
      <td><span class="${swatchClass}" style="background:${atom.color};" title="${atom.element}"></span></td>
      <td class="count-cell">${atom.reactantCount}</td>
      <td class="count-cell">${atom.productCount}</td>
      <td class="match-cell ${matches ? 'match-yes' : 'match-no'}">${matches ? '✓' : '✗'}</td>
    `;
    inventoryBody.appendChild(tr);
  });
}

// ---- RENDER: GUIDE QUESTIONS ----
/**
 * Populates the Guide Questions collapsible with reaction-specific questions.
 * @param {string[]} questions
 */
function renderGuideQuestions(questions) {
  // Prefer translated questions from T; fall back to passed-in array
  const qs = (T[lang].questions && T[lang].questions[currentReactionKey]) || questions;
  const container = document.getElementById('guideQuestions');
  container.innerHTML = '';
  if (!qs || qs.length === 0) return;

  const ol = document.createElement('ol');
  ol.className = 'guide-questions-list';
  qs.forEach(q => {
    const li = document.createElement('li');
    li.textContent = q;
    ol.appendChild(li);
  });
  container.appendChild(ol);
}

// ---- CONSERVATION CHECK CALLOUT ----
/**
 * Updates the conservation-check callout below the inventory table.
 * @param {boolean} conserved  true = green "conserved", false = red "violation"
 */
function updateConservationCheck(conserved) {
  const el = document.getElementById('conservationCheck');
  if (!el) return;
  if (conserved) {
    el.className = 'conservation-check check-ok';
    el.innerHTML = '<span class="check-icon" aria-hidden="true">✅</span>'
      + '<div>' + T[lang].conservedOk + '</div>';
  } else {
    el.className = 'conservation-check check-violation';
    el.innerHTML = '<span class="check-icon" aria-hidden="true">❌</span>'
      + '<div>' + T[lang].conservedViolation + '</div>';
  }
}

// ---- WHAT IF? TOGGLE ----
/**
 * Produces a copy of atoms with 1-2 productCounts randomly perturbed
 * so none of the affected rows match (used by the "What if?" toggle).
 * @param {Array} atoms
 * @returns {Array} modified copy
 */
function generateFakeAtoms(atoms) {
  const fake  = atoms.map(a => ({ ...a }));
  const count = Math.min(2, fake.length);
  // Fisher-Yates shuffle of indices, take first `count`
  const idx = fake.map((_, i) => i);
  for (let i = idx.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [idx[i], idx[j]] = [idx[j], idx[i]];
  }
  idx.slice(0, count).forEach(i => {
    // Always offset by at least 1; alternate between +2 and -1
    const delta = Math.random() < 0.5 ? 2 : -1;
    let next = Math.max(1, fake[i].productCount + delta);
    if (next === atoms[i].productCount) next += 1; // ensure mismatch
    fake[i].productCount = next;
  });
  return fake;
}

function toggleWhatIf() {
  whatIfActive = !whatIfActive;
  const reaction = REACTIONS[currentReactionKey];

  if (whatIfActive) {
    whatifBtn.classList.add('active');
    whatifNote.style.display = '';
    renderInventory(generateFakeAtoms(reaction.atoms));
    updateConservationCheck(false);
  } else {
    whatifBtn.classList.remove('active');
    whatifNote.style.display = 'none';
    renderInventory(reaction.atoms);
    updateConservationCheck(true);
  }
}

// ---- UPDATE VIEW ----
/**
 * Refreshes both the molecule display and atom inventory
 * to reflect the currently selected reaction.
 *
 * - burningCandle: uses MolViz SVG visualizations + React/Reset buttons
 * - all others:    uses text-only renderMolecules (Phase 1 display)
 */
function updateView() {
  // Cancel any in-flight atom-travel animation when switching reactions
  MolAnim.cleanup();

  const reaction = REACTIONS[currentReactionKey];

  if (currentReactionKey === 'burningCandle' || currentReactionKey === 'bakingSodaVinegar' || currentReactionKey === 'rustingIron') {
    // SVG molecule display — show React button, hide Reset
    reactBtn.style.display = '';
    reactBtn.disabled      = false;
    resetBtn.style.display = 'none';
    MolViz.init(reactantsDisplay, productsDisplay, currentReactionKey);
  } else {
    // Text-only display — hide both buttons
    reactBtn.style.display = 'none';
    resetBtn.style.display = 'none';
    renderMolecules(reactantsDisplay, reaction.reactants);
    renderMolecules(productsDisplay,  reaction.products);
  }

  // Reset What If toggle when switching reactions
  if (whatIfActive) {
    whatIfActive = false;
    whatifBtn.classList.remove('active');
    whatifNote.style.display = 'none';
  }

  renderInventory(reaction.atoms);
  updateConservationCheck(true);
  renderGuideQuestions(reaction.questions);
}

// ---- EVENT LISTENERS: REACTION SELECTOR ----
reactionCards.forEach(card => {
  card.addEventListener('click', () => {
    // Update active card styling and aria state
    reactionCards.forEach(c => {
      c.classList.remove('active');
      c.setAttribute('aria-pressed', 'false');
    });
    card.classList.add('active');
    card.setAttribute('aria-pressed', 'true');

    currentReactionKey = card.dataset.reaction;
    updateView();
    applyLang();
  });
});

// ---- EVENT LISTENERS: STANDARD POPUP ----
function openPopup() {
  stdPopup.classList.add('show');
  overlay.classList.add('show');
}

function closePopup() {
  stdPopup.classList.remove('show');
  overlay.classList.remove('show');
}

stdBadge.addEventListener('click', openPopup);
closePopupBtn.addEventListener('click', closePopup);
overlay.addEventListener('click', closePopup);

// Close popup on Escape key
document.addEventListener('keydown', e => {
  if (e.key === 'Escape') closePopup();
});

// ---- EVENT LISTENERS: REACT / RESET ----

reactBtn.addEventListener('click', () => {
  reactBtn.disabled = true;
  // All three reactions use atom-travel animations from MolAnim
  if (currentReactionKey === 'burningCandle') {
    MolAnim.runReaction(reactantsDisplay, productsDisplay, inventoryBody);
  } else if (currentReactionKey === 'rustingIron') {
    MolAnim.runRustingIron(reactantsDisplay, productsDisplay, inventoryBody);
  } else if (currentReactionKey === 'bakingSodaVinegar') {
    MolAnim.runBakingSodaVinegar(reactantsDisplay, productsDisplay, inventoryBody);
  } else {
    MolViz.runReaction(reactantsDisplay, productsDisplay, inventoryBody);
  }
});

resetBtn.addEventListener('click', () => {
  MolViz.reset(reactantsDisplay, productsDisplay);
});

whatifBtn.addEventListener('click', toggleWhatIf);

// ---- LANGUAGE TOGGLE ----
/**
 * Rebuilds the vocab grid from T[lang].vocab.
 */
function renderVocab() {
  const grid = document.getElementById('vocabGrid');
  if (!grid) return;
  grid.innerHTML = T[lang].vocab.map(v =>
    `<div class="vocab-item"><dt>${v.term}</dt><dd>${v.def}</dd></div>`
  ).join('');
}

/**
 * Updates all translatable DOM elements to the current language.
 */
function applyLang() {
  const t = T[lang];

  // Header
  document.getElementById('pageTitle').textContent        = t.pageTitle;
  document.getElementById('stdPopupTitle').textContent    = t.stdPopupTitle;
  document.getElementById('stdPopupDesc').textContent     = t.stdPopupDesc;
  document.getElementById('langBtn').textContent          = t.langBtn;

  // Reaction cards
  document.getElementById('rxName-bakingSodaVinegar').textContent = t.rxNames.bakingSodaVinegar;
  document.getElementById('rxName-burningCandle').textContent     = t.rxNames.burningCandle;
  document.getElementById('rxName-rustingIron').textContent       = t.rxNames.rustingIron;

  // Simulation side labels
  document.getElementById('sideReactants').textContent = t.sideReactants;
  document.getElementById('sideProducts').textContent  = t.sideProducts;

  // React / Reset buttons (update regardless of visibility so they're correct when shown)
  reactBtn.textContent = t.reactBtn;
  resetBtn.textContent = t.resetBtn;

  // Atom inventory
  document.getElementById('inventoryTitle').textContent = t.inventoryTitle;
  document.getElementById('inventoryNote').textContent  = t.inventoryNote;

  // Table headers
  const thIds = ['th-element', 'th-symbol', 'th-color', 'th-reactantCount', 'th-productCount', 'th-match'];
  thIds.forEach((id, i) => { document.getElementById(id).textContent = t.tableHeaders[i]; });

  // Re-render inventory rows (translates element names)
  const reaction = REACTIONS[currentReactionKey];
  renderInventory(whatIfActive ? generateFakeAtoms(reaction.atoms) : reaction.atoms);

  // Conservation check callout
  updateConservationCheck(!whatIfActive);

  // What If? toggle
  whatifBtn.textContent        = t.whatifBtn;
  whatifNote.textContent       = t.whatifNote;

  // Re-render molecule visuals so molecule names update in current language
  MolAnim.cleanup();
  MolViz.init(reactantsDisplay, productsDisplay, currentReactionKey);
  reactBtn.style.display = '';
  reactBtn.disabled      = false;
  resetBtn.style.display = 'none';

  // Any visible placeholder text
  document.querySelectorAll('.mol-placeholder').forEach(el => { el.textContent = t.placeholder; });

  // Bottom panels
  document.getElementById('vocabSummary').textContent  = t.vocabSummary;
  document.getElementById('guideSummary').textContent  = t.guideSummary;
  renderVocab();
  renderGuideQuestions();

  // Nail post-reaction labels (if visible)
  const lbl1 = document.getElementById('rv-nail-lbl1');
  const lbl2 = document.getElementById('rv-nail-lbl2');
  if (lbl1) lbl1.textContent = t.nailLabels[0];
  if (lbl2) lbl2.textContent = t.nailLabels[1];
}

document.getElementById('langBtn').addEventListener('click', () => {
  lang = lang === 'en' ? 'es' : 'en';
  applyLang();
});

// ---- INIT ----
updateView();
applyLang();
