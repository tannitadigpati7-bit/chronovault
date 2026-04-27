'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Sparkles, RefreshCw, Check, Clock, Rocket, AlertTriangle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Slider } from '@/components/ui/slider'

type RelicFormData = {
  title: string
  description: string
  category: string
  story: string
  culturalGroup: string
  originCountry: string
  aiSignificance: string
  aiCurrentRelevance: string
  aiFutureImportance: string
  aiTimeCapsuleNote: string
  aiPreservationUrgency: number
  aiRelatedTraditions: string[]
}

interface AIEnhancerProps {
  formData: RelicFormData
  onEnhance: (aiData: Partial<RelicFormData>) => void
}

export function AIEnhancer({ formData, onEnhance }: AIEnhancerProps) {
  const [isEnhancing, setIsEnhancing] = useState(false)
  const [hasEnhanced, setHasEnhanced] = useState(false)
  
  const handleEnhance = async () => {
    setIsEnhancing(true)
    
    try {
      const response = await fetch('/api/enhance-relic', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: formData.title,
          description: formData.description,
          category: formData.category,
          story: formData.story,
          culturalGroup: formData.culturalGroup,
          originCountry: formData.originCountry
        })
      })
      
      if (!response.ok) throw new Error('Enhancement failed')
      
      const aiData = await response.json()
      onEnhance(aiData)
      setHasEnhanced(true)
    } catch (error) {
      console.error('Enhancement error:', error)
    } finally {
      setIsEnhancing(false)
    }
  }
  
  const urgencyLevel = formData.aiPreservationUrgency >= 8 
    ? { label: 'Critical', color: 'text-red-400', bgColor: 'bg-red-500/10' }
    : formData.aiPreservationUrgency >= 5 
      ? { label: 'Moderate', color: 'text-amber-400', bgColor: 'bg-amber-500/10' }
      : { label: 'Stable', color: 'text-emerald-400', bgColor: 'bg-emerald-500/10' }
  
  return (
    <div className="space-y-8">
      {/* Enhancement Button */}
      <div className="text-center py-8 px-4 bg-gradient-to-br from-primary/10 via-accent/5 to-primary/10 rounded-xl border border-primary/20">
        <motion.div
          animate={isEnhancing ? { rotate: 360 } : {}}
          transition={{ duration: 2, repeat: isEnhancing ? Infinity : 0, ease: 'linear' }}
          className="w-16 h-16 mx-auto mb-4 rounded-full bg-primary/20 flex items-center justify-center"
        >
          <Sparkles className="w-8 h-8 text-primary" />
        </motion.div>
        
        <h3 className="text-xl font-semibold mb-2">AI Enhancement</h3>
        <p className="text-muted-foreground mb-6 max-w-md mx-auto">
          Let our curator AI analyze your relic and generate insights about its 
          cultural significance, current relevance, and future importance.
        </p>
        
        <Button 
          onClick={handleEnhance} 
          disabled={isEnhancing}
          size="lg"
        >
          {isEnhancing ? (
            <>
              <RefreshCw className="w-5 h-5 mr-2 animate-spin" />
              Analyzing...
            </>
          ) : hasEnhanced ? (
            <>
              <RefreshCw className="w-5 h-5 mr-2" />
              Re-analyze
            </>
          ) : (
            <>
              <Sparkles className="w-5 h-5 mr-2" />
              Enhance with AI
            </>
          )}
        </Button>
      </div>
      
      {/* AI-Generated Fields */}
      <div className="space-y-6">
        {/* Significance */}
        <div>
          <Label className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-primary" />
            Cultural Significance
          </Label>
          <Textarea
            value={formData.aiSignificance}
            onChange={(e) => onEnhance({ aiSignificance: e.target.value })}
            placeholder="AI will generate an analysis of the cultural significance..."
            className="mt-1.5 min-h-[100px]"
          />
        </div>
        
        {/* Current Relevance */}
        <div>
          <Label className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-muted-foreground" />
            Today&apos;s Relevance
          </Label>
          <Textarea
            value={formData.aiCurrentRelevance}
            onChange={(e) => onEnhance({ aiCurrentRelevance: e.target.value })}
            placeholder="How does this connect to modern life?"
            className="mt-1.5 min-h-[80px]"
          />
        </div>
        
        {/* Future Importance */}
        <div>
          <Label className="flex items-center gap-2">
            <Rocket className="w-4 h-4 text-primary" />
            Future Importance (50-100 Years)
          </Label>
          <Textarea
            value={formData.aiFutureImportance}
            onChange={(e) => onEnhance({ aiFutureImportance: e.target.value })}
            placeholder="Why will this matter to future generations?"
            className="mt-1.5 min-h-[80px]"
          />
        </div>
        
        {/* Time Capsule Note */}
        <div>
          <Label className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-primary" />
            Time Capsule Note
          </Label>
          <p className="text-sm text-muted-foreground mt-1 mb-2">
            A poetic statement for future generations
          </p>
          <Textarea
            value={formData.aiTimeCapsuleNote}
            onChange={(e) => onEnhance({ aiTimeCapsuleNote: e.target.value })}
            placeholder="&quot;In an age when memories fade to digital dust...&quot;"
            className="min-h-[80px] italic"
          />
        </div>
        
        {/* Preservation Urgency */}
        <div>
          <Label className="flex items-center gap-2">
            <AlertTriangle className={`w-4 h-4 ${urgencyLevel.color}`} />
            Preservation Urgency
          </Label>
          <div className="mt-4 space-y-4">
            <Slider
              value={[formData.aiPreservationUrgency]}
              onValueChange={([value]) => onEnhance({ aiPreservationUrgency: value })}
              min={1}
              max={10}
              step={1}
              className="w-full"
            />
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Stable</span>
              <span className={`px-3 py-1 rounded-full font-medium ${urgencyLevel.bgColor} ${urgencyLevel.color}`}>
                {urgencyLevel.label}: {formData.aiPreservationUrgency}/10
              </span>
              <span className="text-muted-foreground">Critical</span>
            </div>
          </div>
        </div>
      </div>
      
      {hasEnhanced && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-2 p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-lg text-emerald-400"
        >
          <Check className="w-5 h-5" />
          <span>AI enhancement complete. You can edit any of the generated content above.</span>
        </motion.div>
      )}
    </div>
  )
}
