# 📊 실제 데이터 입력 가이드

Supabase 데이터베이스에 실제 데이터를 입력하는 5가지 방법을 안내합니다.

---

## 🎯 방법 1: SQL 스크립트 직접 실행 (추천 - 대량 데이터)

### 장점
- ✅ 가장 빠르고 확실함
- ✅ 대량 데이터 입력에 최적
- ✅ 트랜잭션 보장

### 사용법

#### A. 샘플 데이터로 테스트
```bash
# Supabase SQL Editor에서 실행
# 파일: INSERT_SAMPLE_DATA.sql
```

1. Supabase Dashboard 접속: https://lrmsxxlwfjsvrkfxwhdt.supabase.co
2. 왼쪽 메뉴에서 `SQL Editor` 클릭
3. `INSERT_SAMPLE_DATA.sql` 파일 내용 복사
4. 붙여넣기 후 `Run` 버튼 클릭

#### B. 실제 데이터 입력
```bash
# 파일: INSERT_YOUR_DATA_TEMPLATE.sql
```

1. `INSERT_YOUR_DATA_TEMPLATE.sql` 파일을 복사
2. 실제 데이터로 수정:
   - 학교명, 학교코드 수정
   - 선수 이름, 소속, 부서 수정
   - 레이팅은 1500으로 시작 (기본값)
3. Supabase SQL Editor에서 실행

---

## 🎯 방법 2: TypeScript 스크립트 (추천 - 프로그래밍 방식)

### 장점
- ✅ 타입 안정성
- ✅ 에러 처리 자동화
- ✅ 데이터 검증 가능

### 사용법

#### 1. 필요한 패키지 설치
```bash
npm install tsx @supabase/supabase-js
```

#### 2. 스크립트 수정
`scripts/seed-data.ts` 파일을 열어서 데이터 수정:

```typescript
const schools = [
  { name: '한양대학교', code: 'HYU' },
  // 실제 학교 추가...
]

const players = [
  { name: '김민수', schoolCode: 'HYU', uniDivision: '1부', clubDivision: 'A', rating: 1650 },
  // 실제 선수 추가...
]
```

#### 3. 스크립트 실행
```bash
npx tsx scripts/seed-data.ts
```

---

## 🎯 방법 3: CSV 파일 가져오기 (추천 - 엑셀 데이터)

### 장점
- ✅ 엑셀에서 작업 가능
- ✅ 비개발자도 쉽게 사용
- ✅ 대량 데이터 관리 편리

### 사용법

#### 1. CSV 파일 준비

**schools.csv**
```csv
학교명,학교코드
한양대학교,HYU
연세대학교,YU
```

**players.csv**
```csv
이름,학교코드,대학부,동아리부,레이팅
김민수,HYU,1부,A,1650
이준호,HYU,1부,A,1580
```

#### 2. 파일 위치
- `data/schools.csv`
- `data/players.csv`

#### 3. 스크립트 실행
```bash
npx tsx scripts/import-from-csv.ts
```

#### 4. 엑셀에서 CSV로 저장하는 방법
1. 엑셀에서 데이터 작성
2. `파일` → `다른 이름으로 저장`
3. 파일 형식: `CSV UTF-8 (쉼표로 분리)(*.csv)` 선택
4. `data` 폴더에 저장

---

## 🎯 방법 4: Supabase Dashboard (추천 - 소량 데이터)

### 장점
- ✅ GUI로 직관적
- ✅ 코드 작성 불필요
- ✅ 즉시 확인 가능

### 사용법

1. **Supabase Dashboard 접속**
   - URL: https://lrmsxxlwfjsvrkfxwhdt.supabase.co
   - 로그인

2. **Table Editor 열기**
   - 왼쪽 메뉴에서 `Table Editor` 클릭

3. **학교 데이터 입력**
   - `schools` 테이블 선택
   - `Insert row` 버튼 클릭
   - 데이터 입력:
     - `name`: 한양대학교
     - `code`: HYU
   - `Save` 클릭

4. **선수 데이터 입력**
   - `players` 테이블 선택
   - `Insert row` 버튼 클릭
   - 데이터 입력:
     - `name`: 김민수
     - `school_id`: (드롭다운에서 학교 선택)
     - `uni_division`: 1부
     - `club_division`: A
     - `rating`: 1500
   - `Save` 클릭

---

## 🎯 방법 5: API 엔드포인트 (개발 중인 경우)

### 장점
- ✅ 웹 인터페이스로 입력 가능
- ✅ 실제 사용자 경험 테스트
- ✅ 권한 검증 포함

### 사용법

#### 1. Admin 페이지 접속
```
http://localhost:3000/admin/players
```

#### 2. 선수 등록 버튼 클릭

#### 3. 폼 작성 후 제출

---

## 📋 데이터 입력 순서

반드시 이 순서대로 입력하세요:

1. **schools** (학교) ← 먼저 입력
2. **players** (선수) ← school_id 필요
3. **tournaments** (토너먼트) ← 선택사항
4. **matches** (경기) ← player_id 필요

---

## 🔍 데이터 확인 방법

### SQL로 확인
```sql
-- 학교 목록
SELECT * FROM schools ORDER BY name;

-- 선수 목록 (학교명 포함)
SELECT 
  p.name as 선수명,
  s.name as 학교,
  p.uni_division as 대학부,
  p.club_division as 동아리부,
  p.rating as 레이팅
FROM players p
JOIN schools s ON s.id = p.school_id
ORDER BY p.rating DESC;

-- 선수 통계
SELECT * FROM player_statistics ORDER BY rating DESC;
```

### TypeScript로 확인
```typescript
const { data } = await supabase
  .from('player_statistics')
  .select('*')
  .order('rating', { ascending: false })

console.table(data)
```

---

## ⚠️ 주의사항

### 1. 학교 코드는 고유해야 함
```sql
-- ❌ 오류 발생
INSERT INTO schools (name, code) VALUES ('한양대', 'HYU');
INSERT INTO schools (name, code) VALUES ('한양대학교', 'HYU'); -- 중복!

-- ✅ 정상
INSERT INTO schools (name, code) VALUES 
  ('한양대학교', 'HYU')
ON CONFLICT (code) DO NOTHING;
```

### 2. 선수는 반드시 학교에 소속되어야 함
```sql
-- ❌ 오류 발생
INSERT INTO players (name, school_id, ...) 
VALUES ('김민수', '존재하지-않는-ID', ...);

-- ✅ 정상: 학교 ID를 먼저 조회
SELECT id FROM schools WHERE code = 'HYU';
```

### 3. 레이팅은 0 이상이어야 함
```sql
-- ❌ 오류 발생
INSERT INTO players (..., rating) VALUES (..., -100);

-- ✅ 정상
INSERT INTO players (..., rating) VALUES (..., 1500);
```

### 4. 부서(division) 값은 문자열
```sql
-- ✅ 정상
uni_division: '1부', '2부', '3부'
club_division: 'A', 'B', 'C'
```

---

## 🚀 추천 워크플로우

### 처음 시작하는 경우
1. **방법 1 (SQL)** 로 샘플 데이터 입력
2. 웹사이트에서 정상 작동 확인
3. **방법 3 (CSV)** 로 실제 데이터 준비
4. CSV 파일로 대량 입력

### 개발 중인 경우
1. **방법 2 (TypeScript)** 로 테스트 데이터 자동 생성
2. 개발 환경에서 반복 테스트
3. 프로덕션에는 **방법 1 (SQL)** 사용

### 운영 중인 경우
1. **방법 4 (Dashboard)** 로 소량 데이터 수정
2. **방법 5 (API)** 로 사용자가 직접 입력
3. 대량 데이터는 **방법 1 (SQL)** 사용

---

## 💡 팁

### 대량 데이터 입력 시
- 트랜잭션 사용 (SQL의 `BEGIN`/`COMMIT`)
- 배치 단위로 나눠서 입력 (1000개씩)
- 에러 로그 확인

### 데이터 백업
```bash
# Supabase CLI 사용
supabase db dump -f backup.sql
```

### 데이터 초기화 (개발 환경)
```sql
-- 모든 데이터 삭제 (주의!)
TRUNCATE TABLE tournament_results CASCADE;
TRUNCATE TABLE rating_history CASCADE;
TRUNCATE TABLE matches CASCADE;
TRUNCATE TABLE tournaments CASCADE;
TRUNCATE TABLE players CASCADE;
TRUNCATE TABLE schools CASCADE;
```

---

## 📞 문제 해결

### 오류: "violates foreign key constraint"
→ 참조하는 데이터를 먼저 입력하세요 (학교 → 선수 순서)

### 오류: "duplicate key value"
→ 이미 존재하는 데이터입니다. `ON CONFLICT` 사용

### 오류: "permission denied"
→ RLS 정책 확인 또는 service_role 키 사용

### CSV 파일이 깨져 보임
→ UTF-8 인코딩으로 저장했는지 확인

---

## 🎉 완료!

데이터 입력이 완료되면:
1. `player_statistics` 뷰로 확인
2. 웹사이트에서 랭킹 페이지 확인
3. 경기 등록 테스트

질문이 있으면 언제든 물어보세요! 🙋‍♂️
