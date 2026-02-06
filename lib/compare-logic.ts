import { Player, Match, matches, players } from "./mock-data-advanced"

export interface DirectH2H {
  playerAWins: number
  playerBWins: number
  totalMatches: number
}

export interface CommonOpponentResult {
  opponentId: string
  opponentName: string
  playerAWins: number
  playerATotalMatches: number
  playerBWins: number
  playerBTotalMatches: number
  playerAWinRate: number
  playerBWinRate: number
}

export interface TriangleAnalysis {
  commonOpponents: CommonOpponentResult[]
  playerAAvgWinRate: number
  playerBAvgWinRate: number
}

export interface EloPrediction {
  playerAWinProbability: number
  playerBWinProbability: number
}

/**
 * Logic A: Direct Head-to-Head 계산
 */
export function calculateDirectH2H(playerAId: string, playerBId: string): DirectH2H {
  const relevantMatches = matches.filter(
    (match) =>
      (match.winnerId === playerAId && match.loserId === playerBId) ||
      (match.winnerId === playerBId && match.loserId === playerAId)
  )

  const playerAWins = relevantMatches.filter(
    (match) => match.winnerId === playerAId
  ).length

  const playerBWins = relevantMatches.filter(
    (match) => match.winnerId === playerBId
  ).length

  return {
    playerAWins,
    playerBWins,
    totalMatches: relevantMatches.length,
  }
}

/**
 * Logic B: Triangle Logic (Common Opponents) 계산
 */
export function calculateTriangleAnalysis(
  playerAId: string,
  playerBId: string
): TriangleAnalysis {
  // 모든 선수들을 대상으로 공통 상대 찾기
  const allPlayerIds = players.map((p) => p.id)
  const commonOpponents: CommonOpponentResult[] = []

  for (const opponentId of allPlayerIds) {
    // 자기 자신 및 상대방은 제외
    if (opponentId === playerAId || opponentId === playerBId) continue

    // Player A vs Opponent 경기 찾기
    const playerAMatches = matches.filter(
      (match) =>
        (match.winnerId === playerAId && match.loserId === opponentId) ||
        (match.winnerId === opponentId && match.loserId === playerAId)
    )

    // Player B vs Opponent 경기 찾기
    const playerBMatches = matches.filter(
      (match) =>
        (match.winnerId === playerBId && match.loserId === opponentId) ||
        (match.winnerId === opponentId && match.loserId === playerBId)
    )

    // 둘 다 이 상대와 경기한 적이 있는 경우만 공통 상대로 처리
    if (playerAMatches.length > 0 && playerBMatches.length > 0) {
      const playerAWins = playerAMatches.filter((m) => m.winnerId === playerAId).length
      const playerBWins = playerBMatches.filter((m) => m.winnerId === playerBId).length

      const playerAWinRate = playerAMatches.length > 0 ? playerAWins / playerAMatches.length : 0
      const playerBWinRate = playerBMatches.length > 0 ? playerBWins / playerBMatches.length : 0

      const opponent = players.find((p) => p.id === opponentId)

      commonOpponents.push({
        opponentId,
        opponentName: opponent?.name || "Unknown",
        playerAWins,
        playerATotalMatches: playerAMatches.length,
        playerBWins,
        playerBTotalMatches: playerBMatches.length,
        playerAWinRate,
        playerBWinRate,
      })
    }
  }

  // 평균 승률 계산
  const playerAAvgWinRate =
    commonOpponents.length > 0
      ? commonOpponents.reduce((sum, co) => sum + co.playerAWinRate, 0) / commonOpponents.length
      : 0

  const playerBAvgWinRate =
    commonOpponents.length > 0
      ? commonOpponents.reduce((sum, co) => sum + co.playerBWinRate, 0) / commonOpponents.length
      : 0

  // 승률 차이가 큰 순서로 정렬 (분석적 가치가 높은 순)
  commonOpponents.sort(
    (a, b) => Math.abs(b.playerAWinRate - b.playerBWinRate) - Math.abs(a.playerAWinRate - a.playerBWinRate)
  )

  return {
    commonOpponents,
    playerAAvgWinRate,
    playerBAvgWinRate,
  }
}

/**
 * Logic C: Elo-based AI Prediction
 * 표준 Elo 확률 공식 사용: P(A) = 1 / (1 + 10^((RatingB - RatingA) / 400))
 */
export function calculateEloPrediction(playerA: Player, playerB: Player): EloPrediction {
  const expectedScoreA = 1 / (1 + Math.pow(10, (playerB.elo - playerA.elo) / 400))
  const expectedScoreB = 1 - expectedScoreA

  return {
    playerAWinProbability: expectedScoreA,
    playerBWinProbability: expectedScoreB,
  }
}

/**
 * Helper: ID로 플레이어 찾기
 */
export function getPlayerById(playerId: string): Player | undefined {
  return players.find((p) => p.id === playerId)
}
