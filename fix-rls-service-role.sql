-- Fix RLS policies to allow service role access for admin operations
-- This script must be run in your Supabase SQL Editor

-- First, check current RLS policies
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual, with_check
FROM pg_policies 
WHERE schemaname = 'public' 
ORDER BY tablename, policyname;

-- Drop existing service role policies if they exist (to avoid conflicts)
DROP POLICY IF EXISTS "Service role can manage users" ON users;
DROP POLICY IF EXISTS "Service role can manage camps" ON camps;
DROP POLICY IF EXISTS "Service role can manage camp_players" ON camp_players;
DROP POLICY IF EXISTS "Service role can manage pre_camp_assessments" ON pre_camp_assessments;
DROP POLICY IF EXISTS "Service role can manage post_camp_reports" ON post_camp_reports;
DROP POLICY IF EXISTS "Service role can manage camp_schedules" ON camp_schedules;

-- Create service role policies that bypass RLS
CREATE POLICY "Service role can manage users"
  ON users FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Service role can manage camps"
  ON camps FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Service role can manage camp_players"
  ON camp_players FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Service role can manage pre_camp_assessments"
  ON pre_camp_assessments FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Service role can manage post_camp_reports"
  ON post_camp_reports FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Service role can manage camp_schedules"
  ON camp_schedules FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- Verify the policies were created
SELECT schemaname, tablename, policyname, permissive, roles, cmd
FROM pg_policies 
WHERE schemaname = 'public' 
AND policyname LIKE '%Service role%'
ORDER BY tablename, policyname;
