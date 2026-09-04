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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { ImageUpload } from './ImageUpload'

interface ProductFormDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  product?: any | null
  onSuccess: () => void
}

export function ProductFormDialog({ open, onOpenChange, product, onSuccess }: ProductFormDialogProps) {
  const [loading, setLoading] = useState(false)
  const [categories, setCategories] = useState<any[]>([])
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    origin: '',
    finish: '',
    thickness: '',
    price: 0,
    priceUnit: 'SQ_FT',
    image: '',
    description: '',
    featured: false,
    isNew: false,
    popular: false,
  })

  useEffect(() => {
    if (open) {
      apiClient.get<any[]>('/admin/categories')
        .then(setCategories)
        .catch(() => toast.error('Failed to load categories'))

      if (product) {
        setFormData({
          name: product.name || '',
          category: product.category || '',
          origin: product.origin || '',
          finish: product.finish || '',
          thickness: product.thickness || '',
          price: product.price || 0,
          priceUnit: product.priceUnit || 'SQ_FT',
          image: product.image || '',
          description: product.description || '',
          featured: product.featured || false,
          isNew: product.isNew || false,
          popular: product.popular || false,
        })
      } else {
        setFormData({
          name: '',
          category: '',
          origin: '',
          finish: '',
          thickness: '',
          price: 0,
          priceUnit: 'SQ_FT',
          image: '',
          description: '',
          featured: false,
          isNew: false,
          popular: false,
        })
      }
    }
  }, [open, product])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: name === 'price' ? Number(value) : value }))
  }

  const handleSwitchChange = (name: string, checked: boolean) => {
    setFormData((prev) => ({ ...prev, [name]: checked }))
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    try {
      setLoading(true)
      if (product) {
        await apiClient.put(`/admin/products/${product.id}`, formData)
        toast.success('Product updated successfully')
      } else {
        await apiClient.post('/admin/products', formData)
        toast.success('Product created successfully')
      }
      onSuccess()
      onOpenChange(false)
    } catch (error: any) {
      toast.error(error.message || 'Failed to save product')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>{product ? 'Edit Product' : 'Add Product'}</DialogTitle>
            <DialogDescription>
              Fill out the form below to {product ? 'update the' : 'create a new'} product.
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Name *</Label>
                <Input id="name" name="name" required value={formData.name} onChange={handleChange} />
              </div>

            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <Select value={formData.category} onValueChange={(value) => handleSelectChange('category', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select Category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((c) => (
                      <SelectItem key={c.id} value={c.name}>{c.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="origin">Origin</Label>
                <Input id="origin" name="origin" value={formData.origin} onChange={handleChange} />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="finish">Finish</Label>
                <Input id="finish" name="finish" value={formData.finish} onChange={handleChange} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="thickness">Thickness</Label>
                <Input id="thickness" name="thickness" value={formData.thickness} onChange={handleChange} />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="price">Price *</Label>
                <Input id="price" name="price" type="number" required value={formData.price} onChange={handleChange} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="priceUnit">Price Unit</Label>
                <Select value={formData.priceUnit} onValueChange={(value) => handleSelectChange('priceUnit', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select Unit" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="SQ_FT">Square Foot (SQ_FT)</SelectItem>
                    <SelectItem value="SQ_METER">Square Meter (SQ_METER)</SelectItem>
                    <SelectItem value="SLAB">Slab</SelectItem>
                    <SelectItem value="PIECE">Piece</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="image">Product Image</Label>
              <ImageUpload value={formData.image} onChange={(url) => handleSelectChange('image', url)} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea id="description" name="description" value={formData.description} onChange={handleChange} />
            </div>

            <div className="flex gap-6 pt-2">
              <div className="flex items-center space-x-2">
                <Switch id="featured" checked={formData.featured} onCheckedChange={(c) => handleSwitchChange('featured', c)} />
                <Label htmlFor="featured">Featured</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Switch id="isNew" checked={formData.isNew} onCheckedChange={(c) => handleSwitchChange('isNew', c)} />
                <Label htmlFor="isNew">New</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Switch id="popular" checked={formData.popular} onCheckedChange={(c) => handleSwitchChange('popular', c)} />
                <Label htmlFor="popular">Popular</Label>
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={loading}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? 'Saving...' : 'Save Product'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
