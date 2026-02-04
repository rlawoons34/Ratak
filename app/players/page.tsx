"use client"

import { useState } from "react"
import Link from "next/link"
import { Search, ChevronRight } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { players } from "@/lib/mock-data"

export default function PlayersPage() {
  const [search, setSearch] = useState("")

  const filteredPlayers = players
    .filter((p) =>
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.school.toLowerCase().includes(search.toLowerCase())
    )
    .sort((a, b) => b.rating - a.rating)

  return (
    <div className="min-h-screen bg-zinc-950">
      <div className="container mx-auto px-4 space-y-6 py-8">
        {/* Header */}
        <div className="space-y-2">
          <h1 className="text-2xl md:text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-white to-zinc-400">
            선수 목록
          </h1>
          <p className="text-sm text-zinc-500">
            총 {players.length}명의 선수
          </p>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
          <Input
            placeholder="이름 또는 학교로 검색..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-11 h-12 bg-zinc-900/50 border-white/5 rounded-2xl text-white placeholder:text-zinc-500 focus:border-red-500/50 backdrop-blur-xl"
          />
        </div>

        {/* Players List */}
        <div className="space-y-2">
          {filteredPlayers.map((player, index) => (
            <Link key={player.id} href={`/players/${player.id}`}>
              <div className="group bg-zinc-900/50 backdrop-blur-xl border border-white/5 rounded-2xl p-4 hover:border-red-500/20 hover:bg-zinc-900/70 transition-all cursor-pointer">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-sm font-bold ${
                      index < 3 
                        ? "bg-red-500/20 text-red-400 border border-red-500/30" 
                        : "bg-zinc-800 text-zinc-400 border border-zinc-700"
                    }`}>
                      {index + 1}
                    </div>
                    <div>
                      <div className="font-semibold text-white group-hover:text-red-400 transition-colors">
                        {player.name}
                      </div>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge className="bg-zinc-800 text-zinc-400 border-zinc-700 text-xs">
                          {player.schoolShort}
                        </Badge>
                        <span className="text-xs text-zinc-500">
                          승률 {player.winRate}%
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <div className="font-mono font-bold text-xl text-white">
                        {player.rating}
                      </div>
                      <div
                        className={`text-xs font-mono ${
                          player.ratingChange > 0
                            ? "text-green-400"
                            : player.ratingChange < 0
                            ? "text-red-400"
                            : "text-zinc-500"
                        }`}
                      >
                        {player.ratingChange > 0 ? "+" : ""}
                        {player.ratingChange}
                      </div>
                    </div>
                    <ChevronRight className="w-5 h-5 text-zinc-600 group-hover:text-red-400 transition-colors" />
                  </div>
                </div>
              </div>
            </Link>
          ))}

          {filteredPlayers.length === 0 && (
            <div className="text-center py-12 text-zinc-500 bg-zinc-900/50 backdrop-blur-xl border border-white/5 rounded-3xl">
              검색 결과가 없습니다.
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
