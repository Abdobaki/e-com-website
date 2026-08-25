import React from 'react';
import { Link } from 'react-router-dom';
import { 
  ArrowRight, 
  ArrowLeft,
  Flame, 
  Sparkles, 
  MessageCircle,
  Tag
} from 'lucide-react';
import { FacebookIcon } from '../components/SocialIcons';
import { useLanguageStore } from '../lib/i18n';
import { useAppStore } from '../store/useAppStore';
import { ProductCard } from '../components/ProductCard';


export const HomePage: React.FC = () => {
  const { t, language, isRTL } = useLanguageStore();
  const { categories, products, settings } = useAppStore();
  const translations = t();

  // Featured & Discounted products
  const discountedProducts = products.filter(
    (p) => p.original_price && p.original_price > p.price && p.is_active
  );
  const featuredProducts = products.filter((p) => p.is_featured && p.is_active);

  const handleWhatsAppInquiry = () => {
    const phone = settings.whatsapp_number.replace(/\D/g, '');
    const message = encodeURIComponent(
      language === 'ar'
        ? 'مرحباً، أود معرفة المزيد عن العروض المتوفرة في المتجر.'
        : 'Bonjour, je souhaite découvrir vos promotions et offres actuelles.'
    );
    window.open(`https://wa.me/${phone}?text=${message}`, '_blank');
  };

  return (
    <div className="space-y-16 sm:space-y-24 pb-20">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950 text-white pt-12 sm:pt-20 pb-20 sm:pb-28">
        {/* Ambient Glows */}
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-amber-500/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-amber-600/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Content */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              {/* Badge */}
              <div className="inline-flex items-center gap-2 bg-amber-500/15 border border-amber-500/30 text-amber-300 px-4 py-1.5 rounded-full text-xs font-bold tracking-wide uppercase">
                <Sparkles className="w-4 h-4 text-amber-400" />
                <span>{translations.specialOffers} — 2026</span>
              </div>

              {/* Main Headline */}
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-tight sm:leading-none text-white">
                {language === 'ar' ? (
                  <>
                    جهّز مطبخك بأحدث <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-amber-300 to-yellow-500">الأجهزة الكهرومنزلية</span> العصرية
                  </>
                ) : language === 'en' ? (
                  <>
                    Equip your kitchen with <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-amber-300 to-yellow-500">style & quality</span>
                  </>
                ) : (
                  <>
                    Équipez votre cuisine avec <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-amber-300 to-yellow-500">style & qualité</span>
                  </>
                )}
              </h1>

              {/* Subtitle */}
              <p className="text-base sm:text-lg text-slate-300 max-w-2xl mx-auto lg:mx-0 leading-relaxed">
                {translations.heroSubtitle}
              </p>

              {/* CTAs */}
              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3 pt-2">
                <Link
                  to="/products"
                  className="bg-gradient-to-r from-amber-500 to-amber-400 hover:from-amber-400 hover:to-amber-300 text-slate-950 px-7 py-3.5 rounded-2xl font-black text-sm shadow-xl shadow-amber-500/25 flex items-center gap-2 transform hover:-translate-y-0.5 active:translate-y-0 transition-all"
                >
                  <span>{translations.heroCta}</span>
                  {isRTL() ? <ArrowLeft className="w-4 h-4" /> : <ArrowRight className="w-4 h-4" />}
                </Link>

                <button
                  onClick={handleWhatsAppInquiry}
                  className="bg-slate-800/90 hover:bg-slate-700 text-white border border-slate-700 px-6 py-3.5 rounded-2xl font-bold text-sm flex items-center gap-2 transition-colors"
                >
                  <MessageCircle className="w-4 h-4 text-emerald-400" />
                  <span>{translations.orderViaWhatsApp}</span>
                </button>
              </div>

              {/* Mini Highlights */}
              <div className="grid grid-cols-3 gap-4 pt-6 border-t border-slate-800/80 max-w-lg mx-auto lg:mx-0">
                <div className="text-center lg:text-left">
                  <span className="block text-xl sm:text-2xl font-black text-amber-400">69</span>
                  <span className="text-[11px] text-slate-400 uppercase font-medium">{translations.wilayasDelivered}</span>
                </div>
                <div className="text-center lg:text-left">
                  <span className="block text-xl sm:text-2xl font-black text-emerald-400">100%</span>
                  <span className="text-[11px] text-slate-400 uppercase font-medium">{translations.originalAndGuaranteed}</span>
                </div>
                <div className="text-center lg:text-left">
                  <span className="block text-xl sm:text-2xl font-black text-blue-400">COD</span>
                  <span className="text-[11px] text-slate-400 uppercase font-medium">{translations.paymentOnReceipt}</span>
                </div>
              </div>
            </div>

            {/* Right Hero Image Card */}
            <div className="lg:col-span-5 relative">
              <div className="relative mx-auto max-w-md lg:max-w-none">
                <div className="relative rounded-3xl overflow-hidden shadow-2xl border border-slate-700/50 bg-slate-800/50">
                  <img
                    src="https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=1000&q=80"
                    alt="Kitchen Appliances"
                    className="w-full h-80 sm:h-96 object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />
                  
                  {/* Floating Promo Tag */}
                  <div className="absolute bottom-6 left-6 right-6 p-4 rounded-2xl bg-slate-900/90 backdrop-blur-md border border-slate-700/80 flex items-center justify-between">
                    <div>
                      <span className="text-xs font-bold text-amber-400 block uppercase">
                        {language === 'ar' ? 'باقة الأجهزة المدمجة 2026' : language === 'en' ? 'Built-in Kitchen Pack 2026' : 'Pack Encastrable 2026'}
                      </span>
                      <span className="text-sm font-bold text-white block mt-0.5">
                        {language === 'ar' ? 'فرن + لوحة طهي + شفاط' : language === 'en' ? 'Oven + Gas Hob + Range Hood' : 'Four + Plaque Gaz + Hotte'}
                      </span>
                    </div>
                    <Link
                      to="/products"
                      className="bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-extrabold px-3.5 py-2 rounded-xl"
                    >
                      {translations.seeOffers}
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Grid Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-2 text-amber-600 text-xs font-bold uppercase tracking-wider mb-1">
              <Flame className="w-4 h-4" />
              <span>{translations.categories}</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              {translations.featuredCategories}
            </h2>
          </div>
          <Link
            to="/products"
            className="text-amber-600 hover:text-amber-700 font-bold text-sm flex items-center gap-1 group"
          >
            <span>{translations.viewAll}</span>
            {isRTL() ? <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" /> : <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />}
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {categories.filter(c => c.is_active).map((cat) => {
            const catName = language === 'ar' ? cat.name_ar : language === 'en' ? cat.name_en : cat.name_fr;
            const count = products.filter(p => p.category_id === cat.id || p.category_slug === cat.slug).length;

            return (
              <Link
                key={cat.id}
                to={`/products?category=${cat.slug}`}
                className="group relative bg-white rounded-2xl border border-slate-200/80 overflow-hidden shadow-xs hover:shadow-xl hover:border-amber-500/40 transition-all duration-300 flex flex-col"
              >
                <div className="aspect-16/10 w-full overflow-hidden bg-slate-100 relative">
                  <img
                    src={cat.image_url || 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=400&q=80'}
                    alt={catName}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                  
                  <span className="absolute bottom-2.5 left-3 text-white text-xs font-bold bg-black/40 backdrop-blur-xs px-2 py-0.5 rounded-md">
                    {count} {translations.products}
                  </span>
                </div>

                <div className="p-4 flex items-center justify-between">
                  <h3 className="font-bold text-sm sm:text-base text-slate-900 group-hover:text-amber-600 transition-colors">
                    {catName}
                  </h3>
                  <div className="w-8 h-8 rounded-full bg-slate-100 group-hover:bg-amber-500 group-hover:text-slate-950 flex items-center justify-center text-slate-600 transition-colors">
                    {isRTL() ? <ArrowLeft className="w-4 h-4" /> : <ArrowRight className="w-4 h-4" />}
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* Special Offers & Discounts Section (With requested discount price formatting!) */}
      {discountedProducts.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-br from-red-500/5 via-amber-500/10 to-orange-500/5 border border-red-200/60 rounded-3xl p-6 sm:p-10">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
              <div>
                <div className="inline-flex items-center gap-1.5 text-red-600 bg-red-100/80 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider mb-2">
                  <Tag className="w-3.5 h-3.5" />
                  <span>{translations.discount} & Promotions</span>
                </div>
                <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                  {translations.specialOffers}
                </h2>
              </div>
              <Link
                to="/products"
                className="text-red-600 hover:text-red-700 font-bold text-sm flex items-center gap-1 group"
              >
                <span>{translations.viewAll}</span>
                {isRTL() ? <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" /> : <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />}
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6">
              {discountedProducts.slice(0, 4).map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Popular Products */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-2 text-amber-600 text-xs font-bold uppercase tracking-wider mb-1">
              <Sparkles className="w-4 h-4" />
              <span>{translations.popularProducts}</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              {translations.popularProducts}
            </h2>
          </div>
          <Link
            to="/products"
            className="text-amber-600 hover:text-amber-700 font-bold text-sm flex items-center gap-1 group"
          >
            <span>{translations.viewAll}</span>
            {isRTL() ? <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" /> : <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />}
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6">
          {featuredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* Facebook & WhatsApp Community Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-slate-900 rounded-3xl p-8 sm:p-12 text-white relative overflow-hidden shadow-2xl border border-slate-800">
          <div className="absolute -right-10 -bottom-10 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
            <div className="lg:col-span-8 space-y-4">
              <div className="inline-flex items-center gap-2 text-blue-400 bg-blue-500/10 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
                <FacebookIcon className="w-4 h-4" />
                <span>Facebook & WhatsApp</span>
              </div>
              <h3 className="text-2xl sm:text-3xl font-black tracking-tight">
                {language === 'ar'
                  ? 'تابعنا على فيسبوك وتواصل معنا مباشرة عبر واتساب'
                  : language === 'en'
                  ? 'Join our Facebook community & order directly on WhatsApp'
                  : 'Rejoignez notre communauté Facebook & commandez directement sur WhatsApp'}
              </h3>
              <p className="text-slate-300 text-sm max-w-xl leading-relaxed">
                {language === 'ar'
                  ? 'نشارككم يومياً أحدث العروض وتجارب الزبائن الحقيقية ونصائح لاختيار أفضل الأجهزة لمطبخك.'
                  : language === 'en'
                  ? 'Discover daily arrivals, authentic customer reviews, and live product demos.'
                  : 'Découvrez nos arrivages quotidiens, avis clients réels et vidéos de démonstration en direct.'}
              </p>
            </div>

            <div className="lg:col-span-4 flex flex-col sm:flex-row lg:flex-col gap-3">
              {settings.facebook_url && (
                <a
                  href={settings.facebook_url}
                  target="_blank"
                  rel="noreferrer"
                  className="bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm px-6 py-3.5 rounded-2xl flex items-center justify-center gap-2 transition-colors shadow-lg shadow-blue-600/20"
                >
                  <FacebookIcon className="w-4 h-4" />
                  <span>{translations.viewFacebook}</span>
                </a>
              )}
              <button
                onClick={handleWhatsAppInquiry}
                className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm px-6 py-3.5 rounded-2xl flex items-center justify-center gap-2 transition-colors shadow-lg shadow-emerald-600/20"
              >
                <MessageCircle className="w-4 h-4" />
                <span>{translations.orderViaWhatsApp}</span>
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
