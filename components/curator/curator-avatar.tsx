'use client'

import { motion } from 'framer-motion'

interface CuratorAvatarProps {
  size?: 'sm' | 'md' | 'lg'
  animate?: boolean
}

export function CuratorAvatar({ size = 'md', animate = false }: CuratorAvatarProps) {
  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-12 h-12',
    lg: 'w-24 h-24'
  }
  
  const iconSizes = {
    sm: 'text-lg',
    md: 'text-2xl',
    lg: 'text-5xl'
  }
  
  return (
    <motion.div
      className={`${sizeClasses[size]} rounded-full bg-gradient-to-br from-primary/20 via-accent/20 to-primary/20 flex items-center justify-center relative overflow-hidden flex-shrink-0`}
      animate={animate ? {
        boxShadow: [
          '0 0 20px rgba(220, 38, 38, 0.2)',
          '0 0 30px rgba(220, 38, 38, 0.4)',
          '0 0 20px rgba(220, 38, 38, 0.2)'
        ]
      } : {}}
      transition={{
        duration: 3,
        repeat: Infinity,
        ease: 'easeInOut'
      }}
    >
      {/* Animated background rings */}
      {animate && (
        <>
          <motion.div
            className="absolute inset-0 border-2 border-primary/30 rounded-full"
            animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0, 0.5] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
          <motion.div
            className="absolute inset-0 border border-accent/20 rounded-full"
            animate={{ scale: [1, 1.4, 1], opacity: [0.3, 0, 0.3] }}
            transition={{ duration: 2.5, repeat: Infinity, delay: 0.5 }}
          />
        </>
      )}
      
      {/* Gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/30 to-accent/30" />
      
      {/* Inner glow */}
      <div className="absolute inset-[2px] rounded-full bg-gradient-to-br from-card via-card/80 to-card" />
      
      {/* Icon */}
      <span className={`relative z-10 ${iconSizes[size]}`}>🏛️</span>
    </motion.div>
  )
}
