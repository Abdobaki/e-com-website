import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { 
  ShoppingCart, 
  Search, 
  Languages, 
  Menu, 
  X, 
  Flame, 
  ChefHat, 
  Phone, 
  ShieldCheck,
  SlidersHorizontal
} from 'lucide-react';

import { FacebookIcon } from './SocialIcons';
import { useCartStore } from '../store/useCartStore';
import { useLanguageStore } from '../lib/i18n';
import { useAppStore } from '../store/useAppStore';
import type { Language } from '../types';


export const Header: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { openCart, getTotalItems } = useCartStore();
  const { language, setLanguage, t, isRTL } = useLanguageStore();
  const { categories, settings } = useAppStore();
  const translations = t();

  const [searchQuery, setSearchQuery] = useState('');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isLangDropdownOpen, setIsLangDropdownOpen] = useState(false);

  const totalCartItems = getTotalItems();

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
      setIsMobileMenuOpen(false);
    }
  };

  const handleLanguageChange = (lang: Language) => {
    setLanguage(lang);
    setIsLangDropdownOpen(false);
  };

  const languages: { code: Language; label: string; flag: string }[] = [
    { code: 'fr', label: 'Français', flag: '🇫🇷' },
    { code: 'ar', label: 'العربية', flag: '🇩🇿' },
    { code: 'en', label: 'English', flag: '🇬🇧' },
  ];

  return (
    <header className="sticky top-0 z-40 w-full bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-xs transition-all">
      {/* Top Announcement Bar */}
      {settings.announcement_enabled && (
        <div className="bg-gradient-to-r from-slate-900 via-amber-950 to-slate-900 text-amber-200 text-xs py-2 px-4 text-center font-medium flex items-center justify-between border-b border-amber-500/20">
          <div className="hidden md:flex items-center gap-4 text-slate-300">
            <span className="flex items-center gap-1">
              <Phone className="w-3.5 h-3.5 text-amber-400" />
              <a href={`tel:${settings.store_phone}`} className="hover:text-white transition-colors">
                {settings.store_phone}
              </a>
            </span>
            <span className="flex items-center gap-1 text-slate-400">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              {translations.cashOnDelivery}
            </span>
          </div>

          <div className="mx-auto flex items-center gap-2">
            <span>
              {language === 'ar'
                ? '🔥 توصيل منزلي 69 ولاية | الدفع نقداً عند الاستلام (COD) !'
                : language === 'en'
                ? '🔥 Home delivery across 69 Wilayas | Cash on Delivery (COD)!'
                : (settings.announcement_text || '🔥 Livraison à domicile 69 Wilayas | Paiement en espèces à la livraison (COD) !')}
            </span>
          </div>

          <div className="hidden md:flex items-center gap-3">
            {settings.facebook_url && (
              <a
                href={settings.facebook_url}
                target="_blank"
                rel="noreferrer"
                className="text-slate-300 hover:text-white flex items-center gap-1 transition-colors"
              >
                <FacebookIcon className="w-3.5 h-3.5 text-blue-400" />
                <span>Facebook</span>
              </a>
            )}
          </div>

        </div>
      )}

      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-18 gap-4">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 shrink-0 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-500 to-amber-400 flex items-center justify-center text-slate-950 shadow-md shadow-amber-500/20 group-hover:scale-105 transition-transform">
              <ChefHat className="w-6 h-6" />
            </div>
            <div>
              <span className="font-extrabold text-xl tracking-tight text-slate-900 block leading-tight">
                {settings.store_name}
              </span>
              <span className="text-[11px] text-amber-700 font-semibold tracking-wider uppercase block">
                {translations.appliancesTag}
              </span>
            </div>
          </Link>

          {/* Desktop Search Bar */}
          <form
            onSubmit={handleSearchSubmit}
            className="hidden lg:flex flex-1 max-w-lg relative mx-4"
          >
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={translations.searchPlaceholder}
              className="w-full bg-slate-100/90 hover:bg-slate-100 focus:bg-white text-slate-900 pl-11 pr-24 py-2.5 rounded-full border border-slate-200 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 outline-none text-sm transition-all shadow-inner"
            />
            <Search className={`w-4 h-4 text-slate-400 absolute top-3.5 ${isRTL() ? 'right-4' : 'left-4'}`} />
            <button
              type="submit"
              className={`absolute top-1.5 ${isRTL() ? 'left-1.5' : 'right-1.5'} bg-slate-900 hover:bg-amber-500 hover:text-slate-950 text-white text-xs font-semibold px-4 py-1.5 rounded-full transition-colors`}
            >
              {translations.search}
            </button>
          </form>

          {/* Navigation Links & Actions */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Desktop Nav Links */}
            <nav className="hidden md:flex items-center gap-1 mr-2">
              <Link
                to="/"
                className={`px-3 py-2 rounded-lg text-sm font-semibold transition-colors ${
                  location.pathname === '/' ? 'text-amber-600 bg-amber-50' : 'text-slate-700 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                {translations.home}
              </Link>
              <Link
                to="/products"
                className={`px-3 py-2 rounded-lg text-sm font-semibold transition-colors ${
                  location.pathname === '/products' ? 'text-amber-600 bg-amber-50' : 'text-slate-700 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                {translations.products}
              </Link>
            </nav>

            {/* Language Switcher Dropdown */}
            <div className="relative">
              <button
                onClick={() => setIsLangDropdownOpen(!isLangDropdownOpen)}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors border border-slate-200"
                title="Change language / تغيير اللغة"
              >
                <Languages className="w-4 h-4 text-amber-600" />
                <span className="uppercase">{language}</span>
              </button>

              {isLangDropdownOpen && (
                <div className={`absolute top-full mt-1.5 ${isRTL() ? 'left-0' : 'right-0'} w-36 bg-white rounded-xl shadow-xl border border-slate-200 py-1.5 z-50 animate-in fade-in zoom-in-95`}>
                  {languages.map((lang) => (
                    <button
                      key={lang.code}
                      onClick={() => handleLanguageChange(lang.code)}
                      className={`w-full text-left px-3 py-2 text-xs font-medium flex items-center justify-between hover:bg-amber-50 hover:text-amber-700 transition-colors ${
                        language === lang.code ? 'bg-amber-50/70 text-amber-600 font-bold' : 'text-slate-700'
                      }`}
                    >
                      <span className="flex items-center gap-2">
                        <span>{lang.flag}</span>
                        <span>{lang.label}</span>
                      </span>
                      {language === lang.code && <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Cart Button */}
            <button
              onClick={openCart}
              className="relative flex items-center gap-2 bg-amber-500 hover:bg-amber-400 text-slate-950 px-3.5 sm:px-4 py-2 rounded-xl font-bold text-sm shadow-md shadow-amber-500/20 active:scale-95 transition-all"
            >
              <ShoppingCart className="w-4 h-4 sm:w-5 sm:h-5" />
              <span className="hidden sm:inline">{translations.cart}</span>
              {totalCartItems > 0 && (
                <span className="bg-slate-950 text-white font-extrabold text-xs px-2 py-0.5 rounded-full min-w-5 text-center">
                  {totalCartItems}
                </span>
              )}
            </button>

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 text-slate-700 hover:text-slate-900 rounded-lg hover:bg-slate-100"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Categories Bar (Desktop) */}
        <div className="hidden md:flex items-center gap-2 py-2 overflow-x-auto border-t border-slate-100 no-scrollbar">
          <Link
            to="/products"
            className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full bg-slate-100 hover:bg-amber-100 text-slate-800 hover:text-amber-800 transition-colors shrink-0"
          >
            <SlidersHorizontal className="w-3.5 h-3.5 text-amber-600" />
            <span>{translations.allCategories}</span>
          </Link>
          {categories.filter(c => c.is_active).map((category) => {
            const catName = language === 'ar' ? category.name_ar : language === 'en' ? category.name_en : category.name_fr;
            return (
              <Link
                key={category.id}
                to={`/products?category=${category.slug}`}
                className="flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-full hover:bg-amber-50 text-slate-600 hover:text-amber-700 transition-colors shrink-0"
              >
                <Flame className="w-3 h-3 text-amber-500" />
                <span>{catName}</span>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white border-b border-slate-200 px-4 pt-3 pb-6 shadow-xl animate-in slide-in-from-top-2">
          {/* Mobile Search */}
          <form onSubmit={handleSearchSubmit} className="relative mb-4">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={translations.searchPlaceholder}
              className="w-full bg-slate-100 text-slate-900 pl-10 pr-20 py-2.5 rounded-xl border border-slate-200 text-sm outline-none focus:border-amber-500"
            />
            <Search className="w-4 h-4 text-slate-400 absolute top-3.5 left-3.5" />
            <button
              type="submit"
              className="absolute top-1.5 right-1.5 bg-slate-900 text-white text-xs font-semibold px-3 py-1.5 rounded-lg"
            >
              {translations.search}
            </button>
          </form>

          {/* Links */}
          <div className="space-y-1 mb-4">
            <Link
              to="/"
              onClick={() => setIsMobileMenuOpen(false)}
              className="block px-3 py-2 text-sm font-semibold text-slate-800 hover:bg-slate-100 rounded-lg"
            >
              {translations.home}
            </Link>
            <Link
              to="/products"
              onClick={() => setIsMobileMenuOpen(false)}
              className="block px-3 py-2 text-sm font-semibold text-slate-800 hover:bg-slate-100 rounded-lg"
            >
              {translations.products}
            </Link>
          </div>

          {/* Categories */}
          <div className="border-t border-slate-100 pt-3">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
              {translations.categories}
            </p>
            <div className="grid grid-cols-2 gap-2">
              {categories.map((c) => (
                <Link
                  key={c.id}
                  to={`/products?category=${c.slug}`}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="text-xs text-slate-700 bg-slate-50 hover:bg-amber-50 hover:text-amber-700 p-2 rounded-lg truncate"
                >
                  {language === 'ar' ? c.name_ar : language === 'en' ? c.name_en : c.name_fr}
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
