export type AdminRoleType = 'Super Admin' | 'Group Admin';
export type MemberRoleType = 'Group Admin' | 'Moderator' | 'Member' | 'Group Guest';

export interface GroupAdminSummary {
  id: string;
  name: string;
  category: 'Family' | 'Friends' | 'School' | 'Company' | 'Security' | 'Delivery';
  myRole: AdminRoleType;
  totalMembers: number;
  onlineMembers: number;
  activeAlerts: number;
  trackingPolicy: 'Continuous' | 'Optional';
  visibilityRule: 'Everyone' | 'Only Admin' | 'Nearby Only';
}

export interface GroupMemberRecord {
  id: string;
  groupId: string;
  name: string;
  mobile: string;
  role: MemberRoleType;
  status: 'active' | 'suspended';
  currentSpeed: string;
  batteryPercent: number;
  lastSeen: string;
}

export interface GroupJoinRequest {
  id: string;
  groupId: string;
  groupName: string;
  userName: string;
  mobile: string;
  requestedAt: string;
  status: 'pending' | 'approved' | 'rejected';
}
