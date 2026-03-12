import { apiClient } from "./client";
import { Theme, ThemeVersion } from "../types/api";

export const themesApi = {
  list: () => apiClient.get<Theme[]>("/themes"),
  get: (id: string) => apiClient.get<Theme>(`/themes/${id}`),
  create: (data: any) => apiClient.post<Theme>("/themes", data),
  upload: (id: string, formData: FormData) =>
    apiClient.post(`/themes/${id}/upload`, formData),
  getVersions: (id: string) =>
    apiClient.get<ThemeVersion[]>(`/themes/${id}/versions`),
  connectRepo: (id: string, data: any) =>
    apiClient.post(`/themes/${id}/connect-repo`, data),
};
