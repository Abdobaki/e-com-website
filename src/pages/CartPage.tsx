import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Trash2, 
  Plus, 
  Minus, 
  ShoppingBag, 
  ArrowRight, 
  ArrowLeft, 
  ShieldCheck 
} from 'lucide-react';
import { useCartStore } from '../store/useCartStore';
import { useLanguageStore } from '../lib/i18n';
import { useAppStore } from '../store/useAppStore';

export const CartPage: React.FC = () => {
  const { items, updateQuantity, removeItem, clearCart, getSubtotal } = useCartStore();
  const { t, language, isRTL } = useLanguageStore();
  const { settings } = useAppStore();
  const translations = t();


  const subtotal = getSubtotal();
  const currencySymbol = language === 'ar' ? settings.currency_ar || 'د.ج' : settings.currency || 'DA';
  const formatPrice = (num: number) => num.toLocaleString('fr-DZ');

  if (items.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center">
        <div className="w-24 h-24 bg-amber-50 rounded-full flex items-center justify-center mx-auto text-amber-500 mb-6">
          <ShoppingBag className="w-12 h-12" />
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 mb-2">
          {translations.cartEmpty}
        </h1>
        <p className="text-sm text-slate-500 max-w-md mx-auto mb-8">
          {translations.cartEmptyDesc}
        </p>
        <Link
          to="/products"
          className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold text-sm px-8 py-3.5 rounded-2xl shadow-xl shadow-amber-500/20 inline-flex items-center gap-2"
        >
          <span>{translations.continueShopping}</span>
          {isRTL() ? <ArrowLeft className="w-4 h-4" /> : <ArrowRight className="w-4 h-4" />}
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-6 sm:py-10 space-y-5 sm:space-y-8">
      <div className="flex items-center justify-between flex-wrap gap-2">
        <h1 className="text-xl sm:text-2xl lg:text-3xl font-black text-slate-900 tracking-tight flex items-center gap-2 sm:gap-3">
          <ShoppingBag className="w-5 h-5 sm:w-7 sm:h-7 text-amber-600" />
          <span>{translations.myCart}</span>
          <span className="text-xs sm:text-sm font-semibold text-slate-500">
            ({items.reduce((sum, i) => sum + i.quantity, 0)} {translations.items})
          </span>
        </h1>

        <button
          onClick={clearCart}
          className="text-xs text-red-500 hover:text-red-700 font-bold"
        >
          {translations.clearCart}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 sm:gap-8 items-start">
        {/* Items Table */}
        <div className="lg:col-span-8 space-y-3 sm:space-y-4">
          {items.map(({ product, quantity }) => {
            const productName = language === 'ar' && product.name_ar ? product.name_ar : language === 'en' && product.name_en ? product.name_en : product.name;
            const hasDiscount = product.original_price && product.original_price > product.price;

            return (
              <div
                key={product.id}
                className="bg-white rounded-2xl sm:rounded-3xl p-3 sm:p-5 border border-slate-200/80 shadow-xs flex flex-row items-center gap-3 sm:gap-5"
              >
                {/* Thumbnail */}
                <img
                  src={product.images[0] || 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=300&q=80'}
                  alt={productName}
                  className="w-18 h-18 sm:w-24 sm:h-24 md:w-28 md:h-28 object-cover rounded-xl sm:rounded-2xl bg-slate-100 shrink-0 border border-slate-200"
                />

                {/* Details */}
                <div className="flex-1 min-w-0 space-y-1.5 sm:space-y-2">
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <span className="text-[10px] sm:text-[11px] font-extrabold text-amber-700 uppercase tracking-wider bg-amber-50 px-1.5 sm:px-2 py-0.5 rounded">
                        {product.brand}
                      </span>
                      <h3 className="font-bold text-xs sm:text-sm md:text-base text-slate-900 mt-1 truncate sm:whitespace-normal">
                        <Link to={`/products/${product.slug}`} className="hover:text-amber-600">
                          {productName}
                        </Link>
                      </h3>
                    </div>

                    <button
                      onClick={() => removeItem(product.id)}
                      className="text-slate-400 hover:text-red-500 p-1 sm:p-1.5 transition-colors shrink-0"
                      title={translations.remove}
                    >
                      <Trash2 className="w-4 h-4 sm:w-5 sm:h-5" />
                    </button>
                  </div>

                  {/* Price & Quantity Controls */}
                  <div className="flex items-center justify-between pt-1.5 sm:pt-2 border-t border-slate-100">
                    <div>
                      {hasDiscount && (
                        <span className="text-[10px] sm:text-xs text-red-500 line-through mr-1.5 sm:mr-2">
                          {formatPrice(product.original_price!)} {currencySymbol}
                        </span>
                      )}
                      <span className="text-sm sm:text-lg font-black text-emerald-600">
                        {formatPrice(product.price)} {currencySymbol}
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5 sm:gap-2 bg-slate-100 border border-slate-200 rounded-lg sm:rounded-xl p-0.5 sm:p-1">
                      <button
                        onClick={() => updateQuantity(product.id, quantity - 1)}
                        className="p-1 text-slate-600 hover:text-slate-950 rounded-lg hover:bg-white"
                      >
                        <Minus className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                      </button>
                      <span className="text-xs font-bold text-slate-900 px-2 sm:px-3 min-w-6 sm:min-w-8 text-center">
                        {quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(product.id, quantity + 1)}
                        className="p-1 text-slate-600 hover:text-slate-950 rounded-lg hover:bg-white"
                      >
                        <Plus className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Summary Card */}
        <div className="lg:col-span-4 bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-6 md:p-8 border border-slate-200/80 shadow-xs space-y-4 sm:space-y-6 sticky top-28">
          <h2 className="font-extrabold text-base sm:text-lg text-slate-900 border-b border-slate-100 pb-3">
            {translations.orderSummary}
          </h2>

          <div className="space-y-2.5 sm:space-y-3 text-sm">
            <div className="flex justify-between text-slate-600">
              <span>{translations.subtotal}</span>
              <span className="font-bold text-slate-900">
                {formatPrice(subtotal)} {currencySymbol}
              </span>
            </div>

            <div className="flex justify-between text-slate-600">
              <span>{translations.deliveryFee}</span>
              <span className="font-medium text-slate-500 text-xs sm:text-sm">
                {items.length > 0 && items.every((i) => Boolean(i.product.is_free_delivery)) ? (
                  <span className="text-emerald-600 font-extrabold">{translations.freeDelivery}</span>
                ) : (
                  translations.calculatedNextStep
                )}
              </span>
            </div>

            <div className="pt-3 border-t border-slate-100 flex justify-between items-baseline">
              <span className="font-bold text-sm sm:text-base text-slate-900">{translations.total}</span>
              <div className="text-right">
                <span className="text-xl sm:text-2xl font-black text-emerald-600">
                  {formatPrice(subtotal)}
                </span>
                <span className="text-emerald-700 font-bold ml-1">{currencySymbol}</span>
              </div>
            </div>
          </div>

          <div className="p-2.5 sm:p-3 bg-emerald-50 rounded-xl sm:rounded-2xl border border-emerald-200 text-xs text-emerald-800 space-y-1">
            <div className="flex items-center gap-1.5 font-bold">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>{translations.cashOnDelivery}</span>
            </div>
            <p className="text-[11px] text-emerald-700">
              {translations.codDescription}
            </p>
          </div>

          <Link
            to="/checkout"
            className="w-full bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-sm py-3.5 sm:py-4 rounded-xl sm:rounded-2xl shadow-xl shadow-amber-500/25 flex items-center justify-center gap-2 transition-all transform hover:-translate-y-0.5 active:translate-y-0 text-center"
          >
            <span>{translations.proceedToCheckout}</span>
            {isRTL() ? <ArrowLeft className="w-4 h-4" /> : <ArrowRight className="w-4 h-4" />}
          </Link>
        </div>
      </div>
    </div>
  );
};
