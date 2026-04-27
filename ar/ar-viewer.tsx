'use client'

import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useRouter } from 'next/navigation'
import { X, Info, Volume2, VolumeX, Maximize2, Camera, Share2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Relic, CATEGORY_LABELS } from '@/lib/types'

interface ARViewerProps {
  relic: Relic
}

export function ARViewer({ relic }: ARViewerProps) {
  const router = useRouter()
  const [showInfo, setShowInfo] = useState(true)
  const [isMuted, setIsMuted] = useState(true)
  const [hasPermission, setHasPermission] = useState<boolean | null>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const streamRef = useRef<MediaStream | null>(null)
  
  useEffect(() => {
    startCamera()
    return () => stopCamera()
  }, [])
  
  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment' }
      })
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream
        streamRef.current = stream
        setHasPermission(true)
      }
    } catch (err) {
      console.error('Camera error:', err)
      setHasPermission(false)
    }
  }
  
  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop())
      streamRef.current = null
    }
  }
  
  const handleShare = async () => {
    if (navigator.share) {
      await navigator.share({
        title: relic.title,
        text: relic.ai_time_capsule_note || relic.description || '',
        url: window.location.href
      })
    }
  }
  
  return (
    <div className="fixed inset-0 bg-black">
      {/* Camera Feed */}
      {hasPermission ? (
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          className="w-full h-full object-cover"
        />
      ) : (
        <div className="w-full h-full flex items-center justify-center text-white">
          <p>Camera access required for AR experience</p>
        </div>
      )}
      
      {/* AR Overlay - Relic Image */}
      <motion.div
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.5, duration: 0.8, type: 'spring' }}
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 md:w-80"
      >
        {relic.primary_image_url ? (
          <div className="relative">
            {/* Glowing border effect */}
            <div className="absolute -inset-4 bg-gradient-to-r from-primary via-accent to-primary rounded-2xl opacity-50 blur-xl animate-pulse" />
            
            {/* Image frame */}
            <div className="relative rounded-xl overflow-hidden border-4 border-white/30 shadow-2xl">
              <img
                src={relic.primary_image_url}
                alt={relic.title}
                className="w-full aspect-square object-cover"
              />
              
              {/* Shimmer effect */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
                animate={{ x: ['-100%', '100%'] }}
                transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
              />
            </div>
            
            {/* Title label */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1 }}
              className="absolute -bottom-16 left-0 right-0 text-center"
            >
              <h2 className="text-white text-xl font-bold drop-shadow-lg">
                {relic.title}
              </h2>
              <p className="text-white/70 text-sm">
                {CATEGORY_LABELS[relic.category]}
              </p>
            </motion.div>
          </div>
        ) : (
          <div className="w-64 h-64 rounded-xl bg-gradient-to-br from-primary/30 to-accent/30 flex items-center justify-center border-4 border-white/30">
            <span className="text-6xl">🏛️</span>
          </div>
        )}
      </motion.div>
      
      {/* Top Controls */}
      <div className="absolute top-0 left-0 right-0 p-4 flex items-center justify-between bg-gradient-to-b from-black/50 to-transparent">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => router.back()}
          className="text-white hover:bg-white/20"
        >
          <X className="w-6 h-6" />
        </Button>
        
        <div className="flex gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsMuted(!isMuted)}
            className="text-white hover:bg-white/20"
          >
            {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={handleShare}
            className="text-white hover:bg-white/20"
          >
            <Share2 className="w-5 h-5" />
          </Button>
        </div>
      </div>
      
      {/* Bottom Info Panel */}
      <AnimatePresence>
        {showInfo && (
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 25 }}
            className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black via-black/90 to-transparent p-6 pb-10"
          >
            {/* Time Capsule Note */}
            {relic.ai_time_capsule_note && (
              <motion.blockquote
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="text-white/90 italic text-center mb-4 text-lg"
              >
                &ldquo;{relic.ai_time_capsule_note}&rdquo;
              </motion.blockquote>
            )}
            
            {/* Future Importance */}
            {relic.ai_future_importance && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="text-white/70 text-sm text-center mb-4"
              >
                {relic.ai_future_importance}
              </motion.p>
            )}
            
            {/* Actions */}
            <div className="flex justify-center gap-4">
              <Button
                onClick={() => setShowInfo(false)}
                variant="outline"
                className="border-white/30 text-white hover:bg-white/20"
              >
                Hide Info
              </Button>
              <Button
                onClick={() => router.push(`/relic/${relic.id}`)}
                className="bg-white text-black hover:bg-white/90"
              >
                View Full Details
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Show Info Button (when hidden) */}
      {!showInfo && (
        <Button
          onClick={() => setShowInfo(true)}
          className="absolute bottom-6 left-1/2 -translate-x-1/2"
        >
          <Info className="w-4 h-4 mr-2" />
          Show Info
        </Button>
      )}
      
      {/* AR Instructions */}
      <motion.div
        initial={{ opacity: 1 }}
        animate={{ opacity: 0 }}
        transition={{ delay: 4, duration: 1 }}
        className="absolute top-1/4 left-0 right-0 text-center text-white/80 text-sm"
      >
        Point your camera at a surface to place the relic
      </motion.div>
    </div>
  )
}
