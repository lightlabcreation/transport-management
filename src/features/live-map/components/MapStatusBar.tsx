interface MapStatusBarProps {
  onlineCount: number;
}

const statuses = [
  { label: 'Tracking', value: 'Simulated live' },
  { label: 'GPS', value: 'Demo signal ready' },
  { label: 'Current speed', value: '38 km/h' },
  { label: 'Location', value: 'Noida, Uttar Pradesh' },
] as const;

export function MapStatusBar({ onlineCount }: MapStatusBarProps) {
  return (
    <section
      aria-label="Live tracking summary"
      className="grid gap-3 sm:grid-cols-2 xl:grid-cols-5"
    >
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
