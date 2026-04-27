'use client'

import { useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Upload, X, Image as ImageIcon, Mic, Video, Check } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'

interface MediaFile {
  url: string
  pathname: string
  type: 'image' | 'audio' | 'video'
}

interface MediaUploaderProps {
  primaryImageUrl: string
  mediaFiles: MediaFile[]
  onPrimaryImageChange: (url: string) => void
  onMediaFilesChange: (files: MediaFile[]) => void
}

export function MediaUploader({ 
  primaryImageUrl, 
  mediaFiles, 
  onPrimaryImageChange, 
  onMediaFilesChange 
}: MediaUploaderProps) {
  const [isUploading, setIsUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const primaryInputRef = useRef<HTMLInputElement>(null)
  const additionalInputRef = useRef<HTMLInputElement>(null)
  
  const handlePrimaryUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    
    setIsUploading(true)
    setUploadProgress(0)
    
    try {
      const formData = new FormData()
      formData.append('file', file)
      
      // Simulate progress
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => Math.min(prev + 10, 90))
      }, 200)
      
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData
      })
      
      clearInterval(progressInterval)
      
      if (!response.ok) throw new Error('Upload failed')
      
      const { url } = await response.json()
      onPrimaryImageChange(url)
      setUploadProgress(100)
    } catch (error) {
      console.error('Upload error:', error)
    } finally {
      setIsUploading(false)
      setUploadProgress(0)
    }
  }
  
  const handleAdditionalUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files) return
    
    setIsUploading(true)
    
    try {
      const uploadedFiles: MediaFile[] = []
      
      for (const file of Array.from(files)) {
        const formData = new FormData()
        formData.append('file', file)
        
        const response = await fetch('/api/upload', {
          method: 'POST',
          body: formData
        })
        
        if (!response.ok) continue
        
        const { url, pathname } = await response.json()
        
        let type: 'image' | 'audio' | 'video' = 'image'
        if (file.type.startsWith('audio/')) type = 'audio'
        else if (file.type.startsWith('video/')) type = 'video'
        
        uploadedFiles.push({ url, pathname, type })
      }
      
      onMediaFilesChange([...mediaFiles, ...uploadedFiles])
    } catch (error) {
      console.error('Upload error:', error)
    } finally {
      setIsUploading(false)
    }
  }
  
  const removeMediaFile = (index: number) => {
    onMediaFilesChange(mediaFiles.filter((_, i) => i !== index))
  }
  
  return (
    <div className="space-y-8">
      {/* Primary Image */}
      <div>
        <Label>Primary Image</Label>
        <p className="text-sm text-muted-foreground mt-1 mb-3">
          This will be the main image shown in the gallery
        </p>
        
        <input
          ref={primaryInputRef}
          type="file"
          accept="image/*"
          onChange={handlePrimaryUpload}
          className="hidden"
        />
        
        {primaryImageUrl ? (
          <div className="relative aspect-video max-w-md rounded-xl overflow-hidden border border-border/50 group">
            <img
              src={primaryImageUrl}
              alt="Primary"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4">
              <Button
                variant="secondary"
                size="sm"
                onClick={() => primaryInputRef.current?.click()}
              >
                Change
              </Button>
              <Button
                variant="destructive"
                size="sm"
                onClick={() => onPrimaryImageChange('')}
              >
                Remove
              </Button>
            </div>
            <div className="absolute top-2 right-2 p-1.5 bg-emerald-500 rounded-full">
              <Check className="w-4 h-4 text-white" />
            </div>
          </div>
        ) : (
          <button
            onClick={() => primaryInputRef.current?.click()}
            disabled={isUploading}
            className="w-full max-w-md aspect-video rounded-xl border-2 border-dashed border-border hover:border-primary/50 transition-colors flex flex-col items-center justify-center gap-4 bg-muted/30"
          >
            {isUploading ? (
              <>
                <div className="w-16 h-16 rounded-full border-4 border-primary/20 border-t-primary animate-spin" />
                <span className="text-sm text-muted-foreground">{uploadProgress}%</span>
              </>
            ) : (
              <>
                <div className="p-4 bg-primary/10 rounded-full">
                  <ImageIcon className="w-8 h-8 text-primary" />
                </div>
                <div className="text-center">
                  <p className="font-medium">Click to upload</p>
                  <p className="text-sm text-muted-foreground">or drag and drop</p>
                </div>
              </>
            )}
          </button>
        )}
      </div>
      
      {/* Additional Media */}
      <div>
        <Label>Additional Media</Label>
        <p className="text-sm text-muted-foreground mt-1 mb-3">
          Add more images, audio recordings, or videos to tell the complete story
        </p>
        
        <input
          ref={additionalInputRef}
          type="file"
          accept="image/*,audio/*,video/*"
          multiple
          onChange={handleAdditionalUpload}
          className="hidden"
        />
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {/* Existing media files */}
          <AnimatePresence>
            {mediaFiles.map((file, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className="relative aspect-square rounded-xl overflow-hidden border border-border/50 group"
              >
                {file.type === 'image' ? (
                  <img src={file.url} alt="" className="w-full h-full object-cover" />
                ) : file.type === 'audio' ? (
                  <div className="w-full h-full bg-gradient-to-br from-primary/10 to-accent/10 flex items-center justify-center">
                    <Mic className="w-8 h-8 text-primary" />
                  </div>
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-primary/10 to-accent/10 flex items-center justify-center">
                    <Video className="w-8 h-8 text-primary" />
                  </div>
                )}
                <button
                  onClick={() => removeMediaFile(index)}
                  className="absolute top-2 right-2 p-1.5 bg-destructive rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <X className="w-4 h-4 text-white" />
                </button>
              </motion.div>
            ))}
          </AnimatePresence>
          
          {/* Add more button */}
          <button
            onClick={() => additionalInputRef.current?.click()}
            disabled={isUploading}
            className="aspect-square rounded-xl border-2 border-dashed border-border hover:border-primary/50 transition-colors flex flex-col items-center justify-center gap-2 bg-muted/30"
          >
            <Upload className="w-6 h-6 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">Add more</span>
          </button>
        </div>
        
        {/* Media type hints */}
        <div className="flex items-center gap-6 mt-4 text-sm text-muted-foreground">
          <span className="flex items-center gap-1.5">
            <ImageIcon className="w-4 h-4" /> Images
          </span>
          <span className="flex items-center gap-1.5">
            <Mic className="w-4 h-4" /> Audio
          </span>
          <span className="flex items-center gap-1.5">
            <Video className="w-4 h-4" /> Video
          </span>
        </div>
      </div>
    </div>
  )
}
