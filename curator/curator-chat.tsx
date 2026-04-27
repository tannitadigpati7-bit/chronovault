'use client'

import { useState, useRef, useEffect } from 'react'
import { useChat } from '@ai-sdk/react'
import { DefaultChatTransport } from 'ai'
import { motion, AnimatePresence } from 'framer-motion'
import { Send, ImagePlus, X, Archive, MessageSquare, Ghost, Sparkles } from 'lucide-react'
import { Textarea } from '@/components/ui/textarea'
import { ChatMessage } from './chat-message'
import { GhostAgentLogs, GhostThinking } from '@/components/ghost/ghost-agent-logs'
import { FuturisticButton, IconButton } from '@/components/ui/futuristic-button'
import { BentoGrid, BentoCard, AgentLogCard } from '@/components/ui/bento-grid'

export function CuratorChat() {
  const [input, setInput] = useState('')
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [hasImageAttachment, setHasImageAttachment] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  
  const { messages, sendMessage, status, error } = useChat({
    transport: new DefaultChatTransport({ 
      api: '/api/curator',
      prepareSendMessagesRequest: ({ id, messages }) => ({
        body: {
          messages,
          id,
          hasImageAttachment
        }
      })
    }),
    onError: (err) => {
      console.error('[v0] Chat error:', err)
      if (err.message?.includes('credit card') || err.message?.includes('402')) {
        setErrorMessage('To enable Ghost conversations, please add a credit card to your Vercel account. Free credits are available after verification.')
      } else {
        setErrorMessage('Ghost is temporarily unavailable. Please try again.')
      }
    }
  })
  
  const isLoading = status === 'streaming' || status === 'submitted'
  
  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])
  
  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto'
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 150)}px`
    }
  }, [input])
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim() && !imagePreview) return
    if (isLoading) return
    
    let messageText = input.trim()
    
    // If there's an image, include it in the message
    if (imagePreview) {
      messageText = `[Image attached]\n\n${messageText}`
      setHasImageAttachment(true)
    }
    
    sendMessage({ text: messageText })
    setInput('')
    setImagePreview(null)
    setHasImageAttachment(false)
  }
  
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setImagePreview(reader.result as string)
        setHasImageAttachment(true)
      }
      reader.readAsDataURL(file)
    }
  }
  
  const removeImage = () => {
    setImagePreview(null)
    setHasImageAttachment(false)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }
  
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSubmit(e)
    }
  }
  
  return (
    <div className="flex flex-col h-screen max-h-screen bg-[#0A0A0A]">
      {/* Background effects */}
      <div className="fixed inset-0 breathing-bg opacity-50 pointer-events-none" />
      <div className="fixed inset-0 grid-pattern opacity-20 pointer-events-none" />
      
      {/* Header */}
      <header className="flex-shrink-0 border-b border-[#333333]/50 bg-[#0A0A0A]/80 backdrop-blur-lg relative z-10">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center gap-4">
          <GhostAvatar animate />
          <div>
            <h1 className="font-semibold text-[#F5E8D8] flex items-center gap-2">
              Ghost
              <span className="text-[10px] font-mono text-[#FF8C00] bg-[#FF8C00]/10 px-2 py-0.5 rounded-full uppercase tracking-wider">
                Active
              </span>
            </h1>
            <p className="text-sm text-[#888888]">
              Your digital archaeologist for heritage preservation
            </p>
          </div>
        </div>
      </header>
      
      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto relative z-10">
        <div className="max-w-4xl mx-auto px-4 py-6">
          {messages.length === 0 ? (
            <WelcomeScreen onSuggestedPrompt={(prompt) => {
              setInput(prompt)
              textareaRef.current?.focus()
            }} />
          ) : (
            <div className="space-y-6">
              <AnimatePresence mode="popLayout">
                {messages.map((message) => (
                  <ChatMessage key={message.id} message={message} />
                ))}
              </AnimatePresence>
              
              {isLoading && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-start gap-3"
                >
                  <GhostAvatar size="sm" animate />
                  <div className="flex-1 space-y-3">
                    <GhostThinking />
                    <GhostAgentLogs isProcessing />
                  </div>
                </motion.div>
              )}
              
              {(errorMessage || error) && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-red-500/10 border border-red-500/30 rounded-lg p-4 text-red-400"
                >
                  <p className="font-medium mb-1">Ghost encountered an issue</p>
                  <p className="text-sm text-red-400/80">
                    {errorMessage || (error instanceof Error ? error.message : 'An error occurred. Please try again.')}
                  </p>
                  <button 
                    onClick={() => setErrorMessage(null)}
                    className="mt-2 text-xs text-red-400/60 hover:text-red-400 underline"
                  >
                    Dismiss
                  </button>
                </motion.div>
              )}
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>
      
      {/* Input Area */}
      <div className="flex-shrink-0 border-t border-[#333333]/50 bg-[#0A0A0A]/80 backdrop-blur-lg relative z-10">
        <div className="max-w-4xl mx-auto px-4 py-4">
          {/* Image Preview */}
          <AnimatePresence>
            {imagePreview && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="mb-3"
              >
                <div className="relative inline-block">
                  <img
                    src={imagePreview}
                    alt="Upload preview"
                    className="max-h-32 rounded-lg border border-[#333333]"
                  />
                  <button
                    onClick={removeImage}
                    className="absolute -top-2 -right-2 p-1 bg-red-500 text-white rounded-full shadow-lg"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
          
          <form onSubmit={handleSubmit} className="flex items-end gap-3">
            {/* Image Upload */}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
            />
            <IconButton
              type="button"
              variant="ghost"
              onClick={() => fileInputRef.current?.click()}
              disabled={isLoading}
            >
              <ImagePlus className="w-5 h-5" />
            </IconButton>
            
            {/* Text Input */}
            <div className="flex-1 relative">
              <Textarea
                ref={textareaRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Share a story, describe a relic, or ask about heritage..."
                disabled={isLoading}
                className="min-h-[52px] max-h-[150px] resize-none pr-12 bg-[#121212] border-[#333333] focus:border-[#FF8C00]/50 text-[#F5E8D8] placeholder:text-[#888888]"
                rows={1}
              />
            </div>
            
            {/* Send Button */}
            <FuturisticButton
              type="submit"
              variant="primary"
              disabled={isLoading || (!input.trim() && !imagePreview)}
            >
              <Send className="w-5 h-5" />
            </FuturisticButton>
          </form>
          
          <p className="text-xs text-[#888888] text-center mt-3 font-mono">
            Share heritage artifacts, traditions, or stories. Ghost will help preserve them for future generations.
          </p>
        </div>
      </div>
    </div>
  )
}

// Ghost Avatar Component
function GhostAvatar({ size = 'md', animate = false }: { size?: 'sm' | 'md' | 'lg', animate?: boolean }) {
  const sizes = {
    sm: 'w-10 h-10',
    md: 'w-14 h-14',
    lg: 'w-20 h-20'
  }

  return (
    <motion.div 
      className={`${sizes[size]} relative`}
      animate={animate ? { y: [0, -3, 0] } : {}}
      transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
    >
      <div className="absolute inset-0 bg-[#FF8C00]/20 rounded-full blur-lg" />
      <div className="relative w-full h-full bg-gradient-to-br from-[#F5E8D8] to-[#E5D8C8] rounded-full flex items-center justify-center shadow-[0_0_20px_rgba(255,140,0,0.3)]">
        <Ghost className="w-1/2 h-1/2 text-[#0A0A0A]" />
      </div>
      {animate && (
        <motion.div
          className="absolute -top-1 -right-1 w-3 h-3 bg-[#FF8C00] rounded-full"
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 1, repeat: Infinity }}
        />
      )}
    </motion.div>
  )
}

function WelcomeScreen({ onSuggestedPrompt }: { onSuggestedPrompt: (prompt: string) => void }) {
  const suggestions = [
    {
      icon: Archive,
      title: 'Share a Relic',
      prompt: 'I have an old family heirloom I\'d like to document and preserve',
      description: 'Document physical artifacts with stories'
    },
    {
      icon: MessageSquare,
      title: 'Tell a Story',
      prompt: 'I want to share an oral tradition that has been passed down in my family',
      description: 'Preserve intangible heritage and traditions'
    },
    {
      icon: Sparkles,
      title: 'Explore Heritage',
      prompt: 'What kinds of traditions and artifacts are people preserving?',
      description: 'Discover what others have contributed'
    }
  ]
  
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <GhostAvatar size="lg" animate />
      </motion.div>
      
      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="text-2xl md:text-3xl font-bold text-[#F5E8D8] mt-6 mb-3"
      >
        Welcome, Heritage Keeper
      </motion.h2>
      
      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="text-[#888888] max-w-md mb-8"
      >
        I&apos;m <span className="text-[#FF8C00] font-semibold">Ghost</span>, your digital archaeologist. 
        Share artifacts, traditions, and stories — I&apos;ll help preserve them for future 
        generations to experience in tomorrow&apos;s digital museums.
      </motion.p>
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full max-w-2xl"
      >
        {suggestions.map((suggestion, index) => (
          <motion.button
            key={index}
            onClick={() => onSuggestedPrompt(suggestion.prompt)}
            whileHover={{ scale: 1.02, y: -2 }}
            whileTap={{ scale: 0.98 }}
            className="p-5 glass glass-hover rounded-xl text-left group"
          >
            <div className="w-10 h-10 rounded-lg bg-[#FF8C00]/10 flex items-center justify-center mb-3 group-hover:bg-[#FF8C00]/20 transition-colors">
              <suggestion.icon className="w-5 h-5 text-[#FF8C00]" />
            </div>
            <h3 className="font-medium text-[#F5E8D8] mb-1 group-hover:text-[#FF8C00] transition-colors">
              {suggestion.title}
            </h3>
            <p className="text-xs text-[#888888]">
              {suggestion.description}
            </p>
          </motion.button>
        ))}
      </motion.div>
      
      {/* Agent Logs Preview */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
        className="mt-12 w-full max-w-2xl"
      >
        <AgentLogCard isProcessing={false}>
          <div className="text-[#888888]/60 font-mono text-xs">
            <span className="text-[#FF8C00]/40">{'>'}</span> Ghost standing by...
            <span className="animate-typing-cursor ml-1">_</span>
          </div>
        </AgentLogCard>
      </motion.div>
    </div>
  )
}
