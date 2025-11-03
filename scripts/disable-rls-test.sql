-- Disable Row Level Security (RLS) for Test Database
-- Run this in your TEST Supabase project SQL Editor
-- This allows all operations without RLS restrictions

ALTER TABLE users DISABLE ROW LEVEL SECURITY;
ALTER TABLE camps DISABLE ROW LEVEL SECURITY;
ALTER TABLE camp_players DISABLE ROW LEVEL SECURITY;
ALTER TABLE pre_camp_assessments DISABLE ROW LEVEL SECURITY;
ALTER TABLE post_camp_reports DISABLE ROW LEVEL SECURITY;
ALTER TABLE camp_schedules DISABLE ROW LEVEL SECURITY;

-- Verify RLS is disabled
SELECT 
    schemaname,
    tablename,
    rowsecurity
FROM pg_tables
WHERE schemaname = 'public'
  AND tablename IN ('users', 'camps', 'camp_players', 'pre_camp_assessments', 'post_camp_reports', 'camp_schedules')
ORDER BY tablename;

-- If rowsecurity is false, RLS is disabled ✓

