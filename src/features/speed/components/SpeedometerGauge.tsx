import { Badge } from '@/components/ui/badge';
import type { SpeedStatus } from '../speed-dashboard.types';

interface SpeedometerGaugeProps {
  currentSpeed: number;
  speedLimit: number;
  status: SpeedStatus;
  lastUpdated: string;
}

export function SpeedometerGauge({
  currentSpeed,
  speedLimit,
  status,
  lastUpdated,
}: SpeedometerGaugeProps) {
  const statusColors = {
    safe: {
      border: 'border-success/30',
      bg: 'bg-success/10',
      text: 'text-success',
      glow: 'shadow-[0_0_15px_rgba(34,197,94,0.15)]',
      badge: 'bg-success/20 text-success border-success/30',
    },
    'near-limit': {
      border: 'border-warning/30',
      bg: 'bg-warning/10',
      text: 'text-warning',
      glow: 'shadow-[0_0_15px_rgba(245,158,11,0.15)]',
      badge: 'bg-warning/20 text-warning border-warning/30',
    },
    'over-limit': {
      border: 'border-danger/30',
      bg: 'bg-danger/10',
      text: 'text-danger',
      glow: 'shadow-[0_0_20px_rgba(239,68,68,0.25)] animate-pulse',
      badge: 'bg-danger/20 text-danger border-danger/30',
    },
  };

  const theme = statusColors[status];

  return (
    <section
      aria-label="Current Speed Telemetry"
      className={`rounded-xl border ${theme.border} bg-card p-6 flex flex-col items-center justify-between ${theme.glow} transition-all duration-300 relative overflow-hidden`}
    >
      {/* Speed limit sign element */}
      <div className="absolute top-4 right-4 flex flex-col items-center justify-center w-12 h-12 rounded-full border-4 border-danger bg-white shadow-xs font-bold text-slate-900 text-lg">
        <span className="text-[10px] leading-none uppercase tracking-tighter text-slate-500 font-semibold">
          LIMIT
        </span>
        {speedLimit}
      </div>

      <div className="w-full">
        <h2 className="text-body-sm font-bold uppercase tracking-wider text-muted-foreground">
          Current Telemetry
        </h2>
        <p className="text-[11px] text-muted-foreground mt-0.5">Last active: {lastUpdated}</p>
      </div>

      {/* Gauge Display */}
      <div className="my-8 flex flex-col items-center justify-center relative">
        {/* SVG Dial Outline */}
        <svg className="w-48 h-48 transform -rotate-90" aria-hidden="true">
          <circle cx="96" cy="96" r="80" stroke="#1e293b" strokeWidth="12" fill="transparent" />
          <circle
            cx="96"
            cy="96"
            r="80"
            stroke={
              status === 'over-limit' ? '#ef4444' : status === 'near-limit' ? '#f59e0b' : '#10b981'
            }
            strokeWidth="12"
            fill="transparent"
            strokeDasharray={502.4}
            strokeDashoffset={502.4 - (502.4 * Math.min(currentSpeed, 120)) / 120}
            className="transition-all duration-500 ease-out"
          />
        </svg>

        <div className="absolute flex flex-col items-center justify-center">
          <span className="text-5xl font-black tracking-tight text-foreground">{currentSpeed}</span>
          <span className="text-xs font-bold tracking-widest text-muted-foreground uppercase mt-0.5">
            KM/H
          </span>
        </div>
      </div>

      {/* Status Presentation Label */}
      <div className="w-full text-center space-y-2">
        <Badge
          variant="outline"
          className={`px-3 py-1 font-semibold uppercase text-xs border ${theme.badge}`}
        >
          {status === 'over-limit'
            ? 'Speed Limit Exceeded'
            : status === 'near-limit'
              ? 'Approaching Limit'
              : 'Speed Under Control'}
        </Badge>
        <p className="text-body-sm text-muted-foreground">
          Limit is set to <span className="font-semibold text-foreground">{speedLimit} km/h</span>.
        </p>
      </div>
    </section>
  );
}
