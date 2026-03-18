// === TRANSLATIONS ===
const T = {
  en: {
    pageTitle:    'Electromagnetic Radiation & Biological Effects',
    stdPopupTitle: 'Utah SEEd Standard PHYS.4.3',
    stdPopupContent: `<p>Evaluate information about the effects that different frequencies of electromagnetic radiation have when absorbed by biological materials.</p><p style="margin-top:8px">Emphasize that the energy of electromagnetic radiation is directly proportional to frequency and that the potential damage to living tissue from electromagnetic radiation depends on the energy of the radiation.</p>`,
    regionLabels: ['Radio','Microwave','Infrared','Visible','UV','X-Ray','Gamma'],
    freqScale:    '← Low Frequency \u00a0\u00a0 High Frequency →',
    wlScale:      '← Long Wavelength \u00a0\u00a0 Short Wavelength →',
    energyArrow:  '← Lower Energy \u00a0|\u00a0 Higher Energy →',
    freqLabel:    'Frequency:',
    wlLabel:      'Wavelength:',
    cellPanelTitle: 'Cell / Tissue View',
    cellLabel:    'Human Cell',
    energyMeterTitle: 'Photon Energy',
    energyLabels: ['Extreme','Very High','High','Medium','Low'],
    ionizingLabel: 'Ionizing ↑',
    damageMeterTitle: 'Potential Tissue Damage',
    damageLabels: ['Dangerous','High Risk','Caution','Low Risk','Safe'],
    ionizing:    'Ionizing',
    nonIonizing: 'Non-Ionizing',
    vocabHeader:   '📖 Key Vocabulary',
    conceptHeader: '💡 Key Concepts',
    vocabContent: `<p><b>Electromagnetic Radiation:</b> Energy that travels as waves through space, including visible light, radio waves, X-rays, and more. Does not require a medium to travel.</p><p><b>Frequency:</b> The number of wave cycles per second (Hz). Higher frequency = more energy per photon.</p><p><b>Wavelength:</b> The distance between successive wave crests. Inversely proportional to frequency.</p><p><b>Photon:</b> A discrete packet (quantum) of electromagnetic energy. Energy = h × frequency (Planck's equation).</p><p><b>Ionizing Radiation:</b> EM radiation with enough energy per photon to remove electrons from atoms, potentially breaking chemical bonds and damaging DNA (UV, X-rays, Gamma rays).</p><p><b>Non-Ionizing Radiation:</b> EM radiation with insufficient energy to ionize atoms. May cause heating but does not directly break chemical bonds (Radio, Microwave, Infrared, Visible).</p><p><b>DNA Damage:</b> Disruption of the DNA double helix structure. Ionizing radiation can break covalent bonds in DNA, causing mutations or cell death if unrepaired.</p>`,
    conceptContent: `<p>⚡ <b>Energy is directly proportional to frequency:</b> higher frequency = higher energy per photon (E = hf).</p><p>🌊 <b>Wavelength is inversely proportional to frequency:</b> higher frequency = shorter wavelength (c = λf).</p><p>☢️ <b>Ionizing radiation</b> (UV, X-rays, Gamma) has enough energy to remove electrons from atoms and damage DNA.</p><p>📡 <b>Non-ionizing radiation</b> (Radio, Microwave, IR, Visible) generally does not have enough energy to damage DNA directly.</p>`,
    names:   ['Radio Waves','Microwave Radiation','Infrared Radiation','Visible Light','Ultraviolet Radiation','X-Ray Radiation','Gamma Radiation'],
    sources: [
      'Radio towers, broadcasting',
      'Microwave ovens, cell phones, WiFi',
      'Heat lamps, remote controls, warm objects',
      'Sun, light bulbs, screens',
      'Sun, tanning beds, black lights',
      'Medical imaging, airport scanners',
      'Radioactive decay, nuclear reactions, cancer treatment',
    ],
    bioEffects: [
      'Radio waves pass through tissue with no harmful effects.',
      'Microwaves cause molecules to vibrate, producing heat. Overexposure can cause thermal burns.',
      'Infrared radiation is absorbed as heat. Our bodies naturally emit infrared.',
      'Visible light is generally safe. Our eyes evolved to detect this narrow range.',
      'UV radiation can damage DNA molecules. This can cause sunburn and increase cancer risk over time.',
      'X-rays penetrate tissue and can break chemical bonds in DNA. Medical X-rays use very low doses for safety.',
      'Gamma rays carry extreme energy and can destroy cell structures and severely damage DNA. Exposure can cause radiation sickness, cancer, or death.',
    ],
    cellCaptions: [
      'Radio waves pass through tissue with no harmful effects.',
      'Microwaves cause molecules to vibrate, producing heat.',
      'Infrared is absorbed as heat — our bodies naturally emit infrared.',
      'Visible light is generally safe. Our eyes evolved to detect this range.',
      '⚠ UV radiation can damage DNA — increases sunburn and cancer risk.',
      '⚠ X-rays penetrate tissue and can break chemical bonds in DNA.',
      '⚠ Gamma rays carry extreme energy and can destroy cell structures.',
    ],
    langBtn: '🇪🇸 Español',
  },
  es: {
    pageTitle:    'Radiación Electromagnética y Efectos Biológicos',
    stdPopupTitle: 'Estándar Utah SEEd PHYS.4.3',
    stdPopupContent: `<p>Evaluar información sobre los efectos que diferentes frecuencias de radiación electromagnética tienen cuando son absorbidas por materiales biológicos.</p><p style="margin-top:8px">Se enfatiza que la energía de la radiación electromagnética es directamente proporcional a la frecuencia y que el daño potencial al tejido vivo depende de la energía de la radiación.</p>`,
    regionLabels: ['Radio','Microondas','Infrarrojo','Visible','UV','Rayos X','Gamma'],
    freqScale:    '← Baja Frecuencia \u00a0\u00a0 Alta Frecuencia →',
    wlScale:      '← Longitud de Onda Larga \u00a0\u00a0 Longitud de Onda Corta →',
    energyArrow:  '← Menor Energía \u00a0|\u00a0 Mayor Energía →',
    freqLabel:    'Frecuencia:',
    wlLabel:      'Longitud de Onda:',
    cellPanelTitle: 'Vista Celular / Tejido',
    cellLabel:    'Célula Humana',
    energyMeterTitle: 'Energía del Fotón',
    energyLabels: ['Extrema','Muy Alta','Alta','Media','Baja'],
    ionizingLabel: 'Ionizante ↑',
    damageMeterTitle: 'Daño Potencial al Tejido',
    damageLabels: ['Peligroso','Alto Riesgo','Precaución','Bajo Riesgo','Seguro'],
    ionizing:    'Ionizante',
    nonIonizing: 'No Ionizante',
    vocabHeader:   '📖 Vocabulario Clave',
    conceptHeader: '💡 Conceptos Clave',
    vocabContent: `<p><b>Radiación Electromagnética:</b> Energía que viaja como ondas a través del espacio, incluyendo la luz visible, las ondas de radio, los rayos X y más. No requiere un medio para viajar.</p><p><b>Frecuencia:</b> El número de ciclos de onda por segundo (Hz). Mayor frecuencia = más energía por fotón.</p><p><b>Longitud de Onda:</b> La distancia entre crestas sucesivas de una onda. Inversamente proporcional a la frecuencia.</p><p><b>Fotón:</b> Un paquete discreto (cuanto) de energía electromagnética. Energía = h × frecuencia (ecuación de Planck).</p><p><b>Radiación Ionizante:</b> Radiación EM con suficiente energía por fotón para expulsar electrones de los átomos, rompiendo potencialmente enlaces químicos y dañando el ADN (UV, rayos X, rayos gamma).</p><p><b>Radiación No Ionizante:</b> Radiación EM con energía insuficiente para ionizar átomos. Puede causar calentamiento pero no rompe directamente los enlaces químicos (Radio, Microondas, Infrarrojo, Visible).</p><p><b>Daño al ADN:</b> Alteración de la estructura de la doble hélice del ADN. La radiación ionizante puede romper enlaces covalentes en el ADN, causando mutaciones o muerte celular si no se repara.</p>`,
    conceptContent: `<p>⚡ <b>La energía es directamente proporcional a la frecuencia:</b> mayor frecuencia = más energía por fotón (E = hf).</p><p>🌊 <b>La longitud de onda es inversamente proporcional a la frecuencia:</b> mayor frecuencia = longitud de onda más corta (c = λf).</p><p>☢️ <b>La radiación ionizante</b> (UV, rayos X, Gamma) tiene suficiente energía para expulsar electrones de los átomos y dañar el ADN.</p><p>📡 <b>La radiación no ionizante</b> (Radio, Microondas, Infrarrojo, Visible) generalmente no tiene suficiente energía para dañar el ADN directamente.</p>`,
    names:   ['Ondas de Radio','Radiación de Microondas','Radiación Infrarroja','Luz Visible','Radiación Ultravioleta','Radiación de Rayos X','Radiación Gamma'],
    sources: [
      'Torres de radio, transmisiones',
      'Hornos de microondas, teléfonos celulares, WiFi',
      'Lámparas de calor, controles remotos, objetos cálidos',
      'Sol, focos, pantallas',
      'Sol, camas de bronceado, luces negras',
      'Imágenes médicas, escáneres de aeropuerto',
      'Desintegración radiactiva, reacciones nucleares, tratamiento del cáncer',
    ],
    bioEffects: [
      'Las ondas de radio pasan a través del tejido sin efectos dañinos.',
      'Las microondas hacen que las moléculas vibren, produciendo calor. La sobreexposición puede causar quemaduras térmicas.',
      'La radiación infrarroja se absorbe como calor. Nuestros cuerpos emiten infrarrojo de forma natural.',
      'La luz visible es generalmente segura. Nuestros ojos evolucionaron para detectar este estrecho rango.',
      'La radiación UV puede dañar las moléculas de ADN. Esto puede causar quemaduras solares y aumentar el riesgo de cáncer con el tiempo.',
      'Los rayos X penetran el tejido y pueden romper enlaces químicos en el ADN. Los rayos X médicos usan dosis muy bajas por seguridad.',
      'Los rayos gamma tienen energía extrema y pueden destruir estructuras celulares y dañar gravemente el ADN. La exposición puede causar enfermedad por radiación, cáncer o muerte.',
    ],
    cellCaptions: [
      'Las ondas de radio pasan a través del tejido sin efectos dañinos.',
      'Las microondas hacen que las moléculas vibren, produciendo calor.',
      'La radiación infrarroja se absorbe como calor. Nuestros cuerpos emiten infrarrojo.',
      'La luz visible es generalmente segura. Nuestros ojos evolucionaron para detectarla.',
      '⚠ La radiación UV puede dañar el ADN — aumenta quemaduras y riesgo de cáncer.',
      '⚠ Los rayos X penetran el tejido y pueden romper enlaces en el ADN.',
      '⚠ Los rayos gamma tienen energía extrema y pueden destruir estructuras celulares.',
    ],
    langBtn: '🇺🇸 English',
  },
};

// === SPECTRUM DATA ===
const REGIONS = [
  { color: '#8b2020', energy: 1,   damage: 1,   ionizing: false, sourceIcon: '📻', freqRange: '3 kHz – 300 GHz',    wlRange: '1 mm – 100 km'  },
  { color: '#e67e22', energy: 2,   damage: 1.5, ionizing: false, sourceIcon: '📱', freqRange: '300 MHz – 300 GHz',  wlRange: '1 mm – 1 m'     },
  { color: '#e8a020', energy: 3,   damage: 2,   ionizing: false, sourceIcon: '🔥', freqRange: '300 GHz – 400 THz',  wlRange: '700 nm – 1 mm'  },
  { color: '#22bb44', energy: 4,   damage: 2,   ionizing: false, sourceIcon: '💡', freqRange: '400 – 790 THz',      wlRange: '380 – 700 nm'   },
  { color: '#6600cc', energy: 6.5, damage: 6,   ionizing: true,  sourceIcon: '☀️', freqRange: '790 THz – 30 PHz',   wlRange: '10 – 380 nm'    },
  { color: '#1a237e', energy: 8.5, damage: 8,   ionizing: true,  sourceIcon: '🏥', freqRange: '30 PHz – 30 EHz',    wlRange: '0.01 – 10 nm'   },
  { color: '#050520', energy: 10,  damage: 10,  ionizing: true,  sourceIcon: '☢️', freqRange: '> 30 EHz',           wlRange: '< 0.01 nm'      },
];

// Region boundary positions (fraction 0–1 along bar)
const BOUNDARIES = [0, 0.13, 0.22, 0.37, 0.45, 0.60, 0.80, 1.0];

// === STATE ===
let sliderPos = 0.05;
let lang = 'en';

// === DOM REFS ===
const sliderHandle = document.getElementById('sliderHandle');
const spectrumBar  = document.getElementById('spectrumBar');

// === REGION LABELS ===
function buildLabels() {
  const container = document.getElementById('regionLabels');
  container.innerHTML = '';
  T[lang].regionLabels.forEach((name, i) => {
    const lbl = document.createElement('div');
    lbl.className = 'region-label';
    lbl.textContent = name;
    lbl.style.color = REGIONS[i].color === '#050520' ? '#888' : REGIONS[i].color;
    lbl.style.width = ((BOUNDARIES[i + 1] - BOUNDARIES[i]) * 100) + '%';
    container.appendChild(lbl);
  });
}

// === SLIDER DRAG ===
function getRegionIndex(pos) {
  for (let i = BOUNDARIES.length - 2; i >= 0; i--) {
    if (pos >= BOUNDARIES[i]) return i;
  }
  return 0;
}

function setSliderPos(pos) {
  sliderPos = Math.max(0, Math.min(1, pos));
  sliderHandle.style.left = (sliderPos * 100) + '%';
  update();
}

function barFraction(e) {
  const rect = spectrumBar.getBoundingClientRect();
  const x = (e.touches ? e.touches[0].clientX : e.clientX) - rect.left;
  return x / rect.width;
}

let dragging = false;
sliderHandle.addEventListener('mousedown',  e => { dragging = true; e.preventDefault(); });
document.addEventListener('mousemove',  e => { if (dragging) setSliderPos(barFraction(e)); });
document.addEventListener('mouseup',    ()  => { dragging = false; });
sliderHandle.addEventListener('touchstart', e => { dragging = true; e.preventDefault(); }, {passive:false});
document.addEventListener('touchmove',  e => { if (dragging) setSliderPos(barFraction(e)); }, {passive:false});
document.addEventListener('touchend',   ()  => { dragging = false; });
spectrumBar.addEventListener('click', e => setSliderPos(barFraction(e)));

// === UPDATE UI (dynamic/slider-driven content) ===
function update() {
  const idx = getRegionIndex(sliderPos);
  const r   = REGIONS[idx];
  const t   = T[lang];

  document.getElementById('radName').textContent    = t.names[idx];
  document.getElementById('freqRange').textContent  = r.freqRange;
  document.getElementById('wlRange').textContent    = r.wlRange;
  document.getElementById('sourceIcon').textContent = r.sourceIcon;
  document.getElementById('sourceText').textContent = t.sources[idx];
  document.getElementById('bioEffect').textContent  = t.bioEffects[idx];

  const badge = document.getElementById('ionizingBadge');
  badge.textContent = r.ionizing ? t.ionizing : t.nonIonizing;
  badge.classList.toggle('ionizing', r.ionizing);

  const energyPct = (1 - r.energy / 10) * 100;
  const damagePct = (1 - r.damage / 10) * 100;
  document.getElementById('energyFill').style.height = energyPct + '%';
  document.getElementById('damageFill').style.height = damagePct + '%';
}

// === APPLY LANGUAGE (all static UI strings) ===
function applyLang() {
  const t = T[lang];
  document.getElementById('pageTitle').textContent       = t.pageTitle;
  document.getElementById('langBtn').textContent         = t.langBtn;
  document.getElementById('stdPopupTitle').textContent   = t.stdPopupTitle;
  document.getElementById('stdPopupContent').innerHTML   = t.stdPopupContent;
  document.getElementById('freqScale').innerHTML         = t.freqScale;
  document.getElementById('wlScale').innerHTML           = t.wlScale;
  document.getElementById('energyArrow').innerHTML       = t.energyArrow;
  document.getElementById('freqLabel').textContent       = t.freqLabel;
  document.getElementById('wlLabel').textContent         = t.wlLabel;
  document.getElementById('cellPanelTitle').textContent  = t.cellPanelTitle;
  document.getElementById('cellLabel').textContent       = t.cellLabel;
  document.getElementById('energyMeterTitle').textContent  = t.energyMeterTitle;
  document.getElementById('damageMeterTitle').textContent  = t.damageMeterTitle;
  document.getElementById('ionizingLineLabel').textContent = t.ionizingLabel;
  document.getElementById('energyScaleLabels').innerHTML = t.energyLabels.map(l => `<span>${l}</span>`).join('');
  document.getElementById('damageScaleLabels').innerHTML = t.damageLabels.map(l => `<span>${l}</span>`).join('');
  document.getElementById('vocabHeader').textContent     = t.vocabHeader;
  document.getElementById('conceptHeader').textContent   = t.conceptHeader;
  document.getElementById('vocabBody').innerHTML         = t.vocabContent;
  document.getElementById('conceptBody').innerHTML       = t.conceptContent;
  buildLabels();
  update();
}

// === COLLAPSIBLES ===
function toggleColl(id) {
  document.getElementById(id).classList.toggle('open');
}

// === POPUP ===
document.getElementById('stdBadge').addEventListener('click', () => {
  document.getElementById('infoPopup').classList.add('show');
  document.getElementById('overlay').classList.add('show');
});
['closePopup','overlay'].forEach(id => {
  document.getElementById(id).addEventListener('click', () => {
    document.getElementById('infoPopup').classList.remove('show');
    document.getElementById('overlay').classList.remove('show');
  });
});

// === LANGUAGE TOGGLE ===
document.getElementById('langBtn').addEventListener('click', () => {
  lang = lang === 'en' ? 'es' : 'en';
  applyLang();
});

// === INIT ===
applyLang();
