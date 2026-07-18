import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import type { RouteOption } from '../navigation.types';

interface SimulatedMapHUDProps {
  selectedRoute: RouteOption;
  selectedRouteId: string;
  isNavigating: boolean;
  onStartNavigation: () => void;
}

export function SimulatedMapHUD({
  selectedRoute,
  selectedRouteId,
  isNavigating,
  onStartNavigation,
}: SimulatedMapHUDProps) {
  const trafficColors = {
    light: 'bg-success/20 text-success border-success/30',
    moderate: 'bg-warning/20 text-warning border-warning/30',
    heavy: 'bg-danger/20 text-danger border-danger/30',
  };

  return (
    <section
      aria-label="Simulated GPS Mapping Telemetry"
      className="rounded-xl border border-border bg-card p-6 shadow-sm flex flex-col justify-between min-h-[460px] relative overflow-hidden"
    >
      {/* Map visual placeholder styling resembling actual vector road nodes */}
      <div
        className="absolute inset-0 bg-slate-950 opacity-90 flex items-center justify-center"
        aria-hidden="true"
      >
        <svg className="w-full h-full opacity-35" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#334155" strokeWidth="0.5" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />

          <path
            d="M 0 100 Q 250 80 400 200 T 800 150"
            fill="none"
            stroke="#475569"
            strokeWidth="8"
          />
          <path d="M 100 0 L 250 450" fill="none" stroke="#475569" strokeWidth="6" />
          <path
            d="M 300 0 C 250 200 450 350 600 450"
            fill="none"
            stroke="#475569"
            strokeWidth="6"
          />

          {selectedRouteId === 'route-1' && (
            <path
              d="M 100 50 Q 250 80 400 200 T 700 300"
              fill="none"
              stroke="#10b981"
              strokeWidth="5"
              strokeDasharray="6"
              className="animate-[dash_10s_linear_infinite]"
            />
          )}
          {selectedRouteId === 'route-2' && (
            <path
              d="M 100 50 L 250 220 L 450 320 L 700 300"
              fill="none"
              stroke="#f59e0b"
              strokeWidth="5"
              strokeDasharray="6"
            />
          )}
          {selectedRouteId === 'route-3' && (
            <path
              d="M 100 50 C 200 150 250 320 600 320 L 700 300"
              fill="none"
              stroke="#ef4444"
              strokeWidth="5"
              strokeDasharray="6"
            />
          )}

          <circle cx="100" cy="50" r="8" fill="#3b82f6" />
          <circle cx="700" cy="300" r="8" fill="#ef4444" />
        </svg>

        <div className="absolute top-4 left-4 rounded-lg bg-slate-900/90 border border-slate-700 p-3 text-[10px] space-y-1 text-slate-300">
          <div className="font-bold uppercase tracking-wider text-slate-100 flex items-center gap-1">
            <span className="h-1.5 w-1.5 rounded-full bg-success"></span> GPS Connected
          </div>
          <div>Satellites: 9 (Simulated)</div>
          <div>Bearing: 114° SE</div>
        </div>

        <div className="absolute bottom-4 right-4 rounded-lg bg-slate-900/90 border border-slate-700 p-3 text-[10px] text-slate-400">
          <span>Visual simulation of vector map paths</span>
        </div>
      </div>

      {/* Foreground card overlays */}
      <div className="z-10 bg-slate-900/80 backdrop-blur-xs border border-slate-800 p-4 rounded-xl flex flex-col sm:flex-row justify-between sm:items-center gap-4 text-slate-100">
        <div>
          <span className="text-xs font-semibold text-slate-400 block uppercase tracking-wider">
            Selected Guidance Alternative
          </span>
          <span className="font-bold text-lg">{selectedRoute.name}</span>
        </div>
        <div className="flex gap-4 border-t border-slate-800 pt-2 sm:border-t-0 sm:pt-0">
          <div className="text-right">
            <span className="text-[10px] text-slate-400 block uppercase">Est. Distance</span>
            <span className="font-extrabold text-foreground">{selectedRoute.distance} km</span>
          </div>
          <div className="text-right pl-4 border-l border-slate-800">
            <span className="text-[10px] text-slate-400 block uppercase">Est. Duration</span>
            <span className="font-extrabold text-foreground">{selectedRoute.duration}</span>
          </div>
        </div>
      </div>

      {/* Lower dynamic logs */}
      <div className="z-10 bg-slate-900/80 backdrop-blur-xs border border-slate-800 p-4 rounded-xl space-y-4">
        <div className="grid gap-4 sm:grid-cols-2 text-slate-100">
          <div>
            <span className="text-[10px] text-slate-400 block uppercase font-semibold">
              Traffic Density
            </span>
            <Badge
              variant="outline"
              className={`mt-1 font-bold ${trafficColors[selectedRoute.trafficStatus]}`}
            >
              {selectedRoute.trafficStatus.toUpperCase()} TRAFFIC
            </Badge>
          </div>
          <div>
            <span className="text-[10px] text-slate-400 block uppercase font-semibold">
              Road Hazards
            </span>
            {selectedRoute.roadHazard ? (
              <span className="text-xs text-warning font-semibold block mt-1">
                ⚠️ {selectedRoute.roadHazard}
              </span>
            ) : (
              <span className="text-xs text-success block mt-1">
                ✓ No hazardous delays reported
              </span>
            )}
          </div>
        </div>

        <div className="border-t border-slate-800 pt-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-slate-400">
            Pressing Start simulates GPS-driven route calculations on screen.
          </p>
          <Button
            variant="primary"
            className="w-full sm:w-auto"
            onClick={onStartNavigation}
            disabled={isNavigating}
          >
            {isNavigating ? 'Guidance Session Active' : 'Start Simulated Guidance'}
          </Button>
        </div>
      </div>
    </section>
  );
}
