import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import type { AlertRecord } from '../alerts.types';

interface AlertDetailCardProps {
  alert: AlertRecord;
  onMarkRead: (id: string) => void;
  onClose: () => void;
}

export function AlertDetailCard({ alert, onMarkRead, onClose }: AlertDetailCardProps) {
  const sevColors = {
    low: 'bg-info/20 text-info border-info/30',
    medium: 'bg-warning/20 text-warning border-warning/30',
    high: 'bg-danger/20 text-danger border-danger/30',
  };

  return (
    <section
      aria-labelledby="alert-detail-title"
      className="rounded-xl border border-primary/30 bg-card p-6 shadow-sm space-y-5 relative overflow-hidden"
    >
      <div className="flex items-center justify-between border-b border-border pb-3">
        <h2 id="alert-detail-title" className="text-body font-bold text-foreground">
          Alert Details
        </h2>
        <button
          onClick={onClose}
          className="text-xs text-muted-foreground hover:text-foreground font-semibold"
          aria-label="Close details"
        >
          ✕ Close
        </button>
      </div>

      <div className="space-y-4">
        <div>
          <div className="flex items-center gap-2 flex-wrap">
            <Badge
              variant="outline"
              className={`text-[10px] font-bold uppercase ${sevColors[alert.severity]}`}
            >
              {alert.severity} Severity
            </Badge>
            <Badge
              variant="outline"
              className="text-[10px] font-bold uppercase bg-slate-700/20 text-slate-400 border-slate-700/30"
            >
              {alert.type}
            </Badge>
          </div>
          <span className="font-bold text-foreground text-body-sm block mt-2">{alert.title}</span>
          <span className="text-[10px] text-muted-foreground block mt-0.5">
            Received: {alert.timeLabel}
          </span>
        </div>

        <div className="text-xs text-foreground bg-muted/5 border border-border/40 p-3 rounded-lg leading-relaxed">
          {alert.description}
        </div>

        {alert.location && (
          <div>
            <span className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider block">
              Incident Location
            </span>
            <span className="font-semibold text-foreground text-xs block mt-0.5">
              📍 {alert.location}
            </span>
          </div>
        )}

        {alert.extraInfo && (
          <div className="border-t border-border/50 pt-3">
            <span className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider block">
              Audit Data
            </span>
            <span className="text-xs text-muted-foreground block mt-0.5 leading-relaxed">
              {alert.extraInfo}
            </span>
          </div>
        )}

        <div className="border-t border-border/50 pt-4 flex items-center justify-between gap-4">
          <span className="text-xs text-muted-foreground">
            Status: {alert.isRead ? '✓ Read' : 'Unread'}
          </span>
          {!alert.isRead && (
            <Button
              variant="primary"
              size="sm"
              onClick={() => onMarkRead(alert.id)}
              className="text-xs h-8"
            >
              Mark as Read
            </Button>
          )}
        </div>
      </div>
    </section>
  );
}
