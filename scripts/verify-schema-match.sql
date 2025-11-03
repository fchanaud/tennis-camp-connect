-- Verify Schema Match Between Production and Test
-- Run this in both PRODUCTION and TEST databases to compare schemas
-- Run first in production, then in test, and compare the outputs

-- Check table structures
SELECT 
    table_name,
    column_name,
    data_type,
    character_maximum_length,
    is_nullable,
    column_default
FROM information_schema.columns
WHERE table_schema = 'public'
  AND table_name IN ('users', 'camps', 'camp_players', 'pre_camp_assessments', 'post_camp_reports', 'camp_schedules')
ORDER BY table_name, ordinal_position;

-- Check constraints
SELECT 
    tc.table_name,
    tc.constraint_name,
    tc.constraint_type,
    kcu.column_name
FROM information_schema.table_constraints tc
JOIN information_schema.key_column_usage kcu 
    ON tc.constraint_name = kcu.constraint_name
WHERE tc.table_schema = 'public'
  AND tc.table_name IN ('users', 'camps', 'camp_players', 'pre_camp_assessments', 'post_camp_reports', 'camp_schedules')
ORDER BY tc.table_name, tc.constraint_type;

-- Check indexes
SELECT 
    tablename,
    indexname,
    indexdef
FROM pg_indexes
WHERE schemaname = 'public'
  AND tablename IN ('users', 'camps', 'camp_players', 'pre_camp_assessments', 'post_camp_reports', 'camp_schedules')
ORDER BY tablename, indexname;

-- Check triggers
SELECT 
    trigger_name,
    event_object_table,
    action_statement,
    action_timing,
    event_manipulation
FROM information_schema.triggers
WHERE trigger_schema = 'public'
ORDER BY event_object_table, trigger_name;

