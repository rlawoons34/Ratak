-- =====================================================
-- QUICK FIX: Copy and paste this into Supabase SQL Editor
-- This will fix the 406 error immediately
-- =====================================================

-- Step 1: Drop existing policies
DROP POLICY IF EXISTS "Profiles are viewable by everyone" ON profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
DROP POLICY IF EXISTS "Users can insert own profile" ON profiles;

-- Step 2: Create new policy that allows everyone to read profiles
CREATE POLICY "Enable read access for all users"
  ON profiles FOR SELECT
  USING (true);

-- Step 3: Allow authenticated users to update their own profile
CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- Step 4: Allow authenticated users to insert their own profile
CREATE POLICY "Users can insert own profile"
  ON profiles FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

-- Step 5: Ensure RLS is enabled
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- =====================================================
-- Verification: Run this to check if policies are set correctly
-- =====================================================
SELECT 
  policyname, 
  cmd, 
  roles,
  qual,
  with_check
FROM pg_policies 
WHERE tablename = 'profiles';

-- You should see 3 policies:
-- 1. "Enable read access for all users" - SELECT - {public}
-- 2. "Users can update own profile" - UPDATE - {authenticated}
-- 3. "Users can insert own profile" - INSERT - {authenticated}
