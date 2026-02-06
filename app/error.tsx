'use client'

import { useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { AlertCircle, RefreshCw } from 'lucide-react'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error('❌ Error boundary caught:', error)
  }, [error])

  return (
    <div className="min-h-screen bg-zinc-950 flex items-center justify-center px-4">
      <div className="max-w-md w-full">
        {/* Glow effect */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-red-500/10 rounded-full blur-3xl" />
        </div>

        {/* Content */}
        <div className="bg-zinc-900/50 backdrop-blur-xl border border-red-500/20 rounded-3xl p-8 text-center space-y-6">
          {/* Icon */}
          <div className="relative inline-block">
            <div className="absolute inset-0 bg-red-500/20 rounded-2xl blur-xl" />
            <div className="relative w-20 h-20 mx-auto bg-zinc-800 rounded-2xl flex items-center justify-center">
              <AlertCircle className="w-10 h-10 text-red-400" />
            </div>
          </div>

          {/* Title */}
          <div className="space-y-2">
            <h2 className="text-3xl font-bold text-white">
              문제가 발생했습니다
            </h2>
            <p className="text-zinc-400">
              예상치 못한 오류가 발생했습니다
            </p>
          </div>

          {/* Error Details */}
          {error.message && (
            <div className="bg-zinc-800/50 border border-zinc-700 rounded-lg p-4">
              <p className="text-sm text-red-400 font-mono break-words">
                {error.message}
              </p>
            </div>
          )}

          {/* Actions */}
          <div className="flex flex-col gap-3">
            <Button
              onClick={reset}
              className="w-full bg-red-500 hover:bg-red-600 text-white"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              다시 시도
            </Button>
            <Button
              variant="outline"
              onClick={() => window.location.href = '/'}
              className="w-full bg-zinc-800/50 border-zinc-700 text-white hover:bg-zinc-800"
            >
              홈으로 돌아가기
            </Button>
          </div>

          {/* Digest */}
          {error.digest && (
            <p className="text-xs text-zinc-600">
              Error ID: {error.digest}
            </p>
          )}
        </div>
      </div>
    </div>
  )
}
