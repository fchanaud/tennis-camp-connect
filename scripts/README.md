# Database Sync Scripts

Scripts for syncing data between production and test databases.

## Available Scripts

### `sync-all-data-to-test.ts` ⭐ **RECOMMENDED**

Comprehensive script to copy **all data** from production to test database:
- Users
- Camps
- Camp Players (enrollments)
- Camp Schedules
- Pre-camp Assessments
- Post-camp Reports

**Usage:**
```bash
npm run sync-all-data
```

**What it does:**
- Syncs all tables in the correct order (respecting foreign key dependencies)
- Preserves all IDs, relationships, and data
- Skips records that already exist
- Provides detailed summary of what was synced

### `sync-users-to-test.ts`

Automated script to copy only users from production to test database.

**Usage:**
```bash
npm run sync-users
```

**Requirements:**
- `.env.local` must contain:
  - `NEXT_PUBLIC_SUPABASE_URL` (production)
  - `SUPABASE_SERVICE_ROLE_KEY` (production)
  - `NEXT_PUBLIC_SUPABASE_URL_TEST` (test)
  - `SUPABASE_SERVICE_ROLE_KEY_TEST` (test)

**What it does:**
- Fetches all users from production database
- Checks which users already exist in test (by username)
- Inserts only new users into test database
- Preserves user IDs, timestamps, and all user data
- Reports summary of sync operation

### `export-users-from-prod.sql`

SQL script to generate INSERT statements for all production users.

**Usage:**
1. Run in **PRODUCTION** Supabase SQL Editor
2. Copy the INSERT statements from output
3. Run INSERT statements in **TEST** Supabase SQL Editor

**Use case:** When you can't use the automated script (e.g., no local access to credentials)

### `verify-schema-match.sql`

SQL script to compare database schemas between production and test.

**Usage:**
1. Run in **PRODUCTION** Supabase SQL Editor
2. Save the output
3. Run in **TEST** Supabase SQL Editor
4. Compare outputs to ensure schemas match

**What it checks:**
- Table structures (columns, data types, constraints)
- Indexes
- Triggers
- Constraints (primary keys, foreign keys, checks)

## Troubleshooting

### Sync script fails to connect
- Verify all environment variables are set correctly
- Check that Supabase projects are active
- Ensure service role keys have proper permissions

### Users not syncing
- Check if users already exist (script skips existing usernames)
- Verify RLS policies allow service role to read/write
- Check console output for specific error messages

### Schema mismatch
- Run `verify-schema-match.sql` in both databases
- Update test database schema to match production
- Re-run sync after schema is fixed

