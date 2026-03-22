'use client'

import { useCallback, useState } from 'react'
import { Upload, FileText, X } from 'lucide-react'
import { cn } from '@/lib/utils'

interface FileUploadProps {
  onFileSelect: (file: File) => void
  disabled?: boolean
  acceptedTypes?: string[]
}

export function FileUpload({ 
  onFileSelect, 
  disabled = false,
  acceptedTypes = ['.pdf', '.txt', '.docx']
}: FileUploadProps) {
  const [isDragging, setIsDragging] = useState(false)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    if (!disabled) {
      setIsDragging(true)
    }
  }, [disabled])

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
  }, [])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    
    if (disabled) return

    const file = e.dataTransfer.files[0]
    if (file) {
      setSelectedFile(file)
      onFileSelect(file)
    }
  }, [disabled, onFileSelect])

  const handleFileInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setSelectedFile(file)
      onFileSelect(file)
    }
  }, [onFileSelect])

  const clearFile = useCallback(() => {
    setSelectedFile(null)
  }, [])

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B'
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB'
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB'
  }

  if (selectedFile) {
    return (
      <div className="border border-border rounded-lg p-6 bg-card">
        <div className="flex items-center gap-4">
          <div className="flex-shrink-0 w-12 h-12 bg-secondary rounded-lg flex items-center justify-center">
            <FileText className="w-6 h-6 text-accent" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-foreground font-medium truncate">{selectedFile.name}</p>
            <p className="text-sm text-muted-foreground">{formatFileSize(selectedFile.size)}</p>
          </div>
          {!disabled && (
            <button
              onClick={clearFile}
              className="flex-shrink-0 p-2 hover:bg-secondary rounded-md transition-colors"
              aria-label="Remove file"
            >
              <X className="w-5 h-5 text-muted-foreground" />
            </button>
          )}
        </div>
      </div>
    )
  }

  return (
    <label
      className={cn(
        "relative flex flex-col items-center justify-center w-full min-h-[200px] border-2 border-dashed rounded-lg cursor-pointer transition-all duration-200",
        isDragging 
          ? "border-accent bg-accent/5" 
          : "border-border hover:border-muted-foreground hover:bg-secondary/50",
        disabled && "opacity-50 cursor-not-allowed"
      )}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <div className="flex flex-col items-center justify-center py-8 px-4">
        <div className={cn(
          "w-14 h-14 rounded-full flex items-center justify-center mb-4 transition-colors",
          isDragging ? "bg-accent/20" : "bg-secondary"
        )}>
          <Upload className={cn(
            "w-7 h-7 transition-colors",
            isDragging ? "text-accent" : "text-muted-foreground"
          )} />
        </div>
        <p className="text-foreground font-medium mb-1">
          {isDragging ? 'Drop your file here' : 'Upload your contract'}
        </p>
        <p className="text-sm text-muted-foreground text-center mb-3">
          Drag and drop or click to browse
        </p>
        <p className="text-xs text-muted-foreground">
          Supports PDF, TXT, and DOCX files
        </p>
      </div>
      <input
        type="file"
        className="hidden"
        accept={acceptedTypes.join(',')}
        onChange={handleFileInput}
        disabled={disabled}
      />
    </label>
  )
}
