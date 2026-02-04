"use client"

import { ClipboardEdit, Zap, AlertCircle } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

export default function AdminResultsPage() {
  return (
    <div className="min-h-screen bg-zinc-950">
      <div className="container mx-auto px-4 space-y-6 py-8">
        {/* Header */}
        <div className="space-y-2">
          <h1 className="text-2xl md:text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-white to-zinc-400">
            경기 결과 입력
          </h1>
          <p className="text-sm text-zinc-500">
            새로운 경기 결과를 입력하고 레이팅을 업데이트합니다
          </p>
        </div>

        {/* Admin Notice */}
        <div className="bg-yellow-500/10 backdrop-blur-xl border border-yellow-500/20 rounded-2xl p-4">
          <div className="flex items-center gap-3">
            <AlertCircle className="w-5 h-5 text-yellow-500 flex-shrink-0" />
            <div className="text-sm text-yellow-500/90">
              <strong className="font-semibold">관리자 인증 필요:</strong> 이 페이지는 Supabase Auth와 RLS(Row Level Security)로 보호됩니다.
            </div>
          </div>
        </div>

        {/* Work in Progress Card */}
        <div className="relative">
          <div className="absolute inset-0 bg-red-500/5 rounded-3xl blur-2xl" />
          <div className="relative bg-zinc-900/50 backdrop-blur-xl border border-white/5 rounded-3xl p-12 text-center">
            <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-zinc-800 flex items-center justify-center">
              <ClipboardEdit className="w-10 h-10 text-zinc-600" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-4">
              경기 결과 입력 시스템 개발 중
            </h3>
            <p className="text-zinc-500 max-w-2xl mx-auto mb-6">
              승자, 패자, 스코어를 입력하면 Supabase RPC(register_match_result)를 통해 
              USATT 알고리즘 기반 레이팅 계산과 데이터베이스 업데이트가 자동으로 처리됩니다.
            </p>
            
            <div className="flex items-center justify-center gap-4 flex-wrap mt-8">
              <Badge className="bg-red-500/20 text-red-400 border-red-500/30">
                <Zap className="w-3 h-3 mr-1 inline" />
                USATT 자동 계산
              </Badge>
              <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30">
                원자적 트랜잭션
              </Badge>
              <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
                실시간 랭킹 갱신
              </Badge>
            </div>
          </div>
        </div>

        {/* Feature Preview */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-zinc-900/50 backdrop-blur-xl border border-white/5 rounded-2xl p-6">
            <div className="text-lg font-bold text-white mb-2">스마트 Delta 계산</div>
            <p className="text-sm text-zinc-500">
              레이팅 차이에 따라 자동으로 적절한 점수 변동을 계산합니다 (0~50점)
            </p>
          </div>
          <div className="bg-zinc-900/50 backdrop-blur-xl border border-white/5 rounded-2xl p-6">
            <div className="text-lg font-bold text-white mb-2">히스토리 자동 생성</div>
            <p className="text-sm text-zinc-500">
              경기 기록과 함께 양쪽 선수의 레이팅 히스토리를 자동 저장합니다
            </p>
          </div>
        </div>

        {/* Placeholder Button */}
        <div className="flex justify-center">
          <Button 
            disabled
            className="h-14 px-8 bg-zinc-800 text-zinc-500 rounded-2xl cursor-not-allowed"
          >
            <ClipboardEdit className="w-5 h-5 mr-2" />
            경기 입력 폼 준비 중...
          </Button>
        </div>
      </div>
    </div>
  )
}
