/**
 * TakuRating Database Types
 * Auto-generated from Supabase schema
 * Last updated: 2026-02-05
 */

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          role: 'player' | 'admin'
          display_name: string
          created_at: string
        }
        Insert: {
          id: string
          role: 'player' | 'admin'
          display_name: string
          created_at?: string
        }
        Update: {
          id?: string
          role?: 'player' | 'admin'
          display_name?: string
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "profiles_id_fkey"
            columns: ["id"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      schools: {
        Row: {
          id: string
          name: string
          code: string
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          code: string
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          code?: string
          created_at?: string
        }
        Relationships: []
      }
      players: {
        Row: {
          id: string
          name: string
          school_id: string
          uni_division: string
          club_division: number
          rating: number
          user_id: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          school_id: string
          uni_division: string
          club_division: number
          rating?: number
          user_id?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          school_id?: string
          uni_division?: string
          club_division?: number
          rating?: number
          user_id?: string | null
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "players_school_id_fkey"
            columns: ["school_id"]
            referencedRelation: "schools"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "players_user_id_fkey"
            columns: ["user_id"]
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          }
        ]
      }
      tournaments: {
        Row: {
          id: string
          name: string
          location: string
          event_date: string
          total_participants: number
          tournament_type: 'open' | 'league' | 'championship'
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          location: string
          event_date: string
          total_participants: number
          tournament_type: 'open' | 'league' | 'championship'
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          location?: string
          event_date?: string
          total_participants?: number
          tournament_type?: 'open' | 'league' | 'championship'
          created_at?: string
        }
        Relationships: []
      }
      matches: {
        Row: {
          id: string
          winner_id: string
          loser_id: string
          event_id: string | null
          score: string
          played_at: string
          delta_winner: number
          delta_loser: number
          created_by: string
          created_at: string
        }
        Insert: {
          id?: string
          winner_id: string
          loser_id: string
          event_id?: string | null
          score: string
          played_at: string
          delta_winner: number
          delta_loser: number
          created_by: string
          created_at?: string
        }
        Update: {
          id?: string
          winner_id?: string
          loser_id?: string
          event_id?: string | null
          score?: string
          played_at?: string
          delta_winner?: number
          delta_loser?: number
          created_by?: string
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "matches_winner_id_fkey"
            columns: ["winner_id"]
            referencedRelation: "players"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "matches_loser_id_fkey"
            columns: ["loser_id"]
            referencedRelation: "players"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "matches_event_id_fkey"
            columns: ["event_id"]
            referencedRelation: "tournaments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "matches_created_by_fkey"
            columns: ["created_by"]
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          }
        ]
      }
      rating_history: {
        Row: {
          id: string
          match_id: string
          player_id: string
          opponent_id: string
          is_winner: boolean
          rating_before: number
          rating_after: number
          delta: number
          created_at: string
        }
        Insert: {
          id?: string
          match_id: string
          player_id: string
          opponent_id: string
          is_winner: boolean
          rating_before: number
          rating_after: number
          delta: number
          created_at?: string
        }
        Update: {
          id?: string
          match_id?: string
          player_id?: string
          opponent_id?: string
          is_winner?: boolean
          rating_before?: number
          rating_after?: number
          delta?: number
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "rating_history_match_id_fkey"
            columns: ["match_id"]
            referencedRelation: "matches"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "rating_history_player_id_fkey"
            columns: ["player_id"]
            referencedRelation: "players"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "rating_history_opponent_id_fkey"
            columns: ["opponent_id"]
            referencedRelation: "players"
            referencedColumns: ["id"]
          }
        ]
      }
      tournament_results: {
        Row: {
          id: string
          tournament_id: string
          player_id: string
          result_type: 'winner' | 'runner_up' | 'semi_final' | 'quarter_final' | 'round_16' | 'round_32' | 'group_stage'
          group_rank: number | null
          created_at: string
        }
        Insert: {
          id?: string
          tournament_id: string
          player_id: string
          result_type: 'winner' | 'runner_up' | 'semi_final' | 'quarter_final' | 'round_16' | 'round_32' | 'group_stage'
          group_rank?: number | null
          created_at?: string
        }
        Update: {
          id?: string
          tournament_id?: string
          player_id?: string
          result_type?: 'winner' | 'runner_up' | 'semi_final' | 'quarter_final' | 'round_16' | 'round_32' | 'group_stage'
          group_rank?: number | null
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "tournament_results_tournament_id_fkey"
            columns: ["tournament_id"]
            referencedRelation: "tournaments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tournament_results_player_id_fkey"
            columns: ["player_id"]
            referencedRelation: "players"
            referencedColumns: ["id"]
          }
        ]
      }
    }
    Views: {
      player_statistics: {
        Row: {
          id: string
          name: string
          school_id: string
          school_name: string
          school_code: string
          uni_division: string
          club_division: number
          rating: number
          user_id: string | null
          total_matches: number
          wins: number
          losses: number
          win_rate: number
          rating_change_30d: number
          created_at: string
          updated_at: string
        }
        Relationships: []
      }
    }
    Functions: {
      update_player_ratings_on_match: {
        Args: Record<string, never>
        Returns: undefined
      }
      create_rating_history_on_match: {
        Args: Record<string, never>
        Returns: undefined
      }
      update_updated_at_column: {
        Args: Record<string, never>
        Returns: undefined
      }
      calculate_usatt_delta: {
        Args: {
          winner_rating: number
          loser_rating: number
        }
        Returns: {
          delta_winner: number
          delta_loser: number
        }[]
      }
      register_match_result: {
        Args: {
          p_winner_id: string
          p_loser_id: string
          p_score: string
          p_played_at?: string
          p_event_id?: string | null
        }
        Returns: string
      }
      get_player_match_history: {
        Args: {
          p_player_id: string
          p_limit?: number
          p_offset?: number
        }
        Returns: {
          match_id: string
          match_date: string
          opponent_id: string
          opponent_name: string
          opponent_rating: number
          is_winner: boolean
          my_score: number
          opponent_score: number
          rating_before: number
          rating_after: number
          delta: number
        }[]
      }
      get_player_tournament_history: {
        Args: {
          p_player_id: string
        }
        Returns: {
          tournament_id: string
          tournament_name: string
          tournament_date: string
          location: string
          result_type: string
          group_rank: number | null
          participants: number
        }[]
      }
      calculate_win_probability: {
        Args: {
          player_a_rating: number
          player_b_rating: number
        }
        Returns: number
      }
    }
    Enums: {
      user_role: 'player' | 'admin'
      tournament_type: 'open' | 'league' | 'championship'
      tournament_result: 'winner' | 'runner_up' | 'semi_final' | 'quarter_final' | 'round_16' | 'round_32' | 'group_stage'
    }
  }
}

// Helper Types
export type Tables<T extends keyof Database['public']['Tables']> =
  Database['public']['Tables'][T]['Row']

export type Inserts<T extends keyof Database['public']['Tables']> =
  Database['public']['Tables'][T]['Insert']

export type Updates<T extends keyof Database['public']['Tables']> =
  Database['public']['Tables'][T]['Update']

export type Enums<T extends keyof Database['public']['Enums']> =
  Database['public']['Enums'][T]

// Specific Type Exports for convenience
export type Profile = Tables<'profiles'>
export type School = Tables<'schools'>
export type Player = Tables<'players'>
export type Tournament = Tables<'tournaments'>
export type Match = Tables<'matches'>
export type RatingHistory = Tables<'rating_history'>
export type TournamentResult = Tables<'tournament_results'>
export type PlayerStatistics = Database['public']['Views']['player_statistics']['Row']

// Insert Types
export type ProfileInsert = Inserts<'profiles'>
export type SchoolInsert = Inserts<'schools'>
export type PlayerInsert = Inserts<'players'>
export type TournamentInsert = Inserts<'tournaments'>
export type MatchInsert = Inserts<'matches'>
export type RatingHistoryInsert = Inserts<'rating_history'>
export type TournamentResultInsert = Inserts<'tournament_results'>

// Update Types
export type ProfileUpdate = Updates<'profiles'>
export type SchoolUpdate = Updates<'schools'>
export type PlayerUpdate = Updates<'players'>
export type TournamentUpdate = Updates<'tournaments'>
export type MatchUpdate = Updates<'matches'>
export type RatingHistoryUpdate = Updates<'rating_history'>
export type TournamentResultUpdate = Updates<'tournament_results'>

// Enum Types
export type UserRole = Enums<'user_role'>
export type TournamentType = Enums<'tournament_type'>
export type TournamentResultType = Enums<'tournament_result'>

// Utility type for tournament result display
export const TournamentResultLabels: Record<TournamentResultType, string> = {
  winner: '우승',
  runner_up: '준우승',
  semi_final: '4강',
  quarter_final: '8강',
  round_16: '16강',
  round_32: '32강',
  group_stage: '조별 예선',
}

// Function to format tournament result with group rank
export function formatTournamentResult(
  resultType: TournamentResultType,
  groupRank?: number | null
): string {
  const label = TournamentResultLabels[resultType]
  if (resultType === 'group_stage' && groupRank) {
    return `${label} (${groupRank}위)`
  }
  return label
}
