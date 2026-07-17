import type { DemoAccessProfileId } from '@/features/access-control';

export interface DashboardCapabilities {
  canViewTrips: boolean;
  canManageMembers: boolean;
  canApproveRequests: boolean;
  canReviewAlerts: boolean;
  canUseManagementShortcuts: boolean;
  isReadOnly: boolean;
}

export interface DashboardMetric {
  label: string;
  value: string;
  detail: string;
}

export interface DashboardPresentation {
  profileId: DemoAccessProfileId | 'missing';
  profileName: string;
  eyebrow: string;
  heading: string;
  description: string;
  summaryLabel: string;
  metrics: readonly DashboardMetric[];
  focusHeading: string;
  focusItems: readonly string[];
  recentHeading: string;
  activityHeading: string;
  quickActions: readonly string[];
  capabilities: DashboardCapabilities;
  restrictedMessage?: string;
}
