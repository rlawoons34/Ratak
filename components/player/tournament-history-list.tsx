'use client'

import type { TournamentRecord } from '@/lib/mock-data'
import { Badge } from '@/components/ui/badge'
import { Trophy, MapPin, Users } from 'lucide-react'

interface TournamentHistoryListProps {
  tournaments: TournamentRecord[]
  limit?: number
}

function formatTournamentResult(result: string): {
  text: string
  color: string
} {
  if (result === '우승') return { text: '🥇 우승', color: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30' }
  if (result === '준우승') return { text: '🥈 준우승', color: 'bg-gray-400/20 text-gray-300 border-gray-400/30' }
  if (result === '4강') return { text: '🏅 4강', color: 'bg-orange-500/20 text-orange-400 border-orange-500/30' }
  if (result === '8강') return { text: '8강', color: 'bg-blue-500/20 text-blue-400 border-blue-500/30' }
  return { text: result, color: 'bg-zinc-700/20 text-zinc-400 border-zinc-700/30' }
}

export function TournamentHistoryList({ tournaments, limit }: TournamentHistoryListProps) {
  const displayTournaments = limit ? tournaments.slice(0, limit) : tournaments

  return (
    <div className="bg-zinc-900/50 backdrop-blur-xl border border-white/5 rounded-3xl p-6">
      <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
        <Trophy className="w-5 h-5 text-red-400" />
        토너먼트 기록
      </h3>
      <div className="space-y-3">
        {displayTournaments.map((tournament) => {
          const resultFormat = formatTournamentResult(tournament.result)
          return (
            <div
              key={tournament.id}
              className="bg-zinc-800/50 border border-white/5 rounded-xl p-4"
            >
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h4 className="text-white font-semibold mb-1">
                    {tournament.name}
                  </h4>
                  <div className="flex items-center gap-2 text-sm text-zinc-400">
                    <MapPin className="w-3 h-3" />
                    {tournament.location}
                  </div>
                </div>
                <Badge className={resultFormat.color}>
                  {resultFormat.text}
                </Badge>
              </div>
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2 text-zinc-500">
                  <Users className="w-3 h-3" />
                  {tournament.participants}명 참가
                </div>
                <span className="text-zinc-500">
                  {new Date(tournament.date).toLocaleDateString('ko-KR', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </span>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
