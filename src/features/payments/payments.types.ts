export type PlanTier = 'monthly' | 'yearly' | 'lifetime';
export type InvoiceStatus = 'Paid' | 'Pending' | 'Failed';
export type PaymentsViewState = 'Normal' | 'No Subscription' | 'Pending Approval';

export interface SubscriptionPlan {
  id: PlanTier;
  name: string;
  price: number;
  interval: string;
  features: string[];
  isPopular?: boolean;
}

export interface Invoice {
  id: string;
  date: string;
  amount: number;
  status: InvoiceStatus;
  planName: string;
  billingMethod: string;
}

export interface PaymentCard {
  id: string;
  brand: 'visa' | 'mastercard' | 'amex';
  last4: string;
  expDate: string;
  isDefault: boolean;
}
