import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Building2,
  Plus,
  Search,
  Phone,
  MapPin,
  ChevronRight,
  Trash2,
  Edit,
  X,
  Package,
  CreditCard,
  CheckCircle2
} from 'lucide-react';
import { useLanguageStore } from '../../lib/i18n';
import { useAppStore } from '../../store/useAppStore';

export const AdminSuppliersPage: React.FC = () => {
  const { language } = useLanguageStore();
  const { suppliers, products, supplierPayments, settings, addSupplier, updateSupplier, deleteSupplier } = useAppStore();

  const currencySymbol = language === 'ar' ? settings.currency_ar || 'د.ج' : settings.currency || 'DA';
  const formatPrice = (num: number) => num.toLocaleString('fr-DZ');

  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSupplier, setEditingSupplier] = useState<string | null>(null);
  const [successToast, setSuccessToast] = useState<string | null>(null);

  // Form State
  const [formName, setFormName] = useState('');
  const [formPhone, setFormPhone] = useState('');
  const [formAddress, setFormAddress] = useState('');
  const [formNotes, setFormNotes] = useState('');

  const handleOpenAddModal = () => {
    setEditingSupplier(null);
    setFormName('');
    setFormPhone('');
    setFormAddress('');
    setFormNotes('');
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (id: string) => {
    const sup = suppliers.find((s) => s.id === id);
    if (!sup) return;
    setEditingSupplier(id);
    setFormName(sup.name);
    setFormPhone(sup.phone);
    setFormAddress(sup.address || '');
    setFormNotes(sup.notes || '');
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim() || !formPhone.trim()) return;

    if (editingSupplier) {
      await updateSupplier(editingSupplier, {
        name: formName.trim(),
        phone: formPhone.trim(),
        address: formAddress.trim() || undefined,
        notes: formNotes.trim() || undefined
      });
      setSuccessToast('Fournisseur mis à jour !');
    } else {
      await addSupplier({
        name: formName.trim(),
        phone: formPhone.trim(),
        address: formAddress.trim() || undefined,
        notes: formNotes.trim() || undefined
      });
      setSuccessToast('Nouveau fournisseur ajouté !');
    }

    setIsModalOpen(false);
    setTimeout(() => setSuccessToast(null), 2500);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer ce fournisseur ?')) {
      await deleteSupplier(id);
      setSuccessToast('Fournisseur supprimé.');
      setTimeout(() => setSuccessToast(null), 2500);
    }
  };

  // Escape key to close modal
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isModalOpen) setIsModalOpen(false);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isModalOpen]);

  // Get supplier stats
  const getSupplierStats = (supplierName: string) => {
    const relatedProducts = products.filter(
      (p) => p.supplier && p.supplier.toLowerCase() === supplierName.toLowerCase()
    );
    const relatedPayments = supplierPayments.filter(
      (pay) => pay.supplier_name.toLowerCase() === supplierName.toLowerCase()
    );
    const totalPaid = relatedPayments.reduce((sum, pay) => sum + pay.amount_paid, 0);
    const totalCost = relatedProducts.reduce((sum, p) => sum + (p.cost_price || 0) * Math.max(p.stock, 1), 0);

    return {
      productCount: relatedProducts.length,
      totalPaid,
      totalCost,
      remaining: Math.max(0, totalCost - totalPaid)
    };
  };

  const filteredSuppliers = suppliers.filter((s) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return s.name.toLowerCase().includes(q) || s.phone.includes(q) || (s.address && s.address.toLowerCase().includes(q));
  });

  return (
    <div className="space-y-6">
      {/* Toast */}
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
            Fournisseurs ({suppliers.length})
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Gérez vos fournisseurs, leurs coordonnées, et accédez à l'historique de chaque fournisseur.
          </p>
        </div>

        <button
          onClick={handleOpenAddModal}
          className="bg-amber-500 hover:bg-amber-400 text-slate-950 px-5 py-3 rounded-2xl font-black text-xs flex items-center gap-2 shadow-lg shadow-amber-500/20 active:scale-95 transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>Ajouter un Fournisseur</span>
        </button>
      </div>

      {/* Search */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-xs">
        <div className="relative">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Rechercher par nom, téléphone ou adresse..."
            className="w-full bg-slate-50 border border-slate-200 text-slate-900 pl-10 pr-4 py-2.5 rounded-xl text-xs outline-none focus:border-amber-500"
          />
          <Search className="w-4 h-4 text-slate-400 absolute top-3 left-3" />
        </div>
      </div>

      {/* Supplier Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
        {filteredSuppliers.map((supplier) => {
          const stats = getSupplierStats(supplier.name);

          return (
            <div
              key={supplier.id}
              className="bg-white rounded-3xl border border-slate-200/80 shadow-xs hover:shadow-md transition-shadow overflow-hidden group"
            >
              {/* Card Header */}
              <div className="p-5 pb-3">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-3">
                    <div className="w-11 h-11 rounded-2xl bg-indigo-100 text-indigo-600 flex items-center justify-center font-bold shrink-0">
                      <Building2 className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-black text-slate-900 text-sm leading-tight">
                        {supplier.name}
                      </h3>
                      <div className="flex items-center gap-1 mt-1 text-[11px] text-slate-500">
                        <Phone className="w-3 h-3 text-slate-400" />
                        <span className="font-semibold">{supplier.phone}</span>
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => handleOpenEditModal(supplier.id)}
                      className="p-1.5 rounded-lg bg-slate-100 text-slate-600 hover:bg-amber-500 hover:text-slate-950 transition-colors"
                      title="Modifier"
                    >
                      <Edit className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleDelete(supplier.id)}
                      className="p-1.5 rounded-lg bg-red-50 text-red-500 hover:bg-red-600 hover:text-white transition-colors"
                      title="Supprimer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {supplier.address && (
                  <div className="flex items-center gap-1 mt-2 text-[11px] text-slate-500 pl-14">
                    <MapPin className="w-3 h-3 text-slate-400" />
                    <span className="truncate">{supplier.address}</span>
                  </div>
                )}

                {supplier.notes && (
                  <p className="mt-2 text-[11px] text-slate-400 pl-14 italic truncate">
                    {supplier.notes}
                  </p>
                )}
              </div>

              {/* Stats Row */}
              <div className="px-5 py-3 bg-slate-50/80 border-t border-slate-100 grid grid-cols-3 gap-3 text-center text-[11px]">
                <div>
                  <div className="flex items-center justify-center gap-1 text-slate-400 font-bold mb-0.5">
                    <Package className="w-3 h-3" />
                    <span>Produits</span>
                  </div>
                  <span className="font-black text-slate-900">{stats.productCount}</span>
                </div>
                <div>
                  <div className="flex items-center justify-center gap-1 text-emerald-500 font-bold mb-0.5">
                    <CreditCard className="w-3 h-3" />
                    <span>Payé</span>
                  </div>
                  <span className="font-black text-emerald-600">{formatPrice(stats.totalPaid)}</span>
                </div>
                <div>
                  <div className="text-red-500 font-bold mb-0.5">Reste</div>
                  <span className="font-black text-red-600">{formatPrice(stats.remaining)}</span>
                </div>
              </div>

              {/* View Details Link */}
              <Link
                to={`/admin/suppliers/${supplier.id}`}
                className="flex items-center justify-between px-5 py-3 bg-slate-900 text-white text-xs font-bold hover:bg-slate-800 transition-colors"
              >
                <span>Voir tous les produits de ce fournisseur</span>
                <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
          );
        })}

        {/* Empty State */}
        {filteredSuppliers.length === 0 && (
          <div className="col-span-full text-center py-16">
            <Building2 className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <p className="font-bold text-slate-500 text-sm">
              {searchQuery ? 'Aucun fournisseur trouvé pour cette recherche.' : 'Aucun fournisseur enregistré.'}
            </p>
            <button
              onClick={handleOpenAddModal}
              className="mt-3 text-amber-600 hover:text-amber-700 font-bold text-xs underline"
            >
              + Ajouter votre premier fournisseur
            </button>
          </div>
        )}
      </div>

      {/* Add / Edit Supplier Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-md w-full shadow-2xl border border-slate-200 overflow-hidden">
            {/* Modal Header */}
            <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/80">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-indigo-500 text-white flex items-center justify-center font-bold">
                  <Building2 className="w-4 h-4" />
                </div>
                <h2 className="text-base font-black text-slate-900">
                  {editingSupplier ? 'Modifier le fournisseur' : 'Ajouter un nouveau fournisseur'}
                </h2>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-2 text-slate-400 hover:text-slate-900 rounded-xl hover:bg-slate-200 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleSave} className="p-5 sm:p-6 space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Nom du Fournisseur *
                </label>
                <input
                  type="text"
                  required
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  placeholder="Ex: Grossiste El-Eulma / Importateur Alger"
                  className="w-full bg-slate-50 border border-slate-300 p-2.5 rounded-xl outline-none focus:border-indigo-500 font-medium"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Numéro de Téléphone *
                </label>
                <input
                  type="tel"
                  required
                  value={formPhone}
                  onChange={(e) => setFormPhone(e.target.value)}
                  placeholder="Ex: 0555667788"
                  className="w-full bg-slate-50 border border-slate-300 p-2.5 rounded-xl outline-none focus:border-indigo-500 font-medium"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Adresse (Optionnel)
                </label>
                <input
                  type="text"
                  value={formAddress}
                  onChange={(e) => setFormAddress(e.target.value)}
                  placeholder="Ex: Zone Industrielle, El Eulma - Sétif"
                  className="w-full bg-slate-50 border border-slate-300 p-2.5 rounded-xl outline-none focus:border-indigo-500 font-medium"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Notes / Remarques (Optionnel)
                </label>
                <textarea
                  rows={2}
                  value={formNotes}
                  onChange={(e) => setFormNotes(e.target.value)}
                  placeholder="Ex: Livraison rapide, paiement par virement..."
                  className="w-full bg-slate-50 border border-slate-300 p-2.5 rounded-xl outline-none focus:border-indigo-500 font-medium"
                />
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-5 py-2.5 rounded-xl border border-slate-300 text-slate-700 font-bold hover:bg-slate-200 transition-colors"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-black shadow-lg shadow-indigo-600/20 active:scale-98 transition-all"
                >
                  {editingSupplier ? 'Enregistrer les modifications' : 'Ajouter le fournisseur'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
