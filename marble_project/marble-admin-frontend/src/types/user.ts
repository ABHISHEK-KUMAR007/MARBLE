export type AdminStatus = 'Active' | 'Inactive'

export interface ManagedAdmin {
  id: number
  fullName: string
  email: string
  phone?: string
  status: AdminStatus
  avatar?: string
  lastLogin?: string
  createdAt: string
  role: 'SUPER_ADMIN' | 'SUB_ADMIN'
}

export interface CreateAdminRequest {
  fullName: string
  email: string
  phone?: string
  role: 'SUPER_ADMIN' | 'SUB_ADMIN'
}

export interface UpdateAdminRequest {
  fullName: string
  email: string
  phone?: string
  role: 'SUPER_ADMIN' | 'SUB_ADMIN'
}
