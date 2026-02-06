# 🚀 TakuRating - Implementation Checklist (MVP: 3 Days)

> **Project:** Table Tennis Rating System  
> **Framework:** Next.js 16 (App Router) + Supabase  
> **Target:** Complete MVP in 72 hours  
> **Date:** 2026-02-05

---

## 📊 Current Status

| Component | Status | Notes |
|-----------|--------|-------|
| Database Schema | ✅ Complete | 7 tables, RLS policies active |
| RPC Functions | ✅ Complete | `register_match_result`, `get_player_match_history` |
| Views | ✅ Complete | `player_statistics` with aggregated data |
| Frontend UI | ✅ Complete | Mock data rendering |
| Auth Setup | ⚠️ Configured | Needs integration |
| Data Binding | ❌ Not Started | **THIS IS OUR FOCUS** |

---

## 🎯 Data Flow Overview

### Core Data Flows (Must Implement)

```
┌─────────────────────────────────────────────────────────────┐
│ 1. READ: Rankings Display                                   │
│    DB View (player_statistics) → Server Component → UI      │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│ 2. READ: Player Detail                                      │
│    RPC (get_player_match_history) → Server Component → UI   │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│ 3. WRITE: Match Registration (Admin Only)                   │
│    Form Input → RPC (register_match_result) → Auto-update   │
│    │                                                         │
│    ├─> Validates admin role (server-side)                   │
│    ├─> Calculates delta (calculate_usatt_delta)             │
│    ├─> Updates player ratings (trigger)                     │
│    └─> Creates rating_history entries (trigger)             │
└─────────────────────────────────────────────────────────────┘
```

---

# Phase 1: Foundation (Day 1 Morning - 4 hours)

> **Goal:** Setup authentication, context, and type safety  
> **Priority:** 🔴 CRITICAL (Cannot proceed without this)

## 1.1 Authentication Integration

### 1.1.1 Create Auth Context Provider
**File:** `lib/auth-context.tsx` (NEW)  
**Type:** Client Component  
**Supabase Methods:** `auth.getSession()`, `auth.onAuthStateChange()`

**Data Flow:**
```
App Mount → getSession() → Fetch profile from 'profiles' table
         → Listen to auth changes → Update context state
         → Expose: { user, profile, isAdmin, loading, signOut }
```

**Implementation:**
```typescript
'use client'
import { createContext, useContext, useEffect, useState } from 'react'
import { supabase, tables } from '@/lib/supabase'
import type { User } from '@supabase/supabase-js'
import type { Profile } from '@/types/database'

interface AuthContextType {
  user: User | null
  profile: Profile | null
  isAdmin: boolean
  loading: boolean
  signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [profile, setProfile] = useState<Profile | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null)
      if (session?.user) {
        fetchProfile(session.user.id)
      } else {
        setLoading(false)
      }
    })

    // Listen to auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        setUser(session?.user ?? null)
        if (session?.user) {
          await fetchProfile(session.user.id)
        } else {
          setProfile(null)
          setLoading(false)
        }
      }
    )

    return () => subscription.unsubscribe()
  }, [])

  async function fetchProfile(userId: string) {
    const { data } = await tables.profiles()
      .select('*')
      .eq('id', userId)
      .single()
    setProfile(data)
    setLoading(false)
  }

  async function signOut() {
    await supabase.auth.signOut()
  }

  return (
    <AuthContext.Provider value={{
      user,
      profile,
      isAdmin: profile?.role === 'admin',
      loading,
      signOut
    }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) throw new Error('useAuth must be used within AuthProvider')
  return context
}
```

**Tasks:**
- [x] 1.1.1.1 Create `lib/auth-context.tsx` file
- [x] 1.1.1.2 Import required types from `@/types/database`
- [x] 1.1.1.3 Implement `AuthProvider` component with state management
- [x] 1.1.1.4 Implement `fetchProfile()` function using `tables.profiles().select().eq().single()`
- [x] 1.1.1.5 Add auth state change listener using `supabase.auth.onAuthStateChange()`
- [x] 1.1.1.6 Export `useAuth()` hook for consuming components
- [x] 1.1.1.7 Test: Verify context provides correct `isAdmin` value

---

### 1.1.2 Integrate Auth Provider in Layout
**File:** `app/layout.tsx` (UPDATE)  
**Type:** Root Layout

**Changes Required:**
```typescript
import { AuthProvider } from '@/lib/auth-context'
import { Toaster } from 'sonner'

export default function RootLayout({ children }) {
  return (
    <html lang="ko">
      <body className="antialiased bg-zinc-950">
        <AuthProvider>
          <SiteHeader />
          {children}
          <Toaster position="top-right" richColors />
        </AuthProvider>
      </body>
    </html>
  )
}
```

**Tasks:**
- [x] 1.1.2.1 Install Sonner: `npm install sonner`
- [x] 1.1.2.2 Import `AuthProvider` in `app/layout.tsx`
- [x] 1.1.2.3 Wrap `children` with `<AuthProvider>`
- [x] 1.1.2.4 Add `<Toaster />` component at root level
- [x] 1.1.2.5 Test: Verify provider wraps entire app

---

### 1.1.3 Update Auth Page with Real Login
**File:** `app/auth/page.tsx` (UPDATE)  
**Type:** Client Component  
**Supabase Methods:** `auth.signInWithPassword()`

**Data Flow:**
```
User Input (email/password) → signInWithPassword()
                            → Success: Redirect to '/'
                            → Error: Display error message
```

**Implementation:**
```typescript
'use client'
import { useState, FormEvent } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'

export default function AuthPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSignIn(e: FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError(null)

    const { error: signInError } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (signInError) {
      setError(signInError.message)
      setLoading(false)
    } else {
      router.push('/')
      router.refresh()
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-zinc-950">
      <Card className="w-full max-w-md bg-zinc-900 border-zinc-800">
        <CardHeader>
          <CardTitle className="text-2xl text-white">TakuRating Login</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSignIn} className="space-y-4">
            {error && (
              <div className="bg-red-500/10 border border-red-500 text-red-500 px-4 py-2 rounded">
                {error}
              </div>
            )}

            <div>
              <Label htmlFor="email" className="text-white">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@takurating.com"
                required
              />
            </div>

            <div>
              <Label htmlFor="password" className="text-white">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <Button type="submit" disabled={loading} className="w-full">
              {loading ? 'Signing in...' : 'Sign In'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
```

**Tasks:**
- [ ] 1.1.3.1 Update `app/auth/page.tsx` with real auth logic
- [ ] 1.1.3.2 Add form state: `email`, `password`, `loading`, `error`
- [ ] 1.1.3.3 Implement `handleSignIn()` using `supabase.auth.signInWithPassword()`
- [ ] 1.1.3.4 Add error display UI
- [ ] 1.1.3.5 Add loading state to button
- [ ] 1.1.3.6 Test: Verify successful login redirects to home page
- [ ] 1.1.3.7 Test: Verify error messages display correctly

---

### 1.1.4 Update Header Navigation
**File:** `components/layout/site-header.tsx` (UPDATE)  
**Type:** Client Component

**Data Flow:**
```
useAuth() → Read { user, isAdmin } → Conditional rendering
```

**Implementation:**
```typescript
'use client'
import { useAuth } from '@/lib/auth-context'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

export function SiteHeader() {
  const { user, isAdmin, loading, signOut } = useAuth()

  return (
    <header className="border-b border-zinc-800 bg-zinc-950">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <Link href="/" className="text-xl font-bold text-white">
          TakuRating
        </Link>

        <nav className="flex items-center gap-6">
          <Link href="/" className="text-zinc-400 hover:text-white">
            Rankings
          </Link>
          <Link href="/players" className="text-zinc-400 hover:text-white">
            Players
          </Link>
          <Link href="/schools" className="text-zinc-400 hover:text-white">
            Schools
          </Link>
          <Link href="/compare" className="text-zinc-400 hover:text-white">
            Compare
          </Link>

          {!loading && (
            <>
              {!user ? (
                <Link href="/auth">
                  <Button variant="outline" size="sm">Login</Button>
                </Link>
              ) : (
                <>
                  {isAdmin && (
                    <Link href="/admin/results">
                      <Button variant="default" size="sm">
                        Admin Panel
                      </Button>
                    </Link>
                  )}
                  <Button variant="ghost" size="sm" onClick={signOut}>
                    Logout ({user.email?.split('@')[0]})
                  </Button>
                </>
              )}
            </>
          )}
        </nav>
      </div>
    </header>
  )
}
```

**Tasks:**
- [ ] 1.1.4.1 Import `useAuth` hook in `site-header.tsx`
- [ ] 1.1.4.2 Destructure `{ user, isAdmin, loading, signOut }`
- [ ] 1.1.4.3 Add conditional rendering: Show "Login" if no user
- [ ] 1.1.4.4 Add conditional rendering: Show "Admin Panel" if `isAdmin === true`
- [ ] 1.1.4.5 Add "Logout" button with `onClick={signOut}`
- [ ] 1.1.4.6 Test: Verify navigation changes based on auth state
- [ ] 1.1.4.7 Test: Verify admin sees "Admin Panel" link

---

### 1.1.5 Create Test Admin Account
**Type:** SQL Script (Run in Supabase SQL Editor)

**Script:**
```sql
-- Insert test admin user into auth.users
INSERT INTO auth.users (
  id,
  instance_id,
  email,
  encrypted_password,
  email_confirmed_at,
  created_at,
  updated_at,
  aud,
  role
)
VALUES (
  '00000000-0000-0000-0000-000000000001',
  '00000000-0000-0000-0000-000000000000',
  'admin@takurating.com',
  crypt('admin123', gen_salt('bf')),
  NOW(),
  NOW(),
  NOW(),
  'authenticated',
  'authenticated'
);

-- Insert profile for admin
INSERT INTO public.profiles (id, role, display_name)
VALUES (
  '00000000-0000-0000-0000-000000000001',
  'admin',
  'Admin User'
);
```

**Tasks:**
- [ ] 1.1.5.1 Open Supabase SQL Editor
- [ ] 1.1.5.2 Run the admin account creation script
- [ ] 1.1.5.3 Verify: Query `SELECT * FROM auth.users WHERE email = 'admin@takurating.com'`
- [ ] 1.1.5.4 Verify: Query `SELECT * FROM public.profiles WHERE role = 'admin'`
- [ ] 1.1.5.5 Test: Login with `admin@takurating.com` / `admin123`
- [ ] 1.1.5.6 Document credentials in `.env.local.example`

---

## 1.2 Type Safety Verification

### 1.2.1 Verify Database Types
**File:** `types/database.ts` (VERIFY)

**Tasks:**
- [ ] 1.2.1.1 Open `types/database.ts`
- [ ] 1.2.1.2 Verify `Profile` type exists with `role: 'player' | 'admin'`
- [ ] 1.2.1.3 Verify `Player` type exists with all required fields
- [ ] 1.2.1.4 Verify `Match` type exists
- [ ] 1.2.1.5 Verify `PlayerStatistics` type exists (for view)
- [ ] 1.2.1.6 Verify RPC function types exist in `Functions` section
- [ ] 1.2.1.7 If types are missing, regenerate: `npx supabase gen types typescript --project-id <PROJECT_ID>`

---

### 1.2.2 Verify Supabase Client Configuration
**File:** `lib/supabase.ts` (VERIFY)

**Tasks:**
- [ ] 1.2.2.1 Verify `createClient<Database>()` includes type parameter
- [ ] 1.2.2.2 Verify `tables` object exists with type-safe accessors
- [ ] 1.2.2.3 Verify `views` object exists with `playerStatistics()` accessor
- [ ] 1.2.2.4 Verify `rpc` object exists with wrapper functions
- [ ] 1.2.2.5 Test: Import and call `tables.players().select('*')` - verify autocomplete works
- [ ] 1.2.2.6 Test: Import and call `rpc.registerMatch()` - verify parameter types

---

# Phase 2: Core Logic - Read Operations (Day 1 Afternoon - 4 hours)

> **Goal:** Replace all mock data with real Supabase queries  
> **Priority:** 🟡 IMPORTANT (Core functionality)

## 2.1 Home Page - Rankings Display

### 2.1.1 Update Home Page to Fetch Real Data
**File:** `app/page.tsx` (UPDATE)  
**Type:** Server Component (async)  
**Supabase Methods:** `views.playerStatistics().select().order().limit()`

**Data Flow:**
```
Server Component → Fetch player_statistics view
                → Order by rating DESC
                → Pass to <RankingTable /> as props
```

**Implementation:**
```typescript
import { HeroSection } from "@/components/home/hero-section"
import { MonthlyInsights } from "@/components/home/monthly-insights"
import { RankingTable } from "@/components/home/ranking-table"
import { views } from "@/lib/supabase"

export const revalidate = 60 // Cache for 60 seconds

export default async function HomePage() {
  // Fetch player statistics from view
  const { data: players, error } = await views.playerStatistics()
    .select('*')
    .order('rating', { ascending: false })
    .limit(100)

  if (error) {
    console.error('Failed to fetch players:', error)
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
        <div className="text-red-500">Error loading rankings: {error.message}</div>
      </div>
    )
  }

  // Calculate insights from real data
  const recentMatches = players
    ?.filter(p => p.total_matches > 0)
    .sort((a, b) => b.rating_change_30d - a.rating_change_30d) || []

  const topRiser = recentMatches[0] || null
  const biggestUpset = recentMatches.find(p => p.rating_change_30d > 50) || null

  return (
    <div className="min-h-screen bg-zinc-950">
      <div className="container mx-auto px-4 space-y-8 py-8">
        <HeroSection />
        <MonthlyInsights biggestUpset={biggestUpset} topRiser={topRiser} />
        <RankingTable players={players || []} />
      </div>
    </div>
  )
}
```

**Tasks:**
- [ ] 2.1.1.1 Remove mock data imports from `app/page.tsx`
- [ ] 2.1.1.2 Convert function to `async` (Server Component)
- [ ] 2.1.1.3 Import `views` from `@/lib/supabase`
- [ ] 2.1.1.4 Fetch data using `views.playerStatistics().select('*')`
- [ ] 2.1.1.5 Add `.order('rating', { ascending: false })`
- [ ] 2.1.1.6 Add `.limit(100)` to fetch top 100 players
- [ ] 2.1.1.7 Add error handling UI
- [ ] 2.1.1.8 Add `revalidate = 60` for caching
- [ ] 2.1.1.9 Calculate `topRiser` from `rating_change_30d` field
- [ ] 2.1.1.10 Pass real data to `<RankingTable players={players} />`
- [ ] 2.1.1.11 Test: Verify rankings display real database data
- [ ] 2.1.1.12 Test: Verify page revalidates every 60 seconds

---

### 2.1.2 Update Ranking Table Component
**File:** `components/home/ranking-table.tsx` (UPDATE)  
**Type:** Client Component  
**Supabase Methods:** None (receives data via props)

**Changes Required:**
- Update prop type to use `PlayerStatistics` from database types
- Remove mock data
- Keep client-side search/filter

**Implementation:**
```typescript
'use client'
import { useState } from 'react'
import type { PlayerStatistics } from '@/types/database'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import Link from 'next/link'

interface RankingTableProps {
  players: PlayerStatistics[]
}

export function RankingTable({ players }: RankingTableProps) {
  const [searchQuery, setSearchQuery] = useState('')

  const filteredPlayers = players.filter(player =>
    player.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    player.school_name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <Card className="bg-zinc-900 border-zinc-800">
      <CardHeader>
        <CardTitle className="text-white">Player Rankings</CardTitle>
        <Input
          placeholder="Search by name or school..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="mt-4"
        />
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {filteredPlayers.length === 0 ? (
            <div className="text-center py-8 text-zinc-500">
              No players found
            </div>
          ) : (
            filteredPlayers.map((player, index) => (
              <Link
                key={player.id}
                href={`/players/${player.id}`}
                className="flex items-center justify-between p-4 bg-zinc-800 hover:bg-zinc-700 rounded-lg transition"
              >
                <div className="flex items-center gap-4">
                  <span className="text-2xl font-bold text-zinc-500 w-8">
                    #{index + 1}
                  </span>
                  <div>
                    <div className="text-white font-semibold">{player.name}</div>
                    <div className="text-sm text-zinc-400">
                      {player.school_name} · {player.uni_division}
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-white">
                    {player.rating}
                  </div>
                  <div className="text-sm text-zinc-400">
                    {player.wins}W - {player.losses}L
                  </div>
                </div>
              </Link>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  )
}
```

**Tasks:**
- [ ] 2.1.2.1 Update prop interface to use `PlayerStatistics` type
- [ ] 2.1.2.2 Remove any mock data imports
- [ ] 2.1.2.3 Update field references to match database schema
- [ ] 2.1.2.4 Add empty state for no players found
- [ ] 2.1.2.5 Verify client-side search still works
- [ ] 2.1.2.6 Test: Search by player name
- [ ] 2.1.2.7 Test: Search by school name
- [ ] 2.1.2.8 Test: Click player → navigates to detail page

---

## 2.2 Player Detail Page

### 2.2.1 Update Player Detail Page with Real Data
**File:** `app/players/[id]/page.tsx` (UPDATE)  
**Type:** Server Component (async)  
**Supabase Methods:** `tables.players().select()`, `rpc.getPlayerMatchHistory()`

**Data Flow:**
```
Server Component → Fetch player with school join
                → Fetch player statistics from view
                → Fetch match history via RPC
                → Fetch tournament history via RPC
                → Pass all data to nested components
```

**Implementation:**
```typescript
import { notFound } from 'next/navigation'
import { tables, rpc, views } from '@/lib/supabase'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { MatchHistoryList } from '@/components/player/match-history-list'
import { TournamentHistoryList } from '@/components/player/tournament-history-list'

export const revalidate = 30

interface PlayerPageProps {
  params: { id: string }
}

export default async function PlayerPage({ params }: PlayerPageProps) {
  // Fetch player with school relationship
  const { data: player, error: playerError } = await tables.players()
    .select(`
      *,
      school:schools(id, name, code)
    `)
    .eq('id', params.id)
    .single()

  if (playerError || !player) {
    notFound()
  }

  // Fetch player statistics from view
  const { data: stats } = await views.playerStatistics()
    .select('*')
    .eq('id', params.id)
    .single()

  // Fetch match history using RPC
  const { data: matchHistory } = await rpc.getPlayerMatchHistory(
    params.id,
    50, // limit
    0   // offset
  )

  // Fetch tournament history using RPC
  const { data: tournamentHistory } = await rpc.getPlayerTournamentHistory(
    params.id
  )

  return (
    <div className="min-h-screen bg-zinc-950">
      <div className="container mx-auto px-4 py-8 space-y-8">
        {/* Player Overview Card */}
        <Card className="bg-zinc-900 border-zinc-800">
          <CardHeader>
            <CardTitle className="text-3xl text-white">{player.name}</CardTitle>
            <div className="text-zinc-400">
              {player.school.name} · {player.uni_division}
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-4 gap-6">
              <div>
                <div className="text-sm text-zinc-500">Rating</div>
                <div className="text-3xl font-bold text-white">{player.rating}</div>
              </div>
              <div>
                <div className="text-sm text-zinc-500">Total Matches</div>
                <div className="text-3xl font-bold text-white">{stats?.total_matches || 0}</div>
              </div>
              <div>
                <div className="text-sm text-zinc-500">Win Rate</div>
                <div className="text-3xl font-bold text-white">{stats?.win_rate || 0}%</div>
              </div>
              <div>
                <div className="text-sm text-zinc-500">30-Day Change</div>
                <div className={`text-3xl font-bold ${
                  (stats?.rating_change_30d || 0) > 0 ? 'text-green-500' : 'text-red-500'
                }`}>
                  {(stats?.rating_change_30d || 0) > 0 ? '+' : ''}{stats?.rating_change_30d || 0}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Match and Tournament History */}
        <div className="grid md:grid-cols-2 gap-8">
          <MatchHistoryList matches={matchHistory || []} />
          <TournamentHistoryList tournaments={tournamentHistory || []} />
        </div>
      </div>
    </div>
  )
}
```

**Tasks:**
- [ ] 2.2.1.1 Convert function to `async` Server Component
- [ ] 2.2.1.2 Import `tables`, `rpc`, `views` from `@/lib/supabase`
- [ ] 2.2.1.3 Fetch player with join: `.select('*, school:schools(id, name, code)')`
- [ ] 2.2.1.4 Add `.eq('id', params.id).single()` to get specific player
- [ ] 2.2.1.5 Add `notFound()` call if player doesn't exist
- [ ] 2.2.1.6 Fetch stats from view: `views.playerStatistics().select('*').eq('id', id).single()`
- [ ] 2.2.1.7 Fetch match history: `rpc.getPlayerMatchHistory(id, 50, 0)`
- [ ] 2.2.1.8 Fetch tournament history: `rpc.getPlayerTournamentHistory(id)`
- [ ] 2.2.1.9 Display player overview with real data
- [ ] 2.2.1.10 Pass data to `<MatchHistoryList />` and `<TournamentHistoryList />`
- [ ] 2.2.1.11 Add `revalidate = 30` for caching
- [ ] 2.2.1.12 Test: Navigate to player detail → verify all data displays
- [ ] 2.2.1.13 Test: Verify 404 page for invalid player ID

---

### 2.2.2 Create Match History Component
**File:** `components/player/match-history-list.tsx` (NEW)  
**Type:** Client Component

**Dependencies:** `npm install date-fns`

**Implementation:**
```typescript
'use client'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { formatDistanceToNow } from 'date-fns'

interface Match {
  match_id: string
  match_date: string
  opponent_name: string
  opponent_rating: number
  is_winner: boolean
  my_score: number
  opponent_score: number
  rating_before: number
  rating_after: number
  delta: number
}

interface MatchHistoryListProps {
  matches: Match[]
}

export function MatchHistoryList({ matches }: MatchHistoryListProps) {
  return (
    <Card className="bg-zinc-900 border-zinc-800">
      <CardHeader>
        <CardTitle className="text-white">Match History</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {matches.length === 0 ? (
            <p className="text-zinc-500 text-center py-8">No matches yet</p>
          ) : (
            matches.map((match) => (
              <div
                key={match.match_id}
                className={`p-4 rounded-lg ${
                  match.is_winner ? 'bg-green-500/10 border border-green-500/20' : 'bg-red-500/10 border border-red-500/20'
                }`}
              >
                <div className="flex justify-between items-center">
                  <div>
                    <div className="text-white font-semibold">
                      {match.is_winner ? '승리' : '패배'} vs {match.opponent_name}
                    </div>
                    <div className="text-sm text-zinc-400">
                      Score: {match.my_score} - {match.opponent_score}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className={`font-bold text-lg ${
                      match.delta > 0 ? 'text-green-500' : 'text-red-500'
                    }`}>
                      {match.delta > 0 ? '+' : ''}{match.delta}
                    </div>
                    <div className="text-sm text-zinc-400">
                      {match.rating_before} → {match.rating_after}
                    </div>
                  </div>
                </div>
                <div className="text-xs text-zinc-500 mt-2">
                  {formatDistanceToNow(new Date(match.match_date), { addSuffix: true })}
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  )
}
```

**Tasks:**
- [ ] 2.2.2.1 Install date-fns: `npm install date-fns`
- [ ] 2.2.2.2 Create `components/player/match-history-list.tsx`
- [ ] 2.2.2.3 Define `Match` interface matching RPC return type
- [ ] 2.2.2.4 Implement component with props: `{ matches: Match[] }`
- [ ] 2.2.2.5 Add empty state for no matches
- [ ] 2.2.2.6 Display win/loss with green/red styling
- [ ] 2.2.2.7 Display rating delta with +/- prefix
- [ ] 2.2.2.8 Display relative time using `formatDistanceToNow()`
- [ ] 2.2.2.9 Test: Verify matches display correctly
- [ ] 2.2.2.10 Test: Verify empty state shows when no matches

---

### 2.2.3 Create Tournament History Component
**File:** `components/player/tournament-history-list.tsx` (NEW)  
**Type:** Client Component

**Implementation:**
```typescript
'use client'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { formatTournamentResult } from '@/types/database'

interface Tournament {
  tournament_id: string
  tournament_name: string
  tournament_date: string
  location: string
  result_type: string
  group_rank: number | null
  participants: number
}

interface TournamentHistoryListProps {
  tournaments: Tournament[]
}

export function TournamentHistoryList({ tournaments }: TournamentHistoryListProps) {
  return (
    <Card className="bg-zinc-900 border-zinc-800">
      <CardHeader>
        <CardTitle className="text-white">Tournament History</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {tournaments.length === 0 ? (
            <p className="text-zinc-500 text-center py-8">No tournaments yet</p>
          ) : (
            tournaments.map((tournament) => (
              <div
                key={tournament.tournament_id}
                className="p-4 bg-zinc-800 rounded-lg hover:bg-zinc-700 transition"
              >
                <div className="text-white font-semibold">
                  {tournament.tournament_name}
                </div>
                <div className="text-sm text-zinc-400 mt-1">
                  {formatTournamentResult(
                    tournament.result_type as any,
                    tournament.group_rank
                  )}
                </div>
                <div className="flex justify-between items-center mt-2">
                  <div className="text-xs text-zinc-500">
                    {tournament.location}
                  </div>
                  <div className="text-xs text-zinc-500">
                    {new Date(tournament.tournament_date).toLocaleDateString('ko-KR')}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  )
}
```

**Tasks:**
- [ ] 2.2.3.1 Create `components/player/tournament-history-list.tsx`
- [ ] 2.2.3.2 Define `Tournament` interface matching RPC return type
- [ ] 2.2.3.3 Implement component with props: `{ tournaments: Tournament[] }`
- [ ] 2.2.3.4 Add empty state for no tournaments
- [ ] 2.2.3.5 Use `formatTournamentResult()` helper from `@/types/database`
- [ ] 2.2.3.6 Display tournament name, result, location, and date
- [ ] 2.2.3.7 Test: Verify tournaments display correctly
- [ ] 2.2.3.8 Test: Verify Korean labels display (e.g., "우승", "준우승")

---

## 2.3 Schools Page

### ⚠️ **MVP REQUIREMENT CHANGE**
**Status:** Coming Soon / Beta  
**UI Display:** "서비스 준비 중입니다" (Coming Soon) page  
**Backend:** Keep all DB logic and relations intact for future scalability  
**Reason:** MVP is for a specific club - full school ranking not needed yet

### 2.3.1 Update Schools Page with "Coming Soon" Component
**File:** `app/schools/page.tsx` (UPDATE)  
**Type:** Server Component  
**Backend Status:** Keep intact (tables.schools, players relations, RLS policies)

**Implementation:**
```typescript
import { ComingSoon } from "@/components/ui/coming-soon"

export default function SchoolsPage() {
  return <ComingSoon feature="학교 랭킹" />
}
```

**Original Implementation (PRESERVED FOR FUTURE):**
**Type:** Server Component (async)  
**Supabase Methods:** `tables.schools().select()`, `tables.players().select()`

**Data Flow:**
```
Server Component → Fetch all schools
                → Fetch all players
                → Aggregate: Calculate avg rating per school
                → Sort schools by avg rating
                → Display in grid
```

**Implementation:**
```typescript
import { tables } from '@/lib/supabase'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import Link from 'next/link'

export const revalidate = 120

export default async function SchoolsPage() {
  // Fetch schools
  const { data: schools } = await tables.schools()
    .select('*')
    .order('name')

  // Fetch all players
  const { data: players } = await tables.players()
    .select('id, school_id, rating, name')

  // Aggregate by school
  const schoolStats = schools?.map(school => {
    const schoolPlayers = players?.filter(p => p.school_id === school.id) || []
    const avgRating = schoolPlayers.length > 0
      ? Math.round(schoolPlayers.reduce((sum, p) => sum + p.rating, 0) / schoolPlayers.length)
      : 0
    const topPlayer = schoolPlayers.reduce((max, p) => 
      p.rating > (max?.rating || 0) ? p : max, schoolPlayers[0]
    )

    return {
      ...school,
      playerCount: schoolPlayers.length,
      avgRating,
      topPlayer
    }
  }).sort((a, b) => b.avgRating - a.avgRating) || []

  return (
    <div className="min-h-screen bg-zinc-950">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold text-white mb-8">School Rankings</h1>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {schoolStats.map((school, index) => (
            <Card key={school.id} className="bg-zinc-900 border-zinc-800">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-white">{school.name}</CardTitle>
                  <span className="text-zinc-500 text-lg">#{index + 1}</span>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-zinc-400">Avg Rating:</span>
                    <span className="text-white font-bold text-xl">{school.avgRating}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-zinc-400">Players:</span>
                    <span className="text-white font-semibold">{school.playerCount}</span>
                  </div>
                  {school.topPlayer && (
                    <div className="mt-4 pt-4 border-t border-zinc-800">
                      <div className="text-xs text-zinc-500 mb-1">Top Player:</div>
                      <Link 
                        href={`/players/${school.topPlayer.id}`}
                        className="text-white hover:text-zinc-300 flex justify-between"
                      >
                        <span>{school.topPlayer.name}</span>
                        <span className="text-zinc-400">({school.topPlayer.rating})</span>
                      </Link>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}
```

**Tasks:**
- [ ] 2.3.1.1 Convert function to `async` Server Component
- [ ] 2.3.1.2 Fetch schools: `tables.schools().select('*').order('name')`
- [ ] 2.3.1.3 Fetch players: `tables.players().select('id, school_id, rating, name')`
- [ ] 2.3.1.4 Implement aggregation logic to calculate avg rating per school
- [ ] 2.3.1.5 Find top player per school (highest rating)
- [ ] 2.3.1.6 Sort schools by avg rating (descending)
- [ ] 2.3.1.7 Display schools in responsive grid
- [ ] 2.3.1.8 Add `revalidate = 120` for caching
- [ ] 2.3.1.9 Test: Verify schools display with correct stats
- [ ] 2.3.1.10 Test: Verify top player link works

---

# Phase 3: Core Logic - Write Operations (Day 2 - 6 hours)

> **Goal:** Implement match registration with admin-only access  
> **Priority:** 🟡 IMPORTANT (Core functionality)

## 3.1 Admin Results Page

### 3.1.1 Create Admin Route Protection
**File:** `app/admin/results/page.tsx` (UPDATE)  
**Type:** Client Component

**Data Flow:**
```
Page Mount → useAuth() → Check isAdmin
          → If not admin: Redirect to /auth
          → If admin: Display <MatchRegistrationForm />
```

**Implementation:**
```typescript
'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/lib/auth-context'
import { MatchRegistrationForm } from '@/components/admin/match-registration-form'

export default function AdminResultsPage() {
  const router = useRouter()
  const { isAdmin, loading } = useAuth()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (mounted && !loading && !isAdmin) {
      router.push('/auth')
    }
  }, [mounted, loading, isAdmin, router])

  if (loading || !mounted) {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
        <div className="text-white">Loading...</div>
      </div>
    )
  }

  if (!isAdmin) {
    return null
  }

  return (
    <div className="min-h-screen bg-zinc-950">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold text-white mb-8">Register Match Result</h1>
        <MatchRegistrationForm />
      </div>
    </div>
  )
}
```

**Tasks:**
- [ ] 3.1.1.1 Update `app/admin/results/page.tsx`
- [ ] 3.1.1.2 Add `'use client'` directive
- [ ] 3.1.1.3 Import `useAuth` hook
- [ ] 3.1.1.4 Implement admin check on mount
- [ ] 3.1.1.5 Redirect to `/auth` if not admin
- [ ] 3.1.1.6 Display loading state while checking auth
- [ ] 3.1.1.7 Test: Access `/admin/results` as non-admin → should redirect
- [ ] 3.1.1.8 Test: Access as admin → should display form

---

### 3.1.2 Create Player Search Combobox
**File:** `components/admin/player-search-combobox.tsx` (NEW)  
**Type:** Client Component  
**Supabase Methods:** `tables.players().select().ilike().limit()`

**Data Flow:**
```
User types query → Debounce → Search players
                 → Display results in dropdown
                 → User selects → Call onSelect callback
```

**Implementation:**
```typescript
'use client'
import { useState, useEffect } from 'react'
import { tables } from '@/lib/supabase'
import type { Player } from '@/types/database'
import { Command, CommandInput, CommandList, CommandEmpty, CommandGroup, CommandItem } from '@/components/ui/command'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Button } from '@/components/ui/button'

interface PlayerSearchComboboxProps {
  onSelect: (player: Player) => void
  selected: Player | null
  placeholder?: string
}

export function PlayerSearchCombobox({ onSelect, selected, placeholder }: PlayerSearchComboboxProps) {
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [players, setPlayers] = useState<Player[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (query.length >= 2) {
      searchPlayers(query)
    } else {
      setPlayers([])
    }
  }, [query])

  async function searchPlayers(searchQuery: string) {
    setLoading(true)
    const { data } = await tables.players()
      .select('*, school:schools(name)')
      .ilike('name', `%${searchQuery}%`)
      .limit(10)
    
    setPlayers(data || [])
    setLoading(false)
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between text-left"
        >
          {selected
            ? `${selected.name} (${selected.rating})`
            : placeholder || 'Select player...'}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0">
        <Command>
          <CommandInput
            placeholder="Type to search..."
            value={query}
            onValueChange={setQuery}
          />
          <CommandList>
            {loading && (
              <div className="py-6 text-center text-sm">Loading...</div>
            )}
            {!loading && query.length >= 2 && players.length === 0 && (
              <CommandEmpty>No players found.</CommandEmpty>
            )}
            {!loading && players.length > 0 && (
              <CommandGroup>
                {players.map((player) => (
                  <CommandItem
                    key={player.id}
                    onSelect={() => {
                      onSelect(player)
                      setOpen(false)
                      setQuery('')
                    }}
                  >
                    <div className="flex justify-between w-full">
                      <span>{player.name}</span>
                      <span className="text-zinc-500">{player.rating}</span>
                    </div>
                  </CommandItem>
                ))}
              </CommandGroup>
            )}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
```

**Tasks:**
- [ ] 3.1.2.1 Create `components/admin/player-search-combobox.tsx`
- [ ] 3.1.2.2 Import Radix UI Command components
- [ ] 3.1.2.3 Add state: `query`, `players`, `loading`, `open`
- [ ] 3.1.2.4 Implement `searchPlayers()` function using `.ilike('name', '%query%')`
- [ ] 3.1.2.5 Add debouncing: only search if query length >= 2
- [ ] 3.1.2.6 Limit results to 10 using `.limit(10)`
- [ ] 3.1.2.7 Display player name and rating in dropdown
- [ ] 3.1.2.8 Call `onSelect(player)` when user clicks item
- [ ] 3.1.2.9 Close dropdown after selection
- [ ] 3.1.2.10 Test: Type player name → verify search works
- [ ] 3.1.2.11 Test: Select player → verify callback fires

---

### 3.1.3 Create Match Registration Form
**File:** `components/admin/match-registration-form.tsx` (NEW)  
**Type:** Client Component  
**Supabase Methods:** `rpc.calculateUsattDelta()`, `rpc.registerMatch()`

**Data Flow:**
```
User selects winner/loser → Calculate delta preview (RPC)
                          → Display preview
User fills form → Submit → register_match_result RPC
                         → Success: Toast + Redirect
                         → Error: Display error
```

**Implementation:**
```typescript
'use client'
import { useState, useEffect, FormEvent } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { rpc } from '@/lib/supabase'
import type { Player } from '@/types/database'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { PlayerSearchCombobox } from './player-search-combobox'

export function MatchRegistrationForm() {
  const router = useRouter()
  
  // Form state
  const [winner, setWinner] = useState<Player | null>(null)
  const [loser, setLoser] = useState<Player | null>(null)
  const [score, setScore] = useState('')
  const [playedAt, setPlayedAt] = useState(new Date().toISOString().split('T')[0])
  
  // UI state
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [preview, setPreview] = useState<{
    delta_winner: number
    delta_loser: number
  } | null>(null)

  // Calculate delta preview when players change
  useEffect(() => {
    if (winner && loser) {
      calculatePreview()
    } else {
      setPreview(null)
    }
  }, [winner, loser])

  async function calculatePreview() {
    if (!winner || !loser) return

    const { data, error } = await rpc.calculateUsattDelta(
      winner.rating,
      loser.rating
    )

    if (error) {
      console.error('Failed to calculate preview:', error)
    } else if (data && data.length > 0) {
      setPreview({
        delta_winner: data[0].delta_winner,
        delta_loser: data[0].delta_loser
      })
    }
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    
    if (!winner || !loser) {
      setError('Please select both winner and loser')
      return
    }

    if (!score.match(/^\d+:\d+$/)) {
      setError('Score format must be "X:Y" (e.g., "3:1")')
      return
    }

    if (winner.id === loser.id) {
      setError('Winner and loser must be different players')
      return
    }

    setLoading(true)
    setError(null)

    // Call RPC to register match
    const { data: matchId, error: registerError } = await rpc.registerMatch({
      winnerId: winner.id,
      loserId: loser.id,
      score: score,
      playedAt: new Date(playedAt).toISOString(),
      eventId: null
    })

    if (registerError) {
      setError(registerError.message)
      toast.error('Failed to register match', {
        description: registerError.message
      })
      setLoading(false)
    } else {
      toast.success('Match registered successfully!', {
        description: `${winner.name} defeated ${loser.name}`
      })
      router.push('/')
      router.refresh()
    }
  }

  return (
    <Card className="bg-zinc-900 border-zinc-800 max-w-2xl">
      <CardHeader>
        <CardTitle className="text-white">Match Details</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Error Message */}
          {error && (
            <div className="bg-red-500/10 border border-red-500 text-red-500 px-4 py-3 rounded">
              {error}
            </div>
          )}

          {/* Winner Selection */}
          <div>
            <Label className="text-white">Winner</Label>
            <PlayerSearchCombobox
              onSelect={setWinner}
              selected={winner}
              placeholder="Search winner..."
            />
            {winner && (
              <div className="mt-2 text-sm text-zinc-400">
                Current Rating: {winner.rating}
              </div>
            )}
          </div>

          {/* Loser Selection */}
          <div>
            <Label className="text-white">Loser</Label>
            <PlayerSearchCombobox
              onSelect={setLoser}
              selected={loser}
              placeholder="Search loser..."
            />
            {loser && (
              <div className="mt-2 text-sm text-zinc-400">
                Current Rating: {loser.rating}
              </div>
            )}
          </div>

          {/* Rating Delta Preview */}
          {preview && winner && loser && (
            <div className="bg-zinc-800 p-4 rounded-lg">
              <div className="text-sm text-zinc-400 mb-2">Rating Changes Preview:</div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="text-white font-semibold">{winner.name}</div>
                  <div className="text-green-500 font-bold">
                    {winner.rating} → {winner.rating + preview.delta_winner}
                    <span className="ml-2 text-sm">
                      (+{preview.delta_winner})
                    </span>
                  </div>
                </div>
                <div>
                  <div className="text-white font-semibold">{loser.name}</div>
                  <div className="text-red-500 font-bold">
                    {loser.rating} → {loser.rating + preview.delta_loser}
                    <span className="ml-2 text-sm">
                      ({preview.delta_loser})
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Score Input */}
          <div>
            <Label htmlFor="score" className="text-white">Score</Label>
            <Input
              id="score"
              type="text"
              value={score}
              onChange={(e) => setScore(e.target.value)}
              placeholder="3:1"
              pattern="^\d+:\d+$"
              required
            />
            <div className="text-xs text-zinc-500 mt-1">
              Format: Winner Score : Loser Score (e.g., "3:1")
            </div>
          </div>

          {/* Date Input */}
          <div>
            <Label htmlFor="playedAt" className="text-white">Match Date</Label>
            <Input
              id="playedAt"
              type="date"
              value={playedAt}
              onChange={(e) => setPlayedAt(e.target.value)}
              required
            />
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            disabled={loading || !winner || !loser || !score}
            className="w-full"
          >
            {loading ? 'Registering...' : 'Register Match'}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
```

**Tasks:**
- [ ] 3.1.3.1 Create `components/admin/match-registration-form.tsx`
- [ ] 3.1.3.2 Add form state: winner, loser, score, playedAt
- [ ] 3.1.3.3 Add UI state: loading, error, preview
- [ ] 3.1.3.4 Implement `calculatePreview()` using `rpc.calculateUsattDelta()`
- [ ] 3.1.3.5 Add `useEffect` to calculate preview when players change
- [ ] 3.1.3.6 Implement `handleSubmit()` function
- [ ] 3.1.3.7 Add validation: Check winner !== loser
- [ ] 3.1.3.8 Add validation: Check score format (regex: `^\d+:\d+$`)
- [ ] 3.1.3.9 Call `rpc.registerMatch()` on submit
- [ ] 3.1.3.10 Display success toast using `toast.success()`
- [ ] 3.1.3.11 Display error toast using `toast.error()`
- [ ] 3.1.3.12 Redirect to home page on success using `router.push('/')`
- [ ] 3.1.3.13 Call `router.refresh()` to revalidate server components
- [ ] 3.1.3.14 Test: Select 2 players → verify preview displays
- [ ] 3.1.3.15 Test: Submit form → verify match registers
- [ ] 3.1.3.16 Test: Verify player ratings update in database
- [ ] 3.1.3.17 Test: Verify rating_history entries created
- [ ] 3.1.3.18 Test: Submit invalid data → verify error displays

---

# Phase 4: Feedback & Polish (Day 2 Afternoon - 2 hours)

> **Goal:** Add loading states, error handling, and UX polish  
> **Priority:** 🟢 POLISH (Quality of life)

## 4.1 Loading States

### 4.1.1 Create Skeleton Component
**File:** `components/ui/skeleton.tsx` (NEW)

**Implementation:**
```typescript
import { cn } from '@/lib/utils'

interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {}

export function Skeleton({ className, ...props }: SkeletonProps) {
  return (
    <div
      className={cn('animate-pulse rounded-md bg-zinc-800', className)}
      {...props}
    />
  )
}
```

**Tasks:**
- [ ] 4.1.1.1 Create `components/ui/skeleton.tsx`
- [ ] 4.1.1.2 Implement Skeleton component with Tailwind animate-pulse
- [ ] 4.1.1.3 Test: Use `<Skeleton className="h-12 w-64" />`

---

### 4.1.2 Create Loading Page
**File:** `app/loading.tsx` (NEW)

**Implementation:**
```typescript
import { Skeleton } from '@/components/ui/skeleton'

export default function Loading() {
  return (
    <div className="min-h-screen bg-zinc-950">
      <div className="container mx-auto px-4 py-8 space-y-4">
        <Skeleton className="h-12 w-64" />
        <Skeleton className="h-64 w-full" />
        <Skeleton className="h-64 w-full" />
      </div>
    </div>
  )
}
```

**Tasks:**
- [ ] 4.1.2.1 Create `app/loading.tsx`
- [ ] 4.1.2.2 Add skeleton placeholders matching layout
- [ ] 4.1.2.3 Test: Navigate between pages → verify loading state shows

---

## 4.2 Error Handling

### 4.2.1 Create Error Boundary
**File:** `app/error.tsx` (NEW)

**Implementation:**
```typescript
'use client'
import { useEffect } from 'react'
import { Button } from '@/components/ui/button'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error('Error boundary caught:', error)
  }, [error])

  return (
    <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
      <div className="text-center space-y-4">
        <h2 className="text-2xl font-bold text-white">Something went wrong!</h2>
        <p className="text-zinc-400">{error.message}</p>
        <Button onClick={reset}>Try again</Button>
      </div>
    </div>
  )
}
```

**Tasks:**
- [ ] 4.2.1.1 Create `app/error.tsx`
- [ ] 4.2.1.2 Add `'use client'` directive
- [ ] 4.2.1.3 Display error message
- [ ] 4.2.1.4 Add retry button calling `reset()`
- [ ] 4.2.1.5 Test: Trigger error → verify error page displays

---

### 4.2.2 Create Not Found Page
**File:** `app/not-found.tsx` (NEW)

**Implementation:**
```typescript
import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default function NotFound() {
  return (
    <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
      <div className="text-center space-y-4">
        <h2 className="text-4xl font-bold text-white">404</h2>
        <p className="text-zinc-400">Page not found</p>
        <Link href="/">
          <Button>Go back home</Button>
        </Link>
      </div>
    </div>
  )
}
```

**Tasks:**
- [ ] 4.2.2.1 Create `app/not-found.tsx`
- [ ] 4.2.2.2 Add 404 message
- [ ] 4.2.2.3 Add "Go back home" button
- [ ] 4.2.2.4 Test: Navigate to invalid URL → verify 404 displays

---

## 4.3 Performance Optimization

### 4.3.1 Configure Revalidation
**Tasks:**
- [ ] 4.3.1.1 Add `export const revalidate = 60` to `app/page.tsx`
- [ ] 4.3.1.2 Add `export const revalidate = 30` to `app/players/[id]/page.tsx`
- [ ] 4.3.1.3 Add `export const revalidate = 120` to `app/schools/page.tsx`
- [ ] 4.3.1.4 Test: Verify pages cache and revalidate at intervals

---

### 4.3.2 Add Loading States to Forms
**Tasks:**
- [ ] 4.3.2.1 Add `disabled={loading}` to all form buttons
- [ ] 4.3.2.2 Add loading text: `{loading ? 'Loading...' : 'Submit'}`
- [ ] 4.3.2.3 Add loading spinners (optional, use lucide-react icons)
- [ ] 4.3.2.4 Test: Submit form → verify button shows loading state

---

# Phase 5: AI Features (Day 3 - Optional)

> **Goal:** Add AI-powered features using Cursor AI and OpenAI  
> **Priority:** 🟢 OPTIONAL (Future enhancement)

## 5.1 Use Cursor AI for Development

### 5.1.1 Cursor AI Prompts for Common Tasks
**Tasks:**
- [ ] 5.1.1.1 Use Cursor AI to generate Supabase queries
  - Prompt: "Generate a Supabase query to fetch all players from school X with rating > Y"
- [ ] 5.1.1.2 Use Cursor AI to debug RLS policies
  - Prompt: "Why can't I fetch data from matches table? Here's my RLS policy: [paste]"
- [ ] 5.1.1.3 Use Cursor AI to optimize queries
  - Prompt: "Optimize this query for performance: [paste query]"
- [ ] 5.1.1.4 Use Cursor AI to generate component boilerplate
  - Prompt: "Create a Server Component that fetches tournaments and displays them in a grid"

---

## 5.2 AI Match Prediction (Future)

### 5.2.1 Create AI Prediction API
**File:** `app/api/ai/predict-match/route.ts` (NEW)  
**Dependencies:** `npm install openai`

**Tasks:**
- [ ] 5.2.1.1 Install OpenAI SDK: `npm install openai`
- [ ] 5.2.1.2 Create API route at `app/api/ai/predict-match/route.ts`
- [ ] 5.2.1.3 Fetch player stats and recent matches
- [ ] 5.2.1.4 Send to OpenAI GPT-4 for prediction
- [ ] 5.2.1.5 Return prediction with win probability
- [ ] 5.2.1.6 Display in Compare page

---

# 📊 Implementation Summary

## 🔴 Critical (MUST DO - Day 1)
- [ ] 1.1 Authentication Integration (4 tasks)
- [ ] 1.2 Type Safety Verification (2 tasks)
- [ ] 2.1 Home Page Rankings (2 tasks)
- [ ] 2.2 Player Detail Page (3 tasks)

## 🟡 Important (MUST DO - Day 2)
- [ ] 2.3 Schools Page (1 task)
- [ ] 3.1 Admin Match Registration (3 tasks)

## 🟢 Polish (NICE TO HAVE - Day 2-3)
- [ ] 4.1 Loading States (2 tasks)
- [ ] 4.2 Error Handling (2 tasks)
- [ ] 4.3 Performance Optimization (2 tasks)

## 🔵 Optional (Future - Day 3+)
- [ ] 5.1 Cursor AI Integration (1 task)
- [ ] 5.2 AI Match Prediction (1 task)

---

# 🚀 Quick Start Checklist

Before starting coding, ensure:
- [ ] Node.js 18+ installed
- [ ] Supabase project created
- [ ] Database migrations applied (001, 002)
- [ ] `.env.local` configured with Supabase credentials
- [ ] Dependencies installed: `npm install`
- [ ] Dev server running: `npm run dev`
- [ ] Admin test account created in Supabase

---

# 📚 Key Supabase SDK Methods Reference

## Queries
```typescript
// Select all
.select('*')

// Select with joins
.select('*, school:schools(name, code)')

// Filters
.eq('column', value)
.ilike('column', '%search%')

// Order & Limit
.order('column', { ascending: false })
.limit(10)

// Single row
.single()
```

## RPC
```typescript
// Call function
supabase.rpc('function_name', { param: value })

// Example
rpc.registerMatch({ winnerId, loserId, score, playedAt, eventId })
```

## Auth
```typescript
// Login
supabase.auth.signInWithPassword({ email, password })

// Logout
supabase.auth.signOut()

// Get session
supabase.auth.getSession()

// Listen to changes
supabase.auth.onAuthStateChange(callback)
```

---

**Document Version:** 3.0 (Detailed Checklist Edition)  
**Last Updated:** 2026-02-05  
**Total Tasks:** 120+ actionable items  
**Estimated Completion:** 3 days (MVP)
