interface MapStatusBarProps {
  onlineCount: number;
  isLifeTrackingOn: boolean;
  onToggleLifeTracking: () => void;
}

const statuses = [
  { label: 'Tracking mode', value: 'Live Telemetry' },
  { label: 'GPS signal', value: 'Strong (Demo)' },
  { label: 'Current speed', value: '38 km/h' },
  { label: 'Location', value: 'Noida, Uttar Pradesh' },
] as const;

export function MapStatusBar({ onlineCount, isLifeTrackingOn, onToggleLifeTracking }: MapStatusBarProps) {
  return (
    <section
      aria-label="Live tracking summary"
      className="grid gap-3 sm:grid-cols-2 xl:grid-cols-6"
    >
      {/* Client Life Tracking ON/OFF Toggle Button */}
      <article className="flex flex-col justify-between rounded-lg border border-border bg-surface p-4 shadow-xs">
        <p className="text-body-sm text-muted-foreground font-medium">Life Tracking</p>
        <button
          type="button"
          onClick={onToggleLifeTracking}
          aria-label={isLifeTrackingOn ? 'Turn Life Tracking OFF' : 'Turn Life Tracking ON'}
          className={`mt-2 flex items-center justify-between gap-2 rounded-md px-3 py-1.5 text-body-sm font-semibold transition-all ${
            isLifeTrackingOn
              ? 'bg-primary text-primary-foreground shadow-xs hover:opacity-90'
              : 'bg-surface-muted text-muted-foreground border border-border hover:bg-border'
          }`}
        >
          <span className="flex items-center gap-1.5">
            <span className={`h-2.5 w-2.5 rounded-full ${isLifeTrackingOn ? 'bg-white animate-pulse' : 'bg-muted-foreground'}`} />
            {isLifeTrackingOn ? 'LIVE ON' : 'OFF'}
          </span>
          <span className="text-xs uppercase tracking-wider">{isLifeTrackingOn ? 'ACTIVE' : 'PAUSED'}</span>
        </button>
      </article>

      {statuses.map((status) => (
        <article key={status.label} className="rounded-lg border border-border bg-surface p-4">
          <p className="text-body-sm text-muted-foreground">{status.label}</p>
          <p className="mt-1 font-semibold">{status.value}</p>
        </article>
      ))}
      <article className="rounded-lg border border-border bg-surface p-4">
        <p className="text-body-sm text-muted-foreground">Online members</p>
        <p className="mt-1 font-semibold">{onlineCount} active now</p>
      </article>
    </section>
  );
}

