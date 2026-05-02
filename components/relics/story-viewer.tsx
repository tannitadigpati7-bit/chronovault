'use client'

import { motion } from 'framer-motion'
import { Share2, Download, Heart, Eye } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'

interface StoryViewerProps {
  title: string
  story: string
  culturalGroup: string
  originCountry: string
  creatorName: string
  viewCount: number
  aiTimeCapsuleNote: string
  aiFutureImportance: string
  aiCurrentRelevance: string
  onShare: () => void
}

export function StoryViewer({
  title,
  story,
  culturalGroup,
  originCountry,
  creatorName,
  viewCount,
  aiTimeCapsuleNote,
  aiFutureImportance,
  aiCurrentRelevance,
  onShare
}: StoryViewerProps) {
  return (
    <div className="space-y-6">
      {/* Story Header */}
      <div className="border-b border-primary/20 pb-6">
        <h2 className="text-3xl font-serif font-bold text-primary mb-3 text-balance">{title}</h2>
        
        <div className="flex flex-wrap items-center gap-3 mb-4">
          <Badge variant="secondary">{culturalGroup}</Badge>
          <Badge variant="outline">{originCountry}</Badge>
          <div className="flex items-center gap-1 text-sm text-muted-foreground">
            <Eye className="w-4 h-4" />
            <span>{viewCount} views</span>
          </div>
        </div>

        <p className="text-sm text-muted-foreground">Shared by <span className="text-primary font-medium">{creatorName}</span></p>
      </div>

      {/* Main Story */}
      <motion.div 
        initial={{ opacity: 0.3 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
        className="bg-secondary/50 backdrop-blur-sm border border-primary/10 rounded-lg p-6"
      >
        <h3 className="text-sm font-mono uppercase tracking-wider text-primary/60 mb-3">The Story</h3>
        <p className="text-base leading-relaxed whitespace-pre-wrap text-foreground">{story}</p>
      </motion.div>

      {/* Time Capsule Note */}
      {aiTimeCapsuleNote && (
        <motion.div 
          initial={{ opacity: 0.3 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.1 }}
          className="bg-gradient-to-r from-primary/10 via-accent/10 to-primary/10 border border-primary/20 rounded-lg p-6"
        >
          <h3 className="text-sm font-mono uppercase tracking-wider text-primary/60 mb-3">Time Capsule Note</h3>
          <p className="text-base italic text-primary/80 leading-relaxed">{aiTimeCapsuleNote}</p>
        </motion.div>
      )}

      {/* Temporal Analysis */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {aiCurrentRelevance && (
          <motion.div 
            initial={{ opacity: 0.3 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.2 }}
            className="bg-secondary/30 border border-primary/10 rounded-lg p-4"
          >
            <h4 className="text-sm font-mono uppercase tracking-wider text-primary/60 mb-2">Today's Relevance</h4>
            <p className="text-sm text-foreground/80 leading-relaxed">{aiCurrentRelevance}</p>
          </motion.div>
        )}

        {aiFutureImportance && (
          <motion.div 
            initial={{ opacity: 0.3 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.3 }}
            className="bg-secondary/30 border border-primary/10 rounded-lg p-4"
          >
            <h4 className="text-sm font-mono uppercase tracking-wider text-primary/60 mb-2">Future Importance</h4>
            <p className="text-sm text-foreground/80 leading-relaxed">{aiFutureImportance}</p>
          </motion.div>
        )}
      </div>

      {/* Action Buttons */}
      <div className="flex gap-3 pt-4">
        <Button 
          onClick={onShare}
          variant="outline"
          className="flex-1"
        >
          <Share2 className="w-4 h-4 mr-2" />
          Share Story
        </Button>
        <Button 
          variant="ghost"
          size="icon"
          className="hover:bg-primary/10"
        >
          <Heart className="w-5 h-5" />
        </Button>
        <Button 
          variant="ghost"
          size="icon"
          className="hover:bg-primary/10"
        >
          <Download className="w-5 h-5" />
        </Button>
      </div>
    </div>
  )
}
