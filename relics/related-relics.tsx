'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { CATEGORY_LABELS, RelicCategory } from '@/lib/types'
import { ArrowRight } from 'lucide-react'

interface RelatedRelic {
  id: string
  title: string
  primary_image_url: string | null
  category: RelicCategory
  ai_preservation_urgency: number | null
}

interface RelatedRelicsProps {
  relics: RelatedRelic[]
  currentCategory: RelicCategory
}

export function RelatedRelics({ relics, currentCategory }: RelatedRelicsProps) {
  return (
    <section className="mt-16 pt-8 border-t border-border/50">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold">Related Relics</h2>
        <Link 
          href={`/explore?category=${currentCategory}`}
          className="text-sm text-primary hover:underline flex items-center gap-1"
        >
          View all {CATEGORY_LABELS[currentCategory]}
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {relics.map((relic, index) => (
          <motion.div
            key={relic.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: index * 0.1 }}
          >
            <Link href={`/relic/${relic.id}`} className="group block">
              <div className="relative aspect-square rounded-xl overflow-hidden bg-muted border border-border/50 group-hover:border-primary/50 transition-colors">
                {relic.primary_image_url ? (
                  <img
                    src={relic.primary_image_url}
                    alt={relic.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-muted to-muted/50">
                    <span className="text-3xl opacity-30">🏛️</span>
                  </div>
                )}
                
                {/* Urgency Badge */}
                {relic.ai_preservation_urgency && relic.ai_preservation_urgency >= 7 && (
                  <div className="absolute top-2 right-2 px-2 py-0.5 text-xs font-medium bg-red-500/80 text-white rounded-full">
                    Urgent
                  </div>
                )}
                
                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                
                {/* Title */}
                <div className="absolute bottom-0 left-0 right-0 p-3">
                  <h3 className="text-white text-sm font-medium line-clamp-2 group-hover:text-primary-foreground transition-colors">
                    {relic.title}
                  </h3>
                </div>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>
    </section>
  )
}
