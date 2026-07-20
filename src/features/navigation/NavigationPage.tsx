import { useState } from 'react';
import { Button } from '@/components/ui/button';
import type { NavigationViewState } from './navigation.types';
import { MOCK_ROUTES } from './navigation.data';
import { NavigationPlanner } from './components/NavigationPlanner';
import { RouteAlternatives } from './components/RouteAlternatives';
import { SimulatedMapHUD } from './components/SimulatedMapHUD';

interface NavigationPageProps {
  initialViewState?: NavigationViewState;
}

export function NavigationPage({ initialViewState = 'normal' }: NavigationPageProps) {
  const [viewState, setViewState] = useState<NavigationViewState>(initialViewState);
  const [origin, setOrigin] = useState(initialViewState === 'no-route' ? '' : 'School Depot Yard');
  const [destination, setDestination] = useState(
    initialViewState === 'no-route' ? '' : 'St. Mary School Ground, Sector 12',
  );
  const [selectedRouteId, setSelectedRouteId] = useState('route-1');
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [selectedHazard, setSelectedHazard] = useState<string>('Accident');
  const [reportNotes, setReportNotes] = useState('');
  const [activeReportStatus, setActiveReportStatus] = useState<string | null>(null);

  const hazardTypes = [
    { type: 'Construction', icon: '🚧', color: 'bg-amber-500/10 text-amber-600 border-amber-500/30' },
    { type: 'Flood', icon: '🌊', color: 'bg-blue-500/10 text-blue-600 border-blue-500/30' },
    { type: 'Accident', icon: '💥', color: 'bg-red-500/10 text-red-600 border-red-500/30' },
    { type: 'Closed Road', icon: '⛔', color: 'bg-rose-500/10 text-rose-600 border-rose-500/30' },
    { type: 'Police Checkpoint', icon: '🚔', color: 'bg-indigo-500/10 text-indigo-600 border-indigo-500/30' },
    { type: 'Road Damage', icon: '⚠️', color: 'bg-orange-500/10 text-orange-600 border-orange-500/30' },
  ];

  const handleReportSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsReportModalOpen(false);
    setActiveReportStatus(`Status: Pending Admin Verification -> Route Updated (${selectedHazard})`);
  };

  return (
    <div className="space-y-section max-w-7xl mx-auto p-4 md:p-6 pb-24">
      {/* Demo ViewState Controls */}
      <div className="rounded-xl border border-border bg-card p-4 shadow-sm space-y-3">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <h2 className="text-body-sm font-semibold uppercase tracking-wider text-muted-foreground">
            Demo State Switcher (Testing Controls)
          </h2>
          <span className="text-[11px] text-muted-foreground">
            Switch states below to verify navigation requirements.
          </span>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button
            variant={viewState === 'normal' ? 'primary' : 'outline'}
            onClick={() => {
              setViewState('normal');
              setOrigin('School Depot Yard');
              setDestination('St. Mary School Ground, Sector 12');
              setIsNavigating(false);
              setNavMessage('');
            }}
            size="sm"
            className="text-xs h-8"
          >
            Normal Data
          </Button>
          <Button
            variant={viewState === 'loading' ? 'primary' : 'outline'}
            onClick={() => setViewState('loading')}
            size="sm"
            className="text-xs h-8"
          >
            Loading State
          </Button>
          <Button
            variant={viewState === 'no-route' ? 'primary' : 'outline'}
            onClick={() => {
              setViewState('no-route');
              setOrigin('');
              setDestination('');
              setIsNavigating(false);
              setNavMessage('');
            }}
            size="sm"
            className="text-xs h-8"
          >
            No Route State
          </Button>
          <Button
            variant={viewState === 'unavailable' ? 'primary' : 'outline'}
            onClick={() => setViewState('unavailable')}
            size="sm"
            className="text-xs h-8"
          >
            Provider Offline
          </Button>
        </div>
      </div>

      {/* Header with Hazard Report Modal Trigger */}
      <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-border/60 pb-4">
        <div>
          <h1 className="text-heading-lg font-bold tracking-tight text-foreground">
            Operations & Navigation Guidance
          </h1>
          <p className="text-body text-muted-foreground">
            Plan trips, calculate route alternatives, and monitor live road alert telemetry.
          </p>
        </div>

        <Button
          variant="outline"
          onClick={() => setIsReportModalOpen(true)}
          className="font-bold text-xs border-amber-500/40 bg-amber-500/10 text-amber-600 hover:bg-amber-500/20 shrink-0"
        >
          🚧 Report Road Hazard / Closure
        </Button>
      </header>

      {/* Active Road Hazard Status Pill */}
      {activeReportStatus && (
        <div className="flex items-center justify-between gap-3 p-3.5 rounded-2xl border border-warning/40 bg-warning/10 animate-fade-in">
          <div className="flex items-center gap-2.5">
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-warning opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-warning"></span>
            </span>
            <span className="text-xs font-extrabold tracking-wide uppercase text-warning">
              {activeReportStatus}
            </span>
          </div>
          <button
            type="button"
            onClick={() => setActiveReportStatus(null)}
            className="text-xs font-bold text-muted-foreground hover:text-foreground underline"
          >
            Dismiss Pill
          </button>
        </div>
      )}

      {/* Warning Banner */}
      <div
        className="rounded-lg border border-warning/30 bg-warning/10 p-4 text-body-sm text-warning flex items-start gap-3 shadow-xs"
        role="status"
      >
        <svg
          className="h-5 w-5 shrink-0 mt-0.5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
        <div>
          <p className="font-semibold">Simulated Navigation Portal</p>
          <p className="mt-0.5 text-xs opacity-90">
            This dashboard uses simulated route maps and mock telemetry. No external map SDKs or
            active trackers are connected.
          </p>
        </div>
      </div>

      {/* Main Content Grid */}
      {viewState === 'loading' && (
        <div className="grid gap-6 md:grid-cols-3">
          <div className="md:col-span-1 space-y-6">
            <div className="h-[260px] rounded-xl border border-border bg-card p-6 animate-pulse space-y-4">
              <div className="h-4 bg-muted rounded w-1/3"></div>
              <div className="h-10 bg-muted rounded"></div>
              <div className="h-10 bg-muted rounded"></div>
            </div>
            <div className="h-[180px] rounded-xl border border-border bg-card p-6 animate-pulse space-y-3">
              <div className="h-4 bg-muted rounded w-1/2"></div>
              <div className="h-8 bg-muted rounded"></div>
              <div className="h-8 bg-muted rounded"></div>
            </div>
          </div>
          <div className="md:col-span-2">
            <div className="h-[460px] rounded-xl border border-border bg-card p-6 animate-pulse flex flex-col justify-between">
              <div className="h-4 bg-muted rounded w-1/4"></div>
              <div className="self-center w-24 h-24 rounded-full border-4 border-muted animate-spin border-t-primary"></div>
              <div className="h-4 bg-muted rounded w-1/2 self-center"></div>
            </div>
          </div>
        </div>
      )}

      {viewState === 'unavailable' && (
        <div
          className="rounded-xl border border-border bg-card p-12 text-center max-w-xl mx-auto space-y-4 shadow-sm"
          role="alert"
        >
          <div className="w-16 h-16 rounded-full bg-danger/10 text-danger flex items-center justify-center mx-auto animate-bounce">
            <svg
              className="h-8 w-8"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
          </div>
          <h2 className="text-heading-sm font-semibold text-foreground">
            Navigation Provider Offline
          </h2>
          <p className="text-body text-muted-foreground">
            The external route mapping service is currently unavailable or returned code 503. Please
            check device network settings or retry later.
          </p>
          <Button variant="outline" onClick={() => setViewState('normal')} className="mt-2">
            Retry Connection
          </Button>
        </div>
      )}

      {viewState === 'no-route' && (
        <div className="grid gap-6 md:grid-cols-3">
          <div className="md:col-span-1">
            <NavigationPlanner
              origin={origin}
              setOrigin={setOrigin}
              destination={destination}
              setDestination={setDestination}
              onFindRoutes={() => setViewState('normal')}
              onRecentClick={handleRecentClick}
            />
          </div>

          <div className="md:col-span-2">
            <div className="rounded-xl border border-dashed border-border bg-card p-12 text-center flex flex-col items-center justify-center min-h-[400px] space-y-4">
              <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center text-muted-foreground">
                <svg
                  className="h-6 w-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"
                  />
                </svg>
              </div>
              <h2 className="text-body font-bold text-foreground">No Route Configured</h2>
              <p className="text-body-sm text-muted-foreground max-w-sm">
                Enter an origin and destination point in the planner panel or select a recent search
                suggestion to inspect alternatives.
              </p>
            </div>
          </div>
        </div>
      )}

      {viewState === 'normal' && (
        <div className="grid gap-6 md:grid-cols-3">
          <div className="md:col-span-1">
            <RouteAlternatives
              selectedRouteId={selectedRouteId}
              onSelectRoute={(id) => {
                setSelectedRouteId(id);
                setIsNavigating(false);
                setNavMessage('');
              }}
              onClearRoute={handleClearRoute}
              origin={origin}
              setOrigin={setOrigin}
              destination={destination}
              setDestination={setDestination}
              onRecentClick={handleRecentClick}
            />
          </div>

          {/* Simulated Navigator Display */}
          <div className="md:col-span-2 space-y-6">
            <SimulatedMapHUD
              selectedRoute={selectedRoute}
              selectedRouteId={selectedRouteId}
              isNavigating={isNavigating}
              onStartNavigation={handleStartNavigation}
            />

            {/* Notification alert on start guidance */}
            {isNavigating && navMessage && (
              <div
                className="rounded-lg border border-success/30 bg-success/10 p-4 text-body-sm text-success flex items-center justify-between shadow-xs animate-fade-in"
                role="status"
              >
                <div className="flex items-center gap-3">
                  <span className="relative flex h-3 w-3">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-success opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-success"></span>
                  </span>
                  <p className="font-semibold">{navMessage}</p>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  className="h-8 border-success/20 text-success hover:bg-success/5"
                  onClick={() => setIsNavigating(false)}
                >
                  Cancel Guidance
                </Button>
              </div>
      {/* Report Road Hazard Modal Dialog (PDF Section 13 Compliant) */}
      {isReportModalOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="hazard-modal-title"
          className="fixed inset-0 z-modal flex items-center justify-center p-4 bg-overlay backdrop-blur-sm animate-fade-in"
        >
          <div className="relative w-full max-w-lg rounded-2xl border border-border bg-card p-6 shadow-2xl space-y-6">
            <div className="flex items-center justify-between border-b border-border/60 pb-4">
              <div className="flex items-center gap-2.5">
                <span className="text-2xl">🚧</span>
                <div>
                  <h3 id="hazard-modal-title" className="text-heading-sm font-bold text-foreground">
                    Report Road Hazard / Closure
                  </h3>
                  <p className="text-body-xs text-muted-foreground">
                    PDF Section 13 Hazard Telemetry & Route Recalculation
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsReportModalOpen(false)}
                className="rounded-full p-1.5 text-muted-foreground hover:bg-surface-muted hover:text-foreground"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleReportSubmit} className="space-y-5">
              <div className="space-y-2">
                <label className="text-body-xs font-bold uppercase tracking-wider text-muted-foreground">
                  Select Hazard Type (*Required)
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                  {hazardTypes.map((item) => (
                    <button
                      key={item.type}
                      type="button"
                      onClick={() => setSelectedHazard(item.type)}
                      className={`flex flex-col items-center justify-center p-3 rounded-xl border transition-all text-center ${
                        selectedHazard === item.type
                          ? 'border-primary bg-primary/10 text-primary shadow-sm ring-2 ring-primary/30 font-bold scale-102'
                          : 'border-border bg-surface-muted/30 text-muted-foreground hover:text-foreground'
                      }`}
                    >
                      <span className="text-xl mb-1">{item.icon}</span>
                      <span className="text-body-xs font-bold">{item.type}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-body-xs font-bold uppercase tracking-wider text-muted-foreground">
                  Additional Notes (Optional)
                </label>
                <textarea
                  rows={2}
                  value={reportNotes}
                  onChange={(e) => setReportNotes(e.target.value)}
                  placeholder="e.g. Left lane blocked near Sector 12 junction."
                  className="w-full rounded-xl border border-input bg-surface px-3 py-2 text-body-sm text-foreground focus:border-primary focus:ring-2 focus:ring-primary/20"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-border/60">
                <Button variant="outline" size="sm" type="button" onClick={() => setIsReportModalOpen(false)}>
                  Cancel
                </Button>
                <Button variant="primary" size="sm" type="submit" className="font-bold">
                  Submit Report to Admin
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
