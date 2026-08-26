import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart, Eye, CheckCircle2, AlertTriangle, XCircle, MessageCircle, Truck } from 'lucide-react';
import type { Product } from '../types';

import { useCartStore } from '../store/useCartStore';
import { useLanguageStore } from '../lib/i18n';
import { useAppStore } from '../store/useAppStore';

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { addItem } = useCartStore();
  const { t, language } = useLanguageStore();
  const { settings } = useAppStore();
  const translations = t();

  const hasDiscount = product.original_price && product.original_price > product.price;
  const discountPercent = hasDiscount
    ? Math.round(((product.original_price! - product.price) / product.original_price!) * 100)
    : 0;

  const isOutOfStock = product.stock <= 0;
  const isLowStock = product.stock > 0 && product.stock <= 3;

  const productName = language === 'ar' && product.name_ar ? product.name_ar : language === 'en' && product.name_en ? product.name_en : product.name;
  const currencySymbol = language === 'ar' ? settings.currency_ar || 'د.ج' : settings.currency || 'DA';

  const formatPrice = (num: number) => {
    return num.toLocaleString('fr-DZ');
  };

  const handleWhatsAppQuickOrder = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const phone = settings.whatsapp_number.replace(/\D/g, '');
    const message = encodeURIComponent(
      language === 'ar'
        ? `مرحباً، أود طلب المنتج:\n- الاسم: ${productName}\n- السعر: ${formatPrice(product.price)} ${currencySymbol}\n- الرابط: ${window.location.origin}/products/${product.slug}`
        : `Bonjour, je souhaite commander :\n- Produit: ${product.name}\n- Prix: ${formatPrice(product.price)} ${currencySymbol}\n- Lien: ${window.location.origin}/products/${product.slug}`
    );
    window.open(`https://wa.me/${phone}?text=${message}`, '_blank');
  };

  return (
    <div className="group relative bg-white rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-xl hover:border-amber-400/50 transition-all duration-300 flex flex-col overflow-hidden">
      {/* Top badges */}
      <div className="absolute top-3 left-3 right-3 z-10 flex items-center justify-between pointer-events-none">
        {/* Left: Discount badge OR Free delivery badge */}
        <div className="flex flex-col gap-1 items-start">
          {hasDiscount && (
            <span className="bg-red-500 text-white font-bold text-xs px-2.5 py-1 rounded-full shadow-md animate-pulse">
              -{discountPercent}%
            </span>
          )}
          {product.is_free_delivery && (
            <span className="bg-emerald-600 text-white font-bold text-[10px] sm:text-xs px-2 py-0.5 rounded-full shadow-md flex items-center gap-1">
              <Truck className="w-3 h-3" />
              {translations.freeDelivery}
            </span>
          )}
        </div>

        {/* Stock badge */}
        {isOutOfStock ? (
          <span className="bg-slate-800/90 backdrop-blur-xs text-white text-[11px] font-medium px-2 py-0.5 rounded-full flex items-center gap-1">
            <XCircle className="w-3 h-3 text-red-400" />
            {translations.outOfStock}
          </span>
        ) : isLowStock ? (
          <span className="bg-amber-500 text-white text-[11px] font-semibold px-2 py-0.5 rounded-full flex items-center gap-1 shadow-xs">
            <AlertTriangle className="w-3 h-3" />
            {translations.lowStock} ({product.stock})
          </span>
        ) : null}
      </div>

      {/* Product Image */}
      <Link
        to={`/products/${product.slug}`}
        className="relative aspect-4/3 w-full overflow-hidden bg-slate-100 block"
      >
        <img
          src={product.images[0] || 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=600&q=80'}
          alt={productName}
          loading="lazy"
          className="h-full w-full object-cover object-center group-hover:scale-108 transition-transform duration-500 ease-out"
        />
        <div className="absolute inset-0 bg-black/5 group-hover:bg-black/10 transition-colors" />
        
        {/* Quick view button overlay */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/20 backdrop-blur-[2px]">
          <span className="bg-white/95 text-slate-800 text-xs font-semibold px-3 py-1.5 rounded-full shadow-lg flex items-center gap-1.5 transform translate-y-2 group-hover:translate-y-0 transition-transform">
            <Eye className="w-3.5 h-3.5 text-amber-500" />
            {translations.specifications}
          </span>
        </div>
      </Link>

      {/* Content */}
      <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between">
        <div>
          {/* Brand & Category */}
          <div className="flex items-center justify-between text-xs text-slate-500 mb-1.5">
            <span className="font-semibold uppercase tracking-wider text-amber-700 bg-amber-50 px-2 py-0.5 rounded">
              {product.brand}
            </span>
            <div className="flex items-center text-emerald-600 text-xs gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>{translations.guaranteedQuality}</span>
            </div>
          </div>

          {/* Title */}
          <Link
            to={`/products/${product.slug}`}
            className="block font-medium text-slate-900 hover:text-amber-600 transition-colors line-clamp-2 text-sm sm:text-base leading-snug mb-2"
          >
            {productName}
          </Link>
        </div>

        {/* Pricing & Actions */}
        <div className="mt-3 pt-3 border-t border-slate-100">
          {/* Price Container */}
          <div className="mb-3">
            {hasDiscount && (
              <div className="flex items-center gap-2 mb-0.5">
                <span className="text-red-500 line-through text-xs sm:text-sm font-semibold">
                  {formatPrice(product.original_price!)} {currencySymbol}
                </span>
                <span className="text-red-600 text-[11px] font-bold bg-red-50 px-1.5 py-0.2 rounded">
                  -{discountPercent}%
                </span>
              </div>
            )}
            
            {/* New / Sale Price: Large, prominent, bold green color */}
            <div className="flex items-baseline gap-1">
              <span className="text-xl sm:text-2xl font-black text-emerald-600 tracking-tight">
                {formatPrice(product.price)}
              </span>
              <span className="text-emerald-700 font-bold text-sm">
                {currencySymbol}
              </span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="grid grid-cols-5 gap-2">
            <button
              onClick={() => !isOutOfStock && addItem(product, 1)}
              disabled={isOutOfStock}
              className={`col-span-4 py-2.5 px-3 rounded-xl font-semibold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all duration-200 shadow-sm ${
                isOutOfStock
                  ? 'bg-slate-200 text-slate-400 cursor-not-allowed'
                  : 'bg-slate-900 hover:bg-amber-500 hover:text-slate-950 text-white active:scale-98 shadow-slate-900/10'
              }`}
            >
              <ShoppingCart className="w-4 h-4" />
              <span>{isOutOfStock ? translations.outOfStock : translations.addToCart}</span>
            </button>

            {/* WhatsApp Quick Order button */}
            <button
              onClick={handleWhatsAppQuickOrder}
              title={translations.orderViaWhatsApp}
              className="col-span-1 bg-emerald-50 text-emerald-600 hover:bg-emerald-500 hover:text-white rounded-xl flex items-center justify-center transition-colors border border-emerald-200"
            >
              <MessageCircle className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
