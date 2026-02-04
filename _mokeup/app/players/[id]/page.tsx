"use client"

import { use } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { PageLayout } from "@/components/page-layout"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ArrowLeft, TrendingUp, TrendingDown, Minus, Calendar, Target, Swords } from "lucide-react"
import { players, getPlayerMatches } from "@/lib/data"

interface PlayerPageProps {
  params: Promise<{ id: string }>
}

export default function PlayerPage({ params }: PlayerPageProps) {
  const { id } = use(params)
  const router = useRouter()
  const player = players.find((p) => p.id === id)
  const matches = getPlayerMatches(id).slice(0, 5)

  if (!player) {
    return (
      <PageLayout>
        <div className="container mx-auto px-4 py-6">
          <div className="text-center py-12">
            <p className="text-zinc-500">선수를 찾을 수 없습니다.</p>
            <Button 
              variant="outline" 
              className="mt-4 bg-transparent border-white/10 text-zinc-300 hover:bg-white/5" 
              onClick={() => router.back()}
            >
              돌아가기
            </Button>
          </div>
        </div>
      </PageLayout>
    )
  }

  const ratingTrend = player.ratingChange > 0 
    ? { icon: TrendingUp, color: "text-green-400", label: "상승" }
    : player.ratingChange < 0 
    ? { icon: TrendingDown, color: "text-red-400", label: "하락" }
    : { icon: Minus, color: "text-zinc-500", label: "유지" }

  const TrendIcon = ratingTrend.icon

  return (
    <PageLayout>
      <div className="container mx-auto px-4 space-y-6">
        {/* Back Button */}
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={() => router.back()} 
          className="gap-2 text-zinc-400 hover:text-white hover:bg-white/5"
        >
          <ArrowLeft className="w-4 h-4" />
          돌아가기
        </Button>

        {/* Player Card - Video Game Style */}
        <div className="relative group">
          {/* Glow effect */}
          <div className="absolute inset-0 bg-red-500/20 rounded-3xl blur-2xl opacity-50 group-hover:opacity-75 transition-opacity" />
          
          <div className="relative bg-gradient-to-br from-zinc-900/80 via-zinc-900/60 to-zinc-800/40 backdrop-blur-xl border border-white/10 rounded-3xl overflow-hidden">
            {/* Top accent line */}
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-red-500 to-transparent" />
            
            <div className="p-6 md:p-8">
              <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6">
                {/* Left: Player Info */}
                <div className="space-y-4">
                  {/* Name with glow */}
                  <div className="space-y-2">
                    <h1 className="text-3xl md:text-4xl font-bold text-white drop-shadow-[0_0_30px_rgba(239,68,68,0.3)]">
                      {player.name}
                    </h1>
                    <div className="flex items-center gap-2 flex-wrap">
                      <Badge className="bg-red-500/20 text-red-400 border-red-500/30">
                        {player.school}
                      </Badge>
                      <Badge className="bg-zinc-800 text-zinc-300 border-zinc-700">
                        {player.uniDivision}
                      </Badge>
                      <Badge className="bg-zinc-800 text-zinc-300 border-zinc-700">
                        {player.clubDivision}조
                      </Badge>
                    </div>
                  </div>
                </div>

                {/* Right: Rating Display */}
                <div className="flex items-center gap-8">
                  <div className="text-center">
                    <div className="font-mono text-5xl md:text-6xl font-bold text-white drop-shadow-[0_0_40px_rgba(239,68,68,0.4)]">
                      {player.rating}
                    </div>
                    <div className="text-xs text-zinc-500 uppercase tracking-wider mt-1">레이팅</div>
                  </div>
                  <div className="w-px h-16 bg-gradient-to-b from-transparent via-white/10 to-transparent" />
                  <div className="text-center">
                    <div className="font-mono text-4xl md:text-5xl font-bold text-zinc-300">
                      {player.winRate}%
                    </div>
                    <div className="text-xs text-zinc-500 uppercase tracking-wider mt-1">승률</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Grid - Bento Style */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <div className="bg-zinc-900/50 backdrop-blur-xl border border-white/5 rounded-2xl p-5 text-center">
            <div className="font-mono text-3xl font-bold text-white">{player.totalMatches}</div>
            <div className="text-xs text-zinc-500 mt-1">총 경기</div>
          </div>
          <div className="bg-zinc-900/50 backdrop-blur-xl border border-white/5 rounded-2xl p-5 text-center">
            <div className="font-mono text-3xl font-bold text-green-400">{player.wins}</div>
            <div className="text-xs text-zinc-500 mt-1">승</div>
          </div>
          <div className="bg-zinc-900/50 backdrop-blur-xl border border-white/5 rounded-2xl p-5 text-center">
            <div className="font-mono text-3xl font-bold text-red-400">{player.losses}</div>
            <div className="text-xs text-zinc-500 mt-1">패</div>
          </div>
          <div className="bg-zinc-900/50 backdrop-blur-xl border border-white/5 rounded-2xl p-5 text-center">
            <div className={`font-mono text-3xl font-bold ${ratingTrend.color}`}>
              {player.ratingChange > 0 ? "+" : ""}{player.ratingChange}
            </div>
            <div className="text-xs text-zinc-500 mt-1">레이팅 변동</div>
          </div>
        </div>

        {/* Rating Trend */}
        <div className="bg-zinc-900/50 backdrop-blur-xl border border-white/5 rounded-3xl p-6">
          <div className="flex items-center gap-2 text-zinc-500 mb-4">
            <Target className="w-4 h-4 text-red-500" />
            <span className="text-sm font-medium uppercase tracking-wider">레이팅 추세</span>
          </div>
          <div className="flex items-center gap-4 p-4 bg-zinc-800/50 rounded-2xl border border-white/5">
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
              player.ratingChange > 0 ? "bg-green-500/10" : player.ratingChange < 0 ? "bg-red-500/10" : "bg-zinc-800"
            }`}>
              <TrendIcon className={`w-6 h-6 ${ratingTrend.color}`} />
            </div>
            <div>
              <div className="font-medium text-white">
                이번 달 {ratingTrend.label} 추세
              </div>
              <div className="text-sm text-zinc-500">
                {player.ratingChange !== 0 
                  ? `${Math.abs(player.ratingChange)}점 ${player.ratingChange > 0 ? "상승" : "하락"}`
                  : "변동 없음"
                }
              </div>
            </div>
          </div>
        </div>

        {/* Recent Matches */}
        <div className="bg-zinc-900/50 backdrop-blur-xl border border-white/5 rounded-3xl p-6">
          <div className="flex items-center gap-2 text-zinc-500 mb-4">
            <Calendar className="w-4 h-4 text-red-500" />
            <span className="text-sm font-medium uppercase tracking-wider">최근 경기</span>
          </div>
          {matches.length > 0 ? (
            <div className="space-y-3">
              {matches.map((match) => {
                const opponentId = match.isWin ? match.loserId : match.winnerId
                const opponentName = match.isWin ? match.loserName : match.winnerName
                const displayScore = match.isWin 
                  ? match.score 
                  : match.score.split(":").reverse().join(":")

                return (
                  <div
                    key={match.id}
                    className="flex items-center justify-between p-4 bg-zinc-800/50 rounded-2xl border border-white/5 hover:border-white/10 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <Badge 
                        className={match.isWin 
                          ? "bg-green-500/20 text-green-400 border-green-500/30" 
                          : "bg-zinc-700/50 text-zinc-400 border-zinc-600"
                        }
                      >
                        {match.isWin ? "승" : "패"}
                      </Badge>
                      <div>
                        <Link
                          href={`/players/${opponentId}`}
                          className="font-medium text-white hover:text-red-400 transition-colors"
                        >
                          vs {opponentName}
                        </Link>
                        <div className="text-xs text-zinc-500">
                          {new Date(match.date).toLocaleDateString("ko-KR", {
                            month: "short",
                            day: "numeric",
                          })}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-mono font-bold text-white">{displayScore}</div>
                      <div
                        className={`text-xs font-mono ${
                          match.isWin ? "text-green-400" : "text-red-400"
                        }`}
                      >
                        {match.isWin ? "+" : "-"}{match.ratingChange}
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          ) : (
            <div className="text-center py-8 text-zinc-500">
              최근 경기 기록이 없습니다.
            </div>
          )}
        </div>

        {/* Compare Button */}
        <Link href={`/compare?playerA=${player.id}`}>
          <Button className="w-full bg-red-500 hover:bg-red-600 text-white rounded-2xl h-14 text-base font-medium shadow-lg shadow-red-500/20">
            <Swords className="w-5 h-5 mr-2" />
            다른 선수와 비교하기
          </Button>
        </Link>
      </div>
    </PageLayout>
  )
}
