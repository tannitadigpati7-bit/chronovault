'use client'

import { useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Camera, Mic, X, Send, CheckCircle, Sparkles } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent } from '@/components/ui/card'
import Image from 'next/image'

interface QuickContributeFormProps {
  relicId: string | null
  relicTitle?: string
}

export function QuickContributeForm({ relicId, relicTitle }: QuickContributeFormProps) {
  const [step, setStep] = useState<'capture' | 'describe' | 'success'>('capture')
  const [mediaUrl, setMediaUrl] = useState<string | null>(null)
  const [mediaType, setMediaType] = useState<'image' | 'audio' | null>(null)
  const [story, setStory] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isRecording, setIsRecording] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const chunksRef = useRef<Blob[]>([])

  const handleCapture = () => {
    fileInputRef.current?.click()
  }

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const url = URL.createObjectURL(file)
    setMediaUrl(url)
    setMediaType('image')
    setStep('describe')
  }

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      const mediaRecorder = new MediaRecorder(stream)
      mediaRecorderRef.current = mediaRecorder
      chunksRef.current = []

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          chunksRef.current.push(e.data)
        }
      }

      mediaRecorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: 'audio/webm' })
        const url = URL.createObjectURL(blob)
        setMediaUrl(url)
        setMediaType('audio')
        setStep('describe')
        stream.getTracks().forEach(track => track.stop())
      }

      mediaRecorder.start()
      setIsRecording(true)
    } catch (error) {
      console.error('Failed to start recording:', error)
    }
  }

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop()
      setIsRecording(false)
    }
  }

  const handleSubmit = async () => {
    setIsSubmitting(true)
    
    // Simulate upload
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    setStep('success')
    setIsSubmitting(false)
  }

  const reset = () => {
    setStep('capture')
    setMediaUrl(null)
    setMediaType(null)
    setStory('')
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gradient-to-b from-background to-muted/30">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        {/* Header */}
        <div className="text-center mb-8">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', delay: 0.2 }}
            className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center"
          >
            <Sparkles className="w-8 h-8 text-primary-foreground" />
          </motion.div>
          <h1 className="text-2xl font-bold text-foreground mb-2">Quick Contribute</h1>
          {relicTitle && (
            <p className="text-muted-foreground">
              Adding to: <span className="text-primary">{relicTitle}</span>
            </p>
          )}
        </div>

        <AnimatePresence mode="wait">
          {step === 'capture' && (
            <motion.div
              key="capture"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
            >
              <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
                <CardContent className="p-8 space-y-6">
                  <p className="text-center text-muted-foreground">
                    Capture a photo or record your story
                  </p>

                  <div className="grid grid-cols-2 gap-4">
                    <Button
                      variant="outline"
                      className="h-32 flex-col gap-3 border-dashed hover:bg-primary/5 hover:border-primary"
                      onClick={handleCapture}
                    >
                      <Camera className="w-8 h-8 text-primary" />
                      <span>Take Photo</span>
                    </Button>

                    <Button
                      variant="outline"
                      className={`h-32 flex-col gap-3 border-dashed transition-all ${
                        isRecording 
                          ? 'bg-destructive/10 border-destructive animate-pulse' 
                          : 'hover:bg-secondary/5 hover:border-secondary'
                      }`}
                      onClick={isRecording ? stopRecording : startRecording}
                    >
                      <Mic className={`w-8 h-8 ${isRecording ? 'text-destructive' : 'text-secondary'}`} />
                      <span>{isRecording ? 'Stop Recording' : 'Record Story'}</span>
                    </Button>
                  </div>

                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    capture="environment"
                    className="hidden"
                    onChange={handleFileChange}
                  />
                </CardContent>
              </Card>
            </motion.div>
          )}

          {step === 'describe' && (
            <motion.div
              key="describe"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
            >
              <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
                <CardContent className="p-6 space-y-4">
                  {/* Media Preview */}
                  <div className="relative aspect-video rounded-lg overflow-hidden bg-muted">
                    {mediaType === 'image' && mediaUrl && (
                      <Image
                        src={mediaUrl}
                        alt="Captured"
                        fill
                        className="object-cover"
                      />
                    )}
                    {mediaType === 'audio' && mediaUrl && (
                      <div className="w-full h-full flex items-center justify-center">
                        <audio src={mediaUrl} controls className="w-3/4" />
                      </div>
                    )}
                    <Button
                      variant="ghost"
                      size="icon"
                      className="absolute top-2 right-2 bg-background/80"
                      onClick={reset}
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>

                  {/* Story Input */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground">
                      Tell us the story
                    </label>
                    <Textarea
                      value={story}
                      onChange={(e) => setStory(e.target.value)}
                      placeholder="What's the story behind this? Who used it? Where does it come from?"
                      rows={4}
                      className="resize-none"
                    />
                  </div>

                  <Button
                    className="w-full gap-2"
                    onClick={handleSubmit}
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <>
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                        >
                          <Sparkles className="w-4 h-4" />
                        </motion.div>
                        Processing...
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4" />
                        Submit Contribution
                      </>
                    )}
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {step === 'success' && (
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center"
            >
              <Card className="border-accent/50 bg-card/50 backdrop-blur-sm">
                <CardContent className="p-8 space-y-6">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring', delay: 0.2 }}
                    className="w-20 h-20 mx-auto rounded-full bg-gradient-to-br from-accent to-primary flex items-center justify-center"
                  >
                    <CheckCircle className="w-10 h-10 text-primary-foreground" />
                  </motion.div>

                  <div>
                    <h2 className="text-xl font-bold text-foreground mb-2">
                      Thank You, Preserver!
                    </h2>
                    <p className="text-muted-foreground">
                      Your contribution has been recorded. Together, we're building a bridge 
                      to the future.
                    </p>
                  </div>

                  <div className="space-y-3">
                    <Button onClick={reset} className="w-full">
                      Add Another
                    </Button>
                    <Button variant="outline" className="w-full" asChild>
                      <a href="/explore">Explore Archive</a>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  )
}
