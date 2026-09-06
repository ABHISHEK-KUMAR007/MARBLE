import { useMemo, useState, useEffect, type ChangeEvent, type FormEvent, type ReactNode } from 'react'
import {
  CheckCircle,
  Eye,
  Layers,
  Package,
} from 'lucide-react'
import {
  Area,
  AreaChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { PageHeader } from '@/components/admin/PageHeader'
import { EmptyState } from '@/components/admin/EmptyState'
import { Pagination } from '@/components/admin/Pagination'
import { SearchInput } from '@/components/admin/SearchInput'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { StatusBadge } from '@/components/admin/StatusBadge'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { toast } from 'sonner'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
// Removed mock data imports
import type {
  CompanyProfile,
  
} from '@/types'
import { apiClient, API_BASE_URL } from '@/api/client'
import { authService } from '@/services/authService'
import { ProductFormDialog } from '@/components/admin/forms/ProductFormDialog'
import { CategoryFormDialog } from '@/components/admin/forms/CategoryFormDialog'
import { BannerFormDialog } from '@/components/admin/forms/BannerFormDialog'
import { GalleryFormDialog } from '@/components/admin/forms/GalleryFormDialog'
import { VideoFormDialog } from '@/components/admin/forms/VideoFormDialog'
import { BlogFormDialog } from '@/components/admin/forms/BlogFormDialog'
import { TestimonialFormDialog } from '@/components/admin/forms/TestimonialFormDialog'
import { ProjectFormDialog } from '@/components/admin/forms/ProjectFormDialog'

import { ConfirmDialog } from '@/components/admin/ConfirmDialog'
import { Edit2, Trash2, MoreHorizontal } from 'lucide-react'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'

const currencies = new Intl.NumberFormat('en-IN', {
  style: 'currency',
  currency: 'INR',
  maximumFractionDigits: 0,
})

function formatMoney(value: number) {
  return currencies.format(value)
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }).format(new Date(value))
}

const chartColors = ['#F59E0B', '#14B8A6', '#22C55E', '#2563EB']

function listSearchFilter<T extends { id: string }>(items: T[], query: string, keys: (keyof T)[]) {
  const search = query.trim().toLowerCase()
  if (!search) return items
  return items.filter((item) => keys.some((key) => String(item[key]).toLowerCase().includes(search)))
}

function renderTable<T extends { id: string }>(
  items: T[],
  columns: { heading: string; content: (item: T) => ReactNode }[],
) {
  return (
    <div className="overflow-x-auto rounded-xl border bg-card">
      <table className="w-full min-w-[640px] text-sm">
        <thead>
          <tr className="border-b bg-muted/50 text-left text-xs uppercase tracking-wider text-muted-foreground">
            {columns.map((column) => (
              <th key={column.heading} className="px-4 py-3 font-medium">
                {column.heading}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y">
          {items.map((item) => (
            <tr key={item.id} className="hover:bg-muted/30 transition-colors">
              {columns.map((column, index) => (
                <td key={`${item.id}-${column.heading}-${index}`} className="px-4 py-3 align-top">
                  {column.content(item)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export function DashboardPage() {
  const [dashboardStats, setDashboardStats] = useState<any>({ totalProducts: 0, activeProducts: 0, totalCategories: 0, websiteVisitors: 0 })
  const [visitorsTrend, setVisitorsTrend] = useState<any[]>([])
  const [inquirySummary, setInquirySummary] = useState<any[]>([])
  const [recentInquiries, setRecentInquiries] = useState<any[]>([])
  const [topCategories, setTopCategories] = useState<any[]>([])
  const [activityLogs, setActivityLogs] = useState<any[]>([])

  useEffect(() => {
    apiClient.get<any>('/admin/dashboard/stats').then(setDashboardStats).catch(console.error)
    apiClient.get<any>('/admin/dashboard/charts').then(res => setVisitorsTrend(res.visitorsTrend || [])).catch(console.error)
    apiClient.get<any[]>('/admin/dashboard/inquiry-summary').then(setInquirySummary).catch(console.error)
    apiClient.get<any[]>('/admin/dashboard/recent-inquiries').then(setRecentInquiries).catch(console.error)
    apiClient.get<any[]>('/admin/dashboard/top-categories').then(setTopCategories).catch(console.error)
    apiClient.get<any[]>('/admin/dashboard/activity-logs').then(setActivityLogs).catch(console.error)
  }, [])

  return (
    <div className="space-y-6">
      <PageHeader
        title="Dashboard"
        description="Monitor core marble business metrics and recent admin activity."
      />

      <div className="grid gap-4 xl:grid-cols-4">
        <Card>
          <CardContent className="p-5">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Total Products</p>
                <p className="mt-3 font-display text-3xl">{dashboardStats.totalProducts}</p>
              </div>
              <div className="grid h-12 w-12 place-items-center rounded-2xl bg-accent/15 text-accent">
                <Package className="h-5 w-5" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-5">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Active Products</p>
                <p className="mt-3 font-display text-3xl">{dashboardStats.activeProducts}</p>
              </div>
              <div className="grid h-12 w-12 place-items-center rounded-2xl bg-forest/10 text-forest">
                <CheckCircle className="h-5 w-5" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-5">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Categories</p>
                <p className="mt-3 font-display text-3xl">{dashboardStats.totalCategories}</p>
              </div>
              <div className="grid h-12 w-12 place-items-center rounded-2xl bg-primary/10 text-primary">
                <Layers className="h-5 w-5" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-5">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Website Visitors</p>
                <p className="mt-3 font-display text-3xl">{dashboardStats.websiteVisitors}</p>
              </div>
              <div className="grid h-12 w-12 place-items-center rounded-2xl bg-accent/15 text-accent">
                <Eye className="h-5 w-5" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 xl:grid-cols-3">
        <Card className="xl:col-span-2">
          <CardHeader className="flex flex-col gap-1">
            <CardTitle>Monthly Website Traffic</CardTitle>
            <CardDescription>Visitors trend for the past 12 months.</CardDescription>
          </CardHeader>
          <CardContent className="h-[320px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={visitorsTrend} margin={{ top: 12, right: 20, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="visitorsGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#F59E0B" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#F59E0B" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                <XAxis dataKey="name" tickLine={false} axisLine={false} />
                <YAxis tickLine={false} axisLine={false} />
                <Tooltip />
                <Area type="monotone" dataKey="value" stroke="#F59E0B" fill="url(#visitorsGradient)" strokeWidth={3} />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Inquiry Status</CardTitle>
            <CardDescription>Distribution of inquiries by status.</CardDescription>
          </CardHeader>
          <CardContent className="h-[320px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={inquirySummary} dataKey="value" nameKey="name" innerRadius={56} outerRadius={96} fill="#F59E0B" stroke="transparent">
                  {inquirySummary.map((entry, index) => (
                    <Cell key={entry.name} fill={chartColors[index % chartColors.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 xl:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Recent Inquiries</CardTitle>
            <CardDescription>Stay on top of the newest customer requests.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[620px] text-sm">
                <thead className="border-b bg-muted/50 text-left text-xs uppercase tracking-wider text-muted-foreground">
                  <tr>
                    <th className="px-4 py-3">Customer</th>
                    <th className="px-4 py-3">Product</th>
                    <th className="px-4 py-3">City</th>
                    <th className="px-4 py-3">Date</th>
                    <th className="px-4 py-3">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {recentInquiries.map((inquiry) => (
                    <tr key={inquiry.id} className="hover:bg-muted/30 transition-colors">
                      <td className="px-4 py-3">{inquiry.customerName}</td>
                      <td className="px-4 py-3">{inquiry.interestedProduct}</td>
                      <td className="px-4 py-3">{inquiry.city}</td>
                      <td className="px-4 py-3">{formatDate(inquiry.inquiryDate)}</td>
                      <td className="px-4 py-3">
                        <StatusBadge status={inquiry.status} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Top Categories</CardTitle>
            <CardDescription>Top performing product collections this quarter.</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-3">
            {topCategories.map((category) => (
              <div key={category.title} className="rounded-3xl border border-border bg-muted p-4">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="text-sm text-muted-foreground">{category.title}</p>
                    <p className="mt-1 font-display text-xl">{category.count} items</p>
                  </div>
                  <div className="rounded-2xl bg-secondary/10 px-3 py-1 text-xs font-medium text-secondary-foreground">
                    {category.trend}
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent Admin Activity</CardTitle>
          <CardDescription>Recent account actions from your administrator team.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {activityLogs.map((log) => (
            <div key={log.id} className="flex flex-col rounded-3xl border border-border bg-muted p-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="font-medium">{log.action}</p>
                <p className="text-sm text-muted-foreground">{log.adminUser} · {log.module}</p>
              </div>
              <p className="text-sm text-muted-foreground">{log.createdAt ? formatDate(log.createdAt) : ''}</p>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  )
}

export function ProductsPage() {
  const [query, setQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive'>('all')
  const [page, setPage] = useState(1)

  const [data, setData] = useState<any[]>([])
  const [, setIsLoading] = useState(true)
  const [refreshKey, setRefreshKey] = useState(0)
  const [formOpen, setFormOpen] = useState(false)
  const [editingItem, setEditingItem] = useState<any | null>(null)
  const [deleteTarget, setDeleteTarget] = useState<any | null>(null)

  const reloadData = () => setRefreshKey(prev => prev + 1)

  useEffect(() => {
    apiClient.get<any[]>('/admin/products')
      .then(setData)
      .catch((e) => toast.error(e.message || 'Failed to load products'))
      .finally(() => setIsLoading(false))
  }, [refreshKey])

  const handleDelete = async () => {
    if (!deleteTarget) return
    try {
      await apiClient.delete(`/admin/products/${deleteTarget.id}`)
      toast.success('Product deleted successfully')
      reloadData()
    } catch (e: any) {
      toast.error(e.message || 'Failed to delete product')
    } finally {
      setDeleteTarget(null)
    }
  }

  const filtered = useMemo(() => {
    const result = listSearchFilter(data, query, ['name', 'category', 'availability'])
    return statusFilter === 'all' ? result : result.filter((product) => product.status === statusFilter)
  }, [query, statusFilter, data])

  const pageSize = 5
  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize))
  const pageItems = filtered.slice((page - 1) * pageSize, page * pageSize)

  return (
    <div className="space-y-6">
      <PageHeader title="Products" description="Manage product listings, visibility and inventory." actions={<Button variant="gold" onClick={() => { setEditingItem(null); setFormOpen(true); }}>Add Product</Button>} />
      <div className="grid gap-4 md:grid-cols-[1fr_max-content]">
        <SearchInput value={query} onChange={setQuery} placeholder="Search products" />
        <Select value={statusFilter} onValueChange={(value) => setStatusFilter(value as 'all' | 'active' | 'inactive')}>
          <SelectTrigger className="w-full md:w-48">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="inactive">Inactive</SelectItem>
          </SelectContent>
        </Select>
      </div>
      {pageItems.length ? (
        <>
          {renderTable(pageItems, [
            { heading: 'Name', content: (product) => <div className="font-medium">{product.name}</div> },
            { heading: 'Category', content: (product) => product.category || 'Uncategorized' },
            { heading: 'Price', content: (product) => formatMoney(product.price ?? 0) },
            { heading: 'Availability', content: (product) => product.availability || 'In Stock' },
            { heading: 'Status', content: (product) => <StatusBadge status={product.status || 'Active'} /> },
            { heading: 'Created', content: (product) => product.createdAt ? formatDate(product.createdAt) : '-' },
            { heading: 'Actions', content: (product) => (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8"><MoreHorizontal className="h-4 w-4" /></Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => { setEditingItem(product); setFormOpen(true); }}>
                      <Edit2 className="h-4 w-4 mr-2" /> Edit
                    </DropdownMenuItem>
                    <DropdownMenuItem className="text-destructive focus:text-destructive" onClick={() => setDeleteTarget(product)}>
                      <Trash2 className="h-4 w-4 mr-2" /> Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) 
            }
          ])}
          <Pagination page={page} totalPages={totalPages} onPageChange={setPage} className="mt-4" />
        </>
      ) : (
        <EmptyState
          title="No products matched your search"
          description="Refine the search or change the status filter to see results."
          actionLabel="Reset filters"
          onAction={() => {
            setQuery('')
            setStatusFilter('all')
          }}
        />
      )}
      <ProductFormDialog open={formOpen} onOpenChange={setFormOpen} product={editingItem} onSuccess={reloadData} />
      <ConfirmDialog open={deleteTarget !== null} onOpenChange={(open) => !open && setDeleteTarget(null)} title="Delete Product" description={`Are you sure you want to delete ${deleteTarget?.name}?`} confirmLabel="Delete" destructive onConfirm={handleDelete} />
    </div>
  )
}

export function CategoriesPage() {
  const [query, setQuery] = useState('')
  const [page, setPage] = useState(1)
  const [data, setData] = useState<any[]>([])
  const [, setIsLoading] = useState(true)
  const [refreshKey, setRefreshKey] = useState(0)
  const [formOpen, setFormOpen] = useState(false)
  const [editingItem, setEditingItem] = useState<any | null>(null)
  const [deleteTarget, setDeleteTarget] = useState<any | null>(null)

  const reloadData = () => setRefreshKey(prev => prev + 1)

  useEffect(() => {
    apiClient.get<any[]>('/admin/categories')
      .then(setData)
      .catch((e) => toast.error(e.message || 'Failed to load categories'))
      .finally(() => setIsLoading(false))
  }, [refreshKey])

  const handleDelete = async () => {
    if (!deleteTarget) return
    try {
      await apiClient.delete(`/admin/categories/${deleteTarget.id}`)
      toast.success('Category deleted successfully')
      reloadData()
    } catch (e: any) {
      toast.error(e.message || 'Failed to delete category')
    } finally {
      setDeleteTarget(null)
    }
  }

  const filtered = useMemo(() => listSearchFilter(data, query, ['name', 'shortDescription']), [query, data])
  const pageSize = 5
  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize))
  const pageItems = filtered.slice((page - 1) * pageSize, page * pageSize)

  return (
    <div className="space-y-6">
      <PageHeader title="Categories" description="Organize product categories and display order." actions={<Button variant="gold" onClick={() => { setEditingItem(null); setFormOpen(true); }}>Add Category</Button>} />
      <SearchInput value={query} onChange={setQuery} placeholder="Search categories" />
      {pageItems.length ? (
        <>
          {renderTable(pageItems, [
            { heading: 'Category', content: (category) => <div className="font-medium">{category.name}</div> },

            { heading: 'Actions', content: (category) => (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8"><MoreHorizontal className="h-4 w-4" /></Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => { setEditingItem(category); setFormOpen(true); }}>
                      <Edit2 className="h-4 w-4 mr-2" /> Edit
                    </DropdownMenuItem>
                    <DropdownMenuItem className="text-destructive focus:text-destructive" onClick={() => setDeleteTarget(category)}>
                      <Trash2 className="h-4 w-4 mr-2" /> Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) 
            }
          ])}
          <Pagination page={page} totalPages={totalPages} onPageChange={setPage} className="mt-4" />
        </>
      ) : (
        <EmptyState title="No categories found" description="Try a different keyword or reset the search." actionLabel="Reset search" onAction={() => setQuery('')} />
      )}
      <CategoryFormDialog open={formOpen} onOpenChange={setFormOpen} category={editingItem} onSuccess={reloadData} />
      <ConfirmDialog open={deleteTarget !== null} onOpenChange={(open) => !open && setDeleteTarget(null)} title="Delete Category" description={`Are you sure you want to delete ${deleteTarget?.name}?`} confirmLabel="Delete" destructive onConfirm={handleDelete} />
    </div>
  )
}

export function BannersPage() {
  const [data, setData] = useState<any[]>([])
  const [, setIsLoading] = useState(true)
  const [refreshKey, setRefreshKey] = useState(0)
  const [formOpen, setFormOpen] = useState(false)
  const [editingItem, setEditingItem] = useState<any | null>(null)
  const [deleteTarget, setDeleteTarget] = useState<any | null>(null)

  const reloadData = () => setRefreshKey(prev => prev + 1)

  useEffect(() => {
    apiClient.get<any[]>('/admin/banners')
      .then(setData)
      .catch((e) => toast.error(e.message || 'Failed to load banners'))
      .finally(() => setIsLoading(false))
  }, [refreshKey])

  const handleDelete = async () => {
    if (!deleteTarget) return
    try {
      await apiClient.delete(`/admin/banners/${deleteTarget.id}`)
      toast.success('Banner deleted successfully')
      reloadData()
    } catch (e: any) {
      toast.error(e.message || 'Failed to delete banner')
    } finally {
      setDeleteTarget(null)
    }
  }

  return (
    <div className="space-y-6">
      <PageHeader title="Banners" description="Manage homepage hero banners and promotional slides." actions={<Button variant="gold" onClick={() => { setEditingItem(null); setFormOpen(true); }}>Add Banner</Button>} />
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {data.map((banner) => (
          <Card key={banner.id}>
            <CardHeader className="flex flex-row items-start justify-between">
              <div>
                <CardTitle>{banner.title}</CardTitle>
                <CardDescription>{banner.subtitle}</CardDescription>
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-8 w-8 -mr-2"><MoreHorizontal className="h-4 w-4" /></Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => { setEditingItem(banner); setFormOpen(true); }}>
                    <Edit2 className="h-4 w-4 mr-2" /> Edit
                  </DropdownMenuItem>
                  <DropdownMenuItem className="text-destructive focus:text-destructive" onClick={() => setDeleteTarget(banner)}>
                    <Trash2 className="h-4 w-4 mr-2" /> Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="rounded-3xl border border-border bg-muted p-4 text-sm text-muted-foreground overflow-hidden">
                {banner.image ? <img src={banner.image} alt={banner.title} className="w-full h-auto object-cover rounded" /> : 'Preview unavailable'}
              </div>
              <div className="space-y-1 text-sm">
                <p><span className="font-medium">Link:</span> {banner.link}</p>
                <p><span className="font-medium">Status:</span> <StatusBadge status={banner.active ? 'Active' : 'Inactive'} /></p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      <BannerFormDialog open={formOpen} onOpenChange={setFormOpen} banner={editingItem} onSuccess={reloadData} />
      <ConfirmDialog open={deleteTarget !== null} onOpenChange={(open) => !open && setDeleteTarget(null)} title="Delete Banner" description={`Are you sure you want to delete this banner?`} confirmLabel="Delete" destructive onConfirm={handleDelete} />
    </div>
  )
}

export function GalleryPage() {
  const [data, setData] = useState<any[]>([])
  const [, setIsLoading] = useState(true)
  const [refreshKey, setRefreshKey] = useState(0)
  const [formOpen, setFormOpen] = useState(false)
  const [editingItem, setEditingItem] = useState<any | null>(null)
  const [deleteTarget, setDeleteTarget] = useState<any | null>(null)

  const reloadData = () => setRefreshKey(prev => prev + 1)

  useEffect(() => {
    apiClient.get<any[]>('/admin/gallery')
      .then(setData)
      .catch((e) => toast.error(e.message || 'Failed to load gallery'))
      .finally(() => setIsLoading(false))
  }, [refreshKey])

  const handleDelete = async () => {
    if (!deleteTarget) return
    try {
      await apiClient.delete(`/admin/gallery/${deleteTarget.id}`)
      toast.success('Gallery image deleted successfully')
      reloadData()
    } catch (e: any) {
      toast.error(e.message || 'Failed to delete gallery image')
    } finally {
      setDeleteTarget(null)
    }
  }

  return (
    <div className="space-y-6">
      <PageHeader title="Gallery" description="Upload and curate premium stone portfolio images." actions={<Button variant="gold" onClick={() => { setEditingItem(null); setFormOpen(true); }}>Add Images</Button>} />
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {data.map((item) => (
          <Card key={item.id}>
            <CardHeader className="flex flex-row items-start justify-between p-4 pb-0">
              <div />
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-8 w-8 -mr-2"><MoreHorizontal className="h-4 w-4" /></Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => { setEditingItem(item); setFormOpen(true); }}>
                    <Edit2 className="h-4 w-4 mr-2" /> Edit
                  </DropdownMenuItem>
                  <DropdownMenuItem className="text-destructive focus:text-destructive" onClick={() => setDeleteTarget(item)}>
                    <Trash2 className="h-4 w-4 mr-2" /> Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </CardHeader>
            <CardContent className="space-y-3 pt-2">
              <div className="rounded-3xl border border-border bg-muted p-2 text-center text-sm text-muted-foreground overflow-hidden h-40">
                {item.image ? <img src={item.image} alt={item.title} className="w-full h-full object-cover rounded" /> : 'No image'}
              </div>
              <div>
                <p className="font-medium">{item.title}</p>
                <p className="text-sm text-muted-foreground">{item.category}</p>
                <div className="mt-2"><StatusBadge status={item.active ? 'Active' : 'Inactive'} /></div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      <GalleryFormDialog open={formOpen} onOpenChange={setFormOpen} gallery={editingItem} onSuccess={reloadData} />
      <ConfirmDialog open={deleteTarget !== null} onOpenChange={(open) => !open && setDeleteTarget(null)} title="Delete Image" description={`Are you sure you want to delete ${deleteTarget?.title}?`} confirmLabel="Delete" destructive onConfirm={handleDelete} />
    </div>
  )
}

export function VideosPage() {
  const [data, setData] = useState<any[]>([])
  const [, setIsLoading] = useState(true)
  const [refreshKey, setRefreshKey] = useState(0)
  const [formOpen, setFormOpen] = useState(false)
  const [editingItem, setEditingItem] = useState<any | null>(null)
  const [deleteTarget, setDeleteTarget] = useState<any | null>(null)

  const reloadData = () => setRefreshKey(prev => prev + 1)

  useEffect(() => {
    apiClient.get<any[]>('/admin/videos')
      .then(setData)
      .catch((e) => toast.error(e.message || 'Failed to load videos'))
      .finally(() => setIsLoading(false))
  }, [refreshKey])

  const handleDelete = async () => {
    if (!deleteTarget) return
    try {
      await apiClient.delete(`/admin/videos/${deleteTarget.id}`)
      toast.success('Video deleted successfully')
      reloadData()
    } catch (e: any) {
      toast.error(e.message || 'Failed to delete video')
    } finally {
      setDeleteTarget(null)
    }
  }

  return (
    <div className="space-y-6">
      <PageHeader title="Videos" description="Manage product and brand video content." actions={<Button variant="gold" onClick={() => { setEditingItem(null); setFormOpen(true); }}>Add Video</Button>} />
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {data.map((video) => (
          <Card key={video.id}>
            <CardHeader className="flex flex-row items-start justify-between pb-2">
              <CardTitle>{video.title || 'Untitled'}</CardTitle>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-8 w-8 -mr-2"><MoreHorizontal className="h-4 w-4" /></Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => { setEditingItem(video); setFormOpen(true); }}>
                    <Edit2 className="h-4 w-4 mr-2" /> Edit
                  </DropdownMenuItem>
                  <DropdownMenuItem className="text-destructive focus:text-destructive" onClick={() => setDeleteTarget(video)}>
                    <Trash2 className="h-4 w-4 mr-2" /> Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="rounded-xl border border-border overflow-hidden h-32 bg-muted relative">
                {video.thumbnail ? <img src={video.thumbnail} alt={video.title} className="w-full h-full object-cover" /> : <div className="absolute inset-0 flex items-center justify-center text-xs text-muted-foreground">No thumbnail</div>}
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <StatusBadge status={video.active ? 'Active' : 'Inactive'} />
                <Button asChild size="sm" variant="outline">
                  <a href={video.youtubeUrl} target="_blank" rel="noreferrer">Preview</a>
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      <VideoFormDialog open={formOpen} onOpenChange={setFormOpen} video={editingItem} onSuccess={reloadData} />
      <ConfirmDialog open={deleteTarget !== null} onOpenChange={(open) => !open && setDeleteTarget(null)} title="Delete Video" description={`Are you sure you want to delete this video?`} confirmLabel="Delete" destructive onConfirm={handleDelete} />
    </div>
  )
}

export function ProjectsPage() {
  const [data, setData] = useState<any[]>([])
  const [, setIsLoading] = useState(true)
  const [refreshKey, setRefreshKey] = useState(0)
  const [formOpen, setFormOpen] = useState(false)
  const [editingItem, setEditingItem] = useState<any | null>(null)
  const [deleteTarget, setDeleteTarget] = useState<any | null>(null)
  const [viewProject, setViewProject] = useState<any | null>(null)

  const reloadData = () => setRefreshKey((prev) => prev + 1)

  useEffect(() => {
    setIsLoading(true)

    apiClient
      .get<any[]>('/admin/projects')
      .then(setData)
      .catch((e) =>
        toast.error(e.message || 'Failed to load projects')
      )
      .finally(() => setIsLoading(false))
  }, [refreshKey])

  const handleDelete = async () => {
    if (!deleteTarget) return

    try {
      await apiClient.delete(`/admin/projects/${deleteTarget.id}`)

      toast.success('Project deleted successfully')
      reloadData()
    } catch (e: any) {
      toast.error(e.message || 'Failed to delete project')
    } finally {
      setDeleteTarget(null)
    }
  }
  const handleViewProject = async (project: any) => {
    try {
      const fullProject = await apiClient.get<any>(
        `/admin/projects/${project.id}`
      )

      setViewProject(fullProject)
    } catch (e: any) {
      toast.error(
        e.message || 'Failed to load project details'
      )
    }
  }

  return (
    <div className="space-y-6">

      <PageHeader
        title="Projects"
        description="Showcase finished marble and stone projects."
        actions={
          <Button
            variant="gold"
            onClick={() => {
              setEditingItem(null)
              setFormOpen(true)
            }}
          >
            Add Project
          </Button>
        }
      />

      {/* Projects */}
      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">

        {data.map((project) => {

          const projectName =
            project.name || project.title || 'Untitled Project'

          const images = Array.isArray(project.images)
            ? project.images
            : []

          const videos = Array.isArray(project.videos)
            ? project.videos
            : []

          const primaryImage =
            images.length > 0
              ? images[0]
              : project.image || null

          return (
            <Card
              key={project.id}
              className="overflow-hidden"
            >

              {/* Project Image */}
              <div className="relative aspect-[16/10] bg-muted">

                {primaryImage ? (
                  <img
                    src={primaryImage}
                    alt={projectName}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center text-sm text-muted-foreground">
                    No Image
                  </div>
                )}

                {/* Status */}
                <div className="absolute right-3 top-3">
                  <StatusBadge
                    status={
                      project.active
                        ? 'Active'
                        : 'Inactive'
                    }
                  />
                </div>

              </div>

              {/* Project Content */}
              <CardContent className="space-y-4 p-5">

                <div className="flex items-start justify-between gap-3">

                  <div className="min-w-0">

                    <h2 className="font-display text-xl">
                      {projectName}
                    </h2>

                    {project.title &&
                      project.name &&
                      project.title !== project.name && (
                        <p className="mt-1 text-xs text-muted-foreground">
                          Title: {project.title}
                        </p>
                      )}

                  </div>

                  {/* Actions */}
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                      >
                        ⋮
                      </Button>
                    </DropdownMenuTrigger>

                    <DropdownMenuContent align="end">

                      <DropdownMenuItem
                        onClick={() =>
                          handleViewProject(project)
                        }
                      >
                        View Details
                      </DropdownMenuItem>

                      <DropdownMenuItem
                        onClick={() => {
                          setEditingItem(project)
                          setFormOpen(true)
                        }}
                      >
                        Edit
                      </DropdownMenuItem>

                      <DropdownMenuItem
                        className="text-destructive focus:text-destructive"
                        onClick={() =>
                          setDeleteTarget(project)
                        }
                      >
                        Delete
                      </DropdownMenuItem>

                    </DropdownMenuContent>
                  </DropdownMenu>

                </div>

                {/* Description */}
                <p className="line-clamp-3 text-sm text-muted-foreground">
                  {project.description ||
                    'No description available.'}
                </p>

                {/* Project Information */}
                <div className="grid grid-cols-2 gap-4 border-t pt-4">

                  <div>
                    <p className="text-xs text-muted-foreground">
                      Completion Date
                    </p>

                    <p className="mt-1 text-sm font-medium">
                      {project.completionDate
                        ? formatDate(project.completionDate)
                        : 'N/A'}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs text-muted-foreground">
                      Status
                    </p>

                    <div className="mt-1">
                      <StatusBadge
                        status={
                          project.active
                            ? 'Active'
                            : 'Inactive'
                        }
                      />
                    </div>
                  </div>

                  <div>
                    <p className="text-xs text-muted-foreground">
                      Images
                    </p>

                    <p className="mt-1 text-sm font-medium">
                      {images.length}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs text-muted-foreground">
                      Videos
                    </p>

                    <p className="mt-1 text-sm font-medium">
                      {videos.length}
                    </p>
                  </div>

                </div>

                {/* View Details */}
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() =>
                    handleViewProject(project)
                  }
                >
                  View Project Details
                </Button>

              </CardContent>
            </Card>
          )
        })}

      </div>

      {/* Project Details Dialog */}
      <Dialog
        open={viewProject !== null}
        onOpenChange={(open) => {
          if (!open) {
            setViewProject(null)
          }
        }}
      >
        <DialogContent className="max-h-[90vh] max-w-[1000px] overflow-y-auto">

          {viewProject && (() => {

            const projectName =
              viewProject.name ||
              viewProject.title ||
              'Untitled Project'

            const images = Array.isArray(viewProject.images)
              ? viewProject.images
              : []

            const videos = Array.isArray(viewProject.videos)
              ? viewProject.videos
              : []

            const primaryImage =
              images.length > 0
                ? images[0]
                : viewProject.image || null

            return (
              <>
                <DialogHeader>
                  <DialogTitle className="font-display text-3xl">
                    {projectName}
                  </DialogTitle>

                  <DialogDescription>
                    Complete project details
                  </DialogDescription>
                </DialogHeader>

                <div className="space-y-8">

                  {/* Main Image */}
                  {primaryImage && (
                    <div className="overflow-hidden rounded-lg bg-muted">
                      <img
                        src={primaryImage}
                        alt={projectName}
                        className="max-h-[500px] w-full object-cover"
                      />
                    </div>
                  )}

                  {/* Basic Details */}
                  <div className="grid gap-6 md:grid-cols-2">

                    <div>
                      <p className="text-sm font-medium text-muted-foreground">
                        Project Name
                      </p>

                      <p className="mt-1 text-base">
                        {projectName}
                      </p>
                    </div>

                    <div>
                      <p className="text-sm font-medium text-muted-foreground">
                        Project Title
                      </p>

                      <p className="mt-1 text-base">
                        {viewProject.title || 'N/A'}
                      </p>
                    </div>

                    <div>
                      <p className="text-sm font-medium text-muted-foreground">
                        Completion Date
                      </p>

                      <p className="mt-1 text-base">
                        {viewProject.completionDate
                          ? formatDate(
                              viewProject.completionDate
                            )
                          : 'N/A'}
                      </p>
                    </div>

                    <div>
                      <p className="text-sm font-medium text-muted-foreground">
                        Status
                      </p>

                      <div className="mt-1">
                        <StatusBadge
                          status={
                            viewProject.active
                              ? 'Active'
                              : 'Inactive'
                          }
                        />
                      </div>
                    </div>

                  </div>

                  {/* Description */}
                  <div>
                    <h3 className="font-display text-xl">
                      Description
                    </h3>

                    <p className="mt-3 whitespace-pre-line text-sm leading-7 text-muted-foreground">
                      {viewProject.description ||
                        'No description available.'}
                    </p>
                  </div>

                  {/* Image Gallery */}
                  {images.length > 0 && (
                    <div>

                      <div className="mb-4 flex items-center justify-between">
                        <h3 className="font-display text-xl">
                          Image Gallery
                        </h3>

                        <span className="text-sm text-muted-foreground">
                          {images.length} Images
                        </span>
                      </div>

                      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">

                        {images.map(
                          (
                            image: string,
                            index: number
                          ) => (
                            <div
                              key={index}
                              className="aspect-[4/3] overflow-hidden rounded-lg bg-muted"
                            >
                              <img
                                src={image}
                                alt={`${projectName} - Image ${
                                  index + 1
                                }`}
                                loading="lazy"
                                className="h-full w-full object-cover transition-transform duration-500 hover:scale-105"
                              />
                            </div>
                          )
                        )}

                      </div>
                    </div>
                  )}

                  {/* Videos */}
                  {videos.length > 0 && (
                    <div>

                      <div className="mb-4 flex items-center justify-between">
                        <h3 className="font-display text-xl">
                          Project Videos
                        </h3>

                        <span className="text-sm text-muted-foreground">
                          {videos.length} Videos
                        </span>
                      </div>

                      <div className="grid gap-6 md:grid-cols-2">

                        {videos.map(
                          (
                            video: string,
                            index: number
                          ) => (
                            <div
                              key={index}
                              className="overflow-hidden rounded-lg bg-black"
                            >
                              <video
                                src={video}
                                controls
                                preload="metadata"
                                className="aspect-video h-full w-full"
                              />
                            </div>
                          )
                        )}

                      </div>
                    </div>
                  )}

                </div>
              </>
            )
          })()}

        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <ConfirmDialog
        open={deleteTarget !== null}
        onOpenChange={(open) =>
          !open && setDeleteTarget(null)
        }
        title="Delete Project"
        description={`Are you sure you want to delete ${
          deleteTarget?.name ||
          deleteTarget?.title ||
          'this project'
        }?`}
        confirmLabel="Delete"
        destructive
        onConfirm={handleDelete}
      />

      <ProjectFormDialog
        open={formOpen}
        onOpenChange={setFormOpen}
        project={editingItem}
        onSuccess={reloadData}
      />

    </div>
  )
}

export function BlogsPage() {
  const [query, setQuery] = useState('')
  const [data, setData] = useState<any[]>([])
  const [, setIsLoading] = useState(true)
  const [refreshKey, setRefreshKey] = useState(0)
  const [formOpen, setFormOpen] = useState(false)
  const [editingItem, setEditingItem] = useState<any | null>(null)
  const [deleteTarget, setDeleteTarget] = useState<any | null>(null)

  const reloadData = () => setRefreshKey(prev => prev + 1)

  useEffect(() => {
    apiClient.get<any[]>('/admin/blogs')
      .then(setData)
      .catch((e) => toast.error(e.message || 'Failed to load blogs'))
      .finally(() => setIsLoading(false))
  }, [refreshKey])

  const handleDelete = async () => {
    if (!deleteTarget) return
    try {
      await apiClient.delete(`/admin/blogs/${deleteTarget.id}`)
      toast.success('Blog deleted successfully')
      reloadData()
    } catch (e: any) {
      toast.error(e.message || 'Failed to delete blog')
    } finally {
      setDeleteTarget(null)
    }
  }

  const filtered = useMemo(() => listSearchFilter(data, query, ['title', 'excerpt']), [query, data])

  return (
    <div className="space-y-6">
      <PageHeader title="Blogs" description="Publish and manage blog posts for the website." actions={<Button variant="gold" onClick={() => { setEditingItem(null); setFormOpen(true); }}>Add Blog</Button>} />
      <SearchInput value={query} onChange={setQuery} placeholder="Search blog posts" />
      {filtered.length ? (
        renderTable(filtered, [
          { heading: 'Title', content: (blog) => <div className="font-medium">{blog.title}</div> },

          { heading: 'Date', content: (blog) => (blog.date ? formatDate(blog.date) : 'Draft') },
          { heading: 'Actions', content: (blog) => (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-8 w-8"><MoreHorizontal className="h-4 w-4" /></Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => { setEditingItem(blog); setFormOpen(true); }}>
                    <Edit2 className="h-4 w-4 mr-2" /> Edit
                  </DropdownMenuItem>
                  <DropdownMenuItem className="text-destructive focus:text-destructive" onClick={() => setDeleteTarget(blog)}>
                    <Trash2 className="h-4 w-4 mr-2" /> Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) 
          }
        ])
      ) : (
        <EmptyState title="No blog posts found" description="Use a different keyword to locate your blog content." actionLabel="Reset search" onAction={() => setQuery('')} />
      )}
      <BlogFormDialog open={formOpen} onOpenChange={setFormOpen} blog={editingItem} onSuccess={reloadData} />
      <ConfirmDialog open={deleteTarget !== null} onOpenChange={(open) => !open && setDeleteTarget(null)} title="Delete Blog" description={`Are you sure you want to delete ${deleteTarget?.title}?`} confirmLabel="Delete" destructive onConfirm={handleDelete} />
    </div>
  )
}

export function TestimonialsPage() {
  const [data, setData] = useState<any[]>([])
  const [, setIsLoading] = useState(true)
  const [refreshKey, setRefreshKey] = useState(0)
  const [formOpen, setFormOpen] = useState(false)
  const [editingItem, setEditingItem] = useState<any | null>(null)
  const [deleteTarget, setDeleteTarget] = useState<any | null>(null)

  const reloadData = () => setRefreshKey(prev => prev + 1)

  useEffect(() => {
    apiClient.get<any[]>('/admin/testimonials')
      .then(setData)
      .catch((e) => toast.error(e.message || 'Failed to load testimonials'))
      .finally(() => setIsLoading(false))
  }, [refreshKey])

  const handleDelete = async () => {
    if (!deleteTarget) return
    try {
      await apiClient.delete(`/admin/testimonials/${deleteTarget.id}`)
      toast.success('Testimonial deleted successfully')
      reloadData()
    } catch (e: any) {
      toast.error(e.message || 'Failed to delete testimonial')
    } finally {
      setDeleteTarget(null)
    }
  }

  return (
    <div className="space-y-6">
      <PageHeader title="Testimonials" description="Review customer feedback and status updates." actions={<Button variant="gold" onClick={() => { setEditingItem(null); setFormOpen(true); }}>Add Testimonial</Button>} />
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {data.map((testimonial) => (
          <Card key={testimonial.id}>
            <CardContent className="pt-6">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="grid h-10 w-10 place-items-center rounded-full bg-muted text-muted-foreground">{testimonial.name ? testimonial.name.charAt(0) : 'U'}</div>
                  <div>
                    <p className="font-medium">{testimonial.name}</p>
                    <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                  </div>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8 -mt-2 -mr-2"><MoreHorizontal className="h-4 w-4" /></Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => { setEditingItem(testimonial); setFormOpen(true); }}>
                      <Edit2 className="h-4 w-4 mr-2" /> Edit
                    </DropdownMenuItem>
                    <DropdownMenuItem className="text-destructive focus:text-destructive" onClick={() => setDeleteTarget(testimonial)}>
                      <Trash2 className="h-4 w-4 mr-2" /> Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
              <p className="mt-4 text-sm text-muted-foreground italic">"{testimonial.quote}"</p>
              <div className="mt-4 flex flex-wrap gap-2 text-sm text-muted-foreground">
                <span>Rating: {testimonial.rating}/5</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      <TestimonialFormDialog open={formOpen} onOpenChange={setFormOpen} testimonial={editingItem} onSuccess={reloadData} />
      <ConfirmDialog open={deleteTarget !== null} onOpenChange={(open) => !open && setDeleteTarget(null)} title="Delete Testimonial" description={`Are you sure you want to delete ${deleteTarget?.name}'s testimonial?`} confirmLabel="Delete" destructive onConfirm={handleDelete} />
    </div>
  )
}

export function InquiriesPage() {
  const [query, setQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState<'all' | 'Pending' | 'Contacted' | 'In Progress' | 'Completed' | 'Rejected'>('all')
  const [data, setData] = useState<any[]>([])
  const [, setIsLoading] = useState(true)
  const [refreshKey, setRefreshKey] = useState(0)
  const [deleteTarget, setDeleteTarget] = useState<any | null>(null)

  const reloadData = () => setRefreshKey(prev => prev + 1)

  useEffect(() => {
    apiClient.get<any[]>('/admin/inquiries')
      .then(setData)
      .catch((e) => toast.error(e.message || 'Failed to load inquiries'))
      .finally(() => setIsLoading(false))
  }, [refreshKey])

  const handleDelete = async () => {
    if (!deleteTarget) return
    try {
      await apiClient.delete(`/admin/inquiries/${deleteTarget.id}`)
      toast.success('Inquiry deleted successfully')
      reloadData()
    } catch(err) {
      toast.error("Failed to delete inquiry")
      console.error(err)
    }
    finally{
      setDeleteTarget(null)
    }
  }

  const handleUpdateStatus = async (inquiry: any, status: string) => {
    try {
      await apiClient.patch(`/admin/inquiries/${inquiry.id}/status?status=${status}`, {})
      toast.success('Status updated')
      reloadData()
    } catch (e: any) {
      toast.error(e.message || 'Failed to update status')
    }
  }

  const filtered = useMemo(() => {
    const result = listSearchFilter(data, query, ['customerName', 'email', 'interestedProduct', 'city'])
    return statusFilter === 'all' ? result : result.filter((item) => item.status === statusFilter)
  }, [query, statusFilter, data])

  return (
    <div className="space-y-6">
      <PageHeader title="Inquiries" description="Track incoming customer inquiries and follow up status." actions={<Button variant="gold">New Inquiry</Button>} />
      <div className="grid gap-4 md:grid-cols-[1fr_max-content]">
        <SearchInput value={query} onChange={setQuery} placeholder="Search inquiries" />
        <Select value={statusFilter} onValueChange={(value) => setStatusFilter(value as any)}>
          <SelectTrigger className="w-full md:w-56">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            <SelectItem value="Pending">Pending</SelectItem>
            <SelectItem value="Contacted">Contacted</SelectItem>
            <SelectItem value="In Progress">In Progress</SelectItem>
            <SelectItem value="Completed">Completed</SelectItem>
            <SelectItem value="Rejected">Rejected</SelectItem>
          </SelectContent>
        </Select>
      </div>
      {filtered.length ? (
        renderTable(filtered, [
          { heading: 'Inquiry ID', content: (item) => item.id },
          { heading: 'Customer', content: (item) => item.customerName },
          {
            heading: 'Email',
            content: (item) => item.email || 'N/A',
          },
          {
            heading: 'Phone',
            content: (item) => item.phone || 'N/A',
          },
          { heading: 'Product', content: (item) => item.interestedProduct },
          { heading: 'City', content: (item) => item.city },
          { heading: 'Date', content: (item) => formatDate(item.inquiryDate) },
          {
            heading: 'Description',
            content: (item) => (
              <div
                className="max-w-[300px] truncate"
                title={item.message || item.description || ''}
              >
                {item.message || item.description || 'No description'}
              </div>
            ),
          },
          { heading: 'Status', content: (item) => <StatusBadge status={item.status} /> },
          { heading: 'Actions', content: (item) => (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-8 w-8"><MoreHorizontal className="h-4 w-4" /></Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => window.open(`mailto:${item.email}?subject=Re: Inquiry for ${item.interestedProduct}`)}>
                     Reply via Email
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleUpdateStatus(item, 'In Progress')}>
                     Mark In Progress
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleUpdateStatus(item, 'Completed')}>
                     Mark Completed
                  </DropdownMenuItem>
                  <DropdownMenuItem className="text-destructive focus:text-destructive" onClick={() => setDeleteTarget(item)}>
                    <Trash2 className="h-4 w-4 mr-2" /> Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) 
          },
        ])
      ) : (
        <EmptyState title="No inquiries match the filter" description="Adjust your search or change the status filter to find records." actionLabel="Reset filters" onAction={() => { setQuery(''); setStatusFilter('all') }} />
      )}
      <ConfirmDialog open={deleteTarget !== null} onOpenChange={(open) => !open && setDeleteTarget(null)} title="Delete Inquiry" description={`Are you sure you want to delete this inquiry?`} confirmLabel="Delete" destructive onConfirm={handleDelete} />
    </div>
  )
}

export function CustomersPage() {
  const [query, setQuery] = useState('')
  const [data, setData] = useState<any[]>([])
  const [refreshKey, setRefreshKey] = useState(0)

  useEffect(() => {
    apiClient.get<any[]>('/admin/customers')
      .then(setData)
      .catch((e) => toast.error(e.message || 'Failed to load customers'))
  }, [refreshKey])

  const handleImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const formData = new FormData()
    formData.append('file', file)
    try {
      const token = authService.getAccessToken()
      const response = await fetch(`${API_BASE_URL}/admin/customers/import`, {
        method: 'POST',
        body: formData,
        headers: token ? { Authorization: `Bearer ${token}` } : {}
      })
      if (!response.ok) throw new Error(await response.text())
      toast.success('Customers imported successfully')
      setRefreshKey(k => k + 1)
    } catch (err: any) {
      toast.error(err.message || 'Failed to import customers')
    }
  }

  const filtered = useMemo(() => listSearchFilter(data, query, ['name', 'email', 'city', 'phone']), [query, data])

  return (
    <div className="space-y-6">
      <PageHeader 
        title="Customers" 
        description="Review customer profiles and inquiry history." 
        actions={
          <div className="relative">
            <Button variant="gold" className="relative z-0">Import Customers</Button>
            <input type="file" accept=".csv" onChange={handleImport} className="absolute inset-0 z-10 opacity-0 cursor-pointer" />
          </div>
        } 
      />
      <SearchInput value={query} onChange={setQuery} placeholder="Search customers" />
      {filtered.length ? (
        renderTable(filtered, [
          { heading: 'Name', content: (customer) => customer.name },
          { heading: 'Contact', content: (customer) => `${customer.phone} · ${customer.email}` },
          { heading: 'City', content: (customer) => customer.city },
          { heading: 'Inquiries', content: (customer) => `${customer.totalInquiries}` },
          { heading: 'Last Inquiry', content: (customer) => customer.lastInquiryDate },
        ])
      ) : (
        <EmptyState title="No customers found" description="Try a different keyword to locate the customer." actionLabel="Reset search" onAction={() => setQuery('')} />
      )}
    </div>
  )
}


export function CompanyProfilePage() {
  const [company, setCompany] = useState<CompanyProfile>({} as CompanyProfile)
  const [isSaving, setIsSaving] = useState(false)

  useEffect(() => {
    apiClient.get<CompanyProfile>('/admin/company')
      .then((profile) => setCompany(profile ?? ({} as CompanyProfile)))
      .catch((e) => toast.error(e.message || 'Failed to load company profile'))
  }, [])

  const handleChange = (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = event.target
    setCompany((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault()

    setIsSaving(true)

    try {
      const payload = {
        ...company,
        companyName: company.companyName ?? '',
        phone: company.phone ?? '',
        alternatePhone: company.alternatePhone ?? '',
        email: company.email ?? '',
        aboutCompany: company.aboutCompany ?? '',
        address: company.address ?? '',
        whatsapp: company.whatsapp ?? '',
        googleMapsEmbed: company.googleMapsEmbed ?? '',
        facebook: company.facebook ?? '',
        instagram: company.instagram ?? '',
        youtube: company.youtube ?? '',
        linkedin: company.linkedin ?? '',
        businessHours: company.businessHours ?? '',
      }

      await apiClient.put('/admin/company', payload)
      toast.success('Company profile saved successfully.')
    } catch (e: any) {
      const message = e?.message || 'Failed to update company profile'
      toast.error(message)
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Company Profile"
        description="Update company contact details, social links and business hours."
        actions={
          <Button type="submit" form="company-profile-form" variant="gold" disabled={isSaving}>
            {isSaving ? 'Saving...' : 'Save Profile'}
          </Button>
        }
      />
      <form id="company-profile-form" onSubmit={handleSubmit} className="grid gap-6 lg:grid-cols-2">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Business Information</CardTitle>
            <CardDescription>Update the company profile displayed across the site.</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4">
            <div className="grid gap-3 md:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm font-medium text-muted-foreground">Company Name</label>
                <Input name="companyName" value={company.companyName ?? ''} onChange={handleChange} />
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium text-muted-foreground">Phone</label>
                <Input name="phone" value={company.phone ?? ''} onChange={handleChange} />
              </div>
            </div>
            <div className="grid gap-3 md:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm font-medium text-muted-foreground">Alternate Phone</label>
                <Input name="alternatePhone" value={company.alternatePhone ?? ''} onChange={handleChange} />
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium text-muted-foreground">Email</label>
                <Input name="email" value={company.email ?? ''} onChange={handleChange} />
              </div>
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium text-muted-foreground">About Company</label>
              <Textarea name="aboutCompany" value={company.aboutCompany ?? ''} onChange={handleChange} />
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium text-muted-foreground">Address</label>
              <Textarea name="address" value={company.address ?? ''} onChange={handleChange} />
            </div>
            <div className="grid gap-3 md:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm font-medium text-muted-foreground">WhatsApp</label>
                <Input name="whatsapp" value={company.whatsapp ?? ''} onChange={handleChange} />
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium text-muted-foreground">Google Maps</label>
                <Input name="googleMapsEmbed" value={company.googleMapsEmbed ?? ''} onChange={handleChange} />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Social Links</CardTitle>
            <CardDescription>Keep your profile and contact links up to date.</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm font-medium text-muted-foreground">Facebook</label>
              <Input name="facebook" value={company.facebook ?? ''} onChange={handleChange} />
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium text-muted-foreground">Instagram</label>
              <Input name="instagram" value={company.instagram ?? ''} onChange={handleChange} />
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium text-muted-foreground">YouTube</label>
              <Input name="youtube" value={company.youtube ?? ''} onChange={handleChange} />
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium text-muted-foreground">LinkedIn</label>
              <Input name="linkedin" value={company.linkedin ?? ''} onChange={handleChange} />
            </div>
            <div className="md:col-span-2">
              <label className="mb-2 block text-sm font-medium text-muted-foreground">Business Hours</label>
              <Input name="businessHours" value={company.businessHours ?? ''} onChange={handleChange} />
            </div>
          </CardContent>
        </Card>
      </form>
    </div>
  )
}



export function ActivityLogsPage() {
  const [activityLogs, setActivityLogs] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    setIsLoading(true)

    apiClient
      .get<any[]>('/admin/dashboard/activity-logs')
      .then((response) => {
        console.log('ACTIVITY LOG API RESPONSE:', response)

        setActivityLogs(Array.isArray(response) ? response : [])
      })
      .catch((error) => {
        console.error('ACTIVITY LOG API ERROR:', error)
        toast.error(
          error.message || 'Failed to load activity logs'
        )
        setActivityLogs([])
      })
      .finally(() => {
        setIsLoading(false)
      })
  }, [])

  return (
    <div className="space-y-6">
      <PageHeader
        title="Activity Logs"
        description="Audit recent system actions and administrator activity."
      />

      {isLoading ? (
        <Card>
          <CardContent className="p-6">
            <p className="text-sm text-muted-foreground">
              Loading activity logs...
            </p>
          </CardContent>
        </Card>
      ) : activityLogs.length === 0 ? (
        <Card>
          <CardContent className="p-6">
            <p className="text-sm text-muted-foreground">
              No activity logs found.
            </p>
          </CardContent>
        </Card>
      ) : (
        renderTable(activityLogs, [
          {
            heading: 'Admin',
            content: (log) =>
              log.adminUser ||
              log.adminName ||
              log.username ||
              log.email ||
              'N/A',
          },

          {
            heading: 'Action',
            content: (log) =>
              log.action ||
              log.actionType ||
              log.description ||
              'N/A',
          },

          {
            heading: 'Module',
            content: (log) =>
              log.module ||
              log.moduleName ||
              'N/A',
          },

          {
            heading: 'Date/Time',
            content: (log) => {
              const date =
                log.createdAt ||
                log.date ||
                log.timestamp ||
                log.createdDate

              return date ? formatDate(date) : 'N/A'
            },
          },
        ])
      )}
    </div>
  )
}