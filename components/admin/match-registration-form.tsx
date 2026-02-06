'use client'

import { useState, useEffect, FormEvent } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { rpc } from '@/lib/supabase'
import type { Database } from '@/types/database'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { PlayerSearchCombobox } from './player-search-combobox'
import { ArrowRight } from 'lucide-react'

type Player = Database['public']['Tables']['players']['Row']

export function MatchRegistrationForm() {
  const router = useRouter()
  
  // Form state
  const [winner, setWinner] = useState<Player | null>(null)
  const [loser, setLoser] = useState<Player | null>(null)
  const [score, setScore] = useState('')
  const [playedAt, setPlayedAt] = useState(new Date().toISOString().split('T')[0])
  
  // UI state
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [preview, setPreview] = useState<{
    delta_winner: number
    delta_loser: number
  } | null>(null)

  // Calculate delta preview when players change
  useEffect(() => {
    if (winner && loser) {
      calculatePreview()
    } else {
      setPreview(null)
    }
  }, [winner?.id, loser?.id])

  async function calculatePreview() {
    if (!winner || !loser) return

    const { data, error } = await rpc.calculateUsattDelta(
      winner.rating,
      loser.rating
    )

    if (error) {
      console.error('Failed to calculate preview:', error)
    } else if (data && data.length > 0) {
      setPreview({
        delta_winner: data[0].delta_winner,
        delta_loser: data[0].delta_loser
      })
    }
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    
    if (!winner || !loser) {
      setError('승자와 패자를 모두 선택해주세요')
      return
    }

    if (!score.match(/^\d+:\d+$/)) {
      setError('스코어 형식이 올바르지 않습니다 (예: "3:1")')
      return
    }

    if (winner.id === loser.id) {
      setError('승자와 패자는 다른 선수여야 합니다')
      return
    }

    setLoading(true)
    setError(null)

    // Call RPC to register match
    const { data: matchId, error: registerError } = await rpc.registerMatch({
      winnerId: winner.id,
      loserId: loser.id,
      score: score,
      playedAt: new Date(playedAt).toISOString(),
      eventId: null
    })

    if (registerError) {
      setError(registerError.message)
      toast.error('경기 등록 실패', {
        description: registerError.message
      })
      setLoading(false)
    } else {
      toast.success('경기 등록 성공!', {
        description: `${winner.name}이(가) ${loser.name}을(를) 이겼습니다`
      })
      
      // Reset form
      setWinner(null)
      setLoser(null)
      setScore('')
      setPlayedAt(new Date().toISOString().split('T')[0])
      setPreview(null)
      setLoading(false)
      
      // Refresh home page data
      router.refresh()
    }
  }

  return (
    <Card className="bg-zinc-900 border-zinc-800 max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="text-white">경기 정보</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Error Message */}
          {error && (
            <div className="bg-red-500/10 border border-red-500 text-red-500 px-4 py-3 rounded-xl text-sm">
              {error}
            </div>
          )}

          {/* Winner Selection */}
          <div>
            <Label className="text-white mb-2 block">승자</Label>
            <PlayerSearchCombobox
              onSelect={setWinner}
              selected={winner}
              placeholder="승자 선택..."
            />
            {winner && (
              <div className="mt-2 text-sm text-zinc-400">
                현재 레이팅: {winner.rating}
              </div>
            )}
          </div>

          {/* Loser Selection */}
          <div>
            <Label className="text-white mb-2 block">패자</Label>
            <PlayerSearchCombobox
              onSelect={setLoser}
              selected={loser}
              placeholder="패자 선택..."
            />
            {loser && (
              <div className="mt-2 text-sm text-zinc-400">
                현재 레이팅: {loser.rating}
              </div>
            )}
          </div>

          {/* Rating Delta Preview */}
          {preview && winner && loser && (
            <div className="bg-zinc-800 p-4 rounded-xl">
              <div className="text-sm text-zinc-400 mb-3 font-semibold">레이팅 변동 미리보기:</div>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-3">
                  <div className="text-white font-semibold mb-1">{winner.name}</div>
                  <div className="text-green-500 font-bold text-lg">
                    {winner.rating} <ArrowRight className="inline w-4 h-4 mx-1" /> {winner.rating + preview.delta_winner}
                  </div>
                  <div className="text-green-400 text-sm mt-1">
                    +{preview.delta_winner} pts
                  </div>
                </div>
                <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3">
                  <div className="text-white font-semibold mb-1">{loser.name}</div>
                  <div className="text-red-500 font-bold text-lg">
                    {loser.rating} <ArrowRight className="inline w-4 h-4 mx-1" /> {loser.rating + preview.delta_loser}
                  </div>
                  <div className="text-red-400 text-sm mt-1">
                    {preview.delta_loser} pts
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Score Input */}
          <div>
            <Label htmlFor="score" className="text-white mb-2 block">스코어</Label>
            <Input
              id="score"
              type="text"
              value={score}
              onChange={(e) => setScore(e.target.value)}
              placeholder="3:1"
              className="h-12 bg-zinc-800/50 border-white/5 text-white"
              required
            />
            <div className="text-xs text-zinc-500 mt-1">
              형식: 승자스코어:패자스코어 (예: "3:1", "11:9")
            </div>
          </div>

          {/* Date Input */}
          <div>
            <Label htmlFor="playedAt" className="text-white mb-2 block">경기 날짜</Label>
            <Input
              id="playedAt"
              type="date"
              value={playedAt}
              onChange={(e) => setPlayedAt(e.target.value)}
              className="h-12 bg-zinc-800/50 border-white/5 text-white"
              required
            />
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            disabled={loading || !winner || !loser || !score}
            className="w-full h-12 bg-red-500 hover:bg-red-600 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? '등록 중...' : '경기 등록'}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
