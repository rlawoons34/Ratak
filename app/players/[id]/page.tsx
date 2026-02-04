"use client"

import Link from "next/link"
import { ArrowLeft, Trophy, TrendingUp, TrendingDown } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { players } from "@/lib/mock-data"

interface PlayerDetailPageProps {
  params: {
    id: string
  }
}

export default function PlayerDetailPage({ params }: PlayerDetailPageProps) {
  const player = players.find((p) => p.id === params.id)

  if (!player) {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
        <div className="text-center space-y-4">
          <Trophy className="w-16 h-16 mx-auto text-zinc-600" />
          <h1 className="text-2xl font-bold text-white">선수를 찾을 수 없습니다</h1>
          <Link href="/players">
            <Button variant="outline" className="mt-4">
              <ArrowLeft className="w-4 h-4 mr-2" />
              목록으로 돌아가기
            </Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-zinc-950">
      <div className="container mx-auto px-4 space-y-6 py-8">
        {/* Back Button */}
        <Link href="/players">
          <Button variant="ghost" className="text-zinc-400 hover:text-white">
            <ArrowLeft className="w-4 h-4 mr-2" />
            목록으로
          </Button>
        </Link>

        {/* Player Header */}
        <div className="bg-zinc-900/50 backdrop-blur-xl border border-white/5 rounded-3xl p-8">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="space-y-4">
              <h1 className="text-4xl font-bold text-white">{player.name}</h1>
              <div className="flex items-center gap-3 flex-wrap">
                <Badge className="bg-zinc-800 text-zinc-300 border-zinc-700">
                  {player.school}
                </Badge>
                <Badge className="bg-zinc-800 text-zinc-400 border-zinc-700">
                  {player.uniDivision}
                </Badge>
                <Badge className="bg-zinc-800 text-zinc-400 border-zinc-700">
                  {player.clubDivision}조
                </Badge>
              </div>
            </div>

            <div className="text-center md:text-right">
              <div className="text-sm text-zinc-500 mb-2">현재 레이팅</div>
              <div className="font-mono text-5xl font-bold text-red-400">
                {player.rating}
              </div>
              <div
                className={`text-lg font-mono font-semibold mt-2 ${
                  player.ratingChange > 0
                    ? "text-green-400"
                    : player.ratingChange < 0
                    ? "text-red-400"
                    : "text-zinc-500"
                }`}
              >
                {player.ratingChange > 0 ? <TrendingUp className="inline w-5 h-5 mr-1" /> : <TrendingDown className="inline w-5 h-5 mr-1" />}
                {player.ratingChange > 0 ? "+" : ""}
                {player.ratingChange}
              </div>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-zinc-900/50 backdrop-blur-xl border border-white/5 rounded-2xl p-6">
            <div className="text-sm text-zinc-500 mb-2">승률</div>
            <div className="font-mono text-3xl font-bold text-white">
              {player.winRate}%
            </div>
          </div>
          <div className="bg-zinc-900/50 backdrop-blur-xl border border-white/5 rounded-2xl p-6">
            <div className="text-sm text-zinc-500 mb-2">총 경기</div>
            <div className="font-mono text-3xl font-bold text-white">
              {player.totalMatches}
            </div>
          </div>
          <div className="bg-zinc-900/50 backdrop-blur-xl border border-white/5 rounded-2xl p-6">
            <div className="text-sm text-zinc-500 mb-2">전적</div>
            <div className="font-mono text-3xl font-bold text-white">
              {player.wins}승 {player.losses}패
            </div>
          </div>
        </div>

        {/* Work in Progress */}
        <div className="bg-zinc-900/50 backdrop-blur-xl border border-white/5 rounded-3xl p-12 text-center">
          <Trophy className="w-16 h-16 mx-auto text-zinc-600 mb-4" />
          <h3 className="text-xl font-bold text-white mb-2">
            경기 히스토리 그래프 개발 중
          </h3>
          <p className="text-zinc-500">
            레이팅 변화 그래프와 최근 경기 기록이 곧 추가됩니다.
          </p>
        </div>
      </div>
    </div>
  )
}
