/*
  # Create staff scheduling tables

  1. New Tables
    - `employees`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references auth.users)
      - `name` (text)
      - `role` (text)
      - `max_hours_per_week` (integer)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

    - `shifts`
      - `id` (uuid, primary key)
      - `employee_id` (uuid, references employees)
      - `date` (date)
      - `start_time` (time)
      - `end_time` (time)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

  2. Security
    - Enable RLS on both tables
    - Add policies for authenticated users to manage schedules
*/

CREATE TABLE IF NOT EXISTS employees (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id),
  name text NOT NULL,
  role text NOT NULL,
  max_hours_per_week integer NOT NULL DEFAULT 40,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS shifts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  employee_id uuid REFERENCES employees(id),
  date date NOT NULL,
  start_time time NOT NULL,
  end_time time NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  CONSTRAINT valid_shift_times CHECK (start_time < end_time)
);

ALTER TABLE employees ENABLE ROW LEVEL SECURITY;
ALTER TABLE shifts ENABLE ROW LEVEL SECURITY;

-- Policies for employees table
CREATE POLICY "Users can view employees"
  ON employees
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Managers can manage employees"
  ON employees
  FOR ALL
  TO authenticated
  USING (true);

-- Policies for shifts table
CREATE POLICY "Users can view shifts"
  ON shifts
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Managers can manage shifts"
  ON shifts
  FOR ALL
  TO authenticated
  USING (true);

-- Triggers for updated_at
CREATE TRIGGER update_employees_updated_at
  BEFORE UPDATE
  ON employees
  FOR EACH ROW
  EXECUTE PROCEDURE update_updated_at_column();

CREATE TRIGGER update_shifts_updated_at
  BEFORE UPDATE
  ON shifts
  FOR EACH ROW
  EXECUTE PROCEDURE update_updated_at_column();