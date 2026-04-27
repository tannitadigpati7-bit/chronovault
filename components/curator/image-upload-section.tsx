'use client'

import { useState, useCallback } from 'react'
import { Upload, Image as ImageIcon, Loader } from 'lucide-react'

interface ImageUploadSectionProps {
  onImageSelected: (file: File, preview: string) => void
  isAnalyzing?: boolean
}

export function ImageUploadSection({ onImageSelected, isAnalyzing }: ImageUploadSectionProps) {
  const [isDragActive, setIsDragActive] = useState(false)
  const [preview, setPreview] = useState<string | null>(null)

  const handleFile = useCallback(
    (file: File) => {
      if (!file.type.startsWith('image/')) {
        alert('Please select an image file')
        return
      }

      const reader = new FileReader()
      reader.onload = (e) => {
        const result = e.target?.result as string
        setPreview(result)
        onImageSelected(file, result)
      }
      reader.readAsDataURL(file)
    },
    [onImageSelected]
  )

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setIsDragActive(true)
    } else if (e.type === 'dragleave') {
      setIsDragActive(false)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragActive(false)

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0])
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0])
    }
  }

  return (
    <div className="w-full">
      <label
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        className={`
          relative flex flex-col items-center justify-center w-full p-8 border-2 border-dashed rounded-lg cursor-pointer
          transition-all duration-200
          ${
            isDragActive
              ? 'border-[#FF8C00] bg-[#FF8C00]/5'
              : 'border-[#444444] bg-[#1a1a1a] hover:border-[#FF8C00]'
          }
          ${isAnalyzing ? 'opacity-50 cursor-not-allowed' : ''}
        `}
      >
        {preview ? (
          <div className="flex flex-col items-center gap-3">
            <div className="relative w-20 h-20 rounded-lg overflow-hidden border border-[#FF8C00]">
              <img src={preview} alt="Preview" className="w-full h-full object-cover" />
            </div>
            <p className="text-sm text-[#F5E8D8]">
              {isAnalyzing ? 'Ghost is analyzing your image...' : 'Image ready for analysis'}
            </p>
            {isAnalyzing && <Loader className="w-4 h-4 text-[#FF8C00] animate-spin" />}
          </div>
        ) : (
          <div className="flex flex-col items-center gap-2">
            {isAnalyzing ? (
              <Loader className="w-8 h-8 text-[#FF8C00] animate-spin" />
            ) : (
              <>
                <Upload className="w-8 h-8 text-[#FF8C00]" />
                <div className="text-center">
                  <p className="text-sm font-medium text-[#F5E8D8]">
                    Drag your artifact image here
                  </p>
                  <p className="text-xs text-[#999999]">or click to browse</p>
                </div>
              </>
            )}
          </div>
        )}

        <input
          type="file"
          accept="image/*"
          onChange={handleChange}
          disabled={isAnalyzing}
          className="hidden"
        />
      </label>

      <p className="text-xs text-[#666666] mt-3">
        Upload a photo of your artifact, tradition, or heirloom. Ghost will analyze it and ask you
        relevant questions to understand its heritage significance.
      </p>
    </div>
  )
}
