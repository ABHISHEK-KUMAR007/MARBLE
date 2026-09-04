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

interface TestimonialFormDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  testimonial?: any | null
  onSuccess: () => void
}

export function TestimonialFormDialog({ open, onOpenChange, testimonial, onSuccess }: TestimonialFormDialogProps) {
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    role: '',
    quote: '',
    rating: 5,
  })

  useEffect(() => {
    if (open) {
      if (testimonial) {
        setFormData({
          name: testimonial.name || '',
          role: testimonial.role || '',
          quote: testimonial.quote || '',
          rating: testimonial.rating || 5,
        })
      } else {
        setFormData({
          name: '',
          role: '',
          quote: '',
          rating: 5,
        })
      }
    }
  }, [open, testimonial])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: name === 'rating' ? Number(value) : value }))
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    try {
      setLoading(true)
      if (testimonial) {
        await apiClient.put(`/admin/testimonials/${testimonial.id}`, formData)
        toast.success('Testimonial updated successfully')
      } else {
        await apiClient.post('/admin/testimonials', formData)
        toast.success('Testimonial created successfully')
      }
      onSuccess()
      onOpenChange(false)
    } catch (error: any) {
      toast.error(error.message || 'Failed to save testimonial')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>{testimonial ? 'Edit Testimonial' : 'Add Testimonial'}</DialogTitle>
            <DialogDescription>
              Fill out the form below to {testimonial ? 'update the' : 'create a new'} testimonial.
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="name">Customer Name *</Label>
              <Input id="name" name="name" required value={formData.name} onChange={handleChange} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="role">Role</Label>
              <Input id="role" name="role" value={formData.role} onChange={handleChange} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="rating">Rating (1-5)</Label>
              <Input id="rating" name="rating" type="number" min="1" max="5" value={formData.rating} onChange={handleChange} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="quote">Quote</Label>
              <Textarea id="quote" name="quote" value={formData.quote} onChange={handleChange} />
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={loading}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? 'Saving...' : 'Save Testimonial'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
