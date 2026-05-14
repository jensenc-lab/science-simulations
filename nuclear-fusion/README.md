# Nuclear Fusion & Stellar Nucleosynthesis

Interactive simulation for **Utah SEEd CHEM.1.4**.

> Construct an explanation about how fusion can form new elements with greater or lesser nuclear stability. Emphasize the nuclear binding energy, with the conceptual understanding that when fusion of elements results in a more stable nucleus, large quantities of energy are released, and when fusion results in a less stable nucleus, large quantities of energy are required. Examples could include the building up of elements in the universe starting with hydrogen to form heavier elements, the composition of stars, or supernovae producing heavy elements.

## Status

✅ **v1 complete.** Three interactive panels, the "Construct an Explanation" investigation section, reduced-motion fallback, fullscreen toggle, and dashboard card are all in place.

## Files

| File | Role |
| --- | --- |
| `index.html` | Page structure: header, three panel `<section>`s, Investigation section, footer, script tags. |
| `styles.css` | All styling. Dark theme matched to the rest of the simulations site. |
| `js/nuclides.js` | Data: array of 32 nuclide records with binding energy per nucleon (MeV/A). Exposed as `window.NUCLIDES`. |
| `js/stellar-stages.js` | Data: ordered list of stellar burning stages (H → He → C → Ne → O → Si → Supernova). Exposed as `window.STELLAR_STAGES`. |
| `js/reactions.js` | Data: curated reaction table with friendly names and descriptions for well-known stellar fusion reactions. Exposed as `window.REACTIONS`. |
| `js/q-value.js` | Physics helper. Computes the energy delta per nucleon for a fusion attempt using a nucleon-weighted mean BE/A. Exposes `window.QValue.{findProduct, computeDelta, evaluate}`. Pure module, no DOM. |
| `js/binding-curve.js` | Interactive SVG chart of binding energy per nucleon vs. mass number. Hover/click tooltips, info card, and a public API (`window.BindingCurve`) the fusion bench calls into to highlight reactants/products. |
| `js/fusion-bench.js` | Click-to-select nuclide palette, two reactant slots, Fuse! button, and result card. Exposes `window.FusionBench.{init, fuse, reset}`. |
| `js/stellar-tracker.js` | Seven-stage burning progression with an SVG star cross-section, a stage details panel, and a supernova animation. Exposes `window.StellarTracker.{init, setStage, next, previous, reset, triggerSupernova}`. |
| `js/fullscreen.js` | Header fullscreen toggle (Fullscreen API with Safari prefix fallback). |

## Usage

Open `index.html` directly in a browser — plain `<script>` tags, no module loader or build step.

### Recommended student flow

1. **Fusion Bench** (top-left) — pick two nuclides and press Fuse! Try several combinations and notice which reactions release energy vs. require it.
2. **Binding Energy Curve** (top-right) — hover the points and watch them light up when you fuse in the bench. Notice that fusion *toward* Fe-56 releases energy and fusion *past* Fe-56 requires it.
3. **Stellar Nucleosynthesis** (full-width below) — walk through the burning stages from hydrogen to silicon, then trigger a supernova to forge gold, lead, and uranium.
4. **Investigation** (bottom) — the five-activity scaffold that walks students through constructing the explanation CHEM.1.4 asks for.

### Reduced-motion behavior

When the OS / browser has *Reduce Motion* enabled (`prefers-reduced-motion: reduce`), the dramatic supernova animation is replaced by a brief white flash (~300 ms total) and a direct cut to the post-supernova state. Heavy-element cards appear without the kinetic explosion. All other non-essential transitions across the page are likewise dampened.

### Spanish version

A parallel `nuclear-fusion-es/` folder is planned in a later chunk. The EN | ES link in the header will start working once that folder exists.

## Data sources

Nuclear binding energy values are from **AME2020** (Wang et al., *Chinese Physics C* 45, 030003, 2021), rounded to 3 decimals. The stellar burning stage data is qualitatively standard (any introductory stellar-nucleosynthesis reference).

## Build progress

- [x] Chunk 1 — Scaffold + data
- [x] Chunk 2 — Binding energy curve panel
- [x] Chunk 3 — Fusion bench panel
- [x] Chunk 4 — Stellar nucleosynthesis tracker
- [x] Chunk 5 — Investigation prompts, reduced-motion fallback, polish, dashboard card
- [ ] Chunk 6 — Spanish parallel folder (`../nuclear-fusion-es/`)
- [ ] Chunk 7 — Student worksheet
- [ ] Chunk 8 — Teacher guide
- [ ] Chunk 9 — Assessment items
