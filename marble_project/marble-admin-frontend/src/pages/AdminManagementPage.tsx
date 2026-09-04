import { useCallback, useEffect, useMemo, useState } from 'react'
import {
  Edit2,
  Eye,
  MoreHorizontal,
  PauseCircle,
  Play,
  Plus,
  Trash2,
  User,
} from 'lucide-react'
import { toast } from 'sonner'
import { useAuth } from '@/context/AuthContext'
import { PageHeader } from '@/components/admin/PageHeader'
import { ConfirmDialog } from '@/components/admin/ConfirmDialog'
import { SearchInput } from '@/components/admin/SearchInput'
import { Pagination } from '@/components/admin/Pagination'
import { StatusBadge } from '@/components/admin/StatusBadge'
import { EmptyState } from '@/components/admin/EmptyState'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { adminService } from '@/services/adminService'
import type { AdminStatus, ManagedAdmin } from '@/types/user'

const PAGE_SIZE = 8

type FormMode = 'add' | 'edit' | null

import { ImageUpload } from '@/components/admin/forms/ImageUpload'

interface AdminFormState {
  fullName: string
  email: string
  phone: string
  avatar?: string
  password?: string
  confirmPassword?: string
  role: 'SUPER_ADMIN' | 'SUB_ADMIN'
}

const emptyForm: AdminFormState = { fullName: '', email: '', phone: '', avatar: '', password: '', confirmPassword: '', role: 'SUB_ADMIN' }

function formatDate(value: string) {
  return new Intl.DateTimeFormat('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }).format(new Date(value))
}

function formatLastLogin(value?: string) {
  if (!value) return 'Never'
  return formatDate(value)
}

function AdminAvatar({ admin, size = 'md' }: { admin: ManagedAdmin; size?: 'sm' | 'md' | 'lg' }) {
  const sizeClass = size === 'sm' ? 'h-8 w-8' : size === 'lg' ? 'h-16 w-16' : 'h-10 w-10'
  if (admin.avatar) {
    return <img src={admin.avatar} alt={admin.fullName} className={`${sizeClass} rounded-full border border-border object-cover`} />
  }
  return (
    <div className={`${sizeClass} grid place-items-center rounded-full bg-primary/10 text-primary`}>
      <User className={size === 'lg' ? 'h-7 w-7' : 'h-4 w-4'} />
    </div>
  )
}

export function AdminManagementPage() {
  const { user: currentUser } = useAuth()
  const [admins, setAdmins] = useState<ManagedAdmin[]>([])
  const [loading, setLoading] = useState(true)
  const [query, setQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState<AdminStatus | 'All'>('All')
  const [page, setPage] = useState(1)

  const [formMode, setFormMode] = useState<FormMode>(null)
  const [formData, setFormData] = useState<AdminFormState>(emptyForm)
  const [formErrors, setFormErrors] = useState<Record<string, string>>({})
  const [submitting, setSubmitting] = useState(false)
  const [editingAdmin, setEditingAdmin] = useState<ManagedAdmin | null>(null)

  const [viewAdmin, setViewAdmin] = useState<ManagedAdmin | null>(null)

  const [deleteTarget, setDeleteTarget] = useState<ManagedAdmin | null>(null)
  const [statusTarget, setStatusTarget] = useState<{ admin: ManagedAdmin; nextStatus: AdminStatus } | null>(null)

  const isCurrentAdmin = useCallback(
    (admin: ManagedAdmin) => admin.id === currentUser?.id || admin.email === currentUser?.email,
    [currentUser],
  )

  const loadAdmins = useCallback(async () => {
  setLoading(true)

  try {
    const data =
      await adminService.getAllAdmins()

    setAdmins(data)
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : 'Failed to load administrators.'

    toast.error(message)
  } finally {
    setLoading(false)
  }
}, [])

  useEffect(() => {
    loadAdmins()
  }, [loadAdmins])

  const filtered = useMemo(() => {
    const search = query.trim().toLowerCase()
    return admins.filter((admin) => {
      const matchesSearch =
        !search ||
        admin.fullName.toLowerCase().includes(search) ||
        admin.email.toLowerCase().includes(search) ||
        (admin.phone?.toLowerCase().includes(search) ?? false)
      const matchesStatus = statusFilter === 'All' || admin.status === statusFilter
      return matchesSearch && matchesStatus
    })
  }, [admins, query, statusFilter])

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const pageItems = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

  useEffect(() => {
    if (page > totalPages) setPage(totalPages)
  }, [page, totalPages])

  const validateForm = () => {
    const errors: Record<string, string> = {}
    if (!formData.fullName.trim()) errors.fullName = 'Full name is required'
    if (!formData.email.trim()) {
      errors.email = 'Email is required'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = 'Enter a valid email address'
    }
    if (formData.phone && !/^\+?[\d\s\-()]{7,}$/.test(formData.phone)) {
      errors.phone = 'Enter a valid phone number'
    }
    if (formMode === 'add' && (!formData.password || formData.password.length < 6)) {
      errors.password = 'Password must be at least 6 characters'
    } else if (formMode === 'add' && formData.password !== formData.confirmPassword) {
      errors.confirmPassword = 'Passwords do not match'
    }
    
    if (formMode === 'edit' && formData.password && formData.password !== formData.confirmPassword) {
      errors.confirmPassword = 'Passwords do not match'
    }
    
    setFormErrors(errors)
    return Object.keys(errors).length === 0
  }

  const openAddForm = () => {
    setFormData(emptyForm)
    setFormErrors({})
    setEditingAdmin(null)
    setFormMode('add')
  }

  const openEditForm = (admin: ManagedAdmin) => {
    setEditingAdmin(admin)
    setFormData({
      fullName: admin.fullName,
      email: admin.email,
      phone: admin.phone ?? '',
      avatar: admin.avatar ?? '',
      password: '',
      confirmPassword: '',
      role: admin.role,
    })
    setFormErrors({})
    setFormMode('edit')
  }

  const closeForm = () => {
    setFormMode(null)
    setEditingAdmin(null)
    setFormData(emptyForm)
    setFormErrors({})
  }

const handleFormSubmit = async (event: React.FormEvent,) => {
    event.preventDefault()

    if (!validateForm()) return

    setSubmitting(true)

    try {

      if (formMode === 'add') {

        await adminService.createAdmin({
          fullName:
            formData.fullName.trim(),

          email: formData.email.trim(),
          phone: formData.phone.trim() || undefined,
          avatar: formData.avatar || undefined,
          password: formData.password || undefined,
          role: formData.role,
        })

        toast.success(
          'Admin created successfully.',
        )

      } else if (
        formMode === 'edit' &&
        editingAdmin
      ) {

        await adminService.updateAdmin(
          editingAdmin.id,
          {
            fullName:
              formData.fullName.trim(),

            email: formData.email.trim(),
            phone: formData.phone.trim() || undefined,
            avatar: formData.avatar || undefined,
            password: formData.password || undefined,
            role: formData.role,
          },
        )

        toast.success(
          'Admin updated successfully.',
        )
      }

      await loadAdmins()

      closeForm()

    } catch (error) {

      const message =
        error instanceof Error
          ? error.message
          : 'Unable to save admin. Please try again.'

      toast.error(message)

    } finally {

      setSubmitting(false)

    }
  }

  const handleDelete = async () => {
    if (!deleteTarget) return
    try {
      await adminService.deleteAdmin(deleteTarget.id)
      toast.success('Admin deleted successfully.')
      await loadAdmins()
    } catch {
      toast.error('Unable to delete admin.')
    } finally {
      setDeleteTarget(null)
    }
  }

  const handleStatusChange = async () => {
    if (!statusTarget) return
    try {
      await adminService.changeAdminStatus(statusTarget.admin.id, statusTarget.nextStatus)
      toast.success(
        statusTarget.nextStatus === 'Active'
          ? 'Admin activated successfully.'
          : 'Admin deactivated successfully.',
      )
      await loadAdmins()
    } catch {
      toast.error('Unable to update admin status.')
    } finally {
      setStatusTarget(null)
    }
  }

  const renderActions = (admin: ManagedAdmin) => {
    const isSelf = isCurrentAdmin(admin)

    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" className="h-8 w-8" aria-label="Admin actions">
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-52">
          <DropdownMenuItem onClick={() => setViewAdmin(admin)}>
            <Eye className="h-4 w-4" />
            View
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => openEditForm(admin)}>
            <Edit2 className="h-4 w-4" />
            Edit
          </DropdownMenuItem>
          {(admin.status === 'Active' || admin.status === 'Inactive') && (
            <DropdownMenuItem
              disabled={isSelf}
              onClick={() =>
                !isSelf &&
                setStatusTarget({
                  admin,
                  nextStatus: admin.status === 'Active' ? 'Inactive' : 'Active',
                })
              }
            >
              {admin.status === 'Active' ? (
                <PauseCircle className="h-4 w-4" />
              ) : (
                <Play className="h-4 w-4" />
              )}
              {admin.status === 'Active' ? 'Deactivate' : 'Activate'}
            </DropdownMenuItem>
          )}
          <DropdownMenuSeparator />
          <DropdownMenuItem
            disabled={isSelf}
            className="text-destructive focus:text-destructive"
            onClick={() => !isSelf && setDeleteTarget(admin)}
          >
            <Trash2 className="h-4 w-4" />
            Delete
          </DropdownMenuItem>
          {isSelf && (
            <p className="px-2 py-1.5 text-xs text-muted-foreground">
              You cannot deactivate or delete your currently logged-in account.
            </p>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    )
  }

  return (
    <div className="w-full space-y-6">
      <PageHeader
        title="Admin Management"
        description="Manage administrators who have access to your website management system."
        actions={
          <Button variant="gold" onClick={openAddForm}>
            <Plus className="h-4 w-4" />
            Add New Admin
          </Button>
        }
      />

      <Card>
        <CardContent className="grid gap-4 p-4 lg:grid-cols-[1fr_max-content]">
          <SearchInput
            value={query}
            onChange={(value) => {
              setQuery(value)
              setPage(1)
            }}
            placeholder="Search admins by name, email or phone..."
          />
          <Select
            value={statusFilter}
            onValueChange={(value) => {
              setStatusFilter(value as AdminStatus | 'All')
              setPage(1)
            }}
          >
            <SelectTrigger className="w-full md:w-52">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="All">All Statuses</SelectItem>
              <SelectItem value="Active">Active</SelectItem>
              <SelectItem value="Inactive">Inactive</SelectItem>
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      {loading ? (
        <Card>
          <CardContent className="py-16 text-center text-muted-foreground">Loading administrators...</CardContent>
        </Card>
      ) : pageItems.length === 0 ? (
        <EmptyState
          title="No administrators found"
          description="Try adjusting your search or status filter, or add a new admin."
          actionLabel="Add New Admin"
          onAction={openAddForm}
        />
      ) : (
        <>
          {/* Desktop / tablet table */}
          <div className="hidden md:block overflow-x-auto rounded-xl border bg-card">
            <table className="w-full min-w-[960px] text-sm">
              <thead>
                <tr className="border-b bg-muted/50 text-left text-xs uppercase tracking-wider text-muted-foreground">
                  <th className="px-4 py-3 font-medium">Avatar</th>
                  <th className="px-4 py-3 font-medium">Full Name</th>
                  <th className="px-4 py-3 font-medium">Role</th>
                  <th className="px-4 py-3 font-medium">Email</th>
                  <th className="px-4 py-3 font-medium">Phone</th>
                  <th className="px-4 py-3 font-medium">Status</th>
                  <th className="px-4 py-3 font-medium">Last Login</th>
                  <th className="px-4 py-3 font-medium">Created Date</th>
                  <th className="px-4 py-3 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {pageItems.map((admin) => (
                  <tr key={admin.id} className="hover:bg-muted/30 transition-colors">
                    <td className="px-4 py-3">
                      <AdminAvatar admin={admin} size="sm" />
                    </td>
                    <td className="px-4 py-3">
                      <div className="font-medium">{admin.fullName}</div>
                      {isCurrentAdmin(admin) && (
                        <span className="text-xs text-accent">Current account</span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${admin.role === 'SUPER_ADMIN' ? 'bg-primary/10 text-primary' : 'bg-muted text-muted-foreground'}`}>
                        {admin.role === 'SUPER_ADMIN' ? 'Super Admin' : 'Sub Admin'}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">{admin.email}</td>
                    <td className="px-4 py-3 text-muted-foreground">{admin.phone ?? '—'}</td>
                    <td className="px-4 py-3">
                      <StatusBadge status={admin.status} />
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">{formatLastLogin(admin.lastLogin)}</td>
                    <td className="px-4 py-3 text-muted-foreground">{formatDate(admin.createdAt)}</td>
                    <td className="px-4 py-3">{renderActions(admin)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile cards */}
          <div className="grid gap-4 md:hidden">
            {pageItems.map((admin) => (
              <Card key={admin.id}>
                <CardContent className="space-y-4 p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <AdminAvatar admin={admin} />
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="font-medium">{admin.fullName}</p>
                          <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-medium ${admin.role === 'SUPER_ADMIN' ? 'bg-primary/10 text-primary' : 'bg-muted text-muted-foreground'}`}>
                            {admin.role === 'SUPER_ADMIN' ? 'Super Admin' : 'Sub Admin'}
                          </span>
                        </div>
                        {isCurrentAdmin(admin) && (
                          <span className="text-xs text-accent">Current account</span>
                        )}
                        <p className="text-sm text-muted-foreground">{admin.email}</p>
                      </div>
                    </div>
                    {renderActions(admin)}
                  </div>
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div>
                      <p className="text-muted-foreground">Phone</p>
                      <p>{admin.phone ?? '—'}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Status</p>
                      <StatusBadge status={admin.status} />
                    </div>
                    <div>
                      <p className="text-muted-foreground">Last Login</p>
                      <p>{formatLastLogin(admin.lastLogin)}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Created</p>
                      <p>{formatDate(admin.createdAt)}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <Pagination page={page} totalPages={totalPages} onPageChange={setPage} className="mt-4" />
        </>
      )}

      {/* Add / Edit modal */}
      <Dialog open={formMode !== null} onOpenChange={(open) => !open && closeForm()}>
        <DialogContent className="max-w-[95vw] sm:max-w-[920px]">
          <DialogHeader>
            <DialogTitle>{formMode === 'add' ? 'Add New Admin' : 'Edit Admin'}</DialogTitle>
            <DialogDescription>
              {formMode === 'add'
                ? 'Create a new administrator account immediately with login credentials.'
                : 'Update administrator contact details.'}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleFormSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="fullName">Full Name *</Label>
              <Input
                id="fullName"
                value={formData.fullName}
                onChange={(e) => setFormData((prev) => ({ ...prev, fullName: e.target.value }))}
                placeholder="Enter full name"
              />
              {formErrors.fullName && <p className="text-sm text-destructive">{formErrors.fullName}</p>}
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
              {formErrors.email && <p className="text-sm text-destructive">{formErrors.email}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="role">Role *</Label>
              <Select
                value={formData.role}
                onValueChange={(value) => setFormData((prev) => ({ ...prev, role: value as 'SUPER_ADMIN' | 'SUB_ADMIN' }))}
              >
                <SelectTrigger id="role">
                  <SelectValue placeholder="Select a role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="SUPER_ADMIN">Super Admin</SelectItem>
                  <SelectItem value="SUB_ADMIN">Sub Admin</SelectItem>
                </SelectContent>
              </Select>
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
              {formErrors.phone && <p className="text-sm text-destructive">{formErrors.phone}</p>}
            </div>
            {formMode === 'add' && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="password">Password *</Label>
                  <Input
                    id="password"
                    type="password"
                    value={formData.password}
                    onChange={(e) => setFormData((prev) => ({ ...prev, password: e.target.value }))}
                    placeholder="Create a password"
                  />
                  {formErrors.password && <p className="text-sm text-destructive">{formErrors.password}</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirm Password *</Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    value={formData.confirmPassword}
                    onChange={(e) => setFormData((prev) => ({ ...prev, confirmPassword: e.target.value }))}
                    placeholder="Confirm password"
                  />
                  {formErrors.confirmPassword && <p className="text-sm text-destructive">{formErrors.confirmPassword}</p>}
                </div>
              </>
            )}
            {formMode === 'edit' && (
              <>
                <div className="space-y-2">
                  <Label>Avatar</Label>
                  <ImageUpload value={formData.avatar} onChange={(url) => setFormData(prev => ({ ...prev, avatar: url }))} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">Change Password (Optional)</Label>
                  <Input
                    id="password"
                    type="password"
                    value={formData.password}
                    onChange={(e) => setFormData((prev) => ({ ...prev, password: e.target.value }))}
                    placeholder="Leave blank to keep unchanged"
                  />
                  {formErrors.password && <p className="text-sm text-destructive">{formErrors.password}</p>}
                </div>
                {formData.password && (
                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword">Confirm Password</Label>
                    <Input
                      id="confirmPassword"
                      type="password"
                      value={formData.confirmPassword}
                      onChange={(e) => setFormData((prev) => ({ ...prev, confirmPassword: e.target.value }))}
                      placeholder="Confirm new password"
                    />
                    {formErrors.confirmPassword && <p className="text-sm text-destructive">{formErrors.confirmPassword}</p>}
                  </div>
                )}
              </>
            )}
            {formMode === 'add' && (
              <div className="rounded-2xl border border-border bg-muted/50 p-4 text-sm text-muted-foreground">
                The new admin will be created as an <strong className="text-foreground">Active</strong> administrator and can sign in immediately.
              </div>
            )}
            <DialogFooter className="gap-2 sm:gap-0">
              <Button type="button" variant="outline" onClick={closeForm}>
                Cancel
              </Button>
              <Button type="submit" variant="gold" disabled={submitting}>
                {submitting ? 'Saving…' : formMode === 'add' ? 'Create Admin' : 'Save Changes'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* View modal */}
      <Dialog open={viewAdmin !== null} onOpenChange={(open) => !open && setViewAdmin(null)}>
        <DialogContent className="max-w-[95vw] sm:max-w-[780px]">
          {viewAdmin && (
            <>
              <DialogHeader>
                <DialogTitle>Admin Details</DialogTitle>
                <DialogDescription>Full profile for {viewAdmin.fullName}</DialogDescription>
              </DialogHeader>
              <div className="flex flex-col items-center gap-4 py-2">
                <AdminAvatar admin={viewAdmin} size="lg" />
                <div className="text-center">
                  <p className="font-display text-xl">{viewAdmin.fullName}</p>
                  <p className="text-sm text-muted-foreground">{viewAdmin.email}</p>
                </div>
              </div>
              <div className="grid gap-3 rounded-2xl border border-border bg-muted/30 p-4 text-sm">
                <div className="flex justify-between gap-4">
                  <span className="text-muted-foreground">Phone</span>
                  <span className="text-right">{viewAdmin.phone ?? '—'}</span>
                </div>
                <div className="flex justify-between gap-4">
                  <span className="text-muted-foreground">Status</span>
                  <StatusBadge status={viewAdmin.status} />
                </div>
                <div className="flex justify-between gap-4">
                  <span className="text-muted-foreground">Last Login</span>
                  <span>{formatLastLogin(viewAdmin.lastLogin)}</span>
                </div>
                <div className="flex justify-between gap-4">
                  <span className="text-muted-foreground">Created Date</span>
                  <span>{formatDate(viewAdmin.createdAt)}</span>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setViewAdmin(null)}>
                  Close
                </Button>
                <Button variant="gold" onClick={() => { openEditForm(viewAdmin); setViewAdmin(null) }}>
                  Edit Admin
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>

      <ConfirmDialog
        open={deleteTarget !== null}
        onOpenChange={(open) => !open && setDeleteTarget(null)}
        title="Delete Admin"
        description={
          deleteTarget
            ? `Are you sure you want to delete ${deleteTarget.fullName}? This action cannot be undone.`
            : ''
        }
        confirmLabel="Delete"
        destructive
        onConfirm={handleDelete}
      />

      <ConfirmDialog
        open={statusTarget !== null}
        onOpenChange={(open) => !open && setStatusTarget(null)}
        title={statusTarget?.nextStatus === 'Active' ? 'Activate Admin' : 'Deactivate Admin'}
        description={
          statusTarget
            ? statusTarget.nextStatus === 'Active'
              ? `Activate ${statusTarget.admin.fullName} so they can sign in and access the admin panel.`
              : `Deactivate ${statusTarget.admin.fullName} to prevent sign-in until reactivated.`
            : ''
        }
        confirmLabel={statusTarget?.nextStatus === 'Active' ? 'Activate' : 'Deactivate'}
        onConfirm={handleStatusChange}
      />

    </div>
  )
}
