/**
 * CSV 파일에서 데이터 가져오기
 * 실행: npx tsx scripts/import-from-csv.ts
 * 
 * CSV 파일 형식:
 * players.csv: 이름,학교코드,대학부,동아리부,레이팅
 * schools.csv: 학교명,학교코드
 */

import { createClient } from '@supabase/supabase-js'
import { Database } from '../types/database'
import * as fs from 'fs'
import * as path from 'path'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE!
const supabase = createClient<Database>(supabaseUrl, supabaseServiceKey)

// CSV 파싱 함수
function parseCSV(content: string): string[][] {
  return content
    .trim()
    .split('\n')
    .map(line => line.split(',').map(cell => cell.trim()))
}

async function importFromCSV() {
  console.log('📥 CSV 파일에서 데이터 가져오기 시작...\n')

  try {
    // 1. schools.csv 읽기
    const schoolsPath = path.join(process.cwd(), 'data', 'schools.csv')
    if (fs.existsSync(schoolsPath)) {
      console.log('📚 학교 데이터 가져오는 중...')
      const schoolsContent = fs.readFileSync(schoolsPath, 'utf-8')
      const schoolsRows = parseCSV(schoolsContent)
      
      // 헤더 제외
      const schools = schoolsRows.slice(1).map(row => ({
        name: row[0],
        code: row[1],
      }))

      const { data, error } = await supabase
        .from('schools')
        .upsert(schools, { onConflict: 'code' })
        .select()

      if (error) throw error
      console.log(`✅ ${data?.length || 0}개 학교 입력 완료\n`)
    }

    // 2. 학교 ID 매핑
    const { data: allSchools } = await supabase.from('schools').select('id, code')
    const schoolMap = new Map(allSchools?.map(s => [s.code, s.id]))

    // 3. players.csv 읽기
    const playersPath = path.join(process.cwd(), 'data', 'players.csv')
    if (fs.existsSync(playersPath)) {
      console.log('👥 선수 데이터 가져오는 중...')
      const playersContent = fs.readFileSync(playersPath, 'utf-8')
      const playersRows = parseCSV(playersContent)
      
      // 헤더 제외
      const players = playersRows.slice(1).map(row => ({
        name: row[0],
        school_id: schoolMap.get(row[1])!,
        uni_division: row[2],
        club_division: row[3],
        rating: parseInt(row[4]) || 1500,
      }))

      const { data, error } = await supabase
        .from('players')
        .insert(players)
        .select()

      if (error) throw error
      console.log(`✅ ${data?.length || 0}명 선수 입력 완료\n`)
    }

    console.log('✨ CSV 데이터 가져오기 완료!')

  } catch (error) {
    console.error('❌ 오류 발생:', error)
    process.exit(1)
  }
}

importFromCSV()
