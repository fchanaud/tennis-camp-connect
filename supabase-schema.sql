-- Tennis Camp Connect Database Schema

-- Create enums
CREATE TYPE user_role AS ENUM ('player', 'coach', 'admin');
CREATE TYPE package_type AS ENUM ('tennis_only', 'stay_and_play', 'luxury_stay_and_play', 'no_tennis');

-- Users table (extends auth.users)
CREATE TABLE users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  username TEXT UNIQUE NOT NULL,
  role user_role NOT NULL DEFAULT 'player',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Camps table
CREATE TABLE camps (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  package package_type NOT NULL,
  total_tennis_hours INTEGER CHECK (total_tennis_hours >= 0 AND total_tennis_hours <= 20),
  accommodation_details TEXT,
  capacity INTEGER NOT NULL CHECK (capacity >= 1 AND capacity <= 4),
  coach_id UUID REFERENCES users(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  CONSTRAINT end_after_start CHECK (end_date > start_date)
);

-- Camp players junction table
CREATE TABLE camp_players (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  camp_id UUID NOT NULL REFERENCES camps(id) ON DELETE CASCADE,
  player_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(camp_id, player_id)
);

-- Pre-camp assessments
CREATE TABLE pre_camp_assessments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  player_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  camp_id UUID NOT NULL REFERENCES camps(id) ON DELETE CASCADE,
  answers JSONB NOT NULL DEFAULT '{}',
  completed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(player_id, camp_id)
);

-- Post-camp reports
CREATE TABLE post_camp_reports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  player_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  camp_id UUID NOT NULL REFERENCES camps(id) ON DELETE CASCADE,
  coach_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  report_content TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(player_id, camp_id)
);

-- Camp schedules
CREATE TABLE camp_schedules (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  camp_id UUID NOT NULL REFERENCES camps(id) ON DELETE CASCADE,
  schedule_date DATE NOT NULL,
  schedule_content TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(camp_id, schedule_date)
);

-- Enable Row Level Security
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE camps ENABLE ROW LEVEL SECURITY;
ALTER TABLE camp_players ENABLE ROW LEVEL SECURITY;
ALTER TABLE pre_camp_assessments ENABLE ROW LEVEL SECURITY;
ALTER TABLE post_camp_reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE camp_schedules ENABLE ROW LEVEL SECURITY;

-- RLS Policies for users table
CREATE POLICY "Users can view their own data"
  ON users FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Coaches can view all users"
  ON users FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid() AND users.role = 'coach'
    )
  );

CREATE POLICY "Admins have full access to users"
  ON users FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid() AND users.role = 'admin'
    )
  );

-- RLS Policies for camps table
CREATE POLICY "Players can view their enrolled camps"
  ON camps FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM camp_players
      WHERE camp_players.camp_id = camps.id
      AND camp_players.player_id = auth.uid()
    )
  );

CREATE POLICY "Coaches can view all camps"
  ON camps FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid() AND users.role = 'coach'
    )
  );

CREATE POLICY "Admins have full access to camps"
  ON camps FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid() AND users.role = 'admin'
    )
  );

-- RLS Policies for camp_players table
CREATE POLICY "Players can view their enrollments"
  ON camp_players FOR SELECT
  USING (player_id = auth.uid());

CREATE POLICY "Coaches can view all enrollments"
  ON camp_players FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid() AND users.role = 'coach'
    )
  );

CREATE POLICY "Admins have full access to camp_players"
  ON camp_players FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid() AND users.role = 'admin'
    )
  );

-- RLS Policies for pre_camp_assessments table
CREATE POLICY "Players can view and manage their own assessments"
  ON pre_camp_assessments FOR ALL
  USING (player_id = auth.uid());

CREATE POLICY "Coaches can view all assessments"
  ON pre_camp_assessments FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid() AND users.role = 'coach'
    )
  );

CREATE POLICY "Admins can view all assessments"
  ON pre_camp_assessments FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid() AND users.role = 'admin'
    )
  );

-- RLS Policies for post_camp_reports table
CREATE POLICY "Players can view their own reports"
  ON post_camp_reports FOR SELECT
  USING (player_id = auth.uid());

CREATE POLICY "Coaches can manage all reports"
  ON post_camp_reports FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid() AND users.role = 'coach'
    )
  );

CREATE POLICY "Admins can view all reports"
  ON post_camp_reports FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid() AND users.role = 'admin'
    )
  );

-- RLS Policies for camp_schedules table
CREATE POLICY "Players can view schedules for their camps"
  ON camp_schedules FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM camp_players
      WHERE camp_players.camp_id = camp_schedules.camp_id
      AND camp_players.player_id = auth.uid()
    )
  );

CREATE POLICY "Coaches can view all schedules"
  ON camp_schedules FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid() AND users.role = 'coach'
    )
  );

CREATE POLICY "Admins have full access to schedules"
  ON camp_schedules FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid() AND users.role = 'admin'
    )
  );

-- Create indexes for better performance
CREATE INDEX idx_users_username ON users(username);
CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_camps_coach_id ON camps(coach_id);
CREATE INDEX idx_camps_dates ON camps(start_date, end_date);
CREATE INDEX idx_camp_players_camp_id ON camp_players(camp_id);
CREATE INDEX idx_camp_players_player_id ON camp_players(player_id);
CREATE INDEX idx_pre_camp_assessments_player_id ON pre_camp_assessments(player_id);
CREATE INDEX idx_pre_camp_assessments_camp_id ON pre_camp_assessments(camp_id);
CREATE INDEX idx_post_camp_reports_player_id ON post_camp_reports(player_id);
CREATE INDEX idx_post_camp_reports_camp_id ON post_camp_reports(camp_id);
CREATE INDEX idx_camp_schedules_camp_id ON camp_schedules(camp_id);
CREATE INDEX idx_camp_schedules_date ON camp_schedules(schedule_date);

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

