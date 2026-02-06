/**
 * 데이터 입력 스크립트 (TypeScript)
 * 실행: npx tsx scripts/seed-data.ts
 */

import { createClient } from '@supabase/supabase-js'
import { Database } from '../types/database'

// 환경변수에서 Supabase 설정 가져오기
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE!

const supabase = createClient<Database>(supabaseUrl, supabaseServiceKey)

// =====================================================
// 데이터 정의
// =====================================================

const schools = [
  { name: '한양대학교', code: 'HYU' },
  { name: '연세대학교', code: 'YU' },
  { name: '고려대학교', code: 'KU' },
  { name: '서울대학교', code: 'SNU' },
  { name: '성균관대학교', code: 'SKU' },
]

const players = [
  { name: '김민수', schoolCode: 'HYU', uniDivision: '1부', clubDivision: 'A', rating: 1650 },
  { name: '이준호', schoolCode: 'HYU', uniDivision: '1부', clubDivision: 'A', rating: 1580 },
  { name: '박서연', schoolCode: 'HYU', uniDivision: '2부', clubDivision: 'B', rating: 1520 },
  { name: '정유진', schoolCode: 'YU', uniDivision: '1부', clubDivision: 'A', rating: 1620 },
  { name: '강태양', schoolCode: 'YU', uniDivision: '1부', clubDivision: 'A', rating: 1590 },
  { name: '송민재', schoolCode: 'KU', uniDivision: '1부', clubDivision: 'A', rating: 1680 },
  { name: '한지우', schoolCode: 'KU', uniDivision: '1부', clubDivision: 'A', rating: 1640 },
  { name: '오현우', schoolCode: 'SNU', uniDivision: '1부', clubDivision: 'A', rating: 1720 },
  { name: '조성훈', schoolCode: 'SKU', uniDivision: '1부', clubDivision: 'A', rating: 1600 },
]

const tournaments = [
  {
    name: '2026 봄 대학 탁구 리그',
    location: '서울 올림픽공원',
    eventDate: '2026-03-15',
    totalParticipants: 32,
    tournamentType: 'league' as const,
  },
  {
    name: '제1회 수도권 오픈 대회',
    location: '한양대학교 체육관',
    eventDate: '2026-04-20',
    totalParticipants: 64,
    tournamentType: 'open' as const,
  },
]

// =====================================================
// 데이터 입력 함수
// =====================================================

async function seedData() {
  console.log('🚀 데이터 입력 시작...\n')

  try {
    // 1. 학교 데이터 입력
    console.log('📚 학교 데이터 입력 중...')
    const { data: schoolsData, error: schoolsError } = await supabase
      .from('schools')
      .upsert(schools, { onConflict: 'code' })
      .select()

    if (schoolsError) throw schoolsError
    console.log(`✅ ${schoolsData?.length || 0}개 학교 입력 완료\n`)

    // 2. 학교 ID 매핑
    const { data: allSchools, error: fetchError } = await supabase
      .from('schools')
      .select('id, code')

    if (fetchError) throw fetchError

    const schoolMap = new Map(allSchools?.map(s => [s.code, s.id]))

    // 3. 선수 데이터 입력
    console.log('👥 선수 데이터 입력 중...')
    const playersToInsert = players.map(p => ({
      name: p.name,
      school_id: schoolMap.get(p.schoolCode)!,
      uni_division: p.uniDivision,
      club_division: p.clubDivision,
      rating: p.rating,
    }))

    const { data: playersData, error: playersError } = await supabase
      .from('players')
      .insert(playersToInsert)
      .select()

    if (playersError) throw playersError
    console.log(`✅ ${playersData?.length || 0}명 선수 입력 완료\n`)

    // 4. 토너먼트 데이터 입력
    console.log('🏆 토너먼트 데이터 입력 중...')
    const tournamentsToInsert = tournaments.map(t => ({
      name: t.name,
      location: t.location,
      event_date: t.eventDate,
      total_participants: t.totalParticipants,
      tournament_type: t.tournamentType,
    }))

    const { data: tournamentsData, error: tournamentsError } = await supabase
      .from('tournaments')
      .insert(tournamentsToInsert)
      .select()

    if (tournamentsError) throw tournamentsError
    console.log(`✅ ${tournamentsData?.length || 0}개 토너먼트 입력 완료\n`)

    // 5. 결과 확인
    console.log('📊 입력된 데이터 확인:\n')
    
    const { data: playerStats } = await supabase
      .from('player_statistics')
      .select('*')
      .order('rating', { ascending: false })

    console.table(playerStats?.map(p => ({
      이름: p.name,
      학교: p.school_name,
      대학부: p.uni_division,
      동아리부: p.club_division,
      레이팅: p.rating,
    })))

    console.log('\n✨ 모든 데이터 입력 완료!')

  } catch (error) {
    console.error('❌ 오류 발생:', error)
    process.exit(1)
  }
}

// 스크립트 실행
seedData()
