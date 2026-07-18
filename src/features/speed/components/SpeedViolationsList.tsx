import { Badge } from '@/components/ui/badge';
import type { SpeedViolation } from '../speed-dashboard.types';

interface SpeedViolationsListProps {
  violations: SpeedViolation[];
}

export function SpeedViolationsList({ violations }: SpeedViolationsListProps) {
  return (
    <section
      aria-labelledby="violations-heading"
      className="rounded-xl border border-border bg-card p-5 shadow-sm space-y-4"
    >
      <div className="flex items-center justify-between border-b border-border/50 pb-3">
        <h2 id="violations-heading" className="text-body font-bold text-foreground">
          Recent Speed Violations
        </h2>
        <Badge
          variant="outline"
          className="text-xs font-semibold px-2 py-0.5 border-danger/40 text-danger bg-danger/5"
        >
          Violations: {violations.length}
        </Badge>
      </div>

      {violations.length === 0 ? (
        <div className="py-8 text-center text-muted-foreground space-y-2">
          <div className="w-10 h-10 rounded-full bg-success/15 text-success flex items-center justify-center mx-auto">
            <svg
              className="h-5 w-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <p className="text-body-sm font-medium text-foreground">No speed violations detected.</p>
          <p className="text-[11px] text-muted-foreground">Keep up the safe driving practices!</p>
        </div>
      ) : (
        <div className="space-y-3">
          {violations.map((violation) => {
            const sevColors = {
              low: 'bg-info/20 text-info border-info/30',
              medium: 'bg-warning/20 text-warning border-warning/30',
              high: 'bg-danger/25 text-danger border-danger/30',
            };

            return (
              <article
                key={violation.id}
                className="rounded-lg border border-border p-4 hover:bg-muted/10 transition-colors flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-semibold text-foreground">{violation.locationLabel}</span>
                    <Badge
                      variant="outline"
                      className={`text-[10px] leading-none uppercase font-bold px-2 py-0.5 border ${sevColors[violation.severity]}`}
                    >
                      {violation.severity} Risk
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground">Timestamp: {violation.timeLabel}</p>
                </div>

                <div className="flex items-center gap-4 border-t border-border/40 pt-3 sm:border-t-0 sm:pt-0">
                  <div className="text-right">
                    <span className="text-xs text-muted-foreground uppercase tracking-wider block">
                      Recorded
                    </span>
                    <span className="font-bold text-foreground">
                      {violation.recordedSpeed} km/h
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="text-xs text-muted-foreground uppercase tracking-wider block">
                      Limit
                    </span>
                    <span className="font-medium text-muted-foreground">
                      {violation.allowedLimit} km/h
                    </span>
                  </div>
                  <div className="text-right text-danger font-bold pl-2 border-l border-border/40">
                    <span className="text-xs text-danger/80 uppercase tracking-wider block">
                      Excess
                    </span>
                    <span>+{violation.difference} km/h</span>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </section>
  );
}
