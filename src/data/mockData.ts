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

export const INITIAL_PRODUCTS: Product[] = [];

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
