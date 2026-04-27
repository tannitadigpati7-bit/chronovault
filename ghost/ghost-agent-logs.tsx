'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

// Thinking messages that Ghost displays while processing
const thinkingMessages = [
  "Analyzing temporal significance...",
  "Cross-referencing cultural databases...",
  "Mapping heritage connections...",
  "Calculating preservation urgency...",
  "Scanning for related traditions...",
  "Decoding visual artifacts...",
  "Consulting historical archives...",
  "Estimating future museum value...",
  "Processing cultural markers...",
  "Identifying regional origins...",
  "Comparing with known relics...",
  "Generating time capsule note...",
  "Evaluating intangible significance...",
  "Tracing generational patterns...",
  "Assessing rarity index...",
]

interface GhostAgentLogsProps {
  isProcessing?: boolean
  customMessages?: string[]
  className?: string
}

export function GhostAgentLogs({ 
  isProcessing = false, 
  customMessages,
  className = "" 
}: GhostAgentLogsProps) {
  const [logs, setLogs] = useState<{ id: number; message: string }[]>([])
  const [logId, setLogId] = useState(0)

  const messages = customMessages || thinkingMessages

  useEffect(() => {
    if (!isProcessing) {
      setLogs([])
      return
    }

    // Add new log every 1.5 seconds
    const interval = setInterval(() => {
      const randomMessage = messages[Math.floor(Math.random() * messages.length)]
      setLogId(prev => prev + 1)
      setLogs(prev => {
        const newLogs = [...prev, { id: logId, message: randomMessage }]
        // Keep only last 4 logs
        return newLogs.slice(-4)
      })
    }, 1500)

    // Add initial log immediately
    const initialMessage = messages[Math.floor(Math.random() * messages.length)]
    setLogs([{ id: 0, message: initialMessage }])

    return () => clearInterval(interval)
  }, [isProcessing, messages, logId])

  // Remove old logs after they fade out
  useEffect(() => {
    if (logs.length === 0) return

    const timeout = setTimeout(() => {
      setLogs(prev => prev.slice(1))
    }, 4000)

    return () => clearTimeout(timeout)
  }, [logs])

  return (
    <div className={`font-mono text-xs space-y-1 ${className}`}>
      <AnimatePresence mode="popLayout">
        {logs.map((log) => (
          <motion.div
            key={log.id}
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 0.4, y: 0 }}
            exit={{ opacity: 0, y: -5 }}
            transition={{ duration: 0.5 }}
            className="flex items-center gap-2 text-[#FF8C00]/40"
          >
            <span className="inline-block w-1.5 h-1.5 rounded-full bg-[#FF8C00]/40 animate-pulse" />
            <span className="tracking-wide">{log.message}</span>
          </motion.div>
        ))}
      </AnimatePresence>
      
      {isProcessing && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.3 }}
          className="flex items-center gap-2 text-[#FF8C00]/30 mt-2"
        >
          <span className="inline-flex gap-1">
            <span className="w-1 h-1 rounded-full bg-[#FF8C00] animate-bounce" style={{ animationDelay: '0ms' }} />
            <span className="w-1 h-1 rounded-full bg-[#FF8C00] animate-bounce" style={{ animationDelay: '150ms' }} />
            <span className="w-1 h-1 rounded-full bg-[#FF8C00] animate-bounce" style={{ animationDelay: '300ms' }} />
          </span>
          <span className="animate-typing-cursor">_</span>
        </motion.div>
      )}
    </div>
  )
}

// Standalone thinking indicator
export function GhostThinking({ className = "" }: { className?: string }) {
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <div className="flex items-center gap-1">
        <motion.span
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 0.6, repeat: Infinity, delay: 0 }}
          className="w-2 h-2 rounded-full bg-[#FF8C00]"
        />
        <motion.span
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 0.6, repeat: Infinity, delay: 0.2 }}
          className="w-2 h-2 rounded-full bg-[#FF8C00]"
        />
        <motion.span
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 0.6, repeat: Infinity, delay: 0.4 }}
          className="w-2 h-2 rounded-full bg-[#FF8C00]"
        />
      </div>
      <motion.span
        animate={{ opacity: [0.3, 0.6, 0.3] }}
        transition={{ duration: 2, repeat: Infinity }}
        className="text-xs font-mono text-[#FF8C00]/50 tracking-wider"
      >
        Ghost is thinking...
      </motion.span>
    </div>
  )
}
