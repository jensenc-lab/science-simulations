// Plant Structures Explorer — Utah SEEd 4.1.1
'use strict';

// ── Translations (keyed by lang → env → parts/labels) ─────────────────────────
const T = {
  en: {
    title: '🌱 Plant Structures Explorer',
    stdTitle: 'Utah SEEd Standard 4.1.1',
    stdDesc: 'Learn how the parts of a plant help it <strong>survive</strong>, <strong>grow</strong>, and <strong>reproduce</strong> in its environment!',
    envDesert: 'Utah Desert', envForest: 'Utah Forest', envWetland: 'Utah Wetland',
    comingSoon: n => `🌿 Coming Soon! The <strong>${n}</strong> plant is being built. Try the Desert for now!`,
    hint: '👆 Click the glowing spots on the plant to learn about each part!',
    desert: {
      labels: { roots:'Roots', pads:'Stem Pads', spines:'Spines', flower:'Flower', fruit:'Fruit' },
      parts: {
        roots:  { emoji:'🌱', title:'Roots!',        body:'These spread out wide and close to the surface to catch every drop of rain in the dry desert. They also hold the cactus in place so wind can\'t blow it over.' },
        pads:   { emoji:'🌵', title:'Stem Pads!',    body:'The thick, flat pads are actually the cactus stem! They store water inside like a sponge so the plant can survive long periods without rain. The green pads also do photosynthesis — making food from sunlight!' },
        spines: { emoji:'⚔️', title:'Spines!',       body:'These sharp spines are actually modified leaves! They protect the cactus from animals that want to eat it for the water inside. They also create tiny shadows that help keep the cactus cool.' },
        flower: { emoji:'🌸', title:'Flower!',       body:'The bright pink flower attracts bees and other pollinators. When a bee visits, it carries pollen to another cactus flower, which helps the plant reproduce and make seeds.' },
        fruit:  { emoji:'🍇', title:'Fruit!',        body:'The prickly pear fruit contains seeds inside. When an animal eats the fruit, it carries the seeds to a new location. This helps new cactus plants grow in different places!' }
      }
    },
    forest: {
      labels: { roots:'Roots', bark:'Trunk & Bark', leaves:'Leaves', flowers:'Catkin Flowers', sprouts:'Root Sprouts' },
      parts: {
        roots:   { emoji:'🌱', title:'Roots!',           body:'Aspen roots spread far underground and connect to other aspen trees nearby. A whole grove of aspens can actually be ONE organism sharing the same root system! The roots absorb water and nutrients from the rich forest soil.' },
        bark:    { emoji:'🪵', title:'Trunk & Bark!',    body:'The white bark reflects sunlight to protect the tree from sunburn. Inside the trunk, tiny tubes carry water UP from the roots to the leaves, and food DOWN from the leaves to the rest of the tree. The bark also protects the tree from insects and disease.' },
        leaves:  { emoji:'🍃', title:'Leaves!',          body:'The flat, round leaves catch lots of sunlight to make food through photosynthesis. They flutter and shake in the slightest breeze — that\'s why they\'re called QUAKING aspens! In fall, the leaves turn bright gold and yellow before dropping off for winter.' },
        flowers: { emoji:'🌼', title:'Catkin Flowers!',  body:'These fuzzy, dangling flowers appear in spring before the leaves grow. Wind carries pollen from one catkin to another, helping the tree reproduce. The tiny seeds have fluffy cotton-like hairs that help them float through the air to new locations.' },
        sprouts: { emoji:'🌿', title:'Root Sprouts!',    body:'Aspens have a superpower — they can grow NEW trees from their roots! Small shoots pop up from the underground root system and grow into new trees. This is why aspens often grow in big groups called groves. The Pando aspen grove in Utah is one of the largest living organisms on Earth!' }
      }
    },
    wetland: {
      labels: { roots:'Roots & Rhizomes', stem:'Stem', leaves:'Leaves', seedhead:'Seed Head', seeds:'Seeds' },
      parts: {
        roots:   { emoji:'🌱', title:'Roots & Rhizomes!', body:'Cattails have thick underground stems called rhizomes that grow sideways through the mud. New cattail plants sprout up from these rhizomes — that\'s why cattails grow in big clusters! The roots are specially designed to survive in waterlogged soil where other plants would drown. They can even filter dirty water and help keep wetlands clean!' },
        stem:    { emoji:'🌿', title:'Stem!',              body:'The tall, straight stem can grow up to 10 feet high! It\'s round and sturdy to hold the heavy seed head above the water. Inside, the stem has air spaces — like tiny straws — that carry oxygen down to the roots underwater. This is how the plant breathes even though its roots are submerged in mud!' },
        leaves:  { emoji:'🍃', title:'Leaves!',            body:'The long, flat leaves are like green ribbons that wrap around the base of the stem. They catch sunlight for photosynthesis — making food from sunlight, water, and air. Native Americans and early settlers used cattail leaves to weave mats, baskets, and even roofs for shelters!' },
        seedhead:{ emoji:'🌰', title:'Seed Head!',         body:'The brown, fuzzy cylinder is packed with up to 250,000 tiny seeds! It looks like a hot dog on a stick. The seed head protects the seeds while they develop. When they\'re ready, the seed head bursts open and the fluffy seeds fly away in the wind.' },
        seeds:   { emoji:'🪶', title:'Seeds!',             body:'Each tiny seed has a fluffy tuft of white hair attached to it — like a tiny parachute! When the wind blows, thousands of seeds float through the air to land in new wet areas where they can grow. This is how cattails spread to new wetlands. One cattail can send out 250,000 seeds!' }
      }
    }
  },
  es: {
    title: '🌱 Explorador de Estructuras de Plantas',
    stdTitle: 'Estándar Utah SEEd 4.1.1',
    stdDesc: '¡Aprende cómo las partes de una planta la ayudan a <strong>sobrevivir</strong>, <strong>crecer</strong> y <strong>reproducirse</strong> en su ambiente!',
    envDesert: 'Desierto de Utah', envForest: 'Bosque de Utah', envWetland: 'Humedal de Utah',
    comingSoon: n => `🌿 ¡Próximamente! La planta del <strong>${n}</strong> está en construcción. ¡Intenta el Desierto por ahora!`,
    hint: '👆 ¡Haz clic en los puntos brillantes de la planta para aprender sobre cada parte!',
    desert: {
      labels: { roots:'Raíces', pads:'Tallos', spines:'Espinas', flower:'Flor', fruit:'Fruto' },
      parts: {
        roots:  { emoji:'🌱', title:'¡Raíces!',                    body:'Estas se extienden ampliamente y cerca de la superficie para atrapar cada gota de lluvia en el desierto seco. También sostienen el cactus en su lugar para que el viento no lo derribe.' },
        pads:   { emoji:'🌵', title:'¡Tallos en forma de paleta!', body:'Las paletas gruesas y planas son en realidad el tallo del cactus. Almacenan agua adentro como una esponja para que la planta pueda sobrevivir largos períodos sin lluvia. ¡Las paletas verdes también hacen fotosíntesis — produciendo alimento con la luz del sol!' },
        spines: { emoji:'⚔️', title:'¡Espinas!',                   body:'Estas espinas afiladas son en realidad hojas modificadas. Protegen al cactus de los animales que quieren comérselo por el agua que tiene adentro. También crean pequeñas sombras que ayudan a mantener fresco al cactus.' },
        flower: { emoji:'🌸', title:'¡Flor!',                      body:'La flor rosa brillante atrae a las abejas y otros polinizadores. Cuando una abeja la visita, lleva el polen a otra flor de cactus, lo que ayuda a la planta a reproducirse y hacer semillas.' },
        fruit:  { emoji:'🍇', title:'¡Fruto!',                     body:'El fruto de la tuna contiene semillas adentro. Cuando un animal come el fruto, lleva las semillas a un lugar nuevo. ¡Esto ayuda a que nuevas plantas de cactus crezcan en diferentes lugares!' }
      }
    },
    forest: {
      labels: { roots:'Raíces', bark:'Tronco y Corteza', leaves:'Hojas', flowers:'Flores Amento', sprouts:'Brotes de Raíz' },
      parts: {
        roots:   { emoji:'🌱', title:'¡Raíces!',              body:'Las raíces del álamo temblón se extienden bajo tierra y se conectan con otros álamos cercanos. ¡Un bosque entero de álamos puede ser UN solo organismo compartiendo el mismo sistema de raíces! Las raíces absorben agua y nutrientes del rico suelo del bosque.' },
        bark:    { emoji:'🪵', title:'¡Tronco y Corteza!',   body:'La corteza blanca refleja la luz del sol para proteger al árbol de las quemaduras. Dentro del tronco, pequeños tubos llevan agua HACIA ARRIBA desde las raíces hasta las hojas, y alimento HACIA ABAJO desde las hojas al resto del árbol. La corteza también protege al árbol de insectos y enfermedades.' },
        leaves:  { emoji:'🍃', title:'¡Hojas!',               body:'Las hojas planas y redondas capturan mucha luz solar para producir alimento a través de la fotosíntesis. Se agitan y tiemblan con la más mínima brisa — ¡por eso se llaman álamos TEMBLONES! En otoño, las hojas se vuelven doradas y amarillas antes de caer en invierno.' },
        flowers: { emoji:'🌼', title:'¡Flores Amento!',       body:'Estas flores peludas y colgantes aparecen en primavera antes de que crezcan las hojas. El viento lleva el polen de un amento a otro, ayudando al árbol a reproducirse. Las pequeñas semillas tienen pelitos como algodón que les ayudan a flotar por el aire a nuevos lugares.' },
        sprouts: { emoji:'🌿', title:'¡Brotes de Raíz!',     body:'Los álamos temblones tienen un superpoder — ¡pueden hacer crecer NUEVOS árboles desde sus raíces! Pequeños brotes salen del sistema de raíces bajo tierra y crecen hasta convertirse en nuevos árboles. Por eso los álamos a menudo crecen en grandes grupos llamados arboledas. ¡La arboleda Pando en Utah es uno de los organismos vivos más grandes de la Tierra!' }
      }
    },
    wetland: {
      labels: { roots:'Raíces y Rizomas', stem:'Tallo', leaves:'Hojas', seedhead:'Cabeza de Semillas', seeds:'Semillas' },
      parts: {
        roots:   { emoji:'🌱', title:'¡Raíces y Rizomas!',       body:'Los espadañales tienen tallos gruesos subterráneos llamados rizomas que crecen de lado a través del lodo. ¡Nuevas plantas de espadaña brotan de estos rizomas — por eso crecen en grandes grupos! Las raíces están especialmente diseñadas para sobrevivir en suelo encharcado donde otras plantas se ahogarían. ¡Incluso pueden filtrar agua sucia y ayudar a mantener limpios los humedales!' },
        stem:    { emoji:'🌿', title:'¡Tallo!',                   body:'¡El tallo alto y recto puede crecer hasta 3 metros de altura! Es redondo y resistente para sostener la pesada cabeza de semillas sobre el agua. Adentro, el tallo tiene espacios de aire — como pequeños popotes — que llevan oxígeno hacia abajo hasta las raíces bajo el agua. ¡Así es como la planta respira aunque sus raíces estén sumergidas en el lodo!' },
        leaves:  { emoji:'🍃', title:'¡Hojas!',                   body:'Las hojas largas y planas son como cintas verdes que envuelven la base del tallo. Capturan la luz del sol para la fotosíntesis — produciendo alimento con la luz solar, el agua y el aire. ¡Los nativos americanos y los primeros colonos usaban las hojas de la espadaña para tejer tapetes, canastas e incluso techos para refugios!' },
        seedhead:{ emoji:'🌰', title:'¡Cabeza de Semillas!',      body:'¡El cilindro café y peludo está lleno de hasta 250,000 pequeñas semillas! Parece un hot dog en un palito. La cabeza de semillas protege las semillas mientras se desarrollan. Cuando están listas, la cabeza se abre y las semillas esponjosas vuelan con el viento.' },
        seeds:   { emoji:'🪶', title:'¡Semillas!',                body:'Cada pequeña semilla tiene un mechón esponjoso de pelo blanco — ¡como un pequeño paracaídas! Cuando sopla el viento, miles de semillas flotan por el aire para aterrizar en nuevas áreas húmedas donde pueden crecer. Así es como las espadañas se extienden a nuevos humedales. ¡Una sola espadaña puede soltar 250,000 semillas!' }
      }
    }
  }
};

// ── State ──────────────────────────────────────────────────────────────────────
let lang = 'en', currentPart = null, currentEnv = 'desert';
const $ = id => document.getElementById(id);

// ── Desert scene (Prickly Pear Cactus) ────────────────────────────────────────
function buildDesertScene() {
  const cG = '#5aaa30', cD = '#3d8520';
  const defs = `<defs>
    <linearGradient id="skyG" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#4fa8e0"/><stop offset="100%" stop-color="#b5dff5"/>
    </linearGradient>
    <linearGradient id="soilG" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#c09050"/><stop offset="100%" stop-color="#8c5e28"/>
    </linearGradient>
    <g id="sc">
      <line x1="0" y1="0" x2="0"   y2="-13" stroke="#e8d8a0" stroke-width="1.5" stroke-linecap="round"/>
      <line x1="0" y1="0" x2="10"  y2="-8"  stroke="#e8d8a0" stroke-width="1.5" stroke-linecap="round"/>
      <line x1="0" y1="0" x2="-10" y2="-8"  stroke="#e8d8a0" stroke-width="1.5" stroke-linecap="round"/>
      <line x1="0" y1="0" x2="12"  y2="2"   stroke="#e8d8a0" stroke-width="1.5" stroke-linecap="round"/>
      <line x1="0" y1="0" x2="-12" y2="2"   stroke="#e8d8a0" stroke-width="1.5" stroke-linecap="round"/>
    </g>
  </defs>`;
  const bg = `
    <rect x="0" y="0" width="700" height="322" fill="url(#skyG)"/>
    <polygon points="28,322 90,246 132,278 178,232 238,322" fill="#c05030" opacity="0.6"/>
    <polygon points="496,322 554,248 596,276 646,234 700,322" fill="#b84828" opacity="0.6"/>
    <rect x="0" y="306" width="700" height="20" fill="#d4a040"/>
    <rect x="0" y="322" width="700" height="158" fill="url(#soilG)"/>
    <line x1="0" y1="322" x2="700" y2="322" stroke="#8B6014" stroke-width="2.5"/>`;
  const roots = `
    <g stroke="#9b7030" stroke-width="3" fill="none" stroke-linecap="round">
      <path d="M350 330 Q350 370 348 418"/>
      <path d="M348 340 Q240 346 125 362"/><path d="M348 340 Q458 346 590 358"/>
      <path d="M190 352 Q150 366 118 382"/><path d="M508 354 Q548 368 578 385"/>
      <path d="M130 360 Q98 374 78 394"/> <path d="M562 358 Q604 374 628 394"/>
    </g>`;
  const pads = `
    <ellipse cx="350" cy="304" rx="16" ry="20" fill="${cD}"/>
    <ellipse cx="350" cy="256" rx="52" ry="60" fill="${cG}" stroke="${cD}" stroke-width="2.5"/>
    <ellipse cx="282" cy="204" rx="44" ry="54" fill="${cG}" stroke="${cD}" stroke-width="2.5"/>
    <ellipse cx="418" cy="210" rx="42" ry="52" fill="${cG}" stroke="${cD}" stroke-width="2.5"/>
    <ellipse cx="306" cy="148" rx="37" ry="45" fill="${cG}" stroke="${cD}" stroke-width="2.5"/>`;
  const sp = [338,225, 382,228, 356,270, 315,260, 348,294, 268,180, 304,183, 272,216, 252,222, 286,242, 420,182, 446,198, 438,228, 398,220, 418,246, 292,126, 326,132, 308,162, 282,152, 326,166];
  let spines = '<g>';
  for (let i = 0; i < sp.length; i += 2) spines += `<use href="#sc" transform="translate(${sp[i]},${sp[i+1]})"/>`;
  spines += '</g>';
  const fx = 306, fy = 108;
  const flower = [0,60,120,180,240,300].map(a =>
    `<ellipse cx="${fx}" cy="${fy-17}" rx="9" ry="18" fill="#e91e8c" opacity="0.92" transform="rotate(${a},${fx},${fy})"/>`
  ).join('') + `<circle cx="${fx}" cy="${fy}" r="12" fill="#f9c623"/><circle cx="${fx}" cy="${fy}" r="5" fill="#e67e22"/>`;
  const fruit = `<ellipse cx="440" cy="183" rx="20" ry="15" fill="#8e1244"/><ellipse cx="434" cy="178" rx="7" ry="5" fill="#c01860" opacity="0.5"/><circle cx="443" cy="182" r="3" fill="#ff79b0" opacity="0.7"/>`;
  const hotspots = `
    <circle class="hs" data-part="roots"  cx="350" cy="388" r="15" fill="#27ae60" stroke="#27ae60" stroke-width="2" opacity="0.35"/>
    <circle class="hs" data-part="pads"   cx="350" cy="256" r="17" fill="#f39c12" stroke="#f39c12" stroke-width="2" opacity="0.32"/>
    <circle class="hs" data-part="spines" cx="282" cy="204" r="14" fill="#e74c3c" stroke="#e74c3c" stroke-width="2" opacity="0.32"/>
    <circle class="hs" data-part="flower" cx="${fx}" cy="${fy}" r="12" fill="#e91e8c" stroke="#e91e8c" stroke-width="2" opacity="0.32"/>
    <circle class="hs" data-part="fruit"  cx="440" cy="183" r="12" fill="#8e1244" stroke="#8e1244" stroke-width="2" opacity="0.32"/>`;
  const lf = `font-size="13" font-weight="800" font-family="Segoe UI,system-ui,sans-serif"`;
  const labels = `
    <text id="lbl-roots"  x="371" y="393" ${lf} fill="#27ae60">Roots</text>
    <text id="lbl-pads"   x="373" y="258" ${lf} fill="#c07010">Stem Pads</text>
    <text id="lbl-spines" x="196" y="210" ${lf} fill="#e74c3c">Spines</text>
    <text id="lbl-flower" x="${fx+18}" y="${fy+4}" ${lf} fill="#c0185e">Flower</text>
    <text id="lbl-fruit"  x="456" y="188" ${lf} fill="#8e1244">Fruit</text>`;
  return defs + bg + roots + pads + spines + flower + fruit + hotspots + labels;
}

// ── Forest scene (Quaking Aspen) ───────────────────────────────────────────────
function buildForestScene() {
  const defs = `<defs>
    <filter id="tGlow" x="-15%" y="-40%" width="130%" height="180%">
      <feDropShadow dx="0" dy="0" stdDeviation="2.5" flood-color="white" flood-opacity="1"/>
    </filter>
    <linearGradient id="fSkyG" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#6ab4e8"/><stop offset="100%" stop-color="#c2e4f5"/>
    </linearGradient>
    <linearGradient id="fSoilG" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#7a4822"/><stop offset="100%" stop-color="#3d2210"/>
    </linearGradient>
  </defs>`;
  const bg = `
    <rect x="0" y="0" width="700" height="322" fill="url(#fSkyG)"/>
    <g fill="white" opacity="0.82">
      <ellipse cx="118" cy="78" rx="54" ry="26"/><ellipse cx="162" cy="70" rx="40" ry="20"/><ellipse cx="78" cy="74" rx="30" ry="18"/>
      <ellipse cx="560" cy="96" rx="46" ry="22"/><ellipse cx="610" cy="90" rx="34" ry="18"/>
    </g>
    <g fill="#5a8830" opacity="0.42">
      <polygon points="46,308 64,268 82,308"/><polygon points="76,308 100,256 124,308"/>
      <polygon points="108,308 128,272 148,308"/>
      <polygon points="566,308 588,262 610,308"/><polygon points="598,308 622,254 646,308"/>
      <polygon points="633,308 653,270 673,308"/>
    </g>
    <rect x="0" y="305" width="700" height="22" fill="#5aaa2a"/>
    <rect x="0" y="315" width="700" height="12" fill="#4a9020"/>
    <rect x="0" y="322" width="700" height="158" fill="url(#fSoilG)"/>
    <line x1="0" y1="322" x2="700" y2="322" stroke="#3a2010" stroke-width="2"/>`;
  const roots = `
    <g stroke="#7a5025" stroke-width="3" fill="none" stroke-linecap="round">
      <path d="M350 330 Q350 368 350 405"/>
      <path d="M350 338 Q244 338 104 344"/><path d="M350 338 Q456 338 618 344"/>
      <path d="M198 341 Q154 346 106 352"/><path d="M502 341 Q556 346 622 352"/>
    </g>`;
  // Root sprouts: shoots emerging from root system on each side
  const sprouts = `
    <g>
      <line x1="155" y1="342" x2="155" y2="297" stroke="#4a9020" stroke-width="4" stroke-linecap="round"/>
      <ellipse cx="149" cy="293" rx="10" ry="6" fill="#6aba32" transform="rotate(-22,149,293)"/>
      <ellipse cx="161" cy="291" rx="10" ry="6" fill="#72c235" transform="rotate(22,161,291)"/>
      <ellipse cx="155" cy="287" rx="8" ry="5" fill="#80cc40"/>
      <line x1="555" y1="342" x2="555" y2="297" stroke="#4a9020" stroke-width="4" stroke-linecap="round"/>
      <ellipse cx="549" cy="293" rx="10" ry="6" fill="#6aba32" transform="rotate(-22,549,293)"/>
      <ellipse cx="561" cy="291" rx="10" ry="6" fill="#72c235" transform="rotate(22,561,291)"/>
      <ellipse cx="555" cy="287" rx="8" ry="5" fill="#80cc40"/>
    </g>`;
  // Trunk with white bark and horizontal eye-shaped marks
  const trunk = `
    <path d="M342 322 C340 240 338 158 340 98 L360 98 C362 158 360 240 358 322Z" fill="#f0e8d8" stroke="#c8b890" stroke-width="1.5"/>
    <g fill="#3a2808" opacity="0.65">
      <ellipse cx="350" cy="135" rx="9" ry="4" transform="rotate(-3,350,135)"/>
      <ellipse cx="348" cy="162" rx="8" ry="3.5" transform="rotate(2,348,162)"/>
      <ellipse cx="351" cy="190" rx="9" ry="4" transform="rotate(-2,351,190)"/>
      <ellipse cx="349" cy="216" rx="8" ry="3.5" transform="rotate(3,349,216)"/>
      <ellipse cx="350" cy="242" rx="9" ry="4" transform="rotate(-1,350,242)"/>
      <ellipse cx="348" cy="268" rx="8" ry="3.5" transform="rotate(2,348,268)"/>
      <ellipse cx="351" cy="294" rx="7" ry="3" transform="rotate(-2,351,294)"/>
    </g>`;
  // Canopy: overlapping yellow-green blobs (drawn after trunk to cover upper trunk)
  const canopy = `
    <ellipse cx="292" cy="95" rx="64" ry="55" fill="#7ec840"/>
    <ellipse cx="408" cy="91" rx="63" ry="54" fill="#7ec840"/>
    <ellipse cx="350" cy="67" rx="86" ry="71" fill="#8ad848"/>
    <ellipse cx="350" cy="44" rx="56" ry="43" fill="#9aee50" opacity="0.92"/>
    <ellipse cx="243" cy="106" rx="12" ry="10" fill="#a2e858"/>
    <ellipse cx="255" cy="88"  rx="11" ry="9"  fill="#8ad040"/>
    <ellipse cx="453" cy="100" rx="12" ry="10" fill="#a2e858"/>
    <ellipse cx="464" cy="83"  rx="11" ry="9"  fill="#8ad040"/>`;
  // Catkins: fuzzy hanging flowers at lower canopy edge
  const catkins = `
    <g stroke-linecap="round" fill="none">
      <path d="M300 143 Q295 160 298 176" stroke="#c8a855" stroke-width="7" opacity="0.8"/>
      <path d="M289 150 Q282 168 285 184" stroke="#b89848" stroke-width="5" opacity="0.75"/>
      <path d="M408 138 Q414 156 411 172" stroke="#c8a855" stroke-width="7" opacity="0.8"/>
    </g>`;
  const hotspots = `
    <circle class="hs" data-part="roots"   cx="350" cy="382" r="15" fill="#27ae60" stroke="#27ae60" stroke-width="2" opacity="0.35"/>
    <circle class="hs" data-part="bark"    cx="350" cy="232" r="13" fill="#a0703a" stroke="#a0703a" stroke-width="2" opacity="0.38"/>
    <circle class="hs" data-part="leaves"  cx="430" cy="95"  r="14" fill="#5cb832" stroke="#5cb832" stroke-width="2" opacity="0.32"/>
    <circle class="hs" data-part="flowers" cx="298" cy="162" r="12" fill="#d4a820" stroke="#d4a820" stroke-width="2" opacity="0.35"/>
    <circle class="hs" data-part="sprouts" cx="155" cy="292" r="12" fill="#3aaa20" stroke="#3aaa20" stroke-width="2" opacity="0.35"/>`;
  const lf = `font-size="13" font-weight="800" font-family="Segoe UI,system-ui,sans-serif"`;
  const labels = `
    <text id="lbl-roots"   x="371" y="387" ${lf} fill="#1a8040">Roots</text>
    <text id="lbl-bark"    x="369" y="235" ${lf} fill="#a0703a">Trunk &amp; Bark</text>
    <text id="lbl-leaves"  x="450" y="99"  ${lf} fill="#2a8020">Leaves</text>
    <text id="lbl-flowers" x="316" y="166" ${lf} fill="#3a2510" filter="url(#tGlow)">Catkin Flowers</text>
    <text id="lbl-sprouts" x="173" y="296" ${lf} fill="#2a9010">Root Sprouts</text>`;
  return defs + bg + roots + sprouts + trunk + catkins + canopy + hotspots + labels;
}

// ── Wetland scene (Cattail) ────────────────────────────────────────────────────
function buildWetlandScene() {
  const defs = `<defs>
    <linearGradient id="wSkyG" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#5aaae8"/><stop offset="100%" stop-color="#b8ddf8"/>
    </linearGradient>
    <linearGradient id="wSoilG" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#5a3820"/><stop offset="100%" stop-color="#3a2010"/>
    </linearGradient>
  </defs>`;
  const bg = `
    <rect x="0" y="0" width="700" height="322" fill="url(#wSkyG)"/>
    <g fill="white" opacity="0.82">
      <ellipse cx="130" cy="74" rx="52" ry="24"/><ellipse cx="175" cy="66" rx="38" ry="18"/><ellipse cx="88" cy="70" rx="28" ry="16"/>
      <ellipse cx="564" cy="90" rx="44" ry="20"/><ellipse cx="612" cy="84" rx="32" ry="16"/>
    </g>
    <g fill="#5a7a3a" opacity="0.45">
      <rect x="38" y="272" width="5" height="50" rx="2"/><ellipse cx="40" cy="270" rx="4" ry="10"/>
      <rect x="58" y="267" width="4" height="55" rx="2"/><ellipse cx="60" cy="265" rx="3" ry="8"/>
      <rect x="76" y="274" width="4" height="48" rx="2"/>
      <rect x="600" y="270" width="4" height="52" rx="2"/><ellipse cx="602" cy="268" rx="3" ry="9"/>
      <rect x="618" y="274" width="5" height="48" rx="2"/><ellipse cx="620" cy="272" rx="4" ry="10"/>
      <rect x="638" y="268" width="4" height="54" rx="2"/>
    </g>
    <rect x="0" y="298" width="700" height="26" fill="#4a90d8" opacity="0.38"/>
    <g stroke="#3a80c8" stroke-width="1" fill="none" opacity="0.3">
      <ellipse cx="195" cy="309" rx="42" ry="4"/><ellipse cx="478" cy="307" rx="36" ry="3.5"/>
      <ellipse cx="95"  cy="314" rx="26" ry="3"/><ellipse cx="582" cy="313" rx="30" ry="3.5"/>
    </g>
    <rect x="0" y="322" width="700" height="158" fill="url(#wSoilG)"/>
    <line x1="0" y1="322" x2="700" y2="322" stroke="#3a2210" stroke-width="2"/>
    <g transform="translate(590,170)" opacity="0.42" fill="#4aae9a">
      <ellipse cx="0" cy="-3" rx="20" ry="5" transform="rotate(-25,0,-3)"/>
      <ellipse cx="0" cy="-3" rx="20" ry="5" transform="rotate(25,0,-3)"/>
      <ellipse cx="0" cy="5"  rx="15" ry="4" transform="rotate(-18,0,5)"/>
      <ellipse cx="0" cy="5"  rx="15" ry="4" transform="rotate(18,0,5)"/>
      <path d="M0 -12 L0 16" stroke="#2a7a6a" stroke-width="3" stroke-linecap="round" fill="none"/>
      <circle cx="0" cy="-14" r="4" fill="#2a7a6a"/>
    </g>`;
  const roots = `
    <g stroke="#8a5030" stroke-width="5" fill="none" stroke-linecap="round">
      <path d="M215 342 Q350 336 492 342"/><path d="M168 357 Q350 351 548 357"/>
    </g>
    <g stroke="#6a3a18" stroke-width="2.5" fill="none" stroke-linecap="round">
      <path d="M248 344 Q246 372 244 402"/><path d="M350 338 Q350 376 348 416"/>
      <path d="M452 344 Q454 374 456 404"/><path d="M192 359 Q190 383 188 410"/>
      <path d="M512 359 Q514 385 516 412"/>
    </g>`;
  const leaves = `
    <g fill="none" stroke-linecap="round">
      <path d="M348 316 Q284 263 246 220" stroke="#5daa28" stroke-width="10"/>
      <path d="M352 316 Q416 261 457 220" stroke="#5daa28" stroke-width="10"/>
      <path d="M342 315 Q266 278 226 252" stroke="#4a9a20" stroke-width="8"/>
      <path d="M358 315 Q434 276 476 250" stroke="#4a9a20" stroke-width="8"/>
      <path d="M350 317 Q340 282 338 252" stroke="#5daa28" stroke-width="7"/>
    </g>`;
  // 3 stalks: main (tallest), left, right
  const stalks = `
    <rect x="346" y="66" width="8" height="257" rx="4" fill="#6ab830"/>
    <rect x="317" y="140" width="7" height="183" rx="3" fill="#5aa020"/>
    <rect x="378" y="126" width="7" height="197" rx="3" fill="#5aa020"/>`;
  // Main seed head (brown "hot dog") on tallest stalk; thin male spike above
  const seedhead = `
    <rect x="340" y="68" width="20" height="58" rx="10" fill="#8B4513"/>
    <ellipse cx="350" cy="72" rx="10" ry="5" fill="#a05020" opacity="0.55"/>
    <rect x="347" y="52" width="6" height="18" rx="3" fill="#c8a040"/>`;
  // Bursting seed head on left stalk + dispersing fluffy seeds
  const seeds = `
    <rect x="311" y="114" width="16" height="45" rx="8" fill="#7a3a0a"/>
    <ellipse cx="319" cy="118" rx="6" ry="3" fill="#9a5a20" opacity="0.5"/>
    <g fill="white" opacity="0.92">
      <circle cx="303" cy="103" r="4.5"/><circle cx="295" cy="92" r="3.5"/>
      <circle cx="310" cy="87"  r="4"/>  <circle cx="297" cy="111" r="3.5"/>
      <circle cx="284" cy="99"  r="3"/>  <circle cx="315" cy="81"  r="3.5"/>
      <circle cx="287" cy="82"  r="3"/>  <circle cx="275" cy="92"  r="2.5"/>
    </g>
    <g stroke="white" stroke-width="0.8" opacity="0.65">
      <line x1="311" y1="114" x2="303" y2="103"/><line x1="311" y1="114" x2="295" y2="92"/>
      <line x1="311" y1="114" x2="310" y2="87"/> <line x1="311" y1="114" x2="297" y2="111"/>
      <line x1="311" y1="114" x2="284" y2="99"/>
    </g>`;
  const hotspots = `
    <circle class="hs" data-part="roots"    cx="350" cy="382" r="15" fill="#27ae60" stroke="#27ae60" stroke-width="2" opacity="0.35"/>
    <circle class="hs" data-part="stem"     cx="350" cy="200" r="13" fill="#4a9a20" stroke="#4a9a20" stroke-width="2" opacity="0.35"/>
    <circle class="hs" data-part="leaves"   cx="290" cy="248" r="14" fill="#5cb832" stroke="#5cb832" stroke-width="2" opacity="0.32"/>
    <circle class="hs" data-part="seedhead" cx="350" cy="95"  r="13" fill="#8B4513" stroke="#8B4513" stroke-width="2" opacity="0.38"/>
    <circle class="hs" data-part="seeds"    cx="303" cy="101" r="12" fill="#cccccc" stroke="#aaaaaa" stroke-width="2" opacity="0.45"/>`;
  const lf = `font-size="13" font-weight="800" font-family="Segoe UI,system-ui,sans-serif"`;
  const labels = `
    <text id="lbl-roots"    x="371" y="387" ${lf} fill="#27ae60">Roots &amp; Rhizomes</text>
    <text id="lbl-stem"     x="364" y="203" ${lf} fill="#2a7a10">Stem</text>
    <text id="lbl-leaves"   x="222" y="254" ${lf} fill="#2a7a10">Leaves</text>
    <text id="lbl-seedhead" x="374" y="98"  ${lf} fill="#6a3010">Seed Head</text>
    <text id="lbl-seeds"    x="226" y="86"  ${lf} fill="#666666">Seeds</text>`;
  return defs + bg + roots + leaves + stalks + seedhead + seeds + hotspots + labels;
}

// ── Helpers ────────────────────────────────────────────────────────────────────
function showInfo(part) {
  currentPart = part;
  const d = (T[lang][currentEnv] || T[lang].desert).parts[part];
  $('infoEmoji').textContent = d.emoji;
  $('infoTitle').textContent = d.title;
  $('infoBody').textContent  = d.body;
  $('infoPanel').classList.remove('hidden');
}
function hideInfo() { currentPart = null; $('infoPanel').classList.add('hidden'); }

function applyLang() {
  const t = T[lang];
  $('pageTitle').textContent = t.title;
  $('stdTitle').textContent  = t.stdTitle;
  $('stdDesc').innerHTML     = t.stdDesc;
  $('hintText').textContent  = t.hint;
  $('langBtn').textContent   = lang === 'en' ? '🇪🇸 Español' : '🇺🇸 English';
  ['desert','forest','wetland'].forEach(e =>
    document.querySelector(`[data-env="${e}"] span`).textContent = t['env' + e[0].toUpperCase() + e.slice(1)]);
  const lbs = (t[currentEnv] || {}).labels || {};
  Object.keys(lbs).forEach(k => { const el = $('lbl-' + k); if (el) el.textContent = lbs[k]; });
  if (currentPart) showInfo(currentPart);
  const cs = $('comingSoon');
  if (!cs.classList.contains('hidden'))
    cs.innerHTML = t.comingSoon(t.envWetland);
}

// ── Init ───────────────────────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  $('plantSvg').innerHTML = buildDesertScene();
  $('plantSvg').addEventListener('click', e => { const p = e.target.dataset.part; if (p) showInfo(p); });
  $('infoClose').addEventListener('click', hideInfo);
  $('langBtn').addEventListener('click', () => { lang = lang === 'en' ? 'es' : 'en'; applyLang(); });

  document.querySelectorAll('.env-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.env-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      currentEnv = btn.dataset.env;
      hideInfo();
      const cs = $('comingSoon');
      if (currentEnv === 'desert') {
        $('plantSvg').innerHTML = buildDesertScene();
        cs.classList.add('hidden');
      } else if (currentEnv === 'forest') {
        $('plantSvg').innerHTML = buildForestScene();
        cs.classList.add('hidden');
      } else {
        $('plantSvg').innerHTML = buildWetlandScene();
        cs.classList.add('hidden');
      }
      applyLang();
    });
  });

  $('stdBtn').addEventListener('click', () => $('stdPopup').classList.remove('hidden'));
  $('stdClose').addEventListener('click', () => $('stdPopup').classList.add('hidden'));
  $('stdPopup').addEventListener('click', e => { if (e.target === $('stdPopup')) $('stdPopup').classList.add('hidden'); });
});
