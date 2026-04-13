import axios, { AxiosRequestConfig, AxiosError } from "axios";
import { API_BASE_URL } from "../app-config";

class ApiClient {
  private get token(): string | null {
    if (typeof window !== "undefined") {
      return localStorage.getItem("auth_token");
    }
    return null;
  }

  async request<T>(endpoint: string, options: AxiosRequestConfig = {}): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`;

    const headers: Record<string, string> = { ...((options.headers as Record<string, string>) || {}) };

    if (this.token) {
      headers["Authorization"] = `Bearer ${this.token}`;
    }

    // Axios handles Content-Type for FormData and JSON automatically,
    // but we can preserve the explicit logic if needed.
    // However, if we don't set it, axios will do the right thing for JSON and FormData.

    try {
      const response = await axios({
        url,
        ...options,
        headers,
      });
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const axiosError = error as AxiosError<any>;
        if (axiosError.response?.status === 401) {
          if (typeof window !== "undefined") {
            localStorage.removeItem("auth_token");
            window.location.href = "/login";
          }
        }

        const errorData = axiosError.response?.data || {};
        throw new Error(errorData.error || errorData.message || `Request failed with status ${axiosError.response?.status || error.message}`);
      }
      throw error;
    }
  }

  get<T>(endpoint: string, options: AxiosRequestConfig = {}): Promise<T> {
    return this.request<T>(endpoint, { ...options, method: "GET" });
  }

  post<T>(endpoint: string, body?: any, options: AxiosRequestConfig = {}): Promise<T> {
    return this.request<T>(endpoint, {
      ...options,
      method: "POST",
      data: body,
    });
  }

  put<T>(endpoint: string, body?: any, options: AxiosRequestConfig = {}): Promise<T> {
    return this.request<T>(endpoint, {
      ...options,
      method: "PUT",
      data: body,
    });
  }

  delete<T>(endpoint: string, options: AxiosRequestConfig = {}): Promise<T> {
    return this.request<T>(endpoint, { ...options, method: "DELETE" });
  }
}

export const apiClient = new ApiClient();