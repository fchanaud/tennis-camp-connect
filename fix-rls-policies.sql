-- Fix RLS Policies for Tennis Camp Connect
-- This fixes the infinite recursion issue

-- Drop existing policies first
DROP POLICY IF EXISTS "Users can view their own data" ON users;
DROP POLICY IF EXISTS "Coaches can view all users" ON users;
DROP POLICY IF EXISTS "Admins have full access to users" ON users;

-- Create simpler, working policies
CREATE POLICY "Users can view their own data"
  ON users FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Coaches can view all users"
  ON users FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM users u
      WHERE u.id = auth.uid() AND u.role = 'coach'
    )
  );

CREATE POLICY "Admins have full access to users"
  ON users FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM users u
      WHERE u.id = auth.uid() AND u.role = 'admin'
    )
  );

-- Also fix other table policies to prevent recursion
DROP POLICY IF EXISTS "Players can view their enrolled camps" ON camps;
DROP POLICY IF EXISTS "Coaches can view all camps" ON camps;
DROP POLICY IF EXISTS "Admins have full access to camps" ON camps;

CREATE POLICY "Players can view their enrolled camps"
  ON camps FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM camp_players cp
      WHERE cp.camp_id = camps.id
      AND cp.player_id = auth.uid()
    )
  );

CREATE POLICY "Coaches can view all camps"
  ON camps FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM users u
      WHERE u.id = auth.uid() AND u.role = 'coach'
    )
  );

CREATE POLICY "Admins have full access to camps"
  ON camps FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM users u
      WHERE u.id = auth.uid() AND u.role = 'admin'
    )
  );

-- Fix camp_players policies
DROP POLICY IF EXISTS "Players can view their enrollments" ON camp_players;
DROP POLICY IF EXISTS "Coaches can view all enrollments" ON camp_players;
DROP POLICY IF EXISTS "Admins have full access to camp_players" ON camp_players;

CREATE POLICY "Players can view their enrollments"
  ON camp_players FOR SELECT
  USING (player_id = auth.uid());

CREATE POLICY "Coaches can view all enrollments"
  ON camp_players FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM users u
      WHERE u.id = auth.uid() AND u.role = 'coach'
    )
  );

CREATE POLICY "Admins have full access to camp_players"
  ON camp_players FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM users u
      WHERE u.id = auth.uid() AND u.role = 'admin'
    )
  );

-- Fix assessments policies
DROP POLICY IF EXISTS "Players can view and manage their own assessments" ON pre_camp_assessments;
DROP POLICY IF EXISTS "Coaches can view all assessments" ON pre_camp_assessments;
DROP POLICY IF EXISTS "Admins can view all assessments" ON pre_camp_assessments;

CREATE POLICY "Players can view and manage their own assessments"
  ON pre_camp_assessments FOR ALL
  USING (player_id = auth.uid());

CREATE POLICY "Coaches can view all assessments"
  ON pre_camp_assessments FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM users u
      WHERE u.id = auth.uid() AND u.role = 'coach'
    )
  );

CREATE POLICY "Admins can view all assessments"
  ON pre_camp_assessments FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM users u
      WHERE u.id = auth.uid() AND u.role = 'admin'
    )
  );

-- Fix reports policies
DROP POLICY IF EXISTS "Players can view their own reports" ON post_camp_reports;
DROP POLICY IF EXISTS "Coaches can manage all reports" ON post_camp_reports;
DROP POLICY IF EXISTS "Admins can view all reports" ON post_camp_reports;

CREATE POLICY "Players can view their own reports"
  ON post_camp_reports FOR SELECT
  USING (player_id = auth.uid());

CREATE POLICY "Coaches can manage all reports"
  ON post_camp_reports FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM users u
      WHERE u.id = auth.uid() AND u.role = 'coach'
    )
  );

CREATE POLICY "Admins can view all reports"
  ON post_camp_reports FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM users u
      WHERE u.id = auth.uid() AND u.role = 'admin'
    )
  );

-- Fix schedules policies
DROP POLICY IF EXISTS "Players can view schedules for their camps" ON camp_schedules;
DROP POLICY IF EXISTS "Coaches can view all schedules" ON camp_schedules;
DROP POLICY IF EXISTS "Admins have full access to schedules" ON camp_schedules;

CREATE POLICY "Players can view schedules for their camps"
  ON camp_schedules FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM camp_players cp
      WHERE cp.camp_id = camp_schedules.camp_id
      AND cp.player_id = auth.uid()
    )
  );

CREATE POLICY "Coaches can view all schedules"
  ON camp_schedules FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM users u
      WHERE u.id = auth.uid() AND u.role = 'coach'
    )
  );

CREATE POLICY "Admins have full access to schedules"
  ON camp_schedules FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM users u
      WHERE u.id = auth.uid() AND u.role = 'admin'
    )
  );
