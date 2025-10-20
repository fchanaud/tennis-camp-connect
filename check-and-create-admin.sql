-- Check for admin users and create one if needed
-- First, check if admin user exists
SELECT 
  id, 
  first_name, 
  last_name, 
  username, 
  role, 
  created_at 
FROM users 
WHERE role = 'admin'
ORDER BY created_at DESC;

-- If no admin user exists, create one
-- Uncomment the following lines if you need to create an admin user:

-- INSERT INTO users (id, first_name, last_name, username, role)
-- VALUES (
--   gen_random_uuid(),
--   'System',
--   'Administrator', 
--   'admin',
--   'admin'
-- );
