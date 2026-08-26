export type Language = 'fr' | 'ar' | 'en';

export interface Category {
  id: string;
  name_fr: string;
  name_ar: string;
  name_en: string;
  slug: string;
  icon: string;
  image_url?: string;
  description_fr?: string;
  description_ar?: string;
  description_en?: string;
  display_order: number;
  is_active: boolean;
  created_at?: string;
}

export interface Product {
  id: string;
  category_id: string;
  category_slug?: string;
  name: string;
  name_ar?: string;
  name_en?: string;
  slug: string;
  description: string;
  description_ar?: string;
  description_en?: string;
  specifications: Record<string, string>;
  specifications_ar?: Record<string, string>;
  specifications_en?: Record<string, string>;
  brand: string;
  price: number; // in Algerian Dinars (DA) - selling price
  original_price?: number; // for discount comparison (e.g. مشطوب in red)
  cost_price?: number; // Wholesale / Purchase price (prix d'achat - private to admin)
  supplier?: string; // Supplier / Fournisseur (private to admin)
  supplier_paid?: number; // Amount paid so far to supplier for this stock batch
  images: string[];
  stock: number;
  is_active: boolean;
  is_featured: boolean;
  is_free_delivery?: boolean;
  rating?: number;
  reviews_count?: number;
  created_at?: string;
  updated_at?: string;
}

export type OrderStatus = 'pending' | 'confirmed' | 'preparing' | 'shipped' | 'delivered' | 'cancelled';

export interface OrderItem {
  id?: string;
  order_id?: string;
  product_id: string;
  product_name: string;
  product_price: number;
  product_cost_price?: number; // captured cost price for exact margin
  product_image?: string;
  quantity: number;
}

export interface Order {
  id: string;
  order_number: string;
  customer_name: string;
  customer_phone: string;
  wilaya: string;
  wilaya_code: string;
  commune: string;
  address: string;
  notes?: string;
  payment_method: 'cod';
  items: OrderItem[];
  subtotal: number;
  delivery_fee: number;
  total: number;
  status: OrderStatus;
  created_at: string;
  updated_at?: string;
}

export interface SupplierPayment {
  id: string;
  product_id?: string;
  product_name: string;
  supplier_name: string;
  amount_paid: number;
  payment_date: string; // formatted with date & time (e.g. 2026-08-24 14:30)
  payment_method: 'cash' | 'virement' | 'cheque' | 'baridimob';
  notes?: string;
  created_at: string;
}

export interface Supplier {
  id: string;
  name: string;
  phone: string;
  address?: string;
  notes?: string;
  created_at: string;
}


export interface StoreSettings {
  store_name: string;
  store_tagline: string;
  store_phone: string;
  whatsapp_number: string;
  facebook_url: string;
  instagram_url: string;
  email: string;
  address: string;
  currency: string;
  currency_ar: string;
  delivery_enabled: boolean;
  default_delivery_fee: number;
  free_delivery_threshold?: number;
  announcement_text?: string;
  announcement_enabled?: boolean;
}

export interface Wilaya {
  code: string;
  name_fr: string;
  name_ar: string;
  delivery_fee: number; // Home delivery fee
  desk_fee?: number;    // Office / Stop-desk delivery fee
  is_active: boolean;
  communes: string[];
}

export interface CartItem {
  product: Product;
  quantity: number;
}
