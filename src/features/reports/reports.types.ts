export interface PerformanceMetric {
  label: string;
  value: string | number;
  change: string;
  isPositive: boolean;
}

export interface TrendPoint {
  period: string;
  tripsCount: number;
  complianceRate: number;
  alertsCount: number;
}

export const REPORTS_VIEW_STATES = ['normal', 'loading', 'empty'] as const;
export type ReportsViewState = (typeof REPORTS_VIEW_STATES)[number];
export type ReportPeriod = 'daily' | 'weekly' | 'monthly';
export type ReportType = 'trips' | 'speed' | 'alerts';
