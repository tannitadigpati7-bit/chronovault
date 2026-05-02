import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import { Relic, CATEGORY_LABELS } from '@/lib/types'
import { RelicDetail } from '@/components/relics/relic-detail'
import { RelicMedia } from '@/components/relics/relic-media-gallery'
import { TimeCapsuleCard } from '@/components/relics/time-capsule-card'
import { RelicQRCodes } from '@/components/relics/relic-qr-codes'
import { RelatedRelics } from '@/components/relics/related-relics'

// Prevent static prerendering
export const dynamic = 'force-dynamic'

interface RelicPageProps {
  params: Promise<{ id: string }>
}

export async function generateMetadata({ params }: RelicPageProps) {
  const { id } = await params
  const supabase = await createClient()
  
  const { data: relic } = await supabase
    .from('relics')
    .select('title, description, ai_time_capsule_note')
    .eq('id', id)
    .single()
  
  if (!relic) {
    return { title: 'Relic Not Found' }
  }
  
  return {
    title: `${relic.title} | Chrono-Vault`,
    description: relic.description || relic.ai_time_capsule_note || 'A preserved heritage artifact'
  }
}

export default async function RelicPage({ params }: RelicPageProps) {
  const { id } = await params
  const supabase = await createClient()
  
  // Fetch relic first (without joins that might fail)
  const { data: relic, error } = await supabase
    .from('relics')
    .select('*')
    .eq('id', id)
    .single()
  
  if (error || !relic) {
    notFound()
  }
  
  // Fetch media separately
  const { data: media } = await supabase
    .from('relic_media')
    .select('*')
    .eq('relic_id', id)
  
  // Fetch profile separately if user_id exists
  let profile = null
  if (relic.user_id) {
    const { data: profileData } = await supabase
      .from('profiles')
      .select('id, display_name, avatar_url')
      .eq('id', relic.user_id)
      .single()
    profile = profileData
  }
  
  // Attach to relic
  const relicWithRelations = { ...relic, media: media || [], profile }
  
  // Check if user can view (published or owner)
  const { data: { user } } = await supabase.auth.getUser()
  const canView = relicWithRelations.status === 'published' || relicWithRelations.user_id === user?.id
  
  if (!canView) {
    notFound()
  }
  
  // Increment view count (fire and forget)
  if (relicWithRelations.status === 'published') {
    supabase
      .from('relics')
      .update({ view_count: (relicWithRelations.view_count || 0) + 1 })
      .eq('id', id)
      .then(() => {})
  }
  
  // Fetch QR codes
  const { data: qrCodes } = await supabase
    .from('relic_qr_codes')
    .select('*')
    .eq('relic_id', id)
  
  // Fetch related relics (same category or related traditions)
  const { data: relatedRelics } = await supabase
    .from('relics')
    .select('id, title, primary_image_url, category, ai_preservation_urgency')
    .eq('status', 'published')
    .eq('category', relicWithRelations.category)
    .neq('id', id)
    .limit(4)
  
  return (
    <main className="min-h-screen bg-background">
      <article className="max-w-6xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Media Gallery */}
            <RelicMedia 
              primaryImage={relicWithRelations.primary_image_url} 
              media={relicWithRelations.media || []}
              title={relicWithRelations.title}
            />
            
            {/* Relic Details */}
            <RelicDetail relic={relicWithRelations as Relic} />
          </div>
          
          {/* Sidebar */}
          <aside className="space-y-6">
            {/* Time Capsule Note */}
            {(relicWithRelations.ai_time_capsule_note || relicWithRelations.ai_future_importance) && (
              <TimeCapsuleCard
                timeCapsuleNote={relicWithRelations.ai_time_capsule_note}
                currentRelevance={relicWithRelations.ai_current_relevance}
                futureImportance={relicWithRelations.ai_future_importance}
                preservationUrgency={relicWithRelations.ai_preservation_urgency}
              />
            )}
            
            {/* QR Codes */}
            {qrCodes && qrCodes.length > 0 && (
              <RelicQRCodes qrCodes={qrCodes} relicId={relicWithRelations.id} />
            )}
            
            {/* Contributor Info */}
            {relicWithRelations.profile && (
              <div className="p-6 bg-card rounded-xl border border-border/50">
                <h3 className="text-sm font-medium text-muted-foreground mb-4">Contributed By</h3>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center">
                    {relicWithRelations.profile.avatar_url ? (
                      <img 
                        src={relicWithRelations.profile.avatar_url} 
                        alt={relicWithRelations.profile.display_name || 'Contributor'}
                        className="w-full h-full rounded-full object-cover"
                      />
                    ) : (
                      <span className="text-lg font-semibold">
                        {relicWithRelations.profile.display_name?.charAt(0) || 'A'}
                      </span>
                    )}
                  </div>
                  <div>
                    <p className="font-medium">{relicWithRelations.profile.display_name || 'Anonymous Curator'}</p>
                    <p className="text-sm text-muted-foreground">Heritage Contributor</p>
                  </div>
                </div>
              </div>
            )}
          </aside>
        </div>
        
        {/* Related Relics */}
        {relatedRelics && relatedRelics.length > 0 && (
          <RelatedRelics relics={relatedRelics} currentCategory={relicWithRelations.category} />
        )}
      </article>
    </main>
  )
}
