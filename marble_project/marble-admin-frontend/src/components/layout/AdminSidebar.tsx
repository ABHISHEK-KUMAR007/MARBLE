import { NavLink, useLocation } from 'react-router-dom'
import { useAuth } from '@/context/AuthContext'
import logoIcon from '@/assets/com_logo.jpeg'
import {
  Building2,
  ChevronLeft,
  FolderTree,
  Images,
  LayoutDashboard,
  MessageSquareQuote,
  Newspaper,
  Package,
  PanelLeft,
  Shield,
  SlidersHorizontal,
  Users,
  Video,
  X,
} from 'lucide-react'
import { cn } from '@/lib/utils'

const NAV_GROUPS = [
  {
    label: 'Overview',
    items: [{ to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard }],
  },
  {
    label: 'Content',
    items: [
      { to: '/products', label: 'Products', icon: Package },
      { to: '/categories', label: 'Categories', icon: FolderTree },
      { to: '/banners', label: 'Banners', icon: SlidersHorizontal },
      { to: '/gallery', label: 'Gallery', icon: Images },
      { to: '/videos', label: 'Videos', icon: Video },
      { to: '/projects', label: 'Projects', icon: Building2 },
      { to: '/blogs', label: 'Blogs', icon: Newspaper },
      { to: '/testimonials', label: 'Testimonials', icon: MessageSquareQuote },
    ],
  },
  {
    label: 'CRM',
    items: [
      { to: '/inquiries', label: 'Inquiries', icon: MessageSquareQuote },
      { to: '/customers', label: 'Customers', icon: Users },
    ],
  },
  {
    label: 'Configuration',
    items: [
      { to: '/company-profile', label: 'Company Profile', icon: Building2 },
    ],
  },
  {
    label: 'System',
    items: [
      { to: '/admin-management', label: 'Admin Management', icon: Shield },
      // { to: '/activity-logs', label: 'Activity Logs', icon: Activity },
    ],
  },
]

interface AdminSidebarProps {
  collapsed: boolean
  onToggle: () => void
  mobileOpen: boolean
  onMobileClose: () => void
}

export function AdminSidebar({ collapsed, onToggle, mobileOpen, onMobileClose }: AdminSidebarProps) {
  const location = useLocation()
  const { user } = useAuth()

  // Filter NAV_GROUPS dynamically based on role
  const navGroups = NAV_GROUPS.map(group => ({
    ...group,
    items: group.items.filter(item => 
      !(item.to === '/admin-management' && user?.role !== 'SUPER_ADMIN')
    )
  })).filter(group => group.items.length > 0)

  const content = (
    <div className="flex h-full flex-col bg-sidebar text-sidebar-foreground">
      <div className="flex h-20 items-center justify-between border-b border-sidebar-border px-4">
        <div className={cn('flex items-center gap-3 overflow-hidden', collapsed && 'justify-center w-full')}>
          <img
          src={logoIcon}
          alt="Makrana Marble Art"
          className="h-11 w-11 shrink-0 rounded-lg object-cover"
/>
          {!collapsed && (
            <div className="leading-none">
              <p className="font-display text-[1.2rem] font-semibold tracking-[0.01em]">Markram Marble Art</p>
              <p className="mt-1 text-[10px] uppercase tracking-[0.22em] text-sidebar-foreground/60">Admin Panel</p>
            </div>
          )}
        </div>
        <button
          type="button"
          onClick={onMobileClose}
          className="lg:hidden grid h-8 w-8 place-items-center rounded-md hover:bg-sidebar-accent"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      <nav className="flex-1 overflow-y-auto p-3 space-y-6">
        {navGroups.map((group) => (
          <div key={group.label}>
            {!collapsed && (
              <p className="mb-2 px-3 text-[0.72rem] uppercase tracking-[0.22em] text-sidebar-foreground/50">
                {group.label}
              </p>
            )}
            <ul className="space-y-1">
              {group.items.map((item) => {
                const Icon = item.icon
                const active = location.pathname === item.to || location.pathname.startsWith(`${item.to}/`)
                return (
                  <li key={item.to}>
                    <NavLink
                      to={item.to}
                      onClick={onMobileClose}
                      title={collapsed ? item.label : undefined}
                      className={cn(
                        'flex items-center gap-3 rounded-md px-4 py-3 text-[1rem] font-medium leading-5 transition-colors',
                        collapsed && 'justify-center px-2',
                        active
                          ? 'bg-sidebar-accent text-accent font-medium'
                          : 'text-sidebar-foreground/80 hover:bg-sidebar-accent hover:text-sidebar-foreground',
                      )}
                    >
                      <Icon className={cn('h-5 w-5 shrink-0', active && 'text-accent')} />
                      {!collapsed && item.label}
                    </NavLink>
                  </li>
                )
              })}
            </ul>
          </div>
        ))}
      </nav>

      <div className="border-t border-sidebar-border p-3">
        <button
          type="button"
          onClick={onToggle}
          className="hidden lg:flex w-full items-center gap-3 rounded-md px-3 py-2.5 text-[1rem] font-medium text-sidebar-foreground/80 hover:bg-sidebar-accent hover:text-sidebar-foreground"
        >
          {collapsed ? <PanelLeft className="h-5 w-5" /> : <ChevronLeft className="h-5 w-5" />}
          {!collapsed && 'Collapse'}
        </button>
      </div>
    </div>
  )

  return (
    <>
      <aside
        className={cn(
          'hidden lg:fixed lg:inset-y-0 lg:left-0 lg:z-40 lg:flex lg:flex-col border-r border-sidebar-border transition-all duration-300',
          collapsed ? 'lg:w-[88px]' : 'lg:w-72',
        )}
      >
        {content}
      </aside>

      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black/50" onClick={onMobileClose} />
          <aside className="absolute inset-y-0 left-0 w-72 shadow-luxe">{content}</aside>
        </div>
      )}
    </>
  )
}
