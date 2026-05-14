// Nombres y descripciones amigables de reacciones de fusión estelar bien conocidas.
// El banco de fusión consulta pares de reactivos contra esta tabla para mostrar
// contexto auténtico. Lo que no esté en esta lista sigue funcionando en el banco
// (mediante la conservación de masa+Z en QValue.findProduct) — solo recibe una
// descripción genérica.
//
// La coincidencia de reactivos es insensible al orden (ver findCuratedReaction en q-value.js).

window.REACTIONS = [
  {
    reactants: [{ mass: 1, protons: 1 }, { mass: 2, protons: 1 }],
    product:    { mass: 3, protons: 2 },
    name: "Protón + Deuterio → Helio-3",
    description: "Un paso clave en la cadena p-p que alimenta al Sol. Un protón se fusiona con deuterio para formar helio-3.",
  },
  {
    reactants: [{ mass: 3, protons: 2 }, { mass: 3, protons: 2 }],
    product:    { mass: 4, protons: 2 },
    name: "Helio-3 + Helio-3 → Helio-4",
    description: "Dos núcleos de He-3 se combinan para formar He-4 (liberando dos protones en la reacción real). Esto completa la rama dominante de la cadena p-p.",
  },
  {
    reactants: [{ mass: 4, protons: 2 }, { mass: 4, protons: 2 }],
    product:    { mass: 8, protons: 4 },
    name: "Alfa + Alfa → Berilio-8 (inestable)",
    description: "Dos núcleos de He-4 se fusionan momentáneamente en Be-8, que en realidad es menos estable por nucleón que el He-4 — el Be-8 se descompone en ~10⁻¹⁶ segundos. Este 'cuello de botella del berilio' es la razón por la que las estrellas necesitan el proceso triple alfa.",
  },
  {
    reactants: [{ mass: 4, protons: 2 }, { mass: 8, protons: 4 }],
    product:    { mass: 12, protons: 6 },
    name: "Triple alfa → Carbono-12",
    description: "Si un tercer He-4 atrapa al fugaz Be-8 antes de que decaiga, se forma el C-12 estable. Así es como las estrellas producen todo el carbono que hay en tu cuerpo.",
  },
  {
    reactants: [{ mass: 4, protons: 2 }, { mass: 12, protons: 6 }],
    product:    { mass: 16, protons: 8 },
    name: "Alfa + Carbono-12 → Oxígeno-16",
    description: "El helio-4 es capturado por el C-12 para formar O-16. Así es como las estrellas producen la mayor parte del oxígeno del universo — incluyendo el oxígeno que respiras.",
  },
  {
    reactants: [{ mass: 12, protons: 6 }, { mass: 12, protons: 6 }],
    product:    { mass: 24, protons: 12 },
    name: "Carbono + Carbono → Magnesio-24",
    description: "Comienza en estrellas más pesadas que unas 8 masas solares, una vez que el helio se ha agotado. Dos núcleos de C-12 se fusionan en Mg-24.",
  },
  {
    reactants: [{ mass: 16, protons: 8 }, { mass: 16, protons: 8 }],
    product:    { mass: 32, protons: 16 },
    name: "Oxígeno + Oxígeno → Azufre-32",
    description: "Combustión de oxígeno en estrellas muy masivas. Dos núcleos de O-16 se fusionan en S-32 (uno de varios canales de producto reales).",
  },
  {
    reactants: [{ mass: 28, protons: 14 }, { mass: 28, protons: 14 }],
    product:    { mass: 56, protons: 26 },
    name: "Silicio + Silicio → Hierro-56",
    description: "Representación simplificada en un solo paso de la combustión de silicio. En realidad, esto procede a través de muchas capturas alfa sucesivas — pero el estado final es el mismo: Fe-56, el núcleo más estable por nucleón.",
  },
  {
    reactants: [{ mass: 56, protons: 26 }, { mass: 4, protons: 2 }],
    product:    { mass: 60, protons: 28 },
    name: "Hierro + Alfa → Níquel-60 (endotérmica)",
    description: "Más allá del hierro, la fusión absorbe energía en lugar de liberarla. (El Ni-60 no está en nuestra lista de núclidos, así que este intento recurre a la conservación de masa — y muestra que se requiere energía.) Por eso las estrellas con núcleo de hierro colapsan en lugar de seguir fusionando.",
  },
];
