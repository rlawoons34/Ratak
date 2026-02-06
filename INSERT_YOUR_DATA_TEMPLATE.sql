-- =====================================================
-- 실제 데이터 입력 템플릿
-- 이 파일을 복사해서 실제 데이터로 수정하세요
-- =====================================================

-- =====================================================
-- 1단계: 학교 데이터 입력
-- =====================================================
INSERT INTO schools (name, code) VALUES
  ('학교명1', '학교코드1'),  -- 예: ('한양대학교', 'HYU')
  ('학교명2', '학교코드2'),
  ('학교명3', '학교코드3')
ON CONFLICT (code) DO NOTHING;

-- =====================================================
-- 2단계: 선수 데이터 입력
-- =====================================================
DO $$
DECLARE
  school1_id UUID;
  school2_id UUID;
BEGIN
  -- 학교 ID 가져오기 (위에서 입력한 학교 코드 사용)
  SELECT id INTO school1_id FROM schools WHERE code = '학교코드1';
  SELECT id INTO school2_id FROM schools WHERE code = '학교코드2';

  -- 선수 입력
  INSERT INTO players (name, school_id, uni_division, club_division, rating) VALUES
    ('선수이름1', school1_id, '1부', 'A', 1500),  -- rating은 1500이 기본값
    ('선수이름2', school1_id, '1부', 'A', 1500),
    ('선수이름3', school2_id, '2부', 'B', 1500);
    -- 필요한 만큼 추가...
END $$;

-- =====================================================
-- 3단계: 토너먼트 데이터 입력 (선택사항)
-- =====================================================
INSERT INTO tournaments (name, location, event_date, total_participants, tournament_type) VALUES
  ('대회명', '장소', '2026-03-15', 32, 'league');
  -- tournament_type: 'open', 'league', 'championship' 중 선택

-- =====================================================
-- 확인 쿼리
-- =====================================================
SELECT 
  p.name as 선수명,
  s.name as 학교,
  p.uni_division,
  p.club_division,
  p.rating
FROM players p
JOIN schools s ON s.id = p.school_id
ORDER BY p.rating DESC;
