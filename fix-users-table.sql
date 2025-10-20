-- Fix users table to remove foreign key constraint to auth.users
-- This allows creating users without requiring Supabase Auth

-- Drop the foreign key constraint
ALTER TABLE users DROP CONSTRAINT IF EXISTS users_id_fkey;

-- Change the id column to use gen_random_uuid() as default instead of referencing auth.users
-- This allows the table to work independently of Supabase Auth
ALTER TABLE users ALTER COLUMN id SET DEFAULT gen_random_uuid();

-- Note: This removes the dependency on auth.users table
-- Users will be created with generated UUIDs instead of auth user IDs
