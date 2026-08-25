import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';

import { 
  ShoppingCart, 
  MessageCircle, 
  ShieldCheck, 
  Truck, 
  RotateCcw, 
  CheckCircle2, 
  AlertTriangle, 
  XCircle, 
  Plus, 
  Minus, 
  ChevronRight
} from 'lucide-react';
import { FacebookIcon } from '../components/SocialIcons';
import { useLanguageStore } from '../lib/i18n';
import { useAppStore } from '../store/useAppStore';
import { useCartStore } from '../store/useCartStore';
import { ProductCard } from '../components/ProductCard';

export const ProductDetailsPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const { t, language } = useLanguageStore();
  const { products, categories, settings } = useAppStore();
  const { addItem } = useCartStore();
  const translations = t();


  const product = products.find((p) => p.slug === slug || p.id === slug);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [addedToast, setAddedToast] = useState(false);

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-24 text-center">
        <h2 className="text-2xl font-bold text-slate-900 mb-2">{translations.productNotFound}</h2>
        <p className="text-slate-500 text-sm mb-6">{translations.productNotFoundDesc}</p>
        <Link
          to="/products"
          className="bg-slate-900 text-white font-bold text-xs px-6 py-3 rounded-xl inline-block"
        >
          {translations.backToProducts}
        </Link>
      </div>
    );
  }

  const category = categories.find((c) => c.id === product.category_id || c.slug === product.category_slug);
  const catName = category ? (language === 'ar' ? category.name_ar : language === 'en' ? category.name_en : category.name_fr) : '';
  const productName = language === 'ar' && product.name_ar ? product.name_ar : language === 'en' && product.name_en ? product.name_en : product.name;
  const productDesc = language === 'ar' && product.description_ar ? product.description_ar : language === 'en' && product.description_en ? product.description_en : product.description;

  const hasDiscount = product.original_price && product.original_price > product.price;
  const discountPercent = hasDiscount
    ? Math.round(((product.original_price! - product.price) / product.original_price!) * 100)
    : 0;

  const isOutOfStock = product.stock <= 0;
  const isLowStock = product.stock > 0 && product.stock <= 3;
  const currencySymbol = language === 'ar' ? settings.currency_ar || 'د.ج' : settings.currency || 'DA';

  const formatPrice = (num: number) => num.toLocaleString('fr-DZ');

  const handleAddToCart = () => {
    if (!isOutOfStock) {
      addItem(product, quantity);
      setAddedToast(true);
      setTimeout(() => setAddedToast(false), 3000);
    }
  };

  const handleWhatsAppOrder = () => {
    const phone = settings.whatsapp_number.replace(/\D/g, '');
    const message = encodeURIComponent(
      language === 'ar'
        ? `Bonjour / السلام عليكم،\nأود طلب هذا المنتج من موقعكم:\n- المنتج: ${productName}\n- السعر: ${formatPrice(product.price)} ${currencySymbol}\n- الكمية: ${quantity}\n- الرابط: ${window.location.href}`
        : `Bonjour, je souhaite commander :\n- Produit: ${product.name}\n- Prix: ${formatPrice(product.price)} ${currencySymbol}\n- Quantité: ${quantity}\n- Lien: ${window.location.href}`
    );
    window.open(`https://wa.me/${phone}?text=${message}`, '_blank');
  };

  const relatedProducts = products
    .filter((p) => p.id !== product.id && (p.category_id === product.category_id || p.category_slug === product.category_slug))
    .slice(0, 4);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12">
      {/* Toast Notification */}
      {addedToast && (
        <div className="fixed bottom-20 right-6 z-50 bg-slate-900 text-white text-xs sm:text-sm font-bold px-5 py-3 rounded-2xl shadow-2xl flex items-center gap-3 border border-slate-700 animate-in fade-in slide-in-from-bottom-3">
          <CheckCircle2 className="w-5 h-5 text-emerald-400" />
          <span>{translations.addedToCart}</span>
        </div>
      )}

      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-xs text-slate-500 overflow-x-auto whitespace-nowrap">
        <Link to="/" className="hover:text-amber-600 font-medium">{translations.home}</Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <Link to="/products" className="hover:text-amber-600 font-medium">{translations.products}</Link>
        {category && (
          <>
            <ChevronRight className="w-3.5 h-3.5" />
            <Link to={`/products?category=${category.slug}`} className="hover:text-amber-600 font-medium">
              {catName}
            </Link>
          </>
        )}
        <ChevronRight className="w-3.5 h-3.5" />
        <span className="text-slate-900 font-semibold truncate max-w-xs">{productName}</span>
      </nav>

      {/* Product Primary Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 bg-white rounded-3xl p-6 sm:p-10 border border-slate-200/80 shadow-xs">
        {/* Left: Image Gallery */}
        <div className="lg:col-span-6 space-y-4">
          <div className="relative aspect-4/3 rounded-3xl overflow-hidden bg-slate-100 border border-slate-200">
            <img
              src={product.images[selectedImageIndex] || product.images[0] || 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=800&q=80'}
              alt={productName}
              className="w-full h-full object-cover object-center"
            />
            {hasDiscount && (
              <span className="absolute top-4 left-4 bg-red-500 text-white font-black text-xs px-3 py-1.5 rounded-full shadow-lg">
                -{discountPercent}% {translations.discount}
              </span>
            )}
          </div>

          {/* Thumbnails */}
          {product.images.length > 1 && (
            <div className="flex items-center gap-3 overflow-x-auto pb-2">
              {product.images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImageIndex(idx)}
                  className={`w-20 h-20 rounded-2xl overflow-hidden border-2 transition-all shrink-0 bg-slate-100 ${
                    selectedImageIndex === idx ? 'border-amber-500 ring-2 ring-amber-500/20' : 'border-slate-200 opacity-70 hover:opacity-100'
                  }`}
                >
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right: Details & Order Box */}
        <div className="lg:col-span-6 flex flex-col justify-between space-y-6">
          <div className="space-y-4">
            {/* Brand, Category & Stock */}
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <span className="text-xs font-extrabold uppercase tracking-wider text-amber-700 bg-amber-100 px-3 py-1 rounded-full">
                  {product.brand}
                </span>
                {category && (
                  <span className="text-xs font-semibold text-slate-500 bg-slate-100 px-2.5 py-1 rounded-full">
                    {catName}
                  </span>
                )}
              </div>

              {/* Stock Status Badge */}
              {isOutOfStock ? (
                <span className="bg-red-50 text-red-600 border border-red-200 text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1.5">
                  <XCircle className="w-4 h-4" />
                  {translations.outOfStock}
                </span>
              ) : isLowStock ? (
                <span className="bg-amber-50 text-amber-700 border border-amber-200 text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1.5">
                  <AlertTriangle className="w-4 h-4" />
                  {translations.lowStock} ({product.stock} {translations.remaining})
                </span>
              ) : (
                <span className="bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4" />
                  {translations.inStock} ({product.stock} {translations.units})
                </span>
              )}
            </div>

            {/* Product Title */}
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 leading-tight">
              {productName}
            </h1>

            {/* Price Presentation (As requested: Red strikethrough original price, discount badge, large bold green price) */}
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-1">
              {hasDiscount && (
                <div className="flex items-center gap-2">
                  <span className="text-slate-500 text-xs font-medium">{translations.originalPrice}:</span>
                  <span className="text-red-500 line-through text-base sm:text-lg font-bold">
                    {formatPrice(product.original_price!)} {currencySymbol}
                  </span>
                  <span className="text-red-600 text-xs font-extrabold bg-red-100 px-2 py-0.5 rounded-full">
                    -{discountPercent}%
                  </span>
                </div>
              )}

              <div className="flex items-baseline gap-2">
                <span className="text-3xl sm:text-4xl font-black text-emerald-600 tracking-tight">
                  {formatPrice(product.price)}
                </span>
                <span className="text-emerald-700 font-extrabold text-lg sm:text-xl">
                  {currencySymbol}
                </span>
              </div>
            </div>

            {/* Short Description */}
            <p className="text-sm text-slate-600 leading-relaxed">
              {productDesc}
            </p>
          </div>

          {/* Actions & Quantity */}
          <div className="space-y-4 pt-4 border-t border-slate-100">
            {/* Quantity Stepper */}
            <div className="flex items-center gap-4">
              <span className="text-xs font-bold text-slate-700">{translations.quantity}:</span>
              <div className="flex items-center bg-slate-100 rounded-xl p-1 border border-slate-200">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  disabled={quantity <= 1 || isOutOfStock}
                  className="p-1.5 text-slate-600 hover:text-slate-950 rounded-lg hover:bg-white disabled:opacity-40"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="text-sm font-black text-slate-900 px-4 min-w-10 text-center">
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity(product.stock > 0 ? Math.min(product.stock, quantity + 1) : quantity + 1)}
                  disabled={isOutOfStock || (product.stock > 0 && quantity >= product.stock)}
                  className="p-1.5 text-slate-600 hover:text-slate-950 rounded-lg hover:bg-white disabled:opacity-40"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Primary Action Buttons */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <button
                onClick={handleAddToCart}
                disabled={isOutOfStock}
                className={`py-3.5 px-6 rounded-2xl font-black text-sm flex items-center justify-center gap-2.5 transition-all shadow-lg active:scale-98 ${
                  isOutOfStock
                    ? 'bg-slate-200 text-slate-400 cursor-not-allowed'
                    : 'bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-amber-500/20'
                }`}
              >
                <ShoppingCart className="w-5 h-5" />
                <span>{translations.addToCart}</span>
              </button>

              <button
                onClick={handleWhatsAppOrder}
                className="bg-emerald-600 hover:bg-emerald-500 text-white py-3.5 px-6 rounded-2xl font-black text-sm flex items-center justify-center gap-2.5 transition-all shadow-lg shadow-emerald-600/20 active:scale-98"
              >
                <MessageCircle className="w-5 h-5" />
                <span>{translations.orderViaWhatsApp}</span>
              </button>
            </div>

            {/* Direct Facebook Link */}
            {settings.facebook_url && (
              <a
                href={settings.facebook_url}
                target="_blank"
                rel="noreferrer"
                className="w-full bg-slate-100 hover:bg-blue-50 hover:text-blue-600 text-slate-700 py-2.5 px-4 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition-colors border border-slate-200"
              >
                <FacebookIcon className="w-4 h-4 text-blue-600" />
                <span>{translations.viewFacebook}</span>
              </a>
            )}
          </div>

          {/* Guarantees Mini Grid */}
          <div className="grid grid-cols-3 gap-2 pt-4 border-t border-slate-100 text-center">
            <div className="p-2 rounded-xl bg-slate-50">
              <Truck className="w-4 h-4 text-amber-600 mx-auto mb-1" />
              <span className="text-[10px] font-bold text-slate-700 block">{translations.wilayasDelivered}</span>
              <span className="text-[9px] text-slate-400 block">{translations.fastDelivery}</span>
            </div>
            <div className="p-2 rounded-xl bg-slate-50">
              <ShieldCheck className="w-4 h-4 text-emerald-600 mx-auto mb-1" />
              <span className="text-[10px] font-bold text-slate-700 block">{translations.originalAndGuaranteed}</span>
              <span className="text-[9px] text-slate-400 block">{translations.guaranteedQuality}</span>
            </div>
            <div className="p-2 rounded-xl bg-slate-50">
              <RotateCcw className="w-4 h-4 text-blue-600 mx-auto mb-1" />
              <span className="text-[10px] font-bold text-slate-700 block">{translations.cashOnDelivery}</span>
              <span className="text-[9px] text-slate-400 block">{translations.paymentOnReceipt}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Specifications Table */}
      {(() => {
        const productSpecs = (language === 'ar' && product.specifications_ar)
          ? product.specifications_ar
          : (language === 'en' && product.specifications_en)
          ? product.specifications_en
          : product.specifications;

        if (!productSpecs || Object.keys(productSpecs).length === 0) return null;

        return (
          <div className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200/80 shadow-xs">
            <h3 className="text-lg font-black text-slate-900 mb-6 flex items-center gap-2">
              <span>📋</span>
              <span>{translations.specifications}</span>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {Object.entries(productSpecs).map(([key, val]) => (
                <div
                  key={key}
                  className="flex items-center justify-between p-3.5 rounded-xl bg-slate-50 border border-slate-200/60 text-xs sm:text-sm"
                >
                  <span className="font-semibold text-slate-600">{key}</span>
                  <span className="font-bold text-slate-900">{val}</span>
                </div>
              ))}
            </div>
          </div>
        );
      })()}

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <div className="space-y-6">
          <h3 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            {translations.relatedProducts}
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {relatedProducts.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
