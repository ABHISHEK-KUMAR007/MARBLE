// IMPLEMENTATION GUIDE FOR USER MANAGEMENT PAGES
// ================================================

// This file shows how to integrate the new User Management pages into your routing.
// The new pages are ready to use with mock data.

// FILE: src/App.tsx or your routing configuration

import { UsersPage, UserFormPage, RolesPermissionsPage } from '@/pages'
import { ProtectedRoute } from '@/components/auth/ProtectedRoute' // Create this if needed

// Add these routes to your React Router configuration:

const adminRoutes = [
  // ... existing routes ...

  // User Management Routes
  {
    path: '/admin/users',
    element: <UsersPage />,
    // Optional: Add permission check
    // element: <PermissionGate permission="users.view"><UsersPage /></PermissionGate>
  },
  {
    path: '/admin/users/new',
    element: <UserFormPage />,
    // Optional: Add permission check
    // element: <PermissionGate permission="users.create"><UserFormPage /></PermissionGate>
  },
  {
    path: '/admin/users/:userId',
    element: <UserFormPage />,
    // Optional: Add permission check
    // element: <PermissionGate permission="users.edit"><UserFormPage /></PermissionGate>
  },
  {
    path: '/admin/roles-permissions',
    element: <RolesPermissionsPage />,
    // Optional: Add permission check (only Super Admin/Admin)
    // element: <RoleGate roles={['Super Admin', 'Admin']}><RolesPermissionsPage /></RoleGate>
  },

  // ... rest of your routes ...
]

// ============================================
// SIDEBAR/NAVIGATION UPDATES
// ============================================

// FILE: src/components/admin/Sidebar.tsx (or similar)

// Add these menu items to your navigation:

const adminMenuItems = [
  // ... existing items ...

  {
    section: 'Admin Management',
    items: [
      {
        label: 'Users & Roles',
        icon: Users,
        path: '/admin/users',
        badge: null, // Can show count of users
        // Only show to Super Admin and Admin
        roles: ['Super Admin', 'Admin'],
      },
      {
        label: 'Roles & Permissions',
        icon: Shield,
        path: '/admin/roles-permissions',
        badge: null,
        // Only show to Super Admin
        roles: ['Super Admin'],
      },
      {
        label: 'Activity Logs',
        icon: Activity,
        path: '/admin/activity-logs',
        badge: null,
        // Show to Super Admin and Admin
        roles: ['Super Admin', 'Admin'],
      },
    ],
  },
]

// Render with permission check:
{
  adminMenuItems.map((section) => (
    <div key={section.section}>
      {section.items.map((item) => {
        // Check if user's role is in allowed roles
        const canAccess = item.roles?.includes(user.role) ?? true

        return canAccess ? (
          <Link
            key={item.path}
            to={item.path}
            className="menu-item"
          >
            {item.icon && <item.icon className="w-4 h-4" />}
            {item.label}
            {item.badge && <span className="badge">{item.badge}</span>}
          </Link>
        ) : null
      })}
    </div>
  ))
}

// ============================================
// PROTECTED ROUTE COMPONENT
// ============================================

// FILE: src/components/auth/ProtectedRoute.tsx

import { useAuth } from '@/context/AuthContext'
import { usePermission, useRole } from '@/hooks/useAuthorization'
import { Navigate } from 'react-router-dom'

export interface ProtectedRouteProps {
  children: React.ReactNode
  requiredPermission?: string
  requiredRole?: string[]
  fallback?: React.ReactNode
}

export function ProtectedRoute({
  children,
  requiredPermission,
  requiredRole,
  fallback = <Navigate to="/login" />,
}: ProtectedRouteProps) {
  const { user, isLoading } = useAuth()
  const { hasPermission: hasPerms } = usePermission(requiredPermission || '')
  const userRole = useRole(...(requiredRole || []))

  if (isLoading) {
    return <div>Loading...</div>
  }

  if (!user) {
    return fallback
  }

  // Check permission if required
  if (requiredPermission && !hasPerms) {
    return fallback
  }

  // Check role if required
  if (requiredRole && !userRole) {
    return fallback
  }

  return children
}

// Usage:
// <ProtectedRoute requiredPermission="users.view">
//   <UsersPage />
// </ProtectedRoute>

// Or with role:
// <ProtectedRoute requiredRole={['Super Admin', 'Admin']}>
//   <RolesPermissionsPage />
// </ProtectedRoute>

// ============================================
// API SERVICE (WHEN BACKEND IS READY)
// ============================================

// FILE: src/services/userService.ts (Replace mock service)

import { apiClient } from '@/lib/apiClient'
import type { AdminUser, CreateUserRequest } from '@/types/user'

export const userService = {
  // Get all users
  getAllUsers: async (): Promise<AdminUser[]> => {
    const response = await apiClient.get('/api/auth/users')
    return response.data
  },

  // Get single user
  getUserById: async (id: string): Promise<AdminUser> => {
    const response = await apiClient.get(`/api/auth/users/${id}`)
    return response.data
  },

  // Create new user
  createUser: async (data: CreateUserRequest): Promise<AdminUser> => {
    const response = await apiClient.post('/api/auth/users', data)
    return response.data
  },

  // Update user
  updateUser: async (id: string, data: Partial<AdminUser>): Promise<AdminUser> => {
    const response = await apiClient.put(`/api/auth/users/${id}`, data)
    return response.data
  },

  // Delete user
  deleteUser: async (id: string): Promise<void> => {
    await apiClient.delete(`/api/auth/users/${id}`)
  },

  // Resend invitation
  resendInvitation: async (userId: string): Promise<void> => {
    await apiClient.post(`/api/auth/users/${userId}/invite`)
  },

  // Reset password
  resetPassword: async (userId: string): Promise<void> => {
    await apiClient.post(`/api/auth/users/${userId}/reset`)
  },

  // Change user role
  changeUserRole: async (userId: string, newRole: string): Promise<AdminUser> => {
    const response = await apiClient.put(`/api/auth/users/${userId}`, { role: newRole })
    return response.data
  },

  // Change user status
  changeUserStatus: async (userId: string, status: string): Promise<AdminUser> => {
    const response = await apiClient.put(`/api/auth/users/${userId}`, { status })
    return response.data
  },
}

// ============================================
// ROLE SERVICE (WHEN BACKEND IS READY)
// ============================================

// FILE: src/services/roleService.ts (Replace mock service)

import { apiClient } from '@/lib/apiClient'
import type { RoleConfig, Permission } from '@/types/user'

export const roleService = {
  // Get all roles
  getAllRoles: async (): Promise<RoleConfig[]> => {
    const response = await apiClient.get('/api/auth/roles')
    return response.data
  },

  // Get role by name
  getRole: async (roleName: string): Promise<RoleConfig> => {
    const response = await apiClient.get(`/api/auth/roles/${roleName}`)
    return response.data
  },

  // Get all permissions
  getAvailablePermissions: async (): Promise<Permission[]> => {
    const response = await apiClient.get('/api/auth/permissions')
    return response.data
  },

  // Get permissions by module
  getPermissionsByModule: async (): Promise<Record<string, Permission[]>> => {
    const response = await apiClient.get('/api/auth/permissions/modules')
    return response.data
  },

  // Update role permissions
  updateRolePermissions: async (roleName: string, permissions: string[]): Promise<RoleConfig> => {
    const response = await apiClient.put(`/api/auth/roles/${roleName}`, { permissions })
    return response.data
  },

  // Get current user permissions
  getCurrentUserPermissions: async (): Promise<string[]> => {
    const response = await apiClient.get('/api/auth/me/permissions')
    return response.data
  },
}

// ============================================
// ENVIRONMENT SETUP
// ============================================

// Add these to your .env.example:

// VITE_API_BASE_URL=http://localhost:8080/api

// ============================================
// TESTING NOTES
// ============================================

// 1. Mock data is loaded automatically from mockUserService and mockRoleService
// 2. No backend required for initial testing
// 3. All operations work on mock data (in-memory)
// 4. Data resets on page refresh (expected behavior)

// Test Users:
// - Super Admin: admin@aureostone.com
// - Admin: rajesh@aureostone.com
// - Content Manager: priya@aureostone.com
// - Manager: amit@aureostone.com
// - SEO Manager: sneha@aureostone.com
// - Support Staff: vikas@aureostone.com

// ============================================
// NEXT STEPS FOR PRODUCTION
// ============================================

// 1. Implement Backend API endpoints
// 2. Replace mockUserService with userService
// 3. Replace mockRoleService with roleService
// 4. Add authentication middleware
// 5. Implement permission validation on backend
// 6. Set up email service for invitations
// 7. Implement password reset flow
// 8. Add activity logging
// 9. Set up database models for users and roles
// 10. Configure JWT token management

export {}
