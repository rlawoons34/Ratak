"use client"

import * as React from "react"
import { Check, ChevronsUpDown, Swords, Trophy, Target } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Progress } from "@/components/ui/progress"
import { players } from "@/lib/mock-data-advanced"
import {
  calculateDirectH2H,
  calculateTriangleAnalysis,
  calculateEloPrediction,
  getPlayerById,
} from "@/lib/compare-logic"

export default function ComparePage() {
  const [openPlayerA, setOpenPlayerA] = React.useState(false)
  const [openPlayerB, setOpenPlayerB] = React.useState(false)
  const [selectedPlayerAId, setSelectedPlayerAId] = React.useState<string>("")
  const [selectedPlayerBId, setSelectedPlayerBId] = React.useState<string>("")

  const playerA = selectedPlayerAId ? getPlayerById(selectedPlayerAId) : null
  const playerB = selectedPlayerBId ? getPlayerById(selectedPlayerBId) : null

  // 분석 계산
  const directH2H = playerA && playerB ? calculateDirectH2H(playerA.id, playerB.id) : null
  const triangleAnalysis = playerA && playerB ? calculateTriangleAnalysis(playerA.id, playerB.id) : null
  const eloPrediction = playerA && playerB ? calculateEloPrediction(playerA, playerB) : null

  return (
    <div className="container mx-auto py-8 px-4 max-w-7xl">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">Head-to-Head 분석 & AI 예측</h1>
        <p className="text-muted-foreground">
          두 선수를 선택하여 직접 대결 기록, 공통 상대 분석, Elo 기반 승률을 확인하세요
        </p>
      </div>

      {/* Player Selection Section */}
      <div className="grid md:grid-cols-2 gap-6 mb-8">
        {/* Player A Selection */}
        <Card>
          <CardHeader>
            <CardTitle>플레이어 A</CardTitle>
            <CardDescription>첫 번째 선수를 선택하세요</CardDescription>
          </CardHeader>
          <CardContent>
            <Popover open={openPlayerA} onOpenChange={setOpenPlayerA}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  role="combobox"
                  aria-expanded={openPlayerA}
                  className="w-full justify-between"
                >
                  {playerA ? (
                    <div className="flex items-center gap-2">
                      <Avatar className="h-6 w-6">
                        <AvatarImage src={playerA.avatar} alt={playerA.name} />
                        <AvatarFallback>{playerA.name[0]}</AvatarFallback>
                      </Avatar>
                      <span>{playerA.name}</span>
                      <span className="text-muted-foreground">({playerA.elo})</span>
                    </div>
                  ) : (
                    "선수를 선택하세요..."
                  )}
                  <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-full p-0">
                <Command>
                  <CommandInput placeholder="선수 검색..." />
                  <CommandList>
                    <CommandEmpty>선수를 찾을 수 없습니다.</CommandEmpty>
                    <CommandGroup>
                      {players
                        .filter((p) => p.id !== selectedPlayerBId)
                        .map((player) => (
                          <CommandItem
                            key={player.id}
                            value={player.name}
                            onSelect={() => {
                              setSelectedPlayerAId(player.id)
                              setOpenPlayerA(false)
                            }}
                          >
                            <Check
                              className={cn(
                                "mr-2 h-4 w-4",
                                selectedPlayerAId === player.id
                                  ? "opacity-100"
                                  : "opacity-0"
                              )}
                            />
                            <Avatar className="h-6 w-6 mr-2">
                              <AvatarImage src={player.avatar} alt={player.name} />
                              <AvatarFallback>{player.name[0]}</AvatarFallback>
                            </Avatar>
                            <span>{player.name}</span>
                            <span className="ml-auto text-muted-foreground">
                              {player.elo}
                            </span>
                          </CommandItem>
                        ))}
                    </CommandGroup>
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>
          </CardContent>
        </Card>

        {/* Player B Selection */}
        <Card>
          <CardHeader>
            <CardTitle>플레이어 B</CardTitle>
            <CardDescription>두 번째 선수를 선택하세요</CardDescription>
          </CardHeader>
          <CardContent>
            <Popover open={openPlayerB} onOpenChange={setOpenPlayerB}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  role="combobox"
                  aria-expanded={openPlayerB}
                  className="w-full justify-between"
                >
                  {playerB ? (
                    <div className="flex items-center gap-2">
                      <Avatar className="h-6 w-6">
                        <AvatarImage src={playerB.avatar} alt={playerB.name} />
                        <AvatarFallback>{playerB.name[0]}</AvatarFallback>
                      </Avatar>
                      <span>{playerB.name}</span>
                      <span className="text-muted-foreground">({playerB.elo})</span>
                    </div>
                  ) : (
                    "선수를 선택하세요..."
                  )}
                  <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-full p-0">
                <Command>
                  <CommandInput placeholder="선수 검색..." />
                  <CommandList>
                    <CommandEmpty>선수를 찾을 수 없습니다.</CommandEmpty>
                    <CommandGroup>
                      {players
                        .filter((p) => p.id !== selectedPlayerAId)
                        .map((player) => (
                          <CommandItem
                            key={player.id}
                            value={player.name}
                            onSelect={() => {
                              setSelectedPlayerBId(player.id)
                              setOpenPlayerB(false)
                            }}
                          >
                            <Check
                              className={cn(
                                "mr-2 h-4 w-4",
                                selectedPlayerBId === player.id
                                  ? "opacity-100"
                                  : "opacity-0"
                              )}
                            />
                            <Avatar className="h-6 w-6 mr-2">
                              <AvatarImage src={player.avatar} alt={player.name} />
                              <AvatarFallback>{player.name[0]}</AvatarFallback>
                            </Avatar>
                            <span>{player.name}</span>
                            <span className="ml-auto text-muted-foreground">
                              {player.elo}
                            </span>
                          </CommandItem>
                        ))}
                    </CommandGroup>
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>
          </CardContent>
        </Card>
      </div>

      {/* VS Header */}
      {playerA && playerB && (
        <Card className="mb-8 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950 dark:to-purple-950">
          <CardContent className="py-8">
            <div className="flex items-center justify-between gap-8">
              {/* Player A */}
              <div className="flex flex-col items-center flex-1">
                <Avatar className="h-24 w-24 mb-4 border-4 border-blue-500">
                  <AvatarImage src={playerA.avatar} alt={playerA.name} />
                  <AvatarFallback className="text-2xl">{playerA.name[0]}</AvatarFallback>
                </Avatar>
                <h2 className="text-2xl font-bold">{playerA.name}</h2>
                <p className="text-lg text-muted-foreground">Elo: {playerA.elo}</p>
              </div>

              {/* VS Icon */}
              <div className="flex items-center justify-center">
                <div className="bg-white dark:bg-gray-900 rounded-full p-4 shadow-lg">
                  <Swords className="h-12 w-12 text-red-500" />
                </div>
              </div>

              {/* Player B */}
              <div className="flex flex-col items-center flex-1">
                <Avatar className="h-24 w-24 mb-4 border-4 border-purple-500">
                  <AvatarImage src={playerB.avatar} alt={playerB.name} />
                  <AvatarFallback className="text-2xl">{playerB.name[0]}</AvatarFallback>
                </Avatar>
                <h2 className="text-2xl font-bold">{playerB.name}</h2>
                <p className="text-lg text-muted-foreground">Elo: {playerB.elo}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Analysis Cards */}
      {playerA && playerB && directH2H && triangleAnalysis && eloPrediction && (
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Card 1: Direct H2H */}
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-center gap-2">
                <Trophy className="h-5 w-5 text-yellow-500" />
                <CardTitle>직접 대결 기록</CardTitle>
              </div>
              <CardDescription>역대 전적</CardDescription>
            </CardHeader>
            <CardContent>
              {directH2H.totalMatches > 0 ? (
                <div className="space-y-4">
                  <div className="text-center">
                    <div className="flex items-center justify-center gap-4 text-4xl font-bold mb-2">
                      <span className="text-blue-500">{directH2H.playerAWins}</span>
                      <span className="text-gray-400">-</span>
                      <span className="text-purple-500">{directH2H.playerBWins}</span>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      총 {directH2H.totalMatches}경기
                    </p>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">{playerA.name}</span>
                      <span className="text-sm text-muted-foreground">
                        {Math.round((directH2H.playerAWins / directH2H.totalMatches) * 100)}%
                      </span>
                    </div>
                    <Progress
                      value={(directH2H.playerAWins / directH2H.totalMatches) * 100}
                      className="h-2"
                    />

                    <div className="flex justify-between items-center mt-4">
                      <span className="text-sm font-medium">{playerB.name}</span>
                      <span className="text-sm text-muted-foreground">
                        {Math.round((directH2H.playerBWins / directH2H.totalMatches) * 100)}%
                      </span>
                    </div>
                    <Progress
                      value={(directH2H.playerBWins / directH2H.totalMatches) * 100}
                      className="h-2"
                    />
                  </div>
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-muted-foreground">아직 대결 기록이 없습니다</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Card 2: Triangle Analysis */}
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-center gap-2">
                <Target className="h-5 w-5 text-green-500" />
                <CardTitle>공통 상대 분석</CardTitle>
              </div>
              <CardDescription>삼각 관계 로직</CardDescription>
            </CardHeader>
            <CardContent>
              {triangleAnalysis.commonOpponents.length > 0 ? (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4 text-center mb-4">
                    <div className="bg-blue-50 dark:bg-blue-950 rounded-lg p-3">
                      <p className="text-sm text-muted-foreground mb-1">
                        {playerA.name}
                      </p>
                      <p className="text-2xl font-bold text-blue-600">
                        {Math.round(triangleAnalysis.playerAAvgWinRate * 100)}%
                      </p>
                    </div>
                    <div className="bg-purple-50 dark:bg-purple-950 rounded-lg p-3">
                      <p className="text-sm text-muted-foreground mb-1">
                        {playerB.name}
                      </p>
                      <p className="text-2xl font-bold text-purple-600">
                        {Math.round(triangleAnalysis.playerBAvgWinRate * 100)}%
                      </p>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <p className="text-xs font-semibold text-muted-foreground uppercase">
                      주요 공통 상대 Top 3
                    </p>
                    {triangleAnalysis.commonOpponents.slice(0, 3).map((opponent) => (
                      <div
                        key={opponent.opponentId}
                        className="border rounded-lg p-3 space-y-2"
                      >
                        <p className="font-medium text-sm">{opponent.opponentName}</p>
                        <div className="flex justify-between text-xs">
                          <span>
                            {playerA.name}: {opponent.playerAWins}/{opponent.playerATotalMatches} (
                            {Math.round(opponent.playerAWinRate * 100)}%)
                          </span>
                        </div>
                        <div className="flex justify-between text-xs">
                          <span>
                            {playerB.name}: {opponent.playerBWins}/{opponent.playerBTotalMatches} (
                            {Math.round(opponent.playerBWinRate * 100)}%)
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-muted-foreground">공통 상대가 없습니다</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Card 3: AI Prediction */}
          <Card className="hover:shadow-lg transition-shadow border-2 border-primary">
            <CardHeader>
              <div className="flex items-center gap-2">
                <div className="bg-gradient-to-r from-blue-500 to-purple-500 rounded p-1">
                  <Swords className="h-4 w-4 text-white" />
                </div>
                <CardTitle>AI 승률 예측</CardTitle>
              </div>
              <CardDescription>Elo 기반 확률</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {/* Player A Prediction */}
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <div className="flex items-center gap-2">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={playerA.avatar} alt={playerA.name} />
                        <AvatarFallback>{playerA.name[0]}</AvatarFallback>
                      </Avatar>
                      <span className="font-medium">{playerA.name}</span>
                    </div>
                    <span className="text-2xl font-bold text-blue-600">
                      {Math.round(eloPrediction.playerAWinProbability * 100)}%
                    </span>
                  </div>
                  <Progress
                    value={eloPrediction.playerAWinProbability * 100}
                    className="h-3"
                  />
                </div>

                {/* Player B Prediction */}
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <div className="flex items-center gap-2">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={playerB.avatar} alt={playerB.name} />
                        <AvatarFallback>{playerB.name[0]}</AvatarFallback>
                      </Avatar>
                      <span className="font-medium">{playerB.name}</span>
                    </div>
                    <span className="text-2xl font-bold text-purple-600">
                      {Math.round(eloPrediction.playerBWinProbability * 100)}%
                    </span>
                  </div>
                  <Progress
                    value={eloPrediction.playerBWinProbability * 100}
                    className="h-3"
                  />
                </div>

                {/* Verdict */}
                <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950 dark:to-purple-950 rounded-lg p-4 text-center">
                  <p className="text-sm text-muted-foreground mb-1">예측 결과</p>
                  <p className="font-bold text-lg">
                    {eloPrediction.playerAWinProbability > eloPrediction.playerBWinProbability
                      ? playerA.name
                      : playerB.name}{" "}
                    우세
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Elo 레이팅 차이:{" "}
                    {Math.abs(playerA.elo - playerB.elo)} 점
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Empty State */}
      {(!playerA || !playerB) && (
        <Card className="mt-8">
          <CardContent className="py-16 text-center">
            <Swords className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-xl font-semibold mb-2">두 선수를 선택하세요</h3>
            <p className="text-muted-foreground">
              위에서 플레이어 A와 플레이어 B를 선택하면 상세한 분석을 확인할 수 있습니다
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
