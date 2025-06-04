-- Create products table
CREATE TABLE IF NOT EXISTS products (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Add RLS policies
ALTER TABLE products ENABLE ROW LEVEL SECURITY;

-- Allow users to select their own products
CREATE POLICY "Users can view their own products"
  ON products FOR SELECT
  USING (auth.uid() = user_id);

-- Allow users to insert their own products
CREATE POLICY "Users can insert their own products"
  ON products FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Allow users to update their own products
CREATE POLICY "Users can update their own products"
  ON products FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Allow users to delete their own products
CREATE POLICY "Users can delete their own products"
  ON products FOR DELETE
  USING (auth.uid() = user_id);

-- Add foreign key to qr_codes table
ALTER TABLE qr_codes
ADD COLUMN product_id UUID REFERENCES products(id) ON DELETE SET NULL; 