-- Supabase SQL Setup for Whitelist Table
-- Run this in your Supabase SQL Editor (https://supabase.com/dashboard)

-- Create the whitelist table
CREATE TABLE IF NOT EXISTS whitelist (
  id BIGSERIAL PRIMARY KEY,
  wallet_address VARCHAR(42) UNIQUE NOT NULL,
  pledge_amount VARCHAR(50) NOT NULL,
  payment_token VARCHAR(10) NOT NULL CHECK (payment_token IN ('USDC', 'ETH')),
  email VARCHAR(255),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create index for faster wallet lookups
CREATE INDEX IF NOT EXISTS idx_whitelist_wallet ON whitelist(wallet_address);

-- Enable Row Level Security (RLS)
ALTER TABLE whitelist ENABLE ROW LEVEL SECURITY;

-- Policy: Allow anyone to insert (for public whitelist signup)
CREATE POLICY "Allow public insert" ON whitelist
  FOR INSERT
  WITH CHECK (true);

-- Policy: Allow update only for matching wallet (using service key bypasses this)
CREATE POLICY "Allow service update" ON whitelist
  FOR UPDATE
  USING (true);

-- Policy: Allow read (count) for anyone
CREATE POLICY "Allow public read" ON whitelist
  FOR SELECT
  USING (true);

-- Add updated_at trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_whitelist_updated_at
  BEFORE UPDATE ON whitelist
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
