import React from 'react';
import { Link } from 'react-router-dom';
import { X, Trash2, Plus, Minus, ShoppingBag, ArrowRight, ArrowLeft } from 'lucide-react';
import { useCartStore } from '../store/useCartStore';
import { useLanguageStore } from '../lib/i18n';
import { useAppStore } from '../store/useAppStore';

export const CartDrawer: React.FC = () => {
  const { items, isOpen, closeCart, updateQuantity, removeItem, getSubtotal } = useCartStore();
  const { t, language, isRTL } = useLanguageStore();
  const { settings } = useAppStore();
  const translations = t();

  if (!isOpen) return null;

  const subtotal = getSubtotal();
  const currencySymbol = language === 'ar' ? settings.currency_ar || 'د.ج' : settings.currency || 'DA';

  const formatPrice = (num: number) => num.toLocaleString('fr-DZ');

  return (
    <div className="fixed inset-0 z-50 overflow-hidden animate-in fade-in duration-200">
      {/* Backdrop */}
      <div 
        onClick={closeCart}
        className="absolute inset-0 bg-slate-950/60 backdrop-blur-xs transition-opacity" 
      />

      <div className={`fixed inset-y-0 ${isRTL() ? 'left-0' : 'right-0'} w-full sm:w-auto sm:max-w-md flex`}>
        <div className="w-full bg-white shadow-2xl flex flex-col max-h-dvh">
          {/* Header */}
          <div className="p-3.5 sm:p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/70 shrink-0">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-amber-600" />
              <h2 className="font-extrabold text-base sm:text-lg text-slate-900">
                {translations.myCart} ({items.reduce((sum, i) => sum + i.quantity, 0)})
              </h2>
            </div>
            <button
              onClick={closeCart}
              className="p-2 text-slate-400 hover:text-slate-700 rounded-xl hover:bg-slate-200 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Body */}
          <div className="flex-1 overflow-y-auto p-3.5 sm:p-5 space-y-3 sm:space-y-4 overscroll-contain">
            {items.length === 0 ? (
              <div className="text-center py-12 sm:py-16 px-4">
                <div className="w-16 h-16 sm:w-20 sm:h-20 bg-amber-50 rounded-full flex items-center justify-center mx-auto text-amber-500 mb-4">
                  <ShoppingBag className="w-8 h-8 sm:w-10 sm:h-10" />
                </div>
                <h3 className="text-base font-bold text-slate-900 mb-1">
                  {translations.cartEmpty}
                </h3>
                <p className="text-xs text-slate-500 max-w-xs mx-auto mb-6">
                  {translations.cartEmptyDesc}
                </p>
                <button
                  onClick={closeCart}
                  className="inline-flex items-center gap-2 bg-slate-900 hover:bg-amber-500 hover:text-slate-950 text-white text-xs font-bold px-5 py-2.5 rounded-xl transition-colors"
                >
                  <span>{translations.continueShopping}</span>
                </button>
              </div>
            ) : (
              items.map(({ product, quantity }) => {
                const productName = language === 'ar' && product.name_ar ? product.name_ar : language === 'en' && product.name_en ? product.name_en : product.name;
                const hasDiscount = product.original_price && product.original_price > product.price;

                return (
                  <div
                    key={product.id}
                    className="flex gap-3 p-2.5 sm:p-3 rounded-2xl bg-slate-50 border border-slate-200/70 relative group"
                  >
                    {/* Thumbnail */}
                    <img
                      src={product.images[0] || 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=300&q=80'}
                      alt={productName}
                      className="w-16 h-16 sm:w-20 sm:h-20 object-cover rounded-xl bg-white shrink-0 border border-slate-200"
                    />

                    {/* Details */}
                    <div className="flex-1 min-w-0 flex flex-col justify-between">
                      <div>
                        <span className="text-[10px] font-bold text-amber-700 bg-amber-100/70 px-1.5 py-0.5 rounded uppercase">
                          {product.brand}
                        </span>
                        <h4 className="text-xs font-semibold text-slate-900 truncate mt-0.5 sm:mt-1">
                          {productName}
                        </h4>
                        
                        {/* Price */}
                        <div className="flex items-center gap-1.5 sm:gap-2 mt-0.5 sm:mt-1">
                          {hasDiscount && (
                            <span className="text-[10px] sm:text-[11px] text-red-500 line-through">
                              {formatPrice(product.original_price!)} {currencySymbol}
                            </span>
                          )}
                          <span className="text-xs sm:text-sm font-bold text-emerald-600">
                            {formatPrice(product.price)} {currencySymbol}
                          </span>
                        </div>
                      </div>

                      {/* Quantity Stepper */}
                      <div className="flex items-center justify-between mt-1.5 sm:mt-2 pt-1 border-t border-slate-200/50">
                        <div className="flex items-center gap-1 sm:gap-1.5 bg-white border border-slate-200 rounded-lg p-0.5">
                          <button
                            onClick={() => updateQuantity(product.id, quantity - 1)}
                            className="p-1 text-slate-500 hover:text-slate-900 rounded hover:bg-slate-100"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="text-xs font-bold text-slate-900 px-1.5 sm:px-2 min-w-5 sm:min-w-6 text-center">
                            {quantity}
                          </span>
                          <button
                            onClick={() => updateQuantity(product.id, quantity + 1)}
                            className="p-1 text-slate-500 hover:text-slate-900 rounded hover:bg-slate-100"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>

                        {/* Remove button */}
                        <button
                          onClick={() => removeItem(product.id)}
                          className="text-slate-400 hover:text-red-500 p-1 transition-colors"
                          title={translations.remove}
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Footer */}
          {items.length > 0 && (
            <div className="p-3.5 sm:p-5 border-t border-slate-200 bg-slate-50/90 space-y-2.5 sm:space-y-3 shrink-0">
              <div className="flex items-center justify-between text-sm text-slate-600">
                <span>{translations.subtotal}</span>
                <span className="text-base font-black text-slate-900">
                  {formatPrice(subtotal)} {currencySymbol}
                </span>
              </div>

              <div className="text-xs text-emerald-600 flex items-center gap-1">
                <span>✓</span>
                <span>{translations.codDescription}</span>
              </div>

              <div className="grid grid-cols-2 gap-2 pt-1">
                <button
                  onClick={closeCart}
                  className="w-full py-2.5 rounded-xl border border-slate-300 text-slate-700 font-semibold text-xs hover:bg-slate-100 transition-colors text-center"
                >
                  {translations.continueShopping}
                </button>
                <Link
                  to="/checkout"
                  onClick={closeCart}
                  className="w-full py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs shadow-md shadow-amber-500/20 flex items-center justify-center gap-1.5 transition-all"
                >
                  <span>{translations.checkout}</span>
                  {isRTL() ? <ArrowLeft className="w-3.5 h-3.5" /> : <ArrowRight className="w-3.5 h-3.5" />}
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
