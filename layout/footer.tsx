'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { QrCode, Github, Twitter, Globe, Heart } from 'lucide-react'
import { AppLogo } from '@/components/brand/app-logo'
import { useEffect, useState } from 'react'

export function Footer() {
  const [qrCodeUrl, setQrCodeUrl] = useState<string | null>(null)
  const [currentUrl, setCurrentUrl] = useState('')

  useEffect(() => {
    if (typeof window !== 'undefined') {
      // Get the full URL including protocol
      const fullUrl = window.location.href
      setCurrentUrl(window.location.origin)
      
      // Generate QR code with larger size for better mobile scanning
      const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(fullUrl)}&bgcolor=0A0A0A&color=FF8C00&ecc=H`
      setQrCodeUrl(qrUrl)
    }
  }, [])

  const footerLinks = [
    {
      title: 'Explore',
      links: [
        { label: 'Archive', href: '/explore' },
        { label: 'Ghost Agent', href: '/curator' },
        { label: 'Contribute', href: '/contribute' },
        { label: 'Dashboard', href: '/dashboard' },
      ]
    },
    {
      title: 'Heritage Types',
      links: [
        { label: 'Artifacts', href: '/explore?category=artifact' },
        { label: 'Traditions', href: '/explore?category=practice' },
        { label: 'Stories', href: '/explore?category=story' },
        { label: 'Languages', href: '/explore?category=language' },
      ]
    },
    {
      title: 'Community',
      links: [
        { label: 'About Us', href: '/about' },
        { label: 'How It Works', href: '/how-it-works' },
        { label: 'Guidelines', href: '/guidelines' },
        { label: 'Contact', href: '/contact' },
      ]
    },
  ]

  return (
    <footer className="relative bg-[#080808] border-t border-[#222222]">
      {/* Subtle gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A] to-transparent opacity-50" />
      
      <div className="relative container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12">
          {/* Brand Section */}
          <div className="lg:col-span-2">
            <AppLogo size="md" />
            <p className="mt-4 text-sm text-[#888888] max-w-sm leading-relaxed">
              Preserving humanity&apos;s cultural heritage for tomorrow&apos;s digital museums. 
              Every tradition, artifact, and story matters.
            </p>
            
            {/* Social Links */}
            <div className="flex gap-3 mt-6">
              {[
                { icon: Twitter, href: '#', label: 'Twitter' },
                { icon: Github, href: '#', label: 'GitHub' },
                { icon: Globe, href: '#', label: 'Website' },
              ].map((social) => (
                <motion.a
                  key={social.label}
                  href={social.href}
                  whileHover={{ scale: 1.1, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  className="w-10 h-10 rounded-lg bg-[#1A1A1A] border border-[#333333] flex items-center justify-center text-[#888888] hover:text-[#FF8C00] hover:border-[#FF8C00]/30 transition-all"
                  aria-label={social.label}
                >
                  <social.icon className="w-4 h-4" />
                </motion.a>
              ))}
            </div>
          </div>

          {/* Link Columns */}
          {footerLinks.map((section) => (
            <div key={section.title}>
              <h3 className="text-sm font-semibold text-[#F5E8D8] uppercase tracking-wider mb-4">
                {section.title}
              </h3>
              <ul className="space-y-3">
                {section.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-sm text-[#888888] hover:text-[#FF8C00] transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* QR Code Section */}
        <div className="mt-16 pt-8 border-t border-[#222222]">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="text-center md:text-left">
              <div className="flex items-center gap-2 justify-center md:justify-start mb-2">
                <QrCode className="w-5 h-5 text-[#FF8C00]" />
                <span className="text-sm font-semibold text-[#F5E8D8]">
                  Scan to Open on Mobile
                </span>
              </div>
              <p className="text-xs text-[#888888] max-w-xs">
                Access the Chrono-Vault on your phone to document heritage items on the go.
                Capture artifacts, traditions, and stories anywhere.
              </p>
            </div>

            {/* QR Code */}
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="relative"
            >
              <div className="absolute inset-0 bg-[#FF8C00]/20 rounded-xl blur-xl" />
              <div className="relative p-3 bg-[#121212] border border-[#333333] rounded-xl">
                {qrCodeUrl ? (
                  <img 
                    src={qrCodeUrl} 
                    alt="Scan to open on mobile"
                    width={140}
                    height={140}
                    className="rounded-lg"
                    loading="lazy"
                  />
                ) : (
                  <div className="w-[140px] h-[140px] bg-[#1A1A1A] rounded-lg flex items-center justify-center">
                    <QrCode className="w-12 h-12 text-[#333333] animate-pulse" />
                  </div>
                )}
                <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 px-3 py-1 bg-[#FF8C00] rounded-full">
                  <span className="text-[10px] font-mono text-black font-bold">
                    SCAN
                  </span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-[#222222] flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs text-[#666666] flex items-center gap-1">
            Built with <Heart className="w-3 h-3 text-red-500" /> for heritage preservation
          </p>
          <p className="text-xs text-[#666666] font-mono">
            CHRONO-VAULT.0 &copy; {new Date().getFullYear()}
          </p>
        </div>
      </div>
    </footer>
  )
}
