import React from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  Building2,
  Phone,
  MapPin,
  ArrowLeft,
  Package,
  CreditCard,
  Clock,
  Edit,
  MessageCircle,
  Tag
} from 'lucide-react';
import { useLanguageStore } from '../../lib/i18n';
import { useAppStore } from '../../store/useAppStore';

export const AdminSupplierDetailPage: React.FC = () => {
  const { supplierId } = useParams<{ supplierId: string }>();
  const { language } = useLanguageStore();
  const { suppliers, products, supplierPayments, settings } = useAppStore();

  const currencySymbol = language === 'ar' ? settings.currency_ar || 'د.ج' : settings.currency || 'DA';
  const formatPrice = (num: number) => num.toLocaleString('fr-DZ');

  const supplier = suppliers.find((s) => s.id === supplierId);

  if (!supplier) {
    return (
      <div className="text-center py-20">
        <Building2 className="w-12 h-12 text-slate-300 mx-auto mb-3" />
        <h2 className="text-lg font-black text-slate-900 mb-2">Fournisseur introuvable</h2>
        <Link to="/admin/suppliers" className="text-amber-600 font-bold text-xs underline">
          ← Retour à la liste des fournisseurs
        </Link>
      </div>
    );
  }

  // Products sourced from this supplier
  const supplierProducts = products.filter(
    (p) => p.supplier && p.supplier.toLowerCase() === supplier.name.toLowerCase()
  );

  // Payments made to this supplier
  const supplierPaymentsList = supplierPayments.filter(
    (pay) => pay.supplier_name.toLowerCase() === supplier.name.toLowerCase()
  );

  // Financial Aggregation
  const totalCost = supplierProducts.reduce(
    (sum, p) => sum + (p.cost_price || 0) * Math.max(p.stock, 1), 0
  );
  const totalPaid = supplierPaymentsList.reduce(
    (sum, pay) => sum + pay.amount_paid, 0
  );
  const totalSellValue = supplierProducts.reduce(
    (sum, p) => sum + p.price * Math.max(p.stock, 1), 0
  );
  const expectedProfit = totalSellValue - totalCost;
  const remaining = Math.max(0, totalCost - totalPaid);

  return (
    <div className="space-y-6">
      {/* Back Button */}
      <Link
        to="/admin/suppliers"
        className="inline-flex items-center gap-2 text-slate-500 hover:text-slate-900 text-xs font-bold transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Retour à la liste des fournisseurs</span>
      </Link>

      {/* Supplier Header Card */}
      <div className="bg-gradient-to-br from-slate-900 to-slate-950 rounded-3xl p-6 sm:p-8 text-white border border-slate-800 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-40 h-40 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col sm:flex-row sm:items-center gap-5 relative z-10">
          <div className="w-16 h-16 rounded-2xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center shrink-0 border border-indigo-500/30">
            <Building2 className="w-8 h-8" />
          </div>

          <div className="flex-1 space-y-2">
            <h1 className="text-xl sm:text-2xl font-black tracking-tight">
              {supplier.name}
            </h1>
            <div className="flex flex-wrap items-center gap-4 text-xs text-slate-300">
              <span className="flex items-center gap-1.5">
                <Phone className="w-3.5 h-3.5 text-amber-400" />
                <span className="font-bold">{supplier.phone}</span>
              </span>
              {supplier.address && (
                <span className="flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-emerald-400" />
                  <span>{supplier.address}</span>
                </span>
              )}
            </div>
            {supplier.notes && (
              <p className="text-xs text-slate-400 italic">{supplier.notes}</p>
            )}
          </div>

          {/* WhatsApp Supplier Quick Contact */}
          <a
            href={`https://wa.me/${supplier.phone.replace(/^0/, '213').replace(/\D/g, '')}`}
            target="_blank"
            rel="noreferrer"
            className="bg-emerald-600 hover:bg-emerald-500 text-white px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 transition-colors shrink-0"
          >
            <MessageCircle className="w-4 h-4" />
            <span>WhatsApp</span>
          </a>
        </div>
      </div>

      {/* Financial Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Products Count */}
        <div className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Produits Achetés</span>
            <Package className="w-4 h-4 text-indigo-500" />
          </div>
          <span className="text-2xl font-black text-slate-900 block">{supplierProducts.length}</span>
          <span className="text-[11px] text-slate-500">articles de ce fournisseur</span>
        </div>

        {/* Total Cost (Achat) */}
        <div className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Total Achat (Coût)</span>
            <Tag className="w-4 h-4 text-blue-500" />
          </div>
          <span className="text-2xl font-black text-slate-900 block">{formatPrice(totalCost)} <span className="text-xs font-semibold text-slate-500">{currencySymbol}</span></span>
          <span className="text-[11px] text-slate-500">valeur du stock acheté</span>
        </div>

        {/* Total Paid */}
        <div className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Total Payé</span>
            <CreditCard className="w-4 h-4 text-emerald-500" />
          </div>
          <span className="text-2xl font-black text-emerald-600 block">{formatPrice(totalPaid)} <span className="text-xs font-semibold text-slate-500">{currencySymbol}</span></span>
          <span className="text-[11px] text-slate-500">{supplierPaymentsList.length} versements enregistrés</span>
        </div>

        {/* Remaining Debt */}
        <div className={`rounded-3xl p-5 border shadow-xs ${remaining > 0 ? 'bg-red-50 border-red-200' : 'bg-emerald-50 border-emerald-200'}`}>
          <div className="flex items-center justify-between mb-2">
            <span className={`text-[11px] font-bold uppercase tracking-wider ${remaining > 0 ? 'text-red-600' : 'text-emerald-600'}`}>
              {remaining > 0 ? 'Reste à Payer' : 'Soldé ✓'}
            </span>
          </div>
          <span className={`text-2xl font-black block ${remaining > 0 ? 'text-red-600' : 'text-emerald-600'}`}>
            {formatPrice(remaining)} <span className="text-xs font-semibold text-slate-500">{currencySymbol}</span>
          </span>
          {expectedProfit > 0 && (
            <span className="text-[11px] text-emerald-700 font-semibold">
              Bénéfice potentiel sur stock : +{formatPrice(expectedProfit)} {currencySymbol}
            </span>
          )}
        </div>
      </div>

      {/* Products from this Supplier */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="p-5 border-b border-slate-100 bg-slate-50/60">
          <h2 className="font-extrabold text-base text-slate-900">
            Produits achetés auprès de « {supplier.name} »
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Liste de tous les articles en catalogue provenant de ce fournisseur
          </p>
        </div>

        {supplierProducts.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 uppercase font-bold text-[11px] border-b border-slate-100">
                <tr>
                  <th className="py-3.5 px-4">Produit</th>
                  <th className="py-3.5 px-4">Catégorie</th>
                  <th className="py-3.5 px-4">Prix de Vente</th>
                  <th className="py-3.5 px-4">Prix d'Achat</th>
                  <th className="py-3.5 px-4">Bénéfice / Unité</th>
                  <th className="py-3.5 px-4">Stock</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {supplierProducts.map((product) => {
                  const profit = product.cost_price ? product.price - product.cost_price : undefined;
                  const margin = product.cost_price && product.price > 0
                    ? Math.round(((product.price - product.cost_price) / product.price) * 100)
                    : undefined;

                  return (
                    <tr key={product.id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={product.images[0]}
                            alt=""
                            className="w-11 h-11 rounded-xl object-cover border border-slate-200 shrink-0 bg-slate-100"
                          />
                          <div>
                            <span className="text-[10px] font-extrabold uppercase text-amber-700 bg-amber-50 px-1.5 rounded">
                              {product.brand}
                            </span>
                            <h4 className="font-bold text-slate-900 truncate max-w-xs mt-0.5">{product.name}</h4>
                          </div>
                        </div>
                      </td>
                      <td className="py-3.5 px-4 text-slate-600 font-medium">
                        {product.category_slug || '—'}
                      </td>
                      <td className="py-3.5 px-4 font-black text-emerald-600">
                        {formatPrice(product.price)} {currencySymbol}
                      </td>
                      <td className="py-3.5 px-4 font-bold text-slate-900">
                        {product.cost_price ? `${formatPrice(product.cost_price)} ${currencySymbol}` : '—'}
                      </td>
                      <td className="py-3.5 px-4">
                        {profit !== undefined ? (
                          <div>
                            <span className={`font-black ${profit >= 0 ? 'text-emerald-700' : 'text-red-600'}`}>
                              {profit >= 0 ? '+' : ''}{formatPrice(profit)} {currencySymbol}
                            </span>
                            {margin !== undefined && (
                              <span className="text-[10px] text-emerald-600 font-bold bg-emerald-50 px-1.5 py-0.5 rounded ml-1">
                                {margin}%
                              </span>
                            )}
                          </div>
                        ) : (
                          <span className="text-slate-400">—</span>
                        )}
                      </td>
                      <td className="py-3.5 px-4">
                        <span className={`font-bold px-2.5 py-1 rounded-full text-[11px] ${
                          product.stock <= 0
                            ? 'bg-red-100 text-red-700'
                            : product.stock <= 3
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-emerald-100 text-emerald-800'
                        }`}>
                          {product.stock} unités
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <Link
                          to={`/admin/products`}
                          className="p-1.5 rounded-lg bg-slate-100 text-slate-700 hover:bg-amber-500 hover:text-slate-950 transition-colors inline-flex"
                          title="Modifier"
                        >
                          <Edit className="w-4 h-4" />
                        </Link>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-12">
            <Package className="w-10 h-10 text-slate-300 mx-auto mb-2" />
            <p className="text-sm font-bold text-slate-500">
              Aucun produit enregistré pour ce fournisseur.
            </p>
            <p className="text-xs text-slate-400 mt-1">
              Pour lier des produits à ce fournisseur, renseignez le champ <strong>« Fournisseur »</strong> dans la fiche produit avec exactement le nom <strong>« {supplier.name} »</strong>.
            </p>
          </div>
        )}
      </div>

      {/* Payment History for this Supplier */}
      {supplierPaymentsList.length > 0 && (
        <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs overflow-hidden">
          <div className="p-5 border-b border-slate-100 bg-slate-50/60">
            <h2 className="font-extrabold text-base text-slate-900">
              Historique des Versements à « {supplier.name} »
            </h2>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 uppercase font-bold text-[11px] border-b border-slate-100">
                <tr>
                  <th className="py-3.5 px-4">Date & Heure</th>
                  <th className="py-3.5 px-4">Article</th>
                  <th className="py-3.5 px-4">Montant</th>
                  <th className="py-3.5 px-4">Mode</th>
                  <th className="py-3.5 px-4">Notes</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {supplierPaymentsList.map((payment) => (
                  <tr key={payment.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-1.5 font-bold text-slate-900">
                        <Clock className="w-3.5 h-3.5 text-amber-600" />
                        <span>{payment.payment_date}</span>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 text-slate-600 font-medium truncate max-w-xs">
                      {payment.product_name}
                    </td>
                    <td className="py-3.5 px-4 font-black text-emerald-600">
                      +{formatPrice(payment.amount_paid)} {currencySymbol}
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="bg-slate-100 text-slate-800 text-[10px] font-extrabold uppercase px-2 py-0.5 rounded">
                        {payment.payment_method}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-slate-500">
                      {payment.notes || '—'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
