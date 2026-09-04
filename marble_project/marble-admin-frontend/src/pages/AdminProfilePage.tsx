import { useEffect, useState } from 'react'
import { PageHeader } from '@/components/admin/PageHeader'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { ImageUpload } from '@/components/admin/forms/ImageUpload'
import { toast } from 'sonner'
import { adminService } from '@/services/adminService'
import { useAuth } from '@/context/AuthContext'
import { authService } from '@/services/authService'

export function AdminProfilePage() {
  const { user } = useAuth()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    avatar: '',
    password: '',
  })
  
  useEffect(() => {
    if (user?.id) {
      adminService.getAdminById(user.id).then(admin => {
        setFormData({
          fullName: admin.fullName || '',
          email: admin.email || '',
          phone: admin.phone || '',
          avatar: admin.avatar || '',
          password: '',
        })
      }).catch(() => {
        toast.error("Failed to load profile details")
      })
    }
  }, [user])

  const validateForm = () => {
    if (!formData.fullName.trim()) {
      toast.error('Full name is required')
      return false
    }
    if (!formData.email.trim()) {
      toast.error('Email is required')
      return false
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      toast.error('Enter a valid email address')
      return false
    }
    if (formData.phone && !/^\+?[\d\s\-()]{7,}$/.test(formData.phone)) {
      toast.error('Enter a valid phone number')
      return false
    }
    return true
  }

  const handleSave = async () => {
    if (!validateForm() || !user) return

    setLoading(true)
    try {
      const updatedAdmin = await adminService.updateAdmin(user.id, {
        fullName: formData.fullName.trim(),
        email: formData.email.trim(),
        phone: formData.phone.trim() || undefined,
        avatar: formData.avatar || undefined,
        password: formData.password || undefined,
      })
      
      // Update local session
      const session = authService.getSession()
      if (session) {
        session.user = {
          ...session.user,
          name: updatedAdmin.fullName,
          email: updatedAdmin.email,
          avatar: updatedAdmin.avatar,
        }
        localStorage.setItem('admin_session', JSON.stringify(session))
        // Workaround to refresh context: re-login without api call if we had a way,
        // For now, since AuthContext loads from localStorage on mount, let's force a reload 
        // or we can just window.location.reload() for a seamless refresh across the app.
        window.location.reload()
      }
      
      toast.success('Profile updated successfully.')
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to update profile.'
      toast.error(message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="w-full space-y-6">
      <PageHeader 
        title="My Profile" 
        description="Update your account details and profile picture." 
        actions={
          <Button variant="gold" onClick={handleSave} disabled={loading}>
            {loading ? 'Saving...' : 'Save Profile'}
          </Button>
        }
      />
      
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardContent className="p-6 space-y-6">
            <h3 className="font-display text-lg">Profile Picture</h3>
            <div className="space-y-2">
              <Label>Avatar</Label>
              <ImageUpload 
                value={formData.avatar} 
                onChange={(url) => setFormData(prev => ({ ...prev, avatar: url }))} 
              />
              <p className="text-xs text-muted-foreground mt-2">
                Recommended size: 256x256px. Maximum file size: 2MB.
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6 space-y-4">
            <h3 className="font-display text-lg">Account Details</h3>
            
            <div className="space-y-2">
              <Label htmlFor="fullName">Full Name *</Label>
              <Input
                id="fullName"
                value={formData.fullName}
                onChange={(e) => setFormData((prev) => ({ ...prev, fullName: e.target.value }))}
                placeholder="Enter your full name"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="email">Email Address *</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData((prev) => ({ ...prev, email: e.target.value }))}
                placeholder="admin@example.com"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number (Optional)</Label>
              <Input
                id="phone"
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData((prev) => ({ ...prev, phone: e.target.value }))}
                placeholder="+91 98765 43210"
              />
            </div>
            
            <div className="space-y-2 pt-2 border-t mt-4">
              <Label htmlFor="password">Change Password (Optional)</Label>
              <Input
                id="password"
                type="password"
                value={formData.password}
                onChange={(e) => setFormData((prev) => ({ ...prev, password: e.target.value }))}
                placeholder="Leave blank to keep unchanged"
              />
              <p className="text-xs text-muted-foreground">
                Only fill this if you want to change your password.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
