"use client"

import { useState } from "react"
import { PageLayout } from "@/components/page-layout"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Badge } from "@/components/ui/badge"
import { CalendarIcon, CheckCircle2, ClipboardEdit, AlertCircle, Zap } from "lucide-react"
import { cn } from "@/lib/utils"
import { format } from "date-fns"
import { ko } from "date-fns/locale"
import { players, matches } from "@/lib/data"

export default function AdminResultsPage() {
  const [winnerId, setWinnerId] = useState<string>("")
  const [loserId, setLoserId] = useState<string>("")
  const [score, setScore] = useState<string>("")
  const [date, setDate] = useState<Date | undefined>(new Date())
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState<string>("")

  const winner = players.find((p) => p.id === winnerId)
  const loser = players.find((p) => p.id === loserId)

  const handleSubmit = () => {
    setError("")
    setSubmitted(false)

    if (!winnerId || !loserId) {
      setError("승자와 패자를 모두 선택해주세요.")
      return
    }

    if (winnerId === loserId) {
      setError("승자와 패자가 같을 수 없습니다.")
      return
    }

    if (!score.match(/^\d:\d$/)) {
      setError("스코어 형식이 올바르지 않습니다. (예: 3:1)")
      return
    }

    if (!date) {
      setError("날짜를 선택해주세요.")
      return
    }

    setSubmitted(true)
    
    setTimeout(() => {
      setWinnerId("")
      setLoserId("")
      setScore("")
      setDate(new Date())
      setSubmitted(false)
    }, 3000)
  }

  const recentMatches = matches.slice(0, 5)

  return (
    <PageLayout>
      <div className="container mx-auto px-4 space-y-6">
        {/* Header */}
        <div className="space-y-2">
          <h1 className="text-2xl md:text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-white to-zinc-400">
            경기 결과 입력
          </h1>
          <p className="text-sm text-zinc-500">
            새로운 경기 결과를 입력하고 레이팅을 업데이트합니다
          </p>
        </div>

        {/* Input Form */}
        <div className="relative">
          <div className="absolute inset-0 bg-red-500/5 rounded-3xl blur-2xl" />
          <div className="relative bg-zinc-900/50 backdrop-blur-xl border border-white/5 rounded-3xl p-6">
            <div className="flex items-center gap-2 text-zinc-500 mb-6">
              <ClipboardEdit className="w-4 h-4 text-red-500" />
              <span className="text-sm font-medium uppercase tracking-wider">경기 결과 입력</span>
            </div>
            
            <div className="space-y-6">
              {/* Winner Select */}
              <div className="space-y-2">
                <Label htmlFor="winner" className="text-zinc-400">승자</Label>
                <Select value={winnerId} onValueChange={setWinnerId}>
                  <SelectTrigger id="winner" className="w-full h-12 bg-zinc-800/50 border-white/5 text-white rounded-xl">
                    <SelectValue placeholder="승자를 선택하세요" />
                  </SelectTrigger>
                  <SelectContent className="bg-zinc-900 border-white/10">
                    {players
                      .filter((p) => p.id !== loserId)
                      .sort((a, b) => a.name.localeCompare(b.name, "ko"))
                      .map((player) => (
                        <SelectItem key={player.id} value={player.id}>
                          {player.name} ({player.schoolShort}) - {player.rating}
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
                {winner && (
                  <div className="flex items-center gap-2 mt-1">
                    <Badge className="bg-green-500/20 text-green-400 border-green-500/30">{winner.school}</Badge>
                    <span className="text-sm text-zinc-500 font-mono">
                      {winner.rating}
                    </span>
                  </div>
                )}
              </div>

              {/* Loser Select */}
              <div className="space-y-2">
                <Label htmlFor="loser" className="text-zinc-400">패자</Label>
                <Select value={loserId} onValueChange={setLoserId}>
                  <SelectTrigger id="loser" className="w-full h-12 bg-zinc-800/50 border-white/5 text-white rounded-xl">
                    <SelectValue placeholder="패자를 선택하세요" />
                  </SelectTrigger>
                  <SelectContent className="bg-zinc-900 border-white/10">
                    {players
                      .filter((p) => p.id !== winnerId)
                      .sort((a, b) => a.name.localeCompare(b.name, "ko"))
                      .map((player) => (
                        <SelectItem key={player.id} value={player.id}>
                          {player.name} ({player.schoolShort}) - {player.rating}
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
                {loser && (
                  <div className="flex items-center gap-2 mt-1">
                    <Badge className="bg-zinc-700 text-zinc-300 border-zinc-600">{loser.school}</Badge>
                    <span className="text-sm text-zinc-500 font-mono">
                      {loser.rating}
                    </span>
                  </div>
                )}
              </div>

              {/* Score Input */}
              <div className="space-y-2">
                <Label htmlFor="score" className="text-zinc-400">스코어</Label>
                <Input
                  id="score"
                  placeholder="3:1"
                  value={score}
                  onChange={(e) => setScore(e.target.value)}
                  className="w-full h-12 bg-zinc-800/50 border-white/5 text-white rounded-xl font-mono text-lg text-center"
                />
                <p className="text-xs text-zinc-600">
                  승자 기준 스코어를 입력하세요 (예: 3:1, 3:0, 3:2)
                </p>
              </div>

              {/* Date Picker */}
              <div className="space-y-2">
                <Label className="text-zinc-400">경기 날짜</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full h-12 justify-start text-left font-normal bg-zinc-800/50 border-white/5 text-white rounded-xl hover:bg-zinc-800/70",
                        !date && "text-zinc-500"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4 text-red-500" />
                      {date ? format(date, "PPP", { locale: ko }) : "날짜 선택"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0 bg-zinc-900 border-white/10" align="start">
                    <Calendar
                      mode="single"
                      selected={date}
                      onSelect={setDate}
                      locale={ko}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>

              {/* Error Message */}
              {error && (
                <div className="flex items-center gap-2 p-4 bg-red-500/10 border border-red-500/20 text-red-400 rounded-xl">
                  <AlertCircle className="w-4 h-4" />
                  <span className="text-sm">{error}</span>
                </div>
              )}

              {/* Success Message */}
              {submitted && (
                <div className="flex items-center gap-2 p-4 bg-green-500/10 border border-green-500/20 text-green-400 rounded-xl">
                  <CheckCircle2 className="w-4 h-4" />
                  <span className="text-sm">경기 결과가 성공적으로 등록되었습니다!</span>
                </div>
              )}

              {/* Submit Button */}
              <Button 
                onClick={handleSubmit} 
                className="w-full h-14 bg-red-500 hover:bg-red-600 text-white rounded-2xl text-base font-medium shadow-lg shadow-red-500/20" 
                disabled={submitted}
              >
                <Zap className="w-5 h-5 mr-2" />
                {submitted ? "등록 완료!" : "레이팅 업데이트 및 저장"}
              </Button>
            </div>
          </div>
        </div>

        {/* Recent Matches */}
        <div className="bg-zinc-900/50 backdrop-blur-xl border border-white/5 rounded-3xl p-6">
          <div className="flex items-center gap-2 text-zinc-500 mb-4">
            <span className="text-sm font-medium uppercase tracking-wider">최근 등록된 경기</span>
          </div>
          <div className="space-y-3">
            {recentMatches.map((match) => (
              <div
                key={match.id}
                className="flex items-center justify-between p-4 bg-zinc-800/50 rounded-xl border border-white/5"
              >
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-medium text-green-400 truncate">
                        {match.winnerName}
                      </span>
                      <span className="text-zinc-600">vs</span>
                      <span className="font-medium text-zinc-400 truncate">
                        {match.loserName}
                      </span>
                    </div>
                    <div className="text-xs text-zinc-600 mt-1">
                      {new Date(match.date).toLocaleDateString("ko-KR")}
                    </div>
                  </div>
                </div>
                <div className="text-right flex-shrink-0 ml-3">
                  <Badge className="bg-zinc-700 text-zinc-300 border-zinc-600 font-mono">
                    {match.score}
                  </Badge>
                  <div className="text-xs text-green-400 font-mono mt-1">
                    +{match.ratingChange}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </PageLayout>
  )
}
