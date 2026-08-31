/**
 * DeepFeel - Initial Seed Data Layer
 * Contains realistic premium lifestyle products, categories, coupons, and demo accounts.
 */

const SEED_CATEGORIES = [
  {
    id: "cat_living",
    name: "Home & Living",
    slug: "home-living",
    description: "Thoughtfully crafted homeware, textiles, and comforting essentials.",
    image: "https://images.unsplash.com/photo-1583847268964-b28dc8f51f92?auto=format&fit=crop&w=800&q=80",
    featured: true
  },
  {
    id: "cat_comfort",
    name: "Rest & Wellness",
    slug: "rest-wellness",
    description: "Ergonomic sleep systems, organic blankets, and mindful recovery goods.",
    image: "https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=800&q=80",
    featured: true
  },
  {
    id: "cat_drinkware",
    name: "Artisan Drinkware",
    slug: "artisan-drinkware",
    description: "Ceramic pour-overs, stoneware mugs, and thermal carafes.",
    image: "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=800&q=80",
    featured: true
  },
  {
    id: "cat_lighting",
    name: "Ambient Lighting",
    slug: "ambient-lighting",
    description: "Sculptural luminaires and warm accent lamps engineered for calm spaces.",
    image: "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=800&q=80",
    featured: true
  },
  {
    id: "cat_workspace",
    name: "Studio & Workspace",
    slug: "studio-workspace",
    description: "Minimal desk organizers, tactile leather goods, and timeless accessories.",
    image: "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?auto=format&fit=crop&w=800&q=80",
    featured: false
  }
];

const SEED_PRODUCTS = [
  {
    id: "df_001",
    sku: "DF-LIV-01",
    name: "Merino Wool Weighted Throw",
    category: "Rest & Wellness",
    categorySlug: "rest-wellness",
    price: 185.00,
    originalPrice: 220.00,
    discountPrice: 185.00,
    stock: 28,
    lowStockThreshold: 10,
    rating: 4.9,
    reviewCount: 64,
    status: "active",
    featured: true,
    bestseller: true,
    isNew: false,
    shortDescription: "Ultra-fine New Zealand merino wool hand-knit blanket providing gentle, evenly distributed pressure for restorative sleep.",
    description: "Experience deep relaxation with our handcrafted Merino Wool Weighted Throw. Designed with 100% natural, breathable fibers, this piece offers therapeutic gentle pressure without trapping excess heat. The chunky open-loop weave ensures consistent airflow while providing a comforting cocoon for reading, lounging, or sleeping.",
    specs: {
      "Material": "100% Certified Organic Merino Wool",
      "Dimensions": "50\" x 70\" (127cm x 178cm)",
      "Weight": "12 lbs (5.4 kg)",
      "Origin": "Ethically crafted in Portugal",
      "Care": "Dry clean or spot clean with cold water"
    },
    images: [
      "https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?auto=format&fit=crop&w=900&q=80",
      "https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=900&q=80",
      "https://images.unsplash.com/photo-1583847268964-b28dc8f51f92?auto=format&fit=crop&w=900&q=80"
    ],
    tags: ["blanket", "merino", "wellness", "sleep", "throw"],
    variants: {
      colors: ["Oatmeal Heather", "Charcoal Slate", "Sage Mist"],
      sizes: ["Standard (50x70)", "Large (60x80)"]
    }
  },
  {
    id: "df_002",
    sku: "DF-CER-02",
    name: "Komorebi Ceramic Pour-Over Set",
    category: "Artisan Drinkware",
    categorySlug: "artisan-drinkware",
    price: 68.00,
    originalPrice: 85.00,
    discountPrice: 68.00,
    stock: 45,
    lowStockThreshold: 12,
    rating: 4.8,
    reviewCount: 42,
    status: "active",
    featured: true,
    bestseller: false,
    isNew: true,
    shortDescription: "Hand-thrown stoneware dripper with matching heat-resistant glass carafe and walnut collar.",
    description: "Elevate your morning coffee ritual with the Komorebi Pour-Over Set. Individually hand-glazed by master ceramicists in Kyoto, the internal spiral grooves are engineered to optimize extraction rate and brew clarity. Paired with hand-carved American walnut accents.",
    specs: {
      "Material": "Natural Sandstone Ceramic & Borosilicate Glass",
      "Capacity": "600ml (2-4 Cups)",
      "Filter Compatibility": "Standard #02 Cone Filters",
      "Dishwasher Safe": "Ceramic dripper and glass only (Remove wooden collar)"
    },
    images: [
      "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=900&q=80",
      "https://images.unsplash.com/photo-1517256064527-09c73fc73e38?auto=format&fit=crop&w=900&q=80",
      "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=900&q=80"
    ],
    tags: ["coffee", "ceramic", "drinkware", "pour-over", "kitchen"],
    variants: {
      colors: ["Raw Sandstone", "Matte Charcoal", "Speckled Moss"]
    }
  },
  {
    id: "df_003",
    sku: "DF-LGT-03",
    name: "Aura Tactile Dimmable Desk Lamp",
    category: "Ambient Lighting",
    categorySlug: "ambient-lighting",
    price: 145.00,
    originalPrice: 145.00,
    discountPrice: 145.00,
    stock: 19,
    lowStockThreshold: 8,
    rating: 4.9,
    reviewCount: 51,
    status: "active",
    featured: true,
    bestseller: true,
    isNew: false,
    shortDescription: "Machined solid aluminum table lamp with capacitive brass touch dimmer and 2700K warm LED glow.",
    description: "The Aura Lamp delivers a soothing, glare-free downward cascade of light designed to calm the senses during focused work or evening unwind sessions. Tap or hold the knurled brass dial to step smoothly between intimate candle warmth and crisp daylight task illumination.",
    specs: {
      "Dimensions": "13.5\" H x 7.5\" W",
      "Color Temp": "2200K - 3000K Stepless Dimming",
      "Bulb": "Integrated CRI 95+ Warm LED (50,000 Hours life)",
      "Power": "USB-C Recharging / Continuous AC Cord Included"
    },
    images: [
      "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=900&q=80",
      "https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?auto=format&fit=crop&w=900&q=80",
      "https://images.unsplash.com/photo-1540932239986-30128078f3c5?auto=format&fit=crop&w=900&q=80"
    ],
    tags: ["lighting", "lamp", "desk", "minimalist", "brass"],
    variants: {
      colors: ["Anodized Bronze", "Brushed Brass", "Matte Obsidian"]
    }
  },
  {
    id: "df_004",
    sku: "DF-WKS-04",
    name: "Full-Grain Saddle Leather Desk Mat",
    category: "Studio & Workspace",
    categorySlug: "studio-workspace",
    price: 92.00,
    originalPrice: 110.00,
    discountPrice: 92.00,
    stock: 35,
    lowStockThreshold: 10,
    rating: 4.7,
    reviewCount: 38,
    status: "active",
    featured: false,
    bestseller: true,
    isNew: false,
    shortDescription: "Vegetable-tanned Tuscan leather pad that develops a rich, individual patina with everyday use.",
    description: "Crafted from heavy 3.5mm full-grain bridle leather, this workspace mat anchors your keyboard and mouse in tactile luxury. Treated with natural beeswax and oils, the water-resistant surface cushions wrists and protects fine wood desktops.",
    specs: {
      "Dimensions": "32\" x 16\" (81cm x 40cm)",
      "Thickness": "3.5mm Full-Grain Leather + Suede Backing",
      "Tannery": "Ponte a Egola, Tuscany, Italy",
      "Edge": "Hand-burnished with organic beeswax"
    },
    images: [
      "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?auto=format&fit=crop&w=900&q=80",
      "https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=900&q=80"
    ],
    tags: ["leather", "desk", "workspace", "organizer"],
    variants: {
      colors: ["Chestnut Cognac", "Espresso Black", "Natural Raw"]
    }
  },
  {
    id: "df_005",
    sku: "DF-LIV-05",
    name: "Acoustic Ceramic Ultrasonic Diffuser",
    category: "Home & Living",
    categorySlug: "home-living",
    price: 88.00,
    originalPrice: 88.00,
    discountPrice: 88.00,
    stock: 50,
    lowStockThreshold: 15,
    rating: 4.9,
    reviewCount: 79,
    status: "active",
    featured: true,
    bestseller: true,
    isNew: true,
    shortDescription: "Whisper-quiet ultrasonic mist diffuser housed inside a sculpted, matte porcelain shell.",
    description: "Transform the atmosphere of your home within seconds. Emitting a fine cool mist vibrating at 2.4MHz, this ultrasonic diffuser disperses 100% pure botanical essential oils across rooms up to 500 sq ft while maintaining a calming, barely-audible hum under 20dB.",
    specs: {
      "Capacity": "280ml (Up to 12 Hours continuous mist)",
      "Coverage": "500 sq ft (46 m²)",
      "Auto Shut-off": "Yes, when water reservoir is depleted",
      "Light": "Optional subtle ambient amber glow"
    },
    images: [
      "https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?auto=format&fit=crop&w=900&q=80",
      "https://images.unsplash.com/photo-1602928321679-560bb453f190?auto=format&fit=crop&w=900&q=80"
    ],
    tags: ["diffuser", "aromatherapy", "wellness", "ceramic", "living"],
    variants: {
      colors: ["Terracotta Clay", "Ivory Dune", "Charcoal Basalt"]
    }
  },
  {
    id: "df_006",
    sku: "DF-COM-06",
    name: "Cloud-Feel Mulberry Silk Pillowcase Pair",
    category: "Rest & Wellness",
    categorySlug: "rest-wellness",
    price: 74.00,
    originalPrice: 95.00,
    discountPrice: 74.00,
    stock: 40,
    lowStockThreshold: 10,
    rating: 4.9,
    reviewCount: 88,
    status: "active",
    featured: false,
    bestseller: true,
    isNew: false,
    shortDescription: "Grade 6A 22-Momme pure mulberry silk for frictionless skin hydration and hair protection.",
    description: "Wake up refreshed with zero sleep creases or tangled hair. Our 22-Momme silk pillowcases are OEKO-TEX standard certified, naturally hypoallergenic, and temperature-regulating for a consistently cool sleep surface all night.",
    specs: {
      "Material": "100% Grade 6A Long Strand Mulberry Silk",
      "Closure": "Hidden envelope zipper",
      "Standard Size": "20\" x 26\" (50cm x 66cm)",
      "King Size": "20\" x 36\" (50cm x 90cm)"
    },
    images: [
      "https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?auto=format&fit=crop&w=900&q=80",
      "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&w=900&q=80"
    ],
    tags: ["silk", "pillowcase", "sleep", "wellness", "beauty"],
    variants: {
      colors: ["Champagne Pearl", "French Linen White", "Smoky Quartz"],
      sizes: ["Queen (20x30)", "King (20x36)"]
    }
  },
  {
    id: "df_007",
    sku: "DF-DRK-07",
    name: "Soren Double-Wall Borosilicate Tumbler",
    category: "Artisan Drinkware",
    categorySlug: "artisan-drinkware",
    price: 36.00,
    originalPrice: 42.00,
    discountPrice: 36.00,
    stock: 60,
    lowStockThreshold: 15,
    rating: 4.6,
    reviewCount: 29,
    status: "active",
    featured: false,
    bestseller: false,
    isNew: true,
    shortDescription: "Thermal insulated lightweight glass tumbler with leakproof walnut lid and silicone gasket.",
    description: "Keep cold brews chilled for 8 hours or hot matcha piping for 5 hours without exterior condensation. The Soren Tumbler is hand-blown from laboratory-grade borosilicate glass, ensuring purest beverage flavor without metallic aftertaste.",
    specs: {
      "Capacity": "450ml (15 oz)",
      "Thermal Rating": "-20°C to 150°C shock resistant",
      "Lid": "Natural oiled Walnut with food-grade silicone seal"
    },
    images: [
      "https://images.unsplash.com/photo-1517256064527-09c73fc73e38?auto=format&fit=crop&w=900&q=80",
      "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=900&q=80"
    ],
    tags: ["tumbler", "glass", "drinkware", "tea", "travel"],
    variants: {
      colors: ["Smoke Grey", "Clear Amber", "Frosted Mist"]
    }
  },
  {
    id: "df_008",
    sku: "DF-LGT-08",
    name: "Vessel Travertine Sconce",
    category: "Ambient Lighting",
    categorySlug: "ambient-lighting",
    price: 198.00,
    originalPrice: 240.00,
    discountPrice: 198.00,
    stock: 14,
    lowStockThreshold: 5,
    rating: 5.0,
    reviewCount: 19,
    status: "active",
    featured: true,
    bestseller: false,
    isNew: true,
    shortDescription: "Solid carved Italian travertine stone wall sconce casting warm bi-directional indirect light.",
    description: "Each Vessel Sconce is sculpted from a single slab of unfilled natural travertine, highlighting unique mineral veining and organic tactile pitting. When illuminated, it throws a dramatic crown of golden indirect light upwards and downwards.",
    specs: {
      "Material": "Solid Italian Roman Travertine & Solid Brass",
      "Dimensions": "9.5\" H x 4.5\" W x 3.5\" D",
      "Hardwired / Plug-in": "Hardwired kit included (Optional fabric cord adapter)",
      "Certification": "UL Listed Dry Location"
    },
    images: [
      "https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?auto=format&fit=crop&w=900&q=80",
      "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=900&q=80"
    ],
    tags: ["lighting", "sconce", "travertine", "stone", "architecture"],
    variants: {
      colors: ["Warm Beige Travertine", "Silver Gray Travertine"]
    }
  },
  {
    id: "df_009",
    sku: "DF-LIV-09",
    name: "Stonewashed Belgian Linen Duvet Set",
    category: "Home & Living",
    categorySlug: "home-living",
    price: 240.00,
    originalPrice: 280.00,
    discountPrice: 240.00,
    stock: 22,
    lowStockThreshold: 8,
    rating: 4.9,
    reviewCount: 92,
    status: "active",
    featured: true,
    bestseller: true,
    isNew: false,
    shortDescription: "Pre-washed 100% European flax linen that becomes softer with every wash cycle.",
    description: "Woven in Flanders from sustainably harvested French and Belgian flax, our stonewashed duvet collection delivers relaxed luxury. Naturally thermo-regulating, moisture-wicking, and pre-softened with natural volcanic stone tumbling.",
    specs: {
      "Set Includes": "1 Duvet Cover + 2 Pillow Shams with coconut shell buttons",
      "Flax Origin": "Normandy, France & Flanders, Belgium",
      "Fabric Weight": "180 GSM Medium-Heavy Weight Linen"
    },
    images: [
      "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&w=900&q=80",
      "https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?auto=format&fit=crop&w=900&q=80"
    ],
    tags: ["bedding", "linen", "duvet", "home", "comfort"],
    variants: {
      colors: ["Natural Oatmeal", "Washed Olive", "Desert Clay"],
      sizes: ["Queen (90x90)", "King (106x90)"]
    }
  },
  {
    id: "df_010",
    sku: "DF-WKS-10",
    name: "Solid Oak Floating Monitor Stand",
    category: "Studio & Workspace",
    categorySlug: "studio-workspace",
    price: 118.00,
    originalPrice: 118.00,
    discountPrice: 118.00,
    stock: 31,
    lowStockThreshold: 10,
    rating: 4.8,
    reviewCount: 47,
    status: "active",
    featured: false,
    bestseller: false,
    isNew: false,
    shortDescription: "Ergonomic monitor riser crafted from sustainably sourced FSC-certified solid White Oak with cork pads.",
    description: "Raise your display to ideal ergonomic eye level while reclaiming valuable desk territory underneath for your keyboard, notepad, and dock. Precision CNC milled and hand-sanded with zero VOC matte hardwax oil.",
    specs: {
      "Dimensions": "42\" L x 9\" W x 4.2\" H (Supports up to 2 monitors / 120 lbs)",
      "Wood": "FSC-Certified Solid North American White Oak",
      "Legs": "Precision laser-cut matte black steel with non-slip natural cork feet"
    },
    images: [
      "https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=900&q=80",
      "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?auto=format&fit=crop&w=900&q=80"
    ],
    tags: ["wood", "workspace", "stand", "oak", "ergonomic"],
    variants: {
      colors: ["Natural White Oak", "Smoked Walnut", "Ebonized Ash"]
    }
  },
  {
    id: "df_011",
    sku: "DF-CER-11",
    name: "Kanso Hand-Carved Matcha Bowl (Chawan)",
    category: "Artisan Drinkware",
    categorySlug: "artisan-drinkware",
    price: 52.00,
    originalPrice: 65.00,
    discountPrice: 52.00,
    stock: 18,
    lowStockThreshold: 6,
    rating: 4.9,
    reviewCount: 33,
    status: "active",
    featured: false,
    bestseller: false,
    isNew: true,
    shortDescription: "Wabi-sabi inspired coarse clay ceremonial matcha bowl with textured thumb rest and pouring spout.",
    description: "The Kanso Chawan embraces Japanese wabi-sabi philosophy—celebrating tactile organic imperfections. The wide flat base allows bamboo whisks (chasen) to froth microfoam effortlessly without scratching.",
    specs: {
      "Dimensions": "4.7\" Diameter x 3.1\" Height",
      "Capacity": "400ml",
      "Finish": "Shino glaze with raw exposed iron-rich stoneware foot"
    },
    images: [
      "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=900&q=80",
      "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=900&q=80"
    ],
    tags: ["matcha", "tea", "chawan", "ceramic", "japanese"],
    variants: {
      colors: ["Kuro Dark Ash", "Shino Pearl White"]
    }
  },
  {
    id: "df_012",
    sku: "DF-LIV-12",
    name: "Hinoki Wood Bath Caddy Tray",
    category: "Home & Living",
    categorySlug: "home-living",
    price: 110.00,
    originalPrice: 130.00,
    discountPrice: 110.00,
    stock: 16,
    lowStockThreshold: 5,
    rating: 4.8,
    reviewCount: 27,
    status: "active",
    featured: false,
    bestseller: false,
    isNew: false,
    shortDescription: "Aromatic Japanese Hinoki cypress bath board naturally resistant to humidity with wine and tablet slots.",
    description: "Bring the restorative serenity of an onsen spa into your bathroom. Hinoki wood emits a soothing pine-citrus aroma when warmed by steam and contains natural phytoncides that deter mold and moisture damage.",
    specs: {
      "Dimensions": "32\" L x 8.5\" W x 1.2\" Thick (Fits standard bathtubs)",
      "Wood": "100% Old-Growth Fallen Japanese Hinoki Cypress",
      "Features": "Recessed candle rest, tablet groove, drain channels"
    },
    images: [
      "https://images.unsplash.com/photo-1602928321679-560bb453f190?auto=format&fit=crop&w=900&q=80",
      "https://images.unsplash.com/photo-1583847268964-b28dc8f51f92?auto=format&fit=crop&w=900&q=80"
    ],
    tags: ["bath", "hinoki", "wood", "spa", "relaxation"],
    variants: {
      colors: ["Natural Cypress Grain"]
    }
  },
  {
    id: "df_013",
    sku: "DF-COM-13",
    name: "Ergonomic Memory Cloud Seat Cushion",
    category: "Rest & Wellness",
    categorySlug: "rest-wellness",
    price: 65.00,
    originalPrice: 79.00,
    discountPrice: 65.00,
    stock: 55,
    lowStockThreshold: 15,
    rating: 4.7,
    reviewCount: 114,
    status: "active",
    featured: false,
    bestseller: true,
    isNew: false,
    shortDescription: "Contoured coccyx pressure-relief cushion with breathable bamboo charcoal memory core.",
    description: "Transform any standard desk chair or armchair into an orthopedic oasis. The U-shaped ergonomic cutout suspends the tailbone, relieving lower back disc compression during long workdays.",
    specs: {
      "Core": "High-Density Bamboo Charcoal Infused Memory Foam",
      "Cover": "Removable 3D Air-Mesh washable cover",
      "Dimensions": "18\" x 14\" x 3\""
    },
    images: [
      "https://images.unsplash.com/photo-1583847268964-b28dc8f51f92?auto=format&fit=crop&w=900&q=80",
      "https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=900&q=80"
    ],
    tags: ["ergonomic", "cushion", "wellness", "chair", "comfort"],
    variants: {
      colors: ["Heather Charcoal", "Deep Navy", "Sandstone"]
    }
  },
  {
    id: "df_014",
    sku: "DF-LGT-14",
    name: "Lumen Concrete Wireless Rechargeable Lamp",
    category: "Ambient Lighting",
    categorySlug: "ambient-lighting",
    price: 95.00,
    originalPrice: 115.00,
    discountPrice: 95.00,
    stock: 25,
    lowStockThreshold: 8,
    rating: 4.8,
    reviewCount: 36,
    status: "active",
    featured: false,
    bestseller: false,
    isNew: true,
    shortDescription: "Ultra-portable cordless lamp cast in lightweight micro-cement with magnetic inductive charging pad.",
    description: "Take ambient lighting from the dining terrace to the bedside table. Lumen offers up to 24 hours of warm, flicker-free illumination on a single charge with IP44 water resistance for covered outdoor evenings.",
    specs: {
      "Battery Life": "8h at 100% / 24h at 30% brightness",
      "Rating": "IP44 Water & Dust resistant",
      "Charging": "Solid wood magnetic inductive pad included"
    },
    images: [
      "https://images.unsplash.com/photo-1540932239986-30128078f3c5?auto=format&fit=crop&w=900&q=80",
      "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=900&q=80"
    ],
    tags: ["lighting", "wireless", "concrete", "lamp", "patio"],
    variants: {
      colors: ["Pale Terrazzo", "Charcoal Concrete", "Warm Sand"]
    }
  },
  {
    id: "df_015",
    sku: "DF-WKS-15",
    name: "Tactile Anodized Aluminum Pen & Stand",
    category: "Studio & Workspace",
    categorySlug: "studio-workspace",
    price: 48.00,
    originalPrice: 48.00,
    discountPrice: 48.00,
    stock: 70,
    lowStockThreshold: 20,
    rating: 4.9,
    reviewCount: 58,
    status: "active",
    featured: false,
    bestseller: false,
    isNew: false,
    shortDescription: "Precision-balanced rollerball pen with Schmidt refill and weighted magnetic anti-roll desktop dock.",
    description: "Machined from a single block of aerospace-grade 6061 aluminum, the DeepFeel Pen features a perfectly calibrated center-of-gravity that glides over paper with zero hand fatigue.",
    specs: {
      "Weight": "38 grams (Balanced at 48% index point)",
      "Refill": "Standard Schmidt P8126 Capless Rollerball (Black 0.6mm included)",
      "Base": "Solid machined brass weighted dock with microfiber bottom"
    },
    images: [
      "https://images.unsplash.com/photo-1583485088034-697b5bc54ccd?auto=format&fit=crop&w=900&q=80",
      "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?auto=format&fit=crop&w=900&q=80"
    ],
    tags: ["pen", "stationery", "aluminum", "workspace", "minimal"],
    variants: {
      colors: ["Space Gray", "Champagne Gold", "Matte Silver"]
    }
  },
  {
    id: "df_016",
    sku: "DF-DRK-16",
    name: "Aura Insulated French Press (1L)",
    category: "Artisan Drinkware",
    categorySlug: "artisan-drinkware",
    price: 78.00,
    originalPrice: 90.00,
    discountPrice: 78.00,
    stock: 33,
    lowStockThreshold: 10,
    rating: 4.8,
    reviewCount: 44,
    status: "active",
    featured: false,
    bestseller: true,
    isNew: false,
    shortDescription: "Vacuum-insulated 18/8 stainless steel French press with 4-level micro-mesh sediment filtration.",
    description: "Say goodbye to lukewarm, silty coffee. Our double-walled stainless press locks heat in for 3 hours while the ultra-fine stainless spring filter traps 99.8% of grounds for a clean, full-bodied extraction.",
    specs: {
      "Capacity": "1000ml (34 oz / 8 cups)",
      "Material": "Food-grade 304 Stainless Steel + Cool-Touch Walnut Handle",
      "Thermal Insulation": "Keeps hot 3 hours / Cold 9 hours"
    },
    images: [
      "https://images.unsplash.com/photo-1517256064527-09c73fc73e38?auto=format&fit=crop&w=900&q=80",
      "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=900&q=80"
    ],
    tags: ["coffee", "french-press", "stainless", "drinkware", "breakfast"],
    variants: {
      colors: ["Matte Black", "Brushed Copper", "Stainless Steel"]
    }
  },
  {
    id: "df_017",
    sku: "DF-LIV-17",
    name: "Botanical Soy Wax Scented Candle (Set of 3)",
    category: "Home & Living",
    categorySlug: "home-living",
    price: 56.00,
    originalPrice: 65.00,
    discountPrice: 56.00,
    stock: 42,
    lowStockThreshold: 12,
    rating: 4.9,
    reviewCount: 67,
    status: "active",
    featured: false,
    bestseller: false,
    isNew: true,
    shortDescription: "Hand-poured coconut-soy wax candles infused with wild amber, cedarwood, and hinoki needles.",
    description: "Clean-burning, non-toxic, and crackling with natural wooden wicks. Formulated with therapeutic essential oils and phthalate-free perfumes to set an inviting, grounding ambiance.",
    specs: {
      "Burn Time": "50 Hours per candle (150 Hours total)",
      "Wax": "100% US-Grown Coconut & Soy Wax blend",
      "Wick": "FSC-certified crackling wooden wick",
      "Vessel": "Reusable matte stoneware pot"
    },
    images: [
      "https://images.unsplash.com/photo-1603006905003-be475563bc59?auto=format&fit=crop&w=900&q=80",
      "https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?auto=format&fit=crop&w=900&q=80"
    ],
    tags: ["candle", "aromatherapy", "soy-wax", "home", "scent"],
    variants: {
      colors: ["Trio Set: Cedar / Amber / Bergamot"]
    }
  },
  {
    id: "df_018",
    sku: "DF-COM-18",
    name: "Acupressure Reflexology Foot Mat",
    category: "Rest & Wellness",
    categorySlug: "rest-wellness",
    price: 42.00,
    originalPrice: 42.00,
    discountPrice: 42.00,
    stock: 29,
    lowStockThreshold: 10,
    rating: 4.7,
    reviewCount: 39,
    status: "active",
    featured: false,
    bestseller: false,
    isNew: false,
    shortDescription: "Natural polished river stone reflexology mat to stimulate blood circulation and ease foot fatigue.",
    description: "Designed according to ancient reflexology principles. Standing or stepping across the hand-laid smooth river cobblestones for 5 minutes daily boosts micro-circulation, massages plantar fascia, and relieves arch tension.",
    specs: {
      "Dimensions": "16\" x 48\" (40cm x 120cm)",
      "Materials": "100% Natural River Stones on Non-Slip Organic Canvas",
      "Rollable": "Easily rolls up for compact travel storage"
    },
    images: [
      "https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=900&q=80",
      "https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?auto=format&fit=crop&w=900&q=80"
    ],
    tags: ["reflexology", "massage", "wellness", "feet", "health"],
    variants: {
      colors: ["Earth Pebbles", "Midnight Basalt"]
    }
  },
  {
    id: "df_019",
    sku: "DF-WKS-19",
    name: "Handcrafted Canvas & Leather Courier Tote",
    category: "Studio & Workspace",
    categorySlug: "studio-workspace",
    price: 165.00,
    originalPrice: 195.00,
    discountPrice: 165.00,
    stock: 20,
    lowStockThreshold: 6,
    rating: 4.9,
    reviewCount: 52,
    status: "active",
    featured: true,
    bestseller: false,
    isNew: false,
    shortDescription: "Heavy 18oz waxed cotton canvas bag with full-grain leather straps and padded 16\" laptop sleeve.",
    description: "Built for a lifetime of daily commutes and weekend wanderings. Water-repellent waxed Martexin canvas pairs with solid antique brass hardware and reinforced copper rivets at all stress points.",
    specs: {
      "Capacity": "22 Liters",
      "Laptop Sleeve": "Padded fleece compartment fits up to 16\" MacBook Pro",
      "Straps": "Heavy English Bridle Leather with 11\" shoulder drop",
      "Pockets": "4 Internal organizers + 2 quick-access exterior slip pockets"
    },
    images: [
      "https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=900&q=80",
      "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?auto=format&fit=crop&w=900&q=80"
    ],
    tags: ["tote", "bag", "canvas", "leather", "laptop"],
    variants: {
      colors: ["Field Tan / Cognac", "Navy / Dark Brown", "Olive Drab / Black"]
    }
  },
  {
    id: "df_020",
    sku: "DF-LGT-20",
    name: "Nami Ribbed Amber Glass Pendant Lamp",
    category: "Ambient Lighting",
    categorySlug: "ambient-lighting",
    price: 135.00,
    originalPrice: 160.00,
    discountPrice: 135.00,
    stock: 15,
    lowStockThreshold: 5,
    rating: 4.8,
    reviewCount: 31,
    status: "active",
    featured: false,
    bestseller: false,
    isNew: true,
    shortDescription: "Hand-blown fluted amber glass ceiling pendant with spun brass canopy and braided twisted cord.",
    description: "The optical fluting in the Nami Pendant bends light into gentle water-like ripples across dining tables and kitchen islands. Looks equally striking as a solo focal point or installed in clusters of three.",
    specs: {
      "Diameter": "9.8\" (25cm) x 8.6\" (22cm) Height",
      "Cord Length": "6 ft (180cm) Adjustable braided textile cord",
      "Socket": "Standard E26/E27 Base (Dimmable Edison LED bulb included)"
    },
    images: [
      "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=900&q=80",
      "https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?auto=format&fit=crop&w=900&q=80"
    ],
    tags: ["pendant", "glass", "amber", "lighting", "ceiling"],
    variants: {
      colors: ["Smoked Amber", "Opal Frosted", "Bottle Green"]
    }
  },
  {
    id: "df_021",
    sku: "DF-CER-21",
    name: "Sumi Stoneware Serving Platter & Dip Bowls",
    category: "Artisan Drinkware",
    categorySlug: "artisan-drinkware",
    price: 72.00,
    originalPrice: 72.00,
    discountPrice: 72.00,
    stock: 24,
    lowStockThreshold: 8,
    rating: 4.7,
    reviewCount: 22,
    status: "active",
    featured: false,
    bestseller: false,
    isNew: false,
    shortDescription: "Matte textured serving board with three nesting dipping ramekins for entertaining.",
    description: "Crafted from durable iron-rich stoneware fired at 1280°C. Perfect for presenting charcuterie, artisan breads, and savory sauces with minimalist elegance.",
    specs: {
      "Board Size": "16\" x 9.5\"",
      "Bowls": "3 Nesting 3.5\" ramekins included",
      "Dishwasher & Microwave": "100% Safe"
    },
    images: [
      "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=900&q=80",
      "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=900&q=80"
    ],
    tags: ["stoneware", "serving", "kitchen", "entertaining"],
    variants: {
      colors: ["Basalt Black", "Chalk White"]
    }
  },
  {
    id: "df_022",
    sku: "DF-COM-22",
    name: "Organic French Terry Lounge Kimono",
    category: "Rest & Wellness",
    categorySlug: "rest-wellness",
    price: 128.00,
    originalPrice: 150.00,
    discountPrice: 128.00,
    stock: 30,
    lowStockThreshold: 10,
    rating: 4.9,
    reviewCount: 48,
    status: "active",
    featured: true,
    bestseller: true,
    isNew: true,
    shortDescription: "Heavyweight 380 GSM organic cotton robe with deep pockets and relaxed drop-shoulder cut.",
    description: "The ultimate lounge layer. Made from GOTS-certified combed organic French terry cotton, this kimono-inspired robe offers plush towel-like comfort after a bath or on lazy weekend mornings.",
    specs: {
      "Material": "100% GOTS Certified Organic Turkish Cotton",
      "Weight": "380 GSM Heavyweight Terry",
      "Features": "Wide kimono sleeves, detachable belt, side pockets"
    },
    images: [
      "https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?auto=format&fit=crop&w=900&q=80",
      "https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=900&q=80"
    ],
    tags: ["robe", "loungewear", "cotton", "wellness", "kimono"],
    variants: {
      colors: ["Raw Ecru", "Washed Slate", "Dune Taupe"],
      sizes: ["S/M (Relaxed)", "L/XL (Oversized)"]
    }
  }
];

const SEED_COUPONS = [
  {
    id: "cp_01",
    code: "WELCOME10",
    discountType: "percentage",
    discountValue: 10,
    minOrder: 50,
    usageLimit: 500,
    usedCount: 142,
    expiryDate: "2027-12-31",
    active: true,
    description: "10% off on your first order over $50"
  },
  {
    id: "cp_02",
    code: "DEEPFEEL20",
    discountType: "percentage",
    discountValue: 20,
    minOrder: 150,
    usageLimit: 200,
    usedCount: 88,
    expiryDate: "2027-12-31",
    active: true,
    description: "20% VIP discount on orders over $150"
  },
  {
    id: "cp_03",
    code: "COMFORT15",
    discountType: "fixed",
    discountValue: 15,
    minOrder: 80,
    usageLimit: 300,
    usedCount: 65,
    expiryDate: "2027-12-31",
    active: true,
    description: "$15 off on comfort essentials over $80"
  },
  {
    id: "cp_04",
    code: "FREESHIP",
    discountType: "fixed",
    discountValue: 10,
    minOrder: 40,
    usageLimit: 1000,
    usedCount: 231,
    expiryDate: "2027-12-31",
    active: true,
    description: "Free shipping equivalent ($10 off)"
  }
];

const SEED_USERS = [
  {
    id: "usr_admin",
    name: "DeepFeel Store Admin",
    email: "admin@deepfeel.com",
    password: "admin123", // For demo purposes
    role: "admin",
    createdAt: "2025-01-10T09:00:00.000Z"
  },
  {
    id: "usr_customer_1",
    name: "Elena Vance",
    email: "elena.vance@example.com",
    password: "password123",
    role: "customer",
    phone: "+1 (555) 234-8901",
    address: {
      street: "742 Evergreen Terrace",
      city: "Portland",
      state: "Oregon",
      zip: "97201",
      country: "United States"
    },
    ordersCount: 4,
    totalSpent: 642.00,
    createdAt: "2025-02-14T14:20:00.000Z"
  },
  {
    id: "usr_customer_2",
    name: "Julian Thorne",
    email: "julian.t@example.com",
    password: "password123",
    role: "customer",
    phone: "+1 (555) 887-3214",
    address: {
      street: "1204 Pine Street, Apt 4B",
      city: "Seattle",
      state: "Washington",
      zip: "98101",
      country: "United States"
    },
    ordersCount: 2,
    totalSpent: 308.00,
    createdAt: "2025-03-01T11:15:00.000Z"
  },
  {
    id: "usr_customer_3",
    name: "Maya Lin",
    email: "maya.lin@example.com",
    password: "password123",
    role: "customer",
    phone: "+1 (555) 459-7812",
    address: {
      street: "88 Market St, Suite 500",
      city: "San Francisco",
      state: "California",
      zip: "94105",
      country: "United States"
    },
    ordersCount: 1,
    totalSpent: 185.00,
    createdAt: "2025-04-12T16:40:00.000Z"
  }
];

const SEED_ORDERS = [
  {
    id: "DF-84920",
    userId: "usr_customer_1",
    customer: {
      name: "Elena Vance",
      email: "elena.vance@example.com",
      phone: "+1 (555) 234-8901",
      address: "742 Evergreen Terrace, Portland, Oregon, 97201, United States"
    },
    items: [
      {
        productId: "df_001",
        name: "Merino Wool Weighted Throw",
        price: 185.00,
        quantity: 1,
        image: "https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?auto=format&fit=crop&w=900&q=80",
        variant: "Oatmeal Heather"
      },
      {
        productId: "df_005",
        name: "Acoustic Ceramic Ultrasonic Diffuser",
        price: 88.00,
        quantity: 1,
        image: "https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?auto=format&fit=crop&w=900&q=80",
        variant: "Terracotta Clay"
      }
    ],
    subtotal: 273.00,
    discount: 27.30,
    couponCode: "WELCOME10",
    shipping: 0.00,
    tax: 19.66,
    total: 265.36,
    status: "Delivered",
    paymentMethod: "Credit Card (Visa ending in 4242)",
    paymentStatus: "Paid",
    createdAt: "2026-08-18T10:30:00.000Z",
    timeline: [
      { status: "Order Placed", date: "2026-08-18 10:30 AM", completed: true },
      { status: "Payment Confirmed", date: "2026-08-18 10:31 AM", completed: true },
      { status: "Processing & Quality Check", date: "2026-08-19 09:15 AM", completed: true },
      { status: "Dispatched via FedEx (Tracking #94001289)", date: "2026-08-20 02:00 PM", completed: true },
      { status: "Delivered to Front Door", date: "2026-08-23 11:45 AM", completed: true }
    ]
  },
  {
    id: "DF-84921",
    userId: "usr_customer_2",
    customer: {
      name: "Julian Thorne",
      email: "julian.t@example.com",
      phone: "+1 (555) 887-3214",
      address: "1204 Pine Street, Apt 4B, Seattle, Washington, 98101, United States"
    },
    items: [
      {
        productId: "df_003",
        name: "Aura Tactile Dimmable Desk Lamp",
        price: 145.00,
        quantity: 1,
        image: "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=900&q=80",
        variant: "Anodized Bronze"
      },
      {
        productId: "df_004",
        name: "Full-Grain Saddle Leather Desk Mat",
        price: 92.00,
        quantity: 1,
        image: "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?auto=format&fit=crop&w=900&q=80",
        variant: "Chestnut Cognac"
      }
    ],
    subtotal: 237.00,
    discount: 47.40,
    couponCode: "DEEPFEEL20",
    shipping: 0.00,
    tax: 15.17,
    total: 204.77,
    status: "Shipped",
    paymentMethod: "Credit Card (Mastercard ending in 8912)",
    paymentStatus: "Paid",
    createdAt: "2026-08-27T14:15:00.000Z",
    timeline: [
      { status: "Order Placed", date: "2026-08-27 02:15 PM", completed: true },
      { status: "Payment Confirmed", date: "2026-08-27 02:16 PM", completed: true },
      { status: "Processing in Portland Studio", date: "2026-08-28 08:00 AM", completed: true },
      { status: "In Transit via UPS Express (#1Z99999)", date: "2026-08-29 03:30 PM", completed: true },
      { status: "Out for Delivery", date: "2026-09-01 (Estimated)", completed: false }
    ]
  },
  {
    id: "DF-84922",
    userId: "usr_customer_3",
    customer: {
      name: "Maya Lin",
      email: "maya.lin@example.com",
      phone: "+1 (555) 459-7812",
      address: "88 Market St, Suite 500, San Francisco, California, 94105, United States"
    },
    items: [
      {
        productId: "df_002",
        name: "Komorebi Ceramic Pour-Over Set",
        price: 68.00,
        quantity: 1,
        image: "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=900&q=80",
        variant: "Raw Sandstone"
      },
      {
        productId: "df_007",
        name: "Soren Double-Wall Borosilicate Tumbler",
        price: 36.00,
        quantity: 2,
        image: "https://images.unsplash.com/photo-1517256064527-09c73fc73e38?auto=format&fit=crop&w=900&q=80",
        variant: "Smoke Grey"
      }
    ],
    subtotal: 140.00,
    discount: 10.00,
    couponCode: "FREESHIP",
    shipping: 0.00,
    tax: 10.40,
    total: 140.40,
    status: "Processing",
    paymentMethod: "Apple Pay / Credit Card",
    paymentStatus: "Paid",
    createdAt: "2026-08-30T09:45:00.000Z",
    timeline: [
      { status: "Order Placed", date: "2026-08-30 09:45 AM", completed: true },
      { status: "Payment Confirmed", date: "2026-08-30 09:46 AM", completed: true },
      { status: "Order Sent to Packing Station", date: "2026-08-31 08:30 AM", completed: true },
      { status: "Handed over to Courier", date: "Pending", completed: false },
      { status: "Delivered", date: "Pending", completed: false }
    ]
  },
  {
    id: "DF-84923",
    userId: "usr_customer_1",
    customer: {
      name: "Elena Vance",
      email: "elena.vance@example.com",
      phone: "+1 (555) 234-8901",
      address: "742 Evergreen Terrace, Portland, Oregon, 97201, United States"
    },
    items: [
      {
        productId: "df_022",
        name: "Organic French Terry Lounge Kimono",
        price: 128.00,
        quantity: 1,
        image: "https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?auto=format&fit=crop&w=900&q=80",
        variant: "Raw Ecru / S/M"
      }
    ],
    subtotal: 128.00,
    discount: 0.00,
    couponCode: "",
    shipping: 0.00,
    tax: 10.24,
    total: 138.24,
    status: "Pending",
    paymentMethod: "Cash on Delivery",
    paymentStatus: "Pending on Delivery",
    createdAt: "2026-08-31T18:20:00.000Z",
    timeline: [
      { status: "Order Placed via Cash on Delivery", date: "2026-08-31 06:20 PM", completed: true },
      { status: "Awaiting Verification", date: "2026-08-31 06:20 PM", completed: false },
      { status: "Processing", date: "Pending", completed: false },
      { status: "Dispatched", date: "Pending", completed: false },
      { status: "Delivered", date: "Pending", completed: false }
    ]
  }
];

const SEED_SETTINGS = {
  storeName: "DeepFeel",
  storeTagline: "Designed to Feel Different.",
  storeEmail: "support@deepfeel.com",
  storePhone: "+1 (800) 555-3337",
  storeAddress: "1024 Hawthorne Blvd, Suite 400, Portland, OR 97214",
  currency: "USD",
  currencySymbol: "$",
  taxRate: 8.0, // 8%
  freeShippingThreshold: 100.00,
  flatShippingRate: 10.00,
  expressShippingRate: 25.00,
  announcementText: "Complimentary worldwide shipping on all orders over $100 — Consciously Crafted",
  enableReviews: true,
  enableWishlist: true
};

const SEED_REVIEWS = [
  {
    productId: "df_001",
    author: "Claire D.",
    rating: 5,
    date: "August 14, 2026",
    title: "The best purchase I have made for my bedroom",
    content: "The weight distribution is astonishingly even. No hot spots or clumps. The merino wool is so soft to the touch and the oatmeal color matches my minimalist bedroom aesthetic flawlessly.",
    verified: true
  },
  {
    productId: "df_001",
    author: "Marcus K.",
    rating: 5,
    date: "July 28, 2026",
    title: "Helped immensely with anxiety and restless sleep",
    content: "I was skeptical about weighted blankets until I tried this. The chunky knit lets air flow freely while keeping you grounded. Truly feels like a luxury hotel piece.",
    verified: true
  },
  {
    productId: "df_002",
    author: "Siddharth N.",
    rating: 5,
    date: "August 02, 2026",
    title: "A work of art that makes delicious pour-overs",
    content: "The texture of the raw sandstone ceramic dripper feels divine in the hand. Flow rate is dialed in perfectly for single-origin beans. The walnut collar completes the ritual.",
    verified: true
  },
  {
    productId: "df_003",
    author: "Liam O.",
    rating: 5,
    date: "August 19, 2026",
    title: "Subtle, stunning, and perfectly dimmable",
    content: "The stepless capacitive brass dimmer is so satisfying to touch. Casts a warm, amber downward pool of light that makes late night working a peaceful joy.",
    verified: true
  }
];
