"use client"

import { useState } from "react"
import Link from "next/link"
import { PageLayout } from "@/components/page-layout"
import { Badge } from "@/components/ui/badge"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import { School, Users, ChevronDown, Trophy } from "lucide-react"
import { getSchools } from "@/lib/data"

export default function SchoolsPage() {
  const schools = getSchools()
  const [openSchools, setOpenSchools] = useState<Set<string>>(new Set())

  const toggleSchool = (schoolId: string) => {
    const newOpen = new Set(openSchools)
    if (newOpen.has(schoolId)) {
      newOpen.delete(schoolId)
    } else {
      newOpen.add(schoolId)
    }
    setOpenSchools(newOpen)
  }

  const getMedalStyle = (index: number) => {
    if (index === 0) return { icon: <Trophy className="w-5 h-5" />, bg: "bg-yellow-500/20", text: "text-yellow-400", border: "border-yellow-500/30" }
    if (index === 1) return { icon: null, bg: "bg-zinc-400/20", text: "text-zinc-300", border: "border-zinc-400/30" }
    if (index === 2) return { icon: null, bg: "bg-amber-600/20", text: "text-amber-500", border: "border-amber-600/30" }
    return { icon: null, bg: "bg-zinc-800", text: "text-zinc-400", border: "border-zinc-700" }
  }

  return (
    <PageLayout>
      <div className="container mx-auto px-4 space-y-6">
        {/* Header */}
        <div className="space-y-2">
          <h1 className="text-2xl md:text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-white to-zinc-400">
            학교 랭킹
          </h1>
          <p className="text-sm text-zinc-500">
            평균 레이팅 기준 학교 순위
          </p>
        </div>

        {/* Schools List */}
        <div className="space-y-3">
          {schools.map((school, index) => {
            const medalStyle = getMedalStyle(index)
            const isOpen = openSchools.has(school.id)
            
            return (
              <Collapsible
                key={school.id}
                open={isOpen}
                onOpenChange={() => toggleSchool(school.id)}
              >
                <div className={`bg-zinc-900/50 backdrop-blur-xl border rounded-3xl overflow-hidden transition-all ${
                  index < 3 ? "border-red-500/20" : "border-white/5"
                } ${isOpen ? "border-red-500/30" : ""}`}>
                  <CollapsibleTrigger className="w-full">
                    <div className="p-5 cursor-pointer hover:bg-white/5 transition-colors">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className={`w-12 h-12 rounded-xl flex items-center justify-center font-bold ${medalStyle.bg} ${medalStyle.text} border ${medalStyle.border}`}>
                            {medalStyle.icon || (index + 1)}
                          </div>
                          <div className="text-left">
                            <div className="font-semibold text-white flex items-center gap-2">
                              <School className="w-4 h-4 text-red-500" />
                              {school.name}
                            </div>
                            <div className="flex items-center gap-2 mt-1 text-sm text-zinc-500">
                              <Users className="w-3 h-3" />
                              {school.playerCount}명
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-4">
                          <div className="text-right">
                            <div className="font-mono text-2xl font-bold text-red-400">
                              {school.averageRating}
                            </div>
                            <div className="text-xs text-zinc-500">
                              평균 레이팅
                            </div>
                          </div>
                          <ChevronDown
                            className={`w-5 h-5 text-zinc-500 transition-transform ${
                              isOpen ? "rotate-180" : ""
                            }`}
                          />
                        </div>
                      </div>
                    </div>
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <div className="px-5 pb-5">
                      <div className="border-t border-white/5 pt-4">
                        <div className="text-sm font-medium text-zinc-500 uppercase tracking-wider mb-3">
                          소속 선수
                        </div>
                        <div className="space-y-2">
                          {school.players.map((player, playerIndex) => (
                            <Link
                              key={player.id}
                              href={`/players/${player.id}`}
                              className="flex items-center justify-between p-3 bg-zinc-800/50 rounded-xl border border-white/5 hover:border-red-500/20 hover:bg-zinc-800/70 transition-all"
                            >
                              <div className="flex items-center gap-3">
                                <div className="w-7 h-7 rounded-lg bg-zinc-700 flex items-center justify-center text-xs font-medium text-zinc-300">
                                  {playerIndex + 1}
                                </div>
                                <div>
                                  <div className="font-medium text-white">
                                    {player.name}
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <Badge className="bg-zinc-700 text-zinc-300 border-zinc-600 text-xs">
                                      {player.uniDivision}
                                    </Badge>
                                    <span className="text-xs text-zinc-500">
                                      승률 {player.winRate}%
                                    </span>
                                  </div>
                                </div>
                              </div>
                              <div className="text-right">
                                <div className="font-mono font-bold text-white">
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
                            </Link>
                          ))}
                        </div>
                      </div>
                    </div>
                  </CollapsibleContent>
                </div>
              </Collapsible>
            )
          })}
        </div>

        {/* Summary Stats */}
        <div className="bg-zinc-900/50 backdrop-blur-xl border border-white/5 rounded-3xl p-6">
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <div className="font-mono text-3xl font-bold text-white">
                {schools.length}
              </div>
              <div className="text-xs text-zinc-500 mt-1">참가 학교</div>
            </div>
            <div>
              <div className="font-mono text-3xl font-bold text-white">
                {schools.reduce((sum, s) => sum + s.playerCount, 0)}
              </div>
              <div className="text-xs text-zinc-500 mt-1">총 선수</div>
            </div>
            <div>
              <div className="font-mono text-3xl font-bold text-red-400">
                {Math.round(
                  schools.reduce((sum, s) => sum + s.averageRating, 0) /
                    schools.length
                )}
              </div>
              <div className="text-xs text-zinc-500 mt-1">전체 평균</div>
            </div>
          </div>
        </div>
      </div>
    </PageLayout>
  )
}
