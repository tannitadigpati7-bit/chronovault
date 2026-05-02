'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  ChevronRight, ChevronLeft, Upload, X, Sparkles, 
  MapPin, Calendar, Users, Tag, FileText, Save, Send, Ghost
} from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select'
import { CATEGORY_LABELS, CATEGORY_DESCRIPTIONS, RelicCategory } from '@/lib/types'
import { createClient } from '@/lib/supabase/client'
import { MediaUploader } from './media-uploader'
import { AIEnhancer } from './ai-enhancer'
import { FuturisticButton, IconButton } from '@/components/ui/futuristic-button'
import { GhostAgentLogs } from '@/components/ghost/ghost-agent-logs'

interface ContributeFormProps {
  userId: string
}

const steps = [
  { id: 'basics', title: 'Basic Info', icon: FileText },
  { id: 'media', title: 'Media', icon: Upload },
  { id: 'context', title: 'Context', icon: MapPin },
  { id: 'story', title: 'Story', icon: Users },
  { id: 'enhance', title: 'Ghost Analysis', icon: Ghost },
]

export function ContributeForm({ userId }: ContributeFormProps) {
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState(0)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  
  // Form state
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '' as RelicCategory | '',
    subcategory: '',
    tags: [] as string[],
    story: '',
    originRegion: '',
    originCountry: '',
    culturalGroup: '',
    timePeriod: '',
    estimatedEra: '',
    // Media
    primaryImageUrl: '',
    mediaFiles: [] as Array<{ url: string; pathname: string; type: 'image' | 'audio' | 'video' }>,
    // AI-generated
    aiSignificance: '',
    aiCurrentRelevance: '',
    aiFutureImportance: '',
    aiTimeCapsuleNote: '',
    aiPreservationUrgency: 5,
    aiRelatedTraditions: [] as string[],
  })
  
  const [tagInput, setTagInput] = useState('')
  
  const updateFormData = (field: string, value: unknown) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }
  
  const addTag = () => {
    if (tagInput.trim() && !formData.tags.includes(tagInput.trim())) {
      updateFormData('tags', [...formData.tags, tagInput.trim()])
      setTagInput('')
    }
  }
  
  const removeTag = (tag: string) => {
    updateFormData('tags', formData.tags.filter(t => t !== tag))
  }
  
  const nextStep = () => setCurrentStep(prev => Math.min(prev + 1, steps.length - 1))
  const prevStep = () => setCurrentStep(prev => Math.max(prev - 1, 0))
  
  const canProceed = () => {
    switch (currentStep) {
      case 0: return formData.title && formData.category && formData.description
      case 1: return true // Media is optional
      case 2: return true // Context is optional
      case 3: return true // Story is optional
      case 4: return true // AI enhancement is optional
      default: return false
    }
  }
  
  const handleSubmit = async (status: 'draft' | 'published') => {
    setIsSubmitting(true)
    setError(null)
    
    try {
      const supabase = createClient()
      
      // Create the relic
      const { data: relic, error: relicError } = await supabase
        .from('relics')
        .insert({
          user_id: userId,
          title: formData.title,
          description: formData.description,
          category: formData.category,
          subcategory: formData.subcategory || null,
          tags: formData.tags,
          story: formData.story || null,
          origin_region: formData.originRegion || null,
          origin_country: formData.originCountry || null,
          cultural_group: formData.culturalGroup || null,
          time_period: formData.timePeriod || null,
          estimated_era: formData.estimatedEra || null,
          primary_image_url: formData.primaryImageUrl || null,
          ai_significance: formData.aiSignificance || null,
          ai_current_relevance: formData.aiCurrentRelevance || null,
          ai_future_importance: formData.aiFutureImportance || null,
          ai_time_capsule_note: formData.aiTimeCapsuleNote || null,
          ai_preservation_urgency: formData.aiPreservationUrgency,
          ai_related_traditions: formData.aiRelatedTraditions,
          status
        })
        .select()
        .single()
      
      if (relicError) throw relicError
      
      // Add additional media
      if (formData.mediaFiles.length > 0 && relic) {
        const mediaInserts = formData.mediaFiles.map((file, index) => ({
          relic_id: relic.id,
          user_id: userId,
          media_type: file.type,
          blob_url: file.url,
          blob_pathname: file.pathname,
          display_order: index
        }))
        
        await supabase.from('relic_media').insert(mediaInserts)
      }
      
      // Create QR codes for the relic
      if (relic && status === 'published') {
        const qrCodes = [
          { relic_id: relic.id, code: `view_${relic.id}`, qr_type: 'view' },
          { relic_id: relic.id, code: `ar_${relic.id}`, qr_type: 'ar' },
          { relic_id: relic.id, code: `contribute_${relic.id}`, qr_type: 'contribute' }
        ]
        
        await supabase.from('relic_qr_codes').insert(qrCodes)
      }
      
      // Redirect to the relic page or dashboard
      router.push(status === 'published' ? `/relic/${relic.id}` : '/dashboard')
      
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to save relic'
      setError(errorMessage)
    } finally {
      setIsSubmitting(false)
    }
  }
  
  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Publishing Notice Banner */}
      <div className="mb-6 p-4 bg-[#FF8C00]/10 border border-[#FF8C00]/30 rounded-xl">
        <div className="flex items-start gap-3">
          <div className="w-8 h-8 rounded-full bg-[#FF8C00]/20 flex items-center justify-center flex-shrink-0 mt-0.5">
            <Sparkles className="w-4 h-4 text-[#FF8C00]" />
          </div>
          <div>
            <p className="text-sm font-medium text-[#F5E8D8]">Publishing Notice</p>
            <p className="text-xs text-[#888888] mt-1">
              Once you publish, your relic will be reviewed by Ghost (our AI curator) to verify its heritage value. 
              Approved submissions will be <span className="text-[#FF8C00]">live on the main archive</span> for everyone to explore and learn from.
              You can save as draft anytime to continue later.
            </p>
          </div>
        </div>
      </div>

      {/* Header */}
      <div className="text-center mb-8">
        <span className="text-[10px] font-mono text-[#FF8C00] uppercase tracking-widest">
          Chrono-Vault Submission
        </span>
        <h1 className="text-3xl font-bold text-[#F5E8D8] mt-2 mb-2">Contribute to the Archive</h1>
        <p className="text-[#888888]">
          Preserve your heritage for future generations
        </p>
      </div>
      
      {/* Progress Steps */}
      <div className="flex items-center justify-center gap-2 mb-8 overflow-x-auto pb-2">
        {steps.map((step, index) => {
          const Icon = step.icon
          const isActive = index === currentStep
          const isCompleted = index < currentStep
          
          return (
            <motion.button
              key={step.id}
              onClick={() => setCurrentStep(index)}
              disabled={index > currentStep + 1}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
                isActive 
                  ? 'bg-[#FF8C00] text-[#0A0A0A] shadow-[0_0_15px_rgba(255,140,0,0.3)]' 
                  : isCompleted 
                    ? 'bg-[#FF8C00]/20 text-[#FF8C00] border border-[#FF8C00]/30' 
                    : 'bg-[#1A1A1A] text-[#888888] border border-[#333333]'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span className="text-sm font-medium hidden sm:inline">{step.title}</span>
            </motion.button>
          )
        })}
      </div>
      
      {/* Form Content */}
      <div className="glass-amber rounded-xl p-6 md:p-8">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            {/* Step 1: Basics */}
            {currentStep === 0 && (
              <div className="space-y-6">
                <div>
                  <Label htmlFor="title" className="text-[#F5E8D8]">Title *</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => updateFormData('title', e.target.value)}
                    placeholder="What is this relic called?"
                    className="mt-1.5 bg-[#121212] border-[#333333] text-[#F5E8D8] placeholder:text-[#888888] focus:border-[#FF8C00]/50"
                  />
                </div>
                
                <div>
                  <Label htmlFor="category" className="text-[#F5E8D8]">Category *</Label>
                  <Select
                    value={formData.category}
                    onValueChange={(value) => updateFormData('category', value)}
                  >
                    <SelectTrigger className="mt-1.5 bg-[#121212] border-[#333333] text-[#F5E8D8]">
                      <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                    <SelectContent className="bg-[#121212] border-[#333333]">
                      {Object.entries(CATEGORY_LABELS).map(([value, label]) => (
                        <SelectItem key={value} value={value} className="text-[#F5E8D8] focus:bg-[#1A1A1A] focus:text-[#FF8C00]">
                          <div>
                            <div className="font-medium">{label}</div>
                            <div className="text-xs text-[#888888]">
                              {CATEGORY_DESCRIPTIONS[value as RelicCategory]}
                            </div>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label htmlFor="description" className="text-[#F5E8D8]">Description *</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => updateFormData('description', e.target.value)}
                    placeholder="Describe this relic - what is it, what does it look like, what is it made of?"
                    className="mt-1.5 min-h-[120px] bg-[#121212] border-[#333333] text-[#F5E8D8] placeholder:text-[#888888] focus:border-[#FF8C00]/50"
                  />
                </div>
                
                <div>
                  <Label className="text-[#F5E8D8]">Tags</Label>
                  <div className="flex gap-2 mt-1.5">
                    <Input
                      value={tagInput}
                      onChange={(e) => setTagInput(e.target.value)}
                      placeholder="Add a tag"
                      onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                      className="bg-[#121212] border-[#333333] text-[#F5E8D8] placeholder:text-[#888888]"
                    />
                    <IconButton onClick={addTag} variant="amber">
                      <Tag className="w-4 h-4" />
                    </IconButton>
                  </div>
                  {formData.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-3">
                      {formData.tags.map(tag => (
                        <span
                          key={tag}
                          className="inline-flex items-center gap-1 px-3 py-1 bg-[#1A1A1A] border border-[#333333] rounded-full text-sm text-[#F5E8D8]"
                        >
                          {tag}
                          <button onClick={() => removeTag(tag)} className="hover:text-red-400">
                            <X className="w-3 h-3" />
                          </button>
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}
            
            {/* Step 2: Media */}
            {currentStep === 1 && (
              <MediaUploader
                primaryImageUrl={formData.primaryImageUrl}
                mediaFiles={formData.mediaFiles}
                onPrimaryImageChange={(url) => updateFormData('primaryImageUrl', url)}
                onMediaFilesChange={(files) => updateFormData('mediaFiles', files)}
              />
            )}
            
            {/* Step 3: Context */}
            {currentStep === 2 && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="originCountry" className="text-[#F5E8D8]">Country of Origin</Label>
                    <div className="relative mt-1.5">
                      <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#FF8C00]" />
                      <Input
                        id="originCountry"
                        value={formData.originCountry}
                        onChange={(e) => updateFormData('originCountry', e.target.value)}
                        placeholder="e.g., India, Japan, Mexico"
                        className="pl-10 bg-[#121212] border-[#333333] text-[#F5E8D8] placeholder:text-[#888888]"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <Label htmlFor="originRegion" className="text-[#F5E8D8]">Region</Label>
                    <Input
                      id="originRegion"
                      value={formData.originRegion}
                      onChange={(e) => updateFormData('originRegion', e.target.value)}
                      placeholder="e.g., Rajasthan, Kyoto, Oaxaca"
                      className="mt-1.5 bg-[#121212] border-[#333333] text-[#F5E8D8] placeholder:text-[#888888]"
                    />
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="culturalGroup" className="text-[#F5E8D8]">Cultural Group</Label>
                  <div className="relative mt-1.5">
                    <Users className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#FF8C00]" />
                    <Input
                      id="culturalGroup"
                      value={formData.culturalGroup}
                      onChange={(e) => updateFormData('culturalGroup', e.target.value)}
                      placeholder="e.g., Rajput, Maori, Navajo"
                      className="pl-10 bg-[#121212] border-[#333333] text-[#F5E8D8] placeholder:text-[#888888]"
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="timePeriod" className="text-[#F5E8D8]">Time Period</Label>
                    <div className="relative mt-1.5">
                      <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#FF8C00]" />
                      <Input
                        id="timePeriod"
                        value={formData.timePeriod}
                        onChange={(e) => updateFormData('timePeriod', e.target.value)}
                        placeholder="e.g., 19th Century, 1920s"
                        className="pl-10 bg-[#121212] border-[#333333] text-[#F5E8D8] placeholder:text-[#888888]"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <Label htmlFor="estimatedEra" className="text-[#F5E8D8]">Era</Label>
                    <Input
                      id="estimatedEra"
                      value={formData.estimatedEra}
                      onChange={(e) => updateFormData('estimatedEra', e.target.value)}
                      placeholder="e.g., Colonial, Pre-industrial"
                      className="mt-1.5 bg-[#121212] border-[#333333] text-[#F5E8D8] placeholder:text-[#888888]"
                    />
                  </div>
                </div>
              </div>
            )}
            
            {/* Step 4: Story */}
            {currentStep === 3 && (
              <div className="space-y-6">
                <div>
                  <Label htmlFor="story" className="text-[#F5E8D8]">The Story</Label>
                  <p className="text-sm text-[#888888] mt-1 mb-3">
                    Share the story behind this relic. How did it come to you? What memories does it hold? 
                    Why is it meaningful to your heritage?
                  </p>
                  <Textarea
                    id="story"
                    value={formData.story}
                    onChange={(e) => updateFormData('story', e.target.value)}
                    placeholder="Tell us the story..."
                    className="min-h-[200px] bg-[#121212] border-[#333333] text-[#F5E8D8] placeholder:text-[#888888] focus:border-[#FF8C00]/50"
                  />
                </div>
              </div>
            )}
            
            {/* Step 5: AI Enhancement */}
            {currentStep === 4 && (
              <div className="space-y-6">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#F5E8D8] to-[#E5D8C8] flex items-center justify-center shadow-[0_0_20px_rgba(255,140,0,0.3)]">
                    <Ghost className="w-6 h-6 text-[#0A0A0A]" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-[#F5E8D8]">Ghost Analysis</h3>
                    <p className="text-sm text-[#888888]">Let Ghost analyze and enhance your relic submission</p>
                  </div>
                </div>
                
                <AIEnhancer
                  formData={formData}
                  onEnhance={(aiData) => {
                    setFormData((prev) => ({ ...prev, ...aiData }) as typeof formData)
                  }}
                />
              </div>
            )}
          </motion.div>
        </AnimatePresence>
        
        {/* Error Message */}
        {error && (
          <div className="mt-6 p-4 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400 text-sm">
            {error}
          </div>
        )}
        
        {/* Navigation */}
        <div className="flex items-center justify-between mt-8 pt-6 border-t border-[#333333]">
          <FuturisticButton
            variant="ghost"
            onClick={prevStep}
            disabled={currentStep === 0}
          >
            <ChevronLeft className="w-4 h-4 mr-2" />
            Previous
          </FuturisticButton>
          
          <div className="flex gap-3">
            {currentStep === steps.length - 1 ? (
              <>
                <FuturisticButton
                  variant="secondary"
                  onClick={() => handleSubmit('draft')}
                  disabled={isSubmitting}
                >
                  <Save className="w-4 h-4 mr-2" />
                  Save Draft
                </FuturisticButton>
                <FuturisticButton
                  variant="primary"
                  onClick={() => handleSubmit('published')}
                  disabled={isSubmitting || !canProceed()}
                >
                  <Send className="w-4 h-4 mr-2" />
                  {isSubmitting ? 'Publishing...' : 'Publish'}
                </FuturisticButton>
              </>
            ) : (
              <FuturisticButton variant="amber" onClick={nextStep} disabled={!canProceed()}>
                Next
                <ChevronRight className="w-4 h-4 ml-2" />
              </FuturisticButton>
            )}
          </div>
        </div>
      </div>
      
      {/* Ghost Agent Logs */}
      <div className="mt-6 glass rounded-xl p-4">
        <div className="flex items-center gap-2 mb-3">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full rounded-full bg-[#444444]" />
          </span>
          <span className="text-[10px] font-mono text-[#888888] uppercase tracking-widest">
            Ghost Agent Logs
          </span>
        </div>
        <div className="font-mono text-xs text-[#888888]/60">
          <span className="text-[#FF8C00]/40">{'>'}</span> Awaiting submission data...
          <span className="animate-typing-cursor ml-1">_</span>
        </div>
      </div>
    </div>
  )
}
