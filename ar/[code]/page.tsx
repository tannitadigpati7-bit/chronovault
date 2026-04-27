import { createClient } from '@/lib/supabase/server'
import { notFound, redirect } from 'next/navigation'
import { ARViewer } from '@/components/ar/ar-viewer'

interface ARPageProps {
  params: Promise<{ code: string }>
}

export default async function ARPage({ params }: ARPageProps) {
  const { code } = await params
  const supabase = await createClient()
  
  // Find the QR code and associated relic
  // Handle both direct relic ID and QR code format
  let relicId = code
  
  if (code.startsWith('ar_')) {
    relicId = code.replace('ar_', '')
  } else {
    // Look up QR code
    const { data: qrCode } = await supabase
      .from('relic_qr_codes')
      .select('relic_id')
      .eq('code', code)
      .eq('qr_type', 'ar')
      .single()
    
    if (qrCode?.relic_id) {
      relicId = qrCode.relic_id
    }
  }
  
  // Fetch relic data
  const { data: relic, error } = await supabase
    .from('relics')
    .select(`
      *,
      media:relic_media(*)
    `)
    .eq('id', relicId)
    .eq('status', 'published')
    .single()
  
  if (error || !relic) {
    notFound()
  }
  
  // Increment QR scan count
  await supabase.rpc('increment_qr_scan', { qr_code: code })
  
  return (
    <main className="min-h-screen bg-black">
      <ARViewer relic={relic} />
    </main>
  )
}
