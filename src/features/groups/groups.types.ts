export type GroupVisibility = 'public' | 'private';

export type GroupStatus = 'active' | 'pending' | 'suspended';

export type VisibilityFilter = GroupVisibility | 'all';

export type StatusFilter = GroupStatus | 'all';

export type GroupRole =
  | 'owner'
  | 'delegated_admin'
  | 'admin'
  | 'moderator'
  | 'member'
  | 'guest';

export type GroupCapability =
  | 'edit_group'
  | 'invite_members'
  | 'remove_members'
  | 'block_members'
  | 'approve_join_requests'
  | 'reject_join_requests'
  | 'assign_roles'
  | 'edit_permissions'
  | 'view_live_map'
  | 'export_reports';

export interface GroupMember {
  id: string;
  name: string;
  role: GroupRole;
  status: 'online' | 'offline';
  lastSeen: string;
}

export interface JoinRequest {
  id: string;
  memberName: string;
  requestedAt: string;
  status: 'pending' | 'approved' | 'rejected';
}

export interface Group {
  id: string;
  name: string;
  description: string;
  visibility: GroupVisibility;
  status: GroupStatus;
  memberCount: number;
  lastUpdated: string; // ISO 8601 date string
  initials: string; // Derived from group name for avatar display
  category?: string;
  trackingPolicy?: string;
  visibilityPolicy?: string;
  members?: GroupMember[];
  joinRequests?: JoinRequest[];
}

export interface GroupFiltersState {
  search: string;
  visibility: VisibilityFilter;
  status: StatusFilter;
}

export interface GroupSummaryStats {
  total: number;
  active: number;
  pending: number;
  suspended: number;
}

export interface GroupFormState {
  name: string;
  description: string;
  category: 'Family' | 'Friends' | 'School' | 'Company' | 'Security' | 'Delivery';
  visibility: 'public' | 'private';
  trackingMode: 'continuous' | 'optional' | 'disabled';
  backgroundTracking: boolean;
  locationAccuracy: 'high' | 'medium' | 'low';
  refreshInterval: '10s' | '30s' | '1m' | '5m';
  visibilityPolicy:
    | 'everyone'
    | 'admins_only'
    | 'nearby_only'
    | 'invisible'
    | 'hidden_admin';
  roleCapabilities: Record<GroupRole, GroupCapability[]>;
  acceptTerms: boolean;
}


