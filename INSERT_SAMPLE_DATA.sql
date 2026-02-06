-- =====================================================
-- 실제 데이터 입력 스크립트
-- TakuRating Database - Sample Data Insert
-- =====================================================

-- =====================================================
-- 1. 학교 데이터 입력
-- =====================================================
INSERT INTO schools (name, code) VALUES
  ('한양대학교', 'HYU'),
  ('연세대학교', 'YU'),
  ('고려대학교', 'KU'),
  ('서울대학교', 'SNU'),
  ('성균관대학교', 'SKU'),
  ('중앙대학교', 'CAU'),
  ('경희대학교', 'KHU'),
  ('이화여자대학교', 'EWU')
ON CONFLICT (code) DO NOTHING;

-- =====================================================
-- 2. 선수 데이터 입력
-- =====================================================
-- 학교 ID 조회를 위한 변수 설정
DO $$
DECLARE
  hyu_id UUID;
  yu_id UUID;
  ku_id UUID;
  snu_id UUID;
  sku_id UUID;
BEGIN
  -- 학교 ID 가져오기
  SELECT id INTO hyu_id FROM schools WHERE code = 'HYU';
  SELECT id INTO yu_id FROM schools WHERE code = 'YU';
  SELECT id INTO ku_id FROM schools WHERE code = 'KU';
  SELECT id INTO snu_id FROM schools WHERE code = 'SNU';
  SELECT id INTO sku_id FROM schools WHERE code = 'SKU';

  -- 선수 데이터 입력
  INSERT INTO players (name, school_id, uni_division, club_division, rating) VALUES
    -- 한양대 선수들
    ('김민수', hyu_id, '1부', 'A', 1650),
    ('이준호', hyu_id, '1부', 'A', 1580),
    ('박서연', hyu_id, '2부', 'B', 1520),
    ('최지훈', hyu_id, '1부', 'A', 1700),
    
    -- 연세대 선수들
    ('정유진', yu_id, '1부', 'A', 1620),
    ('강태양', yu_id, '1부', 'A', 1590),
    ('윤서아', yu_id, '2부', 'B', 1480),
    
    -- 고려대 선수들
    ('송민재', ku_id, '1부', 'A', 1680),
    ('한지우', ku_id, '1부', 'A', 1640),
    ('임수빈', ku_id, '2부', 'B', 1510),
    
    -- 서울대 선수들
    ('오현우', snu_id, '1부', 'A', 1720),
    ('신예은', snu_id, '2부', 'B', 1550),
    
    -- 성균관대 선수들
    ('조성훈', sku_id, '1부', 'A', 1600),
    ('배지은', sku_id, '2부', 'B', 1490);
END $$;

-- =====================================================
-- 3. 토너먼트 데이터 입력
-- =====================================================
INSERT INTO tournaments (name, location, event_date, total_participants, tournament_type) VALUES
  ('2026 봄 대학 탁구 리그', '서울 올림픽공원', '2026-03-15', 32, 'league'),
  ('제1회 수도권 오픈 대회', '한양대학교 체육관', '2026-04-20', 64, 'open'),
  ('2026 전국 대학 탁구 선수권', '잠실 실내체육관', '2026-05-10', 128, 'championship');

-- =====================================================
-- 4. 데이터 확인 쿼리
-- =====================================================
-- 입력된 데이터 확인
SELECT '=== 학교 목록 ===' as info;
SELECT name, code FROM schools ORDER BY name;

SELECT '=== 선수 목록 ===' as info;
SELECT 
  p.name as 선수명,
  s.name as 학교,
  p.uni_division as 대학부,
  p.club_division as 동아리부,
  p.rating as 레이팅
FROM players p
JOIN schools s ON s.id = p.school_id
ORDER BY p.rating DESC;

SELECT '=== 토너먼트 목록 ===' as info;
SELECT name, location, event_date, total_participants FROM tournaments ORDER BY event_date;

-- =====================================================
-- 완료 메시지
-- =====================================================
SELECT '✅ 데이터 입력 완료!' as result;
