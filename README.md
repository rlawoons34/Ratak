# 탁구 랭킹 트래커 (Table Tennis Rank Tracker)

AI 기반 선수 분석 및 승률 예측 시스템입니다.

## 주요 기능

### 1. 직접 대결 기록 (Direct H2H)
- 두 선수 간 역대 전적 확인
- 승/패 통계 및 승률 시각화

### 2. 공통 상대 분석 (Triangle Logic)
- 공통으로 상대한 선수들의 경기 결과 분석
- 삼각 관계 로직을 통한 상대적 실력 평가
- 순환 관계 (A > B > C > A) 감지 및 표시

### 3. AI 승률 예측 (Elo-based Prediction)
- 표준 Elo 레이팅 공식 사용
- 확률 기반 승률 계산 및 시각화
- 실시간 예측 결과 제공

## 기술 스택

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: Shadcn UI
- **Icons**: Lucide React

## 시작하기

### 설치

\`\`\`bash
npm install
\`\`\`

### 개발 서버 실행

\`\`\`bash
npm run dev
\`\`\`

브라우저에서 [http://localhost:3000](http://localhost:3000)을 열어 확인하세요.

### 빌드

\`\`\`bash
npm run build
npm start
\`\`\`

## 프로젝트 구조

\`\`\`
├── app/
│   ├── compare/
│   │   └── page.tsx          # H2H 비교 페이지
│   ├── layout.tsx
│   ├── page.tsx               # 홈 페이지
│   └── globals.css
├── components/
│   └── ui/                    # Shadcn UI 컴포넌트
├── lib/
│   ├── mock-data-advanced.ts  # 모의 데이터
│   ├── compare-logic.ts       # 비교 로직
│   └── utils.ts
└── package.json
\`\`\`

## Elo 예측 공식

\`\`\`
P(A wins) = 1 / (1 + 10^((RatingB - RatingA) / 400))
\`\`\`

- `P(A wins)`: 선수 A가 이길 확률
- `RatingA`: 선수 A의 Elo 레이팅
- `RatingB`: 선수 B의 Elo 레이팅

## 데이터 구조

### Player
- `id`: 선수 고유 ID
- `name`: 선수 이름
- `elo`: Elo 레이팅 (1200-2400)
- `avatar`: 아바타 이미지 URL

### Match
- `id`: 경기 고유 ID
- `playerAId`: 플레이어 A ID
- `playerBId`: 플레이어 B ID
- `winnerId`: 승자 ID
- `date`: 경기 날짜

## 향후 개선 사항

- [ ] 실제 데이터베이스 연동
- [ ] 경기 기록 추가 기능
- [ ] 선수 프로필 페이지
- [ ] 전체 랭킹 리스트
- [ ] 통계 대시보드
- [ ] 다크 모드 토글

## 라이선스

MIT
