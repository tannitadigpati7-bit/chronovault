import { Metadata } from 'next'
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { ContributeForm } from '@/components/contribute/contribute-form'
import { Header } from '@/components/layout/header'

export const metadata: Metadata = {
  title: 'Contribute a Relic | Chrono-Vault',
  description: 'Share your heritage artifacts, traditions, and stories with the world'
}

// Prevent static prerendering of this protected page
export const dynamic = 'force-dynamic'

export default async function ContributePage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    redirect('/auth/login?redirect=/contribute')
  }
  
  return (
    <div className="min-h-screen bg-[#0A0A0A]">
      {/* Background effects */}
      <div className="fixed inset-0 breathing-bg opacity-30 pointer-events-none" />
      <div className="fixed inset-0 grid-pattern opacity-20 pointer-events-none" />
      <div className="fixed bottom-1/4 left-1/4 w-[400px] h-[400px] bg-[#FF8C00]/10 rounded-full blur-[100px] animate-glow-pulse pointer-events-none" />
      
      <Header />
      
      <main className="relative z-10 pt-24">
        <ContributeForm userId={user.id} />
      </main>
    </div>
  )
}
