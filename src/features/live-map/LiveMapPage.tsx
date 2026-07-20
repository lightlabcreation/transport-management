import { useMemo, useState } from 'react';
import { Navigate, useLocation, useNavigate } from 'react-router';

import { Input } from '@/components/ui/input';
import type { DemoAccessStore } from '@/features/access-control';
import { getApplicationNavigation } from '@/features/app-navigation';
import { browserApplicationModeStore } from '@/features/application-mode';
import type { AuthSessionStore } from '@/features/auth';
import { ApplicationShell } from '@/features/shell';

import { LeafletMapCanvas } from './components/LeafletMapCanvas';
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
  const [isLifeTrackingOn, setIsLifeTrackingOn] = useState(true);
  const [mapEngine, setMapEngine] = useState<'openstreetmap' | 'googlemaps' | 'tomtom' | 'mapbox'>('openstreetmap');
  const [activeLayers, setActiveLayers] = useState<Set<string>>(new Set());

  const mapEngines = [
    { id: 'openstreetmap' as const, label: '🗺️ OpenStreetMap', badge: 'Free' },
    { id: 'googlemaps' as const, label: '📍 Google Maps', badge: 'SDK' },
    { id: 'tomtom' as const, label: '⚡ TomTom Speed', badge: 'API' },
    { id: 'mapbox' as const, label: '🧩 Mapbox', badge: 'GL' },
  ] as const;

  const mapLayers = [
    { id: 'satellite', label: '🛰️ Satellite' },
    { id: 'traffic', label: '🚦 Traffic' },
    { id: 'compass', label: '🧭 Compass' },
    { id: 'streetview', label: '🛣️ Street View' },
  ] as const;

  function toggleLayer(layerId: string) {
    setActiveLayers((prev) => {
      const next = new Set(prev);
      if (next.has(layerId)) {
        next.delete(layerId);
      } else {
        next.add(layerId);
      }
      return next;
    });
  }

  const applicationMode = browserApplicationModeStore.getMode();
  const accessProfile = accessStore?.getProfile() ?? null;
  const isVisitor = accessProfile?.id === 'group-guest';

  const applicationNavigation = applicationMode
    ? getApplicationNavigation(applicationMode, accessProfile)
    : [];

  const filteredMembers = useMemo(() => {
    if (!isLifeTrackingOn) return [];

    const normalizedSearch = search.trim().toLowerCase();
    return trackedMembers.filter((member) => {
      // Client Rule 2: Visitor Visible to himself only
      const isVisitorMember = member.id.includes('guest') || member.name.toLowerCase().includes('visitor');
      if (isVisitorMember && !isVisitor) {
        return false;
      }

      const matchesName =
        normalizedSearch === '' || member.name.toLowerCase().includes(normalizedSearch);
      const matchesStatus = statusFilter === 'all' || member.status === statusFilter;
      return matchesName && matchesStatus;
    });
  }, [search, statusFilter, isLifeTrackingOn, isVisitor]);

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
          onlineCount={filteredMembers.filter((member) => member.status === 'online').length}
          isLifeTrackingOn={isLifeTrackingOn}
          onToggleLifeTracking={() => {
            setIsLifeTrackingOn((prev) => !prev);
            setAnnouncement(
              !isLifeTrackingOn ? 'Life Tracking enabled.' : 'Life Tracking paused.'
            );
          }}
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
            {/* Map Engine Switcher (PDF Sec 10) */}
            <div
              aria-label="Map engine selector"
              className="flex flex-wrap items-center gap-2 rounded-xl border border-border bg-surface p-3"
            >
              <span className="text-body-xs font-bold uppercase tracking-widest text-muted-foreground mr-1">
                Engine:
              </span>
              {mapEngines.map((engine) => (
                <button
                  key={engine.id}
                  type="button"
                  aria-pressed={mapEngine === engine.id}
                  onClick={() => setMapEngine(engine.id)}
                  className={`inline-flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-body-xs font-semibold transition-colors ${
                    mapEngine === engine.id
                      ? 'border-primary bg-primary text-primary-foreground shadow-sm'
                      : 'border-border bg-surface-muted text-foreground hover:border-primary/50'
                  }`}
                >
                  {engine.label}
                  <span className="rounded bg-current/10 px-1 py-0.5 text-[9px] font-bold tracking-wider">
                    {engine.badge}
                  </span>
                </button>
              ))}

              <span className="ml-auto text-body-xs font-bold uppercase tracking-widest text-muted-foreground mr-1">
                Layers:
              </span>
              {mapLayers.map((layer) => (
                <button
                  key={layer.id}
                  type="button"
                  aria-pressed={activeLayers.has(layer.id)}
                  onClick={() => toggleLayer(layer.id)}
                  className={`inline-flex items-center gap-1 rounded-lg border px-3 py-1.5 text-body-xs font-semibold transition-colors ${
                    activeLayers.has(layer.id)
                      ? 'border-success bg-success/10 text-success'
                      : 'border-border bg-surface-muted text-muted-foreground hover:border-success/50'
                  }`}
                >
                  {layer.label}
                </button>
              ))}
            </div>

            <div className="grid gap-section xl:grid-cols-[minmax(0,1.45fr)_minmax(20rem,0.55fr)]">
              <LeafletMapCanvas
                members={filteredMembers}
                selectedMemberId={selectedMember?.id ?? null}
                onSelectMember={handleSelectMember}
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
