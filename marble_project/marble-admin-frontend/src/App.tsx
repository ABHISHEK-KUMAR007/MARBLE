import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { AdminLayout } from '@/layouts/AdminLayout'
import { GuestRoute, ProtectedRoute } from '@/components/auth/ProtectedRoute'
import { SuperAdminRoute } from '@/components/auth/SuperAdminRoute'
import { LoginPage } from '@/pages/LoginPage'
import {
  ActivityLogsPage,
  
  BannersPage,
  BlogsPage,
  CompanyProfilePage,
  CustomersPage,
  GalleryPage,
  InquiriesPage,
  ProductsPage,
  ProjectsPage,
  
  TestimonialsPage,
  VideosPage,
  CategoriesPage,
  DashboardPage,
} from '@/pages/Pages'
import { AdminManagementPage } from '@/pages/AdminManagementPage'
import { AdminProfilePage } from '@/pages/AdminProfilePage'
import { Toaster } from '@/components/ui/sonner'


export default function App() {
  return (
    <BrowserRouter>
      <Toaster position="top-right" />
      <Routes>
        <Route path="/login" element={<GuestRoute><LoginPage /></GuestRoute>} />
        <Route
          path="/"
          element={<ProtectedRoute><Navigate to="/dashboard" replace /></ProtectedRoute>}
        />
        <Route
          element={<ProtectedRoute><AdminLayout /></ProtectedRoute>}
        >
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/products" element={<ProductsPage />} />
          <Route path="/categories" element={<CategoriesPage />} />
          <Route path="/banners" element={<BannersPage />} />
          <Route path="/gallery" element={<GalleryPage />} />
          <Route path="/videos" element={<VideosPage />} />
          <Route path="/projects" element={<ProjectsPage />} />
          <Route path="/blogs" element={<BlogsPage />} />
          <Route path="/testimonials" element={<TestimonialsPage />} />
          <Route path="/inquiries" element={<InquiriesPage />} />
          <Route path="/customers" element={<CustomersPage />} />
          <Route path="/company-profile" element={<CompanyProfilePage />} />
          <Route path="/admin-management" element={<SuperAdminRoute><AdminManagementPage /></SuperAdminRoute>} />
          <Route path="/profile" element={<AdminProfilePage />} />
          <Route path="/activity-logs" element={<ActivityLogsPage />} />
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Route>
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  )
}
