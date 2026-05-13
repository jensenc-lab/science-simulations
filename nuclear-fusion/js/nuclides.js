// Binding energy per nucleon data for selected isotopes.
// Units: MeV per nucleon (MeV/A). Source: AME2020 evaluated nuclear data.
// "bePerNucleon" = total nuclear binding energy ÷ mass number.
// Higher values = more stable nucleus. The curve peaks near Fe-56.

window.NUCLIDES = [
  // --- Hydrogen / helium burning region ---
  { symbol: "H",  mass: 1,   protons: 1,  neutrons: 0,   bePerNucleon: 0.000, name: "Hydrogen-1 (protium)" },
  { symbol: "H",  mass: 2,   protons: 1,  neutrons: 1,   bePerNucleon: 1.112, name: "Hydrogen-2 (deuterium)" },
  { symbol: "H",  mass: 3,   protons: 1,  neutrons: 2,   bePerNucleon: 2.827, name: "Hydrogen-3 (tritium)" },
  { symbol: "He", mass: 3,   protons: 2,  neutrons: 1,   bePerNucleon: 2.573, name: "Helium-3" },
  { symbol: "He", mass: 4,   protons: 2,  neutrons: 2,   bePerNucleon: 7.074, name: "Helium-4 (alpha particle)" },
  { symbol: "Li", mass: 6,   protons: 3,  neutrons: 3,   bePerNucleon: 5.332, name: "Lithium-6" },
  { symbol: "Li", mass: 7,   protons: 3,  neutrons: 4,   bePerNucleon: 5.606, name: "Lithium-7" },
  { symbol: "Be", mass: 8,   protons: 4,  neutrons: 4,   bePerNucleon: 7.062, name: "Beryllium-8", notes: "Highly unstable; splits back into two alpha particles." },
  { symbol: "Be", mass: 9,   protons: 4,  neutrons: 5,   bePerNucleon: 6.463, name: "Beryllium-9" },
  { symbol: "B",  mass: 11,  protons: 5,  neutrons: 6,   bePerNucleon: 6.928, name: "Boron-11" },
  { symbol: "C",  mass: 12,  protons: 6,  neutrons: 6,   bePerNucleon: 7.680, name: "Carbon-12" },

  // --- Carbon / neon / oxygen burning region ---
  { symbol: "N",  mass: 14,  protons: 7,  neutrons: 7,   bePerNucleon: 7.475, name: "Nitrogen-14" },
  { symbol: "O",  mass: 16,  protons: 8,  neutrons: 8,   bePerNucleon: 7.976, name: "Oxygen-16" },
  { symbol: "Ne", mass: 20,  protons: 10, neutrons: 10,  bePerNucleon: 8.032, name: "Neon-20" },
  { symbol: "Na", mass: 23,  protons: 11, neutrons: 12,  bePerNucleon: 8.111, name: "Sodium-23" },
  { symbol: "Mg", mass: 24,  protons: 12, neutrons: 12,  bePerNucleon: 8.260, name: "Magnesium-24" },

  // --- Silicon burning toward the iron peak ---
  { symbol: "Si", mass: 28,  protons: 14, neutrons: 14,  bePerNucleon: 8.448, name: "Silicon-28" },
  { symbol: "S",  mass: 32,  protons: 16, neutrons: 16,  bePerNucleon: 8.493, name: "Sulfur-32" },
  { symbol: "Ar", mass: 36,  protons: 18, neutrons: 18,  bePerNucleon: 8.520, name: "Argon-36" },
  { symbol: "Ca", mass: 40,  protons: 20, neutrons: 20,  bePerNucleon: 8.551, name: "Calcium-40" },
  { symbol: "Ti", mass: 48,  protons: 22, neutrons: 26,  bePerNucleon: 8.723, name: "Titanium-48" },
  { symbol: "Cr", mass: 52,  protons: 24, neutrons: 28,  bePerNucleon: 8.776, name: "Chromium-52" },
  { symbol: "Fe", mass: 56,  protons: 26, neutrons: 30,  bePerNucleon: 8.790, name: "Iron-56", notes: "Peak of the binding energy curve; end of energy-releasing fusion." },
  { symbol: "Ni", mass: 58,  protons: 28, neutrons: 30,  bePerNucleon: 8.732, name: "Nickel-58" },

  // --- Post-iron region (fusion now requires energy input) ---
  { symbol: "Cu", mass: 63,  protons: 29, neutrons: 34,  bePerNucleon: 8.752, name: "Copper-63" },
  { symbol: "Zn", mass: 64,  protons: 30, neutrons: 34,  bePerNucleon: 8.736, name: "Zinc-64" },
  { symbol: "Sr", mass: 88,  protons: 38, neutrons: 50,  bePerNucleon: 8.733, name: "Strontium-88" },
  { symbol: "Sn", mass: 120, protons: 50, neutrons: 70,  bePerNucleon: 8.504, name: "Tin-120" },
  { symbol: "Ba", mass: 138, protons: 56, neutrons: 82,  bePerNucleon: 8.394, name: "Barium-138" },
  { symbol: "Au", mass: 197, protons: 79, neutrons: 118, bePerNucleon: 7.916, name: "Gold-197", notes: "Forged in supernova explosions via the r-process." },
  { symbol: "Pb", mass: 208, protons: 82, neutrons: 126, bePerNucleon: 7.867, name: "Lead-208" },
  { symbol: "U",  mass: 238, protons: 92, neutrons: 146, bePerNucleon: 7.570, name: "Uranium-238" },
];
