import type { GroupSummaryStats } from '../groups.types';

interface GroupSummaryProps {
  stats: GroupSummaryStats;
}

interface StatCardProps {
  label: string;
  value: number;
  colorClass: string;
}

function StatCard({ label, value, colorClass }: StatCardProps) {
  return (
    <div className="rounded-lg border border-border bg-card p-4 shadow-sm">
      <p className="text-body-sm text-muted-foreground">{label}</p>
      <p className={`mt-1 text-heading-md font-bold ${colorClass}`}>{value}</p>
    </div>
  );
}

export function GroupSummary({ stats }: GroupSummaryProps) {
  return (
    <section aria-label="Summary" className="grid grid-cols-2 gap-3 md:grid-cols-4">
      <StatCard label="Total Groups" value={stats.total} colorClass="text-foreground" />
      <StatCard label="Active" value={stats.active} colorClass="text-success" />
      <StatCard label="Pending" value={stats.pending} colorClass="text-warning" />
      <StatCard label="Suspended" value={stats.suspended} colorClass="text-danger" />
    </section>
  );
}
