'use client'

import { useEffect, useState } from 'react'
import { QRCodeSVG } from 'qrcode.react'
import { motion } from 'framer-motion'
import { QrCode, Eye, Smartphone, Plus, Download } from 'lucide-react'
import { RelicQRCode, QRType } from '@/lib/types'
import { Button } from '@/components/ui/button'

interface RelicQRCodesProps {
  qrCodes: RelicQRCode[]
  relicId: string
}

const qrTypeConfig: Record<QRType, { icon: typeof Eye; label: string; description: string }> = {
  view: {
    icon: Eye,
    label: 'View',
    description: 'Opens the relic detail page'
  },
  ar: {
    icon: Smartphone,
    label: 'AR Experience',
    description: 'Augmented reality overlay'
  },
  contribute: {
    icon: Plus,
    label: 'Contribute',
    description: 'Add related stories'
  }
}

export function RelicQRCodes({ qrCodes, relicId }: RelicQRCodesProps) {
  const [activeQR, setActiveQR] = useState<QRType>('view')
  const [baseUrl, setBaseUrl] = useState('')
  
  useEffect(() => {
    setBaseUrl(window.location.origin)
  }, [])
  
  const activeQRCode = qrCodes.find(qr => qr.qr_type === activeQR)
  
  const getQRUrl = (type: QRType) => {
    const code = qrCodes.find(qr => qr.qr_type === type)?.code || ''
    switch (type) {
      case 'view':
        return `${baseUrl}/relic/${relicId}`
      case 'ar':
        return `${baseUrl}/ar/${code}`
      case 'contribute':
        return `${baseUrl}/contribute/${relicId}`
      default:
        return baseUrl
    }
  }
  
  const downloadQR = () => {
    const svg = document.getElementById('relic-qr-code')
    if (!svg) return
    
    const svgData = new XMLSerializer().serializeToString(svg)
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')
    const img = new Image()
    
    img.onload = () => {
      canvas.width = img.width
      canvas.height = img.height
      ctx?.drawImage(img, 0, 0)
      const pngFile = canvas.toDataURL('image/png')
      
      const downloadLink = document.createElement('a')
      downloadLink.download = `relic-qr-${activeQR}.png`
      downloadLink.href = pngFile
      downloadLink.click()
    }
    
    img.crossOrigin = 'anonymous'
    img.src = 'data:image/svg+xml;base64,' + btoa(svgData)
  }
  
  return (
    <div className="p-6 bg-card rounded-xl border border-border/50">
      <div className="flex items-center gap-2 mb-4">
        <QrCode className="w-5 h-5 text-primary" />
        <h3 className="font-semibold">QR Codes</h3>
      </div>
      
      {/* Type Selector */}
      <div className="flex gap-2 mb-4">
        {(['view', 'ar', 'contribute'] as QRType[]).map((type) => {
          const config = qrTypeConfig[type]
          const Icon = config.icon
          const isActive = activeQR === type
          
          return (
            <button
              key={type}
              onClick={() => setActiveQR(type)}
              className={`flex-1 p-2 rounded-lg border text-center transition-all ${
                isActive 
                  ? 'bg-primary/10 border-primary/50 text-primary' 
                  : 'border-border/50 text-muted-foreground hover:border-border hover:text-foreground'
              }`}
            >
              <Icon className="w-4 h-4 mx-auto mb-1" />
              <span className="text-xs font-medium">{config.label}</span>
            </button>
          )
        })}
      </div>
      
      {/* QR Code Display */}
      <motion.div
        key={activeQR}
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.2 }}
        className="flex flex-col items-center"
      >
        <div className="p-4 bg-white rounded-xl mb-3">
          <QRCodeSVG
            id="relic-qr-code"
            value={getQRUrl(activeQR)}
            size={160}
            level="H"
            includeMargin={false}
          />
        </div>
        
        <p className="text-sm text-muted-foreground text-center mb-3">
          {qrTypeConfig[activeQR].description}
        </p>
        
        {activeQRCode && (
          <p className="text-xs text-muted-foreground mb-3">
            {activeQRCode.scan_count} scans
          </p>
        )}
        
        <Button variant="outline" size="sm" onClick={downloadQR}>
          <Download className="w-4 h-4 mr-2" />
          Download QR
        </Button>
      </motion.div>
    </div>
  )
}
