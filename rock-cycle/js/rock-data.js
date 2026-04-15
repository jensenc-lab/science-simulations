// ── rock-data.js ──────────────────────────────────────────────────────────────
// Rock Cycle Lab — Utah SEEd 7.2.1
// All scientific content: rock specimens, materials, transformations, energy sources

'use strict';

// ── Rock Specimens ────────────────────────────────────────────────────────────

const ROCKS = {
  granite: {
    id: 'granite',
    name: 'Granite',
    type: 'igneous',
    subtype: 'intrusive',
    description: 'Coarse-grained rock formed from slowly cooling magma deep underground. You can see individual crystals of quartz, feldspar, and mica.',
    texture: 'Coarse-grained, crystalline',
    formation: 'Slow cooling of magma deep underground',
    minerals: ['quartz', 'feldspar', 'mica'],
    color: '#C4B5A2',
    grainSize: 'large',
    utahConnection: 'Little Cottonwood Canyon — carved through 30-million-year-old granite',
    utahLocation: 'Wasatch Mountains'
  },
  basalt: {
    id: 'basalt',
    name: 'Basalt',
    type: 'igneous',
    subtype: 'extrusive',
    description: 'Fine-grained, dark rock formed from lava that cooled quickly on Earth\'s surface. Crystals are too small to see without a microscope.',
    texture: 'Fine-grained, dense',
    formation: 'Rapid cooling of lava on Earth\'s surface',
    minerals: ['pyroxene', 'plagioclase', 'olivine'],
    color: '#3D3D3D',
    grainSize: 'small',
    utahConnection: 'Black Rock near the Great Salt Lake — an ancient lava flow',
    utahLocation: 'Great Salt Lake area'
  },
  obsidian: {
    id: 'obsidian',
    name: 'Obsidian',
    type: 'igneous',
    subtype: 'extrusive',
    description: 'Volcanic glass formed when lava cools so fast that no crystals form at all. Shiny, smooth, and razor-sharp edges.',
    texture: 'Glassy, conchoidal fracture',
    formation: 'Extremely rapid cooling of lava',
    minerals: ['volcanic glass (no crystals)'],
    color: '#1a1a2e',
    grainSize: 'none',
    utahConnection: 'Found in volcanic areas near the Black Rock Desert of southwestern Utah',
    utahLocation: 'Southwestern Utah'
  },
  sandstone: {
    id: 'sandstone',
    name: 'Sandstone',
    type: 'sedimentary',
    subtype: 'clastic',
    description: 'Made of sand-sized grains cemented together. Often shows visible layers. Feels gritty like sandpaper.',
    texture: 'Medium-grained, gritty, layered',
    formation: 'Sand deposited by wind or water, compacted and cemented over millions of years',
    minerals: ['quartz', 'feldspar'],
    color: '#D4A574',
    grainSize: 'medium',
    utahConnection: 'Arches National Park — arches carved from Entrada Sandstone',
    utahLocation: 'Moab, Utah'
  },
  limestone: {
    id: 'limestone',
    name: 'Limestone',
    type: 'sedimentary',
    subtype: 'chemical/organic',
    description: 'Often formed from shells and skeletons of marine organisms. May contain fossils. Fizzes when touched with acid.',
    texture: 'Fine to medium-grained, may contain fossils',
    formation: 'Accumulation of marine shells and sediment on the ocean floor, compacted over time',
    minerals: ['calcite'],
    color: '#E8DCC8',
    grainSize: 'fine',
    utahConnection: 'Timpanogos Cave — limestone dissolved by water to form cave chambers',
    utahLocation: 'American Fork Canyon'
  },
  shale: {
    id: 'shale',
    name: 'Shale',
    type: 'sedimentary',
    subtype: 'clastic',
    description: 'Made of tiny clay particles pressed in thin layers. Splits easily into flat sheets. Often dark gray or black.',
    texture: 'Very fine-grained, fissile (splits in sheets)',
    formation: 'Clay and silt deposited in calm water, compressed over millions of years',
    minerals: ['clay minerals', 'quartz'],
    color: '#5C5C5C',
    grainSize: 'very fine',
    utahConnection: 'Green River Formation — famous for detailed fish and plant fossils in shale',
    utahLocation: 'Eastern Utah'
  },
  marble: {
    id: 'marble',
    name: 'Marble',
    type: 'metamorphic',
    parentRock: 'limestone',
    description: 'Formed when limestone is transformed by heat and pressure. Interlocking crystals give it a sugary, sparkly texture.',
    texture: 'Interlocking crystals, non-foliated',
    formation: 'Limestone recrystallized by heat and pressure deep underground',
    minerals: ['calcite (recrystallized)'],
    color: '#F0EDE8',
    grainSize: 'medium',
    utahConnection: 'Found in metamorphic zones of the Wasatch Range',
    utahLocation: 'Wasatch Range'
  },
  slate: {
    id: 'slate',
    name: 'Slate',
    type: 'metamorphic',
    parentRock: 'shale',
    description: 'Formed when shale is squeezed by pressure. Harder and shinier than shale. Splits into smooth, flat sheets.',
    texture: 'Fine-grained, foliated, smooth',
    formation: 'Shale compressed and heated — clay minerals realign into flat sheets',
    minerals: ['mica', 'chlorite', 'quartz'],
    color: '#4A5054',
    grainSize: 'very fine',
    utahConnection: 'Found in the Raft River Mountains metamorphic complex',
    utahLocation: 'Northwestern Utah'
  },
  quartzite: {
    id: 'quartzite',
    name: 'Quartzite',
    type: 'metamorphic',
    parentRock: 'sandstone',
    description: 'Formed when sandstone is fused by intense heat and pressure. Extremely hard — harder than steel. Sand grains are no longer visible.',
    texture: 'Interlocking grains, very hard, non-foliated',
    formation: 'Sandstone grains fused together by heat and pressure',
    minerals: ['quartz (recrystallized)'],
    color: '#C8BEB0',
    grainSize: 'medium',
    utahConnection: 'Farmington Canyon — quartzite cliffs visible along the Wasatch Front',
    utahLocation: 'Wasatch Front'
  }
};

// ── Intermediate Materials ────────────────────────────────────────────────────

const MATERIALS = {
  magma: {
    id: 'magma',
    name: 'Magma',
    type: 'material',
    description: 'Molten rock beneath Earth\'s surface. Contains dissolved minerals and gases. Temperature: 700°C–1300°C.',
    color: '#FF4500',
    icon: '🌋'
  },
  lava: {
    id: 'lava',
    name: 'Lava',
    type: 'material',
    description: 'Molten rock that has reached Earth\'s surface through a volcano or crack.',
    color: '#FF6B35',
    icon: '🌊'
  },
  sediment: {
    id: 'sediment',
    name: 'Sediment',
    type: 'material',
    description: 'Broken pieces of rock — sand, silt, clay, and gravel — created by weathering and carried by wind, water, and ice.',
    color: '#C2B280',
    icon: '💨'
  }
};

// ── Transformation Processes ──────────────────────────────────────────────────

const TRANSFORMATIONS = {
  melting: {
    id: 'melting',
    name: 'Melting',
    icon: '🌋',
    accepts: ['igneous', 'sedimentary', 'metamorphic'],
    rejects: ['material'],
    output: 'magma',
    energySource: 'earth-heat',
    energyLabel: 'Earth\'s Internal Heat',
    description: 'Extreme heat deep inside Earth melts solid rock into magma.',
    matterNote: 'Minerals dissolve into the molten liquid — but the atoms are still there!'
  },
  crystallization: {
    id: 'crystallization',
    name: 'Crystallization',
    icon: '❄️',
    accepts: ['magma', 'lava'],
    rejects: ['igneous', 'sedimentary', 'metamorphic', 'sediment'],
    outputMap: {
      slow: 'granite',
      fast: 'basalt',
      ultrafast: 'obsidian'
    },
    energySource: 'cooling',
    energyLabel: 'Cooling (Loss of Heat Energy)',
    description: 'As magma or lava cools, minerals crystallize into solid igneous rock.',
    matterNote: 'The same minerals re-form as crystals as the liquid cools and solidifies.'
  },
  weathering: {
    id: 'weathering',
    name: 'Weathering & Erosion',
    icon: '🌧️',
    accepts: ['igneous', 'sedimentary', 'metamorphic'],
    rejects: ['material'],
    output: 'sediment',
    energySource: 'sun',
    energyLabel: 'Sun\'s Energy (drives wind, water, ice)',
    description: 'Wind, water, and ice slowly break rock into smaller pieces called sediment.',
    matterNote: 'The rock breaks apart, but the mineral grains are still intact — just smaller.'
  },
  deposition: {
    id: 'deposition',
    name: 'Deposition & Sedimentation',
    icon: '📥',
    accepts: ['sediment'],
    rejects: ['igneous', 'sedimentary', 'metamorphic', 'magma', 'lava'],
    outputOptions: ['sandstone', 'limestone', 'shale'],
    energySource: 'gravity',
    energyLabel: 'Gravity + Pressure Over Time',
    description: 'Layers of sediment pile up, compact under pressure, and cement into solid rock.',
    matterNote: 'The same mineral grains get compressed and cemented back together.'
  },
  heatAndPressure: {
    id: 'heatAndPressure',
    name: 'Heat & Pressure',
    icon: '🔥',
    accepts: ['igneous', 'sedimentary', 'metamorphic'],
    rejects: ['material'],
    metamorphicMap: {
      limestone: 'marble',
      shale: 'slate',
      sandstone: 'quartzite',
      granite: 'quartzite',
      basalt: 'slate',
      obsidian: 'slate',
      marble: 'marble',
      slate: 'slate',
      quartzite: 'quartzite'
    },
    energySource: 'earth-heat',
    energyLabel: 'Heat & Pressure (not enough to melt)',
    description: 'Deep underground, heat and pressure change the rock\'s mineral structure without melting it.',
    matterNote: 'Minerals rearrange into new patterns, but NO atoms are created or destroyed.'
  },
  uplift: {
    id: 'uplift',
    name: 'Uplift & Deformation',
    icon: '🏔️',
    accepts: ['igneous', 'sedimentary', 'metamorphic'],
    rejects: ['material'],
    output: 'same',
    energySource: 'tectonic',
    energyLabel: 'Tectonic Forces from Earth\'s Interior',
    description: 'Forces deep in Earth push buried rocks up to the surface, where weathering can begin.',
    matterNote: 'Same rock, same minerals — just moved to a new location.'
  }
};

// ── Energy Sources ────────────────────────────────────────────────────────────

const ENERGY_SOURCES = {
  sun: {
    id: 'sun',
    name: "Sun's Energy",
    icon: '☀️',
    color: '#F4D03F',
    processes: ['weathering']
  },
  'earth-heat': {
    id: 'earth-heat',
    name: "Earth's Internal Heat",
    icon: '🌋',
    color: '#E74C3C',
    processes: ['melting', 'heatAndPressure']
  },
  gravity: {
    id: 'gravity',
    name: 'Gravity',
    icon: '⬇️',
    color: '#8B7355',
    processes: ['deposition']
  },
  cooling: {
    id: 'cooling',
    name: 'Cooling',
    icon: '❄️',
    color: '#4A90D9',
    processes: ['crystallization']
  },
  tectonic: {
    id: 'tectonic',
    name: 'Tectonic Forces',
    icon: '🏔️',
    color: '#6B8E5A',
    processes: ['uplift']
  }
};

// ── Utah Connections ──────────────────────────────────────────────────────────

const UTAH_CONNECTIONS = [
  {
    name: 'Arches National Park',
    rockId: 'sandstone',
    description: 'Wind and water carved natural arches from ancient sand dunes turned to stone.',
    location: 'Moab, Utah'
  },
  {
    name: 'Little Cottonwood Canyon',
    rockId: 'granite',
    description: 'This granite cooled slowly from magma about 30 million years ago, deep underground.',
    location: 'Wasatch Mountains'
  },
  {
    name: 'Timpanogos Cave',
    rockId: 'limestone',
    description: 'An ancient sea floor now high in the mountains. Water dissolved the limestone to create cave chambers.',
    location: 'American Fork Canyon'
  },
  {
    name: 'Green River Formation',
    rockId: 'shale',
    description: 'Fine lake sediment preserved some of the world\'s most detailed fish and plant fossils.',
    location: 'Eastern Utah'
  },
  {
    name: 'Farmington Canyon',
    rockId: 'quartzite',
    description: 'Some of Utah\'s oldest rocks — ancient sandstone transformed by immense heat and pressure over a billion years ago.',
    location: 'Wasatch Front'
  }
];

// ── Rock type display config ──────────────────────────────────────────────────

const ROCK_TYPE_CONFIG = {
  igneous:     { label: 'Igneous',      color: 'var(--accent-igneous)',      bg: 'rgba(232,93,58,0.12)' },
  sedimentary: { label: 'Sedimentary',  color: 'var(--accent-sedimentary)',  bg: 'rgba(212,168,67,0.12)' },
  metamorphic: { label: 'Metamorphic',  color: 'var(--accent-metamorphic)',  bg: 'rgba(123,45,142,0.12)' },
  material:    { label: 'Material',     color: 'var(--accent-magma)',        bg: 'rgba(255,69,0,0.12)' }
};
