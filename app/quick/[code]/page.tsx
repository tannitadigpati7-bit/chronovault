import { createClient } from '@/lib/supabase/server'
import { QuickContributeForm } from '@/components/contribute/quick-contribute-form'
import { notFound } from 'next/navigation'

interface QuickContributePageProps {
  params: Promise<{ code: string }>
}

export default async function QuickContributePage({ params }: QuickContributePageProps) {
  const { code } = await params
  const supabase = await createClient()
  
  // Find the QR code and related relic
  const { data: qrCode } = await supabase
    .from('relic_qr_codes')
    .select(`
      *,
      relic:relics(*)
    `)
    .eq('code', code)
    .eq('qr_type', 'contribute')
    .single()
  
  if (!qrCode) {
    notFound()
  }

  // Increment scan count
  await supabase.rpc('increment_qr_scan', { qr_code: code })

  return (
    <div className="min-h-screen bg-background">
      <QuickContributeForm relicId={qrCode.relic_id} relicTitle={qrCode.relic?.title} />
    </div>
  )
}
