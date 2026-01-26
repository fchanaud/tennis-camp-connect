-- Migration script to add racket_rental to the registration_options CHECK constraint
-- Run this in your Supabase SQL Editor

-- Drop the existing CHECK constraint
ALTER TABLE registration_options 
  DROP CONSTRAINT IF EXISTS registration_options_option_type_check;

-- Add the new CHECK constraint that includes racket_rental
ALTER TABLE registration_options 
  ADD CONSTRAINT registration_options_option_type_check 
  CHECK (option_type IN ('hammam_massage', 'massage', 'hammam', 'medina_tour', 'friday_dinner', 'racket_rental'));
