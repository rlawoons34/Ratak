"use client"

import { Lock, Mail } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export default function AuthPage() {
  return (
    <div className="min-h-screen bg-zinc-950 flex items-center justify-center px-4">
      <div className="w-full max-w-md space-y-8">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="w-16 h-16 mx-auto bg-gradient-to-br from-red-500 to-red-600 rounded-2xl flex items-center justify-center shadow-lg shadow-red-500/30 mb-4">
            <Lock className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-white">TakuRating</h1>
          <p className="text-zinc-500">관리자 로그인</p>
        </div>

        {/* Login Form */}
        <div className="bg-zinc-900/50 backdrop-blur-xl border border-white/5 rounded-3xl p-8">
          <div className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-zinc-400">
                이메일
              </Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                <Input
                  id="email"
                  type="email"
                  placeholder="admin@example.com"
                  className="pl-10 h-12 bg-zinc-800/50 border-white/5 text-white rounded-xl"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-zinc-400">
                비밀번호
              </Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  className="pl-10 h-12 bg-zinc-800/50 border-white/5 text-white rounded-xl"
                />
              </div>
            </div>

            <Button 
              className="w-full h-12 bg-red-500 hover:bg-red-600 text-white rounded-xl font-semibold"
            >
              로그인
            </Button>
          </div>
        </div>

        {/* Notice */}
        <div className="bg-zinc-900/30 backdrop-blur-xl border border-white/5 rounded-2xl p-4">
          <p className="text-xs text-zinc-500 text-center">
            ⚠️ Supabase Auth 통합 예정 - 현재는 UI 프리뷰입니다
          </p>
        </div>
      </div>
    </div>
  )
}
