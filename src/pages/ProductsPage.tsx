import React, { useState, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { 
  Filter, 
  SlidersHorizontal, 
  Search, 
  ArrowUpDown,
  X
} from 'lucide-react';


import { useLanguageStore } from '../lib/i18n';
import { useAppStore } from '../store/useAppStore';
import { ProductCard } from '../components/ProductCard';

export const ProductsPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { t, language } = useLanguageStore();
  const { categories, products, settings } = useAppStore();
  const translations = t();

  // Search params
  const categoryParam = searchParams.get('category') || 'all';
  const searchParam = searchParams.get('search') || '';

  // Local filter states
  const [selectedCategory, setSelectedCategory] = useState<string>(categoryParam);
  const [selectedBrand, setSelectedBrand] = useState<string>('all');
  const [priceMax, setPriceMax] = useState<number>(100000);
  const [onlyInStock, setOnlyInStock] = useState<boolean>(false);
  const [onlyDiscounted, setOnlyDiscounted] = useState<boolean>(false);
  const [sortBy, setSortBy] = useState<'featured' | 'price-asc' | 'price-desc' | 'newest'>('featured');
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

  // Sync category param
  React.useEffect(() => {
    if (categoryParam) {
      setSelectedCategory(categoryParam);
    }
  }, [categoryParam]);

  // Extract all unique brands
  const brands = useMemo(() => {
    const list = Array.from(new Set(products.map((p) => p.brand).filter(Boolean)));
    return list;
  }, [products]);

  // Filtered and Sorted products
  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      if (!product.is_active) return false;

      // Category filter
      if (selectedCategory !== 'all') {
        const cat = categories.find((c) => c.slug === selectedCategory);
        if (cat && product.category_id !== cat.id && product.category_slug !== selectedCategory) {
          return false;
        }
      }

      // Brand filter
      if (selectedBrand !== 'all' && product.brand !== selectedBrand) {
        return false;
      }

      // Price filter
      if (product.price > priceMax) {
        return false;
      }

      // In stock only
      if (onlyInStock && product.stock <= 0) {
        return false;
      }

      // Discounted only
      if (onlyDiscounted && (!product.original_price || product.original_price <= product.price)) {
        return false;
      }

      // Search query
      if (searchParam.trim()) {
        const q = searchParam.toLowerCase();
        const nameMatch = product.name.toLowerCase().includes(q);
        const nameArMatch = product.name_ar?.toLowerCase().includes(q);
        const brandMatch = product.brand.toLowerCase().includes(q);
        const descMatch = product.description.toLowerCase().includes(q);
        if (!nameMatch && !nameArMatch && !brandMatch && !descMatch) {
          return false;
        }
      }

      return true;
    }).sort((a, b) => {
      if (sortBy === 'price-asc') return a.price - b.price;
      if (sortBy === 'price-desc') return b.price - a.price;
      if (sortBy === 'newest') return (new Date(b.created_at || '').getTime()) - (new Date(a.created_at || '').getTime());
      // Default: featured first
      return (b.is_featured ? 1 : 0) - (a.is_featured ? 1 : 0);
    });
  }, [products, categories, selectedCategory, selectedBrand, priceMax, onlyInStock, onlyDiscounted, searchParam, sortBy]);

  const handleResetFilters = () => {
    setSelectedCategory('all');
    setSelectedBrand('all');
    setPriceMax(100000);
    setOnlyInStock(false);
    setOnlyDiscounted(false);
    setSortBy('featured');
    setSearchParams({});
  };

  const currencySymbol = language === 'ar' ? settings.currency_ar || 'د.ج' : settings.currency || 'DA';

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Breadcrumb & Header */}
      <div className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            {searchParam ? (
              <span>
                {translations.search}: <span className="text-amber-600">"{searchParam}"</span>
              </span>
            ) : selectedCategory !== 'all' ? (
              (() => {
                const cat = categories.find((c) => c.slug === selectedCategory);
                return cat ? (language === 'ar' ? cat.name_ar : cat.name_fr) : translations.products;
              })()
            ) : (
              translations.products
            )}
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            {filteredProducts.length} {filteredProducts.length > 1 ? translations.items : translations.item} {translations.inStock}
          </p>
        </div>

        {/* Sort & Mobile filter trigger */}
        <div className="flex items-center gap-3 self-end md:self-auto">
          {/* Mobile Filter Button */}
          <button
            onClick={() => setIsMobileFilterOpen(true)}
            className="lg:hidden flex items-center gap-2 bg-white border border-slate-300 text-slate-700 px-4 py-2 rounded-xl text-xs font-bold shadow-xs hover:bg-slate-50"
          >
            <Filter className="w-4 h-4 text-amber-600" />
            <span>{translations.filters}</span>
          </button>

          {/* Sort Selector */}
          <div className="flex items-center gap-2 bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs font-semibold text-slate-700 shadow-xs">
            <ArrowUpDown className="w-3.5 h-3.5 text-slate-400" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="bg-transparent outline-none cursor-pointer text-slate-800 font-medium"
            >
              <option value="featured">{translations.sortFeatured}</option>
              <option value="price-asc">{translations.sortPriceAsc}</option>
              <option value="price-desc">{translations.sortPriceDesc}</option>
              <option value="newest">{translations.sortNewest}</option>
            </select>
          </div>
        </div>
      </div>

      {/* Main Grid: Sidebar + Products */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Desktop Filter Sidebar */}
        <aside className="hidden lg:block lg:col-span-1 space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs space-y-6 sticky top-28">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2 font-bold text-slate-900 text-sm">
                <SlidersHorizontal className="w-4 h-4 text-amber-600" />
                <span>{translations.filters}</span>
              </div>
              <button
                onClick={handleResetFilters}
                className="text-xs text-amber-600 hover:text-amber-700 font-semibold"
              >
                {translations.clearFilters}
              </button>
            </div>

            {/* Categories */}
            <div>
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-3">
                {translations.categories}
              </h3>
              <div className="space-y-1.5">
                <button
                  onClick={() => {
                    setSelectedCategory('all');
                    setSearchParams({});
                  }}
                  className={`w-full text-left px-3 py-2 rounded-xl text-xs font-medium flex items-center justify-between transition-colors ${
                    selectedCategory === 'all'
                      ? 'bg-amber-500 text-slate-950 font-bold'
                      : 'text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <span>{translations.allCategories}</span>
                  <span className="text-[11px] opacity-70">({products.length})</span>
                </button>
                {categories.filter(c => c.is_active).map((cat) => {
                  const isSelected = selectedCategory === cat.slug;
                  const count = products.filter(p => p.category_id === cat.id || p.category_slug === cat.slug).length;
                  return (
                    <button
                      key={cat.id}
                      onClick={() => {
                        setSelectedCategory(cat.slug);
                        setSearchParams({ category: cat.slug });
                      }}
                      className={`w-full text-left px-3 py-2 rounded-xl text-xs font-medium flex items-center justify-between transition-colors ${
                        isSelected
                          ? 'bg-amber-500 text-slate-950 font-bold shadow-xs'
                          : 'text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      <span>{language === 'ar' ? cat.name_ar : language === 'en' ? cat.name_en : cat.name_fr}</span>
                      <span className="text-[11px] opacity-70">({count})</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Brands */}
            {brands.length > 0 && (
              <div className="border-t border-slate-100 pt-4">
                <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-3">
                  {translations.brand}
                </h3>
                <div className="space-y-1 max-h-40 overflow-y-auto pr-1">
                  <button
                    onClick={() => setSelectedBrand('all')}
                    className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs font-medium ${
                      selectedBrand === 'all' ? 'text-amber-600 font-bold bg-amber-50' : 'text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    {translations.allBrands}
                  </button>
                  {brands.map((b) => (
                    <button
                      key={b}
                      onClick={() => setSelectedBrand(b)}
                      className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs font-medium ${
                        selectedBrand === b ? 'text-amber-600 font-bold bg-amber-50' : 'text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      {b}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Price Slider */}
            <div className="border-t border-slate-100 pt-4">
              <div className="flex items-center justify-between text-xs font-bold text-slate-900 uppercase tracking-wider mb-2">
                <span>{translations.priceRange}</span>
                <span className="text-amber-700 font-black">
                  ≤ {priceMax.toLocaleString('fr-DZ')} {currencySymbol}
                </span>
              </div>
              <input
                type="range"
                min={10000}
                max={150000}
                step={5000}
                value={priceMax}
                onChange={(e) => setPriceMax(Number(e.target.value))}
                className="w-full accent-amber-500 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-400 mt-1">
                <span>10 000 {currencySymbol}</span>
                <span>150 000 {currencySymbol}</span>
              </div>
            </div>

            {/* Quick toggles */}
            <div className="border-t border-slate-100 pt-4 space-y-2.5">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={onlyInStock}
                  onChange={(e) => setOnlyInStock(e.target.checked)}
                  className="rounded text-amber-500 focus:ring-amber-500 h-4 w-4"
                />
                <span className="text-xs font-medium text-slate-700">{translations.inStock}</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={onlyDiscounted}
                  onChange={(e) => setOnlyDiscounted(e.target.checked)}
                  className="rounded text-amber-500 focus:ring-amber-500 h-4 w-4"
                />
                <span className="text-xs font-medium text-slate-700">{translations.specialOffers}</span>
              </label>
            </div>
          </div>
        </aside>

        {/* Product Grid */}
        <main className="lg:col-span-3">
          {filteredProducts.length === 0 ? (
            <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center">
              <div className="w-16 h-16 bg-amber-50 rounded-full flex items-center justify-center mx-auto text-amber-500 mb-4">
                <Search className="w-8 h-8" />
              </div>
              <h3 className="text-base font-bold text-slate-900 mb-1">
                {translations.noProductsFound}
              </h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto mb-6">
                {translations.noProductsTryAgain}
              </p>
              <button
                onClick={handleResetFilters}
                className="bg-slate-900 hover:bg-amber-500 hover:text-slate-950 text-white text-xs font-bold px-6 py-2.5 rounded-xl transition-colors"
              >
                {translations.clearFilters}
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
              {filteredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </main>
      </div>

      {/* Mobile Filter Modal */}
      {isMobileFilterOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden lg:hidden animate-in fade-in duration-200">
          <div
            onClick={() => setIsMobileFilterOpen(false)}
            className="absolute inset-0 bg-slate-950/60 backdrop-blur-xs"
          />
          <div className="fixed inset-y-0 right-0 w-full sm:w-auto sm:max-w-xs flex">
            <div className="w-full bg-white p-5 shadow-2xl flex flex-col justify-between overflow-y-auto max-h-dvh">
              <div className="space-y-6">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <h3 className="font-bold text-base text-slate-900">{translations.filters}</h3>
                  <button onClick={() => setIsMobileFilterOpen(false)} className="p-1 text-slate-400 hover:text-slate-700">
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Categories */}
                <div>
                  <h4 className="text-xs font-bold text-slate-900 uppercase mb-2">
                    {translations.categories}
                  </h4>
                  <div className="space-y-1 max-h-48 overflow-y-auto pr-1">
                    <button
                      onClick={() => {
                        setSelectedCategory('all');
                        setSearchParams({});
                      }}
                      className={`w-full text-left px-3 py-2 rounded-lg text-xs font-semibold ${
                        selectedCategory === 'all' ? 'bg-amber-500 text-slate-950' : 'text-slate-700 hover:bg-slate-50'
                      }`}
                    >
                      {translations.allCategories}
                    </button>
                    {categories.filter(c => c.is_active).map((c) => (
                      <button
                        key={c.id}
                        onClick={() => {
                          setSelectedCategory(c.slug);
                          setSearchParams({ category: c.slug });
                        }}
                        className={`w-full text-left px-3 py-2 rounded-lg text-xs font-semibold ${
                          selectedCategory === c.slug ? 'bg-amber-500 text-slate-950' : 'text-slate-700 hover:bg-slate-50'
                        }`}
                      >
                        {language === 'ar' ? c.name_ar : language === 'en' ? c.name_en : c.name_fr}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Brands */}
                {brands.length > 0 && (
                  <div className="border-t border-slate-100 pt-4">
                    <h4 className="text-xs font-bold text-slate-900 uppercase mb-2">
                      {translations.brand}
                    </h4>
                    <div className="space-y-1 max-h-36 overflow-y-auto pr-1">
                      <button
                        onClick={() => setSelectedBrand('all')}
                        className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs font-medium ${
                          selectedBrand === 'all' ? 'text-amber-600 font-bold bg-amber-50' : 'text-slate-600'
                        }`}
                      >
                        {translations.allBrands}
                      </button>
                      {brands.map((b) => (
                        <button
                          key={b}
                          onClick={() => setSelectedBrand(b)}
                          className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs font-medium ${
                            selectedBrand === b ? 'text-amber-600 font-bold bg-amber-50' : 'text-slate-600'
                          }`}
                        >
                          {b}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Price range */}
                <div className="border-t border-slate-100 pt-4">
                  <div className="flex items-center justify-between text-xs font-bold text-slate-900 mb-2">
                    <span>{translations.priceRange}</span>
                    <span className="text-amber-700 font-black">
                      ≤ {priceMax.toLocaleString('fr-DZ')} {currencySymbol}
                    </span>
                  </div>
                  <input
                    type="range"
                    min={10000}
                    max={150000}
                    step={5000}
                    value={priceMax}
                    onChange={(e) => setPriceMax(Number(e.target.value))}
                    className="w-full accent-amber-500 cursor-pointer"
                  />
                </div>
              </div>

              <div className="pt-6 border-t border-slate-100 space-y-2">
                <button
                  onClick={() => setIsMobileFilterOpen(false)}
                  className="w-full bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs py-3 rounded-xl shadow-md shadow-amber-500/20"
                >
                  {translations.applyFilters} ({filteredProducts.length})
                </button>
                <button
                  onClick={handleResetFilters}
                  className="w-full bg-slate-100 text-slate-700 font-semibold text-xs py-2.5 rounded-xl hover:bg-slate-200"
                >
                  {translations.clearFilters}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
