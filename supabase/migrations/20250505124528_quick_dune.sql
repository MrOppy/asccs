/*
  # Initial Schema Setup

  1. New Tables
    - `accounts`
      - `id` (uuid, primary key)
      - `created_at` (timestamp)
      - `level` (integer)
      - `likes` (integer)
      - `platform` (text)
      - `price` (integer)
      - `details` (text)
      - `seller_id` (uuid, foreign key to sellers)
      - `outfits` (text array)
      - `diamonds` (integer)
      - `featured` (boolean)
      - `images` (text array)
      
    - `sellers`
      - `id` (uuid, primary key)
      - `created_at` (timestamp)
      - `name` (text)
      - `rating` (float)
      - `verified` (boolean)
      - `account_count` (integer)
      - `image` (text)
      
    - `reviews`
      - `id` (uuid, primary key)
      - `created_at` (timestamp)
      - `name` (text)
      - `rating` (integer)
      - `comment` (text)
      - `avatar` (text)
      
  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users to select public data
    - Add policies for authenticated users to manage data
*/

-- Create accounts table
CREATE TABLE IF NOT EXISTS accounts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz DEFAULT now(),
  level integer NOT NULL,
  likes integer NOT NULL,
  platform text NOT NULL,
  price integer NOT NULL,
  details text NOT NULL,
  seller_id uuid NOT NULL,
  outfits text[] DEFAULT '{}',
  diamonds integer NOT NULL,
  featured boolean DEFAULT false,
  images text[] DEFAULT '{}'
);

-- Create sellers table
CREATE TABLE IF NOT EXISTS sellers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz DEFAULT now(),
  name text NOT NULL,
  rating float DEFAULT 5.0,
  verified boolean DEFAULT false,
  account_count integer DEFAULT 0,
  image text
);

-- Create reviews table
CREATE TABLE IF NOT EXISTS reviews (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz DEFAULT now(),
  name text NOT NULL,
  rating integer NOT NULL,
  comment text NOT NULL,
  avatar text
);

-- Add foreign key constraint
ALTER TABLE accounts
ADD CONSTRAINT fk_seller
FOREIGN KEY (seller_id)
REFERENCES sellers (id)
ON DELETE CASCADE;

-- Enable Row Level Security
ALTER TABLE accounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE sellers ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;

-- Policies for public access
CREATE POLICY "Anyone can view accounts" 
  ON accounts 
  FOR SELECT 
  TO anon, authenticated 
  USING (true);

CREATE POLICY "Anyone can view sellers" 
  ON sellers 
  FOR SELECT 
  TO anon, authenticated 
  USING (true);

CREATE POLICY "Anyone can view reviews" 
  ON reviews 
  FOR SELECT 
  TO anon, authenticated 
  USING (true);

-- Policies for admin access
CREATE POLICY "Authenticated users can manage accounts" 
  ON accounts 
  FOR ALL 
  TO authenticated 
  USING (true) 
  WITH CHECK (true);

CREATE POLICY "Authenticated users can manage sellers" 
  ON sellers 
  FOR ALL 
  TO authenticated 
  USING (true) 
  WITH CHECK (true);

CREATE POLICY "Authenticated users can manage reviews" 
  ON reviews 
  FOR ALL 
  TO authenticated 
  USING (true) 
  WITH CHECK (true);