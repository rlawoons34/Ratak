import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { FileQuestion, Home } from 'lucide-react'

export default function NotFound() {
  return (
    <div className="min-h-screen bg-zinc-950 flex items-center justify-center px-4">
      <div className="max-w-md w-full">
        {/* Glow effect */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-zinc-500/10 rounded-full blur-3xl" />
        </div>

        {/* Content */}
        <div className="bg-zinc-900/50 backdrop-blur-xl border border-white/5 rounded-3xl p-8 text-center space-y-6">
          {/* Icon */}
          <div className="relative inline-block">
            <div className="absolute inset-0 bg-zinc-500/20 rounded-2xl blur-xl" />
            <div className="relative w-20 h-20 mx-auto bg-zinc-800 rounded-2xl flex items-center justify-center">
              <FileQuestion className="w-10 h-10 text-zinc-500" />
            </div>
          </div>

          {/* Title */}
          <div className="space-y-2">
            <h1 className="text-7xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-white to-zinc-500">
              404
            </h1>
            <h2 className="text-2xl font-bold text-white">
              페이지를 찾을 수 없습니다
            </h2>
            <p className="text-zinc-400">
              요청하신 페이지가 존재하지 않거나 이동되었습니다
            </p>
          </div>

          {/* Action */}
          <Link href="/">
            <Button className="w-full bg-red-500 hover:bg-red-600 text-white">
              <Home className="w-4 h-4 mr-2" />
              홈으로 돌아가기
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
