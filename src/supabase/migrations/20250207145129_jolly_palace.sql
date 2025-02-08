/*
  # Create waste management tables

  1. New Tables
    - `waste_records`
      - `id` (uuid, primary key)
      - `item_name` (text)
      - `quantity` (integer)
      - `reason` (text)
      - `date` (date)
      - `cost` (decimal)
      - `created_at` (timestamptz)
      - `created_by` (uuid, references auth.users)

  2. Security
    - Enable RLS on `waste_records` table
    - Add policies for authenticated users to manage waste records
*/

CREATE TABLE IF NOT EXISTS waste_records (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  item_name text NOT NULL,
  quantity integer NOT NULL,
  reason text NOT NULL,
  date date NOT NULL DEFAULT CURRENT_DATE,
  cost decimal(10,2) NOT NULL,
  created_at timestamptz DEFAULT now(),
  created_by uuid REFERENCES auth.users(id)
);

ALTER TABLE waste_records ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view waste records"
  ON waste_records
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Staff can create waste records"
  ON waste_records
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = created_by);

CREATE POLICY "Staff can update their waste records"
  ON waste_records
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = created_by);