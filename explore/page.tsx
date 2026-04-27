import { createClient } from '@/lib/supabase/server'
import { Relic } from '@/lib/types'
import { RelicGrid } from '@/components/relics/relic-grid'
import { CategoryFilter } from '@/components/relics/category-filter'
import { SearchBar } from '@/components/relics/search-bar'
import { Header } from '@/components/layout/header'
import { ExploreClientWrapper } from '@/components/explore/explore-client-wrapper'

export const metadata = {
  title: 'Heritage Archive | Chrono-Vault',
  description: 'Explore preserved heritage artifacts, traditions, and stories from cultures around the world'
}

interface ExplorePageProps {
  searchParams: Promise<{ category?: string; q?: string }>
}

export default async function ExplorePage({ searchParams }: ExplorePageProps) {
  const params = await searchParams
  const supabase = await createClient()
  
  let query = supabase
    .from('relics')
    .select('*')
    .eq('status', 'published')
    .order('created_at', { ascending: false })
  
  if (params.category && params.category !== 'all') {
    query = query.eq('category', params.category)
  }
  
  if (params.q) {
    query = query.or(`title.ilike.%${params.q}%,description.ilike.%${params.q}%,tags.cs.{${params.q}}`)
  }
  
  const { data: relics } = await query.limit(50)
  
  return (
    <div className="min-h-screen bg-[#0A0A0A]">
      {/* Background effects */}
      <div className="fixed inset-0 breathing-bg opacity-30 pointer-events-none" />
      <div className="fixed inset-0 grid-pattern opacity-20 pointer-events-none" />
      <div className="fixed top-1/4 right-1/4 w-[500px] h-[500px] bg-[#FF8C00]/10 rounded-full blur-[120px] animate-glow-pulse pointer-events-none" />
      
      <Header />
      <ExploreClientWrapper />

      <main className="relative z-10 pt-24">
        {/* Hero Section */}
        <section className="relative py-16 px-4 border-b border-[#333333]/50 overflow-hidden">
          <div className="relative max-w-6xl mx-auto text-center">
            <span className="text-[10px] font-mono text-[#FF8C00] uppercase tracking-widest">
              Chrono-Vault Archive
            </span>
            <h1 className="text-4xl md:text-5xl font-bold text-[#F5E8D8] mt-2 mb-4 text-balance">
              Heritage <span className="gradient-text">Database</span>
            </h1>
            <p className="text-lg text-[#888888] max-w-2xl mx-auto mb-8">
              Journey through preserved heritage artifacts, vanishing traditions, and stories 
              waiting to be rediscovered by future generations.
            </p>
            
            <SearchBar initialQuery={params.q} />
          </div>
        </section>
        
        {/* Filters & Grid */}
        <section className="max-w-7xl mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row gap-6 md:items-center justify-between mb-8">
            <CategoryFilter activeCategory={params.category || 'all'} />
            
            <div className="text-sm text-[#888888] font-mono">
              <span className="text-[#FF8C00]">{relics?.length || 0}</span> relics cataloged
            </div>
          </div>
          
          {relics && relics.length > 0 ? (
            <RelicGrid relics={relics as Relic[]} />
          ) : (
            <div className="text-center py-20">
              <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-[#1A1A1A] flex items-center justify-center border border-[#333333]">
                <span className="text-4xl opacity-50">🔍</span>
              </div>
              <h2 className="text-xl font-semibold text-[#F5E8D8] mb-2">No relics found</h2>
              <p className="text-[#888888] mb-6">
                {params.q 
                  ? `No results for "${params.q}". Try a different search.`
                  : 'Be the first to contribute a relic to this category.'}
              </p>
            </div>
          )}
        </section>
      </main>
    </div>
  )
}
