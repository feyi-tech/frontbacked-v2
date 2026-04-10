export type FieldType = 
'text' | 'number' | 'password' | 'select' | 
'email' | 'info' | 'otp' | 'phone' | 'countdown' |
'date' | 'timestamp';

export interface PaymentField {
  name: string;
  label: string;
  type: FieldType;
  length?: number; // For OTP fields
  placeholder?: string;
  required?: boolean;
  value?: any;
  itemsUrl?: string;
}

export interface NextAction {
  rootCheck?: string;
  message?: string;
  actionUrl?: string;
  fields?: PaymentField[];
  actionUrlButtonLabel?: string;
  redirectUrl?: string;
}

export interface PaymentMethod {
  type: string;
  name: string;
  fields: PaymentField[];
  actionUrl: string;
  actionUrlButtonLabel?: string;
  paymentProcessorId?: string;
  paymentReference?: string;
  nextAction?: NextAction;
}

export interface PaymentInitResponse {
  amount: number;
  currency: string;
  paymentProcessorId?: string;
  availableMethods?: PaymentMethod[];
  metadata?: Record<string, any>;
  nextAction?: NextAction;
}

export interface PaymentChargeResponse {
  completed?: boolean;
  status?: 'ok' | 'failed';
  error?: string;
  type?: string;
  name?: string;
  paymentProcessorId?: string;
  paymentReference?: string;
  fields?: PaymentField[];
  actionUrl?: string;
  actionUrlButtonLabel?: string;
  nextAction?: NextAction;
  availableMethods?: PaymentMethod[];
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
