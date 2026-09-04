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
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { apiClient } from '@/api/client'
import { toast } from 'sonner'
import { ImageUpload } from './ImageUpload'

interface BlogFormDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  blog?: any | null
  onSuccess: () => void
}

export function BlogFormDialog({ open, onOpenChange, blog, onSuccess }: BlogFormDialogProps) {
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    title: '',
    excerpt: '',
    date: '',
    image: '',
  })

  useEffect(() => {
    if (open) {
      if (blog) {
        setFormData({
          title: blog.title || '',
          excerpt: blog.excerpt || '',
          date: blog.date || '',
          image: blog.image || '',
        })
      } else {
        setFormData({
          title: '',
          excerpt: '',
          date: new Date().toISOString().split('T')[0],
          image: '',
        })
      }
    }
  }, [open, blog])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    try {
      setLoading(true)
      if (blog) {
        await apiClient.put(`/admin/blogs/${blog.id}`, formData)
        toast.success('Blog post updated successfully')
      } else {
        await apiClient.post('/admin/blogs', formData)
        toast.success('Blog post created successfully')
      }
      onSuccess()
      onOpenChange(false)
    } catch (error: any) {
      toast.error(error.message || 'Failed to save blog post')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>{blog ? 'Edit Blog Post' : 'Add Blog Post'}</DialogTitle>
            <DialogDescription>
              Fill out the form below to {blog ? 'update the' : 'create a new'} blog post.
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="title">Title *</Label>
              <Input id="title" name="title" required value={formData.title} onChange={handleChange} />
            </div>



            <div className="space-y-2">
              <Label htmlFor="date">Date</Label>
              <Input id="date" name="date" type="date" value={formData.date} onChange={handleChange} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="image">Blog Image</Label>
              <ImageUpload value={formData.image} onChange={(url) => setFormData(prev => ({ ...prev, image: url }))} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="excerpt">Excerpt</Label>
              <Textarea id="excerpt" name="excerpt" value={formData.excerpt} onChange={handleChange} />
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={loading}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? 'Saving...' : 'Save Blog Post'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
