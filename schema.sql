-- Supabase SQL Schema - GUNCEL GUVENLIKLI VERSIYON
-- Bu kodu Supabase Dashboard > SQL Editor'a yapistirin

-- Mevcut tablolari temizle (varsa)
DROP POLICY IF EXISTS "Allow all on users" ON users;
DROP POLICY IF EXISTS "Allow all on products" ON products;
DROP POLICY IF EXISTS "Public read products" ON products;
DROP POLICY IF EXISTS "Admin write products" ON products;
DROP POLICY IF EXISTS "Public read users" ON users;
DROP POLICY IF EXISTS "Admin write users" ON users;
DROP POLICY IF EXISTS "Users read own profile" ON users;
DROP POLICY IF EXISTS "Users update own profile" ON users;

-- Users tablosu
CREATE TABLE IF NOT EXISTS users (
  uid TEXT PRIMARY KEY,
  name TEXT NOT NULL DEFAULT '',
  email TEXT NOT NULL DEFAULT '',
  phone TEXT NOT NULL DEFAULT '',
  gender TEXT NOT NULL DEFAULT '',
  role TEXT NOT NULL DEFAULT 'user',
  created_at TEXT NOT NULL DEFAULT (now()::text),
  phone_verified BOOLEAN NOT NULL DEFAULT false
);

-- Products tablosu
CREATE TABLE IF NOT EXISTS products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT NOT NULL DEFAULT '',
  price NUMERIC NOT NULL DEFAULT 0,
  category TEXT NOT NULL DEFAULT 'Diger',
  image TEXT NOT NULL DEFAULT '',
  stock INTEGER NOT NULL DEFAULT 0,
  featured BOOLEAN NOT NULL DEFAULT false,
  sizes JSONB NOT NULL DEFAULT '[]',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Orders tablosu (yeni)
CREATE TABLE IF NOT EXISTS orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_code TEXT NOT NULL DEFAULT '',
  user_uid TEXT NOT NULL REFERENCES users(uid),
  items JSONB NOT NULL DEFAULT '[]',
  address JSONB NOT NULL DEFAULT '{}',
  total NUMERIC NOT NULL DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'pending',
  payment_method TEXT DEFAULT '',
  cargo_company TEXT NOT NULL DEFAULT '',
  cargo_tracking TEXT NOT NULL DEFAULT '',
  cargo_status TEXT NOT NULL DEFAULT 'pending',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- RLS'yi aktif et
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

-- PRODUCTS politikalari: Herkes okuyabilir, sadece admin yazabilir
CREATE POLICY "Public read products" ON products
  FOR SELECT USING (true);

CREATE POLICY "Admin insert products" ON products
  FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM users WHERE uid = auth.uid()::text AND role = 'admin')
  );

CREATE POLICY "Admin update products" ON products
  FOR UPDATE USING (
    EXISTS (SELECT 1 FROM users WHERE uid = auth.uid()::text AND role = 'admin')
  );

CREATE POLICY "Admin delete products" ON products
  FOR DELETE USING (
    EXISTS (SELECT 1 FROM users WHERE uid = auth.uid()::text AND role = 'admin')
  );

-- USERS politikalari: Herkes okuyabilir (isim, email), sadece admin yazabilir
CREATE POLICY "Public read users limited" ON users
  FOR SELECT USING (true);

CREATE POLICY "Admin insert users" ON users
  FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM users WHERE uid = auth.uid()::text AND role = 'admin')
  );

CREATE POLICY "Admin update users" ON users
  FOR UPDATE USING (
    EXISTS (SELECT 1 FROM users WHERE uid = auth.uid()::text AND role = 'admin')
  );

CREATE POLICY "Admin delete users" ON users
  FOR DELETE USING (
    EXISTS (SELECT 1 FROM users WHERE uid = auth.uid()::text AND role = 'admin')
  );

-- ORDERS politikalari: Kullanicilar kendi siparislerini gorebilir, admin hepsini gorebilir
CREATE POLICY "Users read own orders" ON orders
  FOR SELECT USING (
    user_uid = auth.uid()::text OR
    EXISTS (SELECT 1 FROM users WHERE uid = auth.uid()::text AND role = 'admin')
  );

CREATE POLICY "Authenticated insert orders" ON orders
  FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Admin update orders" ON orders
  FOR UPDATE USING (
    EXISTS (SELECT 1 FROM users WHERE uid = auth.uid()::text AND role = 'admin')
  );

-- Service role her seyi yapabilir (API route'lari icin)
CREATE POLICY "Service role full access" ON users
  FOR ALL USING (true) WITH CHECK (true);

CREATE POLICY "Service role full access products" ON products
  FOR ALL USING (true) WITH CHECK (true);

CREATE POLICY "Service role full access orders" ON orders
  FOR ALL USING (true) WITH CHECK (true);

-- Index'ler
CREATE INDEX IF NOT EXISTS idx_products_category ON products(category);
CREATE INDEX IF NOT EXISTS idx_products_featured ON products(featured);
CREATE INDEX IF NOT EXISTS idx_orders_user ON orders(user_uid);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);

-- Reviews tablosu
CREATE TABLE IF NOT EXISTS reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID NOT NULL REFERENCES products(id),
  user_uid TEXT NOT NULL,
  rating INTEGER NOT NULL DEFAULT 5,
  comment TEXT NOT NULL DEFAULT '',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read reviews" ON reviews FOR SELECT USING (true);
CREATE POLICY "Service role full access reviews" ON reviews FOR ALL USING (true) WITH CHECK (true);
CREATE INDEX IF NOT EXISTS idx_reviews_product ON reviews(product_id);
