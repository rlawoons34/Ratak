/**
 * Supabase Client Configuration
 * TakuRating Project
 */

import { createClient } from '@supabase/supabase-js'
import type { Database } from '@/types/database'

// Environment variables (set these in .env.local)
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables. Please check your .env.local file.')
}

// Create Supabase client with TypeScript types
export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  },
})

// Export typed query builder
export const db = supabase

// Type-safe table accessors
export const tables = {
  profiles: () => supabase.from('profiles'),
  schools: () => supabase.from('schools'),
  players: () => supabase.from('players'),
  tournaments: () => supabase.from('tournaments'),
  matches: () => supabase.from('matches'),
  ratingHistory: () => supabase.from('rating_history'),
  tournamentResults: () => supabase.from('tournament_results'),
}

// Type-safe view accessors
export const views = {
  playerStatistics: () => supabase.from('player_statistics'),
}

// Type-safe RPC function calls
export const rpc = {
  // Register a match result (admin only)
  registerMatch: async (params: {
    winnerId: string
    loserId: string
    score: string
    playedAt?: string
    eventId?: string | null
  }) => {
    const { data, error } = await supabase.rpc('register_match_result', {
      p_winner_id: params.winnerId,
      p_loser_id: params.loserId,
      p_score: params.score,
      p_played_at: params.playedAt,
      p_event_id: params.eventId,
    })
    return { data, error }
  },

  // Get player match history
  getPlayerMatchHistory: async (
    playerId: string,
    limit: number = 50,
    offset: number = 0
  ) => {
    const { data, error } = await supabase.rpc('get_player_match_history', {
      p_player_id: playerId,
      p_limit: limit,
      p_offset: offset,
    })
    return { data, error }
  },

  // Get player tournament history
  getPlayerTournamentHistory: async (playerId: string) => {
    const { data, error } = await supabase.rpc('get_player_tournament_history', {
      p_player_id: playerId,
    })
    return { data, error }
  },

  // Calculate win probability (Elo formula)
  calculateWinProbability: async (playerARating: number, playerBRating: number) => {
    const { data, error } = await supabase.rpc('calculate_win_probability', {
      player_a_rating: playerARating,
      player_b_rating: playerBRating,
    })
    return { data, error }
  },

  // Calculate USATT delta
  calculateUsattDelta: async (winnerRating: number, loserRating: number) => {
    const { data, error } = await supabase.rpc('calculate_usatt_delta', {
      winner_rating: winnerRating,
      loser_rating: loserRating,
    })
    return { data, error }
  },
}

// Helper function to check if user is admin
export async function isAdmin(): Promise<boolean> {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return false

  const { data: profile } = await tables.profiles()
    .select('role')
    .eq('id', user.id)
    .single()

  return profile?.role === 'admin'
}

// Helper function to get current user profile
export async function getCurrentUserProfile() {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null

  const { data: profile } = await tables.profiles()
    .select('*')
    .eq('id', user.id)
    .single()

  return profile
}
