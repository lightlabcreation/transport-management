import { Badge } from '@/components/ui/badge';
import type { TripRecord } from '../trips.types';

interface TripTableListProps {
  trips: TripRecord[];
  selectedTripId: string;
  onSelectTrip: (id: string) => void;
}

export function TripTableList({ trips, selectedTripId, onSelectTrip }: TripTableListProps) {
  const statusBadges = {
    completed: 'bg-success/20 text-success border-success/30',
    active: 'bg-info/20 text-info border-info/30',
    scheduled: 'bg-slate-700/20 text-slate-400 border-slate-700/30',
  };

  return (
    <div className="space-y-4">
      {/* Mobile Card Layout (Visible only on small screens) */}
      <div className="md:hidden space-y-3">
        {trips.map((trip) => {
          const isSelected = trip.id === selectedTripId;
          return (
            <article
              key={trip.id}
              onClick={() => onSelectTrip(trip.id)}
              className={`rounded-xl border p-4 transition-all hover:bg-muted/10 cursor-pointer ${
                isSelected ? 'border-primary bg-primary/5 shadow-xs' : 'border-border'
              }`}
            >
              <div className="flex items-start justify-between gap-2">
                <span className="font-semibold text-body-sm text-foreground block">
                  {trip.routeLabel}
                </span>
                <Badge
                  variant="outline"
                  className={`shrink-0 text-[9px] font-bold uppercase ${statusBadges[trip.status]}`}
                >
                  {trip.status}
                </Badge>
              </div>

              <div className="grid gap-2 grid-cols-2 mt-3 text-xs text-muted-foreground">
                <div>
                  <span className="block font-medium">Driver: {trip.driverLabel}</span>
                  <span className="block text-[10px]">Bus: {trip.vehicleLabel}</span>
                </div>
                <div className="text-right">
                  <span className="block font-semibold text-foreground">{trip.distance} km</span>
                  <span className="block text-[10px]">Time: {trip.startTime}</span>
                </div>
              </div>
            </article>
          );
        })}
      </div>

      {/* Desktop Table Layout (Visible only on medium/large screens) */}
      <div className="hidden md:block overflow-x-auto rounded-xl border border-border bg-card">
        <table className="w-full text-left text-body-sm border-collapse min-w-[700px]">
          <thead>
            <tr className="border-b border-border/40 text-muted-foreground font-semibold bg-muted/5">
              <th className="p-3">Route Details</th>
              <th className="p-3">Driver / Bus</th>
              <th className="p-3">Start / End</th>
              <th className="p-3">Distance</th>
              <th className="p-3">Duration</th>
              <th className="p-3 text-right">Status</th>
            </tr>
          </thead>
          <tbody>
            {trips.map((trip) => {
              const isSelected = trip.id === selectedTripId;
              return (
                <tr
                  key={trip.id}
                  onClick={() => onSelectTrip(trip.id)}
                  className={`border-b border-border/40 hover:bg-muted/10 transition-colors cursor-pointer ${
                    isSelected ? 'bg-primary/5 font-medium' : ''
                  }`}
                >
                  <td className="p-3">
                    <span className="font-semibold text-foreground block">{trip.routeLabel}</span>
                    <span className="text-[10px] text-muted-foreground">Date: {trip.date}</span>
                  </td>
                  <td className="p-3">
                    <span className="block text-foreground">{trip.driverLabel}</span>
                    <span className="text-[10px] text-muted-foreground block">
                      {trip.vehicleLabel}
                    </span>
                  </td>
                  <td className="p-3">
                    <span className="block text-foreground">{trip.startTime}</span>
                    <span className="text-[10px] text-muted-foreground block">{trip.endTime}</span>
                  </td>
                  <td className="p-3 font-semibold text-foreground">{trip.distance} km</td>
                  <td className="p-3">{trip.duration}</td>
                  <td className="p-3 text-right">
                    <Badge
                      variant="outline"
                      className={`text-[9px] font-bold uppercase ${statusBadges[trip.status]}`}
                    >
                      {trip.status}
                    </Badge>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
