'use client'

import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

// Heritage fun facts - one-liners about tangible and intangible heritage
const heritageFacts = [
  "The oldest known musical instrument is a 40,000-year-old flute made from a vulture bone.",
  "Japanese 'Kintsugi' repairs broken pottery with gold, celebrating imperfection as beauty.",
  "The recipe for Chartreuse liqueur is known by only two monks at any time.",
  "Every letter of the Tibetan alphabet was designed to be drawn with a single brushstroke.",
  "The Maori 'Haka' was originally a war dance, now a symbol of cultural identity.",
  "Persian carpet weavers intentionally include one flaw — perfection belongs only to Allah.",
  "The art of Venetian glassblowing was once a state secret punishable by death.",
  "Aboriginal Australians have the oldest continuous culture on Earth — over 65,000 years.",
  "The Cherokee language was saved from extinction by a single man's 12-year effort.",
  "Traditional Japanese swordsmiths fold steel over 1,000 times in a single blade.",
  "The whistle language of La Gomera can be heard across valleys 5km apart.",
  "Ethiopian coffee ceremonies can last 2-3 hours and involve roasting beans from scratch.",
  "Inuit communities have over 50 words for different types of snow.",
  "The Sistine Chapel choir still performs music composed 500 years ago.",
  "Balinese shadow puppets tell stories that have been passed down for 1,000 years.",
  "The knowledge to read Egyptian hieroglyphics was lost for 1,500 years.",
  "Traditional Hawaiian navigation uses only stars, waves, and bird flight patterns.",
  "The oldest continuously operating library is in Morocco, founded in 859 CE.",
  "Swiss watchmaking secrets were once protected by imprisonment.",
  "The art of creating Damascus steel was lost for centuries.",
  "Mongolian throat singing produces multiple notes simultaneously from one voice.",
  "Greek fire was a Byzantine weapon whose formula died with its inventors.",
  "Traditional Thai massage has been practiced for over 2,500 years.",
  "The oral traditions of Griots in West Africa preserve histories spanning centuries.",
  "Japanese tea ceremony masters train for decades to perfect a single ritual.",
  "The Nazca Lines remained unknown to the outside world until 1927.",
  "Traditional Korean Hanbok designs encode social status through colors and patterns.",
  "The recipe for Roman concrete that lasted 2,000 years was recently rediscovered.",
  "Navajo code talkers used an unbreakable language system in WWII.",
  "The oldest known cave paintings are 45,500 years old."
]

interface GhostCharacterProps {
  onInteract?: () => void
  showInteraction?: boolean
}

export function GhostCharacter({ onInteract, showInteraction = true }: GhostCharacterProps) {
  const [currentFact, setCurrentFact] = useState('')
  const [isThinking, setIsThinking] = useState(false)
  const [showBubble, setShowBubble] = useState(false)
  const [isHovered, setIsHovered] = useState(false)
  const [position, setPosition] = useState(0)
  const [windowWidth, setWindowWidth] = useState(800) // Default for SSR
  const [isMounted, setIsMounted] = useState(false)

  // Cycle through facts
  useEffect(() => {
    const showNewFact = () => {
      const randomFact = heritageFacts[Math.floor(Math.random() * heritageFacts.length)]
      setIsThinking(true)
      setCurrentFact(randomFact)
      setShowBubble(true)

      // Hide after display time
      setTimeout(() => {
        setShowBubble(false)
        setIsThinking(false)
      }, 8000)
    }

    // Initial delay
    const initialTimeout = setTimeout(showNewFact, 3000)

    // Then cycle every 15 seconds
    const interval = setInterval(showNewFact, 15000)

    return () => {
      clearTimeout(initialTimeout)
      clearInterval(interval)
    }
  }, [])

  // Set mounted state and window width
  useEffect(() => {
    setIsMounted(true)
    setWindowWidth(window.innerWidth)
    
    const handleResize = () => setWindowWidth(window.innerWidth)
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  // Walking animation position
  useEffect(() => {
    if (!isMounted) return

    let animationFrame: number
    let startTime: number

    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp
      const elapsed = timestamp - startTime
      
      // Complete one cycle every 30 seconds
      const progress = (elapsed % 30000) / 30000
      
      // Calculate position (-100px to window width + 100px)
      const newPosition = progress < 0.5 
        ? -100 + (progress * 2 * (windowWidth + 200))
        : windowWidth + 100 - ((progress - 0.5) * 2 * (windowWidth + 200))
      
      setPosition(newPosition)
      animationFrame = requestAnimationFrame(animate)
    }

    animationFrame = requestAnimationFrame(animate)

    return () => cancelAnimationFrame(animationFrame)
  }, [isMounted, windowWidth])

  const handleClick = useCallback(() => {
    if (onInteract) {
      onInteract()
    }
  }, [onInteract])

  // Determine if walking left or right based on position change
  const isWalkingRight = position < windowWidth / 2

  // Don't render until mounted to avoid hydration mismatch
  if (!isMounted) {
    return null
  }

  return (
    <div className="fixed bottom-24 left-0 right-0 z-40 pointer-events-none overflow-hidden">
      <motion.div
        className="absolute pointer-events-auto cursor-pointer"
        style={{ 
          x: position,
          scaleX: isWalkingRight ? 1 : -1 
        }}
        onHoverStart={() => setIsHovered(true)}
        onHoverEnd={() => setIsHovered(false)}
        onClick={handleClick}
      >
        {/* Thought Bubble */}
        <AnimatePresence>
          {showBubble && currentFact && (
            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.8 }}
              animate={{ opacity: 0.9, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.8 }}
              transition={{ duration: 0.5 }}
              className="absolute -top-32 left-1/2 -translate-x-1/2 w-72"
              style={{ scaleX: isWalkingRight ? 1 : -1 }}
            >
              <div className="glass-amber p-4 rounded-lg relative">
                <p className="text-xs text-[#F5E8D8]/80 leading-relaxed font-mono">
                  {currentFact}
                </p>
                {/* Speech bubble tail */}
                <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-4 h-4 rotate-45 glass-amber" />
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Ghost Character - Cartoonish SVG */}
        <motion.div
          animate={{
            y: isHovered ? -5 : [0, -6, 0],
          }}
          transition={{
            y: isHovered 
              ? { duration: 0.2 }
              : { duration: 0.6, repeat: Infinity, ease: "easeInOut" }
          }}
          className="relative"
        >
          <svg
            width="80"
            height="100"
            viewBox="0 0 80 100"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="drop-shadow-[0_0_15px_rgba(255,140,0,0.3)]"
          >
            {/* Ghost Body */}
            <motion.path
              d="M10 55C10 30 25 10 40 10C55 10 70 30 70 55V85C70 85 65 80 60 85C55 90 50 80 45 85C40 90 35 80 30 85C25 90 20 80 15 85C10 90 10 85 10 85V55Z"
              fill="url(#ghostGradient)"
              stroke="#FF8C00"
              strokeWidth="1.5"
              animate={{
                d: isHovered
                  ? "M10 55C10 30 25 10 40 10C55 10 70 30 70 55V85C70 85 65 82 60 85C55 88 50 82 45 85C40 88 35 82 30 85C25 88 20 82 15 85C10 88 10 85 10 85V55Z"
                  : [
                    "M10 55C10 30 25 10 40 10C55 10 70 30 70 55V85C70 85 65 80 60 85C55 90 50 80 45 85C40 90 35 80 30 85C25 90 20 80 15 85C10 90 10 85 10 85V55Z",
                    "M10 55C10 30 25 10 40 10C55 10 70 30 70 55V85C70 85 65 82 60 87C55 92 50 82 45 87C40 92 35 82 30 87C25 92 20 82 15 87C10 92 10 85 10 85V55Z",
                    "M10 55C10 30 25 10 40 10C55 10 70 30 70 55V85C70 85 65 80 60 85C55 90 50 80 45 85C40 90 35 80 30 85C25 90 20 80 15 85C10 90 10 85 10 85V55Z"
                  ]
              }}
              transition={{
                duration: 1,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />
            
            {/* Explorer Hat */}
            <ellipse cx="40" cy="12" rx="22" ry="6" fill="#8B4513" stroke="#5D3A1A" strokeWidth="1" />
            <path d="M25 12C25 12 30 2 40 2C50 2 55 12 55 12" fill="#8B4513" stroke="#5D3A1A" strokeWidth="1" />
            
            {/* Eyes */}
            <motion.ellipse
              cx="30"
              cy="40"
              rx="6"
              ry="7"
              fill="#0A0A0A"
              animate={{
                scaleY: isHovered ? 0.3 : [1, 0.3, 1],
              }}
              transition={{
                duration: 0.2,
                repeat: isHovered ? 0 : Infinity,
                repeatDelay: 3
              }}
            />
            <motion.ellipse
              cx="50"
              cy="40"
              rx="6"
              ry="7"
              fill="#0A0A0A"
              animate={{
                scaleY: isHovered ? 0.3 : [1, 0.3, 1],
              }}
              transition={{
                duration: 0.2,
                repeat: isHovered ? 0 : Infinity,
                repeatDelay: 3
              }}
            />
            
            {/* Eye Highlights */}
            <circle cx="32" cy="38" r="2" fill="#FF8C00" />
            <circle cx="52" cy="38" r="2" fill="#FF8C00" />
            
            {/* Smile */}
            <motion.path
              d="M32 55 Q40 62 48 55"
              stroke="#0A0A0A"
              strokeWidth="2.5"
              strokeLinecap="round"
              fill="none"
              animate={{
                d: isHovered 
                  ? "M30 55 Q40 68 50 55" 
                  : "M32 55 Q40 62 48 55"
              }}
            />
            
            {/* Monocle */}
            <circle cx="50" cy="40" r="10" stroke="#CC7000" strokeWidth="1.5" fill="none" />
            <path d="M60 40 L68 48" stroke="#CC7000" strokeWidth="1.5" />
            
            {/* Magnifying Glass (held) */}
            <g transform="translate(58, 55) rotate(-20)">
              <circle cx="12" cy="12" r="10" stroke="#FF8C00" strokeWidth="2" fill="rgba(255,140,0,0.1)" />
              <line x1="20" y1="20" x2="28" y2="28" stroke="#8B4513" strokeWidth="3" strokeLinecap="round" />
            </g>
            
            {/* Glow effect */}
            <defs>
              <radialGradient id="ghostGradient" cx="50%" cy="30%" r="70%">
                <stop offset="0%" stopColor="#F5E8D8" />
                <stop offset="70%" stopColor="#E5D8C8" />
                <stop offset="100%" stopColor="#D5C8B8" />
              </radialGradient>
            </defs>
          </svg>

          {/* Name Tag */}
          <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 whitespace-nowrap">
            <span className="text-[10px] font-mono text-[#FF8C00] uppercase tracking-widest">
              Ghost
            </span>
          </div>

          {/* Interaction hint */}
          {showInteraction && isHovered && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className="absolute -top-8 left-1/2 -translate-x-1/2 whitespace-nowrap"
              style={{ scaleX: isWalkingRight ? 1 : -1 }}
            >
              <span className="text-[10px] font-mono text-[#FF8C00]/60 bg-[#0A0A0A]/80 px-2 py-1 rounded">
                Click to chat
              </span>
            </motion.div>
          )}
        </motion.div>
      </motion.div>
    </div>
  )
}
