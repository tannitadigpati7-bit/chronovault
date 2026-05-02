'use client'

import { motion } from 'framer-motion'

interface AppLogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl'
  showText?: boolean
  animated?: boolean
}

export function AppLogo({ size = 'md', showText = true, animated = true }: AppLogoProps) {
  const sizes = {
    sm: { icon: 32, text: 'text-lg', gap: 'gap-2' },
    md: { icon: 40, text: 'text-xl', gap: 'gap-3' },
    lg: { icon: 56, text: 'text-3xl', gap: 'gap-4' },
    xl: { icon: 80, text: 'text-5xl', gap: 'gap-5' },
  }

  const { icon, text, gap } = sizes[size]

  const LogoIcon = () => (
    <svg
      width={icon}
      height={icon}
      viewBox="0 0 80 80"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="flex-shrink-0"
    >
      {/* Outer ring - representing time/eternity */}
      <motion.circle
        cx="40"
        cy="40"
        r="36"
        stroke="#FF8C00"
        strokeWidth="2"
        fill="none"
        strokeDasharray="4 4"
        initial={animated ? { rotate: 0 } : undefined}
        animate={animated ? { rotate: 360 } : undefined}
        transition={animated ? { duration: 60, repeat: Infinity, ease: 'linear' } : undefined}
        style={{ transformOrigin: 'center' }}
      />
      
      {/* Inner glow circle */}
      <circle
        cx="40"
        cy="40"
        r="28"
        fill="url(#ghostGlow)"
        opacity="0.3"
      />
      
      {/* Ghost/Spirit figure - stylized */}
      <motion.path
        d="M40 18C30 18 22 28 22 40C22 52 22 58 22 62C22 62 26 58 30 58C34 58 36 62 40 62C44 62 46 58 50 58C54 58 58 62 58 62C58 58 58 52 58 40C58 28 50 18 40 18Z"
        fill="#F5E8D8"
        initial={animated ? { y: 0 } : undefined}
        animate={animated ? { y: [0, -2, 0] } : undefined}
        transition={animated ? { duration: 3, repeat: Infinity, ease: 'easeInOut' } : undefined}
      />
      
      {/* Ghost eyes */}
      <circle cx="32" cy="36" r="4" fill="#0A0A0A" />
      <circle cx="48" cy="36" r="4" fill="#0A0A0A" />
      
      {/* Eye shine */}
      <circle cx="33" cy="35" r="1.5" fill="#FF8C00" />
      <circle cx="49" cy="35" r="1.5" fill="#FF8C00" />
      
      {/* Archive/scroll element at bottom */}
      <rect x="30" y="48" width="20" height="6" rx="2" fill="#FF8C00" />
      <line x1="33" y1="51" x2="47" y2="51" stroke="#0A0A0A" strokeWidth="1" />
      
      {/* Gradient definitions */}
      <defs>
        <radialGradient id="ghostGlow" cx="0.5" cy="0.5" r="0.5">
          <stop offset="0%" stopColor="#FF8C00" />
          <stop offset="100%" stopColor="#FF8C00" stopOpacity="0" />
        </radialGradient>
      </defs>
    </svg>
  )

  return (
    <motion.div 
      className={`flex items-center ${gap}`}
      whileHover={animated ? { scale: 1.02 } : undefined}
    >
      <LogoIcon />
      {showText && (
        <div className="flex flex-col">
          <span className={`${text} font-bold text-[#F5E8D8] leading-tight font-serif`}>
            <span className="text-[#FF8C00]">Chrono</span>Vault
          </span>
          <span className="text-[10px] uppercase tracking-[0.3em] text-[#666666] font-mono">
            Heritage Archive
          </span>
        </div>
      )}
    </motion.div>
  )
}
