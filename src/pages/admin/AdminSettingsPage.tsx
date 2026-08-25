import React, { useState } from 'react';
import { 
  Store, 
  MessageCircle, 
  Truck, 
  Save, 
  CheckCircle2
} from 'lucide-react';
import { FacebookIcon, InstagramIcon } from '../../components/SocialIcons';
import { useLanguageStore } from '../../lib/i18n';
import { useAppStore } from '../../store/useAppStore';

export const AdminSettingsPage: React.FC = () => {
  const { t } = useLanguageStore();
  const { settings, updateSettings } = useAppStore();
  const translations = t();


  const [storeName, setStoreName] = useState(settings.store_name);
  const [storeTagline, setStoreTagline] = useState(settings.store_tagline);
  const [storePhone, setStorePhone] = useState(settings.store_phone);
  const [whatsappNumber, setWhatsappNumber] = useState(settings.whatsapp_number);
  const [facebookUrl, setFacebookUrl] = useState(settings.facebook_url);
  const [instagramUrl, setInstagramUrl] = useState(settings.instagram_url);
  const [email, setEmail] = useState(settings.email);
  const [address, setAddress] = useState(settings.address);
  const [deliveryEnabled, setDeliveryEnabled] = useState(settings.delivery_enabled);
  const [defaultDeliveryFee, setDefaultDeliveryFee] = useState(settings.default_delivery_fee);
  const [announcementText, setAnnouncementText] = useState(settings.announcement_text || '');
  const [announcementEnabled, setAnnouncementEnabled] = useState(settings.announcement_enabled ?? true);
  
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    await updateSettings({
      store_name: storeName,
      store_tagline: storeTagline,
      store_phone: storePhone,
      whatsapp_number: whatsappNumber,
      facebook_url: facebookUrl,
      instagram_url: instagramUrl,
      email,
      address,
      delivery_enabled: deliveryEnabled,
      default_delivery_fee: Number(defaultDeliveryFee),
      announcement_text: announcementText,
      announcement_enabled: announcementEnabled
    });

    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
          {translations.storeSettingsTitle}
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Personnalisez les coordonnées du magasin, vos réseaux sociaux et le calcul des frais de livraison.
        </p>
      </div>

      {savedSuccess && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl text-emerald-800 text-xs sm:text-sm font-bold flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-5 h-5 text-emerald-600" />
          <span>Paramètres du magasin enregistrés avec succès !</span>
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-6 text-xs">
        {/* 1. General Info */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs space-y-4">
          <h2 className="text-base font-extrabold text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-3">
            <Store className="w-5 h-5 text-amber-600" />
            <span>Informations Générales de la Boutique</span>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-bold text-slate-700 mb-1">
                {translations.storeName}
              </label>
              <input
                type="text"
                required
                value={storeName}
                onChange={(e) => setStoreName(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 p-2.5 rounded-xl font-bold text-slate-900 outline-none focus:border-amber-500"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">
                Slogan / Sous-titre
              </label>
              <input
                type="text"
                value={storeTagline}
                onChange={(e) => setStoreTagline(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 p-2.5 rounded-xl font-medium text-slate-900 outline-none focus:border-amber-500"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">
                {translations.storePhone}
              </label>
              <input
                type="text"
                required
                value={storePhone}
                onChange={(e) => setStorePhone(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 p-2.5 rounded-xl font-medium text-slate-900 outline-none focus:border-amber-500"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">
                Email de contact
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 p-2.5 rounded-xl font-medium text-slate-900 outline-none focus:border-amber-500"
              />
            </div>
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">
              {translations.storeAddress}
            </label>
            <input
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="w-full bg-slate-50 border border-slate-300 p-2.5 rounded-xl font-medium text-slate-900 outline-none focus:border-amber-500"
            />
          </div>
        </div>

        {/* 2. Social & WhatsApp Integration */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs space-y-4">
          <h2 className="text-base font-extrabold text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-3">
            <MessageCircle className="w-5 h-5 text-emerald-600" />
            <span>Intégration WhatsApp & Réseaux Sociaux</span>
          </h2>

          <div className="space-y-4">
            <div>
              <label className="block font-bold text-slate-700 mb-1">
                {translations.whatsappNumber} (Ex: 213550123456)
              </label>
              <div className="relative">
                <input
                  type="text"
                  required
                  value={whatsappNumber}
                  onChange={(e) => setWhatsappNumber(e.target.value)}
                  placeholder="213550123456"
                  className="w-full bg-slate-50 border border-slate-300 pl-10 pr-4 py-2.5 rounded-xl font-medium text-slate-900 outline-none focus:border-amber-500"
                />
                <MessageCircle className="w-4 h-4 text-emerald-600 absolute top-3 left-3" />
              </div>
              <p className="text-[11px] text-slate-500 mt-1">
                Ce numéro est utilisé automatiquement pour les boutons "Commander via WhatsApp".
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  {translations.facebookUrl}
                </label>
                <div className="relative">
                  <input
                    type="url"
                    value={facebookUrl}
                    onChange={(e) => setFacebookUrl(e.target.value)}
                    placeholder="https://facebook.com/..."
                    className="w-full bg-slate-50 border border-slate-300 pl-10 pr-4 py-2.5 rounded-xl font-medium text-slate-900 outline-none focus:border-amber-500"
                  />
                  <FacebookIcon className="w-4 h-4 text-blue-600 absolute top-3 left-3" />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  {translations.instagramUrl}
                </label>
                <div className="relative">
                  <input
                    type="url"
                    value={instagramUrl}
                    onChange={(e) => setInstagramUrl(e.target.value)}
                    placeholder="https://instagram.com/..."
                    className="w-full bg-slate-50 border border-slate-300 pl-10 pr-4 py-2.5 rounded-xl font-medium text-slate-900 outline-none focus:border-amber-500"
                  />
                  <InstagramIcon className="w-4 h-4 text-pink-600 absolute top-3 left-3" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 3. Delivery Fee Toggle (As specifically requested by the user!) */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs space-y-4">
          <h2 className="text-base font-extrabold text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-3">
            <Truck className="w-5 h-5 text-amber-600" />
            <span>Options de Livraison & Frais</span>
          </h2>

          <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200 flex items-center justify-between">
            <div className="max-w-md">
              <h3 className="font-bold text-slate-900 text-xs sm:text-sm">
                {translations.enableDeliveryFee}
              </h3>
              <p className="text-[11px] text-slate-600 mt-0.5">
                {translations.enableDeliveryFeeDesc}
              </p>
            </div>

            {/* Toggle Button */}
            <button
              type="button"
              onClick={() => setDeliveryEnabled(!deliveryEnabled)}
              className={`w-14 h-8 flex items-center rounded-full p-1 transition-colors duration-200 ease-in-out cursor-pointer ${
                deliveryEnabled ? 'bg-amber-500 justify-end' : 'bg-slate-300 justify-start'
              }`}
            >
              <div className="bg-white w-6 h-6 rounded-full shadow-md transform transition-transform" />
            </button>
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">
              {translations.defaultDeliveryFee}
            </label>
            <input
              type="number"
              min={0}
              value={defaultDeliveryFee}
              onChange={(e) => setDefaultDeliveryFee(Number(e.target.value))}
              className="w-full sm:w-64 bg-slate-50 border border-slate-300 p-2.5 rounded-xl font-bold text-slate-900 outline-none focus:border-amber-500"
            />
          </div>
        </div>

        {/* 4. Top Announcement Banner */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs space-y-4">
          <h2 className="text-base font-extrabold text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-3">
            <span>📢</span>
            <span>Bannière d'Annonce Supérieure</span>
          </h2>

          <div className="space-y-3">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={announcementEnabled}
                onChange={(e) => setAnnouncementEnabled(e.target.checked)}
                className="rounded text-amber-500 h-4 w-4"
              />
              <span className="font-bold text-slate-800">Afficher la barre d'annonce en haut du site</span>
            </label>

            <input
              type="text"
              value={announcementText}
              onChange={(e) => setAnnouncementText(e.target.value)}
              placeholder="Ex: 🔥 Livraison rapide 58 Wilayas | Paiement à la réception !"
              className="w-full bg-slate-50 border border-slate-300 p-2.5 rounded-xl font-medium text-slate-900 outline-none focus:border-amber-500"
            />
          </div>
        </div>

        {/* Submit */}
        <div className="flex justify-end pt-4">
          <button
            type="submit"
            className="bg-amber-500 hover:bg-amber-400 text-slate-950 px-8 py-3.5 rounded-2xl font-black text-xs sm:text-sm shadow-xl shadow-amber-500/20 flex items-center gap-2 transition-all"
          >
            <Save className="w-4 h-4" />
            <span>{translations.save}</span>
          </button>
        </div>
      </form>
    </div>
  );
};
