'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronLeft, ChevronRight, Play, Volume2, X, Maximize2 } from 'lucide-react'
import { RelicMedia as RelicMediaType } from '@/lib/types'
import { Button } from '@/components/ui/button'

interface RelicMediaProps {
  primaryImage: string | null
  media: RelicMediaType[]
  title: string
}

export function RelicMedia({ primaryImage, media, title }: RelicMediaProps) {
  const [activeIndex, setActiveIndex] = useState(0)
  const [isFullscreen, setIsFullscreen] = useState(false)
  
  // Combine primary image with additional media
  const allMedia = [
    ...(primaryImage ? [{ type: 'image' as const, url: primaryImage, caption: title }] : []),
    ...media.map(m => ({ type: m.media_type, url: m.blob_url, caption: m.caption || '' }))
  ]
  
  if (allMedia.length === 0) {
    return (
      <div className="aspect-video rounded-xl bg-gradient-to-br from-muted to-muted/50 flex items-center justify-center border border-border/50">
        <span className="text-6xl opacity-20">🏛️</span>
      </div>
    )
  }
  
  const activeMedia = allMedia[activeIndex]
  
  const goNext = () => setActiveIndex((prev) => (prev + 1) % allMedia.length)
  const goPrev = () => setActiveIndex((prev) => (prev - 1 + allMedia.length) % allMedia.length)
  
  return (
    <>
      <div className="relative group">
        {/* Main Display */}
        <div className="relative aspect-video rounded-xl overflow-hidden bg-muted border border-border/50">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeIndex}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="absolute inset-0"
            >
              {activeMedia.type === 'image' ? (
                <img
                  src={activeMedia.url}
                  alt={activeMedia.caption}
                  className="w-full h-full object-contain bg-black/50"
                />
              ) : activeMedia.type === 'video' ? (
                <video
                  src={activeMedia.url}
                  controls
                  className="w-full h-full object-contain bg-black"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary/10 to-accent/10">
                  <div className="text-center">
                    <Volume2 className="w-16 h-16 mx-auto mb-4 text-primary" />
                    <audio src={activeMedia.url} controls className="w-64" />
                  </div>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
          
          {/* Navigation Arrows */}
          {allMedia.length > 1 && (
            <>
              <Button
                variant="ghost"
                size="icon"
                onClick={goPrev}
                className="absolute left-2 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-background/80 backdrop-blur-sm"
              >
                <ChevronLeft className="w-5 h-5" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={goNext}
                className="absolute right-2 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-background/80 backdrop-blur-sm"
              >
                <ChevronRight className="w-5 h-5" />
              </Button>
            </>
          )}
          
          {/* Fullscreen Button */}
          {activeMedia.type === 'image' && (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsFullscreen(true)}
              className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity bg-background/80 backdrop-blur-sm"
            >
              <Maximize2 className="w-4 h-4" />
            </Button>
          )}
          
          {/* Caption */}
          {activeMedia.caption && (
            <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent">
              <p className="text-white text-sm">{activeMedia.caption}</p>
            </div>
          )}
        </div>
        
        {/* Thumbnails */}
        {allMedia.length > 1 && (
          <div className="mt-4 flex gap-2 overflow-x-auto pb-2">
            {allMedia.map((m, index) => (
              <button
                key={index}
                onClick={() => setActiveIndex(index)}
                className={`relative flex-shrink-0 w-20 h-16 rounded-lg overflow-hidden border-2 transition-all ${
                  index === activeIndex 
                    ? 'border-primary ring-2 ring-primary/20' 
                    : 'border-border/50 hover:border-border'
                }`}
              >
                {m.type === 'image' ? (
                  <img src={m.url} alt="" className="w-full h-full object-cover" />
                ) : m.type === 'video' ? (
                  <div className="w-full h-full bg-muted flex items-center justify-center">
                    <Play className="w-5 h-5 text-muted-foreground" />
                  </div>
                ) : (
                  <div className="w-full h-full bg-muted flex items-center justify-center">
                    <Volume2 className="w-5 h-5 text-muted-foreground" />
                  </div>
                )}
              </button>
            ))}
          </div>
        )}
      </div>
      
      {/* Fullscreen Modal */}
      <AnimatePresence>
        {isFullscreen && activeMedia.type === 'image' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center"
            onClick={() => setIsFullscreen(false)}
          >
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsFullscreen(false)}
              className="absolute top-4 right-4 text-white hover:bg-white/10"
            >
              <X className="w-6 h-6" />
            </Button>
            <img
              src={activeMedia.url}
              alt={activeMedia.caption}
              className="max-w-full max-h-full object-contain"
            />
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
