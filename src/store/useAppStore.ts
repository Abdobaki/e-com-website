import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Category, Order, Product, StoreSettings, Supplier, SupplierPayment } from '../types';
import { INITIAL_CATEGORIES, INITIAL_PRODUCTS, INITIAL_SETTINGS } from '../data/mockData';
import { supabase } from '../lib/supabase';

interface AppStore {
  // Data
  categories: Category[];
  products: Product[];
  orders: Order[];
  suppliers: Supplier[];
  supplierPayments: SupplierPayment[];
  settings: StoreSettings;
  isAdminLoggedIn: boolean;
  adminEmail: string | null;
  isLoading: boolean;
  error: string | null;

  // Supabase sync
  fetchData: () => Promise<void>;
  
  // Products CRUD
  addProduct: (product: Omit<Product, 'id' | 'created_at'>) => Promise<Product>;
  updateProduct: (id: string, updates: Partial<Product>) => Promise<void>;
  deleteProduct: (id: string) => Promise<void>;
  updateStock: (id: string, newStock: number) => Promise<void>;
  
  // Categories CRUD
  addCategory: (category: Omit<Category, 'id'>) => Promise<Category>;
  updateCategory: (id: string, updates: Partial<Category>) => Promise<void>;
  deleteCategory: (id: string) => Promise<void>;
  
  // Orders Management
  addOrder: (order: Omit<Order, 'id' | 'order_number' | 'created_at' | 'status'>) => Promise<Order>;
  updateOrderStatus: (orderId: string, status: Order['status']) => Promise<void>;
  deleteOrder: (orderId: string) => Promise<void>;
  
  // Supplier Payments
  addSupplierPayment: (payment: Omit<SupplierPayment, 'id' | 'created_at'>) => Promise<SupplierPayment>;

  // Suppliers
  addSupplier: (supplier: Omit<Supplier, 'id' | 'created_at'>) => Promise<Supplier>;
  updateSupplier: (id: string, updates: Partial<Supplier>) => Promise<void>;
  deleteSupplier: (id: string) => Promise<void>;

  // Store Settings
  updateSettings: (newSettings: Partial<StoreSettings>) => Promise<void>;
  
  // Admin Auth
  loginAdmin: (email: string) => void;
  logoutAdmin: () => void;
}

const INITIAL_ORDERS: Order[] = [];
const INITIAL_SUPPLIER_PAYMENTS: SupplierPayment[] = [];
const INITIAL_SUPPLIERS: Supplier[] = [];

export const useAppStore = create<AppStore>()(
  persist(
    (set, get) => ({
      categories: INITIAL_CATEGORIES,
      products: INITIAL_PRODUCTS,
      orders: INITIAL_ORDERS,
      suppliers: INITIAL_SUPPLIERS,
      supplierPayments: INITIAL_SUPPLIER_PAYMENTS,
      settings: INITIAL_SETTINGS,
      isAdminLoggedIn: false,
      adminEmail: null,
      isLoading: false,
      error: null,

      fetchData: async () => {
        try {
          set({ isLoading: true, error: null });
          
          const [catRes, prodRes, setRes, supRes, payRes, ordRes] = await Promise.allSettled([
            supabase.from('categories').select('*').order('display_order', { ascending: true }),
            supabase.from('products').select('*').order('created_at', { ascending: false }),
            supabase.from('store_settings').select('*').single(),
            supabase.from('suppliers').select('*').order('created_at', { ascending: false }),
            supabase.from('supplier_payments').select('*').order('created_at', { ascending: false }),
            supabase.from('orders').select('*').order('created_at', { ascending: false })
          ]);

          if (catRes.status === 'fulfilled' && catRes.value.data && catRes.value.data.length > 0) {
            set({ categories: catRes.value.data });
          }

          if (prodRes.status === 'fulfilled' && prodRes.value.data && prodRes.value.data.length > 0) {
            const mergedProducts = prodRes.value.data.map((p: Product) => {
              const initial = INITIAL_PRODUCTS.find(ip => ip.slug === p.slug || ip.id === p.id);
              if (initial) {
                return {
                  ...initial,
                  ...p,
                  name_ar: p.name_ar || initial.name_ar,
                  name_en: p.name_en || initial.name_en,
                  description_ar: p.description_ar || initial.description_ar,
                  description_en: p.description_en || initial.description_en,
                  specifications_ar: p.specifications_ar || initial.specifications_ar,
                  specifications_en: p.specifications_en || initial.specifications_en,
                };
              }
              return p;
            });
            set({ products: mergedProducts });
          }

          if (setRes.status === 'fulfilled' && setRes.value.data) {
            set({ settings: setRes.value.data });
          }

          if (supRes.status === 'fulfilled' && supRes.value.data && supRes.value.data.length > 0) {
            set({ suppliers: supRes.value.data });
          }

          if (payRes.status === 'fulfilled' && payRes.value.data && payRes.value.data.length > 0) {
            set({ supplierPayments: payRes.value.data });
          }

          if (ordRes.status === 'fulfilled' && ordRes.value.data && ordRes.value.data.length > 0) {
            set({ orders: ordRes.value.data });
          }
        } catch {
          // Keep local state
        } finally {
          set({ isLoading: false });
        }
      },

      addProduct: async (productData) => {
        const newId = 'prod-' + Date.now();
        const newProduct: Product = {
          ...productData,
          id: newId,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        };

        set((state) => ({
          products: [newProduct, ...state.products]
        }));

        try {
          await supabase.from('products').insert([newProduct]);
        } catch {
          // Saved locally
        }

        return newProduct;
      },

      updateProduct: async (id, updates) => {
        set((state) => ({
          products: state.products.map((p) =>
            p.id === id ? { ...p, ...updates, updated_at: new Date().toISOString() } : p
          )
        }));

        try {
          await supabase.from('products').update(updates).eq('id', id);
        } catch {
          // fallback
        }
      },

      deleteProduct: async (id) => {
        set((state) => ({
          products: state.products.filter((p) => p.id !== id)
        }));

        try {
          await supabase.from('products').delete().eq('id', id);
        } catch {
          // fallback
        }
      },

      updateStock: async (id, newStock) => {
        const validStock = Math.max(0, newStock);
        set((state) => ({
          products: state.products.map((p) =>
            p.id === id ? { ...p, stock: validStock } : p
          )
        }));

        try {
          await supabase.from('products').update({ stock: validStock }).eq('id', id);
        } catch {
          // fallback
        }
      },

      addCategory: async (categoryData) => {
        const newCategory: Category = {
          ...categoryData,
          id: 'cat-' + Date.now()
        };

        set((state) => ({
          categories: [...state.categories, newCategory]
        }));

        try {
          await supabase.from('categories').insert([newCategory]);
        } catch {
          // fallback
        }

        return newCategory;
      },

      updateCategory: async (id, updates) => {
        set((state) => ({
          categories: state.categories.map((c) =>
            c.id === id ? { ...c, ...updates } : c
          )
        }));

        try {
          await supabase.from('categories').update(updates).eq('id', id);
        } catch {
          // fallback
        }
      },

      deleteCategory: async (id) => {
        set((state) => ({
          categories: state.categories.filter((c) => c.id !== id)
        }));

        try {
          await supabase.from('categories').delete().eq('id', id);
        } catch {
          // fallback
        }
      },

      addOrder: async (orderData) => {
        const orderCount = get().orders.length + 1049;
        const orderNumber = `ORD-${orderCount}`;
        const newOrder: Order = {
          ...orderData,
          id: 'ord-' + Date.now(),
          order_number: orderNumber,
          status: 'pending',
          created_at: new Date().toISOString()
        };

        // Decrement stock for ordered items
        set((state) => {
          const updatedProducts = state.products.map((product) => {
            const orderedItem = orderData.items.find((item) => item.product_id === product.id);
            if (orderedItem) {
              const remainingStock = Math.max(0, product.stock - orderedItem.quantity);
              return { ...product, stock: remainingStock };
            }
            return product;
          });

          return {
            orders: [newOrder, ...state.orders],
            products: updatedProducts
          };
        });

        try {
          await supabase.from('orders').insert([
            {
              id: newOrder.id,
              order_number: newOrder.order_number,
              customer_name: newOrder.customer_name,
              customer_phone: newOrder.customer_phone,
              wilaya: newOrder.wilaya,
              wilaya_code: newOrder.wilaya_code,
              commune: newOrder.commune,
              address: newOrder.address,
              notes: newOrder.notes,
              payment_method: newOrder.payment_method,
              subtotal: newOrder.subtotal,
              delivery_fee: newOrder.delivery_fee,
              total: newOrder.total,
              status: newOrder.status
            }
          ]);
        } catch {
          // fallback
        }

        return newOrder;
      },

      updateOrderStatus: async (orderId, status) => {
        set((state) => ({
          orders: state.orders.map((order) =>
            order.id === orderId ? { ...order, status, updated_at: new Date().toISOString() } : order
          )
        }));

        try {
          await supabase.from('orders').update({ status }).eq('id', orderId);
        } catch {
          // fallback
        }
      },

      deleteOrder: async (orderId) => {
        set((state) => ({
          orders: state.orders.filter((order) => order.id !== orderId)
        }));

        try {
          await supabase.from('orders').delete().eq('id', orderId);
        } catch {
          // fallback
        }
      },

      addSupplierPayment: async (paymentData) => {
        const newPayment: SupplierPayment = {
          ...paymentData,
          id: 'pay-' + Date.now(),
          created_at: new Date().toISOString()
        };

        set((state) => {
          // Also update supplier_paid on the specific product if productId exists
          let updatedProducts = state.products;
          if (paymentData.product_id) {
            updatedProducts = state.products.map((p) => {
              if (p.id === paymentData.product_id) {
                const currentPaid = p.supplier_paid || 0;
                const newPaid = currentPaid + paymentData.amount_paid;
                // Sync product supplier_paid in background
                supabase.from('products').update({ supplier_paid: newPaid }).eq('id', p.id).then();
                return { ...p, supplier_paid: newPaid };
              }
              return p;
            });
          }

          return {
            supplierPayments: [newPayment, ...state.supplierPayments],
            products: updatedProducts
          };
        });

        try {
          await supabase.from('supplier_payments').insert([newPayment]);
        } catch {
          // fallback
        }

        return newPayment;
      },

      addSupplier: async (supplierData) => {
        const newSupplier: Supplier = {
          ...supplierData,
          id: 'sup-' + Date.now(),
          created_at: new Date().toISOString()
        };

        set((state) => ({
          suppliers: [newSupplier, ...state.suppliers]
        }));

        try {
          await supabase.from('suppliers').insert([newSupplier]);
        } catch {
          // fallback
        }

        return newSupplier;
      },

      updateSupplier: async (id, updates) => {
        set((state) => ({
          suppliers: state.suppliers.map((s) =>
            s.id === id ? { ...s, ...updates } : s
          )
        }));

        try {
          await supabase.from('suppliers').update(updates).eq('id', id);
        } catch {
          // fallback
        }
      },

      deleteSupplier: async (id) => {
        set((state) => ({
          suppliers: state.suppliers.filter((s) => s.id !== id)
        }));

        try {
          await supabase.from('suppliers').delete().eq('id', id);
        } catch {
          // fallback
        }
      },

      updateSettings: async (newSettings) => {
        set((state) => ({
          settings: { ...state.settings, ...newSettings }
        }));

        try {
          await supabase.from('store_settings').update(newSettings).eq('id', 1);
        } catch {
          // fallback
        }
      },

      loginAdmin: (email: string) => {
        set({ isAdminLoggedIn: true, adminEmail: email });
      },

      logoutAdmin: () => {
        set({ isAdminLoggedIn: false, adminEmail: null });
      }
    }),
    {
      name: 'cuisinedz_main_app_store_v4',
    }
  )
);
