-- Migration script to update feedbacks table structure
-- Run this in your Supabase SQL Editor

-- Add new columns for accommodation, tennis, and excursions ratings and texts
ALTER TABLE feedbacks 
  ADD COLUMN IF NOT EXISTS accommodation_rating INTEGER CHECK (accommodation_rating IS NULL OR (accommodation_rating >= 1 AND accommodation_rating <= 5)),
  ADD COLUMN IF NOT EXISTS accommodation_text TEXT,
  ADD COLUMN IF NOT EXISTS tennis_text TEXT,
  ADD COLUMN IF NOT EXISTS excursions_rating INTEGER CHECK (excursions_rating IS NULL OR (excursions_rating >= 1 AND excursions_rating <= 5)),
  ADD COLUMN IF NOT EXISTS overall_text TEXT;

-- Migrate existing data: move overall_trip_text to overall_text
UPDATE feedbacks 
SET overall_text = overall_trip_text 
WHERE overall_text IS NULL AND overall_trip_text IS NOT NULL;

-- Note: We keep the old columns (overall_trip_text, app_experience_text) for backward compatibility
-- You can drop them later after verifying everything works:
-- ALTER TABLE feedbacks DROP COLUMN IF EXISTS overall_trip_text;
-- ALTER TABLE feedbacks DROP COLUMN IF EXISTS app_experience_text;

