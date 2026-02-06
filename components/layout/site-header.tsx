"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Home, User, GitCompare, ClipboardEdit, School, LogIn, LogOut } from "lucide-react"
import { useAuth } from "@/lib/auth-context"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

const navItems = [
  { href: "/", label: "홈", icon: Home },
  { href: "/players", label: "선수", icon: User },
  { href: "/compare", label: "비교", icon: GitCompare },
  { href: "/schools", label: "학교", icon: School },
]

export function SiteHeader() {
  const pathname = usePathname()
  const { user, isAdmin, loading, signOut } = useAuth()

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
          {/* 🔥 Updated: 2026-02-05 07:10 - Fixed button overlap issue */}
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
          {/* Auth & Admin Section */}
          <div className="w-px h-6 bg-white/10 mx-1" />
          {loading ? (
            <div className="px-4 py-2 text-zinc-500 text-sm">
              로딩중...
            </div>
          ) : (
            <div className="flex items-center gap-1">
              {/* Admin Button - Only show when logged in as admin */}
              {user && isAdmin && (
                <Link href="/admin/results">
                  <Button
                    variant="ghost"
                    size="sm"
                    className={cn(
                      "rounded-full text-sm font-medium transition-all duration-200",
                      pathname.startsWith("/admin")
                        ? "bg-red-500 text-white shadow-lg shadow-red-500/25"
                        : "text-zinc-400 hover:text-white hover:bg-white/5"
                    )}
                  >
                    <ClipboardEdit className="w-4 h-4 mr-1" />
                    관리
                  </Button>
                </Link>
              )}
              
              {/* Login/Logout Button */}
              {!user ? (
                <Link href="/auth">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-white hover:text-white hover:bg-red-500/20 rounded-full border border-red-500/50 bg-red-500/10"
                  >
                    <LogIn className="w-4 h-4 mr-1" />
                    로그인
                  </Button>
                </Link>
              ) : (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={signOut}
                  className="text-white hover:text-white hover:bg-red-500/20 rounded-full border border-red-500/50 bg-red-500/10"
                >
                  <LogOut className="w-4 h-4 mr-1" />
                  로그아웃
                </Button>
              )}
            </div>
          )}
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
          {/* Admin Button for Mobile - Only show when logged in as admin */}
          {!loading && user && isAdmin && (
            <Link
              href="/admin/results"
              className={cn(
                "flex flex-col items-center justify-center gap-1 px-3 py-2 rounded-xl transition-all duration-200 min-w-[52px]",
                pathname.startsWith("/admin")
                  ? "text-red-500"
                  : "text-zinc-500"
              )}
            >
              <ClipboardEdit className={cn("w-5 h-5", pathname.startsWith("/admin") && "drop-shadow-[0_0_8px_rgba(239,68,68,0.5)]")} />
              <span className="text-[10px] font-medium">관리</span>
            </Link>
          )}
          
          {/* Auth Button for Mobile */}
          {loading ? (
            <div className="flex flex-col items-center justify-center gap-1 px-3 py-2 rounded-xl min-w-[52px] text-zinc-600">
              <div className="w-5 h-5 rounded-full border-2 border-zinc-700 border-t-zinc-500 animate-spin" />
              <span className="text-[10px] font-medium">로딩</span>
            </div>
          ) : !user ? (
            <Link
              href="/auth"
              className="flex flex-col items-center justify-center gap-1 px-3 py-2 rounded-xl transition-all duration-200 min-w-[52px] text-red-400 hover:text-red-300"
            >
              <LogIn className="w-5 h-5" />
              <span className="text-[10px] font-medium">로그인</span>
            </Link>
          ) : (
            <button
              onClick={signOut}
              className="flex flex-col items-center justify-center gap-1 px-3 py-2 rounded-xl transition-all duration-200 min-w-[52px] text-red-400 hover:text-red-300"
            >
              <LogOut className="w-5 h-5" />
              <span className="text-[10px] font-medium">로그아웃</span>
            </button>
          )}
        </div>
      </nav>
    </>
  )
}
