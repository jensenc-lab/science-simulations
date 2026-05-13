// Friendly names and descriptions for well-known stellar fusion reactions.
// The fusion bench looks up reactant pairs against this table to display
// authentic context. Anything not on this list still works in the bench
// (via mass+Z conservation in QValue.findProduct) — it just gets a generic
// description.
//
// Reactant matching is order-insensitive (see findCuratedReaction in q-value.js).

window.REACTIONS = [
  {
    reactants: [{ mass: 1, protons: 1 }, { mass: 2, protons: 1 }],
    product:    { mass: 3, protons: 2 },
    name: "Proton + Deuterium → Helium-3",
    description: "A key step in the p-p chain that powers the Sun. A proton fuses with deuterium to form helium-3.",
  },
  {
    reactants: [{ mass: 3, protons: 2 }, { mass: 3, protons: 2 }],
    product:    { mass: 4, protons: 2 },
    name: "Helium-3 + Helium-3 → Helium-4",
    description: "Two He-3 nuclei combine to form He-4 (releasing two protons in the real reaction). This completes the dominant branch of the p-p chain.",
  },
  {
    reactants: [{ mass: 4, protons: 2 }, { mass: 4, protons: 2 }],
    product:    { mass: 8, protons: 4 },
    name: "Alpha + Alpha → Beryllium-8 (unstable)",
    description: "Two He-4 nuclei fuse momentarily into Be-8, which is actually less stable per nucleon than He-4 — Be-8 breaks apart in ~10⁻¹⁶ seconds. This 'beryllium bottleneck' is why stars need the triple-alpha process.",
  },
  {
    reactants: [{ mass: 4, protons: 2 }, { mass: 8, protons: 4 }],
    product:    { mass: 12, protons: 6 },
    name: "Triple-Alpha → Carbon-12",
    description: "If a third He-4 catches the fleeting Be-8 before it decays, stable C-12 forms. This is how stars produce all the carbon in your body.",
  },
  {
    reactants: [{ mass: 4, protons: 2 }, { mass: 12, protons: 6 }],
    product:    { mass: 16, protons: 8 },
    name: "Alpha + Carbon-12 → Oxygen-16",
    description: "Helium-4 captures onto C-12 to make O-16. This is how stars produce most of the oxygen in the universe — including the oxygen you breathe.",
  },
  {
    reactants: [{ mass: 12, protons: 6 }, { mass: 12, protons: 6 }],
    product:    { mass: 24, protons: 12 },
    name: "Carbon + Carbon → Magnesium-24",
    description: "Begins in stars heavier than about 8 solar masses, once helium is exhausted. Two C-12 nuclei fuse into Mg-24.",
  },
  {
    reactants: [{ mass: 16, protons: 8 }, { mass: 16, protons: 8 }],
    product:    { mass: 32, protons: 16 },
    name: "Oxygen + Oxygen → Sulfur-32",
    description: "Oxygen burning in very massive stars. Two O-16 nuclei fuse into S-32 (one of several real product channels).",
  },
  {
    reactants: [{ mass: 28, protons: 14 }, { mass: 28, protons: 14 }],
    product:    { mass: 56, protons: 26 },
    name: "Silicon + Silicon → Iron-56",
    description: "Simplified one-step representation of silicon burning. In reality, this proceeds through many sequential alpha captures — but the end state is the same: Fe-56, the most stable nucleus per nucleon.",
  },
  {
    reactants: [{ mass: 56, protons: 26 }, { mass: 4, protons: 2 }],
    product:    { mass: 60, protons: 28 },
    name: "Iron + Alpha → Nickel-60 (endothermic)",
    description: "Beyond iron, fusion absorbs energy instead of releasing it. (Ni-60 isn't in our nuclide list, so this attempt falls back to mass conservation — and shows energy is required.) This is why iron-core stars collapse rather than fuse further.",
  },
];
