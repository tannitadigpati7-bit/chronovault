import { Metadata } from 'next'
import { QRScanner } from '@/components/qr/qr-scanner'
import { Header } from '@/components/layout/header'

export const metadata: Metadata = {
  title: 'Scan QR Code | Chrono-Vault',
  description: 'Scan a QR code to view a relic, experience AR, or contribute'
}

export default function ScanPage() {
  return (
    <main className="min-h-screen bg-background">
      <Header />
      <div className="pt-20">
        <QRScanner />
      </div>
    </main>
  )
}
