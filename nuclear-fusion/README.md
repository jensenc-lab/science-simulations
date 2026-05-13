# Nuclear Fusion & Stellar Nucleosynthesis

Interactive simulation for **Utah SEEd CHEM.1.4**.

> Construct an explanation about how fusion can form new elements with greater or lesser nuclear stability. Emphasize the nuclear binding energy, with the conceptual understanding that when fusion of elements results in a more stable nucleus, large quantities of energy are released, and when fusion results in a less stable nucleus, large quantities of energy are required. Examples could include the building up of elements in the universe starting with hydrogen to form heavier elements, the composition of stars, or supernovae producing heavy elements.

## Status

🚧 **Under construction** — Chunk 1 (scaffold + data) complete.

The page currently loads three labeled panels with placeholder content. Interactive behavior is added in later chunks.

## File map

| File | Role |
| --- | --- |
| `index.html` | Page structure: header, three panel placeholders, footer, script tags. |
| `styles.css` | All styling. Dark theme matched to the rest of the simulations site. |
| `js/nuclides.js` | Data: array of nuclide records with binding energy per nucleon (MeV/A), AME2020 values. Exposed as `window.NUCLIDES`. |
| `js/stellar-stages.js` | Data: ordered list of stellar burning stages from hydrogen burning through supernova nucleosynthesis. Exposed as `window.STELLAR_STAGES`. |
| `README.md` | This file. |

## Build progress

- [x] Chunk 1 — Scaffold + data
- [ ] Chunk 2 — Binding energy curve panel
- [ ] Chunk 3 — Fusion bench panel
- [ ] Chunk 4 — Stellar nucleosynthesis tracker
- [ ] Chunk 5 — Reflection prompts, polish, dashboard link
- [ ] Chunk 6 — Spanish parallel folder (`../nuclear-fusion-es/`)
- [ ] Chunk 7 — Student worksheet
- [ ] Chunk 8 — Teacher guide
- [ ] Chunk 9 — Assessment items

## Running locally

Open `index.html` directly in a browser. The simulation uses plain `<script>` tags (no module loader, no build step), so `file://` previews work.
