// ============================================================
// Conservation of Matter — app.js
// Phase 1: Reaction data, selector UI, and atom inventory
// Phase 2 will add molecule visualizations (SVG/canvas)
// ============================================================

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

    item.innerHTML = `
      <div class="molecule-formula">${coefHTML}${mol.formula}</div>
      <div class="molecule-name">${mol.name}</div>
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

    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${atom.element}</td>
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
  const container = document.getElementById('guideQuestions');
  container.innerHTML = '';
  if (!questions || questions.length === 0) return;

  const ol = document.createElement('ol');
  ol.className = 'guide-questions-list';
  questions.forEach(q => {
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
      + '<div><strong>MATTER IS CONSERVED</strong> — The total number of each type of atom '
      + 'is the same before and after the reaction. Atoms are rearranged, not created or destroyed.</div>';
  } else {
    el.className = 'conservation-check check-violation';
    el.innerHTML = '<span class="check-icon" aria-hidden="true">❌</span>'
      + '<div><strong>MATTER NOT CONSERVED</strong> — This would violate the Law of Conservation '
      + 'of Matter! In real chemistry, this <em>NEVER</em> happens. Atoms cannot appear or disappear.</div>';
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
  // burningCandle uses the atom-travel animation; all others use MolViz fade
  if (currentReactionKey === 'burningCandle') {
    MolAnim.runReaction(reactantsDisplay, productsDisplay, inventoryBody);
  } else {
    MolViz.runReaction(reactantsDisplay, productsDisplay, inventoryBody);
  }
});

resetBtn.addEventListener('click', () => {
  MolViz.reset(reactantsDisplay, productsDisplay);
});

whatifBtn.addEventListener('click', toggleWhatIf);

// ---- INIT ----
updateView();
