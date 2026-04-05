import { apiClient } from "./client";
import { Domain, Site } from "../types/api";

export const sitesApi = {
  list: (page: number = 1, per_page: number = 10) =>
    apiClient.get<{sites: Site[], totalPages: number, limit: number, page: number, totalCount: number}>(`/sites?page=${page}&per_page=${per_page}`),
  getDomains: (id: string, page: number = 1, per_page: number = 10) =>
    apiClient.get<{domains: Domain[], totalPages: number, limit: number, page: number, totalCount: number}>(`/sites/${id}/domains?page=${page}&per_page=${per_page}`),
  get: (id: string) => apiClient.get<Site>(`/sites/${id}`),
  create: (data: any) => apiClient.post<Site>("/sites/create", data),
  updateVersion: (siteId: string, versionId: string) =>
    apiClient.post(`/sites/${siteId}/theme-version`, { versionId }),
  getSubscription: (siteId: string) =>
    apiClient.get(`/sites/${siteId}/theme-subscription`),
  updateSubscription: (siteId: string, data: any) =>
    apiClient.post(`/sites/${siteId}/theme-subscription`, data),
};
