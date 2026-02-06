-- =====================================================
-- TakuRating Database Schema
-- Migration: 001_initial_schema
-- Description: Initial database setup for Table Tennis Rating System
-- =====================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =====================================================
-- 1. PROFILES TABLE
-- =====================================================
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  role TEXT NOT NULL CHECK (role IN ('player', 'admin')),
  display_name TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Index for role-based queries
CREATE INDEX idx_profiles_role ON profiles(role);

-- RLS Policies for profiles
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Anyone can read profiles
CREATE POLICY "Profiles are viewable by everyone"
  ON profiles FOR SELECT
  USING (true);

-- Users can update their own profile
CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = id);

-- Only authenticated users can insert their profile
CREATE POLICY "Users can insert own profile"
  ON profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

COMMENT ON TABLE profiles IS 'User profiles with role-based access control';

-- =====================================================
-- 2. SCHOOLS TABLE
-- =====================================================
CREATE TABLE schools (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  code TEXT NOT NULL UNIQUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Index for school code lookups
CREATE INDEX idx_schools_code ON schools(code);

-- RLS Policies for schools
ALTER TABLE schools ENABLE ROW LEVEL SECURITY;

-- Anyone can read schools
CREATE POLICY "Schools are viewable by everyone"
  ON schools FOR SELECT
  USING (true);

-- Only admins can insert/update/delete schools
CREATE POLICY "Only admins can modify schools"
  ON schools FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

COMMENT ON TABLE schools IS 'University/college information';

-- =====================================================
-- 3. PLAYERS TABLE
-- =====================================================
CREATE TABLE players (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  school_id UUID NOT NULL REFERENCES schools(id) ON DELETE RESTRICT,
  uni_division TEXT NOT NULL,
  club_division TEXT NOT NULL,
  rating INTEGER NOT NULL DEFAULT 1500 CHECK (rating >= 0),
  user_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Indexes for common queries
CREATE INDEX idx_players_school ON players(school_id);
CREATE INDEX idx_players_rating ON players(rating DESC);
CREATE INDEX idx_players_user ON players(user_id);
CREATE INDEX idx_players_name ON players(name);

-- RLS Policies for players
ALTER TABLE players ENABLE ROW LEVEL SECURITY;

-- Anyone can read players
CREATE POLICY "Players are viewable by everyone"
  ON players FOR SELECT
  USING (true);

-- Only admins can insert/update/delete players
CREATE POLICY "Only admins can modify players"
  ON players FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

CREATE POLICY "Only admins can update players"
  ON players FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

COMMENT ON TABLE players IS 'Table tennis players with rating information';

-- =====================================================
-- 4. TOURNAMENTS TABLE
-- =====================================================
CREATE TABLE tournaments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  location TEXT NOT NULL,
  event_date DATE NOT NULL,
  total_participants INTEGER NOT NULL CHECK (total_participants > 0),
  tournament_type TEXT NOT NULL CHECK (tournament_type IN ('open', 'league', 'championship')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Index for date-based queries
CREATE INDEX idx_tournaments_date ON tournaments(event_date DESC);

-- RLS Policies for tournaments
ALTER TABLE tournaments ENABLE ROW LEVEL SECURITY;

-- Anyone can read tournaments
CREATE POLICY "Tournaments are viewable by everyone"
  ON tournaments FOR SELECT
  USING (true);

-- Only admins can modify tournaments
CREATE POLICY "Only admins can modify tournaments"
  ON tournaments FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

COMMENT ON TABLE tournaments IS 'Tournament and event information';

-- =====================================================
-- 5. MATCHES TABLE
-- =====================================================
CREATE TABLE matches (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  winner_id UUID NOT NULL REFERENCES players(id) ON DELETE RESTRICT,
  loser_id UUID NOT NULL REFERENCES players(id) ON DELETE RESTRICT,
  event_id UUID REFERENCES tournaments(id) ON DELETE SET NULL,
  score TEXT NOT NULL,
  played_at TIMESTAMPTZ NOT NULL,
  delta_winner INTEGER NOT NULL,
  delta_loser INTEGER NOT NULL,
  created_by UUID NOT NULL REFERENCES profiles(id) ON DELETE RESTRICT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT different_players CHECK (winner_id != loser_id)
);

-- Indexes for common queries
CREATE INDEX idx_matches_winner ON matches(winner_id);
CREATE INDEX idx_matches_loser ON matches(loser_id);
CREATE INDEX idx_matches_played_at ON matches(played_at DESC);
CREATE INDEX idx_matches_event ON matches(event_id);

-- RLS Policies for matches
ALTER TABLE matches ENABLE ROW LEVEL SECURITY;

-- Anyone can read matches
CREATE POLICY "Matches are viewable by everyone"
  ON matches FOR SELECT
  USING (true);

-- Only admins can insert matches
CREATE POLICY "Only admins can insert matches"
  ON matches FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

COMMENT ON TABLE matches IS 'Match results with rating deltas';

-- =====================================================
-- 6. RATING_HISTORY TABLE
-- =====================================================
CREATE TABLE rating_history (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  match_id UUID NOT NULL REFERENCES matches(id) ON DELETE CASCADE,
  player_id UUID NOT NULL REFERENCES players(id) ON DELETE CASCADE,
  opponent_id UUID NOT NULL REFERENCES players(id) ON DELETE CASCADE,
  is_winner BOOLEAN NOT NULL,
  rating_before INTEGER NOT NULL CHECK (rating_before >= 0),
  rating_after INTEGER NOT NULL CHECK (rating_after >= 0),
  delta INTEGER NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT different_players_history CHECK (player_id != opponent_id)
);

-- Indexes for common queries
CREATE INDEX idx_rating_history_player ON rating_history(player_id, created_at DESC);
CREATE INDEX idx_rating_history_match ON rating_history(match_id);

-- RLS Policies for rating_history
ALTER TABLE rating_history ENABLE ROW LEVEL SECURITY;

-- Anyone can read rating history
CREATE POLICY "Rating history is viewable by everyone"
  ON rating_history FOR SELECT
  USING (true);

-- Only admins can insert rating history
CREATE POLICY "Only admins can insert rating history"
  ON rating_history FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

COMMENT ON TABLE rating_history IS 'Historical rating changes for each player per match';

-- =====================================================
-- 7. TOURNAMENT_RESULTS TABLE
-- =====================================================
CREATE TABLE tournament_results (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tournament_id UUID NOT NULL REFERENCES tournaments(id) ON DELETE CASCADE,
  player_id UUID NOT NULL REFERENCES players(id) ON DELETE CASCADE,
  result_type TEXT NOT NULL CHECK (
    result_type IN (
      'winner',
      'runner_up',
      'semi_final',
      'quarter_final',
      'round_16',
      'round_32',
      'group_stage'
    )
  ),
  group_rank INTEGER CHECK (group_rank IS NULL OR group_rank > 0),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT unique_player_per_tournament UNIQUE (tournament_id, player_id),
  CONSTRAINT group_rank_only_for_group_stage CHECK (
    (result_type = 'group_stage' AND group_rank IS NOT NULL) OR
    (result_type != 'group_stage' AND group_rank IS NULL)
  )
);

-- Indexes for common queries
CREATE INDEX idx_tournament_results_tournament ON tournament_results(tournament_id);
CREATE INDEX idx_tournament_results_player ON tournament_results(player_id);

-- RLS Policies for tournament_results
ALTER TABLE tournament_results ENABLE ROW LEVEL SECURITY;

-- Anyone can read tournament results
CREATE POLICY "Tournament results are viewable by everyone"
  ON tournament_results FOR SELECT
  USING (true);

-- Only admins can modify tournament results
CREATE POLICY "Only admins can modify tournament results"
  ON tournament_results FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

COMMENT ON TABLE tournament_results IS 'Individual player results in tournaments';

-- =====================================================
-- 8. TRIGGERS & FUNCTIONS
-- =====================================================

-- Function: Update player ratings when a match is inserted
CREATE OR REPLACE FUNCTION public.update_player_ratings_on_match()
RETURNS TRIGGER
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  -- Update winner's rating
  UPDATE public.players
  SET 
    rating = rating + NEW.delta_winner,
    updated_at = NOW()
  WHERE id = NEW.winner_id;

  -- Update loser's rating (delta_loser is negative)
  UPDATE public.players
  SET 
    rating = rating + NEW.delta_loser,
    updated_at = NOW()
  WHERE id = NEW.loser_id;

  RETURN NEW;
END;
$$;

-- Trigger: Auto-update player ratings after match insert
CREATE TRIGGER trigger_update_player_ratings
  AFTER INSERT ON public.matches
  FOR EACH ROW
  EXECUTE FUNCTION public.update_player_ratings_on_match();

COMMENT ON FUNCTION public.update_player_ratings_on_match IS 'Automatically updates player ratings when a match is recorded';

-- Function: Auto-create rating history entries
CREATE OR REPLACE FUNCTION public.create_rating_history_on_match()
RETURNS TRIGGER
LANGUAGE plpgsql
SET search_path = public
AS $$
DECLARE
  winner_rating_before INTEGER;
  loser_rating_before INTEGER;
BEGIN
  -- Get current ratings before the match was applied
  SELECT rating - NEW.delta_winner INTO winner_rating_before
  FROM public.players WHERE id = NEW.winner_id;

  SELECT rating - NEW.delta_loser INTO loser_rating_before
  FROM public.players WHERE id = NEW.loser_id;

  -- Insert rating history for winner
  INSERT INTO public.rating_history (
    match_id,
    player_id,
    opponent_id,
    is_winner,
    rating_before,
    rating_after,
    delta
  ) VALUES (
    NEW.id,
    NEW.winner_id,
    NEW.loser_id,
    true,
    winner_rating_before,
    winner_rating_before + NEW.delta_winner,
    NEW.delta_winner
  );

  -- Insert rating history for loser
  INSERT INTO public.rating_history (
    match_id,
    player_id,
    opponent_id,
    is_winner,
    rating_before,
    rating_after,
    delta
  ) VALUES (
    NEW.id,
    NEW.loser_id,
    NEW.winner_id,
    false,
    loser_rating_before,
    loser_rating_before + NEW.delta_loser,
    NEW.delta_loser
  );

  RETURN NEW;
END;
$$;

-- Trigger: Auto-create rating history entries
CREATE TRIGGER trigger_create_rating_history
  AFTER INSERT ON public.matches
  FOR EACH ROW
  EXECUTE FUNCTION public.create_rating_history_on_match();

COMMENT ON FUNCTION public.create_rating_history_on_match IS 'Automatically creates 2 rating history entries (winner & loser) per match';

-- Function: Update updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;

-- Trigger: Auto-update updated_at for players
CREATE TRIGGER trigger_players_updated_at
  BEFORE UPDATE ON public.players
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- =====================================================
-- 9. HELPER VIEWS
-- =====================================================

-- View: Player statistics with calculated fields
CREATE OR REPLACE VIEW public.player_statistics
WITH (security_invoker = true)
AS
SELECT 
  p.id,
  p.name,
  p.school_id,
  s.name as school_name,
  s.code as school_code,
  p.uni_division,
  p.club_division,
  p.rating,
  p.user_id,
  -- Calculate total matches
  (
    SELECT COUNT(*)
    FROM public.matches m
    WHERE m.winner_id = p.id OR m.loser_id = p.id
  ) as total_matches,
  -- Calculate wins
  (
    SELECT COUNT(*)
    FROM public.matches m
    WHERE m.winner_id = p.id
  ) as wins,
  -- Calculate losses
  (
    SELECT COUNT(*)
    FROM public.matches m
    WHERE m.loser_id = p.id
  ) as losses,
  -- Calculate win rate
  CASE 
    WHEN (SELECT COUNT(*) FROM public.matches m WHERE m.winner_id = p.id OR m.loser_id = p.id) > 0
    THEN ROUND(
      (SELECT COUNT(*)::NUMERIC FROM public.matches m WHERE m.winner_id = p.id) * 100.0 / 
      (SELECT COUNT(*) FROM public.matches m WHERE m.winner_id = p.id OR m.loser_id = p.id),
      1
    )
    ELSE 0
  END as win_rate,
  -- Calculate rating change (last 30 days)
  (
    SELECT COALESCE(SUM(delta), 0)
    FROM public.rating_history rh
    WHERE rh.player_id = p.id
    AND rh.created_at >= NOW() - INTERVAL '30 days'
  ) as rating_change_30d,
  p.created_at,
  p.updated_at
FROM public.players p
JOIN public.schools s ON s.id = p.school_id;

COMMENT ON VIEW public.player_statistics IS 'Player stats with calculated win/loss records and win rate';

-- =====================================================
-- 10. SEED DATA (Optional - for testing)
-- =====================================================

-- Insert sample schools
INSERT INTO schools (name, code) VALUES
  ('한양대학교', 'HYU'),
  ('연세대학교', 'YU'),
  ('고려대학교', 'KU'),
  ('서울대학교', 'SNU'),
  ('성균관대학교', 'SKU')
ON CONFLICT (code) DO NOTHING;

-- =====================================================
-- END OF MIGRATION
-- =====================================================
