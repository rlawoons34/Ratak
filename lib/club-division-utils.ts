/**
 * 동아리부 관련 유틸리티 함수
 * club_division이 INTEGER로 저장되므로 표시용 변환 함수 제공
 */

/**
 * 동아리부 숫자를 표시 형식으로 변환
 * @param division - 동아리부 숫자 (-2 ~ 8)
 * @returns 표시 문자열 (예: "0부", "1부", "-1부")
 * 
 * @example
 * formatClubDivision(0) // "0부"
 * formatClubDivision(-1) // "-1부"
 * formatClubDivision(3) // "3부"
 */
export function formatClubDivision(division: number): string {
  return `${division}부`
}

/**
 * 표시 형식을 동아리부 숫자로 변환
 * @param text - 표시 문자열 (예: "0부", "-1부")
 * @returns 동아리부 숫자
 * 
 * @example
 * parseClubDivision("0부") // 0
 * parseClubDivision("-1부") // -1
 * parseClubDivision("3부") // 3
 */
export function parseClubDivision(text: string): number {
  return parseInt(text.replace('부', ''))
}

/**
 * 동아리부 유효성 검증
 * @param division - 검증할 동아리부 숫자
 * @returns 유효 여부
 */
export function isValidClubDivision(division: number): boolean {
  return Number.isInteger(division) && division >= -2 && division <= 8
}

/**
 * 동아리부 목록 생성 (드롭다운용)
 * @returns 동아리부 옵션 배열
 */
export function getClubDivisionOptions() {
  return Array.from({ length: 11 }, (_, i) => {
    const value = i - 2 // -2부터 8까지
    return {
      value,
      label: formatClubDivision(value),
    }
  })
}

/**
 * 두 동아리부 간의 차이 계산
 * @param div1 - 첫 번째 동아리부
 * @param div2 - 두 번째 동아리부
 * @returns 부수 차이 (절대값)
 */
export function clubDivisionGap(div1: number, div2: number): number {
  return Math.abs(div1 - div2)
}

/**
 * 선수들의 평균 동아리부 계산
 * @param divisions - 동아리부 배열
 * @returns 평균 동아리부 (소수점 1자리)
 */
export function averageClubDivision(divisions: number[]): number {
  if (divisions.length === 0) return 0
  const sum = divisions.reduce((acc, div) => acc + div, 0)
  return Math.round((sum / divisions.length) * 10) / 10
}

/**
 * 동아리부별 선수 분포 계산
 * @param divisions - 동아리부 배열
 * @returns 부수별 인원 수 객체
 */
export function clubDivisionDistribution(divisions: number[]): Record<number, number> {
  return divisions.reduce((acc, div) => {
    acc[div] = (acc[div] || 0) + 1
    return acc
  }, {} as Record<number, number>)
}

/**
 * 동아리부 정렬 함수 (오름차순)
 * @param a - 첫 번째 선수
 * @param b - 두 번째 선수
 * @returns 정렬 순서
 */
export function sortByClubDivision<T extends { club_division: number }>(
  a: T,
  b: T
): number {
  return a.club_division - b.club_division
}

/**
 * 동아리부 등급 설명
 */
export const CLUB_DIVISION_DESCRIPTIONS: Record<number, string> = {
  '-2': '최상위 특급',
  '-1': '최상위',
  0: '0부 (에이스)',
  1: '1부 (상위)',
  2: '2부 (중상위)',
  3: '3부 (중위)',
  4: '4부 (중하위)',
  5: '5부 (하위)',
  6: '6부 (초급)',
  7: '7부 (입문)',
  8: '8부 (신입)',
}

/**
 * 동아리부 설명 가져오기
 * @param division - 동아리부 숫자
 * @returns 설명 문자열
 */
export function getClubDivisionDescription(division: number): string {
  return CLUB_DIVISION_DESCRIPTIONS[division] || `${division}부`
}

/**
 * 동아리부 색상 (UI용)
 * @param division - 동아리부 숫자
 * @returns Tailwind CSS 색상 클래스
 */
export function getClubDivisionColor(division: number): string {
  if (division <= -1) return 'text-purple-600 font-bold' // 특급
  if (division === 0) return 'text-red-600 font-bold'    // 에이스
  if (division <= 2) return 'text-orange-600'            // 상위
  if (division <= 4) return 'text-yellow-600'            // 중위
  if (division <= 6) return 'text-green-600'             // 하위
  return 'text-gray-600'                                  // 신입
}
