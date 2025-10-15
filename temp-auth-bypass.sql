-- Temporary Authentication Bypass
-- This allows testing without Supabase auth setup

-- Temporarily disable RLS on users table for testing
ALTER TABLE users DISABLE ROW LEVEL SECURITY;

-- Create test users
INSERT INTO users (
  id,
  first_name,
  last_name,
  username,
  role,
  created_at
) VALUES 
  ('11111111-1111-1111-1111-111111111111', 'System', 'Administrator', 'admin', 'admin', NOW()),
  ('22222222-2222-2222-2222-222222222222', 'Rafael', 'Nadal', 'coach', 'coach', NOW()),
  ('33333333-3333-3333-3333-333333333333', 'John', 'Doe', 'jdoe', 'player', NOW())
ON CONFLICT (id) DO NOTHING;

-- Verify users were created
SELECT username, first_name, last_name, role FROM users;

-- Note: Remember to re-enable RLS later:
-- ALTER TABLE users ENABLE ROW LEVEL SECURITY;
