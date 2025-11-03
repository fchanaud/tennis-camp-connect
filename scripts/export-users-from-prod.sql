-- Export Users from Production Database
-- Run this in your PRODUCTION Supabase project SQL Editor
-- This will generate INSERT statements for all users

-- Copy the output and use it in the import script

SELECT 
  'INSERT INTO users (id, first_name, last_name, username, role, created_at) VALUES (' ||
  quote_literal(id::text) || ', ' ||
  quote_literal(first_name) || ', ' ||
  quote_literal(last_name) || ', ' ||
  quote_literal(username) || ', ' ||
  quote_literal(role) || ', ' ||
  quote_literal(created_at::text) || ');' AS insert_statement
FROM users
ORDER BY created_at;

