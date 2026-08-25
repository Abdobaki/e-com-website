import React from 'react';
import { Link } from 'react-router-dom';
import { 
  ChefHat, 
  Phone, 
  MapPin, 
  Mail, 
  MessageCircle, 
  Truck, 
  ShieldCheck, 
  RotateCcw, 
  Headphones 
} from 'lucide-react';
import { FacebookIcon, InstagramIcon } from './SocialIcons';
import { useLanguageStore } from '../lib/i18n';
import { useAppStore } from '../store/useAppStore';


export const Footer: React.FC = () => {
  const { t, language } = useLanguageStore();
  const { settings, categories } = useAppStore();
  const translations = t();

  const handleWhatsAppClick = () => {
    const phone = settings.whatsapp_number.replace(/\D/g, '');
    const message = encodeURIComponent(
      language === 'ar'
        ? 'مرحباً، أود الاستفسار حول منتجاتكم وخدمة التوصيل.'
        : 'Bonjour, je souhaite me renseigner sur vos produits et la livraison.'
    );
    window.open(`https://wa.me/${phone}?text=${message}`, '_blank');
  };

  return (
    <footer className="bg-slate-950 text-slate-400 pt-16 pb-12 border-t border-slate-800">
      {/* Guarantees Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 p-6 rounded-3xl bg-slate-900/80 border border-slate-800/80">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/10 text-amber-400 flex items-center justify-center shrink-0">
              <Truck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-white font-bold text-sm">{translations.fastDelivery}</h4>
              <p className="text-xs text-slate-400 mt-0.5">{translations.fastDeliveryDesc}</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-white font-bold text-sm">{translations.guaranteedQuality}</h4>
              <p className="text-xs text-slate-400 mt-0.5">{translations.guaranteedQualityDesc}</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-blue-500/10 text-blue-400 flex items-center justify-center shrink-0">
              <RotateCcw className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-white font-bold text-sm">{translations.cashOnDelivery}</h4>
              <p className="text-xs text-slate-400 mt-0.5">{translations.cashOnDeliveryDesc}</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-purple-500/10 text-purple-400 flex items-center justify-center shrink-0">
              <Headphones className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-white font-bold text-sm">{translations.customerSupport}</h4>
              <p className="text-xs text-slate-400 mt-0.5">{translations.customerSupportDesc}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          {/* Brand Col */}
          <div className="lg:col-span-2 space-y-4">
            <Link to="/" className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-xl bg-amber-500 flex items-center justify-center text-slate-950">
                <ChefHat className="w-6 h-6" />
              </div>
              <span className="font-extrabold text-2xl text-white tracking-tight">
                {settings.store_name}
              </span>
            </Link>
            <p className="text-sm text-slate-400 leading-relaxed max-w-sm">
              {language === 'ar'
                ? 'المتجر الأول في الجزائر لأجهزة المطبخ الكهرومنزلية الأصلية مع توصيل 69 ولاية والدفع عند الاستلام.'
                : language === 'en'
                ? 'Algeria\'s premier destination for built-in and smart kitchen appliances with 69 wilayas delivery.'
                : `${settings.store_tagline}. ${translations.heroSubtitle}`}
            </p>
            
            {/* Social Buttons */}
            <div className="flex items-center gap-3 pt-2">
              {settings.facebook_url && (
                <a
                  href={settings.facebook_url}
                  target="_blank"
                  rel="noreferrer"
                  className="w-10 h-10 rounded-xl bg-slate-900 hover:bg-blue-600 text-slate-300 hover:text-white flex items-center justify-center transition-colors border border-slate-800"
                  title="Facebook"
                >
                  <FacebookIcon className="w-5 h-5" />
                </a>
              )}
              {settings.instagram_url && (
                <a
                  href={settings.instagram_url}
                  target="_blank"
                  rel="noreferrer"
                  className="w-10 h-10 rounded-xl bg-slate-900 hover:bg-pink-600 text-slate-300 hover:text-white flex items-center justify-center transition-colors border border-slate-800"
                  title="Instagram"
                >
                  <InstagramIcon className="w-5 h-5" />
                </a>
              )}
              <button
                onClick={handleWhatsAppClick}
                className="w-10 h-10 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white flex items-center justify-center transition-colors shadow-lg shadow-emerald-900/30"
                title="WhatsApp"
              >
                <MessageCircle className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Categories Links */}
          <div>
            <h3 className="text-white font-bold text-sm tracking-wider uppercase mb-4">
              {translations.categories}
            </h3>
            <ul className="space-y-2.5 text-sm">
              {categories.slice(0, 5).map((cat) => (
                <li key={cat.id}>
                  <Link
                    to={`/products?category=${cat.slug}`}
                    className="hover:text-amber-400 transition-colors"
                  >
                    {language === 'ar' ? cat.name_ar : language === 'en' ? cat.name_en : cat.name_fr}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-bold text-sm tracking-wider uppercase mb-4">
              {language === 'ar' ? 'روابط سريعة' : language === 'en' ? 'Quick Links' : 'Liens Rapides'}
            </h3>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link to="/products" className="hover:text-amber-400 transition-colors">
                  {translations.products}
                </Link>
              </li>
              <li>
                <Link to="/cart" className="hover:text-amber-400 transition-colors">
                  {translations.cart}
                </Link>
              </li>
              <li>
                <Link to="/checkout" className="hover:text-amber-400 transition-colors">
                  {translations.checkout}
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Details */}
          <div>
            <h3 className="text-white font-bold text-sm tracking-wider uppercase mb-4">
              {translations.contact}
            </h3>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                <span>{settings.address}</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-amber-500 shrink-0" />
                <a href={`tel:${settings.store_phone}`} className="hover:text-white transition-colors">
                  {settings.store_phone}
                </a>
              </li>
              <li className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-amber-500 shrink-0" />
                <a href={`mailto:${settings.email}`} className="hover:text-white transition-colors">
                  {settings.email}
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom copyright */}
        <div className="mt-12 pt-8 border-t border-slate-900 text-xs text-slate-500 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p>© {new Date().getFullYear()} {settings.store_name}. {translations.allRightsReserved}</p>
          <div className="flex items-center gap-4 text-slate-400">
            <span>🇩🇿 {translations.algeria58Wilayas}</span>
            <span>•</span>
            <span>{translations.cashOnDelivery} (COD)</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
