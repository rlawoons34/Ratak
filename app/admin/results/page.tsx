"use client"

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/lib/auth-context'
import { MatchRegistrationForm } from '@/components/admin/match-registration-form'
import { AlertCircle } from 'lucide-react'

export default function AdminResultsPage() {
  const router = useRouter()
  const { isAdmin, loading } = useAuth()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (mounted && !loading && !isAdmin) {
      router.push('/auth')
    }
  }, [mounted, loading, isAdmin, router])

  if (loading || !mounted) {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
        <div className="text-white">로딩 중...</div>
      </div>
    )
  }

  if (!isAdmin) {
    return null
  }

  return (
    <div className="min-h-screen bg-zinc-950">
      <div className="container mx-auto px-4 py-8 space-y-6">
        {/* Header */}
        <div className="space-y-2">
          <h1 className="text-2xl md:text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-white to-zinc-400">
            경기 결과 등록
          </h1>
          <p className="text-sm text-zinc-500">
            경기 결과를 입력하면 레이팅이 자동으로 계산됩니다
          </p>
        </div>

        {/* Admin Notice */}
        <div className="bg-blue-500/10 backdrop-blur-xl border border-blue-500/20 rounded-2xl p-4">
          <div className="flex items-center gap-3">
            <AlertCircle className="w-5 h-5 text-blue-500 flex-shrink-0" />
            <div className="text-sm text-blue-400">
              <strong className="font-semibold">관리자 모드:</strong> USATT 알고리즘 기반 레이팅 자동 계산 및 업데이트
            </div>
          </div>
        </div>

        {/* Match Registration Form */}
        <MatchRegistrationForm />
      </div>
    </div>
  )
}
