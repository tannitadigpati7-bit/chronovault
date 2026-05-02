'use client'

import { useState } from 'react'
import { generateText } from 'ai'

interface ImageAnalyzerProps {
  imageBase64: string
  onAnalysisComplete: (questions: string[]) => void
  isLoading?: boolean
}

export async function analyzeImageWithGhost(imageBase64: string): Promise<string> {
  try {
    const response = await fetch('/api/analyze-image', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ image: imageBase64 }),
    })

    if (!response.ok) throw new Error('Analysis failed')
    const data = await response.json()
    return data.analysis
  } catch (error) {
    console.error('[v0] Image analysis error:', error)
    throw error
  }
}

export function GhostImageAnalyzer({ imageBase64, onAnalysisComplete, isLoading }: ImageAnalyzerProps) {
  return null
}
