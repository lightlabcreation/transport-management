import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { MOCK_ROUTES, MOCK_RECENT_DESTINATIONS } from '../navigation.data';

interface RouteAlternativesProps {
  selectedRouteId: string;
  onSelectRoute: (id: string) => void;
  onClearRoute: () => void;
  origin: string;
  setOrigin: (val: string) => void;
  destination: string;
  setDestination: (val: string) => void;
  onRecentClick: (org: string, dest: string) => void;
}

export function RouteAlternatives({
  selectedRouteId,
  onSelectRoute,
  onClearRoute,
  origin,
  setOrigin,
  destination,
  setDestination,
  onRecentClick,
}: RouteAlternativesProps) {
  const trafficColors = {
    light: 'bg-success/20 text-success border-success/30',
    moderate: 'bg-warning/20 text-warning border-warning/30',
    heavy: 'bg-danger/20 text-danger border-danger/30',
  };

  return (
    <div className="space-y-6">
      {/* Input Planner Form */}
      <div className="rounded-xl border border-border bg-card p-6 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-body font-bold text-foreground">Trip Planner</h2>
          <Button variant="outline" size="sm" className="h-7 text-xs" onClick={onClearRoute}>
            Reset
          </Button>
        </div>
        <div className="space-y-3">
          <div>
            <label
              htmlFor="origin-normal-input"
              className="text-xs font-semibold text-muted-foreground block mb-1"
            >
              Origin
            </label>
            <Input
              id="origin-normal-input"
              value={origin}
              onChange={(e) => setOrigin(e.target.value)}
            />
          </div>
          <div>
            <label
              htmlFor="dest-normal-input"
              className="text-xs font-semibold text-muted-foreground block mb-1"
            >
              Destination
            </label>
            <Input
              id="dest-normal-input"
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Alternatives Selector */}
      <div className="rounded-xl border border-border bg-card p-6 shadow-sm space-y-4">
        <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
          Route Alternatives ({MOCK_ROUTES.length})
        </h3>
        <div className="space-y-3">
          {MOCK_ROUTES.map((route) => {
            const isSelected = route.id === selectedRouteId;
            return (
              <button
                key={route.id}
                onClick={() => onSelectRoute(route.id)}
                className={`w-full text-left p-3 rounded-xl border transition-all ${
                  isSelected
                    ? 'border-primary bg-primary/5 shadow-xs'
                    : 'border-border/50 hover:bg-muted/10 hover:border-muted'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-body-sm text-foreground">{route.name}</span>
                  <Badge
                    variant="outline"
                    className={`text-[9px] font-bold px-1.5 uppercase ${trafficColors[route.trafficStatus]}`}
                  >
                    {route.trafficStatus}
                  </Badge>
                </div>
                <div className="flex gap-4 mt-2 text-xs text-muted-foreground">
                  <span>Distance: {route.distance} km</span>
                  <span>Time: {route.duration}</span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Suggestions Panel */}
      <div className="rounded-xl border border-border bg-card p-6 shadow-sm space-y-3">
        <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
          Recent Alternatives
        </h3>
        <div className="space-y-2">
          {MOCK_RECENT_DESTINATIONS.slice(1).map((r) => (
            <button
              key={r.id}
              onClick={() => onRecentClick(r.origin, r.destination)}
              className="w-full text-left text-body-sm p-2 rounded-lg border border-border/50 hover:bg-muted/10 transition-all"
            >
              <span className="font-semibold block text-foreground">{r.label}</span>
              <span className="text-[10px] text-muted-foreground">From: {r.origin}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
