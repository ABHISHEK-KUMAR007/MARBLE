import type {
  AdminStatus,
  ManagedAdmin,
} from '@/types/user'

import { authService } from '@/services/authService'

const API_URL = 'http://localhost:8080/api/admins'

function normalizeAdminStatus(status: unknown): AdminStatus {
  const value = String(status ?? '').toLowerCase()

  if (value === 'active') return 'Active'
  if (value === 'inactive') return 'Inactive'
  return 'Inactive'
}

interface AdminPayload {
  fullName: string
  email: string
  phone?: string
  avatar?: string
  password?: string
  role?: string
}

// ==========================================
// AUTH HEADERS
// ==========================================
function getAuthHeaders(): HeadersInit {
  const token = authService.getAccessToken()

  if (!token) {
    throw new Error('You are not authenticated.')
  }

  return {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`,
  }
}


// ==========================================
// COMMON RESPONSE HANDLER
// ==========================================
async function handleResponse<T>(
  response: Response,
): Promise<T> {

  if (response.status === 401) {
    throw new Error(
      'Your session has expired. Please login again.',
    )
  }

  if (response.status === 403) {
    throw new Error(
      'You are not authorized to perform this action.',
    )
  }

  if (response.status === 404) {
    throw new Error(
      'Admin not found.',
    )
  }

  if (!response.ok) {
    let message =
      'Something went wrong while communicating with the server.'

    try {
      const data = await response.json()

      if (data.message) {
        message = data.message
      }
    } catch {
      // Response does not contain JSON
    }

    throw new Error(message)
  }

  return response.json() as Promise<T>
}


// ==========================================
// ADMIN SERVICE
// ==========================================
export const adminService = {

  // ========================================
  // GET ALL ADMINS
  // GET /api/admins
  // ========================================
  async getAllAdmins():
    Promise<ManagedAdmin[]> {

    const response = await fetch(
      API_URL,
      {
        method: 'GET',
        headers: getAuthHeaders(),
      },
    )

    const data = await handleResponse<ManagedAdmin[]>(response)
    return data.map((admin) => ({
      ...admin,
      status: normalizeAdminStatus(admin.status),
    }))
  },


  // ========================================
  // GET ADMIN BY ID
  // GET /api/admins/{id}
  // ========================================
  async getAdminById(
    id: number,
  ): Promise<ManagedAdmin> {

    const response = await fetch(
      `${API_URL}/${id}`,
      {
        method: 'GET',
        headers: getAuthHeaders(),
      },
    )

    const data = await handleResponse<ManagedAdmin>(response)
    return {
      ...data,
      status: normalizeAdminStatus(data.status),
    }
  },


  // ========================================
  // CREATE ADMIN
  // POST /api/admins
  // ========================================
  async createAdmin(
    data: AdminPayload,
  ): Promise<ManagedAdmin> {

    const response = await fetch(
      API_URL,
      {
        method: 'POST',

        headers: getAuthHeaders(),

        body: JSON.stringify(data),
      },
    )

    return handleResponse<ManagedAdmin>(
      response,
    )
  },


  // ========================================
  // UPDATE ADMIN
  // PUT /api/admins/{id}
  // ========================================
  async updateAdmin(
    id: number,
    data: AdminPayload,
  ): Promise<ManagedAdmin> {

    const response = await fetch(
      `${API_URL}/${id}`,
      {
        method: 'PUT',

        headers: getAuthHeaders(),

        body: JSON.stringify(data),
      },
    )

    return handleResponse<ManagedAdmin>(
      response,
    )
  },


  // ========================================
  // DELETE ADMIN
  // DELETE /api/admins/{id}
  // ========================================
  async deleteAdmin(
    id: number,
  ): Promise<void> {

    const response = await fetch(
      `${API_URL}/${id}`,
      {
        method: 'DELETE',
        headers: getAuthHeaders(),
      },
    )

    if (response.status === 401) {
      throw new Error(
        'Your session has expired. Please login again.',
      )
    }

    if (response.status === 403) {
      throw new Error(
        'You are not authorized to delete this admin.',
      )
    }

    if (response.status === 404) {
      throw new Error(
        'Admin not found.',
      )
    }

    if (!response.ok) {
      throw new Error(
        'Unable to delete admin.',
      )
    }
  },


  // ========================================
  // CHANGE ADMIN STATUS
  // PATCH /api/admins/{id}/status
  // ========================================
  async changeAdminStatus(
    id: number,
    status: AdminStatus,
  ): Promise<ManagedAdmin> {
    const backendStatus = status === 'Active' ? 'ACTIVE' : 'INACTIVE'

    const response = await fetch(
      `${API_URL}/${id}/status`,
      {
        method: 'PATCH',

        headers: getAuthHeaders(),

        body: JSON.stringify({
          status: backendStatus,
        }),
      },
    )

    return handleResponse<ManagedAdmin>(
      response,
    )
  },


}