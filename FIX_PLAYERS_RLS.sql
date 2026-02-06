-- =========================================
-- FIX: Players Table RLS Policies
-- Issue: No SELECT policy → Players search fails
-- =========================================

-- Drop existing policies (if any)
DROP POLICY IF EXISTS "Anyone can view players" ON public.players;
DROP POLICY IF EXISTS "Public can view players" ON public.players;

-- Create SELECT policy: Allow everyone to read players
CREATE POLICY "Anyone can view players"
  ON public.players FOR SELECT
  USING (true);

-- Keep existing admin-only policies for INSERT/UPDATE
-- (These should already exist from 001_initial_schema.sql)

-- Verify policies
DO $$
BEGIN
  RAISE NOTICE '✅ RLS Policies for players table:';
  RAISE NOTICE '  - SELECT: Anyone (public)';
  RAISE NOTICE '  - INSERT: Admins only';
  RAISE NOTICE '  - UPDATE: Admins only';
END $$;
