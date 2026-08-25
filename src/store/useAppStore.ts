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

// Generate rich sample order history across the last 7 days for the profit chart
const now = new Date();
const getPastDate = (daysAgo: number, hoursAgo = 0) => {
  const d = new Date(now);
  d.setDate(d.getDate() - daysAgo);
  d.setHours(d.getHours() - hoursAgo);
  return d.toISOString();
};

const INITIAL_ORDERS: Order[] = [
  {
    id: 'ord-1042',
    order_number: 'ORD-1042',
    customer_name: 'Mohamed Benali',
    customer_phone: '0555123456',
    wilaya: '28 - M’Sila',
    wilaya_code: '28',
    commune: 'M’Sila',
    address: 'Cité 500 Logements, Bât A4',
    notes: 'Appeler avant de venir SVP',
    payment_method: 'cod',
    items: [
      {
        product_id: 'prod-1',
        product_name: 'Four Encastrable Électrique 65L Inox Multi-Fonctions',
        product_price: 49500,
        product_cost_price: 38000,
        product_image: 'https://images.unsplash.com/photo-1590794056226-79ef3a8147e1?auto=format&fit=crop&w=800&q=80',
        quantity: 1
      }
    ],
    subtotal: 49500,
    delivery_fee: 700,
    total: 50200,
    status: 'delivered',
    created_at: getPastDate(0, 2) // Today
  },
  {
    id: 'ord-1043',
    order_number: 'ORD-1043',
    customer_name: 'Amina Mansouri',
    customer_phone: '0661987654',
    wilaya: '16 - Alger',
    wilaya_code: '16',
    commune: 'Hydra',
    address: 'Résidence Les Pins, Apt 12',
    notes: 'Livraison après 17h',
    payment_method: 'cod',
    items: [
      {
        product_id: 'prod-3',
        product_name: 'Plaque de Cuisson Gaz 4 Feux Verre Trempé Noir 60cm',
        product_price: 33500,
        product_cost_price: 25000,
        product_image: 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=800&q=80',
        quantity: 1
      },
      {
        product_id: 'prod-5',
        product_name: 'Hotte Aspirante Inclinée 90cm Verre Noir & Inox 750 m³/h',
        product_price: 38000,
        product_cost_price: 29000,
        product_image: 'https://images.unsplash.com/photo-1588854337236-6889d631faa8?auto=format&fit=crop&w=800&q=80',
        quantity: 1
      }
    ],
    subtotal: 71500,
    delivery_fee: 400,
    total: 71900,
    status: 'confirmed',
    created_at: getPastDate(0, 5) // Today
  },
  {
    id: 'ord-1044',
    order_number: 'ORD-1044',
    customer_name: 'Karim Bouzid',
    customer_phone: '0770334455',
    wilaya: '31 - Oran',
    wilaya_code: '31',
    commune: 'Bir El Djir',
    address: 'Akid Lotfi',
    payment_method: 'cod',
    items: [
      {
        product_id: 'prod-7',
        product_name: 'Machine Espresso Automatique avec Broyeur à Grains 15 Bars',
        product_price: 78000,
        product_cost_price: 61000,
        product_image: 'https://images.unsplash.com/photo-1517668808822-9ebb02f2a0e6?auto=format&fit=crop&w=800&q=80',
        quantity: 1
      }
    ],
    subtotal: 78000,
    delivery_fee: 600,
    total: 78600,
    status: 'delivered',
    created_at: getPastDate(1, 4) // Yesterday
  },
  {
    id: 'ord-1045',
    order_number: 'ORD-1045',
    customer_name: 'Yacine Brahimi',
    customer_phone: '0560889900',
    wilaya: '19 - Sétif',
    wilaya_code: '19',
    commune: 'El Eulma',
    address: 'Boulevard Central',
    payment_method: 'cod',
    items: [
      {
        product_id: 'prod-2',
        product_name: 'Four Encastrable Pyrolyse Premium 71L Digital Touch',
        product_price: 84000,
        product_cost_price: 66000,
        product_image: 'https://images.unsplash.com/photo-1584992236310-6edddc08acff?auto=format&fit=crop&w=800&q=80',
        quantity: 1
      }
    ],
    subtotal: 84000,
    delivery_fee: 600,
    total: 84600,
    status: 'delivered',
    created_at: getPastDate(2, 6) // 2 days ago
  },
  {
    id: 'ord-1046',
    order_number: 'ORD-1046',
    customer_name: 'Samir Khelil',
    customer_phone: '0662112233',
    wilaya: '25 - Constantine',
    wilaya_code: '25',
    commune: 'El Khroub',
    address: 'Cité Massinissa',
    payment_method: 'cod',
    items: [
      {
        product_id: 'prod-8',
        product_name: 'Robot Pâtissier Multifonction 1500W Bol Inox 6.5L + Kit Pâtisserie',
        product_price: 29500,
        product_cost_price: 22000,
        product_image: 'https://images.unsplash.com/photo-1570222094114-d054a817e56b?auto=format&fit=crop&w=800&q=80',
        quantity: 2
      }
    ],
    subtotal: 59000,
    delivery_fee: 600,
    total: 59600,
    status: 'delivered',
    created_at: getPastDate(3, 3) // 3 days ago
  },
  {
    id: 'ord-1047',
    order_number: 'ORD-1047',
    customer_name: 'Nadia Cherif',
    customer_phone: '0551778899',
    wilaya: '09 - Blida',
    wilaya_code: '09',
    commune: 'Boufarik',
    address: 'Centre Ville',
    payment_method: 'cod',
    items: [
      {
        product_id: 'prod-1',
        product_name: 'Four Encastrable Électrique 65L Inox Multi-Fonctions',
        product_price: 49500,
        product_cost_price: 38000,
        quantity: 1
      },
      {
        product_id: 'prod-4',
        product_name: 'Plaque Induction 4 Foyers Booster & Minuterie Individuelle',
        product_price: 62000,
        product_cost_price: 48000,
        quantity: 1
      }
    ],
    subtotal: 111500,
    delivery_fee: 500,
    total: 112000,
    status: 'delivered',
    created_at: getPastDate(4, 5) // 4 days ago
  },
  {
    id: 'ord-1048',
    order_number: 'ORD-1048',
    customer_name: 'Farid Meziane',
    customer_phone: '0771445566',
    wilaya: '15 - Tizi Ouzou',
    wilaya_code: '15',
    commune: 'Azazga',
    address: 'Rue Principale',
    payment_method: 'cod',
    items: [
      {
        product_id: 'prod-6',
        product_name: 'Micro-ondes Grill Encastrable 25L Inox Anti-Empreinte',
        product_price: 36000,
        product_cost_price: 27000,
        quantity: 1
      }
    ],
    subtotal: 36000,
    delivery_fee: 600,
    total: 36600,
    status: 'delivered',
    created_at: getPastDate(5, 7) // 5 days ago
  }
];

const INITIAL_SUPPLIER_PAYMENTS: SupplierPayment[] = [
  {
    id: 'pay-1',
    product_name: 'Four Encastrable Électrique 65L Inox Multi-Fonctions',
    supplier_name: 'Grossiste El-Eulma (Lot 14)',
    amount_paid: 150000,
    payment_date: '2026-08-20 10:30',
    payment_method: 'cash',
    notes: 'Premier versement espèces pour le lot de fours',
    created_at: getPastDate(4)
  },
  {
    id: 'pay-2',
    product_name: 'Plaques & Hottes Encastrables',
    supplier_name: 'Importateur Alger (Zone Oued Smar)',
    amount_paid: 200000,
    payment_date: '2026-08-22 15:45',
    payment_method: 'virement',
    notes: 'Avance par virement bancaire',
    created_at: getPastDate(2)
  }
];

const INITIAL_SUPPLIERS: Supplier[] = [
  {
    id: 'sup-1',
    name: 'Grossiste El-Eulma (Lot 14)',
    phone: '0555667788',
    address: 'Zone Industrielle, El Eulma - Sétif',
    notes: 'Fours, plaques & hottes. Livraison rapide.',
    created_at: getPastDate(30)
  },
  {
    id: 'sup-2',
    name: 'Importateur Alger (Zone Oued Smar)',
    phone: '0661223344',
    address: 'Zone Commerciale Oued Smar - Alger',
    notes: 'Micro-ondes, robots, machines café. Paiement par virement.',
    created_at: getPastDate(20)
  }
];

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
      name: 'cuisinedz_main_app_store_v3',
    }
  )
);
