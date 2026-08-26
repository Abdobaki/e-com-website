import React, { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { 
  Plus, 
  Search, 
  Edit, 
  Trash2, 
  X, 
  Tag,
  UploadCloud,
  Lock,
  TrendingUp,
  Building2,
  Truck
} from 'lucide-react';
import { useLanguageStore } from '../../lib/i18n';
import { useAppStore } from '../../store/useAppStore';
import type { Product } from '../../types';

export const AdminProductsPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const { t, language } = useLanguageStore();
  const { products, categories, suppliers, settings, addProduct, updateProduct, deleteProduct } = useAppStore();
  const translations = t();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState('all');
  const [isModalOpen, setIsModalOpen] = useState(searchParams.get('action') === 'new');
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  // Form State
  const [name, setName] = useState('');
  const [nameAr, setNameAr] = useState('');
  const [categoryId, setCategoryId] = useState(categories[0]?.id || '');
  const [brand, setBrand] = useState('BEKO');
  const [price, setPrice] = useState<number>(35000);
  const [originalPrice, setOriginalPrice] = useState<number | undefined>(undefined);
  const [costPrice, setCostPrice] = useState<number | undefined>(undefined);
  const [supplier, setSupplier] = useState('');
  const [stock, setStock] = useState<number>(10);
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const [newUrlInput, setNewUrlInput] = useState('');
  const [description, setDescription] = useState('');
  const [descriptionAr, setDescriptionAr] = useState('');
  const [isFeatured, setIsFeatured] = useState(false);
  const [isActive, setIsActive] = useState(true);
  const [isFreeDelivery, setIsFreeDelivery] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  // Close modal on Escape key
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isModalOpen) {
        setIsModalOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isModalOpen]);

  // Open Add Modal
  const handleOpenAddModal = () => {
    setEditingProduct(null);
    setName('');
    setNameAr('');
    setCategoryId(categories[0]?.id || '');
    setBrand('BEKO');
    setPrice(35000);
    setOriginalPrice(undefined);
    setCostPrice(undefined);
    setSupplier('');
    setStock(10);
    setImageUrls(['https://images.unsplash.com/photo-1590794056226-79ef3a8147e1?auto=format&fit=crop&w=800&q=80']);
    setNewUrlInput('');
    setDescription('');
    setDescriptionAr('');
    setIsFeatured(false);
    setIsActive(true);
    setIsFreeDelivery(false);
    setIsModalOpen(true);
  };

  // Open Edit Modal
  const handleOpenEditModal = (p: Product) => {
    setEditingProduct(p);
    setName(p.name);
    setNameAr(p.name_ar || '');
    setCategoryId(p.category_id);
    setBrand(p.brand);
    setPrice(p.price);
    setOriginalPrice(p.original_price);
    setCostPrice(p.cost_price);
    setSupplier(p.supplier || '');
    setStock(p.stock);
    setImageUrls(p.images && p.images.length > 0 ? p.images : ['https://images.unsplash.com/photo-1590794056226-79ef3a8147e1?auto=format&fit=crop&w=800&q=80']);
    setNewUrlInput('');
    setDescription(p.description);
    setDescriptionAr(p.description_ar || '');
    setIsFeatured(p.is_featured);
    setIsActive(p.is_active);
    setIsFreeDelivery(Boolean(p.is_free_delivery));
    setIsModalOpen(true);
  };

  // File Upload Handlers (from PC via Drag & Drop or file input)
  const processFiles = (files: FileList | File[]) => {
    Array.from(files).forEach((file) => {
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = (e) => {
          if (e.target?.result) {
            setImageUrls((prev) => [...prev, e.target!.result as string]);
          }
        };
        reader.readAsDataURL(file);
      }
    });
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      processFiles(e.target.files);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      processFiles(e.dataTransfer.files);
    }
  };

  const handleAddUrl = () => {
    if (newUrlInput.trim()) {
      setImageUrls((prev) => [...prev, newUrlInput.trim()]);
      setNewUrlInput('');
    }
  };

  const handleRemoveImage = (index: number) => {
    setImageUrls((prev) => prev.filter((_, idx) => idx !== index));
  };

  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();

    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    const selectedCat = categories.find((c) => c.id === categoryId);

    const finalImages = imageUrls.length > 0
      ? imageUrls
      : ['https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=800&q=80'];

    const productPayload = {
      name,
      name_ar: nameAr || undefined,
      slug: editingProduct ? editingProduct.slug : slug + '-' + Math.floor(Math.random() * 1000),
      category_id: categoryId,
      category_slug: selectedCat?.slug || 'fours',
      brand,
      price: Number(price),
      original_price: originalPrice ? Number(originalPrice) : undefined,
      cost_price: costPrice ? Number(costPrice) : undefined,
      supplier: supplier.trim() || undefined,
      stock: Number(stock),
      images: finalImages,
      description: description || 'Appareil électroménager de cuisine haute qualité.',
      description_ar: descriptionAr || undefined,
      specifications: editingProduct?.specifications || { 'Garantie': '24 Mois', 'Origine': 'Importé' },
      is_featured: isFeatured,
      is_active: isActive,
      is_free_delivery: isFreeDelivery,
    };

    if (editingProduct) {
      await updateProduct(editingProduct.id, productPayload);
    } else {
      await addProduct(productPayload);
    }

    setIsModalOpen(false);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer ce produit ?')) {
      await deleteProduct(id);
    }
  };

  const currencySymbol = language === 'ar' ? settings.currency_ar || 'د.ج' : settings.currency || 'DA';
  const formatPrice = (num: number) => num.toLocaleString('fr-DZ');

  // Profit calculation for modal
  const profitPerUnit = costPrice && price ? price - costPrice : undefined;
  const profitMarginPercent = costPrice && price && price > 0 ? Math.round(((price - costPrice) / price) * 100) : undefined;

  // Filtered Products
  const filteredProducts = products.filter((p) => {
    if (selectedCategoryFilter !== 'all' && p.category_id !== selectedCategoryFilter && p.category_slug !== selectedCategoryFilter) {
      return false;
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return p.name.toLowerCase().includes(q) || p.brand.toLowerCase().includes(q) || (p.supplier && p.supplier.toLowerCase().includes(q));
    }
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            {translations.products} ({products.length})
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Gérez votre catalogue d'appareils, prix de vente, coûts d'achat, fournisseurs et bénéfices.
          </p>
        </div>

        <button
          onClick={handleOpenAddModal}
          className="bg-amber-500 hover:bg-amber-400 text-slate-950 px-5 py-3 rounded-2xl font-black text-xs flex items-center gap-2 shadow-lg shadow-amber-500/20 active:scale-95 transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>{translations.addNewProduct}</span>
        </button>
      </div>

      {/* Search & Filter Bar */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-xs flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Rechercher par nom, marque ou fournisseur..."
            className="w-full bg-slate-50 border border-slate-200 text-slate-900 pl-10 pr-4 py-2.5 rounded-xl text-xs outline-none focus:border-amber-500"
          />
          <Search className="w-4 h-4 text-slate-400 absolute top-3 left-3" />
        </div>

        <select
          value={selectedCategoryFilter}
          onChange={(e) => setSelectedCategoryFilter(e.target.value)}
          className="bg-slate-50 border border-slate-200 text-slate-800 text-xs font-semibold px-3 py-2.5 rounded-xl outline-none"
        >
          <option value="all">Toutes les catégories</option>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>
              {language === 'ar' ? c.name_ar : c.name_fr}
            </option>
          ))}
        </select>
      </div>

      {/* Products Table */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 uppercase font-bold text-[11px] border-b border-slate-100">
              <tr>
                <th className="py-3.5 px-4">Produit</th>
                <th className="py-3.5 px-4">Catégorie</th>
                <th className="py-3.5 px-4">Prix de Vente</th>
                <th className="py-3.5 px-4">Achat & Fournisseur (Privé)</th>
                <th className="py-3.5 px-4">Bénéfice Estimé</th>
                <th className="py-3.5 px-4">Stock</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredProducts.map((product) => {
                const hasDiscount = product.original_price && product.original_price > product.price;
                const discountPercent = hasDiscount
                  ? Math.round(((product.original_price! - product.price) / product.original_price!) * 100)
                  : 0;

                const category = categories.find((c) => c.id === product.category_id || c.slug === product.category_slug);

                const itemProfit = product.cost_price ? product.price - product.cost_price : undefined;
                const itemMargin = product.cost_price && product.price > 0 ? Math.round(((product.price - product.cost_price) / product.price) * 100) : undefined;

                return (
                  <tr key={product.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={product.images[0] || 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=150&q=80'}
                          alt=""
                          className="w-12 h-12 rounded-xl object-cover border border-slate-200 shrink-0 bg-slate-100"
                        />
                        <div className="max-w-xs">
                          <span className="text-[10px] font-extrabold uppercase text-amber-700 bg-amber-50 px-1.5 py-0.2 rounded">
                            {product.brand}
                          </span>
                          <h4 className="font-bold text-slate-900 truncate mt-0.5">{product.name}</h4>
                          {product.is_free_delivery && (
                            <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-100 px-1.5 py-0.5 rounded mt-0.5">
                              <Truck className="w-3 h-3" />
                              Livraison Gratuite
                            </span>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 text-slate-600 font-medium">
                      {category ? (language === 'ar' ? category.name_ar : category.name_fr) : '—'}
                    </td>
                    <td className="py-3.5 px-4">
                      {hasDiscount && (
                        <div className="flex items-center gap-1.5 text-xs text-red-500 line-through">
                          <span>{formatPrice(product.original_price!)} {currencySymbol}</span>
                          <span className="text-[10px] text-red-600 font-bold bg-red-50 px-1 rounded no-underline">
                            -{discountPercent}%
                          </span>
                        </div>
                      )}
                      <span className="font-black text-emerald-600 text-sm">
                        {formatPrice(product.price)} {currencySymbol}
                      </span>
                    </td>
                    <td className="py-3.5 px-4">
                      {product.cost_price ? (
                        <div>
                          <span className="font-bold text-slate-900 block">
                            {formatPrice(product.cost_price)} {currencySymbol}
                          </span>
                          {product.supplier && (
                            <span className="text-[11px] text-slate-500 flex items-center gap-1 truncate max-w-[140px]">
                              <Building2 className="w-3 h-3 text-slate-400" />
                              {product.supplier}
                            </span>
                          )}
                        </div>
                      ) : (
                        <span className="text-slate-400 italic">Non renseigné</span>
                      )}
                    </td>
                    <td className="py-3.5 px-4">
                      {itemProfit !== undefined ? (
                        <div>
                          <span className="font-black text-emerald-700 block text-xs">
                            +{formatPrice(itemProfit)} {currencySymbol}
                          </span>
                          <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded">
                            Marge: {itemMargin}%
                          </span>
                        </div>
                      ) : (
                        <span className="text-slate-400 text-[11px]">—</span>
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
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => handleOpenEditModal(product)}
                          className="p-1.5 rounded-lg bg-slate-100 text-slate-700 hover:bg-amber-500 hover:text-slate-950 transition-colors"
                          title="Modifier"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(product.id)}
                          className="p-1.5 rounded-lg bg-red-50 text-red-600 hover:bg-red-600 hover:text-white transition-colors"
                          title="Supprimer"
                        >
                          <Trash2 className="w-4 h-4" />
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

      {/* Add / Edit Modal (With Private Fournisseur & Cost Price inputs) */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] flex flex-col shadow-2xl border border-slate-200 overflow-hidden">
            {/* Sticky Modal Header with Exit Button */}
            <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/80 shrink-0">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-amber-500 text-slate-950 flex items-center justify-center font-bold">
                  {editingProduct ? <Edit className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                </div>
                <h2 className="text-base sm:text-lg font-black text-slate-900">
                  {editingProduct ? 'Modifier le produit' : 'Ajouter un nouveau produit'}
                </h2>
              </div>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="p-2 text-slate-400 hover:text-slate-900 rounded-xl hover:bg-slate-200 transition-colors cursor-pointer"
                title="Fermer (Exit / Échap)"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Scrollable Modal Form Body */}
            <form onSubmit={handleSaveProduct} id="productForm" className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 text-xs">
              {/* Product Name (FR & AR) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Nom du produit (Français) *
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Ex: Four Encastrable 65L Inox"
                    className="w-full bg-slate-50 border border-slate-300 p-2.5 rounded-xl outline-none focus:border-amber-500 font-medium"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    اسم المنتج (بالعربية)
                  </label>
                  <input
                    type="text"
                    dir="rtl"
                    value={nameAr}
                    onChange={(e) => setNameAr(e.target.value)}
                    placeholder="مثال: فرن مدمج 65 لتر إينوكس"
                    className="w-full bg-slate-50 border border-slate-300 p-2.5 rounded-xl outline-none focus:border-amber-500 font-medium"
                  />
                </div>
              </div>

              {/* Category & Brand */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Catégorie *</label>
                  <select
                    value={categoryId}
                    onChange={(e) => setCategoryId(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 p-2.5 rounded-xl outline-none focus:border-amber-500 font-medium"
                  >
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>{c.name_fr} - {c.name_ar}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Marque *</label>
                  <input
                    type="text"
                    required
                    value={brand}
                    onChange={(e) => setBrand(e.target.value.toUpperCase())}
                    placeholder="Ex: BEKO, BOSCH, BRANDT, LG..."
                    className="w-full bg-slate-50 border border-slate-300 p-2.5 rounded-xl outline-none focus:border-amber-500 font-medium uppercase"
                  />
                </div>
              </div>

              {/* Pricing & Customer Discounts */}
              <div className="p-4 rounded-2xl bg-amber-50/50 border border-amber-200/80 space-y-3">
                <div className="flex items-center gap-1.5 text-amber-800 font-extrabold">
                  <Tag className="w-4 h-4 text-amber-600" />
                  <span>Tarification & Remise Client (Visible sur le site)</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Current Active Sale Price */}
                  <div>
                    <label className="block font-bold text-emerald-800 mb-1">
                      Prix de vente client (DA) * (Vert & Grand)
                    </label>
                    <input
                      type="number"
                      required
                      min={0}
                      value={price}
                      onChange={(e) => setPrice(Number(e.target.value))}
                      className="w-full bg-white border border-emerald-400 text-emerald-700 font-bold p-2.5 rounded-xl outline-none text-sm"
                    />
                  </div>

                  {/* Original Price */}
                  <div>
                    <label className="block font-bold text-red-700 mb-1">
                      Prix initial avant remise (DA) (Rouge & Barré)
                    </label>
                    <input
                      type="number"
                      min={0}
                      value={originalPrice || ''}
                      onChange={(e) => setOriginalPrice(e.target.value ? Number(e.target.value) : undefined)}
                      placeholder="Laisser vide si pas de remise"
                      className="w-full bg-white border border-red-300 text-red-600 font-medium p-2.5 rounded-xl outline-none text-sm"
                    />
                  </div>
                </div>

                {originalPrice && originalPrice > price && (
                  <div className="text-[11px] font-bold text-emerald-700 bg-emerald-100 px-3 py-1.5 rounded-lg flex items-center justify-between">
                    <span>Remise calculée : -{Math.round(((originalPrice - price) / originalPrice) * 100)}%</span>
                    <span>Économie client : {(originalPrice - price).toLocaleString('fr-DZ')} DA</span>
                  </div>
                )}
              </div>

              {/* Private Purchase Price & Supplier (Privé - Non visible aux clients) */}
              <div className="p-4 rounded-2xl bg-indigo-50/70 border border-indigo-200 space-y-3">
                <div className="flex items-center justify-between text-indigo-900 font-extrabold">
                  <div className="flex items-center gap-1.5">
                    <Lock className="w-4 h-4 text-indigo-600" />
                    <span>Fournisseur & Prix d'Achat (Section Privée - Réservée à vous)</span>
                  </div>
                  <span className="text-[10px] font-bold bg-indigo-200 text-indigo-800 px-2 py-0.5 rounded">
                    Non visible aux clients
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Cost Price */}
                  <div>
                    <label className="block font-bold text-indigo-950 mb-1">
                      Prix d'achat / Prix de revient (DA)
                    </label>
                    <input
                      type="number"
                      min={0}
                      value={costPrice || ''}
                      onChange={(e) => setCostPrice(e.target.value ? Number(e.target.value) : undefined)}
                      placeholder="Ex: 28000"
                      className="w-full bg-white border border-indigo-300 text-indigo-900 font-bold p-2.5 rounded-xl outline-none text-sm focus:border-indigo-500"
                    />
                  </div>

                  {/* Supplier */}
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="block font-bold text-indigo-950">
                        Fournisseur / Lieu d'achat
                      </label>
                      {suppliers.length > 0 && (
                        <span className="text-[10px] text-indigo-600 font-semibold">
                          (Choisir dans la liste ou taper un nouveau)
                        </span>
                      )}
                    </div>
                    <div className="space-y-1.5">
                      <input
                        type="text"
                        list="suppliers-datalist"
                        value={supplier}
                        onChange={(e) => setSupplier(e.target.value)}
                        placeholder="Choisir un fournisseur ou saisir un nouveau..."
                        className="w-full bg-white border border-indigo-300 text-indigo-900 font-medium p-2.5 rounded-xl outline-none focus:border-indigo-500 text-sm"
                      />
                      <datalist id="suppliers-datalist">
                        {suppliers.map((s) => (
                          <option key={s.id} value={s.name} />
                        ))}
                      </datalist>

                      {/* Quick select chips for existing suppliers */}
                      {suppliers.length > 0 && (
                        <div className="flex flex-wrap gap-1 pt-1">
                          {suppliers.map((s) => (
                            <button
                              type="button"
                              key={s.id}
                              onClick={() => setSupplier(s.name)}
                              className={`text-[11px] px-2 py-0.5 rounded-md font-semibold transition-colors cursor-pointer ${
                                supplier === s.name
                                  ? 'bg-indigo-600 text-white'
                                  : 'bg-indigo-100/70 text-indigo-800 hover:bg-indigo-200'
                              }`}
                            >
                              + {s.name}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Profit Live calculation */}
                {profitPerUnit !== undefined && (
                  <div className="p-3 bg-white rounded-xl border border-indigo-200 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <TrendingUp className="w-4 h-4 text-emerald-600" />
                      <span className="font-bold text-slate-700">Bénéfice estimé par unité :</span>
                    </div>
                    <div className="text-right">
                      <span className={`font-black text-sm ${profitPerUnit >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>
                        {profitPerUnit >= 0 ? '+' : ''}{profitPerUnit.toLocaleString('fr-DZ')} {currencySymbol}
                      </span>
                      <span className="text-[10px] text-slate-500 ml-2 font-bold">
                        (Marge : {profitMarginPercent}%)
                      </span>
                    </div>
                  </div>
                )}
              </div>

              {/* Stock Quantity */}
              <div>
                <label className="block font-bold text-slate-700 mb-1">Quantité en Stock *</label>
                <input
                  type="number"
                  required
                  min={0}
                  value={stock}
                  onChange={(e) => setStock(Number(e.target.value))}
                  className="w-full bg-slate-50 border border-slate-300 p-2.5 rounded-xl outline-none focus:border-amber-500 font-medium"
                />
              </div>

              {/* Images Manager (URL + Drag and Drop / PC upload) */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                <label className="block font-bold text-slate-900">
                  Photos du produit (Lien URL ou Glisser-Déposer depuis votre PC)
                </label>

                {/* Drag & Drop Box */}
                <div
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  className={`border-2 border-dashed rounded-2xl p-4 text-center transition-all ${
                    isDragging ? 'border-amber-500 bg-amber-50/50' : 'border-slate-300 bg-white hover:border-slate-400'
                  }`}
                >
                  <UploadCloud className="w-8 h-8 text-amber-500 mx-auto mb-1.5" />
                  <p className="font-bold text-slate-800 text-xs mb-1">
                    Glissez des photos ici ou{' '}
                    <label className="text-amber-600 hover:text-amber-700 cursor-pointer underline">
                      Parcourir sur votre PC
                      <input
                        type="file"
                        multiple
                        accept="image/*"
                        onChange={handleFileInputChange}
                        className="hidden"
                      />
                    </label>
                  </p>
                  <p className="text-[10px] text-slate-400">Formats supportés : JPG, PNG, WEBP</p>
                </div>

                {/* Or enter Image URL */}
                <div className="flex gap-2">
                  <input
                    type="url"
                    value={newUrlInput}
                    onChange={(e) => setNewUrlInput(e.target.value)}
                    placeholder="Ou collez un lien URL d'image (https://...)"
                    className="flex-1 bg-white border border-slate-300 p-2 rounded-xl text-xs outline-none"
                  />
                  <button
                    type="button"
                    onClick={handleAddUrl}
                    className="bg-slate-900 hover:bg-slate-800 text-white font-bold px-3 py-2 rounded-xl text-xs"
                  >
                    Ajouter URL
                  </button>
                </div>

                {/* Previews List */}
                {imageUrls.length > 0 && (
                  <div className="pt-2">
                    <span className="text-[11px] font-bold text-slate-600 block mb-2">
                      Photos enregistrées ({imageUrls.length}) :
                    </span>
                    <div className="flex flex-wrap gap-2.5">
                      {imageUrls.map((url, index) => (
                        <div key={index} className="relative group w-16 h-16 rounded-xl overflow-hidden border border-slate-200 bg-white shadow-xs">
                          <img src={url} alt="" className="w-full h-full object-cover" />
                          <button
                            type="button"
                            onClick={() => handleRemoveImage(index)}
                            className="absolute inset-0 bg-red-600/80 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                            title="Supprimer cette photo"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Description */}
              <div>
                <label className="block font-bold text-slate-700 mb-1">Description détaillée</label>
                <textarea
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Décrivez les fonctionnalités de l'appareil..."
                  className="w-full bg-slate-50 border border-slate-300 p-2.5 rounded-xl outline-none focus:border-amber-500"
                />
              </div>

              {/* Option Livraison Gratuite (Offerte par l'admin) */}
              <div className="p-3.5 rounded-2xl bg-emerald-50/70 border border-emerald-200 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                    <Truck className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="font-bold text-slate-900 text-xs sm:text-sm block">
                      Livraison Gratuite (Offerte)
                    </span>
                    <span className="text-[11px] text-slate-500 block">
                      Si activé, la mention "Frais de livraison Gratuite" apparaîtra sur la fiche du produit et la livraison sera à 0 DA.
                    </span>
                  </div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer shrink-0 ml-3">
                  <input
                    type="checkbox"
                    checked={isFreeDelivery}
                    onChange={(e) => setIsFreeDelivery(e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-slate-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-500"></div>
                </label>
              </div>

              {/* Toggles */}
              <div className="flex items-center gap-6 pt-1">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isFeatured}
                    onChange={(e) => setIsFeatured(e.target.checked)}
                    className="rounded text-amber-500 h-4 w-4"
                  />
                  <span className="font-bold text-slate-800">Afficher en vedette sur l'accueil</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isActive}
                    onChange={(e) => setIsActive(e.target.checked)}
                    className="rounded text-amber-500 h-4 w-4"
                  />
                  <span className="font-bold text-slate-800">Produit Actif</span>
                </label>
              </div>
            </form>

            {/* Sticky Modal Footer */}
            <div className="p-4 sm:p-5 border-t border-slate-100 bg-slate-50/90 flex items-center justify-end gap-3 shrink-0">
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="px-5 py-2.5 rounded-xl border border-slate-300 text-slate-700 font-bold hover:bg-slate-200 transition-colors text-xs"
              >
                Annuler
              </button>
              <button
                type="submit"
                form="productForm"
                className="px-6 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black shadow-lg shadow-amber-500/20 text-xs transition-all active:scale-98"
              >
                Enregistrer le produit
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
