"use client"

import { School, Trophy } from "lucide-react"
import { Badge } from "@/components/ui/badge"

export default function SchoolsPage() {
  return (
    <div className="min-h-screen bg-zinc-950">
      <div className="container mx-auto px-4 space-y-6 py-8">
        {/* Header */}
        <div className="space-y-2">
          <h1 className="text-2xl md:text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-white to-zinc-400">
            학교 랭킹
          </h1>
          <p className="text-sm text-zinc-500">
            평균 레이팅 기준 학교 순위
          </p>
        </div>

        {/* Work in Progress Card */}
        <div className="relative">
          <div className="absolute inset-0 bg-blue-500/5 rounded-3xl blur-2xl" />
          <div className="relative bg-zinc-900/50 backdrop-blur-xl border border-white/5 rounded-3xl p-12 text-center">
            <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-zinc-800 flex items-center justify-center">
              <School className="w-10 h-10 text-zinc-600" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-4">
              학교 랭킹 시스템 개발 중
            </h3>
            <p className="text-zinc-500 max-w-2xl mx-auto mb-6">
              각 학교의 평균 레이팅과 소속 선수 정보를 집계하여 
              학교별 순위를 제공할 예정입니다.
            </p>
            
            <div className="flex items-center justify-center gap-4 flex-wrap mt-8">
              <Badge className="bg-zinc-800 text-zinc-300 border-zinc-700">
                평균 레이팅
              </Badge>
              <Badge className="bg-zinc-800 text-zinc-300 border-zinc-700">
                소속 선수 수
              </Badge>
              <Badge className="bg-zinc-800 text-zinc-300 border-zinc-700">
                최고 레이팅 선수
              </Badge>
            </div>
          </div>
        </div>

        {/* Feature Preview */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-zinc-900/50 backdrop-blur-xl border border-white/5 rounded-2xl p-6">
            <Trophy className="w-8 h-8 text-red-500 mb-4" />
            <div className="text-lg font-bold text-white mb-2">학교별 순위</div>
            <p className="text-sm text-zinc-500">
              소속 선수들의 평균 레이팅을 기준으로 학교 순위를 매깁니다
            </p>
          </div>
          <div className="bg-zinc-900/50 backdrop-blur-xl border border-white/5 rounded-2xl p-6">
            <School className="w-8 h-8 text-blue-500 mb-4" />
            <div className="text-lg font-bold text-white mb-2">선수 목록</div>
            <p className="text-sm text-zinc-500">
              각 학교의 소속 선수 목록과 개별 레이팅을 확인할 수 있습니다
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
