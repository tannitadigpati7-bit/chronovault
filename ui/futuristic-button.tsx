'use client'

import { ButtonHTMLAttributes, forwardRef } from 'react'
import { motion, HTMLMotionProps } from 'framer-motion'
import { cn } from '@/lib/utils'

interface FuturisticButtonProps extends Omit<HTMLMotionProps<"button">, "children"> {
  children: React.ReactNode
  variant?: 'primary' | 'secondary' | 'ghost' | 'amber'
  size?: 'sm' | 'md' | 'lg'
  glow?: boolean
}

export const FuturisticButton = forwardRef<HTMLButtonElement, FuturisticButtonProps>(
  ({ children, variant = 'primary', size = 'md', glow = true, className, ...props }, ref) => {
    const baseStyles = "relative overflow-hidden font-medium tracking-wide transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
    
    const variants = {
      primary: "bg-[#FF8C00] text-[#0A0A0A] hover:bg-[#FFa030]",
      secondary: "bg-[#333333] text-[#F5E8D8] hover:bg-[#444444] border border-[#444444]",
      ghost: "bg-transparent text-[#F5E8D8] hover:bg-[#1A1A1A] border border-[#333333]",
      amber: "bg-[#FF8C00]/10 text-[#FF8C00] hover:bg-[#FF8C00]/20 border border-[#FF8C00]/30"
    }

    const sizes = {
      sm: "px-3 py-1.5 text-xs rounded",
      md: "px-5 py-2.5 text-sm rounded-lg",
      lg: "px-8 py-3.5 text-base rounded-xl"
    }

    const glowStyles = glow ? {
      primary: "shadow-[0_0_20px_rgba(255,140,0,0.3)] hover:shadow-[0_0_30px_rgba(255,140,0,0.5)]",
      secondary: "",
      ghost: "",
      amber: "shadow-[0_0_15px_rgba(255,140,0,0.15)] hover:shadow-[0_0_25px_rgba(255,140,0,0.25)]"
    } : { primary: "", secondary: "", ghost: "", amber: "" }

    return (
      <motion.button
        ref={ref}
        className={cn(
          baseStyles,
          variants[variant],
          sizes[size],
          glowStyles[variant],
          className
        )}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.95 }}
        transition={{ type: "spring", stiffness: 400, damping: 17 }}
        {...props}
      >
        {/* Inner glow on tap */}
        <motion.span
          className="absolute inset-0 bg-white/20 rounded-inherit"
          initial={{ opacity: 0 }}
          whileTap={{ 
            opacity: [0, 0.3, 0],
            transition: { duration: 0.3 }
          }}
        />
        
        {/* Ripple effect container */}
        <span className="relative z-10 flex items-center justify-center gap-2">
          {children}
        </span>
      </motion.button>
    )
  }
)

FuturisticButton.displayName = 'FuturisticButton'

// Glowing pulse button for CTAs
export function PulseButton({ 
  children, 
  className,
  ...props 
}: FuturisticButtonProps) {
  return (
    <motion.button
      className={cn(
        "relative px-8 py-4 bg-[#FF8C00] text-[#0A0A0A] font-semibold rounded-xl",
        "overflow-hidden",
        className
      )}
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.97 }}
      {...props}
    >
      {/* Animated glow ring */}
      <motion.span
        className="absolute inset-0 rounded-xl"
        animate={{
          boxShadow: [
            "0 0 20px 0px rgba(255,140,0,0.3)",
            "0 0 40px 5px rgba(255,140,0,0.5)",
            "0 0 20px 0px rgba(255,140,0,0.3)"
          ]
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
      
      <span className="relative z-10 flex items-center justify-center gap-2">
        {children}
      </span>
    </motion.button>
  )
}

// Icon button with futuristic style
export function IconButton({ 
  children, 
  className,
  variant = 'ghost',
  ...props 
}: Omit<FuturisticButtonProps, 'size'>) {
  const variants = {
    primary: "bg-[#FF8C00] text-[#0A0A0A] hover:bg-[#FFa030]",
    secondary: "bg-[#333333] text-[#F5E8D8] hover:bg-[#444444]",
    ghost: "bg-transparent text-[#888888] hover:text-[#FF8C00] hover:bg-[#1A1A1A]",
    amber: "bg-[#FF8C00]/10 text-[#FF8C00] hover:bg-[#FF8C00]/20"
  }

  return (
    <motion.button
      className={cn(
        "p-2.5 rounded-lg transition-colors",
        variants[variant],
        className
      )}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.9 }}
      {...props}
    >
      {children}
    </motion.button>
  )
}
