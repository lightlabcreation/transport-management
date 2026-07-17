export type GroupVisibility = 'public' | 'private';

export type GroupStatus = 'active' | 'pending' | 'suspended';

export type VisibilityFilter = GroupVisibility | 'all';

export type StatusFilter = GroupStatus | 'all';

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
