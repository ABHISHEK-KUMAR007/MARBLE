export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8080/api'

export interface ApiError {
  message: string
  status: number
}

class ApiClient {
  private baseUrl: string

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl
  }

  private getAuthHeader(): HeadersInit {
    const tokensRaw = localStorage.getItem('admin_tokens') || sessionStorage.getItem('admin_tokens')
    if (tokensRaw) {
      try {
        const tokens = JSON.parse(tokensRaw)
        if (tokens.accessToken) {
          return { Authorization: `Bearer ${tokens.accessToken}` }
        }
      } catch (e) {
        // ignore
      }
    }
    const token = localStorage.getItem('accessToken')
    return token ? { Authorization: `Bearer ${token}` } : {}
  }

  async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      ...this.getAuthHeader(),
      ...options.headers,
    }

    const response = await fetch(url, { ...options, headers })

    if (!response.ok) {
      const error: ApiError = {
        message: (await response.text()) || response.statusText,
        status: response.status,
      }
      throw error
    }

    if (response.status === 204) return undefined as T
    return response.json() as Promise<T>
  }

  get<T>(endpoint: string) {
    return this.request<T>(endpoint)
  }

  post<T>(endpoint: string, body: unknown) {
    return this.request<T>(endpoint, { method: 'POST', body: JSON.stringify(body) })
  }

  put<T>(endpoint: string, body: unknown) {
    return this.request<T>(endpoint, { method: 'PUT', body: JSON.stringify(body) })
  }

  patch<T>(endpoint: string, body: unknown) {
    return this.request<T>(endpoint, { method: 'PATCH', body: JSON.stringify(body) })
  }
  
  postForm<T>(endpoint: string, formData: FormData) {
    const url = `${this.baseUrl}${endpoint}`
    // Exclude Content-Type so the browser automatically sets the correct multipart boundary
    const headers = { ...this.getAuthHeader() }
    return fetch(url, { method: 'POST', headers, body: formData }).then(async (res) => {
      if (!res.ok) throw { message: await res.text() || res.statusText, status: res.status }
      return res.status === 204 ? (undefined as T) : (res.json() as Promise<T>)
    })
  }

  putForm<T>(endpoint: string, formData: FormData) {
    const url = `${this.baseUrl}${endpoint}`
    // Exclude Content-Type so the browser automatically sets the correct multipart boundary
    const headers = { ...this.getAuthHeader() }
    return fetch(url, { method: 'PUT', headers, body: formData }).then(async (res) => {
      if (!res.ok) throw { message: await res.text() || res.statusText, status: res.status }
      return res.status === 204 ? (undefined as T) : (res.json() as Promise<T>)
    })
  }

  delete<T>(endpoint: string) {
    return this.request<T>(endpoint, { method: 'DELETE' })
  }
}

export const apiClient = new ApiClient(API_BASE_URL)

export const API_ENDPOINTS = {
  auth: {
    login: '/auth/login',
    logout: '/auth/logout',
    refresh: '/auth/refresh',
    me: '/auth/me',
  },
  products: '/admin/products',
  categories: '/admin/categories',
  banners: '/admin/banners',
  gallery: '/admin/gallery',
  videos: '/admin/videos',
  projects: '/admin/projects',
  inquiries: '/admin/inquiries',
  customers: '/admin/customers',
  blogs: '/admin/blogs',
  testimonials: '/admin/testimonials',
  company: '/admin/company',
  users: '/admin/users',
  activityLogs: '/admin/activity-logs',
} as const
