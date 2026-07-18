import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import type { TripsViewState } from './trips.types';
import { MOCK_TRIPS } from './trips.data';
import { TripSummaryMetrics } from './components/TripSummaryMetrics';
import { TripTableList } from './components/TripTableList';
import { TripDetailCard } from './components/TripDetailCard';

const VIEW_STATE_MAP: Record<TripsViewState, typeof MOCK_TRIPS | null> = {
  normal: MOCK_TRIPS,
  empty: [],
  loading: null,
};

interface TripsPageProps {
  initialViewState?: TripsViewState;
}

export function TripsPage({ initialViewState = 'normal' }: TripsPageProps) {
  const [viewState, setViewState] = useState<TripsViewState>(initialViewState);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [selectedTripId, setSelectedTripId] = useState<string>('trip-1');

  // Determine active mock data base
  const baseTrips = VIEW_STATE_MAP[viewState];

  // Filtering Logic
  const filteredTrips = baseTrips
    ? baseTrips.filter((trip) => {
        const matchesQuery =
          trip.routeLabel.toLowerCase().includes(searchQuery.toLowerCase()) ||
          trip.driverLabel.toLowerCase().includes(searchQuery.toLowerCase()) ||
          trip.vehicleLabel.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesStatus = selectedStatus === 'all' || trip.status === selectedStatus;
        return matchesQuery && matchesStatus;
      })
    : [];

  const selectedTrip = filteredTrips.find((t) => t.id === selectedTripId) || filteredTrips[0];

  return (
    <div className="space-y-section max-w-7xl mx-auto p-4 md:p-6 pb-24">
      {/* Demo ViewState Switcher - Hidden in production, great for verification and testing */}
      <div className="rounded-xl border border-border bg-card p-4 shadow-sm space-y-3">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <h2 className="text-body-sm font-semibold uppercase tracking-wider text-muted-foreground">
            Demo State Switcher (Testing Controls)
          </h2>
          <span className="text-[11px] text-muted-foreground">
            Switch states below to verify trips requirements.
          </span>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button
            variant={viewState === 'normal' ? 'primary' : 'outline'}
            onClick={() => {
              setViewState('normal');
              setSelectedTripId('trip-1');
            }}
            size="sm"
            className="text-xs h-8"
          >
            Normal Data
          </Button>
          <Button
            variant={viewState === 'empty' ? 'primary' : 'outline'}
            onClick={() => setViewState('empty')}
            size="sm"
            className="text-xs h-8"
          >
            Empty State
          </Button>
          <Button
            variant={viewState === 'loading' ? 'primary' : 'outline'}
            onClick={() => setViewState('loading')}
            size="sm"
            className="text-xs h-8"
          >
            Loading State
          </Button>
        </div>
      </div>

      {/* Title Header */}
      <header>
        <h1 className="text-heading-lg font-bold tracking-tight text-foreground">
          Trips Log Directory
        </h1>
        <p className="text-body text-muted-foreground">
          Monitor driving schedules, completed route times, vehicle distances, and average speeds.
        </p>
      </header>

      {/* Summary Metrics */}
      {baseTrips && <TripSummaryMetrics trips={baseTrips} />}

      {/* Loading Skeletons */}
      {viewState === 'loading' && (
        <div className="grid gap-6 md:grid-cols-3 animate-pulse">
          <div className="md:col-span-2 space-y-4">
            <div className="h-12 bg-muted rounded w-1/3"></div>
            <div className="h-[280px] bg-muted rounded-xl"></div>
          </div>
          <div className="md:col-span-1">
            <div className="h-[360px] bg-muted rounded-xl"></div>
          </div>
        </div>
      )}

      {/* Data Panel */}
      {baseTrips && (
        <div className="grid gap-6 md:grid-cols-3">
          <div className="md:col-span-2 space-y-6">
            {/* Filters Bar */}
            <div className="flex flex-col sm:flex-row gap-3 items-center justify-between bg-card p-4 rounded-xl border border-border">
              <div className="w-full sm:max-w-xs">
                <label htmlFor="trip-search" className="sr-only">
                  Search Trips
                </label>
                <Input
                  id="trip-search"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search route, driver, bus..."
                  className="h-9"
                />
              </div>

              <div className="flex gap-2 w-full sm:w-auto justify-end">
                <Button
                  variant={selectedStatus === 'all' ? 'primary' : 'outline'}
                  size="sm"
                  onClick={() => setSelectedStatus('all')}
                  className="h-8 text-xs"
                >
                  All Statuses
                </Button>
                <Button
                  variant={selectedStatus === 'completed' ? 'primary' : 'outline'}
                  size="sm"
                  onClick={() => setSelectedStatus('completed')}
                  className="h-8 text-xs"
                >
                  Completed
                </Button>
                <Button
                  variant={selectedStatus === 'active' ? 'primary' : 'outline'}
                  size="sm"
                  onClick={() => setSelectedStatus('active')}
                  className="h-8 text-xs"
                >
                  Active
                </Button>
              </div>
            </div>

            {/* List Table */}
            {filteredTrips.length === 0 ? (
              <div className="rounded-xl border border-dashed border-border bg-card p-12 text-center flex flex-col items-center justify-center min-h-[260px] space-y-3">
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
                      d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                    />
                  </svg>
                </div>
                <h2 className="text-body font-bold text-foreground">No Trips Found</h2>
                <p className="text-body-sm text-muted-foreground">
                  No records match your query or filters. Refine search keywords or toggle states
                  above.
                </p>
              </div>
            ) : (
              <TripTableList
                trips={filteredTrips}
                selectedTripId={selectedTrip?.id || ''}
                onSelectTrip={(id) => setSelectedTripId(id)}
              />
            )}
          </div>

          {/* Details Sidebar overlay */}
          <div className="md:col-span-1">
            {selectedTrip ? (
              <TripDetailCard trip={selectedTrip} onClose={() => setSelectedTripId('')} />
            ) : (
              <div className="rounded-xl border border-dashed border-border bg-card p-6 text-center text-muted-foreground text-xs min-h-[160px] flex items-center justify-center">
                Select a trip from the list to display telemetry, duration log, and vehicle details
                here.
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
