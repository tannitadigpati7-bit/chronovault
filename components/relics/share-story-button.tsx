'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Share2, Copy, Check, Link as LinkIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'

interface ShareStoryButtonProps {
  relicId: string
  title: string
  onShare?: () => void
}

export function ShareStoryButton({ relicId, title, onShare }: ShareStoryButtonProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [copied, setCopied] = useState(false)
  const [shareMessage, setShareMessage] = useState(`Check out this incredible heritage story: "${title}"`)

  const shareUrl = typeof window !== 'undefined' 
    ? `${window.location.origin}/relic/${relicId}`
    : ''

  const handleCopy = async () => {
    const fullMessage = `${shareMessage}\n\n${shareUrl}`
    await navigator.clipboard.writeText(fullMessage)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
    onShare?.()
  }

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Heritage Story from Chrono-Vault',
          text: shareMessage,
          url: shareUrl
        })
        onShare?.()
      } catch (err) {
        console.log('[v0] Share cancelled or failed')
      }
    }
  }

  return (
    <>
      <Button 
        onClick={() => setIsOpen(true)}
        variant="outline"
        className="w-full"
      >
        <Share2 className="w-4 h-4 mr-2" />
        Share This Story
      </Button>

      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-secondary border border-primary/30 rounded-lg max-w-md w-full p-6 space-y-4"
            >
              <h3 className="text-xl font-serif font-bold text-primary">Share This Heritage Story</h3>

              <div className="space-y-2">
                <Label htmlFor="message">Share Message</Label>
                <Textarea
                  id="message"
                  value={shareMessage}
                  onChange={(e) => setShareMessage(e.target.value)}
                  className="resize-none"
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="url">Story Link</Label>
                <div className="flex gap-2">
                  <input
                    id="url"
                    type="text"
                    value={shareUrl}
                    readOnly
                    className="flex-1 px-3 py-2 bg-primary/10 border border-primary/20 rounded text-sm text-muted-foreground"
                  />
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={handleCopy}
                  >
                    {copied ? (
                      <Check className="w-4 h-4" />
                    ) : (
                      <Copy className="w-4 h-4" />
                    )}
                  </Button>
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                {typeof navigator !== 'undefined' && 'share' in navigator && (
                  <Button
                    onClick={handleShare}
                    className="flex-1"
                  >
                    <Share2 className="w-4 h-4 mr-2" />
                    Share
                  </Button>
                )}
                <Button
                  onClick={handleCopy}
                  variant="outline"
                  className="flex-1"
                >
                  {copied ? (
                    <>
                      <Check className="w-4 h-4 mr-2" />
                      Copied!
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4 mr-2" />
                      Copy Link
                    </>
                  )}
                </Button>
                <Button
                  onClick={() => setIsOpen(false)}
                  variant="ghost"
                  className="flex-1"
                >
                  Close
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
