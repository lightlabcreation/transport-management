import { Badge } from '@/components/ui/badge';
import type { DrivingSession } from '../speed-dashboard.types';

interface RecentSessionsListProps {
  sessions: DrivingSession[];
}

export function RecentSessionsList({ sessions }: RecentSessionsListProps) {
  return (
    <section
      aria-labelledby="recent-activity-heading"
      className="rounded-xl border border-border bg-card p-5 shadow-sm space-y-4"
    >
      <div className="flex items-center justify-between border-b border-border/50 pb-3">
        <h2 id="recent-activity-heading" className="text-body font-bold text-foreground">
          Recent Driving Sessions
        </h2>
        <Badge variant="outline" className="text-xs font-semibold px-2 py-0.5">
          Total: {sessions.length}
        </Badge>
      </div>

      {sessions.length === 0 ? (
        <div className="py-8 text-center text-muted-foreground space-y-2">
          <svg
            className="h-10 w-10 mx-auto text-muted-foreground/55"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <p className="text-body-sm">No recent driving sessions recorded in the system.</p>
        </div>
      ) : (
        <div className="overflow-x-auto -mx-5 px-5">
          <table className="w-full text-left text-body-sm border-collapse min-w-[500px]">
            <thead>
              <tr className="border-b border-border/40 text-muted-foreground font-semibold">
                <th className="pb-2">Vehicle / Trip Label</th>
                <th className="pb-2">Avg Speed</th>
                <th className="pb-2">Max Speed</th>
                <th className="pb-2">Duration</th>
                <th className="pb-2 text-right">Status</th>
              </tr>
            </thead>
            <tbody>
              {sessions.map((session) => (
                <tr
                  key={session.id}
                  className="border-b border-border/40 hover:bg-muted/10 transition-colors"
                >
                  <td className="py-3 font-semibold text-foreground">{session.label}</td>
                  <td className="py-3">{session.averageSpeed} km/h</td>
                  <td className="py-3 font-medium text-foreground">{session.maxSpeed} km/h</td>
                  <td className="py-3">{session.duration}</td>
                  <td className="py-3 text-right">
                    <span className="inline-flex items-center rounded-full bg-success/20 border border-success/30 px-2 py-0.5 text-xs font-medium text-success capitalize">
                      {session.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}
