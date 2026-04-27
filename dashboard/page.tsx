'use client'

import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Relic } from '@/lib/types'
import { 
  Plus, 
  Archive, 
  Eye, 
  Clock, 
  TrendingUp, 
  QrCode,
  Edit,
  Trash2,
  MoreVertical,
  Sparkles
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Header } from '@/components/layout/header'

// Prevent static prerendering of this page
export const dynamic = 'force-dynamic'

export default function DashboardPage() {
  const [relics, setRelics] = useState<Relic[]>([])
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState({
    total: 0,
    published: 0,
    drafts: 0,
    totalViews: 0
  })

  useEffect(() => {
    async function fetchData() {
      const supabase = createClient()
      
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        window.location.href = '/auth/login'
        return
      }

      const { data } = await supabase
        .from('relics')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })

      if (data) {
        setRelics(data)
        setStats({
          total: data.length,
          published: data.filter(r => r.status === 'published').length,
          drafts: data.filter(r => r.status === 'draft').length,
          totalViews: data.reduce((sum, r) => sum + (r.view_count || 0), 0)
        })
      }
      setLoading(false)
    }

    fetchData()
  }, [])

  const deleteRelic = async (id: string) => {
    const supabase = createClient()
    await supabase.from('relics').delete().eq('id', id)
    setRelics(relics.filter(r => r.id !== id))
  }

  const categoryIcons: Record<string, string> = {
    artifact: '🏺',
    practice: '🎭',
    profession: '⚒️',
    story: '📜',
    language: '🗣️',
    everyday: '🏠'
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-8 pt-24">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-8"
        >
          {/* Header */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h1 className="text-3xl font-bold text-foreground">Your Archive</h1>
              <p className="text-muted-foreground">Manage and curate your heritage collection</p>
            </div>
            <Link href="/contribute">
              <Button className="bg-primary hover:bg-primary/90 text-primary-foreground gap-2">
                <Plus className="w-4 h-4" />
                Add New Relic
              </Button>
            </Link>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { label: 'Total Relics', value: stats.total, icon: Archive, color: 'text-primary' },
              { label: 'Published', value: stats.published, icon: Eye, color: 'text-accent' },
              { label: 'Drafts', value: stats.drafts, icon: Clock, color: 'text-muted-foreground' },
              { label: 'Total Views', value: stats.totalViews, icon: TrendingUp, color: 'text-secondary' },
            ].map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
              >
                <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-lg bg-muted ${stat.color}`}>
                        <stat.icon className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                        <p className="text-xs text-muted-foreground">{stat.label}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          {/* Relics Grid */}
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map(i => (
                <div key={i} className="h-64 bg-muted/50 rounded-xl animate-pulse" />
              ))}
            </div>
          ) : relics.length === 0 ? (
            <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
              <CardContent className="flex flex-col items-center justify-center py-16 text-center">
                <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
                  <Sparkles className="w-8 h-8 text-muted-foreground" />
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-2">No relics yet</h3>
                <p className="text-muted-foreground mb-6 max-w-md">
                  Start preserving heritage by adding your first relic. Share stories, artifacts, 
                  and traditions before they fade into history.
                </p>
                <Link href="/contribute">
                  <Button className="gap-2">
                    <Plus className="w-4 h-4" />
                    Add Your First Relic
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <AnimatePresence>
                {relics.map((relic, i) => (
                  <motion.div
                    key={relic.id}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ delay: i * 0.05 }}
                  >
                    <Card className="group overflow-hidden border-border/50 bg-card/50 backdrop-blur-sm hover:border-primary/50 transition-all duration-300">
                      <div className="relative aspect-video bg-muted">
                        {relic.primary_image_url ? (
                          <Image
                            src={relic.primary_image_url}
                            alt={relic.title}
                            fill
                            className="object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-4xl">
                            {categoryIcons[relic.category] || '📦'}
                          </div>
                        )}
                        
                        {/* Status Badge */}
                        <div className="absolute top-2 left-2">
                          <span className={`px-2 py-1 text-xs rounded-full ${
                            relic.status === 'published' 
                              ? 'bg-accent/90 text-accent-foreground' 
                              : 'bg-muted/90 text-muted-foreground'
                          }`}>
                            {relic.status}
                          </span>
                        </div>

                        {/* Dropdown */}
                        <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon" className="h-8 w-8 bg-background/80 backdrop-blur-sm">
                                <MoreVertical className="w-4 h-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem asChild>
                                <Link href={`/relic/${relic.id}`} className="flex items-center gap-2">
                                  <Eye className="w-4 h-4" />
                                  View
                                </Link>
                              </DropdownMenuItem>
                              <DropdownMenuItem asChild>
                                <Link href={`/contribute?edit=${relic.id}`} className="flex items-center gap-2">
                                  <Edit className="w-4 h-4" />
                                  Edit
                                </Link>
                              </DropdownMenuItem>
                              <DropdownMenuItem className="flex items-center gap-2">
                                <QrCode className="w-4 h-4" />
                                Generate QR
                              </DropdownMenuItem>
                              <DropdownMenuItem 
                                className="flex items-center gap-2 text-destructive"
                                onClick={() => deleteRelic(relic.id)}
                              >
                                <Trash2 className="w-4 h-4" />
                                Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </div>

                      <CardContent className="p-4">
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex-1 min-w-0">
                            <h3 className="font-semibold text-foreground truncate">{relic.title}</h3>
                            <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
                              {relic.description || 'No description'}
                            </p>
                          </div>
                        </div>
                        
                        <div className="flex items-center justify-between mt-4 pt-4 border-t border-border/50">
                          <span className="text-xs text-muted-foreground capitalize flex items-center gap-1">
                            {categoryIcons[relic.category]} {relic.category}
                          </span>
                          <span className="text-xs text-muted-foreground flex items-center gap-1">
                            <Eye className="w-3 h-3" />
                            {relic.view_count || 0} views
                          </span>
                        </div>

                        {relic.ai_preservation_urgency && (
                          <div className="mt-3 flex items-center gap-2">
                            <div className="flex-1 h-1 bg-muted rounded-full overflow-hidden">
                              <div 
                                className="h-full bg-gradient-to-r from-accent to-primary"
                                style={{ width: `${relic.ai_preservation_urgency * 10}%` }}
                              />
                            </div>
                            <span className="text-xs text-muted-foreground">
                              Urgency: {relic.ai_preservation_urgency}/10
                            </span>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}
        </motion.div>
      </main>
    </div>
  )
}
