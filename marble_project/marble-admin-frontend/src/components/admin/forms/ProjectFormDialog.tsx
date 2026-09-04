import { useState, useEffect, type FormEvent } from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Switch } from '@/components/ui/switch'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { apiClient } from '@/api/client'
import { toast } from 'sonner'
import { UploadCloud, X, Film } from 'lucide-react'

type MediaSlot = { type: 'existing'; url: string } | { type: 'new'; file: File; preview: string } | null;

interface ProjectFormDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  project?: any | null
  onSuccess: () => void
}

export function ProjectFormDialog({ open, onOpenChange, project, onSuccess }: ProjectFormDialogProps) {
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    name: '',
    completionDate: '',
    active: true,
  })

  const [imageSlots, setImageSlots] = useState<MediaSlot[]>(Array(5).fill(null))
  const [videoSlots, setVideoSlots] = useState<MediaSlot[]>(Array(2).fill(null))

  useEffect(() => {
    if (open) {
      if (project) {
        setFormData({
          title: project.title || '',
          description: project.description || '',
          name: project.name || project.title || '',
          completionDate: project.completionDate || '',
          active: project.active ?? true,
        })
        
        const initialImages: MediaSlot[] = Array(5).fill(null)
        const existingProjectImages = project.images || []
        existingProjectImages.forEach((img: string, idx: number) => {
           if (idx < 5) initialImages[idx] = { type: 'existing', url: img }
        })
        setImageSlots(initialImages)
        
        const initialVideos: MediaSlot[] = Array(2).fill(null)
        const existingProjectVideos = project.videos || []
        existingProjectVideos.forEach((vid: string, idx: number) => {
           if (idx < 2) initialVideos[idx] = { type: 'existing', url: vid }
        })
        setVideoSlots(initialVideos)

      } else {
        setFormData({
          title: '',
          description: '',
          name: '',
          completionDate: '',
          active: true,
        })
        setImageSlots(Array(5).fill(null))
        setVideoSlots(Array(2).fill(null))
      }
    }
  }, [open, project])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSwitchChange = (checked: boolean) => {
    setFormData((prev) => ({ ...prev, active: checked }))
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, index: number, isVideo: boolean) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (isVideo && !file.type.startsWith('video/')) {
      toast.error('Unsupported video format. Please upload MP4, WEBM, or MOV.')
      return
    }
    
    if (!isVideo && !file.type.startsWith('image/')) {
      toast.error('Unsupported image format. Please upload JPG, PNG, or WEBP.')
      return
    }

    const preview = URL.createObjectURL(file)
    const newSlot: MediaSlot = { type: 'new', file, preview }

    if (isVideo) {
      setVideoSlots(prev => {
        const updated = [...prev]
        updated[index] = newSlot
        return updated
      })
    } else {
      setImageSlots(prev => {
        const updated = [...prev]
        updated[index] = newSlot
        return updated
      })
    }
  }

  const removeMedia = (index: number, isVideo: boolean) => {
    if (isVideo) {
      setVideoSlots(prev => {
        const updated = [...prev]
        const existing = updated[index]
        if (existing?.type === 'new') URL.revokeObjectURL(existing.preview)
        updated[index] = null
        return updated
      })
    } else {
      setImageSlots(prev => {
        const updated = [...prev]
        const existing = updated[index]
        if (existing?.type === 'new') URL.revokeObjectURL(existing.preview)
        updated[index] = null
        return updated
      })
    }
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    
    const hasImages = imageSlots.some(slot => slot !== null)
    if (!hasImages) {
      toast.error('Please upload at least one image.')
      return
    }

    try {
      setLoading(true)
      
      const submitData = new FormData()
      submitData.append('title', formData.title)
      if (formData.description) submitData.append('description', formData.description)
      if (formData.name) submitData.append('name', formData.name)
      if (formData.completionDate) submitData.append('completionDate', formData.completionDate)
      submitData.append('active', String(formData.active))
      
      imageSlots.forEach(slot => {
          if (slot?.type === 'existing') submitData.append('existingImages', slot.url)
          if (slot?.type === 'new') submitData.append('newImages', slot.file)
      })
      
      videoSlots.forEach(slot => {
          if (slot?.type === 'existing') submitData.append('existingVideos', slot.url)
          if (slot?.type === 'new') submitData.append('newVideos', slot.file)
      })

      if (project) {
        await apiClient.putForm(`/admin/projects/${project.id}`, submitData)
        toast.success('Project updated successfully')
      } else {
        await apiClient.postForm('/admin/projects', submitData)
        toast.success('Project created successfully')
      }
      onSuccess()
      onOpenChange(false)
    } catch (error: any) {
      console.error('Project save error:', error)
      toast.error(error.message || 'Failed to save project')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>{project ? 'Edit Project' : 'Add Project'}</DialogTitle>
            <DialogDescription>
              Fill out the form below to {project ? 'update the' : 'create a new'} project.
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="title">Title *</Label>
              <Input id="title" name="title" required value={formData.title} onChange={handleChange} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="name">Display Name</Label>
              <Input id="name" name="name" value={formData.name} onChange={handleChange} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="completionDate">Completion Date</Label>
              <Input id="completionDate" name="completionDate" type="date" value={formData.completionDate} onChange={handleChange} />
            </div>

            <div className="space-y-3">
              <Label>Project Images (Max 5)</Label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {imageSlots.map((slot, index) => (
                  <div key={`img-${index}`} className="space-y-1">
                    <p className="text-xs text-muted-foreground">Image {index + 1}</p>
                    {slot ? (
                      <div className="relative rounded-md overflow-hidden border border-border group h-32 bg-muted">
                        <img src={slot.type === 'existing' ? slot.url : slot.preview} alt="Preview" className="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-black/50 flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <Button type="button" variant="secondary" size="sm" className="relative cursor-pointer">
                            Replace
                            <input type="file" accept="image/*" className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" onChange={(e) => handleFileChange(e, index, false)} />
                          </Button>
                          <Button type="button" variant="destructive" size="sm" onClick={() => removeMedia(index, false)}>
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <div className="border-2 border-dashed border-border rounded-md p-4 flex flex-col items-center justify-center h-32 bg-muted/50 hover:bg-muted transition-colors cursor-pointer relative">
                        <UploadCloud className="h-6 w-6 text-muted-foreground mb-1" />
                        <span className="text-xs text-muted-foreground text-center">Choose Image</span>
                        <input type="file" accept="image/*" className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" onChange={(e) => handleFileChange(e, index, false)} />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-3">
              <Label>Project Videos (Max 2)</Label>
              <div className="grid grid-cols-2 md:grid-cols-2 gap-4">
                {videoSlots.map((slot, index) => (
                  <div key={`vid-${index}`} className="space-y-1">
                    <p className="text-xs text-muted-foreground">Video {index + 1}</p>
                    {slot ? (
                      <div className="relative rounded-md overflow-hidden border border-border group h-32 bg-black flex items-center justify-center">
                        {slot.type === 'existing' ? (
                           <video src={slot.url} className="w-full h-full object-cover" />
                        ) : (
                           <video src={slot.preview} className="w-full h-full object-cover" />
                        )}
                        <div className="absolute inset-0 bg-black/50 flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <Button type="button" variant="secondary" size="sm" className="relative cursor-pointer">
                            Replace
                            <input type="file" accept="video/*" className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" onChange={(e) => handleFileChange(e, index, true)} />
                          </Button>
                          <Button type="button" variant="destructive" size="sm" onClick={() => removeMedia(index, true)}>
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <div className="border-2 border-dashed border-border rounded-md p-4 flex flex-col items-center justify-center h-32 bg-muted/50 hover:bg-muted transition-colors cursor-pointer relative">
                        <Film className="h-6 w-6 text-muted-foreground mb-1" />
                        <span className="text-xs text-muted-foreground text-center">Choose Video</span>
                        <input type="file" accept="video/*" className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" onChange={(e) => handleFileChange(e, index, true)} />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea id="description" name="description" value={formData.description} onChange={handleChange} />
            </div>

            <div className="flex items-center space-x-2 pt-2">
              <Switch id="active" checked={formData.active} onCheckedChange={handleSwitchChange} />
              <Label htmlFor="active">Active</Label>
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={loading}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? 'Saving...' : 'Save Project'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
