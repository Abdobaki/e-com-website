import React, { useState } from 'react';
import { 
  Boxes, 
  Search, 
  Plus, 
  Minus, 
  AlertTriangle, 
  CheckCircle2, 
  XCircle, 
  Building2, 
  CreditCard, 
  Clock, 
  Receipt, 
  X,
  TrendingUp,
  Wallet
} from 'lucide-react';

import { useLanguageStore } from '../../lib/i18n';
import { useAppStore } from '../../store/useAppStore';
import { ProfitChart } from '../../components/ProfitChart';
import type { Product } from '../../types';

export const AdminStockPage: React.FC = () => {
  const { language } = useLanguageStore();
  const { products, supplierPayments, settings, updateStock, addSupplierPayment } = useAppStore();


  // Tab State: 'stock' | 'suppliers' | 'history'
  const [activeTab, setActiveTab] = useState<'analytics' | 'stock' | 'suppliers' | 'history'>('analytics');
  const [searchQuery, setSearchQuery] = useState('');
  const [stockFilter, setStockFilter] = useState<'all' | 'available' | 'low' | 'out'>('all');
  const [successToast, setSuccessToast] = useState<string | null>(null);

  // Payment Modal State
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [paymentProduct, setPaymentProduct] = useState<Product | null>(null);
  const [supplierName, setSupplierName] = useState('');
  const [paymentAmount, setPaymentAmount] = useState<number>(0);
  const [paymentDateTime, setPaymentDateTime] = useState<string>(() => {
    const now = new Date();
    const pad = (n: number) => n.toString().padStart(2, '0');
    return `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}T${pad(now.getHours())}:${pad(now.getMinutes())}`;
  });
  const [paymentMethod, setPaymentMethod] = useState<'cash' | 'virement' | 'cheque' | 'baridimob'>('cash');
  const [paymentNotes, setPaymentNotes] = useState('');

  const currencySymbol = language === 'ar' ? settings.currency_ar || 'د.ج' : settings.currency || 'DA';
  const formatPrice = (num: number) => num.toLocaleString('fr-DZ');

  // Supplier Financial Calculations
  const supplierAnalytics = React.useMemo(() => {
    let totalInventoryCost = 0;
    let totalPaidToSuppliers = 0;

    products.forEach((p) => {
      const unitCost = p.cost_price || 0;
      const totalBatchCost = unitCost * Math.max(p.stock, 1);
      const paid = p.supplier_paid || 0;
      totalInventoryCost += totalBatchCost;
      totalPaidToSuppliers += paid;
    });

    // Also include standalone supplier payments
    const standalonePayments = supplierPayments.reduce((sum, pay) => sum + pay.amount_paid, 0);
    const finalTotalPaid = Math.max(totalPaidToSuppliers, standalonePayments);
    const remainingDebt = Math.max(0, totalInventoryCost - finalTotalPaid);

    return {
      totalInventoryCost,
      totalPaid: finalTotalPaid,
      remainingDebt
    };
  }, [products, supplierPayments]);

  const handleStockChange = async (id: string, newStock: number) => {
    await updateStock(id, newStock);
    setSuccessToast('Stock mis à jour !');
    setTimeout(() => setSuccessToast(null), 2000);
  };

  const handleOpenPaymentModal = (product?: Product) => {
    if (product) {
      setPaymentProduct(product);
      setSupplierName(product.supplier || 'Fournisseur Principal');
      const unitCost = product.cost_price || 0;
      const totalCost = unitCost * Math.max(product.stock, 1);
      const alreadyPaid = product.supplier_paid || 0;
      const remaining = Math.max(0, totalCost - alreadyPaid);
      setPaymentAmount(remaining > 0 ? remaining : unitCost);
    } else {
      setPaymentProduct(null);
      setSupplierName('Grossiste El-Eulma');
      setPaymentAmount(50000);
    }

    const now = new Date();
    const pad = (n: number) => n.toString().padStart(2, '0');
    setPaymentDateTime(`${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}T${pad(now.getHours())}:${pad(now.getMinutes())}`);
    setPaymentNotes('');
    setIsPaymentModalOpen(true);
  };

  const handleRecordPayment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (paymentAmount <= 0) return;

    // Format formatted date time string e.g. 2026-08-24 14:30
    const formattedDate = paymentDateTime.replace('T', ' ');

    await addSupplierPayment({
      product_id: paymentProduct?.id,
      product_name: paymentProduct?.name || 'Paiement Fournisseur Global',
      supplier_name: supplierName || 'Fournisseur',
      amount_paid: Number(paymentAmount),
      payment_date: formattedDate,
      payment_method: paymentMethod,
      notes: paymentNotes.trim() || undefined
    });

    setIsPaymentModalOpen(false);
    setSuccessToast(`Paiement de ${formatPrice(paymentAmount)} DA enregistré avec succès !`);
    setTimeout(() => setSuccessToast(null), 3000);
  };

  const filteredProducts = products.filter((product) => {
    if (stockFilter === 'available' && product.stock <= 3) return false;
    if (stockFilter === 'low' && (product.stock === 0 || product.stock > 3)) return false;
    if (stockFilter === 'out' && product.stock > 0) return false;

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        product.name.toLowerCase().includes(q) ||
        product.brand.toLowerCase().includes(q) ||
        (product.supplier && product.supplier.toLowerCase().includes(q))
      );
    }
    return true;
  });

  return (
    <div className="space-y-8">
      {/* Success Toast */}
      {successToast && (
        <div className="fixed bottom-10 right-6 z-50 bg-slate-900 text-white text-xs font-bold px-4 py-3 rounded-2xl shadow-2xl flex items-center gap-2 border border-slate-700 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{successToast}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Gestion du Stock & Suivi Financier
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Analyse des bénéfices quotidiens (DA/jour), gestion des fournisseurs et paiements échelonnés.
          </p>
        </div>

        <button
          onClick={() => handleOpenPaymentModal()}
          className="bg-emerald-600 hover:bg-emerald-500 text-white px-5 py-3 rounded-2xl font-black text-xs flex items-center gap-2 shadow-lg shadow-emerald-600/20 active:scale-95 transition-all"
        >
          <CreditCard className="w-4 h-4" />
          <span>+ Effectuer un Paiement Fournisseur</span>
        </button>
      </div>

      {/* Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-2 overflow-x-auto no-scrollbar">
        {[
          { id: 'analytics', label: '📊 Courbe de Bénéfices (DA/Jour)', icon: TrendingUp },
          { id: 'suppliers', label: '🏢 Dettes & Paiements Fournisseurs', icon: Building2 },
          { id: 'stock', label: '📦 Quantités en Stock (Entrepôt)', icon: Boxes },
          { id: 'history', label: '📜 Historique des Versements', icon: Receipt },
        ].map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-bold transition-all whitespace-nowrap ${
                activeTab === tab.id
                  ? 'bg-slate-900 text-white shadow-sm'
                  : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200/80'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* TAB 1: PROFIT GRAPH & DAILY ANALYTICS (منحنى بياني للأرباح اليومية) */}
      {activeTab === 'analytics' && (
        <div className="space-y-6">
          <ProfitChart />
        </div>
      )}

      {/* TAB 2: SUPPLIERS & DEBT MANAGEMENT (سداد ديون الموردين) */}
      {activeTab === 'suppliers' && (
        <div className="space-y-6">
          {/* Supplier Debt Metric Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            {/* Total Inventory Cost */}
            <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-blue-100 text-blue-600 flex items-center justify-center shrink-0">
                <Wallet className="w-6 h-6" />
              </div>
              <div>
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
                  Valeur Totale du Stock (Achat)
                </span>
                <span className="text-xl sm:text-2xl font-black text-slate-900 block mt-0.5">
                  {formatPrice(supplierAnalytics.totalInventoryCost)} <span className="text-xs text-slate-500 font-semibold">{currencySymbol}</span>
                </span>
              </div>
            </div>

            {/* Total Paid to Suppliers */}
            <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <div>
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
                  Total Payé aux Fournisseurs
                </span>
                <span className="text-xl sm:text-2xl font-black text-emerald-600 block mt-0.5">
                  {formatPrice(supplierAnalytics.totalPaid)} <span className="text-xs text-slate-500 font-semibold">{currencySymbol}</span>
                </span>
              </div>
            </div>

            {/* Remaining Debt */}
            <div className="bg-gradient-to-br from-red-50 to-amber-50 rounded-3xl p-6 border border-red-200 shadow-xs flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-red-500 text-white flex items-center justify-center shrink-0 shadow-md">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <div>
                <span className="text-xs font-bold text-red-700 uppercase tracking-wider block">
                  Reste à Payer (Dettes Fournisseurs)
                </span>
                <span className="text-xl sm:text-2xl font-black text-red-600 block mt-0.5">
                  {formatPrice(supplierAnalytics.remainingDebt)} <span className="text-xs text-red-500 font-semibold">{currencySymbol}</span>
                </span>
              </div>
            </div>
          </div>

          {/* Supplier Products & Payment List */}
          <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs overflow-hidden">
            <div className="p-5 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-50/60">
              <div>
                <h3 className="font-extrabold text-base text-slate-900">
                  Lots de Marchandises & État des Paiements Fournisseurs
                </h3>
                <p className="text-xs text-slate-500">
                  Payez vos fournisseurs à tout moment (par tranches ou en totalité)
                </p>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-slate-500 uppercase font-bold text-[11px] border-b border-slate-100">
                  <tr>
                    <th className="py-3.5 px-4">Fournisseur & Article</th>
                    <th className="py-3.5 px-4">Prix d'Achat Unitaire</th>
                    <th className="py-3.5 px-4">Total Dû (Stock)</th>
                    <th className="py-3.5 px-4">Déjà Payé</th>
                    <th className="py-3.5 px-4">Reste à Payer</th>
                    <th className="py-3.5 px-4">État</th>
                    <th className="py-3.5 px-4 text-right">Paiement</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {products.map((product) => {
                    const unitCost = product.cost_price || 0;
                    const totalCost = unitCost * Math.max(product.stock, 1);
                    const paid = product.supplier_paid || 0;
                    const remaining = Math.max(0, totalCost - paid);
                    const isFullyPaid = remaining === 0 && paid > 0;
                    const isPartiallyPaid = paid > 0 && remaining > 0;

                    return (
                      <tr key={product.id} className="hover:bg-slate-50/70 transition-colors">
                        <td className="py-3.5 px-4">
                          <div className="flex items-center gap-3">
                            <img
                              src={product.images[0]}
                              alt=""
                              className="w-10 h-10 rounded-xl object-cover border border-slate-200 shrink-0"
                            />
                            <div>
                              <span className="font-bold text-slate-900 block truncate max-w-xs">{product.name}</span>
                              <span className="text-[11px] text-amber-700 font-semibold flex items-center gap-1">
                                <Building2 className="w-3 h-3 text-amber-600" />
                                {product.supplier || 'Fournisseur non spécifié'}
                              </span>
                            </div>
                          </div>
                        </td>
                        <td className="py-3.5 px-4 font-semibold text-slate-800">
                          {unitCost > 0 ? `${formatPrice(unitCost)} ${currencySymbol}` : '—'}
                        </td>
                        <td className="py-3.5 px-4 font-bold text-slate-900">
                          {formatPrice(totalCost)} {currencySymbol}
                        </td>
                        <td className="py-3.5 px-4 font-black text-emerald-600">
                          {formatPrice(paid)} {currencySymbol}
                        </td>
                        <td className="py-3.5 px-4 font-black text-red-600">
                          {formatPrice(remaining)} {currencySymbol}
                        </td>
                        <td className="py-3.5 px-4">
                          {isFullyPaid ? (
                            <span className="bg-emerald-100 text-emerald-800 text-[10px] font-extrabold px-2.5 py-1 rounded-full">
                              Soldé (100%)
                            </span>
                          ) : isPartiallyPaid ? (
                            <span className="bg-amber-100 text-amber-800 text-[10px] font-extrabold px-2.5 py-1 rounded-full">
                              Partiel ({Math.round((paid / totalCost) * 100)}%)
                            </span>
                          ) : (
                            <span className="bg-red-100 text-red-700 text-[10px] font-extrabold px-2.5 py-1 rounded-full">
                              Impayé
                            </span>
                          )}
                        </td>
                        <td className="py-3.5 px-4 text-right">
                          <button
                            onClick={() => handleOpenPaymentModal(product)}
                            className="bg-slate-900 hover:bg-emerald-600 text-white font-bold text-xs px-3.5 py-1.5 rounded-xl flex items-center gap-1.5 ml-auto transition-colors"
                          >
                            <CreditCard className="w-3.5 h-3.5" />
                            <span>Payer</span>
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: PHYSICAL INVENTORY MANAGEMENT (تعديل كميات المخزون) */}
      {activeTab === 'stock' && (
        <div className="space-y-6">
          <div className="bg-white rounded-3xl p-4 sm:p-6 border border-slate-200/80 shadow-xs space-y-4">
            <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
              {[
                { id: 'all', label: 'Tous les produits', count: products.length },
                { id: 'available', label: 'En stock (> 3)', count: products.filter(p => p.stock > 3).length },
                { id: 'low', label: 'Stock Faible (1 - 3)', count: products.filter(p => p.stock > 0 && p.stock <= 3).length },
                { id: 'out', label: 'Rupture (0)', count: products.filter(p => p.stock === 0).length },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setStockFilter(tab.id as any)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-colors flex items-center gap-1.5 ${
                    stockFilter === tab.id
                      ? 'bg-slate-900 text-white shadow-xs'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  <span>{tab.label}</span>
                  <span className="text-[10px] opacity-70">({tab.count})</span>
                </button>
              ))}
            </div>

            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Rechercher un produit à ajuster..."
                className="w-full bg-slate-50 border border-slate-200 text-slate-900 pl-10 pr-4 py-2.5 rounded-xl text-xs outline-none focus:border-amber-500"
              />
              <Search className="w-4 h-4 text-slate-400 absolute top-3 left-3" />
            </div>
          </div>

          <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-slate-500 uppercase font-bold text-[11px] border-b border-slate-100">
                  <tr>
                    <th className="py-3.5 px-4">Produit</th>
                    <th className="py-3.5 px-4">Fournisseur</th>
                    <th className="py-3.5 px-4">Prix de Vente</th>
                    <th className="py-3.5 px-4">Prix d'Achat</th>
                    <th className="py-3.5 px-4">État Actuel</th>
                    <th className="py-3.5 px-4 text-right">Ajuster la quantité</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredProducts.map((product) => {
                    const isOutOfStock = product.stock <= 0;
                    const isLowStock = product.stock > 0 && product.stock <= 3;

                    return (
                      <tr key={product.id} className="hover:bg-slate-50/70 transition-colors">
                        <td className="py-3.5 px-4">
                          <div className="flex items-center gap-3">
                            <img
                              src={product.images[0]}
                              alt=""
                              className="w-12 h-12 rounded-xl object-cover border border-slate-200 shrink-0"
                            />
                            <div>
                              <span className="text-[10px] font-extrabold uppercase text-amber-700 bg-amber-50 px-1.5 py-0.2 rounded">
                                {product.brand}
                              </span>
                              <h4 className="font-bold text-slate-900 truncate mt-0.5 max-w-sm">{product.name}</h4>
                            </div>
                          </div>
                        </td>
                        <td className="py-3.5 px-4 text-slate-600 font-medium">
                          {product.supplier || '—'}
                        </td>
                        <td className="py-3.5 px-4 font-black text-emerald-600">
                          {formatPrice(product.price)} {currencySymbol}
                        </td>
                        <td className="py-3.5 px-4 font-bold text-slate-900">
                          {product.cost_price ? `${formatPrice(product.cost_price)} ${currencySymbol}` : '—'}
                        </td>
                        <td className="py-3.5 px-4">
                          {isOutOfStock ? (
                            <span className="bg-red-100 text-red-700 text-[11px] font-bold px-2.5 py-1 rounded-full flex items-center gap-1 w-fit">
                              <XCircle className="w-3.5 h-3.5" />
                              Rupture (0)
                            </span>
                          ) : isLowStock ? (
                            <span className="bg-amber-100 text-amber-800 text-[11px] font-bold px-2.5 py-1 rounded-full flex items-center gap-1 w-fit">
                              <AlertTriangle className="w-3.5 h-3.5" />
                              Stock Faible ({product.stock})
                            </span>
                          ) : (
                            <span className="bg-emerald-100 text-emerald-800 text-[11px] font-bold px-2.5 py-1 rounded-full flex items-center gap-1 w-fit">
                              <CheckCircle2 className="w-3.5 h-3.5" />
                              Disponible ({product.stock})
                            </span>
                          )}
                        </td>
                        <td className="py-3.5 px-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => handleStockChange(product.id, Math.max(0, product.stock - 1))}
                              className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold"
                            >
                              <Minus className="w-3.5 h-3.5" />
                            </button>
                            
                            <input
                              type="number"
                              min={0}
                              value={product.stock}
                              onChange={(e) => handleStockChange(product.id, Number(e.target.value))}
                              className="w-16 bg-slate-50 border border-slate-300 rounded-lg p-1 text-center font-black text-slate-900 text-xs"
                            />

                            <button
                              onClick={() => handleStockChange(product.id, product.stock + 1)}
                              className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold"
                            >
                              <Plus className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: PAYMENT HISTORY LOG (سجل الدفعات بالوقت والتاريخ) */}
      {activeTab === 'history' && (
        <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs overflow-hidden space-y-4">
          <div className="p-5 border-b border-slate-100 bg-slate-50/60">
            <h3 className="font-extrabold text-base text-slate-900">
              Historique des Versements Fournisseurs
            </h3>
            <p className="text-xs text-slate-500">
              Journal complet de chaque versement avec date, heure exacte et mode de paiement
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 uppercase font-bold text-[11px] border-b border-slate-100">
                <tr>
                  <th className="py-3.5 px-4">Date & Heure</th>
                  <th className="py-3.5 px-4">Fournisseur</th>
                  <th className="py-3.5 px-4">Article / Référence</th>
                  <th className="py-3.5 px-4">Montant Versé</th>
                  <th className="py-3.5 px-4">Mode de Paiement</th>
                  <th className="py-3.5 px-4">Notes</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {supplierPayments.map((payment) => (
                  <tr key={payment.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-1.5 font-bold text-slate-900">
                        <Clock className="w-3.5 h-3.5 text-amber-600" />
                        <span>{payment.payment_date}</span>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 font-bold text-slate-900">
                      {payment.supplier_name}
                    </td>
                    <td className="py-3.5 px-4 text-slate-600 font-medium truncate max-w-xs">
                      {payment.product_name}
                    </td>
                    <td className="py-3.5 px-4 font-black text-emerald-600 text-sm">
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

      {/* Supplier Payment Modal (Pay anytime, any amount, with date & hour) */}
      {isPaymentModalOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 space-y-6">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-emerald-500 text-white flex items-center justify-center font-bold">
                  <CreditCard className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-base font-black text-slate-900">
                    Enregistrer un Paiement Fournisseur
                  </h3>
                  <span className="text-[11px] text-slate-500">
                    Paiement partiel ou total avec horodatage
                  </span>
                </div>
              </div>
              <button
                onClick={() => setIsPaymentModalOpen(false)}
                className="p-2 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleRecordPayment} className="space-y-4 text-xs">
              {/* Supplier Name */}
              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Nom du Fournisseur *
                </label>
                <input
                  type="text"
                  required
                  value={supplierName}
                  onChange={(e) => setSupplierName(e.target.value)}
                  placeholder="Ex: Grossiste El-Eulma / Importateur Alger"
                  className="w-full bg-slate-50 border border-slate-300 p-2.5 rounded-xl font-bold text-slate-900 outline-none focus:border-emerald-500"
                />
              </div>

              {/* Amount to Pay (Can pay any amount) */}
              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="font-bold text-emerald-800">
                    Montant du Versement (DA) *
                  </label>
                  <span className="text-[11px] text-slate-500">
                    (Vous pouvez verser n'importe quelle tranche)
                  </span>
                </div>
                <input
                  type="number"
                  required
                  min={100}
                  value={paymentAmount}
                  onChange={(e) => setPaymentAmount(Number(e.target.value))}
                  className="w-full bg-emerald-50/50 border border-emerald-300 text-emerald-800 font-black p-3 rounded-xl text-base outline-none focus:border-emerald-500"
                />
              </div>

              {/* Exact Date & Time with Hour */}
              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Date et Heure du Paiement *
                </label>
                <div className="relative">
                  <input
                    type="datetime-local"
                    required
                    value={paymentDateTime}
                    onChange={(e) => setPaymentDateTime(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 p-2.5 rounded-xl font-bold text-slate-900 outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              {/* Payment Method */}
              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Mode de Paiement
                </label>
                <select
                  value={paymentMethod}
                  onChange={(e) => setPaymentMethod(e.target.value as any)}
                  className="w-full bg-slate-50 border border-slate-300 p-2.5 rounded-xl font-semibold text-slate-800 outline-none cursor-pointer"
                >
                  <option value="cash">💵 Espèces (Cash)</option>
                  <option value="virement">🏦 Virement Bancaire</option>
                  <option value="baridimob">📱 BaridiMob / CCP</option>
                  <option value="cheque">📄 Chèque</option>
                </select>
              </div>

              {/* Notes */}
              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Remarques / Numéro de reçu (Optionnel)
                </label>
                <input
                  type="text"
                  value={paymentNotes}
                  onChange={(e) => setPaymentNotes(e.target.value)}
                  placeholder="Ex: Tranche 2, Bon N° 4589"
                  className="w-full bg-slate-50 border border-slate-300 p-2 rounded-xl outline-none"
                />
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsPaymentModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl border border-slate-300 text-slate-700 font-bold hover:bg-slate-100"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-black shadow-lg shadow-emerald-600/20 active:scale-98 transition-all"
                >
                  Confirmer le Versement
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
