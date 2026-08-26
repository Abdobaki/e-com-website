-- ==============================================================================
-- 🏪 CUISINEDZ E-COMMERCE DATABASE SCHEMA & SEED FOR SUPABASE
-- Execute this script in your Supabase SQL Editor (https://supabase.com/dashboard/project/dtezehzmexdcqajozcrr/sql)
-- ==============================================================================

-- 1. EXTENSIONS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. CATEGORIES TABLE
CREATE TABLE IF NOT EXISTS public.categories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name_fr TEXT NOT NULL,
    name_ar TEXT NOT NULL,
    name_en TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    icon TEXT NOT NULL DEFAULT 'Flame',
    image_url TEXT,
    description_fr TEXT,
    description_ar TEXT,
    description_en TEXT,
    display_order INT DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. PRODUCTS TABLE
CREATE TABLE IF NOT EXISTS public.products (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    category_id UUID REFERENCES public.categories(id) ON DELETE SET NULL,
    name TEXT NOT NULL,
    name_ar TEXT,
    slug TEXT UNIQUE NOT NULL,
    description TEXT NOT NULL,
    description_ar TEXT,
    specifications JSONB DEFAULT '{}'::jsonb,
    brand TEXT NOT NULL,
    price INT NOT NULL, -- price in Algerian Dinars (DA)
    original_price INT, -- previous price if discounted (red strikethrough in UI)
    cost_price INT, -- wholesale / purchase price (private to admin)
    supplier TEXT, -- supplier / fournisseur (private to admin)
    supplier_paid INT DEFAULT 0,
    images TEXT[] DEFAULT ARRAY[]::TEXT[],

    stock INT DEFAULT 0 NOT NULL,
    is_active BOOLEAN DEFAULT true NOT NULL,
    is_featured BOOLEAN DEFAULT false NOT NULL,
    is_free_delivery BOOLEAN DEFAULT false NOT NULL,
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 4. ORDERS TABLE
CREATE TABLE IF NOT EXISTS public.orders (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_number TEXT UNIQUE NOT NULL,
    customer_name TEXT NOT NULL,
    customer_phone TEXT NOT NULL,
    wilaya TEXT NOT NULL,
    wilaya_code TEXT NOT NULL,
    commune TEXT NOT NULL,
    address TEXT NOT NULL,
    notes TEXT,
    payment_method TEXT DEFAULT 'cod' NOT NULL,
    subtotal INT NOT NULL,
    delivery_fee INT DEFAULT 0 NOT NULL,
    total INT NOT NULL,
    status TEXT DEFAULT 'pending' NOT NULL, -- pending, confirmed, preparing, shipped, delivered, cancelled
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 5. ORDER ITEMS TABLE
CREATE TABLE IF NOT EXISTS public.order_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_id UUID REFERENCES public.orders(id) ON DELETE CASCADE NOT NULL,
    product_id UUID REFERENCES public.products(id) ON DELETE SET NULL,
    product_name TEXT NOT NULL,
    product_price INT NOT NULL,
    product_image TEXT,
    quantity INT DEFAULT 1 NOT NULL,
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 6. STORE SETTINGS TABLE
CREATE TABLE IF NOT EXISTS public.store_settings (
    id INT PRIMARY KEY DEFAULT 1,
    store_name TEXT DEFAULT 'CuisineDZ' NOT NULL,
    store_tagline TEXT DEFAULT 'Électroménager de Cuisine & Maison en Algérie',
    store_phone TEXT DEFAULT '0550123456',
    whatsapp_number TEXT DEFAULT '213550123456',
    facebook_url TEXT DEFAULT 'https://facebook.com',
    instagram_url TEXT DEFAULT 'https://instagram.com',
    email TEXT DEFAULT 'contact@cuisinedz.com',
    address TEXT DEFAULT 'Alger, Algérie',
    currency TEXT DEFAULT 'DA',
    currency_ar TEXT DEFAULT 'د.ج',
    delivery_enabled BOOLEAN DEFAULT true NOT NULL,
    default_delivery_fee INT DEFAULT 600 NOT NULL,
    free_delivery_threshold INT,
    announcement_text TEXT DEFAULT '🔥 Livraison rapide 58 Wilayas | Paiement à la réception !',
    announcement_enabled BOOLEAN DEFAULT true,
    updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
    CONSTRAINT single_row CHECK (id = 1)
);

-- Initial Store Settings row
INSERT INTO public.store_settings (id, store_name, store_phone, whatsapp_number, facebook_url, instagram_url)
VALUES (1, 'CuisineDZ', '0550123456', '213550123456', 'https://facebook.com', 'https://instagram.com')
ON CONFLICT (id) DO NOTHING;

-- 7. SUPPLIERS TABLE
CREATE TABLE IF NOT EXISTS public.suppliers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    phone TEXT NOT NULL,
    address TEXT,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 8. SUPPLIER PAYMENTS TABLE
CREATE TABLE IF NOT EXISTS public.supplier_payments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    product_id UUID REFERENCES public.products(id) ON DELETE SET NULL,
    product_name TEXT NOT NULL,
    supplier_name TEXT NOT NULL,
    amount_paid INT NOT NULL,
    payment_date TEXT NOT NULL,
    payment_method TEXT DEFAULT 'cash' NOT NULL, -- cash, virement, cheque, baridimob
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 9. ENABLE ROW LEVEL SECURITY (RLS)
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.store_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.suppliers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.supplier_payments ENABLE ROW LEVEL SECURITY;

-- 10. POLICIES (DROP EXISTING FIRST TO AVOID DUPLICATE ERRORS)
DROP POLICY IF EXISTS "Public can view active categories" ON public.categories;
CREATE POLICY "Public can view active categories" ON public.categories
FOR SELECT USING (is_active = true);

DROP POLICY IF EXISTS "Public can view active products" ON public.products;
CREATE POLICY "Public can view active products" ON public.products
FOR SELECT USING (is_active = true);

DROP POLICY IF EXISTS "Public can create orders" ON public.orders;
CREATE POLICY "Public can create orders" ON public.orders
FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Public can insert order items" ON public.order_items;
CREATE POLICY "Public can insert order items" ON public.order_items
FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Public can view store settings" ON public.store_settings;
CREATE POLICY "Public can view store settings" ON public.store_settings
FOR SELECT USING (true);

-- Authenticated Users (Admins) have full access
DROP POLICY IF EXISTS "Admins have full access on categories" ON public.categories;
CREATE POLICY "Admins have full access on categories" ON public.categories
FOR ALL TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Admins have full access on products" ON public.products;
CREATE POLICY "Admins have full access on products" ON public.products
FOR ALL TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Admins have full access on orders" ON public.orders;
CREATE POLICY "Admins have full access on orders" ON public.orders
FOR ALL TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Admins have full access on order_items" ON public.order_items;
CREATE POLICY "Admins have full access on order_items" ON public.order_items
FOR ALL TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Admins have full access on store_settings" ON public.store_settings;
CREATE POLICY "Admins have full access on store_settings" ON public.store_settings
FOR ALL TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Admins have full access on suppliers" ON public.suppliers;
CREATE POLICY "Admins have full access on suppliers" ON public.suppliers
FOR ALL TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Admins have full access on supplier_payments" ON public.supplier_payments;
CREATE POLICY "Admins have full access on supplier_payments" ON public.supplier_payments
FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- Allow anon read on suppliers, supplier_payments, and orders if needed for store overview
DROP POLICY IF EXISTS "Public can view suppliers" ON public.suppliers;
CREATE POLICY "Public can view suppliers" ON public.suppliers
FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public can view supplier_payments" ON public.supplier_payments;
CREATE POLICY "Public can view supplier_payments" ON public.supplier_payments
FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public can view orders" ON public.orders;
CREATE POLICY "Public can view orders" ON public.orders
FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public can view order_items" ON public.order_items;
CREATE POLICY "Public can view order_items" ON public.order_items
FOR SELECT USING (true);

-- ==============================================================================
-- 11. OPTIONAL INITIAL SEED DATA
-- ==============================================================================

-- Categories Seed
INSERT INTO public.categories (name_fr, name_ar, name_en, slug, icon, display_order, is_active, image_url) VALUES
('Fours Encastrables', 'أفران مدمجة', 'Built-in Ovens', 'fours-encastrables', 'Flame', 1, true, 'https://images.unsplash.com/photo-1584992236310-6edddc08acff?auto=format&fit=crop&w=800&q=80'),
('Plaques de Cuisson', 'لوحات الطهي', 'Cooktops & Hobs', 'plaques-de-cuisson', 'Flame', 2, true, 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=800&q=80'),
('Hottes Aspirantes', 'شفاطات المطبخ', 'Range Hoods', 'hottes-aspirantes', 'Wind', 3, true, 'https://images.unsplash.com/photo-1588854337236-6889d631faa8?auto=format&fit=crop&w=800&q=80'),
('Micro-ondes', 'ميكروويف', 'Microwaves', 'micro-ondes', 'Sparkles', 4, true, 'https://images.unsplash.com/photo-1574269909862-7e1d70bb8078?auto=format&fit=crop&w=800&q=80'),
('Machines à Café', 'آلات القهوة', 'Coffee Machines', 'machines-a-cafe', 'Coffee', 5, true, 'https://images.unsplash.com/photo-1517668808822-9ebb02f2a0e6?auto=format&fit=crop&w=800&q=80'),
('Robots & Préparation', 'خلاطات ومحضرات', 'Kitchen Appliances', 'robots-preparation', 'Zap', 6, true, 'https://images.unsplash.com/photo-1570222094114-d054a817e56b?auto=format&fit=crop&w=800&q=80')
ON CONFLICT (slug) DO NOTHING;

-- Suppliers Seed
INSERT INTO public.suppliers (name, phone, address, notes) VALUES
('Grossiste El-Eulma (Lot 14)', '0555667788', 'Zone Industrielle, El Eulma - Sétif', 'Fours, plaques & hottes. Livraison rapide.'),
('Importateur Alger (Zone Oued Smar)', '0661223344', 'Zone Commerciale Oued Smar - Alger', 'Micro-ondes, robots, machines café.')
ON CONFLICT DO NOTHING;


