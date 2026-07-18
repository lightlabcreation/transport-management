import { Badge } from '@/components/ui/badge';
import type { PerformanceMetric } from '../reports.types';

interface ReportSummaryCardsProps {
  metrics: PerformanceMetric[];
}

export function ReportSummaryCards({ metrics }: ReportSummaryCardsProps) {
  return (
    <section
      aria-labelledby="reports-metrics-heading"
      className="grid gap-4 grid-cols-2 lg:grid-cols-4"
    >
      <h2 id="reports-metrics-heading" className="sr-only">
        Performance Report Cards
      </h2>

      {metrics.map((metric, i) => (
        <article
          key={i}
          className="rounded-xl border border-border bg-card p-4 shadow-sm hover:border-muted transition-all flex flex-col justify-between"
        >
          <div>
            <span className="text-body-sm font-semibold text-muted-foreground uppercase tracking-wider block">
              {metric.label}
            </span>
            <span className="mt-2 text-heading-md font-bold tracking-tight text-foreground block">
              {metric.value}
            </span>
          </div>
          <div className="mt-3 flex items-center justify-between">
            <span className="text-[11px] text-muted-foreground">{metric.change}</span>
            <Badge
              variant="outline"
              className={`text-[9px] font-bold px-1.5 uppercase ${
                metric.isPositive
                  ? 'bg-success/15 text-success border-success/20'
                  : 'bg-danger/15 text-danger border-danger/20'
              }`}
            >
              {metric.isPositive ? 'PRO' : 'WAR'}
            </Badge>
          </div>
        </article>
      ))}
    </section>
  );
}
