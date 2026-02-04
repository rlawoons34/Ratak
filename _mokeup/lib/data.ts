// Types
export interface Player {
  id: string
  name: string
  school: string
  schoolShort: string
  uniDivision: string
  clubDivision: string
  rating: number
  winRate: number
  totalMatches: number
  wins: number
  losses: number
  ratingChange: number
}

export interface Match {
  id: string
  date: string
  winnerId: string
  winnerName: string
  loserId: string
  loserName: string
  score: string
  winnerRatingBefore: number
  loserRatingBefore: number
  ratingChange: number
}

export interface School {
  id: string
  name: string
  shortName: string
  averageRating: number
  playerCount: number
  players: Player[]
}

// Mock Data
export const players: Player[] = [
  {
    id: "1",
    name: "김재훈",
    school: "한양대학교",
    schoolShort: "한양대",
    uniDivision: "3부",
    clubDivision: "A",
    rating: 2145,
    winRate: 78.5,
    totalMatches: 42,
    wins: 33,
    losses: 9,
    ratingChange: 45,
  },
  {
    id: "2",
    name: "구동영",
    school: "연세대학교",
    schoolShort: "연세대",
    uniDivision: "1부",
    clubDivision: "A",
    rating: 2098,
    winRate: 72.3,
    totalMatches: 38,
    wins: 27,
    losses: 11,
    ratingChange: 28,
  },
  {
    id: "3",
    name: "백승원",
    school: "고려대학교",
    schoolShort: "고려대",
    uniDivision: "1부",
    clubDivision: "A",
    rating: 2067,
    winRate: 69.8,
    totalMatches: 35,
    wins: 24,
    losses: 11,
    ratingChange: 15,
  },
  {
    id: "4",
    name: "이준혁",
    school: "한양대학교",
    schoolShort: "한양대",
    uniDivision: "1부",
    clubDivision: "B",
    rating: 2034,
    winRate: 67.5,
    totalMatches: 40,
    wins: 27,
    losses: 13,
    ratingChange: -12,
  },
  {
    id: "5",
    name: "정민수",
    school: "성균관대학교",
    schoolShort: "성균관대",
    uniDivision: "1부",
    clubDivision: "A",
    rating: 2015,
    winRate: 65.2,
    totalMatches: 33,
    wins: 21,
    losses: 12,
    ratingChange: 22,
  },
  {
    id: "6",
    name: "최현우",
    school: "서강대학교",
    schoolShort: "서강대",
    uniDivision: "2부",
    clubDivision: "B",
    rating: 1987,
    winRate: 63.4,
    totalMatches: 31,
    wins: 19,
    losses: 12,
    ratingChange: 8,
  },
  {
    id: "7",
    name: "박지훈",
    school: "중앙대학교",
    schoolShort: "중앙대",
    uniDivision: "2부",
    clubDivision: "B",
    rating: 1965,
    winRate: 61.8,
    totalMatches: 29,
    wins: 18,
    losses: 11,
    ratingChange: -5,
  },
  {
    id: "8",
    name: "한동진",
    school: "경희대학교",
    schoolShort: "경희대",
    uniDivision: "2부",
    clubDivision: "A",
    rating: 1942,
    winRate: 58.9,
    totalMatches: 28,
    wins: 16,
    losses: 12,
    ratingChange: 31,
  },
  {
    id: "9",
    name: "오승환",
    school: "건국대학교",
    schoolShort: "건국대",
    uniDivision: "2부",
    clubDivision: "B",
    rating: 1918,
    winRate: 55.6,
    totalMatches: 27,
    wins: 15,
    losses: 12,
    ratingChange: -8,
  },
  {
    id: "10",
    name: "서영민",
    school: "동국대학교",
    schoolShort: "동국대",
    uniDivision: "3부",
    clubDivision: "C",
    rating: 1895,
    winRate: 52.4,
    totalMatches: 25,
    wins: 13,
    losses: 12,
    ratingChange: 12,
  },
  {
    id: "11",
    name: "임태현",
    school: "홍익대학교",
    schoolShort: "홍익대",
    uniDivision: "3부",
    clubDivision: "C",
    rating: 1872,
    winRate: 50.0,
    totalMatches: 24,
    wins: 12,
    losses: 12,
    ratingChange: 5,
  },
  {
    id: "12",
    name: "강민재",
    school: "숭실대학교",
    schoolShort: "숭실대",
    uniDivision: "3부",
    clubDivision: "C",
    rating: 1845,
    winRate: 48.2,
    totalMatches: 22,
    wins: 10,
    losses: 12,
    ratingChange: -3,
  },
  {
    id: "13",
    name: "윤성준",
    school: "서울대학교",
    schoolShort: "서울대",
    uniDivision: "1부",
    clubDivision: "B",
    rating: 1978,
    winRate: 62.5,
    totalMatches: 32,
    wins: 20,
    losses: 12,
    ratingChange: 18,
  },
  {
    id: "14",
    name: "송재원",
    school: "연세대학교",
    schoolShort: "연세대",
    uniDivision: "1부",
    clubDivision: "B",
    rating: 1956,
    winRate: 60.0,
    totalMatches: 30,
    wins: 18,
    losses: 12,
    ratingChange: 10,
  },
  {
    id: "15",
    name: "신동현",
    school: "고려대학교",
    schoolShort: "고려대",
    uniDivision: "2부",
    clubDivision: "A",
    rating: 1934,
    winRate: 57.5,
    totalMatches: 28,
    wins: 16,
    losses: 12,
    ratingChange: -15,
  },
]

export const matches: Match[] = [
  {
    id: "m1",
    date: "2026-02-01",
    winnerId: "1",
    winnerName: "김재훈",
    loserId: "2",
    loserName: "구동영",
    score: "3:2",
    winnerRatingBefore: 2130,
    loserRatingBefore: 2113,
    ratingChange: 15,
  },
  {
    id: "m2",
    date: "2026-01-28",
    winnerId: "3",
    winnerName: "백승원",
    loserId: "1",
    loserName: "김재훈",
    score: "3:1",
    winnerRatingBefore: 2045,
    loserRatingBefore: 2145,
    ratingChange: 22,
  },
  {
    id: "m3",
    date: "2026-01-25",
    winnerId: "1",
    winnerName: "김재훈",
    loserId: "4",
    loserName: "이준혁",
    score: "3:0",
    winnerRatingBefore: 2120,
    loserRatingBefore: 2050,
    ratingChange: 12,
  },
  {
    id: "m4",
    date: "2026-01-22",
    winnerId: "2",
    winnerName: "구동영",
    loserId: "5",
    loserName: "정민수",
    score: "3:1",
    winnerRatingBefore: 2085,
    loserRatingBefore: 2030,
    ratingChange: 13,
  },
  {
    id: "m5",
    date: "2026-01-20",
    winnerId: "1",
    winnerName: "김재훈",
    loserId: "5",
    loserName: "정민수",
    score: "3:2",
    winnerRatingBefore: 2108,
    loserRatingBefore: 2015,
    ratingChange: 12,
  },
  {
    id: "m6",
    date: "2026-01-18",
    winnerId: "10",
    winnerName: "서영민",
    loserId: "3",
    loserName: "백승원",
    score: "3:2",
    winnerRatingBefore: 1850,
    loserRatingBefore: 2090,
    ratingChange: 35,
  },
  {
    id: "m7",
    date: "2026-01-15",
    winnerId: "8",
    winnerName: "한동진",
    loserId: "6",
    loserName: "최현우",
    score: "3:1",
    winnerRatingBefore: 1925,
    loserRatingBefore: 1995,
    ratingChange: 17,
  },
  {
    id: "m8",
    date: "2026-01-12",
    winnerId: "4",
    winnerName: "이준혁",
    loserId: "7",
    loserName: "박지훈",
    score: "3:0",
    winnerRatingBefore: 2020,
    loserRatingBefore: 1980,
    ratingChange: 14,
  },
]

// Get schools with aggregated data
export function getSchools(): School[] {
  const schoolMap = new Map<string, { players: Player[]; totalRating: number }>()

  for (const player of players) {
    const existing = schoolMap.get(player.school)
    if (existing) {
      existing.players.push(player)
      existing.totalRating += player.rating
    } else {
      schoolMap.set(player.school, {
        players: [player],
        totalRating: player.rating,
      })
    }
  }

  const schools: School[] = []
  schoolMap.forEach((data, name) => {
    const shortName = data.players[0].schoolShort
    schools.push({
      id: name.replace(/\s/g, "-").toLowerCase(),
      name,
      shortName,
      averageRating: Math.round(data.totalRating / data.players.length),
      playerCount: data.players.length,
      players: data.players.sort((a, b) => b.rating - a.rating),
    })
  })

  return schools.sort((a, b) => b.averageRating - a.averageRating)
}

// Get player matches
export function getPlayerMatches(playerId: string): (Match & { isWin: boolean })[] {
  return matches
    .filter((m) => m.winnerId === playerId || m.loserId === playerId)
    .map((m) => ({
      ...m,
      isWin: m.winnerId === playerId,
    }))
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
}

// Calculate Elo win probability
export function calculateWinProbability(ratingA: number, ratingB: number): number {
  const expectedA = 1 / (1 + Math.pow(10, (ratingB - ratingA) / 400))
  return Math.round(expectedA * 100)
}

// Get head-to-head stats
export function getHeadToHead(
  playerAId: string,
  playerBId: string
): { aWins: number; bWins: number; matches: Match[] } {
  const h2hMatches = matches.filter(
    (m) =>
      (m.winnerId === playerAId && m.loserId === playerBId) ||
      (m.winnerId === playerBId && m.loserId === playerAId)
  )

  const aWins = h2hMatches.filter((m) => m.winnerId === playerAId).length
  const bWins = h2hMatches.filter((m) => m.winnerId === playerBId).length

  return { aWins, bWins, matches: h2hMatches }
}

// Get common opponents
export function getCommonOpponents(
  playerAId: string,
  playerBId: string
): {
  opponent: Player
  aResult: { wins: number; losses: number; lastScore?: string }
  bResult: { wins: number; losses: number; lastScore?: string }
}[] {
  const aOpponents = new Set<string>()
  const bOpponents = new Set<string>()

  for (const match of matches) {
    if (match.winnerId === playerAId) aOpponents.add(match.loserId)
    if (match.loserId === playerAId) aOpponents.add(match.winnerId)
    if (match.winnerId === playerBId) bOpponents.add(match.loserId)
    if (match.loserId === playerBId) bOpponents.add(match.winnerId)
  }

  const commonIds = [...aOpponents].filter(
    (id) => bOpponents.has(id) && id !== playerAId && id !== playerBId
  )

  return commonIds.map((oppId) => {
    const opponent = players.find((p) => p.id === oppId)!

    const aMatches = matches.filter(
      (m) =>
        (m.winnerId === playerAId && m.loserId === oppId) ||
        (m.loserId === playerAId && m.winnerId === oppId)
    )
    const bMatches = matches.filter(
      (m) =>
        (m.winnerId === playerBId && m.loserId === oppId) ||
        (m.loserId === playerBId && m.winnerId === oppId)
    )

    return {
      opponent,
      aResult: {
        wins: aMatches.filter((m) => m.winnerId === playerAId).length,
        losses: aMatches.filter((m) => m.loserId === playerAId).length,
        lastScore: aMatches[0]?.score,
      },
      bResult: {
        wins: bMatches.filter((m) => m.winnerId === playerBId).length,
        losses: bMatches.filter((m) => m.loserId === playerBId).length,
        lastScore: bMatches[0]?.score,
      },
    }
  })
}

// Biggest upset this month
export function getBiggestUpset(): Match | null {
  const now = new Date()
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1)

  const monthMatches = matches.filter((m) => new Date(m.date) >= monthStart)

  let biggestUpset: Match | null = null
  let biggestDiff = 0

  for (const match of monthMatches) {
    const diff = match.loserRatingBefore - match.winnerRatingBefore
    if (diff > biggestDiff) {
      biggestDiff = diff
      biggestUpset = match
    }
  }

  return biggestUpset
}

// Top riser this month
export function getTopRiser(): Player | null {
  return players.reduce((top, player) =>
    player.ratingChange > (top?.ratingChange || 0) ? player : top
  , null as Player | null)
}
