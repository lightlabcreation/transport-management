import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { MOCK_RECENT_DESTINATIONS } from '../navigation.data';

interface NavigationPlannerProps {
  origin: string;
  setOrigin: (val: string) => void;
  destination: string;
  setDestination: (val: string) => void;
  onFindRoutes: () => void;
  onRecentClick: (org: string, dest: string) => void;
}

export function NavigationPlanner({
  origin,
  setOrigin,
  destination,
  setDestination,
  onFindRoutes,
  onRecentClick,
}: NavigationPlannerProps) {
  return (
    <div className="space-y-6">
      {/* Input Form */}
      <div className="rounded-xl border border-border bg-card p-6 shadow-sm space-y-4">
        <h2 className="text-body font-bold text-foreground">Specify Destination</h2>
        <div className="space-y-3">
          <div>
            <label
              htmlFor="origin-input"
              className="text-xs font-semibold text-muted-foreground block mb-1"
            >
              Origin Point
            </label>
            <Input
              id="origin-input"
              value={origin}
              onChange={(e) => setOrigin(e.target.value)}
              placeholder="Enter starting location..."
            />
          </div>
          <div>
            <label
              htmlFor="dest-input"
              className="text-xs font-semibold text-muted-foreground block mb-1"
            >
              Destination Point
            </label>
            <Input
              id="dest-input"
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
              placeholder="Enter school, terminal or sector..."
            />
          </div>
        </div>
        <Button
          className="w-full"
          variant="primary"
          onClick={onFindRoutes}
          disabled={!origin.trim() || !destination.trim()}
        >
          Find Route Alternatives
        </Button>
      </div>

      {/* Suggestions Panel */}
      <div className="rounded-xl border border-border bg-card p-6 shadow-sm space-y-3">
        <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
          Recent Destinations
        </h3>
        <div className="space-y-2">
          {MOCK_RECENT_DESTINATIONS.map((r) => (
            <button
              key={r.id}
              onClick={() => onRecentClick(r.origin, r.destination)}
              className="w-full text-left text-body-sm p-2 rounded-lg border border-border/50 hover:bg-muted/10 hover:border-muted transition-all"
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
