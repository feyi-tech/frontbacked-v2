import { apiClient } from "./client";
import { Site } from "../types/api";

export const sitesApi = {
  list: () => apiClient.get<Site[]>("/sites"),
  get: (id: string) => apiClient.get<Site>(`/sites/${id}`),
  create: (data: any) => apiClient.post<Site>("/sites", data),
  updateVersion: (siteId: string, versionId: string) =>
    apiClient.post(`/sites/${siteId}/theme-version`, { versionId }),
  getSubscription: (siteId: string) =>
    apiClient.get(`/sites/${siteId}/theme-subscription`),
  updateSubscription: (siteId: string, data: any) =>
    apiClient.post(`/sites/${siteId}/theme-subscription`, data),
};
