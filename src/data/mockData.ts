import type { Category, Product, StoreSettings } from '../types';


export const INITIAL_CATEGORIES: Category[] = [
  {
    id: 'cat-1',
    name_fr: 'Fours Encastrables',
    name_ar: 'أفران مدمجة',
    name_en: 'Built-in Ovens',
    slug: 'fours',
    icon: 'Flame',
    image_url: 'https://images.unsplash.com/photo-1590794056226-79ef3a8147e1?auto=format&fit=crop&w=600&q=80',
    description_fr: 'Fours ventilés, multifonctions et pyrolyse pour des cuissons parfaites',
    description_ar: 'أفران كهربائية وغازية متعددة الوظائف بأحدث تقنيات الطهي',
    description_en: 'Convection and multifunction ovens for chef-level baking',
    display_order: 1,
    is_active: true
  },
  {
    id: 'cat-2',
    name_fr: 'Plaques de Cuisson',
    name_ar: 'لوحات الطهي',
    name_en: 'Cooktops & Hobs',
    slug: 'plaques',
    icon: 'CookingPot',
    image_url: 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=600&q=80',
    description_fr: 'Plaques à induction, vitrocéramique et gaz en verre trempé',
    description_ar: 'لوحات طهي تعمل بالغاز، الحث الكهرومغناطيسي والسيراميك الزجاجي',
    description_en: 'Gas, induction, and ceramic hobs with precision heat control',
    display_order: 2,
    is_active: true
  },
  {
    id: 'cat-3',
    name_fr: 'Hottes Aspirantes',
    name_ar: 'شفاطات المطبخ',
    name_en: 'Range Hoods',
    slug: 'hottes',
    icon: 'Wind',
    image_url: 'https://images.unsplash.com/photo-1588854337236-6889d631faa8?auto=format&fit=crop&w=600&q=80',
    description_fr: 'Hottes décoratives, murales et inclinées ultra-silencieuses',
    description_ar: 'شفاطات هواء ديكورية جدارية قوية وخافتة الصوت لمطبخ نظيف',
    description_en: 'High-performance quiet wall and island range hoods',
    display_order: 3,
    is_active: true
  },
  {
    id: 'cat-4',
    name_fr: 'Micro-ondes',
    name_ar: 'أفران ميكروويف',
    name_en: 'Microwaves',
    slug: 'micro-ondes',
    icon: 'Zap',
    image_url: 'https://images.unsplash.com/photo-1574269909862-7e1d70bb8078?auto=format&fit=crop&w=600&q=80',
    description_fr: 'Micro-ondes grill et combinés encastrables ou posables',
    description_ar: 'أفران ميكروويف مع شواية لتسخين وطهي سريع وصحي',
    description_en: 'Grill and convection microwaves for fast healthy cooking',
    display_order: 4,
    is_active: true
  },
  {
    id: 'cat-5',
    name_fr: 'Machines à Café',
    name_ar: 'آلات القهوة والإسبريسو',
    name_en: 'Coffee Machines',
    slug: 'machines-a-cafe',
    icon: 'Coffee',
    image_url: 'https://images.unsplash.com/photo-1517668808822-9ebb02f2a0e6?auto=format&fit=crop&w=600&q=80',
    description_fr: 'Machines à espresso manuelles, à grains et capsules haut de gamme',
    description_ar: 'ماكينات تحضير القهوة والإسبريسو الإيطالية ومطاحن البن',
    description_en: 'Bean-to-cup and espresso machines for true coffee lovers',
    display_order: 5,
    is_active: true
  },
  {
    id: 'cat-6',
    name_fr: 'Mixeurs & Robots',
    name_ar: 'خلاطات ومحضرات طعام',
    name_en: 'Blenders & Food Processors',
    slug: 'mixeurs-robots',
    icon: 'Disc',
    image_url: 'https://images.unsplash.com/photo-1570222094114-d054a817e56b?auto=format&fit=crop&w=600&q=80',
    description_fr: 'Robots pâtissiers, mixeurs plongeants et blenders haute puissance',
    description_ar: 'عجانات وخلاطات قوية متعددة السرعات لتحضير أشهى الأطباق',
    description_en: 'Stand mixers, high-speed blenders and multi-cookers',
    display_order: 6,
    is_active: true
  },
  {
    id: 'cat-7',
    name_fr: 'Réfrigérateurs',
    name_ar: 'ثلاجات ومجمدات',
    name_en: 'Refrigerators',
    slug: 'refrigerateurs',
    icon: 'Snowflake',
    image_url: 'https://images.unsplash.com/photo-1584992236310-6edddc08acff?auto=format&fit=crop&w=600&q=80',
    description_fr: 'Réfrigérateurs No Frost, combinés et side-by-side spacieux',
    description_ar: 'ثلاجات بتكنولوجيا نوفروست ومساحات حفظ ذكية موفرة للطاقة',
    description_en: 'No-Frost energy-efficient smart inverter refrigerators',
    display_order: 7,
    is_active: true
  }
];

export const INITIAL_PRODUCTS: Product[] = [
  {
    id: 'prod-1',
    category_id: 'cat-1',
    category_slug: 'fours',
    name: 'Four Encastrable Électrique 65L Inox Multi-Fonctions',
    name_ar: 'فرن مدمج كهربائي 65 لتر إينوكس متعدد الوظائف',
    name_en: 'Built-in Electric Oven 65L Stainless Steel Multi-Function',
    slug: 'four-encastrable-electrique-65l-inox',
    description: 'Four encastrable de haute qualité avec 8 modes de cuisson, technologie de chaleur tournante pulsée, porte froide triple vitrage et cavité émaillée facile à nettoyer. Idéal pour la cuisine quotidienne et les grands repas de famille.',
    description_ar: 'فرن كهربائي عصري بسعة 65 لتر مصنوع من الستانلس ستيل المقاوم للصدأ، مزود بـ 8 برامج طهي وتقنية التوزيع الحراري المروحي مع باب ثلاثي الزجاج عازل للحرارة.',
    description_en: 'High-quality built-in convection oven with 8 cooking modes, triple-glazed cool door, and catalytic self-cleaning cavity.',
    specifications: {
      'Capacité': '65 Litres',
      'Puissance': '2800 W',
      'Type de chaleur': 'Chaleur tournante pulsée',
      'Matériau': 'Inox anti-traces & Verre noir',
      'Nombre de programmes': '8 programmes',
      'Nettoyage': 'Émail Catalytique',
      'Dimensions (L x H x P)': '59.5 x 59.5 x 57.5 cm',
      'Garantie': '24 Mois'
    },
    specifications_ar: {
      'السعة': '65 لتر',
      'القوة الكهربائية': '2800 واط',
      'نوع التوزيع الحراري': 'مروحة حرارية دورانية',
      'المادة المصنعة': 'إينوكس مقاوم للبصمات وزجاج أسود',
      'عدد البرامج': '8 برامج طهي',
      'طريقة التنظيف': 'مينا كتاليتي ذاتي التنظيف',
      'الأبعاد (عرض x ارتفاع x عمق)': '59.5 × 59.5 × 57.5 سم',
      'مدة الضمان': '24 شهراً'
    },
    specifications_en: {
      'Capacity': '65 Liters',
      'Power': '2800 W',
      'Heat Type': 'Forced Fan Convection',
      'Material': 'Anti-fingerprint Inox & Black Glass',
      'Cooking Programs': '8 Programs',
      'Cleaning Type': 'Catalytic Enamel',
      'Dimensions (W x H x D)': '59.5 x 59.5 x 57.5 cm',
      'Warranty': '24 Months'
    },
    brand: 'BEKO',
    price: 49500,
    original_price: 58000,
    cost_price: 38000,
    supplier: 'Grossiste El-Eulma (Lot 14)',
    images: [
      'https://images.unsplash.com/photo-1590794056226-79ef3a8147e1?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=800&q=80'
    ],
    stock: 7,
    is_active: true,
    is_featured: true,
    rating: 4.8,
    reviews_count: 19
  },
  {
    id: 'prod-2',
    category_id: 'cat-1',
    category_slug: 'fours',
    name: 'Four Encastrable Pyrolyse Premium 71L Digital Touch',
    name_ar: 'فرن مدمج رقمي بنظام التنظيف الذاتي بيروليز 71 لتر',
    name_en: 'Premium Pyrolytic Built-in Oven 71L Digital Touch',
    slug: 'four-encastrable-pyrolyse-premium-71l',
    description: 'Le summum de la cuisson moderne avec autonettoyage par pyrolyse à 500°C. Écran tactile intuitif, sonde de cuisson intégrée, rails télescopiques et éclairage halogène.',
    description_ar: 'فرن فاخر بسعة 71 لتر يتميز بخاصية التنظيف الذاتي بالحرارة العالية، شاشة لمس ذكية وبرامج طهي تلقائية للحلويات واللحوم.',
    description_en: 'Top-of-the-line built-in oven with 500°C pyrolytic self-cleaning, responsive touchscreen, and integrated meat probe.',
    specifications: {
      'Capacité': '71 Litres',
      'Puissance': '3400 W',
      'Système': 'Pyrolyse auto-nettoyant',
      'Contrôle': 'Écran Digital Tactile',
      'Rails': 'Télescopiques 2 niveaux',
      'Classe énergétique': 'A+',
      'Garantie': '24 Mois'
    },
    specifications_ar: {
      'السعة': '71 لتر',
      'القوة الكهربائية': '3400 واط',
      'نظام التنظيف': 'بيروليز حراري ذاتي التنظيف',
      'لوحة التحكم': 'شاشة رقمية تعمل باللمس',
      'المسارات الداخلية': 'سكك تلسكوبية مستويين',
      'كفاءة الطاقة': 'A+',
      'مدة الضمان': '24 شهراً'
    },
    specifications_en: {
      'Capacity': '71 Liters',
      'Power': '3400 W',
      'Cleaning System': 'Pyrolytic Self-Cleaning',
      'Control Panel': 'Digital Touch Screen',
      'Rails': '2-Level Telescopic Rails',
      'Energy Rating': 'A+',
      'Warranty': '24 Months'
    },
    brand: 'BOSCH',
    price: 84000,
    original_price: 95000,
    images: [
      'https://images.unsplash.com/photo-1584992236310-6edddc08acff?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1590794056226-79ef3a8147e1?auto=format&fit=crop&w=800&q=80'
    ],
    stock: 3,
    is_active: true,
    is_featured: true,
    rating: 4.9,
    reviews_count: 24
  },
  {
    id: 'prod-3',
    category_id: 'cat-2',
    category_slug: 'plaques',
    name: 'Plaque de Cuisson Gaz 4 Feux Verre Trempé Noir 60cm',
    name_ar: 'لوحة طهي غاز 4 شعلات زجاج أسود مقسى 60 سم',
    name_en: '4-Burner Tempered Glass Gas Cooktop 60cm Black',
    slug: 'plaque-cuisson-gaz-4-feux-verre-noir',
    description: 'Design contemporain et élégance absolue. Plaque à gaz 4 feux en verre trempé renforcé haute résistance. Allumage électronique à une main intégré aux manettes et sécurité thermocouple coupe-gaz.',
    description_ar: 'لوحة غاز عصرية من الزجاج الأسود المقاوم للخدش والحرارة مع 4 شعلات عالية الكفاءة بما فيها شعلة ووك سريعة ونظام أمان أوتوماتيكي لقطع الغاز.',
    description_en: 'Elegant 4-burner tempered black glass gas hob with cast iron pan supports and thermocouple safety cut-off.',
    specifications: {
      'Largeur': '60 cm',
      'Nombre de foyers': '4 feux gaz dont 1 Wok',
      'Surface': 'Verre trempé thermique 8mm',
      'Grilles': 'Fonte épaisse haute stabilité',
      'Sécurité': 'Thermocouple (coupe-gaz automatique)',
      'Allumage': 'Électronique 1 main',
      'Garantie': '12 Mois'
    },
    specifications_ar: {
      'العرض': '60 سم',
      'عدد الشعلات': '4 شعلات غاز مع شعلة ووك قوية',
      'سطح اللوحة': 'زجاج حراري مقسى 8 مم',
      'الشبكات': 'حديد زهر ثقيل فائق الثبات',
      'نظام الأمان': 'صمام ثرموكوبل لقطع الغاز التلقائي',
      'نظام الإشعال': 'إشعال إلكتروني مدمج بيد واحدة',
      'مدة الضمان': '12 شهراً'
    },
    specifications_en: {
      'Width': '60 cm',
      'Burners': '4 Gas burners including 1 Wok',
      'Surface': '8mm Thermal Tempered Glass',
      'Pan Supports': 'Heavy-duty Cast Iron',
      'Safety': 'Thermocouple flame failure safety',
      'Ignition': 'One-hand electric ignition',
      'Warranty': '12 Months'
    },
    brand: 'BRANDT',
    price: 33500,
    original_price: 39000,
    images: [
      'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=800&q=80'
    ],
    stock: 12,
    is_active: true,
    is_featured: true,
    rating: 4.7,
    reviews_count: 32
  },
  {
    id: 'prod-4',
    category_id: 'cat-2',
    category_slug: 'plaques',
    name: 'Plaque Induction 4 Foyers Booster & Minuterie Individuelle',
    name_ar: 'لوحة طهي كهرومغناطيسية (إندكشن) 4 شعلات بنظام التسخين السريع',
    name_en: '4-Zone Induction Hob with Booster & Individual Timers',
    slug: 'plaque-induction-4-foyers-booster',
    description: 'Cuisson ultra-rapide et sécurisée avec la technologie induction. 9 niveaux de puissance par zone, fonction Booster sur chaque foyer, minuterie individuelle et sécurité enfant.',
    description_ar: 'لوحة حث كهرومغناطيسي سريعة وآمنة وموفرة للكهرباء مع ميزة Booster لغليان فوري ونظام قفل للأطفال.',
    description_en: 'Fast and energy-efficient 4-zone induction cooktop with touch slider controls and instant power boosters.',
    specifications: {
      'Foyers': '4 zones à induction',
      'Puissance totale': '7200 W',
      'Commandes': 'Sensitives Slider',
      'Fonction': 'Booster ultra-rapide + Minuterie',
      'Sécurité': 'Anti-débordement & Témoin chaleur résiduelle',
      'Garantie': '24 Mois'
    },
    specifications_ar: {
      'الشعلات': '4 مناطق طهي بالحث الكهرومغناطيسي',
      'القوة الإجمالية': '7200 واط',
      'التحكم': 'أزرار لمس منزلقة Slider',
      'الوظائف الخاصة': 'خاصية Booster للتسخين الفوري + مؤقت زمني',
      'أنظمة الأمان': 'حماية من الفيضان ومؤشر الحرارة المتبقية',
      'مدة الضمان': '24 شهراً'
    },
    specifications_en: {
      'Cooking Zones': '4 Induction Zones',
      'Total Power': '7200 W',
      'Controls': 'Touch Slider Controls',
      'Functions': 'Instant Booster + Individual Timers',
      'Safety': 'Overflow cut-off & Residual heat indicator',
      'Warranty': '24 Months'
    },
    brand: 'WHIRLPOOL',
    price: 62000,
    original_price: 69000,
    images: [
      'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=800&q=80'
    ],
    stock: 4,
    is_active: true,
    is_featured: false,
    rating: 4.9,
    reviews_count: 14
  },
  {
    id: 'prod-5',
    category_id: 'cat-3',
    category_slug: 'hottes',
    name: 'Hotte Aspirante Inclinée 90cm Verre Noir & Inox 750 m³/h',
    name_ar: 'شفاط مطبخ ديكوري مائل 90 سم زجاج أسود بقوة شفط 750 م³/ساعة',
    name_en: 'Angled Wall Range Hood 90cm Black Glass 750 m³/h',
    slug: 'hotte-aspirante-inclinee-90cm-noir',
    description: 'Hotte murale inclinée offrant une aspiration puissante et un dégagement visuel optimal au-dessus de la table de cuisson. Moteur silencieux, éclairage double LED et filtres lavables en lave-vaisselle.',
    description_ar: 'شفاط حائطي مائل بتصميم حديث فاخر، يمنحك راحة قصوى أثناء الطهي مع قوة سحب هواء فائقة وإضاءة LED ساطعة وموفرة.',
    description_en: 'Sleek angled glass wall range hood with high suction airflow 750 m³/h and ultra-quiet motor.',
    specifications: {
      'Débit d\'aspiration': '750 m³/h',
      'Largeur': '90 cm',
      'Niveaux de vitesse': '3 vitesses + Boost',
      'Niveau sonore': '49 - 58 dB',
      'Éclairage': '2 spots LED économiques',
      'Filtres': 'Aluminium lavable + Filtre à charbon inclus',
      'Garantie': '24 Mois'
    },
    specifications_ar: {
      'قوة الشفط': '750 م³/ساعة',
      'العرض': '90 سم',
      'مستويات السرعة': '3 سرعات + وضع التعزيز Boost',
      'مستوى الضجيج': '49 - 58 ديسيبل (صامت)',
      'الإضاءة': 'مصباحين LED موفرين للطاقة',
      'الفلاتر': 'ألومنيوم قابل للغسيل + فلتر كربون مدمج',
      'مدة الضمان': '24 شهراً'
    },
    specifications_en: {
      'Extraction Rate': '750 m³/h',
      'Width': '90 cm',
      'Speed Levels': '3 Speeds + Boost',
      'Noise Level': '49 - 58 dB',
      'Lighting': '2 Low-energy LED spots',
      'Filters': 'Washable Aluminium + Carbon filter included',
      'Warranty': '24 Months'
    },
    brand: 'SAMSUNG',
    price: 38000,
    original_price: 45000,
    images: [
      'https://images.unsplash.com/photo-1588854337236-6889d631faa8?auto=format&fit=crop&w=800&q=80'
    ],
    stock: 9,
    is_active: true,
    is_featured: true,
    rating: 4.8,
    reviews_count: 27
  },
  {
    id: 'prod-6',
    category_id: 'cat-4',
    category_slug: 'micro-ondes',
    name: 'Micro-ondes Grill Encastrable 25L Inox Anti-Empreinte',
    name_ar: 'ميكروويف مدمج مع شواية 25 لتر من الستانلس ستيل',
    name_en: 'Built-in Microwave with Grill 25L Anti-Fingerprint Inox',
    slug: 'micro-ondes-grill-encastrable-25l',
    description: 'Micro-ondes encastrable avec cadre d\'intégration fourni. Fonction grill 1000W pour gratiner vos plats, décongélation automatique au poids et 8 menus préprogrammés.',
    description_ar: 'ميكروويف مدمج بحجم 25 لتر مع شواية قوية، مزود ببرامج إذابة الثلج التلقائية وطلاء داخلي عالي المقاومة.',
    description_en: 'Integrated built-in 25L microwave oven with 1000W powerful quartz grill and auto defrost presets.',
    specifications: {
      'Capacité': '25 Litres',
      'Puissance micro-ondes': '900 W',
      'Puissance Grill': '1000 W',
      'Plateau tournant': '31.5 cm en verre',
      'Programmes': '8 recettes automatiques',
      'Garantie': '12 Mois'
    },
    specifications_ar: {
      'السعة': '25 لتر',
      'قوة الميكروويف': '900 واط',
      'قوة الشواية': '1000 واط',
      'الصحن الدوار': '31.5 سم زجاجي',
      'البرامج': '8 برامج طهي وإذابة تلقائية',
      'مدة الضمان': '12 شهراً'
    },
    specifications_en: {
      'Capacity': '25 Liters',
      'Microwave Power': '900 W',
      'Grill Power': '1000 W',
      'Turntable': '31.5 cm Glass Plate',
      'Preset Programs': '8 Auto Cooking Menus',
      'Warranty': '12 Months'
    },
    brand: 'LG',
    price: 36000,
    original_price: 41000,
    images: [
      'https://images.unsplash.com/photo-1574269909862-7e1d70bb8078?auto=format&fit=crop&w=800&q=80'
    ],
    stock: 6,
    is_active: true,
    is_featured: false,
    rating: 4.6,
    reviews_count: 11
  },
  {
    id: 'prod-7',
    category_id: 'cat-5',
    category_slug: 'machines-a-cafe',
    name: 'Machine Espresso Automatique avec Broyeur à Grains 15 Bars',
    name_ar: 'آلة إسبريسو أوتوماتيكية بمطحنة حبوب مدمجة ضغط 15 بار',
    name_en: 'Automatic Bean-to-Cup Espresso Machine 15 Bar',
    slug: 'machine-espresso-automatique-broyeur',
    description: 'Dégustez un espresso riche et aromatique comme chez le barista. Broyeur conique en acier inoxydable avec 13 réglages de mouture, buse vapeur pour mousse de lait onctueuse et réservoir 1.8L.',
    description_ar: 'ماكينة إسبريسو احترافية تطحن حبوب القهوة فورياً للحصول على قوام غني ورغوة كريمية مثالية، مع ذراع بخار للكابتشينو واللاتيه.',
    description_en: 'Barista-quality automatic bean-to-cup coffee machine with 15 bar pump pressure and manual milk frother.',
    specifications: {
      'Pression': '15 Bars',
      'Broyeur': 'Acier inoxydable 13 finesses',
      'Capacité réservoir eau': '1.8 Litre',
      'Buse vapeur': 'Système Cappuccino réglable',
      'Chauffe': 'Thermoblock instantané',
      'Garantie': '24 Mois'
    },
    specifications_ar: {
      'ضغط المضخة': '15 بار',
      'المطحنة': 'ستانلس ستيل مخروطي 13 درجة طحن',
      'سعة خزان الماء': '1.8 لتر',
      'ذراع البخار': 'نظام كابتشينو قابل للتعديل لرغوة الحليب',
      'نظام التسخين': 'ثيرموبلوك فوري وسريع',
      'مدة الضمان': '24 شهراً'
    },
    specifications_en: {
      'Pump Pressure': '15 Bar',
      'Grinder': 'Conical Steel with 13 grind settings',
      'Water Tank': '1.8 Liter',
      'Steam Wand': 'Adjustable Cappuccino system',
      'Heating': 'Instant Thermoblock',
      'Warranty': '24 Months'
    },
    brand: 'DELONGHI',
    price: 78000,
    original_price: 89000,
    images: [
      'https://images.unsplash.com/photo-1517668808822-9ebb02f2a0e6?auto=format&fit=crop&w=800&q=80'
    ],
    stock: 5,
    is_active: true,
    is_featured: true,
    rating: 5.0,
    reviews_count: 42
  },
  {
    id: 'prod-8',
    category_id: 'cat-6',
    category_slug: 'mixeurs-robots',
    name: 'Robot Pâtissier Multifonction 1500W Bol Inox 6.5L + Kit Pâtisserie',
    name_ar: 'عجانة ومحضر طعام احترافي 1500 واط وعاء 6.5 لتر ستانلس ستيل',
    name_en: 'Stand Mixer 1500W Stainless Steel Bowl 6.5L + Dough Hook Kit',
    slug: 'robot-patissier-multifonction-1500w',
    description: 'Le robot indispensable pour toutes vos pâtes à pain, brioches, gâteaux et crèmes. Moteur ultra puissant 1500W en cuivre pur, mouvement planétaire, 6 vitesses + pulse et accessoires métalliques robustes.',
    description_ar: 'عجانة كهربائية قوية ومثالية للعجين والحلويات والخبز المنزلي، مزودة بوعاء كبير سعة 6.5 لتر و3 ملحقات معدنية للخلط والعجن والخفق.',
    description_en: 'Heavy-duty 1500W stand mixer with 6.5L stainless steel bowl, planetary mixing action, and full baking accessory kit.',
    specifications: {
      'Puissance': '1500 Watts',
      'Capacité du bol': '6.5 Litres avec poignées',
      'Vitesses': '6 vitesses progressives + Pulse',
      'Accessoires': 'Crochet pétrisseur, Fouet, Batteur plat',
      'Corps': 'Robuste avec pieds ventouses antidérapants',
      'Garantie': '12 Mois'
    },
    specifications_ar: {
      'القوة الكهربائية': '1500 واط محرك نحاسي قوي',
      'سعة الوعاء': '6.5 لتر ستانلس ستيل مع مقابض',
      'السرعات': '6 سرعات تدريجية + نبض Pulse',
      'الملحقات': 'خطاف عجن، خفاقة بيض، مضرب تقليب',
      'الهيكل': 'ثابت مع قواعد تثبيت مانعة للانزلاق',
      'مدة الضمان': '12 شهراً'
    },
    specifications_en: {
      'Power': '1500 Watts pure copper motor',
      'Bowl Capacity': '6.5 Liters Stainless Steel with handles',
      'Speeds': '6 Speed settings + Pulse',
      'Accessories': 'Dough hook, Whisk, Flat beater',
      'Base': 'Heavy-duty with anti-slip suction feet',
      'Warranty': '12 Months'
    },
    brand: 'KENWOOD',
    price: 29500,
    original_price: 36000,
    images: [
      'https://images.unsplash.com/photo-1570222094114-d054a817e56b?auto=format&fit=crop&w=800&q=80'
    ],
    stock: 14,
    is_active: true,
    is_featured: true,
    rating: 4.8,
    reviews_count: 36
  }
];

export const INITIAL_SETTINGS: StoreSettings = {
  store_name: 'CuisineDZ Store',
  store_tagline: 'Électroménager de Cuisine & Maison en Algérie',
  store_phone: '0550 12 34 56',
  whatsapp_number: '213550123456',
  facebook_url: 'https://facebook.com/CuisineDZStore',
  instagram_url: 'https://instagram.com/cuisinedz_store',
  email: 'contact@cuisinedz.com',
  address: 'Bvd Colonel Amirouche, Alger Centre, Algérie',
  currency: 'DA',
  currency_ar: 'د.ج',
  delivery_enabled: true,
  default_delivery_fee: 600,
  free_delivery_threshold: 100000,
  announcement_text: '🚚 Livraison à domicile 69 Wilayas | Paiement en espèces à la livraison (COD) !',
  announcement_enabled: true
};
