'use client'

import { useState, useEffect } from 'react'
import { tables } from '@/lib/supabase'
import type { Database } from '@/types/database'
import { Command, CommandInput, CommandList, CommandEmpty, CommandGroup, CommandItem } from '@/components/ui/command'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Button } from '@/components/ui/button'
import { ChevronsUpDown, Check } from 'lucide-react'
import { cn } from '@/lib/utils'

type Player = Database['public']['Tables']['players']['Row']

interface PlayerSearchComboboxProps {
  onSelect: (player: Player) => void
  selected: Player | null
  placeholder?: string
}

export function PlayerSearchCombobox({ onSelect, selected, placeholder }: PlayerSearchComboboxProps) {
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [players, setPlayers] = useState<Player[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (query.length >= 2) {
      searchPlayers(query)
    } else {
      setPlayers([])
    }
  }, [query])

  async function searchPlayers(searchQuery: string) {
    setLoading(true)
    
    try {
      console.log('🔍 Searching players with query:', searchQuery)
      
      const { data, error } = await tables.players()
        .select('*')
        .ilike('name', `%${searchQuery}%`)
        .limit(10)
      
      if (error) {
        console.error('❌ Player search error:', error)
        console.error('Error details:', {
          message: error.message,
          details: error.details,
          hint: error.hint,
          code: error.code
        })
        setPlayers([])
      } else {
        console.log('✅ Found players:', data?.length || 0)
        setPlayers(data || [])
      }
    } catch (error) {
      console.error('❌ Player search exception:', error)
      setPlayers([])
    } finally {
      // 항상 loading을 false로 설정하여 무한 로딩 방지
      setLoading(false)
    }
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between text-left h-12 bg-zinc-800/50 border-white/5 text-white hover:bg-zinc-800 hover:text-white"
        >
          {selected
            ? `${selected.name} (레이팅: ${selected.rating})`
            : placeholder || '선수 선택...'}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[400px] p-0 bg-zinc-900 border-zinc-800 shadow-2xl">
        <Command className="bg-zinc-900" shouldFilter={false}>
          <CommandInput
            placeholder="선수 이름 검색..."
            value={query}
            onValueChange={setQuery}
            aria-label="선수 이름 검색"
            className="h-12 bg-zinc-800/50 border-none text-white placeholder:text-zinc-500"
          />
          <CommandList className="max-h-[300px]">
            {loading && (
              <div className="py-6 text-center text-sm text-zinc-500">검색 중...</div>
            )}
            {!loading && query.length >= 2 && players.length === 0 && (
              <CommandEmpty className="text-zinc-500">선수를 찾을 수 없습니다.</CommandEmpty>
            )}
            {!loading && query.length < 2 && (
              <div className="py-6 text-center text-sm text-zinc-500">
                2글자 이상 입력하세요
              </div>
            )}
            {!loading && players.length > 0 && (
              <CommandGroup>
                {players.map((player) => (
                  <CommandItem
                    key={player.id}
                    onSelect={() => {
                      onSelect(player)
                      setOpen(false)
                      setQuery('')
                    }}
                    className="text-white hover:bg-zinc-700 cursor-pointer py-3 px-4"
                  >
                    <Check
                      className={cn(
                        "mr-3 h-4 w-4 text-green-500",
                        selected?.id === player.id ? "opacity-100" : "opacity-0"
                      )}
                    />
                    <div className="flex justify-between items-center w-full gap-4">
                      <span className="font-medium text-white">{player.name}</span>
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-zinc-400">레이팅</span>
                        <span className="font-bold text-red-400 text-base">{player.rating}</span>
                      </div>
                    </div>
                  </CommandItem>
                ))}
              </CommandGroup>
            )}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
