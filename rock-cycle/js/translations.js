// ── translations.js ───────────────────────────────────────────────────────────
// Rock Cycle Lab — Utah SEEd 7.2.1
// Complete bilingual translation data (EN / ES) + t() lookup function

'use strict';

// ── t() lookup function ───────────────────────────────────────────────────────
// Safe to call before state is initialized — defaults to English.
function t(key, replacements) {
  const lang = (typeof state !== 'undefined' && state.language) ? state.language : 'en';
  let val = (TRANSLATIONS[lang] && TRANSLATIONS[lang][key]) || TRANSLATIONS.en[key];
  if (val === undefined) return key;
  if (replacements) {
    Object.keys(replacements).forEach(k => {
      val = val.replace(new RegExp('\\{' + k + '\\}', 'g'), replacements[k]);
    });
  }
  return val;
}

// ── Helper: translated rock / material / process names ───────────────────────
function rockName(id) {
  const map = {
    granite: 'rockGranite', basalt: 'rockBasalt', obsidian: 'rockObsidian',
    sandstone: 'rockSandstone', limestone: 'rockLimestone', shale: 'rockShale',
    marble: 'rockMarble', slate: 'rockSlate', quartzite: 'rockQuartzite',
    magma: 'rockMagma', lava: 'rockLava', sediment: 'rockSediment'
  };
  return map[id] ? t(map[id]) : id;
}
function processName(id) {
  const map = {
    melting: 'processMelting', crystallization: 'processCrystallization',
    weathering: 'processWeathering', deposition: 'processDeposition',
    heatAndPressure: 'processHeatPressure', uplift: 'processUplift'
  };
  return map[id] ? t(map[id]) : id;
}
function typeName(type) {
  const map = { igneous: 'typeIgneous', sedimentary: 'typeSedimentary', metamorphic: 'typeMetamorphic', material: 'typeMaterial' };
  return map[type] ? t(map[type]) : type;
}

const TRANSLATIONS = {
  en: {
    // HEADER
    appTitle: "Rock Cycle Lab",
    appSubtitle: "Utah SEEd 7.2.1 · Ogden School District",
    btnLanguage: "EN | ES",

    // MODE TABS
    modeGuided: "Guided",
    modeFreeExplore: "Free Explore",
    modeGeoJourney: "Geo Journey",
    modePresets: "Presets",

    // ROCK TYPES
    typeIgneous: "Igneous", typeSedimentary: "Sedimentary", typeMetamorphic: "Metamorphic", typeMaterial: "Material",

    // ROCK SHELF
    shelfTitle: "Rock Specimens",

    // ROCK NAMES
    rockGranite: "Granite", rockBasalt: "Basalt", rockObsidian: "Obsidian",
    rockSandstone: "Sandstone", rockLimestone: "Limestone", rockShale: "Shale",
    rockMarble: "Marble", rockSlate: "Slate", rockQuartzite: "Quartzite",
    rockMagma: "Magma", rockLava: "Lava", rockSediment: "Sediment",

    // ROCK DESCRIPTIONS
    graniteDesc: "Coarse-grained rock formed from slowly cooling magma deep underground. You can see individual crystals of quartz, feldspar, and mica.",
    basaltDesc: "Fine-grained, dark rock formed from lava that cooled quickly on Earth's surface. Crystals are too small to see without a microscope.",
    obsidianDesc: "Volcanic glass formed when lava cools so fast that no crystals form at all. Shiny, smooth, and razor-sharp edges.",
    sandstoneDesc: "Made of sand-sized grains cemented together. Often shows visible layers. Feels gritty like sandpaper.",
    limestoneDesc: "Often formed from shells and skeletons of marine organisms. May contain fossils. Fizzes when touched with acid.",
    shaleDesc: "Made of tiny clay particles pressed in thin layers. Splits easily into flat sheets. Often dark gray or black.",
    marbleDesc: "Formed when limestone is transformed by heat and pressure. Interlocking crystals give it a sugary, sparkly texture.",
    slateDesc: "Formed when shale is squeezed by pressure. Harder and shinier than shale. Splits into smooth, flat sheets.",
    quartziteDesc: "Formed when sandstone is fused by intense heat and pressure. Extremely hard — harder than steel. Sand grains are no longer visible.",
    magmaDesc: "Molten rock beneath Earth's surface. Contains dissolved minerals and gases. Temperature: 700°C–1300°C.",
    lavaDesc: "Molten rock that has reached Earth's surface through a volcano or crack.",
    sedimentDesc: "Broken pieces of rock — sand, silt, clay, and gravel — created by weathering and carried by wind, water, and ice.",

    // ROCK PROPERTIES
    propTexture: "Texture", propFormation: "Formation", propMinerals: "Minerals", propGrainSize: "Grain Size", propParentRock: "Parent Rock", propUtah: "Utah Connection",
    propWhatsNext: "What's next?",
    subtypeIntrusive: "Intrusive", subtypeExtrusive: "Extrusive", subtypeClastic: "Clastic", subtypeChemOrg: "Chemical/Organic",

    // Rock textures
    graniteTexture: "Coarse-grained, crystalline",
    basaltTexture: "Fine-grained, dense",
    obsidianTexture: "Glassy, conchoidal fracture",
    sandstoneTexture: "Medium-grained, gritty, layered",
    limestoneTexture: "Fine to medium-grained, may contain fossils",
    shaleTexture: "Very fine-grained, fissile (splits in sheets)",
    marbleTexture: "Interlocking crystals, non-foliated",
    slateTexture: "Fine-grained, foliated, smooth",
    quartziteTexture: "Interlocking grains, very hard, non-foliated",

    // Rock formations
    graniteFormation: "Slow cooling of magma deep underground",
    basaltFormation: "Rapid cooling of lava on Earth's surface",
    obsidianFormation: "Extremely rapid cooling of lava",
    sandstoneFormation: "Sand deposited by wind or water, compacted and cemented over millions of years",
    limestoneFormation: "Accumulation of marine shells and sediment on the ocean floor, compacted over time",
    shaleFormation: "Clay and silt deposited in calm water, compressed over millions of years",
    marbleFormation: "Limestone recrystallized by heat and pressure deep underground",
    slateFormation: "Shale compressed and heated — clay minerals realign into flat sheets",
    quartziteFormation: "Sandstone grains fused together by heat and pressure",

    // Grain sizes
    grainLarge: "large", grainSmall: "small", grainNone: "none", grainMedium: "medium", grainFine: "fine", grainVeryFine: "very fine",

    // PROCESS ZONES
    processMelting: "Melting",
    processCrystallization: "Crystallization",
    processWeathering: "Weathering & Erosion",
    processDeposition: "Deposition & Sedimentation",
    processHeatPressure: "Heat & Pressure",
    processUplift: "Uplift & Deformation",

    // PROCESS DESCRIPTIONS
    meltingDesc: "Extreme heat deep inside Earth melts solid rock into magma.",
    crystallizationDesc: "As magma or lava cools, minerals crystallize into solid igneous rock.",
    weatheringDesc: "Wind, water, and ice slowly break rock into smaller pieces called sediment.",
    depositionDesc: "Layers of sediment pile up, compact under pressure, and cement into solid rock.",
    heatPressureDesc: "Deep underground, heat and pressure change the rock's mineral structure without melting it.",
    upliftDesc: "Forces deep in Earth push buried rocks up to the surface, where weathering can begin.",

    // MATTER NOTES
    meltingMatter: "Minerals dissolve into the molten liquid — but the atoms are still there!",
    crystallizationMatter: "The same minerals re-form as crystals as the liquid cools and solidifies.",
    weatheringMatter: "The rock breaks apart, but the mineral grains are still intact — just smaller.",
    depositionMatter: "The same mineral grains get compressed and cemented back together.",
    heatPressureMatter: "Minerals rearrange into new patterns, but NO atoms are created or destroyed.",
    upliftMatter: "Same rock, same minerals — just moved to a new location.",

    // CHOICE POPUPS
    crystChoiceTitle: "How fast did the magma cool?",
    crystChoiceSubtitle: "Cooling speed determines crystal size and the rock that forms.",
    crystSlow: "Slow", crystSlowDesc: "Deep underground\n→ Large crystals\n→ Granite",
    crystFast: "Fast", crystFastDesc: "Surface lava flow\n→ Tiny crystals\n→ Basalt",
    crystUltra: "Ultra-fast", crystUltraDesc: "Volcanic eruption\n→ No crystals\n→ Obsidian",
    crystChoiceHint: "💡 Slow cooling = time for large crystals to grow. Fast cooling = small or no crystals.",
    depoChoiceTitle: "What settled in the layers?",
    depoChoiceSubtitle: "The type of sediment determines which rock forms.",
    depoSand: "Sand grains", depoSandDesc: "Wind or water\ntransport\n→ Sandstone",
    depoShells: "Shells & fossils", depoShellsDesc: "Marine organisms\non ocean floor\n→ Limestone",
    depoClay: "Clay & silt", depoClayDesc: "Calm water\nsettling\n→ Shale",
    depoChoiceHint: "💡 Layers pile up, compact under their own weight, and cement together over millions of years.",

    // EXPLANATION PANEL
    explanationTitle: "What's Happening?",
    explanationDefault: "Select a rock specimen from the shelf, then drag it to a process zone to see a transformation.",
    explainAvailTransforms: "Available Transformations",
    explainDragHint: "Drag this rock to any highlighted zone →",
    explainNextSteps: "Next Steps",
    explainEnergyLabel: "Energy:",

    // ENERGY / MATTER / CYCLE
    energyTitle: "Energy Flow",
    energySun: "Sun's Energy",
    energyEarthHeat: "Earth's Internal Heat",
    energyGravity: "Gravity",
    energyCooling: "Cooling",
    energyTectonic: "Tectonic Forces",
    matterTitle: "Matter Tracker",
    matterConservation: "Same atoms — new arrangement",
    matterRuleAtoms: "Atoms are <strong>never</strong> created or destroyed in the rock cycle — they just rearrange.",
    matterRuleMinerals: "Minerals can change form, but the same elements cycle through all three rock types.",
    matterRulePrompt: "Track your rock's journey through the cycle here.",
    cycleTitle: "Cycle Path",
    cycleEmpty: "Your exploration path builds here as you make transformations.",
    cyclePathsDiscovered: "paths discovered",
    cycleAllFound: "All paths discovered!",
    cyclePathsRemaining: "{n} paths remaining",

    // HISTORY STRIP
    historyLabel: "History",
    historyClear: "Clear history",
    historyEmpty: "Transformations will appear here",
    historyUplifted: " (uplifted to surface)",

    // SPECIMEN DISPLAY
    specimenEmptyText: "Click a rock on the shelf to examine it here",
    specimenIntermediate: "intermediate material",
    specimenFrom: "from",
    hintMagma: "Drag to <strong>Crystallization</strong> — cooling speed determines crystal size and rock type.",
    hintLava: "Drag to <strong>Crystallization</strong> — fast surface cooling forms basalt or obsidian.",
    hintSediment: "Drag to <strong>Deposition &amp; Sedimentation</strong> — layers compact into sedimentary rock.",

    // INVALID DROP / REJECT MESSAGES
    rejectCrystRock: "Rock is already solid — melt it first!",
    rejectCrystSediment: "Sediment must compact into rock, then melt.",
    rejectMeltMagma: "Already magma — it's already melted!",
    rejectMeltLava: "Already lava — it's already melted!",
    rejectMeltSediment: "Sediment must compact into rock before melting.",
    rejectWeatherMagma: "Magma must cool and crystallize first!",
    rejectWeatherLava: "Lava must cool and crystallize first!",
    rejectWeatherSediment: "Sediment is already broken-down rock!",
    rejectDepositRock: "Rock must weather into sediment first!",
    rejectDepositMolten: "Must cool → weather → sediment first!",
    rejectHPMagma: "Magma must solidify before metamorphism.",
    rejectHPLava: "Lava must solidify before metamorphism.",
    rejectHPSediment: "Sediment must compact into rock first.",
    rejectUpliftMagma: "Magma must solidify before being uplifted.",
    rejectUpliftLava: "Lava must solidify before being uplifted.",
    rejectUpliftSediment: "Sediment must compact into rock first.",
    rejectGeneric: "This transformation isn't possible here.",

    // GUIDED MODE
    guidedStepOf: "Step {current} of {total}",
    guidedPrevious: "← Previous",
    guidedNext: "Next →",
    guidedSwitchFree: "Switch to Free Explore →",
    guidedSkipLink: "Skip to Free Explore →",
    guidedFollowInstructions: "Follow the instructions above! Look for the highlighted zone.",
    guidedFollowShort: "Follow the instructions! Look for the highlighted zone.",

    // GUIDED STEPS
    guided1Title: "Meet the Rocks",
    guided1Text: "Welcome! Let's explore how rocks transform. Click on at least 3 different rocks — try one from each family: Igneous (orange), Sedimentary (gold), and Metamorphic (purple).",
    guided1Hint: "💡 Look for the colored labels on the left shelf.",
    guided1Complete: "Great! You've seen the three rock families. Notice how each type formed in a completely different way.",

    guided2Title: "Melting",
    guided2Text: "Drag GRANITE from the shelf into the Melting zone (🌋). Watch what happens!",
    guided2Hint: "💡 Look for the glowing zone on the left!",
    guided2Complete: "Granite melted into magma! The energy came from deep inside Earth. The same minerals are still there — they're just liquid now.",

    guided3Title: "Crystallization",
    guided3aText: "Your magma is underground. Drag it into the Crystallization zone (❄️) and choose 'Slow Cooling.'",
    guided3aHint: "💡 Slow cooling = time for big crystals to grow.",
    guided3aComplete: "Slow cooling deep underground = BIG crystals you can see! That's how granite forms. Now let's try fast cooling...",
    guided3bText: "Try again — drag the magma to Crystallization and choose 'Fast Cooling.'",
    guided3bHint: "💡 Fast cooling = tiny or no crystals.",
    guided3bComplete: "Fast cooling on the surface = tiny crystals! Same magma, different rock — because cooling speed matters.",

    guided4Title: "Weathering & Erosion",
    guided4Text: "Drag any rock from the shelf into the Weathering zone (🌧️). Watch how nature breaks it down.",
    guided4Hint: "💡 The Sun's energy powers wind, water, and ice that break rock apart.",
    guided4Complete: "The rock broke into sediment — tiny pieces carried by wind and water. The Sun's energy powers this process!",

    guided5Title: "Deposition & Sedimentation",
    guided5Text: "Now drag the sediment into the Deposition zone (📥). Choose any sediment type.",
    guided5Hint: "💡 Gravity pulls layers down; weight and time cement them together.",
    guided5Complete: "Layers of sediment were squeezed and cemented into rock! Gravity did the heavy lifting — literally.",

    guided6Title: "Heat & Pressure",
    guided6Text: "Drag LIMESTONE from the shelf into the Heat & Pressure zone (🔥). See what happens when rock is squeezed deep underground.",
    guided6Hint: "💡 The rock changes without melting — minerals rearrange under pressure.",
    guided6Complete: "Limestone became marble! Same calcite minerals, but heat and pressure rearranged them into interlocking crystals.",

    guided7Title: "The Metamorphic Pairs",
    guided7aText: "Every sedimentary rock has a metamorphic partner. Try dragging SHALE into the Heat & Pressure zone.",
    guided7aHint: "💡 Shale is made of thin clay layers — pressure realigns them.",
    guided7aComplete: "Shale became slate! Now try SANDSTONE.",
    guided7bText: "Now drag SANDSTONE into the Heat & Pressure zone.",
    guided7bHint: "💡 Sand grains fuse together under extreme heat.",
    guided7bComplete: "Sandstone became quartzite! Three pairs: Limestone→Marble, Shale→Slate, Sandstone→Quartzite. The parent rock determines the metamorphic rock.",

    guided8Title: "Uplift",
    guided8Text: "Rocks deep underground can't be weathered — they need to reach the surface first. Drag any rock into the Uplift zone (🏔️).",
    guided8Hint: "💡 Tectonic forces push rocks up — completing the cycle!",
    guided8Complete: "Tectonic forces pushed the rock up to the surface! Now it's exposed to wind and rain — and the cycle can continue.",

    guided9Title: "Complete a Full Cycle",
    guided9Text: "Put it all together! Start with GRANITE and try to turn it back into granite. Use any combination of processes. How many steps does it take?",
    guided9Hint: "💡 There's no single correct path — rocks can take many routes!",
    guided9CompleteShort: "You found the shortest path — just melt and re-crystallize! The real rock cycle can take this path too, though it requires extreme heat.",
    guided9CompleteMed: "You completed a full rock cycle in {n} steps! There are many possible paths through the rock cycle.",
    guided9CompleteLong: "You completed a full rock cycle in {n} steps — the scenic route! Every path through the rock cycle is valid.",

    guided10Title: "Check Your Progress",
    guided10Text: "Look at your Cycle Path Diagram on the right. You've discovered {cnt} of {tot} paths! Switch to Free Explore mode to find any paths you missed.",
    guided10HintComplete: "🎉 Amazing — you found every path!",
    guided10HintRemaining: "💡 {n} path{s} still to discover.",

    // PRESETS
    presetSelectTitle: "Choose a Scenario",
    presetVolcanoTitle: "From Volcano to Beach",
    presetVolcanoDesc: "Follow a rock from eruption to canyon wall",
    presetMountainTitle: "The Mountain Maker",
    presetMountainDesc: "See how sea-floor mud becomes a mountain",
    presetCircleTitle: "Going in Circles",
    presetCircleDesc: "A complete trip around the entire rock cycle",
    presetFossilsTitle: "Fossils Trapped in Time",
    presetFossilsDesc: "Why fossils survive in limestone but vanish in marble",
    presetStepOf: "Step {current} of {total}",
    presetAutoPlay: "▶ Auto-Play",
    presetPause: "⏸ Pause",
    presetPrev: "← Back",
    presetNext: "Next →",
    presetFinish: "Finish",
    presetExit: "✕ Exit",
    presetComplete: "Scenario complete! Choose another preset or switch to Free Explore.",

    // PRESET NARRATIONS
    volcanoN1: "Deep beneath a volcano, magma churns at over 1,000°C. This molten rock contains the same minerals that will eventually become a canyon wall in Utah.",
    volcanoN2: "The volcano erupts! Lava flows across the surface and cools quickly in the open air.",
    volcanoN3: "For millions of years, wind and rain pound the basalt. Piece by piece, it crumbles into sand and sediment.",
    volcanoN4: "Rivers carry the sand to a shallow sea. Layer after layer piles up on the seafloor.",
    volcanoN5: "250 million years later, this sandstone forms the canyon walls at Arches National Park in Utah. The same atoms that were once magma now form the famous arches!",
    mountainN1: "On the floor of an ancient ocean, layers of clay and silt settle quietly. Tiny particles, washed in by rivers, blanket the seabed.",
    mountainN2: "Over millions of years, the layers compress into shale — thin, dark sheets of stone.",
    mountainN3: "The shale gets buried deeper and deeper. Miles underground, heat and pressure build. The clay minerals rearrange into hard, flat sheets.",
    mountainN4: "Tectonic forces — the same forces that move continents — push the slate upward. What was once ocean floor rises into mountains.",
    mountainN5: "Today, the Raft River Mountains in Utah contain slate like this — ancient sea-floor mud transformed by heat, pressure, and time into mountain rock.",
    circleN1: "Our journey starts with granite — formed deep underground from slowly cooling magma, full of visible crystals.",
    circleN2: "Exposed at the surface, wind and water slowly grind the granite into sand over millions of years.",
    circleN3: "Rivers carry the sand to a basin where it settles in layers. Weight from above compresses it into sandstone.",
    circleN4: "The sandstone gets buried miles deep. Intense heat and pressure fuse the sand grains together into extremely hard quartzite.",
    circleN5: "Even deeper, the temperature rises past the melting point. The solid rock becomes liquid magma once again.",
    circleN6: "The magma slowly cools in an underground chamber. Large crystals grow over thousands of years. Granite is reborn.",
    circleN7: "One complete rock cycle — granite to granite — takes 200 to 500 million years. The same atoms have been cycling like this since Earth formed 4.5 billion years ago!",
    fossilsN1: "In a warm, shallow sea, tiny organisms live and die. Their shells — made of calcite — drift to the ocean floor and pile up.",
    fossilsN2: "Over millions of years, the shells compact and cement into limestone. Some shells are preserved perfectly — these are fossils!",
    fossilsN3: "This is why scientists find ocean fossils in limestone on mountaintops — the rock formed on the sea floor and was later pushed up. Timpanogos Cave in Utah is carved from limestone like this!",
    fossilsN4: "Now watch what happens when limestone is buried deep underground. Heat and pressure recrystallize the calcite...",
    fossilsN5: "The limestone becomes marble. It's beautiful — but the fossils are GONE. The recrystallization destroyed them. This is why you find fossils in sedimentary rocks but almost never in metamorphic rocks.",

    // JOURNEY
    journeyTitle: "🕰️ Geological Journey",
    journeySubtitle: "Pick a starting rock and watch its journey through millions of years.",
    journeyStartBtn: "Start Journey →",
    journeyBackLink: "← Back to Free Explore",
    journeyPlay: "▶ Play",
    journeyPause: "⏸ Pause",
    journeySpeed1: "1× Speed",
    journeySpeed2: "2× Speed",
    journeySpeed4: "4× Speed",
    journeyNew: "🔄 New",
    journeyChange: "🪨 Change",
    journeyExit: "✕ Exit",
    journeyMya: "Million Years Ago",
    journeyToday: "Present Day",
    journeyComplete: "Journey Complete",
    journeySummary: "Your {rock} traveled through {steps} transformations over 500 million years. Every atom is still here — just rearranged.",
    journeyCloseSummary: "Today, this {rock} waits at the surface — ready for the next chapter.",
    journeyUtahSummary: "Today, this {rock} can be found at {place} in Utah.",
    depthSurface: "Surface", depthShallow: "Shallow", depthDeep: "Deep", depthMantle: "Mantle",

    // JOURNEY NARRATIONS
    jrnIgnA0: "Your {rock} sits exposed on a mountainside, baked by sun and pounded by rain.",
    jrnIgnA1: "Over 100 million years, wind, ice, and water break {rock} into sand and silt.",
    jrnIgnA2: "Rivers carry the sediment to a vast inland sea. Layer upon layer settles on the ocean floor.",
    jrnIgnA3: "The seafloor sinks deeper as tectonic plates collide. Heat and pressure fuse the sand grains together.",
    jrnIgnA4: "Deeper still, the temperature crosses the melting point. Solid rock becomes liquid magma.",
    jrnIgnA5: "The magma cools slowly in a vast underground chamber over thousands of years. Large crystals grow.",
    jrnIgnA6: "Tectonic forces uplift the new granite to the surface. A new chapter in the rock cycle begins.",
    jrnIgnB0: "Your {rock} lies deep underground, surrounded by rising temperatures.",
    jrnIgnB1: "The heat overwhelms the rock's structure. It melts into glowing magma at over 1,000°C.",
    jrnIgnB2: "A volcanic eruption pushes the magma to the surface. It cools rapidly in the open air.",
    jrnIgnB3: "Millions of years of rain and frost slowly crumble the basalt into fine particles.",
    jrnIgnB4: "Marine organisms incorporate the minerals. Their shells pile up on the ocean floor for eons.",
    jrnIgnB5: "The limestone is buried miles deep. Heat and pressure transform it into sparkling marble.",
    jrnIgnC0: "Your {rock} formed deep underground, locked beneath miles of overlying rock.",
    jrnIgnC1: "Over tens of millions of years, tectonic forces push the rock toward the surface.",
    jrnIgnC2: "Exposed to the elements, the rock slowly disintegrates into fine clay and silt.",
    jrnIgnC3: "The fine particles settle in a calm lake. Layer after paper-thin layer accumulates.",
    jrnIgnC4: "Continents collide. The shale is buried and squeezed into smooth, hard slate.",
    jrnIgnC5: "Mountain-building forces push the slate upward. Ancient ocean floor becomes a mountain peak.",
    jrnSedA0: "Your {rock} rests in a quiet layer of earth, undisturbed for millions of years.",
    jrnSedA1: "As tectonic plates converge, the rock is buried deeper. Heat and pressure transform its minerals.",
    jrnSedA2: "Still deeper, the temperature exceeds the melting point. The rock dissolves into magma.",
    jrnSedA3: "The magma rises through cracks in the crust, cooling rapidly as it reaches the surface.",
    jrnSedA4: "Wind and rain attack the new basalt. Over millions of years, it crumbles to sand.",
    jrnSedA5: "The sand is carried to a desert basin and cemented into sandstone once again.",
    jrnSedB0: "Your {rock} sits exposed on a riverbank, battered by seasonal floods.",
    jrnSedB1: "The river grinds the rock into clay and silt, carrying it downstream.",
    jrnSedB2: "The fine sediment settles in a delta. Centuries of layers compress into thin sheets.",
    jrnSedB3: "Plate collision buries the shale miles underground. Pressure aligns the clay minerals into slate.",
    jrnSedB4: "Mountain-building uplifts the slate to a high ridge.",
    jrnSedB5: "Frost wedging and rain break the slate into rubble. The cycle is ready to begin again.",
    jrnSedC0: "Your {rock} was formed at the bottom of an ancient sea, rich with fossils.",
    jrnSedC1: "Tectonic uplift raises the rock high above sea level.",
    jrnSedC2: "Centuries of rain dissolve and fragment the rock into mineral-rich sediment.",
    jrnSedC3: "In a warm tropical sea, organisms build shells from the dissolved minerals. Shells pile up.",
    jrnSedC4: "A continent collides. The limestone is pushed deep underground and recrystallized into marble.",
    jrnMetA0: "Your {rock} endures immense heat deep in the Earth's crust.",
    jrnMetA1: "The heat finally overcomes the rock. It melts into magma.",
    jrnMetA2: "The magma slowly crystallizes in a vast underground pluton.",
    jrnMetA3: "Millions of years of erosion strip away the overlying rock, exposing the granite.",
    jrnMetA4: "Wind and water break the granite into coarse sand.",
    jrnMetA5: "The sand is deposited in a river delta, compacting into sandstone over time.",
    jrnMetB0: "Your {rock} sits deep in a mountain root, transformed long ago by heat and pressure.",
    jrnMetB1: "The mountain erodes away over hundreds of millions of years, exposing the rock.",
    jrnMetB2: "Rain and frost shatter the rock. Rivers carry the fragments to the coast.",
    jrnMetB3: "In a warm sea, calcium carbonate from dissolved minerals forms limestone.",
    jrnMetB4: "A new tectonic collision buries the limestone. Heat and pressure create marble.",
    jrnMetB5: "Uplift brings the marble near the surface. A mountain of metamorphic rock is reborn.",
    jrnMetC0: "Your {rock} formed under extreme conditions, but now sits deep and stable.",
    jrnMetC1: "Tectonic forces push the rock up through layers of younger sediment.",
    jrnMetC2: "Exposed at the surface, freeze-thaw cycles crack the rock into fine clay.",
    jrnMetC3: "The clay settles in a quiet lake, building paper-thin layers of shale.",
    jrnMetC4: "The shale is buried deep again by a new mountain-building event. It melts completely.",
    jrnMetC5: "A violent eruption flings the magma into the air. It cools almost instantly into volcanic glass.",

    // UTAH CONNECTIONS
    utahSectionTitle: "🏔️ Utah Connections",
    utahArches: "Arches National Park",
    utahArchesDesc: "Wind and water carved natural arches from ancient sand dunes turned to stone.",
    utahArchesLoc: "Moab, Utah",
    utahLCC: "Little Cottonwood Canyon",
    utahLCCDesc: "This granite cooled slowly from magma about 30 million years ago, deep underground.",
    utahLCCLoc: "Wasatch Mountains",
    utahTimp: "Timpanogos Cave",
    utahTimpDesc: "An ancient sea floor now high in the mountains. Water dissolved the limestone to create cave chambers.",
    utahTimpLoc: "American Fork Canyon",
    utahGreenRiver: "Green River Formation",
    utahGreenRiverDesc: "Fine lake sediment preserved some of the world's most detailed fish and plant fossils.",
    utahGreenRiverLoc: "Eastern Utah",
    utahFarmington: "Farmington Canyon",
    utahFarmingtonDesc: "Some of Utah's oldest rocks — ancient sandstone transformed by immense heat and pressure over a billion years ago.",
    utahFarmingtonLoc: "Wasatch Front",

    // ROCK UTAH FIELDS (short versions)
    graniteUtah: "Little Cottonwood Canyon — carved through 30-million-year-old granite",
    basaltUtah: "Black Rock near the Great Salt Lake — an ancient lava flow",
    obsidianUtah: "Found in volcanic areas near the Black Rock Desert of southwestern Utah",
    sandstoneUtah: "Arches National Park — arches carved from Entrada Sandstone",
    limestoneUtah: "Timpanogos Cave — limestone dissolved by water to form cave chambers",
    shaleUtah: "Green River Formation — famous for detailed fish and plant fossils in shale",
    marbleUtah: "Found in metamorphic zones of the Wasatch Range",
    slateUtah: "Found in the Raft River Mountains metamorphic complex",
    quartziteUtah: "Farmington Canyon — quartzite cliffs visible along the Wasatch Front",

    // FOOTER
    footerCredit: "Ogden School District · Science Simulations",
    footerStandard: "Standard:",
    footerStandardName: "Utah SEEd 7.2.1",
    footerSubject: "— Rock Cycle & Energy Flow",

    // ORIENTATION / MISC
    orientationHint: "For the best experience,<br>please rotate your device to landscape orientation.",
    animSkip: "Skip ▶",
    comingSoonPrefix: "Coming soon! Switch to Free Explore to keep experimenting."
  },

  es: {
    // HEADER
    appTitle: "Laboratorio del Ciclo de las Rocas",
    appSubtitle: "Utah SEEd 7.2.1 · Distrito Escolar de Ogden",
    btnLanguage: "EN | ES",

    // MODE TABS
    modeGuided: "Guiado",
    modeFreeExplore: "Exploración Libre",
    modeGeoJourney: "Viaje Geológico",
    modePresets: "Escenarios",

    // ROCK TYPES
    typeIgneous: "Ígnea", typeSedimentary: "Sedimentaria", typeMetamorphic: "Metamórfica", typeMaterial: "Material",

    // ROCK SHELF
    shelfTitle: "Muestras de Rocas",

    // ROCK NAMES
    rockGranite: "Granito", rockBasalt: "Basalto", rockObsidian: "Obsidiana",
    rockSandstone: "Arenisca", rockLimestone: "Caliza", rockShale: "Lutita",
    rockMarble: "Mármol", rockSlate: "Pizarra", rockQuartzite: "Cuarcita",
    rockMagma: "Magma", rockLava: "Lava", rockSediment: "Sedimento",

    // ROCK DESCRIPTIONS
    graniteDesc: "Roca de grano grueso formada por el enfriamiento lento del magma en las profundidades de la Tierra. Se pueden ver cristales individuales de cuarzo, feldespato y mica.",
    basaltDesc: "Roca oscura de grano fino formada por lava que se enfrió rápidamente en la superficie. Los cristales son demasiado pequeños para verlos sin un microscopio.",
    obsidianDesc: "Vidrio volcánico formado cuando la lava se enfría tan rápido que no se forman cristales. Brillante, lisa y con bordes extremadamente afilados.",
    sandstoneDesc: "Compuesta de granos de arena cementados. A menudo muestra capas visibles. Se siente áspera como papel de lija.",
    limestoneDesc: "A menudo formada por conchas y esqueletos de organismos marinos. Puede contener fósiles. Produce burbujas al contacto con ácido.",
    shaleDesc: "Compuesta de diminutas partículas de arcilla prensadas en capas finas. Se separa fácilmente en láminas planas. Generalmente gris oscuro o negra.",
    marbleDesc: "Se forma cuando la caliza se transforma por calor y presión. Los cristales entrelazados le dan una textura azucarada y brillante.",
    slateDesc: "Se forma cuando la lutita se comprime por presión. Más dura y brillante que la lutita. Se separa en láminas lisas y planas.",
    quartziteDesc: "Se forma cuando la arenisca se fusiona por calor y presión intensos. Extremadamente dura — más dura que el acero. Los granos de arena ya no son visibles.",
    magmaDesc: "Roca fundida debajo de la superficie de la Tierra. Contiene minerales disueltos y gases. Temperatura: 700°C–1300°C.",
    lavaDesc: "Roca fundida que ha llegado a la superficie de la Tierra a través de un volcán o grieta.",
    sedimentDesc: "Fragmentos de roca — arena, limo, arcilla y grava — creados por la meteorización y transportados por el viento, el agua y el hielo.",

    // ROCK PROPERTIES
    propTexture: "Textura", propFormation: "Formación", propMinerals: "Minerales", propGrainSize: "Tamaño del grano", propParentRock: "Roca madre", propUtah: "Conexión con Utah",
    propWhatsNext: "¿Qué sigue?",
    subtypeIntrusive: "Intrusiva", subtypeExtrusive: "Extrusiva", subtypeClastic: "Clástica", subtypeChemOrg: "Química/Orgánica",

    // Rock textures
    graniteTexture: "Grano grueso, cristalina",
    basaltTexture: "Grano fino, densa",
    obsidianTexture: "Vítrea, fractura concoidea",
    sandstoneTexture: "Grano mediano, áspera, con capas",
    limestoneTexture: "Grano fino a mediano, puede contener fósiles",
    shaleTexture: "Grano muy fino, fisible (se separa en láminas)",
    marbleTexture: "Cristales entrelazados, no foliada",
    slateTexture: "Grano fino, foliada, lisa",
    quartziteTexture: "Granos entrelazados, muy dura, no foliada",

    // Rock formations
    graniteFormation: "Enfriamiento lento del magma en las profundidades",
    basaltFormation: "Enfriamiento rápido de la lava en la superficie",
    obsidianFormation: "Enfriamiento extremadamente rápido de la lava",
    sandstoneFormation: "Arena depositada por el viento o el agua, compactada y cementada durante millones de años",
    limestoneFormation: "Acumulación de conchas marinas y sedimento en el fondo del océano, compactada con el tiempo",
    shaleFormation: "Arcilla y limo depositados en aguas tranquilas, comprimidos durante millones de años",
    marbleFormation: "Caliza recristalizada por calor y presión en las profundidades",
    slateFormation: "Lutita comprimida y calentada — los minerales de arcilla se reorientan en láminas planas",
    quartziteFormation: "Granos de arenisca fusionados por calor y presión",

    // Grain sizes
    grainLarge: "grueso", grainSmall: "pequeño", grainNone: "ninguno", grainMedium: "mediano", grainFine: "fino", grainVeryFine: "muy fino",

    // PROCESS ZONES
    processMelting: "Fusión",
    processCrystallization: "Cristalización",
    processWeathering: "Meteorización y Erosión",
    processDeposition: "Deposición y Sedimentación",
    processHeatPressure: "Calor y Presión",
    processUplift: "Levantamiento y Deformación",

    // PROCESS DESCRIPTIONS
    meltingDesc: "El calor extremo en el interior de la Tierra funde la roca sólida y la convierte en magma.",
    crystallizationDesc: "A medida que el magma o la lava se enfría, los minerales cristalizan y forman roca ígnea sólida.",
    weatheringDesc: "El viento, el agua y el hielo rompen lentamente la roca en fragmentos más pequeños llamados sedimento.",
    depositionDesc: "Las capas de sedimento se acumulan, se compactan bajo presión y se cementan en roca sólida.",
    heatPressureDesc: "En las profundidades de la Tierra, el calor y la presión cambian la estructura mineral de la roca sin fundirla.",
    upliftDesc: "Las fuerzas en el interior de la Tierra empujan las rocas enterradas hacia la superficie, donde la meteorización puede comenzar.",

    // MATTER NOTES
    meltingMatter: "Los minerales se disuelven en el líquido fundido — ¡pero los átomos siguen ahí!",
    crystallizationMatter: "Los mismos minerales se reforman como cristales al enfriarse y solidificarse el líquido.",
    weatheringMatter: "La roca se rompe, pero los granos minerales siguen intactos — solo son más pequeños.",
    depositionMatter: "Los mismos granos minerales se comprimen y se cementan de nuevo.",
    heatPressureMatter: "Los minerales se reorganizan en nuevos patrones, pero NO se crean ni destruyen átomos.",
    upliftMatter: "La misma roca, los mismos minerales — solo se trasladaron a un nuevo lugar.",

    // CHOICE POPUPS
    crystChoiceTitle: "¿Qué tan rápido se enfrió el magma?",
    crystChoiceSubtitle: "La velocidad de enfriamiento determina el tamaño de los cristales y la roca que se forma.",
    crystSlow: "Lento", crystSlowDesc: "Profundo bajo tierra\n→ Cristales grandes\n→ Granito",
    crystFast: "Rápido", crystFastDesc: "Flujo de lava\n→ Cristales pequeños\n→ Basalto",
    crystUltra: "Ultra-rápido", crystUltraDesc: "Erupción volcánica\n→ Sin cristales\n→ Obsidiana",
    crystChoiceHint: "💡 Enfriamiento lento = tiempo para que crezcan cristales grandes. Enfriamiento rápido = cristales pequeños o ninguno.",
    depoChoiceTitle: "¿Qué se depositó en las capas?",
    depoChoiceSubtitle: "El tipo de sedimento determina qué roca se forma.",
    depoSand: "Granos de arena", depoSandDesc: "Transporte por\nviento o agua\n→ Arenisca",
    depoShells: "Conchas y fósiles", depoShellsDesc: "Organismos marinos\nen el fondo del mar\n→ Caliza",
    depoClay: "Arcilla y limo", depoClayDesc: "Sedimentación\nen aguas tranquilas\n→ Lutita",
    depoChoiceHint: "💡 Las capas se acumulan, se compactan por su propio peso y se cementan durante millones de años.",

    // EXPLANATION PANEL
    explanationTitle: "¿Qué está pasando?",
    explanationDefault: "Selecciona una roca del estante, luego arrástrala a una zona de proceso para ver una transformación.",
    explainAvailTransforms: "Transformaciones disponibles",
    explainDragHint: "Arrastra esta roca a cualquier zona resaltada →",
    explainNextSteps: "Siguientes pasos",
    explainEnergyLabel: "Energía:",

    // ENERGY / MATTER / CYCLE
    energyTitle: "Flujo de Energía",
    energySun: "Energía del Sol",
    energyEarthHeat: "Calor Interno de la Tierra",
    energyGravity: "Gravedad",
    energyCooling: "Enfriamiento",
    energyTectonic: "Fuerzas Tectónicas",
    matterTitle: "Rastreador de Materia",
    matterConservation: "Mismos átomos — nuevo arreglo",
    matterRuleAtoms: "Los átomos <strong>nunca</strong> se crean ni se destruyen en el ciclo de las rocas — solo se reorganizan.",
    matterRuleMinerals: "Los minerales pueden cambiar de forma, pero los mismos elementos circulan por los tres tipos de rocas.",
    matterRulePrompt: "Rastrea el viaje de tu roca a través del ciclo aquí.",
    cycleTitle: "Ruta del Ciclo",
    cycleEmpty: "Tu ruta de exploración se construye aquí a medida que haces transformaciones.",
    cyclePathsDiscovered: "rutas descubiertas",
    cycleAllFound: "¡Todas las rutas descubiertas!",
    cyclePathsRemaining: "{n} rutas restantes",

    // HISTORY STRIP
    historyLabel: "Historial",
    historyClear: "Borrar historial",
    historyEmpty: "Las transformaciones aparecerán aquí",
    historyUplifted: " (elevada a la superficie)",

    // SPECIMEN DISPLAY
    specimenEmptyText: "Haz clic en una roca del estante para examinarla aquí",
    specimenIntermediate: "material intermedio",
    specimenFrom: "de",
    hintMagma: "Arrastra a <strong>Cristalización</strong> — la velocidad de enfriamiento determina el tamaño de cristales y el tipo de roca.",
    hintLava: "Arrastra a <strong>Cristalización</strong> — el enfriamiento rápido en la superficie forma basalto u obsidiana.",
    hintSediment: "Arrastra a <strong>Deposición y Sedimentación</strong> — las capas se compactan en roca sedimentaria.",

    // INVALID DROP
    rejectCrystRock: "¡La roca ya es sólida — fúndela primero!",
    rejectCrystSediment: "El sedimento debe compactarse en roca, luego fundirse.",
    rejectMeltMagma: "Ya es magma — ¡ya está fundido!",
    rejectMeltLava: "Ya es lava — ¡ya está fundida!",
    rejectMeltSediment: "El sedimento debe compactarse en roca antes de fundirse.",
    rejectWeatherMagma: "¡El magma debe enfriarse y cristalizar primero!",
    rejectWeatherLava: "¡La lava debe enfriarse y cristalizar primero!",
    rejectWeatherSediment: "¡El sedimento ya es roca fragmentada!",
    rejectDepositRock: "¡La roca debe meteorizarse en sedimento primero!",
    rejectDepositMolten: "Debe enfriarse → meteorizarse → sedimento primero!",
    rejectHPMagma: "El magma debe solidificarse antes del metamorfismo.",
    rejectHPLava: "La lava debe solidificarse antes del metamorfismo.",
    rejectHPSediment: "El sedimento debe compactarse en roca primero.",
    rejectUpliftMagma: "El magma debe solidificarse antes de ser levantado.",
    rejectUpliftLava: "La lava debe solidificarse antes de ser levantada.",
    rejectUpliftSediment: "El sedimento debe compactarse en roca primero.",
    rejectGeneric: "Esta transformación no es posible aquí.",

    // GUIDED
    guidedStepOf: "Paso {current} de {total}",
    guidedPrevious: "← Anterior",
    guidedNext: "Siguiente →",
    guidedSwitchFree: "Ir a Exploración Libre →",
    guidedSkipLink: "Ir a Exploración Libre →",
    guidedFollowInstructions: "¡Sigue las instrucciones de arriba! Busca la zona resaltada.",
    guidedFollowShort: "¡Sigue las instrucciones! Busca la zona resaltada.",

    // GUIDED STEPS
    guided1Title: "Conoce las Rocas",
    guided1Text: "¡Bienvenido! Vamos a explorar cómo se transforman las rocas. Haz clic en al menos 3 rocas diferentes — prueba una de cada familia: Ígnea (naranja), Sedimentaria (dorada) y Metamórfica (morada).",
    guided1Hint: "💡 Busca las etiquetas de colores en el estante de la izquierda.",
    guided1Complete: "¡Excelente! Has visto las tres familias de rocas. Observa cómo cada tipo se formó de manera completamente diferente.",

    guided2Title: "Fusión",
    guided2Text: "Arrastra el GRANITO del estante a la zona de Fusión (🌋). ¡Observa qué pasa!",
    guided2Hint: "💡 ¡Busca la zona brillante a la izquierda!",
    guided2Complete: "¡El granito se fundió en magma! La energía vino del interior de la Tierra. Los mismos minerales siguen ahí — solo que ahora son líquidos.",

    guided3Title: "Cristalización",
    guided3aText: "Tu magma está bajo tierra. Arrástralo a la zona de Cristalización (❄️) y elige 'Enfriamiento Lento'.",
    guided3aHint: "💡 Enfriamiento lento = tiempo para que crezcan cristales grandes.",
    guided3aComplete: "¡Enfriamiento lento bajo tierra = cristales GRANDES visibles! Así se forma el granito. Ahora probemos el enfriamiento rápido...",
    guided3bText: "Intenta de nuevo — arrastra el magma a Cristalización y elige 'Enfriamiento Rápido'.",
    guided3bHint: "💡 Enfriamiento rápido = cristales diminutos o ninguno.",
    guided3bComplete: "¡Enfriamiento rápido en la superficie = cristales diminutos! El mismo magma, roca diferente — porque la velocidad de enfriamiento importa.",

    guided4Title: "Meteorización y Erosión",
    guided4Text: "Arrastra cualquier roca del estante a la zona de Meteorización (🌧️). Observa cómo la naturaleza la descompone.",
    guided4Hint: "💡 La energía del Sol impulsa el viento, el agua y el hielo que rompen la roca.",
    guided4Complete: "¡La roca se rompió en sedimento — pedazos diminutos transportados por el viento y el agua! ¡La energía del Sol impulsa este proceso!",

    guided5Title: "Deposición y Sedimentación",
    guided5Text: "Ahora arrastra el sedimento a la zona de Deposición (📥). Elige cualquier tipo de sedimento.",
    guided5Hint: "💡 La gravedad empuja las capas hacia abajo; el peso y el tiempo las cementan.",
    guided5Complete: "¡Las capas de sedimento se comprimieron y cementaron en roca! La gravedad hizo el trabajo pesado — literalmente.",

    guided6Title: "Calor y Presión",
    guided6Text: "Arrastra la CALIZA del estante a la zona de Calor y Presión (🔥). Mira qué pasa cuando la roca se comprime bajo tierra.",
    guided6Hint: "💡 La roca cambia sin fundirse — los minerales se reorganizan bajo presión.",
    guided6Complete: "¡La caliza se convirtió en mármol! Los mismos minerales de calcita, pero el calor y la presión los reorganizaron en cristales entrelazados.",

    guided7Title: "Las Parejas Metamórficas",
    guided7aText: "Cada roca sedimentaria tiene una pareja metamórfica. Intenta arrastrar la LUTITA a la zona de Calor y Presión.",
    guided7aHint: "💡 La lutita está hecha de capas delgadas de arcilla — la presión las realinea.",
    guided7aComplete: "¡La lutita se convirtió en pizarra! Ahora prueba con la ARENISCA.",
    guided7bText: "Ahora arrastra la ARENISCA a la zona de Calor y Presión.",
    guided7bHint: "💡 Los granos de arena se fusionan bajo calor extremo.",
    guided7bComplete: "¡La arenisca se convirtió en cuarcita! Tres parejas: Caliza→Mármol, Lutita→Pizarra, Arenisca→Cuarcita. La roca madre determina la roca metamórfica.",

    guided8Title: "Levantamiento",
    guided8Text: "Las rocas profundas no pueden meteorizarse — primero necesitan llegar a la superficie. Arrastra cualquier roca a la zona de Levantamiento (🏔️).",
    guided8Hint: "💡 Las fuerzas tectónicas empujan las rocas hacia arriba — ¡completando el ciclo!",
    guided8Complete: "¡Las fuerzas tectónicas empujaron la roca hasta la superficie! Ahora está expuesta al viento y la lluvia — y el ciclo puede continuar.",

    guided9Title: "Completa un Ciclo",
    guided9Text: "¡Únelo todo! Empieza con GRANITO e intenta convertirlo de nuevo en granito. Usa cualquier combinación de procesos. ¿Cuántos pasos necesitas?",
    guided9Hint: "💡 ¡No hay un solo camino correcto — las rocas pueden tomar muchas rutas!",
    guided9CompleteShort: "¡Encontraste el camino más corto — solo fundir y recristalizar! El ciclo real también puede tomar este camino, aunque requiere calor extremo.",
    guided9CompleteMed: "¡Completaste un ciclo de rocas completo en {n} pasos! Hay muchos caminos posibles en el ciclo de las rocas.",
    guided9CompleteLong: "¡Completaste un ciclo de rocas completo en {n} pasos — la ruta panorámica! Cada camino en el ciclo es válido.",

    guided10Title: "Revisa Tu Progreso",
    guided10Text: "Mira tu Diagrama del Ciclo a la derecha. ¡Has descubierto {cnt} de {tot} rutas! Cambia a Exploración Libre para encontrar las que te faltan.",
    guided10HintComplete: "🎉 ¡Increíble — encontraste todas las rutas!",
    guided10HintRemaining: "💡 {n} ruta{s} por descubrir.",

    // PRESETS
    presetSelectTitle: "Elige un Escenario",
    presetVolcanoTitle: "Del Volcán a la Playa",
    presetVolcanoDesc: "Sigue una roca desde la erupción hasta una pared de cañón",
    presetMountainTitle: "El Constructor de Montañas",
    presetMountainDesc: "Mira cómo el lodo del fondo marino se convierte en montaña",
    presetCircleTitle: "Dando Vueltas",
    presetCircleDesc: "Un viaje completo por todo el ciclo de las rocas",
    presetFossilsTitle: "Fósiles Atrapados en el Tiempo",
    presetFossilsDesc: "Por qué los fósiles sobreviven en caliza pero desaparecen en mármol",
    presetStepOf: "Paso {current} de {total}",
    presetAutoPlay: "▶ Reproducir",
    presetPause: "⏸ Pausa",
    presetPrev: "← Atrás",
    presetNext: "Siguiente →",
    presetFinish: "Terminar",
    presetExit: "✕ Salir",
    presetComplete: "¡Escenario completado! Elige otro escenario o cambia a Exploración Libre.",

    // PRESET NARRATIONS
    volcanoN1: "En las profundidades de un volcán, el magma se agita a más de 1.000°C. Esta roca fundida contiene los mismos minerales que eventualmente formarán una pared de cañón en Utah.",
    volcanoN2: "¡El volcán erupciona! La lava fluye por la superficie y se enfría rápidamente al aire libre.",
    volcanoN3: "Durante millones de años, el viento y la lluvia golpean el basalto. Pedazo a pedazo, se desmorona en arena y sedimento.",
    volcanoN4: "Los ríos llevan la arena a un mar poco profundo. Capa tras capa se acumula en el fondo marino.",
    volcanoN5: "250 millones de años después, esta arenisca forma las paredes del cañón en el Parque Nacional Arches en Utah. ¡Los mismos átomos que una vez fueron magma ahora forman los famosos arcos!",
    mountainN1: "En el fondo de un antiguo océano, capas de arcilla y limo se depositan silenciosamente. Partículas diminutas, arrastradas por los ríos, cubren el lecho marino.",
    mountainN2: "Durante millones de años, las capas se comprimen en lutita — láminas delgadas y oscuras de piedra.",
    mountainN3: "La lutita se entierra cada vez más profundo. A kilómetros bajo tierra, el calor y la presión aumentan. Los minerales de arcilla se reorganizan en láminas duras y planas.",
    mountainN4: "Las fuerzas tectónicas — las mismas que mueven los continentes — empujan la pizarra hacia arriba. Lo que fue fondo marino se eleva formando montañas.",
    mountainN5: "Hoy, las Montañas Raft River en Utah contienen pizarra como esta — antiguo lodo marino transformado por calor, presión y tiempo en roca de montaña.",
    circleN1: "Nuestro viaje comienza con granito — formado en las profundidades por magma que se enfrió lentamente, lleno de cristales visibles.",
    circleN2: "Expuesto en la superficie, el viento y el agua lentamente convierten el granito en arena durante millones de años.",
    circleN3: "Los ríos llevan la arena a una cuenca donde se deposita en capas. El peso de arriba la comprime en arenisca.",
    circleN4: "La arenisca se entierra a kilómetros de profundidad. El calor y la presión intensos fusionan los granos de arena en cuarcita extremadamente dura.",
    circleN5: "Aún más profundo, la temperatura sube más allá del punto de fusión. La roca sólida se convierte en magma líquido otra vez.",
    circleN6: "El magma se enfría lentamente en una cámara subterránea. Cristales grandes crecen durante miles de años. El granito renace.",
    circleN7: "Un ciclo completo — de granito a granito — toma de 200 a 500 millones de años. ¡Los mismos átomos han estado reciclándose desde que la Tierra se formó hace 4.500 millones de años!",
    fossilsN1: "En un mar cálido y poco profundo, pequeños organismos viven y mueren. Sus conchas — hechas de calcita — se depositan en el fondo del océano y se acumulan.",
    fossilsN2: "Durante millones de años, las conchas se compactan y se cementan en caliza. ¡Algunas conchas se preservan perfectamente — estos son fósiles!",
    fossilsN3: "Por eso los científicos encuentran fósiles marinos en caliza en la cima de las montañas — la roca se formó en el fondo del mar y luego fue empujada hacia arriba. ¡La Cueva de Timpanogos en Utah está tallada en caliza como esta!",
    fossilsN4: "Ahora observa qué pasa cuando la caliza se entierra profundamente. El calor y la presión recristalizan la calcita...",
    fossilsN5: "La caliza se convierte en mármol. Es hermosa — pero los fósiles DESAPARECIERON. La recristalización los destruyó. Por eso encuentras fósiles en rocas sedimentarias pero casi nunca en rocas metamórficas.",

    // JOURNEY
    journeyTitle: "🕰️ Viaje Geológico",
    journeySubtitle: "Elige una roca inicial y observa su viaje a través de millones de años.",
    journeyStartBtn: "Iniciar Viaje →",
    journeyBackLink: "← Volver a Exploración Libre",
    journeyPlay: "▶ Reproducir",
    journeyPause: "⏸ Pausa",
    journeySpeed1: "1× Velocidad",
    journeySpeed2: "2× Velocidad",
    journeySpeed4: "4× Velocidad",
    journeyNew: "🔄 Nuevo",
    journeyChange: "🪨 Cambiar",
    journeyExit: "✕ Salir",
    journeyMya: "Millones de Años Atrás",
    journeyToday: "Hoy",
    journeyComplete: "Viaje Completado",
    journeySummary: "Tu {rock} viajó a través de {steps} transformaciones durante 500 millones de años. Cada átomo sigue aquí — solo reorganizado.",
    journeyCloseSummary: "Hoy, esta {rock} espera en la superficie — lista para el siguiente capítulo.",
    journeyUtahSummary: "Hoy, esta {rock} se puede encontrar en {place} en Utah.",
    depthSurface: "Superficie", depthShallow: "Somero", depthDeep: "Profundo", depthMantle: "Manto",

    // JOURNEY NARRATIONS
    jrnIgnA0: "Tu {rock} se encuentra expuesto en una ladera, cocido por el sol y golpeado por la lluvia.",
    jrnIgnA1: "Durante 100 millones de años, el viento, el hielo y el agua rompen {rock} en arena y limo.",
    jrnIgnA2: "Los ríos llevan el sedimento a un vasto mar interior. Capa tras capa se asienta en el fondo del océano.",
    jrnIgnA3: "El fondo marino se hunde más profundo a medida que las placas tectónicas chocan. El calor y la presión fusionan los granos de arena.",
    jrnIgnA4: "Aún más profundo, la temperatura cruza el punto de fusión. La roca sólida se convierte en magma líquido.",
    jrnIgnA5: "El magma se enfría lentamente en una vasta cámara subterránea durante miles de años. Crecen cristales grandes.",
    jrnIgnA6: "Las fuerzas tectónicas elevan el nuevo granito a la superficie. Un nuevo capítulo del ciclo comienza.",
    jrnIgnB0: "Tu {rock} yace en las profundidades, rodeado de temperaturas crecientes.",
    jrnIgnB1: "El calor supera la estructura de la roca. Se funde en magma brillante a más de 1.000°C.",
    jrnIgnB2: "Una erupción volcánica empuja el magma a la superficie. Se enfría rápidamente al aire libre.",
    jrnIgnB3: "Millones de años de lluvia y heladas deshacen lentamente el basalto en partículas finas.",
    jrnIgnB4: "Los organismos marinos incorporan los minerales. Sus conchas se acumulan en el fondo del océano durante eones.",
    jrnIgnB5: "La caliza se entierra a kilómetros de profundidad. El calor y la presión la transforman en mármol brillante.",
    jrnIgnC0: "Tu {rock} se formó en las profundidades, encerrado bajo kilómetros de roca.",
    jrnIgnC1: "Durante decenas de millones de años, las fuerzas tectónicas empujan la roca hacia la superficie.",
    jrnIgnC2: "Expuesta a los elementos, la roca se desintegra lentamente en arcilla fina y limo.",
    jrnIgnC3: "Las partículas finas se depositan en un lago tranquilo. Capa tras capa finísima se acumula.",
    jrnIgnC4: "Los continentes chocan. La lutita se entierra y se comprime en pizarra lisa y dura.",
    jrnIgnC5: "Las fuerzas de formación de montañas empujan la pizarra hacia arriba. El antiguo fondo marino se convierte en cima montañosa.",
    jrnSedA0: "Tu {rock} descansa en una capa tranquila de tierra, sin perturbar durante millones de años.",
    jrnSedA1: "Al converger las placas tectónicas, la roca se entierra más profundamente. El calor y la presión transforman sus minerales.",
    jrnSedA2: "Aún más profundo, la temperatura excede el punto de fusión. La roca se disuelve en magma.",
    jrnSedA3: "El magma asciende por grietas en la corteza, enfriándose rápidamente al llegar a la superficie.",
    jrnSedA4: "El viento y la lluvia atacan el nuevo basalto. Durante millones de años, se desmorona en arena.",
    jrnSedA5: "La arena es llevada a una cuenca desértica y cementada en arenisca una vez más.",
    jrnSedB0: "Tu {rock} se encuentra expuesto en la orilla de un río, golpeado por inundaciones estacionales.",
    jrnSedB1: "El río muele la roca en arcilla y limo, llevándola río abajo.",
    jrnSedB2: "El sedimento fino se deposita en un delta. Siglos de capas se comprimen en láminas finas.",
    jrnSedB3: "La colisión de placas entierra la lutita bajo kilómetros. La presión alinea los minerales de arcilla en pizarra.",
    jrnSedB4: "La formación de montañas eleva la pizarra a una cresta alta.",
    jrnSedB5: "El agrietamiento por hielo y la lluvia rompen la pizarra en escombros. El ciclo está listo para comenzar de nuevo.",
    jrnSedC0: "Tu {rock} se formó en el fondo de un antiguo mar, rica en fósiles.",
    jrnSedC1: "El levantamiento tectónico eleva la roca muy por encima del nivel del mar.",
    jrnSedC2: "Siglos de lluvia disuelven y fragmentan la roca en sedimento rico en minerales.",
    jrnSedC3: "En un mar tropical cálido, los organismos construyen conchas a partir de los minerales disueltos. Las conchas se acumulan.",
    jrnSedC4: "Un continente choca. La caliza es empujada bajo tierra y recristalizada en mármol.",
    jrnMetA0: "Tu {rock} soporta un calor inmenso en la corteza terrestre.",
    jrnMetA1: "El calor finalmente supera la roca. Se funde en magma.",
    jrnMetA2: "El magma cristaliza lentamente en un vasto plutón subterráneo.",
    jrnMetA3: "Millones de años de erosión eliminan la roca superpuesta, exponiendo el granito.",
    jrnMetA4: "El viento y el agua rompen el granito en arena gruesa.",
    jrnMetA5: "La arena se deposita en un delta fluvial, compactándose en arenisca con el tiempo.",
    jrnMetB0: "Tu {rock} yace profunda en la raíz de una montaña, transformada hace mucho por calor y presión.",
    jrnMetB1: "La montaña se erosiona durante cientos de millones de años, exponiendo la roca.",
    jrnMetB2: "La lluvia y las heladas destrozan la roca. Los ríos llevan los fragmentos a la costa.",
    jrnMetB3: "En un mar cálido, el carbonato de calcio de los minerales disueltos forma caliza.",
    jrnMetB4: "Una nueva colisión tectónica entierra la caliza. El calor y la presión crean mármol.",
    jrnMetB5: "El levantamiento trae el mármol cerca de la superficie. Una montaña de roca metamórfica renace.",
    jrnMetC0: "Tu {rock} se formó bajo condiciones extremas, pero ahora yace profunda y estable.",
    jrnMetC1: "Las fuerzas tectónicas empujan la roca hacia arriba a través de capas de sedimento más joven.",
    jrnMetC2: "Expuesta en la superficie, los ciclos de congelación-deshielo agrietan la roca en arcilla fina.",
    jrnMetC3: "La arcilla se deposita en un lago tranquilo, formando láminas finísimas de lutita.",
    jrnMetC4: "La lutita se entierra de nuevo por un nuevo evento de formación de montañas. Se funde completamente.",
    jrnMetC5: "Una erupción violenta lanza el magma al aire. Se enfría casi al instante en vidrio volcánico.",

    // UTAH
    utahSectionTitle: "🏔️ Conexiones con Utah",
    utahArches: "Parque Nacional Arches",
    utahArchesDesc: "El viento y el agua tallaron arcos naturales a partir de antiguas dunas de arena convertidas en piedra.",
    utahArchesLoc: "Moab, Utah",
    utahLCC: "Cañón Little Cottonwood",
    utahLCCDesc: "Este granito se enfrió lentamente del magma hace unos 30 millones de años, profundo bajo tierra.",
    utahLCCLoc: "Montañas Wasatch",
    utahTimp: "Cueva de Timpanogos",
    utahTimpDesc: "Un antiguo fondo marino ahora alto en las montañas. El agua disolvió la caliza para crear cámaras.",
    utahTimpLoc: "Cañón American Fork",
    utahGreenRiver: "Formación Green River",
    utahGreenRiverDesc: "Sedimento fino de lago preservó algunos de los fósiles de peces y plantas más detallados del mundo.",
    utahGreenRiverLoc: "Este de Utah",
    utahFarmington: "Cañón Farmington",
    utahFarmingtonDesc: "Algunas de las rocas más antiguas de Utah — antigua arenisca transformada por calor y presión hace más de mil millones de años.",
    utahFarmingtonLoc: "Frente Wasatch",

    graniteUtah: "Cañón Little Cottonwood — excavado a través de granito de 30 millones de años",
    basaltUtah: "Black Rock cerca del Gran Lago Salado — un antiguo flujo de lava",
    obsidianUtah: "Se encuentra en áreas volcánicas cerca del Desierto Black Rock en el suroeste de Utah",
    sandstoneUtah: "Parque Nacional Arches — arcos tallados en arenisca Entrada",
    limestoneUtah: "Cueva de Timpanogos — caliza disuelta por agua para formar cámaras",
    shaleUtah: "Formación Green River — famosa por fósiles detallados de peces y plantas en lutita",
    marbleUtah: "Se encuentra en zonas metamórficas de la Cordillera Wasatch",
    slateUtah: "Se encuentra en el complejo metamórfico de las Montañas Raft River",
    quartziteUtah: "Cañón Farmington — acantilados de cuarcita visibles a lo largo del Frente Wasatch",

    // FOOTER
    footerCredit: "Distrito Escolar de Ogden · Simulaciones Científicas",
    footerStandard: "Estándar:",
    footerStandardName: "Utah SEEd 7.2.1",
    footerSubject: "— Ciclo de las Rocas y Flujo de Energía",

    // MISC
    orientationHint: "Para la mejor experiencia,<br>por favor gira tu dispositivo a orientación horizontal.",
    animSkip: "Saltar ▶",
    comingSoonPrefix: "¡Próximamente! Cambia a Exploración Libre para seguir experimentando."
  }
};
