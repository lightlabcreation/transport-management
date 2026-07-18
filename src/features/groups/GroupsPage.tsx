import { useEffect, useMemo, useState } from 'react';
import { Navigate, useLocation, useNavigate } from 'react-router';

import { Button } from '@/components/ui/button';
import { browserDemoAccessStore } from '@/features/access-control';
import { getApplicationNavigation } from '@/features/app-navigation';
import { browserApplicationModeStore } from '@/features/application-mode';
import { browserAuthSessionStore, type AuthSessionStore } from '@/features/auth';
import { ApplicationShell } from '@/features/shell';

import { GroupFilters } from './components/GroupFilters';
import { GroupList } from './components/GroupList';
import { GroupSummary } from './components/GroupSummary';
import { mockGroups } from './groups.mock';
import { GroupDetailsPage } from './GroupDetailsPage';
import { CreateGroupPage } from './CreateGroupPage';
import type {
  Group,
  GroupFiltersState,
  GroupSummaryStats,
  StatusFilter,
  VisibilityFilter,
} from './groups.types';

const LOADING_DELAY_MS = 600;

interface GroupsPageProps {
  sessionStore?: AuthSessionStore;
}

export function GroupsPage({ sessionStore = browserAuthSessionStore }: GroupsPageProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const profile = browserDemoAccessStore.getProfile();
  const applicationMode = browserApplicationModeStore.getMode();
  const applicationNavigation = applicationMode
    ? getApplicationNavigation(applicationMode, profile)
    : [];

  const [selectedGroup, setSelectedGroup] = useState<Group | null>(null);
  const [isCreatingGroup, setIsCreatingGroup] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [filters, setFilters] = useState<GroupFiltersState>({
    search: '',
    visibility: 'all',
    status: 'all',
  });

  // Simulate feature-local loading
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, LOADING_DELAY_MS);
    return () => clearTimeout(timer);
  }, []);

  // Compute summary stats from full mock data
  const stats = useMemo<GroupSummaryStats>(() => {
    return {
      total: mockGroups.length,
      active: mockGroups.filter((g) => g.status === 'active').length,
      pending: mockGroups.filter((g) => g.status === 'pending').length,
      suspended: mockGroups.filter((g) => g.status === 'suspended').length,
    };
  }, []);

  // Compute filtered results
  const filteredGroups = useMemo(() => {
    return mockGroups.filter((group) => {
      const matchesSearch =
        filters.search === '' || group.name.toLowerCase().includes(filters.search.toLowerCase());

      const matchesVisibility =
        filters.visibility === 'all' || group.visibility === filters.visibility;

      const matchesStatus = filters.status === 'all' || group.status === filters.status;

      return matchesSearch && matchesVisibility && matchesStatus;
    });
  }, [filters]);

  const hasActiveFilters =
    filters.search !== '' || filters.visibility !== 'all' || filters.status !== 'all';

  function handleSearchChange(value: string) {
    setFilters((prev) => ({ ...prev, search: value }));
  }

  function handleVisibilityChange(value: VisibilityFilter) {
    setFilters((prev) => ({ ...prev, visibility: value }));
  }

  function handleStatusChange(value: StatusFilter) {
    setFilters((prev) => ({ ...prev, status: value }));
  }

  function handleClearFilters() {
    setFilters({ search: '', visibility: 'all', status: 'all' });
  }

  function handleLogout() {
    sessionStore.clearSession();
    void navigate('/auth/login', { replace: true });
  }

  if (!sessionStore.getSession()) {
    return <Navigate to="/auth/login" replace />;
  }

  if (!profile) {
    return <Navigate to="/app/access-preview" replace />;
  }

  // A profile's membership in one group must not globally prevent creating another group.
  const canCreateGroup = applicationMode === 'tracking';

  return (
    <ApplicationShell
      navigationItems={applicationNavigation}
      currentPath={location.pathname}
      userSummary={{
        name: 'Demo Operator',
        mobile: '+•• ••••••3210',
        roleLabel: profile.name,
      }}
      onLogout={handleLogout}
    >
      {isCreatingGroup ? (
        <CreateGroupPage onBack={() => setIsCreatingGroup(false)} />
      ) : selectedGroup ? (
        <GroupDetailsPage group={selectedGroup} onBack={() => setSelectedGroup(null)} />
      ) : (
        <div className="space-y-6">
          {/* Page header */}
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <h2 className="text-heading-md font-bold text-foreground">Groups</h2>
              <p className="mt-1 text-body-sm text-muted-foreground">
                Manage your groups, track members, and coordinate activities.
              </p>
            </div>

            {canCreateGroup && (
              <Button
                onClick={() => setIsCreatingGroup(true)}
                aria-label="Create new group"
                className="shrink-0"
              >
                Create Group
              </Button>
            )}
          </div>

          {/* Loading state */}
          {isLoading ? (
            <div
              className="flex items-center justify-center py-24 text-muted-foreground"
              role="status"
              aria-label="Loading groups"
            >
              <div className="flex flex-col items-center gap-3">
                <div
                  className="size-8 animate-spin rounded-full border-2 border-border border-t-primary"
                  aria-hidden="true"
                />
                <p className="text-body-sm">Loading groups…</p>
              </div>
            </div>
          ) : (
            <>
              {/* Summary cards */}
              <GroupSummary stats={stats} />

              {/* Filters */}
              <GroupFilters
                filters={filters}
                onSearchChange={handleSearchChange}
                onVisibilityChange={handleVisibilityChange}
                onStatusChange={handleStatusChange}
                onClearFilters={handleClearFilters}
                resultCount={filteredGroups.length}
              />

              {/* Groups list/table */}
              <GroupList
                groups={filteredGroups}
                onClearFilters={handleClearFilters}
                hasActiveFilters={hasActiveFilters}
                onGroupClick={(group) => setSelectedGroup(group)}
              />
            </>
          )}
        </div>
      )}
    </ApplicationShell>
  );
}
