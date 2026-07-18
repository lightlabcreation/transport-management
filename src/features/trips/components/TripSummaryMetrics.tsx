import type { TripRecord } from '../trips.types';

interface TripSummaryMetricsProps {
  trips: TripRecord[];
}

export function TripSummaryMetrics({ trips }: TripSummaryMetricsProps) {
  const completed = trips.filter((t) => t.status === 'completed');
  const activeCount = trips.filter((t) => t.status === 'active').length;

  const totalDistance = trips.reduce((sum, t) => sum + t.distance, 0);

  const avgSpeedSum = completed.reduce((sum, t) => sum + t.avgSpeed, 0);
  const averageSpeed = completed.length > 0 ? (avgSpeedSum / completed.length).toFixed(1) : '0';

  return (
    <section
      aria-labelledby="trips-metrics-heading"
      className="grid gap-4 grid-cols-2 lg:grid-cols-4"
    >
      <h2 id="trips-metrics-heading" className="sr-only">
        Trip Metrics Overview
      </h2>

      <article className="rounded-xl border border-border bg-card p-4 shadow-sm hover:border-muted transition-all">
        <span className="text-body-sm font-semibold text-muted-foreground uppercase tracking-wider block">
          Total Trips
        </span>
        <span className="mt-2 text-heading-md font-bold tracking-tight text-foreground block">
          {trips.length}
        </span>
      </article>

      <article className="rounded-xl border border-border bg-card p-4 shadow-sm hover:border-muted transition-all">
        <span className="text-body-sm font-semibold text-muted-foreground uppercase tracking-wider block">
          Active Routes
        </span>
        <span className="mt-2 text-heading-md font-bold tracking-tight text-foreground block flex items-center gap-2">
          {activeCount > 0 && (
            <span className="relative flex h-3.5 w-3.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-success opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-success"></span>
            </span>
          )}
          {activeCount}
        </span>
      </article>

      <article className="rounded-xl border border-border bg-card p-4 shadow-sm hover:border-muted transition-all">
        <span className="text-body-sm font-semibold text-muted-foreground uppercase tracking-wider block">
          Total Distance
        </span>
        <span className="mt-2 text-heading-md font-bold tracking-tight text-foreground block">
          {totalDistance.toFixed(1)} <span className="text-xs text-muted-foreground">km</span>
        </span>
      </article>

      <article className="rounded-xl border border-border bg-card p-4 shadow-sm hover:border-muted transition-all">
        <span className="text-body-sm font-semibold text-muted-foreground uppercase tracking-wider block">
          Avg Trip Speed
        </span>
        <span className="mt-2 text-heading-md font-bold tracking-tight text-foreground block">
          {averageSpeed} <span className="text-xs text-muted-foreground">km/h</span>
        </span>
      </article>
    </section>
  );
}
