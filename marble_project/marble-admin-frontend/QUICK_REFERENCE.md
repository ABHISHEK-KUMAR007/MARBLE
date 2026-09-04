# User Management Quick Reference Card

## 📍 File Locations

| Component | File | Purpose |
|-----------|------|---------|
| Users List | `src/pages/UsersPage.tsx` | View, search, filter users |
| User Form | `src/pages/UserFormPage.tsx` | Create/edit user |
| Roles Config | `src/pages/RolesPermissionsPage.tsx` | Manage permissions |
| User Types | `src/types/user.ts` | TypeScript interfaces |
| User Service | `src/services/mockUserService.ts` | User operations |
| Role Service | `src/services/mockRoleService.ts` | Permission management |
| Auth Hooks | `src/hooks/useAuthorization.ts` | Permission checking |

## 🎯 Quick Start

### View All Users
```typescript
import { UsersPage } from '@/pages'
// Route: /admin/users
```

### Create New User
```typescript
import { UserFormPage } from '@/pages'
// Route: /admin/users/new
```

### Edit User
```typescript
// Route: /admin/users/:userId
```

### Manage Permissions
```typescript
import { RolesPermissionsPage } from '@/pages'
// Route: /admin/roles-permissions
```

## 🔑 6 User Roles

| Role | Permission Count | Use Case |
|------|------------------|----------|
| 👑 Super Admin | 50+ | Full system control |
| 🔧 Admin | 40+ | Daily operations |
| 📊 Manager | 11 | Dashboard & customers |
| ✍️ Content Manager | 24 | Create/edit content |
| 🔍 SEO Manager | 10 | SEO optimization |
| 💬 Support Staff | 5 | Customer support |

## 🛡️ Authorization Hooks

### Single Permission Check
```typescript
const { hasPermission, loading } = usePermission('products.create')
```

### Multiple Permissions (OR)
```typescript
const { hasAnyPermission, loading } = usePermissions([
  'products.edit',
  'products.delete'
])
```

### Role Check
```typescript
const isSuperAdmin = useRole('Super Admin')
const isContentEditor = useRole('Admin', 'Content Manager')
```

## 🎨 Permission Gates

### Single Permission
```typescript
<PermissionGate permission="users.create">
  <AddUserButton />
</PermissionGate>
```

### Multiple Permissions
```typescript
<PermissionsGate permissions={['products.view', 'categories.view']}>
  <ProductsSection />
</PermissionsGate>
```

### Role-Based
```typescript
<RoleGate roles={['Super Admin', 'Admin']}>
  <AdminPanel />
</RoleGate>
```

## 📋 Permission Modules (18 Total)

### CRUD Modules (4 operations each)
- Products
- Categories
- Banners
- Gallery
- Videos
- Projects
- Blogs
- Testimonials

### View/Edit Modules
- Inquiries (view, edit, delete)
- Customers (view, edit, delete)
- SEO (view, edit)
- Company (view, edit)
- Settings (view, edit)
- Users (view, create, edit, delete)
- Roles (view, edit)

### View-Only Modules
- Dashboard (view)
- Analytics (view)
- Activity Logs (view)

## 👥 Mock Users

| Email | Role | Status |
|-------|------|--------|
| admin@aureostone.com | Super Admin | Active |
| rajesh@aureostone.com | Admin | Active |
| priya@aureostone.com | Content Manager | Active |
| amit@aureostone.com | Manager | Active |
| sneha@aureostone.com | SEO Manager | Active |
| vikas@aureostone.com | Support Staff | Active |
| anjali@aureostone.com | Content Manager | Inactive |
| rohan.new@aureostone.com | Manager | Pending |

## 🔐 Account Statuses

| Status | Meaning | Action |
|--------|---------|--------|
| Active | Can login | Deactivate, Suspend, Delete |
| Inactive | Cannot login | Activate, Delete |
| Pending | Awaiting setup | Resend invitation, Delete |
| Suspended | Temporarily disabled | Activate, Delete |

## 📝 User Form Fields

| Field | Type | Required | Notes |
|-------|------|----------|-------|
| Full Name | Text | Yes | 3-100 chars |
| Email | Email | Yes | Unique, read-only on edit |
| Phone | Tel | No | Optional, E.164 format |
| Role | Select | Yes | Choose from 6 roles |

## ⚙️ Service Methods

### User Service
```typescript
// Get users
mockUserService.getAllUsers()
mockUserService.getUserById(id)

// CRUD operations
mockUserService.createUser(data)
mockUserService.updateUser(id, data)
mockUserService.deleteUser(id)

// Account management
mockUserService.changeUserRole(userId, newRole)
mockUserService.changeUserStatus(userId, status)
mockUserService.resendInvitation(userId)
mockUserService.resetPassword(userId)
```

### Role Service
```typescript
// Get data
mockRoleService.getAllRoles()
mockRoleService.getRole(roleName)
mockRoleService.getAvailablePermissions()
mockRoleService.getPermissionsByModule()
mockRoleService.getUserPermissions(userRole)

// Manage permissions
mockRoleService.updateRolePermissions(roleName, permissions)
mockRoleService.hasPermission(userRole, permission)
```

## 🚀 Routes to Add

```typescript
// User Management
GET    /admin/users                 // List users
GET    /admin/users/new             // Create user form
GET    /admin/users/:userId         // Edit user form
POST   /admin/users                 // Create (backend)
PUT    /admin/users/:userId         // Update (backend)
DELETE /admin/users/:userId         // Delete (backend)

// Roles & Permissions
GET    /admin/roles-permissions     // View/edit permissions
PUT    /admin/roles/:role           // Update permissions (backend)
```

## 🧪 Testing Checklist

- [ ] Users page loads and displays mock data
- [ ] Search functionality filters users
- [ ] Status filter works correctly
- [ ] Pagination shows correct page count
- [ ] Add New User button navigates to form
- [ ] User form validates inputs
- [ ] Can create new user (mock)
- [ ] Can edit user details
- [ ] Can change user role
- [ ] Can delete user with confirmation
- [ ] Resend invitation works
- [ ] Reset password works
- [ ] Roles & Permissions page loads
- [ ] Can select different roles
- [ ] Permission checkboxes work
- [ ] Can save permission changes
- [ ] Permission gates show/hide components
- [ ] Authorization hooks work correctly

## 🔄 Component Integration

### Add to Sidebar Navigation
```typescript
{
  label: 'Users & Roles',
  icon: Users,
  path: '/admin/users',
  roles: ['Super Admin', 'Admin'],
}
```

### Protect Routes
```typescript
<ProtectedRoute requiredPermission="users.view">
  <UsersPage />
</ProtectedRoute>
```

### Check Permissions in Components
```typescript
function UserManagementSection() {
  const { hasPermission } = useAuth()
  
  if (!hasPermission('users.view')) return null
  
  return <UsersPage />
}
```

## 📊 Typical User Journeys

### Super Admin Creates User
1. Navigate to Users & Roles
2. Click "Add New User"
3. Fill form
4. User gets invitation email (mock)
5. User appears in list as "Pending"

### Manager Reviews Permissions
1. Navigate to Roles & Permissions
2. Select "Content Manager" role
3. View all permissions for that role
4. See which users have this role

### Support Staff Views Inquiries
1. Login as Support Staff
2. Only see inquiries and customers sections
3. Cannot see Products, Users, or Settings
4. Can update inquiry status

## 🐛 Debugging

### Check User Permissions
```typescript
const { user } = useAuth()
const perms = await mockRoleService.getUserPermissions(user.role)
console.log(perms) // Array of permission strings
```

### Verify Mock Data
```typescript
const users = await mockUserService.getAllUsers()
const roles = await mockRoleService.getAllRoles()
console.log(users, roles)
```

### Test Permission Gate
```typescript
<PermissionGate permission="products.create">
  <div>You can create products!</div>
</PermissionGate>

// In console:
const { hasPermission } = usePermission('products.create')
console.log(hasPermission)
```

## 📦 Dependencies Used

- **React Hooks**: useState, useEffect, useCallback, useMemo
- **React Router**: useNavigate, useParams, Link
- **Lucide Icons**: Plus, Edit2, Trash2, Mail, Lock, etc.
- **Context API**: Custom AuthContext and authorization

## 💾 Data Persistence

### Current (Mock)
- Data stored in memory
- Resets on page refresh
- Good for development and testing

### Future (Backend)
- Data persisted in database
- JWT-based authentication
- Real email service
- Permission validation middleware

## 🎓 Learning Path

1. Start with `USER_MANAGEMENT.md` - System overview
2. Review `IMPLEMENTATION_SUMMARY.md` - What's included
3. Check `IMPLEMENTATION_GUIDE.md` - How to integrate
4. Examine `src/services/mockUserService.ts` - Service patterns
5. Review `src/pages/UsersPage.tsx` - Component structure
6. Study `src/hooks/useAuthorization.ts` - Authorization patterns
7. Reference `AUTH_CONTEXT_EXAMPLE.md` - Extended auth context

---

**Last Updated**: 2026-07-20
**Status**: ✅ Ready for Integration
