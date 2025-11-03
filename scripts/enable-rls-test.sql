-- Re-enable Row Level Security (RLS) for Test Database
-- Run this if you want to re-enable RLS later

ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE camps ENABLE ROW LEVEL SECURITY;
ALTER TABLE camp_players ENABLE ROW LEVEL SECURITY;
ALTER TABLE pre_camp_assessments ENABLE ROW LEVEL SECURITY;
ALTER TABLE post_camp_reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE camp_schedules ENABLE ROW LEVEL SECURITY;

-- Add permissive policies that allow all operations
-- (These are needed when RLS is enabled)

DROP POLICY IF EXISTS "Enable all operations for service role" ON users;
DROP POLICY IF EXISTS "Enable all operations for service role" ON camps;
DROP POLICY IF EXISTS "Enable all operations for service role" ON camp_players;
DROP POLICY IF EXISTS "Enable all operations for service role" ON pre_camp_assessments;
DROP POLICY IF EXISTS "Enable all operations for service role" ON post_camp_reports;
DROP POLICY IF EXISTS "Enable all operations for service role" ON camp_schedules;

CREATE POLICY "Enable all operations for service role" ON users
  FOR ALL USING (true) WITH CHECK (true);

CREATE POLICY "Enable all operations for service role" ON camps
  FOR ALL USING (true) WITH CHECK (true);

CREATE POLICY "Enable all operations for service role" ON camp_players
  FOR ALL USING (true) WITH CHECK (true);

CREATE POLICY "Enable all operations for service role" ON pre_camp_assessments
  FOR ALL USING (true) WITH CHECK (true);

CREATE POLICY "Enable all operations for service role" ON post_camp_reports
  FOR ALL USING (true) WITH CHECK (true);

CREATE POLICY "Enable all operations for service role" ON camp_schedules
  FOR ALL USING (true) WITH CHECK (true);

