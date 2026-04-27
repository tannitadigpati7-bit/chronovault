'use client'

import { ReactNode } from 'react'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'

interface BentoGridProps {
  children: ReactNode
  className?: string
}

export function BentoGrid({ children, className }: BentoGridProps) {
  return (
    <div className={cn(
      "grid gap-4 grid-cols-1 md:grid-cols-4 md:grid-rows-3",
      className
    )}>
      {children}
    </div>
  )
}

interface BentoCardProps {
  children: ReactNode
  className?: string
  variant?: 'main' | 'side' | 'wide' | 'default'
  glassVariant?: 'default' | 'amber'
  animate?: boolean
  delay?: number
}

export function BentoCard({ 
  children, 
  className, 
  variant = 'default',
  glassVariant = 'default',
  animate = true,
  delay = 0
}: BentoCardProps) {
  const variantClasses = {
    main: 'md:col-span-2 md:row-span-2',
    side: 'md:col-span-2',
    wide: 'md:col-span-4',
    default: ''
  }

  const glassClasses = {
    default: 'bg-[#121212]/80 backdrop-blur-md border border-[#333333]/50',
    amber: 'bg-[#FF8C00]/5 backdrop-blur-lg border border-[#FF8C00]/20'
  }

  const content = (
    <div className={cn(
      "rounded-xl p-6 overflow-hidden relative",
      glassClasses[glassVariant],
      "hover:border-[#FF8C00]/40 transition-all duration-300",
      "hover:shadow-[0_0_30px_rgba(255,140,0,0.1)]",
      variantClasses[variant],
      className
    )}>
      {children}
    </div>
  )

  if (!animate) return content

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      className={variantClasses[variant]}
    >
      <div className={cn(
        "rounded-xl p-6 overflow-hidden relative h-full",
        glassClasses[glassVariant],
        "hover:border-[#FF8C00]/40 transition-all duration-300",
        "hover:shadow-[0_0_30px_rgba(255,140,0,0.1)]",
        className
      )}>
        {children}
      </div>
    </motion.div>
  )
}

// Specialized cards
export function MainStageCard({ children, className }: { children: ReactNode, className?: string }) {
  return (
    <BentoCard variant="main" className={cn("min-h-[400px]", className)}>
      {children}
    </BentoCard>
  )
}

export function ProvenanceCard({ 
  title, 
  futureValue, 
  rarity, 
  era,
  className 
}: { 
  title: string
  futureValue?: string
  rarity?: number
  era?: string
  className?: string 
}) {
  return (
    <BentoCard variant="side" glassVariant="amber" className={className}>
      <div className="space-y-4">
        <div>
          <span className="text-[10px] font-mono text-[#FF8C00] uppercase tracking-widest">
            Provenance Report
          </span>
          <h3 className="font-serif text-xl text-[#F5E8D8] mt-1 italic">
            {title}
          </h3>
        </div>

        {era && (
          <div>
            <span className="text-[10px] font-mono text-[#888888] uppercase tracking-wider">
              Estimated Era
            </span>
            <p className="text-sm text-[#F5E8D8]/80 font-serif italic">{era}</p>
          </div>
        )}

        {futureValue && (
          <div>
            <span className="text-[10px] font-mono text-[#FF8C00] uppercase tracking-wider">
              Future Museum Value
            </span>
            <p className="text-sm text-[#F5E8D8]/80">{futureValue}</p>
          </div>
        )}

        {rarity !== undefined && (
          <div>
            <span className="text-[10px] font-mono text-[#888888] uppercase tracking-wider">
              Rarity Index
            </span>
            <div className="flex items-center gap-2 mt-1">
              <div className="flex-1 h-1.5 bg-[#333333] rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${rarity * 10}%` }}
                  transition={{ duration: 1, delay: 0.5 }}
                  className="h-full bg-gradient-to-r from-[#CC7000] to-[#FF8C00]"
                />
              </div>
              <span className="text-xs font-mono text-[#FF8C00]">{rarity}/10</span>
            </div>
          </div>
        )}
      </div>
    </BentoCard>
  )
}

export function AgentLogCard({ 
  children,
  isProcessing = false,
  className 
}: { 
  children: ReactNode
  isProcessing?: boolean
  className?: string 
}) {
  return (
    <BentoCard variant="wide" className={cn("min-h-[120px]", className)}>
      <div className="flex items-center gap-2 mb-3">
        <span className="relative flex h-2 w-2">
          <span className={cn(
            "absolute inline-flex h-full w-full rounded-full opacity-75",
            isProcessing ? "bg-[#FF8C00] animate-ping" : "bg-[#444444]"
          )} />
          <span className={cn(
            "relative inline-flex rounded-full h-2 w-2",
            isProcessing ? "bg-[#FF8C00]" : "bg-[#444444]"
          )} />
        </span>
        <span className="text-[10px] font-mono text-[#888888] uppercase tracking-widest">
          Ghost Agent Logs
        </span>
      </div>
      <div className="font-mono text-xs">
        {children}
      </div>
    </BentoCard>
  )
}
