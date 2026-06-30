-- ============================================
-- Supabase SQL: Create entries table
-- Run this in your Supabase SQL Editor
-- ============================================

-- Create the entries table
CREATE TABLE IF NOT EXISTS entries (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  type TEXT NOT NULL CHECK (type IN ('income', 'expense')),
  description TEXT NOT NULL,
  amount NUMERIC(12, 2) NOT NULL CHECK (amount > 0),
  date DATE NOT NULL,
  category TEXT DEFAULT 'general',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security (RLS)
-- For a personal app, we allow all operations (no auth required)
ALTER TABLE entries ENABLE ROW LEVEL SECURITY;

-- Policy: Allow all operations for anonymous users (personal app)
CREATE POLICY "Allow all operations" ON entries
  FOR ALL
  USING (true)
  WITH CHECK (true);

-- Create an index on date for faster monthly queries
CREATE INDEX idx_entries_date ON entries (date DESC);

-- Create an index on type for filtering
CREATE INDEX idx_entries_type ON entries (type);
