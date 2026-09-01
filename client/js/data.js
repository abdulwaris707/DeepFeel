/**
 * DeepFeel - Luxury Fragrance House Seed Data Layer
 * Contains 25+ meticulously crafted luxury perfumes, olfactory families, notes, and demo accounts.
 */

const SEED_CATEGORIES = [
  {
    id: "cat_signature",
    name: "Signature Collection",
    slug: "signature-collection",
    description: "Our most distinctive extrait de parfum creations, crafted to become an unforgettable personal aura.",
    image: "https://images.unsplash.com/photo-1594035910387-fea47794261f?auto=format&fit=crop&w=900&q=80",
    featured: true
  },
  {
    id: "cat_oud",
    name: "The Oud Collection",
    slug: "oud-collection",
    description: "Deep, resinous, and intoxicating blends celebrating wild Assamese and Cambodian agarwood.",
    image: "https://images.unsplash.com/photo-1547887537-6158d64c35b3?auto=format&fit=crop&w=900&q=80",
    featured: true
  },
  {
    id: "cat_men",
    name: "For Him",
    slug: "men",
    description: "Sophisticated woody, spicy, and smoky fragrances designed with refined modern masculinity.",
    image: "https://images.unsplash.com/photo-1523293182086-7651a899d37f?auto=format&fit=crop&w=900&q=80",
    featured: true
  },
  {
    id: "cat_women",
    name: "For Her",
    slug: "women",
    description: "Luminous florals, velvety ambers, and sensual gourmand elixirs of timeless elegance.",
    image: "https://images.unsplash.com/photo-1588405748880-12d1d2a59f75?auto=format&fit=crop&w=900&q=80",
    featured: true
  },
  {
    id: "cat_unisex",
    name: "Unisex Elixirs",
    slug: "unisex",
    description: "Gender-neutral olfactory masterpieces celebrating rare woods, raw incense, and sparkling citrus.",
    image: "https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?auto=format&fit=crop&w=900&q=80",
    featured: false
  },
  {
    id: "cat_gifts",
    name: "Gift & Discovery Sets",
    slug: "gift-sets",
    description: "Exquisite presentation coffrets and travel discovery atomizers for the connoisseur.",
    image: "https://images.unsplash.com/photo-1615655406736-b37c4fabf923?auto=format&fit=crop&w=900&q=80",
    featured: false
  }
];

const SEED_PRODUCTS = [
  {
    id: "df_noir",
    sku: "DF-PRF-01",
    name: "DeepFeel Noir Extrait",
    category: "Signature Collection",
    categorySlug: "signature-collection",
    gender: "Unisex",
    fragranceFamily: "Woody Amber",
    concentration: "Extrait de Parfum",
    price: 8800.00,
    originalPrice: 12300.00,
    discountPrice: 8800.00,
    stock: 35,
    lowStockThreshold: 8,
    rating: 4.9,
    reviewCount: 128,
    status: "active",
    featured: true,
    bestseller: true,
    isNew: false,
    exclusive: true,
    sizes: ["30ml", "50ml", "100ml"],
    selectedSize: "50ml",
    sizePricing: { "30ml": 6300.00, "50ml": 8800.00, "100ml": 12800.00 },
    longevity: "10–14 Hours",
    sillage: "Enveloping & Powerful",
    season: "Fall / Winter / Evening",
    occasion: "Black Tie, Intimate Soirées & Midnight Encounters",
    shortDescription: "An intoxicating blend of smoky birch tar, blackened leather, Damascus rose, and rare vintage ambergris.",
    description: "DeepFeel Noir is our crowning signature statement—a tribute to nocturnal mystery and enigmatic confidence. Opening with a flash of spiced saffron and bergamot peel, it descends into a velvety heart of midnight Turkish rose and smoked guaiac wood. The dry-down lingers indefinitely on silk and skin with dark leather and warm Golden Amber.",
    story: "Conceived during an autumn midnight walk through the ancient stone alleyways of Grasse. Noir captures the intoxicating transition when twilight gives way to pure darkness and embers crackle in the crisp air.",
    notes: {
      top: ["Italian Bergamot", "Black Saffron", "Pink Peppercorn"],
      heart: ["Turkish Rose Absolute", "Smoked Guaiacwood", "Cashmere Wood"],
      base: ["Aged Ambergris", "Tuscan Leather", "Bourbon Vanilla", "Patchouli Coeur"]
    },
    specs: {
      "Concentration": "Extrait de Parfum (30% Oil Concentration)",
      "Nose / Creator": "Maison DeepFeel Grasse Studio",
      "Origin": "Formulated in Grasse, France — Hand-bottled in Lahore & Islamabad",
      "Vessel": "Heavyweight European flacon with magnetic obsidian cap"
    },
    ingredients: "Alcohol Denat., Fragrance (Parfum), Benzyl Benzoate, Limonene, Linalool, Coumarin, Eugenol, Evernia Prunastri (Oakmoss) Extract, Alpha-Isomethyl Ionone, Citral.",
    images: [
      "https://images.unsplash.com/photo-1594035910387-fea47794261f?auto=format&fit=crop&w=900&q=80",
      "https://images.unsplash.com/photo-1547887537-6158d64c35b3?auto=format&fit=crop&w=900&q=80",
      "https://images.unsplash.com/photo-1523293182086-7651a899d37f?auto=format&fit=crop&w=900&q=80"
    ],
    tags: ["leather", "amber", "rose", "night", "luxury", "unisex", "noir", "deep & smoky"]
  },
  {
    id: "df_oud_royale",
    sku: "DF-OUD-02",
    name: "DeepFeel Oud Royale",
    category: "The Oud Collection",
    categorySlug: "oud-collection",
    gender: "Unisex",
    fragranceFamily: "Oriental",
    concentration: "Extrait de Parfum",
    price: 11000.00,
    originalPrice: 14900.00,
    discountPrice: 11000.00,
    stock: 22,
    lowStockThreshold: 5,
    rating: 5.0,
    reviewCount: 94,
    status: "active",
    featured: true,
    bestseller: true,
    isNew: false,
    exclusive: true,
    sizes: ["50ml", "100ml"],
    selectedSize: "50ml",
    sizePricing: { "50ml": 11000.00, "100ml": 16200.00 },
    longevity: "12–16 Hours",
    sillage: "Majestic & Unmistakable",
    season: "Autumn / Winter",
    occasion: "Formal Galas, Executive Presence & Special Occasions",
    shortDescription: "Naturally aged wild Assam agarwood crowned with Taif rose, cardamom pod, and dark honeyed resins.",
    description: "An aristocratic masterpiece built around authentic, sustainably aged Assam agarwood (Oud). Unlike synthetic approximations, Oud Royale unfolds with smooth, creamy woodiness, devoid of harsh medicinal edges. Enriched with golden frankincense, myrrh, and rare tonka bean.",
    story: "Crafted from wild agarwood trees aged over thirty years. Each flacon of Oud Royale matures in dark temperature-controlled cellars for six months before release.",
    notes: {
      top: ["Wild Cardamom", "Golden Honey", "Coriander Seed"],
      heart: ["Taif Rose", "Aged Cambodian Agarwood", "Nutmeg"],
      base: ["Assam Oud", "Frankincense", "Sandalwood", "Labdanum"]
    },
    specs: {
      "Concentration": "Extrait de Parfum (32% Pure Parfum)",
      "Agarwood Source": "Certified Ethical Assam & Trat Wild Orchards",
      "Vessel": "Gold-leaf silk-screened amber glass flacon"
    },
    ingredients: "Alcohol Denat., Fragrance (Parfum / Aquilaria Agallocha Oil), Citronellol, Geraniol, Cinnamal, Benzyl Alcohol, Farnesol.",
    images: [
      "https://images.unsplash.com/photo-1547887537-6158d64c35b3?auto=format&fit=crop&w=900&q=80",
      "https://images.unsplash.com/photo-1594035910387-fea47794261f?auto=format&fit=crop&w=900&q=80"
    ],
    tags: ["oud", "agarwood", "frankincense", "oriental", "honey", "rare", "deep & smoky", "woody"]
  },
  {
    id: "df_elan",
    sku: "DF-FEM-03",
    name: "DeepFeel Élan L'Absolu",
    category: "For Her",
    categorySlug: "women",
    gender: "Women",
    fragranceFamily: "Floral",
    concentration: "Eau de Parfum",
    price: 7400.00,
    originalPrice: 10100.00,
    discountPrice: 7400.00,
    stock: 45,
    lowStockThreshold: 10,
    rating: 4.9,
    reviewCount: 112,
    status: "active",
    featured: true,
    bestseller: true,
    isNew: false,
    exclusive: false,
    sizes: ["30ml", "50ml", "100ml"],
    selectedSize: "50ml",
    sizePricing: { "30ml": 5200.00, "50ml": 7400.00, "100ml": 10800.00 },
    longevity: "8–10 Hours",
    sillage: "Graceful & Radiant",
    season: "All Seasons / Signature Daily",
    occasion: "Daytime Elegance, High Tea & Romantic Dinners",
    shortDescription: "Grasse Jasmine Grandiflorum and Orange Blossom infused with sparkling pear and velvety white musk.",
    description: "Élan is the personification of fluid grace and radiant sensuality. Crisp champagne pear and neroli petals open into an opulent bouquet of dawn-harvested Grasse jasmine. Settles into a skin-caressing blanket of silky Madagascar vanilla and white cedar.",
    story: "Inspired by the effortless French art de vivre—the quiet power of a woman who enters a room without demanding attention, yet owns it entirely.",
    notes: {
      top: ["White Pear", "Italian Neroli", "Mandarin Zest"],
      heart: ["Grasse Jasmine Grandiflorum", "Orange Blossom", "May Rose"],
      base: ["Bourbon Vanilla Orchid", "White Cedarwood", "Silk Musk"]
    },
    specs: {
      "Concentration": "Eau de Parfum (22% Concentration)",
      "Harvest": "First-Dawn Handpicked Grasse Jasmine",
      "Vessel": "Faceted crystalline bottle with brushed champagne gold collar"
    },
    ingredients: "Alcohol Denat., Parfum (Fragrance), Aqua, Benzyl Salicylate, Hydroxycitronellal, Limonene, Linalool, Geraniol, Citronellol.",
    images: [
      "https://images.unsplash.com/photo-1588405748880-12d1d2a59f75?auto=format&fit=crop&w=900&q=80",
      "https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?auto=format&fit=crop&w=900&q=80"
    ],
    tags: ["jasmine", "floral", "vanilla", "pear", "grace", "women", "sweet", "fresh"]
  },
  {
    id: "df_santal_reserve",
    sku: "DF-HOM-04",
    name: "DeepFeel Santal Reserve",
    category: "For Him",
    categorySlug: "men",
    gender: "Men",
    fragranceFamily: "Woody",
    concentration: "Eau de Parfum",
    price: 7900.00,
    originalPrice: 9300.00,
    discountPrice: 7900.00,
    stock: 40,
    lowStockThreshold: 10,
    rating: 4.8,
    reviewCount: 86,
    status: "active",
    featured: true,
    bestseller: false,
    isNew: true,
    exclusive: false,
    sizes: ["30ml", "50ml", "100ml"],
    selectedSize: "50ml",
    sizePricing: { "30ml": 5400.00, "50ml": 7900.00, "100ml": 11500.00 },
    longevity: "9–11 Hours",
    sillage: "Magnetic & Refined",
    season: "Fall / Spring / All-Year",
    occasion: "Executive Boardrooms, Smart Casual & Travel",
    shortDescription: "Creamy Australian Mysore sandalwood, cracked cardamom, Florentine iris, and smoky cedar embers.",
    description: "Santal Reserve delivers the quintessential modern masculine profile—warm, cerebral, and grounded. It leads with crushed violet leaf and cardamom before unleashing a rich, buttery heart of aged sandalwood and iris root. Dry cedar and papyrus give it a crisp tailored finish.",
    story: "Crafted for the modern gentleman whose presence is defined by calm composure rather than volume. A scent tailored like a bespoke cashmere jacket.",
    notes: {
      top: ["Green Cardamom", "Violet Leaf", "Australian Cypress"],
      heart: ["Florentine Iris (Orris)", "Papyrus", "Cedarwood"],
      base: ["Mysore Sandalwood", "Ambroxan", "Warm Amber", "Leather Accord"]
    },
    specs: {
      "Concentration": "Eau de Parfum (24% Concentration)",
      "Wood Origin": "Sustainably Farmed Australian Sandalwood",
      "Vessel": "Heavy smoke-tinted glass with hand-turned walnut collar"
    },
    ingredients: "Alcohol Denat., Parfum (Fragrance), Aqua, Limonene, Alpha-Isomethyl Ionone, Isoeugenol, Farnesol.",
    images: [
      "https://images.unsplash.com/photo-1523293182086-7651a899d37f?auto=format&fit=crop&w=900&q=80",
      "https://images.unsplash.com/photo-1594035910387-fea47794261f?auto=format&fit=crop&w=900&q=80"
    ],
    tags: ["sandalwood", "iris", "cardamom", "cedar", "men", "woody", "spicy"]
  },
  {
    id: "df_velvet_amber",
    sku: "DF-UNI-05",
    name: "DeepFeel Velvet Amber",
    category: "Signature Collection",
    categorySlug: "signature-collection",
    gender: "Unisex",
    fragranceFamily: "Amber",
    concentration: "Eau de Parfum",
    price: 8100.00,
    originalPrice: 11200.00,
    discountPrice: 8100.00,
    stock: 28,
    lowStockThreshold: 6,
    rating: 4.9,
    reviewCount: 97,
    status: "active",
    featured: true,
    bestseller: true,
    isNew: false,
    exclusive: true,
    sizes: ["50ml", "100ml"],
    selectedSize: "50ml",
    sizePricing: { "50ml": 8100.00, "100ml": 11900.00 },
    longevity: "10–12 Hours",
    sillage: "Warm & Cozy",
    season: "Autumn / Winter",
    occasion: "Intimate Evenings, Fireside Conversations & Luxury Lounging",
    shortDescription: "Golden Baltic amber crystals melted with creamy tonka bean, Madagascar vanilla, and benzoin tears.",
    description: "Like wrapping yourself in pure cashmere beside a glowing hearth. Velvet Amber is decadent without being cloying. Sweet resins of labdanum and benzoin create a luscious balsamic aura that deepens as body heat activates the perfume oils.",
    story: "Inspired by the amber light of the golden hour reflected across silk velvet drapery.",
    notes: {
      top: ["Spanish Labdanum", "Bitter Almond", "Bergamot"],
      heart: ["Benzoin Siam", "Cinnamon Bark", "Tonka Bean"],
      base: ["Baltic Amber", "Madagascar Vanilla Bean", "Indonesian Patchouli"]
    },
    specs: {
      "Concentration": "Eau de Parfum (25% Concentration)",
      "Resin Source": "Hand-tapped Siam Benzoin and wild Spanish Cistus",
      "Vessel": "Amber-tinted flacon with gilded atomizer"
    },
    ingredients: "Alcohol Denat., Fragrance (Parfum), Coumarin, Cinnamyl Alcohol, Linalool, Eugenol, Benzyl Cinnamate.",
    images: [
      "https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?auto=format&fit=crop&w=900&q=80",
      "https://images.unsplash.com/photo-1588405748880-12d1d2a59f75?auto=format&fit=crop&w=900&q=80"
    ],
    tags: ["amber", "vanilla", "tonka", "warm", "unisex", "velvet", "sweet"]
  },
  {
    id: "df_vetiver_imperiale",
    sku: "DF-HOM-06",
    name: "DeepFeel Vétiver Impériale",
    category: "For Him",
    categorySlug: "men",
    gender: "Men",
    fragranceFamily: "Fresh",
    concentration: "Eau de Parfum",
    price: 7000.00,
    originalPrice: 8300.00,
    discountPrice: 7000.00,
    stock: 50,
    lowStockThreshold: 12,
    rating: 4.8,
    reviewCount: 65,
    status: "active",
    featured: false,
    bestseller: false,
    isNew: true,
    exclusive: false,
    sizes: ["50ml", "100ml"],
    selectedSize: "50ml",
    sizePricing: { "50ml": 7000.00, "100ml": 10100.00 },
    longevity: "8–10 Hours",
    sillage: "Crisp & Clean",
    season: "Spring / Summer / Daytime",
    occasion: "Office, Daily Sartorial & Summer Escapes",
    shortDescription: "Earthy Haitian vetiver root sharpened with sparkling grapefruit, pink peppercorn, and mineral cedar.",
    description: "An invigorating study in green, earthy contrast. Vétiver Impériale pairs the mineral crispness of bitter pink grapefruit with the aristocratic depth of organic Haitian vetiver. Fresh, ultra-clean, and commanding.",
    story: "Distilled from deep root fibers harvested from the volcanic mountain soils of Les Cayes, Haiti.",
    notes: {
      top: ["Ruby Red Grapefruit", "Calabrian Bergamot", "Pink Peppercorn"],
      heart: ["Geranium Leaf", "Vetiver Heart", "Nutmeg"],
      base: ["Haitian Vetiver Roots", "Atlas Cedarwood", "Clean Ambergris"]
    },
    specs: {
      "Concentration": "Eau de Parfum (20% Concentration)",
      "Distillation": "Molecularly fractionalized pure vetiverol",
      "Vessel": "Emerald-clear flacon with polished silver accents"
    },
    ingredients: "Alcohol Denat., Parfum (Fragrance), Limonene, Citronellol, Hydroxycitronellal, Citral.",
    images: [
      "https://images.unsplash.com/photo-1523293182086-7651a899d37f?auto=format&fit=crop&w=900&q=80",
      "https://images.unsplash.com/photo-1594035910387-fea47794261f?auto=format&fit=crop&w=900&q=80"
    ],
    tags: ["vetiver", "fresh", "grapefruit", "citrus", "men", "clean", "spicy"]
  },
  {
    id: "df_bloom_absolu",
    sku: "DF-FEM-07",
    name: "DeepFeel Bloom Absolu",
    category: "For Her",
    categorySlug: "women",
    gender: "Women",
    fragranceFamily: "Floral",
    concentration: "Eau de Parfum",
    price: 7200.00,
    originalPrice: 9800.00,
    discountPrice: 7200.00,
    stock: 38,
    lowStockThreshold: 10,
    rating: 4.9,
    reviewCount: 78,
    status: "active",
    featured: false,
    bestseller: true,
    isNew: false,
    exclusive: false,
    sizes: ["30ml", "50ml", "100ml"],
    selectedSize: "50ml",
    sizePricing: { "30ml": 5000.00, "50ml": 7200.00, "100ml": 10600.00 },
    longevity: "8–9 Hours",
    sillage: "Beguiling & Romantic",
    season: "Spring / Summer",
    occasion: "Weddings, Garden Galas & Sunset Dates",
    shortDescription: "Tuberose petals bathed in morning dew, Sambac jasmine, peony, and creamy white peach.",
    description: "An explosion of freshly unfurled white blossoms. Bloom Absolu captures tuberose at its most ethereal and creamy—devoid of indolic heaviness. Supported by velvet peony, white peach skin, and soft cedar.",
    story: "A fragrant love letter to midnight blooming gardenias and tuberoses along the French Riviera.",
    notes: {
      top: ["White Peach Nectar", "Morning Dew Accord", "Green Mandarin"],
      heart: ["Indian Tuberose Absolute", "Sambac Jasmine", "Pink Peony"],
      base: ["Creamy Sandalwood", "White Musk", "Solar Cedar"]
    },
    specs: {
      "Concentration": "Eau de Parfum (22% Concentration)",
      "Floral Absolute": "100% Solvent-extracted Indian Tuberose",
      "Vessel": "Blush-tinted glass with magnetic pearl cap"
    },
    ingredients: "Alcohol Denat., Parfum (Fragrance), Benzyl Salicylate, Hexyl Cinnamal, Linalool, Hydroxycitronellal.",
    images: [
      "https://images.unsplash.com/photo-1588405748880-12d1d2a59f75?auto=format&fit=crop&w=900&q=80",
      "https://images.unsplash.com/photo-1615655406736-b37c4fabf923?auto=format&fit=crop&w=900&q=80"
    ],
    tags: ["tuberose", "floral", "peony", "peach", "women", "romantic", "sweet"]
  },
  {
    id: "df_midnight_tabac",
    sku: "DF-UNI-08",
    name: "DeepFeel Midnight Tabac",
    category: "Signature Collection",
    categorySlug: "signature-collection",
    gender: "Unisex",
    fragranceFamily: "Gourmand",
    concentration: "Extrait de Parfum",
    price: 9500.00,
    originalPrice: 13000.00,
    discountPrice: 9500.00,
    stock: 24,
    lowStockThreshold: 6,
    rating: 5.0,
    reviewCount: 89,
    status: "active",
    featured: true,
    bestseller: true,
    isNew: false,
    exclusive: true,
    sizes: ["50ml", "100ml"],
    selectedSize: "50ml",
    sizePricing: { "50ml": 9500.00, "100ml": 14000.00 },
    longevity: "12–15 Hours",
    sillage: "Intense & Addictive",
    season: "Late Autumn / Winter",
    occasion: "Speakeasies, Winter Galas & Late Night Conversations",
    shortDescription: "Sweet cured Cuban tobacco leaf infused with dark molasses rum, roasted cacao, and smoked plum.",
    description: "Dark, sultry, and unapologetically decadent. Midnight Tabac opens with rich spiced rum and dried black plum before unfolding into dry, honey-cured tobacco leaf and roasted Venezuelan cacao. A masterpiece of warmth and seduction.",
    story: "Crafted to embody the ambiance of private gentleman's libraries in London: worn leather chesterfields, crystal decanters of aged cognac, and fine cigar leaves.",
    notes: {
      top: ["Aged Dark Rum", "Spiced Plum", "Coriander"],
      heart: ["Cuban Tobacco Leaf", "Roasted Cacao", "Smoked Tonka"],
      base: ["Bourbon Vanilla", "Leather", "Oakwood", "Dark Honey"]
    },
    specs: {
      "Concentration": "Extrait de Parfum (28% Concentration)",
      "Tobacco Extract": "Natural Nicotiana Tabacum leaf extraction",
      "Vessel": "Matte midnight black flacon with gold hot-stamping"
    },
    ingredients: "Alcohol Denat., Fragrance (Parfum), Coumarin, Eugenol, Linalool, Cinnamal, Benzyl Benzoate.",
    images: [
      "https://images.unsplash.com/photo-1594035910387-fea47794261f?auto=format&fit=crop&w=900&q=80",
      "https://images.unsplash.com/photo-1547887537-6158d64c35b3?auto=format&fit=crop&w=900&q=80"
    ],
    tags: ["tobacco", "rum", "cacao", "vanilla", "gourmand", "unisex", "deep & smoky", "sweet"]
  },
  {
    id: "df_citrus_solaris",
    sku: "DF-UNI-09",
    name: "DeepFeel Citrus Solaris",
    category: "Unisex Elixirs",
    categorySlug: "unisex",
    gender: "Unisex",
    fragranceFamily: "Citrus",
    concentration: "Eau de Parfum",
    price: 6500.00,
    originalPrice: 9100.00,
    discountPrice: 6500.00,
    stock: 42,
    lowStockThreshold: 10,
    rating: 4.8,
    reviewCount: 52,
    status: "active",
    featured: false,
    bestseller: false,
    isNew: true,
    exclusive: false,
    sizes: ["50ml", "100ml"],
    selectedSize: "50ml",
    sizePricing: { "50ml": 6500.00, "100ml": 9700.00 },
    longevity: "7–8 Hours",
    sillage: "Effervescent & Uplifting",
    season: "Spring / Summer",
    occasion: "Weekend Brunch, Coastal Travel & Sunny Mornings",
    shortDescription: "Sun-drenched Amalfi lemon, blood orange, sea salt mist, and coastal Mediterranean cypress.",
    description: "Sunlight captured inside a bottle. Citrus Solaris sparkles with cold-pressed Italian citrus oils, bitter orange petitgrain, and a crisp oceanic breeze accord that feels like stepping onto a terrace overlooking the Tyrrhenian Sea.",
    story: "Created to bottle the exact sensation of sea salt on sun-warmed skin beneath fragrant lemon groves.",
    notes: {
      top: ["Amalfi Lemon", "Sicilian Blood Orange", "Sea Salt Mist"],
      heart: ["Neroli Petals", "Petitgrain", "Crushed Mint"],
      base: ["Coastal Cypress", "White Amber", "Solar Driftwood"]
    },
    specs: {
      "Concentration": "Eau de Parfum (18% Concentration)",
      "Citrus Oils": "First cold-pressing Calabrian harvest",
      "Vessel": "Solar yellow crystal flacon"
    },
    ingredients: "Alcohol Denat., Fragrance (Parfum), Limonene, Linalool, Citral, Geraniol.",
    images: [
      "https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?auto=format&fit=crop&w=900&q=80",
      "https://images.unsplash.com/photo-1588405748880-12d1d2a59f75?auto=format&fit=crop&w=900&q=80"
    ],
    tags: ["citrus", "lemon", "summer", "fresh", "unisex", "neroli"]
  },
  {
    id: "df_oud_fumee",
    sku: "DF-OUD-10",
    name: "DeepFeel Oud Fumée",
    category: "The Oud Collection",
    categorySlug: "oud-collection",
    gender: "Unisex",
    fragranceFamily: "Woody",
    concentration: "Extrait de Parfum",
    price: 10600.00,
    originalPrice: 14400.00,
    discountPrice: 10600.00,
    stock: 18,
    lowStockThreshold: 5,
    rating: 4.9,
    reviewCount: 71,
    status: "active",
    featured: false,
    bestseller: true,
    isNew: false,
    exclusive: true,
    sizes: ["50ml", "100ml"],
    selectedSize: "50ml",
    sizePricing: { "50ml": 10600.00, "100ml": 15300.00 },
    longevity: "12–16 Hours",
    sillage: "Mysterious & Heavy",
    season: "Winter / Evening",
    occasion: "Exclusive Events & Avant-Garde Statements",
    shortDescription: "Incense smoke curling through dark oud chips, Cade wood, black birch, and aged labdanum.",
    description: "Deep, dry, and primal. Oud Fumée celebrates ancient incense rituals. Burning wood resins mingle with dry Himalayan birch tar and deep smoked Cambodian oud to create an ethereal scent cloud that commands reverence.",
    story: "Inspired by ancient Kōdō Japanese incense burning rituals blended with Arabian bakhoor traditions.",
    notes: {
      top: ["Silver Frankincense", "Black Birch Smoke", "Juniper Berry"],
      heart: ["Smoked Cambodian Oud", "Cade Wood", "Papyrus"],
      base: ["Dark Labdanum", "Smoky Vetiver", "Castoreum Accord"]
    },
    specs: {
      "Concentration": "Extrait de Parfum (30% Concentration)",
      "Smoked Resins": "High-altitude Omani Hojari Frankincense",
      "Vessel": "Blackened basalt flacon with hand-engraved badge"
    },
    ingredients: "Alcohol Denat., Fragrance (Parfum), Evernia Furfuracea Extract, Benzyl Benzoate, Linalool.",
    images: [
      "https://images.unsplash.com/photo-1547887537-6158d64c35b3?auto=format&fit=crop&w=900&q=80",
      "https://images.unsplash.com/photo-1594035910387-fea47794261f?auto=format&fit=crop&w=900&q=80"
    ],
    tags: ["oud", "smoke", "incense", "dark", "mysterious", "wood", "deep & smoky"]
  },
  {
    id: "df_musc_imperiale",
    sku: "DF-UNI-11",
    name: "DeepFeel Musc Impériale",
    category: "Unisex Elixirs",
    categorySlug: "unisex",
    gender: "Unisex",
    fragranceFamily: "Musky",
    concentration: "Eau de Parfum",
    price: 7400.00,
    originalPrice: 8700.00,
    discountPrice: 7400.00,
    stock: 36,
    lowStockThreshold: 8,
    rating: 4.8,
    reviewCount: 63,
    status: "active",
    featured: false,
    bestseller: false,
    isNew: false,
    exclusive: false,
    sizes: ["50ml", "100ml"],
    selectedSize: "50ml",
    sizePricing: { "50ml": 7400.00, "100ml": 11000.00 },
    longevity: "9–11 Hours",
    sillage: "Second-Skin Intimate",
    season: "All Seasons / Everyday Signature",
    occasion: "Everyday Intimacy, Clean Tailoring & Modern Romance",
    shortDescription: "An alluring second-skin musk laced with white iris, ambrette seed, clean aldehydes, and blond cedar.",
    description: "The ultimate skin scent. Musc Impériale smells clean, sensual, and intoxicatingly personal. It adapts to the wearer's body chemistry, creating a unique magnetic aura that draws people closer.",
    story: "Formulated to recreate the scent of freshly laundered Egyptian cotton warmed by morning sunlight on bare skin.",
    notes: {
      top: ["Clean Aldehydes", "Ambrette Seed", "White Freesia"],
      heart: ["Florentine Iris", "Cotton Flower", "Heliotrope"],
      base: ["Velvet White Musk", "Cashmeran", "Blond Cedar"]
    },
    specs: {
      "Concentration": "Eau de Parfum (22% Concentration)",
      "Musk Blend": "Hypoallergenic vegan macrocyclic musk suite",
      "Vessel": "Frosted milk-glass flacon"
    },
    ingredients: "Alcohol Denat., Fragrance (Parfum), Alpha-Isomethyl Ionone, Hydroxycitronellal, Coumarin.",
    images: [
      "https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?auto=format&fit=crop&w=900&q=80",
      "https://images.unsplash.com/photo-1588405748880-12d1d2a59f75?auto=format&fit=crop&w=900&q=80"
    ],
    tags: ["musk", "clean", "iris", "skin", "sensual", "unisex", "fresh"]
  },
  {
    id: "df_discovery_set",
    sku: "DF-GFT-12",
    name: "The Maison Discovery Set (5 x 10ml)",
    category: "Gift & Discovery Sets",
    categorySlug: "gift-sets",
    gender: "Unisex",
    fragranceFamily: "Oriental",
    concentration: "Eau de Parfum / Extrait",
    price: 4300.00,
    originalPrice: 6400.00,
    discountPrice: 4300.00,
    stock: 65,
    lowStockThreshold: 15,
    rating: 5.0,
    reviewCount: 145,
    status: "active",
    featured: true,
    bestseller: true,
    isNew: true,
    exclusive: false,
    sizes: ["5 x 10ml"],
    selectedSize: "5 x 10ml",
    sizePricing: { "5 x 10ml": 4300.00 },
    longevity: "Varies by Fragrance (8–14h)",
    sillage: "Moderate to Powerful",
    season: "All Seasons",
    occasion: "Gifting, Sampling & Travel",
    shortDescription: "Five iconic 10ml atomizers: Noir, Oud Royale, Élan, Santal Reserve, and Velvet Amber. Includes $95 full-size voucher.",
    description: "Explore the olfactory universe of DeepFeel. Presented in a rigid debossed presentation box with magnetic enclosure. Includes five travel-ready 10ml spray atomizers and a $95 voucher redeemable toward any full 50ml or 100ml flacon.",
    story: "Designed for the curious nose to test how our complex extraits evolve across 12 hours of skin wear.",
    notes: {
      top: ["Noir (Woody Amber)", "Oud Royale (Oriental)"],
      heart: ["Élan (Floral Grace)", "Santal Reserve (Creamy Wood)"],
      base: ["Velvet Amber (Resinous Warmth)"]
    },
    specs: {
      "Set Includes": "5 x 10ml Refillable Glass Atomizers + $95 Gift Card",
      "Packaging": "FSC-certified rigid linen coffret with gold ribbon",
      "Travel Friendly": "100% TSA carry-on approved"
    },
    ingredients: "Refer to individual vial packaging for specific allergens.",
    images: [
      "https://images.unsplash.com/photo-1615655406736-b37c4fabf923?auto=format&fit=crop&w=900&q=80",
      "https://images.unsplash.com/photo-1594035910387-fea47794261f?auto=format&fit=crop&w=900&q=80"
    ],
    tags: ["gift", "discovery", "sampler", "travel", "set", "voucher"]
  },
  {
    id: "df_etoile_nocturne",
    sku: "DF-FEM-13",
    name: "DeepFeel Étoile Nocturne",
    category: "For Her",
    categorySlug: "women",
    gender: "Women",
    fragranceFamily: "Gourmand",
    concentration: "Extrait de Parfum",
    price: 9200.00,
    originalPrice: 12500.00,
    discountPrice: 9200.00,
    stock: 26,
    lowStockThreshold: 7,
    rating: 4.9,
    reviewCount: 54,
    status: "active",
    featured: false,
    bestseller: false,
    isNew: true,
    exclusive: true,
    sizes: ["50ml", "100ml"],
    selectedSize: "50ml",
    sizePricing: { "50ml": 9200.00, "100ml": 13300.00 },
    longevity: "11–13 Hours",
    sillage: "Hypnotic & Seductive",
    season: "Fall / Winter / Evening",
    occasion: "Black Tie Galas, Opera Nights & Champagne Dinners",
    shortDescription: "Dark black cherry liqueur, velvety Turkish rose, roasted almond, and golden amber resins.",
    description: "A dark, gourmand-floral temptation. Étoile Nocturne marries succulent dark cherry dripping in French cognac with midnight Damask roses, tonka bean, and molten Peru balsam. Decadent, glamorous, and unforgettable.",
    story: "Inspired by a private box at the Palais Garnier during a winter opera premiere.",
    notes: {
      top: ["Black Cherry Liqueur", "Bitter Almond", "Cognac Accord"],
      heart: ["Damascus Rose Absolute", "Night Plum", "Jasmine Sambac"],
      base: ["Peru Balsam", "Tonka Bean", "Sandalwood", "Warm Ambergris"]
    },
    specs: {
      "Concentration": "Extrait de Parfum (28% Concentration)",
      "Origin": "Formulated in Grasse",
      "Vessel": "Ruby-black gradient flacon with gold crest"
    },
    ingredients: "Alcohol Denat., Parfum (Fragrance), Coumarin, Anise Alcohol, Benzyl Cinnamate, Eugenol.",
    images: [
      "https://images.unsplash.com/photo-1588405748880-12d1d2a59f75?auto=format&fit=crop&w=900&q=80",
      "https://images.unsplash.com/photo-1594035910387-fea47794261f?auto=format&fit=crop&w=900&q=80"
    ],
    tags: ["cherry", "rose", "gourmand", "cognac", "women", "night", "sweet"]
  },
  {
    id: "df_cuir_imperial",
    sku: "DF-HOM-14",
    name: "DeepFeel Cuir Impérial",
    category: "For Him",
    categorySlug: "men",
    gender: "Men",
    fragranceFamily: "Woody",
    concentration: "Eau de Parfum",
    price: 8300.00,
    originalPrice: 11200.00,
    discountPrice: 8300.00,
    stock: 30,
    lowStockThreshold: 8,
    rating: 4.8,
    reviewCount: 68,
    status: "active",
    featured: false,
    bestseller: true,
    isNew: false,
    exclusive: false,
    sizes: ["50ml", "100ml"],
    selectedSize: "50ml",
    sizePricing: { "50ml": 8300.00, "100ml": 12200.00 },
    longevity: "10–12 Hours",
    sillage: "Commanding & Rich",
    season: "Autumn / Winter",
    occasion: "Evening Soirées, Executive Gatherings & Autumn Drives",
    shortDescription: "Tuscan saddle leather, crushed juniper berries, smoky birch, and golden saffron threads.",
    description: "An authentic tribute to artisanal saddle leather. Opening with aromatic green juniper and golden saffron, Cuir Impérial settles into a deep, luxurious leather heart supported by dark vetiver and warm oakmoss.",
    story: "Born in a heritage leather tannery in Tuscany, where the scent of aged hides and natural vegetable tannins perfumes the air.",
    notes: {
      top: ["Wild Juniper", "Saffron Threads", "Black Thyme"],
      heart: ["Tuscan Leather", "Smoked Mate Tea", "Violet Leaf"],
      base: ["Birch Tar", "Haitian Vetiver", "Oakmoss", "Amber"]
    },
    specs: {
      "Concentration": "Eau de Parfum (24% Concentration)",
      "Vessel": "Charcoal glass with saddle-stitched leather badge"
    },
    ingredients: "Alcohol Denat., Fragrance (Parfum), Limonene, Linalool, Evernia Prunastri Extract.",
    images: [
      "https://images.unsplash.com/photo-1523293182086-7651a899d37f?auto=format&fit=crop&w=900&q=80",
      "https://images.unsplash.com/photo-1547887537-6158d64c35b3?auto=format&fit=crop&w=900&q=80"
    ],
    tags: ["leather", "juniper", "saffron", "men", "woody", "smoky", "deep & smoky"]
  },
  {
    id: "df_oud_rose_prestige",
    sku: "DF-OUD-15",
    name: "DeepFeel Oud Rose Prestige",
    category: "The Oud Collection",
    categorySlug: "oud-collection",
    gender: "Unisex",
    fragranceFamily: "Floral",
    concentration: "Extrait de Parfum",
    price: 11300.00,
    originalPrice: 15500.00,
    discountPrice: 11300.00,
    stock: 19,
    lowStockThreshold: 5,
    rating: 5.0,
    reviewCount: 76,
    status: "active",
    featured: true,
    bestseller: false,
    isNew: true,
    exclusive: true,
    sizes: ["50ml", "100ml"],
    selectedSize: "50ml",
    sizePricing: { "50ml": 11300.00, "100ml": 16900.00 },
    longevity: "14–18 Hours",
    sillage: "Extravagant & Regal",
    season: "All Seasons / Evening",
    occasion: "Weddings, Gala Receptions & Royal Celebrations",
    shortDescription: "Hundred-petal Centifolia rose blended with vintage Trat agarwood, raspberry nectar, and white musk.",
    description: "The timeless union of Rose and Oud perfected. Our perfumers selected May Rose from Grasse and paired it with sweet Trat agarwood and wild raspberry notes to create a harmonious blend without sharp medicinal notes.",
    story: "Inspired by royal Persian gardens where damask rose hedges wrap around ancient agarwood pavilions.",
    notes: {
      top: ["Wild Raspberry", "Spiced Cardamom", "Pink Pepper"],
      heart: ["Grasse Centifolia Rose", "Damask Rose Absolute", "Saffron"],
      base: ["Vintage Trat Oud", "White Amber", "Cashmere Musk", "Patchouli"]
    },
    specs: {
      "Concentration": "Extrait de Parfum (33% Pure Perfume)",
      "Rose Source": "Organically cultivated Grasse May Rose",
      "Vessel": "Gilded flacon with engraved crest"
    },
    ingredients: "Alcohol Denat., Fragrance (Parfum), Citronellol, Geraniol, Eugenol, Benzyl Benzoate.",
    images: [
      "https://images.unsplash.com/photo-1547887537-6158d64c35b3?auto=format&fit=crop&w=900&q=80",
      "https://images.unsplash.com/photo-1588405748880-12d1d2a59f75?auto=format&fit=crop&w=900&q=80"
    ],
    tags: ["oud", "rose", "raspberry", "prestige", "royal", "unisex", "floral", "sweet"]
  },
  {
    id: "df_iris_imperiale",
    sku: "DF-UNI-16",
    name: "DeepFeel Iris Impériale",
    category: "Signature Collection",
    categorySlug: "signature-collection",
    gender: "Unisex",
    fragranceFamily: "Floral",
    concentration: "Extrait de Parfum",
    price: 9900.00,
    originalPrice: 13800.00,
    discountPrice: 9900.00,
    stock: 20,
    lowStockThreshold: 5,
    rating: 4.9,
    reviewCount: 43,
    status: "active",
    featured: false,
    bestseller: false,
    isNew: true,
    exclusive: true,
    sizes: ["50ml", "100ml"],
    selectedSize: "50ml",
    sizePricing: { "50ml": 9900.00, "100ml": 14600.00 },
    longevity: "10–12 Hours",
    sillage: "Silken & Aristocratic",
    season: "Spring / Autumn",
    occasion: "Fine Art Galas, Private Dinners & Cultural Salons",
    shortDescription: "Aged Florentine orris butter, violet blossom, soft suede, and white amber crystals.",
    description: "Known in perfumery as 'blue gold', Florentine Iris takes six years of slow underground curing to produce its buttery, powdery richness. Balanced with tender violet petals and clean suede.",
    story: "Celebrates the historical fragrance traditions of the Medici court in Florence.",
    notes: {
      top: ["Italian Bergamot", "Angelica Seed", "Carrot Seed"],
      heart: ["Florentine Orris Butter", "Violet Flower", "Heliotrope"],
      base: ["Suede Accord", "White Cedar", "Ambrette", "Benzoin"]
    },
    specs: {
      "Concentration": "Extrait de Parfum (28% Concentration)",
      "Orris Grade": "Aged 6-Year Iris Pallida Rhizome Butter",
      "Vessel": "Violet-smoke flacon with magnetic closure"
    },
    ingredients: "Alcohol Denat., Parfum (Fragrance), Alpha-Isomethyl Ionone, Linalool, Benzyl Alcohol.",
    images: [
      "https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?auto=format&fit=crop&w=900&q=80",
      "https://images.unsplash.com/photo-1594035910387-fea47794261f?auto=format&fit=crop&w=900&q=80"
    ],
    tags: ["iris", "orris", "violet", "suede", "luxury", "unisex", "floral"]
  },
  {
    id: "df_vanille_noire",
    sku: "DF-UNI-17",
    name: "DeepFeel Vanille Noire",
    category: "Signature Collection",
    categorySlug: "signature-collection",
    gender: "Unisex",
    fragranceFamily: "Gourmand",
    concentration: "Eau de Parfum",
    price: 8300.00,
    originalPrice: 11400.00,
    discountPrice: 8300.00,
    stock: 32,
    lowStockThreshold: 8,
    rating: 4.9,
    reviewCount: 88,
    status: "active",
    featured: false,
    bestseller: true,
    isNew: false,
    exclusive: false,
    sizes: ["50ml", "100ml"],
    selectedSize: "50ml",
    sizePricing: { "50ml": 8300.00, "100ml": 12200.00 },
    longevity: "10–13 Hours",
    sillage: "Decadent & Warm",
    season: "Autumn / Winter",
    occasion: "Evening Romance & Fireside Comfort",
    shortDescription: "Smoky Madagascar vanilla pod infused with aged bourbon, charred oak, and dark brown sugar crystals.",
    description: "Not your childhood sweet vanilla. Vanille Noire is dark, boozy, and resinous. Cured vanilla beans drenched in oak-aged bourbon with toasted almonds and dark patchouli.",
    story: "Born in the spice ports of Madagascar, capturing the aroma of black vanilla pods drying under tropical heat.",
    notes: {
      top: ["Aged Bourbon", "Roasted Almond", "Cinnamon Bark"],
      heart: ["Madagascar Vanilla Caviar", "Orchid Petals", "Cacao Pod"],
      base: ["Charred Oakwood", "Dark Caramel", "Tonka Bean", "Amber"]
    },
    specs: {
      "Concentration": "Eau de Parfum (24% Concentration)",
      "Vanilla": "100% Single-origin Planifolia vanilla extract",
      "Vessel": "Obsidian flacon with gilded calligraphy"
    },
    ingredients: "Alcohol Denat., Fragrance (Parfum), Coumarin, Cinnamyl Alcohol, Eugenol, Benzyl Benzoate.",
    images: [
      "https://images.unsplash.com/photo-1594035910387-fea47794261f?auto=format&fit=crop&w=900&q=80",
      "https://images.unsplash.com/photo-1588405748880-12d1d2a59f75?auto=format&fit=crop&w=900&q=80"
    ],
    tags: ["vanilla", "bourbon", "gourmand", "warm", "unisex", "sweet"]
  },
  {
    id: "df_neroli_blanc",
    sku: "DF-UNI-18",
    name: "DeepFeel Néroli Blanc",
    category: "Unisex Elixirs",
    categorySlug: "unisex",
    gender: "Unisex",
    fragranceFamily: "Citrus",
    concentration: "Eau de Parfum",
    price: 6800.00,
    originalPrice: 9300.00,
    discountPrice: 6800.00,
    stock: 44,
    lowStockThreshold: 10,
    rating: 4.8,
    reviewCount: 49,
    status: "active",
    featured: false,
    bestseller: false,
    isNew: false,
    exclusive: false,
    sizes: ["50ml", "100ml"],
    selectedSize: "50ml",
    sizePricing: { "50ml": 6800.00, "100ml": 9900.00 },
    longevity: "8–9 Hours",
    sillage: "Crisp & Luminous",
    season: "Spring / Summer",
    occasion: "Morning Strolls, Linen Shirts & Mediterranean Escapes",
    shortDescription: "Sparkling Tunisian orange blossom, bitter petitgrain, bergamot rind, and clean white cedar.",
    description: "Pure, pristine white floral luminescence. Distilled from the delicate blossoms of bitter orange trees, Néroli Blanc feels like morning dew shining on white petals.",
    story: "Inspired by the sunrise harvest of orange blossom orchards in Cap d'Antibes.",
    notes: {
      top: ["Tunisian Neroli", "Italian Bergamot", "Petitgrain"],
      heart: ["Orange Blossom Absolute", "White Tea Leaf", "Lily of the Valley"],
      base: ["White Cedarwood", "Clean Amber", "Silk Musks"]
    },
    specs: {
      "Concentration": "Eau de Parfum (20% Concentration)",
      "Floral Source": "Steam-distilled Tunisian Citrus Aurantium",
      "Vessel": "Clear crystalline flacon"
    },
    ingredients: "Alcohol Denat., Parfum (Fragrance), Limonene, Linalool, Geraniol, Citronellol, Citral.",
    images: [
      "https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?auto=format&fit=crop&w=900&q=80",
      "https://images.unsplash.com/photo-1523293182086-7651a899d37f?auto=format&fit=crop&w=900&q=80"
    ],
    tags: ["neroli", "orange blossom", "fresh", "summer", "citrus", "clean"]
  },
  {
    id: "df_encens_royal",
    sku: "DF-UNI-19",
    name: "DeepFeel Encens Royal",
    category: "Signature Collection",
    categorySlug: "signature-collection",
    gender: "Unisex",
    fragranceFamily: "Oriental",
    concentration: "Extrait de Parfum",
    price: 10100.00,
    originalPrice: 13800.00,
    discountPrice: 10100.00,
    stock: 21,
    lowStockThreshold: 5,
    rating: 5.0,
    reviewCount: 62,
    status: "active",
    featured: false,
    bestseller: false,
    isNew: true,
    exclusive: true,
    sizes: ["50ml", "100ml"],
    selectedSize: "50ml",
    sizePricing: { "50ml": 10100.00, "100ml": 15100.00 },
    longevity: "12–15 Hours",
    sillage: "Meditative & Mysterious",
    season: "Autumn / Winter",
    occasion: "Intimate Evenings, Intellectual Gatherings & Sacred Quiet",
    shortDescription: "Sacred Omani green frankincense tears, myrrh tears, spiced elemi, and aged Atlas cedar.",
    description: "An olfactory temple of raw spiritual majesty. Rare green Hojari frankincense burns over aged cedar charcoals, releasing cool citrus-tinged smoke before sinking into warm, resinous myrrh and labdanum.",
    story: "Harvested by hand from the ancient Boswellia sacra trees clinging to the desert cliffs of Dhofar, Oman.",
    notes: {
      top: ["Omani Green Frankincense", "Spiced Elemi", "Black Cardamom"],
      heart: ["Somalian Myrrh", "Labdanum", "Nutmeg"],
      base: ["Atlas Cedar", "Smoked Benzoin", "Aged Ambergris", "Patchouli"]
    },
    specs: {
      "Concentration": "Extrait de Parfum (31% Concentration)",
      "Resin Quality": "Grade 1 Royal Hojari Frankincense",
      "Vessel": "Charcoal stone flacon with hand-polished copper crest"
    },
    ingredients: "Alcohol Denat., Fragrance (Parfum), Benzyl Benzoate, Limonene, Linalool, Eugenol.",
    images: [
      "https://images.unsplash.com/photo-1547887537-6158d64c35b3?auto=format&fit=crop&w=900&q=80",
      "https://images.unsplash.com/photo-1594035910387-fea47794261f?auto=format&fit=crop&w=900&q=80"
    ],
    tags: ["incense", "frankincense", "myrrh", "oriental", "deep & smoky", "unisex"]
  },
  {
    id: "df_duo_set",
    sku: "DF-GFT-20",
    name: "The Signature Duo (2 x 50ml)",
    category: "Gift & Discovery Sets",
    categorySlug: "gift-sets",
    gender: "Unisex",
    fragranceFamily: "Woody Amber",
    concentration: "Extrait de Parfum",
    price: 15300.00,
    originalPrice: 20800.00,
    discountPrice: 15300.00,
    stock: 25,
    lowStockThreshold: 6,
    rating: 5.0,
    reviewCount: 58,
    status: "active",
    featured: false,
    bestseller: false,
    isNew: false,
    exclusive: true,
    sizes: ["2 x 50ml"],
    selectedSize: "2 x 50ml",
    sizePricing: { "2 x 50ml": 15300.00 },
    longevity: "12–16 Hours",
    sillage: "Powerful & Sophisticated",
    season: "All Seasons",
    occasion: "Couples, Anniversary & Milestone Gifting",
    shortDescription: "Our two most legendary extraits—DeepFeel Noir and Oud Royale—presented in a custom velvet coffret.",
    description: "The definitive collector's pairing. DeepFeel Noir (50ml) and Oud Royale (50ml) nestled in bespoke emerald velvet lining with a brass wax seal certificate of authenticity.",
    story: "Created for couples who celebrate complementary scent identities: dark leather rose paired with golden Assam agarwood.",
    notes: {
      top: ["Noir: Black Saffron, Bergamot", "Oud Royale: Wild Cardamom, Honey"],
      heart: ["Noir: Turkish Rose, Guaiacwood", "Oud Royale: Taif Rose, Agarwood"],
      base: ["Noir: Ambergris, Leather", "Oud Royale: Assam Oud, Frankincense"]
    },
    specs: {
      "Coffret Includes": "1 x Noir Extrait (50ml) + 1 x Oud Royale (50ml)",
      "Presentation": "Handcrafted lacquered wooden box with velvet lining",
      "Certificate": "Individually numbered master perfumer seal"
    },
    ingredients: "Refer to individual bottles for full formulation ingredients.",
    images: [
      "https://images.unsplash.com/photo-1615655406736-b37c4fabf923?auto=format&fit=crop&w=900&q=80",
      "https://images.unsplash.com/photo-1547887537-6158d64c35b3?auto=format&fit=crop&w=900&q=80"
    ],
    tags: ["duo", "gift", "oud", "noir", "luxury", "collector"]
  }
];

const SEED_COUPONS = [
  {
    id: "cp_welcome10",
    code: "WELCOME10",
    discountType: "percentage",
    discountValue: 10,
    minOrder: 4000,
    usageLimit: 1000,
    usedCount: 142,
    expiryDate: "2027-12-31",
    active: true,
    description: "10% off on your first Maison DeepFeel order across Pakistan"
  },
  {
    id: "cp_maison1500",
    code: "MAISON1500",
    discountType: "fixed",
    discountValue: 1500,
    minOrder: 10000,
    usageLimit: 500,
    usedCount: 89,
    expiryDate: "2027-12-31",
    active: true,
    description: "Rs. 1,500 off on Oud & Signature Collection orders over Rs. 10,000"
  },
  {
    id: "cp_freeship",
    code: "FREESHIP",
    discountType: "fixed",
    discountValue: 250,
    minOrder: 3000,
    usageLimit: 2000,
    usedCount: 520,
    expiryDate: "2027-12-31",
    active: true,
    description: "Complimentary TCS express courier delivery across Pakistan"
  },
  {
    id: "cp_eid20",
    code: "EID20",
    discountType: "percentage",
    discountValue: 20,
    minOrder: 8000,
    usageLimit: 500,
    usedCount: 64,
    expiryDate: "2027-12-31",
    active: true,
    description: "20% Festive Luxury Discount on all pure extraits"
  }
];


const SEED_USERS = [
  {
    id: "usr_admin",
    name: "DeepFeel Atelier Admin",
    email: "admin@deepfeel.pk",
    role: "admin",
    createdAt: "2025-01-10T09:00:00.000Z"
  },
  {
    id: "usr_customer_1",
    name: "Farhan Tariq",
    email: "farhan.tariq@gmail.com",
    role: "customer",
    phone: "+92 300 8472910",

    address: {
      street: "Bungalow 42-A, Sector Y, Phase 5 DHA",
      city: "Lahore",
      state: "Punjab",
      zip: "54000",
      country: "Pakistan"
    },
    ordersCount: 3,
    totalSpent: 28500.00,
    createdAt: "2025-02-14T14:20:00.000Z"
  },
  {
    id: "usr_customer_2",
    name: "Ayesha Malik",
    email: "ayesha.malik@gmail.com",
    password: "password123",
    role: "customer",
    phone: "+92 321 9988776",
    address: {
      street: "Apartment 6B, Tower 3, Emaar Crescent Bay, DHA Phase 8",
      city: "Karachi",
      state: "Sindh",
      zip: "75500",
      country: "Pakistan"
    },
    ordersCount: 2,
    totalSpent: 19300.00,
    createdAt: "2025-03-01T11:15:00.000Z"
  }
];

const SEED_ORDERS = [
  {
    id: "DF-PK-94810",
    userId: "usr_customer_1",
    customer: {
      name: "Farhan Tariq",
      email: "farhan.tariq@gmail.com",
      phone: "+92 300 8472910",
      city: "Lahore",
      address: "Bungalow 42-A, Sector Y, Phase 5 DHA, Lahore, Punjab, Pakistan"
    },
    items: [
      {
        productId: "df_noir",
        name: "DeepFeel Noir Extrait",
        price: 8500.00,
        quantity: 1,
        image: "https://images.unsplash.com/photo-1594035910387-fea47794261f?auto=format&fit=crop&w=900&q=80",
        variant: "50ml Flacon",
        size: "50ml"
      },
      {
        productId: "df_discovery_set",
        name: "The Maison Discovery Set",
        price: 4500.00,
        quantity: 1,
        image: "https://images.unsplash.com/photo-1615655406736-b37c4fabf923?auto=format&fit=crop&w=900&q=80",
        variant: "5 x 10ml Atomizers",
        size: "5 x 10ml"
      }
    ],
    giftPackaging: true,
    giftPackagingFee: 350.00,
    subtotal: 13000.00,
    discount: 1300.00,
    couponCode: "WELCOME10",
    shipping: 0.00,
    tax: 0.00,
    total: 12050.00,
    status: "Delivered",
    paymentMethod: "Easypaisa (TID: EP-9982310)",
    paymentStatus: "Paid",
    createdAt: "2026-08-19T10:30:00.000Z",
    timeline: [
      { status: "Order Received & Perfume Maceration Verified", date: "2026-08-19 10:30 AM", completed: true },
      { status: "Hand-wrapped in Signature Silk & Wax Seal", date: "2026-08-20 09:15 AM", completed: true },
      { status: "Dispatched via TCS Express (Tracking #TCS-772910482)", date: "2026-08-21 02:00 PM", completed: true },
      { status: "Delivered to Residence Doorstep in Lahore", date: "2026-08-23 11:45 AM", completed: true }
    ]
  },
  {
    id: "DF-PK-94811",
    userId: "usr_customer_2",
    customer: {
      name: "Ayesha Malik",
      email: "ayesha.malik@gmail.com",
      phone: "+92 321 9988776",
      city: "Karachi",
      address: "Apartment 6B, Tower 3, Emaar Crescent Bay, DHA Phase 8, Karachi, Sindh, Pakistan"
    },
    items: [
      {
        productId: "df_oud_royale",
        name: "DeepFeel Oud Royale",
        price: 11500.00,
        quantity: 1,
        image: "https://images.unsplash.com/photo-1547887537-6158d64c35b3?auto=format&fit=crop&w=900&q=80",
        variant: "50ml Flacon",
        size: "50ml"
      }
    ],
    giftPackaging: false,
    giftPackagingFee: 0.00,
    subtotal: 11500.00,
    discount: 1500.00,
    couponCode: "MAISON1500",
    shipping: 0.00,
    tax: 0.00,
    total: 10000.00,
    status: "Shipped",
    paymentMethod: "Cash on Delivery (COD)",
    paymentStatus: "Pending COD Collection",
    createdAt: "2026-08-28T14:15:00.000Z",
    timeline: [
      { status: "Order Confirmed via Concierge", date: "2026-08-28 02:15 PM", completed: true },
      { status: "Formulation Batch Tested", date: "2026-08-29 08:00 AM", completed: true },
      { status: "In Transit via Leopard Express (Tracking #LEP-440281)", date: "2026-08-30 03:30 PM", completed: true },
      { status: "Out for Doorstep Delivery in Karachi", date: "2026-09-02 (Estimated)", completed: false }
    ]
  }
];


const SEED_SETTINGS = {
  storeName: "DeepFeel",
  adminEmail: "2003abdulwaris@gmail.com",
  storeTagline: "Scent that leaves an indelible memory.",
  storeEmail: "concierge@deepfeel.pk",
  storePhone: "+92 300 1234567",
  storeAddress: "Maison DeepFeel Atelier, Sector F-6/2, Islamabad & Gulberg III, Lahore, Pakistan",
  currency: "PKR",
  currencySymbol: "Rs. ",
  taxRate: 0.0,
  freeShippingThreshold: 5000.00,
  flatShippingRate: 250.00,
  expressShippingRate: 450.00,
  giftPackagingFee: 350.00,
  announcementText: "Complimentary Delivery across Pakistan on orders over Rs. 5,000 — Cash on Delivery (COD), Easypaisa & JazzCash Available",
  enableReviews: true,
  enableWishlist: true
};


const SEED_REVIEWS = [
  {
    productId: "df_noir",
    author: "Genevieve R.",
    rating: 5,
    date: "August 22, 2026",
    title: "Unquestionably the finest leather-amber extrait I own",
    content: "The sillage is intoxicating without screaming. It lingers on my cashmere scarf for days. The Turkish rose softens the smoky leather into pure sensual gold. A true signature scent.",
    verified: true
  },
  {
    productId: "df_noir",
    author: "Dr. Alistair M.",
    rating: 5,
    date: "July 30, 2026",
    title: "A masterclass in restraint and deep sillage",
    content: "I receive compliments every single time I wear Noir. The ambergris dry-down smells expensive, tactile, and deeply sophisticated. Worth every dollar.",
    verified: true
  },
  {
    productId: "df_oud_royale",
    author: "Tariq K.",
    rating: 5,
    date: "August 14, 2026",
    title: "Authentic, buttery Assam agarwood. No synthetic harshness.",
    content: "Having collected niche Middle Eastern and French ouds for 15 years, DeepFeel Oud Royale stands with the greatest. Smooth, balsamic honeyed woods with extraordinary longevity.",
    verified: true
  },
  {
    productId: "df_elan",
    author: "Seraphina L.",
    rating: 5,
    date: "August 19, 2026",
    title: "The purest Grasse Jasmine I have ever experienced",
    content: "Radiant, feminine, and luminous. It is neither powdery nor old-fashioned—it feels like stepping into a sun-drenched flower market at 6 AM in the South of France.",
    verified: true
  }
];

const SEED_JOURNAL_ARTICLES = [
  {
    id: "journal_1",
    slug: "how-to-find-your-signature-scent",
    title: "How to Find Your Signature Scent",
    subtitle: "The art of discovering an invisible identity that endures in memory.",
    category: "Olfactory Guides",
    date: "August 28, 2026",
    readTime: "4 min read",
    image: "https://images.unsplash.com/photo-1594035910387-fea47794261f?auto=format&fit=crop&w=1000&q=80",
    excerpt: "A signature scent is not a cosmetic accessory; it is an invisible architecture that announces your presence and preserves your memory long after departure.",
    content: `Finding a signature scent is an intimate exploration of memory, chemistry, and personal temperament. Rather than chasing fleeting commercial trends, consider the emotional architecture of your presence.
    
    When testing a new extrait, never judge it on paper blotters alone. High-concentration aromatic oils interact dynamically with your natural skin lipids, body temperature, and pH. Spray directly onto warm pulse points—the base of your throat and inside wrists—and allow the composition to evolve over four distinct hours.
    
    A true signature fragrance should evoke quiet confidence rather than overwhelm a room. Look for base notes such as aged amber, creamy Mysore sandalwood, and natural agarwood that dry down into an indelible aura.`
  },
  {
    id: "journal_2",
    slug: "understanding-fragrance-notes",
    title: "Understanding Fragrance Notes",
    subtitle: "Demystifying the three-tier olfactory pyramid: Top, Heart, and Base.",
    category: "Masterclass",
    date: "August 15, 2026",
    readTime: "5 min read",
    image: "https://images.unsplash.com/photo-1547887537-6158d64c35b3?auto=format&fit=crop&w=1000&q=80",
    excerpt: "Learn how the volatile top notes yield to rich floral hearts before settling into resonant base accords that linger for 14+ hours.",
    content: `Perfume composition is structured like a musical chord. Top notes represent the volatile first impression—bright citrus, sparkling pink pepper, and airy aldehydes that sparkle for the first 15 to 30 minutes.
    
    As the initial evaporation subsides, the heart notes emerge. These form the true personality of the perfume: rich Turkish roses, nocturnal Grasse jasmine, cardamom, and cedarwood that radiate for three to five hours.
    
    Finally, the base notes anchor the composition. Composed of heavier molecules such as wild agarwood (oud), dark bourbon vanilla, benzoin, and ambers, they bond with your skin for 12 to 16+ hours, leaving an unforgettable trail (sillage).`
  },
  {
    id: "journal_3",
    slug: "oud-the-soul-of-modern-perfumery",
    title: "Oud: The Soul of Modern Perfumery",
    subtitle: "The ancient mystique, sustainable harvesting, and buttery depth of wild agarwood.",
    category: "Ingredient Provenance",
    date: "August 02, 2026",
    readTime: "6 min read",
    image: "https://images.unsplash.com/photo-1523293182086-7651a899d37f?auto=format&fit=crop&w=1000&q=80",
    excerpt: "Known as black liquid gold, pure Assam agarwood possesses a creamy, balsamic depth that cannot be replicated by synthetic molecules.",
    content: `Agarwood (oud) is one of nature's rarest anomalies. Formed inside the heartwood of Aquilaria trees when infected with a specific mold, the tree produces a dark, resinous essence to protect itself.
    
    At Maison DeepFeel, we reject synthetic medicinal accords. Our agarwood is sustainably harvested from 30-year-old plantations in Assam and Trat, followed by traditional copper pot steam distillation. The result is a buttery, smoky, balsamic nectar with profound sensual warmth.`
  },
  {
    id: "journal_4",
    slug: "how-to-make-your-fragrance-last-longer",
    title: "How to Make Your Fragrance Last Longer",
    subtitle: "Atelier techniques for extending the sillage and longevity of pure extraits.",
    category: "Care & Rituals",
    date: "July 24, 2026",
    readTime: "3 min read",
    image: "https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?auto=format&fit=crop&w=1000&q=80",
    excerpt: "Simple moisture layering techniques and pulse point applications to double the longevity of your signature extrait.",
    content: `High-concentration extraits naturally last 12+ hours, but proper application technique can elevate longevity even further.
    
    First, apply perfume immediately after a warm shower onto well-hydrated skin. Dry skin rapidly absorbs alcohol and dissipates scent molecules, whereas well-moisturized skin creates an anchor for essential perfume oils.
    
    Second, resist the urge to rub your wrists together. Friction generates heat that destroys delicate top-note molecules before they have a chance to bloom. Finally, store your flacons away from direct sunlight and sudden humidity shifts.`
  }
];

