import { apiClient } from "./client";
import { Domain } from "../types/api";

export const domainsApi = {
  add: (siteId: string, hostname: string) =>
    apiClient.post<Domain>(`/sites/${siteId}/add-domain`, { hostname }),
  verify: (domainId: string) =>
    apiClient.post(`/domains/${domainId}/verify`),
};
