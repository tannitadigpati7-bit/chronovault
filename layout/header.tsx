'use client'

import Link from 'next/link'
import { Home, Menu, X, User, LogOut, LayoutDashboard } from 'lucide-react'
import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { createClient } from '@/lib/supabase/client'
import type { User as SupabaseUser } from '@supabase/supabase-js'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { FuturisticButton } from '@/components/ui/futuristic-button'
import { AppLogo } from '@/components/brand/app-logo'

const navLinks = [
  { href: '/', label: 'Home', icon: Home },
  { href: '/explore', label: 'Archive' },
  { href: '/curator', label: 'Ghost' },
  { href: '/contribute', label: 'Contribute' },
]

export function Header() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [user, setUser] = useState<SupabaseUser | null>(null)
  const supabase = createClient()

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      setUser(user)
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
    })

    return () => subscription.unsubscribe()
  }, [supabase.auth])

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    setUser(null)
    window.location.href = '/'
  }

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled 
          ? 'bg-[#0A0A0A]/90 backdrop-blur-lg border-b border-[#333333]/50 py-3' 
          : 'bg-transparent py-5'
      }`}
    >
      <div className="container mx-auto px-4">
        <nav className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="group">
            <AppLogo size="sm" />
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="px-4 py-2 text-sm text-[#888888] hover:text-[#F5E8D8] transition-colors rounded-lg hover:bg-[#1A1A1A] flex items-center gap-2"
              >
                {link.icon && <link.icon className="h-4 w-4" />}
                {link.label === 'Ghost' && (
                  <span className="w-2 h-2 rounded-full bg-[#FF8C00] animate-pulse" />
                )}
                {link.label}
              </Link>
            ))}
          </div>

          {/* Auth Buttons */}
          <div className="hidden md:flex items-center gap-3">
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <motion.button 
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="flex items-center gap-2 px-4 py-2 rounded-lg glass-hover text-sm text-[#F5E8D8]"
                  >
                    <User className="h-4 w-4 text-[#FF8C00]" />
                    <span className="max-w-24 truncate">
                      {user.email?.split('@')[0]}
                    </span>
                  </motion.button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48 bg-[#121212] border-[#333333]">
                  <DropdownMenuItem asChild className="text-[#F5E8D8] focus:bg-[#1A1A1A] focus:text-[#FF8C00]">
                    <Link href="/" className="flex items-center gap-2">
                      <Home className="h-4 w-4" />
                      Home
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild className="text-[#F5E8D8] focus:bg-[#1A1A1A] focus:text-[#FF8C00]">
                    <Link href="/dashboard" className="flex items-center gap-2">
                      <LayoutDashboard className="h-4 w-4" />
                      Dashboard
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator className="bg-[#333333]" />
                  <DropdownMenuItem 
                    onClick={handleSignOut} 
                    className="text-red-400 focus:bg-[#1A1A1A] focus:text-red-300 flex items-center gap-2 cursor-pointer"
                  >
                    <LogOut className="h-4 w-4" />
                    Sign Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <>
                <Link href="/auth/login">
                  <FuturisticButton variant="ghost" size="sm">
                    Login
                  </FuturisticButton>
                </Link>
                <Link href="/auth/sign-up">
                  <FuturisticButton variant="amber" size="sm">
                    Get Started
                  </FuturisticButton>
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <motion.button
            whileTap={{ scale: 0.9 }}
            className="md:hidden p-2 -mr-2 text-[#F5E8D8]"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </motion.button>
        </nav>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
              className="md:hidden overflow-hidden"
            >
              <div className="py-4 space-y-2">
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="flex items-center gap-2 px-4 py-3 text-[#888888] hover:text-[#F5E8D8] hover:bg-[#1A1A1A] rounded-lg transition-colors"
                  >
                    {link.icon && <link.icon className="h-4 w-4" />}
                    {link.label}
                  </Link>
                ))}
                <div className="pt-4 space-y-2">
                  {user ? (
                    <>
                      <Link
                        href="/dashboard"
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="flex items-center gap-2 px-4 py-3 text-[#888888] hover:text-[#F5E8D8] hover:bg-[#1A1A1A] rounded-lg transition-colors"
                      >
                        <LayoutDashboard className="h-4 w-4" />
                        Dashboard
                      </Link>
                      <button
                        onClick={() => {
                          handleSignOut()
                          setIsMobileMenuOpen(false)
                        }}
                        className="flex items-center gap-2 w-full text-left px-4 py-3 text-red-400 hover:bg-[#1A1A1A] rounded-lg transition-colors"
                      >
                        <LogOut className="h-4 w-4" />
                        Sign Out
                      </button>
                    </>
                  ) : (
                    <div className="flex gap-2 px-4">
                      <Link href="/auth/login" onClick={() => setIsMobileMenuOpen(false)} className="flex-1">
                        <FuturisticButton variant="ghost" size="md" className="w-full">
                          Login
                        </FuturisticButton>
                      </Link>
                      <Link href="/auth/sign-up" onClick={() => setIsMobileMenuOpen(false)} className="flex-1">
                        <FuturisticButton variant="amber" size="md" className="w-full">
                          Get Started
                        </FuturisticButton>
                      </Link>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </header>
  )
}
