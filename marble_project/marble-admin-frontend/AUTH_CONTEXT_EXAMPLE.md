/**
 * EXAMPLE: Enhanced AuthContext with User Management Support
 * 
 * This shows how to extend the existing AuthContext to support role-based navigation
 * and permission checks. Use this as a reference for updating your AuthContext.
 */

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import type { AuthUser, LoginCredentials } from '@/types'
import { authService } from '@/services/authService'
import { mockRoleService } from '@/services/mockRoleService'

interface AuthContextValue {
  user: AuthUser | null
  isAuthenticated: boolean
  isLoading: boolean
  permissions: string[] // NEW: Store user permissions
  login: (credentials: LoginCredentials) => Promise<void>
  logout: () => void
  hasPermission: (permission: string) => boolean // NEW: Quick permission check
  hasAnyPermission: (permissions: string[]) => boolean // NEW: OR-based check
  hasAllPermissions: (permissions: string[]) => boolean // NEW: AND-based check
  hasRole: (roles: string[]) => boolean // NEW: Role check
}

const AuthContext = createContext<AuthContextValue | null>(null)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null)
  const [permissions, setPermissions] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const session = authService.getSession()
    setUser(session?.user ?? null)
    if (session?.user) {
      loadUserPermissions(session.user.role)
    }
    setIsLoading(false)
  }, [])

  const loadUserPermissions = async (role: string) => {
    try {
      const userPermissions = await mockRoleService.getUserPermissions(role)
      setPermissions(userPermissions)
    } catch (error) {
      console.error('Failed to load user permissions:', error)
      setPermissions([])
    }
  }

  const login = useCallback(async (credentials: LoginCredentials) => {
    const { user: loggedInUser } = await authService.login(credentials)
    setUser(loggedInUser)
    await loadUserPermissions(loggedInUser.role)
  }, [])

  const logout = useCallback(() => {
    authService.logout()
    setUser(null)
    setPermissions([])
  }, [])

  const hasPermission = useCallback(
    (permission: string) => permissions.includes(permission),
    [permissions]
  )

  const hasAnyPermission = useCallback(
    (perms: string[]) => perms.some((perm) => permissions.includes(perm)),
    [permissions]
  )

  const hasAllPermissions = useCallback(
    (perms: string[]) => perms.every((perm) => permissions.includes(perm)),
    [permissions]
  )

  const hasRole = useCallback((roles: string[]) => (user ? roles.includes(user.role) : false), [user])

  const value = useMemo(
    () => ({
      user,
      isAuthenticated: !!user,
      isLoading,
      permissions,
      login,
      logout,
      hasPermission,
      hasAnyPermission,
      hasAllPermissions,
      hasRole,
    }),
    [user, isLoading, permissions, login, logout, hasPermission, hasAnyPermission, hasAllPermissions, hasRole]
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}

/**
 * EXAMPLE USAGE IN COMPONENTS
 */

// Example 1: Simple permission check
// function UserManagementButton() {
//   const { hasPermission } = useAuth()
//   if (!hasPermission('users.create')) return null
//   return <button>Add User</button>
// }

// Example 2: Multiple permissions (any)
// function ContentSection() {
//   const { hasAnyPermission } = useAuth()
//   if (!hasAnyPermission(['products.view', 'blogs.view', 'categories.view'])) {
//     return <p>No access to content management</p>
//   }
//   return <ContentManager />
// }

// Example 3: Role-based rendering
// function AdminSettingsPanel() {
//   const { hasRole } = useAuth()
//   if (!hasRole(['Super Admin', 'Admin'])) {
//     return <p>Only admins can access settings</p>
//   }
//   return <AdminSettings />
// }

// Example 4: Sidebar navigation with permissions
// const NAV_ITEMS = [
//   {
//     label: 'Users & Roles',
//     path: '/admin/users',
//     permission: 'users.view',
//     roles: ['Super Admin', 'Admin'],
//   },
//   {
//     label: 'Products',
//     path: '/admin/products',
//     permission: 'products.view',
//     roles: ['Super Admin', 'Admin', 'Content Manager', 'Manager'],
//   },
//   {
//     label: 'Inquiries',
//     path: '/admin/inquiries',
//     permission: 'inquiries.view',
//     roles: ['Super Admin', 'Admin', 'Manager', 'Support Staff'],
//   },
// ]

// function Sidebar() {
//   const { hasPermission, hasRole } = useAuth()
//
//   return (
//     <nav>
//       {NAV_ITEMS.map((item) => {
//         const hasAccess =
//           hasPermission(item.permission) && hasRole(item.roles)
//
//         return hasAccess ? (
//           <Link key={item.path} to={item.path}>
//             {item.label}
//           </Link>
//         ) : null
//       })}
//     </nav>
//   )
// }

export {}
