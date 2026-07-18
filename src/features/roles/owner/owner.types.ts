export type UserRoleName =
  | 'Group Owner'
  | 'Super Admin'
  | 'Group Admin'
  | 'Moderator'
  | 'Member'
  | 'Group Guest';

export type UserAccountStatus = 'active' | 'suspended' | 'pending';

export type GroupApprovalStatus = 'pending' | 'approved' | 'rejected';

export interface OwnerPlatformStats {
  totalUsers: number;
  usersTrendPercent: number;
  activeGroups: number;
  groupsTrendPercent: number;
  pendingApprovals: number;
  activeTrackingSessions: number;
  estimatedMonthlyRevenue: string;
  revenueTrendPercent: number;
  systemAlertsCount: number;
}

export interface PendingGroupApproval {
  id: string;
  groupName: string;
  category: 'Family' | 'Friends' | 'School' | 'Company' | 'Security' | 'Delivery';
  requestedBy: string;
  mobile: string;
  requestedAt: string;
  privacy: 'Public' | 'Private';
  initialMembersCount: number;
  status: GroupApprovalStatus;
  notes?: string | undefined;
}

export interface PlatformUser {
  id: string;
  name: string;
  mobile: string;
  email?: string | undefined;
  role: UserRoleName;
  status: UserAccountStatus;
  joinedAt: string;
  groupsCount: number;
  lastSeen: string;
}

export interface PlatformAlert {
  id: string;
  title: string;
  description: string;
  severity: 'info' | 'warning' | 'danger';
  timestamp: string;
  groupName?: string | undefined;
  resolved: boolean;
}
