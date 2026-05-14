// Principales etapas de fusión/combustión en la nucleosíntesis estelar, en orden.
// Las usa el panel de Nucleosíntesis Estelar para recorrer paso a paso
// lo que ocurre dentro de una estrella masiva y, eventualmente, en una supernova.

window.STELLAR_STAGES = [
  {
    id: "hydrogen-burning",
    name: "Combustión de hidrógeno",
    tempMK: 15,
    fuelMass: [1],
    productMass: [4],
    description: "Los protones se fusionan mediante la cadena p-p (o el ciclo CNO en estrellas más masivas) para formar helio-4. Esto es lo que alimenta a las estrellas de secuencia principal como el Sol durante miles de millones de años."
  },
  {
    id: "helium-burning",
    name: "Combustión de helio",
    tempMK: 100,
    fuelMass: [4],
    productMass: [12, 16],
    description: "El proceso triple alfa fusiona tres núcleos de He-4 para formar C-12. Algunos núcleos de C-12 luego capturan otro He-4 para formar O-16. Comienza cuando el núcleo se queda sin hidrógeno."
  },
  {
    id: "carbon-burning",
    name: "Combustión de carbono",
    tempMK: 600,
    fuelMass: [12],
    productMass: [20, 23, 24],
    description: "C-12 + C-12 se fusiona en Ne-20, Na-23 o Mg-24. Solo las estrellas más pesadas que unas 8 masas solares llegan a encender el carbono."
  },
  {
    id: "neon-burning",
    name: "Combustión de neón",
    tempMK: 1200,
    fuelMass: [20],
    productMass: [16, 24],
    description: "Fotones de alta energía rompen el Ne-20 en O-16 + He-4. La partícula alfa liberada se fusiona luego con otro Ne-20 para formar Mg-24."
  },
  {
    id: "oxygen-burning",
    name: "Combustión de oxígeno",
    tempMK: 1500,
    fuelMass: [16],
    productMass: [28, 32],
    description: "O-16 + O-16 se fusiona en Si-28, S-32 y otros núcleos de masa intermedia."
  },
  {
    id: "silicon-burning",
    name: "Combustión de silicio",
    tempMK: 2700,
    fuelMass: [28],
    productMass: [56],
    description: "Capturas alfa sucesivas y fotodesintegración llevan la materia hasta el Fe-56. Una vez que el núcleo es de hierro, la fusión ya no puede liberar energía — la estrella colapsa."
  },
  {
    id: "supernova",
    name: "Nucleosíntesis de supernova",
    tempMK: 5000,
    fuelMass: [56],
    productMass: [88, 120, 138, 197, 208, 238],
    description: "La onda de choque del colapso y rebote, junto con la captura rápida de neutrones (el proceso r), forja elementos más pesados que el hierro — incluyendo oro, plomo y uranio — y los dispersa en el espacio."
  },
];
