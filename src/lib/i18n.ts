import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Language } from '../types';


export interface Translations {
  // Navigation
  home: string;
  products: string;
  categories: string;
  about: string;
  contact: string;
  cart: string;
  search: string;
  searchPlaceholder: string;
  admin: string;
  appliancesTag: string;
  
  // Hero & Homepage
  heroTitle: string;
  heroSubtitle: string;
  heroCta: string;
  featuredCategories: string;
  popularProducts: string;
  specialOffers: string;
  viewAll: string;
  whyChooseUs: string;
  fastDelivery: string;
  fastDeliveryDesc: string;
  guaranteedQuality: string;
  guaranteedQualityDesc: string;
  cashOnDelivery: string;
  cashOnDeliveryDesc: string;
  customerSupport: string;
  customerSupportDesc: string;
  wilayasDelivered: string;
  originalAndGuaranteed: string;
  paymentOnReceipt: string;
  seeOffers: string;
  
  // Product details
  addToCart: string;
  orderViaWhatsApp: string;
  viewFacebook: string;
  brand: string;
  category: string;
  stock: string;
  inStock: string;
  lowStock: string;
  outOfStock: string;
  specifications: string;
  description: string;
  relatedProducts: string;
  discount: string;
  originalPrice: string;
  currentPrice: string;
  addedToCart: string;
  units: string;
  remaining: string;
  productNotFound: string;
  productNotFoundDesc: string;
  backToProducts: string;
  
  // Cart & Checkout
  myCart: string;
  cartEmpty: string;
  cartEmptyDesc: string;
  continueShopping: string;
  clearCart: string;
  subtotal: string;
  deliveryFee: string;
  freeDelivery: string;
  calculatedNextStep: string;
  free: string;
  total: string;
  proceedToCheckout: string;
  checkout: string;
  customerInfo: string;
  fullName: string;
  phone: string;
  wilaya: string;
  selectWilaya: string;
  commune: string;
  selectCommune: string;
  deliveryDestinationType: string;
  deliverToHome: string;
  deliverToHomeDesc: string;
  deliverToOffice: string;
  deliverToOfficeDesc: string;
  officeDeliveryNotice: string;
  address: string;
  addressPlaceholder: string;
  orderNotes: string;
  orderNotesPlaceholder: string;
  paymentMethod: string;
  codDescription: string;
  deliveryStepDesc: string;
  placeOrder: string;
  placingOrder: string;
  orderSummary: string;
  item: string;
  items: string;
  quantity: string;
  remove: string;
  
  // Order Confirmation
  orderSuccessTitle: string;
  orderSuccessSubtitle: string;
  orderNumber: string;
  orderConfirmationMessage: string;
  backToHome: string;
  printReceipt: string;
  deliveryLocation: string;
  orderedItems: string;
  orderNotFound: string;
  orderNotFoundDesc: string;
  whatsAppHelp: string;
  
  // Filters & Sorting
  filters: string;
  allCategories: string;
  allBrands: string;
  applyFilters: string;
  noProductsTryAgain: string;
  priceRange: string;
  minPrice: string;
  maxPrice: string;
  sortBy: string;
  sortFeatured: string;
  sortPriceAsc: string;
  sortPriceDesc: string;
  sortNewest: string;
  noProductsFound: string;
  clearFilters: string;
  
  // Footer
  allRightsReserved: string;
  algeria58Wilayas: string;
  
  // Admin & Dashboard
  dashboard: string;
  orders: string;
  stockManagement: string;
  settings: string;
  logout: string;
  login: string;
  email: string;
  password: string;
  totalRevenue: string;
  totalOrders: string;
  pendingOrders: string;
  lowStockAlerts: string;
  status: string;
  statusPending: string;
  statusConfirmed: string;
  statusPreparing: string;
  statusShipped: string;
  statusDelivered: string;
  statusCancelled: string;
  actions: string;
  save: string;
  cancel: string;
  delete: string;
  edit: string;
  addNewProduct: string;
  productName: string;
  productPrice: string;
  productOriginalPrice: string;
  productStock: string;
  productImages: string;
  productCategory: string;
  productDescription: string;
  productSpecs: string;
  isFeatured: string;
  isActive: string;
  storeSettingsTitle: string;
  storeName: string;
  storePhone: string;
  whatsappNumber: string;
  facebookUrl: string;
  instagramUrl: string;
  storeAddress: string;
  enableDeliveryFee: string;
  enableDeliveryFeeDesc: string;
  defaultDeliveryFee: string;
  currency: string;
}

const translations: Record<Language, Translations> = {
  fr: {
    home: 'Accueil',
    products: 'Produits',
    categories: 'Catégories',
    about: 'À propos',
    contact: 'Contact',
    cart: 'Panier',
    search: 'Recherche',
    searchPlaceholder: 'Rechercher un four, une plaque, une hotte...',
    admin: 'Espace Vendeur',
    appliancesTag: 'Électroménager & Cuisine',
    
    heroTitle: 'Équipez votre cuisine avec style & qualité',
    heroSubtitle: 'Le spécialiste n°1 des appareils électroménagers encastrables et de cuisine en Algérie. Qualité garantie, prix imbattables et livraison 69 wilayas.',
    heroCta: 'Découvrir le catalogue',
    featuredCategories: 'Nos Catégories',
    popularProducts: 'Produits Populaires',
    specialOffers: 'Offres Spéciales & Promotions',
    viewAll: 'Voir tout',
    whyChooseUs: 'Pourquoi nous choisir ?',
    fastDelivery: 'Livraison Rapide',
    fastDeliveryDesc: 'Livraison sécurisée partout en Algérie à domicile',
    guaranteedQuality: 'Garantie & Authenticité',
    guaranteedQualityDesc: 'Produits 100% originaux avec garantie constructeur',
    cashOnDelivery: 'Paiement à la livraison',
    cashOnDeliveryDesc: 'Payez en toute sécurité à la réception de votre colis',
    customerSupport: 'Conseils d\'experts',
    customerSupportDesc: 'Une équipe disponible 7j/7 pour vous orienter',
    wilayasDelivered: 'Wilayas Livrées',
    originalAndGuaranteed: '100% Original & Garanti',
    paymentOnReceipt: 'Paiement Réception',
    seeOffers: 'Voir offres',
    
    addToCart: 'Ajouter au panier',
    orderViaWhatsApp: 'Commander via WhatsApp',
    viewFacebook: 'Voir sur Facebook',
    brand: 'Marque',
    category: 'Catégorie',
    stock: 'Stock',
    inStock: 'En stock',
    lowStock: 'Stock limité',
    outOfStock: 'Rupture de stock',
    specifications: 'Caractéristiques techniques',
    description: 'Description du produit',
    relatedProducts: 'Produits similaires',
    discount: 'Remise',
    originalPrice: 'Prix initial',
    currentPrice: 'Prix promo',
    addedToCart: 'Produit ajouté au panier avec succès !',
    units: 'unités',
    remaining: 'restants',
    productNotFound: 'Produit non trouvé',
    productNotFoundDesc: 'Le produit recherché n\'existe pas ou n\'est plus disponible.',
    backToProducts: 'Retour aux produits',
    
    myCart: 'Mon Panier',
    cartEmpty: 'Votre panier est vide',
    cartEmptyDesc: 'Découvrez nos offres et équipez votre cuisine dès aujourd\'hui !',
    continueShopping: 'Continuer mes achats',
    clearCart: 'Vider le panier',
    subtotal: 'Sous-total',
    deliveryFee: 'Frais de livraison',
    freeDelivery: 'Gratuite',
    calculatedNextStep: 'Calculé à l\'étape suivante',
    free: 'Gratuit',
    total: 'Total à payer',
    proceedToCheckout: 'Passer la commande',
    checkout: 'Finaliser la commande',
    customerInfo: 'Informations de livraison',
    fullName: 'Nom & Prénom',
    phone: 'Numéro de téléphone',
    wilaya: 'Wilaya',
    selectWilaya: 'Sélectionnez votre wilaya',
    commune: 'Commune',
    selectCommune: 'Sélectionnez votre commune',
    deliveryDestinationType: 'Mode de réception du colis',
    deliverToHome: 'À Domicile (Maison)',
    deliverToHomeDesc: 'Livraison directe à votre porte / adresse',
    deliverToOffice: 'Au Bureau / Stop-Desk (Agence)',
    deliverToOfficeDesc: 'Récupération au bureau de livraison le plus proche',
    officeDeliveryNotice: 'Votre colis sera acheminé au bureau / stop-desk de livraison de votre commune. Vous recevrez un appel ou SMS pour le récupérer muni de votre pièce d\'identité.',
    address: 'Adresse de livraison exacte',
    addressPlaceholder: 'Rue, N° de maison, Bâtiment...',
    orderNotes: 'Remarques (Optionnel)',
    orderNotesPlaceholder: 'Ex: Appeler avant d\'arriver, livraison après 16h...',
    paymentMethod: 'Mode de paiement',
    codDescription: 'Paiement en espèces à la livraison (Cash on Delivery). Vous ne payez qu\'à la réception et vérification de votre produit.',
    deliveryStepDesc: 'Paiement en espèces à la livraison après vérification',
    placeOrder: 'Confirmer la commande',
    placingOrder: 'Traitement de votre commande...',
    orderSummary: 'Récapitulatif de commande',
    item: 'article',
    items: 'articles',
    quantity: 'Quantité',
    remove: 'Supprimer',
    
    orderSuccessTitle: 'Commande Confirmée !',
    orderSuccessSubtitle: 'Merci pour votre confiance. Notre équipe vous appellera dans les plus brefs délais pour confirmer l\'expédition.',
    orderNumber: 'Numéro de commande',
    orderConfirmationMessage: 'Un SMS ou appel de confirmation sera effectué sous 24h ouvrées.',
    backToHome: 'Retour à l\'accueil',
    printReceipt: 'Imprimer le bon de commande',
    deliveryLocation: 'Lieu de livraison',
    orderedItems: 'Articles commandés',
    orderNotFound: 'Commande introuvable',
    orderNotFoundDesc: 'Le numéro de commande est invalide.',
    whatsAppHelp: 'Assistance WhatsApp',
    
    filters: 'Filtres',
    allCategories: 'Toutes les catégories',
    allBrands: 'Toutes les marques',
    applyFilters: 'Appliquer les filtres',
    noProductsTryAgain: 'Essayez de modifier vos critères de recherche ou réinitialisez les filtres.',
    priceRange: 'Fourchette de prix (DA)',
    minPrice: 'Min',
    maxPrice: 'Max',
    sortBy: 'Trier par',
    sortFeatured: 'Recommandés',
    sortPriceAsc: 'Prix croissant',
    sortPriceDesc: 'Prix décroissant',
    sortNewest: 'Nouveautés',
    noProductsFound: 'Aucun produit ne correspond à votre recherche',
    clearFilters: 'Réinitialiser les filtres',
    
    allRightsReserved: 'Tous droits réservés.',
    algeria58Wilayas: 'Algérie (69 Wilayas)',
    
    dashboard: 'Tableau de bord',
    orders: 'Commandes',
    stockManagement: 'Gestion du Stock',
    settings: 'Paramètres du Magasin',
    logout: 'Déconnexion',
    login: 'Connexion Espace Admin',
    email: 'Adresse e-mail',
    password: 'Mot de passe',
    totalRevenue: 'Chiffre d\'affaires',
    totalOrders: 'Total Commandes',
    pendingOrders: 'Commandes en attente',
    lowStockAlerts: 'Alertes Stock Faible',
    status: 'Statut',
    statusPending: 'En attente',
    statusConfirmed: 'Confirmée',
    statusPreparing: 'En préparation',
    statusShipped: 'Expédiée',
    statusDelivered: 'Livrée',
    statusCancelled: 'Annulée',
    actions: 'Actions',
    save: 'Enregistrer les modifications',
    cancel: 'Annuler',
    delete: 'Supprimer',
    edit: 'Modifier',
    addNewProduct: 'Ajouter un nouveau produit',
    productName: 'Nom du produit',
    productPrice: 'Prix de vente (DA)',
    productOriginalPrice: 'Prix initial avant remise (DA)',
    productStock: 'Quantité en stock',
    productImages: 'Images du produit (URLs)',
    productCategory: 'Catégorie',
    productDescription: 'Description détaillée',
    productSpecs: 'Fiche technique',
    isFeatured: 'Mettre en avant sur l\'accueil',
    isActive: 'Actif en boutique',
    storeSettingsTitle: 'Configuration de la boutique',
    storeName: 'Nom du magasin',
    storePhone: 'Téléphone de contact',
    whatsappNumber: 'Numéro WhatsApp (sans le +)',
    facebookUrl: 'Lien de la page Facebook',
    instagramUrl: 'Lien du compte Instagram',
    storeAddress: 'Adresse du magasin physique',
    enableDeliveryFee: 'Activer le calcul des frais de livraison',
    enableDeliveryFeeDesc: 'Si activé, les frais de livraison s\'ajoutent selon la wilaya. Si désactivé, la livraison est affichée comme gratuite.',
    defaultDeliveryFee: 'Frais de livraison par défaut (DA)',
    currency: 'DA'
  },
  
  ar: {
    home: 'الرئيسية',
    products: 'المنتجات',
    categories: 'الفئات',
    about: 'من نحن',
    contact: 'اتصل بنا',
    cart: 'السلة',
    search: 'بحث',
    searchPlaceholder: 'ابحث عن فرن، لوحة طهي، شفاط مطبخ...',
    admin: 'لوحة التحكم',
    appliancesTag: 'كهرومنزلي وتجهيز المطبخ',
    
    heroTitle: 'جهّز مطبخك بأحدث الأجهزة الكهرومنزلية العصرية',
    heroSubtitle: 'المتجر الأول في الجزائر لأجهزة المطبخ الكهرومنزلية الأصلية. جودة عالية، أسعار تنافسية مع خدمة التوصيل والدفع عند الاستلام لـ 69 ولاية.',
    heroCta: 'تصفح كل المنتجات',
    featuredCategories: 'فئات المنتجات',
    popularProducts: 'الأكثر مبيعاً والطلباً',
    specialOffers: 'العروض والتخفيضات المميزة',
    viewAll: 'عرض الكل',
    whyChooseUs: 'لماذا تختارنا ؟',
    fastDelivery: 'توصيل سريع ومضمون',
    fastDeliveryDesc: 'توصيل آمن إلى باب منزلك في جميع ولايات الوطن',
    guaranteedQuality: 'جودة وضمان رسمي',
    guaranteedQualityDesc: 'منتجات أصلية 100% مع ضمان رسمي من المصنّع',
    cashOnDelivery: 'الدفع عند الاستلام',
    cashOnDeliveryDesc: 'لا تدفع أي دينار حتى يصلك المنتج وتفحصه بنفسك',
    customerSupport: 'خدمة عملاء واستشارة',
    customerSupportDesc: 'فريق متخصص لمساعدتك واختيار الأنسب لمطبخك',
    wilayasDelivered: 'ولاية مغطاة',
    originalAndGuaranteed: '100% أصلي ومضمون',
    paymentOnReceipt: 'الدفع عند الاستلام',
    seeOffers: 'عرض العروض',
    
    addToCart: 'إضافة إلى السلة',
    orderViaWhatsApp: 'طلب مباشر عبر واتساب',
    viewFacebook: 'صفحتنا على فيسبوك',
    brand: 'الماركة',
    category: 'الفئة',
    stock: 'المخزون',
    inStock: 'متوفر حالياً',
    lowStock: 'كمية محدودة جداً',
    outOfStock: 'نفد من المخزون',
    specifications: 'المواصفات التقنية',
    description: 'تفاصيل ووصف المنتج',
    relatedProducts: 'منتجات مشابهة قد تعجبك',
    discount: 'تخفيض',
    originalPrice: 'السعر السابق',
    currentPrice: 'سعر العرض',
    addedToCart: 'تمت إضافة المنتج إلى السلة بنجاح !',
    units: 'وحدات',
    remaining: 'متبقية',
    productNotFound: 'المنتج غير موجود',
    productNotFoundDesc: 'المنتج المطلوب غير متوفر حالياً أو تم حذفه.',
    backToProducts: 'العودة إلى قائمة المنتجات',
    
    myCart: 'سلة المشتريات',
    cartEmpty: 'سلة المشتريات فارغة حالياً',
    cartEmptyDesc: 'تصفح عروضنا الاستثنائية وجهز مطبخك اليوم بأفضل الأسعار !',
    continueShopping: 'متابعة التسوق',
    clearCart: 'إفراغ السلة',
    subtotal: 'المجموع الفرعي',
    deliveryFee: 'تكلفة التوصيل',
    freeDelivery: 'مجاني',
    calculatedNextStep: 'تُحسب في الخطوة التالية',
    free: 'مجاني',
    total: 'المبلغ الإجمالي',
    proceedToCheckout: 'متابعة الطلب',
    checkout: 'إتمام الطلب',
    customerInfo: 'معلومات الزبون والعنوان',
    fullName: 'الاسم واللقب',
    phone: 'رقم الهاتف',
    wilaya: 'الولاية',
    selectWilaya: 'اختر الولاية',
    commune: 'البلدية',
    selectCommune: 'اختر البلدية',
    deliveryDestinationType: 'طريقة استلام الطرد',
    deliverToHome: 'توصيل إلى المنزل',
    deliverToHomeDesc: 'توصيل مباشر إلى باب منزلك أو عنوانك',
    deliverToOffice: 'استلام من المكتب (Stop-Desk)',
    deliverToOfficeDesc: 'الاستلام من أقرب مكتب توصيل في بلديتك',
    officeDeliveryNotice: 'سيتم شحن طردك إلى أقرب مكتب توصيل في بلديتك، وستتلقى اتصالاً أو رسالة نصية SMS فور وصوله لاستلامه.',
    address: 'العنوان بالتفصيل',
    addressPlaceholder: 'الحي، رقم المنزل أو العمارة...',
    orderNotes: 'ملاحظات إضافية (اختياري)',
    orderNotesPlaceholder: 'مثال: الاتصال قبل الوصول، التوصيل في المساء...',
    paymentMethod: 'طريقة الدفع',
    codDescription: 'الدفع عند الاستلام نقداً (COD) — افحص طلبك وتأكد منه ثم ادفع للموزع.',
    deliveryStepDesc: 'الدفع نقداً عند الاستلام بعد المعاينة والتأكد من المنتج',
    placeOrder: 'تأكيد الطلب الآن',
    placingOrder: 'جاري تسجيل طلبك...',
    orderSummary: 'ملخص الطلبية',
    item: 'منتج',
    items: 'منتجات',
    quantity: 'الكمية',
    remove: 'حذف',
    
    orderSuccessTitle: 'تم تسجيل طلبك بنجاح !',
    orderSuccessSubtitle: 'شكراً لثقتكم بنا. سيقوم فريقنا بالاتصال بكم هاتفياً لتأكيد العنوان وموعد التسليم.',
    orderNumber: 'رقم الطلبية',
    orderConfirmationMessage: 'سيتم الاتصال بك خلال ساعات لتأكيد شحن طلبك.',
    backToHome: 'العودة للصفحة الرئيسية',
    printReceipt: 'طباعة وصل الطلب',
    deliveryLocation: 'عنوان ومكان التوصيل',
    orderedItems: 'المنتجات المطلوبة',
    orderNotFound: 'الطلبية غير موجودة',
    orderNotFoundDesc: 'رقم الطلبية غير صالح أو غير مسجل لدينا.',
    whatsAppHelp: 'مساعدة عبر واتساب',
    
    filters: 'تصفية المنتجات',
    allCategories: 'جميع الفئات',
    allBrands: 'جميع الماركات',
    applyFilters: 'تطبيق الفلاتر',
    noProductsTryAgain: 'حاول تغيير معايير البحث أو إعادة ضبط الفلاتر.',
    priceRange: 'نطاق السعر (د.ج)',
    minPrice: 'أدنى سعر',
    maxPrice: 'أعلى سعر',
    sortBy: 'ترتيب حسب',
    sortFeatured: 'الموصى بها',
    sortPriceAsc: 'السعر: من الأقل للأعلى',
    sortPriceDesc: 'السعر: من الأعلى للأقل',
    sortNewest: 'أحدث المنتجات',
    noProductsFound: 'لم يتم العثور على أي منتج يطابق معايير البحث',
    clearFilters: 'إعادة ضبط الفلاتر',
    
    allRightsReserved: 'جميع الحقوق محفوظة.',
    algeria58Wilayas: 'الجزائر (69 ولاية)',
    
    dashboard: 'لوحة التحكم',
    orders: 'الطلبات',
    stockManagement: 'إدارة المخزون',
    settings: 'إعدادات المتجر',
    logout: 'تسجيل الخروج',
    login: 'تسجيل دخول الإدارة',
    email: 'البريد الإلكتروني',
    password: 'كلمة المرور',
    totalRevenue: 'إجمالي المبيعات',
    totalOrders: 'عدد الطلبات',
    pendingOrders: 'طلبات في الانتظار',
    lowStockAlerts: 'تنبيهات نقص المخزون',
    status: 'حالة الطلب',
    statusPending: 'قيد الانتظار',
    statusConfirmed: 'تم التأكيد',
    statusPreparing: 'قيد التجهيز',
    statusShipped: 'تم الشحن',
    statusDelivered: 'تم التسليم',
    statusCancelled: 'ملغاة',
    actions: 'إجراءات',
    save: 'حفظ التعديلات',
    cancel: 'إلغاء',
    delete: 'حذف',
    edit: 'تعديل',
    addNewProduct: 'إضافة منتج جديد',
    productName: 'اسم المنتج',
    productPrice: 'سعر البيع (د.ج)',
    productOriginalPrice: 'السعر قبل التخفيض (د.ج)',
    productStock: 'الكمية في المخزن',
    productImages: 'روابط صور المنتج',
    productCategory: 'الفئة',
    productDescription: 'الوصف التفصيلي',
    productSpecs: 'المواصفات التقنية',
    isFeatured: 'عرض كمنتج مميز بالرئيسية',
    isActive: 'مفعل ومتاح للبيع',
    storeSettingsTitle: 'إعدادات ومعلومات المتجر',
    storeName: 'اسم المتجر',
    storePhone: 'رقم الهاتف',
    whatsappNumber: 'رقم الواتساب (بدون +)',
    facebookUrl: 'رابط صفحة فيسبوك',
    instagramUrl: 'رابط حساب انستغرام',
    storeAddress: 'عنوان المحل / المقر',
    enableDeliveryFee: 'تفعيل حساب تكاليف التوصيل',
    enableDeliveryFeeDesc: 'إذا تم التفعيل، تضاف تكلفة التوصيل بحسب الولاية. وإذا تم التعطيل يظهر التوصيل مجاناً.',
    defaultDeliveryFee: 'تكلفة التوصيل الافتراضية (د.ج)',
    currency: 'د.ج'
  },
  
  en: {
    home: 'Home',
    products: 'Products',
    categories: 'Categories',
    about: 'About Us',
    contact: 'Contact',
    cart: 'Cart',
    search: 'Search',
    searchPlaceholder: 'Search for ovens, cooktops, range hoods...',
    admin: 'Admin Portal',
    appliancesTag: 'Kitchen & Home Appliances',
    
    heroTitle: 'Equip Your Kitchen with Style & Quality',
    heroSubtitle: 'Algeria\'s top destination for built-in and smart kitchen appliances. Authentic brands, competitive prices, and cash on delivery across 69 wilayas.',
    heroCta: 'Explore Products',
    featuredCategories: 'Shop by Category',
    popularProducts: 'Best Sellers',
    specialOffers: 'Hot Deals & Discounts',
    viewAll: 'View All',
    whyChooseUs: 'Why Shop With Us?',
    fastDelivery: 'Fast & Secure Delivery',
    fastDeliveryDesc: 'Direct doorstep delivery across all 69 wilayas of Algeria',
    guaranteedQuality: 'Official Warranty',
    guaranteedQualityDesc: '100% authentic appliances with manufacturer warranty',
    cashOnDelivery: 'Cash on Delivery',
    cashOnDeliveryDesc: 'Inspect your order and pay when it arrives safely',
    customerSupport: 'Expert Advice',
    customerSupportDesc: 'Our friendly team is available 7 days a week',
    wilayasDelivered: 'Wilayas Covered',
    originalAndGuaranteed: '100% Original & Guaranteed',
    paymentOnReceipt: 'Payment on Delivery',
    seeOffers: 'View Deals',
    
    addToCart: 'Add to Cart',
    orderViaWhatsApp: 'Order via WhatsApp',
    viewFacebook: 'Visit Facebook Page',
    brand: 'Brand',
    category: 'Category',
    stock: 'Stock',
    inStock: 'In Stock',
    lowStock: 'Low Stock',
    outOfStock: 'Out of Stock',
    specifications: 'Technical Specifications',
    description: 'Product Description',
    relatedProducts: 'You Might Also Like',
    discount: 'Discount',
    originalPrice: 'Original Price',
    currentPrice: 'Deal Price',
    addedToCart: 'Product added to cart successfully!',
    units: 'units',
    remaining: 'remaining',
    productNotFound: 'Product Not Found',
    productNotFoundDesc: 'The requested product does not exist or is currently unavailable.',
    backToProducts: 'Back to Products',
    
    myCart: 'Shopping Cart',
    cartEmpty: 'Your cart is empty',
    cartEmptyDesc: 'Discover our premium appliances and equip your kitchen today!',
    continueShopping: 'Continue Shopping',
    clearCart: 'Empty Cart',
    subtotal: 'Subtotal',
    deliveryFee: 'Delivery Fee',
    freeDelivery: 'Free Delivery',
    calculatedNextStep: 'Calculated at next step',
    free: 'Free',
    total: 'Total Amount',
    proceedToCheckout: 'Proceed to Checkout',
    checkout: 'Checkout',
    customerInfo: 'Delivery Information',
    fullName: 'Full Name',
    phone: 'Phone Number',
    wilaya: 'Wilaya (Province)',
    selectWilaya: 'Select your wilaya',
    commune: 'Commune / City',
    selectCommune: 'Select your commune',
    deliveryDestinationType: 'Delivery Destination',
    deliverToHome: 'Home Delivery',
    deliverToHomeDesc: 'Direct delivery to your home doorstep',
    deliverToOffice: 'Office / Stop-Desk Pickup',
    deliverToOfficeDesc: 'Pickup at the nearest carrier branch in your city',
    officeDeliveryNotice: 'Your parcel will be delivered to the local carrier office in your commune. You will receive an SMS/call upon arrival for pickup.',
    address: 'Exact Delivery Address',
    addressPlaceholder: 'Street, Building / House number...',
    orderNotes: 'Order Notes (Optional)',
    orderNotesPlaceholder: 'e.g. Call before delivery, deliver in the evening...',
    paymentMethod: 'Payment Method',
    codDescription: 'Cash on Delivery (COD) — Inspect your appliances at doorstep before making payment.',
    deliveryStepDesc: 'Cash on delivery payment after inspecting your items',
    placeOrder: 'Confirm Order',
    placingOrder: 'Processing your order...',
    orderSummary: 'Order Summary',
    item: 'item',
    items: 'items',
    quantity: 'Quantity',
    remove: 'Remove',
    
    orderSuccessTitle: 'Order Confirmed!',
    orderSuccessSubtitle: 'Thank you for your order. Our team will contact you shortly by phone to confirm dispatch details.',
    orderNumber: 'Order Number',
    orderConfirmationMessage: 'A confirmation call will be made within 24 business hours.',
    backToHome: 'Back to Home',
    printReceipt: 'Print Order Invoice',
    deliveryLocation: 'Delivery Location',
    orderedItems: 'Ordered Items',
    orderNotFound: 'Order Not Found',
    orderNotFoundDesc: 'The order number is invalid or could not be found.',
    whatsAppHelp: 'WhatsApp Support',
    
    filters: 'Filters',
    allCategories: 'All Categories',
    allBrands: 'All Brands',
    applyFilters: 'Apply Filters',
    noProductsTryAgain: 'Try modifying your search criteria or resetting filters.',
    priceRange: 'Price Range (DZD)',
    minPrice: 'Min Price',
    maxPrice: 'Max Price',
    sortBy: 'Sort By',
    sortFeatured: 'Recommended',
    sortPriceAsc: 'Price: Low to High',
    sortPriceDesc: 'Price: High to Low',
    sortNewest: 'Newest Arrivals',
    noProductsFound: 'No products matched your criteria',
    clearFilters: 'Clear Filters',
    
    allRightsReserved: 'All rights reserved.',
    algeria58Wilayas: 'Algeria (69 Wilayas)',
    
    dashboard: 'Dashboard',
    orders: 'Orders',
    stockManagement: 'Stock Management',
    settings: 'Store Settings',
    logout: 'Logout',
    login: 'Admin Login',
    email: 'Email Address',
    password: 'Password',
    totalRevenue: 'Total Revenue',
    totalOrders: 'Total Orders',
    pendingOrders: 'Pending Orders',
    lowStockAlerts: 'Low Stock Alerts',
    status: 'Status',
    statusPending: 'Pending',
    statusConfirmed: 'Confirmed',
    statusPreparing: 'Preparing',
    statusShipped: 'Shipped',
    statusDelivered: 'Delivered',
    statusCancelled: 'Cancelled',
    actions: 'Actions',
    save: 'Save Changes',
    cancel: 'Cancel',
    delete: 'Delete',
    edit: 'Edit',
    addNewProduct: 'Add New Product',
    productName: 'Product Name',
    productPrice: 'Sale Price (DZD)',
    productOriginalPrice: 'Original Price Before Discount (DZD)',
    productStock: 'Stock Quantity',
    productImages: 'Image URLs (one per line or comma-separated)',
    productCategory: 'Category',
    productDescription: 'Detailed Description',
    productSpecs: 'Specifications',
    isFeatured: 'Feature on Homepage',
    isActive: 'Active & Available',
    storeSettingsTitle: 'Store Configuration',
    storeName: 'Store Name',
    storePhone: 'Store Phone',
    whatsappNumber: 'WhatsApp Number (without +)',
    facebookUrl: 'Facebook Page URL',
    instagramUrl: 'Instagram Profile URL',
    storeAddress: 'Physical Store Address',
    enableDeliveryFee: 'Enable Delivery Fee Calculation',
    enableDeliveryFeeDesc: 'If enabled, shipping fees will be computed by wilaya. If disabled, shipping appears as Free.',
    defaultDeliveryFee: 'Default Delivery Fee (DZD)',
    currency: 'DA'
  }
};

interface LanguageStore {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: () => Translations;
  isRTL: () => boolean;
}

export const useLanguageStore = create<LanguageStore>()(
  persist(
    (set, get) => ({
      language: 'fr',
      setLanguage: (lang: Language) => {
        set({ language: lang });
        if (typeof document !== 'undefined') {
          document.documentElement.lang = lang;
          document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
        }
      },
      t: () => {
        return translations[get().language] || translations.fr;
      },
      isRTL: () => get().language === 'ar',
    }),
    {
      name: 'ecom_language',
    }
  )
);

