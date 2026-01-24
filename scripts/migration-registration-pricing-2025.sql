-- Migration: Registration pricing and defaults (2025)
-- Run this in Supabase SQL Editor if you already have the registration tables
-- and had base_camp_price DEFAULT 690.00 (or want to align defaults with app: £600 shared, £690 private).
--
-- The app always sends base_camp_price on payment insert, so this only updates
-- the column DEFAULT for consistency. Safe to run; idempotent.
--
-- No schema change is needed for:
--   - PATCH / update registration (registrations.updated_at and all columns already exist)
--   - "Back to registration" and pre-fill (app-only)

-- Align payments.base_camp_price default with app (£600 for shared bedroom)
ALTER TABLE payments
  ALTER COLUMN base_camp_price SET DEFAULT 600.00;
