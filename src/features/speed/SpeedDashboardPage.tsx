import { useState } from 'react';
import { Button } from '@/components/ui/button';
import type { DashboardViewState, SpeedDashboardData } from './speed-dashboard.types';
import { SpeedometerGauge } from './components/SpeedometerGauge';
import { WeeklyTrendChart } from './components/WeeklyTrendChart';
import { RecentSessionsList } from './components/RecentSessionsList';
import { SpeedViolationsList } from './components/SpeedViolationsList';
import {
  MOCK_NORMAL_DATA,
  MOCK_OVER_LIMIT_DATA,
  MOCK_EMPTY_ACTIVITY_DATA,
  MOCK_EMPTY_VIOLATIONS_DATA,
} from './speed-dashboard.data';

const VIEW_STATE_DATA_MAP: Record<DashboardViewState, SpeedDashboardData | null> = {
  'normal': MOCK_NORMAL_DATA,
  'over-limit': MOCK_OVER_LIMIT_DATA,
  'empty-activity': MOCK_EMPTY_ACTIVITY_DATA,
  'empty-violations': MOCK_EMPTY_VIOLATIONS_DATA,
  'loading': null,
  'unavailable': null,
};

interface SpeedDashboardPageProps {
  initialViewState?: DashboardViewState;
}

export function SpeedDashboardPage({ initialViewState = 'normal' }: SpeedDashboardPageProps) {
  const [viewState, setViewState] = useState<DashboardViewState>(initialViewState);

  // Determine active mock data based on map lookup
  const data = VIEW_STATE_DATA_MAP[viewState];
  const currentStatus = data?.overview.status || 'safe';

  return (
    <div className="space-y-section max-w-7xl mx-auto p-4 md:p-6 pb-24">
      {/* Demo ViewState Switcher - Hidden in production, great for verification and testing */}
      <div className="rounded-xl border border-border bg-card p-4 shadow-sm space-y-3">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <h2 className="text-body-sm font-semibold uppercase tracking-wider text-muted-foreground">
            Demo State Switcher (Testing Controls)
          </h2>
          <span className="text-[11px] text-muted-foreground">
            Switch states below to verify dashboard requirements.
          </span>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button
            variant={viewState === 'normal' ? 'primary' : 'outline'}
            onClick={() => setViewState('normal')}
            size="sm"
            className="text-xs h-8"
          >
            Normal Data
          </Button>
          <Button
            variant={viewState === 'over-limit' ? 'primary' : 'outline'}
            onClick={() => setViewState('over-limit')}
            size="sm"
            className="text-xs h-8"
          >
            Over Limit State
          </Button>
          <Button
            variant={viewState === 'empty-activity' ? 'primary' : 'outline'}
            onClick={() => setViewState('empty-activity')}
            size="sm"
            className="text-xs h-8"
          >
            No Recent Activity
          </Button>
          <Button
            variant={viewState === 'empty-violations' ? 'primary' : 'outline'}
            onClick={() => setViewState('empty-violations')}
            size="sm"
            className="text-xs h-8"
          >
            No Violations
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
            variant={viewState === 'unavailable' ? 'primary' : 'outline'}
            onClick={() => setViewState('unavailable')}
            size="sm"
            className="text-xs h-8"
          >
            Data Unavailable
          </Button>
        </div>
      </div>

      {/* Title Header */}
      <header className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-heading-lg font-bold tracking-tight text-foreground">
            Speed Intelligence Dashboard
          </h1>
          <p className="text-body text-muted-foreground">
            Real-time telemetry, trip statistics, and speed limit compliance audits.
          </p>
        </div>
        {(viewState === 'normal' || viewState === 'over-limit') && data && (
          <div className="flex items-center gap-2 self-start sm:self-center">
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-success opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-success"></span>
            </span>
            <span className="text-body-sm font-medium text-foreground">System Active</span>
          </div>
        )}
      </header>

      {/* Informational Banner */}
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
        <p className="font-medium">
          This is a frontend preview using mock data. Production speed data requires device and
          backend integration.
        </p>
      </div>

      {/* Render states based on active viewState */}
      {viewState === 'loading' && (
        <div className="grid gap-6 md:grid-cols-3">
          <div className="md:col-span-1 space-y-6">
            {/* Speedometer skeleton */}
            <div className="h-[280px] rounded-xl border border-border bg-card p-6 flex flex-col justify-between animate-pulse">
              <div className="h-4 bg-muted rounded w-1/3"></div>
              <div className="self-center w-36 h-36 rounded-full border-4 border-muted flex items-center justify-center">
                <div className="w-16 h-8 bg-muted rounded"></div>
              </div>
              <div className="h-4 bg-muted rounded w-1/2 self-center"></div>
            </div>
            {/* Weekly trend skeleton */}
            <div className="h-[240px] rounded-xl border border-border bg-card p-6 flex flex-col justify-between animate-pulse">
              <div className="h-4 bg-muted rounded w-1/3"></div>
              <div className="flex gap-4 items-end justify-between h-32 pt-4">
                <div className="w-8 h-12 bg-muted rounded"></div>
                <div className="w-8 h-24 bg-muted rounded"></div>
                <div className="w-8 h-16 bg-muted rounded"></div>
                <div className="w-8 h-20 bg-muted rounded"></div>
                <div className="w-8 h-14 bg-muted rounded"></div>
                <div className="w-8 h-10 bg-muted rounded"></div>
              </div>
            </div>
          </div>

          <div className="md:col-span-2 space-y-6">
            {/* Stats skeleton */}
            <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
              {[1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className="h-24 rounded-xl border border-border bg-card p-4 animate-pulse space-y-3"
                >
                  <div className="h-3 bg-muted rounded w-2/3"></div>
                  <div className="h-6 bg-muted rounded w-1/2"></div>
                </div>
              ))}
            </div>

            {/* List skeleton */}
            <div className="rounded-xl border border-border bg-card p-6 animate-pulse space-y-4">
              <div className="h-4 bg-muted rounded w-1/4"></div>
              <div className="space-y-3">
                <div className="h-12 bg-muted rounded"></div>
                <div className="h-12 bg-muted rounded"></div>
                <div className="h-12 bg-muted rounded"></div>
              </div>
            </div>
          </div>
        </div>
      )}

      {viewState === 'unavailable' && (
        <div
          className="rounded-xl border border-border bg-card p-12 text-center max-w-xl mx-auto space-y-4 shadow-sm"
          role="alert"
        >
          <div className="w-16 h-16 rounded-full bg-danger/10 text-danger flex items-center justify-center mx-auto">
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
          <h2 className="text-heading-sm font-semibold text-foreground">Data Stream Offline</h2>
          <p className="text-body text-muted-foreground">
            Unable to connect to the vehicle telemetry service. Please check your system hardware,
            OBD connection, or device GPS settings.
          </p>
          <Button
            variant="outline"
            onClick={() => setViewState('normal')}
            className="mt-2"
          >
            Retry Connection
          </Button>
        </div>
      )}

      {/* Main Grid View */}
      {data && (
        <div className="grid gap-6 md:grid-cols-3">
          {/* LEFT COLUMN: SPEEDOMETER GAUGE & ACCESSIBLE CHART */}
          <div className="md:col-span-1 space-y-6">
            <SpeedometerGauge
              currentSpeed={data.overview.currentSpeed}
              speedLimit={data.overview.speedLimit}
              status={currentStatus}
              lastUpdated={data.overview.lastUpdated}
            />

            <WeeklyTrendChart trend={data.trend} />
          </div>

          {/* RIGHT COLUMN: STATS SUMMARY, ACTIVITY LIST, VIOLATIONS LIST */}
          <div className="md:col-span-2 space-y-6">
            {/* Speed Summary metrics cards */}
            <section aria-labelledby="summary-metrics-heading">
              <h2 id="summary-metrics-heading" className="sr-only">Speed Summary Metrics</h2>
              <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
                <article className="rounded-xl border border-border bg-card p-4 shadow-sm hover:border-muted transition-colors">
                  <p className="text-body-sm font-semibold text-muted-foreground uppercase tracking-wider">Average Speed</p>
                  <p className="mt-2 text-heading-md font-bold tracking-tight text-foreground">
                    {data.summary.averageSpeed} <span className="text-xs text-muted-foreground">km/h</span>
                  </p>
                </article>

                <article className="rounded-xl border border-border bg-card p-4 shadow-sm hover:border-muted transition-colors">
                  <p className="text-body-sm font-semibold text-muted-foreground uppercase tracking-wider">Maximum Speed</p>
                  <p className="mt-2 text-heading-md font-bold tracking-tight text-foreground">
                    {data.summary.maxSpeed} <span className="text-xs text-muted-foreground">km/h</span>
                  </p>
                </article>

                <article className="rounded-xl border border-border bg-card p-4 shadow-sm hover:border-muted transition-colors">
                  <p className="text-body-sm font-semibold text-muted-foreground uppercase tracking-wider">Distance Tracked</p>
                  <p className="mt-2 text-heading-md font-bold tracking-tight text-foreground">
                    {data.summary.distanceTracked} <span className="text-xs text-muted-foreground">km</span>
                  </p>
                </article>

                <article className="rounded-xl border border-border bg-card p-4 shadow-sm hover:border-muted transition-colors">
                  <p className="text-body-sm font-semibold text-muted-foreground uppercase tracking-wider">Total Time</p>
                  <p className="mt-2 text-heading-md font-bold tracking-tight text-foreground">
                    {data.summary.totalDrivingTime}
                  </p>
                </article>
              </div>
            </section>

            <RecentSessionsList sessions={data.sessions} />

            <SpeedViolationsList violations={data.violations} />
          </div>
        </div>
      )}
    </div>
  );
}
