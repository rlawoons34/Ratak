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

export interface MatchHistoryRecord {
  id: string
  date: string
  opponentId: string
  opponentName: string
  opponentRating: number
  myScore: number
  opponentScore: number
  isWin: boolean
  myRatingBefore: number
  myRatingAfter: number
  ratingDelta: number
}

export interface TournamentRecord {
  id: string
  date: string
  name: string
  result: "우승" | "준우승" | "4강" | "8강" | "16강" | "32강" | "조별 예선 (3위)" | "조별 예선 (4위)" | string
  participants: number
  location: string
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

// Helper functions
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

export function getTopRiser(): Player | null {
  return players.reduce((top, player) =>
    player.ratingChange > (top?.ratingChange || 0) ? player : top
  , null as Player | null)
}

// Helper function to get player by ID
export function getPlayerById(id: string): Player | null {
  const player = players.find((p) => p.id === id)
  console.log('[Mock Data] Looking for player ID:', id)
  console.log('[Mock Data] Found player:', player?.name || 'NOT FOUND')
  console.log('[Mock Data] All player IDs:', players.map(p => p.id))
  return player || null
}

// Generate detailed match history for a player (especially for 김재훈)
// For player ID "1" (김재훈), we generate 40+ matches for pagination testing
export function generatePlayerMatchHistory(playerId: string): MatchHistoryRecord[] {
  if (playerId === "1") {
    // 김재훈's match history spanning 6 months (Aug 2025 - Feb 2026) - 40 matches
    return [
      {
        id: "h1",
        date: "2026-02-01",
        opponentId: "2",
        opponentName: "구동영",
        opponentRating: 2113,
        myScore: 3,
        opponentScore: 2,
        isWin: true,
        myRatingBefore: 2130,
        myRatingAfter: 2145,
        ratingDelta: 15,
      },
      {
        id: "h2",
        date: "2026-01-28",
        opponentId: "3",
        opponentName: "백승원",
        opponentRating: 2067,
        myScore: 1,
        opponentScore: 3,
        isWin: false,
        myRatingBefore: 2145,
        myRatingAfter: 2130,
        ratingDelta: -15,
      },
      {
        id: "h3",
        date: "2026-01-25",
        opponentId: "4",
        opponentName: "이준혁",
        opponentRating: 2034,
        myScore: 3,
        opponentScore: 0,
        isWin: true,
        myRatingBefore: 2120,
        myRatingAfter: 2132,
        ratingDelta: 12,
      },
      {
        id: "h4",
        date: "2026-01-20",
        opponentId: "5",
        opponentName: "정민수",
        opponentRating: 2015,
        myScore: 3,
        opponentScore: 2,
        isWin: true,
        myRatingBefore: 2108,
        myRatingAfter: 2120,
        ratingDelta: 12,
      },
      {
        id: "h5",
        date: "2026-01-15",
        opponentId: "13",
        opponentName: "윤성준",
        opponentRating: 1978,
        myScore: 3,
        opponentScore: 1,
        isWin: true,
        myRatingBefore: 2095,
        myRatingAfter: 2108,
        ratingDelta: 13,
      },
      {
        id: "h6",
        date: "2026-01-10",
        opponentId: "6",
        opponentName: "최현우",
        opponentRating: 1987,
        myScore: 3,
        opponentScore: 1,
        isWin: true,
        myRatingBefore: 2082,
        myRatingAfter: 2095,
        ratingDelta: 13,
      },
      {
        id: "h7",
        date: "2026-01-05",
        opponentId: "2",
        opponentName: "구동영",
        opponentRating: 2098,
        myScore: 2,
        opponentScore: 3,
        isWin: false,
        myRatingBefore: 2095,
        myRatingAfter: 2082,
        ratingDelta: -13,
      },
      {
        id: "h8",
        date: "2025-12-28",
        opponentId: "8",
        opponentName: "한동진",
        opponentRating: 1942,
        myScore: 3,
        opponentScore: 0,
        isWin: true,
        myRatingBefore: 2080,
        myRatingAfter: 2095,
        ratingDelta: 15,
      },
      {
        id: "h9",
        date: "2025-12-22",
        opponentId: "14",
        opponentName: "송재원",
        opponentRating: 1956,
        myScore: 3,
        opponentScore: 1,
        isWin: true,
        myRatingBefore: 2067,
        myRatingAfter: 2080,
        ratingDelta: 13,
      },
      {
        id: "h10",
        date: "2025-12-15",
        opponentId: "3",
        opponentName: "백승원",
        opponentRating: 2067,
        myScore: 3,
        opponentScore: 2,
        isWin: true,
        myRatingBefore: 2052,
        myRatingAfter: 2067,
        ratingDelta: 15,
      },
      {
        id: "h11",
        date: "2025-12-08",
        opponentId: "7",
        opponentName: "박지훈",
        opponentRating: 1965,
        myScore: 3,
        opponentScore: 1,
        isWin: true,
        myRatingBefore: 2038,
        myRatingAfter: 2052,
        ratingDelta: 14,
      },
      {
        id: "h12",
        date: "2025-12-01",
        opponentId: "15",
        opponentName: "신동현",
        opponentRating: 1934,
        myScore: 3,
        opponentScore: 2,
        isWin: true,
        myRatingBefore: 2025,
        myRatingAfter: 2038,
        ratingDelta: 13,
      },
      {
        id: "h13",
        date: "2025-11-24",
        opponentId: "9",
        opponentName: "오승환",
        opponentRating: 1918,
        myScore: 3,
        opponentScore: 0,
        isWin: true,
        myRatingBefore: 2010,
        myRatingAfter: 2025,
        ratingDelta: 15,
      },
      {
        id: "h14",
        date: "2025-11-17",
        opponentId: "10",
        opponentName: "서영민",
        opponentRating: 1895,
        myScore: 2,
        opponentScore: 3,
        isWin: false,
        myRatingBefore: 2025,
        myRatingAfter: 2010,
        ratingDelta: -15,
      },
      {
        id: "h15",
        date: "2025-11-10",
        opponentId: "11",
        opponentName: "임태현",
        opponentRating: 1872,
        myScore: 3,
        opponentScore: 1,
        isWin: true,
        myRatingBefore: 2008,
        myRatingAfter: 2023,
        ratingDelta: 15,
      },
      {
        id: "h16",
        date: "2025-11-05",
        opponentId: "12",
        opponentName: "강민재",
        opponentRating: 1845,
        myScore: 3,
        opponentScore: 0,
        isWin: true,
        myRatingBefore: 1995,
        myRatingAfter: 2008,
        ratingDelta: 13,
      },
      {
        id: "h17",
        date: "2025-10-30",
        opponentId: "4",
        opponentName: "이준혁",
        opponentRating: 2034,
        myScore: 2,
        opponentScore: 3,
        isWin: false,
        myRatingBefore: 2008,
        myRatingAfter: 1995,
        ratingDelta: -13,
      },
      {
        id: "h18",
        date: "2025-10-25",
        opponentId: "13",
        opponentName: "윤성준",
        opponentRating: 1978,
        myScore: 3,
        opponentScore: 2,
        isWin: true,
        myRatingBefore: 1982,
        myRatingAfter: 1995,
        ratingDelta: 13,
      },
      {
        id: "h19",
        date: "2025-10-20",
        opponentId: "6",
        opponentName: "최현우",
        opponentRating: 1987,
        myScore: 3,
        opponentScore: 1,
        isWin: true,
        myRatingBefore: 1969,
        myRatingAfter: 1982,
        ratingDelta: 13,
      },
      {
        id: "h20",
        date: "2025-10-15",
        opponentId: "7",
        opponentName: "박지훈",
        opponentRating: 1965,
        myScore: 1,
        opponentScore: 3,
        isWin: false,
        myRatingBefore: 1982,
        myRatingAfter: 1969,
        ratingDelta: -13,
      },
      {
        id: "h21",
        date: "2025-10-10",
        opponentId: "14",
        opponentName: "송재원",
        opponentRating: 1956,
        myScore: 3,
        opponentScore: 0,
        isWin: true,
        myRatingBefore: 1956,
        myRatingAfter: 1969,
        ratingDelta: 13,
      },
      {
        id: "h22",
        date: "2025-10-05",
        opponentId: "8",
        opponentName: "한동진",
        opponentRating: 1942,
        myScore: 3,
        opponentScore: 2,
        isWin: true,
        myRatingBefore: 1943,
        myRatingAfter: 1956,
        ratingDelta: 13,
      },
      {
        id: "h23",
        date: "2025-09-28",
        opponentId: "15",
        opponentName: "신동현",
        opponentRating: 1934,
        myScore: 3,
        opponentScore: 1,
        isWin: true,
        myRatingBefore: 1930,
        myRatingAfter: 1943,
        ratingDelta: 13,
      },
      {
        id: "h24",
        date: "2025-09-22",
        opponentId: "9",
        opponentName: "오승환",
        opponentRating: 1918,
        myScore: 2,
        opponentScore: 3,
        isWin: false,
        myRatingBefore: 1943,
        myRatingAfter: 1930,
        ratingDelta: -13,
      },
      {
        id: "h25",
        date: "2025-09-18",
        opponentId: "10",
        opponentName: "서영민",
        opponentRating: 1895,
        myScore: 3,
        opponentScore: 0,
        isWin: true,
        myRatingBefore: 1917,
        myRatingAfter: 1930,
        ratingDelta: 13,
      },
      {
        id: "h26",
        date: "2025-09-12",
        opponentId: "11",
        opponentName: "임태현",
        opponentRating: 1872,
        myScore: 3,
        opponentScore: 1,
        isWin: true,
        myRatingBefore: 1904,
        myRatingAfter: 1917,
        ratingDelta: 13,
      },
      {
        id: "h27",
        date: "2025-09-08",
        opponentId: "12",
        opponentName: "강민재",
        opponentRating: 1845,
        myScore: 3,
        opponentScore: 2,
        isWin: true,
        myRatingBefore: 1891,
        myRatingAfter: 1904,
        ratingDelta: 13,
      },
      {
        id: "h28",
        date: "2025-09-02",
        opponentId: "6",
        opponentName: "최현우",
        opponentRating: 1987,
        myScore: 1,
        opponentScore: 3,
        isWin: false,
        myRatingBefore: 1904,
        myRatingAfter: 1891,
        ratingDelta: -13,
      },
      {
        id: "h29",
        date: "2025-08-28",
        opponentId: "13",
        opponentName: "윤성준",
        opponentRating: 1978,
        myScore: 3,
        opponentScore: 0,
        isWin: true,
        myRatingBefore: 1878,
        myRatingAfter: 1891,
        ratingDelta: 13,
      },
      {
        id: "h30",
        date: "2025-08-24",
        opponentId: "7",
        opponentName: "박지훈",
        opponentRating: 1965,
        myScore: 3,
        opponentScore: 1,
        isWin: true,
        myRatingBefore: 1865,
        myRatingAfter: 1878,
        ratingDelta: 13,
      },
      {
        id: "h31",
        date: "2025-08-20",
        opponentId: "14",
        opponentName: "송재원",
        opponentRating: 1956,
        myScore: 2,
        opponentScore: 3,
        isWin: false,
        myRatingBefore: 1878,
        myRatingAfter: 1865,
        ratingDelta: -13,
      },
      {
        id: "h32",
        date: "2025-08-15",
        opponentId: "8",
        opponentName: "한동진",
        opponentRating: 1942,
        myScore: 3,
        opponentScore: 2,
        isWin: true,
        myRatingBefore: 1852,
        myRatingAfter: 1865,
        ratingDelta: 13,
      },
      {
        id: "h33",
        date: "2025-08-10",
        opponentId: "15",
        opponentName: "신동현",
        opponentRating: 1934,
        myScore: 3,
        opponentScore: 0,
        isWin: true,
        myRatingBefore: 1839,
        myRatingAfter: 1852,
        ratingDelta: 13,
      },
      {
        id: "h34",
        date: "2025-08-05",
        opponentId: "9",
        opponentName: "오승환",
        opponentRating: 1918,
        myScore: 3,
        opponentScore: 1,
        isWin: true,
        myRatingBefore: 1826,
        myRatingAfter: 1839,
        ratingDelta: 13,
      },
      {
        id: "h35",
        date: "2025-07-30",
        opponentId: "10",
        opponentName: "서영민",
        opponentRating: 1895,
        myScore: 0,
        opponentScore: 3,
        isWin: false,
        myRatingBefore: 1839,
        myRatingAfter: 1826,
        ratingDelta: -13,
      },
      {
        id: "h36",
        date: "2025-07-25",
        opponentId: "11",
        opponentName: "임태현",
        opponentRating: 1872,
        myScore: 3,
        opponentScore: 2,
        isWin: true,
        myRatingBefore: 1813,
        myRatingAfter: 1826,
        ratingDelta: 13,
      },
      {
        id: "h37",
        date: "2025-07-20",
        opponentId: "12",
        opponentName: "강민재",
        opponentRating: 1845,
        myScore: 3,
        opponentScore: 1,
        isWin: true,
        myRatingBefore: 1800,
        myRatingAfter: 1813,
        ratingDelta: 13,
      },
      {
        id: "h38",
        date: "2025-07-15",
        opponentId: "6",
        opponentName: "최현우",
        opponentRating: 1987,
        myScore: 1,
        opponentScore: 3,
        isWin: false,
        myRatingBefore: 1813,
        myRatingAfter: 1800,
        ratingDelta: -13,
      },
      {
        id: "h39",
        date: "2025-07-10",
        opponentId: "13",
        opponentName: "윤성준",
        opponentRating: 1978,
        myScore: 3,
        opponentScore: 0,
        isWin: true,
        myRatingBefore: 1787,
        myRatingAfter: 1800,
        ratingDelta: 13,
      },
      {
        id: "h40",
        date: "2025-07-05",
        opponentId: "7",
        opponentName: "박지훈",
        opponentRating: 1965,
        myScore: 3,
        opponentScore: 2,
        isWin: true,
        myRatingBefore: 1774,
        myRatingAfter: 1787,
        ratingDelta: 13,
      },
    ]
  }
  
  // For other players, generate basic history from matches array
  const playerMatches: MatchHistoryRecord[] = []
  
  matches.forEach((match, index) => {
    if (match.winnerId === playerId) {
      playerMatches.push({
        id: `h_${match.id}`,
        date: match.date,
        opponentId: match.loserId,
        opponentName: match.loserName,
        opponentRating: match.loserRatingBefore,
        myScore: parseInt(match.score.split(":")[0]),
        opponentScore: parseInt(match.score.split(":")[1]),
        isWin: true,
        myRatingBefore: match.winnerRatingBefore,
        myRatingAfter: match.winnerRatingBefore + match.ratingChange,
        ratingDelta: match.ratingChange,
      })
    } else if (match.loserId === playerId) {
      playerMatches.push({
        id: `h_${match.id}`,
        date: match.date,
        opponentId: match.winnerId,
        opponentName: match.winnerName,
        opponentRating: match.winnerRatingBefore,
        myScore: parseInt(match.score.split(":")[1]),
        opponentScore: parseInt(match.score.split(":")[0]),
        isWin: false,
        myRatingBefore: match.loserRatingBefore,
        myRatingAfter: match.loserRatingBefore - match.ratingChange,
        ratingDelta: -match.ratingChange,
      })
    }
  })
  
  return playerMatches.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
}

// Generate tournament history for a player (especially for 김재훈)
export function generatePlayerTournamentHistory(playerId: string): TournamentRecord[] {
  if (playerId === "1") {
    // 김재훈's tournament history - includes all result types for testing
    return [
      {
        id: "t1",
        date: "2026-01-15",
        name: "2026 신년 탁구 오픈",
        result: "우승",
        participants: 32,
        location: "한양대학교 ERICA 체육관",
      },
      {
        id: "t2",
        date: "2025-12-20",
        name: "겨울 대학 탁구 리그",
        result: "준우승",
        participants: 24,
        location: "서울대학교 체육관",
      },
      {
        id: "t3",
        date: "2025-11-10",
        name: "가을 토너먼트",
        result: "4강",
        participants: 16,
        location: "연세대학교 체육관",
      },
      {
        id: "t4",
        date: "2025-10-05",
        name: "수도권 대학 선수권 대회",
        result: "16강",
        participants: 64,
        location: "고려대학교 체육관",
      },
      {
        id: "t5",
        date: "2025-09-15",
        name: "추석 특별 토너먼트",
        result: "8강",
        participants: 48,
        location: "성균관대학교 체육관",
      },
      {
        id: "t6",
        date: "2025-08-20",
        name: "여름 오픈 챔피언십",
        result: "32강",
        participants: 128,
        location: "한양대학교 서울캠퍼스",
      },
      {
        id: "t7",
        date: "2025-07-10",
        name: "ERICA 여름 리그",
        result: "조별 예선 (3위)",
        participants: 20,
        location: "한양대학교 ERICA 체육관",
      },
      {
        id: "t8",
        date: "2025-06-15",
        name: "초여름 탁구 페스티벌",
        result: "조별 예선 (4위)",
        participants: 24,
        location: "중앙대학교 체육관",
      },
    ]
  }
  
  // Generate tournament history for other players
  const tournaments: TournamentRecord[] = []
  const playerNum = parseInt(playerId)
  
  // All players have at least some tournament participation
  if (playerNum >= 2 && playerNum <= 15) {
    // Recent tournaments (varied by player)
    const baseTournaments = [
      {
        id: `t${playerId}-1`,
        date: "2026-01-15",
        name: "2026 신년 탁구 오픈",
        result: playerNum <= 3 ? "4강" : playerNum <= 5 ? "8강" : "16강",
        participants: 32,
        location: "한양대학교 ERICA 체육관",
      },
      {
        id: `t${playerId}-2`,
        date: "2025-12-20",
        name: "겨울 대학 탁구 리그",
        result: playerNum === 2 ? "준우승" : playerNum <= 4 ? "8강" : "16강",
        participants: 24,
        location: "서울대학교 체육관",
      },
      {
        id: `t${playerId}-3`,
        date: "2025-11-10",
        name: "가을 토너먼트",
        result: playerNum <= 5 ? "8강" : playerNum <= 8 ? "16강" : "32강",
        participants: 48,
        location: "연세대학교 체육관",
      },
    ]
    
    // Top players (2-5) have more tournament history
    if (playerNum <= 5) {
      tournaments.push(
        ...baseTournaments,
        {
          id: `t${playerId}-4`,
          date: "2025-10-05",
          name: "수도권 대학 선수권 대회",
          result: "16강",
          participants: 64,
          location: "고려대학교 체육관",
        },
        {
          id: `t${playerId}-5`,
          date: "2025-09-15",
          name: "추석 특별 토너먼트",
          result: playerNum === 2 ? "4강" : "8강",
          participants: 48,
          location: "성균관대학교 체육관",
        }
      )
    } else {
      // Mid-tier players (6-15) have basic tournament history
      tournaments.push(...baseTournaments)
    }
  }
  
  return tournaments
}
