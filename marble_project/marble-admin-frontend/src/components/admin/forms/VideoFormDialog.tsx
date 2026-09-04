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
import { Label } from '@/components/ui/label'
import { apiClient } from '@/api/client'
import { toast } from 'sonner'
import { ImageUpload } from './ImageUpload'

interface VideoFormDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  video?: any | null
  onSuccess: () => void
}

export function VideoFormDialog({ open, onOpenChange, video, onSuccess }: VideoFormDialogProps) {
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    title: '',
    youtubeUrl: '',
    thumbnail: '',
    active: true,
  })

  useEffect(() => {
    if (open) {
      if (video) {
        setFormData({
          title: video.title || '',
          youtubeUrl: video.youtubeUrl || '',
          thumbnail: video.thumbnail || '',
          active: video.active ?? true,
        })
      } else {
        setFormData({
          title: '',
          youtubeUrl: '',
          thumbnail: '',
          active: true,
        })
      }
    }
  }, [open, video])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSwitchChange = (checked: boolean) => {
    setFormData((prev) => ({ ...prev, active: checked }))
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    try {
      setLoading(true)
      if (video) {
        await apiClient.put(`/admin/videos/${video.id}`, formData)
        toast.success('Video updated successfully')
      } else {
        await apiClient.post('/admin/videos', formData)
        toast.success('Video created successfully')
      }
      onSuccess()
      onOpenChange(false)
    } catch (error: any) {
      toast.error(error.message || 'Failed to save video')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>{video ? 'Edit Video' : 'Add Video'}</DialogTitle>
            <DialogDescription>
              Fill out the form below to {video ? 'update the' : 'create a new'} video.
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="title">Title</Label>
              <Input id="title" name="title" value={formData.title} onChange={handleChange} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="youtubeUrl">YouTube URL *</Label>
              <Input id="youtubeUrl" name="youtubeUrl" required value={formData.youtubeUrl} onChange={handleChange} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="thumbnail">Video Thumbnail</Label>
              <ImageUpload value={formData.thumbnail} onChange={(url) => setFormData(prev => ({ ...prev, thumbnail: url }))} />
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
              {loading ? 'Saving...' : 'Save Video'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
