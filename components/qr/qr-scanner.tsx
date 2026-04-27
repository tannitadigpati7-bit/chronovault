'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { QrCode, Camera, X, Flashlight, SwitchCamera } from 'lucide-react'
import { Button } from '@/components/ui/button'

export function QRScanner() {
  const router = useRouter()
  const [hasPermission, setHasPermission] = useState<boolean | null>(null)
  const [isScanning, setIsScanning] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const streamRef = useRef<MediaStream | null>(null)
  
  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment' }
      })
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream
        streamRef.current = stream
        setHasPermission(true)
        setIsScanning(true)
        scanQRCode()
      }
    } catch (err) {
      console.error('Camera error:', err)
      setHasPermission(false)
      setError('Unable to access camera. Please grant permission.')
    }
  }
  
  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop())
      streamRef.current = null
    }
    setIsScanning(false)
  }
  
  const scanQRCode = async () => {
    if (!videoRef.current || !canvasRef.current) return
    
    const video = videoRef.current
    const canvas = canvasRef.current
    const context = canvas.getContext('2d')
    
    if (!context) return
    
    // Wait for video to be ready
    if (video.readyState !== video.HAVE_ENOUGH_DATA) {
      requestAnimationFrame(scanQRCode)
      return
    }
    
    canvas.width = video.videoWidth
    canvas.height = video.videoHeight
    context.drawImage(video, 0, 0, canvas.width, canvas.height)
    
    // Use BarcodeDetector API if available
    if ('BarcodeDetector' in window) {
      try {
        // @ts-expect-error BarcodeDetector is not yet in TypeScript types
        const detector = new window.BarcodeDetector({ formats: ['qr_code'] })
        const barcodes = await detector.detect(canvas)
        
        if (barcodes.length > 0) {
          handleQRCode(barcodes[0].rawValue)
          return
        }
      } catch (err) {
        console.error('Barcode detection error:', err)
      }
    }
    
    // Continue scanning
    if (isScanning) {
      requestAnimationFrame(scanQRCode)
    }
  }
  
  const handleQRCode = (data: string) => {
    stopCamera()
    
    // Parse QR code data and redirect
    if (data.includes('/relic/')) {
      router.push(data)
    } else if (data.includes('/ar/')) {
      router.push(data)
    } else if (data.includes('/contribute/')) {
      router.push(data)
    } else if (data.startsWith('http')) {
      router.push(data)
    } else {
      // Try to extract relic ID
      const match = data.match(/view_(.+)|ar_(.+)|contribute_(.+)/)
      if (match) {
        const relicId = match[1] || match[2] || match[3]
        if (data.startsWith('ar_')) {
          router.push(`/ar/${relicId}`)
        } else if (data.startsWith('contribute_')) {
          router.push(`/contribute/${relicId}`)
        } else {
          router.push(`/relic/${relicId}`)
        }
      }
    }
  }
  
  useEffect(() => {
    return () => stopCamera()
  }, [])
  
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      <div className="max-w-md w-full">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-primary/20 flex items-center justify-center">
            <QrCode className="w-8 h-8 text-primary" />
          </div>
          <h1 className="text-2xl font-bold mb-2">Scan QR Code</h1>
          <p className="text-muted-foreground">
            Point your camera at a Chrono-Vault QR code to view, explore in AR, or contribute
          </p>
        </div>
        
        {/* Scanner Area */}
        <div className="relative aspect-square rounded-2xl overflow-hidden bg-black/90 border border-border/50">
          {isScanning ? (
            <>
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="w-full h-full object-cover"
              />
              <canvas ref={canvasRef} className="hidden" />
              
              {/* Scanning overlay */}
              <div className="absolute inset-0 pointer-events-none">
                {/* Corner markers */}
                <div className="absolute top-4 left-4 w-16 h-16 border-l-4 border-t-4 border-primary rounded-tl-lg" />
                <div className="absolute top-4 right-4 w-16 h-16 border-r-4 border-t-4 border-primary rounded-tr-lg" />
                <div className="absolute bottom-4 left-4 w-16 h-16 border-l-4 border-b-4 border-primary rounded-bl-lg" />
                <div className="absolute bottom-4 right-4 w-16 h-16 border-r-4 border-b-4 border-primary rounded-br-lg" />
                
                {/* Scanning line */}
                <motion.div
                  className="absolute left-4 right-4 h-0.5 bg-gradient-to-r from-transparent via-primary to-transparent"
                  animate={{ top: ['20%', '80%', '20%'] }}
                  transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                />
              </div>
              
              {/* Stop button */}
              <Button
                variant="ghost"
                size="icon"
                onClick={stopCamera}
                className="absolute top-4 right-4 bg-black/50 hover:bg-black/70 text-white"
              >
                <X className="w-5 h-5" />
              </Button>
            </>
          ) : (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 p-8">
              <Camera className="w-12 h-12 text-muted-foreground" />
              <p className="text-sm text-muted-foreground text-center">
                {hasPermission === false 
                  ? 'Camera access denied. Please enable it in your browser settings.'
                  : 'Tap the button below to start scanning'}
              </p>
            </div>
          )}
        </div>
        
        {/* Actions */}
        <div className="mt-6 space-y-4">
          {!isScanning && (
            <Button 
              onClick={startCamera} 
              className="w-full"
              size="lg"
              disabled={hasPermission === false}
            >
              <Camera className="w-5 h-5 mr-2" />
              Start Scanning
            </Button>
          )}
          
          {error && (
            <p className="text-sm text-destructive text-center">{error}</p>
          )}
          
          {/* Manual entry option */}
          <div className="text-center">
            <p className="text-sm text-muted-foreground">
              Or enter a relic code manually
            </p>
            <Button variant="link" onClick={() => router.push('/explore')}>
              Browse the Archive
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
