// Q-value / energy-delta helper for the fusion bench.
// Pure module — no DOM access, no side effects beyond exposing window.QValue.
//
// Conservation rule: in pure fusion, total mass and total protons are conserved.
// We use that to look up a candidate product in window.NUCLIDES.
//
// Energy convention: we compare the product's binding energy per nucleon
// against a NUCLEON-WEIGHTED mean of the reactants' BE/A. This is equivalent
// to comparing total binding energies — the physically meaningful quantity —
// and avoids the nonsense of arithmetic-averaging BE/A across two nuclei of
// very different sizes (e.g. H-1 + Fe-56).

(function () {
  'use strict';

  // ── Curated reaction lookup (order-insensitive on the reactant pair) ───
  function curatedMatches(curatedPair, pair) {
    if (!curatedPair || curatedPair.length !== 2 || pair.length !== 2) return false;
    const sameOrder =
      curatedPair[0].mass === pair[0].mass && curatedPair[0].protons === pair[0].protons &&
      curatedPair[1].mass === pair[1].mass && curatedPair[1].protons === pair[1].protons;
    const reverseOrder =
      curatedPair[0].mass === pair[1].mass && curatedPair[0].protons === pair[1].protons &&
      curatedPair[1].mass === pair[0].mass && curatedPair[1].protons === pair[0].protons;
    return sameOrder || reverseOrder;
  }

  function findCuratedReaction(reactants) {
    if (!Array.isArray(reactants) || reactants.length !== 2) return null;
    const table = window.REACTIONS || [];
    const pair = reactants.map((n) => ({ mass: n.mass, protons: n.protons }));
    for (const entry of table) {
      if (curatedMatches(entry.reactants, pair)) return entry;
    }
    return null;
  }

  // ── 3-tier product lookup against NUCLIDES ─────────────────────────────
  function findProduct(reactants) {
    if (!Array.isArray(reactants) || reactants.length === 0) return null;
    const nuclides = window.NUCLIDES || [];
    const totalMass = reactants.reduce((s, n) => s + n.mass, 0);
    const totalProtons = reactants.reduce((s, n) => s + n.protons, 0);

    // Tier 1: exact (mass, protons) match — true fusion conservation.
    let hit = nuclides.find((n) => n.mass === totalMass && n.protons === totalProtons);
    if (hit) return hit;

    // Tier 2: mass-only match — accounts for real reactions that emit
    // protons or positrons we don't explicitly model.
    hit = nuclides.find((n) => n.mass === totalMass);
    if (hit) return hit;

    // Tier 3: nothing in our dataset has the right mass.
    return null;
  }

  // ── Energy delta per nucleon ───────────────────────────────────────────
  function computeDelta(reactants, product) {
    if (!Array.isArray(reactants) || reactants.length === 0 || !product) return 0;
    const totalNucleons = reactants.reduce((s, n) => s + n.mass, 0);
    if (totalNucleons === 0) return 0;
    // Nucleon-weighted mean BE/A across reactants.
    const totalReactantBE = reactants.reduce((s, n) => s + n.bePerNucleon * n.mass, 0);
    const meanReactantBE = totalReactantBE / totalNucleons;
    const delta = product.bePerNucleon - meanReactantBE;
    return Math.round(delta * 1000) / 1000;
  }

  // ── Convenience evaluate() ─────────────────────────────────────────────
  function evaluate(reactants) {
    const baseResult = {
      reactants: reactants || [],
      product: null,
      deltaBEPerNucleon: null,
      energyDirection: null,
      isMoreStable: null,
      curatedReaction: null,
    };
    if (!Array.isArray(reactants) || reactants.length !== 2) return baseResult;

    const curated = findCuratedReaction(reactants);
    baseResult.curatedReaction = curated;

    // Prefer the curated entry's product when one is specified AND it exists
    // in our nuclide data. Otherwise fall back to mass+Z conservation.
    let product = null;
    if (curated && curated.product) {
      const nuclides = window.NUCLIDES || [];
      const curatedProduct = nuclides.find(
        (n) => n.mass === curated.product.mass && n.protons === curated.product.protons
      );
      product = curatedProduct || findProduct(reactants);
    } else {
      product = findProduct(reactants);
    }

    if (!product) return baseResult;

    const delta = computeDelta(reactants, product);
    baseResult.product = product;
    baseResult.deltaBEPerNucleon = delta;
    baseResult.energyDirection = delta > 0 ? 'released' : 'required';
    baseResult.isMoreStable = delta > 0;
    return baseResult;
  }

  window.QValue = {
    findProduct: findProduct,
    computeDelta: computeDelta,
    evaluate: evaluate,
  };
})();
