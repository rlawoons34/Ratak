import { HeroSection } from "@/components/home/hero-section"
import { MonthlyInsights } from "@/components/home/monthly-insights"
import { RankingTable } from "@/components/home/ranking-table"
import { views } from "@/lib/supabase"

// Revalidate every 60 seconds
export const revalidate = 60

export default async function HomePage() {
  // Fetch player statistics from Supabase view
  const { data: players, error } = await views.playerStatistics()
    .select('*')
    .order('rating', { ascending: false })
    .limit(100)

  if (error) {
    console.error('Failed to fetch players:', error)
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
        <div className="text-red-500">
          <h2 className="text-2xl font-bold mb-2">데이터 로딩 실패</h2>
          <p className="text-sm">{error.message}</p>
        </div>
      </div>
    )
  }

  // Calculate insights from real data
  const recentPlayers = players || []
  
  // Find top riser (highest positive rating change in last 30 days)
  const topRiser = recentPlayers
    .filter(p => p.rating_change_30d > 0)
    .sort((a, b) => b.rating_change_30d - a.rating_change_30d)[0] || null

  // Find biggest upset (player with significant rating gain)
  const biggestUpset = recentPlayers
    .filter(p => p.rating_change_30d > 50)
    .sort((a, b) => b.rating_change_30d - a.rating_change_30d)[0] || null

  return (
    <div className="min-h-screen bg-zinc-950">
      <div className="container mx-auto px-4 space-y-8 py-8">
        <HeroSection />
        <MonthlyInsights biggestUpset={biggestUpset} topRiser={topRiser} />
        <RankingTable players={recentPlayers} />
      </div>
    </div>
  )
}
