import { Metadata } from 'next'
import { CuratorChat } from '@/components/curator/curator-chat'
import { Header } from '@/components/layout/header'

export const metadata: Metadata = {
  title: 'Talk to Ghost | Chrono-Vault',
  description: 'Chat with Ghost, your AI digital archaeologist, to explore heritage, share stories, and contribute relics'
}

export default function CuratorPage() {
  return (
    <main className="min-h-screen bg-background">
      <Header />
      <div className="pt-20">
        <CuratorChat />
      </div>
    </main>
  )
}
