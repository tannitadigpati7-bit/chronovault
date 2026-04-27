'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { AppLogo } from '@/components/brand/app-logo'

const introLines = [
  "Initializing Chrono-Vault...",
  "Connecting to heritage archives...",
  "Loading cultural memories...",
  "Ghost agent awakening...",
  "Welcome, Archivist."
]

interface IntroSplashProps {
  onComplete?: () => void
  skipKey?: string
}

export function IntroSplash({ onComplete, skipKey = 'chrono-vault-intro-seen' }: IntroSplashProps) {
  const [isVisible, setIsVisible] = useState(true)
  const [currentLine, setCurrentLine] = useState(0)
  const [showSkip, setShowSkip] = useState(false)

  useEffect(() => {
    // Check if user has seen intro before
    const hasSeen = localStorage.getItem(skipKey)
    if (hasSeen) {
      setIsVisible(false)
      onComplete?.()
      return
    }

    // Show skip button after 1 second
    const skipTimer = setTimeout(() => setShowSkip(true), 1000)

    // Animate through lines
    const lineTimers = introLines.map((_, index) => {
      return setTimeout(() => {
        setCurrentLine(index)
        if (index === introLines.length - 1) {
          // Last line - wait and then fade out
          setTimeout(() => {
            localStorage.setItem(skipKey, 'true')
            setIsVisible(false)
            onComplete?.()
          }, 1500)
        }
      }, index * 800 + 500)
    })

    return () => {
      clearTimeout(skipTimer)
      lineTimers.forEach(clearTimeout)
    }
  }, [skipKey, onComplete])

  const handleSkip = () => {
    localStorage.setItem(skipKey, 'true')
    setIsVisible(false)
    onComplete?.()
  }

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
          className="fixed inset-0 z-[100] bg-[#0A0A0A] flex flex-col items-center justify-center"
        >
          {/* Breathing background */}
          <motion.div
            className="absolute inset-0 opacity-20"
            animate={{
              background: [
                'radial-gradient(circle at 50% 50%, #FF8C00 0%, transparent 50%)',
                'radial-gradient(circle at 50% 50%, #FF8C00 0%, transparent 60%)',
                'radial-gradient(circle at 50% 50%, #FF8C00 0%, transparent 50%)',
              ]
            }}
            transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
          />

          {/* Logo */}
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
          >
            <AppLogo size="xl" />
          </motion.div>

          {/* Terminal-style intro text */}
          <div className="mt-12 h-32 flex flex-col items-center">
            {introLines.slice(0, currentLine + 1).map((line, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 10 }}
                animate={{ 
                  opacity: index === currentLine ? 1 : 0.4,
                  y: 0 
                }}
                transition={{ duration: 0.3 }}
                className={`font-mono text-sm ${
                  index === currentLine ? 'text-[#FF8C00]' : 'text-[#444444]'
                }`}
              >
                <span className="text-[#666666] mr-2">&gt;</span>
                {line}
                {index === currentLine && (
                  <motion.span
                    animate={{ opacity: [1, 0] }}
                    transition={{ duration: 0.5, repeat: Infinity }}
                    className="ml-1"
                  >
                    _
                  </motion.span>
                )}
              </motion.div>
            ))}
          </div>

          {/* Skip button */}
          <AnimatePresence>
            {showSkip && (
              <motion.button
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={handleSkip}
                className="absolute bottom-8 text-[#666666] hover:text-[#888888] text-sm font-mono transition-colors"
              >
                Press any key or click to skip
              </motion.button>
            )}
          </AnimatePresence>

          {/* Click anywhere to skip */}
          <div 
            className="absolute inset-0 cursor-pointer" 
            onClick={handleSkip}
            onKeyDown={handleSkip}
            tabIndex={0}
            role="button"
            aria-label="Skip intro"
          />
        </motion.div>
      )}
    </AnimatePresence>
  )
}
