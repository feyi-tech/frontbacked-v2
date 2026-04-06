import { apiClient } from "./client";
import { Domain } from "../types/api";

export const domainsApi = {
  list: (page: number = 1, per_page: number = 10) =>
    apiClient.get<{domains: Domain[], totalPages: number}>(`/domains?page=${page}&per_page=${per_page}`),
  add: (siteId: string, hostname: string) =>
    apiClient.post<Domain>(`/sites/${siteId}/add-domain`, { hostname }),
  verify: (domainId: string) =>
    apiClient.post(`/domains/${domainId}/verify`),
  remove: (domainId: string) =>
    apiClient.post(`/domains/${domainId}/remove`),
};
