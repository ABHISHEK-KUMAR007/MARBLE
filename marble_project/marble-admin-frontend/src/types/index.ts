export interface AuthUser {
  id: number
  name: string
  email: string
  avatar?: string
  role?: 'SUPER_ADMIN' | 'SUB_ADMIN'
}

export interface AuthTokens {
  accessToken: string
  refreshToken: string
  expiresAt: number
}

export interface LoginCredentials {
  email: string
  password: string
  rememberMe?: boolean
}

export type EntityStatus = 'active' | 'inactive'

export interface ProductImage {
  id: string
  url: string
  alt: string
  title: string
  isPrimary: boolean
  order: number
}

export interface Product {
  id: string
  name: string
  category: string
  subcategory?: string
  shortDescription: string
  detailedDescription: string
  price?: number
  color: string
  finish: string
  thickness: string
  origin: string
  size: string
  usage: string
  availability: string
  status: EntityStatus
  featured: boolean
  popular: boolean
  trending: boolean
  latest: boolean
  images: ProductImage[]
  views: number
  createdAt: string
  updatedAt: string
}

export interface Category {
  id: string
  name: string
  image: string
  shortDescription: string
  detailedDescription: string
  displayOrder: number
  status: EntityStatus
  seoTitle: string
  seoDescription: string
  keywords: string
  productCount: number
}

export interface Banner {
  id: string
  image: string
  heading: string
  subheading: string
  buttonText: string
  buttonLink: string
  displayOrder: number
  status: EntityStatus
}

export interface GalleryImage {
  id: string
  url: string
  alt: string
  title: string
  album: string
  status: EntityStatus
  order: number
}

export interface Video {
  id: string
  title: string
  youtubeUrl: string
  thumbnail: string
  description: string
  category: string
  status: EntityStatus
}

export interface Project {
  id: string
  name: string
  clientName?: string
  location: string
  description: string
  marbleUsed: string
  images: string[]
  beforeImages: string[]
  afterImages: string[]
  completionDate: string
  status: EntityStatus
}

export type InquiryStatus = 'Pending' | 'Contacted' | 'In Progress' | 'Completed' | 'Rejected'

export interface Inquiry {
  id: string
  customerName: string
  phone: string
  email: string
  city: string
  interestedProduct: string
  message: string
  inquiryDate: string
  status: InquiryStatus
  adminNotes?: string
}

export interface Customer {
  id: string
  name: string
  phone: string
  email: string
  city: string
  totalInquiries: number
  lastInquiryDate: string
}

export type BlogStatus = 'draft' | 'published'

export interface Blog {
  id: string
  title: string
  featuredImage: string
  shortDescription: string
  content: string
  category: string
  tags: string[]
  author: string
  metaTitle: string
  metaDescription: string
  keywords: string
  status: BlogStatus
  publishedAt?: string
}

export interface Testimonial {
  id: string
  customerName: string
  photo: string
  location: string
  rating: number
  feedback: string
  status: EntityStatus
}

export interface CompanyProfile {
  companyName: string
  logo: string
  favicon: string
  aboutCompany: string
  address: string
  phone: string
  alternatePhone: string
  email: string
  whatsapp: string
  googleMapsEmbed: string
  businessHours: string
  facebook: string
  instagram: string
  youtube: string
  linkedin: string
}

export interface AdminUser {
  id: number
  name: string
  email: string
  status: EntityStatus
  lastLogin?: string
  createdAt: string
}

export interface ActivityLog {
  id: string
  adminUser: string
  action: string
  module: string
  date: string
  time: string
}

export interface DashboardStats {
  totalProducts: number
  activeProducts: number
  totalCategories: number
  totalGalleryImages: number
  totalVideos: number
  todayInquiries: number
  pendingInquiries: number
  completedInquiries: number
  websiteVisitors: number
}

export interface ChartDataPoint {
  name: string
  value: number
  [key: string]: string | number
}
