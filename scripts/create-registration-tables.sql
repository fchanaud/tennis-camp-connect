-- Migration script to create registration and payment tables
-- Run this in your Supabase SQL Editor

-- Add max_players field to camps table (default to 7 for registration system)
ALTER TABLE camps 
  ADD COLUMN IF NOT EXISTS max_players INTEGER DEFAULT 7 CHECK (max_players >= 1);

-- Update existing camps to have max_players = 7 if not set
UPDATE camps SET max_players = 7 WHERE max_players IS NULL;

-- Registrations table
CREATE TABLE IF NOT EXISTS registrations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  camp_id UUID NOT NULL REFERENCES camps(id) ON DELETE CASCADE,
  name VARCHAR(200) NOT NULL,
  email VARCHAR(255) NOT NULL,
  whatsapp_number VARCHAR(50) NOT NULL,
  tennis_experience_years VARCHAR(20) NOT NULL CHECK (tennis_experience_years IN ('1-2 years', '3-5 years', '6-8 years', '>8 years')),
  play_frequency_per_month VARCHAR(20) NOT NULL CHECK (play_frequency_per_month IN ('1 time', '2-3 times', '3-4 times', '>4 times')),
  bedroom_type VARCHAR(20) NOT NULL CHECK (bedroom_type IN ('shared', 'private_double')),
  accepted_cancellation_policy BOOLEAN NOT NULL DEFAULT false,
  status VARCHAR(50) NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'awaiting_manual_verification', 'confirmed', 'cancelled')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Registration options table (for optional activities)
CREATE TABLE IF NOT EXISTS registration_options (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  registration_id UUID NOT NULL REFERENCES registrations(id) ON DELETE CASCADE,
  option_type VARCHAR(50) NOT NULL CHECK (option_type IN ('hammam_massage', 'massage', 'hammam', 'medina_tour', 'friday_dinner', 'racket_rental')),
  price_pounds DECIMAL(10, 2) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Payments table
CREATE TABLE IF NOT EXISTS payments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  registration_id UUID NOT NULL REFERENCES registrations(id) ON DELETE CASCADE,
  payment_method VARCHAR(20) NOT NULL CHECK (payment_method IN ('stripe', 'revolut')),
  payment_type VARCHAR(20) NOT NULL CHECK (payment_type IN ('deposit', 'full', 'balance')),
  amount_pounds DECIMAL(10, 2) NOT NULL,
  stripe_payment_intent_id VARCHAR(255),
  stripe_session_id VARCHAR(255),
  revolut_reference VARCHAR(255),
  status VARCHAR(50) NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'failed', 'refunded')),
  base_camp_price DECIMAL(10, 2) NOT NULL DEFAULT 600.00,
  bedroom_upgrade_price DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
  options_total_price DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_registrations_camp_id ON registrations(camp_id);
CREATE INDEX IF NOT EXISTS idx_registrations_email ON registrations(email);
CREATE INDEX IF NOT EXISTS idx_registrations_status ON registrations(status);
CREATE INDEX IF NOT EXISTS idx_registration_options_registration_id ON registration_options(registration_id);
CREATE INDEX IF NOT EXISTS idx_payments_registration_id ON payments(registration_id);
CREATE INDEX IF NOT EXISTS idx_payments_status ON payments(status);
CREATE INDEX IF NOT EXISTS idx_payments_stripe_payment_intent_id ON payments(stripe_payment_intent_id);

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_registration_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers for updated_at
CREATE TRIGGER update_registrations_updated_at
  BEFORE UPDATE ON registrations
  FOR EACH ROW
  EXECUTE FUNCTION update_registration_updated_at();

CREATE TRIGGER update_payments_updated_at
  BEFORE UPDATE ON payments
  FOR EACH ROW
  EXECUTE FUNCTION update_registration_updated_at();

-- Row Level Security (RLS) Policies
ALTER TABLE registrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE registration_options ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;

-- Policy: Allow all operations for service role (admin operations)
CREATE POLICY "Enable all operations for service role" ON registrations
  FOR ALL USING (true);

CREATE POLICY "Enable all operations for service role" ON registration_options
  FOR ALL USING (true);

CREATE POLICY "Enable all operations for service role" ON payments
  FOR ALL USING (true);
