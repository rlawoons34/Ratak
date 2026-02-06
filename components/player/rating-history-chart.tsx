'use client'

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, TooltipProps } from 'recharts'
import type { MatchHistoryRecord } from '@/lib/mock-data'

interface RatingHistoryChartProps {
  matchHistory: MatchHistoryRecord[]
}

// Custom Tooltip Component
function CustomTooltip({ active, payload }: any) {
  if (active && payload && payload.length) {
    const data = payload[0].payload as MatchHistoryRecord
    return (
      <div className="bg-zinc-900 border border-zinc-700 rounded-lg p-3 shadow-xl">
        <p className="text-white font-semibold mb-2">{data.date}</p>
        <p className="text-sm text-zinc-400 mb-1">
          vs {data.opponentName} ({data.opponentRating})
        </p>
        <p className="text-sm text-zinc-400 mb-2">
          {data.myScore}:{data.opponentScore} {data.isWin ? '승' : '패'}
        </p>
        <div className="flex items-center gap-2">
          <span className="text-white font-mono">{data.myRatingBefore}</span>
          <span className="text-zinc-500">→</span>
          <span className={`font-mono font-bold ${data.isWin ? 'text-green-400' : 'text-red-400'}`}>
            {data.myRatingAfter}
          </span>
          <span className={`text-sm ${data.isWin ? 'text-green-400' : 'text-red-400'}`}>
            ({data.ratingDelta > 0 ? '+' : ''}{data.ratingDelta})
          </span>
        </div>
      </div>
    )
  }
  return null
}

export function RatingHistoryChart({ matchHistory }: RatingHistoryChartProps) {
  // Reverse to show oldest first (left to right)
  const chartData = [...matchHistory].reverse()

  // Calculate min/max for Y-axis with padding
  const ratings = chartData.map(m => m.myRatingAfter)
  const minRating = Math.min(...ratings)
  const maxRating = Math.max(...ratings)
  const padding = 50
  const yAxisMin = Math.floor((minRating - padding) / 50) * 50
  const yAxisMax = Math.ceil((maxRating + padding) / 50) * 50

  return (
    <div className="bg-zinc-900/50 backdrop-blur-xl border border-white/5 rounded-3xl p-6">
      <h3 className="text-xl font-bold text-white mb-4">레이팅 변화 추이</h3>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart
          data={chartData}
          margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#27272a" />
          <XAxis
            dataKey="date"
            stroke="#71717a"
            tick={{ fill: '#71717a', fontSize: 12 }}
            tickFormatter={(value) => {
              const date = new Date(value)
              return `${date.getMonth() + 1}/${date.getDate()}`
            }}
          />
          <YAxis
            stroke="#71717a"
            tick={{ fill: '#71717a', fontSize: 12 }}
            domain={[yAxisMin, yAxisMax]}
          />
          <Tooltip content={<CustomTooltip />} />
          <Line
            type="monotone"
            dataKey="myRatingAfter"
            stroke="#ef4444"
            strokeWidth={3}
            dot={(props: any) => {
              const { cx, cy, payload } = props
              const isWin = payload.isWin
              return (
                <circle
                  cx={cx}
                  cy={cy}
                  r={5}
                  fill={isWin ? '#22c55e' : '#ef4444'}
                  stroke={isWin ? '#16a34a' : '#dc2626'}
                  strokeWidth={2}
                />
              )
            }}
            activeDot={{ r: 8 }}
          />
        </LineChart>
      </ResponsiveContainer>
      <div className="flex items-center justify-center gap-6 mt-4 text-sm">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-green-500 border-2 border-green-600"></div>
          <span className="text-zinc-400">승리</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-red-500 border-2 border-red-600"></div>
          <span className="text-zinc-400">패배</span>
        </div>
      </div>
    </div>
  )
}
