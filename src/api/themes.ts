import { apiClient } from "./client";
import { Theme, ThemeVersion } from "../types/api";

export const themesApi = {
  list: (params?: any) => {
    const query = new URLSearchParams(params).toString();
    return apiClient.get<{themes: Theme[], totalPages: number}>(`/themes${query ? `?${query}` : ""}`);
  },
  get: (id: string) => apiClient.get<Theme>(`/themes/${id}`),
  create: (data: any) => apiClient.post<Theme>("/themes", data),
  upload: (id: string, formData: FormData) =>
    apiClient.post(`/themes/${id}/upload`, formData),
  getVersions: (id: string, page: number = 1, per_page: number = 10) =>
    apiClient.get<{versions: ThemeVersion[], totalPages: number}>(`/themes/${id}/versions?page=${page}&per_page=${per_page}`),
  connectRepo: (id: string, data: any) =>
    apiClient.post(`/themes/${id}/connect-repo`, data),

  // New endpoints
  getCategories: () => apiClient.get<any[]>("/themes/categories"),
  getSubcategories: (categoryId: string) =>
    apiClient.get<any[]>(`/themes/categories/${categoryId}/subcategories`),

  getReviews: (themeId: string, page: number = 1, per_page: number = 20) =>
    apiClient.get<{reviews: any[], totalPages: number}>(`/themes/${themeId}/reviews?page=${page}&per_page=${per_page}`),
  likeReview: (reviewId: string) =>
    apiClient.post(`/reviews/${reviewId}/like`),
  dislikeReview: (reviewId: string) =>
    apiClient.post(`/reviews/${reviewId}/dislike`),

  likeTheme: (themeId: string) =>
    apiClient.post(`/themes/${themeId}/like`),

  createUpload: (data: FormData) =>
    apiClient.post<Theme>("/themes/create-upload", data),
  createRepo: (data: any) =>
    apiClient.post<Theme>("/themes/create-repo", data),

  updateSettings: (id: string, data: any) =>
    apiClient.put(`/themes/${id}/settings`, data),

  getRepoHistory: (id: string, page: number = 1, per_page: number = 10) =>
    apiClient.get<{history: any[], totalPages: number}>(`/themes/${id}/repo-history?page=${page}&per_page=${per_page}`),

  addCustomDomain: (themeId: string, domain: string) =>
    apiClient.post(`/themes/${themeId}/domains`, { domain }),
  removeCustomDomain: (themeId: string, domainId: string) =>
    apiClient.delete(`/themes/${themeId}/domains/${domainId}`),
};
