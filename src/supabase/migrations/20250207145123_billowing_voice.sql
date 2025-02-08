/*
  # Create inventory management tables

  1. New Tables
    - `inventory_items`
      - `id` (uuid, primary key)
      - `name` (text)
      - `quantity` (integer)
      - `unit` (text)
      - `min_threshold` (integer)
      - `expiry_date` (date)
      - `category` (text)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

  2. Security
    - Enable RLS on `inventory_items` table
    - Add policies for authenticated users to manage inventory
*/

CREATE TABLE IF NOT EXISTS inventory_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  quantity integer NOT NULL DEFAULT 0,
  unit text NOT NULL,
  min_threshold integer NOT NULL DEFAULT 10,
  expiry_date date,
  category text NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE inventory_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view inventory"
  ON inventory_items
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Staff can manage inventory"
  ON inventory_items
  FOR ALL
  TO authenticated
  USING (true);

-- Trigger to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_inventory_items_updated_at
  BEFORE UPDATE
  ON inventory_items
  FOR EACH ROW
  EXECUTE PROCEDURE update_updated_at_column();