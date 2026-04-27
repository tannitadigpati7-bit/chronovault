'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { motion } from 'framer-motion'
import { Scroll, BookOpen, Wrench, Globe, Languages, Coffee, Archive } from 'lucide-react'

interface CategoryFilterProps {
  activeCategory: string
}

const categories = [
  { value: 'all', label: 'All Relics', icon: Archive },
  { value: 'artifact', label: 'Artifacts', icon: Scroll },
  { value: 'practice', label: 'Practices', icon: Globe },
  { value: 'profession', label: 'Professions', icon: Wrench },
  { value: 'story', label: 'Stories', icon: BookOpen },
  { value: 'language', label: 'Languages', icon: Languages },
  { value: 'everyday', label: 'Everyday', icon: Coffee },
]

export function CategoryFilter({ activeCategory }: CategoryFilterProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  
  const handleCategoryChange = (category: string) => {
    const params = new URLSearchParams(searchParams.toString())
    if (category === 'all') {
      params.delete('category')
    } else {
      params.set('category', category)
    }
    router.push(`/explore?${params.toString()}`)
  }
  
  return (
    <div className="flex flex-wrap gap-2">
      {categories.map((category) => {
        const isActive = activeCategory === category.value
        const Icon = category.icon
        
        return (
          <motion.button
            key={category.value}
            onClick={() => handleCategoryChange(category.value)}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className={`relative flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg transition-all ${
              isActive 
                ? 'bg-[#FF8C00] text-[#0A0A0A] shadow-[0_0_15px_rgba(255,140,0,0.3)]' 
                : 'bg-[#1A1A1A] text-[#888888] hover:text-[#F5E8D8] hover:bg-[#2A2A2A] border border-[#333333]'
            }`}
          >
            <Icon className={`w-4 h-4 ${isActive ? 'text-[#0A0A0A]' : 'text-[#FF8C00]'}`} />
            <span>{category.label}</span>
          </motion.button>
        )
      })}
    </div>
  )
}
