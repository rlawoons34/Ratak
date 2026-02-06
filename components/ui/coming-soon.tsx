import { Construction, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"

interface ComingSoonProps {
  feature: string
}

export function ComingSoon({ feature }: ComingSoonProps) {
  return (
    <div className="min-h-screen bg-zinc-950 flex items-center justify-center px-4">
      <div className="max-w-2xl w-full">
        {/* Glow effect */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-red-500/20 rounded-full blur-3xl" />
        </div>

        {/* Content */}
        <div className="bg-zinc-900/50 backdrop-blur-xl border border-white/5 rounded-3xl p-12 text-center space-y-6">
          {/* Icon */}
          <div className="relative inline-block">
            <div className="absolute inset-0 bg-red-500/20 rounded-2xl blur-xl" />
            <div className="relative w-24 h-24 mx-auto bg-zinc-800 rounded-2xl flex items-center justify-center">
              <Construction className="w-12 h-12 text-red-400" />
            </div>
          </div>

          {/* Title */}
          <div className="space-y-2">
            <h1 className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-white to-zinc-400">
              서비스 준비 중입니다
            </h1>
            <div className="flex items-center justify-center gap-2 text-red-400">
              <Sparkles className="w-4 h-4" />
              <span className="text-lg font-semibold">{feature}</span>
              <Sparkles className="w-4 h-4" />
            </div>
          </div>

          {/* Description */}
          <p className="text-zinc-400 text-lg max-w-md mx-auto">
            더 나은 서비스를 제공하기 위해 준비 중입니다.
            <br />
            곧 만나요! 🚀
          </p>

          {/* Beta Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-zinc-800/50 border border-zinc-700 rounded-full">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-yellow-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-yellow-500"></span>
            </span>
            <span className="text-sm text-zinc-400">Beta Testing Phase</span>
          </div>

          {/* Back Button */}
          <div className="pt-4">
            <Link href="/">
              <Button 
                variant="outline" 
                className="bg-zinc-800/50 border-zinc-700 text-white hover:bg-zinc-800 hover:text-white"
              >
                홈으로 돌아가기
              </Button>
            </Link>
          </div>
        </div>

        {/* Footer note */}
        <p className="text-center text-sm text-zinc-600 mt-6">
          궁금하신 점이 있으시면 관리자에게 문의해주세요.
        </p>
      </div>
    </div>
  )
}
