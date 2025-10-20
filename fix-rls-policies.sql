-- Fix RLS policies to allow service role access for admin operations
-- This allows the service role client to bypass RLS when creating camps and users

-- Allow service role to bypass RLS on users table
CREATE POLICY "Service role can manage users"
  ON users FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- Allow service role to bypass RLS on camps table  
CREATE POLICY "Service role can manage camps"
  ON camps FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- Allow service role to bypass RLS on camp_players table
CREATE POLICY "Service role can manage camp_players"
  ON camp_players FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- Allow service role to bypass RLS on pre_camp_assessments table
CREATE POLICY "Service role can manage pre_camp_assessments"
  ON pre_camp_assessments FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- Allow service role to bypass RLS on post_camp_reports table
CREATE POLICY "Service role can manage post_camp_reports"
  ON post_camp_reports FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- Allow service role to bypass RLS on camp_schedules table
CREATE POLICY "Service role can manage camp_schedules"
  ON camp_schedules FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);
