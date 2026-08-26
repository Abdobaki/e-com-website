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

          // Debug: log current auth session
          const { data: sessionData } = await supabase.auth.getSession();
          console.log('[Supabase] Current auth session:', sessionData?.session ? `Authenticated as ${sessionData.session.user.email}` : 'NOT authenticated (anon)');
          
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
        const newId = typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : 'prod-' + Date.now();
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
          const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(newId);
          const isCategoryUuid = productData.category_id && /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(productData.category_id);

          // Only include columns that exist in the Supabase products table
          const payload: Record<string, unknown> = {
            name: newProduct.name,
            name_ar: newProduct.name_ar || null,
            slug: newProduct.slug,
            description: newProduct.description,
            description_ar: newProduct.description_ar || null,
            specifications: newProduct.specifications || {},
            brand: newProduct.brand,
            price: newProduct.price,
            original_price: newProduct.original_price || null,
            cost_price: newProduct.cost_price || null,
            supplier: newProduct.supplier || null,
            supplier_paid: newProduct.supplier_paid || 0,
            images: newProduct.images || [],
            stock: newProduct.stock,
            is_active: newProduct.is_active,
            is_featured: newProduct.is_featured,
          };

          if (isUuid) payload.id = newId;
          if (isCategoryUuid) payload.category_id = productData.category_id;

          const { data, error } = await supabase.from('products').insert([payload]).select();
          if (error) {
            console.error('Supabase Product Insert Error:', error.message, error);
            alert(`❌ Product insert failed: ${error.message}`);
          } else if (data && data[0]) {
            const inserted = data[0];
            set((state) => ({
              products: state.products.map(p => p.id === newId ? { ...p, id: inserted.id } : p)
            }));
          }
        } catch (err) {
          console.error('Unexpected error inserting product to Supabase:', err);
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
          const isCategoryUuid = updates.category_id && /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(updates.category_id);
          
          // Only include columns that exist in the Supabase products table
          // (exclude TypeScript-only fields like name_en, description_en, specifications_ar, etc.)
          const allowedColumns = [
            'name', 'name_ar', 'slug', 'description', 'description_ar',
            'specifications', 'brand', 'price', 'original_price', 'cost_price',
            'supplier', 'supplier_paid', 'images', 'stock', 'is_active', 'is_featured',
            'category_id', 'updated_at'
          ];
          const cleanUpdates: Record<string, unknown> = {};
          for (const key of allowedColumns) {
            if (key in updates) {
              cleanUpdates[key] = (updates as Record<string, unknown>)[key];
            }
          }
          if (updates.category_id && !isCategoryUuid) {
            delete cleanUpdates.category_id;
          }

          const { error } = await supabase.from('products').update(cleanUpdates).eq('id', id);
          if (error) {
            console.error('Supabase Product Update Error:', error.message);
            alert(`❌ Product update failed: ${error.message}`);
          }
        } catch (err) {
          console.error('Unexpected error updating product in Supabase:', err);
        }
      },

      deleteProduct: async (id) => {
        set((state) => ({
          products: state.products.filter((p) => p.id !== id)
        }));

        try {
          const { error } = await supabase.from('products').delete().eq('id', id);
          if (error) {
            console.error('Supabase Product Delete Error:', error.message);
            alert(`❌ Product delete failed: ${error.message}`);
          }
        } catch (err) {
          console.error('Unexpected error deleting product in Supabase:', err);
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
          const { error } = await supabase.from('products').update({ stock: validStock }).eq('id', id);
          if (error) {
            console.error('Supabase Stock Update Error:', error.message);
            alert(`❌ Stock update failed: ${error.message}`);
          }
        } catch (err) {
          console.error('Unexpected error updating stock in Supabase:', err);
        }
      },

      addCategory: async (categoryData) => {
        const newId = typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : 'cat-' + Date.now();
        const newCategory: Category = {
          ...categoryData,
          id: newId
        };

        set((state) => ({
          categories: [...state.categories, newCategory]
        }));

        try {
          const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(newId);
          const payload: Record<string, unknown> = {
            name_fr: newCategory.name_fr,
            name_ar: newCategory.name_ar,
            name_en: newCategory.name_en,
            slug: newCategory.slug,
            icon: newCategory.icon,
            image_url: newCategory.image_url || null,
            description_fr: newCategory.description_fr || null,
            description_ar: newCategory.description_ar || null,
            description_en: newCategory.description_en || null,
            display_order: newCategory.display_order || 0,
            is_active: newCategory.is_active ?? true
          };
          if (isUuid) payload.id = newId;

          const { data, error } = await supabase.from('categories').insert([payload]).select();
          if (error) {
            console.error('Supabase Category Insert Error:', error.message);
            alert(`❌ Category insert failed: ${error.message}`);
          } else if (data && data[0]) {
            const inserted = data[0];
            set((state) => ({
              categories: state.categories.map(c => c.id === newId ? { ...c, id: inserted.id } : c)
            }));
          }
        } catch (err) {
          console.error('Unexpected error inserting category in Supabase:', err);
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
          const { error } = await supabase.from('categories').update(updates).eq('id', id);
          if (error) {
            console.error('Supabase Category Update Error:', error.message);
            alert(`❌ Category update failed: ${error.message}`);
          }
        } catch (err) {
          console.error('Unexpected error updating category in Supabase:', err);
        }
      },

      deleteCategory: async (id) => {
        set((state) => ({
          categories: state.categories.filter((c) => c.id !== id)
        }));

        try {
          const { error } = await supabase.from('categories').delete().eq('id', id);
          if (error) {
            console.error('Supabase Category Delete Error:', error.message);
            alert(`❌ Category delete failed: ${error.message}`);
          }
        } catch (err) {
          console.error('Unexpected error deleting category in Supabase:', err);
        }
      },

      addOrder: async (orderData) => {
        const orderCount = get().orders.length + 1049;
        const orderNumber = `ORD-${orderCount}`;
        const newId = typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : 'ord-' + Date.now();
        const newOrder: Order = {
          ...orderData,
          id: newId,
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
          const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(newId);
          const orderPayload: Record<string, unknown> = {
            order_number: newOrder.order_number,
            customer_name: newOrder.customer_name,
            customer_phone: newOrder.customer_phone,
            wilaya: newOrder.wilaya,
            wilaya_code: newOrder.wilaya_code,
            commune: newOrder.commune,
            address: newOrder.address,
            notes: newOrder.notes || null,
            payment_method: newOrder.payment_method,
            subtotal: newOrder.subtotal,
            delivery_fee: newOrder.delivery_fee,
            total: newOrder.total,
            status: newOrder.status
          };
          if (isUuid) orderPayload.id = newId;

          const { data: insertedOrder, error: orderErr } = await supabase.from('orders').insert([orderPayload]).select();
          if (orderErr) {
            console.error('Supabase Order Insert Error:', orderErr.message);
            alert(`❌ Order insert failed: ${orderErr.message}`);
          } else if (insertedOrder && insertedOrder[0]) {
            const actualOrderId = insertedOrder[0].id;
            // Also insert order items if items exist
            if (orderData.items && orderData.items.length > 0) {
              const itemsPayload = orderData.items.map(item => {
                const isProductUuid = item.product_id && /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(item.product_id);
                return {
                  order_id: actualOrderId,
                  product_id: isProductUuid ? item.product_id : null,
                  product_name: item.product_name,
                  product_price: item.product_price,
                  product_image: item.product_image || null,
                  quantity: item.quantity
                };
              });
              const { error: itemsErr } = await supabase.from('order_items').insert(itemsPayload);
              if (itemsErr) {
                console.error('Supabase Order Items Insert Error:', itemsErr.message);
                alert(`❌ Order items insert failed: ${itemsErr.message}`);
              }
            }
          }
        } catch (err) {
          console.error('Unexpected error inserting order in Supabase:', err);
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
          const { error } = await supabase.from('orders').update({ status }).eq('id', orderId);
          if (error) {
            console.error('Supabase Order Status Update Error:', error.message);
            alert(`❌ Order status update failed: ${error.message}`);
          }
        } catch (err) {
          console.error('Unexpected error updating order status in Supabase:', err);
        }
      },

      deleteOrder: async (orderId) => {
        set((state) => ({
          orders: state.orders.filter((order) => order.id !== orderId)
        }));

        try {
          const { error } = await supabase.from('orders').delete().eq('id', orderId);
          if (error) {
            console.error('Supabase Order Delete Error:', error.message);
            alert(`❌ Order delete failed: ${error.message}`);
          }
        } catch (err) {
          console.error('Unexpected error deleting order in Supabase:', err);
        }
      },

      addSupplierPayment: async (paymentData) => {
        const newId = typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : 'pay-' + Date.now();
        const newPayment: SupplierPayment = {
          ...paymentData,
          id: newId,
          created_at: new Date().toISOString()
        };

        set((state) => {
          let updatedProducts = state.products;
          if (paymentData.product_id) {
            updatedProducts = state.products.map((p) => {
              if (p.id === paymentData.product_id) {
                const currentPaid = p.supplier_paid || 0;
                const newPaid = currentPaid + paymentData.amount_paid;
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
          const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(newId);
          const isProdUuid = paymentData.product_id && /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(paymentData.product_id);

          const payload: Record<string, unknown> = {
            product_name: paymentData.product_name,
            supplier_name: paymentData.supplier_name,
            amount_paid: paymentData.amount_paid,
            payment_date: paymentData.payment_date,
            payment_method: paymentData.payment_method,
            notes: paymentData.notes || null,
          };
          if (isUuid) payload.id = newId;
          if (isProdUuid) payload.product_id = paymentData.product_id;

          const { error } = await supabase.from('supplier_payments').insert([payload]);
          if (error) {
            console.error('Supabase Supplier Payment Insert Error:', error.message);
            alert(`❌ Supplier payment insert failed: ${error.message}`);
          }
        } catch (err) {
          console.error('Unexpected error inserting supplier payment in Supabase:', err);
        }

        return newPayment;
      },

      addSupplier: async (supplierData) => {
        const newId = typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : 'sup-' + Date.now();
        const newSupplier: Supplier = {
          ...supplierData,
          id: newId,
          created_at: new Date().toISOString()
        };

        set((state) => ({
          suppliers: [newSupplier, ...state.suppliers]
        }));

        try {
          const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(newId);
          const payload: Record<string, unknown> = {
            name: newSupplier.name,
            phone: newSupplier.phone,
            address: newSupplier.address || null,
            notes: newSupplier.notes || null
          };
          if (isUuid) payload.id = newId;

          const { error } = await supabase.from('suppliers').insert([payload]);
          if (error) {
            console.error('Supabase Supplier Insert Error:', error.message);
            alert(`❌ Supplier insert failed: ${error.message}`);
          }
        } catch (err) {
          console.error('Unexpected error inserting supplier in Supabase:', err);
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
          const { error } = await supabase.from('suppliers').update(updates).eq('id', id);
          if (error) {
            console.error('Supabase Supplier Update Error:', error.message);
            alert(`❌ Supplier update failed: ${error.message}`);
          }
        } catch (err) {
          console.error('Unexpected error updating supplier in Supabase:', err);
        }
      },

      deleteSupplier: async (id) => {
        set((state) => ({
          suppliers: state.suppliers.filter((s) => s.id !== id)
        }));

        try {
          const { error } = await supabase.from('suppliers').delete().eq('id', id);
          if (error) {
            console.error('Supabase Supplier Delete Error:', error.message);
            alert(`❌ Supplier delete failed: ${error.message}`);
          }
        } catch (err) {
          console.error('Unexpected error deleting supplier in Supabase:', err);
        }
      },

      updateSettings: async (newSettings) => {
        set((state) => ({
          settings: { ...state.settings, ...newSettings }
        }));

        try {
          const { error } = await supabase.from('store_settings').update(newSettings).eq('id', 1);
          if (error) {
            console.error('Supabase Settings Update Error:', error.message);
            alert(`❌ Settings update failed: ${error.message}`);
          }
        } catch (err) {
          console.error('Unexpected error updating store settings in Supabase:', err);
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
