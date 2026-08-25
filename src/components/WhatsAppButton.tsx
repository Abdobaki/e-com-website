import React from 'react';
import { MessageCircle } from 'lucide-react';
import { useLanguageStore } from '../lib/i18n';
import { useAppStore } from '../store/useAppStore';

export const WhatsAppButton: React.FC = () => {
  const { t, language, isRTL } = useLanguageStore();
  const { settings } = useAppStore();
  const translations = t();

  const handleWhatsAppClick = () => {
    const phone = settings.whatsapp_number.replace(/\D/g, '');
    const message = encodeURIComponent(
      language === 'ar'
        ? 'مرحباً، أود الاستفسار والطلب من متجركم.'
        : 'Bonjour, je souhaite commander un produit de votre boutique.'
    );
    window.open(`https://wa.me/${phone}?text=${message}`, '_blank');
  };

  return (
    <div className={`fixed bottom-6 ${isRTL() ? 'left-6' : 'right-6'} z-40 flex items-center gap-3`}>
      <button
        onClick={handleWhatsAppClick}
        className="group relative flex items-center gap-2.5 bg-emerald-500 hover:bg-emerald-600 text-white p-3.5 sm:px-4 sm:py-3 rounded-full shadow-2xl shadow-emerald-600/40 hover:scale-105 active:scale-95 transition-all duration-300 border-2 border-white"
        title={translations.orderViaWhatsApp}
      >
        <MessageCircle className="w-6 h-6 fill-current animate-bounce" />
        <span className="hidden sm:inline font-bold text-xs">
          {translations.orderViaWhatsApp}
        </span>
        
        {/* Ping animation indicator */}
        <span className="absolute -top-1 -right-1 flex h-3.5 w-3.5">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-300 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-emerald-400"></span>
        </span>
      </button>
    </div>
  );
};
