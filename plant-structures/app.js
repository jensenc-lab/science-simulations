// Plant Structures Explorer — Utah SEEd 4.1.1
'use strict';

// ── Plant part info ────────────────────────────────────────────────────────────
const INFO = {
  roots:  { emoji: '🌱', title: 'Roots!',
    body: 'These spread out wide and close to the surface to catch every drop of rain in the dry desert. They also hold the cactus in place so wind can\'t blow it over.' },
  pads:   { emoji: '🌵', title: 'Stem Pads!',
    body: 'The thick, flat pads are actually the cactus stem! They store water inside like a sponge so the plant can survive long periods without rain. The green pads also do photosynthesis — making food from sunlight!' },
  spines: { emoji: '⚔️', title: 'Spines!',
    body: 'These sharp spines are actually modified leaves! They protect the cactus from animals that want to eat it for the water inside. They also create tiny shadows that help keep the cactus cool.' },
  flower: { emoji: '🌸', title: 'Flower!',
    body: 'The bright pink flower attracts bees and other pollinators. When a bee visits, it carries pollen to another cactus flower, which helps the plant reproduce and make seeds.' },
  fruit:  { emoji: '🍇', title: 'Fruit!',
    body: 'The prickly pear fruit contains seeds inside. When an animal eats the fruit, it carries the seeds to a new location. This helps new cactus plants grow in different places!' }
};

// ── SVG scene ──────────────────────────────────────────────────────────────────
// Coords: viewBox 0 0 700 480. Ground level y=322.
function buildScene() {
  const cG = '#5aaa30', cD = '#3d8520'; // cactus green, dark edge

  const defs = `<defs>
    <linearGradient id="skyG" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#4fa8e0"/><stop offset="100%" stop-color="#b5dff5"/>
    </linearGradient>
    <linearGradient id="soilG" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#c09050"/><stop offset="100%" stop-color="#8c5e28"/>
    </linearGradient>
    <!-- Spine cluster symbol -->
    <g id="sc">
      <line x1="0" y1="0" x2="0"  y2="-13" stroke="#e8d8a0" stroke-width="1.5" stroke-linecap="round"/>
      <line x1="0" y1="0" x2="10" y2="-8"  stroke="#e8d8a0" stroke-width="1.5" stroke-linecap="round"/>
      <line x1="0" y1="0" x2="-10" y2="-8" stroke="#e8d8a0" stroke-width="1.5" stroke-linecap="round"/>
      <line x1="0" y1="0" x2="12" y2="2"   stroke="#e8d8a0" stroke-width="1.5" stroke-linecap="round"/>
      <line x1="0" y1="0" x2="-12" y2="2"  stroke="#e8d8a0" stroke-width="1.5" stroke-linecap="round"/>
    </g>
  </defs>`;

  const bg = `
    <rect x="0" y="0" width="700" height="322" fill="url(#skyG)"/>
    <polygon points="28,322 90,246 132,278 178,232 238,322" fill="#c05030" opacity="0.6"/>
    <polygon points="496,322 554,248 596,276 646,234 700,322" fill="#b84828" opacity="0.6"/>
    <rect x="0" y="306" width="700" height="20" fill="#d4a040"/>
    <rect x="0" y="322" width="700" height="158" fill="url(#soilG)"/>
    <line x1="0" y1="322" x2="700" y2="322" stroke="#8B6014" stroke-width="2.5"/>`;

  // Roots (shallow & wide — realistic cactus roots)
  const roots = `
    <g stroke="#9b7030" stroke-width="3" fill="none" stroke-linecap="round">
      <path d="M350 330 Q350 370 348 418"/>
      <path d="M348 340 Q240 346 125 362"/>
      <path d="M348 340 Q458 346 590 358"/>
      <path d="M190 352 Q150 366 118 382"/>
      <path d="M508 354 Q548 368 578 385"/>
      <path d="M130 360 Q98 374 78 394"/>
      <path d="M562 358 Q604 374 628 394"/>
    </g>`;

  // Cactus pads (base stem → main → left → right → top)
  const pads = `
    <ellipse cx="350" cy="304" rx="16" ry="20" fill="${cD}"/>
    <ellipse cx="350" cy="256" rx="52" ry="60" fill="${cG}" stroke="${cD}" stroke-width="2.5"/>
    <ellipse cx="282" cy="204" rx="44" ry="54" fill="${cG}" stroke="${cD}" stroke-width="2.5"/>
    <ellipse cx="418" cy="210" rx="42" ry="52" fill="${cG}" stroke="${cD}" stroke-width="2.5"/>
    <ellipse cx="306" cy="148" rx="37" ry="45" fill="${cG}" stroke="${cD}" stroke-width="2.5"/>`;

  // Spine clusters: [x, y] — scattered over all four pads
  const sp = [
    338,225, 382,228, 356,270, 315,260, 348,294,   // main pad
    268,180, 304,183, 272,216, 252,222, 286,242,   // left pad
    420,182, 446,198, 438,228, 398,220, 418,246,   // right pad
    292,126, 326,132, 308,162, 282,152, 326,166    // top pad
  ];
  let spines = '<g>';
  for (let i = 0; i < sp.length; i += 2)
    spines += `<use href="#sc" transform="translate(${sp[i]},${sp[i+1]})"/>`;
  spines += '</g>';

  // Flower on top pad (rotate 6 petals around center)
  const fx = 306, fy = 108;
  const petals = [0,60,120,180,240,300].map(a =>
    `<ellipse cx="${fx}" cy="${fy - 17}" rx="9" ry="18" fill="#e91e8c" opacity="0.92"
      transform="rotate(${a},${fx},${fy})"/>`).join('');
  const flower = `${petals}
    <circle cx="${fx}" cy="${fy}" r="12" fill="#f9c623"/>
    <circle cx="${fx}" cy="${fy}" r="5"  fill="#e67e22"/>`;

  // Fruit on right pad
  const fruit = `
    <ellipse cx="440" cy="183" rx="20" ry="15" fill="#8e1244"/>
    <ellipse cx="434" cy="178" rx="7"  ry="5"  fill="#c01860" opacity="0.5"/>
    <circle  cx="443" cy="182" r="3"           fill="#ff79b0" opacity="0.7"/>`;

  // Clickable hotspots with pulsing glow
  const hotspots = `
    <circle class="hs" data-part="roots"  cx="350" cy="388" r="30" fill="#27ae60" stroke="#27ae60" stroke-width="3" opacity="0.25"/>
    <circle class="hs" data-part="pads"   cx="350" cy="256" r="34" fill="#f39c12" stroke="#f39c12" stroke-width="3" opacity="0.22"/>
    <circle class="hs" data-part="spines" cx="282" cy="204" r="28" fill="#e74c3c" stroke="#e74c3c" stroke-width="3" opacity="0.22"/>
    <circle class="hs" data-part="flower" cx="${fx}"  cy="${fy}"  r="24" fill="#e91e8c" stroke="#e91e8c" stroke-width="3" opacity="0.22"/>
    <circle class="hs" data-part="fruit"  cx="440" cy="183" r="24" fill="#8e1244" stroke="#8e1244" stroke-width="3" opacity="0.22"/>`;

  // Part labels (small, colored, positioned near hotspots)
  const labels = `
    <text x="386" y="393" font-size="13" fill="#27ae60" font-weight="800" font-family="Segoe UI,system-ui,sans-serif">Roots</text>
    <text x="390" y="258" font-size="13" fill="#c07010" font-weight="800" font-family="Segoe UI,system-ui,sans-serif">Stem Pads</text>
    <text x="196" y="210" font-size="13" fill="#e74c3c" font-weight="800" font-family="Segoe UI,system-ui,sans-serif">Spines</text>
    <text x="${fx+28}" y="${fy+4}" font-size="13" fill="#c0185e" font-weight="800" font-family="Segoe UI,system-ui,sans-serif">Flower</text>
    <text x="464" y="188" font-size="13" fill="#8e1244" font-weight="800" font-family="Segoe UI,system-ui,sans-serif">Fruit</text>
    <text x="8"  y="472" font-size="11" fill="#ccc" font-family="Segoe UI,system-ui,sans-serif">Utah Desert — Prickly Pear Cactus (Opuntia)</text>`;

  return defs + bg + roots + pads + spines + flower + fruit + hotspots + labels;
}

// ── DOM helpers ────────────────────────────────────────────────────────────────
function showInfo(part) {
  const d = INFO[part];
  document.getElementById('infoEmoji').textContent = d.emoji;
  document.getElementById('infoTitle').textContent = d.title;
  document.getElementById('infoBody').textContent  = d.body;
  document.getElementById('infoPanel').classList.remove('hidden');
}

function hideInfo() {
  document.getElementById('infoPanel').classList.add('hidden');
}

// ── Init ───────────────────────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  // Draw desert scene
  document.getElementById('plantSvg').innerHTML = buildScene();

  // Hotspot clicks (delegated)
  document.getElementById('plantSvg').addEventListener('click', e => {
    const part = e.target.dataset.part;
    if (part) showInfo(part);
  });

  // Close info panel
  document.getElementById('infoClose').addEventListener('click', hideInfo);

  // Environment buttons
  document.querySelectorAll('.env-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.env-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const env = btn.dataset.env;
      const cs = document.getElementById('comingSoon');
      const envNames = { forest: 'Utah Forest', wetland: 'Utah Wetland' };
      if (env !== 'desert') {
        document.getElementById('envName').textContent = envNames[env];
        cs.classList.remove('hidden');
      } else {
        cs.classList.add('hidden');
      }
      hideInfo();
    });
  });

  // Standard badge popup
  document.getElementById('stdBtn').addEventListener('click', () =>
    document.getElementById('stdPopup').classList.remove('hidden'));
  document.getElementById('stdClose').addEventListener('click', () =>
    document.getElementById('stdPopup').classList.add('hidden'));
  document.getElementById('stdPopup').addEventListener('click', e => {
    if (e.target === document.getElementById('stdPopup'))
      document.getElementById('stdPopup').classList.add('hidden');
  });
});
