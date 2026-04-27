'use client'

import { motion } from 'framer-motion'
import { Clock, Sparkles, AlertTriangle, Rocket } from 'lucide-react'

interface TimeCapsuleCardProps {
  timeCapsuleNote: string | null
  currentRelevance: string | null
  futureImportance: string | null
  preservationUrgency: number | null
}

export function TimeCapsuleCard({
  timeCapsuleNote,
  currentRelevance,
  futureImportance,
  preservationUrgency
}: TimeCapsuleCardProps) {
  const urgencyLevel = preservationUrgency 
    ? preservationUrgency >= 8 ? 'critical' 
      : preservationUrgency >= 5 ? 'moderate' 
      : 'stable'
    : null

  const urgencyConfig = {
    critical: {
      color: 'from-red-500/20 to-red-600/10',
      border: 'border-red-500/30',
      text: 'text-red-400',
      label: 'Critical Preservation Needed'
    },
    moderate: {
      color: 'from-amber-500/20 to-amber-600/10',
      border: 'border-amber-500/30',
      text: 'text-amber-400',
      label: 'Moderate Urgency'
    },
    stable: {
      color: 'from-emerald-500/20 to-emerald-600/10',
      border: 'border-emerald-500/30',
      text: 'text-emerald-400',
      label: 'Stable for Now'
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className={`relative overflow-hidden rounded-xl border ${urgencyLevel ? urgencyConfig[urgencyLevel].border : 'border-primary/30'}`}
    >
      {/* Animated Background */}
      <div className={`absolute inset-0 bg-gradient-to-br ${urgencyLevel ? urgencyConfig[urgencyLevel].color : 'from-primary/10 to-accent/10'}`} />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-primary/5 via-transparent to-transparent" />
      
      {/* Floating Particles Effect */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(5)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 rounded-full bg-primary/40"
            initial={{ 
              x: Math.random() * 100 + '%', 
              y: '100%',
              opacity: 0.3 
            }}
            animate={{ 
              y: '-20%',
              opacity: [0.3, 0.8, 0.3]
            }}
            transition={{
              duration: 4 + Math.random() * 2,
              repeat: Infinity,
              delay: i * 0.5,
              ease: 'linear'
            }}
          />
        ))}
      </div>
      
      <div className="relative p-6 space-y-4">
        {/* Header */}
        <div className="flex items-center gap-2">
          <div className="p-2 bg-primary/20 rounded-lg">
            <Sparkles className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h3 className="font-semibold">Time Capsule</h3>
            <p className="text-xs text-muted-foreground">AI Temporal Analysis</p>
          </div>
        </div>
        
        {/* Urgency Indicator */}
        {urgencyLevel && (
          <div className={`flex items-center gap-2 text-sm ${urgencyConfig[urgencyLevel].text}`}>
            <AlertTriangle className="w-4 h-4" />
            <span className="font-medium">{urgencyConfig[urgencyLevel].label}</span>
            <span className="ml-auto font-bold">{preservationUrgency}/10</span>
          </div>
        )}
        
        {/* Time Capsule Note */}
        {timeCapsuleNote && (
          <blockquote className="pl-4 border-l-2 border-primary/50 italic text-foreground/90">
            &ldquo;{timeCapsuleNote}&rdquo;
          </blockquote>
        )}
        
        {/* Current Relevance */}
        {currentRelevance && (
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm font-medium">
              <Clock className="w-4 h-4 text-muted-foreground" />
              <span>Today&apos;s Relevance</span>
            </div>
            <p className="text-sm text-muted-foreground">{currentRelevance}</p>
          </div>
        )}
        
        {/* Future Importance */}
        {futureImportance && (
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm font-medium">
              <Rocket className="w-4 h-4 text-primary" />
              <span>50-100 Years From Now</span>
            </div>
            <p className="text-sm text-muted-foreground">{futureImportance}</p>
          </div>
        )}
      </div>
    </motion.div>
  )
}
