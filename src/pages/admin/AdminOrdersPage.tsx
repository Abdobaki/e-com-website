import React, { useState } from 'react';
import { 
  Search, 
  MessageCircle, 
  Eye, 
  Trash2,
  X
} from 'lucide-react';
import { useLanguageStore } from '../../lib/i18n';
import { useAppStore } from '../../store/useAppStore';
import type { Order, OrderStatus, OrderItem } from '../../types';

export const AdminOrdersPage: React.FC = () => {
  const { t, language } = useLanguageStore();
  const { orders, settings, updateOrderStatus, deleteOrder } = useAppStore();
  const translations = t();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  const currencySymbol = language === 'ar' ? settings.currency_ar || 'د.ج' : settings.currency || 'DA';
  const formatPrice = (num: number) => num.toLocaleString('fr-DZ');

  const handleDeleteOrder = (orderId: string, orderNumber: string) => {
    const confirmMsg = language === 'ar'
      ? `هل أنت متأكد من حذف الطلبية #${orderNumber}؟`
      : `Êtes-vous sûr de vouloir supprimer la commande #${orderNumber} ?`;
    if (window.confirm(confirmMsg)) {
      deleteOrder(orderId);
      if (selectedOrder?.id === orderId) {
        setSelectedOrder(null);
      }
    }
  };

  const filteredOrders = orders.filter((order) => {
    if (selectedStatus !== 'all' && order.status !== selectedStatus) {
      return false;
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        order.order_number.toLowerCase().includes(q) ||
        order.customer_name.toLowerCase().includes(q) ||
        order.customer_phone.includes(q) ||
        order.wilaya.toLowerCase().includes(q)
      );
    }
    return true;
  });



  const handleWhatsAppContact = (order: Order) => {
    const cleanPhone = order.customer_phone.replace(/\D/g, '');
    const message = encodeURIComponent(
      `Bonjour ${order.customer_name},\nJe vous contacte au sujet de votre commande N° ${order.order_number} (${formatPrice(order.total)} ${currencySymbol}) passée sur notre boutique ${settings.store_name}.`
    );
    window.open(`https://wa.me/213${cleanPhone.replace(/^0/, '')}?text=${message}`, '_blank');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            {translations.orders} ({orders.length})
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Suivez l'état des commandes, expéditions et coordonnées clients.
          </p>
        </div>
      </div>

      {/* Filter Tabs & Search */}
      <div className="bg-white rounded-3xl p-4 sm:p-6 border border-slate-200/80 shadow-xs space-y-4">
        {/* Status Filters */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 no-scrollbar">
          {[
            { id: 'all', label: 'Toutes les commandes' },
            { id: 'pending', label: translations.statusPending },
            { id: 'confirmed', label: translations.statusConfirmed },
            { id: 'preparing', label: translations.statusPreparing },
            { id: 'shipped', label: translations.statusShipped },
            { id: 'delivered', label: translations.statusDelivered },
            { id: 'cancelled', label: translations.statusCancelled },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setSelectedStatus(tab.id)}
              className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-colors ${
                selectedStatus === tab.id
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="relative">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Rechercher par N° commande, nom du client, téléphone ou wilaya..."
            className="w-full bg-slate-50 border border-slate-200 text-slate-900 pl-10 pr-4 py-2.5 rounded-xl text-xs outline-none focus:border-amber-500"
          />
          <Search className="w-4 h-4 text-slate-400 absolute top-3 left-3" />
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs overflow-hidden">
        {filteredOrders.length === 0 ? (
          <div className="p-12 text-center text-xs text-slate-500">
            Aucune commande trouvée.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 uppercase font-bold text-[11px] border-b border-slate-100">
                <tr>
                  <th className="py-3.5 px-4">N° Commande</th>
                  <th className="py-3.5 px-4">Date</th>
                  <th className="py-3.5 px-4">Client</th>
                  <th className="py-3.5 px-4">Lieu</th>
                  <th className="py-3.5 px-4">Montant Total</th>
                  <th className="py-3.5 px-4">Statut</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3.5 px-4 font-black text-slate-900">
                      #{order.order_number}
                    </td>
                    <td className="py-3.5 px-4 text-slate-500">
                      {new Date(order.created_at).toLocaleDateString('fr-DZ', {
                        day: '2-digit',
                        month: 'short',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="font-bold text-slate-900 block">{order.customer_name}</span>
                      <span className="text-[11px] text-slate-500">{order.customer_phone}</span>
                    </td>
                    <td className="py-3.5 px-4 text-slate-700 font-medium">
                      {order.wilaya}
                    </td>
                    <td className="py-3.5 px-4 font-black text-emerald-600 text-sm">
                      {formatPrice(order.total)} {currencySymbol}
                    </td>
                    <td className="py-3.5 px-4">
                      <select
                        value={order.status}
                        onChange={(e) => updateOrderStatus(order.id, e.target.value as OrderStatus)}
                        className="bg-slate-100 border border-slate-200 text-slate-800 text-[11px] font-bold py-1 px-2 rounded-lg cursor-pointer outline-none"
                      >
                        <option value="pending">En attente</option>
                        <option value="confirmed">Confirmée</option>
                        <option value="preparing">En préparation</option>
                        <option value="shipped">Expédiée</option>
                        <option value="delivered">Livrée</option>
                        <option value="cancelled">Annulée</option>
                      </select>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleWhatsAppContact(order)}
                          className="p-1.5 rounded-lg bg-emerald-50 text-emerald-600 hover:bg-emerald-600 hover:text-white transition-colors"
                          title="WhatsApp direct"
                        >
                          <MessageCircle className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setSelectedOrder(order)}
                          className="p-1.5 rounded-lg bg-slate-100 text-slate-700 hover:bg-amber-500 hover:text-slate-950 transition-colors"
                          title="Détails"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteOrder(order.id, order.order_number)}
                          className="p-1.5 rounded-lg bg-red-50 text-red-600 hover:bg-red-600 hover:text-white transition-colors"
                          title="Supprimer la commande"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Order Detail Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-slate-200 my-8 space-y-6">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div>
                <span className="text-xs text-slate-400 font-bold uppercase">Commande</span>
                <h3 className="text-xl font-black text-slate-900">#{selectedOrder.order_number}</h3>
              </div>
              <button
                onClick={() => setSelectedOrder(null)}
                className="p-2 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Client info */}
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-500 font-medium">Client :</span>
                <span className="font-bold text-slate-900">{selectedOrder.customer_name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500 font-medium">Téléphone :</span>
                <span className="font-bold text-slate-900">{selectedOrder.customer_phone}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500 font-medium">Wilaya / Commune :</span>
                <span className="font-bold text-slate-900">{selectedOrder.wilaya} — {selectedOrder.commune}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500 font-medium">Adresse :</span>
                <span className="font-bold text-slate-900">{selectedOrder.address}</span>
              </div>
              {selectedOrder.notes && (
                <div className="flex justify-between pt-1 border-t border-slate-200">
                  <span className="text-slate-500 font-medium">Notes :</span>
                  <span className="font-bold text-amber-700">{selectedOrder.notes}</span>
                </div>
              )}
            </div>

            {/* Items */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold text-slate-900 uppercase">Articles</h4>
              <div className="space-y-2 max-h-48 overflow-y-auto">
                {selectedOrder.items.map((item: OrderItem, idx: number) => (
                  <div key={idx} className="flex justify-between items-center text-xs p-2 rounded-xl bg-slate-50">
                    <span className="font-semibold text-slate-800">{item.product_name} (x{item.quantity})</span>
                    <span className="font-bold text-slate-900">{formatPrice(item.product_price * item.quantity)} {currencySymbol}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Totals */}
            <div className="border-t border-slate-100 pt-3 space-y-1.5 text-xs">
              <div className="flex justify-between text-slate-600">
                <span>Sous-total</span>
                <span>{formatPrice(selectedOrder.subtotal)} {currencySymbol}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Frais de livraison</span>
                <span>{selectedOrder.delivery_fee > 0 ? `${formatPrice(selectedOrder.delivery_fee)} ${currencySymbol}` : 'Gratuite'}</span>
              </div>
              <div className="flex justify-between text-base font-black text-slate-900 pt-2 border-t border-slate-200">
                <span>Total</span>
                <span className="text-emerald-600">{formatPrice(selectedOrder.total)} {currencySymbol}</span>
              </div>
            </div>

            {/* Actions */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-2">
              <button
                onClick={() => handleWhatsAppContact(selectedOrder)}
                className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs py-3 rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/20"
              >
                <MessageCircle className="w-4 h-4" />
                <span>WhatsApp</span>
              </button>
              <button
                onClick={() => handleDeleteOrder(selectedOrder.id, selectedOrder.order_number)}
                className="w-full bg-red-50 hover:bg-red-600 hover:text-white text-red-600 font-bold text-xs py-3 rounded-xl flex items-center justify-center gap-2 transition-colors border border-red-200"
              >
                <Trash2 className="w-4 h-4" />
                <span>Supprimer</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
