'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { Relic, CATEGORY_LABELS } from '@/lib/types'
import { Clock, Eye, MapPin, Scroll } from 'lucide-react'

interface RelicGridProps {
  relics: Relic[]
}

export function RelicGrid({ relics }: RelicGridProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {relics.map((relic, index) => (
        <RelicCard key={relic.id} relic={relic} index={index} />
      ))}
    </div>
  )
}

function RelicCard({ relic, index }: { relic: Relic; index: number }) {
  const urgencyColor = relic.ai_preservation_urgency 
    ? relic.ai_preservation_urgency >= 8 
      ? 'text-red-400 bg-red-500/20' 
      : relic.ai_preservation_urgency >= 5 
        ? 'text-[#FF8C00] bg-[#FF8C00]/20' 
        : 'text-emerald-400 bg-emerald-500/20'
    : 'text-[#888888] bg-[#1A1A1A]'

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
      whileHover={{ y: -4 }}
    >
      <Link href={`/relic/${relic.id}`} className="group block">
        <article className="relative bg-[#121212] rounded-xl border border-[#333333]/50 overflow-hidden transition-all duration-300 hover:border-[#FF8C00]/50 hover:shadow-lg hover:shadow-[#FF8C00]/10">
          {/* Image */}
          <div className="aspect-[4/3] relative overflow-hidden bg-gradient-to-br from-[#1A1A1A] to-[#0A0A0A]">
            {relic.primary_image_url ? (
              <img
                src={relic.primary_image_url}
                alt={relic.title}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <Scroll className="w-12 h-12 text-[#333333]" />
              </div>
            )}
            
            {/* Category Badge */}
            <div className="absolute top-3 left-3">
              <span className="px-2.5 py-1 text-[10px] font-mono uppercase tracking-wider bg-[#FF8C00]/20 text-[#FF8C00] backdrop-blur-sm rounded border border-[#FF8C00]/30">
                {CATEGORY_LABELS[relic.category]}
              </span>
            </div>
            
            {/* Urgency Indicator */}
            {relic.ai_preservation_urgency && (
              <div className={`absolute top-3 right-3 px-2 py-1 text-[10px] font-mono rounded backdrop-blur-sm ${urgencyColor}`}>
                Rarity: {relic.ai_preservation_urgency}/10
              </div>
            )}
            
            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A] via-transparent to-transparent opacity-60" />
          </div>
          
          {/* Content */}
          <div className="p-4">
            <h3 className="font-semibold text-lg text-[#F5E8D8] mb-1 line-clamp-1 group-hover:text-[#FF8C00] transition-colors">
              {relic.title}
            </h3>
            
            {relic.description && (
              <p className="text-sm text-[#888888] line-clamp-2 mb-3">
                {relic.description}
              </p>
            )}
            
            {/* Meta */}
            <div className="flex items-center gap-4 text-xs text-[#888888]">
              {relic.origin_country && (
                <span className="flex items-center gap-1">
                  <MapPin className="w-3 h-3 text-[#FF8C00]" />
                  {relic.origin_country}
                </span>
              )}
              {relic.time_period && (
                <span className="flex items-center gap-1">
                  <Clock className="w-3 h-3 text-[#FF8C00]" />
                  {relic.time_period}
                </span>
              )}
              <span className="flex items-center gap-1 ml-auto">
                <Eye className="w-3 h-3" />
                {relic.view_count}
              </span>
            </div>
            
            {/* Time Capsule Note Preview */}
            {relic.ai_time_capsule_note && (
              <div className="mt-3 pt-3 border-t border-[#333333]">
                <p className="text-xs text-[#F5E8D8]/70 italic line-clamp-2 font-serif">
                  &ldquo;{relic.ai_time_capsule_note}&rdquo;
                </p>
              </div>
            )}
          </div>
          
          {/* Hover Glow Effect */}
          <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
            <div className="absolute inset-0 bg-gradient-to-r from-[#FF8C00]/0 via-[#FF8C00]/5 to-[#FF8C00]/0" />
          </div>
        </article>
      </Link>
    </motion.div>
  )
}
