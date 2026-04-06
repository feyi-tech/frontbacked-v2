import { apiClient } from "./client";
import {
  PaymentInitResponse,
  RechargeableMethodResponse,
  TransactionListResponse,
  WalletInfo,
  KYCStatus
} from "../types/payments";

export const paymentsApi = {
  init: (data: { amount: number; currency: string; purpose?: string }) =>
    apiClient.post<PaymentInitResponse>("/payments/init", data),

  getRechargeableMethod: () =>
    apiClient.get<RechargeableMethodResponse>("/payments/rechargeable-method"),

  getWallet: () =>
    apiClient.get<WalletInfo>("/wallet"),

  getTransactions: (params: { page?: number; per_page?: number; status?: string; from?: string; to?: string; search?: string }) => {
    const cleanParams = Object.entries(params).reduce((acc, [key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        acc[key] = String(value);
      }
      return acc;
    }, {} as Record<string, string>);

    const query = new URLSearchParams(cleanParams).toString();
    return apiClient.get<TransactionListResponse>(`/transactions?${query}`);
  },

  getTransaction: (id: string) =>
    apiClient.get<any>(`/transactions/${id}`),

  submitKYC: (data: FormData) =>
    apiClient.post<any>("/kyc", data),

  getKYCStatus: () =>
    apiClient.get<KYCStatus>("/kyc/status"),
};
