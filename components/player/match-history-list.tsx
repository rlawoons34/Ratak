'use client'

import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { formatDistanceToNow } from 'date-fns'
import { ko } from 'date-fns/locale'

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
        <CardTitle className="text-white">경기 기록</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {matches.length === 0 ? (
            <p className="text-zinc-500 text-center py-8">경기 기록이 없습니다</p>
          ) : (
            matches.map((match) => (
              <div
                key={match.match_id}
                className={`p-4 rounded-lg ${
                  match.is_winner 
                    ? 'bg-green-500/10 border border-green-500/20' 
                    : 'bg-red-500/10 border border-red-500/20'
                }`}
              >
                <div className="flex justify-between items-center">
                  <div>
                    <div className="text-white font-semibold">
                      {match.is_winner ? '승리' : '패배'} vs {match.opponent_name}
                    </div>
                    <div className="text-sm text-zinc-400">
                      스코어: {match.my_score} - {match.opponent_score}
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
                  {formatDistanceToNow(new Date(match.match_date), { 
                    addSuffix: true,
                    locale: ko 
                  })}
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  )
}
