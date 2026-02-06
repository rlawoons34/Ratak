# 🚀 Supabase Database Setup Guide

이 가이드는 TakuRating 프로젝트의 Supabase 데이터베이스를 설정하는 방법을 안내합니다.

---

## 📋 Prerequisites

1. **Supabase 계정 생성**
   - https://supabase.com 에서 무료 계정 생성
   - 새 프로젝트 생성 (Region: Singapore 또는 가까운 지역 선택)

2. **Node.js 패키지 설치**
   ```bash
   pnpm add @supabase/supabase-js
   ```

---

## 🔧 Step 1: Environment Variables 설정

1. 프로젝트 루트에 `.env.local` 파일 생성:
   ```bash
   cp .env.local.example .env.local
   ```

2. Supabase Dashboard에서 값 가져오기:
   - **Dashboard → Settings → API**
   - `Project URL` → `NEXT_PUBLIC_SUPABASE_URL`에 복사
   - `anon public` key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`에 복사

---

## 🗄️ Step 2: Database Schema 생성

### Option A: Supabase SQL Editor 사용 (권장)

1. **Supabase Dashboard → SQL Editor** 이동

2. **첫 번째 Migration 실행:**
   - `supabase/migrations/001_initial_schema.sql` 파일 내용 복사
   - SQL Editor에 붙여넣기
   - **RUN** 버튼 클릭

3. **두 번째 Migration 실행:**
   - `supabase/migrations/002_usatt_rating_function.sql` 파일 내용 복사
   - SQL Editor에 붙여넣기
   - **RUN** 버튼 클릭

### Option B: Supabase CLI 사용

```bash
# Supabase CLI 설치
npm install -g supabase

# 프로젝트 연결
supabase link --project-ref your-project-ref

# Migration 실행
supabase db push
```

---

## ✅ Step 3: 테이블 생성 확인

Supabase Dashboard → **Table Editor**에서 다음 테이블들이 생성되었는지 확인:

- ✅ `profiles`
- ✅ `schools`
- ✅ `players`
- ✅ `tournaments`
- ✅ `matches`
- ✅ `rating_history`
- ✅ `tournament_results`

---

## 🔐 Step 4: RLS (Row Level Security) 확인

각 테이블에 RLS가 활성화되어 있는지 확인:

**Table Editor → 각 테이블 → Policies 탭**

모든 테이블에 다음과 같은 정책이 있어야 합니다:
- 📖 **읽기**: 모두 허용 (Public)
- ✏️ **쓰기**: Admin만 허용

---

## 👤 Step 5: 첫 번째 Admin 사용자 생성

### 5.1 사용자 가입

1. 앱에서 회원가입 (또는 Supabase Dashboard → Authentication → Users)
2. 이메일 인증 완료

### 5.2 Admin 권한 부여

**SQL Editor에서 실행:**

```sql
-- 사용자의 UUID를 확인
SELECT id, email FROM auth.users;

-- 해당 사용자를 admin으로 설정
INSERT INTO profiles (id, role, display_name)
VALUES (
  'YOUR_USER_UUID_HERE',
  'admin',
  'Admin User'
);
```

---

## 🎯 Step 6: 샘플 데이터 입력 (Optional)

테스트를 위해 샘플 선수와 경기 데이터를 입력합니다.

```sql
-- 샘플 선수 추가
INSERT INTO players (name, school_id, uni_division, club_division, rating)
SELECT 
  '김재훈',
  (SELECT id FROM schools WHERE code = 'HYU'),
  '3부',
  'A',
  1500;

INSERT INTO players (name, school_id, uni_division, club_division, rating)
SELECT 
  '구동영',
  (SELECT id FROM schools WHERE code = 'YU'),
  '1부',
  'A',
  1500;

-- 샘플 경기 등록 (RPC 사용)
SELECT register_match_result(
  (SELECT id FROM players WHERE name = '김재훈'),
  (SELECT id FROM players WHERE name = '구동영'),
  '3:1',
  NOW()
);
```

---

## 🧪 Step 7: API 테스트

프로젝트를 실행하고 API가 정상 작동하는지 확인:

```bash
pnpm run dev
```

브라우저에서 확인:
- http://localhost:3000/players → 선수 목록이 보여야 함
- http://localhost:3000/players/1 → 선수 상세 페이지

---

## 📊 주요 기능 사용법

### 1. 경기 결과 등록 (Admin Only)

```typescript
import { rpc } from '@/lib/supabase'

// 경기 결과 등록
const { data, error } = await rpc.registerMatch({
  winnerId: 'winner-uuid',
  loserId: 'loser-uuid',
  score: '3:1',
  playedAt: new Date().toISOString(),
})
```

**자동으로 처리되는 것들:**
- ✅ USATT 점수 계산 (Exchange Chart)
- ✅ 선수 레이팅 자동 업데이트
- ✅ `rating_history` 테이블에 2개 레코드 생성

### 2. 선수 경기 기록 조회

```typescript
import { rpc } from '@/lib/supabase'

// 선수의 경기 기록 가져오기 (페이지네이션)
const { data, error } = await rpc.getPlayerMatchHistory(
  'player-uuid',
  10,  // limit
  0    // offset
)
```

### 3. 선수 통계 조회 (View 사용)

```typescript
import { views } from '@/lib/supabase'

// 계산된 통계 포함 (승률, 총 경기 수 등)
const { data, error } = await views.playerStatistics()
  .select('*')
  .eq('id', 'player-uuid')
  .single()
```

---

## 🔍 Troubleshooting

### 문제: Migration 실행 시 에러 발생

**해결책:**
1. 모든 테이블 삭제 후 다시 실행
2. Supabase Dashboard → Database → Tables에서 수동 삭제

### 문제: RLS 정책 위반 에러

**해결책:**
- 현재 사용자가 admin 권한이 있는지 확인
- `profiles` 테이블에 role = 'admin' 설정 확인

### 문제: Trigger가 작동하지 않음

**해결책:**
- SQL Editor에서 Trigger 확인:
  ```sql
  SELECT * FROM information_schema.triggers
  WHERE trigger_schema = 'public';
  ```

---

## 📚 참고 자료

- [Supabase Documentation](https://supabase.com/docs)
- [PostgreSQL Triggers](https://www.postgresql.org/docs/current/sql-createtrigger.html)
- [Row Level Security](https://supabase.com/docs/guides/auth/row-level-security)

---

## ✅ Checklist

설정 완료 확인:

- [ ] Supabase 프로젝트 생성
- [ ] `.env.local` 파일 설정
- [ ] Migration 001 실행 (테이블 생성)
- [ ] Migration 002 실행 (함수 생성)
- [ ] RLS 정책 확인
- [ ] Admin 사용자 생성
- [ ] 샘플 데이터 입력 (Optional)
- [ ] 앱에서 데이터 조회 테스트

모든 항목이 완료되면 TakuRating을 사용할 준비가 완료되었습니다! 🎉
