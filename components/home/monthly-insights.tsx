"use client"

import Link from "next/link"
import { TrendingUp, Zap } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import type { Database } from "@/types/database"

type PlayerStatistics = Database['public']['Views']['player_statistics']['Row']

interface MonthlyInsightsProps {
  biggestUpset: PlayerStatistics | null
  topRiser: PlayerStatistics | null
}

export function MonthlyInsights({ biggestUpset, topRiser }: MonthlyInsightsProps) {
  return (
    <section className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {/* Biggest Upset - Large Tile */}
      <div className="relative group">
        <div className="absolute inset-0 bg-red-500/10 rounded-3xl blur-xl opacity-50 group-hover:opacity-75 transition-opacity" />
        <div className="relative bg-zinc-900/50 backdrop-blur-xl border border-white/5 rounded-3xl p-6 md:p-8 h-full">
          <div className="flex items-center gap-2 text-zinc-500 mb-4">
            <Zap className="w-4 h-4 text-red-500" />
            <span className="text-sm font-medium uppercase tracking-wider">이달의 이변</span>
          </div>
          {biggestUpset ? (
            <div className="space-y-6">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Link 
                    href={`/players/${biggestUpset.id}`}
                    className="text-2xl md:text-3xl font-bold text-white hover:text-red-400 transition-colors"
                  >
                    {biggestUpset.name}
                  </Link>
                  <Badge className="bg-green-500/20 text-green-400 border-green-500/30">급상승</Badge>
                </div>
                <div className="flex items-center gap-4">
                  <span className="font-mono text-4xl md:text-5xl font-thin text-zinc-300">
                    {biggestUpset.rating}
                  </span>
                  <span className="text-green-400 font-mono text-xl">
                    +{biggestUpset.rating_change_30d}
                  </span>
                </div>
                <div className="text-lg text-zinc-400">
                  {biggestUpset.school_name} · {biggestUpset.uni_division}
                </div>
              </div>
              <div className="pt-4 border-t border-white/5">
                <p className="text-sm text-zinc-500">
                  30일간 <span className="text-red-400 font-mono">+{biggestUpset.rating_change_30d}</span>점 상승
                </p>
              </div>
            </div>
          ) : (
            <p className="text-zinc-500">데이터 없음</p>
          )}
        </div>
      </div>

      {/* Top Riser - Large Tile */}
      <div className="relative group">
        <div className="absolute inset-0 bg-blue-500/5 rounded-3xl blur-xl opacity-50 group-hover:opacity-75 transition-opacity" />
        <div className="relative bg-zinc-900/50 backdrop-blur-xl border border-white/5 rounded-3xl p-6 md:p-8 h-full">
          <div className="flex items-center gap-2 text-zinc-500 mb-4">
            <TrendingUp className="w-4 h-4 text-green-500" />
            <span className="text-sm font-medium uppercase tracking-wider">이달의 상승세</span>
          </div>
          {topRiser ? (
            <div className="space-y-6">
              <div className="space-y-3">
                <Link 
                  href={`/players/${topRiser.id}`}
                  className="text-2xl md:text-3xl font-bold text-white hover:text-red-400 transition-colors block"
                >
                  {topRiser.name}
                </Link>
                <div className="flex items-center gap-3">
                  <Badge className="bg-zinc-800 text-zinc-300 border-zinc-700">{topRiser.school_code}</Badge>
                  <span className="text-zinc-500">현재</span>
                  <span className="font-mono text-2xl text-zinc-300">{topRiser.rating}</span>
                </div>
              </div>
              <div className="flex items-baseline gap-2">
                <span className="font-mono text-5xl md:text-6xl font-thin text-green-400">
                  +{topRiser.rating_change_30d}
                </span>
                <span className="text-zinc-500 text-sm">pts</span>
              </div>
            </div>
          ) : (
            <p className="text-zinc-500">데이터 없음</p>
          )}
        </div>
      </div>
    </section>
  )
}
