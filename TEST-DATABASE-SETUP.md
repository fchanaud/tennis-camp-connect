# Test Database Setup Guide

This guide will help you set up a separate test database in Supabase for testing purposes.

## Quick Start

If you've already created the test database (`tennis-camp-connect-test`):

1. **Create schema**: Run Step 3 SQL schema in test database SQL Editor
2. **Sync users**: Run `npm run sync-users` (requires both prod and test credentials in `.env.local`)
3. **Configure**: Add test credentials to `.env.local` or Vercel environment variables
4. **Test**: Set `NEXT_PUBLIC_ENV=test` and login with production users

---

## Detailed Steps

## Step 1: Create a New Supabase Project

1. Go to [Supabase Dashboard](https://app.supabase.com)
2. Click **"New Project"**
3. Fill in the project details:
   - **Name**: `tennis-camp-connect-test` (or any name you prefer)
   - **Database Password**: Choose a strong password (save it securely)
   - **Region**: Choose the same region as your production project (recommended)
4. Click **"Create new project"**
5. Wait for the project to be provisioned (takes 1-2 minutes)

## Step 2: Get Your Test Database Credentials

1. In your new test project, go to **Settings** → **API**
2. Copy the following values:
   - **Project URL** (e.g., `https://xxxxxxxxxxxxx.supabase.co`)
   - **anon/public key** (starts with `eyJ...`)
   - **service_role key** (starts with `eyJ...` - keep this secret!)

## Step 3: Create the Database Schema

1. In your test project, go to **SQL Editor**
2. Click **"New query"**
3. Copy and paste the following SQL schema:

```sql
-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  first_name VARCHAR(100) NOT NULL,
  last_name VARCHAR(100) NOT NULL,
  username VARCHAR(50) UNIQUE NOT NULL,
  role VARCHAR(20) NOT NULL CHECK (role IN ('player', 'coach', 'admin')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Camps table
CREATE TABLE camps (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  start_date DATE NOT NULL,
  end_date DATE NOT NULL CHECK (end_date >= start_date),
  package VARCHAR(50) NOT NULL CHECK (package IN ('tennis_only', 'stay_and_play', 'luxury_stay_and_play', 'no_tennis')),
  total_tennis_hours INTEGER CHECK (total_tennis_hours >= 0),
  accommodation_details TEXT,
  accommodation_name VARCHAR(200),
  accommodation_phone VARCHAR(50),
  accommodation_map_link TEXT,
  accommodation_photo_url TEXT,
  capacity INTEGER NOT NULL CHECK (capacity >= 1 AND capacity <= 4),
  coach_id UUID REFERENCES users(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Camp players junction table
CREATE TABLE camp_players (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  camp_id UUID NOT NULL REFERENCES camps(id) ON DELETE CASCADE,
  player_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(camp_id, player_id)
);

-- Pre-camp assessments table
CREATE TABLE pre_camp_assessments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  player_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  camp_id UUID NOT NULL REFERENCES camps(id) ON DELETE CASCADE,
  answers JSONB NOT NULL DEFAULT '{}',
  completed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(player_id, camp_id)
);

-- Post-camp reports table
CREATE TABLE post_camp_reports (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  player_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  camp_id UUID NOT NULL REFERENCES camps(id) ON DELETE CASCADE,
  coach_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  report_content TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(player_id, camp_id)
);

-- Camp schedules table
CREATE TABLE camp_schedules (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  camp_id UUID NOT NULL REFERENCES camps(id) ON DELETE CASCADE,
  schedule_date DATE NOT NULL,
  schedule_content TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(camp_id, schedule_date)
);

-- Create indexes for better performance
CREATE INDEX idx_camps_coach_id ON camps(coach_id);
CREATE INDEX idx_camps_dates ON camps(start_date, end_date);
CREATE INDEX idx_camp_players_camp_id ON camp_players(camp_id);
CREATE INDEX idx_camp_players_player_id ON camp_players(player_id);
CREATE INDEX idx_assessments_player_id ON pre_camp_assessments(player_id);
CREATE INDEX idx_assessments_camp_id ON pre_camp_assessments(camp_id);
CREATE INDEX idx_reports_player_id ON post_camp_reports(player_id);
CREATE INDEX idx_reports_camp_id ON post_camp_reports(camp_id);
CREATE INDEX idx_reports_coach_id ON post_camp_reports(coach_id);
CREATE INDEX idx_schedules_camp_id ON camp_schedules(camp_id);
CREATE INDEX idx_schedules_date ON camp_schedules(schedule_date);

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers for updated_at
CREATE TRIGGER update_pre_camp_assessments_updated_at
  BEFORE UPDATE ON pre_camp_assessments
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_post_camp_reports_updated_at
  BEFORE UPDATE ON post_camp_reports
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_camp_schedules_updated_at
  BEFORE UPDATE ON camp_schedules
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Row Level Security (RLS) Policies
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE camps ENABLE ROW LEVEL SECURITY;
ALTER TABLE camp_players ENABLE ROW LEVEL SECURITY;
ALTER TABLE pre_camp_assessments ENABLE ROW LEVEL SECURITY;
ALTER TABLE post_camp_reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE camp_schedules ENABLE ROW LEVEL SECURITY;

-- Policy: Allow all operations for service role (admin operations)
-- Note: The app uses service role key for all operations, so these policies
-- allow full access. Adjust based on your security requirements.

CREATE POLICY "Enable all operations for service role" ON users
  FOR ALL USING (true);

CREATE POLICY "Enable all operations for service role" ON camps
  FOR ALL USING (true);

CREATE POLICY "Enable all operations for service role" ON camp_players
  FOR ALL USING (true);

CREATE POLICY "Enable all operations for service role" ON pre_camp_assessments
  FOR ALL USING (true);

CREATE POLICY "Enable all operations for service role" ON post_camp_reports
  FOR ALL USING (true);

CREATE POLICY "Enable all operations for service role" ON camp_schedules
  FOR ALL USING (true);
```

4. Click **"Run"** to execute the schema
5. Verify success by checking the **Table Editor** - you should see all 6 tables created

**Important:** After creating the schema, disable RLS for easier testing:
- Run `scripts/disable-rls-test.sql` in your test database SQL Editor
- This allows all operations without RLS restrictions (recommended for test database)

## Step 4: Sync Users from Production to Test

To ensure your test database has exactly the same users as production, you have two options:

### Option A: Automated Sync Script (Recommended)

1. **Install dependencies** (if not already installed):
   ```bash
   npm install
   ```

2. **Set up environment variables** in your `.env.local`:
   ```env
   # Production credentials (required for sync)
   NEXT_PUBLIC_SUPABASE_URL=your_production_supabase_url
   SUPABASE_SERVICE_ROLE_KEY=your_production_service_role_key
   
   # Test credentials (required for sync)
   NEXT_PUBLIC_SUPABASE_URL_TEST=your_test_supabase_url
   SUPABASE_SERVICE_ROLE_KEY_TEST=your_test_service_role_key
   ```

3. **Run the sync script**:
   
   **To sync ALL data (users, camps, enrollments, schedules, assessments, reports):**
   ```bash
   npm run sync-all-data
   ```
   
   **To sync only users:**
   ```bash
   npm run sync-users
   ```

   The `sync-all-data` script will:
   - Fetch all data from production (users, camps, enrollments, schedules, assessments, reports)
   - Check which records already exist in test
   - Insert only new records into test database
   - Preserve all IDs, relationships, and data
   - Sync in the correct order (respecting foreign key dependencies)

### Option B: Manual SQL Export/Import

1. **Export users from production**:
   - Go to your **PRODUCTION** Supabase project
   - Open **SQL Editor**
   - Run the script: `scripts/export-users-from-prod.sql`
   - Copy all the INSERT statements from the output

2. **Import users to test**:
   - Go to your **TEST** Supabase project (`tennis-camp-connect-test`)
   - Open **SQL Editor**
   - Paste and run the INSERT statements from step 1

### Verify Schema Match First

Before syncing users, verify that both databases have identical schemas:

1. **In Production**: Run `scripts/verify-schema-match.sql` in SQL Editor
2. **In Test**: Run the same script and compare outputs
3. If schemas differ, update test database schema to match production (use Step 3 schema)

### Sync Users from Production

**Option 1: Automated Script (Recommended)**

```bash
# Make sure .env.local has both production and test credentials
npm run sync-users
```

**Option 2: Manual SQL Method**

1. Run `scripts/export-users-from-prod.sql` in production SQL Editor
2. Copy the INSERT statements output
3. Run those INSERT statements in test SQL Editor

## Step 6: Configure Environment Variables

### For Local Development (`.env.local`)

Add these test environment variables:

```env
# Production/Development credentials
NEXT_PUBLIC_SUPABASE_URL=your_production_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_production_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_production_service_role_key

# Test credentials
NEXT_PUBLIC_SUPABASE_URL_TEST=your_test_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY_TEST=your_test_anon_key
SUPABASE_SERVICE_ROLE_KEY_TEST=your_test_service_role_key

# To enable test mode locally, set this:
NEXT_PUBLIC_ENV=test
```

### For Vercel Preview/Test Deployments

1. Go to your Vercel project settings
2. Navigate to **Environment Variables**
3. Add the following variables for **Preview** environment:
   - `NEXT_PUBLIC_SUPABASE_URL_TEST`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY_TEST`
   - `SUPABASE_SERVICE_ROLE_KEY_TEST`

The app will automatically use test credentials when `VERCEL_ENV=preview` (which Vercel sets automatically for preview deployments).

## Step 7: Verify Test Database Connection

1. Set `NEXT_PUBLIC_ENV=test` in your `.env.local` (for local testing)
2. Start your development server: `npm run dev`
3. Try logging in with test users (e.g., `admin` with password `Gardelapeche78`)
4. Verify you can see test data from your test database

## Test Users Reference

Based on the login route logic:

- **Admin**: Username `admin`, Password `Gardelapeche78`
- **Coach Patrick**: Username `patrickn`, Password `marrakech`
- **Other users**: Any password with at least 3 characters works

## Tips

1. **Keep test data separate**: Don't use production data in your test database
2. **Reset easily**: You can delete and recreate the test project when needed
3. **Use seed scripts**: Create a SQL file with your test data for easy reset
4. **Environment detection**: The app automatically detects test environment via:
   - `VERCEL_ENV=preview` (Vercel preview deployments)
   - `NODE_ENV=test` (local test runs)
   - `NEXT_PUBLIC_ENV=test` (manually set)

## Troubleshooting

### Can't connect to test database
- Verify environment variables are set correctly
- Check that `NEXT_PUBLIC_ENV=test` is set (for local testing)
- Verify Supabase project is active and credentials are correct

### Login not working
- Ensure test users exist in the test database
- Check that RLS policies allow access
- Verify you're using the correct password format

### Data not showing
- Confirm you're connected to the test database (check environment variables)
- Verify data exists in the test database (check Table Editor)
- Check browser console for errors

