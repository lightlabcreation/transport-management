import { Badge } from '@/components/ui/badge';
import type { AlertRecord } from '../alerts.types';

interface AlertsListItemsProps {
  alerts: AlertRecord[];
  selectedAlertId: string;
  onSelectAlert: (id: string) => void;
}

export function AlertsListItems({ alerts, selectedAlertId, onSelectAlert }: AlertsListItemsProps) {
  const sevBadgeColors = {
    low: 'bg-info/10 text-info border-info/30',
    medium: 'bg-warning/10 text-warning border-warning/30',
    high: 'bg-danger/10 text-danger border-danger/30',
  };

  if (alerts.length === 0) {
    return (
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
              d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </div>
        <h2 className="text-body font-bold text-foreground">No Alerts Found</h2>
        <p className="text-body-sm text-muted-foreground">
          Everything is clear! No active notices or unresolved warnings match the filters.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {alerts.map((alert) => {
        const isSelected = alert.id === selectedAlertId;
        return (
          <article
            key={alert.id}
            onClick={() => onSelectAlert(alert.id)}
            className={`rounded-xl border p-4 hover:bg-muted/10 cursor-pointer transition-all flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between relative ${
              isSelected ? 'border-primary bg-primary/5 shadow-xs' : 'border-border'
            }`}
          >
            <div className="space-y-1">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="font-semibold text-foreground text-body-sm">{alert.title}</span>
                <Badge
                  variant="outline"
                  className={`text-[9px] uppercase font-bold ${sevBadgeColors[alert.severity]}`}
                >
                  {alert.severity}
                </Badge>
                {!alert.isRead && (
                  <span
                    className="h-2 w-2 rounded-full bg-danger shrink-0"
                    aria-label="Unread alert"
                  ></span>
                )}
              </div>
              <p className="text-xs text-muted-foreground line-clamp-1">{alert.description}</p>
            </div>

            <div className="text-right shrink-0">
              <span className="text-[10px] text-muted-foreground block">{alert.timeLabel}</span>
              <span className="text-[10px] font-semibold text-slate-400 capitalize block mt-0.5">
                Type: {alert.type}
              </span>
            </div>
          </article>
        );
      })}
    </div>
  );
}
