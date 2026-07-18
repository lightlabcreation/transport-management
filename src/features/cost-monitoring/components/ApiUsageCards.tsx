import { Badge } from '@/components/ui/badge';
import type { ApiServiceMetric } from '../cost-monitoring.types';

interface ApiUsageCardsProps {
  services: ApiServiceMetric[];
}

export function ApiUsageCards({ services }: ApiUsageCardsProps) {
  return (
    <div
      className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4"
      role="region"
      aria-label="API Services Daily Quota & Cost Breakdown"
    >
      {services.map((svc) => (
        <div
          key={svc.id}
          className="flex flex-col justify-between rounded-xl border border-border bg-card p-5 shadow-sm transition-shadow duration-fast hover:shadow-md"
        >
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Badge
                variant={
                  svc.status === 'danger'
                    ? 'danger'
                    : svc.status === 'warning'
                      ? 'warning'
                      : 'info'
                }
              >
                {svc.provider}
              </Badge>
              <span className="text-body-xs font-semibold text-muted-foreground">
                {svc.percentUsed}% Quota
              </span>
            </div>

            <h3 className="text-body font-bold text-foreground line-clamp-1">
              {svc.serviceName}
            </h3>
            <p className="text-body-xs text-muted-foreground line-clamp-2">
              {svc.description}
            </p>
          </div>

          <div className="mt-4 space-y-3 pt-3 border-t border-border">
            <div className="flex items-baseline justify-between">
              <span className="text-body-xs font-medium text-muted-foreground">Monthly Spend</span>
              <span className="text-heading-md font-bold text-foreground">{svc.monthlyCost}</span>
            </div>

            <div className="space-y-1">
              <div className="flex justify-between text-body-xs text-muted-foreground">
                <span>Daily Requests</span>
                <span className="font-semibold text-foreground">
                  {svc.dailyRequestsCount.toLocaleString()} / {svc.dailyLimit.toLocaleString()}
                </span>
              </div>
              <div className="h-2 w-full overflow-hidden rounded-full bg-surface-muted">
                <div
                  className={`h-full transition-all duration-300 ${
                    svc.status === 'danger'
                      ? 'bg-danger'
                      : svc.status === 'warning'
                        ? 'bg-warning'
                        : 'bg-primary'
                  }`}
                  style={{ width: `${Math.min(svc.percentUsed, 100)}%` }}
                />
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
