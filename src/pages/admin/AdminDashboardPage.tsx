import React from 'react';
import { Link } from 'react-router-dom';
import { 
  DollarSign, 
  ShoppingBag, 
  Clock, 
  AlertTriangle, 
  Plus, 
  MessageCircle,
  ArrowRight
} from 'lucide-react';

import { useLanguageStore } from '../../lib/i18n';
import { useAppStore } from '../../store/useAppStore';

export const AdminDashboardPage: React.FC = () => {
  const { t, language } = useLanguageStore();
  const { products, orders, settings } = useAppStore();
  const translations = t();


  // Metrics
  const totalRevenue = orders
    .filter((o) => o.status !== 'cancelled')
    .reduce((sum, o) => sum + o.total, 0);

  const pendingOrders = orders.filter((o) => o.status === 'pending');
  const lowStockProducts = products.filter((p) => p.stock <= 3);

  const currencySymbol = language === 'ar' ? settings.currency_ar || 'د.ج' : settings.currency || 'DA';
  const formatPrice = (num: number) => num.toLocaleString('fr-DZ');

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <span className="bg-amber-100 text-amber-800 text-xs font-bold px-2.5 py-1 rounded-full">{translations.statusPending}</span>;
      case 'confirmed':
        return <span className="bg-blue-100 text-blue-800 text-xs font-bold px-2.5 py-1 rounded-full">{translations.statusConfirmed}</span>;
      case 'preparing':
        return <span className="bg-purple-100 text-purple-800 text-xs font-bold px-2.5 py-1 rounded-full">{translations.statusPreparing}</span>;
      case 'shipped':
        return <span className="bg-indigo-100 text-indigo-800 text-xs font-bold px-2.5 py-1 rounded-full">{translations.statusShipped}</span>;
      case 'delivered':
        return <span className="bg-emerald-100 text-emerald-800 text-xs font-bold px-2.5 py-1 rounded-full">{translations.statusDelivered}</span>;
      case 'cancelled':
        return <span className="bg-red-100 text-red-800 text-xs font-bold px-2.5 py-1 rounded-full">{translations.statusCancelled}</span>;
      default:
        return null;
    }
  };

  const handleWhatsAppContact = (phone: string, orderNumber: string) => {
    const cleanPhone = phone.replace(/\D/g, '');
    const message = encodeURIComponent(
      `Bonjour, je vous contacte concernant votre commande N° ${orderNumber} passée sur ${settings.store_name}.`
    );
    window.open(`https://wa.me/213${cleanPhone.replace(/^0/, '')}?text=${message}`, '_blank');
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            {translations.dashboard}
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Bienvenue dans l'espace de gestion de votre magasin.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            to="/admin/products?action=new"
            className="bg-amber-500 hover:bg-amber-400 text-slate-950 px-4 py-2.5 rounded-xl font-bold text-xs flex items-center gap-2 shadow-md shadow-amber-500/20"
          >
            <Plus className="w-4 h-4" />
            <span>{translations.addNewProduct}</span>
          </Link>
        </div>
      </div>

      {/* Metrics 4-Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Revenue */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0">
            <DollarSign className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
              {translations.totalRevenue}
            </span>
            <span className="text-xl sm:text-2xl font-black text-slate-900 block mt-0.5">
              {formatPrice(totalRevenue)} <span className="text-xs text-slate-500 font-semibold">{currencySymbol}</span>
            </span>
          </div>
        </div>

        {/* Total Orders */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-blue-100 text-blue-600 flex items-center justify-center shrink-0">
            <ShoppingBag className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
              {translations.totalOrders}
            </span>
            <span className="text-xl sm:text-2xl font-black text-slate-900 block mt-0.5">
              {orders.length}
            </span>
          </div>
        </div>

        {/* Pending Orders */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-600 flex items-center justify-center shrink-0">
            <Clock className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
              {translations.pendingOrders}
            </span>
            <span className="text-xl sm:text-2xl font-black text-amber-600 block mt-0.5">
              {pendingOrders.length}
            </span>
          </div>
        </div>

        {/* Low Stock */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-red-100 text-red-600 flex items-center justify-center shrink-0">
            <AlertTriangle className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
              {translations.lowStockAlerts}
            </span>
            <span className="text-xl sm:text-2xl font-black text-red-600 block mt-0.5">
              {lowStockProducts.length}
            </span>
          </div>
        </div>
      </div>

      {/* Recent Orders Table */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-black text-slate-900">
              Commandes Récentes
            </h2>
            <p className="text-xs text-slate-500">Dernières commandes enregistrées sur la boutique</p>
          </div>
          <Link
            to="/admin/orders"
            className="text-xs font-bold text-amber-600 hover:text-amber-700 flex items-center gap-1"
          >
            <span>Voir toutes les commandes</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {orders.length === 0 ? (
          <p className="text-center py-10 text-xs text-slate-500">Aucune commande enregistrée pour le moment.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 uppercase font-bold text-[11px] border-y border-slate-100">
                <tr>
                  <th className="py-3 px-4">Commande</th>
                  <th className="py-3 px-4">Client</th>
                  <th className="py-3 px-4">Wilaya</th>
                  <th className="py-3 px-4">Total</th>
                  <th className="py-3 px-4">Statut</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {orders.slice(0, 5).map((order) => (
                  <tr key={order.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3.5 px-4 font-extrabold text-slate-900">
                      #{order.order_number}
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="font-bold text-slate-900 block">{order.customer_name}</span>
                      <span className="text-[11px] text-slate-400 block">{order.customer_phone}</span>
                    </td>
                    <td className="py-3.5 px-4 text-slate-600 font-medium">
                      {order.wilaya}
                    </td>
                    <td className="py-3.5 px-4 font-black text-emerald-600">
                      {formatPrice(order.total)} {currencySymbol}
                    </td>
                    <td className="py-3.5 px-4">
                      {getStatusBadge(order.status)}
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <button
                        onClick={() => handleWhatsAppContact(order.customer_phone, order.order_number)}
                        className="p-1.5 rounded-lg bg-emerald-50 text-emerald-600 hover:bg-emerald-500 hover:text-white transition-colors"
                        title="Contacter sur WhatsApp"
                      >
                        <MessageCircle className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Low Stock Alerts */}
      {lowStockProducts.length > 0 && (
        <div className="bg-red-50/70 border border-red-200 rounded-3xl p-6 sm:p-8 space-y-4">
          <div className="flex items-center gap-2 text-red-700 font-bold text-sm">
            <AlertTriangle className="w-5 h-5" />
            <span>Articles à stock critique (≤ 3 unités)</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {lowStockProducts.map((p) => (
              <div key={p.id} className="bg-white rounded-2xl p-4 border border-red-200 flex items-center justify-between">
                <div className="min-w-0 pr-3">
                  <h4 className="text-xs font-bold text-slate-900 truncate">{p.name}</h4>
                  <span className="text-[11px] text-red-600 font-extrabold">
                    {p.stock === 0 ? 'Rupture de stock' : `Il reste seulement ${p.stock} unités`}
                  </span>
                </div>
                <Link
                  to="/admin/stock"
                  className="px-3 py-1.5 bg-slate-900 text-white rounded-xl text-xs font-semibold shrink-0"
                >
                  Gérer
                </Link>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
