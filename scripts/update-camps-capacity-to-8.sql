-- Migration: increase camp capacity from max 4 to max 8 players
-- Run in Supabase SQL Editor

-- Drop the existing check constraint (try common auto-generated names)
ALTER TABLE camps DROP CONSTRAINT IF EXISTS camps_capacity_check;

-- If capacity still can't be set above 4, find and drop the constraint manually:
--   SELECT conname, pg_get_constraintdef(oid) FROM pg_constraint
--   WHERE conrelid = 'public.camps'::regclass AND contype = 'c';
--   Then: ALTER TABLE camps DROP CONSTRAINT <conname>;

-- Add new check: capacity between 1 and 8
ALTER TABLE camps ADD CONSTRAINT camps_capacity_check CHECK (capacity >= 1 AND capacity <= 8);
