import { useState } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import { AdminSidebar } from '@/components/layout/AdminSidebar'
import { AdminNavbar } from '@/components/layout/AdminNavbar'
import { Breadcrumbs } from '@/components/admin/Breadcrumbs'
import { cn } from '@/lib/utils'

const ROUTE_TITLES: Record<string, { title: string; breadcrumbs: { label: string; href?: string }[] }> = {
  '/dashboard': { title: 'Dashboard', breadcrumbs: [{ label: 'Dashboard' }] },
  '/products': { title: 'Products', breadcrumbs: [{ label: 'Products' }] },
  '/categories': { title: 'Categories', breadcrumbs: [{ label: 'Categories' }] },
  '/banners': { title: 'Banners', breadcrumbs: [{ label: 'Banners' }] },
  '/gallery': { title: 'Gallery', breadcrumbs: [{ label: 'Gallery' }] },
  '/videos': { title: 'Videos', breadcrumbs: [{ label: 'Videos' }] },
  '/projects': { title: 'Projects', breadcrumbs: [{ label: 'Projects' }] },
  '/blogs': { title: 'Blogs', breadcrumbs: [{ label: 'Blogs' }] },
  '/testimonials': { title: 'Testimonials', breadcrumbs: [{ label: 'Testimonials' }] },
  '/inquiries': { title: 'Inquiries', breadcrumbs: [{ label: 'Inquiries' }] },
  '/customers': { title: 'Customers', breadcrumbs: [{ label: 'Customers' }] },
  '/company-profile': { title: 'Company Profile', breadcrumbs: [{ label: 'Company Profile' }] },
  '/admin-management': { title: 'Admin Management', breadcrumbs: [{ label: 'Admin Management' }] },
  // '/activity-logs': { title: 'Activity Logs', breadcrumbs: [{ label: 'Activity Logs' }] },
}

export function AdminLayout() {
  const [collapsed, setCollapsed] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const location = useLocation()
  const routeMeta = ROUTE_TITLES[location.pathname] ?? {
    title: 'Admin',
    breadcrumbs: [{ label: 'Admin' }],
  }

  return (
    <div className="min-h-screen w-full bg-muted/30">
      <AdminSidebar
        collapsed={collapsed}
        onToggle={() => setCollapsed((c) => !c)}
        mobileOpen={mobileOpen}
        onMobileClose={() => setMobileOpen(false)}
      />
      <div className={cn('w-full transition-all duration-300', collapsed ? 'lg:pl-[88px]' : 'lg:pl-[288px]')}>
        <AdminNavbar
          sidebarCollapsed={collapsed}
          onMenuClick={() => setMobileOpen(true)}
          title={routeMeta.title}
        />
        <main className="w-full animate-rise px-4 py-4 sm:px-6 lg:px-8 xl:px-10 2xl:px-14">
          <div className="mb-6 w-full">
            <Breadcrumbs items={routeMeta.breadcrumbs} />
          </div>
          <Outlet />
        </main>
      </div>
    </div>
  )
}
