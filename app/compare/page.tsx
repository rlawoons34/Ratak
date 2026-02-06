"use client";

import * as React from "react";
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import {
  players,
  getPlayer,
  getH2HRecord,
  getCommonOpponents,
  getWinRateAgainst,
  type Player,
} from "@/lib/mock-data-advanced";

interface AnalysisResult {
  h2h: { wins: number; losses: number };
  winProbabilityA: number;
  triangleInsights: Array<{
    opponentId: string;
    opponentName: string;
    playerAWinRate: number;
    playerBWinRate: number;
  }>;
  keyInsights: string[];
}

export default function ComparePage() {
  const [openA, setOpenA] = React.useState(false);
  const [openB, setOpenB] = React.useState(false);
  const [playerA, setPlayerA] = React.useState<Player | null>(null);
  const [playerB, setPlayerB] = React.useState<Player | null>(null);
  const [analysis, setAnalysis] = React.useState<AnalysisResult | null>(null);

  // 분석 실행
  const runAnalysis = React.useCallback(() => {
    if (!playerA || !playerB) {
      setAnalysis(null);
      return;
    }

    // 1. H2H 기록
    const h2h = getH2HRecord(playerA.id, playerB.id);

    // 2. Elo 기반 승률 계산
    const eloDiff = playerB.elo - playerA.elo;
    const winProbabilityA = 1 / (1 + Math.pow(10, eloDiff / 400));

    // 3. 삼각 로직 (공통 상대)
    const commonOpponentIds = getCommonOpponents(playerA.id, playerB.id);
    const triangleInsights = commonOpponentIds.map((oppId) => {
      const opponent = getPlayer(oppId);
      return {
        opponentId: oppId,
        opponentName: opponent?.name || "Unknown",
        playerAWinRate: getWinRateAgainst(playerA.id, oppId),
        playerBWinRate: getWinRateAgainst(playerB.id, oppId),
      };
    });

    // 4. 주요 인사이트 생성
    const keyInsights: string[] = [];

    // H2H 인사이트
    if (h2h.wins + h2h.losses > 0) {
      const h2hWinRate = h2h.wins / (h2h.wins + h2h.losses);
      if (h2hWinRate > 0.6) {
        keyInsights.push(`${playerA.name}는 직접 대결에서 강세를 보입니다 (${h2h.wins}승 ${h2h.losses}패)`);
      } else if (h2hWinRate < 0.4) {
        keyInsights.push(`${playerB.name}는 직접 대결에서 강세를 보입니다 (${h2h.losses}승 ${h2h.wins}패)`);
      } else {
        keyInsights.push(`두 선수의 직접 대결은 균형을 이루고 있습니다 (${h2h.wins}승 ${h2h.losses}패)`);
      }
    } else {
      keyInsights.push("두 선수 간 직접 대결 기록이 없습니다");
    }

    // Elo 인사이트
    const eloGap = Math.abs(playerA.elo - playerB.elo);
    if (eloGap > 200) {
      if (playerA.elo > playerB.elo) {
        keyInsights.push(`${playerA.name}의 레이팅이 현저히 높습니다 (+${eloGap})`);
      } else {
        keyInsights.push(`${playerB.name}의 레이팅이 현저히 높습니다 (+${eloGap})`);
      }
    } else if (eloGap < 50) {
      keyInsights.push(`두 선수의 레이팅이 매우 비슷합니다 (차이: ${eloGap})`);
    }

    // 삼각 로직 인사이트
    if (triangleInsights.length > 0) {
      const avgDiff =
        triangleInsights.reduce(
          (sum, t) => sum + (t.playerAWinRate - t.playerBWinRate),
          0
        ) / triangleInsights.length;

      if (avgDiff > 0.15) {
        keyInsights.push(`${playerA.name}는 공통 상대 대비 승률이 더 높습니다`);
      } else if (avgDiff < -0.15) {
        keyInsights.push(`${playerB.name}는 공통 상대 대비 승률이 더 높습니다`);
      }
    }

    // 랭킹 인사이트
    if (playerA.rank < playerB.rank && playerA.elo < playerB.elo) {
      keyInsights.push(`${playerA.name}는 낮은 레이팅에도 높은 랭킹을 유지하고 있습니다`);
    } else if (playerB.rank < playerA.rank && playerB.elo < playerA.elo) {
      keyInsights.push(`${playerB.name}는 낮은 레이팅에도 높은 랭킹을 유지하고 있습니다`);
    }

    setAnalysis({
      h2h,
      winProbabilityA,
      triangleInsights,
      keyInsights,
    });
  }, [playerA, playerB]);

  // 선수 선택 시 자동 분석
  React.useEffect(() => {
    runAnalysis();
  }, [playerA, playerB, runAnalysis]);

  // 사용 가능한 선수 목록 (상대편에서 선택한 선수 제외)
  const availablePlayersA = players.filter((p) => p.id !== playerB?.id);
  const availablePlayersB = players.filter((p) => p.id !== playerA?.id);

  return (
    <div className="min-h-screen bg-zinc-950 text-white">
      <div className="container mx-auto py-8 px-4 max-w-6xl">
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold mb-2 text-white">Head-to-Head 분석 & AI 예측</h1>
          <p className="text-zinc-400">
            두 선수를 선택하여 상대 전적, 삼각 로직, Elo 기반 승률을 확인하세요
          </p>
        </div>

        {/* 선수 선택 */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          {/* Player A Selector */}
          <Card className="bg-zinc-900/50 backdrop-blur-xl border-white/10">
            <CardHeader>
              <CardTitle className="text-white">선수 A 선택</CardTitle>
              <CardDescription className="text-zinc-400">첫 번째 선수를 선택하세요</CardDescription>
            </CardHeader>
            <CardContent>
            <Popover open={openA} onOpenChange={setOpenA}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  role="combobox"
                  aria-expanded={openA}
                  className="w-full justify-between bg-zinc-800/50 border-zinc-700 text-white hover:bg-zinc-800 hover:text-white"
                >
                  {playerA ? (
                    <span className="flex items-center gap-2">
                      <span className="text-2xl">{playerA.avatar}</span>
                      <span className="text-white">{playerA.name}</span>
                      <span className="text-zinc-400 text-sm">
                        ({playerA.elo})
                      </span>
                    </span>
                  ) : (
                    <span className="text-zinc-400">선수를 선택하세요...</span>
                  )}
                  <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-full p-0 bg-zinc-900 border-zinc-700">
                <Command className="bg-zinc-900">
                  <CommandInput placeholder="선수 검색..." className="text-white" />
                  <CommandList>
                    <CommandEmpty className="text-zinc-400">선수를 찾을 수 없습니다.</CommandEmpty>
                    <CommandGroup>
                      {availablePlayersA.map((player) => (
                        <CommandItem
                          key={player.id}
                          value={player.name}
                          onSelect={() => {
                            setPlayerA(player);
                            setOpenA(false);
                          }}
                          className="text-white hover:bg-zinc-800"
                        >
                          <Check
                            className={cn(
                              "mr-2 h-4 w-4",
                              playerA?.id === player.id
                                ? "opacity-100"
                                : "opacity-0"
                            )}
                          />
                          <span className="text-2xl mr-2">{player.avatar}</span>
                          <span className="flex-1 text-white">{player.name}</span>
                          <span className="text-zinc-400 text-sm">
                            #{player.rank} · {player.elo}
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

          {/* Player B Selector */}
          <Card className="bg-zinc-900/50 backdrop-blur-xl border-white/10">
            <CardHeader>
              <CardTitle className="text-white">선수 B 선택</CardTitle>
              <CardDescription className="text-zinc-400">두 번째 선수를 선택하세요</CardDescription>
            </CardHeader>
            <CardContent>
              <Popover open={openB} onOpenChange={setOpenB}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={openB}
                    className="w-full justify-between bg-zinc-800/50 border-zinc-700 text-white hover:bg-zinc-800 hover:text-white"
                  >
                  {playerB ? (
                    <span className="flex items-center gap-2">
                      <span className="text-2xl">{playerB.avatar}</span>
                      <span className="text-white">{playerB.name}</span>
                      <span className="text-zinc-400 text-sm">
                        ({playerB.elo})
                      </span>
                    </span>
                  ) : (
                    <span className="text-zinc-400">선수를 선택하세요...</span>
                  )}
                  <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-full p-0 bg-zinc-900 border-zinc-700">
                <Command className="bg-zinc-900">
                  <CommandInput placeholder="선수 검색..." className="text-white" />
                  <CommandList>
                    <CommandEmpty className="text-zinc-400">선수를 찾을 수 없습니다.</CommandEmpty>
                    <CommandGroup>
                      {availablePlayersB.map((player) => (
                        <CommandItem
                          key={player.id}
                          value={player.name}
                          onSelect={() => {
                            setPlayerB(player);
                            setOpenB(false);
                          }}
                          className="text-white hover:bg-zinc-800"
                        >
                          <Check
                            className={cn(
                              "mr-2 h-4 w-4",
                              playerB?.id === player.id
                                ? "opacity-100"
                                : "opacity-0"
                            )}
                          />
                          <span className="text-2xl mr-2">{player.avatar}</span>
                          <span className="flex-1 text-white">{player.name}</span>
                          <span className="text-zinc-400 text-sm">
                            #{player.rank} · {player.elo}
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
          <Card className="mb-8 bg-gradient-to-r from-blue-900/30 to-purple-900/30 backdrop-blur-xl border-white/10">
            <CardContent className="pt-6">
              <div className="grid grid-cols-3 items-center gap-4">
                {/* Player A */}
                <div className="text-center">
                  <div className="text-6xl mb-2">{playerA.avatar}</div>
                  <h2 className="text-2xl font-bold text-white">{playerA.name}</h2>
                  <p className="text-zinc-400">랭킹 #{playerA.rank}</p>
                  <p className="text-3xl font-bold text-blue-400 mt-2">
                    {playerA.elo}
                  </p>
                </div>

                {/* VS */}
                <div className="text-center">
                  <div className="text-5xl font-bold text-zinc-500">VS</div>
                </div>

                {/* Player B */}
                <div className="text-center">
                  <div className="text-6xl mb-2">{playerB.avatar}</div>
                  <h2 className="text-2xl font-bold text-white">{playerB.name}</h2>
                  <p className="text-zinc-400">랭킹 #{playerB.rank}</p>
                  <p className="text-3xl font-bold text-purple-400 mt-2">
                    {playerB.elo}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Analysis Results */}
        {analysis && playerA && playerB && (
          <div className="space-y-6">
            {/* Win Probability */}
            <Card className="bg-zinc-900/50 backdrop-blur-xl border-white/10">
              <CardHeader>
                <CardTitle className="text-white">AI 승률 예측 (Elo 기반)</CardTitle>
                <CardDescription className="text-zinc-400">
                  수학적 모델을 통한 승리 확률 계산
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="font-semibold text-white">{playerA.name}</span>
                    <span className="font-semibold text-white">{playerB.name}</span>
                  </div>
                  <div className="relative">
                    <Progress
                      value={analysis.winProbabilityA * 100}
                      className="h-8 bg-zinc-800"
                    />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-sm font-bold text-white drop-shadow-lg">
                        {(analysis.winProbabilityA * 100).toFixed(1)}% vs{" "}
                        {((1 - analysis.winProbabilityA) * 100).toFixed(1)}%
                      </span>
                    </div>
                  </div>
                </div>
                <p className="text-sm text-zinc-400 text-center">
                  공식: P(A) = 1 / (1 + 10^((Rb - Ra) / 400))
                </p>
              </CardContent>
            </Card>

            {/* H2H Record */}
            <Card className="bg-zinc-900/50 backdrop-blur-xl border-white/10">
              <CardHeader>
                <CardTitle className="text-white">직접 대결 전적 (H2H)</CardTitle>
                <CardDescription className="text-zinc-400">
                  두 선수 간의 실제 매치 기록
                </CardDescription>
              </CardHeader>
              <CardContent>
                {analysis.h2h.wins + analysis.h2h.losses > 0 ? (
                  <div className="flex justify-center items-center gap-8">
                    <div className="text-center">
                      <div className="text-5xl font-bold text-blue-400">
                        {analysis.h2h.wins}
                      </div>
                      <div className="text-sm text-zinc-400 mt-1">
                        {playerA.name} 승리
                      </div>
                    </div>
                    <div className="text-3xl font-bold text-zinc-500">-</div>
                    <div className="text-center">
                      <div className="text-5xl font-bold text-purple-400">
                        {analysis.h2h.losses}
                      </div>
                      <div className="text-sm text-zinc-400 mt-1">
                        {playerB.name} 승리
                      </div>
                    </div>
                  </div>
                ) : (
                  <p className="text-center text-zinc-400">
                    두 선수 간 직접 대결 기록이 없습니다.
                  </p>
                )}
              </CardContent>
            </Card>

            {/* Triangle Logic */}
            {analysis.triangleInsights.length > 0 && (
              <Card className="bg-zinc-900/50 backdrop-blur-xl border-white/10">
                <CardHeader>
                  <CardTitle className="text-white">삼각 로직 분석</CardTitle>
                  <CardDescription className="text-zinc-400">
                    공통 상대와의 승률 비교
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {analysis.triangleInsights.map((insight) => (
                      <div
                        key={insight.opponentId}
                        className="border border-zinc-800 bg-zinc-800/30 rounded-lg p-4"
                      >
                        <div className="font-semibold mb-2 text-white">
                          vs {insight.opponentName}
                        </div>
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <div className="text-zinc-400">{playerA.name}</div>
                            <div className="text-lg font-bold text-blue-400">
                              {(insight.playerAWinRate * 100).toFixed(0)}% 승률
                            </div>
                          </div>
                          <div>
                            <div className="text-zinc-400">{playerB.name}</div>
                            <div className="text-lg font-bold text-purple-400">
                              {(insight.playerBWinRate * 100).toFixed(0)}% 승률
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Key Insights */}
            <Card className="bg-zinc-900/50 backdrop-blur-xl border-white/10">
              <CardHeader>
                <CardTitle className="text-white">주요 인사이트</CardTitle>
                <CardDescription className="text-zinc-400">
                  분석 결과 요약 및 특이사항
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {analysis.keyInsights.map((insight, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <span className="text-blue-400 mt-1">•</span>
                      <span className="text-zinc-200">{insight}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Empty State */}
        {!playerA || !playerB ? (
          <Card className="border-dashed border-zinc-700 bg-zinc-900/30">
            <CardContent className="pt-6 text-center text-zinc-400">
              <p className="text-lg">두 명의 선수를 선택하면 분석이 시작됩니다</p>
            </CardContent>
          </Card>
        ) : null}
      </div>
    </div>
  );
}
