"use client"

import React from "react"
import { Navigation } from "./navigation"

interface PageLayoutProps {
  children: React.ReactNode
}

export function PageLayout({ children }: PageLayoutProps) {
  return (
    <div className="min-h-screen bg-black">
      {/* Background gradients */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-red-500/5 rounded-full blur-[120px]" />
        <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-blue-500/3 rounded-full blur-[100px]" />
      </div>
      
      <Navigation />
      
      <main className="relative pt-24 md:pt-28 pb-24 md:pb-8">
        {children}
      </main>
    </div>
  )
}
