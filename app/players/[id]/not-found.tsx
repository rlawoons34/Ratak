import Link from 'next/link'
import { ArrowLeft, Trophy } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function PlayerNotFound() {
  return (
    <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
      <div className="text-center space-y-4">
        <Trophy className="w-16 h-16 mx-auto text-zinc-600" />
        <h1 className="text-2xl font-bold text-white">선수를 찾을 수 없습니다</h1>
        <p className="text-zinc-500">요청하신 선수 정보가 존재하지 않습니다.</p>
        <Link href="/players">
          <Button variant="outline" className="mt-4">
            <ArrowLeft className="w-4 h-4 mr-2" />
            목록으로 돌아가기
          </Button>
        </Link>
      </div>
    </div>
  )
}
