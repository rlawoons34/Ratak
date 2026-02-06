'use client'

import { formatDistanceToNow } from 'date-fns'
import { ko } from 'date-fns/locale'
import type { MatchHistoryRecord } from '@/lib/mock-data'
import { Badge } from '@/components/ui/badge'
import { TrendingUp, TrendingDown } from 'lucide-react'

interface MatchHistoryTableProps {
  matchHistory: MatchHistoryRecord[]
  limit?: number
}

export function MatchHistoryTable({ matchHistory, limit }: MatchHistoryTableProps) {
  const displayMatches = limit ? matchHistory.slice(0, limit) : matchHistory

  return (
    <div className="bg-zinc-900/50 backdrop-blur-xl border border-white/5 rounded-3xl p-6">
      <h3 className="text-xl font-bold text-white mb-4">최근 경기 기록</h3>
      <div className="space-y-3">
        {displayMatches.map((match) => (
          <div
            key={match.id}
            className={`bg-zinc-800/50 border rounded-xl p-4 ${
              match.isWin ? 'border-green-500/20' : 'border-red-500/20'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-3">
                <Badge
                  className={`${
                    match.isWin
                      ? 'bg-green-500/20 text-green-400 border-green-500/30'
                      : 'bg-red-500/20 text-red-400 border-red-500/30'
                  }`}
                >
                  {match.isWin ? '승' : '패'}
                </Badge>
                <span className="text-white font-semibold">
                  vs {match.opponentName}
                </span>
                <span className="text-zinc-500 text-sm">
                  (레이팅 {match.opponentRating})
                </span>
              </div>
              <span className="text-zinc-500 text-sm">
                {formatDistanceToNow(new Date(match.date), {
                  addSuffix: true,
                  locale: ko,
                })}
              </span>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <span className="text-white font-mono text-lg">
                  {match.myScore}:{match.opponentScore}
                </span>
                <div className="flex items-center gap-2 text-sm">
                  <span className="text-zinc-400">{match.myRatingBefore}</span>
                  {match.isWin ? (
                    <TrendingUp className="w-4 h-4 text-green-400" />
                  ) : (
                    <TrendingDown className="w-4 h-4 text-red-400" />
                  )}
                  <span className="text-white font-semibold">
                    {match.myRatingAfter}
                  </span>
                </div>
              </div>
              <div
                className={`font-mono font-bold ${
                  match.ratingDelta > 0 ? 'text-green-400' : 'text-red-400'
                }`}
              >
                {match.ratingDelta > 0 ? '+' : ''}
                {match.ratingDelta}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
