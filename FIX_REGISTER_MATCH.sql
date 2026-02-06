-- =========================================
-- FIX: register_match_result Function
-- Issue: INSERT has more target columns than expressions
-- Solution: Add missing delta_winner and delta_loser values
-- =========================================

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

  -- Insert match record (✅ FIXED: Added delta values)
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
    v_delta_winner,    -- ✅ ADDED
    v_delta_loser,     -- ✅ ADDED
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

-- Verify function
DO $$
BEGIN
  RAISE NOTICE '✅ register_match_result function updated successfully';
  RAISE NOTICE '  - Fixed: Added delta_winner and delta_loser values to INSERT';
END $$;
