import { Badge } from '@/components/ui/badge';
import type { TripRecord } from '../trips.types';

interface TripDetailCardProps {
  trip: TripRecord;
  onClose: () => void;
}

export function TripDetailCard({ trip, onClose }: TripDetailCardProps) {
  const statusBadges = {
    completed: 'bg-success/20 text-success border-success/30',
    active: 'bg-info/20 text-info border-info/30',
    scheduled: 'bg-slate-700/20 text-slate-400 border-slate-700/30',
  };

  return (
    <section
      aria-labelledby="trip-detail-heading"
      className="rounded-xl border border-primary/30 bg-card p-6 shadow-sm space-y-6 relative overflow-hidden"
    >
      <div className="flex items-center justify-between border-b border-border pb-3">
        <h2 id="trip-detail-heading" className="text-body font-bold text-foreground">
          Trip Log Details
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
          <span className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider block">
            Trip Route
          </span>
          <span className="font-bold text-foreground text-body-sm block mt-0.5">
            {trip.routeLabel}
          </span>
        </div>

        <div className="grid gap-4 grid-cols-2">
          <div>
            <span className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider block">
              Driver
            </span>
            <span className="font-semibold text-foreground text-xs block mt-0.5">
              👤 {trip.driverLabel}
            </span>
          </div>
          <div>
            <span className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider block">
              Vehicle
            </span>
            <span className="font-semibold text-foreground text-xs block mt-0.5">
              🚌 {trip.vehicleLabel}
            </span>
          </div>
        </div>

        <div className="grid gap-4 grid-cols-2 border-t border-border/50 pt-3">
          <div>
            <span className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider block">
              Start Time
            </span>
            <span className="font-medium text-foreground text-xs block mt-0.5">
              {trip.startTime}
            </span>
          </div>
          <div>
            <span className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider block">
              End Time
            </span>
            <span className="font-medium text-foreground text-xs block mt-0.5">{trip.endTime}</span>
          </div>
        </div>

        <div className="grid gap-4 grid-cols-3 border-t border-border/50 pt-3">
          <div>
            <span className="text-[10px] text-muted-foreground uppercase block font-semibold">
              Distance
            </span>
            <span className="font-bold text-foreground block">{trip.distance} km</span>
          </div>
          <div>
            <span className="text-[10px] text-muted-foreground uppercase block font-semibold">
              Duration
            </span>
            <span className="font-medium text-foreground block">{trip.duration}</span>
          </div>
          <div>
            <span className="text-[10px] text-muted-foreground uppercase block font-semibold">
              Status
            </span>
            <Badge
              variant="outline"
              className={`mt-0.5 text-[9px] uppercase font-bold ${statusBadges[trip.status]}`}
            >
              {trip.status}
            </Badge>
          </div>
        </div>

        <div className="grid gap-4 grid-cols-2 border-t border-border/50 pt-3">
          <div className="bg-muted/10 border border-border/50 rounded-lg p-2.5">
            <span className="text-[9px] text-muted-foreground uppercase font-bold tracking-wider block">
              Avg Speed
            </span>
            <span className="font-bold text-foreground text-sm block mt-0.5">
              {trip.avgSpeed} km/h
            </span>
          </div>
          <div className="bg-muted/10 border border-border/50 rounded-lg p-2.5">
            <span className="text-[9px] text-muted-foreground uppercase font-bold tracking-wider block">
              Max Speed
            </span>
            <span className="font-bold text-foreground text-sm block mt-0.5">
              {trip.maxSpeed} km/h
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
