import { useCallback, useState } from 'react'
import { GripVertical, Star, Trash2, Upload } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { cn } from '@/lib/utils'

export interface UploadImageItem {
  id: string
  url: string
  alt: string
  title: string
  isPrimary: boolean
  order: number
}

interface ImageUploadZoneProps {
  images: UploadImageItem[]
  onChange: (images: UploadImageItem[]) => void
  maxImages?: number
}

export function ImageUploadZone({ images, onChange, maxImages = 10 }: ImageUploadZoneProps) {
  const [dragOver, setDragOver] = useState(false)

  const handleFiles = useCallback(
    (files: FileList | null) => {
      if (!files) return
      const remaining = maxImages - images.length
      const newImages: UploadImageItem[] = Array.from(files)
        .slice(0, remaining)
        .map((file, i) => ({
          id: `img-${Date.now()}-${i}`,
          url: URL.createObjectURL(file),
          alt: file.name.replace(/\.[^.]+$/, ''),
          title: file.name,
          isPrimary: images.length === 0 && i === 0,
          order: images.length + i,
        }))
      onChange([...images, ...newImages])
    },
    [images, maxImages, onChange],
  )

  const setPrimary = (id: string) => {
    onChange(images.map((img) => ({ ...img, isPrimary: img.id === id })))
  }

  const removeImage = (id: string) => {
    const filtered = images.filter((img) => img.id !== id)
    if (filtered.length && !filtered.some((i) => i.isPrimary)) {
      filtered[0].isPrimary = true
    }
    onChange(filtered.map((img, i) => ({ ...img, order: i })))
  }

  const updateMeta = (id: string, field: 'alt' | 'title', value: string) => {
    onChange(images.map((img) => (img.id === id ? { ...img, [field]: value } : img)))
  }

  return (
    <div className="space-y-4">
      <div
        onDragOver={(e) => {
          e.preventDefault()
          setDragOver(true)
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={(e) => {
          e.preventDefault()
          setDragOver(false)
          handleFiles(e.dataTransfer.files)
        }}
        className={cn(
          'flex flex-col items-center justify-center rounded-lg border-2 border-dashed p-8 transition-colors',
          dragOver ? 'border-accent bg-accent/5' : 'border-border',
        )}
      >
        <Upload className="h-8 w-8 text-muted-foreground" />
        <p className="mt-2 text-sm font-medium">Drag & drop images here</p>
        <p className="text-xs text-muted-foreground">PNG, JPG up to 100MB each</p>
        <label className="mt-4">
          <Button type="button" variant="outline" size="sm" asChild>
            <span>Browse Files</span>
          </Button>
          <input
            type="file"
            accept="image/*"
            multiple
            className="hidden"
            onChange={(e) => handleFiles(e.target.files)}
          />
        </label>
      </div>

      {images.length > 0 && (
        <div className="grid gap-4 sm:grid-cols-2">
          {images
            .sort((a, b) => a.order - b.order)
            .map((img) => (
              <div key={img.id} className="rounded-lg border p-3 space-y-3">
                <div className="relative aspect-video overflow-hidden rounded-md bg-muted">
                  <img src={img.url} alt={img.alt} className="h-full w-full object-cover" />
                  {img.isPrimary && (
                    <span className="absolute top-2 left-2 flex items-center gap-1 rounded bg-accent px-2 py-0.5 text-xs text-primary">
                      <Star className="h-3 w-3 fill-current" /> Primary
                    </span>
                  )}
                  <div className="absolute top-2 right-2 flex gap-1">
                    <button type="button" className="grid h-7 w-7 place-items-center rounded bg-background/90">
                      <GripVertical className="h-4 w-4 text-muted-foreground" />
                    </button>
                    <button
                      type="button"
                      onClick={() => removeImage(img.id)}
                      className="grid h-7 w-7 place-items-center rounded bg-background/90 hover:bg-destructive hover:text-destructive-foreground"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
                <div className="grid gap-2">
                  <div>
                    <Label className="text-xs">Alt Text</Label>
                    <Input value={img.alt} onChange={(e) => updateMeta(img.id, 'alt', e.target.value)} className="h-8 text-xs" />
                  </div>
                  <div>
                    <Label className="text-xs">Title</Label>
                    <Input value={img.title} onChange={(e) => updateMeta(img.id, 'title', e.target.value)} className="h-8 text-xs" />
                  </div>
                  {!img.isPrimary && (
                    <Button type="button" variant="outline" size="sm" onClick={() => setPrimary(img.id)}>
                      Set as Primary
                    </Button>
                  )}
                </div>
              </div>
            ))}
        </div>
      )}
    </div>
  )
}
