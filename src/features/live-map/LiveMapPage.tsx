import { useMemo, useState } from 'react';
import { Navigate, useLocation, useNavigate } from 'react-router';

import { Input } from '@/components/ui/input';
import type { DemoAccessStore } from '@/features/access-control';
import { getApplicationNavigation } from '@/features/app-navigation';
import { browserApplicationModeStore } from '@/features/application-mode';
import type { AuthSessionStore } from '@/features/auth';
import { ApplicationShell } from '@/features/shell';

import { MapCanvas } from './components/MapCanvas';
import { MapStatusBar } from './components/MapStatusBar';
import { MemberDetails } from './components/MemberDetails';
import { MemberList } from './components/MemberList';
import { trackedMembers } from './live-map.mock';
import type { LiveMapViewState, MemberStatus, TrackedMember } from './live-map.types';

interface LiveMapPageProps {
  sessionStore: AuthSessionStore;
  accessStore?: DemoAccessStore;
  viewState?: LiveMapViewState;
}

type StatusFilter = 'all' | MemberStatus;

const statusFilters: StatusFilter[] = ['all', 'online', 'offline', 'stale'];

export function LiveMapPage({ sessionStore, accessStore, viewState = 'ready' }: LiveMapPageProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');
  const [selectedMember, setSelectedMember] = useState<TrackedMember | null>(null);
  const [announcement, setAnnouncement] = useState('');
  const applicationMode = browserApplicationModeStore.getMode();
  const accessProfile = accessStore?.getProfile() ?? null;
  const applicationNavigation = applicationMode
    ? getApplicationNavigation(applicationMode, accessProfile)
    : [];

  const filteredMembers = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase();
    return trackedMembers.filter((member) => {
      const matchesName =
        normalizedSearch === '' || member.name.toLowerCase().includes(normalizedSearch);
      const matchesStatus = statusFilter === 'all' || member.status === statusFilter;
      return matchesName && matchesStatus;
    });
  }, [search, statusFilter]);

  if (!sessionStore.getSession()) return <Navigate to="/auth/login" replace />;

  function handleLogout() {
    sessionStore.clearSession();
    void navigate('/auth/login', { replace: true });
  }

  function handleSelectMember(member: TrackedMember) {
    setSelectedMember(member);
    setAnnouncement(`${member.name} selected.`);
  }

  function handlePreviewAction(label: string) {
    setAnnouncement(`${label} is preview only. Coming soon.`);
  }

  function clearFilters() {
    setSearch('');
    setStatusFilter('all');
  }

  return (
    <ApplicationShell
      navigationItems={applicationNavigation}
      currentPath={location.pathname}
      userSummary={{
        name: 'Demo Operator',
        mobile: 'Demo account',
        roleLabel: accessProfile?.name ?? 'Operations',
      }}
      onLogout={handleLogout}
    >
      <div className="space-y-section">
        <header className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <p className="text-body-sm font-semibold uppercase tracking-wide text-primary">
              Tracking preview
            </p>
            <h1 className="mt-2 text-heading-lg font-semibold tracking-tight">Live Map</h1>
            <p className="mt-2 max-w-2xl text-body text-muted-foreground">
              Monitor simulated member positions and operational status without using live location
              data.
            </p>
          </div>
          <p className="text-body-sm text-muted-foreground">Last simulated update: 2:42 PM</p>
        </header>

        <MapStatusBar
          onlineCount={trackedMembers.filter((member) => member.status === 'online').length}
        />

        {viewState === 'loading' ? (
          <div
            role="status"
            className="rounded-xl border border-border bg-surface p-12 text-center"
          >
            <p className="font-semibold">Loading simulated tracking data…</p>
          </div>
        ) : viewState === 'provider-unavailable' ? (
          <section role="alert" className="rounded-xl border border-danger/40 bg-danger/5 p-6">
            <h2 className="text-heading-sm font-semibold">Map provider unavailable</h2>
            <p className="mt-2 text-body text-muted-foreground">
              Tracking cannot currently be shown. No member position should be treated as live.
            </p>
          </section>
        ) : (
          <>
            <div className="grid gap-section xl:grid-cols-[minmax(0,1.45fr)_minmax(20rem,0.55fr)]">
              <MapCanvas
                members={filteredMembers}
                selectedMemberId={selectedMember?.id ?? null}
                onSelectMember={handleSelectMember}
                onPreviewAction={handlePreviewAction}
              />
              <MemberDetails member={selectedMember} onPreviewAction={handlePreviewAction} />
            </div>

            <section
              aria-labelledby="members-heading"
              className="rounded-xl border border-border bg-surface p-page shadow-sm"
            >
              <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
                <div>
                  <h2 id="members-heading" className="text-heading-sm font-semibold">
                    Tracked members
                  </h2>
                  <p className="mt-1 text-body-sm text-muted-foreground">
                    Accessible list equivalent to the simulated map markers.
                  </p>
                </div>
                <div className="grid gap-3 sm:grid-cols-[minmax(14rem,1fr)_auto]">
                  <label className="grid gap-1 text-body-sm font-medium">
                    Search members
                    <Input
                      type="search"
                      value={search}
                      onChange={(event) => setSearch(event.target.value)}
                      placeholder="Search by name"
                    />
                  </label>
                  <button
                    type="button"
                    onClick={clearFilters}
                    className="min-h-control self-end rounded-md px-4 font-semibold text-primary focus-visible:outline-2 focus-visible:outline-focus-ring"
                  >
                    Clear filters
                  </button>
                </div>
              </div>

              <div
                className="my-5 flex flex-wrap gap-2"
                role="group"
                aria-label="Filter members by status"
              >
                {statusFilters.map((filter) => (
                  <button
                    key={filter}
                    type="button"
                    aria-pressed={statusFilter === filter}
                    onClick={() => setStatusFilter(filter)}
                    className={`min-h-control rounded-full border px-4 capitalize focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus-ring ${
                      statusFilter === filter
                        ? 'border-primary bg-primary text-primary-foreground'
                        : 'border-border bg-surface text-foreground'
                    }`}
                  >
                    {filter}
                  </button>
                ))}
              </div>

              <MemberList
                members={filteredMembers}
                selectedMemberId={selectedMember?.id ?? null}
                onSelectMember={handleSelectMember}
                onClearFilters={clearFilters}
              />
            </section>
          </>
        )}

        <p
          role="status"
          aria-live="polite"
          className="min-h-6 text-body-sm font-semibold text-primary"
        >
          {announcement}
        </p>
      </div>
    </ApplicationShell>
  );
}
