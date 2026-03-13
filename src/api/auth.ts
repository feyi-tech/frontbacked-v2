import { apiClient } from "./client";
import { AuthResponse } from "../types/api";

export const authApi = {
  login: (credentials: any) =>
    apiClient.post<AuthResponse>("/auth/login", credentials),
  register: (data: any) =>
    apiClient.post<AuthResponse>("/auth/register", data),
  me: () =>
    apiClient.get<{ user: any }>("/auth/me"),
};
