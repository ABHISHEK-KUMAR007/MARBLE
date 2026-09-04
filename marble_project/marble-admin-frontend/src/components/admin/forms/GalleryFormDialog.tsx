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

interface GalleryFormDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  gallery?: any | null
  onSuccess: () => void
}

export function GalleryFormDialog({ open, onOpenChange, gallery, onSuccess }: GalleryFormDialogProps) {
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    title: '',
    image: '',
    category: '',
    active: true,
  })

  useEffect(() => {
    if (open) {
      if (gallery) {
        setFormData({
          title: gallery.title || '',
          image: gallery.image || '',
          category: gallery.category || '',
          active: gallery.active ?? true,
        })
      } else {
        setFormData({
          title: '',
          image: '',
          category: '',
          active: true,
        })
      }
    }
  }, [open, gallery])

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
      if (gallery) {
        await apiClient.put(`/admin/gallery/${gallery.id}`, formData)
        toast.success('Gallery image updated successfully')
      } else {
        await apiClient.post('/admin/gallery', formData)
        toast.success('Gallery image created successfully')
      }
      onSuccess()
      onOpenChange(false)
    } catch (error: any) {
      toast.error(error.message || 'Failed to save gallery image')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>{gallery ? 'Edit Gallery Image' : 'Add Gallery Image'}</DialogTitle>
            <DialogDescription>
              Fill out the form below to {gallery ? 'update the' : 'create a new'} gallery image.
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="title">Title</Label>
              <Input id="title" name="title" value={formData.title} onChange={handleChange} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="image">Gallery Image *</Label>
              <ImageUpload value={formData.image} onChange={(url) => setFormData(prev => ({ ...prev, image: url }))} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <Input id="category" name="category" value={formData.category} onChange={handleChange} />
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
              {loading ? 'Saving...' : 'Save Image'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
