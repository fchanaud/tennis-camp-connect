-- Seed Data for Tennis Camp Connect
-- This file creates initial admin and coach users

-- IMPORTANT: These are example passwords. In production, you should:
-- 1. Run this SQL to create the auth users
-- 2. Then use the admin interface to create actual users with auto-generated passwords

-- Note: Supabase auth requires email format, we use username@tenniscamp.local pattern

-- Create Admin User
-- Username: admin
-- Password: admin7k4m1 (example - should be changed)

DO $$
DECLARE
  admin_user_id UUID;
BEGIN
  -- Create auth user for admin
  INSERT INTO auth.users (
    instance_id,
    id,
    aud,
    role,
    email,
    encrypted_password,
    email_confirmed_at,
    created_at,
    updated_at,
    confirmation_token,
    recovery_token
  ) VALUES (
    '00000000-0000-0000-0000-000000000000',
    gen_random_uuid(),
    'authenticated',
    'authenticated',
    'admin@tenniscamp.local',
    crypt('admin7k4m1', gen_salt('bf')),
    NOW(),
    NOW(),
    NOW(),
    '',
    ''
  )
  RETURNING id INTO admin_user_id;

  -- Create user profile for admin
  INSERT INTO public.users (
    id,
    first_name,
    last_name,
    username,
    role,
    created_at
  ) VALUES (
    admin_user_id,
    'System',
    'Administrator',
    'admin',
    'admin',
    NOW()
  );
END $$;

-- Create Coach User
-- Username: coach
-- Password: coach3x9p2 (example - should be changed)

DO $$
DECLARE
  coach_user_id UUID;
BEGIN
  -- Create auth user for coach
  INSERT INTO auth.users (
    instance_id,
    id,
    aud,
    role,
    email,
    encrypted_password,
    email_confirmed_at,
    created_at,
    updated_at,
    confirmation_token,
    recovery_token
  ) VALUES (
    '00000000-0000-0000-0000-000000000000',
    gen_random_uuid(),
    'authenticated',
    'authenticated',
    'coach@tenniscamp.local',
    crypt('coach3x9p2', gen_salt('bf')),
    NOW(),
    NOW(),
    NOW(),
    '',
    ''
  )
  RETURNING id INTO coach_user_id;

  -- Create user profile for coach
  INSERT INTO public.users (
    id,
    first_name,
    last_name,
    username,
    role,
    created_at
  ) VALUES (
    coach_user_id,
    'Rafael',
    'Nadal',
    'coach',
    'coach',
    NOW()
  );
END $$;

-- Create a sample player (optional - for testing)
-- Username: jdoe
-- Password: jdoe5m1n9 (example)

DO $$
DECLARE
  player_user_id UUID;
BEGIN
  -- Create auth user for player
  INSERT INTO auth.users (
    instance_id,
    id,
    aud,
    role,
    email,
    encrypted_password,
    email_confirmed_at,
    created_at,
    updated_at,
    confirmation_token,
    recovery_token
  ) VALUES (
    '00000000-0000-0000-0000-000000000000',
    gen_random_uuid(),
    'authenticated',
    'authenticated',
    'jdoe@tenniscamp.local',
    crypt('jdoe5m1n9', gen_salt('bf')),
    NOW(),
    NOW(),
    NOW(),
    '',
    ''
  )
  RETURNING id INTO player_user_id;

  -- Create user profile for player
  INSERT INTO public.users (
    id,
    first_name,
    last_name,
    username,
    role,
    created_at
  ) VALUES (
    player_user_id,
    'John',
    'Doe',
    'jdoe',
    'player',
    NOW()
  );
END $$;

-- Verification Query (run this to check users were created)
SELECT 
  u.username,
  u.first_name,
  u.last_name,
  u.role,
  u.created_at
FROM users u
ORDER BY u.created_at;

-- IMPORTANT NOTES:
-- 1. After running this seed data, you can log in with:
--    - Admin: username "admin", password "admin7k4m1"
--    - Coach: username "coach", password "coach3x9p2"
--    - Player: username "jdoe", password "jdoe5m1n9"
--
-- 2. These passwords are examples and should be changed in production
--
-- 3. Use the admin interface to create new users with auto-generated secure passwords
--
-- 4. The auth.users table might have different fields depending on your Supabase version
--    If this script fails, create users through Supabase Dashboard Auth section instead

