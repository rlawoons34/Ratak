"use client"

import { HeroSection } from "@/components/home/hero-section"
import { MonthlyInsights } from "@/components/home/monthly-insights"
import { RankingTable } from "@/components/home/ranking-table"
import { players, getBiggestUpset, getTopRiser } from "@/lib/mock-data"

export default function HomePage() {
  const biggestUpset = getBiggestUpset()
  const topRiser = getTopRiser()

  return (
    <div className="min-h-screen bg-zinc-950">
      <div className="container mx-auto px-4 space-y-8 py-8">
        <HeroSection />
        <MonthlyInsights biggestUpset={biggestUpset} topRiser={topRiser} />
        <RankingTable players={players} />
      </div>
    </div>
  )
}
