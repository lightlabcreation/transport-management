export type ApiProviderName = 'Google Maps' | 'TomTom' | 'WhatsApp' | 'Firebase FCM';

export type QuotaStatus = 'normal' | 'warning' | 'danger';

export interface ApiServiceMetric {
  id: string;
  serviceName: string;
  provider: ApiProviderName;
  monthlyCost: string;
  dailyRequestsCount: number;
  dailyLimit: number;
  percentUsed: number;
  status: QuotaStatus;
  description: string;
}

export interface BudgetConfig {
  monthlySpendCap: number;
  currentSpend: number;
  warningThresholdPercent: number;
  criticalThresholdPercent: number;
  autoLockoutEnabled: boolean;
}

export interface ApiRequestLog {
  id: string;
  timestamp: string;
  service: ApiProviderName;
  endpoint: string;
  responseTimeMs: number;
  costCents: number;
  httpStatus: 200 | 429 | 500;
  groupName?: string | undefined;
}
