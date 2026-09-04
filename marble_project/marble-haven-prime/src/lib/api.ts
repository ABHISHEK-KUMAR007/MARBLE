const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? "http://localhost:8080/api";

export const apiFetch = async <T>(endpoint: string, options?: RequestInit): Promise<T> => {
  const url = `${API_BASE_URL}${endpoint}`;
  const response = await fetch(url, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...options?.headers,
    },
  });

  if (!response.ok) {
    throw new Error(`API error: ${response.status} ${response.statusText}`);
  }

  const text = await response.text();
  return text ? JSON.parse(text) : null;
};

export const api = {
  getProducts: () => apiFetch<any[]>("/products"),
  getProduct: (id: string) => apiFetch<any>(`/products/id/${id}`),
  getFeaturedProducts: () => apiFetch<any[]>("/products/featured"),
  getPopularProducts: () => apiFetch<any[]>("/products/popular"),
  getLatestProducts: () => apiFetch<any[]>("/products/latest"),
  getProductsByCategory: (id: string) => apiFetch<any[]>(`/products/category/${id}`),
  getCategories: () => apiFetch<any[]>("/categories"),
  getBanners: () => apiFetch<any[]>("/banners"),
  getBlogs: () => apiFetch<any[]>("/blogs"),
  getGallery: () => apiFetch<any[]>("/gallery"),
  getVideos: () => apiFetch<any[]>("/videos"),
  getProjects: () => apiFetch<any[]>("/projects"),
  getProject: (id: string) => apiFetch<any>(`/projects/${id}`),
  getTestimonials: () => apiFetch<any[]>("/testimonials"),  getCompanyProfile: () => apiFetch<any>('/company'),  postInquiry: (data: any) =>
    apiFetch<any>("/inquiries", { method: "POST", body: JSON.stringify(data) }),
}
