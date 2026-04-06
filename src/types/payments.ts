export interface PaymentMethod {
  id: string;
  name: string;
  instructions: string;
  recommended?: boolean;
  type: string;
  actionText: string;
}

export interface PaymentInitResponse {
  paymentId: string;
  methods: PaymentMethod[];
  expiresAt?: string;
}

export interface RechargeableMethod {
  id: string;
  type: string;
  last4: string;
  brand: string;
}

export interface RechargeableMethodResponse {
  exists: boolean;
  method?: RechargeableMethod;
  enableUrl?: string;
}

export type TransactionStatus = 'pending' | 'success' | 'failed' | 'completed';
export type TransactionType = 'credit' | 'debit' | 'deposit' | 'withdrawal' | 'payment';

export interface Transaction {
  id: string;
  amount: number;
  currency: string;
  status: TransactionStatus;
  type: TransactionType;
  reference: string;
  createdAt: string;
  purpose?: string;
}

export interface TransactionListResponse {
  transactions: Transaction[];
  totalPages: number;
  total: number;
}

export interface WalletInfo {
  balance: number;
  currency: string;
}

export type KYCStatusValue = 'pending' | 'verified' | 'rejected' | 'none';

export interface KYCStatus {
  status: KYCStatusValue;
  message?: string;
}
