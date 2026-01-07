-- Feedbacks table for player feedback on tennis camps
CREATE TABLE IF NOT EXISTS feedbacks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  player_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  camp_id UUID NOT NULL REFERENCES camps(id) ON DELETE CASCADE,
  overall_trip_text TEXT NOT NULL,
  tennis_rating INTEGER NOT NULL CHECK (tennis_rating >= 1 AND tennis_rating <= 5),
  excursions_text TEXT,
  app_experience_text TEXT NOT NULL,
  photo_urls TEXT[] DEFAULT ARRAY[]::TEXT[],
  consent_given BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(player_id, camp_id)
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_feedbacks_player_id ON feedbacks(player_id);
CREATE INDEX IF NOT EXISTS idx_feedbacks_camp_id ON feedbacks(camp_id);
CREATE INDEX IF NOT EXISTS idx_feedbacks_created_at ON feedbacks(created_at DESC);

-- Trigger for updated_at timestamp
CREATE TRIGGER update_feedbacks_updated_at
  BEFORE UPDATE ON feedbacks
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Row Level Security (RLS) - can be disabled for testing
-- ALTER TABLE feedbacks ENABLE ROW LEVEL SECURITY;

-- Policy: Players can only see and manage their own feedbacks
-- CREATE POLICY "Players can manage own feedbacks" ON feedbacks
--   FOR ALL
--   USING (player_id = auth.uid()::text::uuid)
--   WITH CHECK (player_id = auth.uid()::text::uuid);

-- Policy: Admins can see all feedbacks
-- CREATE POLICY "Admins can view all feedbacks" ON feedbacks
--   FOR SELECT
--   USING (
--     EXISTS (
--       SELECT 1 FROM users 
--       WHERE users.id::text = auth.uid()::text 
--       AND users.role = 'admin'
--     )
--   );

