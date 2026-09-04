# User Management & Roles & Permissions System

This document outlines the complete user management and roles & permissions system for the Marble Haven Prime Admin Panel.

## Overview

The admin panel features a private, secure user management system with:
- **No public registration** - Only authorized admins can create accounts
- **Role-based access control (RBAC)** - Granular permission management
- **Super Admin account** - Full system control with all privileges
- **Secure account creation flow** - Invitation-based setup process

---

## User Roles

### 1. **Super Admin** (Owner)
- **Full Access**: All features, settings, and admin management
- **Default Account**: `admin@aureostone.com`
- **Responsibilities**: 
  - Manage all users and roles
  - Configure system permissions
  - Access sensitive settings
  - View activity logs
  - Manage website content
  - Access analytics

**Permissions**: 50+ permissions across all modules

### 2. **Admin**
- **Primary Manager**: Most website content management
- **Cannot**: Manage Super Admin account or modify core system settings
- **Capabilities**: Everything except sensitive admin-level operations
- **Use Case**: Business manager who handles daily operations

**Permissions**: 40+ permissions (all except critical system permissions)

### 3. **Manager**
- **Dashboard & Analytics Access**
- **Product Management**: View, create, edit products and categories
- **Customer Relations**: Manage customers and inquiries
- **Use Case**: Operations manager overseeing products and customers

**Permissions**: 11 permissions
- Dashboard view
- Products (CRUD)
- Categories (view, create, edit)
- Customers (view, edit)
- Inquiries (view, edit)
- Analytics view

### 4. **Content Manager**
- **Content Specialist**: Manage all website content
- **Handles**: Products, categories, banners, gallery, videos, projects, blogs
- **Cannot**: Access admin panels, user management, analytics
- **Use Case**: Content creation and curation team member

**Permissions**: 24 permissions
- Products (CRUD)
- Categories (CRUD)
- Banners (CRUD)
- Gallery (CRUD)
- Videos (CRUD)
- Projects (CRUD)
- Blogs (CRUD)

### 5. **SEO Manager**
- **SEO Optimization**: Manage SEO settings and blog content
- **Capabilities**: 
  - Edit product/category SEO metadata
  - Create and manage blog posts
  - Update page-level SEO settings
- **Use Case**: SEO specialist optimizing website visibility

**Permissions**: 10 permissions
- SEO (view, edit)
- Blogs (CRUD)
- Products (view, edit)
- Categories (view, edit)

### 6. **Support Staff**
- **Customer Support**: Handle inquiries and customer information
- **Capabilities**:
  - View and update inquiry status
  - Manage customer information
  - Access dashboard
- **Cannot**: Create or delete records, access sensitive settings
- **Use Case**: Customer support team

**Permissions**: 5 permissions
- Dashboard view
- Inquiries (view, edit)
- Customers (view, edit)

---

## Permission System

### Permission Structure

Permissions are organized by module with CRUD operations:

```
[module].[operation]
```

**Examples**:
- `products.view` - View product list
- `products.create` - Create new products
- `products.edit` - Edit existing products
- `products.delete` - Delete products

### Available Modules

1. **Products** (view, create, edit, delete)
2. **Categories** (view, create, edit, delete)
3. **Banners** (view, create, edit, delete)
4. **Gallery** (view, create, edit, delete)
5. **Videos** (view, create, edit, delete)
6. **Projects** (view, create, edit, delete)
7. **Blogs** (view, create, edit, delete)
8. **Testimonials** (view, create, edit, delete)
9. **Inquiries** (view, edit, delete)
10. **Customers** (view, edit, delete)
11. **SEO** (view, edit)
12. **Analytics** (view)
13. **Company** (view, edit)
14. **Settings** (view, edit)
15. **Users** (view, create, edit, delete)
16. **Roles** (view, edit)
17. **Logs** (view)
18. **Dashboard** (view)

---

## User Management

### Creating a New User

**Flow**:
1. Navigate to Admin Panel → Users & Roles → Add New User
2. Fill in user details:
   - Full Name
   - Email Address
   - Phone Number (optional)
   - Role
3. Submit form
4. System creates inactive/pending account
5. Invitation email sent with secure setup link
6. User opens link and creates password
7. Account becomes active
8. User can login

### User Statuses

- **Active**: User account is active and can login
- **Inactive**: Account created but disabled
- **Invitation Pending**: User invited but hasn't completed setup
- **Suspended**: Account temporarily disabled

### User Management Actions

**Available Actions**:
- **Edit User**: Modify name, email, phone, role (except email)
- **Change Role**: Update user permissions by changing role
- **Activate/Deactivate**: Toggle account status
- **Suspend**: Temporarily disable account
- **Resend Invitation**: Resend setup link (for pending accounts)
- **Reset Password**: Send password reset link
- **Delete User**: Permanently remove account

---

## Roles & Permissions Configuration

### Managing Permissions

**Location**: Admin Panel → Users & Roles → Roles & Permissions

**Features**:
1. View all roles with descriptions
2. Select a role to edit
3. See all available permissions
4. Check/uncheck permissions
5. Save changes
6. Instant permission updates for active sessions

### Permission Organization

Permissions are grouped by module for easy navigation:
- Products
- Categories
- Banners
- Gallery
- Videos
- Projects
- Blogs
- Testimonials
- Inquiries
- Customers
- SEO
- Analytics
- Company
- Settings
- Users
- Roles
- Logs
- Dashboard

---

## Authorization & Authorization Checks

### Frontend Authorization

Use authorization hooks to control UI visibility:

```typescript
// Check single permission
const { hasPermission } = usePermission('products.create')

// Check multiple permissions (OR logic)
const { hasAnyPermission } = usePermissions(['products.edit', 'products.delete'])

// Check if user has specific role
const isSuperAdmin = useRole('Super Admin')
```

### Permission Gates (Components)

```typescript
// Single permission gate
<PermissionGate permission="users.create">
  <button>Add New User</button>
</PermissionGate>

// Multiple permissions gate
<PermissionsGate permissions={['products.view', 'categories.view']}>
  <ProductsSection />
</PermissionsGate>

// Role-based gate
<RoleGate roles={['Super Admin', 'Admin']}>
  <AdminSettings />
</RoleGate>
```

### Navigation Menu

The admin sidebar menu dynamically shows/hides sections based on user permissions:
- Super Admin sees all sections
- Admin sees all except sensitive admin settings
- Content Manager only sees content sections
- Support Staff only sees inquiries and customers

---

## Security Recommendations

### For Production Implementation

1. **Password Security**:
   - Never send passwords in plain text
   - Use secure account setup links with tokens
   - Links expire after 7 days
   - Support resend functionality

2. **Session Management**:
   - Use JWT tokens or secure sessions
   - Implement session timeout (15-30 minutes of inactivity)
   - Support "Remember Me" functionality

3. **Activity Logging**:
   - Log all user actions
   - Track login/logout events
   - Monitor permission changes
   - Audit sensitive operations

4. **Audit Trail**:
   - Who created/edited/deleted records
   - When actions occurred
   - IP addresses and user agents
   - Reason for critical operations

5. **Role Management**:
   - Prevent Super Admin account deletion
   - Require confirmation for critical role changes
   - Track role assignment history
   - Implement role approval workflow

---

## Current Implementation (Mock)

### Mock Data

Currently using mock data for development:
- 8 mock users with different roles
- Full permission configuration
- Complete CRUD operations on mock data

### Mock Services

**`mockUserService.ts`**:
- `getAllUsers()` - Get all users
- `getUserById(id)` - Get single user
- `createUser(data)` - Create new user
- `updateUser(id, data)` - Update user
- `deleteUser(id)` - Delete user
- `resendInvitation(userId)` - Resend invitation email
- `changeUserRole(userId, newRole)` - Change user role
- `changeUserStatus(userId, status)` - Change user status
- `resetPassword(userId)` - Send password reset

**`mockRoleService.ts`**:
- `getAllRoles()` - Get all roles
- `getRole(roleName)` - Get single role
- `getAvailablePermissions()` - Get all permissions
- `getPermissionsByModule()` - Get permissions grouped by module
- `updateRolePermissions(roleName, permissions)` - Update role permissions
- `hasPermission(userRole, permission)` - Check if role has permission
- `getUserPermissions(userRole)` - Get all permissions for role

---

## Frontend Pages

### 1. Users Page (`/admin/users`)
- Display all users in responsive table
- Search by name/email
- Filter by status
- Bulk actions
- Pagination
- Quick actions menu (edit, resend invitation, reset password, delete)

### 2. User Form Page (`/admin/users/new` & `/admin/users/:id`)
- Create new user form
- Edit user form
- Validation and error handling
- Email field read-only in edit mode
- Informational sections about roles and invitations

### 3. Roles & Permissions Page (`/admin/roles-permissions`)
- Role selector sidebar
- Permission editor for selected role
- Group permissions by module
- Visual checkbox interface
- Real-time permission count
- Save/Reset buttons

---

## Integration Checklist

### Frontend Components Ready
- ✅ Users page with list and filters
- ✅ User form (create/edit)
- ✅ Roles & Permissions configuration
- ✅ Authorization hooks and gates
- ✅ Mock services for testing

### Backend Implementation (TODO)
- ⏳ User API endpoints
- ⏳ Role and permission endpoints
- ⏳ Email sending service
- ⏳ JWT token generation
- ⏳ Password hashing (BCrypt)
- ⏳ Account activation flow
- ⏳ Permission validation middleware
- ⏳ Activity logging
- ⏳ Session management

### API Endpoints Needed

```
POST   /api/auth/users              - Create user
GET    /api/auth/users              - List all users
GET    /api/auth/users/:id          - Get single user
PUT    /api/auth/users/:id          - Update user
DELETE /api/auth/users/:id          - Delete user

POST   /api/auth/users/:id/invite   - Resend invitation
POST   /api/auth/users/:id/reset    - Reset password

GET    /api/auth/roles              - List all roles
GET    /api/auth/roles/:role        - Get role details
PUT    /api/auth/roles/:role        - Update role permissions

GET    /api/auth/permissions        - List all permissions
GET    /api/auth/permissions/module - Get permissions by module

GET    /api/auth/me/permissions     - Get current user permissions
```

---

## Usage Examples

### Add New User

1. Click "Add New User" button
2. Fill form:
   - Name: "Rajesh Kumar"
   - Email: "rajesh@company.com"
   - Phone: "+91 98765 43210"
   - Role: "Content Manager"
3. Click "Create User"
4. Confirmation message shown
5. User redirected to users list
6. New user appears in list with "Invitation Pending" status

### Change User Role

1. Go to Users page
2. Click user action menu
3. Click "Edit User"
4. Change role from dropdown
5. Click "Update User"
6. Permissions instantly updated (if user has active session)

### Configure Role Permissions

1. Go to Roles & Permissions
2. Click on role in left sidebar
3. See all available permissions
4. Check/uncheck permissions
5. Click "Save Permissions"
6. Confirmation message shown
7. Changes apply to all users with that role

---

## Future Enhancements

1. **Two-Factor Authentication**: Add 2FA support
2. **SSO Integration**: Integrate with external auth providers
3. **Permission Hierarchy**: Implement permission groups/inheritance
4. **Bulk User Management**: Import users from CSV
5. **Custom Roles**: Allow Super Admin to create custom roles
6. **Time-based Permissions**: Temporary permission grants
7. **IP Whitelisting**: Restrict access by IP address
8. **Password Policies**: Enforce complex password requirements
9. **Session Analytics**: Track concurrent sessions
10. **Email Templates**: Customize invitation emails

---

## File Structure

```
src/
├── pages/
│   ├── UsersPage.tsx              # Users list and management
│   ├── UserFormPage.tsx           # Create/edit user form
│   ├── RolesPermissionsPage.tsx   # Roles & permissions config
│   └── Pages.tsx                  # Exports all pages
├── services/
│   ├── mockUserService.ts         # Mock user operations
│   └── mockRoleService.ts         # Mock role & permission operations
├── hooks/
│   └── useAuthorization.ts        # Authorization hooks and gates
├── types/
│   └── user.ts                    # User and permission types
└── components/
    └── admin/
        ├── PageHeader.tsx
        ├── StatusBadge.tsx
        ├── ConfirmDialog.tsx
        └── ... other components
```

---

## Testing

### Mock User Credentials

For testing with mock data:
- **Super Admin**: admin@aureostone.com
- **Admin**: rajesh@aureostone.com
- **Content Manager**: priya@aureostone.com
- **Manager**: amit@aureostone.com
- **SEO Manager**: sneha@aureostone.com
- **Support Staff**: vikas@aureostone.com

---

## Support

For questions or issues with the user management system, refer to:
1. This documentation
2. Inline code comments
3. Mock service implementations
4. Authorization hooks documentation
