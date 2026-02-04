import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Swords, Trophy, TrendingUp } from "lucide-react"

export default function Home() {
  return (
    <div className="container mx-auto py-16 px-4">
      <div className="max-w-4xl mx-auto text-center mb-16">
        <h1 className="text-5xl font-bold mb-4">탁구 랭킹 트래커</h1>
        <p className="text-xl text-muted-foreground mb-8">
          AI 기반 선수 분석 및 승률 예측 시스템
        </p>
        <Link href="/compare">
          <Button size="lg" className="gap-2">
            <Swords className="h-5 w-5" />
            선수 비교 시작하기
          </Button>
        </Link>
      </div>

      <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
        <Card>
          <CardHeader>
            <Trophy className="h-10 w-10 text-yellow-500 mb-2" />
            <CardTitle>직접 대결 기록</CardTitle>
            <CardDescription>
              선수 간 역대 전적을 한눈에 확인
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              과거 경기 결과를 바탕으로 두 선수의 상대 전적을 분석합니다.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <TrendingUp className="h-10 w-10 text-green-500 mb-2" />
            <CardTitle>공통 상대 분석</CardTitle>
            <CardDescription>
              삼각 관계 로직으로 실력 비교
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              공통 상대와의 대결 결과를 분석하여 상대적 실력을 평가합니다.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <Swords className="h-10 w-10 text-blue-500 mb-2" />
            <CardTitle>AI 승률 예측</CardTitle>
            <CardDescription>
              Elo 레이팅 기반 확률 계산
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              표준 Elo 공식을 사용하여 다음 경기의 승률을 예측합니다.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
