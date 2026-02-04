"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import Link from "next/link"
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
import { TrendingUp, Trophy, Zap } from "lucide-react"
import { players, getBiggestUpset, getTopRiser } from "@/lib/data"
import { TypewriterText } from "@/components/typewriter-text"

export default function DashboardPage() {
  const [schoolFilter, setSchoolFilter] = useState<string>("all")
  const [uniDivisionFilter, setUniDivisionFilter] = useState<string>("all")
  const [clubDivisionFilter, setClubDivisionFilter] = useState<string>("all")

  const biggestUpset = getBiggestUpset()
  const topRiser = getTopRiser()

  const schools = [...new Set(players.map((p) => p.school))]
  const uniDivisions = [...new Set(players.map((p) => p.uniDivision))]
  const clubDivisions = [...new Set(players.map((p) => p.clubDivision))]

  const filteredPlayers = players
    .filter((p) => schoolFilter === "all" || p.school === schoolFilter)
    .filter((p) => uniDivisionFilter === "all" || p.uniDivision === uniDivisionFilter)
    .filter((p) => clubDivisionFilter === "all" || p.clubDivision === clubDivisionFilter)
    .sort((a, b) => b.rating - a.rating)

  return (
    <PageLayout>
      <div className="container mx-auto px-4 space-y-8">
        {/* Hero Section with Particles */}
        <section className="relative py-16 md:py-24 overflow-hidden">
          {/* Floating particles */}
          <div className="absolute inset-0 pointer-events-none">
            <div className="particle absolute top-1/4 left-1/4 w-1 h-1 bg-red-500/40 rounded-full" />
            <div className="particle-delayed absolute top-1/3 right-1/3 w-1.5 h-1.5 bg-white/20 rounded-full" />
            <div className="particle-slow absolute bottom-1/4 left-1/2 w-1 h-1 bg-red-400/30 rounded-full" />
            <div className="particle absolute top-1/2 right-1/4 w-0.5 h-0.5 bg-white/30 rounded-full" />
            <div className="particle-delayed absolute bottom-1/3 left-1/3 w-1 h-1 bg-red-500/20 rounded-full" />
          </div>
          
          <div className="relative text-center space-y-6">
            {/* TypewriterText를 motion.h1으로 교체하여 줄바꿈과 색상을 강제 적용 */}
            <motion.h1
              className="text-4xl md:text-6xl font-extrabold tracking-tight leading-tight text-white whitespace-pre-wrap"
              initial="hidden"
              animate="visible"
              variants={{
                visible: { transition: { staggerChildren: 0.05, delayChildren: 0.3 } },
              }}
            >
              {/* 첫 번째 줄: '직감이 아닌' + '데이터'(빨강) + '로,' */}
              <span className="block">
                {"직감이 아닌 ".split("").map((char, i) => (
                  <motion.span key={`line1-${i}`} variants={{ hidden: { opacity: 0, y: 10 }, visible: { opacity: 1, y: 0 } }}>
                    {char}
                  </motion.span>
                ))}
                <span className="text-red-600">
                  {"데이터".split("").map((char, i) => (
                    <motion.span key={`highlight-${i}`} variants={{ hidden: { opacity: 0, y: 10 }, visible: { opacity: 1, y: 0 } }}>
                      {char}
                    </motion.span>
                  ))}
                </span>
                {"로,".split("").map((char, i) => (
                  <motion.span key={`line1-end-${i}`} variants={{ hidden: { opacity: 0, y: 10 }, visible: { opacity: 1, y: 0 } }}>
                    {char}
                  </motion.span>
                ))}
              </span>

              {/* 두 번째 줄: 강제 줄바꿈 적용 */}
              <span className="block mt-2 md:mt-4">
                {"당신의 탁구를 ".split("").map((char, i) => (
                  <motion.span key={`line2-${i}`} variants={{ hidden: { opacity: 0, y: 10 }, visible: { opacity: 1, y: 0 } }}>
                    {char}
                  </motion.span>
                ))}
                <span className="text-red-600">
                  {"증명".split("").map((char, i) => (
                    <motion.span key={`highlight2-${i}`} variants={{ hidden: { opacity: 0, y: 10 }, visible: { opacity: 1, y: 0 } }}>
                      {char}
                    </motion.span>
                  ))}
                </span>
                {"하세요.".split("").map((char, i) => (
                  <motion.span key={`line2-end-${i}`} variants={{ hidden: { opacity: 0, y: 10 }, visible: { opacity: 1, y: 0 } }}>
                    {char}
                  </motion.span>
                ))}
              </span>
            </motion.h1>

            {/* 아래 부분은 기존 코드 유지 */}
            <p className="text-lg md:text-xl text-zinc-400 max-w-2xl mx-auto">
              대학 탁구의 새로운 기준, TakuRating
            </p>
            <div className="flex items-center justify-center gap-2 text-sm text-zinc-500">
              <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
              <span>실시간 레이팅 업데이트</span>
            </div>
          </div>
        </section>

        {/* Bento Grid - Monthly Insights */}
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
                        href={`/players/${biggestUpset.winnerId}`}
                        className="text-2xl md:text-3xl font-bold text-white hover:text-red-400 transition-colors"
                      >
                        {biggestUpset.winnerName}
                      </Link>
                      <Badge className="bg-green-500/20 text-green-400 border-green-500/30">승</Badge>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="font-mono text-4xl md:text-5xl font-thin text-zinc-300">
                        {biggestUpset.winnerRatingBefore}
                      </span>
                      <span className="text-zinc-600">vs</span>
                      <span className="font-mono text-4xl md:text-5xl font-thin text-zinc-500">
                        {biggestUpset.loserRatingBefore}
                      </span>
                    </div>
                    <Link
                      href={`/players/${biggestUpset.loserId}`}
                      className="text-lg text-zinc-400 hover:text-white transition-colors"
                    >
                      vs {biggestUpset.loserName}
                    </Link>
                  </div>
                  <div className="pt-4 border-t border-white/5">
                    <p className="text-sm text-zinc-500">
                      레이팅 차이 <span className="text-red-400 font-mono">{biggestUpset.loserRatingBefore - biggestUpset.winnerRatingBefore}</span>점을 극복한 승리
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
                      <Badge className="bg-zinc-800 text-zinc-300 border-zinc-700">{topRiser.schoolShort}</Badge>
                      <span className="text-zinc-500">현재</span>
                      <span className="font-mono text-2xl text-zinc-300">{topRiser.rating}</span>
                    </div>
                  </div>
                  <div className="flex items-baseline gap-2">
                    <span className="font-mono text-5xl md:text-6xl font-thin text-green-400">
                      +{topRiser.ratingChange}
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

        {/* Ranking Section - Glass Panel */}
        <section className="relative">
          <div className="absolute inset-0 bg-gradient-to-b from-red-500/5 to-transparent rounded-3xl blur-2xl" />
          <div className="relative bg-zinc-900/50 backdrop-blur-xl border border-white/5 rounded-3xl overflow-hidden">
            {/* Header */}
            <div className="p-6 border-b border-white/5">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-red-500/10 rounded-xl flex items-center justify-center">
                    <Trophy className="w-5 h-5 text-red-500" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-white to-zinc-400">
                      전체 랭킹
                    </h2>
                    <p className="text-sm text-zinc-500">{filteredPlayers.length}명의 선수</p>
                  </div>
                </div>
                
                {/* Filters */}
                <div className="flex flex-wrap gap-2">
                  <Select value={schoolFilter} onValueChange={setSchoolFilter}>
                    <SelectTrigger className="w-[140px] bg-zinc-800/50 border-white/5 text-zinc-300 rounded-xl">
                      <SelectValue placeholder="학교" />
                    </SelectTrigger>
                    <SelectContent className="bg-zinc-900 border-white/10">
                      <SelectItem value="all">전체 학교</SelectItem>
                      {schools.map((school) => (
                        <SelectItem key={school} value={school}>
                          {school}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <Select value={uniDivisionFilter} onValueChange={setUniDivisionFilter}>
                    <SelectTrigger className="w-[120px] bg-zinc-800/50 border-white/5 text-zinc-300 rounded-xl">
                      <SelectValue placeholder="대학부" />
                    </SelectTrigger>
                    <SelectContent className="bg-zinc-900 border-white/10">
                      <SelectItem value="all">전체 대학부</SelectItem>
                      {uniDivisions.map((div) => (
                        <SelectItem key={div} value={div}>
                          {div}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <Select value={clubDivisionFilter} onValueChange={setClubDivisionFilter}>
                    <SelectTrigger className="w-[120px] bg-zinc-800/50 border-white/5 text-zinc-300 rounded-xl">
                      <SelectValue placeholder="동아리부" />
                    </SelectTrigger>
                    <SelectContent className="bg-zinc-900 border-white/10">
                      <SelectItem value="all">전체 동아리</SelectItem>
                      {clubDivisions.map((div) => (
                        <SelectItem key={div} value={div}>
                          {div}조
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="border-white/5 hover:bg-transparent">
                    <TableHead className="text-zinc-500 w-16">#</TableHead>
                    <TableHead className="text-zinc-500">이름</TableHead>
                    <TableHead className="text-zinc-500">부</TableHead>
                    <TableHead className="text-zinc-500 text-right font-mono">레이팅</TableHead>
                    <TableHead className="text-zinc-500 text-right">변동</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredPlayers.map((player, index) => (
                    <TableRow 
                      key={player.id} 
                      className="border-white/5 hover:bg-white/5 transition-colors"
                    >
                      <TableCell className="font-mono text-zinc-600">
                        {index + 1}
                      </TableCell>
                      <TableCell>
                        <Link
                          href={`/players/${player.id}`}
                          className="flex items-center gap-3 group"
                        >
                          <span className="font-medium text-white group-hover:text-red-400 transition-colors">
                            {player.name}
                          </span>
                          <Badge variant="outline" className="text-xs bg-transparent border-zinc-700 text-zinc-500 hidden sm:inline-flex">
                            {player.schoolShort}
                          </Badge>
                        </Link>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Badge className="bg-zinc-800/80 text-zinc-400 border-zinc-700 text-xs">
                            {player.uniDivision}
                          </Badge>
                          <span className="text-xs text-zinc-600 hidden sm:inline">
                            {player.clubDivision}조
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <span className="font-mono text-lg font-semibold text-white">
                          {player.rating}
                        </span>
                      </TableCell>
                      <TableCell className="text-right">
                        <span
                          className={`font-mono font-medium ${
                            player.ratingChange > 0
                              ? "text-green-400"
                              : player.ratingChange < 0
                              ? "text-red-400"
                              : "text-zinc-600"
                          }`}
                        >
                          {player.ratingChange > 0 ? "+" : ""}
                          {player.ratingChange}
                        </span>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            {filteredPlayers.length === 0 && (
              <div className="text-center py-12 text-zinc-500">
                선택한 필터에 해당하는 선수가 없습니다.
              </div>
            )}
          </div>
        </section>
      </div>
    </PageLayout>
  )
}
