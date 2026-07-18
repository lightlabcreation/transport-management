import type { AlertRecord } from '../alerts.types';

interface AlertSummaryMetricsProps {
  alerts: AlertRecord[];
}

export function AlertSummaryMetrics({ alerts }: AlertSummaryMetricsProps) {
  const unreadCount = alerts.filter((a) => !a.isRead).length;
  const highCount = alerts.filter((a) => a.severity === 'high').length;
  const mediumCount = alerts.filter((a) => a.severity === 'medium').length;
  const lowCount = alerts.filter((a) => a.severity === 'low').length;

  return (
    <section
      aria-labelledby="alerts-summary-heading"
      className="grid gap-4 grid-cols-2 lg:grid-cols-4"
    >
      <h2 id="alerts-summary-heading" className="sr-only">
        Alerts Summary Metrics
      </h2>

      <article className="rounded-xl border border-border bg-card p-4 shadow-sm hover:border-muted transition-all">
        <span className="text-body-sm font-semibold text-muted-foreground uppercase tracking-wider block">
          Unread Alerts
        </span>
        <span className="mt-2 text-heading-md font-bold tracking-tight text-foreground block flex items-center gap-2">
          {unreadCount > 0 && (
            <span className="relative flex h-3.5 w-3.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-danger opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-danger"></span>
            </span>
          )}
          {unreadCount}
        </span>
      </article>

      <article className="rounded-xl border border-border bg-card p-4 shadow-sm hover:border-muted transition-all">
        <span className="text-body-sm font-semibold text-muted-foreground uppercase tracking-wider block">
          High Severity
        </span>
        <span className="mt-2 text-heading-md font-bold tracking-tight text-danger block">
          {highCount}
        </span>
      </article>

      <article className="rounded-xl border border-border bg-card p-4 shadow-sm hover:border-muted transition-all">
        <span className="text-body-sm font-semibold text-muted-foreground uppercase tracking-wider block">
          Medium Severity
        </span>
        <span className="mt-2 text-heading-md font-bold tracking-tight text-warning block">
          {mediumCount}
        </span>
      </article>

      <article className="rounded-xl border border-border bg-card p-4 shadow-sm hover:border-muted transition-all">
        <span className="text-body-sm font-semibold text-muted-foreground uppercase tracking-wider block">
          Low Severity
        </span>
        <span className="mt-2 text-heading-md font-bold tracking-tight text-info block">
          {lowCount}
        </span>
      </article>
    </section>
  );
}
