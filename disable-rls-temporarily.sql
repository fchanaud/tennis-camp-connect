-- Alternative approach: Temporarily disable RLS for admin operations
-- WARNING: This reduces security but allows admin operations to work
-- Use this only if the service role policies don't work

-- Check current RLS status
SELECT schemaname, tablename, rowsecurity 
FROM pg_tables 
WHERE schemaname = 'public' 
AND tablename IN ('users', 'camps', 'camp_players', 'pre_camp_assessments', 'post_camp_reports', 'camp_schedules');

-- Temporarily disable RLS (uncomment if needed)
-- ALTER TABLE users DISABLE ROW LEVEL SECURITY;
-- ALTER TABLE camps DISABLE ROW LEVEL SECURITY;
-- ALTER TABLE camp_players DISABLE ROW LEVEL SECURITY;
-- ALTER TABLE pre_camp_assessments DISABLE ROW LEVEL SECURITY;
-- ALTER TABLE post_camp_reports DISABLE ROW LEVEL SECURITY;
-- ALTER TABLE camp_schedules DISABLE ROW LEVEL SECURITY;

-- To re-enable RLS later (uncomment when needed):
-- ALTER TABLE users ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE camps ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE camp_players ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE pre_camp_assessments ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE post_camp_reports ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE camp_schedules ENABLE ROW LEVEL SECURITY;
