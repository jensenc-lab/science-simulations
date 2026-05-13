// Major fusion/burning stages in stellar nucleosynthesis, in order.
// Used by the Stellar Nucleosynthesis Tracker panel to step through
// what's happening inside a massive star and, eventually, in a supernova.

window.STELLAR_STAGES = [
  {
    id: "hydrogen-burning",
    name: "Hydrogen Burning",
    tempMK: 15,
    fuelMass: [1],
    productMass: [4],
    description: "Protons fuse via the p-p chain (or the CNO cycle in more massive stars) to make helium-4. This is what powers main-sequence stars like the Sun for billions of years."
  },
  {
    id: "helium-burning",
    name: "Helium Burning",
    tempMK: 100,
    fuelMass: [4],
    productMass: [12, 16],
    description: "The triple-alpha process fuses three He-4 nuclei into C-12. Some C-12 then captures another He-4 to form O-16. Begins when the core runs out of hydrogen."
  },
  {
    id: "carbon-burning",
    name: "Carbon Burning",
    tempMK: 600,
    fuelMass: [12],
    productMass: [20, 23, 24],
    description: "C-12 + C-12 fuses into Ne-20, Na-23, or Mg-24. Only stars heavier than about 8 solar masses ever ignite carbon."
  },
  {
    id: "neon-burning",
    name: "Neon Burning",
    tempMK: 1200,
    fuelMass: [20],
    productMass: [16, 24],
    description: "High-energy photons break Ne-20 into O-16 + He-4. The freed alpha particle then fuses with another Ne-20 to make Mg-24."
  },
  {
    id: "oxygen-burning",
    name: "Oxygen Burning",
    tempMK: 1500,
    fuelMass: [16],
    productMass: [28, 32],
    description: "O-16 + O-16 fuses into Si-28, S-32, and other intermediate-mass nuclei."
  },
  {
    id: "silicon-burning",
    name: "Silicon Burning",
    tempMK: 2700,
    fuelMass: [28],
    productMass: [56],
    description: "Sequential alpha captures and photodisintegration drive matter all the way up to Fe-56. Once the core is iron, fusion can no longer release energy — the star collapses."
  },
  {
    id: "supernova",
    name: "Supernova Nucleosynthesis",
    tempMK: 5000,
    fuelMass: [56],
    productMass: [88, 120, 138, 197, 208, 238],
    description: "The collapse-and-rebound shockwave plus rapid neutron capture (the r-process) forges elements heavier than iron — including gold, lead, and uranium — and scatters them into space."
  },
];
