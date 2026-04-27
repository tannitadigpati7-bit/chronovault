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
  {
    icon: Scroll,
    label: 'Artifacts',
    description: 'Physical objects with cultural significance',
    longDescription: 'Artifacts are the tangible fingerprints of human civilization — the objects our ancestors touched, used, and cherished. From a Japanese kintsugi bowl repaired with liquid gold to Moroccan zellige tiles shaped by hands trained since childhood, each artifact carries layers of memory that no photograph or story can fully capture. These are the things that outlived their makers, the tools that fed families for generations, the jewelry worn at births and funerals alike. In the Chrono-Vault, we preserve not just the object but the knowledge surrounding it — the craftsman who made it, the hands that passed it down, the culture that gave it meaning. As industrialization makes mass-produced replicas of everything, the original handmade artifact becomes irreplaceable. Every artifact we archive is a vote against forgetting, a small act of defiance against the erasure of human ingenuity.'
  },
  {
    icon: BookOpen,
    label: 'Stories',
    description: 'Oral histories and family narratives',
    longDescription: 'Before writing, before screens, before any technology — there were stories. Told by firelight, passed from grandparent to grandchild, repeated in kitchens and temples and under stars. Stories are the world\'s oldest archive system, encoding everything from moral lessons to geographical knowledge to survival strategies in formats the human memory was built to hold. The Anansi spider tales of West Africa crossed the Atlantic in the minds of enslaved people; Aboriginal Dreamtime narratives have preserved ecological knowledge for 65,000 years. In this category, we collect the oral histories, folk tales, family sagas, and creation myths that formal history books never recorded. Every story here is someone\'s truth — the version of events that kept their people\'s identity alive when everything else tried to erase it. These are the voices that refused to be silenced.'
  },
  {
    icon: Wrench,
    label: 'Professions',
    description: 'Dying trades and traditional skills',
    longDescription: 'There are people alive today who know things that no one else on Earth knows. The last Kaavad storyteller who carries a portable painted shrine through villages. The sole surviving master of a 400-year-old glass-blowing technique in Murano. The elderly woman who still knows how to weave the specific pattern her grandmother\'s grandmother invented. These are the dying professions — trades and skills that cannot be Googled, cannot be learned from a YouTube tutorial, exist only in living human bodies that are growing older every day. When these people pass without apprentices, entire branches of human knowledge are permanently deleted from existence. The Chrono-Vault exists in large part to document these professions before it is too late — to record the hands, the motions, the materials, the tacit knowledge that takes decades to accumulate and only moments to lose forever.'
  },
  {
    icon: Globe,
    label: 'Practices',
    description: 'Rituals, traditions, and customs',
    longDescription: 'A practice is culture in motion — the living, breathing expression of what a community believes and values. It is the Day of the Dead altar built with marigolds and photographs every November in Michoacán. It is the Sean-nós dancer improvising on a kitchen flagstone in Connemara. It is the Tibetan monk drawing a sand mandala only to sweep it away. Practices are the rituals that mark births, deaths, harvests, and seasons — the ceremonies that tell a community who they are and where they belong. Unlike artifacts which can be placed in a case, practices must be performed to exist. They live only as long as people carry them in their bodies and memories. Here we document traditions from every continent, from the most widely celebrated festivals to the most intimate family customs that only a handful of people still observe. Every practice preserved is a living bridge between past and future.'
  },
  {
    icon: Languages,
    label: 'Languages',
    description: 'Regional dialects and expressions',
    longDescription: 'A language is not merely a communication tool — it is a complete worldview, a way of organizing reality that is unlike any other. Languages encode unique perceptions of time, color, kinship, and nature that have no direct translation. When Silbo Gomero, the whistled language of La Gomera, is spoken, words travel five kilometers through mountain air in a form that human brains process as language, not music. When Hawaiian kupuna sing ancient chants, they carry geographical knowledge about islands encoded in metaphor that GPS cannot replicate. Of the 7,000 languages spoken today, half are expected to be extinct by 2100 — each one taking with it an irreplaceable lens through which humans understood the world. This archive documents not just vocabulary and grammar but idioms, proverbs, jokes, lullabies, and the specific words that exist in one language alone because only that culture needed them. Every dialect recorded is a universe preserved.'
  },
  {
    icon: Coffee,
    label: 'Everyday',
    description: 'Objects shaping daily heritage',
    longDescription: 'Heritage is not only found in museums and temples — it lives in kitchens, courtyards, and morning routines. The Moroccan tagine that slow-cooks lamb until it falls from the bone in a way no modern oven can replicate. The Japanese furoshiki cloth that wraps any shape into a beautiful bundle, lasting decades instead of the plastic bag it replaced. The Korean ondol floor that has warmed sleeping families for 5,000 years using nothing but the patient passage of fire-heated air through stone. These are the everyday objects that shaped daily life across generations — the tools, vessels, textiles, and systems that ordinary families used without thinking, because they were simply part of how life worked. As modernization sweeps them aside, we lose not just objects but ingenuity, sustainability, and ways of relating to the material world that took millennia to develop. The extraordinary was always hiding in the ordinary.'
  },
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

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
                    className="group flex flex-col p-6 rounded-xl glass glass-hover transition-all duration-300 h-full hover:border-[#FF8C00]/40"
                  >
                    <div className="flex items-center gap-3 mb-4">
                      <motion.div
                        whileHover={{ scale: 1.1, rotate: 5 }}
                        className="h-12 w-12 rounded-lg bg-[#FF8C00]/10 flex items-center justify-center flex-shrink-0 group-hover:bg-[#FF8C00]/20 transition-colors"
                      >
                        <category.icon className="h-6 w-6 text-[#FF8C00]" />
                      </motion.div>
                      <div>
                        <h3 className="font-semibold text-[#F5E8D8] text-lg group-hover:text-[#FF8C00] transition-colors">{category.label}</h3>
                        <p className="text-xs text-[#FF8C00]/60 font-mono uppercase tracking-wider">{category.description}</p>
                      </div>
                    </div>
                    <p className="text-sm text-[#888888] leading-relaxed flex-1">{category.longDescription}</p>
                    <div className="flex items-center gap-1 mt-4 text-xs text-[#FF8C00]/70 font-mono group-hover:text-[#FF8C00] transition-colors">
                      Explore Archive →
                    </div>
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
