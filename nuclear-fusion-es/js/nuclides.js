// Datos de energía de enlace por nucleón para isótopos seleccionados.
// Unidades: MeV por nucleón (MeV/A). Fuente: datos nucleares evaluados AME2020.
// "bePerNucleon" = energía de enlace nuclear total ÷ número másico.
// Valores más altos = núcleo más estable. La curva alcanza su máximo cerca del Fe-56.

window.NUCLIDES = [
  // --- Región de combustión de hidrógeno / helio ---
  { symbol: "H",  mass: 1,   protons: 1,  neutrons: 0,   bePerNucleon: 0.000, name: "Hidrógeno-1 (protio)" },
  { symbol: "H",  mass: 2,   protons: 1,  neutrons: 1,   bePerNucleon: 1.112, name: "Hidrógeno-2 (deuterio)" },
  { symbol: "H",  mass: 3,   protons: 1,  neutrons: 2,   bePerNucleon: 2.827, name: "Hidrógeno-3 (tritio)" },
  { symbol: "He", mass: 3,   protons: 2,  neutrons: 1,   bePerNucleon: 2.573, name: "Helio-3" },
  { symbol: "He", mass: 4,   protons: 2,  neutrons: 2,   bePerNucleon: 7.074, name: "Helio-4 (partícula alfa)" },
  { symbol: "Li", mass: 6,   protons: 3,  neutrons: 3,   bePerNucleon: 5.332, name: "Litio-6" },
  { symbol: "Li", mass: 7,   protons: 3,  neutrons: 4,   bePerNucleon: 5.606, name: "Litio-7" },
  { symbol: "Be", mass: 8,   protons: 4,  neutrons: 4,   bePerNucleon: 7.062, name: "Berilio-8", notes: "Altamente inestable; se separa nuevamente en dos partículas alfa." },
  { symbol: "Be", mass: 9,   protons: 4,  neutrons: 5,   bePerNucleon: 6.463, name: "Berilio-9" },
  { symbol: "B",  mass: 11,  protons: 5,  neutrons: 6,   bePerNucleon: 6.928, name: "Boro-11" },
  { symbol: "C",  mass: 12,  protons: 6,  neutrons: 6,   bePerNucleon: 7.680, name: "Carbono-12" },

  // --- Región de combustión de carbono / neón / oxígeno ---
  { symbol: "N",  mass: 14,  protons: 7,  neutrons: 7,   bePerNucleon: 7.475, name: "Nitrógeno-14" },
  { symbol: "O",  mass: 16,  protons: 8,  neutrons: 8,   bePerNucleon: 7.976, name: "Oxígeno-16" },
  { symbol: "Ne", mass: 20,  protons: 10, neutrons: 10,  bePerNucleon: 8.032, name: "Neón-20" },
  { symbol: "Na", mass: 23,  protons: 11, neutrons: 12,  bePerNucleon: 8.111, name: "Sodio-23" },
  { symbol: "Mg", mass: 24,  protons: 12, neutrons: 12,  bePerNucleon: 8.260, name: "Magnesio-24" },

  // --- Combustión de silicio hacia el pico del hierro ---
  { symbol: "Si", mass: 28,  protons: 14, neutrons: 14,  bePerNucleon: 8.448, name: "Silicio-28" },
  { symbol: "S",  mass: 32,  protons: 16, neutrons: 16,  bePerNucleon: 8.493, name: "Azufre-32" },
  { symbol: "Ar", mass: 36,  protons: 18, neutrons: 18,  bePerNucleon: 8.520, name: "Argón-36" },
  { symbol: "Ca", mass: 40,  protons: 20, neutrons: 20,  bePerNucleon: 8.551, name: "Calcio-40" },
  { symbol: "Ti", mass: 48,  protons: 22, neutrons: 26,  bePerNucleon: 8.723, name: "Titanio-48" },
  { symbol: "Cr", mass: 52,  protons: 24, neutrons: 28,  bePerNucleon: 8.776, name: "Cromo-52" },
  { symbol: "Fe", mass: 56,  protons: 26, neutrons: 30,  bePerNucleon: 8.790, name: "Hierro-56", notes: "Pico de la curva de energía de enlace; fin de la fusión que libera energía." },
  { symbol: "Ni", mass: 58,  protons: 28, neutrons: 30,  bePerNucleon: 8.732, name: "Níquel-58" },

  // --- Región posterior al hierro (la fusión ahora requiere aporte de energía) ---
  { symbol: "Cu", mass: 63,  protons: 29, neutrons: 34,  bePerNucleon: 8.752, name: "Cobre-63" },
  { symbol: "Zn", mass: 64,  protons: 30, neutrons: 34,  bePerNucleon: 8.736, name: "Zinc-64" },
  { symbol: "Sr", mass: 88,  protons: 38, neutrons: 50,  bePerNucleon: 8.733, name: "Estroncio-88" },
  { symbol: "Sn", mass: 120, protons: 50, neutrons: 70,  bePerNucleon: 8.504, name: "Estaño-120" },
  { symbol: "Ba", mass: 138, protons: 56, neutrons: 82,  bePerNucleon: 8.394, name: "Bario-138" },
  { symbol: "Au", mass: 197, protons: 79, neutrons: 118, bePerNucleon: 7.916, name: "Oro-197", notes: "Forjado en explosiones de supernova mediante el proceso r." },
  { symbol: "Pb", mass: 208, protons: 82, neutrons: 126, bePerNucleon: 7.867, name: "Plomo-208" },
  { symbol: "U",  mass: 238, protons: 92, neutrons: 146, bePerNucleon: 7.570, name: "Uranio-238" },
];
