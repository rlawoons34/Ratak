export interface Player {
  id: string;
  name: string;
  avatar: string;
  elo: number;
  rank: number;
}

export interface Match {
  winnerId: string;
  loserId: string;
  date: string;
  eloChange: number;
}

export const players: Player[] = [
  {
    id: "p1",
    name: "김태희",
    avatar: "👑",
    elo: 2350,
    rank: 1,
  },
  {
    id: "p2",
    name: "이준호",
    avatar: "⚡",
    elo: 2280,
    rank: 2,
  },
  {
    id: "p3",
    name: "박서연",
    avatar: "🔥",
    elo: 2210,
    rank: 3,
  },
  {
    id: "p4",
    name: "최민수",
    avatar: "🎯",
    elo: 2150,
    rank: 4,
  },
  {
    id: "p5",
    name: "정수진",
    avatar: "⭐",
    elo: 2080,
    rank: 5,
  },
  {
    id: "p6",
    name: "강동원",
    avatar: "💎",
    elo: 1950,
    rank: 6,
  },
  {
    id: "p7",
    name: "윤하영",
    avatar: "🌟",
    elo: 1820,
    rank: 7,
  },
  {
    id: "p8",
    name: "임재범",
    avatar: "🎮",
    elo: 1680,
    rank: 8,
  },
  {
    id: "p9",
    name: "송지은",
    avatar: "🏆",
    elo: 1520,
    rank: 9,
  },
  {
    id: "p10",
    name: "한상욱",
    avatar: "🎲",
    elo: 1350,
    rank: 10,
  },
];

// 실제적인 매치 기록 생성 (순환 승리 포함)
export const matches: Match[] = [
  // 김태희 vs 이준호
  { winnerId: "p1", loserId: "p2", date: "2026-01-15", eloChange: 12 },
  { winnerId: "p1", loserId: "p2", date: "2026-01-20", eloChange: 11 },
  { winnerId: "p2", loserId: "p1", date: "2026-01-25", eloChange: 15 },
  
  // 이준호 vs 박서연
  { winnerId: "p2", loserId: "p3", date: "2026-01-16", eloChange: 13 },
  { winnerId: "p3", loserId: "p2", date: "2026-01-22", eloChange: 16 },
  { winnerId: "p2", loserId: "p3", date: "2026-01-28", eloChange: 14 },
  
  // 박서연 vs 최민수
  { winnerId: "p3", loserId: "p4", date: "2026-01-17", eloChange: 12 },
  { winnerId: "p3", loserId: "p4", date: "2026-01-23", eloChange: 11 },
  { winnerId: "p4", loserId: "p3", date: "2026-01-29", eloChange: 14 },
  
  // 최민수 vs 김태희 (순환 승리)
  { winnerId: "p4", loserId: "p1", date: "2026-01-18", eloChange: 18 },
  { winnerId: "p1", loserId: "p4", date: "2026-01-24", eloChange: 10 },
  
  // 정수진 vs 다른 선수들
  { winnerId: "p5", loserId: "p6", date: "2026-01-19", eloChange: 13 },
  { winnerId: "p5", loserId: "p7", date: "2026-01-21", eloChange: 15 },
  { winnerId: "p3", loserId: "p5", date: "2026-01-26", eloChange: 12 },
  { winnerId: "p2", loserId: "p5", date: "2026-01-27", eloChange: 11 },
  
  // 강동원 vs 윤하영
  { winnerId: "p6", loserId: "p7", date: "2026-01-20", eloChange: 14 },
  { winnerId: "p7", loserId: "p6", date: "2026-01-30", eloChange: 16 },
  
  // 윤하영 vs 임재범
  { winnerId: "p7", loserId: "p8", date: "2026-01-22", eloChange: 13 },
  { winnerId: "p8", loserId: "p7", date: "2026-02-01", eloChange: 15 },
  
  // 임재범 vs 송지은
  { winnerId: "p8", loserId: "p9", date: "2026-01-23", eloChange: 12 },
  { winnerId: "p8", loserId: "p9", date: "2026-01-31", eloChange: 11 },
  
  // 송지은 vs 한상욱
  { winnerId: "p9", loserId: "p10", date: "2026-01-24", eloChange: 14 },
  { winnerId: "p9", loserId: "p10", date: "2026-02-02", eloChange: 13 },
  { winnerId: "p10", loserId: "p9", date: "2026-02-03", eloChange: 16 },
  
  // 크로스 매치
  { winnerId: "p1", loserId: "p5", date: "2026-01-25", eloChange: 10 },
  { winnerId: "p2", loserId: "p6", date: "2026-01-26", eloChange: 11 },
  { winnerId: "p3", loserId: "p7", date: "2026-01-27", eloChange: 12 },
  { winnerId: "p4", loserId: "p8", date: "2026-01-28", eloChange: 13 },
  { winnerId: "p5", loserId: "p9", date: "2026-01-29", eloChange: 14 },
  { winnerId: "p6", loserId: "p10", date: "2026-01-30", eloChange: 15 },
];

export function getPlayer(id: string): Player | undefined {
  return players.find(p => p.id === id);
}

export function getPlayerMatches(playerId: string): Match[] {
  return matches.filter(m => m.winnerId === playerId || m.loserId === playerId);
}

export function getH2HRecord(player1Id: string, player2Id: string): { wins: number; losses: number } {
  const relevantMatches = matches.filter(
    m => (m.winnerId === player1Id && m.loserId === player2Id) ||
         (m.winnerId === player2Id && m.loserId === player1Id)
  );
  
  const wins = relevantMatches.filter(m => m.winnerId === player1Id).length;
  const losses = relevantMatches.filter(m => m.loserId === player1Id).length;
  
  return { wins, losses };
}

export function getCommonOpponents(player1Id: string, player2Id: string): string[] {
  const p1Opponents = new Set<string>();
  const p2Opponents = new Set<string>();
  
  matches.forEach(m => {
    if (m.winnerId === player1Id) p1Opponents.add(m.loserId);
    if (m.loserId === player1Id) p1Opponents.add(m.winnerId);
    if (m.winnerId === player2Id) p2Opponents.add(m.loserId);
    if (m.loserId === player2Id) p2Opponents.add(m.winnerId);
  });
  
  // 서로를 제외하고 공통 상대 찾기
  p1Opponents.delete(player2Id);
  p2Opponents.delete(player1Id);
  
  return Array.from(p1Opponents).filter(id => p2Opponents.has(id));
}

export function getWinRateAgainst(playerId: string, opponentId: string): number {
  const relevantMatches = matches.filter(
    m => (m.winnerId === playerId && m.loserId === opponentId) ||
         (m.winnerId === opponentId && m.loserId === playerId)
  );
  
  if (relevantMatches.length === 0) return 0;
  
  const wins = relevantMatches.filter(m => m.winnerId === playerId).length;
  return wins / relevantMatches.length;
}
