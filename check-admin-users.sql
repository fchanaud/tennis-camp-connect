-- Check for admin users in the database
SELECT id, first_name, last_name, username, role, created_at 
FROM users 
WHERE role = 'admin'
ORDER BY created_at DESC;
