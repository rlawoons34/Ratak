"use client"

import { useState, useEffect, Suspense } from "react"
import { useSearchParams } from "next/navigation"
import { PageLayout } from "@/components/page-layout"
import { Badge } from "@/components/ui/badge"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Brain, Swords, Users, Zap } from "lucide-react"
import {
  players,
  calculateWinProbability,
  getHeadToHead,
  getCommonOpponents,
} from "@/lib/data"

function CompareContent() {
  const searchParams = useSearchParams()
  const [playerAId, setPlayerAId] = useState<string>("")
  const [playerBId, setPlayerBId] = useState<string>("")

  useEffect(() => {
    const paramA = searchParams.get("playerA")
    if (paramA) setPlayerAId(paramA)
  }, [searchParams])

  const playerA = players.find((p) => p.id === playerAId)
  const playerB = players.find((p) => p.id === playerBId)

  const winProbA = playerA && playerB 
    ? calculateWinProbability(playerA.rating, playerB.rating) 
    : 50
  const winProbB = 100 - winProbA

  const h2h = playerA && playerB ? getHeadToHead(playerAId, playerBId) : null
  const commonOpponents = playerA && playerB 
    ? getCommonOpponents(playerAId, playerBId) 
    : []

  return (
    <div className="container mx-auto px-4 space-y-6">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-2xl md:text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-white to-zinc-400">
          선수 비교
        </h1>
        <p className="text-sm text-zinc-500">
          AI 승률 예측과 상대 전적을 비교합니다
        </p>
      </div>

      {/* Player Selectors */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-sm font-medium text-zinc-400 uppercase tracking-wider">Player A</label>
          <Select value={playerAId} onValueChange={setPlayerAId}>
            <SelectTrigger className="w-full bg-zinc-900/50 border-white/5 text-white rounded-xl h-12 backdrop-blur-xl">
              <SelectValue placeholder="선수 선택..." />
            </SelectTrigger>
            <SelectContent className="bg-zinc-900 border-white/10">
              {players
                .filter((p) => p.id !== playerBId)
                .map((player) => (
                  <SelectItem key={player.id} value={player.id}>
                    {player.name} ({player.schoolShort}) - {player.rating}
                  </SelectItem>
                ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium text-zinc-400 uppercase tracking-wider">Player B</label>
          <Select value={playerBId} onValueChange={setPlayerBId}>
            <SelectTrigger className="w-full bg-zinc-900/50 border-white/5 text-white rounded-xl h-12 backdrop-blur-xl">
              <SelectValue placeholder="선수 선택..." />
            </SelectTrigger>
            <SelectContent className="bg-zinc-900 border-white/10">
              {players
                .filter((p) => p.id !== playerAId)
                .map((player) => (
                  <SelectItem key={player.id} value={player.id}>
                    {player.name} ({player.schoolShort}) - {player.rating}
                  </SelectItem>
                ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {playerA && playerB ? (
        <>
          {/* Split Screen VS Display */}
          <div className="relative">
            {/* Glow effects */}
            <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1/3 h-full bg-red-500/10 blur-3xl rounded-full" />
            <div className="absolute right-0 top-1/2 -translate-y-1/2 w-1/3 h-full bg-blue-500/10 blur-3xl rounded-full" />
            
            <div className="relative bg-zinc-900/50 backdrop-blur-xl border border-white/5 rounded-3xl overflow-hidden">
              <div className="grid grid-cols-2 relative">
                {/* Player A Side */}
                <div className="p-6 md:p-8 text-center border-r border-white/5">
                  <div className="space-y-4">
                    <div className="text-lg md:text-xl font-bold text-white">{playerA.name}</div>
                    <div className="font-mono text-5xl md:text-7xl font-bold text-red-400 drop-shadow-[0_0_30px_rgba(239,68,68,0.4)]">
                      {winProbA}%
                    </div>
                    <div className="font-mono text-2xl text-zinc-400">{playerA.rating}</div>
                    <Badge className="bg-zinc-800 text-zinc-300 border-zinc-700">{playerA.schoolShort}</Badge>
                  </div>
                </div>

                {/* VS Divider */}
                <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10">
                  <div className="relative">
                    <div className="absolute inset-0 bg-red-500/50 blur-xl rounded-full" />
                    <div className="relative w-16 h-16 md:w-20 md:h-20 bg-gradient-to-br from-red-500 to-red-600 rounded-full flex items-center justify-center shadow-lg shadow-red-500/30">
                      <span className="text-white font-bold text-lg md:text-xl">VS</span>
                    </div>
                  </div>
                </div>
                
                {/* Glowing line */}
                <div className="absolute left-1/2 top-0 bottom-0 w-px -translate-x-1/2">
                  <div className="h-full bg-gradient-to-b from-transparent via-red-500/50 to-transparent" />
                </div>

                {/* Player B Side */}
                <div className="p-6 md:p-8 text-center">
                  <div className="space-y-4">
                    <div className="text-lg md:text-xl font-bold text-white">{playerB.name}</div>
                    <div className="font-mono text-5xl md:text-7xl font-bold text-blue-400 drop-shadow-[0_0_30px_rgba(59,130,246,0.4)]">
                      {winProbB}%
                    </div>
                    <div className="font-mono text-2xl text-zinc-400">{playerB.rating}</div>
                    <Badge className="bg-zinc-800 text-zinc-300 border-zinc-700">{playerB.schoolShort}</Badge>
                  </div>
                </div>
              </div>

              {/* AI Prediction footer */}
              <div className="px-6 py-4 border-t border-white/5 bg-zinc-900/30">
                <div className="flex items-center justify-center gap-2 text-sm text-zinc-500">
                  <Brain className="w-4 h-4 text-red-500" />
                  <span>Elo 레이팅 기반 AI 승률 예측</span>
                </div>
              </div>
            </div>
          </div>

          {/* Probability Bar */}
          <div className="bg-zinc-900/50 backdrop-blur-xl border border-white/5 rounded-2xl p-4">
            <div className="relative h-4 rounded-full overflow-hidden bg-blue-500/20">
              <div
                className="absolute left-0 top-0 h-full bg-gradient-to-r from-red-600 to-red-500 transition-all duration-700 ease-out"
                style={{ width: `${winProbA}%` }}
              />
            </div>
            <div className="flex justify-between mt-2 text-xs text-zinc-500 font-mono">
              <span>{playerA.name}</span>
              <span>{playerB.name}</span>
            </div>
          </div>

          {/* Head-to-Head */}
          <div className="bg-zinc-900/50 backdrop-blur-xl border border-white/5 rounded-3xl p-6">
            <div className="flex items-center gap-2 text-zinc-500 mb-6">
              <Swords className="w-4 h-4 text-red-500" />
              <span className="text-sm font-medium uppercase tracking-wider">직접 대결 기록</span>
            </div>
            {h2h && (h2h.aWins > 0 || h2h.bWins > 0) ? (
              <div className="space-y-4">
                <div className="flex items-center justify-center gap-8 md:gap-16">
                  <div className="text-center">
                    <div className="font-mono text-5xl md:text-6xl font-bold text-red-400">
                      {h2h.aWins}
                    </div>
                    <div className="text-sm text-zinc-500 mt-2">
                      {playerA.name}
                    </div>
                  </div>
                  <div className="text-3xl text-zinc-600">:</div>
                  <div className="text-center">
                    <div className="font-mono text-5xl md:text-6xl font-bold text-blue-400">
                      {h2h.bWins}
                    </div>
                    <div className="text-sm text-zinc-500 mt-2">
                      {playerB.name}
                    </div>
                  </div>
                </div>
                {h2h.aWins !== h2h.bWins && (
                  <p className="text-sm text-center text-zinc-500">
                    {h2h.aWins > h2h.bWins ? playerA.name : playerB.name}이(가){" "}
                    <span className="text-white">{Math.abs(h2h.aWins - h2h.bWins)}경기</span> 앞서고 있습니다
                  </p>
                )}
              </div>
            ) : (
              <div className="text-center py-8 text-zinc-500">
                직접 대결 기록이 없습니다
              </div>
            )}
          </div>

          {/* Common Opponents - Network Style */}
          <div className="bg-zinc-900/50 backdrop-blur-xl border border-white/5 rounded-3xl p-6">
            <div className="flex items-center gap-2 text-zinc-500 mb-6">
              <Users className="w-4 h-4 text-red-500" />
              <span className="text-sm font-medium uppercase tracking-wider">공통 상대 분석</span>
              <Zap className="w-3 h-3 text-yellow-500 ml-1" />
              <span className="text-xs text-zinc-600">Triangle Logic</span>
            </div>
            {commonOpponents.length > 0 ? (
              <div className="space-y-4">
                {/* Visual Network Nodes */}
                <div className="flex items-center justify-center gap-4 py-4 mb-4">
                  <div className="w-12 h-12 rounded-full bg-red-500/20 border border-red-500/30 flex items-center justify-center">
                    <span className="text-xs text-red-400 font-bold">A</span>
                  </div>
                  <div className="flex-1 max-w-32 h-px bg-gradient-to-r from-red-500/30 via-zinc-500/30 to-blue-500/30" />
                  <div className="w-10 h-10 rounded-full bg-zinc-800 border border-zinc-700 flex items-center justify-center">
                    <span className="text-xs text-zinc-400">{commonOpponents.length}</span>
                  </div>
                  <div className="flex-1 max-w-32 h-px bg-gradient-to-r from-zinc-500/30 via-zinc-500/30 to-blue-500/30" />
                  <div className="w-12 h-12 rounded-full bg-blue-500/20 border border-blue-500/30 flex items-center justify-center">
                    <span className="text-xs text-blue-400 font-bold">B</span>
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow className="border-white/5 hover:bg-transparent">
                        <TableHead className="text-zinc-500">상대</TableHead>
                        <TableHead className="text-center text-red-400">
                          vs {playerA.name}
                        </TableHead>
                        <TableHead className="text-center text-blue-400">
                          vs {playerB.name}
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {commonOpponents.map(({ opponent, aResult, bResult }) => (
                        <TableRow key={opponent.id} className="border-white/5 hover:bg-white/5">
                          <TableCell>
                            <div className="font-medium text-white">{opponent.name}</div>
                            <div className="text-xs text-zinc-500">
                              {opponent.schoolShort}
                            </div>
                          </TableCell>
                          <TableCell className="text-center">
                            <Badge
                              className={
                                aResult.wins > aResult.losses
                                  ? "bg-green-500/20 text-green-400 border-green-500/30"
                                  : aResult.wins < aResult.losses
                                  ? "bg-red-500/20 text-red-400 border-red-500/30"
                                  : "bg-zinc-800 text-zinc-400 border-zinc-700"
                              }
                            >
                              {aResult.wins}승 {aResult.losses}패
                            </Badge>
                          </TableCell>
                          <TableCell className="text-center">
                            <Badge
                              className={
                                bResult.wins > bResult.losses
                                  ? "bg-green-500/20 text-green-400 border-green-500/30"
                                  : bResult.wins < bResult.losses
                                  ? "bg-red-500/20 text-red-400 border-red-500/30"
                                  : "bg-zinc-800 text-zinc-400 border-zinc-700"
                              }
                            >
                              {bResult.wins}승 {bResult.losses}패
                            </Badge>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </div>
            ) : (
              <div className="text-center py-8 text-zinc-500">
                공통 상대가 없습니다
              </div>
            )}
          </div>

          {/* Detailed Comparison */}
          <div className="bg-zinc-900/50 backdrop-blur-xl border border-white/5 rounded-3xl p-6">
            <div className="flex items-center gap-2 text-zinc-500 mb-6">
              <span className="text-sm font-medium uppercase tracking-wider">상세 비교</span>
            </div>
            <div className="space-y-4">
              <ComparisonRow
                label="레이팅"
                valueA={playerA.rating}
                valueB={playerB.rating}
                higherIsBetter
              />
              <ComparisonRow
                label="승률"
                valueA={playerA.winRate}
                valueB={playerB.winRate}
                suffix="%"
                higherIsBetter
              />
              <ComparisonRow
                label="총 경기"
                valueA={playerA.totalMatches}
                valueB={playerB.totalMatches}
              />
              <ComparisonRow
                label="레이팅 변동"
                valueA={playerA.ratingChange}
                valueB={playerB.ratingChange}
                showSign
                higherIsBetter
              />
            </div>
          </div>
        </>
      ) : (
        <div className="bg-zinc-900/50 backdrop-blur-xl border border-white/5 rounded-3xl p-12 text-center">
          <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-zinc-800 flex items-center justify-center">
            <Swords className="w-8 h-8 text-zinc-600" />
          </div>
          <p className="text-zinc-500">비교할 두 선수를 선택해주세요</p>
        </div>
      )}
    </div>
  )
}

function ComparisonRow({
  label,
  valueA,
  valueB,
  suffix = "",
  showSign = false,
  higherIsBetter = false,
}: {
  label: string
  valueA: number
  valueB: number
  suffix?: string
  showSign?: boolean
  higherIsBetter?: boolean
}) {
  const formatValue = (v: number) => {
    if (showSign && v > 0) return `+${v}${suffix}`
    return `${v}${suffix}`
  }

  const getHighlight = (isA: boolean) => {
    if (!higherIsBetter) return "text-white"
    if (valueA === valueB) return "text-white"
    const isHigher = isA ? valueA > valueB : valueB > valueA
    return isHigher ? "text-red-400 font-bold" : "text-zinc-500"
  }

  return (
    <div className="flex items-center justify-between py-3 border-b border-white/5 last:border-0">
      <span className={`font-mono text-lg ${getHighlight(true)}`}>{formatValue(valueA)}</span>
      <span className="text-sm text-zinc-600 flex-1 text-center">{label}</span>
      <span className={`font-mono text-lg ${getHighlight(false)}`}>{formatValue(valueB)}</span>
    </div>
  )
}

export default function ComparePage() {
  return (
    <PageLayout>
      <Suspense fallback={
        <div className="container mx-auto px-4 py-6">
          <div className="bg-zinc-900/50 backdrop-blur-xl border border-white/5 rounded-3xl p-12 text-center">
            <div className="w-8 h-8 mx-auto border-2 border-red-500 border-t-transparent rounded-full animate-spin" />
          </div>
        </div>
      }>
        <CompareContent />
      </Suspense>
    </PageLayout>
  )
}
