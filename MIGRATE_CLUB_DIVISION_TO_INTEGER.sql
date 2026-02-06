-- =====================================================
-- 동아리부 시스템 변경 마이그레이션
-- Migration: club_division TEXT → INTEGER
-- Date: 2026-02-06
-- =====================================================

-- ⚠️ 주의: 이 마이그레이션은 되돌릴 수 없습니다. 백업 필수!

BEGIN;

-- =====================================================
-- Step 1: 기존 데이터 백업 (임시 테이블)
-- =====================================================
CREATE TEMP TABLE players_backup AS 
SELECT * FROM players;

SELECT '✅ Step 1: 백업 완료' AS status;

-- =====================================================
-- Step 2: 새 컬럼 추가 (INTEGER 타입)
-- =====================================================
ALTER TABLE players 
ADD COLUMN club_division_num INTEGER;

SELECT '✅ Step 2: 새 컬럼 추가 완료' AS status;

-- =====================================================
-- Step 3: 기존 데이터 변환
-- =====================================================
-- TEXT에서 숫자 추출하여 변환
-- 예: '0부' → 0, '1부' → 1, '-1부' → -1, 'A' → 0, 'B' → 1

UPDATE players 
SET club_division_num = CASE
  -- 숫자+부 형식 ('0부', '1부', '-1부' 등)
  WHEN club_division ~ '^-?\d+부$' THEN 
    CAST(REPLACE(club_division, '부', '') AS INTEGER)
  
  -- 알파벳 형식 ('A', 'B', 'C', 'D') → 숫자로 변환
  WHEN club_division = 'A' THEN 0
  WHEN club_division = 'B' THEN 1
  WHEN club_division = 'C' THEN 2
  WHEN club_division = 'D' THEN 3
  
  -- 기타: 기본값 1부
  ELSE 1
END;

SELECT '✅ Step 3: 데이터 변환 완료' AS status;

-- =====================================================
-- Step 4: 변환 결과 확인
-- =====================================================
SELECT 
  club_division AS 기존값,
  club_division_num AS 변환값,
  COUNT(*) AS 인원수
FROM players
GROUP BY club_division, club_division_num
ORDER BY club_division_num;

-- =====================================================
-- Step 5: 기존 컬럼 삭제
-- =====================================================
ALTER TABLE players DROP COLUMN club_division;

SELECT '✅ Step 5: 기존 컬럼 삭제 완료' AS status;

-- =====================================================
-- Step 6: 새 컬럼 이름 변경
-- =====================================================
ALTER TABLE players 
RENAME COLUMN club_division_num TO club_division;

SELECT '✅ Step 6: 컬럼 이름 변경 완료' AS status;

-- =====================================================
-- Step 7: 제약 조건 추가
-- =====================================================
-- NOT NULL 제약
ALTER TABLE players 
ALTER COLUMN club_division SET NOT NULL;

-- 범위 제약 (-2부 ~ 8부)
ALTER TABLE players 
ADD CONSTRAINT club_division_range 
CHECK (club_division >= -2 AND club_division <= 8);

SELECT '✅ Step 7: 제약 조건 추가 완료' AS status;

-- =====================================================
-- Step 8: 인덱스 재생성 (선택사항, 성능 향상)
-- =====================================================
CREATE INDEX idx_players_club_division ON players(club_division);

SELECT '✅ Step 8: 인덱스 생성 완료' AS status;

-- =====================================================
-- Step 9: 최종 확인
-- =====================================================
SELECT '=== 최종 데이터 확인 ===' AS info;

SELECT 
  club_division AS 동아리부,
  COUNT(*) AS 인원수,
  AVG(rating)::INTEGER AS 평균레이팅
FROM players
GROUP BY club_division
ORDER BY club_division;

SELECT '=== 전체 통계 ===' AS info;
SELECT 
  COUNT(*) AS 총선수수,
  MIN(club_division) AS 최저부수,
  MAX(club_division) AS 최고부수,
  AVG(club_division)::NUMERIC(3,1) AS 평균부수
FROM players;

-- =====================================================
-- Step 10: 커밋
-- =====================================================
-- 문제 없으면 COMMIT, 문제 있으면 ROLLBACK 실행

SELECT '✅ 모든 마이그레이션 완료!' AS status;
SELECT '⚠️ 확인 후 COMMIT; 실행하세요. 문제 있으면 ROLLBACK;' AS warning;

-- COMMIT;  -- 확인 후 주석 해제
-- ROLLBACK;  -- 문제 발생 시

-- =====================================================
-- 완료 메시지
-- =====================================================
