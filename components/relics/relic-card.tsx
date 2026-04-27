'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { Badge } from '@/components/ui/badge'
import { Eye, Share2 } from 'lucide-react'
import type { Relic } from '@/lib/types'

interface RelicCardProps {
  relic: Relic
  index?: number
}

export function RelicCard({ relic, index = 0 }: RelicCardProps) {
  return (
    <Link href={`/relic/${relic.id}`}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.05 }}
        className="group relative overflow-hidden rounded-lg border border-primary/20 bg-secondary/50 backdrop-blur-sm hover:border-primary/50 transition-all duration-300 cursor-pointer h-full"
      >
        {/* Image Background */}
        {relic.primary_image_url && (
          <div className="relative h-48 overflow-hidden bg-gradient-to-br from-primary/20 to-accent/20">
            <img
              src={relic.primary_image_url}
              alt={relic.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-60" />
          </div>
        )}

        {/* Content */}
        <div className="p-4 space-y-3">
          <div className="space-y-1">
            <h3 className="font-serif font-bold text-primary line-clamp-2 group-hover:text-primary/80 transition-colors">
              {relic.title}
            </h3>
            <p className="text-sm text-muted-foreground line-clamp-2">{relic.description}</p>
          </div>

          {/* Tags */}
          <div className="flex flex-wrap gap-2">
            <Badge variant="secondary" className="text-xs">
              {relic.category}
            </Badge>
            {relic.cultural_group && (
              <Badge variant="outline" className="text-xs">
                {relic.cultural_group}
              </Badge>
            )}
          </div>

          {/* Stats */}
          <div className="flex items-center justify-between pt-2 border-t border-primary/10 text-xs text-muted-foreground">
            <div className="flex items-center gap-1">
              <Eye className="w-3 h-3" />
              <span>{relic.view_count || 0}</span>
            </div>
            <div className="flex items-center gap-1">
              <Share2 className="w-3 h-3" />
              <span>Share</span>
            </div>
          </div>

          {/* AI Urgency Badge */}
          {relic.ai_preservation_urgency && (
            <div className="absolute top-3 right-3">
              <div className={`px-2 py-1 rounded text-xs font-mono backdrop-blur-sm border ${
                relic.ai_preservation_urgency >= 8
                  ? 'bg-red-500/20 border-red-500/30 text-red-300'
                  : relic.ai_preservation_urgency >= 5
                    ? 'bg-amber-500/20 border-amber-500/30 text-amber-300'
                    : 'bg-emerald-500/20 border-emerald-500/30 text-emerald-300'
              }`}>
                Urgency: {relic.ai_preservation_urgency}/10
              </div>
            </div>
          )}
        </div>
      </motion.div>
    </Link>
  )
}
