import { useState, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { UploadCloud, X, Loader2 } from 'lucide-react'
import { toast } from 'sonner'
import { authService } from '@/services/authService'

interface ImageUploadProps {
  value: string | undefined
  onChange: (url: string) => void
  disabled?: boolean
  className?: string
}

export function ImageUpload({ value, onChange, disabled, className }: ImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  
  // Set initial preview if value exists
  const previewUrl = value || ''

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Verify file type is an image
    if (!file.type.startsWith('image/')) {
      toast.error('Please select a valid image file.')
      return
    }
    
    // Check file size (e.g., max 5MB)
    if (file.size > 100 * 1024 * 1024) {
      toast.error('Image size must be less than 100MB.')
      return
    }

    setIsUploading(true)
    
    try {
      const formData = new FormData()
      formData.append('file', file)

      const token = authService.getAccessToken()
      const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8080/api'
      
      const response = await fetch(`${API_BASE_URL}/upload`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      })
      
      if (!response.ok) {
        throw new Error('Upload failed')
      }
      
      const data = await response.json()
      if (data.url) {
        onChange(data.url)
        toast.success('Image uploaded successfully')
      } else {
        throw new Error('No URL returned')
      }
    } catch (err: any) {
      toast.error(err.message || 'Failed to upload image')
    } finally {
      setIsUploading(false)
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
    }
  }

  const removeImage = () => {
    onChange('')
  }

  return (
    <div className={`space-y-4 ${className || ''}`}>
      {previewUrl ? (
        <div className="relative rounded-md overflow-hidden border border-border group h-48 bg-muted">
          <img src={previewUrl} alt="Preview" className="w-full h-full object-cover" />
          {!disabled && (
            <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
              <Button type="button" variant="destructive" size="sm" onClick={removeImage}>
                <X className="h-4 w-4 mr-2" /> Remove Image
              </Button>
            </div>
          )}
        </div>
      ) : (
        <div 
          className={`border-2 border-dashed border-border rounded-md p-6 flex flex-col items-center justify-center h-48 bg-muted/50 transition-colors ${!disabled ? 'hover:bg-muted cursor-pointer' : 'opacity-50 cursor-not-allowed'}`}
          onClick={() => !disabled && !isUploading && fileInputRef.current?.click()}
        >
          {isUploading ? (
            <div className="flex flex-col items-center text-muted-foreground">
              <Loader2 className="h-8 w-8 animate-spin mb-2" />
              <span>Uploading...</span>
            </div>
          ) : (
            <div className="flex flex-col items-center text-muted-foreground">
              <UploadCloud className="h-8 w-8 mb-2" />
              <span>Click to upload image</span>
              <span className="text-xs mt-1">JPG, PNG, GIF up to 100MB</span>
            </div>
          )}
        </div>
      )}
      
      <input 
        type="file" 
        ref={fileInputRef} 
        onChange={handleFileChange} 
        accept="image/*" 
        className="hidden" 
        disabled={disabled || isUploading}
      />
    </div>
  )
}
