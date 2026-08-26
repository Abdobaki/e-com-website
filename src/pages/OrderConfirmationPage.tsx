import React, { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import confetti from 'canvas-confetti';
import { 
  CheckCircle2, 
  Printer, 
  Home, 
  Phone, 
  MapPin, 
  MessageCircle 
} from 'lucide-react';

import { useLanguageStore } from '../lib/i18n';
import { useAppStore } from '../store/useAppStore';

export const OrderConfirmationPage: React.FC = () => {
  const { orderNumber } = useParams<{ orderNumber: string }>();
  const { t, language } = useLanguageStore();
  const { orders, settings } = useAppStore();
  const translations = t();

  const order = orders.find((o) => o.order_number === orderNumber);

  useEffect(() => {
    // Launch celebratory confetti
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 }
    });
  }, []);

  const handlePrint = () => {
    window.print();
  };

  const currencySymbol = language === 'ar' ? settings.currency_ar || 'د.ج' : settings.currency || 'DA';
  const formatPrice = (num: number) => num.toLocaleString('fr-DZ');

  if (!order) {
    return (
      <div className="max-w-md mx-auto px-4 py-24 text-center">
        <h2 className="text-xl font-bold text-slate-900 mb-2">{translations.orderNotFound}</h2>
        <p className="text-slate-500 text-sm mb-6">{translations.orderNotFoundDesc}</p>
        <Link to="/" className="bg-slate-900 text-white text-xs font-bold px-6 py-3 rounded-xl inline-block">
          {translations.backToHome}
        </Link>
      </div>
    );
  }

  const handleWhatsAppHelp = () => {
    const phone = settings.whatsapp_number.replace(/\D/g, '');
    const message = encodeURIComponent(
      language === 'ar'
        ? `السلام عليكم، لقد قمت بتسجيل الطلبية رقم ${order.order_number} وأود الاستفسار عنها.`
        : language === 'en'
        ? `Hello, I placed order #${order.order_number} and would like an update.`
        : `Bonjour, j'ai passé la commande N° ${order.order_number} et j'aimerais avoir un suivi.`
    );
    window.open(`https://wa.me/${phone}?text=${message}`, '_blank');
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12 space-y-8">
      {/* Header Banner */}
      <div className="bg-white rounded-3xl p-8 sm:p-10 border border-slate-200/80 shadow-sm text-center space-y-4">
        <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-inner">
          <CheckCircle2 className="w-12 h-12" />
        </div>

        <h1 className="text-2xl sm:text-3xl font-black text-slate-900">
          {translations.orderSuccessTitle}
        </h1>

        <p className="text-xs sm:text-sm text-slate-600 max-w-md mx-auto leading-relaxed">
          {translations.orderSuccessSubtitle}
        </p>

        {/* Order Number Badge */}
        <div className="inline-block bg-amber-50 border-2 border-amber-400/50 rounded-2xl px-6 py-3">
          <span className="text-xs text-amber-800 font-bold block uppercase tracking-wider">
            {translations.orderNumber}
          </span>
          <span className="text-xl sm:text-2xl font-black text-slate-950 tracking-wider">
            #{order.order_number}
          </span>
        </div>
      </div>

      {/* Invoice / Receipt Box */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs space-y-6">
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <div className="flex items-center gap-2.5">
            <img
              src="./logo.png"
              alt="cuisineDZ"
              className="w-8 h-8 object-contain rounded-lg"
            />
            <span className="font-black text-base text-slate-900">{settings.store_name}</span>
          </div>
          <button
            onClick={handlePrint}
            className="flex items-center gap-1.5 text-xs font-bold text-slate-700 hover:text-amber-600 bg-slate-100 px-3 py-1.5 rounded-xl transition-colors print:hidden"
          >
            <Printer className="w-4 h-4" />
            <span>{translations.printReceipt}</span>
          </button>
        </div>

        {/* Customer Information Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-1.5">
            <span className="text-slate-400 font-bold uppercase">{translations.customerInfo}</span>
            <p className="font-bold text-slate-900 text-sm">{order.customer_name}</p>
            <p className="text-slate-600 flex items-center gap-1">
              <Phone className="w-3.5 h-3.5 text-amber-600" />
              <span>{order.customer_phone}</span>
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-1.5">
            <span className="text-slate-400 font-bold uppercase">{translations.deliveryLocation}</span>
            <p className="font-bold text-slate-900 text-sm">{order.wilaya} — {order.commune}</p>
            <p className="text-slate-600 flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-amber-600" />
              <span>{order.address}</span>
            </p>
          </div>
        </div>

        {/* Order Items Table */}
        <div className="border-t border-slate-100 pt-4">
          <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-3">
            {translations.orderedItems}
          </h3>
          <div className="space-y-3">
            {(order.items || (order as any).order_items || []).map((item: any, idx: number) => (
              <div key={idx} className="flex items-center justify-between text-xs sm:text-sm py-2 border-b border-slate-100 last:border-0">
                <div className="flex items-center gap-3">
                  {item.product_image && (
                    <img src={item.product_image} alt="" className="w-10 h-10 rounded-lg object-cover border border-slate-200" />
                  )}
                  <div>
                    <span className="font-bold text-slate-900 block">{item.product_name}</span>
                    <span className="text-xs text-slate-500">{translations.quantity}: {item.quantity || 1}</span>
                  </div>
                </div>
                <span className="font-bold text-slate-900">
                  {formatPrice((item.product_price || 0) * (item.quantity || 1))} {currencySymbol}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Total Summary */}
        <div className="border-t border-slate-100 pt-4 space-y-2 text-xs sm:text-sm">
          <div className="flex justify-between text-slate-600">
            <span>{translations.subtotal}</span>
            <span className="font-bold text-slate-900">{formatPrice(order.subtotal)} {currencySymbol}</span>
          </div>
          <div className="flex justify-between text-slate-600">
            <span>{translations.deliveryFee}</span>
            <span className="font-bold text-slate-900">
              {order.delivery_fee > 0 ? `${formatPrice(order.delivery_fee)} ${currencySymbol}` : translations.freeDelivery}
            </span>
          </div>
          <div className="flex justify-between items-baseline pt-2 border-t border-slate-100 text-base font-black">
            <span className="text-slate-900">{translations.total}</span>
            <span className="text-xl font-black text-emerald-600">{formatPrice(order.total)} {currencySymbol}</span>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-3 print:hidden">
        <Link
          to="/"
          className="w-full sm:w-auto bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs px-8 py-3.5 rounded-2xl flex items-center justify-center gap-2 transition-colors"
        >
          <Home className="w-4 h-4" />
          <span>{translations.backToHome}</span>
        </Link>
        <button
          onClick={handleWhatsAppHelp}
          className="w-full sm:w-auto bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs px-8 py-3.5 rounded-2xl flex items-center justify-center gap-2 transition-colors"
        >
          <MessageCircle className="w-4 h-4" />
          <span>{translations.whatsAppHelp}</span>
        </button>
      </div>
    </div>
  );
};
