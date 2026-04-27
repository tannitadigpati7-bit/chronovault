'use client'

import { useState, useTransition } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Search, X } from 'lucide-react'
import { motion } from 'framer-motion'

interface SearchBarProps {
  initialQuery?: string
}

export function SearchBar({ initialQuery = '' }: SearchBarProps) {
  const [query, setQuery] = useState(initialQuery)
  const [isPending, startTransition] = useTransition()
  const router = useRouter()
  const searchParams = useSearchParams()
  
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    
    startTransition(() => {
      const params = new URLSearchParams(searchParams.toString())
      if (query.trim()) {
        params.set('q', query.trim())
      } else {
        params.delete('q')
      }
      router.push(`/explore?${params.toString()}`)
    })
  }
  
  const handleClear = () => {
    setQuery('')
    startTransition(() => {
      const params = new URLSearchParams(searchParams.toString())
      params.delete('q')
      router.push(`/explore?${params.toString()}`)
    })
  }
  
  return (
    <form onSubmit={handleSearch} className="relative max-w-xl mx-auto">
      <div className="relative group">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#888888] group-focus-within:text-[#FF8C00] transition-colors" />
        <input
          type="text"
          placeholder="Search relics, traditions, stories..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full pl-12 pr-28 h-14 text-lg bg-[#121212] border border-[#333333] rounded-full text-[#F5E8D8] placeholder:text-[#888888] focus:border-[#FF8C00]/50 focus:outline-none focus:ring-2 focus:ring-[#FF8C00]/20 transition-all"
        />
        {query && (
          <button
            type="button"
            onClick={handleClear}
            className="absolute right-24 top-1/2 -translate-y-1/2 p-1 text-[#888888] hover:text-[#F5E8D8] transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        )}
        <motion.button
          type="submit"
          disabled={isPending}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="absolute right-2 top-1/2 -translate-y-1/2 px-6 py-2.5 bg-[#FF8C00] text-[#0A0A0A] font-medium rounded-full hover:bg-[#FFa030] disabled:opacity-50 transition-colors shadow-[0_0_20px_rgba(255,140,0,0.3)]"
        >
          {isPending ? 'Searching...' : 'Search'}
        </motion.button>
      </div>
    </form>
  )
}
