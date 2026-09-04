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

interface BannerFormDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  banner?: any | null
  onSuccess: () => void
}

export function BannerFormDialog({ open, onOpenChange, banner, onSuccess }: BannerFormDialogProps) {
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    title: '',
    subtitle: '',
    image: '',
    link: '',
    active: true,
  })

  useEffect(() => {
    if (open) {
      if (banner) {
        setFormData({
          title: banner.title || '',
          subtitle: banner.subtitle || '',
          image: banner.image || '',
          link: banner.link || '',
          active: banner.active ?? true,
        })
      } else {
        setFormData({
          title: '',
          subtitle: '',
          image: '',
          link: '',
          active: true,
        })
      }
    }
  }, [open, banner])

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
      if (banner) {
        await apiClient.put(`/admin/banners/${banner.id}`, formData)
        toast.success('Banner updated successfully')
      } else {
        await apiClient.post('/admin/banners', formData)
        toast.success('Banner created successfully')
      }
      onSuccess()
      onOpenChange(false)
    } catch (error: any) {
      toast.error(error.message || 'Failed to save banner')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>{banner ? 'Edit Banner' : 'Add Banner'}</DialogTitle>
            <DialogDescription>
              Fill out the form below to {banner ? 'update the' : 'create a new'} banner.
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="title">Title</Label>
              <Input id="title" name="title" value={formData.title} onChange={handleChange} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="subtitle">Subtitle</Label>
              <Input id="subtitle" name="subtitle" value={formData.subtitle} onChange={handleChange} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="image">Banner Image *</Label>
              <ImageUpload value={formData.image} onChange={(url) => setFormData(prev => ({ ...prev, image: url }))} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="link">Link</Label>
              <Input id="link" name="link" value={formData.link} onChange={handleChange} />
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
              {loading ? 'Saving...' : 'Save Banner'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
