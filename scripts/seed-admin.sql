-- Inserts the default admin user if it doesn't exist.
-- Run in Supabase SQL Editor (or psql) against your test DB.
-- Login: username = admin, password = Gardelapeche78

INSERT INTO users (first_name, last_name, username, role)
VALUES ('Admin', 'User', 'admin', 'admin')
ON CONFLICT (username) DO NOTHING;
