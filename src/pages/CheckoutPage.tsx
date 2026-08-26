import React, { useState, useMemo } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
  Truck, 
  User, 
  CheckCircle2, 
  ShoppingBag, 
  ArrowLeft,
  ArrowRight,
  AlertCircle
} from 'lucide-react';

import { useCartStore } from '../store/useCartStore';
import { useLanguageStore } from '../lib/i18n';
import { useAppStore } from '../store/useAppStore';
import { ALGERIA_WILAYAS, getWilayaByCode } from '../data/algeria';

export const CheckoutPage: React.FC = () => {
  const navigate = useNavigate();
  const { items, getSubtotal, clearCart } = useCartStore();
  const { t, language, isRTL } = useLanguageStore();
  const { settings, addOrder } = useAppStore();
  const translations = t();

  // Form State
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [selectedWilayaCode, setSelectedWilayaCode] = useState('16'); // Default to Alger
  const [selectedCommune, setSelectedCommune] = useState('');
  const [address, setAddress] = useState('');
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const subtotal = getSubtotal();

  // Selected Wilaya Object
  const currentWilaya = useMemo(() => {
    return getWilayaByCode(selectedWilayaCode) || ALGERIA_WILAYAS[15]; // fallback Alger
  }, [selectedWilayaCode]);

  // Set default commune when wilaya changes
  React.useEffect(() => {
    if (currentWilaya && currentWilaya.communes.length > 0) {
      setSelectedCommune(currentWilaya.communes[0]);
    }
  }, [currentWilaya]);

  // Check if order has free delivery (all items in cart have free delivery)
  const isFreeDeliveryOrder = items.length > 0 && items.every((item) => Boolean(item.product.is_free_delivery));

  // Calculate Delivery Fee based on admin toggle AND product-level free delivery
  const deliveryFee = (!isFreeDeliveryOrder && settings.delivery_enabled) ? currentWilaya.delivery_fee : 0;
  const total = subtotal + deliveryFee;

  const currencySymbol = language === 'ar' ? settings.currency_ar || 'د.ج' : settings.currency || 'DA';
  const formatPrice = (num: number) => num.toLocaleString('fr-DZ');

  if (items.length === 0) {
    return (
      <div className="max-w-md mx-auto px-4 py-24 text-center">
        <ShoppingBag className="w-16 h-16 text-amber-500 mx-auto mb-4" />
        <h2 className="text-xl font-bold text-slate-900 mb-2">{translations.cartEmpty}</h2>
        <Link
          to="/products"
          className="bg-slate-900 text-white text-xs font-bold px-6 py-3 rounded-xl inline-block mt-4"
        >
          {translations.continueShopping}
        </Link>
      </div>
    );
  }

  const handleSubmitOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!fullName.trim()) {
      setErrorMessage(language === 'ar' ? 'يرجى إدخال الاسم واللقب' : language === 'en' ? 'Please enter your full name.' : 'Veuillez saisir votre nom et prénom.');
      return;
    }

    if (!phone.trim() || phone.trim().length < 9) {
      setErrorMessage(language === 'ar' ? 'يرجى إدخال رقم هاتف صحيح (05/06/07...)' : language === 'en' ? 'Please enter a valid phone number.' : 'Veuillez saisir un numéro de téléphone valide.');
      return;
    }

    if (!address.trim()) {
      setErrorMessage(language === 'ar' ? 'يرجى إدخال العنوان الدقيق للتوصيل' : language === 'en' ? 'Please enter your exact delivery address.' : 'Veuillez saisir votre adresse exacte.');
      return;
    }

    try {
      setIsSubmitting(true);

      const orderItems = items.map((item) => ({
        product_id: item.product.id,
        product_name: item.product.name,
        product_price: item.product.price,
        product_image: item.product.images[0],
        quantity: item.quantity,
      }));

      const wilayaName = language === 'ar' ? currentWilaya.name_ar : currentWilaya.name_fr;

      const createdOrder = await addOrder({
        customer_name: fullName.trim(),
        customer_phone: phone.trim(),
        wilaya: wilayaName,
        wilaya_code: currentWilaya.code,
        commune: selectedCommune,
        address: address.trim(),
        notes: notes.trim() || undefined,
        payment_method: 'cod',
        items: orderItems,
        subtotal,
        delivery_fee: deliveryFee,
        total,
      });

      // Clear the cart
      clearCart();

      // Redirect to confirmation page
      navigate(`/order-confirmation/${createdOrder.order_number}`);
    } catch (err: any) {
      setErrorMessage(err.message || (language === 'ar' ? 'حدث خطأ أثناء تسجيل الطلب' : language === 'en' ? 'Error placing your order.' : 'Erreur lors de la validation de la commande.'));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-6 sm:py-10">
      <div className="mb-6 sm:mb-8">
        <h1 className="text-xl sm:text-2xl lg:text-3xl font-black text-slate-900 tracking-tight flex items-center gap-2 sm:gap-3">
          <Truck className="w-5 h-5 sm:w-7 sm:h-7 text-amber-600" />
          <span>{translations.checkout}</span>
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          {translations.codDescription}
        </p>
      </div>

      {errorMessage && (
        <div className="mb-6 p-3.5 sm:p-4 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-xs sm:text-sm flex items-center gap-3">
          <AlertCircle className="w-5 h-5 text-red-500 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      <form onSubmit={handleSubmitOrder} className="grid grid-cols-1 lg:grid-cols-12 gap-5 sm:gap-8 items-start">
        {/* Left: Shipping Form */}
        <div className="lg:col-span-7 bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-6 md:p-8 border border-slate-200/80 shadow-xs space-y-5 sm:space-y-6">
          <h2 className="font-extrabold text-base sm:text-lg text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-3">
            <User className="w-5 h-5 text-amber-600" />
            <span>{translations.customerInfo}</span>
          </h2>

          <div className="space-y-4">
            {/* Full Name */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                {translations.fullName} <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder={language === 'ar' ? 'مثال: محمد بن علي' : language === 'en' ? 'e.g. John Doe' : 'Ex: Mohamed Benali'}
                  className="w-full bg-slate-50 border border-slate-300 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 text-slate-900 px-3.5 sm:px-4 py-2.5 sm:py-3 rounded-xl text-base sm:text-sm outline-none transition-all"
                />
              </div>
            </div>

            {/* Phone Number */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                {translations.phone} <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="05 XX XX XX XX / 06 XX XX XX XX"
                  className="w-full bg-slate-50 border border-slate-300 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 text-slate-900 px-3.5 sm:px-4 py-2.5 sm:py-3 rounded-xl text-base sm:text-sm outline-none transition-all"
                />
              </div>
            </div>

            {/* Wilaya & Commune Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 sm:gap-4">
              {/* Wilaya */}
              <div className="min-w-0">
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  {translations.wilaya} <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <select
                    value={selectedWilayaCode}
                    onChange={(e) => setSelectedWilayaCode(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 text-slate-900 px-3 py-2.5 sm:py-3 rounded-xl text-base sm:text-sm outline-none transition-all cursor-pointer font-medium truncate"
                  >
                    {ALGERIA_WILAYAS.map((w) => (
                      <option key={w.code} value={w.code}>
                        {language === 'ar' ? w.name_ar : w.name_fr}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Dependent Commune */}
              <div className="min-w-0">
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  {translations.commune} <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <select
                    value={selectedCommune}
                    onChange={(e) => setSelectedCommune(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 text-slate-900 px-3 py-2.5 sm:py-3 rounded-xl text-base sm:text-sm outline-none transition-all cursor-pointer font-medium truncate"
                  >
                    {currentWilaya.communes.map((commune) => (
                      <option key={commune} value={commune}>
                        {commune}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Exact Address */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                {translations.address} <span className="text-red-500">*</span>
              </label>
              <textarea
                rows={2}
                required
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder={translations.addressPlaceholder}
                className="w-full bg-slate-50 border border-slate-300 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 text-slate-900 p-3 rounded-xl text-base sm:text-sm outline-none transition-all"
              />
            </div>

            {/* Order Notes */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                {translations.orderNotes}
              </label>
              <input
                type="text"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder={translations.orderNotesPlaceholder}
                className="w-full bg-slate-50 border border-slate-300 focus:border-amber-500 text-slate-900 px-3.5 sm:px-4 py-2 sm:py-2.5 rounded-xl text-base sm:text-xs outline-none transition-all"
              />
            </div>
          </div>

          {/* Payment Method (COD) */}
          <div className="pt-4 border-t border-slate-100">
            <h3 className="font-extrabold text-sm text-slate-900 mb-3">
              {translations.paymentMethod}
            </h3>
            <div className="p-3.5 sm:p-4 rounded-2xl bg-amber-50/70 border-2 border-amber-500/40 flex items-center justify-between gap-2">
              <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
                <div className="w-5 h-5 rounded-full bg-amber-500 flex items-center justify-center text-slate-950 shrink-0">
                  <CheckCircle2 className="w-4 h-4" />
                </div>
                <div className="min-w-0">
                  <span className="text-xs sm:text-sm font-bold text-slate-900 block truncate">
                    {translations.cashOnDelivery} (COD)
                  </span>
                  <span className="text-[11px] text-slate-600 block line-clamp-1 sm:line-clamp-none">
                    {translations.deliveryStepDesc}
                  </span>
                </div>
              </div>
              <span className="text-xs font-black text-amber-800 bg-amber-200/80 px-2 py-0.5 rounded shrink-0">
                {translations.free}
              </span>
            </div>
          </div>
        </div>

        {/* Right: Order Summary */}
        <div className="lg:col-span-5 bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-6 md:p-8 border border-slate-200/80 shadow-xs space-y-5 sm:space-y-6 sticky top-28">
          <h2 className="font-extrabold text-base sm:text-lg text-slate-900 border-b border-slate-100 pb-3 flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-amber-600" />
            <span>{translations.orderSummary}</span>
          </h2>

          {/* Order Items Preview */}
          <div className="space-y-2.5 sm:space-y-3 max-h-64 overflow-y-auto pr-1">
            {items.map(({ product, quantity }) => {
              const productName = language === 'ar' && product.name_ar ? product.name_ar : language === 'en' && product.name_en ? product.name_en : product.name;
              return (
                <div key={product.id} className="flex items-center gap-2.5 sm:gap-3 py-2 border-b border-slate-100 last:border-0">
                  <img
                    src={product.images[0]}
                    alt=""
                    className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl object-cover border border-slate-200 shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <h4 className="text-xs font-semibold text-slate-900 truncate">{productName}</h4>
                    <span className="text-[11px] text-slate-500">{translations.quantity}: {quantity}</span>
                  </div>
                  <span className="text-xs font-black text-slate-900 shrink-0">
                    {formatPrice(product.price * quantity)} {currencySymbol}
                  </span>
                </div>
              );
            })}
          </div>

          {/* Pricing calculations */}
          <div className="space-y-2.5 pt-4 border-t border-slate-100 text-sm">
            <div className="flex justify-between text-slate-600">
              <span>{translations.subtotal}</span>
              <span className="font-bold text-slate-900">
                {formatPrice(subtotal)} {currencySymbol}
              </span>
            </div>

            {/* Delivery fee row (Controlled by admin toggle & product free delivery) */}
            <div className="flex justify-between text-slate-600 items-center">
              <div>
                <span>{translations.deliveryFee}</span>
                <span className="text-xs text-slate-400 block">
                  ({language === 'ar' ? currentWilaya.name_ar : currentWilaya.name_fr})
                </span>
              </div>
              <span className="font-bold text-slate-900">
                {deliveryFee > 0 ? (
                  `${formatPrice(deliveryFee)} ${currencySymbol}`
                ) : (
                  <span className="text-emerald-600 font-extrabold">{translations.freeDelivery}</span>
                )}
              </span>
            </div>

            {/* Total */}
            <div className="pt-3 border-t border-slate-100 flex justify-between items-baseline">
              <span className="font-bold text-base text-slate-900">{translations.total}</span>
              <div className="text-right">
                <span className="text-2xl sm:text-3xl font-black text-emerald-600">
                  {formatPrice(total)}
                </span>
                <span className="text-emerald-700 font-bold ml-1">{currencySymbol}</span>
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-amber-500 hover:bg-amber-400 disabled:opacity-50 text-slate-950 font-black text-sm py-3.5 sm:py-4 rounded-xl sm:rounded-2xl shadow-xl shadow-amber-500/25 flex items-center justify-center gap-2 transition-all transform hover:-translate-y-0.5 active:translate-y-0"
          >
            {isSubmitting ? (
              <span>{translations.placingOrder}</span>
            ) : (
              <>
                <CheckCircle2 className="w-5 h-5" />
                <span>{translations.placeOrder}</span>
                {isRTL() ? <ArrowLeft className="w-4 h-4" /> : <ArrowRight className="w-4 h-4" />}
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};
