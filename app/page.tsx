'use client'

import Link from 'next/link'
import { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  Sparkles, 
  Clock, 
  Globe, 
  Mic, 
  Camera, 
  QrCode,
  ChevronRight,
  Scroll,
  BookOpen,
  Wrench,
  Languages,
  Coffee,
  MapPin,
  Archive
} from 'lucide-react'
import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'
import { GhostCharacter } from '@/components/ghost/ghost-character'
import { IntroSplash } from '@/components/intro/intro-splash'
import { FuturisticButton, PulseButton } from '@/components/ui/futuristic-button'
import { useRouter } from 'next/navigation'

const categories = [
  { icon: Scroll, label: 'Artifacts', description: 'Physical objects with cultural significance' },
  { icon: BookOpen, label: 'Stories', description: 'Oral histories and family narratives' },
  { icon: Wrench, label: 'Professions', description: 'Dying trades and traditional skills' },
  { icon: Globe, label: 'Practices', description: 'Rituals, traditions, and customs' },
  { icon: Languages, label: 'Languages', description: 'Regional dialects and expressions' },
  { icon: Coffee, label: 'Everyday', description: 'Objects shaping daily heritage' },
]

const features = [
  {
    icon: Camera,
    title: 'Capture Everything',
    description: 'Upload photos, record audio stories, capture video of traditional practices.',
  },
  {
    icon: Sparkles,
    title: 'AI-Powered Ghost',
    description: 'Our digital archaeologist asks questions, adds context, and reveals hidden significance.',
  },
  {
    icon: Clock,
    title: 'Future-Ready',
    description: 'Each relic is preserved for tomorrow\'s AR/VR museums and digital heritage centers.',
  },
  {
    icon: QrCode,
    title: 'Share via QR',
    description: 'Generate QR codes to share relics, enable AR viewing, or invite contributions.',
  },
]

const worldRegions = [
  { name: 'Asia', count: '2.4K relics' },
  { name: 'Africa', count: '1.8K relics' },
  { name: 'Europe', count: '3.1K relics' },
  { name: 'Americas', count: '2.7K relics' },
  { name: 'Oceania', count: '890 relics' },
]

export default function HomePage() {
  const router = useRouter()
  const [showContent, setShowContent] = useState(false)

  const handleGhostInteract = () => {
    router.push('/curator')
  }

  return (
    <>
      {/* Intro Splash Screen */}
      <IntroSplash onComplete={() => setShowContent(true)} />

      <div className="relative min-h-screen overflow-hidden bg-[#0A0A0A]">
        {/* Breathing gradient background */}
        <div className="fixed inset-0 breathing-bg pointer-events-none" />
        
        {/* Grid pattern */}
        <div className="fixed inset-0 grid-pattern opacity-30 pointer-events-none" />
        
        {/* Amber glow orbs */}
        <div className="fixed top-1/4 left-1/4 w-[600px] h-[600px] bg-[#FF8C00]/10 rounded-full blur-[120px] animate-glow-pulse pointer-events-none" />
        <div className="fixed bottom-1/4 right-1/4 w-[400px] h-[400px] bg-[#CC7000]/10 rounded-full blur-[100px] animate-glow-pulse pointer-events-none" style={{ animationDelay: '2s' }} />
        
        {/* Scan line effect */}
        <div className="fixed inset-0 overflow-hidden pointer-events-none">
          <div className="absolute w-full h-px bg-gradient-to-r from-transparent via-[#FF8C00]/30 to-transparent animate-scan-line" />
        </div>

        <Header />

        {/* Ghost Character - walks across screen */}
        <GhostCharacter onInteract={handleGhostInteract} />

        <main className="relative z-10">
          {/* Hero Section */}
          <section className="container mx-auto px-4 pt-24 pb-20 md:pt-32 md:pb-28">
            <div className="max-w-4xl mx-auto text-center">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
              >
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-amber mb-8">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#FF8C00] opacity-75" />
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-[#FF8C00]" />
                  </span>
                  <span className="text-xs font-mono text-[#F5E8D8]/70 uppercase tracking-wider">
                    Chrono-Vault Active
                  </span>
                </div>
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight mb-6 text-balance text-[#F5E8D8]"
              >
                Preserve Heritage{' '}
                <span className="gradient-text">Before It Fades</span>
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="text-lg md:text-xl text-[#888888] mb-10 max-w-2xl mx-auto text-pretty"
              >
                Meet <span className="text-[#FF8C00] font-semibold">Ghost</span> — your AI digital archaeologist. 
                Cataloging artifacts, traditions, and stories from cultures worldwide. 
                Building tomorrow&apos;s museums today.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="flex flex-col sm:flex-row items-center justify-center gap-4"
              >
                <Link href="/curator">
                  <PulseButton className="group">
                    <Sparkles className="h-5 w-5" />
                    Talk to Ghost
                    <ChevronRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </PulseButton>
                </Link>
                <Link href="/explore">
                  <FuturisticButton variant="ghost" size="lg">
                    <Archive className="h-5 w-5" />
                    Explore Archive
                  </FuturisticButton>
                </Link>
              </motion.div>
            </div>
          </section>

          {/* World Map Section */}
          <section className="container mx-auto px-4 py-16">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="glass-amber rounded-2xl p-8 md:p-12"
            >
              <div className="flex flex-col md:flex-row items-start justify-between gap-8">
                <div>
                  <span className="text-[10px] font-mono text-[#FF8C00] uppercase tracking-widest">
                    Global Heritage Network
                  </span>
                  <h2 className="text-2xl md:text-3xl font-bold text-[#F5E8D8] mt-2 mb-4">
                    Preserving Culture Worldwide
                  </h2>
                  <p className="text-[#888888] max-w-md">
                    People from every corner of the world contribute their unique heritage. 
                    What makes your culture special deserves to be preserved.
                  </p>
                </div>
                <div className="flex flex-wrap gap-3">
                  {worldRegions.map((region, i) => (
                    <motion.div
                      key={region.name}
                      initial={{ opacity: 0, scale: 0.9 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      viewport={{ once: true }}
                      transition={{ delay: i * 0.1 }}
                      className="glass px-4 py-3 rounded-lg"
                    >
                      <div className="flex items-center gap-2">
                        <MapPin className="h-3 w-3 text-[#FF8C00]" />
                        <span className="text-sm text-[#F5E8D8]">{region.name}</span>
                      </div>
                      <span className="text-xs text-[#888888] font-mono">{region.count}</span>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          </section>

          {/* Categories Section */}
          <section className="container mx-auto px-4 py-20">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-center mb-12"
            >
              <span className="text-[10px] font-mono text-[#FF8C00] uppercase tracking-widest">
                Archive Categories
              </span>
              <h2 className="text-3xl md:text-4xl font-bold text-[#F5E8D8] mt-2 mb-4">What We Preserve</h2>
              <p className="text-[#888888] max-w-2xl mx-auto">
                From ancient artifacts to everyday objects, from dying professions to living languages.
              </p>
            </motion.div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {categories.map((category, index) => (
                <motion.div
                  key={category.label}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                >
                  <Link
                    href={`/explore?category=${category.label.toLowerCase()}`}
                    className="group flex flex-col items-center p-6 rounded-xl glass glass-hover text-center transition-all duration-300"
                  >
                    <motion.div
                      whileHover={{ scale: 1.1, rotate: 5 }}
                      className="h-12 w-12 rounded-lg bg-[#FF8C00]/10 flex items-center justify-center mb-3"
                    >
                      <category.icon className="h-6 w-6 text-[#FF8C00]" />
                    </motion.div>
                    <h3 className="font-semibold text-[#F5E8D8] mb-1">{category.label}</h3>
                    <p className="text-xs text-[#888888] hidden md:block">{category.description}</p>
                  </Link>
                </motion.div>
              ))}
            </div>
          </section>

          {/* Features Section */}
          <section className="container mx-auto px-4 py-20">
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {features.map((feature, index) => (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                  className="p-6 rounded-xl glass group hover:border-[#FF8C00]/40 transition-all duration-300"
                >
                  <motion.div 
                    whileHover={{ scale: 1.05 }}
                    className="h-12 w-12 rounded-lg bg-[#FF8C00]/10 flex items-center justify-center mb-4 group-hover:bg-[#FF8C00]/20 transition-colors"
                  >
                    <feature.icon className="h-6 w-6 text-[#FF8C00]" />
                  </motion.div>
                  <h3 className="text-lg font-semibold text-[#F5E8D8] mb-2">{feature.title}</h3>
                  <p className="text-sm text-[#888888]">{feature.description}</p>
                </motion.div>
              ))}
            </div>
          </section>

          {/* Vision Section */}
          <section className="container mx-auto px-4 py-20">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="relative max-w-4xl mx-auto text-center p-8 md:p-12 rounded-2xl glass-amber overflow-hidden"
            >
              <div className="absolute inset-0 breathing-bg opacity-50" />
              <div className="relative z-10">
                <Mic className="h-10 w-10 text-[#FF8C00] mx-auto mb-6" />
                <h2 className="text-2xl md:text-3xl font-bold text-[#F5E8D8] mb-4">
                  A Tap, A Whoosh, Into History
                </h2>
                <p className="text-[#888888] max-w-2xl mx-auto mb-8">
                  Imagine future generations accessing heritage through AR glasses. 
                  They tap a marker, and whoosh — they&apos;re transported to see your grandmother&apos;s 
                  kitchen, hear the blacksmith&apos;s hammer, smell the incense of forgotten rituals.
                  <br /><br />
                  <span className="text-[#F5E8D8] font-medium">
                    Every relic you preserve today becomes a portal for tomorrow.
                  </span>
                </p>
                <Link href="/contribute">
                  <FuturisticButton variant="primary" size="lg">
                    Start Preserving
                    <ChevronRight className="h-4 w-4" />
                  </FuturisticButton>
                </Link>
              </div>
            </motion.div>
          </section>

          {/* CTA Section */}
          <section className="container mx-auto px-4 py-20">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-center"
            >
              <span className="text-[10px] font-mono text-[#FF8C00] uppercase tracking-widest">
                Join The Movement
              </span>
              <h2 className="text-3xl md:text-4xl font-bold text-[#F5E8D8] mt-2 mb-4">Ready to Begin?</h2>
              <p className="text-[#888888] mb-8 max-w-xl mx-auto">
                Join curators worldwide in preserving cultural heritage. 
                Chat with Ghost to start your journey.
              </p>
              <Link href="/auth/sign-up">
                <FuturisticButton variant="amber" size="lg">
                  <Archive className="h-5 w-5" />
                  Become a Curator
                </FuturisticButton>
              </Link>
            </motion.div>
          </section>
        </main>

        {/* Footer with QR Code */}
        <Footer />
      </div>
    </>
  )
}
