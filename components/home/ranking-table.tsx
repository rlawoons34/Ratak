"use client"

import { useState } from "react"
import Link from "next/link"
import { Trophy } from "lucide-react"
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
import type { Database } from "@/types/database"

type PlayerStatistics = Database['public']['Views']['player_statistics']['Row']

interface RankingTableProps {
  players: PlayerStatistics[]
}

export function RankingTable({ players }: RankingTableProps) {
  const [schoolFilter, setSchoolFilter] = useState<string>("all")
  const [uniDivisionFilter, setUniDivisionFilter] = useState<string>("all")
  const [clubDivisionFilter, setClubDivisionFilter] = useState<string>("all")

  const schools = [...new Set(players.map((p) => p.school_name))]
  const uniDivisions = [...new Set(players.map((p) => p.uni_division))]
  const clubDivisions = [...new Set(players.map((p) => p.club_division))]

  const filteredPlayers = players
    .filter((p) => schoolFilter === "all" || p.school_name === schoolFilter)
    .filter((p) => uniDivisionFilter === "all" || p.uni_division === uniDivisionFilter)
    .filter((p) => clubDivisionFilter === "all" || p.club_division === clubDivisionFilter)
    .sort((a, b) => b.rating - a.rating)

  return (
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
                        {player.school_code}
                      </Badge>
                    </Link>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Badge className="bg-zinc-800/80 text-zinc-400 border-zinc-700 text-xs">
                        {player.uni_division}
                      </Badge>
                      <span className="text-xs text-zinc-600 hidden sm:inline">
                        {player.club_division}조
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
                        player.rating_change_30d > 0
                          ? "text-green-400"
                          : player.rating_change_30d < 0
                          ? "text-red-400"
                          : "text-zinc-600"
                      }`}
                    >
                      {player.rating_change_30d > 0 ? "+" : ""}
                      {player.rating_change_30d}
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
  )
}
