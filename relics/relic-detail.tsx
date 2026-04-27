'use client'

import { motion } from 'framer-motion'
import { Relic, CATEGORY_LABELS, CATEGORY_ICONS } from '@/lib/types'
import { MapPin, Clock, Globe, Users, Tag, AlertTriangle, Sparkles } from 'lucide-react'
import { Badge } from '@/components/ui/badge'

interface RelicDetailProps {
  relic: Relic
}

export function RelicDetail({ relic }: RelicDetailProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-8"
    >
      {/* Header */}
      <header>
        <div className="flex flex-wrap items-center gap-2 mb-4">
          <Badge variant="secondary" className="text-sm">
            {CATEGORY_ICONS[relic.category]} {CATEGORY_LABELS[relic.category]}
          </Badge>
          {relic.is_verified && (
            <Badge className="bg-emerald-500/10 text-emerald-400 border-emerald-500/20">
              Verified
            </Badge>
          )}
          {relic.ai_museum_ready && (
            <Badge className="bg-primary/10 text-primary border-primary/20">
              <Sparkles className="w-3 h-3 mr-1" />
              Museum Ready
            </Badge>
          )}
          {relic.status === 'draft' && (
            <Badge variant="outline" className="text-amber-400 border-amber-400/30">
              Draft
            </Badge>
          )}
        </div>
        
        <h1 className="text-3xl md:text-4xl font-bold mb-4 text-balance">
          {relic.title}
        </h1>
        
        {/* Quick Meta */}
        <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
          {relic.origin_country && (
            <span className="flex items-center gap-1.5">
              <MapPin className="w-4 h-4" />
              {relic.origin_region ? `${relic.origin_region}, ${relic.origin_country}` : relic.origin_country}
            </span>
          )}
          {relic.time_period && (
            <span className="flex items-center gap-1.5">
              <Clock className="w-4 h-4" />
              {relic.time_period}
            </span>
          )}
          {relic.cultural_group && (
            <span className="flex items-center gap-1.5">
              <Users className="w-4 h-4" />
              {relic.cultural_group}
            </span>
          )}
        </div>
      </header>
      
      {/* Description */}
      {relic.description && (
        <section>
          <h2 className="text-lg font-semibold mb-3">Description</h2>
          <p className="text-muted-foreground leading-relaxed">{relic.description}</p>
        </section>
      )}
      
      {/* Story */}
      {relic.story && (
        <section className="relative p-6 bg-gradient-to-br from-card to-muted/30 rounded-xl border border-border/50">
          <div className="absolute top-0 left-6 -translate-y-1/2 px-3 py-1 bg-background text-sm font-medium rounded-full border border-border/50">
            The Story
          </div>
          <p className="text-foreground/90 leading-relaxed italic">{relic.story}</p>
        </section>
      )}
      
      {/* AI Significance */}
      {relic.ai_significance && (
        <section>
          <h2 className="text-lg font-semibold mb-3 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-primary" />
            Cultural Significance
          </h2>
          <p className="text-muted-foreground leading-relaxed">{relic.ai_significance}</p>
        </section>
      )}
      
      {/* Tags */}
      {relic.tags && relic.tags.length > 0 && (
        <section>
          <h2 className="text-lg font-semibold mb-3 flex items-center gap-2">
            <Tag className="w-4 h-4" />
            Tags
          </h2>
          <div className="flex flex-wrap gap-2">
            {relic.tags.map((tag, index) => (
              <Badge key={index} variant="outline" className="text-sm">
                {tag}
              </Badge>
            ))}
          </div>
        </section>
      )}
      
      {/* Related Traditions */}
      {relic.ai_related_traditions && relic.ai_related_traditions.length > 0 && (
        <section>
          <h2 className="text-lg font-semibold mb-3 flex items-center gap-2">
            <Globe className="w-4 h-4" />
            Related Traditions
          </h2>
          <div className="flex flex-wrap gap-2">
            {relic.ai_related_traditions.map((tradition, index) => (
              <Badge key={index} variant="secondary" className="text-sm">
                {tradition}
              </Badge>
            ))}
          </div>
        </section>
      )}
      
      {/* Metadata Footer */}
      <footer className="pt-6 border-t border-border/50 text-sm text-muted-foreground">
        <div className="flex flex-wrap gap-4">
          <span>Added {new Date(relic.created_at).toLocaleDateString()}</span>
          <span>{relic.view_count} views</span>
          {relic.estimated_era && <span>Era: {relic.estimated_era}</span>}
        </div>
      </footer>
    </motion.div>
  )
}
