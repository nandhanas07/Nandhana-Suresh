import heroCafeArchitectureImg from '../assets/images/hero_cafe_architecture_1791180933092.jpg';
import pourOverCarafeImg from '../assets/images/product_pour_over_carafe_1791180944960.jpg';
import cardamomKouignImg from '../assets/images/product_cardamom_kouign_1791180956490.jpg';
import matchaLatteImg from '../assets/images/product_matcha_latte_1791180966406.jpg';
import ethiopiaBeansImg from '../assets/images/product_ethiopia_beans_1791180976390.jpg';

export type MenuCategory = 'all' | 'coffee' | 'bakery' | 'beans';

export interface CustomizationGroup {
  id: string;
  label: string;
  options: {
    id: string;
    name: string;
    priceDelta: number;
  }[];
  defaultOptionId: string;
}

export interface CafeProduct {
  id: string;
  name: string;
  category: Exclude<MenuCategory, 'all'>;
  categoryLabel: string;
  originOrProcess: string;
  elevationOrBatch: string;
  tastingNotes: string;
  price: number;
  unitLabel: string;
  description: string;
  image: string;
  dietaryTags: ('plant-based' | 'gluten-free' | 'organic')[];
  availabilityNote: string;
  extractionSpec: {
    temp: string;
    ratio: string;
    time: string;
  };
  customizationGroups: CustomizationGroup[];
}

export interface BrewMethodPreset {
  id: string;
  name: string;
  defaultDoseGrams: number;
  ratioMultiplier: number;
  tempCelsius: number;
  grindSetting: string;
  micronRange: string;
  totalTime: string;
  pours: {
    stage: string;
    timeWindow: string;
    waterPercentage: number;
    instruction: string;
  }[];
}

export const HERO_IMAGE = heroCafeArchitectureImg;

export const CAFE_PRODUCTS: CafeProduct[] = [
  {
    id: 'ethiopia-worka-v60',
    name: 'Worka Sakaro Hand Pour (V60)',
    category: 'coffee',
    categoryLabel: 'Single Origin Filter',
    originOrProcess: 'Gedeb, Ethiopia · Anaerobic Washed',
    elevationOrBatch: '2,150 MASL',
    tastingNotes: 'White Peach · Bergamot · Jasmine Blossom',
    price: 7.50,
    unitLabel: '300ml Carafe',
    description:
      'Harvested by 340 smallholder farmers in Gedeb and fermented in sealed stainless tanks for 48 hours before mountain spring washing. Brewed to order at 1:16.5 using custom remineralized water (45 ppm GH / 20 ppm KH).',
    image: pourOverCarafeImg,
    dietaryTags: ['plant-based', 'gluten-free', 'organic'],
    availabilityNote: 'Harvest Lot 04 · In Stock',
    extractionSpec: {
      temp: '93.5°C',
      ratio: '1 : 16.5',
      time: '02:55',
    },
    customizationGroups: [
      {
        id: 'serve-temp',
        label: 'Serving Style',
        defaultOptionId: 'hot-carafe',
        options: [
          { id: 'hot-carafe', name: 'Hot Borosilicate Carafe (93.5°C)', priceDelta: 0 },
          { id: 'flash-chilled', name: 'Flash-Chilled Over Crystal Ice', priceDelta: 0.50 },
        ],
      },
      {
        id: 'water-profile',
        label: 'Brew Device',
        defaultOptionId: 'hario-v60',
        options: [
          { id: 'hario-v60', name: 'Hario V60 Conical (High Clarity)', priceDelta: 0 },
          { id: 'kalita-wave', name: 'Kalita Wave 185 Flat-Bed (Round Body)', priceDelta: 0 },
        ],
      },
    ],
  },
  {
    id: 'cardamom-kouign-amann',
    name: 'Roasted Cardamom & Cultured Butter Kouign-Amann',
    category: 'bakery',
    categoryLabel: 'Sourdough Viennoiserie',
    originOrProcess: '36-Hour Cold Levain · Normandy 84% Butter',
    elevationOrBatch: '05:00 Morning Bake',
    tastingNotes: 'Caramelized Muscovado · Green Cardamom · Flaky Sea Salt',
    price: 6.25,
    unitLabel: 'Single Pastry (115g)',
    description:
      'Naturally leavened organic stone-milled Red Fife and Khorasan dough laminated with grass-fed cultured butter, freshly mortared Guatemalan green cardamom pods, and dark muscovado sugar crust.',
    image: cardamomKouignImg,
    dietaryTags: ['organic'],
    availabilityNote: 'Baked Fresh Daily',
    extractionSpec: {
      temp: '215°C Deck',
      ratio: '27 Layers',
      time: '36h Ferment',
    },
    customizationGroups: [
      {
        id: 'warming',
        label: 'Preparation',
        defaultOptionId: 'deck-warmed',
        options: [
          { id: 'deck-warmed', name: 'Gently Warmed in Stone Deck Oven', priceDelta: 0 },
          { id: 'ambient', name: 'Ambient Counter Temperature', priceDelta: 0 },
        ],
      },
      {
        id: 'accompaniment',
        label: 'Side Pairing',
        defaultOptionId: 'none',
        options: [
          { id: 'none', name: 'No Accompaniment', priceDelta: 0 },
          { id: 'cultured-butter', name: 'Side Whipped Espresso-Salted Butter', priceDelta: 1.50 },
          { id: 'seasonal-compote', name: 'Side Willamette Marionberry Compote', priceDelta: 1.75 },
        ],
      },
    ],
  },
  {
    id: 'uji-ceremonial-matcha',
    name: 'First-Harvest Uji Ceremonial Matcha Latte',
    category: 'coffee',
    categoryLabel: 'Botanical & Tea Bar',
    originOrProcess: 'Uji, Kyoto Prefecture · Stone-Milled Tencha',
    elevationOrBatch: 'Cultivar Samidori',
    tastingNotes: 'Sweet Umami · Steamed Edamame · Crisp Mineral Finish',
    price: 6.75,
    unitLabel: '350ml Glass',
    description:
      'Shade-grown for 28 days in Uji, Kyoto and granite stone-milled to 5 microns. Hand-whisked to order with 78°C spring water using an 80-prong bamboo chasen and layered over cold-pressed barista oat or local Jersey milk.',
    image: matchaLatteImg,
    dietaryTags: ['plant-based', 'gluten-free', 'organic'],
    availabilityNote: 'Spring First Flush',
    extractionSpec: {
      temp: '78.0°C',
      ratio: '3.5g : 45ml',
      time: '00:45 Whisk',
    },
    customizationGroups: [
      {
        id: 'milk-choice',
        label: 'Milk Selection',
        defaultOptionId: 'oatly-barista',
        options: [
          { id: 'oatly-barista', name: 'Organic Cold-Pressed Oat Milk', priceDelta: 0 },
          { id: 'jersey-whole', name: 'Willamette Valley Pasture-Raised Jersey Milk', priceDelta: 0 },
          { id: 'house-macadamia', name: 'House Raw Macadamia & Vanilla Milk', priceDelta: 1.00 },
        ],
      },
      {
        id: 'ice-level',
        label: 'Temperature',
        defaultOptionId: 'iced-layered',
        options: [
          { id: 'iced-layered', name: 'Iced Over Hand-Cut Kold-Draft Cubes', priceDelta: 0 },
          { id: 'steamed-microfoam', name: 'Warm Steamed Microfoam (60°C)', priceDelta: 0 },
        ],
      },
    ],
  },
  {
    id: 'finca-la-claudina-beans',
    name: 'Finca La Claudina Pink Bourbon — Whole Bean',
    category: 'beans',
    categoryLabel: 'Roastery Micro-Lot',
    originOrProcess: 'Ciudad Bolívar, Antioquia · 72h Extended Washed',
    elevationOrBatch: '1,950 MASL · Roasted Tuesdays',
    tastingNotes: 'Pink Grapefruit · Cane Honey · Silky Cocoa Butter',
    price: 24.00,
    unitLabel: '250g Sealed Box',
    description:
      'Grown by Mateo Gaviria on steep volcanic slopes in Antioquia, Colombia. Roasted lightly on our Loring S15 Falcon with a 14.2% development time ratio to preserve vibrant malic acidity and florals for both filter and modern espresso.',
    image: ethiopiaBeansImg,
    dietaryTags: ['plant-based', 'gluten-free', 'organic'],
    availabilityNote: '42 Bags Remaining',
    extractionSpec: {
      temp: '204°C Drop',
      ratio: '14.2% DTR',
      time: '08:45 Roast',
    },
    customizationGroups: [
      {
        id: 'grind-setting',
        label: 'Grind Preparation (Mahlkönig EK43S)',
        defaultOptionId: 'whole-bean',
        options: [
          { id: 'whole-bean', name: 'Whole Bean (Recommended for Peak Aromatics)', priceDelta: 0 },
          { id: 'v60-filter', name: 'Ground for Conical Pour-Over / V60 (650µm)', priceDelta: 0 },
          { id: 'flat-bed', name: 'Ground for Flat-Bed / Batch Brewer (800µm)', priceDelta: 0 },
          { id: 'espresso-fine', name: 'Ground for Modern Espresso (280µm)', priceDelta: 0 },
        ],
      },
      {
        id: 'bag-weight',
        label: 'Bag Allocation',
        defaultOptionId: '250g',
        options: [
          { id: '250g', name: '250g Nitrogen-Flushed Box', priceDelta: 0 },
          { id: '500g', name: '500g Roaster Reserve Pouch (+Save $4)', priceDelta: 20.00 },
        ],
      },
    ],
  },
  {
    id: 'espresso-gibraltar-flight',
    name: 'Single-Origin Espresso & Cortado Flight',
    category: 'coffee',
    categoryLabel: 'Espresso Bar',
    originOrProcess: 'Huila, Colombia · Chiroso Cultivar',
    elevationOrBatch: '2,050 MASL · 9-Bar Profiling',
    tastingNotes: 'Blackcurrant · Roasted Hazelnut · Dark Panela',
    price: 8.50,
    unitLabel: 'Side-by-Side Flight',
    description:
      'Experience the same micro-lot Chiroso cultivar pulled twice: first as a naked 1:2.2 espresso shot showing bright blackcurrant clarity, paired alongside a 110ml Gibraltar cortado textured with velvety microfoam.',
    image: heroCafeArchitectureImg,
    dietaryTags: ['gluten-free', 'organic'],
    availabilityNote: 'Dialed In at 06:15',
    extractionSpec: {
      temp: '93.0°C',
      ratio: '19g : 42g',
      time: '00:29 Shot',
    },
    customizationGroups: [
      {
        id: 'cortado-milk',
        label: 'Cortado Milk Pairing',
        defaultOptionId: 'jersey-milk',
        options: [
          { id: 'jersey-milk', name: 'Pasture-Raised Whole Jersey Milk', priceDelta: 0 },
          { id: 'oat-milk', name: 'Barista Oat Milk (100% Plant-Based)', priceDelta: 0 },
        ],
      },
      {
        id: 'sparkling-water',
        label: 'Palate Cleanser',
        defaultOptionId: 'mineral-sparkling',
        options: [
          { id: 'mineral-sparkling', name: 'Chilled House Remineralized Sparkling Water', priceDelta: 0 },
          { id: 'still-water', name: 'Ambient Filtered Spring Water', priceDelta: 0 },
        ],
      },
    ],
  },
  {
    id: 'black-sesame-rye-galette',
    name: 'Toasted Black Sesame, Buckwheat & Pear Bostock',
    category: 'bakery',
    categoryLabel: 'Sourdough Viennoiserie',
    originOrProcess: 'Stone-Milled Buckwheat · Hood River Bartlett Pear',
    elevationOrBatch: 'Naturally Gluten-Friendly Recipe',
    tastingNotes: 'Roasted Black Sesame · Almond Frangipane · Poached Pear',
    price: 6.75,
    unitLabel: 'Single Tartine (130g)',
    description:
      'Brioche-style buckwheat and almond flour crumb soaked in orange blossom syrup, layered with house-ground organic black sesame frangipane, and crowned with fanned Hood River pears and toasted sesame seeds.',
    image: cardamomKouignImg,
    dietaryTags: ['plant-based', 'gluten-free', 'organic'],
    availabilityNote: 'Limited Morning Batch',
    extractionSpec: {
      temp: '195°C Bake',
      ratio: '100% Buckwheat',
      time: '24h Soak',
    },
    customizationGroups: [
      {
        id: 'serving-temp',
        label: 'Serving Temperature',
        defaultOptionId: 'warm-crisp',
        options: [
          { id: 'warm-crisp', name: 'Toasted Warm at Edge (Recommended)', priceDelta: 0 },
          { id: 'room-temp', name: 'Ambient Room Temperature', priceDelta: 0 },
        ],
      },
    ],
  },
];

export const BREW_PRESETS: BrewMethodPreset[] = [
  {
    id: 'v60-02',
    name: 'Hario V60 02 Conical',
    defaultDoseGrams: 18,
    ratioMultiplier: 16.5,
    tempCelsius: 93,
    grindSetting: 'Medium-Fine',
    micronRange: '620 – 680 µm',
    totalTime: '02:50 – 03:05',
    pours: [
      {
        stage: '01. Osmotic Bloom',
        timeWindow: '00:00 – 00:45',
        waterPercentage: 0.2,
        instruction: 'Pour 3x coffee weight in gentle spiral; swirl brewer once to saturate dry pockets.',
      },
      {
        stage: '02. Primary Acidity Pulse',
        timeWindow: '00:45 – 01:25',
        waterPercentage: 0.4,
        instruction: 'Steady center-outward spiral at 6g/sec to lift bed and extract bright fruit aromatics.',
      },
      {
        stage: '03. Sweetness & Body Balance',
        timeWindow: '01:25 – 02:55',
        waterPercentage: 0.4,
        instruction: 'Low-agitation center pour to final target weight; finish with gentle Rao spin for flat bed.',
      },
    ],
  },
  {
    id: 'chemex-6',
    name: 'Chemex Bonded Carafe',
    defaultDoseGrams: 30,
    ratioMultiplier: 16.0,
    tempCelsius: 94,
    grindSetting: 'Medium-Coarse',
    micronRange: '780 – 850 µm',
    totalTime: '03:45 – 04:15',
    pours: [
      {
        stage: '01. Degassing Bloom',
        timeWindow: '00:00 – 00:50',
        waterPercentage: 0.18,
        instruction: 'Saturate grounds evenly and gently Excavate center with cupping spoon.',
      },
      {
        stage: '02. Main Extraction Column',
        timeWindow: '00:50 – 02:15',
        waterPercentage: 0.52,
        instruction: 'Pour in concentric circles keeping water level 2cm below rim; avoid pouring directly on glass wall.',
      },
      {
        stage: '03. Clarifying Drawdown',
        timeWindow: '02:15 – 04:00',
        waterPercentage: 0.30,
        instruction: 'Final center pour to wash high-molecular solids down through thick bonded paper filter.',
      },
    ],
  },
  {
    id: 'aeropress-inv',
    name: 'AeroPress Immersion',
    defaultDoseGrams: 15,
    ratioMultiplier: 15.0,
    tempCelsius: 91,
    grindSetting: 'Fine-Medium',
    micronRange: '520 – 580 µm',
    totalTime: '02:15',
    pours: [
      {
        stage: '01. Full Immersion Fill',
        timeWindow: '00:00 – 00:20',
        waterPercentage: 1.0,
        instruction: 'Add all water rapidly over fine-medium grounds; paddle back-and-forth 5 times.',
      },
      {
        stage: '02. Thermal Steep & Cap',
        timeWindow: '00:20 – 01:45',
        waterPercentage: 0,
        instruction: 'Attach rinsed paper filter cap, swirl gently at 01:30 to settle floating crust.',
      },
      {
        stage: '03. Steady Pneumatic Press',
        timeWindow: '01:45 – 02:15',
        waterPercentage: 0,
        instruction: 'Press with forearm weight over 30 seconds until hiss begins.',
      },
    ],
  },
  {
    id: 'espresso-modern',
    name: 'Modern Light-Roast Espresso',
    defaultDoseGrams: 19,
    ratioMultiplier: 2.25,
    tempCelsius: 93,
    grindSetting: 'Precision Espresso',
    micronRange: '260 – 295 µm',
    totalTime: '00:28 – 00:31',
    pours: [
      {
        stage: '01. Low-Pressure Pre-Infusion',
        timeWindow: '00:00 – 00:08',
        waterPercentage: 0.25,
        instruction: 'Saturate puck at 2.5 bar until first beads coalesce across bottomless portafilter basket.',
      },
      {
        stage: '02. Peak 8.5-Bar Extraction',
        timeWindow: '00:08 – 00:20',
        waterPercentage: 0.50,
        instruction: 'Ramp smoothly to 8.5 bar; extract dense tiger-striped heart and syrupy florals.',
      },
      {
        stage: '03. Declining Pressure Tail',
        timeWindow: '00:20 – 00:29',
        waterPercentage: 0.25,
        instruction: 'Taper pressure down to 5 bar as puck erodes to prevent astringency.',
      },
    ],
  },
];

export const CRAFT_CAPABILITIES = [
  {
    index: '01. Direct-Trade Farm Gate Transparency',
    title: 'Multi-Year Producer Contracts Above Specialty Benchmarks',
    description:
      'We bypass commodity brokers entirely, contracting directly with 14 family-owned estates in Ethiopia, Colombia, and Peru. Every lot includes a published farm-gate receipt verifying price paid per kilogram of parchment.',
    proofMetric: '3.4× Fair Trade Minimum Paid Across All 14 Partner Estates in 2025–2026 ($9.85/lb Average FOB)',
    testimonial: {
      quote:
        'Before partnering with Sorel Roastery in 2023, fluctuating C-market prices forced us to blend our high-elevation Pink Bourbon into regional bulk lots. Their guaranteed 3-year fixed floor price funded our anaerobic drying beds and raised our pickers’ daily wages by 42%.',
      author: 'Mateo Gaviria',
      role: 'Producer & Agronomist',
      organization: 'Finca La Claudina, Antioquia, Colombia',
    },
  },
  {
    index: '02. Loring S15 Falcon Convection Roasting',
    title: 'Closed-Loop Recirculating Thermal Precision & Remineralized Water',
    description:
      'Our smokeless Loring S15 roaster utilizes 100% convection heat transfer and real-time bean-probe telemetry, eliminating scorched tipping while reducing natural gas consumption by 80% compared to conventional cast-iron drum roasters.',
    proofMetric: '±0.2°C Batch-to-Batch RoR Consistency & 78% Lower Carbon Footprint Per Kilogram Roasted',
    testimonial: {
      quote:
        'Switching our espresso program to Sorel’s convection-roasted micro-lots eliminated the bitter roast defects we struggled to dial out. Our morning bar waste dropped from 14% to under 3%, and guest repeat orders rose by 31% in four months.',
      author: 'Julian Vance',
      role: 'Beverage Director',
      organization: 'Alder & Stone Hospitality Group, Portland',
    },
  },
  {
    index: '03. 36-Hour Cold-Fermented Sourdough Viennoiserie',
    title: 'Stone-Milled Pacific Northwest Grains & Cultured Normandy Butter',
    description:
      'Every croissant, kouign-amann, and bostock begins with freshly stone-milled Skagit Valley Red Fife wheat and our 12-year-old liquid levain. Cold fermentation at 4°C for 36 hours breaks down phytic acid and develops complex lactic aromatics.',
    proofMetric: '100% Naturally Leavened — Zero Commercial Instant Yeast Used Across 420 Daily Pastries',
    testimonial: {
      quote:
        'Extending our lamination fermentation to 36 hours transformed digestibility and honeycomb structure. We sell out of our morning cardamom kouign-amann batch by 10:30 AM six days a week.',
      author: 'Elena Rostova',
      role: 'Head Viennoiserie Baker & Partner',
      organization: 'Sorel Roastery & Bakery, NW Flanders',
    },
  },
];
