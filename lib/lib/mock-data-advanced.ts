export interface Player {
  id: string
  name: string
  elo: number
  avatar: string
}

export interface Match {
  id: string
  playerAId: string
  playerBId: string
  winnerId: string
  date: string
}

export const players: Player[] = [
  {
    id: "p1",
    name: "김민수",
    elo: 2100,
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=MinSoo",
  },
  {
    id: "p2",
    name: "이지은",
    elo: 1950,
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=JiEun",
  },
  {
    id: "p3",
    name: "박서준",
    elo: 2250,
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=SeoJun",
  },
  {
    id: "p4",
    name: "최유나",
    elo: 1800,
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=YuNa",
  },
  {
    id: "p5",
    name: "정현우",
    elo: 2050,
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=HyunWoo",
  },
  {
    id: "p6",
    name: "강소희",
    elo: 1900,
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=SoHee",
  },
  {
    id: "p7",
    name: "윤재석",
    elo: 2180,
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=JaeSeok",
  },
  {
    id: "p8",
    name: "임수빈",
    elo: 1750,
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=SuBin",
  },
]

// 순환 관계가 있는 경기 결과 데이터
// A가 B를 이기고, B가 C를 이기고, C가 A를 이긴 경우 등 포함
export const matches: Match[] = [
  // 김민수(p1) vs 이지은(p2) - 김민수 2승
  { id: "m1", playerAId: "p1", playerBId: "p2", winnerId: "p1", date: "2024-01-15" },
  { id: "m2", playerAId: "p2", playerBId: "p1", winnerId: "p1", date: "2024-01-22" },
  
  // 김민수(p1) vs 박서준(p3) - 박서준 2승 (순환: 민수가 지은을 이겼지만 서준에게 짐)
  { id: "m3", playerAId: "p1", playerBId: "p3", winnerId: "p3", date: "2024-01-18" },
  { id: "m4", playerAId: "p3", playerBId: "p1", winnerId: "p3", date: "2024-02-01" },
  
  // 이지은(p2) vs 박서준(p3) - 이지은 1승 1패
  { id: "m5", playerAId: "p2", playerBId: "p3", winnerId: "p2", date: "2024-01-20" },
  { id: "m6", playerAId: "p3", playerBId: "p2", winnerId: "p3", date: "2024-02-05" },
  
  // 김민수(p1) vs 최유나(p4) - 김민수 3승
  { id: "m7", playerAId: "p1", playerBId: "p4", winnerId: "p1", date: "2024-01-25" },
  { id: "m8", playerAId: "p4", playerBId: "p1", winnerId: "p1", date: "2024-02-08" },
  { id: "m9", playerAId: "p1", playerBId: "p4", winnerId: "p1", date: "2024-02-15" },
  
  // 이지은(p2) vs 최유나(p4) - 이지은 2승
  { id: "m10", playerAId: "p2", playerBId: "p4", winnerId: "p2", date: "2024-01-28" },
  { id: "m11", playerAId: "p4", playerBId: "p2", winnerId: "p2", date: "2024-02-12" },
  
  // 박서준(p3) vs 최유나(p4) - 박서준 2승
  { id: "m12", playerAId: "p3", playerBId: "p4", winnerId: "p3", date: "2024-02-03" },
  { id: "m13", playerAId: "p4", playerBId: "p3", winnerId: "p3", date: "2024-02-18" },
  
  // 정현우(p5) vs 김민수(p1) - 정현우 1승 1패
  { id: "m14", playerAId: "p5", playerBId: "p1", winnerId: "p5", date: "2024-02-10" },
  { id: "m15", playerAId: "p1", playerBId: "p5", winnerId: "p1", date: "2024-02-20" },
  
  // 정현우(p5) vs 이지은(p2) - 정현우 2승
  { id: "m16", playerAId: "p5", playerBId: "p2", winnerId: "p5", date: "2024-02-14" },
  { id: "m17", playerAId: "p2", playerBId: "p5", winnerId: "p5", date: "2024-02-22" },
  
  // 정현우(p5) vs 박서준(p3) - 박서준 2승
  { id: "m18", playerAId: "p5", playerBId: "p3", winnerId: "p3", date: "2024-02-16" },
  { id: "m19", playerAId: "p3", playerBId: "p5", winnerId: "p3", date: "2024-02-24" },
  
  // 강소희(p6) vs 최유나(p4) - 강소희 2승
  { id: "m20", playerAId: "p6", playerBId: "p4", winnerId: "p6", date: "2024-02-11" },
  { id: "m21", playerAId: "p4", playerBId: "p6", winnerId: "p6", date: "2024-02-19" },
  
  // 강소희(p6) vs 이지은(p2) - 이지은 1승 1패
  { id: "m22", playerAId: "p6", playerBId: "p2", winnerId: "p2", date: "2024-02-13" },
  { id: "m23", playerAId: "p2", playerBId: "p6", winnerId: "p6", date: "2024-02-21" },
  
  // 윤재석(p7) vs 김민수(p1) - 윤재석 1승 1패
  { id: "m24", playerAId: "p7", playerBId: "p1", winnerId: "p7", date: "2024-02-17" },
  { id: "m25", playerAId: "p1", playerBId: "p7", winnerId: "p1", date: "2024-02-25" },
  
  // 윤재석(p7) vs 박서준(p3) - 박서준 2승
  { id: "m26", playerAId: "p7", playerBId: "p3", winnerId: "p3", date: "2024-02-23" },
  { id: "m27", playerAId: "p3", playerBId: "p7", winnerId: "p3", date: "2024-02-27" },
  
  // 임수빈(p8) vs 최유나(p4) - 최유나 2승
  { id: "m28", playerAId: "p8", playerBId: "p4", winnerId: "p4", date: "2024-02-26" },
  { id: "m29", playerAId: "p4", playerBId: "p8", winnerId: "p4", date: "2024-02-28" },
  
  // 임수빈(p8) vs 강소희(p6) - 강소희 2승
  { id: "m30", playerAId: "p8", playerBId: "p6", winnerId: "p6", date: "2024-02-29" },
  { id: "m31", playerAId: "p6", playerBId: "p8", winnerId: "p6", date: "2024-03-02" },
  
  // 추가 순환 관계를 위한 경기들
  // 정현우(p5) vs 최유나(p4) - 정현우 2승
  { id: "m32", playerAId: "p5", playerBId: "p4", winnerId: "p5", date: "2024-03-01" },
  { id: "m33", playerAId: "p4", playerBId: "p5", winnerId: "p5", date: "2024-03-05" },
  
  // 강소희(p6) vs 김민수(p1) - 김민수 2승
  { id: "m34", playerAId: "p6", playerBId: "p1", winnerId: "p1", date: "2024-03-03" },
  { id: "m35", playerAId: "p1", playerBId: "p6", winnerId: "p1", date: "2024-03-07" },
]
