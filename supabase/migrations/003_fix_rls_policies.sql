-- =====================================================
-- Fix RLS Policies for profiles table
-- Migration: 003_fix_rls_policies
-- Description: Fix 406 error by ensuring proper RLS policies
-- =====================================================

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Profiles are viewable by everyone" ON profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
DROP POLICY IF EXISTS "Users can insert own profile" ON profiles;

-- Recreate RLS policies with proper permissions

-- Policy 1: Anyone (including anonymous) can read all profiles
-- This is needed for the AuthProvider to fetch profile data
CREATE POLICY "Enable read access for all users"
  ON profiles FOR SELECT
  USING (true);

-- Policy 2: Authenticated users can read their own profile
CREATE POLICY "Users can read own profile"
  ON profiles FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

-- Policy 3: Users can update their own profile
CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- Policy 4: Users can insert their own profile during signup
CREATE POLICY "Users can insert own profile during signup"
  ON profiles FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

-- Verify RLS is enabled
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Add helpful comment
COMMENT ON TABLE profiles IS 'User profiles with role-based access control. RLS enabled for security.';

-- =====================================================
-- Verification Query (Run this to check policies)
-- =====================================================
-- SELECT 
--   schemaname, 
--   tablename, 
--   policyname, 
--   permissive, 
--   roles, 
--   cmd, 
--   qual, 
--   with_check
-- FROM pg_policies 
-- WHERE tablename = 'profiles';
