-- Simple Seed Data for Tennis Camp Connect (Fixed Version)
-- This creates initial users without complex auth setup

-- First, let's create the users directly in the users table
-- We'll use simple UUIDs for the auth system

-- Create Admin User
INSERT INTO users (
  id,
  first_name,
  last_name,
  username,
  role,
  created_at
) VALUES (
  '00000000-0000-0000-0000-000000000001',
  'System',
  'Administrator',
  'admin',
  'admin',
  NOW()
) ON CONFLICT (id) DO NOTHING;

-- Create Coach User
INSERT INTO users (
  id,
  first_name,
  last_name,
  username,
  role,
  created_at
) VALUES (
  '00000000-0000-0000-0000-000000000002',
  'Rafael',
  'Nadal',
  'coach',
  'coach',
  NOW()
) ON CONFLICT (id) DO NOTHING;

-- Create Test Player User
INSERT INTO users (
  id,
  first_name,
  last_name,
  username,
  role,
  created_at
) VALUES (
  '00000000-0000-0000-0000-000000000003',
  'John',
  'Doe',
  'jdoe',
  'player',
  NOW()
) ON CONFLICT (id) DO NOTHING;

-- Verification Query
SELECT 
  username,
  first_name,
  last_name,
  role,
  created_at
FROM users
ORDER BY created_at;

-- Note: For now, we'll use a simple authentication system
-- The actual Supabase auth users will be created through the admin interface
-- These are just the user profiles that the application will use
