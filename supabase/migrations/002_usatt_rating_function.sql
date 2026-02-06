-- =====================================================
-- USATT Rating Calculation Function
-- Migration: 002_usatt_rating_function
-- Description: Server-side USATT exchange chart logic
-- =====================================================

-- Function: Calculate rating delta based on USATT exchange chart
CREATE OR REPLACE FUNCTION public.calculate_usatt_delta(
  winner_rating INTEGER,
  loser_rating INTEGER
)
RETURNS TABLE(delta_winner INTEGER, delta_loser INTEGER)
LANGUAGE plpgsql
IMMUTABLE
SET search_path = public
AS $$
DECLARE
  rating_diff INTEGER;
  delta INTEGER;
BEGIN
  -- Calculate rating difference (higher rated - lower rated)
  rating_diff := ABS(winner_rating - loser_rating);
  
  -- Apply USATT Exchange Chart rules
  IF rating_diff >= 0 AND rating_diff <= 12 THEN
    delta := 8;
  ELSIF rating_diff >= 13 AND rating_diff <= 37 THEN
    delta := 7;
  ELSIF rating_diff >= 38 AND rating_diff <= 62 THEN
    delta := 6;
  ELSIF rating_diff >= 63 AND rating_diff <= 87 THEN
    delta := 5;
  ELSIF rating_diff >= 88 AND rating_diff <= 112 THEN
    delta := 4;
  ELSIF rating_diff >= 113 AND rating_diff <= 137 THEN
    delta := 3;
  ELSIF rating_diff >= 138 AND rating_diff <= 187 THEN
    delta := 2;
  ELSIF rating_diff >= 188 AND rating_diff <= 237 THEN
    delta := 1;
  ELSE
    -- Special rule for 238+ difference
    IF winner_rating > loser_rating THEN
      -- Higher rated player wins (expected result)
      delta := 0;
    ELSE
      -- Lower rated player wins (upset!)
      delta := 50;
    END IF;
  END IF;

  -- Return delta for winner and loser
  RETURN QUERY SELECT delta, -delta;
END;
$$;

COMMENT ON FUNCTION public.calculate_usatt_delta IS 'Calculates USATT rating deltas for winner and loser based on exchange chart';

-- =====================================================
-- RPC Function: Register Match Result
-- This is the ONLY way to insert matches (security)
-- =====================================================

CREATE OR REPLACE FUNCTION public.register_match_result(
  p_winner_id UUID,
  p_loser_id UUID,
  p_score TEXT,
  p_played_at TIMESTAMPTZ DEFAULT NOW(),
  p_event_id UUID DEFAULT NULL
)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_winner_rating INTEGER;
  v_loser_rating INTEGER;
  v_delta_winner INTEGER;
  v_delta_loser INTEGER;
  v_match_id UUID;
  v_user_role TEXT;
BEGIN
  -- Security check: Only admins can register matches
  SELECT role INTO v_user_role
  FROM public.profiles
  WHERE id = auth.uid();
  
  IF v_user_role IS NULL OR v_user_role != 'admin' THEN
    RAISE EXCEPTION 'Only administrators can register match results';
  END IF;

  -- Validation: winner and loser must be different
  IF p_winner_id = p_loser_id THEN
    RAISE EXCEPTION 'Winner and loser must be different players';
  END IF;

  -- Get current ratings
  SELECT rating INTO v_winner_rating
  FROM public.players
  WHERE id = p_winner_id;

  SELECT rating INTO v_loser_rating
  FROM public.players
  WHERE id = p_loser_id;

  -- Check if players exist
  IF v_winner_rating IS NULL THEN
    RAISE EXCEPTION 'Winner player not found';
  END IF;

  IF v_loser_rating IS NULL THEN
    RAISE EXCEPTION 'Loser player not found';
  END IF;

  -- Calculate rating deltas using USATT chart
  SELECT * INTO v_delta_winner, v_delta_loser
  FROM public.calculate_usatt_delta(v_winner_rating, v_loser_rating);

  -- Insert match record
  INSERT INTO public.matches (
    winner_id,
    loser_id,
    event_id,
    score,
    played_at,
    delta_winner,
    delta_loser,
    created_by
  ) VALUES (
    p_winner_id,
    p_loser_id,
    p_event_id,
    p_score,
    p_played_at,
    auth.uid()
  ) RETURNING id INTO v_match_id;

  -- Triggers will automatically:
  -- 1. Update player ratings
  -- 2. Create rating history entries

  RETURN v_match_id;
END;
$$;

COMMENT ON FUNCTION public.register_match_result IS 'Securely register a match result with automatic USATT rating calculation';

-- Grant execute permission to authenticated users (RLS will check admin role)
GRANT EXECUTE ON FUNCTION public.register_match_result TO authenticated;

-- =====================================================
-- Helper Function: Get Player Match History
-- =====================================================

CREATE OR REPLACE FUNCTION public.get_player_match_history(
  p_player_id UUID,
  p_limit INTEGER DEFAULT 50,
  p_offset INTEGER DEFAULT 0
)
RETURNS TABLE(
  match_id UUID,
  match_date TIMESTAMPTZ,
  opponent_id UUID,
  opponent_name TEXT,
  opponent_rating INTEGER,
  is_winner BOOLEAN,
  my_score INTEGER,
  opponent_score INTEGER,
  rating_before INTEGER,
  rating_after INTEGER,
  delta INTEGER
)
LANGUAGE plpgsql
STABLE
SET search_path = public
AS $$
BEGIN
  RETURN QUERY
  SELECT
    rh.match_id,
    m.played_at as match_date,
    rh.opponent_id,
    p.name as opponent_name,
    (SELECT rating FROM public.players WHERE id = rh.opponent_id) as opponent_rating,
    rh.is_winner,
    CASE 
      WHEN rh.is_winner THEN SPLIT_PART(m.score, ':', 1)::INTEGER
      ELSE SPLIT_PART(m.score, ':', 2)::INTEGER
    END as my_score,
    CASE 
      WHEN rh.is_winner THEN SPLIT_PART(m.score, ':', 2)::INTEGER
      ELSE SPLIT_PART(m.score, ':', 1)::INTEGER
    END as opponent_score,
    rh.rating_before,
    rh.rating_after,
    rh.delta
  FROM public.rating_history rh
  JOIN public.matches m ON m.id = rh.match_id
  JOIN public.players p ON p.id = rh.opponent_id
  WHERE rh.player_id = p_player_id
  ORDER BY m.played_at DESC
  LIMIT p_limit
  OFFSET p_offset;
END;
$$;

COMMENT ON FUNCTION public.get_player_match_history IS 'Retrieves paginated match history for a specific player';

-- Grant execute permission to everyone (public data)
GRANT EXECUTE ON FUNCTION public.get_player_match_history TO anon, authenticated;

-- =====================================================
-- Helper Function: Get Player Tournament History
-- =====================================================

CREATE OR REPLACE FUNCTION public.get_player_tournament_history(
  p_player_id UUID
)
RETURNS TABLE(
  tournament_id UUID,
  tournament_name TEXT,
  tournament_date DATE,
  location TEXT,
  result_type TEXT,
  group_rank INTEGER,
  participants INTEGER
)
LANGUAGE plpgsql
STABLE
SET search_path = public
AS $$
BEGIN
  RETURN QUERY
  SELECT
    t.id as tournament_id,
    t.name as tournament_name,
    t.event_date as tournament_date,
    t.location,
    tr.result_type,
    tr.group_rank,
    t.total_participants as participants
  FROM public.tournament_results tr
  JOIN public.tournaments t ON t.id = tr.tournament_id
  WHERE tr.player_id = p_player_id
  ORDER BY t.event_date DESC;
END;
$$;

COMMENT ON FUNCTION public.get_player_tournament_history IS 'Retrieves tournament participation history for a specific player';

-- Grant execute permission to everyone (public data)
GRANT EXECUTE ON FUNCTION public.get_player_tournament_history TO anon, authenticated;

-- =====================================================
-- Helper Function: Calculate Win Rate Prediction (Elo)
-- =====================================================

CREATE OR REPLACE FUNCTION public.calculate_win_probability(
  player_a_rating INTEGER,
  player_b_rating INTEGER
)
RETURNS NUMERIC
LANGUAGE plpgsql
IMMUTABLE
SET search_path = public
AS $$
BEGIN
  -- Standard Elo formula: P(A) = 1 / (1 + 10^((Rb - Ra) / 400))
  RETURN 1.0 / (1.0 + POWER(10, (player_b_rating - player_a_rating) / 400.0));
END;
$$;

COMMENT ON FUNCTION public.calculate_win_probability IS 'Calculates win probability using standard Elo formula (for display only)';

-- Grant execute permission to everyone (public function)
GRANT EXECUTE ON FUNCTION public.calculate_win_probability TO anon, authenticated;

-- =====================================================
-- END OF MIGRATION
-- =====================================================
