"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Home, User, GitCompare, ClipboardEdit, School } from "lucide-react"
import { cn } from "@/lib/utils"

const navItems = [
  { href: "/", label: "홈", icon: Home },
  { href: "/players", label: "선수", icon: User },
  { href: "/compare", label: "비교", icon: GitCompare },
  { href: "/schools", label: "학교", icon: School },
  { href: "/admin/results", label: "관리", icon: ClipboardEdit },
]

export function SiteHeader() {
  const pathname = usePathname()

  return (
    <>
      {/* Desktop Floating Dock */}
      <header className="hidden md:flex fixed top-6 left-1/2 -translate-x-1/2 z-50">
        <nav className="flex items-center gap-1 px-2 py-2 bg-zinc-900/70 backdrop-blur-xl border border-white/10 rounded-full shadow-lg">
          <Link href="/" className="flex items-center gap-2 px-3 py-1.5 mr-2">
            <div className="w-7 h-7 bg-gradient-to-br from-red-500 to-red-600 rounded-lg flex items-center justify-center shadow-lg shadow-red-500/20">
              <span className="text-white font-bold text-xs">TR</span>
            </div>
            <span className="font-bold text-sm text-white">TakuRating</span>
          </Link>
          <div className="w-px h-6 bg-white/10 mr-1" />
          {navItems.map((item) => {
            const isActive = pathname === item.href || 
              (item.href !== "/" && pathname.startsWith(item.href))
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "px-4 py-2 rounded-full text-sm font-medium transition-all duration-200",
                  isActive
                    ? "bg-red-500 text-white shadow-lg shadow-red-500/25"
                    : "text-zinc-400 hover:text-white hover:bg-white/5"
                )}
              >
                {item.label}
              </Link>
            )
          })}
        </nav>
      </header>

      {/* Mobile Bottom Navigation - Floating Dock Style */}
      <nav className="md:hidden fixed bottom-4 left-4 right-4 z-50">
        <div className="flex items-center justify-around py-3 px-2 bg-zinc-900/80 backdrop-blur-xl border border-white/10 rounded-2xl shadow-lg">
          {navItems.map((item) => {
            const Icon = item.icon
            const isActive = pathname === item.href || 
              (item.href !== "/" && pathname.startsWith(item.href))
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex flex-col items-center justify-center gap-1 px-3 py-2 rounded-xl transition-all duration-200 min-w-[52px]",
                  isActive
                    ? "text-red-500"
                    : "text-zinc-500"
                )}
              >
                <Icon className={cn("w-5 h-5", isActive && "drop-shadow-[0_0_8px_rgba(239,68,68,0.5)]")} />
                <span className="text-[10px] font-medium">{item.label}</span>
              </Link>
            )
          })}
        </div>
      </nav>
    </>
  )
}
