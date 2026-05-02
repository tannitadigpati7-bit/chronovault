'use client'

import { motion } from 'framer-motion'
import { UIMessage } from 'ai'
import { User, Ghost } from 'lucide-react'

interface ChatMessageProps {
  message: UIMessage
}

export function ChatMessage({ message }: ChatMessageProps) {
  const isAssistant = message.role === 'assistant'
  
  // Extract text from parts
  const textContent = message.parts
    ?.filter((p): p is { type: 'text'; text: string } => p.type === 'text')
    .map((p) => p.text)
    .join('') || ''
  
  // Check for tool calls
  const toolCalls = message.parts?.filter((p) => p.type === 'tool-invocation') || []
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className={`flex items-start gap-3 ${isAssistant ? '' : 'flex-row-reverse'}`}
    >
      {/* Avatar */}
      {isAssistant ? (
        <GhostMessageAvatar />
      ) : (
        <div className="w-8 h-8 rounded-full bg-[#333333] flex items-center justify-center flex-shrink-0">
          <User className="w-4 h-4 text-[#888888]" />
        </div>
      )}
      
      {/* Message Content */}
      <div className={`flex-1 max-w-[85%] ${isAssistant ? '' : 'flex flex-col items-end'}`}>
        <div
          className={`rounded-2xl px-4 py-3 ${
            isAssistant
              ? 'bg-[#121212] border border-[#333333]/50'
              : 'bg-[#FF8C00] text-[#0A0A0A]'
          }`}
        >
          {/* Tool calls indicator */}
          {toolCalls.length > 0 && isAssistant && (
            <div className="mb-2 pb-2 border-b border-[#333333]">
              <div className="flex items-center gap-2 text-xs text-[#888888] font-mono">
                <motion.span
                  animate={{ opacity: [0.4, 1, 0.4] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                  className="inline-block w-2 h-2 rounded-full bg-[#FF8C00]"
                />
                <span>
                  {toolCalls.length === 1 
                    ? 'Analyzing...'
                    : `Running ${toolCalls.length} operations...`}
                </span>
              </div>
            </div>
          )}
          
          {/* Text content with markdown-like formatting */}
          <div className={`text-sm leading-relaxed ${isAssistant ? 'text-[#F5E8D8]' : 'text-[#0A0A0A]'}`}>
            <MessageContent content={textContent} isAssistant={isAssistant} />
          </div>
        </div>
        
        {/* Timestamp */}
        <span className="text-[10px] text-[#888888] font-mono mt-1 px-1">
          {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </span>
      </div>
    </motion.div>
  )
}

function GhostMessageAvatar() {
  return (
    <div className="w-8 h-8 relative flex-shrink-0">
      <div className="absolute inset-0 bg-[#FF8C00]/20 rounded-full blur-sm" />
      <div className="relative w-full h-full bg-gradient-to-br from-[#F5E8D8] to-[#E5D8C8] rounded-full flex items-center justify-center shadow-[0_0_10px_rgba(255,140,0,0.2)]">
        <Ghost className="w-4 h-4 text-[#0A0A0A]" />
      </div>
    </div>
  )
}

function MessageContent({ content, isAssistant }: { content: string, isAssistant: boolean }) {
  // Simple markdown-like formatting
  const lines = content.split('\n')
  
  return (
    <div className="space-y-2">
      {lines.map((line, i) => {
        // Handle bullet points
        if (line.trim().startsWith('- ') || line.trim().startsWith('• ')) {
          return (
            <div key={i} className="flex items-start gap-2">
              <span className="text-[#FF8C00] mt-1">•</span>
              <span>{line.replace(/^[-•]\s*/, '')}</span>
            </div>
          )
        }
        
        // Handle numbered lists
        const numberedMatch = line.match(/^(\d+)\.\s(.+)/)
        if (numberedMatch) {
          return (
            <div key={i} className="flex items-start gap-2">
              <span className={`font-mono font-medium ${isAssistant ? 'text-[#FF8C00]' : 'text-[#0A0A0A]'}`}>
                {numberedMatch[1]}.
              </span>
              <span>{numberedMatch[2]}</span>
            </div>
          )
        }
        
        // Handle bold text
        const parts = line.split(/\*\*(.+?)\*\*/g)
        if (parts.length > 1) {
          return (
            <p key={i}>
              {parts.map((part, j) => 
                j % 2 === 1 
                  ? <strong key={j} className={`font-semibold ${isAssistant ? 'text-[#FF8C00]' : ''}`}>{part}</strong> 
                  : part
              )}
            </p>
          )
        }
        
        // Handle quotes (Time Capsule Notes)
        if (line.trim().startsWith('"') && line.trim().endsWith('"')) {
          return (
            <blockquote 
              key={i} 
              className={`border-l-2 pl-3 italic ${
                isAssistant 
                  ? 'border-[#FF8C00] text-[#F5E8D8]/80 font-serif' 
                  : 'border-[#0A0A0A]/50 text-[#0A0A0A]/80'
              }`}
            >
              {line}
            </blockquote>
          )
        }
        
        // Handle Time Capsule header
        if (line.toLowerCase().includes('time capsule note') || line.toLowerCase().includes('future significance')) {
          return (
            <div key={i} className="mt-3 pt-3 border-t border-[#333333]">
              <span className="text-[10px] font-mono text-[#FF8C00] uppercase tracking-widest">
                {line}
              </span>
            </div>
          )
        }
        
        // Regular paragraph
        if (line.trim()) {
          return <p key={i}>{line}</p>
        }
        
        return <br key={i} />
      })}
    </div>
  )
}
