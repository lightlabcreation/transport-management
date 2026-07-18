import type { WeeklySpeedTrendPoint } from '../speed-dashboard.types';

interface WeeklyTrendChartProps {
  trend: WeeklySpeedTrendPoint[];
}

export function WeeklyTrendChart({ trend }: WeeklyTrendChartProps) {
  return (
    <section
      aria-labelledby="trend-heading"
      className="rounded-xl border border-border bg-card p-6 shadow-sm flex flex-col justify-between"
    >
      <div className="flex items-center justify-between mb-4">
        <h2 id="trend-heading" className="text-body-sm font-bold uppercase tracking-wider text-muted-foreground">
          Weekly Speed Trend
        </h2>
        <span className="text-xs text-muted-foreground">Avg vs Max</span>
      </div>

      {/* Accessible Text Alternative for Chart */}
      <div className="sr-only">
        <h3>Weekly Speed Data Summary</h3>
        <ul>
          {trend.map((point) => (
            <li key={point.day}>
              {point.day}: Average speed {point.averageSpeed} km/h, Maximum speed {point.maxSpeed} km/h
            </li>
          ))}
        </ul>
      </div>

      {/* Graphical CSS Chart */}
      <div className="flex items-end justify-between h-36 pt-6 px-2 relative" aria-hidden="true">
        {/* Horizontal grid lines */}
        <div className="absolute inset-x-0 top-6 border-t border-border/40"></div>
        <div className="absolute inset-x-0 top-18 border-t border-border/40"></div>
        <div className="absolute inset-x-0 top-30 border-t border-border/40"></div>

        {trend.map((point) => (
          <div key={point.day} className="flex flex-col items-center group relative w-full">
            {/* Bar representing Max and Average Speed */}
            <div className="w-6 bg-slate-800 rounded-t-md h-28 flex flex-col justify-end overflow-hidden relative">
              {/* Max Speed Bar (Lighter Top) */}
              <div
                style={{ height: `${(point.maxSpeed / 120) * 100}%` }}
                className="w-full bg-slate-700/50 absolute bottom-0 left-0"
                title={`Max Speed: ${point.maxSpeed} km/h`}
              ></div>
              {/* Average Speed Bar (Solid Core) */}
              <div
                style={{ height: `${(point.averageSpeed / 120) * 100}%` }}
                className="w-full bg-primary/80 z-10 transition-all duration-300"
                title={`Avg Speed: ${point.averageSpeed} km/h`}
              ></div>
            </div>
            {/* Day label */}
            <span className="text-[10px] text-muted-foreground font-semibold mt-2">
              {point.day}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}
