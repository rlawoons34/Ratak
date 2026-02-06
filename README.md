# 🏓 TakuRating - 대학 탁구 레이팅 시스템

**"직감이 아닌 데이터로, 당신의 탁구를 증명하세요."**

USATT(미국 탁구 협회) 공식 알고리즘 기반의 실시간 랭킹 및 데이터 분석 플랫폼입니다.

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/your-username/ratak)

## 🌐 라이브 데모

🚀 **배포 URL**: [https://your-project.vercel.app](https://your-project.vercel.app) (배포 후 업데이트)

## ✨ 주요 기능

### 1. 🏆 실시간 랭킹 시스템
- USATT 공식 레이팅 알고리즘 적용
- 학교별, 대학부별, 동아리부별 다중 필터링
- 경기 결과 입력 즉시 랭킹 자동 업데이트

### 2. ⚔️ 전적 비교 & 승률 예측 (Compare)
- **직접 대결 (H2H)**: 두 선수 간 역대 전적
- **삼각 비교 (Triangle Logic)**: 공통 상대 분석을 통한 간접 비교
- **AI 승률 예측**: Elo 기반 확률적 승률 계산
- **순환 관계 감지**: A > B > C > A 자동 탐지

### 3. 👤 선수 프로필
- 레이팅 변화 그래프
- 전체 경기 히스토리
- 상세 통계 (승률, 총 경기 수, 30일 변화량)

### 4. 🏆 토너먼트 시스템
- 리그전, 오픈 대회, 선수권 관리
- 대회별 성적 기록
- 개인별 대회 히스토리

### 5. 🏫 학교 랭킹
- 학교별 평균 레이팅 산출
- 학교 대항전 통계
- 소속 선수 목록 관리

## 🛠️ 기술 스택

- **Frontend**: Next.js 15 (App Router), TypeScript, Tailwind CSS
- **Backend**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth
- **UI Components**: Shadcn UI
- **Icons**: Lucide React
- **레이팅 시스템**: USATT Official Algorithm
- **보안**: Row Level Security (RLS)
- **패키지 매니저**: pnpm (빠르고 효율적)

## 🚀 빠른 시작 (로컬 개발)

> **참고**: 이 프로젝트는 `pnpm`을 사용합니다. [pnpm 설치 가이드](./PNPM_GUIDE.md)

### 1. Repository Clone

```bash
git clone https://github.com/your-username/ratak.git
cd ratak
```

### 2. 환경 설정

```bash
# 패키지 설치
pnpm install

# 환경변수 설정
cp .env.example .env.local
# .env.local 파일에 Supabase 정보 입력
```

### 3. 데이터베이스 설정

```bash
# Supabase SQL Editor에서 마이그레이션 실행
# 1. supabase/migrations/001_initial_schema.sql
# 2. supabase/migrations/002_usatt_rating_function.sql
# 3. MIGRATE_CLUB_DIVISION_TO_INTEGER.sql (선택)
```

자세한 설명: [SUPABASE_SETUP.md](./SUPABASE_SETUP.md)

### 4. 샘플 데이터 입력

```bash
# TypeScript 스크립트로 샘플 데이터 입력
npm install tsx dotenv
npx tsx scripts/seed-data.ts
```

자세한 설명: [DATA_INPUT_GUIDE.md](./DATA_INPUT_GUIDE.md)

### 5. 개발 서버 실행

```bash
pnpm run dev
```

브라우저에서 [http://localhost:3000](http://localhost:3000) 접속

---

## 🌐 Vercel 배포

### 원클릭 배포

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/your-username/ratak)

### 수동 배포

1. **Vercel 계정 연결**: https://vercel.com
2. **Repository Import**: GitHub repository 선택
3. **환경변수 설정**: 
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE` (권장)
4. **Deploy 클릭**

**📌 pnpm 버전 고정**: 프로젝트는 `pnpm@10.28.2`를 사용하도록 설정되어 있습니다.
- `package.json`의 `packageManager` 필드
- `vercel.json`의 빌드 설정

자세한 가이드: [VERCEL_DEPLOYMENT.md](./VERCEL_DEPLOYMENT.md)

---

## 🔧 주요 특징

## 📁 프로젝트 구조

```
├── app/                       # Next.js App Router
│   ├── (auth)/               # 인증 관련 페이지
│   ├── (dashboard)/          # 메인 대시보드
│   ├── admin/                # 관리자 페이지
│   ├── compare/              # 전적 비교 페이지
│   ├── players/              # 선수 프로필
│   ├── schools/              # 학교 랭킹
│   └── tournaments/          # 토너먼트
├── components/
│   ├── ui/                   # Shadcn UI 컴포넌트
│   └── ...                   # 커스텀 컴포넌트
├── lib/
│   ├── supabase.ts           # Supabase 클라이언트
│   ├── compare-logic.ts      # 전적 비교 로직
│   └── utils.ts              # 유틸리티 함수
├── supabase/
│   └── migrations/           # 데이터베이스 마이그레이션
├── scripts/
│   ├── seed-data.ts          # 데이터 입력 스크립트
│   └── import-from-csv.ts    # CSV 가져오기
├── types/
│   └── database.ts           # TypeScript 타입 정의
└── data/
    ├── schools.csv           # 학교 데이터
    └── players.csv           # 선수 데이터
```

## 🧮 레이팅 시스템

### USATT 레이팅 알고리즘

- **초기 레이팅**: 1500점
- **점수 변동**: 레이팅 차이에 따라 8~50점
- **언더독 보너스**: 낮은 선수가 이기면 추가 점수
- **자동 계산**: 경기 입력 즉시 트리거로 업데이트

### Elo 승률 예측 공식

```
P(A wins) = 1 / (1 + 10^((RatingB - RatingA) / 400))
```

- `P(A wins)`: 선수 A가 이길 확률
- `RatingA`: 선수 A의 Elo 레이팅
- `RatingB`: 선수 B의 Elo 레이팅

## 📊 데이터베이스 구조

### 핵심 테이블

**profiles** - 사용자 계정
- `id`: UUID (auth.users 연동)
- `role`: 'player' 또는 'admin'
- `display_name`: 표시 이름

**players** - 선수 데이터
- `id`: UUID
- `name`: 선수 이름
- `school_id`: 소속 학교
- `uni_division`: 대학부 (0부/1부/2부/3부)
- `club_division`: 동아리부 (-2부~8부, INTEGER)
- `rating`: 레이팅 점수 (기본 1500)
- `user_id`: profiles 연동 (선택)

**schools** - 학교
- `id`: UUID
- `name`: 학교명
- `code`: 학교 코드 (고유)

**matches** - 경기 기록
- `id`: UUID
- `winner_id`: 승자 ID
- `loser_id`: 패자 ID
- `score`: 점수 (예: "3-1")
- `delta_winner`: 승자 레이팅 변화
- `delta_loser`: 패자 레이팅 변화
- `event_id`: 토너먼트 연동 (선택)

**rating_history** - 레이팅 히스토리
- `match_id`: 경기 ID
- `player_id`: 선수 ID
- `rating_before`: 경기 전 레이팅
- `rating_after`: 경기 후 레이팅
- `delta`: 변화량

**tournaments** - 토너먼트
- `name`: 대회명
- `location`: 장소
- `event_date`: 일시
- `tournament_type`: 'league', 'open', 'championship'

### 뷰 & 함수

**player_statistics** - 선수 통계 (자동 계산)
- 총 경기 수, 승/패, 승률
- 최근 30일 레이팅 변화

**register_match_result()** - 경기 등록 RPC 함수
**calculate_usatt_delta()** - 레이팅 계산 함수
**get_player_match_history()** - 경기 히스토리 조회

## 📚 문서

- **패키지 매니저**: [pnpm 가이드](./PNPM_GUIDE.md) | [마이그레이션](./PNPM_MIGRATION.md)
- **배포 가이드**: [Vercel 배포](./VERCEL_DEPLOYMENT.md) | [빠른 시작](./DEPLOY_QUICK_START.md) | [환경변수](./VERCEL_ENV_VARIABLES.md)
- **사용자 가이드**: [상세](./USER_GUIDE.md) | [간단](./USER_GUIDE_SIMPLE.md)
- **관리자 매뉴얼**: [Admin Guide](./ADMIN_MANUAL.md)
- **개발자 가이드**: [데이터 입력](./DATA_INPUT_GUIDE.md) | [Supabase 설정](./SUPABASE_SETUP.md)
- **변경 사항**: [Changelog](./CHANGELOG_USER_GUIDE.md) | [동아리부 마이그레이션](./CLUB_DIVISION_MIGRATION_REPORT.md)

## 🚀 빠른 시작 (로컬 개발)

### ✅ 계정 없이도 참여 가능
선수 등록만으로 즉시 경기 참여. 원하면 나중에 계정 연동.

### ✅ 자동화된 레이팅 시스템
경기 입력 즉시 USATT 알고리즘으로 자동 계산 및 업데이트.

### ✅ 이중 부서 관리
대학부(0/1/2/3부) + 동아리부(-2~8부) 독립 랭킹.

### ✅ 삼각 비교 로직
한 번도 안 붙어본 상대도 공통 상대 분석으로 예측.

### ✅ 토너먼트 지원
대회 정보 관리 및 개인별 대회 기록.

## 🚧 개발 상태

| 기능 | 상태 |
|------|------|
| 데이터베이스 스키마 | ✅ 완료 |
| 레이팅 시스템 | ✅ 완료 |
| 인증 시스템 | ✅ 완료 |
| 랭킹 페이지 | 🚧 진행중 |
| 전적 비교 | 🚧 진행중 |
| 선수 프로필 | 🚧 진행중 |
| 관리자 페이지 | 🚧 진행중 |
| 토너먼트 | 📋 계획됨 |

## 🤝 기여하기

버그 제보 및 기능 제안은 Issues를 통해 부탁드립니다.

## 라이선스

MIT
