"use client"

import { useAuth } from "@/lib/auth-context"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function TestAuthPage() {
  const { user, profile, isAdmin, loading, signOut } = useAuth()

  return (
    <div className="min-h-screen bg-zinc-950 flex items-center justify-center px-4">
      <div className="max-w-2xl w-full space-y-6">
        <h1 className="text-3xl font-bold text-white mb-8">🔍 Auth Context Debug Page</h1>
        
        {/* Loading State */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-6">
          <h2 className="text-xl font-semibold text-white mb-4">Loading State</h2>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-zinc-400">Loading:</span>
              <span className={`font-mono ${loading ? 'text-yellow-500' : 'text-green-500'}`}>
                {loading ? 'true ⏳' : 'false ✅'}
              </span>
            </div>
          </div>
        </div>

        {/* User State */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-6">
          <h2 className="text-xl font-semibold text-white mb-4">User State</h2>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-zinc-400">User:</span>
              <span className={`font-mono ${user ? 'text-green-500' : 'text-red-500'}`}>
                {user ? 'Logged In ✅' : 'Not Logged In ❌'}
              </span>
            </div>
            {user && (
              <>
                <div className="flex justify-between">
                  <span className="text-zinc-400">Email:</span>
                  <span className="text-white font-mono text-sm">{user.email}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-400">User ID:</span>
                  <span className="text-white font-mono text-xs">{user.id}</span>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Profile State */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-6">
          <h2 className="text-xl font-semibold text-white mb-4">Profile State</h2>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-zinc-400">Profile:</span>
              <span className={`font-mono ${profile ? 'text-green-500' : 'text-red-500'}`}>
                {profile ? 'Loaded ✅' : 'Not Loaded ❌'}
              </span>
            </div>
            {profile && (
              <>
                <div className="flex justify-between">
                  <span className="text-zinc-400">Display Name:</span>
                  <span className="text-white font-mono">{profile.display_name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-400">Role:</span>
                  <span className={`font-mono font-bold ${profile.role === 'admin' ? 'text-red-500' : 'text-blue-500'}`}>
                    {profile.role.toUpperCase()}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-400">Is Admin:</span>
                  <span className={`font-mono ${isAdmin ? 'text-green-500' : 'text-zinc-500'}`}>
                    {isAdmin ? 'true ✅' : 'false'}
                  </span>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-6">
          <h2 className="text-xl font-semibold text-white mb-4">Actions</h2>
          <div className="flex gap-4">
            {!user ? (
              <Link href="/auth" className="flex-1">
                <Button className="w-full bg-red-500 hover:bg-red-600">
                  Go to Login Page
                </Button>
              </Link>
            ) : (
              <>
                <Button 
                  onClick={signOut}
                  variant="destructive"
                  className="flex-1"
                >
                  Sign Out
                </Button>
                {isAdmin && (
                  <Link href="/admin/results" className="flex-1">
                    <Button className="w-full bg-blue-500 hover:bg-blue-600">
                      Go to Admin Panel
                    </Button>
                  </Link>
                )}
              </>
            )}
          </div>
        </div>

        {/* Raw Data */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-6">
          <h2 className="text-xl font-semibold text-white mb-4">Raw Data (JSON)</h2>
          <pre className="text-xs text-zinc-400 overflow-auto max-h-60 bg-zinc-950 p-4 rounded">
            {JSON.stringify({ 
              loading, 
              user: user ? { id: user.id, email: user.email } : null,
              profile, 
              isAdmin 
            }, null, 2)}
          </pre>
        </div>

        <Link href="/">
          <Button variant="outline" className="w-full">
            ← Back to Home
          </Button>
        </Link>
      </div>
    </div>
  )
}
